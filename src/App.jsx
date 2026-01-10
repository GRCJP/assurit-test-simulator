import React, { useEffect, useMemo, useState } from 'react';
import { TestModeProvider, useTestMode } from './contexts/TestModeContext';
import Dashboard from './components/Dashboard';
import DailyDrills from './components/DailyDrills';
import SimulatedTest from './components/SimulatedTest';
import RapidMemory from './components/RapidMemory';
import CheatSheet from './components/CheatSheet';
import ReviewMissed from './components/ReviewMissed';
import MissedCoach from './components/MissedCoach';
import ReviewMarked from './components/ReviewMarked';
import History from './components/History';
import StudyPlanner from './components/StudyPlanner';
import LearningAnalytics from './components/LearningAnalytics';
import PracticeMode from './components/PracticeMode';
import DomainPractice from './components/DomainPractice';
import ComprehensiveProgress from './components/ComprehensiveProgress';
import ErrorBoundary from './components/ErrorBoundary';
import CrossDeviceSync from './components/CrossDeviceSync';

import questionsCCP from '../data/questions_ccp_combined.json';
import questionsCCA from '../data/questions_cca.json';

import TestComponent from './components/TestComponent';
import { isKindleDevice, shouldShowKindleMode } from './utils/deviceDetection';
import { useAuth0 } from '@auth0/auth0-react';
import badgeImage from '/badge.png';
import assertionImage from '/assertion.png';

// Navigation component
const Navigation = ({ onLogout }) => {
  const { mode, setMode, darkMode, setDarkMode, textSize, setTextSize, startSimulatedTest, resetProgress, questionBankId, setQuestionBankId, resetToDashboard } = useTestMode();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [kindleMode, setKindleMode] = useState(() => {
    // Check if Kindle mode was previously enabled
    return localStorage.getItem('cmmc_kindle_mode') === 'true';
  });
  
  // Get current questions for the selected bank
  const questions = Array.isArray(
    questionBankId === 'bankCCA' ? questionsCCA : 
    questionsCCP
  ) ? (
    questionBankId === 'bankCCA' ? questionsCCA : 
    questionsCCP
  ) : [];

  // Debug: Log actual domains from loaded questions
  React.useEffect(() => {
    if (questions && questions.length > 0) {
      const actualDomains = [...new Set(questions.map(q => q.domain).filter(Boolean))];
      console.log('🔍 Question Bank Debug:', {
        questionBankId,
        totalQuestions: questions.length,
        actualDomains: actualDomains.sort(),
        domainCounts: actualDomains.reduce((acc, domain) => {
          acc[domain] = questions.filter(q => q.domain === domain).length;
          return acc;
        }, {}),
        sampleQuestion: questions[0]
      });
    }
  }, [questions, questionBankId]);

  // Handle Kindle mode toggle
  const toggleKindleMode = () => {
    const newMode = !kindleMode;
    setKindleMode(newMode);
    localStorage.setItem('cmmc_kindle_mode', newMode.toString());
    // Apply Kindle-specific styles
    if (newMode) {
      document.body.classList.add('kindle-mode');
    } else {
      document.body.classList.remove('kindle-mode');
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('.dropdown-container')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  // Initialize Kindle mode on mount
  useEffect(() => {
    if (kindleMode) {
      document.body.classList.add('kindle-mode');
    }
  }, [kindleMode]);

  const testBanks = [
    { id: 'bankCCP', label: 'CMMC-CCP 376 Questions', description: 'Combined CCP exam (⭐ = test questions)', color: 'green' },
    { id: 'bankCCA', label: 'CMMC-CCA 150 Questions', description: 'CMMC-CCA exam', color: 'blue' },
  ];

  const getCurrentBankColor = () => {
    const bank = testBanks.find(b => b.id === questionBankId);
    return bank?.color || 'gray';
  };

  const getCurrentBankLabel = () => {
    const bank = testBanks.find(b => b.id === questionBankId);
    return bank?.label || 'Select Bank';
  };

  const modeButtons = [
    { id: 'dashboard', label: 'Home' },
    { id: 'dailyDrills', label: 'Daily Drills' },
    { id: 'simulated', label: 'Exam' },
    { id: 'rapidMemory', label: 'Memory' },
    { id: 'history', label: 'Progress' },
  ];

  return (
    <nav className={`${darkMode ? 'bg-[#252526] border-[#3C3C3C]' : 'bg-[#FAFAF7] border-[#E0E0E0]'} border-b shadow-sm`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo and Branding */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Certification Logo - Prominent */}
            <img 
              src={
                questionBankId === 'bankCCA' 
                  ? badgeImage
                  : assertionImage
              }
              alt={
                questionBankId === 'bankCCA' ? 'CMMC-CCA Badge' : 'CMMC Badge'
              }
              className="h-10 sm:h-14 w-auto"
              onError={(e) => {
                console.warn('Badge image failed to load, using fallback');
                e.target.style.display = 'none';
              }}
            />
            
            <h1 className={`text-base sm:text-xl font-bold ${darkMode ? 'text-[#E6E6E6]' : 'text-[#1E1E1E]'}`}>
              CMMC Mastery
            </h1>
          </div>

          {/* Center - Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {modeButtons.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => {
                  if (id === 'dashboard') {
                    resetToDashboard();
                  } else if (id === 'simulated') {
                    startSimulatedTest(questions);
                  }
                  setMode(id);
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  mode === id
                    ? darkMode 
                      ? 'bg-[#4F83FF] text-white shadow-sm' 
                      : 'bg-[#4C6EF5] text-white shadow-sm'
                    : darkMode
                    ? 'text-[#9AA0A6] hover:bg-[#2D2D2E] hover:text-[#E6E6E6]'
                    : 'text-[#5F6368] hover:bg-[#F2F4F8] hover:text-[#1E1E1E]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Right side - Settings */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Exam Switcher - Subtle dropdown */}
            <div className="relative dropdown-container">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1 ${
                  darkMode 
                    ? 'bg-[#2D2D2E] text-[#9AA0A6] hover:bg-[#3C3C3C]' 
                    : 'bg-[#F2F4F8] text-[#5F6368] hover:bg-[#E8EAED] border border-[#E0E0E0]'
                }`}
                title="Switch Exam"
              >
                <span>{questionBankId === 'bankCCA' ? 'CCA' : 'CCP'}</span>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isDropdownOpen && (
                <div className={`absolute right-0 z-10 mt-2 w-56 rounded-lg shadow-xl ${
                  darkMode ? 'bg-[#2D2D2E] border border-[#3C3C3C]' : 'bg-white border border-[#E0E0E0]'
                }`}>
                  <div className="py-1">
                    {testBanks.map(bank => (
                      <button
                        key={bank.id}
                        onClick={() => {
                          setQuestionBankId(bank.id);
                          setIsDropdownOpen(false);
                        }}
                        className={`flex items-center gap-3 w-full px-4 py-2 text-sm transition-colors ${
                          questionBankId === bank.id 
                            ? darkMode ? 'bg-[#3C3C3C] text-white' : 'bg-[#F2F4F8] text-[#1E1E1E]'
                            : darkMode ? 'text-[#9AA0A6] hover:bg-[#3C3C3C]' : 'text-[#5F6368] hover:bg-[#F8F9FA]'
                        }`}
                      >
                        <span>{bank.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Kindle Mode Toggle - Only visible on Kindle devices */}
            {shouldShowKindleMode() && (
              <button
                onClick={toggleKindleMode}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  kindleMode
                    ? 'bg-orange-600 text-white'
                    : darkMode 
                      ? 'bg-[#2D2D2E] text-[#9AA0A6] hover:bg-[#3C3C3C]' 
                      : 'bg-[#F2F4F8] text-[#5F6368] hover:bg-[#E8EAED] border border-[#E0E0E0]'
                }`}
                title={kindleMode ? 'Disable Kindle Mode' : 'Enable Kindle Mode'}
              >
                📱 Kindle
              </button>
            )}

            {/* Logout button - Smaller on mobile */}
            <button
              onClick={onLogout}
              className={`hidden sm:block px-3 py-1 rounded text-xs font-medium transition-colors ${
                darkMode 
                  ? 'bg-[#3C3C3C] text-[#9AA0A6] hover:bg-[#4C4C4D]' 
                  : 'bg-[#F2F4F8] text-[#5F6368] hover:bg-[#E8EAED]'
              }`}
              title="Sign out"
            >
              Sign out
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 rounded-lg transition-colors ${
                darkMode 
                  ? 'text-[#9AA0A6] hover:bg-[#2D2D2E]' 
                  : 'text-[#5F6368] hover:bg-[#F2F4F8]'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className={`md:hidden border-t ${darkMode ? 'border-[#3C3C3C] bg-[#252526]' : 'border-[#E0E0E0] bg-[#FAFAF7]'}`}>
            <div className="px-2 py-2 space-y-1">
              {modeButtons.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => {
                    if (id === 'dashboard') {
                      resetToDashboard();
                    } else if (id === 'simulated') {
                      startSimulatedTest(questions);
                    }
                    setMode(id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    mode === id
                      ? darkMode 
                        ? 'bg-[#4F83FF] text-white shadow-sm' 
                        : 'bg-[#4C6EF5] text-white shadow-sm'
                      : darkMode
                      ? 'text-[#9AA0A6] hover:bg-[#2D2D2E] hover:text-[#E6E6E6]'
                      : 'text-[#5F6368] hover:bg-[#F2F4F8] hover:text-[#1E1E1E]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Dark mode toggle - bottom right corner, adjusted for mobile */}
      <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`p-2 sm:p-3 rounded-full shadow-lg transition-all ${
            darkMode 
              ? 'bg-[#2D2D2E] text-[#9AA0A6] hover:bg-[#3C3C3C] shadow-black/20' 
              : 'bg-[#F2F4F8] text-[#5F6368] hover:bg-[#E8EAED] shadow-gray-300/20'
          }`}
          title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </button>
      </div>
    </nav>
  );
};
function App() {
  const { isLoading, isAuthenticated, user, loginWithRedirect, logout, error } = useAuth0();
  const isLocalhost = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  }, []);

  const allowLocalBypass = Boolean(import.meta.env.DEV && isLocalhost);
  const bypassAuth = useMemo(() => (
    import.meta.env.VITE_BYPASS_AUTH === 'true' ||
    localStorage.getItem('cmmc_bypass_auth') === 'true'
  ), []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Initializing...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">Error</div>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }

  if (bypassAuth) {
    return (
      <AppContent
        userEmail={user?.email || ''}
        onLogout={() => {
          localStorage.removeItem('cmmc_bypass_auth');
          window.location.reload();
        }}
      />
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h1 className="text-xl font-semibold">Sign in</h1>
          <p className="text-slate-300 mt-2">
            Sign in to sync your progress across devices.
          </p>
          <button
            type="button"
            onClick={() => loginWithRedirect()}
            className="mt-6 w-full px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700"
          >
            Sign in
          </button>
          {allowLocalBypass && (
            <button
              type="button"
              onClick={() => {
                localStorage.setItem('cmmc_bypass_auth', 'true');
                window.location.reload();
              }}
              className="mt-3 w-full px-4 py-2 rounded-lg bg-gray-700 text-white font-medium hover:bg-gray-600"
            >
              Continue without sign-in (local testing)
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <AppContent userEmail={user?.email || ''} onLogout={() => logout({ logoutParams: { returnTo: window.location.origin } })} />
  );
}

function TestModeProviderWrapper({ children }) {
  const { questionBankId } = useTestMode();
  
  // Get current questions for the selected bank
  const questions = Array.isArray(
    questionBankId === 'bankCCA' ? questionsCCA : 
    questionsCCP
  ) ? (
    questionBankId === 'bankCCA' ? questionsCCA : 
    questionsCCP
  ) : [];

  return (
    <TestModeProvider questions={questions}>
      {children}
    </TestModeProvider>
  );
}

function AppContent({ userEmail, onLogout }) {
  const { 
    mode, 
    darkMode, 
    questionBankId,
    testHistory,
    progressStreaks,
    getWeeklyProgress,
    getMonthlyProgress,
    adaptiveDifficulty,
    spacedRepetition,
    supabaseUserId
  } = useTestMode();
  const questions = Array.isArray(
    questionBankId === 'bankCCA' ? questionsCCA : 
    questionsCCP
  ) ? (
    questionBankId === 'bankCCA' ? questionsCCA : 
    questionsCCP
  ) : [];
  
  // Log the user ID after successful login
  useEffect(() => {
    if (supabaseUserId) {
      console.log('Auth0 user ID (used for database):', supabaseUserId);
    }
  }, [supabaseUserId]);
  
  console.log('AppContent - questionBankId:', questionBankId);
  console.log('AppContent - questions length:', questions.length);
  console.log('AppContent - questions:', questions);

  return (
    <ErrorBoundary>
      <div className={`min-h-screen ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-gray-50 text-slate-900'}`}>
        <Navigation onLogout={onLogout} />
        <main className="py-4">
          {questions.length === 0 ? (
            <div className="max-w-4xl mx-auto px-4">
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white shadow-sm'} rounded-xl p-6`}>
                <h1 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  No questions loaded for this bank
                </h1>
                <p className={`mt-2 text-sm ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>
                  Add questions to the selected JSON file in the data folder, then refresh.
                </p>
              </div>
            </div>
          ) : (
            <>
              {mode === 'practice' && <PracticeMode questions={questions} />}
              {mode === 'dashboard' && <Dashboard questions={questions} />}
              {mode === 'dailyDrills' && <DailyDrills questions={questions} />}
              {mode === 'domainPractice' && <DomainPractice questions={questions} />}
              {mode === 'simulated' && (
                (() => {
                console.log('🔥 RENDERING SIMULATED TEST! Mode:', mode);
                return <SimulatedTest questions={questions} />;
              })()
            )}
            {mode === 'studyPlanner' && <StudyPlanner />}
            {mode === 'performance' && (
              <ComprehensiveProgress 
                testHistory={testHistory}
                scoreStats={scoreStats}
                progressStreaks={progressStreaks}
                studyPlan={studyPlan}
                domainMastery={domainMastery}
                questionStats={questionStats}
                missedQuestions={missedQuestions}
                darkMode={darkMode}
                getReadinessScore={getReadinessScore}
                questions={questions}
                questionBankId={questionBankId}
                getQuestionCount={getQuestionCount}
                initializeDomainMastery={initializeDomainMastery}
              />
            )}
            {mode === 'rapidMemory' && <RapidMemory questions={questions} />}
            {mode === 'cheatSheet' && <CheatSheet questions={questions} />}
            {mode === 'reviewMissed' && <ReviewMissed questions={questions} />}
            {mode === 'missedCoach' && <MissedCoach questions={questions} />}
            {mode === 'reviewMarked' && <ReviewMarked questions={questions} />}
            {mode === 'history' && <History questions={questions} />}
          </>
        )}
      </main>
      
      {/* Cross-Device Sync - Manual export/import for immediate functionality */}
      <CrossDeviceSync />
    </div>
    </ErrorBoundary>
  );
}

export default App;
