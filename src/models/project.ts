import type { ProjectFrontmatter } from '@/schemas/content-schema';

export type ProjectMetadata = ProjectFrontmatter & {
  slug: string;
};

export type ProjectData = ProjectMetadata & {
  content: string;
};
