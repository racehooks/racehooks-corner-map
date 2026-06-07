/**
 * Circuit coverage test for @racehooks/corner-map
 *
 * Verifies that:
 * 1. All 24 circuits are present in listCircuits()
 * 2. Each circuit has at least 5 corners
 * 3. Each circuit has required fields
 * 4. getCircuitCornerMap returns correct data
 */

import { getCircuitCornerMap, listCircuits } from "../index.js";

const EXPECTED_CIRCUITS = [
  "bahrain",
  "jeddah",
  "melbourne",
  "shanghai",
  "miami",
  "imola",
  "monaco",
  "barcelona",
  "montreal",
  "silverstone",
  "budapest",
  "spa",
  "zandvoort",
  "monza",
  "baku",
  "singapore",
  "austin",
  "mexico-city",
  "interlagos",
  "las-vegas",
  "qatar",
  "abu-dhabi",
  "suzuka",
  "portimao",
];

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string): void {
  if (condition) {
    console.log(`  PASS: ${message}`);
    passed++;
  } else {
    console.error(`  FAIL: ${message}`);
    failed++;
  }
}

// ─── Test 1: All 24 circuits present ──────────────────────────────────────

console.log("\nTest 1: All 24 circuits present in listCircuits()");
const circuits = listCircuits();
assert(
  circuits.length === EXPECTED_CIRCUITS.length,
  `listCircuits() returns ${EXPECTED_CIRCUITS.length} circuits (got ${circuits.length})`
);

const circuitIds = circuits.map((c) => c.circuitId);
for (const expected of EXPECTED_CIRCUITS) {
  assert(
    circuitIds.includes(expected),
    `Circuit "${expected}" is present`
  );
}

// ─── Test 2: Each circuit has at least 5 corners ──────────────────────────

console.log("\nTest 2: Each circuit has at least 5 corners");
for (const circuitId of EXPECTED_CIRCUITS) {
  const map = getCircuitCornerMap(circuitId);
  assert(map !== null, `getCircuitCornerMap("${circuitId}") returns a value`);
  if (map !== null) {
    assert(
      map.corners.length >= 5,
      `"${circuitId}" has at least 5 corners (has ${map.corners.length})`
    );
  }
}

// ─── Test 3: Required fields present ──────────────────────────────────────

console.log("\nTest 3: Required fields on each circuit");
for (const circuitId of EXPECTED_CIRCUITS) {
  const map = getCircuitCornerMap(circuitId);
  if (map !== null) {
    assert(
      typeof map.circuitId === "string" && map.circuitId.length > 0,
      `"${circuitId}" has circuitId field`
    );
    assert(
      typeof map.name === "string" && map.name.length > 0,
      `"${circuitId}" has name field`
    );
    assert(
      typeof map.country === "string" && map.country.length > 0,
      `"${circuitId}" has country field`
    );
    assert(
      typeof map.lapLengthKm === "number" && map.lapLengthKm > 0,
      `"${circuitId}" has valid lapLengthKm (${map.lapLengthKm} km)`
    );
    assert(
      Array.isArray(map.corners),
      `"${circuitId}" has corners array`
    );
  }
}

// ─── Test 4: Corner data validity ─────────────────────────────────────────

console.log("\nTest 4: Corner data validity");
const validTypes = ["hairpin", "slow", "medium", "fast", "chicane"];
for (const circuitId of EXPECTED_CIRCUITS) {
  const map = getCircuitCornerMap(circuitId);
  if (map !== null) {
    let cornerNumbersValid = true;
    let cornerTypesValid = true;
    for (const corner of map.corners) {
      if (typeof corner.number !== "number" || corner.number < 1) {
        cornerNumbersValid = false;
      }
      if (!validTypes.includes(corner.type)) {
        cornerTypesValid = false;
      }
    }
    assert(cornerNumbersValid, `"${circuitId}" all corners have valid numbers`);
    assert(cornerTypesValid, `"${circuitId}" all corners have valid types`);
  }
}

// ─── Test 5: getCircuitCornerMap returns null for unknown circuits ─────────

console.log("\nTest 5: Unknown circuit returns null");
assert(
  getCircuitCornerMap("does-not-exist") === null,
  `getCircuitCornerMap("does-not-exist") returns null`
);
assert(
  getCircuitCornerMap("") === null,
  `getCircuitCornerMap("") returns null`
);

// ─── Test 6: Monaco has correct iconic corners ────────────────────────────

console.log("\nTest 6: Monaco has iconic corners");
const monaco = getCircuitCornerMap("monaco");
if (monaco) {
  const hairpins = monaco.corners.filter((c) => c.type === "hairpin");
  assert(
    hairpins.length >= 1,
    `Monaco has at least 1 hairpin (has ${hairpins.length})`
  );
  const grandHotel = monaco.corners.find((c) =>
    c.name?.includes("Grand Hotel") || c.name?.includes("Hairpin")
  );
  assert(
    grandHotel !== undefined,
    `Monaco has Grand Hotel Hairpin corner`
  );
  const chicanes = monaco.corners.filter((c) => c.type === "chicane");
  assert(
    chicanes.length >= 1,
    `Monaco has at least 1 chicane (has ${chicanes.length})`
  );
}

// ─── Test 7: DRS zones are present ────────────────────────────────────────

console.log("\nTest 7: DRS zones are annotated");
const circuitsWithDrs = EXPECTED_CIRCUITS.filter((id) => {
  const map = getCircuitCornerMap(id);
  return map?.corners.some((c) => c.hasDrsZoneAfter === true);
});
assert(
  circuitsWithDrs.length >= 15,
  `At least 15 circuits have DRS zones annotated (has ${circuitsWithDrs.length})`
);

// ─── Results ───────────────────────────────────────────────────────────────

console.log(`\n${"─".repeat(50)}`);
console.log(`Results: ${passed} passed, ${failed} failed`);

if (failed > 0) {
  console.error(`\n${failed} test(s) failed.`);
  process.exit(1);
} else {
  console.log("\nAll circuit coverage tests passed.");
}
