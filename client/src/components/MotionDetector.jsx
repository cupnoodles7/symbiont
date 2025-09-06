import React, { useState } from 'react';
import './MotionDetector.css';

import { PYTHON_API_URL } from '../config/api';

const SERVER_URL = PYTHON_API_URL;

export default function MotionDetector() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setFileSize((file.size / (1024 * 1024)).toFixed(2) + ' MB');
      setResult(null);
      setError(null);
    }
  };

  const handleUpload = async () => {
    const fileInput = document.getElementById('cctv-video-input');
    const file = fileInput.files[0];

    if (!file) {
      setError('Please select a video file');
      return;
    }

    // Validate file type
    const validTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/mkv', 'video/webm'];
    if (!validTypes.includes(file.type)) {
      setError('Invalid file type. Please upload MP4, AVI, MOV, MKV, or WebM');
      return;
    }

    // Validate file size (max 100MB)
    if (file.size > 100 * 1024 * 1024) {
      setError('File too large. Please upload a video smaller than 100MB');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('video', file);

    try {
      const response = await fetch(`${SERVER_URL}/detect_motion`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze video');
      }

      setResult(data);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (activity) => {
    switch (activity) {
      case 'sleeping': return '😴';
      case 'drinking': return '🥤';
      case 'eating': return '🍽️';
      case 'idle': return '🧘';
      default: return '📹';
    }
  };

  const getActivityColor = (activity) => {
    switch (activity) {
      case 'sleeping': return '#4A90E2';
      case 'drinking': return '#7ED321';
      case 'eating': return '#F5A623';
      case 'idle': return '#9013FE';
      default: return '#6C584C';
    }
  };

  return (
    <div className="motion-detector">
      <div className="detector-header">
        <h2>🎥 CCTV Motion Detection</h2>
        <p>Detect sleeping, drinking, eating, and idle activities in surveillance videos</p>
      </div>

      <div className="upload-section">
        <div className="file-input-container">
          <input
            type="file"
            id="cctv-video-input"
            accept="video/*"
            onChange={handleFileChange}
            className="file-input"
          />
          <label htmlFor="cctv-video-input" className="file-input-label">
            📁 Choose CCTV Video
          </label>
        </div>

        {fileName && (
          <div className="file-info">
            <span className="file-name">📄 {fileName}</span>
            <span className="file-size">📊 {fileSize}</span>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={loading || !fileName}
          className="analyze-btn"
        >
          {loading ? (
            <>
              <span className="loading-spinner"></span>
              Analyzing...
            </>
          ) : (
            <>
              🔍 Analyze Motion
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="error-message">
          ❌ {error}
        </div>
      )}

      {result && (
        <div className="results">
          <div className="detection-header">
            <h3>🎯 Detection Results</h3>
            <div className="analysis-method">
              Method: {result.analysis_method === 'position_classifier' ? '🤖 AI Model' : '📊 Simple Analysis'}
            </div>
          </div>

          <div className="main-detection">
            <div
              className="detected-activity"
              style={{ borderColor: getActivityColor(result.detected_activity) }}
            >
              <div className="activity-icon">
                {getActivityIcon(result.detected_activity)}
              </div>
              <div className="activity-info">
                <h4>{result.detected_activity.charAt(0).toUpperCase() + result.detected_activity.slice(1)}</h4>
                <div className="confidence-score">
                  Confidence: {(result.confidence * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          </div>

          <div className="all-activities">
            <h4>📊 All Activity Scores</h4>
            <div className="activity-scores">
              {Object.entries(result.all_activities).map(([activity, score]) => (
                <div key={activity} className="activity-score-item">
                  <span className="activity-label">
                    {getActivityIcon(activity)} {activity.charAt(0).toUpperCase() + activity.slice(1)}
                  </span>
                  <div className="score-bar">
                    <div
                      className="score-fill"
                      style={{
                        width: `${score * 100}%`,
                        backgroundColor: getActivityColor(activity)
                      }}
                    ></div>
                  </div>
                  <span className="score-value">{(score * 100).toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="analysis-details">
            <div className="detail-item">
              <span className="detail-label">📹 Frames Analyzed:</span>
              <span className="detail-value">{result.frames_analyzed}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">⏱️ Duration:</span>
              <span className="detail-value">{result.duration_sec}s</span>
            </div>
            {result.movement_score && (
              <div className="detail-item">
                <span className="detail-label">🏃 Movement Score:</span>
                <span className="detail-value">{result.movement_score}%</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
