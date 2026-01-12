import { useState, useEffect, useReducer } from "react";
import socketService from "./services/socket";
import Header from "./components/Header";
import GameControls from "./components/GameControls";
import StatsPanel from "./components/StatsPanel";
import LiveAnswers from "./components/LiveAnswers";
import LeaderboardPanel from "./components/LeaderboardPanel";
import QuestionManager from "./components/QuestionManager";
import CurrentQuestion from "./components/CurrentQuestion";
import Toast from "./components/Toast";
import "./styles/App.css";

function hostReducer(state, action) {
  switch (action.type) {
    case "SET_CONNECTION":
      return { ...state, connectionStatus: action.payload };

    case "HOST_CONNECTED":
      return { ...state, ...action.payload };

    case "PARTICIPANT_COUNT":
      return { ...state, participantCount: action.payload.count };

    case "PARTICIPANT_JOINED":
      return {
        ...state,
        recentJoins: [
          action.payload.participant,
          ...state.recentJoins.slice(0, 9),
        ],
      };

    case "QUESTION_STARTED":
      return {
        ...state,
        gameState: { ...state.gameState, status: "active" },
        currentQuestion: action.payload.questionNumber,
        currentQuestionData: action.payload.question,
        answerStats: [],
        showLeaderboardCountdown: false,
      };

    case "QUESTION_ENDED":
      return {
        ...state,
        gameState: { ...state.gameState, status: "waiting" },
        questionResults: action.payload.results,
        leaderboard: action.payload.leaderboard,
        currentQuestionData: null,
        showLeaderboardCountdown: true,
      };

    case "GAME_ENDED":
      return {
        ...state,
        gameState: { status: "waiting" },
        currentQuestion: 0,
        currentQuestionData: null,
        answerStats: [],
        questionResults: null,
      };

    case "ANSWER_SUBMITTED":
      return {
        ...state,
        answerStats: [...state.answerStats, action.payload],
      };

    case "LEADERBOARD_UPDATE":
      return { ...state, leaderboard: action.payload };

    default:
      return state;
  }
}

const initialState = {
  connectionStatus: "disconnected",
  gameState: null,
  participantCount: 0,
  currentQuestion: 0,
  currentQuestionData: null,
  totalQuestions: 10,
  recentJoins: [],
  answerStats: [],
  questionResults: null,
  leaderboard: null,
  showLeaderboardCountdown: false,
};

function App() {
  const [state, dispatch] = useReducer(hostReducer, initialState);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [customQuestions, setCustomQuestions] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard"); // "dashboard" or "questions"
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "info",
  });

  useEffect(() => {
    socketService.connect();

    socketService.on("connection_status", (data) => {
      dispatch({ type: "SET_CONNECTION", payload: data.status });
    });

    socketService.on("host_connected", (data) => {
      dispatch({ type: "HOST_CONNECTED", payload: data });
      if (!data.gameState || data.gameState.status !== "active") {
        setCurrentQuestionIndex(0);
        // Reset game state if not active
        if (data.gameState && data.gameState.status !== "active") {
          dispatch({
            type: "QUESTION_ENDED",
            payload: { results: null, leaderboard: null },
          });
        }
      }
    });

    socketService.on("participant_count", (data) => {
      dispatch({ type: "PARTICIPANT_COUNT", payload: data });
    });

    socketService.on("participant_joined", (data) => {
      dispatch({ type: "PARTICIPANT_JOINED", payload: data });
    });

    socketService.on("question_started", (data) => {
      dispatch({ type: "QUESTION_STARTED", payload: data });

      // Update currentQuestionIndex to the next question index (0-based)
      // questionNumber is 1-based, so questionNumber 3 means we're on question 3 (index 2)
      // Next question would be question 4 (index 3), so we set index to questionNumber
      if (data.questionNumber) {
        setCurrentQuestionIndex(data.questionNumber); // This is the index for the NEXT question
      }

      // Show toast notification
      if (data.questionNumber === 1) {
        setToast({
          show: true,
          message: "🎮 Game Started!",
          type: "success",
        });
      } else {
        setToast({
          show: true,
          message: `📝 Question ${data.questionNumber} Started`,
          type: "info",
        });
      }
    });

    socketService.on("answer_submitted", (data) => {
      dispatch({ type: "ANSWER_SUBMITTED", payload: data });
    });

    socketService.on("question_ended", (data) => {
      dispatch({ type: "QUESTION_ENDED", payload: data });
    });

    socketService.on("leaderboard_update", (data) => {
      dispatch({ type: "LEADERBOARD_UPDATE", payload: data });
    });

    socketService.on("game_ended", () => {
      setCurrentQuestionIndex(0);
      dispatch({
        type: "GAME_ENDED",
      });
    });

    return () => {
      socketService.disconnect();
    };
  }, []);

  const handleStartQuestion = () => {
    // Calculate the next question index based on current state
    // state.currentQuestion is 1-based (question number), so if we're on question 3,
    // we want to start question 4, which is at index 3 (0-based)
    // So we use state.currentQuestion directly as the next index
    const nextQuestionIndex = state.currentQuestion || currentQuestionIndex;

    console.log("Starting question:", {
      currentQuestion: state.currentQuestion,
      currentQuestionIndex,
      nextQuestionIndex,
    });

    socketService.emit("start_question", {
      questionIndex: nextQuestionIndex, // 0-based index for the next question
    });
    // Don't increment here - let the question_started event update it
    // This prevents double-increment when auto-advance happens
  };

  const handleEndQuestion = () => {
    socketService.emit("end_question");
  };

  const handlePauseGame = () => {
    socketService.emit("pause_game");
  };

  const handleEndGame = () => {
    if (window.confirm("Are you sure you want to end the game?")) {
      setCurrentQuestionIndex(0); // Instantly reset for UI
      socketService.emit("end_game");
    }
  };

  const handleQuestionsUpdate = (questions) => {
    setCustomQuestions(questions);
  };

  return (
    <div className="host-dashboard">
      <Header
        connectionStatus={state.connectionStatus}
        participantCount={state.participantCount}
      />

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button
          className={`tab-btn ${activeTab === "dashboard" ? "active" : ""}`}
          onClick={() => setActiveTab("dashboard")}
        >
          🎮 Dashboard
        </button>
        <button
          className={`tab-btn ${activeTab === "questions" ? "active" : ""}`}
          onClick={() => setActiveTab("questions")}
        >
          📝 Questions
        </button>
      </div>

      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />

      {activeTab === "dashboard" ? (
        <div className="dashboard-content">
          <div className="main-panel">
            <GameControls
              currentQuestion={state.currentQuestion}
              totalQuestions={state.totalQuestions}
              gameStatus={state.gameState?.status}
              onStartQuestion={handleStartQuestion}
              onEndQuestion={handleEndQuestion}
              onPauseGame={handlePauseGame}
              onEndGame={handleEndGame}
              canStartNext={currentQuestionIndex < state.totalQuestions}
            />

            {state.currentQuestionData && (
              <CurrentQuestion
                question={state.currentQuestionData}
                questionNumber={state.currentQuestion}
              />
            )}

            <StatsPanel
              participantCount={state.participantCount}
              answerCount={state.answerStats.length}
              recentJoins={state.recentJoins}
            />

            {state.answerStats.length > 0 && (
              <LiveAnswers answers={state.answerStats} />
            )}
          </div>

          <div className="side-panel">
            <LeaderboardPanel leaderboard={state.leaderboard} />
          </div>
        </div>
      ) : (
        <div className="questions-content">
          <QuestionManager onQuestionsUpdate={handleQuestionsUpdate} />
        </div>
      )}
    </div>
  );
}

export default App;
