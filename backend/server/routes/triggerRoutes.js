const express = require('express');
const router = express.Router();
const triggerBuild = require('../controllers/triggerController');

router.post('/trigger', triggerBuild);

module.exports = router;
