const express = require('express');
const { handleGenerateNewShortURL, handleGetAnalytics } = require('../controllers/urls');
const router = express.Router();

router.route("/").post(handleGenerateNewShortURL);
router.route("/analytics/:shortID").get(handleGetAnalytics);

module.exports = router;