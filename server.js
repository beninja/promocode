require('dotenv').config()

const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const morgan = require('morgan');

const port = process.env.PORT || 8080;

app.use(morgan('combined'));

require('./routes')(app, io);

const server = http.listen(port);
console.log('Promocode API is up at http://localhost/' + port);

module.exports = server;
