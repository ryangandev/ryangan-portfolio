import { Link } from 'next-view-transitions';
import { GoArrowLeft, GoArrowRight } from 'react-icons/go';

import { cn } from '@/lib/utils';
import { PostMetadata } from '@/models/post';

type PostNavigationProps = {
  older: PostMetadata | null;
  newer: PostMetadata | null;
};

const PostNavigation = ({ older, newer }: PostNavigationProps) => {
  if (!older && !newer) {
    return null;
  }

  return (
    <nav aria-label="More posts" className="grid gap-4 sm:grid-cols-2">
      {older && (
        <PostLink post={older} direction="older" className="sm:col-start-1" />
      )}
      {newer && (
        <PostLink post={newer} direction="newer" className="sm:col-start-2" />
      )}
    </nav>
  );
};

type PostLinkProps = {
  post: PostMetadata;
  direction: 'older' | 'newer';
  className?: string;
};

const PostLink = ({ post, direction, className }: PostLinkProps) => {
  const isOlder = direction === 'older';
  const Arrow = isOlder ? GoArrowLeft : GoArrowRight;

  return (
    <Link
      href={`/blog/${post.slug}`}
      rel={isOlder ? 'prev' : 'next'}
      className={cn(
        'group flex flex-col gap-1 rounded-lg border px-4 py-3 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900',
        !isOlder && 'sm:items-end sm:text-right',
        className,
      )}
    >
      <span className="flex items-center gap-1.5 text-sm color-level-5">
        {isOlder && (
          <Arrow className="transition-transform group-hover:-translate-x-0.5" />
        )}
        {isOlder ? 'Older post' : 'Newer post'}
        {!isOlder && (
          <Arrow className="transition-transform group-hover:translate-x-0.5" />
        )}
      </span>
      <span className="font-medium color-level-1">{post.title}</span>
    </Link>
  );
};

export default PostNavigation;
