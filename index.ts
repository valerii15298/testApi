import express from 'express';

import mysql from 'mysql';
import db_config from "./db_config";

const connection = mysql.createConnection(db_config);

connection.connect();


const app = express();
app.use(express.json());

//@ts-ignore
app.use(function (err, req, res, next) {
    res.status(500).send(JSON.stringify({error: err.message, success: false}));
});

const PORT: number = 8000;


function validateProductInfo(productInfo: { [key: string]: unknown }): boolean {
    return (Object.keys(productInfo).length === 3 &&
        'name' in productInfo && typeof productInfo.name === 'string' &&
        'quantity' in productInfo && typeof productInfo.quantity === 'number' &&
        'price' in productInfo && typeof productInfo['price'] === 'number');
}

app.get('/products/:productId', (req, res) => {
    const productId = req.params.productId;
    connection.query('SELECT * FROM products WHERE id = ? limit 1', [productId], function (error, results, fields) {
        if (error)
            res.send(JSON.stringify({error: error.message}));
        else {
            if (results.length)
                res.send(JSON.stringify(results));
            else
                res.send(JSON.stringify({error: "No product with such id"}));
        }
    });
});

app.post('/products', (req, res) => {
    const productInfo = req.body;
    if (!validateProductInfo(productInfo))
        res.status(400).send(JSON.stringify({error: "Invalid request!"}));
    else
        connection.query('INSERT INTO products (name, quantity, price) VALUES (?, ?, ?)', [productInfo.name, productInfo.quantity, productInfo.price], function (error) {
            if (error)
                res.send(JSON.stringify({error: error.message}))
            else
                res.send(JSON.stringify({
                    success: true
                }));
        });
});

app.put('/products/:productId', (req, res) => {
    const productId = req.params.productId;
    const productInfo = req.body;
    if (!validateProductInfo(productInfo))
        res.status(400).send(JSON.stringify({error: "Invalid request!"}));
    else
        connection.query('update products set name=?, quantity=?, price=? where id=?', [productInfo.name, productInfo.quantity, productInfo.price, productId], function (error) {
            if (error)
                res.send(JSON.stringify({error: error.message}))
            else
                res.send(JSON.stringify({
                    success: true
                }));
        });
});

app.delete('/products/:productId', (req, res) => {
    const productId = req.params.productId;
    connection.query('DELETE FROM products WHERE id = ? limit 1', [productId], function (error) {
        if (error)
            res.send(JSON.stringify({error: error.message}));
        res.send(JSON.stringify({success: true}));
    });

});

app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});

