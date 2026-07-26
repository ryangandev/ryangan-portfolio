'use server';

import React from 'react';
import { Resend } from 'resend';
import { z } from 'zod';

import { serverError } from '@/data/errors';
import ContactFormEmail from '@/email/contact-form-email';
import { allowContactSubmission } from '@/lib/rate-limit';
import { ContactSchema } from '@/schemas/contact-schema';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * `onboarding@resend.dev` is Resend's shared sandbox domain. It only delivers
 * to the account owner's own address and is heavily rate limited, so it works
 * here by accident rather than by design. Set `CONTACT_FROM_EMAIL` to an
 * address on a domain verified in Resend to get real deliverability.
 */
const fromAddress =
  process.env.CONTACT_FROM_EMAIL ??
  'Portfolio Contact Form <onboarding@resend.dev>';

const toAddress = process.env.CONTACT_TO_EMAIL ?? 'ryangan.dev@gmail.com';

/**
 * A success shape returned without sending anything. Used for submissions that
 * are dropped on purpose — telling a bot it was caught only teaches it what to
 * change.
 */
const silentlyAccepted = {
  error: null,
  message: 'Message sent successfully',
};

export const sendEmailAction = async (data: z.infer<typeof ContactSchema>) => {
  // Server-side validation
  const validatedData = ContactSchema.safeParse(data);

  // If data is invalid, return error
  if (!validatedData.success) {
    let errorMessages = '';

    validatedData.error.issues.forEach((issue) => {
      errorMessages += String(issue.path[0]) + ': ' + issue.message + '.\n';
    });

    return {
      error: errorMessages,
      message: 'Invalid Fields',
    };
  }

  // Prepare data for email
  const { senderName, senderEmail, message, website } = validatedData.data;

  // The honeypot is hidden, so anything in it came from something filling in
  // every field it could find.
  if (website) {
    return silentlyAccepted;
  }

  if (!(await allowContactSubmission())) {
    return silentlyAccepted;
  }

  // Send email
  try {
    const result = await resend.emails.send({
      from: fromAddress,
      to: toAddress,
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
