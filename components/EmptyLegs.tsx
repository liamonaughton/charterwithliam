import HubSpotForm from './HubSpotForm';

export default function EmptyLegs() {
  return (
    <section id="empty-legs" className="bg-navy py-20 text-white sm:py-24">
      <div className="container-page grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky">
            Empty-leg alerts
          </p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            Want to fly private for a fraction of the price?
          </h2>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-sky-soft">
            When a jet has to reposition without passengers, that flight can sell
            for up to 75% off. The catch: they&apos;re time-sensitive and they
            don&apos;t last. Tell me your home airport and the routes you fly, and
            I&apos;ll send the deals that actually match.
          </p>
          <ul className="mt-8 space-y-3 text-sky-soft">
            <li className="flex items-start gap-3">
              <Dot /> Deals matched to your routes — not a firehose.
            </li>
            <li className="flex items-start gap-3">
              <Dot /> Occasional and time-sensitive. No spam in between.
            </li>
            <li className="flex items-start gap-3">
              <Dot /> Free to join. Unsubscribe anytime.
            </li>
          </ul>
        </div>

        <div className="rounded-2xl bg-white p-6 text-ink shadow-card sm:p-8">
          <h3 className="font-display text-xl font-semibold">
            Join the empty-leg list
          </h3>
          <p className="mt-1 text-sm text-mist">
            Get the guide too — it&apos;s already checked for you.
          </p>
          <div className="mt-6">
            <HubSpotForm />
          </div>
        </div>
      </div>
    </section>
  );
}

function Dot() {
  return (
    <span
      aria-hidden
      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sky"
    />
  );
}
