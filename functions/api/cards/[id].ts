interface Env {
  DB: D1Database
}

export async function onRequestGet(context: { env: Env; params: { id: string } }) {
  const { DB } = context.env
  const { id } = context.params

  const card = await DB.prepare('SELECT * FROM cards WHERE id = ?').bind(id).first()
  if (!card) {
    return new Response(JSON.stringify({ error: 'Card not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const categoryRates = await DB.prepare('SELECT category, multiplier FROM category_rates WHERE card_id = ?').bind(id).all()
  const bonus = await DB.prepare('SELECT amount, spend_required, time_months FROM sign_up_bonuses WHERE card_id = ?').bind(id).first()
  const perks = await DB.prepare('SELECT name, annual_value FROM perks WHERE card_id = ?').bind(id).all()

  const result = {
    id: card.id,
    name: card.name,
    issuer: card.issuer,
    annualFee: card.annual_fee,
    firstYearFeeWaived: card.first_year_fee_waived === 1,
    rewardType: card.reward_type,
    baseRate: card.base_rate,
    pointValue: card.point_value,
    url: card.url,
    imageUrl: card.image_url,
    categoryRates: categoryRates.results.map((r) => ({
      category: r.category,
      multiplier: r.multiplier,
    })),
    signUpBonus: bonus ? {
      amount: bonus.amount,
      spendRequired: bonus.spend_required,
      timeMonths: bonus.time_months,
    } : null,
    perks: perks.results.map((p) => ({
      name: p.name,
      annualValue: p.annual_value,
    })),
  }

  return new Response(JSON.stringify(result), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
