const express = require('express');
const router = express.Router();
const Build = require('../models/build.js');
const fs = require('fs').promises;
const path = require('path');

router.get('/builds', async (req, res) => {
    try {
        const builds = await Build.find().select('buildId status createdAt');
        res.json(builds);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching builds' });
    }
});

router.get('/builds/:id', async (req, res) => {
    try {
        const build = await Build.findOne({ buildId: req.params.id });
        if (!build) return res.status(404).json({ message: 'Build not found' });

        const buildDir = path.join(__dirname, `../../builds/${build.buildId}`);
        const [status, logs] = await Promise.all([
            fs.readFile(path.join(buildDir, 'status.json'), 'utf8'),
            fs.readFile(path.join(buildDir, 'logs.txt'), 'utf8')
        ]);

        res.json({
            buildId: build.buildId,
            status: JSON.parse(status),
            logs
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching build details' });
    }
});

router.get('/logs/:id/download', async (req, res) => {
    const buildId = req.params.id;

    try {
        const build = await Build.findOne({ buildId });

        if (!build) {
            return res.status(404).json({ message: 'Build not found' });
        }

        // Construct full absolute path to logs.txt
        const logsPath = path.join(__dirname, '..', '..', 'builds', buildId, 'logs.txt');

        if (!fs.readFile(logsPath)) {
            return res.status(404).json({ message: 'Logs file not found' });
        }

        // Send the file
        res.download(logsPath, `logs-${buildId}.txt`, (err) => {
            if (err) {
                res.status(500).json({ message: 'Error sending file' });
            } else {
                console.log("✅ Logs sent successfully");
            }
        });

    } catch (err) {
        res.status(500).json({ message: 'Error downloading logs' });
    }
});

router.post('/update-deployment', async (req, res) => {
    const { buildId, frontendUrl, backendUrl } = req.body;

    if (!buildId) {
        return res.status(400).json({ error: 'buildId is required' });
    }

    try {
        const updatedBuild = await Build.findOneAndUpdate(
            { buildId },
            {
                $set: {
                    'deploymentUrls.frontend': frontendUrl || null,
                    'deploymentUrls.backend': backendUrl || null,
                },
            },
            { new: true }
        );

        if (!updatedBuild) {
            return res.status(404).json({ message: 'Build not found' });
        }

        res.status(200).json({ message: 'Deployment URLs updated', data: updatedBuild });
    } catch (err) {
        res.status(500).json({ error: 'Server error', details: err.message });
    }
});


module.exports = router;