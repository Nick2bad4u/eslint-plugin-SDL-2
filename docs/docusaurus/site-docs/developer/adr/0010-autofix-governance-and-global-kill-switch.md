---
title: ADR 0010 - Autofix Governance and Global Kill-Switch
description: Decision record for governing plugin autofix behavior via default safety semantics and runtime kill-switch settings.
sidebar_position: 10
---

# ADR 0010: Govern autofix behavior with safety-first defaults

- Status: Accepted
- Date: 2026-02-28

## Context

This plugin includes rules where some transformations are fully safe while others are report-only.

Autofix behavior must remain conservative and deterministic. If a rewrite is not
provably safe in all supported contexts, the rule should report (or suggest)
instead of automatically fixing.

## Decision

Adopt a formal autofix governance model:

1. Rules should only emit `fix` when safety is deterministic.
2. Rules should emit `suggest` for behavior-sensitive migrations.
3. Rule docs should specify whether a rule is report-only,
   suggestion-capable, or autofixable.

## Rationale

1. **Operational safety**: automated rewrites must preserve semantics.
2. **Predictable rollout**: teams can start with diagnostics and adopt fixes gradually.
3. **Consistent authoring**: rule authors follow one shared safety bar for fixes.

## Consequences

- Fix behavior is intentionally policy-driven, not purely rule-local.
- Rule authors must classify rewrites as deterministic (`fix`) vs contextual (`suggest`/report-only).
- Migration playbooks can stage adoption by enabling presets in phases.

## Revisit Triggers

Re-evaluate if:

- ESLint introduces stronger first-class fix governance primitives,
- the plugin requires finer-grained per-rule fix policy controls,
- or contributors report repeated unsafe-fix edge cases.
