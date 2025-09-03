from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import os
import numpy as np
from datetime import datetime
import requests
import base64
import json

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Hugging Face API configuration
HF_API_URL = "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium"
HF_TOKEN = "hf_xxx"  # You'll need to get a free token from huggingface.co

def analyze_video_simple(video_path):
    """Simple video analysis using basic computer vision techniques"""
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        return None
    
    frame_count = 0
    total_frames = 0
    movement_detected = 0
    
    # Simple motion detection
    prev_frame = None
    
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
            
        total_frames += 1
        
        # Process every 10th frame for speed
        if total_frames % 10 != 0:
            continue
            
        frame_count += 1
        
        # Convert to grayscale for motion detection
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        gray = cv2.GaussianBlur(gray, (21, 21), 0)
        
        if prev_frame is not None:
            # Calculate frame difference
            frame_delta = cv2.absdiff(prev_frame, gray)
            thresh = cv2.threshold(frame_delta, 25, 255, cv2.THRESH_BINARY)[1]
            
            # Count non-zero pixels (movement)
            movement_pixels = np.count_nonzero(thresh)
            if movement_pixels > 1000:  # Threshold for movement
                movement_detected += 1
        
        prev_frame = gray
        
        # Limit analysis to first 300 frames (~10 seconds at 30fps)
        if frame_count >= 30:
            break
    
    cap.release()
    
    # Simple workout type detection based on movement patterns
    movement_ratio = movement_detected / max(frame_count, 1)
    
    if movement_ratio > 0.7:
        workout_type = "high_intensity"
        estimated_reps = int(movement_ratio * 20)  # Rough estimate
    elif movement_ratio > 0.4:
        workout_type = "moderate_intensity"
        estimated_reps = int(movement_ratio * 15)
    else:
        workout_type = "low_intensity"
        estimated_reps = int(movement_ratio * 10)
    
    return {
        "workout_type": workout_type,
        "estimated_reps": estimated_reps,
        "movement_score": round(movement_ratio * 100, 1),
        "frames_analyzed": frame_count,
        "duration_sec": round(total_frames / 30, 2)
    }

@app.route("/analyze", methods=["POST"])
def analyze():
    try:
        if "video" not in request.files:
            return jsonify({"error": "No video uploaded"}), 400
        
        video_file = request.files["video"]
        
        # Validate file type
        if not video_file.filename.lower().endswith(('.mp4', '.avi', '.mov', '.mkv', '.webm')):
            return jsonify({"error": "Invalid video format. Please upload MP4, AVI, MOV, MKV, or WebM"}), 400
        
        # Generate unique filename
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"workout_{timestamp}_{video_file.filename}"
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        
        try:
            video_file.save(filepath)
        except Exception as e:
            return jsonify({"error": f"Failed to save video: {str(e)}"}), 500
        
        # Analyze video using simple computer vision
        results = analyze_video_simple(filepath)
        
        if results is None:
            return jsonify({"error": "Failed to analyze video"}), 500
        
        # Clean up uploaded file
        try:
            os.remove(filepath)
        except:
            pass
        
        # Format response
        response = {
            "summary": {
                "pushups": results["estimated_reps"] if "push" in video_file.filename.lower() else 0,
                "squats": results["estimated_reps"] if "squat" in video_file.filename.lower() else 0,
                "backrows": results["estimated_reps"] if "row" in video_file.filename.lower() else 0,
                "confidence": results["movement_score"]
            },
            "form_scores": {
                "pushup": max(100 - results["estimated_reps"], 60),
                "squat": max(100 - results["estimated_reps"], 60),
                "backrow": max(100 - results["estimated_reps"], 60)
            },
            "form_issues": [
                "Keep good form throughout the movement",
                "Maintain proper breathing",
                "Control the movement tempo"
            ],
            "frames_analyzed": results["frames_analyzed"],
            "workout_type": results["workout_type"],
            "duration_sec": results["duration_sec"]
        }
        
        return jsonify(response)
        
    except Exception as e:
        print(f"Error in analyze endpoint: {str(e)}")
        return jsonify({"error": f"Failed to analyze workout: {str(e)}"}), 500

@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "healthy", 
        "message": "Simple Workout Analyzer is running",
        "method": "Basic Computer Vision Analysis"
    })

if __name__ == "__main__":
    print("🚀 Starting Simple Workout Analyzer API...")
    print("📹 Upload videos to /analyze endpoint")
    print("🎯 Using basic computer vision for reliable analysis")
    print("⚡ Fast and simple - no complex AI models")
    app.run(port=5000, debug=True)