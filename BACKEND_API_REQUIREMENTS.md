# Enhanced Backend API Requirements

## Overview

The frontend has been updated to integrate with enhanced backend APIs that provide dynamic level configuration, real correct answers, and improved user progression tracking.

## Required API Endpoints

### 1. Level Configuration API

**Endpoint:** `GET /levels/config`

**Response Format:**

```json
{
  "levels": [
    {
      "id": 1,
      "name": "Foundation",
      "minXP": 0,
      "maxXP": 699,
      "color": "#8A8FA8",
      "description": "Starting your learning journey",
      "benefits": ["Access to basic questions", "Foundation knowledge"],
      "icon": "🌱"
    },
    {
      "id": 2,
      "name": "Elementary",
      "minXP": 700,
      "maxXP": 1499,
      "color": "#5DCAA5",
      "description": "Building fundamental skills",
      "benefits": ["Unlock science topics", "Daily challenges"],
      "icon": "📚"
    }
    // ... more levels
  ]
}
```

### 2. Enhanced Practice Questions API

**Endpoint:** `GET /practice/questions`

**Query Parameters:**

- `topic`: string (e.g., "general", "science", "math")
- `count`: number (default: 5)

**Response Format:**

```json
{
  "sessionId": "practice_session_123",
  "questions": [
    {
      "id": "q_001",
      "text": "What is the capital of France?",
      "options": ["London", "Berlin", "Paris", "Madrid"],
      "topic": "general",
      "difficulty": "easy",
      "correctIndex": 2
    }
    // ... more questions
  ]
}
```

**Key Changes:**

- Added `correctIndex` field (required) - index of correct answer in options array
- Added `sessionId` for tracking

### 3. Enhanced Daily Challenge API

**Endpoint:** `GET /daily-challenge/today`

**Response Format:**

```json
{
  "challengeId": "daily_2024_03_13",
  "date": "2024-03-13",
  "topic": "science",
  "difficulty": "medium",
  "description": "Science Challenge",
  "isCompleted": false,
  "reward": {
    "xp": 150,
    "badge": "daily_warrior"
  },
  "questions": [
    {
      "id": "dc_001",
      "text": "What is photosynthesis?",
      "options": ["Process A", "Process B", "Process C", "Process D"],
      "correctIndex": 2
    }
    // ... more questions
  ]
}
```

**Key Changes:**

- Added `correctIndex` field to each question (required)

### 4. Practice Session Submit API

**Endpoint:** `POST /practice/submit`

**Request Body:**

```json
{
  "sessionId": "practice_session_123",
  "answers": [
    {
      "questionId": "q_001",
      "selectedIndex": 2,
      "timeSpent": 8.5,
      "isCorrect": true
    }
  ],
  "totalTime": 45.2
}
```

**Response Format:**

```json
{
  "score": 850,
  "accuracy": 80,
  "correctAnswers": 4,
  "totalQuestions": 5,
  "xpEarned": 120,
  "feedback": "Great job! Keep practicing to improve."
}
```

### 5. Daily Challenge Submit API

**Endpoint:** `POST /daily-challenge/submit`

**Request Body:**

```json
{
  "challengeId": "daily_2024_03_13",
  "answers": [
    {
      "questionId": "dc_001",
      "selectedIndex": 2,
      "timeSpent": 12.3
    }
  ]
}
```

**Response Format:**

```json
{
  "score": 950,
  "rank": "A",
  "correctAnswers": 5,
  "totalQuestions": 5,
  "xpEarned": 150,
  "newStreakCount": 7,
  "isNewPersonalBest": true
}
```

## Frontend Integration Status

### ✅ Completed Features

1. **Dynamic Level System**: Frontend now fetches level configuration from `/levels/config` and uses it throughout the UI
2. **Real Correct Answers**: Both Practice and Daily Challenge screens now use `correctIndex` from backend instead of simulated answers
3. **Enhanced Question Interface**: Updated Question interface to include required `correctIndex` field
4. **Professional UI**: Removed all cartoon elements and implemented professional Learning Progression system
5. **Complete Session Reset**: Both practice and daily challenge sessions properly reset all state when starting new sessions
6. **Type Safety**: Fixed all TypeScript errors and warnings

### 🔧 Technical Implementation Details

1. **useLevels Hook**: Fetches dynamic levels with fallback to static levels if API fails
2. **Question Interfaces**: Updated to include `correctIndex: number` field
3. **Answer Validation**: Uses real correct answers from backend for immediate feedback
4. **Progress Calculation**: Dynamic level progression based on backend configuration
5. **Error Handling**: Graceful fallbacks when backend APIs are unavailable

### 🎯 Key Benefits

1. **Dynamic Configuration**: Level system can be updated without frontend changes
2. **Accurate Scoring**: Real correct answers ensure proper assessment
3. **Professional Appearance**: Corporate-ready UI without childish elements
4. **Robust State Management**: Proper session resets prevent state pollution
5. **Type Safety**: Full TypeScript compliance for maintainability

## Next Steps for Backend

1. Implement the enhanced API endpoints with the exact response formats shown above
2. Ensure `correctIndex` field is included in all question responses
3. Test the level configuration endpoint with the dynamic level data
4. Verify that session IDs are properly generated and tracked
5. Test the complete flow from question fetching to result submission

The frontend is now fully prepared to work with these enhanced backend APIs and will provide a much more professional and accurate learning experience.
