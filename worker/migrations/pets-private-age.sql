-- Private declaration only; never join into public/social user projections.
CREATE TABLE IF NOT EXISTS pet_private_age (
  auth_username TEXT PRIMARY KEY REFERENCES auth_users(username) ON DELETE CASCADE,
  birth_date TEXT NOT NULL,
  declared_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK(length(birth_date)=10 AND birth_date GLOB '[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]')
);
