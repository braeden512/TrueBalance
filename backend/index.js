const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'my_database',
});

db.connect(err => {
  if (err) {
    console.error('DB connection error:', err);
  } else {
    console.log('Connected to MySQL!');
  }
});

// Test route
app.get('/', (req, res) => {
  res.send('Hello from backend!');
});

db.query('SELECT * FROM users', (err, results) => {
  if(err) throw err;
  console.log(results);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
