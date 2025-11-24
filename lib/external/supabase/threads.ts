"use server";

/**
 * Thread Database Operations
 * External layer for thread-related Supabase operations
 */
import { supabaseClient } from "@/lib/external/supabase/client";
import { Address } from "@/types/common";
import { CommunitySupabase, CommunityThreadSupabase } from "@/types/supabase";

/**
 * Persists a community thread to the database
 * @param communityLensAddress - The Lens Protocol group address
 * @param lensFeedAddress - The Lens Protocol feed address
 * @param author - Thread author address
 * @param title - Thread title
 * @param summary - Thread summary
 * @param rootPostId - The root post ID of the thread
 * @param slug - The generated slug for the thread
 * @returns The created thread record
 */
export async function persistCommunityThread(
  communityLensAddress: string,
  title: string,
  summary: string,
  author: Address,
  rootPostId: string,
  slug: string,
): Promise<CommunityThreadSupabase> {
  const supabase = await supabaseClient();

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
      lens_feed_address: "0x0",
      root_post_id: rootPostId,
      title,
      summary,
      author: author,
      slug,
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
export async function fetchCommunityThreads(
  communityId: string,
  limit?: number,
  offset?: number,
  search?: string,
): Promise<CommunityThreadSupabase[]> {
  const supabase = await supabaseClient();

  let query = supabase
    .from("community_threads")
    .select("*, community:communities(*)")
    .eq("community_id", communityId)
    .eq("visible", true)
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (search) {
    // Simple search on title or summary
    query = query.or(`title.ilike.%${search}%,summary.ilike.%${search}%`);
  }

  if (typeof limit === "number" && typeof offset === "number") {
    query = query.range(offset, offset + limit - 1);
  } else if (typeof limit === "number") {
    query = query.range(0, limit - 1);
  }

  const { data: threads, error: threadsError } = await query;

  if (threadsError) {
    throw new Error(`Failed to fetch threads: ${threadsError.message}`);
  }

  return threads || [];
}

/**
 * Fetch a single thread by its id or root_post_id
 * @param id - The thread's id
 * @param rootPostId - The thread's root_post_id
 * @returns The thread record or null if not found
 */
export async function fetchThread({
  id,
  rootPostId,
  slug,
}: {
  id?: string;
  rootPostId?: string;
  slug?: string;
}): Promise<CommunityThreadSupabase | null> {
  const supabase = await supabaseClient();

  let query = supabase.from("community_threads").select("*, community:communities(*)");

  if (id) {
    query = query.eq("id", id);
  }
  if (rootPostId) {
    query = query.eq("root_post_id", rootPostId);
  }
  if (slug) {
    query = query.eq("slug", slug);
  }

  const { data: thread, error } = await query.single();

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
 * Fetches the latest threads from the database
 * @param limit - Number of threads to fetch (default: 5)
 * @returns Array of thread records with their Lens feed addresses
 */
export async function fetchLatestThreads(limit: number = 5): Promise<CommunityThreadSupabase[]> {
  const supabase = await supabaseClient();

  const { data: threads, error } = await supabase
    .from("community_threads")
    .select("*, community:communities(*)")
    .eq("visible", true)
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
  const supabase = await supabaseClient();

  const { data, error } = await supabase
    .from("community_threads")
    .select("*, community:communities(*)")
    .eq("featured", true)
    .eq("visible", true)
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
  const supabase = await supabaseClient();

  const { error } = await supabase.rpc("increment_replies_count", { thread_id: threadId });
  if (error) {
    throw new Error(`Failed to increment replies_count: ${error.message}`);
  }
}

export async function updateThread(rootPostId: string, title: string, summary: string): Promise<void> {
  const supabase = await supabaseClient();

  const currentTime = new Date().toISOString();

  const { error } = await supabase
    .from("community_threads")
    .update({ updated_at: currentTime, title, summary })
    .eq("root_post_id", rootPostId)
    .single();
  if (error) {
    throw new Error(`Failed to update updated_at: ${error.message}`);
  }
}

/**
 * Pins or unpins a thread
 * @param threadId - The thread's id
 * @param isPinned - Whether the thread should be pinned
 */
export async function pinThread(threadId: string, isPinned: boolean): Promise<void> {
  const supabase = await supabaseClient();

  const { error } = await supabase.from("community_threads").update({ featured: isPinned }).eq("id", threadId);

  if (error) {
    throw new Error(`Failed to update thread pin status: ${error.message}`);
  }
}
/**
 * Sets the visibility of a thread
 * @param threadId - The thread's id
 * @param isVisible - Whether the thread should be visible
 */
export async function setThreadVisibility(threadId: string, isVisible: boolean): Promise<void> {
  const supabase = await supabaseClient();

  const { error } = await supabase.from("community_threads").update({ visible: isVisible }).eq("id", threadId);

  if (error) {
    throw new Error(`Failed to update thread visibility: ${error.message}`);
  }
}
