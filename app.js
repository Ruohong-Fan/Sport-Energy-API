//'use strict';

// Load module dependencies.
var SwaggerExpress = require('swagger-express-mw'),
  app = require('express')(),
  cors = require('cors'),
  bodyParser = require('body-parser');

var config = {
  appRoot: __dirname // required config
};

//enable all cors requests
app.use(cors());

// Create the application.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//importing route
var routes = require('./api/routes/sportEnergyRoute');
//register the route
routes(app);

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);

  var port = process.env.PORT || 8111;
  app.listen(port);

  console.log('My RESTful API server started on: ' + port);
});

module.exports = app;
