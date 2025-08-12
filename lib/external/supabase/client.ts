"use server";

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

// Create the client instance
const _supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey);

/**
 * Server action to get the Supabase client instance
 * This allows us to keep the client server-side while following Next.js "use server" rules
 */
export async function supabaseClient() {
  return _supabaseClient;
}
