# Typing Speed Test

### Folder structure

```
    typing-speed-test/
    │
    ├── app/
    │   ├── page.tsx                 // Home page
    │   ├── layout.tsx
    │   └── globals.css
    │
    ├── components/
    │   ├── TestConfig/
    │   │   ├── TimeSelector.tsx
    │   │   ├── ModeSelector.tsx
    │   │   ├── StartButton.tsx
    │   │
    │   ├── TypingTest/
    │   │   ├── TypingBox.tsx
    │   │   ├── TextDisplay.tsx
    │   │   ├── Timer.tsx
    │   │   ├── Caret.tsx
    │   │
    │   ├── Results/
    │   │   ├── ResultCard.tsx
    │   │   ├── StatsItem.tsx
    │   │
    │   └── common/
    │       ├── Button.tsx
    │       └── Card.tsx
    │
    ├── hooks/
    │   ├── useTypingEngine.ts
    │   ├── useTimer.ts
    │
    ├── utils/
    │   ├── calculateWPM.ts
    │   ├── calculateAccuracy.ts
    │   ├── generateText.ts
    │
    ├── types/
    │   └── typing.ts
    │
    └── constants/
        └── characters.ts
```