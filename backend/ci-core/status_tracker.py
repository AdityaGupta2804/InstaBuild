import json
import os

def init_status(status_path):
    status_data = {
        "status": "RUNNING",
        "steps": {}
    }
    with open(status_path, 'w') as f:
        json.dump(status_data, f, indent=2)

def update_step_status(status_path, step_name, step_status):
    if not os.path.exists(status_path):
        print("[ERROR] status.json not found.")
        return

    with open(status_path, 'r') as f:
        data = json.load(f)

    data["steps"][step_name] = step_status

    with open(status_path, 'w') as f:
        json.dump(data, f, indent=2)

def finish_status(status_path, final_status):
    if not os.path.exists(status_path):
        print("[ERROR] status.json not found.")
        return

    with open(status_path, 'r') as f:
        data = json.load(f)

    data["status"] = final_status

    with open(status_path, 'w') as f:
        json.dump(data, f, indent=2)
