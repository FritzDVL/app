"use server";

import { supabaseClient } from "@/lib/external/supabase/client";
import slugify from "slugify";

/**
 * Generates a URL-safe slug for a thread title.
 * Uses strict mode and lowercases the result.
 */
function generateBaseSlug(title: string): string {
  return slugify(title, { lower: true, strict: true });
}

/**
 * Checks if a slug already exists in the database
 */
async function slugExists(slug: string): Promise<boolean> {
  const supabase = await supabaseClient();
  const { data, error } = await supabase.from("community_threads").select("slug").eq("slug", slug).single();

  return !error && !!data;
}

/**
 * Generates a unique slug for a thread title.
 * If the slug already exists, appends a counter suffix.
 * @param title - The thread title
 * @returns A unique slug
 */
export async function generateThreadSlug(title: string): Promise<string> {
  const baseSlug = generateBaseSlug(title);

  // Check if base slug is available
  if (!(await slugExists(baseSlug))) {
    return baseSlug;
  }

  // If exists, try with counter suffix
  let counter = 2;
  let uniqueSlug = `${baseSlug}-${counter}`;

  while (await slugExists(uniqueSlug)) {
    counter++;
    uniqueSlug = `${baseSlug}-${counter}`;

    // Safety check to prevent infinite loops
    if (counter > 1000) {
      throw new Error("Unable to generate unique slug after 1000 attempts");
    }
  }

  return uniqueSlug;
}
