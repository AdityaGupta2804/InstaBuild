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

module.exports = router;