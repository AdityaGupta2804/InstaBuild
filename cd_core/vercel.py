import os
import subprocess
import shutil
import re

def deploy_to_vercel(path, token=None):
    print(f"[CD] Deploying frontend to Vercel...")
    abs_path = os.path.abspath(path)
    print(f"[CD] Path: {abs_path}")
    if token:
        print(f"[CD] Token: {token[:4]}****")

    try:
        # Ensure path exists
        if not os.path.isdir(abs_path):
            raise RuntimeError(f"Invalid path: '{abs_path}' does not exist or is not a directory")

        # Locate Vercel CLI
        vercel_cli = shutil.which("vercel")
        if vercel_cli is None:
            raise RuntimeError("Vercel CLI not found. Is it installed and in your PATH?")

        # Set up environment
        env = os.environ.copy()
        if token:
            env["VERCEL_TOKEN"] = token

        # Run deployment
        result = subprocess.run(
            [vercel_cli, "--prod", "--yes"],
            cwd=abs_path,
            env=env,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )

        # Handle result
        if result.returncode == 0:
            print("[SUCCESS] Vercel deployment completed successfully.")
            print(result.stdout)

            # Extract deployment URL from stdout
            match = re.search(r"https://[^\s]+\.vercel\.app", result.stdout)
            if match:
                return match.group(0)
            return True  # fallback

        else:
            print("[ERROR] Vercel deployment failed.")
            print(result.stderr)
            return False

    except Exception as e:
        print(f"[CD] Exception during Vercel deploy: {e}")
        return False
