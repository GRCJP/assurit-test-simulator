import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useTestMode } from '../contexts/TestModeContext';

const TrainingOfferings = () => {
  const { user, logout } = useAuth0();
  const { darkMode, setMode } = useTestMode();
  const [userProgress, setUserProgress] = useState({});

  // Training courses available
  const trainingCourses = [
    {
      id: 'cmmc-training',
      title: 'CMMC Certification Training',
      description: 'Complete CMMC certification preparation including training materials, practice exams, and assessment tools. Covers all 110 security requirements across 17 domains.',
      icon: '🛡️',
      category: 'Cybersecurity Certification',
      difficulty: 'Advanced',
      duration: '40-60 hours',
      status: 'available',
      progress: userProgress['cmmc-training'] || 0,
      instructor: 'Assurit Security Experts',
      price: '$2,999',
      rating: 4.8,
      studentsCount: 1250,
      features: [
        'Comprehensive video lectures',
        'Interactive training materials',
        'Practice exam simulator',
        'Domain-specific modules',
        'Expert instructor support',
        'Certificate of completion'
      ],
      color: 'blue',
      destination: 'cmmcHub'
    },
    {
      id: 'security-awareness',
      title: 'Security Awareness Training',
      description: 'Essential cybersecurity awareness training for all employees covering threats, best practices, and incident response protocols.',
      icon: '🔒',
      category: 'Security Training',
      difficulty: 'Beginner',
      duration: '8-12 hours',
      status: 'coming-soon',
      progress: 0,
      instructor: 'Security Training Team',
      price: '$499',
      rating: 4.6,
      studentsCount: 3200,
      features: [
        'Threat identification',
        'Email security',
        'Password management',
        'Incident response basics',
        'Best practices',
        'Compliance tracking'
      ],
      color: 'green',
      destination: null
    },
    {
      id: 'data-protection',
      title: 'Data Protection & Privacy',
      description: 'Comprehensive training on data protection regulations, privacy laws, and best practices for data handling and compliance.',
      icon: '📊',
      category: 'Compliance',
      difficulty: 'Intermediate',
      duration: '20-30 hours',
      status: 'coming-soon',
      progress: 0,
      instructor: 'Compliance Experts',
      price: '$1,299',
      rating: 4.7,
      studentsCount: 850,
      features: [
        'GDPR compliance',
        'Data classification',
        'Privacy policies',
        'Data breach response',
        'Risk assessment',
        'Audit preparation'
      ],
      color: 'purple',
      destination: null
    },
    {
      id: 'incident-response',
      title: 'Incident Response Procedures',
      description: 'Master incident response methodologies and protocols with hands-on scenarios and real-world case studies.',
      icon: '🚨',
      category: 'Operations',
      difficulty: 'Advanced',
      duration: '25-35 hours',
      status: 'coming-soon',
      progress: 0,
      instructor: 'Response Team Leads',
      price: '$1,799',
      rating: 4.9,
      studentsCount: 420,
      features: [
        'Incident detection',
        'Response planning',
        'Containment strategies',
        'Recovery procedures',
        'Post-incident analysis',
        'Team coordination'
      ],
      color: 'red',
      destination: null
    },
    {
      id: 'risk-management',
      title: 'Risk Management Framework',
      description: 'Learn risk assessment methodologies and frameworks for identifying, assessing, and mitigating organizational risks.',
      icon: '⚖️',
      category: 'Governance',
      difficulty: 'Intermediate',
      duration: '30-40 hours',
      status: 'coming-soon',
      progress: 0,
      instructor: 'Risk Management Experts',
      price: '$1,499',
      rating: 4.7,
      studentsCount: 680,
      features: [
        'Risk assessment',
        'Risk mitigation',
        'Compliance frameworks',
        'Risk monitoring',
        'Reporting procedures',
        'Framework implementation'
      ],
      color: 'orange',
      destination: null
    },
    {
      id: 'policy-management',
      title: 'Policy & Documentation',
      description: 'Create, implement, and manage organizational policies and documentation effectively with practical templates and guidelines.',
      icon: '📋',
      category: 'Administration',
      difficulty: 'Beginner',
      duration: '15-20 hours',
      status: 'coming-soon',
      progress: 0,
      instructor: 'Policy Specialists',
      price: '$799',
      rating: 4.5,
      studentsCount: 1100,
      features: [
        'Policy development',
        'Document management',
        'Compliance tracking',
        'Version control',
        'Audit preparation',
        'Template library'
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

  const handleCourseClick = (course) => {
    if (course.status === 'coming-soon') {
      alert('This training course is coming soon! Contact us for more information.');
      return;
    }

    if (course.destination === 'cmmcHub') {
      // Navigate to CMMC training
      setMode('cmmcHub');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'available':
        return (
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            darkMode ? 'bg-green-900/30 text-green-400 border border-green-500/30' : 'bg-green-100 text-green-800 border border-green-200'
          }`}>
            Available Now
          </span>
        );
      case 'coming-soon':
        return (
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
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
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${colors[difficulty]}`}>
        {difficulty}
      </span>
    );
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="text-yellow-400">★</span>);
    }
    if (hasHalfStar) {
      stars.push(<span key="half" className="text-yellow-400">☆</span>);
    }
    for (let i = stars.length; i < 5; i++) {
      stars.push(<span key={i} className="text-gray-300 dark:text-gray-600">★</span>);
    }

    return stars;
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <div className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold">Assurit Training Center</h1>
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
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-4">Training Courses</h2>
          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Choose from our comprehensive catalog of professional training courses
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className={`rounded-xl p-6 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} border`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Courses</p>
                <p className="text-2xl font-bold">6</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <span className="text-2xl">📚</span>
              </div>
            </div>
          </div>
          
          <div className={`rounded-xl p-6 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} border`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Enrolled</p>
                <p className="text-2xl font-bold">1</p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <span className="text-2xl">✓</span>
              </div>
            </div>
          </div>
          
          <div className={`rounded-xl p-6 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} border`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Completed</p>
                <p className="text-2xl font-bold">0</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                <span className="text-2xl">🎓</span>
              </div>
            </div>
          </div>
          
          <div className={`rounded-xl p-6 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} border`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Certificates</p>
                <p className="text-2xl font-bold">0</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                <span className="text-2xl">🏆</span>
              </div>
            </div>
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {trainingCourses.map((course) => (
            <div
              key={course.id}
              className={`rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                darkMode 
                  ? 'bg-slate-800 border-slate-700 hover:border-blue-500 hover:shadow-xl' 
                  : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-xl'
              } ${course.status === 'coming-soon' ? 'opacity-75' : ''}`}
            >
              {/* Course Header */}
              <div className={`p-6 ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl">{course.icon}</div>
                    <div>
                      <h3 className="text-xl font-semibold mb-1">{course.title}</h3>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {course.category}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(course.status)}
                </div>

                <p className={`text-sm mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {course.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      ⏱️ {course.duration}
                    </span>
                    {getDifficultyBadge(course.difficulty)}
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {course.price}
                    </p>
                  </div>
                </div>
              </div>

              {/* Course Details */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      {renderStars(course.rating)}
                      <span className={`ml-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {course.rating} ({course.studentsCount.toLocaleString()} students)
                      </span>
                    </div>
                  </div>
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Instructor: {course.instructor}
                  </div>
                </div>

                {/* Progress Bar */}
                {course.status === 'available' && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Your Progress
                      </span>
                      <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {course.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Features */}
                <div className="space-y-2 mb-6">
                  {course.features.slice(0, 4).map((feature, index) => (
                    <div key={index} className="flex items-center text-sm">
                      <span className="text-green-500 mr-2">✓</span>
                      <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                        {feature}
                      </span>
                    </div>
                  ))}
                  {course.features.length > 4 && (
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      +{course.features.length - 4} more features
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleCourseClick(course)}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    course.status === 'coming-soon'
                      ? darkMode 
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : darkMode
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                  disabled={course.status === 'coming-soon'}
                >
                  {course.status === 'coming-soon' ? 'Notify When Available' : 
                   course.destination === 'cmmcHub' ? 'Enter CMMC Training' : 'Start Course'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className={`mt-12 text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <p className="text-sm">
            Need help choosing a course? Contact our training advisors at training@assurit.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrainingOfferings;
