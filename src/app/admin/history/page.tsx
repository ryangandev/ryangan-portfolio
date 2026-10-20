import React from 'react';
import type { Metadata } from 'next';
import { format } from 'date-fns';

import DesignFacts, {
  type DesignFactsVersion,
} from '@/components/admin/design-facts';
import AnimatedLink from '@/components/animated-link';
import ImageViewerProvider from '@/components/image-viewer/image-viewer-provider';
import CustomImage from '@/components/mdx/custom-image';
import BackButton from '@/components/navigation/back-button';
import ContentsGutter from '@/components/navigation/contents-gutter';
import PageSummary from '@/components/page-summary';
import {
  designHistory,
  designHistoryOverview,
  type DesignVersion,
} from '@/data/design-history';
import { contentRepository } from '@/data/site';
import { requireAdmin } from '@/lib/admin/session';
import { parseContentDate } from '@/lib/date';

export const metadata: Metadata = {
  title: 'Design history',
};

const commitUrl = (commit: string) =>
  `https://github.com/${contentRepository.owner}/${contentRepository.name}/commit/${commit}`;

/** `v1.0` becomes `v1-0`, the id of its heading */
const versionId = (version: string) => version.replace(/\./g, '-');

const versions: DesignFactsVersion[] = designHistory.map((version) => ({
  id: versionId(version.version),
  text: `${version.version} ${version.title}`,
  version: version.version,
  date: version.date,
  commit: version.commit,
  commitUrl: commitUrl(version.commit),
  stack: version.stack,
}));

/**
 * One version: what changed, what it was built with, and its screenshots,
 * light beside dark. The viewer browses one version's screenshots at a time.
 * From xl up the date, commit, and stack move to the left-hand gutter.
 */
const Version = ({ version }: { version: DesignVersion }) => (
  <section data-image-gallery className="mt-16 first-of-type:mt-0">
    <h2 id={versionId(version.version)} className="mb-1 scroll-mt-20 xl:mb-4">
      <span className="mr-2 color-level-5">{version.version}</span>
      {version.title}
    </h2>
    <p className="mb-4 text-sm text-muted-foreground xl:hidden">
      {format(parseContentDate(version.date), 'MMM d, yyyy')}
      <span aria-hidden> · </span>
      <AnimatedLink href={commitUrl(version.commit)} isExternal>
        {version.commit}
      </AnimatedLink>
    </p>
    <p className="leading-7 xl:mb-6">{version.summary}</p>
    <dl className="mb-6 text-sm xl:hidden">
      <dt className="color-level-5">Built with</dt>
      <dd className="color-level-2">{version.stack.join(', ')}</dd>
    </dl>
    {/* A hairline edge, or a dark screenshot melts into the dark page */}
    <div className="grid gap-y-8 md:grid-cols-2 md:gap-x-4 md:gap-y-6 [&_img]:ring-1 [&_img]:ring-black/5 dark:[&_img]:ring-white/10">
      {version.screenshots.flatMap((shot) =>
        (['light', 'dark'] as const).map((theme) => (
          <CustomImage
            key={`${shot.page}-${theme}`}
            src={shot[theme]}
            alt={`${shot.page}${shot.fullPage ? ', whole page' : ''}, ${theme}`}
            gallery="tile"
          />
        )),
      )}
    </div>
  </section>
);

export default async function Page() {
  await requireAdmin('/admin/history');

  return (
    <main className="relative">
      {/* As on a post: the facts of the version in view ride under the back
          link, and the versions are the table of contents. */}
      <BackButton name="Admin" href="/admin">
        <DesignFacts versions={versions} />
      </BackButton>
      <ContentsGutter headings={versions} />
      <h1>Design history</h1>
      <PageSummary>{designHistoryOverview}</PageSummary>
      <ImageViewerProvider>
        {designHistory.map((version) => (
          <Version key={version.version} version={version} />
        ))}
      </ImageViewerProvider>
    </main>
  );
}
