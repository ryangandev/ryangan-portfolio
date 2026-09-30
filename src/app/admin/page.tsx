import React from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { Link } from 'next-view-transitions';
import { ChevronRightIcon, Pencil2Icon, PlusIcon } from '@radix-ui/react-icons';

import { signOut } from '@/auth';
import AdminProblem from '@/components/admin/admin-problem';
import BackButton from '@/components/navigation/back-button';
import PageSummary from '@/components/page-summary';
import { AdminError } from '@/lib/admin/errors';
import { getGitHubToken } from '@/lib/admin/github-token';
import {
  ContentOverview,
  ContentSummary,
  createOctokit,
  getContentOverview,
} from '@/lib/admin/repository';
import { requireAdmin } from '@/lib/admin/session';
import { collectionNames, collections } from '@/lib/collections';
import { parseContentDate } from '@/lib/date';
import { cn } from '@/lib/utils';

const ContentRow = ({
  item,
  details,
}: {
  item: ContentSummary;
  details: React.ReactNode[];
}) => {
  return (
    <li>
      <Link
        href={`/admin/${item.collection}/${item.slug}`}
        className="group flex items-center justify-between gap-4 border-t py-3"
      >
        <div className="min-w-0">
          <p className="mb-0 truncate color-level-1 group-hover:underline group-hover:underline-offset-4">
            {item.title}
          </p>
          <p className="mb-0 flex flex-wrap gap-x-1.5 text-xs leading-5 text-muted-foreground">
            {details.map((detail, index) => (
              <React.Fragment key={index}>
                {index > 0 && <span aria-hidden>·</span>}
                <span>{detail}</span>
              </React.Fragment>
            ))}
          </p>
        </div>
        <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
      </Link>
    </li>
  );
};

const formatDate = (date: string) =>
  date ? format(parseContentDate(date), 'MMM d, yyyy') : 'No date';

const Overview = ({ overview }: { overview: ContentOverview }) => {
  const draftFor = (item: ContentSummary) =>
    overview.drafts.find(
      (draft) =>
        draft.collection === item.collection && draft.slug === item.slug,
    );

  return (
    <>
      {overview.drafts.length > 0 && (
        <section>
          <h2>Drafts</h2>
          <ul className="border-b">
            {overview.drafts.map((draft) => {
              const isNew = !overview.published[draft.collection].some(
                (item) => item.slug === draft.slug,
              );

              return (
                <ContentRow
                  key={`${draft.collection}/${draft.slug}`}
                  item={draft}
                  details={[
                    `${isNew ? 'New' : 'Edited'} ${collections[draft.collection].noun}`,
                    `#${draft.draft.number}`,
                    `updated ${formatDistanceToNow(new Date(draft.updatedAt), { addSuffix: true })}`,
                  ]}
                />
              );
            })}
          </ul>
        </section>
      )}

      {collectionNames.map((collection) => (
        <section key={collection}>
          <h2 className="capitalize">{collection}</h2>
          {overview.published[collection].length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nothing published yet.
            </p>
          ) : (
            <ul className="border-b">
              {overview.published[collection].map((item) => {
                const draft = draftFor(item);

                return (
                  <ContentRow
                    key={item.slug}
                    item={item}
                    details={[
                      item.error ? (
                        <span className="text-destructive">
                          Invalid frontmatter
                        </span>
                      ) : (
                        formatDate(item.date)
                      ),
                      ...(item.featured ? ['Featured'] : []),
                      ...(draft
                        ? [
                            <span
                              key="draft"
                              className="text-amber-700 dark:text-amber-300"
                            >
                              Draft #{draft.draft.number}
                            </span>,
                          ]
                        : []),
                    ]}
                  />
                );
              })}
            </ul>
          )}
        </section>
      ))}
    </>
  );
};

const actions = [
  {
    href: '/admin/posts/new',
    title: 'Write a post',
    description: 'An article for the blog',
    Icon: Pencil2Icon,
  },
  {
    href: '/admin/projects/new',
    title: 'Add a project',
    description: 'A case study for the portfolio',
    Icon: PlusIcon,
  },
];

export default async function Page() {
  const admin = await requireAdmin('/admin');
  let overview: ContentOverview | null = null;
  let problem: AdminError | null = null;

  try {
    overview = await getContentOverview(
      createOctokit(await getGitHubToken(admin.id)),
    );
  } catch (error) {
    if (!(error instanceof AdminError)) {
      throw error;
    }

    problem = error;
  }

  return (
    <main className="relative">
      <BackButton name="Home" href="/" />
      <div className="mb-7 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h1 className="mb-0">Admin</h1>
        <form
          className="flex items-center gap-2 text-sm text-muted-foreground"
          action={async () => {
            'use server';

            await signOut({ redirectTo: '/admin/sign-in' });
          }}
        >
          <span>{admin.login ? `@${admin.login}` : admin.name}</span>
          <span aria-hidden>·</span>
          <button
            type="submit"
            className="underline-offset-4 transition-colors hover:text-foreground hover:underline"
          >
            Sign out
          </button>
        </form>
      </div>
      <PageSummary>
        Drafts are pull requests on GitHub, with a Vercel preview each.
        Publishing merges one into main, and the site redeploys a minute or two
        later.
      </PageSummary>

      <div className="grid gap-4 sm:grid-cols-2">
        {actions.map(({ href, title, description, Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'group flex items-start gap-3 rounded-lg border p-4 transition-colors',
              'hover:border-neutral-300 hover:bg-neutral-50 dark:hover:border-neutral-700 dark:hover:bg-neutral-900',
            )}
          >
            <Icon className="mt-1 size-4 shrink-0 color-level-2" />
            <span>
              <span className="block font-medium color-level-1">{title}</span>
              <span className="block text-sm text-muted-foreground">
                {description}
              </span>
            </span>
          </Link>
        ))}
      </div>

      {problem && (
        <div className="mt-14">
          <AdminProblem error={problem} returnTo="/admin" />
        </div>
      )}
      {overview && <Overview overview={overview} />}
    </main>
  );
}
