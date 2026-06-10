import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';
import * as t from './theme';

export interface GuideEmailProps {
  firstName?: string;
  downloadUrl: string;
  unsubscribeUrl?: string;
  mailingAddress?: string;
  replyTo?: string;
}

export default function GuideEmail({
  firstName,
  downloadUrl = 'https://charterwithliam.com',
  unsubscribeUrl = 'https://charterwithliam.com/privacy',
  mailingAddress = 'CharterWithLiam',
  replyTo = 'liam@charterwithliam.com',
}: GuideEmailProps) {
  const hello = firstName ? `Hi ${firstName},` : 'Hi there,';
  return (
    <Html>
      <Head />
      <Preview>Your Charter Buyer&apos;s Guide is ready to download.</Preview>
      <Body style={t.main}>
        <Container style={t.container}>
          <Section style={t.card}>
            <Text style={t.heading}>Your Charter Buyer&apos;s Guide 📄</Text>
            <Text style={t.paragraph}>{hello}</Text>
            <Text style={t.paragraph}>
              Thanks for grabbing the guide. It&apos;s the no-nonsense breakdown of
              how private charter pricing, safety, and the fine print actually
              work — so you book with your eyes open.
            </Text>
            <Section style={{ textAlign: 'center', margin: '28px 0' }}>
              <Button style={t.button} href={downloadUrl}>
                Download the guide
              </Button>
            </Section>
            <Text style={t.muted}>
              Button not working? Paste this link into your browser:
              <br />
              <Link href={downloadUrl} style={t.link}>
                {downloadUrl}
              </Link>
            </Text>
            <Hr style={t.hr} />
            <Text style={t.paragraph}>
              Planning a specific trip? Just reply to this email with your route
              and dates — I read every one.
            </Text>
            <Text style={t.paragraph}>
              — Liam
              <br />
              <Link href={`mailto:${replyTo}`} style={t.link}>
                {replyTo}
              </Link>
            </Text>
          </Section>
          <Section style={{ padding: '0 32px' }}>
            <Text style={t.muted}>
              You&apos;re receiving this because you requested the Charter
              Buyer&apos;s Guide at charterwithliam.com.{' '}
              <Link href={unsubscribeUrl} style={t.link}>
                Unsubscribe
              </Link>
              .
              <br />
              {mailingAddress}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

GuideEmail.PreviewProps = {
  firstName: 'Alex',
  downloadUrl: 'https://example.com/guide.pdf',
} as GuideEmailProps;
