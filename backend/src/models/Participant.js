/**
 * Participant Model
 * Represents a quiz participant with their score and answer history
 */

const { v4: uuidv4 } = require('uuid');

class Participant {
    constructor(nickname, socketId) {
        this.id = uuidv4();
        this.nickname = nickname;
        this.socketId = socketId;

        // Scoring data
        this.totalScore = 0;
        this.correctCount = 0;
        this.answeredCount = 0;
        this.totalResponseTime = 0; // Sum of response times for correct answers (seconds)
        this.avgResponseTime = 0;

        // Metadata
        this.joinedAt = Date.now();
        this.rank = null;
        this.previousRank = null;
        this.lastHeartbeat = Date.now();

        // Answer history
        this.answers = new Map(); // questionId -> answerData
    }

    /**
     * Record an answer for a question
     */
    addAnswer(questionId, answerId, isCorrect, responseTime, points) {
        const answerData = {
            questionId,
            answerId,
            isCorrect,
            responseTime, // in seconds
            points,
            timestamp: Date.now()
        };

        this.answers.set(questionId, answerData);
        this.answeredCount++;

        if (isCorrect) {
            this.correctCount++;
            this.totalScore += points;
            this.totalResponseTime += responseTime;
            this.avgResponseTime = this.totalResponseTime / this.correctCount;
        }

        return answerData;
    }

    /**
     * Check if participant has already answered a question
     */
    hasAnswered(questionId) {
        return this.answers.has(questionId);
    }

    /**
     * Update heartbeat timestamp
     */
    updateHeartbeat() {
        this.lastHeartbeat = Date.now();
    }

    /**
     * Get serializable participant data
     */
    toJSON() {
        return {
            id: this.id,
            nickname: this.nickname,
            totalScore: this.totalScore,
            correctCount: this.correctCount,
            answeredCount: this.answeredCount,
            avgResponseTime: this.avgResponseTime,
            rank: this.rank,
            joinedAt: this.joinedAt
        };
    }

    /**
     * Get leaderboard entry format
     */
    toLeaderboardEntry() {
        return {
            rank: this.rank,
            participantId: this.id,
            nickname: this.nickname,
            score: this.totalScore,
            correctCount: this.correctCount,
            avgResponseTime: this.avgResponseTime,
            change: this.calculateRankChange()
        };
    }

    /**
     * Calculate rank change indicator
     */
    calculateRankChange() {
        if (this.previousRank === null) return 'NEW';
        if (this.rank < this.previousRank) return `+${this.previousRank - this.rank}`;
        if (this.rank > this.previousRank) return `-${this.rank - this.previousRank}`;
        return '→';
    }
}

module.exports = Participant;
