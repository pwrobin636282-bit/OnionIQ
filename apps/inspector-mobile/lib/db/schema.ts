/**
 * OnionGrade AI — Local SQLite Schema (Phase 1)
 *
 * All primary keys use UUIDv4 (generated via expo-crypto) to guarantee
 * idempotent sync with the future PostgreSQL backend.
 */

export const CREATE_LOTS_TABLE = `
  CREATE TABLE IF NOT EXISTS lots (
    local_id       TEXT PRIMARY KEY,
    server_id      TEXT,
    lot_number     TEXT NOT NULL,
    farmer_name    TEXT,
    origin_region  TEXT,
    variety        TEXT,
    gross_weight_kg REAL,
    status         TEXT NOT NULL DEFAULT 'draft',
    grade_result   TEXT,
    grade_a_pct    REAL,
    urs_pct        REAL,
    reject_pct     REAL,
    operator_id    TEXT,
    created_at     TEXT NOT NULL,
    updated_at     TEXT NOT NULL,
    synced_at      TEXT
  );
`;

export const CREATE_CAPTURE_SESSIONS_TABLE = `
  CREATE TABLE IF NOT EXISTS capture_sessions (
    local_id       TEXT PRIMARY KEY,
    server_id      TEXT,
    lot_local_id   TEXT NOT NULL REFERENCES lots(local_id) ON DELETE CASCADE,
    sample_count   INTEGER NOT NULL DEFAULT 0,
    status         TEXT NOT NULL DEFAULT 'in_progress',
    started_at     TEXT NOT NULL,
    completed_at   TEXT,
    synced_at      TEXT
  );
`;

export const CREATE_EVIDENCE_TABLE = `
  CREATE TABLE IF NOT EXISTS evidence (
    local_id            TEXT PRIMARY KEY,
    server_id           TEXT,
    capture_session_id  TEXT NOT NULL REFERENCES capture_sessions(local_id) ON DELETE CASCADE,
    image_uri           TEXT NOT NULL,
    defect_type         TEXT,
    defect_pct          REAL,
    confidence          REAL,
    is_grade_a          INTEGER NOT NULL DEFAULT 0,
    created_at          TEXT NOT NULL,
    synced_at           TEXT
  );
`;

export const ALL_SCHEMA_STATEMENTS = [
    CREATE_LOTS_TABLE,
    CREATE_CAPTURE_SESSIONS_TABLE,
    CREATE_EVIDENCE_TABLE,
];
