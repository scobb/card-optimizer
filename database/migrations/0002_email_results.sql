-- Email results feature: rate limiting and opt-in preferences
CREATE TABLE IF NOT EXISTS email_rate_limit (
  email TEXT NOT NULL,
  date TEXT NOT NULL,       -- ISO date string YYYY-MM-DD
  count INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (email, date)
);

CREATE TABLE IF NOT EXISTS email_preferences (
  email TEXT PRIMARY KEY,
  monthly_digest INTEGER NOT NULL DEFAULT 0,  -- 1 = opted in
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
