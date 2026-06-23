import 'server-only';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import GuideEmail from '@/emails/guide';
import EmptyLegsEmail from '@/emails/empty-legs';
import WelcomeEmail from '@/emails/welcome';
import { SITE_URL, MAILING_ADDRESS } from './env';

let cached: Resend | null = null;

function getResend(): Resend | null {
  if (cached) return cached;
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  cached = new Resend(key);
  return cached;
}

export function isResendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM);
}

const FROM = process.env.RESEND_FROM || 'Liam <onboarding@resend.dev>';
const REPLY_TO = process.env.RESEND_REPLY_TO || 'liam@charterwithliam.com';
const unsubscribeUrl = `${SITE_URL}/privacy#unsubscribe`;

interface SendResult {
  ok: boolean;
  error?: string;
}

async function send(opts: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<SendResult> {
  const resend = getResend();
  if (!resend) {
    return { ok: false, error: 'Resend not configured' };
  }
  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: opts.to,
      replyTo: REPLY_TO,
      subject: opts.subject,
      html: opts.html,
      text: opts.text,
      headers: {
        'List-Unsubscribe': `<${unsubscribeUrl}>`,
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      },
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'send failed' };
  }
}

export async function sendWelcomeEmail(opts: {
  to: string;
  firstName?: string;
}): Promise<SendResult> {
  const node = WelcomeEmail({
    firstName: opts.firstName,
    unsubscribeUrl,
    mailingAddress: MAILING_ADDRESS,
    replyTo: REPLY_TO,
  });
  const html = await render(node);
  const text = await render(node, { plainText: true });
  return send({
    to: opts.to,
    subject: 'Welcome to CharterWithLiam ✈️',
    html,
    text,
  });
}

export async function sendGuideEmail(opts: {
  to: string;
  firstName?: string;
  downloadUrl: string;
}): Promise<SendResult> {
  const node = GuideEmail({
    firstName: opts.firstName,
    downloadUrl: opts.downloadUrl,
    unsubscribeUrl,
    mailingAddress: MAILING_ADDRESS,
    replyTo: REPLY_TO,
  });
  const html = await render(node);
  const text = await render(node, { plainText: true });
  return send({
    to: opts.to,
    subject: "Your Charter Buyer's Guide 📄",
    html,
    text,
  });
}

export async function sendEmptyLegsEmail(opts: {
  to: string;
  firstName?: string;
  homeAirport?: string;
}): Promise<SendResult> {
  const node = EmptyLegsEmail({
    firstName: opts.firstName,
    homeAirport: opts.homeAirport,
    unsubscribeUrl,
    mailingAddress: MAILING_ADDRESS,
    replyTo: REPLY_TO,
  });
  const html = await render(node);
  const text = await render(node, { plainText: true });
  return send({
    to: opts.to,
    subject: "You're on the empty-leg list ✈️",
    html,
    text,
  });
}
