'use client';

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Keyboard from './Keyboard/Keyboard';
import TextDisplay from './TextDisplay';
import { useTestStore } from '@/stores/testStore';

interface TestResults {
  wpm: number;
  accuracy: number;
  totalCharacters: number;
  correctCharacters: number;
  testDuration: number;
}

const TypingBox = () => {
  const router = useRouter();
  const { testConfig, setTestResult, setIsTestActive } = useTestStore();

  const fullText = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad consequatur a numquam eveniet totam quisquam illum officiis culpa, nisi fuga eos magnam nulla debitis! Atque cupiditate ut ipsa cum explicabo vitae optio sit beatae aut enim dolore nobis nemo quas doloremque, quos assumenda ducimus sequi ea harum? Aut sapiente voluptas dicta, fuga aperiam vel eligendi rem eaque, facere esse nam. Tempore eveniet incidunt illum? Beatae error autem aliquam maiores, ut a qui optio fuga facilis et numquam commodi, possimus voluptates officia asperiores ab, magnam rem tempora eligendi esse in minus! Lorem ipsum dolor sit amet consectetur adipisicing elit Illo explicabo dolorem quisquam iure dolor voluptas aperiam porro nostrum similique distinctio eum pariatur veniam quidem provident minima Facere blanditiis nobis ex modi sequi sint ab";

  const words = fullText.split(/\s+/).filter(Boolean).map(word => word.replace(/[^\w\s]/g, ''));

  const lines: string[][] = useMemo(() => {
    const linesArray: string[][] = [];
    for (let i = 0; i < words.length; i += 10) {
      linesArray.push(words.slice(i, i + 10));
    }
    return linesArray;
  }, [words]);

  // Test state
  const [isTestActive, setIsTestActiveLocal] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(testConfig?.duration || 30);
  const [isFinished, setIsFinished] = useState(false);

  // Typing state
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentWordIndexInLine, setCurrentWordIndexInLine] = useState(0);
  const [typedChars, setTypedChars] = useState('');
  const [wrongChars, setWrongChars] = useState<string[]>([]);
  const [highlightedKey, setHighlightedKey] = useState<string | null>(null);

  // Metrics tracking
  const [totalCharactersTyped, setTotalCharactersTyped] = useState(0);
  const [correctCharactersTyped, setCorrectCharactersTyped] = useState(0);
  const [testResults, setTestResults] = useState<TestResults | null>(null);

  // Refs for synchronous access
  const typedCharsRef = useRef(typedChars);
  const totalCharsRef = useRef(totalCharactersTyped);
  const correctCharsRef = useRef(correctCharactersTyped);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Update refs when state changes
  useEffect(() => {
    typedCharsRef.current = typedChars;
  }, [typedChars]);

  useEffect(() => {
    totalCharsRef.current = totalCharactersTyped;
  }, [totalCharactersTyped]);

  useEffect(() => {
    correctCharsRef.current = correctCharactersTyped;
  }, [correctCharactersTyped]);

  const currentLine = useMemo(() => lines[currentLineIndex] || [], [currentLineIndex, lines]);
  const targetWord = currentLine[currentWordIndexInLine];

  // Calculate test results
  const calculateResults = useCallback((): TestResults => {
    const testDurationInMinutes = (testConfig?.duration || 30) / 60;
    const wpm = totalCharactersTyped > 0
      ? (correctCharactersTyped / 5) / testDurationInMinutes
      : 0;

    const accuracy = totalCharactersTyped > 0
      ? (correctCharactersTyped / totalCharactersTyped) * 100
      : 0;

    return {
      wpm: Math.round(wpm * 10) / 10,
      accuracy: Math.round(accuracy * 10) / 10,
      totalCharacters: totalCharactersTyped,
      correctCharacters: correctCharactersTyped,
      testDuration: testConfig?.duration || 30
    };
  }, [totalCharactersTyped, correctCharactersTyped, testConfig?.duration]);

  // Finish test - called when timer hits 0
  const finishTest = useCallback(() => {
    // Stop timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Calculate results
    const results = calculateResults();

    // Set local states
    setIsTestActiveLocal(false);
    setIsTestActive(false);
    setIsFinished(true);
    setTestResults(results);

    // Save to Zustand store
    setTestResult({
      wpm: results.wpm,
      accuracy: results.accuracy,
      totalCharacters: results.totalCharacters,
      correctCharacters: results.correctCharacters,
      testDuration: results.testDuration,
      completedAt: new Date().toISOString(),
    });
  }, [calculateResults, setIsTestActive, setTestResult]);

  // Start test
  const startTest = useCallback(() => {
    setIsTestActiveLocal(true);
    setIsTestActive(true);
    setIsFinished(false);
    setTimeLeft(testConfig?.duration || 30);
    setTestResults(null);
    setCurrentLineIndex(0);
    setCurrentWordIndexInLine(0);
    setTypedChars('');
    setWrongChars([]);
    setTotalCharactersTyped(0);
    setCorrectCharactersTyped(0);
  }, [testConfig?.duration, setIsTestActive]);

  // Timer effect - only calls finishTest when timer hits 0
  useEffect(() => {
    if (isTestActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Don't call setState here, just return 0 and let useEffect handle it
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isTestActive]);

  // Separate effect to handle timer reaching 0
  useEffect(() => {
    if (isTestActive && timeLeft === 0) {
      finishTest();
    }
  }, [isTestActive, timeLeft, finishTest]);

  // Handle keydown events
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Don't allow typing if test is not active or finished
      if (!isTestActive || isFinished) return;

      const key = e.key;
      const currentTypedChars = typedCharsRef.current;

      if (!targetWord) return;

      // Highlight pressed key
      setHighlightedKey(key.toLowerCase());
      setTimeout(() => setHighlightedKey(null), 150);

      // BACKSPACE
      if (key === 'Backspace') {
        setTypedChars((prev) => prev.slice(0, -1));
        setWrongChars([]);
        return;
      }

      // SPACE → move to next word
      if (key === ' ') {
        // Use ref to get the latest typedChars value
        if (currentTypedChars.toLowerCase() === targetWord.toLowerCase()) {
          // Word is correct, move to next word
          setCurrentWordIndexInLine((prevWordIndex) => {
            if (prevWordIndex + 1 < currentLine.length) {
              // Move to next word in current line
              return prevWordIndex + 1;
            } else if (currentLineIndex + 1 < lines.length) {
              // Move to next line, first word
              setCurrentLineIndex((prevLineIndex) => prevLineIndex + 1);
              return 0;
            }
            // End of text
            return prevWordIndex;
          });
        }

        // Always reset typedChars and wrongChars on space
        setTypedChars('');
        setWrongChars([]);
        return;
      }

      // Only letters & numbers
      if (!/^[a-z0-9]$/i.test(key)) return;

      const lowerKey = key.toLowerCase();
      const proposed = currentTypedChars + lowerKey;

      if (targetWord.toLowerCase().startsWith(proposed)) {
        setTypedChars(proposed);
        setWrongChars([]);

        setTotalCharactersTyped((prev) => prev + 1);
        setCorrectCharactersTyped((prev) => prev + 1);
      } else {
        setWrongChars([lowerKey]);
        setTotalCharactersTyped((prev) => prev + 1);
      }
    },
    [targetWord, currentLine, currentLineIndex, lines.length, isTestActive, isFinished]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Auto-start test when component mounts if we have config
  useEffect(() => {
    if (testConfig && !isTestActive && !isFinished) {
      const timer = setTimeout(() => {
        startTest();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [testConfig, isTestActive, isFinished, startTest]);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Timer Display */}
      {isTestActive && (
        <div className="text-center mb-6">
          <div className="text-4xl font-mono font-bold text-white bg-red-500 px-8 py-4 rounded-2xl shadow-2xl inline-block dark:bg-red-600">
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </div>
        </div>
      )}

      {/* Results Display */}
      {isFinished && testResults && (
        <div className="bg-card rounded-xl shadow-lg p-6 border border-border">
          <h2 className="text-2xl font-bold text-foreground mb-4">Test Results</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{testResults.wpm}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">WPM</div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">{testResults.accuracy}%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Accuracy</div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{testResults.totalCharacters}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Chars</div>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{testResults.correctCharacters}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Correct Chars</div>
            </div>
          </div>
          <div className="flex gap-4 justify-center">
            <button
              onClick={startTest}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              Try Again
            </button>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      )}

      {/* Typing Area */}
      {(isTestActive || (!isTestActive && !isFinished)) && (
        <>
          <TextDisplay
            lines={lines}
            currentLineIndex={currentLineIndex}
            currentWordIndexInLine={currentWordIndexInLine}
            typedChars={typedChars}
            wrongChars={wrongChars}
          />

          <Keyboard highlightedKey={highlightedKey} />
        </>
      )}
    </div>
  );
};

export default TypingBox;
