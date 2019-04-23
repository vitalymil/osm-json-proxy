
const express = require('express');

const routeBuilder = require('./route-builder.js');
const handlers = [
    require('./handlers/xml-to-json.js')
];

const app = express();
const port = Number(process.env.PORT) || 8080;
const routesFilePath = process.env.ROUTES_LIST_PATH ||
    `${process.env.NODE_ENV || 'integration'}.routes`;

app.use(routeBuilder.build(routesFilePath, handlers));
app.listen(port, () => {
    console.log(`listenning on port ${port}`);
});
