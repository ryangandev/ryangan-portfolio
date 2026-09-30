'use client';

import React, {
  useCallback,
  useEffect,
  useState,
  useSyncExternalStore,
} from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ExternalLinkIcon,
  LockClosedIcon,
  ReloadIcon,
} from '@radix-ui/react-icons';
import { format, formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';
import { Control, Resolver, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';

import {
  ActionFailure,
  discardDraftAction,
  publishContentAction,
  Saved,
  saveContentAction,
} from '@/actions/admin-actions';
import BodyField from '@/components/admin/body-field';
import ConfirmDialog from '@/components/admin/confirm-dialog';
import PostFields from '@/components/admin/post-fields';
import ProjectFields from '@/components/admin/project-fields';
import Callout from '@/components/callout';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { siteUrl } from '@/data/site';
import type { Draft } from '@/lib/admin/repository';
import { Collection, collections } from '@/lib/collections';
import { slugify } from '@/lib/slug';
import { cn } from '@/lib/utils';
import {
  ContentFormValues,
  contentFormSchemas,
  PostFormValues,
  ProjectFormValues,
} from '@/schemas/admin-content-schema';

/**
 * The fields every item has. The rest differ by collection and are typed in
 * `PostFields` and `ProjectFields`.
 */
type EditorValues = {
  slug: string;
  title: string;
  summary: string;
  featured: boolean;
  body: string;
  [field: string]: unknown;
};

type ContentEditorProps = {
  collection: Collection;
  initialValues: ContentFormValues[Collection];
  /** Blob id of the file as loaded, or null for a new item */
  initialSha: string | null;
  initialDraft: Draft | null;
  isPublished: boolean;
  topicSuggestions: string[];
  canUploadImages: boolean;
  /** Rendered on the server with the page; see `renderContentPreview` */
  initialPreview: React.ReactNode;
};

type Backup = { savedAt: number; values: EditorValues };

const backupKey = (collection: Collection, slug: string | null) =>
  `admin-backup:${collection}:${slug ?? 'new'}`;

const readBackup = (key: string): Backup | null => {
  try {
    const stored = localStorage.getItem(key);

    return stored ? (JSON.parse(stored) as Backup) : null;
  } catch {
    return null;
  }
};

const writeBackup = (key: string, backup: Backup | null) => {
  try {
    if (backup) {
      localStorage.setItem(key, JSON.stringify(backup));
    } else {
      localStorage.removeItem(key);
    }
  } catch {
    // Storage is unavailable (a private window, or full); the backup is a
    // convenience, so carry on without it.
  }
};

const same = (a: unknown, b: unknown) =>
  JSON.stringify(a) === JSON.stringify(b);

const subscribeToNothing = () => () => {};

/**
 * False while hydrating and true after, so markup that depends on the browser
 * (here, local storage) renders only once it cannot mismatch the server's
 */
const useIsHydrated = () =>
  useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false,
  );

const signInUrl = (returnTo: string) =>
  `/admin/sign-in?callbackUrl=${encodeURIComponent(returnTo)}`;

/**
 * Create or edit a post or project.
 *
 * Save draft commits to the item's draft pull request; Publish saves and then
 * merges it. Unsaved changes are also kept in this browser's local storage, so
 * a closed tab or an expired sign-in does not lose them.
 */
const ContentEditor = ({
  collection,
  initialValues,
  initialSha,
  initialDraft,
  isPublished,
  topicSuggestions,
  canUploadImages,
  initialPreview,
}: ContentEditorProps) => {
  const router = useRouter();
  const { noun, sitePath, imageFolder } = collections[collection];
  const form = useForm<EditorValues>({
    resolver: zodResolver(
      contentFormSchemas[collection],
    ) as unknown as Resolver<EditorValues>,
    defaultValues: initialValues as EditorValues,
    mode: 'onTouched',
  });
  const [baseSha, setBaseSha] = useState(initialSha);
  const [draft, setDraft] = useState(initialDraft);
  // A new item's slug follows its title until the slug is edited by hand, and
  // is fixed once saved, since it names the branch, the file, and the URL.
  const [savedSlug, setSavedSlug] = useState<string | null>(
    initialSha ? initialValues.slug : null,
  );
  const [slugEdited, setSlugEdited] = useState(false);
  const [busy, setBusy] = useState<'save' | 'publish' | 'discard' | null>(null);
  const [dialog, setDialog] = useState<'publish' | 'discard' | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  // Whatever this browser kept unsaved last time, read once on the first
  // render. It is only shown after hydration, since the server cannot see it.
  const [storedBackup] = useState(() =>
    typeof window === 'undefined'
      ? null
      : readBackup(
          backupKey(collection, initialSha ? initialValues.slug : null),
        ),
  );
  const [isBackupHandled, setIsBackupHandled] = useState(false);
  const isHydrated = useIsHydrated();
  const backup =
    isHydrated &&
    !isBackupHandled &&
    storedBackup &&
    !same(storedBackup.values, initialValues)
      ? storedBackup
      : null;

  const title = useWatch({ control: form.control, name: 'title' });
  const slug = useWatch({ control: form.control, name: 'slug' });
  const { isDirty } = form.formState;
  const storageKey = backupKey(collection, savedSlug);

  useEffect(() => {
    if (!savedSlug && !slugEdited) {
      form.setValue('slug', slugify(title ?? ''), {
        shouldValidate: form.getFieldState('slug').isTouched,
      });
    }
  }, [title, savedSlug, slugEdited, form]);

  // A new item is dated today, in the browser's time zone rather than the
  // server's.
  useEffect(() => {
    const dateField = collection === 'posts' ? 'publishedDate' : 'date';

    if (!initialSha && !form.getValues(dateField)) {
      form.reset({
        ...form.getValues(),
        [dateField]: format(new Date(), 'yyyy-MM-dd'),
      });
    }
  }, [collection, initialSha, form]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const unsubscribe = form.subscribe({
      formState: { values: true },
      callback: ({ values }) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          writeBackup(
            storageKey,
            same(values, form.formState.defaultValues)
              ? null
              : { savedAt: Date.now(), values },
          );
        }, 500);
      },
    });

    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, [form, storageKey]);

  useEffect(() => {
    if (!isDirty) {
      return;
    }

    const warn = (event: BeforeUnloadEvent) => event.preventDefault();

    window.addEventListener('beforeunload', warn);

    return () => window.removeEventListener('beforeunload', warn);
  }, [isDirty]);

  const reportFailure = useCallback((result: ActionFailure) => {
    toast.error(result.error, {
      duration: 10_000,
      action: result.reauthorize
        ? {
            label: 'Sign in',
            // Unsaved changes survive in the local backup.
            onClick: () => {
              window.location.href = signInUrl(window.location.pathname);
            },
          }
        : undefined,
    });
  }, []);

  /**
   * Take in a save: show what was committed, which Prettier may have
   * reformatted, and remember the new version to build on
   * @param submitted the form's values when the save was sent. Anything typed
   *        since is kept, and stays unsaved.
   */
  const applySaved = useCallback(
    (saved: Saved, submitted: EditorValues) => {
      form.reset(saved.values as EditorValues, {
        keepValues: !same(form.getValues(), submitted),
      });
      writeBackup(storageKey, null);
      setBaseSha(saved.sha);
      setDraft(saved.draft);
      setLastSaved(new Date());

      if (!savedSlug) {
        setSavedSlug(saved.values.slug);
        window.history.replaceState(
          null,
          '',
          `/admin/${collection}/${saved.values.slug}`,
        );
      }
    },
    [collection, form, savedSlug, storageKey],
  );

  const save = useCallback(
    async (values: EditorValues) => {
      setBusy('save');
      // As typed, to tell afterwards whether anything changed meanwhile.
      // `values` has been through the schema, which trims and reorders.
      const submitted = form.getValues();

      try {
        const result = await saveContentAction({ collection, values, baseSha });

        if (!result.ok) {
          reportFailure(result);
          return;
        }

        applySaved(result, submitted);
        toast.success(result.committed ? 'Draft saved' : 'Already saved', {
          description: `Pull request #${result.draft.number}`,
        });
      } finally {
        setBusy(null);
      }
    },
    [applySaved, collection, baseSha, form, reportFailure],
  );

  const publish = async () => {
    setBusy('publish');

    try {
      const values = form.getValues();
      const result = await publishContentAction({
        collection,
        values,
        baseSha,
      });

      if (!result.ok) {
        setDialog(null);
        reportFailure(result);

        // Saved as a draft, but not merged.
        if ('saved' in result) {
          applySaved(result.saved, values);
        }

        return;
      }

      writeBackup(storageKey, null);
      form.reset(values);
      toast.success(`Published "${values.title}"`, {
        description:
          'It goes live when the Vercel deploy finishes, in a minute or two.',
        duration: 10_000,
        action: {
          label: 'Open',
          onClick: () => window.open(result.url, '_blank'),
        },
      });
      router.push('/admin');
      router.refresh();
    } finally {
      setBusy(null);
    }
  };

  const discard = async () => {
    setBusy('discard');

    try {
      const result = await discardDraftAction({
        collection,
        slug: form.getValues('slug'),
      });

      if (!result.ok) {
        setDialog(null);
        reportFailure(result);
        return;
      }

      writeBackup(storageKey, null);
      form.reset(form.getValues());
      toast.success('Draft discarded');
      router.push('/admin');
      router.refresh();
    } finally {
      setBusy(null);
    }
  };

  // Cmd+S or Ctrl+S saves the draft.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 's') {
        event.preventDefault();

        if (!busy) {
          form.handleSubmit(save)();
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => window.removeEventListener('keydown', onKeyDown);
  }, [busy, form, save]);

  const liveUrl = `${siteUrl}${sitePath}/${savedSlug ?? slug}`;
  const uploadFolder = canUploadImages
    ? `${imageFolder}/${slug || 'untitled'}`
    : null;
  const isNew = !savedSlug;

  return (
    <Form {...form}>
      <div className="mb-10 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
        <h1 className="mb-0">{isNew ? `New ${noun}` : `Edit ${noun}`}</h1>
        <div className="flex items-center gap-3 text-sm">
          {draft && (
            <a
              href={draft.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-2.5 py-0.5 font-medium text-amber-900 transition-colors hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200 dark:hover:bg-amber-950"
            >
              Draft #{draft.number}
              <ExternalLinkIcon className="size-3" />
            </a>
          )}
          {isPublished && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-0.5 font-medium text-emerald-900 transition-colors hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200 dark:hover:bg-emerald-950"
            >
              Published
              <ExternalLinkIcon className="size-3" />
            </a>
          )}
        </div>
      </div>

      {backup && (
        <Callout type="warning">
          <p className="mb-2 text-sm">
            This browser kept changes you had not saved,{' '}
            {formatDistanceToNow(backup.savedAt, { addSuffix: true })}.
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              onClick={() => {
                form.reset(backup.values, { keepDefaultValues: true });
                setSlugEdited(true);
                setIsBackupHandled(true);
              }}
            >
              Restore them
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => {
                writeBackup(storageKey, null);
                setIsBackupHandled(true);
              }}
            >
              Discard them
            </Button>
          </div>
        </Callout>
      )}

      <form onSubmit={form.handleSubmit(save)} className="space-y-6" noValidate>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ''} autoFocus={isNew} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ''}
                    readOnly={!isNew}
                    className={cn(!isNew && 'pr-9 text-muted-foreground')}
                    onChange={(event) => {
                      setSlugEdited(true);
                      field.onChange(event);
                    }}
                  />
                </FormControl>
                {!isNew && (
                  <LockClosedIcon
                    className="absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden
                  />
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {!isNew
                  ? liveUrl.replace(/^https:\/\//, '')
                  : slug
                    ? `The address will be ${liveUrl.replace(/^https:\/\//, '')}. It cannot change once saved.`
                    : 'The slug is the last part of the address, and cannot change once saved.'}
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="summary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Summary</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value ?? ''}
                  rows={2}
                  className="field-sizing-content min-h-16"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {collection === 'posts' ? (
          <PostFields
            control={form.control as unknown as Control<PostFormValues>}
            topicSuggestions={topicSuggestions}
          />
        ) : (
          <ProjectFields
            control={form.control as unknown as Control<ProjectFormValues>}
            imageFolder={uploadFolder}
          />
        )}

        <FormField
          control={form.control}
          name="featured"
          render={({ field }) => (
            <FormItem className="flex items-start gap-3 space-y-0">
              <FormControl>
                <input
                  type="checkbox"
                  className="mt-1 size-4 shrink-0 accent-neutral-900 dark:accent-neutral-100"
                  checked={field.value}
                  onChange={(event) => field.onChange(event.target.checked)}
                  onBlur={field.onBlur}
                  ref={field.ref}
                  name={field.name}
                />
              </FormControl>
              <div className="space-y-1">
                <FormLabel>Featured</FormLabel>
                <p className="mb-0 text-xs text-muted-foreground">
                  {collection === 'posts'
                    ? 'Featured posts replace the two newest on the home page.'
                    : 'Featured projects appear on the home page.'}
                </p>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="body"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Body</FormLabel>
              <FormControl>
                <BodyField
                  collection={collection}
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  textareaRef={field.ref}
                  getValues={() => form.getValues()}
                  initialPreview={initialPreview}
                  imageFolder={uploadFolder}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="sticky bottom-0 z-20 -mx-6 flex items-center justify-end gap-3 border-t bg-background/95 px-6 py-3 backdrop-blur-sm sm:justify-between">
          {/* Too little room beside the buttons on a phone. */}
          <p
            className="mb-0 hidden text-sm text-muted-foreground sm:block"
            aria-live="polite"
          >
            {isDirty
              ? 'Unsaved changes'
              : lastSaved
                ? `Saved ${formatDistanceToNow(lastSaved, { addSuffix: true })}`
                : draft
                  ? 'No unsaved changes'
                  : isNew
                    ? 'Not saved yet'
                    : 'Matches what is published'}
          </p>
          <div className="flex items-center gap-2">
            {draft && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-destructive"
                disabled={busy !== null}
                onClick={() => setDialog('discard')}
              >
                Discard draft
              </Button>
            )}
            <Button
              type="submit"
              variant="outline"
              size="sm"
              disabled={busy !== null}
            >
              {busy === 'save' && (
                <ReloadIcon className="mr-2 size-3.5 animate-spin" />
              )}
              Save draft
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={busy !== null || (!isDirty && !draft)}
              onClick={form.handleSubmit(() => setDialog('publish'))}
            >
              Publish
            </Button>
          </div>
        </div>
      </form>

      <ConfirmDialog
        open={dialog === 'publish'}
        title={`Publish this ${noun}?`}
        confirmLabel="Publish"
        busy={busy === 'publish'}
        onConfirm={publish}
        onCancel={() => setDialog(null)}
      >
        <p>
          &ldquo;{title}&rdquo; will be merged into <code>main</code> and goes
          live at {liveUrl.replace(/^https:\/\//, '')} once Vercel has deployed
          it.
        </p>
      </ConfirmDialog>

      <ConfirmDialog
        open={dialog === 'discard'}
        title="Discard this draft?"
        confirmLabel="Discard draft"
        destructive
        busy={busy === 'discard'}
        onConfirm={discard}
        onCancel={() => setDialog(null)}
      >
        <p>
          Pull request #{draft?.number} will be closed without merging.
          {isPublished
            ? ' The published version stays as it is.'
            : ` The ${noun} was never published, so it will be gone from the admin.`}
        </p>
      </ConfirmDialog>
    </Form>
  );
};

export default ContentEditor;
