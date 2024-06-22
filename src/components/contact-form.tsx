'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { AiOutlineDiscord, AiFillGithub } from 'react-icons/ai';
import { BiLogoLinkedin } from 'react-icons/bi';
import { MdLocationPin, MdOutlineEmail } from 'react-icons/md';
import { FaPaperPlane } from 'react-icons/fa';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ReloadIcon } from '@radix-ui/react-icons';

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

export default function ContactForm() {
  const form = useForm<z.infer<typeof ContactSchema>>({
    resolver: zodResolver(ContactSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });
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

  const onSubmit = (values: z.infer<typeof ContactSchema>) => {
    console.log(values);
    toast({
      title: 'Message sent',
      description: 'Thank you for your message!',
    });

    // form.reset();
  };

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
      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col justify-between">
          <div className="space-y-12">
            <div className="space-y-2">
              <h3 className="flex items-center space-x-2">
                <span>Contact</span>
                <MdOutlineEmail />
              </h3>
              <p className="font-light text-foreground/60">
                ryangan.dev@gmail.com
              </p>
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
            <span
              aria-label="Copy discord id to clipboard"
              onClick={handleDiscordIdCopy}
              className="cursor-pointer"
            >
              <AiOutlineDiscord size={24} />
            </span>
          </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{`Name ${form.formState.errors.name ? `- ${form.formState.errors.name.message}` : ''}`}</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{`Email ${form.formState.errors.email ? `- ${form.formState.errors.email.message}` : ''}`}</FormLabel>
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
      </div>
    </motion.section>
  );
}
