const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const { connectToMongoDB } = require('./connect');
const urlRoutes = require('./routes/url');
const app = express();

const PORT = process.env.PORT || 8001;
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/short-url';

// Cached connection — reused across warm Vercel invocations
let isConnected = false;

async function ensureDBConnected() {
    if (isConnected && mongoose.connection.readyState === 1) return;
    await connectToMongoDB(MONGO_URI);
    isConnected = true;
    console.log('Connected to MongoDB');
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Connect to DB before every API request (no-op if already connected)
app.use('/url', async (req, res, next) => {
    try {
        await ensureDBConnected();
        next();
    } catch (err) {
        console.error('DB connection failed:', err.message);
        res.status(503).json({ error: 'Database unavailable. Check MONGODB_URI env variable.' });
    }
});

app.use('/url', urlRoutes);

// Start server only in local development (not on Vercel)
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => { console.log(`Server is running on http://localhost:${PORT}`); });
}

module.exports = app;

