
const express = require('express');

const config = require('./config');
const routeBuilder = require('./route-builder.js');

const handlers = [
    require('./handlers/xml-to-json.js')
];

const app = express();

app.use(routeBuilder.build(config.uriMapping, handlers));

app.listen(8080);
