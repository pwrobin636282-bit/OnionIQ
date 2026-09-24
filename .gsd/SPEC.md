# SPEC.md — Project Specification

> **Status**: `FINALIZED`

## Vision
OnionGrade AI is an AI-assisted digital onion assaying application to standardize visible external quality assessment for procurement centres, converting computer-vision measurements into deterministic Grade A/URS outcomes, resulting in a consistent and auditable digital quality report.

## Goals
1. Standardize image capture and visible external-quality assessment workflows.
2. Detect onions and relevant visible defects (cracks, sprouting, rot, etc.) from representative samples.
3. Calculate lot-level Grade A, URS, and Rejected proportions using a deterministic rules engine.
4. Generate an explainable, evidence-backed digital quality assessment report instantly.
5. Provide continuous offline-first capability for disconnected procurement centers.

## Non-Goals (Out of Scope)
- No claim of 100% AI accuracy or fully autonomous grading (human remains in the loop).
- No hidden internal rot, density, internal fungal infection tracking (camera relies purely on visible external traits).
- No direct government-system integrations in MVP without APIs.
- No farmer-facing accounts for MVP (primarily inspector operated).
- No custom foundational model training.

## Users
- **Procurement Inspector / Operator**: Primary user operating the app to capture, review, and confirm assessments.
- **Procurement Centre Supervisor**: Can review low-confidence/disputed cases (often operates in dispute review).
- **Agency / Analyst**: Views aggregated centre-level trends on dashboards (Phase 7).

## Constraints
- **Technical**: Mobile-first architecture (React Native / Expo), backend in Python/FastAPI using PostgreSQL/SQLite and accessible AI frameworks (YOLO). Must function in offline-first mode. All tools should utilize free/open-source tiers for development.
- **Timeline**: Hackathon SIH26031 constraints (built in discrete phases maintaining a Demo Mode fallback).
- **Environment**: Must work reliably in environments with poor connectivity and accommodate variable lighting scenarios (mitigated by capture guardrails).

## Success Criteria
- [ ] Workflow completion: 100% of seeded/demo lots can complete Create → Capture → Result → Report without error.
- [ ] Explainability coverage: 100% of demo results show evidence and rule rationale without opaque LLM decisions.
- [ ] Offline reliability: A demo lot remains intact after network loss and successfully syncs once restored.
- [ ] Rule consistency: Measured characteristics deterministically match defined grading outcomes every time.
