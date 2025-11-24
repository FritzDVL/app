export interface Category {
  id: string;
  label: string;
  color: string;
  description?: string;
  hashtag: string;
}

export const CATEGORIES = [
  { id: "general", label: "General", hashtag: "#general", color: "bg-slate-500", description: "General discussions" },
  {
    id: "announcements",
    label: "Announcements",
    hashtag: "#announcements",
    color: "bg-blue-500",
    description: "Official announcements",
  },
  {
    id: "development",
    label: "Development",
    hashtag: "#development",
    color: "bg-green-500",
    description: "Technical development",
  },
  {
    id: "governance",
    label: "Governance",
    hashtag: "#governance",
    color: "bg-purple-500",
    description: "Governance proposals",
  },
  { id: "support", label: "Support", hashtag: "#support", color: "bg-orange-500", description: "Help and support" },
  { id: "meta", label: "Meta", hashtag: "#meta", color: "bg-pink-500", description: "Forum meta discussions" },
  { id: "showcase", label: "Showcase", hashtag: "#showcase", color: "bg-yellow-500", description: "Show your work" },
  {
    id: "research",
    label: "Research",
    hashtag: "#research",
    color: "bg-indigo-500",
    description: "Research and analysis",
  },
] as const;

// Secondary tags for more granular categorization
export const TAGS = [
  { id: "question", label: "Question", hashtag: "#question", color: "bg-cyan-500" },
  { id: "discussion", label: "Discussion", hashtag: "#discussion", color: "bg-teal-500" },
  { id: "proposal", label: "Proposal", hashtag: "#proposal", color: "bg-violet-500" },
  { id: "tutorial", label: "Tutorial", hashtag: "#tutorial", color: "bg-emerald-500" },
  { id: "bug", label: "Bug", hashtag: "#bug", color: "bg-red-500" },
  { id: "feature", label: "Feature Request", hashtag: "#feature", color: "bg-blue-400" },
  { id: "feedback", label: "Feedback", hashtag: "#feedback", color: "bg-amber-500" },
] as const;

export function getCategoryByHashtag(hashtag: string): Category | undefined {
  return CATEGORIES.find(c => c.hashtag.toLowerCase() === hashtag.toLowerCase());
}

export function getCategoryFromTags(tags: string[]): Category {
  for (const tag of tags) {
    const category = getCategoryByHashtag(tag);
    if (category) return category;
  }
  return CATEGORIES[0]; // Default to General
}
