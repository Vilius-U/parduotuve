var express = require('express');
var router = express.Router();
var connection = require('../db'); // Assuming db.js is located in the parent directory
var Paysera = require('paysera-nodejs');
const axios = require('axios');
const crypto = require('crypto');
const request = require('request');
const cors = require('cors');
const session = require('express-session');
const {
  createProxyMiddleware
} = require('http-proxy-middleware');

const payseraProxy = createProxyMiddleware({
  target: 'https://paysera.com', // Set the target URL of the Paysera API
  changeOrigin: true, // Change the origin of the host header to the target URL
  pathRewrite: {
    '^/api/paysera': '', // Remove the '/api/paysera' prefix from the request path
  },
});

const corsOptions = {
  origin: 'http://localhost:3000'
};

router.use('/api/paysera', payseraProxy);
router.use(cors(corsOptions));
router.use(session({
  resave: false, // set resave to false
  saveUninitialized: true, // set saveUninitialized to true or false based on your requirement
  secret: 'your-secret-key',
  secure: false,
  sameSite: 'none', // provide a secret key for session encryption
  // other options...
}));

var options = {
  projectid: '241977',
  sign_password: '2ece43ae64a6d8da7b88b71be40f7b13',
  accepturl: 'http://instalika.lt',
  cancelurl: 'http://instalika.lt',
  callbackurl: 'http://instalika.lt',
  test: 1
};

const paysera = new Paysera(options);

/* GET users listing. */
router.post('/add', (req, res) => {
  const productId = req.body.itemId;

  // Check if productId is a number
  if (isNaN(productId)) {
    return res.status(400).json({
      error: 'Invalid product ID'
    });
  }
  
  req.session.cart = req.session.cart || [];
  if (!req.session.cart.includes(productId)) {
    req.session.cart.push(productId);
  } else {
    console.log('Item already in cart');
  }

  console.log(req.session.cart);
  const cartQuery = `SELECT * FROM prekes WHERE id IN (${req.session.cart.join(',')})`;
  console.log(cartQuery);
  console.log('searching for items')

  connection.query(cartQuery, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      return res.status(500).json({
        error: 'Internal Server Error'
      });
    }
    res.json({
      cart: results
    });
  });
});


router.post('/remove', (req, res) => {
  try {

    const itemId = req.body.itemId;
    
    if (!isNaN(itemId)) {
      if (!req.session.cart) {
        // If req.session.cart is undefined, return an empty cart
        return res.json({ cart: [] });
      }
      
      const productId = itemId;
      const index = req.session.cart.indexOf(productId);
      
      // Check if the item exists in the cart
      if (index !== -1) {
        req.session.cart.splice(index, 1);
      } else {
        // If the item doesn't exist, return the current cart
        const cartQuery = `SELECT * FROM prekes WHERE id IN (${req.session.cart.join(',')})`;
        connection.query(cartQuery, (error, results) => {
          if (error) {
            console.error('Error executing query:', error);
            return res.status(500).json({
              error: 'Internal Server Error'
            });
          }
          res.json({
            cart: results
          });
        });
        return; // Exit the function
      }
    
      if (req.session.cart.length > 0) {
        const cartQuery = `SELECT * FROM prekes WHERE id IN (${req.session.cart.join(',')})`;
        connection.query(cartQuery, (error, results) => {
          if (error) {
            console.error('Error executing query:', error);
            return res.status(500).json({
              error: 'Internal Server Error'
            });
          }
          res.json({
            cart: results
          });
        });
      } else {
        res.json({
          cart: []
        });
      }
    } else {
      // Return a 400 Bad Request response if itemId is not a number
      res.status(400).json({
        error: 'Invalid product ID'
      });
    }
    
    
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      error: 'Internal Server Error'
    });
  }
});
router.get('/items', (req, res) => {
  res.json({
    cart: req.session.cart
  });
})








// GET route to render the cart page
router.get('/', (req, res) => {
  const cartItems = req.session.cart || [];
  const total = cartItems.length;

  let cartQuery = '';
  let prekesQuery = '';
  if (cartItems.length > 0) {
    cartQuery = `SELECT SUM(PRICE) AS total_price FROM prekes WHERE id IN (${cartItems.join(',')});`; // Join cartItems array to form comma-separated IDs
    prekesQuery = `SELECT * FROM prekes WHERE id IN (${cartItems.join(',')});`; // Join cartItems array to form comma-separated IDs
  } else {
    cartQuery = 'SELECT 0 AS total_price'; // If cartItems array is empty, return 0 as total price
  }

  console.log("Items in Cart:", cartItems); // Log the items array for debugging

  if (prekesQuery !== '') {
    // Execute the query to fetch cart items only if prekesQuery is not empty
    connection.query(cartQuery, (err, cartResult) => {
      if (err) {
        console.error('Error selecting total price from MySQL:', err);
        return res.status(500).send('Internal Server Error');
      }

      // Get the total price from the result
      const totalPrice = cartResult[0].total_price;

      // Execute the query to fetch cart items
      connection.query(prekesQuery, (err, prekesResult) => {
        if (err) {
          console.error('Error selecting cart items from MySQL:', err);
          return res.status(500).send('Internal Server Error');
        }

        // Render the cart page with items and total price
        res.render('cart', {
          items: prekesResult,
          total: total,
          totalPrice: totalPrice
        });
      });
    });
  } else {
    // If there are no cart items, render the cart page with empty items array and total price as 0
    res.render('cart', {
      items: [],
      total: total,
      totalPrice: 0
    });
  }
});

function urlEncodeObject(obj) {
  return Object.keys(obj)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
    .join('&');
}

// Function to replace characters in a string to make it URL-safe
function makeUrlSafe(str) {
  return str.replace(/\//g, '_').replace(/\+/g, '-');
}

// Function to generate the sign parameter using md5 hash
function generateSign(data, password) {
  const md5 = crypto.createHash('md5');
  md5.update(data + password);
  return md5.digest('hex');
}

router.post('/pay', async (req, res) => {

  console.log(req.params.body)

  try {
    const params = {
      orderid: 123,
      p_email: 'customer@email.com',
      amount: 1000,
      currency: 'EUR'
    };
    const urlToGo = paysera.buildRequestUrl(params);
    res.redirect(urlToGo); // Redirect the client to the URL
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      error: 'Internal Server Error'
    });
  }
});

router.post('/callback', (req, res) => {
  // Validate callback from Paysera
  const isValid = paysera.checkCallback(req.body);

  if (isValid) {
    // Decode the callback data
    const order = paysera.decode(req.body.data);
    // Your code to update order status

    // Send "OK" as the response
    res.send('OK');
  } else {
    // Handle invalid callback
    res.status(400).send('Invalid callback');
  }
});


module.exports = router;