/**
 * Socket.IO Event Handlers
 * Manages WebSocket connections and real-time events
 */

const gameService = require('../services/gameService');

/**
 * Setup Socket.IO event handlers
 */
function setupSocketHandlers(io) {
    // Track connected sockets
    const connectedSockets = new Map(); // socketId -> { type: 'participant' | 'host' | 'display' }

    io.on('connection', (socket) => {
        console.log(`🔌 New connection: ${socket.id}`);

        /**
         * Client identifies their role (participant, host, display)
         */
        socket.on('identify', ({ role }) => {
            connectedSockets.set(socket.id, { role, connectedAt: Date.now() });
            console.log(`👤 Client identified as: ${role} (${socket.id})`);
        });

        /**
         * Participant joins the game
         */
        socket.on('join_game', ({ nickname }) => {
            const result = gameService.addParticipant(nickname, socket.id);

            if (result.success) {
                // Send confirmation to participant
                socket.emit('game_joined', {
                    success: true,
                    participant: result.participant,
                    gameState: gameService.getGameState()
                });

                // Join participant room
                socket.join('participants');

                // Broadcast updated participant count
                io.emit('participant_count', {
                    count: gameService.getParticipantCount()
                });

                // Notify host
                io.to('host').emit('participant_joined', {
                    participant: result.participant
                });
            } else {
                // Send error to participant
                socket.emit('game_joined', {
                    success: false,
                    error: result.error
                });
            }
        });

        /**
         * Host starts a question
         */
        socket.on('start_question', ({ questionIndex }) => {
            // If there was a previous question, show the correct answer first
            const prevIndex = questionIndex - 1;
            if (prevIndex >= 0 && gameService.questions[prevIndex]) {
                const prevQ = gameService.questions[prevIndex];
                io.to('display').emit('show_correct_answer', {
                    question: prevQ.toClientFormat(),
                    correctAnswer: prevQ.correctAnswer
                });
                // Wait 5 seconds before sending the next question
                setTimeout(() => {
                    const result = gameService.startQuestion(questionIndex, () => {
                        handleQuestionEnd(io);
                    });
                    if (result.success) {
                        socket.emit('question_started', {
                            success: true,
                            questionNumber: result.questionNumber
                        });
                        io.to('participants').emit('new_question', {
                            question: result.question,
                            questionNumber: result.questionNumber,
                            totalQuestions: result.totalQuestions
                        });
                        io.to('display').emit('new_question', {
                            question: result.question,
                            questionNumber: result.questionNumber,
                            totalQuestions: result.totalQuestions
                        });
                    } else {
                        socket.emit('question_started', {
                            success: false,
                            error: result.error
                        });
                    }
                }, 5000);
            } else {
                // No previous question, just start as normal
                const result = gameService.startQuestion(questionIndex, () => {
                    handleQuestionEnd(io);
                });
                if (result.success) {
                    socket.emit('question_started', {
                        success: true,
                        questionNumber: result.questionNumber
                    });
                    io.to('participants').emit('new_question', {
                        question: result.question,
                        questionNumber: result.questionNumber,
                        totalQuestions: result.totalQuestions
                    });
                    io.to('display').emit('new_question', {
                        question: result.question,
                        questionNumber: result.questionNumber,
                        totalQuestions: result.totalQuestions
                    });
                } else {
                    socket.emit('question_started', {
                        success: false,
                        error: result.error
                    });
                }
            }
        });

        /**
         * Host manually ends a question
         */
        socket.on('end_question', () => {
            handleQuestionEnd(io);
        });

        /**
         * Participant submits an answer
         */
        socket.on('submit_answer', ({ questionId, answerId, clientTimestamp }) => {
            const result = gameService.submitAnswer(socket.id, questionId, answerId);

            // Send acknowledgment to participant
            socket.emit('answer_received', {
                success: result.success,
                isCorrect: result.isCorrect,
                points: result.points,
                error: result.error
            });

            if (result.success) {
                // Send real-time stats to host
                const participant = gameService.getParticipantBySocket(socket.id);
                if (participant) {
                    io.to('host').emit('answer_submitted', {
                        participantId: participant.id,
                        nickname: participant.nickname,
                        answerId,
                        isCorrect: result.isCorrect,
                        responseTime: result.responseTime
                    });
                }
            }
        });

        /**
         * Host requests current stats
         */
        socket.on('get_stats', () => {
            const gameState = gameService.getGameState();
            const leaderboard = gameService.getLeaderboard();

            socket.emit('current_stats', {
                gameState,
                leaderboard,
                participantCount: gameService.getParticipantCount()
            });
        });

        /**
         * Client requests leaderboard
         */
        socket.on('get_leaderboard', () => {
            const leaderboard = gameService.getLeaderboard();
            socket.emit('leaderboard_update', leaderboard);
        });

        /**
         * Host pauses the game
         */
        socket.on('pause_game', () => {
            gameService.pauseGame();
            io.emit('game_paused', {
                message: 'Game paused by host'
            });
        });

        /**
         * Host ends the game
         */
        socket.on('end_game', () => {
            gameService.endGame();
            const finalLeaderboard = gameService.getLeaderboard();

            io.emit('game_ended', {
                message: 'Game has ended',
                leaderboard: finalLeaderboard
            });
        });

        /**
         * Host joins (separate room for host-only events)
         */
        socket.on('join_as_host', () => {
            socket.join('host');
            connectedSockets.set(socket.id, { role: 'host' });

            // Send current game state
            socket.emit('host_connected', {
                gameState: gameService.getGameState(),
                participantCount: gameService.getParticipantCount()
            });

            console.log('👨‍💼 Host connected');
        });

        /**
         * Display screen joins (for big screen leaderboard)
         */
        socket.on('join_as_display', () => {
            socket.join('display');
            connectedSockets.set(socket.id, { role: 'display' });

            // Send current game state
            const gameState = gameService.getGameState();
            socket.emit('display_connected', {
                gameState,
                participantCount: gameService.getParticipantCount()
            });

            console.log('📺 Display screen connected');
        });

        /**
         * Heartbeat / ping for connection monitoring
         */
        socket.on('heartbeat', () => {
            const participant = gameService.getParticipantBySocket(socket.id);
            if (participant) {
                participant.updateHeartbeat();
            }
            socket.emit('heartbeat_ack', { timestamp: Date.now() });
        });

        /**
         * Handle disconnection
         */
        socket.on('disconnect', () => {
            console.log(`🔌 Disconnected: ${socket.id}`);

            const socketInfo = connectedSockets.get(socket.id);

            // Remove participant if they were playing
            const participant = gameService.removeParticipant(socket.id);
            if (participant) {
                // Broadcast updated count
                io.emit('participant_count', {
                    count: gameService.getParticipantCount()
                });

                // Notify host
                io.to('host').emit('participant_left', {
                    participantId: participant.id,
                    nickname: participant.nickname
                });
            }

            connectedSockets.delete(socket.id);
        });

        /**
         * Error handling
         */
        socket.on('error', (error) => {
            console.error(`Socket error (${socket.id}):`, error);
        });
    });

    /**
     * Helper: Handle question end
     */
    function handleQuestionEnd(io) {
        const endResult = gameService.endQuestion();

        if (endResult.success) {
            // Update leaderboard
            const leaderboard = gameService.updateLeaderboard();

            // Send results to host
            io.to('host').emit('question_ended', {
                results: endResult.results,
                leaderboard
            });

            // Send results to participants (with personal rank)
            const participants = Array.from(gameService.participants.values());
            participants.forEach(participant => {
                const socket = io.sockets.sockets.get(participant.socketId);
                if (socket) {
                    const personalRank = gameService.getParticipantRank(participant.id);
                    const answer = participant.answers.get(endResult.results.id);

                    socket.emit('question_results', {
                        correctAnswer: endResult.results.correctAnswer,
                        yourAnswer: answer ? answer.answerId : null,
                        isCorrect: answer ? answer.isCorrect : false,
                        points: answer ? answer.points : 0,
                        totalScore: participant.totalScore,
                        rank: personalRank
                    });
                }
            });

            // Broadcast leaderboard update
            io.emit('leaderboard_update', leaderboard);
        }
    }

    // Periodic cleanup of stale connections (every 60 seconds)
    setInterval(() => {
        const now = Date.now();
        const staleThreshold = 90000; // 90 seconds

        gameService.participants.forEach((participant) => {
            const timeSinceHeartbeat = now - participant.lastHeartbeat;
            if (timeSinceHeartbeat > staleThreshold) {
                console.log(`🧹 Cleaning up stale participant: ${participant.nickname}`);
                gameService.removeParticipant(participant.socketId);
            }
        });
    }, 60000);

    console.log('✅ Socket handlers initialized');
}

module.exports = setupSocketHandlers;
