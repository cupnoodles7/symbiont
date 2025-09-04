#!/usr/bin/env python3
"""
Test script specifically for laptop use detection
"""
import requests
import json

def test_laptop_scenario():
    """Test the laptop use scenario"""
    base_url = "http://localhost:5000"
    
    print("💻 Testing Laptop Use Detection")
    print("=" * 50)
    
    try:
        response = requests.get(f"{base_url}/test_motion?scenario=laptop")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Laptop Scenario Test:")
            print(f"   Detected Activity: {data['detected_activity']}")
            print(f"   Confidence: {data['confidence']:.2f}")
            print(f"   Movement Score: {data['movement_score']}%")
            print("   Activity Breakdown:")
            for activity, score in data['all_activities'].items():
                print(f"     {activity}: {score:.2f}")
            
            # Check if it correctly identifies as idle
            if data['detected_activity'] == 'idle' and data['confidence'] > 0.8:
                print("✅ PASS: Correctly detected laptop use as 'idle' with high confidence")
            else:
                print("❌ FAIL: Did not correctly detect laptop use")
                
        else:
            print(f"❌ Failed to test laptop scenario: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Error testing laptop scenario: {e}")

def test_all_scenarios():
    """Test all scenarios to show the difference"""
    base_url = "http://localhost:5000"
    
    print("\n🎯 Testing All Scenarios for Comparison")
    print("=" * 50)
    
    scenarios = ["sleeping", "laptop", "drinking", "eating"]
    
    for scenario in scenarios:
        try:
            response = requests.get(f"{base_url}/test_motion?scenario={scenario}")
            if response.status_code == 200:
                data = response.json()
                print(f"\n📊 {scenario.upper()}:")
                print(f"   Detected: {data['detected_activity']} (confidence: {data['confidence']:.2f})")
                print(f"   Movement: {data['movement_score']}%")
            else:
                print(f"❌ Failed to test {scenario}")
        except Exception as e:
            print(f"❌ Error testing {scenario}: {e}")

if __name__ == "__main__":
    test_laptop_scenario()
    test_all_scenarios()
    
    print("\n" + "=" * 50)
    print("📝 Key Improvements Made:")
    print("   • Added laptop use pattern detection")
    print("   • Lowered movement thresholds for idle activities")
    print("   • Improved variance analysis")
    print("   • More realistic probability distributions")
    print("   • Better distinction between sleeping and laptop use")
    print("\n🎯 Your sleeping + laptop video should now be detected as 'idle'!")
