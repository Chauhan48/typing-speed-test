import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Test configuration types
export type TestMode = 'Letters Only' | 'Letters + Numbers' | 'All Symbols';
export type TestDuration = 15 | 30 | 60;

export interface TestConfig {
  duration: TestDuration;
  mode: TestMode;
}

export interface TestResult {
  wpm: number;
  accuracy: number;
  totalCharacters: number;
  correctCharacters: number;
  testDuration: number;
  completedAt: string; // Store as ISO string
}

interface TestState {
  // Test configuration
  testConfig: TestConfig | null;
  setTestConfig: (config: TestConfig) => void;
  
  // Test results
  testResult: TestResult | null;
  setTestResult: (result: TestResult | null) => void;
  
  // Test state
  isTestActive: boolean;
  setIsTestActive: (active: boolean) => void;
  
  // Clear all state
  clearTestState: () => void;
}

export const useTestStore = create<TestState>()(
  persist(
    (set) => ({
      // Test configuration
      testConfig: null,
      setTestConfig: (config) => set({ testConfig: config }),
      
      // Test results
      testResult: null,
      setTestResult: (result) => set({ testResult: result }),
      
      // Test state
      isTestActive: false,
      setIsTestActive: (active) => set({ isTestActive: active }),
      
      // Clear all state
      clearTestState: () => set({
        testConfig: null,
        testResult: null,
        isTestActive: false,
      }),
    }),
    {
      name: 'test-storage', // persist to localStorage
      partialize: (state) => ({
        testConfig: state.testConfig,
        testResult: state.testResult,
      }), // only persist config and results, not active state
    }
  )
);

// Helper function to convert ISO string back to Date
export const parseCompletedAt = (isoString: string | null): Date | null => {
  if (!isoString) return null;
  return new Date(isoString);
};
