export default function Credibility() {
  return (
    <section id="about" className="bg-white py-20 sm:py-24">
      <div className="container-page">
        <div className="grid items-center gap-10 lg:grid-cols-[260px_1fr] lg:gap-16">
          {/* Headshot placeholder until a real photo is dropped in. */}
          <div className="mx-auto w-full max-w-[260px]">
            <div
              className="aspect-square w-full rounded-2xl border border-sky-soft bg-gradient-to-br from-navy to-ink shadow-card"
              role="img"
              aria-label="Photo of Liam (placeholder)"
            >
              <div className="flex h-full items-center justify-center font-display text-5xl font-bold text-sky-soft/40">
                L
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky">
              Who&apos;s behind this
            </p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Meet Liam</h2>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink/80">
              I work in private aviation, and I started CharterWithLiam to cut
              through the noise. Too many people overpay or get steered into the
              wrong aircraft because no one explained how this world really works.
              The guide is the conversation I&apos;d have with a friend before they
              booked their first flight.
            </p>

            {/* Social proof row — placeholder until live counts / press exist. */}
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4 text-sm text-mist">
              <span className="font-medium">As featured across</span>
              <span className="font-display font-semibold text-ink">Instagram</span>
              <span className="font-display font-semibold text-ink">TikTok</span>
              <span className="font-display font-semibold text-ink">YouTube</span>
              <span className="font-display font-semibold text-ink">LinkedIn</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
