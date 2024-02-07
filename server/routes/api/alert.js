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
    } catch (AxiosError) {
        const { delay, status } = handleAxiosError(AxiosError);

        console.log(`Retry in ${delay}s`);
        const responseBody = {
            success: false,
            error: 'Failed to send Discord message',
            retry: delay
        };

        res.status(status).json(responseBody);
    }
});

const handleAxiosError = (AxiosError) => {
    let status = 500;
    console.error(AxiosError.code);
    if (AxiosError.response) {
        console.error(AxiosError.response.data);
        console.error(AxiosError.response.status);
        console.error(AxiosError.response.headers);
        status = AxiosError.response.status;
    }

    let delay = 6000;

    if (AxiosError.response.status === 429) {
        delay = AxiosError.response.headers['retry-after'];
    };

    return { delay, status };
};

module.exports = router;