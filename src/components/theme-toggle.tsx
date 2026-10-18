'use client';

import React, { useSyncExternalStore } from 'react';
import { useTheme } from 'next-themes';
import { DesktopIcon, MoonIcon, SunIcon } from '@radix-ui/react-icons';

import { cn } from '@/lib/utils';

const options = [
  { value: 'light', label: 'Light', Icon: SunIcon },
  { value: 'system', label: 'System', Icon: DesktopIcon },
  { value: 'dark', label: 'Dark', Icon: MoonIcon },
] as const;

const subscribe = () => () => {};

/**
 * Light, the system's setting, or dark, as three radios side by side: every
 * choice is in view and one click away, and none of them looks like it did
 * nothing, as cycling into "system" would when the system already matches.
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  // The choice lives in localStorage, which the server cannot see, so no
  // option shows as chosen until the page has hydrated.
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  return (
    <fieldset className="flex items-center rounded-full border p-0.5">
      <legend className="sr-only">Theme</legend>
      {options.map(({ value, label, Icon }) => (
        <label
          key={value}
          title={label}
          className={cn(
            'flex size-6 cursor-pointer items-center justify-center rounded-full transition-colors hover:text-foreground has-focus-visible:ring-2 has-focus-visible:ring-ring',
            hydrated &&
              theme === value &&
              'bg-accent text-foreground hover:text-foreground',
          )}
        >
          <input
            type="radio"
            name="theme"
            value={value}
            checked={hydrated && theme === value}
            onChange={() => setTheme(value)}
            className="sr-only"
          />
          <Icon className="size-3.5" aria-hidden />
          <span className="sr-only">{label}</span>
        </label>
      ))}
    </fieldset>
  );
}
