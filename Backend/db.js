const fs = require('fs');
const axios = require('axios');
const xml2js = require('xml2js');
const mysql = require('mysql');
const cron = require('node-cron');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: "instalika",
    database: 'instalika',
    multipleStatements: true
});

const query = (sql, values) => {
    return new Promise((resolve, reject) => {
      connection.query(sql, values, (error, results, fields) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
};

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');

    // Call fetchDataAndInsert function when the server starts
    // fetchDataAndInsert();
});

// Function to fetch XML file and insert data into MySQL
// const fetchDataAndInsert = () => {
//     const url = 'https://bkgrupe.lt/XML/prdct_fd_instaltec240131.xml';

//     axios.get(url)
//         .then(response => {
//             const xmlData = response.data;

//             xml2js.parseString(xmlData, (err, result) => {
//                 if (err) {
//                     console.error('Error parsing XML:', err);
//                     return;
//                 }

//                 const products = result.CATALOG.PRODUCT;

//                 products.forEach((product) => {
//                     const sku = product.SKU[0];
//                     const title = product.TITLE[0];
//                     const category = product.CATEGORY[0];
//                     const shortDescription = product.SHORT_DESCRIPTION[0];
//                     const description = product.DESCRIPTION[0];
//                     const price = parseFloat(product.PRICE[0]);
//                     const qty = parseInt(product.QTY[0]);
//                     const image = product.IMAGE[0];
//                     const manufacturer = product.MANUFACTURER[0];
//                     const weight = parseFloat(product.WEIGHT[0]);
//                     const ean = product.EAN[0];

//                     const query = 'SELECT * FROM prekes WHERE SKU = ?';
//                     connection.query(query, [sku], (err, results) => {
//                         if (err) {
//                             console.error('Error checking SKU:', err);
//                             return;
//                         }

//                         if (results.length === 0) {
//                             // SKU does not exist, insert the product
//                             const insertQuery = `INSERT INTO prekes (SKU, TITLE, CATEGORY, SHORT_DESCRIPTION, DESCRIPTION, PRICE, QTY, IMAGE, MANUFACTURER, WEIGHT, EAN) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
//                             const values = [sku, title, category, shortDescription, description, price, qty, image, manufacturer, weight, ean];
//                             connection.query(insertQuery, values, (err, result) => {
//                                 if (err) {
//                                     console.error('Error inserting data into MySQL:', err);
//                                 } else {
//                                     console.log('Data inserted successfully:', result);
//                                 }
//                             });
//                         } else {
//                             // SKU exists, check if data needs to be updated
//                             const existingProduct = results[0];
//                             if (
//                                 existingProduct.TITLE != title ||
//                                 existingProduct.CATEGORY != category ||
//                                 existingProduct.SHORT_DESCRIPTION != shortDescription ||
//                                 existingProduct.DESCRIPTION != description ||
//                                 existingProduct.PRICE != price ||
//                                 existingProduct.QTY != qty ||
//                                 existingProduct.IMAGE != image ||
//                                 existingProduct.MANUFACTURER != manufacturer ||
//                                 existingProduct.WEIGHT != weight ||
//                                 existingProduct.EAN != ean
//                             ) {
//                                 // Data has changed, update the product
//                                 const updateQuery = `UPDATE prekes SET TITLE = ?, CATEGORY = ?, SHORT_DESCRIPTION = ?, DESCRIPTION = ?, PRICE = ?, QTY = ?, IMAGE = ?, MANUFACTURER = ?, WEIGHT = ?, EAN = ? WHERE SKU = ?`;
//                                 const updateValues = [title, category, shortDescription, description, price, qty, image, manufacturer, weight, ean, sku];
//                                 connection.query(updateQuery, updateValues, (err, result) => {
//                                     if (err) {
//                                         console.error('Error updating data in MySQL:', err);
//                                     } else {
//                                         console.log('Data updated successfully:', result);
//                                     }
//                                 });
//                             } else {
//                                 // Data has not changed, skip updating
//                                 console.log(`SKU ${sku} already exists with no changes, skipping update`);
//                             }
//                         }
//                     });
//                 });
//             });
//         })
//         .catch(error => {
//             console.error('Error fetching XML file:', error);
//         });
// };

// // Schedule task to run every day at 03:00 AM
// cron.schedule('0 3 * * *', () => {
//     console.log('Running task to fetch XML data and insert into MySQL...');
//     fetchDataAndInsert();
// }, {
//     timezone: 'Europe/Vilnius' // Adjust timezone as per your location
// });

module.exports = { connection, query };