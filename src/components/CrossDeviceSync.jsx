import React, { useState } from 'react';
import { useTestMode } from '../contexts/TestModeContext';

const CrossDeviceSync = () => {
  const { 
    progressStreaks, 
    scoreStats, 
    studyPlan, 
    domainMastery, 
    questionStats, 
    missedQuestions,
    testHistory,
    questionBankId 
  } = useTestMode();
  
  const [importData, setImportData] = useState('');
  const [showExport, setShowExport] = useState(false);
  const [message, setMessage] = useState('');

  // Export all user data as JSON
  const exportData = () => {
    const allData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      questionBankId,
      data: {
        progressStreaks,
        scoreStats,
        studyPlan,
        domainMastery,
        questionStats,
        missedQuestions,
        testHistory
      }
    };

    const jsonString = JSON.stringify(allData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `cmmc-progress-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setMessage('✅ Progress exported successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  // Import user data from JSON
  const importDataHandler = () => {
    try {
      const parsedData = JSON.parse(importData);
      
      // Validate data structure
      if (!parsedData.data || !parsedData.version) {
        throw new Error('Invalid data format');
      }

      // Import data to localStorage (this will be picked up by the app)
      Object.keys(parsedData.data).forEach(dataType => {
        if (parsedData.data[dataType]) {
          const key = `cmmc_${parsedData.questionBankId || questionBankId}_${dataType}`;
          localStorage.setItem(key, JSON.stringify(parsedData.data[dataType]));
        }
      });

      setMessage('✅ Progress imported successfully! Refresh the page to see changes.');
      setImportData('');
      
      // Trigger page reload after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      setMessage('❌ Import failed: ' + error.message);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 max-w-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">Cross-Device Sync</h3>
        <button
          onClick={() => setShowExport(!showExport)}
          className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {showExport ? 'Hide' : 'Show'}
        </button>
      </div>

      {showExport && (
        <div className="space-y-3">
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Export your progress and import it on another device
          </div>

          {/* Export Section */}
          <div className="space-y-2">
            <button
              onClick={exportData}
              className="w-full text-xs px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              📤 Export Progress
            </button>
          </div>

          {/* Import Section */}
          <div className="space-y-2">
            <label className="text-xs font-medium">Import Data:</label>
            <textarea
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              placeholder="Paste exported JSON data here..."
              className="w-full text-xs p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              rows={4}
            />
            <button
              onClick={importDataHandler}
              disabled={!importData.trim()}
              className="w-full text-xs px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              📥 Import Progress
            </button>
          </div>

          {/* Message */}
          {message && (
            <div className={`text-xs p-2 rounded ${
              message.includes('✅') ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
              'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
              {message}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CrossDeviceSync;
