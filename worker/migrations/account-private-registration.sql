-- Apply once before the candidate Worker. No public/social projection.
-- Snapshot existing accounts WITHOUT a declaration. New accounts receive a row
-- with legacy_birth_date_allowed=0 in the same transaction as registration.
CREATE TABLE IF NOT EXISTS account_private_registration (
  auth_username TEXT PRIMARY KEY REFERENCES auth_users(username) ON DELETE CASCADE,
  gender TEXT CHECK(gender IN ('masculino','feminino')),
  legacy_birth_date_allowed INTEGER NOT NULL DEFAULT 0 CHECK(legacy_birth_date_allowed IN (0,1))
);
-- Record completion separately so replaying the file cannot classify accounts
-- created after the first snapshot as legacy (including managed accounts).
CREATE TABLE IF NOT EXISTS account_private_registration_cutover (
  singleton INTEGER PRIMARY KEY CHECK(singleton=1),
  completed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO account_private_registration(auth_username,legacy_birth_date_allowed)
SELECT username,1 FROM auth_users
WHERE NOT EXISTS(SELECT 1 FROM pet_private_age WHERE auth_username=auth_users.username)
AND NOT EXISTS(SELECT 1 FROM account_private_registration_cutover WHERE singleton=1)
ON CONFLICT(auth_username) DO NOTHING;
INSERT INTO account_private_registration_cutover(singleton) VALUES(1) ON CONFLICT(singleton) DO NOTHING;
