-- this is not complete, just wanted to make a user table so I could begin working on logins and registering

-- added a couple lines here to make it easy to reset the db if needed
CREATE DATABASE IF NOT EXISTS truebalance;

USE truebalance;

DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS users;


CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  dark_mode BOOLEAN DEFAULT FALSE
);

CREATE TABLE transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    -- changed name to be less characters (better view of table)
    name VARCHAR(25) NOT NULL, 
    amount DECIMAL(10, 2) NOT NULL,
    -- changed the type length to fit more characters
    type VARCHAR(50) NOT NULL,
    EconomyType ENUM('Source', 'Sink') NOT NULL,
    -- changed the notes to have set max number of characters (better handles how we can view the table)
    notes VARCHAR(65),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);