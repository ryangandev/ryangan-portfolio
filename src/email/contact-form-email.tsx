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
} from '@react-email/components';
import { Tailwind } from '@react-email/tailwind';

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
            <Tailwind>
                <Body className="bg-gray-100 text-black">
                    <Container>
                        <Section className="bg-white borderBlack my-10 px-10 py-4 rounded-md">
                            <Heading className="leading-tight">
                                You received the following message from{' '}
                                {senderName}
                            </Heading>
                            <Text>{message}</Text>
                            <Hr />
                            <Text>
                                Sender: {senderName}; The sender&apos; email is:{' '}
                                {senderEmail}
                            </Text>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
}
