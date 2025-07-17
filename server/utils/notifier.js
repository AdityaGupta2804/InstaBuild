const axios = require('axios');

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

async function sendDiscordNotification(buildId, status, repoUrl) {
    const message = {
        content: `🚀 **Mini Jenkins Build Notification**\n**Build ID:** ${buildId}\n**Status:** ${status === "SUCCESS" ? "✅ SUCCESS" : "❌ FAILED"}\n**Repo:** ${repoUrl}\nCheck Logs: http://localhost:5173/build/${buildId}`,
    };

    try {
        await axios.post(DISCORD_WEBHOOK_URL, message);
        console.log('✅ Discord notification sent');
    } catch (err) {
        console.error('❌ Failed to send Discord notification', err.message);
    }
}

module.exports = { sendDiscordNotification };
