import { useState, useEffect } from "react";
import socketService from "./services/socket";
import WaitingScreen from "./components/WaitingScreen";
import QuestionDisplay from "./components/QuestionDisplay";
import Leaderboard from "./components/Leaderboard";
import "./styles/App.css";

function App() {
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const [screen, setScreen] = useState("waiting"); // waiting, question, leaderboard, gameEnded
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [leaderboard, setLeaderboard] = useState(null);
  const [participantCount, setParticipantCount] = useState(0);

  useEffect(() => {
    socketService.connect();

    socketService.on("connection_status", (data) => {
      setConnectionStatus(data.status);
    });

    socketService.on("participant_count", (data) => {
      setParticipantCount(data.count);
    });

    socketService.on("current_question", (data) => {
      setCurrentQuestion(data.question);
      setScreen("question");

      // Auto-switch to leaderboard after question time + 5s buffer
      setTimeout(() => {
        setScreen("leaderboard");
      }, (data.question.timeLimit + 5) * 1000);
    });

    socketService.on("leaderboard_update", (data) => {
      setLeaderboard(data);
      if (screen !== "question") {
        setScreen("leaderboard");
      }
    });

    socketService.on("new_question", (data) => {
      setCurrentQuestion(data.question);
      setScreen("question");
    });

    socketService.on("game_ended", (data) => {
      setLeaderboard(data.leaderboard);
      setScreen("gameEnded");

      // After 1 minute, return to waiting screen
      setTimeout(() => {
        setScreen("waiting");
        setLeaderboard(null);
        setCurrentQuestion(null);
      }, 60000); // 60 seconds = 1 minute
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
        />
      )}

      <div className={`connection-indicator ${connectionStatus}`}>
        {connectionStatus === "connected" ? "● LIVE" : "○ OFFLINE"}
      </div>
    </div>
  );
}

export default App;
