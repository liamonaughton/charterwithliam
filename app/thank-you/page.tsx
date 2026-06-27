import type { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { SOCIAL } from '@/lib/env';

export const metadata: Metadata = {
  title: 'Request received',
  robots: { index: false, follow: false },
};

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; legs?: string }>;
}) {
  const { email, legs } = await searchParams;
  const onLegs = legs === 'true';

  return (
    <main className="flex min-h-screen flex-col">
      <section className="flex flex-1 items-center bg-ink text-white">
        <div className="container-page py-20">
          <div className="mx-auto max-w-xl text-center">
            <div className="reveal">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky">
                Received
              </p>
              <h1 className="mt-4 text-4xl font-bold sm:text-5xl">
                Thank you.
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-sky-soft">
                Your request is in
                {email ? (
                  <>
                    {' '}
                    — I&apos;ll reach{' '}
                    <span className="font-semibold text-white">{email}</span>
                  </>
                ) : (
                  <> — I&apos;ll be in touch</>
                )}{' '}
                shortly with real options for your trip. In a hurry? Just reply to
                my email with your dates.
              </p>

              {onLegs && (
                <p className="mt-4 rounded-card border border-white/10 bg-white/5 px-5 py-4 text-sky-soft">
                  You&apos;re also on the empty-leg alert list — I&apos;ll send
                  deals that match your routes.
                </p>
              )}

              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <a
                  href={SOCIAL.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  Follow @CharterWithLiam
                </a>
                <Link
                  href="/"
                  className="text-sm font-medium text-sky-soft underline-offset-4 hover:underline"
                >
                  ← Back home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
