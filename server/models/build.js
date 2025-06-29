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
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('Build', buildSchema,'job');
