var express = require('express');
var router = express.Router();
const crypto = require('crypto');
const {
  connection,
  query
} = require('../db');


router.use(express.static('public'));

/* GET home page. */
router.get('/', function (req, res, next) {
  const sqlPrekes = 'SELECT * FROM prekes ORDER BY RAND() LIMIT 30';
  const sqlCategory = `SELECT DISTINCT SUBSTRING_INDEX(SUBSTRING_INDEX(CATEGORY, '/Main/', -1), '/', 1) AS category FROM prekes; `;
  const cartItems = req.session.cart || [];
  const items = cartItems.length;

  // Define the cart query
  let cartQuery = '';
  if (cartItems.length > 0) {
    cartQuery = `SELECT SUM(PRICE) AS total_price FROM prekes WHERE id IN (${cartItems.join(',')});`; // Join cartItems array to form comma-separated IDs
  } else {
    cartQuery = 'SELECT 0 AS total_price'; // If cartItems array is empty, return 0 as total price
  }

  // Execute the prekes, category, and cart queries
  connection.query(sqlPrekes, (errPrekes, prekes) => {
    if (errPrekes) {
      console.error('Error executing prekes query:', errPrekes);
      res.status(500).send('Error retrieving prekes from database');
      return;
    }

    connection.query(sqlCategory, (errCategory, categories) => {
      if (errCategory) {
        console.error('Error executing category query:', errCategory);
        res.status(500).send('Error retrieving categories from database');
        return;
      }

      connection.query(cartQuery, (errCart, cartResult) => {
        if (errCart) {
          console.error('Error executing cart query:', errCart);
          res.status(500).send('Error retrieving cart items from database');
          return;
        }

        // Send the query results back to the client
        res.render('index', {
          prekes: prekes,
          categories: categories,
          sort: "popular",
          items: items,
          cartItems: cartResult[0].total_price
        });
      });
    });
  });
});






router.get(['/item/:id'], function (req, res, next) {

  console.log("activated");
  const id = req.params.id;
  const sql = 'SELECT * FROM prekes WHERE id = ?'; // Using a placeholder for the parameter

  query(sql, [id]) // Pass the SQL query and the parameter values as an array
    .then(prekes => {
      // Send the query results back to the client
      res.setHeader('Content-Type', 'application/json');
      res.json(prekes[0]);
    })
    .catch(error => {
      console.error('Error executing query:', error);
      res.status(500).json({
        error: 'Internal Server Error'
      });
    });

});





router.get(['/search/:lookup', '/search/:lookup/:nr'], function (req, res, next) {
  let place = "search/" + req.params.lookup;
  let nr = 1; // Initialize nr with a default value of 1
  let current = req.params.nr;
  const category = decodeURIComponent(req.params.lookup.replace(/\+/g, ' ')); // Decode the URL-encoded category
  let orderByClause = '';
  const cartItems = req.session.cart || [];
  const items = cartItems.length;

  let cartQuery = '';
  if (cartItems.length > 0) {
    cartQuery = `SELECT SUM(PRICE) AS total_price FROM prekes WHERE id IN (${cartItems.join(',')});`; // Join cartItems array to form comma-separated IDs
  } else {
    cartQuery = 'SELECT 0 AS total_price'; // If cartItems array is empty, return 0 as total price
  }

  // Check if nr parameter exists and assign it
  if (req.params.nr) {
    nr = parseInt(decodeURIComponent(req.params.nr.replace(/\+/g, ' ')), 10); // Parse nr as an integer
  }

  if (req.query.sort === 'asc') {
    orderByClause = 'ORDER BY PRICE ASC'; // Add ORDER BY ASC clause if 'Nuo pigiausiu' is chosen
  }
  if (req.query.sort === 'desc') {
    orderByClause = 'ORDER BY PRICE DESC'; // Add ORDER BY ASC clause if 'Nuo pigiausiu' is chosen
  }
  if (req.query.sort === 'a-z') {
    orderByClause = 'ORDER BY TITLE ASC'; // Add ORDER BY ASC clause if 'Nuo pigiausiu' is chosen
  }
  if (req.query.sort === 'z-a') {
    orderByClause = 'ORDER BY TITLE DESC'; // Add ORDER BY ASC clause if 'Nuo pigiausiu' is chosen
  }

  const offset = (nr - 1) * 30; // Calculate the offset based on the page number

  const sqlPrekes = `SELECT * FROM prekes WHERE TITLE LIKE ? ${orderByClause} LIMIT 30 OFFSET ?;`;
  const total = `SELECT COUNT(*) AS total FROM prekes WHERE TITLE LIKE ?;`;
  const sqlCategory = `SELECT DISTINCT SUBSTRING_INDEX(SUBSTRING_INDEX(CATEGORY, '/Main/', -1), '/', 1) AS category FROM prekes;`;

  // Execute the cart query
  connection.query(cartQuery, (errCart, cartResult) => {
    if (errCart) {
      console.error('Error executing cart query:', errCart);
      res.status(500).send('Error retrieving cart items from database');
      return;
    }

    // Execute the prekes query
    connection.query(sqlPrekes, [`%${category}%`, offset], (errPrekes, prekes) => {
      if (errPrekes) {
        console.error('Error executing prekes query:', errPrekes);
        res.status(500).send('Error retrieving prekes from database');
        return;
      }

      // Execute the total count query
      connection.query(total, [`%${category}%`], (errTotal, totalResult) => {
        if (errTotal) {
          console.error('Error executing total count query:', errTotal);
          res.status(500).send('Error retrieving total count from database');
          return;
        }

        // Execute the category query
        connection.query(sqlCategory, (errCategory, categories) => {
          if (errCategory) {
            console.error('Error executing category query:', errCategory);
            res.status(500).send('Error retrieving categories from database');
            return;
          }

          // Send the query results back to the client
          res.render('index', {
            prekes: prekes,
            categories: categories,
            searched: true,
            search: category,
            total: totalResult[0].total,
            current: current,
            place: place,
            sort: req.query.sort,
            items: items,
            cartItems: cartResult[0].total_price
          });
        });
      });
    });
  });
});
module.exports = router;