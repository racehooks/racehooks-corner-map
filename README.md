# @racehooks/corner-map

F1 circuit corner annotations for all 25 circuits on the calendar: corner numbers, types, famous names, and distances from the start/finish line.

FastF1 has circuit corner data but only via Python. This package makes it accessible in any language via JSON + TypeScript.

For real-time positional telemetry delivery (X/Y coordinates at 3.7 Hz), see [racehooks.io](https://racehooks.io).

> RaceHooks is an independent service and is not affiliated with or endorsed by Formula One Management or the FIA. "Formula 1," "F1," and related marks are trademarks of Formula One Licensing BV.

## Installation

```bash
npm install @racehooks/corner-map
# or
yarn add @racehooks/corner-map
```

## Usage

```typescript
import {
  getCircuitCornerMap,
  listCircuits,
  type CircuitCornerMap,
  type CornerAnnotation,
} from '@racehooks/corner-map';

// Get corner data for a specific circuit
const monaco = getCircuitCornerMap('monaco');
// → CircuitCornerMap | null

if (monaco) {
  console.log(`${monaco.name}: ${monaco.corners.length} corners`);
  // → "Circuit de Monaco: 15 corners"

  const hairpins = monaco.corners.filter(c => c.type === 'hairpin');
  const drsZones = monaco.corners.filter(c => c.hasDrsZoneAfter);

  hairpins.forEach(c => {
    console.log(`${c.name} (T${c.number}) — ${c.distanceFromSf}m from S/F`);
  });
}

// List all available circuits
const circuits = listCircuits();
// → Array<{ circuitId: string, name: string, country: string }>

circuits.forEach(c => console.log(`${c.circuitId}: ${c.name}`));
```

### Annotating position telemetry

RaceHooks delivers positional telemetry (X/Y coordinates at 3.7 Hz) via the `position` webhook feed. Use this package to add semantic corner context:

```typescript
import { getCircuitCornerMap } from '@racehooks/corner-map';

// position payload from your RaceHooks webhook contains X/Y per driver
function annotatePosition(
  positionPayload: { Entries: Record<string, { X: number; Y: number }> },
  circuitId: string
) {
  const cornerMap = getCircuitCornerMap(circuitId);
  if (!cornerMap) return;

  // cornerMap.corners provides semantic context for each section of circuit
  // Use distanceFromSf to correlate approximate position with corner context

  const cornersWithDrs = cornerMap.corners.filter(c => c.hasDrsZoneAfter);
  console.log(`DRS zones at: ${cornersWithDrs.map(c => c.name || `T${c.number}`).join(', ')}`);
}
```

### Finding corners across circuits

```typescript
import { findCornersByType } from '@racehooks/corner-map';

const allHairpins = findCornersByType('hairpin');
// → Array<{ circuitId: string, corner: CornerAnnotation }>
```

---

## Circuit Coverage

All 25 circuits on the F1 calendar are included. Corner counts reflect the official numbered corners.

| Circuit ID    | Name                                       | Country        | Corners |
|---------------|--------------------------------------------|----------------|---------|
| bahrain       | Bahrain International Circuit              | Bahrain        | 20      |
| jeddah        | Jeddah Corniche Circuit                    | Saudi Arabia   | 27      |
| melbourne     | Albert Park Circuit                        | Australia      | 16      |
| shanghai      | Shanghai International Circuit             | China          | 14      |
| miami         | Miami International Autodrome              | United States  | 17      |
| imola         | Autodromo Enzo e Dino Ferrari              | Italy          | 10      |
| monaco        | Circuit de Monaco                          | Monaco         | 15      |
| barcelona     | Circuit de Barcelona-Catalunya             | Spain          | 16      |
| montreal      | Circuit Gilles Villeneuve                  | Canada         | 14      |
| silverstone   | Silverstone Circuit                        | Great Britain  | 17      |
| budapest      | Hungaroring                                | Hungary        | 14      |
| spa           | Circuit de Spa-Francorchamps               | Belgium        | 15      |
| zandvoort     | Circuit Zandvoort                          | Netherlands    | 12      |
| monza         | Autodromo Nazionale Monza                  | Italy          | 7       |
| baku          | Baku City Circuit                          | Azerbaijan     | 18      |
| singapore     | Marina Bay Street Circuit                  | Singapore      | 23      |
| austin        | Circuit of the Americas                    | United States  | 20      |
| mexico-city   | Autodromo Hermanos Rodriguez               | Mexico         | 16      |
| interlagos    | Autodromo Jose Carlos Pace                 | Brazil         | 12      |
| las-vegas     | Las Vegas Street Circuit                   | United States  | 14      |
| qatar         | Lusail International Circuit               | Qatar          | 16      |
| abu-dhabi     | Yas Marina Circuit                         | UAE            | 17      |
| suzuka        | Suzuka International Racing Course         | Japan          | 12      |
| portimao      | Autodromo Internacional do Algarve         | Portugal       | 15      |
| austria       | Red Bull Ring                              | Austria        | 10      |

---

## Coordinate System Note

This package provides semantic corner annotations (number, type, name, distance from S/F line). For real-time X/Y positional telemetry at 3.7 Hz, RaceHooks delivers a `position` webhook feed — see [racehooks.io](https://racehooks.io).

Corner X/Y geometry can be derived by correlating telemetry position data with lap distance at the known corner distance values.

---

## Contributing

Corner data is sourced from public knowledge of F1 circuits. Some circuits (especially newer ones) are marked with an `_accuracy` field indicating the data is approximate.

To contribute corrections:

1. Fork the repository
2. Edit the relevant JSON file in `data/circuits/`
3. Open a pull request with a source reference (e.g., official circuit map, FIA document)

Each circuit JSON is self-contained — corrections are easy to make. Circuits with the `_accuracy` field especially benefit from community review:
- jeddah, baku, singapore, las-vegas, qatar, portimao

---

## Data Format

Each circuit is a JSON file in `data/circuits/<circuit-id>.json`:

```json
{
  "circuitId": "monaco",
  "name": "Circuit de Monaco",
  "country": "Monaco",
  "lapLengthKm": 3.337,
  "corners": [
    {
      "number": 1,
      "name": "Sainte Devote",
      "type": "slow",
      "distanceFromSf": 155,
      "notes": "First braking zone. Incident hotspot on lap 1."
    }
  ]
}
```

Corner types:
- `hairpin` — Very slow, < 60 km/h typically
- `slow` — Significant braking required
- `medium` — Medium-speed corner
- `fast` — Minimal or no braking
- `chicane` — Left-right or right-left chicane complex

---

## License

MIT

---

Built by [RaceHooks](https://racehooks.io) — real-time F1 webhook delivery for developers.
