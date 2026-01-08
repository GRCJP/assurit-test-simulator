import React, { useState } from 'react';
import { useTestMode } from '../contexts/TestModeContext';

const ReviewMissed = ({ questions: _questions }) => {
  const { 
    textSize, 
    darkMode, 
    missedQuestions, 
    clearMissed,
    updateQuestionStats,
    updateScoreStats,
    addToMissed,
    updateProgressStreaks
  } = useTestMode();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);

  if (missedQuestions.length === 0) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} p-4`}>
        <div className="max-w-4xl mx-auto">
          <div className={`rounded-lg p-12 text-center ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
            <h1 className="text-2xl font-bold mb-4">No Missed Questions</h1>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-8`}>
              You haven't missed any questions yet. Keep practicing!
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Back to Practice
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Safe access to current question
  const q = missedQuestions && missedQuestions.length > 0 && currentQuestion >= 0 && currentQuestion < missedQuestions.length 
    ? missedQuestions[currentQuestion] 
    : null;

  const handleSelectChoice = (choiceId, isCorrect) => {
    setSelectedChoice(choiceId);
    setShowResult(true);
    
    // Update stats based on the answer
    updateQuestionStats(q, isCorrect);
    updateScoreStats(isCorrect);
    updateProgressStreaks(1, isCorrect);
    
    // If still incorrect, keep it in missed questions
    if (!isCorrect) {
      addToMissed(q);
    }
  };

  const handleNext = () => {
    if (currentQuestion < missedQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setShowExplanation(false);
      setSelectedChoice(null);
      setShowResult(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      setShowExplanation(false);
      setSelectedChoice(null);
      setShowResult(false);
    }
  };

  const handleJump = (index) => {
    setCurrentQuestion(index);
    setShowExplanation(false);
    setSelectedChoice(null);
    setShowResult(false);
  };

  const handleRetake = () => {
    setSelectedChoice(null);
    setShowResult(false);
    setShowExplanation(false);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} p-4`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className={`rounded-lg p-6 mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Review Missed Questions</h1>
            <div className="flex items-center gap-4">
              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {currentQuestion + 1} / {missedQuestions.length}
              </span>
              <button
                onClick={clearMissed}
                className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
              >
                Clear All
              </button>
            </div>
          </div>
          <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
            Retake missed questions to improve your scores and remove them from this list.
          </p>
        </div>

        {/* Question Card */}
        <div className={`rounded-lg p-6 mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <div className={`text-sm font-medium mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {q.domain}
          </div>
          
          <h2 className={`text-xl font-semibold mb-6 ${textSize === 'sm' ? 'text-base' : textSize === 'lg' ? 'text-2xl' : textSize === 'xl' ? 'text-3xl' : ''}`}>
            {q.question}
          </h2>

          {/* Choices with correct answer highlighted */}
          <div className="space-y-3 mb-6">
            {q.choices.map(choice => (
              <div
                key={choice.id}
                className={`p-4 rounded-lg border-2 ${
                  choice.correct
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-center">
                  <span className="font-medium mr-3">{choice.id}.</span>
                  <span className={textSize === 'sm' ? 'text-sm' : textSize === 'lg' ? 'text-lg' : textSize === 'xl' ? 'text-xl' : ''}>
                    {choice.text}
                  </span>
                  {choice.correct && (
                    <span className="ml-auto text-green-600 dark:text-green-400 font-medium">
                      ✓ Correct Answer
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Explanation Toggle */}
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className={`w-full p-3 rounded-lg border-2 mb-4 transition-all ${
              showExplanation
                ? darkMode ? 'border-blue-500 bg-blue-900/20' : 'border-blue-500 bg-blue-50'
                : darkMode ? 'border-gray-700 bg-gray-800 hover:border-gray-600' : 'border-gray-200 bg-gray-50 hover:border-gray-300'
            }`}
          >
            <div className="text-center font-medium">
              {showExplanation ? 'Hide Explanation' : 'Show Explanation'}
            </div>
          </button>

          {showExplanation && q.explanation && (
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <h3 className="font-semibold mb-2">Explanation:</h3>
              <p className={`${textSize === 'sm' ? 'text-sm' : textSize === 'lg' ? 'text-lg' : textSize === 'xl' ? 'text-xl' : ''} whitespace-pre-line`}>
                {q.explanation}
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className={`px-4 py-2 rounded-lg ${
              currentQuestion === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-600 text-white hover:bg-gray-700'
            }`}
          >
            Previous
          </button>

          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Practice
          </button>

          <button
            onClick={handleNext}
            disabled={currentQuestion === missedQuestions.length - 1}
            className={`px-4 py-2 rounded-lg ${
              currentQuestion === missedQuestions.length - 1
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-600 text-white hover:bg-gray-700'
            }`}
          >
            Next
          </button>
        </div>

        {/* Quick Jump Grid */}
        <div className={`rounded-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <h3 className="font-semibold mb-4">Quick Jump</h3>
          <div className="grid grid-cols-10 gap-2">
            {missedQuestions.map((_, index) => (
              <button
                key={index}
                onClick={() => handleJump(index)}
                className={`p-2 rounded text-sm transition-colors ${
                  index === currentQuestion
                    ? 'bg-blue-600 text-white'
                    : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewMissed;
