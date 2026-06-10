const items = [
  {
    title: 'The three ways to fly private',
    body: 'On-demand charter, jet cards, fractional — and which actually fits how you travel.',
  },
  {
    title: 'What drives the price',
    body: 'The real cost levers behind a charter quote — and the ones that bring it down.',
  },
  {
    title: 'How to read a quote',
    body: 'Decode the line items so the final invoice never surprises you.',
  },
  {
    title: 'The safety questions that matter',
    body: 'The questions that separate true operators from middlemen brokering your flight.',
  },
  {
    title: 'How empty legs work',
    body: 'Why repositioning flights go cheap — and how to fly for up to 75% off.',
  },
  {
    title: 'A pre-booking checklist',
    body: 'One page to run through before you ever put down a deposit.',
  },
];

export default function WhatsInside() {
  return (
    <section id="whats-inside" className="bg-cloud py-20 sm:py-24">
      <div className="container-page">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky">
            The lead magnet
          </p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            What&apos;s in the guide
          </h2>
          <p className="mt-3 text-lg text-mist">
            Everything a first-time (or burned-once) private flyer wishes they
            knew before booking.
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
