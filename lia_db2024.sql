drop database if exists lia_db2024;
create database lia_db2024;
use lia_db2024;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL
);

-- Insert some sample data
INSERT INTO users (email, password, role) VALUES 
('admin@example.com', '1234', 'admin'),
('user1@example.com', '2345', 'user');
