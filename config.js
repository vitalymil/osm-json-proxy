
const config = {
    integration: {
        uriMapping: {
            osm: 'https://www.openstreetmap.org',
            overpass: 'https://overpass-api.de'
        }
    }
}

module.exports = config[process.env['NODE_ENV'] || 'integration'];