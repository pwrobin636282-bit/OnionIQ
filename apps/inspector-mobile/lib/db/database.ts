import * as SQLite from 'expo-sqlite';
import { ALL_SCHEMA_STATEMENTS } from './schema';

const DB_NAME = 'oniongrade.db';

let _db: SQLite.SQLiteDatabase | null = null;

/**
 * Returns the singleton SQLite database instance.
 * Opens the DB on first call.
 */
export function getDatabase(): SQLite.SQLiteDatabase {
    if (!_db) {
        _db = SQLite.openDatabaseSync(DB_NAME);
    }
    return _db;
}

/**
 * Runs all CREATE TABLE IF NOT EXISTS statements.
 * Safe to call on every app startup (idempotent).
 */
export async function initDatabase(): Promise<void> {
    const db = getDatabase();
    // Run all schema statements synchronously inside a transaction
    db.execSync(ALL_SCHEMA_STATEMENTS.join('\n'));
    console.log('[DB] OnionGrade database initialized ✓');
}

/**
 * Health check — returns true if all expected tables exist.
 */
export async function checkDatabaseHealth(): Promise<boolean> {
    const db = getDatabase();
    const result = db.getAllSync<{ name: string }>(
        `SELECT name FROM sqlite_master WHERE type='table' AND name IN ('lots','capture_sessions','evidence');`
    );
    return result.length === 3;
}
