import { z } from 'zod';

// Shared schema used on both the client (lightweight checks) and the server.
// The server is the source of truth; the client mirrors it for fast feedback.

const optionalTrimmed = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v && v.length > 0 ? v : undefined));

// Loose E.164-ish phone: digits, spaces, +, -, (), 7–20 chars when present.
const phoneRegex = /^[+]?[\d\s().-]{7,20}$/;

export const subscribeSchema = z
  .object({
    email: z
      .string()
      .trim()
      .toLowerCase()
      .min(3)
      .max(254)
      .email('Please enter a valid email address.'),
    firstName: optionalTrimmed(80),
    phone: optionalTrimmed(20).refine(
      (v) => v === undefined || phoneRegex.test(v),
      'Please enter a valid phone number.'
    ),
    wantsGuide: z.boolean().default(true),
    wantsEmptyLegs: z.boolean().default(false),
    homeAirport: optionalTrimmed(120),
    typicalRoutes: optionalTrimmed(280),
    consent: z.literal(true, {
      errorMap: () => ({ message: 'Please agree to receive emails to continue.' }),
    }),
    // Honeypot — must be empty. Bots tend to fill every field.
    website: z.string().max(0).optional().or(z.literal('')),
    // Bot protection + attribution (validated/handled server-side).
    turnstileToken: z.string().optional(),
    source: optionalTrimmed(60),
    utmSource: optionalTrimmed(120),
    utmMedium: optionalTrimmed(120),
    utmCampaign: optionalTrimmed(120),
  })
  .refine((data) => data.wantsGuide || data.wantsEmptyLegs, {
    message: 'Pick at least one: the guide or the deal alerts.',
    path: ['wantsGuide'],
  });

export type SubscribeInput = z.infer<typeof subscribeSchema>;

// Coerce raw FormData (all strings) into the shape Zod expects.
export function formDataToObject(formData: FormData): Record<string, unknown> {
  const get = (k: string) => {
    const v = formData.get(k);
    return typeof v === 'string' ? v : undefined;
  };
  const checked = (k: string) => formData.get(k) === 'on' || formData.get(k) === 'true';

  return {
    email: get('email') ?? '',
    firstName: get('firstName'),
    phone: get('phone'),
    wantsGuide: checked('wantsGuide'),
    wantsEmptyLegs: checked('wantsEmptyLegs'),
    homeAirport: get('homeAirport'),
    typicalRoutes: get('typicalRoutes'),
    consent: checked('consent'),
    website: get('website') ?? '',
    turnstileToken: get('cf-turnstile-response') ?? get('turnstileToken'),
    source: get('source'),
    utmSource: get('utmSource'),
    utmMedium: get('utmMedium'),
    utmCampaign: get('utmCampaign'),
  };
}
