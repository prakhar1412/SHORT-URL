const express = require('express');
const {
    handlegenerateNewShortURL,
    handleGetShortURL,
    handleGetAnalytics,
} = require('../controllers/url');

const router = express.Router();

router.post('/', handlegenerateNewShortURL);
router.get('/:shortId', handleGetShortURL);
router.get('/analytics/:shortId', handleGetAnalytics);


module.exports = router;