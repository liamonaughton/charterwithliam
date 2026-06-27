import { ImageResponse } from 'next/og';

export const alt =
  'CharterWithLiam — Fly private without overpaying or getting burned.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '80px',
          backgroundColor: '#0A1A2F',
          backgroundImage:
            'radial-gradient(900px 500px at 85% -10%, rgba(46,139,255,0.45), transparent 60%)',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 30,
            fontWeight: 700,
            color: '#D8E9FF',
            letterSpacing: 4,
          }}
        >
          PRIVATE JET CHARTER, BOOKED DIRECT
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 72,
            fontWeight: 700,
            color: '#FFFFFF',
            lineHeight: 1.05,
            maxWidth: 980,
          }}
        >
          Fly private without overpaying — or getting burned.
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 34,
            fontWeight: 700,
            color: '#FFFFFF',
          }}
        >
          CharterWith<span style={{ color: '#2E8BFF' }}>Liam</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
