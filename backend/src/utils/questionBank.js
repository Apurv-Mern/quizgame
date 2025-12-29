// Static questions with clues for host dashboard
const staticQuestions = [
    {
        id: 'q1',
        text: 'Europe – Question 1',
        clue1: 'This country is home to Regen Blue, a regenerative blueberry business backed by M&G Catalyst, focused on improving soil health and biodiversity.',
        clue2: 'Its language is official on four continents.',
        clue3: 'This country is home to Nazaré, where surfers have ridden some of the largest waves ever recorded.',
        options: [
            { id: 'a', text: 'Spain' },
            { id: 'b', text: 'Greece' },
            { id: 'c', text: 'Portugal' }
        ],
        correctAnswer: 'c'
    },
    {
        id: 'q2',
        text: 'Europe – Question 2',
        clue1: 'This country is famous for its world-leading luxury watch industry.',
        clue2: 'It is home to one of the world’s largest banking and wealth-management sectors.',
        clue3: 'Despite being landlocked, it is one of the most globally connected economies.',
        options: [
            { id: 'a', text: 'Austria' },
            { id: 'b', text: 'Switzerland' },
            { id: 'c', text: 'Belgium' }
        ],
        correctAnswer: 'b'
    },
    {
        id: 'q3',
        text: 'Europe – Question 3',
        clue1: 'This country produces more olive oil than any other nation.',
        clue2: 'It has more UNESCO World Heritage Sites than any other country in the world.',
        clue3: 'Rome, its capital, was once the center of an empire spanning three continents.',
        options: [
            { id: 'a', text: 'Italy' },
            { id: 'b', text: 'Spain' },
            { id: 'c', text: 'France' }
        ],
        correctAnswer: 'a'
    },
    {
        id: 'q4',
        text: 'Europe – Question 4',
        clue1: 'This country is home to Europe’s largest port by cargo volume.',
        clue2: 'Much of its land lies below sea level.',
        clue3: 'It is globally known for windmills and advanced water-management systems.',
        options: [
            { id: 'a', text: 'Denmark' },
            { id: 'b', text: 'Netherlands' },
            { id: 'c', text: 'Germany' }
        ],
        correctAnswer: 'b'
    },
    {
        id: 'q5',
        text: 'Asia – Question 5',
        clue1: 'A direct holding for M&G in this city is a 26-storey twin-towered office building covering over 130,000 square meters.',
        clue2: 'Between this city and Jeju Island is the world’s busiest domestic flight route.',
        clue3: 'This city has around 30,000 karaoke rooms — roughly one for every 333 residents.',
        options: [
            { id: 'a', text: 'Tokyo' },
            { id: 'b', text: 'Seoul' },
            { id: 'c', text: 'Hong Kong' }
        ],
        correctAnswer: 'b'
    },
    {
        id: 'q6',
        text: 'Asia – Question 6',
        clue1: 'This city has the world’s most valuable stock exchange by market capitalization.',
        clue2: 'It operates one of the most complex and punctual metro systems on Earth.',
        clue3: 'The city hosted the Summer Olympics twice, nearly 60 years apart.',
        options: [
            { id: 'a', text: 'Shanghai' },
            { id: 'b', text: 'Tokyo' },
            { id: 'c', text: 'Singapore' }
        ],
        correctAnswer: 'b'
    },
    {
        id: 'q7',
        text: 'Asia – Question 7',
        clue1: 'This city is one of the world’s most important global financial hubs.',
        clue2: 'It consistently ranks among the most expensive cities to live in.',
        clue3: 'Its skyline is dominated by Victoria Harbour.',
        options: [
            { id: 'a', text: 'Singapore' },
            { id: 'b', text: 'Shanghai' },
            { id: 'c', text: 'Hong Kong' }
        ],
        correctAnswer: 'c'
    },
    {
        id: 'q8',
        text: 'Asia – Question 8',
        clue1: 'This country is the world’s largest exporter of electronics.',
        clue2: 'It is home to Samsung, Hyundai, and LG.',
        clue3: 'Its capital city never sleeps and is known for 24-hour cafés and nightlife.',
        options: [
            { id: 'a', text: 'Japan' },
            { id: 'b', text: 'South Korea' },
            { id: 'c', text: 'Taiwan' }
        ],
        correctAnswer: 'b'
    },
    {
        id: 'q9',
        text: 'North America – Question 9',
        clue1: 'This U.S. state has no sales tax, making it a shopper’s paradise.',
        clue2: 'More than 60% of Fortune 500 companies are incorporated here.',
        clue3: 'It was the first state to ratify the U.S. Constitution in 1787.',
        options: [
            { id: 'a', text: 'Delaware' },
            { id: 'b', text: 'Washington' },
            { id: 'c', text: 'California' }
        ],
        correctAnswer: 'a'
    },
    {
        id: 'q10',
        text: 'North America – Question 10',
        clue1: 'This U.S. state is home to Silicon Valley.',
        clue2: 'If it were a country, it would rank among the world’s top economies.',
        clue3: 'It produces more almonds than the rest of the world combined.',
        options: [
            { id: 'a', text: 'Texas' },
            { id: 'b', text: 'New York' },
            { id: 'c', text: 'California' }
        ],
        correctAnswer: 'c'
    },
    {
        id: 'q11',
        text: 'North America – Question 11',
        clue1: 'This city is the headquarters of the United Nations.',
        clue2: 'It has more than 800 spoken languages.',
        clue3: 'It is nicknamed “The Big Apple.”',
        options: [
            { id: 'a', text: 'Chicago' },
            { id: 'b', text: 'New York City' },
            { id: 'c', text: 'Toronto' }
        ],
        correctAnswer: 'b'
    },
    // {
    //     id: 'q12',
    //     text: 'North America – Question 12',
    //     clue1: 'This country has the longest coastline in the world.',
    //     clue2: 'It is one of the world’s largest producers of uranium.',
    //     clue3: 'Its national animal is the beaver.',
    //     options: [
    //         { id: 'a', text: 'Canada' },
    //         { id: 'b', text: 'United States' },
    //         { id: 'c', text: 'Mexico' }
    //     ],
    //     correctAnswer: 'a'
    // },
    // {
    //     id: 'q13',
    //     text: 'Global – Question 13',
    //     clue1: 'This country has the largest sovereign wealth fund in the world.',
    //     clue2: 'It is consistently ranked among the happiest nations globally.',
    //     clue3: 'Oslo is its capital city.',
    //     options: [
    //         { id: 'a', text: 'Sweden' },
    //         { id: 'b', text: 'Finland' },
    //         { id: 'c', text: 'Norway' }
    //     ],
    //     correctAnswer: 'c'
    // },
    // {
    //     id: 'q14',
    //     text: 'Global – Question 14',
    //     clue1: 'This country operates the world’s busiest international airport by passenger traffic.',
    //     clue2: 'It has successfully diversified its economy beyond oil into finance and tourism.',
    //     clue3: 'Dubai and Abu Dhabi are located here.',
    //     options: [
    //         { id: 'a', text: 'Qatar' },
    //         { id: 'b', text: 'United Arab Emirates' },
    //         { id: 'c', text: 'Saudi Arabia' }
    //     ],
    //     correctAnswer: 'b'
    // }
];
/**
 * Question Bank
 * Predefined quiz questions about world geography
 */

const Question = require('../models/Question');
const config = require('../config');


/**
 * Load all quiz questions (with clues)
 */
function loadQuestions() {
    // Convert staticQuestions to Question objects, including clues
    return staticQuestions.map(data =>
        new Question(
            data.id,
            data.text,
            data.options,
            data.correctAnswer,
            config.game?.questionTimeLimit || 30,
            data.clue1,
            data.clue2,
            data.clue3
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
