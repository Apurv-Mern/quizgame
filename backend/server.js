/**
 * Main server entry point
 * Sets up Express server and Socket.IO for real-time communication
 */

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
require('dotenv').config();

const config = require('./src/config');
const { initializeDatabase, testConnection, syncModels } = require('./src/config/sequelize');
const { initializeModels } = require('./src/models');
const setupSocketHandlers = require('./src/socket');
const gameService = require('./src/services/gameService');

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Socket.IO setup with CORS
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ['GET', 'POST']
    },
    pingTimeout: 60000,
    pingInterval: 25000
});

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
    const health = {
        status: 'ok',
        timestamp: Date.now(),
        uptime: process.uptime(),
        participants: gameService.getParticipantCount(),
        gameStatus: gameService.getGameStatus()
    };
    res.json(health);
});

// Game status endpoint (for monitoring)
app.get('/api/game/status', (req, res) => {
    res.json({
        status: gameService.getGameStatus(),
        participants: gameService.getParticipantCount(),
        currentQuestion: gameService.getCurrentQuestionNumber(),
        totalQuestions: config.game.totalQuestions
    });
});

// Save custom questions endpoint
app.post('/api/questions', async (req, res) => {
    try {
        const { questions } = req.body;

        if (!questions || !Array.isArray(questions)) {
            return res.status(400).json({
                success: false,
                error: 'Questions must be an array'
            });
        }

        // Validate questions
        const validation = await gameService.setCustomQuestions(questions);

        if (!validation.success) {
            return res.status(400).json(validation);
        }

        res.json({
            success: true,
            message: `Successfully saved ${questions.length} questions`,
            questionCount: questions.length
        });
    } catch (error) {
        console.error('Error saving questions:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to save questions'
        });
    }
});

// Get current questions endpoint
app.get('/api/questions', async (req, res) => {
    try {
        const questions = await gameService.getQuestions();
        res.json({
            success: true,
            questions: questions.map(q => ({
                id: q.id,
                text: q.text,
                options: q.options,
                correctAnswer: q.correctAnswer,
                timeLimit: q.timeLimit
            }))
        });
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch questions'
        });
    }
});

// Initialize socket handlers
setupSocketHandlers(io);

// Error handling
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Initialize database and start server
async function startServer() {
    try {
        // Initialize Sequelize
        initializeDatabase();

        // Test connection
        const isConnected = await testConnection();

        if (!isConnected) {
            console.warn('⚠️  Database connection failed, running in memory-only mode');
        } else {
            // Initialize models
            initializeModels();
            console.log('✅ Models initialized');

            // Sync models (creates/updates tables)
            await syncModels();
            console.log('✅ Database ready');
        }

        // Start server
        const PORT = process.env.PORT || 3001;
        server.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📊 Max participants: ${config.game.maxParticipants}`);
            console.log(`⏱️  Question time limit: ${config.game.questionTimeLimit}s`);
            console.log(`🎮 Game initialized and ready`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

startServer();

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM signal received: closing server');
    const { closeConnection } = require('./src/config/sequelize');
    await closeConnection();
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

module.exports = { app, server, io };
