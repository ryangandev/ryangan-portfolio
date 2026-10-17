'use client';

import React, { useState } from 'react';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { savePortfolioLayoutAction } from '@/actions/admin-actions';
import { Button } from '@/components/ui/button';
import type { PortfolioLayoutFile } from '@/lib/admin/repository';
import { portfolioLayoutChoices } from '@/lib/portfolio-layout';
import { cn } from '@/lib/utils';
import type { PortfolioLayout } from '@/schemas/portfolio-layout-schema';

type PortfolioLayoutFormProps = {
  /** The layout on `main` */
  file: PortfolioLayoutFile;
  /** The layout this deploy was built with, which the site shows now */
  deployed: PortfolioLayout;
};

const settings = Object.keys(
  portfolioLayoutChoices,
) as (keyof PortfolioLayout)[];

const isSame = (a: PortfolioLayout, b: PortfolioLayout) =>
  settings.every((setting) => a[setting] === b[setting]);

/**
 * Pick how the portfolio list and the project pages look. Saving commits the
 * choice to `main`, and the site shows it once that deploy has finished.
 */
const PortfolioLayoutForm = ({ file, deployed }: PortfolioLayoutFormProps) => {
  const router = useRouter();
  const [saved, setSaved] = useState(file);
  const [layout, setLayout] = useState(file.layout);
  const [isSaving, setIsSaving] = useState(false);
  const isDirty = !isSame(layout, saved.layout);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSaving(true);

    try {
      const result = await savePortfolioLayoutAction({
        layout,
        baseSha: saved.sha,
      });

      if (!result.ok) {
        toast.error(result.error, {
          duration: 10_000,
          action: result.reauthorize
            ? {
                label: 'Sign in',
                onClick: () =>
                  router.push(
                    `/admin/sign-in?callbackUrl=${encodeURIComponent('/admin')}`,
                  ),
              }
            : undefined,
        });
        return;
      }

      setSaved(result.saved);
      toast.success('Layout saved', {
        description: 'The site switches to it in a minute or two.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={save} className="space-y-6">
      {settings.map((setting) => {
        const { label, choices } = portfolioLayoutChoices[setting];

        return (
          <fieldset key={setting} className="space-y-2">
            <legend className="mb-2 text-sm font-medium color-level-1">
              {label}
            </legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {choices.map((choice) => {
                const isChecked = layout[setting] === choice.value;

                return (
                  <label
                    key={choice.value}
                    className={cn(
                      'flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors',
                      'hover:border-neutral-300 hover:bg-neutral-50 dark:hover:border-neutral-700 dark:hover:bg-neutral-900',
                      'has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-background',
                      isChecked &&
                        'border-neutral-400 bg-neutral-50 hover:border-neutral-400 dark:border-neutral-500 dark:bg-neutral-900 dark:hover:border-neutral-500',
                    )}
                  >
                    {/* As tall as the label's first line, so the radio
                        centers on it */}
                    <span className="flex h-7 shrink-0 items-center">
                      <input
                        type="radio"
                        name={setting}
                        value={choice.value}
                        checked={isChecked}
                        onChange={() =>
                          setLayout({ ...layout, [setting]: choice.value })
                        }
                        className="accent-neutral-900 dark:accent-neutral-100"
                      />
                    </span>
                    <span>
                      <span className="block font-medium color-level-1">
                        {choice.label}
                      </span>
                      <span className="block text-sm text-muted-foreground">
                        {choice.description}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        );
      })}

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <Button type="submit" disabled={!isDirty || isSaving}>
          {isSaving && <ReloadIcon className="mr-2 size-3.5 animate-spin" />}
          Save layout
        </Button>
        {!isSame(saved.layout, deployed) && (
          <p className="mb-0 text-sm text-muted-foreground">
            The site shows this once the deploy from main has finished.
          </p>
        )}
      </div>
    </form>
  );
};

export default PortfolioLayoutForm;
