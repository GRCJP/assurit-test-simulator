import React, { useState, useEffect } from 'react';
import { useTestMode } from '../contexts/TestModeContext';

const RapidMemory = ({ questions }) => {
  const { textSize, darkMode, markQuestion, markedQuestions, rapidIndex, setRapidIndex } = useTestMode();
  const [currentQuestion, setCurrentQuestion] = useState(rapidIndex);
  const [showExplanation, setShowExplanation] = useState(false);

  // Save current index when it changes
  useEffect(() => {
    setRapidIndex(currentQuestion);
  }, [currentQuestion, setRapidIndex]);

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setShowExplanation(false); // Reset explanation when navigating
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      setShowExplanation(false); // Reset explanation when navigating
    }
  };

  // const handleJump = (index) => {
//   setCurrentQuestion(index);
// };

  // Safe access to current question
  const q = questions && questions.length > 0 && currentQuestion >= 0 && currentQuestion < questions.length 
    ? questions[currentQuestion] 
    : null;
  const correctChoice = q ? q.choices.find(c => c.correct) : null;

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} p-4`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className={`rounded-lg p-6 mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Rapid Memory Mode</h1>
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>
              {currentQuestion + 1} / {questions.length}
            </span>
          </div>
          <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
            Review questions and correct answers quickly. All choices shown with correct answer highlighted.
          </p>
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
            disabled={currentQuestion === questions.length - 1}
            className={`px-4 py-2 rounded-lg ${
              currentQuestion === questions.length - 1
                ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
                : darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-600 text-white hover:bg-gray-700'
            }`}
          >
            Next
          </button>
        </div>

        {/* Question Card */}
        <div className={`rounded-lg p-6 mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <div className="flex justify-between items-start mb-4">
            <div className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>
              {q.domain || 'General'}
            </div>
            <button
              onClick={() => markQuestion(q.id)}
              className={`px-3 py-1 rounded text-sm ${
                markedQuestions.has(q.id)
                  ? 'bg-yellow-500 text-white'
                  : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
              }`}
            >
              {markedQuestions.has(q.id) ? 'Marked' : 'Mark for Review'}
            </button>
          </div>
          
          <h2 className={`text-xl font-semibold mb-6 ${textSize === 'sm' ? 'text-base' : textSize === 'lg' ? 'text-2xl' : textSize === 'xl' ? 'text-3xl' : ''}`}>
            {q.question}
          </h2>

          <div className="border-t pt-6">
            <div className="space-y-3">
              {q.choices.map((choice, index) => (
                <div 
                  key={choice.id}
                  className={`p-4 rounded-lg border-2 ${
                    choice.correct
                      ? darkMode 
                        ? 'border-green-500 bg-green-900/20' 
                        : 'border-green-500 bg-green-50'
                      : darkMode 
                        ? 'border-gray-600 bg-gray-700/50' 
                        : 'border-gray-300 bg-gray-50'
                  }`}
                >
                  <div className={`font-medium ${textSize === 'sm' ? 'text-sm' : textSize === 'lg' ? 'text-lg' : textSize === 'xl' ? 'text-xl' : ''} ${
                    choice.correct 
                      ? 'text-green-900 dark:text-green-400' 
                      : darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {choice.id}. {choice.text}
                    {choice.correct && (
                      <span className="ml-2 text-sm font-medium text-green-900 dark:text-green-400">
                        ✓ Correct
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Explanation Toggle */}
          {q.explanation && (
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
          )}

          {showExplanation && q.explanation && (
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <h3 className="font-semibold mb-2">Explanation:</h3>
              <p className={`${textSize === 'sm' ? 'text-sm' : textSize === 'lg' ? 'text-lg' : textSize === 'xl' ? 'text-xl' : ''} whitespace-pre-line`}>
                {q.explanation}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RapidMemory;
