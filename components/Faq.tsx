const faqs = [
  {
    q: 'Is this really free?',
    a: 'Yes. The Charter Buyer’s Guide is free, and the empty-leg alerts are free too. No catch.',
  },
  {
    q: 'Will you spam me?',
    a: 'No. The guide, then the occasional deal or useful note — that’s it. Unsubscribe anytime in one click.',
  },
  {
    q: 'What do you do with my info?',
    a: 'It’s stored securely and never sold. See the privacy policy for the full detail.',
  },
  {
    q: 'Can you help me book a specific trip?',
    a: 'Yes — reply to any email with your route and dates, and I’ll help you find the right flight.',
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
