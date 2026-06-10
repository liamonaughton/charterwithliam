import {
  Body,
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

export interface EmptyLegsEmailProps {
  firstName?: string;
  homeAirport?: string;
  unsubscribeUrl?: string;
  mailingAddress?: string;
  replyTo?: string;
}

export default function EmptyLegsEmail({
  firstName,
  homeAirport,
  unsubscribeUrl = 'https://charterwithliam.com/privacy',
  mailingAddress = 'CharterWithLiam',
  replyTo = 'liam@charterwithliam.com',
}: EmptyLegsEmailProps) {
  const hello = firstName ? `Hi ${firstName},` : 'Hi there,';
  return (
    <Html>
      <Head />
      <Preview>You&apos;re on the empty-leg deal list ✈️</Preview>
      <Body style={t.main}>
        <Container style={t.container}>
          <Section style={t.card}>
            <Text style={t.heading}>You&apos;re on the empty-leg list ✈️</Text>
            <Text style={t.paragraph}>{hello}</Text>
            <Text style={t.paragraph}>
              You&apos;re all set. When a jet needs to reposition empty, that
              flight can go for a fraction of the usual price — sometimes up to
              75% off. I&apos;ll send the ones that match your routes.
            </Text>
            {homeAirport ? (
              <Text style={t.paragraph}>
                I&apos;ve got your home airport as <strong>{homeAirport}</strong>.
                If that&apos;s off, just reply and let me know.
              </Text>
            ) : (
              <Text style={t.paragraph}>
                Quick favor: reply with your <strong>home airport</strong> and any
                routes you fly often, and I&apos;ll tailor the deals I send you.
              </Text>
            )}
            <Hr style={t.hr} />
            <Text style={t.muted}>
              These deals are occasional and time-sensitive — when one fits, move
              fast. No spam in between.
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
              You&apos;re receiving this because you opted into empty-leg alerts at
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

EmptyLegsEmail.PreviewProps = {
  firstName: 'Alex',
  homeAirport: 'KTEB (Teterboro)',
} as EmptyLegsEmailProps;
