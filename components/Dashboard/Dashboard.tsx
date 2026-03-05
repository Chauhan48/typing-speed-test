'use client';

import { useRouter } from 'next/navigation';
import ModeSelector from '../TestConfig/ModeSelector';
import StartButton from '../TestConfig/StartButton';
import TimeSelector from '../TestConfig/TimeSelector';
import { useTestStore, TestMode, TestDuration } from '@/stores/testStore';

const Dashboard = () => {
  const router = useRouter();
  const { testConfig, testResult, setTestConfig, clearTestState } = useTestStore();

  const handleStartTest = () => {
    if (!testConfig) return;
    
    // Clear previous results and start new test
    clearTestState();
    setTestConfig(testConfig);
    
    // Navigate to practice page
    router.push('/practice');
  };

  const handleConfigChange = (field: 'duration' | 'mode', value: TestDuration | TestMode) => {
    const newConfig = {
      duration: field === 'duration' ? (value as TestDuration) : testConfig?.duration || 30,
      mode: field === 'mode' ? (value as TestMode) : testConfig?.mode || 'Letters Only',
    };
    setTestConfig(newConfig);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">KeyVelocity</h1>
        <p className="text-lg text-gray-600">Master your keyboard. Test and improve your typing speed.</p>
      </div>

      {/* Test Configuration */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Configure Your Test</h2>
        <div className="space-y-4">
          <TimeSelector 
            selectedTime={testConfig?.duration || 30}
            onTimeChange={(time) => handleConfigChange('duration', time as TestDuration)}
          />
          <ModeSelector 
            selectedMode={testConfig?.mode || 'Letters Only'}
            onModeChange={(mode) => handleConfigChange('mode', mode as TestMode)}
          />
          <StartButton 
            onStart={handleStartTest}
            disabled={!testConfig}
          />
        </div>
      </div>

      {/* Results Display */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Progress</h2>
        
        {testResult ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-3xl font-bold text-blue-600">{testResult.wpm}</div>
              <div className="text-sm text-gray-600">WPM</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-3xl font-bold text-green-600">{testResult.accuracy}%</div>
              <div className="text-sm text-gray-600">Accuracy</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-3xl font-bold text-purple-600">{testResult.totalCharacters}</div>
              <div className="text-sm text-gray-600">Total Chars</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <div className="text-3xl font-bold text-orange-600">{testResult.correctCharacters}</div>
              <div className="text-sm text-gray-600">Correct Chars</div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400 text-lg">Take a test to see your progress.</div>
            <div className="text-gray-400 text-sm mt-2">Configure your test above and click &quot;Start Test&quot; to begin.</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;