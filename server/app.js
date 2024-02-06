const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

// modules
const index = require('./routes/index');
// const alert = require('./routes/alert');

// serve static files
app.use(express.static(path.join(__dirname, './public')));

// middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// express routes
// app.use('/alert', alert);
app.use('/', index);

// start server
app.set('port', process.env.PORT || 5000);
app.listen(app.get('port'), function() {
  console.log('listening on port ', app.get('port'));
});
