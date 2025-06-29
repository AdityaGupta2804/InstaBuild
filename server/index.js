const express = require('express');
const connectDB = require('./config/db.js');
const triggerRoute = require('./routes/triggerRoutes.js');
const buildRoute = require('./routes/buildRoutes.js');
const cors = require('cors');

require('dotenv').config();

const app = express();


// Middleware
app.use(express.json());
app.use(cors());
// Connect DB
connectDB();

// Routes
app.use('/api', triggerRoute);
app.use('/api', buildRoute);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
