/**
 * Thread Database Operations
 * External layer for thread-related Supabase operations
 */
import { supabase } from "./client";
import { Address } from "@/types/common";
import { CommunitySupabase, CommunityThreadSupabase } from "@/types/supabase";

/**
 * Persists a community thread to the database
 * @param communityLensAddress - The Lens Protocol group address
 * @param lensFeedAddress - The Lens Protocol feed address
 * @param author - Thread author address
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
    // Community doesn't exist, throw error
    throw new Error(`Community with address ${communityLensAddress} does not exist`);
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
 * Fetches threads with featured=true from the database
 * @param limit - Number of threads to fetch (default: 5)
 * @returns Array of thread records
 */
export async function fetchFeaturedThreads(limit: number = 5): Promise<CommunityThreadSupabase[]> {
  const { data, error } = await supabase
    .from("community_threads")
    .select("*, community:communities(*)")
    .eq("featured", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Failed to fetch featured threads: ${error.message}`);
  }

  return data || [];
}

/**
 * Increments the replies_count for a community thread by its id using the increment_replies_count function
 * @param threadId - The thread's id (uuid)
 * @returns void
 */
export async function incrementThreadRepliesCount(threadId: string): Promise<void> {
  const { error } = await supabase.rpc("increment_replies_count", { thread_id: threadId });
  if (error) {
    throw new Error(`Failed to increment replies_count: ${error.message}`);
  }
}
