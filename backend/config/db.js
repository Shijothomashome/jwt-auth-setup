import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DB,
});

// Test database connection from the pool
const testConnection = async () => {
    try {
        const connection = await pool.getConnection(); // await the connection from the pool
        console.log("✅ MySQL Database Connected Successfully!");
        connection.release(); // properly release the connection
    } catch (error) {
        console.error("❌ MySQL Connection Failed:", error.message);
    }
}

export { pool, testConnection };
