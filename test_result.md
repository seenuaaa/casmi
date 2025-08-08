#====================================================================================================
# START - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================

# THIS SECTION CONTAINS CRITICAL TESTING INSTRUCTIONS FOR BOTH AGENTS
# BOTH MAIN_AGENT AND TESTING_AGENT MUST PRESERVE THIS ENTIRE BLOCK

# Communication Protocol:
# If the `testing_agent` is available, main agent should delegate all testing tasks to it.
#
# You have access to a file called `test_result.md`. This file contains the complete testing state
# and history, and is the primary means of communication between main and the testing agent.
#
# Main and testing agents must follow this exact format to maintain testing data. 
# The testing data must be entered in yaml format Below is the data structure:
# 
## user_problem_statement: {problem_statement}
## backend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.py"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## frontend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.js"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## metadata:
##   created_by: "main_agent"
##   version: "1.0"
##   test_sequence: 0
##   run_ui: false
##
## test_plan:
##   current_focus:
##     - "Task name 1"
##     - "Task name 2"
##   stuck_tasks:
##     - "Task name with persistent issues"
##   test_all: false
##   test_priority: "high_first"  # or "sequential" or "stuck_first"
##
## agent_communication:
##     -agent: "main"  # or "testing" or "user"
##     -message: "Communication message between agents"

# Protocol Guidelines for Main agent
#
# 1. Update Test Result File Before Testing:
#    - Main agent must always update the `test_result.md` file before calling the testing agent
#    - Add implementation details to the status_history
#    - Set `needs_retesting` to true for tasks that need testing
#    - Update the `test_plan` section to guide testing priorities
#    - Add a message to `agent_communication` explaining what you've done
#
# 2. Incorporate User Feedback:
#    - When a user provides feedback that something is or isn't working, add this information to the relevant task's status_history
#    - Update the working status based on user feedback
#    - If a user reports an issue with a task that was marked as working, increment the stuck_count
#    - Whenever user reports issue in the app, if we have testing agent and task_result.md file so find the appropriate task for that and append in status_history of that task to contain the user concern and problem as well 
#
# 3. Track Stuck Tasks:
#    - Monitor which tasks have high stuck_count values or where you are fixing same issue again and again, analyze that when you read task_result.md
#    - For persistent issues, use websearch tool to find solutions
#    - Pay special attention to tasks in the stuck_tasks list
#    - When you fix an issue with a stuck task, don't reset the stuck_count until the testing agent confirms it's working
#
# 4. Provide Context to Testing Agent:
#    - When calling the testing agent, provide clear instructions about:
#      - Which tasks need testing (reference the test_plan)
#      - Any authentication details or configuration needed
#      - Specific test scenarios to focus on
#      - Any known issues or edge cases to verify
#
# 5. Call the testing agent with specific instructions referring to test_result.md
#
# IMPORTANT: Main agent must ALWAYS update test_result.md BEFORE calling the testing agent, as it relies on this file to understand what to test next.

#====================================================================================================
# END - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================



#====================================================================================================
# Testing Data - Main Agent and testing sub agent both should log testing data below this section
#====================================================================================================

user_problem_statement: "Enhance Cosmivity to be a real-time communication platform with React frontend, Node.js backend, Firebase database. Features needed: Left sidebar navigation, real-time public/private rooms (like Google Meet/Teams), professional portfolio profiles with skills, proper room access controls, and live video/chat functionality."

backend:
  - task: "Node.js Backend Setup (Replace FastAPI)"
    implemented: false
    working: "NA"
    file: "backend/server.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history: []
  
  - task: "Firebase Admin SDK Integration"
    implemented: false
    working: "NA" 
    file: "backend/firebase-admin.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history: []
    
  - task: "Real-time Room API Endpoints" 
    implemented: false
    working: "NA"
    file: "backend/routes/rooms.js"
    stuck_count: 0
    priority: "high" 
    needs_retesting: false
    status_history: []

  - task: "Socket.io Setup for Real-time Communication"
    implemented: false
    working: "NA"
    file: "backend/socket/index.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history: []

  - task: "User Profile API with Skills Management"
    implemented: false
    working: "NA"
    file: "backend/routes/users.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history: []

frontend:
  - task: "Left Sidebar Navigation"
    implemented: false
    working: "NA"
    file: "src/components/Sidebar.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history: []
    
  - task: "Real-time Room System with Firebase Integration"
    implemented: false
    working: "NA"
    file: "src/pages/Rooms.js, src/hooks/useRealTimeRooms.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history: []
    
  - task: "Public/Private Room Creation and Access Control"
    implemented: false
    working: "NA"
    file: "src/pages/CreateRoom.js, src/pages/JoinRoom.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history: []

  - task: "Live Video Communication (WebRTC + Socket.io)"
    implemented: false
    working: "NA"
    file: "src/pages/VideoRoom.js, src/hooks/useWebRTC.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history: []

  - task: "Professional Portfolio Profile System"
    implemented: false
    working: "NA"
    file: "src/pages/Profile.js, src/components/SkillsManager.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history: []

  - task: "Cosmivity Logo Integration"
    implemented: false
    working: "NA"
    file: "src/components/Sidebar.js, src/assets/"
    stuck_count: 0
    priority: "medium"
    needs_retesting: false
    status_history: []

  - task: "Real-time Chat System in Video Rooms"
    implemented: false
    working: "NA"
    file: "src/components/ChatPanel.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history: []

metadata:
  created_by: "main_agent"
  version: "1.0"
  test_sequence: 0
  run_ui: false

test_plan:
  current_focus:
    - "Node.js Backend Setup (Replace FastAPI)"
    - "Firebase Admin SDK Integration"
    - "Left Sidebar Navigation"
    - "Real-time Room System with Firebase Integration"
    - "Public/Private Room Creation and Access Control"
  stuck_tasks: []
  test_all: false
  test_priority: "high_first"

agent_communication:
  - agent: "main"
    message: "Starting major refactor: Replacing FastAPI backend with Node.js, implementing left sidebar navigation, and building real-time room system with proper Firebase integration. Focus on real-time communication features like Google Meet/Teams."