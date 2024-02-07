const express = require('express');

const health = require('./api/health');
const alert = require('./api/alert');

const router = express.Router();

router.use('/health', health)
router.use('/alert', alert)

module.exports = router;