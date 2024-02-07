const express = require('express');

const health = require('./api/health');

const router = express.Router();

router.use('/health', health)

module.exports = router;