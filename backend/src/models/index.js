/**
 * Models Index
 * Initializes all Sequelize models with proper associations
 */

const { getSequelize } = require('../config/sequelize');
const defineQuestionModel = require('./QuestionModel');
const defineGameSessionModel = require('./GameSessionModel');
const defineParticipantModel = require('./ParticipantModel');
const defineAnswerModel = require('./AnswerModel');

let models = null;

/**
 * Initialize all models
 */
function initializeModels() {
    if (models) {
        return models;
    }

    const sequelize = getSequelize();

    // Define models
    const Question = defineQuestionModel(sequelize);
    const GameSession = defineGameSessionModel(sequelize);
    const ParticipantModel = defineParticipantModel(sequelize, GameSession);
    const Answer = defineAnswerModel(sequelize, ParticipantModel);

    models = {
        Question,
        GameSession,
        ParticipantModel,
        Answer,
        sequelize
    };

    return models;
}

/**
 * Get initialized models
 */
function getModels() {
    if (!models) {
        return initializeModels();
    }
    return models;
}

module.exports = {
    initializeModels,
    getModels
};
