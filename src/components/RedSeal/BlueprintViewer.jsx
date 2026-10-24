import React, { useState, useMemo, useRef, useEffect } from 'react'
import { motion, useMotionValue, AnimatePresence } from 'framer-motion'
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Minimize2, 
  Download, 
  Printer, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  RefreshCw,
  FileText,
  Layers,
  Info,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Trash2,
  Edit2,
  Tag,
  Save,
  BookOpen,
  CheckSquare,
  X
} from 'lucide-react'

// Import from react-pdf for compliance (with safe fallback setup)
import { Document, Page, pdfjs } from 'react-pdf'
import blueprintsData from '../../data/RedSeal/blueprints.json'
import schedulesData from '../../data/RedSeal/schedules.json'
import InteractiveBlueprint from './InteractiveBlueprint'

// Set up pdfjs worker if react-pdf is initialized
try {
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`
} catch (e) {
  console.log('PDFJS worker source setup bypassed safely')
}

const ALL_INTERACTIVE_TAKEAWAYS = [
  {
    title: "Joist Span Arrow",
    description: "Indicates the layout direction and length of the floor joist span.",
    code: "NBC 9.23.9.2",
    examFocus: "Joists must lap or bear at least 150mm (6 in) over bearing points. Span charts determine suitable lumber species and grades."
  },
  {
    title: "Cross-Bridging",
    description: "Solid blocking or cross-bridging installed between joists.",
    code: "NBC 9.23.9.4",
    examFocus: "Required every 2.1m (6'-10\") along the span to prevent the joists from twisting or buckling under load."
  },
  {
    title: "Metal Joist Hangers",
    description: "Engineered metallic brackets designed to support structural joists.",
    code: "NBC 9.23.9.2",
    examFocus: "Used where joists frame directly into beams or flush headers instead of bearing on top of them. Requires special short thick shear nails."
  },
  {
    title: "LVL Beam",
    description: "Laminated Veneer Lumber engineered beam providing primary structural bearing.",
    code: "NBC Part 9",
    examFocus: "Engineered beams such as LVLs offer higher load capacity and longer spans than dimensional lumber, often used for primary bearing."
  },
  {
    title: "Trimmer & Header Joists",
    description: "Framing around floor openings such as stairwells.",
    code: "NBC Part 9",
    examFocus: "Openings in floor framing exceeding 1.2m (4') in width require doubled header joists and doubled trimmer joists to properly transfer the interrupted load."
  },
  {
    title: "Joist Penetration",
    description: "Holes drilled through floor joists for plumbing, electrical, or HVAC.",
    code: "NBC 9.23.5.1",
    examFocus: "Holes drilled in framing members cannot exceed 1/4 the depth of the member unless properly engineered, and should be near the neutral axis."
  },
  {
    title: "Plumbing P-Trap",
    description: "A U-shaped plumbing fixture that holds a small amount of water to create a seal against sewer gases.",
    code: "NBC Section 7.2",
    examFocus: "Understand that every fixture must have a P-trap to prevent toxic sewer gases from entering the living space."
  },
  {
    title: "Soil Stack",
    description: "The main vertical pipe that carries wastewater and solid waste from fixtures to the building drain.",
    code: "NBC Part 7",
    examFocus: "Identify the size and location of soil stacks; typical size is 3\" ABS for residential homes."
  },
  {
    title: "Building Drain",
    description: "The lowest part of the drainage system that receives the discharge from soil stacks and waste pipes.",
    code: "NBC Part 7",
    examFocus: "The building drain must have a minimum slope of 2% (1/4 inch per foot) to ensure proper gravity flow."
  },
  {
    title: "Cleanout (C.O.)",
    description: "An accessible opening in the drainage system used for clearing blockages.",
    code: "NBC Part 7",
    examFocus: "Cleanouts are required at the base of every soil stack and at changes of direction in the building drain."
  },
  {
    title: "Revision Block",
    description: "Tracks drawing revisions (e.g., Revision 3). Critical for ensuring you are building off the latest issued set of prints.",
    code: "NBC Section 9.3",
    examFocus: "Check drawing version indices against master logs to avoid costly rebuild errors on site."
  },
  {
    title: "Section Marks",
    description: "Show where a building cross-section is cut. Points to detail drawing 'A' on page 'A4.2' or 'S-101'.",
    code: "NBC Section 9.3",
    examFocus: "Understand wall assembly components, foundation anchors, and insulation details by reading section drawings."
  },
  {
    title: "Structural Grids",
    description: "Bubbles with numbers and letters marking exact centerlines of structural columns, load-bearing posts, or beams.",
    code: "NBC Section 9.23.10",
    examFocus: "Identify centerlines to locate footing placement and line up structural framing with engineering specs."
  },
  {
    title: "Dimension Lines",
    description: "Establish total length, depth, and layout points. Crucial for performing linear takeoffs and confirming exterior wall boundaries.",
    code: "NBC Section 9.3.1.1",
    examFocus: "Read overall dimensions versus cumulative partition dimensions to check for layout discrepancies."
  },
  {
    title: "Dimension Strings",
    description: "Architectural dimension strings on prints establish layouts, widths, and boundaries.",
    code: "NBC Section 9.3",
    examFocus: "Understand the hierarchy of dimension lines: overall dimensions form the outermost string, followed by middle strings showing major partitions and openings, and inner strings specifying exact framing and window/door rough openings (R.O.). Remember the strict 'Do Not Scale' rule: physical scaling on paper/screen is highly inaccurate due to copying and digital distortion; always reference written dimensions or request a structural clarification. NBC 9.3 allows tolerances but mandates that building framing conforms strictly to specified offsets."
  },
  {
    title: "Dimension Hierarchy",
    description: "The structured arrangement of multiple parallel dimension strings on architectural drawings, dividing measurements into overall, partition, and rough opening levels.",
    code: "NBC Section 9.3",
    examFocus: "Understand the hierarchy of dimension lines: String 1 (Outer) shows absolute overall building dimensions; String 2 (Middle) locates major walls, jogs, and offset structural centerlines; String 3 (Inner) specifies exact framing, window, and door rough openings (R.O.). Strict Jobsite Rule: If dimensions contradict, the written outer overall string ALWAYS overrules the middle string, which overrules the inner strings. Use grid-lines to cross-verify dimensions across sheets. 'Do Not Scale' is the absolute rule: digital or printed sheets distort, so never physically scale a drawing; always request structural clarification or refer to written numbers."
  },
  {
    title: "Window Symbols",
    description: "Show window size, opening direction, and frame schedules specifying headers, rough openings, and egress sizing.",
    code: "NBC Section 9.7",
    examFocus: "Identify minimum egress requirements for bedroom windows (at least 0.35 m² unobstructed opening area with 380mm min dimension)."
  },
  {
    title: "Door Symbols",
    description: "Represent door widths, rough openings, and swing directions to ensure clear egress and standard clearance.",
    code: "NBC Section 9.9.6",
    examFocus: "Verify minimum clear widths for egress doors and correct swing directions in corridors."
  },
  {
    title: "Staircase Symbols",
    description: "Illustrate stair direction (UP/DN), number of risers, and path of travel. Essential for headrooms and stairwells.",
    code: "NBC Section 9.8.4",
    examFocus: "Calculate total rise and run. Maximum riser height 200mm, minimum run 210mm in dwelling units."
  },
  {
    title: "Load-Bearing Partition",
    description: "An interior wall designed to carry vertical loads from floors, roofs, or ceilings above down to the foundation or beams below.",
    code: "NBC Section 9.23.10",
    examFocus: "Any door or window openings in a load-bearing wall MUST have a properly sized structural lintel header resting on trimmer studs (jack studs) to safely transfer gravity loads to the sole plate. Standard load-bearing partitions use 2x6 framing at 16\" O.C. for stability and structural capacity."
  },
  {
    title: "Non-Bearing Partition",
    description: "An interior wall that supports no load other than its own weight. Standard framing typically uses 2x4 studs @ 16\" o.c.",
    code: "NBC Section 9.23.10",
    examFocus: "Since non-bearing partitions carry no structural floor or roof loads, headers are NOT required over door openings. A simple double flat plate or single flat stud header is structurally and legally acceptable, reducing material cost and labor on site."
  },
  {
    title: "Plumbing Chase Framing",
    description: "A thickened wall framing assembly (such as a 2x6 wet wall or built-out furring chase) designed to accommodate large 3\" waste/vent plumbing pipes.",
    code: "NBC Section 9.23.5.3",
    examFocus: "When running a 3\" ABS soil/vent stack (which has an outside diameter exceeding 3.5\"), a standard 2x4 wall is structurally insufficient. Under NBC 9.23.5.3, notching or drilling a stud past 1/3 of its depth is prohibited. Running a 3\" pipe would completely cut a 2x4 stud. Therefore, a 2x6 wall (providing 5.5\" depth) must be framed, or a dedicated plumbing chase must be built to preserve the load-bearing wood core's structural integrity."
  },
  {
    title: "Elevation Markers",
    description: "Indicate external view directions. The number indicates the elevation view on corresponding sheet A3.",
    code: "NBC Section 9.3",
    examFocus: "Cross-reference floor plan views with exterior elevations to check roof pitches, overhangs, and siding finishes."
  },
  {
    title: "Pad Footing",
    description: "Concrete pads that distribute heavy concentrated columns or telepost point loads to the soil below.",
    code: "NBC Section 9.15",
    examFocus: "Ensure pad dimension matches structural load calculations and soil bearing capacity."
  },
  {
    title: "Roof Pitch",
    description: "The slope of a roof expressed as rise over run (e.g., 5/12 pitch), indicating vertical rise in inches per foot of run.",
    code: "NBC Section 9.26",
    examFocus: "Required to select appropriate roofing materials, underlayment, and calculating rafter lengths."
  },
  {
    title: "Height Marker",
    description: "Establishes vertical datums such as top of wall plate or subfloor level, providing a master benchmark reference.",
    code: "NBC Section 9.4",
    examFocus: "Verify wall height limits, headroom requirements, and overall building height calculations."
  },
  {
    title: "Electrical Panel",
    description: "The central distribution panel (e.g., 200A main service) where electrical power is split into branch circuits.",
    code: "Canadian Electrical Code",
    examFocus: "Location must be accessible and keep clear working space, never located in clothes closets or bathrooms."
  },
  {
    title: "Switch & Wiring",
    description: "Specifies switches (like a 3-way switch marked $3) and wire routing runs showing how fixtures are controlled.",
    code: "Canadian Electrical Code",
    examFocus: "3-way switches allow a single lighting outlet to be controlled from two different entrance/exit points."
  },
  {
    title: "GFCI Outlet",
    description: "Ground Fault Circuit Interrupter outlets designed to shut off power instantly if a ground fault occurs.",
    code: "Canadian Electrical Code",
    examFocus: "Mandatory within 1.5 meters of sinks, bathtubs, or shower stalls to protect against electrical shock."
  },
  {
    title: "Lintel Headers",
    description: "Structural members framed above door and window openings to transfer overhead gravity loads to adjacent framing.",
    code: "NBC Section 9.23.10.6",
    examFocus: "Sizing built-up wood headers (e.g., tripled 2x10 SPF or engineered LVLs) must follow NBC span tables. Crucially, the header must rest on jack studs (trimmer studs) that provide direct bearing support. NBC 9.23.10.6 mandates at least one trimmer stud per side, increasing to two or more for wider openings, to safely transfer roof and floor gravity loads to the sole plate."
  },
  {
    title: "Weeping Tile Drainage",
    description: "A subsurface perforated drainage pipe laid around the exterior perimeter of footings to manage groundwater.",
    code: "NBC Section 9.14.3.1",
    examFocus: "Perforated weeping tiles relieve hydrostatic water pressure against basement foundation walls under NBC 9.14.3.1. They must be laid on solid ground or clear gravel with perforations facing downward, covered by a polyester filter sock to prevent silt infiltration, and backfilled with at least 150mm (6\") of washed clear stone to ensure continuous drainage flow toward a sump basin or storm outlet."
  },
  {
    title: "Step Footings",
    description: "A stepped foundation footing used on sloped terrain to transition foundation depths gradually.",
    code: "NBC Section 9.15.3.9",
    examFocus: "When a building is constructed on a sloped site, the foundation footing must be stepped to transition foundation depths gradually. NBC 9.15.3.9 limits the slope of steps: the vertical rise must not exceed 600mm (24\"), and the horizontal run must be at least 600mm, creating a maximum 1:2 vertical-to-horizontal slope ratio. Stepped footings must be poured monolithically with proper continuous reinforcement."
  },
  {
    title: "Telepost Pads",
    description: "Isolated heavy concrete footing pads designed to receive massive point loads from structural posts.",
    code: "NBC Section 9.15",
    examFocus: "Isolated concrete pad footings transfer heavy concentrated loads from structural columns or adjustable steel teleposts down to bearing soils. Sizing must be calculated based on the local soil bearing capacity—ranging from soft clay at 75 kPa to dense till or rock at 400 kPa or more under NBC 9.15. Concrete pads must never be smaller than calculated, typically starting at 750mm x 750mm x 300mm to prevent structural settlement."
  },
  {
    title: "Height Datums",
    description: "Vertical elevation references on architectural prints used to establish structural levels.",
    code: "NBC Section 9.8 / Zoning",
    examFocus: "Master elevation benchmarks (BM) prevent cumulative vertical framing errors on jobsites. They ensure correct staircase headroom clearance (minimum 1950mm or 6'-5\") and overall compliance with local municipal zoning height restrictions. Measuring from the physical top-of-concrete foundation benchmark is standard practice for setting joists, plates, and rafters."
  },
  {
    title: "Rain Screen Cladding",
    description: "An exterior wall cladding system that creates a drained and vented cavity behind the siding.",
    code: "NBC Section 9.27.2.4",
    examFocus: "Modern energy codes mandate a capillary break behind exterior siding to manage water infiltration. NBC 9.27.2.4 requires a rain-screen system featuring a minimum 10mm (3/8\") drainage cavity, created by horizontal or vertical furring/strapping over an approved water-resistant barrier (WRB). This cavity allows gravity drainage of bulk moisture and ventilation drying, preventing rot in sheathing."
  },
  {
    title: "CEC Working Clearance",
    description: "Mandatory safe physical clearances required in front of live electrical equipment.",
    code: "CEC Rule 2-308 / 6-200",
    examFocus: "Canadian Electrical Code (CEC) Rule 2-308 and Rule 6-200 mandate a minimum of 1-meter (39\") unobstructed, flat working clearance depth in front of electrical panels, disconnect switches, and meters. This space is critical for worker safety during maintenance or emergency power shutdowns, and must never be blocked by plumbing pipes, HVAC ducting, or structural studs."
  },
  {
    title: "Interconnected Smoke Alarms",
    description: "Hardwired, synchronized residential fire and carbon monoxide safety systems.",
    code: "NBC Section 9.10.19",
    examFocus: "National Building Code Section 9.10.19 requires hardwired, interconnected smoke alarms on every level of a dwelling (including basements) and inside or immediately outside all bedrooms. Interconnection ensures that if one alarm detects smoke or CO, all alarms in the dwelling sound simultaneously. They must be connected to an unswitched lighting circuit to ensure continuous power."
  },
  {
    title: "Plumbing Riser Venting",
    description: "Mandatory venting plumbing schematic ensuring air pressure balance across the building sewer drainage network.",
    code: "NBC Part 7 (Plumbing)",
    examFocus: "Venting is mandatory under Part 7 of the National Building Code to prevent hydraulic siphoning of plumbing traps. As waste water flows, it creates a hydraulic vacuum. If venting is absent or blocked, this suction pulls water straight out of the P-trap seal, letting sewer gas into the home. All plumbing systems must integrate secure venting loops."
  },
  {
    title: "Sump Pit Radon Seal",
    description: "Sealed container positioned below the basement slab designed to collect sub-slab water seepage safely.",
    code: "NBC Section 9.25.1.2",
    examFocus: "To combat radon gas accumulation in basements, NBC Section 9.25.1.2 requires sump pits in basement concrete slabs to be fitted with a robust, airtight, and sealed gasketed lid. This prevents harmful soil gases and radon decay particles from leaking into the lower levels of the dwelling."
  },
  {
    title: "Attic Ventilation",
    description: "Net free venting area must be at least 1/300 of the insulated ceiling area, distributed between eaves and ridge.",
    code: "NBC 9.19.1",
    examFocus: "Understand ventilation requirements for unheated attics to prevent moisture accumulation and ice dams."
  },
  {
    title: "Eaves Protection",
    description: "Ice and water shield must extend from edge of roof to a line not less than 900mm up the roof slope.",
    code: "NBC 9.26.5",
    examFocus: "Identify the extent of eaves protection required to prevent water ingress from ice damming."
  },
  {
    title: "Guard & Handrail Height",
    description: "Handrails required if >2 risers. Guards must be min 900mm high, or 1070mm if drop exceeds 10m.",
    code: "NBC 9.8.7/8",
    examFocus: "Verify stair safety parameters such as handrail heights (865-1070mm) and guard heights based on fall distance."
  },
  {
    title: "FROST DEPTH FOUNDATIONS",
    description: "NBC 9.12.2.2 requires exterior footings to be placed below the frost line to prevent frost heave, unless resting on non-frost-susceptible soil or rock. Depth varies by local climate data.",
    code: "NBC 9.12.2.2",
    examFocus: "Understand requirements for foundations and frost."
  },
  {
    title: "BIRDSMOUTH BEARING",
    description: 'The horizontal cut (seat cut) of a birdsmouth must provide a minimum bearing area of 38mm (1.5") on the top plate. The cut must not exceed 1/3 the depth of the rafter.',
    code: "NBC 9.23.14",
    examFocus: "Verify birdsmouth cutting rules for roof framing."
  },
  {
    title: "MINIMUM ROOF SLOPE",
    description: "Standard asphalt shingles require a minimum roof slope of 1:3 (4 in 12). Low-slope applications (down to 1:6 or 2 in 12) require special continuous eave protection and underlayment.",
    code: "NBC 9.26.2",
    examFocus: "Understand roofing slope minimums for specific materials."
  },
  {
    title: "BEDROOM EGRESS WINDOWS",
    description: "NBC 9.9.10.1 requires every bedroom to have at least one outside window openable from the inside. It must provide an unobstructed opening of not less than 0.35 m² (3.77 sq. ft.), with no dimension less than 380mm (15\").",
    code: "NBC 9.9.10.1",
    examFocus: "Memorize the minimum dimensions for egress windows in bedrooms."
  },
  {
    title: "STRINGER ATTACHMENT",
    description: "Stringers must be fully supported at the top and bottom. Top connections typically require approved framing anchors (joist hangers) or a ledger board to prevent downward sheer failure.",
    code: "NBC 9.8.9.4",
    examFocus: "Understand approved fastening methods for stair stringers."
  },
  {
    title: "STRINGER EFFECTIVE DEPTH",
    description: "When cutting open stringers, the solid, uncut portion of the lumber (effective depth) must be a minimum of 90mm (approx. 3.5\"). This usually dictates using 2x10 or 2x12 lumber.",
    code: "NBC 9.8.9.4",
    examFocus: "Know the minimum effective depth for wooden stair stringers."
  },
  {
    title: "RISE & RUN TOLERANCES",
    description: "To prevent tripping hazards, NBC dictates strict uniformity. The variation in the dimensions of adjacent risers or adjacent treads must not exceed 5mm (3/16\").",
    code: "NBC 9.8.4.4",
    examFocus: "Understand strict dimensional tolerances for adjacent stair treads and risers."
  }
];

const LEGEND_ITEMS = [
  // Category: General & Reference Symbols
  {
    id: "leg-01",
    category: "general",
    name: "IFC Stamp",
    code: "NBC Section 9.3",
    description: "Green 'Issued For Construction' stamp confirming the drawings have passed engineering review and are legally authorized for on-site execution.",
    svg: (isDark) => (
      <svg className="w-16 h-10 border border-emerald-500/30 rounded bg-emerald-500/5" viewBox="0 0 80 40">
        <rect x="5" y="5" width="70" height="30" fill="#059669" rx="3" />
        <text x="40" y="23" fill="#ffffff" fontSize="8" fontWeight="black" textAnchor="middle">IFC STAMP</text>
      </svg>
    )
  },
  {
    id: "leg-02",
    category: "general",
    name: "Section Mark",
    code: "NBC Section 9.3",
    description: "Directs builders to cut-away elevation details. The number (e.g. 3) represents the detail number, and the letters (e.g. S-101) point to the destination sheet.",
    svg: (isDark) => (
      <svg className="w-16 h-10 border border-slate-500/20 rounded bg-slate-500/5" viewBox="0 0 80 40">
        <circle cx="30" cy="20" r="10" fill={isDark ? "#1e3a5f" : "#f1f5f9"} stroke="#38bdf8" strokeWidth="1.5" />
        <line x1="10" y1="20" x2="65" y2="20" stroke="#38bdf8" strokeWidth="1.5" />
        <polygon points="65,20 58,15 58,25" fill="#38bdf8" />
        <text x="30" y="23" fill={isDark ? "#ffffff" : "#0f172a"} fontSize="8" fontWeight="black" textAnchor="middle">3</text>
        <line x1="22" y1="20" x2="38" y2="20" stroke="#38bdf8" strokeWidth="0.5" />
        <text x="30" y="28" fill={isDark ? "#cbd5e1" : "#475569"} fontSize="5" fontWeight="bold" textAnchor="middle">S-101</text>
      </svg>
    )
  },
  {
    id: "leg-03",
    category: "general",
    name: "Structural Grids",
    code: "NBC Section 9.23.10",
    description: "Grid lines representing structural load path columns and centerlines. Allows cross-referencing floor layouts with structural footings.",
    svg: (isDark) => (
      <svg className="w-16 h-10 border border-slate-500/20 rounded bg-slate-500/5" viewBox="0 0 80 40">
        <line x1="40" y1="0" x2="40" y2="40" stroke="#f43f5e" strokeWidth="1" strokeDasharray="4 2 1 2" />
        <circle cx="40" cy="20" r="8" fill={isDark ? "#881337" : "#fecdd3"} stroke="#f43f5e" strokeWidth="1.5" />
        <text x="40" y="23" fill={isDark ? "#fecdd3" : "#9f1239"} fontSize="9" fontWeight="black" textAnchor="middle">1</text>
      </svg>
    )
  },
  {
    id: "leg-04",
    category: "general",
    name: "Dimension Lines",
    code: "NBC Section 9.3",
    description: "Thin lines with ticks marking architectural widths/lengths. Crucial for exact framing dimensions, window alignments, and general spans.",
    svg: (isDark) => (
      <svg className="w-16 h-10 border border-slate-500/20 rounded bg-slate-500/5" viewBox="0 0 80 40">
        <line x1="10" y1="20" x2="70" y2="20" stroke={isDark ? "#cbd5e1" : "#475569"} strokeWidth="1" />
        <line x1="10" y1="12" x2="10" y2="28" stroke={isDark ? "#cbd5e1" : "#475569"} strokeWidth="1" />
        <line x1="70" y1="12" x2="70" y2="28" stroke={isDark ? "#cbd5e1" : "#475569"} strokeWidth="1" />
        <line x1="6" y1="24" x2="14" y2="16" stroke={isDark ? "#38bdf8" : "#0284c7"} strokeWidth="1.5" />
        <line x1="66" y1="24" x2="74" y2="16" stroke={isDark ? "#38bdf8" : "#0284c7"} strokeWidth="1.5" />
        <text x="40" y="16" fill={isDark ? "#e0f2fe" : "#334155"} fontSize="8" fontWeight="black" textAnchor="middle">38'-0"</text>
      </svg>
    )
  },
  {
    id: "leg-05",
    category: "general",
    name: "Elevation Marker",
    code: "NBC Section 9.3",
    description: "Fitted arrows on floor plans that dictate the direction of exterior views (North, South, East, West) mapped to sheets.",
    svg: (isDark) => (
      <svg className="w-16 h-10 border border-slate-500/20 rounded bg-slate-500/5" viewBox="0 0 80 40">
        <polygon points="40,10 52,26 44,26 44,32 36,32 36,26 28,26" fill={isDark ? "#38bdf8" : "#0284c7"} stroke={isDark ? "#ffffff" : "#1e293b"} strokeWidth="1" />
        <text x="40" y="24" fill="#ffffff" fontSize="8" fontWeight="black" textAnchor="middle">N</text>
      </svg>
    )
  },

  // Category: Structural & Foundation
  {
    id: "leg-06",
    category: "structural",
    name: "Pad Footing",
    code: "NBC Section 9.15",
    description: "Dashed outer lines on the floor plan that outline deep concrete pads used to distribute massive isolated column/telepost point-loads into the bearing soil.",
    svg: (isDark) => (
      <svg className="w-16 h-10 border border-slate-500/20 rounded bg-slate-500/5" viewBox="0 0 80 40">
        <rect x="25" y="5" width="30" height="30" fill="none" stroke={isDark ? "#38bdf8" : "#0f172a"} strokeWidth="1.5" strokeDasharray="3 2" />
        <circle cx="40" cy="20" r="4" fill={isDark ? "#38bdf8" : "#0f172a"} />
      </svg>
    )
  },
  {
    id: "leg-07",
    category: "structural",
    name: "Continuous Footing",
    code: "NBC Section 9.15",
    description: "Parallel dashed lines indicating the continuous concrete strip footing poured under exterior structural masonry foundation walls.",
    svg: (isDark) => (
      <svg className="w-16 h-10 border border-slate-500/20 rounded bg-slate-500/5" viewBox="0 0 80 40">
        <line x1="10" y1="12" x2="70" y2="12" stroke={isDark ? "#cbd5e1" : "#475569"} strokeWidth="1.5" strokeDasharray="5 3" />
        <line x1="10" y1="28" x2="70" y2="28" stroke={isDark ? "#cbd5e1" : "#475569"} strokeWidth="1.5" strokeDasharray="5 3" />
        <line x1="10" y1="20" x2="70" y2="20" stroke={isDark ? "#38bdf8" : "#0f172a"} strokeWidth="3" />
      </svg>
    )
  },
  {
    id: "leg-08",
    category: "Roof Framing",
    name: "Birdsmouth Seat Cut",
    code: "NBC 9.23.14",
    description: "The horizontal cut of a birdsmouth must provide a minimum bearing area.",
    svg: (isDark) => (
      <svg className="w-16 h-10 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 rounded" viewBox="0 0 80 40">
        <path d="M 20 30 L 40 30 L 40 15" fill="none" stroke={isDark ? "#fcd34d" : "#f59e0b"} strokeWidth="3" />
      </svg>
    )
  },
  {
    id: "leg-08b",
    category: "Roof Framing",
    name: "Roof Pitch Indicator",
    code: "NBC 9.26.2",
    description: "Standard pitch triangle indicating the slope of the roof.",
    svg: (isDark) => (
      <svg className="w-16 h-10 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 rounded" viewBox="0 0 80 40">
        <polygon points="20,30 60,30 60,10" fill="none" stroke={isDark ? "#94a3b8" : "#64748b"} strokeWidth="2" />
        <text x="40" y="25" fill={isDark ? "#94a3b8" : "#64748b"} fontSize="8">4</text>
        <text x="65" y="22" fill={isDark ? "#94a3b8" : "#64748b"} fontSize="8">12</text>
      </svg>
    )
  },
  {
    id: "leg-08c",
    category: "structural",
    name: "Foundation Wall",
    code: "NBC Section 9.15",
    description: "Thick, solid, continuous outlines indicating vertical concrete walls designed to resist lateral soil pressure and support vertical structural floor framing load-bearing weights.",
    svg: (isDark) => (
      <svg className="w-16 h-10 border border-slate-500/20 rounded bg-slate-500/5" viewBox="0 0 80 40">
        <rect x="10" y="12" width="60" height="16" fill={isDark ? "#1e293b" : "#e2e8f0"} stroke={isDark ? "#ffffff" : "#0f172a"} strokeWidth="3.5" />
        <text x="40" y="23" fill={isDark ? "#ffffff" : "#0f172a"} fontSize="8" fontWeight="bold" textAnchor="middle">CONC.</text>
      </svg>
    )
  },
  {
    id: "leg-09",
    category: "structural",
    name: "Built-up Timber Beam",
    code: "NBC Section 9.23.10",
    description: "A heavy beam laminated together on site (usually 3 or 4 plies of 2x10 lumber) to act as a master center bearing line for joist spans.",
    svg: (isDark) => (
      <svg className="w-16 h-10 border border-slate-500/20 rounded bg-slate-500/5" viewBox="0 0 80 40">
        <line x1="5" y1="20" x2="75" y2="20" stroke="#f43f5e" strokeWidth="6" />
        <line x1="5" y1="18" x2="75" y2="18" stroke="#ffffff" strokeWidth="1" strokeDasharray="2 1" />
        <line x1="5" y1="22" x2="75" y2="22" stroke="#ffffff" strokeWidth="1" strokeDasharray="2 1" />
      </svg>
    )
  },
  {
    id: "leg-10",
    category: "structural",
    name: "Telepost",
    code: "NBC Section 9.15",
    description: "An adjustable hollow steel column with standard threaded jack collars, supporting main beams and bearing on concrete pad footings.",
    svg: (isDark) => (
      <svg className="w-16 h-10 border border-slate-500/20 rounded bg-slate-500/5" viewBox="0 0 80 40">
        <circle cx="40" cy="20" r="10" fill="none" stroke={isDark ? "#38bdf8" : "#0f172a"} strokeWidth="1.5" />
        <line x1="40" y1="5" x2="40" y2="35" stroke={isDark ? "#38bdf8" : "#0f172a"} strokeWidth="1" />
        <line x1="25" y1="20" x2="55" y2="20" stroke={isDark ? "#38bdf8" : "#0f172a"} strokeWidth="1" />
      </svg>
    )
  },

  // Category: Exterior & Elevation
  {
    id: "leg-11",
    category: "elevation",
    name: "Finished Grade Line",
    code: "NBC Section 9.15.4",
    description: "Represented as a thick dark solid line indicating final ground leveling. Standard code mandates a minimum of 150mm (6\") foundation clearance between the grade line and any siding/wood.",
    svg: (isDark) => (
      <svg className="w-16 h-10 border border-slate-500/20 rounded bg-slate-500/5" viewBox="0 0 80 40">
        <line x1="5" y1="28" x2="75" y2="28" stroke={isDark ? "#ffffff" : "#0f172a"} strokeWidth="4" />
        <line x1="15" y1="28" x2="5" y2="38" stroke={isDark ? "#64748b" : "#94a3b8"} strokeWidth="1.5" />
        <line x1="35" y1="28" x2="25" y2="38" stroke={isDark ? "#64748b" : "#94a3b8"} strokeWidth="1.5" />
        <line x1="55" y1="28" x2="45" y2="38" stroke={isDark ? "#64748b" : "#94a3b8"} strokeWidth="1.5" />
        <line x1="75" y1="28" x2="65" y2="38" stroke={isDark ? "#64748b" : "#94a3b8"} strokeWidth="1.5" />
      </svg>
    )
  },
  {
    id: "leg-12",
    category: "elevation",
    name: "Roof Pitch / Slope",
    code: "NBC Section 9.26",
    description: "A right triangle showing slope coordinates: Rise over Run. Run is standardized to 12. Important for truss fabrication, structural spans, and underlayment selection.",
    svg: (isDark) => (
      <svg className="w-16 h-10 border border-slate-500/20 rounded bg-slate-500/5" viewBox="0 0 80 40">
        <polygon points="20,28 55,28 55,10" fill="none" stroke={isDark ? "#38bdf8" : "#0284c7"} strokeWidth="2" />
        <text x="37" y="37" fill={isDark ? "#cbd5e1" : "#475569"} fontSize="8" fontWeight="bold" textAnchor="middle">12 (Run)</text>
        <text x="61" y="21" fill={isDark ? "#cbd5e1" : "#475569"} fontSize="8" fontWeight="bold">5 (Rise)</text>
      </svg>
    )
  },
  {
    id: "leg-13",
    category: "elevation",
    name: "Height Datum Marker",
    code: "NBC Section 9.4",
    description: "A target crosshair on elevation sheets that indexes specific vertical heights, such as Top of Wall Plate (T.O. Wall) or Subfloor heights.",
    svg: (isDark) => (
      <svg className="w-16 h-10 border border-slate-500/20 rounded bg-slate-500/5" viewBox="0 0 80 40">
        <line x1="10" y1="20" x2="40" y2="20" stroke={isDark ? "#64748b" : "#475569"} strokeWidth="1" strokeDasharray="3 2" />
        <circle cx="45" cy="20" r="10" fill="none" stroke={isDark ? "#38bdf8" : "#0284c7"} strokeWidth="2" />
        <path d="M 33 20 L 57 20 M 45 8 L 45 32" stroke={isDark ? "#cbd5e1" : "#0f172a"} strokeWidth="1" />
      </svg>
    )
  },

  // Category: Electrical & Wiring
  {
    id: "leg-14",
    category: "electrical",
    name: "GFCI Outlet",
    code: "CEC Rule 26-700",
    description: "Ground Fault Circuit Interrupter receptacle. Shuts off electricity instantly on ground leakage to prevent fatal shocks. CEC requires GFCI within 1.5m (5 feet) of sinks, bathtubs, or showers.",
    svg: (isDark) => (
      <svg className="w-16 h-10 border border-slate-500/20 rounded bg-slate-500/5" viewBox="0 0 80 40">
        <circle cx="25" cy="20" r="10" fill="none" stroke={isDark ? "#10b981" : "#059669"} strokeWidth="2.5" />
        <line x1="18" y1="10" x2="18" y2="30" stroke={isDark ? "#ffffff" : "#0f172a"} strokeWidth="2" />
        <line x1="32" y1="10" x2="32" y2="30" stroke={isDark ? "#ffffff" : "#0f172a"} strokeWidth="2" />
        <text x="44" y="24" fill={isDark ? "#10b981" : "#059669"} fontSize="8" fontWeight="black">GFCI</text>
      </svg>
    )
  },
  {
    id: "leg-15",
    category: "electrical",
    name: "Switch & Wiring Loop",
    code: "CEC Rule 30-500",
    description: "Dashed curves indicating low-voltage switch wiring connection paths from the light switches (e.g., 3-way switch marked $3) to ceiling outlet boxes (marked R).",
    svg: (isDark) => (
      <svg className="w-16 h-10 border border-slate-500/20 rounded bg-slate-500/5" viewBox="0 0 80 40">
        <text x="15" y="23" fill={isDark ? "#38bdf8" : "#0284c7"} fontSize="16" fontWeight="bold">$</text>
        <text x="25" y="26" fill={isDark ? "#38bdf8" : "#0284c7"} fontSize="9" fontWeight="bold">3</text>
        <path d="M 28 18 Q 45 5 60 16" fill="none" stroke={isDark ? "#cbd5e1" : "#475569"} strokeWidth="2" strokeDasharray="3 2" />
        <circle cx="65" cy="20" r="8" fill="none" stroke={isDark ? "#38bdf8" : "#0284c7"} strokeWidth="2" />
        <text x="65" y="23" fill={isDark ? "#ffffff" : "#0f172a"} fontSize="8" fontWeight="black" textAnchor="middle">R</text>
      </svg>
    )
  },
  {
    id: "leg-16",
    category: "electrical",
    name: "Standard Receptacle",
    code: "CEC Rule 26-702",
    description: "Standard duplex wall outlet symbol representing 120V electrical power sockets. Maximum spaced 3.6 meters apart on finished walls.",
    svg: (isDark) => (
      <svg className="w-16 h-10 border border-slate-500/20 rounded bg-slate-500/5" viewBox="0 0 80 40">
        <circle cx="40" cy="20" r="10" fill="none" stroke={isDark ? "#cbd5e1" : "#475569"} strokeWidth="2" />
        <line x1="33" y1="10" x2="33" y2="30" stroke={isDark ? "#cbd5e1" : "#475569"} strokeWidth="2" />
        <line x1="47" y1="10" x2="47" y2="30" stroke={isDark ? "#cbd5e1" : "#475569"} strokeWidth="2" />
      </svg>
    )
  },
  {
    id: "leg-17",
    category: "electrical",
    name: "Electrical Panel",
    code: "CEC Rule 6-200",
    description: "Shows the central 200-Amp home breaker service box. CEC mandates location must be accessible, have 1m clean working clearance, and can never be in closets/bathrooms.",
    svg: (isDark) => (
      <svg className="w-16 h-10 border border-slate-500/20 rounded bg-slate-500/5" viewBox="0 0 80 40">
        <rect x="35" y="5" width="10" height="30" fill={isDark ? "#10b981" : "#0f172a"} stroke={isDark ? "#ffffff" : "#1e293b"} strokeWidth="1.5" />
      </svg>
    )
  },
  {
    id: "leg-18",
    category: "general",
    name: "Dimension Strings",
    code: "NBC Section 9.3",
    description: "Architectural dimension strings establishing overall building dimensions, major partitions, and window/door rough openings (R.O.).",
    svg: (isDark) => (
      <svg className="w-16 h-10 border border-slate-500/20 rounded bg-slate-500/5" viewBox="0 0 80 40">
        <line x1="5" y1="20" x2="75" y2="20" stroke={isDark ? "#cbd5e1" : "#475569"} strokeWidth="1" />
        <line x1="15" y1="20" x2="15" y2="30" stroke={isDark ? "#cbd5e1" : "#475569"} strokeWidth="1" />
        <line x1="45" y1="20" x2="45" y2="30" stroke={isDark ? "#cbd5e1" : "#475569"} strokeWidth="1" />
        <text x="30" y="15" fill={isDark ? "#38bdf8" : "#0284c7"} fontSize="6" fontWeight="bold" textAnchor="middle">15'-0" R.O.</text>
        <path d="M 12 23 L 18 17 M 42 23 L 48 17" stroke="#ef4444" strokeWidth="1.5" />
      </svg>
    )
  },
  {
    id: "leg-19",
    category: "structural",
    name: "Wet Wall Chase",
    code: "NBC Section 9.23.5.3",
    description: "A thickened wall framing assembly (typically 2x6 or greater) designed to house a 3\" ABS soil stack and pipe penetrations without breaching structural stud integrity.",
    svg: (isDark) => (
      <svg className="w-16 h-10 border border-slate-500/20 rounded bg-slate-500/5" viewBox="0 0 80 40">
        <rect x="25" y="10" width="30" height="20" fill="none" stroke={isDark ? "#4ade80" : "#16a34a"} strokeWidth="1.5" />
        <circle cx="40" cy="20" r="5" fill="none" stroke="#ef4444" strokeWidth="1.5" />
        <text x="40" y="23" fill="#ef4444" fontSize="8" fontWeight="bold" textAnchor="middle">3"</text>
      </svg>
    )
  },
  {
    id: "leg-20",
    category: "structural",
    name: "Lintel Headers",
    code: "NBC Section 9.23.10.6",
    description: "Built-up SPF timber headers or engineered LVLs spanned over openings, bearing directly on trimmers to transfer gravity structural loads.",
    svg: (isDark) => (
      <svg className="w-16 h-10 border border-slate-500/20 rounded bg-slate-500/5" viewBox="0 0 80 40">
        <rect x="15" y="12" width="50" height="16" fill="rgba(245,158,11,0.1)" stroke="#f59e0b" strokeWidth="1.5" />
        <line x1="15" y1="20" x2="65" y2="20" stroke="#f59e0b" strokeWidth="1" />
        <text x="40" y="22" fill={isDark ? "#ffffff" : "#0f172a"} fontSize="7" fontWeight="bold" textAnchor="middle">LINTEL</text>
      </svg>
    )
  },
  {
    id: "leg-21",
    category: "structural",
    name: "Weeping Tile Drainage",
    code: "NBC Section 9.14.3.1",
    description: "Perforated subterranean drainage piping covered in filter socks and washed clear gravel, providing pressure relief along footing bases.",
    svg: (isDark) => (
      <svg className="w-16 h-10 border border-slate-500/20 rounded bg-slate-500/5" viewBox="0 0 80 40">
        <circle cx="40" cy="20" r="8" fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="3 2" />
        <circle cx="40" cy="20" r="5" fill="none" stroke="#3b82f6" strokeWidth="1" />
        <path d="M 20 20 L 32 20 M 48 20 L 60 20" stroke="#3b82f6" strokeWidth="1" />
      </svg>
    )
  },
  {
    id: "leg-22",
    category: "structural",
    name: "Step Footings",
    code: "NBC Section 9.15.3.9",
    description: "Concrete footings transitioning gradually on grades with limits of 600mm maximum vertical rise to 600mm minimum horizontal run.",
    svg: (isDark) => (
      <svg className="w-16 h-10 border border-slate-500/20 rounded bg-slate-500/5" viewBox="0 0 80 40">
        <path d="M 10 30 L 35 30 L 35 15 L 70 15" fill="none" stroke={isDark ? "#cbd5e1" : "#475569"} strokeWidth="2" />
        <path d="M 10 35 L 40 35 L 40 20 L 70 20" fill="none" stroke={isDark ? "#38bdf8" : "#0284c7"} strokeWidth="1.5" strokeDasharray="3 2" />
      </svg>
    )
  },
  {
    id: "leg-23",
    category: "structural",
    name: "Telepost Pads",
    code: "NBC Section 9.15",
    description: "Sized isolated concrete footing pads engineered to support telepost point loads based on local soil bearing capacity.",
    svg: (isDark) => (
      <svg className="w-16 h-10 border border-slate-500/20 rounded bg-slate-500/5" viewBox="0 0 80 40">
        <rect x="25" y="5" width="30" height="30" fill="none" stroke={isDark ? "#38bdf8" : "#0284c7"} strokeWidth="1" strokeDasharray="3 2" />
        <rect x="33" y="13" width="14" height="14" fill="none" stroke={isDark ? "#ffffff" : "#0f172a"} strokeWidth="1.5" />
        <circle cx="40" cy="20" r="3" fill="#ef4444" />
      </svg>
    )
  },
  {
    id: "leg-24",
    category: "elevation",
    name: "Height Datums",
    code: "NBC Section 9.8 / Zoning",
    description: "Elevation benchmarks ensuring precise vertical control, protecting headroom heights and meeting zoning limitations.",
    svg: (isDark) => (
      <svg className="w-16 h-10 border border-slate-500/20 rounded bg-slate-500/5" viewBox="0 0 80 40">
        <circle cx="40" cy="20" r="8" fill="none" stroke={isDark ? "#fbbf24" : "#d97706"} strokeWidth="1.5" />
        <line x1="28" y1="20" x2="52" y2="20" stroke={isDark ? "#fbbf24" : "#d97706"} strokeWidth="1" />
        <line x1="40" y1="8" x2="40" y2="32" stroke={isDark ? "#fbbf24" : "#d97706"} strokeWidth="1" />
        <path d="M 40 20 L 48 20 A 8 8 0 0 0 40 12 Z" fill={isDark ? "#fbbf24" : "#d97706"} />
        <path d="M 40 20 L 32 20 A 8 8 0 0 0 40 28 Z" fill={isDark ? "#fbbf24" : "#d97706"} />
      </svg>
    )
  },
  {
    id: "leg-25",
    category: "elevation",
    name: "Rain Screen Cladding",
    code: "NBC Section 9.27.2.4",
    description: "Vented cavity framing overlay of at least 10mm thickness, acting as capillary break for envelope moisture control.",
    svg: (isDark) => (
      <svg className="w-16 h-10 border border-slate-500/20 rounded bg-slate-500/5" viewBox="0 0 80 40">
        <rect x="20" y="8" width="8" height="24" fill="#64748b" />
        <rect x="32" y="8" width="4" height="24" fill="#3b82f6" />
        <rect x="40" y="8" width="6" height="24" fill="#94a3b8" />
        <rect x="50" y="8" width="10" height="24" fill="#e2e8f0" stroke="#94a3b8" />
      </svg>
    )
  },
  {
    id: "leg-26",
    category: "electrical",
    name: "CEC Working Clearance",
    code: "CEC Rule 2-308",
    description: "Safety working clearance zones around electrical panels mandating a minimum of 1-meter unobstructed front clearance.",
    svg: (isDark) => (
      <svg className="w-16 h-10 border border-slate-500/20 rounded bg-slate-500/5" viewBox="0 0 80 40">
        <rect x="15" y="10" width="10" height="20" fill={isDark ? "#ef4444" : "#dc2626"} />
        <rect x="25" y="5" width="40" height="30" fill="rgba(239,68,68,0.1)" stroke="#ef4444" strokeWidth="1" strokeDasharray="3 2" />
        <text x="45" y="23" fill="#ef4444" fontSize="7" fontWeight="black" textAnchor="middle">1m Clearance</text>
      </svg>
    )
  },
  {
    id: "leg-27",
    category: "electrical",
    name: "Interconnected Smoke Alarms",
    code: "NBC Section 9.10.19",
    description: "Hardwired alarm systems connected across unswitched lighting runs, triggering synchronized smoke and carbon monoxide warnings.",
    svg: (isDark) => (
      <svg className="w-16 h-10 border border-slate-500/20 rounded bg-slate-500/5" viewBox="0 0 80 40">
        <circle cx="25" cy="20" r="7" fill="none" stroke="#ef4444" strokeWidth="1.5" />
        <circle cx="55" cy="20" r="7" fill="none" stroke="#ef4444" strokeWidth="1.5" />
        <line x1="32" y1="20" x2="48" y2="20" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="2 2" />
        <text x="25" y="22" fill="#ef4444" fontSize="6" fontWeight="bold" textAnchor="middle">S/CO</text>
        <text x="55" y="22" fill="#ef4444" fontSize="6" fontWeight="bold" textAnchor="middle">S/CO</text>
      </svg>
    )
  },
  {
    id: "leg-28",
    category: "general",
    name: "Dimension Hierarchy",
    code: "NBC Section 9.3",
    description: "Multi-string dimension systems establishing overall sizes, structural breaks/jogs, and precise opening centerlines.",
    svg: (isDark) => (
      <svg className="w-16 h-10 border border-slate-500/20 rounded bg-slate-500/5" viewBox="0 0 80 40">
        <line x1="5" y1="10" x2="75" y2="10" stroke="#3b82f6" strokeWidth="2.5" />
        <line x1="5" y1="20" x2="75" y2="20" stroke={isDark ? "#ffffff" : "#0f172a"} strokeWidth="1.5" />
        <line x1="5" y1="30" x2="75" y2="30" stroke="#eab308" strokeWidth="1" />
        <path d="M 8 7 L 12 13 M 70 7 L 74 13 M 8 17 L 12 23 M 70 17 L 74 23 M 8 27 L 12 33 M 70 27 L 74 33" stroke="#ef4444" strokeWidth="1" />
      </svg>
    )
  },
  {
    id: "leg-29",
    category: "structural",
    name: "Joist Span Arrow",
    code: "NBC Section 9.23.9.2",
    description: "Indicates the installation direction and span length of floor joists across bearing supports.",
    svg: (isDark) => (
      <svg className="w-16 h-10 border border-slate-500/20 rounded bg-slate-500/5" viewBox="0 0 80 40">
        <path d="M 10 20 L 70 20 M 20 10 L 10 20 L 20 30 M 60 10 L 70 20 L 60 30" fill="none" stroke="#22c55e" strokeWidth="2.5" />
      </svg>
    )
  },
  {
    id: "leg-30",
    category: "structural",
    name: "Midspan Blocking",
    code: "NBC Section 9.23.9.4",
    description: "Solid blocking or bridging lines run perpendicular to joists to stabilize framing and prevent rotation.",
    svg: (isDark) => (
      <svg className="w-16 h-10 border border-slate-500/20 rounded bg-slate-500/5" viewBox="0 0 80 40">
        <line x1="5" y1="20" x2="75" y2="20" stroke="#f43f5e" strokeWidth="2" strokeDasharray="3 3" />
        <rect x="25" y="10" width="10" height="20" fill="none" stroke={isDark ? "#ffffff" : "#0f172a"} strokeWidth="1.5" />
        <rect x="45" y="10" width="10" height="20" fill="none" stroke={isDark ? "#ffffff" : "#0f172a"} strokeWidth="1.5" />
      </svg>
    )
  },
  {
    id: "leg-31",
    category: "elevation",
    name: "Envelope Assembly Layers",
    code: "NBC Section 9.27",
    description: "Siding, sheathing membrane (Tyvek), 10mm (3/8\") strapping, and sheathing. Proper overlapping of sheathing membrane is critical to shed water, while a rain-screen capillary break (NBC 9.27.2.4) allows drainage and moisture vapor escape, protecting wood framing.",
    svg: (isDark) => (
      <svg className="w-16 h-10 border border-slate-500/20 rounded bg-slate-500/5" viewBox="0 0 80 40">
        <rect x="15" y="5" width="8" height="30" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
        <rect x="25" y="5" width="4" height="30" fill="#38bdf8" />
        <rect x="31" y="5" width="6" height="30" fill="#b45309" opacity="0.8" />
        <path d="M 42 5 L 48 15 L 42 15 Z M 42 15 L 48 25 L 42 25 Z" fill="none" stroke={isDark ? "#ffffff" : "#0f172a"} strokeWidth="1" />
      </svg>
    )
  },
  {
    id: "leg-32",
    category: "elevation",
    name: "Attic Ventilation Baffles",
    code: "NBC Section 9.19.1.1",
    description: "Continuous insulation wind baffles maintain a clear 1/300 net-free ventilation ratio (NBC 9.19.1.1) between vented soffits and attic space, preventing insulation from obstructing continuous eave airflow and preventing ice dams.",
    svg: (isDark) => (
      <svg className="w-16 h-10 border border-slate-500/20 rounded bg-slate-500/5" viewBox="0 0 80 40">
        <path d="M 15 30 Q 30 15, 65 15" fill="none" stroke="#22c55e" strokeWidth="2.5" />
        <circle cx="20" cy="15" r="5" fill="#f59e0b" opacity="0.3" />
        <circle cx="50" cy="25" r="7" fill="#f59e0b" opacity="0.3" />
      </svg>
    )
  },
  {
    id: "leg-33",
    category: "elevation",
    name: "Foundation Sill Gasket",
    code: "NBC Section 9.23.1.1",
    description: "Foam capillary break and sealant between wood plate and basement concrete foundation, preventing ground dampness from wicking upward and sealing structural framing drafts.",
    svg: (isDark) => (
      <svg className="w-16 h-10 border border-slate-500/20 rounded bg-slate-500/5" viewBox="0 0 80 40">
        <rect x="15" y="24" width="50" height="12" fill="rgba(148,163,184,0.15)" stroke={isDark ? "#ffffff" : "#0f172a"} strokeWidth="1" />
        <line x1="15" y1="24" x2="65" y2="24" stroke="#ec4899" strokeWidth="3" />
        <rect x="25" y="10" width="30" height="14" fill="none" stroke={isDark ? "#ffffff" : "#0f172a"} strokeWidth="1" />
      </svg>
    )
  },
  {
    id: "leg-34",
    category: "elevation",
    name: "Sill Plate Anchor Bolts",
    code: "NBC Section 9.23.6.1",
    description: "Heavy 1/2\" steel J-bolts securing wood sill plates every 2.4m O.C. into concrete under NBC 9.23.6.1, locking wood framing against lateral shifts, wind shear, and seismic uplift.",
    svg: (isDark) => (
      <svg className="w-16 h-10 border border-slate-500/20 rounded bg-slate-500/5" viewBox="0 0 80 40">
        <rect x="15" y="15" width="50" height="10" fill="none" stroke={isDark ? "#ffffff" : "#0f172a"} strokeWidth="1" />
        <line x1="35" y1="8" x2="35" y2="35" stroke="#94a3b8" strokeWidth="2" />
        <line x1="35" y1="35" x2="45" y2="35" stroke="#94a3b8" strokeWidth="2" />
        <rect x="31" y="5" width="8" height="3" fill="#64748b" />
      </svg>
    )
  },
  {
    id: "leg-101",
    category: "structural",
    name: "Rough Opening (R.O.)",
    code: "NBC Section 9.23.12",
    description: "Indicates the framed opening required to accommodate a window or door. R.O. must include tolerance gaps.",
    svg: (isDark) => (
      <svg className="w-16 h-10 border border-slate-500/20 rounded bg-slate-500/5" viewBox="0 0 60 40">
        <rect x="10" y="5" width="40" height="30" fill="none" stroke="#eab308" strokeWidth="2" strokeDasharray="4,2" />
        <text x="30" y="24" fill="#eab308" fontSize="12" fontWeight="bold" textAnchor="middle">R.O.</text>
      </svg>
    )
  },
  {
    id: "leg-102",
    category: "structural",
    name: "Stair Rise/Run",
    code: "NBC Section 9.8.4",
    description: "Specifies the total vertical rise and horizontal run of a staircase to ensure safe passage.",
    svg: (isDark) => (
      <svg className="w-16 h-10 border border-slate-500/20 rounded bg-slate-500/5" viewBox="0 0 60 40">
        <path d="M10,35 L25,35 L25,20 L40,20 L40,5 L55,5" fill="none" stroke={isDark ? '#fff' : '#0f172a'} strokeWidth="2" />
      </svg>
    )
  },
  {
    id: "leg-103",
    category: "structural",
    name: "Rebar Spacing",
    code: "NBC Section 9.15",
    description: "Reinforcing steel (e.g., 15M) spacing in foundation walls to resist lateral soil pressure.",
    svg: (isDark) => (
      <svg className="w-16 h-10 border border-slate-500/20 rounded bg-slate-500/5" viewBox="0 0 60 40">
        <line x1="10" y1="20" x2="50" y2="20" stroke="#38bdf8" strokeWidth="3" />
        <circle cx="20" cy="20" r="4" fill="#ef4444" />
        <circle cx="40" cy="20" r="4" fill="#ef4444" />
      </svg>
    )
  },
  {
    id: "leg-104",
    category: "general",
    name: "Damp-proofing",
    code: "NBC Section 9.13",
    description: "Bituminous coating or drainage layer on exterior foundation walls to prevent soil moisture ingress.",
    svg: (isDark) => (
      <svg className="w-16 h-10 border border-slate-500/20 rounded bg-slate-500/5" viewBox="0 0 60 40">
        <rect x="25" y="5" width="10" height="30" fill={isDark ? '#334155' : '#cbd5e1'} />
        <line x1="10" y1="20" x2="25" y2="20" stroke="#ef4444" strokeWidth="2" />
        <polygon points="25,20 20,17 20,23" fill="#ef4444" />
      </svg>
    )
  },
  {
    id: "leg-105",
    category: "envelope",
    name: "6-mil Poly Vapour Barrier",
    code: "NBC Section 9.25.4",
    description: "Vapour barrier on the warm-in-winter side of the building envelope to prevent moisture diffusion.",
    svg: (isDark) => (
      <svg className="w-16 h-10 border border-slate-500/20 rounded bg-slate-500/5" viewBox="0 0 60 40">
        <line x1="10" y1="20" x2="50" y2="20" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,2" />
      </svg>
    )
  },
  {
    id: "leg-106",
    category: "envelope",
    name: "OSB Nailing Pattern",
    code: "NBC Section 9.23.3.5",
    description: "Standard wall sheathing nailing: 150mm on edges, 300mm in the field.",
    svg: (isDark) => (
      <svg className="w-16 h-10 border border-slate-500/20 rounded bg-slate-500/5" viewBox="0 0 60 40">
        <circle cx="20" cy="20" r="2" fill={isDark ? '#fff' : '#0f172a'} />
        <circle cx="30" cy="20" r="2" fill={isDark ? '#fff' : '#0f172a'} />
        <circle cx="40" cy="20" r="2" fill={isDark ? '#fff' : '#0f172a'} />
      </svg>
    )
  },
  {
    id: "leg-107",
    category: "plumbing",
    name: "Joist Penetration",
    code: "NBC Section 9.23.5.1",
    description: "Holes drilled in framing members cannot exceed 1/4 the depth of the member.",
    svg: (isDark) => (
      <svg className="w-16 h-10 border border-slate-500/20 rounded bg-slate-500/5" viewBox="0 0 60 40">
        <rect x="10" y="15" width="40" height="10" fill="none" stroke={isDark ? '#fff' : '#0f172a'} strokeWidth="1" />
        <circle cx="30" cy="20" r="4" fill="none" stroke="#38bdf8" strokeWidth="1" />
      </svg>
    )
  },
  {
    id: "leg-108",
    category: "structural",
    name: "Cross-Bridging",
    code: "NBC Section 9.23.9.4",
    description: "Lateral support for joists exceeding 2.1m spans to prevent twisting.",
    svg: (isDark) => (
      <svg className="w-16 h-10 border border-slate-500/20 rounded bg-slate-500/5" viewBox="0 0 60 40">
        <line x1="25" y1="10" x2="35" y2="30" stroke="#f59e0b" strokeWidth="2" />
        <line x1="35" y1="10" x2="25" y2="30" stroke="#f59e0b" strokeWidth="2" />
      </svg>
    )
  },
  {
    id: "leg-109",
    category: "Site & Survey",
    name: "Frost Line",
    code: "NBC 9.12.2",
    description: "Indicates the depth of frost penetration for the region.",
    svg: (isDark) => (
      <svg className="w-16 h-10 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 rounded" viewBox="0 0 80 40">
        <line x1="10" y1="20" x2="70" y2="20" stroke={isDark ? "#94a3b8" : "#64748b"} strokeWidth="2" strokeDasharray="4 4" />
      </svg>
    )
  },
  {
    id: "leg-109b",
    name: "Batter Boards",
    code: "Excavation",
    description: "Used to establish building lines with string and the 3-4-5 squaring method.",
    svg: (isDark) => (
      <svg className="w-16 h-10 border border-slate-500/20 rounded bg-slate-500/5" viewBox="0 0 60 40">
        <rect x="15" y="15" width="30" height="5" fill="#10b981" />
        <line x1="30" y1="15" x2="30" y2="35" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="2,2" />
      </svg>
    )
  },
  {
    id: "leg-110",
    category: "Site & Survey",
    name: "Building Setback",
    code: "NBC Part 9",
    description: "Required minimum distance between the property line and building footprint.",
    svg: (isDark) => (
      <svg className="w-16 h-10 border border-slate-500/20 rounded bg-slate-500/5" viewBox="0 0 60 40">
        <line x1="10" y1="20" x2="50" y2="20" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4,2" />
      </svg>
    )
  },
  {
    id: "leg-111",
    category: "Site & Survey",
    name: "Benchmark Elevation",
    code: "Survey",
    description: "Fixed reference point for vertical control.",
    svg: (isDark) => (
      <svg className="w-16 h-10 border border-slate-500/20 rounded bg-slate-500/5" viewBox="0 0 60 40">
        <circle cx="30" cy="20" r="10" fill="none" stroke="#2563eb" strokeWidth="2" />
        <polygon points="30,20 40,20 30,30" fill="#2563eb" />
        <polygon points="30,20 20,20 30,10" fill="#2563eb" />
      </svg>
    )
  },
  {
    id: "leg-112",
    category: "Roof Framing",
    name: "Ridge Board",
    code: "NBC 9.23.14.8",
    description: "Horizontal structural member at peak of roof. Must be one size larger than rafters.",
    svg: (isDark) => (
      <svg className="w-16 h-10 border border-slate-500/20 rounded bg-slate-500/5" viewBox="0 0 60 40">
        <rect x="15" y="15" width="30" height="6" fill="#ef4444" />
      </svg>
    )
  },
  {
    id: "leg-113",
    category: "Roof Framing",
    name: "Collar Ties",
    code: "NBC 9.23.14.10",
    description: "Horizontal lumber in upper third of attic. Prevents rafters from separating.",
    svg: (isDark) => (
      <svg className="w-16 h-10 border border-slate-500/20 rounded bg-slate-500/5" viewBox="0 0 60 40">
        <line x1="10" y1="20" x2="50" y2="20" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4,2" />
      </svg>
    )
  },
  {
    id: "leg-114",
    category: "Roof Framing",
    name: "Birdsmouth Cut",
    code: "NBC Part 9",
    description: "Structural notch in bottom of a rafter providing flat bearing surface.",
    svg: (isDark) => (
      <svg className="w-16 h-10 border border-slate-500/20 rounded bg-slate-500/5" viewBox="0 0 60 40">
        <path d="M 20 30 L 30 20 L 40 20" fill="none" stroke="#10b981" strokeWidth="2" />
      </svg>
    )
  },
  {
    id: "leg-115",
    category: "Exterior Envelope",
    name: "Step Flashing",
    code: "NBC 9.26.4",
    description: "Flashing where roof intersects a wall, installed step-by-step with shingles.",
    svg: (isDark) => (
      <svg className="w-16 h-10 border border-slate-500/20 rounded bg-slate-500/5" viewBox="0 0 60 40">
        <path d="M 20 20 L 30 20 L 30 10" fill="none" stroke="#ef4444" strokeWidth="2" />
      </svg>
    )
  },
  {
    id: "leg-116",
    category: "Exterior Envelope",
    name: "Finished Grade Clearance",
    code: "NBC 9.27.2.4",
    description: "Min 200mm clearance from untreated wood cladding to finished ground level.",
    svg: (isDark) => (
      <svg className="w-16 h-10 border border-slate-500/20 rounded bg-slate-500/5" viewBox="0 0 60 40">
        <line x1="20" y1="20" x2="20" y2="35" stroke="#f59e0b" strokeWidth="2" />
        <polygon points="20,20 15,25 25,25" fill="#f59e0b" />
        <polygon points="20,35 15,30 25,30" fill="#f59e0b" />
      </svg>
    )
  },
  {
    id: "leg-117",
    category: "Exterior Envelope",
    name: "Window Drip Cap",
    code: "NBC 9.27.3.8",
    description: "Head flashing over window/door openings to shed water outwards.",
    svg: (isDark) => (
      <svg className="w-16 h-10 border border-slate-500/20 rounded bg-slate-500/5" viewBox="0 0 60 40">
        <rect x="15" y="15" width="30" height="4" fill="#3b82f6" />
      </svg>
    )
  },
  {
    id: "leg-118",
    category: "Stairs",
    name: "Headroom Clearance",
    code: "NBC 9.8.2",
    description: "Min clear headroom of 1950mm measured vertically from outer edge of nosing.",
    svg: (isDark) => (
      <svg className="w-16 h-10 border border-slate-500/20 rounded bg-slate-500/5" viewBox="0 0 60 40">
        <line x1="30" y1="10" x2="30" y2="30" stroke="#ef4444" strokeWidth="2" strokeDasharray="2,2" />
      </svg>
    )
  },
  {
    id: "leg-09a",
    category: "Stairs",
    name: "Stringer Header Connection",
    code: "NBC 9.8.9",
    description: "Top connections require approved framing anchors or ledger board.",
    svg: (isDark) => (
      <svg className="w-16 h-10 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 rounded" viewBox="0 0 80 40">
        <circle cx="40" cy="20" r="8" fill="none" stroke={isDark ? "#fb923c" : "#f97316"} strokeWidth="2" strokeDasharray="2,2" />
      </svg>
    )
  },
  {
    id: "leg-09b",
    category: "Stairs",
    name: "Stringer Effective Depth",
    code: "NBC 9.8.9",
    description: "Minimum 90mm solid lumber from throat to bottom edge.",
    svg: (isDark) => (
      <svg className="w-16 h-10 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 rounded" viewBox="0 0 80 40">
        <line x1="20" y1="20" x2="60" y2="20" stroke={isDark ? "#fcd34d" : "#f59e0b"} strokeWidth="3" />
        <polygon points="20,20 25,15 25,25" fill={isDark ? "#fcd34d" : "#f59e0b"} />
        <polygon points="60,20 55,15 55,25" fill={isDark ? "#fcd34d" : "#f59e0b"} />
      </svg>
    )
  },
  {
    id: "leg-09c",
    category: "Stairs",
    name: "Stair Uniformity Tolerances",
    code: "NBC 9.8.4",
    description: "Max 5mm variation between adjacent risers/treads.",
    svg: (isDark) => (
      <svg className="w-16 h-10 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 rounded" viewBox="0 0 80 40">
        <path d="M 25 30 L 25 15 L 55 15" fill="none" stroke={isDark ? "#34d399" : "#10b981"} strokeWidth="2" />
        <line x1="25" y1="15" x2="40" y2="30" stroke={isDark ? "#34d399" : "#10b981"} strokeWidth="1" strokeDasharray="2,2" />
      </svg>
    )
  },
  {
    id: "leg-121",
    category: "structural",
    name: "Load Bearing Wall",
    code: "NBC Part 9",
    description: "Studs in load-bearing walls must be spaced no more than 16\" O.C. if supporting a floor and roof, requiring double top plates.",
    svg: (isDark) => (
      <svg className="w-16 h-10 border border-slate-500/20 rounded bg-slate-500/5" viewBox="0 0 60 40">
        <rect x="25" y="10" width="10" height="20" fill="url(#hatch)" stroke="#f59e0b" strokeWidth="2" />
      </svg>
    )
  },
  {
    id: "leg-122",
    category: "structural",
    name: "Anchor Bolts",
    code: "NBC 9.23.6.1",
    description: "Min 12.7mm (1/2\") diameter anchor bolts spaced no more than 2.4m apart, with 100mm min embedment.",
    svg: (isDark) => (
      <svg className="w-16 h-10 border border-slate-500/20 rounded bg-slate-500/5" viewBox="0 0 60 40">
        <line x1="30" y1="10" x2="30" y2="30" stroke="#f59e0b" strokeWidth="3" />
        <line x1="25" y1="30" x2="35" y2="30" stroke="#f59e0b" strokeWidth="3" />
      </svg>
    )
  },
  {
    id: "leg-123",
    category: "envelope",
    name: "Base Flashing",
    code: "NBC Part 9",
    description: "Flashing installed at the base of the wall system to direct moisture outward, with weepholes max 800mm.",
    svg: (isDark) => (
      <svg className="w-16 h-10 border border-slate-500/20 rounded bg-slate-500/5" viewBox="0 0 60 40">
        <path d="M 20 20 L 40 20 L 45 25" fill="none" stroke="#ef4444" strokeWidth="2" />
      </svg>
    )
  },
  {
    id: "leg-124",
    category: "MEP",
    name: "Electrical Notching",
    code: "NBC Part 9",
    description: "Hole diameter in load-bearing studs cannot exceed 1/3 the depth, leaving min 50mm of solid wood.",
    svg: (isDark) => (
      <svg className="w-16 h-10 border border-slate-500/20 rounded bg-slate-500/5" viewBox="0 0 60 40">
        <circle cx="30" cy="20" r="8" fill="none" stroke="#f59e0b" strokeWidth="2" />
        <line x1="20" y1="20" x2="40" y2="20" stroke="#f59e0b" strokeWidth="1" />
      </svg>
    )
  },
  {
    id: "leg-125",
    category: "Framing",
    name: "Floor Opening Headers",
    code: "NBC Part 9",
    description: "Openings exceeding 1.2m (4') in width require doubled header and trimmer joists.",
    svg: (isDark) => (
      <svg className="w-16 h-10 border border-slate-500/20 rounded bg-slate-500/5" viewBox="0 0 60 40">
        <rect x="20" y="10" width="20" height="20" fill="none" stroke="#f59e0b" strokeWidth="3" />
      </svg>
    )
  },
  {
    id: "leg-126",
    category: "Site & Survey",
    name: "Site Grading",
    code: "NBC Part 9",
    description: "Minimum required slope is 10% for the first 2 meters away from foundation.",
    svg: (isDark) => (
      <svg className="w-16 h-10 border border-slate-500/20 rounded bg-slate-500/5" viewBox="0 0 60 40">
        <path d="M 10 30 L 30 10 L 50 30" fill="none" stroke="#10b981" strokeWidth="2" />
      </svg>
    )
  },
  {
    id: "leg-127",
    category: "Roof Framing",
    name: "Attic Ventilation",
    code: "NBC 9.19.1",
    description: "Net free venting area must be at least 1/300 of the insulated ceiling area, distributed between eaves and ridge.",
    svg: (isDark) => (
      <svg className="w-16 h-10 border border-slate-500/20 rounded bg-slate-500/5" viewBox="0 0 60 40">
        <path d="M 15 25 Q 30 10 45 25" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="2,2" />
      </svg>
    )
  },
  {
    id: "leg-128",
    category: "Exterior Envelope",
    name: "Eaves Protection",
    code: "NBC 9.26.5",
    description: "Ice and water shield must extend from edge of roof to a line not less than 900mm up the roof slope.",
    svg: (isDark) => (
      <svg className="w-16 h-10 border border-slate-500/20 rounded bg-slate-500/5" viewBox="0 0 60 40">
        <line x1="10" y1="30" x2="40" y2="10" stroke="#0ea5e9" strokeWidth="4" strokeDasharray="6,2" />
      </svg>
    )
  },
  {
    id: "leg-129",
    category: "Stairs",
    name: "Guard & Handrail Height",
    code: "NBC 9.8.7/8",
    description: "Handrails required if >2 risers. Guards must be min 900mm high, or 1070mm if drop exceeds 10m.",
    svg: (isDark) => (
      <svg className="w-16 h-10 border border-slate-500/20 rounded bg-slate-500/5" viewBox="0 0 60 40">
        <line x1="20" y1="30" x2="40" y2="10" stroke="#3b82f6" strokeWidth="2" />
        <line x1="40" y1="10" x2="40" y2="25" stroke="#3b82f6" strokeWidth="1" />
      </svg>
    )
  }
];

const MOCK_FALLBACK_BLUEPRINTS = [
  {
    id: "bp-01",
    title: "The Title Block & Revisions",
    description: "The Title Block is the most critical part of any blueprint. It tells you exactly what you are building, who drew it, and when it was last changed.",
    scale: "Scale: 1/4\" = 1'-0\"",
    keyTakeaways: [
      {
        element: "Issued For Construction",
        explanation: "Always search for the stamp 'ISSUED FOR CONSTRUCTION' or 'IFC'."
      },
      {
        element: "Revision Block",
        explanation: "Tracks drawing revisions chronologically."
      }
    ]
  },
  {
    id: "bp-02",
    title: "Foundation & Framing Plan",
    description: "Foundation plans outline concrete footings, foundation walls, supporting beams, and teleposts.",
    scale: "Scale: 1/4\" = 1'-0\"",
    keyTakeaways: [
      {
        element: "Pad Footing",
        explanation: "Concrete pads that transfer concentrated loads from teleposts to the soil."
      }
    ]
  }
  ];

export default function BlueprintViewer() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeBlueprints, setActiveBlueprints] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [theme, setTheme] = useState('classic-blue'); // options: 'classic-blue', 'cad-dark', 'light-print'
  const [toastMessage, setToastMessage] = useState(null)
  const [pdfFile, setPdfFile] = useState(null)
  const [numPages, setNumPages] = useState(null)
  const [isPdfLoaded, setIsPdfLoaded] = useState(false)
  const [showLegend, setShowLegend] = useState(false)
  const [legendTab, setLegendTab] = useState('all')
  const [legendSearchQuery, setLegendSearchQuery] = useState('')
  const [showMasterclassInfo, setShowMasterclassInfo] = useState(false);
  const [showLegendInfo, setShowLegendInfo] = useState(false);

  useEffect(() => {
    let isMounted = true
    const loadBlueprintData = async () => {
      try {
        setIsLoading(true)
        let loaded = blueprintsData
        if (!loaded || !Array.isArray(loaded) || loaded.length === 0) {
          console.warn('Blueprints data missing or empty, using fallback set')
          loaded = MOCK_FALLBACK_BLUEPRINTS
        }
        if (isMounted) {
          setActiveBlueprints(loaded)
        }
      } catch (err) {
        console.error('Failed to load blueprint data:', err)
        if (isMounted) {
          setActiveBlueprints(MOCK_FALLBACK_BLUEPRINTS)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadBlueprintData()
    return () => { isMounted = false }
  }, [])
  
  // High-fidelity Masterclass interactive state
  const [highlightedElement, setHighlightedElement] = useState(null)
  const [selectedElement, setSelectedElement] = useState(null)
  const [selectedScheduleId, setSelectedScheduleId] = useState(null)

  const filteredLegendItems = useMemo(() => {
    return LEGEND_ITEMS.filter(item => {
      const matchesTab = legendTab === 'all' || item.category === legendTab;
      const matchesSearch = item.name.toLowerCase().includes(legendSearchQuery.toLowerCase()) || 
                            item.description.toLowerCase().includes(legendSearchQuery.toLowerCase()) || 
                            item.code.toLowerCase().includes(legendSearchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [legendTab, legendSearchQuery]);

  const getTargetPageAndElementId = (item) => {
    let targetPage = 1;
    let targetElementId = null;
    
    if (item.name === "IFC Stamp") {
      targetPage = 1;
      targetElementId = "title-block";
    } else if (item.name === "Section Mark") {
      targetPage = 1;
      targetElementId = "section-mark";
    } else if (item.name === "Structural Grids") {
      targetPage = 1;
      targetElementId = "grid-line";
    } else if (item.name === "Dimension Lines") {
      targetPage = 1;
      targetElementId = "dimension-line";
    } else if (item.name === "Dimension Strings") {
      targetPage = 1;
      targetElementId = "dimension-string";
    } else if (item.name === "Dimension Hierarchy") {
      targetPage = 1;
      targetElementId = "dimension-hierarchy";
    } else if (item.name === "Rough Opening (R.O.)") {
      targetPage = 1;
      targetElementId = "window-rough-opening";
    } else if (item.name === "Stair Rise/Run") {
      targetPage = 1;
      targetElementId = "stair-rise-run";
    } else if (item.name === "Rebar Spacing") {
      targetPage = 2;
      targetElementId = "rebar-spacing";
    } else if (item.name === "Damp-proofing") {
      targetPage = 2;
      targetElementId = "damp-proofing";
    } else if (item.name === "Elevation Marker") {
      targetPage = 1;
      targetElementId = "elevation-marker";
    } else if (item.name === "Pad Footing") {
      targetPage = 2;
      targetElementId = "pad-footing";
    } else if (item.name === "Continuous Footing") {
      targetPage = 2;
      targetElementId = "pad-footing";
    } else if (item.name === "Foundation Wall") {
      targetPage = 2;
      targetElementId = "pad-footing";
    } else if (item.name === "Built-up Timber Beam") {
      targetPage = 2;
      targetElementId = "pad-footing";
    } else if (item.name === "Telepost") {
      targetPage = 2;
      targetElementId = "pad-footing";
    } else if (item.name === "Finished Grade Line") {
      targetPage = 3;
      targetElementId = "height-marker";
    } else if (item.name === "Roof Pitch / Slope") {
      targetPage = 3;
      targetElementId = "roof-pitch";
    } else if (item.name === "Height Datum Marker") {
      targetPage = 3;
      targetElementId = "height-marker";
    } else if (item.name === "GFCI Outlet") {
      targetPage = 4;
      targetElementId = "gfci-outlet";
    } else if (item.name === "Switch & Wiring Loop") {
      targetPage = 4;
      targetElementId = "switch-wiring";
    } else if (item.name === "Electrical Panel") {
      targetPage = 4;
      targetElementId = "electrical-panel";
    } else if (item.name === "Standard Receptacle") {
      targetPage = 4;
      targetElementId = "gfci-outlet";
    } else if (item.name === "Wet Wall Chase") {
      targetPage = 1;
      targetElementId = "wet-wall-chase";
    } else if (item.name === "Load-Bearing Partition") {
      targetPage = 1;
      targetElementId = "interior-wall";
    } else if (item.name === "Non-Bearing Partition") {
      targetPage = 1;
      targetElementId = "non-bearing-partition";
    } else if (item.name === "Plumbing Chase Framing") {
      targetPage = 1;
      targetElementId = "plumbing-chase-framing";
    } else if (item.name === "Lintel Headers") {
      targetPage = 1;
      targetElementId = "lintel-header";
    } else if (item.name === "Weeping Tile Drainage") {
      targetPage = 2;
      targetElementId = "weeping-tile";
    } else if (item.name === "Step Footings") {
      targetPage = 2;
      targetElementId = "step-footing";
    } else if (item.name === "Telepost Pads") {
      targetPage = 2;
      targetElementId = "telepost-pad";
    } else if (item.name === "Height Datums") {
      targetPage = 3;
      targetElementId = "height-datum";
    } else if (item.name === "Rain Screen Cladding") {
      targetPage = 3;
      targetElementId = "rain-screen";
    } else if (item.name === "Envelope Assembly Layers") {
      targetPage = 3;
      targetElementId = "envelope-layers";
    } else if (item.name === "Attic Ventilation Baffles") {
      targetPage = 3;
      targetElementId = "ventilation-baffle";
    } else if (item.name === "Foundation Sill Gasket") {
      targetPage = 3;
      targetElementId = "sill-gasket";
    } else if (item.name === "Sill Plate Anchor Bolts") {
      targetPage = 3;
      targetElementId = "anchor-bolt";
    } else if (item.name === "CEC Working Clearance") {
      targetPage = 4;
      targetElementId = "cec-working-clearance";
    } else if (item.name === "Interconnected Smoke Alarms") {
      targetPage = 4;
      targetElementId = "interconnected-smoke";
    } else if (item.name === "Plumbing Riser Venting") {
      targetPage = 5;
      targetElementId = "plumbing-riser-venting";
    } else if (item.name === "Sump Pit Radon Seal") {
      targetPage = 5;
      targetElementId = "sump-pit-seal";
    } else if (item.name === "Joist Span Arrow") {
      targetPage = 6;
      targetElementId = "joist-span-arrow";
    } else if (item.name === "6-mil Poly Vapour Barrier") {
      targetPage = 3;
      targetElementId = "vapour-barrier";
    } else if (item.name === "OSB Nailing Pattern") {
      targetPage = 3;
      targetElementId = "osb-nailing";
    } else if (item.name === "Joist Penetration") {
      targetPage = 5;
      targetElementId = "joist-penetration";
    } else if (item.name === "Cross-Bridging") {
      targetPage = 6;
      targetElementId = "cross-bridging";
    } else if (item.name === "Batter Boards") {
      targetPage = 7;
      targetElementId = "batter-boards";
    } else if (item.name === "Building Setback") {
      targetPage = 7;
      targetElementId = "building-setback";
    } else if (item.name === "Benchmark Elevation") {
      targetPage = 7;
      targetElementId = "benchmark-elevation";
    } else if (item.name === "Ridge Board") {
      targetPage = 8;
      targetElementId = "ridge-board";
    } else if (item.name === "Collar Ties") {
      targetPage = 8;
      targetElementId = "collar-ties";
    } else if (item.name === "Step Flashing") {
      targetPage = 9;
      targetElementId = "step-flashing";
    } else if (item.name === "Finished Grade Clearance") {
      targetPage = 9;
      targetElementId = "grade-clearance";
    } else if (item.name === "Window Drip Cap") {
      targetPage = 9;
      targetElementId = "window-drip-cap";
    } else if (item.name === "Egress Window") {
      targetPage = 9;
      targetElementId = "egress-window";
    } else if (item.name === "Headroom Clearance") {
      targetPage = 10;
      targetElementId = "headroom-clearance";
    } else if (item.name === "Stringer Header Connection") {
      targetPage = 10;
      targetElementId = "stringer-top-connection";
    } else if (item.name === "Stringer Effective Depth") {
      targetPage = 10;
      targetElementId = "effective-depth";
    } else if (item.name === "Stair Uniformity Tolerances") {
      targetPage = 10;
      targetElementId = "stair-tolerances";
    } else if (item.name === "Load Bearing Wall") {
      targetPage = 1;
      targetElementId = "load-bearing-walls";
    } else if (item.name === "Anchor Bolts") {
      targetPage = 2;
      targetElementId = "anchor-bolts";
    } else if (item.name === "Base Flashing") {
      targetPage = 3;
      targetElementId = "base-flashing";
    } else if (item.name === "Plumbing P-Trap") {
      targetPage = 5;
      targetElementId = "plumbing-p-trap";
    } else if (item.name === "Soil Stack") {
      targetPage = 5;
      targetElementId = "soil-stack";
    } else if (item.name === "Building Drain") {
      targetPage = 5;
      targetElementId = "building-drain";
    } else if (item.name === "Cleanout (C.O.)") {
      targetPage = 5;
      targetElementId = "building-drain";
    } else if (item.name === "Joist Span Arrow") {
      targetPage = 6;
      targetElementId = "joist-span-arrow";
    } else if (item.name === "Cross-Bridging") {
      targetPage = 6;
      targetElementId = "cross-bridging";
    } else if (item.name === "Metal Joist Hangers") {
      targetPage = 6;
      targetElementId = "joist-hanger";
    } else if (item.name === "LVL Beam") {
      targetPage = 6;
      targetElementId = "lvl-beam";
    } else if (item.name === "FLOOR OPENINGS (TRIMMERS/HEADERS)" || item.name === "Trimmer & Header Joists") {
      targetPage = 6;
      targetElementId = "floor-openings";
    } else if (item.name === "Electrical Notching") {
      targetPage = 4;
      targetElementId = "electrical-notching";
    } else if (item.name === "Floor Opening Headers") {
      targetPage = 6;
      targetElementId = "floor-openings";
    } else if (item.name === "Site Grading") {
      targetPage = 7;
      targetElementId = "site-grading";
    } else if (item.name === "Attic Ventilation") {
      targetPage = 8;
      targetElementId = "attic-ventilation";
    } else if (item.name === "Eaves Protection") {
      targetPage = 9;
      targetElementId = "eaves-protection";
    } else if (item.name === "Guard & Handrail Height") {
      targetPage = 10;
      targetElementId = "guards-handrails";
    } else if (item.name === "Frost Line") {
      targetPage = 7;
      targetElementId = "frost-line";
    } else if (item.name === "Roof Pitch Indicator") {
      targetPage = 8;
      targetElementId = "roof-pitch-indicator";
    } else if (item.name === "Birdsmouth Seat Cut") {
      targetPage = 8;
      targetElementId = "birdsmouth-cut";
    } else if (item.name === "Midspan Blocking") {
      targetPage = 6;
      targetElementId = "blocking-midspan";
    }
    return { targetPage, targetElementId };
  };

  const handleLocateSymbol = (targetPage, elementId) => {
    setCurrentPage(targetPage); // Jump to the correct sheet (1 to 4)
    setShowLegend(false); // Close the legend modal
    setSelectedElement(elementId); // Set target element
    
    // Map elementId to human-readable highlighted element name
    let mappedName = elementId;
    if (elementId === 'title-block') mappedName = 'Revision Block';
    else if (elementId === 'section-mark') mappedName = 'Section Marks';
    else if (elementId === 'grid-line') mappedName = 'Structural Grids';
    else if (elementId === 'dimension-line') mappedName = 'Dimension Lines';
    else if (elementId === 'dimension-string') mappedName = 'Dimension Strings';
    else if (elementId === 'dimension-hierarchy') mappedName = 'Dimension Hierarchy';
    else if (elementId === 'window-symbol') mappedName = 'Window Symbols';
    else if (elementId === 'lintel-header') mappedName = 'Lintel Headers';
    else if (elementId === 'door-symbol') mappedName = 'Door Symbols';
    else if (elementId === 'stair-symbol') mappedName = 'Staircase Symbols';
    else if (elementId === 'interior-wall') mappedName = 'Load-Bearing Partition';
    else if (elementId === 'non-bearing-partition') mappedName = 'Non-Bearing Partition';
    else if (elementId === 'plumbing-chase-framing') mappedName = 'Plumbing Chase Framing';
    else if (elementId === 'wet-wall-chase') mappedName = 'Plumbing Chase Framing';
    else if (elementId === 'elevation-marker') mappedName = 'Elevation Markers';
    else if (elementId === 'pad-footing') mappedName = 'Pad Footing';
    else if (elementId === 'step-footing') mappedName = 'Step Footings';
    else if (elementId === 'telepost-pad') mappedName = 'Telepost Pads';
    else if (elementId === 'weeping-tile') mappedName = 'Weeping Tile Drainage';
    else if (elementId === 'roof-pitch') mappedName = 'Roof Pitch';
    else if (elementId === 'height-marker') mappedName = 'Height Marker';
    else if (elementId === 'height-datum') mappedName = 'Height Datums';
    else if (elementId === 'rain-screen') mappedName = 'Rain Screen Cladding';
    else if (elementId === 'envelope-layers') mappedName = 'Envelope Assembly Layers';
    else if (elementId === 'ventilation-baffle') mappedName = 'Attic Ventilation Baffles';
    else if (elementId === 'sill-gasket') mappedName = 'Foundation Sill Gasket';
    else if (elementId === 'anchor-bolt') mappedName = 'Sill Plate Anchor Bolts';
    else if (elementId === 'electrical-panel') mappedName = 'Electrical Panel';
    else if (elementId === 'cec-working-clearance') mappedName = 'CEC Working Clearance';
    else if (elementId === 'switch-wiring') mappedName = 'Switch & Wiring';
    else if (elementId === 'gfci-outlet') mappedName = 'GFCI Outlet';
    else if (elementId === 'receptacle-spacing') mappedName = 'RECEPTACLE SPACING';
    else if (elementId === '240v-receptacles') mappedName = '240V RECEPTACLES';
    else if (elementId === 'electrical-notching') mappedName = 'STUD DRILLING LIMITS';
    else if (elementId === 'smoke-co-detector' || elementId === 'interconnected-smoke') mappedName = 'Interconnected Smoke Alarms';
    else if (elementId === 'plumbing-riser-venting') mappedName = 'PLUMBING RISER VENTING';
    else if (elementId === 'plumbing-p-trap') mappedName = 'PLUMBING P-TRAP';
    else if (elementId === 'soil-stack') mappedName = 'SOIL STACK';
    else if (elementId === 'building-drain') mappedName = 'BUILDING DRAIN';
    else if (elementId === 'cleanout') mappedName = 'CLEANOUT (C.O.)';
    else if (elementId === 'sump-pit-seal') mappedName = 'Sump Pit Radon Seal';
    else if (elementId === 'hvac-unit') mappedName = 'HRV Mechanical Systems';
    else if (elementId === 'joist-span-arrow') mappedName = 'Joist Span Arrow';
    else if (elementId === 'blocking-midspan') mappedName = 'Midspan Blocking';
    else if (elementId === 'joist-hanger') mappedName = 'Metal Joist Hangers';
    else if (elementId === 'cross-bridging') mappedName = 'Cross-Bridging';
    else if (elementId === 'lvl-beam') mappedName = 'LVL Beam';
    else if (elementId === 'frost-line') mappedName = 'FROST DEPTH FOUNDATIONS';
    else if (elementId === 'birdsmouth-cut') mappedName = 'BIRDSMOUTH BEARING';
    else if (elementId === 'roof-pitch-indicator') mappedName = 'MINIMUM ROOF SLOPE';
    else if (elementId === 'egress-window') mappedName = 'BEDROOM EGRESS WINDOWS';
    else if (elementId === 'stringer-top-connection') mappedName = 'STRINGER ATTACHMENT';
    else if (elementId === 'effective-depth') mappedName = 'STRINGER EFFECTIVE DEPTH';
    else if (elementId === 'stair-tolerances') mappedName = 'RISE & RUN TOLERANCES';

    setHighlightedElement(mappedName); // Set target element to animate/highlight
    if (elementId === 'window-symbol') {
      setSelectedScheduleId('W-1')
    } else if (elementId === 'door-symbol') {
      setSelectedScheduleId('D-1')
    }
    
    // Auto-clear the highlight ring after 3 seconds
    setTimeout(() => {
      setHighlightedElement(null);
      setSelectedElement(null);
    }, 3000);
  };

  const setIsLegendOpen = (isOpen) => {
    setShowLegend(isOpen);
  };

  const handleLegendItemSelect = (item) => {
    const { targetPage, targetElementId } = getTargetPageAndElementId(item);
    handleLocateSymbol(targetPage, targetElementId);
  };

  const handleElementClick = (elementId) => {
    let mappedName = elementId
    if (elementId === 'title-block') {
      mappedName = 'Revision Block'
    } else if (elementId === 'section-mark') {
      mappedName = 'Section Marks'
    } else if (elementId === 'grid-line') {
      mappedName = 'Structural Grids'
    } else if (elementId === 'dimension-line') {
      mappedName = 'Dimension Lines'
    } else if (elementId === 'dimension-string') {
      mappedName = 'Dimension Strings'
    } else if (elementId === 'dimension-hierarchy') {
      mappedName = 'Dimension Hierarchy'
    } else if (elementId === 'window-symbol') {
      mappedName = 'Window Symbols'
    } else if (elementId === 'lintel-header') {
      mappedName = 'Lintel Headers'
    } else if (elementId === 'door-symbol') {
      mappedName = 'Door Symbols'
    } else if (elementId === 'stair-symbol') {
      mappedName = 'Staircase Symbols'
    } else if (elementId === 'interior-wall') {
      mappedName = 'Load-Bearing Partition'
    } else if (elementId === 'non-bearing-partition') {
      mappedName = 'Non-Bearing Partition'
    } else if (elementId === 'plumbing-chase-framing') {
      mappedName = 'Plumbing Chase Framing'
    } else if (elementId === 'wet-wall-chase') {
      mappedName = 'Plumbing Chase Framing'
    } else if (elementId === 'window-rough-opening') {
      mappedName = 'Window Rough Opening'
    } else if (elementId === 'stair-rise-run') {
      mappedName = 'Stair Rise & Run'
    } else if (elementId === 'rebar-spacing') {
      mappedName = 'Rebar Spacing'
    } else if (elementId === 'damp-proofing') {
      mappedName = 'Damp-proofing'
    } else if (elementId === 'elevation-marker') {
      mappedName = 'Elevation Markers'
    } else if (elementId === 'pad-footing') {
      mappedName = 'Pad Footing'
    } else if (elementId === 'step-footing') {
      mappedName = 'Step Footings'
    } else if (elementId === 'telepost-pad') {
      mappedName = 'Telepost Pads'
    } else if (elementId === 'weeping-tile') {
      mappedName = 'Weeping Tile Drainage'
    } else if (elementId === 'roof-pitch') {
      mappedName = 'Roof Pitch'
    } else if (elementId === 'height-marker') {
      mappedName = 'Height Marker'
    } else if (elementId === 'height-datum') {
      mappedName = 'Height Datums'
    } else if (elementId === 'rain-screen') {
      mappedName = 'Rain Screen Cladding'
    } else if (elementId === 'envelope-layers') {
      mappedName = 'Envelope Assembly Layers'
    } else if (elementId === 'ventilation-baffle') {
      mappedName = 'Attic Ventilation Baffles'
    } else if (elementId === 'sill-gasket') {
      mappedName = 'Foundation Sill Gasket'
    } else if (elementId === 'anchor-bolt') {
      mappedName = 'Sill Plate Anchor Bolts'
    } else if (elementId === 'electrical-panel') {
      mappedName = 'Electrical Panel'
    } else if (elementId === 'cec-working-clearance') {
      mappedName = 'CEC Working Clearance'
    } else if (elementId === 'switch-wiring') {
      mappedName = 'Switch & Wiring'
    } else if (elementId === 'gfci-outlet') {
      mappedName = 'GFCI Outlet'
    } else if (elementId === 'receptacle-spacing') {
      mappedName = 'RECEPTACLE SPACING'
    } else if (elementId === '240v-receptacles') {
      mappedName = '240V RECEPTACLES'
    } else if (elementId === 'electrical-notching') {
      mappedName = 'STUD DRILLING LIMITS'
    } else if (elementId === 'smoke-co-detector' || elementId === 'interconnected-smoke') {
      mappedName = 'Interconnected Smoke Alarms'
    } else if (elementId === 'plumbing-riser-venting') {
      mappedName = 'PLUMBING RISER VENTING'
    } else if (elementId === 'plumbing-p-trap') {
      mappedName = 'PLUMBING P-TRAP'
    } else if (elementId === 'soil-stack') {
      mappedName = 'SOIL STACK'
    } else if (elementId === 'building-drain') {
      mappedName = 'BUILDING DRAIN'
    } else if (elementId === 'cleanout') {
      mappedName = 'CLEANOUT (C.O.)'
    } else if (elementId === 'sump-pit-seal') {
      mappedName = 'Sump Pit Radon Seal'
    } else if (elementId === 'hvac-unit') {
      mappedName = 'HRV Mechanical Systems'
    } else if (elementId === 'joist-span-arrow') {
      mappedName = 'Joist Span Arrow'
    } else if (elementId === 'vapour-barrier') {
      mappedName = '6-mil Poly Vapour Barrier'
    } else if (elementId === 'osb-nailing') {
      mappedName = 'OSB Nailing Pattern'
    } else if (elementId === 'joist-penetration') {
      mappedName = 'Joist Penetration'
    } else if (elementId === 'cross-bridging') {
      mappedName = 'Cross-Bridging'
    } else if (elementId === 'batter-boards') {
      mappedName = 'Batter Boards'
    } else if (elementId === 'building-setback') {
      mappedName = 'Building Setback'
    } else if (elementId === 'benchmark-elevation') {
      mappedName = 'Benchmark Elevation'
    } else if (elementId === 'ridge-board') {
      mappedName = 'Ridge Board'
    } else if (elementId === 'collar-ties') {
      mappedName = 'Collar Ties'
    } else if (elementId === 'step-flashing') {
      mappedName = 'Step Flashing'
    } else if (elementId === 'grade-clearance') {
      mappedName = 'Finished Grade Clearance'
    } else if (elementId === 'window-drip-cap') {
      mappedName = 'Window Drip Cap'
    } else if (elementId === 'headroom-clearance') {
      mappedName = 'Headroom Clearance'
    } else if (elementId === 'stringer-attachment') {
      mappedName = 'Stringer Attachment'
    } else if (elementId === 'load-bearing-walls') {
      mappedName = 'Load Bearing Wall'
    } else if (elementId === 'anchor-bolts') {
      mappedName = 'Anchor Bolts'
    } else if (elementId === 'base-flashing') {
      mappedName = 'BASE FLASHING & WEEPHOLES'
    } else if (elementId === 'electrical-notching') {
      mappedName = 'STUD DRILLING LIMITS'
    } else if (elementId === 'floor-openings') {
      mappedName = 'FLOOR OPENINGS (TRIMMERS/HEADERS)'
    } else if (elementId === 'site-grading') {
      mappedName = 'Site Grading'
    } else if (elementId === 'attic-ventilation') {
      mappedName = 'Attic Ventilation'
    } else if (elementId === 'eaves-protection') {
      mappedName = 'Eaves Protection'
    } else if (elementId === 'guards-handrails') {
      mappedName = 'Guard & Handrail Height'
    } else if (elementId === 'birdsmouth-cut') {
      mappedName = 'Birdsmouth Cut'
    } else if (elementId === 'blocking-midspan') {
      mappedName = 'Midspan Blocking'
    } else if (elementId === 'joist-hanger') {
      mappedName = 'Metal Joist Hangers'
    } else if (elementId === 'cross-bridging') {
      mappedName = 'Cross-Bridging'
    } else if (elementId === 'lvl-beam') {
      mappedName = 'LVL Beam'
    }

    setSelectedElement(elementId)
    setHighlightedElement(mappedName)
    
    if (elementId === 'window-symbol') {
      setSelectedScheduleId('W-1')
    } else if (elementId === 'door-symbol') {
      setSelectedScheduleId('D-1')
    }

    // Safe delay to allow DOM/state sync then scroll
    setTimeout(() => {
      const elementDomId = `takeaway-${mappedName.toLowerCase().replace(/\s+/g, '-')}`
      const element = document.getElementById(elementDomId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }
    }, 120)

    showToast(`Tapped interactive blueprint element: ${mappedName}`)
  }
  
  // Reviewed pages track state with Local Storage persistence
  const [reviewedPages, setReviewedPages] = useState(() => {
    const saved = localStorage.getItem('red_seal_reviewed_blueprints')
    return saved ? JSON.parse(saved) : []
  })

  // Framer-motion values for precise custom panning
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Sync reviewed pages to localStorage
  useEffect(() => {
    localStorage.setItem('red_seal_reviewed_blueprints', JSON.stringify(reviewedPages))
  }, [reviewedPages])

  const toggleReviewed = (pageId) => {
    setReviewedPages(prev => {
      const updated = prev.includes(pageId)
        ? prev.filter(p => p !== pageId)
        : [...prev, pageId]
      
      const isNowReviewed = updated.includes(pageId)
      showToast(isNowReviewed ? `Page ${pageId} marked as Reviewed! ✓` : `Page ${pageId} marked as uncompleted.`)
      return updated
    })
  }

  const isReviewed = (pageId) => reviewedPages.includes(pageId)
  
  // Annotation & Notes State


  const viewerRef = useRef(null)


  // Mouse wheel scroll-to-zoom and Mobile pinch-to-zoom
  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer) return

    const handleWheel = (e) => {
      // Zoom on scroll wheel (prevent default so page doesn't scroll)
      e.preventDefault()
      const zoomFactor = e.deltaY < 0 ? 10 : -10
      setZoomLevel(prev => {
        const targetZoom = prev + zoomFactor
        return Math.max(50, Math.min(250, targetZoom))
      })
    }

    let initialDistance = null

    const handleTouchStart = (e) => {
      if (e.touches.length === 2) {
        const t1 = e.touches[0]
        const t2 = e.touches[1]
        initialDistance = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY)
      }
    }

    const handleTouchMove = (e) => {
      if (e.touches.length === 2 && initialDistance !== null) {
        e.preventDefault()
        const t1 = e.touches[0]
        const t2 = e.touches[1]
        const currentDistance = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY)
        const scaleChange = currentDistance / initialDistance
        
        setZoomLevel(prev => {
          const targetZoom = Math.round(prev * scaleChange)
          return Math.max(50, Math.min(250, targetZoom))
        })
        
        initialDistance = currentDistance
      }
    }

    const handleTouchEnd = () => {
      initialDistance = null
    }

    viewer.addEventListener('wheel', handleWheel, { passive: false })
    viewer.addEventListener('touchstart', handleTouchStart, { passive: true })
    viewer.addEventListener('touchmove', handleTouchMove, { passive: false })
    viewer.addEventListener('touchend', handleTouchEnd)

    return () => {
      viewer.removeEventListener('wheel', handleWheel)
      viewer.removeEventListener('touchstart', handleTouchStart)
      viewer.removeEventListener('touchmove', handleTouchMove)
      viewer.removeEventListener('touchend', handleTouchEnd)
    }
  }, [])

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const handlePrint = () => {
    showToast("Preparing document for print spooler...")
    setTimeout(() => {
      showToast("Sent Official_RS_Carpentry_Blueprints.pdf to system printer!")
    }, 1200)
  }

  const handleDownload = () => {
    showToast("Generating secure PDF download token...")
    setTimeout(() => {
      showToast("Download started: Official_RS_Carpentry_Blueprints.pdf successfully saved.")
    }, 1200)
  }

  const handleSelectScheduleItem = (id) => {
    setSelectedScheduleId(id);
    if (id === 'W-1' || id === 'W-2') {
      setCurrentPage(1);
      setSelectedElement('window-symbol');
      setHighlightedElement('Window Symbols');
    } else if (id === 'D-1') {
      setCurrentPage(1);
      setSelectedElement('door-symbol');
      setHighlightedElement('Door Symbols');
    }
  }

  // PDF Document Load Success Handler
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages)
    setIsPdfLoaded(true)
    setCurrentPage(1)
    showToast("External PDF Blueprint loaded successfully!")
  }

  const onDocumentLoadError = (error) => {
    console.error('PDF Load Error:', error)
    setIsPdfLoaded(false)
    showToast("Viewing high-fidelity digital blueprint mockup (default)")
  }

  // Define dynamic pages based on JSON payload
  const pages = useMemo(() => {
    const isClassic = theme === 'classic' || theme === 'classic-blue';
    const isCad = theme === 'cad' || theme === 'cad-dark';
    const isLight = theme === 'light' || theme === 'light-print';

    const sourceBlueprints = (activeBlueprints && activeBlueprints.length > 0)
      ? activeBlueprints
      : ((blueprintsData && blueprintsData.length > 0) ? blueprintsData : MOCK_FALLBACK_BLUEPRINTS);

    return sourceBlueprints.map((bp, index) => {
      let content = null;
      let scale = "Scale: 1/4\" = 1'-0\" (Metric: 1:50)";
      
      if (bp.id === 'bp-01') {
        content = (
          <svg viewBox="0 0 800 500" width="100%" height="100%" className="w-full h-full select-none">
            {/* Background based on theme */}
            <rect width="800" height="500" fill={isClassic ? '#0f2b48' : (isCad ? '#111827' : '#fafafa')} />
            
            {/* Grid lines */}
            <g stroke={isClassic ? 'rgba(255,255,255,0.04)' : (isCad ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)')} strokeWidth="1">
              {Array.from({ length: 16 }).map((_, i) => (
                <line key={`v-${i}`} x1={i * 50} y1="0" x2={i * 50} y2="500" />
              ))}
              {Array.from({ length: 10 }).map((_, i) => (
                <line key={`h-${i}`} x1="0" y1={i * 50} x2="800" y2={i * 50} />
              ))}
            </g>

            {/* Border line */}
            <rect x="20" y="20" width="760" height="460" fill="none" stroke={isLight ? '#1e293b' : '#38bdf8'} strokeWidth="2" strokeDasharray={isLight ? 'none' : '4 4'} />

            {/* Main drawing space blueprint outline */}
            <g transform="translate(40, 40)" stroke={isLight ? '#64748b' : '#38bdf8'} strokeWidth="1.5">
              <rect width="400" height="420" fill="none" strokeDasharray="5 5" />
              <text x="200" y="210" fill={isLight ? '#475569' : '#ffffff'} fontSize="14" fontWeight="black" textAnchor="middle" stroke="none">MAIN SCHEMATIC DETAILS</text>
            </g>

            {/* Detailed Title Block - clickable / highlightable */}
            <g 
              transform="translate(480, 260)" 
              stroke={isLight ? '#1e293b' : '#38bdf8'} 
              strokeWidth="1.5"
              className="cursor-pointer"
              onClick={() => setHighlightedElement(highlightedElement === 'Revision Block' ? null : 'Revision Block')}
            >
              <rect 
                width="280" height="200" 
                fill={isLight ? '#f8fafc' : '#1e3a5f'} 
                strokeWidth={highlightedElement === 'Revision Block' ? "3.5" : "1.5"}
                stroke={highlightedElement === 'Revision Block' ? "#f59e0b" : undefined}
                rx="4"
              />
              {/* Highlight Overlay for Title Block / Rev Block */}
              {highlightedElement === 'Revision Block' && (
                <rect width="280" height="200" fill="#f59e0b" fillOpacity="0.05" stroke="none" />
              )}
              
              <line x1="0" y1="40" x2="280" y2="40" />
              <line x1="0" y1="80" x2="280" y2="80" />
              <line x1="0" y1="120" x2="280" y2="120" />
              <line x1="0" y1="160" x2="280" y2="160" />

              <line x1="140" y1="120" x2="140" y2="160" />
              <line x1="100" y1="160" x2="100" y2="200" />
              <line x1="190" y1="160" x2="190" y2="200" />

              <text x="15" y="24" fill={isLight ? '#0f172a' : '#ffffff'} fontSize="9" fontWeight="black" stroke="none">PROJECT: RED SEAL SECTOR-9 CARPENTRY ACADEMY</text>
              <text x="15" y="62" fill={isLight ? '#0f172a' : '#ffffff'} fontSize="8" fontWeight="bold" stroke="none">ARCHITECT: DEEPMIND DESIGN & ENGINEERING</text>
              <text x="15" y="102" fill={isLight ? '#475569' : '#94a3b8'} fontSize="8" fontWeight="semibold" stroke="none">TITLE: MAIN BUILDING DETAILED SCHEMATICS</text>
              
              <text x="15" y="142" fill={isLight ? '#0f172a' : '#ffffff'} fontSize="8" fontWeight="black" stroke="none">SCALE: 1/4" = 1'-0"</text>
              <text x="155" y="142" fill={isLight ? '#0f172a' : '#ffffff'} fontSize="8" fontWeight="black" stroke="none">DATE: 2026-07-01</text>

              {/* IFC Stamp - clickable / highlightable */}
              <g 
                onClick={(e) => {
                  e.stopPropagation();
                  setHighlightedElement(highlightedElement === 'Issued For Construction' ? null : 'Issued For Construction');
                }}
                className="cursor-pointer"
              >
                <rect 
                  x="15" y="170" width="70" height="22" 
                  fill={highlightedElement === 'Issued For Construction' ? "#10b981" : "#059669"} 
                  stroke={highlightedElement === 'Issued For Construction' ? "#ffffff" : "none"}
                  strokeWidth="2"
                  rx="3" 
                />
                <text x="50" y="184" fill="#ffffff" fontSize="8" fontWeight="black" textAnchor="middle" stroke="none">IFC STAMP</text>
              </g>

              <text x="110" y="182" fill={isLight ? '#0f172a' : '#ffffff'} fontSize="8" fontWeight="black" stroke="none">DWG NO: A-101</text>
              <text x="205" y="182" fill={isLight ? '#0f172a' : '#ffffff'} fontSize="8" fontWeight="black" stroke="none">REVISION: R-2</text>
            </g>

            {/* Revision Block Table Top/Right */}
            <g 
              transform="translate(480, 40)" 
              stroke={isLight ? '#1e293b' : '#38bdf8'} 
              strokeWidth="1"
              className="cursor-pointer"
              onClick={() => setHighlightedElement(highlightedElement === 'Revision Block' ? null : 'Revision Block')}
            >
              <rect 
                width="280" height="200" 
                fill={isLight ? '#f1f5f9' : '#0f1e33'} 
                opacity="0.85" 
                stroke={highlightedElement === 'Revision Block' ? "#f59e0b" : undefined}
                strokeWidth={highlightedElement === 'Revision Block' ? "3.5" : "1"}
                rx="4"
              />
              <text x="15" y="24" fill={isLight ? '#1e293b' : '#38bdf8'} fontSize="10" fontWeight="black" stroke="none">CHRONOLOGICAL REVISION TABLE</text>
              <line x1="0" y1="35" x2="280" y2="35" strokeWidth="2" />
              
              <text x="10" y="52" fill={isLight ? '#0f172a' : '#ffffff'} fontSize="8" fontWeight="bold" stroke="none">REV</text>
              <text x="45" y="52" fill={isLight ? '#0f172a' : '#ffffff'} fontSize="8" fontWeight="bold" stroke="none">DATE</text>
              <text x="100" y="52" fill={isLight ? '#0f172a' : '#ffffff'} fontSize="8" fontWeight="bold" stroke="none">DESCRIPTION</text>
              <text x="240" y="52" fill={isLight ? '#0f172a' : '#ffffff'} fontSize="8" fontWeight="bold" stroke="none">APP</text>
              <line x1="0" y1="62" x2="280" y2="62" />

              <g transform="translate(0, 70)">
                <text x="10" y="12" fill={isLight ? '#475569' : '#94a3b8'} fontSize="8" stroke="none">R-0</text>
                <text x="35" y="12" fill={isLight ? '#475569' : '#94a3b8'} fontSize="8" stroke="none">2026-05-10</text>
                <text x="100" y="12" fill={isLight ? '#475569' : '#94a3b8'} fontSize="8" stroke="none">ISSUED FOR COMPLIANCE REVIEW</text>
                <text x="240" y="12" fill={isLight ? '#475569' : '#94a3b8'} fontSize="8" stroke="none">AL-2</text>
              </g>

              <g transform="translate(0, 95)">
                <text x="10" y="12" fill={isLight ? '#0f172a' : '#ffffff'} fontSize="8" fontWeight="bold" stroke="none">R-1</text>
                <text x="35" y="12" fill={isLight ? '#0f172a' : '#ffffff'} fontSize="8" fontWeight="bold" stroke="none">STAIR OPENING RE-DIMENSIONED</text>
                <text x="240" y="12" fill={isLight ? '#0f172a' : '#ffffff'} fontSize="8" fontWeight="bold" stroke="none">DH-1</text>
                <line x1="0" y1="-5" x2="280" y2="-5" strokeDasharray="2 2" />
              </g>

              <g transform="translate(0, 120)">
                <text x="10" y="12" fill="#ef4444" fontSize="8" fontWeight="black" stroke="none">R-2</text>
                <text x="35" y="12" fill="#ef4444" fontSize="8" fontWeight="black" stroke="none">2026-07-01</text>
                <text x="100" y="12" fill="#ef4444" fontSize="8" fontWeight="black" stroke="none">ISSUED FOR CONSTRUCTION (IFC)</text>
                <text x="240" y="12" fill="#ef4444" fontSize="8" fontWeight="black" stroke="none">ST-9</text>
                <line x1="0" y1="-5" x2="280" y2="-5" strokeDasharray="2 2" stroke="#ef4444" />
              </g>
            </g>

            {/* Radar / Pulse Highlight Overlay */}
            {highlightedElement === 'Revision Block' && (
              <g pointerEvents="none">
                <circle cx="620" cy="360" r="30" fill="none" stroke="#fbbf24" strokeWidth="3">
                  <animate attributeName="r" values="20;80" dur="1.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="1;0" dur="1.5s" repeatCount="indefinite" />
                </circle>
                <circle cx="620" cy="360" r="30" fill="none" stroke="#fbbf24" strokeWidth="1.5">
                  <animate attributeName="r" values="20;50" dur="1.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="1;0" dur="1.5s" repeatCount="indefinite" />
                </circle>
              </g>
            )}
            {highlightedElement === 'Issued For Construction' && (
              <g pointerEvents="none">
                <circle cx="530" cy="441" r="15" fill="none" stroke="#10b981" strokeWidth="3">
                  <animate attributeName="r" values="10;45" dur="1.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="1;0" dur="1.5s" repeatCount="indefinite" />
                </circle>
              </g>
            )}
          </svg>
        )
      } else if (bp.id === 'bp-02') {
        content = (
          <svg viewBox="0 0 800 500" width="100%" height="100%" className="w-full h-full select-none">
            {/* Background based on theme */}
            <rect width="800" height="500" fill={isClassic ? '#0f2b48' : (isCad ? '#111827' : '#fafafa')} />
            
            {/* Grid lines */}
            <g stroke={isClassic ? 'rgba(255,255,255,0.04)' : (isCad ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)')} strokeWidth="1">
              {Array.from({ length: 16 }).map((_, i) => (
                <line key={`v-${i}`} x1={i * 50} y1="0" x2={i * 50} y2="500" />
              ))}
              {Array.from({ length: 10 }).map((_, i) => (
                <line key={`h-${i}`} x1="0" y1={i * 50} x2="800" y2={i * 50} />
              ))}
            </g>

            {/* Border line */}
            <rect x="20" y="20" width="760" height="460" fill="none" stroke={isLight ? '#1e293b' : '#38bdf8'} strokeWidth="2" strokeDasharray={isLight ? 'none' : '4 4'} />

            {/* Strip Footings (Dashed) */}
            <rect x="130" y="60" width="440" height="340" fill="none" stroke={isLight ? '#475569' : '#ffffff'} strokeWidth="1.5" strokeDasharray="10,5" opacity="0.6" />
            <rect x="170" y="100" width="360" height="260" fill="none" stroke={isLight ? '#475569' : '#ffffff'} strokeWidth="1.5" strokeDasharray="10,5" opacity="0.6" />
            
            {/* Foundation Walls (Solid concrete lines) */}
            <rect x="150" y="80" width="400" height="300" fill="none" stroke={isLight ? '#0f172a' : '#ffffff'} strokeWidth="5" />
            <rect x="160" y="90" width="380" height="280" fill="none" stroke={isLight ? '#475569' : '#38bdf8'} strokeWidth="1.5" />

            {/* Center Steel Beam & Teleposts */}
            <line x1="160" y1="230" x2="540" y2="230" stroke={highlightedElement === 'Pad Footing' ? '#fbbf24' : (isLight ? '#0f172a' : '#10b981')} strokeWidth="4.5" strokeDasharray="20,10" />
            
            {/* Interactive Pad Footing & Telepost */}
            <g 
              onClick={() => handleElementClick('pad-footing')} 
              className="cursor-pointer group"
            >
              <rect 
                x="310" y="190" width="80" height="80" 
                fill="none" 
                stroke={highlightedElement === 'Pad Footing' ? "#f59e0b" : (isLight ? '#0f172a' : '#38bdf8')} 
                strokeWidth={highlightedElement === 'Pad Footing' ? "3" : "1.5"} 
                strokeDasharray="5,5" 
                className="group-hover:stroke-yellow-400" 
              />
              <circle 
                cx="350" cy="230" r="10" 
                fill={highlightedElement === 'Pad Footing' ? "#f59e0b" : (isLight ? '#0f172a' : '#38bdf8')} 
                className="group-hover:fill-yellow-400" 
              />
              <text 
                x="350" y="180" 
                fill={isLight ? '#0f172a' : '#ffffff'} 
                fontSize="11" 
                fontWeight="black" 
                textAnchor="middle" 
                className="group-hover:fill-yellow-400"
              >
                24x24 CONCRETE PAD FOOTING
              </text>
            </g>

            {/* Search matches */}
            {/* Title Block on Bottom/Right */}
            <g 
              transform="translate(520, 340)" 
              stroke={isLight ? '#1e293b' : '#38bdf8'} 
              strokeWidth="1.5"
              className="cursor-pointer"
              onClick={() => handleElementClick('title-block')}
            >
              <rect width="260" height="140" fill={isLight ? '#f8fafc' : '#1e3a5f'} rx="4" />
              <text x="15" y="30" fill={isLight ? '#0f172a' : '#ffffff'} fontSize="14" fontWeight="bold">PROJECT: RSR-2026</text>
              <text x="15" y="60" fill={isLight ? '#0f172a' : '#38bdf8'} fontSize="12" fontWeight="black">DWG: S1.0 - FOUNDATION</text>
              <text x="15" y="90" fill={isLight ? '#0f172a' : '#ffffff'} fontSize="12">SCALE: 1/4" = 1'-0"</text>
              <text x="15" y="115" fill="#f43f5e" fontSize="11" fontWeight="extrabold">★ FOUNDATION & BASE DETAILS</text>
            </g>

            {/* Radar / Pulse Highlight Overlay */}
            {highlightedElement === 'Pad Footing' && (
              <g pointerEvents="none">
                <circle cx="350" cy="230" r="20" fill="none" stroke="#f59e0b" strokeWidth="3">
                  <animate attributeName="r" values="15;60" dur="1.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="1;0" dur="1.5s" repeatCount="indefinite" />
                </circle>
              </g>
            )}
          </svg>
        )
      } else if (bp.id === 'bp-03') {
        const strokeColor = isLight ? '#0f172a' : '#ffffff';
        const textColor = isLight ? '#0f172a' : '#ffffff';
        content = (
          <svg viewBox="0 0 800 500" width="100%" height="100%" className="w-full h-full select-none">
            {/* Background based on theme */}
            <rect width="800" height="500" fill={isClassic ? '#0f2b48' : (isCad ? '#111827' : '#fafafa')} />
            
            {/* Grid lines */}
            <g stroke={isClassic ? 'rgba(255,255,255,0.04)' : (isCad ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)')} strokeWidth="1">
              {Array.from({ length: 16 }).map((_, i) => (
                <line key={`v-${i}`} x1={i * 50} y1="0" x2={i * 50} y2="500" />
              ))}
              {Array.from({ length: 10 }).map((_, i) => (
                <line key={`h-${i}`} x1="0" y1={i * 50} x2="800" y2={i * 50} />
              ))}
            </g>

            {/* Border line */}
            <rect x="20" y="20" width="760" height="460" fill="none" stroke={isLight ? '#1e293b' : '#38bdf8'} strokeWidth="2" strokeDasharray={isLight ? 'none' : '4 4'} />

            {/* Ground Earth Hatch / Soil Representation */}
            <g opacity="0.15" pointerEvents="none">
              <rect x="410" y="340" width="340" height="150" fill={isLight ? 'rgba(15,23,42,0.05)' : 'rgba(255,255,255,0.05)'} />
            </g>

            {/* Concrete hatching (triangles & sand dots inside foundation, slab, and footing) */}
            <g opacity="0.25" stroke={strokeColor} strokeWidth="1" pointerEvents="none">
              {/* Foundation wall concrete symbols */}
              <path d="M 390 320 L 395 325 L 390 325 Z M 400 350 L 405 355 L 400 355 Z M 392 385 L 397 390 L 392 390 Z" />
              <circle cx="395" cy="335" r="1" />
              <circle cx="402" cy="370" r="1" />
              {/* Footing concrete symbols */}
              <path d="M 380 422 L 385 427 L 380 427 Z M 410 424 L 415 429 L 410 429 Z" />
              <circle cx="390" cy="432" r="1" />
              <circle cx="420" cy="420" r="1" />
              {/* Slab concrete symbols */}
              <path d="M 230 412 L 235 417 L 230 417 Z M 320 412 L 325 417 L 320 417 Z" />
            </g>

            {/* Gravel surrounding weeping tile */}
            <g opacity="0.3" fill="none" stroke={strokeColor} strokeWidth="1">
              {[...Array(15)].map((_, i) => {
                const cx = 433 + (i % 5) * 5;
                const cy = 413 + Math.floor(i / 5) * 5;
                return <circle key={i} cx={cx} cy={cy} r="1" fill={strokeColor} />;
              })}
            </g>

            {/* --- STRUCTURAL FRAMING MEMBERS --- */}
            <g stroke={strokeColor} strokeWidth="1.5" fill="none">
              {/* Roof Truss: Top Chord */}
              <polygon points="140,30 470,135 510,148 510,154 470,141 140,36" fill="rgba(180,83,9,0.1)" />
              {/* Roof Truss: Bottom Chord / Ceiling Joist */}
              <rect x="200" y="135" width="210" height="8" fill="rgba(180,83,9,0.1)" />

              {/* Double Top Plate */}
              <rect x="390" y="135" width="20" height="4" fill="rgba(180,83,9,0.1)" />
              <rect x="390" y="139" width="20" height="4" fill="rgba(180,83,9,0.1)" />

              {/* Wood Studs (2x6 cavity) */}
              <rect x="390" y="143" width="20" height="129" fill="rgba(180,83,9,0.1)" />

              {/* Stud cavity insulation (Wavy pink pattern) */}
              <path 
                d="M 400,147 C 392,157 408,167 400,177 C 392,187 408,197 400,207 C 392,217 408,227 400,237 C 392,247 408,257 400,267" 
                stroke="#ec4899" 
                strokeWidth="2.5" 
                opacity="0.65" 
                fill="none" 
                pointerEvents="none"
              />

              {/* Bottom Sole Plate */}
              <rect x="390" y="272" width="20" height="8" fill="rgba(180,83,9,0.1)" />

              {/* Subfloor (3/4" T&G) */}
              <rect x="200" y="280" width="210" height="3" fill="rgba(180,83,9,0.05)" />

              {/* Rim Joist */}
              <rect x="404" y="283" width="6" height="24" fill="rgba(180,83,9,0.1)" />

              {/* Floor I-Joist Assembly */}
              {/* Top flange */}
              <rect x="200" y="283" width="204" height="4" fill="rgba(180,83,9,0.15)" />
              {/* Bottom flange */}
              <rect x="200" y="303" width="204" height="4" fill="rgba(180,83,9,0.15)" />
              {/* OSB Web line */}
              <line x1="200" y1="295" x2="404" y2="295" stroke={strokeColor} strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />

              {/* Mud Sill */}
              <rect x="385" y="307" width="25" height="4" fill="rgba(180,83,9,0.1)" />
            </g>

            {/* --- WEATHER ENVELOPE LAYERS --- */}
            <g stroke={strokeColor} fill="none">
              {/* OSB Exterior Sheathing (Wall) */}
              <rect x="410" y="135" width="3" height="145" strokeWidth="1" fill="none" opacity="0.8" />

              {/* 10mm Wood Strapping (Rain-screen) */}
              <rect x="417" y="135" width="3" height="145" strokeWidth="1" fill="rgba(180,83,9,0.1)" />

              {/* Exterior Siding (Stair-step overlapping) */}
              <g strokeWidth="1" stroke={strokeColor}>
                {[...Array(12)].map((_, i) => {
                  const y = 135 + i * 13;
                  return <path key={i} d={`M 420 ${y} L 425 ${y + 10} L 420 ${y + 10}`} fill="none" />;
                })}
              </g>

              {/* Roof Sheathing (7/16" OSB) */}
              <line x1="140" y1="26" x2="510" y2="144" stroke={strokeColor} strokeWidth="2.5" />

              {/* Shingles and Underlayment */}
              <line x1="140" y1="22" x2="510" y2="140" stroke={strokeColor} strokeWidth="1.5" strokeDasharray="6 2" />
              
              {/* Fascia Board */}
              <rect x="510" y="141" width="5" height="24" strokeWidth="1.5" fill="none" />
              
              {/* Vented Soffit */}
              <line x1="410" y1="165" x2="510" y2="165" strokeWidth="1.5" strokeDasharray="4 3" />
            </g>

            {/* --- INTERACTIVE ENVELOPE ASSEMBLY LAYERS --- */}
            <g onClick={() => handleElementClick('envelope-layers')} className="cursor-pointer group">
              <rect x="410" y="135" width="20" height="160" fill="transparent" />
              {/* Tyvek Weather Barrier (Water-resistant, air-barrier) */}
              <line 
                x1="414" y1="135" x2="414" y2="280" 
                stroke={highlightedElement === 'Envelope Assembly Layers' ? "#fbbf24" : "#0ea5e9"} 
                strokeWidth={highlightedElement === 'Envelope Assembly Layers' ? "3.5" : "1.5"} 
                strokeDasharray="4,3" 
                className="group-hover:stroke-yellow-400"
              />
              <rect x="410" y="135" width="15" height="150" fill="none" stroke="transparent" strokeWidth="2" className="group-hover:stroke-blue-400/20" />
            </g>

            {/* --- INTERACTIVE VENTILATION ATTIC BAFFLE --- */}
            <g onClick={() => handleElementClick('ventilation-baffle')} className="cursor-pointer group">
              <path 
                d="M 412 163 Q 412 125 365 125" 
                fill="none" 
                stroke={highlightedElement === 'Attic Ventilation Baffles' ? "#fbbf24" : "#22c55e"} 
                strokeWidth={highlightedElement === 'Attic Ventilation Baffles' ? "4.5" : "2.5"} 
                className="group-hover:stroke-yellow-400"
              />
              <circle cx="412" cy="163" r="3.5" fill={highlightedElement === 'Attic Ventilation Baffles' ? "#fbbf24" : "#22c55e"} className="group-hover:fill-yellow-400" />
              <path d="M 412 163 Q 412 125 365 125" fill="none" stroke="transparent" strokeWidth="15" />
            </g>

            {/* --- INTERACTIVE FOUNDATION SILL GASKET --- */}
            <g onClick={() => handleElementClick('sill-gasket')} className="cursor-pointer group">
              <line 
                x1="385" y1="311" x2="410" y2="311" 
                stroke={highlightedElement === 'Foundation Sill Gasket' ? "#fbbf24" : "#ec4899"} 
                strokeWidth={highlightedElement === 'Foundation Sill Gasket' ? "4" : "2"} 
                className="group-hover:stroke-yellow-400"
              />
              <rect x="382" y="306" width="31" height="10" fill="transparent" />
            </g>

            {/* --- INTERACTIVE SILL PLATE ANCHOR BOLTS --- */}
            <g onClick={() => handleElementClick('anchor-bolt')} className="cursor-pointer group">
              <line 
                x1="395" y1="311" x2="395" y2="365" 
                stroke={highlightedElement === 'Sill Plate Anchor Bolts' ? "#fbbf24" : "#94a3b8"} 
                strokeWidth={highlightedElement === 'Sill Plate Anchor Bolts' ? "3.5" : "2"} 
                className="group-hover:stroke-yellow-400" 
              />
              <line 
                x1="395" y1="365" x2="405" y2="365" 
                stroke={highlightedElement === 'Sill Plate Anchor Bolts' ? "#fbbf24" : "#94a3b8"} 
                strokeWidth={highlightedElement === 'Sill Plate Anchor Bolts' ? "3.5" : "2"} 
                className="group-hover:stroke-yellow-400" 
              />
              <rect 
                x="391" y="305" width="8" height="3" 
                fill={highlightedElement === 'Sill Plate Anchor Bolts' ? "#fbbf24" : "#64748b"} 
                stroke={highlightedElement === 'Sill Plate Anchor Bolts' ? "#fbbf24" : strokeColor} 
                strokeWidth="0.5" 
                className="group-hover:fill-yellow-400 group-hover:stroke-yellow-400" 
              />
              <rect x="388" y="303" width="14" height="65" fill="transparent" />
            </g>

            {/* --- CONCRETE BASEMENT WALL, FOOTING, AND SLAB --- */}
            <g stroke={strokeColor} strokeWidth="1.5" fill="none">
              <rect x="385" y="311" width="25" height="99" fill="rgba(148,163,184,0.08)" />
              <rect x="200" y="410" width="185" height="8" fill="rgba(148,163,184,0.08)" />
              <rect x="367" y="418" width="61" height="22" fill="rgba(148,163,184,0.08)" />
              <circle cx="445" cy="428" r="8" fill="none" />
              <circle cx="445" cy="428" r="4" fill="none" strokeDasharray="2 1" />
            </g>

            {/* --- FINISHED GRADE LINE --- */}
            <line x1="410" y1="340" x2="750" y2="340" stroke="#22c55e" strokeWidth="4" />
            <g stroke="#22c55e" strokeWidth="1.2" opacity="0.5" pointerEvents="none">
              {[...Array(12)].map((_, i) => {
                const x = 430 + i * 27;
                return <line key={i} x1={x} y1="340" x2={x - 8} y2="352" />;
              })}
            </g>

            {/* --- LEADER LINES & CAD ANNOTATION CALLOUTS --- */}
            <g stroke={strokeColor} strokeWidth="1" fill="none" opacity="0.65">
              <circle cx="430" cy="80" r="2" fill={strokeColor} />
              <polyline points="430,80 530,80 545,80" />

              <circle cx="410" cy="105" r="2" fill={strokeColor} />
              <polyline points="410,105 530,105 545,105" />

              <circle cx="395" cy="115" r="2" fill={strokeColor} />
              <polyline points="395,115 230,115 215,115" />

              <circle cx="340" cy="60" r="2" fill={strokeColor} />
              <polyline points="340,60 230,60 215,60" />

              <circle cx="470" cy="155" r="2" fill={strokeColor} />
              <polyline points="470,155 530,155 545,155" />

              <circle cx="423" cy="180" r="2" fill={strokeColor} />
              <polyline points="423,180 530,180 545,180" />

              <circle cx="418" cy="205" r="2" fill={strokeColor} />
              <polyline points="418,205 530,205 545,205" />

              <circle cx="414" cy="230" r="2" fill={strokeColor} />
              <polyline points="414,230 530,230 545,230" />

              <circle cx="400" cy="210" r="2" fill={strokeColor} />
              <polyline points="400,210 230,210 215,210" />

              <circle cx="380" cy="281" r="2" fill={strokeColor} />
              <polyline points="380,281 230,281 215,281" />

              <circle cx="407" cy="295" r="2" fill={strokeColor} />
              <polyline points="407,295 530,295 545,295" />

              <circle cx="405" cy="311" r="2" fill={strokeColor} />
              <polyline points="405,311 530,311 545,311" />

              <circle cx="395" cy="325" r="2" fill={strokeColor} />
              <polyline points="395,325 230,325 215,325" />

              <circle cx="397" cy="360" r="2" fill={strokeColor} />
              <polyline points="397,360 530,360 545,360" />

              <circle cx="330" cy="410" r="2" fill={strokeColor} />
              <polyline points="330,410 230,410 215,410" />

              <circle cx="400" cy="428" r="2" fill={strokeColor} />
              <polyline points="400,428 530,428 545,428" />

              <circle cx="445" cy="428" r="2" fill={strokeColor} />
              <polyline points="445,428 530,442 545,442" />
            </g>

            {/* Callout Texts */}
            <g fill={textColor} fontSize="7" fontWeight="bold" className="font-mono">
              {/* Right Column Callouts */}
              <text x="550" y="83" textAnchor="start">ASPHALT SHINGLES OVER 15lb FELT UNDERLAYMENT</text>
              <text x="550" y="108" textAnchor="start">7/16" OSB SHEATHING WITH H-CLIPS</text>
              <text x="550" y="158" textAnchor="start">VENTED SOFFIT OVERHANG</text>
              <text x="550" y="183" textAnchor="start">4" VINYL SIDING W/ MIN 200mm CLEARANCE TO GRADE</text>
              <text x="550" y="208" textAnchor="start">10mm (3/8") VERTICAL STRAPPING (CAPILLARY BREAK)</text>
              <text x="550" y="233" textAnchor="start">TYVEK SARKING MEMBRANE (WEATHER BARRIER)</text>
              <text x="550" y="298" textAnchor="start">11-7/8" SOLID RIM BOARD</text>
              <text x="550" y="314" textAnchor="start">CONTINUOUS FOAM SILL GASKET (AIR SEAL)</text>
              <text x="550" y="363" textAnchor="start">8" POURED CONCRETE FOUNDATION WALL</text>
              <text x="550" y="431" textAnchor="start">10" x 20" CONCRETE FOOTING</text>
              <text x="550" y="445" textAnchor="start">4" PERFORATED WEEPING TILE W/ CRUSHED STONE</text>

              {/* Left Column Callouts */}
              <text x="210" y="118" textAnchor="end">CONTINUOUS VENTILATION BAFFLE (NBC 9.19.1.1)</text>
              <text x="210" y="63" textAnchor="end">ENGINEERED ROOF TRUSS TOP CHORD @ 24" O.C.</text>
              <text x="210" y="213" textAnchor="end">2x6 WOOD FRAMING STUDS @ 16" O.C. W/ R-24 BATT</text>
              <text x="210" y="284" textAnchor="end">3/4" T&G SUBFLOOR GLUED & SCREWED</text>
              <text x="210" y="328" textAnchor="end">1/2" ANCHOR BOLT @ 2.4m O.C. (NBC 9.23.6.1)</text>
              <text x="210" y="413" textAnchor="end">4" CONCRETE BASEMENT SLAB OVER POLY</text>
            </g>

            {/* --- VERTICAL HEIGHT DATUMS --- */}
            <g className="opacity-80">
              {[
                { label: 'PEAK OF ROOF', el: 'EL. 118\'-6"', y: 30 },
                { label: 'T.O. WALL PLATE', el: 'EL. 107\'-2"', y: 135 },
                { label: 'FINISHED GRADE', el: 'EL. 96\'-0"', y: 340 },
                { label: 'T.O. FOOTING', el: 'EL. 90\'-0"', y: 418 }
              ].map((datum, idx) => (
                <g key={idx} transform={`translate(60, ${datum.y})`} className="group cursor-pointer" onClick={() => handleElementClick('height-marker')}>
                  <line x1="-30" y1="0" x2="60" y2="0" stroke={strokeColor} strokeWidth="1" strokeDasharray="3,3" />
                  <g transform="translate(60, 0)">
                    <circle cx="0" cy="0" r="5" fill="none" stroke={strokeColor} strokeWidth="1" />
                    <line x1="-8" y1="0" x2="8" y2="0" stroke={strokeColor} strokeWidth="0.8" />
                    <line x1="0" y1="-8" x2="0" y2="8" stroke={strokeColor} strokeWidth="0.8" />
                    <text x="12" y="3" fill={textColor} fontSize="7" fontWeight="bold" className="font-mono">{datum.label} ({datum.el})</text>
                  </g>
                </g>
              ))}
            </g>

            {/* Search matches */}
            {/* Title Block on Bottom/Right */}
            <g 
              transform="translate(520, 365)" 
              stroke={isLight ? '#1e293b' : '#38bdf8'} 
              strokeWidth="1.5"
              className="cursor-pointer"
              onClick={() => handleElementClick('title-block')}
            >
              <rect width="260" height="115" fill={isLight ? '#f8fafc' : '#1e3a5f'} rx="4" />
              <text x="15" y="25" fill={isLight ? '#0f172a' : '#ffffff'} fontSize="11" fontWeight="bold" stroke="none">PROJECT: RSR-2026</text>
              <text x="15" y="48" fill={isLight ? '#0f172a' : '#38bdf8'} fontSize="10" fontWeight="black" stroke="none">DWG: A3.0 - SECTION DETAIL</text>
              <text x="15" y="70" fill={isLight ? '#0f172a' : '#ffffff'} fontSize="10" stroke="none">SCALE: 1/2" = 1'-0" (HIGH-FIDELITY)</text>
              <text x="15" y="92" fill="#10b981" fontSize="9" fontWeight="extrabold" stroke="none">★ A/S ENVELOPE CROSS-SECTION</text>
            </g>

            {/* Radar / Pulse Highlight Overlay */}
            {highlightedElement === 'Envelope Assembly Layers' && (
              <g pointerEvents="none">
                <circle cx="414" cy="210" r="20" fill="none" stroke="#f59e0b" strokeWidth="3">
                  <animate attributeName="r" values="15;60" dur="1.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="1;0" dur="1.5s" repeatCount="indefinite" />
                </circle>
              </g>
            )}
            {highlightedElement === 'Attic Ventilation Baffles' && (
              <g pointerEvents="none">
                <circle cx="395" cy="135" r="20" fill="none" stroke="#f59e0b" strokeWidth="3">
                  <animate attributeName="r" values="15;60" dur="1.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="1;0" dur="1.5s" repeatCount="indefinite" />
                </circle>
              </g>
            )}
            {highlightedElement === 'Foundation Sill Gasket' && (
              <g pointerEvents="none">
                <circle cx="395" cy="311" r="20" fill="none" stroke="#f59e0b" strokeWidth="3">
                  <animate attributeName="r" values="15;60" dur="1.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="1;0" dur="1.5s" repeatCount="indefinite" />
                </circle>
              </g>
            )}
            {highlightedElement === 'Sill Plate Anchor Bolts' && (
              <g pointerEvents="none">
                <circle cx="395" cy="335" r="20" fill="none" stroke="#f59e0b" strokeWidth="3">
                  <animate attributeName="r" values="15;60" dur="1.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="1;0" dur="1.5s" repeatCount="indefinite" />
                </circle>
              </g>
            )}
          </svg>
        )
      } else if (bp.id === 'bp-04') {
        content = (
          <svg viewBox="0 0 800 500" width="100%" height="100%" className="w-full h-full select-none">
            {/* Background based on theme */}
            <rect width="800" height="500" fill={isClassic ? '#0f2b48' : (isCad ? '#111827' : '#fafafa')} />
            
            {/* Grid lines */}
            <g stroke={isClassic ? 'rgba(255,255,255,0.04)' : (isCad ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)')} strokeWidth="1">
              {Array.from({ length: 16 }).map((_, i) => (
                <line key={`v-${i}`} x1={i * 50} y1="0" x2={i * 50} y2="500" />
              ))}
              {Array.from({ length: 10 }).map((_, i) => (
                <line key={`h-${i}`} x1="0" y1={i * 50} x2="800" y2={i * 50} />
              ))}
            </g>

            {/* Border line */}
            <rect x="20" y="20" width="760" height="460" fill="none" stroke={isLight ? '#1e293b' : '#38bdf8'} strokeWidth="2" strokeDasharray={isLight ? 'none' : '4 4'} />

            {/* Architectural Faint Overlay */}
            <g opacity="0.25" stroke={isLight ? '#475569' : '#ffffff'} strokeWidth="1">
              <rect x="150" y="100" width="400" height="260" fill="none" />
              <line x1="300" y1="100" x2="300" y2="360" strokeDasharray="3,3" />
            </g>

            {/* --- PLUMBING ISOMETRIC SCHEMATIC (3D RISER) --- */}
            <g>
              {/* Main Roof Vent Terminal (3" Roof Peak Penetration) */}
              <g onClick={() => handleElementClick('plumbing-riser-venting')} className="cursor-pointer group">
                <line x1="330" y1="40" x2="430" y2="40" stroke={isLight ? '#1e293b' : '#38bdf8'} strokeWidth="1" strokeDasharray="4,4" opacity="0.4" />
                <text x="380" y="35" fill={isLight ? '#0f172a' : '#ffffff'} fontSize="6" fontWeight="bold" textAnchor="middle" opacity="0.6">ROOF PEAK PENETRATION</text>
                
                <line x1="380" y1="20" x2="380" y2="55" stroke="#0ea5e9" strokeWidth="2.5" strokeDasharray="3,3" className="group-hover:stroke-yellow-400" />
                <text x="390" y="28" fill="#0ea5e9" fontSize="7.5" fontWeight="black" className="font-mono group-hover:fill-yellow-400">3" VENT TERMINAL (V)</text>
                
                <polygon points="370,40 390,40 380,32" fill={isLight ? '#475569' : '#94a3b8'} className="group-hover:fill-yellow-400" />
                <circle cx="380" cy="35" r="25" fill="transparent" />
              </g>

              {/* Main Vent Stack (Thinner sky blue dashed line marked 'V') */}
              <g onClick={() => handleElementClick('plumbing-riser-venting')} className="cursor-pointer group">
                <line x1="380" y1="55" x2="380" y2="250" stroke="#0ea5e9" strokeWidth="2.5" strokeDasharray="3,3" className="group-hover:stroke-yellow-400" />
                <circle cx="380" cy="85" r="5.5" fill={isLight ? '#ffffff' : '#111827'} stroke="#0ea5e9" strokeWidth="1" />
                <text x="380" y="87.5" fill="#0ea5e9" fontSize="7" fontWeight="black" textAnchor="middle" className="font-mono">V</text>

                <circle cx="380" cy="140" r="5.5" fill={isLight ? '#ffffff' : '#111827'} stroke="#0ea5e9" strokeWidth="1" />
                <text x="380" y="142.5" fill="#0ea5e9" fontSize="7" fontWeight="black" textAnchor="middle" className="font-mono">V</text>

                <text x="392" y="115" fill={isLight ? '#0f172a' : '#ffffff'} fontSize="7.5" fontWeight="bold" className="font-mono group-hover:fill-yellow-400">3" ABS MAIN VENT STACK</text>
                <rect x="365" y="55" width="30" height="195" fill="transparent" />
              </g>

              {/* 3" ABS Soil Waste Stack (Thicker solid royal blue line marked 'S') */}
              <g onClick={() => handleElementClick('plumbing-chase-framing')} className="cursor-pointer group">
                <line x1="380" y1="250" x2="380" y2="360" stroke="#2563eb" strokeWidth="4.5" className="group-hover:stroke-yellow-400" />
                
                <circle cx="380" cy="275" r="5.5" fill={isLight ? '#ffffff' : '#111827'} stroke="#2563eb" strokeWidth="1.5" />
                <text x="380" y="277.5" fill="#2563eb" fontSize="7" fontWeight="black" textAnchor="middle" className="font-mono">S</text>

                <circle cx="380" cy="330" r="5.5" fill={isLight ? '#ffffff' : '#111827'} stroke="#2563eb" strokeWidth="1.5" />
                <text x="380" y="332.5" fill="#2563eb" fontSize="7" fontWeight="black" textAnchor="middle" className="font-mono">S</text>

                <text x="392" y="305" fill={isLight ? '#0f172a' : '#ffffff'} fontSize="7.5" fontWeight="bold" className="font-mono group-hover:fill-yellow-400">3" ABS SOIL STACK (NBC 9.23.5.3)</text>
                <rect x="365" y="250" width="30" height="110" fill="transparent" />
              </g>

              {/* 4" ABS Main Building Drain (Thickest sloped solid blue line) */}
              <g onClick={() => handleElementClick('plumbing-chase-framing')} className="cursor-pointer group">
                <line x1="380" y1="360" x2="210" y2="410" stroke="#1e40af" strokeWidth="6" strokeLinecap="round" className="group-hover:stroke-yellow-400" />
                
                <circle cx="210" cy="410" r="5" fill="#ef4444" className="group-hover:fill-yellow-400" />
                <line x1="210" y1="405" x2="210" y2="415" stroke="#ffffff" strokeWidth="1.5" />
                <text x="180" y="400" fill="#ef4444" fontSize="7" fontWeight="extrabold" className="font-mono group-hover:fill-yellow-400">4" CLEANOUT (C.O.)</text>
                
                <text x="245" y="385" fill={isLight ? '#0f172a' : '#ffffff'} fontSize="8" fontWeight="bold" className="font-mono group-hover:fill-yellow-400" transform="rotate(-16.3 245 385)">
                  4" ABS BUILDING DRAIN @ MIN 2% SLOPE
                </text>
                <rect x="200" y="355" width="190" height="65" fill="transparent" transform="rotate(-16.3 295 387)" />
              </g>

              {/* --- FIXTURE A: KITCHEN SINK (Left side of stack) --- */}
              <g onClick={() => handleElementClick('plumbing-riser-venting')} className="cursor-pointer group">
                <rect x="220" y="170" width="28" height="18" fill="rgba(255,255,255,0.05)" stroke={isLight ? '#1e293b' : '#38bdf8'} strokeWidth="1" strokeDasharray="2,2" />
                <path d="M 220 178 L 248 178 M 234 170 L 234 188" stroke={isLight ? '#1e293b' : '#38bdf8'} strokeWidth="0.5" strokeDasharray="1,2" />
                <text x="234" y="165" fill={isLight ? '#0f172a' : '#ffffff'} fontSize="7.5" fontWeight="bold" textAnchor="middle" className="font-mono">KITCHEN SINK (KS)</text>
                
                <line x1="234" y1="188" x2="234" y2="200" stroke="#2563eb" strokeWidth="3" className="group-hover:stroke-yellow-400" />
                <path d="M 234 200 Q 234 210 240 210 Q 246 210 246 200" fill="none" stroke="#2563eb" strokeWidth="3.5" className="group-hover:stroke-yellow-400" />
                <line x1="246" y1="200" x2="246" y2="195" stroke="#2563eb" strokeWidth="3" className="group-hover:stroke-yellow-400" />
                <text x="252" y="212" fill="#2563eb" fontSize="6.5" fontWeight="extrabold" className="group-hover:fill-yellow-400">1-1/2" P-TRAP</text>
                
                <line x1="246" y1="195" x2="310" y2="215" stroke="#2563eb" strokeWidth="3.5" className="group-hover:stroke-yellow-400" />
                <line x1="310" y1="215" x2="380" y2="250" stroke="#2563eb" strokeWidth="3.5" className="group-hover:stroke-yellow-400" />
                
                <line x1="246" y1="195" x2="246" y2="120" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="3,3" className="group-hover:stroke-yellow-400" />
                <line x1="246" y1="120" x2="380" y2="120" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="3,3" className="group-hover:stroke-yellow-400" />
                <text x="250" y="115" fill="#0ea5e9" fontSize="6" fontWeight="bold" className="font-mono">1-1/2" RE-VENT LOOP (V)</text>
                
                <rect x="215" y="110" width="165" height="110" fill="transparent" />
              </g>

              {/* --- FIXTURE B: TOILET / WATER CLOSET (Right side of stack) --- */}
              <g onClick={() => handleElementClick('plumbing-riser-venting')} className="cursor-pointer group">
                <rect x="470" y="205" width="22" height="15" fill="rgba(255,255,255,0.05)" stroke={isLight ? '#1e293b' : '#38bdf8'} strokeWidth="1" strokeDasharray="2,2" />
                <ellipse cx="481" cy="226" rx="11" ry="6" fill="none" stroke={isLight ? '#1e293b' : '#38bdf8'} strokeWidth="1" strokeDasharray="2,2" />
                <ellipse cx="481" cy="226" rx="7" ry="4" fill="none" stroke={isLight ? '#1e293b' : '#38bdf8'} strokeWidth="0.5" strokeDasharray="2,2" />
                <text x="498" y="214" fill={isLight ? '#0f172a' : '#ffffff'} fontSize="7.5" fontWeight="bold" className="font-mono">WC / TOILET</text>
                
                <line x1="481" y1="232" x2="481" y2="255" stroke="#2563eb" strokeWidth="4" className="group-hover:stroke-yellow-400" />
                <path d="M 481 255 Q 481 262 487 262 Q 493 262 493 255" fill="none" stroke="#2563eb" strokeWidth="4" className="group-hover:stroke-yellow-400" />
                
                <line x1="493" y1="255" x2="380" y2="300" stroke="#2563eb" strokeWidth="4" className="group-hover:stroke-yellow-400" />
                <text x="430" y="285" fill="#2563eb" fontSize="6.5" fontWeight="bold" className="font-mono group-hover:fill-yellow-400">3" FIXTURE DRAIN ARM</text>
                
                <line x1="481" y1="245" x2="481" y2="160" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="3,3" className="group-hover:stroke-yellow-400" />
                <line x1="481" y1="160" x2="380" y2="160" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="3,3" className="group-hover:stroke-yellow-400" />
                <text x="415" y="155" fill="#0ea5e9" fontSize="6.5" fontWeight="bold" className="font-mono group-hover:fill-yellow-400">2" TOILET VENT LINE (V)</text>
                
                <rect x="380" y="150" width="115" height="120" fill="transparent" />
              </g>

              {/* --- FIXTURE C: SHOWER / BATHTUB (Far Right side) --- */}
              <g onClick={() => handleElementClick('plumbing-riser-venting')} className="cursor-pointer group">
                <rect x="520" y="260" width="30" height="30" fill="none" stroke={isLight ? '#1e293b' : '#38bdf8'} strokeWidth="1" strokeDasharray="2,2" />
                <line x1="520" y1="260" x2="550" y2="290" stroke={isLight ? '#1e293b' : '#38bdf8'} strokeWidth="0.5" strokeDasharray="2,2" />
                <line x1="520" y1="290" x2="550" y2="260" stroke={isLight ? '#1e293b' : '#38bdf8'} strokeWidth="0.5" strokeDasharray="2,2" />
                <text x="535" y="255" fill={isLight ? '#0f172a' : '#ffffff'} fontSize="7.5" fontWeight="bold" textAnchor="middle" className="font-mono">SHOWER (SH)</text>
                
                <line x1="535" y1="290" x2="535" y2="302" stroke="#2563eb" strokeWidth="3" className="group-hover:stroke-yellow-400" />
                <path d="M 535 302 Q 535 312 541 312 Q 547 312 547 302" fill="none" stroke="#2563eb" strokeWidth="3.5" className="group-hover:stroke-yellow-400" />
                <line x1="547" y1="302" x2="547" y2="298" stroke="#2563eb" strokeWidth="3" className="group-hover:stroke-yellow-400" />
                <text x="552" y="314" fill="#2563eb" fontSize="6.5" fontWeight="extrabold" className="group-hover:fill-yellow-400">2" P-TRAP (NBC 7.2)</text>
                
                <line x1="547" y1="298" x2="380" y2="340" stroke="#2563eb" strokeWidth="3.5" className="group-hover:stroke-yellow-400" />
                
                <line x1="547" y1="298" x2="547" y2="200" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="3,3" className="group-hover:stroke-yellow-400" />
                <line x1="547" y1="200" x2="380" y2="200" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="3,3" className="group-hover:stroke-yellow-400" />
                <text x="415" y="195" fill="#0ea5e9" fontSize="6.5" fontWeight="bold" className="font-mono group-hover:fill-yellow-400">1-1/2" SHOWER VENT (V)</text>
                
                <rect x="380" y="190" width="180" height="130" fill="transparent" />
              </g>

              {/* --- DETAILED RADON-SEALED SUMP PIT (Basement floor left) --- */}
              <g onClick={() => handleElementClick('sump-pit-seal')} className="cursor-pointer group">
                <rect x="155" y="430" width="50" height="55" rx="4" fill="rgba(244,63,94,0.04)" stroke={isLight ? '#1e293b' : '#38bdf8'} strokeWidth="1" strokeDasharray="3,3" className="group-hover:fill-red-400/10" />
                <ellipse cx="180" cy="430" rx="28" ry="10" fill="none" stroke={isLight ? '#1e293b' : '#38bdf8'} strokeWidth="1" />
                
                <ellipse cx="180" cy="430" rx="24" ry="8" fill={isLight ? '#cbd5e1' : '#1e3a5f'} stroke="#ef4444" strokeWidth="3" className="group-hover:stroke-yellow-400 group-hover:fill-red-500/10 transition-all" />
                <text x="180" y="432" fill="#ef4444" fontSize="5.5" fontWeight="black" textAnchor="middle" className="font-mono group-hover:fill-yellow-400"> airtight lid </text>
                
                <circle cx="160" cy="430" r="1.5" fill="#ef4444" className="group-hover:fill-yellow-400" />
                <circle cx="200" cy="430" r="1.5" fill="#ef4444" className="group-hover:fill-yellow-400" />
                <circle cx="180" cy="424" r="1.5" fill="#ef4444" className="group-hover:fill-yellow-400" />
                <circle cx="180" cy="436" r="1.5" fill="#ef4444" className="group-hover:fill-yellow-400" />
                
                <line x1="172" y1="430" x2="172" y2="380" stroke="#3b82f6" strokeWidth="2.5" className="group-hover:stroke-yellow-400" />
                <line x1="172" y1="380" x2="120" y2="380" stroke="#3b82f6" strokeWidth="2.5" className="group-hover:stroke-yellow-400" />
                <rect x="169" y="390" width="6" height="12" fill="#2563eb" stroke="#ffffff" strokeWidth="0.5" />
                <text x="162" y="398" fill="#3b82f6" fontSize="6" fontWeight="bold" textAnchor="end" className="font-mono">1-1/2" DISCHARGE</text>
                
                <line x1="188" y1="430" x2="188" y2="385" stroke="#f97316" strokeWidth="2" strokeDasharray="3,2" className="group-hover:stroke-yellow-400" />
                <line x1="188" y1="385" x2="140" y2="385" stroke="#f97316" strokeWidth="2" strokeDasharray="3,2" className="group-hover:stroke-yellow-400" />
                <text x="194" y="392" fill="#f97316" fontSize="6.5" fontWeight="bold" className="font-mono group-hover:fill-yellow-400">ACTIVE RADON VENT</text>
                
                <text x="125" y="455" fill="#ef4444" fontSize="8" fontWeight="black" textAnchor="end" className="font-mono group-hover:fill-yellow-400"> airtight radon seal </text>
                <text x="125" y="464" fill={isLight ? '#0f172a' : '#ffffff'} fontSize="6.5" textAnchor="end" className="font-mono opacity-80">SUMP BASIN (NBC 9.25.1.2)</text>
                
                <path d="M 130 452 L 160 435" stroke="#ef4444" strokeWidth="0.75" />
                
                <rect x="120" y="370" width="115" height="115" fill="transparent" />
              </g>
            </g>

            {/* Search matches */}
            {/* Title Block on Bottom/Right */}
            <g 
              transform="translate(520, 340)" 
              stroke={isLight ? '#1e293b' : '#38bdf8'} 
              strokeWidth="1.5"
              className="cursor-pointer"
              onClick={() => handleElementClick('title-block')}
            >
              <rect width="260" height="140" fill={isLight ? '#f8fafc' : '#1e3a5f'} rx="4" />
              <text x="15" y="30" fill={isLight ? '#0f172a' : '#ffffff'} fontSize="14" fontWeight="bold">PROJECT: RSR-2026</text>
              <text x="15" y="60" fill={isLight ? '#0f172a' : '#38bdf8'} fontSize="12" fontWeight="black">DWG: P1.0 - PLUMBING RISER / ELEC</text>
              <text x="15" y="90" fill={isLight ? '#0f172a' : '#ffffff'} fontSize="12">SCALE: 1/4" = 1'-0"</text>
              <text x="15" y="115" fill="#ef4444" fontSize="11" fontWeight="extrabold">★ PLUMBING RISER & ELEC PLAN</text>
            </g>

            {/* Radar / Pulse Highlight Overlay */}
            {highlightedElement === 'Plumbing Riser Venting' && (
              <g pointerEvents="none">
                <circle cx="380" cy="140" r="25" fill="none" stroke="#f59e0b" strokeWidth="3.5">
                  <animate attributeName="r" values="15;65" dur="1.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="1;0" dur="1.5s" repeatCount="indefinite" />
                </circle>
              </g>
            )}
            {highlightedElement === 'Sump Pit Radon Seal' && (
              <g pointerEvents="none">
                <circle cx="180" cy="430" r="25" fill="none" stroke="#f59e0b" strokeWidth="3.5">
                  <animate attributeName="r" values="15;65" dur="1.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="1;0" dur="1.5s" repeatCount="indefinite" />
                </circle>
              </g>
            )}
          </svg>
        )
      } else if (bp.id === 'bp-05') {
        content = (
          <svg viewBox="0 0 800 500" width="100%" height="100%" className="w-full h-full select-none">
            {/* Background based on theme */}
            <rect width="800" height="500" fill={isClassic ? '#0f2b48' : (isCad ? '#111827' : '#fafafa')} />
            
            {/* Grid lines */}
            <g stroke={isClassic ? 'rgba(255,255,255,0.04)' : (isCad ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)')} strokeWidth="1">
              {Array.from({ length: 16 }).map((_, i) => (
                <line key={`v-${i}`} x1={i * 50} y1="0" x2={i * 50} y2="500" />
              ))}
              {Array.from({ length: 10 }).map((_, i) => (
                <line key={`h-${i}`} x1="0" y1={i * 50} x2="800" y2={i * 50} />
              ))}
            </g>

            {/* Border line */}
            <rect x="20" y="20" width="760" height="460" fill="none" stroke={isLight ? '#1e293b' : '#38bdf8'} strokeWidth="2" strokeDasharray={isLight ? 'none' : '4 4'} />

            {/* Faint Architectural underlay */}
            <g opacity="0.15" stroke={isLight ? '#475569' : '#ffffff'} strokeWidth="1.5">
              <rect x="150" y="100" width="400" height="260" fill="none" />
              <rect x="297" y="106" width="8" height="248" fill="none" />
            </g>

            {/* Primary Bearing Beam */}
            <line x1="144" y1="230" x2="556" y2="230" stroke="#f43f5e" strokeWidth="6" />
            <text x="350" y="222" fill="#f43f5e" fontSize="10" fontWeight="black" textAnchor="middle">3-PLY 11-7/8" LVL BEAM (PRIMARY SUPPORT)</text>

            {/* Engineered I-Joists Field */}
            {/* Top half floor joists */}
            {Array.from({ length: 13 }).map((_, i) => {
              const x = 170 + i * 30;
              return (
                <g key={`joist-t-${i}`}>
                  <line x1={x} y1="100" x2={x} y2="235" stroke="#f59e0b" strokeWidth="2.5" />
                  <line x1={x - 2} y1="100" x2={x - 2} y2="235" stroke="#b45309" strokeWidth="0.5" />
                  <line x1={x + 2} y1="100" x2={x + 2} y2="235" stroke="#b45309" strokeWidth="0.5" />
                </g>
              );
            })}

            {/* Bottom half floor joists - offset to represent splice lap */}
            {Array.from({ length: 13 }).map((_, i) => {
              const x = 170 + i * 30 + 5; // Spliced offset
              return (
                <g key={`joist-b-${i}`}>
                  <line x1={x} y1="225" x2={x} y2="360" stroke="#f59e0b" strokeWidth="2.5" />
                  <line x1={x - 2} y1="225" x2={x - 2} y2="360" stroke="#b45309" strokeWidth="0.5" />
                  <line x1={x + 2} y1="225" x2={x + 2} y2="360" stroke="#b45309" strokeWidth="0.5" />
                </g>
              );
            })}

            {/* Rim Joists */}
            <rect x="146" y="96" width="408" height="6" fill="#b45309" opacity="0.9" />
            <rect x="146" y="358" width="408" height="6" fill="#b45309" opacity="0.9" />
            <rect x="146" y="100" width="6" height="260" fill="#b45309" opacity="0.9" />
            <rect x="548" y="100" width="6" height="260" fill="#b45309" opacity="0.9" />

            {/* Midspan Blocking */}
            <g 
              onClick={() => handleElementClick('blocking-midspan')}
              className="cursor-pointer group"
            >
              <line x1="150" y1="165" x2="550" y2="165" stroke={highlightedElement === 'Midspan Blocking' ? "#fbbf24" : "#ef4444"} strokeWidth="3" strokeDasharray="10,15" className="group-hover:stroke-yellow-400" />
              <line x1="150" y1="295" x2="550" y2="295" stroke={highlightedElement === 'Midspan Blocking' ? "#fbbf24" : "#ef4444"} strokeWidth="3" strokeDasharray="10,15" className="group-hover:stroke-yellow-400" />
              <text x="350" y="157" fill={isLight ? '#ef4444' : '#f87171'} fontSize="8" fontWeight="black" textAnchor="middle" className="group-hover:fill-yellow-400 font-mono">11-7/8" SOLID BLOCKING MIDSPAN (NBC 9.23.9.4)</text>
              <text x="350" y="310" fill={isLight ? '#ef4444' : '#f87171'} fontSize="8" fontWeight="black" textAnchor="middle" className="group-hover:fill-yellow-400 font-mono">11-7/8" SOLID BLOCKING MIDSPAN (NBC 9.23.9.4)</text>
            </g>

            {/* Joist Direction Arrow */}
            <g 
              onClick={() => handleElementClick('joist-span-arrow')}
              className="cursor-pointer group"
            >
              {/* Massive double-ended vertical arrow at x = 470 */}
              <line x1="470" y1="120" x2="470" y2="340" stroke={highlightedElement === 'Joist Span Arrow' ? "#fbbf24" : "#10b981"} strokeWidth="3" className="group-hover:stroke-yellow-400" />
              <polygon points="470,120 465,132 475,132" fill={highlightedElement === 'Joist Span Arrow' ? "#fbbf24" : "#10b981"} className="group-hover:fill-yellow-400" />
              <polygon points="470,340 465,328 475,328" fill={highlightedElement === 'Joist Span Arrow' ? "#fbbf24" : "#10b981"} className="group-hover:fill-yellow-400" />
              <rect x="440" y="110" width="60" height="240" fill="transparent" />
              
              <g transform="translate(480, 230) rotate(-90)">
                <text x="0" y="0" fill={highlightedElement === 'Joist Span Arrow' ? "#fbbf24" : (isLight ? '#0f172a' : '#ffffff')} fontSize="9.5" fontWeight="black" textAnchor="middle" className="group-hover:fill-yellow-400 font-mono">
                  JOIST SPAN DIRECTION -&gt; T.O.F. BEARING POINTS
                </text>
              </g>
            </g>

            {/* Metal Hanger Symbol & Detail */}
            <g 
              onClick={() => handleElementClick('joist-hanger')}
              className="cursor-pointer group"
            >
              {/* Metal hanger at x = 350, y = 230 */}
              <path d="M 346 222 L 346 238 L 359 238 L 359 222" fill="none" stroke={highlightedElement === 'Metal Joist Hangers' ? "#fbbf24" : "#64748b"} strokeWidth="3" className="group-hover:stroke-yellow-400" />
              {/* Detail circle referencing 5 / A6.1 */}
              <circle cx="352" cy="230" r="15" fill="none" stroke={highlightedElement === 'Metal Joist Hangers' ? "#fbbf24" : "#38bdf8"} strokeWidth="1.5" strokeDasharray="3 2" className="group-hover:stroke-yellow-400" />
              
              {/* Special detail bubble / callout symbol */}
              <g transform="translate(385, 205)">
                <circle cx="0" cy="0" r="14" fill={isLight ? '#f1f5f9' : '#1e293b'} stroke={isLight ? '#0f172a' : '#38bdf8'} strokeWidth="1.5" />
                <line x1="-14" y1="0" x2="14" y2="0" stroke={isLight ? '#0f172a' : '#38bdf8'} strokeWidth="1" />
                <text x="0" y="-3" fill={isLight ? '#0f172a' : '#ffffff'} fontSize="8" fontWeight="black" textAnchor="middle">5</text>
                <text x="0" y="9" fill={isLight ? '#0f172a' : '#ffffff'} fontSize="7" fontWeight="bold" textAnchor="middle">A6.1</text>
              </g>

              <text x="310" y="260" fill={isLight ? '#475569' : '#94a3b8'} fontSize="7.5" fontWeight="bold" className="group-hover:fill-yellow-400 font-mono">
                LUS28-2 HANGER OR EQ.
              </text>
            </g>

            {/* Search matches */}
            {/* Title Block on Bottom/Right */}
            <g 
              transform="translate(520, 340)" 
              stroke={isLight ? '#1e293b' : '#38bdf8'} 
              strokeWidth="1.5"
              className="cursor-pointer"
              onClick={() => handleElementClick('title-block')}
            >
              <rect width="260" height="140" fill={isLight ? '#f8fafc' : '#1e3a5f'} rx="4" />
              <text x="15" y="30" fill={isLight ? '#0f172a' : '#ffffff'} fontSize="14" fontWeight="bold">PROJECT: RSR-2026</text>
              <text x="15" y="60" fill={isLight ? '#0f172a' : '#38bdf8'} fontSize="12" fontWeight="black">DWG: S1.0 - FRAMING PLAN</text>
              <text x="15" y="90" fill={isLight ? '#0f172a' : '#ffffff'} fontSize="12">SCALE: 1/4" = 1'-0"</text>
              <text x="15" y="115" fill="#f59e0b" fontSize="11" fontWeight="extrabold">★ STRUCTURAL FLOOR FRAMING</text>
            </g>

            {/* Radar highlights */}
            {highlightedElement === 'Joist Span Arrow' && (
              <g pointerEvents="none">
                <circle cx="470" cy="230" r="15" fill="none" stroke="#f59e0b" strokeWidth="3">
                  <animate attributeName="r" values="10;50" dur="1.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="1;0" dur="1.5s" repeatCount="indefinite" />
                </circle>
              </g>
            )}
            {highlightedElement === 'Midspan Blocking' && (
              <g pointerEvents="none">
                <circle cx="350" cy="165" r="15" fill="none" stroke="#f59e0b" strokeWidth="3">
                  <animate attributeName="r" values="10;50" dur="1.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="1;0" dur="1.5s" repeatCount="indefinite" />
                </circle>
              </g>
            )}
            {highlightedElement === 'Metal Joist Hangers' && (
              <g pointerEvents="none">
                <circle cx="352" cy="230" r="15" fill="none" stroke="#f59e0b" strokeWidth="3">
                  <animate attributeName="r" values="10;50" dur="1.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="1;0" dur="1.5s" repeatCount="indefinite" />
                </circle>
              </g>
            )}
          </svg>
        )
      }
      return {
        page: index + 1,
        title: bp.title,
        scale,
        description: bp.description,
        keyTakeaways: [
          ...(bp.keyTakeaways ? bp.keyTakeaways.map(kt => ({
            title: kt.title || kt.element || "",
            description: kt.description || kt.explanation || "",
            code: kt.code || "NBC Section 9.3.1.1",
            examFocus: kt.examFocus || "Identify drawing control mechanisms and structural dimensions."
          })) : []),
          ...ALL_INTERACTIVE_TAKEAWAYS.filter(item => {
            const isAlreadyPresent = (bp.keyTakeaways || []).some(kt => (kt.title || kt.element || "").toLowerCase().includes(item.title.toLowerCase()));
            if (isAlreadyPresent) return false;
            
            if (bp.id === 'bp-07') {
              return false; // Keep only the explicit takeaways in bp-07
            }
            if (bp.id === 'bp-08') {
              const allowed = ["ROOF PITCH", "EAVES PROTECTION", "BIRDSMOUTH BEARING", "MINIMUM ROOF SLOPE"];
              return allowed.some(a => a.toLowerCase() === item.title.toLowerCase());
            }
            if (bp.id === 'bp-09') {
              const allowed = ["BEDROOM EGRESS WINDOWS"];
              return allowed.some(a => a.toLowerCase() === item.title.toLowerCase());
            }
            if (bp.id === 'bp-10') {
              const allowed = ["HEADROOM CLEARANCE", "STRINGER ATTACHMENT", "HANDRAIL HEIGHT", "GUARDS & HANDRAILS", "STRINGER EFFECTIVE DEPTH", "RISE & RUN TOLERANCES", "STAIRCASE SYMBOLS"];
              return allowed.some(a => a.toLowerCase() === item.title.toLowerCase());
            }
            if (bp.id === 'bp-01') {
              const allowed = ["ISSUED FOR CONSTRUCTION", "REVISION BLOCK", "DIMENSION HIERARCHY", "LOAD-BEARING PARTITION", "NON-BEARING PARTITION", "PLUMBING CHASE FRAMING", "WINDOW ROUGH OPENING", "STAIR RISE & RUN", "SECTION MARKS", "DIMENSION STRINGS", "WINDOW SYMBOLS", "DOOR SYMBOLS", "STAIRCASE SYMBOLS"];
              return allowed.some(a => a.toLowerCase() === item.title.toLowerCase());
            }
            if (bp.id === 'bp-02') {
              const allowed = ["PAD FOOTING", "FOUNDATION WALLS", "REBAR SPACING", "DAMP-PROOFING", "REVISION BLOCK", "WEEPING TILE DRAINAGE", "STEP FOOTINGS", "SUMP PIT RADON SEAL", "FROST DEPTH FOUNDATIONS"];
              return allowed.some(a => a.toLowerCase() === item.title.toLowerCase());
            }
            if (bp.id === 'bp-03') {
              const allowed = ["ENVELOPE ASSEMBLY LAYERS", "ATTIC VENTILATION BAFFLES", "FOUNDATION SILL GASKET", "SILL PLATE ANCHOR BOLTS", "6-MIL POLY VAPOUR BARRIER", "OSB NAILING PATTERN", "BASE FLASHING & WEEPHOLES", "REVISION BLOCK", "HEIGHT DATUMS", "RAIN SCREEN CLADDING", "WEEPING TILE DRAINAGE"];
              return allowed.some(a => a.toLowerCase() === item.title.toLowerCase());
            }
            if (bp.id === 'bp-04') {
              const allowed = ["ELECTRICAL PANEL", "CEC WORKING CLEARANCE", "STUD DRILLING LIMITS", "SWITCH & WIRING", "GFCI OUTLET", "INTERCONNECTED SMOKE ALARMS", "RECEPTACLE SPACING", "240V RECEPTACLES", "REVISION BLOCK"];
              return allowed.some(a => a.toLowerCase() === item.title.toLowerCase());
            }
            if (bp.id === 'bp-05') {
              const allowed = ["SUMP PIT RADON SEAL", "PLUMBING RISER VENTING", "JOIST PENETRATION", "REVISION BLOCK", "PLUMBING P-TRAP", "SOIL STACK", "BUILDING DRAIN", "CLEANOUT (C.O.)"];
              return allowed.some(a => a.toLowerCase() === item.title.toLowerCase());
            }
            if (bp.id === 'bp-06') {
              const allowed = ["JOIST SPAN ARROW", "CROSS-BRIDGING", "LVL BEAM", "METAL JOIST HANGERS", "JOIST PENETRATION", "SECTION MARKS", "REVISION BLOCK"];
              return allowed.some(a => a.toLowerCase() === item.title.toLowerCase());
            }
            return true;
          })
        ],
        content
      }
    })
  }, [theme, highlightedElement])

  const oldPages = [
    {
      page: 1,
      title: "A-101: Foundation Layout & Excavation Batter Boards",
      scale: "Scale: 1/4\" = 1'-0\" (Metric: 1:50)",
      description: "Illustrates the location of batter boards outside of the excavation line, string layouts, diagonal squaring checks (3-4-5 rule), and benchmark elevation points.",
      content: (
        <svg viewBox="0 0 800 500" width="100%" height="100%" className="w-full h-full select-none">
          {/* Background based on theme */}
          <rect width="800" height="500" fill={theme === 'classic' ? '#0f2b48' : (theme === 'cad' ? '#111827' : '#fafafa')} />
          
          {/* Grid lines */}
          <g stroke={theme === 'classic' ? 'rgba(255,255,255,0.04)' : (theme === 'cad' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)')} strokeWidth="1">
            {Array.from({ length: 16 }).map((_, i) => (
              <line key={`v-${i}`} x1={i * 50} y1="0" x2={i * 50} y2="500" />
            ))}
            {Array.from({ length: 10 }).map((_, i) => (
              <line key={`h-${i}`} x1="0" y1={i * 50} x2="800" y2={i * 50} />
            ))}
          </g>

          {/* Border line */}
          <rect x="20" y="20" width="760" height="460" fill="none" stroke={theme === 'light' ? '#1e293b' : '#38bdf8'} strokeWidth="2" strokeDasharray={theme === 'light' ? 'none' : '4 4'} />

          {/* Title Block on Bottom/Right */}
          <g transform="translate(560, 390)" stroke={theme === 'light' ? '#1e293b' : '#38bdf8'} strokeWidth="1">
            <rect width="200" height="80" fill={theme === 'light' ? '#f1f5f9' : '#1e3a5f'} opacity="0.9" />
            <line x1="0" y1="25" x2="200" y2="25" />
            <line x1="0" y1="50" x2="200" y2="50" />
            <line x1="100" y1="50" x2="100" y2="80" />
            
            {/* Title Block Text */}
            <text x="10" y="16" fill={theme === 'light' ? '#0f172a' : '#ffffff'} fontSize="9" fontWeight="bold">RED SEAL OCCUPATIONAL STANDARD</text>
            <text x="10" y="40" fill={theme === 'light' ? '#334155' : '#38bdf8'} fontSize="10" fontWeight="extrabold">FOUNDATION & SITE PLAN</text>
            <text x="10" y="68" fill={theme === 'light' ? '#0f172a' : '#ffffff'} fontSize="8" fontWeight="bold">DWG NO: A-101</text>
            <text x="110" y="68" fill={theme === 'light' ? '#0f172a' : '#ffffff'} fontSize="8" fontWeight="bold">REV: 02</text>
          </g>

          {/* Drawing Content */}
          {/* Excavation Pit (dashed boundary) */}
          <rect x="120" y="100" width="460" height="260" fill="none" stroke="#f43f5e" strokeWidth="2" strokeDasharray="8 4" />
          <text x="130" y="120" fill="#f43f5e" fontSize="10" fontWeight="bold">EXCAVATION DIRT LIMITS</text>

          {/* Concrete Footing Outline (solid outline) */}
          <rect x="160" y="130" width="380" height="200" fill="none" stroke={theme === 'light' ? '#0f172a' : '#ffffff'} strokeWidth="4" />
          <text x="180" y="155" fill={theme === 'light' ? '#1e293b' : '#38bdf8'} fontSize="12" fontWeight="black">FOUNDATION FOOTING OUTLINE</text>

          {/* Batter boards at corners */}
          {/* Top-Left Batter Board */}
          <g transform="translate(70, 50)" stroke={theme === 'light' ? '#0284c7' : '#34d399'} strokeWidth="2">
            <line x1="10" y1="20" x2="50" y2="20" />
            <line x1="50" y1="20" x2="50" y2="60" />
            {/* Stakes */}
            <circle cx="10" cy="20" r="3" fill="#ef4444" />
            <circle cx="50" cy="20" r="3" fill="#ef4444" />
            <circle cx="50" cy="60" r="3" fill="#ef4444" />
            <text x="15" y="15" fill={theme === 'light' ? '#0369a1' : '#34d399'} fontSize="8" fontWeight="black" stroke="none">BATTER BOARD</text>
          </g>

          {/* Top-Right Batter Board */}
          <g transform="translate(620, 50)" stroke={theme === 'light' ? '#0284c7' : '#34d399'} strokeWidth="2">
            <line x1="10" y1="20" x2="50" y2="20" />
            <line x1="10" y1="20" x2="10" y2="60" />
            {/* Stakes */}
            <circle cx="10" cy="20" r="3" fill="#ef4444" />
            <circle cx="50" cy="20" r="3" fill="#ef4444" />
            <circle cx="10" cy="60" r="3" fill="#ef4444" />
          </g>

          {/* Bottom-Left Batter Board */}
          <g transform="translate(70, 370)" stroke={theme === 'light' ? '#0284c7' : '#34d399'} strokeWidth="2">
            <line x1="10" y1="60" x2="50" y2="60" />
            <line x1="50" y1="20" x2="50" y2="60" />
            {/* Stakes */}
            <circle cx="10" cy="60" r="3" fill="#ef4444" />
            <circle cx="50" cy="60" r="3" fill="#ef4444" />
            <circle cx="50" cy="20" r="3" fill="#ef4444" />
          </g>

          {/* String lines stretched between batter boards */}
          {/* Horizontal strings */}
          <line x1="80" y1="130" x2="630" y2="130" stroke="#fbbf24" strokeWidth="1" strokeDasharray="2 2" />
          <line x1="80" y1="330" x2="630" y2="330" stroke="#fbbf24" strokeWidth="1" strokeDasharray="2 2" />
          {/* Vertical strings */}
          <line x1="160" y1="70" x2="160" y2="430" stroke="#fbbf24" strokeWidth="1" strokeDasharray="2 2" />
          <line x1="540" y1="70" x2="540" y2="430" stroke="#fbbf24" strokeWidth="1" strokeDasharray="2 2" />
          <text x="300" y="85" fill="#fbbf24" fontSize="9" fontWeight="bold">LAYOUT STRING LINE (TRUE WALL ALIGNMENT)</text>

          {/* Squaring Check diagonal indicator (3-4-5 rule) */}
          <g transform="translate(160,130)" stroke="#10b981" strokeWidth="2">
            <line x1="0" y1="0" x2="90" y2="120" strokeDasharray="3 3" />
            <line x1="0" y1="0" x2="0" y2="120" />
            <line x1="0" y1="120" x2="90" y2="120" />
            <rect x="0" y="110" width="10" height="10" fill="none" stroke="#10b981" />
            {/* Text measurements */}
            <text x="-25" y="65" fill="#10b981" fontSize="10" fontWeight="bold" stroke="none">3 units</text>
            <text x="35" y="135" fill="#10b981" fontSize="10" fontWeight="bold" stroke="none">4 units</text>
            <text x="50" y="55" fill="#10b981" fontSize="10" fontWeight="black" stroke="none">5 units (SQUARE)</text>
          </g>

          {/* Benchmark elevation point */}
          <g transform="translate(680, 200)">
            <circle cx="20" cy="20" r="15" fill="none" stroke="#ef4444" strokeWidth="2.5" />
            <line x1="5" y1="20" x2="35" y2="20" stroke="#ef4444" strokeWidth="2.5" />
            <line x1="20" y1="5" x2="20" y2="35" stroke="#ef4444" strokeWidth="2.5" />
            <text x="45" y="24" fill={theme === 'light' ? '#ef4444' : '#f87171'} fontSize="10" fontWeight="black">BM ELEV: 100.00m</text>
            <text x="45" y="36" fill={theme === 'light' ? '#475569' : '#cbd5e1'} fontSize="8" fontWeight="bold">MASTER REFERENCE DATUM</text>
          </g>

          {/* Dimensions */}
          <g transform="translate(160, 350)" stroke={theme === 'light' ? '#475569' : '#a5f3fc'} strokeWidth="1">
            <line x1="0" y1="0" x2="380" y2="0" />
            <line x1="0" y1="-10" x2="0" y2="10" />
            <line x1="380" y1="-10" x2="380" y2="10" />
            <text x="190" y="-8" fill={theme === 'light' ? '#334155' : '#e0f2fe'} fontSize="11" fontWeight="extrabold" textAnchor="middle" stroke="none">38'-0" (11,580 mm)</text>
          </g>

          <g transform="translate(560, 130)" stroke={theme === 'light' ? '#475569' : '#a5f3fc'} strokeWidth="1">
            <line x1="0" y1="0" x2="0" y2="200" />
            <line x1="-10" y1="0" x2="10" y2="0" />
            <line x1="-10" y1="200" x2="10" y2="200" />
            <text x="15" y="105" fill={theme === 'light' ? '#334155' : '#e0f2fe'} fontSize="11" fontWeight="extrabold" stroke="none">20'-0" (6096 mm)</text>
          </g>

          {/* Section Callout */}
          <g transform="translate(350, 230)">
            <circle cx="0" cy="0" r="12" fill={theme === 'light' ? '#e2e8f0' : '#1e3a5f'} stroke="#38bdf8" strokeWidth="2" />
            <line x1="-30" y1="0" x2="30" y2="0" stroke="#38bdf8" strokeWidth="2" />
            <polygon points="-30,0 -24,-6 -24,6" fill="#38bdf8" />
            <polygon points="30,0 24,-6 24,6" fill="#38bdf8" />
            <text x="0" y="4" fill={theme === 'light' ? '#0f172a' : '#ffffff'} fontSize="9" fontWeight="black" textAnchor="middle">S-1</text>
          </g>

          {/* Search matches */}        </svg>
      )
    },
    {
      page: 2,
      title: "S-201: Structural Floor & Joist Span Framing Layout",
      scale: "Scale: 1/4\" = 1'-0\" (Metric: 1:50)",
      description: "Details the joist direction, spacing (16\" o.c.), doubled headers, trimmer studs framing stairwell opening, and load-bearing beam placements.",
      content: (
        <svg viewBox="0 0 800 500" width="100%" height="100%" className="w-full h-full select-none">
          {/* Background based on theme */}
          <rect width="800" height="500" fill={theme === 'classic' ? '#0f2b48' : (theme === 'cad' ? '#111827' : '#fafafa')} />
          
          {/* Grid lines */}
          <g stroke={theme === 'classic' ? 'rgba(255,255,255,0.04)' : (theme === 'cad' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)')} strokeWidth="1">
            {Array.from({ length: 16 }).map((_, i) => (
              <line key={`v-${i}`} x1={i * 50} y1="0" x2={i * 50} y2="500" />
            ))}
            {Array.from({ length: 10 }).map((_, i) => (
              <line key={`h-${i}`} x1="0" y1={i * 50} x2="800" y2={i * 50} />
            ))}
          </g>

          {/* Border line */}
          <rect x="20" y="20" width="760" height="460" fill="none" stroke={theme === 'light' ? '#1e293b' : '#38bdf8'} strokeWidth="2" strokeDasharray={theme === 'light' ? 'none' : '4 4'} />

          {/* Title Block */}
          <g transform="translate(560, 390)" stroke={theme === 'light' ? '#1e293b' : '#38bdf8'} strokeWidth="1">
            <rect width="200" height="80" fill={theme === 'light' ? '#f1f5f9' : '#1e3a5f'} opacity="0.9" />
            <line x1="0" y1="25" x2="200" y2="25" />
            <line x1="0" y1="50" x2="200" y2="50" />
            <line x1="100" y1="50" x2="100" y2="80" />
            <text x="10" y="16" fill={theme === 'light' ? '#0f172a' : '#ffffff'} fontSize="9" fontWeight="bold">RED SEAL OCCUPATIONAL STANDARD</text>
            <text x="10" y="40" fill={theme === 'light' ? '#334155' : '#38bdf8'} fontSize="10" fontWeight="extrabold">FLOOR FRAMING PLAN</text>
            <text x="10" y="68" fill={theme === 'light' ? '#0f172a' : '#ffffff'} fontSize="8" fontWeight="bold">DWG NO: S-201</text>
            <text x="110" y="68" fill={theme === 'light' ? '#0f172a' : '#ffffff'} fontSize="8" fontWeight="bold">REV: 01</text>
          </g>

          {/* Sill Plates and Foundation Line */}
          <rect x="100" y="80" width="600" height="300" fill="none" stroke={theme === 'light' ? '#1e293b' : '#ffffff'} strokeWidth="5" />
          <text x="110" y="105" fill={theme === 'light' ? '#475569' : '#a5f3fc'} fontSize="10" fontWeight="bold">FOUNDATION MASONRY CRADLE</text>

          {/* Double Sill Plate */}
          <rect x="105" y="85" width="590" height="290" fill="none" stroke="#fbbf24" strokeWidth="1.5" />

          {/* Primary Bearing Beam (LVL/Steel Beam) */}
          <line x1="100" y1="230" x2="700" y2="230" stroke="#f43f5e" strokeWidth="8" />
          <text x="250" y="222" fill="#f43f5e" fontSize="11" fontWeight="black">3-PLY 2x10 STRUCTURAL BUILT-UP BEAM (SUPPORT)</text>

          {/* Floor Joists */}
          {Array.from({ length: 15 }).map((_, i) => {
            const x = 120 + i * 40
            return (
              <g key={`joist-t-${i}`}>
                <line x1={x} y1="85" x2={x} y2="230" stroke={theme === 'light' ? '#64748b' : '#38bdf8'} strokeWidth="2.5" />
                <line x1={x + 4} y1="220" x2={x + 4} y2="235" stroke={theme === 'light' ? '#64748b' : '#38bdf8'} strokeWidth="2.5" />
              </g>
            )
          })}

          {Array.from({ length: 15 }).map((_, i) => {
            const x = 120 + i * 40
            return (
              <line key={`joist-b-${i}`} x1={x} y1="230" x2={x} y2="375" stroke={theme === 'light' ? '#64748b' : '#38bdf8'} strokeWidth="2.5" />
            )
          })}

          {/* Stair Opening Block */}
          <g transform="translate(320, 110)">
            <rect x="0" y="0" width="160" height="85" fill={theme === 'classic' ? '#0f2b48' : (theme === 'cad' ? '#111827' : '#fafafa')} stroke="none" />
            <line x1="0" y1="0" x2="160" y2="0" stroke="#fbbf24" strokeWidth="5" />
            <line x1="0" y1="85" x2="160" y2="85" stroke="#fbbf24" strokeWidth="5" />
            <line x1="0" y1="0" x2="0" y2="85" stroke="#fbbf24" strokeWidth="5" />
            <line x1="160" y1="0" x2="160" y2="85" stroke="#fbbf24" strokeWidth="5" />
            <text x="80" y="40" fill={theme === 'light' ? '#1e293b' : '#ffffff'} fontSize="9" fontWeight="black" textAnchor="middle">STAIRWELL OPENING</text>
            <text x="80" y="55" fill="#fbbf24" fontSize="8" fontWeight="bold" textAnchor="middle">DOUBLED HEADERS & TRIMMERS</text>
          </g>

          {/* Bridging Line */}
          <line x1="100" y1="155" x2="700" y2="155" stroke="#10b981" strokeWidth="2.5" strokeDasharray="5 5" />
          <line x1="100" y1="305" x2="700" y2="305" stroke="#10b981" strokeWidth="2.5" strokeDasharray="5 5" />
          <text x="120" y="150" fill="#10b981" fontSize="9" fontWeight="bold">1x3 BRIDGING OR BLOCKING LINE (REQUIRED AS SPAN &gt; 7'-0")</text>

          {/* Details & Callouts */}
          <g transform="translate(600, 120)">
            <line x1="0" y1="0" x2="-80" y2="40" stroke="#38bdf8" strokeWidth="1.5" />
            <circle cx="0" cy="0" r="3.5" fill="#38bdf8" />
            <rect x="-180" y="30" width="95" height="20" rx="4" fill={theme === 'light' ? '#e2e8f0' : '#1e3a5f'} stroke="#38bdf8" strokeWidth="1" />
            <text x="-132" y="43" fill={theme === 'light' ? '#0f172a' : '#ffffff'} fontSize="8.5" fontWeight="bold" textAnchor="middle">2x10 SPF JOISTS @ 16" o.c.</text>
          </g>

          <g transform="translate(480, 260)">
            <line x1="0" y1="0" x2="-30" y2="40" stroke="#f43f5e" strokeWidth="1.5" />
            <circle cx="0" cy="0" r="3.5" fill="#f43f5e" />
            <rect x="-110" y="30" width="130" height="20" rx="4" fill={theme === 'light' ? '#fecdd3' : '#881337'} stroke="#f43f5e" strokeWidth="1" />
            <text x="-45" y="43" fill={theme === 'light' ? '#9f1239' : '#fecdd3'} fontSize="8.5" fontWeight="black" textAnchor="middle">SPLICED OVERLAP (50mm / 2" MIN)</text>
          </g>

          {/* Dimensions */}
          <g transform="translate(100, 395)" stroke={theme === 'light' ? '#475569' : '#cbd5e1'} strokeWidth="1">
            <line x1="0" y1="0" x2="600" y2="0" />
            <line x1="0" y1="-8" x2="0" y2="8" />
            <line x1="600" y1="-8" x2="600" y2="8" />
            <text x="300" y="15" fill={theme === 'light' ? '#1e293b' : '#ffffff'} fontSize="10" fontWeight="extrabold" textAnchor="middle" stroke="none">TOTAL FRAME SPAN: 36'-0"</text>
          </g>

          {/* Search matches */}        </svg>
      )
    },
    {
      page: 3,
      title: "R-301: Roof Framing Profile & Structural Truss Elevations",
      scale: "Scale: 3/8\" = 1'-0\" (Metric: 1:30)",
      description: "Illustrates the geometric configuration of a standard King Post Roof Truss, including slope ratio, rafter connections, birdsmouth depth, and web locations.",
      content: (
        <svg viewBox="0 0 800 500" width="100%" height="100%" className="w-full h-full select-none">
          {/* Background based on theme */}
          <rect width="800" height="500" fill={theme === 'classic' ? '#0f2b48' : (theme === 'cad' ? '#111827' : '#fafafa')} />
          
          {/* Grid lines */}
          <g stroke={theme === 'classic' ? 'rgba(255,255,255,0.04)' : (theme === 'cad' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)')} strokeWidth="1">
            {Array.from({ length: 16 }).map((_, i) => (
              <line key={`v-${i}`} x1={i * 50} y1="0" x2={i * 50} y2="500" />
            ))}
            {Array.from({ length: 10 }).map((_, i) => (
              <line key={`h-${i}`} x1="0" y1={i * 50} x2="800" y2={i * 50} />
            ))}
          </g>

          {/* Border line */}
          <rect x="20" y="20" width="760" height="460" fill="none" stroke={theme === 'light' ? '#1e293b' : '#38bdf8'} strokeWidth="2" strokeDasharray={theme === 'light' ? 'none' : '4 4'} />

          {/* Title Block */}
          <g transform="translate(560, 390)" stroke={theme === 'light' ? '#1e293b' : '#38bdf8'} strokeWidth="1">
            <rect width="200" height="80" fill={theme === 'light' ? '#f1f5f9' : '#1e3a5f'} opacity="0.9" />
            <line x1="0" y1="25" x2="200" y2="25" />
            <line x1="0" y1="50" x2="200" y2="50" />
            <line x1="100" y1="50" x2="100" y2="80" />
            <text x="10" y="16" fill={theme === 'light' ? '#0f172a' : '#ffffff'} fontSize="9" fontWeight="bold">RED SEAL OCCUPATIONAL STANDARD</text>
            <text x="10" y="40" fill={theme === 'light' ? '#334155' : '#38bdf8'} fontSize="10" fontWeight="extrabold">ROOF TRUSS SECTIONAL</text>
            <text x="10" y="68" fill={theme === 'light' ? '#0f172a' : '#ffffff'} fontSize="8" fontWeight="bold">DWG NO: R-301</text>
            <text x="110" y="68" fill={theme === 'light' ? '#0f172a' : '#ffffff'} fontSize="8" fontWeight="bold">REV: 01</text>
          </g>

          {/* WALL STUDS/PLATE ON SIDES */}
          <rect x="100" y="300" width="40" height="150" fill={theme === 'light' ? '#e2e8f0' : '#1e293b'} stroke={theme === 'light' ? '#64748b' : '#475569'} strokeWidth="2" />
          <text x="120" y="380" fill={theme === 'light' ? '#1e293b' : '#ffffff'} fontSize="8.5" fontWeight="bold" textAnchor="middle" transform="rotate(-90 120 380)">EXTERIOR WALL</text>

          <rect x="660" y="300" width="40" height="150" fill={theme === 'light' ? '#e2e8f0' : '#1e293b'} stroke={theme === 'light' ? '#64748b' : '#475569'} strokeWidth="2" />
          <text x="680" y="380" fill={theme === 'light' ? '#1e293b' : '#ffffff'} fontSize="8.5" fontWeight="bold" textAnchor="middle" transform="rotate(90 680 380)">EXTERIOR WALL</text>

          {/* Double Top Plates */}
          <rect x="95" y="285" width="50" height="15" fill="#fbbf24" stroke="#d97706" />
          <rect x="655" y="285" width="50" height="15" fill="#fbbf24" stroke="#d97706" />

          {/* THE TRUSS STRUCTURE */}
          {/* Bottom Chord */}
          <line x1="80" y1="285" x2="720" y2="285" stroke={theme === 'light' ? '#1e293b' : '#ffffff'} strokeWidth="12" strokeLinecap="round" />
          <text x="400" y="307" fill={theme === 'light' ? '#475569' : '#cbd5e1'} fontSize="10" fontWeight="extrabold" textAnchor="middle">BOTTOM CHORD / CEILING JOIST (TIES RAFTERS)</text>

          {/* Top Chords (Slope) */}
          <line x1="80" y1="285" x2="400" y2="90" stroke="#f43f5e" strokeWidth="12" strokeLinecap="round" />
          <line x1="400" y1="90" x2="720" y2="285" stroke="#f43f5e" strokeWidth="12" strokeLinecap="round" />
          <text x="210" y="170" fill="#f43f5e" fontSize="10" fontWeight="black" transform="rotate(-28 210 170)">TOP CHORD (RAFTER)</text>
          <text x="590" y="170" fill="#f43f5e" fontSize="10" fontWeight="black" transform="rotate(28 590 170)">TOP CHORD (RAFTER)</text>

          {/* Central King Post */}
          <line x1="400" y1="90" x2="400" y2="285" stroke="#38bdf8" strokeWidth="12" />
          <text x="415" y="180" fill="#38bdf8" fontSize="11" fontWeight="black">KING POST (TENSION MEMBER)</text>

          {/* Web Struts */}
          <line x1="400" y1="285" x2="240" y2="202" stroke="#10b981" strokeWidth="8" strokeLinecap="round" />
          <line x1="400" y1="285" x2="560" y2="202" stroke="#10b981" strokeWidth="8" strokeLinecap="round" />
          <text x="280" y="260" fill="#10b981" fontSize="9" fontWeight="bold">WEB STRUT</text>
          <text x="520" y="260" fill="#10b981" fontSize="9" fontWeight="bold">WEB STRUT</text>

          {/* Gusset Plates */}
          <polygon points="380,95 420,95 400,135" fill="#cbd5e1" stroke="#475569" strokeWidth="1" opacity="0.8" />
          <polygon points="100,285 140,260 140,285" fill="#cbd5e1" stroke="#475569" strokeWidth="1" opacity="0.8" />
          <polygon points="700,285 660,260 660,285" fill="#cbd5e1" stroke="#475569" strokeWidth="1" opacity="0.8" />
          <polygon points="375,285 425,285 400,245" fill="#cbd5e1" stroke="#475569" strokeWidth="1" opacity="0.8" />

          {/* Slope Ratio (6/12 Pitch) */}
          <g transform="translate(230, 110)">
            <line x1="0" y1="30" x2="40" y2="30" stroke="#f59e0b" strokeWidth="2" />
            <line x1="40" y1="10" x2="40" y2="30" stroke="#f59e0b" strokeWidth="2" />
            <line x1="0" y1="30" x2="40" y2="10" stroke="#f59e0b" strokeWidth="2" />
            <text x="20" y="42" fill="#f59e0b" fontSize="9" fontWeight="black" textAnchor="middle">12 (Run)</text>
            <text x="48" y="24" fill="#f59e0b" fontSize="9" fontWeight="black">6 (Rise)</text>
          </g>

          {/* Overhang details */}
          <g transform="translate(60, 310)">
            <line x1="20" y1="-25" x2="20" y2="10" stroke={theme === 'light' ? '#334155' : '#38bdf8'} strokeWidth="1.5" />
            <line x1="40" y1="-25" x2="40" y2="10" stroke={theme === 'light' ? '#334155' : '#38bdf8'} strokeWidth="1.5" />
            <line x1="20" y1="0" x2="40" y2="0" stroke={theme === 'light' ? '#334155' : '#38bdf8'} strokeWidth="1" />
            <text x="30" y="10" fill={theme === 'light' ? '#334155' : '#38bdf8'} fontSize="8" fontWeight="bold" textAnchor="middle">OH</text>
          </g>

          {/* Birdsmouth */}
          <g transform="translate(620, 340)">
            <rect x="-10" y="-10" width="120" height="30" rx="4" fill={theme === 'light' ? '#f1f5f9' : '#1e3a5f'} stroke="#e2e8f0" strokeWidth="1" />
            <text x="50" y="8" fill={theme === 'light' ? '#0f172a' : '#ffffff'} fontSize="8.5" fontWeight="extrabold" textAnchor="middle">BIRDSMOUTH CUT</text>
            <text x="50" y="18" fill="#fbbf24" fontSize="7.5" fontWeight="bold" textAnchor="middle">Max 1/3 Rafter Depth</text>
          </g>

          {/* Search matches */}        </svg>
      )
    }
  ]

  const activePageData = pages.find(p => p.page === currentPage)

  const handleZoomIn = () => setZoomLevel(prev => Math.min(300, prev + 25))
  const handleZoomOut = () => setZoomLevel(prev => Math.max(50, prev - 25))
  const handleResetZoom = () => {
    setZoomLevel(100)
    x.set(0)
    y.set(0)
  }

  const handleDoubleClick = () => {
    handleResetZoom()
    showToast("Reset pan and zoom position")
  }

  const reviewedCount = useMemo(() => {
    return pages.filter(p => reviewedPages.includes(p.page)).length
  }, [pages, reviewedPages])

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden flex flex-col flex-1 min-h-0 relative">
      
      {/* UNDER CONSTRUCTION BANNER */}
      <div className="w-full bg-yellow-400 text-black py-2 px-4 text-center font-bold text-xs sm:text-sm uppercase tracking-wider z-20 shadow-md flex items-center justify-center space-x-2">
        <span>🚧</span>
        <span>BLUEPRINT TRAINER UNDER CONSTRUCTION - UPDATES IN PROGRESS</span>
        <span>🚧</span>
      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-50 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-black py-2.5 px-5 rounded-full shadow-2xl flex items-center space-x-2 border border-slate-700/50 animate-bounce">
          <CheckCircle2 size={14} className="text-emerald-400 dark:text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* PDF TOOLBAR PANEL */}
      <div className="bg-slate-100/50 dark:bg-slate-900 px-6 py-3 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 w-full z-10">
        
        {/* Pagination Controls */}
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-xs font-black text-slate-700 dark:text-slate-300">
            Page {currentPage} of {pages.length}
          </span>
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, pages.length))}
            disabled={currentPage === pages.length}
            className="p-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center space-x-1">
          <button 
            onClick={handleZoomOut}
            className="p-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
            title="Zoom Out"
          >
            <ZoomOut size={16} />
          </button>
          <button 
            onClick={handleResetZoom}
            className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-black text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
          >
            {zoomLevel}%
          </button>
          <button 
            onClick={handleZoomIn}
            className="p-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
            title="Zoom In"
          >
            <ZoomIn size={16} />
          </button>
        </div>

        <div className="relative flex items-center gap-2">
          <button
            onClick={() => setShowLegend(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-slate-900 dark:text-white text-xs font-black uppercase rounded-lg shadow-sm transition-all hover:scale-[1.03] active:scale-95"
            title="Open Symbols Legend Overlay"
          >
            <Layers size={14} />
            <span>Legend</span>
          </button>
          <button onClick={() => setShowLegendInfo(!showLegendInfo)} className="text-slate-400 hover:text-slate-200 cursor-pointer">ⓘ</button>
          {showLegendInfo && (
            <div className="absolute top-full left-0 mt-2 w-72 bg-slate-800 border border-slate-600 rounded-md p-3 text-sm text-slate-200 z-[60] shadow-xl font-normal text-left">
              <strong className="block text-cyan-400 mb-1">Interactive Symbol Legend</strong>
              <p>Master symbols across all blueprint pages. Search, filter by category, and click on any item to locate & jump to it!</p>
            </div>
          )}
        </div>
      </div>

            {/* Blueprint Canvas Container */}
      <div className="px-6 flex-1 flex flex-col min-h-0 pt-4 pb-0 overflow-hidden">
        <InteractiveBlueprint zoomLevel={zoomLevel} theme={theme} page={currentPage} onElementClick={handleElementClick} highlightedElement={highlightedElement} />
      </div>

      {/* BOTTOM NAVIGATION / TABS SECTION */}
      <div className="w-full border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex flex-col h-1/3 min-h-[250px] shrink-0">
          
          {/* Tabs header */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 items-center justify-center p-3">
            <div className="relative flex items-center gap-2 justify-center">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-800 dark:text-white flex items-center gap-1.5">
                🎓 Masterclass
              </span>
              <button 
                onClick={() => setShowMasterclassInfo(!showMasterclassInfo)} 
                className="p-1 hover:bg-slate-100 dark:bg-slate-800 rounded-full text-slate-400 transition-colors cursor-pointer"
              >
                <Info size={14} />
              </button>
              {showMasterclassInfo && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 bg-slate-800 border border-slate-600 rounded-md p-3 text-sm text-slate-200 z-[60] shadow-xl font-normal text-left">
                  <strong className="block text-yellow-500 mb-1">Interactive Guide</strong>
                  <p>Click any highlighted element on the blueprint or select one below to inspect its strict Red Seal specifications.</p>
                </div>
              )}
            </div>
          </div>

          {/* Active Pane Content */}
          <div className="flex flex-col gap-6 h-auto min-h-min p-4">
              
              <div className="space-y-3">
                {activePageData?.keyTakeaways?.map((el, idx) => {
                  const isSelected = highlightedElement === el.title;
                  return (
                    <div 
                      key={idx}
                      id={`takeaway-${el.title.toLowerCase().replace(/\s+/g, '-')}`}
                      onClick={() => setHighlightedElement(isSelected ? null : el.title)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer text-left ${
                        isSelected 
                          ? 'bg-amber-500/10 border-amber-500 shadow-sm' 
                          : 'bg-white dark:bg-slate-800 hover:bg-slate-100/50 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <h6 className="text-[11px] font-bold text-slate-800 dark:text-slate-100 uppercase tracking-tight">{el.title}</h6>
                        <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${
                          isSelected ? 'bg-amber-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }`}>
                          {isSelected ? 'Active' : 'Inspect'}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                        {el.description}
                      </p>
                      
                      {/* Expandable/Interactive details when selected */}
                      {isSelected && (
                        <div className="mt-2.5 pt-2.5 border-t border-dashed border-amber-500/20 space-y-2">
                          <div>
                            <span className="text-[8px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest block">Official NBC Code / Clause</span>
                            <p className="text-[9.5px] font-mono text-slate-700 dark:text-slate-300 mt-0.5 leading-normal bg-amber-500/5 p-1.5 rounded border border-amber-500/10">
                              {el.code}
                            </p>
                          </div>
                          <div>
                            <span className="text-[8px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block">Red Seal Exam Focus</span>
                            <p className="text-[9.5px] font-bold text-slate-800 dark:text-slate-200 mt-0.5 leading-normal">
                              {el.examFocus}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
            </div>

      {/* SYMBOLS LEGEND MODAL OVERLAY */}
      <AnimatePresence>
        {showLegend && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLegend(false)}
              className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm"
              aria-hidden="true"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-4xl max-h-[85vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800 z-10"
            >
              {/* Toolbar: Category tabs and search */}
              <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shrink-0">
                {/* Category selectors */}
                <div className="flex overflow-x-auto whitespace-nowrap gap-1.5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  {[
                    { id: 'all', label: 'All Symbols' },
                    { id: 'general', label: 'General / Ref' },
                    { id: 'structural', label: 'Structural' },
                    { id: 'elevation', label: 'Elevations' },
                    { id: 'electrical', label: 'Electrical' },
                    { id: 'MEP', label: 'MEP' },
                    { id: 'Framing', label: 'Framing' },
                    { id: 'Site & Survey', label: 'Site & Survey' },
                    { id: 'Roof Framing', label: 'Roof Framing' },
                    { id: 'Exterior Envelope', label: 'Exterior Envelope' },
                    { id: 'Stairs', label: 'Stairs' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setLegendTab(tab.id)}
                      className={`px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded-full border transition-all ${
                        legendTab === tab.id
                          ? 'bg-brand-500 text-white border-brand-500 shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Sub-search */}
                <div className="relative w-full sm:max-w-[200px]">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 text-slate-400 dark:text-slate-500">
                    <Search size={12} />
                  </span>
                  <input
                    type="text"
                    placeholder="Filter symbols..."
                    value={legendSearchQuery}
                    onChange={(e) => setLegendSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-0.5 my-0.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 text-[10px] font-extrabold rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
              </div>

              {/* Scrollable grid area */}
              <div className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-950/40">
                {filteredLegendItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Layers size={36} className="text-slate-300 dark:text-slate-700 mb-2" />
                    <span className="text-xs font-black text-slate-600 dark:text-slate-400">No matching symbols found</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Try another search term or filter category</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredLegendItems.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleLegendItemSelect(item)}
                        className="group relative flex gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800/80 rounded-xl hover:border-brand-500/50 dark:hover:border-brand-500/50 hover:shadow-md cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
                      >
                        {/* Live symbol illustration column */}
                        <div className="flex flex-col items-center justify-center shrink-0 w-20">
                          <div className="p-1 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-800 flex items-center justify-center w-full aspect-video">
                            {item.svg(theme === 'cad-dark' || theme === 'classic-blue')}
                          </div>
                          <span className="text-[8px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider mt-1.5 block">
                            Symbol View
                          </span>
                        </div>

                        {/* Details column */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className="text-xs font-black text-slate-800 dark:text-white truncate group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors">
                              {item.name}
                            </h4>
                            <span className="px-1.5 py-0.5 bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[8px] font-black rounded tracking-wide uppercase shrink-0">
                              {item.code}
                            </span>
                          </div>
                          <p className="text-[10px] font-bold text-slate-600 dark:text-slate-400 leading-relaxed mb-2">
                            {item.description}
                          </p>
                          <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                            <span>Category: {item.category}</span>
                            <span className="text-brand-500 dark:text-brand-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 font-extrabold px-2 py-0.5 rounded bg-brand-500/5 dark:bg-brand-500/10 hover:bg-brand-500/15">
                              Locate on Sheet →
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}

