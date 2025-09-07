"use server";

import { supabaseClient } from "./client";
import { Address } from "@/types/common";
import { CommunitySupabase } from "@/types/supabase";

export async function persistCommunity(group: Address, feed: Address, name: string): Promise<CommunitySupabase> {
  const supabase = await supabaseClient();

  // Check if community already exists
  const { data: existingCommunity, error: fetchError } = await supabase
    .from("communities")
    .select("*")
    .eq("lens_group_address", group)
    .single();

  if (fetchError && fetchError.code !== "PGRST116") {
    throw new Error(`Failed to check community existence: ${fetchError.message}`);
  }

  if (existingCommunity) {
    console.log(`Community already exists in database: ${group}`);
    return existingCommunity;
  }

  // Create new community record
  const { data: newCommunity, error: insertError } = await supabase
    .from("communities")
    .insert({
      lens_group_address: group,
      name,
      feed: feed,
    })
    .select()
    .single();

  if (insertError) {
    throw new Error(`Failed to create community: ${insertError.message}`);
  }

  console.log(`Community persisted to database: ${group}`);
  return newCommunity;
}

/**
 * Fetches all communities from the database
 * @returns Array of community records with their Lens group addresses
 */
export async function fetchAllCommunities(): Promise<CommunitySupabase[]> {
  const supabase = await supabaseClient();

  const { data: communities, error } = await supabase
    .from("communities")
    .select("*, threads_count:community_threads(count)")
    .eq("visible", true)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch communities: ${error.message}`);
  }

  // threads_count will be an array with a single object { count: number }
  return (communities || []).map(c => ({
    ...c,
    threads_count: c.threads_count?.[0]?.count ?? 0,
  }));
}

/**
 * Fetch a single community by its Lens group address
 * @param lensGroupAddress - The Lens Protocol group address
 * @returns The community record or null if not found
 */
export async function fetchCommunity(lensGroupAddress: string): Promise<CommunitySupabase | null> {
  const supabase = await supabaseClient();

  const { data: community, error } = await supabase
    .from("communities")
    .select("*, threads_count:community_threads(count)")
    .eq("lens_group_address", lensGroupAddress)
    .eq("visible", true)
    .eq("community_threads.visible", true)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // Not found
      return null;
    }
    throw new Error(`Failed to fetch community: ${error.message}`);
  }

  // threads_count will be an array with a single object { count: number }
  if (community) {
    return { ...community, threads_count: community.threads_count?.[0]?.count ?? 0 };
  }

  return community;
}

/**
 * Fetches featured communities from the database
 * @returns Array of featured community records
 */
export async function fetchFeaturedCommunities(): Promise<CommunitySupabase[]> {
  const supabase = await supabaseClient();

  const { data: communities, error } = await supabase
    .from("communities")
    .select("*")
    .eq("featured", 1)
    .eq("visible", true)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch featured communities: ${error.message}`);
  }

  return communities || [];
}

/**
 * Increments the members_count for a community by its id using the increment_community_members_count function
 * @param communityId - The community's id (uuid)
 * @returns void
 */
export async function incrementCommunityMembersCount(communityId: string): Promise<void> {
  const supabase = await supabaseClient();

  const { error } = await supabase.rpc("increment_community_members_count", { comm_id: communityId });
  if (error) {
    throw new Error(`Failed to increment members_count: ${error.message}`);
  }
}

/**
 * Decrements the members_count for a community by its id using the decrement_community_members_count function
 * @param communityId - The community's id (uuid)
 * @returns void
 */
export async function decrementCommunityMembersCount(communityId: string): Promise<void> {
  const supabase = await supabaseClient();

  const { error } = await supabase.rpc("decrement_community_members_count", { comm_id: communityId });
  if (error) {
    throw new Error(`Failed to decrement members_count: ${error.message}`);
  }
}

export async function updateCommunity(groupAddress: Address, name: string): Promise<CommunitySupabase | null> {
  const supabase = await supabaseClient();
  const { data, error } = await supabase
    .from("communities")
    .update({ name, updated_at: new Date().toISOString() })
    .eq("lens_group_address", groupAddress)
    .select()
    .single();
  if (error) {
    throw new Error(`Failed to update community: ${error.message}`);
  }
  return data || null;
}
