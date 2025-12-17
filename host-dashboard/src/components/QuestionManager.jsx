import { useState, useEffect } from "react";
import questionsAPI from "../services/questionsAPI";
import "./QuestionManager.css";

function QuestionManager({ onQuestionsUpdate }) {
  const [questions, setQuestions] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  // Load existing questions or initialize with empty ones
  useEffect(() => {
    loadQuestions();
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
          });
        }
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
        timeLimit: 30,
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
      question.options.every((opt) => opt.text.trim() !== "")
    );
  };

  const getCompletedCount = () => {
    return questions.filter(isQuestionComplete).length;
  };

  const handleSaveQuestions = async () => {
    try {
      setSaving(true);
      setMessage(null);

      // Filter only complete questions
      const completeQuestions = questions.filter(isQuestionComplete);

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
          {getCompletedCount()} / 10 Complete
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
                <div className="form-group">
                  <label>Question Text</label>
                  <textarea
                    value={question.text}
                    onChange={(e) =>
                      handleQuestionChange(index, "text", e.target.value)
                    }
                    placeholder="Enter your question here..."
                    rows={3}
                  />
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
                          onChange={(e) =>
                            handleOptionChange(index, option.id, e.target.value)
                          }
                          placeholder={`Option ${option.id.toUpperCase()}`}
                        />
                        <label className="radio-label">
                          <input
                            type="radio"
                            name={`correct-${index}`}
                            checked={question.correctAnswer === option.id}
                            onChange={() =>
                              handleQuestionChange(
                                index,
                                "correctAnswer",
                                option.id
                              )
                            }
                          />
                          <span className="radio-text">Correct</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>Time Limit (seconds)</label>
                  <select
                    value={question.timeLimit}
                    onChange={(e) =>
                      handleQuestionChange(
                        index,
                        "timeLimit",
                        Number(e.target.value)
                      )
                    }
                  >
                    <option value={15}>15 seconds</option>
                    <option value={30}>30 seconds</option>
                    <option value={45}>45 seconds</option>
                    <option value={60}>60 seconds</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="manager-footer">
        <button
          className="save-btn"
          disabled={getCompletedCount() === 0 || saving}
          onClick={handleSaveQuestions}
        >
          {saving ? "💾 Saving..." : "💾 Save Questions"}
        </button>
      </div>
    </div>
  );
}

export default QuestionManager;
