const faqs = [
  {
    q: 'Do you fly the plane yourself?',
    a: 'No — I’m a charter broker. I arrange your flight with vetted, certificated operators who hold the aircraft and operational control. You get my help finding and booking the right one; they fly you.',
  },
  {
    q: 'What does it cost to book through you?',
    a: 'My fee is built into the quote and I show you the breakdown — you get operator-direct pricing, not a marked-up mystery number.',
  },
  {
    q: 'How fast can I get a quote?',
    a: 'Send your route, dates, and passenger count and I’ll come back with real options — usually the same day.',
  },
  {
    q: 'What do you do with my info?',
    a: 'It’s stored securely and never sold. See the privacy policy for the full detail.',
  },
];

export default function Faq() {
  return (
    <section id="faq" className="bg-cloud py-20 sm:py-24">
      <div className="container-page max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky">
          Questions
        </p>
        <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
          Frequently asked
        </h2>

        <dl className="mt-10 divide-y divide-sky-soft">
          {faqs.map((item) => (
            <div key={item.q} className="py-5">
              <dt className="font-display text-lg font-semibold text-ink">
                {item.q}
              </dt>
              <dd className="mt-2 leading-relaxed text-mist">
                {item.q === 'What do you do with my info?' ? (
                  <>
                    It&apos;s stored securely and never sold. See the{' '}
                    <a href="/privacy" className="text-sky underline">
                      privacy policy
                    </a>{' '}
                    for the full detail.
                  </>
                ) : (
                  item.a
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
