const { nanoid } = require("nanoid");
const URL = require('../models/url');

async function handlegenerateNewShortURL(req, res) {
    const body = req.body;
    if (!body.url) return res.status(400).json({ error: "URL is required" });

    let shortID;
    if (body.customAlias) {
        const existing = await URL.findOne({ shortID: body.customAlias });
        if (existing) {
            return res.status(400).json({ error: "Alias already in use" });
        }
        shortID = body.customAlias;
    } else {
        shortID = nanoid(8);
    }

    await URL.create({
        shortID: shortID,
        redirectURL: body.url,
        visitHistory: [],
    });
    return res.json({ Id: shortID });
}

async function handleGetShortURL(req, res) {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
        { shortID: shortId },
        {
            $push: {
                visitHistory: {
                    timestamp: Date.now(),
                },
            },
        }
    );
    if (!entry) return res.status(404).send('URL not found');
    res.redirect(entry.redirectURL);
}

async function handleGetAnalytics(req, res) {
    const shortId = req.params.shortId;
    const result = await URL.findOne({ shortID: shortId });
    if (!result) return res.status(404).json({ error: "Short ID not found" });
    return res.json({
        totalClicks: result.visitHistory.length,
        analytics: result.visitHistory,
    });
}

module.exports = {
    handlegenerateNewShortURL,
    handleGetShortURL,
    handleGetAnalytics,
};