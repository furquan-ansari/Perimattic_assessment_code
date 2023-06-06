require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT;

// Create a MySQL connection
const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DB ,
});

// Connect to the database
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to the MySQL database');
});

// Middleware to parse JSON data
app.use(bodyParser.json());

// Add a new record
app.post('/add', (req, res) => {
  const { name, email, phone, address } = req.body;
  
  // Perform validation
  if (!name || !email || !phone || !address) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  const sql = 'INSERT INTO data (name, email, phone, address) VALUES (?, ?, ?, ?)';
  const values = [name, email, phone, address];
  
  connection.query(sql, values, (err, result) => {
    if (err) throw err;
    console.log('New record added to the database');
    res.send('Record added successfully');
  });
});

// Edit an existing record
app.put('/edit/:id', (req, res) => {
  const { name, email, phone, address } = req.body;
  const id = req.params.id;
  
  // Perform validation
  if (!name || !email || !phone || !address) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  const sql = 'UPDATE data SET name = ?, email = ?, phone = ?, address = ? WHERE id = ?';
  const values = [name, email, phone, address, id];
  
  connection.query(sql, values, (err, result) => {
    if (err) throw err;
    console.log('Record updated in the database');
    res.send('Record updated successfully');
  });
});

// View a specific record
app.get('/view/:id', (req, res) => {
  const id = req.params.id;
  
  const sql = 'SELECT * FROM data WHERE id = ?';
  const values = [id];
  
  connection.query(sql, values, (err, result) => {
    if (err) throw err;
    if (result.length === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }
    
    res.json(result[0]);
  });
});

// Delete a record
app.delete('/delete/:id', (req, res) => {
  const id = req.params.id;
  
  const sql = 'DELETE FROM data WHERE id = ?';
  const values = [id];
  
  connection.query(sql, values, (err, result) => {
    if (err) throw err;
    console.log('Record deleted from the database');
    res.send('Record deleted successfully');
  });
});

// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Server running on port`,process.env.PORT);
});
