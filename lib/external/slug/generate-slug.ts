import slugify from "slugify";

export function generateThreadSlug(title: string): string {
  return slugify(title, { lower: true, strict: true });
}
