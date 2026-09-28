import type { PostFrontmatter } from '@/schemas/content-schema';

export type PostMetadata = PostFrontmatter & {
  slug: string;
};

export type PostData = PostMetadata & {
  content: string;
  /** Estimated minutes to read, derived from `content` */
  readingTime: number;
};

export type Topic = {
  /** URL segment, from `toTopicSlug` */
  slug: string;
  /** As written in the frontmatter of the newest post using it */
  name: string;
  /** Newest first */
  posts: PostMetadata[];
};
