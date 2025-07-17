import os
from .vercel import deploy_to_vercel
from .render import deploy_to_render

def deploy_project(deploy_config, base_dir):
    deployment_results = {}

    for target in ['frontend', 'backend']:
        config = deploy_config.get(target)
        if not config:
            continue  # Skip if not defined

        platform = config.get("platform")
        rel_path = config.get("path")
        token = config.get("token")  # Token is optional (esp. for Vercel)

        if not platform or not rel_path:
            print(f"[ERROR] Missing platform or path for {target}")
            deployment_results[target] = {
                "status": "failed",
                "reason": "Missing platform or path"
            }
            continue

        # Construct absolute path relative to the cloned repo
        full_path = os.path.join(base_dir, rel_path)
        print(f"[INFO] Deploying {target} to {platform} from path: {full_path}")

        # Dispatch deployment
        if platform == "vercel":
            url = deploy_to_vercel(full_path, token)
        elif platform == "render":
            url = deploy_to_render(full_path, token)
        else:
            print(f"[ERROR] Unknown deployment platform: {platform}")
            url = None

        # Save result
        if url:
            deployment_results[target] = {"status": "success", "url": url}
        else:
            deployment_results[target] = {
                "status": "failed",
                "reason": f"{platform} deployment error"
            }

    return deployment_results
