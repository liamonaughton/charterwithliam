import HubSpotForm from './HubSpotForm';
import { SUBSCRIBER_COUNT } from '@/lib/env';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-ink text-white">
      {/* Subtle sky/cloud gradient backdrop. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(1200px 600px at 80% -10%, rgba(46,139,255,0.28), transparent 60%), radial-gradient(900px 500px at 10% 110%, rgba(46,139,255,0.12), transparent 60%)',
        }}
      />
      <div className="container-page relative grid items-center gap-10 py-16 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:py-28">
        <div className="reveal">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky">
            Private jet charter
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-[1.08] sm:text-5xl lg:text-6xl">
            Fly private, booked direct.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-sky-soft">
            Tell me your trip. I&apos;ll arrange the right aircraft with vetted
            operators, at a fair price — and handle every detail myself.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-sky-soft">
            {[
              'Vetted operators only',
              'Transparent, itemized pricing',
              'One point of contact, start to finish',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <CheckIcon />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="reveal">
          <div className="rounded-2xl border border-white/10 bg-white p-6 text-ink shadow-card sm:p-8">
            <HubSpotForm />
          </div>
          <p className="mt-4 text-center text-sm text-sky-soft">
            Trusted by {SUBSCRIBER_COUNT}+ private travelers.
          </p>
        </div>
      </div>
    </section>
  );
}

function CheckIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
      className="mt-0.5 shrink-0 text-sky"
    >
      <circle cx="10" cy="10" r="10" fill="currentColor" opacity="0.18" />
      <path
        d="M6 10.5l2.5 2.5L14 7.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
