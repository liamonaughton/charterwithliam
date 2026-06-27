import type { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { MAILING_ADDRESS } from '@/lib/env';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How CharterWithLiam collects, uses, and protects your information.',
};

const UPDATED = 'June 9, 2026';

export default function PrivacyPage() {
  return (
    <main>
      <section className="bg-ink py-14 text-white">
        <div className="container-page">
          <Link
            href="/"
            className="text-sm text-sky-soft underline-offset-4 hover:underline"
          >
            ← Back home
          </Link>
          <h1 className="mt-4 text-4xl font-bold sm:text-5xl">Privacy Policy</h1>
          <p className="mt-3 text-sky-soft">Last updated: {UPDATED}</p>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-page prose-wrap mx-auto max-w-3xl space-y-8 text-ink/90">
          <Block title="The short version">
            I collect your email (and anything else you choose to share) so I can
            quote and arrange your private charter and, if you ask for them,
            empty-leg deal alerts. I don&apos;t sell your data. You can
            unsubscribe at any time.
          </Block>

          <Block title="What I collect">
            <ul className="ml-5 list-disc space-y-1">
              <li>Your email address (required).</li>
              <li>Optionally: your first name, phone, home airport, and routes.</li>
              <li>
                Your consent to receive emails, and the date you gave it.
              </li>
              <li>
                Basic attribution (which channel or link sent you here) and
                coarse location (country), so I can understand what&apos;s working.
              </li>
            </ul>
          </Block>

          <Block title="How I use it">
            <ul className="ml-5 list-disc space-y-1">
              <li>To quote your trip and arrange your charter.</li>
              <li>To send any empty-leg alerts you opted into.</li>
              <li>To reply to you if you write back about a trip.</li>
              <li>To understand which channels help, so I can improve.</li>
            </ul>
          </Block>

          <Block title="Who I share it with">
            I use trusted service providers to run this — HubSpot (the form you
            submit, my CRM, and email delivery), Vercel (hosting and
            privacy-friendly analytics), and the certificated operators I source
            your flight from (when you ask me to quote or book a trip). They
            process data on my behalf, and I never sell your information.
          </Block>

          <Block title="How it&apos;s protected">
            Your information is handled through reputable providers over encrypted
            connections, and access is limited to what&apos;s needed to quote and
            arrange your travel.
          </Block>

          <Block title="Email &amp; your choices" id="unsubscribe">
            Every email I send includes a one-click unsubscribe link. You can opt
            out at any time, and I&apos;ll stop sending. To request access to or
            deletion of your data, just email me at{' '}
            <a href="mailto:liam@charterwithliam.com" className="text-sky underline">
              liam@charterwithliam.com
            </a>
            .
          </Block>

          <Block title="Contact">
            Questions about this policy? Reach me at{' '}
            <a href="mailto:liam@charterwithliam.com" className="text-sky underline">
              liam@charterwithliam.com
            </a>
            .
            <br />
            <span className="text-sm text-mist">{MAILING_ADDRESS}</span>
          </Block>
        </div>
      </section>
      <Footer />
    </main>
  );
}

function Block({
  title,
  id,
  children,
}: {
  title: string;
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <div id={id} className="scroll-mt-24">
      <h2 className="font-display text-2xl font-semibold">{title}</h2>
      <div className="mt-3 leading-relaxed">{children}</div>
    </div>
  );
}
