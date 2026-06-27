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
              I started CharterWithLiam to make chartering simple and honest. My
              team and I source the aircraft, vet the operator, and arrange the
              flight, so you have one team in your corner, and a price with
              nothing hidden.
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
