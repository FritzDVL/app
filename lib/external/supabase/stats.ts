"use server";

import { supabaseClient } from "./client";
import { ForumStats } from "@/types/common";

/**
 * Fetches forum-wide stats: total members, total threads, and total communities.
 * @returns ForumStats object
 */
export async function fetchForumStats(): Promise<ForumStats> {
  const supabase = await supabaseClient();

  // Get total visible communities
  const { count: communities, error: communitiesError } = await supabase
    .from("communities")
    .select("id", { count: "exact", head: true })
    .eq("visible", true);
  if (communitiesError) throw new Error(`Failed to fetch communities stats: ${communitiesError.message}`);

  // Get total members (sum) from visible communities only
  const { data: membersAgg, error: membersError } = await supabase
    .from("communities")
    .select("members_count")
    .eq("visible", true)
    .limit(1000);
  if (membersError) throw new Error(`Failed to fetch members sum: ${membersError.message}`);
  const members = Array.isArray(membersAgg) ? membersAgg.reduce((sum, row) => sum + (row.members_count || 0), 0) : 0;

  // Get total visible threads
  const { count: threads, error: threadsError } = await supabase
    .from("community_threads")
    .select("id", { count: "exact", head: true })
    .eq("visible", true);
  if (threadsError) throw new Error(`Failed to fetch total threads: ${threadsError.message}`);

  return { members, threads: threads ?? 0, communities: communities ?? 0 };
}
