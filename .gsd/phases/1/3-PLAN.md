---
phase: 1
plan: 3
wave: 3
depends_on: 1.2
---

# Plan 1.3: Local SQLite Schema

## Objective
Implement Expo SQLite to create the stable local UUID-based database for lots and capture sessions to guarantee future idempotent synchronization.

## Context
- .gsd/SPEC.md
- .gsd/DECISIONS.md

## Tasks

<task type="auto">
  <name>Initialize SQLite Models</name>
  <files>apps/inspector-mobile/lib/db/database.ts, apps/inspector-mobile/lib/db/schema.ts</files>
  <action>
    - Install `expo-sqlite`. 
    - Construct the initial SQLite schema in `.ts` files:
      - `lots` table (requires stable UUIDs for `local_id`, `status`).
      - `capture_sessions` table mapping to lot UUIDs.
      - `evidence` tables.
    - Write a basic initialization routine to ensure these tables are created on app startup.
  </action>
  <verify>Get-Content apps/inspector-mobile/package.json</verify>
  <done>expo-sqlite is installed and db schema script is written with correct table structures.</done>
</task>

<task type="auto">
  <name>Database Health Check & Context</name>
  <files>apps/inspector-mobile/app/_layout.tsx, apps/inspector-mobile/components/DBHealth.tsx</files>
  <action>
    - Integrate the SQLite initialization hook into the main App layout so tables build correctly without freezing the UI.
    - Add a small text indicator or debug logger confirming the DB is "Healthy".
  </action>
  <verify>Select-String -Path apps/inspector-mobile/app/_layout.tsx -Pattern "sqlite" -SimpleMatch</verify>
  <done>App initializes database smoothly during startup.</done>
</task>

## Success Criteria
- [ ] SQLite schema accurately represents the required models for Phase 1 without relying on external APIs.
- [ ] Primary keys use UUIDv4s for offline synchronization support.
