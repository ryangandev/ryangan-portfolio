import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import ContentEditor from '@/components/admin/content-editor';
import { ContentPreview } from '@/components/admin/content-preview';
import BackButton from '@/components/navigation/back-button';
import { siteName } from '@/data/site';
import { isImageUploadConfigured } from '@/lib/admin/imagekit';
import { requireAdmin } from '@/lib/admin/session';
import { collections, isCollection } from '@/lib/collections';
import { getTopics } from '@/lib/content';
import type { ContentFormValues } from '@/schemas/admin-content-schema';

type Params = { params: Promise<{ collection: string }> };

export const generateMetadata = async ({
  params,
}: Params): Promise<Metadata> => {
  const { collection } = await params;

  return {
    title: isCollection(collection)
      ? `New ${collections[collection].noun}`
      : 'Not found',
  };
};

/*
 * Dates start empty and the editor fills in today's date in the browser: the
 * server's today is UTC, which is already tomorrow for an evening in America.
 */
const blank: ContentFormValues = {
  posts: {
    slug: '',
    title: '',
    author: siteName,
    publishedDate: '',
    featured: false,
    summary: '',
    topics: [],
    body: '',
  },
  projects: {
    slug: '',
    title: '',
    date: '',
    featured: false,
    role: '',
    summary: '',
    thumbnailUrl: '',
    techStack: [],
    link: { github: '', live: '' },
    body: '',
  },
};

export default async function Page({ params }: Params) {
  const { collection } = await params;

  if (!isCollection(collection)) {
    notFound();
  }

  await requireAdmin(`/admin/${collection}/new`);

  const topics = collection === 'posts' ? await getTopics() : [];

  return (
    <main className="relative">
      <BackButton name="Admin" href="/admin" />
      <ContentEditor
        collection={collection}
        initialValues={blank[collection]}
        initialSha={null}
        initialDraft={null}
        isPublished={false}
        topicSuggestions={topics.map((topic) => topic.name)}
        canUploadImages={isImageUploadConfigured()}
        initialPreview={
          <ContentPreview collection={collection} values={blank[collection]} />
        }
      />
    </main>
  );
}
