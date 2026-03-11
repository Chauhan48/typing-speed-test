# Typing Results Storage System

## Overview

This system provides a robust way to store typing test results in Supabase for authenticated users while gracefully handling cases where Supabase is not available or users are not logged in.

## Features

### ✅ Authentication Required
- Only stores results for authenticated users
- Graceful fallback when user is not logged in
- Proper error handling and user feedback

### ✅ Type Safety
- Full TypeScript support
- Proper interface definitions
- No `any` types used

### ✅ Error Handling
- Comprehensive error catching
- User-friendly error messages
- Console logging for debugging

## API Reference

### `storeTypingResult(result: TypingResult)`

Stores a single typing test result in Supabase.

**Parameters:**
- `result`: Object containing typing test metrics
  - `wpm`: Words per minute (number)
  - `accuracy`: Accuracy percentage (number)
  - `characters`: Total characters typed (number)
  - `errors`: Number of errors made (number)
  - `testDuration`: Test duration in seconds (number)

**Returns:**
- `success`: Boolean indicating if storage was successful
- `error`: Error message if storage failed

### `getUserTypingResults()`

Retrieves all typing results for the current authenticated user.

**Returns:**
- `success`: Boolean indicating if fetch was successful
- `data`: Array of typing results with full database row data
- `error`: Error message if fetch failed

## Usage Examples

### In TypingBox Component

```typescript
import { storeTypingResult, TypingResult } from '@/lib/typingResults';
import { toast } from 'sonner';

const finishTest = useCallback(async () => {
  const results = calculateResults();
  
  // Store in Supabase for authenticated users
  const typingResult: TypingResult = {
    wpm: results.wpm,
    accuracy: results.accuracy,
    characters: results.totalCharacters,
    errors: results.totalCharacters - results.correctCharacters,
    testDuration: results.testDuration,
  };

  const { success, error } = await storeTypingResult(typingResult);
  
  if (success) {
    toast.success('Typing result saved to your profile!');
  } else {
    toast.error('Failed to save typing result');
  }
}, [calculateResults]);
```

### In Statistics Component

```typescript
import { getUserTypingResults } from '@/lib/typingResults';

const UserStats = async () => {
  const { success, data, error } = await getUserTypingResults();
  
  if (success && data) {
    // Display user's typing history
    return (
      <div>
        {data.map((result, index) => (
          <div key={result.id}>
            Test {index + 1}: {result.wpm} WPM, {result.accuracy}% accuracy
          </div>
        ))}
      </div>
    );
  }
  
  return <div>Loading...</div>;
};
```

## Database Schema

### `typing_results` Table

```sql
CREATE TABLE typing_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  wpm INTEGER NOT NULL,
  accuracy INTEGER NOT NULL,
  characters INTEGER NOT NULL,
  errors INTEGER NOT NULL,
  test_duration INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Error Handling

### Common Scenarios

1. **Supabase Not Available**
   - Returns `{ success: false, error: 'Supabase not available' }`
   - App continues to work normally

2. **User Not Authenticated**
   - Returns `{ success: false, error: 'User not authenticated' }`
   - Shows appropriate error message

3. **Database Errors**
   - Returns `{ success: false, error: 'Failed to save/fetch result' }`
   - Logs detailed error to console

## Best Practices

### ✅ Always Check Authentication
```typescript
if (!supabase) return { success: false, error: 'Supabase not available' };

const { data: { user } } = await supabase.auth.getUser();
if (!user) return { success: false, error: 'User not authenticated' };
```

### ✅ Proper Error Handling
```typescript
try {
  // Supabase operations
} catch (error) {
  console.error('Unexpected error:', error);
  return { success: false, error: 'Unexpected error occurred' };
}
```

### ✅ User Feedback
```typescript
if (success) {
  toast.success('Result saved successfully!');
} else {
  toast.error('Failed to save result');
}
```

## Integration Notes

- Works with existing Zustand store for local state
- Complements Supabase authentication system
- Graceful degradation when Supabase is unavailable
- Production-ready with comprehensive error handling
