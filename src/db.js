const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',     
    user: 'root',          
    password: 'root',  
    database: 'lia_db2024', 
});

module.exports = pool.promise();
