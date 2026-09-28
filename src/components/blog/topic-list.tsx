import { Link } from 'next-view-transitions';

import { toTopicSlug } from '@/lib/topics';

type TopicListProps = {
  topics: string[];
};

const TopicList = ({ topics }: TopicListProps) => {
  if (topics.length === 0) {
    return null;
  }

  return (
    <ul className="flex flex-wrap gap-2" aria-label="Topics">
      {topics.map((topic) => (
        <li key={topic}>
          <Link
            href={`/blog/topics/${toTopicSlug(topic)}`}
            className="inline-block rounded-full border px-3 py-0.5 text-sm color-level-4 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
          >
            {topic}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default TopicList;
