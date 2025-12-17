/**
 * Question Bank
 * Predefined quiz questions about world geography
 */

const Question = require('../models/Question');
const config = require('../config');

/**
 * Load all quiz questions
 */
function loadQuestions() {
    const questionData = [
        {
            id: 'q1',
            text: 'Which country has the longest coastline in the world?',
            options: [
                { id: 'a', text: 'Canada' },
                { id: 'b', text: 'Indonesia' },
                { id: 'c', text: 'Norway' },
                { id: 'd', text: 'Russia' }
            ],
            correctAnswer: 'a'
        },
        {
            id: 'q2',
            text: 'What is the smallest country in the world by land area?',
            options: [
                { id: 'a', text: 'Monaco' },
                { id: 'b', text: 'Vatican City' },
                { id: 'c', text: 'San Marino' },
                { id: 'd', text: 'Liechtenstein' }
            ],
            correctAnswer: 'b'
        },
        {
            id: 'q3',
            text: 'Which African country has coastlines on both the Atlantic and Indian Oceans?',
            options: [
                { id: 'a', text: 'Egypt' },
                { id: 'b', text: 'South Africa' },
                { id: 'c', text: 'Morocco' },
                { id: 'd', text: 'Kenya' }
            ],
            correctAnswer: 'b'
        },
        {
            id: 'q4',
            text: 'The Danube River flows through how many countries?',
            options: [
                { id: 'a', text: '6 countries' },
                { id: 'b', text: '8 countries' },
                { id: 'c', text: '10 countries' },
                { id: 'd', text: '12 countries' }
            ],
            correctAnswer: 'c'
        },
        {
            id: 'q5',
            text: 'Which country has the most time zones?',
            options: [
                { id: 'a', text: 'United States' },
                { id: 'b', text: 'Russia' },
                { id: 'c', text: 'France' },
                { id: 'd', text: 'China' }
            ],
            correctAnswer: 'c'
        },
        {
            id: 'q6',
            text: 'What is the only country that borders both the Atlantic and Pacific Oceans in South America?',
            options: [
                { id: 'a', text: 'Brazil' },
                { id: 'b', text: 'Chile' },
                { id: 'c', text: 'Colombia' },
                { id: 'd', text: 'Peru' }
            ],
            correctAnswer: 'c'
        },
        {
            id: 'q7',
            text: 'Which European capital city is located on two continents?',
            options: [
                { id: 'a', text: 'Moscow' },
                { id: 'b', text: 'Istanbul' },
                { id: 'c', text: 'Athens' },
                { id: 'd', text: 'Bucharest' }
            ],
            correctAnswer: 'b'
        },
        {
            id: 'q8',
            text: 'What percentage of the world\'s population lives in the Northern Hemisphere?',
            options: [
                { id: 'a', text: '70%' },
                { id: 'b', text: '80%' },
                { id: 'c', text: '90%' },
                { id: 'd', text: '95%' }
            ],
            correctAnswer: 'c'
        },
        {
            id: 'q9',
            text: 'Which country has the most islands in the world?',
            options: [
                { id: 'a', text: 'Philippines' },
                { id: 'b', text: 'Indonesia' },
                { id: 'c', text: 'Sweden' },
                { id: 'd', text: 'Japan' }
            ],
            correctAnswer: 'c'
        },
        {
            id: 'q10',
            text: 'The International Date Line passes through which ocean?',
            options: [
                { id: 'a', text: 'Atlantic Ocean' },
                { id: 'b', text: 'Indian Ocean' },
                { id: 'c', text: 'Pacific Ocean' },
                { id: 'd', text: 'Arctic Ocean' }
            ],
            correctAnswer: 'c'
        }
    ];

    // Convert to Question objects
    return questionData.map(data =>
        new Question(
            data.id,
            data.text,
            data.options,
            data.correctAnswer,
            config.game.questionTimeLimit
        )
    );
}

/**
 * Get a specific question by ID
 */
function getQuestionById(questions, questionId) {
    return questions.find(q => q.id === questionId);
}

/**
 * Validate question data integrity
 */
function validateQuestions(questions) {
    const errors = [];

    questions.forEach((question, index) => {
        // Check for unique IDs
        const duplicates = questions.filter(q => q.id === question.id);
        if (duplicates.length > 1) {
            errors.push(`Duplicate question ID: ${question.id}`);
        }

        // Check for valid correct answer
        const correctOption = question.options.find(opt => opt.id === question.correctAnswer);
        if (!correctOption) {
            errors.push(`Question ${question.id}: Invalid correct answer`);
        }

        // Check for minimum options
        if (question.options.length < 2) {
            errors.push(`Question ${question.id}: Need at least 2 options`);
        }

        // Check for duplicate option IDs
        const optionIds = question.options.map(opt => opt.id);
        const uniqueOptionIds = new Set(optionIds);
        if (optionIds.length !== uniqueOptionIds.size) {
            errors.push(`Question ${question.id}: Duplicate option IDs`);
        }
    });

    return {
        valid: errors.length === 0,
        errors
    };
}

module.exports = {
    loadQuestions,
    getQuestionById,
    validateQuestions
};
