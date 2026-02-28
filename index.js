const express = require('express');
const path = require('path');
const { connectToMongoDB } = require('./connect');
const urlRoutes = require('./routes/url');
const app = express();

const PORT = process.env.PORT || 8001;
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/short-url';

// Wrap in async IIFE so MongoDB errors don't become unhandled rejections (which crash Vercel)
(async () => {
    try {
        await connectToMongoDB(MONGO_URI);
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("Failed to connect to MongoDB:", err.message);
    }
})();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public'))); // Absolute path — required for Vercel
app.use("/url", urlRoutes);

// Start server only in local development (not on Vercel)
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => { console.log(`Server is running on http://localhost:${PORT}`); });
}

module.exports = app;
