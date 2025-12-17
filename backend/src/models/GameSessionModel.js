/**
 * GameSession Model
 * Sequelize model for game sessions
 */

const { DataTypes } = require('sequelize');

function defineGameSessionModel(sequelize) {
    const GameSession = sequelize.define('GameSession', {
        id: {
            type: DataTypes.STRING(100),
            primaryKey: true,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('waiting', 'active', 'paused', 'ended'),
            defaultValue: 'waiting',
            allowNull: false
        },
        startedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'started_at'
        },
        endedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'ended_at'
        }
    }, {
        tableName: 'game_sessions',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false
    });

    return GameSession;
}

module.exports = defineGameSessionModel;
