-- Provision only after review, against the intended preview control database.
-- No enabled window, user, Drive file ID, credentials or document data is seeded.
CREATE TABLE IF NOT EXISTS document_drive_homologation_controls (
  control_id TEXT PRIMARY KEY,
  enabled INTEGER NOT NULL DEFAULT 0 CHECK (enabled IN (0, 1)),
  expires_at INTEGER NOT NULL,
  allowed_username TEXT NOT NULL,
  allowed_file_ids_json TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS document_drive_homologation_sessions (
  control_id TEXT NOT NULL,
  sync_id TEXT PRIMARY KEY,
  username TEXT NOT NULL,
  file_id TEXT NOT NULL,
  expires_at INTEGER NOT NULL
);
