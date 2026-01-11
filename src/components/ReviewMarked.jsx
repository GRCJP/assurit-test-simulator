import React, { useState, useMemo, useCallback } from 'react';
import { useTestMode } from '../contexts/TestModeContext';

const ReviewMarked = ({ questions, onClose }) => {
  const { textSize, darkMode, markedQuestions, markQuestion } = useTestMode();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  // Get the actual marked questions from the full questions list
  // Memoize to prevent excessive re-filtering on every render
  const markedQuestionsList = useMemo(() => {
    return questions.filter(q => markedQuestions.has(q.id));
  }, [questions, markedQuestions]);

  const handleNext = useCallback(() => {
    if (currentQuestion < markedQuestionsList.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setShowExplanation(false);
    }
  }, [currentQuestion, markedQuestionsList.length]);

  const handlePrevious = useCallback(() => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      setShowExplanation(false);
    }
  }, [currentQuestion]);

  const handleJump = useCallback((index) => {
    setCurrentQuestion(index);
    setShowExplanation(false);
  }, []);

  if (markedQuestionsList.length === 0) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-[#1E1E1E] text-[#E6E6E6]' : 'bg-[#FAFAF7] text-[#1E1E1E]'} p-4`}>
        <div className="max-w-4xl mx-auto">
          <div className={`rounded-lg p-12 text-center ${darkMode ? 'bg-[#252526]' : 'bg-[#F2F4F8] shadow-sm'}`}>
            <h1 className="text-2xl font-bold mb-4">No Marked Questions</h1>
            <p className={`${darkMode ? 'text-[#9AA0A6]' : 'text-[#5F6368]'} mb-8`}>
              You haven't marked any questions for review yet. 
              In Simulated Test mode, click "Mark for Review" on questions you want to revisit.
            </p>
            <button
              onClick={onClose || (() => window.location.reload())}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                darkMode 
                  ? 'bg-[#4F83FF] text-white hover:bg-[#5A8DFF]' 
                  : 'bg-[#4C6EF5] text-white hover:bg-[#5A7CFF]'
              }`}
            >
              Back to Practice
            </button>
          </div>
        </div>
      </div>
    );
  }

  const q = markedQuestionsList[currentQuestion];
  const selectedAnswer = markedQuestions.get(q.id);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} p-4`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-6">
          {/* Side Panel - Question Navigation */}
          <div className="w-80 flex-shrink-0">
            <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'} sticky top-4`}>
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Question Navigation
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {markedQuestionsList.map((question, index) => (
                  <button
                    key={question.id}
                    onClick={() => handleJump(index)}
                    className={`aspect-square rounded-lg border-2 text-xs font-medium transition-all hover:scale-105 ${
                      index === currentQuestion
                        ? darkMode 
                          ? 'bg-blue-600 border-blue-500 text-white shadow-lg' 
                          : 'bg-blue-500 border-blue-400 text-white shadow-lg'
                        : darkMode
                          ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                    }`}
                    title={`Question ${index + 1}: ${question.domain || 'General'}`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              
              <div className={`mt-4 p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <div className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Progress
                </div>
                <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {currentQuestion + 1} of {markedQuestionsList.length}
                </div>
                <div className="w-full bg-gray-300 rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${((currentQuestion + 1) / markedQuestionsList.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className={`rounded-lg p-6 mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Review Marked Questions</h1>
                <div className="flex items-center gap-4">
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>
                    {currentQuestion + 1} / {markedQuestionsList.length}
                  </span>
                  <button
                    onClick={() => {
                      // Clear all marked questions
                      markedQuestions.forEach(id => markQuestion(id));
                      // Then go back to practice
                      if (onClose) {
                        onClose();
                      } else {
                        window.location.reload();
                      }
                    }}
                    className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                  >
                    Clear All
                  </button>
                </div>
              </div>
              <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                Review questions you marked during the simulated test.
              </p>
            </div>

        {/* Question Card */}
        <div className={`rounded-lg p-6 mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <div className="flex items-start justify-between gap-4">
            <div className={`text-sm font-medium mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>
              {q.domain || 'General'}
            </div>
            <button
              onClick={() => {
                if (q?.id) {
                  markQuestion(q.id);
                }
              }}
              className={`px-3 py-1 rounded text-sm ${
                markedQuestions.has(q?.id)
                  ? 'bg-yellow-500 text-white'
                  : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {markedQuestions.has(q?.id) ? 'Unmark' : 'Mark'}
            </button>
          </div>
          
          <h2 className={`text-xl font-semibold mt-4 mb-6 ${textSize === 'sm' ? 'text-base' : textSize === 'lg' ? 'text-2xl' : textSize === 'xl' ? 'text-3xl' : ''}`}>
            {q.question}
          </h2>

          {/* Choices with user's selection and correct answer highlighted */}
          <div className="space-y-3 mb-6">
            {q.choices.map(choice => {
              const isCorrect = choice.correct;
              const isSelected = choice.id === selectedAnswer;
              
              return (
                <div
                  key={choice.id}
                  className={`p-4 rounded-lg border-2 ${
                    isCorrect
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : isSelected
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                      : darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="font-medium mr-3">{choice.id}.</span>
                    <span className={textSize === 'sm' ? 'text-sm' : textSize === 'lg' ? 'text-lg' : textSize === 'xl' ? 'text-xl' : ''}>
                      {choice.text}
                    </span>
                    {isCorrect && (
                      <span className="ml-auto text-green-600 dark:text-green-400 font-medium">
                        ✓ Correct Answer
                      </span>
                    )}
                    {isSelected && !isCorrect && (
                      <span className="ml-auto text-red-600 dark:text-red-400 font-medium">
                        ✗ Your Answer
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
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
                ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
                : darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-600 text-white hover:bg-gray-700'
            }`}
          >
            Previous
          </button>

          <button
            onClick={onClose || (() => window.location.reload())}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Practice
          </button>

          <button
            onClick={handleNext}
            disabled={currentQuestion === markedQuestionsList.length - 1}
            className={`px-4 py-2 rounded-lg ${
              currentQuestion === markedQuestionsList.length - 1
                ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
                : darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-600 text-white hover:bg-gray-700'
            }`}
          >
            Next
          </button>
        </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewMarked;
