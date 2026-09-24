---
phase: 1
plan: 2
wave: 2
depends_on: 1.1
---

# Plan 1.2: Mock Authentication & UI Shell

## Objective
Build the authentication UI and implement local mock login (`operator123`/`password`) required for MVP testing, creating the base dashboard home screen.

## Context
- .gsd/DECISIONS.md
- apps/inspector-mobile/app/_layout.tsx

## Tasks

<task type="auto">
  <name>Implement Mock Login Screen</name>
  <files>apps/inspector-mobile/app/index.tsx, apps/inspector-mobile/components/Button.tsx, apps/inspector-mobile/components/Input.tsx</files>
  <action>
    - Create a Login screen as the `index` route.
    - Style the screen using the premium dark AI-native design system colors (Deep navy/charcoal background, Violet primary CTA).
    - Hardcode the mock logic: verify if username is `operator123` and password is `password`.
    - If successful, route user to the dashboard (`/home` or `/(tabs)/index`).
    - Create reusable custom `Button` and `Input` components styled via NativeWind/StyleSheet.
  </action>
  <verify>Get-Content apps/inspector-mobile/app/index.tsx</verify>
  <done>Mock auth logic exists and UI is styled with dark theme colors.</done>
</task>

<task type="auto">
  <name>Build Dashboard Skeleton</name>
  <files>apps/inspector-mobile/app/(tabs)/index.tsx</files>
  <action>
    - Create the authenticated home screen.
    - Design a placeholder layout featuring the "Hero card: Today’s inspected lots" and "KPI cards".
    - Use NativeWind block utilities for dark elevated styling (raised dark cards + thin borders).
  </action>
  <verify>Get-Content apps/inspector-mobile/app/(tabs)/index.tsx</verify>
  <done>Dashboard renders placeholder cards with appropriate CSS classes.</done>
</task>

## Success Criteria
- [ ] User can "log in" using the mock credentials.
- [ ] Authentication explicitly redirects to the dashboard screen.
- [ ] UI correctly matches the "Dark Premium" design requirements.
