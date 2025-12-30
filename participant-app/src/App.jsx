import { useState, useEffect, useReducer } from "react";
import socketService from "./services/socket";
import NicknameEntry from "./components/NicknameEntry";
import WaitingRoom from "./components/WaitingRoom";
import QuestionView from "./components/QuestionView";
import ResultsView from "./components/ResultsView";
import ConnectionStatus from "./components/ConnectionStatus";
import "./styles/App.css";

// Game state reducer
function gameReducer(state, action) {
  switch (action.type) {
    case "SET_CONNECTION":
      return { ...state, connectionStatus: action.payload };

    case "JOIN_SUCCESS":
      return {
        ...state,
        participant: action.payload.participant,
        gameState: action.payload.gameState,
        screen: "waiting",
      };

    case "JOIN_ERROR":
      return { ...state, error: action.payload };

    case "NEW_QUESTION":
      return {
        ...state,
        screen: "question",
        currentQuestion: action.payload.question,
        questionNumber: action.payload.questionNumber,
        totalQuestions: action.payload.totalQuestions,
        selectedAnswer: null,
        answerSubmitted: false,
        answerResult: null,
      };

    case "SELECT_ANSWER":
      return { ...state, selectedAnswer: action.payload };

    case "ANSWER_SUBMITTED":
      return { ...state, answerSubmitted: true };

    case "ANSWER_RECEIVED":
      return { ...state, answerResult: action.payload };

    case "QUESTION_RESULTS":
      return {
        ...state,
        screen: "results",
        questionResults: action.payload,
      };

    case "LEADERBOARD_UPDATE":
      return { ...state, leaderboard: action.payload };

    case "PARTICIPANT_COUNT":
      return { ...state, participantCount: action.payload.count };

    case "GAME_ENDED":
      return {
        ...state,
        screen: "ended",
        finalLeaderboard: action.payload.leaderboard,
      };

    default:
      return state;
  }
}

const initialState = {
  screen: "entry", // entry, waiting, question, results, ended
  connectionStatus: "disconnected",
  participant: null,
  gameState: null,
  currentQuestion: null,
  questionNumber: 0,
  totalQuestions: 10,
  selectedAnswer: null,
  answerSubmitted: false,
  answerResult: null,
  questionResults: null,
  leaderboard: null,
  participantCount: 0,
  error: null,
};

function App() {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  useEffect(() => {
    // Connect to WebSocket server
    socketService.connect();

    // Check for existing session on load
    const savedSession = sessionStorage.getItem("quiz_participant");
    if (savedSession) {
      try {
        const { nickname, participantId } = JSON.parse(savedSession);
        console.log("🔄 Attempting to reconnect as:", nickname);
        // Auto-rejoin with saved credentials
        socketService.emit("join_game", { nickname, reconnect: true });
      } catch (error) {
        console.error("Failed to restore session:", error);
        sessionStorage.removeItem("quiz_participant");
      }
    }

    // Setup event listeners
    socketService.on("connection_status", (data) => {
      dispatch({ type: "SET_CONNECTION", payload: data.status });
    });

    socketService.on("game_joined", (data) => {
      if (data.success) {
        // Save session to sessionStorage for reconnection
        sessionStorage.setItem(
          "quiz_participant",
          JSON.stringify({
            nickname: data.participant.nickname,
            participantId: data.participant.id,
          })
        );
        dispatch({ type: "JOIN_SUCCESS", payload: data });
      } else {
        dispatch({ type: "JOIN_ERROR", payload: data.error });
      }
    });

    socketService.on("new_question", (data) => {
      dispatch({ type: "NEW_QUESTION", payload: data });
    });

    socketService.on("answer_received", (data) => {
      dispatch({ type: "ANSWER_RECEIVED", payload: data });
    });

    socketService.on("question_results", (data) => {
      dispatch({ type: "QUESTION_RESULTS", payload: data });
    });

    socketService.on("leaderboard_update", (data) => {
      dispatch({ type: "LEADERBOARD_UPDATE", payload: data });
    });

    socketService.on("participant_count", (data) => {
      dispatch({ type: "PARTICIPANT_COUNT", payload: data });
    });

    socketService.on("game_ended", (data) => {
      // Clear session when game ends
      sessionStorage.removeItem("quiz_participant");
      dispatch({ type: "GAME_ENDED", payload: data });
    });

    // Cleanup on unmount
    return () => {
      socketService.disconnect();
    };
  }, []);

  const handleJoinGame = (nickname) => {
    socketService.emit("join_game", { nickname });
  };

  const handleAnswerSelect = (answerId) => {
    if (state.answerSubmitted) return;
    // Just select the answer, don't submit yet
    dispatch({ type: "SELECT_ANSWER", payload: answerId });
  };

  const handleAnswerSubmit = () => {
    if (!state.selectedAnswer || state.answerSubmitted) return;

    dispatch({ type: "ANSWER_SUBMITTED" });
    socketService.emit("submit_answer", {
      questionId: state.currentQuestion.id,
      answerId: state.selectedAnswer,
      clientTimestamp: Date.now(),
    });
  };

  return (
    <div className="app">
      <ConnectionStatus status={state.connectionStatus} />

      {state.screen === "entry" && (
        <NicknameEntry
          onJoin={handleJoinGame}
          error={state.error}
          participantCount={state.participantCount}
        />
      )}

      {state.screen === "waiting" && (
        <WaitingRoom
          participant={state.participant}
          participantCount={state.participantCount}
        />
      )}

      {state.screen === "question" && (
        <QuestionView
          question={state.currentQuestion}
          questionNumber={state.questionNumber}
          totalQuestions={state.totalQuestions}
          selectedAnswer={state.selectedAnswer}
          answerSubmitted={state.answerSubmitted}
          answerResult={state.answerResult}
          onAnswerSelect={handleAnswerSelect}
          onAnswerSubmit={handleAnswerSubmit}
        />
      )}

      {state.screen === "results" && (
        <ResultsView
          results={state.questionResults}
          leaderboard={state.leaderboard}
          participant={state.participant}
          questionNumber={state.questionNumber}
          totalQuestions={state.totalQuestions}
        />
      )}

      {state.screen === "ended" && (
        <div className="game-ended">
          <h1>🏁 Game Ended</h1>
          <p>Thanks for playing!</p>
          {state.finalLeaderboard && (
            <div className="final-leaderboard">
              <h2>Final Top 10</h2>
              {state.finalLeaderboard.top10?.map((p) => (
                <div key={p.participantId} className="leaderboard-entry">
                  <span className="rank">#{p.rank}</span>
                  <span className="nickname">{p.nickname}</span>
                  <span className="score">{p.score}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
