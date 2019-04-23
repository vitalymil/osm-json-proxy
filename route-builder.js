
const express = require('express');
const axios = require('axios');
const fs = require('fs');
const log = require('./log.js');

const _buildHandlersRoute = (routesListFilePath, handlers) => {
    const uriMapping = _buildRoutesMapping(routesListFilePath);
    const router = express.Router();

    router.use(async (req, res, next) => {
        log.write('info', `got url: ${req.url}`, { method: req.method });
        const requestedUri = req.url.split('/', 2)[1];

        if (!uriMapping[requestedUri]) {
            res.status(404);
            next(`url mapping for "${requestedUri}" not found`);

            return;
        }

        const targetUri = req.url.slice(requestedUri.length + 1);
        const targetUrl = uriMapping[requestedUri] + targetUri;

        log.write('debug', `fetching url`, { 
            source: req.url, 
            target: targetUrl, 
            method: req.method 
        });

        const currentResult = await _fetchUrl(req, targetUrl);

        for (const handler of handlers) {
            await handler(currentResult);
        }

        log.write('debug', `sending result`, { 
            status: currentResult.status,
            source: req.url,
            target: targetUrl,
            method: req.method
        });

        res.set(currentResult.headers);
        res.status(currentResult.status);
        res.send(currentResult.data).end();

        next();
    });

    return router;
};

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
};

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

const __buildErrorsRoute = () => {
    return (error, _, res, next) => {
        if (!error) {
            return;
        }

        log.write('error', error, { status: res.statusCode });
        res.send(error).end();

        next();
    }
};

module.exports = {
    buildHandlers: _buildHandlersRoute,
    buildErrors: __buildErrorsRoute
};
