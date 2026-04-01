// pages/api/mbs-alert.js
// Vercel Cron Job: fires at 17:00, 20:00, 23:00 UTC (8AM, 11AM, 2PM AKT Mon-Fri)

import twilio from 'twilio';
import { fetchMBSData, formatSMS } from '../../lib/fetchMBS';

// Determine which alert window we're in (Alaska Time = UTC-9)
function getAlertTime() {
  const hour = new Date().getUTCHours();
  if (hour === 17) return '8:00 AM';
  if (hour === 20) return '11:00 AM';
  if (hour === 23) return '2:00 PM';
  return new Date().toLocaleTimeString('en-US', { timeZone: 'America/Anchorage', hour: '2-digit', minute: '2-digit' });
}

export default async function handler(req, res) {
  // Allow Vercel cron (GET) or manual trigger with secret
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Protect manual triggers
  const authHeader = req.headers.authorization;
  const cronSecret = process.env.CRON_SECRET;
  const isVercelCron = req.headers['x-vercel-cron'] === '1';
  const isManual = authHeader === `Bearer ${cronSecret}`;

  if (!isVercelCron && !isManual && cronSecret) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // 1. Fetch MBS data
    const mbsData = await fetchMBSData();
    const alertTime = getAlertTime();

    // 2. Format SMS
    const message = formatSMS(mbsData, alertTime);

    // 3. Send via Twilio
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    const sms = await client.messages.create({
      body: message,
      from: process.env.TWILIO_FROM_NUMBER,
      to: process.env.TWILIO_TO_NUMBER,
    });

    console.log(`MBS alert sent at ${alertTime} AKT — SID: ${sms.sid}`);

    return res.status(200).json({
      success: true,
      messageSid: sms.sid,
      alertTime,
      data: mbsData,
      preview: message,
    });
  } catch (err) {
    console.error('MBS Alert Error:', err);
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}
