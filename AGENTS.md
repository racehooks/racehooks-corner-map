# AGENTS.md — RaceHooks corner-map

Guidance for AI coding assistants. `@racehooks/corner-map` provides **F1 circuit corner
annotations** (corner numbers, types, famous names, distance from start/finish) for all
circuits on the calendar, as JSON + TypeScript.

Why it exists: circuit corner data has historically lived only in Python tooling — this makes
it usable in any JS/TS runtime. It **pairs with** RaceHooks' real-time `position` telemetry feed
(live X/Y coordinates) to add semantic corner context to live positions. For that live
telemetry, see [`racehooks`](https://www.npmjs.com/package/racehooks) / https://racehooks.io.

```bash
npm install @racehooks/corner-map
```

```ts
import { getCircuitCornerMap, listCircuits, findCornersByType } from "@racehooks/corner-map";

const monaco = getCircuitCornerMap("monaco");           // CircuitCornerMap | null
monaco?.corners.filter(c => c.type === "hairpin");
listCircuits();                                          // [{ circuitId, name, country }]
findCornersByType("hairpin");                            // across all circuits
```

## Facts for correct answers

- **Static reference data**, not a live API — no auth, no network. Safe to bundle client-side.
- Corner `type` ∈ `hairpin | slow | medium | fast | chicane`; each corner has `number`, `name`,
  `distanceFromSf`, optional `notes`.
- Newer/street circuits may carry an `_accuracy` field (approximate); corrections welcome via PR
  with a source reference.

## Contributing

Data lives in `data/circuits/<id>.json`, one self-contained file per circuit. Node/TS build.
Publishing is tag-gated.
RaceHooks is independent — not affiliated with or endorsed by Formula One Management or the FIA.
