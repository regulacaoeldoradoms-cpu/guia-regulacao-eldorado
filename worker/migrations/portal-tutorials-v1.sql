-- Prepare locally only. Production application requires separate authorization.
-- Uses the same authenticated username identity as the portal's pet achievements.
CREATE TABLE IF NOT EXISTS portal_tutorial_completions (
  auth_username TEXT NOT NULL,
  tutorial_id TEXT NOT NULL CHECK (tutorial_id = 'citizen'),
  version INTEGER NOT NULL CHECK (version = 1),
  completed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (auth_username, tutorial_id, version)
);
