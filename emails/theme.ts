// Shared inline-style tokens for the email templates.
// Kept simple and mostly-text for deliverability.

export const colors = {
  ink: '#0A1A2F',
  navy: '#12304F',
  sky: '#2E8BFF',
  skySoft: '#D8E9FF',
  cloud: '#F7FAFC',
  white: '#FFFFFF',
  mist: '#8FA3B8',
};

export const main = {
  backgroundColor: colors.cloud,
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
};

export const container = {
  margin: '0 auto',
  padding: '24px 0 48px',
  maxWidth: '560px',
};

export const card = {
  backgroundColor: colors.white,
  borderRadius: '14px',
  padding: '32px',
  border: `1px solid ${colors.skySoft}`,
};

export const heading = {
  color: colors.ink,
  fontSize: '22px',
  fontWeight: 700 as const,
  margin: '0 0 16px',
};

export const paragraph = {
  color: colors.ink,
  fontSize: '16px',
  lineHeight: '26px',
  margin: '0 0 16px',
};

export const muted = {
  color: colors.mist,
  fontSize: '13px',
  lineHeight: '20px',
};

export const button = {
  backgroundColor: colors.sky,
  borderRadius: '8px',
  color: colors.white,
  fontSize: '16px',
  fontWeight: 600 as const,
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 28px',
};

export const hr = {
  borderColor: colors.skySoft,
  margin: '24px 0',
};

export const link = {
  color: colors.sky,
};
