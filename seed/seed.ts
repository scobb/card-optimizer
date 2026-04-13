/**
 * Seed script — inserts cards.json into D1.
 * Usage: npx tsx seed/seed.ts | npx wrangler d1 execute card-optimizer-db --remote --file=-
 * Or for local: npx tsx seed/seed.ts | npx wrangler d1 execute card-optimizer-db --local --file=-
 *
 * Generates SQL INSERT statements from the JSON seed data.
 */
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const cards = JSON.parse(readFileSync(join(__dirname, 'cards.json'), 'utf-8'))

const escSql = (s: string) => s.replace(/'/g, "''")

const statements: string[] = []

for (const card of cards) {
  statements.push(
    `INSERT OR REPLACE INTO cards (id, name, issuer, annual_fee, first_year_fee_waived, reward_type, base_rate, point_value, url, image_url) VALUES ('${escSql(card.id)}', '${escSql(card.name)}', '${escSql(card.issuer)}', ${card.annualFee}, ${card.firstYearFeeWaived ? 1 : 0}, '${card.rewardType}', ${card.baseRate}, ${card.pointValue}, '${escSql(card.url)}', ${card.imageUrl ? `'${escSql(card.imageUrl)}'` : 'NULL'});`
  )

  for (const rate of card.categoryRates) {
    statements.push(
      `INSERT OR REPLACE INTO category_rates (card_id, category, multiplier) VALUES ('${escSql(card.id)}', '${escSql(rate.category)}', ${rate.multiplier});`
    )
  }

  if (card.signUpBonus) {
    statements.push(
      `INSERT OR REPLACE INTO sign_up_bonuses (card_id, amount, spend_required, time_months) VALUES ('${escSql(card.id)}', ${card.signUpBonus.amount}, ${card.signUpBonus.spendRequired}, ${card.signUpBonus.timeMonths});`
    )
  }

  for (const perk of card.perks) {
    statements.push(
      `INSERT INTO perks (card_id, name, annual_value) VALUES ('${escSql(card.id)}', '${escSql(perk.name)}', ${perk.annualValue});`
    )
  }
}

console.log(statements.join('\n'))
