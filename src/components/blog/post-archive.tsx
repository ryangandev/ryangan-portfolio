import { format } from 'date-fns';
import { Link } from 'next-view-transitions';

import { parseContentDate } from '@/lib/date';
import { cn } from '@/lib/utils';
import { PostMetadata } from '@/models/post';

type PostArchiveProps = {
  /** Newest first */
  posts: PostMetadata[];
};

/**
 * Posts grouped under their year, the year shown once beside the first post of
 * each group
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
          {posts
            .filter(
              (post) =>
                parseContentDate(post.publishedDate).getFullYear() === year,
            )
            .map((post, index) => (
              <li key={post.slug}>
                <Link
                  href={'/blog/' + post.slug}
                  className={cn(
                    'group/item relative flex py-3',
                    index !== 0 &&
                      "after:absolute after:top-0 after:right-0 after:left-[70px] after:h-px after:bg-border after:content-[''] md:after:left-[160px]",
                  )}
                >
                  <span
                    className={cn(
                      'absolute color-level-5',
                      'transition-colors group-hover/section:text-neutral-900 dark:group-hover/section:text-neutral-100',
                    )}
                  >
                    {index === 0 ? year : null}
                  </span>
                  <div
                    className={cn(
                      'ml-[70px] flex w-full items-center justify-between transition-opacity md:ml-[160px]',
                      'group-hover:opacity-50 group-hover/item:!opacity-100',
                    )}
                  >
                    <span className="color-level-1">{post.title}</span>
                    <span className="mx-2 text-sm color-level-5">
                      {format(parseContentDate(post.publishedDate), 'MM/dd')}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
        </ul>
      ))}
    </section>
  );
};

export default PostArchive;
