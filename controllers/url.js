const { nanoid } = require("nanoid");

// In-memory store: shortID → { redirectURL, visitHistory: [{timestamp}] }
const urlStore = new Map();

function handlegenerateNewShortURL(req, res) {
    try {
        const body = req.body;
        if (!body.url) return res.status(400).json({ error: "URL is required" });

        let shortID;
        if (body.customAlias) {
            if (urlStore.has(body.customAlias)) {
                return res.status(400).json({ error: "Alias already in use" });
            }
            shortID = body.customAlias;
        } else {
            shortID = nanoid(8);
        }

        urlStore.set(shortID, {
            redirectURL: body.url,
            visitHistory: [],
            createdAt: Date.now(),
        });

        return res.json({ Id: shortID });
    } catch (err) {
        console.error('Error generating short URL:', err.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

function handleGetShortURL(req, res) {
    try {
        const shortId = req.params.shortId;
        const entry = urlStore.get(shortId);
        if (!entry) return res.status(404).send('URL not found');

        // Log the visit
        entry.visitHistory.push({ timestamp: Date.now() });

        res.redirect(entry.redirectURL);
    } catch (err) {
        console.error('Error redirecting short URL:', err.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

function handleGetAnalytics(req, res) {
    try {
        const shortId = req.params.shortId;
        const result = urlStore.get(shortId);
        if (!result) return res.status(404).json({ error: "Short ID not found" });

        return res.json({
            totalClicks: result.visitHistory.length,
            analytics: result.visitHistory,
        });
    } catch (err) {
        console.error('Error fetching analytics:', err.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    handlegenerateNewShortURL,
    handleGetShortURL,
    handleGetAnalytics,
};

