
import axios from "axios";

export const triggerBuild = async ({
  repoUrl,
  vercel_token,
  render_hook,
}: {
  repoUrl: string;
  vercel_token: string;
  render_hook: string;
}) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/trigger`,
      {
        repoUrl,
        vercel_token,
        render_hook,
      }
    );

    return response.data; // contains buildId, status etc.
  } catch (error: any) {
    console.error("Trigger build error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Build trigger failed");
  }
};
