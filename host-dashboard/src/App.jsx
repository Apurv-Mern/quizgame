import { useState, useEffect, useReducer } from "react";
import socketService from "./services/socket";
import Header from "./components/Header";
import GameControls from "./components/GameControls";
import StatsPanel from "./components/StatsPanel";
import LiveAnswers from "./components/LiveAnswers";
import LeaderboardPanel from "./components/LeaderboardPanel";
import QuestionManager from "./components/QuestionManager";
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
        answerStats: [],
      };

    case "ANSWER_SUBMITTED":
      return {
        ...state,
        answerStats: [...state.answerStats, action.payload],
      };

    case "QUESTION_ENDED":
      return {
        ...state,
        questionResults: action.payload.results,
        leaderboard: action.payload.leaderboard,
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
  totalQuestions: 10,
  recentJoins: [],
  answerStats: [],
  questionResults: null,
  leaderboard: null,
};

function App() {
  const [state, dispatch] = useReducer(hostReducer, initialState);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [customQuestions, setCustomQuestions] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard"); // "dashboard" or "questions"

  useEffect(() => {
    socketService.connect();

    socketService.on("connection_status", (data) => {
      dispatch({ type: "SET_CONNECTION", payload: data.status });
    });

    socketService.on("host_connected", (data) => {
      dispatch({ type: "HOST_CONNECTED", payload: data });
    });

    socketService.on("participant_count", (data) => {
      dispatch({ type: "PARTICIPANT_COUNT", payload: data });
    });

    socketService.on("participant_joined", (data) => {
      dispatch({ type: "PARTICIPANT_JOINED", payload: data });
    });

    socketService.on("question_started", (data) => {
      dispatch({ type: "QUESTION_STARTED", payload: data });
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

    return () => {
      socketService.disconnect();
    };
  }, []);

  const handleStartQuestion = () => {
    socketService.emit("start_question", {
      questionIndex: currentQuestionIndex,
    });
    setCurrentQuestionIndex((prev) => prev + 1);
  };

  const handleEndQuestion = () => {
    socketService.emit("end_question");
  };

  const handlePauseGame = () => {
    socketService.emit("pause_game");
  };

  const handleEndGame = () => {
    if (window.confirm("Are you sure you want to end the game?")) {
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
