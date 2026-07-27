'use client';

import { useForm } from 'react-hook-form';
import { FaPaperPlane } from 'react-icons/fa';
import { toast } from 'sonner';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ReloadIcon } from '@radix-ui/react-icons';

import { sendEmailAction } from '@/actions/contact-actions';
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
import { ContactSchema } from '@/schemas/contact-schema';
import { serverError } from '@/data/errors';

const ContactForm = () => {
  const form = useForm<z.infer<typeof ContactSchema>>({
    resolver: zodResolver(ContactSchema),
    defaultValues: {
      senderName: '',
      senderEmail: '',
      message: '',
      website: '',
    },
  });

  // `zodResolver` runs the schema before `handleSubmit` calls this, so
  // `values` is already valid — there is nothing left to check here. The
  // server validates independently, which is the check that actually matters,
  // since a server action is reachable without going through this form.
  const onSubmit = async (values: z.infer<typeof ContactSchema>) => {
    try {
      const response = await sendEmailAction(values);

      // If error, show error toast
      if (response.error) {
        toast.error(response.message, {
          description: response.error,
        });

        return;
      }

      // If no error, show success toast
      toast.success(response.message, {
        description: 'Thank you for your message!',
      });

      // Reset form
      form.reset();
    } catch {
      toast.error(serverError.message, {
        description: serverError.error,
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="senderName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="senderEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="youremail@example.com"
                  type="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea placeholder="Say something here..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/*
          Honeypot. Hidden with a wrapper rather than `type="hidden"` so a bot
          reading the DOM still sees a fillable text input, and kept out of the
          tab order and the accessibility tree so nobody using the form can
          reach it by accident.
        */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input
            id="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            {...form.register('website')}
          />
        </div>

        <Button
          type="submit"
          className="flex h-9 w-full items-center space-x-2"
          disabled={form.formState.isSubmitting}
        >
          <span>Submit</span>
          {form.formState.isSubmitting ? (
            <ReloadIcon className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <FaPaperPlane size={14} />
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ContactForm;
