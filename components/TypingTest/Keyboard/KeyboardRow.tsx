'use client';

interface KeyboardRowProps {
  row: (number | string)[];
  highlightedKey: string | null;
}

export default function KeyboardRow({ row, highlightedKey }: KeyboardRowProps) {
  return (
    <div className="flex justify-center gap-x-1 mb-2">
      {row.map((key) => {
        const keyStr = key.toString().toLowerCase();
        const isHighlighted = highlightedKey === keyStr;

        return (
          <div
            key={keyStr}
            className={`
              w-10 h-10 rounded flex items-center justify-center text-sm
              border-2
              ${
                isHighlighted
                  ? 'bg-green-500 border-green-400 text-white'
                  : 'bg-gray-100 border-gray-400 text-gray-800'
              }
              transition-colors duration-150 shadow-sm
            `}
          >
            {key}
          </div>
        );
      })}
    </div>
  );
}