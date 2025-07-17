import requests

def deploy_to_render(project_path, hook_url):
    try:
        print(f"[INFO] Triggering Render deploy for path: {project_path}")

        response = requests.post(hook_url)

        if response.status_code == 200:
            print("[SUCCESS] Render deployment triggered successfully.")
            return "Render deployment triggered"
        else:
            print(f"[ERROR] Failed to trigger Render deployment: {response.text}")
            return None

    except Exception as e:
        print(f"[EXCEPTION] Render deploy error: {str(e)}")
        return None
