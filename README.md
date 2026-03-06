# KeyVelocity

**KeyVelocity** is a modern typing speed test application built with **Next.js, TypeScript, Tailwind CSS, and Zustand**.
It allows users to practice typing, measure their **WPM (Words Per Minute)**, **accuracy**, and track their most recent performance.

The application provides a clean UI, customizable typing tests, and a responsive virtual keyboard to enhance the typing experience.

---

# Features

* **Typing Speed Test**

  * Measure WPM and accuracy
  * Real-time typing feedback

* **Custom Test Configuration**

  * Select test duration
  * Choose typing mode

* **Performance Metrics**

  * Words Per Minute (WPM)
  * Accuracy %
  * Total characters typed
  * Correct characters

* **Timer System**

  * Countdown timer for tests
  * Automatic test completion

* **Virtual Keyboard**

  * Visual keyboard highlighting typed keys
  * Helps improve typing accuracy

* **Dark / Light Mode**

  * Theme switching with smooth UI transitions

* **Recent Test Result**

  * Displays the most recent test statistics

---

# Tech Stack

* **Framework:** Next.js (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **State Management:** Zustand
* **Theme Management:** next-themes
* **Linting:** ESLint

---

# Project Structure

```
├── app
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Landing page
│   └── practice
│       └── page.tsx      # Typing test page
│
├── components
│   ├── Dashboard         # Test configuration + results
│   ├── Navbar            # Navigation bar
│   ├── providers         # Theme provider
│   ├── TestConfig        # Test setup components
│   ├── TypingTest        # Core typing functionality
│   │   ├── Keyboard      # Virtual keyboard
│   │   ├── TextDisplay   # Generated text display
│   │   ├── Timer         # Countdown timer
│   │   └── TypingBox     # User input area
│   └── ui                # Reusable UI components
│
├── stores                # Zustand state stores
│   ├── modeStore.ts
│   ├── testStore.ts
│   ├── themeStore.ts
│   └── timeStore.ts
│
├── utils
│   └── textGenerator.ts  # Generates random typing text
```

---

# Installation

### Clone the repository

```bash
git clone https://github.com/<repo-name>
```

---

### Navigate to the project

```bash
cd <folder-name>
```

---

### Install dependencies

Using **pnpm**

```bash
pnpm install
```

---

### Run the development server

```bash
pnpm dev
```

---

### Open in browser

```
http://localhost:3000
```

---

# How to Use

1. Configure your typing test

   * Select **test duration**
   * Select **typing mode**

2. Click **Start Test**

3. Begin typing the displayed text.

4. When the timer finishes, your **results will appear on the dashboard**.

---

# Metrics Calculation

* **WPM (Words Per Minute)**
  Calculated using the standard formula:

```
WPM = (Total Characters Typed / 5) / Time in Minutes
```

* **Accuracy**

```
Accuracy = (Correct Characters / Total Characters Typed) × 100
```

---

# Theme Support

The application supports **dark and light themes** using a CSS variable-based design system.

Users can toggle themes via the navigation bar.

---