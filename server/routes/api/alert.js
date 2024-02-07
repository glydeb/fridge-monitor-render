const express = require('express');
const axios = require('axios');

const router = express.Router();
const { DISCORD_WEBHOOK_ID, DISCORD_KEY } = process.env;
const url = `https://discord.com/api/webhooks/${DISCORD_WEBHOOK_ID}/${DISCORD_KEY}`;

router.post('/', async (req, res) => {
    const { temperature, battery, message } = req.body;

    try {
        // Make a request to the Discord API
        const response = await axios.post(url, {
            content: `Temperature: ${temperature}, Battery: ${battery}, Message: ${message}`
        });

        console.log(response.data);
        res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Failed to send Discord message' });
    }
});

module.exports = router;