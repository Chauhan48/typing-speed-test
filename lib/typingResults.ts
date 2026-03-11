import { supabase } from './supabaseClient';

export interface TypingResult {
  wpm: number;
  accuracy: number;
  characters: number;
  errors: number;
  testDuration: number;
}

export interface SupabaseTypingResult {
  user_id: string;
  wpm: number;
  accuracy: number;
  characters: number;
  errors: number;
  test_duration: number; // Matches database column name
}

/**
 * Stores typing test result in Supabase for authenticated users
 * @param result - The typing test result to store
 * @returns Promise<{ success: boolean; error?: string; data?: any }>
 */
export async function storeTypingResult(result: TypingResult): Promise<{ success: boolean; error?: string; data?: unknown }> {
  try {
    // Check if Supabase is available and user is authenticated
    if (!supabase) {
      return { success: false, error: 'Supabase not available' };
    }

    // Get current authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('Auth error:', authError);
      return { success: false, error: `Authentication error: ${authError.message}` };
    }

    if (!user) {
      return { success: false, error: 'No authenticated user found' };
    }

    // Prepare data for Supabase insertion
    const supabaseResult: SupabaseTypingResult = {
      user_id: user.id,
      wpm: Math.round(result.wpm), // Round to nearest integer
      accuracy: Math.round(result.accuracy), // Round to nearest integer
      characters: result.characters,
      errors: result.errors,
      test_duration: result.testDuration, // Map camelCase to snake_case
    };

    console.log('Attempting to insert typing result:', supabaseResult);

    // Insert into typing_results table with explicit error handling
    const { data, error: insertError } = await supabase
      .from('typing_results')
      .insert([supabaseResult])
      .select()
      .single(); // Use .single() for better error handling

    if (insertError) {
      console.error('Supabase insert error details:', {
        message: insertError.message,
        details: insertError.details,
        hint: insertError.hint,
        code: insertError.code
      });
      
      // Provide more specific error messages based on error code
      let errorMessage = 'Failed to save typing result';
      if (insertError.code === 'PGRST116') {
        errorMessage = 'Table does not exist. Please create the typing_results table in Supabase.';
      } else if (insertError.code === 'PGRST301') {
        errorMessage = 'Permission denied. Check RLS policies.';
      } else if (insertError.code === '42501') {
        errorMessage = 'Connection to database failed. Check your Supabase configuration.';
      }
      
      return { success: false, error: errorMessage };
    }

    console.log('Typing result saved successfully:', data);
    return { success: true, data };

  } catch (error) {
    console.error('Unexpected error storing typing result:', error);
    return { success: false, error: 'Unexpected error occurred' };
  }
}

export interface TypingResultRow {
  id: string;
  user_id: string;
  wpm: number;
  accuracy: number;
  characters: number;
  errors: number;
  test_duration: number;
  created_at: string;
}

export interface TypingFilters {
  dateRange?: {
    from?: string;
    to?: string;
  };
  minWpm?: number;
  testDuration?: number;
}

export interface TypingResultsResponse {
  data: TypingResultRow[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Gets typing results for the current authenticated user with pagination and filters
 * @param page - Page number (default: 1)
 * @param pageSize - Results per page (default: 10)
 * @param filters - Optional filters
 * @returns Promise<{ success: boolean; data?: TypingResultsResponse; error?: string }>
 */
export async function getUserTypingResultsWithPagination(
  page: number = 1,
  pageSize: number = 10,
  filters?: TypingFilters
): Promise<{ success: boolean; data?: TypingResultsResponse; error?: string }> {
  try {
    if (!supabase) {
      return { success: false, error: 'Supabase not available' };
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { success: false, error: 'User not authenticated' };
    }

    // Build the query
    let query = supabase
      .from('typing_results')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    // Apply filters
    if (filters) {
      // Date range filter
      if (filters.dateRange?.from) {
        query = query.gte('created_at', filters.dateRange.from);
      }
      if (filters.dateRange?.to) {
        query = query.lte('created_at', filters.dateRange.to);
      }
      
      // Minimum WPM filter
      if (filters.minWpm) {
        query = query.gte('wpm', filters.minWpm);
      }
      
      // Test duration filter
      if (filters.testDuration) {
        query = query.eq('test_duration', filters.testDuration);
      }
    }

    // Apply pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching typing results:', error);
      return { success: false, error: 'Failed to fetch results' };
    }

    const totalPages = Math.ceil((count || 0) / pageSize);

    return { 
      success: true, 
      data: {
        data: data as TypingResultRow[] || [],
        count: count || 0,
        page,
        pageSize,
        totalPages
      }
    };

  } catch (error) {
    console.error('Unexpected error fetching typing results:', error);
    return { success: false, error: 'Unexpected error occurred' };
  }
}

/**
 * Gets all typing results for the current authenticated user
 * @returns Promise<{ success: boolean; data?: TypingResultRow[]; error?: string }>
 */
export async function getUserTypingResults(): Promise<{ success: boolean; data?: TypingResultRow[]; error?: string }> {
  try {
    if (!supabase) {
      return { success: false, error: 'Supabase not available' };
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { success: false, error: 'User not authenticated' };
    }

    const { data, error } = await supabase
      .from('typing_results')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching typing results:', error);
      return { success: false, error: 'Failed to fetch results' };
    }

    return { success: true, data: data as TypingResultRow[] || [] };

  } catch (error) {
    console.error('Unexpected error fetching typing results:', error);
    return { success: false, error: 'Unexpected error occurred' };
  }
}
