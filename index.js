const express = require('express');
const { connectToMongoDB } = require('./connect');
const urlRoutes = require('./routes/url');
const app = express();

const PORT = process.env.PORT || 8001;
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/short-url';

connectToMongoDB(MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Failed to connect to MongoDB", err));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public')); // Serve static files
app.use("/url", urlRoutes);

// Start server only in local development (not on Vercel)
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => { console.log(`Server is running on http://localhost:${PORT}`); });
}

module.exports = app;
