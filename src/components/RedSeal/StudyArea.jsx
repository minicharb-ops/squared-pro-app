import React, { useState, useContext, useEffect } from 'react'
import { AppContext } from '../../App'
import { 
  BookOpen, 
  Bookmark, 
  BookmarkCheck, 
  FileText, 
  Lightbulb, 
  Save, 
  Check, 
  Compass, 
  Code,
  AlertCircle,
  Clock,
  ChevronRight,
  Trophy,
  Layers
} from 'lucide-react'
import questionsData from '../../data/RedSeal/questions.json'
import StudyModules from './StudyModules'
import { HighlightedText } from '../../services/termHighlighterService'
import QuickReferenceModal from './QuickReferenceModal'
import NBCSpanTables from './NBCSpanTables'
import BlueprintViewer from './BlueprintViewer'
import NBCClausesIndex from './NBCClausesIndex'
import blockDGuide from '../../data/RedSeal/block_d_study_guide.json'
import blockAGuide from '../../data/RedSeal/block_a_study_guide.json'
import blockBGuide from '../../data/RedSeal/block_b_study_guide.json'
import blockCGuide from '../../data/RedSeal/block_c_study_guide.json'
import blockEGuide from '../../data/RedSeal/block_e_study_guide.json'
import blockFGuide from '../../data/RedSeal/block_f_study_guide.json'
import blockGGuide from '../../data/RedSeal/block_g_study_guide.json'

export default function StudyArea() {
  const context = useContext(AppContext) || {}
  const { 
    bookmarks: rawBookmarks, 
    toggleBookmark = () => {}, 
    personalNotes = {}, 
    saveNote = () => {},
    setActiveTab = () => {},
    focusedStudyBlock,
    setFocusedStudyBlock = () => {},
    setCustomQuizQuestions = () => {}
  } = context

  const bookmarks = Array.isArray(rawBookmarks) ? rawBookmarks : []

  const getSimplifiedConcept = (concept) => {
    const c = concept.toLowerCase()
    
    if (c.includes("ppe") || c.includes("boots") || c.includes("hard hat")) {
      return "Jobsite Standard: Green-patch CSA steel toes, safety glasses, and your hard hat are NOT optional. If you show up in running shoes, the superintendent will kick you off the site before you can even unpack your tool belts. Protect your ears too; once your hearing is gone, it is gone."
    }
    if (c.includes("whmis") || c.includes("sds") || c.includes("chemical")) {
      return "Jobsite Standard: WHMIS basically means 'know what you are spraying, pouring, or breathing.' Read the Safety Data Sheet (SDS) before using weird solvents, glues, or expanding foams. Don't mix random chemicals, and always wear the right filter mask or respirator so you don't burn your lungs."
    }
    if (c.includes("power tool") || c.includes("saw") || c.includes("gfci")) {
      return "Jobsite Standard: Check your power tool cords for cuts and exposed wires. Outdoors or near wet concrete, always plug into a GFCI outlet so you don't get fried. And never, ever pin back the safety guard on your circular saw with a wedge—that's how you lose a finger or a knee."
    }
    if (c.includes("blueprint") || c.includes("symbol") || c.includes("line")) {
      return "Jobsite Standard: Reading prints is just visual shorthand. Thicker lines are solid wood/concrete walls, dashed lines are things hidden above or below (like headers or footers), and hatched patterns show what material it is (wood grain, concrete speckles). Learn the code legends so you don't frame a window in the wrong spot."
    }
    if (c.includes("elevation") || c.includes("level") || c.includes("optical")) {
      return "Jobsite Standard: Auto-levels and laser transits are for making sure your floors aren't slanted. Always set up on solid ground (not a pile of loose dirt) and double-check your benchmark elevation point before marking studs or concrete forms."
    }
    if (c.includes("batter board") || c.includes("excavation") || c.includes("string")) {
      return "Jobsite Standard: Batter boards are temporary wood frames built outside your dig zone. You tie layout lines to them to square the house. Since the excavator is going to tear up all the dirt, batter boards let you pull your strings back across to find exact wall placements later."
    }
    if (c.includes("squaring") || c.includes("3-4-5") || c.includes("diagonal")) {
      return "Jobsite Standard: To check if a wall layout is square, measure diagonally from corner to corner. If the two diagonal lengths are exactly the same, your box is perfectly square. For quick right-angles, use the 3-4-5 rule: measure 3 feet on one side, 4 feet on the other, and the diagonal between them MUST be exactly 5 feet."
    }
    if (c.includes("footing") || c.includes("frost") || c.includes("undisturbed")) {
      return "Jobsite Standard: Concrete footings must always sit on solid, un-dug dirt below the local frost line. If you pour on loose backfill, the house will settle and crack. If you pour above the frost line, winter ice will heave and lift the entire foundation."
    }
    if (c.includes("slab") || c.includes("vapor") || c.includes("polyethylene")) {
      return "Jobsite Standard: Before pouring a concrete basement floor, put down 4 inches of clean gravel for water drainage, then lay out a thick 6-mil plastic sheet (vapor barrier) on top. This stops damp earth moisture from rising up through the porous concrete and making the basement smell like a wet cave."
    }
    if (c.includes("slump") || c.includes("consistency") || c.includes("water")) {
      return "Jobsite Standard: A slump test checks how wet and soupy your concrete mix is. If you dump too much water into the mixer truck to make it easier to rake, you ruin the concrete's strength. Keep the slump within spec so your foundation doesn't crack or crumble."
    }
    if (c.includes("rebar") || c.includes("clearance") || c.includes("coverage")) {
      return "Jobsite Standard: Steel rebar rusts if water gets to it. So, you must suspend the steel on chairs or concrete blocks inside your forms. It needs 3 inches of concrete coverage against dirt, and 2 inches against exterior weather forms, otherwise moisture will seep in and pop the concrete."
    }
    if (c.includes("notching") || c.includes("drilling") || c.includes("limits")) {
      return "Jobsite Standard: Joists are under tension at the bottom and compression at the top. Never cut notches in the middle third of the joist span where bending stress is highest. Keep holes centered vertically and at least 2 inches away from the top or bottom flanges so you don't snap the joist."
    }
    if (c.includes("bearing") || c.includes("load") || c.includes("king") || c.includes("trimmer")) {
      return "Jobsite Standard: Load-bearing walls carry the weight of the roof and floors above. Headers act as beams over door and window openings. Trimmer studs (or jacks) are nailed underneath headers to carry their load straight down to the plates."
    }
    if (c.includes("rafter") || c.includes("hip") || c.includes("valley") || c.includes("birdsmouth")) {
      return "Jobsite Standard: Roof framing is pure geometry. The birdsmouth is the notch you cut in a rafter to let it sit flat on the wall plate. Don't over-cut it (max 1/3 of rafter depth), or you'll weaken the tail and cause the rafter to split at the wall."
    }
    if (c.includes("stair") || c.includes("headroom") || c.includes("tread") || c.includes("riser")) {
      return "Jobsite Standard: Stairways are dangerous if uneven. Every single riser height must be identical within a tiny margin (max 5 mm difference) because your brain memorizes the first step. Keep riser heights under 8 inches, treads over 10 inches, and headroom at least 6'-5\"."
    }
    if (c.includes("siding") || c.includes("clad") || c.includes("lap") || c.includes("bevel")) {
      return "Jobsite Standard: Overlap wood or vinyl siding by at least 1 inch so wind-driven rain can't seep behind. Nail wood siding loosely or vinyl siding with nails centered in the slots (and never flush) so the material can slide, expand, and contract in the heat."
    }
    if (c.includes("flashing") || c.includes("roofing") || c.includes("water")) {
      return "Jobsite Standard: Water always runs downhill. Flashing is your metal defense system at roof intersections, valleys, and wall bases. Always overlap higher layers over lower layers (shingle-style). If you lap them backward, water will seep behind and rot out your framing."
    }
    if (c.includes("renovation") || c.includes("hazard") || c.includes("asbestos") || c.includes("lead")) {
      return "Jobsite Standard: Old houses are full of nasty stuff. If a house was built before 1990, assume drywall plaster has asbestos and old paint has lead. Wear a certified HEPA respirator, seal off your workspace with poly sheets, and NEVER sand or demolish without testing first."
    }
    
    return `Simplified concept: ${concept.replace(/^According to .*?,/i, "When building,").replace(/^Under Section .*?,/i, "On the jobsite,")}`
  }

  const blocksList = [
    {
      id: 'Block A',
      title: 'Common Occupational Skills',
      weight: '11% of Exam',
      subactivities: [
        'A-1: Uses and maintains tools and equipment',
        'A-2: Organizes work',
        'A-3: Performs safety-related and security activities'
      ],
      nbcCodes: [
        { section: 'Part 8', title: 'Safety Measures at Construction and Demolition Sites', detail: 'Requires strict site fencing, pedestrian protection over sidewalks, and secure scaffolding guardrails.' },
        { section: 'CSA Z11', title: 'Portable Ladders Standard', detail: 'Regulates ladder specifications, loads, and angles. Standard 4:1 slope angle is mandatory for safety.' },
        { section: 'WHMIS 2015', title: 'Hazardous Materials & SDS', detail: 'Mandates readily accessible Safety Data Sheets (SDS), workplace labeling, and specific employer training on chemical toxicity and PPE.' }
      ],
      formulas: [
        { name: 'Ladder Slope Safe Distance', formula: 'Distance from Wall = Height to Wall Support / 4', desc: 'Ensures ladder sits at approximately 75.5 degrees for optimal vertical support and anti-slip stability.' }
      ],
      keyConcepts: [
        'PPE requirements: CSA-approved Grade 1 boots (green patch), Class E/G hard hats, safety glasses, and proper hearing protection for environments exceeding 85 dBA.',
        'WHMIS guidelines: Identification of hazard classes (flammable, toxic, corrosive) and safety actions detailed on Safety Data Sheets (SDSs).',
        'Power tool safety: Inspection of cords for nicks, mandatory usage of GFCI on outdoor sites, double-insulated housings, and proper guard functionality check on circular saws.',
        'Blueprint symbol recognition: Proper identification of material hatching (wood, concrete, brick), line weight hierarchies (object, hidden, center lines), and key structural details.'
      ]
    },
    {
      id: 'Block B',
      title: 'Planning and Layout',
      weight: '9% of Exam',
      subactivities: [
        'B-4: Interprets drawings and specifications',
        'B-5: Performs planning and layout'
      ],
      nbcCodes: [
        { section: 'NBC 9.3', title: 'Materials, Systems and Equipment', detail: 'Requires materials to meet grade-marking requirements, lumber must be stamped with grading agency marks.' },
        { section: 'NBC 9.30.2', title: 'Subflooring Thicknesses', detail: 'Table 9.30.2.1-A establishes minimum thicknesses: 15.5 mm (5/8 in) for plywood/OSB subfloor on joists up to 400 mm (16 in) o.c., and 18.5 mm (3/4 in) for joists up to 600 mm (24 in) o.c.' },
        { section: 'Provincial Code Note', title: 'NBC vs Ontario Building Code (OBC)', detail: 'OBC Part 9 contains stricter rules on lateral bracing, specific lumber grading species classifications (S-P-F vs D.Fir-L), and residential basement insulation requirements.' }
      ],
      formulas: [
        { name: 'Pythagorean Triangulation (3-4-5 Rule)', formula: 'A² + B² = C²', desc: 'Used for establishing true perpendicular right angles during foundation layout or deck squaring.' },
        { name: 'Unit Board Feet Calculation', formula: 'Board Feet = (Pieces * Thickness in. * Width in. * Length ft.) / 12', desc: 'Standard lumber volume billing estimation formula used for pricing structural frames.' }
      ],
      keyConcepts: [
        'Site surveying: Using optical auto-levels, transit levels, or laser levels to shoot elevation grade-marking and establish the project master datum.',
        'Batter boards: Proper setup outside the excavation lines to anchor layout strings, allowing the foundation layout to be re-established after excavation.',
        '3-4-5 squaring: Checking right angles on large footprints by pulling diagonal measurements (e.g., 6-8-10 or 9-12-15 ratios) to verify diagonals are equal.',
        'National vs Provincial Variations: Spotting key exam differences between NBC rules and local standards (e.g., OBC, BCBC) regarding frost depths, seismic anchors, and egress windows.'
      ]
    },
    {
      id: 'Block C',
      title: 'Concrete Formwork',
      weight: '14% of Exam',
      subactivities: [
        'C-6: Erects and builds footings and foundations',
        'C-7: Formwork for walls, columns, slabs, and stairs',
        'C-8: Reinforcing and placement'
      ],
      nbcCodes: [
        { section: 'NBC 9.15.3', title: 'Footing Dimensions', detail: 'Footings must rest on undisturbed soil or engineered fill below local frost depth. Minimum residential wall footings require 100 mm (4 in) thickness and 100 mm projections.' },
        { section: 'NBC 9.16', title: 'Slabs-on-Grade', detail: 'Requires 100 mm (4 in) aggregate drainage layer underneath concrete basement floors, with a minimum 0.15 mm (6 mil) polyethylene vapor barrier.' }
      ],
      formulas: [
        { name: 'Concrete Footing Volume (Cubic Yards)', formula: 'Volume = (Length * Width * Thickness in feet) / 27', desc: 'Standard volume calculation to order raw ready-mix concrete. Multiply by 1.10 to add a 10% waste factor.' },
        { name: 'Hydrostatic Wall Pressure', formula: 'P = Density of concrete (150 lb/ft³ or 2400 kg/m³) * Height of Wet Concrete Pour', desc: 'Determines form ties density and spacing requirement along vertical formwork bases.' }
      ],
      keyConcepts: [
        'Footing dimensions: Aligning projections with the wall thickness, typically requiring the footing width to be double the foundation wall thickness.',
        'ICF (Insulated Concrete Forms): Erecting polystyrene interlocking blocks, reinforcing with horizontal/vertical steel, and pouring concrete in controlled lifts to prevent blowouts.',
        'Slump tests: Conducting standard ASTM slump cone tests on site to measure workability, consistency, and water-cement ratios of ready-mix concrete.',
        'Rebar clearance: Standard concrete coverage rules (typically 75 mm / 3 in against undisturbed soil, 50 mm / 2 in inside forms exposed to weather, 40 mm inside dry environments).'
      ]
    },
    {
      id: 'Block D',
      title: 'Framing',
      weight: '28% of Exam',
      subactivities: [
        'D-9: Floor framing layout, joists, and subfloor',
        'D-10: Wall framing, studs, headers, and sheathing',
        'D-11: Roof framing, rafters, trusses, and ceiling joists',
        'D-12: Stair framing and staircases'
      ],
      nbcCodes: [
        { section: 'NBC 9.23.14', title: 'Rafter and Joist Spacing', detail: 'Requires specific spacing alignments, bridging and strapping. Bridging is required for spans exceeding 2.1 meters (7 feet).' },
        { section: 'NBC 9.8.4', title: 'Private Stairs Riser/Tread limits', detail: 'Private stairs maximum riser is 200 mm (7-7/8 in), minimum run is 255 mm (10 in), with a recommended comfortable run of 275 mm (10-13/16 in).' },
        { section: 'NBC 9.23.5', title: 'Notching and Drilling Limits', detail: 'Notches in wood joists must not exceed 1/6 of the depth and must not be located in the middle 1/3 of the span. Holes must be kept at least 50 mm (2 in) from the top/bottom edges.' }
      ],
      formulas: [
        { name: 'Stair Unit Riser Calculation', formula: 'Unit Riser = Total Rise / Target Number of Risers', desc: 'Target riser is normally around 175 mm (7 in / 6-7/8 in). Standard guideline is (2 * Riser) + Run = 600 mm to 635 mm (23-5/8 in to 25 in).' },
        { name: 'Rafter Theoretical Line Length', formula: 'Line Length = Run * Sqrt(1 + (Pitch/12)²)', desc: 'Multiply horizontal run by the unit factor. Adjust for ridge board (subtract half the ridge thickness).' }
      ],
      keyConcepts: [
        'Floor joist notching limits: Understanding strict structural rules for cutting, notching, or drilling structural lumber without causing structural failures.',
        'Bearing walls: Identifying load pathways, double top plates, king studs, trimmer studs to transfer vertical weight down to the foundation.',
        'Roof framing geometry: Solving the common, hip, valley, and jack rafter line lengths, plumb cuts, seat cuts, and birdsmouth layout proportions.',
        'Stair geometry limitations: Ensuring minimum tread headroom of 1950 mm (6 ft 5 in) and uniform risers to prevent tripping hazards.'
      ]
    },
    {
      id: 'Block E',
      title: 'Exterior Finish',
      weight: '14% of Exam',
      subactivities: [
        'E-13: Roofing and flashing installation',
        'E-14: Wall cladding, siding, trim, and flashing',
        'E-15: Exterior doors and windows'
      ],
      nbcCodes: [
        { section: 'NBC 9.27', title: 'Cladding and Wall Membranes', detail: 'Mandates a continuous weather barrier (sheathing paper or housewrap) under wood, vinyl, or metal siding with a 100 mm (4 in) lap.' },
        { section: 'NBC 9.26', title: 'Roofing and Water Shingles', detail: 'Specifies ice-and-water shield extending at least 900 mm (36 in) up the roof slope from the eave line for freeze-thaw damage protection.' }
      ],
      formulas: [
        { name: 'Roof Shingle Estimation (Squares)', formula: 'Squares = (Total Roof Area in Sq Ft) / 100', desc: 'A square equals 100 sq ft. There are typically 3 bundles of asphalt shingles in a single square.' }
      ],
      keyConcepts: [
        'Building envelope: Controlling heat, air, and moisture movement across structural zones using exterior wraps and correct flashing overlays.',
        'Vapour barriers: Proper placement on the warm side of the insulation (interior in cold climates) with a maximum vapour permeance rating of 60 ng/(Pa·s·m²).',
        'Window flashing: Installing pan flashing, self-adhering membrane flashing, and head flashing/drip cap in a shingled manner to drain water outwards.',
        'Siding laps: Standard overlap requirements (e.g., minimum 25 mm overlap for bevel siding, blind nailing techniques, and expansion gaps for vinyl siding).'
      ]
    },
    {
      id: 'Block F',
      title: 'Interior Finish',
      weight: '13% of Exam',
      subactivities: [
        'F-16: Interior walls, partitions, and gypsum board',
        'F-17: Cabinetry, trim, moldings, and doors',
        'F-18: Finish flooring materials'
      ],
      nbcCodes: [
        { section: 'NBC 9.29.5', title: 'Gypsum Board Finish requirements', detail: 'Specifies board thickness and screw spacing (300 mm o.c. / 12 in o.c. for ceilings, 400 mm o.c. / 16 in o.c. for walls) to ensure adequate strength.' },
        { section: 'NBC 9.10.13', title: 'Interior Finishes and Fire Spreads', detail: 'Regulates flame-spread ratings for wall and ceiling finishes to delay fire transmission.' }
      ],
      formulas: [
        { name: 'Linear Baseboard Take-off', formula: 'Baseboard = Room Perimeter - Door Opening Widths + 10% Waste Factor', desc: 'Calculates the necessary amount of linear trim molding to order.' }
      ],
      keyConcepts: [
        'Drywall hanging orientations: Hanging panels perpendicular to framing to maximize structural strength and bridge irregular studs, with offset joints.',
        'Door installation clearances: Standard gaps around door slabs (approx 2 mm on hinge/top, 3 mm on latch side, and 12-19 mm threshold clearance for HVAC air returns).',
        'Trim and coping techniques: Hand-coping inside joints of baseboards or crown molding using a coping saw to create seamless joints that withstand wood shrinkage.',
        'Finish flooring prep: Checking subfloor flatness (typically max 3 mm variation over 3 m) and moisture content before installing hardwood or laminate.'
      ]
    },
    {
      id: 'Block G',
      title: 'Renovations',
      weight: '11% of Exam',
      subactivities: [
        'G-19: Demolition and structural shoring',
        'G-20: Framing structural tie-ins and underpinning'
      ],
      nbcCodes: [
        { section: 'NBC 9.12', title: 'Excavation and Foundation Renovation', detail: 'Requires strict shoring of excavations exceeding 1.2 m (4 feet) depth. Structural underpinning must be supervised by a structural engineer.' },
        { section: 'NBC 9.23.13', title: 'Alteration of Wood Framing', detail: 'Altering load-bearing walls requires temporary support walls and engineered lumber (LVL/PSL) to distribute structural headers.' }
      ],
      formulas: [
        { name: 'Deflection Safety Limit', formula: 'L / 360', desc: 'Maximum allowable structural deflection for floor joists under standard live loads under NBC requirements.' }
      ],
      keyConcepts: [
        'Load-bearing wall identification: Tracing load paths from the rafters/trusses down through studs, joists, beams, columns, directly to the footings.',
        'Shoring techniques: Erecting temporary support walls (often using adjustable jacks and temporary double top plates) before cutting structural framing members.',
        'Asbestos & Lead awareness: Proper identification of legacy building materials (e.g., vermiculite insulation, lead paint, popcorn ceilings) and compliance with safety regulations.',
        'Tie-ins & Underpinning: Safely connecting new rooflines or foundations to old existing structures using expansion joints and sequential concrete underpinning pads.'
      ]
    }
  ]

  const [selectedBlockId, setSelectedBlockId] = useState(null) // Start with Curriculum Overview
  const [quickRefBlockId, setQuickRefBlockId] = useState(null)
  const [noteText, setNoteText] = useState('')
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Auto-scroll or focus on study block recommended by Quiz Engine
  useEffect(() => {
    if (focusedStudyBlock) {
      setSelectedBlockId(focusedStudyBlock)
      setFocusedStudyBlock(null)
    }
  }, [focusedStudyBlock, setFocusedStudyBlock])

  const activeBlock = selectedBlockId ? blocksList.find(b => b.id === selectedBlockId) : null

  // Sync note text when block changes
  useEffect(() => {
    if (selectedBlockId) {
      setNoteText(personalNotes[selectedBlockId] || '')
    } else {
      setNoteText('')
    }
    setSaveSuccess(false)
  }, [selectedBlockId, personalNotes])

  const handleSaveNote = () => {
    if (selectedBlockId) {
      saveNote(selectedBlockId, noteText)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 2000)
    }
  }

  // Filter questions for the selected Block
  const blockQuestions = selectedBlockId ? questionsData.filter(q => q.block === selectedBlockId) : []


  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-5 gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-brand-500 font-extrabold flex items-center gap-1">
            <BookOpen size={12} /> Curriculum Portal
          </span>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">RSOS Study Modules</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Master the Red Seal Occupational Standard (RSOS) Major Work Activities A through G.
          </p>
        </div>

        {/* BOOKMARK SUMMARY DROPDOWN */}
        {(bookmarks || []).length > 0 && (
          <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-800/50 rounded-xl p-3 flex items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <BookmarkCheck className="text-emerald-500" size={20} />
              <div className="text-left">
                <p className="text-xs font-black text-emerald-800 dark:text-emerald-400">Review Bookmarks</p>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-500">{(bookmarks || []).length} saved questions/terms</p>
              </div>
            </div>
            <button 
              onClick={() => setActiveTab('dashboard')}
              className="text-xs bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-1 px-2.5 rounded-lg transition-colors min-h-[36px]"
            >
              Search Saved
            </button>
          </div>
        )}
      </div>

      {/* TWO COLUMNS WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: BLOCKS SWITCHER */}
        <div className="lg:col-span-3 space-y-4">
          <div className="space-y-1.5">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2 mb-1">Technical References</p>
            <div className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible pb-1 lg:pb-0 gap-2 scrollbar-none">
              {/* NBC SPAN TABLES */}
              <button
                onClick={() => setSelectedBlockId('span_tables')}
                className={`
                  text-left px-4 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap lg:whitespace-normal
                  flex flex-col items-start min-h-[58px] border shrink-0 lg:w-full
                  ${selectedBlockId === 'span_tables' 
                    ? 'bg-brand-500 text-white border-brand-600 shadow-md scale-[1.01]' 
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850'
                  }
                `}
              >
                <div className="flex justify-between w-full items-center">
                  <span className="text-xs opacity-90 uppercase tracking-wider font-extrabold flex items-center gap-1.5">
                    📊 NBC Span Tables
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-black ${selectedBlockId === 'span_tables' ? 'bg-brand-600 text-brand-100' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                    9.23
                  </span>
                </div>
                <span className="truncate w-full block mt-1 text-[11px] opacity-80">Joist & Rafter Allowable Spans</span>
              </button>

              {/* BLUEPRINT PDF VIEWER */}
              <button
                onClick={() => setSelectedBlockId('blueprints')}
                className={`
                  text-left px-4 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap lg:whitespace-normal
                  flex flex-col items-start min-h-[58px] border shrink-0 lg:w-full
                  ${selectedBlockId === 'blueprints' 
                    ? 'bg-brand-500 text-white border-brand-600 shadow-md scale-[1.01]' 
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850'
                  }
                `}
              >
                <div className="flex justify-between w-full items-center">
                  <span className="text-xs opacity-90 uppercase tracking-wider font-extrabold flex items-center gap-1.5">
                    🗺️ Red Seal Blueprints
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-black ${selectedBlockId === 'blueprints' ? 'bg-brand-600 text-brand-100' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                    PDF
                  </span>
                </div>
                <span className="truncate w-full block mt-1 text-[11px] opacity-80">Interactive Technical Drawings</span>
              </button>

              {/* NBC CODE CLAUSES INDEX */}
              <button
                onClick={() => setSelectedBlockId('nbc_clauses')}
                className={`
                  text-left px-4 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap lg:whitespace-normal
                  flex flex-col items-start min-h-[58px] border shrink-0 lg:w-full
                  ${selectedBlockId === 'nbc_clauses' 
                    ? 'bg-brand-500 text-white border-brand-600 shadow-md scale-[1.01]' 
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850'
                  }
                `}
              >
                <div className="flex justify-between w-full items-center">
                  <span className="text-xs opacity-90 uppercase tracking-wider font-extrabold flex items-center gap-1.5">
                    📖 NBC Code Clauses
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-black ${selectedBlockId === 'nbc_clauses' ? 'bg-brand-600 text-brand-100' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                    INDEX
                  </span>
                </div>
                <span className="truncate w-full block mt-1 text-[11px] opacity-80">Search National Building Code</span>
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2 mb-1">Activities A-G</p>
            <div className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 gap-2 scrollbar-none">
              <button
                onClick={() => setSelectedBlockId(null)}
                className={`
                  text-left px-4 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap lg:whitespace-normal
                  flex flex-col items-start min-h-[58px] border shrink-0 lg:w-full
                  ${selectedBlockId === null 
                    ? 'bg-brand-500 text-white border-brand-600 shadow-md scale-[1.01]' 
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850'
                  }
                `}
              >
              <div className="flex justify-between w-full items-center">
                <span className="text-xs opacity-80 uppercase tracking-wider font-extrabold flex items-center gap-1">
                  <Trophy size={12} className={selectedBlockId === null ? 'text-amber-300' : 'text-slate-400'} /> Overview
                </span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-black ${selectedBlockId === null ? 'bg-brand-600 text-brand-100' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                  ALL
                </span>
              </div>
              <span className="truncate w-full block mt-1 text-sm">Competency Checklist</span>
            </button>

            {blocksList.map((block) => (
              <button
                key={block.id}
                onClick={() => setSelectedBlockId(block.id)}
                className={`
                  text-left px-4 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap lg:whitespace-normal
                  flex flex-col items-start min-h-[58px] border shrink-0 lg:w-full
                  ${selectedBlockId === block.id 
                    ? 'bg-brand-500 text-white border-brand-600 shadow-md scale-[1.01]' 
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850'
                  }
                `}
              >
                <div className="flex justify-between w-full items-center">
                  <span className="text-xs opacity-80 uppercase tracking-wider font-extrabold">{block.id}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-black ${selectedBlockId === block.id ? 'bg-brand-600 text-brand-100' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                    {block.weight}
                  </span>
                </div>
                <span className="truncate w-full block mt-1 text-sm">{block.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

        {/* RIGHT COLUMN: CORE MODULE CONTENT */}
        <div className="lg:col-span-9 space-y-6">
          {selectedBlockId === null ? (
            <StudyModules 
              onSelectBlock={(id) => setSelectedBlockId(id)} 
              onOpenQuickRef={(id) => setQuickRefBlockId(id)} 
            />
          ) : selectedBlockId === 'span_tables' ? (
            <NBCSpanTables />
          ) : selectedBlockId === 'blueprints' ? (
            <BlueprintViewer />
          ) : selectedBlockId === 'nbc_clauses' ? (
            <NBCClausesIndex 
              onLaunchQuizWithQuestions={(questions) => {
                setCustomQuizQuestions(questions.map(q => q.id))
                setActiveTab('quiz')
              }}
            />
          ) : (
            <>
              {/* HEADER DETAILS CARD */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 dark:border-slate-800 pb-3 gap-3">
                  <div>
                    <span className="text-xs font-black text-brand-500 uppercase">{activeBlock.id} Detail View</span>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{activeBlock.title}</h3>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                    <button
                      onClick={() => setQuickRefBlockId(activeBlock.id)}
                      className="flex-1 sm:flex-initial bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black uppercase tracking-wider py-2 px-3 rounded-xl transition-colors flex items-center justify-center gap-1.5 min-h-[38px] shadow-sm"
                    >
                      <Layers size={14} />
                      <span>Quick Reference</span>
                    </button>
                    <span className="text-xs bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-xl font-black text-slate-500 shrink-0">
                      Weight: {activeBlock.weight}
                    </span>
                  </div>
                </div>

                {/* SUBACTIVITIES list */}
                <div className="space-y-2">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">RSOS Sub-Activities</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {activeBlock.subactivities.map((sub, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-xs bg-slate-50 dark:bg-slate-850 p-2.5 rounded-lg text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-800">
                        <ChevronRight size={14} className="text-brand-500 shrink-0" />
                        <span className="font-semibold">{sub}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* DUAL COLUMN DETAILS (NBC vs MATH FORMULAS) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* NBC CODES COMPONENT */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <AlertCircle size={14} className="text-brand-500" /> National Building Code (NBC) Regulations
                  </h4>
                  <div className="space-y-4">
                    {activeBlock.nbcCodes.map((code, idx) => (
                      <div key={idx} className="bg-slate-50 dark:bg-slate-850 p-4 rounded-xl space-y-1.5 border border-slate-100 dark:border-slate-800">
                        <div className="flex justify-between text-xs font-black">
                          <span className="text-brand-500 font-mono">{code.section}</span>
                          <span className="text-slate-500">{code.title}</span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
                          <HighlightedText text={code.detail} />
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* FRAMING MATH & FORMULAS */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Code size={14} className="text-emerald-500" /> Math Formulas & Layout Factors
                  </h4>
                  <div className="space-y-4">
                    {activeBlock.formulas.map((f, idx) => (
                      <div key={idx} className="bg-slate-50 dark:bg-slate-850 p-4 rounded-xl space-y-2 border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-slate-800 dark:text-slate-100">{f.name}</span>
                        </div>
                        <div className="p-2.5 bg-emerald-500/10 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-lg text-sm font-black text-center border border-emerald-500/20 font-mono">
                          {f.formula}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                          <HighlightedText text={f.desc} />
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* BLOCK A PREMIUM STUDY GUIDE NOTES */}
              {selectedBlockId === 'Block A' && (
                <div className="bg-gradient-to-r from-brand-500/10 to-blue-500/10 dark:from-brand-950/20 dark:to-blue-950/20 p-6 rounded-2xl shadow-sm border border-brand-500/20 dark:border-brand-500/30 space-y-6">
                  <div className="flex items-center space-x-3 border-b border-brand-500/20 pb-4">
                    <div className="bg-blue-600 text-white p-2.5 rounded-xl">
                      <BookOpen size={20} />
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">Premium Study Material</span>
                      <h4 className="text-lg font-black text-slate-900 dark:text-white">Expert Red Seal Carpenter Occupational Skills Notes</h4>
                    </div>
                  </div>

                  <div className="columns-1 md:columns-2 gap-6 space-y-6 [column-fill:_balance]">
                    {/* PPE Requirements */}
                    <div className="bg-white dark:bg-slate-900/60 p-5 rounded-xl border border-slate-200/60 dark:border-slate-800/60 space-y-3 break-inside-avoid">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-blue-500 uppercase font-mono">CSA Z94.1 & Z195</span>
                        <span className="text-xs font-bold text-slate-400">Section 1</span>
                      </div>
                      <h5 className="font-extrabold text-slate-900 dark:text-white text-sm">{blockAGuide.comprehensiveNotes.ppeAndSafety.title}</h5>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
                        {blockAGuide.comprehensiveNotes.ppeAndSafety.details}
                      </p>
                      <div className="bg-blue-500/5 p-3 rounded-lg border border-blue-500/10 space-y-1.5">
                        <p className="text-[10px] font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Mandatory PPE Rules</p>
                        <ul className="list-disc list-inside text-[11px] text-slate-500 dark:text-slate-400 space-y-1 font-semibold">
                          {blockAGuide.nbcPart9References[0].rules.map((rule, rIdx) => (
                            <li key={rIdx}>{rule}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* WHMIS & SDS */}
                    <div className="bg-white dark:bg-slate-900/60 p-5 rounded-xl border border-slate-200/60 dark:border-slate-800/60 space-y-3 break-inside-avoid">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-blue-500 uppercase font-mono">WHMIS 2015</span>
                        <span className="text-xs font-bold text-slate-400">Section 2</span>
                      </div>
                      <h5 className="font-extrabold text-slate-900 dark:text-white text-sm">{blockAGuide.comprehensiveNotes.whmisAndMaterials.title}</h5>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
                        {blockAGuide.comprehensiveNotes.whmisAndMaterials.details}
                      </p>
                      <div className="bg-red-500/5 p-3 rounded-lg border border-red-500/10 space-y-1.5">
                        <p className="text-[10px] font-extrabold text-red-600 dark:text-red-400 uppercase tracking-wider">Hazardous Materials Management</p>
                        <ul className="list-disc list-inside text-[11px] text-slate-500 dark:text-slate-400 space-y-1 font-semibold">
                          {blockAGuide.nbcPart9References[1].rules.map((rule, rIdx) => (
                            <li key={rIdx}>{rule}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Fall Arrest Systems */}
                    <div className="bg-white dark:bg-slate-900/60 p-5 rounded-xl border border-slate-200/60 dark:border-slate-800/60 space-y-3 break-inside-avoid">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-blue-500 uppercase font-mono">CSA Z259 / OHS</span>
                        <span className="text-xs font-bold text-slate-400">Section 3</span>
                      </div>
                      <h5 className="font-extrabold text-slate-900 dark:text-white text-sm">{blockAGuide.comprehensiveNotes.fallArrest.title}</h5>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
                        {blockAGuide.comprehensiveNotes.fallArrest.details}
                      </p>
                      <div className="bg-amber-500/5 p-3 rounded-lg border border-amber-500/10 space-y-1.5">
                        <p className="text-[10px] font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Fall Prevention & Clearance Rules</p>
                        <ul className="list-disc list-inside text-[11px] text-slate-500 dark:text-slate-400 space-y-1 font-semibold">
                          {blockAGuide.nbcPart9References[2].rules.map((rule, rIdx) => (
                            <li key={rIdx}>{rule}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Power Tools & Equipment */}
                    <div className="bg-white dark:bg-slate-900/60 p-5 rounded-xl border border-slate-200/60 dark:border-slate-800/60 space-y-3 break-inside-avoid">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-blue-500 uppercase font-mono">CSA Z114</span>
                        <span className="text-xs font-bold text-slate-400">Section 4</span>
                      </div>
                      <h5 className="font-extrabold text-slate-900 dark:text-white text-sm">{blockAGuide.comprehensiveNotes.toolsAndEquipment.title}</h5>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
                        {blockAGuide.comprehensiveNotes.toolsAndEquipment.details}
                      </p>
                      <div className="bg-purple-500/5 p-3 rounded-lg border border-purple-500/10 space-y-1.5">
                        <p className="text-[10px] font-extrabold text-purple-600 dark:text-purple-400 uppercase tracking-wider">Power & Pneumatic Safety</p>
                        <ul className="list-disc list-inside text-[11px] text-slate-500 dark:text-slate-400 space-y-1 font-semibold">
                          {blockAGuide.nbcPart9References[3].rules.map((rule, rIdx) => (
                            <li key={rIdx}>{rule}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Blueprint Reading */}
                    <div className="bg-white dark:bg-slate-900/60 p-5 rounded-xl border border-slate-200/60 dark:border-slate-800/60 space-y-3 break-inside-avoid">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-blue-500 uppercase font-mono">Drawing Conventions</span>
                        <span className="text-xs font-bold text-slate-400">Section 5</span>
                      </div>
                      <h5 className="font-extrabold text-slate-900 dark:text-white text-sm">{blockAGuide.comprehensiveNotes.blueprintReading.title}</h5>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
                        {blockAGuide.comprehensiveNotes.blueprintReading.details}
                      </p>
                      <div className="bg-emerald-500/5 p-3 rounded-lg border border-emerald-500/10 space-y-1.5">
                        <p className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Blueprint & Drawing Interpretations</p>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-semibold list-disc list-inside">
                          {blockAGuide.nbcPart9References[4].rules.map((rule, rIdx) => (
                            <li key={rIdx}>{rule}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* BLOCK B PREMIUM STUDY GUIDE NOTES */}
              {selectedBlockId === 'Block B' && (
                <div className="bg-gradient-to-r from-brand-500/10 to-indigo-500/10 dark:from-brand-950/20 dark:to-indigo-950/20 p-6 rounded-2xl shadow-sm border border-brand-500/20 dark:border-brand-500/30 space-y-6">
                  <div className="flex items-center space-x-3 border-b border-brand-500/20 pb-4">
                    <div className="bg-indigo-600 text-white p-2.5 rounded-xl">
                      <BookOpen size={20} />
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Premium Study Material</span>
                      <h4 className="text-lg font-black text-slate-900 dark:text-white">Expert Red Seal Carpenter Planning & Layout Notes</h4>
                    </div>
                  </div>

                  <div className="columns-1 md:columns-2 gap-6 space-y-6 [column-fill:_balance]">
                    {/* Surveying & Elevation Math */}
                    <div className="bg-white dark:bg-slate-900/60 p-5 rounded-xl border border-slate-200/60 dark:border-slate-800/60 space-y-3 break-inside-avoid">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-indigo-500 uppercase font-mono">Survey Math & Levels</span>
                        <span className="text-xs font-bold text-slate-400">Section 1</span>
                      </div>
                      <h5 className="font-extrabold text-slate-900 dark:text-white text-sm">{blockBGuide.comprehensiveNotes.surveyingAndLevels.title}</h5>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-semibold font-mono bg-slate-50 dark:bg-slate-900 p-2.5 rounded border border-slate-100 dark:border-slate-800">
                        {blockBGuide.comprehensiveNotes.surveyingAndLevels.details}
                      </p>
                      <div className="bg-indigo-500/5 p-3 rounded-lg border border-indigo-500/10 space-y-1.5">
                        <p className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Elevation Math Formulas</p>
                        <ul className="list-disc list-inside text-[11px] text-slate-500 dark:text-slate-400 space-y-1 font-semibold">
                          {blockBGuide.nbcPart9References[1].rules.map((rule, rIdx) => (
                            <li key={rIdx}>{rule}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Batter Boards & Squaring */}
                    <div className="bg-white dark:bg-slate-900/60 p-5 rounded-xl border border-slate-200/60 dark:border-slate-800/60 space-y-3 break-inside-avoid">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-indigo-500 uppercase font-mono">Geometric Squaring</span>
                        <span className="text-xs font-bold text-slate-400">Section 2</span>
                      </div>
                      <h5 className="font-extrabold text-slate-900 dark:text-white text-sm">{blockBGuide.comprehensiveNotes.siteLayoutAndBoards.title}</h5>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
                        {blockBGuide.comprehensiveNotes.siteLayoutAndBoards.details}
                      </p>
                      <div className="bg-amber-500/5 p-3 rounded-lg border border-amber-500/10 space-y-1.5">
                        <p className="text-[10px] font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Layout & Batter Board Rules</p>
                        <ul className="list-disc list-inside text-[11px] text-slate-500 dark:text-slate-400 space-y-1 font-semibold">
                          {blockBGuide.nbcPart9References[2].rules.map((rule, rIdx) => (
                            <li key={rIdx}>{rule}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* NBC vs OBC Regional Frost Depths */}
                    <div className="bg-white dark:bg-slate-900/60 p-5 rounded-xl border border-slate-200/60 dark:border-slate-800/60 space-y-3 break-inside-avoid">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-indigo-500 uppercase font-mono">NBC vs OBC Frost</span>
                        <span className="text-xs font-bold text-slate-400">Section 3</span>
                      </div>
                      <h5 className="font-extrabold text-slate-900 dark:text-white text-sm">{blockBGuide.comprehensiveNotes.nbcVsObcFrost.title}</h5>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
                        {blockBGuide.comprehensiveNotes.nbcVsObcFrost.details}
                      </p>
                      <div className="bg-blue-500/5 p-3 rounded-lg border border-blue-500/10 space-y-1.5">
                        <p className="text-[10px] font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Excavation & Frost Rules</p>
                        <ul className="list-disc list-inside text-[11px] text-slate-500 dark:text-slate-400 space-y-1 font-semibold">
                          {blockBGuide.nbcPart9References[0].rules.map((rule, rIdx) => (
                            <li key={rIdx}>{rule}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Excavation, Shoring & Drainage */}
                    <div className="bg-white dark:bg-slate-900/60 p-5 rounded-xl border border-slate-200/60 dark:border-slate-800/60 space-y-3 break-inside-avoid">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-indigo-500 uppercase font-mono">Excavation & Drainage</span>
                        <span className="text-xs font-bold text-slate-400">Section 4</span>
                      </div>
                      <h5 className="font-extrabold text-slate-900 dark:text-white text-sm">{blockBGuide.comprehensiveNotes.excavationDrainage.title}</h5>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
                        {blockBGuide.comprehensiveNotes.excavationDrainage.details}
                      </p>
                      <div className="bg-emerald-500/5 p-3 rounded-lg border border-emerald-500/10 space-y-1.5">
                        <p className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Foundation & Backfill Rules</p>
                        <ul className="list-disc list-inside text-[11px] text-slate-500 dark:text-slate-400 space-y-1 font-semibold">
                          {blockBGuide.nbcPart9References[3].rules.map((rule, rIdx) => (
                            <li key={rIdx}>{rule}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Building Lines & Setbacks */}
                    <div className="bg-white dark:bg-slate-900/60 p-5 rounded-xl border border-slate-200/60 dark:border-slate-800/60 space-y-3 break-inside-avoid">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-indigo-500 uppercase font-mono">Boundaries & Benchmarks</span>
                        <span className="text-xs font-bold text-slate-400">Section 5</span>
                      </div>
                      <h5 className="font-extrabold text-slate-900 dark:text-white text-sm">{blockBGuide.comprehensiveNotes.buildingLinesSetbacks.title}</h5>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
                        {blockBGuide.comprehensiveNotes.buildingLinesSetbacks.details}
                      </p>
                      <div className="bg-indigo-500/5 p-3 rounded-lg border border-indigo-500/10 space-y-1.5">
                        <p className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Property & Setback Guidelines</p>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-semibold list-disc list-inside">
                          {blockBGuide.nbcPart9References[4].rules.map((rule, rIdx) => (
                            <li key={rIdx}>{rule}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* BLOCK C PREMIUM STUDY GUIDE NOTES */}
              {selectedBlockId === 'Block C' && (
                <div className="bg-gradient-to-r from-slate-500/10 to-blue-500/10 dark:from-slate-950/20 dark:to-blue-950/20 p-6 rounded-2xl shadow-sm border border-slate-500/20 dark:border-slate-500/30 space-y-6">
                  <div className="flex items-center space-x-3 border-b border-slate-500/20 pb-4">
                    <div className="bg-slate-600 text-white p-2.5 rounded-xl">
                      <BookOpen size={20} />
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">Premium Study Material (16% Weight)</span>
                      <h4 className="text-lg font-black text-slate-900 dark:text-white">Expert Red Seal Carpenter Concrete Formwork Notes</h4>
                    </div>
                  </div>

                  <div className="columns-1 md:columns-2 gap-6 space-y-6 [column-fill:_balance]">
                    {/* Footings & Steps */}
                    <div className="bg-white dark:bg-slate-900/60 p-5 rounded-xl border border-slate-200/60 dark:border-slate-800/60 space-y-3 break-inside-avoid">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-blue-500 uppercase font-mono">Structural Steps</span>
                        <span className="text-xs font-bold text-slate-400">Section 1</span>
                      </div>
                      <h5 className="font-extrabold text-slate-900 dark:text-white text-sm">{blockCGuide.comprehensiveNotes.footingsAndSteps.title}</h5>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
                        {blockCGuide.comprehensiveNotes.footingsAndSteps.details}
                      </p>
                      <div className="bg-blue-500/5 p-3 rounded-lg border border-blue-500/10 space-y-1.5">
                        <p className="text-[10px] font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Footing & Step Standards</p>
                        <ul className="list-disc list-inside text-[11px] text-slate-500 dark:text-slate-400 space-y-1 font-semibold">
                          {blockCGuide.nbcPart9References[0].rules.map((rule, rIdx) => (
                            <li key={rIdx}>{rule}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Slump & Clearance */}
                    <div className="bg-white dark:bg-slate-900/60 p-5 rounded-xl border border-slate-200/60 dark:border-slate-800/60 space-y-3 break-inside-avoid">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-blue-500 uppercase font-mono">Workability & Steel</span>
                        <span className="text-xs font-bold text-slate-400">Section 2</span>
                      </div>
                      <h5 className="font-extrabold text-slate-900 dark:text-white text-sm">{blockCGuide.comprehensiveNotes.slumpAndClearance.title}</h5>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-semibold font-mono bg-slate-50 dark:bg-slate-900 p-2.5 rounded border border-slate-100 dark:border-slate-800">
                        {blockCGuide.comprehensiveNotes.slumpAndClearance.details}
                      </p>
                      <div className="bg-indigo-500/5 p-3 rounded-lg border border-indigo-500/10 space-y-1.5">
                        <p className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">CSA Concrete Testing Specs</p>
                        <ul className="list-disc list-inside text-[11px] text-slate-500 dark:text-slate-400 space-y-1 font-semibold">
                          {blockCGuide.nbcPart9References[1].rules.map((rule, rIdx) => (
                            <li key={rIdx}>{rule}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Wall Pressures */}
                    <div className="bg-white dark:bg-slate-900/60 p-5 rounded-xl border border-slate-200/60 dark:border-slate-800/60 space-y-3 break-inside-avoid">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-blue-500 uppercase font-mono">Hydrostatic Dynamics</span>
                        <span className="text-xs font-bold text-slate-400">Section 3</span>
                      </div>
                      <h5 className="font-extrabold text-slate-900 dark:text-white text-sm">{blockCGuide.comprehensiveNotes.wallPressures.title}</h5>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
                        {blockCGuide.comprehensiveNotes.wallPressures.details}
                      </p>
                      <div className="bg-red-500/5 p-3 rounded-lg border border-red-500/10 space-y-1.5">
                        <p className="text-[10px] font-extrabold text-red-600 dark:text-red-400 uppercase tracking-wider">Form Pressure Control Factors</p>
                        <ul className="list-disc list-inside text-[11px] text-slate-500 dark:text-slate-400 space-y-1 font-semibold">
                          {blockCGuide.nbcPart9References[2].rules.map((rule, rIdx) => (
                            <li key={rIdx}>{rule}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* ICF Systems */}
                    <div className="bg-white dark:bg-slate-900/60 p-5 rounded-xl border border-slate-200/60 dark:border-slate-800/60 space-y-3 break-inside-avoid">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-blue-500 uppercase font-mono">Insulated Forms (ICF)</span>
                        <span className="text-xs font-bold text-slate-400">Section 4</span>
                      </div>
                      <h5 className="font-extrabold text-slate-900 dark:text-white text-sm">{blockCGuide.comprehensiveNotes.icfSystems.title}</h5>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
                        {blockCGuide.comprehensiveNotes.icfSystems.details}
                      </p>
                      <div className="bg-amber-500/5 p-3 rounded-lg border border-amber-500/10 space-y-1.5">
                        <p className="text-[10px] font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-wider">ICF Engineering Guides</p>
                        <ul className="list-disc list-inside text-[11px] text-slate-500 dark:text-slate-400 space-y-1 font-semibold">
                          {blockCGuide.nbcPart9References[3].rules.map((rule, rIdx) => (
                            <li key={rIdx}>{rule}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Stair Forms */}
                    <div className="bg-white dark:bg-slate-900/60 p-5 rounded-xl border border-slate-200/60 dark:border-slate-800/60 space-y-3 break-inside-avoid">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-blue-500 uppercase font-mono">Concrete Stairs</span>
                        <span className="text-xs font-bold text-slate-400">Section 5</span>
                      </div>
                      <h5 className="font-extrabold text-slate-900 dark:text-white text-sm">{blockCGuide.comprehensiveNotes.concreteStairs.title}</h5>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
                        {blockCGuide.comprehensiveNotes.concreteStairs.details}
                      </p>
                      <div className="bg-slate-500/5 p-3 rounded-lg border border-slate-500/10 space-y-1.5">
                        <p className="text-[10px] font-extrabold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Concrete Stair Geometry & Support</p>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-semibold list-disc list-inside">
                          {blockCGuide.nbcPart9References[4].rules.map((rule, rIdx) => (
                            <li key={rIdx}>{rule}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* BLOCK D PREMIUM STUDY GUIDE NOTES */}
              {selectedBlockId === 'Block D' && (
                <div className="bg-gradient-to-r from-brand-500/10 to-emerald-500/10 dark:from-brand-950/20 dark:to-emerald-950/20 p-6 rounded-2xl shadow-sm border border-brand-500/20 dark:border-brand-500/30 space-y-6">
                  <div className="flex items-center space-x-3 border-b border-brand-500/20 pb-4">
                    <div className="bg-brand-500 text-white p-2.5 rounded-xl">
                      <BookOpen size={20} />
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-brand-600 dark:text-brand-400 uppercase tracking-widest">Premium Study Material</span>
                      <h4 className="text-lg font-black text-slate-900 dark:text-white">Expert Red Seal Carpenter Framing Notes</h4>
                    </div>
                  </div>

                  <div className="columns-1 md:columns-2 gap-6 space-y-6 [column-fill:_balance]">
                    {/* Floor Framing */}
                    <div className="bg-white dark:bg-slate-900/60 p-5 rounded-xl border border-slate-200/60 dark:border-slate-800/60 space-y-3 break-inside-avoid">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-brand-500 uppercase font-mono">NBC 9.23.5</span>
                        <span className="text-xs font-bold text-slate-400">Section 1</span>
                      </div>
                      <h5 className="font-extrabold text-slate-900 dark:text-white text-sm">{blockDGuide.comprehensiveNotes.floorFraming.title}</h5>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
                        {blockDGuide.comprehensiveNotes.floorFraming.details}
                      </p>
                      <div className="bg-amber-500/5 p-3 rounded-lg border border-amber-500/10 space-y-1.5">
                        <p className="text-[10px] font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Critical Notching & Drilling Limits</p>
                        <ul className="list-disc list-inside text-[11px] text-slate-500 dark:text-slate-400 space-y-1 font-semibold">
                          {blockDGuide.nbcPart9References[0].rules.map((rule, rIdx) => (
                            <li key={rIdx}>{rule}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Wall Framing */}
                    <div className="bg-white dark:bg-slate-900/60 p-5 rounded-xl border border-slate-200/60 dark:border-slate-800/60 space-y-3 break-inside-avoid">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-brand-500 uppercase font-mono">NBC 9.23.10 & 11</span>
                        <span className="text-xs font-bold text-slate-400">Section 2</span>
                      </div>
                      <h5 className="font-extrabold text-slate-900 dark:text-white text-sm">{blockDGuide.comprehensiveNotes.wallFraming.title}</h5>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
                        {blockDGuide.comprehensiveNotes.wallFraming.details}
                      </p>
                      <div className="bg-emerald-500/5 p-3 rounded-lg border border-emerald-500/10 space-y-1.5">
                        <p className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Load Paths & Top Plate Rules</p>
                        <ul className="list-disc list-inside text-[11px] text-slate-500 dark:text-slate-400 space-y-1 font-semibold">
                          {blockDGuide.nbcPart9References[1].rules.map((rule, rIdx) => (
                            <li key={rIdx}>{rule}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Roof Framing */}
                    <div className="bg-white dark:bg-slate-900/60 p-5 rounded-xl border border-slate-200/60 dark:border-slate-800/60 space-y-3 break-inside-avoid">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-brand-500 uppercase font-mono">NBC 9.23.14</span>
                        <span className="text-xs font-bold text-slate-400">Section 3</span>
                      </div>
                      <h5 className="font-extrabold text-slate-900 dark:text-white text-sm">{blockDGuide.comprehensiveNotes.roofFraming.title}</h5>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
                        {blockDGuide.comprehensiveNotes.roofFraming.details}
                      </p>
                      <div className="bg-brand-500/5 p-3 rounded-lg border border-brand-500/10 space-y-1.5">
                        <p className="text-[10px] font-extrabold text-brand-600 dark:text-brand-400 uppercase tracking-wider">Roof Thrust & Birdsmouth Cut Limits</p>
                        <ul className="list-disc list-inside text-[11px] text-slate-500 dark:text-slate-400 space-y-1 font-semibold">
                          {blockDGuide.nbcPart9References[2].rules.map((rule, rIdx) => (
                            <li key={rIdx}>{rule}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Stair Framing */}
                    <div className="bg-white dark:bg-slate-900/60 p-5 rounded-xl border border-slate-200/60 dark:border-slate-800/60 space-y-3 break-inside-avoid">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-brand-500 uppercase font-mono">NBC 9.8.4</span>
                        <span className="text-xs font-bold text-slate-400">Section 4</span>
                      </div>
                      <h5 className="font-extrabold text-slate-900 dark:text-white text-sm">{blockDGuide.comprehensiveNotes.stairFraming.title}</h5>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
                        {blockDGuide.comprehensiveNotes.stairFraming.details}
                      </p>
                      <div className="bg-purple-500/5 p-3 rounded-lg border border-purple-500/10 space-y-1.5">
                        <p className="text-[10px] font-extrabold text-purple-600 dark:text-purple-400 uppercase tracking-wider">Stair Geometry & Headroom Limits</p>
                        <ul className="list-disc list-inside text-[11px] text-slate-500 dark:text-slate-400 space-y-1 font-semibold">
                          {blockDGuide.nbcPart9References[3].rules.map((rule, rIdx) => (
                            <li key={rIdx}>{rule}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* BLOCK E PREMIUM STUDY GUIDE NOTES */}
              {selectedBlockId === 'Block E' && (
                <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 dark:from-blue-950/20 dark:to-indigo-950/20 p-6 rounded-2xl shadow-sm border border-blue-500/20 dark:border-blue-500/30 space-y-6">
                  <div className="flex items-center space-x-3 border-b border-blue-500/20 pb-4">
                    <div className="bg-blue-500 text-white p-2.5 rounded-xl">
                      <BookOpen size={20} />
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">Premium Study Material</span>
                      <h4 className="text-lg font-black text-slate-900 dark:text-white">Expert Red Seal Carpenter Building Envelope Notes</h4>
                    </div>
                  </div>

                  <div className="columns-1 md:columns-2 gap-6 space-y-6 [column-fill:_balance]">
                    {/* Building Envelope */}
                    <div className="bg-white dark:bg-slate-900/60 p-5 rounded-xl border border-slate-200/60 dark:border-slate-800/60 space-y-3 break-inside-avoid">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-blue-500 uppercase font-mono">NBC 9.25.3 & 4</span>
                        <span className="text-xs font-bold text-slate-400">Section 1</span>
                      </div>
                      <h5 className="font-extrabold text-slate-900 dark:text-white text-sm">{blockEGuide.comprehensiveNotes.buildingEnvelope.title}</h5>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
                        {blockEGuide.comprehensiveNotes.buildingEnvelope.details}
                      </p>
                      <div className="bg-blue-500/5 p-3 rounded-lg border border-blue-500/10 space-y-1.5">
                        <p className="text-[10px] font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Air, Vapour & Dew Point Controls</p>
                        <ul className="list-disc list-inside text-[11px] text-slate-500 dark:text-slate-400 space-y-1 font-semibold">
                          {blockEGuide.nbcPart9References[1].rules.map((rule, rIdx) => (
                            <li key={rIdx}>{rule}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Window & Door */}
                    <div className="bg-white dark:bg-slate-900/60 p-5 rounded-xl border border-slate-200/60 dark:border-slate-800/60 space-y-3 break-inside-avoid">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-blue-500 uppercase font-mono">NBC 9.27.3</span>
                        <span className="text-xs font-bold text-slate-400">Section 2</span>
                      </div>
                      <h5 className="font-extrabold text-slate-900 dark:text-white text-sm">{blockEGuide.comprehensiveNotes.windowAndDoor.title}</h5>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
                        {blockEGuide.comprehensiveNotes.windowAndDoor.details}
                      </p>
                      <div className="bg-amber-500/5 p-3 rounded-lg border border-amber-500/10 space-y-1.5">
                        <p className="text-[10px] font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Sill Pan, Flashing & Shims</p>
                        <ul className="list-disc list-inside text-[11px] text-slate-500 dark:text-slate-400 space-y-1 font-semibold">
                          {blockEGuide.nbcPart9References[0].rules.map((rule, rIdx) => (
                            <li key={rIdx}>{rule}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Wall Cladding */}
                    <div className="bg-white dark:bg-slate-900/60 p-5 rounded-xl border border-slate-200/60 dark:border-slate-800/60 space-y-3 break-inside-avoid">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-blue-500 uppercase font-mono">NBC 9.27.5 & 2</span>
                        <span className="text-xs font-bold text-slate-400">Section 3</span>
                      </div>
                      <h5 className="font-extrabold text-slate-900 dark:text-white text-sm">{blockEGuide.comprehensiveNotes.wallCladding.title}</h5>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
                        {blockEGuide.comprehensiveNotes.wallCladding.details}
                      </p>
                      <div className="bg-emerald-500/5 p-3 rounded-lg border border-emerald-500/10 space-y-1.5">
                        <p className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Siding Lap & Thermal Expansion</p>
                        <ul className="list-disc list-inside text-[11px] text-slate-500 dark:text-slate-400 space-y-1 font-semibold">
                          {blockEGuide.nbcPart9References[2].rules.map((rule, rIdx) => (
                            <li key={rIdx}>{rule}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Roof Covering */}
                    <div className="bg-white dark:bg-slate-900/60 p-5 rounded-xl border border-slate-200/60 dark:border-slate-800/60 space-y-3 break-inside-avoid">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-blue-500 uppercase font-mono">NBC 9.26.5 & 7</span>
                        <span className="text-xs font-bold text-slate-400">Section 4</span>
                      </div>
                      <h5 className="font-extrabold text-slate-900 dark:text-white text-sm">{blockEGuide.comprehensiveNotes.roofCovering.title}</h5>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
                        {blockEGuide.comprehensiveNotes.roofCovering.details}
                      </p>
                      <div className="bg-indigo-500/5 p-3 rounded-lg border border-indigo-500/10 space-y-1.5">
                        <p className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Shingles, Drip Edge & Eave Protection</p>
                        <ul className="list-disc list-inside text-[11px] text-slate-500 dark:text-slate-400 space-y-1 font-semibold">
                          {blockEGuide.nbcPart9References[3].rules.map((rule, rIdx) => (
                            <li key={rIdx}>{rule}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* BLOCK F PREMIUM STUDY GUIDE NOTES */}
              {selectedBlockId === 'Block F' && (
                <div className="bg-gradient-to-r from-teal-500/10 to-emerald-500/10 dark:from-teal-950/20 dark:to-emerald-950/20 p-6 rounded-2xl shadow-sm border border-teal-500/20 dark:border-teal-500/30 space-y-6">
                  <div className="flex items-center space-x-3 border-b border-teal-500/20 pb-4">
                    <div className="bg-teal-500 text-white p-2.5 rounded-xl">
                      <BookOpen size={20} />
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-teal-600 dark:text-teal-400 uppercase tracking-widest">Premium Study Material</span>
                      <h4 className="text-lg font-black text-slate-900 dark:text-white">Expert Red Seal Carpenter Interior Finish Notes</h4>
                    </div>
                  </div>

                  <div className="columns-1 md:columns-2 gap-6 space-y-6 [column-fill:_balance]">
                    {/* Drywall */}
                    <div className="bg-white dark:bg-slate-900/60 p-5 rounded-xl border border-slate-200/60 dark:border-slate-800/60 space-y-3 break-inside-avoid">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-teal-500 uppercase font-mono">NBC 9.29.5</span>
                        <span className="text-xs font-bold text-slate-400">Section 1</span>
                      </div>
                      <h5 className="font-extrabold text-slate-900 dark:text-white text-sm">{blockFGuide.comprehensiveNotes.drywall.title}</h5>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
                        {blockFGuide.comprehensiveNotes.drywall.details}
                      </p>
                      <div className="bg-teal-500/5 p-3 rounded-lg border border-teal-500/10 space-y-1.5">
                        <p className="text-[10px] font-extrabold text-teal-600 dark:text-teal-400 uppercase tracking-wider">Drywall Fastening & Screws o.c.</p>
                        <ul className="list-disc list-inside text-[11px] text-slate-500 dark:text-slate-400 space-y-1 font-semibold">
                          {blockFGuide.nbcPart9References[0].rules.map((rule, rIdx) => (
                            <li key={rIdx}>{rule}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Door installation */}
                    <div className="bg-white dark:bg-slate-900/60 p-5 rounded-xl border border-slate-200/60 dark:border-slate-800/60 space-y-3 break-inside-avoid">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-teal-500 uppercase font-mono">NBC 9.10.9 & 13</span>
                        <span className="text-xs font-bold text-slate-400">Section 2</span>
                      </div>
                      <h5 className="font-extrabold text-slate-900 dark:text-white text-sm">{blockFGuide.comprehensiveNotes.doors.title}</h5>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
                        {blockFGuide.comprehensiveNotes.doors.details}
                      </p>
                      <div className="bg-amber-500/5 p-3 rounded-lg border border-amber-500/10 space-y-1.5">
                        <p className="text-[10px] font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Door Frame & Fire Separations</p>
                        <ul className="list-disc list-inside text-[11px] text-slate-500 dark:text-slate-400 space-y-1 font-semibold">
                          {blockFGuide.nbcPart9References[2].rules.map((rule, rIdx) => (
                            <li key={rIdx}>{rule}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Trim Carpentry */}
                    <div className="bg-white dark:bg-slate-900/60 p-5 rounded-xl border border-slate-200/60 dark:border-slate-800/60 space-y-3 break-inside-avoid">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-teal-500 uppercase font-mono">Precision Joinery</span>
                        <span className="text-xs font-bold text-slate-400">Section 3</span>
                      </div>
                      <h5 className="font-extrabold text-slate-900 dark:text-white text-sm">{blockFGuide.comprehensiveNotes.trim.title}</h5>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
                        {blockFGuide.comprehensiveNotes.trim.details}
                      </p>
                      <div className="bg-emerald-500/5 p-3 rounded-lg border border-emerald-500/10 space-y-1.5">
                        <p className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Coping vs Mitering Standards</p>
                        <ul className="list-disc list-inside text-[11px] text-slate-500 dark:text-slate-400 space-y-1 font-semibold">
                          {blockFGuide.nbcPart9References[3].rules.map((rule, rIdx) => (
                            <li key={rIdx}>{rule}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Stair Finish */}
                    <div className="bg-white dark:bg-slate-900/60 p-5 rounded-xl border border-slate-200/60 dark:border-slate-800/60 space-y-3 break-inside-avoid">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-teal-500 uppercase font-mono">NBC 9.8.7 & 8</span>
                        <span className="text-xs font-bold text-slate-400">Section 4</span>
                      </div>
                      <h5 className="font-extrabold text-slate-900 dark:text-white text-sm">{blockFGuide.comprehensiveNotes.stairs.title}</h5>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
                        {blockFGuide.comprehensiveNotes.stairs.details}
                      </p>
                      <div className="bg-purple-500/5 p-3 rounded-lg border border-purple-500/10 space-y-1.5">
                        <p className="text-[10px] font-extrabold text-purple-600 dark:text-purple-400 uppercase tracking-wider">Stair Rails & Guards Safety</p>
                        <ul className="list-disc list-inside text-[11px] text-slate-500 dark:text-slate-400 space-y-1 font-semibold">
                          {blockFGuide.nbcPart9References[1].rules.map((rule, rIdx) => (
                            <li key={rIdx}>{rule}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* BLOCK G PREMIUM STUDY GUIDE NOTES */}
              {selectedBlockId === 'Block G' && (
                <div className="bg-gradient-to-r from-amber-500/10 to-rose-500/10 dark:from-amber-950/20 dark:to-rose-950/20 p-6 rounded-2xl shadow-sm border border-amber-500/20 dark:border-amber-500/30 space-y-6">
                  <div className="flex items-center space-x-3 border-b border-amber-500/20 pb-4">
                    <div className="bg-amber-500 text-white p-2.5 rounded-xl">
                      <BookOpen size={20} />
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest">Premium Study Material</span>
                      <h4 className="text-lg font-black text-slate-900 dark:text-white">Expert Red Seal Carpenter Renovations & Retrofit Notes</h4>
                    </div>
                  </div>

                  <div className="columns-1 md:columns-2 gap-6 space-y-6 [column-fill:_balance]">
                    {/* Load Bearing */}
                    <div className="bg-white dark:bg-slate-900/60 p-5 rounded-xl border border-slate-200/60 dark:border-slate-800/60 space-y-3 break-inside-avoid">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-amber-500 uppercase font-mono">Load Paths</span>
                        <span className="text-xs font-bold text-slate-400">Section 1</span>
                      </div>
                      <h5 className="font-extrabold text-slate-900 dark:text-white text-sm">{blockGGuide.comprehensiveNotes.loadBearing.title}</h5>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
                        {blockGGuide.comprehensiveNotes.loadBearing.details}
                      </p>
                      <div className="bg-amber-500/5 p-3 rounded-lg border border-amber-500/10 space-y-1.5">
                        <p className="text-[10px] font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Concentrated Point Loads (NBC 9.23.9.4)</p>
                        <ul className="list-disc list-inside text-[11px] text-slate-500 dark:text-slate-400 space-y-1 font-semibold">
                          {blockGGuide.nbcPart9References[0].rules.map((rule, rIdx) => (
                            <li key={rIdx}>{rule}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Temporary Shoring */}
                    <div className="bg-white dark:bg-slate-900/60 p-5 rounded-xl border border-slate-200/60 dark:border-slate-800/60 space-y-3 break-inside-avoid">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-amber-500 uppercase font-mono">Shoring & Bracing</span>
                        <span className="text-xs font-bold text-slate-400">Section 2</span>
                      </div>
                      <h5 className="font-extrabold text-slate-900 dark:text-white text-sm">{blockGGuide.comprehensiveNotes.shoring.title}</h5>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
                        {blockGGuide.comprehensiveNotes.shoring.details}
                      </p>
                      <div className="bg-rose-500/5 p-3 rounded-lg border border-rose-500/10 space-y-1.5">
                        <p className="text-[10px] font-extrabold text-rose-600 dark:text-rose-400 uppercase tracking-wider">Drilling & Notching Joists (NBC 9.23.5.1)</p>
                        <ul className="list-disc list-inside text-[11px] text-slate-500 dark:text-slate-400 space-y-1 font-semibold">
                          {blockGGuide.nbcPart9References[1].rules.map((rule, rIdx) => (
                            <li key={rIdx}>{rule}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Hazardous Materials */}
                    <div className="bg-white dark:bg-slate-900/60 p-5 rounded-xl border border-slate-200/60 dark:border-slate-800/60 space-y-3 break-inside-avoid">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-amber-500 uppercase font-mono">Hazard Isolation</span>
                        <span className="text-xs font-bold text-slate-400">Section 3</span>
                      </div>
                      <h5 className="font-extrabold text-slate-900 dark:text-white text-sm">{blockGGuide.comprehensiveNotes.hazards.title}</h5>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
                        {blockGGuide.comprehensiveNotes.hazards.details}
                      </p>
                      <div className="bg-red-500/5 p-3 rounded-lg border border-red-500/10 space-y-1.5">
                        <p className="text-[10px] font-extrabold text-red-600 dark:text-red-400 uppercase tracking-wider">Fire Blocking Voids (NBC 9.10.16)</p>
                        <ul className="list-disc list-inside text-[11px] text-slate-500 dark:text-slate-400 space-y-1 font-semibold">
                          {blockGGuide.nbcPart9References[2].rules.map((rule, rIdx) => (
                            <li key={rIdx}>{rule}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Foundation & Roof Tie-ins */}
                    <div className="bg-white dark:bg-slate-900/60 p-5 rounded-xl border border-slate-200/60 dark:border-slate-800/60 space-y-3 break-inside-avoid">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-amber-500 uppercase font-mono">Tying-In & Underpin</span>
                        <span className="text-xs font-bold text-slate-400">Section 4</span>
                      </div>
                      <h5 className="font-extrabold text-slate-900 dark:text-white text-sm">{blockGGuide.comprehensiveNotes.tyingIn.title}</h5>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
                        {blockGGuide.comprehensiveNotes.tyingIn.details}
                      </p>
                      <div className="bg-orange-500/5 p-3 rounded-lg border border-orange-500/10 space-y-1.5">
                        <p className="text-[10px] font-extrabold text-orange-600 dark:text-orange-400 uppercase tracking-wider">Foundation Undermine & Dowels (NBC 9.15)</p>
                        <ul className="list-disc list-inside text-[11px] text-slate-500 dark:text-slate-400 space-y-1 font-semibold">
                          {blockGGuide.nbcPart9References[3].rules.map((rule, rIdx) => (
                            <li key={rIdx}>{rule}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* KEY STUDY CONCEPTS SUMMARY */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Lightbulb size={14} className="text-amber-500" /> Critical Red Seal Journeyman Concepts
                  </h4>
                </div>
                <ul className="space-y-3.5">
                  {activeBlock.keyConcepts.map((concept, idx) => (
                    <li key={idx} className="p-4 rounded-xl border bg-slate-50/50 border-slate-200/60 text-slate-600 dark:bg-slate-950/40 dark:border-slate-800/80 dark:text-slate-300">
                      <div className="flex items-start space-x-2.5">
                        <span className="text-amber-500 text-base leading-none mt-0.5 shrink-0">💡</span>
                        <div className="space-y-2 w-full">
                          <p className="font-semibold text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
                            <HighlightedText text={concept} />
                          </p>
                          <div className="bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 p-3 rounded-lg text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                            <span className="text-[10px] uppercase font-black text-amber-600 dark:text-amber-400 block mb-1">Jobsite standard translation:</span>
                            {getSimplifiedConcept(concept)}
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* PERSONAL NOTES SAVER - LOCALLY PERSISTED */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <FileText size={14} className="text-brand-500" /> Local Study Notes ({activeBlock.id})
                  </h4>
                  {saveSuccess && (
                    <span className="text-xs text-emerald-500 font-bold flex items-center gap-1">
                      <Check size={14} /> Saved locally
                    </span>
                  )}
                </div>
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder={`Type personalized notes for ${activeBlock.id} here... (Saves automatically on button click)`}
                  rows={4}
                  className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 text-sm font-medium focus:ring-4 focus:ring-brand-500/20 text-slate-800 dark:text-slate-200"
                />
                <div className="flex justify-end">
                  <button
                    onClick={handleSaveNote}
                    className="bg-brand-500 hover:bg-brand-600 text-white font-bold py-2.5 px-5 rounded-xl text-sm transition-colors flex items-center gap-2 min-h-[48px]"
                  >
                    <Save size={16} />
                    <span>Save Notes</span>
                  </button>
                </div>
              </div>

              {/* BLOCK QUESTIONS QUICK REVIEWS */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                    Practice Questions Aligned with {activeBlock?.id || 'Block'} ({(blockQuestions || []).length})
                  </h4>
                  <button 
                    onClick={() => setActiveTab('quiz')}
                    className="text-xs text-brand-500 font-black hover:underline"
                  >
                    Launch Quiz Engine
                  </button>
                </div>

                <div className="space-y-4">
                  {(blockQuestions || []).map((q) => {
                    const isBookmarked = (bookmarks || []).includes(q.id)
                    return (
                      <div key={q.id} className="p-4 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-100 dark:border-slate-850 flex justify-between items-start gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-500 font-black px-1.5 py-0.5 rounded">ID: {q.id}</span>
                            {q.codeReference && <span className="text-[10px] text-slate-400 font-mono font-bold">{q.codeReference}</span>}
                          </div>
                          <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">{q.question}</p>
                        </div>
                        <button
                          onClick={() => toggleBookmark(q.id)}
                          className={`p-2 rounded-xl border transition-colors ${
                            isBookmarked 
                              ? 'bg-amber-50 border-amber-300 text-amber-500 dark:bg-amber-950/20 dark:border-amber-800' 
                              : 'bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800 text-slate-400 hover:text-slate-600'
                          }`}
                          title={isBookmarked ? 'Remove bookmark' : 'Bookmark for later review'}
                        >
                          <Bookmark size={18} className={isBookmarked ? 'fill-current' : ''} />
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            </>
          )}
        </div>


      </div>

      {quickRefBlockId && (
        <QuickReferenceModal 
          blockId={quickRefBlockId} 
          onClose={() => setQuickRefBlockId(null)} 
        />
      )}

    </div>
  )
}
