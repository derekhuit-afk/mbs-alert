// lib/fetchMBS.js
// Fetches UMBS 30YR 5.5% price data from Yahoo Finance (delayed quote)

export async function fetchMBSData() {
  try {
    // Yahoo Finance quote for UMBS 30YR 5.5% TBA Futures
    const symbol = '55U%3DF'; // 55U=F URL encoded
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=30m&range=1d`;

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; MBSAlert/1.0)',
        'Accept': 'application/json',
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error(`Yahoo Finance API error: ${res.status}`);
    }

    const data = await res.json();
    const result = data?.chart?.result?.[0];

    if (!result) throw new Error('No chart data returned');

    const meta = result.meta;
    const currentPrice = meta.regularMarketPrice;
    const previousClose = meta.chartPreviousClose || meta.previousClose;
    const dayChangeBps = Math.round((currentPrice - previousClose) * 32); // Convert to 32nds/bps approximation

    // Get intraday timestamps and closes
    const timestamps = result.timestamp || [];
    const closes = result.indicators?.quote?.[0]?.close || [];

    // Find prices at approximately 10:00, 10:30, 11:00 ET
    // Alaska is UTC-9 (AKST) or UTC-8 (AKDT)
    // Market times in ET: 10:00=15:00 UTC, 10:30=15:30 UTC, 11:00=16:00 UTC
    const etOffsets = {
      '10:00': 15 * 3600,
      '10:30': 15 * 3600 + 1800,
      '11:00': 16 * 3600,
    };

    const today = new Date();
    const todayDateStr = today.toISOString().split('T')[0];

    function getChangeAtTime(targetHourUTC, targetMinUTC) {
      const targetTs = new Date(`${todayDateStr}T${String(targetHourUTC).padStart(2,'0')}:${String(targetMinUTC).padStart(2,'0')}:00Z`).getTime() / 1000;
      let closestIdx = -1;
      let closestDiff = Infinity;

      timestamps.forEach((ts, i) => {
        const diff = Math.abs(ts - targetTs);
        if (diff < closestDiff && closes[i] != null) {
          closestDiff = diff;
          closestIdx = i;
        }
      });

      if (closestIdx === -1) return null;
      const priceAtTime = closes[closestIdx];
      return Math.round((priceAtTime - previousClose) * 32);
    }

    const chg1000 = getChangeAtTime(15, 0);
    const chg1030 = getChangeAtTime(15, 30);
    const chg1100 = getChangeAtTime(16, 0);

    // Rate direction signal
    let direction = 'UNCHANGED ⟷';
    if (dayChangeBps > 8) direction = 'BETTER ✅';
    else if (dayChangeBps > 0) direction = 'SLIGHTLY BETTER 📈';
    else if (dayChangeBps < -8) direction = 'WORSE ❌';
    else if (dayChangeBps < 0) direction = 'SLIGHTLY WORSE 📉';

    // Market commentary based on movement
    let commentary = '';
    if (dayChangeBps >= 25) commentary = 'Strong bond rally — expect lender reprices for the better today.';
    else if (dayChangeBps >= 10) commentary = 'Moderate improvement in MBS. Favorable pricing environment.';
    else if (dayChangeBps >= 0) commentary = 'Flat to slightly improved. Pricing holding steady.';
    else if (dayChangeBps >= -15) commentary = 'Mild weakness in MBS. Watch for negative reprices.';
    else commentary = 'Significant MBS selloff. Lenders likely repricing worse.';

    return {
      price: currentPrice.toFixed(2),
      dayChangeBps,
      chg1000,
      chg1030,
      chg1100,
      direction,
      commentary,
    };
  } catch (err) {
    console.error('fetchMBSData error:', err);
    throw err;
  }
}

export function formatSMS(data, alertTime) {
  const sign = (n) => (n >= 0 ? `+${n}` : `${n}`);

  return [
    `UMBS 30YR 5.5% : ${data.price}`,
    `Day Change : ${sign(data.dayChangeBps)}bp`,
    `10:00 CHG : ${data.chg1000 != null ? sign(data.chg1000) + 'bp' : 'N/A'}`,
    `10:30 CHG : ${data.chg1030 != null ? sign(data.chg1030) + 'bp' : 'N/A'}`,
    `11:00 CHG : ${data.chg1100 != null ? sign(data.chg1100) + 'bp' : 'N/A'}`,
    `Rate Direction : ${data.direction}`,
    `Market : ${data.commentary}`,
    `— ${alertTime} AKT`,
  ].join('\n');
}
