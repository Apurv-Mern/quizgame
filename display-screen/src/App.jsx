import { useState, useEffect } from "react";
import socketService from "./services/socket";
import WaitingScreen from "./components/WaitingScreen";
import QuestionDisplay from "./components/QuestionDisplay";
import Leaderboard from "./components/Leaderboard";
import ShowCorrectAnswer from "./components/ShowCorrectAnswer";
import "./styles/App.css";

function App() {
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const [screen, setScreen] = useState("waiting"); // waiting, question, leaderboard, gameEnded
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [leaderboard, setLeaderboard] = useState(null);
  const [participantCount, setParticipantCount] = useState(0);
  const [showAnswer, setShowAnswer] = useState(null);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(10);

  useEffect(() => {
    socketService.connect();

    socketService.on("connection_status", (data) => {
      setConnectionStatus(data.status);
    });

    socketService.on("participant_count", (data) => {
      setParticipantCount(data.count);
    });

    socketService.on("display_connected", (data) => {
      console.log("📺 Display connected with game state:", data.gameState);
      setParticipantCount(data.participantCount);
      // Stay on waiting screen when first connecting
      // Game flow events will update the screen as needed
    });

    socketService.on("current_question", (data) => {
      setCurrentQuestion(data.question);
      setScreen("question");
    });

    socketService.on("leaderboard_update", (data) => {
      setLeaderboard(data);
      // Leaderboard updates do not automatically change screen
      // Screen changes are controlled by explicit events like show_correct_answer
    });

    socketService.on("new_question", (data) => {
      setCurrentQuestion(data.question);
      setQuestionNumber(data.questionNumber);
      setTotalQuestions(data.totalQuestions);
      setScreen("question");
    });

    socketService.on("game_ended", (data) => {
      console.log("🏁 Game ended, showing final leaderboard");
      setLeaderboard(data.leaderboard);
      setScreen("gameEnded");
    });

    socketService.on("show_correct_answer", (data) => {
      setShowAnswer({
        question: data.question,
        correctAnswer: data.correctAnswer,
      });
      setScreen("showAnswer");
    });

    return () => {
      socketService.disconnect();
    };
  }, []);

  return (
    <div className="display-app">
      {screen === "waiting" && (
        <WaitingScreen participantCount={participantCount} />
      )}

      {screen === "question" && currentQuestion && (
        <QuestionDisplay question={currentQuestion} />
      )}

      {(screen === "leaderboard" || screen === "gameEnded") && leaderboard && (
        <Leaderboard
          data={leaderboard}
          showFinalMessage={screen === "gameEnded"}
          questionNumber={questionNumber}
          totalQuestions={totalQuestions}
        />
      )}

      {screen === "showAnswer" && showAnswer && (
        <ShowCorrectAnswer
          question={showAnswer.question}
          correctAnswer={showAnswer.correctAnswer}
        />
      )}

      <div className={`connection-indicator ${connectionStatus}`}>
        {connectionStatus === "connected" ? "● LIVE" : "○ OFFLINE"}
      </div>

      <div className="screen-debug">Screen: {screen}</div>

      {(screen === "gameEnded" || screen === "leaderboard") && (
        <button
          className="reset-button"
          onClick={() => {
            console.log("🔄 Manual reset to waiting screen");
            setScreen("waiting");
            setLeaderboard(null);
            setCurrentQuestion(null);
          }}
        >
          {screen === "gameEnded" ? "Reset to Home Screen" : "Back to Home"}
        </button>
      )}
    </div>
  );
}

export default App;
