/**
 * @racehooks/corner-map
 *
 * F1 circuit corner annotations: corner numbers, types, names, and distances.
 *
 * For real-time telemetry position data delivery, see https://racehooks.io
 */

import type { CircuitCornerMap, CircuitListEntry } from "./types.js";

// Import all circuit data
import bahrain from "../data/circuits/bahrain.json";
import jeddah from "../data/circuits/jeddah.json";
import melbourne from "../data/circuits/melbourne.json";
import shanghai from "../data/circuits/shanghai.json";
import miami from "../data/circuits/miami.json";
import imola from "../data/circuits/imola.json";
import monaco from "../data/circuits/monaco.json";
import barcelona from "../data/circuits/barcelona.json";
import montreal from "../data/circuits/montreal.json";
import silverstone from "../data/circuits/silverstone.json";
import budapest from "../data/circuits/budapest.json";
import spa from "../data/circuits/spa.json";
import zandvoort from "../data/circuits/zandvoort.json";
import monza from "../data/circuits/monza.json";
import baku from "../data/circuits/baku.json";
import singapore from "../data/circuits/singapore.json";
import austin from "../data/circuits/austin.json";
import mexicoCity from "../data/circuits/mexico-city.json";
import interlagos from "../data/circuits/interlagos.json";
import lasVegas from "../data/circuits/las-vegas.json";
import qatar from "../data/circuits/qatar.json";
import abuDhabi from "../data/circuits/abu-dhabi.json";
import suzuka from "../data/circuits/suzuka.json";
import portimao from "../data/circuits/portimao.json";

// Circuit map by ID
const CIRCUIT_MAP: Record<string, CircuitCornerMap> = {
  "bahrain":      bahrain as CircuitCornerMap,
  "jeddah":       jeddah as CircuitCornerMap,
  "melbourne":    melbourne as CircuitCornerMap,
  "shanghai":     shanghai as CircuitCornerMap,
  "miami":        miami as CircuitCornerMap,
  "imola":        imola as CircuitCornerMap,
  "monaco":       monaco as CircuitCornerMap,
  "barcelona":    barcelona as CircuitCornerMap,
  "montreal":     montreal as CircuitCornerMap,
  "silverstone":  silverstone as CircuitCornerMap,
  "budapest":     budapest as CircuitCornerMap,
  "spa":          spa as CircuitCornerMap,
  "zandvoort":    zandvoort as CircuitCornerMap,
  "monza":        monza as CircuitCornerMap,
  "baku":         baku as CircuitCornerMap,
  "singapore":    singapore as CircuitCornerMap,
  "austin":       austin as CircuitCornerMap,
  "mexico-city":  mexicoCity as CircuitCornerMap,
  "interlagos":   interlagos as CircuitCornerMap,
  "las-vegas":    lasVegas as CircuitCornerMap,
  "qatar":        qatar as CircuitCornerMap,
  "abu-dhabi":    abuDhabi as CircuitCornerMap,
  "suzuka":       suzuka as CircuitCornerMap,
  "portimao":     portimao as CircuitCornerMap,
};

/**
 * Get corner annotations for a specific circuit.
 *
 * @param circuitId - The circuit slug (e.g., "monaco", "silverstone", "spa")
 * @returns CircuitCornerMap or null if the circuit is not found
 *
 * @example
 * const corners = getCircuitCornerMap('monaco');
 * if (corners) {
 *   console.log(`${corners.name}: ${corners.corners.length} corners`);
 *   const hairpins = corners.corners.filter(c => c.type === 'hairpin');
 * }
 */
export function getCircuitCornerMap(circuitId: string): CircuitCornerMap | null {
  return CIRCUIT_MAP[circuitId] ?? null;
}

/**
 * List all available circuits with their IDs, names, and countries.
 *
 * @returns Array of circuit summary objects
 *
 * @example
 * const circuits = listCircuits();
 * circuits.forEach(c => console.log(`${c.circuitId}: ${c.name}`));
 */
export function listCircuits(): CircuitListEntry[] {
  return Object.values(CIRCUIT_MAP).map((circuit) => ({
    circuitId: circuit.circuitId,
    name: circuit.name,
    country: circuit.country,
  }));
}

/**
 * Get all circuits that have at least one DRS zone.
 * Returns circuits where any corner has hasDrsZoneAfter = true.
 */
export function getCircuitsWithDrs(): CircuitListEntry[] {
  return Object.values(CIRCUIT_MAP)
    .filter((circuit) => circuit.corners.some((c) => c.hasDrsZoneAfter === true))
    .map((circuit) => ({
      circuitId: circuit.circuitId,
      name: circuit.name,
      country: circuit.country,
    }));
}

/**
 * Find corners of a specific type across all circuits.
 *
 * @param type - Corner type to filter by
 * @returns Array of { circuitId, corner } objects
 */
export function findCornersByType(
  type: "hairpin" | "slow" | "medium" | "fast" | "chicane"
): Array<{ circuitId: string; corner: import("./types.js").CornerAnnotation }> {
  const results: Array<{ circuitId: string; corner: import("./types.js").CornerAnnotation }> = [];
  for (const circuit of Object.values(CIRCUIT_MAP)) {
    for (const corner of circuit.corners) {
      if (corner.type === type) {
        results.push({ circuitId: circuit.circuitId, corner });
      }
    }
  }
  return results;
}

// Re-export types
export type { CircuitCornerMap, CornerAnnotation, CircuitListEntry } from "./types.js";
