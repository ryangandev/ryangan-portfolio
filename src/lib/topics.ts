import { slugify } from '@/lib/slug';

/**
 * A topic's URL segment: "React Hook Form" becomes `react-hook-form`. Topics
 * that differ only in case or separators ("React Hook Form", "react-hook-form")
 * share a slug, so they share a page.
 */
export const toTopicSlug = (topic: string): string => slugify(topic);
