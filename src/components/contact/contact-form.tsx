'use client';

import { useForm } from 'react-hook-form';
import { GoChevronRight } from 'react-icons/go';
import { LuLoaderCircle } from 'react-icons/lu';
import { toast } from 'sonner';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { sendEmailAction } from '@/actions/contact-actions';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { ContactSchema } from '@/schemas/contact-schema';
import { serverError } from '@/data/errors';
import { cn } from '@/lib/utils';

/*
  A field is a row: its label in the left column, the bare control beside it,
  and a rule along the bottom. The row counts as focused only while its own
  input or textarea is, not the send button that sits in the message row.
*/

const labelClassName = cn(
  'w-24 shrink-0 text-base leading-7 font-normal color-level-5 transition-colors duration-300 md:w-40',
  'group-has-[:is(input,textarea):focus:not([aria-invalid=true])]/row:color-level-1',
  'group-has-[[aria-invalid=true]]/row:text-red-600 dark:group-has-[[aria-invalid=true]]/row:text-red-400',
);

/**
 * Drawn over the row's border: it sweeps in from the left when the field
 * takes focus and back out when it loses it. An invalid field keeps it drawn
 * in red, sweeping in when the error first shows.
 */
const ruleClassName = cn(
  'pointer-events-none absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 bg-neutral-900 transition-[scale,background-color] duration-300 ease-out motion-reduce:transition-none dark:bg-neutral-100',
  'group-has-[:is(input,textarea):focus]/row:scale-x-100',
  'group-has-[[aria-invalid=true]]/row:scale-x-100 group-has-[[aria-invalid=true]]/row:bg-red-600 dark:group-has-[[aria-invalid=true]]/row:bg-red-400',
);

/**
 * Borderless, since the row draws the field. Autofill would otherwise paint
 * its own background into the row, so an inset shadow in the page's color
 * covers it.
 */
const controlClassName = cn(
  'block w-full bg-transparent leading-7 color-level-1 outline-hidden',
  'placeholder:text-neutral-400 dark:placeholder:text-neutral-600',
  'autofill:shadow-[inset_0_0_0_1000px_var(--color-background)] autofill:[-webkit-text-fill-color:var(--color-neutral-900)] dark:autofill:[-webkit-text-fill-color:var(--color-neutral-100)]',
);

type FieldRowProps = {
  label: string;
  /** The control, which `FormControl` wires to the label and the error */
  children: React.ReactElement;
  /**
   * Placed at the end of the row's last line, opposite the error, or below
   * it when both do not fit
   */
  action?: React.ReactNode;
};

const FieldRow = ({ label, children, action }: FieldRowProps) => (
  <FormItem className="group/row relative flex items-start space-y-0 border-b py-3">
    <FormLabel className={labelClassName}>{label}</FormLabel>
    <div className="min-w-0 flex-1">
      <FormControl>{children}</FormControl>
      {action ? (
        <div className="mt-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
          <FormMessage className="mt-0" />
          <div className="ml-auto shrink-0">{action}</div>
        </div>
      ) : (
        <FormMessage />
      )}
    </div>
    <span aria-hidden className={ruleClassName} />
  </FormItem>
);

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
  // `values` is already valid - there is nothing left to check here. The
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

  const isSubmitting = form.formState.isSubmitting;

  const sendButton = (
    <button
      type="submit"
      disabled={isSubmitting}
      className="group/send inline-flex h-8 cursor-pointer items-center gap-1 rounded-full pr-2.5 pl-3.5 text-sm font-medium whitespace-nowrap color-level-2 transition-colors hover:bg-neutral-100 hover:color-level-0 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-60 dark:hover:bg-neutral-800"
    >
      Send message
      {isSubmitting ? (
        <LuLoaderCircle aria-hidden className="size-4 animate-spin" />
      ) : (
        <GoChevronRight
          aria-hidden
          className="size-4 transition-transform group-hover/send:translate-x-0.5"
        />
      )}
    </button>
  );

  return (
    <Form {...form}>
      {/*
        `noValidate`, so an address the browser rejects gets the same inline
        message as every other invalid field, not a native tooltip.
      */}
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
        className="border-t"
      >
        <FormField
          control={form.control}
          name="senderName"
          render={({ field }) => (
            <FieldRow label="Name">
              <input
                className={controlClassName}
                placeholder="Your name"
                autoComplete="name"
                {...field}
              />
            </FieldRow>
          )}
        />

        <FormField
          control={form.control}
          name="senderEmail"
          render={({ field }) => (
            <FieldRow label="Email">
              <input
                className={controlClassName}
                placeholder="you@example.com"
                type="email"
                autoComplete="email"
                {...field}
              />
            </FieldRow>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FieldRow label="Message" action={sendButton}>
              {/*
                Grows with what is typed where `field-sizing` is supported,
                and scrolls past a dozen lines or so. Elsewhere it stays at
                three rows.
              */}
              <textarea
                className={cn(
                  controlClassName,
                  'field-sizing-content max-h-96 min-h-21 resize-none',
                )}
                placeholder="Say something here..."
                rows={3}
                {...field}
              />
            </FieldRow>
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
      </form>
    </Form>
  );
};

export default ContactForm;
