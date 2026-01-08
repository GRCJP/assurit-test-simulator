import React, { useState } from 'react';
import { useTestMode } from '../contexts/TestModeContext';

const ReviewMarked = ({ questions }) => {
  const { textSize, darkMode, markedQuestions, markQuestion } = useTestMode();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  // Get the actual marked questions from the full questions list
  const markedQuestionsList = questions.filter(q => markedQuestions.has(q.id));

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
              onClick={() => window.location.reload()}
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

  const handleNext = () => {
    if (currentQuestion < markedQuestionsList.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setShowExplanation(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      setShowExplanation(false);
    }
  };

  const handleJump = (index) => {
    setCurrentQuestion(index);
    setShowExplanation(false);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} p-4`}>
      <div className="max-w-4xl mx-auto">
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
                  // Then refresh the page to go back to practice
                  window.location.reload();
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
            onClick={() => window.location.reload()}
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

        {/* Quick Jump Grid */}
        <div className={`rounded-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <h3 className="font-semibold mb-4">Quick Jump</h3>
          <div className="grid grid-cols-10 gap-2">
            {markedQuestionsList.map((_, index) => (
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

export default ReviewMarked;
