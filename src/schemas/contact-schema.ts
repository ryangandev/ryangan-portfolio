import { z } from 'zod';

export const ContactSchema = z.object({
  senderName: z.string().min(1, { message: 'Name is required' }),
  senderEmail: z.string().email({ message: 'Invalid email' }),
  message: z.string().min(1, { message: 'Say something in the message' }),
});
