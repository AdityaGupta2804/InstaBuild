const { spawn } = require('child_process');
const Build = require('../models/build');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs').promises;
const {sendDiscordNotification} = require('../utils/notifier');
const triggerBuild = async (req, res) => {
    const { repoUrl } = req.body;

    if (!repoUrl) {
        return res.status(400).json({ error: 'repoUrl is required' });
    }

    const buildId = uuidv4();
    const build = new Build({ buildId });
    await build.save();

    const scriptPath = path.join(__dirname, '../../ci-core/main.py');
    const python = spawn('python', [scriptPath, repoUrl, buildId]);

    python.stdout.on('data', (data) => {
        console.log(`Python output: ${data}`);
    });

    python.stderr.on('data', (data) => {
        console.error(`Python error: ${data}`);
    });

    // python.on('close', (code) => {
    //     console.log(`Python process exited with code ${code}`);
    // });
    python.on('close', async (code) => {
        console.log(`Python process exited with code ${code}`);
        try {
            const buildDir = path.join(__dirname, `../../builds/${buildId}`);
            const statusJson = await fs.readFile(path.join(buildDir, 'status.json'), 'utf8');
            const statusData = JSON.parse(statusJson);
            await Build.findOneAndUpdate({ buildId }, { status: statusData.status });
            console.log(`Build ${buildId} status updated to ${statusData.status}`);
            await sendDiscordNotification(buildId,statusData.status,repoUrl);
        } catch (error) {
            console.error(`Error updating status for build ${buildId}:`, error);
        }
    });

    res.json({ message: 'Build triggered', buildId });
};

module.exports = triggerBuild;
