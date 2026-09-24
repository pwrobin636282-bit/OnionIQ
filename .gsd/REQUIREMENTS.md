# REQUIREMENTS.md

## Format
| ID | Requirement | Source | Status |
|----|-------------|--------|--------|
| REQ-01 | **Lot Creation**: Create lot with centre, supplier, ID, quantity, and operator info. | SPEC Goal 1 | Pending |
| REQ-02 | **Standardized Capture**: App mandates capture guardrails (distance, lighting) before processing. | SPEC Goal 1 | Pending |
| REQ-03 | **Image Quality**: Perform basic QA checks (blur, occlusion) & provide recapture guidance. | SPEC Goal 1 | Pending |
| REQ-04 | **Onion Detection**: CV model to count and visualize onions in sample. | SPEC Goal 2 | Pending |
| REQ-05 | **Defect Detection**: Model spots visible rot, sprouting, cracks, skin loss etc. with evidence. | SPEC Goal 2 | Pending |
| REQ-06 | **Size Estimation**: Estimate diameters to flag undersized bulbs using reference scales. | SPEC Goal 2 | Pending |
| REQ-07 | **Rules Engine**: Convert measured items to grade deterministically. NO final LLM hallucinated grades. | SPEC Goal 3 | Pending |
| REQ-08 | **Lot-Level Grading**: Calculate consistent Lot-level Grade A, URS, and Other %. | SPEC Goal 3 | Pending |
| REQ-09 | **Confidence Review**: Route low confidence/ambiguous scenarios to Manual Review. | SPEC Goal 2 | Pending |
| REQ-10 | **Evidence Trail**: Store annotations, measurements, triggers & operator IDs. | SPEC Goal 4 | Pending |
| REQ-11 | **Digital Report**: Generate viewable/exportable digital PDF report summarizing details. | SPEC Goal 4 | Pending |
| REQ-12 | **Offline-First**: Mobile device supports end-to-end operation + syncs data once online. | SPEC Goal 5 | Pending |
| REQ-13 | **History**: Inspectors can search, review and verify lot states. | SPEC Goal 1 | Pending |
| REQ-14 | **Audit Log**: Immutable audit history over lifecycle events (applies to normal users). | SPEC Goal 4 | Pending |
