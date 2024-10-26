/* const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',     
    user: 'root',          
    password: 'root',  
    database: 'lia_db2024', 
});

module.exports = pool.promise(); */


//-----------Docker---------------------
// Import the promise-based version of mysql2
// Otherwise sql does not work.
const mysql = require('mysql2/promise');

// Define the pool using promise-based mysql2
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// Retry logic for the connection
async function connectWithRetry(attemptsRemaining) {
    if (attemptsRemaining === 0) {
        console.error('Max attempts reached. Could not connect to the database.');
        return;
    }

    try {
        // Test the connection by executing a simple query
        const connection = await pool.getConnection();
        console.log('Connected to the database.');
        connection.release();
    } catch (err) {
        console.error('Error connecting to the database:', err.message);
        console.log(`Retrying... Attempts remaining: ${attemptsRemaining - 1}`);
        setTimeout(() => connectWithRetry(attemptsRemaining - 1), 2000); // Retry after 2 seconds
    }
}

// Start connection attempts
connectWithRetry(5);

// Export the pool to be used in other modules
module.exports = pool;