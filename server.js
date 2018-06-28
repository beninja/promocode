var express = require('express');
var app = express();
var morgan = require('morgan');

var port = process.env.PORT || 8080;

app.use(morgan('combined'));

require('./routes')(app);

var server = app.listen(port);
console.log('Promocode API is up at http://localhost/' + port + '/api/');

module.exports = server;
