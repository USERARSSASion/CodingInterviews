var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const fs = require('fs');

const db = mongoose.connect(`mongodb://localhost/link`, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true });

/**
 * 连接成功
 */
mongoose.connection.once('open', function () {
    fs.writeFileSync('./sendTel.json', JSON.stringify({ send: false }, null, "\t"), {flag: 'w'});
});

/**
 * 连接异常
 */
mongoose.connection.on('error',async function (err) {
    console.log('Mongoose connection error: ' + err);
});

/**
 * 连接断开
 */
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose connection disconnected');
});
