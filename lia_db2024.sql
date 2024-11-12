drop database if exists lia_db2024; --check docker dbname
create database lia_db2024; 
use lia_db2024;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') NOT NULL,
    avatar VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

-- Insert some sample data
--adminpass:1234  user1:2345
INSERT INTO users (email, username, password, role, avatar) VALUES
('admin@example.com', 'admin', '$2b$10$918OeDGV.rVck6il11t7Jeo.RM8aCExZVh6QRJkRn9z9Wyti7uiNS', 'admin', 'https://i.pravatar.cc/100?img=16'),
('user1@example.com', 'user1', '$2b$10$Sya2OTdEa4gir6/mnb3lt.f2cgnw6JyBq8MCmg.isxMAsTKu0ZaqC', 'user', 'https://i.pravatar.cc/100?img=5');
