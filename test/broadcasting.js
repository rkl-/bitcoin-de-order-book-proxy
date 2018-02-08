process.env.BITCOIN_DE_WS_URL = 'https://ws.bitcoin.de';
process.env.BITCOIN_DE_WS_PORT = '443';
process.env.SERVER_PORT = '8080';

var expect = require('chai').expect;
var consumer = require('../consumer');
var producer = require('../producer');
var webSocket = require('ws');


describe('Test broadcasting of produced data (timeout after 30 seconds).', function () {
    it('#run()', function (done) {
        this.timeout(30000);

        var seenOpenMessage = false;
        var seenActions = {};

        producer.run(function (broadcast) {
            consumer.run(function (data) {
                const jsonEncodedData = JSON.stringify(data);
                const serverUrl = 'ws://localhost:' + process.env.SERVER_PORT;
                const ws = new webSocket(serverUrl);

                broadcast(jsonEncodedData);

                ws.on('open', function () {
                    if (!seenOpenMessage) {
                        console.log('test client connected to "localhost:' + process.env.SERVER_PORT + '"');
                        seenOpenMessage = true;
                    }
                });

                ws.on('message', function (message) {
                    const data = JSON.parse(message);
                    const action = data['action'];
                    const pair = data['pair'];
                    const type = data['type'];

                    expect(action).to.be.string;
                    expect(action).to.be.oneOf(['trade', 'remove', 'add']);

                    expect(pair).to.be.string;
                    expect(pair).to.be.oneOf(['btc_eur', 'bch_eur', 'btg_eur', 'eth_eur']);

                    expect(type).to.be.string;
                    expect(type).to.be.oneOf(['buy', 'sell', null]);

                    expect(data['origin_data']).to.be.a('object');

                    if (type === 'trade' || type === 'add') {
                        expect(data['total_amount']).to.satisfy(function (n) {
                            return parseFloat(n);
                        }, 'data[\'total_amount\'] must be numeric');

                        expect(data['single_price']).to.satisfy(function (n) {
                            return parseFloat(n);
                        }, 'data[\'single_price\'] must be numeric');
                    }

                    if (type === 'add') {
                        expect(data['min_amount']).to.satisfy(function (n) {
                            return parseFloat(n);
                        }, 'data[\'min_amount\'] must be numeric');
                    }

                    seenActions[action] = true;

                    console.log('got "' + action + '"');

                    if (seenActions['trade'] && seenActions['remove'] && seenActions['add']) {
                        done();
                        process.exit(0);
                    }
                });
            });
        });
    });
});
