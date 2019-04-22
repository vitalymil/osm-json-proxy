
const osmtogeojson = require('osmtogeojson');
const xmldom = require('xmldom');

const xmlDomParser = new xmldom.DOMParser();

module.exports = (xmlResponse) => {
    if (xmlResponse.status < 300) {
        const xmlDom = xmlDomParser.parseFromString(xmlResponse.data);
        const result = osmtogeojson(xmlDom);

        xmlResponse.data = result;
        xmlResponse.headers['Content-Type'] = 'application/json';
    }
}