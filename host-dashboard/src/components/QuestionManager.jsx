import { useState, useEffect } from "react";
import questionsAPI from "../services/questionsAPI";
import { staticQuestions } from "../data/staticQuestions";
import "./QuestionManager.css";

function QuestionManager({ onQuestionsUpdate }) {
  const [questions, setQuestions] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const COMMON_TIME_LIMIT = 30; // Fixed 30 seconds for all questions

  // Load existing questions or initialize with empty ones
  useEffect(() => {
    // If staticQuestions exist, use them for initialization
    if (staticQuestions && staticQuestions.length > 0) {
      // Ensure all questions have 30 second time limit
      const questionsWithFixedTime = staticQuestions.map((q) => ({
        ...q,
        timeLimit: COMMON_TIME_LIMIT,
      }));
      setQuestions(questionsWithFixedTime);
      setLoading(false);
    } else {
      loadQuestions();
    }
  }, []);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const response = await questionsAPI.loadQuestions();

      if (response.success && response.questions.length > 0) {
        // Pad to 10 questions if less
        const loadedQuestions = response.questions;
        while (loadedQuestions.length < 10) {
          loadedQuestions.push({
            id: `q${loadedQuestions.length + 1}`,
            text: "",
            options: [
              { id: "a", text: "" },
              { id: "b", text: "" },
              { id: "c", text: "" },
              { id: "d", text: "" },
            ],
            correctAnswer: "a",
            timeLimit: 30,
            clue1: "",
            clue2: "",
            clue3: "",
          });
        }
        // Ensure clues exist for all loaded questions and set time limit to 30
        loadedQuestions.forEach((q) => {
          q.clue1 = q.clue1 || "";
          q.clue2 = q.clue2 || "";
          q.clue3 = q.clue3 || "";
          q.timeLimit = COMMON_TIME_LIMIT;
        });
        setQuestions(loadedQuestions.slice(0, 10));
      } else {
        // Initialize with empty questions
        const initialQuestions = Array.from({ length: 10 }, (_, i) => ({
          id: `q${i + 1}`,
          text: "",
          options: [
            { id: "a", text: "" },
            { id: "b", text: "" },
            { id: "c", text: "" },
            { id: "d", text: "" },
          ],
          correctAnswer: "a",
          timeLimit: 30,
          clue1: "",
          clue2: "",
          clue3: "",
        }));
        setQuestions(initialQuestions);
      }
    } catch (error) {
      console.error("Failed to load questions:", error);
      // Initialize with empty questions on error
      const initialQuestions = Array.from({ length: 10 }, (_, i) => ({
        id: `q${i + 1}`,
        text: "",
        options: [
          { id: "a", text: "" },
          { id: "b", text: "" },
          { id: "c", text: "" },
          { id: "d", text: "" },
        ],
        correctAnswer: "a",
        timeLimit: COMMON_TIME_LIMIT,
        clue1: "",
        clue2: "",
        clue3: "",
      }));
      setQuestions(initialQuestions);
    } finally {
      setLoading(false);
    }
  };

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
    onQuestionsUpdate?.(updated);
  };

  const handleClueChange = (qIndex, clueNum, value) => {
    const updated = [...questions];
    updated[qIndex][`clue${clueNum}`] = value;
    setQuestions(updated);
    onQuestionsUpdate?.(updated);
  };

  const handleOptionChange = (qIndex, optionId, value) => {
    const updated = [...questions];
    const optionIndex = updated[qIndex].options.findIndex(
      (opt) => opt.id === optionId
    );
    updated[qIndex].options[optionIndex].text = value;
    setQuestions(updated);
    onQuestionsUpdate?.(updated);
  };

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const isQuestionComplete = (question) => {
    return (
      question.text.trim() !== "" &&
      question.options.every((opt) => opt.text.trim() !== "") &&
      (question.clue1?.trim() || "") !== "" &&
      (question.clue2?.trim() || "") !== "" &&
      (question.clue3?.trim() || "") !== ""
    );
  };

  const getCompletedCount = () => {
    return questions.filter(isQuestionComplete).length;
  };

  const handleSaveQuestions = async () => {
    try {
      setSaving(true);
      setMessage(null);

      // Filter only complete questions and ensure all have 30 second time limit
      const completeQuestions = questions
        .filter(isQuestionComplete)
        .map((q) => ({
          ...q,
          timeLimit: COMMON_TIME_LIMIT,
        }));

      if (completeQuestions.length === 0) {
        setMessage({ type: "error", text: "No complete questions to save" });
        return;
      }

      const response = await questionsAPI.saveQuestions(completeQuestions);

      if (response.success) {
        setMessage({
          type: "success",
          text: `✅ Successfully saved ${completeQuestions.length} questions!`,
        });
        onQuestionsUpdate?.(completeQuestions);

        // Clear message after 3 seconds
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: `❌ Error: ${error.message}`,
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="question-manager">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="question-manager">
      <div className="manager-header">
        <h2>📝 Question Manager</h2>
        <div className="progress-badge">
          {getCompletedCount()} / 14 Complete
        </div>
      </div>

      {message && (
        <div className={`message-banner ${message.type}`}>{message.text}</div>
      )}

      <div className="questions-list">
        {questions.map((question, index) => (
          <div
            key={question.id}
            className={`question-card ${
              expandedIndex === index ? "expanded" : ""
            } ${isQuestionComplete(question) ? "complete" : ""}`}
          >
            <div
              className="question-card-header"
              onClick={() => toggleExpand(index)}
            >
              <div className="question-number">
                <span className="number-badge">Q{index + 1}</span>
                {isQuestionComplete(question) && (
                  <span className="check-icon">✓</span>
                )}
              </div>
              <div className="question-preview">
                {question.text || "Empty question - click to edit"}
              </div>
              <button className="expand-btn">
                {expandedIndex === index ? "▲" : "▼"}
              </button>
            </div>

            {expandedIndex === index && (
              <div className="question-card-body">
                <div
                  className="form-group clues-group"
                  style={{ marginBottom: "1em" }}
                >
                  <label
                    style={{
                      fontWeight: "bold",
                      marginBottom: "0.5em",
                      display: "block",
                    }}
                  >
                    Clues
                  </label>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5em",
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: "500", marginRight: "0.5em" }}>
                        Clue 1:
                      </span>
                      <input
                        type="text"
                        value={question.clue1 || ""}
                        readOnly
                        disabled
                        placeholder="Enter first clue"
                        style={{
                          width: "80%",
                          padding: "6px",
                          borderRadius: "4px",
                          border: "1px solid #ccc",
                        }}
                      />
                    </div>
                    <div>
                      <span style={{ fontWeight: "500", marginRight: "0.5em" }}>
                        Clue 2:
                      </span>
                      <input
                        type="text"
                        value={question.clue2 || ""}
                        readOnly
                        disabled
                        placeholder="Enter second clue"
                        style={{
                          width: "80%",
                          padding: "6px",
                          borderRadius: "4px",
                          border: "1px solid #ccc",
                        }}
                      />
                    </div>
                    <div>
                      <span style={{ fontWeight: "500", marginRight: "0.5em" }}>
                        Clue 3:
                      </span>
                      <input
                        type="text"
                        value={question.clue3 || ""}
                        readOnly
                        disabled
                        placeholder="Enter third clue"
                        style={{
                          width: "80%",
                          padding: "6px",
                          borderRadius: "4px",
                          border: "1px solid #ccc",
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label>Options</label>
                  <div className="options-grid">
                    {question.options.map((option) => (
                      <div key={option.id} className="option-input-row">
                        <div className="option-label">
                          {option.id.toUpperCase()}
                        </div>
                        <input
                          type="text"
                          value={option.text}
                          readOnly
                          disabled
                          placeholder={`Option ${option.id.toUpperCase()}`}
                        />
                        <label className="radio-label">
                          <input
                            type="radio"
                            name={`correct-${index}`}
                            checked={question.correctAnswer === option.id}
                            readOnly
                            disabled
                          />
                          <span className="radio-text">Correct</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* <div className="form-group">
                  <label>Time Limit (seconds)</label>
                  <input
                    type="text"
                    value={COMMON_TIME_LIMIT}
                    readOnly
                    disabled
                    style={{ width: 120 }}
                  />
                </div> */}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* <div className="manager-footer">
        <button
          className="save-btn"
          disabled={getCompletedCount() === 0 || saving}
          onClick={handleSaveQuestions}
        >
          {saving ? "💾 Saving..." : "💾 Save Questions"}
        </button>
      </div> */}
    </div>
  );
}

export default QuestionManager;
