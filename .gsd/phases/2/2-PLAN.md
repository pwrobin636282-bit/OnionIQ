---
phase: 2
plan: 1
wave: 1
---

# Plan 2.1: Lot Creation & Inspection Setup

## Objective
Implement the Create Lot workflow for OnionGrade AI, allowing an operator to create a local inspection lot with the required procurement and operator information.

## Context
- .gsd/SPEC.md
- .gsd/REQUIREMENTS.md
- .gsd/DECISIONS.md
- apps/inspector-mobile/lib/db/schema.ts
- apps/inspector-mobile/lib/db/database.ts
- Follow the existing premium dark AI-native design system.

## Requirements
- REQ-01

## Tasks

<task type="auto">
  <name>Build Create Lot screen</name>
  <files>apps/inspector-mobile/app/</files>
  <action>
    - Add a Create Lot screen accessible from the main dashboard.
    - Collect Centre, Supplier, Lot ID, Quantity, and Operator information.
    - Use the existing Button and Input components where appropriate.
    - Follow the premium dark OnionGrade AI visual system.
    - Provide clear validation for required fields.
  </action>
  <verify>Screen renders and required fields can be entered and validated.</verify>
  <done>Create Lot UI is functional and visually consistent with the existing app.</done>
</task>

<task type="auto">
  <name>Persist lot locally</name>
  <files>apps/inspector-mobile/lib/db/database.ts, apps/inspector-mobile/lib/db/schema.ts</files>
  <action>
    - Persist a newly created lot using a stable UUID.
    - Store the required lot metadata in the existing SQLite schema.
    - Keep the implementation compatible with future PostgreSQL synchronization.
  </action>
  <verify>Creating a lot stores the record locally and the database health check remains valid.</verify>
  <done>A created lot survives app navigation/reload through local SQLite persistence.</done>
</task>

<task type="auto">
  <name>Add dashboard entry point</name>
  <files>apps/inspector-mobile/app/index.tsx</files>
  <action>
    - Replace the current generic inspection entry point with a clear "Start New Inspection" action.
    - Navigate the operator to Create Lot.
  </action>
  <verify>Dashboard action opens the Create Lot screen.</verify>
  <done>The inspection workflow can be started from the dashboard.</done>
</task>
