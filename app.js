//'use strict';

var SwaggerExpress = require('swagger-express-mw'),
  app = require('express')(),
  cors = require('cors'),
  bodyParser = require('body-parser');

module.exports = app; // for testing

var config = {
  appRoot: __dirname // required config
};

//enable all cors requests
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//created model loading here
var sportLeaderAccount = require('./api/models/sportEnergyAccountModel');
var sportLeaderTransaction = require('./api/models/sportEnergyTransactionModel');

//importing route
var routes = require('./api/routes/sportEnergyRoute');
//register the route
routes(app);

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);

  var port = process.env.PORT || 10011;
  app.listen(port);

  console.log('My RESTful API server started on: ' + port);
});
