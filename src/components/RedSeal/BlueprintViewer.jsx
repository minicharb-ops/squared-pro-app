import React, { useState, useMemo, useEffect, useRef } from 'react'
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Layers,
  Info,
  CheckCircle2,
  Circle,
  Check,
  BookOpen,
  Award,
  Crosshair,
  FileSpreadsheet,
  HelpCircle,
  RotateCcw,
  ShieldCheck
} from 'lucide-react'
import blueprintsData from '../../data/RedSeal/blueprints.json'
import CadSpotlightStage, { CadLabel, CalloutPin } from './CadSpotlightStage'

// 10 Architectural / Structural Sheet Definitions
const SHEET_DEFINITIONS = [
  {
    page: 1,
    id: 'bp-01',
    sheetCode: 'A1.0',
    pillLabel: 'A1.0 Floor',
    fullTitle: 'Main Floor Plan',
    scale: 'Scale: 1/4" = 1\'-0" (1:50)'
  },
  {
    page: 2,
    id: 'bp-02',
    sheetCode: 'S1.0',
    pillLabel: 'S1.0 Found',
    fullTitle: 'Foundation Plan',
    scale: 'Scale: 1/4" = 1\'-0" (1:50)'
  },
  {
    page: 3,
    id: 'bp-03',
    sheetCode: 'A3.1',
    pillLabel: 'A3.1 Sect',
    fullTitle: 'Section Detail',
    scale: 'Scale: 1/2" = 1\'-0" (1:25)'
  },
  {
    page: 4,
    id: 'bp-04',
    sheetCode: 'E1.0',
    pillLabel: 'E1.0 Elec',
    fullTitle: 'Electrical Plan',
    scale: 'Scale: 1/4" = 1\'-0" (1:50)'
  },
  {
    page: 5,
    id: 'bp-05',
    sheetCode: 'P1.0',
    pillLabel: 'P1.0 Plumb',
    fullTitle: 'Plumbing Plan',
    scale: 'Scale: 1/4" = 1\'-0" (1:50)'
  },
  {
    page: 6,
    id: 'bp-06',
    sheetCode: 'S2.0',
    pillLabel: 'S2.0 Joist',
    fullTitle: 'Floor Framing',
    scale: 'Scale: 1/4" = 1\'-0" (1:50)'
  },
  {
    page: 7,
    id: 'bp-07',
    sheetCode: 'SP1',
    pillLabel: 'SP1 Site',
    fullTitle: 'Site Plan',
    scale: 'Scale: 1/8" = 1\'-0" (1:100)'
  },
  {
    page: 8,
    id: 'bp-08',
    sheetCode: 'R1.0',
    pillLabel: 'R1.0 Roof',
    fullTitle: 'Roof Framing',
    scale: 'Scale: 1/4" = 1\'-0" (1:50)'
  },
  {
    page: 9,
    id: 'bp-09',
    sheetCode: 'A2.1',
    pillLabel: 'A2.1 Elev',
    fullTitle: 'Front Elevation',
    scale: 'Scale: 1/4" = 1\'-0" (1:50)'
  },
  {
    page: 10,
    id: 'bp-10',
    sheetCode: 'A4.1',
    pillLabel: 'A4.1 Stair',
    fullTitle: 'Stair Details',
    scale: 'Scale: 3/8" = 1\'-0" (1:30)'
  }
]

// Supplemental Red Seal Masterclass items mapped across the 10 sheets
const ALL_INTERACTIVE_TAKEAWAYS = [
  {
    title: 'Section Marks',
    description: "Shows where a building cross-section is cut. Top half indicates Detail ID ('A') and bottom half indicates target sheet ('A4.2').",
    code: 'NBC 9.3 • Top = Detail ID, Bottom = Target Sheet, Arrow = Sight Direction',
    examFocus: 'Always face the same direction as the section arrow when interpreting left/right wall assemblies.'
  },
  {
    title: 'Dimension Strings',
    description: 'Architectural dimension strings on prints establish layouts, partition centerlines, and rough openings.',
    code: 'NBC 9.3 • "Do Not Scale" Rule — Written Dimensions Always Govern',
    examFocus: 'Never physically scale a print with a tape measure due to paper/digital distortion; calculate from written strings.'
  },
  {
    title: 'Window Symbols',
    description: 'Show window nominal size, opening type, and schedule tag (W01, W02) for headers and egress.',
    code: 'NBC 9.9.10.1 • Bedroom Egress Min 0.35 m² (3.77 ft²) & No Dim < 380mm (15")',
    examFocus: 'Bedroom egress windows must open from the inside without keys/tools and maintain >= 0.35 m² clear area.'
  },
  {
    title: 'Door Symbols',
    description: 'Represent door widths, rough openings, schedule tags (D01), and 90° swing arcs.',
    code: 'NBC 9.9.6 • Min Exit Door Clear Width & Swing Direction Rules',
    examFocus: 'Doors must never swing over a stair step without a full landing at least as wide as the door.'
  },
  {
    title: 'Staircase Symbols',
    description: 'Illustrate stair travel direction (arrow always points UP from floor plan datum) and riser/tread counts.',
    code: 'NBC 9.8.4 • Number of Treads (T) = Number of Risers (R) - 1',
    examFocus: 'A flight marked 14R always has 13 treads because the upper floor landing serves as the final step.'
  },
  {
    title: 'Weeping Tile Drainage',
    description: 'Perforated 100mm (4") subsurface drainage pipe laid around exterior footing perimeters.',
    code: 'NBC 9.14.3.1 • Min 100mm (4") Pipe Covered w/ >= 150mm (6") Clear Crushed Stone',
    examFocus: 'Relieves hydrostatic water pressure against foundation walls; discharges to storm sewer or sealed sump basin.'
  },
  {
    title: 'Step Footings',
    description: 'Stepped concrete strip footings transitioning foundation elevations across sloped terrain.',
    code: 'NBC 9.15.3.9 • Max Vertical Step Rise = 600mm (24") • Min Horizontal Run = 600mm (24")',
    examFocus: 'Maximum 1:1 step transition (600mm max rise / 600mm min level run) poured monolithically.'
  },
  {
    title: 'Frost Depth Foundations',
    description: 'Exterior foundation footings must bear below the regional frost penetration line.',
    code: 'NBC 9.12.2.2 • Footings Must Extend Below Frost Line (Typically 1.2m–1.8m)',
    examFocus: 'Prevents seasonal frost heave from lifting and cracking the structure.'
  },
  {
    title: 'Height Datums',
    description: 'Crosshair target markers (⊕) on sections and elevations indexing vertical floor and plate heights.',
    code: 'NBC 9.4 / Zoning • Benchmarks Track T.O.F., F.F.E., T.O.W., and Mean Roof Height',
    examFocus: 'Subtract lower datum from upper datum to find exact stud height or total stair rise.'
  },
  {
    title: 'Rain Screen Cladding',
    description: 'Drained and vented cavity assembly behind exterior siding to prevent moisture rot.',
    code: 'NBC 9.27.2.4 • Min 10mm (3/8") Capillary Drainage Gap via Vertical Strapping',
    examFocus: 'Allows bulk water drainage and convective air drying over the weather-resistant barrier (WRB).'
  },
  {
    title: 'CEC Working Clearance',
    description: 'Mandatory unobstructed floor space required in front of electrical service panels.',
    code: 'CEC Rule 2-308 / 6-200 • Min 1.0m (39") Unobstructed Front Clearance & 1.85m Headroom',
    examFocus: 'Electrical panels are strictly prohibited inside clothes closets, bathrooms, or stairways.'
  },
  {
    title: 'Interconnected Smoke Alarms',
    description: 'Hardwired, synchronized residential smoke and carbon monoxide alarms.',
    code: 'NBC 9.10.19 • Required on Every Floor Level & Inside/Adjacent to Every Bedroom',
    examFocus: 'When one alarm triggers, all interconnected units in the dwelling sound simultaneously.'
  },
  {
    title: 'Plumbing Riser Venting',
    description: 'DWV vent pipes connecting fixture traps to the main roof vent terminal.',
    code: 'NBC Part 7 • Mandatory Trap Venting Prevents Hydraulic Trap Siphoning',
    examFocus: 'Without proper venting, negative drainage pressure sucks water out of P-traps, letting sewer gas enter.'
  },
  {
    title: 'Plumbing P-Trap',
    description: 'U-shaped trap beneath fixtures holding a water seal against toxic sewer gas.',
    code: 'NBC 7.2.3 • Mandatory 38mm–100mm Trap Seal Depth on Every Fixture',
    examFocus: 'Every plumbing fixture requires a vented P-trap; S-traps are prohibited due to self-siphoning.'
  },
  {
    title: 'Soil Stack',
    description: 'Main vertical 3" (75mm) DWV pipe carrying human and fixture waste to the building drain.',
    code: 'NBC 9.23.5.3 • 3" ABS Stack (3.5" OD) Requires 2x6 Wet Wall Framing',
    examFocus: 'Drilling a 3.5" hole through a 2x4 stud (3.5") destroys the stud; always frame a 2x6 wet wall.'
  },
  {
    title: 'Building Drain',
    description: 'Main horizontal underground drain pipe carrying waste out to the municipal sewer or septic.',
    code: 'NBC 7.4.8 • Min 2% Gravity Slope (1/4" Fall per Foot / 20mm per Meter)',
    examFocus: 'Multiply horizontal run in feet by 1/4" to find the required vertical elevation drop.'
  },
  {
    title: 'Cleanout (C.O.)',
    description: 'Accessible threaded access fitting installed for augering drainage blockages.',
    code: 'NBC 7.4.7 • Required at Base of Every Soil Stack & Direction Changes > 45°',
    examFocus: 'Never bury or drywall over a Cleanout (C.O.) without leaving an accessible cover panel.'
  },
  {
    title: 'SUBFLOOR SHEATHING (T&G)',
    description:
      'Tongue-and-groove (T&G) OSB or plywood subfloor panels (min 15.5mm / 5/8" for 16" O.C.) must be laid with face grain perpendicular to joists and end joints staggered by at least 4\' (half sheet).',
    code: 'NBC 9.23.15 • Perpendicular to Joists • Glue + Nail 150mm (6") Edges / 300mm (12") Field',
    examFocus:
      'Apply CGSB elastomeric subfloor adhesive + 51mm (2") ring-shank nails to create squeak-free composite floor stiffness.'
  },
  {
    title: 'LVL Beam',
    description: 'Laminated Veneer Lumber engineered beam supporting primary floor or roof loads.',
    code: 'NBC Part 9 • Multi-Ply LVL Beams Must Be Fastened Per Engineer Nailing Schedule',
    examFocus: 'Verify ply count (e.g., 3-Ply 1-3/4" x 11-7/8" LVL) and ensure solid bearing over teleposts/cripples.'
  },
  {
    title: 'Roof Pitch',
    description: 'Slope triangle on elevations and roof plans showing vertical rise per 12" horizontal run.',
    code: 'NBC 9.26 • Expressed as Rise / 12" Run (Imperial) or Rise / 250mm Run (Metric)',
    examFocus: 'A 6/12 pitch rises 6 inches for every 12 inches of horizontal run (50% slope).'
  },
  {
    title: 'Birdsmouth Bearing',
    description: 'Horizontal seat cut at the bottom of a common or hip/valley rafter resting on the top plate.',
    code: 'NBC 9.23.14.4 • Min 38mm (1.5") Level Bearing • Max Notch = 1/3 Rafter Depth',
    examFocus: 'Over-cutting the birdsmouth deeper than 1/3 of the rafter splits the rafter tail under snow load.'
  },
  {
    title: 'Minimum Roof Slope',
    description: 'Minimum allowable roof pitch for different roofing material classifications.',
    code: 'NBC 9.26.2 • Standard Asphalt Shingles Min 1:3 (4/12) • Low-Slope Min 1:6 (2/12)',
    examFocus: 'Slopes between 2/12 and 4/12 require double underlayment or continuous ice-and-water membrane.'
  },
  {
    title: 'Bedroom Egress Windows',
    description: 'Life-safety emergency escape window required in every sleeping room unless sprinklered.',
    code: 'NBC 9.9.10.1 • Min 0.35 m² (3.77 ft²) Clear Opening • No Dim < 380mm (15") • Max 1.0m Sill',
    examFocus: 'If a bedroom window opens into a window well, the well must provide >= 760mm (30") (550mm–760mm per edition) unobstructed clear projection.'
  },
  {
    title: 'FIRST RISER & NOSING DROP',
    description:
      'When cutting stair stringers off rough subfloors, you must adjust the bottom riser height (Drop the Stringer) to account for the difference between finished tread thickness and finished floor thickness.',
    code: 'NBC 9.8.4 • Drop Bottom Riser = Tread Thickness - Lower Finished Floor • Nosing <= 38mm',
    examFocus:
      'Cut the bottom stringer riser shorter by (Finished Tread Thickness - Lower Finished Floor Thickness) so the finished first step matches every upper riser.'
  },
  {
    title: 'Stringer Effective Depth',
    description: 'Solid uncut wood depth remaining beneath the tread/riser throat notch on a cut stair stringer.',
    code: 'NBC 9.8.9.4 • Min 90mm (3-1/2") Effective Uncut Stringer Depth (2x10 or 2x12 Stock)',
    examFocus: 'Cutting a stringer from 2x8 lumber leaves too little throat depth; always use 2x10 or 2x12.'
  },
  {
    title: 'Rise & Run Tolerances',
    description: 'Strict dimensional uniformity rules across all steps in a stair flight to prevent tripping.',
    code: 'NBC 9.8.4.4 • Max 5mm (3/16") Adjacent Step Variation • Max 10mm (3/8") Overall Flight Variation',
    examFocus: 'Remember to deduct finished tread thickness from the bottom riser height ("dropping the stringer").'
  }
]

// Helper to assign crisp Red Seal / NBC Code Rule Pill text to every Masterclass card
function getCodeRulePill(title = '', fallbackCode = 'NBC Part 9') {
  const k = title.toLowerCase()
  if (k.includes('issued for construction')) return 'NBC 9.3 • Build Only From Stamped "Issued For Construction" (IFC) Prints'
  if (k.includes('revision block')) return 'NBC 9.3 • Verify Latest Revision Delta (Δ) & Date Against GC Master Log'
  if (k.includes('dimension hierarchy')) return 'NBC 9.3 • Outer Overall String Overrules Middle (Jogs) & Inner (R.O.) Strings'
  if (k.includes('dimension string')) return 'NBC 9.3 • "Do Not Scale" Prints — Always Compute From Written Dimensions'
  if (k.includes('section mark')) return 'NBC 9.3 • Top = Detail ID • Bottom = Target Sheet • Arrow = Sight Direction'
  if (k.includes('load-bearing')) return 'NBC 9.23.10 • 2x6 @ 16" O.C. Bearing Wall Requires Lintel Header & Jack Studs'
  if (k.includes('non-bearing')) return 'NBC 9.23.10 • 2x4 Non-Bearing Partition Requires No Structural Lintel Header'
  if (k.includes('plumbing chase')) return 'NBC 9.23.5.3 • Max Stud Notch/Hole = 1/3 Depth • 3" Stack Requires 2x6 Wet Wall'
  if (k.includes('window rough opening')) return 'NBC 9.23.12 • Frame R.O. = Nominal Window + 1/2" to 3/4" Shim Clearance'
  if (k.includes('window symbol') || k.includes('egress')) return 'NBC 9.9.10.1 • Bedroom Egress Min 0.35 m² (3.77 ft²) & No Dim < 380mm (15")'
  if (k.includes('door symbol')) return 'NBC 9.9.6 • Door R.O. = Width + 2" to 2-1/2" • Never Swing Over Stair Steps'
  if (k.includes('stair rise & run')) return 'NBC 9.8.4 • Private Dwelling Max Rise = 200mm (7-7/8") • Min Run = 255mm (10")'
  if (k.includes('staircase symbol')) return 'NBC 9.8.4 • Plan Arrow Points UP From Datum • Treads (T) = Risers (R) - 1'
  if (k.includes('pad footing')) return 'NBC 9.15.3 • Dashed Square = Buried Concrete Pad Under Telepost Point Load'
  if (k.includes('foundation wall')) return 'NBC 9.15.4 • Min 150mm–200mm (6"–8") Poured Concrete Wall w/ Keyway'
  if (k.includes('rebar spacing')) return 'NBC 9.15 / CSA A23.1 • Min 75mm (3") Concrete Cover Against Earth • 40d Lap Splice'
  if (k.includes('damp-proofing')) return 'NBC 9.13.2 • Bituminous Coating + Drainage Membrane on Below-Grade Wall'
  if (k.includes('weeping tile')) return 'NBC 9.14.3.1 • Min 100mm (4") Perforated Pipe w/ >= 150mm (6") Clear Stone'
  if (k.includes('step footing')) return 'NBC 9.15.3.9 • Max Step Rise = 600mm (24") • Min Horizontal Run = 600mm (24")'
  if (k.includes('frost depth')) return 'NBC 9.12.2.2 • Exterior Footings Must Bear Below Local Frost Penetration Line'
  if (k.includes('sump pit')) return 'NBC 9.25.1.2 • Airtight Gasketed & Bolted Sump Cover Mandatory for Radon Control'
  if (k.includes('envelope assembly')) return 'NBC 9.27.2.4 • Siding + 10mm (3/8") Rainscreen Strapping + WRB (Tyvek) + OSB'
  if (k.includes('attic ventilation')) return 'NBC 9.19.1.1 • Min 1/300 Insulated Ceiling Vent Area + Clear Soffit Baffles'
  if (k.includes('sill gasket')) return 'NBC 9.25.3 / 9.23.7 • Closed-Cell Foam Capillary & Air Seal Under Mudsill'
  if (k.includes('anchor bolt')) return 'NBC 9.23.6.1 • Min 12.7mm (1/2") Bolts @ Max 2.4m (8\'-0") O.C. & >= 100mm Embed'
  if (k.includes('vapour barrier')) return 'NBC 9.25.4 • 6-Mil Poly Installed on Warm-In-Winter Side of Stud Insulation'
  if (k.includes('osb nailing')) return 'NBC 9.23.3.5 • Sheathing Nailed @ 150mm (6") Edges & 300mm (12") Field O.C.'
  if (k.includes('base flashing')) return 'NBC 9.27.3.8 • Through-Wall Base Flashing w/ Weepholes @ Max 800mm (32") O.C.'
  if (k.includes('height datum')) return 'NBC 9.4 • Crosshair Datum ⊕ Establishes T.O.F., F.F.E., and T.O.W. Elevations'
  if (k.includes('rain screen')) return 'NBC 9.27.2.4 • Min 10mm (3/8") Drained & Vented Capillary Air Cavity'
  if (k.includes('electrical panel')) return 'CEC Rule 6-200 • 200A Main Service Panel Prohibited in Bathrooms & Closets'
  if (k.includes('cec working')) return 'CEC Rule 2-308 • Mandatory Min 1.0m (39") Unobstructed Front Working Depth'
  if (k.includes('switch & wiring')) return 'CEC Rule 30-500 • $3 = 3-Way Switch Controlling Light From 2 Entrances'
  if (k.includes('gfci')) return 'CEC Rule 26-700 • Class A GFCI Receptacle Required Within 1.5m (5 ft) of Sinks'
  if (k.includes('stud drilling')) return 'NBC 9.23.5.3 • Max Load-Bearing Stud Hole = 1/3 Depth • Steel Plate if < 40mm Edge'
  if (k.includes('smoke alarm')) return 'NBC 9.10.19 • Hardwired Interconnected Smoke/CO on Every Floor & All Bedrooms'
  if (k.includes('receptacle spacing')) return 'CEC Rule 26-722 • Max 1.8m (6 ft) From Any Wall Point (3.6m / 12 ft Max Spacing)'
  if (k.includes('240v')) return 'CEC Rule 26-744 • Dedicated 14-30R (30A Dryer) & 14-50R (50A Range) Circuits'
  if (k.includes('joist penetration')) return 'NBC 9.23.5.1 • Max Hole = 1/4 Joist Depth • Min 50mm (2") From Top/Bottom Edge'
  if (k.includes('joist span')) return 'NBC 9.23.9.2 • Min 150mm (6") Center Lap over Beam or Min 38mm (1.5") End Bearing'
  if (k.includes('cross-bridging')) return 'NBC 9.23.9.4 • 1x3 Cross-Bridging or Blocking @ Max 2.1m (6\'-10") O.C. Along Span'
  if (k.includes('hanger')) return 'NBC 9.23.9.2 • Fill All Holes w/ Approved Shear Nails • Max 3mm (1/8") Joist Gap'
  if (k.includes('floor opening')) return 'NBC 9.23.9.5 • Floor Openings > 1.2m (4\'-0") Require Doubled Headers & Trimmers'
  if (k.includes('subfloor sheathing')) return 'NBC 9.23.15 • Perpendicular to Joists • Glue + Nail 150mm (6") Edges / 300mm (12") Field'
  if (k.includes('lvl beam')) return 'NBC 9.23.8.1 • Multi-Ply LVL Fastened Per Schedule • Min 89mm (3-1/2") Concrete Bearing'
  if (k.includes('batter board')) return 'RSOS Block B • Set 1.2m–1.8m Outside Excavation • Square Corners via 3-4-5 Rule'
  if (k.includes('setback')) return 'NBC 9.10.14 / Zoning • Min Distance From Property Line to Building Footprint'
  if (k.includes('benchmark')) return 'RSOS Block B • Elevation Formula: HI = BM + BS and Target Elev = HI - FS'
  if (k.includes('surface drainage')) return 'NBC 9.14.6 • Min 10% Slope Away From Foundation for First 2.0m (6\'-6")'
  if (k.includes('ridge board')) return 'NBC 9.23.14.8 • Ridge Board Must Be >= 1 Size Deeper Than Rafters (2x8 -> 2x10)'
  if (k.includes('collar tie')) return 'NBC 9.23.14.10 • Collar Ties in Upper 1/3 of Roof Space Resist Wind Uplift'
  if (k.includes('birdsmouth')) return 'NBC 9.23.14.4 • Min 38mm (1.5") Level Seat Cut • Max Notch = 1/3 Rafter Depth'
  if (k.includes('step flashing')) return 'NBC 9.26.4 • Individual L-Flashing Woven Into Each Shingle Course at Sidewalls'
  if (k.includes('grade clearance')) return 'NBC 9.27.2.4 • Min 200mm (8") Clearance From Siding/Wood Cladding to Grade'
  if (k.includes('drip cap')) return 'NBC 9.27.3.8 • Head Flashing Over Windows/Doors Tucked Under WRB Membrane'
  if (k.includes('eaves protection')) return 'NBC 9.26.5 • Ice & Water Shield >= 900mm (36") Up Slope & >= 300mm Inside Wall'
  if (k.includes('headroom')) return 'NBC 9.8.2 • Min 1950mm (6\'-5") Clear Stair Headroom Measured Vertically From Nosing'
  if (k.includes('first riser') || k.includes('nosing drop')) return 'NBC 9.8.4 • Drop Bottom Riser = Tread Thickness - Lower Finished Floor • Nosing <= 38mm'
  if (k.includes('stringer attachment')) return 'NBC 9.8.9 / 9.23.7 • Hang Top Off Drop Ledger / LSC Hanger • Anchor Bottom Kicker Plate'
  if (k.includes('stringer')) return 'NBC 9.8.9.4 • Min 90mm (3-1/2") Effective Uncut Stringer Depth Below Throat'
  if (k.includes('handrail') || k.includes('guard')) return 'NBC 9.8.7/8 • Handrail 865–1070mm (34"–42") • Guards Min 900mm / 1070mm High'
  if (k.includes('rise & run tolerance')) return 'NBC 9.8.4.5 • Max 5mm (3/16") Adjacent Step Variation • Max 10mm (3/8") Overall'
  return fallbackCode
}

// ============================================================================
// MODE 2 DATA: DOOR, WINDOW & LINTEL SCHEDULES + TOP 40 RED SEAL ABBREVIATIONS
// ============================================================================
const DOOR_WINDOW_SCHEDULES = [
  {
    tag: 'D01',
    category: 'Door Schedule',
    location: 'Main Front Entry (Ext. Bearing)',
    nominalSize: '36" x 80" (915 x 2030mm)',
    roughOpening: '38-1/2" x 82-1/2" (980 x 2095mm)',
    headerSpec: 'L1: 3-Ply 2x10 SPF No. 1/2',
    studsReq: '1 Jack + 1 King / Side',
    nbcRule: 'NBC 9.9.6 • Principal Entrance (Min 860mm Clear) + Insulated Sill'
  },
  {
    tag: 'D02',
    category: 'Door Schedule',
    location: 'Rear Deck Patio Slider (Ext. Bearing)',
    nominalSize: '72" x 80" (1830 x 2030mm)',
    roughOpening: '73" x 81" (1855 x 2060mm)',
    headerSpec: 'L2: 2-Ply 1-3/4" x 9-1/2" LVL',
    studsReq: '2 Jack + 2 King / Side',
    nbcRule: 'NBC 9.6.1.4 • Tempered Safety Glass + Double Trimmer Bearing'
  },
  {
    tag: 'D03',
    category: 'Door Schedule',
    location: 'Bedroom Passage (2x4 Non-Bearing)',
    nominalSize: '30" x 80" (760 x 2030mm)',
    roughOpening: '32" x 82" (815 x 2085mm)',
    headerSpec: 'Flat 2x4 Blocking (Non-Bearing)',
    studsReq: '1 Jack + 1 King / Side',
    nbcRule: 'NBC 9.23.10 • Non-Bearing Partition Requires No Structural Lintel'
  },
  {
    tag: 'D04',
    category: 'Door Schedule',
    location: 'Attached Garage-to-House Entry',
    nominalSize: '32" x 80" (810 x 2030mm)',
    roughOpening: '34" x 82-1/2" (865 x 2095mm)',
    headerSpec: 'L1: 2-Ply 2x10 SPF No. 1/2',
    studsReq: '1 Jack + 1 King / Side',
    nbcRule: 'NBC 9.10.13.2 • 20-Min Fire-Rated Solid Core + Self-Closer & Gas Seal'
  },
  {
    tag: 'W01',
    category: 'Window Schedule',
    location: 'Living Room Casement (Ext. 2x6)',
    nominalSize: '36" x 48" (915 x 1220mm)',
    roughOpening: '36-1/2" x 48-1/2" (927 x 1232mm)',
    headerSpec: 'L1: 3-Ply 2x10 SPF No. 2',
    studsReq: '1 Jack + 1 King / Side',
    nbcRule: 'NBC 9.27.3.8 • Head Drip Cap Flashing + Sloped Sill Pan Membrane'
  },
  {
    tag: 'W02',
    category: 'Window Schedule',
    location: 'Bedroom Egress Casement (Ext. 2x6)',
    nominalSize: '48" x 36" (1220 x 915mm)',
    roughOpening: '48-1/2" x 36-1/2" (1232 x 927mm)',
    headerSpec: 'L1: 2-Ply 2x10 SPF No. 2',
    studsReq: '1 Jack + 1 King / Side',
    nbcRule: 'NBC 9.9.10.1 • Egress Clear Open >= 0.35 m² (3.77 ft²) & Min 380mm Dim'
  },
  {
    tag: 'W03',
    category: 'Window Schedule',
    location: 'Basement Egress Slider (8" Conc.)',
    nominalSize: '40" x 24" (1015 x 610mm)',
    roughOpening: '43-1/2" x 27-1/2" PT Wood Buck',
    headerSpec: 'Poured Concrete Wall Lintel',
    studsReq: '2x8 PT Wood Buck Frame',
    nbcRule: 'NBC 9.9.10.1 • Max 1.0m Sill Height + 550mm (22") Clear Window Well'
  },
  {
    tag: 'L1',
    category: 'Lintel Schedule',
    location: 'Bearing Openings up to 1.8m (6\'-0")',
    nominalSize: 'Max Clear Span: 1.8m (6\'-0")',
    roughOpening: 'Min 38mm (1.5") End Bearing',
    headerSpec: '3-Ply 38x235mm (2x10) SPF No.1/2',
    studsReq: '1 Jack + 1 King / Side',
    nbcRule: 'NBC Table 9.23.12.A • Supports Roof + Ceiling + 1 Floor Load'
  },
  {
    tag: 'L2',
    category: 'Lintel Schedule',
    location: 'Bearing Openings 1.8m to 2.8m (9\'-2")',
    nominalSize: 'Max Clear Span: 2.8m (9\'-2")',
    roughOpening: 'Min 76mm (3.0") End Bearing',
    headerSpec: '2-Ply 45x241mm (1-3/4"x9-1/2") LVL',
    studsReq: '2 Jack + 2 King / Side',
    nbcRule: 'NBC 9.23.10.6 • Wide Spans Require Doubled Trimmer (Jack) Studs'
  }
]

const CAD_LINE_TYPES = [
  {
    name: 'Visible / Object Line',
    pattern: 'SOLID THICK',
    usage: 'Cut walls, structural members, visible edges of foundation & framing.',
    dashArray: 'none',
    color: '#f8fafc',
    width: 3
  },
  {
    name: 'Hidden / Dashed Line',
    pattern: '— — — —',
    usage: 'Buried strip/pad footings, overhead headers/beams, upper roof overhang.',
    dashArray: '8 5',
    color: '#fbbf24',
    width: 2.5
  },
  {
    name: 'Centerline / Grid Line (℄)',
    pattern: '— · — · —',
    usage: 'Structural column grid lines, window/door centerlines, pipe axes.',
    dashArray: '14 4 3 4',
    color: '#22d3ee',
    width: 2
  },
  {
    name: 'Cutting Plane / Section Line',
    pattern: '— · · — · · —',
    usage: 'Marks exact slice location for architectural/structural cross-sections.',
    dashArray: '16 4 3 4 3 4',
    color: '#f43f5e',
    width: 3
  },
  {
    name: 'Dimension & Extension Line',
    pattern: '|--- 14\'-6" ---|',
    usage: 'Thin continuous line terminated with 45° architectural ticks or arrows.',
    dashArray: 'none',
    color: '#38bdf8',
    width: 1.5
  }
]

const TOP_40_ABBREVIATIONS = [
  { abbr: 'T.O.F.', term: 'Top of Footing', cat: 'Elevations', detail: 'Vertical datum at the top surface of the poured concrete strip or pad footing.' },
  { abbr: 'T.O.W.', term: 'Top of Wall / Plate', cat: 'Elevations', detail: 'Elevation at top of concrete foundation wall or top of double wood wall plate.' },
  { abbr: 'F.F.E.', term: 'Finished Floor Elevation', cat: 'Elevations', detail: 'Master floor elevation datum (often set at 100.00\' or 100.00m on main floor).' },
  { abbr: 'A.F.F.', term: 'Above Finished Floor', cat: 'Elevations', detail: 'Height measured from finished flooring (e.g., switch boxes at 48" A.F.F.).' },
  { abbr: 'B.M.', term: 'Benchmark', cat: 'Elevations', detail: 'Fixed survey reference point of known elevation (HI = BM + BS).' },
  { abbr: 'U/S', term: 'Underside', cat: 'Elevations', detail: 'Bottom face of a joist, steel beam, ceiling, or footing (e.g., U/S Joist).' },
  { abbr: 'T/O', term: 'Top Of', cat: 'Elevations', detail: 'Upper surface of a structural member (e.g., T/O Subfloor or T/O Steel Beam).' },
  { abbr: 'B/O', term: 'Bottom Of', cat: 'Elevations', detail: 'Lowest elevation of a footing, lintel, or mechanical duct.' },
  { abbr: 'R.O.', term: 'Rough Opening', cat: 'Openings', detail: 'Framed opening width x height between jack studs and header/sill before unit install.' },
  { abbr: 'M.O.', term: 'Masonry Opening', cat: 'Openings', detail: 'Clear brick/concrete opening size prior to wood buck or frame installation.' },
  { abbr: 'HDR', term: 'Header / Lintel', cat: 'Openings', detail: 'Structural beam spanning across top of a door or window opening.' },
  { abbr: 'PKT', term: 'Pocket Door / Beam Pocket', cat: 'Openings', detail: 'Recessed wall cavity for sliding door or concrete notch receiving a beam.' },
  { abbr: 'O.C.', term: 'On Center', cat: 'Framing', detail: 'Center-to-center spacing of repetitive framing members (e.g., 16" O.C. or 24" O.C.).' },
  { abbr: '℄ / C.L.', term: 'Centerline', cat: 'Framing', detail: 'Exact middle axis of a column, footing, partition wall, or rough opening.' },
  { abbr: 'L.V.L.', term: 'Laminated Veneer Lumber', cat: 'Framing', detail: 'Engineered structural composite beam/header with high load capacity.' },
  { abbr: 'P.T.', term: 'Pressure Treated', cat: 'Framing', detail: 'Preservative-treated lumber required for sill plates on concrete & exterior decks.' },
  { abbr: 'S.P.F.', term: 'Spruce-Pine-Fir', cat: 'Framing', detail: 'Standard Canadian structural framing lumber species group (No. 1 / No. 2).' },
  { abbr: 'M.S.R.', term: 'Machine Stress Rated', cat: 'Framing', detail: 'Mechanically tested lumber used for engineered roof trusses and long spans.' },
  { abbr: 'O.S.B.', term: 'Oriented Strand Board', cat: 'Framing', detail: 'Engineered structural wood panel used for wall, roof, and subfloor sheathing.' },
  { abbr: 'T&G', term: 'Tongue and Groove', cat: 'Framing', detail: 'Interlocking edge profile on 3/4" subfloor panels preventing edge deflection.' },
  { abbr: 'BLK', term: 'Solid Blocking', cat: 'Framing', detail: 'Solid lumber blocks installed between joists/studs for firestopping & lateral restraint.' },
  { abbr: 'BRG', term: 'Bearing', cat: 'Framing', detail: 'Load-transfer contact point (e.g., BRG Wall or Min 38mm Joist BRG).' },
  { abbr: 'U.N.O.', term: 'Unless Noted Otherwise', cat: 'General', detail: 'Indicates a general specification applies everywhere unless a local callout overrides it.' },
  { abbr: 'N.T.S.', term: 'Not To Scale', cat: 'General', detail: 'Drawing is schematic; never measure with a scale rule—read written dimensions only.' },
  { abbr: 'TYP.', term: 'Typical', cat: 'General', detail: 'Detail, fastener, or dimension repeats at all identical conditions on the sheet.' },
  { abbr: 'SIM.', term: 'Similar', cat: 'General', detail: 'Framing assembly is comparable to the referenced detail (may be mirrored/reversed).' },
  { abbr: 'E.Q.', term: 'Equal', cat: 'General', detail: 'Center the fixture or divide the total span into equal symmetrical spaces.' },
  { abbr: 'V.I.F.', term: 'Verify In Field', cat: 'General', detail: 'Carpenter must confirm exact site dimension prior to cutting or fabricating.' },
  { abbr: 'I.F.C.', term: 'Issued For Construction', cat: 'General', detail: 'Official stamped drawing set authorized for site layout and building.' },
  { abbr: 'N.I.C.', term: 'Not In Contract', cat: 'General', detail: 'Item shown for context only; supplied/installed by owner or separate trade.' },
  { abbr: 'CLR.', term: 'Clear / Clearance', cat: 'General', detail: 'Unobstructed net distance between finished faces (e.g., 1950mm CLR headroom).' },
  { abbr: 'C.J.', term: 'Control / Construction Joint', cat: 'MEP & Site', detail: 'Saw-cut or formed joint in concrete slabs (spaced max 24–36x slab thickness).' },
  { abbr: 'W.R.B.', term: 'Weather-Resistant Barrier', cat: 'MEP & Site', detail: 'Sheathing membrane (e.g., Tyvek) installed over exterior OSB beneath rainscreen.' },
  { abbr: 'I.C.F.', term: 'Insulating Concrete Forms', cat: 'MEP & Site', detail: 'Stay-in-place EPS foam block forms reinforced with rebar and filled with concrete.' },
  { abbr: 'H.B.', term: 'Hose Bibb', cat: 'MEP & Site', detail: 'Exterior frost-free water faucet penetration through rim joist / foundation.' },
  { abbr: 'F.D.', term: 'Floor Drain', cat: 'MEP & Site', detail: 'Sloped basement or mechanical room floor drain with primed trap.' },
  { abbr: 'C.O.', term: 'Cleanout', cat: 'MEP & Site', detail: 'Accessible threaded DWV fitting at base of soil stacks and drain turns.' },
  { abbr: 'D.W.V.', term: 'Drain, Waste, Vent', cat: 'MEP & Site', detail: 'Non-pressurized sanitary plumbing drainage and atmospheric vent piping network.' },
  { abbr: 'G.F.C.I.', term: 'Ground Fault Circuit Interrupter', cat: 'MEP & Site', detail: 'Shock-protection outlet mandatory within 1.5m of sinks, tubs, and outdoors.' },
  { abbr: 'H.R.V.', term: 'Heat Recovery Ventilator', cat: 'MEP & Site', detail: 'Balanced mechanical ventilation unit exchanging stale indoor air with fresh outdoor air.' }
]

// ============================================================================
// MODE 3 DATA: 12 INTERACTIVE READ-THE-PRINT RED SEAL QUIZ CHALLENGES
// ============================================================================
const PRINT_QUIZ_QUESTIONS = [
  {
    id: 'pq-1',
    sheetRef: 'A1.0 Floor Plan • Dimension Hierarchy',
    question: 'On Sheet A1.0, the outer overall dimension string reads 42\'-0". The middle string shows a left room of 15\'-4" and a right room of 26\'-8" with an un-dimensioned interior partition jog. What is the mandatory Red Seal rule if an inner rough opening string contradicts the outer string?',
    options: [
      'Physically measure the blueprint paper with an architect scale rule to break the tie',
      'The written Outer Overall Dimension String (42\'-0") ALWAYS governs over middle and inner strings',
      'The inner Rough Opening string overrules the overall building footprint width',
      'Split the difference equally between the foundation wall and exterior sheathing'
    ],
    correctIndex: 1,
    nbcClause: 'NBC Section 9.3 • Dimension Hierarchy & "Do Not Scale" Rule',
    explanation: 'In architectural dimension hierarchy, String 1 (Outer Overall) governs total building footprint, String 2 (Middle) locates wall centerlines/jogs, and String 3 (Inner) locates R.O.s. Never scale prints physically.',
    renderGraphic: () => (
      <g>
        <line x1="30" y1="44" x2="330" y2="44" stroke="#22d3ee" strokeWidth="3" />
        <line x1="25" y1="49" x2="35" y2="39" stroke="#22d3ee" strokeWidth="3" />
        <line x1="325" y1="49" x2="335" y2="39" stroke="#22d3ee" strokeWidth="3" />
        <CadLabel x={180} y={44} text="OUTER OVERALL: 42'-0&quot;" fontSize={11.5} color="#67e8f9" borderColor="#0284c7" />

        <line x1="30" y1="98" x2="330" y2="98" stroke="#f8fafc" strokeWidth="2" />
        <line x1="150" y1="103" x2="160" y2="93" stroke="#f8fafc" strokeWidth="2.5" />
        <CadLabel x={92} y={98} text="15'-4&quot; WALL" fontSize={10.5} color="#ffffff" borderColor="#64748b" />
        <CadLabel x={242} y={98} text="26'-8&quot; SPAN" fontSize={10.5} color="#ffffff" borderColor="#64748b" />

        <line x1="155" y1="146" x2="330" y2="146" stroke="#fbbf24" strokeWidth="2" />
        <CadLabel x={242} y={146} text="INNER R.O.: 5'-0&quot;" fontSize={10.5} color="#fde68a" borderColor="#d97706" />
        <CalloutPin x={26} y={44} num={1} variant="cyan" />
      </g>
    )
  },
  {
    id: 'pq-2',
    sheetRef: 'A1.0 / A3.1 • Section Callout Symbol',
    question: 'You encounter this section callout bubble on Floor Plan A1.0 with "B" in the top half and "A3.1" in the bottom half. What does this tell the carpenter?',
    options: [
      'Detail B is located on Sheet A1.0 and referenced from Sheet A3.1',
      'Inspect Detail "B" drawn on Target Sheet "A3.1", looking in the direction of the bold arrow',
      'Use Grade B framing lumber with an A3.1 shear wall nailing schedule',
      'The finished floor elevation changes by 3.1 inches at Grid Line B'
    ],
    correctIndex: 1,
    nbcClause: 'RSOS Block A • Architectural Section Callout Conventions',
    explanation: 'In a standard horizontal-split section bubble, the top identifier ("B") is the detail label, the bottom code ("A3.1") is the destination drawing sheet, and the arrow shows the sight direction.',
    renderGraphic: () => (
      <g>
        <line x1="35" y1="95" x2="325" y2="95" stroke="#38bdf8" strokeWidth="3.5" strokeDasharray="16 5 4 5 4 5" />
        <polygon points="180,28 164,56 196,56" fill="#22d3ee" />
        <circle cx="180" cy="95" r="34" fill="#0a192f" stroke="#22d3ee" strokeWidth="3" />
        <line x1="146" y1="95" x2="214" y2="95" stroke="#22d3ee" strokeWidth="2.5" />
        <text x="180" y="84" fill="#ffffff" fontSize="13" fontFamily="monospace" fontWeight="bold" textAnchor="middle">B</text>
        <text x="180" y="114" fill="#67e8f9" fontSize="12" fontFamily="monospace" fontWeight="bold" textAnchor="middle">A3.1</text>
        <CadLabel x={82} y={62} text="TOP = DETAIL ID" fontSize={10} color="#ffffff" borderColor="#22d3ee" />
        <CadLabel x={278} y={138} text="BOT = SHEET NO." fontSize={10} color="#fde68a" borderColor="#fbbf24" />
      </g>
    )
  },
  {
    id: 'pq-3',
    sheetRef: 'Schedules • Window & Lintel Schedule',
    question: 'Floor Plan A1.0 marks an exterior bearing window as "W02". Checking the Window Schedule, W02 has a Nominal Size of 48" x 36" and calls for Lintel L2 (2-Ply LVL). What is the standard Rough Opening (R.O.) to frame?',
    options: [
      'Exactly 48" x 36" tight to the vinyl window jambs with zero shim gap',
      '48-1/2" x 36-1/2" (adding 1/2" to 3/4" total clearance for plumbing, leveling, and low-expansion foam)',
      '50-1/2" x 38-1/2" (adding 2-1/2" like an exterior pre-hung door jamb)',
      '46-1/2" x 34-1/2" so the window flange overlaps the king studs'
    ],
    correctIndex: 1,
    nbcClause: 'NBC 9.7 / Window Schedule • R.O. = Nominal Unit Size + 1/2" (12mm) Shim Space',
    explanation: 'Window rough openings typically add 1/2" (or 3/4" max) to the nominal window width and height so the unit can be shimmed plumb, level, and square without binding.',
    renderGraphic: () => (
      <g>
        <rect x="65" y="24" width="230" height="24" fill="#451a03" stroke="#fbbf24" strokeWidth="2.5" />
        <CadLabel x={180} y={36} text="L2: 2-PLY LVL HEADER" fontSize={10.5} color="#fde68a" borderColor="#d97706" />
        <rect x="65" y="48" width="16" height="106" fill="#0f243c" stroke="#38bdf8" strokeWidth="2" />
        <rect x="279" y="48" width="16" height="106" fill="#0f243c" stroke="#38bdf8" strokeWidth="2" />
        <line x1="81" y1="98" x2="279" y2="98" stroke="#22d3ee" strokeWidth="2.5" />
        <CadLabel x={180} y={98} text="W02 NOMINAL: 48&quot; x 36&quot;" fontSize={11} color="#67e8f9" borderColor="#0284c7" />
        <CadLabel x={180} y={136} text="FRAME R.O. = +1/2&quot; SHIM GAP" fontSize={10.5} color="#6ee7b7" borderColor="#059669" />
      </g>
    )
  },
  {
    id: 'pq-4',
    sheetRef: 'SP1 Site Plan • Benchmark & Builder\'s Level',
    question: 'On Site Plan SP1, the Benchmark (BM) is El. 100.00m. Your builder\'s level reads a Backsight (BS) of 1.65m on the BM rod. The blueprint calls for Top of Footing (T.O.F.) at El. 98.85m. What Foresight (FS) rod reading indicates exact T.O.F. grade?',
    options: [
      '2.80 m on the grade rod (HI = 101.65m; FS = 101.65 - 98.85 = 2.80m)',
      '1.15 m on the grade rod (100.00 - 98.85 = 1.15m)',
      '0.50 m on the grade rod (1.65 - 1.15 = 0.50m)',
      '3.50 m on the grade rod'
    ],
    correctIndex: 0,
    nbcClause: 'RSOS Block B • Differential Leveling: HI = BM + BS • FS = HI - Target Elev',
    explanation: 'First find Height of Instrument: HI = 100.00m + 1.65m = 101.65m. Subtract the required T.O.F. elevation (98.85m) from HI: FS = 101.65m - 98.85m = 2.80m.',
    renderGraphic: () => (
      <g>
        <line x1="30" y1="48" x2="330" y2="48" stroke="#22d3ee" strokeWidth="2" strokeDasharray="6 4" />
        <CadLabel x={180} y={32} text="HI = 100.00 + 1.65 = 101.65m" fontSize={10.5} color="#67e8f9" borderColor="#0284c7" />
        <line x1="65" y1="48" x2="65" y2="112" stroke="#fbbf24" strokeWidth="3" />
        <CadLabel x={82} y={126} text="BM 100.00m (BS 1.65m)" fontSize={10} color="#fde68a" borderColor="#d97706" />
        <line x1="275" y1="48" x2="275" y2="152" stroke="#34d399" strokeWidth="3" />
        <CadLabel x={256} y={154} text="T.O.F. 98.85m (FS = ?)" fontSize={10.5} color="#6ee7b7" borderColor="#059669" />
      </g>
    )
  },
  {
    id: 'pq-5',
    sheetRef: 'S1.0 Foundation • Stepped Strip Footing',
    question: 'Detail 4/S1.0 shows a stepped concrete foundation footing on a sloped excavation. Under NBC 9.15.3.9, what are the strict limits for the vertical step rise (H) and horizontal step run (L)?',
    options: [
      'Max vertical rise = 900mm (36") and min horizontal run = 300mm (12")',
      'Max vertical rise = 600mm (24") and min horizontal run = 600mm (24")',
      'Max vertical rise = 400mm (16") and min horizontal run = 1200mm (48")',
      'Any vertical step height is permitted if 10M rebar is added'
    ],
    correctIndex: 1,
    nbcClause: 'NBC 9.15.3.9 • Stepped Footings: Max Rise <= 600mm (24") & Min Run >= 600mm (24")',
    explanation: 'NBC 9.15.3.9 mandates that stepped footings have a vertical rise not exceeding 600mm (24") and a horizontal level distance between steps of at least 600mm (24").',
    renderGraphic: () => (
      <g>
        <path d="M 35 148 L 165 148 L 165 78 L 325 78 L 325 104 L 195 104 L 195 172 L 35 172 Z" fill="#1e293b" stroke="#38bdf8" strokeWidth="2.5" />
        <CadLabel x={96} y={110} text="MAX RISE H <= 600mm" fontSize={10.5} color="#fde68a" borderColor="#d97706" />
        <CadLabel x={248} y={48} text="MIN RUN L >= 600mm" fontSize={10.5} color="#67e8f9" borderColor="#0284c7" />
      </g>
    )
  },
  {
    id: 'pq-6',
    sheetRef: 'A3.1 Section Detail • Wall Assembly & Sill Anchor',
    question: 'Cross-Section A3.1 specifies 1/2" (12.7mm) foundation anchor bolts securing the mudsill and a 6-mil polyethylene vapour barrier in the 2x6 wall. Which combination complies with NBC Part 9?',
    options: [
      'Anchor bolts max 2.4m (8\'-0") O.C. w/ >= 100mm embedment; 6-mil poly on the WARM-IN-WINTER side',
      'Anchor bolts max 3.6m (12\'-0") O.C. w/ 50mm embedment; 6-mil poly directly under exterior vinyl siding',
      'Anchor bolts max 1.2m (4\'-0") O.C.; two layers of 6-mil poly on both sides of the stud cavity',
      'Anchor bolts only at building corners; 6-mil poly between OSB and Tyvek WRB'
    ],
    correctIndex: 0,
    nbcClause: 'NBC 9.23.6.1 & 9.25.4 • Anchor Bolts <= 2.4m O.C. (100mm Embed) + Warm-Side Poly',
    explanation: 'NBC 9.23.6.1 requires >= 12.7mm (1/2") anchor bolts spaced <= 2.4m (8\'-0") O.C. with >= 100mm (4") concrete embedment. NBC 9.25.4 requires the vapour barrier on the warm-in-winter side.',
    renderGraphic: () => (
      <g>
        <rect x="85" y="96" width="190" height="68" fill="#1e293b" stroke="#94a3b8" strokeWidth="2" />
        <rect x="100" y="68" width="160" height="24" fill="#451a03" stroke="#fbbf24" strokeWidth="2" />
        <path d="M 180 42 L 180 144 Q 180 156 196 156" fill="none" stroke="#22d3ee" strokeWidth="4.5" />
        <CadLabel x={180} y={26} text="1/2&quot; BOLT <= 2.4m (8') O.C." fontSize={10.5} color="#67e8f9" borderColor="#0284c7" />
        <CadLabel x={180} y={132} text="MIN 100mm (4&quot;) EMBEDMENT" fontSize={10.5} color="#fde68a" borderColor="#d97706" />
      </g>
    )
  },
  {
    id: 'pq-7',
    sheetRef: 'S2.0 Floor Framing • Joists, Bridging & Openings',
    question: 'Floor Framing Plan S2.0 shows 2x10 joists @ 16" O.C. spanning 14\'-8" with a 6\'-6" (1.98m) stairwell opening. Which framing details are mandatory on this floor system?',
    options: [
      'Single header joist, single trimmer joist, and 50mm (2") lap over the center beam',
      'Doubled header & doubled trimmer joists (opening > 1.2m), mid-span bridging (<= 2.1m), and >= 150mm (6") beam lap',
      'Cross-bridging every 3.6m (12\'-0") and notches up to 1/2 joist depth in the center span',
      'Fasten metal joist hangers using 3" drywall screws'
    ],
    correctIndex: 1,
    nbcClause: 'NBC 9.23.9.2 / 9.23.9.4 / 9.23.9.5 • Floor Joist Lap, Bridging & Opening Rules',
    explanation: 'Openings > 1.2m (4\'-0") require doubled headers and doubled trimmers. Joists lap >= 150mm (6") over center beams, and bridging/blocking is required at max 2.1m (6\'-10") O.C.',
    renderGraphic: () => (
      <g>
        <rect x="35" y="24" width="290" height="132" fill="none" stroke="#94a3b8" strokeWidth="2.5" />
        <line x1="145" y1="24" x2="145" y2="156" stroke="#fbbf24" strokeWidth="5" />
        <line x1="235" y1="24" x2="235" y2="156" stroke="#fbbf24" strokeWidth="5" />
        <line x1="145" y1="90" x2="235" y2="90" stroke="#fbbf24" strokeWidth="5" />
        <line x1="35" y1="74" x2="145" y2="74" stroke="#10b981" strokeWidth="3" strokeDasharray="5 3" />
        <CadLabel x={90} y={48} text="BRIDGING <= 2.1m" fontSize={10} color="#6ee7b7" borderColor="#059669" />
        <CadLabel x={190} y={122} text="OPENING > 1.2m (DBL)" fontSize={10.5} color="#fde68a" borderColor="#d97706" />
      </g>
    )
  },
  {
    id: 'pq-8',
    sheetRef: 'P1.0 Plumbing Plan • Wet Wall & Joist Drilling',
    question: 'The plumber needs to run a vertical 3" ABS soil stack (3.5" OD) up an interior wall and drill a drain hole through a 2x10 floor joist (235mm depth). What are the NBC structural limits?',
    options: [
      'Frame a 2x6 wet wall for the 3" stack (max stud hole = 1/3 depth); max joist hole diameter = 1/4 joist depth (~58mm)',
      'Notch the 2x4 studs 3.5" deep and drill a 4" hole at the bottom tension edge of the 2x10 joist',
      'Max joist hole is 1/2 joist depth anywhere within 12mm of the top edge',
      'Notch the middle third of the 2x10 floor joist 90mm deep'
    ],
    correctIndex: 0,
    nbcClause: 'NBC 9.23.5.1 & 9.23.5.3 • Max Joist Hole = 1/4 Depth • Max Stud Hole = 1/3 Depth',
    explanation: 'A 3" ABS pipe (3.5" OD) completely severs a 2x4 stud, so a 2x6 wet wall is required. In floor joists, holes cannot exceed 1/4 of joist depth and must stay >= 50mm (2") from top/bottom edges.',
    renderGraphic: () => (
      <g>
        <rect x="40" y="42" width="280" height="94" fill="#1e293b" stroke="#f59e0b" strokeWidth="2.5" />
        <circle cx="180" cy="89" r="20" fill="#0a192f" stroke="#22d3ee" strokeWidth="3" />
        <CadLabel x={180} y={24} text="2x10 JOIST (235mm)" fontSize={10.5} color="#fde68a" borderColor="#d97706" />
        <CadLabel x={180} y={154} text="MAX HOLE = 1/4 DEPTH (>= 50mm EDGE)" fontSize={10.5} color="#67e8f9" borderColor="#0284c7" />
      </g>
    )
  },
  {
    id: 'pq-9',
    sheetRef: 'R1.0 Roof Framing • Ridge Board & Birdsmouth',
    question: 'Roof Plan R1.0 calls for stick-framed 2x8 (38x184mm) common rafters at a 6/12 pitch. Under NBC 9.23.14, what minimum size Ridge Board and Birdsmouth seat bearing are required?',
    options: [
      '1x6 Ridge Board and 19mm (3/4") birdsmouth seat bearing',
      '2x10 (38x235mm) Ridge Board (1 size deeper than rafters) and min 38mm (1.5") level seat cut (max 1/3 depth notch)',
      '2x8 Ridge Board and birdsmouth notch up to 1/2 of the rafter depth',
      '2x4 Ridge Board and collar ties at the bottom plate'
    ],
    correctIndex: 1,
    nbcClause: 'NBC 9.23.14.8 & 9.23.14.4 • Ridge Board +1 Size Deeper • Min 38mm Birdsmouth Seat',
    explanation: 'Because the plumb cut on an angled rafter is longer than the rafter\'s nominal depth, the ridge board must be at least 1 commercial size deeper (2x8 rafters require a 2x10 ridge).',
    renderGraphic: () => (
      <g>
        <line x1="45" y1="148" x2="180" y2="34" stroke="#f59e0b" strokeWidth="12" strokeLinecap="round" />
        <line x1="315" y1="148" x2="180" y2="34" stroke="#f59e0b" strokeWidth="12" strokeLinecap="round" />
        <rect x="173" y="22" width="14" height="36" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
        <CadLabel x={180} y={84} text="2x8 RAFTERS -> 2x10 RIDGE" fontSize={10.5} color="#fca5a5" borderColor="#ef4444" />
        <CadLabel x={180} y={154} text="MIN 38mm (1.5&quot;) SEAT BEARING" fontSize={10.5} color="#6ee7b7" borderColor="#059669" />
      </g>
    )
  },
  {
    id: 'pq-10',
    sheetRef: 'A2.1 Exterior Elevation • Cladding & Eaves Protection',
    question: 'On Exterior Elevation A2.1, what are the NBC Part 9 minimum dimensions for (1) Wood/Siding clearance above finished grade and (2) Eaves Ice & Water protection up the roof slope?',
    options: [
      'Min 50mm (2") siding-to-grade clearance; eaves protection 300mm (12") up slope',
      'Min 200mm (8") siding-to-grade clearance; eaves protection >= 900mm (36") up slope & >= 300mm inside inner wall face',
      'Min 100mm (4") siding-to-grade clearance; eaves protection only on 12/12 roofs',
      'Siding flush with topsoil; eaves protection 450mm (18") up slope'
    ],
    correctIndex: 1,
    nbcClause: 'NBC 9.27.2.4 & 9.26.5 • Min 200mm (8") Grade Clearance • >= 900mm (36") Eaves Shield',
    explanation: 'NBC 9.27.2.4 mandates at least 200mm (8") clearance from finished ground grade to cladding. NBC 9.26.5 requires eaves protection extending >= 900mm (36") up the roof slope and >= 300mm (12") inside the inner wall line.',
    renderGraphic: () => (
      <g>
        <line x1="35" y1="92" x2="195" y2="24" stroke="#22d3ee" strokeWidth="5" />
        <rect x="95" y="68" width="215" height="72" fill="#1e293b" stroke="#cbd5e1" strokeWidth="2" />
        <line x1="35" y1="164" x2="325" y2="164" stroke="#10b981" strokeWidth="4" />
        <CadLabel x={135} y={32} text="EAVES SHIELD >= 900mm (36&quot;)" fontSize={10} color="#67e8f9" borderColor="#0284c7" />
        <CadLabel x={205} y={148} text="MIN 200mm (8&quot;) TO GRADE" fontSize={10.5} color="#6ee7b7" borderColor="#059669" />
      </g>
    )
  },
  {
    id: 'pq-11',
    sheetRef: 'A4.1 Stair Details • Headroom, Throat & Uniformity',
    question: 'Stair Section A4.1 shows an interior residential stair flight marked "UP 14R". Which combination of NBC 9.8 stair specifications is 100% code-compliant?',
    options: [
      '14 risers & 13 treads; min 1950mm (6\'-5") headroom; min 90mm (3.5") uncut stringer throat; max 5mm adjacent step variation',
      '14 risers & 14 treads; min 1800mm (5\'-11") headroom; min 50mm (2") uncut stringer throat',
      'Max riser height 230mm (9"); handrail height 650mm (25"); max 19mm step variation',
      '13 risers & 14 treads; stringers cut from 2x6 stock'
    ],
    correctIndex: 0,
    nbcClause: 'NBC 9.8.2 / 9.8.4 / 9.8.9.4 • 1950mm Headroom • 90mm Stringer Throat • <= 5mm Tolerance',
    explanation: 'A 14-riser flight has 13 treads (T = R - 1). Minimum clear headroom is 1950mm (6\'-5"), minimum uncut stringer throat depth is 90mm (3-1/2"), and adjacent risers/treads cannot vary by more than 5mm (3/16").',
    renderGraphic: () => (
      <g>
        <path d="M 55 156 L 55 124 L 125 124 L 125 92 L 195 92 L 195 60 L 285 60" fill="none" stroke="#f8fafc" strokeWidth="3" />
        <line x1="85" y1="168" x2="245" y2="92" stroke="#fbbf24" strokeWidth="3" />
        <CadLabel x={145} y={36} text="HEADROOM >= 1950mm (6'-5&quot;)" fontSize={10.5} color="#67e8f9" borderColor="#0284c7" />
        <CadLabel x={222} y={148} text="14R / 13T • >= 90mm THROAT" fontSize={10.5} color="#fde68a" borderColor="#d97706" />
      </g>
    )
  },
  {
    id: 'pq-12',
    sheetRef: 'E1.0 Electrical Plan • CEC Clearances & GFCI',
    question: 'Electrical Plan E1.0 shows the 200A main service panel in the basement utility room and a duplex receptacle next to a bathroom vanity basin. What do the CEC rules require?',
    options: [
      'Min 1.0m (39") clear working depth in front of the 200A panel, and a Class A GFCI receptacle within 1.5m (5 ft) of the sink',
      'Place the 200A panel inside a clothes closet and install a standard non-GFCI outlet 300mm from the sink',
      'Min 0.4m panel clearance and 15A receptacles spaced every 6.0m along living room walls',
      'Connect interconnected smoke alarms to a switched wall outlet'
    ],
    correctIndex: 0,
    nbcClause: 'CEC Rule 2-308 & Rule 26-700 • 1.0m Panel Working Space & GFCI <= 1.5m to Water',
    explanation: 'CEC Rule 2-308 requires at least 1.0m (39") unobstructed working depth in front of service panels. Rule 26-700 requires GFCI protection for receptacles within 1.5m (5\'-0") of sinks, tubs, or showers.',
    renderGraphic: () => (
      <g>
        <rect x="40" y="38" width="24" height="84" fill="#064e3b" stroke="#10b981" strokeWidth="2.5" />
        <rect x="64" y="34" width="110" height="92" fill="#064e3b" opacity="0.25" stroke="#34d399" strokeWidth="2" strokeDasharray="5 3" />
        <CadLabel x={118} y={80} text="1.0m PANEL CLEAR" fontSize={10} color="#6ee7b7" borderColor="#059669" />
        <circle cx="265" cy="64" r="18" fill="#0a192f" stroke="#fbbf24" strokeWidth="2.5" />
        <CadLabel x={265} y={118} text="GFCI <= 1.5m SINK" fontSize={10.5} color="#fde68a" borderColor="#d97706" />
      </g>
    )
  }
]

export default function BlueprintViewer() {
  // Top 3-Mode Selector: 'sheets' | 'schedules' | 'quiz'
  const [activeMode, setActiveMode] = useState('sheets')

  // Sheet navigation state (1-indexed: 1..10)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedDetailIndex, setSelectedDetailIndex] = useState(0)

  // Persistent Mastered state for Blueprint Masterclass items
  const [masteredItems, setMasteredItems] = useState(() => {
    try {
      const saved = localStorage.getItem('red_seal_blueprint_mastered_v2')
      return saved ? JSON.parse(saved) : {}
    } catch (e) {
      return {}
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('red_seal_blueprint_mastered_v2', JSON.stringify(masteredItems))
    } catch (e) {}
  }, [masteredItems])

  const toggleMastered = (e, itemKey) => {
    e.stopPropagation()
    setMasteredItems(prev => ({
      ...prev,
      [itemKey]: !prev[itemKey]
    }))
  }

  // Schedules & Abbreviations Decoder State
  const [scheduleFilter, setScheduleFilter] = useState('ALL')
  const [selectedScheduleRow, setSelectedScheduleRow] = useState(DOOR_WINDOW_SCHEDULES[0])
  const [abbrSearch, setAbbrSearch] = useState('')
  const [abbrCategory, setAbbrCategory] = useState('All')

  // Print Quiz State
  const [quizIndex, setQuizIndex] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState({})
  const [showMasterclassInfo, setShowMasterclassInfo] = useState(false)

  // Build all 10 enriched sheets preserving blueprintsData + ALL_INTERACTIVE_TAKEAWAYS
  const sheets = useMemo(() => {
    return SHEET_DEFINITIONS.map((def, idx) => {
      const rawBp = (blueprintsData || []).find(b => b.id === def.id) || (blueprintsData || [])[idx] || {}
      const baseTakeaways = (rawBp.keyTakeaways || []).map(kt => {
        const title = kt.title || kt.element || ''
        return {
          title,
          description: kt.description || kt.explanation || '',
          code: getCodeRulePill(title, kt.code || 'NBC Section 9.3'),
          examFocus: kt.examFocus || kt.explanation || 'Verify structural dimensions and NBC Part 9 compliance.'
        }
      })

      const extraAllowedBySheet = {
        'bp-01': ['SECTION MARKS', 'DIMENSION STRINGS', 'WINDOW SYMBOLS', 'DOOR SYMBOLS', 'STAIRCASE SYMBOLS'],
        'bp-02': ['WEEPING TILE DRAINAGE', 'STEP FOOTINGS', 'FROST DEPTH FOUNDATIONS', 'SUMP PIT RADON SEAL'],
        'bp-03': ['HEIGHT DATUMS', 'RAIN SCREEN CLADDING', 'WEEPING TILE DRAINAGE'],
        'bp-04': ['CEC WORKING CLEARANCE', 'INTERCONNECTED SMOKE ALARMS'],
        'bp-05': ['PLUMBING RISER VENTING', 'PLUMBING P-TRAP', 'SOIL STACK', 'BUILDING DRAIN', 'CLEANOUT (C.O.)'],
        'bp-06': ['SUBFLOOR SHEATHING (T&G)', 'LVL BEAM'],
        'bp-07': [],
        'bp-08': ['ROOF PITCH', 'BIRDSMOUTH BEARING', 'MINIMUM ROOF SLOPE'],
        'bp-09': ['BEDROOM EGRESS WINDOWS'],
        'bp-10': ['FIRST RISER & NOSING DROP', 'STRINGER EFFECTIVE DEPTH', 'RISE & RUN TOLERANCES']
      }

      const allowedTitles = extraAllowedBySheet[def.id] || []
      const supplemental = ALL_INTERACTIVE_TAKEAWAYS.filter(item => {
        const alreadyInBase = baseTakeaways.some(bt => bt.title.toLowerCase() === item.title.toLowerCase())
        if (alreadyInBase) return false
        return allowedTitles.some(a => a.toLowerCase() === item.title.toLowerCase())
      }).map(item => ({
        ...item,
        code: getCodeRulePill(item.title, item.code)
      }))

      return {
        ...def,
        description: rawBp.description || def.fullTitle,
        keyTakeaways: [...baseTakeaways, ...supplemental]
      }
    })
  }, [])

  const activeSheet = sheets[currentPage - 1] || sheets[0]
  const activeTakeaways = activeSheet.keyTakeaways || []
  const safeDetailIdx = Math.min(selectedDetailIndex, Math.max(0, activeTakeaways.length - 1))
  const activeSpotlightItem = activeTakeaways[safeDetailIdx] || activeTakeaways[0]

  // Calculate total blueprint mastery across all 10 sheets
  const masteryStats = useMemo(() => {
    let total = 0
    let done = 0
    sheets.forEach(s => {
      s.keyTakeaways.forEach(kt => {
        total += 1
        const key = `${s.sheetCode}::${kt.title}`
        if (masteredItems[key]) done += 1
      })
    })
    return {
      total,
      done,
      pct: total > 0 ? Math.round((done / total) * 100) : 0
    }
  }, [sheets, masteredItems])

  // Ref to smoothly scroll back to the 1:1 CAD Spotlight Stage when inspecting a Masterclass card
  const cadStageRef = useRef(null)

  const handleSelectSheet = (pageNumber) => {
    setCurrentPage(pageNumber)
    setSelectedDetailIndex(0)
  }

  const handleInspectInStage = (idx) => {
    setSelectedDetailIndex(idx)
    cadStageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const sheetMasteredCount = useMemo(() => {
    return activeTakeaways.filter(kt => !!masteredItems[`${activeSheet.sheetCode}::${kt.title}`]).length
  }, [activeTakeaways, activeSheet.sheetCode, masteredItems])

  const handlePrevDetail = () => {
    setSelectedDetailIndex(prev => (prev > 0 ? prev - 1 : activeTakeaways.length - 1))
  }

  const handleNextDetail = () => {
    setSelectedDetailIndex(prev => (prev < activeTakeaways.length - 1 ? prev + 1 : 0))
  }

  const filteredAbbreviations = useMemo(() => {
    return TOP_40_ABBREVIATIONS.filter(item => {
      const matchesCat = abbrCategory === 'All' || item.cat === abbrCategory
      const q = abbrSearch.trim().toLowerCase()
      const matchesQuery =
        !q ||
        item.abbr.toLowerCase().includes(q) ||
        item.term.toLowerCase().includes(q) ||
        item.detail.toLowerCase().includes(q)
      return matchesCat && matchesQuery
    })
  }, [abbrSearch, abbrCategory])

  const filteredSchedules = useMemo(() => {
    if (scheduleFilter === 'ALL') return DOOR_WINDOW_SCHEDULES
    return DOOR_WINDOW_SCHEDULES.filter(s => s.category.toUpperCase().includes(scheduleFilter))
  }, [scheduleFilter])

  // Quiz score calculation
  const quizScore = useMemo(() => {
    let correct = 0
    const answered = Object.keys(quizAnswers).length
    PRINT_QUIZ_QUESTIONS.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctIndex) correct += 1
    })
    return { correct, answered, total: PRINT_QUIZ_QUESTIONS.length }
  }, [quizAnswers])

  const currentQuizQ = PRINT_QUIZ_QUESTIONS[quizIndex] || PRINT_QUIZ_QUESTIONS[0]
  const userSelectedOption = quizAnswers[quizIndex]
  const [quizSheetLabel, quizTopicTitle] = useMemo(() => {
    const parts = (currentQuizQ.sheetRef || '').split('•')
    return [
      (parts[0] || '').trim(),
      (parts[1] || parts[0] || '').trim()
    ]
  }, [currentQuizQ.sheetRef])

  return (
    <div className="w-full space-y-3">
      {/* 3-MODE TOP BAR: DRAWING SHEETS (10) | SCHEDULES & SYMBOLS | PRINT QUIZ */}
      <div className="grid grid-cols-3 gap-1 p-1 bg-slate-900/90 border border-slate-800 rounded-xl mb-3">
        <button
          type="button"
          onClick={() => setActiveMode('sheets')}
          className={`overflow-hidden text-[10.5px] sm:text-xs font-bold tracking-tight whitespace-nowrap px-1.5 py-2 text-center rounded-lg transition-all flex items-center justify-center gap-1 ${
            activeMode === 'sheets'
              ? 'bg-cyan-500 text-slate-950 shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
          }`}
        >
          <Crosshair size={13} className="shrink-0 hidden sm:inline" />
          <span>DRAWING SHEETS (10)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMode('schedules')}
          className={`overflow-hidden text-[10.5px] sm:text-xs font-bold tracking-tight whitespace-nowrap px-1.5 py-2 text-center rounded-lg transition-all flex items-center justify-center gap-1 ${
            activeMode === 'schedules'
              ? 'bg-cyan-500 text-slate-950 shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
          }`}
        >
          <FileSpreadsheet size={13} className="shrink-0 hidden sm:inline" />
          <span>SCHEDULES &amp; SYMBOLS</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMode('quiz')}
          className={`overflow-hidden text-[10.5px] sm:text-xs font-bold tracking-tight whitespace-nowrap px-1.5 py-2 text-center rounded-lg transition-all flex items-center justify-center gap-1 ${
            activeMode === 'quiz'
              ? 'bg-cyan-500 text-slate-950 shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
          }`}
        >
          <Award size={13} className="shrink-0 hidden sm:inline" />
          <span>PRINT QUIZ ({quizScore.correct}/{quizScore.total})</span>
        </button>
      </div>

      {/* =================================================================== */}
      {/* MODE 1: 10 DRAWING SHEETS + 1:1 CAD SPOTLIGHT STAGE + MASTERCLASS    */}
      {/* =================================================================== */}
      {activeMode === 'sheets' && (
        <div className="space-y-3">
          {/* Symmetrical 5x2 Drawing Sheet Selector Pill Grid */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold tracking-wider text-slate-300 whitespace-nowrap">
                DRAWING SHEET INDEX
              </span>
              <span className="text-[11px] font-mono font-bold text-cyan-400 whitespace-nowrap">
                {masteryStats.done}/{masteryStats.total} Mastered ({masteryStats.pct}%)
              </span>
            </div>

            <div className="grid grid-cols-5 gap-1.5">
              {sheets.map(sheet => {
                const isCurrent = sheet.page === currentPage
                return (
                  <button
                    key={sheet.id}
                    type="button"
                    onClick={() => handleSelectSheet(sheet.page)}
                    className={`overflow-hidden text-[11px] font-bold whitespace-nowrap px-1.5 py-2 text-center rounded-lg transition-all border ${
                      isCurrent
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-sm'
                        : 'bg-slate-800/90 border-slate-700/80 text-slate-300 hover:border-slate-600 hover:text-white'
                    }`}
                  >
                    {sheet.pillLabel}
                  </button>
                )
              })}
            </div>
          </div>

          {/* 1:1 Zoomed CAD Detail Spotlight Stage */}
          <div ref={cadStageRef} className="scroll-mt-3">
            <CadSpotlightStage
              sheetCode={activeSheet.sheetCode}
              sheetShortLabel={activeSheet.pillLabel}
              sheetTitle={activeSheet.fullTitle}
              activeItem={activeSpotlightItem}
              activeIndex={safeDetailIdx}
              totalItems={activeTakeaways.length}
              onPrevDetail={handlePrevDetail}
              onNextDetail={handleNextDetail}
              onPrevSheet={() => handleSelectSheet(Math.max(1, currentPage - 1))}
              onNextSheet={() => handleSelectSheet(Math.min(sheets.length, currentPage + 1))}
              currentSheetIndex={currentPage - 1}
              totalSheets={sheets.length}
            />
          </div>

          {/* Interactive Masterclass Cards Below the Stage */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 space-y-3">
            <div className="flex flex-col gap-0.5 pb-2 border-b border-slate-800/80">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <BookOpen size={15} className="text-cyan-400 shrink-0" />
                  <h4 className="truncate text-xs sm:text-sm font-bold text-white uppercase tracking-wide">
                    {activeSheet.sheetCode} — {activeSheet.fullTitle.toUpperCase()}
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowMasterclassInfo(!showMasterclassInfo)}
                    className="p-1 rounded-full text-slate-400 hover:text-cyan-400 transition-colors shrink-0"
                    title="About Masterclass Cards"
                  >
                    <Info size={14} />
                  </button>
                </div>
                <span className="text-[11px] font-mono font-bold text-emerald-400 whitespace-nowrap shrink-0">
                  {sheetMasteredCount}/{activeTakeaways.length} Mastered
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                Tap any card below to inspect its 1:1 CAD Spotlight diagram above
              </span>
            </div>

            {showMasterclassInfo && (
              <div className="bg-slate-950 border border-cyan-500/40 rounded-xl p-3 text-xs text-slate-200 leading-relaxed">
                <strong className="text-cyan-400 block mb-1">Interactive Blueprint Masterclass</strong>
                Tap any specification card below to load its 1:1 zoomed CAD diagram and 3-point symbol key into the Spotlight Stage above. Toggle <span className="text-emerald-400 font-bold">✓ Mastered</span> as you lock in each Red Seal NBC requirement.
              </div>
            )}

            <div className="space-y-2.5">
              {activeTakeaways.map((item, idx) => {
                const isActive = idx === safeDetailIdx
                const masteryKey = `${activeSheet.sheetCode}::${item.title}`
                const isMastered = !!masteredItems[masteryKey]

                return (
                  <div
                    key={masteryKey}
                    onClick={() => handleInspectInStage(idx)}
                    className={`rounded-xl border p-3 transition-all cursor-pointer ${
                      isActive
                        ? 'border-cyan-400 bg-cyan-950/20 shadow-md'
                        : 'border-slate-800 bg-slate-950/70 hover:border-slate-700'
                    }`}
                  >
                    {/* Card Title Row */}
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={`w-5 h-5 rounded-md font-mono text-[10px] font-bold flex items-center justify-center shrink-0 ${
                          isActive
                            ? 'bg-cyan-400 text-slate-950'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <h5 className="text-xs sm:text-sm font-extrabold uppercase tracking-tight text-white truncate">
                        {item.title}
                      </h5>
                    </div>

                    {/* Symmetrical 2-Column Action Row: INSPECT IN STAGE | ○ MARK MASTERED / ✓ MASTERED */}
                    <div className="grid grid-cols-2 gap-2 mt-2 mb-2.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleInspectInStage(idx)
                        }}
                        className={`overflow-hidden px-2 py-1.5 rounded-lg text-[10.5px] font-extrabold uppercase tracking-wide whitespace-nowrap text-center transition-colors ${
                          isActive
                            ? 'bg-cyan-400 text-slate-950 shadow-sm'
                            : 'bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700'
                        }`}
                      >
                        {isActive ? 'ACTIVE IN SPOTLIGHT' : 'INSPECT IN STAGE'}
                      </button>

                      <button
                        type="button"
                        onClick={(e) => toggleMastered(e, masteryKey)}
                        className={`overflow-hidden px-2 py-1.5 rounded-lg text-[10.5px] uppercase tracking-wide whitespace-nowrap flex items-center justify-center border transition-colors ${
                          isMastered
                            ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold'
                            : 'bg-slate-900/60 border-slate-700 text-slate-400 hover:text-white font-semibold'
                        }`}
                      >
                        {isMastered ? (
                          <>
                            <CheckCircle2 className="inline mr-1.5 shrink-0" size={13} />
                            <span>MASTERED</span>
                          </>
                        ) : (
                          <>
                            <Circle className="inline mr-1.5 shrink-0" size={13} />
                            <span>MARK MASTERED</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Print Definition */}
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Red Seal Exam Focus (when active) */}
                    {isActive && item.examFocus && item.examFocus !== item.description && (
                      <div className="mt-2 bg-slate-900/90 border border-slate-800 rounded-lg px-2.5 py-2 text-[11px] text-slate-200 leading-relaxed">
                        <span className="text-[10px] font-mono font-bold uppercase text-cyan-400 block mb-0.5">
                          RED SEAL EXAM TAKEAWAY:
                        </span>
                        {item.examFocus}
                      </div>
                    )}

                    {/* Highlighted Red Seal / NBC Code Rule Pill at Bottom */}
                    <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-mono font-bold leading-tight">
                        <ShieldCheck size={13} className="text-amber-400 shrink-0" />
                        <span>{item.code}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODE 2: SCHEDULES & SYMBOLS (DOOR/WINDOW/LINTEL + TOP 40 DECODER)    */}
      {/* =================================================================== */}
      {activeMode === 'schedules' && (
        <div className="space-y-4">
          {/* Interactive Door, Window & Lintel Schedule Card */}
          <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-3.5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white">
                  DOOR, WINDOW &amp; LINTEL SCHEDULE DECODER
                </h3>
                <p className="text-[11px] text-slate-400">
                  Tap any schedule row (D01–D04, W01–W03, L1–L2) to inspect its framing rough opening &amp; header build
                </p>
              </div>

              <div className="flex flex-wrap gap-1">
                {['ALL', 'DOOR', 'WINDOW', 'LINTEL'].map(f => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setScheduleFilter(f)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase whitespace-nowrap border transition-colors ${
                      scheduleFilter === f
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Schedule Rows Grid */}
            <div className="grid grid-cols-1 gap-2">
              {filteredSchedules.map(row => {
                const isSelected = selectedScheduleRow?.tag === row.tag
                return (
                  <div
                    key={row.tag}
                    onClick={() => setSelectedScheduleRow(row)}
                    className={`rounded-xl border p-3 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-cyan-400 bg-cyan-950/20'
                        : 'border-slate-800 bg-slate-950/70 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-cyan-500/20 border border-cyan-500/40 font-mono text-xs font-extrabold text-cyan-300">
                          {row.tag}
                        </span>
                        <span className="text-xs font-extrabold text-white uppercase">
                          {row.location}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {row.category}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] mt-2">
                      <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-2">
                        <span className="text-[9px] font-mono uppercase text-slate-400 block">NOMINAL SIZE</span>
                        <span className="font-mono font-bold text-white">{row.nominalSize}</span>
                      </div>
                      <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-2">
                        <span className="text-[9px] font-mono uppercase text-cyan-400 block">ROUGH OPENING (R.O.)</span>
                        <span className="font-mono font-bold text-cyan-300">{row.roughOpening}</span>
                      </div>
                      <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-2">
                        <span className="text-[9px] font-mono uppercase text-amber-400 block">HEADER / LINTEL</span>
                        <span className="font-mono font-bold text-amber-300">{row.headerSpec}</span>
                      </div>
                      <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-2">
                        <span className="text-[9px] font-mono uppercase text-emerald-400 block">JACK &amp; KING STUDS</span>
                        <span className="font-mono font-bold text-emerald-300">{row.studsReq}</span>
                      </div>
                    </div>

                    <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-mono font-bold">
                      <ShieldCheck size={12} className="shrink-0" />
                      <span>{row.nbcRule}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Architectural Line-Type Visual Key */}
          <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-3.5 space-y-2.5">
            <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white">
              CAD LINE-TYPE &amp; ALPHABET OF LINES DECODER
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {CAD_LINE_TYPES.map((lt, i) => (
                <div key={i} className="bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-extrabold text-white">{lt.name}</span>
                    <span className="text-[10px] font-mono font-bold text-cyan-400">{lt.pattern}</span>
                  </div>
                  <svg viewBox="0 0 220 22" className="w-full h-5 bg-[#071527] rounded border border-slate-800">
                    <line
                      x1="14"
                      y1="11"
                      x2="206"
                      y2="11"
                      stroke={lt.color}
                      strokeWidth={lt.width}
                      strokeDasharray={lt.dashArray}
                    />
                  </svg>
                  <p className="text-[11px] text-slate-400 leading-snug">{lt.usage}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Top 40 Red Seal Blueprint Abbreviations Searchable Table */}
          <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-3.5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white">
                  TOP 40 RED SEAL BLUEPRINT ABBREVIATIONS ({filteredAbbreviations.length})
                </h3>
                <p className="text-[11px] text-slate-400">
                  Instant lookup for architectural, structural, elevation, and MEP print callouts
                </p>
              </div>

              {/* Search Input */}
              <div className="relative w-full sm:w-60">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={abbrSearch}
                  onChange={(e) => setAbbrSearch(e.target.value)}
                  placeholder="Search T.O.F., R.O., U.N.O..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5">
              {['All', 'Elevations', 'Openings', 'Framing', 'General', 'MEP & Site'].map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setAbbrCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap border transition-colors ${
                    abbrCategory === cat
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Abbreviations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {filteredAbbreviations.map(item => (
                <div
                  key={item.abbr}
                  className="bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 flex items-start gap-3"
                >
                  <span className="px-2.5 py-1 rounded-lg bg-cyan-500/15 border border-cyan-500/40 font-mono text-xs font-extrabold text-cyan-300 shrink-0 min-w-[58px] text-center">
                    {item.abbr}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-extrabold text-white truncate">{item.term}</span>
                      <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 shrink-0">
                        {item.cat}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODE 3: INTERACTIVE READ-THE-PRINT QUIZ                              */}
      {/* =================================================================== */}
      {activeMode === 'quiz' && (
        <div className="space-y-3">
          {/* Quiz Progress & Question Jumper Card */}
          <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-3.5 space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 block">
                  RED SEAL BLUEPRINT READING CHALLENGES
                </span>
                <h3 className="text-xs sm:text-sm font-extrabold text-white uppercase">
                  Question {quizIndex + 1} of {PRINT_QUIZ_QUESTIONS.length} • Score: {quizScore.correct} / {quizScore.total}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => {
                  setQuizAnswers({})
                  setQuizIndex(0)
                }}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-[11px] font-bold flex items-center gap-1.5 whitespace-nowrap"
              >
                <RotateCcw size={12} />
                <span>Reset Quiz</span>
              </button>
            </div>

            {/* 12 Question Number Pills in a Symmetrical 6x2 Grid */}
            <div className="grid grid-cols-6 gap-1.5">
              {PRINT_QUIZ_QUESTIONS.map((q, idx) => {
                const ans = quizAnswers[idx]
                const isAnswered = ans !== undefined
                const isCorrect = ans === q.correctIndex
                const isCurrent = idx === quizIndex

                let pillStyle = 'bg-slate-800 border-slate-700 text-slate-300'
                if (isAnswered) {
                  pillStyle = isCorrect
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                    : 'bg-red-500/20 border-red-500 text-red-300'
                }
                if (isCurrent) {
                  pillStyle += ' ring-2 ring-cyan-400'
                }

                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setQuizIndex(idx)}
                    className={`w-full py-1.5 rounded-lg font-mono text-xs font-bold border text-center transition-all ${pillStyle}`}
                  >
                    {idx + 1}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Active Print Quiz Challenge Card with 1:1 Zoomed CAD Graphic */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="bg-slate-950 px-3.5 py-2 border-b border-slate-800 flex items-center justify-between gap-2">
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] text-cyan-400/80 uppercase font-mono leading-tight whitespace-nowrap truncate">
                  {quizSheetLabel}
                </span>
                <span className="text-xs font-bold text-white whitespace-nowrap truncate">
                  {quizTopicTitle}
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setQuizIndex(prev => Math.max(0, prev - 1))}
                  disabled={quizIndex === 0}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-[10px] font-bold flex items-center gap-0.5 whitespace-nowrap"
                >
                  <ChevronLeft size={12} />
                  <span>Prev</span>
                </button>
                <button
                  type="button"
                  onClick={() => setQuizIndex(prev => Math.min(PRINT_QUIZ_QUESTIONS.length - 1, prev + 1))}
                  disabled={quizIndex === PRINT_QUIZ_QUESTIONS.length - 1}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-[10px] font-bold flex items-center gap-0.5 whitespace-nowrap"
                >
                  <span>Next</span>
                  <ChevronRight size={12} />
                </button>
              </div>
            </div>

            {/* Zoomed CAD Snippet for the Question */}
            <div className="bg-[#071527] border-b border-slate-800">
              <svg viewBox="0 0 360 180" className="w-full h-auto block select-none">
                <defs>
                  <pattern id="quizCadGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                    <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(56, 189, 248, 0.1)" strokeWidth="0.7" />
                  </pattern>
                </defs>
                <rect width="360" height="180" fill="#071527" />
                <rect width="360" height="180" fill="url(#quizCadGrid)" />
                <rect x="6" y="6" width="348" height="168" rx="4" fill="none" stroke="rgba(56, 189, 248, 0.3)" strokeWidth="1" />
                {currentQuizQ.renderGraphic()}
              </svg>
            </div>

            {/* Question Stem & Options */}
            <div className="p-4 space-y-3">
              <p className="text-xs sm:text-sm font-bold text-white leading-relaxed">
                {currentQuizQ.question}
              </p>

              <div className="space-y-2">
                {currentQuizQ.options.map((opt, oIdx) => {
                  const isPicked = userSelectedOption === oIdx
                  const isEvaluated = userSelectedOption !== undefined
                  const isRightOption = oIdx === currentQuizQ.correctIndex

                  let btnClass = 'bg-slate-950/80 border-slate-800 text-slate-200 hover:border-slate-600'
                  if (isEvaluated) {
                    if (isRightOption) {
                      btnClass = 'bg-emerald-950/40 border-emerald-500 text-emerald-200'
                    } else if (isPicked) {
                      btnClass = 'bg-red-950/40 border-red-500 text-red-200'
                    } else {
                      btnClass = 'bg-slate-950/40 border-slate-800/60 text-slate-500'
                    }
                  }

                  return (
                    <button
                      key={oIdx}
                      type="button"
                      onClick={() =>
                        setQuizAnswers(prev => ({
                          ...prev,
                          [quizIndex]: oIdx
                        }))
                      }
                      className={`w-full text-left p-3 rounded-xl border text-xs font-semibold transition-all flex items-start gap-2.5 ${btnClass}`}
                    >
                      <span className="w-5 h-5 rounded-md bg-slate-800 border border-slate-700 font-mono text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5 text-cyan-300">
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                      <span className="leading-snug flex-1">{opt}</span>
                    </button>
                  )
                })}
              </div>

              {/* Instant NBC Explanation Box */}
              {userSelectedOption !== undefined && (
                <div
                  className={`rounded-xl border p-3 space-y-1.5 ${
                    userSelectedOption === currentQuizQ.correctIndex
                      ? 'bg-emerald-950/25 border-emerald-500/40'
                      : 'bg-amber-950/25 border-amber-500/40'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-xs font-extrabold uppercase ${
                        userSelectedOption === currentQuizQ.correctIndex ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      {userSelectedOption === currentQuizQ.correctIndex
                        ? '✓ Correct Blueprint Interpretation'
                        : '✕ Review Blueprint Rule'}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded">
                      {currentQuizQ.nbcClause}
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {currentQuizQ.explanation}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
