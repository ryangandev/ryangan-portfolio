import { isValid, parseISO } from 'date-fns';

/**
 * Parse a `YYYY-MM-DD` frontmatter date as local midnight.
 *
 * `new Date('2024-09-20')` is deliberately not used here. A bare date-only
 * string is ISO 8601, which the spec says to read as UTC — so formatting it
 * back out in the reader's timezone lands on the previous day for anyone west
 * of UTC. Every date on the site rendered a day early because of this.
 * `parseISO` reads a date-only string as local midnight instead, so the day
 * survives the round trip.
 *
 * Throws rather than returning an Invalid Date. Every caller runs at build
 * time, so a malformed date should fail the build with the offending value
 * attached, not render the string "Invalid Date" into a live page. That also
 * means the zero padding is enforced: `parseISO` rejects `2023-3-20`, which is
 * what `new Date` used to accept — as a *local* time, which is why the two
 * badly formatted project dates were the only ones displaying correctly.
 *
 * @param value a zero-padded `YYYY-MM-DD` date from MDX frontmatter
 * @returns The date at local midnight
 */
export const parseContentDate = (value: string): Date => {
  const date = parseISO(value);

  if (!isValid(date)) {
    throw new Error(
      `Invalid frontmatter date: ${JSON.stringify(value)}. ` +
        'Dates must be zero-padded ISO 8601, e.g. 2023-03-20.',
    );
  }

  return date;
};
