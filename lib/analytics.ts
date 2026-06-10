'use client';

import { track } from '@vercel/analytics';

export function trackLeadCaptured(props: {
  wants_guide: boolean;
  wants_empty_legs: boolean;
  source?: string;
}) {
  try {
    track('lead_captured', {
      wants_guide: props.wants_guide,
      wants_empty_legs: props.wants_empty_legs,
      source: props.source ?? 'unknown',
    });
  } catch {
    // analytics is best-effort; never block the UX
  }
}
