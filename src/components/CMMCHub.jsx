import React, { useState, useEffect } from 'react';
import { useTestMode } from '../contexts/TestModeContext';

const TrainingHub = () => {
  const { darkMode, setMode } = useTestMode();
  const [selectedModule, setSelectedModule] = useState(null);
  const [userProgress, setUserProgress] = useState({});

  // Training modules configuration
  const trainingModules = [
    {
      id: 'cmmc-simulator',
      title: 'CMMC Exam Preparation',
      description: 'Complete certification exam preparation system with 376+ practice questions, simulated exams, domain-specific training, and detailed performance analytics.',
      icon: '🛡️',
      category: 'Certification',
      difficulty: 'Advanced',
      duration: '8-12 hours',
      status: 'available',
      progress: userProgress['cmmc-simulator'] || 0,
      features: [
        '376+ Practice Questions',
        'Full-Length Simulated Exams',
        'Domain-Specific Training',
        'Performance Analytics',
        'Progress Tracking',
        'Adaptive Learning'
      ],
      color: 'blue'
    },
    {
      id: 'security-awareness',
      title: 'Security Awareness Training',
      description: 'Essential cybersecurity awareness training for all employees covering threats, best practices, and incident response.',
      icon: '🔒',
      category: 'Security',
      difficulty: 'Beginner',
      duration: '2-3 hours',
      status: 'coming-soon',
      progress: 0,
      features: [
        'Threat Identification',
        'Email Security',
        'Password Management',
        'Incident Response',
        'Best Practices'
      ],
      color: 'green'
    },
    {
      id: 'data-protection',
      title: 'Data Protection & Privacy',
      description: 'Comprehensive training on data protection regulations, privacy laws, and organizational compliance requirements.',
      icon: '📊',
      category: 'Compliance',
      difficulty: 'Intermediate',
      duration: '4-6 hours',
      status: 'coming-soon',
      progress: 0,
      features: [
        'GDPR Compliance',
        'Data Classification',
        'Privacy Policies',
        'Risk Management',
        'Audit Procedures'
      ],
      color: 'purple'
    },
    {
      id: 'incident-response',
      title: 'Incident Response Procedures',
      description: 'Hands-on training for security incident response, including detection, containment, and recovery procedures.',
      icon: '🚨',
      category: 'Operations',
      difficulty: 'Advanced',
      duration: '6-8 hours',
      status: 'coming-soon',
      progress: 0,
      features: [
        'Incident Detection',
        'Response Planning',
        'Containment Strategies',
        'Recovery Procedures',
        'Post-Incident Analysis'
      ],
      color: 'red'
    },
    {
      id: 'risk-management',
      title: 'Risk Management Framework',
      description: 'Learn to identify, assess, and mitigate organizational risks using industry-standard frameworks and methodologies.',
      icon: '⚖️',
      category: 'Governance',
      difficulty: 'Intermediate',
      duration: '5-7 hours',
      status: 'coming-soon',
      progress: 0,
      features: [
        'Risk Assessment',
        'Control Frameworks',
        'Mitigation Strategies',
        'Compliance Mapping',
        'Reporting Procedures'
      ],
      color: 'orange'
    },
    {
      id: 'policy-management',
      title: 'Policy & Documentation',
      description: 'Create, implement, and maintain organizational security policies and documentation procedures.',
      icon: '📋',
      category: 'Governance',
      difficulty: 'Intermediate',
      duration: '3-4 hours',
      status: 'coming-soon',
      progress: 0,
      features: [
        'Policy Development',
        'Documentation Standards',
        'Change Management',
        'Compliance Audits',
        'Version Control'
      ],
      color: 'indigo'
    }
  ];

  // Load user progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('trainingHub_progress');
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress));
    }
  }, []);

  // Update progress when module is completed
  const updateModuleProgress = (moduleId, progress) => {
    const newProgress = { ...userProgress, [moduleId]: progress };
    setUserProgress(newProgress);
    localStorage.setItem('trainingHub_progress', JSON.stringify(newProgress));
  };

  // Handle module selection
  const handleModuleSelect = (module) => {
    if (module.id === 'cmmc-simulator') {
      // Navigate to the existing CMMC simulator
      setMode('dashboard');
    } else if (module.status === 'available') {
      setSelectedModule(module);
    } else {
      // Show coming soon message
      alert(`${module.title} is coming soon! This module is currently under development.`);
    }
  };

  // Get status badge styling
  const getStatusBadge = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'coming-soon':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  // Get difficulty badge styling
  const getDifficultyBadge = (difficulty) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Intermediate':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'Advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  // Calculate overall progress
  const overallProgress = Math.round(
    Object.values(userProgress).reduce((sum, progress) => sum + progress, 0) / 
    trainingModules.filter(m => m.status === 'available').length
  ) || 0;

  if (selectedModule) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-900'} p-6`}>
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => setSelectedModule(null)}
            className={`mb-6 flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              darkMode 
                ? 'bg-slate-700 text-white hover:bg-slate-600' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <span>←</span>
            <span>Back to Training Hub</span>
          </button>
          
          <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl shadow-lg p-8`}>
            <div className="flex items-center space-x-4 mb-6">
              <div className="text-4xl">{selectedModule.icon}</div>
              <div>
                <h1 className="text-2xl font-bold">{selectedModule.title}</h1>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {selectedModule.description}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                <h3 className="font-semibold mb-2">Duration</h3>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{selectedModule.duration}</p>
              </div>
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                <h3 className="font-semibold mb-2">Difficulty</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyBadge(selectedModule.difficulty)}`}>
                  {selectedModule.difficulty}
                </span>
              </div>
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                <h3 className="font-semibold mb-2">Category</h3>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{selectedModule.category}</p>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Module Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedModule.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span className="text-green-500">✓</span>
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-8 flex space-x-4">
              <button
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  selectedModule.status === 'available'
                    ? darkMode 
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                disabled={selectedModule.status !== 'available'}
              >
                {selectedModule.status === 'available' ? 'Start Module' : 'Coming Soon'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-900'} p-6`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Corporate Training Hub</h1>
          <p className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Welcome to your comprehensive training platform. Access specialized modules for compliance, security, and certification preparation.
          </p>
          <div className={`mt-4 p-4 rounded-lg ${darkMode ? 'bg-blue-900/30 border border-blue-700' : 'bg-blue-50 border border-blue-200'}`}>
            <p className={`text-sm ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
              <strong>🛡️ CMMC Exam Simulator</strong> - Our flagship certification preparation module is now available below, featuring comprehensive question banks and performance analytics.
            </p>
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
