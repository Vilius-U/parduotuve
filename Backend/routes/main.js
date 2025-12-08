var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const session = require('express-session');
const crypto = require('crypto');
const ejs = require('ejs');
const path = require('path');
const {
  connection,
  query
} = require('../db');
const { response } = require('../app');





const transporter = nodemailer.createTransport({
  host: 'mail.instalika.eu',
  port: 587,
  secure: false,
  auth: {
    user: 'prekyba@instalika.eu', // Your Gmail address
    pass: 'Instal@1973' // Your Gmail password
  }
});


router.get('/mail' , (req, res, next) => {
ejs.renderFile('./views/validateEmail.ejs', {user: 'John :)'}, function(err, template) {
  if (err) {
    console.log(err);
  } else {
    const mailOptions = {
      from: 'prekyba@instalika.eu', // Sender address
      to: 'viluzk@gmail.com', // Recipient address
      subject: 'Test Email', // Email subject
      html: template
};

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
        } else {
          console.log('Email sent:', info.response);
        }
      })

    
    console.log(template);
    
  }
});
})

router.get('/items',  (req, res, next) => {
  // Execute the SQL query
  console.log("activated")
  connection.query('SELECT TITLE, SHORT_DESCRIPTION, DESCRIPTION, MANUFACTURER, PRICE, IMAGE, QTY, id FROM prekes WHERE QTY > 0 ORDER BY sukurimo_data DESC LIMIT 30 ', (error, results, fields) => {
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

router.get('/categories', async (req, res, next) => {
  try {
    // Define a function to recursively retrieve subcategories with a depth limit
    const getSubcategoriesRecursive = async (categoryName, depth) => {
      if (depth > 2) {
        return []; // Stop recursion if depth exceeds 2
      }

      let subcategories = await query(`SELECT DISTINCT SUBSTRING_INDEX(SUBSTRING_INDEX(CATEGORY, '/${categoryName}/', -1), '/', 1) AS subcategory FROM prekes WHERE CATEGORY LIKE '%/${categoryName}/%' ORDER BY subcategory ASC`);
      if (subcategories.length === 0) {
        return [];
      } else {
        let categoriesWithSubcategories = [];
        for (let subcategory of subcategories) {
          let subcategoryName = subcategory.subcategory;
          let subSubcategories = await getSubcategoriesRecursive(`${categoryName}/${subcategoryName}`, depth + 1);
          categoriesWithSubcategories.push({
            category: subcategoryName,
            subcategories: subSubcategories
          });
        }
        return categoriesWithSubcategories;
      }
    };

    // Execute the initial SQL query to get top-level categories
    let categoriesResults = await query(`SELECT DISTINCT SUBSTRING_INDEX(SUBSTRING_INDEX(CATEGORY, '/Main/', -1), '/', 1) AS category FROM prekes ORDER BY category ASC;`);

    // Iterate through categories and fetch subcategories recursively
    let categoriesWithSubcategories = [];
    for (let category of categoriesResults) {
      let categoryName = category.category;
      let subcategories = await getSubcategoriesRecursive(categoryName, 1); // Start with depth 1
      categoriesWithSubcategories.push({
        category: categoryName,
        subcategories: subcategories
      });
    }
    
    res.setHeader('Content-Type', 'application/json');
    res.json({
      categories: categoriesWithSubcategories
    });
  } catch (err) {
    // Handle errors
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/category/*', async (req, res, next) => {
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

      if (req.body.formData && req.body.formData.order && 
        (req.body.formData.order !== "asc" && req.body.formData.order !== "desc" && req.body.formData.order !== "popular")) {
        return res.status(400).json();
    }

    if (req.body.formData.page && isNaN(req.body.formData.page)) {
      return res.status(400).json();
    }

      if (
        typeof req.body.formData.priceRange !== 'object' ||
        typeof req.body.formData.priceRange.min !== 'number' ||
        typeof req.body.formData.priceRange.max !== 'number'
      ) {
        return res.status(400).json();
      }
    }
    // If all checks pass, proceed with the rest of your logic
    // ...

    const decodedCategory = decodeURIComponent(req.params[0]);

    let category = decodedCategory.replace(/[^a-zA-ZĄ-ž0-9\s\/,-]/g, '');
    let categorySearch = `CATEGORY LIKE '%/Main/${category}%'`;

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

    let order = "ORDER BY CASE WHEN QTY > 0 THEN 1 ELSE 2 END";

    if (formData && formData.order) {
        if (formData.order == "asc") {
            order += ", PRICE ASC";
        } else if (formData.order == "desc") {
            order += ", PRICE DESC";
        } else {
            order += "";
        }
    }

    let pages = "";

    if (formData && formData.page) {
        pages = "OFFSET " + (formData.page - 1) * 30;
    }

    const itemsQuery = `SELECT TITLE, SHORT_DESCRIPTION, DESCRIPTION, MANUFACTURER, PRICE, IMAGE, QTY, id FROM prekes WHERE ${categorySearch} ${inStock} ${manufacturersFilter} ${priceRange} ${order} LIMIT 30 ${pages}`;
    const totalItemsQuery = `SELECT COUNT(*) AS total_items FROM prekes WHERE ${categorySearch} ${inStock} ${manufacturersFilter} ${priceRange}`;
    const highestPriceQuery = `SELECT PRICE FROM prekes WHERE ${categorySearch} ${inStock} ${manufacturersFilter} ORDER BY PRICE DESC LIMIT 1`;
    const lowestPriceQuery = `SELECT PRICE FROM prekes WHERE ${categorySearch} ${inStock} ${manufacturersFilter} ORDER BY PRICE ASC LIMIT 1`;
    const manufacturersQuery = `SELECT DISTINCT(MANUFACTURER) AS manufacturer FROM prekes WHERE ${categorySearch} AND MANUFACTURER IS NOT NULL AND MANUFACTURER != '' LIMIT 30`;
    const categoriesQuery = `SELECT DISTINCT SUBSTRING_INDEX(SUBSTRING_INDEX(CATEGORY, '/Main/${category}/', -1), '/', 1) AS category FROM prekes WHERE CATEGORY IS NOT NULL AND CATEGORY != '' ORDER BY CATEGORY ASC LIMIT 30`;

    const [categories, items, totalItems, highestPriceItem, lowestPriceItem, distinctManufacturers] = await Promise.all([
      query(categoriesQuery),
      query(itemsQuery),
      query(totalItemsQuery),
      query(highestPriceQuery),
      query(lowestPriceQuery),
      query(manufacturersQuery)
    ]);

    console.log(itemsQuery)

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

router.post('/search/*', async (req, res, next) => {
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

      if (req.body.formData && req.body.formData.order && 
        (req.body.formData.order !== "asc" && req.body.formData.order !== "desc" && req.body.formData.order !== "popular")) {
        return res.status(400).json();
    }

    if (req.body.formData.page && isNaN(req.body.formData.page)) {
      return res.status(400).json();
    }

      if (
        typeof req.body.formData.priceRange !== 'object' ||
        typeof req.body.formData.priceRange.min !== 'number' ||
        typeof req.body.formData.priceRange.max !== 'number'
      ) {
        return res.status(400).json();
      }
    }
    // If all checks pass, proceed with the rest of your logic
    // ...

    const decodedCategory = decodeURIComponent(req.params[0]);

let categorise = "";

    console.log(categorise)

    let category = req.params[0]
    let categorySearch = `MATCH(TITLE, SHORT_DESCRIPTION, DESCRIPTION, MANUFACTURER) AGAINST( ? IN NATURAL LANGUAGE MODE)`;

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

    let order = "ORDER BY CASE WHEN QTY > 0 THEN 1 ELSE 2 END";

    if (formData && formData.order) {
      if (formData.order == "asc") {
          order += ", PRICE ASC";
      } else if (formData.order == "desc") {
          order += ", PRICE DESC";
      } else {
          order += "";
      }
  }

    let pages = "";

    if (formData && formData.page) {
        pages = "OFFSET " + (formData.page - 1) * 30;
    }

    const itemsQuery = `SELECT TITLE, SHORT_DESCRIPTION, DESCRIPTION, MANUFACTURER, PRICE, IMAGE, QTY, id FROM prekes WHERE MATCH(TITLE, SHORT_DESCRIPTION, DESCRIPTION, MANUFACTURER) AGAINST( ? IN NATURAL LANGUAGE MODE) ${inStock} ${manufacturersFilter} ${priceRange} ${order} LIMIT 30 ${pages}`;
    const totalItemsQuery = `SELECT COUNT(*) AS total_items FROM prekes WHERE MATCH(TITLE, SHORT_DESCRIPTION, DESCRIPTION, MANUFACTURER) AGAINST( ? IN NATURAL LANGUAGE MODE) ${inStock} ${manufacturersFilter} ${priceRange}`;
    const highestPriceQuery = `SELECT PRICE FROM prekes WHERE MATCH(TITLE, SHORT_DESCRIPTION, DESCRIPTION, MANUFACTURER) AGAINST( ? IN NATURAL LANGUAGE MODE) ${categorise} ${inStock} ${manufacturersFilter} ORDER BY PRICE DESC LIMIT 1`;
    const lowestPriceQuery = `SELECT PRICE FROM prekes WHERE MATCH(TITLE, SHORT_DESCRIPTION, DESCRIPTION, MANUFACTURER) AGAINST( ? IN NATURAL LANGUAGE MODE) ${categorise} ${inStock} ${manufacturersFilter} ORDER BY PRICE ASC LIMIT 1`;
    const manufacturersQuery = `SELECT DISTINCT(MANUFACTURER) AS manufacturer FROM prekes WHERE MATCH(TITLE, SHORT_DESCRIPTION, DESCRIPTION, MANUFACTURER) AGAINST( ? IN NATURAL LANGUAGE MODE) AND MANUFACTURER IS NOT NULL AND MANUFACTURER != '' LIMIT 30`;
console.log("params ", req.params[0])

    const [totalItems, items, highestPriceItem, lowestPriceItem, distinctManufacturers] = await Promise.all([
      query(totalItemsQuery, [req.params[0]]),
      query(itemsQuery, [req.params[0]]),
      query(highestPriceQuery, [req.params[0]]),
      query(lowestPriceQuery, [req.params[0]]),
      query(manufacturersQuery, [req.params[0]])
    ]);

    res.json({
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

router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  connection.query('SELECT * FROM vartotojai WHERE email = ?', [email], (error, results) => {
    if (error) {
      // Handle error
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (results.length === 0 || !bcrypt.compareSync(password, results[0].password)) {
      // If no user found or password is incorrect
      res.status(401).json({ error: 'Wrong password or email' });
      return;
    }

    // Login successful
    const user = {
      id: results[0].id,
      name: results[0].name,
      surname: results[0].surname,
      email: results[0].email
    };

    if (bcrypt.compareSync(password, results[0].password)) {
        req.session.user = user;
    }

    console.log('Login successful ', user);
    res.status(200).json({ user });
  });
});

router.post('/register', async (req, res) => {
  try {

  const saltRounds = 10;
  const name = req.body.name;
  const surname = req.body.surname;
  const email = req.body.email;
  const password = await bcrypt.hash(req.body.password, saltRounds);
  let activation = crypto.randomBytes(20).toString('hex');
  
  connection.query('INSERT INTO vartotojai (name, surname, email, password, active, activation) VALUES (?, ?, ?, ?, 0, ?)', [name, surname, email, password, activation], (error, results) => {
    if (error) {
      if (error.code === 'ER_DUP_ENTRY') { // MySQL error code for duplicate entry
        console.error('Duplicate entry for email:', error);
        return res.status(400).json({
          error: 'Šis El. pašto vartojojas jau egzistuoja'
        });
      } else {
        console.error('Error executing query:', error);
        return res.status(500).json({
          error: 'Serverio klaida, bandykite dar karta vėliau'
        });
      }
    }
    
    // Log the results object
    console.log("results", results);
  
    // Use insertId to get the ID of the newly inserted row
    req.session.user = {
      id: results.insertId,
      name: name,
      surname: surname,
      email: email
    };

    activation = `${results.insertId}/${activation}`
  
    // Send a response indicating success

    ejs.renderFile('./views/validateEmail.ejs', {link: activation}, function(err, template) {
      if (err) {
        console.log(err);
      } else {
        const mailOptions = {
          from: 'prekyba@instalika.eu', // Sender address
          to: email, // Recipient address
          subject: 'Patvirtinkite paskyrą', // Email subject
          html: template
    };
    
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.error('Error sending email:', error);
            } else {
              console.log('Email sent:', info.response);
            }
          })
    
        
        console.log(template);
        
      }
    });

    res.status(200).json({
      message: results.insertId
    });
  });
  

} catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({
      error: 'Internal Server Error'
    });
  }
});

// Initialize waitingList as an empty object
const waitingList = {};

// Define the awaitResponse endpoint
function notifyActivation(id) {
  if (waitingList[id]) {
    console.log("notify success");

    connection.query(`SELECT name, surname, email, active FROM vartotojai WHERE id = ?`, [id], (error, results) => {
      if (error) {
        waitingList[id].forEach(({ res }) => res.status(500).json({ error: 'Internal server error' }));
      } else if (results.length == 0) {
        waitingList[id].forEach(({ res }) => res.status(404).json({ error: 'User not found' }));
      } else if (results[0].active == 1) {
        const userInfo = {
          name: results[0].name,
          surname: results[0].surname,
          email: results[0].email,
        };
        waitingList[id].forEach(({ res, session }) => {
          session.user = userInfo;
          res.status(200).json({ message: 'Activation successful' });
        });
        delete waitingList[id]; // Clean up after notifying
      } else {
        waitingList[id].forEach(({ res }) => res.status(400).json({ error: 'User not active' }));
        delete waitingList[id];
      }
    });
  }
}

router.post('/awaitResponse', (req, res) => {
  try {
    console.log("await response", req.body);
    const { id } = req.body;

    if (checkIfActivated(id)) {
      console.log('Already activated');
      return res.status(200).json({ message: 'Already activated' });
    }

    // Register this response object in a waiting list
    if (!waitingList[id]) {
      waitingList[id] = [];
    }
    waitingList[id].push({ res, session: req.session });

    // Optionally set a timeout for the wait to avoid hanging requests indefinitely
    setTimeout(() => {
      if (waitingList[id]?.some(entry => entry.res === res)) {
        waitingList[id] = waitingList[id].filter(entry => entry.res !== res);
        res.status(408).json({ error: 'Request timeout' });
      }
    }, 300000); // wait for 5 minutes
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({
      error: 'Internal Server Error'
    });
  }
});

router.post('/activate', (req, res) => {
  const { id, code } = req.body;
  console.log("activating")
  connection.query('UPDATE vartotojai SET active = 1 WHERE id = ? AND activation = ? AND active = 0', [id, code], (error, results) => {
    if (error) {
      console.error('Error updating active:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (results.affectedRows === 0) {
      // No rows were updated, no one to notify
      return res.status(404).json({ error: 'No matching record found' });
    }

    // After activation, notify all waiting responses
    notifyActivation(id);

    return res.status(200).json({ message: 'Activation successful' });
  });
});

router.get('/profile', async (req, res) => {
  console.log("profile activated");
  console.log("profile: ", req.session.user);

  if (!req.session.user) {
    return res.status(401).json({
      error: 'Unauthorized'
    });
  }

  let transactions = [];

  try {
    transactions = await query('SELECT * FROM transakcijos WHERE buyer_id = ?', [req.session.user.id], (error, results) => {
      if (error) {
        transactions = "error";
      }
    });

    console.log(transactions);
    
 res.status(200).json({
        user: req.session.user,
        transactions: transactions
      });
    
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({
      error: 'Internal Server Error'
    });
  }
});

router.get('/logout', (req, res) => {
  try {
  req.session.destroy();
  res.redirect('/');
} catch (error) {
  console.error('Error executing query:', error);
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


module.exports = router;