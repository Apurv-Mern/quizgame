/**
 * Sequelize Database Configuration
 * Initializes Sequelize ORM and manages database connection
 */

const { Sequelize } = require('sequelize');

let sequelize = null;

/**
 * Initialize Sequelize instance
 */
function initializeDatabase() {
    try {
        sequelize = new Sequelize(
            process.env.DB_NAME || 'quiz',
            process.env.DB_USER || 'root',
            process.env.DB_PASSWORD || 'root',
            {
                host: process.env.DB_HOST || 'localhost',
                dialect: 'mysql',
                logging: process.env.NODE_ENV === 'development' ? console.log : false,
                pool: {
                    max: 10,
                    min: 0,
                    acquire: 30000,
                    idle: 10000
                },
                define: {
                    timestamps: true,
                    underscored: true,
                    freezeTableName: true
                }
            }
        );

        console.log('✅ Sequelize initialized');
        return sequelize;
    } catch (error) {
        console.error('❌ Error initializing Sequelize:', error);
        throw error;
    }
}

/**
 * Get Sequelize instance
 */
function getSequelize() {
    if (!sequelize) {
        return initializeDatabase();
    }
    return sequelize;
}

/**
 * Test database connection
 */
async function testConnection() {
    try {
        const instance = getSequelize();
        await instance.authenticate();
        console.log('✅ Database connection successful');
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        return false;
    }
}

/**
 * Sync all models with database
 */
async function syncModels() {
    try {
        const instance = getSequelize();
        await instance.sync({ alter: true });
        console.log('✅ Database models synchronized');
        return true;
    } catch (error) {
        console.error('❌ Error synchronizing models:', error);
        throw error;
    }
}

/**
 * Close database connection
 */
async function closeConnection() {
    if (sequelize) {
        await sequelize.close();
        sequelize = null;
        console.log('Database connection closed');
    }
}

module.exports = {
    initializeDatabase,
    getSequelize,
    testConnection,
    syncModels,
    closeConnection
};
