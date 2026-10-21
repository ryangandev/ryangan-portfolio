import { format } from 'date-fns';
import Link from 'next/link';

import { parseContentDate } from '@/lib/date';
import { cn } from '@/lib/utils';
import { PostMetadata } from '@/models/post';

type PostArchiveProps = {
  /** Newest first */
  posts: PostMetadata[];
};

/**
 * Posts grouped under their year, the year shown once beside the first post of
 * each group. On a phone the year takes its own line instead, as in the
 * portfolio list, so the titles get the width a year column would take.
 */
const PostArchive = ({ posts }: PostArchiveProps) => {
  const years = [
    ...new Set(
      posts.map((post) => parseContentDate(post.publishedDate).getFullYear()),
    ),
  ];

  return (
    <section className="group">
      {years.map((year) => (
        <ul key={year} className="group/section border-t">
          <li className="pt-3 color-level-5 sm:hidden">{year}</li>
          {posts
            .filter(
              (post) =>
                parseContentDate(post.publishedDate).getFullYear() === year,
            )
            .map((post, index) => (
              <li key={post.slug}>
                <Link
                  href={'/blog/' + post.slug}
                  className="group/item flex py-3"
                >
                  <span
                    className={cn(
                      'hidden w-[70px] shrink-0 color-level-5 sm:block md:w-40',
                      'transition-colors group-hover/section:text-neutral-900 dark:group-hover/section:text-neutral-100',
                    )}
                  >
                    {index === 0 ? year : null}
                  </span>
                  <span
                    className={cn(
                      'relative flex min-w-0 flex-1 items-baseline justify-between gap-2 transition-opacity',
                      'group-hover:opacity-50 group-hover/item:!opacity-100',
                      // The rule between posts starts after the year.
                      index !== 0 &&
                        "before:absolute before:inset-x-0 before:-top-3 before:h-px before:bg-border before:content-['']",
                    )}
                  >
                    <span className="text-pretty color-level-1">
                      {post.title}
                    </span>
                    <span className="shrink-0 text-sm color-level-5 tabular-nums">
                      {format(parseContentDate(post.publishedDate), 'MM/dd')}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
        </ul>
      ))}
    </section>
  );
};

export default PostArchive;
