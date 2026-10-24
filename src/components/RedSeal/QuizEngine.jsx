import React, { useState, useEffect, useContext, useRef, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AppContext } from '../../App'
import { 
  Award, 
  HelpCircle, 
  Flame, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Clock, 
  ArrowRight, 
  BookOpen, 
  ChevronRight, 
  Zap, 
  AlertTriangle,
  RotateCcw,
  Flag,
  AlertCircle,
  ThumbsUp,
  Check,
  ChevronDown,
  ChevronUp,
  Grid,
  Book,
  Search,
  ExternalLink,
  Shuffle,
  Info
} from 'lucide-react'
import questionsData from '../../data/RedSeal/questions.json'
import structuralSpecificsData from '../../data/RedSeal/structuralSpecifics.json'
import blueprintsData from '../../data/RedSeal/blueprints.json'
import CarpentersCheatSheetModal from './CarpentersCheatSheetModal'
import { calculateNextReview, isCardDue, filterDueCards } from '../../hooks/srsService'
import blockAGuide from '../../data/RedSeal/block_a_study_guide.json'
import blockBGuide from '../../data/RedSeal/block_b_study_guide.json'
import blockCGuide from '../../data/RedSeal/block_c_study_guide.json'
import blockDGuide from '../../data/RedSeal/block_d_study_guide.json'
import blockEGuide from '../../data/RedSeal/block_e_study_guide.json'
import blockFGuide from '../../data/RedSeal/block_f_study_guide.json'
import blockGGuide from '../../data/RedSeal/block_g_study_guide.json'
import NBCClausesIndex from './NBCClausesIndex'

// Dynamic blueprint reading questions pulling from the newly created blueprint data
export const generateBlueprintReadingQuestions = (blueprints) => {
  const bp1 = blueprints?.[0] || { id: "bp-01", title: "The Title Block & Revisions" };
  const bp2 = blueprints?.[1] || { id: "bp-02", title: "Floor Plans & Grid Lines" };

  return [
    {
      id: "bp_reading_scale_conversion",
      block: "Blueprint Reading",
      blockTitle: "Scales and Conversions",
      difficulty: "Intermediate",
      question: `According to the Title Block metadata for '${bp1.title}', the drawing scale is specified as 1/4" = 1'-0". If a dimension on drawing A-101 measures exactly 4.5 inches on paper, what is the actual physical jobsite dimension?`,
      options: [
        "18 feet 0 inches",
        "9 feet 0 inches",
        "16 feet 6 inches",
        "4 feet 6 inches"
      ],
      correctOptionIndex: 0,
      explanation: `With a scale of 1/4" = 1'-0", each inch on the drawing represents 4 feet. Therefore, 4.5 inches * 4 = 18 feet.`,
      explanationOfficial: `Scale Factor: At 1/4" = 1'-0" (or approximately 1:48/1:50 metric), 1 inch equals 4 feet of actual physical length. Therefore, 4.5" * 4 = 18.0 feet (18'-0").`,
      jobsiteTranslation: `When reading prints scaled at 'quarter-inch', you can do quick calculations in your head: every quarter-inch is a foot, and every full inch is 4 feet. For 4.5 inches, multiply 4.5 by 4 to get 18 feet. Keep a pocket architect's scale handy on the bench to avoid math errors.`,
      codeReference: "Blueprint Scale Interpretation"
    },
    {
      id: "bp_reading_section_symbol",
      block: "Blueprint Reading",
      blockTitle: "Section Symbols",
      difficulty: "Advanced",
      question: `Looking at the Section Mark in the blueprint study material for '${bp2.title}' (which cuts through the meeting area wall), the circle contains '3' on the top and 'S-101' on the bottom. What is the correct interpretation of this standard symbol?`,
      options: [
        "Detail 3 is drawn on Sheet S-101",
        "Sheet 3 contains Section S-101",
        "Section 3 has been revised 101 times",
        "Detail S-101 is located on Section 3"
      ],
      correctOptionIndex: 0,
      explanation: `In standard architectural section drafting, the top half of the circle shows the detail or section number, and the bottom half specifies the sheet or page number where that detail is illustrated.`,
      explanationOfficial: `Section Indicator: The top value (3) indicates the specific Detail/Section Number, and the bottom value (S-101) designates the target Sheet Number where the cross-section detail is drafted.`,
      jobsiteTranslation: `When you see a section bubble on the job, think of it as a roadmap. The top number is the specific drawing you're looking for (Detail 3), and the bottom number is the page it's on (S-101). Flip to S-101 to see exactly how that wall is built.`,
      codeReference: "CSA G11.1 / Section Callouts"
    },
    {
      id: "bp_reading_line_types_dashed",
      block: "Blueprint Reading",
      blockTitle: "Line Types",
      difficulty: "Intermediate",
      question: `In standard blueprint reading, which type of line is represented by a sequence of short dashes (e.g., used to outline the footings underneath foundation walls or hidden beams)?`,
      options: [
        "Hidden Line",
        "Centerline",
        "Property Line",
        "Dimension Line"
      ],
      correctOptionIndex: 0,
      explanation: `Hidden lines consist of short, evenly spaced dashes and are used to show edges, surfaces, or corners that are concealed from the current view (such as footings beneath concrete walls).`,
      explanationOfficial: `Hidden Lines: Consist of short dashes spaced closely together. They represent contours, features, or edges that are obstructed from view by other structural members.`,
      jobsiteTranslation: `On a floor plan, foundation walls are solid, but the concrete footing underneath them is drawn as a dashed line. This 'hidden line' tells you the footing is there, sitting directly under the wall, even though you can't see it looking from above.`,
      codeReference: "Standard Line Conventions"
    },
    {
      id: "bp_reading_line_types_chain",
      block: "Blueprint Reading",
      blockTitle: "Line Types",
      difficulty: "Intermediate",
      question: `On a foundation plan, what type of line is represented by a series of alternating long and short dashes (often used for the grid lines labeled 1, 2, 3 and A, B on '${bp2.title}')?`,
      options: [
        "Centerline / Grid line",
        "Hidden Line",
        "Cutting Plane Line",
        "Break Line"
      ],
      correctOptionIndex: 0,
      explanation: `Centerlines and structural grids are indicated by thin, broken lines of alternating long and short dashes. They mark center axes of symmetry or structural columns.`,
      explanationOfficial: `Centerline Conventions: Drawn with a sequence of alternating long and short dashes. Used to indicate center axes, structural columns, beams, or symmetrical features.`,
      jobsiteTranslation: `The grid lines that run through your posts, columns, and structural walls are drawn with alternating long and short dashes. These are centerlines. Always pull your measurements from these centerlines to make sure everything lines up square.`,
      codeReference: "Line Types / Grid Axes"
    },
    {
      id: "bp_reading_section_direction",
      block: "Blueprint Reading",
      blockTitle: "Section Symbols",
      difficulty: "Intermediate",
      question: `When reading the section cut symbol on a floor plan, what is the significance of the arrowhead attached to the cutting-plane line?`,
      options: [
        "It indicates the direction of view (the way you look at the section)",
        "It indicates the slope direction of the concrete slab or roof",
        "It points to the main entry door of the building",
        "It points to the true North orientation on the site plan"
      ],
      correctOptionIndex: 0,
      explanation: `The arrowheads on cutting-plane or section-cut lines show the viewing direction. The drafter has sliced the building, and you must look in the direction the arrow points to match the detail.`,
      explanationOfficial: `Cutting Plane Direction: Arrowheads placed at the ends of a cutting plane line point in the direction of the observer's line of sight for the corresponding section detail.`,
      jobsiteTranslation: `Imagine slicing a house in half with a giant saw. The arrow on the section bubble tells you which way to look after making the cut. If the arrow points up, you are looking towards the rear wall; if it points left, you look left.`,
      codeReference: "CSA G11.1 / Section Lines"
    },
    {
      id: "bp_reading_scale_ratio",
      block: "Blueprint Reading",
      blockTitle: "Scales and Conversions",
      difficulty: "Advanced",
      question: `A blueprint sheet has a metric scale of 1:50. If a floor dimension measures exactly 120 mm on the drawing sheet, what is the actual physical size of this wall segment in meters?`,
      options: [
        "6.0 meters",
        "1.2 meters",
        "2.4 meters",
        "5.0 meters"
      ],
      correctOptionIndex: 0,
      explanation: `With a 1:50 metric scale, 1 unit on paper equals 50 units in reality. Therefore, 120 mm * 50 = 6000 mm. Converting 6000 mm to meters gives 6.0 meters.`,
      explanationOfficial: `Metric Scale calculation: Scale ratio is 1:50. Physical length = Drawing length * Scale factor. 120 mm * 50 = 6000 mm = 6.0 m.`,
      jobsiteTranslation: `Metric prints make scaling dead simple. 1:50 means every millimeter on the paper is 50 millimeters in the real world. Multiply your measured 120 mm by 50 to get 6000 mm, which is exactly 6.0 meters (about 19 feet 8 inches).`,
      codeReference: "Metric scale standards / CSA B78.2"
    },
    {
      id: "bp_reading_revision_control",
      block: "Blueprint Reading",
      blockTitle: "Title Block & Revisioning",
      difficulty: "Advanced",
      question: `According to '${bp1.title}', why is verifying the Revision number (e.g., 'R-2') and checking for the 'Issued For Construction' stamp critical before starting framing on a jobsite?`,
      options: [
        "To ensure you are building according to the latest approved and coordinated plans, preventing costly errors from outdated drawing sheets",
        "To determine the wage scale of the framing carpenters",
        "To calculate the total shipping weight of the framing lumber",
        "To satisfy local zoning bylaws that require drawings to have color stamps"
      ],
      correctOptionIndex: 0,
      explanation: `Working off of outdated revisions (like R-0 or R-1) when R-2 is current is a major cause of construction mistakes. Only drawings stamped 'ISSUED FOR CONSTRUCTION' or 'IFC' are approved for building.`,
      explanationOfficial: `Drawing Control: Revision tracking ensures structural consistency across all trades. Builders must work from the latest revision level and from IFC-stamped prints to maintain regulatory compliance.`,
      jobsiteTranslation: `Before you cut a single stick of wood, look at the bottom right corner of the print. Make sure it says 'ISSUED FOR CONSTRUCTION' and check the revision number (like R-2) against the general contractor's master set. Framing off a preliminary sketch or an old revision will lead to tearing out finished walls later.`,
      codeReference: "Project Management / Drawing Control"
    },
    {
      id: "bp_reading_break_lines",
      block: "Blueprint Reading",
      blockTitle: "Line Types",
      difficulty: "Advanced",
      question: `What type of line is characterized by a solid thin line with a sharp zig-zag/jog in it (often used to shorten long continuous members on a drawing without changing the scale)?`,
      options: [
        "Break Line",
        "Section Line",
        "Leader Line",
        "Extension Line"
      ],
      correctOptionIndex: 0,
      explanation: `Break lines are used to show that an object or layout is continuous but has been truncated to fit the drawing frame. The zig-zag represents a break in the length.`,
      explanationOfficial: `Break Lines: Characterized by a line interrupted by a zig-zag or wavy pattern. Used to indicate that a portion of a long, uniform element has been omitted from the drawing.`,
      jobsiteTranslation: `If you have a 40-foot clear span girder, a drafter can't fit it full-scale on a standard page. They'll draw a short wall segment, put a zig-zag 'break line' in the middle, and label the dimension as 40 feet. It tells you the beam is continuous, just shortened on paper.`,
      codeReference: "Line Types / Break Symbols"
    }
  ];
};

// Dynamic scenario-based questions from Structural Specifics
export const generateChallengeQuestions = () => {
  return [
    {
      id: "challenge_footings",
      block: "Substructure",
      blockTitle: "Planning and Layout",
      difficulty: "Advanced",
      question: "You are forming a stepped footing for a residential foundation on a sloped grade. Under NBC 9.15.3.9, if you want to use the maximum allowable rise for the steps, what are the maximum rise and minimum run dimensions required?",
      options: [
        "Maximum vertical rise of 600 mm (24 in), minimum horizontal run of 600 mm (24 in)",
        "Maximum vertical rise of 1200 mm (48 in), minimum horizontal run of 600 mm (24 in)",
        "Maximum vertical rise of 300 mm (12 in), minimum horizontal run of 400 mm (16 in)",
        "Maximum vertical rise of 400 mm (16 in), minimum horizontal run of 600 mm (24 in)"
      ],
      correctOptionIndex: 0,
      explanation: "NBC 9.15.3.9 specifies that stepped footings must have a vertical rise of no greater than 600 mm (24 in) and a horizontal run of no less than 600 mm (24 in) to maintain continuity and load distribution.",
      explanationOfficial: "NBC 9.15.3.9: Step footings must have a vertical rise no greater than 600mm (24 in) and a horizontal run no less than 600mm (24 in). The specific grade of the step cannot exceed a 1:2 ratio.",
      jobsiteTranslation: "When stepping footings down a slope, your steps must be a 1-to-1 ratio maximum. If you step down 2 feet, you must run at least 2 feet before the next step. If you do steps any steeper, the concrete can slide or split, and the footing won't bear the load safely.",
      codeReference: "NBC 9.15.3.9"
    },
    {
      id: "challenge_foundations",
      block: "Substructure",
      blockTitle: "Foundations",
      difficulty: "Advanced",
      question: "Under NBC 9.13.2.1, when constructing a poured concrete foundation wall that encloses a heated basement space, what exterior moisture management is required from the finished ground level down to the footing?",
      options: [
        "A continuous damp-proofing coating (such as a bituminous coating or dimple board)",
        "At least 100 mm of exterior wood-fiber siding with no sealer or board",
        "A high-pressure elastic polyurethane paint sprayed directly over wet concrete",
        "A parging coat of Portland cement and sand mortar with no damp-proofing sealer"
      ],
      correctOptionIndex: 0,
      explanation: "NBC 9.13.2.1 requires damp-proofing on the exterior of foundation walls enclosing interior space below grade to prevent capillary moisture movement.",
      explanationOfficial: "NBC 9.13.2.1: The exterior of foundation walls enclosing interior space must be damp-proofed (e.g., bituminous coating or dimple board) from the finished exterior ground level down to the top of the footing.",
      jobsiteTranslation: "You must damp-proof any foundation wall that has dirt against it enclosing a basement. Most crews use a roll-on black bituminous tar or a dimple board like Delta-MS. This prevents the porous concrete from sucking groundwater into the basement walls.",
      codeReference: "NBC 9.13.2.1"
    },
    {
      id: "challenge_icf_slump",
      block: "Substructure",
      blockTitle: "ICF Foundations",
      difficulty: "Advanced",
      question: "What is the recommended concrete slump range and maximum aggregate size required when pouring a 150mm (6-inch) ICF core containing dense steel reinforcement?",
      options: [
        "A slump of 140 mm to 165 mm (5.5 to 6.5 in) with a maximum 10 mm (3/8 in) pea-gravel aggregate",
        "A slump of 50 mm to 75 mm (2 to 3 in) with a standard 19 mm (3/4 in) aggregate",
        "A slump of 200 mm to 250 mm (8 to 10 in) with a 25 mm (1 in) clear stone mix",
        "A dry-mix cement slump of under 25 mm (1 in) with zero aggregate size"
      ],
      correctOptionIndex: 0,
      explanation: "High slump (140 to 165 mm) and small aggregate size (10 mm) are critical for ICF blocks to allow the concrete to flow completely around rebar without voiding or blowing out the foam.",
      explanationOfficial: "ICF Concrete Slump: Concrete mixes must maintain a slump of 140mm to 165mm (5.5 to 6.5 in) using a maximum 10mm (3/8 in) aggregate (pea gravel) to flow cleanly without voiding in narrow 150mm and 200mm cores.",
      jobsiteTranslation: "If you order standard stiff concrete for an ICF pour, it will get hung up on the rebar, leaving massive empty 'honeycomb' pockets at the bottom of your wall. Always specify a 5.5 to 6.5-inch slump with pea gravel so it flows like soup, and consolidate gently with a pencil vibrator.",
      codeReference: "ICF Concrete Slump / NBC 9.15.4.3"
    },
    {
      id: "challenge_icf_rebar",
      block: "Substructure",
      blockTitle: "ICF Foundations",
      difficulty: "Advanced",
      question: "What is the standard rebar reinforcement pattern required under NBC 9.15.4.3 for a 150mm (6-inch) concrete core ICF wall?",
      options: [
        "Horizontal #4 or #5 rebar spaced at 400mm or 600mm O.C., and vertical #4 or #5 rebar at 400mm or 600mm O.C.",
        "Only vertical #3 rebar spaced at 900mm O.C. with zero horizontal steel",
        "Horizontal #8 rebar at 200mm O.C. with continuous steel mesh backing",
        "Horizontal and vertical #6 rebar spaced tightly at 100mm O.C. throughout"
      ],
      correctOptionIndex: 0,
      explanation: "NBC 9.15.4.3 requires horizontal #4 or #5 rebar at 400mm or 600mm O.C., and vertical #4 or #5 rebar at 400mm or 600mm O.C. to resist lateral earth forces.",
      explanationOfficial: "NBC 9.15.4.3 / Reinforcement: 6-inch cores require horizontal #4 or #5 rebar spaced at 400mm or 600mm O.C., and vertical #4 or #5 rebar at 400mm or 600mm O.C.",
      jobsiteTranslation: "For standard 6-inch concrete core ICF foundation walls, you'll place #4 or #5 horizontal bars in the plastic block clips every 16 or 24 inches as you stack the blocks, then thread the vertical bars down at the same spacing before calling your inspection.",
      codeReference: "NBC 9.15.4.3"
    },
    {
      id: "challenge_floor_systems",
      block: "Floor Systems",
      blockTitle: "Beams, Joists & Subfloors",
      difficulty: "Intermediate",
      question: "Under NBC 9.23.5, which of the following is correct regarding the fastening of wood subflooring panels?",
      options: [
        "Subfloor panels must be glued and fastened with screws or nails at 150 mm o.c. along the edges",
        "Subfloor panels must be spot-glued and nailed every 450 mm o.c. in the field",
        "Subfloor panels require zero edge fastening if tongue-and-groove joints are used",
        "Subfloor panels must be fastened using 38 mm common staples spaced at 300 mm o.c."
      ],
      correctOptionIndex: 0,
      explanation: "Subflooring must be properly fastened at 150 mm spacing along panel edges (and 300 mm in the field) to ensure structural diaphragm action and eliminate floor squeaks.",
      explanationOfficial: "Subfloor sheeting must be glued and screwed/nailed at 150mm o.c. along edges.",
      jobsiteTranslation: "Always run a thick bead of subfloor adhesive along the joists before laying your plywood or OSB, then nail or screw your edges every 6 inches. Skipping glue or spacing nails too far apart is a direct recipe for squeaky floors once the lumber dries out.",
      codeReference: "NBC 9.23.5"
    },
    {
      id: "challenge_framing",
      block: "Superstructure",
      blockTitle: "Framing",
      difficulty: "Advanced",
      question: "You are framing a load-bearing wood stud wall. Under NBC 9.23.11.3, what is the mandatory requirement for double top plates?",
      options: [
        "The joints of the top plates must be staggered by at least one stud spacing",
        "The joints of the top plates must align directly on top of each other on a single stud",
        "Double top plates must be glued together using a high-compressive polyurethane construction adhesive",
        "The top plate must be made of pressure-treated lumber while the lower plate is SPF"
      ],
      correctOptionIndex: 0,
      explanation: "NBC 9.23.11.3 requires top plates in load-bearing walls to be doubled, and their joints must be staggered by at least one stud spacing to tie the wall together.",
      explanationOfficial: "NBC 9.23.11.3 (Top Plates): Top plates in load-bearing walls must be doubled, with joints staggered by at least one stud spacing. Single top plates are permitted ONLY if the supported roof/floor framing members align directly over the studs within a 50mm tolerance.",
      jobsiteTranslation: "When double-plating your walls, never let the joint of the top plate sit directly above the joint of the lower plate. Stagger them by at least 16 or 24 inches (one stud bay) so the top plates act as a continuous tie, binding your wall frames tightly together.",
      codeReference: "NBC 9.23.11.3"
    },
    {
      id: "challenge_windows_doors",
      block: "Exterior & Framing",
      blockTitle: "Windows, Doors, Hatches & Skylights",
      difficulty: "Advanced",
      question: "Under NBC 9.9.10.1, what is the minimum required unobstructed opening area and minimum dimensions for bedroom egress windows?",
      options: [
        "Not less than 0.35 m² (3.77 sq ft) with no single dimension less than 380 mm (15 in)",
        "Not less than 0.50 m² (5.38 sq ft) with no single dimension less than 500 mm (20 in)",
        "Not less than 0.25 m² (2.69 sq ft) with no single dimension less than 300 mm (12 in)",
        "Not less than 0.45 m² (4.84 sq ft) with no single dimension less than 400 mm (16 in)"
      ],
      correctOptionIndex: 0,
      explanation: "NBC 9.9.10.1 specifies that bedroom egress windows must open from the inside without tools to provide an unobstructed area of at least 0.35 m² and no dimension less than 380 mm.",
      explanationOfficial: "NBC 9.9.10.1 (Egress): Every bedroom MUST have at least one outside window or exterior door openable from the inside without tools or special knowledge. It must provide an unobstructed opening of not less than 0.35 m² (3.77 sq ft) with no single dimension less than 380mm (15 in).",
      jobsiteTranslation: "If you're building a bedroom, the building inspector will check the egress window first. The actual open space of the sash when fully open must be at least 3.77 sq ft, and both the width and height must be at least 15 inches. This ensures a firefighter with an oxygen tank can climb in, and a homeowner can climb out in an emergency.",
      codeReference: "NBC 9.9.10.1"
    },
    {
      id: "challenge_decks",
      block: "Exterior Structures",
      blockTitle: "Decks & Deck Railings",
      difficulty: "Advanced",
      question: "Under NBC 9.23.6.1, which of the following is true regarding ledger board attachment for exterior residential wood decks?",
      options: [
        "Ledger boards must be directly attached to the house's structural floor framing using lag screws or through-bolts; nails are strictly prohibited.",
        "Ledger boards can be nailed over vinyl or masonry siding as long as 3.5\" galvanized nails are used.",
        "Ledger boards must have a 25 mm gap between the house rim joist and the ledger, with no structural fasteners.",
        "Ledger boards are not permitted on residential structures; decks must always be entirely free-standing."
      ],
      correctOptionIndex: 0,
      explanation: "Nails are strictly forbidden for ledger attachments because they can pull out in withdrawal under load. Direct structural attachment with bolts or lag screws is mandatory.",
      explanationOfficial: "NBC 9.23.6.1 (Ledgers): Ledger boards must not be fastened over siding or masonry veneer. They must be directly attached to the house's structural floor framing using lag screws or through-bolts. Nails are strictly forbidden for ledger attachment.",
      jobsiteTranslation: "Decks pull away from houses when ledger boards are nailed instead of bolted. You must cut away any vinyl or wood siding, bolt the ledger directly to the house's rim joist using heavy galvanized lag screws or through-bolts, and install a proper metal flashing to keep water out.",
      codeReference: "NBC 9.23.6.1"
    },
    {
      id: "challenge_docks_boathouses",
      block: "Exterior & Framing",
      blockTitle: "Docks & Boathouses",
      difficulty: "Advanced",
      question: "In cold climates subject to fresh water freezing, what is the best foundation practice to prevent 'ice jacking' from pulling dock piles out of the lakebed during spring thaws?",
      options: [
        "Utilize smooth steel pipe piles driven below the frost line, or PVC-sleeved piles to prevent ice from gripping the pile",
        "Use rough, square-sawn pressure-treated timber piles wrapped in high-friction rubber pads",
        "Pour a shallow unreinforced concrete footing directly on the loose lake mud",
        "Bolt heavy timber cross-braces directly onto the piles at the water level to freeze them together"
      ],
      correctOptionIndex: 0,
      explanation: "Smooth steel or PVC-sleeved piles reduce ice adhesion and prevent the ice sheet from 'grabbing' and lifting the piles vertically as water levels rise.",
      explanationOfficial: "Ice Jacking Prevention: Pile foundations in freezing climates must be driven below the frost line in the lakebed or pinned directly to bedrock. Piles should be smooth (steel or PVC-sleeved) to prevent ice from gripping and lifting the structure during spring thaw.",
      jobsiteTranslation: "Ice expands and moves with massive vertical force. If you use rough timber, the ice will grip the wood fibers like glue and pull the post right out of the mud when the spring water rises. Use smooth steel or vinyl pipe piles so the ice slips right off them.",
      codeReference: "NBC 9.4.4.1"
    },
    {
      id: "challenge_stairs",
      block: "Superstructure",
      blockTitle: "Stairs",
      difficulty: "Advanced",
      question: "You are cutting wooden stair stringers for a residential flight of steps. Under NBC 9.8.9.4, what is the minimum required 'effective depth' (solid lumber remaining below the cut notches) for the stringer?",
      options: [
        "At least 90 mm (3.5 in)",
        "At least 150 mm (6 in)",
        "At least 50 mm (2 in)",
        "At least 120 mm (4.75 in)"
      ],
      correctOptionIndex: 0,
      explanation: "NBC 9.8.9.4 requires that cut stair stringers must have an effective solid wood depth of at least 90 mm (3.5 in) below the notches to maintain structural shear strength.",
      explanationOfficial: "NBC 9.8.9.4 (Stringers): Cut wooden stringers must have an 'effective depth' (the solid wood remaining below the cut notches) of at least 90mm (3.5 in). Stringers must be spaced no more than 600mm (24 in) O.C. for 38mm (1.5 in) treads, or 400mm (16 in) O.C. for thinner treads.",
      jobsiteTranslation: "When laying out stairs on a 2x12, don't overcut your corners with a circular saw! If you cut too deep, you'll reduce the structural 'meat' left below the steps. NBC says you must leave at least 3.5 inches of solid, uncut wood to support the load of people walking on the stairs.",
      codeReference: "NBC 9.8.9.4"
    },
    {
      id: "challenge_roof_systems",
      block: "Superstructure",
      blockTitle: "Roof Systems",
      difficulty: "Advanced",
      question: "When installing roof sheathing (such as 7/16-inch OSB) on engineered roof trusses spaced at 600mm (24 in) centers, what is mandatory under NBC 9.23.14.3 to support the sheet edges?",
      options: [
        "Metal H-clips midway between trusses, or tongue-and-groove edge panels",
        "Applying a continuous layer of duct tape along all horizontal joints",
        "Adding 2x4 blocking flatwise under every single edge seam",
        "Nailing structural strap iron across the sheets on the exterior face"
      ],
      correctOptionIndex: 0,
      explanation: "NBC 9.23.14.3 mandates edge support for sheathing under a certain thickness on wide centers. For 9.5 mm or 11.1 mm panels on 24-inch centers, H-clips or tongue-and-groove edges are required.",
      explanationOfficial: "NBC 9.23.14.3 (Edge Support): Roof sheathing requires edge support. For standard 9.5mm (3/8 in) or 11.1mm (7/16 in) OSB on 600mm (24 in) centers, metal H-clips or tongue-and-groove edges are mandatory to prevent panel deflection under snow/live loads.",
      jobsiteTranslation: "When you sheathe a roof with trusses at 2 feet on center, the edges of standard 7/16\" OSB will sag when someone steps on them if they aren't supported. You must slip metal H-clips between the sheets on the horizontal joints. This locks the sheet edges together so they don't bounce under heavy snow or foot traffic.",
      codeReference: "NBC 9.23.14.3"
    },
    {
      id: "challenge_exterior_finish",
      block: "Exterior Envelope",
      blockTitle: "Siding, Soffit & Fascia",
      difficulty: "Advanced",
      question: "Under NBC 9.27.5.4, what is the minimum required clearance between finished grade level and wood, hardboard, or fiber-cement siding?",
      options: [
        "Minimum of 200 mm (8 in)",
        "Minimum of 50 mm (2 in)",
        "Minimum of 100 mm (4 in)",
        "Minimum of 350 mm (14 in)"
      ],
      correctOptionIndex: 0,
      explanation: "Clearance of at least 200 mm (8 in) is required from the finished ground level to siding to protect it from splash-back moisture, snow accumulation, and ground insect pests.",
      explanationOfficial: "NBC 9.27.5.4 (Siding Clearance): Wood, hardboard, and fiber-cement siding must have a minimum clearance of 200mm (8 in) from finished ground level to prevent rot and termite access.",
      jobsiteTranslation: "Never run your wood or fiber-cement siding all the way down to the dirt. Keep the bottom edge of the siding at least 8 inches above finished grade. This stops ground water from wicking into your cladding, preventing rot, paint failure, and insect damage.",
      codeReference: "NBC 9.27.5.4"
    },
    {
      id: "challenge_masonry_parging",
      block: "Substructure",
      blockTitle: "Masonry & Parging",
      difficulty: "Advanced",
      question: "Under NBC 9.20.11.2, which mortar type is mandatory for masonry walls in contact with soil (such as block foundations and underground retaining walls) due to its superior lateral bonding and durability?",
      options: [
        "Type S Mortar",
        "Type N Mortar",
        "Type M Mortar",
        "Type O Mortar"
      ],
      correctOptionIndex: 0,
      explanation: "Type S mortar has high tensile and lateral bonding capacity, making it mandatory for masonry structures in direct contact with earth subjected to lateral soil pressures.",
      explanationOfficial: "NBC 9.20.11.2 (Mortar Types): Type S mortar is mandatory for masonry walls in contact with soil (foundations, retaining walls) due to its high lateral strength and bond durability. Type N mortar is suitable for non-loadbearing interior walls and exterior walls above grade.",
      jobsiteTranslation: "Mortar isn't all the same! For below-grade blocks holding back dirt, you must mix and use Type S mortar. It has much stronger lateral grip than Type N to handle earth pressures without bowing.",
      codeReference: "NBC 9.20.11.2"
    },
    {
      id: "challenge_site_prep_retaining_walls",
      block: "Substructure",
      blockTitle: "Site Prep & Retaining Walls",
      difficulty: "Advanced",
      question: "Under NBC 9.4.4.6, at what height threshold does a retaining wall (or one supporting a surcharge load like a driveway) require a professional engineered design?",
      options: [
        "When the height of the wall exceeds 1.2 m (approx. 4 ft)",
        "When the height of the wall exceeds 2.4 m (approx. 8 ft)",
        "When the height of the wall exceeds 0.6 m (approx. 2 ft)",
        "All retaining walls, regardless of height, require structural engineers"
      ],
      correctOptionIndex: 0,
      explanation: "Retaining walls over 1.2 m tall resist massive hydrostatic and earth forces, requiring engineered designs to ensure safety and prevent failure.",
      explanationOfficial: "NBC 9.4.4.6 (Retaining Walls): Retaining walls that exceed 1.2m (approx. 4 ft) in height, or walls supporting additional surcharge loads (like a driveway or structure above them), MUST be designed by a professional engineer.",
      jobsiteTranslation: "If you're building a timber or block retaining wall higher than 4 feet, stop and call an engineer. The soil pressure behind a tall wall is immense, and you'll need certified plans, proper structural drainage, and deadman anchors to prevent a catastrophic failure.",
      codeReference: "NBC 9.4.4.6"
    }
  ];
};

// Helper to construct practice block label dynamically
const getSelectedBlocksLabel = (selected) => {
  if (!selected || selected.length === 0) return 'All Blocks'
  if (selected.length === 7) return 'All Blocks'
  if (selected.length === 1) return selected[0]
  const sorted = [...selected].sort()
  const shortNames = sorted.map(b => b.replace('Block ', ''))
  return `Blocks ${shortNames.join(', ')}`
}

const EXAM_TIPS = {
  'Block A': [
    "ASME B30.5 standards govern standard hand signals for mobile crane operations. Memorize the 'Hoist', 'Lower', and 'Emergency Stop' hand signs!",
    "When calculating sling tension, remember that sling angle is measured relative to the horizontal. As the angle decreases, the tension increases drastically!",
    "Under WHMIS, the supplier is responsible for providing the SDS and supplier label, while the employer is responsible for workplace training.",
    "Rigging safety factor for general hoisting equipment is typically 5:1, but for personnel hoisting, it jumps to 10:1 or 20:1!",
    "Before any heavy lift, identify the Center of Gravity (CG). The hoist hook must be positioned directly over the CG to prevent load swing."
  ],
  'Block B': [
    "To establish a perfect 90-degree corner, use the 3-4-5 rule (or any multiple like 6-8-10 or 9-12-15) to calculate structural squareness.",
    "Parallax error occurs when your eye is not aligned with the crosshairs of a builder's level. Check it by moving your eye slightly up and down.",
    "Batterboards should be set back at least 1.5 to 2.4 meters (5 to 8 feet) from the excavation lines so they aren't disturbed by machinery.",
    "Always reference the local geodetic benchmark (BM) or a permanent site datum for all elevation transfers to ensure consistency.",
    "When laying out structural grid lines, lettered bubbles are typically along one axis, and numbered bubbles are along the other axis."
  ],
  'Block C': [
    "Continuous concrete pours exert huge fluid pressure near the bottom of wall forms. Space snap-ties closer together at the base to prevent blowouts!",
    "The minimum concrete cover for rebar cast against and permanently exposed to earth (like footings) is 75 mm (3 inches) to prevent corrosion.",
    "For concrete stairs, the sum of two risers and one tread (2R + T) should equal between 600 mm and 635 mm (24 to 25 inches) for standard ergonomics.",
    "Always check the slump test standard: a higher slump indicates a wetter, more fluid mix, but excess water significantly reduces concrete strength.",
    "Formwork stripping times depend heavily on curing temperature and concrete mix; typically wall forms are stripped after 24-48 hours."
  ],
  'Block D': [
    "NBC Section 9.23 floor framing states that if an interior partition runs parallel to floor joists, the joists underneath must be doubled.",
    "For roof rafters, the line length is measured along the measuring line from the center of the ridge board down to the outer edge of the wall plate.",
    "When framing rough openings for window headers, ensure you have the correct number of shoulder/jack studs to support gravity loads down to the plate.",
    "Pre-engineered roof trusses are designed to carry loads on specific nodes. Never cut, notch, or drill any truss member without an engineer's stamp!",
    "Floor joist bridging or blocking is required under NBC to distribute concentrated loads and prevent the joists from twisting under load."
  ],
  'Block E': [
    "Vinyl siding expands and contracts with temperature. Drive nails in the center of slot holes and leave 1/32 inch (1mm) clearance under the nail head!",
    "Lap housewrap (sheathing membrane) at least 100 mm (4 inches) horizontally and 150 mm (6 inches) vertically to prevent water ingress.",
    "Asphalt shingle roofs with a slope between 2:12 and 4:12 require a double layer of underlayment to protect against water backing up.",
    "In brick veneer, weep holes are required at the bottom of the cavity, spaced no more than 800 mm o.c., to drain condensation.",
    "Under-soffit ventilation is vital to prevent ice damming. Ensure insulation baffles are installed at the eave to keep the air pathway clear."
  ],
  'Block F': [
    "In standard residential stair building, the maximum riser height is 200 mm, the minimum tread depth is 235 mm, and the minimum run is 210 mm.",
    "Use coped joints for inside corners of baseboard and crown molding, and mitered joints for outside corners to prevent open seams.",
    "Hardwood flooring needs to acclimate in the building for at least 72 hours under active heating/cooling conditions prior to installation.",
    "For standard drywall ceilings, screw spacing must be 300 mm (12 in) o.c. along the framing if no drywall adhesive is used.",
    "When installing door jambs, use cedar shims behind hinges and strike plate locations to ensure solid, adjustable fastening."
  ],
  'Block G': [
    "Before cutting any wall in an older home, test for hazardous materials like asbestos in plaster/drywall joint compound, and lead in paint.",
    "Always erect temporary shoring walls (shores) before removing any load-bearing studs to keep upper joists and roof loads securely supported.",
    "When joining a new addition's roof to an existing roof, use valley boards over the existing shingles to support the new rafter valley layout.",
    "In renovation projects, check for level and plumb first. You often have to 'sister' new joists or studs to old ones to establish a flat plane."
  ],
  'Blueprint Reading': [
    "Written specifications and larger-scale detail drawings always take precedence over small-scale plans when discrepancies occur.",
    "An architectural scale ratio of 1:50 means 1 unit on paper represents 50 units on the jobsite. (e.g., 20mm on paper = 1000mm in reality).",
    "On drawings, centerlines are represented by alternating long and short dashes. Grid lines represent structural columns and bearing points."
  ],
  'Structural Specifics': [
    "Concrete anchor bolts must be spaced a maximum of 2.4 m o.c. and located within 300 mm of the ends of each foundation plate segment.",
    "Beams must have a minimum bearing length of 89 mm (3.5 inches) on concrete or masonry, and 38 mm (1.5 inches) on wood studs.",
    "Always verify that sheathing fasteners (screws/nails) are spaced tightly along the edges of shear walls (typically 150 mm o.c.) for wind resistance."
  ]
}

// Confetti particle canvas engine for the pass celebration
function ConfettiCanvas({ trigger }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!trigger) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animationFrameId

    // Set canvas dimensions
    canvas.width = canvas.parentElement.clientWidth
    canvas.height = canvas.parentElement.clientHeight

    const particles = []
    const colors = ['#2563EB', '#1D4ED8', '#10B981', '#F59E0B', '#EF4444', '#EC4899']

    // Create particles
    for (let i = 0; i < 120; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        r: Math.random() * 6 + 4,
        d: Math.random() * canvas.height,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.random() * 10 - 5,
        tiltAngleIncremental: Math.random() * 0.07 + 0.02,
        tiltAngle: 0,
        speed: Math.random() * 3 + 2
      })
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      let finished = true
      particles.forEach((p) => {
        p.tiltAngle += p.tiltAngleIncremental
        p.y += p.speed
        p.x += Math.sin(p.tiltAngle) * 0.5

        if (p.y < canvas.height) {
          finished = false
        }

        ctx.beginPath()
        ctx.lineWidth = p.r
        ctx.strokeStyle = p.color
        ctx.moveTo(p.x + p.tilt + p.r / 2, p.y)
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2)
        ctx.stroke()
      })

      if (!finished) {
        animationFrameId = requestAnimationFrame(draw)
      }
    }

    draw()

    const handleResize = () => {
      if (canvas) {
        canvas.width = canvas.parentElement.clientWidth
        canvas.height = canvas.parentElement.clientHeight
      }
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
    }
  }, [trigger])

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 pointer-events-none w-full h-full z-25"
    />
  )
}

// Two-Part Explanation Component (Official Code vs. Jobsite Translation)
function TwoPartExplanation({ question }) {
  const [activeRevealTooltip, setActiveRevealTooltip] = useState(null);

  if (!question) return null;

  const officialCode = question.explanationOfficial || question.explanation || "Official building code reference guidelines apply.";
  
  const getJobsiteTranslation = (q) => {
    if (q.jobsiteTranslation) return q.jobsiteTranslation;
    const exp = q.explanation || "";
    if (exp.toLowerCase().includes("stair") || exp.toLowerCase().includes("riser") || exp.toLowerCase().includes("tread")) {
      return "On the jobsite, stair layouts have zero margin for error. You must keep every riser height identical (within 6 mm) so people don't trip, and ensure your treads are deep enough for work boots to safely land. First, divide the total rise by a target riser height like 175 mm to find the number of steps, then adjust to fit exactly.";
    }
    if (exp.toLowerCase().includes("joist") || exp.toLowerCase().includes("subfloor") || exp.toLowerCase().includes("span")) {
      return "When laying out joists or subflooring, staying within the maximum spans ensures the floor doesn't feel like a trampoline. Standard spacing is 12\", 16\", or 24\" on center. If your joist spans too far, you will get bouncy floors that crack drywall and squeak whenever someone walks.";
    }
    if (exp.toLowerCase().includes("ladder") || exp.toLowerCase().includes("safety") || exp.toLowerCase().includes("scaffold")) {
      return "Safety is your number one priority! Always inspect your gear, keep a 4:1 slope for extension ladders (pull the base out 1 foot for every 4 feet of vertical climb), and make sure scaffolding is fully planked and braced. Never cut corners on safety rules.";
    }
    if (exp.toLowerCase().includes("siding") || exp.toLowerCase().includes("exterior") || exp.toLowerCase().includes("lap") || exp.toLowerCase().includes("bevel")) {
      return "To keep rain from rotting out the house walls, you must overlap bevel siding by at least 1 inch (25 mm). This forms a natural shingle-style weather barrier that sheds water down and away. Nail it just above the lap so you don't split the thin wood below.";
    }
    if (exp.toLowerCase().includes("concrete") || exp.toLowerCase().includes("pour") || exp.toLowerCase().includes("foundation") || exp.toLowerCase().includes("form")) {
      return "Wet concrete is incredibly heavy and exerts huge hydraulic pressure against your forms. You must use strong form ties and diagonal braces to lock everything tight. If you don't brace properly, the forms will bulge or blow out at the bottom, creating a massive, expensive concrete mess.";
    }
    if (exp.toLowerCase().includes("nail") || exp.toLowerCase().includes("fastener") || exp.toLowerCase().includes("screw") || exp.toLowerCase().includes("spacing")) {
      return "Nail sizing and spacing are what hold the house together against heavy snow loads or hurricane-force wind shear. Follow the nailing schedule exactly (e.g., space rim joist nails at 150 mm) to prevent the frame from pulling apart under load.";
    }
    return `In plain English: ${exp.replace(/^According to .*?,/i, "On the jobsite,").replace(/^Under Section .*?,/i, "When building,")}`;
  };

  const jobsiteText = getJobsiteTranslation(question);

  return (
    <div className="space-y-3 mt-3 text-left">
      <div className="bg-slate-900/10 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl">
        <div className="flex flex-row items-center gap-2 mb-1.5">
          <span className="text-xs">📜</span>
          <span className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider">Official Code Explanation</span>
          <button onClick={() => setActiveRevealTooltip(activeRevealTooltip === 'code' ? null : 'code')} className="text-slate-500/70 hover:text-slate-500 dark:text-slate-400/70 dark:hover:text-slate-400 transition-colors focus:outline-none cursor-pointer hover:opacity-80 relative">
            <Info size={12} strokeWidth={3} />
          </button>
        </div>
        {activeRevealTooltip === 'code' && (
          <div className="relative z-50">
            <div className="absolute top-0 left-0 mt-1 w-64 bg-slate-800 border border-slate-700 p-3 rounded-lg shadow-xl drop-shadow-2xl">
              <p className="text-xs text-slate-300 leading-relaxed font-semibold">Provides the strict National Building Code (NBC) Part 9 specifications and exact verbiage you will be tested on during the Red Seal Exam.</p>
            </div>
          </div>
        )}
        <p className="text-xs font-semibold text-slate-600 dark:text-slate-350 leading-relaxed">
          {officialCode}
        </p>
        {question.codeReference && (
          <div className="text-[9px] text-slate-400 font-bold uppercase mt-1">
            Reference: {question.codeReference}
          </div>
        )}
      </div>

      <div className="bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl space-y-2">
        <div className="flex flex-row items-center gap-2 border-b border-amber-500/10 pb-1.5">
          <span className="text-xs">🛠️</span>
          <span className="text-[10px] font-black uppercase text-amber-600 dark:text-amber-400 tracking-wider">Jobsite Translation (Plain English)</span>
          <button onClick={() => setActiveRevealTooltip(activeRevealTooltip === 'jobsite' ? null : 'jobsite')} className="text-amber-600/70 hover:text-amber-600 dark:text-amber-400/70 dark:hover:text-amber-400 transition-colors focus:outline-none cursor-pointer hover:opacity-80 relative">
            <Info size={12} strokeWidth={3} />
          </button>
        </div>
        {activeRevealTooltip === 'jobsite' && (
          <div className="relative z-50">
            <div className="absolute top-0 left-0 mt-1 w-64 bg-slate-800 border border-slate-700 p-3 rounded-lg shadow-xl drop-shadow-2xl">
              <p className="text-xs text-slate-300 leading-relaxed font-semibold">Translates dense building code into practical, everyday trade language and jobsite scenarios to help you conceptually anchor the rule.</p>
            </div>
          </div>
        )}
        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-relaxed">
          {jobsiteText}
        </p>
        <div className="text-[9px] text-amber-600 dark:text-amber-400 font-bold italic pt-1">
          "We break down the math step-by-step for the jobsite."
        </div>
      </div>
    </div>
  );
}

// Pinch-to-Zoom & Pan Interactive Diagram/Blueprint Component
function QuestionDiagram({ diagram }) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialDistance, setInitialDistance] = useState(null);

  if (!diagram) return null;

  const handleDragStart = (e) => {
    if (!isZoomed) return;
    
    if (e.touches && e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      setInitialDistance(dist);
      setIsDragging(false);
      return;
    }

    setIsDragging(true);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setDragStart({ x: clientX - pan.x, y: clientY - pan.y });
  };

  const handleDragMove = (e) => {
    if (e.touches && e.touches.length === 2 && initialDistance) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const ratio = dist / initialDistance;
      setScale((s) => {
        const newScale = s * ratio;
        return Math.min(4, Math.max(1, newScale));
      });
      setInitialDistance(dist);
      return;
    }

    if (!isDragging) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setPan({
      x: clientX - dragStart.x,
      y: clientY - dragStart.y
    });
  };

  const handleDragEnd = (e) => {
    if (e.touches && e.touches.length < 2) {
      setInitialDistance(null);
    }
    setIsDragging(false);
  };

  const resetZoom = () => {
    setScale(1);
    setPan({ x: 0, y: 0 });
  };

  const toggleModal = () => {
    setIsZoomed(!isZoomed);
    resetZoom();
  };

  const handleZoomIn = () => setScale(s => Math.min(4, s + 0.3));
  const handleZoomOut = () => setScale(s => Math.max(1, s - 0.3));

  const renderContent = (isModal = false) => {
    if (diagram.type === 'svg') {
      return (
        <div 
          className="w-full max-w-full flex justify-center items-center text-slate-800 dark:text-slate-100 [&_svg]:max-w-full [&_svg]:h-auto bg-white/50 dark:bg-slate-900/40 p-2 rounded-lg"
          dangerouslySetInnerHTML={{ __html: diagram.content }}
          style={{
            transform: isModal ? `scale(${scale}) translate(${pan.x / scale}px, ${pan.y / scale}px)` : 'none',
            transition: isDragging ? 'none' : 'transform 0.15s ease-out',
            transformOrigin: 'center center',
            cursor: isModal && scale > 1 ? 'grab' : 'pointer'
          }}
        />
      );
    } else {
      return (
        <img 
          src={diagram.url || diagram.content} 
          alt="Blueprint / Exam Diagram" 
          className="max-h-64 md:max-h-80 w-full object-contain rounded-lg shadow-sm"
          style={{
            transform: isModal ? `scale(${scale}) translate(${pan.x / scale}px, ${pan.y / scale}px)` : 'none',
            transition: isDragging ? 'none' : 'transform 0.15s ease-out',
            transformOrigin: 'center center',
            cursor: isModal && scale > 1 ? 'grab' : 'pointer'
          }}
        />
      );
    }
  };

  return (
    <div className="my-4 w-full">
      {/* Inline Preview Container */}
      <div 
        onClick={toggleModal}
        className="relative bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer group hover:border-brand-500/50 transition-all shadow-sm w-full"
      >
        <span className="absolute top-3 right-3 text-[9px] font-black uppercase text-slate-500 dark:text-slate-400 bg-slate-200/60 dark:bg-slate-800 px-2 py-1 rounded-lg tracking-wider flex items-center gap-1 group-hover:bg-brand-500 group-hover:text-white transition-all shadow-xs">
          🔍 Tap to Zoom & Pan
        </span>
        <div className="w-full py-2 flex justify-center items-center">
          {renderContent(false)}
        </div>
        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold mt-2 text-center uppercase tracking-wider">
          Reference Diagram (Tap to zoom & pan)
        </span>
      </div>

      {/* Fullscreen Zoom Modal Overlay */}
      {isZoomed && (
        <div className="fixed inset-0 z-[9999] bg-slate-950/95 backdrop-blur-md flex flex-col justify-between p-4 select-none animate-fadeIn">
          {/* Header */}
          <div className="flex justify-between items-center text-white pb-3 border-b border-slate-800">
            <div>
              <span className="text-[10px] bg-brand-500 text-white px-2.5 py-1 rounded font-black uppercase tracking-wider">
                Exam Blueprint Reference
              </span>
              <h4 className="text-xs font-bold text-slate-400 mt-1">
                Pinch to zoom. Drag to explore details.
              </h4>
            </div>
            <button 
              onClick={toggleModal}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-black text-xs rounded-xl transition-all border border-slate-700"
            >
              Close [X]
            </button>
          </div>

          {/* Interactive Zoom Canvas */}
          <div 
            className="flex-1 overflow-hidden relative flex items-center justify-center w-full h-full"
            onMouseDown={handleDragStart}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={handleDragStart}
            onTouchMove={handleDragMove}
            onTouchEnd={handleDragEnd}
          >
            <div className="max-w-full max-h-[65vh] flex items-center justify-center p-4">
              {renderContent(true)}
            </div>
          </div>

          {/* Controls Footer */}
          <div className="flex justify-between items-center text-white pt-3 border-t border-slate-800 gap-4">
            <div className="flex items-center gap-2">
              <button 
                onClick={handleZoomOut}
                disabled={scale <= 1}
                className="w-12 h-12 flex items-center justify-center bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white font-black text-xl rounded-2xl transition-all border border-slate-700"
                aria-label="Zoom out"
              >
                -
              </button>
              <span className="text-xs font-mono font-black min-w-[60px] text-center bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800">
                {Math.round(scale * 100)}%
              </span>
              <button 
                onClick={handleZoomIn}
                disabled={scale >= 4}
                className="w-12 h-12 flex items-center justify-center bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white font-black text-xl rounded-2xl transition-all border border-slate-700"
                aria-label="Zoom in"
              >
                +
              </button>
            </div>

            <button
              onClick={resetZoom}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-black text-xs rounded-xl transition-all border border-slate-700"
            >
              Reset View
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function QuizEngine({ initialQuizMode = 'menu', initialCram = false } = {}) {
  const context = useContext(AppContext) || {}
  const { 
    nailItDeck: rawNailItDeck, 
    pushToNailIt = () => {}, 
    clearFromNailIt = () => {}, 
    addQuizRecord = () => {},
    bookmarks: rawBookmarks,
    toggleBookmark = () => {},
    customQuizQuestions,
    setCustomQuizQuestions = () => {},
    setActiveTab = () => {},
    setFocusedStudyBlock = () => {},
    flashcardReviews = {},
    setFlashcardReviews = () => {},
    userXP = 0,
    setUserXP = () => {}
  } = context

  const [isCramMode, setIsCramMode] = useState(initialCram || initialQuizMode === 'cram')

  const nailItDeck = Array.isArray(rawNailItDeck) ? rawNailItDeck : []
  const bookmarks = Array.isArray(rawBookmarks) ? rawBookmarks : []

  // Modes: 'menu' | 'practice' | 'exam' | 'nailit' | 'flashcards'
  const [quizMode, setQuizMode] = useState(initialQuizMode === 'cram' ? 'practice' : initialQuizMode)
  const [quizStartTime, setQuizStartTime] = useState(null)

  // Trigger Cram Mode if initialCram or initialQuizMode === 'cram'
  useEffect(() => {
    if ((initialCram || initialQuizMode === 'cram') && setIsCramMode) {
      setIsCramMode(true)
    }
  }, [initialCram, initialQuizMode, setIsCramMode])
  
  // Toast notifications for Cram Mode / Nail It deck flag
  const [toastMessage, setToastMessage] = useState(null)
  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  // Quiz session states
  const [currentQuestions, setCurrentQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0)
  const [incorrectTracker, setIncorrectTracker] = useState([]) // tracks which questions were wrong in this session
  const [selectedPracticeBlocks, setSelectedPracticeBlocks] = useState(() => {
    try {
      const focusBlock = localStorage.getItem('red_seal_focused_quiz_block')
      if (focusBlock) {
        localStorage.removeItem('red_seal_focused_quiz_block')
        return [focusBlock]
      }
    } catch (e) {}
    return ['Block A', 'Block B', 'Block C', 'Block D', 'Block E', 'Block F', 'Block G']
  })
  const [selectedDifficulty, setSelectedDifficulty] = useState('all') // 'all', 'Beginner', 'Intermediate', 'Advanced'
  const [isCheatSheetOpen, setIsCheatSheetOpen] = useState(false)
  const [isOfficialMock, setIsOfficialMock] = useState(false)
  
  // Cram Mode custom states
  const [cramCategory, setCramCategory] = useState('All')
  const [isShuffled, setIsShuffled] = useState(true)
  const [showControlsInfo, setShowControlsInfo] = useState(false)
  const [showPracticeInfo, setShowPracticeInfo] = useState(false)
  const [showCheatSheetInfo, setShowCheatSheetInfo] = useState(false)

  // Listen to Cram Mode parameters (isCramMode, cramCategory, isShuffled) to dynamically sync rapid-fire deck
  useEffect(() => {
    if (isCramMode) {
      let filtered = [...questionsData]
      if (cramCategory !== 'All') {
        filtered = filtered.filter(q => q.block === cramCategory)
      }
      
      if (isShuffled) {
        // Standard Fisher-Yates shuffle algorithm
        for (let i = filtered.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [filtered[i], filtered[j]] = [filtered[j], filtered[i]];
        }
      }
      
      setCurrentQuestions(filtered)
      setCurrentIndex(0)
      if (filtered.length > 0) {
        setSelectedOption(filtered[0].correctOptionIndex)
      } else {
        setSelectedOption(null)
      }
      setIsAnswered(true)
      setCorrectAnswersCount(0)
      setIncorrectTracker([])
      setQuizMode('practice')
    }
  }, [isCramMode, cramCategory, isShuffled])
  
  // Global search and filter state
  const [searchQuery, setSearchQuery] = useState('')
  const [searchBlock, setSearchBlock] = useState('all')
  const [searchDifficulty, setSearchDifficulty] = useState('all')
  const [expandedQuestionId, setExpandedQuestionId] = useState(null)

  // Memoized search question filtering
  const filteredSearchQuestions = useMemo(() => {
    let result = questionsData

    if (searchBlock !== 'all') {
      result = result.filter(q => q.block === searchBlock)
    }

    if (searchDifficulty !== 'all') {
      result = result.filter(q => q.difficulty === searchDifficulty)
    }

    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase().trim()
      result = result.filter(q => 
        q.question.toLowerCase().includes(query) ||
        (q.explanation && q.explanation.toLowerCase().includes(query)) ||
        (q.jobsiteTranslation && q.jobsiteTranslation.toLowerCase().includes(query)) ||
        (q.codeReference && q.codeReference.toLowerCase().includes(query))
      )
    }

    return result
  }, [searchQuery, searchBlock, searchDifficulty])

  // Floating Exam Tip states
  const [examTip, setExamTip] = useState(null)
  const [isTipExpanded, setIsTipExpanded] = useState(false)

  // Sync floating exam tip dynamically when active question changes
  useEffect(() => {
    if (currentQuestions && currentQuestions[currentIndex]) {
      const activeQ = currentQuestions[currentIndex]
      const blockName = activeQ.block || 'General'
      const tipsList = EXAM_TIPS[blockName] || [
        "Read each Red Seal question carefully. Pay close attention to words like 'MINIMUM', 'MAXIMUM', and 'EXCEPT'.",
        "On the Red Seal exam, always select the answer that represents the safest trade practice and complies with local building codes.",
        "Draw a quick sketch on your scrap paper for stair and rafter calculations to avoid mental math errors."
      ]
      const randomIndex = Math.floor(Math.random() * tipsList.length)
      setExamTip(tipsList[randomIndex])
      setIsTipExpanded(false) // Open tip on question switch
    } else {
      setIsTipExpanded(false)
    }
  }, [currentIndex, currentQuestions])
  
  // NBC Code Search and Auto-Lookup references
  const [isNbcSearchOpen, setIsNbcSearchOpen] = useState(false)
  const [expandedNbcRef, setExpandedNbcRef] = useState(null)

  const allNbcReferences = useMemo(() => {
    const blocks = [
      { id: 'Block A', title: blockAGuide.title, refs: blockAGuide.nbcPart9References || [] },
      { id: 'Block B', title: blockBGuide.title, refs: blockBGuide.nbcPart9References || [] },
      { id: 'Block C', title: blockCGuide.title, refs: blockCGuide.nbcPart9References || [] },
      { id: 'Block D', title: blockDGuide.title, refs: blockDGuide.nbcPart9References || [] },
      { id: 'Block E', title: blockEGuide.title, refs: blockEGuide.nbcPart9References || [] },
      { id: 'Block F', title: blockFGuide.title, refs: blockFGuide.nbcPart9References || [] },
      { id: 'Block G', title: blockGGuide.title, refs: blockGGuide.nbcPart9References || [] },
    ]
    const refs = []
    blocks.forEach(b => {
      b.refs.forEach(ref => {
        refs.push({
          blockId: b.id,
          blockTitle: b.title,
          section: ref.section || '',
          title: ref.title || '',
          rules: ref.rules || []
        })
      })
    })
    return refs
  }, [])

  // Recommendation engine logic for failed quizzes
  const getRecommendedBlocks = () => {
    if (!incorrectTracker || incorrectTracker.length === 0) return []
    const wrongBlocksCount = {}
    currentQuestions.forEach(q => {
      if (incorrectTracker.includes(q.id) && q.block) {
        wrongBlocksCount[q.block] = (wrongBlocksCount[q.block] || 0) + 1
      }
    })
    const BLOCK_TITLES = {
      'Block A': 'Common Occupational Skills',
      'Block B': 'Planning and Layout',
      'Block C': 'Concrete Formwork',
      'Block D': 'Framing',
      'Block E': 'Exterior Finish',
      'Block F': 'Interior Finish',
      'Block G': 'Renovations'
    }
    return Object.entries(wrongBlocksCount).map(([blockId, count]) => {
      return {
        id: blockId,
        title: BLOCK_TITLES[blockId] || 'General Carpentry',
        count
      }
    }).sort((a, b) => b.count - a.count)
  }

  // Helper to count questions that match current filters
  const getFilteredPracticeQuestionsCount = () => {
    let filtered = questionsData.filter(q => selectedPracticeBlocks.includes(q.block))
    if (filtered.length === 0) return 0
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(q => q.difficulty === selectedDifficulty)
    }
    return filtered.length
  }

  // Listen to custom questions to trigger a custom review practice session
  useEffect(() => {
    if (customQuizQuestions && customQuizQuestions.length > 0) {
      // Find matching questions from bank
      const targetQuestions = questionsData.filter(q => customQuizQuestions.includes(q.id))
      if (targetQuestions.length > 0) {
        setCurrentQuestions(targetQuestions)
        setCurrentIndex(0)
        setSelectedOption(null)
        setIsAnswered(false)
        setCorrectAnswersCount(0)
        setIncorrectTracker([])
        setQuizMode('practice')
        setQuizStartTime(Date.now())
      }
      setCustomQuizQuestions(null) // Reset so it won't trigger again unless clicked
    }
  }, [customQuizQuestions, setCustomQuizQuestions])

  // Exam Simulator states
  const [timerCount, setTimerCount] = useState(300) // 5 minutes (300 seconds)
  const [examSubmitted, setExamSubmitted] = useState(false)
  const [examFinished, setExamFinished] = useState(false)
  const [flaggedQuestions, setFlaggedQuestions] = useState([])
  const [questionTimeElapsed, setQuestionTimeElapsed] = useState(0)
  const [showReviewScreen, setShowReviewScreen] = useState(false)
  const [isNavigationExpanded, setIsNavigationExpanded] = useState(false)

  // Reset pacing tracker on question index change
  useEffect(() => {
    setQuestionTimeElapsed(0)
  }, [currentIndex])

  // Smart Resume / Last Active Task logger
  useEffect(() => {
    if (quizMode && quizMode !== 'menu' && quizMode !== 'flashcards' && currentQuestions && currentQuestions.length > 0) {
      let title = 'Mock Red Seal Exam'
      if (isCramMode) {
        title = 'RED SEAL CRAM MODE'
      } else if (quizMode === 'challenge') {
        title = 'Structural Specifics Challenge'
      } else if (quizMode === 'blueprint_reading') {
        title = 'Blueprint Reading Quiz'
      } else if (quizMode === 'burst') {
        title = 'Speed Run Challenge'
      } else if (quizMode === 'nailit') {
        title = 'Nail It Review Queue'
      } else if (quizMode === 'practice') {
        title = 'RSOS Practice Session'
      }

      const task = {
        type: 'quiz',
        title: title,
        subtext: `Question ${currentIndex + 1} of ${currentQuestions.length}`,
        route: '/quiz'
      }
      localStorage.setItem('lastActiveTask', JSON.stringify(task))
      localStorage.setItem('builderHub_last_active_task', JSON.stringify(task))
      window.dispatchEvent(new Event('builderHub_last_active_task_updated'))
    }
  }, [quizMode, currentIndex, currentQuestions, isCramMode])

  // Flashcards states
  const [flashcardIndex, setFlashcardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [flashcardDeck, setFlashcardDeck] = useState([])
  const [flashcardStudyAheadMode, setFlashcardStudyAheadMode] = useState(false)

  // Timer Ref for clearInterval
  const timerRef = useRef(null)

  // 1. Practice Mode setup
  const startPracticeMode = () => {
    // Filter questions by selected blocks, default to all if none selected
    let filtered = questionsData.filter(q => selectedPracticeBlocks.includes(q.block))
    if (filtered.length === 0) {
      filtered = questionsData
    }
    
    // Filter by selected difficulty if not 'all'
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(q => q.difficulty === selectedDifficulty)
    }

    const targetQuestions = filtered.length > 0 ? filtered : questionsData
    
    // Shuffle questions or copy them
    const shuffled = [...targetQuestions].sort(() => 0.5 - Math.random())
    setCurrentQuestions(shuffled)
    setCurrentIndex(0)
    setSelectedOption(null)
    setIsAnswered(false)
    setCorrectAnswersCount(0)
    setIncorrectTracker([])
    setQuizMode('practice')
    setQuizStartTime(Date.now())
  }

  // 1b. Quiz Challenge Mode setup (Scenario-based questions from Structural Specifics)
  const startQuizChallenge = () => {
    const challengeQuestions = generateChallengeQuestions()
    // Pull randomly from the Structural Specifics library
    const shuffled = [...challengeQuestions].sort(() => 0.5 - Math.random())
    setCurrentQuestions(shuffled)
    setCurrentIndex(0)
    setSelectedOption(null)
    setIsAnswered(false)
    setCorrectAnswersCount(0)
    setIncorrectTracker([])
    setQuizMode('challenge')
    setQuizStartTime(Date.now())
  }

  // 1c. Blueprint Reading Quiz setup
  const startBlueprintReadingQuiz = () => {
    const bpQuestions = generateBlueprintReadingQuestions(blueprintsData)
    // Pull randomly from the Blueprint Reading library
    const shuffled = [...bpQuestions].sort(() => 0.5 - Math.random())
    setCurrentQuestions(shuffled)
    setCurrentIndex(0)
    setSelectedOption(null)
    setIsAnswered(false)
    setCorrectAnswersCount(0)
    setIncorrectTracker([])
    setQuizMode('blueprint_reading')
    setQuizStartTime(Date.now())
  }

  // 2. Exam Simulator setup
  const startExamSimulator = () => {
    // Aligned with standard 8 question simulator (scaled down for demo but maintains robust scoring)
    const shuffled = [...questionsData].sort(() => 0.5 - Math.random())
    setCurrentQuestions(shuffled)
    setCurrentIndex(0)
    setSelectedOption(null)
    setIsAnswered(false)
    setCorrectAnswersCount(0)
    setIncorrectTracker([])
    setTimerCount(300) // 5 minutes
    setExamFinished(false)
    setExamSubmitted(false)
    setIsOfficialMock(false)
    setFlaggedQuestions([])
    setQuestionTimeElapsed(0)
    setShowReviewScreen(false)
    setIsNavigationExpanded(false)
    setQuizMode('exam')
    setQuizStartTime(Date.now())

    // Start Timer Interval
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setTimerCount(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          handleFinishExam(shuffled, []) // force complete exam on timeout
          return 0
        }
        return prev - 1
      })
      setQuestionTimeElapsed(prev => prev + 1)
    }, 1000)
  }

  // 2b. Official RSOS Mock Exam setup (100 questions, weighted perfectly)
  const startOfficialMockExam = () => {
    const weightMap = {
      'Block A': 11,
      'Block B': 9,
      'Block C': 14,
      'Block D': 28,
      'Block E': 14,
      'Block F': 13,
      'Block G': 11
    }

    let selectedQuestions = []

    Object.entries(weightMap).forEach(([blockId, count]) => {
      const blockQuestions = questionsData.filter(q => q.block === blockId)
      const shuffledBlock = [...blockQuestions].sort(() => 0.5 - Math.random())
      selectedQuestions.push(...shuffledBlock.slice(0, count))
    })

    // Shuffle the final 100-question set
    const finalQuestions = selectedQuestions.sort(() => 0.5 - Math.random())

    setCurrentQuestions(finalQuestions)
    setCurrentIndex(0)
    setSelectedOption(null)
    setIsAnswered(false)
    setCorrectAnswersCount(0)
    setIncorrectTracker([])
    setTimerCount(14400) // 4 hours in seconds
    setExamFinished(false)
    setExamSubmitted(false)
    setIsOfficialMock(true)
    setFlaggedQuestions([])
    setQuestionTimeElapsed(0)
    setShowReviewScreen(false)
    setIsNavigationExpanded(false)
    setQuizMode('exam')
    setQuizStartTime(Date.now())

    // Start Timer Interval
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setTimerCount(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          handleFinishExam(finalQuestions, []) // force complete exam on timeout
          return 0
        }
        return prev - 1
      })
      setQuestionTimeElapsed(prev => prev + 1)
    }, 1000)
  }

  // 3. Nail It Deck setup
  const startNailItMode = () => {
    if ((nailItDeck || []).length === 0) return
    // Gather matching questions
    const targetQuestions = (questionsData || []).filter(q => (nailItDeck || []).includes(q.id))
    setCurrentQuestions(targetQuestions)
    setCurrentIndex(0)
    setSelectedOption(null)
    setIsAnswered(false)
    setCorrectAnswersCount(0)
    setIncorrectTracker([])
    setQuizMode('nailit')
    setQuizStartTime(Date.now())
  }

  // 4. Flashcard mode setup
  const handleGradeCard = (cardId, grade) => {
    const currentReview = flashcardReviews ? flashcardReviews[cardId] : null
    const nextReview = calculateNextReview(currentReview, grade)

    setFlashcardReviews(prev => ({
      ...prev,
      [cardId]: {
        ...nextReview,
        id: cardId
      }
    }))

    setIsFlipped(false)

    setTimeout(() => {
      if (grade === 'hard') {
        setFlashcardDeck(prevDeck => {
          if (prevDeck.length <= 1) return prevDeck
          const currentCard = prevDeck[flashcardIndex]
          const remaining = prevDeck.filter((_, idx) => idx !== flashcardIndex)
          return [...remaining, currentCard]
        })
      } else {
        setFlashcardDeck(prevDeck => {
          const updated = prevDeck.filter((_, idx) => idx !== flashcardIndex)
          return updated
        })
        setFlashcardIndex(prevIndex => {
          if (prevIndex >= flashcardDeck.length - 1) {
            return 0
          }
          return prevIndex
        })
      }
    }, 150)
  }

  const startFlashcards = () => {
    const due = filterDueCards(questionsData, flashcardReviews)
    setFlashcardDeck(due)
    setFlashcardStudyAheadMode(false)
    setFlashcardIndex(0)
    setIsFlipped(false)
    setQuizMode('flashcards')
  }

  // 5. Random Burst mode setup
  const startRandomBurst = () => {
    const shuffled = [...questionsData]
      .sort(() => 0.5 - Math.random())
      .slice(0, 5)
      .map(q => ({ ...q, userAnswerIndex: undefined })) // fresh copy with reset userAnswerIndex

    setCurrentQuestions(shuffled)
    setCurrentIndex(0)
    setSelectedOption(null)
    setIsAnswered(false)
    setCorrectAnswersCount(0)
    setIncorrectTracker([])
    setTimerCount(60) // 60 seconds countdown
    setExamFinished(false)
    setExamSubmitted(false)
    setQuizMode('burst')
    setQuizStartTime(Date.now())

    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setTimerCount(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          handleFinishBurst(shuffled) // force finish
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleSelectBurstOption = (optionIndex) => {
    if (isAnswered) return
    setSelectedOption(optionIndex)
    
    const activeQ = currentQuestions[currentIndex]
    const isCorrect = optionIndex === activeQ.correctOptionIndex
    
    const updatedQuestions = [...currentQuestions]
    updatedQuestions[currentIndex].userAnswerIndex = optionIndex
    setCurrentQuestions(updatedQuestions)

    if (isCorrect) {
      setCorrectAnswersCount(prev => prev + 1)
      setUserXP(prev => prev + 10)
    } else {
      setIncorrectTracker(prev => [...prev, activeQ.id])
    }
    
    setIsAnswered(true)
  }

  const handleNextBurstQuestion = () => {
    if (currentIndex + 1 < currentQuestions.length) {
      setCurrentIndex(prev => prev + 1)
      setSelectedOption(null)
      setIsAnswered(false)
    } else {
      handleFinishBurst()
    }
  }

  const handleFinishBurst = (questionsArray = currentQuestions) => {
    if (timerRef.current) clearInterval(timerRef.current)
    
    let correct = 0
    const wrongs = []

    questionsArray.forEach(q => {
      if (q.userAnswerIndex !== undefined && q.userAnswerIndex !== null) {
        if (q.userAnswerIndex === q.correctOptionIndex) {
          correct++
        } else {
          wrongs.push(q.id)
          pushToNailIt(q.id)
        }
      } else {
        wrongs.push(q.id)
        pushToNailIt(q.id)
      }
    })

    setCorrectAnswersCount(correct)
    setIncorrectTracker(wrongs)
    setExamFinished(true)
    setExamSubmitted(true)

    addQuizRecord({
      mode: 'Random Burst',
      score: correct,
      total: questionsArray.length,
      block: 'All Blocks',
      incorrectQuestions: wrongs,
      questionIds: questionsArray.map(q => q.id),
      timeTaken: quizStartTime ? Math.round((Date.now() - quizStartTime) / 1000) : 0
    })
  }

  // Handle Practice Option Select
  const handleSelectPracticeOption = (optionIndex) => {
    if (isAnswered) return
    setSelectedOption(optionIndex)
  }

  const handleConfirmPracticeAnswer = () => {
    if (selectedOption === null || isAnswered) return
    
    const activeQ = currentQuestions[currentIndex]
    const isCorrect = selectedOption === activeQ.correctOptionIndex
    
    if (isCorrect) {
      setCorrectAnswersCount(prev => prev + 1)
      setUserXP(prev => prev + 10)
    } else {
      // Add to incorrect tracker for Nail It deck push on session end
      setIncorrectTracker(prev => [...prev, activeQ.id])
    }
    
    setIsAnswered(true)
  }

  const handleNextPracticeQuestion = () => {
    if (currentIndex + 1 < currentQuestions.length) {
      const nextIdx = currentIndex + 1
      setCurrentIndex(nextIdx)
      if (isCramMode) {
        setSelectedOption(currentQuestions[nextIdx].correctOptionIndex)
        setIsAnswered(true)
      } else {
        setSelectedOption(null)
        setIsAnswered(false)
      }
    } else {
      if (isCramMode) {
        setIsCramMode(false)
        setQuizMode('menu')
      } else {
        // End of practice/challenge session
        const finalIncorrect = [...incorrectTracker]
        const activeQ = currentQuestions[currentIndex]
        const isCorrect = selectedOption === activeQ.correctOptionIndex
        if (!isCorrect && !finalIncorrect.includes(activeQ.id)) {
          finalIncorrect.push(activeQ.id)
        }

        const uniqueBlocksInCurrentQuiz = Array.from(new Set(currentQuestions.map(q => q.block)))
        const activeBlockLabel = getSelectedBlocksLabel(uniqueBlocksInCurrentQuiz)

        addQuizRecord({
          mode: quizMode === 'challenge' ? 'Structural Specifics Challenge' : quizMode === 'blueprint_reading' ? 'Blueprint Reading Quiz' : 'Practice Session',
          score: correctAnswersCount + (isCorrect ? 1 : 0),
          total: currentQuestions.length,
          block: quizMode === 'challenge' ? 'Structural Specifics' : quizMode === 'blueprint_reading' ? 'Blueprint Reading' : activeBlockLabel,
          incorrectQuestions: finalIncorrect,
          questionIds: currentQuestions.map(q => q.id),
          timeTaken: quizStartTime ? Math.round((Date.now() - quizStartTime) / 1000) : 0
        })
        // Push any wrong questions to Nail It deck
        finalIncorrect.forEach(id => pushToNailIt(id))
        setQuizMode('menu')
      }
    }
  }

  // Handle Exam option selection
  const handleSelectExamOption = (optionIndex) => {
    if (examSubmitted) return
    
    // Create or update answered state
    const updatedQuestions = [...currentQuestions]
    updatedQuestions[currentIndex].userAnswerIndex = optionIndex
    setCurrentQuestions(updatedQuestions)
    setSelectedOption(optionIndex)
  }

  const handleFinishExam = (questionsArray = currentQuestions, finalTracker = incorrectTracker) => {
    if (timerRef.current) clearInterval(timerRef.current)
    
    let correct = 0
    const wrongs = []

    questionsArray.forEach(q => {
      if (q.userAnswerIndex === q.correctOptionIndex) {
        correct++
      } else {
        wrongs.push(q.id)
        pushToNailIt(q.id) // automatically push wrong answer to Nail It Review Deck
      }
    })

    setCorrectAnswersCount(correct)
    setIncorrectTracker(wrongs)
    setExamFinished(true)
    setExamSubmitted(true)

    // Save exam score record
    addQuizRecord({
      mode: 'Exam Simulator',
      score: correct,
      total: questionsArray.length,
      block: 'All Blocks',
      incorrectQuestions: wrongs,
      questionIds: questionsArray.map(q => q.id),
      timeTaken: quizStartTime ? Math.round((Date.now() - quizStartTime) / 1000) : 0
    })

    // Award 10 XP for each correctly answered question in the Exam Simulator
    setUserXP(prev => prev + (correct * 10))

    // Plus 500 XP bonus if passed (score >= 70%)
    const passThreshold = 0.70
    if (questionsArray.length > 0 && (correct / questionsArray.length) >= passThreshold) {
      setUserXP(prev => prev + 500)
    }
  }

  // Clean intervals on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  // Restore and sync selectedOption state with saved answer
  useEffect(() => {
    if (quizMode === 'exam' && currentQuestions && currentQuestions[currentIndex]) {
      const savedAns = currentQuestions[currentIndex].userAnswerIndex
      setSelectedOption(savedAns !== undefined && savedAns !== null ? savedAns : null)
    }
  }, [currentIndex, currentQuestions, quizMode])

  const currentQuestion = currentQuestions[currentIndex]

  // Pass threshold metric
  const passThreshold = 0.70 // 70% required
  const isPassed = currentQuestions.length > 0 && (correctAnswersCount / currentQuestions.length) >= passThreshold

  // Defensive auto-population for active quiz modes if currentQuestions is empty
  useEffect(() => {
    if (quizMode !== 'menu' && quizMode !== 'flashcards' && (!currentQuestions || currentQuestions.length === 0)) {
      let isMounted = true
      try {
        let loadedQuestions = []
        if (quizMode === 'blueprint_reading') {
          loadedQuestions = generateBlueprintReadingQuestions(blueprintsData)
        } else if (customQuizQuestions && Array.isArray(customQuizQuestions) && customQuizQuestions.length > 0) {
          loadedQuestions = customQuizQuestions
        } else {
          loadedQuestions = questionsData || []
        }

        if (!loadedQuestions || loadedQuestions.length === 0) {
          loadedQuestions = questionsData || []
        }

        if (isMounted && loadedQuestions && loadedQuestions.length > 0) {
          setCurrentQuestions(loadedQuestions)
          setCurrentIndex(0)
        }
      } catch (err) {
        console.error('Error populating quiz questions:', err)
        if (isMounted) {
          setCurrentQuestions(questionsData || [])
          setCurrentIndex(0)
        }
      }
      return () => { isMounted = false }
    }
  }, [quizMode, currentQuestions, customQuizQuestions])

  // Dynamic loading/safety guard for when questions are expected but array is empty/null
  if (quizMode !== 'menu' && quizMode !== 'flashcards' && (!currentQuestions || currentQuestions.length === 0)) {
    return (
      <div className="bg-slate-900 text-slate-100 rounded-2xl p-8 text-center border border-slate-800 space-y-4 max-w-md mx-auto my-12 shadow-2xl">
        <span className="text-4xl animate-spin inline-block">🪵</span>
        <h3 className="text-lg font-black uppercase tracking-tight text-white">Loading Blueprints...</h3>
        <p className="text-slate-400 text-xs font-medium max-w-sm mx-auto leading-relaxed">
          The Red Seal Carpentry practice engine is preparing the questions bank. If this takes longer than expected, click below to load fallback questions or return to the menu.
        </p>
        <div className="space-y-2">
          <button 
            onClick={() => {
              setCurrentQuestions(questionsData || [])
              setCurrentIndex(0)
            }}
            className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black uppercase tracking-wider py-3 rounded-xl min-h-[44px] transition-colors shadow"
          >
            Load Questions Immediately
          </button>
          <button 
            onClick={() => {
              if (isCramMode) setIsCramMode(false)
              setQuizMode('menu')
            }}
            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-black uppercase tracking-wider py-3 rounded-xl min-h-[44px] transition-colors shadow"
          >
            Return to Prep Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 relative">
      
      {/* 1. QUIZ SELECTION MENU */}
      {quizMode === 'menu' && (
        <div className="space-y-8">
          
          {/* TITLE BOX */}
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
            <span className="text-xs uppercase tracking-wider text-brand-500 font-extrabold flex items-center gap-1">
              <Award size={12} /> Prep Engine
            </span>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mt-1">Quiz Engine & Flashcards</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Test your carpentry knowledge under immediate feedback, simulated examinations, or spaced repetition decks.
            </p>
          </div>

          {/* GLOBAL SEARCH & FILTER BAR */}
          <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-150 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-brand-500/10 text-brand-500 rounded-2xl">
                  <Search size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-tight text-slate-900 dark:text-white">Search & Filter Question Bank</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                    Instantly query {questionsData.length} Canadian Red Seal carpentry prep questions, answers, and building code explanations.
                  </p>
                </div>
              </div>

              {filteredSearchQuestions.length > 0 && (searchQuery.trim() !== '' || searchBlock !== 'all' || searchDifficulty !== 'all') && (
                <button
                  onClick={() => {
                    setCustomQuizQuestions(filteredSearchQuestions.map(q => q.id))
                    setActiveTab('quiz')
                    showToast(`Started custom practice with ${filteredSearchQuestions.length} matched questions!`)
                  }}
                  className="bg-brand-500 hover:bg-brand-600 text-white dark:text-slate-950 font-black text-xs uppercase px-4 py-2.5 rounded-xl transition-all min-h-[44px] flex items-center gap-1.5 shadow"
                >
                  <Zap size={13} className="fill-current" />
                  <span>Practice {filteredSearchQuestions.length} Matches</span>
                </button>
              )}
            </div>

            {/* Inputs Row */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              {/* Keyword Query */}
              <div className="md:col-span-6 relative">
                <input
                  type="text"
                  placeholder="Filter by keyword (e.g. rafter, riser, joist, concrete)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent min-h-[44px] text-slate-900 dark:text-white transition-all shadow-inner"
                />
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white font-black text-xs min-w-[24px] min-h-[24px] flex items-center justify-center"
                    aria-label="Clear query text"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Block Dropdown */}
              <div className="md:col-span-3">
                <select
                  value={searchBlock}
                  onChange={(e) => setSearchBlock(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent min-h-[44px] text-slate-900 dark:text-white transition-all shadow-inner"
                >
                  <option value="all">All Blocks (A - G)</option>
                  <option value="Block A">Block A: Occupational Skills</option>
                  <option value="Block B">Block B: Planning & Layout</option>
                  <option value="Block C">Block C: Concrete Formwork</option>
                  <option value="Block D">Block D: Framing</option>
                  <option value="Block E">Block E: Exterior Finish</option>
                  <option value="Block F">Block F: Interior Finish</option>
                  <option value="Block G">Block G: Renovations</option>
                </select>
              </div>

              {/* Difficulty Dropdown */}
              <div className="md:col-span-3">
                <select
                  value={searchDifficulty}
                  onChange={(e) => setSearchDifficulty(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent min-h-[44px] text-slate-900 dark:text-white transition-all shadow-inner"
                >
                  <option value="all">All Difficulties</option>
                  <option value="Beginner">Entry Level (Beginner)</option>
                  <option value="Intermediate">Journeyman (Intermediate)</option>
                  <option value="Advanced">Expert Level (Advanced)</option>
                </select>
              </div>
            </div>

            {/* Live Search Results Area */}
            {(searchQuery.trim() !== '' || searchBlock !== 'all' || searchDifficulty !== 'all') && (
              <div className="border-t border-slate-200 dark:border-slate-800/80 pt-4 space-y-3">
                <div className="flex justify-between items-center text-[11px] text-slate-500 dark:text-slate-400 font-bold">
                  <span>Found {filteredSearchQuestions.length} match{filteredSearchQuestions.length !== 1 ? 'es' : ''} in candidate bank</span>
                  <button
                    onClick={() => {
                      setSearchQuery('')
                      setSearchBlock('all')
                      setSearchDifficulty('all')
                      setExpandedQuestionId(null)
                    }}
                    className="text-brand-500 hover:underline uppercase text-[9px] font-black tracking-wider"
                  >
                    Clear All Filters
                  </button>
                </div>

                {filteredSearchQuestions.length === 0 ? (
                  <div className="text-center py-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-150 dark:border-slate-800/60">
                    <p className="text-xs text-slate-400 font-semibold">
                      No carpentry questions found matching your search term or criteria.
                    </p>
                  </div>
                ) : (
                  <div className="max-h-[360px] overflow-y-auto pr-1 space-y-2.5">
                    {filteredSearchQuestions.slice(0, 30).map((q) => {
                      const isExpanded = expandedQuestionId === q.id
                      return (
                        <div 
                          key={q.id} 
                          className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800/60 rounded-2xl p-4 text-xs transition-all hover:border-slate-300 dark:hover:border-slate-700"
                        >
                          <div 
                            className="flex justify-between items-start gap-4 cursor-pointer select-none"
                            onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                          >
                            <div className="space-y-1.5 flex-1">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className="text-[9px] font-black uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded">
                                  {q.block}
                                </span>
                                <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                                  q.difficulty === 'Beginner' 
                                    ? 'bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400' 
                                    : q.difficulty === 'Intermediate' 
                                    ? 'bg-blue-100 dark:bg-blue-950/40 text-brand-600 dark:text-brand-400' 
                                    : 'bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400'
                                }`}>
                                  {q.difficulty === 'Beginner' ? 'Entry' : q.difficulty === 'Intermediate' ? 'Journeyman' : 'Expert'}
                                </span>
                                {q.codeReference && (
                                  <span className="text-[9px] font-mono font-bold text-brand-500 bg-brand-500/5 px-2 py-0.5 rounded border border-brand-500/10">
                                    {q.codeReference}
                                  </span>
                                )}
                              </div>
                              <p className="font-bold text-slate-800 dark:text-slate-200 leading-snug">
                                {q.question}
                              </p>
                            </div>
                            <span className="text-slate-400 dark:text-slate-500 shrink-0 font-black text-sm p-1">
                              {isExpanded ? '▲' : '▼'}
                            </span>
                          </div>

                          {isExpanded && (
                            <div className="mt-4 border-t border-slate-100 dark:border-slate-800/80 pt-4 space-y-4 animate-fadeIn">
                              {/* Option choices list */}
                              <div className="space-y-1.5">
                                <p className="text-[9.5px] font-black uppercase tracking-wider text-slate-400">Multiple Choice Answers:</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {q.options.map((opt, idx) => {
                                    const isCorrect = idx === q.correctOptionIndex
                                    return (
                                      <div 
                                        key={idx}
                                        className={`p-3 rounded-xl border text-[11px] font-medium transition-all ${
                                          isCorrect 
                                            ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 font-bold shadow-sm' 
                                            : 'border-slate-150 dark:border-slate-850 bg-slate-50/30 dark:bg-slate-950/10 text-slate-500 dark:text-slate-400'
                                        }`}
                                      >
                                        <span className="font-bold mr-1.5">{['A','B','C','D'][idx]}.</span>
                                        {opt}
                                        {isCorrect && <span className="ml-1.5 text-[9px] font-black uppercase bg-emerald-500 text-white px-1 py-0.5 rounded">Correct Choice</span>}
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>

                              {/* Two-part building code explanation */}
                              <div className="space-y-3 bg-slate-50/50 dark:bg-slate-950/30 p-4 rounded-2xl border border-slate-150 dark:border-slate-800/60">
                                <div>
                                  <span className="text-[9.5px] font-black uppercase text-brand-500 tracking-wider">Official Code Basis</span>
                                  <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium leading-relaxed mt-1">
                                    {q.explanationOfficial || q.explanation || 'Official National Building Code references apply.'}
                                  </p>
                                </div>
                                {q.jobsiteTranslation && (
                                  <div className="border-t border-slate-200/50 dark:border-slate-800/50 pt-3 mt-3">
                                    <span className="text-[9.5px] font-black uppercase text-amber-500 tracking-wider">Jobsite Interpretation</span>
                                    <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium leading-relaxed mt-1">
                                      {q.jobsiteTranslation}
                                    </p>
                                  </div>
                                )}
                              </div>

                              {/* Trigger specific practice run */}
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => {
                                    setCustomQuizQuestions([q.id])
                                    setActiveTab('quiz')
                                    showToast("Single-question practice run started!")
                                  }}
                                  className="bg-brand-500 hover:bg-brand-600 text-white dark:text-slate-950 font-black text-[10px] uppercase px-4 py-2 rounded-xl transition-all min-h-[36px] shadow-sm"
                                >
                                  Practice This Question
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}

                    {filteredSearchQuestions.length > 30 && (
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black text-center pt-2">
                        Truncated display to first 30 matches. Filter with more precise terms to narrow down questions!
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* PRACTICE MODE CARD */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4 hover:border-brand-500 transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-brand-50 dark:bg-brand-950/40 text-brand-500 rounded-xl w-fit">
                    <BookOpen size={24} />
                  </div>
                  <span className="text-[10px] bg-slate-100 dark:bg-slate-850 px-2 py-0.5 rounded font-black text-slate-500">
                    {selectedPracticeBlocks.length === 7 ? 'Comprehensive' : `${selectedPracticeBlocks.length} Blocks`}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Practice Study Mode</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold mt-1">
                    Go through the question bank at your own pace. Receive instant correctness indicators, detailed building code explanations, and references for every single question.
                  </p>
                </div>

                {/* STYLISH MULTI-SELECT STUDY BLOCK PICKER */}
                <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase text-slate-400">
                    <span>Filter Study Blocks</span>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => setSelectedPracticeBlocks(['Block A', 'Block B', 'Block C', 'Block D', 'Block E', 'Block F', 'Block G'])}
                        className="text-brand-500 hover:text-brand-600 transition-colors uppercase text-[9px] font-black"
                      >
                        All
                      </button>
                      <span className="text-slate-200 dark:text-slate-800">|</span>
                      <button 
                        onClick={() => setSelectedPracticeBlocks([])}
                        className="text-slate-400 hover:text-slate-500 transition-colors uppercase text-[9px] font-black"
                      >
                        Clear
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { id: 'Block A', label: 'A • Skills' },
                      { id: 'Block B', label: 'B • Layout' },
                      { id: 'Block C', label: 'C • Concrete' },
                      { id: 'Block D', label: 'D • Framing' },
                      { id: 'Block E', label: 'E • Exterior' },
                      { id: 'Block F', label: 'F • Interior' },
                      { id: 'Block G', label: 'G • Renovations' }
                    ].map((blockItem) => {
                      const isSelected = selectedPracticeBlocks.includes(blockItem.id)
                      return (
                        <button
                          key={blockItem.id}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedPracticeBlocks(prev => prev.filter(b => b !== blockItem.id))
                            } else {
                              setSelectedPracticeBlocks(prev => [...prev, blockItem.id])
                            }
                          }}
                          className={`text-left px-2.5 py-1.5 rounded-lg text-[10px] font-black border transition-all flex items-center justify-between min-h-[32px] ${
                            isSelected 
                              ? 'border-brand-500 bg-brand-50/40 dark:bg-brand-950/20 text-brand-600 dark:text-brand-400' 
                              : 'border-slate-150 dark:border-slate-800/80 text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-850/30'
                          }`}
                        >
                          <span className="truncate">{blockItem.label}</span>
                          {isSelected ? (
                            <span className="w-2 h-2 rounded-full bg-brand-500" />
                          ) : (
                            <span className="w-2 h-2 rounded-full border border-slate-300 dark:border-slate-700" />
                          )}
                        </button>
                      )
                    })}
                  </div>

                  {selectedPracticeBlocks.length === 0 && (
                    <p className="text-[10px] text-rose-500 font-bold animate-pulse text-center mt-1">
                      ⚠️ Please select at least one study block to start
                    </p>
                  )}
                </div>

                {/* DIFFICULTY TIER SELECTOR */}
                <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase text-slate-400">
                    <span>Difficulty Tier</span>
                    <span className="text-[9px] font-black text-brand-500 bg-brand-500/10 px-1.5 py-0.5 rounded">
                      Graduated Learning
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {[
                      { id: 'all', label: 'All Levels', desc: 'Full mix' },
                      { id: 'Beginner', label: 'Entry', desc: 'Occupational' },
                      { id: 'Intermediate', label: 'Journeyman', desc: 'Standard' },
                      { id: 'Advanced', label: 'Expert', desc: 'Complex codes' }
                    ].map((tier) => {
                      const isSelected = selectedDifficulty === tier.id
                      return (
                        <button
                          key={tier.id}
                          onClick={() => setSelectedDifficulty(tier.id)}
                          className={`text-left px-2.5 py-1.5 rounded-lg border transition-all flex flex-col justify-between min-h-[44px] ${
                            isSelected 
                              ? 'border-brand-500 bg-brand-50/40 dark:bg-brand-950/20 text-brand-600 dark:text-brand-400' 
                              : 'border-slate-150 dark:border-slate-800/80 text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-850/30 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                          }`}
                        >
                          <span className="text-[10px] font-black leading-tight">{tier.label}</span>
                          <span className="text-[8px] text-slate-400 dark:text-slate-500 font-semibold truncate mt-0.5">{tier.desc}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

              </div>

              <button 
                onClick={startPracticeMode}
                disabled={selectedPracticeBlocks.length === 0 || getFilteredPracticeQuestionsCount() === 0}
                className={`w-full font-black py-3 rounded-xl text-sm transition-all mt-4 min-h-[48px] ${
                  selectedPracticeBlocks.length > 0 && getFilteredPracticeQuestionsCount() > 0
                    ? 'bg-brand-500 hover:bg-brand-600 text-white shadow'
                    : 'bg-slate-100 dark:bg-slate-850 text-slate-400 cursor-not-allowed'
                }`}
              >
                {getFilteredPracticeQuestionsCount() === 0 
                  ? 'No matching questions'
                  : `Launch Practice (${getFilteredPracticeQuestionsCount()} Cards)`
                }
              </button>
            </div>

            {/* EXAM SIMULATOR CARD */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4 hover:border-brand-500 transition-colors flex flex-col justify-between">
              <div className="space-y-3">
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500 rounded-xl w-fit">
                  <Clock size={24} />
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Exam Simulator</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                  A blind, timed simulator with a 5-minute clock. Grades are hidden until final submission. Incorrect answers are automatically flagged and pushed to the **Nail It spaced repetition deck**!
                </p>
              </div>
              <button 
                onClick={startExamSimulator}
                className="w-full bg-brand-500 hover:bg-brand-600 text-white font-black py-3 rounded-xl text-sm shadow transition-all min-h-[48px]"
              >
                Start Exam Simulator
              </button>
            </div>

            {/* OFFICIAL RSOS MOCK EXAM CARD */}
            <div className="bg-slate-900 dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-red-500/30 space-y-4 hover:border-red-500 transition-all flex flex-col justify-between text-white">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="p-3 bg-red-500/20 text-red-400 rounded-xl w-fit">
                    <Award size={24} />
                  </div>
                  <span className="text-[9px] bg-red-500/25 text-red-300 px-2 py-0.5 rounded font-black uppercase tracking-widest animate-pulse">
                    Official Weighting
                  </span>
                </div>
                <h3 className="text-xl font-black text-white uppercase tracking-tight">Official RSOS Mock Exam</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                  Generate a full-scale 100-question exam perfectly proportioned by the Canadian Red Seal Occupational Standards (RSOS):
                </p>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[9px] font-mono text-slate-400 bg-black/35 p-2 rounded-lg">
                  <div>• Block A: 11% (Skills)</div>
                  <div>• Block B: 9% (Layout)</div>
                  <div>• Block C: 14% (Concrete)</div>
                  <div>• Block D: 28% (Framing)</div>
                  <div>• Block E: 14% (Exterior)</div>
                  <div>• Block F: 13% (Interior)</div>
                  <div className="col-span-2">• Block G: 11% (Renovations)</div>
                </div>
                <div className="flex items-center space-x-1.5 text-rose-400 bg-red-500/10 p-2 rounded-lg border border-red-500/20">
                  <span className="text-xs">⚠️</span>
                  <p className="text-[9px] font-black uppercase">Warning: This simulates the official 4-hour Canadian exam.</p>
                </div>
              </div>
              <button 
                onClick={startOfficialMockExam}
                className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-3 rounded-xl text-sm shadow transition-all min-h-[48px]"
              >
                Launch 100-Question Mock Exam
              </button>
            </div>

            {/* NAIL IT REVIEW DECK */}
            <div className={`p-6 rounded-2xl shadow-sm border space-y-4 flex flex-col justify-between transition-colors ${
              (nailItDeck || []).length > 0 
                ? 'bg-amber-500/10 border-amber-500/30 text-slate-900 dark:text-white hover:border-amber-500' 
                : 'bg-slate-100 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-400'
            }`}>
              <div className="space-y-3">
                <div className={`p-3 rounded-xl w-fit ${(nailItDeck || []).length > 0 ? 'bg-amber-500/20 text-amber-500' : 'bg-slate-200 dark:bg-slate-850 text-slate-400'}`}>
                  <Flame size={24} className={(nailItDeck || []).length > 0 ? 'fill-current' : ''} />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight">"Nail It" Review Deck</h3>
                <p className="text-xs leading-relaxed font-semibold">
                  Your personalized review queue. Incorrect answers from the Exam Simulator are immediately stored here. Tackle this custom queue repeatedly until you clear all weak spots!
                </p>
                <div className="flex items-center space-x-2 text-xs font-black">
                  <span className={(nailItDeck || []).length > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'}>
                    {(nailItDeck || []).length} weak points flagged for review.
                  </span>
                </div>
              </div>
              <button 
                onClick={startNailItMode}
                disabled={(nailItDeck || []).length === 0}
                className={`w-full font-black py-3 rounded-xl text-sm shadow transition-all min-h-[48px] ${
                  (nailItDeck || []).length > 0 
                    ? 'bg-amber-500 hover:bg-amber-600 text-slate-950' 
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                }`}
              >
                Practice Weak Spots
              </button>
            </div>

            {/* FLASHCARDS MEMORIZATION */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4 hover:border-brand-500 transition-colors flex flex-col justify-between">
              <div className="space-y-3">
                <div className="p-3 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-500 rounded-xl w-fit">
                  <Zap size={24} />
                </div>
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">3D Code Flashcards</h3>
                  {(() => {
                    const count = Object.values(flashcardReviews || {}).filter(isCardDue).length
                    return count > 0 ? (
                      <span className="text-[10px] bg-emerald-500 text-white font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {count} Due
                      </span>
                    ) : null
                  })()}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                  Now upgraded with a highly efficient **Spaced Repetition System (SRS)** Leitner box algorithm. Rapidly memorize standard values, timber span criteria, and rules.
                  {(() => {
                    const count = Object.values(flashcardReviews || {}).filter(isCardDue).length
                    return count > 0 ? (
                      <span className="text-emerald-500 dark:text-emerald-400 block mt-1.5 font-black">🎯 {count} cards due for active review today.</span>
                    ) : (
                      <span className="text-slate-400 block mt-1.5 font-bold">✨ All caught up! Click below to study ahead.</span>
                    )
                  })()}
                </p>
              </div>
              <button 
                onClick={startFlashcards}
                className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-black py-3 rounded-xl text-sm transition-all min-h-[48px]"
              >
                Launch Flashcards
              </button>
            </div>

            {/* RANDOM BURST MODE CARD */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4 hover:border-amber-500 transition-colors flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="p-3 bg-amber-50 dark:bg-amber-950/40 text-amber-500 rounded-xl w-fit group-hover:scale-110 transition-transform">
                  <Zap size={24} className="fill-amber-500" />
                </div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Random Burst</h3>
                  <span className="text-[9px] bg-red-500 text-white font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse">60s Run</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                  Pulls 5 random questions from any block for an intense 60-second high-speed knowledge check. Quick feedback, rapid-fire decisions, and maximum focus under pressure!
                </p>
              </div>
              <button 
                onClick={startRandomBurst}
                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-3 rounded-xl text-sm transition-all shadow min-h-[48px]"
              >
                Launch Speed Run
              </button>
            </div>

            {/* QUIZ CHALLENGE MODE CARD */}
            <div className="bg-gradient-to-br from-brand-500/10 to-purple-500/10 dark:from-brand-950/20 dark:to-purple-950/20 p-6 rounded-2xl shadow-sm border border-brand-500/30 space-y-4 hover:border-brand-500 transition-all flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="p-3 bg-brand-50 dark:bg-brand-950/40 text-brand-500 rounded-xl w-fit group-hover:scale-110 transition-transform">
                  <Award size={24} className="text-brand-500" />
                </div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Structural Challenge</h3>
                  <span className="text-[9px] bg-brand-500 text-white font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider">Scenario Mode</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                  Test your journeyman-level skills with scenario-based questions generated directly from the **Structural Specifics Library**. Covers foundations, ICF, roof systems, and masonry with 100% technical accuracy.
                </p>
              </div>
              <button 
                onClick={startQuizChallenge}
                className="w-full bg-brand-500 hover:bg-brand-600 text-white font-black py-3 rounded-xl text-sm transition-all shadow min-h-[48px]"
              >
                Launch Challenge Mode
              </button>
            </div>

            {/* BLUEPRINT READING QUIZ CARD */}
            <div className="bg-gradient-to-br from-brand-500/10 to-emerald-500/10 dark:from-brand-950/20 dark:to-emerald-950/20 p-6 rounded-2xl shadow-sm border border-brand-500/30 space-y-4 hover:border-brand-500 transition-all flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="p-3 bg-brand-50 dark:bg-brand-950/40 text-emerald-500 rounded-xl w-fit group-hover:scale-110 transition-transform">
                  <Grid size={24} className="text-emerald-500" />
                </div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Blueprint Reading</h3>
                  <span className="text-[9px] bg-emerald-500 text-white font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider">New</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                  Test your print-reading mastery! Dynamically loaded from high-fidelity blueprints, this category covers **line types** (hidden, centerline, breaks), **drawing scales** (imperial, metric), and standard **section symbols**.
                </p>
              </div>
              <button 
                onClick={startBlueprintReadingQuiz}
                className="w-full bg-brand-500 hover:bg-brand-600 text-white font-black py-3 rounded-xl text-sm transition-all shadow min-h-[48px]"
              >
                Launch Blueprint Quiz
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 2. PRACTICE MODE ACTIVE INTERFACE */}
      {(quizMode === 'practice' || quizMode === 'challenge' || quizMode === 'blueprint_reading') && currentQuestion && (
        <div className="space-y-6">
          {!isCramMode && (
            <div className="flex flex-row justify-between items-center bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2">
              <div className="flex flex-col">
                <div className="relative flex items-center gap-2">
                  <span className="text-sm font-bold text-cyan-700 dark:text-cyan-400 uppercase tracking-wider">
                    {quizMode === 'challenge' ? 'structural challenge' : quizMode === 'blueprint_reading' ? 'blueprint reading quiz' : `${quizMode} mode`}
                  </span>
                  <button onClick={() => setShowPracticeInfo(!showPracticeInfo)} className="text-slate-400 hover:text-slate-200 cursor-pointer">ⓘ</button>
                  {showPracticeInfo && (
                    <div className="absolute top-full left-0 mt-2 w-72 bg-slate-800 border border-slate-600 rounded-md p-3 text-sm text-slate-200 z-[60] shadow-xl font-normal">
                      <strong className="block text-cyan-400 mb-1">Practice Mode</strong>
                      <p>Work through the Red Seal question bank at your own pace. Official Code Explanations and Jobsite Translations are available to review after you submit your answer.</p>
                    </div>
                  )}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">Question {currentIndex + 1} of {currentQuestions.length}</p>
              </div>
              <div className="flex items-center">
                <div className="relative flex items-center gap-2">
                  <button onClick={() => setShowCheatSheetInfo(!showCheatSheetInfo)} className="text-slate-400 hover:text-slate-200 cursor-pointer">ⓘ</button>
                  {showCheatSheetInfo && (
                    <div className="absolute top-full right-0 mt-2 w-72 bg-slate-800 border border-slate-600 rounded-md p-3 text-sm text-slate-200 z-[60] shadow-xl text-left font-normal">
                      <strong className="block text-yellow-500 mb-1">Carpenter's Cheat Sheet</strong>
                      <p>Access live mathematical formulas, stair geometry guides, and standard NBC limits to double-check rounding conventions and code allowances during active quizzes.</p>
                    </div>
                  )}
                  <button
                    onClick={() => setIsCheatSheetOpen(true)}
                    className="text-xs bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow"
                  >
                    <span>Cheat Sheet</span>
                    <span className="text-xs">📐</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* CRAM MODE CONTROLS */}
          {isCramMode && (
            <div className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 rounded-lg flex flex-col gap-2">
              <div className="flex flex-row justify-between items-center px-1">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 bg-amber-500 text-slate-950 rounded-md">
                    <Shuffle size={14} />
                  </div>
                  <div className="relative flex items-center gap-2">
                    <h4 className="font-extrabold text-[10px] sm:text-xs uppercase tracking-wider text-orange-600 dark:text-orange-500">Cram Mode Controls</h4>
                    <button onClick={() => setShowControlsInfo(!showControlsInfo)} className="text-slate-400 hover:text-slate-200 cursor-pointer">ⓘ</button>
                    {showControlsInfo && (
                      <div className="absolute top-full left-0 mt-2 w-72 bg-slate-800 border border-slate-600 rounded-md p-3 text-sm text-slate-200 z-50 shadow-xl">
                        <strong className="block text-indigo-400 mb-1">Cram Mode Overview</strong>
                        <p>Cram Mode is designed for rapid-fire repetition. Use the dropdown to isolate specific structural categories, or toggle 'Shuffled' to randomize the order. Incorrect answers will automatically reveal the code explanation to reinforce learning without penalty.</p>
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold">Question {currentIndex + 1} of {currentQuestions.length}</p>
              </div>

              <div className="flex flex-row flex-wrap gap-2 items-center">
                <div className="flex items-center space-x-1.5 flex-1 min-w-[140px]">
                  <span className="text-[10px] font-extrabold text-slate-600 dark:text-slate-400 hidden sm:inline">Category:</span>
                  <select
                    value={cramCategory}
                    onChange={(e) => setCramCategory(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 rounded-md px-2 py-1 text-[10px] sm:text-xs font-black focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="All">All Categories</option>
                    <option value="Block A">Block A: Occupational Skills</option>
                    <option value="Block B">Block B: Planning & Layout</option>
                    <option value="Block C">Block C: Concrete Formwork</option>
                    <option value="Block D">Block D: Framing Systems</option>
                    <option value="Block E">Block E: Exterior Finishes</option>
                    <option value="Block F">Block F: Interior Finishes</option>
                    <option value="Block G">Block G: Renovations</option>
                  </select>
                </div>
                <button
                  onClick={() => setIsShuffled(!isShuffled)}
                  className={`flex items-center gap-1 text-[10px] sm:text-xs font-black px-2.5 py-1 rounded-md border transition-all ${
                    isShuffled
                      ? 'bg-amber-500 border-amber-600 text-slate-950 shadow-sm'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'
                  }`}
                >
                  <Shuffle size={11} className={isShuffled ? 'animate-spin-slow' : ''} />
                  <span>{isShuffled ? 'Shuffled' : 'Shuffle Off'}</span>
                </button>
                
                <button 
                  onClick={() => {
                    setIsCramMode(false)
                    setQuizMode('menu')
                  }}
                  className="text-[10px] sm:text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold px-2.5 py-1 rounded-md"
                >
                  Exit
                </button>
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
            <QuestionDiagram diagram={currentQuestion.diagram} />

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 font-black px-2 py-0.5 rounded uppercase">{currentQuestion.block}</span>
                {currentQuestion.difficulty && (
                  <span className={`text-[10px] px-2 py-0.5 rounded font-black uppercase ${
                    currentQuestion.difficulty === 'Beginner' 
                      ? 'bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400'
                      : currentQuestion.difficulty === 'Intermediate'
                      ? 'bg-blue-100 dark:bg-blue-950/40 text-brand-600 dark:text-brand-400'
                      : 'bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400'
                  }`}>
                    {currentQuestion.difficulty === 'Beginner' ? 'Entry' : currentQuestion.difficulty === 'Intermediate' ? 'Journeyman' : 'Expert'}
                  </span>
                )}
                {currentQuestion.codeReference && <span className="text-xs text-brand-500 font-mono font-bold">{currentQuestion.codeReference}</span>}
              </div>
              <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white leading-snug">{currentQuestion.question}</h3>
            </div>

            {/* OPTIONS PANEL with 48px target */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, idx) => {
                let borderStyle = 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850'
                let badgeStyle = 'bg-slate-100 text-slate-500'

                if (isCramMode) {
                  if (idx === currentQuestion.correctOptionIndex) {
                    borderStyle = 'bg-emerald-100 dark:bg-emerald-900/40 border-emerald-500 text-emerald-900 dark:text-emerald-300'
                    badgeStyle = 'bg-emerald-500 text-white shadow-sm'
                  } else {
                    borderStyle = 'bg-gray-900 dark:bg-black text-gray-500 dark:text-gray-600 border-transparent opacity-50 pointer-events-none line-through'
                    badgeStyle = 'bg-gray-800 text-gray-600'
                  }
                } else {
                  if (selectedOption === idx) {
                    borderStyle = 'border-brand-500 bg-brand-50/20 dark:bg-brand-950/20'
                    badgeStyle = 'bg-brand-500 text-white'
                  }

                  if (isAnswered) {
                    if (idx === currentQuestion.correctOptionIndex) {
                      borderStyle = 'border-emerald-500 bg-emerald-500/10 text-emerald-900 dark:text-emerald-400'
                      badgeStyle = 'bg-emerald-500 text-white'
                    } else if (selectedOption === idx) {
                      borderStyle = 'border-red-500 bg-red-500/10 text-red-900 dark:text-red-400'
                      badgeStyle = 'bg-red-500 text-white'
                    }
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectPracticeOption(idx)}
                    disabled={isAnswered || isCramMode}
                    className={`w-full text-left p-4 rounded-xl border font-bold text-sm transition-all flex items-center space-x-3 min-h-[52px] ${borderStyle}`}
                  >
                    <span className={`text-xs px-2.5 py-1.5 rounded-lg font-black shrink-0 ${badgeStyle}`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="leading-snug">{option}</span>
                  </button>
                )
              })}
            </div>

            {/* ACTIONS FOOTER */}
            <div className={`flex items-center border-t border-slate-100 dark:border-slate-800 pt-5 ${isCramMode ? "justify-end" : "justify-between"}`}>
              {!isCramMode && (
                <button 
                onClick={() => toggleBookmark(currentQuestion.id)}
                className={`text-xs font-bold py-2 px-3 rounded-lg border transition-all flex items-center gap-1.5 min-h-[44px] ${
                  bookmarks.includes(currentQuestion.id)
                    ? 'bg-amber-50 border-amber-300 text-amber-500 dark:bg-amber-950/20'
                    : 'bg-white border-slate-200 text-slate-500 dark:bg-slate-900 dark:border-slate-800'
                }`}
              >
                <span>{bookmarks.includes(currentQuestion.id) ? 'Bookmarked' : 'Bookmark for later'}</span>
              </button>
              )}

              {!isAnswered ? (
                <button
                  onClick={handleConfirmPracticeAnswer}
                  disabled={selectedOption === null}
                  className={`py-2.5 px-6 font-black rounded-xl text-sm shadow transition-colors min-h-[48px] ${
                    selectedOption !== null 
                      ? 'bg-brand-500 hover:bg-brand-600 text-white' 
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-850'
                  }`}
                >
                  Verify Answer
                </button>
              ) : (
                <button
                  onClick={handleNextPracticeQuestion}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-black py-2.5 px-6 rounded-xl text-sm transition-colors flex items-center gap-1.5 min-h-[48px]"
                >
                  <span>{currentIndex + 1 < currentQuestions.length ? 'Next Question' : 'Finish Practice'}</span>
                  <ArrowRight size={16} />
                </button>
              )}
            </div>

            {/* INCORRECT/CORRECT FEEDBACK WITH CODE REFERENCES */}
            {isAnswered && (
              <div className={`p-4 rounded-xl space-y-2 border ${
                selectedOption === currentQuestion.correctOptionIndex 
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-950 dark:text-emerald-400' 
                  : 'bg-amber-500/10 border-amber-500/20 text-amber-950 dark:text-amber-400'
              }`}>
                <div className="flex items-center space-x-2">
                  {selectedOption === currentQuestion.correctOptionIndex 
                    ? <CheckCircle size={18} className="text-emerald-500 shrink-0" /> 
                    : <AlertTriangle size={18} className="text-amber-500 shrink-0" />
                  }
                  <h4 className="font-extrabold text-sm uppercase">
                    {isCramMode ? 'Cram Mode Auto-Reveal' : selectedOption === currentQuestion.correctOptionIndex ? 'Correct Construction!' : 'Incorrect Layout!'}
                  </h4>
                </div>
                <TwoPartExplanation question={currentQuestion} />
                {currentQuestion.codeReference && (
                  <div className="text-[10px] font-mono uppercase bg-black/5 p-1 rounded w-fit font-bold mt-1">
                    Code Reference: {currentQuestion.codeReference}
                  </div>
                )}
                {(() => {
                  const refText = (currentQuestion.codeReference || '').toLowerCase()
                  const matches = allNbcReferences.filter(item => {
                    const sec = item.section.toLowerCase()
                    const cleanSec = sec.replace(/[^0-9.]/g, '')
                    const cleanRef = refText.replace(/[^0-9.]/g, '')
                    return (
                      refText.includes(sec) || 
                      sec.includes(refText) ||
                      (cleanSec && cleanRef && (cleanRef.includes(cleanSec) || cleanSec.includes(cleanRef)))
                    )
                  })

                  if (matches.length === 0) return null

                  return (
                    <div className="mt-3 pt-3 border-t border-slate-200/20 dark:border-slate-800/20 space-y-2">
                      <p className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Book size={11} className="text-brand-500" />
                        <span>Instant NBC Cross-Reference ({matches.length} Match{matches.length > 1 ? 'es' : ''})</span>
                      </p>
                      
                      {matches.map((match, mIdx) => {
                        const matchKey = `${match.blockId}-${match.section}`
                        const isExpanded = expandedNbcRef === matchKey
                        
                        return (
                          <div key={matchKey} className="bg-white/40 dark:bg-slate-900/40 rounded-lg border border-slate-200/40 dark:border-slate-800/40 overflow-hidden text-xs">
                            <div 
                              onClick={() => setExpandedNbcRef(isExpanded ? null : matchKey)}
                              className="p-2 flex justify-between items-center cursor-pointer hover:bg-white/80 dark:hover:bg-slate-800/80 transition-colors select-none text-slate-800 dark:text-slate-200"
                            >
                              <div className="flex items-center gap-2">
                                <span className="bg-brand-500 text-white font-black px-1.5 py-0.5 rounded text-[9px]">
                                  {match.section}
                                </span>
                                <span className="font-extrabold">
                                  {match.title}
                                </span>
                              </div>
                              <span className="text-[10px] text-brand-500 font-extrabold flex items-center gap-0.5 shrink-0">
                                {isExpanded ? 'Hide' : 'Reveal NBC Text'}
                                {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                              </span>
                            </div>
                            
                            {isExpanded && (
                              <div className="p-3 bg-white/80 dark:bg-slate-900/80 border-t border-slate-200/20 dark:border-slate-800/20 space-y-1.5 text-slate-700 dark:text-slate-300">
                                <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Section Guidelines:</p>
                                <ul className="space-y-1.5 pl-3">
                                  {match.rules.map((rule, rIdx) => (
                                    <li key={rIdx} className="list-disc leading-relaxed text-[11px]">
                                      {rule}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )
                })()}
                
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3a. TIMED EXAM SIMULATOR REVIEW SCREEN */}
      {quizMode === 'exam' && showReviewScreen && !examFinished && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                📋 Official Red Seal Exam Review Board
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold mt-1">
                Before submitting your final exam paper for official grading, you must review your work. You can jump directly back to any question by clicking its cell.
              </p>
            </div>

            {/* Warn user if there are unanswered questions */}
            {(() => {
              const unansweredCount = currentQuestions.filter(q => q.userAnswerIndex === undefined || q.userAnswerIndex === null).length;
              if (unansweredCount > 0) {
                return (
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start space-x-3 text-amber-800 dark:text-amber-400">
                    <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-black uppercase tracking-wider">Unanswered Questions Remaining ({unansweredCount})</p>
                      <p className="text-[10px] font-bold opacity-90 mt-0.5">
                        You have unanswered questions. The Red Seal Exam does not penalize incorrect guesses. We strongly advise selecting an answer for every item before submitting.
                      </p>
                    </div>
                  </div>
                )
              }
              return (
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-start space-x-3 text-emerald-800 dark:text-emerald-400">
                  <CheckCircle size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-black uppercase tracking-wider">All Questions Answered</p>
                    <p className="text-[10px] font-bold opacity-90 mt-0.5">
                      Excellent! You have answered all {currentQuestions.length} questions. You are ready to submit your exam for grading.
                    </p>
                  </div>
                </div>
              )
            })()}

            {/* Quick stats summary cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-50 dark:bg-slate-850 p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                <span className="text-[10px] font-black uppercase text-slate-400 block">Total Items</span>
                <span className="text-xl font-black text-slate-800 dark:text-white mt-1 block">{currentQuestions.length}</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-850 p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                <span className="text-[10px] font-black uppercase text-amber-500 block">Flagged</span>
                <span className="text-xl font-black text-amber-500 mt-1 block">
                  {currentQuestions.filter(q => flaggedQuestions.includes(q.id)).length}
                </span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-850 p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                <span className="text-[10px] font-black uppercase text-emerald-500 block">Completed</span>
                <span className="text-xl font-black text-emerald-500 mt-1 block">
                  {currentQuestions.filter(q => q.userAnswerIndex !== undefined && q.userAnswerIndex !== null).length}
                </span>
              </div>
            </div>

            {/* Question Map / Grid (Highly detailed scrollable grid) */}
            <div className="space-y-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Question Navigation Sheet</span>
              <div className="grid grid-cols-4 sm:grid-cols-8 md:grid-cols-10 gap-2 max-h-[250px] overflow-y-auto p-2.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl">
                {currentQuestions.map((q, idx) => {
                  const isFlagged = flaggedQuestions.includes(q.id)
                  const isAnswered = q.userAnswerIndex !== undefined && q.userAnswerIndex !== null
                  return (
                    <button
                      key={q.id}
                      onClick={() => {
                        setShowReviewScreen(false)
                        setCurrentIndex(idx)
                      }}
                      className={`h-11 rounded-lg font-black text-xs transition-all flex flex-col items-center justify-center border ${
                        isFlagged 
                          ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border-amber-500/40 shadow-sm' 
                          : isAnswered 
                          ? 'bg-brand-500 hover:bg-brand-600 text-white border-brand-600 shadow-sm' 
                          : 'bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <span>Q-{idx + 1}</span>
                      <span className="text-[8px] font-extrabold opacity-80 uppercase leading-none">
                        {isFlagged ? 'FLAG' : isAnswered ? 'DONE' : 'EMPTY'}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className={`flex items-center border-t border-slate-100 dark:border-slate-800 pt-5 ${isCramMode ? "justify-end" : "justify-between"}`}>
              <button
                onClick={() => {
                  setShowReviewScreen(false)
                  // go back to last question
                  setCurrentIndex(currentQuestions.length - 1)
                }}
                className="text-xs font-bold py-2.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl min-h-[44px]"
              >
                Back to Questions
              </button>

              <button
                onClick={() => handleFinishExam()}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-black py-2.5 px-8 rounded-xl text-sm min-h-[48px] shadow-lg shadow-emerald-500/10 flex items-center gap-1.5"
              >
                <span>Submit Final Exam & Grade</span>
                <Check size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3b. TIMED EXAM SIMULATOR SCREEN */}
      {quizMode === 'exam' && currentQuestion && !examFinished && !showReviewScreen && (
        <div className="space-y-6">

          {isOfficialMock && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex items-center space-x-3 text-red-700 dark:text-red-400">
              <span className="text-xl animate-pulse">⚠️</span>
              <div className="text-left">
                <p className="text-xs font-black uppercase tracking-wider">Official RSOS 100-Question Mock Exam Active</p>
                <p className="text-[10px] font-bold opacity-90">This simulates the official 4-hour Canadian exam. Maintain focus and layout discipline.</p>
              </div>
            </div>
          )}
          
          {/* TIMED TOP BAR BAR */}
          <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 gap-3">
            <div className="space-y-1">
              <span className={`text-[10px] ${isOfficialMock ? 'bg-red-500' : 'bg-emerald-500'} text-white px-2 py-0.5 rounded uppercase font-black tracking-wider`}>
                {isOfficialMock ? 'Official RSOS Mock' : 'Exam Simulator'}
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">Question {currentIndex + 1} of {currentQuestions.length}</p>
            </div>

            {/* ACTION & TIMER BUTTONS */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsCheatSheetOpen(true)}
                className="text-xs bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-3 py-1.5 rounded-lg flex items-center gap-1.5 min-h-[40px] shadow"
              >
                <span>Cheat Sheet</span>
                <span className="text-xs">📐</span>
              </button>

              {/* PACING WARNING POPUP */}
              {questionTimeElapsed >= 180 && (
                <div className="bg-red-500 text-white text-[9px] font-black px-2.5 py-1.5 rounded-lg shadow flex items-center gap-1 animate-pulse shrink-0">
                  <AlertTriangle size={12} />
                  <span>Pacing Alert: Flag & Move On!</span>
                </div>
              )}

              {/* EXAM COUNTDOWN */}
              <div className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border font-mono font-bold text-sm ${
                timerCount <= 300 || questionTimeElapsed >= 180
                  ? 'bg-red-500/10 border-red-500/30 text-red-500 animate-pulse font-black' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
              }`}>
                <Clock size={16} />
                <span>
                  {timerCount >= 3600 ? `${Math.floor(timerCount / 3600)}h ` : ''}
                  {Math.floor((timerCount % 3600) / 60)}m {(timerCount % 60).toString().padStart(2, '0')}s
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
            <QuestionDiagram diagram={currentQuestion.diagram} />

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 font-black px-2 py-0.5 rounded uppercase">{currentQuestion.block}</span>
                {currentQuestion.difficulty && (
                  <span className={`text-[10px] px-2 py-0.5 rounded font-black uppercase ${
                    currentQuestion.difficulty === 'Beginner' 
                      ? 'bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400'
                      : currentQuestion.difficulty === 'Intermediate'
                      ? 'bg-blue-100 dark:bg-blue-950/40 text-brand-600 dark:text-brand-400'
                      : 'bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400'
                  }`}>
                    {currentQuestion.difficulty === 'Beginner' ? 'Entry' : currentQuestion.difficulty === 'Intermediate' ? 'Journeyman' : 'Expert'}
                  </span>
                )}
              </div>
              <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white leading-snug">{currentQuestion.question}</h3>
            </div>

            {/* OPTIONS PANEL WITH TIMED STATE */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = currentQuestions[currentIndex].userAnswerIndex === idx
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectExamOption(idx)}
                    className={`w-full text-left p-4 rounded-xl border font-bold text-sm transition-all flex items-center space-x-3 min-h-[52px] ${
                      isSelected 
                        ? 'border-brand-500 bg-brand-50/20 dark:bg-brand-950/20 shadow-sm ring-1 ring-brand-500/30' 
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850'
                    }`}
                  >
                    <span className={`text-xs px-2.5 py-1.5 rounded-lg font-black shrink-0 ${isSelected ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-500 dark:bg-slate-800'}`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="leading-snug">{option}</span>
                  </button>
                )
              })}
            </div>

            {/* FOOTER ACTIONS - PREV, NEXT, SUBMIT */}
            <div className={`flex items-center border-t border-slate-100 dark:border-slate-800 pt-5 ${isCramMode ? "justify-end" : "justify-between"}`}>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                  disabled={currentIndex === 0}
                  className="text-xs font-bold py-2 px-3 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-slate-800 rounded-lg min-h-[44px]"
                >
                  Previous
                </button>

                {/* FLAG FOR LATER BUTTON */}
                <button
                  onClick={() => {
                    const qId = currentQuestion.id
                    setFlaggedQuestions(prev => 
                      prev.includes(qId) 
                        ? prev.filter(id => id !== qId) 
                        : [...prev, qId]
                    )
                  }}
                  className={`text-xs font-bold py-2 px-3 border rounded-lg min-h-[44px] flex items-center gap-1.5 transition-all ${
                    flaggedQuestions.includes(currentQuestion.id)
                      ? 'bg-amber-500/10 border-amber-500 text-amber-500 font-black'
                      : 'bg-white border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800'
                  }`}
                >
                  <Flag size={14} className={flaggedQuestions.includes(currentQuestion.id) ? 'fill-current' : ''} />
                  <span>{flaggedQuestions.includes(currentQuestion.id) ? 'Flagged' : 'Flag for Later'}</span>
                </button>
              </div>

              <div className="flex items-center space-x-2">
                {currentIndex + 1 < currentQuestions.length ? (
                  <button
                    onClick={() => setCurrentIndex(prev => prev + 1)}
                    className="bg-brand-500 hover:bg-brand-600 text-white font-black py-2.5 px-5 rounded-xl text-sm min-h-[48px]"
                  >
                    Next Question
                  </button>
                ) : (
                  <button
                    onClick={() => setShowReviewScreen(true)}
                    className="bg-brand-500 hover:bg-brand-600 text-white font-black py-2.5 px-6 rounded-xl text-sm min-h-[48px] flex items-center gap-1.5"
                  >
                    <span>Review & Submit</span>
                    <ArrowRight size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* BOTTOM COLLAPSIBLE NAVIGATION GRID/SHEET */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
            <button
              onClick={() => setIsNavigationExpanded(!isNavigationExpanded)}
              className="w-full flex justify-between items-center px-5 py-3.5 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
            >
              <div className="flex items-center space-x-2 text-slate-700 dark:text-slate-300">
                <Grid size={16} className="text-brand-500" />
                <span className="text-xs font-black uppercase tracking-wider">Exam Navigation Board</span>
                <span className="text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 font-bold px-2 py-0.5 rounded-full">
                  {currentQuestions.filter(q => q.userAnswerIndex !== undefined && q.userAnswerIndex !== null).length} / {currentQuestions.length} Answered
                </span>
              </div>
              <div className="flex items-center gap-1">
                {isNavigationExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </button>

            {isNavigationExpanded && (
              <div className="p-4 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800">
                <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 max-h-[160px] overflow-y-auto">
                  {currentQuestions.map((q, idx) => {
                    const isFlagged = flaggedQuestions.includes(q.id)
                    const isAnswered = q.userAnswerIndex !== undefined && q.userAnswerIndex !== null
                    const isActive = currentIndex === idx
                    return (
                      <button
                        key={q.id}
                        onClick={() => {
                          setCurrentIndex(idx)
                        }}
                        className={`h-9 rounded-lg font-black text-[10px] transition-all flex flex-col items-center justify-center border ${
                          isActive
                            ? 'ring-2 ring-brand-500 border-brand-500 text-brand-600 bg-brand-500/10 font-black'
                            : isFlagged
                            ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border-amber-500/40 shadow-sm'
                            : isAnswered
                            ? 'bg-brand-500 hover:bg-brand-600 text-white border-brand-600 shadow-sm'
                            : 'bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        <span>{idx + 1}</span>
                        {isFlagged && <span className="text-[6px] font-black leading-none text-amber-500">FLAG</span>}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

        </div>
      )}

      {/* 4. TIMED EXAM RESULTS REVIEW PANEL */}
      {quizMode === 'exam' && examFinished && (
        <div className="space-y-6 relative overflow-hidden bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
          
          {/* Confetti Explosion canvas layer */}
          <ConfettiCanvas trigger={isPassed} />

          <div className="relative z-10 space-y-6 text-center max-w-xl mx-auto">
            <span className="text-5xl">{isPassed ? '🏆' : '🪵'}</span>
            
            <div className="space-y-1">
              <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase">
                {isPassed ? 'Exam Passed!' : 'Requires Review'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">
                Canadian Red Seal Journeyman standard pass mark is **70%**.
              </p>
            </div>

            {/* SCORE CIRCLE RING */}
            <div className="py-4">
              <div className={`inline-flex flex-col items-center justify-center w-36 h-36 rounded-full border-4 ${
                isPassed ? 'border-emerald-500 text-emerald-500' : 'border-amber-500 text-amber-500'
              }`}>
                <span className="text-3xl font-black">{Math.round((correctAnswersCount / currentQuestions.length) * 100)}%</span>
                <span className="text-xs text-slate-400 font-bold uppercase mt-1">
                  {correctAnswersCount} / {currentQuestions.length} Correct
                </span>
              </div>
            </div>

            {/* RED SEAL COMPLIANT FEEDBACK */}
            {isPassed ? (
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
                **Outstanding layout, Apprentice!** You have demonstrated solid comprehension of framing mathematics, concrete forms, and National Building Code guidelines. Keep practicing!
              </p>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
                  **Not quite there yet!** You scored less than the 70% threshold. The incorrect answers have been automatically stored in your **"Nail It" Review Deck**. Drill those items to reinforce safety and layout practices.
                </p>

                {getRecommendedBlocks().length > 0 && (
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 p-5 text-left space-y-4 max-w-lg mx-auto">
                    <div className="flex items-center space-x-2 border-b border-slate-150 dark:border-slate-750 pb-2">
                      <span className="text-lg">📚</span>
                      <div>
                        <h4 className="text-xs font-black uppercase text-slate-800 dark:text-slate-100">Recommended Study Modules</h4>
                        <p className="text-[10px] text-slate-400 font-bold">Focus on the blocks with incorrect answers to level up your score.</p>
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      {getRecommendedBlocks().map((rec) => (
                        <div 
                          key={rec.id} 
                          className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-sm hover:border-brand-500/55 transition-all"
                        >
                          <div className="space-y-0.5">
                            <div className="flex items-center space-x-2">
                              <span className="text-[9px] bg-red-500/15 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded font-black uppercase">
                                {rec.count} {rec.count === 1 ? 'Error' : 'Errors'}
                              </span>
                              <span className="text-xs font-black text-slate-900 dark:text-slate-100">{rec.id}</span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">{rec.title}</p>
                          </div>

                          <button
                            onClick={() => {
                              setFocusedStudyBlock(rec.id)
                              setActiveTab('study')
                            }}
                            className="bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/40 dark:hover:bg-brand-950/60 text-brand-600 dark:text-brand-400 text-[10px] font-black uppercase tracking-wider py-1.5 px-3 rounded-xl transition-all flex items-center justify-center gap-0.5 min-h-[36px]"
                          >
                            <span>Focus on this block</span>
                            <ChevronRight size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-center gap-3 pt-4">
              <button
                onClick={startExamSimulator}
                className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-white font-black py-2.5 px-5 rounded-xl text-xs transition-colors min-h-[44px]"
              >
                Retake Exam
              </button>
              <button
                onClick={() => setQuizMode('menu')}
                className="bg-brand-500 hover:bg-brand-600 text-white font-black py-2.5 px-5 rounded-xl text-xs shadow transition-colors min-h-[44px]"
              >
                Main Quiz Menu
              </button>
            </div>
          </div>

          {/* QUESTION REVIEW DRILL DOWN SECTION */}
          <div className="relative z-10 border-t border-slate-100 dark:border-slate-800 pt-6 mt-8 space-y-4 text-left">
            <h4 className="text-sm font-black uppercase text-slate-500">Verify Exam Answer Sheet</h4>
            <div className="space-y-4">
              {currentQuestions.map((q, idx) => {
                const wasCorrect = q.userAnswerIndex === q.correctOptionIndex
                return (
                  <div key={idx} className={`p-4 rounded-xl border ${
                    wasCorrect ? 'bg-emerald-500/5 border-emerald-500/15' : 'bg-red-500/5 border-red-500/15'
                  }`}>
                    <div className="flex justify-between text-xs font-bold text-slate-400">
                      <span>Question {idx + 1} • {q.block}</span>
                      <span className={wasCorrect ? 'text-emerald-500' : 'text-red-500'}>
                        {wasCorrect ? 'Correct' : 'Incorrect'}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1.5">{q.question}</p>
                    <TwoPartExplanation question={q} />
                    {q.codeReference && (
                      <span className="inline-block text-[10px] font-mono bg-black/5 dark:bg-white/5 p-1 rounded font-bold mt-1 text-slate-400">
                        NBC Reference: {q.codeReference}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

        </div>
      )}

      {/* 5. RANDOM BURST ACTIVE SPEED RUN */}
      {quizMode === 'burst' && currentQuestion && !examFinished && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* HIGH-SPEED HEADER BAR */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="space-y-1">
              <span className="text-[9px] bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full font-black uppercase tracking-wider flex items-center gap-1 w-fit animate-pulse">
                <Zap size={10} className="fill-current" /> Random Burst Mode
              </span>
              <p className="text-sm font-black text-slate-800 dark:text-slate-100">
                Speed Card <span className="text-amber-500 font-extrabold">{currentIndex + 1}</span> of {currentQuestions.length}
              </p>
            </div>

            {/* HIGH OCTANE TIMER PROGRESS & CHEAT SHEET */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1 max-w-md justify-end">
              <button
                onClick={() => setIsCheatSheetOpen(true)}
                className="text-xs bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-3 py-1.5 rounded-lg flex items-center gap-1.5 min-h-[40px] shadow self-start sm:self-auto"
              >
                <span>Cheat Sheet</span>
                <span className="text-xs">📐</span>
              </button>

              <div className="flex-1 max-w-xs space-y-1.5">
                <div className="flex justify-between text-xs font-black">
                  <span className="text-slate-400">SPEED CLOCK:</span>
                  <span className={timerCount <= 15 ? 'text-rose-500 animate-pulse font-black' : 'text-amber-500 font-black'}>
                    {timerCount}s left
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 rounded-full ${
                      timerCount <= 15 ? 'bg-rose-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${(timerCount / 60) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-6 relative overflow-hidden">
            <QuestionDiagram diagram={currentQuestion.diagram} />

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 font-black px-2 py-0.5 rounded uppercase">{currentQuestion.block}</span>
                {currentQuestion.difficulty && (
                  <span className={`text-[10px] px-2 py-0.5 rounded font-black uppercase ${
                    currentQuestion.difficulty === 'Beginner' 
                      ? 'bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400'
                      : currentQuestion.difficulty === 'Intermediate'
                      ? 'bg-blue-100 dark:bg-blue-950/40 text-brand-600 dark:text-brand-400'
                      : 'bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400'
                  }`}>
                    {currentQuestion.difficulty === 'Beginner' ? 'Entry' : currentQuestion.difficulty === 'Intermediate' ? 'Journeyman' : 'Expert'}
                  </span>
                )}
                {currentQuestion.codeReference && <span className="text-xs text-brand-500 font-mono font-bold">{currentQuestion.codeReference}</span>}
              </div>
              <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white leading-snug">{currentQuestion.question}</h3>
            </div>

            {/* OPTIONS PANEL - INSTANT RAPID SELECTION */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, idx) => {
                let borderStyle = 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850'
                let badgeStyle = 'bg-slate-100 text-slate-500'

                if (selectedOption === idx) {
                  borderStyle = 'border-amber-500 bg-amber-500/10'
                  badgeStyle = 'bg-amber-500 text-slate-950'
                }

                if (isAnswered) {
                  if (idx === currentQuestion.correctOptionIndex) {
                    borderStyle = 'border-emerald-500 bg-emerald-500/15 text-emerald-900 dark:text-emerald-400'
                    badgeStyle = 'bg-emerald-500 text-white'
                  } else if (selectedOption === idx) {
                    borderStyle = 'border-rose-500 bg-rose-500/15 text-rose-900 dark:text-rose-400'
                    badgeStyle = 'bg-rose-500 text-white'
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectBurstOption(idx)}
                    disabled={isAnswered}
                    className={`w-full text-left p-4 rounded-xl border font-bold text-sm transition-all flex items-center space-x-3 min-h-[52px] ${borderStyle}`}
                  >
                    <span className={`text-xs px-2.5 py-1.5 rounded-lg font-black shrink-0 ${badgeStyle}`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="leading-snug">{option}</span>
                  </button>
                )
              })}
            </div>

            {/* ACTION FOOTER */}
            <div className={`flex items-center border-t border-slate-100 dark:border-slate-800 pt-5 ${isCramMode ? "justify-end" : "justify-between"}`}>
              <button 
                onClick={() => {
                  if (timerRef.current) clearInterval(timerRef.current)
                  setQuizMode('menu')
                }}
                className="text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-500 dark:text-slate-400 font-bold px-4 py-2.5 rounded-xl min-h-[44px]"
              >
                Abort Run
              </button>

              {isAnswered && (
                <button
                  onClick={handleNextBurstQuestion}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-black py-2.5 px-6 rounded-xl text-sm transition-all flex items-center gap-1.5 min-h-[48px]"
                >
                  <span>{currentIndex + 1 < currentQuestions.length ? 'Next Speed Question' : 'Finish Speed Run'}</span>
                  <ArrowRight size={16} />
                </button>
              )}
            </div>

            {/* IMMEDIATE RAPID FEEDBACK BLOCK */}
            {isAnswered && (
              <div className={`p-4 rounded-xl space-y-2 border ${
                selectedOption === currentQuestion.correctOptionIndex 
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-950 dark:text-emerald-400' 
                  : 'bg-rose-500/10 border-rose-500/20 text-rose-950 dark:text-rose-400'
              }`}>
                <div className="flex items-center space-x-2">
                  {selectedOption === currentQuestion.correctOptionIndex 
                    ? <CheckCircle size={18} className="text-emerald-500 shrink-0" /> 
                    : <XCircle size={18} className="text-rose-500 shrink-0" />
                  }
                  <h4 className="font-extrabold text-sm uppercase">
                    {selectedOption === currentQuestion.correctOptionIndex ? 'Spot On!' : 'Incorrect Math!'}
                  </h4>
                </div>
                <TwoPartExplanation question={currentQuestion} />
                {currentQuestion.codeReference && (
                  <div className="text-[10px] font-mono uppercase bg-black/5 dark:bg-white/5 p-1 rounded w-fit font-bold mt-1">
                    Code Reference: {currentQuestion.codeReference}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 6. RANDOM BURST RESULTS REVIEW SCREEN */}
      {quizMode === 'burst' && examFinished && (
        <div className="space-y-6 relative overflow-hidden bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 animate-fadeIn">
          
          <ConfettiCanvas trigger={correctAnswersCount >= 4} />

          <div className="relative z-10 space-y-6 text-center max-w-xl mx-auto">
            <span className="text-5xl">{correctAnswersCount >= 4 ? '⚡' : '⏱️'}</span>
            
            <div className="space-y-1">
              <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                {correctAnswersCount >= 4 ? 'Godlike Speed!' : 'Burst Complete'}
              </h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                60-second high-speed knowledge check
              </p>
            </div>

            {/* SCORE CIRCLE */}
            <div className="py-4">
              <div className={`inline-flex flex-col items-center justify-center w-36 h-36 rounded-full border-4 ${
                correctAnswersCount >= 4 ? 'border-amber-500 text-amber-500' : 'border-slate-400 text-slate-400'
              }`}>
                <span className="text-4xl font-black">{Math.round((correctAnswersCount / currentQuestions.length) * 100)}%</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase mt-1">
                  {correctAnswersCount} / {currentQuestions.length} Correct
                </span>
              </div>
            </div>

            {/* PERFORMANCE ADVICE */}
            <div className="space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
                {correctAnswersCount === 5 && "🥇 Flawless run! Your rapid carpentry instincts are perfectly calibrated. You have mastered these code elements!"}
                {correctAnswersCount === 4 && "⭐ Excellent response rate! High-speed knowledge is stable. Minor revision will secure absolute mastery."}
                {correctAnswersCount === 3 && "🪵 Decent effort, but remember that safety is paramount. Keep drilling the items that took too long!"}
                {correctAnswersCount < 3 && "⚠️ Review required! High-speed decision making needs more focus. Incorrect answers have been pushed to your review deck."}
              </p>

              {correctAnswersCount < 4 && getRecommendedBlocks().length > 0 && (
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 p-5 text-left space-y-4 max-w-lg mx-auto">
                  <div className="flex items-center space-x-2 border-b border-slate-150 dark:border-slate-750 pb-2">
                    <span className="text-lg">📚</span>
                    <div>
                      <h4 className="text-xs font-black uppercase text-slate-800 dark:text-slate-100">Recommended Study Modules</h4>
                      <p className="text-[10px] text-slate-400 font-bold">Focus on the blocks with incorrect answers to level up your score.</p>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {getRecommendedBlocks().map((rec) => (
                      <div 
                        key={rec.id} 
                        className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-sm hover:border-brand-500/55 transition-all"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center space-x-2">
                            <span className="text-[9px] bg-red-500/15 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded font-black uppercase">
                              {rec.count} {rec.count === 1 ? 'Error' : 'Errors'}
                            </span>
                            <span className="text-xs font-black text-slate-900 dark:text-slate-100">{rec.id}</span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">{rec.title}</p>
                        </div>

                        <button
                          onClick={() => {
                            setFocusedStudyBlock(rec.id)
                            setActiveTab('study')
                          }}
                          className="bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/40 dark:hover:bg-brand-950/60 text-brand-600 dark:text-brand-400 text-[10px] font-black uppercase tracking-wider py-1.5 px-3 rounded-xl transition-all flex items-center justify-center gap-0.5 min-h-[36px]"
                        >
                          <span>Focus on this block</span>
                          <ChevronRight size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-center gap-3 pt-4">
              <button
                onClick={startRandomBurst}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-2.5 px-6 rounded-xl text-xs shadow transition-colors min-h-[44px]"
              >
                Launch Another Burst
              </button>
              <button
                onClick={() => setQuizMode('menu')}
                className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-850 dark:text-white font-black py-2.5 px-6 rounded-xl text-xs transition-colors min-h-[44px]"
              >
                Main Quiz Menu
              </button>
            </div>
          </div>

          {/* QUESTIONS SHEET DRILL DOWN */}
          <div className="relative z-10 border-t border-slate-100 dark:border-slate-800 pt-6 mt-8 space-y-4 text-left">
            <h4 className="text-xs font-black uppercase text-slate-400">Burst Run Answer Review</h4>
            <div className="space-y-4">
              {currentQuestions.map((q, idx) => {
                const wasCorrect = q.userAnswerIndex === q.correctOptionIndex
                return (
                  <div key={idx} className={`p-4 rounded-xl border ${
                    wasCorrect ? 'bg-emerald-500/5 border-emerald-500/15' : 'bg-rose-500/5 border-rose-500/15'
                  }`}>
                    <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                      <span>Card {idx + 1} • {q.block}</span>
                      <span className={wasCorrect ? 'text-emerald-500' : 'text-rose-500'}>
                        {wasCorrect ? 'Correct' : 'Incorrect / Unanswered'}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1.5">{q.question}</p>
                    <TwoPartExplanation question={q} />
                    {q.codeReference && (
                      <span className="inline-block text-[10px] font-mono bg-black/5 dark:bg-white/5 p-1 rounded font-bold mt-1 text-slate-400">
                        NBC Reference: {q.codeReference}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

        </div>
      )}

      {/* 7. NAIL IT DISCOVERY MODE (SPACED REPETITION STUDY) */}
      {quizMode === 'nailit' && currentQuestion && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="space-y-1">
              <span className="text-[10px] bg-amber-500 text-slate-950 px-2 py-0.5 rounded uppercase font-black tracking-wider flex items-center gap-1">
                <Flame size={10} className="fill-current" /> Nail It Deck
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400">Review Item {currentIndex + 1} of {currentQuestions.length}</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsCheatSheetOpen(true)}
                className="text-xs bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-3 py-1.5 rounded-lg flex items-center gap-1.5 min-h-[40px] shadow"
              >
                <span>Cheat Sheet</span>
                <span className="text-xs">📐</span>
              </button>
              <button 
                onClick={() => setQuizMode('menu')}
                className="text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 font-bold px-3 py-1.5 rounded-lg min-h-[40px]"
              >
                Exit Deck
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
            <QuestionDiagram diagram={currentQuestion.diagram} />

            <div className="space-y-2">
              <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white leading-snug">{currentQuestion.question}</h3>
            </div>

            {/* SELECT OPTIONS */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, idx) => {
                let borderStyle = 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850'
                let badgeStyle = 'bg-slate-100 text-slate-500'

                if (selectedOption === idx) {
                  borderStyle = 'border-amber-500 bg-amber-50/20'
                  badgeStyle = 'bg-amber-500 text-slate-950'
                }

                if (isAnswered) {
                  if (idx === currentQuestion.correctOptionIndex) {
                    borderStyle = 'border-emerald-500 bg-emerald-500/10 text-emerald-900 dark:text-emerald-400'
                    badgeStyle = 'bg-emerald-500 text-white'
                  } else if (selectedOption === idx) {
                    borderStyle = 'border-red-500 bg-red-500/10 text-red-900 dark:text-red-400'
                    badgeStyle = 'bg-red-500 text-white'
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectPracticeOption(idx)}
                    disabled={isAnswered}
                    className={`w-full text-left p-4 rounded-xl border font-bold text-sm transition-all flex items-center space-x-3 min-h-[52px] ${borderStyle}`}
                  >
                    <span className={`text-xs px-2.5 py-1.5 rounded-lg font-black shrink-0 ${badgeStyle}`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="leading-snug">{option}</span>
                  </button>
                )
              })}
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
              {!isAnswered ? (
                <button
                  onClick={() => {
                    if (selectedOption === null) return
                    const isCorrect = selectedOption === currentQuestion.correctOptionIndex
                    if (isCorrect) {
                      clearFromNailIt(currentQuestion.id) // got it right! remove from deck!
                      setUserXP(prev => prev + 10)
                    }
                    setIsAnswered(true)
                  }}
                  disabled={selectedOption === null}
                  className={`py-2.5 px-6 font-black rounded-xl text-sm shadow transition-colors min-h-[48px] ${
                    selectedOption !== null 
                      ? 'bg-amber-500 hover:bg-amber-600 text-slate-950' 
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-850'
                  }`}
                >
                  Confirm Study Answer
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (currentIndex + 1 < currentQuestions.length) {
                      setCurrentIndex(prev => prev + 1)
                      setSelectedOption(null)
                      setIsAnswered(false)
                    } else {
                      // End of Nail It Deck session
                      setQuizMode('menu')
                    }
                  }}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-black py-2.5 px-6 rounded-xl text-sm transition-colors flex items-center gap-1.5 min-h-[48px]"
                >
                  <span>{currentIndex + 1 < currentQuestions.length ? 'Next Review' : 'Exit Deck'}</span>
                  <ArrowRight size={16} />
                </button>
              )}
            </div>

            {/* RESULTS REPORT EXPLANATION */}
            {isAnswered && (
              <div className={`p-4 rounded-xl space-y-2 border ${
                selectedOption === currentQuestion.correctOptionIndex 
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-900 dark:text-emerald-400' 
                  : 'bg-amber-500/10 border-amber-500/20 text-amber-900 dark:text-amber-400'
              }`}>
                <h4 className="font-extrabold text-sm uppercase">
                  {selectedOption === currentQuestion.correctOptionIndex 
                    ? 'Spot On! Removed from Review Queue!' 
                    : 'Study this again!'
                  }
                </h4>
                <TwoPartExplanation question={currentQuestion} />
                {currentQuestion.codeReference && (
                  <span className="text-[10px] bg-black/5 p-1 rounded font-mono font-bold mt-1 inline-block">
                    Reference: {currentQuestion.codeReference}
                  </span>
                )}
              </div>
            )}

          </div>
        </div>
      )}

      {/* 6. 3D FLIP FLASHCARDS memorization tool */}
      {quizMode === 'flashcards' && flashcardDeck.length === 0 && (
        <div className="space-y-6 max-w-md mx-auto py-10">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 text-center shadow-lg space-y-6">
            <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto text-3xl">
              🏆
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">You are all caught up for today!</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                You have completed all your scheduled spaced repetition reviews. Keep up the high-performing streak!
              </p>
            </div>
            <div className="flex flex-col gap-3 pt-2">
              <button
                onClick={() => {
                  const unseen = questionsData.filter(q => !flashcardReviews || !flashcardReviews[q.id])
                  setFlashcardDeck(unseen)
                  setFlashcardStudyAheadMode(true)
                  setFlashcardIndex(0)
                  setIsFlipped(false)
                }}
                className="w-full bg-brand-500 hover:bg-brand-600 text-white font-black py-3 px-6 rounded-xl text-xs shadow transition-all min-h-[44px] uppercase"
              >
                Study Ahead (Un-seen Cards)
              </button>
              <button
                onClick={() => setQuizMode('menu')}
                className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold py-3 px-6 rounded-xl text-xs transition-all min-h-[44px]"
              >
                Back to Quiz Menu
              </button>
            </div>
          </div>
        </div>
      )}

      {quizMode === 'flashcards' && flashcardDeck.length > 0 && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="space-y-0.5">
              <span className="text-xs font-black text-slate-400 uppercase">
                {flashcardStudyAheadMode ? 'Study Ahead Deck' : 'Spaced Repetition Deck'}
              </span>
              <p className="text-xs text-slate-500">
                {flashcardStudyAheadMode 
                  ? 'Reviewing un-seen cards to build solid retention foundations.' 
                  : `You have ${flashcardDeck.length} cards scheduled for today.`}
              </p>
            </div>
            <button
              onClick={() => setQuizMode('menu')}
              className="text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 font-bold px-3 py-1.5 rounded-lg min-h-[40px]"
            >
              Exit Cards
            </button>
          </div>

          {/* THE 3D FLASH CARD PERSPECTIVE WRAPPER */}
          <div className="flex justify-center py-6">
            <div 
              onClick={() => {
                const nextFlipped = !isFlipped;
                setIsFlipped(nextFlipped);
                if (nextFlipped) {
                  setUserXP(prev => prev + 5);
                }
              }}
              className="w-full max-w-md cursor-pointer perspective"
              style={{ height: '320px' }}
            >
              <div className={`w-full h-full duration-500 transform-style-3d relative rounded-3xl border shadow-lg transition-transform ${
                isFlipped ? 'rotate-y-180 bg-brand-600 text-white border-brand-700' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white'
              }`}>
                
                {/* CARD FRONT: THE QUESTION/CONCEPT */}
                <div className="absolute inset-0 w-full h-full backface-hidden p-6 flex flex-col justify-between overflow-y-auto">
                  <span className="text-[10px] uppercase font-black tracking-widest text-brand-500">Question Concept Card</span>
                  <div className="space-y-3 text-center my-auto">
                    <span className="text-3xl">📝</span>
                    {flashcardDeck[flashcardIndex]?.diagram && (
                      <div className="mt-2 mb-2 border border-slate-150 dark:border-slate-800 rounded-xl overflow-hidden max-h-[140px] pointer-events-none">
                        <QuestionDiagram diagram={flashcardDeck[flashcardIndex].diagram} />
                      </div>
                    )}
                    <h3 className="text-base md:text-lg font-black leading-snug">
                      {flashcardDeck[flashcardIndex]?.question}
                    </h3>
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold text-center uppercase pt-4">Tap Card to Flip & Reveal Code</p>
                </div>

                {/* CARD BACK: THE ANSWER & CODE */}
                <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 p-6 flex flex-col justify-between text-white overflow-y-auto bg-brand-600 rounded-3xl">
                  <span className="text-[10px] uppercase font-black tracking-widest text-brand-200">Official Code Regulation</span>
                  <div className="space-y-3 text-center my-auto">
                    <span className="text-3xl">⚖️</span>
                    <div className="text-left space-y-2 max-h-[180px] overflow-y-auto pr-1">
                      <p className="text-xs font-semibold leading-relaxed opacity-90 border-b border-white/10 pb-1.5">
                        <span className="font-extrabold uppercase text-[9px] block text-brand-200">Official Code:</span>
                        {flashcardDeck[flashcardIndex]?.explanationOfficial || flashcardDeck[flashcardIndex]?.explanation}
                      </p>
                      <p className="text-xs font-bold leading-relaxed text-amber-200">
                        <span className="font-extrabold uppercase text-[9px] block text-amber-300">Jobsite Translation:</span>
                        {flashcardDeck[flashcardIndex]?.jobsiteTranslation || "On the jobsite, follow standard procedures to maintain code compliance and build safely."}
                      </p>
                    </div>
                    {flashcardDeck[flashcardIndex]?.codeReference && (
                      <div className="inline-block bg-white/20 text-white font-mono text-xs px-2.5 py-1 rounded-full font-bold">
                        {flashcardDeck[flashcardIndex]?.codeReference}
                      </div>
                    )}
                  </div>
                  <p className="text-[10px] text-brand-200 font-bold text-center uppercase pt-4">Tap to return to question</p>
                </div>

              </div>
            </div>
          </div>

          {/* DECK NAVIGATION / SRS GRADING */}
          <div className="space-y-4">
            {isFlipped ? (
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-400 text-center uppercase">How well did you know this?</p>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => handleGradeCard(flashcardDeck[flashcardIndex].id, 'hard')}
                    className="flex-1 max-w-[120px] bg-red-600 hover:bg-red-700 text-white font-black py-3 px-2 rounded-xl text-xs transition-colors shadow min-h-[48px] uppercase flex flex-col justify-center items-center"
                  >
                    <span className="text-sm">🔴 Hard</span>
                    <span className="text-[8px] font-bold opacity-85 mt-0.5">Review today</span>
                  </button>
                  <button
                    onClick={() => handleGradeCard(flashcardDeck[flashcardIndex].id, 'good')}
                    className="flex-1 max-w-[120px] bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-3 px-2 rounded-xl text-xs transition-colors shadow min-h-[48px] uppercase flex flex-col justify-center items-center"
                  >
                    <span className="text-sm">🟡 Good</span>
                    <span className="text-[8px] font-bold opacity-85 mt-0.5">Tomorrow</span>
                  </button>
                  <button
                    onClick={() => handleGradeCard(flashcardDeck[flashcardIndex].id, 'easy')}
                    className="flex-1 max-w-[120px] bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 px-2 rounded-xl text-xs transition-colors shadow min-h-[48px] uppercase flex flex-col justify-center items-center"
                  >
                    <span className="text-sm">🟢 Easy</span>
                    <span className="text-[8px] font-bold opacity-85 mt-0.5">In 3 days</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-center items-center space-x-4">
                <button
                  onClick={() => {
                    setIsFlipped(false)
                    setFlashcardIndex(prev => (prev === 0 ? flashcardDeck.length - 1 : prev - 1))
                  }}
                  className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850 min-h-[48px] min-w-[48px] flex items-center justify-center font-bold text-xs"
                >
                  Prev
                </button>
                <span className="text-xs font-bold text-slate-400">Card {flashcardIndex + 1} of {flashcardDeck.length}</span>
                <button
                  onClick={() => {
                    setIsFlipped(false)
                    setFlashcardIndex(prev => (prev === flashcardDeck.length - 1 ? 0 : prev + 1))
                  }}
                  className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850 min-h-[48px] min-w-[48px] flex items-center justify-center font-bold text-xs"
                >
                  Next
                </button>
              </div>
            )}
          </div>

        </div>
      )}

      <CarpentersCheatSheetModal isOpen={isCheatSheetOpen} onClose={() => setIsCheatSheetOpen(false)} />

      {isNbcSearchOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800 shadow-2xl relative">
            <button
              onClick={() => setIsNbcSearchOpen(false)}
              className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 rounded-full text-slate-500 hover:text-slate-800 dark:hover:text-slate-100 z-10 transition-colors"
            >
              <XCircle size={22} />
            </button>
            <div className="p-1">
              <NBCClausesIndex 
                onLaunchQuizWithQuestions={(questions) => {
                  setCurrentQuestions(questions)
                  setCurrentIndex(0)
                  if (questions.length > 0) {
                    setSelectedOption(isCramMode ? questions[0].correctOptionIndex : null)
                    setIsAnswered(isCramMode)
                  } else {
                    setSelectedOption(null)
                    setIsAnswered(false)
                  }
                  setCorrectAnswersCount(0)
                  setIncorrectTracker([])
                  setQuizMode('practice')
                  setIsNbcSearchOpen(false)
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* FLOATING EXAM TIP NOTIFICATION */}
      <AnimatePresence mode="wait">
        {['practice', 'challenge', 'blueprint_reading', 'cram'].includes(quizMode) && currentQuestion && examTip && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
          <AnimatePresence mode="wait">
            {!isTipExpanded ? (
              <motion.div
                key="minimized-tip"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                onClick={() => setIsTipExpanded(true)}
                className="bg-indigo-600 dark:bg-indigo-700 text-white px-4 py-2.5 rounded-full shadow-lg cursor-pointer hover:bg-indigo-500 dark:hover:bg-indigo-600 transition-all flex items-center gap-2 border border-indigo-400/30"
              >
                <span className="animate-pulse text-sm">💡</span>
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider">View Red Seal Exam Tip</span>
              </motion.div>
            ) : (
              <motion.div
                key="expanded-tip"
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 30, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                className="max-w-sm w-[90vw] sm:w-[380px] bg-gradient-to-r from-indigo-50/95 via-purple-50/95 to-pink-50/95 dark:from-indigo-950/95 dark:via-purple-950/95 dark:to-pink-950/95 backdrop-blur-md border-2 border-indigo-500/50 dark:border-indigo-400/40 p-4 rounded-2xl shadow-[0_10px_30px_rgba(99,102,241,0.3)] flex flex-col space-y-3 select-none hover:shadow-[0_10px_40px_rgba(99,102,241,0.45)] group"
              >
                {/* Header with Title and Close button */}
                <div 
                  className="flex items-center justify-between border-b border-indigo-500/20 pb-2 cursor-pointer"
                  onClick={() => setIsTipExpanded(false)}
                >
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-indigo-500 text-white rounded-lg animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.4)] text-xs flex items-center justify-center leading-none">
                      💡
                    </span>
                    <div className="text-left">
                      <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block leading-none">
                        RED SEAL EXAM TIP
                      </span>
                      <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider block mt-0.5 leading-none">
                        {currentQuestion.block || 'General Carpentry'}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsTipExpanded(false)
                    }}
                    className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-200/50 hover:bg-slate-200 dark:bg-slate-800/50 dark:hover:bg-slate-800 p-1.5 rounded-lg transition-colors cursor-pointer min-h-[28px] min-w-[28px] flex items-center justify-center"
                    title="Dismiss Tip"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Content of the Tip */}
                <div className="text-left">
                  <p className="text-xs md:text-sm text-slate-800 dark:text-slate-200 font-bold leading-relaxed font-mono">
                    {examTip}
                  </p>
                </div>

                {/* Footer indicator */}
                <div className="flex items-center justify-between text-[10px] font-black tracking-wider text-indigo-600 dark:text-indigo-400 uppercase">
                  <span>🎯 70% PASS STANDARD</span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      // Cycle a new tip for fun
                      const blockName = currentQuestion.block || 'General'
                      const tipsList = EXAM_TIPS[blockName] || [
                        "Always double-check your load-bearing points.",
                        "Read the entire question before looking at the answers.",
                        "If you are stuck, eliminate the obviously wrong answers first.",
                        "Watch out for absolute words like 'always' or 'never'."
                      ]
                      setExamTip(tipsList[Math.floor(Math.random() * tipsList.length)])
                    }}
                    className="flex items-center gap-1 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
                  >
                    <RefreshCw size={10} />
                    Roll Another Tip
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
      </AnimatePresence>

      {toastMessage && (
        <div className="fixed bottom-5 right-5 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 px-4 py-3 rounded-xl shadow-lg border border-slate-700 dark:border-slate-300 flex items-center gap-2 animate-bounce z-50">
          <span className="text-emerald-500 font-black">✓</span>
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}
    </div>
  )
}
