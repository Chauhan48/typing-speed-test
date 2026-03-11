-- Create typing_results table
-- Run this in Supabase SQL Editor: Database > SQL Editor

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

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_typing_results_user_id ON public.typing_results(user_id);
CREATE INDEX IF NOT EXISTS idx_typing_results_created_at ON public.typing_results(created_at DESC);

-- Add comments for documentation
COMMENT ON TABLE public.typing_results IS 'Stores typing speed test results for authenticated users';
COMMENT ON COLUMN public.typing_results.id IS 'Unique identifier for each typing result';
COMMENT ON COLUMN public.typing_results.user_id IS 'Reference to the authenticated user';
COMMENT ON COLUMN public.typing_results.wpm IS 'Words per minute achieved';
COMMENT ON COLUMN public.typing_results.accuracy IS 'Typing accuracy percentage';
COMMENT ON COLUMN public.typing_results.characters IS 'Total characters typed';
COMMENT ON COLUMN public.typing_results.errors IS 'Number of typing errors made';
COMMENT ON COLUMN public.typing_results.test_duration IS 'Test duration in seconds';
COMMENT ON COLUMN public.typing_results.created_at IS 'Timestamp when the test was completed';
