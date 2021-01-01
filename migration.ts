import mysql from 'mysql';
import db_config from "./db_config";

const connection = mysql.createConnection(db_config);

connection.connect();


const sql_create_queris = [
    'DROP TABLE IF EXISTS customers, products, orders',
    'CREATE TABLE customers (id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY, name VARCHAR(30) NOT NULL, email VARCHAR(50))',
    'CREATE TABLE products (id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY, name VARCHAR(30) NOT NULL, quantity INT(6) NOT NULL, price INT(6) NOT NULL)',
    'CREATE TABLE orders (id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY, productId INT(6) NOT NULL)'
];

sql_create_queris.forEach(query => {
    connection.query(query,
        function (error, results) {
            if (error) throw error;
            console.log('The solution is: ', results);
        });
})

connection.end();


