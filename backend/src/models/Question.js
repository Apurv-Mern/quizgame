/**
 * Question Model
 * Represents a quiz question with answers and timing
 */

class Question {
    constructor(id, text, options, correctAnswer, timeLimit = 30) {
        this.id = id;
        this.text = text;
        this.options = options; // Array of { id, text }
        this.correctAnswer = correctAnswer; // Option id
        this.timeLimit = timeLimit; // seconds

        // State tracking
        this.startedAt = null;
        this.endsAt = null;
        this.answersLocked = false;
        this.answers = new Map(); // participantId -> answerId
    }

    /**
     * Start the question timer
     */
    start() {
        this.startedAt = Date.now();
        this.endsAt = this.startedAt + (this.timeLimit * 1000);
        this.answersLocked = false;
    }

    /**
     * End the question and lock answers
     */
    end() {
        this.answersLocked = true;
    }

    /**
     * Check if question time has expired
     */
    hasExpired() {
        if (!this.endsAt) return false;
        return Date.now() >= this.endsAt;
    }

    /**
     * Get remaining time in seconds
     */
    getRemainingTime() {
        if (!this.endsAt) return this.timeLimit;
        const remaining = Math.max(0, this.endsAt - Date.now());
        return Math.floor(remaining / 1000);
    }

    /**
     * Record an answer
     */
    recordAnswer(participantId, answerId) {
        if (this.answersLocked) {
            return { success: false, reason: 'Question locked' };
        }

        if (this.hasExpired()) {
            return { success: false, reason: 'Time expired' };
        }

        this.answers.set(participantId, answerId);
        return { success: true };
    }

    /**
     * Check if an answer is correct
     */
    isCorrect(answerId) {
        return answerId === this.correctAnswer;
    }

    /**
     * Get statistics for this question
     */
    getStats() {
        const total = this.answers.size;
        const correctAnswers = Array.from(this.answers.values()).filter(
            answerId => answerId === this.correctAnswer
        ).length;

        const answerDistribution = {};
        this.options.forEach(opt => {
            answerDistribution[opt.id] = 0;
        });

        this.answers.forEach(answerId => {
            if (answerDistribution[answerId] !== undefined) {
                answerDistribution[answerId]++;
            }
        });

        return {
            totalAnswers: total,
            correctAnswers,
            correctPercentage: total > 0 ? Math.round((correctAnswers / total) * 100) : 0,
            answerDistribution
        };
    }

    /**
     * Get client-safe question data (without correct answer)
     */
    toClientFormat() {
        return {
            id: this.id,
            text: this.text,
            options: this.options,
            timeLimit: this.timeLimit
        };
    }

    /**
     * Get question with results (for after question ends)
     */
    toResultsFormat() {
        return {
            id: this.id,
            text: this.text,
            options: this.options,
            correctAnswer: this.correctAnswer,
            stats: this.getStats()
        };
    }
}

module.exports = Question;
