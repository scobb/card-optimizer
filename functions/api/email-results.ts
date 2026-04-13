interface Env {
  DB: D1Database
  RESEND_API_KEY: string
}

interface CategoryRow {
  category: string
  categoryLabel: string
  bestCardName: string | null
  effectiveRate: number
  annualSpend: number
  annualRewards: number
}

interface WalletCard {
  name: string
  issuer: string
  annualFee: number
}

interface Recommendation {
  name: string
  issuer: string
  netAnnualValue: number
  reason: string
}

interface EmailRequest {
  email: string
  walletCards: WalletCard[]
  categoryBreakdown: CategoryRow[]
  totalAnnualRewards: number
  totalAnnualFees: number
  netAnnualValue: number
  topRecommendations: Recommendation[]
  monthlyDigestOptIn: boolean
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function fmt(value: number): string {
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  })
}

function buildHtml(data: EmailRequest): string {
  const categoryRows = data.categoryBreakdown
    .filter((c) => c.annualSpend > 0)
    .sort((a, b) => b.annualRewards - a.annualRewards)
    .map(
      (c) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;color:#374151;">${c.categoryLabel}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;color:#1d4ed8;font-weight:600;">${c.bestCardName ?? '—'}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;text-align:right;color:#374151;">${c.effectiveRate.toFixed(2)}%</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;text-align:right;color:#374151;">${fmt(c.annualSpend)}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;text-align:right;font-weight:600;color:#16a34a;">${fmt(c.annualRewards)}</td>
      </tr>`,
    )
    .join('')

  const walletRows = data.walletCards
    .map(
      (c) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;font-weight:600;color:#374151;">${c.name}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;color:#6b7280;">${c.issuer}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;text-align:right;color:#374151;">${c.annualFee === 0 ? 'No fee' : fmt(c.annualFee)}</td>
      </tr>`,
    )
    .join('')

  const recRows = data.topRecommendations
    .slice(0, 3)
    .map(
      (r) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;font-weight:600;color:#374151;">${r.name}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;color:#6b7280;">${r.issuer}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;text-align:right;font-weight:600;color:#16a34a;">+${fmt(r.netAnnualValue)}/yr</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;color:#6b7280;font-size:12px;">${r.reason}</td>
      </tr>`,
    )
    .join('')

  const netColor = data.netAnnualValue >= 0 ? '#16a34a' : '#dc2626'
  const netSign = data.netAnnualValue >= 0 ? '+' : ''

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;margin:0;padding:0;background:#f9fafb;">
  <div style="max-width:600px;margin:32px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#1d4ed8,#4338ca);padding:32px 24px;text-align:center;">
      <h1 style="color:#ffffff;margin:0;font-size:24px;font-weight:800;">Your Optimized Wallet</h1>
      <p style="color:#bfdbfe;margin:8px 0 0;font-size:14px;">CardOptimizer Results Summary</p>
    </div>

    <!-- Summary stats -->
    <div style="display:flex;padding:24px;gap:16px;background:#f8faff;border-bottom:1px solid #e5e7eb;">
      <div style="flex:1;text-align:center;padding:16px;background:#fff;border-radius:8px;border:1px solid #e5e7eb;">
        <div style="font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px;">Annual Rewards</div>
        <div style="font-size:20px;font-weight:800;color:#16a34a;">${fmt(data.totalAnnualRewards)}</div>
      </div>
      <div style="flex:1;text-align:center;padding:16px;background:#fff;border-radius:8px;border:1px solid #e5e7eb;">
        <div style="font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px;">Annual Fees</div>
        <div style="font-size:20px;font-weight:800;color:#dc2626;">${fmt(data.totalAnnualFees)}</div>
      </div>
      <div style="flex:1;text-align:center;padding:16px;background:#fff;border-radius:8px;border:1px solid #e5e7eb;">
        <div style="font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px;">Net Value</div>
        <div style="font-size:20px;font-weight:800;color:${netColor};">${netSign}${fmt(data.netAnnualValue)}</div>
      </div>
    </div>

    <div style="padding:24px;">

      <!-- Per-category table -->
      <h2 style="font-size:16px;font-weight:700;color:#111827;margin:0 0 12px;">Per-Category Optimization</h2>
      <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:24px;">
        <thead>
          <tr style="background:#f3f4f6;">
            <th style="padding:8px 12px;text-align:left;font-size:11px;color:#6b7280;text-transform:uppercase;font-weight:600;">Category</th>
            <th style="padding:8px 12px;text-align:left;font-size:11px;color:#6b7280;text-transform:uppercase;font-weight:600;">Best Card</th>
            <th style="padding:8px 12px;text-align:right;font-size:11px;color:#6b7280;text-transform:uppercase;font-weight:600;">Rate</th>
            <th style="padding:8px 12px;text-align:right;font-size:11px;color:#6b7280;text-transform:uppercase;font-weight:600;">Annual Spend</th>
            <th style="padding:8px 12px;text-align:right;font-size:11px;color:#6b7280;text-transform:uppercase;font-weight:600;">Rewards</th>
          </tr>
        </thead>
        <tbody>${categoryRows}</tbody>
      </table>

      <!-- Cards in wallet -->
      <h2 style="font-size:16px;font-weight:700;color:#111827;margin:0 0 12px;">Your Wallet</h2>
      <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:24px;">
        <thead>
          <tr style="background:#f3f4f6;">
            <th style="padding:8px 12px;text-align:left;font-size:11px;color:#6b7280;text-transform:uppercase;font-weight:600;">Card</th>
            <th style="padding:8px 12px;text-align:left;font-size:11px;color:#6b7280;text-transform:uppercase;font-weight:600;">Issuer</th>
            <th style="padding:8px 12px;text-align:right;font-size:11px;color:#6b7280;text-transform:uppercase;font-weight:600;">Annual Fee</th>
          </tr>
        </thead>
        <tbody>${walletRows}</tbody>
      </table>

      ${
        recRows
          ? `<!-- Top recommendations -->
      <h2 style="font-size:16px;font-weight:700;color:#111827;margin:0 0 12px;">Top New Card Recommendations</h2>
      <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:24px;">
        <thead>
          <tr style="background:#f3f4f6;">
            <th style="padding:8px 12px;text-align:left;font-size:11px;color:#6b7280;text-transform:uppercase;font-weight:600;">Card</th>
            <th style="padding:8px 12px;text-align:left;font-size:11px;color:#6b7280;text-transform:uppercase;font-weight:600;">Issuer</th>
            <th style="padding:8px 12px;text-align:right;font-size:11px;color:#6b7280;text-transform:uppercase;font-weight:600;">Added Value</th>
            <th style="padding:8px 12px;text-align:left;font-size:11px;color:#6b7280;text-transform:uppercase;font-weight:600;">Why</th>
          </tr>
        </thead>
        <tbody>${recRows}</tbody>
      </table>`
          : ''
      }

      <!-- CTA -->
      <div style="text-align:center;padding:16px;background:#eff6ff;border-radius:8px;border:1px solid #bfdbfe;">
        <p style="margin:0 0 12px;color:#1e40af;font-weight:600;font-size:14px;">Want to explore more cards?</p>
        <a href="https://cards.keylightdigital.dev" style="display:inline-block;background:#1d4ed8;color:#ffffff;font-weight:700;font-size:14px;padding:10px 24px;border-radius:8px;text-decoration:none;">
          Open CardOptimizer
        </a>
      </div>

    </div>

    <!-- Footer -->
    <div style="padding:16px 24px;background:#f9fafb;border-top:1px solid #e5e7eb;text-align:center;">
      <p style="margin:0;font-size:11px;color:#9ca3af;">
        CardOptimizer · Built by <a href="https://keylightdigital.com" style="color:#6b7280;">Keylight Digital</a> ·
        <a href="https://cards.keylightdigital.dev/privacy" style="color:#6b7280;">Privacy Policy</a>
      </p>
      <p style="margin:4px 0 0;font-size:11px;color:#9ca3af;">
        All analysis was performed locally in your browser. No transaction data was sent to our servers.
      </p>
    </div>
  </div>
</body>
</html>`
}

export async function onRequestPost(context: { request: Request; env: Env }) {
  const { request, env } = context

  // Parse and validate request body
  let body: EmailRequest
  try {
    body = await request.json() as EmailRequest
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const { email, walletCards, categoryBreakdown, totalAnnualRewards, totalAnnualFees,
          netAnnualValue, topRecommendations, monthlyDigestOptIn } = body

  if (!email || !isValidEmail(email)) {
    return new Response(JSON.stringify({ error: 'Invalid email address' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (!walletCards?.length || !categoryBreakdown?.length) {
    return new Response(JSON.stringify({ error: 'Missing wallet or spending data' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Rate limit: max 3 emails per address per day
  const today = new Date().toISOString().slice(0, 10)
  const rateRow = await env.DB.prepare(
    'SELECT count FROM email_rate_limit WHERE email = ? AND date = ?'
  ).bind(email.toLowerCase(), today).first<{ count: number }>()

  if (rateRow && rateRow.count >= 3) {
    return new Response(JSON.stringify({ error: 'Rate limit exceeded. Max 3 emails per day.' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Send email via Resend API
  const html = buildHtml({ email, walletCards, categoryBreakdown, totalAnnualRewards,
                            totalAnnualFees, netAnnualValue, topRecommendations, monthlyDigestOptIn })

  const resendRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'CardOptimizer <ralph@keylightdigital.com>',
      to: email,
      subject: `Your Optimized Wallet — ${fmt(netAnnualValue >= 0 ? netAnnualValue : 0)} net annual value`,
      html,
    }),
  })

  if (!resendRes.ok) {
    const err = await resendRes.text()
    return new Response(JSON.stringify({ error: 'Failed to send email', detail: err }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Update rate limit counter
  await env.DB.prepare(
    `INSERT INTO email_rate_limit (email, date, count)
     VALUES (?, ?, 1)
     ON CONFLICT(email, date) DO UPDATE SET count = count + 1`
  ).bind(email.toLowerCase(), today).run()

  // Store monthly digest opt-in preference
  if (monthlyDigestOptIn) {
    await env.DB.prepare(
      `INSERT INTO email_preferences (email, monthly_digest, updated_at)
       VALUES (?, 1, datetime('now'))
       ON CONFLICT(email) DO UPDATE SET monthly_digest = 1, updated_at = datetime('now')`
    ).bind(email.toLowerCase()).run()
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
