/**
 * Example usage of typing results storage functions
 * This demonstrates how to use the storeTypingResult function in your components
 */

import { storeTypingResult, getUserTypingResults, TypingResult } from './typingResults';

// Example 1: Storing a typing test result
export async function saveTypingTestResult() {
  const result: TypingResult = {
    wpm: 65.5,
    accuracy: 92.3,
    characters: 150,
    errors: 12,
    testDuration: 60,
  };

  const { success, error } = await storeTypingResult(result);
  
  if (success) {
    console.log('Result saved successfully!');
  } else {
    console.error('Failed to save result:', error);
  }
}

// Example 2: Fetching user's typing history
export async function displayUserHistory() {
  const { success, data, error } = await getUserTypingResults();
  
  if (success && data) {
    console.log('User typing history:', data);
    // Display results in your UI
    data.forEach((result, index) => {
      console.log(`Test ${index + 1}: ${result.wpm} WPM, ${result.accuracy}% accuracy`);
    });
  } else {
    console.error('Failed to fetch history:', error);
  }
}

// Example 3: Using in a React component
/*
import { useCallback } from 'react';
import { storeTypingResult } from '@/lib/typingResults';

const MyComponent = () => {
  const handleTestComplete = useCallback(async (result: TypingResult) => {
    const { success } = await storeTypingResult(result);
    
    if (success) {
      // Show success message
      // Update UI
    } else {
      // Show error message
    }
  }, []);

  return (
    <div>
      // Your component JSX
    </div>
  );
};
*/
