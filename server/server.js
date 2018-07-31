require('dotenv').config();

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser')

const app = express();
const publicPath = path.join(__dirname, '..', 'public');

app.use(express.static(publicPath));
app.use(bodyParser.json());

// Database
const mysql = require('mysql');
const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

app.get('/sql', (req, res) => {
    pool.query('SELECT * FROM testing', (error, results, fields) => {
        if (error) throw error;
        res.send(results);
    });
});

app.get('/find_person', (req, res) => {
    pool.query(`SELECT * FROM testing WHERE id='${req.query.id}' LIMIT 1`, (error, results, fields) => {
        if (error) throw error;
        res.send(results[0]);
    });
});

app.post('/sql', (req, res) => {
    pool.query(`INSERT INTO testing (id, name, age, favourite_food) VALUES ('${req.body.id}', '${req.body.name}',${req.body.age},'${req.body.food}')`, (error, results, fields) => {
        if (error) throw error;
        res.send(results);
    });
});

app.patch('/sql', (req, res) => {
    pool.query(`UPDATE testing SET name='${req.body.name}', age=${req.body.age}, favourite_food='${req.body.food}' WHERE id='${req.body.id}'`, (error, results, fields) => {
        if (error) throw error;
        res.send(results);
    });
});

app.delete('/remove_person', (req, res) => {
    pool.query(`DELETE FROM testing WHERE id='${req.query.id}'`, (error, results, fields) => {
        if (error) throw error;
        res.send(results);
    });
});

app.delete('/sql', (req, res) => {
    pool.query(`DELETE FROM testing`, (error, results, fields) => {
        if (error) throw error;
        res.send(results);
    });
});

process.on('SIGINT', () => {
    console.log("\nGracefully shutting down from SIGINT (Ctrl-C)");
    pool.end();
    process.exit();
});

// End
app.listen(3000, () => {
    console.log('App is listening on port 3000.')
});



