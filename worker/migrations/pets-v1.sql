-- Local/staging migration only. No automatic remote migration.
PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS pet_accounts (
 auth_username TEXT PRIMARY KEY REFERENCES auth_users(username) ON DELETE CASCADE,
 balance INTEGER NOT NULL DEFAULT 0 CHECK(balance >= 0),
 revision INTEGER NOT NULL DEFAULT 0 CHECK(revision >= 0),
 state_json TEXT NOT NULL CHECK(json_valid(state_json)),
 last_nonce TEXT NOT NULL DEFAULT '',
 CHECK(json_extract(state_json,'$.hunger') BETWEEN 0 AND 100),
 CHECK(json_extract(state_json,'$.thirst') BETWEEN 0 AND 100),
 CHECK(json_extract(state_json,'$.dirt') BETWEEN 0 AND 100)
);
CREATE TABLE IF NOT EXISTS pet_operations (
 auth_username TEXT NOT NULL REFERENCES auth_users(username) ON DELETE CASCADE,
 operation_id TEXT NOT NULL,
 request_hash TEXT NOT NULL,
 kind TEXT NOT NULL,
 execution_nonce TEXT NOT NULL,
 status TEXT NOT NULL CHECK(status IN ('pending','ok','rejected','conflict')),
 result_json TEXT NOT NULL CHECK(json_valid(result_json)),
 created_at INTEGER NOT NULL,
 PRIMARY KEY(auth_username,operation_id)
);
CREATE INDEX IF NOT EXISTS idx_pet_activity_receipts ON pet_operations(kind,created_at);
CREATE TABLE IF NOT EXISTS pet_achievements (
 auth_username TEXT NOT NULL REFERENCES auth_users(username) ON DELETE CASCADE,
 type_id TEXT NOT NULL,
 title TEXT NOT NULL,
 unlocked_at INTEGER NOT NULL,
 PRIMARY KEY(auth_username,type_id)
);
