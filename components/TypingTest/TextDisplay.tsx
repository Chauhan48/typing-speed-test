'use client';

import React from 'react';

interface TextDisplayProps {
  lines: string[][];
  currentLineIndex: number;
  currentWordIndexInLine: number;
  typedChars: string;
  wrongChars: string[];
}

const TextDisplay = ({
  lines,
  currentLineIndex,
  currentWordIndexInLine,
  typedChars,
  wrongChars,
}: TextDisplayProps) => {
  const currentLine = lines[currentLineIndex] || [];
  if (!currentLine.length) return null;

  return (
    <div className="text-lg leading-8">
      {currentLine.map((word, i) => {
        const isCurrent = i === currentWordIndexInLine;

        let wordNode;

        if (isCurrent) {
          const correctPart = typedChars;
          const rest = word.slice(correctPart.length);

          wordNode = (
            <span
              key={i}
              className="inline-block whitespace-nowrap px-1 border-2 border-green-500 bg-green-50 text-green-900 font-bold"
            >
              {correctPart}
              {rest && (
                <span className="text-gray-600 font-normal">{rest}</span>
              )}
            </span>
          );
        } else if (i < currentWordIndexInLine) {
          wordNode = (
            <span key={i} className="inline-block whitespace-nowrap text-gray-400 mr-1">
              {word}
            </span>
          );
        } else {
          wordNode = (
            <span key={i} className="inline-block whitespace-nowrap text-gray-600 mr-1">
              {word}
            </span>
          );
        }

        return (
          <React.Fragment key={i}>
            {wordNode}
            {i < currentLine.length - 1 && ' '}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default TextDisplay;