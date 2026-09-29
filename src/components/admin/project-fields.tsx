'use client';

import React, { useRef, useState } from 'react';
import { ReloadIcon, UploadIcon } from '@radix-ui/react-icons';
import Image from 'next/image';
import { Control, useWatch } from 'react-hook-form';
import { toast } from 'sonner';

import TechStackPicker from '@/components/admin/tech-stack-picker';
import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { uploadImage } from '@/lib/admin/upload-image';
import type { ProjectFormValues } from '@/schemas/admin-content-schema';
import { ProjectFrontmatterSchema } from '@/schemas/content-schema';

type ProjectFieldsProps = {
  control: Control<ProjectFormValues>;
  /** ImageKit folder for uploads, or null when uploads are not configured */
  imageFolder: string | null;
};

const isShowableThumbnail = (url: string) =>
  ProjectFrontmatterSchema.shape.thumbnailUrl.safeParse(url).success;

/** The fields only projects have */
const ProjectFields = ({ control, imageFolder }: ProjectFieldsProps) => {
  const fileInput = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const thumbnailUrl = useWatch({ control, name: 'thumbnailUrl' });

  return (
    <>
      <div className="grid gap-5 md:grid-cols-2">
        <FormField
          control={control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <FormControl>
                <Input placeholder="Full Stack Developer" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="techStack"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel>Tech stack</FormLabel>
            <FormControl>
              <TechStackPicker
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                aria-invalid={fieldState.invalid}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="thumbnailUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Thumbnail</FormLabel>
            <div className="flex gap-2">
              <FormControl>
                <Input
                  type="url"
                  placeholder="https://ik.imagekit.io/ryangan/..."
                  {...field}
                />
              </FormControl>
              {imageFolder && (
                <>
                  <input
                    ref={fileInput}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={async (event) => {
                      const file = event.target.files?.[0];

                      event.target.value = '';

                      if (!file) {
                        return;
                      }

                      setIsUploading(true);

                      try {
                        field.onChange(await uploadImage(file, imageFolder));
                      } catch (error) {
                        toast.error(`Could not upload ${file.name}`, {
                          description:
                            error instanceof Error ? error.message : undefined,
                        });
                      } finally {
                        setIsUploading(false);
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="shrink-0"
                    disabled={isUploading}
                    onClick={() => fileInput.current?.click()}
                  >
                    {isUploading ? (
                      <ReloadIcon className="mr-2 size-3.5 animate-spin" />
                    ) : (
                      <UploadIcon className="mr-2 size-3.5" />
                    )}
                    Upload
                  </Button>
                </>
              )}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      {isShowableThumbnail(thumbnailUrl) && (
        <Image
          src={thumbnailUrl}
          alt=""
          width={312}
          height={189}
          // The preview is at most half the content column.
          sizes="312px"
          // Often the largest thing on screen when the editor opens.
          loading="eager"
          className="aspect-[312/189] w-full max-w-[312px] rounded-lg border object-cover"
        />
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <FormField
          control={control}
          name="link.github"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Repository</FormLabel>
              <FormControl>
                <Input
                  type="url"
                  placeholder="https://github.com/..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="link.live"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Live demo</FormLabel>
              <FormControl>
                <Input type="url" placeholder="https://..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
};

export default ProjectFields;
