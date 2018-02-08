var conf = require('./config');
var io = require('socket.io-client');

function getSource() {
    return conf.dataSource;
}

function getPair(tradingPair) {
    switch (tradingPair) {
        case 'btceur':
            return 'btc_eur';
        case 'bcheur':
            return 'bch_eur';
        case 'btgeur':
            return 'btg_eur';
        case 'etheur':
            return 'eth_eur';
        default:
            return null;
    }
}

function createTrade(data) {
    trade = {
        src: getSource(),
        action: 'trade',
        type: data['order_type'],
        pair: getPair(data['trading_pair']),
        total_amount: data['amount'],
        single_price: data['price'],
        origin_data: data
    };

    return trade;
}

function createRemove(data) {
    remove = {
        src: getSource(),
        action: 'remove',
        type: data['order_type'],
        pair: getPair(data['trading_pair']),
        origin_data: data
    };

    return remove;
}

function createAdd(data) {
    add = {
        src: getSource(),
        action: 'add',
        type: data['order_type'],
        pair: getPair(data['trading_pair']),
        total_amount: data['amount'],
        min_amount: data['min_amount'],
        single_price: data['price'],
        origin_data: data
    };

    return add;
}

function run(cb) {
    if (typeof io != null) {
        var socket = io.connect(conf.endpointURL, {port: conf.endpointPort});

        if (typeof socket != null) {
            socket.on('connect', function () {
                console.log('consumer connected to "' + conf.endpointURL + ':' + conf.endpointPort + '"');
            });

            socket.on('disconnect', function () {
            });

            socket.on('remove_order', function (order) {
                // A trade occurred
                if (order['amount'] != null && order['price'] != null) {
                    cb(createTrade(order));
                } else {
                    cb(createRemove(order));
                }

            });

            socket.on('add_order', function (order) {
                cb(createAdd(order));
            });
        }
    }
}

exports.run = run;
