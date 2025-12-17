/**
 * Application configuration
 * Centralized config for game settings and server options
 */

module.exports = {
    server: {
        port: process.env.PORT || 3001,
        corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000'
    },

    database: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        name: process.env.DB_NAME || 'quiz'
    },

    game: {
        maxParticipants: parseInt(process.env.MAX_PARTICIPANTS) || 300,
        questionTimeLimit: parseInt(process.env.QUESTION_TIME_LIMIT) || 30, // seconds
        basePoints: parseInt(process.env.BASE_POINTS) || 1000,
        minNicknameLength: 3,
        maxNicknameLength: 15,
        totalQuestions: 10,
        leaderboardTopCount: 10
    },

    scoring: {
        minSpeedMultiplier: 0.5,  // Minimum multiplier for slowest answer
        maxSpeedMultiplier: 1.0,  // Maximum multiplier for fastest answer
        incorrectPoints: 0
    }
};
