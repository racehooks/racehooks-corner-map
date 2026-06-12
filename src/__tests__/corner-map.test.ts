import {
  getCircuitCornerMap,
  listCircuits,
  getCircuitsWithDrs,
  findCornersByType,
} from "../index.js";

const EXPECTED_CIRCUITS = [
  "bahrain", "jeddah", "melbourne", "shanghai", "miami", "imola", "monaco",
  "barcelona", "montreal", "silverstone", "budapest", "spa", "zandvoort",
  "monza", "baku", "singapore", "austin", "mexico-city", "interlagos",
  "las-vegas", "qatar", "abu-dhabi", "suzuka", "austria", "portimao",
];

describe("listCircuits", () => {
  it("returns all 25 circuits", () => {
    expect(listCircuits()).toHaveLength(25);
  });

  it("includes all expected circuit IDs", () => {
    const ids = listCircuits().map((c) => c.circuitId);
    for (const id of EXPECTED_CIRCUITS) {
      expect(ids).toContain(id);
    }
  });

  it("each entry has circuitId, name, and country", () => {
    for (const c of listCircuits()) {
      expect(typeof c.circuitId).toBe("string");
      expect(c.circuitId.length).toBeGreaterThan(0);
      expect(typeof c.name).toBe("string");
      expect(c.name.length).toBeGreaterThan(0);
      expect(typeof c.country).toBe("string");
      expect(c.country.length).toBeGreaterThan(0);
    }
  });
});

describe("getCircuitCornerMap", () => {
  it("returns null for unknown circuit", () => {
    expect(getCircuitCornerMap("does-not-exist")).toBeNull();
    expect(getCircuitCornerMap("")).toBeNull();
  });

  it.each(EXPECTED_CIRCUITS)("%s — at least 5 corners", (id) => {
    const map = getCircuitCornerMap(id);
    expect(map).not.toBeNull();
    expect(map!.corners.length).toBeGreaterThanOrEqual(5);
  });

  it.each(EXPECTED_CIRCUITS)("%s — required top-level fields", (id) => {
    const map = getCircuitCornerMap(id)!;
    expect(map.circuitId).toBe(id);
    expect(typeof map.name).toBe("string");
    expect(typeof map.country).toBe("string");
    expect(map.lapLengthKm).toBeGreaterThan(0);
    expect(Array.isArray(map.corners)).toBe(true);
  });

  it.each(EXPECTED_CIRCUITS)("%s — corners have valid numbers and types", (id) => {
    const validTypes = new Set(["hairpin", "slow", "medium", "fast", "chicane"]);
    const map = getCircuitCornerMap(id)!;
    for (const corner of map.corners) {
      expect(corner.number).toBeGreaterThanOrEqual(1);
      expect(validTypes.has(corner.type)).toBe(true);
    }
  });

  it("monaco has Grand Hotel hairpin and at least one chicane", () => {
    const monaco = getCircuitCornerMap("monaco")!;
    expect(monaco.corners.filter((c) => c.type === "hairpin").length).toBeGreaterThanOrEqual(1);
    expect(
      monaco.corners.find((c) => c.name?.includes("Grand Hotel") || c.name?.includes("Hairpin"))
    ).toBeDefined();
    expect(monaco.corners.filter((c) => c.type === "chicane").length).toBeGreaterThanOrEqual(1);
  });

  it("austria has hairpin corners with DRS", () => {
    const austria = getCircuitCornerMap("austria")!;
    expect(austria.lapLengthKm).toBeCloseTo(4.318, 2);
    expect(austria.corners.filter((c) => c.type === "hairpin").length).toBeGreaterThanOrEqual(1);
    expect(austria.corners.some((c) => c.hasDrsZoneAfter === true)).toBe(true);
  });
});

describe("getCircuitsWithDrs", () => {
  it("returns at least 15 circuits", () => {
    expect(getCircuitsWithDrs().length).toBeGreaterThanOrEqual(15);
  });

  it("every returned circuit actually has a DRS corner", () => {
    for (const entry of getCircuitsWithDrs()) {
      const map = getCircuitCornerMap(entry.circuitId)!;
      expect(map.corners.some((c) => c.hasDrsZoneAfter === true)).toBe(true);
    }
  });
});

describe("findCornersByType", () => {
  it("finds hairpins across all circuits", () => {
    const hairpins = findCornersByType("hairpin");
    expect(hairpins.length).toBeGreaterThan(0);
    for (const { corner } of hairpins) {
      expect(corner.type).toBe("hairpin");
    }
  });

  it("each result has a circuitId that exists", () => {
    const results = findCornersByType("chicane");
    const ids = new Set(EXPECTED_CIRCUITS);
    for (const { circuitId } of results) {
      expect(ids.has(circuitId)).toBe(true);
    }
  });
});
