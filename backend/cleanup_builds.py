import os
import shutil
import stat

BUILDS_DIR = os.path.join(os.path.dirname(__file__), "builds")

def handle_remove_readonly(func, path, exc_info):
    """Forcefully change permissions and retry deletion."""
    os.chmod(path, stat.S_IWRITE)
    func(path)

def clear_builds():
    if not os.path.exists(BUILDS_DIR):
        print(f"[ERROR] Directory {BUILDS_DIR} does not exist.")
        return

    deleted = 0
    for item in os.listdir(BUILDS_DIR):
        path = os.path.join(BUILDS_DIR, item)
        if os.path.isdir(path):
            try:
                shutil.rmtree(path, onerror=handle_remove_readonly)
                print(f"[✔] Deleted: {path}")
                deleted += 1
            except Exception as e:
                print(f"[!] Failed to delete {path}: {e}")

    if deleted == 0:
        print("[INFO] No build folders found to delete.")
    else:
        print(f"[INFO] Total deleted build folders: {deleted}")

if __name__ == "__main__":
    clear_builds()

