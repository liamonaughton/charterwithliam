const items = [
  {
    title: 'The right aircraft',
    body: 'Matched to your route, passengers, and schedule.',
  },
  {
    title: 'Transparent pricing',
    body: 'An itemized quote, with my broker fee shown as its own line.',
  },
  {
    title: 'Vetted operators',
    body: 'Certificated operators with the safety record to match.',
  },
  {
    title: 'One point of contact',
    body: 'Me, from first quote to wheels-up.',
  },
  {
    title: 'Empty-leg access',
    body: 'Repositioning flights, when they fit your trip, for less.',
  },
  {
    title: 'Personal service',
    body: 'Arranged quietly and handled on your schedule.',
  },
];

export default function WhatsInside() {
  return (
    <section id="whats-inside" className="bg-cloud py-20 sm:py-24">
      <div className="container-page">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky">
            Why book with Liam
          </p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            What you get
          </h2>
          <p className="mt-3 text-lg text-mist">
            One person to source the aircraft, vet the operator, and arrange every
            detail.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <div
              key={item.title}
              className="rounded-card border border-sky-soft/60 bg-white p-6 shadow-card"
            >
              <span className="font-display text-sm font-semibold text-sky">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-2 text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-mist">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
