import { TestMode } from '@/stores/testStore';

// Text pools for different difficulty levels
const LETTERS_ONLY = 'Lorem ipsum dolor sit amet consectetur adipisicing elit Illo explicabo dolorem quisquam iure dolor voluptas aperiam porro nostrum similique distinctio eum pariatur veniam quidem provident minima Facere blanditiis nobis ex modi sequi sint ab';

const LETTERS_NUMBERS = 'Lorem ipsum dolor sit amet consectetur adipisicing elit Illo explicabo dolorem quisquam iure dolor voluptas aperiam porro nostrum similique distinctio eum pariatur veniam quidem provident minima Facere blanditiis nobis ex modi sequi sint ab 1234567890 2023 2024 2025 100 200 300 400 500';

const ALL_SYMBOLS = 'Lorem ipsum dolor sit amet consectetur adipisicing elit Illo explicabo dolorem quisquam iure dolor voluptas aperiam porro nostrum similique distinctio eum pariatur veniam quidem provident minima Facere blanditiis nobis ex modi sequi sint ab 1234567890 2023 2024 2025 100 200 300 400 500 !@#$%^&*()_+-=[]{}|;:,.<>?/~`';

export const generateTestText = (mode: TestMode): string => {
  switch (mode) {
    case 'Letters Only':
      return LETTERS_ONLY;
    case 'Letters + Numbers':
      return LETTERS_NUMBERS;
    case 'All Symbols':
      return ALL_SYMBOLS;
    default:
      return LETTERS_ONLY;
  }
};

export const splitTextIntoLines = (text: string, wordsPerLine: number = 10): string[][] => {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[][] = [];
  
  for (let i = 0; i < words.length; i += wordsPerLine) {
    lines.push(words.slice(i, i + wordsPerLine));
  }
  
  return lines;
};
