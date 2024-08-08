export type PostMetadata = {
  slug: string;
  title: string;
  date: string;
  featured: boolean;
  role: string;
  summary: string;
  thumbnailUrl: string;
  stack: string[];
  link: Record<string, string>;
};

export type PostData = PostMetadata & {
  content: string;
};
