'use client';

import KeyboardRow from './KeyboardRow';

interface KeyboardProps {
  highlightedKey: string | null;
}

const rows: (number | string)[][] = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
];

export default function Keyboard({ highlightedKey }: KeyboardProps) {
  return (
    <div className="mx-auto max-w-md">
      {rows.map((row, index) => (
        <KeyboardRow
          key={index}
          row={row}
          highlightedKey={highlightedKey}
        />
      ))}
    </div>
  );
}