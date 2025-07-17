import yaml
import os

def parse_yaml_config(yaml_path):
    if not os.path.exists(yaml_path):
        print(f"[ERROR] YAML file not found at: {yaml_path}")
        return None

    try:
        with open(yaml_path, 'r') as file:
            data = yaml.safe_load(file)

        result = {}

        # CI steps
        if "steps" in data:
            result["steps"] = data["steps"]
        else:
            print("[WARNING] 'steps' key not found in YAML.")
            result["steps"] = []

        # CD deploy config (optional)
        if "deploy" in data:
            result["deploy"] = data["deploy"]
        else:
            result["deploy"] = {}

        return result

    except Exception as e:
        print(f"[EXCEPTION] Failed to parse YAML: {str(e)}")
        return None
    