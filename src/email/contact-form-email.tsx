import React from 'react';
import {
  Html,
  Body,
  Head,
  Heading,
  Hr,
  Container,
  Preview,
  Section,
  Text,
  Tailwind,
  pixelBasedPreset,
} from 'react-email';

type ContactFormEmailProps = {
  message: string;
  senderName: string;
  senderEmail: string;
};

export default function ContactFormEmail({
  message,
  senderName,
  senderEmail,
}: ContactFormEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>
        A new message left by {senderName} from your portfolio site
      </Preview>
      {/*
        react-email bundles Tailwind v4, which emits `rem` units that most email
        clients (notably Outlook) ignore. The pixel-based preset forces 16px
        output so spacing survives the trip.
      */}
      <Tailwind config={{ presets: [pixelBasedPreset] }}>
        <Body className="bg-gray-100 text-black">
          <Container>
            <Section className="borderBlack my-10 rounded-md bg-white px-10 py-4">
              <Heading className="leading-tight">
                You received the following message from {senderName}
              </Heading>
              <Text>{message}</Text>
              <Hr />
              <Text>
                Sender: {senderName}; The sender&apos; email is: {senderEmail}
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
