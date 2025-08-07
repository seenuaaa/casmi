import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  CheckCircleIcon, 
  ClockIcon,
  PlayIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';

const courseData = {
  python: {
    name: 'Python',
    icon: '🐍',
    color: 'from-yellow-500 to-green-500',
    description: 'Master Python programming from basics to advanced concepts',
    tests: [
      { id: 'basics', name: 'Python Basics', duration: 30, questions: 15, completed: true, score: 85 },
      { id: 'data-types', name: 'Data Types & Variables', duration: 25, questions: 12, completed: true, score: 92 },
      { id: 'control-flow', name: 'Control Flow', duration: 35, questions: 18, completed: true, score: 78 },
      { id: 'functions', name: 'Functions', duration: 40, questions: 20, completed: false },
      { id: 'oop', name: 'Object Oriented Programming', duration: 45, questions: 22, completed: false, locked: true },
      { id: 'modules', name: 'Modules & Packages', duration: 30, questions: 15, completed: false, locked: true },
      { id: 'exceptions', name: 'Exception Handling', duration: 35, questions: 18, completed: false, locked: true },
      { id: 'advanced', name: 'Advanced Python', duration: 50, questions: 25, completed: false, locked: true }
    ]
  },
  javascript: {
    name: 'JavaScript',
    icon: '⚡',
    color: 'from-yellow-400 to-orange-500',
    description: 'Learn modern JavaScript and web development essentials',
    tests: [
      { id: 'basics', name: 'JavaScript Fundamentals', duration: 30, questions: 15, completed: true, score: 88 },
      { id: 'dom', name: 'DOM Manipulation', duration: 35, questions: 18, completed: true, score: 75 },
      { id: 'events', name: 'Events & Event Handling', duration: 25, questions: 12, completed: false },
      { id: 'async', name: 'Async Programming', duration: 45, questions: 22, completed: false, locked: true },
      { id: 'es6', name: 'ES6+ Features', duration: 40, questions: 20, completed: false, locked: true },
      { id: 'frameworks', name: 'Framework Concepts', duration: 35, questions: 18, completed: false, locked: true }
    ]
  },
  java: {
    name: 'Java',
    icon: '☕',
    color: 'from-red-500 to-pink-500',
    description: 'Build strong Java programming and OOP foundations',
    tests: [
      { id: 'basics', name: 'Java Basics', duration: 35, questions: 18, completed: true, score: 82 },
      { id: 'oop', name: 'Object Oriented Programming', duration: 45, questions: 22, completed: false },
      { id: 'collections', name: 'Collections Framework', duration: 40, questions: 20, completed: false, locked: true },
      { id: 'exceptions', name: 'Exception Handling', duration: 30, questions: 15, completed: false, locked: true },
      { id: 'io', name: 'File I/O Operations', duration: 35, questions: 18, completed: false, locked: true },
      { id: 'multithreading', name: 'Multithreading', duration: 50, questions: 25, completed: false, locked: true },
      { id: 'advanced', name: 'Advanced Java Concepts', duration: 55, questions: 28, completed: false, locked: true }
    ]
  },
  cpp: {
    name: 'C++',
    icon: '⚙️',
    color: 'from-blue-500 to-indigo-500',
    description: 'Deep dive into C++ programming and system concepts',
    tests: [
      { id: 'basics', name: 'C++ Fundamentals', duration: 40, questions: 20, completed: false },
      { id: 'pointers', name: 'Pointers & Memory Management', duration: 45, questions: 22, completed: false, locked: true },
      { id: 'oop', name: 'Classes & Objects', duration: 50, questions: 25, completed: false, locked: true },
      { id: 'stl', name: 'Standard Template Library', duration: 35, questions: 18, completed: false, locked: true },
      { id: 'advanced', name: 'Advanced C++ Features', duration: 60, questions: 30, completed: false, locked: true }
    ]
  }
};

const CourseDetail = () => {
  const { courseId } = useParams();
  const course = courseData[courseId];

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Course Not Found</h1>
          <Link to="/practice/courses" className="btn-primary">Back to Courses</Link>
        </div>
      </div>
    );
  }

  const completedTests = course.tests.filter(test => test.completed).length;
  const progress = Math.round((completedTests / course.tests.length) * 100);

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link to="/practice/courses" className="inline-flex items-center text-indigo-400 hover:text-indigo-300 mb-6">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Courses
        </Link>

        {/* Course Header */}
        <div className="card p-8 mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${course.color} flex items-center justify-center text-3xl`}>
              {course.icon}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">{course.name} Course</h1>
              <p className="text-gray-400">{course.description}</p>
            </div>
          </div>

          {/* Course Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">{course.tests.length}</div>
              <div className="text-gray-400 text-sm">Total Tests</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">{completedTests}</div>
              <div className="text-gray-400 text-sm">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-400 mb-1">{progress}%</div>
              <div className="text-gray-400 text-sm">Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400 mb-1">
                {completedTests > 0 ? Math.round(course.tests.filter(t => t.completed).reduce((acc, t) => acc + t.score, 0) / completedTests) : 0}%
              </div>
              <div className="text-gray-400 text-sm">Avg Score</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-300">Course Progress</span>
              <span className="text-sm font-medium text-white">{progress}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div 
                className={`bg-gradient-to-r ${course.color} h-3 rounded-full transition-all duration-500`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Tests List */}
        <div className="space-y-4">
          {course.tests.map((test, index) => (
            <div key={test.id} className="card p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  {/* Status Icon */}
                  <div className="flex-shrink-0">
                    {test.completed ? (
                      <CheckCircleIcon className="w-8 h-8 text-green-400" />
                    ) : test.locked ? (
                      <LockClosedIcon className="w-8 h-8 text-gray-500" />
                    ) : (
                      <PlayIcon className="w-8 h-8 text-indigo-400" />
                    )}
                  </div>

                  {/* Test Info */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">{test.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span className="flex items-center space-x-1">
                        <ClockIcon className="w-4 h-4" />
                        <span>{test.duration} min</span>
                      </span>
                      <span>{test.questions} questions</span>
                      {test.completed && (
                        <span className="text-green-400 font-medium">Score: {test.score}%</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="flex-shrink-0">
                  {test.locked ? (
                    <button disabled className="btn-secondary opacity-50 cursor-not-allowed">
                      <LockClosedIcon className="w-4 h-4" />
                      <span>Locked</span>
                    </button>
                  ) : test.completed ? (
                    <Link to={`/practice/courses/${courseId}/tests/${test.id}`} className="btn-secondary">
                      <span>Retake</span>
                    </Link>
                  ) : (
                    <Link to={`/practice/courses/${courseId}/tests/${test.id}`} className="btn-primary">
                      <PlayIcon className="w-4 h-4" />
                      <span>Start Test</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Course Completion Message */}
        {progress === 100 && (
          <div className="card p-8 mt-8 text-center bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
            <div className="text-4xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-white mb-2">Congratulations!</h2>
            <p className="text-gray-300">You've completed all tests in the {course.name} course!</p>
            <div className="mt-6">
              <Link to="/practice/courses" className="btn-primary">
                <span>Explore More Courses</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetail;