import yaml
import os

def get_build_steps(yaml_path):
    if not os.path.exists(yaml_path):
        print(f"[ERROR] YAML file not found at: {yaml_path}")
        return None

    try:
        with open(yaml_path, 'r') as file:
            data = yaml.safe_load(file)

        if "steps" not in data:
            print("[ERROR] 'steps' key not found in YAML.")
            return None

        return data["steps"]

    except Exception as e:
        print(f"[EXCEPTION] Failed to parse YAML: {str(e)}")
        return None
