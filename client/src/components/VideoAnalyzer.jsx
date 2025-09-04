import React, { useState } from "react";
import axios from "axios";
import "./VideoAnalyzer.css";

export default function VideoAnalyzer() {
    const [video, setVideo] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [fileName, setFileName] = useState("");
    const [fileSize, setFileSize] = useState("");

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
        setAnalysis(null);

        // Simulate API call with dummy data
        setTimeout(() => {
            const dummyAnalysis = {
                activities: [
                    { name: "sleep", confidence: 85, duration: "4 secs" },
                    { name: "laptop use", confidence: 92, duration: "4 secs" }
                ],
                totalDuration: "8 secs",
                videoDuration: "0:00:08",
                analysisQuality: "High",
                recommendations: [
                    "Consider taking more breaks from laptop usage",
                    "Good sleep patterns observed"
                ]
            };
            setAnalysis(dummyAnalysis);
            setIsLoading(false);
        }, 2000);

        // Uncomment when backend is ready:
        /*
        const formData = new FormData();
        formData.append("video", video);
    
        try {
          const res = await axios.post("http://localhost:5000/analyze-activity", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          setAnalysis(res.data);
        } catch (err) {
          console.error(err);
          setError(err.response?.data?.error || "Failed to analyze video. Please try again.");
        } finally {
          setIsLoading(false);
        }
        */
    };

    return (
        <div className="video-analyzer">
            {/* Header Section */}
            <div className="analyzer-header">
                <div className="header-content">
                    <h1>Activity Detection</h1>
                    <p>AI-powered daily activity recognition and analysis</p>
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
                            id="activity-video-upload"
                        />
                        <label htmlFor="activity-video-upload" className="upload-label">
                            <div className="upload-icon">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="7,10 12,15 17,10" />
                                    <line x1="12" y1="15" x2="12" y2="3" />
                                </svg>
                            </div>
                            <div className="upload-text">
                                <span className="upload-title">Upload Activity Video</span>
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
                                <span>Analyze Activities</span>
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
            {analysis && (
                <div className="results-section">
                    <div className="results-header">
                        <h2>Activity Analysis Results</h2>
                        <p>Detected activities and insights</p>
                    </div>

                    {/* Summary Stats */}
                    <div className="summary-stats">
                        <div className="stat-card">
                            <div className="stat-value">{analysis.activities.length}</div>
                            <div className="stat-label">Activities Detected</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-value">{analysis.totalDuration}</div>
                            <div className="stat-label">Total Duration</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-value">{analysis.videoDuration}</div>
                            <div className="stat-label">Video Length</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-value">{analysis.analysisQuality}</div>
                            <div className="stat-label">Analysis Quality</div>
                        </div>
                    </div>

                    {/* Activities List */}
                    <div className="activities-section">
                        <h3>Detected Activities</h3>
                        <div className="activities-list">
                            {analysis.activities.map((activity, index) => (
                                <div key={index} className="activity-item">
                                    <div className="activity-header">
                                        <div className="activity-info">
                                            <span className="activity-name">{activity.name}</span>
                                            <span className="activity-duration">{activity.duration}</span>
                                        </div>
                                        <div className="confidence-badge">
                                            {activity.confidence}%
                                        </div>
                                    </div>
                                    <div className="confidence-bar">
                                        <div
                                            className="confidence-fill"
                                            style={{ width: `${activity.confidence}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recommendations */}
                    {analysis.recommendations && analysis.recommendations.length > 0 && (
                        <div className="recommendations-section">
                            <h3>Health Recommendations</h3>
                            <div className="recommendations-list">
                                {analysis.recommendations.map((recommendation, index) => (
                                    <div key={index} className="recommendation-item">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M9 12l2 2 4-4" />
                                            <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
                                        </svg>
                                        <span>{recommendation}</span>
                                    </div>
                                ))}
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
                            <h4>Activity Recognition</h4>
                            <p>AI identifies daily activities from video footage</p>
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
                            <h4>Duration Tracking</h4>
                            <p>Accurate time measurement for each activity</p>
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
                            <h4>Health Insights</h4>
                            <p>Personalized recommendations based on activity patterns</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
