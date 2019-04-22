
const express = require('express');
const axios = require('axios');

const _buildRoute = (uriMapping, handlers) => {
    const router = express.Router();

    router.use(async (req, res, next) => {
        const requestedUri = req.url.split('/', 2)[1];
        const targetUri = req.url.slice(requestedUri.length + 1);
        const targetUrl = uriMapping[requestedUri] + targetUri;

        const currentResult = await _fetchUrl(req, targetUrl);

        for (const handler of handlers) {
            await handler(currentResult);
        }

        res.set(currentResult.headers);
        res.status(currentResult.status);
        res.send(currentResult.data).end();

        next();
    });

    return router;
}

const _fetchUrl = async (req, url) => {
    try {
        const result = await axios({
            method: req.method.toLowerCase(),
            url: url,
            data: req
        });

        return result;
    }
    catch (error) {
        return error.response;
    }
}

module.exports = {
    build: _buildRoute
};
