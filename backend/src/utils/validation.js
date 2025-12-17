/**
 * Validation Utilities
 * Helper functions for data validation
 */

/**
 * Sanitize nickname input
 */
function sanitizeNickname(nickname) {
    if (!nickname || typeof nickname !== 'string') {
        return '';
    }

    // Trim whitespace
    let clean = nickname.trim();

    // Remove extra spaces between words
    clean = clean.replace(/\s+/g, ' ');

    return clean;
}

/**
 * Check for profanity (basic filter)
 */
function containsProfanity(text) {
    const profanityList = [
        // Add basic profanity filter words here
        'badword1', 'badword2' // Placeholder
    ];

    const lowerText = text.toLowerCase();
    return profanityList.some(word => lowerText.includes(word));
}

/**
 * Validate answer submission
 */
function validateAnswerSubmission(questionId, answerId, currentQuestion) {
    if (!questionId || !answerId) {
        return { valid: false, error: 'Missing required fields' };
    }

    if (!currentQuestion) {
        return { valid: false, error: 'No active question' };
    }

    if (currentQuestion.id !== questionId) {
        return { valid: false, error: 'Question ID mismatch' };
    }

    // Check if answer option exists
    const validOption = currentQuestion.options.find(opt => opt.id === answerId);
    if (!validOption) {
        return { valid: false, error: 'Invalid answer option' };
    }

    return { valid: true };
}

/**
 * Calculate percentile rank
 */
function calculatePercentile(rank, total) {
    if (total === 0) return 0;
    return Math.round(((total - rank + 1) / total) * 100);
}

/**
 * Format time duration
 */
function formatDuration(seconds) {
    if (seconds < 60) {
        return `${seconds}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
}

/**
 * Generate random session ID
 */
function generateSessionId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9);
    return `quiz-${timestamp}-${random}`;
}

module.exports = {
    sanitizeNickname,
    containsProfanity,
    validateAnswerSubmission,
    calculatePercentile,
    formatDuration,
    generateSessionId
};
