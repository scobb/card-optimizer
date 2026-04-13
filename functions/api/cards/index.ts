interface Env {
  DB: D1Database
}

export async function onRequestGet(context: { env: Env }) {
  const { DB } = context.env

  const cards = await DB.prepare('SELECT * FROM cards ORDER BY issuer, name').all()
  const categoryRates = await DB.prepare('SELECT * FROM category_rates').all()
  const bonuses = await DB.prepare('SELECT * FROM sign_up_bonuses').all()
  const perks = await DB.prepare('SELECT * FROM perks').all()

  // Group related data by card_id
  const ratesByCard = new Map<string, { category: string; multiplier: number }[]>()
  for (const r of categoryRates.results) {
    const arr = ratesByCard.get(r.card_id as string) || []
    arr.push({ category: r.category as string, multiplier: r.multiplier as number })
    ratesByCard.set(r.card_id as string, arr)
  }

  const bonusByCard = new Map<string, { amount: number; spendRequired: number; timeMonths: number }>()
  for (const b of bonuses.results) {
    bonusByCard.set(b.card_id as string, {
      amount: b.amount as number,
      spendRequired: b.spend_required as number,
      timeMonths: b.time_months as number,
    })
  }

  const perksByCard = new Map<string, { name: string; annualValue: number }[]>()
  for (const p of perks.results) {
    const arr = perksByCard.get(p.card_id as string) || []
    arr.push({ name: p.name as string, annualValue: p.annual_value as number })
    perksByCard.set(p.card_id as string, arr)
  }

  const result = cards.results.map((c) => ({
    id: c.id,
    name: c.name,
    issuer: c.issuer,
    annualFee: c.annual_fee,
    firstYearFeeWaived: c.first_year_fee_waived === 1,
    rewardType: c.reward_type,
    baseRate: c.base_rate,
    pointValue: c.point_value,
    url: c.url,
    imageUrl: c.image_url,
    categoryRates: ratesByCard.get(c.id as string) || [],
    signUpBonus: bonusByCard.get(c.id as string) || null,
    perks: perksByCard.get(c.id as string) || [],
  }))

  return new Response(JSON.stringify(result), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
