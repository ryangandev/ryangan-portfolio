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
  views?: number;
  est_read_time?: string;
};
