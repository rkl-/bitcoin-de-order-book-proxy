var dataSource = 'bitcoin.de';
var endpointURL = process.env.BITCOIN_DE_WS_URL;
var endpointPort = process.env.BITCOIN_DE_WS_PORT;
var serverPort = process.env.SERVER_PORT;

if (typeof endpointURL !== 'string') {
    console.error('environment variable "BITCOIN_DE_WS_URL" is not set');
    process.exit(1);
}
if (typeof endpointPort !== 'string') {
    console.error('environment variable "BITCOIN_DE_WS_PORT" is not set');
    process.exit(2);
}
if (typeof serverPort !== 'string') {
    console.error('environment variable "SERVER_PORT" is not set');
    process.exit(3);
}

exports.dataSource = dataSource;
exports.endpointURL = endpointURL;
exports.endpointPort = endpointPort;
exports.serverPort = serverPort;
