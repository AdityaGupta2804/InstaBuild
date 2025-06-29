import subprocess

def run_command(command, log_path, cwd="."):
    try:
        with open(log_path, 'a') as log_file:
            log_file.write(f"\n$ {command}\n")

            process = subprocess.Popen(
                command,
                shell=True,
                cwd=cwd,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True
            )

            # Stream output in real-time
            for line in process.stdout:
                log_file.write(line)
                log_file.flush()

            process.wait()

            if process.returncode == 0:
                return True
            else:
                log_file.write(f"[ERROR] Command failed with code {process.returncode}\n")
                return False

    except Exception as e:
        with open(log_path, 'a') as log_file:
            log_file.write(f"[EXCEPTION] {str(e)}\n")
        return False
