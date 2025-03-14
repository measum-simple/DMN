CREATE DATABASE departmental_store;
USE departmental_store;

CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  category VARCHAR(255),
  price DECIMAL(10,2)
);

INSERT INTO products (name, category, price) VALUES
("Bread", "Bakery", 2.50),
("Milk", "Dairy", 1.80),
("Oil", "Grocery", 5.00);

CREATE TABLE cart (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT,
  name VARCHAR(255),
  price DECIMAL(10,2),
  quantity INT DEFAULT 1,
  UNIQUE (product_id)
);
