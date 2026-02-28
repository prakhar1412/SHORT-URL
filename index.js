const express = require('express');
const path = require('path');
const urlRoutes = require('./routes/url');
const app = express();

const PORT = process.env.PORT || 8001;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/url', urlRoutes);

// Start server only in local development (not on Vercel)
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => { console.log(`Server is running on http://localhost:${PORT}`); });
}

module.exports = app;


