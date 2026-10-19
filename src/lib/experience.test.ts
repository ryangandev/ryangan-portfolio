import { FaUnity } from 'react-icons/fa';
import { describe, expect, it } from 'vitest';

import type { Experience } from '@/data/experience';
import {
  getCurrentRole,
  getSiteDescription,
  getYearsOfExperience,
} from '@/lib/experience';

const entry = (
  kind: Experience['kind'],
  start: string,
  end: string | null,
  organization: string = kind,
): Experience => ({
  kind,
  role: 'Role',
  organization,
  location: 'Somewhere',
  start,
  end,
  description: '',
  mark: FaUnity,
});

describe('getCurrentRole', () => {
  it('takes the ongoing job, not an ongoing degree', () => {
    const entries = [
      entry('education', '2024-09', null),
      entry('work', '2026-04', null, 'Adobe'),
      entry('work', '2025-05', '2026-01'),
    ];

    expect(getCurrentRole(entries).organization).toBe('Adobe');
  });

  it('fails when every job has ended', () => {
    expect(() => getCurrentRole([entry('work', '2022-09', '2024-05')])).toThrow(
      /No ongoing work entry/,
    );
  });
});

describe('getYearsOfExperience', () => {
  const entries = [
    entry('work', '2026-04', null),
    entry('work', '2022-09', '2024-05'),
    entry('co-op', '2021-03', '2021-09'),
    entry('education', '2018-09', '2023-09'),
  ];

  it('counts from the first job, ignoring co-ops and the degree', () => {
    expect(getYearsOfExperience(entries, new Date(2026, 9, 18))).toBe(4);
  });

  it('turns over on the month the first job started', () => {
    expect(getYearsOfExperience(entries, new Date(2026, 7, 31))).toBe(3);
    expect(getYearsOfExperience(entries, new Date(2026, 8, 1))).toBe(4);
  });

  it('fails with no jobs at all', () => {
    expect(() =>
      getYearsOfExperience([entry('co-op', '2021-03', '2021-09')], new Date()),
    ).toThrow(/No work entries/);
  });
});

describe('getSiteDescription', () => {
  it('names the current job and fits a search result', () => {
    const description = getSiteDescription([
      entry('work', '2026-04', null, 'Adobe'),
    ]);

    expect(description).toMatch(/^Ryan Gan is a software engineer at Adobe/);
    expect(description.length).toBeLessThanOrEqual(155);
  });
});
