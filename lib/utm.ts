// Attribution helpers — parse query params + referrer into a `source`.
// Used client-side to populate hidden form fields before submit.

export interface Attribution {
  source?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

const KNOWN_HOSTS: Record<string, string> = {
  'instagram.com': 'instagram',
  'l.instagram.com': 'instagram',
  'tiktok.com': 'tiktok',
  'youtube.com': 'youtube',
  'youtu.be': 'youtube',
  'm.youtube.com': 'youtube',
  'linkedin.com': 'linkedin',
  'lnkd.in': 'linkedin',
  'facebook.com': 'facebook',
  't.co': 'twitter',
  'twitter.com': 'twitter',
  'x.com': 'twitter',
};

function hostToSource(host: string): string | undefined {
  const h = host.replace(/^www\./, '').toLowerCase();
  if (KNOWN_HOSTS[h]) return KNOWN_HOSTS[h];
  for (const key of Object.keys(KNOWN_HOSTS)) {
    if (h.endsWith(key)) return KNOWN_HOSTS[key];
  }
  return undefined;
}

export function deriveAttribution(
  search: string,
  referrer: string
): Attribution {
  const params = new URLSearchParams(search);
  const utmSource = params.get('utm_source') ?? undefined;
  const utmMedium = params.get('utm_medium') ?? undefined;
  const utmCampaign = params.get('utm_campaign') ?? undefined;
  const explicitSource = params.get('source') ?? params.get('ref') ?? undefined;

  let source = explicitSource ?? utmSource ?? undefined;

  if (!source && referrer) {
    try {
      const refHost = new URL(referrer).host;
      source = hostToSource(refHost);
    } catch {
      // ignore malformed referrer
    }
  }

  if (!source) {
    // No referrer + no params usually means a direct visit or app webview.
    source = referrer ? 'referral' : 'direct';
  }

  return {
    source: source?.slice(0, 60),
    utmSource: utmSource?.slice(0, 120),
    utmMedium: utmMedium?.slice(0, 120),
    utmCampaign: utmCampaign?.slice(0, 120),
  };
}
