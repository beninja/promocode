module.exports = function(app) {
  const express = require('express');
  const mongoose = require('mongoose');
  const bodyParser = require('body-parser');
  const jwt = require('jsonwebtoken');

  const promocodeController = require('./controllers/promocode.controller');

  var Promocode = require('./models/promocode.model');

  mongoose.connect("mongodb://<promocodeuser>:<promopassword2018>@ds147974.mlab.com:47974/heroku_hk4g3gzd");
  app.set('superSecret', process.env.secret);

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  var apiRoutes = express.Router();

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
  apiRoutes.get('/', function(req, res) {
    res.json('welcome to Promocode API');
  });

  //Phase routes
  apiRoutes.post('/promocodes', promocodeController.createPromocode);
  apiRoutes.post('/promocodes/validations', promocodeController.validatePromocode);

  apiRoutes.use(function(req,res,next){

    var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers['authorization'];

    if (token && token.indexOf('Bearer ') !== -1) {
      token = token.replace('Bearer ', '');
    }
    if (token) {
      jwt.verify(token, app.get('superSecret'), function(err, decoded) {
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

  //User routes
  // apiRoutes.get('/users', userController.getAllUser);

  app.use('/', apiRoutes);
}
