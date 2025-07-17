import subprocess

def run_in_docker(command, code_path, logs_path):
    docker_cmd = [
        "docker", "run",
        "--rm",
        "-v", f"{code_path}:/app",        # Mount code into /app
        "-w", "/app",                     # Set working directory inside container
        "node:18",                    # Use desired base image
        "bash", "-c", command             # Command to run
    ]

    with open(logs_path, "a") as log_file:
        process = subprocess.Popen(docker_cmd, stdout=log_file, stderr=log_file)
        process.wait()
        return process.returncode == 0
