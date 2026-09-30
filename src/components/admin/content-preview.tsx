import React from 'react';

import ArticleBody from '@/components/article-body';
import PostHeader from '@/components/blog/post-header';
import { compileMdx } from '@/components/mdx/mdx-components';
import ProjectHeader from '@/components/portfolio/project-header';
import { toFrontmatter } from '@/lib/admin/content-file';
import { AdminError } from '@/lib/admin/errors';
import type { Collection } from '@/lib/collections';
import { getReadingTime } from '@/lib/reading-time';
import type { ProjectFormValues } from '@/schemas/admin-content-schema';
import {
  PostFrontmatter,
  ProjectFrontmatterSchema,
} from '@/schemas/content-schema';

const previewDate = (value: unknown) =>
  typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? value
    : new Date().toISOString().slice(0, 10);

const previewText = (value: unknown, fallback: string) =>
  typeof value === 'string' && value.trim() ? value : fallback;

/**
 * An item as its page will show it, from the editor's values, valid or not.
 * Missing fields get placeholders so a half-written item still previews.
 *
 * Rendered both by the editor pages, for the preview they open with, and by
 * the preview action as the item changes. The pages matter beyond speed: a
 * server action can only return client components (the code block's copy
 * button, `next/link`, `next/image`) that the calling page's own module graph
 * includes, and rendering the preview there is what includes them.
 *
 * @throws AdminError `invalid` when the body is not valid MDX
 */
export const renderContentPreview = async (
  collection: Collection,
  values: Record<string, unknown>,
): Promise<React.ReactNode> => {
  const body = typeof values.body === 'string' ? values.body : '';
  let content: React.ReactElement;

  try {
    ({ content } = await compileMdx(body));
  } catch (error) {
    throw new AdminError(
      `The body is not valid MDX: ${error instanceof Error ? error.message : String(error)}`,
      'invalid',
    );
  }

  if (collection === 'posts') {
    const post = values as Partial<PostFrontmatter>;

    return (
      <article className="space-y-8">
        <PostHeader
          title={previewText(post.title, 'Untitled post')}
          author={previewText(post.author, 'Ryan Gan')}
          publishedDate={previewDate(post.publishedDate)}
          readingTime={getReadingTime(body)}
          summary={previewText(post.summary, '')}
        />
        <ArticleBody>{content}</ArticleBody>
      </article>
    );
  }

  const project = toFrontmatter('projects', {
    ...(values as ProjectFormValues),
    link: (values as Partial<ProjectFormValues>).link ?? {
      github: '',
      live: '',
    },
  });
  const hasThumbnail = ProjectFrontmatterSchema.shape.thumbnailUrl.safeParse(
    project.thumbnailUrl,
  ).success;

  return (
    <article className="space-y-8">
      <ProjectHeader
        project={{
          ...project,
          title: previewText(project.title, 'Untitled project'),
          role: previewText(project.role, 'Role'),
          summary: previewText(project.summary, 'Summary'),
          date: previewDate(project.date),
          techStack: project.techStack ?? [],
        }}
        thumbnailFallback={
          hasThumbnail ? undefined : (
            <div className="flex aspect-video w-full items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
              The thumbnail appears here once it has an ImageKit URL
            </div>
          )
        }
      />
      <ArticleBody>{content}</ArticleBody>
    </article>
  );
};

/**
 * The preview an editor page opens with. A component rather than a call to
 * `renderContentPreview` in the page, so the server renders it as part of its
 * own tree before handing it to the editor, which is what spares React's
 * development build a false "missing key" warning about the rendered MDX.
 */
export const ContentPreview = async ({
  collection,
  values,
}: {
  collection: Collection;
  values: Record<string, unknown>;
}) => {
  try {
    return await renderContentPreview(collection, values);
  } catch {
    // A draft edited on GitHub can hold MDX that does not compile. The editor
    // still opens, and its preview tab reports the error when asked.
    return null;
  }
};
