'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { AiFillGithub } from 'react-icons/ai';
import { BiLogoLinkedin } from 'react-icons/bi';
import { FaDiscord, FaMedium } from 'react-icons/fa6';
import { MdLocationPin, MdOutlineEmail } from 'react-icons/md';
import { FaPaperPlane } from 'react-icons/fa';
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
import { useToast } from '@/components/ui/use-toast';
import { ContactSchema } from '@/schemas/contact-schema';
import { serverError } from '@/data/errors';

export default function Contact() {
  return (
    <motion.section
      id="contact"
      className=""
      initial={{
        opacity: 0,
      }}
      whileInView={{
        opacity: 1,
      }}
      transition={{
        duration: 1,
      }}
      viewport={{
        once: true,
      }}
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <ContactInfo />
        <ContactForm />
      </div>
    </motion.section>
  );
}

function ContactInfo() {
  const { toast } = useToast();

  const handleDiscordIdCopy = () => {
    navigator.clipboard
      .writeText('ryiscrispy')
      .then(() => {
        toast({
          title: 'Discord ID copied',
          description: 'Discord ID has been copied to your clipboard.',
        });
      })
      .catch((err) => {
        toast({
          title: 'Discord ID copy failed',
          description: 'Copy failed. Please try again. ' + err,
          variant: 'destructive',
        });
      });
  };

  return (
    <div className="flex flex-col justify-between space-y-6">
      <div className="space-y-6 sm:space-y-12">
        <div className="space-y-2">
          <h3 className="flex items-center space-x-2">
            <span>Contact</span>
            <MdOutlineEmail />
          </h3>
          <p className="font-light text-foreground/60">ryangan.dev@gmail.com</p>
        </div>

        <div className="space-y-2">
          <h3 className="flex items-center space-x-2">
            <span>Location</span>
            <MdLocationPin />
          </h3>
          <p className="font-light text-foreground/60">Philadelphia, PA </p>
        </div>
      </div>

      <div className="flex h-9 items-center space-x-4">
        <Link
          aria-label="Link to github"
          href={'https://github.com/ryangandev'}
          target="_blank"
        >
          <AiFillGithub size={24} />
        </Link>
        <Link
          aria-label="Link to linkedin"
          href={'https://www.linkedin.com/in/ryangan1/'}
          target="_blank"
        >
          <BiLogoLinkedin size={24} />
        </Link>
        <Link
          aria-label="Link to medium"
          href={'https://medium.com/@ryangan.dev'}
          target="_blank"
        >
          <FaMedium size={24} />
        </Link>
        <span
          aria-label="Copy discord id to clipboard"
          onClick={handleDiscordIdCopy}
          className="cursor-pointer"
        >
          <FaDiscord size={24} />
        </span>
      </div>
    </div>
  );
}

function ContactForm() {
  const form = useForm<z.infer<typeof ContactSchema>>({
    resolver: zodResolver(ContactSchema),
    defaultValues: {
      senderName: '',
      senderEmail: '',
      message: '',
    },
  });
  const { toast } = useToast();

  const onSubmit = async (values: z.infer<typeof ContactSchema>) => {
    // Client-side validation
    const validatedData = ContactSchema.safeParse(values);

    // If data is invalid, return error toast
    if (!validatedData.success) {
      let errorMessages = '';

      validatedData.error.issues.forEach((issue) => {
        errorMessages += issue.path[0] + ': ' + issue.message + '.\n';
      });

      toast({
        title: 'Invalid Fields',
        description: errorMessages,
        variant: 'destructive',
      });

      return;
    }

    // Send email
    try {
      const response = await sendEmailAction(validatedData.data);

      // If error, show error toast
      if (response.error) {
        toast({
          title: response.message,
          description: response.error,
          variant: 'destructive',
        });

        return;
      }

      // If no error, show success toast
      toast({
        title: response.message,
        description: 'Thank you for your message!',
      });

      // Reset form
      form.reset();
    } catch (error) {
      toast({
        title: serverError.message,
        description: serverError.error,
        variant: 'destructive',
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
}
