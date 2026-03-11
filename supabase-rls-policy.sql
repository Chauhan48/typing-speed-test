-- Row Level Security (RLS) Policy for typing_results table
-- Run this in Supabase SQL Editor: Authentication > Policies

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own typing results" ON public.typing_results;
DROP POLICY IF EXISTS "Users can insert own typing results" ON public.typing_results;
DROP POLICY IF EXISTS "Users can update own typing results" ON public.typing_results;
DROP POLICY IF EXISTS "Users can delete own typing results" ON public.typing_results;

-- Policy: Users can only view their own typing results
CREATE POLICY "Users can view own typing results" ON public.typing_results
  FOR SELECT
  USING (auth.uid() = user_id::uuid);

-- Policy: Users can only insert their own typing results
CREATE POLICY "Users can insert own typing results" ON public.typing_results
  FOR INSERT
  WITH CHECK (auth.uid() = user_id::uuid);

-- Policy: Users can only update their own typing results
CREATE POLICY "Users can update own typing results" ON public.typing_results
  FOR UPDATE
  USING (auth.uid() = user_id::uuid)
  WITH CHECK (auth.uid() = user_id::uuid);

-- Policy: Users can only delete their own typing results
CREATE POLICY "Users can delete own typing results" ON public.typing_results
  FOR DELETE
  USING (auth.uid() = user_id::uuid);

-- Enable RLS on the table
ALTER TABLE public.typing_results ENABLE ROW LEVEL SECURITY;
