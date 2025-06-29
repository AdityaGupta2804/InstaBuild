import sys
import os
from git_utils import clone_repo
from yaml_parser import get_build_steps
from executor import run_command
from logger import write_log
from status_tracker import init_status, update_step_status, finish_status
from docker_executor import run_in_docker
def main():
    # print(sys.argv)
    # print(len(sys.argv))
    if len(sys.argv) < 3:
        print("Usage: python3 main.py <repo_url> <build_id>")
        return

    repo_url = sys.argv[1]
    build_id = sys.argv[2]

    ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    build_path = os.path.join(ROOT_DIR, 'builds', build_id)

    # build_path = f"builds/{build_id}"
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

    steps = get_build_steps(os.path.join(code_path, ".mini-ci.yml"))
    if not steps:
        write_log(logs_path, "[ERROR] Failed to parse .mini-ci.yml")
        finish_status(status_path, "FAILED")
        return

    for step in steps:
        write_log(logs_path, f"[STEP] {step['name']}")
        update_step_status(status_path, step['name'], "RUNNING")

        # result = run_command(step['run'], logs_path, cwd=code_path)
        result = run_in_docker(step['run'], code_path, logs_path)

        if result:    
            update_step_status(status_path, step['name'], "SUCCESS")
        else:
            update_step_status(status_path, step['name'], "FAILED")
            finish_status(status_path, "FAILED")
            return

    finish_status(status_path, "SUCCESS")

if __name__ == "__main__":
    main()

