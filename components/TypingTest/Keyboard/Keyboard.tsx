'use client';

import { useState, useEffect } from 'react';
import KeyboardRow from './KeyboardRow';

export default function Keyboard() {
  const rows: (number[] | string[])[] = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
    ["z", "x", "c", "v", "b", "n", "m"],
  ];

  const [highlightedKey, setHighlightedKey] = useState<string | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      setHighlightedKey(key);

      if (timer !== null) {
        clearTimeout(timer);
      }

      timer = setTimeout(() => {
        setHighlightedKey(null);
      }, 1000);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (timer !== null) {
        clearTimeout(timer);
      }
    };
  }, []);

  return (
    <div className="mx-auto max-w-md">
      {rows.map((row, rowIndex) => (
        <KeyboardRow
          key={rowIndex}
          row={row}
          highlightedKey={highlightedKey}
        />
      ))}
    </div>
  );
}
