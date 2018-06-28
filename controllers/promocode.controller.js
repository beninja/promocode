const Promocode = require('../models/promocode.model');
const weather = require('openweather-apis');
const moment = require('moment');

weather.setLang('en');
weather.setAPPID('d0562f476913da692a065c608d0539f6');

function getWeatherData() {
  return new Promise((resolve, reject) => {
    weather.getAllWeather((err, JSONObj) => {
        if (!err) {
          resolve(JSONObj);
        } else {
          console.log(err);
          reject(err);
        }
    });
  });
}
function validatePromocode(req, res) {
  Promocode.findOne({ name: req.body.promocode_name })
    .then((promocode) => {
      if (promocode) {
        weather.setCity(req.body.arguments.meteo.town);
        getWeatherData().then((weather) => {
          const age = req.body.arguments.age;
          const meteoRestriction = weather.weather[0].main.toLowerCase() === promocode.restrictions['@meteo'].is;
          // const dateRestriction = moment().format()
          const beforeDate = moment(promocode.restrictions['@date'].before);
          const afterDate = moment(promocode.restrictions['@date'].after);
          const dateRestriction = beforeDate > moment() && afterDate < moment();
          // const ageRestriction = false;
          // const customerAge = parseInt(req.body.arguments.age);
          // if (promocode.restrictions['@or']) {
          //   promocode.restrictions['@or'].map((orClause) => {
          //     if (orClause['@age'].eq) {
          //       console.log(customerAge === orClause['@age'].eq);
          //       ageRestriction = (customerAge === orClause['@age'].eq);
          //     }
          //     if (orClause['@age'].lt) {
          //       ageRestriction = customerAge < orClause['@age'].lt;
          //     }
          //     if (orClause['@age'].gt) {
          //       ageRestriction = customerAge > orClause['@age'].lt;
          //     }
          //   });
          // }
          if (meteoRestriction && dateRestriction) {
            return res.json({
              promocode_name: promocode.name,
              status: 'accepted',
              avantage: promocode.avantage,
            });
          } else {
            const reasons = {};
            if (!meteoRestriction) {
              reasons.meteo = 'isNotClear'
            }
            if (!dateRestriction) {
              reasons.date = 'Outdated';
            }
            return res.json({
              promocode_name: promocode.name,
              status: 'denied',
              reasons: reasons
            });
          }
        })
        .catch((error) => {
          res.status(503)
          return res.json({ message: "Le service n'est pas disponible" });
        });
      } else {
        res.status(404);
        return res.json({ message: 'Le promocode est invalide' });
      }
    });
}

function createPromocode(req, res) {
  console.log(req.body);
  const newPromocode = new Promocode({
    name: req.body.name,
    avantage: req.body.avantage,
    restrictions: req.body.restrictions
  });

  newPromocode.save((err) => {
    if (err) {
      return res.json({ success: false, message: err});
    } else {
      return res.json({ success: true, message: 'Promocode ajouté' });
    }
  });
}

module.exports = {
  createPromocode,
  validatePromocode,
}
