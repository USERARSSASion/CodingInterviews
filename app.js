const express = require('express');
const path = require('path');
const compression = require('compression');
const app = express();
const http = require('http').Server(app);
const xmlparser = require('express-xml-bodyparser');
const cookieParser = require('cookie-parser');
const favicon = require('serve-favicon');
const bodyParser=require('body-parser');
const cluster = require("cluster");
const useragent = require('express-useragent');

//文件操作对象
const fs = require('fs');
//时间格式化
// const moment = require('moment');
const port = process.env.PORT || 80;
const expressOption = {
    maxAge: '1d'
};

// models loading
const models_path = __dirname + '/app/models';
const walk = function(path) {
    fs
        .readdirSync(path)
        .forEach(function(file) {
            const newPath = path + '/' + file;
            const stat = fs.statSync(newPath);

            if (stat.isFile()) {
                if (/(.*)\.(js|coffee)/.test(file)) {
                    require(newPath)
                }
            }
            else if (stat.isDirectory()) {
                walk(newPath)
            }
        })
};
walk(models_path);
require('./app/models/db/db');
app.set('showStackError', true);
app.set('views', './app/views');
app.set('view engine', 'ejs');
// app.use(favicon('./public/img/favicon2.ico'));
app.use(express.static(path.join(__dirname, 'public'), expressOption));
app.use(bodyParser.json({ limit : "100mb"}));
app.use(bodyParser.urlencoded({limit: '100mb', extended: false }));
app.use(useragent.express());
app.use(xmlparser());
app.use(cookieParser());

const startListener=function(){
    const numCPUs = 1;

    if(cluster.isMaster){
        console.log("[master1] " + "start master......");
        for(let i=0; i < numCPUs; i++){
            cluster.fork();
        }

        cluster.on("listening", function(worker, address){
            console.log("[master] " + "listening: worker " + worker.id + ", pid:"+worker.process.pid + ",Address:" + address.address + ":" + address.port);
        });

        cluster.on("exit", function(worker, code, signal){
            console.log('worker ' + worker.process.pid + ' died');
            cluster.fork();
        });

        cluster.on('death', function(worker) {
            console.log('worker ' + worker.pid + ' died. restart...');
            cluster.fork();
        });
    }else{
        http.listen(port);
    }
};
app.use(compression());
require('./app/config/routes')(app);

/**
 * 路由错误处理
 */
app.use(function (err, req, res, next) {
    if (err.message && (~err.message.indexOf('not found') || (~err.message.indexOf('Cast to ObjectId failed')))) {
        return next()
    }
    console.error(err.stack, '500');
    res.status(500).render('500')
});

app.use(function (req, res) {
    // console.log(`404 => ${req.url}`);
    res.status(404).render('404', { url: req.originalUrl })
});

startListener();