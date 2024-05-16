var express = require('express');
var router = express.Router();
var connection = require('../db'); // Assuming db.js is located in the parent directory

router.get('/items', (req, res, next) => {
  // Execute the SQL query
  console.log("activated")
  connection.query('SELECT * FROM prekes WHERE QTY > 0 ORDER BY sukurimo_data DESC LIMIT 30 ', (error, results, fields) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).json({
        error: 'Internal Server Error'
      });
      return;
    }
    // Send the query results as JSON response
    res.set('Cache-Control', 'no-store');
    res.setHeader('Content-Type', 'application/json');
    res.json({
      items: results
    });
  });
});


router.get('/categories', (req, res, next) => {
  // Execute the SQL query
  console.log("activated")
  connection.query(`SELECT DISTINCT SUBSTRING_INDEX(SUBSTRING_INDEX(CATEGORY, '/Main/', -1), '/', 1) AS category FROM prekes`, (error, results, fields) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).json({
        error: 'Internal Server Error'
      });
      return;
    }
    // Send the query results as JSON response
    res.setHeader('Content-Type', 'application/json');
    res.json({
      categories: results
    });
  });
});
// Close the connection when your application exits




router.get('/category/:category', (req, res, next) => {
  // Get the category parameter from the URL
  const category = req.params.category;

  // Execute the SQL query to select items in the specified category
  connection.query(
      `SELECT * FROM prekes WHERE CATEGORY LIKE "%/Main/${category}%" LIMIT 30`,
      (error, items, fields) => {
          if (error) {
              console.error('Error executing query:', error);
              res.status(500).json({ error: 'Internal Server Error' });
              return;
          }

          // Execute the SQL query to count total items in the specified category
          connection.query(
              `SELECT COUNT(*) AS total_items FROM prekes WHERE CATEGORY LIKE '%/Main/${category}%'`,
              (error, totalItems, fields) => {
                  if (error) {
                      console.error('Error executing query:', error);
                      res.status(500).json({ error: 'Internal Server Error' });
                      return;
                  }

                  // Execute the SQL query to find the item with the highest price
                  connection.query(
                      `SELECT PRICE FROM prekes WHERE CATEGORY LIKE '%/Main/${category}%' ORDER BY PRICE DESC LIMIT 1`,
                      (error, highestPriceItem, fields) => {
                          if (error) {
                              console.error('Error executing query:', error);
                              res.status(500).json({ error: 'Internal Server Error' });
                              return;
                          }

                          // Execute the SQL query to find the item with the lowest price
                          connection.query(
                              `SELECT PRICE FROM prekes WHERE CATEGORY LIKE '%/Main/${category}%' ORDER BY PRICE ASC LIMIT 1`,
                              (error, lowestPriceItem, fields) => {
                                  if (error) {
                                      console.error('Error executing query:', error);
                                      res.status(500).json({ error: 'Internal Server Error' });
                                      return;
                                  }

                                  // Execute the SQL query to select distinct manufacturers
                                  connection.query(
                                      `SELECT DISTINCT(MANUFACTURER) AS manufacturer FROM prekes WHERE CATEGORY LIKE "%/Main/${category}%" LIMIT 30`,
                                      (error, manufacturers, fields) => {
                                          if (error) {
                                              console.error('Error executing query:', error);
                                              res.status(500).json({ error: 'Internal Server Error' });
                                              return;
                                          }

                                          // Send the query results as JSON response
                                          res.setHeader('Content-Type', 'application/json');
                                          res.json({
                                              items: items,
                                              total_items: totalItems[0].total_items,
                                              highest_price_item: highestPriceItem[0],
                                              lowest_price_item: lowestPriceItem[0],
                                              manufacturers: manufacturers
                                          });
                                      }
                                  );
                              }
                          );
                      }
                  );
              }
          );
      }
  );
});













process.on('exit', () => {
  connection.end();
});
router.use(express.static('public'));

router.get('/', (req, res, next) => {
  res.send("main")
})

router.get(['/:category', '/:category/:nr'], function (req, res, next) {
  const place = "Main" + "/" + req.params.category;
  let nr = 1; // Initialize nr with a default value of 1
  let orderByClause = ''; // Initialize orderByClause
  const cartItems = req.session.cart || [];
  const items = cartItems.length
  console.log(cartItems)

  current = req.params.nr;
  if (current == undefined) {
    current = 1
  }

  const category = decodeURIComponent(req.params.category.replace(/\+/g, ' ')); // Decode the URL-encoded category

  // Check if nr parameter exists and assign it
  if (req.params.nr) {
    nr = parseInt(decodeURIComponent(req.params.nr.replace(/\+/g, ' ')), 10); // Parse nr as an integer
  }

  const offset = (nr - 1) * 30; // Calculate the offset based on the page number

  // Check if the sorting option is provided and set the orderByClause accordingly
  if (req.query.sort === 'asc') {
    orderByClause = 'ORDER BY PRICE ASC';
  } else if (req.query.sort === 'desc') {
    orderByClause = 'ORDER BY PRICE DESC';
  } else if (req.query.sort === 'a-z') {
    orderByClause = 'ORDER BY TITLE ASC';
  } else if (req.query.sort === 'z-a') {
    orderByClause = 'ORDER BY TITLE DESC';
  }

  // Define SQL queries
  const sqlPrekes = `SELECT * FROM prekes WHERE CATEGORY LIKE ? ${orderByClause} LIMIT 30 OFFSET ?;`;
  const total = `SELECT COUNT(*) AS total FROM prekes WHERE CATEGORY LIKE ?;`;
  const sqlCategory = `SELECT DISTINCT SUBSTRING_INDEX(SUBSTRING_INDEX(CATEGORY, '/Main/', -1), '/', 1) AS category FROM prekes;`;

  let cart = 0; // Initialize cart query

  // Check if cartItems array is not empty
  if (cartItems.length > 0) {
    cart = `SELECT SUM(PRICE) AS total_price FROM prekes WHERE id IN (${cartItems.join(',')});`; // Join cartItems array to form comma-separated IDs
  } else {
    // Set cart query to return no rows if cartItems array is empty
    cart = 'SELECT 0 AS total_price;';
  }

  // Execute all SQL queries sequentially
  connection.query(sqlPrekes, [`%${category}%`, offset], (errPrekes, prekes) => {
    if (errPrekes) {
      console.error('Error executing prekes query:', errPrekes);
      res.status(500).send('Error retrieving prekes from database');
      return;
    }

    connection.query(total, [`%${category}%`], (errTotal, totalResult) => {
      if (errTotal) {
        console.error('Error executing total count query:', errTotal);
        res.status(500).send('Error retrieving total count from database');
        return;
      }

      connection.query(sqlCategory, (errCategory, categories) => {
        if (errCategory) {
          console.error('Error executing category query:', errCategory);
          res.status(500).send('Error retrieving categories from database');
          return;
        }

        // Execute cart query only if cartItems array is not empty

        connection.query(cart, (errCart, cartResult) => {
          if (errCart) {
            console.error('Error executing cart query:', errCart);
            res.status(500).send('Error retrieving cart items from database');
            return;
          }

          // Send all query results back to the client
          res.render('index', {
            prekes: prekes,
            categories: categories,
            search: category,
            total: totalResult[0].total,
            current: current,
            place: place,
            sort: req.query.sort,
            cartItems: cartResult[0].total_price,
            items: items
          });
        });

      });
    });
  });
});

module.exports = router;