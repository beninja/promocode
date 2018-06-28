//Get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Promocode', new Schema({
  name: String,
  avantage: {
    percent: {
      type: Number,
      min: 0,
      max: 100,
    },
  },
  restrictions: {
    "@or": [{
      "@age": {
        eq: Number,
        gt: Number,
        lt: Number
      }
    }],
    "@and": [{
      "@age": {
        eq: Number,
        gt: Number,
        lt: Number
      }
    }],
    "@meteo": {
      is: String,
      temp: {
        gt: Number
      }
    },
    "@date": {
      after: Date,
      before: Date
    },
  }
}));
