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
      <div className="container-page relative py-16 sm:py-20 lg:py-28">
        <div className="reveal mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky">
            Private jet charter
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-[1.08] sm:text-5xl lg:text-6xl">
            Fly private, booked direct.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-sky-soft">
            Tell us your trip. Our team will arrange the right aircraft with
            vetted operators. Let us handle all the details.
          </p>
          <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm text-sky-soft">
            {[
              'Vetted operators only',
              'Transparent, itemized pricing',
              'One point of contact, start to finish',
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <CheckIcon />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="reveal mx-auto mt-10 max-w-xl sm:mt-12">
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
