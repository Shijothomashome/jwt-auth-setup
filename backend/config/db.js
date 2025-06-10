import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const { MYSQL_HOST, MYSQL_USER, MYSQL_PASS, MYSQL_DB } = process.env;

// First connect without specifying database to create it if missing
const initializeDatabase = async () => {
    try {
        const connection = await mysql.createConnection({
            host: MYSQL_HOST,
            user: MYSQL_USER,
            password: MYSQL_PASS,
        });

        // Create DB if it doesn't exist
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${MYSQL_DB}\``);
        console.log(`✅ Database '${MYSQL_DB}' ensured.`);

        // Use the new DB
        await connection.query(`USE \`${MYSQL_DB}\``);

        // Create users table if it doesn't exist
        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100),
                email VARCHAR(100) UNIQUE,
                password VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log(`✅ 'users' table ensured.`);

        await connection.end();
    } catch (error) {
        console.error("❌ Database initialization failed:", error.message);
    }
};

// Create a pool for app-wide queries
const pool = mysql.createPool({
    host: MYSQL_HOST,
    user: MYSQL_USER,
    password: MYSQL_PASS,
    database: MYSQL_DB,
});

const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log("✅ MySQL Database Connected Successfully!");
        connection.release();
    } catch (error) {
        console.error("❌ MySQL Connection Failed:", error.message);
    }
};

// 💡 Dummy user creation (defined here directly for single-file execution)
const createDummyUser = async () => {
    const name = 'John Doe';
    const email = 'john@example.com';
    const plainPassword = 'password123';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    try {
        const [result] = await pool.query(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );
        console.log(`✅ Dummy user created with ID: ${result.insertId}`);
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            console.warn('✅ Dummy user exists, skipping creation.');
        } else {
            console.error('❌ Failed to insert dummy user:', error.message);
        }
    }
};

// 🔃 Run on startup
await initializeDatabase();
await createDummyUser();

export { pool, testConnection };
