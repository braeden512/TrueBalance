-- this is not complete, just wanted to make a user table so I could begin working on logins and registering

CREATE DATABASE truebalance;

USE truebalance;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);