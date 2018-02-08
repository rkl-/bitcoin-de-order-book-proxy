var consumer = require('./consumer');
var producer = require('./producer');

producer.run(function (broadcast) {
    consumer.run(function (data) {
        broadcast(JSON.stringify(data));
    })
});
