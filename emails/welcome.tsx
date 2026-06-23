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

// Public Supabase Storage object (bucket `guides`). Static link — Resend wraps
// it automatically for native open/click tracking.
const GUIDE_URL =
  'https://hyusjyhvlaitvputbdxy.supabase.co/storage/v1/object/public/guides/charter-guide.pdf';

export interface WelcomeEmailProps {
  firstName?: string;
  unsubscribeUrl?: string;
  mailingAddress?: string;
  replyTo?: string;
}

export default function WelcomeEmail({
  firstName,
  unsubscribeUrl = 'https://charterwithliam.com/privacy',
  mailingAddress = 'CharterWithLiam',
  replyTo = 'liam@charterwithliam.com',
}: WelcomeEmailProps) {
  const hello = firstName ? `Hi ${firstName},` : 'Hi there,';
  return (
    <Html>
      <Head />
      <Preview>Welcome to CharterWithLiam — glad you&apos;re here.</Preview>
      <Body style={t.main}>
        <Container style={t.container}>
          <Section style={t.card}>
            <Text style={t.heading}>Welcome aboard ✈️</Text>
            <Text style={t.paragraph}>{hello}</Text>
            <Text style={t.paragraph}>
              Thanks for joining CharterWithLiam. You&apos;ll get clear,
              no-nonsense insight on private charter — how pricing really works,
              how to spot a good deal, and how to book with your eyes open.
            </Text>
            <Text style={t.paragraph}>
              Your Charter Guide is ready now — the no-nonsense breakdown of how
              private charter pricing, safety, and the fine print actually work:
            </Text>
            <Section style={{ textAlign: 'center', margin: '28px 0' }}>
              <Button style={t.button} href={GUIDE_URL}>
                Read the Charter Guide
              </Button>
            </Section>
            <Text style={t.muted}>
              Button not working? Paste this link into your browser:
              <br />
              <Link href={GUIDE_URL} style={t.link}>
                {GUIDE_URL}
              </Link>
            </Text>
            <Text style={t.paragraph}>
              If you&apos;re weighing a specific trip, just reply with your route
              and dates — I read every email personally.
            </Text>
            <Hr style={t.hr} />
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
              You&apos;re receiving this because you signed up at
              charterwithliam.com.{' '}
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

WelcomeEmail.PreviewProps = {
  firstName: 'Alex',
} as WelcomeEmailProps;
