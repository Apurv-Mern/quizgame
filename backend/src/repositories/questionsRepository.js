/**
 * Questions Repository
 * Handles all database operations for questions using Sequelize ORM
 */

const { getModels } = require('../models');

class QuestionsRepository {
    getQuestionModel() {
        const { Question } = getModels();
        return Question;
    }

    /**
     * Save questions to database
     */
    async saveQuestions(questions) {
        try {
            const QuestionModel = this.getQuestionModel();

            const questionData = questions.map(q => ({
                id: q.id,
                text: q.text,
                options: q.options,
                correctAnswer: q.correctAnswer,
                timeLimit: q.timeLimit,
                clue1: q.clue1 || '',
                clue2: q.clue2 || '',
                clue3: q.clue3 || ''
            }));

            await QuestionModel.bulkCreate(questionData);

            return { success: true, count: questions.length };
        } catch (error) {
            console.error('Error saving questions:', error);
            throw error;
        }
    }

    /**
     * Load all questions
     */
    async loadQuestions() {
        try {
            const QuestionModel = this.getQuestionModel();

            const questions = await QuestionModel.findAll({
                order: [['id', 'ASC']]
            });

            return questions.map(q => ({
                id: q.id,
                text: q.text,
                options: q.options,
                correctAnswer: q.correctAnswer,
                timeLimit: q.timeLimit,
                clue1: q.clue1 || '',
                clue2: q.clue2 || '',
                clue3: q.clue3 || ''
            }));
        } catch (error) {
            console.error('Error loading questions:', error);
            throw error;
        }
    }

    /**
     * Get question by ID
     */
    async getQuestionById(id) {
        try {
            const QuestionModel = this.getQuestionModel();
            const question = await QuestionModel.findByPk(id);

            if (!question) {
                return null;
            }

            return {
                id: question.id,
                text: question.text,
                options: question.options,
                correctAnswer: question.correctAnswer,
                timeLimit: question.timeLimit,
                clue1: question.clue1 || '',
                clue2: question.clue2 || '',
                clue3: question.clue3 || ''
            };
        } catch (error) {
            console.error('Error getting question:', error);
            throw error;
        }
    }

    /**
     * Get questions count
     */
    async getQuestionsCount() {
        try {
            const QuestionModel = this.getQuestionModel();
            const count = await QuestionModel.count();
            return count;
        } catch (error) {
            console.error('Error getting questions count:', error);
            throw error;
        }
    }

    /**
     * Delete all questions
     */
    async deleteAllQuestions() {
        try {
            const QuestionModel = this.getQuestionModel();
            await QuestionModel.destroy({ where: {}, truncate: true });
            return { success: true };
        } catch (error) {
            console.error('Error deleting questions:', error);
            throw error;
        }
    }
}

module.exports = new QuestionsRepository();
