import { format } from 'date-fns';
import { describe, expect, it } from 'vitest';

import { parseContentDate } from '@/lib/date';

describe('parseContentDate', () => {
  it('runs in a zone behind UTC, so the tests below mean something', () => {
    expect(new Date(2024, 8, 20).getTimezoneOffset()).toBeGreaterThan(0);
  });

  it('keeps the calendar day of a date-only string', () => {
    const date = parseContentDate('2024-09-20');

    expect(format(date, 'yyyy-MM-dd')).toBe('2024-09-20');
    expect(format(date, 'MMM dd, yyyy')).toBe('Sep 20, 2024');
  });

  it('does not repeat what `new Date` does with the same string', () => {
    // The original bug: ISO date-only strings are read as UTC midnight, which
    // is the evening before in any zone behind UTC.
    expect(format(new Date('2024-09-20'), 'yyyy-MM-dd')).toBe('2024-09-19');
  });

  it('files January 1 under its own year', () => {
    expect(parseContentDate('2024-01-01').getFullYear()).toBe(2024);
  });

  it.each(['2023-3-20', '20/03/2023', 'not a date', ''])(
    'rejects %j',
    (value) => {
      expect(() => parseContentDate(value)).toThrow(/zero-padded ISO 8601/);
    },
  );
});
