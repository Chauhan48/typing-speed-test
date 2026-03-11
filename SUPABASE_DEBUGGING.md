# Supabase Typing Results Debugging Guide

## 🔍 Error Analysis: `PGRST205 - Could not find table`

This error occurs when Supabase cannot find the `typing_results` table in its schema cache.

## 🛠️ Step-by-Step Solution

### Step 1: Create the Table

1. Go to your **Supabase Dashboard**
2. Navigate to **Database** → **SQL Editor**
3. Run the SQL from `supabase-typing-results.sql`:

```sql
CREATE TABLE IF NOT EXISTS public.typing_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  wpm INTEGER NOT NULL CHECK (wpm >= 0),
  accuracy INTEGER NOT NULL CHECK (accuracy >= 0 AND accuracy <= 100),
  characters INTEGER NOT NULL CHECK (characters >= 0),
  errors INTEGER NOT NULL CHECK (errors >= 0),
  test_duration INTEGER NOT NULL CHECK (test_duration > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_typing_results_user_id ON public.typing_results(user_id);
CREATE INDEX IF NOT EXISTS idx_typing_results_created_at ON public.typing_results(created_at DESC);
```

4. Click **Run** to execute the SQL

### Step 2: Set Up RLS Policies

1. In the same SQL Editor, run the RLS policies from `supabase-rls-policy.sql`:

```sql
-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own typing results" ON public.typing_results;
DROP POLICY IF EXISTS "Users can insert own typing results" ON public.typing_results;
DROP POLICY IF EXISTS "Users can update own typing results" ON public.typing_results;
DROP POLICY IF EXISTS "Users can delete own typing results" ON public.typing_results;

-- Create new policies
CREATE POLICY "Users can view own typing results" ON public.typing_results
  FOR SELECT USING (auth.uid() = user_id::uuid);

CREATE POLICY "Users can insert own typing results" ON public.typing_results
  FOR INSERT WITH CHECK (auth.uid() = user_id::uuid);

CREATE POLICY "Users can update own typing results" ON public.typing_results
  FOR UPDATE USING (auth.uid() = user_id::uuid)
  WITH CHECK (auth.uid() = user_id::uuid);

CREATE POLICY "Users can delete own typing results" ON public.typing_results
  FOR DELETE USING (auth.uid() = user_id::uuid);

-- Enable RLS
ALTER TABLE public.typing_results ENABLE ROW LEVEL SECURITY;
```

### Step 3: Refresh Schema Cache

If the table still doesn't work after creating it:

1. Go to **Settings** → **API**
2. Click **Reset project password** (this refreshes the schema cache)
3. Wait 2-3 minutes for the cache to refresh
4. Try your application again

### Step 4: Verify Table Creation

Check that the table was created:

1. **Table Editor** → Select `public.typing_results`
2. **Authentication** → **Policies** → Verify policies exist
3. **API** → Test with REST client or your application

## 🔧 Updated Code Features

The updated `storeTypingResult` function now includes:

### ✅ Better Error Handling
```typescript
// Specific error messages based on error codes
if (insertError.code === 'PGRST116') {
  errorMessage = 'Table does not exist. Please create the typing_results table in Supabase.';
} else if (insertError.code === 'PGRST301') {
  errorMessage = 'Permission denied. Check RLS policies.';
}
```

### ✅ Detailed Logging
```typescript
console.error('Supabase insert error details:', {
  message: insertError.message,
  details: insertError.details,
  hint: insertError.hint,
  code: insertError.code
});
```

### ✅ Type Safety
```typescript
export interface SupabaseTypingResult extends TypingResult {
  user_id: string;
  testDuration: number; // Matches database column name
}

export async function storeTypingResult(result: TypingResult): Promise<{
  success: boolean; 
  error?: string; 
  data?: SupabaseTypingResult // Strong typing
}>
```

### ✅ Better Query Pattern
```typescript
const { data, error } = await supabase
  .from('typing_results')
  .insert([supabaseResult])
  .select()
  .single(); // Better error handling for single insert
```

## 🧪 Testing the Fix

### Test 1: Verify Table Exists
```sql
-- In Supabase SQL Editor
SELECT table_name, table_schema 
FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'typing_results';
```

### Test 2: Check RLS Policies
```sql
-- In Supabase SQL Editor
SELECT policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'typing_results';
```

### Test 3: Manual Insert
```sql
-- In Supabase SQL Editor
INSERT INTO public.typing_results (user_id, wpm, accuracy, characters, errors, test_duration)
VALUES (
  auth.uid(), -- Will fail if not authenticated
  75.5, 95.2, 150, 12, 60
);
```

## 🚨 Common Pitfalls

1. **Schema Cache**: Supabase caches schema for 5-10 minutes
2. **RLS Not Enabled**: Table exists but no permissions
3. **Column Name Mismatch**: `test_duration` vs `testDuration`
4. **Missing Indexes**: Poor query performance
5. **Environment Variables**: Wrong Supabase URL/keys

## 📞 Support Resources

- **Supabase Dashboard**: https://app.supabase.com
- **API Documentation**: https://supabase.com/docs/reference/javascript
- **Error Codes**: https://postgrest.org/en/stable/api.html#errcodes

## ✅ Success Indicators

When everything works, you should see:

1. ✅ No `PGRST205` error
2. ✅ Toast message: "Typing result saved to your profile!"
3. ✅ Data appearing in Supabase table
4. ✅ Console log: "Typing result saved successfully"

Follow these steps in order and the error should be resolved!
