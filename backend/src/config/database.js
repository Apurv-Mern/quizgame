/**
 * MySQL Database Connection
 * Handles database pool and query execution
 */

const mysql = require('mysql2/promise');

let pool = null;

/**
 * Initialize database connection pool
 */
function initializeDatabase() {
    try {
        pool = mysql.createPool({
            // host: process.env.DB_HOST || 'localhost',
            // user: process.env.DB_USER || 'root',
            // password: process.env.DB_PASSWORD || '',
            // database: process.env.DB_NAME || 'quiz',
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'quiz',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
            enableKeepAlive: true,
            keepAliveInitialDelay: 0
        });

        console.log('✅ Database connection pool initialized');
        return pool;
    } catch (error) {
        console.error('❌ Error initializing database:', error);
        throw error;
    }
}

/**
 * Get database connection pool
 */
function getPool() {
    if (!pool) {
        return initializeDatabase();
    }
    return pool;
}

/**
 * Execute a query
 */
async function query(sql, params) {
    try {
        const pool = getPool();
        const [rows] = await pool.execute(sql, params);
        return rows;
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
}

/**
 * Test database connection
 */
async function testConnection() {
    try {
        const pool = getPool();
        await pool.query('SELECT 1');
        console.log('✅ Database connection successful');
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        return false;
    }
}

/**
 * Initialize database tables
 */
async function initializeTables() {
    try {
        // Questions table
        await query(`
            CREATE TABLE IF NOT EXISTS questions (
                id VARCHAR(50) PRIMARY KEY,
                text TEXT NOT NULL,
                options JSON NOT NULL,
                correct_answer VARCHAR(10) NOT NULL,
                time_limit INT DEFAULT 30,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        // Game sessions table
        await query(`
            CREATE TABLE IF NOT EXISTS game_sessions (
                id VARCHAR(100) PRIMARY KEY,
                status ENUM('waiting', 'active', 'paused', 'ended') DEFAULT 'waiting',
                started_at TIMESTAMP NULL,
                ended_at TIMESTAMP NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Participants table
        await query(`
            CREATE TABLE IF NOT EXISTS participants (
                id VARCHAR(100) PRIMARY KEY,
                session_id VARCHAR(100),
                nickname VARCHAR(50) NOT NULL,
                socket_id VARCHAR(100),
                total_score INT DEFAULT 0,
                correct_answers INT DEFAULT 0,
                total_time_taken DECIMAL(10,2) DEFAULT 0,
                joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (session_id) REFERENCES game_sessions(id) ON DELETE CASCADE,
                INDEX idx_session (session_id),
                INDEX idx_nickname (nickname)
            )
        `);

        // Answers table
        await query(`
            CREATE TABLE IF NOT EXISTS answers (
                id INT AUTO_INCREMENT PRIMARY KEY,
                participant_id VARCHAR(100),
                question_id VARCHAR(50),
                selected_answer VARCHAR(10),
                is_correct BOOLEAN,
                time_taken DECIMAL(10,2),
                points_earned INT,
                answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE CASCADE,
                INDEX idx_participant (participant_id),
                INDEX idx_question (question_id)
            )
        `);

        console.log('✅ Database tables initialized');
        return true;
    } catch (error) {
        console.error('❌ Error initializing tables:', error);
        throw error;
    }
}

/**
 * Close database connection
 */
async function closeConnection() {
    if (pool) {
        await pool.end();
        pool = null;
        console.log('Database connection closed');
    }
}

module.exports = {
    initializeDatabase,
    getPool,
    query,
    testConnection,
    initializeTables,
    closeConnection
};
