import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 64,
          background:
            'radial-gradient(900px circle at 20% 10%, rgba(59,130,246,0.18), transparent 55%), radial-gradient(800px circle at 80% 20%, rgba(16,185,129,0.12), transparent 55%), linear-gradient(to bottom, rgba(2,6,23,1), rgba(0,0,0,1))',
          color: '#fff',
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
        }}
      >
        <div
          style={{
            fontSize: 56,
            fontWeight: 800,
            letterSpacing: -1,
            lineHeight: 1.1,
          }}
        >
          Live Forex Strength Meter
        </div>
        <div style={{ marginTop: 18, fontSize: 28, opacity: 0.9 }}>
          Currency strength (0–100) across 5m → 1W timeframes
        </div>
        <div style={{ marginTop: 44, fontSize: 22, opacity: 0.75 }}>
          liveforexstrength.com
        </div>
      </div>
    ),
    size
  );
}

