'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Keyboard from './Keyboard/Keyboard';
import TextDisplay from './TextDisplay';

const TypingBox = () => {
  const fullText =
    "Lorem ipsum dolor sit amet consectetur adipisicing elit Illo explicabo dolorem quisquam iure dolor voluptas aperiam porro nostrum similique distinctio eum pariatur veniam quidem provident minima Facere blanditiis nobis ex modi sequi sint ab";

  const words = fullText.split(/\s+/).filter(Boolean);

  const lines: string[][] = [];
  for (let i = 0; i < words.length; i += 10) {
    lines.push(words.slice(i, i + 10));
  }

  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentWordIndexInLine, setCurrentWordIndexInLine] = useState(0);
  const [typedChars, setTypedChars] = useState('');
  const [wrongChars, setWrongChars] = useState<string[]>([]);
  const [highlightedKey, setHighlightedKey] = useState<string | null>(null);

  // Ref to store the latest typedChars for synchronous access
  const typedCharsRef = useRef(typedChars);
  typedCharsRef.current = typedChars;

  const currentLine = lines[currentLineIndex] || [];
  const targetWord = currentLine[currentWordIndexInLine];

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
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

      if (targetWord.toLowerCase().startsWith(proposed)) {
        setTypedChars(proposed);
        setWrongChars([]);
      } else {
        setWrongChars([lowerKey]);
      }
    },
    [targetWord, currentLine, currentLineIndex, lines.length]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <TextDisplay
        lines={lines}
        currentLineIndex={currentLineIndex}
        currentWordIndexInLine={currentWordIndexInLine}
        typedChars={typedChars}
        wrongChars={wrongChars}
      />

      <Keyboard highlightedKey={highlightedKey} />
    </div>
  );
};

export default TypingBox;