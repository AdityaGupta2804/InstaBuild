const express = require('express');
const connectDB = require('./config/db.js');
const triggerRoute = require('./routes/triggerRoutes.js');
const buildRoute = require('./routes/buildRoutes.js');
const cors = require('cors');
const authRoutes = require('./routes/auth');



require('dotenv').config();

const app = express();


// Middleware
app.use(express.json());
app.use(cors());
app.use('/api/auth', authRoutes);
// Connect DB
connectDB();

// Routes
app.use('/api', triggerRoute);
app.use('/api', buildRoute);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0',() => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
