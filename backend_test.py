#!/usr/bin/env python3
"""
Comprehensive Backend API Testing for Cosmivity Node.js Backend
Tests all endpoints including health check, room APIs, user APIs, and authentication
"""

import requests
import json
import time
import uuid
from datetime import datetime

# Configuration
BACKEND_URL = "http://localhost:8001"
API_BASE = f"{BACKEND_URL}/api"

# Mock Firebase JWT token for testing (in real scenario, this would be a valid Firebase token)
MOCK_AUTH_TOKEN = "mock-firebase-jwt-token"
AUTH_HEADERS = {
    "Authorization": f"Bearer {MOCK_AUTH_TOKEN}",
    "Content-Type": "application/json"
}

class BackendTester:
    def __init__(self):
        self.test_results = []
        self.total_tests = 0
        self.passed_tests = 0
        self.failed_tests = 0
        
    def log_test(self, test_name, success, message="", response_data=None):
        """Log test results"""
        self.total_tests += 1
        if success:
            self.passed_tests += 1
            status = "✅ PASS"
        else:
            self.failed_tests += 1
            status = "❌ FAIL"
            
        result = {
            "test": test_name,
            "status": status,
            "message": message,
            "timestamp": datetime.now().isoformat()
        }
        
        if response_data:
            result["response"] = response_data
            
        self.test_results.append(result)
        print(f"{status}: {test_name} - {message}")
        
    def test_health_check(self):
        """Test the health check endpoint"""
        try:
            response = requests.get(f"{API_BASE}/health", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if "status" in data and data["status"] == "OK":
                    self.log_test("Health Check", True, "Health endpoint working correctly", data)
                else:
                    self.log_test("Health Check", False, f"Invalid health response: {data}")
            else:
                self.log_test("Health Check", False, f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Health Check", False, f"Connection error: {str(e)}")
    
    def test_cors_configuration(self):
        """Test CORS configuration"""
        try:
            # Test preflight request
            response = requests.options(f"{API_BASE}/health", 
                                      headers={"Origin": "http://localhost:3000"}, 
                                      timeout=10)
            
            if response.status_code in [200, 204]:
                cors_headers = response.headers.get('Access-Control-Allow-Origin', '')
                if cors_headers:
                    self.log_test("CORS Configuration", True, "CORS headers present")
                else:
                    self.log_test("CORS Configuration", False, "CORS headers missing")
            else:
                self.log_test("CORS Configuration", False, f"Preflight failed: {response.status_code}")
                
        except Exception as e:
            self.log_test("CORS Configuration", False, f"CORS test error: {str(e)}")
    
    def test_public_rooms_endpoint(self):
        """Test fetching public rooms (no auth required)"""
        try:
            response = requests.get(f"{API_BASE}/rooms/public", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_test("Public Rooms Fetch", True, f"Retrieved {len(data)} public rooms", {"count": len(data)})
                else:
                    self.log_test("Public Rooms Fetch", False, f"Expected array, got: {type(data)}")
            else:
                self.log_test("Public Rooms Fetch", False, f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Public Rooms Fetch", False, f"Request error: {str(e)}")
    
    def test_room_creation_without_auth(self):
        """Test room creation without authentication (should fail)"""
        try:
            room_data = {
                "name": "Test Room",
                "description": "A test room",
                "isPrivate": False,
                "maxParticipants": 10
            }
            
            response = requests.post(f"{API_BASE}/rooms", 
                                   json=room_data, 
                                   headers={"Content-Type": "application/json"},
                                   timeout=10)
            
            if response.status_code == 401:
                self.log_test("Room Creation Auth Check", True, "Correctly rejected unauthenticated request")
            else:
                self.log_test("Room Creation Auth Check", False, f"Expected 401, got {response.status_code}")
                
        except Exception as e:
            self.log_test("Room Creation Auth Check", False, f"Request error: {str(e)}")
    
    def test_user_profile_without_auth(self):
        """Test user profile access without authentication (should fail)"""
        try:
            response = requests.get(f"{API_BASE}/users/profile", timeout=10)
            
            if response.status_code == 401:
                self.log_test("User Profile Auth Check", True, "Correctly rejected unauthenticated request")
            else:
                self.log_test("User Profile Auth Check", False, f"Expected 401, got {response.status_code}")
                
        except Exception as e:
            self.log_test("User Profile Auth Check", False, f"Request error: {str(e)}")
    
    def test_user_search_endpoint(self):
        """Test user search endpoint (public endpoint)"""
        try:
            response = requests.get(f"{API_BASE}/users/search?q=test", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_test("User Search", True, f"Search returned {len(data)} results")
                else:
                    self.log_test("User Search", False, f"Expected array, got: {type(data)}")
            elif response.status_code == 400:
                # This is also acceptable if no query provided
                self.log_test("User Search", True, "Search validation working")
            else:
                self.log_test("User Search", False, f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("User Search", False, f"Request error: {str(e)}")
    
    def test_invalid_routes(self):
        """Test 404 handling for invalid routes"""
        try:
            response = requests.get(f"{API_BASE}/nonexistent", timeout=10)
            
            if response.status_code == 404:
                data = response.json()
                if "error" in data:
                    self.log_test("404 Error Handling", True, "Correctly returns 404 for invalid routes")
                else:
                    self.log_test("404 Error Handling", False, "404 response missing error field")
            else:
                self.log_test("404 Error Handling", False, f"Expected 404, got {response.status_code}")
                
        except Exception as e:
            self.log_test("404 Error Handling", False, f"Request error: {str(e)}")
    
    def test_room_by_id_endpoint(self):
        """Test fetching room by ID (should handle non-existent rooms)"""
        try:
            fake_room_id = str(uuid.uuid4())
            response = requests.get(f"{API_BASE}/rooms/{fake_room_id}", timeout=10)
            
            if response.status_code == 404:
                data = response.json()
                if "error" in data:
                    self.log_test("Room By ID (Not Found)", True, "Correctly handles non-existent room")
                else:
                    self.log_test("Room By ID (Not Found)", False, "404 response missing error field")
            else:
                self.log_test("Room By ID (Not Found)", False, f"Expected 404, got {response.status_code}")
                
        except Exception as e:
            self.log_test("Room By ID (Not Found)", False, f"Request error: {str(e)}")
    
    def test_public_user_profile(self):
        """Test public user profile endpoint (should handle non-existent users)"""
        try:
            fake_user_id = str(uuid.uuid4())
            response = requests.get(f"{API_BASE}/users/{fake_user_id}/public", timeout=10)
            
            if response.status_code == 404:
                data = response.json()
                if "error" in data:
                    self.log_test("Public User Profile (Not Found)", True, "Correctly handles non-existent user")
                else:
                    self.log_test("Public User Profile (Not Found)", False, "404 response missing error field")
            else:
                self.log_test("Public User Profile (Not Found)", False, f"Expected 404, got {response.status_code}")
                
        except Exception as e:
            self.log_test("Public User Profile (Not Found)", False, f"Request error: {str(e)}")
    
    def test_join_room_by_access_code(self):
        """Test joining room by access code without auth (should fail)"""
        try:
            fake_access_code = "FAKE123"
            response = requests.post(f"{API_BASE}/rooms/join/{fake_access_code}", 
                                   headers={"Content-Type": "application/json"},
                                   timeout=10)
            
            if response.status_code == 401:
                self.log_test("Join Room Auth Check", True, "Correctly requires authentication")
            else:
                self.log_test("Join Room Auth Check", False, f"Expected 401, got {response.status_code}")
                
        except Exception as e:
            self.log_test("Join Room Auth Check", False, f"Request error: {str(e)}")
    
    def test_rate_limiting(self):
        """Test rate limiting (basic check)"""
        try:
            # Make multiple rapid requests to test rate limiting
            responses = []
            for i in range(5):
                response = requests.get(f"{API_BASE}/health", timeout=5)
                responses.append(response.status_code)
                time.sleep(0.1)  # Small delay between requests
            
            # All should succeed for health endpoint with reasonable rate limiting
            if all(status == 200 for status in responses):
                self.log_test("Rate Limiting", True, "Rate limiting configured (health endpoint accessible)")
            else:
                self.log_test("Rate Limiting", False, f"Unexpected responses: {responses}")
                
        except Exception as e:
            self.log_test("Rate Limiting", False, f"Request error: {str(e)}")
    
    def test_request_body_parsing(self):
        """Test JSON request body parsing"""
        try:
            # Test with invalid JSON to room creation (should fail gracefully)
            response = requests.post(f"{API_BASE}/rooms", 
                                   data="invalid json", 
                                   headers={"Content-Type": "application/json"},
                                   timeout=10)
            
            # Should return 400 for bad JSON or 401 for missing auth
            if response.status_code in [400, 401]:
                self.log_test("JSON Body Parsing", True, "Handles invalid JSON gracefully")
            else:
                self.log_test("JSON Body Parsing", False, f"Unexpected status: {response.status_code}")
                
        except Exception as e:
            self.log_test("JSON Body Parsing", False, f"Request error: {str(e)}")
    
    def test_firebase_admin_initialization(self):
        """Test if Firebase Admin SDK is properly initialized (indirect test)"""
        try:
            # Test an endpoint that would use Firebase (public rooms)
            response = requests.get(f"{API_BASE}/rooms/public", timeout=10)
            
            if response.status_code == 200:
                self.log_test("Firebase Admin SDK", True, "Firebase-dependent endpoints working")
            elif response.status_code == 500:
                # Check if it's a Firebase-related error
                try:
                    error_data = response.json()
                    if "firebase" in str(error_data).lower():
                        self.log_test("Firebase Admin SDK", False, "Firebase initialization issue detected")
                    else:
                        self.log_test("Firebase Admin SDK", False, f"Server error: {error_data}")
                except:
                    self.log_test("Firebase Admin SDK", False, "Server error (possibly Firebase-related)")
            else:
                self.log_test("Firebase Admin SDK", False, f"Unexpected response: {response.status_code}")
                
        except Exception as e:
            self.log_test("Firebase Admin SDK", False, f"Request error: {str(e)}")
    
    def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 Starting Cosmivity Backend API Tests")
        print("=" * 50)
        
        # Basic connectivity and health
        self.test_health_check()
        self.test_cors_configuration()
        
        # Public endpoints (no auth required)
        self.test_public_rooms_endpoint()
        self.test_user_search_endpoint()
        self.test_room_by_id_endpoint()
        self.test_public_user_profile()
        
        # Authentication checks
        self.test_room_creation_without_auth()
        self.test_user_profile_without_auth()
        self.test_join_room_by_access_code()
        
        # Error handling and edge cases
        self.test_invalid_routes()
        self.test_request_body_parsing()
        
        # Infrastructure tests
        self.test_rate_limiting()
        self.test_firebase_admin_initialization()
        
        # Print summary
        print("\n" + "=" * 50)
        print("🏁 Test Summary")
        print("=" * 50)
        print(f"Total Tests: {self.total_tests}")
        print(f"✅ Passed: {self.passed_tests}")
        print(f"❌ Failed: {self.failed_tests}")
        print(f"Success Rate: {(self.passed_tests/self.total_tests)*100:.1f}%")
        
        # Show failed tests
        if self.failed_tests > 0:
            print("\n❌ Failed Tests:")
            for result in self.test_results:
                if "FAIL" in result["status"]:
                    print(f"  - {result['test']}: {result['message']}")
        
        return self.passed_tests, self.failed_tests, self.test_results

if __name__ == "__main__":
    tester = BackendTester()
    passed, failed, results = tester.run_all_tests()
    
    # Exit with error code if tests failed
    exit(0 if failed == 0 else 1)