import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { saveTestResult } from '../firebase';
import { ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const sampleQuestions = {
  'python-basics': [
    {
      id: 1,
      question: "What is the correct way to declare a variable in Python?",
      options: ["var x = 5", "x = 5", "int x = 5", "declare x = 5"],
      correct: 1
    },
    {
      id: 2,
      question: "Which of the following is used to create a comment in Python?",
      options: ["//", "/*", "#", "<!--"],
      correct: 2
    },
    {
      id: 3,
      question: "What will be the output of print(type(5))?",
      options: ["<class 'int'>", "<class 'number'>", "<class 'integer'>", "int"],
      correct: 0
    }
  ],
  'javascript-basics': [
    {
      id: 1,
      question: "Which keyword is used to declare a variable in JavaScript?",
      options: ["var", "let", "const", "All of the above"],
      correct: 3
    },
    {
      id: 2,
      question: "What will typeof null return?",
      options: ["null", "undefined", "object", "boolean"],
      correct: 2
    }
  ]
};

const TestPage = () => {
  const { courseId, testId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    // Load questions for the test
    const testKey = `${courseId}-${testId}`;
    const testQuestions = sampleQuestions[testKey] || sampleQuestions['python-basics'];
    setQuestions(testQuestions);
  }, [courseId, testId]);

  useEffect(() => {
    if (timeLeft > 0 && !isSubmitted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleSubmit();
    }
  }, [timeLeft, isSubmitted]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (questionId, optionIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleSubmit = async () => {
    if (isSubmitted) return;
    
    setIsSubmitted(true);
    
    // Calculate score
    let correct = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correct) {
        correct++;
      }
    });
    
    const score = Math.round((correct / questions.length) * 100);
    const timeSpent = 1800 - timeLeft;
    
    // Save test result to Firebase
    if (currentUser) {
      await saveTestResult(currentUser.uid, courseId, testId, {
        score,
        correct,
        total: questions.length,
        timeSpent,
        answers
      });
    }
    
    setShowResults(true);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreMessage = (score) => {
    if (score >= 80) return 'Excellent work!';
    if (score >= 60) return 'Good job!';
    return 'Keep practicing!';
  };

  if (showResults) {
    const correct = questions.filter(q => answers[q.id] === q.correct).length;
    const score = Math.round((correct / questions.length) * 100);
    
    return (
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="max-w-3xl mx-auto">
          <div className="card p-8 text-center">
            <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircleIcon className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-3xl font-bold text-white mb-2">Test Complete!</h1>
            <p className="text-gray-400 mb-8">{getScoreMessage(score)}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="card p-6">
                <div className={`text-3xl font-bold mb-2 ${getScoreColor(score)}`}>{score}%</div>
                <div className="text-gray-400">Final Score</div>
              </div>
              
              <div className="card p-6">
                <div className="text-3xl font-bold text-white mb-2">{correct}/{questions.length}</div>
                <div className="text-gray-400">Correct Answers</div>
              </div>
              
              <div className="card p-6">
                <div className="text-3xl font-bold text-white mb-2">{formatTime(1800 - timeLeft)}</div>
                <div className="text-gray-400">Time Taken</div>
              </div>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={() => navigate(`/practice/courses/${courseId}`)}
                className="btn-primary"
              >
                Back to Course
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="btn-secondary ml-4"
              >
                Retake Test
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white capitalize">{courseId} - {testId.replace('-', ' ')}</h1>
            <p className="text-gray-400">Question {currentQuestion + 1} of {questions.length}</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-white">
              <ClockIcon className="w-5 h-5" />
              <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-300">Progress</span>
            <span className="text-sm font-medium text-white">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="card p-8 mb-8">
          <h2 className="text-xl font-semibold text-white mb-6">{currentQ.question}</h2>
          
          <div className="space-y-4">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(currentQ.id, index)}
                className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                  answers[currentQ.id] === index
                    ? 'border-indigo-500 bg-indigo-500/10 text-white'
                    : 'border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    answers[currentQ.id] === index
                      ? 'border-indigo-500 bg-indigo-500'
                      : 'border-gray-400'
                  }`}>
                    {answers[currentQ.id] === index && (
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    )}
                  </div>
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <div className="flex space-x-4">
            {currentQuestion === questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                className="btn-primary"
              >
                Submit Test
              </button>
            ) : (
              <button
                onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))}
                className="btn-primary"
              >
                Next Question
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;