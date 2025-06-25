"use server";

import { Address } from "@/types/common";
import { CommunitySupabase, CommunityThreadSupabase, Database } from "@/types/supabase";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

/**
 * Database persistence functions
 */

/**
 * Persists a community thread to the database
 * @param communityLensAddress - The Lens Protocol group address
 * @param lensFeedAddress - The Lens Protocol feed address
 * @returns The created thread record
 */
export async function persistCommunityThread(
  communityLensAddress: string,
  lensFeedAddress: string,
  author: Address,
): Promise<CommunityThreadSupabase> {
  // First, ensure the community exists in our database
  let community: CommunitySupabase;

  const { data: existingCommunity, error: fetchError } = await supabase
    .from("communities")
    .select("*")
    .eq("lens_group_address", communityLensAddress)
    .single();

  if (fetchError && fetchError.code !== "PGRST116") {
    throw new Error(`Failed to fetch community: ${fetchError.message}`);
  }

  if (existingCommunity) {
    community = existingCommunity;
  } else {
    // Community doesn't exist, create it
    const { data: newCommunity, error: insertError } = await supabase
      .from("communities")
      .insert({
        lens_group_address: communityLensAddress,
      })
      .select()
      .single();

    if (insertError) {
      throw new Error(`Failed to create community: ${insertError.message}`);
    }

    community = newCommunity;
  }

  // Now create the thread record
  const { data: newThread, error } = await supabase
    .from("community_threads")
    .insert({
      community_id: community.id,
      lens_feed_address: lensFeedAddress,
      author,
    })
    .select("*, community:communities(*)")
    .single();

  if (error) {
    throw new Error(`Failed to create thread: ${error.message}`);
  }

  return newThread;
}

/**
 * Persists a new community to the database
 * @param lensGroupAddress - The Lens Protocol group address
 * @returns The created community record
 */
export async function persistCommunity(lensGroupAddress: string): Promise<CommunitySupabase> {
  // Check if community already exists
  const { data: existingCommunity, error: fetchError } = await supabase
    .from("communities")
    .select("*")
    .eq("lens_group_address", lensGroupAddress)
    .single();

  if (fetchError && fetchError.code !== "PGRST116") {
    throw new Error(`Failed to check community existence: ${fetchError.message}`);
  }

  if (existingCommunity) {
    console.log(`Community already exists in database: ${lensGroupAddress}`);
    return existingCommunity;
  }

  // Create new community record
  const { data: newCommunity, error: insertError } = await supabase
    .from("communities")
    .insert({
      lens_group_address: lensGroupAddress,
    })
    .select()
    .single();

  if (insertError) {
    throw new Error(`Failed to create community: ${insertError.message}`);
  }

  console.log(`Community persisted to database: ${lensGroupAddress}`);
  return newCommunity;
}

/**
 * Fetches all communities from the database
 * @returns Array of community records with their Lens group addresses
 */
export async function fetchAllCommunities(): Promise<CommunitySupabase[]> {
  const { data: communities, error } = await supabase
    .from("communities")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch communities: ${error.message}`);
  }

  return communities || [];
}

/**
 * Fetches all threads for a specific community from the database
 * @param communityLensAddress - The Lens Protocol group address
 * @returns Array of thread records with their Lens feed addresses
 */
export async function fetchCommunityThreads(communityLensAddress: string): Promise<CommunityThreadSupabase[]> {
  // First get the community
  const { data: community, error: communityError } = await supabase
    .from("communities")
    .select("*")
    .eq("lens_group_address", communityLensAddress)
    .single();

  if (communityError) {
    if (communityError.code === "PGRST116") {
      // Community not found, return empty array
      return [];
    }
    throw new Error(`Failed to fetch community: ${communityError.message}`);
  }

  // Then get all threads for this community, joining the community object
  const { data: threads, error: threadsError } = await supabase
    .from("community_threads")
    .select("*, community:communities(*)")
    .eq("community_id", community.id)
    .order("created_at", { ascending: false });

  if (threadsError) {
    throw new Error(`Failed to fetch threads: ${threadsError.message}`);
  }

  return threads || [];
}

/**
 * Fetch a single thread by its Lens feed address
 * @param lensFeedAddress - The Lens Protocol feed address
 * @returns The thread record or null if not found
 */
export async function fetchThread(lensFeedAddress: string): Promise<CommunityThreadSupabase | null> {
  const { data: thread, error } = await supabase
    .from("community_threads")
    .select("*, community:communities(*)")
    .eq("lens_feed_address", lensFeedAddress)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // Not found
      return null;
    }
    throw new Error(`Failed to fetch thread: ${error.message}`);
  }

  return thread;
}

/**
 * Fetch a single community by its Lens group address
 * @param lensGroupAddress - The Lens Protocol group address
 * @returns The community record or null if not found
 */
export async function fetchCommunity(lensGroupAddress: string): Promise<CommunitySupabase | null> {
  const { data: community, error } = await supabase
    .from("communities")
    .select("*")
    .eq("lens_group_address", lensGroupAddress)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // Not found
      return null;
    }
    throw new Error(`Failed to fetch community: ${error.message}`);
  }

  return community;
}

/**
 * Persists the root post address for a thread in the community_threads table
 * @param threadId - The thread's id (primary key)
 * @param rootPostId - The root post id to persist
 * @returns void
 */
export async function persistRootPostId(threadId: string, rootPostId: string): Promise<void> {
  const { error } = await supabase
    .from("community_threads")
    .update({ root_post_id: rootPostId })
    .eq("id", threadId)
    .single();

  if (error) {
    throw new Error(`Failed to update root_post_address: ${error.message}`);
  }
}

/**
 * Fetches the latest threads from the database
 * @param limit - Number of threads to fetch (default: 5)
 * @returns Array of thread records with their Lens feed addresses
 */
export async function fetchLatestThreads(limit: number = 5): Promise<CommunityThreadSupabase[]> {
  const { data: threads, error } = await supabase
    .from("community_threads")
    .select("*, community:communities(*)")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Failed to fetch latest threads: ${error.message}`);
  }

  return threads || [];
}

/**
 * Fetches the 3 oldest communities (for featured display)
 * @returns Array of up to 3 community records
 */
export async function fetchFeaturedCommunities(): Promise<CommunitySupabase[]> {
  const { data: communities, error } = await supabase
    .from("communities")
    .select("*")
    .order("created_at", { ascending: true })
    .limit(3);

  if (error) {
    throw new Error(`Failed to fetch featured communities: ${error.message}`);
  }

  return communities || [];
}
