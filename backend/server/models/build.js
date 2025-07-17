const mongoose = require('mongoose');

const buildSchema = new mongoose.Schema({
    buildId: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: 'pending',
    },
    deploymentUrls: {
        frontend: { type: String, default: null },
        backend: { type: String, default: null },
    },
    tokensUsed: {
        frontend: { type: String, default: null },
        backend: { type: String, default: null },
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('Build', buildSchema,'job');
