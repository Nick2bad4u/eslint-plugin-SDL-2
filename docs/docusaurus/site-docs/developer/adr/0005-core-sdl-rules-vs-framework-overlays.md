---
title: ADR 0005 - Core SDL Rules vs Framework Overlays
description: Decision record for keeping broad SDL baseline rules and framework-specific overlays as distinct families.
sidebar_position: 5
---

# ADR 0005: Keep core SDL rules and framework overlays as separate families

- Status: Accepted
- Date: 2026-02-25

## Context

The plugin enforces multiple SDL rule families with different operational scope:

1. **Core SDL rules** (`no-insecure-url`, `no-insecure-random`, `no-inner-html`, etc.).
2. **Framework/runtime overlay rules** (`no-angular-*`, `no-angularjs-*`, `no-electron-*`, `no-unsafe-alloc`).

Mixing these categories into one conceptual family makes rollout planning harder because framework overlays are environment-specific while core API hardening applies broadly.

## Decision

Keep explicit rule families and document them as separate design tracks:

- Core SDL rules are the baseline security layer.
- Framework/runtime overlays are additive and enabled by dedicated presets.

Rule docs, release notes, and migration guidance should continue to preserve this split.

## Rationale

1. **Clear risk model**: global API hardening can be enabled early; framework overlays are activated only where relevant.
2. **Cleaner rollout strategy**: teams can phase common, framework, and runtime rules independently.
3. **Better docs quality**: preset guidance maps cleanly to deployment surface (browser, Node, Electron, Angular, AngularJS).

## Consequences

- Documentation and changelogs should explicitly label which family a rule belongs to.
- New rules should declare category intent up front during design/review.

## Revisit Triggers

Re-evaluate if:

- users report that preset boundaries no longer map to real deployment surfaces.
