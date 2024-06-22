import { z } from 'zod';

export const ContactSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.string().email({ message: 'Invalid email' }),
  message: z.string().min(1, { message: 'Say something in the message' }),
});
