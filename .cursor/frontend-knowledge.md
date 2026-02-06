SMARTSTORE FRONTEND – KNOWLEDGE BASE

PRODUCT PURPOSE (FRONTEND VIEW)
SmartStore is a seller-side dashboard to manage and publish:
- Catalog (SKUs, product attributes, media)
- Taxonomy & Mapping (category + attribute mapping across marketplaces)
- Inventory (stock, warehouse quantities, reservations)
- Pricing (rules, guardrails, marketplace pricing)
- Sync Jobs (status, retries, failures, audit trails)
- Orders (ingestion + normalized views) [optional]

The UI must emphasize:
- clarity of state
- auditability (what happened, when, why)
- safe operations (confirmations, previews, rollback paths)

CORE UX PRINCIPLES
1) Canonical-first editing
- Users edit canonical SKU data.
- Marketplace-specific outputs are derived and previewed.
- Never confuse canonical data with marketplace representation.

2) Sync is risky, UX must be safe
- Sync actions require:
  - confirmation
  - clear scope (which marketplaces, which fields)
  - dry-run/validation preview where feasible
- Show “last known good” and “current attempt”.

3) Debuggability and transparency
- Every screen should have:
  - correlationId / jobId visibility (copy button)
  - link to ledger/audit events for that entity
- Failures must be actionable: show reason + next step.

IMPORTANT UI ENTITIES (GLOSSARY)
- Seller / Workspace: top-level context switch.
- SKU: canonical product unit in SmartStore.
- Marketplace Listing: marketplace-specific representation of SKU.
- Mapping Rule: how a canonical field maps/transforms to marketplace schema.
- Sync Job: orchestration record for publishing updates to marketplaces.
- Sync Step: one action in a job (validate, transform, publish).
- Sync Ledger: immutable log of attempts/outcomes.
- Fail-safe State: paused/rollback/last-known-good metadata.

KEY SCREENS (MVP)
- Dashboard (high-level health: sync failures, pending mappings, inventory alerts)
- Catalog
  - SKU list (search/filter)
  - SKU detail (canonical form + validation + history)
  - Marketplace preview tab
- Taxonomy & Mapping
  - mapping table: canonical field ↔ marketplace field with confidence, transforms
  - missing required fields / errors list
- Inventory
  - stock by warehouse
  - change log
- Pricing
  - base price + rule engine UI
- Sync
  - job list
  - job detail timeline (steps + retries + payload preview)
- Admin/Support (internal)
  - global search (seller, sku, jobId)
  - manual requeue / pause / rollback actions

DATA BEHAVIOR EXPECTATIONS
- Prefer server-driven pagination for large lists.
- Always support:
  - search
  - filters
  - sorting
- Optimistic UI is allowed ONLY where idempotency exists; otherwise show in-progress states.

ERROR & LOADING EXPECTATIONS
- All API calls return or include correlationId.
- UI shows consistent error codes and friendly messages.
- Skeleton loading for data-heavy pages.
- Empty states must guide user action.

NON-GOALS (FOR NOW)
- No complex real-time collaboration.
- No premature websockets unless explicitly required.
- No heavy charting unless needed; keep UI simple and fast.
