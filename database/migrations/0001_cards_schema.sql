-- Card catalog schema
CREATE TABLE IF NOT EXISTS cards (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  issuer TEXT NOT NULL,
  annual_fee REAL NOT NULL DEFAULT 0,
  first_year_fee_waived INTEGER NOT NULL DEFAULT 0,
  reward_type TEXT NOT NULL CHECK(reward_type IN ('cashback', 'points')),
  base_rate REAL NOT NULL DEFAULT 1.0,
  point_value REAL NOT NULL DEFAULT 1.0,
  url TEXT NOT NULL DEFAULT '',
  image_url TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS category_rates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  card_id TEXT NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  multiplier REAL NOT NULL,
  UNIQUE(card_id, category)
);

CREATE TABLE IF NOT EXISTS sign_up_bonuses (
  card_id TEXT PRIMARY KEY REFERENCES cards(id) ON DELETE CASCADE,
  amount REAL NOT NULL,
  spend_required REAL NOT NULL,
  time_months INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS perks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  card_id TEXT NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  annual_value REAL NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_category_rates_card ON category_rates(card_id);
CREATE INDEX IF NOT EXISTS idx_perks_card ON perks(card_id);
