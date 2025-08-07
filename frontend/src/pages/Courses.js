import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CodeBracketIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const courses = [
  {
    id: 'python',
    name: 'Python',
    description: 'Master Python programming with comprehensive tests covering basics to advanced topics',
    icon: '🐍',
    color: 'from-yellow-500 to-green-500',
    tests: 8,
    completed: 3
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    description: 'Learn modern JavaScript including ES6+, DOM manipulation, and async programming',
    icon: '⚡',
    color: 'from-yellow-400 to-orange-500',
    tests: 6,
    completed: 2
  },
  {
    id: 'java',
    name: 'Java',
    description: 'Build solid foundations in Java programming and object-oriented concepts',
    icon: '☕',
    color: 'from-red-500 to-pink-500',
    tests: 7,
    completed: 1
  },
  {
    id: 'cpp',
    name: 'C++',
    description: 'Dive deep into C++ programming, memory management, and data structures',
    icon: '⚙️',
    color: 'from-blue-500 to-indigo-500',
    tests: 5,
    completed: 0
  }
];

const Courses = () => {
  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Practice Courses</h1>
          <p className="text-gray-400">Choose a programming language and start testing your skills</p>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course) => (
            <Link 
              key={course.id}
              to={`/practice/courses/${course.id}`}
              className="group"
            >
              <div className="card p-6 hover:bg-gray-750 transition-all duration-300 group-hover:scale-[1.02]">
                {/* Course Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${course.color} flex items-center justify-center text-2xl`}>
                      {course.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-indigo-300">
                        {course.name}
                      </h3>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-gray-400 flex items-center space-x-1">
                          <CodeBracketIcon className="w-4 h-4" />
                          <span>{course.tests} tests</span>
                        </span>
                        <span className="text-sm text-gray-400 flex items-center space-x-1">
                          <ChartBarIcon className="w-4 h-4" />
                          <span>{course.completed} completed</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-400 mb-4">{course.description}</p>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Progress</span>
                    <span className="text-sm font-medium text-white">
                      {Math.round((course.completed / course.tests) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className={`bg-gradient-to-r ${course.color} h-2 rounded-full transition-all duration-300`}
                      style={{ width: `${(course.completed / course.tests) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex justify-between items-center">
                  <div>
                    {course.completed === 0 ? (
                      <span className="inline-block px-3 py-1 bg-gray-600 text-gray-300 text-xs rounded-full">
                        Not Started
                      </span>
                    ) : course.completed === course.tests ? (
                      <span className="inline-block px-3 py-1 bg-green-600 text-white text-xs rounded-full">
                        Completed
                      </span>
                    ) : (
                      <span className="inline-block px-3 py-1 bg-indigo-600 text-white text-xs rounded-full">
                        In Progress
                      </span>
                    )}
                  </div>
                  
                  <div className="text-indigo-400 group-hover:text-indigo-300 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-indigo-400 mb-2">26</div>
            <div className="text-gray-400">Total Tests</div>
          </div>
          
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">6</div>
            <div className="text-gray-400">Completed</div>
          </div>
          
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-2">23%</div>
            <div className="text-gray-400">Overall Progress</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses;