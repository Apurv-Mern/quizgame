/**
 * Logger Utility
 * Centralized logging for debugging and monitoring
 */

const LOG_LEVELS = {
    ERROR: 'ERROR',
    WARN: 'WARN',
    INFO: 'INFO',
    DEBUG: 'DEBUG'
};

class Logger {
    constructor() {
        this.level = process.env.LOG_LEVEL || 'INFO';
    }

    formatMessage(level, message, data = null) {
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            level,
            message
        };

        if (data) {
            logEntry.data = data;
        }

        return logEntry;
    }

    error(message, data = null) {
        const log = this.formatMessage(LOG_LEVELS.ERROR, message, data);
        console.error(`[${log.timestamp}] ERROR:`, message, data || '');
    }

    warn(message, data = null) {
        const log = this.formatMessage(LOG_LEVELS.WARN, message, data);
        console.warn(`[${log.timestamp}] WARN:`, message, data || '');
    }

    info(message, data = null) {
        const log = this.formatMessage(LOG_LEVELS.INFO, message, data);
        console.log(`[${log.timestamp}] INFO:`, message, data || '');
    }

    debug(message, data = null) {
        if (this.level === 'DEBUG') {
            const log = this.formatMessage(LOG_LEVELS.DEBUG, message, data);
            console.log(`[${log.timestamp}] DEBUG:`, message, data || '');
        }
    }

    // Specialized logging methods
    logConnection(socketId, role) {
        this.info(`New connection: ${socketId} (${role})`);
    }

    logParticipantJoin(nickname, participantId) {
        this.info(`Participant joined: ${nickname} (${participantId})`);
    }

    logParticipantLeave(nickname) {
        this.info(`Participant left: ${nickname}`);
    }

    logQuestionStart(questionNumber, questionText) {
        this.info(`Question ${questionNumber} started: ${questionText}`);
    }

    logAnswer(nickname, isCorrect, points, responseTime) {
        this.debug(`Answer from ${nickname}: ${isCorrect ? 'correct' : 'incorrect'}, ${points} pts, ${responseTime}s`);
    }

    logError(context, error) {
        this.error(`${context}:`, {
            message: error.message,
            stack: error.stack
        });
    }
}

const logger = new Logger();

module.exports = logger;
