import React, { useState } from "react";
import axios from "axios";
import { API_ENDPOINTS } from '../config/api';
import "./WorkoutAnalyzer.css";

export default function WorkoutAnalyzer() {
  const [video, setVideo] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [analysisMode, setAnalysisMode] = useState("workout"); // "workout" or "motion"

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('video/')) {
        setError("Please select a valid video file");
        setVideo(null);
        setFileName("");
        setFileSize("");
        return;
      }

      const maxSize = 100 * 1024 * 1024;
      if (file.size > maxSize) {
        setError("File size too large. Please select a video under 100MB");
        setVideo(null);
        setFileName("");
        setFileSize("");
        return;
      }

      setVideo(file);
      setFileName(file.name);
      setFileSize((file.size / (1024 * 1024)).toFixed(2) + " MB");
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!video) {
      setError("Please select a video file first");
      return;
    }

    setIsLoading(true);
    setError(null);
    setFeedback(null);

    const formData = new FormData();
    formData.append("video", video);

    try {
      // Choose endpoint based on analysis mode
      const endpoint = analysisMode === "motion" ? "detect_motion" : "analyze";
      const res = await axios.post(`${API_ENDPOINTS.WORKOUT_ANALYZER}/${endpoint}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFeedback(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to analyze video. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="workout-analyzer">
      {/* Header Section */}
      <div className="analyzer-header">
        <div className="header-content">
          <h1>Video Analysis</h1>
          <p>AI-powered analysis for workouts and motion detection</p>
        </div>
      </div>

      {/* Mode Selector */}
      <div className="mode-selector">
        <div className="mode-options">
          <button
            className={`mode-btn ${analysisMode === "workout" ? "active" : ""}`}
            onClick={() => setAnalysisMode("workout")}
          >
            💪 Workout Analysis
          </button>
          <button
            className={`mode-btn ${analysisMode === "motion" ? "active" : ""}`}
            onClick={() => setAnalysisMode("motion")}
          >
            🎥 Motion Detection
          </button>
        </div>
        <div className="mode-description">
          {analysisMode === "workout" ? (
            <p>Analyze workout form, count reps, and get fitness feedback</p>
          ) : (
            <p>Detect sleeping, drinking, eating, and idle activities in CCTV videos</p>
          )}
        </div>
      </div>

      {/* Upload Section */}
      <div className="upload-section">
        <div className="upload-container">
          <div className="upload-area">
            <input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="file-input"
              id="video-upload"
            />
            <label htmlFor="video-upload" className="upload-label">
              <div className="upload-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7,10 12,15 17,10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </div>
              <div className="upload-text">
                <span className="upload-title">Upload Workout Video</span>
                <span className="upload-subtitle">MP4, MOV, or AVI up to 100MB</span>
              </div>
            </label>
          </div>

          {video && (
            <div className="file-info">
              <div className="file-details">
                <span className="file-name">{fileName}</span>
                <span className="file-size">{fileSize}</span>
              </div>
            </div>
          )}

          <button
            className={`analyze-button ${isLoading ? 'loading' : ''}`}
            onClick={handleUpload}
            disabled={!video || isLoading}
          >
            {isLoading ? (
              <>
                <div className="spinner"></div>
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <span>{analysisMode === "workout" ? "Analyze Workout" : "Detect Motion"}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-container">
          <div className="error-message">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Results Section */}
      {feedback && (
        <div className="results-section">
          <div className="results-header">
            <h2>Analysis Results</h2>
            <p>{analysisMode === "workout" ? "Your workout performance breakdown" : "Motion detection analysis"}</p>
          </div>

          {/* Stats Grid */}
          {analysisMode === "workout" ? (
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value">{feedback.summary?.squats || 0}</div>
                <div className="stat-label">Squats</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{feedback.summary?.pushups || 0}</div>
                <div className="stat-label">Push-ups</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{feedback.summary?.backrows || 0}</div>
                <div className="stat-label">Back Rows</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{feedback.duration_sec || 0}s</div>
                <div className="stat-label">Duration</div>
              </div>
            </div>
          ) : (
            <div className="motion-results">
              <div className="detected-activity-card">
                <div className="activity-icon">
                  {feedback.detected_activity === 'sleeping' && '😴'}
                  {feedback.detected_activity === 'drinking' && '🥤'}
                  {feedback.detected_activity === 'eating' && '🍽️'}
                  {feedback.detected_activity === 'idle' && '🧘'}
                </div>
                <div className="activity-info">
                  <h3>{feedback.detected_activity?.charAt(0).toUpperCase() + feedback.detected_activity?.slice(1)}</h3>
                  <p>Confidence: {(feedback.confidence * 100)?.toFixed(1)}%</p>
                </div>
              </div>

              <div className="activity-scores">
                <h4>All Activity Scores</h4>
                {feedback.all_activities && Object.entries(feedback.all_activities).map(([activity, score]) => (
                  <div key={activity} className="activity-score">
                    <span className="activity-name">{activity}</span>
                    <div className="score-bar">
                      <div
                        className="score-fill"
                        style={{ width: `${score * 100}%` }}
                      ></div>
                    </div>
                    <span className="score-value">{(score * 100).toFixed(1)}%</span>
                  </div>
                ))}
              </div>

              {/* Movement Statistics */}
              <div className="movement-stats">
                <h4>Movement Analysis</h4>
                <div className="stats-grid">
                  <div className="stat-item">
                    <span className="stat-label">Movement Score:</span>
                    <span className="stat-value">{feedback.movement_score}%</span>
                  </div>
                  {feedback.movement_stats && (
                    <>
                      <div className="stat-item">
                        <span className="stat-label">Average:</span>
                        <span className="stat-value">{feedback.movement_stats.average}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Max:</span>
                        <span className="stat-value">{feedback.movement_stats.max}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Min:</span>
                        <span className="stat-value">{feedback.movement_stats.min}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Variance:</span>
                        <span className="stat-value">{feedback.movement_stats.variance}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Form Scores */}
          {feedback.form_scores && (
            <div className="form-scores">
              <h3>Form Assessment</h3>
              <div className="scores-grid">
                {feedback.summary?.pushups > 0 && (
                  <div className="score-item">
                    <div className="score-header">
                      <span className="score-label">Push-ups</span>
                      <span className="score-value">{feedback.form_scores.pushup}/100</span>
                    </div>
                    <div className="score-bar">
                      <div
                        className="score-fill"
                        style={{ width: `${feedback.form_scores.pushup}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                {feedback.summary?.squats > 0 && (
                  <div className="score-item">
                    <div className="score-header">
                      <span className="score-label">Squats</span>
                      <span className="score-value">{feedback.form_scores.squat}/100</span>
                    </div>
                    <div className="score-bar">
                      <div
                        className="score-fill"
                        style={{ width: `${feedback.form_scores.squat}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                {feedback.summary?.backrows > 0 && (
                  <div className="score-item">
                    <div className="score-header">
                      <span className="score-label">Back Rows</span>
                      <span className="score-value">{feedback.form_scores.backrow}/100</span>
                    </div>
                    <div className="score-bar">
                      <div
                        className="score-fill"
                        style={{ width: `${feedback.form_scores.backrow}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Form Issues */}
          {feedback.form_issues && feedback.form_issues.length > 0 && (
            <div className="form-issues">
              <h3>Form Recommendations</h3>
              <div className="issues-list">
                {feedback.form_issues.map((issue, index) => (
                  <div key={index} className="issue-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <span>{issue}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {feedback.form_issues && feedback.form_issues.length === 0 && (
            <div className="success-message">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22,4 12,14.01 9,11.01" />
              </svg>
              <div className="success-content">
                <h3>Excellent Form!</h3>
                <p>No issues detected in your workout. Keep up the great work!</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* How It Works */}
      <div className="how-it-works">
        <h3>How It Works</h3>
        <div className="features-grid">
          <div className="feature-item">
            <div className="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12,6 12,12 16,14" />
              </svg>
            </div>
            <div className="feature-content">
              <h4>Rep Counting</h4>
              <p>Accurate repetition tracking with AI vision</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <div className="feature-content">
              <h4>Form Analysis</h4>
              <p>Real-time posture and movement assessment</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 12l2 2 4-4" />
                <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
              </svg>
            </div>
            <div className="feature-content">
              <h4>Progress Tracking</h4>
              <p>Monitor improvements over time</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}