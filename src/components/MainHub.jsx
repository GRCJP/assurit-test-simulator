import React, { useState, useEffect } from 'react';
import { useTestMode } from '../contexts/TestModeContext';

const MainHub = () => {
  const { darkMode, setMode } = useTestMode();
  const [userProgress, setUserProgress] = useState({});

  // Main training categories
  const trainingCategories = [
    {
      id: 'cmmc-training',
      title: 'CMMC Training',
      description: 'Complete CMMC certification preparation with practice questions, simulated exams, and detailed analytics.',
      icon: '🛡️',
      category: 'Certification',
      difficulty: 'Advanced',
      duration: '8-12 hours',
      status: 'available',
      progress: userProgress['cmmc-training'] || 0,
      features: [
        '376+ Practice Questions',
        'Full-Length Simulated Exams',
        'Domain-Specific Training',
        'Performance Analytics',
        'Progress Tracking',
        'Adaptive Learning'
      ],
      color: 'blue',
      destination: 'cmmc-hub'
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
      color: 'green',
      destination: null
    },
    {
      id: 'data-protection',
      title: 'Data Protection & Privacy',
      description: 'Comprehensive training on data protection regulations, privacy laws, and best practices for data handling.',
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
        'Data Breach Response',
        'Risk Assessment'
      ],
      color: 'purple',
      destination: null
    },
    {
      id: 'incident-response',
      title: 'Incident Response Procedures',
      description: 'Learn how to effectively respond to security incidents with hands-on scenarios and response protocols.',
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
      color: 'red',
      destination: null
    },
    {
      id: 'risk-management',
      title: 'Risk Management Framework',
      description: 'Master risk assessment methodologies and frameworks for identifying and mitigating organizational risks.',
      icon: '⚖️',
      category: 'Governance',
      difficulty: 'Intermediate',
      duration: '5-7 hours',
      status: 'coming-soon',
      progress: 0,
      features: [
        'Risk Assessment',
        'Risk Mitigation',
        'Compliance Frameworks',
        'Risk Monitoring',
        'Reporting Procedures'
      ],
      color: 'orange',
      destination: null
    },
    {
      id: 'policy-management',
      title: 'Policy & Documentation',
      description: 'Create, implement, and manage organizational policies and documentation effectively.',
      icon: '📋',
      category: 'Administration',
      difficulty: 'Beginner',
      duration: '3-4 hours',
      status: 'coming-soon',
      progress: 0,
      features: [
        'Policy Development',
        'Document Management',
        'Compliance Tracking',
        'Version Control',
        'Audit Preparation'
      ],
      color: 'teal',
      destination: null
    }
  ];

  useEffect(() => {
    // Load user progress from localStorage
    const savedProgress = localStorage.getItem('trainingProgress');
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress));
    }
  }, []);

  const handleModuleClick = (module) => {
    if (module.status === 'coming-soon') {
      alert('This training module is coming soon!');
      return;
    }

    if (module.destination === 'cmmc-hub') {
      // Navigate to CMMC training hub
      setMode('cmmcHub');
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

  const getDifficultyBadge = (difficulty) => {
    const colors = {
      Beginner: darkMode ? 'bg-blue-900/30 text-blue-400 border border-blue-500/30' : 'bg-blue-100 text-blue-800 border border-blue-200',
      Intermediate: darkMode ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-500/30' : 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      Advanced: darkMode ? 'bg-red-900/30 text-red-400 border border-red-500/30' : 'bg-red-100 text-red-800 border border-red-200'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[difficulty]}`}>
        {difficulty}
      </span>
    );
  };

  const overallProgress = Object.values(userProgress).reduce((acc, curr) => acc + curr, 0) / Object.keys(userProgress).length || 0;

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-900'} p-6`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Corporate Training Hub</h1>
          <p className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Choose your training path and advance your professional skills
          </p>
        </div>

        {/* Progress Overview */}
        <div className={`rounded-xl p-6 mb-8 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} border`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Your Training Progress</h2>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {Math.round(overallProgress)}% complete across all modules
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {Math.round(overallProgress)}%
              </div>
              <div className="w-32 bg-gray-200 rounded-full h-3 mt-2">
                <div 
                  className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Training Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trainingCategories.map((module) => (
            <div
              key={module.id}
              onClick={() => handleModuleClick(module)}
              className={`rounded-xl p-6 border-2 cursor-pointer transition-all duration-200 ${
                darkMode 
                  ? 'bg-slate-800 border-slate-700 hover:border-blue-500 hover:shadow-lg' 
                  : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-lg'
              } ${module.status === 'coming-soon' ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {/* Module Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">{module.icon}</div>
                  <div>
                    <h3 className="text-xl font-semibold mb-1">{module.title}</h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {module.category}
                    </p>
                  </div>
                </div>
                {getStatusBadge(module.status)}
              </div>

              {/* Description */}
              <p className={`text-sm mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {module.description}
              </p>

              {/* Details */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    ⏱️ {module.duration}
                  </span>
                  {getDifficultyBadge(module.difficulty)}
                </div>
              </div>

              {/* Progress Bar */}
              {module.status === 'available' && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Progress
                    </span>
                    <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {module.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        module.color === 'blue' ? 'bg-blue-600' :
                        module.color === 'green' ? 'bg-green-600' :
                        module.color === 'purple' ? 'bg-purple-600' :
                        module.color === 'red' ? 'bg-red-600' :
                        module.color === 'orange' ? 'bg-orange-600' :
                        'bg-teal-600'
                      }`}
                      style={{ width: `${module.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Features */}
              <div className="space-y-1">
                {module.features.slice(0, 3).map((feature, index) => (
                  <div key={index} className="flex items-center text-xs">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                      {feature}
                    </span>
                  </div>
                ))}
                {module.features.length > 3 && (
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    +{module.features.length - 3} more features
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                    module.status === 'coming-soon'
                      ? darkMode 
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : darkMode
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                  disabled={module.status === 'coming-soon'}
                >
                  {module.status === 'coming-soon' ? 'Coming Soon' : 'Start Training'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className={`mt-12 text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <p className="text-sm">
            New training modules are being developed. Check back regularly for updates!
          </p>
        </div>
      </div>
    </div>
  );
};

export default MainHub;
