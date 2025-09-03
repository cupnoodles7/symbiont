# 🏋️ Workout Analyzer Backend

AI-powered workout analysis using computer vision and MediaPipe pose detection.

## Features

- **Squat Analysis**: Detects squat depth, form, and counts repetitions
- **Push-up Analysis**: Analyzes push-up form and counts reps
- **Form Feedback**: Provides real-time form correction suggestions
- **Video Processing**: Supports multiple video formats (MP4, AVI, MOV, MKV, WebM)
- **Performance Optimized**: Processes every 3rd frame for better performance

## Setup

### Prerequisites

- Python 3.8 or higher
- pip package manager

### Installation

1. **Navigate to the server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   # Windows
   setup.bat
   
   # Unix/Linux/Mac
   chmod +x setup.sh
   ./setup.sh
   
   # Or manually:
   pip install -r requirements.txt
   ```

3. **Start the server:**
   ```bash
   python app.py
   ```

The server will start on `http://localhost:5000`

## API Endpoints

### POST /analyze
Upload a workout video for analysis.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: `video` file

**Response:**
```json
{
  "squats": 5,
  "pushups": 0,
  "form_issues": ["Squat not deep enough"],
  "workout_duration": 12.5,
  "frames_analyzed": 375,
  "workout_type": "squat"
}
```

### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "message": "Workout Analyzer API is running"
}
```

## How It Works

1. **Video Upload**: User uploads workout video
2. **Frame Processing**: Video is processed frame by frame (every 3rd frame)
3. **Pose Detection**: MediaPipe detects body landmarks in each frame
4. **Workout Classification**: AI determines workout type (squat, push-up, etc.)
5. **Form Analysis**: Analyzes body angles and positions for proper form
6. **Rep Counting**: Counts successful repetitions with good form
7. **Feedback Generation**: Provides specific form improvement suggestions

## Form Analysis Rules

### Squats
- **Depth Check**: Thighs should be parallel to ground (90-170° knee angle)
- **Posture Check**: Chest should stay up (shoulder-hip-knee angle > 45°)
- **Knee Position**: Knees shouldn't extend past toes

### Push-ups
- **Elbow Angle**: Maintain 90° angle during movement
- **Body Alignment**: Keep body straight (shoulder-hip-ankle angle > 160°)
- **Core Engagement**: Prevent hip sagging

## Supported Video Formats

- MP4
- AVI
- MOV
- MKV
- WebM

## Performance Notes

- Processes every 3rd frame for optimal performance
- Maximum file size: 100MB
- Automatic file cleanup after analysis
- CORS enabled for frontend integration

## Troubleshooting

### Common Issues

1. **Import Errors**: Ensure all dependencies are installed
2. **Video Processing Errors**: Check video format and file integrity
3. **Performance Issues**: Large videos may take longer to process

### Error Messages

- `"No video uploaded"`: Missing video file in request
- `"Invalid video format"`: Unsupported video format
- `"File size too large"`: Video exceeds 100MB limit
- `"Failed to open video file"`: Corrupted or unsupported video

## Development

### Adding New Workout Types

1. Create analysis function (e.g., `analyze_deadlift_form`)
2. Add detection logic in `detect_workout_type`
3. Update feedback structure
4. Test with sample videos

### Improving Form Detection

- Adjust angle thresholds in analysis functions
- Add more landmark checks
- Implement machine learning models for better accuracy

## License

This project is part of the Aura Health application.
