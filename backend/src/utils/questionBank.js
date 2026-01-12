/**
 * Question Bank
 * Loads questions from shared questions file
 */

const Question = require('../models/Question');
const { questions: sharedQuestions } = require('../../../shared-questions');

/**
 * Load questions from shared file
 * @returns {Question[]} Array of Question instances
 */
function loadQuestions() {
    return sharedQuestions.map(q =>
        new Question(q.id, q.text, q.options, q.correctAnswer, q.timeLimit)
    );
}

module.exports = { loadQuestions };
