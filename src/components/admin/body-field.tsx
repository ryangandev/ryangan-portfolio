'use client';

import React, { useRef, useState } from 'react';
import { ImageIcon, ReloadIcon } from '@radix-ui/react-icons';
import { toast } from 'sonner';

import { previewContentAction } from '@/actions/admin-actions';
import Callout from '@/components/callout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { uploadImage } from '@/lib/admin/upload-image';
import type { Collection } from '@/lib/collections';
import { cn } from '@/lib/utils';

type BodyFieldProps = {
  collection: Collection;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  /** The editor's current values, for rendering the preview */
  getValues: () => Record<string, unknown>;
  /** The preview of the item as loaded, rendered with the page */
  initialPreview: React.ReactNode;
  /** ImageKit folder for uploads, or null when uploads are not configured */
  imageFolder: string | null;
  textareaRef: React.RefCallback<HTMLTextAreaElement>;
  /** From `FormControl`, which also points the field's label here */
  id?: string;
  'aria-invalid'?: boolean;
  'aria-describedby'?: string;
};

type Tab = 'write' | 'preview';

const imageFiles = (files: FileList | null | undefined) =>
  [...(files ?? [])].filter((file) => file.type.startsWith('image/'));

/**
 * The MDX body: a plain text area to write in, and a preview tab that renders
 * it on the server with the same pipeline and components as the live page.
 * Images dropped or pasted into the text area are uploaded to ImageKit and
 * linked where the cursor is.
 */
const BodyField = ({
  collection,
  value,
  onChange,
  onBlur,
  getValues,
  initialPreview,
  imageFolder,
  textareaRef,
  id = 'body',
  'aria-invalid': invalid,
  'aria-describedby': describedBy,
}: BodyFieldProps) => {
  const [tab, setTab] = useState<Tab>('write');
  const [preview, setPreview] = useState<React.ReactNode>(initialPreview);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [isRendering, setIsRendering] = useState(false);
  const [uploads, setUploads] = useState(0);
  const textarea = useRef<HTMLTextAreaElement | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const showPreview = async () => {
    setTab('preview');
    setIsRendering(true);
    setPreviewError(null);

    try {
      const result = await previewContentAction({
        collection,
        values: getValues(),
      });

      if (result.ok) {
        setPreview(result.preview);
      } else {
        setPreviewError(result.error);
      }
    } catch (error) {
      setPreviewError(
        error instanceof Error
          ? error.message
          : 'The preview failed to render.',
      );
    } finally {
      setIsRendering(false);
    }
  };

  /** Put a block of Markdown at the cursor, as its own paragraph */
  const insertBlock = (block: string) => {
    const element = textarea.current;
    const current = element?.value ?? value;
    const start = element?.selectionStart ?? current.length;
    const end = element?.selectionEnd ?? current.length;
    const before = current.slice(0, start).replace(/\s+$/, '');
    const after = current.slice(end).replace(/^\s+/, '');
    const head = before ? `${before}\n\n${block}` : block;
    const next = after ? `${head}\n\n${after}` : `${head}\n`;

    onChange(next);
    requestAnimationFrame(() => {
      element?.focus();
      element?.setSelectionRange(head.length, head.length);
    });
  };

  const upload = async (files: File[]) => {
    if (!imageFolder || files.length === 0) {
      return;
    }

    setUploads((count) => count + files.length);

    for (const file of files) {
      try {
        const url = await uploadImage(file, imageFolder);
        const alt = file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ');

        insertBlock(`![${alt}](${url})`);
      } catch (error) {
        toast.error(`Could not upload ${file.name}`, {
          description: error instanceof Error ? error.message : undefined,
        });
      } finally {
        setUploads((count) => count - 1);
      }
    }
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-2">
        <div
          role="tablist"
          aria-label="Editor view"
          className="inline-flex rounded-md border p-0.5 text-sm"
        >
          {(['write', 'preview'] as const).map((name) => (
            <button
              key={name}
              type="button"
              role="tab"
              aria-selected={tab === name}
              aria-controls={`${id}-${name}`}
              className={cn(
                'rounded-sm px-3 py-1 font-medium capitalize transition-colors',
                tab === name
                  ? 'bg-secondary text-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
              onClick={() =>
                name === 'preview' ? showPreview() : setTab(name)
              }
            >
              {name}
            </button>
          ))}
        </div>

        {imageFolder && tab === 'write' && (
          <>
            <input
              ref={fileInput}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={(event) => {
                upload(imageFiles(event.target.files));
                event.target.value = '';
              }}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
              disabled={uploads > 0}
              onClick={() => fileInput.current?.click()}
            >
              {uploads > 0 ? (
                <ReloadIcon className="mr-2 size-3.5 animate-spin" />
              ) : (
                <ImageIcon className="mr-2 size-3.5" />
              )}
              {uploads > 0 ? 'Uploading' : 'Insert image'}
            </Button>
          </>
        )}
      </div>

      <div id={`${id}-write`} role="tabpanel" hidden={tab !== 'write'}>
        <Textarea
          ref={(element) => {
            textarea.current = element;
            textareaRef(element);
          }}
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onBlur}
          aria-invalid={invalid}
          aria-describedby={describedBy}
          spellCheck
          className={cn(
            'field-sizing-content max-h-[calc(100dvh-10rem)] min-h-[28rem] resize-y px-4 py-3 font-mono text-[13px] leading-6',
            invalid && 'border-destructive',
          )}
          placeholder={
            imageFolder
              ? 'Write in Markdown and MDX. Drop or paste an image to upload it.'
              : 'Write in Markdown and MDX.'
          }
          onPaste={(event) => {
            const files = imageFiles(event.clipboardData.files);

            if (files.length > 0 && imageFolder) {
              event.preventDefault();
              upload(files);
            }
          }}
          onDragOver={(event) => {
            if (imageFolder && event.dataTransfer.types.includes('Files')) {
              event.preventDefault();
            }
          }}
          onDrop={(event) => {
            const files = imageFiles(event.dataTransfer.files);

            if (files.length > 0 && imageFolder) {
              event.preventDefault();
              upload(files);
            }
          }}
        />
      </div>

      <div
        id={`${id}-preview`}
        role="tabpanel"
        hidden={tab !== 'preview'}
        className="rounded-md border px-5 py-8 md:px-8"
        aria-busy={isRendering}
      >
        {isRendering && (
          <p className="mb-0 flex items-center text-sm text-muted-foreground">
            <ReloadIcon className="mr-2 size-3.5 animate-spin" />
            Rendering the preview
          </p>
        )}
        {!isRendering && previewError && (
          <Callout type="danger">
            <p className="mb-0 text-sm whitespace-pre-wrap">{previewError}</p>
          </Callout>
        )}
        {!isRendering && !previewError && preview}
      </div>
    </div>
  );
};

export default BodyField;
