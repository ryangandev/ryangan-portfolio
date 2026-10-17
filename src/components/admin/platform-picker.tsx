'use client';

import React from 'react';

import { Button } from '@/components/ui/button';
import { PlatformName, platformNames, platforms } from '@/data/platforms';
import { cn } from '@/lib/utils';

type PlatformPickerProps = {
  value: PlatformName[];
  onChange: (value: PlatformName[]) => void;
  onBlur?: () => void;
  id?: string;
  'aria-invalid'?: boolean;
  'aria-describedby'?: string;
};

/**
 * One toggle per platform. The value keeps the order platforms are declared
 * in, whatever order they were pressed in, so the file never changes just
 * because two were picked the other way round.
 */
const PlatformPicker = ({
  value,
  onChange,
  onBlur,
  ...props
}: PlatformPickerProps) => {
  return (
    <div
      {...props}
      role="group"
      aria-label="Platforms"
      className="flex flex-wrap gap-2"
    >
      {platformNames.map((name) => {
        const isPicked = value.includes(name);

        return (
          <Button
            key={name}
            type="button"
            variant="outline"
            size="sm"
            aria-pressed={isPicked}
            className={cn(
              isPicked &&
                'border-neutral-400 bg-accent text-accent-foreground dark:border-neutral-500',
            )}
            onBlur={onBlur}
            onClick={() =>
              onChange(
                platformNames.filter((other) =>
                  other === name ? !isPicked : value.includes(other),
                ),
              )
            }
          >
            {platforms[name].label}
          </Button>
        );
      })}
    </div>
  );
};

export default PlatformPicker;
