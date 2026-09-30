import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import AdminProblem from '@/components/admin/admin-problem';
import ContentEditor from '@/components/admin/content-editor';
import { ContentPreview } from '@/components/admin/content-preview';
import Callout from '@/components/callout';
import BackButton from '@/components/navigation/back-button';
import { parseContentFile, toFormValues } from '@/lib/admin/content-file';
import { AdminError } from '@/lib/admin/errors';
import { getGitHubToken } from '@/lib/admin/github-token';
import { isImageUploadConfigured } from '@/lib/admin/imagekit';
import {
  ContentItem,
  createOctokit,
  getContentItem,
} from '@/lib/admin/repository';
import { requireAdmin } from '@/lib/admin/session';
import { collections, isCollection } from '@/lib/collections';
import { getTopics } from '@/lib/content';
import { SlugSchema } from '@/lib/slug';

type Params = { params: Promise<{ collection: string; slug: string }> };

export const generateMetadata = async ({
  params,
}: Params): Promise<Metadata> => {
  const { collection, slug } = await params;

  return {
    title: isCollection(collection)
      ? `Edit ${collections[collection].noun} ${slug}`
      : 'Not found',
  };
};

export default async function Page({ params }: Params) {
  const { collection, slug } = await params;

  if (!isCollection(collection) || !SlugSchema.safeParse(slug).success) {
    notFound();
  }

  const path = `/admin/${collection}/${slug}`;
  const admin = await requireAdmin(path);
  let item: ContentItem | null;

  try {
    item = await getContentItem(
      createOctokit(await getGitHubToken(admin.id)),
      collection,
      slug,
    );
  } catch (error) {
    if (!(error instanceof AdminError)) {
      throw error;
    }

    return (
      <main className="relative">
        <BackButton name="Admin" href="/admin" />
        <AdminProblem error={error} returnTo={path} />
      </main>
    );
  }

  if (!item) {
    notFound();
  }

  let parsed: ReturnType<typeof parseContentFile>;

  try {
    parsed = parseContentFile(collection, item.source);
  } catch (error) {
    // Only a file edited outside the portal can get here. The editor cannot
    // load what it cannot parse, so it has to be fixed where it was broken.
    return (
      <main className="relative">
        <BackButton name="Admin" href="/admin" />
        <h1>Cannot open this {collections[collection].noun}</h1>
        <Callout type="danger">
          <p className="text-sm">
            Its frontmatter does not validate, so fix the file on GitHub
            {item.draft ? ` in draft #${item.draft.number}` : ''}:
          </p>
          <pre className="mb-0 text-xs whitespace-pre-wrap">
            {error instanceof Error ? error.message : String(error)}
          </pre>
        </Callout>
      </main>
    );
  }

  const initialValues = toFormValues(
    collection,
    slug,
    parsed.frontmatter,
    parsed.body,
  );
  const topics = collection === 'posts' ? await getTopics() : [];

  return (
    <main className="relative">
      <BackButton name="Admin" href="/admin" />
      <ContentEditor
        collection={collection}
        initialValues={initialValues}
        initialSha={item.sha}
        initialDraft={item.draft}
        isPublished={item.isPublished}
        topicSuggestions={topics.map((topic) => topic.name)}
        canUploadImages={isImageUploadConfigured()}
        initialPreview={
          <ContentPreview collection={collection} values={initialValues} />
        }
      />
    </main>
  );
}
