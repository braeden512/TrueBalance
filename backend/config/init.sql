-- this is not complete, just wanted to make a user table so I could begin working on logins and registering

CREATE DATABASE truebalance;

USE truebalance;


CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    number VARCHAR(50),
    name VARCHAR(100) NOT NULL, 
    amount DECIMAL(10, 2) NOT NULL, 
    type VARCHAR(20),
    EconomyType ENUM('Source', 'Sink') NOT NULL,  
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);