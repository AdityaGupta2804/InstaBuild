import subprocess
import os
import stat
def handle_remove_readonly(func, path, _):
    os.chmod(path, stat.S_IWRITE)
    func(path)
def clone_repo(repo_url, target_dir):
    try:
        if os.path.exists(target_dir):
            print(f"[INFO] Directory {target_dir} already exists. Deleting and re-cloning...")
            # return True
            import shutil
            shutil.rmtree(target_dir,onerror=handle_remove_readonly)

        result = subprocess.run(
            ["git", "clone", repo_url, target_dir],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )

        if result.returncode == 0:
            print("[INFO] Git repo cloned successfully.")
            return True
        else:
            print("[ERROR] Git clone failed:")
            print(result.stderr)
            return False

    except Exception as e:
        print(f"[EXCEPTION] Cloning failed: {str(e)}")
        return False
