const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config(); // load .env variables

const bodyParser = require('body-parser');

// modules
const index = require('./routes/index');
const api = require('./routes/api');

// serve static files
app.use(express.static(path.join(__dirname, './public')));

// middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// express routes
app.use('/', index);
app.use('/api', api);

// start server
app.set('port', process.env.PORT || 5000);
app.listen(app.get('port'), function() {
  console.log('listening on port ', app.get('port'));
});
