/**
 * generate-guide.ts
 *
 * Renders the CharterWithLiam Buyer's Guide as a styled HTML string and
 * exports it to a branded A4 PDF using Puppeteer.
 *
 * Run:
 *   npx ts-node --project tsconfig.json scripts/generate-guide.ts
 *
 * Output:
 *   public/charter-buyers-guide.pdf
 */

import { writeFileSync, mkdirSync, statSync } from 'fs';
import { dirname, join } from 'path';
import puppeteer from 'puppeteer';

// ---------------------------------------------------------------------------
// Brand tokens
// ---------------------------------------------------------------------------

const brand = {
  ink: '#0A1A2F', // page background
  navy: '#12304F', // raised surfaces
  accent: '#2E8BFF',
  text: '#F7FAFC',
  muted: '#8FA3B8',
  success: '#1FA971',
  danger: '#E5484D',
  border: 'rgba(46, 139, 255, 0.28)',
};

// ---------------------------------------------------------------------------
// Small content helpers
// ---------------------------------------------------------------------------

/** A green-flag / red-flag callout card. */
function callout(kind: 'green' | 'red', title: string, body: string): string {
  const accent = kind === 'green' ? brand.success : brand.danger;
  const label = kind === 'green' ? 'Green flag' : 'Red flag';
  const mark = kind === 'green' ? '✓' : '✕';
  return `
    <div class="callout" style="border-color:${accent};">
      <div class="callout-label" style="color:${accent};">
        <span class="callout-mark" style="border-color:${accent};color:${accent};">${mark}</span>
        ${label}
      </div>
      <p class="callout-title">${title}</p>
      <p class="callout-body">${body}</p>
    </div>`;
}

/** A non-breaking content section with a numbered eyebrow + heading. */
function section(num: string, eyebrow: string, title: string, inner: string): string {
  return `
    <section class="guide-section">
      <p class="eyebrow">${eyebrow}</p>
      <h2><span class="section-num">${num}</span>${title}</h2>
      ${inner}
    </section>`;
}

/** A styled checklist item using a unicode ballot box (not an HTML input). */
function checkItem(text: string): string {
  return `<li class="check-item"><span class="check-box">&#9744;</span><span>${text}</span></li>`;
}

// ---------------------------------------------------------------------------
// Guide content
// ---------------------------------------------------------------------------

export function buildHtml(): string {
  const cover = `
    <section class="cover">
      <div class="cover-rule"></div>
      <p class="cover-kicker">Private aviation, decoded</p>
      <h1 class="cover-title">The Charter<br/>Buyer&rsquo;s Guide</h1>
      <p class="cover-subtitle">
        How pricing, safety, and the fine print actually work &mdash; so you
        book private with your eyes open, never overpay, and never get burned.
      </p>
      <p class="cover-byline">By Liam &middot; charterwithliam.com</p>
    </section>`;

  const intro = section(
    '',
    'Start here',
    'Who this is for',
    `
      <p>
        You&rsquo;re thinking about flying private &mdash; maybe for the first
        time, maybe because the last time left a bad taste. You&rsquo;ve seen
        the eye-watering quotes, the suspiciously cheap &ldquo;deals,&rdquo; and
        the wall of jargon between you and a simple yes. This guide cuts through
        all of it.
      </p>
      <p>
        It&rsquo;s for the traveler who wants the real story: what a charter
        actually costs and why, how to read a quote line by line, the safety
        questions that separate true operators from middlemen, and how empty
        legs let you fly for a fraction of retail. No upsell, no fluff &mdash;
        just what an honest broker would tell a friend.
      </p>
      <p class="lead-out">
        Read it once and you&rsquo;ll negotiate like someone who&rsquo;s done
        this a hundred times.
      </p>`
  );

  // --- Section 1: comparison table -----------------------------------------
  const section1 = section(
    '01',
    'The landscape',
    'The three ways to fly private',
    `
      <p>
        Almost every private flight is bought one of three ways. They differ in
        commitment, cost structure, and who carries the risk. Match the model to
        how you actually travel &mdash; not to how often you imagine you will.
      </p>
      <table class="compare">
        <thead>
          <tr>
            <th>&nbsp;</th>
            <th>On-demand charter</th>
            <th>Jet card</th>
            <th>Fractional</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="row-head">How it works</td>
            <td>Book a single trip on whatever aircraft is available.</td>
            <td>Prepay for a block of hours at a fixed hourly rate.</td>
            <td>Buy a share of a specific aircraft; fly a set number of hours.</td>
          </tr>
          <tr>
            <td class="row-head">Upfront cost</td>
            <td>None &mdash; pay per trip.</td>
            <td>$100k&ndash;$500k deposit, typical.</td>
            <td>$400k&ndash;$2M+ to buy in, plus monthly fees.</td>
          </tr>
          <tr>
            <td class="row-head">Best for</td>
            <td>A few trips a year, flexible routes.</td>
            <td>25&ndash;50+ hours a year, want price certainty.</td>
            <td>200+ hours a year, want guaranteed availability.</td>
          </tr>
          <tr>
            <td class="row-head">Price per hour</td>
            <td>Lowest sticker, varies by trip.</td>
            <td>Fixed, with a premium baked in.</td>
            <td>Highest all-in, but most predictable.</td>
          </tr>
          <tr>
            <td class="row-head">The catch</td>
            <td>Price and aircraft change every time.</td>
            <td>Premium for convenience; watch the fine print.</td>
            <td>Large capital tied up; depreciation is yours.</td>
          </tr>
        </tbody>
      </table>
      <p class="aside">
        <strong>The honest default:</strong> if you fly fewer than ~25 hours a
        year, on-demand charter almost always wins. Cards and fractional sell
        convenience and certainty &mdash; you pay for both whether you use them
        or not.
      </p>`
  );

  // --- Section 2: what drives price ----------------------------------------
  const section2 = section(
    '02',
    'The economics',
    'What actually drives the price',
    `
      <p>
        A charter quote isn&rsquo;t pulled from the air. It&rsquo;s built from a
        handful of cost levers. Understand them and you can predict a fair
        number before anyone sends you one.
      </p>
      <ul class="bullets">
        <li><strong>Aircraft category.</strong> Turboprop &rarr; light &rarr; midsize &rarr; super-mid &rarr; heavy &rarr; ultra-long-range. Each step up roughly doubles the hourly burn.</li>
        <li><strong>Flight time, not distance.</strong> You pay for hours in the air. Headwinds, routing, and fuel stops all add billable time.</li>
        <li><strong>Repositioning.</strong> If the jet isn&rsquo;t based where you depart, you pay for it to fly to you &mdash; empty &mdash; and often to fly home.</li>
        <li><strong>Daily minimums.</strong> Most operators bill a minimum of 1&ndash;2 hours per day, so a 30-minute hop still costs an hour-plus.</li>
        <li><strong>Crew &amp; overnights.</strong> Multi-day trips mean crew hotels, per diems, and duty-time limits that can force a second crew.</li>
        <li><strong>Peak days &amp; short notice.</strong> Holidays, big events, and sub-48-hour bookings command surcharges. Supply is finite.</li>
        <li><strong>Airport fees.</strong> Landing, ramp, and de-icing fees vary wildly. Teterboro and Aspen are not Toledo.</li>
      </ul>
      ${callout(
        'green',
        'You can lower the number',
        'Flexible dates, a round trip that keeps the jet with you (avoiding two repositioning legs), and departing from a field where aircraft are already based all push the quote down. Ask for them.'
      )}`
  );

  // --- Section 3: how to read a quote --------------------------------------
  const section3 = section(
    '03',
    'The paperwork',
    'How to read a quote',
    `
      <p>
        A clean quote tells you exactly what you&rsquo;re buying. A murky one
        hides the markup. Here&rsquo;s what each line means and where surprises
        like to hide.
      </p>
      <ul class="bullets">
        <li><strong>Aircraft &amp; tail number.</strong> A real quote names the specific aircraft or at least the exact make/model &mdash; not just &ldquo;midsize jet, or similar.&rdquo;</li>
        <li><strong>Occupied vs. total flight time.</strong> Confirm whether repositioning legs are itemized or folded into one number.</li>
        <li><strong>Federal Excise Tax (FET).</strong> 7.5% on domestic charter. If it&rsquo;s missing, ask &mdash; it&rsquo;s not optional, just sometimes hidden until invoicing.</li>
        <li><strong>Fuel surcharge.</strong> Should be a line, not a moving target. Ask if it&rsquo;s capped.</li>
        <li><strong>Landing, handling &amp; segment fees.</strong> Small individually, meaningful together. They should be listed, not &ldquo;TBD.&rdquo;</li>
        <li><strong>Catering &amp; ground transport.</strong> Often pass-through. Know what&rsquo;s included before you assume it is.</li>
        <li><strong>Cancellation terms.</strong> The single most important paragraph. Read it before you read the price.</li>
      </ul>
      ${callout(
        'red',
        '&ldquo;All-in&rdquo; that isn&rsquo;t',
        'If a broker quotes one flat number with no breakdown and waves off itemization, slow down. You can&rsquo;t verify what you can&rsquo;t see &mdash; and you can&rsquo;t negotiate it either.'
      )}`
  );

  // --- Section 4: safety questions -----------------------------------------
  const section4 = section(
    '04',
    'Non-negotiables',
    'The safety questions that matter',
    `
      <p>
        Most people booking private have no idea whether they&rsquo;re talking
        to the operator who holds the certificate or a broker three steps
        removed. These questions cut straight to it.
      </p>
      <ul class="bullets">
        <li><strong>&ldquo;Who holds the operating certificate for this flight?&rdquo;</strong> You want the Part 135 operator&rsquo;s name &mdash; the entity legally responsible for the flight.</li>
        <li><strong>&ldquo;Is this aircraft on that operator&rsquo;s certificate?&rdquo;</strong> Brokering a jet that isn&rsquo;t is a major red flag.</li>
        <li><strong>&ldquo;What&rsquo;s your safety rating?&rdquo;</strong> ARGUS, Wyvern, or IS-BAO are the recognized third-party audits. Ask for the current tier.</li>
        <li><strong>&ldquo;What are the pilots&rsquo; hours and currency?&rdquo;</strong> Two qualified, type-current pilots &mdash; not one, not a contractor flying an unfamiliar type.</li>
        <li><strong>&ldquo;Is there insurance, and what&rsquo;s the liability limit?&rdquo;</strong> You can ask to be named as an additional insured.</li>
      </ul>
      ${callout(
        'green',
        'A good operator answers instantly',
        'Certificate holder, safety rating, insurance limits &mdash; a legitimate operator has these at their fingertips and shares them without friction. Hesitation or deflection is your answer.'
      )}`
  );

  // --- Section 5: empty legs -----------------------------------------------
  const section5 = section(
    '05',
    'The discount',
    'How empty legs work',
    `
      <p>
        When a jet flies one way for a client, it often has to return &mdash; or
        reposition to its next trip &mdash; empty. The operator is paying for
        that flight regardless, so any revenue beats none. That&rsquo;s why
        empty legs sell for up to 75% off retail.
      </p>
      <ul class="bullets">
        <li><strong>The trade-off is flexibility.</strong> Empty legs run on the jet&rsquo;s schedule, not yours. The closer you can flex on date, time, and exact airport, the more deals open up.</li>
        <li><strong>They&rsquo;re perishable.</strong> A leg exists only until the aircraft moves. Many surface 24&ndash;72 hours out and vanish fast.</li>
        <li><strong>They can change or cancel.</strong> If the original paying trip moves, the empty leg moves with it. Have a backup plan for anything truly time-critical.</li>
        <li><strong>Routes matter.</strong> Busy corridors &mdash; LA&ndash;Vegas, South Florida&ndash;Northeast, NY&ndash;Florida &mdash; generate the most empty legs.</li>
      </ul>
      ${callout(
        'green',
        'How to actually catch them',
        'Tell a broker your home airports and the routes you fly, then let them filter the firehose for you. Matched alerts beat refreshing a public empty-leg page every morning &mdash; the good ones are gone before they&rsquo;re ever posted.'
      )}`
  );

  // --- Section 6: pre-booking checklist (styled checkboxes) -----------------
  const checklist = [
    'Confirmed the Part 135 operator who holds the certificate for the flight.',
    'Verified the aircraft is on that operator&rsquo;s certificate.',
    'Asked for the safety rating (ARGUS / Wyvern / IS-BAO).',
    'Got an itemized quote &mdash; flight time, FET, fuel, fees all listed.',
    'Confirmed whether repositioning legs are included in the price.',
    'Read the cancellation and change terms in full.',
    'Checked what&rsquo;s included: catering, ground transport, Wi-Fi, de-icing.',
    'Confirmed pilot count, type-currency, and insurance limits.',
    'Asked about flexible dates or a round trip to lower the cost.',
    'Have the operator&rsquo;s direct contact for the day of travel.',
  ];
  const section6 = section(
    '06',
    'Before you wire a deposit',
    'The pre-booking checklist',
    `
      <p>
        One page to run through before money changes hands. If you can&rsquo;t
        tick all ten, you have a question to ask &mdash; not a deposit to send.
      </p>
      <ul class="checklist">
        ${checklist.map(checkItem).join('\n        ')}
      </ul>`
  );

  // --- Final CTA -----------------------------------------------------------
  const cta = `
    <section class="cta">
      <div class="cta-card">
        <p class="cta-kicker">Your move</p>
        <h2 class="cta-title">Have a trip in mind?</h2>
        <p class="cta-body">
          Send your route and dates and I&rsquo;ll find the right flight at the
          right price &mdash; and flag the empty legs that match before they
          disappear.
        </p>
        <p class="cta-url">charterwithliam.com</p>
      </div>
    </section>`;

  // --- Page shell ----------------------------------------------------------
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>The Charter Buyer's Guide</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Inter:wght@400;500;600;700&display=swap');

  * { box-sizing: border-box; }

  html, body {
    margin: 0;
    padding: 0;
    background: ${brand.ink};
    color: ${brand.text};
    font-family: 'Inter', system-ui, sans-serif;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  /* Wordmark, top-left of every page, via running header in @page margin box
     is not reliable cross-engine, so we anchor it on the cover and rely on the
     footer template (added by Puppeteer) for per-page chrome. */

  .wordmark {
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 700;
    font-size: 14px;
    letter-spacing: 0.01em;
    color: ${brand.accent};
  }

  h1, h2, h3 {
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 700;
    line-height: 1.1;
    margin: 0;
  }

  p { margin: 0 0 18px; line-height: 1.85; font-size: 12.5px; color: ${brand.text}; }
  strong { color: ${brand.text}; font-weight: 600; }

  /* ----- Sections: never break mid-section ----- */
  .guide-section {
    break-inside: avoid;
    page-break-inside: avoid;
    padding: 16px 0 34px;
    border-top: 1px solid ${brand.border};
    margin-top: 44px;
  }
  .guide-section:first-of-type { border-top: none; }

  .eyebrow {
    font-family: 'Space Grotesk', sans-serif;
    text-transform: uppercase;
    letter-spacing: 0.24em;
    font-size: 9.5px;
    font-weight: 500;
    color: ${brand.accent};
    margin: 0 0 14px;
  }

  h2 {
    font-size: 25px;
    margin-bottom: 22px;
    display: flex;
    align-items: baseline;
    gap: 14px;
  }
  .section-num {
    color: ${brand.accent};
    font-size: 16px;
    font-weight: 500;
    font-variant-numeric: tabular-nums;
  }

  .lead-out { color: ${brand.muted}; font-style: italic; }
  .aside {
    color: ${brand.muted};
    font-size: 11.5px;
    line-height: 1.7;
    border-left: 2px solid ${brand.accent};
    padding-left: 18px;
    margin-top: 14px;
  }
  .aside strong { color: ${brand.text}; }

  /* ----- Cover ----- */
  .cover {
    height: 980px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    break-after: page;
    page-break-after: always;
    position: relative;
    background:
      radial-gradient(900px 520px at 85% -8%, rgba(46,139,255,0.30), transparent 60%),
      radial-gradient(700px 460px at 5% 108%, rgba(46,139,255,0.12), transparent 60%);
  }
  .cover-rule { width: 56px; height: 4px; background: ${brand.accent}; border-radius: 2px; margin-bottom: 36px; }
  .cover-kicker {
    font-family: 'Space Grotesk', sans-serif;
    text-transform: uppercase;
    letter-spacing: 0.28em;
    font-size: 11px;
    font-weight: 500;
    color: ${brand.accent};
    margin: 0 0 28px;
  }
  .cover-title {
    font-size: 58px;
    line-height: 1.05;
    letter-spacing: -0.01em;
    margin: 0 0 34px;
  }
  .cover-subtitle {
    font-size: 16px;
    line-height: 1.7;
    color: ${brand.muted};
    max-width: 460px;
    margin: 0 0 52px;
  }
  .cover-byline {
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 500;
    font-size: 13px;
    color: ${brand.text};
    margin: 0;
  }
  .cover-byline::before {
    content: '';
    display: block;
    width: 200px;
    height: 1px;
    background: ${brand.border};
    margin-bottom: 20px;
  }

  /* ----- Comparison table ----- */
  table.compare {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    margin: 10px 0 26px;
    font-size: 11px;
    border: 1px solid ${brand.accent};
    border-radius: 12px;
    overflow: hidden;
  }
  table.compare th, table.compare td {
    text-align: left;
    padding: 15px 17px;
    line-height: 1.55;
    vertical-align: top;
    border-bottom: 1px solid ${brand.border};
    border-right: 1px solid ${brand.border};
  }
  table.compare th:last-child, table.compare td:last-child { border-right: none; }
  table.compare tbody tr:last-child td { border-bottom: none; }
  table.compare thead th {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 11.5px;
    font-weight: 700;
    color: ${brand.text};
    background: ${brand.accent}26;
    border-bottom: 1px solid ${brand.accent};
  }
  table.compare tbody tr:nth-child(odd) td { background: rgba(255,255,255,0.02); }
  table.compare tbody tr:nth-child(even) td { background: rgba(18,48,79,0.45); }
  td.row-head {
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 600;
    color: ${brand.accent};
    background: rgba(46,139,255,0.10) !important;
    white-space: nowrap;
  }

  /* ----- Bullet lists ----- */
  ul.bullets { list-style: none; margin: 10px 0 22px; padding: 0; }
  ul.bullets li {
    position: relative;
    padding-left: 26px;
    margin-bottom: 14px;
    font-size: 12.5px;
    line-height: 1.7;
    color: ${brand.text};
  }
  ul.bullets li::before {
    content: '';
    position: absolute;
    left: 2px;
    top: 9px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${brand.accent};
  }

  /* ----- Callout cards ----- */
  .callout {
    break-inside: avoid;
    border: 1px solid;
    border-left-width: 4px;
    border-radius: 12px;
    padding: 20px 24px;
    margin: 14px 0 6px;
    background: rgba(18,48,79,0.40);
  }
  .callout-label {
    font-family: 'Space Grotesk', sans-serif;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    font-size: 9.5px;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 9px;
    margin-bottom: 10px;
  }
  .callout-mark {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    border: 1px solid;
    border-radius: 50%;
    font-size: 10px;
    line-height: 1;
  }
  .callout-title {
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 600;
    font-size: 13px;
    margin: 0 0 7px;
    color: ${brand.text};
  }
  .callout-body { margin: 0; font-size: 11.5px; color: ${brand.muted}; line-height: 1.7; }

  /* ----- Checklist ----- */
  ul.checklist { list-style: none; margin: 12px 0 0; padding: 0; }
  li.check-item {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    padding: 16px 20px;
    margin-bottom: 11px;
    background: rgba(18,48,79,0.45);
    border: 1px solid ${brand.border};
    border-radius: 10px;
    font-size: 12.5px;
    line-height: 1.55;
    break-inside: avoid;
  }
  .check-box {
    color: ${brand.accent};
    font-size: 18px;
    line-height: 1;
    flex-shrink: 0;
    margin-top: -1px;
  }

  /* ----- Final CTA ----- */
  .cta { break-inside: avoid; padding-top: 30px; }
  .cta-card {
    border: 1px solid ${brand.accent};
    border-radius: 16px;
    padding: 52px 44px;
    text-align: center;
    background:
      radial-gradient(600px 300px at 50% -40%, rgba(46,139,255,0.28), transparent 70%),
      rgba(18,48,79,0.55);
  }
  .cta-kicker {
    font-family: 'Space Grotesk', sans-serif;
    text-transform: uppercase;
    letter-spacing: 0.24em;
    font-size: 10px;
    font-weight: 500;
    color: ${brand.accent};
    margin: 0 0 12px;
  }
  .cta-title { font-size: 30px; margin: 0 0 18px; }
  .cta-body { color: ${brand.muted}; max-width: 420px; margin: 0 auto 26px; font-size: 13px; line-height: 1.7; }
  .cta-url {
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 700;
    font-size: 20px;
    color: ${brand.accent};
    margin: 0;
  }

  /* Body content gets the wordmark anchored at the top of the flow page. */
  .body-wordmark { margin-bottom: 28px; }
</style>
</head>
<body>
  ${cover}
  <div class="body-wordmark wordmark">CharterWithLiam</div>
  ${intro}
  ${section1}
  ${section2}
  ${section3}
  ${section4}
  ${section5}
  ${section6}
  ${cta}
</body>
</html>`;
}

// ---------------------------------------------------------------------------
// Footer template (rendered by Puppeteer in the bottom page margin)
// ---------------------------------------------------------------------------

const footerTemplate = `
  <div style="
    width: 100%;
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 8px;
    color: ${brand.muted};
    padding: 0 48px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    -webkit-print-color-adjust: exact;
  ">
    <span>CharterWithLiam &mdash; private aviation, decoded</span>
    <span>Page <span class="pageNumber"></span> / <span class="totalPages"></span></span>
  </div>`;

// A near-empty header keeps Puppeteer from injecting its default date/title.
const headerTemplate = `<div style="font-size:0; padding:0; margin:0;"></div>`;

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const outPath = join(process.cwd(), 'public', 'charter-buyers-guide.pdf');
  mkdirSync(dirname(outPath), { recursive: true });

  const html = buildHtml();

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    // Load the HTML and wait for the Google Fonts @import to resolve so the
    // PDF renders with Space Grotesk / Inter rather than fallback fonts.
    await page.setContent(html, { waitUntil: 'load' });
    try {
      await page.evaluateHandle('document.fonts.ready');
    } catch {
      /* document.fonts may be unavailable in some environments; ignore. */
    }

    const pdf = await page.pdf({
      path: outPath,
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate,
      footerTemplate,
      margin: {
        top: '64px',
        bottom: '64px',
        left: '72px',
        right: '72px',
      },
    });

    // `path` already wrote the file; confirm and report size.
    const { size } = statSync(outPath);
    const kb = (size / 1024).toFixed(1);
    console.log(`✓ Wrote ${outPath}`);
    console.log(`  ${size.toLocaleString()} bytes (${kb} KB), ${pdf.length.toLocaleString()} bytes rendered`);

    if (size < 1024) {
      throw new Error('Output PDF is suspiciously small; render likely failed.');
    }
  } finally {
    await browser.close();
  }
}

// Run only when invoked directly (not when imported, e.g. for testing/preview).
const invokedPath = process.argv[1] ?? '';
if (invokedPath.includes('generate-guide')) {
  main().catch((err) => {
    console.error('Failed to generate guide PDF:', err);
    process.exit(1);
  });
}
