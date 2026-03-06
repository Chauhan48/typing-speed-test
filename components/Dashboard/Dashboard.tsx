'use client';

import { useRouter } from 'next/navigation';
import ModeSelector from '../TestConfig/ModeSelector';
import StartButton from '../TestConfig/StartButton';
import TimeSelector from '../TestConfig/TimeSelector';
import { useTestStore, parseCompletedAt, TestMode, TestDuration } from '@/stores/testStore';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';

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
      duration: field === 'duration' ? (value as TestDuration) : testConfig?.duration || 15,
      mode: field === 'mode' ? (value as TestMode) : testConfig?.mode || 'Letters Only',
    };
    setTestConfig(newConfig);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center pt-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">KeyVelocity</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">Master your keyboard. Test and improve your typing speed.</p>
        </div>

        {/* Test Configuration */}
        <Card variant="elevated">
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Configure Your Test</h2>
          </CardHeader>
          <CardContent className="space-y-6">
            <TimeSelector 
              selectedTime={testConfig?.duration || 15}
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
          </CardContent>
        </Card>

        {/* Results Display */}
        <Card variant="elevated">
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {testResult ? 'Most Recent Result' : 'Your Progress'}
            </h2>
          </CardHeader>
          <CardContent>
            {testResult ? (
              <div className="space-y-4">
                <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                  Completed on {parseCompletedAt(testResult.completedAt)?.toLocaleDateString()} at {parseCompletedAt(testResult.completedAt)?.toLocaleTimeString()}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{testResult.wpm}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">WPM</div>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400">{testResult.accuracy}%</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Accuracy</div>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                    <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{testResult.totalCharacters}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total Chars</div>
                  </div>
                  <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
                    <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{testResult.correctCharacters}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Correct Chars</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 dark:text-gray-500 text-lg">Take a test to see your progress.</div>
                <div className="text-gray-400 dark:text-gray-500 text-sm mt-2">Configure your test above and click &quot;Start Test&quot; to begin.</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;