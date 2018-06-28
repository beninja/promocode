module.exports = function(app, io) {
  const express = require('express');
  const mongoose = require('mongoose');
  const bodyParser = require('body-parser');
  const jwt = require('jsonwebtoken');

  const promocodeController = require('./controllers/promocode.controller');

  const Promocode = require('./models/promocode.model');

  mongoose.connect(process.env.DATABASE);
  app.set('superSecret', process.env.SECRET);

  const apiRoutes = express.Router();

  apiRoutes.get('/admin', (req, res) => {
    res.sendFile(__dirname + '/template/index.html');
  });

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  io.on('connection', (socket) => {
  console.log('admin connected');
  socket.on('disconnect', () => {
    console.log('admin disconnected');
  });
});

  //Middleware CORS
  apiRoutes.use(function(req,res,next){
    res.contentType('application/json');

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Access-Control-Allow-Origin');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
  });

  //unauthenticate routes
  apiRoutes.get('/', (req, res) => {
    res.json('welcome to Promocode API');
  });


  //Phase routes
  apiRoutes.post('/promocodes', (req, res) => {
    promocodeController.createPromocode(req, res, io);
  });
  apiRoutes.post('/promocodes/validations', (req, res) => {
    promocodeController.validatePromocode(req, res, io);
  });

  apiRoutes.use((req,res,next) => {

    var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers['authorization'];

    if (token && token.indexOf('Bearer ') !== -1) {
      token = token.replace('Bearer ', '');
    }
    if (token) {
      jwt.verify(token, app.get('superSecret'), (err, decoded) => {
        if (err) {
          return res.json({ success: false, message: 'Failed to authenticate token.'})
        } else {
          req.decode = decoded;
          next();
        }
      })
    } else {
      return res.status(403).send({
        success: false,
        message: 'No token provided.'
      });
    }

  });

  //authenticate routes

  app.use('/', apiRoutes);
}
