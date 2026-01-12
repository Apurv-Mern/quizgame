/**
 * Game Service
 * Core game state management and business logic
 */

const Participant = require('../models/Participant');
const Question = require('../models/Question');
const { loadQuestions } = require('../utils/questionBank');
const config = require('../config');

class GameService {
    constructor() {
        this.gameStatus = 'waiting'; // waiting, active, paused, ended
        this.sessionId = `monaco-quiz-${Date.now()}`;
        this.startedAt = null;

        // Participants storage
        this.participants = new Map(); // participantId -> Participant
        this.socketToParticipant = new Map(); // socketId -> participantId
        this.nicknameToParticipant = new Map(); // lowercase nickname -> participantId

        // Questions
        this.questions = [];
        this.currentQuestionIndex = -1;
        this.currentQuestion = null;
        this.questionTimer = null;

        // Leaderboard cache
        this.leaderboardCache = null;
        this.lastLeaderboardUpdate = null;

        // Initialize question bank
        this.loadInitialQuestions();
    }

    /**
     * Load initial questions from question bank
     */
    loadInitialQuestions() {
        this.questions = loadQuestions();
        console.log(`✅ Loaded ${this.questions.length} questions from question bank`);
    }

    /**
     * Add a new participant
     */
    addParticipant(nickname, socketId) {
        // Validate nickname
        const validation = this.validateNickname(nickname);
        if (!validation.valid) {
            return { success: false, error: validation.error };
        }

        // Check participant limit
        if (this.participants.size >= config.game.maxParticipants) {
            return { success: false, error: 'Game is full' };
        }

        // Create participant
        const participant = new Participant(nickname, socketId);

        this.participants.set(participant.id, participant);
        this.socketToParticipant.set(socketId, participant.id);
        this.nicknameToParticipant.set(nickname.toLowerCase(), participant.id);

        console.log(`✅ Participant joined: ${nickname} (${participant.id})`);

        return {
            success: true,
            participant: participant.toJSON()
        };
    }

    /**
     * Remove a participant
     */
    removeParticipant(socketId) {
        const participantId = this.socketToParticipant.get(socketId);
        if (!participantId) return null;

        const participant = this.participants.get(participantId);
        if (!participant) return null;

        this.participants.delete(participantId);
        this.socketToParticipant.delete(socketId);
        this.nicknameToParticipant.delete(participant.nickname.toLowerCase());

        console.log(`❌ Participant left: ${participant.nickname}`);

        return participant;
    }

    /**
     * Get participant by socket ID
     */
    getParticipantBySocket(socketId) {
        const participantId = this.socketToParticipant.get(socketId);
        return participantId ? this.participants.get(participantId) : null;
    }

    /**
     * Validate nickname
     */
    validateNickname(nickname) {
        if (!nickname || typeof nickname !== 'string') {
            return { valid: false, error: 'Nickname is required' };
        }

        const trimmed = nickname.trim();

        if (trimmed.length < config.game.minNicknameLength) {
            return { valid: false, error: `Nickname must be at least ${config.game.minNicknameLength} characters` };
        }

        if (trimmed.length > config.game.maxNicknameLength) {
            return { valid: false, error: `Nickname must be at most ${config.game.maxNicknameLength} characters` };
        }

        // Check for valid characters (letters, numbers, spaces)
        if (!/^[a-zA-Z0-9 ]+$/.test(trimmed)) {
            return { valid: false, error: 'Nickname can only contain letters, numbers, and spaces' };
        }

        // Check for duplicate (case-insensitive)
        if (this.nicknameToParticipant.has(trimmed.toLowerCase())) {
            return { valid: false, error: 'Nickname already taken - try adding a number' };
        }

        return { valid: true, nickname: trimmed };
    }

    /**
     * Start a question
     */
    startQuestion(questionIndex, onQuestionEnd, onHintReveal) {
        if (questionIndex >= this.questions.length) {
            return { success: false, error: 'No more questions' };
        }

        // Clear any existing timers
        if (this.questionTimer) {
            clearTimeout(this.questionTimer);
        }
        if (this.hint2Timer) {
            clearTimeout(this.hint2Timer);
        }
        if (this.hint3Timer) {
            clearTimeout(this.hint3Timer);
        }

        this.currentQuestionIndex = questionIndex;
        this.currentQuestion = this.questions[questionIndex];
        this.currentQuestion.start();

        this.gameStatus = 'active';

        console.log(`📝 Started question ${questionIndex + 1}: ${this.currentQuestion.text}`);

        // Set timer to reveal hint 2 at 12 seconds
        this.hint2Timer = setTimeout(() => {
            console.log(`💡 Revealing hint 2 for question ${questionIndex + 1}`);
            if (onHintReveal) onHintReveal(2);
        }, 12000);

        // Set timer to reveal hint 3 at 22 seconds
        this.hint3Timer = setTimeout(() => {
            console.log(`💡 Revealing hint 3 for question ${questionIndex + 1}`);
            if (onHintReveal) onHintReveal(3);
        }, 22000);

        // Set timer to auto-end question at 30 seconds
        this.questionTimer = setTimeout(() => {
            console.log(`⏰ Auto-ending question ${questionIndex + 1} at 30 seconds`);
            this.endQuestion();
            if (onQuestionEnd) onQuestionEnd();
        }, 30000);

        return {
            success: true,
            question: this.currentQuestion.toClientFormat(),
            questionNumber: questionIndex + 1,
            totalQuestions: this.questions.length
        };
    }

    /**
     * End current question
     */
    endQuestion() {
        if (!this.currentQuestion) {
            return { success: false, error: 'No active question' };
        }

        this.currentQuestion.end();
        // Set status to 'waiting' after question ends (before next question starts)
        this.gameStatus = 'waiting';

        // Clear all timers
        if (this.questionTimer) {
            clearTimeout(this.questionTimer);
            this.questionTimer = null;
        }
        if (this.hint2Timer) {
            clearTimeout(this.hint2Timer);
            this.hint2Timer = null;
        }
        if (this.hint3Timer) {
            clearTimeout(this.hint3Timer);
            this.hint3Timer = null;
        }

        console.log(`⏹️  Ended question ${this.currentQuestionIndex + 1}`);

        return {
            success: true,
            results: this.currentQuestion.toResultsFormat()
        };
    }

    /**
     * Submit an answer
     */
    submitAnswer(socketId, questionId, answerId) {
        const participant = this.getParticipantBySocket(socketId);
        if (!participant) {
            return { success: false, error: 'Participant not found' };
        }

        // Verify it's the current question
        if (!this.currentQuestion || this.currentQuestion.id !== questionId) {
            return { success: false, error: 'Invalid question' };
        }

        // Check for duplicate answer
        if (participant.hasAnswered(questionId)) {
            return { success: false, error: 'Already answered this question' };
        }

        // Record answer in question
        const recordResult = this.currentQuestion.recordAnswer(participant.id, answerId);
        if (!recordResult.success) {
            return recordResult;
        }

        // Calculate response time
        const responseTime = (Date.now() - this.currentQuestion.startedAt) / 1000; // seconds
        const remainingTime = this.currentQuestion.timeLimit - responseTime;

        // Check if correct
        const isCorrect = this.currentQuestion.isCorrect(answerId);

        // Calculate points
        const points = this.calculatePoints(isCorrect, remainingTime);

        // Record answer in participant
        participant.addAnswer(questionId, answerId, isCorrect, responseTime, points);

        console.log(
            `📥 Answer from ${participant.nickname}: ` +
            `${answerId} (${isCorrect ? 'correct' : 'incorrect'}, ` +
            `${responseTime.toFixed(2)}s, ${points} pts)`
        );

        return {
            success: true,
            isCorrect,
            points,
            responseTime: responseTime.toFixed(2)
        };
    }

    /**
     * Calculate points based on correctness and speed
     * Formula: Base Points × Correctness × Speed Multiplier
     */
    calculatePoints(isCorrect, remainingTime) {
        if (!isCorrect) {
            return config.scoring.incorrectPoints;
        }

        const totalTime = config.game.questionTimeLimit;

        // Speed multiplier: 0.5 + (0.5 × remaining_time / total_time)
        const speedMultiplier =
            config.scoring.minSpeedMultiplier +
            ((config.scoring.maxSpeedMultiplier - config.scoring.minSpeedMultiplier) *
                (remainingTime / totalTime));

        const points = Math.round(config.game.basePoints * speedMultiplier);

        return points;
    }

    /**
     * Calculate and update leaderboard
     */
    updateLeaderboard() {
        const participantArray = Array.from(this.participants.values());

        // Sort participants
        participantArray.sort((a, b) => {
            // Primary: Total score (descending)
            if (a.totalScore !== b.totalScore) {
                return b.totalScore - a.totalScore;
            }

            // Tie-breaker 1: Average response time (ascending - faster is better)
            if (a.avgResponseTime !== b.avgResponseTime) {
                return a.avgResponseTime - b.avgResponseTime;
            }

            // Tie-breaker 2: Correct count (descending)
            if (a.correctCount !== b.correctCount) {
                return b.correctCount - a.correctCount;
            }

            // Tie-breaker 3: Join time (ascending - earlier is better)
            return a.joinedAt - b.joinedAt;
        });

        // Assign ranks
        participantArray.forEach((participant, index) => {
            participant.previousRank = participant.rank;
            participant.rank = index + 1;
        });

        // Get top 10
        const top10 = participantArray
            .slice(0, config.game.leaderboardTopCount)
            .map(p => p.toLeaderboardEntry());

        this.leaderboardCache = {
            top10,
            totalParticipants: this.participants.size,
            lastUpdated: Date.now()
        };

        this.lastLeaderboardUpdate = Date.now();

        console.log(`📊 Leaderboard updated - Top 3: ${top10.slice(0, 3).map(p => p.nickname).join(', ')}`);

        return this.leaderboardCache;
    }

    /**
     * Get current leaderboard
     */
    getLeaderboard() {
        if (!this.leaderboardCache) {
            return this.updateLeaderboard();
        }
        return this.leaderboardCache;
    }

    /**
     * Get participant's personal rank
     */
    getParticipantRank(participantId) {
        const participant = this.participants.get(participantId);
        if (!participant) return null;

        return {
            rank: participant.rank,
            totalScore: participant.totalScore,
            correctCount: participant.correctCount,
            totalParticipants: this.participants.size
        };
    }

    /**
     * Pause game
     */
    pauseGame() {
        if (this.questionTimer) {
            clearTimeout(this.questionTimer);
            this.questionTimer = null;
        }
        this.gameStatus = 'paused';
        console.log('⏸️  Game paused');
    }

    /**
     * End game
     */
    endGame() {
        if (this.questionTimer) {
            clearTimeout(this.questionTimer);
            this.questionTimer = null;
        }
        this.gameStatus = 'waiting';
        this.currentQuestionIndex = -1;
        this.currentQuestion = null;
        this.updateLeaderboard();
        console.log('🏁 Game ended');
    }

    /**
     * Get game state for new connections
     */
    getGameState() {
        return {
            sessionId: this.sessionId,
            status: this.gameStatus,
            currentQuestionNumber: this.currentQuestionIndex + 1,
            totalQuestions: this.questions.length,
            participantCount: this.participants.size,
            currentQuestion: this.currentQuestion ? {
                ...this.currentQuestion.toClientFormat(),
                remainingTime: this.currentQuestion.getRemainingTime()
            } : null
        };
    }

    /**
     * Get participant count
     */
    getParticipantCount() {
        return this.participants.size;
    }

    /**
     * Get game status
     */
    getGameStatus() {
        return this.gameStatus;
    }

    /**
     * Get current question number
     */
    getCurrentQuestionNumber() {
        return this.currentQuestionIndex + 1;
    }

    /**
     * Set custom questions
     */
    async setCustomQuestions(questionsData) {
        try {
            // Validate input
            if (!Array.isArray(questionsData) || questionsData.length === 0) {
                return {
                    success: false,
                    error: 'Questions must be a non-empty array'
                };
            }

            if (questionsData.length > 10) {
                return {
                    success: false,
                    error: 'Maximum 10 questions allowed'
                };
            }

            // Validate each question
            const validQuestions = [];
            for (let i = 0; i < questionsData.length; i++) {
                const qData = questionsData[i];

                // Check required fields
                if (!qData.text || !qData.options || !qData.correctAnswer) {
                    return {
                        success: false,
                        error: `Question ${i + 1}: Missing required fields`
                    };
                }

                // Validate options
                if (!Array.isArray(qData.options) || qData.options.length !== 4) {
                    return {
                        success: false,
                        error: `Question ${i + 1}: Must have exactly 4 options`
                    };
                }

                // Check if all options have text
                for (let opt of qData.options) {
                    if (!opt.text || opt.text.trim() === '') {
                        return {
                            success: false,
                            error: `Question ${i + 1}: All options must have text`
                        };
                    }
                }

                // Validate correct answer
                const validAnswerIds = qData.options.map(opt => opt.id);
                if (!validAnswerIds.includes(qData.correctAnswer)) {
                    return {
                        success: false,
                        error: `Question ${i + 1}: Invalid correct answer`
                    };
                }

                // Create Question instance
                const question = new Question(
                    qData.id || `q${i + 1}`,
                    qData.text,
                    qData.options,
                    qData.correctAnswer,
                    qData.timeLimit || config.game.questionTimeLimit
                );

                validQuestions.push(question);
            }

            // Replace questions in memory
            this.questions = validQuestions;
            console.log(`✅ Loaded ${validQuestions.length} custom questions`);

            return {
                success: true,
                message: `Successfully loaded ${validQuestions.length} questions`
            };
        } catch (error) {
            console.error('Error setting custom questions:', error);
            return {
                success: false,
                error: 'Failed to process questions'
            };
        }
    }

    /**
     * Get all questions (for host dashboard)
     */
    getQuestions() {
        return this.questions;
    }

    /**
     * Reset game (for testing or new session)
     */
    resetGame() {
        this.gameStatus = 'waiting';
        this.currentQuestionIndex = -1;
        this.currentQuestion = null;
        this.participants.clear();
        this.socketToParticipant.clear();
        this.nicknameToParticipant.clear();
        this.leaderboardCache = null;

        if (this.questionTimer) {
            clearTimeout(this.questionTimer);
            this.questionTimer = null;
        }

        // Reload questions
        this.questions = loadQuestions();

        console.log('🔄 Game reset');
    }
}

// Singleton instance
const gameService = new GameService();

module.exports = gameService;
