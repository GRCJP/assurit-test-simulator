import React, { useState } from 'react';
import { useTestMode } from '../contexts/TestModeContext';
import { Target, TrendingUp, Clock, Calendar, AlertTriangle, CheckCircle, XCircle, Play, BookOpen, FileText, Award } from 'lucide-react';
import DomainSelector from './DomainSelector';

const ExamFocusedDashboard = ({ questions: questionsProp }) => {
  const {
    darkMode,
    setMode,
    getQuestionBankName,
    getQuestionBankTotal,
    studyPlan,
    setTestDate,
    setDailyGoal,
    setTargetQuestionsPerDay,
    daysUntil,
    progressStreaks,
    getDomainMasteryLevel,
    domainMastery,
    missedQuestions,
    missedQueue,
    missedMeta,
    scoreStats,
    startSimulatedTest,
    resetProgress,
    questions,
    updateDomainMastery,
    // Domain practice functions
    startDomainPractice,
    clearDomainPractice,
    initializeDomainMastery,
    questionBankId
  } = useTestMode();

  const [showSettings, setShowSettings] = useState(false);

  // Debug: Check if questions are available in ExamFocusedDashboard
  console.log('🏠 ExamFocusedDashboard: Questions check:', {
    questionsAvailable: !!questionsProp,
    questionsLength: questionsProp?.length || 0,
    questionsType: typeof questionsProp,
    isArray: Array.isArray(questionsProp),
    sampleQuestion: questionsProp?.[0] || null
  });
  
  // Color theme based on exam bank
  const isCCA = questionBankId === 'bankCCA';
  const primaryGradient = isCCA
    ? darkMode 
      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' 
      : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
    : darkMode
      ? 'bg-gradient-to-r from-green-600 to-yellow-600 hover:from-green-700 hover:to-yellow-700'
      : 'bg-gradient-to-r from-green-500 to-yellow-500 hover:from-green-600 hover:to-yellow-600';
  
  const secondaryGradient = isCCA
    ? darkMode 
      ? 'bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700' 
      : 'bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600'
    : darkMode
      ? 'bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700'
      : 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600';

  const handleCompleteReset = () => {
    if (window.confirm('⚠️ COMPLETE RESET - Are you sure? This will clear:\n\n• All progress and statistics\n• Study streaks and history\n• Question mastery and domain stats\n• Study plan and readiness data\n• Daily goals and progress\n• All practice sessions\n• All missed questions\n\n⚠️ This action cannot be undone!')) {
      console.log('🧹 Performing complete reset of all study data');
      
      // Reset all progress and study data
      resetProgress();
      
      // Clear localStorage study data
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('cmmc_')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      console.log('🧹 Cleared localStorage keys:', keysToRemove);
      
      // Close settings and reload
      setShowSettings(false);
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  };

  const overallAccuracy = scoreStats.totalQuestions > 0 
    ? Math.round((scoreStats.correctAnswers / scoreStats.totalQuestions) * 100) 
    : 0;

  // Get actual domains from questions in current bank
  const cmmcDomains = React.useMemo(() => {
    if (!questions || questions.length === 0) return [];
    const uniqueDomains = [...new Set(questions.map(q => q.domain).filter(Boolean))];
    return uniqueDomains.sort();
  }, [questions]);

  const domainPerformance = cmmcDomains.map(domain => {
    const domainData = domainMastery?.levels?.[domain];
    console.log(`🔍 Domain "${domain}":`, domainData);
    const accuracy = domainData && domainData.total > 0 
      ? Math.round((domainData.correct / domainData.total) * 100) 
      : 0;
    const status = accuracy >= 85 ? 'strong' : accuracy >= 70 ? 'warning' : accuracy > 0 ? 'critical' : 'not_started';
    const action = accuracy > 0 ? 'Target' : 'Start';
    
    return {
      name: domain,
      accuracy,
      status,
      action,
      attempts: domainData?.total || 0
    };
  }).sort((a, b) => {
    // Sort not_started domains last, then by accuracy
    if (a.status === 'not_started' && b.status !== 'not_started') return 1;
    if (b.status === 'not_started' && a.status !== 'not_started') return -1;
    return a.accuracy - b.accuracy;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'strong': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'critical': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'not_started': return <Clock className="w-4 h-4 text-gray-400" />;
      default: return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'strong': return darkMode ? 'text-green-400' : 'text-green-700';
      case 'warning': return darkMode ? 'text-yellow-400' : 'text-yellow-700';
      case 'critical': return darkMode ? 'text-red-400' : 'text-red-700';
      case 'not_started': return darkMode ? 'text-gray-400' : 'text-gray-600';
      default: return '';
    }
  };

  const getSeverityColor = (accuracy, status) => {
    if (status === 'not_started') {
      return darkMode ? 'text-gray-400 bg-gray-800/50 border-gray-600/30' : 'text-gray-600 bg-gray-50 border-gray-200';
    }
    if (accuracy < 50) {
      return darkMode ? 'text-red-400 bg-red-900/20 border-red-500/30' : 'text-red-700 bg-red-50 border-red-200';
    } else if (accuracy <= 75) {
      return darkMode ? 'text-yellow-400 bg-yellow-900/20 border-yellow-500/30' : 'text-yellow-700 bg-yellow-50 border-yellow-200';
    } else {
      return darkMode ? 'text-green-400 bg-green-900/20 border-green-500/30' : 'text-green-700 bg-green-50 border-green-200';
    }
  };

  const handleDomainClick = () => {
    setMode('practice');
  };

  const handlePrimaryAction = () => {
    setMode('dailyDrills');
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-gray-50 text-slate-900'} p-3 sm:p-4`}>
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold mb-2">
              🎯 {getQuestionBankName().includes('CCA') ? 'CCA' : 'CCP'} EXAM REVIEW ({getQuestionBankTotal()} Questions)
            </h1>
            {studyPlan.testDate && (
              <p className={`text-lg font-medium text-blue-600 dark:text-blue-400 mt-2`}>
                📅 {daysUntil(studyPlan.testDate)} days until exam
              </p>
            )}
          </div>

          <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-xl p-6 mb-6`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="flex items-center justify-center gap-3 mb-2">
                  <div className="text-4xl">🔥</div>
                  <span className="text-4xl font-bold text-orange-500">{progressStreaks.currentStreak}</span>
                </div>
                <div className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Day Streak</div>
              </div>
              
              <div>
                <div className="flex items-center justify-center gap-3 mb-2">
                  <div className="text-4xl">📅</div>
                  <span className="text-4xl font-bold text-blue-500">
                    {studyPlan.testDate ? daysUntil(studyPlan.testDate) : '--'}
                  </span>
                </div>
                <div className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Days Until Exam</div>
              </div>
              
              <div>
                <div className="flex items-center justify-center gap-3 mb-2">
                  <div className="text-4xl">📊</div>
                  <span className="text-4xl font-bold text-green-500">{overallAccuracy}%</span>
                </div>
                <div className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Exam Readiness</div>
              </div>
            </div>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-xl font-bold mb-4">🚀 START TODAY'S MISSION</h2>
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <button
                onClick={handlePrimaryAction}
                className={`w-full md:w-auto px-8 py-4 text-lg font-bold rounded-xl transition-all transform hover:scale-105 ${primaryGradient} text-white shadow-lg`}
              >
                <div className="flex items-center justify-center gap-3">
                  <Play className="w-6 h-6" />
                  <span>BEGIN DAILY DRILLS</span>
                </div>
              </button>
              
              <button
                onClick={() => setShowSettings(true)}
                className={`w-full md:w-auto px-6 py-4 text-lg font-bold rounded-xl transition-all transform hover:scale-105 ${secondaryGradient} text-white shadow-lg`}
              >
                <div className="flex items-center justify-center gap-3">
                  <Calendar className="w-6 h-6" />
                  <span>{studyPlan.testDate ? 'MODIFY STUDY PLAN' : 'SET STUDY PLAN'}</span>
                </div>
              </button>
            </div>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-4 mb-6`}>
              {!studyPlan.testDate 
                ? 'Set your study plan to track progress and stay on schedule'
                : 'Complete your daily practice to maintain streak and improve readiness'}
            </p>
            
            {/* Integrated Quick Actions - below main buttons */}
            <div className="flex flex-wrap justify-center gap-3 mt-4">
              <button
                onClick={() => setMode('reviewMissed')}
                disabled={missedQuestions.length === 0}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  missedQuestions.length === 0
                    ? darkMode 
                      ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed' 
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : darkMode
                      ? 'bg-red-600/10 text-red-400 hover:bg-red-600/20 border border-red-500/30'
                      : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                }`}
              >
                Review Missed ({missedQuestions.length})
              </button>
              
              <button
                onClick={() => setMode('missedCoach')}
                disabled={missedQueue.length === 0}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  missedQueue.length === 0
                    ? darkMode 
                      ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed' 
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : darkMode
                      ? 'bg-orange-600/10 text-orange-400 hover:bg-orange-600/20 border border-orange-500/30'
                      : 'bg-orange-50 text-orange-600 hover:bg-orange-100 border border-orange-200'
                }`}
              >
                Missed Coach ({missedQueue.length})
              </button>
              
              <button
                onClick={() => setMode('practice')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  darkMode
                    ? 'bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 border border-blue-500/30'
                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200'
                }`}
              >
                Full Practice
              </button>
            </div>
          </div>
        </div>

        {/* Domain-Specific Practice */}
        <DomainSelector
          questions={questionsProp}
          domainMastery={domainMastery}
          darkMode={darkMode}
          onDomainSelect={startDomainPractice}
          onStartPractice={() => setMode('domainPractice')}
          missedQuestions={missedQuestions}
        />
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} rounded-xl p-6 max-w-md w-full shadow-xl`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                Study Plan Settings
              </h2>
              <button
                onClick={() => setShowSettings(false)}
                className={`text-2xl ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-700 hover:text-gray-900'} transition-colors`}
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              {/* Test Date */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
                  Test Date
                </label>
                <input
                  type="date"
                  value={studyPlan.testDate || ''}
                  onChange={(e) => setTestDate(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                />
              </div>

              {/* Daily Goal */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
                  Daily Study Goal (questions)
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={studyPlan.dailyGoal || 15}
                  onChange={(e) => setDailyGoal(parseInt(e.target.value) || 15)}
                  className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                />
              </div>

              {/* Target Questions Per Day */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
                  Target Questions Per Day
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={studyPlan.targetQuestionsPerDay || 15}
                  onChange={(e) => setTargetQuestionsPerDay(parseInt(e.target.value) || 15)}
                  className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                />
              </div>

              {/* Progress Summary */}
              {studyPlan.testDate && (
                <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    📅 {daysUntil(studyPlan.testDate)} days until exam
                  </p>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    📊 Daily goal: {studyPlan.dailyGoal || 15} questions
                  </p>
                </div>
              )}
              
              {/* Save Button */}
              <div className="flex justify-between pt-4 border-t ${darkMode ? 'border-gray-600' : 'border-gray-200'}">
                <button
                  onClick={handleCompleteReset}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    darkMode
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-red-500 text-white hover:bg-red-600'
                  }`}
                >
                  🗑️ Reset All Data
                </button>
                <button
                  onClick={() => setShowSettings(false)}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${
                    darkMode
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'bg-purple-500 text-white hover:bg-purple-600'
                  }`}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamFocusedDashboard;
