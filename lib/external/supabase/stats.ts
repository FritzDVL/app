"use server";

/**
 * Forum Statistics Operations
 * External layer for forum-wide statistics from Supabase
 */
import { supabaseClient } from "./client";
import type { ForumStats } from "@/types/common";

/**
 * Fetches forum-wide stats: total members, total threads, and total communities.
 * @returns ForumStats object
 */
export async function fetchForumStats(): Promise<ForumStats> {
  const supabase = await supabaseClient();

  // Get total communities
  const { count: communities, error: communitiesError } = await supabase
    .from("communities")
    .select("id", { count: "exact", head: true });
  if (communitiesError) throw new Error(`Failed to fetch communities stats: ${communitiesError.message}`);

  // Get total members (sum)
  const { data: membersAgg, error: membersError } = await supabase
    .from("communities")
    .select("members_count")
    .limit(1000);
  if (membersError) throw new Error(`Failed to fetch members sum: ${membersError.message}`);
  const members = Array.isArray(membersAgg) ? membersAgg.reduce((sum, row) => sum + (row.members_count || 0), 0) : 0;

  // Get total threads
  const { count: threads, error: threadsError } = await supabase
    .from("community_threads")
    .select("id", { count: "exact", head: true });
  if (threadsError) throw new Error(`Failed to fetch total threads: ${threadsError.message}`);

  return { members, threads: threads ?? 0, communities: communities ?? 0 };
}
