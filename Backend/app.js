//npm run devStart
var createError = require('http-errors');
var express = require('express');
var path = require('path');
const db = require('./db');
const fs = require('fs');
const xml2js = require('xml2js');
const mysql = require('mysql');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var cartRouter = require('./routes/cart');
const mainRouter = require('./routes/main');
const session = require('express-session');
const bodyParser = require('body-parser');
const axios = require('axios');
var app = express();

app.engine('ejs', require('ejs').__express);
app.locals.escape = false

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/static', express.static(path.join(__dirname, 'node_modules/nouislider/distribute')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: 'snerionag1r6hbn8', // Change this to a random string
  resave: false,
  saveUninitialized: true,
//   cookie : {secure : true},
  proxy: true
}));
app.use('/', indexRouter);
app.use('/cart', cartRouter);
app.use('/Main', mainRouter);

app.get("/", (req, res) => {
    res.sendFile(__dirname + '/index.html');
}) 
app.get('/static/nouislider.min.css', (req, res) => {
    res.type('text/css');
    res.sendFile(path.join(__dirname, 'node_modules/nouislider/distribute/nouislider.min.css'));
  });

  const cssFilePath = path.join(__dirname, 'node_modules/nouislider/distribute/nouislider.min.css');
  console.log(`Absolute path to CSS file: ${cssFilePath}`);
  
  
// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });
// Function to fetch XML data from URL
async function fetchXmlData(url) {
  try {
      const response = await axios.get(url);
      return response.data;
  } catch (error) {
      console.error('Error fetching XML data:', error);
      throw error;
  }
}

// URL of the XML file
const xmlUrl = 'https://bkgrupe.lt/XML/prdct_fd_instaltec240131.xml';

// Fetch XML data from the URL
fetchXmlData(xmlUrl)
  .then(xmlData => {
      // Parse XML to JavaScript object
      xml2js.parseString(xmlData, (err, result) => {
          if (err) {
              console.error('Error parsing XML:', err);
              return;
          }
          // Extract products from parsed XML object
          const products = result.CATALOG.PRODUCT;
          // Iterate over products and insert into MySQL table if not already exists
          products.forEach((product) => {
              // Your existing code to insert products into MySQL database
              // ...
          });
      });
  })
  .catch(error => {
      console.error('Error fetching XML data:', error);
  });

app.listen(8000)
module.exports = app;