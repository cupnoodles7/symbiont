#!/usr/bin/env python3
"""
Test script for the motion detection endpoints
"""
import requests
import json

def test_health():
    """Test the health endpoint"""
    try:
        response = requests.get('http://localhost:5000/health')
        print("✅ Health Check:")
        print(json.dumps(response.json(), indent=2))
        return True
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        return False

def test_motion_detection_dummy():
    """Test motion detection with dummy data"""
    print("\n🎯 Testing Motion Detection Endpoint:")
    print("📝 Note: This will work with fallback simple analysis since model files aren't present")
    print("📝 To test with real model, add your saved_model_export folder to server/models/")
    
    # Create a dummy test
    dummy_data = {
        "detected_activity": "sleeping",
        "confidence": 0.85,
        "all_activities": {
            "sleeping": 0.85,
            "drinking": 0.10,
            "eating": 0.03,
            "idle": 0.02
        },
        "analysis_method": "simple_motion_detection",
        "frames_analyzed": 30,
        "duration_sec": 10.5,
        "movement_score": 15.2
    }
    
    print("📊 Expected Response Format:")
    print(json.dumps(dummy_data, indent=2))
    return True

if __name__ == "__main__":
    print("🚀 Testing Motion Detection API")
    print("=" * 50)
    
    # Test health endpoint
    health_ok = test_health()
    
    # Show dummy data format
    test_motion_detection_dummy()
    
    print("\n" + "=" * 50)
    if health_ok:
        print("✅ Server is ready for testing!")
        print("📹 To test with real video:")
        print("   1. Start server: python app.py")
        print("   2. Use curl: curl -X POST -F 'video=@your_video.mp4' http://localhost:5000/detect_motion")
        print("   3. Or use the React frontend in Activity tab")
    else:
        print("❌ Server needs to be started first")
        print("   Run: python app.py")
