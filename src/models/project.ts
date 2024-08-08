export type ProjectMetadata = {
  slug: string;
  title: string;
  date: string;
  featured: boolean;
  role: string;
  summary: string;
  thumbnailUrl: string;
  stack: string[];
  link: {
    github: string;
    live: string;
  };
};

export type ProjectData = ProjectMetadata & {
  content: string;
};
