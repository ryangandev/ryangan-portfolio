export type PostMetadata = {
  slug: string;
  title: string;
  author: string;
  publishedDate: string;
  featured: boolean;
  summary: string;
  topics: string[];
};

export type PostData = PostMetadata & {
  content: string;
  /** Estimated minutes to read, derived from `content` */
  readingTime: number;
};
