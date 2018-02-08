var conf = require('./config');
var server = require('http').createServer();
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({server: server});
var express = require('express');
var app = express();
var port = conf.serverPort;
var webSocket = null;

app.use(function (req, res) {
    res.send({});
});

wss.on('connection', function connection(ws) {
    webSocket = ws;
});

server.on('request', app);

function broadcast(message) {
    if (webSocket != null) {
        webSocket.send(message);
    }
}

function run(callback) {
    server.listen(port, function () {
        console.log('producer listening on ' + server.address().address + ":" + server.address().port)

        callback(broadcast);
    });
}

exports.run = run;
