/**
 * Answer Model
 * Sequelize model for answer submissions
 */

const { DataTypes } = require('sequelize');

function defineAnswerModel(sequelize, ParticipantModel) {
    const Answer = sequelize.define('Answer', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        participantId: {
            type: DataTypes.STRING(100),
            allowNull: false,
            field: 'participant_id',
            references: {
                model: ParticipantModel,
                key: 'id'
            }
        },
        questionId: {
            type: DataTypes.STRING(50),
            allowNull: false,
            field: 'question_id'
        },
        selectedAnswer: {
            type: DataTypes.STRING(10),
            allowNull: false,
            field: 'selected_answer'
        },
        isCorrect: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            field: 'is_correct'
        },
        timeTaken: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            field: 'time_taken'
        },
        pointsEarned: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'points_earned'
        }
    }, {
        tableName: 'answers',
        timestamps: true,
        createdAt: 'answered_at',
        updatedAt: false,
        indexes: [
            { fields: ['participant_id'] },
            { fields: ['question_id'] }
        ]
    });

    // Define associations
    if (ParticipantModel) {
        Answer.belongsTo(ParticipantModel, { foreignKey: 'participant_id', onDelete: 'CASCADE' });
    }

    return Answer;
}

module.exports = defineAnswerModel;
