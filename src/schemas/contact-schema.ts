import { z } from 'zod';

/**
 * Upper bounds exist because a server action is a public endpoint. Without
 * them `message` was unbounded, so one request could hand Resend an
 * arbitrarily large body. The limits sit far above anything a person would
 * type, so they are invisible in normal use.
 */
export const ContactSchema = z.object({
  senderName: z
    .string()
    .min(1, { message: 'Name is required' })
    .max(100, { message: 'Name is too long' }),
  senderEmail: z
    .email({ message: 'Invalid email' })
    // RFC 5321 caps an address at 254 characters.
    .max(254, { message: 'Email is too long' }),
  message: z
    .string()
    .min(1, { message: 'Say something in the message' })
    .max(5000, { message: 'Message is too long (5000 characters max)' }),
  /**
   * Honeypot. Hidden from people and from assistive technology, so a real
   * sender never fills it in — but a bot that fills every field it finds will.
   * Named `website` because that is a field name a bot expects to be real.
   */
  website: z.string().optional(),
});
