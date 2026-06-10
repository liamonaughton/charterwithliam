/**
 * generate-guide.ts
 *
 * Renders the CharterWithLiam Buyer's Guide as a styled HTML string and
 * exports it to a PDF using Puppeteer.
 *
 * Editorial direction: reads like a Harvard Business Review briefing
 * (analytical prose, deks, labeled exhibits) and looks like a commercial
 * real-estate offering memorandum (ivory paper, navy + bronze, refined
 * serif headlines, data exhibits, metric tiles).
 *
 * Run:
 *   npx ts-node --project tsconfig.json scripts/generate-guide.ts
 *
 * Output:
 *   public/charter-buyers-guide.pdf
 */

import { mkdirSync, statSync } from 'fs';
import { dirname, join } from 'path';
import puppeteer from 'puppeteer';

// ---------------------------------------------------------------------------
// Palette — institutional / offering-memorandum
// ---------------------------------------------------------------------------

const brand = {
  ink: '#0A1A2F', // primary text / navy (brand)
  paper: '#F5F2EA', // page background — warm ivory
  surface: '#FCFAF4', // cards / exhibit panels
  bronze: '#9C7C4A', // institutional accent
  bronzeSoft: '#C7B187', // light bronze for rules/strokes
  slate: '#5C6875', // muted secondary text
  hair: '#E3DBCC', // hairline rules
  positive: '#4E7A5C', // muted forest — advantage notes
  caution: '#A85A4A', // muted terracotta — caution notes
};

// ---------------------------------------------------------------------------
// Content helpers
// ---------------------------------------------------------------------------

/** A numbered, deck-led section that never breaks mid-block. */
function section(num: string, eyebrow: string, title: string, dek: string, inner: string): string {
  return `
    <section class="sec">
      <p class="eyebrow">${eyebrow}</p>
      <h2 class="sec-title"><span class="sec-num">${num}</span>${title}</h2>
      <p class="dek">${dek}</p>
      ${inner}
    </section>`;
}

/** A metric tile for the "by the numbers" strip. */
function statTile(value: string, label: string): string {
  return `
    <div class="stat">
      <div class="stat-value">${value}</div>
      <div class="stat-label">${label}</div>
    </div>`;
}

/** An institutional advisory note (advantage / caution), bordered card. */
function advisory(kind: 'advantage' | 'caution', title: string, body: string): string {
  const color = kind === 'advantage' ? brand.positive : brand.caution;
  const label = kind === 'advantage' ? 'Advantage' : 'Caution';
  return `
    <div class="advisory" style="border-left-color:${color};">
      <p class="advisory-label" style="color:${color};">${label}</p>
      <p class="advisory-title">${title}</p>
      <p class="advisory-body">${body}</p>
    </div>`;
}

/** A due-diligence checklist item using a unicode ballot box (not an input). */
function checkItem(text: string): string {
  return `<li class="check-item"><span class="check-box">&#9744;</span><span>${text}</span></li>`;
}

// ---------------------------------------------------------------------------
// Guide content
// ---------------------------------------------------------------------------

export function buildHtml(): string {
  // --- Cover — title page of an offering memorandum -------------------------
  const cover = `
    <section class="cover">
      <div class="cover-mid">
        <div class="cover-rule"></div>
        <p class="cover-eyebrow">Buyer&rsquo;s Briefing &middot; 2026</p>
        <h1 class="cover-title">The Charter<br/>Buyer&rsquo;s Guide</h1>
        <p class="cover-dek">
          A decision framework for buying private aviation &mdash; pricing,
          safety, and the contract terms that matter &mdash; decomposed for the
          first-time flyer and the once-burned.
        </p>
      </div>

      <div class="cover-bottom">
        <div class="cover-meta">
          <span class="cover-meta-label">Prepared by</span>
          <span class="cover-meta-value">Liam &middot; charterwithliam.com</span>
        </div>
        <div class="cover-meta">
          <span class="cover-meta-label">Classification</span>
          <span class="cover-meta-value">Buyer Education</span>
        </div>
        <div class="cover-meta">
          <span class="cover-meta-label">Scope</span>
          <span class="cover-meta-value">On-Demand Charter</span>
        </div>
      </div>
    </section>`;

  // --- Executive summary + key metrics (HBR "Idea in Brief") ----------------
  const exec = `
    <section class="exec">
      <p class="eyebrow">Executive Summary</p>
      <p class="exec-lead">
        Private aviation is sold through a fog of jargon, opaque quotes, and
        offers that are too good to be true. This briefing clears it. It frames
        the three ways private flights are purchased and when each pays off,
        decomposes a charter quote into the cost drivers underneath it, and
        supplies the safety and contract questions that separate certificated
        operators from middlemen. Read it once and you will evaluate any quote
        with the discipline of a seasoned buyer.
      </p>
      <div class="metrics">
        ${statTile('Three', 'Ways to fly private')}
        ${statTile('Up to 75%', 'Empty-leg discount vs. retail')}
        ${statTile('7.5%', 'Federal excise tax on charter')}
        ${statTile('&lt; 25 hrs', 'Annual threshold favoring on-demand')}
      </div>
    </section>`;

  const intro = section(
    '00',
    'Orientation',
    'Who this is for',
    `This is for the traveler who wants the real economics &mdash; not the brochure.`,
    `
      <p>
        You are weighing a private flight &mdash; perhaps for the first time,
        perhaps because the last one left a bad taste. You have seen the
        eye-watering quotes, the suspiciously cheap &ldquo;deals,&rdquo; and the
        wall of terminology standing between you and a simple yes. This briefing
        is written to dismantle that wall.
      </p>
      <p>
        What follows is the analysis an honest advisor would give a friend: what
        a charter actually costs and why, how to read a quote line by line, the
        questions that distinguish accredited operators from brokers reselling
        your flight, and how repositioning &mdash; empty legs &mdash; lets a
        flexible buyer fly at a fraction of retail. No upsell. Just the structure
        beneath the price.
      </p>`
  );

  // --- 01 — comparison exhibit ---------------------------------------------
  const section1 = section(
    '01',
    'The Landscape',
    'The three ways to fly private',
    `Nearly every private flight is bought through one of three models. The disciplined choice follows from how many hours you actually fly in a year &mdash; not from how often you imagine you will.`,
    `
      <p>
        The models differ in capital commitment, cost structure, and who carries
        the risk of an under-used asset. On-demand charter pushes that risk onto
        the operator; jet cards and fractional shift convenience and guaranteed
        access onto your balance sheet &mdash; at a premium you pay whether or not
        you draw on it.
      </p>
      <p class="exhibit-cap"><span class="exhibit-tag">Exhibit 1</span>The three purchasing models, compared</p>
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
            <td class="row-head">Structure</td>
            <td>Book a single trip on whatever aircraft is available.</td>
            <td>Prepay for a block of hours at a fixed hourly rate.</td>
            <td>Purchase a share of a specific aircraft; fly a set allotment.</td>
          </tr>
          <tr>
            <td class="row-head">Capital upfront</td>
            <td>None &mdash; pay per trip.</td>
            <td>$100K&ndash;$500K deposit, typical.</td>
            <td>$400K&ndash;$2M+ buy-in, plus monthly fees.</td>
          </tr>
          <tr>
            <td class="row-head">Best fit</td>
            <td>A handful of trips a year; flexible routing.</td>
            <td>25&ndash;50+ hours a year; want price certainty.</td>
            <td>200+ hours a year; want guaranteed availability.</td>
          </tr>
          <tr>
            <td class="row-head">Hourly economics</td>
            <td>Lowest sticker; varies trip to trip.</td>
            <td>Fixed, with a convenience premium embedded.</td>
            <td>Highest all-in, but the most predictable.</td>
          </tr>
          <tr>
            <td class="row-head">The trade-off</td>
            <td>Price and aircraft change every time.</td>
            <td>You pay for access you may not use.</td>
            <td>Capital tied up; depreciation is yours.</td>
          </tr>
        </tbody>
      </table>
      ${advisory(
        'advantage',
        'The honest default',
        'Below roughly 25 hours a year, on-demand charter almost always wins. Cards and fractional programs monetize certainty and convenience &mdash; charges you absorb in full whether or not you ever call on them.'
      )}`
  );

  // --- 02 — cost drivers ----------------------------------------------------
  const section2 = section(
    '02',
    'The Economics',
    'What actually drives the price',
    `A charter quote is not a figure handed down from the cockpit. It is the sum of a few cost levers &mdash; identify them and a fair price becomes predictable.`,
    `
      <p>
        Decompose the quote and you can estimate a fair number before a broker
        ever sends one. Seven levers do most of the work:
      </p>
      <ul class="bullets">
        <li><strong>Aircraft category.</strong> Turboprop &rarr; light &rarr; midsize &rarr; super-mid &rarr; heavy &rarr; ultra-long-range. Each step up roughly doubles the hourly burn.</li>
        <li><strong>Flight time, not distance.</strong> You pay for hours aloft. Headwinds, routing, and fuel stops all add billable time.</li>
        <li><strong>Repositioning.</strong> If the aircraft is not based where you depart, you fund its flight to you &mdash; empty &mdash; and often its flight home.</li>
        <li><strong>Daily minimums.</strong> Most operators bill a 1&ndash;2 hour minimum per day, so a 30-minute hop still costs an hour or more.</li>
        <li><strong>Crew and overnights.</strong> Multi-day trips carry crew hotels, per diems, and duty-time limits that can force a second crew.</li>
        <li><strong>Peak demand and short notice.</strong> Holidays, marquee events, and sub-48-hour bookings command surcharges against finite supply.</li>
        <li><strong>Airport fees.</strong> Landing, ramp, and de-icing charges vary widely. Teterboro and Aspen are not Toledo.</li>
      </ul>
      ${advisory(
        'advantage',
        'Levers that move in your favor',
        'Flexible dates, a round trip that keeps the aircraft with you (avoiding two repositioning legs), and departing from a field where aircraft are already based all pull the quote down. Ask for them by name.'
      )}`
  );

  // --- 03 — reading a quote -------------------------------------------------
  const section3 = section(
    '03',
    'The Instrument',
    'How to read a quote',
    `A transparent quote itemizes what you are buying. An opaque one folds the markup into a single, unverifiable number. Read the structure before the bottom line.`,
    `
      <p>
        Seven lines carry the substance &mdash; and the surprises:
      </p>
      <ul class="bullets">
        <li><strong>Aircraft and tail number.</strong> A real quote names the specific aircraft, or at minimum the exact make and model &mdash; not &ldquo;midsize jet or similar.&rdquo;</li>
        <li><strong>Occupied vs. total flight time.</strong> Confirm whether repositioning legs are itemized or absorbed into one figure.</li>
        <li><strong>Federal Excise Tax (FET).</strong> 7.5% on domestic charter. If it is absent, ask &mdash; it is not optional, only sometimes deferred to the invoice.</li>
        <li><strong>Fuel surcharge.</strong> A line item, not a moving target. Ask whether it is capped.</li>
        <li><strong>Landing, handling, and segment fees.</strong> Immaterial alone, meaningful together. They should be listed, not marked &ldquo;TBD.&rdquo;</li>
        <li><strong>Catering and ground transport.</strong> Frequently pass-through. Establish what is included before assuming it is.</li>
        <li><strong>Cancellation terms.</strong> The single most consequential paragraph in the document. Read it before you read the price.</li>
      </ul>
      ${advisory(
        'caution',
        'The &ldquo;all-in&rdquo; that isn&rsquo;t',
        'A single flat number with no breakdown &mdash; and a broker who waves off itemization &mdash; is a signal to slow down. What you cannot see, you cannot verify, and cannot negotiate.'
      )}`
  );

  // --- 04 — safety ----------------------------------------------------------
  const section4 = section(
    '04',
    'Due Diligence',
    'The safety questions that matter',
    `Most buyers never establish whether they are speaking with the operator that holds the certificate or a broker several steps removed. Five questions settle it.`,
    `
      <p>
        A certificated operator answers all five without friction. Hesitation or
        deflection is itself the answer.
      </p>
      <ul class="bullets">
        <li><strong>&ldquo;Who holds the operating certificate for this flight?&rdquo;</strong> You want the Part 135 operator&rsquo;s name &mdash; the entity legally accountable for the flight.</li>
        <li><strong>&ldquo;Is this aircraft on that operator&rsquo;s certificate?&rdquo;</strong> Brokering an aircraft that is not is a material red flag.</li>
        <li><strong>&ldquo;What is your third-party safety rating?&rdquo;</strong> ARGUS, Wyvern, and IS-BAO are the recognized audits. Ask for the current tier.</li>
        <li><strong>&ldquo;What are the pilots&rsquo; hours and type currency?&rdquo;</strong> Two qualified, type-current pilots &mdash; not one, and not a contractor flying an unfamiliar aircraft.</li>
        <li><strong>&ldquo;What is the insurance liability limit?&rdquo;</strong> You may ask to be named as an additional insured.</li>
      </ul>
      ${advisory(
        'advantage',
        'What a credible answer sounds like',
        'Certificate holder, safety tier, and insurance limits delivered instantly and in writing. A legitimate operator keeps these at hand and shares them without being pressed.'
      )}`
  );

  // --- 05 — empty legs ------------------------------------------------------
  const section5 = section(
    '05',
    'The Inefficiency',
    'How empty legs work',
    `Repositioning is a structural inefficiency in charter &mdash; and the single largest source of discount available to a flexible buyer.`,
    `
      <p>
        When an aircraft completes a one-way trip, it frequently must reposition
        empty to its next assignment. The operator funds that leg regardless, so
        any revenue improves on none &mdash; which is why empty legs clear at
        discounts of up to 75% against retail. The price of entry is flexibility.
      </p>
      <ul class="bullets">
        <li><strong>They run on the aircraft&rsquo;s schedule.</strong> The more you can flex on date, time, and exact airport, the more legs open up.</li>
        <li><strong>They are perishable.</strong> A leg exists only until the aircraft moves. Many surface 24&ndash;72 hours out and vanish quickly.</li>
        <li><strong>They can change or cancel.</strong> If the originating paid trip moves, the empty leg moves with it. Keep a backup for anything truly time-critical.</li>
        <li><strong>Corridors concentrate supply.</strong> LA&ndash;Vegas, South Florida&ndash;Northeast, and New York&ndash;Florida generate the most repositioning.</li>
      </ul>
      ${advisory(
        'advantage',
        'How to capture them in practice',
        'Give an advisor your home airports and the routes you fly, then let them filter the firehose. Matched alerts outperform refreshing a public empty-leg page &mdash; the best legs are spoken for before they are ever posted.'
      )}`
  );

  // --- 06 — due-diligence checklist ----------------------------------------
  const checklist = [
    'Confirmed the Part 135 operator that holds the certificate for the flight.',
    'Verified the aircraft is on that operator&rsquo;s certificate.',
    'Obtained the third-party safety rating (ARGUS / Wyvern / IS-BAO).',
    'Received an itemized quote &mdash; flight time, FET, fuel, and fees all listed.',
    'Confirmed whether repositioning legs are included in the price.',
    'Read the cancellation and change terms in full.',
    'Established what is included: catering, ground transport, Wi-Fi, de-icing.',
    'Confirmed pilot count, type currency, and insurance limits.',
    'Requested flexible dates or a round trip to reduce cost.',
    'Secured the operator&rsquo;s direct contact for the day of travel.',
  ];
  const section6 = section(
    '06',
    'The Checklist',
    'Pre-booking due diligence',
    `Ten items to clear before capital changes hands. If you cannot tick all ten, you have a question to ask &mdash; not a deposit to send.`,
    `
      <ul class="checklist">
        ${checklist.map(checkItem).join('\n        ')}
      </ul>`
  );

  // --- Closing --------------------------------------------------------------
  const close = `
    <section class="close">
      <div class="close-rule"></div>
      <p class="eyebrow">Engagement</p>
      <h2 class="close-title">Have a trip in mind?</h2>
      <p class="close-body">
        Send your route and dates. I will structure the right flight at the right
        price &mdash; and surface the empty legs that match before they clear.
      </p>
      <p class="close-url">charterwithliam.com</p>
    </section>`;

  // --- Document shell -------------------------------------------------------
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>The Charter Buyer's Guide</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400&family=Inter:wght@400;500;600&display=swap');

  * { box-sizing: border-box; }

  html, body {
    margin: 0;
    padding: 0;
    background: ${brand.paper};
    color: ${brand.ink};
    font-family: 'Newsreader', Georgia, serif;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  /* Page side margins are 0 so the ivory background bleeds to the sheet edge;
     this horizontal padding insets the content, becoming the padding between
     the colored page and the text. Top/bottom strips are filled by the
     Puppeteer header/footer templates so the bleed is continuous. */
  body { padding: 0 78px; }

  /* ----- Typographic primitives ----- */
  h1, h2 { font-family: 'Newsreader', Georgia, serif; font-weight: 500; margin: 0; line-height: 1.12; }

  p {
    margin: 0 0 16px;
    font-size: 12.5px;
    line-height: 1.78;
    color: ${brand.ink};
  }
  strong { font-weight: 600; }

  .eyebrow {
    font-family: 'Inter', system-ui, sans-serif;
    text-transform: uppercase;
    letter-spacing: 0.26em;
    font-size: 9px;
    font-weight: 600;
    color: ${brand.bronze};
    margin: 0 0 12px;
  }

  /* ===================== COVER ===================== */
  .cover {
    height: 974px;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    break-after: page;
    page-break-after: always;
  }
  .cover-mid { padding: 40px 0; }
  .cover-rule { width: 64px; height: 2px; background: ${brand.bronze}; margin-bottom: 34px; }
  .cover-eyebrow {
    font-family: 'Inter', system-ui, sans-serif;
    text-transform: uppercase;
    letter-spacing: 0.28em;
    font-size: 10px;
    font-weight: 600;
    color: ${brand.bronze};
    margin: 0 0 26px;
  }
  .cover-title {
    font-size: 62px;
    font-weight: 500;
    line-height: 1.04;
    letter-spacing: -0.015em;
    margin: 0 0 32px;
  }
  .cover-dek {
    font-size: 16.5px;
    line-height: 1.62;
    color: ${brand.slate};
    max-width: 470px;
    margin: 0;
  }
  .cover-bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    gap: 48px;
    padding-top: 22px;
    border-top: 1px solid ${brand.hair};
  }
  .cover-meta { display: flex; flex-direction: column; gap: 5px; }
  .cover-meta-label {
    font-family: 'Inter', system-ui, sans-serif;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    font-size: 8px;
    font-weight: 600;
    color: ${brand.bronze};
  }
  .cover-meta-value { font-size: 12px; color: ${brand.ink}; }

  /* ===================== EXECUTIVE SUMMARY ===================== */
  .exec {
    break-inside: avoid;
    padding: 8px 0 6px;
  }
  .exec-lead {
    font-size: 14.5px;
    line-height: 1.7;
    color: ${brand.ink};
    margin: 0 0 30px;
  }
  .metrics {
    display: flex;
    border: 1px solid ${brand.hair};
    border-radius: 4px;
    background: ${brand.surface};
    overflow: hidden;
  }
  .stat {
    flex: 1;
    padding: 20px 22px;
    border-right: 1px solid ${brand.hair};
  }
  .stat:last-child { border-right: none; }
  .stat-value {
    font-family: 'Newsreader', Georgia, serif;
    font-size: 28px;
    font-weight: 500;
    color: ${brand.bronze};
    line-height: 1;
    margin-bottom: 10px;
  }
  .stat-label {
    font-family: 'Inter', system-ui, sans-serif;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    font-size: 8px;
    font-weight: 500;
    line-height: 1.5;
    color: ${brand.slate};
  }

  /* ===================== SECTIONS ===================== */
  .sec {
    break-inside: avoid;
    page-break-inside: avoid;
    padding: 30px 0 10px;
    margin-top: 36px;
    border-top: 1px solid ${brand.hair};
  }
  .sec .eyebrow { margin-bottom: 10px; }
  .sec h2.sec-title {
    font-size: 27px;
    letter-spacing: -0.01em;
    margin-bottom: 16px;
  }
  .sec-num {
    color: ${brand.bronze};
    font-weight: 600;
    font-size: 0.92em;
    margin-right: 18px;
    font-variant-numeric: tabular-nums;
    letter-spacing: 0.01em;
  }

  .dek {
    font-size: 14px;
    line-height: 1.6;
    font-weight: 500;
    color: ${brand.ink};
    margin: 0 0 18px;
  }

  /* ----- Exhibit caption ----- */
  .exhibit-cap {
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.04em;
    color: ${brand.slate};
    margin: 4px 0 12px;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .exhibit-tag {
    text-transform: uppercase;
    letter-spacing: 0.16em;
    font-size: 8.5px;
    color: ${brand.bronze};
    border: 1px solid ${brand.bronzeSoft};
    border-radius: 3px;
    padding: 3px 7px;
  }

  /* ----- Comparison exhibit (data table, sans) ----- */
  table.compare {
    width: 100%;
    border-collapse: collapse;
    margin: 0 0 22px;
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 10px;
    background: ${brand.surface};
    border: 1px solid ${brand.hair};
  }
  table.compare th, table.compare td {
    text-align: left;
    padding: 13px 15px;
    line-height: 1.5;
    vertical-align: top;
    border-bottom: 1px solid ${brand.hair};
    border-right: 1px solid ${brand.hair};
  }
  table.compare th:last-child, table.compare td:last-child { border-right: none; }
  table.compare tbody tr:last-child td { border-bottom: none; }
  table.compare thead th {
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-size: 9px;
    font-weight: 600;
    color: ${brand.ink};
    background: rgba(156, 124, 74, 0.10);
    border-bottom: 1.5px solid ${brand.bronze};
  }
  table.compare tbody td { color: ${brand.ink}; }
  td.row-head {
    font-weight: 600;
    color: ${brand.bronze};
    background: rgba(156, 124, 74, 0.05);
    white-space: nowrap;
  }

  /* ----- Bullet lists ----- */
  ul.bullets { list-style: none; margin: 8px 0 20px; padding: 0; }
  ul.bullets li {
    position: relative;
    padding-left: 22px;
    margin-bottom: 13px;
    font-size: 12.5px;
    line-height: 1.65;
  }
  ul.bullets li::before {
    content: '';
    position: absolute;
    left: 0;
    top: 8px;
    width: 7px;
    height: 7px;
    border: 1px solid ${brand.bronze};
    background: ${brand.bronze};
    transform: rotate(45deg);
  }

  /* ----- Advisory note ----- */
  .advisory {
    break-inside: avoid;
    border: 1px solid ${brand.hair};
    border-left: 3px solid;
    background: ${brand.surface};
    padding: 18px 22px;
    margin: 8px 0 6px;
  }
  .advisory-label {
    font-family: 'Inter', system-ui, sans-serif;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    font-size: 8.5px;
    font-weight: 600;
    margin: 0 0 8px;
  }
  .advisory-title {
    font-family: 'Newsreader', Georgia, serif;
    font-weight: 600;
    font-size: 14px;
    margin: 0 0 6px;
    color: ${brand.ink};
  }
  .advisory-body { margin: 0; font-size: 12px; line-height: 1.62; color: ${brand.slate}; }

  /* ----- Due-diligence checklist ----- */
  ul.checklist { list-style: none; margin: 10px 0 0; padding: 0; }
  li.check-item {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    padding: 14px 18px;
    margin-bottom: 9px;
    background: ${brand.surface};
    border: 1px solid ${brand.hair};
    border-radius: 4px;
    font-size: 12.5px;
    line-height: 1.5;
    break-inside: avoid;
  }
  .check-box {
    color: ${brand.bronze};
    font-size: 17px;
    line-height: 1;
    flex-shrink: 0;
    margin-top: -1px;
  }

  /* ===================== CLOSING ===================== */
  .close {
    break-inside: avoid;
    margin-top: 44px;
    padding: 40px 44px;
    text-align: center;
    background: ${brand.ink};
    color: ${brand.paper};
    border-radius: 4px;
  }
  .close-rule { width: 56px; height: 2px; background: ${brand.bronze}; margin: 0 auto 24px; }
  .close .eyebrow { color: ${brand.bronzeSoft}; }
  .close-title {
    font-size: 32px;
    font-weight: 500;
    color: ${brand.paper};
    margin: 0 0 16px;
  }
  .close-body {
    color: rgba(245, 242, 234, 0.72);
    max-width: 430px;
    margin: 0 auto 24px;
    font-size: 13px;
    line-height: 1.65;
  }
  .close-url {
    font-family: 'Inter', system-ui, sans-serif;
    font-weight: 600;
    letter-spacing: 0.04em;
    font-size: 18px;
    color: ${brand.bronzeSoft};
    margin: 0;
  }

</style>
</head>
<body>
  ${cover}
  ${exec}
  ${intro}
  ${section1}
  ${section2}
  ${section3}
  ${section4}
  ${section5}
  ${section6}
  ${close}
</body>
</html>`;
}

// ---------------------------------------------------------------------------
// Per-page footer (rendered by Puppeteer in the bottom margin)
// ---------------------------------------------------------------------------

// The header/footer templates paint the full-width top/bottom margin strips in
// the page's ivory so the background bleeds continuously to every edge, and
// carry the running letterhead + footer on every page.
// Note: the reset + 100% height makes the ivory background fill the entire
// margin strip (Chromium otherwise leaves a default body margin / white edge).
const tplReset = `<style>
  html,body{margin:0;padding:0;height:100%;width:100%;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
  *{box-sizing:border-box;}
</style>`;

const headerTemplate = `${tplReset}
  <div style="
    width: 100%;
    height: 100%;
    background: ${brand.paper};
    font-family: 'Inter', system-ui, sans-serif;
    padding: 26px 78px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  ">
    <span style="font-weight:600;font-size:9px;letter-spacing:0.02em;color:${brand.ink};">CharterWithLiam</span>
    <span style="text-transform:uppercase;letter-spacing:0.2em;font-size:7.5px;font-weight:500;color:${brand.slate};">Private Aviation Advisory</span>
  </div>`;

const footerTemplate = `${tplReset}
  <div style="
    width: 100%;
    height: 100%;
    background: ${brand.paper};
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 8px;
    letter-spacing: 0.04em;
    color: ${brand.bronze};
    padding: 0 78px 30px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  ">
    <span style="text-transform:uppercase;letter-spacing:0.18em;">CharterWithLiam &middot; Private aviation, decoded</span>
    <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
  </div>`;

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
    await page.setContent(html, { waitUntil: 'load' });
    // Wait for the Google Fonts @import to resolve so the PDF renders with
    // Newsreader / Inter rather than fallback fonts.
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
        top: '62px',
        bottom: '72px',
        left: '0',
        right: '0',
      },
    });

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

// Run only when invoked directly (not when imported, e.g. for preview).
const invokedPath = process.argv[1] ?? '';
if (invokedPath.includes('generate-guide')) {
  main().catch((err) => {
    console.error('Failed to generate guide PDF:', err);
    process.exit(1);
  });
}
