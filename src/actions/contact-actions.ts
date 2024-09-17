'use server';

import React from 'react';
import { Resend } from 'resend';
import { z } from 'zod';

import { serverError } from '@/data/errors';
import ContactFormEmail from '@/email/contact-form-email';
import { ContactSchema } from '@/schemas/contact-schema';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmailAction = async (data: z.infer<typeof ContactSchema>) => {
  // Server-side validation
  const validatedData = ContactSchema.safeParse(data);

  // If data is invalid, return error
  if (!validatedData.success) {
    let errorMessages = '';

    validatedData.error.issues.forEach((issue) => {
      errorMessages += issue.path[0] + ': ' + issue.message + '.\n';
    });

    return {
      error: errorMessages,
      message: 'Invalid Fields',
    };
  }

  // Prepare data for email
  const { senderName, senderEmail, message } = validatedData.data;

  // Send email
  try {
    const result = await resend.emails.send({
      from: 'Portfolio Contact Form <onboarding@resend.dev>',
      to: 'ryangan.dev@gmail.com',
      subject: senderName + ' left a message',
      replyTo: senderEmail,
      react: React.createElement(ContactFormEmail, {
        message: message,
        senderName: senderName,
        senderEmail: senderEmail,
      }),
    });

    if (result.error) {
      console.log('Resend response error: ', result.error);
      // Return a general server error message to replace resend result error
      return serverError;
    }

    return {
      // Return success message
      error: null,
      message: 'Message sent successfully',
    };
  } catch (error) {
    console.log('Resend api call error: ', error);
    // Return a general server error message for resend api call error
    return serverError;
  }
};
