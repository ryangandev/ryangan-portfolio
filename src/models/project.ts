export type ProjectMetadata = {
  slug: string;
  title: string;
  date: string;
  featured: boolean;
  role: string;
  summary: string;
  thumbnailUrl: string;
  techStack: string[];
  /**
   * Both the key and each URL are optional, because the content already says
   * so: Grapple Grub and Player 2 Helpdesk define only `live`. The type used
   * to require both, and got away with it only because frontmatter is cast
   * rather than parsed — a project with no `link:` at all would have crashed
   * the build on `project.link.github`.
   */
  link?: {
    github?: string;
    live?: string;
  };
};

export type ProjectData = ProjectMetadata & {
  content: string;
};
