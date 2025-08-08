#!/usr/bin/env python3
"""
Simple Backend Test - Focus on working endpoints
"""

import requests
import json
from datetime import datetime

BACKEND_URL = "http://localhost:8001"
API_BASE = f"{BACKEND_URL}/api"

def test_endpoint(name, url, expected_status=200, timeout=5):
    """Test a single endpoint with timeout"""
    try:
        print(f"Testing {name}...")
        response = requests.get(url, timeout=timeout)
        
        if response.status_code == expected_status:
            print(f"✅ {name}: SUCCESS (Status: {response.status_code})")
            try:
                data = response.json()
                print(f"   Response: {json.dumps(data, indent=2)[:200]}...")
            except:
                print(f"   Response: {response.text[:100]}...")
        else:
            print(f"❌ {name}: FAILED (Expected: {expected_status}, Got: {response.status_code})")
            print(f"   Response: {response.text[:200]}")
            
    except requests.exceptions.Timeout:
        print(f"⏰ {name}: TIMEOUT (>{timeout}s)")
    except Exception as e:
        print(f"❌ {name}: ERROR - {str(e)}")

def test_auth_endpoint(name, url, method="GET", data=None):
    """Test endpoint that should require auth"""
    try:
        print(f"Testing {name} (should require auth)...")
        if method == "GET":
            response = requests.get(url, timeout=5)
        else:
            response = requests.post(url, json=data, timeout=5)
        
        if response.status_code == 401:
            print(f"✅ {name}: SUCCESS (Correctly requires auth)")
        else:
            print(f"❌ {name}: FAILED (Expected 401, got {response.status_code})")
            
    except Exception as e:
        print(f"❌ {name}: ERROR - {str(e)}")

if __name__ == "__main__":
    print("🚀 Simple Backend API Tests")
    print("=" * 40)
    
    # Test basic endpoints
    test_endpoint("Health Check", f"{API_BASE}/health")
    test_endpoint("404 Handler", f"{API_BASE}/nonexistent", expected_status=404)
    
    # Test auth-protected endpoints
    test_auth_endpoint("User Profile", f"{API_BASE}/users/profile")
    test_auth_endpoint("Room Creation", f"{API_BASE}/rooms", method="POST", data={"name": "Test"})
    
    # Test Firebase-dependent endpoints with longer timeout
    print("\n🔥 Testing Firebase-dependent endpoints...")
    test_endpoint("Public Rooms", f"{API_BASE}/rooms/public", timeout=15)
    test_endpoint("User Search", f"{API_BASE}/users/search?q=test", timeout=15)
    
    print("\n✅ Simple tests completed!")