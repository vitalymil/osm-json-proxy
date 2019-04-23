
const express = require('express');
const axios = require('axios');
const fs = require('fs');

const _buildRoute = (routesListFilePath, handlers) => {
    const uriMapping = _buildRoutesMapping(routesListFilePath);
    const router = express.Router();

    router.use(async (req, res, next) => {
        const requestedUri = req.url.split('/', 2)[1];

        if (!uriMapping[requestedUri]) {
            res.status(404);
            next(`url mapping for "${requestedUri}" not found\n` + 
            `avaliable mappings:\n${JSON.stringify(uriMapping, null, 2)}`);

            return;
        }

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

const _buildRoutesMapping = (routesListFilePath) => {
    const routesMapping = 
        fs.readFileSync(routesListFilePath, 'utf8')
          .split('\n')
          .map(routeMap => routeMap.split(/[ \t]+/)
                                   .filter(_ => _.length > 0));

    return routesMapping.reduce((mapObject, curMapArray) => {
        mapObject[curMapArray[0]] = curMapArray[1];

        return mapObject;
    }, {});
};

module.exports = {
    build: _buildRoute
};
