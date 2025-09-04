#!/usr/bin/env python3
"""
Test script for the improved motion detection
"""
import requests
import json

def test_motion_scenarios():
    """Test different motion detection scenarios"""
    base_url = "http://localhost:5000"
    
    print("🎯 Testing Motion Detection Scenarios")
    print("=" * 50)
    
    scenarios = ["sleeping", "drinking", "eating", "idle", "laptop"]
    
    for scenario in scenarios:
        try:
            response = requests.get(f"{base_url}/test_motion?scenario={scenario}")
            if response.status_code == 200:
                data = response.json()
                print(f"\n📊 {scenario.upper()} Scenario:")
                print(f"   Detected: {data['detected_activity']}")
                print(f"   Confidence: {data['confidence']:.2f}")
                print(f"   Movement Score: {data['movement_score']}%")
                print("   Activity Scores:")
                for activity, score in data['all_activities'].items():
                    print(f"     {activity}: {score:.2f}")
            else:
                print(f"❌ Failed to test {scenario}: {response.status_code}")
        except Exception as e:
            print(f"❌ Error testing {scenario}: {e}")
    
    print("\n" + "=" * 50)
    print("✅ Test scenarios completed!")
    print("📝 To test with real video:")
    print("   1. Start server: python app.py")
    print("   2. Upload video via frontend or curl")
    print("   3. Check server console for movement statistics")

if __name__ == "__main__":
    test_motion_scenarios()
