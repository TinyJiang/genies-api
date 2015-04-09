'use strict'
var express = require('express'),
    path = require('path'),
    ejs = require('ejs');

var routes = require('./routers'),
    index = require('./index');

var app = express();

app.engine('html', ejs.renderFile);

app.set('view engine', 'ejs');
app.set('views', '../webapp/views');

app.use(express.static(path.join(__dirname, '../webapp')));

app.use('/', routes);

index.init();

app.listen(3000);