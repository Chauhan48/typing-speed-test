import { createClient } from "@supabase/supabase-js";

// Validate environment variables at build time
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are not set. Please check your environment configuration.');
}

const url = supabaseUrl as string;
const key = supabaseAnonKey as string;

export const supabase = url && key 
  ? createClient(url, key)
  : null;