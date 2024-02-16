const express = require('express');
const axios = require('axios');

const router = express.Router();

router.post('/', async (req, res) => {
    console.log(JSON.stringify(req.body));
    const { user, temperature, battery, message } = req.body;
    console.log(`User: ${user}, Temperature: ${temperature}, Battery: ${battery}, Message: ${message}`);
    let url;
    try {
        url = alertUrl(user);
        console.log(`Sending alert to ${url}`)
    } catch (ReferenceError) {
        console.log(ReferenceError.message);
        res.status(400).json({ success: false, error: `Invalid user: ${user}` });
        return;
    }

    try {
        // Make a request to the Discord API
        const response = await axios.post(url, {
            content: `Temperature: ${temperature}, Battery: ${battery}, Message: ${message}`
        });

        // console.log(response.status);
        res.status(200).json({ success: true });
    } catch (AxiosError) {
        console.log(AxiosError.message)
        const { delay, status } = handleAxiosError(AxiosError);

        console.log(`Retry in ${delay}s`);
        const responseBody = {
            success: false,
            error: 'Failed to send Discord message',
            retry: delay
        };

        res.status(status).json(responseBody);
    }
    res.send();
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

const alertUrl = (user) => {
    userSecrets = userLookup(user);
    return `https://discord.com/api/webhooks/${userSecrets.id}/${userSecrets.key}`;
}

const userLookup = (user) => {
    id = process.env[`${user}_DISCORD_WEBHOOK_ID`];
    key = process.env[`${user}_DISCORD_KEY`];
    if (!id || !key) {
        const message = `No Discord webhook found for user ${user}`;
        console.error(message);
        throw new ReferenceError(message);
    }
    return {
        id: id,
        key: key
    };
}

module.exports = router;