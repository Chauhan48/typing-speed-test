'use client';

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import Keyboard from './Keyboard/Keyboard';
import TextDisplay from './TextDisplay';

interface TestResults {
  wpm: number;
  accuracy: number;
  totalCharacters: number;
  correctCharacters: number;
  testDuration: number;
}

const TypingBox = () => {
  const fullText =
    "Lorem ipsum dolor sit amet consectetur adipisicing elit Illo explicabo dolorem quisquam iure dolor voluptas aperiam porro nostrum similique distinctio eum pariatur veniam quidem provident minima Facere blanditiis nobis ex modi sequi sint ab";

  const words = fullText.split(/\s+/).filter(Boolean);

  const lines: string[][] = useMemo(() => {
    const linesArray: string[][] = [];
    for (let i = 0; i < words.length; i += 10) {
      linesArray.push(words.slice(i, i + 10));
    }
    return linesArray;
  }, [words]);

  // Test state
  const [isTestActive, setIsTestActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedTime, setSelectedTime] = useState(30);

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
  const calculateResults = useCallback(() => {
    const testDurationInMinutes = selectedTime / 60;
    const wpm = totalCharactersTyped > 0 
      ? (correctCharactersTyped / 5) / testDurationInMinutes 
      : 0;
    
    const accuracy = totalCharactersTyped > 0
      ? (correctCharactersTyped / totalCharactersTyped) * 100
      : 0;

    return {
      wpm: Math.round(wpm * 10) / 10, // Round to 1 decimal place
      accuracy: Math.round(accuracy * 10) / 10, // Round to 1 decimal place
      totalCharacters: totalCharactersTyped,
      correctCharacters: correctCharactersTyped,
      testDuration: selectedTime
    };
  }, [totalCharactersTyped, correctCharactersTyped, selectedTime]);

  // End test and calculate results
  const endTest = useCallback(() => {
    setIsTestActive(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    const results = calculateResults();
    setTestResults(results);
  }, [calculateResults]);

  // Start test
  const startTest = useCallback(() => {
    setIsTestActive(true);
    setTimeLeft(selectedTime);
    setTestResults(null);
    setCurrentLineIndex(0);
    setCurrentWordIndexInLine(0);
    setTypedChars('');
    setWrongChars([]);
    setTotalCharactersTyped(0);
    setCorrectCharactersTyped(0);
  }, [selectedTime]);

  // Timer effect
  useEffect(() => {
    if (isTestActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            endTest();
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
  }, [isTestActive, timeLeft, endTest]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Don't allow typing if test is not active or results are shown
      if (!isTestActive || testResults) return;

      const key = e.key;

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
        const currentTypedChars = typedCharsRef.current;
        
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
      const proposed = typedCharsRef.current + lowerKey;

      // Track total characters typed (excluding control keys)
      setTotalCharactersTyped((prev) => prev + 1);

      if (targetWord.toLowerCase().startsWith(proposed)) {
        setTypedChars(proposed);
        setWrongChars([]);
        // Track correct characters
        setCorrectCharactersTyped((prev) => prev + 1);
      } else {
        setWrongChars([lowerKey]);
      }
    },
    [targetWord, currentLine, currentLineIndex, lines.length, isTestActive, testResults]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Timer and Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {!isTestActive && !testResults && (
            <div className="flex items-center space-x-2">
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(Number(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={15}>15s</option>
                <option value={30}>30s</option>
                <option value={60}>60s</option>
              </select>
              <button
                onClick={startTest}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Start Test
              </button>
            </div>
          )}
          
          {isTestActive && (
            <div className="text-4xl font-mono font-bold text-white bg-red-500 px-8 py-4 rounded-2xl shadow-2xl">
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>
          )}
        </div>

        {testResults && (
          <button
            onClick={startTest}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Try Again
          </button>
        )}
      </div>

      {/* Results Display */}
      {testResults && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Test Results</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-3xl font-bold text-blue-600">{testResults.wpm}</div>
              <div className="text-sm text-gray-600">WPM</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-3xl font-bold text-green-600">{testResults.accuracy}%</div>
              <div className="text-sm text-gray-600">Accuracy</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-3xl font-bold text-purple-600">{testResults.totalCharacters}</div>
              <div className="text-sm text-gray-600">Total Chars</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <div className="text-3xl font-bold text-orange-600">{testResults.correctCharacters}</div>
              <div className="text-sm text-gray-600">Correct Chars</div>
            </div>
          </div>
        </div>
      )}

      {/* Typing Area */}
      {(isTestActive || (!isTestActive && !testResults)) && (
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