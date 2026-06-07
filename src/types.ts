/**
 * Type definitions for @racehooks/corner-map
 */

/**
 * A single corner annotation on an F1 circuit.
 */
export interface CornerAnnotation {
  /** Corner number on circuit (1-based, 1, 2, 3...) */
  number: number;
  /** Famous corner name (e.g., "Eau Rouge", "La Source", "Raidillon") */
  name?: string;
  /**
   * Corner type classification.
   * - hairpin: Very slow, usually < 60 km/h minimum speed
   * - slow: Slow corner, significant braking required
   * - medium: Medium-speed corner
   * - fast: High-speed corner, minimal or no braking
   * - chicane: Left-right or right-left chicane complex
   */
  type: "hairpin" | "slow" | "medium" | "fast" | "chicane";
  /**
   * Approximate distance from start/finish line in meters.
   * Based on official circuit layout; approximate values.
   */
  distanceFromSf?: number;
  /**
   * Whether a DRS detection zone or activation zone follows this corner.
   * true = a DRS zone opens on the straight after this corner.
   */
  hasDrsZoneAfter?: boolean;
  /** Notes on strategic significance, famous incidents, or notable characteristics */
  notes?: string;
}

/**
 * Complete corner annotation database for one circuit.
 */
export interface CircuitCornerMap {
  /**
   * Circuit slug identifier.
   * Matches rh_circuit.circuit_id in the RaceHooks database.
   * e.g., "monaco", "silverstone", "spa"
   */
  circuitId: string;
  /** Human-readable circuit name (e.g., "Circuit de Monaco") */
  name: string;
  /** Country name (e.g., "Monaco", "Great Britain") */
  country: string;
  /** Official circuit lap length in kilometers */
  lapLengthKm: number;
  /** Ordered array of corner annotations (corner 1 first) */
  corners: CornerAnnotation[];
  /**
   * Optional accuracy note for circuits where corner details are approximate.
   * Community corrections welcome via github.com/racehooks/corner-map
   */
  _accuracy?: string;
}

/**
 * Summary entry for a circuit in the circuit list.
 */
export interface CircuitListEntry {
  circuitId: string;
  name: string;
  country: string;
}
