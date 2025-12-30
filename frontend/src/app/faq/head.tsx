export default function Head() {
  const entries: Array<{ q: string; a: string }> = [
    {
      q: 'What does the 0–100 score mean?',
      a: 'The score is a normalized strength ranking for each currency within the selected timeframe. Higher values mean the currency has been stronger relative to the others in the basket.',
    },
    {
      q: 'Which currencies are included?',
      a: 'The meter focuses on the 8 major currencies: USD, EUR, GBP, JPY, CHF, CAD, AUD and NZD.',
    },
    {
      q: 'How often does it update?',
      a: 'It updates live on the dashboard. If the market is quiet (no ticks), the UI can still refresh with the latest computed snapshot.',
    },
    {
      q: 'How should I use multiple timeframes?',
      a: 'Use higher timeframes (4h/12h/1W) to identify the broader bias, and lower timeframes (5m/15m/30m) to time entries. Many traders look for strong-vs-weak pairs that align across timeframes.',
    },
    {
      q: 'Is this financial advice or a trade signal?',
      a: 'No. This is an analysis tool. Always validate with your own strategy, risk management, and market context (news, sessions, liquidity).',
    },
  ];

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: entries.map((e) => ({
      '@type': 'Question',
      name: e.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: e.a,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </>
  );
}

