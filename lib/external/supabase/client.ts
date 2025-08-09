/**
 * Supabase Client Configuration
 * External layer for database connection and client setup
 */
import { Database } from "@/types/supabase";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

/**
 * Supabase client instance with proper typing
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
