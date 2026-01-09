import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useTestMode } from '../contexts/TestModeContext';

const CMMCHub = () => {
  const { user, logout } = useAuth0();
  const { darkMode, setMode } = useTestMode();
  const [userProgress, setUserProgress] = useState({});

  // CMMC Training modules
  const cmmcModules = [
    {
      id: 'introduction',
      title: 'CMMC Introduction & Overview',
      description: 'Learn the fundamentals of CMMC, its purpose, and the certification process.',
      icon: '📖',
      duration: '2 hours',
      status: 'available',
      progress: userProgress['introduction'] || 0,
      lessons: 8,
      type: 'training'
    },
    {
      id: 'domain-1',
      title: 'Domain 1: Access Control',
      description: 'Master access control requirements and implementation strategies.',
      icon: '🔐',
      duration: '4 hours',
      status: 'available',
      progress: userProgress['domain-1'] || 0,
      lessons: 12,
      type: 'training'
    },
    {
      id: 'domain-2',
      title: 'Domain 2: Awareness & Training',
      description: 'Security awareness programs and training requirements.',
      icon: '🎓',
      duration: '3 hours',
      status: 'available',
      progress: userProgress['domain-2'] || 0,
      lessons: 10,
      type: 'training'
    },
    {
      id: 'domain-3',
      title: 'Domain 3: Audit & Accountability',
      description: 'Audit trails, accountability, and security monitoring.',
      icon: '📊',
      duration: '4 hours',
      status: 'coming-soon',
      progress: 0,
      lessons: 11,
      type: 'training'
    },
    {
      id: 'test-simulator',
      title: 'CMMC Test Simulator',
      description: 'Practice exams with 376+ questions to test your knowledge and prepare for certification.',
      icon: '🧪',
      duration: 'Self-paced',
      status: 'available',
      progress: userProgress['test-simulator'] || 0,
      lessons: 0,
      type: 'simulator'
    },
    {
      id: 'practice-exams',
      title: 'Practice Exams & Assessment',
      description: 'Full-length practice exams with detailed feedback and performance analytics.',
      icon: '📝',
      duration: '6 hours',
      status: 'available',
      progress: userProgress['practice-exams'] || 0,
      lessons: 5,
      type: 'assessment'
    }
  ];

  useEffect(() => {
    // Load user progress from localStorage
    const savedProgress = localStorage.getItem('cmmcProgress');
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress));
    }
  }, []);

  const handleModuleClick = (module) => {
    if (module.status === 'coming-soon') {
      alert('This module is coming soon!');
      return;
    }

    if (module.type === 'simulator') {
      // Navigate to the test simulator (dashboard mode)
      setMode('dashboard');
    } else if (module.type === 'assessment') {
      // Navigate to practice exams
      setMode('simulated');
    } else {
      // For training modules, show coming soon for now
      alert('Training materials will be available soon. Use the Test Simulator to practice!');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'available':
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            darkMode ? 'bg-green-900/30 text-green-400 border border-green-500/30' : 'bg-green-100 text-green-800 border border-green-200'
          }`}>
            Available
          </span>
        );
      case 'coming-soon':
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            darkMode ? 'bg-gray-700 text-gray-400 border border-gray-600' : 'bg-gray-100 text-gray-600 border border-gray-200'
          }`}>
            Coming Soon
          </span>
        );
      default:
        return null;
    }
  };

  const getTypeBadge = (type) => {
    const colors = {
      training: darkMode ? 'bg-blue-900/30 text-blue-400 border border-blue-500/30' : 'bg-blue-100 text-blue-800 border border-blue-200',
      simulator: darkMode ? 'bg-purple-900/30 text-purple-400 border border-purple-500/30' : 'bg-purple-100 text-purple-800 border border-purple-200',
      assessment: darkMode ? 'bg-orange-900/30 text-orange-400 border border-orange-500/30' : 'bg-orange-100 text-orange-800 border border-orange-200'
    };

    const labels = {
      training: 'Training',
      simulator: 'Simulator',
      assessment: 'Assessment'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[type]}`}>
        {labels[type]}
      </span>
    );
  };

  const overallProgress = Object.values(userProgress).reduce((acc, curr) => acc + curr, 0) / Object.keys(userProgress).length || 0;

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <div className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setMode('trainingOfferings')}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode 
                    ? 'hover:bg-slate-700 text-gray-300' 
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">CMMC</span>
              </div>
              <div>
                <h1 className="text-xl font-bold">CMMC Certification Training</h1>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Complete certification preparation program
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {user?.name || 'User'}
                </p>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {user?.email}
                </p>
              </div>
              <button
                onClick={() => logout({ returnTo: window.location.origin })}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  darkMode 
                    ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Overall Progress */}
        <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl shadow-lg p-6 mb-8`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Overall Progress</h2>
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {overallProgress}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-blue-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>

        {/* Training Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trainingModules.map((module) => (
            <div
              key={module.id}
              className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer`}
              onClick={() => handleModuleSelect(module)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-3xl">{module.icon}</div>
                <div className="flex space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(module.status)}`}>
                    {module.status === 'available' ? 'Available' : 'Coming Soon'}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyBadge(module.difficulty)}`}>
                    {module.difficulty}
                  </span>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold mb-2">{module.title}</h3>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
                {module.description}
              </p>
              
              <div className="flex items-center justify-between text-sm mb-4">
                <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                  {module.duration}
                </span>
                <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                  {module.category}
                </span>
              </div>
              
              {module.progress > 0 && (
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                      Progress
                    </span>
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                      {module.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${module.progress}%` }}
                    />
                  </div>
                </div>
              )}
              
              <button
                className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                  module.status === 'available'
                    ? module.id === 'cmmc-simulator'
                      ? darkMode 
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                      : darkMode 
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                disabled={module.status !== 'available'}
              >
                {module.id === 'cmmc-simulator' ? 'Enter Simulator' : 
                 module.status === 'available' ? 'Start Module' : 'Coming Soon'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrainingHub;
