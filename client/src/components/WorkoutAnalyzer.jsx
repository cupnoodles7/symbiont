import React, { useState } from "react";
import axios from "axios";
import "./WorkoutAnalyzer.css";

export default function WorkoutAnalyzer() {
  const [video, setVideo] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('video/')) {
        setError("Please select a valid video file");
        setVideo(null);
        setFileName("");
        setFileSize("");
        return;
      }

      // Validate file size (max 100MB)
      const maxSize = 100 * 1024 * 1024; // 100MB
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
      const res = await axios.post("http://localhost:5000/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFeedback(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to analyze workout. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="analyzer">
      <h2>🏋️ AI Workout Analyzer</h2>
      
      <div className="upload-section">
        <h3>Upload Your Workout Video</h3>
        <p>Get instant feedback on your form and rep count</p>
        
        <div className="file-input-container">
          <input
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            className="file-input"
            id="video-upload"
          />
          <label 
            htmlFor="video-upload" 
            className={`file-input-label ${video ? 'has-file' : ''}`}
          >
            {video ? '✓ Video Selected' : '📹 Choose Video File'}
          </label>
        </div>

        {video && (
          <div className="file-info">
            <div className="file-name">{fileName}</div>
            <div className="file-size">{fileSize}</div>
          </div>
        )}

        <button 
          className={`analyze-btn ${isLoading ? 'loading' : ''}`}
          onClick={handleUpload}
          disabled={!video || isLoading}
        >
          {isLoading ? (
            <>
              <span className="loading-spinner"></span>
              Analyzing...
            </>
          ) : (
            '🔍 Analyze Workout'
          )}
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {feedback && (
        <div className="results">
          <h3>🎯 Workout Analysis Results</h3>
          
          <div className="workout-stats">
            <div className="stat-card">
              <div className="stat-value">{feedback.summary?.squats || 0}</div>
              <div className="stat-label">Squats Detected</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{feedback.summary?.pushups || 0}</div>
              <div className="stat-label">Push-ups Detected</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{feedback.summary?.backrows || 0}</div>
              <div className="stat-label">Back Rows Detected</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{feedback.duration_sec || 0}s</div>
              <div className="stat-label">Duration</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{feedback.workout_type || 'Unknown'}</div>
              <div className="stat-label">Workout Type</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{feedback.frames_analyzed || 0}</div>
              <div className="stat-label">Frames Analyzed</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{feedback.summary?.confidence || 0}%</div>
              <div className="stat-label">Detection Confidence</div>
            </div>
          </div>

          {feedback.form_scores && (
            <div className="form-scores">
              <h4>📊 Form Scores</h4>
              <div className="score-grid">
                <div className="score-item">
                  <span className="score-label">Push-ups:</span>
                  <span className="score-value">{feedback.form_scores.pushup}/100</span>
                </div>
                <div className="score-item">
                  <span className="score-label">Squats:</span>
                  <span className="score-value">{feedback.form_scores.squat}/100</span>
                </div>
                <div className="score-item">
                  <span className="score-label">Back Rows:</span>
                  <span className="score-value">{feedback.form_scores.backrow}/100</span>
                </div>
              </div>
            </div>
          )}

          {feedback.form_issues && feedback.form_issues.length > 0 && (
            <div className="form-issues">
              <h4>⚠️ Form Issues Detected</h4>
              <ul className="issue-list">
                {feedback.form_issues.map((issue, index) => (
                  <li key={index}>{issue}</li>
                ))}
              </ul>
            </div>
          )}

          {feedback.form_issues && feedback.form_issues.length === 0 && (
            <div className="success-message">
              🎉 Great form! No issues detected in your workout.
            </div>
          )}
        </div>
      )}

      <div className="upload-section how-it-works">
        <h3>💡 How It Works</h3>
        <p>Our AI analyzes your workout video using computer vision to:</p>
        <ul>
          <li>🎯 Count your repetitions accurately</li>
          <li>📐 Assess your form and posture</li>
          <li>⚠️ Identify potential injury risks</li>
          <li>📊 Track your progress over time</li>
        </ul>
      </div>
    </div>
  );
}