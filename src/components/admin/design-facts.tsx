'use client';

import React from 'react';
import { format } from 'date-fns';

import AnimatedLink from '@/components/animated-link';
import { useActiveHeadingId } from '@/components/table-of-contents';
import type { DesignVersion } from '@/data/design-history';
import { parseContentDate } from '@/lib/date';

export type DesignFactsVersion = Pick<
  DesignVersion,
  'version' | 'date' | 'commit' | 'stack'
> & {
  /** The id of the version's heading, which its section starts at */
  id: string;
  /** The version's heading as the table of contents lists it */
  text: string;
  commitUrl: string;
};

const Fact = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div>
    <dt className="color-level-5">{label}</dt>
    <dd className="color-level-2">{children}</dd>
  </div>
);

const formatMonth = (date: string) =>
  format(parseContentDate(date), 'MMM yyyy');

/**
 * The facts of the version being read, for the left-hand gutter from xl up,
 * under the back link. They change with the section, as the table of contents
 * marks it; above the first version they sum up the whole history instead.
 * Below xl each version's section carries its own.
 */
const DesignFacts = ({ versions }: { versions: DesignFactsVersion[] }) => {
  const activeId = useActiveHeadingId(versions);
  const version = versions.find(({ id }) => id === activeId);

  return (
    // Keyed by version, so each one fades in rather than swapping in place
    <dl
      key={version?.id ?? 'all'}
      className="mb-0 space-y-3.5 text-sm leading-[22px] motion-safe:animate-in motion-safe:duration-300 motion-safe:fade-in"
    >
      {version ? (
        <>
          <Fact label="Version">{version.version}</Fact>
          <Fact label="Date">
            {format(parseContentDate(version.date), 'MMM d, yyyy')}
          </Fact>
          <Fact label="Commit">
            <AnimatedLink href={version.commitUrl} isExternal>
              {version.commit}
            </AnimatedLink>
          </Fact>
          <Fact label="Built with">
            <ul>
              {version.stack.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Fact>
        </>
      ) : (
        <>
          <Fact label="Versions">{versions.length}</Fact>
          <Fact label="From">{formatMonth(versions[0].date)}</Fact>
          <Fact label="To">
            {formatMonth(versions[versions.length - 1].date)}
          </Fact>
        </>
      )}
    </dl>
  );
};

export default DesignFacts;
