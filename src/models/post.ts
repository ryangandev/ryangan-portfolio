import type { PostFrontmatter } from '@/schemas/content-schema';

export type PostMetadata = PostFrontmatter & {
  slug: string;
};

export type PostData = PostMetadata & {
  content: string;
  /** Estimated minutes to read, derived from `content` */
  readingTime: number;
};
