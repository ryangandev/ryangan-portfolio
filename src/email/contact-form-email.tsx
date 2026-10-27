import React from 'react';
import {
  Html,
  Body,
  Button,
  Head,
  Heading,
  Container,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
  pixelBasedPreset,
} from 'react-email';

import { siteUrl } from '@/data/site';

export type ContactFormEmailProps = {
  message: string;
  senderName: string;
  senderEmail: string;
};

const siteHost = new URL(siteUrl).host;

/** The subject line, shared with the reply button so a reply threads */
export const contactFormSubject = (senderName: string): string =>
  `${senderName} left a message`;

/**
 * Email clients show the preview text next to the subject in the inbox, so it
 * carries the start of the message itself rather than a description of it.
 */
const previewOf = (message: string): string => {
  const flat = message.replace(/\s+/g, ' ').trim();
  return flat.length > 140 ? flat.slice(0, 139).trimEnd() + '…' : flat;
};

/**
 * The plain-text part sent beside the HTML. Resend only renders the HTML from
 * `react`, and a message with no text part reads as spam to some filters.
 */
export const contactFormEmailText = ({
  message,
  senderName,
  senderEmail,
}: ContactFormEmailProps): string =>
  [
    contactFormSubject(senderName),
    `From: ${senderName} <${senderEmail}>`,
    '',
    message.trim(),
    '',
    '--',
    `Sent from the contact form on ${siteHost}.`,
    `Replying to this email goes straight to ${senderEmail}.`,
  ].join('\n');

export default function ContactFormEmail({
  message,
  senderName,
  senderEmail,
}: ContactFormEmailProps) {
  const replyHref = `mailto:${senderEmail}?subject=${encodeURIComponent(
    'Re: ' + contactFormSubject(senderName),
  )}`;
  // HTML collapses newlines, so each line of the message gets its own break
  const lines = message.trim().split(/\r?\n/);

  return (
    <Html lang="en">
      <Head />
      <Preview>{previewOf(message)}</Preview>
      {/*
        react-email bundles Tailwind v4, which emits `rem` units that most email
        clients (notably Outlook) ignore. The pixel-based preset forces 16px
        output so spacing survives the trip.
      */}
      <Tailwind config={{ presets: [pixelBasedPreset] }}>
        <Body
          className="m-0 bg-[#f5f5f5] py-10 text-[#0a0a0a]"
          style={{
            fontFamily:
              "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
          }}
        >
          <Container className="max-w-[560px] px-4">
            <Section className="mb-5">
              <Link href={siteUrl}>
                <Img
                  src={`${siteUrl}/icon-192.png`}
                  width="32"
                  height="32"
                  alt="Ryan Gan"
                  className="rounded-[8px]"
                />
              </Link>
            </Section>

            <Section className="rounded-[12px] border border-solid border-[#e5e5e5] bg-white px-8 py-8">
              <Text className="m-0 text-[12px] font-medium tracking-[0.08em] text-[#737373] uppercase">
                New message
              </Text>
              <Heading
                as="h1"
                className="m-0 mt-2 text-[22px] leading-[30px] font-semibold"
              >
                {contactFormSubject(senderName)}
              </Heading>
              <Text className="m-0 mt-1 text-[14px] leading-[22px] text-[#737373]">
                <Link
                  href={`mailto:${senderEmail}`}
                  className="text-[#737373] underline"
                >
                  {senderEmail}
                </Link>
              </Text>

              <Section className="mt-6 rounded-[8px] bg-[#fafafa] px-5 py-4">
                <Text className="m-0 text-[15px] leading-[24px] text-[#171717]">
                  {lines.map((line, index) => (
                    <React.Fragment key={index}>
                      {index > 0 && <br />}
                      {line}
                    </React.Fragment>
                  ))}
                </Text>
              </Section>

              <Button
                href={replyHref}
                className="mt-6 rounded-[8px] bg-[#171717] px-5 py-3 text-[14px] font-medium text-white"
              >
                Reply to {senderName}
              </Button>
            </Section>

            <Text className="m-0 mt-5 text-[12px] leading-[20px] text-[#a3a3a3]">
              Sent from the contact form on{' '}
              <Link href={`${siteUrl}/contact`} className="text-[#a3a3a3]">
                {siteHost}
              </Link>
              . Replying to this email goes straight to {senderEmail}.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
