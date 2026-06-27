const items = [
  {
    title: 'The right aircraft',
    body: 'Matched to your route, passengers, and budget — not whatever pays the broker the most.',
  },
  {
    title: 'Honest pricing',
    body: 'An itemized quote with the markup shown. No mystery fees, no surprise invoice.',
  },
  {
    title: 'Safety-vetted operators',
    body: 'Every flight flown by certificated operators with the safety record to back it up.',
  },
  {
    title: 'One point of contact',
    body: 'Me, from first quote to wheels-up — and reachable the moment plans change.',
  },
  {
    title: 'Empty-leg savings',
    body: 'When a repositioning flight fits your trip, you fly for up to 75% less.',
  },
  {
    title: 'No pressure',
    body: "Straight answers and real options. Book when it's right for you — or don't.",
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
            What you get when you charter with me
          </h2>
          <p className="mt-3 text-lg text-mist">
            Not a markup-hungry middleman — one person who sources the aircraft,
            vets the operator, and actually answers the phone.
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
