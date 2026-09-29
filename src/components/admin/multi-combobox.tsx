'use client';

import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { CheckIcon, Cross2Icon, PlusIcon } from '@radix-ui/react-icons';

import { cn } from '@/lib/utils';

export type ComboboxOption = {
  value: string;
  label: string;
  icon?: React.ReactNode;
};

type MultiComboboxProps = {
  /** Selected values, in the order they are shown and saved */
  value: string[];
  onChange: (value: string[]) => void;
  onBlur?: () => void;
  options: ComboboxOption[];
  placeholder: string;
  /**
   * Accept values that are not among the options. Two values count as the
   * same when this returns the same key for both, so "react" picks an
   * existing "React" rather than adding a near-duplicate.
   */
  create?: { key: (value: string) => string };
  id?: string;
  'aria-invalid'?: boolean;
  'aria-describedby'?: string;
};

const CREATE = Symbol('create');

/**
 * A searchable multi-select: selections sit as chips in front of a text input,
 * and typing filters a list of options under it.
 *
 * It follows the ARIA combobox pattern: focus stays in the input, the arrow
 * keys move through the list, Enter toggles the highlighted option, and
 * Backspace in an empty input removes the last chip.
 */
const MultiCombobox = ({
  value,
  onChange,
  onBlur,
  options,
  placeholder,
  create,
  id,
  'aria-invalid': ariaInvalid,
  'aria-describedby': ariaDescribedBy,
}: MultiComboboxProps) => {
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const byValue = useMemo(
    () => new Map(options.map((option) => [option.value, option])),
    [options],
  );
  const optionFor = (item: string): ComboboxOption =>
    byValue.get(item) ?? { value: item, label: item };

  const trimmed = query.trim();
  const matches = useMemo(() => {
    const needle = trimmed.toLowerCase();

    if (!needle) {
      return options;
    }

    const hits = options.filter(
      ({ value, label }) =>
        label.toLowerCase().includes(needle) ||
        value.toLowerCase().includes(needle),
    );
    const startsWith = ({ label }: ComboboxOption) =>
      label.toLowerCase().startsWith(needle) ? 0 : 1;

    return hits.sort((a, b) => startsWith(a) - startsWith(b));
  }, [options, trimmed]);

  const existing = create
    ? [...options.map((option) => option.value), ...value].find(
        (item) => create.key(item) === create.key(trimmed),
      )
    : undefined;
  const canCreate =
    create !== undefined &&
    create.key(trimmed) !== '' &&
    existing === undefined;
  const items: (ComboboxOption | typeof CREATE)[] = canCreate
    ? [CREATE, ...matches]
    : matches;
  const active = Math.min(activeIndex, Math.max(items.length - 1, 0));

  const toggle = (item: string) => {
    onChange(
      value.includes(item)
        ? value.filter((selected) => selected !== item)
        : [...value, item],
    );
    setQuery('');
    setActiveIndex(0);
  };

  const choose = (item: ComboboxOption | typeof CREATE | undefined) => {
    if (item === CREATE) {
      toggle(trimmed);
    } else if (item) {
      toggle(item.value);
    }
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowUp': {
        event.preventDefault();

        if (!isOpen) {
          setIsOpen(true);
          return;
        }

        const step = event.key === 'ArrowDown' ? 1 : -1;
        setActiveIndex(
          (active + step + items.length) % Math.max(items.length, 1),
        );
        return;
      }
      case 'Enter':
        // Never submit the surrounding form from here.
        event.preventDefault();

        if (isOpen && items.length > 0) {
          choose(items[active]);
        } else if (existing !== undefined && !value.includes(existing)) {
          toggle(existing);
        }
        return;
      case ',':
        if (create && trimmed) {
          event.preventDefault();

          if (canCreate) {
            toggle(trimmed);
          } else if (existing !== undefined && !value.includes(existing)) {
            toggle(existing);
          }
        }
        return;
      case 'Escape':
        if (isOpen) {
          event.preventDefault();
          setIsOpen(false);
        }
        return;
      case 'Backspace':
        if (query === '' && value.length > 0) {
          onChange(value.slice(0, -1));
        }
        return;
    }
  };

  const itemId = (index: number) => `${listId}-${index}`;

  // Keep the highlighted option in view as the arrow keys move past the edge
  // of the scrolling list.
  useEffect(() => {
    if (isOpen) {
      document
        .getElementById(`${listId}-${active}`)
        ?.scrollIntoView({ block: 'nearest' });
    }
  }, [isOpen, active, listId]);

  return (
    <div
      className="relative"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsOpen(false);
          setQuery('');
          onBlur?.();
        }
      }}
    >
      <div
        className={cn(
          'flex min-h-10 w-full cursor-text flex-wrap items-center gap-1.5 rounded-md border border-input bg-transparent px-2 py-1.5 text-sm shadow-xs transition-colors',
          'focus-within:ring-2 focus-within:ring-ring',
          ariaInvalid && 'border-destructive',
        )}
        onClick={() => inputRef.current?.focus()}
      >
        {value.map((item) => {
          const option = optionFor(item);

          return (
            <span
              key={item}
              className="inline-flex h-7 items-center gap-1.5 rounded-full border bg-secondary/60 pr-1 pl-2.5 text-xs font-medium color-level-2"
            >
              {option.icon}
              {option.label}
              <button
                type="button"
                className="rounded-full p-0.5 text-muted-foreground transition-colors hover:bg-neutral-200 hover:text-foreground dark:hover:bg-neutral-700"
                aria-label={`Remove ${option.label}`}
                onClick={(event) => {
                  event.stopPropagation();
                  toggle(item);
                  inputRef.current?.focus();
                }}
              >
                <Cross2Icon className="size-3" />
              </button>
            </span>
          );
        })}
        <input
          ref={inputRef}
          id={id}
          type="text"
          role="combobox"
          autoComplete="off"
          aria-expanded={isOpen}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={
            isOpen && items.length > 0 ? itemId(active) : undefined
          }
          aria-invalid={ariaInvalid}
          aria-describedby={ariaDescribedBy}
          className="h-7 min-w-32 flex-1 bg-transparent px-1 outline-hidden placeholder:text-muted-foreground"
          placeholder={value.length === 0 ? placeholder : ''}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(0);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={onKeyDown}
        />
      </div>

      {isOpen && (
        <ul
          id={listId}
          role="listbox"
          aria-multiselectable
          tabIndex={-1}
          className="absolute top-full z-30 mt-1.5 max-h-72 w-full overflow-y-auto rounded-md border bg-popover p-1 text-sm text-popover-foreground shadow-lg"
          // Keep focus in the input when an option is clicked.
          onMouseDown={(event) => event.preventDefault()}
        >
          {items.length === 0 && (
            <li className="px-2.5 py-2 text-muted-foreground">
              Nothing matches &ldquo;{trimmed}&rdquo;
            </li>
          )}
          {items.map((item, index) => {
            const isActive = index === active;

            if (item === CREATE) {
              return (
                <li
                  key="create"
                  id={itemId(index)}
                  role="option"
                  aria-selected={false}
                  className={cn(
                    'flex cursor-pointer items-center gap-2.5 rounded-sm px-2.5 py-1.5',
                    isActive && 'bg-accent text-accent-foreground',
                  )}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => choose(item)}
                >
                  <PlusIcon className="size-4 text-muted-foreground" />
                  Add &ldquo;{trimmed}&rdquo;
                </li>
              );
            }

            const isSelected = value.includes(item.value);

            return (
              <li
                key={item.value}
                id={itemId(index)}
                role="option"
                aria-selected={isSelected}
                className={cn(
                  'flex cursor-pointer items-center gap-2.5 rounded-sm px-2.5 py-1.5',
                  isActive && 'bg-accent text-accent-foreground',
                )}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => choose(item)}
              >
                {item.icon}
                <span className="flex-1">{item.label}</span>
                {isSelected && <CheckIcon className="size-4" />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default MultiCombobox;
