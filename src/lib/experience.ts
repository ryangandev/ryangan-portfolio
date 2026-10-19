import { differenceInYears, parseISO } from 'date-fns';

import type { Experience } from '@/data/experience';
import { siteName } from '@/data/site';

/**
 * The ongoing job, which the home page and the site description name
 *
 * @throws when no `work` entry is ongoing, so a timeline that ends a job
 * without starting the next fails the build instead of describing nobody
 */
export const getCurrentRole = (entries: Experience[]): Experience => {
  const current = entries.find(
    (entry) => entry.kind === 'work' && entry.end === null,
  );

  if (!current) {
    throw new Error('No ongoing work entry in src/data/experience.ts');
  }

  return current;
};

/**
 * Whole years since the first job started. Co-ops and the degree do not
 * count, and gaps between jobs are not taken out.
 *
 * Every public page is static, so `now` is when the site was last built; any
 * deploy brings the count up to date.
 */
export const getYearsOfExperience = (
  entries: Experience[],
  now: Date,
): number => {
  const starts = entries
    .filter((entry) => entry.kind === 'work')
    .map((entry) => entry.start)
    .sort();

  if (starts.length === 0) {
    throw new Error('No work entries in src/data/experience.ts');
  }

  // `YYYY-MM` parses as local midnight on the first of the month.
  return differenceInYears(now, parseISO(starts[0]));
};

/**
 * The site's meta description, which search results and link previews show.
 * Built from the timeline so a new job updates it with the home page. Kept
 * under the 155 or so characters a search result shows before cutting off.
 */
export const getSiteDescription = (entries: Experience[]): string => {
  const { organization, location } = getCurrentRole(entries);

  return (
    `${siteName} is a software engineer at ${organization} in ${location}, ` +
    'crafting polished, user-centric software. ' +
    'Projects, case studies, and writing.'
  );
};
