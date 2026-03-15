# ESLint Benchmark Suite

This directory contains **meaningful ESLint performance benchmarks** for `eslint-plugin-sdl-2`.

The suite intentionally measures complementary SDL workloads:

- **Real invalid corpus benchmarks** against SDL-specific fixtures (`compat-no-insecure-url` / `compat-no-insecure-random`).
- **Valid corpus benchmarks** against `test/fixtures/ts/estree.ts` to track near-clean traversal overhead.
- **Curated zero-message benchmark** against `benchmarks/fixtures/recommended-zero-message.baseline.ts` for a steady-state baseline.
- **Preset-focused benchmarks** (`common`, `recommended`, `required`) to detect config-level regressions.
- **Single-rule stress benchmarks** for `sdl/no-insecure-url` (with and without fixes) and `sdl/no-insecure-random`.

## Why this is meaningful

- Uses actual fixture corpora already maintained by rule tests.
- Uses typed linting (`parserOptions.project` with `tsconfig.eslint.json`) to include TypeScript checker overhead where applicable.
- Includes both **fix=false** and **fix=true** scenarios so autofix cost is visible.
- Captures ESLint timing data (`result.stats`) instead of relying only on wall-clock time.

## Run benchmarks

### Default benchmark runner

```bash
npm run bench
```

This runs `benchmarks/run-eslint-stats.mjs` and writes JSON to `coverage/benchmarks/eslint-stats.json`.

### ESLint stats summary runner

```bash
npm run bench:eslint:stats
```

This writes scenario metrics to `coverage/benchmarks/eslint-stats.json`.

### Optional Vitest benchmark mode (experimental)

```bash
npm run bench:watch
```

This executes `benchmarks/**/*.bench.*` and writes benchmark JSON to `coverage/bench-results.json`.

## Rule benchmark conventions (`eslint-rule-benchmark`)

- The rule benchmark config is loaded from `benchmark/config.ts` via:

  ```bash
  npm run bench:rule-benchmark
  ```

- Benchmark case files under `benchmark/cases/**` use `.ts` extensions.

- The benchmark rule path should point to source rule modules (for example `../src/rules/<rule-id>.ts`) so local rule edits are benchmarked directly.

- Keep warmup/iteration defaults in `benchmark/config.ts` at meaningful levels for stable comparisons; only lower them temporarily for local smoke checks.

- We intentionally run `eslint-rule-benchmark run` without `--config` because the current CLI fails to load the TypeScript config file when an explicit config path is passed on Windows.

### CLI TIMING + --stats (ESLint docs-aligned)

```bash
npm run bench:eslint:timing
```

This command enables `TIMING=all` and `--stats` to mirror ESLint's documented rule timing workflow.

## Interpreting results

- Use `recommended-invalid-corpus` as your baseline for day-to-day regressions.
- Use `recommended-valid-corpus` to measure steady-state cost on already-correct code paths.
- Use `common-zero-message-corpus` for a strict zero-violation steady-state baseline.
- Use single-rule stress scenarios to isolate specific rule regressions before broad config runs.
- Compare `single-rule-no-insecure-url-fix` with non-fix scenarios to estimate fixer overhead.
