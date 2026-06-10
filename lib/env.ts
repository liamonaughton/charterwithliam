// Small helpers for reading public env with sensible fallbacks.

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
  'https://charterwithliam.com';

export const SUBSCRIBER_COUNT =
  process.env.NEXT_PUBLIC_SUBSCRIBER_COUNT || '2,000';

export const MAILING_ADDRESS =
  process.env.NEXT_PUBLIC_MAILING_ADDRESS ||
  'CharterWithLiam · Mailing address on file';

export const SOCIAL = {
  instagram: 'https://instagram.com/charterwithliam',
  tiktok: 'https://tiktok.com/@charterwithliam',
  youtube: 'https://youtube.com/@charterwithliam',
  linkedin: 'https://linkedin.com/company/charterwithliam',
};
