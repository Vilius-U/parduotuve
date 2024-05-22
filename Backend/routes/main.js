var express = require('express');
var router = express.Router();
const {
  connection,
  query
} = require('../db');

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




router.post('/category/:category', async (req, res, next) => {
  try {

    if (Object.keys(req.body).length > 0) {
      if (typeof req.body.formData !== 'object') {
        return res.status(400).json();
      }

      if (typeof req.body.formData.inStock !== 'boolean' || typeof req.body.formData.discount !== 'boolean') {
        return res.status(400).json();
      }

      if (req.body.formData.manufacturers.some(manufacturer => !manufacturer.match(/^[a-zA-Z0-9\s\-]+$/))) {
        return res.status(400).json();
      }

      if (req.body.formData && Array.isArray(req.body.formData.categories) && req.body.formData.categories.some(category => !category.match(/^[a-zA-Z0-9Ą-ž\s]+$/))) {
        return res.status(400).json();
      }
      

      if (
        typeof req.body.formData.priceRange !== 'object' ||
        typeof req.body.formData.priceRange.min !== 'number' ||
        typeof req.body.formData.priceRange.max !== 'number'
      ) {
        console.log("wrong priceRange")
        return res.status(400).json();
      }
    }
    // If all checks pass, proceed with the rest of your logic
    // ...


    const decodedCategory = decodeURIComponent(req.params.category);

    let category = decodedCategory.replace(/[^a-zA-ZĄ-ž\s-]/g, '');
    let categorySearch = `CATEGORY LIKE '%/Main/${category}%'`;

    if (req.body.formData && Array.isArray(req.body.formData.categories) && req.body.formData.categories.length > 0) {
      categorySearch = req.body.formData.categories.map(categories => {
          return `CATEGORY LIKE '%/Main/${req.params.category}/${categories}%'`;
      }).join(' OR '); // Join the array elements into a single string
  } else {
      categorySearch = `CATEGORY LIKE '%/Main/${req.params.category}%'`; // Or handle the case where categories are not provided
  }
  

    let {
      formData
    } = req.body;
    const inStock = formData && formData.inStock ? "AND QTY > 0" : "";
    const manufacturersFilter = formData && formData.manufacturers && formData.manufacturers.length > 0 ?
      "AND MANUFACTURER IN ('" + formData.manufacturers.join("','") + "')" :
      "";

    let priceRange = "";
    let searchRange = [0, 0];

    if (formData && formData.priceRange) {
        if (formData.priceRange.min == 0 && formData.priceRange.max == 0) {
            priceRange = "";
        } else if (formData.priceRange.min == 0) {
            priceRange = "AND PRICE < " + formData.priceRange.max;
            searchRange = [0, formData.priceRange.max];
        } else if (formData.priceRange.max == 0) {
            priceRange = "AND PRICE > " + formData.priceRange.min;
            searchRange = [formData.priceRange.min, 0];
        } else {
            priceRange = "AND PRICE BETWEEN " + formData.priceRange.min + " AND " + formData.priceRange.max;
            searchRange = [formData.priceRange.min, formData.priceRange.max];
        }
    } else {
        // Handle the case where formData or formData.priceRange is not provided
        priceRange = "";
    }
    

    console.log(priceRange);

    const itemsQuery = `SELECT * FROM prekes WHERE ${categorySearch} ${inStock} ${manufacturersFilter} ${priceRange} LIMIT 30`;
    const totalItemsQuery = `SELECT COUNT(*) AS total_items FROM prekes WHERE ${categorySearch} ${inStock} ${manufacturersFilter} ${priceRange}`;
    const highestPriceQuery = `SELECT PRICE FROM prekes WHERE ${categorySearch} ${inStock} ${manufacturersFilter} ORDER BY PRICE DESC LIMIT 1`;
    const lowestPriceQuery = `SELECT PRICE FROM prekes WHERE ${categorySearch} ${inStock} ${manufacturersFilter} ORDER BY PRICE ASC LIMIT 1`;
    const manufacturersQuery = `SELECT DISTINCT(MANUFACTURER) AS manufacturer FROM prekes WHERE ${categorySearch} AND MANUFACTURER IS NOT NULL AND MANUFACTURER != '' LIMIT 30`;
    const categoriesQuery = `SELECT DISTINCT SUBSTRING_INDEX(SUBSTRING_INDEX(CATEGORY, '/Main/${category}/', -1), '/', 1) AS category FROM prekes WHERE CATEGORY IS NOT NULL AND CATEGORY != ''`;

   

    const [categories, items, totalItems, highestPriceItem, lowestPriceItem, distinctManufacturers] = await Promise.all([
      query(categoriesQuery),
      query(itemsQuery),
      query(totalItemsQuery),
      query(highestPriceQuery),
      query(lowestPriceQuery),
      query(manufacturersQuery)
    ]);

 console.log(categories);
 
    res.json({
      categories: categories,
      items,
      total_items: totalItems[0].total_items,
      highest_price_item: highestPriceItem && typeof highestPriceItem[0] ?.PRICE === 'number' ? highestPriceItem[0].PRICE : 0,
      lowest_price_item: lowestPriceItem && typeof lowestPriceItem[0] ?.PRICE === 'number' ? lowestPriceItem[0].PRICE : 0,
      manufacturers: distinctManufacturers,
      searchRange: searchRange,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      error: 'Internal Server Error'
    });
  }
});
















process.on('exit', () => {
  connection.end();
});
router.use(express.static('public'));

router.get('/', (req, res, next) => {
  res.send("main")
})

// router.get(['/:category', '/:category/:nr'], function (req, res, next) {
//   const place = "Main" + "/" + req.params.category;
//   let nr = 1; // Initialize nr with a default value of 1
//   let orderByClause = ''; // Initialize orderByClause
//   const cartItems = req.session.cart || [];
//   const items = cartItems.length
//   console.log(cartItems)

//   current = req.params.nr;
//   if (current == undefined) {
//     current = 1
//   }

//   const category = decodeURIComponent(req.params.category.replace(/\+/g, ' ')); // Decode the URL-encoded category

//   // Check if nr parameter exists and assign it
//   if (req.params.nr) {
//     nr = parseInt(decodeURIComponent(req.params.nr.replace(/\+/g, ' ')), 10); // Parse nr as an integer
//   }

//   const offset = (nr - 1) * 30; // Calculate the offset based on the page number

//   // Check if the sorting option is provided and set the orderByClause accordingly
//   if (req.query.sort === 'asc') {
//     orderByClause = 'ORDER BY PRICE ASC';
//   } else if (req.query.sort === 'desc') {
//     orderByClause = 'ORDER BY PRICE DESC';
//   } else if (req.query.sort === 'a-z') {
//     orderByClause = 'ORDER BY TITLE ASC';
//   } else if (req.query.sort === 'z-a') {
//     orderByClause = 'ORDER BY TITLE DESC';
//   }

//   // Define SQL queries
//   const sqlPrekes = `SELECT * FROM prekes WHERE CATEGORY LIKE ? ${orderByClause} LIMIT 30 OFFSET ?;`;
//   const total = `SELECT COUNT(*) AS total FROM prekes WHERE CATEGORY LIKE ?;`;
//   const sqlCategory = `SELECT DISTINCT SUBSTRING_INDEX(SUBSTRING_INDEX(CATEGORY, '/Main/', -1), '/', 1) AS category FROM prekes;`;



//   let cart = 0; // Initialize cart query

//   // Check if cartItems array is not empty
//   if (cartItems.length > 0) {
//     cart = `SELECT SUM(PRICE) AS total_price FROM prekes WHERE id IN (${cartItems.join(',')});`; // Join cartItems array to form comma-separated IDs
//   } else {
//     // Set cart query to return no rows if cartItems array is empty
//     cart = 'SELECT 0 AS total_price;';
//   }

//   // Execute all SQL queries sequentially
//   connection.query(sqlPrekes, [`%${category}%`, offset], (errPrekes, prekes) => {
//     if (errPrekes) {
//       console.error('Error executing prekes query:', errPrekes);
//       res.status(500).send('Error retrieving prekes from database');
//       return;
//     }

//     connection.query(total, [`%${category}%`], (errTotal, totalResult) => {
//       if (errTotal) {
//         console.error('Error executing total count query:', errTotal);
//         res.status(500).send('Error retrieving total count from database');
//         return;
//       }

//       connection.query(sqlCategory, (errCategory, categories) => {
//         if (errCategory) {
//           console.error('Error executing category query:', errCategory);
//           res.status(500).send('Error retrieving categories from database');
//           return;
//         }

//         // Execute cart query only if cartItems array is not empty

//         connection.query(cart, (errCart, cartResult) => {
//           if (errCart) {
//             console.error('Error executing cart query:', errCart);
//             res.status(500).send('Error retrieving cart items from database');
//             return;
//           }

//           // Send all query results back to the client
//           res.render('index', {
//             prekes: prekes,
//             categories: categories,
//             search: category,
//             total: totalResult[0].total,
//             current: current,
//             place: place,
//             sort: req.query.sort,
//             cartItems: cartResult[0].total_price,
//             items: items
//           });
//         });

//       });
//     });
//   });
// });

module.exports = router;