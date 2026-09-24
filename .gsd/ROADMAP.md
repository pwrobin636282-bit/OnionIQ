# ROADMAP.md

> **Current Phase**: Not started
> **Milestone**: v1.0

## Must-Haves (from SPEC)
- [ ] Standardize image capture and quality assessment workflows.
- [ ] AI detects onions, size limits, and visible defects.
- [ ] Rules engine converts measurements to Grade A/URS/Rejected.
- [ ] Full Offline-First architecture ensuring reliable connectivity resyncing.
- [ ] Explainable/Auditable quality result and printable PDF digital report.

## Phases

### Phase 1: Foundation
**Status**: ⬜ Not Started
**Objective**: Build app shell, premium dark design system, authentication UI, and local lot SQLite model.
**Requirements**: REQ-01, REQ-12

### Phase 2: Standardized Capture
**Status**: ⬜ Not Started
**Objective**: Implement Create Lot + standardized camera/capture flow + image-quality validation states.
**Requirements**: REQ-01, REQ-02, REQ-03

### Phase 3: AI / CV Integration 
**Status**: ⬜ Not Started
**Objective**: CV service integration for detecting onions and defects, falling back to demo fixtures.
**Requirements**: REQ-04, REQ-05, REQ-06

### Phase 4: Deterministic Grading Layer
**Status**: ⬜ Not Started
**Objective**: Rules engine applied to characteristics to produce grades, Result screens with annotated Evidence.
**Requirements**: REQ-07, REQ-08, REQ-09, REQ-10

### Phase 5: Result & Sync
**Status**: ⬜ Not Started
**Objective**: Digital report generation (PDF view/export), local storage, and Sync Pending queue.
**Requirements**: REQ-11, REQ-12, REQ-13

### Phase 6: Core Backend APIs
**Status**: ⬜ Not Started
**Objective**: FastAPI backend, database schemas (PostgreSQL), JWT authentication, API sync endpoint, and Audit Logs.
**Requirements**: REQ-14

### Phase 7: Analytics (Optional/Future)
**Status**: ⬜ Not Started
**Objective**: Optional procurement analytics dashboard for aggregating centre-level data.

### Phase 8: Hardening & Testing
**Status**: ⬜ Not Started
**Objective**: Playwright E2E/Integration Testing, backend security checks, and Demo-Mode hardening for presentation.
