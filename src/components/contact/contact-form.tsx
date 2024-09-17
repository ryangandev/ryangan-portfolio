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
    },
  });

  const onSubmit = async (values: z.infer<typeof ContactSchema>) => {
    // Client-side validation
    const validatedData = ContactSchema.safeParse(values);

    // If data is invalid, return error toast
    if (!validatedData.success) {
      let errorMessages = '';

      validatedData.error.issues.forEach((issue) => {
        errorMessages += issue.path[0] + ': ' + issue.message + '.\n';
      });

      toast.error('Invalid Fields', {
        description: errorMessages,
      });

      return;
    }

    // Send email
    try {
      const response = await sendEmailAction(validatedData.data);

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
    } catch (error) {
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
              <FormLabel>{`Name ${form.formState.errors.senderName ? `- ${form.formState.errors.senderName.message}` : ''}`}</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="senderEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{`Email ${form.formState.errors.senderEmail ? `- ${form.formState.errors.senderEmail.message}` : ''}`}</FormLabel>
              <FormControl>
                <Input
                  placeholder="youremail@example.com"
                  type="email"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {`Message ${form.formState.errors.message ? `- ${form.formState.errors.message.message}` : ''}`}
              </FormLabel>
              <FormControl>
                <Textarea placeholder="Say something here..." {...field} />
              </FormControl>
            </FormItem>
          )}
        />

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
