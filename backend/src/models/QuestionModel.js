// If using Sequelize migrations, ensure migration for clue1, clue2, clue3 columns is created and run.
/**
 * Question Model
 * Sequelize model for quiz questions
 */

const { DataTypes } = require('sequelize');

function defineQuestionModel(sequelize) {
    const Question = sequelize.define('Question', {
        id: {
            type: DataTypes.STRING(50),
            primaryKey: true,
            allowNull: false
        },
        text: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        options: {
            type: DataTypes.JSON,
            allowNull: false,
            comment: 'Array of option objects with id and text'
        },
        clue1: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'First clue for the question'
        },
        clue2: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Second clue for the question'
        },
        clue3: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Third clue for the question'
        },
        correctAnswer: {
            type: DataTypes.STRING(10),
            allowNull: false,
            field: 'correct_answer'
        },
        timeLimit: {
            type: DataTypes.INTEGER,
            defaultValue: 30,
            field: 'time_limit'
        }
    }, {
        tableName: 'questions',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return Question;
}

module.exports = defineQuestionModel;
