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

user_problem_statement: "Build Cosmivity - a full-stack app with Firebase backend including authentication (email/password + Google), video chat rooms with WebRTC, resume builder with PDF generation, course testing system, and user profiles. Using React frontend with TailwindCSS + 21st.dev components."

backend:
  - task: "Firebase Setup and Configuration"
    implemented: false
    working: "NA"
    file: "firebase config"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history: []
  
  - task: "Firebase Authentication (Email/Password)"
    implemented: false
    working: "NA" 
    file: "auth service"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history: []
    
  - task: "Firebase Google Authentication" 
    implemented: false
    working: "NA"
    file: "auth service"
    stuck_count: 0
    priority: "high" 
    needs_retesting: false
    status_history: []

  - task: "Firestore Database Setup"
    implemented: false
    working: "NA"
    file: "firestore service"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history: []

frontend:
  - task: "Firebase Dependencies Installation"
    implemented: true
    working: true
    file: "package.json"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: true
        agent: "main"
        comment: "Firebase dependencies successfully installed and app is running"
    
  - task: "Firebase Configuration"
    implemented: true
    working: true
    file: "src/firebase.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: true
        agent: "main"
        comment: "Firebase config setup with provided keys, authentication working"
    
  - task: "Authentication Context"
    implemented: true
    working: true
    file: "src/contexts/AuthContext.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: true
        agent: "main"
        comment: "Auth context created and working with Firebase auth state"

  - task: "Sign-in/Sign-up Page"
    implemented: true
    working: true
    file: "src/pages/SignIn.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: true
        agent: "main"
        comment: "Beautiful sign-in page with both email/password and Google auth options"
    
  - task: "Dashboard Page"
    implemented: true
    working: true
    file: "src/pages/Dashboard.js"
    stuck_count: 0
    priority: "medium"
    needs_retesting: false
    status_history:
      - working: true
        agent: "main"
        comment: "Complete dashboard with stats, progress tracking, and navigation"

  - task: "React Router Setup"
    implemented: true
    working: true
    file: "src/App.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: true
        agent: "main"
        comment: "Full routing setup with protected routes and navigation"

  - task: "Courses and Testing System"
    implemented: true
    working: "NA"
    file: "src/pages/Courses.js, CourseDetail.js, TestPage.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history: []

  - task: "Video Room System"
    implemented: true
    working: "NA"
    file: "src/pages/CreateRoom.js, Rooms.js, VideoRoom.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history: []

  - task: "Resume Builder"
    implemented: true
    working: "NA"
    file: "src/pages/ResumeTemplates.js, ResumeBuilder.js, ResumeReview.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history: []

  - task: "Profile Management"
    implemented: true
    working: "NA"
    file: "src/pages/Profile.js"
    stuck_count: 0
    priority: "medium"
    needs_retesting: true
    status_history: []

metadata:
  created_by: "main_agent"
  version: "1.0"
  test_sequence: 0
  run_ui: false

test_plan:
  current_focus:
    - "Courses and Testing System"
    - "Video Room System"
    - "Resume Builder"
    - "Profile Management"
  stuck_tasks: []
  test_all: false
  test_priority: "high_first"

agent_communication:
  - agent: "main"
    message: "Cosmivity MVP completed! Implemented Firebase authentication (email/password + Google), complete course testing system, video rooms infrastructure, resume builder with all templates, and user profile management. All pages created with TailwindCSS styling and Syne font. Ready for testing."