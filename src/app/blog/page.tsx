import { format } from 'date-fns';
import { Metadata } from 'next';
import Link from 'next/link';

import PageSummary from '@/components/page-summary';
import BackButton from '@/components/navigation/back-button';
import { getSortedPosts } from '@/lib/content';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Blog - Ryan Gan',
};

export default async function Page() {
  const { posts, years } = await getSortedPosts();

  return (
    <main className="relative">
      <BackButton name="Home" href="/" />
      <h1>Blog</h1>
      <PageSummary>
        Here I share insights and lessons from my journey in software
        development.
      </PageSummary>
      <section className="group">
        {years.map((year) => (
          <ul key={year} className="group/section border-t">
            {posts
              .filter(
                (post) => new Date(post.publishedDate).getFullYear() === year,
              )
              .map((post, index) => (
                <li key={post.title}>
                  <Link
                    href={'/blog/' + post.slug}
                    className={cn(
                      'group/item relative flex py-3',
                      index !== 0 &&
                        "after:absolute after:left-[70px] after:right-0 after:top-0 after:h-px after:bg-border after:content-[''] md:after:left-[160px]",
                    )}
                  >
                    <span
                      className={cn(
                        'color-level-5 absolute',
                        'transition-colors group-hover/section:text-neutral-900 dark:group-hover/section:text-neutral-100',
                      )}
                    >
                      {index === 0 ? year : null}
                    </span>
                    <div
                      className={cn(
                        'ml-[70px] flex w-full items-center justify-between transition-opacity md:ml-[160px]',
                        'group-hover/item:!opacity-100 group-hover:opacity-50',
                      )}
                    >
                      <span className="color-level-1">{post.title}</span>
                      <span className="color-level-5 mx-2 text-sm">
                        {format(post.publishedDate, 'MM/dd')}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
          </ul>
        ))}
      </section>
    </main>
  );
}
