/**
 * Participant Model
 * Sequelize model for participants
 */

const { DataTypes } = require('sequelize');

function defineParticipantModel(sequelize, GameSession) {
    const ParticipantModel = sequelize.define('ParticipantModel', {
        id: {
            type: DataTypes.STRING(100),
            primaryKey: true,
            allowNull: false
        },
        sessionId: {
            type: DataTypes.STRING(100),
            allowNull: true,
            field: 'session_id',
            references: {
                model: GameSession,
                key: 'id'
            }
        },
        nickname: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        socketId: {
            type: DataTypes.STRING(100),
            allowNull: true,
            field: 'socket_id'
        },
        totalScore: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            field: 'total_score'
        },
        correctAnswers: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            field: 'correct_answers'
        },
        totalTimeTaken: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0,
            field: 'total_time_taken'
        }
    }, {
        tableName: 'participants',
        timestamps: true,
        createdAt: 'joined_at',
        updatedAt: false,
        indexes: [
            { fields: ['session_id'] },
            { fields: ['nickname'] }
        ]
    });

    // Define associations
    if (GameSession) {
        ParticipantModel.belongsTo(GameSession, { foreignKey: 'session_id', onDelete: 'CASCADE' });
    }

    return ParticipantModel;
}

module.exports = defineParticipantModel;
