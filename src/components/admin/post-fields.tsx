'use client';

import React from 'react';
import { Control } from 'react-hook-form';

import MultiCombobox from '@/components/admin/multi-combobox';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toTopicSlug } from '@/lib/topics';
import type { PostFormValues } from '@/schemas/admin-content-schema';

type PostFieldsProps = {
  control: Control<PostFormValues>;
  topicSuggestions: string[];
};

/** Topics that differ only in case or separators share a page */
const topicKey = { key: toTopicSlug };

/** The fields only posts have */
const PostFields = ({ control, topicSuggestions }: PostFieldsProps) => {
  const topicOptions = topicSuggestions.map((topic) => ({
    value: topic,
    label: topic,
  }));

  return (
    <>
      <div className="grid gap-5 md:grid-cols-2">
        <FormField
          control={control}
          name="publishedDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Published date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="author"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Author</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="topics"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Topics</FormLabel>
            <FormControl>
              <MultiCombobox
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                options={topicOptions}
                create={topicKey}
                placeholder="Pick a topic or type a new one"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default PostFields;
