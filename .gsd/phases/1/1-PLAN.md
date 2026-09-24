---
phase: 1
plan: 1
wave: 1
---

# Plan 1.1: App Shell & Navigation Foundation

## Objective
Initialize the React Native application using Expo Router and NativeWind to establish the core app shell and styling system based on the premium dark AI-native design guidelines.

## Context
- .gsd/SPEC.md
- .gsd/DECISIONS.md
- Use standard React Native + Expo documentation.

## Tasks

<task type="auto">
  <name>Scaffold Expo App</name>
  <files>apps/inspector-mobile/package.json, apps/inspector-mobile/app/_layout.tsx</files>
  <action>
    - Create the base Expo app inside the `apps` folder using `npx create-expo-app@latest inspector-mobile --template tabs` inside the `apps/` directory (create `apps/` if it doesn't exist).
    - Ensure typescript is configured by verifying `tsconfig.json`.
    - Do NOT run the dev server yet.
  </action>
  <verify>Get-Content apps/inspector-mobile/package.json</verify>
  <done>package.json exists and expo-router is in dependencies</done>
</task>

<task type="auto">
  <name>Configure NativeWind & Styling</name>
  <files>apps/inspector-mobile/tailwind.config.js, apps/inspector-mobile/babel.config.js, apps/inspector-mobile/app/global.css</files>
  <action>
    - Implement NativeWind for Tailwind CSS styling.
    - Run `npm install nativewind tailwindcss react-native-reanimated` inside `apps/inspector-mobile`.
    - Initialize Tailwind (`npx tailwindcss init`).
    - Update `tailwind.config.js` with content paths (`app/**/*.{js,jsx,ts,tsx}`, etc.).
    - Update `babel.config.js` to include the `nativewind/babel` plugin if using older versions, or configure according to NativeWind v4 docs.
    - Create a global css file for the dark theme.
  </action>
  <verify>Get-Content apps/inspector-mobile/tailwind.config.js</verify>
  <done>Tailwind config includes proper content paths and nativewind module is installed.</done>
</task>

## Success Criteria
- [ ] Expo project scaffolds successfully with routing.
- [ ] NativeWind and TailwindCSS are properly integrated.
