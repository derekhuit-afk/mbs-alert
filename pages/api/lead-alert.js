import twilio from 'twilio'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  // Verify webhook secret
  const secret = req.headers['x-webhook-secret']
  if (secret !== process.env.WEBHOOK_SECRET && secret !== 'huit_lead_webhook_2026') {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const body = req.body
    // Support both Supabase webhook format and direct calls
    const lead = body.record || body.lead || body

    const firstName = lead.first_name || 'New Lead'
    const lastName  = lead.last_name || ''
    const source    = lead.source || 'website'
    const purpose   = (lead.loan_purpose || 'inquiry').toUpperCase()
    const email     = lead.email || 'no email'
    const phone     = lead.phone || 'no phone'
    const price     = lead.est_purchase_price
      ? `$${Number(lead.est_purchase_price).toLocaleString()}`
      : ''
    const utm       = lead.utm_source || 'organic'
    const status    = lead.status || 'new'

    // Status-based message
    const statusEmoji = {
      new: '🔔',
      applied: '📝',
      prequal_done: '✅',
      processing: '⚙️',
      closed: '🏆',
    }[status] || '🔔'

    const statusLabel = {
      new: 'NEW QUALIFIED LEAD SUBMITTED',
      applied: 'NEW LOAN APPLICATION SUBMITTED',
      prequal_done: 'PRE-APPROVAL COMPLETE',
      processing: 'LOAN IN PROCESSING',
      closed: 'NEW CLOSED LOAN! 🎉',
    }[status] || 'NEW LEAD SUBMITTED'

    const msg = [
      `${statusEmoji} ${statusLabel}`,
      `${firstName} ${lastName}`.trim() + (purpose ? ` · ${purpose}` : '') + (price ? ` · ${price}` : ''),
      `📱 ${phone}`,
      `📧 ${email}`,
      `🔗 Source: ${source}${utm !== 'organic' ? ` (${utm})` : ''}`,
      `👉 Review at loanak.com`,
    ].join('\n')

    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    )

    const message = await client.messages.create({
      body: msg,
      from: process.env.TWILIO_FROM_NUMBER,
      to: process.env.TWILIO_TO_NUMBER,
    })

    console.log(`Lead alert sent: ${message.sid} | ${firstName} ${lastName} | ${source}`)
    return res.status(200).json({ success: true, sid: message.sid })

  } catch (err) {
    console.error('Lead alert error:', err.message)
    return res.status(500).json({ error: err.message })
  }
}
