export interface Category {
  id: string;
  label: string;
  color: string;
  description?: string;
  hashtag: string;
}

export const CATEGORIES: Category[] = [
  { id: "general", label: "General", color: "bg-slate-500", hashtag: "general" },
  { id: "research", label: "Research", color: "bg-blue-500", hashtag: "research" },
  { id: "governance", label: "Governance", color: "bg-purple-500", hashtag: "governance" },
  { id: "tooling", label: "Tooling", color: "bg-green-500", hashtag: "tooling" },
  { id: "proposals", label: "Proposals", color: "bg-orange-500", hashtag: "proposal" },
];

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
