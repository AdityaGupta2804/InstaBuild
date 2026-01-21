

import requests
import sys
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', 'server', '.env'))
CI_BACKEND_URL = os.getenv("CI_BACKEND_URL", "http://localhost:5000")

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.append(ROOT_DIR)

from git_utils import clone_repo
from yaml_parser import parse_yaml_config
from executor import run_command
from logger import write_log
from status_tracker import init_status, update_step_status, finish_status
from docker_executor import run_in_docker
from cd_core.deploy_handler import deploy_project


def fetch_tokens_from_backend(build_id):
    try:
        url = f"{CI_BACKEND_URL}/api/builds/{build_id}"
        res = requests.get(url)
        res.raise_for_status()
        data = res.json()
        tokens = data.get("tokensUsed", {})
        return tokens.get("frontend"), tokens.get("backend")
    except Exception as e:
        print(f"[ERROR] Failed to fetch tokens from backend: {e}")
        return None, None


def main():
    if len(sys.argv) < 3:
        print("Usage: python3 main.py <repo_url> <build_id>")
        return

    repo_url = sys.argv[1]
    build_id = sys.argv[2]

    build_path = os.path.join(ROOT_DIR, 'builds', build_id)
    code_path = os.path.join(build_path, "code")
    logs_path = os.path.join(build_path, "logs.txt")
    status_path = os.path.join(build_path, "status.json")

    os.makedirs(code_path, exist_ok=True)
    init_status(status_path)

    success = clone_repo(repo_url, code_path)
    if not success:
        write_log(logs_path, "[ERROR] Git clone failed")
        finish_status(status_path, "FAILED")
        return

    config = parse_yaml_config(os.path.join(code_path, ".mini-ci.yml"))
    if not config:
        write_log(logs_path, "[ERROR] Failed to parse .mini-ci.yml")
        finish_status(status_path, "FAILED")
        return

    steps = config.get("steps", [])
    for step in steps:
        write_log(logs_path, f"[STEP] {step['name']}")
        update_step_status(status_path, step['name'], "RUNNING")

        result = run_in_docker(step['run'], code_path, logs_path)

        if result:
            update_step_status(status_path, step['name'], "SUCCESS")
        else:
            update_step_status(status_path, step['name'], "FAILED")
            finish_status(status_path, "FAILED")
            return

    finish_status(status_path, "SUCCESS")
    write_log(logs_path, "[CI] Build steps completed.")

    # === CD Phase ===
    deploy_config = config.get("deploy", {})
    if deploy_config:
        write_log(logs_path, "[CD] Starting deployment phase...")

        # 🔥 FETCH TOKENS from MongoDB
        frontend_token, backend_token = fetch_tokens_from_backend(build_id)
        if frontend_token:
            deploy_config.setdefault("frontend", {})["token"] = frontend_token
        if backend_token:
            deploy_config.setdefault("backend", {})["token"] = backend_token

        deploy_results = deploy_project(deploy_config, base_dir=code_path)

        for target, result in deploy_results.items():
            status = result.get("status")
            url = result.get("url", "")
            write_log(logs_path, f"[CD] {target} ➜ {status} {url}")

        # Store deployment results to DB
        frontend_url = deploy_results.get('frontend', {}).get('url')
        backend_url = deploy_results.get('backend', {}).get('url')

        try:
            res = requests.post(f"{CI_BACKEND_URL}/api/update-deployment", json={
                "buildId": build_id,
                "frontendUrl": frontend_url,
                "backendUrl": backend_url,
            })
            if res.status_code == 200:
                write_log(logs_path, "[DB] Deployment metadata saved to MongoDB.")
            else:
                write_log(logs_path, f"[DB] Failed to save deployment metadata: {res.text}")
        except Exception as e:
            write_log(logs_path, f"[DB] Error while saving deployment metadata: {str(e)}")

    else:
        write_log(logs_path, "[CD] No deployment section found in YAML.")


if __name__ == "__main__":
    main()
