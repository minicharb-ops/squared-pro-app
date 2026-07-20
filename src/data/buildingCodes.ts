export type JurisdictionId = 'can_obc' | 'can_nbcc' | 'usa_irc';

export type CodeCategory = 
  | 'stairs' 
  | 'decks' 
  | 'framing' 
  | 'foundations'
  | 'concrete'
  | 'exterior'
  | 'interior_finishes'
  | 'masonry'
  | 'envelope'
  | 'windows_doors'
  | 'garages'
  | 'electrical'
  | 'plumbing'
  | 'hvac'
  | 'energy'
  | 'fire_safety'
  | 'site_work'
  | 'accessibility'
  | 'pools'
  | 'marine'
  | 'framing_tolerances'
  | 'finishes';

export interface CodeRule {
  id: string;
  category: CodeCategory;
  title: string;
  codeRef: string; // e.g., "OBC 9.8.4.1" or "IRC R311.7.5.1"
  summary: string;
  metricVal: string;
  imperialVal: string;
  jobsiteNote: string;
}

export const JURISDICTIONS: Record<JurisdictionId, { label: string; defaultUnit: 'imp' | 'met' }> = {
  can_obc: { label: 'Canada - Ontario (OBC)', defaultUnit: 'imp' },
  can_nbcc: { label: 'Canada - National (NBCC)', defaultUnit: 'imp' },
  usa_irc: { label: 'USA - International Res. Code (IRC)', defaultUnit: 'imp' },
};

export const CODE_DATABASE: Record<JurisdictionId, CodeRule[]> = {
  can_obc: [
    {
      id: 'obc_stair_rise',
      category: 'stairs',
      title: 'Maximum & Minimum Riser Height',
      codeRef: 'OBC 9.8.4.1.(1)',
      summary: 'Allowable vertical step rise between consecutive treads in private residential interior or exterior flights.',
      metricVal: '200 mm Max (125 mm Min)',
      imperialVal: '7-7/8" Max (5" Min)',
      jobsiteNote: 'Dimensional uniformity is strict: the difference between the tallest and shortest riser in a flight cannot exceed 5 mm (3/16") between adjacent steps, or 10 mm (3/8") over the entire flight.'
    },
    {
      id: 'obc_stair_run',
      category: 'stairs',
      title: 'Minimum & Maximum Tread Run',
      codeRef: 'OBC 9.8.4.1.(1)',
      summary: 'Horizontal run distance measured from front edge of tread nosing to front edge of adjacent tread nosing above.',
      metricVal: '210 mm Min (355 mm Max)',
      imperialVal: '8-1/4" Min (14" Max)',
      jobsiteNote: 'Run does not include the nosing projection. If the stair has open risers or tread run is less than 248 mm (9-3/4"), a minimum 25 mm (1") nosing is required.'
    },
    {
      id: 'obc_stair_depth',
      category: 'stairs',
      title: 'Minimum Overall Tread Depth',
      codeRef: 'OBC 9.8.4.1.(1)',
      summary: 'Total physical front-to-back depth of the stair tread board, including any nosing overhang.',
      metricVal: '235 mm Min (355 mm Max)',
      imperialVal: '9-1/4" Min (14" Max)',
      jobsiteNote: 'Adjacent tread depths must not vary by more than 5 mm (3/16"). Ensure your material cuts account for stringer plumb-cut angles.'
    },
    {
      id: 'obc_stair_headroom',
      category: 'stairs',
      title: 'Minimum Clear Headroom',
      codeRef: 'OBC 9.8.2.1.(1)',
      summary: 'Required vertical overhead clearance measured perpendicularly above a line drawn along the tread nosings.',
      metricVal: '1950 mm Min',
      imperialVal: '6\'5" Min (76-3/4")',
      jobsiteNote: 'Watch out for bulkhead framing and floor joists above the stairwell opening during rough framing.'
    },
    {
      id: 'obc_stair_width',
      category: 'stairs',
      title: 'Minimum Stairway Clear Width',
      codeRef: 'OBC 9.8.2.1.(1)',
      summary: 'Minimum horizontal clearance between interior finished wall faces serving a single dwelling unit.',
      metricVal: '860 mm Min (800 mm clear between handrails)',
      imperialVal: '34" Min (31-1/2" clear between handrails)',
      jobsiteNote: 'Frame stairwell openings wide enough to account for 1/2" drywall on both sides plus stringer thickness.'
    },
    {
      id: 'obc_stair_handrail_height',
      category: 'stairs',
      title: 'Handrail Height Range',
      codeRef: 'OBC 9.8.7.4.(1)',
      summary: 'Required vertical height for stair handrails serving single residential dwelling flights.',
      metricVal: '865 mm Min to 965 mm Max',
      imperialVal: '34" Min to 38" Max',
      jobsiteNote: 'Measured vertically from a line drawn tangentially across the tread nosings up to the top of the handrail grip.'
    },
		{
      id: 'obc_guard_trigger',
      category: 'decks',
      title: 'Elevation Requiring Guardrails',
      codeRef: 'OBC 9.8.8.1.(1)',
      summary: 'Vertical elevation drop difference above adjacent grade or walking surface that triggers the legal requirement for a protective guardrail.',
      metricVal: '600 mm Drop',
      imperialVal: '24" Drop (2 ft)',
      jobsiteNote: 'If the deck or porch is 24" or less above the ground, a guardrail is legally optional. However, if you install one voluntarily, it must still comply with spacing and loading rules.'
    },
    {
      id: 'obc_guard_height_low',
      category: 'decks',
      title: 'Guardrail Height (Drop ≤ 1.8m)',
      codeRef: 'OBC 9.8.8.2.(1)',
      summary: 'Required vertical height for guardrails protecting walking surfaces elevated 1800 mm (5\'11") or less above adjacent grade.',
      metricVal: '900 mm Min',
      imperialVal: '35-1/2" Min',
      jobsiteNote: 'Measured vertically from the top of the finished deck surface (deck boards) to the top surface of the top railing arm.'
    },
    {
      id: 'obc_guard_height_high',
      category: 'decks',
      title: 'Guardrail Height (Drop > 1.8m)',
      codeRef: 'OBC 9.8.8.2.(1)',
      summary: 'Required vertical height for guardrails protecting walking surfaces elevated more than 1800 mm (5\'11") above adjacent grade.',
      metricVal: '1070 mm Min',
      imperialVal: '42" Min',
      jobsiteNote: 'Second-story decks and raised balconies almost always trigger this 42" minimum height. Never build standard 36" guards on raised walkouts.'
    },
    {
      id: 'obc_guard_spacing',
      category: 'decks',
      title: 'Baluster & Infill Opening Spacing',
      codeRef: 'OBC 9.8.8.5.(1)',
      summary: 'Maximum allowable spacing between vertical spindles, glass panels, or decorative infill members.',
      metricVal: '100 mm Sphere Rule',
      imperialVal: '4" Sphere Rule',
      jobsiteNote: 'Openings must not permit the passage of a spherical object 100 mm (4") in diameter. Space vertical 2x2 pickets roughly 3-1/2" apart to guarantee compliance.'
    },
    {
      id: 'obc_guard_climbing',
      category: 'decks',
      title: 'Non-Climbable Restrictions',
      codeRef: 'OBC 9.8.8.6.(1)',
      summary: 'Prohibition of horizontal elements or attachments that facilitate climbing on elevated guardrails.',
      metricVal: 'Applies if Drop > 4.2 m',
      imperialVal: 'Applies if Drop > 13\'9"',
      jobsiteNote: 'For fall drops exceeding 4.2m (13\'9"), guard rails cannot feature horizontal members, cables, or ornamental patterns between 140mm and 900mm above the deck that create toe-holds.'
    },
    {
      id: 'obc_guard_loads',
      category: 'decks',
      title: 'Structural Point Load Resistance',
      codeRef: 'OBC Table 9.8.8.2',
      summary: 'Minimum structural force design capacity required for top rails and support posts serving single dwelling units.',
      metricVal: '0.5 kN Concentrated Load',
      imperialVal: '112 lbs Concentrated Load',
      jobsiteNote: 'Posts notched halfway through at the rim joist often fail under load testing. Secure 4x4 posts using through-bolts and specialized tension tie hardware bolted back to interior floor joists.'
    },
		{
      id: 'obc_deck_live_load',
      category: 'decks',
      title: 'Design Live Load Capacity',
      codeRef: 'OBC Table 4.1.5.3 / 9.4.2.3',
      summary: 'Minimum uniform structural design live load required for exterior balconies and residential decks.',
      metricVal: '1.9 kPa Live Load',
      imperialVal: '40 PSF Live Load',
      jobsiteNote: 'Heavier installations like hot tubs, masonry planters, or large pergolas exceed standard 40 PSF framing tables and require dedicated point-load engineering.'
    },
    {
      id: 'obc_deck_joist_cantilever',
      category: 'decks',
      title: 'Maximum Joist Cantilever (Overhang)',
      codeRef: 'OBC 9.23.9.9.(1)',
      summary: 'Allowable horizontal projection of floor joists extending past the outer edge of the supporting drop beam.',
      metricVal: '400 mm Max (or 4x Joist Depth)',
      imperialVal: '16" Max (or 4x Joist Depth)',
      jobsiteNote: 'Cantilevers carrying load-bearing guardrails must have a minimum interior backspan ratio of at least 2:1 (ideally 3:1) relative to the overhang distance.'
    },
    {
      id: 'obc_deck_bearing',
      category: 'decks',
      title: 'Minimum End Bearing Length',
      codeRef: 'OBC 9.23.9.1.(2)',
      summary: 'Required physical contact support length for joists, beams, and headers resting on wood, concrete, or masonry supports.',
      metricVal: '38 mm Min on Wood / 76 mm on Masonry',
      imperialVal: '1-1/2" Min on Wood / 3" on Masonry',
      jobsiteNote: 'When splicing drop beams over a support post, ensure each beam end gets at least 1.5 inches of solid bearing on the post notch or column cap bracket.'
    },
    {
      id: 'obc_deck_ledger_flashing',
      category: 'decks',
      title: 'Ledger Board Weather Flashing',
      codeRef: 'OBC 9.27.3.8.(1)',
      summary: 'Mandatory corrosion-resistant sheet metal or membrane flashing over structural ledger boards attached to exterior building envelopes.',
      metricVal: 'Z-Flashing w/ 6 mm Drip Lip',
      imperialVal: 'Z-Flashing w/ 1/4" Drip Lip',
      jobsiteNote: 'Flashing must tuck underneath the house weather-resistive barrier (e.g., Tyvek) and lap over the top of the ledger board to prevent rot and structural failure.'
    },
    {
      id: 'obc_deck_post_connection',
      category: 'decks',
      title: 'Positive Post-to-Beam Connection',
      codeRef: 'OBC 9.23.6.1.(1)',
      summary: 'Requirement for mechanical fastening between support columns and drop beams to resist lateral displacement and wind uplift.',
      metricVal: 'Approved Structural Hardware / Notch',
      imperialVal: 'Approved Structural Hardware / Notch',
      jobsiteNote: 'Never rely on toenailing or structural screws alone into end-grain. Situate beams directly on top of notched 6x6 posts secured with through-bolts or rated steel post caps.'
    },
		{
      id: 'obc_deck_ledger_fastening',
      category: 'decks',
      title: 'Ledger Board Fastener Spacing & Sizing',
      codeRef: 'OBC 9.23.16.2 / SB-7',
      summary: 'Prescriptive lag screw or through-bolt requirements for securing exterior deck ledgers to wooden band joists.',
      metricVal: '12.7 mm Bolts @ 400 mm OC Max',
      imperialVal: '1/2" Bolts @ 16" OC Max (Staggered)',
      jobsiteNote: 'Fasteners must penetrate solid interior rim joists. If attaching to engineered I-joist rim boards, exterior backer blocking is legally required inside the house.'
    },
    {
      id: 'obc_deck_ledger_prohibition',
      category: 'decks',
      title: 'Prohibited Ledger Attachment Surfaces',
      codeRef: 'OBC 9.20.17.1',
      summary: 'Surfaces where structural deck ledgers are strictly forbidden from bearing or fastening.',
      metricVal: 'No Brick Veneer / Stucco / EIFS',
      imperialVal: 'No Brick Veneer / Stucco / EIFS',
      jobsiteNote: 'Brick veneer is non-structural cladding. To attach a deck against brick, you must either use an independent freestanding framing layout on piers or install steel structural ledger brackets anchored directly to the foundation.'
    },
    {
      id: 'obc_deck_post_clearance',
      category: 'decks',
      title: 'Wood Column Elevation Above Grade',
      codeRef: 'OBC 9.23.2.3.(2)',
      summary: 'Minimum clearance height separating structural wood posts from finished ground level or concrete piers.',
      metricVal: '150 mm Above Grade (or 50 mm on Pier)',
      imperialVal: '6" Above Grade (or 2" on Pier w/ Stand-off)',
      jobsiteNote: 'Even pressure-treated 6x6 posts will absorb moisture and rot if placed in direct contact with pooling water on concrete footings. Always use elevated steel post bases (e.g., ABA66Z).'
    },
		{
      id: 'obc_stair_stringer_throat',
      category: 'stairs',
      title: 'Notched Stringer Effective Depth (Throat)',
      codeRef: 'OBC 9.8.9.4.(1)',
      summary: 'Minimum remaining uncut lumber depth (the "effective depth") measured perpendicularly across the narrowest section of a cut stair stringer.',
      metricVal: '90 mm Minimum Effective Depth',
      imperialVal: '3-1/2" Minimum Effective Depth',
      jobsiteNote: 'Over-sawing the inside corners of tread/riser cuts with a circular saw weakens the stringer throat. Finish inner corner cuts cleanly with a sharp handsaw or jigsaw.'
    },
    {
      id: 'obc_stair_stringer_spacing',
      category: 'stairs',
      title: 'Maximum Stringer Spacing',
      codeRef: 'OBC 9.8.9.3.(1)',
      summary: 'Maximum allowable center-to-center horizontal distance between structural stair stringers.',
      metricVal: '900 mm Max (400 mm for 19mm Treads)',
      imperialVal: '36" Max (16" OC for 5/4 Decking Treads)',
      jobsiteNote: 'If using standard 5/4x6 pressure-treated or composite decking boards as stair treads, you must space stringers no more than 12" to 16" on center to prevent tread sagging.'
    },
    {
      id: 'obc_stair_landing_size',
      category: 'stairs',
      title: 'Stair Landing Dimensions',
      codeRef: 'OBC 9.8.6.3.(1)',
      summary: 'Required length and width of level platforms at the top and bottom of exterior stair flights or at directional turns.',
      metricVal: 'Length & Width ≥ Stair Clear Width',
      imperialVal: 'Length & Width ≥ Stair Clear Width',
      jobsiteNote: 'If your stairway is 36" wide, the bottom landing pad on the ground or deck platform must be at least 36" wide by 36" deep before any door swing obstruction.'
    },
		{
      id: 'obc_guard_post_blocking',
      category: 'decks',
      title: 'Guardrail Post Blocking & Anchorage',
      codeRef: 'OBC SB-7 Detail 2',
      summary: 'Structural framing reinforcement required inside the deck floor rim perimeter where 4x4 or 6x6 guardrail posts are bolted.',
      metricVal: 'Doubled Rim Joists + Solid Blocking',
      imperialVal: 'Doubled Rim Joists + Solid Blocking',
      jobsiteNote: 'Bolting a guardrail post to a single 2x10 rim joist will fail inspection. You must install doubled rim joists or structural tie-back tension hold-downs anchored 2 to 3 feet back into adjacent floor joists.'
    },
    {
      id: 'obc_handrail_clearance',
      category: 'stairs',
      title: 'Handrail Grip-to-Wall Clearance',
      codeRef: 'OBC 9.8.7.5.(1)',
      summary: 'Minimum horizontal space required between the inner edge of a handrail grip and the finished wall face.',
      metricVal: '50 mm Min (60 mm if Rough Wall)',
      imperialVal: '2" Min (2-3/8" if Rough Wall)',
      jobsiteNote: 'Ensure handrail brackets project far enough from exterior brick, stone, or rough cedar siding so users can slide their hand along the rail without scraping their knuckles.'
    },
		{
      id: 'obc_deck_joist_bridging',
      category: 'decks',
      title: 'Joist Lateral Restraint (Bridging & Blocking)',
      codeRef: 'OBC 9.23.9.4.(1)',
      summary: 'Mandatory intermediate strapping, solid blocking, or cross-bridging to prevent floor joists from twisting under load.',
      metricVal: 'Required if Joist Span > 2100 mm',
      imperialVal: 'Required if Joist Span > 6\'11"',
      jobsiteNote: 'Rows of bridging or solid blocking must be installed at intervals not exceeding 2.1m (approx. 7 ft). For a standard 12-foot deck span, install one row of solid blocking right down the center.'
    },
    {
      id: 'obc_deck_sway_bracing',
      category: 'decks',
      title: 'Elevated Deck Diagonal Sway Bracing',
      codeRef: 'OBC 9.23.6.1 / SB-7',
      summary: 'Requirements for continuous structural stability against lateral wind loads and occupant sway on elevated decks.',
      metricVal: 'Required on Posts Elevated > 600 mm',
      imperialVal: 'Required on Posts Elevated > 24"',
      jobsiteNote: 'Install 2x6 or 4x4 diagonal knee braces at a 45-degree angle between support columns and drop beams, secured with through-bolts or rated heavy-duty structural screws.'
    },
		{
      id: 'all_deck_ijoist_ledger',
      category: 'decks',
      title: 'Ledger Attachment to Engineered I-Joist Rim Board',
      codeRef: 'IRC R507.9.1.2 / NBC / OBC Spec',
      summary: 'Attachment rules when bolting a deck ledger into an engineered wood rim board (rim joist).',
      metricVal: 'Requires Interior 38mm Backer Blocking or Manufacturer Spec',
      imperialVal: 'Requires Interior 2x Backer Blocking or Manufacturer Spec',
      jobsiteNote: 'You CANNOT lag bolt a deck ledger into an engineered OSB rim board alone. You must install continuous 2x8/2x10 solid wood or engineered backer blocking inside the joist bays against the inside face of the rim board before through-bolting.'
    },
    {
      id: 'obc_guard_infill_load',
      category: 'decks',
      title: 'Guardrail Infill Picket Strength',
      codeRef: 'OBC Table 9.8.8.2',
      summary: 'Minimum concentrated horizontal force that individual vertical balusters or glass panels must resist without breaking or permanently deflecting.',
      metricVal: '0.5 kN Concentrated Load',
      imperialVal: '112 lbs Concentrated Load',
      jobsiteNote: 'Applied over a small 100mm x 100mm (4" x 4") area. Face-nailing 2x2 pickets into the side of rim joists frequently fails this test; secure pickets between top and bottom sub-rails or use rated screw fasteners.'
    },
    {
      id: 'obc_stair_exterior_bearing',
      category: 'stairs',
      title: 'Exterior Stair Stringer Foundation Pad',
      codeRef: 'OBC 9.8.9.5.(1)',
      summary: 'Foundation support requirements for the base of exterior wooden stair stringers resting on ground level.',
      metricVal: 'Support on Concrete Slab or Frost Footing',
      imperialVal: 'Support on Concrete Slab or Frost Footing',
      jobsiteNote: 'Resting untreated stair stringers directly on patio stones or dirt will sink and rot. Stringers must bear on a poured concrete landing pad or structural frost piers elevated at least 50mm (2") above grade.'
    },
		{
      id: 'obc_roof_venting',
      category: 'framing',
      title: 'Minimum Attic / Roof Space Ventilation',
      codeRef: 'OBC 9.19.1.1.(1)',
      summary: 'Required unobstructed ventilation area for unconditioned attic spaces to prevent moisture buildup and ice damming.',
      metricVal: '1/300 of Insulated Ceiling Area',
      imperialVal: '1/300 of Insulated Ceiling Area',
      jobsiteNote: 'The total required vent area must be distributed evenly. For optimum airflow, distribute 50% of the venting at the soffits (intake) and 50% at the ridge or upper roof vents (exhaust).'
    },
    {
      id: 'obc_roof_collar_ties',
      category: 'framing',
      title: 'Collar Tie Size & Spacing',
      codeRef: 'OBC 9.23.13.7.(1)',
      summary: 'Horizontal structural members installed in the upper third of the roof space to prevent rafters from separating at the ridge under wind uplift.',
      metricVal: '38x89 mm Minimum @ 1200 mm OC',
      imperialVal: '2x4 Nominal Minimum @ 48" OC',
      jobsiteNote: 'Collar ties must be installed in the upper third of the roof span. They do NOT prevent the exterior walls from spreading—that is the job of the ceiling joists (rafter ties) at the bottom.'
    },
    {
      id: 'obc_roof_ridge_board',
      category: 'framing',
      title: 'Ridge Board Sizing',
      codeRef: 'OBC 9.23.13.8.(1)',
      summary: 'Minimum dimensional requirements for non-structural ridge boards where opposing rafters meet.',
      metricVal: 'Depth ≥ Rafter Plumb Cut',
      imperialVal: 'Depth ≥ Rafter Plumb Cut',
      jobsiteNote: 'The ridge board must be at least 19mm (1" nominal) thick and its vertical depth must equal or exceed the total length of the rafter\'s plumb cut so no part of the rafter end is exposed.'
    },
    {
      id: 'obc_roof_truss_bracing',
      category: 'framing',
      title: 'Engineered Truss Lateral Bracing',
      codeRef: 'OBC 9.23.13.11.(2)',
      summary: 'Continuous lateral bracing required across truss chords to prevent them from buckling or folding like dominoes.',
      metricVal: '19x89 mm Strapping @ 600 mm OC',
      imperialVal: '1x4 Nominal Strapping @ 24" OC',
      jobsiteNote: 'Follow the specific truss engineered drawings. Do not remove temporary installation bracing until the permanent continuous strapping and roof sheathing are completely nailed off.'
    },
    {
      id: 'obc_roof_rafter_bearing',
      category: 'framing',
      title: 'Rafter Seat Cut (Birdsmouth) Bearing',
      codeRef: 'OBC 9.23.9.1.(1)',
      summary: 'Minimum required solid level contact length where a rafter rests on a top wall plate.',
      metricVal: '38 mm Minimum Bearing',
      imperialVal: '1-1/2" Minimum Bearing',
      jobsiteNote: 'The level seat cut of the birdsmouth must provide at least 1.5 inches of flat bearing on the top plate, but the vertical heel cut must not remove more than 1/4 of the rafter depth.'
    },
		{
      id: 'obc_roof_eave_protection',
      category: 'framing',
      title: 'Eave Protection (Ice & Water Shield)',
      codeRef: 'OBC 9.26.5.1.(1)',
      summary: 'Required waterproof membrane placement at roof eaves to protect against water backup from ice dams.',
      metricVal: 'Extend 900 mm up roof past inner wall face',
      imperialVal: 'Extend 36" up roof past inner wall face',
      jobsiteNote: 'Don\'t just roll out one 3-foot strip at the gutter and call it a day. The membrane must reach at least 36 inches *past the inside face of the heated exterior wall* horizontally.'
    },
    {
      id: 'obc_roof_min_slope',
      category: 'framing',
      title: 'Minimum Pitch for Asphalt Shingles',
      codeRef: 'OBC 9.26.3.1.(1)',
      summary: 'The lowest allowable roof slope where standard asphalt shingles can be installed without special low-slope modifications.',
      metricVal: '1:6 Pitch (approx. 2/12) with Low-Slope Prep',
      imperialVal: '2/12 Pitch Minimum (with Low-Slope Prep)',
      jobsiteNote: 'Between 2/12 and 4/12 pitch, you must use low-slope application methods (e.g., full double-coverage underlayment or complete ice-and-water shield). Below 2/12, asphalt shingles are strictly prohibited—you must use roll roofing or membrane.'
    },
    {
      id: 'obc_roof_drilling',
      category: 'framing',
      title: 'Drilling Holes in Solid Rafters',
      codeRef: 'OBC 9.23.5.1.(2)',
      summary: 'Maximum allowable size and location for holes drilled through solid lumber roof rafters for plumbing or electrical.',
      metricVal: 'Max Hole = 1/4 Rafter Depth',
      imperialVal: 'Max Hole = 1/4 Rafter Depth',
      jobsiteNote: 'Holes cannot be larger than 1/4 of the rafter’s actual depth, and the edge of the hole must be at least 50 mm (2 inches) away from the top or bottom edge of the rafter.'
    },
		{
      id: 'obc_roof_valley_rafter',
      category: 'framing',
      title: 'Valley & Hip Rafter Sizing',
      codeRef: 'OBC 9.23.13.6.(1)',
      summary: 'Minimum lumber thickness and depth required for diagonal hip and valley rafters where intersecting roof slopes meet.',
      metricVal: '38 mm Min Thick, Depth ≥ Jack Cut',
      imperialVal: '2" Nominal Min Thick, Depth ≥ Jack Cut',
      jobsiteNote: 'Valley and hip rafters must be deep enough that the compound plumb cut of the intersecting jack rafters bears 100% against solid wood. This almost always requires using lumber at least one dimensional size larger than your common rafters (e.g., a 2x10 valley for 2x8 common rafters).'
    },
    {
      id: 'obc_roof_opening_framing',
      category: 'framing',
      title: 'Framing Around Roof Openings (Skylights/Chimneys)',
      codeRef: 'OBC 9.23.13.10.(1)',
      summary: 'Requirements for structural reinforcing around roof deck openings created for skylights, chimneys, or roof dormers.',
      metricVal: 'Double Headers & Trimmers if > 2 Rafter Spacings',
      imperialVal: 'Double Headers & Trimmers if > 2 Rafter Spacings',
      jobsiteNote: 'If an opening cuts through two or more common rafters (exceeding roughly 32" to 48" wide depending on spacing), both the side trimmer rafters and the cross-slope header rafters must be doubled and hung with rated structural framing hangers.'
    },
    {
      id: 'obc_roof_struts_purlins',
      category: 'framing',
      title: 'Rafter Support Struts & Purlins',
      codeRef: 'OBC 9.23.13.7.(2)',
      summary: 'Rules for intermediate vertical or angled struts supporting long rafter spans to prevent mid-span sagging.',
      metricVal: '38x89 mm Struts @ ≥ 45° Slope',
      imperialVal: '2x4 Nominal Struts @ ≥ 45° Slope',
      jobsiteNote: 'Struts supporting continuous purlins under rafters must slope at an angle not less than 45° to the horizontal and must bear directly onto interior load-bearing partitions or structural beams—never directly onto unsupported ceiling joists.'
    },
    {
      id: 'obc_roof_sheathing_fasteners',
      category: 'framing',
      title: 'Roof Sheathing Nail Schedule',
      codeRef: 'OBC Table 9.23.3.5.A',
      summary: 'Mandatory fastener spacing along panel edges and intermediate framing members for OSB or plywood roof decks.',
      metricVal: '150 mm OC Edges / 300 mm OC Field',
      imperialVal: '6" OC Edges / 12" OC Field',
      jobsiteNote: 'Use minimum 51 mm (2") common ring-shank nails or structural staples. Missing edge nails or spacing them at 12" on the perimeter of OSB sheets is one of the most common reasons for failed rough framing inspections.'
    },
		{
      id: 'obc_floor_joist_bearing',
      category: 'framing',
      title: 'Minimum Joist End Bearing Length',
      codeRef: 'OBC 9.23.9.1.(2)',
      summary: 'Required physical contact support length for floor joists resting on wood plates, steel beams, or foundation walls.',
      metricVal: '38 mm Min on Wood / 76 mm on Masonry',
      imperialVal: '1-1/2" Min on Wood / 3" on Masonry',
      jobsiteNote: 'Where joists frame flush into the side of a steel or wood drop beam rather than resting on top, approved galvanized joist hangers must be used with every nail hole filled.'
    },
    {
      id: 'obc_floor_joist_bridging',
      category: 'framing',
      title: 'Floor Joist Bridging & Strapping',
      codeRef: 'OBC 9.23.9.4.(1)',
      summary: 'Mandatory intermediate lateral restraint installed across floor joists to distribute concentrated point loads and prevent joist twisting.',
      metricVal: 'Required if Joist Span > 2100 mm',
      imperialVal: 'Required if Joist Span > 6\'11"',
      jobsiteNote: 'Install rows of 19x89mm (1x4) wood strapping @ 1200mm (48") OC along the bottom edge, or install solid 2x blocking / diagonal cross-bridging @ intervals not exceeding 2100mm (7 ft).'
    },
    {
      id: 'obc_floor_joist_notching',
      category: 'framing',
      title: 'Notching Solid Lumber Floor Joists',
      codeRef: 'OBC 9.23.5.2.(1)',
      summary: 'Strict limits on the depth and location of notches cut into the top or bottom edges of solid wood joists for plumbing or mechanical runs.',
      metricVal: 'Max Depth = 1/3 Joist Depth (Near Support Only)',
      imperialVal: 'Max Depth = 1/3 Joist Depth (Near Support Only)',
      jobsiteNote: 'Notches are strictly prohibited in the middle half of the joist span. They are ONLY permitted near the bearing supports (within a distance equal to half the joist depth from the edge of the bearing).'
    },
    {
      id: 'obc_floor_joist_drilling',
      category: 'framing',
      title: 'Drilling Holes in Floor Joists',
      codeRef: 'OBC 9.23.5.1.(1)',
      summary: 'Maximum allowable diameter and placement for holes bored through solid wood floor joists.',
      metricVal: 'Max Hole = 1/4 Joist Depth',
      imperialVal: 'Max Hole = 1/4 Joist Depth',
      jobsiteNote: 'For a standard 2x10 (9.25" actual depth), the maximum hole diameter is 2-5/16". The edge of any drilled hole must be located at least 50mm (2 inches) away from the top or bottom edge of the joist.'
    },
    {
      id: 'obc_floor_subfloor_thickness',
      category: 'framing',
      title: 'Minimum Subfloor Sheathing Thickness',
      codeRef: 'OBC Table 9.23.14.5.A',
      summary: 'Prescriptive plywood or OSB subfloor thickness required over standard residential floor joist spacing.',
      metricVal: '15.9 mm Min (@ 400 mm OC Joists)',
      imperialVal: '5/8" Min (@ 16" OC Joists)',
      jobsiteNote: 'If framing joists at 600mm (24") OC, subfloor thickness must increase to 19mm (3/4"). Use tongue-and-groove (T&G) OSB panels glued with polyurethane subfloor adhesive and screwed down to guarantee a squeak-free floor.'
    },
    {
      id: 'obc_floor_beam_support',
      category: 'framing',
      title: 'Built-Up Wood Beam Joints',
      codeRef: 'OBC 9.23.8.3.(2)',
      summary: 'Placement rules for butt joints between individual lumber plies when assembling multi-ply structural floor beams.',
      metricVal: 'Joints Must Land Over Support Posts',
      imperialVal: 'Joints Must Land Over Support Posts',
      jobsiteNote: 'Unless specifically engineered otherwise, joints in individual plies of a built-up beam must occur directly over a support column. Stagger joints in adjacent plies by at least one post span.'
    },
		{
      id: 'obc_floor_opening_headers',
      category: 'framing',
      title: 'Framing Floor Openings (Stairwells)',
      codeRef: 'OBC 9.23.9.5.(2)',
      summary: 'Mandatory structural doubling of header and trimmer joists framing a stairwell or floor opening.',
      metricVal: 'Double Trimmers & Headers if Opening > 1.2 m',
      imperialVal: 'Double Trimmers & Headers if Opening > 4 ft',
      jobsiteNote: 'If the opening header spans more than 1.2m (approx. 4 feet) or cuts through more than two joist spacings, the trimmers on the sides and the headers across the ends MUST be doubled and supported by approved joist hangers.'
    },
    {
      id: 'obc_floor_partition_support',
      category: 'framing',
      title: 'Joists Under Parallel Partitions',
      codeRef: 'OBC 9.23.9.8.(1)',
      summary: 'Required floor framing support beneath non-loadbearing interior partition walls that run parallel to the floor joists.',
      metricVal: 'Double Joists or Solid Blocking @ 1.2m OC',
      imperialVal: 'Double Joists or Solid Blocking @ 4 ft OC',
      jobsiteNote: 'If an interior wall lands between two floor joists, you cannot just let the plywood subfloor carry the wall weight. You must install solid blocking perpendicular to the joists at maximum 4-foot intervals to carry the partition wall plate.'
    },
    {
      id: 'obc_floor_sill_anchorage',
      category: 'framing',
      title: 'Sill Plate Foundation Anchor Bolts',
      codeRef: 'OBC 9.23.6.1.(2)',
      summary: 'Required size and spacing of steel anchor bolts securing the wood sill plate to the concrete foundation wall.',
      metricVal: '12.7 mm Bolts @ 2400 mm OC Max',
      imperialVal: '1/2" Bolts @ 8 ft OC Max',
      jobsiteNote: 'Anchor bolts must be embedded at least 100mm (4 inches) into the concrete. You must place an anchor bolt within 300mm (12 inches) of every foundation corner and every sill plate splice.'
    },
    {
      id: 'obc_floor_engineered_flanges',
      category: 'framing',
      title: 'Notching Engineered Wood Flanges',
      codeRef: 'OBC 9.23.5.2.(3)',
      summary: 'Rules regarding cutting, notching, or drilling the top or bottom flanges of engineered I-joists or LVL beams.',
      metricVal: 'Strictly Prohibited',
      imperialVal: 'Strictly Prohibited',
      jobsiteNote: 'The top and bottom flanges of an I-joist act exactly like the steel flanges of an I-beam. Even a 1/4-inch nick from a reciprocating saw or a plumber\'s drill bit instantly destroys the structural rating of the entire joist.'
    },
		{
      id: 'obc_floor_sill_moisture',
      category: 'framing',
      title: 'Sill Plate Moisture Separation',
      codeRef: 'OBC 9.23.2.2.(1) / 9.23.2.3',
      summary: 'Mandatory moisture break required between wood floor framing and concrete or masonry foundation walls.',
      metricVal: '0.05 mm Polyethylene or Foam Gasket',
      imperialVal: '6-mil Polyethylene or Foam Sill Gasket',
      jobsiteNote: 'Standard untreated lumber will wick moisture directly out of concrete and rot. You must install a closed-cell foam sill gasket (which also acts as an air seal) or 6-mil poly under the bottom plate. Alternatively, use pressure-treated lumber.'
    },
    {
      id: 'obc_floor_joist_fastening',
      category: 'framing',
      title: 'Joist to Sill Plate Fastening',
      codeRef: 'OBC Table 9.23.3.4',
      summary: 'Required minimum nail count and size for securing floor joists down to the foundation sill plate.',
      metricVal: 'Two 82 mm Toe-Nails',
      imperialVal: 'Two 3-1/4" Toe-Nails',
      jobsiteNote: 'Drive one toe-nail through each side of the joist into the sill plate. In high-wind areas, inspectors may require engineered steel hurricane clips (e.g., Simpson H2.5A) instead of toe-nails.'
    },
    {
      id: 'obc_floor_balcony_cantilever',
      category: 'framing',
      title: 'Exterior Balcony Cantilever Backspan',
      codeRef: 'OBC 9.23.9.9.(2)',
      summary: 'Required interior backspan for interior floor joists that project through the exterior wall to form an exterior balcony.',
      metricVal: 'Backspan ≥ 6x Cantilever Overhang',
      imperialVal: 'Backspan ≥ 6x Cantilever Overhang',
      jobsiteNote: 'Notice how extreme this is compared to deck ledgers: If you push interior 2x10 floor joists 2 feet outside the house to form a floating balcony, those joists must run continuously at least 12 feet into the interior of the house (a 6:1 ratio) to counter-balance the exterior load.'
    },
    {
      id: 'obc_floor_rim_drilling',
      category: 'framing',
      title: 'Drilling the Rim / Band Joist',
      codeRef: 'OBC 9.23.5.1',
      summary: 'Limits on drilling large exhaust vent holes through the structural rim joist carrying the exterior wall.',
      metricVal: 'Max Hole = 1/4 Joist Depth',
      imperialVal: 'Max Hole = 1/4 Joist Depth',
      jobsiteNote: 'HVAC contractors often blow massive 4-inch or 6-inch holes through a 2x10 rim joist for dryer or exhaust vents. This violates the 1/4-depth structural rule and destroys the rim\'s ability to carry the exterior wall load above. You must frame a proper solid-blocked opening for large vents.'
    },
		{
      id: 'obc_floor_treated_sill',
      category: 'framing',
      title: 'Treated Wood on Concrete Foundation',
      codeRef: 'OBC 9.23.2.3.(1)',
      summary: 'Moisture protection requirements for wood framing members in direct contact with concrete or masonry foundation walls.',
      metricVal: 'Preservative Treated OR 0.05mm Poly Separation',
      imperialVal: 'Preservative Treated OR 6-mil Poly Separation',
      jobsiteNote: 'You cannot bolt untreated SPF lumber directly to a concrete foundation. The sill plate must either be pressure-treated lumber OR separated from the concrete by an approved foam sill gasket and 6-mil polyethylene barrier.'
    },
    {
      id: 'obc_floor_beam_pocket',
      category: 'framing',
      title: 'Wood Beam Clearances in Concrete Pockets',
      codeRef: 'OBC 9.23.2.2.(2)',
      summary: 'Required airspace around the ends of solid sawn or engineered wood beams resting inside concrete foundation wall pockets.',
      metricVal: '12 mm Airspace (Sides, Top, End)',
      imperialVal: '1/2" Airspace (Sides, Top, End)',
      jobsiteNote: 'Never pack mortar or concrete tight around a wood beam resting in a foundation pocket. Wood absorbs moisture from concrete and expands/rots. Leave a 1/2-inch gap on both sides, the top, and the back end for air circulation.'
    },
    {
      id: 'obc_floor_cantilever_bumpout',
      category: 'framing',
      title: 'Floor Cantilevers Supporting Exterior Walls',
      codeRef: 'OBC 9.23.9.9.(2)',
      summary: 'Maximum allowable floor joist overhang when supporting a load-bearing exterior wall and roof above (e.g., bay windows or second-floor bump-outs).',
      metricVal: '400 mm Max (600 mm for 2x10s)',
      imperialVal: '16" Max (24" for 2x10s)',
      jobsiteNote: 'When a floor cantilevers out to carry the roof load above, the cantilever cannot exceed 400mm (16") for 2x8 joists, or 600mm (24") for 2x10 joists. The interior backspan must be at least 6 times the overhang distance.'
    },
    {
      id: 'obc_floor_rim_joist_bearing',
      category: 'framing',
      title: 'Rim Joist & End Blocking Support',
      codeRef: 'OBC 9.23.9.3.(1)',
      summary: 'Requirement for lateral restraint at the extreme ends of floor joists where they bear on sill plates or beams.',
      metricVal: 'Continuous Rim Joist or Solid Blocking Required',
      imperialVal: 'Continuous Rim Joist or Solid Blocking Required',
      jobsiteNote: 'Floor joists cannot just rest freely on the sill plate. They must be nailed into a continuous perimeter rim joist (band board) or have solid 2x blocking installed between every joist directly over the bearing point to prevent the joists from rolling.'
    },
		{
      id: 'obc_lintel_bearing',
      category: 'framing',
      title: 'Minimum Lintel End Bearing (Jack Studs)',
      codeRef: 'OBC 9.23.12.3.(1)',
      summary: 'Required solid wood bearing length supporting each end of a structural lintel over a wall opening.',
      metricVal: '38 mm Minimum (1 Jack Stud)',
      imperialVal: '1-1/2" Minimum (1 Jack Stud)',
      jobsiteNote: 'While 1.5 inches (one 2x4 jack stud) is the baseline minimum for short spans, garage door lintels or heavy-load spans over 3 meters (10 ft) frequently require double jack studs (3" bearing) on each side to prevent crushing the wood fibers.'
    },
    {
      id: 'obc_lintel_nonbearing',
      category: 'framing',
      title: 'Non-Loadbearing Wall Openings',
      codeRef: 'OBC 9.23.12.2.(3)',
      summary: 'Framing requirements for lintels spanning doorways or openings in interior walls that carry no roof or floor loads.',
      metricVal: 'Single 38 mm Flat Lumber up to 2.4m',
      imperialVal: 'Single 2x Flat Lumber up to 8 ft',
      jobsiteNote: 'For standard interior doorways up to 8 feet wide, you do not need a heavy 2x8 beam. A single 2x4 laid flat is code-compliant to act as the doorway header since it only carries the weight of the drywall above it.'
    },
    {
      id: 'obc_lintel_fastening',
      category: 'framing',
      title: 'Built-Up Lintel Fastening Schedule',
      codeRef: 'OBC 9.23.12.2.(1)',
      summary: 'Required nailing pattern for assembling multi-ply structural lintels (e.g., 2-ply or 3-ply 2x10s).',
      metricVal: '89 mm Nails @ 450 mm OC (Double Row)',
      imperialVal: '3-1/2" Nails @ 18" OC (Double Row)',
      jobsiteNote: 'The plies must be fastened together with two rows of 3.5" framing nails spaced no more than 18 inches apart. Nails must be driven from alternate sides so they penetrate all the way through the assembly.'
    },
    {
      id: 'obc_lintel_insulation',
      category: 'framing',
      title: 'Lintel Spacer / Insulation Cavity',
      codeRef: 'OBC 9.23.12.2.(2)',
      summary: 'Requirement for creating thermal breaks in exterior wall lintels.',
      metricVal: 'Insert Spacers for Minimum 50mm Insulation',
      imperialVal: 'Insert Spacers for Minimum 2" Insulation',
      jobsiteNote: 'A solid 3-ply 2x10 lintel on an exterior 2x6 wall creates a major thermal bridge. Code requires building up the lintel with 1/2" plywood spacers to leave a gap on the interior side, allowing you to install rigid foam or spray foam insulation behind the lintel.'
    },
		{
      id: 'obc_lintel_point_loads',
      category: 'framing',
      title: 'Point Loads Bearing on Lintels',
      codeRef: 'OBC 9.23.12.1.(1)',
      summary: 'Restriction on using standard codebook span tables when a concentrated point load bears over a wall opening.',
      metricVal: 'Standard Tables Do Not Apply',
      imperialVal: 'Standard Tables Do Not Apply',
      jobsiteNote: 'If a girder truss, trimmer joist, or structural post from a floor above lands anywhere on your window/door lintel, you CANNOT use the standard OBC lintel span tables. The lintel must be specifically sized by a structural engineer.'
    },
    {
      id: 'obc_lintel_continuity',
      category: 'framing',
      title: 'Prohibition of Lintel Splices',
      codeRef: 'OBC 9.23.12.2.(1)',
      summary: 'Requirement for lumber continuity within a structural lintel span.',
      metricVal: 'Must Span Continuously (No Splices)',
      imperialVal: 'Must Span Continuously (No Splices)',
      jobsiteNote: 'You cannot splice short pieces of 2x10 together to make a longer lintel. Every single ply of a built-up wood lintel must be one continuous piece of lumber bearing fully on the jack studs at both ends.'
    },
    {
      id: 'obc_window_sill_cripples',
      category: 'framing',
      title: 'Window Sill Support (Lower Cripple Studs)',
      codeRef: 'OBC 9.23.12.3.(3)',
      summary: 'Framing requirements supporting the rough sill (bottom plate) of a window opening.',
      metricVal: 'Cripple Studs @ Standard Spacing',
      imperialVal: 'Cripple Studs @ Standard Spacing',
      jobsiteNote: 'The rough sill under a window must be supported by short cripple studs extending down to the floor plate. These must be placed exactly on the 16" or 24" layout lines of the main wall to ensure exterior sheathing has proper nailing edges.'
    },
		{
      id: 'obc_env_vapour_barrier',
      category: 'envelope',
      title: 'Vapour Barrier Placement',
      codeRef: 'OBC 9.25.4.1.(1)',
      summary: 'Required location for the installation of a vapour barrier (typically 6-mil polyethylene) to prevent condensation inside wall cavities.',
      metricVal: 'Install on Warm-in-Winter Side',
      imperialVal: 'Install on Warm-in-Winter Side',
      jobsiteNote: 'In Ontario\'s heating-dominated climate, the poly vapor barrier goes directly behind the drywall on the INSIDE of the house. Never put poly on the exterior face of the studs, as it will trap moisture and rot the framing.'
    },
    {
      id: 'obc_env_attic_baffles',
      category: 'envelope',
      title: 'Attic Eave Insulation Clearance',
      codeRef: 'OBC 9.19.1.3.(1)',
      summary: 'Required unobstructed airspace above attic insulation at the eaves to allow soffit venting to flow up to the roof ridge.',
      metricVal: '50 mm Minimum Clearance',
      imperialVal: '2" Minimum Clearance',
      jobsiteNote: 'Do not stuff fiberglass batts or blow cellulose tight to the roof deck at the eaves. You must install rigid foam or cardboard baffles (Moore vents) to guarantee a minimum 2-inch air gap between the insulation and the roof sheathing.'
    },
    {
      id: 'obc_env_slab_poly',
      category: 'envelope',
      title: 'Basement Slab Soil Gas & Moisture Barrier',
      codeRef: 'OBC 9.13.2.7.(1) / 9.13.4',
      summary: 'Mandatory impermeable membrane installed directly beneath interior concrete basement floor slabs.',
      metricVal: '0.15 mm Polyethylene (6-mil) Minimum',
      imperialVal: '6-mil Polyethylene Minimum',
      jobsiteNote: 'This poly serves a dual purpose: blocking dampness from the soil and blocking radioactive Radon gas. All seams must overlap by at least 300mm (12 inches) and be taped with approved acoustical sealant or radon tape.'
    },
    {
      id: 'obc_env_foundation_dampproof',
      category: 'envelope',
      title: 'Foundation Dampproofing Application',
      codeRef: 'OBC 9.13.2.3.(1)',
      summary: 'Required bituminous coating on the exterior of concrete foundation walls enclosing interior space.',
      metricVal: 'From Footing to Finished Grade Line',
      imperialVal: 'From Footing to Finished Grade Line',
      jobsiteNote: 'Apply heavy liquid asphalt/bitumen coating to the bare concrete wall. It must extend all the way down to the top of the footing and stop exactly at the finished grading line to prevent exposed black tar above the soil.'
    },
    {
      id: 'obc_env_wrb_overlap',
      category: 'envelope',
      title: 'Housewrap (Air/Water Barrier) Lapping',
      codeRef: 'OBC 9.27.3.3.(2)',
      summary: 'Minimum overlap distance for joints in exterior weather-resistive barriers (e.g., Tyvek or Typar).',
      metricVal: '100 mm Minimum Overlap',
      imperialVal: '4" Minimum Overlap',
      jobsiteNote: 'Both vertical and horizontal joints must overlap by at least 4 inches. The upper sheet must ALWAYS lap over the lower sheet (shingle fashion) to shed bulk water outward.'
    },
		{
      id: 'obc_env_weeping_tile',
      category: 'envelope',
      title: 'Foundation Drainage Tile (Weeping Tile)',
      codeRef: 'OBC 9.14.3.1.(1) / 9.14.4',
      summary: 'Mandatory drainage pipe installation around the perimeter of foundation walls enclosing habitable basement space.',
      metricVal: '100 mm Perforated Pipe + 150 mm Crushed Stone Coverage',
      imperialVal: '4" Perforated Pipe + 6" Crushed Stone Coverage',
      jobsiteNote: 'The drainage pipe must sit on an undisturbed or compacted bed and be covered top and sides by at least 150 mm (6") of clean coarse crushed stone. Top filter fabric sock is required in silt/clay soils to prevent clogging.'
    },
    {
      id: 'obc_env_rim_joist_insulation',
      category: 'envelope',
      title: 'Rim Joist Air & Thermal Barrier',
      codeRef: 'OBC 9.25.2.3 / 9.25.3.2',
      summary: 'Insulation and air-sealing detailing where the wooden floor perimeter (rim joist) meets the concrete foundation or upper exterior walls.',
      metricVal: 'Match Wall R-Value + Continuous Air Barrier Sealing',
      imperialVal: 'Match Wall R-Value + Continuous Air Barrier Sealing',
      jobsiteNote: 'Stuffing fiberglass batts against a bare wooden rim joist without a perfectly sealed vapor/air barrier causes warm basement air to condense against the freezing band board. Closed-cell 2-lb polyurethane spray foam is the industry best practice here.'
    },
    {
      id: 'obc_env_shower_waterproofing',
      category: 'envelope',
      title: 'Wet Area Wall Substrate Waterproofing',
      codeRef: 'OBC 9.29.10.4',
      summary: 'Required moisture-resistant backing behind ceramic tile or wall panels in bathtub and shower enclosures.',
      metricVal: 'Cement Board or Waterproof Membrane Required',
      imperialVal: 'Cement Board or Waterproof Membrane Required',
      jobsiteNote: 'Standard paper-faced greenboard (moisture-resistant drywall) is no longer permitted as a direct tile substrate in wet shower areas. Use cement backer board combined with a fluid-applied or sheet waterproofing membrane (e.g., Kerdi).'
    },
    {
      id: 'obc_env_attic_hatch_seal',
      category: 'envelope',
      title: 'Attic Access Hatch Weatherstrip & Thermal Match',
      codeRef: 'OBC 9.19.2.1.(1) / SB-12',
      summary: 'Insulation and air-leakage requirements for access openings into unconditioned attic spaces.',
      metricVal: 'Continuous Closed-Cell Gasket + Match Ceiling RSI',
      imperialVal: 'Continuous Closed-Cell Gasket + Match Ceiling R-Value',
      jobsiteNote: 'An unsealed attic hatch acts as a chimney, dumping warm, moist interior air directly into the cold attic and causing severe winter frost buildup on roof sheathing. Install pull-down clamps and continuous weatherstripping.'
    },
		{
      id: 'obc_ftg_frost_depth',
      category: 'foundations',
      title: 'Minimum Frost Protection Depth',
      codeRef: 'OBC 9.12.2.2.(1)',
      summary: 'Required minimum depth of foundation footings below finished ground level to prevent frost heave and structural displacement.',
      metricVal: '1.2 m Below Finished Grade (Southern Ontario avg)',
      imperialVal: '48" (4 ft) Below Finished Grade',
      jobsiteNote: 'Footings must bear on undisturbed native soil or engineered fill. In Northern Ontario or rock-dominated areas, local frost lines can reach 1.5 m to 1.8 m (5 to 6 ft). Always verify your municipality\'s specific frost depth.'
    },
    {
      id: 'obc_ftg_strip_thickness',
      category: 'foundations',
      title: 'Minimum Continuous Strip Footing Thickness',
      codeRef: 'OBC 9.15.3.4.(1)',
      summary: 'Required vertical concrete depth for continuous strip footings supporting foundation walls.',
      metricVal: '100 mm Min (or equal to projection)',
      imperialVal: '4" Min (or equal to projection)',
      jobsiteNote: 'While 100 mm (4") is the absolute codebook minimum, professional builders almost universally pour residential strip footings at least 150 mm to 200 mm (6" to 8") thick to ensure adequate rebar cover and structural rigidity.'
    },
    {
      id: 'obc_ftg_projection_rule',
      category: 'foundations',
      title: 'Footing Projection Rule (P ≤ T)',
      codeRef: 'OBC 9.15.3.4.(2)',
      summary: 'Maximum allowable distance that a concrete footing can project horizontally beyond the face of the foundation wall.',
      metricVal: 'Projection ≤ Footing Thickness',
      imperialVal: 'Projection ≤ Footing Thickness',
      jobsiteNote: 'If your poured concrete footing is 200 mm (8") thick, the footing shelf sticking out past the foundation wall cannot extend further than 200 mm (8") on either side without requiring specific structural steel rebar engineering.'
    },
    {
      id: 'obc_ftg_column_pad',
      category: 'foundations',
      title: 'Isolated Column / Pier Pad Sizing',
      codeRef: 'OBC Table 9.15.3.5',
      summary: 'Minimum base surface area for isolated concrete pads supporting interior steel columns or exterior deck posts.',
      metricVal: '0.4 m² Min Area (~630 mm x 630 mm)',
      imperialVal: '4.3 sq ft Min Area (~25" x 25")',
      jobsiteNote: 'Assumes standard 1-story frame construction on 75 kPa (~1,500 PSF) soil. For 2-story construction or decks carrying heavy point loads (like hot tubs), pad dimensions must increase significantly per OBC load tables.'
    },
    {
      id: 'obc_ftg_stepped_rules',
      category: 'foundations',
      title: 'Stepped Footing Dimensions on Slopes',
      codeRef: 'OBC 9.15.3.9.(1)',
      summary: 'Vertical rise and horizontal run limitations when stepping continuous footings down sloped ground.',
      metricVal: 'Max Rise 600 mm / Min Run 600 mm',
      imperialVal: 'Max Rise 24" / Min Run 24"',
      jobsiteNote: 'When stepping a footing down a hillside, the vertical rise of each step cannot exceed 600 mm (24"), and the horizontal run between steps must be at least 600 mm (24"). Form step transitions cleanly with overlapping continuous rebar.'
    },
    {
      id: 'obc_ftg_soil_bearing',
      category: 'foundations',
      title: 'Standard Prescriptive Soil Bearing Capacity',
      codeRef: 'OBC 9.4.4.1 / 9.15.3.1',
      summary: 'Assumed baseline soil load-bearing capacity used when sizing standard residential prescriptive footings.',
      metricVal: '75 kPa Assumed Bearing Capacity',
      imperialVal: '1,560 PSF Assumed Bearing Capacity',
      jobsiteNote: 'If your excavation reveals soft clay, silt, organic peat, or uncompacted fill, standard footing tables are void. You must over-excavate to firm native soil or consult a geotechnical engineer to widen the footing pads.'
    },
		{
      id: 'obc_ftg_trench_angle',
      category: 'foundations',
      title: 'Footings Adjacent to Trenches (Angle of Repose)',
      codeRef: 'OBC 9.12.1.2.(1)',
      summary: 'Prohibition against placing footings where the load will bear on the soft backfill of an adjacent plumbing trench or lower excavation.',
      metricVal: 'Maintain 45° Angle of Repose',
      imperialVal: 'Maintain 45° Angle of Repose (1:1 Ratio)',
      jobsiteNote: 'If a plumber digs a 3-foot deep drain trench near your footing, your footing must be kept at least 3 feet horizontally away from the edge of the trench. Otherwise, your footing must be dug deeper to bear BELOW the 45-degree angle line from the trench bottom.'
    },
    {
      id: 'obc_ftg_pier_frost_heave',
      category: 'foundations',
      title: 'Pier Frost Heave Resistance (Deck Tubes)',
      codeRef: 'OBC 9.12.2.2.(5)',
      summary: 'Requirement to prevent freezing soil from gripping the sides of concrete piers and pulling them out of the ground.',
      metricVal: 'Flared Base or Friction-Reduction Wrap',
      imperialVal: 'Flared Base or Friction-Reduction Wrap',
      jobsiteNote: 'Digging a straight 4-foot hole and dropping a Sonotube in is often no longer enough. Saturated clay freezing against the cardboard tube will heave the deck. You must use a flared plastic bell base (like a Bigfoot) OR wrap the tube in two layers of 6-mil poly/slick barrier to break the frost grip.'
    },
    {
      id: 'obc_ftg_rock_bearing',
      category: 'foundations',
      title: 'Footings Bearing on Solid Rock',
      codeRef: 'OBC 9.15.3.8.(1)',
      summary: 'Rules for pouring footings directly onto solid bedrock (common in Muskoka and Northern Ontario).',
      metricVal: 'Pin to Bedrock (No Minimum Thickness)',
      imperialVal: 'Pin to Bedrock (No Minimum Thickness)',
      jobsiteNote: 'When pouring on solid bedrock, the standard footing width/thickness rules are waived because the rock easily exceeds 75 kPa bearing capacity. However, the rock surface must be cleaned of all soil and loose shale, stepped level, and the foundation wall must be pinned with steel rebar doweled into the rock.'
    },
		{
      id: 'obc_ftg_cold_weather',
      category: 'foundations',
      title: 'Cold Weather Pouring Restrictions',
      codeRef: 'OBC 9.12.1.3.(1)',
      summary: 'Prohibition against placing footing concrete on frozen soil or allowing the concrete to freeze while curing.',
      metricVal: 'Never Pour on Frozen Ground',
      imperialVal: 'Never Pour on Frozen Ground',
      jobsiteNote: 'If you dig a trench in January and leave it overnight, the soil will freeze. The inspector will fail the pre-pour inspection. You must hoard (tarp) and heat the trench with ground-thaw blankets or salamander heaters before pouring.'
    },
    {
      id: 'obc_ftg_rebar_cover',
      category: 'foundations',
      title: 'Concrete Cover Over Rebar (Cast in Earth)',
      codeRef: 'OBC 9.15.3.3 / CSA A23.1',
      summary: 'Minimum amount of concrete required between reinforcing steel and the dirt to prevent the steel from rusting and spalling the footing.',
      metricVal: '75 mm Minimum Cover',
      imperialVal: '3" Minimum Cover',
      jobsiteNote: 'Never lay rebar directly on the dirt at the bottom of the trench. You must tie the rebar to steel chairs, suspended at least 3 inches off the ground, so the wet concrete fully encases the steel.'
    },
    {
      id: 'obc_ftg_monolithic_slab',
      category: 'foundations',
      title: 'Thickened Edge Slab (Monolithic Footing)',
      codeRef: 'OBC 9.15.3.11.(1)',
      summary: 'Sizing requirements when a concrete slab-on-ground is thickened at the perimeter to act as a footing for detached garages or sheds.',
      metricVal: 'Thicken to Minimum Footing Width/Depth',
      imperialVal: 'Thicken to Minimum Footing Width/Depth',
      jobsiteNote: 'For a detached garage built on a floating slab, the outer perimeter where the walls sit must be dug down and thickened to act as a structural beam. The thickened portion must match standard strip footing dimensions (e.g., minimum 100mm thick below the slab base and suitably wide).'
    },
		{
      id: 'obc_fnd_poured_thickness',
      category: 'foundations',
      title: 'Poured Concrete Wall Thickness',
      codeRef: 'OBC 9.15.4.2.(1) / Table 9.15.4.2.A',
      summary: 'Required vertical thickness for solid poured concrete foundation walls based on the height of exterior soil backfill.',
      metricVal: '200 mm Min (If backfill > 1.2 m)',
      imperialVal: '8" Min (If backfill > 4 ft)',
      jobsiteNote: 'While 150 mm (6") poured walls are technically allowed for crawlspaces with less than 4 feet of backfill, full 8-foot basements require a minimum 200 mm (8") thick wall to resist lateral soil pressure without buckling.'
    },
    {
      id: 'obc_fnd_block_parging',
      category: 'foundations',
      title: 'Concrete Block Exterior Parging',
      codeRef: 'OBC 9.15.6.1.(1)',
      summary: 'Mandatory cementitious coating applied to the exterior face of concrete block foundation walls before waterproofing.',
      metricVal: '6 mm Minimum Thickness (Type S or M Mortar)',
      imperialVal: '1/4" Minimum Thickness (Type S or M Mortar)',
      jobsiteNote: 'You cannot apply tar dampproofing directly to bare concrete blocks. The joints are too porous. You must trowel on a continuous 1/4" parge coat over the entire exterior surface below grade, cove it at the footing junction, and let it cure before tarring.'
    },
    {
      id: 'obc_fnd_block_top_course',
      category: 'foundations',
      title: 'Block Wall Top Course (Bond Beam)',
      codeRef: 'OBC 9.15.4.2.(3)',
      summary: 'Structural requirement for the uppermost row of blocks supporting the floor sill plate.',
      metricVal: 'Solid Block or Grouted Core Required',
      imperialVal: 'Solid Block or Grouted Core Required',
      jobsiteNote: 'The top course of a hollow CMU block wall must be made of solid 100% concrete blocks, or standard hollow blocks that have their cores completely filled with concrete/mortar. You cannot bolt a sill plate onto hollow block cores.'
    },
    {
      id: 'obc_fnd_icf_core',
      category: 'foundations',
      title: 'ICF Minimum Concrete Core Thickness',
      codeRef: 'OBC 9.15.4.5.(1)',
      summary: 'Prescriptive minimum concrete thickness inside "flat-wall" Insulated Concrete Forms.',
      metricVal: '140 mm Minimum Core',
      imperialVal: '5-1/2" Minimum Core',
      jobsiteNote: 'For a standard 8-foot or 9-foot basement, a 140 mm (5.5") ICF core is the standard prescriptive minimum. Waffle-grid or screen-grid ICF systems have entirely different, much stricter engineering tables than flat-wall systems.'
    },
    {
      id: 'obc_fnd_backfill_brace',
      category: 'foundations',
      title: 'Lateral Support Before Backfilling',
      codeRef: 'OBC 9.15.4.3.(1)',
      summary: 'Critical sequencing rule preventing foundation walls from collapsing under the weight of exterior soil backfill.',
      metricVal: 'Subfloor Must Be Installed First',
      imperialVal: 'Subfloor Must Be Installed First',
      jobsiteNote: 'Never let an excavator backfill a fresh foundation wall until the main floor joists and subfloor sheathing are completely nailed off. The floor system acts as the structural brace pushing back against the massive lateral pressure of the dirt.'
    },
		{
      id: 'obc_fnd_icf_protection',
      category: 'foundations',
      title: 'ICF Above-Grade Exterior Protection',
      codeRef: 'OBC 9.15.4.5.(3)',
      summary: 'Mandatory physical and UV protection for the exposed EPS foam portion of an ICF wall above the dirt line.',
      metricVal: 'Approved Parging, Stucco, or Siding',
      imperialVal: 'Approved Parging, Stucco, or Siding',
      jobsiteNote: 'You cannot leave the raw foam of an ICF block exposed to the sun and weed whackers. The exposed portion between the finished grading and the wall siding must be covered with an acrylic stucco system, cement board, or metal flashing.'
    },
    {
      id: 'obc_fnd_opening_rebar',
      category: 'foundations',
      title: 'Rebar Around Foundation Openings',
      codeRef: 'OBC 9.15.4.2 / Structural Details',
      summary: 'Requirement for reinforcing steel around basement windows or doors cut into poured concrete foundation walls.',
      metricVal: 'Two 15M Bars on All Sides',
      imperialVal: 'Two #5 Bars on All Sides',
      jobsiteNote: 'Concrete is weak in tension. Corners of basement window openings are notorious for spider cracking. You must place at least two 15M (#5) reinforcing bars horizontally and vertically around the opening, extending at least 600 mm (24") beyond the corners.'
    },
    {
      id: 'obc_fnd_block_corbelling',
      category: 'foundations',
      title: 'Masonry Foundation Corbelling (Brick Ledge)',
      codeRef: 'OBC 9.15.5.1.(1)',
      summary: 'Limits on how far the top courses of a concrete block foundation can step outward to support a heavy exterior brick veneer.',
      metricVal: 'Max 1/3 of Block Thickness Total',
      imperialVal: 'Max 1/3 of Block Thickness Total',
      jobsiteNote: 'When stepping (corbelling) concrete blocks outward to create a ledge for exterior brick siding, no individual course can project more than 1/2 of its own height, and the total overhang cannot exceed one-third of the total foundation wall thickness. The top corbel course must be solid concrete.'
    },
		{
      id: 'obc_wall_stud_drilling',
      category: 'framing',
      title: 'Drilling Holes in Wall Studs',
      codeRef: 'OBC 9.23.5.3.(2)',
      summary: 'Maximum allowable diameter for holes bored through load-bearing wall studs for plumbing or electrical.',
      metricVal: 'Max Hole = 1/3 Stud Depth',
      imperialVal: 'Max Hole = 1/3 Stud Depth',
      jobsiteNote: 'For a standard 2x4 stud (3.5" actual), the maximum hole you can drill is 1-3/16". For a 2x6 stud (5.5" actual), the maximum is 1-13/16". The hole must be exactly in the center of the stud.'
    },
    {
      id: 'obc_wall_stud_notching',
      category: 'framing',
      title: 'Notching Load-Bearing Studs',
      codeRef: 'OBC 9.23.5.3.(1)',
      summary: 'Maximum allowable depth for notches cut into the side of a load-bearing exterior or interior partition stud.',
      metricVal: 'Max Notch = 1/3 Stud Depth',
      imperialVal: 'Max Notch = 1/3 Stud Depth',
      jobsiteNote: 'If a plumber notches more than 1/3 of the depth out of a load-bearing stud, the stud is structurally compromised. The only fix is to sister a second full-length stud directly beside it.'
    },
    {
      id: 'obc_wall_top_plate_splice',
      category: 'framing',
      title: 'Double Top Plate Splice Overlap',
      codeRef: 'OBC 9.23.11.4.(3)',
      summary: 'Required horizontal distance between joints (splices) in the upper and lower members of a double top plate.',
      metricVal: 'Offset by ≥ 1 Stud Spacing (e.g., 400 mm)',
      imperialVal: 'Offset by ≥ 1 Stud Spacing (e.g., 16")',
      jobsiteNote: 'You can never stack splices directly on top of each other. The break in the upper top plate must occur at least one full stud cavity away from the break in the lower top plate.'
    },
    {
      id: 'obc_wall_fireblocking',
      category: 'framing',
      title: 'Vertical Fireblocking Intervals',
      codeRef: 'OBC 9.10.16.2.(1)',
      summary: 'Maximum height a concealed wall cavity can reach before continuous horizontal solid wood fireblocking is required.',
      metricVal: 'Block at 3.0 m Vertical Intervals',
      imperialVal: 'Block at 10 ft Vertical Intervals',
      jobsiteNote: 'If you are framing balloon walls in a vaulted great room or a tall stairwell that exceeds 10 feet in height, you MUST install solid 2x blocking horizontally between every single stud at the 10-foot mark to stop fire from drafting upward.'
    },
    {
      id: 'obc_wall_corner_backing',
      category: 'framing',
      title: 'Exterior Wall Corner Framing',
      codeRef: 'OBC 9.23.10.5.(1)',
      summary: 'Requirement for framing intersecting walls to provide solid backing for interior finishes (drywall).',
      metricVal: 'Solid Backing (e.g., 3-Stud Corner / California Corner)',
      imperialVal: 'Solid Backing (e.g., 3-Stud Corner / California Corner)',
      jobsiteNote: 'Corners must provide a solid nailing edge for the drywall on both intersecting walls. Modern energy-efficient builders use "California Corners" (a 2-stud L-shape with drywall clips) to allow insulation to reach all the way into the corner cavity.'
    },
		{
      id: 'obc_wall_top_plate_cut',
      category: 'framing',
      title: 'Severed Top Plate Tension Tie',
      codeRef: 'OBC 9.23.11.5.(1)',
      summary: 'Structural repair requirement when a plumber or HVAC installer completely cuts through the wall top plate to run a pipe or duct.',
      metricVal: '3.2 mm Thick Galvanized Steel Strap',
      imperialVal: '1/8" Thick Galvanized Steel Strap',
      jobsiteNote: 'When a 3-inch plumbing stack cuts through a 2x4 top plate, the wall loses its lateral tie. You MUST install a heavy galvanized steel strap across the cut, fastened with at least three 89 mm (3.5") nails on each side to restore the tension capacity.'
    },
    {
      id: 'obc_wall_column_attachment',
      category: 'framing',
      title: 'Steel Column to Beam Connection',
      codeRef: 'OBC 9.17.3.4.(1)',
      summary: 'Requirement for mechanically fastening the top of interior steel teleposts or columns to the wooden or steel drop beam.',
      metricVal: 'Bolted or Welded Connection',
      imperialVal: 'Bolted or Welded Connection',
      jobsiteNote: 'You cannot just wedge a steel telepost under a beam and rely on gravity. The top plate of the steel column must be bolted into a wood beam using minimum 3/8" lag screws, or welded/bolted if connecting to a steel I-beam.'
    },
    {
      id: 'obc_wall_treated_bottom_plate',
      category: 'framing',
      title: 'Bottom Plates on Concrete Slabs',
      codeRef: 'OBC 9.23.2.3.(1)',
      summary: 'Moisture protection for wall framing resting directly on concrete slabs on grade or basement floors.',
      metricVal: 'Treated Wood OR 0.05mm Poly Separation',
      imperialVal: 'Treated Wood OR 6-mil Poly Separation',
      jobsiteNote: 'Even interior partition walls in a basement must have moisture protection. If you use standard untreated spruce for the bottom plate, you must lay a strip of 6-mil poly or foam sill gasket under it to break the capillary action from the concrete.'
    },
		{
      id: 'obc_win_egress_size',
      category: 'windows_doors',
      title: 'Bedroom Egress Window Minimum Area',
      codeRef: 'OBC 9.9.10.1.(2)',
      summary: 'Minimum unobstructed opening area required for emergency escape windows in bedrooms without a sprinkler system.',
      metricVal: '0.35 m² Area / 380 mm Min Dimension',
      imperialVal: '3.8 sq ft Area / 15" Min Dimension',
      jobsiteNote: 'The 0.35 m² must be the CLEAR opening when the sash is fully open. You cannot just measure the glass. If using an awning window, the hardware and the sash itself cannot block the minimum 380 mm (15") exit path.'
    },
    {
      id: 'obc_win_egress_well',
      category: 'windows_doors',
      title: 'Egress Window Well Clearance',
      codeRef: 'OBC 9.9.10.1.(3)',
      summary: 'Required horizontal clearance between an emergency egress window and the retaining wall of a window well.',
      metricVal: '760 mm Minimum Clearance',
      imperialVal: '30" Minimum Clearance',
      jobsiteNote: 'If a bedroom is in the basement, the window well must extend outward at least 760 mm (30 inches) directly in front of the window. Casement/awning windows that swing outward into the well must not reduce this required escape clearance.'
    },
    {
      id: 'obc_door_main_egress',
      category: 'windows_doors',
      title: 'Main Entrance Door Minimum Width',
      codeRef: 'OBC 9.5.11.1.(1)',
      summary: 'Required minimum dimensions for the principal entrance door of a dwelling unit.',
      metricVal: '810 mm Wide x 1980 mm High',
      imperialVal: '32" Wide x 78" High',
      jobsiteNote: 'While 810 mm (32") is the absolute legal minimum for a main door, modern standard practice dictates using a 914 mm (36") door to accommodate furniture moving and accessibility.'
    },
    {
      id: 'obc_win_fall_protection',
      category: 'windows_doors',
      title: 'Window Fall Protection (Guards)',
      codeRef: 'OBC 9.8.8.1.(4)',
      summary: 'Mandatory fall protection when a window sill is dangerously low to the interior floor but high above the exterior ground.',
      metricVal: 'Guard Required if Sill < 900 mm & Drop > 1800 mm',
      imperialVal: 'Guard Required if Sill < 36" & Drop > 6 ft',
      jobsiteNote: 'If an openable second-story window has a sill lower than 36" above the floor, you must either install a permanent safety guardrail across the lower portion of the window, or install a mechanical stop limiting the window opening to 100 mm (4").'
    },
    {
      id: 'obc_win_safety_glass_doors',
      category: 'windows_doors',
      title: 'Safety Glazing in & Around Doors',
      codeRef: 'OBC 9.6.1.4.(1)',
      summary: 'Requirement for tempered or laminated safety glass in high-traffic hazard locations.',
      metricVal: 'Required in Doors & Sidelights within 900 mm',
      imperialVal: 'Required in Doors & Sidelights within 36"',
      jobsiteNote: 'Any glass physically inside a door, or any glass sidelight located within 900 mm (36") of a door\'s edge, must be safety glass to prevent severe lacerations if someone slips and falls through it.'
    },
		{
      id: 'obc_win_stair_glazing',
      category: 'windows_doors',
      title: 'Safety Glazing Adjacent to Stairs',
      codeRef: 'OBC 9.6.1.4.(2)',
      summary: 'Tempered or laminated safety glass requirement for windows located dangerously close to stair treads and landings.',
      metricVal: 'Tempered if < 900 mm Above Treads',
      imperialVal: 'Tempered if < 36" Above Treads',
      jobsiteNote: 'If someone trips on the stairs, they will fall outward. Any window located alongside a stairway where the bottom edge of the glass is less than 36 inches above the line of the stair nosings MUST be tempered safety glass to prevent severe lacerations.'
    },
    {
      id: 'obc_door_step_down',
      category: 'windows_doors',
      title: 'Exterior Door Maximum Step-Down',
      codeRef: 'OBC 9.8.6.3.(1)',
      summary: 'Maximum allowable vertical drop from an exterior door threshold to the landing or ground outside.',
      metricVal: 'Max 150 mm Drop without Landing',
      imperialVal: 'Max 5-7/8" Drop without Landing',
      jobsiteNote: 'If an exterior door (that is not the main principal entrance) opens and there is no deck or landing outside, the step down to the ground or stairs cannot exceed standard riser height. If it drops 8 or 10 inches, you fail inspection and must build a landing.'
    },
    {
      id: 'obc_win_spatial_separation',
      category: 'windows_doors',
      title: 'Limiting Distance (Windows Near Property Lines)',
      codeRef: 'OBC 9.10.15.4',
      summary: 'Restriction on the percentage of "unprotected openings" (windows/doors) allowed on a wall facing a property line to prevent fire spread.',
      metricVal: '0% Allowed if Distance < 1.2 m',
      imperialVal: '0% Allowed if Distance < 4 ft',
      jobsiteNote: 'You cannot place a window on the side of a house if that wall is closer than 1.2 meters (approx 4 feet) to the property line. The wall must have zero unprotected openings. As you move further away, the allowable percentage of window area increases.'
    },
		{
      id: 'obc_fin_siding_clearance',
      category: 'finishes',
      title: 'Moisture-Susceptible Cladding Clearance to Ground',
      codeRef: 'OBC 9.27.2.4.(1)',
      summary: 'Required vertical distance between the finished exterior grading and the bottom edge of wood, composite, or OSB siding.',
      metricVal: '200 mm Minimum Clearance',
      imperialVal: '8" Minimum Clearance',
      jobsiteNote: 'You cannot run wood or hardboard siding straight down into the dirt or mulch. The foundation concrete must remain exposed for at least 8 inches above the finished grade to prevent splash-rot and termite bridging.'
    },
    {
      id: 'obc_fin_masonry_weeps',
      category: 'finishes',
      title: 'Masonry Veneer Weep Holes',
      codeRef: 'OBC 9.20.13.8',
      summary: 'Maximum horizontal spacing for drainage weep holes at the bottom of a brick or stone veneer wall cavity.',
      metricVal: '800 mm Maximum Spacing',
      imperialVal: '32" Maximum Spacing',
      jobsiteNote: 'Weep holes must be located immediately above the through-wall flashing at the base of the wall and above all windows/doors. Do not let the mortar guys accidentally fill them in—trapped cavity water will destroy the interior wall assembly.'
    },
    {
      id: 'obc_fin_masonry_ties',
      category: 'finishes',
      title: 'Brick Veneer Wall Tie Spacing',
      codeRef: 'OBC Table 9.20.9.5',
      summary: 'Required grid spacing for corrugated or wire metal ties anchoring the masonry veneer back to the wood framing.',
      metricVal: '800 mm Horizontal / 400 mm Vertical Max',
      imperialVal: '32" Horizontal / 16" Vertical Max',
      jobsiteNote: 'Ties must be corrosion-resistant (galvanized) and securely nailed directly into the wall studs, not just the OSB sheathing. Most masons stick to a 16" x 16" or 16" x 24" layout to easily hit stud centers.'
    },
    {
      id: 'obc_fin_shingle_fasteners',
      category: 'finishes',
      title: 'Asphalt Shingle Fastener Nailing',
      codeRef: 'OBC 9.26.7.4.(1)',
      summary: 'Minimum number of nails required per standard 1-meter wide strip shingle.',
      metricVal: 'Minimum 4 Nails (or 6 Staples) per Shingle',
      imperialVal: 'Minimum 4 Nails (or 6 Staples) per Shingle',
      jobsiteNote: 'Nails must be driven straight and flush (not cutting into the shingle mat). They must be placed 25 mm to 40 mm (1" to 1.5") from each end, with the others equally spaced, strictly below the sealant strip.'
    },
    {
      id: 'obc_fin_roof_clearance',
      category: 'finishes',
      title: 'Siding Clearance to Roof Surface',
      codeRef: 'OBC 9.27.2.4.(2)',
      summary: 'Minimum gap required where a vertical wall intersects a sloped roof (e.g., siding coming down a dormer wall onto the main roof).',
      metricVal: '50 mm Minimum Clearance',
      imperialVal: '2" Minimum Clearance',
      jobsiteNote: 'Siding installers notoriously cut wood, fiber-cement, or vinyl siding tight against the roof shingles. This acts like a sponge, wicking water upward and rotting the wall. You must maintain a strict 2-inch gap above the roof surface.'
    },
		{
      id: 'obc_fin_eave_protection',
      category: 'finishes',
      title: 'Roof Eave Protection (Ice Dam Membrane)',
      codeRef: 'OBC 9.26.5.1.(1)',
      summary: 'Required extent of self-adhering waterproof membrane (Ice & Water Shield) at the lower edges of a roof to prevent ice dam leaks.',
      metricVal: 'Min 900 mm Up Roof & 300 mm Past Inner Wall',
      imperialVal: 'Min 36" Up Roof & 12" Past Inner Wall',
      jobsiteNote: 'Rolling a single 3-foot strip of membrane along the eave is often not enough. The membrane must extend up the roof slope far enough to reach at least 300 mm (12") horizontally inside the interior face of the exterior wall.'
    },
    {
      id: 'obc_fin_step_flashing',
      category: 'finishes',
      title: 'Roof-to-Wall Step Flashing Dimensions',
      codeRef: 'OBC 9.26.4.3.(1)',
      summary: 'Minimum sizing for individual pieces of L-shaped step flashing where a sloped roof meets a vertical sidewall.',
      metricVal: '150 mm Up Wall / 75 mm On Roof',
      imperialVal: '6" Up Wall / 3" On Roof',
      jobsiteNote: 'Each individual piece of step flashing must overlap the one below it by at least 50 mm (2 inches). You cannot use a single continuous piece of L-flashing (continuous run) on a shingled roof intersecting a sidewall; it must be stepped.'
    },
    {
      id: 'obc_fin_vinyl_nailing',
      category: 'finishes',
      title: 'Vinyl Siding Fastener Clearance',
      codeRef: 'OBC 9.27.12.2 / Manufacturer Spec',
      summary: 'Requirement for "loose nailing" plastic/vinyl cladding to allow for extreme thermal expansion and contraction.',
      metricVal: 'Leave 1.5 mm Gap (Do Not Drive Flush)',
      imperialVal: 'Leave 1/16" Gap (Do Not Drive Flush)',
      jobsiteNote: 'Never drive nails tight against the vinyl siding nailing hem. Vinyl siding must "hang" on the nails with a 1/16" gap behind the nail head. If you nail it tight, the wall will aggressively buckle and warp the first time the sun hits it.'
    },
		{
      id: 'obc_fin_valley_metal',
      category: 'finishes',
      title: 'Open Valley Metal Flashing Width',
      codeRef: 'OBC 9.26.4.2.(1)',
      summary: 'Minimum required width for corrosion-resistant sheet metal flashing installed in open roof valleys.',
      metricVal: '600 mm Minimum Width',
      imperialVal: '24" Minimum Width',
      jobsiteNote: 'Open metal valleys must be at least 600 mm wide and underlaid with a 900 mm (36") wide strip of Ice & Water Shield. Never drive nails through the center valley trough—nail only along the outer edges of the metal sheet.'
    },
    {
      id: 'obc_fin_siding_penetration',
      category: 'finishes',
      title: 'Siding Fastener Framing Penetration',
      codeRef: 'OBC 9.27.5.1.(1)',
      summary: 'Required depth that exterior cladding fasteners (nails or screws) must bite into solid wood framing.',
      metricVal: '25 mm Minimum into Solid Framing',
      imperialVal: '1" Minimum into Solid Framing',
      jobsiteNote: 'Standard OSB or plywood sheathing does NOT count as adequate structural holding power for heavy wood or fiber-cement siding. Your nails must be long enough to pass through the cladding, strapping, and sheathing to embed at least 1 inch into the wall studs.'
    },
    {
      id: 'obc_fin_roof_nail_depth',
      category: 'finishes',
      title: 'Roof Shingle Fastener Deck Penetration',
      codeRef: 'OBC 9.26.7.4.(2)',
      summary: 'Minimum penetration depth for roofing nails driven into plywood or OSB roof decking.',
      metricVal: 'Penetrate Fully Through OR 12 mm into Wood',
      imperialVal: 'Penetrate Fully Through OR 1/2" into Wood',
      jobsiteNote: 'For standard 3/8" or 7/16" OSB roof decks, shingle nails MUST protrude entirely through the underside of the panels. If applying shingles over thick tongue-and-groove wood plank decking, nails must embed at least 12 mm (1/2") into the wood.'
    },
		{
      id: 'obc_fire_smoke_locations',
      category: 'fire_safety',
      title: 'Smoke Alarm Mandatory Locations',
      codeRef: 'OBC 9.10.19.3.(1)',
      summary: 'Required locations for smoke alarms throughout a residential dwelling unit.',
      metricVal: 'Every Storey + Inside Every Bedroom + Hallway',
      imperialVal: 'Every Storey + Inside Every Bedroom + Hallway',
      jobsiteNote: 'A massive update in recent code cycles: You can no longer just put one alarm in the hallway. You must install a smoke alarm inside EVERY single sleeping room, in the hallway serving those rooms, and on every storey including the basement.'
    },
    {
      id: 'obc_fire_smoke_power',
      category: 'fire_safety',
      title: 'Power Supply & Interconnection',
      codeRef: 'OBC 9.10.19.4 / 9.10.19.5',
      summary: 'Electrical requirements for residential smoke alarms.',
      metricVal: 'Hardwired + Interconnected + Battery Backup',
      imperialVal: 'Hardwired + Interconnected + Battery Backup',
      jobsiteNote: 'Alarms must be permanently wired to a dedicated or mixed 120V circuit with NO disconnect switch. They must be interconnected with 3-wire Romex so that if the basement alarm detects smoke, the master bedroom alarm sounds simultaneously. A 7-day battery backup is legally mandated.'
    },
    {
      id: 'obc_fire_co_placement',
      category: 'fire_safety',
      title: 'Carbon Monoxide (CO) Alarm Placement',
      codeRef: 'OBC 9.33.4.2',
      summary: 'Required placement of CO alarms when a hazard exists (attached garage or fuel-burning appliance).',
      metricVal: 'Adjacent to Each Sleeping Area',
      imperialVal: 'Adjacent to Each Sleeping Area',
      jobsiteNote: 'If the house has an attached garage, a gas fireplace, or a gas furnace/water heater, a CO alarm MUST be installed adjacent to all sleeping areas. Combination Smoke/CO detectors are highly recommended in bedroom hallways to meet both codes.'
    },
    {
      id: 'obc_fire_smoke_silence',
      category: 'fire_safety',
      title: 'Hush Feature (Silencing)',
      codeRef: 'OBC 9.10.19.6.(1)',
      summary: 'Requirement for a manual temporary override to silence nuisance alarms.',
      metricVal: '10-Minute Maximum Manual Hush Button',
      imperialVal: '10-Minute Maximum Manual Hush Button',
      jobsiteNote: 'To prevent occupants from ripping the alarms off the ceiling when burning toast, the code requires alarms to have a manual hush button that silences the unit for no more than 10 minutes before automatically resetting.'
    },
		{
      id: 'obc_fire_suite_separation',
      category: 'fire_safety',
      title: 'Secondary Suite Fire Separation',
      codeRef: 'OBC 9.10.9.14 / 9.10.8',
      summary: 'Required fire-resistance rating between a main dwelling unit and a legal secondary suite (basement apartment).',
      metricVal: '30-Minute Fire Separation (e.g., 15.9 mm Type X)',
      imperialVal: '30-Minute Fire Separation (e.g., 5/8" Type X)',
      jobsiteNote: 'A massive inspection fail point: Standard 1/2" drywall does not meet the 30-minute requirement for a legal basement suite ceiling. You must use 5/8" Type X drywall. (Exception: A 15-minute rating is permitted in existing houses if interconnected smoke alarms cover both suites).'
    },
    {
      id: 'obc_fire_garage_fumes',
      category: 'fire_safety',
      title: 'Attached Garage Gas-Tight Barrier',
      codeRef: 'OBC 9.10.9.16.(4)',
      summary: 'Requirement to seal the shared wall/ceiling between an attached garage and the living space to prevent exhaust fumes from entering the home.',
      metricVal: 'Continuous Gas-Tight Barrier (Taped Drywall)',
      imperialVal: 'Continuous Gas-Tight Barrier (Taped Drywall)',
      jobsiteNote: 'While a standard single-family home doesn\'t require a strict fire-resistance rating on the garage wall, it MUST be an airtight fume barrier. This usually means installing 1/2" drywall and taping/mudding every single joint and fastener hole to block carbon monoxide.'
    },
    {
      id: 'obc_fire_dead_air_corner',
      category: 'fire_safety',
      title: 'Smoke Alarm "Dead Air" Space Clearance',
      codeRef: 'OBC 9.10.19.3 / ULC-S553',
      summary: 'Prohibition against installing smoke alarms directly in the 90-degree corner where the ceiling meets the wall.',
      metricVal: 'Minimum 100 mm from Corner',
      imperialVal: 'Minimum 4" from Corner',
      jobsiteNote: 'When a fire burns, hot smoke rises and curls, leaving a pocket of "dead air" right in the sharp corner of the room. If you mount a smoke alarm tight into the corner, the smoke will actually bypass it. It must be kept at least 4 inches away from the wall.'
    },
		{
      id: 'obc_fire_chimney_clearance',
      category: 'fire_safety',
      title: 'Masonry Chimney Clearance to Combustibles',
      codeRef: 'OBC 9.21.5.1.(1)',
      summary: 'Required airspace between a masonry chimney and combustible wood framing or floor joists.',
      metricVal: '50 mm Minimum Airspace',
      imperialVal: '2" Minimum Airspace',
      jobsiteNote: 'You cannot frame floor joists or wall studs tight against a brick chimney. You must maintain a strict 2-inch empty airspace. Do not pack this gap with standard pink fiberglass insulation; it must remain an empty air space or be filled with non-combustible mineral wool.'
    },
    {
      id: 'obc_fire_penetration_seal',
      category: 'fire_safety',
      title: 'Fire Separation Penetration Sealing',
      codeRef: 'OBC 9.10.9.6.(1)',
      summary: 'Sealing requirements for plumbing, electrical, and HVAC ducts passing through a fire-rated wall or ceiling (e.g., a basement suite separation).',
      metricVal: 'Tightly Fitted and Fire-Stopped',
      imperialVal: 'Tightly Fitted and Fire-Stopped',
      jobsiteNote: 'If a PVC drain pipe penetrates a fire-rated basement ceiling, it is an instant inspection failure unless it has an approved intumescent fire collar or is heavily sealed with rated red fire-caulking (like 3M Fire Barrier) to prevent flames from melting the pipe and traveling up the chase.'
    },
    {
      id: 'obc_fire_horizontal_block',
      category: 'fire_safety',
      title: 'Fireblocking at Drop Ceilings & Bulkheads',
      codeRef: 'OBC 9.10.16.1 / 9.10.16.2',
      summary: 'Requirement to physically block hidden wall cavities at floor/ceiling intersections.',
      metricVal: 'Required at Floor/Ceiling Intersections',
      imperialVal: 'Required at Floor/Ceiling Intersections',
      jobsiteNote: 'If you build a decorative dropped bulkhead over kitchen cabinets, you must install solid wood fireblocking horizontally at the ceiling line. Otherwise, a fire inside the wall cavity can draft freely into the dropped bulkhead and across the ceiling.'
    },
		{
      id: 'obc_hvac_bath_exhaust',
      category: 'hvac',
      title: 'Bathroom Mechanical Exhaust Capacity',
      codeRef: 'OBC 9.32.3.4 / 9.32.3.5',
      summary: 'Minimum required airflow capacity for exhaust fans installed in bathrooms or water closet rooms.',
      metricVal: '25 L/s Intermittent or 10 L/s Continuous',
      imperialVal: '50 CFM Intermittent or 20 CFM Continuous',
      jobsiteNote: 'Every bathroom must have mechanical exhaust vented directly to the exterior. Even if there is an operable window, an exhaust fan is still legally required under modern OBC.'
    },
    {
      id: 'obc_hvac_kitchen_exhaust',
      category: 'hvac',
      title: 'Kitchen Range Hood Exhaust Capacity',
      codeRef: 'OBC 9.32.3.4 / 9.32.3.5',
      summary: 'Minimum required airflow capacity for mechanical exhaust serving a residential kitchen.',
      metricVal: '50 L/s Intermittent',
      imperialVal: '100 CFM Intermittent',
      jobsiteNote: 'Range hoods must vent strictly to the outdoors. "Ductless" recirculating range hoods with charcoal filters are only permitted if a separate, dedicated 100 CFM exhaust fan is installed elsewhere in the kitchen ceiling.'
    },
    {
      id: 'obc_hvac_makeup_air',
      category: 'hvac',
      title: 'Make-Up Air for Large Exhaust Fans',
      codeRef: 'OBC 9.32.3.8',
      summary: 'Requirement to introduce fresh exterior air to replace air blown out by high-capacity exhaust systems to prevent house depressurization.',
      metricVal: 'Required if Exhaust Exceeds System Threshold',
      imperialVal: 'Required if Exhaust Exceeds System Threshold',
      jobsiteNote: 'If you install a massive 600 CFM custom range hood and the house has a naturally aspirated gas furnace or water heater, you MUST install a powered, interlocked make-up air damper. Otherwise, the hood will suck deadly carbon monoxide backwards down the furnace chimney.'
    },
    {
      id: 'obc_hvac_dryer_screws',
      category: 'hvac',
      title: 'Dryer Exhaust Fasteners',
      codeRef: 'OBC 9.32.1.3 / Part 6',
      summary: 'Prohibition against using protruding mechanical fasteners to join lengths of clothes dryer exhaust ducting.',
      metricVal: 'Zero Screws Permitted (Foil Tape Only)',
      imperialVal: 'Zero Screws Permitted (Foil Tape Only)',
      jobsiteNote: 'You absolutely cannot use standard sheet metal screws to connect dryer vent pipes. Lint will catch on the sharp screw threads protruding inside the pipe, eventually causing a severe fire hazard. Joints must be secured with UL-rated aluminum foil tape only.'
    },
    {
      id: 'obc_hvac_exhaust_clearance',
      category: 'hvac',
      title: 'Exhaust Termination Clearance',
      codeRef: 'OBC 9.32.3.12 / 9.32.3.13',
      summary: 'Minimum distance required between an exterior exhaust vent hood and any fresh air intake or property line.',
      metricVal: '900 mm from Intakes / 450 mm from Property Line',
      imperialVal: '36" from Intakes / 18" from Property Line',
      jobsiteNote: 'Do not mount a bathroom exhaust or dryer vent right next to the fresh-air intake for the furnace/HRV. It must be at least 3 feet away to prevent sucking the exhausted moisture/lint right back into the house.'
    },
		{
      id: 'obc_hvac_stud_plenum',
      category: 'hvac',
      title: 'Framing Cavities as Return Plenums',
      codeRef: 'OBC 9.32.3.11.(1) / 9.33.6.4',
      summary: 'Restrictions on using hollow wood stud walls or floor joist bays as cold-air return ducts.',
      metricVal: 'Permitted for Returns ONLY (Never Supply)',
      imperialVal: 'Permitted for Returns ONLY (Never Supply)',
      jobsiteNote: 'You can use panned floor joists and hollow wall studs for cold-air return runs, provided they are thoroughly sealed. However, you can NEVER use a wood framing cavity as a supply duct for heated air, as the high temperatures dry out the wood and create a massive fire hazard.'
    },
    {
      id: 'obc_hvac_fireplace_makeup',
      category: 'hvac',
      title: 'Make-Up Air for Solid-Fuel Fireplaces',
      codeRef: 'OBC 9.22.1.4 / 9.32.3.8',
      summary: 'Mandatory dedicated combustion air supply for wood-burning fireplaces.',
      metricVal: 'Direct Exterior Air Supply Required',
      imperialVal: 'Direct Exterior Air Supply Required',
      jobsiteNote: 'Modern houses are too airtight for traditional fireplaces. You cannot just build a masonry wood-burning fireplace without installing a dedicated, dampered 4-inch (minimum) fresh air intake duct pulling outdoor air directly into the firebox or the room.'
    },
    {
      id: 'obc_hvac_range_duct',
      category: 'hvac',
      title: 'Kitchen Exhaust Duct Material',
      codeRef: 'OBC 9.32.1.3 / Part 6',
      summary: 'Strict material requirement for exhaust ducts serving kitchen range hoods.',
      metricVal: 'Galvanized Steel, Stainless, or Copper (No Aluminum Flex)',
      imperialVal: 'Galvanized Steel, Stainless, or Copper (No Aluminum Flex)',
      jobsiteNote: 'A grease fire starting on the stove will instantly melt a plastic or thin aluminum flex duct and spread into the attic. Range hood ducts MUST be rigid, smooth-walled galvanized steel, copper, or stainless steel. Flexible aluminum ducting is illegal here.'
    },
		{
      id: 'obc_hvac_fan_noise',
      category: 'hvac',
      title: 'Principal Exhaust Fan Maximum Noise (Sones)',
      codeRef: 'OBC 9.32.3.5.(5)',
      summary: 'Strict noise limitation for the principal exhaust fan required to run continuously for baseline ventilation.',
      metricVal: 'Maximum 1.0 Sone Rating',
      imperialVal: 'Maximum 1.0 Sone Rating',
      jobsiteNote: 'You cannot install a cheap $20 bathroom fan to act as your principal continuous ventilation fan. Because it is expected to run 24/7, the OBC legally limits its noise output to 1.0 sone or less. If the inspector sees a 3-sone fan wired to the principal switch, you will fail.'
    },
    {
      id: 'obc_hvac_hood_clearance',
      category: 'hvac',
      title: 'Range Hood / Combustible Cabinet Clearance',
      codeRef: 'OBC 9.10.22.2 / 9.10.22.3',
      summary: 'Required vertical distance between the cooking surface and the combustible cabinets or microwave located directly above it.',
      metricVal: '750 mm (or 600 mm w/ metal shielding)',
      imperialVal: '30" (or 24" w/ metal shielding)',
      jobsiteNote: 'A standard gas or electric stove requires a full 30-inch clearance to combustible wood cabinets above it. If you install a microwave/hood combo that hangs lower, you can drop to 24 inches ONLY if the underside of the cabinet/hood is fully shielded by sheet metal.'
    },
    {
      id: 'obc_hvac_dryer_independent',
      category: 'hvac',
      title: 'Dryer Exhaust Independence',
      codeRef: 'OBC 9.32.1.3.(2)',
      summary: 'Requirement for laundry exhaust to remain completely isolated from other mechanical venting.',
      metricVal: 'Must Be Independent of All Other Exhaust',
      imperialVal: 'Must Be Independent of All Other Exhaust',
      jobsiteNote: 'You can never combine a bathroom exhaust fan duct and a dryer exhaust duct into a single Y-fitting to exit the house through one hood. The dryer vent must run entirely independently to its own dedicated exterior termination.'
    },
		{
      id: 'obc_plumb_nail_plate',
      category: 'plumbing',
      title: 'Plumbing Pipe Nail Protection',
      codeRef: 'OBC 7.3.5.7.(1)',
      summary: 'Requirement for heavy-gauge steel shield plates when pipes run dangerously close to the face of a wall stud.',
      metricVal: 'Steel Plate if within 50 mm of edge',
      imperialVal: 'Steel Plate if within 2" of edge',
      jobsiteNote: 'If a plumber drills a hole for a PVC drain or PEX water line and the edge of the pipe is less than 50 mm (2 inches) from the face of the wood stud, you MUST hammer on a steel nail plate. This stops the drywaller from sending a screw directly into the water line.'
    },
    {
      id: 'obc_plumb_drain_slope',
      category: 'plumbing',
      title: 'Minimum Drainage Pipe Slope',
      codeRef: 'OBC 7.4.8.1.(1)',
      summary: 'Required gravity fall (slope) for horizontal sanitary drainage pipes.',
      metricVal: '1 in 50 (2%) for pipes ≤ 75 mm',
      imperialVal: '1/4" per foot (2%) for pipes ≤ 3"',
      jobsiteNote: 'Horizontal drain pipes 3 inches or smaller (sinks, showers, standard toilets) must slope exactly 1/4 inch per foot. If you slope it too flat, the water won\'t drain. If you slope it too steep, the water outruns the solids, leaving waste behind to clog the pipe.'
    },
    {
      id: 'obc_plumb_toilet_clearance',
      category: 'plumbing',
      title: 'Toilet (Water Closet) Clearances',
      codeRef: 'OBC 9.5 / Best Practice',
      summary: 'Minimum required elbow room and legroom around a residential toilet.',
      metricVal: '380 mm to Centreline / 530 mm in Front',
      imperialVal: '15" to Centreline / 21" in Front',
      jobsiteNote: 'While strict residential Part 9 code is surprisingly vague on non-barrier-free toilets, every Ontario inspector and designer enforces the 15-inch minimum from the center of the toilet drain flange to the nearest side wall, vanity, or tub, and 21 inches of clear space in front of the bowl.'
    },
    {
      id: 'obc_plumb_scald_protection',
      category: 'plumbing',
      title: 'Maximum Shower Water Temperature',
      codeRef: 'OBC 7.6.5.1.(1)',
      summary: 'Mandatory anti-scald mixing valves required for all residential shower and bathtub fixtures.',
      metricVal: 'Maximum 49°C at Fixture',
      imperialVal: 'Maximum 120°F at Fixture',
      jobsiteNote: 'You cannot just pipe straight hot water from the tank to the shower head. The shower rough-in valve MUST be a pressure-balancing or thermostatic mixing valve internally calibrated to stop the water temperature from ever exceeding 49°C (120°F) to prevent severe scalding.'
    },
    {
      id: 'obc_plumb_tp_valve',
      category: 'plumbing',
      title: 'Water Heater T&P Relief Discharge',
      codeRef: 'OBC 7.6.2.3',
      summary: 'Safety piping requirements for the Temperature & Pressure (T&P) relief valve on a hot water tank.',
      metricVal: 'Pipe Must Discharge ≤ 300 mm from Floor',
      imperialVal: 'Pipe Must Discharge ≤ 12" from Floor',
      jobsiteNote: 'If the water heater overheats, the brass T&P valve will blow off boiling steam and water. You must attach a hard copper or CPVC pipe to this valve that runs straight down, terminating no more than 12 inches above the floor or floor drain. Never thread or plug the end of this pipe.'
    },
		{
      id: 'obc_plumb_aav_height',
      category: 'plumbing',
      title: 'Air Admittance Valve (AAV) Clearance',
      codeRef: 'OBC 7.5.9.2.(1)',
      summary: 'Required vertical clearance when using an AAV (cheater vent) instead of a traditional roof vent.',
      metricVal: 'Min 100 mm Above Fixture Drain',
      imperialVal: 'Min 4" Above Fixture Drain',
      jobsiteNote: 'You cannot bury an AAV low inside the vanity cabinet. The breathing element of the valve MUST sit at least 100 mm (4 inches) higher than the horizontal drain pipe it is venting. It must also remain permanently accessible (never buried behind drywall).'
    },
    {
      id: 'obc_plumb_backwater_valve',
      category: 'plumbing',
      title: 'Basement Backwater Valve',
      codeRef: 'OBC 7.4.6.4.(3)',
      summary: 'Mandatory flood protection for plumbing fixtures located in basements.',
      metricVal: 'Required if Fixtures are Below Street Level',
      imperialVal: 'Required if Fixtures are Below Street Level',
      jobsiteNote: 'If a basement has a toilet, shower, or floor drain that sits at an elevation physically lower than the municipal sewer line in the street, you MUST install a normally-open backwater valve to prevent city sewage from backing up into the house during a flood.'
    },
    {
      id: 'obc_plumb_thermal_expansion',
      category: 'plumbing',
      title: 'Thermal Expansion Tanks (Closed Systems)',
      codeRef: 'OBC 7.6.3.4',
      summary: 'Requirement to manage pressure spikes caused by water heaters in systems with a backflow preventer.',
      metricVal: 'Expansion Tank Required on Cold Water Line',
      imperialVal: 'Expansion Tank Required on Cold Water Line',
      jobsiteNote: 'Modern municipal water meters now include built-in check valves (creating a "closed system"). When your water heater kicks on, the expanding water has nowhere to go, spiking the pipe pressure. You must install a small thermal expansion tank on the cold water feed to absorb this pressure.'
    },
		{
      id: 'obc_plumb_washer_standpipe',
      category: 'plumbing',
      title: 'Clothes Washer Standpipe Height',
      codeRef: 'OBC 7.4.5.1.(3)',
      summary: 'Minimum required length of the vertical standpipe extending above the P-trap for a washing machine.',
      metricVal: 'Minimum 600 mm Above Trap Weir',
      imperialVal: 'Minimum 24" Above Trap Weir',
      jobsiteNote: 'Modern washing machines pump out water at massive velocities. If you cut the vertical standpipe too short (e.g., 12 inches), the pressure will cause suds and water to spew out the top of the pipe all over the laundry room wall during the drain cycle.'
    },
    {
      id: 'obc_plumb_vertical_drop',
      category: 'plumbing',
      title: 'Maximum Fixture Vertical Drop',
      codeRef: 'OBC 7.4.5.1.(1)',
      summary: 'Maximum allowable vertical distance a drain pipe can drop from a fixture before hitting the P-trap.',
      metricVal: 'Maximum 1200 mm Drop',
      imperialVal: 'Maximum 48" Drop',
      jobsiteNote: 'You cannot run a straight pipe from a main-floor kitchen sink all the way down into the basement before adding the P-trap. The vertical drop creates so much water velocity that it will completely siphon the trap dry, leaving the house open to sewer gas.'
    },
    {
      id: 'obc_plumb_sump_cover',
      category: 'plumbing',
      title: 'Sump Pit Gas-Tight Cover',
      codeRef: 'OBC 7.4.6.5.(2)',
      summary: 'Requirement for sealing the lid of a subsoil drainage sump pit located inside a dwelling.',
      metricVal: 'Airtight / Gas-Tight Cover Required',
      imperialVal: 'Airtight / Gas-Tight Cover Required',
      jobsiteNote: 'A basement sump pit cannot just have a loose piece of plywood thrown over it. It must have a mechanically fastened, gasketed cover. This prevents severe moisture dumping into the basement and blocks carcinogenic Radon gas from entering the living space.'
    },
		{
      id: 'obc_elec_stair_switch',
      category: 'electrical',
      title: 'Stairway Lighting 3-Way Switches',
      codeRef: 'OBC 9.34.2.3.(2)',
      summary: 'Requirement for multi-point lighting control on interior staircases.',
      metricVal: '3-Way Switches if ≥ 4 Risers',
      imperialVal: '3-Way Switches if ≥ 4 Risers',
      jobsiteNote: 'If an interior staircase has 4 or more risers (steps), you cannot just have a single switch at the bottom. You MUST install a 3-way switch at the head and foot of the stairs. (Exception: unfinished basements not leading outside).'
    },
    {
      id: 'obc_elec_wall_spacing',
      category: 'electrical',
      title: 'Living Area Receptacle Spacing',
      codeRef: 'OESC 26-712(a)',
      summary: 'Maximum distance between wall outlets in general living areas to prevent extension cord use.',
      metricVal: 'Max 3.6 m Spacing (1.8 m to nearest)',
      imperialVal: 'Max 12 ft Spacing (6 ft to nearest)',
      jobsiteNote: 'No point along the floor line of any usable wall space can be more than 1.8m (6 feet) from an outlet. This translates to placing an outlet at least every 3.6m (12 feet). Any wall space 900 mm (3 feet) or wider requires its own outlet.'
    },
    {
      id: 'obc_elec_kitchen_counter',
      category: 'electrical',
      title: 'Kitchen Counter Receptacles',
      codeRef: 'OESC 26-712(d)',
      summary: 'Required spacing and power capacity for kitchen countertop outlets.',
      metricVal: 'Max 1.8 m Spacing (900 mm to nearest)',
      imperialVal: 'Max 72" Spacing (36" to nearest)',
      jobsiteNote: 'Canadian electrical code requires no point along a kitchen counter to be more than 900 mm (36") from a receptacle, meaning maximum spacing is 1.8 m (72"). They must be 20-amp T-slot receptacles or 15-amp split receptacles, and GFCI protected if within 1.5m of the sink.'
    },
    {
      id: 'obc_elec_bath_receptacle',
      category: 'electrical',
      title: 'Bathroom Sink Receptacle',
      codeRef: 'OESC 26-710(f)',
      summary: 'Requirement for a dedicated GFCI outlet near bathroom wash basins.',
      metricVal: 'Within 1.0 m of Sink / GFCI Required',
      imperialVal: 'Within 39" of Sink / GFCI Required',
      jobsiteNote: 'Every bathroom vanity must have a GFCI receptacle located within 1 meter (approx 39") of the wash basin. It cannot be located directly behind the sink bowl or inside the shower enclosure.'
    },
    {
      id: 'obc_elec_afci',
      category: 'electrical',
      title: 'AFCI Protection (Arc-Fault)',
      codeRef: 'OESC 26-722',
      summary: 'Arc-Fault Circuit Interrupter requirements for residential branch circuits.',
      metricVal: 'Required for Most Living Areas',
      imperialVal: 'Required for Most Living Areas',
      jobsiteNote: 'Virtually every standard 15A or 20A receptacle circuit in the house (bedrooms, living rooms, dining rooms) must be AFCI protected at the breaker to prevent electrical fires. (Exceptions typically include kitchen fridge, sump pump, and bathroom GFCIs).'
    },
		{
      id: 'obc_elec_sump_pump',
      category: 'electrical',
      title: 'Sump Pump Dedicated Circuit & AFCI Exemption',
      codeRef: 'OESC 26-704 / 26-722 (Exception)',
      summary: 'Electrical supply requirements for basement sump pumps to prevent nuisance tripping and flooding.',
      metricVal: 'Dedicated Single Receptacle (AFCI Exempt)',
      imperialVal: 'Dedicated Single Receptacle (AFCI Exempt)',
      jobsiteNote: 'To prevent an Arc-Fault (AFCI) breaker nuisance trip from shutting off your sump pump during a storm and flooding the basement, Ontario code explicitly allows you to omit AFCI protection IF the sump pump is plugged into a dedicated single (non-duplex) receptacle on its own separate branch circuit.'
    },
    {
      id: 'obc_elec_garage_ev',
      category: 'electrical',
      title: 'Garage EV Supply Rough-In',
      codeRef: 'OESC 8-200 / OBC 9.34.3',
      summary: 'Mandatory electrical capacity and conduit rough-in for Electric Vehicle supply equipment in new residential garages.',
      metricVal: '200A Service + Dedicated EV Conduit/Receptacle',
      imperialVal: '200A Service + Dedicated EV Conduit/Receptacle',
      jobsiteNote: 'In new single-family residential builds, the electrical service panel must be sized (typically 200A minimum) to support EV charging, and a dedicated heavy-duty rough-in (conduit or 40A/50A 240V wiring terminating in a junction box or NEMA 14-50R) must be installed inside the garage.'
    },
    {
      id: 'obc_elec_bath_exhaust_wiring',
      category: 'electrical',
      title: 'Principal Exhaust Fan Control Wiring',
      codeRef: 'OBC 9.32.3.5 / OESC',
      summary: 'Mandatory wall switch override and wiring configuration for continuous bathroom/principal ventilation fans.',
      metricVal: 'Master Dehumidistat or Manual Override Switch',
      imperialVal: 'Master Dehumidistat or Manual Override Switch',
      jobsiteNote: 'If a bathroom exhaust fan serves as the home\'s primary continuous mechanical ventilation, its manual wall switch cannot simply turn the fan off permanently. It must be wired to a central dehumidistat or multi-speed timer switch clearly labeled "PRINCIPAL VENTILATION" so baseline airflow is maintained.'
    },
		{
      id: 'obc_elec_romex_stapling',
      category: 'electrical',
      title: 'NMD90 (Romex) Cable Stapling & Support',
      codeRef: 'OESC 12-510(1)',
      summary: 'Mandatory spacing for staples supporting non-metallic sheathed cable along wood framing.',
      metricVal: 'Within 300 mm of Box + Every 1.5 m',
      imperialVal: 'Within 12" of Box + Every 5 ft',
      jobsiteNote: 'Electricians must staple the wire within 12 inches of every plastic device box to secure the connection. From there, the cable must be stapled flat along the center of the stud at least every 5 feet. A loose, drooping cable will fail rough-in inspection.'
    },
    {
      id: 'obc_elec_concealed_boxes',
      category: 'electrical',
      title: 'Concealed Junction Boxes (Buried Splices)',
      codeRef: 'OESC 12-3014',
      summary: 'Strict prohibition against burying electrical connections behind finished wall surfaces.',
      metricVal: 'All Boxes Must Remain Accessible',
      imperialVal: 'All Boxes Must Remain Accessible',
      jobsiteNote: 'You can NEVER drywall over a junction box. Even if you "abandon" a circuit but the wires remain live, the splice must exist inside an approved box with a blank cover plate that sits flush with the finished drywall, permanently accessible to future homeowners.'
    },
    {
      id: 'obc_elec_tamper_resistant',
      category: 'electrical',
      title: 'Tamper-Resistant (TR) Receptacles',
      codeRef: 'OESC 26-724(g)',
      summary: 'Requirement for child-safe shutters inside electrical receptacles throughout the home.',
      metricVal: 'Required for all 15A and 20A Outlets',
      imperialVal: 'Required for all 15A and 20A Outlets',
      jobsiteNote: 'Virtually every standard wall outlet installed in a residential dwelling must be marked with a "TR" (Tamper-Resistant) stamp on the face. (Exceptions are very narrow, such as outlets located more than 2 meters / 6.5 feet above the floor).'
    },
		{
      id: 'obc_deck_frost_footing',
      category: 'decks',
      title: 'Footing Depth (Frost Protection)',
      codeRef: 'OBC 9.12.2.2',
      summary: 'Required depth for deck foundation piers to prevent frost heave from lifting the structure.',
      metricVal: '1.2 m Minimum Below Grade',
      imperialVal: '48" Minimum Below Grade',
      jobsiteNote: 'Decks attached to a house via a ledger board MUST have footings extending below the local frost line (typically 48 inches in most of Ontario). Only freestanding/floating decks under 55 m² and less than 600 mm (24") above grade are exempt.'
    },
    {
      id: 'obc_handrail_graspability',
      category: 'stairs',
      title: 'Handrail Graspability Profile',
      codeRef: 'OBC 9.8.7.5',
      summary: 'Ergonomic shape requirements ensuring a handrail can be firmly gripped during a slip or fall.',
      metricVal: '30 mm to 43 mm Circular Diameter',
      imperialVal: '1-1/4" to 1-11/16" Circular Diameter',
      jobsiteNote: 'A flat 2x4 or 2x6 cap on a deck stair railing is an instant inspection fail. If the profile is non-circular, it must have designated finger recesses on both sides allowing a user to curl their thumb and fingers underneath the grip.'
    },
    {
      id: 'obc_handrail_continuity',
      category: 'stairs',
      title: 'Handrail Continuity',
      codeRef: 'OBC 9.8.7.2',
      summary: 'Requirement for continuous user support throughout the entire length of a stairway.',
      metricVal: 'Continuous over entire flight',
      imperialVal: 'Continuous over entire flight',
      jobsiteNote: 'At least one handrail must remain continuous without interruption from the top riser to the bottom riser. The only legally permitted interruption is a structural newel post where the stairs physically change direction at a landing.'
    },
    {
      id: 'obc_deck_beam_lamination',
      category: 'decks',
      title: 'Built-Up Beam Nailing Pattern',
      codeRef: 'OBC 9.23.8.3',
      summary: 'Mandatory fastening schedule for laminating multiple 2-by framing members into a structural drop beam.',
      metricVal: '2 Rows of Nails @ 450 mm O.C.',
      imperialVal: '2 Rows of Nails @ 18" O.C.',
      jobsiteNote: 'When building a 2-ply or 3-ply deck beam (e.g., laminated 2x10s), the plies must be nailed together with two rows of 89 mm (3-1/2") nails spaced no more than 18 inches apart, with nails driven from alternating sides of the beam.'
    },
    {
      id: 'obc_stair_max_flight',
      category: 'stairs',
      title: 'Maximum Flight Height (Vertical Rise)',
      codeRef: 'OBC 9.8.3.3',
      summary: 'Maximum allowed vertical distance a set of stairs can climb before a resting landing is legally required.',
      metricVal: '3.7 Meters Max',
      imperialVal: '12\' 1-5/8" Max',
      jobsiteNote: 'You cannot build a single, unbroken staircase that climbs two full stories to a high balcony. If the vertical drop exceeds 3.7 meters, you must physically break the flight with an intermediate level landing platform.'
    },
    {
      id: 'obc_stair_winder_tread',
      category: 'stairs',
      title: 'Winder Tread Minimum Run',
      codeRef: 'OBC 9.8.4.3 / 9.8.4.4',
      summary: 'Required run depth at the extreme narrow end of a winder or angled stair tread to prevent slipping.',
      metricVal: '150 mm Minimum at Narrow End',
      imperialVal: '6" Minimum at Narrow End',
      jobsiteNote: 'Winder stairs cannot taper down to a sharp point. The tread must provide at least 6 inches of horizontal run at the absolute narrowest point where it meets the interior wall or center newel post.'
    },
		{
      id: 'obc_mas_chimney_height',
      category: 'masonry',
      title: 'Chimney Termination Height (3-2-10 Rule)',
      codeRef: 'OBC 9.21.4.4.(1)',
      summary: 'Required vertical height above roof intersection and adjacent roof structures to prevent draft turbulence and fire hazards.',
      metricVal: 'Min 900 mm Above Roof / 600 mm Higher than Roof within 3 m',
      imperialVal: 'Min 3 ft Above Roof / 2 ft Higher than Roof within 10 ft',
      jobsiteNote: 'The universal "3-2-10 Rule": The flue must terminate at least 3 feet above the highest point where it exits the roof, AND at least 2 feet higher than any roof surface or ridge within a 10-foot horizontal radius.'
    },
    {
      id: 'obc_mas_mortar_joints',
      category: 'masonry',
      title: 'Mortar Joint Thickness & Tolerances',
      codeRef: 'OBC 9.20.4.1.(1)',
      summary: 'Specified thickness for mortar bed and head joints in unit masonry construction.',
      metricVal: '10 mm Average (Max 12 mm)',
      imperialVal: '3/8" Average (Max 1/2")',
      jobsiteNote: 'Excessively thick mortar joints weaken the structural wall capacity. All exposed joints must be tooled (concave or V-joint) before the mortar fully sets to compress the paste and shed water.'
    },
    {
      id: 'obc_mas_cold_weather',
      category: 'masonry',
      title: 'Cold Weather Masonry Installation',
      codeRef: 'OBC 9.20.14.1.(1)',
      summary: 'Temperature requirements for laying bricks, blocks, or stone to prevent mortar freezing before hydration.',
      metricVal: 'Maintain Mortar & Units Above 5°C (41°F)',
      imperialVal: 'Maintain Mortar & Units Above 41°F',
      jobsiteNote: 'If the ambient temperature drops below 5°C, you must heat the mixing water and sand, and tarp/heat the newly laid wall to keep it above 5°C for at least 48 hours. Frozen mortar turns crumbly and has zero bond strength.'
    },
    {
      id: 'obc_mas_beam_bearing',
      category: 'masonry',
      title: 'Solid Masonry Bearing Under Beams',
      codeRef: 'OBC 9.20.8.1.(1)',
      summary: 'Requirement for solid masonry compressive backing beneath structural floor beams or lintels.',
      metricVal: 'Top Course Under Beam Must Be Solid',
      imperialVal: 'Top Course Under Beam Must Be Solid',
      jobsiteNote: 'Where a heavy steel I-beam or drop beam rests on a hollow concrete block wall, at least the top course directly beneath the bearing plate must be solid masonry units or hollow blocks completely grouted solid with concrete.'
    },
    {
      id: 'obc_env_radon_roughin',
      category: 'envelope',
      title: 'Sub-Slab Radon Gas Rough-In Pipe',
      codeRef: 'OBC SB-9 / 9.13.4.3',
      summary: 'Mandatory soil gas extraction rough-in installed beneath concrete basement floors.',
      metricVal: '100 mm Pipe Capped Above Floor Slab',
      imperialVal: '4" Pipe Capped Above Floor Slab',
      jobsiteNote: 'A 4-inch PVC or ABS pipe must penetrate vertical through the basement floor poly and extend into the clean crushed stone drainage layer below. The top must be capped and clearly labeled "RADON ROUGH-IN" in case active fan extraction is needed later.'
    },
    {
      id: 'obc_fnd_garage_slope',
      category: 'foundations',
      title: 'Garage Floor Drainage Slope',
      codeRef: 'OBC 9.35.2.2.(2)',
      summary: 'Required gravity pitch on poured concrete garage floors to manage melting snow, slush, and vehicle drippings.',
      metricVal: 'Slope Toward Exterior Entry or Floor Drain',
      imperialVal: 'Slope Toward Exterior Entry or Floor Drain (~1/4" per foot)',
      jobsiteNote: 'Pouring a perfectly flat garage floor will cause winter road salt and slush to pool against the interior drywall framing. Always slope the slab outward toward the main garage overhead door opening.'
    },
		{
      id: 'obc_mas_lintel_bearing',
      category: 'masonry',
      title: 'Steel Angle Lintel Bearing',
      codeRef: 'OBC 9.20.8.4.(1)',
      summary: 'Required solid masonry bearing length at each end of a steel angle supporting brick veneer over a window or door.',
      metricVal: '150 mm Minimum Bearing on Each Side',
      imperialVal: '6" Minimum Bearing on Each Side',
      jobsiteNote: 'A massive inspection fail point: The steel angle carrying the brick above a garage door or wide window must extend a full 6 inches past the rough opening on both sides to distribute the immense weight without crushing the brick below.'
    },
    {
      id: 'obc_mas_tie_fastening',
      category: 'masonry',
      title: 'Veneer Tie Fastener Embedment',
      codeRef: 'OBC 9.20.9.4.(2)',
      summary: 'Requirements for nailing or screwing metal brick ties back to the wood-framed wall.',
      metricVal: 'Minimum 30 mm Penetration into Solid Wood Studs',
      imperialVal: 'Minimum 1-1/4" Penetration into Solid Wood Studs',
      jobsiteNote: 'You CANNOT nail brick ties just into the 7/16" OSB sheathing. They have zero pull-out strength in OSB. The nails or screws must be driven directly into the center of the vertical 2x4 or 2x6 wall studs, penetrating at least 1-1/4 inches.'
    },
    {
      id: 'obc_mas_through_flashing',
      category: 'masonry',
      title: 'Through-Wall Flashing Placement',
      codeRef: 'OBC 9.20.13.3',
      summary: 'Mandatory locations for installing waterproof membrane flashing completely through the masonry cavity.',
      metricVal: 'Required at Base of Wall & Above Openings',
      imperialVal: 'Required at Base of Wall & Above Openings',
      jobsiteNote: 'Through-wall flashing (like Blueskin or heavy PVC) must be installed at the very bottom of the masonry wall and directly above every window and door lintel. It must extend up behind the housewrap to catch cavity water and direct it out the weep holes.'
    },
    {
      id: 'obc_mas_unsupported_height',
      category: 'masonry',
      title: 'Max Unsupported Height (Thickness Ratio)',
      codeRef: 'OBC 9.20.10.1.(1)',
      summary: 'Structural limitation on how tall a masonry wall can be built before it requires horizontal lateral bracing.',
      metricVal: 'Height Max = 20x Wall Thickness',
      imperialVal: 'Height Max = 20x Wall Thickness',
      jobsiteNote: 'A standard structural concrete block foundation wall that is 200 mm (8") thick cannot exceed 4 meters (approx 13 feet) in height without intersecting brace walls, pilasters, or a concrete floor diaphragm locking it into place.'
    },
		{
      id: 'obc_mas_hearth_extension',
      category: 'masonry',
      title: 'Masonry Fireplace Hearth Extension',
      codeRef: 'OBC 9.22.5.1.(1)',
      summary: 'Minimum dimensions for the non-combustible hearth extension projecting in front of a masonry fireplace opening.',
      metricVal: 'Min 400 mm in Front / 200 mm on Sides',
      imperialVal: 'Min 16" in Front / 8" on Sides',
      jobsiteNote: 'You cannot run hardwood flooring or combustible carpet right up to the firebox. A solid concrete, stone, or brick hearth must extend at least 16 inches directly in front of the opening, and 8 inches past each side of the opening to catch rolling embers.'
    },
    {
      id: 'obc_mas_foundation_mortar',
      category: 'masonry',
      title: 'Below-Grade Mortar Type',
      codeRef: 'OBC 9.20.3.2.(1)',
      summary: 'Strict limitation on the chemical composition of mortar used for foundation walls below ground level.',
      metricVal: 'Type M or Type S Mortar Only',
      imperialVal: 'Type M or Type S Mortar Only',
      jobsiteNote: 'You cannot use standard Type N masonry mortar (commonly used for above-grade brick veneer) to build a concrete block foundation wall. Below-grade walls must be laid with high-compressive-strength Type M or Type S mortar to resist soil pressure and moisture.'
    },
    {
      id: 'obc_mas_veneer_max_height',
      category: 'masonry',
      title: 'Max Veneer Height (Without Shelf Angles)',
      codeRef: 'OBC 9.20.6.1.(1) / 9.20.5.2',
      summary: 'Maximum allowable vertical height for a brick veneer wall resting solely on the foundation before steel relief angles are required.',
      metricVal: 'Maximum 11 Meters Total Height',
      imperialVal: 'Maximum 36 Feet Total Height',
      jobsiteNote: 'Brick is incredibly heavy. You cannot stack it indefinitely. In standard residential construction, if a brick wall exceeds 11 meters (approx. 3 stories) in height from the foundation, you MUST bolt structural steel shelf angles to the floor framing to carry the upper weight.'
    },
		{
      id: 'obc_garage_door_closer',
      category: 'garages',
      title: 'Man-Door Self-Closing Device',
      codeRef: 'OBC 9.10.13.15.(1)',
      summary: 'Mandatory hardware requirement for the pedestrian door connecting an attached garage to the house.',
      metricVal: 'Heavy-Duty Self-Closing Device Required',
      imperialVal: 'Heavy-Duty Self-Closing Device Required',
      jobsiteNote: 'The door between the house and the garage MUST be equipped with a mechanical self-closer (spring hinges or hydraulic closer). The door cannot be capable of being left open, to prevent exhaust fumes from passively flooding the home.'
    },
    {
      id: 'obc_garage_door_seal',
      category: 'garages',
      title: 'Garage Door Weatherstripping (Fume Seal)',
      codeRef: 'OBC 9.10.9.16.(4)',
      summary: 'Requirement to make the pedestrian door airtight against carbon monoxide.',
      metricVal: 'Continuous Weatherstripping on Top, Bottom & Sides',
      imperialVal: 'Continuous Weatherstripping on Top, Bottom & Sides',
      jobsiteNote: 'An interior-style hollow-core door is illegal. It must be a dedicated exterior-grade door equipped with a continuous weatherstripping gasket on all sides and a tightly sealed bottom sweep/threshold to block deadly car exhaust.'
    },
    {
      id: 'obc_garage_hvac_returns',
      category: 'garages',
      title: 'Prohibition of HVAC Returns',
      codeRef: 'OBC 9.33.6.4',
      summary: 'Strict rule against pulling furnace return air from an attached garage.',
      metricVal: 'Zero Return Air Grilles Permitted',
      imperialVal: 'Zero Return Air Grilles Permitted',
      jobsiteNote: 'You can supply heat to a garage using a dedicated duct, but you can NEVER install a cold-air return grille in a garage. Doing so would suck carbon monoxide, gasoline vapors, and chemical fumes directly into the house\'s central air system.'
    },
    {
      id: 'obc_garage_wood_curb',
      category: 'garages',
      title: 'Wood Framing Clearance (Concrete Curb)',
      codeRef: 'OBC 9.23.2.3 / 9.23.2.2',
      summary: 'Required elevation of wood-framed walls above the concrete garage floor.',
      metricVal: '150 mm Curb (or 50 mm w/ Poly Separation)',
      imperialVal: '6" Curb (or 2" w/ Poly Separation)',
      jobsiteNote: 'Because garages frequently flood with melting snow and slush from vehicles, interior wall framing dividing the house and garage should sit on a poured concrete curb. If framing rests directly on the slab, it must be pressure-treated or heavily separated by a poly/foam moisture barrier.'
    },
		{
      id: 'obc_garage_detached_slab',
      category: 'garages',
      title: 'Detached Garage Frost Footing Exemption',
      codeRef: 'OBC 9.12.2.2 / 9.35.3.1',
      summary: 'Conditions under which a detached garage can be built on a floating concrete slab without 4-foot deep frost footings.',
      metricVal: 'Exempt if Area ≤ 55 m² (1-Storey, Wood Frame)',
      imperialVal: 'Exempt if Area ≤ 592 sq ft (1-Storey, Wood Frame)',
      jobsiteNote: 'You do not need frost walls for a standard 2-car detached garage as long as it is wood-framed (no masonry veneer), single-story, not attached to the house, and 592 sq ft or smaller. The perimeter of the slab must still be thickened.'
    },
    {
      id: 'obc_garage_attic_fire',
      category: 'garages',
      title: 'Garage Attic Fire Separation',
      codeRef: 'OBC 9.10.9.16.(2)',
      summary: 'Requirement for continuous fire separation when the house and garage share a continuous attic space.',
      metricVal: 'Drywall Must Extend to Underside of Roof Deck',
      imperialVal: 'Drywall Must Extend to Underside of Roof Deck',
      jobsiteNote: 'If the garage ceiling is left un-drywalled or open, the common wall dividing the house and the garage must be drywalled all the way up through the attic trusses tightly against the underside of the roof sheathing to prevent fire from jumping over the wall into the house attic.'
    },
    {
      id: 'obc_garage_header_bearing',
      category: 'garages',
      title: 'Overhead Door Lintel Support (Jack Studs)',
      codeRef: 'OBC 9.23.12.3.(1)',
      summary: 'Required solid wood bearing length supporting massive structural headers over wide vehicle doors.',
      metricVal: 'Minimum 76 mm Bearing (2 Jack Studs)',
      imperialVal: 'Minimum 3" Bearing (2 Jack Studs)',
      jobsiteNote: 'A standard 16-foot garage door header carries a massive roof load. A single 2x4 jack/trimmer stud (1.5" bearing) will crush under the weight. You MUST install a minimum of two full-length jack studs (3" of solid bearing) under both ends of a double-car garage header.'
    },
		{
      id: 'obc_dock_guard_exemption',
      category: 'marine',
      title: 'Guardrail Exemption at Water\'s Edge',
      codeRef: 'OBC 9.8.8.1.(3)',
      summary: 'Specific exemption from the mandatory guardrail rules for the water-facing edges of docks and boathouses.',
      metricVal: 'Guards Not Required at Loading Edge',
      imperialVal: 'Guards Not Required at Loading Edge',
      jobsiteNote: 'Even if the deck of your dock is 5 feet above the water level, you are NOT required to install a 36" or 42" guardrail along the edges where boats are loaded and unloaded. Installing a guardrail there creates a major hazard for boaters trying to dock.'
    },
    {
      id: 'obc_dock_elec_height',
      category: 'marine',
      title: 'Dock Electrical Receptacle Height',
      codeRef: 'OESC 78-052(4)',
      summary: 'Required vertical elevation for installing electrical outlets on fixed or floating docks to prevent submersion during high water.',
      metricVal: 'Min 1 m Above High Water (or 300 mm Above Deck)',
      imperialVal: 'Min 39" Above High Water (or 12" Above Deck)',
      jobsiteNote: 'Water levels fluctuate wildly during the spring thaw. An electrical outlet on a dock must be mounted at least 1 meter (39") above the maximum historical high-water mark, OR at least 300 mm (12") above the walking surface of the dock.'
    },
    {
      id: 'obc_dock_elec_gfci',
      category: 'marine',
      title: 'Marina / Dock GFCI Protection',
      codeRef: 'OESC 78-052(1)',
      summary: 'Mandatory ground-fault protection for all 15A and 20A receptacles located on residential docks and boathouses.',
      metricVal: 'Class A GFCI Protection Required',
      imperialVal: 'Class A GFCI Protection Required',
      jobsiteNote: 'Electricity and lake water are a deadly combination (Electric Shock Drowning). EVERY single receptacle on a dock or inside a wet boathouse must be protected by a Class A GFCI breaker or receptacle, regardless of its distance from the water.'
    },
    {
      id: 'obc_dock_treated_wood',
      category: 'marine',
      title: 'Wood Preservative for Marine Contact',
      codeRef: 'OBC 9.23.2.2 / CSA O80',
      summary: 'Requirements for lumber submerged in or subjected to continuous splashing from fresh water.',
      metricVal: 'Pressure Treated to Marine Specifications',
      imperialVal: 'Pressure Treated to Marine Specifications',
      jobsiteNote: 'You cannot use standard "brown" deck lumber (ACQ) for structural cribs submerged in the lake. Wood continuously submerged in water requires a much higher chemical retention level (often CCA treatment) specifically rated for marine/freshwater contact per CSA O80.'
    },
		{
      id: 'obc_tol_wall_plumb',
      category: 'framing_tolerances',
      title: 'Maximum Wall Out-of-Plumb',
      codeRef: 'Tarion Construction Guidelines (Defect 4.5)',
      summary: 'Maximum allowable deviation from absolute vertical (plumb) for interior and exterior framed walls.',
      metricVal: 'Max 10 mm per 2.4 m of Height',
      imperialVal: 'Max 3/8" per 8 ft of Height',
      jobsiteNote: 'If a homeowner puts a 4-foot or 8-foot level on your finished wall and the bubble is out by more than 3/8" over the height of the room, you are legally required to rip the drywall off, sister the studs, and fix it.'
    },
    {
      id: 'obc_tol_floor_level',
      category: 'framing_tolerances',
      title: 'Maximum Floor Unlevelness',
      codeRef: 'Tarion Construction Guidelines (Defect 5.7)',
      summary: 'Maximum allowable sag or slope in a finished floor across a room.',
      metricVal: 'Max 6 mm over 800 mm / 19 mm over 6.0 m',
      imperialVal: 'Max 1/4" over 32" / 3/4" over 20 ft',
      jobsiteNote: 'Floors do not have to be perfectly laser-level, but they must not have sharp dips. If a marble rolls across the room and dips more than 1/4" within a 32-inch span, the framing (or self-leveling underlayment) failed the standard.'
    },
    {
      id: 'obc_tol_wall_bowing',
      category: 'framing_tolerances',
      title: 'Maximum Wall Bowing / Warping',
      codeRef: 'Tarion Construction Guidelines (Defect 4.4)',
      summary: 'Maximum allowable inward or outward curve of a wall surface (crooked studs).',
      metricVal: 'Max 12 mm over 2.4 m',
      imperialVal: 'Max 1/2" over 8 ft',
      jobsiteNote: 'This happens when framing with wet spruce that warps as it dries. You are allowed a maximum 1/2" belly or bow in an 8-foot wall. Always crown your studs in the same direction, and plane down the worst offenders before drywall goes up.'
    },
    {
      id: 'obc_marine_flotation_foam',
      category: 'marine',
      title: 'Floating Dock Buoyancy (Encapsulated Foam)',
      codeRef: 'MNRF / Federal DFO Regulations',
      summary: 'Environmental requirement for the flotation billets holding up a floating dock or boathouse.',
      metricVal: '100% Fully Encapsulated Foam Required',
      imperialVal: '100% Fully Encapsulated Foam Required',
      jobsiteNote: 'You CANNOT use bare, exposed blue or pink extruded polystyrene (XPS) foam blocks to float a dock anymore. Muskrats eat it, and ice shreds it into microplastics. All dock flotation must be factory-encapsulated in a hard plastic polyethylene shell.'
    },
    {
      id: 'obc_marine_boathouse_roof',
      category: 'marine',
      title: 'Flat Boathouse Roof Decks',
      codeRef: 'OBC 9.4.2.3 / 9.8.8.1',
      summary: 'Requirements when utilizing the flat roof of a boathouse as an elevated entertainment deck.',
      metricVal: '1.9 kPa Live Load + 1070 mm Guardrails',
      imperialVal: '40 PSF Live Load + 42" Guardrails',
      jobsiteNote: 'If you build a staircase up to a flat boathouse roof, it instantly becomes a structural balcony. The roof joists must be upgraded to support a 40 PSF live load (not just a standard 20 PSF snow load), and the entire perimeter requires 42-inch tall guardrails.'
    },
		{
      id: 'obc_tol_joist_crown',
      category: 'framing_tolerances',
      title: 'Adjacent Joist Crowning Variance',
      codeRef: 'Tarion Construction Guidelines (Defect 5.5)',
      summary: 'Maximum allowable height difference between two adjacent wooden floor joists before the subfloor is installed.',
      metricVal: 'Max 6 mm Variance Between Adjacent Joists',
      imperialVal: 'Max 1/4" Variance Between Adjacent Joists',
      jobsiteNote: 'Lumber is never perfectly straight. You must sight every joist and install them "crown up." However, if the crown on one joist is 1/4" higher than the joist right next to it, you must plane down the high joist or shim the low one, otherwise the floor will have a noticeable hump.'
    },
    {
      id: 'obc_tol_shim_gaps',
      category: 'framing_tolerances',
      title: 'Load-Bearing Shimming Limits',
      codeRef: 'OBC 9.23.9.1 / Industry Standard',
      summary: 'Rules for filling gaps where load-bearing posts or beams do not sit perfectly flush against each other.',
      metricVal: 'Zero Wood Shims (Metal/Hardwood Full-Width Only)',
      imperialVal: 'Zero Wood Shims (Metal/Hardwood Full-Width Only)',
      jobsiteNote: 'If you cut a 6x6 post too short under a drop beam, you CANNOT tap cedar shakes or soft spruce shims into the gap. Softwood shims will instantly crush under the house load. You must use full-width steel shim plates or solid hardwood blocks to bridge the gap.'
    },
    {
      id: 'obc_marine_fasteners',
      category: 'marine',
      title: 'Marine Environment Fasteners',
      codeRef: 'OBC 9.23.3.1 / CSA B111',
      summary: 'Material requirements for nails, screws, and bolts used in dock construction over water.',
      metricVal: 'Hot-Dipped Galvanized or Stainless Steel',
      imperialVal: 'Hot-Dipped Galvanized or Stainless Steel',
      jobsiteNote: 'Standard "deck screws" or electro-galvanized framing nails will rust out in one season near the water. All structural hardware on a dock or boathouse must be heavily Hot-Dipped Galvanized (HDG) or Type 304/316 Stainless Steel.'
    },
    {
      id: 'obc_marine_ramp_slope',
      category: 'marine',
      title: 'Dock Gangway (Ramp) Maximum Slope',
      codeRef: 'OBC 9.8.5.1 / 9.8.9.6',
      summary: 'Slip-resistance requirements for ramps connecting the fixed shore to a floating dock during low water levels.',
      metricVal: 'Cleats Required if Slope > 1 in 10',
      imperialVal: 'Cleats Required if Slope > 1 in 10',
      jobsiteNote: 'When water levels drop in late August, floating dock ramps get incredibly steep. If the gangway slope exceeds a 1-in-10 pitch (approx. 5.7 degrees), the decking must either have a high-friction abrasive coating or be fitted with horizontal wood cleats every 400 mm (16") to prevent slipping.'
    },
		{
      id: 'obc_fin_drywall_ceiling_sag',
      category: 'interior_finishes',
      title: 'Ceiling Drywall Thickness (Sag Resistance)',
      codeRef: 'OBC 9.29.5.3.(2)',
      summary: 'Required thickness of gypsum board on ceilings to prevent sagging between framing members.',
      metricVal: '15.9 mm (or 12.7 mm CD Board) for 600 mm OC',
      imperialVal: '5/8" (or 1/2" CD Board) for 24" OC',
      jobsiteNote: 'If ceiling joists or trusses are spaced at 24" on center, standard 1/2" drywall will sag under its own weight, especially if you apply a wet texture (like popcorn or knockdown). You MUST use 5/8" drywall, or specially formulated 1/2" "CD" (Ceiling Board) designed to resist sagging.'
    },
    {
      id: 'obc_fin_drywall_screws',
      category: 'interior_finishes',
      title: 'Drywall Fastener Spacing',
      codeRef: 'OBC 9.29.5.8.(1)',
      summary: 'Maximum allowed distance between drywall screws on walls and ceilings.',
      metricVal: 'Max 300 mm OC (Ceilings) / 400 mm OC (Walls)',
      imperialVal: 'Max 12" OC (Ceilings) / 16" OC (Walls)',
      jobsiteNote: 'Drywall screws on ceilings must be driven every 12 inches along the framing. On walls, you can space them up to 16 inches apart. Fasteners must not tear the paper face; if the paper breaks, the screw has zero holding power and you must drive another one beside it.'
    },
    {
      id: 'obc_fin_underlayment_resilient',
      category: 'interior_finishes',
      title: 'Underlayment for Resilient Flooring (Vinyl/Lino)',
      codeRef: 'OBC 9.30.2.2.(1)',
      summary: 'Mandatory smooth sub-surface required beneath thin, flexible sheet flooring or vinyl planks.',
      metricVal: '6 mm Minimum Plywood or Hardboard',
      imperialVal: '1/4" Minimum Plywood or Hardboard',
      jobsiteNote: 'You cannot glue sheet vinyl or lay thin LVP directly over a standard OSB subfloor. The OSB flakes will telegraph (show through) the vinyl within months. You must staple down a minimum 1/4" smooth mahogany/birch underlayment plywood or specialized hardboard first.'
    },
    {
      id: 'obc_fin_hearth_trim',
      category: 'interior_finishes',
      title: 'Combustible Trim near Fireplace',
      codeRef: 'OBC 9.22.9.1.(1)',
      summary: 'Clearance requirements for wood mantels, trim, and baseboards surrounding a masonry fireplace opening.',
      metricVal: 'Min 150 mm Clearance (Side & Top)',
      imperialVal: 'Min 6" Clearance (Side & Top)',
      jobsiteNote: 'Wood trim or MDF panels cannot touch the edge of the firebox. They must be kept at least 6 inches away from the opening. Furthermore, if a wood mantel projects outward more than 1.5 inches, the required vertical clearance increases to a full 12 inches above the opening.'
    },
    {
      id: 'obc_fin_stair_slip',
      category: 'interior_finishes',
      title: 'Stair Tread Slip Resistance',
      codeRef: 'OBC 9.8.9.6.(2)',
      summary: 'Requirement for interior floor finishes applied to stair treads.',
      metricVal: 'Must Be Slip-Resistant Finish',
      imperialVal: 'Must Be Slip-Resistant Finish',
      jobsiteNote: 'If you finish interior wood stairs with a high-gloss polyurethane that acts like an ice rink when wearing socks, it is a code violation and a massive liability. Stair tread finishes must have a slip-resistant quality or utilize a carpet runner/grip tape.'
    },
		{
      id: 'obc_fin_shower_height',
      category: 'interior_finishes',
      title: 'Shower Waterproofing Height',
      codeRef: 'OBC 9.29.10.5.(1)',
      summary: 'Minimum vertical height for water-resistant backing and finishes in a shower stall.',
      metricVal: 'Min 1800 mm Above Shower Floor',
      imperialVal: 'Min 71" Above Shower Floor',
      jobsiteNote: 'You cannot stop the tile or waterproof membrane halfway up the wall in a stand-up shower. It must extend a minimum of 1.8 meters (approx. 71 inches) above the shower drain/floor to protect the drywall from direct spray.'
    },
    {
      id: 'obc_fin_foam_thermal_barrier',
      category: 'interior_finishes',
      title: 'Foam Insulation Thermal Barrier',
      codeRef: 'OBC 9.10.17.10.(1)',
      summary: 'Mandatory interior fire protection over exposed foamed plastic insulation (spray foam or rigid panels).',
      metricVal: '12.7 mm Gypsum Board Required',
      imperialVal: '1/2" Gypsum Board Required',
      jobsiteNote: 'You can NEVER leave spray foam or rigid XPS/EPS foam exposed on the interior of a house (even in an unfinished basement or utility room). It must be covered by a thermal barrier, typically 1/2" drywall, to delay the foam from igniting and releasing toxic cyanide gas during a fire.'
    },
    {
      id: 'obc_fin_nosing_projection',
      category: 'interior_finishes',
      title: 'Stair Tread Nosing Projection limits',
      codeRef: 'OBC 9.8.4.6.(1)',
      summary: 'Maximum allowable overhang for a hardwood or finished stair tread nosing.',
      metricVal: 'Max 25 mm Projection',
      imperialVal: 'Max 1" Projection',
      jobsiteNote: 'When installing hardwood retro-treads or finishing basement stairs, the front nose of the tread cannot stick out more than 1 inch past the riser board below it. Anything larger creates a severe tripping hazard for people walking upstairs.'
    },
		{
      id: 'obc_fin_impervious_bath',
      category: 'interior_finishes',
      title: 'Water-Resistant Bathroom Flooring',
      codeRef: 'OBC 9.30.1.1.(1)',
      summary: 'Requirement for floor finishes in bathrooms and shower rooms to resist moisture penetration.',
      metricVal: 'Must Be Impervious to Water',
      imperialVal: 'Must Be Impervious to Water',
      jobsiteNote: 'You cannot put standard carpet in a full bathroom (one containing a tub or shower). The flooring must be an impervious material like tile, sheet vinyl, or properly sealed linoleum to prevent subfloor rot and mold growth.'
    },
    {
      id: 'obc_fin_glass_railings',
      category: 'interior_finishes',
      title: 'Interior Glass Guardrail Panels',
      codeRef: 'OBC 9.8.8.7.(1)',
      summary: 'Safety glazing requirements for glass used as the infill panels for interior stair and balcony railings.',
      metricVal: 'Tempered or Laminated Safety Glass Only',
      imperialVal: 'Tempered or Laminated Safety Glass Only',
      jobsiteNote: 'Custom glass stair railings are incredibly popular, but the glass MUST be stamped or etched in the corner as tempered or laminated safety glass. Standard plate glass is highly illegal here and deadly if shattered by a fall.'
    },
    {
      id: 'obc_fin_mantel_projection',
      category: 'interior_finishes',
      title: 'Heavy Fireplace Mantel Clearances',
      codeRef: 'OBC 9.22.9.1.(2)',
      summary: 'Increased vertical clearance requirements for fireplace mantels that project far out from the wall.',
      metricVal: '300 mm Clearance if Projection > 38 mm',
      imperialVal: '12" Clearance if Projection > 1-1/2"',
      jobsiteNote: 'A thin piece of flat wood trim can be 6 inches above the fireplace opening. But if your heavy wood mantel beam sticks out from the wall more than 1.5 inches, it MUST be mounted at least 12 inches above the top of the firebox opening so it doesn\'t catch fire from rolling heat.'
    },
		{
      id: 'obc_con_garage_mix',
      category: 'concrete',
      title: 'Garage Floor Concrete Mix (Salt/Freeze)',
      codeRef: 'OBC 9.3.1.6.(1) / CSA A23.1',
      summary: 'Mandatory compressive strength and air entrainment for garage slabs exposed to freezing and de-icing salts.',
      metricVal: '32 MPa Minimum + 5% to 8% Air Entrainment',
      imperialVal: '4600 PSI Minimum + 5% to 8% Air Entrainment',
      jobsiteNote: 'A massive point of failure: You CANNOT order standard 20 MPa basement floor concrete for a garage slab. Vehicles drag in road salt and slush. The concrete must be a 32 MPa mix (Class C-2 exposure) with air-entrainment, or the surface will spall and flake off after one winter.'
    },
    {
      id: 'obc_con_footing_strength',
      category: 'concrete',
      title: 'Footing & Foundation Wall Strength',
      codeRef: 'OBC Table 9.3.1.6',
      summary: 'Minimum compressive strength for poured concrete footings and foundation walls not exposed to freezing.',
      metricVal: '15 MPa (Footings) / 15 MPa (Walls)',
      imperialVal: '2200 PSI (Footings) / 2200 PSI (Walls)',
      jobsiteNote: 'While 15 MPa is the absolute legal minimum for unexposed residential footings and basement walls, most batch plants and contractors use a standard 20 MPa (3000 PSI) mix for improved workability and safety margins.'
    },
    {
      id: 'obc_con_cold_weather',
      category: 'concrete',
      title: 'Cold Weather Concrete Curing',
      codeRef: 'OBC 9.3.1.9.(1)',
      summary: 'Temperature requirements to protect freshly poured concrete from freezing.',
      metricVal: 'Maintain > 10°C (50°F) for 72 Hours',
      imperialVal: 'Maintain > 50°F for 72 Hours',
      jobsiteNote: 'Concrete does not "dry," it chemically cures. If the water inside the concrete freezes before it cures, the pour is structurally ruined. You must use insulated curing blankets or heated hoarding to keep the concrete above 10°C for at least 3 days.'
    },
    {
      id: 'obc_ext_downspout_discharge',
      category: 'exterior',
      title: 'Downspout (Eavestrough) Discharge',
      codeRef: 'OBC 9.14.5.2.(1)',
      summary: 'Required routing for roof rainwater discharge to prevent foundation flooding.',
      metricVal: 'Discharge Away From Building (Do Not Connect to Weeping Tile)',
      imperialVal: 'Discharge Away From Building (Do Not Connect to Weeping Tile)',
      jobsiteNote: 'You are strictly prohibited from connecting roof downspouts directly into the underground foundation weeping tile system. Doing so will overwhelm the sump pump during a storm. Extensions or splash blocks must direct water down-slope, away from the foundation.'
    },
    {
      id: 'obc_ext_soffit_vent_ratio',
      category: 'exterior',
      title: 'Soffit Intake Ventilation Ratio',
      codeRef: 'OBC 9.19.1.2.(1)',
      summary: 'Distribution requirement for attic ventilation to ensure proper air flow from eaves to peak.',
      metricVal: 'Minimum 50% of Required Vent Area at Soffits',
      imperialVal: 'Minimum 50% of Required Vent Area at Soffits',
      jobsiteNote: 'A roof cannot just have vents at the peak. At least half (50%) of the required 1/300 total attic ventilation area MUST be provided as intake at the soffits. Make sure insulation baffles are installed so blown-in insulation does not block the perforated soffit panels.'
    },
    {
      id: 'obc_ext_plywood_soffit',
      category: 'exterior',
      title: 'Wood/Plywood Soffit Thickness',
      codeRef: 'OBC 9.27.10.2.(1)',
      summary: 'Minimum thickness for exterior plywood used as a solid soffit material.',
      metricVal: 'Minimum 8 mm (if supports are 400 mm OC)',
      imperialVal: 'Minimum 5/16" (if supports are 16" OC)',
      jobsiteNote: 'If you are framing a custom wood soffit (instead of standard aluminum track), you cannot use ultra-thin 1/4" plywood if the lookout framing is 16 inches on center. It will warp and sag from exterior humidity. Use minimum 3/8" (9.5mm) or 1/2" exterior-grade plywood for a flat finish.'
    },
		{
      id: 'obc_ext_soffit_spatial',
      category: 'exterior',
      title: 'Soffit Venting at Property Lines',
      codeRef: 'OBC 9.10.15.5.(10)',
      summary: 'Fire safety restriction prohibiting ventilation openings in roof soffits located too close to property lines.',
      metricVal: '0% Openings Allowed if < 1.2 m to Property Line',
      imperialVal: '0% Openings Allowed if < 4 ft to Property Line',
      jobsiteNote: 'If you are building a house tightly against a side-yard property line (under 4 feet), you CANNOT use perforated aluminum soffit for your attic intake. The soffit must be solid non-combustible material to prevent a neighbor\'s house fire from drafting straight into your attic.'
    },
    {
      id: 'obc_ext_drip_edge',
      category: 'exterior',
      title: 'Eave Drip Edge & Gutter Overlap',
      codeRef: 'OBC 9.26.5.2',
      summary: 'Requirement for metal flashing at the roof eave to direct water safely into the gutter system.',
      metricVal: 'Metal Drip Edge Required at Eaves',
      imperialVal: 'Metal Drip Edge Required at Eaves',
      jobsiteNote: 'A major cause of rotting fascia boards is missing drip edge. A pre-formed metal drip edge must be installed under the first course of shingles and extend down so the lip overhangs directly into the gutter tray, bridging the gap so water cannot curl back against the wood.'
    },
    {
      id: 'obc_con_slab_joints',
      category: 'concrete',
      title: 'Slab Control Joint Depth & Spacing',
      codeRef: 'CSA A23.1 / Best Practice',
      summary: 'Required depth and maximum spacing for saw cuts or tooled joints to control concrete shrinkage cracking.',
      metricVal: 'Cut 1/4 Slab Depth / Max Spacing 24x to 36x Thickness',
      imperialVal: 'Cut 1/4 Slab Depth / Max Spacing 24x to 36x Thickness',
      jobsiteNote: 'For a standard 4-inch basement slab, control joints must be cut 1-inch deep, and spaced roughly 8 to 12 feet apart. If you cut the joints too shallow (e.g., 1/2-inch deep), the concrete will ignore the cut and spider-crack randomly across the floor.'
    },		           
		{
      id: 'obc_nrg_attic',
      category: 'energy',
      title: 'Attic Insulation Minimum (Zone 1 - Southern ON)',
      codeRef: 'OBC SB-12 Table 3.1.1.2.A',
      summary: 'Required thermal resistance for ceilings below unconditioned attics.',
      metricVal: 'RSI 10.56',
      imperialVal: 'R-60',
      jobsiteNote: 'Blowing R-60 insulation usually requires about 18 to 22 inches of loose-fill fiberglass or cellulose. You must install tall cardboard or foam baffles (Moore vents) at the eaves to prevent this massive pile of insulation from suffocating the soffit intake vents.'
    },
    {
      id: 'obc_nrg_wall_above_grade',
      category: 'energy',
      title: 'Above-Grade Wall Insulation',
      codeRef: 'OBC SB-12 Table 3.1.1.2.A',
      summary: 'Required thermal resistance for exterior wood-framed walls.',
      metricVal: 'RSI 3.87 (Nominal) or RSI 3.52 + Continuous',
      imperialVal: 'R-22 Nominal OR R-20 + R-5 Continuous',
      jobsiteNote: 'A standard 2x6 wall stuffed with R-22 batts barely meets code on its own and provides a poor thermal envelope due to "thermal bridging" through the wood studs. The industry standard is now R-20 batts inside the cavity, wrapped with R-5 continuous rigid XPS foam on the exterior.'
    },
    {
      id: 'obc_nrg_basement_wall',
      category: 'energy',
      title: 'Basement Wall Insulation',
      codeRef: 'OBC SB-12 Table 3.1.1.2.A',
      summary: 'Required thermal resistance for foundation walls enclosing conditioned space.',
      metricVal: 'RSI 3.52 Continuous',
      imperialVal: 'R-20 Continuous',
      jobsiteNote: 'You can no longer just hang blanket wrap halfway down a basement wall. The insulation must be continuous R-20 from the underside of the subfloor all the way down to the concrete slab. Best practice is continuous closed-cell spray foam or rigid foam board sealed to the foundation.'
    },
    {
      id: 'obc_nrg_blower_door',
      category: 'energy',
      title: 'Blower Door Air Leakage Limit',
      codeRef: 'OBC SB-12 / 9.25.3',
      summary: 'Maximum allowable whole-house air leakage rate during a depressurization test.',
      metricVal: 'Max 2.5 ACH @ 50 Pa',
      imperialVal: 'Max 2.5 ACH @ 50 Pa',
      jobsiteNote: 'To hit 2.5 Air Changes per Hour (ACH), the 6-mil poly vapour barrier must be meticulously sealed with acoustical sealant. Every electrical box on an exterior wall must be a special "airtight" pan box, and every wire/pipe penetration must be foamed.'
    },
		{
      id: 'all_framing_attic_ladder',
      category: 'framing',
      title: 'Pull-Down Attic Ladder Truss Cutting',
      codeRef: 'OBC / NBCC 9.23.13.11 / IRC R802.10.4',
      summary: 'Strict prohibition against cutting bottom chords of engineered roof trusses to fit pull-down attic access stairs.',
      metricVal: 'Zero Cutting Without Stamped Engineer Drawing',
      imperialVal: 'Zero Cutting Without Stamped Engineer Drawing',
      jobsiteNote: 'If a rough opening for folding attic stairs does not fit between the standard 24" OC bottom chords of your roof trusses, you CANNOT saw through a truss chord to header it out. You must either order a narrow 22.5" rough-in ladder or get a structural engineer\'s stamped repair detail.'
    },
    {
      id: 'obc_nrg_hrv',
      category: 'energy',
      title: 'Mandatory Heat Recovery Ventilator (HRV)',
      codeRef: 'OBC SB-12 3.1.1.6',
      summary: 'Requirement for mechanical fresh air exchange in airtight new construction.',
      metricVal: 'HRV / ERV Mandatory for All New Homes',
      imperialVal: 'HRV / ERV Mandatory for All New Homes',
      jobsiteNote: 'Because modern homes are sealed so tightly with poly vapour barriers and housewrap, they cannot "breathe." Without an HRV exhausting stale, moist air and recovering the heat to warm incoming fresh air, the house will quickly develop severe mold and condensation on windows.'
    },
    {
      id: 'obc_nrg_windows',
      category: 'energy',
      title: 'Window Fenestration Performance',
      codeRef: 'OBC SB-12 Table 3.1.1.2.A',
      summary: 'Maximum U-Value (heat loss rate) or minimum Energy Rating (ER) for exterior windows and sliding glass doors.',
      metricVal: 'Max U-Value 1.40 or Min ER 29',
      imperialVal: 'Max U-Value 0.25 or Min ER 29',
      jobsiteNote: 'Standard double-pane, clear glass windows are illegal in new builds. Windows must have Low-E (low-emissivity) coatings and Argon gas fill between the panes to meet the strict 1.40 U-Value limit.'
    },
    {
      id: 'obc_nrg_slab_edge',
      category: 'energy',
      title: 'Heated Slab Edge Insulation',
      codeRef: 'OBC SB-12 Table 3.1.1.2.A',
      summary: 'Mandatory thermal break when installing radiant in-floor heating inside a concrete slab on grade.',
      metricVal: 'RSI 1.76 under slab & at edges',
      imperialVal: 'R-10 under slab & at edges',
      jobsiteNote: 'If you install hydronic PEX tubing to heat a basement or garage floor, you MUST lay continuous 2-inch XPS foam (R-10) directly under the entire slab, and vertically around the perimeter edge against the foundation to stop the heat from draining into the earth.'
    },
		{
      id: 'obc_nrg_dwhr',
      category: 'energy',
      title: 'Mandatory Drain Water Heat Recovery (DWHR)',
      codeRef: 'OBC SB-12 3.1.1.2 / 3.1.1.10',
      summary: 'Requirement for heat recovery pipes installed on vertical drain stacks draining two or more showers.',
      metricVal: 'Min 42% Efficiency Rating Required',
      imperialVal: 'Min 42% Efficiency Rating Required',
      jobsiteNote: 'Under virtually all SB-12 prescriptive compliance packages, you MUST install a copper copper-wrapped DWHR unit on the main drain stack receiving shower water. The unit pre-heats cold incoming water before it hits the hot water tank, cutting water heating energy costs.'
    },
    {
      id: 'obc_nrg_exposed_floor',
      category: 'energy',
      title: 'Exposed Floor / Cantilever Insulation',
      codeRef: 'OBC SB-12 Table 3.1.1.2.A',
      summary: 'Required thermal resistance for floors over unheated garages, outdoor cantilevers, or open porches.',
      metricVal: 'RSI 5.46 Minimum',
      imperialVal: 'R-31 Minimum',
      jobsiteNote: 'A bedroom floor cantilevered over an unheated porch cannot just be stuffed with R-20 batts. You must achieve R-31 minimum. Closed-cell spray foam is standard practice here because it simultaneously seals out drafty winter air and hits high R-value in standard joist depth.'
    },
    {
      id: 'obc_nrg_table_tradeoff',
      category: 'energy',
      title: 'Furnace Efficiency vs. Wall Continuous Insulation',
      codeRef: 'OBC SB-12 Table 3.1.1.2.A vs 3.1.1.11',
      summary: 'Trade-off allowing builders to omit expensive exterior continuous rigid foam by installing ultra-high-efficiency heating equipment.',
      metricVal: 'AFUE ≥ 92% Eliminates Exterior Foam Requirement',
      imperialVal: 'AFUE ≥ 92% Eliminates Exterior Foam Requirement',
      jobsiteNote: 'A major cost-saving code secret: If you install a standard furnace (< 84% AFUE), SB-12 forces you to add expensive continuous rigid foam on the exterior walls. But if you install a 92%+ condensing gas furnace or heat pump, you can legally build standard 2x6 walls with R-22 cavity batts alone.'
    },
    {
      id: 'obc_nrg_skylight_shaft',
      category: 'energy',
      title: 'Skylight Shaft Insulation',
      codeRef: 'OBC SB-12 3.1.1.5',
      summary: 'Thermal requirements for vertical or angled light shafts penetrating unconditioned attic space.',
      metricVal: 'Match Exterior Wall RSI (Min RSI 3.87)',
      imperialVal: 'Match Exterior Wall R-Value (Min R-22)',
      jobsiteNote: 'When framing a skylight shaft through a cold attic, the walls of that shaft are exterior walls. You must insulate them to a minimum of R-22 and wrap the interior side in a taped 6-mil poly vapour barrier to prevent warm house air from condensing on the skylight glass.'
    },
		{
      id: 'obc_nrg_f280_calculations',
      category: 'energy',
      title: 'Mandatory CSA F280 Equipment Sizing',
      codeRef: 'OBC 9.33.5.1. / SB-12',
      summary: 'Mandatory room-by-room heat loss and heat gain calculations required before selecting heating and cooling equipment.',
      metricVal: 'Sized Strictly to CSA F280 Standards',
      imperialVal: 'Sized Strictly to CSA F280 Standards',
      jobsiteNote: 'You cannot just guess furnace size based on square footage anymore (e.g., "rule of thumb 40 BTU per sq ft"). The HVAC designer must calculate exact room loads based on windows, insulation, and orientation using CSA F280. If the equipment is oversized, it will short-cycle, destroy efficiency, and cause short equipment life.'
    },
    {
      id: 'obc_nrg_insulation_protection',
      category: 'energy',
      title: 'Exterior Rigid Insulation Protection',
      codeRef: 'OBC 9.25.2.3.(3)',
      summary: 'Requirement to protect exterior edge insulation from mechanical damage and ultraviolet (UV) degradation.',
      metricVal: 'Provide Protective Covering Above Grade',
      imperialVal: 'Provide Protective Covering Above Grade',
      jobsiteNote: 'If you install exterior rigid foam down the outside of a foundation wall, any foam left exposed above the finished dirt line must be covered. Sunlight degrades it, and weed-whackers will shred it. Use a cementitious parging, high-density flashing, or a specialized heavy-duty ground-rated plastic cover.'
    },
    {
      id: 'obc_nrg_vapour_barrier_perm',
      category: 'energy',
      title: 'Vapour Barrier Permeance Rating',
      codeRef: 'OBC 9.25.4.2.(1)',
      summary: 'Maximum allowable water vapour permeance for the primary interior vapour barrier.',
      metricVal: 'Max 60 ng/(Pa·s·m²) (0.75 Perm)',
      imperialVal: 'Max 1.05 Grains/hr·ft²·inHg (0.75 Perm)',
      jobsiteNote: 'Standard 6-mil polyethylene sheet is the default jobsite choice because it hits roughly 0.05 perms, far exceeding the 0.75 code limit. If a client wants to use a "smart" vapour retarder or vapour-barrier paint instead of poly, you must verify the manufacturer submittal sheet proves it meets this permeance rating.'
    },
		{
      id: 'obc_site_retaining_wall',
      category: 'site_work',
      title: 'Engineered Retaining Wall Trigger',
      codeRef: 'OBC 9.4.2.3. / 4.1.8.6.',
      summary: 'The vertical height limit at which an earth-retaining landscape structure requires a structural engineer design.',
      metricVal: 'Requires Engineer if > 1.0 m High',
      imperialVal: 'Requires Engineer if > 39-3/8" High',
      jobsiteNote: 'This limit tracks exposed height. Additionally, if there is a "surcharge" load within a distance equal to the wall height (like a driveway, parking space, or a steep slope above it), it must be engineered regardless of height.'
    },
    {
      id: 'obc_site_grading_slope',
      category: 'site_work',
      title: 'Foundation Perimeter Grading Slope',
      codeRef: 'OBC 9.14.6.1.(1)',
      summary: 'Mandatory slope of finished ground surface away from foundation walls to prevent hydraulic pressure on the weeping tile.',
      metricVal: 'Min 1:50 Slope for Minimum 1.5 m',
      imperialVal: 'Min 1/4" per Foot for Minimum 5 ft',
      jobsiteNote: 'The ground must slope downward away from the house wall. A common inspection failure happens when a builder places decorative landscape stone flat against the foundation, creating a hidden negative grade that traps rainwater.'
    },
    {
      id: 'obc_site_topsoil_removal',
      category: 'site_work',
      title: 'Removal of Organic Topsoil',
      codeRef: 'OBC 9.12.1.1.(1)',
      summary: 'Mandatory excavation of all organic soil, stumps, and debris from the building footprint before placing load-bearing materials.',
      metricVal: 'Complete Removal of Organic Material',
      imperialVal: 'Complete Removal of Organic Material',
      jobsiteNote: 'Never pour footings or concrete slabs over topsoil or uncompacted organic fill. As organic matter decomposes over time, it creates voids, leading to localized slab sinking and foundational cracking.'
    },
    {
      id: 'obc_site_swale_clearance',
      category: 'site_work',
      title: 'Drainage Swale Location and Depth',
      codeRef: 'OBC 9.14.6.1.(2)',
      summary: 'Requirements for constructing surface drainage swales along property lines.',
      metricVal: 'Min 150 mm Deep / 2% Minimum Slope',
      imperialVal: 'Min 6" Deep / 2% Minimum Slope',
      jobsiteNote: 'When building tightly spaced infill homes, the side-yard grading must form a clear, shallow V-shaped ditch (swale) centered on or near the property line to safely shepherd rainwater out to the municipal ditch or street gutter.'
    },
		{
      id: 'obc_site_granular_base',
      category: 'site_work',
      title: 'Sub-Slab Granular Drainage Base',
      codeRef: 'OBC 9.16.2.1.(1)',
      summary: 'Requirement for a capillary break and drainage layer placed directly beneath interior basement concrete slabs.',
      metricVal: 'Minimum 100 mm Clean Coarse Stone',
      imperialVal: 'Minimum 4" Clean Coarse Stone',
      jobsiteNote: 'You cannot pour a basement floor directly on the dirt. You must lay at least 4 inches of clean, crushed 3/4" gravel to allow sub-slab moisture and soil gases (radon) to move freely toward the sump pit or extraction pipe.'
    },
    {
      id: 'obc_site_window_well_drain',
      category: 'site_work',
      title: 'Window Well Drainage Connection',
      codeRef: 'OBC 9.14.6.3.(1)',
      summary: 'Requirement for draining window wells that sit below the finished exterior grade.',
      metricVal: 'Must Drain to Foundation Weeping Tile',
      imperialVal: 'Must Drain to Foundation Weeping Tile',
      jobsiteNote: 'If a basement window requires a galvanized steel window well to hold back the dirt, the bottom of that well cannot just be filled with a few inches of gravel. A vertical 4-inch drain pipe or heavy stone column must be installed to carry rainwater straight down to the foundation weeping tile system so the window doesn\'t flood.'
    },
    {
      id: 'obc_site_trench_separation',
      category: 'site_work',
      title: 'Water & Sewer Trench Separation',
      codeRef: 'OBC 7.3.5.7.(2) / Plumbing Code',
      summary: 'Underground site work rules to prevent cross-contamination if a sewer lateral breaks near a drinking water line.',
      metricVal: '1.5 m Horizontal Separation OR Undisturbed Shelf',
      imperialVal: '5 ft Horizontal Separation OR Undisturbed Shelf',
      jobsiteNote: 'When digging the main trench from the street to the house, you cannot just throw the water main and the sewer pipe into the bottom of the same hole. They must be spaced 5 feet apart horizontally, OR the water line must sit on a solid, undisturbed dirt shelf at least 12 inches higher than the sewer line.'
    },
    {
      id: 'obc_site_radon_roughin',
      category: 'site_work',
      title: 'Soil Gas (Radon) Mitigation Rough-in',
      codeRef: 'OBC 9.13.4.3.(1)',
      summary: 'Requirement for a sub-slab depressurization pipe system to safely vent radioactive Radon gas from the soil.',
      metricVal: '100 mm Pipe Terminating in Gravel Bed',
      imperialVal: '4" Pipe Terminating in Gravel Bed',
      jobsiteNote: 'Even if the municipality doesn\'t currently test high for Radon, you must install a 4-inch PVC pipe through the basement slab, penetrating down into the clean gravel base. It must be capped and labeled so a fan can be easily attached later if Radon levels rise.'
    },
    {
      id: 'obc_site_stepped_footings',
      category: 'site_work',
      title: 'Excavation for Stepped Footings',
      codeRef: 'OBC 9.15.3.9.(1)',
      summary: 'Limitations on how steeply you can step the foundation trench down a sloped lot.',
      metricVal: 'Max 600 mm Vertical Rise per Step',
      imperialVal: 'Max 24" Vertical Rise per Step',
      jobsiteNote: 'When digging footings on a hillside, you cannot just dig a 45-degree angled trench. The footings must be poured perfectly level, stepping down like giant stairs. Each step cannot drop more than 24 inches vertically to ensure the soil beneath doesn\'t shear.'
    },
    {
      id: 'obc_site_crawlspace_grade',
      category: 'site_work',
      title: 'Crawlspace Interior Drainage Grading',
      codeRef: 'OBC 9.18.5.1.(1)',
      summary: 'Mandatory soil contouring inside an unpaved (dirt floor) crawlspace.',
      metricVal: 'Grade Soil to Lowest Point / Drain',
      imperialVal: 'Grade Soil to Lowest Point / Drain',
      jobsiteNote: 'You cannot leave the dirt inside a crawlspace lumpy and uneven. The entire interior ground surface must be raked and graded so that any groundwater that seeps in naturally flows to a designated lowest point, weeping tile, or a sump pit.'
    },
		{
      id: 'obc_acc_grab_bar_blocking',
      category: 'accessibility',
      title: 'Mandatory Grab Bar Wall Backing',
      codeRef: 'OBC 9.31.2.3.(1)',
      summary: 'Requirement for solid wood blocking behind drywall in all new residential bathrooms to support future grab bars.',
      metricVal: 'Solid Wood Blocking in All Tubs, Showers & Toilets',
      imperialVal: 'Solid Wood Blocking in All Tubs, Showers & Toilets',
      jobsiteNote: 'You MUST install 2x6 or 2x8 wood blocking between the wall studs around every toilet, bathtub, and shower in a new home. Even if the current buyers are 25 years old and don\'t want grab bars, the blocking must be buried in the wall for future aging-in-place adaptation.'
    },
    {
      id: 'obc_acc_door_width',
      category: 'accessibility',
      title: 'Barrier-Free Doorway Clear Width',
      codeRef: 'OBC 3.8.3.3.(1) / 9.5.11.1',
      summary: 'Minimum unobstructed opening width for a door on a designated barrier-free path of travel.',
      metricVal: 'Min 860 mm Clear Width',
      imperialVal: 'Min 34" Clear Width',
      jobsiteNote: 'This is a measure of the *clear opening*, not the door slab size. To achieve an 860 mm (34") clear space when the door is swung open at 90 degrees and the thickness of the door is intruding on the opening, you typically must install a 36-inch (914 mm) door.'
    },
    {
      id: 'obc_acc_ramp_slope',
      category: 'accessibility',
      title: 'Barrier-Free Ramp Slope',
      codeRef: 'OBC 3.8.3.4.(1)',
      summary: 'Maximum allowable gradient for a wheelchair accessible ramp.',
      metricVal: 'Max 1 in 12 Slope (8.3%)',
      imperialVal: 'Max 1 in 12 Slope (8.3%)',
      jobsiteNote: 'While standard residential code allows a 1-in-10 slope for a general ramp, a true barrier-free wheelchair ramp can NEVER exceed 1-in-12. This means for every 1 inch of vertical rise, you need 12 inches of horizontal run. (e.g., A 2-foot porch drop requires a 24-foot long ramp).'
    },
    {
      id: 'obc_acc_turning_radius',
      category: 'accessibility',
      title: 'Wheelchair Turning Radius',
      codeRef: 'OBC 3.8.3.12.(1)',
      summary: 'Minimum clear floor space required in a barrier-free washroom or kitchen to allow a wheelchair to execute a 360-degree turn.',
      metricVal: 'Min 1500 mm Diameter Circle',
      imperialVal: 'Min 60" Diameter Circle',
      jobsiteNote: 'When laying out a barrier-free bathroom, you must be able to draw a perfect 1.5 meter (60-inch) circle on the floor plan that does not intersect the toilet, vanity cabinet, or shower curb. The space under a wall-hung sink can count toward this circle if there is knee clearance.'
    },
		{
      id: 'obc_acc_toilet_centerline',
      category: 'accessibility',
      title: 'Accessible Toilet (Water Closet) Centerline',
      codeRef: 'OBC 3.8.3.15 / ASC 7.2.3.4',
      summary: 'Strict requirement for the lateral placement of an accessible toilet relative to the adjacent grab-bar wall.',
      metricVal: '460 mm to 480 mm from Side Wall',
      imperialVal: '18-1/8" to 18-7/8" from Side Wall',
      jobsiteNote: 'This is one of the most failed accessibility inspections. The toilet cannot just be "roughly 18 inches" from the wall. The center of the toilet drain must be EXACTLY between 460 mm and 480 mm from the finished side wall so the user can reach the grab bar without falling.'
    },
    {
      id: 'obc_acc_grab_bar_clearance',
      category: 'accessibility',
      title: 'Grab Bar Diameter and Wall Clearance',
      codeRef: 'OBC 3.8.3.8 / ASC 7.1.3',
      summary: 'Required physical dimensions for safety grab bars and the space behind them.',
      metricVal: '30-50 mm Diameter / 35-50 mm Wall Clearance',
      imperialVal: '1-1/4" to 2" Diameter / 1-1/2" to 2" Wall Clearance',
      jobsiteNote: 'You cannot use a thick decorative towel bar as a grab bar. It must be a dedicated bar capable of resisting 1.3 kN (300 lbs) of force, with exactly 35 to 50 mm of clearance behind it so an adult hand can grip it firmly without trapping their knuckles against the tile.'
    },
    {
      id: 'obc_acc_shower_clear_space',
      category: 'accessibility',
      title: 'Barrier-Free Shower Approach Space',
      codeRef: 'OBC 3.8.3.17',
      summary: 'Required unobstructed floor space immediately in front of a roll-in or transfer shower.',
      metricVal: 'Min 900 mm x 1500 mm Clear Space',
      imperialVal: 'Min 36" x 60" Clear Space',
      jobsiteNote: 'A barrier-free shower is useless if a wheelchair cannot parallel-park next to it. You must provide a perfectly clear, flat area of 900 x 1500 mm immediately adjacent to the shower entrance, completely free of the toilet, vanity, or swinging doors.'
    },
		{
      id: 'obc_pool_bonding_grid',
      category: 'pools',
      title: 'Equipotential Bonding Grid',
      codeRef: 'OESC 68-058',
      summary: 'Mandatory electrical grounding web required around the perimeter of a swimming pool to prevent electric shock.',
      metricVal: '6 AWG Bare Copper Grid Required',
      imperialVal: '6 AWG Bare Copper Grid Required',
      jobsiteNote: 'Before pouring a concrete pool deck or laying pavers, you MUST install a bare 6-gauge solid copper wire ringing the entire pool, bonded to the pool water, the metal ladder, the pump motor, and the rebar in the concrete. Do not pour the deck until the electrical inspector signs off on this grid.'
    },
    {
      id: 'obc_pool_glazing',
      category: 'pools',
      title: 'Safety Glazing Near Pools',
      codeRef: 'OBC 9.6.1.4.(3)',
      summary: 'Requirement for safety glass when house windows are located dangerously close to a pool deck or hot tub.',
      metricVal: 'Tempered Glass if < 1.5 m from Pool Edge',
      imperialVal: 'Tempered Glass if < 5 ft from Pool Edge',
      jobsiteNote: 'If someone slips on a wet pool deck and crashes into a low house window, standard plate glass is deadly. Any window located within 1.5 meters (approx. 5 feet) of the water\'s edge MUST be made of tempered or laminated safety glass.'
    },
    {
      id: 'obc_pool_receptacle_distance',
      category: 'pools',
      title: 'Receptacle Clearance from Water',
      codeRef: 'OESC 68-064',
      summary: 'Minimum safe distance for placing electrical outlets near a pool or spa.',
      metricVal: 'Min 1.5 m from Inside Wall of Pool (GFCI Required)',
      imperialVal: 'Min 5 ft from Inside Wall of Pool (GFCI Required)',
      jobsiteNote: 'You cannot install a convenience plug right next to the pool ladder. Receptacles must be kept at least 5 feet away from the water\'s edge. Any receptacle located between 1.5m and 3.0m (5 to 10 feet) from the pool MUST be protected by a Class A GFCI.'
    },
    {
      id: 'obc_pool_backflow',
      category: 'pools',
      title: 'Pool Fill Hose Bib Backflow Protection',
      codeRef: 'OBC 7.6.2.1.(1)',
      summary: 'Requirement to prevent chemically treated pool water from being siphoned back into the drinking water supply.',
      metricVal: 'Vacuum Breaker / Backflow Preventer Required',
      imperialVal: 'Vacuum Breaker / Backflow Preventer Required',
      jobsiteNote: 'If a homeowner leaves a garden hose submerged in the pool to fill it, a drop in city water pressure can siphon chlorine and pool water straight back into the house pipes. The exterior hose bib must be equipped with an approved backflow preventer (vacuum breaker).'
    },
    {
      id: 'obc_pool_gas_bonding',
      category: 'pools',
      title: 'Metallic Gas Piping Bonding',
      codeRef: 'OESC 68-058',
      summary: 'Electrical grounding requirement for gas lines feeding pool heaters or backyard BBQs.',
      metricVal: 'Bond all Gas Pipes within 1.5 m of Pool',
      imperialVal: 'Bond all Gas Pipes within 5 ft of Pool',
      jobsiteNote: 'If you run a metallic gas line to a pool heater or a patio fire feature, and that pipe passes within 1.5 meters (5 ft) of the pool water, it MUST be tied directly into the bare copper equipotential bonding grid. This ensures a gas pipe cannot introduce a different electrical potential near the water.'
    },
    {
      id: 'obc_pool_underwater_lights',
      category: 'pools',
      title: 'Underwater Luminaire Voltage & GFCI',
      codeRef: 'OESC 68-066',
      summary: 'Strict electrical limitations for wet-niche and dry-niche lighting installed directly in the pool wall.',
      metricVal: 'Max 150V Supply / Class A GFCI Protected',
      imperialVal: 'Max 150V Supply / Class A GFCI Protected',
      jobsiteNote: 'Underwater lights are extremely dangerous. The supply voltage cannot exceed 150V, all metal parts in contact with the water must be brass or heavy corrosion-resistant alloy, and the circuit MUST be completely isolated and protected by a Class A GFCI. The conduit running to the niche must be rigid PVC or corrosion-resistant metal.'
    },
    {
      id: 'obc_pool_grid_placement',
      category: 'pools',
      title: 'Concrete Deck Bonding Grid Location',
      codeRef: 'OESC 68-058.(3)',
      summary: 'Exact burial depth and distance for the copper equipotential grid wire circling the pool.',
      metricVal: '450 - 600 mm from Shell / 100 - 150 mm Below Grade',
      imperialVal: '18" - 24" from Shell / 4" - 6" Below Grade',
      jobsiteNote: 'When ringing the pool with the #6 AWG bare copper bonding wire, you cannot just lay it wherever. It must be buried exactly 4 to 6 inches below the subgrade, and positioned 18 to 24 inches outward from the pool shell to properly capture step-voltage gradients before a person touches the water.'
    }
  ],
	can_nbcc: [
		{
      id: 'nbcc_acc_corridor_width',
      category: 'accessibility',
      title: 'Barrier-Free Path of Travel (Corridors)',
      codeRef: 'NBCC 3.8.3.2.(1)',
      summary: 'Minimum width for hallways and corridors serving as an accessible route.',
      metricVal: 'Min 1100 mm Width',
      imperialVal: 'Min 43-1/4" Width',
      jobsiteNote: 'If a hallway is designated as a barrier-free path, standard 860 mm (34") residential width is illegal. Frame wide enough to guarantee an unobstructed finished width of at least 1100 mm.'
    },
    {
      id: 'nbcc_acc_ramp_landings',
      category: 'accessibility',
      title: 'Accessible Ramp Landings',
      codeRef: 'NBCC 3.8.3.5.(1)',
      summary: 'Required dimensions for level resting platforms at directional changes of a ramp.',
      metricVal: 'Min 1500 mm x 1500 mm',
      imperialVal: 'Min 60" x 60"',
      jobsiteNote: 'If a ramp changes direction (L-shape or U-shape), there must be a perfectly level (max 2% cross-slope) 5-foot by 5-foot landing platform at the corner.'
    },
    {
      id: 'nbcc_acc_door_latch_clearance',
      category: 'accessibility',
      title: 'Door Latch Side Clearance',
      codeRef: 'NBCC 3.8.3.6.(11)',
      summary: 'Required empty wall space immediately beside the handle (latch) side of a door.',
      metricVal: 'Min 600 mm on Pull Side / 300 mm on Push Side',
      imperialVal: 'Min 24" on Pull Side / 12" on Push Side',
      jobsiteNote: 'You cannot frame a barrier-free door tightly into a corner. Leave at least 24 inches of blank wall space on the "pull" side so a wheelchair user can reach the handle.'
    },
    {
      id: 'nbcc_acc_toilet_height',
      category: 'accessibility',
      title: 'Accessible Toilet Seat Height',
      codeRef: 'NBCC 3.8.3.15',
      summary: 'Mandatory vertical height for the seating surface of an accessible water closet.',
      metricVal: '460 mm to 485 mm Above Floor',
      imperialVal: '18-1/8" to 19-1/8" Above Floor',
      jobsiteNote: 'An ADA/Barrier-Free compliant toilet bowl (Comfort Height) must sit between 460 and 485 mm high including the seat.'
    },
    {
      id: 'nbcc_pool_underground_wiring',
      category: 'pools',
      title: 'Underground Wiring Clearance',
      codeRef: 'CEC 68-056',
      summary: 'Minimum separation distance between buried electrical cables and the pool structure.',
      metricVal: 'No Buried Cables within 1.5 m of Pool',
      imperialVal: 'No Buried Cables within 5 ft of Pool',
      jobsiteNote: 'When trenching power to a shed or landscaping lights, you CANNOT run underground PVC conduit or NMWU cable within 1.5 meters (5 feet) of pool walls.'
    },
    {
      id: 'nbcc_pool_pump_gfci',
      category: 'pools',
      title: 'Pool Pump GFCI Protection',
      codeRef: 'CEC 68-068',
      summary: 'Mandatory ground-fault protection for the electrical motor circulating the pool water.',
      metricVal: 'Class A GFCI Protection Required',
      imperialVal: 'Class A GFCI Protection Required',
      jobsiteNote: 'The pool pump itself must be protected by a Class A GFCI breaker, regardless of whether it is hardwired or plugged into a receptacle.'
    },
    {
      id: 'nbcc_pool_enclosure_bylaw',
      category: 'pools',
      title: 'Pool Enclosure (Municipal Standard)',
      codeRef: 'Standard Municipal By-Law',
      summary: 'Universal Canadian municipal standard for private swimming pool fences.',
      metricVal: 'Min 1.2 m Tall, Non-Climbable, Self-Latching',
      imperialVal: 'Min 48" Tall, Non-Climbable, Self-Latching',
      jobsiteNote: 'Enforced by municipal by-law across Canada: 1.2-meter (48-inch) fence minimum. Chain link max 1.5-inch mesh; vertical boards max 4-inch gap. Gate must be self-closing and self-latching.'
    },
    {
      id: 'nbcc_stair_rise',
      category: 'stairs',
      title: 'Maximum & Minimum Riser Height',
      codeRef: 'NBCC 9.8.4.1',
      summary: 'Allowable vertical rise per step for stairs serving a single house or dwelling unit.',
      metricVal: '200 mm Max (125 mm Min)',
      imperialVal: '7-7/8" Max (5" Min)',
      jobsiteNote: 'Uniformity tolerance: Adjacent risers must not vary by more than 5 mm (3/16"); total variation across the flight cannot exceed 10 mm (3/8").'
    },
    {
      id: 'nbcc_stair_run',
      category: 'stairs',
      title: 'Minimum & Maximum Tread Run',
      codeRef: 'NBCC 9.8.4.1',
      summary: 'Horizontal run dimension between adjacent nosing lines on interior or exterior flights.',
      metricVal: '210 mm Min (355 mm Max)',
      imperialVal: '8-1/4" Min (14" Max)',
      jobsiteNote: 'Where tread run is less than 248 mm (9-3/4"), treads must project at least 25 mm (1") as a rounded or beveled nosing.'
    },
    {
      id: 'nbcc_stair_depth',
      category: 'stairs',
      title: 'Minimum Overall Tread Depth',
      codeRef: 'NBCC 9.8.4.1',
      summary: 'Total horizontal depth of the physical step surface from leading nosing edge to back riser face.',
      metricVal: '235 mm Min (355 mm Max)',
      imperialVal: '9-1/4" Min (14" Max)',
      jobsiteNote: 'Exterior wooden deck stairs often utilize two 2x6 boards (approx. 11" depth) to comfortably exceed this baseline.'
    },
    {
      id: 'nbcc_stair_headroom',
      category: 'stairs',
      title: 'Minimum Clear Headroom',
      codeRef: 'NBCC 9.8.2.1',
      summary: 'Vertical overhead clearance required above the plane of the tread nosings throughout the entire flight and landings.',
      metricVal: '1950 mm Min',
      imperialVal: '6\'5" Min (76-3/4")',
      jobsiteNote: 'Must be maintained across intermediate landings and under structural beams trimming the stair well.'
    },
    {
      id: 'nbcc_stair_width',
      category: 'stairs',
      title: 'Minimum Stairway Clear Width',
      codeRef: 'NBCC 9.8.2.1',
      summary: 'Clear interior width between bounding walls serving a single dwelling unit.',
      metricVal: '860 mm Min',
      imperialVal: '34" Min',
      jobsiteNote: 'Handrails and stringers are permitted to project into this clear width by up to 100 mm (4") on each side.'
    },
    {
      id: 'nbcc_stair_handrail_height',
      category: 'stairs',
      title: 'Handrail Height Range',
      codeRef: 'NBCC 9.8.7.4',
      summary: 'Vertical height range for continuous handrails along stair flights.',
      metricVal: '865 mm Min to 1070 mm Max',
      imperialVal: '34" Min to 42" Max',
      jobsiteNote: 'NBCC permits handrails up to 1070 mm (42") high, which allows a second-floor 42" landing guardrail to continue seamlessly down the flight.'
    },
		{
      id: 'nbcc_guard_trigger',
      category: 'decks',
      title: 'Elevation Requiring Guardrails',
      codeRef: 'NBCC 9.8.8.1',
      summary: 'Vertical height difference between the walking surface and adjacent surface/grade that triggers mandatory guard protection.',
      metricVal: '600 mm Drop',
      imperialVal: '24" Drop (2 ft)',
      jobsiteNote: 'Where guardrails are not required (drop < 600mm), built-in bench seating or wide terraced steps can serve as edge definitions.'
    },
    {
      id: 'nbcc_guard_height_low',
      category: 'decks',
      title: 'Guardrail Height (Drop ≤ 1.8m)',
      codeRef: 'NBCC 9.8.8.2',
      summary: 'Minimum top rail height for interior surfaces or exterior decks where the fall distance is 1800 mm or less.',
      metricVal: '900 mm Min',
      imperialVal: '35-1/2" Min',
      jobsiteNote: 'Always verify final deck board thickness before cutting post heights so your finished top rail clears the 900mm mark.'
    },
		{
      id: 'all_framing_attic_ladder',
      category: 'framing',
      title: 'Pull-Down Attic Ladder Truss Cutting',
      codeRef: 'OBC / NBCC 9.23.13.11 / IRC R802.10.4',
      summary: 'Strict prohibition against cutting bottom chords of engineered roof trusses to fit pull-down attic access stairs.',
      metricVal: 'Zero Cutting Without Stamped Engineer Drawing',
      imperialVal: 'Zero Cutting Without Stamped Engineer Drawing',
      jobsiteNote: 'If a rough opening for folding attic stairs does not fit between the standard 24" OC bottom chords of your roof trusses, you CANNOT saw through a truss chord to header it out. You must either order a narrow 22.5" rough-in ladder or get a structural engineer\'s stamped repair detail.'
    },
    {
      id: 'nbcc_guard_height_high',
      category: 'decks',
      title: 'Guardrail Height (Drop > 1.8m)',
      codeRef: 'NBCC 9.8.8.2',
      summary: 'Minimum top rail height when the exterior fall distance exceeds 1800 mm (5\'11").',
      metricVal: '1070 mm Min',
      imperialVal: '42" Min',
      jobsiteNote: 'Measure the fall drop from the top of the deck to the lowest point of grade immediately adjacent to the edge.'
    },
    {
      id: 'nbcc_guard_spacing',
      category: 'decks',
      title: 'Baluster & Infill Opening Spacing',
      codeRef: 'NBCC 9.8.8.5',
      summary: 'Maximum opening clearance between vertical spindles or infill sections.',
      metricVal: '100 mm Sphere Rule',
      imperialVal: '4" Sphere Rule',
      jobsiteNote: 'The 100mm spherical rule applies everywhere except the triangular opening formed beneath the bottom rail and stair treads, which allows up to a 150mm (6") sphere.'
    },
    {
      id: 'nbcc_guard_climbing',
      category: 'decks',
      title: 'Non-Climbable Design Rules',
      codeRef: 'NBCC 9.8.8.6',
      summary: 'Restrictions against horizontal rails or cable systems that create ladder-like climbing hazards.',
      metricVal: 'Applies if Drop > 4.2 m',
      imperialVal: 'Applies if Drop > 13\'9"',
      jobsiteNote: 'If the drop is below 4.2m (13\'9"), horizontal cable railings are generally permitted by the national code, though local municipal inspectors often enforce stricter interpretations.'
    },
		{
      id: 'nbcc_deck_live_load',
      category: 'decks',
      title: 'Design Live Load Capacity',
      codeRef: 'NBCC Table 4.1.5.3',
      summary: 'Minimum uniform live load requirement for exterior residential platforms, decks, and balconies.',
      metricVal: '1.9 kPa Live Load',
      imperialVal: '40 PSF Live Load',
      jobsiteNote: 'In regions with extreme winter climates, if the specified ground snow load exceeds 1.9 kPa, the deck framing must be sized to carry the heavier snow load.'
    },
    {
      id: 'nbcc_deck_joist_cantilever',
      category: 'decks',
      title: 'Maximum Joist Cantilever',
      codeRef: 'NBCC 9.23.9.9',
      summary: 'Maximum allowable overhang of floor joists projecting beyond their outer support beam.',
      metricVal: '400 mm Max (Nominal)',
      imperialVal: '16" Max (Nominal)',
      jobsiteNote: 'For 2x8 joists, limit cantilevers to 14". For 2x10 joists, 16" is standard. Always install solid solid blocking directly above the support beam to prevent joist rotation.'
    },
		{
      id: 'all_deck_ijoist_ledger',
      category: 'decks',
      title: 'Ledger Attachment to Engineered I-Joist Rim Board',
      codeRef: 'IRC R507.9.1.2 / NBC / OBC Spec',
      summary: 'Attachment rules when bolting a deck ledger into an engineered wood rim board (rim joist).',
      metricVal: 'Requires Interior 38mm Backer Blocking or Manufacturer Spec',
      imperialVal: 'Requires Interior 2x Backer Blocking or Manufacturer Spec',
      jobsiteNote: 'You CANNOT lag bolt a deck ledger into an engineered OSB rim board alone. You must install continuous 2x8/2x10 solid wood or engineered backer blocking inside the joist bays against the inside face of the rim board before through-bolting.'
    },
    {
      id: 'nbcc_deck_bearing',
      category: 'decks',
      title: 'Minimum End Bearing Length',
      codeRef: 'NBCC 9.23.9.1',
      summary: 'Minimum length of solid structural support required at the ends of framing members.',
      metricVal: '38 mm Min on Wood/Steel',
      imperialVal: '1-1/2" Min on Wood/Steel',
      jobsiteNote: 'Where joists frame into the side of a ledger or drop beam rather than resting on top, rated galvanized joist hangers must be used.'
    },
    {
      id: 'nbcc_deck_fasteners',
      category: 'decks',
      title: 'Corrosion-Resistant Fasteners',
      codeRef: 'NBCC 9.23.3.1',
      summary: 'Requirement for exterior structural hardware, hangers, and nails to resist corrosion from weather and preservative-treated lumber chemicals.',
      metricVal: 'Hot-Dipped Galv (G185) or Stainless',
      imperialVal: 'Hot-Dipped Galv (G185) or Stainless',
      jobsiteNote: 'Standard electro-galvanized fasteners will corrode rapidly inside ACQ or Copper Azole pressure-treated wood. Always look for Z-MAX or 316 Stainless ratings.'
    },
		{
      id: 'nbcc_deck_ledger_support',
      category: 'decks',
      title: 'Ledger Vertical Support Requirements',
      codeRef: 'NBCC 9.23.16.1',
      summary: 'Requirement for positive vertical load transfer where deck ledgers attach to wood-framed buildings.',
      metricVal: 'Rest directly on Foundation or Through-Bolt',
      imperialVal: 'Rest directly on Foundation or Through-Bolt',
      jobsiteNote: 'Where possible, step the concrete foundation wall down slightly so the deck ledger rests directly on a concrete shelf, eliminating shear reliance on lag bolts.'
    },
    {
      id: 'nbcc_deck_joist_hangers',
      category: 'decks',
      title: 'Joist Hanger Fastener Compliance',
      codeRef: 'NBCC 9.23.9.2',
      summary: 'Rules governing the exact type and capacity of nails/screws installed in galvanized metal framing connectors.',
      metricVal: 'Fill ALL Holes w/ Manufacturer Spec Nails',
      imperialVal: 'Fill ALL Holes w/ Manufacturer Spec Nails',
      jobsiteNote: 'Never use roofing nails, drywall screws, or standard deck screws in joist hangers. Use manufacturer-specified structural connector nails (e.g., 1.5" or 3" 10-gauge structural nails).'
    },
		{
      id: 'nbcc_stair_stringer_throat',
      category: 'stairs',
      title: 'Effective Stringer Throat Depth',
      codeRef: 'NBCC 9.8.9.4',
      summary: 'Minimum solid, uncut wood depth required along the diagonal run of a cut stair stringer.',
      metricVal: '90 mm Minimum Throat Depth',
      imperialVal: '3-1/2" Minimum Throat Depth',
      jobsiteNote: 'To achieve a 3.5" effective throat on a stair flight with 7.5" risers and 10" runs, you must start with at least a 2x12 nominal lumber board. A 2x10 will leave the throat structurally deficient.'
    },
    {
      id: 'nbcc_stair_lighting',
      category: 'stairs',
      title: 'Stairway & Landing Illumination',
      codeRef: 'NBCC 9.8.7.7 / 9.34.2.3',
      summary: 'Mandatory artificial lighting requirements for interior and exterior residential stairs.',
      metricVal: '50 Lux Min at Tread/Landing Levels',
      imperialVal: 'approx. 5 Foot-Candles at Tread Levels',
      jobsiteNote: 'Exterior deck stairs must have an exterior light fixture controlled by a 3-way switch (or automatic motion/photo sensor) illuminating the entire run of stairs and bottom landing.'
    },
		{
      id: 'nbcc_handrail_termination',
      category: 'stairs',
      title: 'Handrail End Continuity & Termination',
      codeRef: 'NBCC 9.8.7.3',
      summary: 'Safety requirements for the starting and ending points of stair handrails.',
      metricVal: 'Return to Wall, Post, or Safety Scroll',
      imperialVal: 'Return to Wall, Post, or Safety Scroll',
      jobsiteNote: 'Handrails cannot end with an open, exposed straight cut where clothing, purses, or tool belts can snag. Ends must curve back into the wall or terminate into a newel post.'
    },
    {
      id: 'nbcc_guard_glass',
      category: 'decks',
      title: 'Glass Guardrail Infill Panels',
      codeRef: 'NBCC 9.8.8.7',
      summary: 'Safety glazing mandates for transparent or tinted glass panels installed inside deck guardrails.',
      metricVal: 'Laminated or Tempered Safety Glass Only',
      imperialVal: 'Laminated or Tempered Safety Glass Only',
      jobsiteNote: 'All glass infill panels must carry a permanent, etched safety certification mark (CAN/CGSB-12.1 or ANSI Z97.1) visible after installation.'
    },
		{
      id: 'nbcc_deck_wood_treatment',
      category: 'decks',
      title: 'Ground Contact Preservative Rating',
      codeRef: 'NBCC 9.3.2.9 / CSA O80',
      summary: 'Mandatory chemical preservative treatment levels for structural lumber touching soil, concrete footings, or fresh water.',
      metricVal: 'Use Ground Contact (UC4A) Rated Lumber',
      imperialVal: 'Use Ground Contact (UC4A) Rated Lumber',
      jobsiteNote: 'Standard Above-Ground (UC3B) pressure-treated decking lumber will rot prematurely if buried or laid on footings. Verify the end-tags on 6x6 posts specify "Ground Contact" or "UC4A".'
    },
    {
      id: 'nbcc_deck_cut_end_treatment',
      category: 'decks',
      title: 'Field-Cut End Preservative Application',
      codeRef: 'NBCC 9.3.2.9.(3)',
      summary: 'Requirement to chemically seal all jobsite cuts, notches, and drilled holes in pressure-treated lumber.',
      metricVal: 'Apply Copper Naphthenate End-Cut Sealer',
      imperialVal: 'Apply Copper Naphthenate End-Cut Sealer',
      jobsiteNote: 'Factory pressure treatment does not penetrate 100% to the center of thick posts or drop beams. Whenever you cut or notch a post, brush on end-cut preservative to prevent internal core rot.'
    },

    // --- STAIRS & RAILINGS ---
    {
      id: 'nbcc_stair_slip_resistance',
      category: 'stairs',
      title: 'Exterior Stair Tread Slip Resistance',
      codeRef: 'NBCC 9.8.9.6',
      summary: 'Surface finish requirements to prevent slipping hazards on exterior residential stair steps during wet or freezing weather.',
      metricVal: 'Slip-Resistant Surface or Nosing Strips',
      imperialVal: 'Slip-Resistant Surface or Nosing Strips',
      jobsiteNote: 'Standard smooth composite decking boards can become ice rinks in Canadian winters. Use grooved profile boards or install dedicated high-traction nosing strips on exterior flights.'
    },
    {
      id: 'nbcc_guard_window_adjacent',
      category: 'stairs',
      title: 'Window Fall Protection Near Stairs',
      codeRef: 'NBCC 9.8.8.1.(4)',
      summary: 'Mandatory protective railing or safety glazing when operable windows are situated directly adjacent to stairways or landings.',
      metricVal: 'Guard Required if Sill < 900 mm Above Tread',
      imperialVal: 'Guard Required if Sill < 35-1/2" Above Tread',
      jobsiteNote: 'If a window opening along a stairway has a sill lower than 900mm above the adjacent tread, you must either install a protective safety bar across the window or fix the opening mechanism so it cannot open more than 100mm.'
    },
		{
      id: 'nbcc_roof_venting',
      category: 'framing',
      title: 'Attic Ventilation Ratio',
      codeRef: 'NBCC 9.19.1.1',
      summary: 'Minimum unobstructed vent area required for roof spaces above insulated ceilings.',
      metricVal: '1/300 of Insulated Ceiling Area',
      imperialVal: '1/300 of Insulated Ceiling Area',
      jobsiteNote: 'If the roof pitch is exceptionally low (less than 2/12), the venting requirement increases strictly to 1/150 of the ceiling area to combat restricted airflow.'
    },
    {
      id: 'nbcc_roof_truss_alteration',
      category: 'framing',
      title: 'Prohibition of Truss Alterations',
      codeRef: 'NBCC 9.23.13.11',
      summary: 'Strict prohibition against modifying factory-built structural roof trusses on site.',
      metricVal: 'No Cutting, Notching, or Drilling',
      imperialVal: 'No Cutting, Notching, or Drilling',
      jobsiteNote: 'Unlike conventional rafters, you cannot cut, notch, or drill the chords or webs of an engineered truss for plumbing or HVAC runs without stamped approval from a structural engineer.'
    },
    {
      id: 'nbcc_roof_rafter_fastening',
      category: 'framing',
      title: 'Rafter to Top Plate Fastening',
      codeRef: 'NBCC Table 9.23.3.4',
      summary: 'Minimum nail count and size for securing conventional roof rafters to the exterior wall top plate.',
      metricVal: 'Three 82 mm Toe-Nails',
      imperialVal: 'Three 3-1/4" Toe-Nails',
      jobsiteNote: 'In areas with high wind exposure, standard toe-nailing is often insufficient to resist uplift. Engineered metal hurricane ties (e.g., H2.5A) are highly recommended or locally mandated.'
    },
    {
      id: 'nbcc_roof_sheathing_clips',
      category: 'framing',
      title: 'Roof Sheathing Panel Edge Support',
      codeRef: 'NBCC 9.23.15.4',
      summary: 'Requirement for H-clips between plywood or OSB roof sheathing panels to prevent edge deflection.',
      metricVal: 'Required if Trusses > 400 mm OC',
      imperialVal: 'Required if Trusses > 16" OC',
      jobsiteNote: 'When framing trusses at 24" on center with standard 3/8" or 7/16" OSB, you must install H-clips midway between trusses on all horizontal panel edges.'
    },
    {
      id: 'nbcc_roof_attic_access',
      category: 'framing',
      title: 'Attic Access Hatch Sizing',
      codeRef: 'NBCC 9.19.2.1',
      summary: 'Minimum required dimensions for the access hatch into an unfinished roof or attic space.',
      metricVal: '500 mm x 700 mm Min Opening',
      imperialVal: '20" x 28" Min Opening',
      jobsiteNote: 'The hatch must be fully weather-stripped and insulated to match the surrounding ceiling insulation value to prevent massive heat loss and condensation.'
    },
		{
      id: 'nbcc_roof_vaulted_ridge',
      category: 'framing',
      title: 'Structural Ridge Beams (Vaulted Ceilings)',
      codeRef: 'NBCC 9.23.13.8',
      summary: 'Requirement for a structural ridge beam (rather than a non-structural 1x ridge board) when ceiling joists are omitted.',
      metricVal: 'Required if Slope < 1:3 or No Rafter Ties',
      imperialVal: 'Required if Pitch < 4/12 or No Rafter Ties',
      jobsiteNote: 'If you are framing a cathedral/vaulted ceiling where there are no horizontal ceiling joists tying the walls together, the ridge must be an engineered structural beam supported by columns at both ends to prevent the roof from flattening and pushing the walls out.'
    },
    {
      id: 'nbcc_roof_gable_overhang',
      category: 'framing',
      title: 'Gable End Overhangs (Lookouts)',
      codeRef: 'NBCC 9.23.13.9',
      summary: 'Framing requirements for barge rafters (fly rafters) extending out over gable walls.',
      metricVal: 'Lookouts Required if Overhang > 300 mm',
      imperialVal: 'Lookouts Required if Overhang > 12"',
      jobsiteNote: 'If your gable overhang is more than 12", you cannot just nail the fascia rafter into the roof sheathing. You must drop the gable wall framing and install structural lookouts extending back into the first interior rafter/truss.'
    },
    {
      id: 'nbcc_roof_step_flashing',
      category: 'framing',
      title: 'Step Flashing at Wall Intersections',
      codeRef: 'NBCC 9.26.4.3',
      summary: 'Mandatory flashing method where a sloped roof intersects a vertical wall (e.g., dormers or second-story additions).',
      metricVal: '150 mm High x 150 mm Wide',
      imperialVal: '6" High x 6" Wide',
      jobsiteNote: 'Step flashing must be woven (interleaved) with each successive course of shingles. A continuous piece of L-flashing running down the slope is prohibited for asphalt shingles and will leak.'
    },
		{
      id: 'nbcc_roof_hip_valley',
      category: 'framing',
      title: 'Hip & Valley Rafter Depth',
      codeRef: 'NBCC 9.23.13.6',
      summary: 'Prescriptive structural rules for main diagonal members at roof plane intersections.',
      metricVal: 'Depth ≥ Full Plumb Cut of Jacks',
      imperialVal: 'Depth ≥ Full Plumb Cut of Jacks',
      jobsiteNote: 'Because hip and valley rafters sit at a 45° angle on the plan view, their actual span is significantly longer than common rafters. Always verify span tables before assuming a standard common rafter depth will suffice.'
    },
    {
      id: 'nbcc_roof_purlin_support',
      category: 'framing',
      title: 'Mid-Span Purlin Rafter Support',
      codeRef: 'NBCC 9.23.13.7',
      summary: 'Allowable span reduction technique using horizontal purlins supported by diagonal struts.',
      metricVal: '38x89 mm Min Struts to Bearing Wall',
      imperialVal: '2x4 Nominal Min Struts to Bearing Wall',
      jobsiteNote: 'When installing purlins across rafters to reduce their allowable span, the purlin board itself must be sized to support the rafter loads between struts (typically 2x6 or 2x8 flat against the rafters).'
    },
    {
      id: 'nbcc_roof_sheathing_thickness',
      category: 'framing',
      title: 'Minimum Roof Sheathing Thickness',
      codeRef: 'NBCC Table 9.23.16.2.A',
      summary: 'Required panel thickness for structural roof sheathing based on rafter or truss spacing.',
      metricVal: '9.5 mm Min (with H-Clips @ 600 mm OC)',
      imperialVal: '3/8" Min (with H-Clips @ 24" OC)',
      jobsiteNote: 'While 9.5 mm (3/8") OSB is technically permitted on 24" truss centers with metal H-clips, 11.1 mm (7/16") or 12.7 mm (1/2") is strongly recommended on professional job sites to eliminate roof deck sponginess under foot traffic.'
    },
    {
      id: 'nbcc_roof_gable_wind_bracing',
      category: 'framing',
      title: 'Gable End Wall Lateral Wind Bracing',
      codeRef: 'NBCC 9.23.13.11',
      summary: 'Required lateral restraint connecting tall end gable walls back into the roof diaphragm to resist severe wind loads.',
      metricVal: 'Lateral Bracing Required on Tall Gables',
      imperialVal: 'Lateral Bracing Required on Tall Gables',
      jobsiteNote: 'Balloon-framed gable end walls in attics can flex or hinge under heavy wind pressure. Tie the top of the gable end wall back to interior roof trusses using 2x4 continuous lateral bracing angled down at 45°.'
    },
		{
      id: 'nbcc_floor_joist_bearing',
      category: 'framing',
      title: 'Minimum Joist End Bearing Length',
      codeRef: 'NBCC 9.23.9.1',
      summary: 'Minimum solid structural bearing length required at the ends of wood floor joists.',
      metricVal: '38 mm Min on Wood / 76 mm on Masonry',
      imperialVal: '1-1/2" Min on Wood / 3" on Masonry',
      jobsiteNote: 'When framing floor joists into a steel I-beam in a basement, joists must rest on a 38x89mm (2x4) wood ledger bolted to the web, with at least 38mm of solid end contact.'
    },
    {
      id: 'nbcc_floor_joist_bridging',
      category: 'framing',
      title: 'Floor Joist Lateral Restraint',
      codeRef: 'NBCC 9.23.9.4',
      summary: 'Required intermediate cross-bridging or strapping to stabilize floor joists against lateral buckling.',
      metricVal: 'Required if Joist Span > 2100 mm',
      imperialVal: 'Required if Joist Span > 6\'11"',
      jobsiteNote: 'For engineered wood I-joists or open-web floor trusses, solid blocking or continuous ribbon boards must be installed strictly per the manufacturer\'s layout specifications.'
    },
    {
      id: 'nbcc_floor_joist_notching',
      category: 'framing',
      title: 'Notching Solid Floor Joists',
      codeRef: 'NBCC 9.23.5.2',
      summary: 'Allowable notch depth and placement along solid wood floor joists.',
      metricVal: 'Max Depth = 1/3 Joist Depth (Near Support Only)',
      imperialVal: 'Max Depth = 1/3 Joist Depth (Near Support Only)',
      jobsiteNote: 'Never cut notches into the top or bottom flanges of engineered I-joists or floor trusses. Only the solid lumber web areas of conventional 2x framing can be notched.'
    },
    {
      id: 'nbcc_floor_joist_drilling',
      category: 'framing',
      title: 'Drilling Holes in Floor Joists',
      codeRef: 'NBCC 9.23.5.1',
      summary: 'Bored hole size limits for solid sawn lumber floor joists.',
      metricVal: 'Max Hole = 1/4 Joist Depth',
      imperialVal: 'Max Hole = 1/4 Joist Depth',
      jobsiteNote: 'Ensure at least 50mm (2") of solid wood remains between the edge of the hole and the top or bottom of the joist. Do not drill multiple large holes close together.'
    },
    {
      id: 'nbcc_floor_subfloor_fastening',
      category: 'framing',
      title: 'Subfloor Fastener Schedule',
      codeRef: 'NBCC Table 9.23.3.5.A',
      summary: 'Required nail or screw spacing schedule for attaching subfloor panels to floor joists.',
      metricVal: '150 mm OC Edges / 300 mm OC Field',
      imperialVal: '6" OC Panel Edges / 12" OC Field',
      jobsiteNote: 'Use 51mm (2") ring-shank subfloor nails or #8 wood screws. Fasteners along panel edges must be held back at least 10mm (3/8") from the board edge to prevent blowout.'
    },
    {
      id: 'nbcc_floor_deflection',
      category: 'framing',
      title: 'Floor System Structural Deflection Limit',
      codeRef: 'NBCC Table 9.23.4.2',
      summary: 'Mandatory structural stiffness limit for residential floor spans to prevent excessive bouncing or vibration.',
      metricVal: 'L/360 Minimum Deflection Limit',
      imperialVal: 'L/360 Minimum Deflection Limit',
      jobsiteNote: 'While L/360 is the legal structural code minimum, natural stone or ceramic tile floors require a much stiffer L/480 or L/600 rating to prevent grout lines and tiles from cracking.'
    },
		{
      id: 'nbcc_floor_beam_nailing',
      category: 'framing',
      title: 'Built-Up Wood Beam Fastening Schedule',
      codeRef: 'NBCC 9.23.8.3',
      summary: 'Specific nailing pattern required when laminating multiple 2x lumber members together to create a flush or drop floor beam.',
      metricVal: '89 mm Nails @ 450 mm OC (Double Row)',
      imperialVal: '3-1/2" Nails @ 18" OC (Double Row)',
      jobsiteNote: 'When assembling a 3-ply or 4-ply 2x10 beam, you must drive two rows of 3-1/2" nails at 18-inch intervals. The nails must be driven from alternate sides of the beam so they penetrate through all inner plies.'
    },
    {
      id: 'nbcc_floor_opening_hangers',
      category: 'framing',
      title: 'Joist Hangers at Floor Openings',
      codeRef: 'NBCC 9.23.9.5.(5)',
      summary: 'Requirement for metal hardware where tail joists meet headers, or headers meet trimmers at stairwell openings.',
      metricVal: 'Required if Header Length > 2 m',
      imperialVal: 'Required if Header Length > 6\'6"',
      jobsiteNote: 'While end-nailing is permitted on very small openings, any stairwell header longer than 2 meters (6\'6") must be supported by rated galvanized joist hangers on both ends.'
    },
    {
      id: 'nbcc_floor_engineered_holes',
      category: 'framing',
      title: 'Holes in Engineered I-Joist Webs',
      codeRef: 'NBCC 9.23.5.1 / Manufacturer Spec',
      summary: 'Allowable placement for drilling plumbing or HVAC holes through the thin OSB web of engineered floor joists.',
      metricVal: 'Per Manufacturer Hole Chart Only',
      imperialVal: 'Per Manufacturer Hole Chart Only',
      jobsiteNote: 'Unlike solid sawn lumber, you can drill massive holes (often 8"+ diameter) in I-joist webs for ductwork—but ONLY if you follow the manufacturer\'s specific "Hole Chart" which dictates exactly how far the hole must be from the bearing walls.'
    },
    {
      id: 'nbcc_floor_joist_splice',
      category: 'framing',
      title: 'Lapped Joist Splices Over Beams',
      codeRef: 'NBCC 9.23.9.1.(4)',
      summary: 'Minimum overlap requirement when floor joists from opposite sides of a house meet and overlap on top of a central steel or wood drop beam.',
      metricVal: '100 mm Minimum Overlap',
      imperialVal: '4" Minimum Overlap',
      jobsiteNote: 'Lapped joists must be nailed together with at least three 3-1/4" nails. Blocking panels must also be installed between the joists over the beam to prevent rotation.'
    },
		{
      id: 'nbcc_floor_sill_protection',
      category: 'framing',
      title: 'Wood Framing on Concrete Foundations',
      codeRef: 'NBCC 9.23.2.2 / 9.23.2.3',
      summary: 'Requirements for separating wood structural members from ground-contact or concrete moisture transmission.',
      metricVal: 'Dampproof Membrane or Treated Lumber',
      imperialVal: 'Dampproof Membrane or Treated Lumber',
      jobsiteNote: 'Any wood framing member resting directly on concrete less than 150 mm (6 inches) above exterior grade must be pressure-treated. If above 6 inches, standard lumber can be used but MUST be separated by a foam gasket or poly moisture barrier.'
    },
    {
      id: 'nbcc_floor_draftstopping',
      category: 'framing',
      title: 'Draftstopping in Concealed Floor Spaces',
      codeRef: 'NBCC 9.10.16.1',
      summary: 'Mandatory fire-blocking required in large concealed floor cavities (like open-web trusses or dropped ceilings) to prevent rapid fire spread.',
      metricVal: 'Block areas exceeding 20 m² or 20 m length',
      imperialVal: 'Block areas exceeding 215 sq.ft or 65 ft length',
      jobsiteNote: 'If you are using open-web floor trusses that create continuous hollow pathways across the entire house, you must install solid wood panels, drywall, or mineral wool batts at specific intervals to physically block flames and smoke from traveling through the floor system.'
    },
    {
      id: 'nbcc_floor_beam_bearing_length',
      category: 'framing',
      title: 'Steel / Wood Beam Bearing Length',
      codeRef: 'NBCC 9.23.8.1.(2)',
      summary: 'Minimum solid contact length required where a main drop beam rests on a concrete foundation pocket or steel column.',
      metricVal: '89 mm Minimum Solid Bearing',
      imperialVal: '3-1/2" Minimum Solid Bearing',
      jobsiteNote: 'Main structural drop beams carry thousands of pounds of tributary load. They require more than double the bearing length of a standard floor joist. A typical foundation beam pocket must be deep enough to provide at least 3.5 inches of solid level ledge.'
    },
    {
      id: 'nbcc_floor_bridging_fastening',
      category: 'framing',
      title: 'Cross-Bridging Fastening Schedule',
      codeRef: 'NBCC Table 9.23.3.4',
      summary: 'Required nail size and count for installing diagonal wood cross-bridging between floor joists.',
      metricVal: 'Two 57 mm Nails per End',
      imperialVal: 'Two 2-1/4" Nails per End',
      jobsiteNote: 'Nail the top of the bridging securely before the subfloor goes on. DO NOT nail the bottom of the bridging until the subfloor is fully installed and loaded with interior framing, or the joists will squeak as they settle.'
    },
		{
      id: 'nbcc_floor_treated_sill',
      category: 'framing',
      title: 'Wood in Contact with Ground/Masonry',
      codeRef: 'NBCC 9.23.2.2 / 9.23.2.3',
      summary: 'Rules preventing capillary moisture draw into wood framing components resting on concrete.',
      metricVal: 'Treated Wood or Impermeable Separation Required',
      imperialVal: 'Treated Wood or Impermeable Separation Required',
      jobsiteNote: 'If you frame a basement partition wall, the bottom plate sitting on the concrete slab must be pressure-treated, OR you must lay down a continuous strip of 6-mil poly/sill gasket under the untreated plate.'
    },
    {
      id: 'nbcc_floor_end_notches',
      category: 'framing',
      title: 'Notching Joists at Bearing Points',
      codeRef: 'NBCC 9.23.5.2.(1)',
      summary: 'Maximum allowable notch depth at the very ends of floor joists where they rest on a beam or wall.',
      metricVal: 'Max Notch = 1/4 Joist Depth',
      imperialVal: 'Max Notch = 1/4 Joist Depth',
      jobsiteNote: 'Sometimes joists must be notched at the ends to clear a steel I-beam flange or level a floor. This end-notch cannot exceed 1/4 of the joist\'s total depth (e.g., max 2-5/16" cut on a 2x10).'
    },
    {
      id: 'nbcc_floor_engineered_stiffeners',
      category: 'framing',
      title: 'Engineered I-Joist Web Stiffeners',
      codeRef: 'NBCC 9.23.9.1 / Manufacturer Spec',
      summary: 'Requirement for solid wood blocks nailed to the thin OSB web of engineered I-joists at specific high-load locations.',
      metricVal: 'Required at Bearing Points & Point Loads',
      imperialVal: 'Required at Bearing Points & Point Loads',
      jobsiteNote: 'Most I-joist manufacturers require vertical "squash blocks" or web stiffeners to be installed flush against the web wherever the joist rests on an interior drop beam, or wherever a heavy point load (like a load-bearing post) sits on the floor above.'
    },
    {
      id: 'nbcc_floor_fire_block',
      category: 'framing',
      title: 'Concealed Floor Space Fireblocks',
      codeRef: 'NBCC 9.10.16.1',
      summary: 'Requirement to block off hidden interconnected air spaces in floor framing to prevent rapid fire spread.',
      metricVal: 'Block Intersections > 20 m²',
      imperialVal: 'Block Intersections > 215 sq ft',
      jobsiteNote: 'If you frame a dropped ceiling below the floor joists (creating a hidden gap), or frame intersecting bulkheads, you must install fire-blocking (solid 2x lumber, 1/2" drywall, or mineral wool) to prevent the joist bays from acting as a continuous chimney for fire.'
    },
		{
      id: 'nbcc_lintel_bearing',
      category: 'framing',
      title: 'Lintel End Bearing Length',
      codeRef: 'NBCC 9.23.12.3',
      summary: 'Minimum contact area where the bottom of the lintel rests on the vertical jack/trimmer stud.',
      metricVal: '38 mm Min (76 mm for Spans > 3m)',
      imperialVal: '1-1/2" Min (3" for Spans > 10 ft)',
      jobsiteNote: 'For large picture windows or double sliding doors with spans exceeding 3 meters (approx. 10 feet), you must upgrade to double jack studs under each end of the lintel.'
    },
    {
      id: 'nbcc_lintel_king_stud',
      category: 'framing',
      title: 'King Stud Fastening',
      codeRef: 'NBCC Table 9.23.3.4',
      summary: 'Required structural connection between the continuous king stud and the jack stud/lintel assembly.',
      metricVal: '76 mm Nails @ 300 mm OC',
      imperialVal: '3" Nails @ 12" OC',
      jobsiteNote: 'The jack stud must be heavily nailed to the full-height king stud beside it to prevent the lintel from twisting or buckling outward under load.'
    },
    {
      id: 'nbcc_lintel_nonbearing',
      category: 'framing',
      title: 'Lintels in Non-Loadbearing Partitions',
      codeRef: 'NBCC 9.23.12.2',
      summary: 'Allowable span for flat framing members in interior non-structural walls.',
      metricVal: 'Single 38x89 mm Flat (Up to 2.4 m)',
      imperialVal: 'Single 2x4 Flat (Up to 8 ft)',
      jobsiteNote: 'To prevent drywall cracking above wide interior double doors (6ft to 8ft spans), it is highly recommended to turn the 2x4 upright rather than flat, even though flat is legally permitted by code.'
    },
    {
      id: 'nbcc_lintel_engineered',
      category: 'framing',
      title: 'Engineered Wood Lintels (LVL / Glulam)',
      codeRef: 'NBCC 9.23.12.1',
      summary: 'Use of structural composite lumber to span openings exceeding standard solid-sawn lumber tables.',
      metricVal: 'Sized per Manufacturer Spec',
      imperialVal: 'Sized per Manufacturer Spec',
      jobsiteNote: 'Conventional 2x12 spruce lintels max out around 10 to 12 feet depending on the roof load. For double-car garage doors (16 ft wide), you must switch to engineered LVL beams or steel flitch plates sized by the supplier.'
    },
		{
      id: 'nbcc_lintel_deflection',
      category: 'framing',
      title: 'Lintel Deflection Limits for Glass',
      codeRef: 'NBCC 9.23.4.2',
      summary: 'Maximum allowable structural sagging (deflection) over windows and sliding glass doors to prevent glass breakage and track binding.',
      metricVal: 'Max Deflection = Span / 360',
      imperialVal: 'Max Deflection = Span / 360',
      jobsiteNote: 'For wide patio doors (e.g., 9 to 12 feet), even if a 3-ply 2x10 passes for structural strength, it might fail for deflection and slowly crush the door frame over time. LVL or steel beams are highly recommended for spans over 8 feet to minimize long-term sagging.'
    },
    {
      id: 'nbcc_lintel_top_plate',
      category: 'framing',
      title: 'Top Plate Splices Over Openings',
      codeRef: 'NBCC 9.23.11.4.(3)',
      summary: 'Restrictions on where the double top plate of a wall can be spliced in relation to a lintel.',
      metricVal: 'Do Not Splice Directly Over Lintel',
      imperialVal: 'Do Not Splice Directly Over Lintel',
      jobsiteNote: 'Avoid breaking (splicing) the top plates directly above a window or door opening. If a splice must occur there, it must be strapped with a heavy-duty galvanized tension plate to maintain the wall\'s lateral continuous tie.'
    },
    {
      id: 'nbcc_lintel_flitch_plate',
      category: 'framing',
      title: 'Steel Flitch Plate Fastening',
      codeRef: 'NBCC 9.23.12.1 / Part 4',
      summary: 'Requirement for bolting steel plates sandwiched between wood plies to increase lintel capacity.',
      metricVal: 'Through-Bolts Required (Staggered)',
      imperialVal: 'Through-Bolts Required (Staggered)',
      jobsiteNote: 'When using a steel flitch plate inside a wood lintel, nails are not sufficient. The assembly must be through-bolted (typically 1/2" carriage bolts staggered at 16" intervals) as specified by the engineer\'s design.'
    },
		{
      id: 'nbcc_env_vapour_permeance',
      category: 'envelope',
      title: 'Vapour Barrier Permeance Limit',
      codeRef: 'NBCC 9.25.4.2',
      summary: 'Maximum allowable moisture transmission rate for materials acting as the primary vapour barrier.',
      metricVal: 'Max 60 ng/(Pa·s·m²) [~1.0 Perm]',
      imperialVal: 'Max 60 ng/(Pa·s·m²) [~1.0 Perm]',
      jobsiteNote: 'Standard 6-mil polyethylene easily meets this, but some smart vapour retarders or spray foams require verified thickness and manufacturer specs to legally qualify as the vapour barrier for inspection.'
    },
    {
      id: 'nbcc_env_air_barrier_continuity',
      category: 'envelope',
      title: 'Air Barrier Continuity (Airtight Poly Pans)',
      codeRef: 'NBCC 9.25.3.3',
      summary: 'Requirement for continuous sealing of the air barrier system around penetrating elements.',
      metricVal: 'Seal All Penetrations & Junctions',
      imperialVal: 'Seal All Penetrations & Junctions',
      jobsiteNote: 'Electrical boxes on exterior walls must be special airtight boxes (often with a rubber gasket) or wrapped in a poly boot (pan) that is sealed to the main wall vapour/air barrier with acoustical caulking (black death).'
    },
    {
      id: 'nbcc_env_window_flashing',
      category: 'envelope',
      title: 'Window Rough Opening Flashing',
      codeRef: 'NBCC 9.27.3.8',
      summary: 'Mandatory moisture protection detailing around the sill and jambs of window and door penetrations.',
      metricVal: 'Sill Pan Flashing Required',
      imperialVal: 'Sill Pan Flashing Required',
      jobsiteNote: 'You must install a waterproof membrane (peel-and-stick) at the bottom of the rough opening that folds down over the exterior housewrap. Water that gets behind the window siding MUST be directed back out to the exterior.'
    },
    {
      id: 'nbcc_env_waterproofing',
      category: 'envelope',
      title: 'Waterproofing vs. Dampproofing',
      codeRef: 'NBCC 9.13.3.1',
      summary: 'Conditions that trigger upgrading standard foundation dampproofing to a fully impermeable waterproofing system.',
      metricVal: 'Required if Hydrostatic Pressure Exists',
      imperialVal: 'Required if Hydrostatic Pressure Exists',
      jobsiteNote: 'If the foundation is built in a high-water-table area with poor drainage, standard tar dampproofing is illegal. You must use a true waterproofing membrane (like Delta-MS dimple board or thick rubberized asphalt) combined with weeping tiles.'
    },
    {
      id: 'nbcc_env_insulation_contact',
      category: 'envelope',
      title: 'Insulation Contact with Roofing',
      codeRef: 'NBCC 9.19.1.3',
      summary: 'Prohibition of insulation contacting the underside of the roof sheathing in vented assemblies.',
      metricVal: 'Minimum 50 mm Air Gap Required',
      imperialVal: 'Minimum 2" Air Gap Required',
      jobsiteNote: 'If insulation touches the cold roof sheathing, it causes condensation, rot, and invalidates the shingle warranty. Maintain a strict 2-inch gap everywhere from the soffit to the ridge.'
    },
		{
      id: 'nbcc_env_window_head_flashing',
      category: 'envelope',
      title: 'Window & Door Head Flashing (Drip Cap)',
      codeRef: 'NBCC 9.27.3.8.(3)',
      summary: 'Requirement for rigid metal or plastic flashing installed across the top exterior trim of windows and doors.',
      metricVal: '6 mm Drip Lip + 10° Minimum Outward Slope',
      imperialVal: '1/4" Drip Lip + 10° Minimum Outward Slope',
      jobsiteNote: 'Head flashing must slope outward to shed bulk water away from the casing, feature a downward drip lip, and extend vertically behind the exterior housewrap (WRB) by at least 50 mm (2"). End dams are recommended.'
    },
    {
      id: 'nbcc_env_thermal_break_slab',
      category: 'envelope',
      title: 'Foundation Slab-Edge Thermal Break',
      codeRef: 'NBCC 9.25.2.2 / Part 9 Energy',
      summary: 'Insulation detailing required at the junction where a heated concrete floor slab meets an exterior concrete foundation wall.',
      metricVal: 'Rigid Insulation Between Slab Edge & Wall',
      imperialVal: 'Rigid Insulation Between Slab Edge & Wall',
      jobsiteNote: 'Pouring an interior heated concrete slab directly against a perimeter foundation wall creates a direct thermal bridge to cold exterior soil. Place 25 mm to 50 mm (1" to 2") XPS or EPS rigid foam vertically around the slab perimeter.'
    },
    {
      id: 'nbcc_env_cantilever_insulation',
      category: 'envelope',
      title: 'Overhang & Cantilever Floor Insulation',
      codeRef: 'NBCC 9.25.2.4',
      summary: 'Requirements for insulating and air-sealing exposed residential floor cantilevers (e.g., room bump-outs over outdoor air).',
      metricVal: 'High-Density Insulation + Exterior Wind Barrier',
      imperialVal: 'High-Density Insulation + Exterior Wind Barrier',
      jobsiteNote: 'Cantilever floors are notorious for cold floors and drafty rooms. You must install a rigid exterior air/wind barrier (plywood or cement board) on the bottom underside of the joists to prevent wind from blowing through the fibrous insulation.'
    },
		{
      id: 'nbcc_ftg_frost_depth',
      category: 'foundations',
      title: 'Minimum Frost Protection Depth',
      codeRef: 'NBCC 9.12.2.2',
      summary: 'Mandatory minimum foundation depth below finished grade to protect against frost heave action.',
      metricVal: 'Established by Local Climatic Data',
      imperialVal: 'Established by Local Climatic Data',
      jobsiteNote: 'Because the NBCC covers all of Canada, exact frost depths vary by region (e.g., ~1.2 m in coastal provinces up to 1.8 m+ in the Prairies and Territories). Unheated garages or open carports built on slab-on-grade must use engineered floating frost-protected shallow foundations.'
    },
    {
      id: 'nbcc_ftg_strip_dimensions',
      category: 'foundations',
      title: 'Minimum Strip Footing Dimensions',
      codeRef: 'NBCC Table 9.15.3.4',
      summary: 'Baseline concrete width and thickness for continuous footings under exterior walls.',
      metricVal: '250 mm Min Width x 100 mm Min Thickness',
      imperialVal: '10" Min Width x 4" Min Thickness',
      jobsiteNote: 'This 250 mm (10") minimum width applies to 1-story wood-frame construction on solid soil. Adding a second story, masonry veneer (brick), or framing on weaker soils automatically pushes the required footing width up to 350 mm to 500 mm (14" to 20").'
    },
    {
      id: 'nbcc_ftg_projection',
      category: 'foundations',
      title: 'Unreinforced Footing Projection Limit',
      codeRef: 'NBCC 9.15.3.4.(2)',
      summary: 'Maximum horizontal extension of an unreinforced concrete footing past the foundation wall face.',
      metricVal: 'Projection ≤ Footing Thickness',
      imperialVal: 'Projection ≤ Footing Thickness',
      jobsiteNote: 'If architectural layouts require a wide footing pad that projects further than its vertical thickness, transverse steel rebar must be placed across the bottom of the footing to resist tension shear cracking.'
    },
    {
      id: 'nbcc_ftg_pier_sizing',
      category: 'foundations',
      title: 'Isolated Pier / Column Pad Footings',
      codeRef: 'NBCC 9.15.3.5',
      summary: 'Required sizing rules for independent concrete footings carrying point loads from columns or posts.',
      metricVal: '0.4 m² Min Area x 100 mm Min Thickness',
      imperialVal: '4.3 sq ft Min Area x 4" Min Thickness',
      jobsiteNote: 'For round Sonotube piers carrying deck posts, the concrete footing pad at the bottom must still meet minimum surface area rules. A standard 8" or 10" tube poured straight into the dirt without a flared footing pad at the base is frequently insufficient for heavy loads.'
    },
    {
      id: 'nbcc_ftg_water_accumulation',
      category: 'foundations',
      title: 'Footing Excavation Water Control',
      codeRef: 'NBCC 9.12.1.4',
      summary: 'Requirement to keep foundation trenches free of standing water or mud prior to pouring concrete.',
      metricVal: 'Pour Only on Dry, Firm Native Soil',
      imperialVal: 'Pour Only on Dry, Firm Native Soil',
      jobsiteNote: 'Never pour footing concrete into trenches filled with standing water or liquid mud. Water significantly alters the water-cement ratio, weakening the concrete psi and causing immediate structural settlement.'
    },
    {
      id: 'nbcc_ftg_slope_setback',
      category: 'foundations',
      title: 'Footing Setback from Slopes / Banks',
      codeRef: 'NBCC 9.12.2.2 / Geotech Req',
      summary: 'Minimum horizontal distance required between a foundation footing and the descending face of a steep slope or retaining wall.',
      metricVal: 'Typically 1 Horizontal to 1 Vertical (Site Specific)',
      imperialVal: 'Typically 1 Horizontal to 1 Vertical (Site Specific)',
      jobsiteNote: 'You cannot build a house or heavy deck footing right on the edge of a ravine. While Part 9 implies standard setbacks based on soil type (often 1:1 or 2:1 angle of repose), building near descending slopes almost always triggers a municipal demand for a geotechnical engineer\'s sign-off.'
    },
    {
      id: 'nbcc_ftg_unheated_frost',
      category: 'foundations',
      title: 'Frost Depth for Unheated Structures',
      codeRef: 'NBCC 9.12.2.2.(3)',
      summary: 'Increased frost depth requirements for detached garages or porches that do not benefit from heat loss from the main house.',
      metricVal: 'Standard Frost Depth + No Heat Benefit',
      imperialVal: 'Standard Frost Depth + No Heat Benefit',
      jobsiteNote: 'The soil under a heated basement rarely freezes deep. But the soil under a detached unheated garage freezes rock solid. Unheated structure footings must be placed at the absolute maximum frost depth for your region, or utilize engineered floating slab designs.'
    },
    {
      id: 'nbcc_ftg_shallow_insulated',
      category: 'foundations',
      title: 'Frost-Protected Shallow Foundations (FPSF)',
      codeRef: 'NBCC 9.12.2.2.(4)',
      summary: 'Alternative method allowing shallow footings above the frost line by using rigid foam insulation to trap ground heat.',
      metricVal: 'Engineered XPS Skirt Insulation Required',
      imperialVal: 'Engineered XPS Skirt Insulation Required',
      jobsiteNote: 'If you hit solid rock at 2 feet and cannot dig to the 4-foot frost line, you can pour a shallow footing IF you install high-density extruded polystyrene (XPS) rigid foam extending horizontally out from the footing like a skirt to stop the frost from driving downward.'
    },
		{
      id: 'nbcc_ftg_pwf_stone',
      category: 'foundations',
      title: 'Granular Footings for Wood Foundations (PWF)',
      codeRef: 'NBCC 9.15.3.2',
      summary: 'Rules for using crushed stone instead of poured concrete as a footing for Permanent Wood Foundations.',
      metricVal: 'Minimum 19 mm Crushed Stone',
      imperialVal: 'Minimum 3/4" Crushed Stone',
      jobsiteNote: 'When building a treated wood foundation (PWF), you do not pour a concrete footing. Instead, the wood wall sits on a carefully leveled, machine-compacted bed of 3/4" clear crushed stone, fully wrapped in filter fabric to prevent soil infiltration.'
    },
    {
      id: 'nbcc_ftg_water_table',
      category: 'foundations',
      title: 'Footings Below the Water Table',
      codeRef: 'NBCC 9.14.4.1',
      summary: 'Restrictions on placing footings in areas where the seasonal groundwater level rises above the footing elevation.',
      metricVal: 'Requires Engineered Drainage/Pumping',
      imperialVal: 'Requires Engineered Drainage/Pumping',
      jobsiteNote: 'If your excavation fills with water from the water table (not just rain), standard footings and weeping tiles are insufficient. You cannot legally proceed without an engineered de-watering plan or raising the foundation elevation.'
    },
    {
      id: 'nbcc_ftg_continuous_pour',
      category: 'foundations',
      title: 'Cold Joints in Footing Pours',
      codeRef: 'NBCC 9.15.3 / Best Practice',
      summary: 'Structural continuity requirements when a concrete truck runs out and a delay occurs before the next truck arrives.',
      metricVal: 'Must Key or Dowel Cold Joints',
      imperialVal: 'Must Key or Dowel Cold Joints',
      jobsiteNote: 'If a pour is interrupted for too long, the concrete sets, creating a "cold joint." If this happens, you must aggressively roughen the face of the stopped concrete and drive steel rebar dowels into it before pouring the fresh batch to ensure structural continuity.'
    },
		{
      id: 'nbcc_fnd_concrete_strength',
      category: 'foundations',
      title: 'Foundation Wall Concrete Strength',
      codeRef: 'NBCC 9.3.1.6',
      summary: 'Required 28-day compressive strength for poured concrete or ICF foundation walls.',
      metricVal: '15 MPa Minimum (20 MPa for ICF)',
      imperialVal: '2,200 PSI Minimum (2,900 PSI for ICF)',
      jobsiteNote: 'While standard poured walls need 15 MPa, ICF walls inherently require a wetter, higher-slump mix to flow through the rebar grid. Because of this, NBCC mandates a higher 20 MPa (approx 3,000 PSI) mix for all ICF pours.'
    },
    {
      id: 'nbcc_fnd_block_lateral',
      category: 'foundations',
      title: 'Block Wall Maximum Unsupported Height',
      codeRef: 'NBCC Table 9.15.4.2.B',
      summary: 'Maximum height a standard hollow concrete block wall can be built without adding steel pilasters or internal rebar.',
      metricVal: 'Depends on Soil Type & Wall Thickness',
      imperialVal: 'Depends on Soil Type & Wall Thickness',
      jobsiteNote: 'If you are building a 200 mm (8") block wall and backfilling 2.1 m (7 ft) of heavy clay against it, standard unreinforced block will fail the NBCC tables. You must upgrade to 250 mm (10") block or reinforce the cores with vertical rebar.'
    },
    {
      id: 'nbcc_fnd_icf_rebar',
      category: 'foundations',
      title: 'ICF Vertical & Horizontal Rebar Schedule',
      codeRef: 'NBCC 9.15.4.5',
      summary: 'Prescriptive reinforcement layout for standard residential flat-wall ICF construction.',
      metricVal: '10M Horizontal @ 600 mm OC / Verticals per Table',
      imperialVal: '#4 Horizontal @ 24" OC / Verticals per Table',
      jobsiteNote: 'Horizontal rebar is generally placed every 24 inches (usually in the specific web clips of the ICF block). Vertical rebar spacing is dictated heavily by the backfill height, often requiring a #4 or #5 bar every 16" to 24" on center.'
    },
    {
      id: 'nbcc_fnd_cold_joints',
      category: 'foundations',
      title: 'Poured Wall Keyways & Cold Joints',
      codeRef: 'NBCC 9.15.4.4',
      summary: 'Requirement for tying foundation walls to the footing.',
      metricVal: 'Keyway or Rebar Dowels Required',
      imperialVal: 'Keyway or Rebar Dowels Required',
      jobsiteNote: 'When the footing cures before the wall is poured, you must ensure the wall cannot slide sideways off the footing under soil pressure. The footing must either have a continuous 2x4 keyway cast into the center, or steel rebar dowels placed at 600 mm (24") intervals.'
    },
    {
      id: 'nbcc_fnd_dampproof_grade',
      category: 'foundations',
      title: 'Exterior Grade Sloping & Clearance',
      codeRef: 'NBCC 9.14.6.1 / 9.15.4.3',
      summary: 'Requirement to slope exterior backfill dirt away from the foundation to prevent hydrostatic pressure buildup.',
      metricVal: 'Slope Away > 10% for First 2 Meters',
      imperialVal: 'Slope Away > 10% for First 6 Feet',
      jobsiteNote: 'Finished grade must slope aggressively away from the wall. Additionally, ensure the finished dirt line stays at least 150 mm (6") BELOW the bottom of the exterior siding/stucco to prevent moisture rot and termite bridging.'
    },
		{
      id: 'nbcc_fnd_icf_sill_bearing',
      category: 'foundations',
      title: 'Wood Sill Plate Bearing on ICF Walls',
      codeRef: 'NBCC 9.23.2.2',
      summary: 'Requirement for the structural bearing of the wood floor sill plate across the top of an ICF wall.',
      metricVal: 'Must Bear Directly on Concrete Core',
      imperialVal: 'Must Bear Directly on Concrete Core',
      jobsiteNote: 'The wood sill plate cannot just rest on the inner EPS foam lip of the ICF block. The plate must be wide enough (usually a 2x6 or 2x8) to bridge the foam and achieve full solid bearing directly onto the structural concrete core.'
    },
    {
      id: 'nbcc_fnd_masonry_intersect',
      category: 'foundations',
      title: 'Intersecting Block Wall Ties',
      codeRef: 'NBCC 9.20.11.2',
      summary: 'Structural connection requirements where an interior masonry load-bearing wall intersects the main exterior block foundation.',
      metricVal: 'Bonded in Masonry or Steel Tied',
      imperialVal: 'Bonded in Masonry or Steel Tied',
      jobsiteNote: 'If you build a block partition wall in the basement that meets the exterior block wall, they must be structurally locked together. You must either interlock the blocks (running bond) or embed heavy steel masonry ties into the mortar joints every 400 mm (16") vertically.'
    },
    {
      id: 'nbcc_fnd_pilasters',
      category: 'foundations',
      title: 'Block Wall Pilasters for Beam Support',
      codeRef: 'NBCC 9.15.5.3',
      summary: 'Requirements for thickening block walls (pilasters) where heavy point loads from steel I-beams rest.',
      metricVal: 'Required if Bearing < 90 mm',
      imperialVal: 'Required if Bearing < 3-1/2"',
      jobsiteNote: 'If a main steel floor beam rests in a pocket on an 8" hollow block wall, the wall must be thickened inward at that specific point using a pilaster (a column of solid-grouted block tied into the wall) to carry the immense crushing load.'
    },
		{
      id: 'nbcc_wall_stud_spacing',
      category: 'framing',
      title: 'Load-Bearing Exterior Stud Spacing',
      codeRef: 'NBCC Table 9.23.10.1',
      summary: 'Maximum stud spacing for exterior walls supporting a roof and one floor above.',
      metricVal: '38x140 mm (2x6) @ 600 mm OC Max',
      imperialVal: '2x6 @ 24" OC Max',
      jobsiteNote: 'While 2x6 studs can structurally be spaced at 24" on center, most custom home builders space them at 16" on center to provide a stiffer wall and prevent drywall bowing/waving, especially when using heavy exterior cladding.'
    },
    {
      id: 'nbcc_wall_bottom_plate',
      category: 'framing',
      title: 'Bottom Plate Fastening (Wall to Floor)',
      codeRef: 'NBCC Table 9.23.3.4',
      summary: 'Required fastener schedule for securing the wood bottom plate of a wall to the floor joists or subfloor below.',
      metricVal: '82 mm Nails @ 400 mm OC',
      imperialVal: '3-1/4" Nails @ 16" OC',
      jobsiteNote: 'If you are framing walls on the ground and standing them up, make sure you drive your bottom plate nails so they hit the solid floor joists below the subfloor, not just the 5/8" plywood.'
    },
    {
      id: 'nbcc_wall_sheathing_nailing',
      category: 'framing',
      title: 'Exterior Wall Sheathing Fasteners',
      codeRef: 'NBCC Table 9.23.3.5.A',
      summary: 'Required nail spacing for structural OSB or plywood wall sheathing panels.',
      metricVal: '150 mm OC on Edges / 300 mm OC Field',
      imperialVal: '6" OC on Edges / 12" OC Field',
      jobsiteNote: 'Use 51 mm (2") common nails or structural staples. Inspectors will routinely pull a tape measure along the panel seams; if the nails are spaced at 8" or 10" on the edges, you will have to re-nail the entire house.'
    },
    {
      id: 'nbcc_wall_drilling_nonbearing',
      category: 'framing',
      title: 'Drilling Non-Loadbearing Studs',
      codeRef: 'NBCC 9.23.5.3',
      summary: 'Hole size limits for interior partition walls that do not carry roof or floor loads.',
      metricVal: 'Max Hole = 1/2 Stud Depth',
      imperialVal: 'Max Hole = 1/2 Stud Depth',
      jobsiteNote: 'Because interior partition walls (like bathroom dividing walls) do not carry structural loads, plumbers can drill larger holes—up to 1.75" in a 2x4—to fit larger ABS drain vent pipes. Do NOT do this on bearing walls.'
    },
    {
      id: 'nbcc_wall_tall_walls',
      category: 'framing',
      title: 'Tall Wall Framing (Over 3.0m)',
      codeRef: 'NBCC 9.23.10.1 / Part 4',
      summary: 'Structural trigger for walls exceeding standard residential ceiling heights.',
      metricVal: 'Engineering Required if Height > 3.0 m (10 ft)',
      imperialVal: 'Engineering Required if Height > 10 ft',
      jobsiteNote: 'Part 9 prescriptive tables max out at 10-foot wall heights. If you are framing a two-story great room with continuous 18-foot tall studs, they must be specifically engineered (often requiring 2x8 studs, LSL engineered studs, or tightened spacing).'
    },
		{
      id: 'nbcc_wall_top_plate_cut',
      category: 'framing',
      title: 'Top Plate Reinforcement at Openings',
      codeRef: 'NBCC 9.23.11.5',
      summary: 'Tension strapping required where drilling or notching removes more than 50% of the top plate width.',
      metricVal: 'Galvanized Strap Exceeding Cut by 300 mm',
      imperialVal: 'Galvanized Strap Exceeding Cut by 12"',
      jobsiteNote: 'If the top plate is notched more than half its depth, it is considered severed. The steel tension strap used to repair it must extend at least 12 inches past the cut on both sides to achieve proper nail grab.'
    },
    {
      id: 'nbcc_wall_wood_column_bearing',
      category: 'framing',
      title: 'Wood Column Base Clearance',
      codeRef: 'NBCC 9.17.4.3',
      summary: 'Elevation and separation requirements for structural wood columns bearing on concrete basement slabs.',
      metricVal: '0.05 mm Poly OR Poured 50 mm Plinth',
      imperialVal: '6-mil Poly OR Poured 2" Plinth',
      jobsiteNote: 'If you use a 6x6 wood post in the basement instead of steel, the bottom end-grain will soak up water rapidly. It must be separated from the concrete by heavy poly, or better, set on a raised concrete plinth or steel standoff base.'
    },
    {
      id: 'nbcc_wall_loadbearing_alignment',
      category: 'framing',
      title: 'Vertical Alignment of Load-Bearing Walls',
      codeRef: 'NBCC 9.23.9.8',
      summary: 'Requirement for load-bearing walls on the second floor to align structurally with supports below.',
      metricVal: 'Maximum 50 mm Offset from Beam/Wall Below',
      imperialVal: 'Maximum 2" Offset from Beam/Wall Below',
      jobsiteNote: 'A load-bearing wall on the second floor cannot simply land in the middle of the floor joist span below. It must land directly above a beam or bearing wall on the first floor, with a maximum allowable offset of 50 mm (2 inches).'
    },
		{
      id: 'nbcc_win_egress_size',
      category: 'windows_doors',
      title: 'Bedroom Egress Window Sizing',
      codeRef: 'NBCC 9.9.10.1',
      summary: 'Required minimum unobstructed opening for bedroom emergency escape windows.',
      metricVal: '0.35 m² Area / 380 mm Min Dimension',
      imperialVal: '3.8 sq ft Area / 15" Min Dimension',
      jobsiteNote: 'Common failure: Basement slider windows. A 30" x 15" slider window physically meets the dimensions, but because only HALF the window slides open, the clear opening is only ~14" wide, failing both the area and minimum dimension test.'
    },
    {
      id: 'nbcc_win_egress_hardware',
      category: 'windows_doors',
      title: 'Egress Window Hardware Restrictions',
      codeRef: 'NBCC 9.9.10.1.(1)',
      summary: 'Rules regarding the operation of emergency escape windows.',
      metricVal: 'No Keys, Tools, or Special Knowledge',
      imperialVal: 'No Keys, Tools, or Special Knowledge',
      jobsiteNote: 'Egress windows must be openable from the inside without requiring a key, a tool, or complicated double-latch knowledge. Security bars installed over bedroom windows must have a quick-release mechanism operable from the inside.'
    },
    {
      id: 'nbcc_door_egress_landing',
      category: 'windows_doors',
      title: 'Exterior Door Swing & Landings',
      codeRef: 'NBCC 9.8.6.2',
      summary: 'Requirements for stair landings outside exterior doors.',
      metricVal: 'Landing Required (Door cannot swing over stairs)',
      imperialVal: 'Landing Required (Door cannot swing over stairs)',
      jobsiteNote: 'An exterior door cannot swing outward directly over a step down. If the door swings out, there must be a full landing (minimum depth equal to the door width) before the stairs begin.'
    },
    {
      id: 'nbcc_win_safety_glass_bath',
      category: 'windows_doors',
      title: 'Safety Glazing in Wet Areas',
      codeRef: 'NBCC 9.6.1.4',
      summary: 'Mandatory tempered glass placement in hazardous slip-risk zones.',
      metricVal: 'Tempered Glass for Bath/Shower Enclosures',
      imperialVal: 'Tempered Glass for Bath/Shower Enclosures',
      jobsiteNote: 'All glass used in shower doors, bathtub enclosures, or windows located directly inside a shower stall must be tempered safety glass or shatter-resistant polycarbonate. Standard annealed window glass is strictly prohibited.'
    },
    {
      id: 'nbcc_door_garage_seal',
      category: 'windows_doors',
      title: 'Door Between Garage and Dwelling',
      codeRef: 'NBCC 9.10.13.15',
      summary: 'Fire and gas sealing requirements for the man-door connecting an attached garage to the house.',
      metricVal: 'Weather-stripped, Self-Closing, Minimum 45mm Solid',
      imperialVal: 'Weather-stripped, Self-Closing, Minimum 1-3/4" Solid',
      jobsiteNote: 'This door must provide an airtight gas seal (full weatherstripping) to prevent carbon monoxide from entering the house, and it must be equipped with an automatic self-closing hinge to maintain the fire separation.'
    },
		{
      id: 'nbcc_win_skylight_glass',
      category: 'windows_doors',
      title: 'Skylight Safety Glazing (Inner Pane)',
      codeRef: 'NBCC 9.6.1.4 / 9.6.1.3',
      summary: 'Specific shatter-resistance requirements for overhead glass to protect occupants below from falling shards.',
      metricVal: 'Inner Pane Must Be Laminated Glass',
      imperialVal: 'Inner Pane Must Be Laminated Glass',
      jobsiteNote: 'Tempered glass is NOT allowed as the inner pane of a skylight over habitable space because when it shatters, the "popcorn" pebbles will still rain down on people. The inner pane must be laminated glass or wired glass so it stays intact if broken.'
    },
    {
      id: 'nbcc_door_storm_swing',
      category: 'windows_doors',
      title: 'Storm / Screen Door Swing Direction',
      codeRef: 'NBCC 9.9.6.5',
      summary: 'Safety restrictions on exterior secondary doors obstructing the primary escape path.',
      metricVal: 'Must Swing Outward (Cannot Trap Occupants)',
      imperialVal: 'Must Swing Outward (Cannot Trap Occupants)',
      jobsiteNote: 'Exterior storm doors or screen doors must swing outward. If they swing inward, they conflict with the main egress door and trap occupants during a fire panic. They must also easily unlatch without a key.'
    },
    {
      id: 'nbcc_win_flashing_siding',
      category: 'windows_doors',
      title: 'Window Rough Opening Clearances',
      codeRef: 'NBCC 9.27.3.8',
      summary: 'Required clearance between the window frame and the exterior wall cladding to accommodate caulking and thermal expansion.',
      metricVal: 'Minimum 6 mm Caulking Gap',
      imperialVal: 'Minimum 1/4" Caulking Gap',
      jobsiteNote: 'Do not install brick veneer or siding dead-tight against the vinyl window frame. You must leave a minimum 1/4-inch gap around the perimeter and fill it with an approved exterior-grade elastomeric sealant (backer rod + caulking).'
    },
		{
      id: 'nbcc_fin_capillary_break',
      category: 'finishes',
      title: 'Rain Screen Air Space (Capillary Break)',
      codeRef: 'NBCC 9.27.2.2',
      summary: 'Mandatory drainage and ventilation gap behind exterior cladding (like siding or stucco) to prevent trapped moisture.',
      metricVal: '10 mm Drained & Vented Air Space',
      imperialVal: '3/8" Drained & Vented Air Space',
      jobsiteNote: 'Modern Canadian code requires a "rain screen" system. You cannot install siding tight against the housewrap in most climates. You must install vertical 1x3 wood strapping (or an engineered dimple mesh) to create a 3/8" continuous air gap from bottom to top.'
    },
    {
      id: 'nbcc_fin_masonry_airspace',
      category: 'finishes',
      title: 'Masonry Veneer Cavity Width',
      codeRef: 'NBCC 9.20.6.4.(1)',
      summary: 'Required unobstructed air gap between the back of the brick/stone veneer and the exterior wall sheathing.',
      metricVal: '25 mm Minimum Clear Space',
      imperialVal: '1" Minimum Clear Space',
      jobsiteNote: 'This 1-inch cavity must be kept meticulously clean. If the masons drop excess mortar down the back of the wall (mortar droppings) and it bridges the 1-inch gap, it creates a direct path for exterior water to wick into the wood framing.'
    },
    {
      id: 'nbcc_fin_sheathing_lap',
      category: 'finishes',
      title: 'Sheathing Membrane (Housewrap) Joint Lap',
      codeRef: 'NBCC 9.27.3.3.(2)',
      summary: 'Minimum overlap distance when joining two sheets of Tyvek, Typar, or tar paper on an exterior wall.',
      metricVal: '100 mm Minimum Overlap',
      imperialVal: '4" Minimum Overlap',
      jobsiteNote: 'Upper sheets must always lap over lower sheets (shingle style). A 4-inch overlap is the bare code minimum, though most modern synthetic housewraps feature printed 6-inch (150 mm) lap lines that should be taped for an airtight seal.'
    },
    {
      id: 'nbcc_fin_shingle_starter',
      category: 'finishes',
      title: 'Roof Shingle Starter Strip Extent',
      codeRef: 'NBCC 9.26.7.2',
      summary: 'Required overhang for the starter strip of asphalt roofing at the eaves and rake edges.',
      metricVal: 'Approx 12 mm Overhang',
      imperialVal: 'Approx 1/2" Overhang',
      jobsiteNote: 'The starter shingle must extend approximately 1/2" past the metal drip edge. If it is cut flush with the fascia, water will curl back under the shingles via surface tension and rot the roof deck edge.'
    },
    {
      id: 'nbcc_fin_metal_flashing_lap',
      category: 'finishes',
      title: 'Exterior Flashing Joint Overlap',
      codeRef: 'NBCC 9.27.3.2',
      summary: 'Minimum lap distance where pieces of metal head or sill flashing meet on a long run.',
      metricVal: '100 mm Lap (or Interlocking Joint)',
      imperialVal: '4" Lap (or Interlocking Joint)',
      jobsiteNote: 'Where two pieces of metal drip cap or window head flashing meet, they cannot simply be butt-jointed. They must overlap by at least 4 inches and ideally be bedded in elastomeric sealant to prevent water intrusion at the seam.'
    },
		{
      id: 'nbcc_fin_low_slope_roof',
      category: 'finishes',
      title: 'Low Slope Asphalt Shingle Limits',
      codeRef: 'NBCC 9.26.3.1',
      summary: 'Underlayment and application requirements when installing standard asphalt shingles on low-pitched roofs.',
      metricVal: 'Double Underlayment if Slope is 1:6 to 1:3',
      imperialVal: 'Double Underlayment if Slope is 2/12 to 4/12',
      jobsiteNote: 'You cannot install standard shingles on a roof pitch flatter than 2/12. If the roof is between 2/12 and 4/12, it is considered "low slope" and requires a double-coverage layer of #15 felt paper (lapped 19 inches) or full Ice & Water Shield beneath the shingles.'
    },
    {
      id: 'nbcc_fin_siding_over_foam',
      category: 'finishes',
      title: 'Siding Fastener Depth Over Rigid Foam',
      codeRef: 'NBCC 9.27.5 / Fastener Tables',
      summary: 'Increased nail/screw length requirements when installing siding over exterior rigid foam insulation.',
      metricVal: 'Minimum 30 mm Penetration into Solid Wood',
      imperialVal: 'Minimum 1-1/4" Penetration into Solid Wood',
      jobsiteNote: 'If you install 2 inches of exterior rigid foam, standard 2-inch siding nails are useless (they will only hit foam and OSB). You must use extended fasteners that penetrate entirely through the foam and grab at least 1-1/4" of the solid wall stud behind it.'
    },
    {
      id: 'nbcc_fin_masonry_lintel',
      category: 'finishes',
      title: 'Masonry Veneer Lintel Bearing',
      codeRef: 'NBCC 9.20.8.4',
      summary: 'Required solid bearing length for steel angle iron lintels supporting brick veneer over windows and doors.',
      metricVal: '150 mm Minimum Bearing on Each Side',
      imperialVal: '6" Minimum Bearing on Each Side',
      jobsiteNote: 'A steel angle iron carrying heavy brick over a window must extend a full 6 inches past the rough opening on both sides to safely distribute the weight onto the brick below. (Exception: 100mm/4" bearing is allowed for very short spans).'
    },
		{
      id: 'nbcc_fin_trim_flashing',
      category: 'finishes',
      title: 'Flashing Over Horizontal Band Boards & Trim',
      codeRef: 'NBCC 9.27.3.8',
      summary: 'Requirement for metal Z-flashing above decorative horizontal exterior trim boards (belly bands or skirt boards).',
      metricVal: 'Z-Flashing w/ 6 mm Drip Lip Required',
      imperialVal: 'Z-Flashing w/ 1/4" Drip Lip Required',
      jobsiteNote: 'Water sits on flat horizontal trim boards and eventually wicks behind the siding above. Any horizontal trim projecting outward from the cladding must be capped with metal Z-flashing tucked under the upper housewrap.'
    },
    {
      id: 'nbcc_fin_stucco_control',
      category: 'finishes',
      title: 'Stucco Control & Expansion Joint Spacing',
      codeRef: 'NBCC 9.28.6.2 / CSA A371',
      summary: 'Mandatory placement of relief joints in exterior cement plaster (stucco) walls to prevent massive surface cracking.',
      metricVal: 'Max 18 m² Panel Area / Max 6 m Length',
      imperialVal: 'Max 190 sq ft Panel Area / Max 20 ft Length',
      jobsiteNote: 'Stucco shrinks violently as it cures. You must break up large exterior walls using metal expansion beads so no individual section exceeds 18 m² (approx. 190 sq ft) or 6 m (20 ft) in any linear direction.'
    },
    {
      id: 'nbcc_fin_open_valley_cut',
      category: 'finishes',
      title: 'Shingle Separation in Open Valleys',
      codeRef: 'NBCC 9.26.4.2',
      summary: 'Required distance between opposing asphalt shingle cuts along the centerline of an open metal valley.',
      metricVal: 'Keep Shingles 50 mm Back from Centerline',
      imperialVal: 'Keep Shingles 2" Back from Centerline (4" Total Gap)',
      jobsiteNote: 'When snapping chalk lines to cut asphalt shingles in an open metal valley, keep the cut line at least 50 mm (2 inches) back from the exact center trough on both sides, creating a continuous 4-inch wide exposed metal waterway.'
    },
		{
      id: 'nbcc_fire_smoke_placement',
      category: 'fire_safety',
      title: 'Smoke Alarm Location Requirements',
      codeRef: 'NBCC 9.10.19.3',
      summary: 'Baseline national rules for residential smoke alarm coverage.',
      metricVal: 'Every Storey + Inside All Sleeping Rooms',
      imperialVal: 'Every Storey + Inside All Sleeping Rooms',
      jobsiteNote: 'Just like the OBC, the NBCC strictly requires alarms inside every bedroom. Furthermore, they must be mounted strictly "on or near the ceiling" in conformance with CAN/ULC-S553 installation standards.'
    },
    {
      id: 'nbcc_fire_co_triggers',
      category: 'fire_safety',
      title: 'Carbon Monoxide Alarm Triggers',
      codeRef: 'NBCC 9.32.3.9',
      summary: 'Conditions that legally mandate the installation of Carbon Monoxide alarms in a dwelling.',
      metricVal: 'Required if Solid Fuel Appliance or Attached Garage',
      imperialVal: 'Required if Solid Fuel Appliance or Attached Garage',
      jobsiteNote: 'Even if the house is 100% electric (electric furnace, electric water heater, electric stove), if it has an attached garage where a running car could produce CO, you MUST install CO alarms outside the bedrooms.'
    },
    {
      id: 'nbcc_fire_visual_signal',
      category: 'fire_safety',
      title: 'Visual Signalling (Strobes)',
      codeRef: 'NBCC 9.10.19.1 / Accessibility',
      summary: 'Emerging requirements for visual flashing components on smoke alarms.',
      metricVal: '175 Candela Strobe (Required in certain suites)',
      imperialVal: '175 Candela Strobe (Required in certain suites)',
      jobsiteNote: 'In new construction, especially houses featuring secondary suites (legal basement apartments), the code frequently mandates alarms equipped with a 175-candela visual flashing strobe in the bedrooms to alert hearing-impaired occupants.'
    },
		{
      id: 'nbcc_fire_exposed_foam',
      category: 'fire_safety',
      title: 'Protection of Foamed Plastic Insulation',
      codeRef: 'NBCC 9.10.17.10',
      summary: 'Mandatory fire/thermal barrier covering required over exposed spray foam or rigid foam board insulation inside the house.',
      metricVal: 'Cover with 12.7 mm Gypsum Board',
      imperialVal: 'Cover with 1/2" Gypsum Board',
      jobsiteNote: 'Foam plastic insulation (like EPS, XPS, or polyurethane spray foam) acts like solid gasoline in a fire. You cannot leave it exposed on a basement wall or attic ceiling. It must be covered by a physical thermal barrier, typically 1/2" drywall, or a certified intumescent fire-retardant paint.'
    },
    {
      id: 'nbcc_fire_flame_spread',
      category: 'fire_safety',
      title: 'Interior Finish Flame-Spread Rating',
      codeRef: 'NBCC 9.10.17.1',
      summary: 'Maximum allowable surface burning characteristic for materials used on walls and ceilings in residential rooms.',
      metricVal: 'Maximum Flame-Spread Rating of 150',
      imperialVal: 'Maximum Flame-Spread Rating of 150',
      jobsiteNote: 'Standard painted drywall easily passes this. However, if a homeowner wants to cover their entire living room ceiling in reclaimed barn wood, tongue-and-groove pine, or cheap plastic paneling, the material must be tested and proven to have a flame-spread rating of 150 or less.'
    },
    {
      id: 'nbcc_fire_spatial_soffit',
      category: 'fire_safety',
      title: 'Soffit Protection Near Property Lines',
      codeRef: 'NBCC 9.10.15.5',
      summary: 'Requirement for non-vented or fire-rated soffits when the roof overhang is built extremely close to the property line.',
      metricVal: 'No Vents Permitted if < 1.2m to Property Line',
      imperialVal: 'No Vents Permitted if < 4 ft to Property Line',
      jobsiteNote: 'If the roof overhang is closer than 1.2 meters (4 feet) to the neighbor\'s property line, you cannot install perforated/vented aluminum soffit. A fire next door would get sucked directly into your attic vents. The soffit must be solid and unvented.'
    },
		{
      id: 'nbcc_fire_blocking_materials',
      category: 'fire_safety',
      title: 'Acceptable Fireblocking Materials',
      codeRef: 'NBCC 9.10.16.3',
      summary: 'Approved materials that legally qualify to act as a fireblock in concealed wall and floor spaces.',
      metricVal: '38mm Lumber, 12.5mm Gypsum, or 0.38mm Steel',
      imperialVal: '1.5" Lumber (2-by), 1/2" Drywall, or 28-Gauge Steel',
      jobsiteNote: 'You cannot stuff regular pink fiberglass batt insulation into a wall cavity and call it a fireblock. You must use solid 2-by lumber, 1/2" drywall, sheet metal, or tightly packed mineral wool (e.g., Roxul Safe\'n\'Sound) to physically stop flames and oxygen flow.'
    },
    {
      id: 'nbcc_fire_smoke_tight',
      category: 'fire_safety',
      title: 'Smoke-Tight Joints in Fire Separations',
      codeRef: 'NBCC 9.10.9.2',
      summary: 'Requirement for all joints and seams in a fire separation to be sealed against the passage of deadly smoke.',
      metricVal: 'Joints Must Be Taped & Mudded (or Caulked)',
      imperialVal: 'Joints Must Be Taped & Mudded (or Caulked)',
      jobsiteNote: 'Just screwing 5/8" Type X drywall to the ceiling of a legal suite is not enough. Every single joint must be fully taped and coated with joint compound, and all perimeter edges against the foundation walls must be sealed with acoustic/fire caulk. Smoke kills long before flames do.'
    },
    {
      id: 'nbcc_fire_potlight_clearance',
      category: 'fire_safety',
      title: 'Recessed Lighting (Pot Light) Clearances',
      codeRef: 'NBCC 9.19.1.1 / Electrical Code',
      summary: 'Insulation clearance requirements around non-IC (Insulation Contact) rated recessed lighting fixtures.',
      metricVal: '13 mm to Combustibles / 76 mm to Insulation',
      imperialVal: '1/2" to Combustibles / 3" to Insulation',
      jobsiteNote: 'If an electrician uses a standard, non-IC rated pot light in an insulated ceiling, you absolutely cannot pack insulation against it. It will overheat and catch fire. You must maintain a 3-inch air gap using a drywall box or wire mesh guard. (Always use IC-rated LED fixtures to avoid this entirely).'
    },		
    {
      id: 'nbcc_hvac_dryer_material',
      category: 'hvac',
      title: 'Clothes Dryer Duct Material',
      codeRef: 'NBCC 9.32.1.3',
      summary: 'Material requirements for clothes dryer exhaust ducting.',
      metricVal: 'Rigid Smooth-Wall Metal (100 mm Min Diameter)',
      imperialVal: 'Rigid Smooth-Wall Metal (4" Min Diameter)',
      jobsiteNote: 'Plastic accordion flex-hose or standard vinyl foil flex-duct is illegal for concealing inside walls or ceilings for a dryer vent. The entire concealed run MUST be rigid, smooth-walled galvanized or aluminum pipe to reduce friction and lint buildup.'
    },   
    {
      id: 'nbcc_hvac_hrv_mandatory',
      category: 'hvac',
      title: 'Mandatory Heat Recovery Ventilators (HRV)',
      codeRef: 'NBCC 9.32.3.3 / Energy Code',
      summary: 'Requirement for continuous mechanical ventilation with heat recovery in modern airtight homes.',
      metricVal: 'HRV or ERV System Required',
      imperialVal: 'HRV or ERV System Required',
      jobsiteNote: 'Because modern houses are built so airtight with spray foam and poly wrap, they can no longer "breathe" naturally. An HRV (Heat Recovery Ventilator) is now mandatory in most provinces to bring in fresh outdoor air without losing the heat energy from the exhausted indoor air.'
    },
		{
      id: 'nbcc_hvac_duct_insulation',
      category: 'hvac',
      title: 'Exhaust Duct Insulation in Unheated Spaces',
      codeRef: 'NBCC 9.32.3.10 / 9.25.2',
      summary: 'Requirement to insulate warm, moist exhaust ducts passing through cold areas (like attics) to prevent internal condensation.',
      metricVal: 'Min RSI 0.70 (RSI 1.4 for long runs)',
      imperialVal: 'Min R-4 (R-8 for long runs in deep cold)',
      jobsiteNote: 'If you run a bare metal bathroom exhaust duct through a freezing attic, the moisture will condense, freeze, and eventually leak back through the ceiling fan grille, ruining the drywall. You must use insulated flex duct or wrap the rigid pipe.'
    },
    {
      id: 'nbcc_hvac_crawlspace_vent',
      category: 'hvac',
      title: 'Unheated Crawlspace Ventilation',
      codeRef: 'NBCC 9.18.3.1',
      summary: 'Minimum natural ventilation requirements for enclosed, unheated crawlspaces.',
      metricVal: '0.1 m² of Vent per 50 m² of Floor Area',
      imperialVal: '1 sq ft of Vent per 500 sq ft of Floor Area',
      jobsiteNote: 'If the crawlspace is unheated and has a dirt floor (even if covered with poly), it must have passive louvered vents cut into the foundation walls on opposite sides to allow cross-ventilation. (Note: Heated crawlspaces have completely different, sealed-plenum rules).'
    },   
		{
      id: 'nbcc_hvac_intake_clearance',
      category: 'hvac',
      title: 'Clearance to Fresh Air Intakes',
      codeRef: 'NBCC 9.32.3.12 / 9.32.3.13',
      summary: 'Mandatory separation between any exhaust vent (bathroom, dryer, furnace) and the fresh air intake for the house HRV or furnace.',
      metricVal: 'Minimum 900 mm Separation',
      imperialVal: 'Minimum 36" Separation',
      jobsiteNote: 'If you place a dryer vent or bathroom exhaust directly beside the HRV fresh air intake, the system will suck lint, humidity, and odors straight back into the home. They must be physically separated by at least 3 feet on the exterior wall.'
    },
    {
      id: 'nbcc_hvac_garage_ducts',
      category: 'hvac',
      title: 'HVAC Ducts Penetrating Attached Garages',
      codeRef: 'NBCC 9.10.9.16 / 9.33.6',
      summary: 'Rules for running supply or return ducts through an attached garage.',
      metricVal: 'No Openings in Garage + Fully Sealed/Insulated',
      imperialVal: 'No Openings in Garage + Fully Sealed/Insulated',
      jobsiteNote: 'You can route a duct through a garage to heat a bonus room above it, BUT the duct must be continuously sealed (no grilles blowing into the garage), wrapped in insulation, and the penetrations through the garage drywall must be heavily fire-stopped.'
    },
    {
      id: 'nbcc_hvac_condensate',
      category: 'hvac',
      title: 'Furnace / AC Condensate Disposal',
      codeRef: 'NBCC 9.33.1.1 / Plumbing Code',
      summary: 'Requirement for routing the highly acidic condensate water from high-efficiency furnaces and AC evaporator coils.',
      metricVal: 'Must Route to Approved Drain (No Crawlspace Dumping)',
      imperialVal: 'Must Route to Approved Drain (No Crawlspace Dumping)',
      jobsiteNote: 'High-efficiency furnaces produce gallons of water a day. You cannot just run a vinyl tube and let it drip onto the basement floor or into the crawlspace dirt. It must be routed via gravity or a condensate pump to a trapped floor drain or laundry standpipe.'
    },
		{
      id: 'nbcc_hvac_suite_isolation',
      category: 'hvac',
      title: 'Secondary Suite Duct Isolation',
      codeRef: 'NBCC 9.33.1.1.(3) / 9.32',
      summary: 'Total prohibition of shared HVAC ductwork between a main house and a legal secondary suite (basement apartment).',
      metricVal: 'Zero Shared Ducts Permitted',
      imperialVal: 'Zero Shared Ducts Permitted',
      jobsiteNote: 'You cannot use the main floor furnace to heat a legal basement apartment by simply cutting in a few supply vents. A secondary suite MUST have a 100% physically isolated heating and ventilation system to prevent fire, smoke, and odors from traveling between the suites.'
    },
    {
      id: 'nbcc_hvac_makeup_distance',
      category: 'hvac',
      title: 'Make-Up Air Duct Connection Distance',
      codeRef: 'NBCC 9.32 / CSA F326',
      summary: 'Requirement for injecting frigid outdoor make-up air into the warm return-air plenum of a furnace.',
      metricVal: 'Minimum 3 Meters Upstream of Heat Exchanger',
      imperialVal: 'Minimum 10 Feet Upstream of Heat Exchanger',
      jobsiteNote: 'If you connect a passive 6-inch fresh air intake duct directly to the furnace cabinet, the -20°C outdoor air will crack the heat exchanger. The fresh air duct MUST tie into the main return trunk at least 10 feet upstream of the furnace so the cold air has time to mix with the warmer house air.'
    },
    {
      id: 'nbcc_hvac_exhaust_screen',
      category: 'hvac',
      title: 'Exhaust Hood Bird Screen Sizing',
      codeRef: 'NBCC 9.32.3.12',
      summary: 'Mesh screen requirements on exterior wall exhaust hoods to prevent pest entry while avoiding lint clogs.',
      metricVal: 'Bath: 12mm Screen / Dryer: NO SCREEN Allowed',
      imperialVal: 'Bath: 1/2" Screen / Dryer: NO SCREEN Allowed',
      jobsiteNote: 'Standard exhaust vents require a bird screen. However, you are strictly forbidden from installing a bug or bird screen on a clothes dryer exhaust hood. The lint will instantly clog the screen and cause a fire. Dryer hoods must use a gravity louver or backdraft flapper only.'
    },
		{
      id: 'nbcc_plumb_trap_arm',
      category: 'plumbing',
      title: 'Maximum Trap Arm Length',
      codeRef: 'NPC 2.5.6.3',
      summary: 'Maximum allowable horizontal distance from a fixture trap weir to its vent connection.',
      metricVal: 'Depends on Pipe Diameter (e.g., 1.5 m for 1-1/4")',
      imperialVal: 'Depends on Pipe Diameter (e.g., 5 ft for 1-1/4")',
      jobsiteNote: 'If you run the drain pipe too far before hitting the vertical vent stack, the flowing water will create a vacuum and siphon the water right out of the P-trap, letting sewer gas into the house. A standard 1-1/2" sink drain can only run about 1.8 meters (6 feet) before it MUST be vented.'
    },
    {
      id: 'nbcc_plumb_pipe_support',
      category: 'plumbing',
      title: 'Horizontal PVC/ABS Pipe Support',
      codeRef: 'NPC Table 2.3.4.5',
      summary: 'Maximum horizontal spacing for strap hangers supporting plastic drainage pipes.',
      metricVal: 'Support Every 1.2 Meters',
      imperialVal: 'Support Every 4 Feet',
      jobsiteNote: 'Plastic ABS or PVC drain pipes hanging in a basement ceiling must be supported by J-hooks or strapping at least every 4 feet. If you space the hangers too far apart, the pipe will sag over time when filled with hot water, creating bellies that trap waste and clog.'
    },
    {
      id: 'nbcc_plumb_cleanout_base',
      category: 'plumbing',
      title: 'Base of Stack Cleanouts',
      codeRef: 'NPC 2.4.7.4',
      summary: 'Requirement for a plumbing cleanout access at the bottom of major vertical soil stacks.',
      metricVal: 'Required at Base of Vertical Soil/Waste Stack',
      imperialVal: 'Required at Base of Vertical Soil/Waste Stack',
      jobsiteNote: 'Wherever a main 3-inch or 4-inch vertical plumbing stack drops down from the floors above and turns horizontally to exit the foundation, there MUST be an accessible screw-cap cleanout fitting located right at the base of the turn so a snake can be run into the sewer.'
    },
    {
      id: 'nbcc_plumb_nail_plate',
      category: 'plumbing',
      title: 'Protection of Plastic Pipes (Nail Plates)',
      codeRef: 'NPC 2.3.5.4',
      summary: 'Mandatory physical protection for pipes passing through wood framing.',
      metricVal: 'Protect if within 50 mm of framing edge',
      imperialVal: 'Protect if within 2" of framing edge',
      jobsiteNote: 'Identical to the OBC: any time a plastic drain or PEX pipe passes through a stud or joist and the edge of the hole is within 2 inches of the wood surface, a heavy steel nail plate is required.'
    },
		{
      id: 'nbcc_plumb_water_hammer',
      category: 'plumbing',
      title: 'Water Hammer Arrestors',
      codeRef: 'NPC 2.6.1.9',
      summary: 'Requirement to install shock absorbers near fast-acting solenoid valves to prevent pipe banging.',
      metricVal: 'Required at Washers & Dishwashers',
      imperialVal: 'Required at Washers & Dishwashers',
      jobsiteNote: 'When a washing machine or dishwasher abruptly snaps its water valve shut, the momentum of the water causes a violent shockwave (water hammer). You must install copper or brass arrestors (air cushions) on both the hot and cold supply lines directly at the appliance box.'
    },
    {
      id: 'nbcc_plumb_island_sink',
      category: 'plumbing',
      title: 'Kitchen Island Sink Venting',
      codeRef: 'NPC 2.5.8.1 / 2.5.9',
      summary: 'Acceptable methods for venting a sink located in an island where vertical wall framing is unavailable.',
      metricVal: 'Island Loop Vent OR Air Admittance Valve',
      imperialVal: 'Island Loop Vent OR Air Admittance Valve',
      jobsiteNote: 'Venting an island sink is tricky because you cannot run a pipe up to the ceiling. You must either plumb a complex "Bow Vent" (loop vent) entirely inside the cabinet, or legally use an approved Air Admittance Valve mounted as high as possible under the counter.'
    },
    {
      id: 'nbcc_plumb_trap_primer',
      category: 'plumbing',
      title: 'Floor Drain Trap Seal Primers',
      codeRef: 'NPC 2.4.5.1',
      summary: 'Requirement to keep emergency floor drain P-traps from drying out and releasing sewer gas.',
      metricVal: 'Trap Primer or Trap Seal Device Required',
      imperialVal: 'Trap Primer or Trap Seal Device Required',
      jobsiteNote: 'A basement floor drain might not see water for years. When the water in the trap evaporates, deadly sewer gas pours into the house. The drain must be fitted with an automatic water primer line (often fed from the laundry tap) or a mechanical rubber check-valve insert.'
    },
		{
      id: 'nbcc_plumb_vent_clearance',
      category: 'plumbing',
      title: 'Roof Vent Clearance to Windows',
      codeRef: 'NPC 2.5.6.5.(4)',
      summary: 'Minimum required distance between a plumbing stack terminating on the roof and any openable window or skylight.',
      metricVal: 'Minimum 900 mm Above or to the Side',
      imperialVal: 'Minimum 36" Above or to the Side',
      jobsiteNote: 'Plumbing roof vents constantly exhale methane and hydrogen sulfide (sewer gas). If a vent pipe exits the roof too close to a second-story bedroom window or a loft skylight, the toxic gas will drift directly into the house. It must be physically separated by at least 3 feet.'
    },
    {
      id: 'nbcc_plumb_pex_support',
      category: 'plumbing',
      title: 'PEX Tubing Horizontal Support',
      codeRef: 'NPC Table 2.3.4.5',
      summary: 'Maximum allowed distance between hanger supports for horizontal runs of flexible PEX water piping.',
      metricVal: 'Support Every 800 mm',
      imperialVal: 'Support Every 32"',
      jobsiteNote: 'While rigid ABS drain pipes can be supported every 4 feet, flexible PEX water lines require much tighter spacing. If you space PEX hangers at 4 feet, the pipe will sag heavily under the weight of the water, creating stress on the crimp fittings.'
    },
    {
      id: 'nbcc_plumb_cleanout_spacing',
      category: 'plumbing',
      title: 'Horizontal Cleanout Spacing limits',
      codeRef: 'NPC Table 2.4.7.2',
      summary: 'Maximum permitted distance between cleanout access fittings on a straight run of drainage pipe.',
      metricVal: 'Max 15 m (for pipes under 75 mm)',
      imperialVal: 'Max 50 ft (for pipes under 3")',
      jobsiteNote: 'For standard 1.5-inch or 2-inch drain lines running through a long basement ceiling, you cannot exceed 50 feet without installing a cleanout Y-fitting. Standard plumber snakes max out around 25 to 50 feet; if there is no cleanout, the pipe is uncleared.'
    },
		{
      id: 'nbcc_elec_kitchen_island',
      category: 'electrical',
      title: 'Kitchen Island Receptacles',
      codeRef: 'CEC 26-712',
      summary: 'Requirements for providing power to fixed kitchen islands and peninsulas.',
      metricVal: 'Required if Island > 600 mm x 300 mm',
      imperialVal: 'Required if Island > 24" x 12"',
      jobsiteNote: 'A fixed kitchen island requires at least one dedicated receptacle. Crucially, newer CEC updates prohibit mounting standard outlets face-up on the work surface unless using a specifically approved pop-up assembly; they must be mounted on the side panel below the counter overhang.'
    },
    {
      id: 'nbcc_elec_gfci_sink',
      category: 'electrical',
      title: 'GFCI Proximity to Sinks',
      codeRef: 'CEC 26-700',
      summary: 'Safety requirement for wet zones around any sink in the house.',
      metricVal: 'GFCI if within 1.5 m of sink edge',
      imperialVal: 'GFCI if within 5 ft of sink edge',
      jobsiteNote: 'Regardless of whether it is a kitchen, bathroom, laundry room, or wet bar—any receptacle located within 1.5 meters (5 feet) of the edge of a sink must be protected by a Class A Ground Fault Circuit Interrupter (GFCI).'
    },
    {
      id: 'nbcc_elec_exterior_receptacle',
      category: 'electrical',
      title: 'Exterior Receptacles',
      codeRef: 'CEC 26-714',
      summary: 'Requirements for providing outdoor power to residential dwellings.',
      metricVal: 'Minimum 1 Required (GFCI & Weather Resistant)',
      imperialVal: 'Minimum 1 Required (GFCI & Weather Resistant)',
      jobsiteNote: 'Every single-family home must have at least one exterior receptacle. It must be on a dedicated circuit, GFCI protected, have a "WR" (Weather Resistant) rating on the device itself, and feature an "in-use" weatherproof bubble cover.'
    },
    {
      id: 'nbcc_elec_panel_clearance',
      category: 'electrical',
      title: 'Electrical Panel Working Clearance',
      codeRef: 'CEC 2-308',
      summary: 'Required unobstructed space directly in front of the main electrical panel.',
      metricVal: '1 m Clear Workspace in Front',
      imperialVal: '39" Clear Workspace in Front',
      jobsiteNote: 'You cannot build a closet framing tight around an electrical panel or store boxes in front of it. There must be a minimum 1 meter of safe, secure footing and clear workspace directly in front of the panel to allow an electrician to safely pull the cover.'
    },
		{
      id: 'nbcc_elec_garage_circuit',
      category: 'electrical',
      title: 'Dedicated Garage Branch Circuit',
      codeRef: 'CEC 26-710 / 26-714',
      summary: 'Requirement to isolate car garage utility receptacles from indoor lighting and outlets.',
      metricVal: 'Separate Branch Circuit Serving Garage Only',
      imperialVal: 'Separate Branch Circuit Serving Garage Only',
      jobsiteNote: 'You cannot daisy-chain the outlets in an attached garage onto the same circuit serving the front hallway or living room. Receptacles in a garage must be fed by at least one separate branch circuit serving no other outlets outside the garage.'
    },
    {
      id: 'nbcc_elec_fridge_circuit',
      category: 'electrical',
      title: 'Refrigerator Dedicated Circuit & AFCI Exemption',
      codeRef: 'CEC 26-722 (Exception)',
      summary: 'Wiring rules for kitchen refrigerators to prevent spoiled food from breaker trips.',
      metricVal: 'Dedicated 15A Circuit (Single Receptacle AFCI Exempt)',
      imperialVal: 'Dedicated 15A Circuit (Single Receptacle AFCI Exempt)',
      jobsiteNote: 'Just like the sump pump rule, the CEC permits omitting AFCI protection for a kitchen refrigerator to prevent nuisance trips from ruining groceries, BUT only if the fridge is powered by a separate branch circuit terminating in a single (non-duplex) receptacle.'
    },
    {
      id: 'nbcc_elec_smoke_interconnect',
      category: 'electrical',
      title: 'Smoke Alarm Circuit Supply',
      codeRef: 'CEC 32-200 / NBCC 9.10.19.4',
      summary: 'Strict limitations on which electrical circuit can power residential smoke/CO alarms.',
      metricVal: 'Lighting Circuit or Dedicated Mixed Circuit',
      imperialVal: 'Lighting Circuit or Dedicated Mixed Circuit',
      jobsiteNote: 'Never wire smoke alarms to a GFCI-protected circuit or a dedicated outlet circuit where someone might flip the breaker off. Best practice (and CEC preference) is to wire them onto a general bedroom or hallway lighting circuit—if the ceiling lights stop working, the homeowner instantly realizes the circuit is dead.'
    },
		{
      id: 'nbcc_elec_cable_clearance',
      category: 'electrical',
      title: 'Cable Clearance in Wood Framing',
      codeRef: 'CEC 12-516',
      summary: 'Required depth for holes drilled through wall studs to protect wires from drywall screws.',
      metricVal: '32 mm from Stud Face (or Use Steel Plate)',
      imperialVal: '1.25" from Stud Face (or Use Steel Plate)',
      jobsiteNote: 'When drilling holes through a wood stud to run wire, the edge of the hole MUST be at least 1.25 inches away from the face of the stud. If the plumber or electrician drills off-center and gets too close to the drywall edge, you MUST install a heavy steel nail plate over the stud.'
    },
    {
      id: 'nbcc_elec_attic_mechanical',
      category: 'electrical',
      title: 'Attic Mechanical Equipment Receptacle',
      codeRef: 'CEC 26-710 / 30-500',
      summary: 'Power and lighting requirements if HVAC equipment is installed in an unfinished attic or crawlspace.',
      metricVal: 'Dedicated Light Switch & 15A Receptacle Required',
      imperialVal: 'Dedicated Light Switch & 15A Receptacle Required',
      jobsiteNote: 'If the home has an air handler or HRV unit located in the dark attic, you cannot expect service techs to drag extension cords up the hatch. You must install a permanent light fixture (with a switch at the entry hatch) and a service receptacle located near the equipment.'
    },
    {
      id: 'nbcc_elec_box_fill',
      category: 'electrical',
      title: 'Maximum Box Fill Capacity',
      codeRef: 'CEC 12-3034',
      summary: 'Volume restrictions preventing electricians from over-stuffing wires into small electrical boxes.',
      metricVal: 'Calculated by Wire AWG and Box Volume',
      imperialVal: 'Calculated by Wire AWG and Box Volume',
      jobsiteNote: 'A standard single-gang plastic device box is only rated for a specific number of wire conductors (e.g., typically a max of eight 14-gauge wires). Cramming three heavy 12/2 cables into a small box creates massive heat buildup and will fail the rough-in inspection.'
    },
		{
      id: 'nbcc_mas_chimney_height',
      category: 'masonry',
      title: 'Chimney Termination Clearance',
      codeRef: 'NBCC 9.21.4.4',
      summary: 'Minimum required clearance for masonry chimney flues above roof profiles.',
      metricVal: 'Min 900 mm Above Roof / 600 mm Higher than Roof within 3 m',
      imperialVal: 'Min 3 ft Above Roof / 2 ft Higher than Roof within 10 ft',
      jobsiteNote: 'Harmonized baseline rule across Canada: Keep chimney caps out of the wind eddy zones caused by nearby roof peaks to prevent hazardous downdrafts into living spaces.'
    },
    {
      id: 'nbcc_mas_mortar_joints',
      category: 'masonry',
      title: 'Unit Masonry Mortar Thickness',
      codeRef: 'NBCC 9.20.4.1',
      summary: 'Allowable mortar joint dimensions for masonry load-bearing and veneer walls.',
      metricVal: '10 mm Average Bed & Head Joints',
      imperialVal: '3/8" Average Bed & Head Joints',
      jobsiteNote: 'Initial bed joints on uneven concrete footings can be thicker (up to 20 mm / 3/4") to level out the starter course, but all subsequent vertical courses must maintain a strict 10 mm average.'
    },
    {
      id: 'nbcc_mas_cold_weather',
      category: 'masonry',
      title: 'Cold Weather Masonry Protection',
      codeRef: 'NBCC 9.20.14.1',
      summary: 'Mandatory thermal protection during cold weather brick or block installation.',
      metricVal: 'Maintain Mortar Above 5°C During & 48 Hrs After',
      imperialVal: 'Maintain Mortar Above 41°F During & 48 Hrs After',
      jobsiteNote: 'Never lay brick or block on ice or frozen mortar beds. Use insulated enclosures and clean propane heaters vented to the exterior to prevent carbonation damage to the setting mortar.'
    },
    {
      id: 'nbcc_mas_chase_limits',
      category: 'masonry',
      title: 'Chases & Recesses in Masonry Walls',
      codeRef: 'NBCC 9.20.7.1',
      summary: 'Limits on carving channels into structural block walls to hide plumbing pipes or conduit.',
      metricVal: 'Max Recess Depth = 1/3 Wall Thickness',
      imperialVal: 'Max Recess Depth = 1/3 Wall Thickness',
      jobsiteNote: 'You cannot cut horizontal chases deeper than one-third of the block wall thickness across a structural masonry wall, as this acts like a perforated tear-line under lateral wind loads.'
    },
    {
      id: 'nbcc_env_radon_roughin',
      category: 'envelope',
      title: 'Radon Sub-Slab Depressurization Rough-In',
      codeRef: 'NBCC 9.13.4.3',
      summary: 'National baseline requirement for sub-slab soil gas extraction infrastructure.',
      metricVal: '100 mm Pipe Embedded in 100 mm Clean Granular Layer',
      imperialVal: '4" Pipe Embedded in 4" Clean Granular Layer',
      jobsiteNote: 'The pipe opening below the slab must be located near the center of the floor area and surrounded by clean, coarse aggregate so soil gas can easily draft toward the suction point if a depressurization fan is installed.'
    },
    {
      id: 'nbcc_fnd_garage_slope',
      category: 'foundations',
      title: 'Garage Slab Drainage Pitch',
      codeRef: 'NBCC 9.35.2.2',
      summary: 'Requirements for shedding bulk liquids off attached or detached garage floors.',
      metricVal: 'Sloped Toward Exterior Doorway or Catch Basin',
      imperialVal: 'Sloped Toward Exterior Doorway or Catch Basin',
      jobsiteNote: 'Ensure the bottom plate of interior dividing walls between the house and garage sits elevated on a concrete curb or pressure-treated wood so melting vehicle slush running toward the door does not rot the house framing.'
    },
		{
      id: 'nbcc_mas_cavity_airspace',
      category: 'masonry',
      title: 'Veneer Cavity Clear Airspace',
      codeRef: 'NBCC 9.20.6.4',
      summary: 'Required physical gap between the back of the brick/stone veneer and the exterior sheathing of the house.',
      metricVal: '25 mm Minimum Clear Airspace',
      imperialVal: '1" Minimum Clear Airspace',
      jobsiteNote: 'This is the most common cause of early brick failure. Masons frequently allow mortar to squeeze out of the back of the joints and fall down (mortar droppings), which bridges this 1-inch gap. This allows rainwater to wick directly into the wood framing, causing severe rot.'
    },
    {
      id: 'nbcc_mas_support_on_wood',
      category: 'masonry',
      title: 'Masonry Supported on Wood Framing',
      codeRef: 'NBCC 9.20.5.2',
      summary: 'Strict prohibition against using wood joists or beams to carry the dead weight of masonry walls or veneer.',
      metricVal: 'Generally Prohibited (Except Small Roof Returns)',
      imperialVal: 'Generally Prohibited (Except Small Roof Returns)',
      jobsiteNote: 'You cannot build a brick wall that rests on top of a wooden floor deck. Wood shrinks and sags over time, which will instantly crack the rigid masonry. Masonry must bear continuously down to the concrete foundation on steel beams or solid block.'
    },
    {
      id: 'nbcc_mas_lintel_protection',
      category: 'masonry',
      title: 'Steel Lintel Rust Protection',
      codeRef: 'NBCC 9.20.8.1.(3)',
      summary: 'Corrosion protection requirements for steel angle irons used in masonry construction.',
      metricVal: 'Must Be Primed/Painted or Galvanized',
      imperialVal: 'Must Be Primed/Painted or Galvanized',
      jobsiteNote: 'Raw, unpainted steel angle irons are illegal. When raw steel rusts, it expands with immense force (rust jacking) and will literally lift and crack the entire brick wall above it. Lintels must be hot-dip galvanized or thoroughly coated with rust-inhibiting paint.'
    },
    {
      id: 'nbcc_mas_hot_weather',
      category: 'masonry',
      title: 'Hot Weather Masonry Protection',
      codeRef: 'NBCC 9.20.14.2',
      summary: 'Requirements to prevent mortar from drying out too rapidly in extreme heat.',
      metricVal: 'Protect from Direct Sun/Wind if Temp > 38°C',
      imperialVal: 'Protect from Direct Sun/Wind if Temp > 100°F',
      jobsiteNote: 'If mortar dries too fast before the cement can chemically hydrate, it turns to dust. In extreme summer heat, blocks/bricks must be moistened, and freshly laid walls must be shaded or misted to cure properly.'
    },
		{
      id: 'nbcc_mas_flashing_drip',
      category: 'masonry',
      title: 'Through-Wall Flashing Drip Edge',
      codeRef: 'NBCC 9.20.13.6.(2)',
      summary: 'Requirement for flashing membranes to physically project past the exterior face of the masonry.',
      metricVal: 'Extend Min 5 mm Beyond Brick Face',
      imperialVal: 'Extend Min 1/4" Beyond Brick Face',
      jobsiteNote: 'A classic "gotcha" for masons: When laying through-wall flashing at the base of the wall, they love to cut the black membrane flush so it looks clean. The code explicitly requires the membrane to stick out at least 1/4" past the brick to form a drip edge, preventing water from curling back under the masonry.'
    },
    {
      id: 'nbcc_mas_firebox_thickness',
      category: 'masonry',
      title: 'Solid Firebox Wall Thickness',
      codeRef: 'NBCC 9.22.4.1',
      summary: 'Required thickness of solid masonry surrounding the actual combustion chamber of a wood-burning fireplace.',
      metricVal: 'Min 200 mm Solid (or 50mm Firebrick + 150mm Block)',
      imperialVal: 'Min 8" Solid (or 2" Firebrick + 6" Block)',
      jobsiteNote: 'The walls of a firebox take immense thermal shock. They must be constructed of at least 8 inches of solid masonry. Typically, this is achieved by laying a 2-inch inner liner of high-heat refractory firebrick backed by 6 inches of solid concrete block.'
    },
    {
      id: 'nbcc_mas_glass_block',
      category: 'masonry',
      title: 'Glass Block Panel Limitations',
      codeRef: 'NBCC 9.20.9.7',
      summary: 'Structural size limits for non-loadbearing interior or exterior glass block windows/walls.',
      metricVal: 'Max 9 m² Area / Max 3 m Dimension',
      imperialVal: 'Max 96 sq. ft. Area / Max 10 ft Dimension',
      jobsiteNote: 'Glass block cannot carry structural loads. Furthermore, any continuous panel of glass block cannot exceed 10 feet in width or height without being broken up by structural mullions or expansion joints to prevent shattering under wind loads.'
    },
		{
      id: 'nbcc_garage_door_rating',
      category: 'garages',
      title: 'Man-Door Construction & Rating',
      codeRef: 'NBCC 9.10.13.15',
      summary: 'Material and thickness requirements for the door separating the garage from the dwelling.',
      metricVal: '45 mm Solid Wood or Insulated Steel',
      imperialVal: '1-3/4" Solid Wood or Insulated Steel',
      jobsiteNote: 'The door cannot be a cheap hollow-core closet door. It must be a substantial barrier: typically a minimum 45 mm (1-3/4") thick solid core wood door, or a steel door with an insulated core, tightly fitted to act as a thermal and gas barrier.'
    },
    {
      id: 'nbcc_garage_no_bedroom',
      category: 'garages',
      title: 'Prohibited Openings (Bedrooms)',
      codeRef: 'NBCC 9.10.13.15.(2)',
      summary: 'Strict prohibition on where a garage man-door can lead.',
      metricVal: 'Cannot Open Directly into a Sleeping Room',
      imperialVal: 'Cannot Open Directly into a Sleeping Room',
      jobsiteNote: 'You can have a door from the garage into a mudroom, kitchen, or hallway. However, a door connecting the garage DIRECTLY into a bedroom is highly illegal due to the risk of carbon monoxide poisoning while the occupant is sleeping.'
    },
    {
      id: 'nbcc_garage_air_barrier',
      category: 'garages',
      title: 'Garage-to-House Air Barrier',
      codeRef: 'NBCC 9.25.3.1',
      summary: 'Continuous sealing requirement for the entire wall and ceiling separating the house and garage.',
      metricVal: 'Continuous Air Barrier System Required',
      imperialVal: 'Continuous Air Barrier System Required',
      jobsiteNote: 'The shared wall isn\'t just about fire; it\'s about gas. Every electrical box, pipe penetration, and drywall seam on the shared wall must be heavily sealed with acoustic caulking or foam to ensure zero air exchange between the garage and the living space.'
    },
    {
      id: 'nbcc_garage_mechanical_protect',
      category: 'garages',
      title: 'Protection of Mechanical Appliances',
      codeRef: 'NBCC 9.33.1 / 9.34',
      summary: 'Physical protection requirement if a furnace or water heater is located inside the garage.',
      metricVal: 'Approved Physical Barrier (Bollards)',
      imperialVal: 'Approved Physical Barrier (Bollards)',
      jobsiteNote: 'If the home\'s furnace or hot water tank is located out in the garage, it cannot be left vulnerable to a car bumping into it. It must be protected by heavy steel bollards embedded in the concrete or an elevated, reinforced concrete curb.'
    },
		{
      id: 'nbcc_garage_detached_slab',
      category: 'garages',
      title: 'Detached Garage Frost Footing Exemption',
      codeRef: 'NBCC 9.12.2.2',
      summary: 'National baseline exemption allowing shallow foundations for accessory buildings.',
      metricVal: 'Exempt if Area ≤ 55 m² (No Masonry)',
      imperialVal: 'Exempt if Area ≤ 592 sq ft (No Masonry)',
      jobsiteNote: 'If the homeowner wants a brick exterior on their detached garage, this floating slab exemption is instantly voided. Masonry cannot tolerate frost heave, so a brick-clad garage requires full 4-foot deep frost footings regardless of its square footage.'
    },
    {
      id: 'nbcc_garage_gas_tight',
      category: 'garages',
      title: 'Gas-Tight Sealing of Penetrations',
      codeRef: 'NBCC 9.10.9.16.(4)',
      summary: 'Requirement to seal all structural penetrations in the shared garage-to-house wall.',
      metricVal: '100% Sealed with Foam or Fire Caulking',
      imperialVal: '100% Sealed with Foam or Fire Caulking',
      jobsiteNote: 'Any wire, pipe, or central-vac tube that punches through the drywall from the house into the garage must be thoroughly sealed with acoustical sealant or fire-rated expanding foam. The wall must act as a perfect barrier against carbon monoxide.'
    },
    {
      id: 'nbcc_garage_column_impact',
      category: 'garages',
      title: 'Protection of Structural Columns',
      codeRef: 'NBCC 9.17.2.2',
      summary: 'Impact protection requirements for structural posts or columns located inside a garage vehicle bay.',
      metricVal: 'Must Be Designed for Vehicle Impact OR Protected',
      imperialVal: 'Must Be Designed for Vehicle Impact OR Protected',
      jobsiteNote: 'If you have a structural steel telepost or wood column holding up a beam in the middle of a multi-car garage, it must be protected by concrete bollards or a raised concrete curb so a vehicle cannot accidentally back into it and collapse the structure.'
    },
		{
      id: 'nbcc_dock_live_load',
      category: 'marine',
      title: 'Boathouse / Dock Floor Live Load',
      codeRef: 'NBCC Table 4.1.5.3',
      summary: 'Required structural design capacity for the walking surface of a residential dock or boathouse deck.',
      metricVal: '1.9 kPa Live Load (Standard Residential)',
      imperialVal: '40 PSF Live Load (Standard Residential)',
      jobsiteNote: 'A private residential dock or boathouse floor uses the standard 40 PSF deck loading rule. However, if the dock is shared by a neighborhood association or is open to the public, it must be engineered for a massive 4.8 kPa (100 PSF) assembly load.'
    },
    {
      id: 'nbcc_dock_cable_protection',
      category: 'marine',
      title: 'Submarine Electrical Cable Burial',
      codeRef: 'CEC 12-012 / 78-050',
      summary: 'Requirements for routing electrical power from the shore out to a floating dock or boathouse.',
      metricVal: 'Approved Submarine Cable or Overhead Routing',
      imperialVal: 'Approved Submarine Cable or Overhead Routing',
      jobsiteNote: 'You cannot just drop a standard underground NMWU wire into the lake to run power out to your dock. It must be a heavily armored, specialized submarine cable (SWA) physically protected from ice-shear and boat props, or routed safely overhead.'
    },
    {
      id: 'nbcc_dock_ice_heave',
      category: 'marine',
      title: 'Boathouse Foundation (Ice Uplift)',
      codeRef: 'NBCC 9.4.4 / 9.12.2',
      summary: 'Structural requirement to account for the immense uplifting force of frozen lake ice.',
      metricVal: 'Engineer-Designed Anchorage / Piling',
      imperialVal: 'Engineer-Designed Anchorage / Piling',
      jobsiteNote: 'While floating docks ride the ice, permanent boathouses built on steel pipe piles or timber cribs must be specifically engineered to resist "ice jacking." Expanding winter ice will grab the pilings and rip the boathouse straight out of the lakebed if not driven deep into the bedrock.'
    },
		{
      id: 'nbcc_tol_rough_opening',
      category: 'framing_tolerances',
      title: 'Window & Door Rough Opening Tolerances',
      codeRef: 'Industry Standard / Best Practice',
      summary: 'Acceptable size margins when framing rough openings for exterior windows and doors.',
      metricVal: '+12 mm to +19 mm over Window Size',
      imperialVal: '+1/2" to +3/4" over Window Size',
      jobsiteNote: 'If the manufacturer calls for a 36" x 48" rough opening, you should ideally frame it 1/2" to 3/4" larger than the physical window unit. This allows for 1/4" to 3/8" of wiggle room on all sides to shim the window perfectly plumb, level, and square.'
    },
    {
      id: 'nbcc_tol_beam_deflection',
      category: 'framing_tolerances',
      title: 'Maximum Floor Beam Deflection (Bounce)',
      codeRef: 'NBCC 9.4.3.1',
      summary: 'Structural limit on how much a floor joist or beam is legally allowed to sag when heavily loaded.',
      metricVal: 'Max Deflection = Span / 360',
      imperialVal: 'Max Deflection = L / 360',
      jobsiteNote: 'This is the "bounce" code. If a floor joist spans 15 feet (180 inches), it is not legally allowed to sag more than 1/2 inch (180 divided by 360) in the dead center when people walk on it. For tile floors, engineers often upgrade this to a much stiffer L/480 or L/720 so the grout doesn\'t crack.'
    },
    {
      id: 'nbcc_marine_power_clearance',
      category: 'marine',
      title: 'Overhead Power Line Clearance (Water)',
      codeRef: 'CEC 75-012 / CSA C22.3',
      summary: 'Minimum vertical clearance for overhead electrical service wires crossing over navigable water to a boathouse.',
      metricVal: 'Min 5.5 m Above High Water Mark',
      imperialVal: 'Min 18 ft Above High Water Mark',
      jobsiteNote: 'If you run overhead triplex wire from the cottage down to the boathouse, it MUST hang at least 18 feet above the highest recorded water level so sailboat masts and fishing antennas do not snag the live wires.'
    },
    {
      id: 'nbcc_marine_pile_depth',
      category: 'marine',
      title: 'Steel Pipe Pile Embedment (Docks)',
      codeRef: 'NBCC 9.4.4.1 (Engineering principles)',
      summary: 'Required driven depth for steel pilings supporting permanent docks and boathouses.',
      metricVal: 'Driven to Refusal (Bedrock)',
      imperialVal: 'Driven to Refusal (Bedrock)',
      jobsiteNote: 'You cannot just push steel dock pipes 3 feet into the lakebed muck. To prevent the structure from sinking over time or being yanked out by winter ice, steel piles must be pounded down until they hit absolute refusal (solid bedrock) and then cross-braced.'
    },
		{
      id: 'nbcc_tol_shrinkage',
      category: 'framing_tolerances',
      title: 'Wood Shrinkage Allowance',
      codeRef: 'NBCC 9.23.4.1',
      summary: 'Framing requirements to account for the physical shrinking of wet lumber as it dries inside the heated house.',
      metricVal: 'Equalize Cross-Grain Wood Depth',
      imperialVal: 'Equalize Cross-Grain Wood Depth',
      jobsiteNote: 'Wood shrinks across the grain (width), not along the grain (length). If a steel column supports a steel beam, and a wood wall supports the other end of that beam, the wood wall will shrink 1/2" as it dries, while the steel won\'t shrink at all, causing a massive floor slope. You must match the amount of horizontal wood at all bearing points.'
    },
    {
      id: 'nbcc_marine_esd_sign',
      category: 'marine',
      title: 'Electric Shock Drowning (ESD) Signage',
      codeRef: 'CEC 78-062',
      summary: 'Mandatory warning signage for docks equipped with shore power or electrical pedestals.',
      metricVal: 'Permanent Warning Sign Visible from Water',
      imperialVal: 'Permanent Warning Sign Visible from Water',
      jobsiteNote: 'A critical CEC update: Any dock or marina providing electrical power must have a permanent, highly visible sign stating "WARNING — ELECTRIC SHOCK HAZARD — DO NOT SWIM IN MARINA WATERS". Stray voltage in fresh water paralyzes swimmers, causing drowning.'
    },
    {
      id: 'nbcc_marine_cable_splice',
      category: 'marine',
      title: 'Prohibition of Underwater Cable Splices',
      codeRef: 'CEC 12-012',
      summary: 'Rules regarding the splicing of electrical cables running to offshore boathouses.',
      metricVal: 'Zero Underwater Splices Permitted',
      imperialVal: 'Zero Underwater Splices Permitted',
      jobsiteNote: 'If you are running submarine cable out to a boathouse or island, the cable must be one continuous, unbroken run from the shore disconnect to the boathouse panel. You are strictly prohibited from splicing the wire underwater or burying a splice box in the lakebed.'
    },
		{
      id: 'nbcc_fin_temp_drywall',
      category: 'interior_finishes',
      title: 'Drywall Taping Temperature Limits',
      codeRef: 'NBCC 9.29.5.9.(1)',
      summary: 'Strict environmental conditions required before, during, and after drywall finishing.',
      metricVal: 'Maintain Min 10°C (50°F) for 48 Hours',
      imperialVal: 'Maintain Min 50°F for 48 Hours',
      jobsiteNote: 'You cannot board and tape a house in the winter without temporary heating. The house MUST be heated to at least 10°C (50°F) for two days before taping, during taping, and for two days after. If joint compound freezes before it cures, it turns to dust and the seams will crack.'
    },
    {
      id: 'nbcc_fin_tile_substrate',
      category: 'interior_finishes',
      title: 'Ceramic Tile Substrate Restrictions',
      codeRef: 'NBCC 9.30.6.1 / 9.29.10.4',
      summary: 'Prohibition against installing rigid tile directly to dimensionally unstable wood products.',
      metricVal: 'No Tile Directly on OSB or Particleboard',
      imperialVal: 'No Tile Directly on OSB or Particleboard',
      jobsiteNote: 'You cannot thin-set ceramic or porcelain tile directly onto an OSB or particleboard subfloor. Moisture from the mortar swells the wood flakes, popping the tiles. You must install a decoupling membrane (like Schluter Ditra), cement board, or exterior-grade plywood as the tile base.'
    },
    {
      id: 'nbcc_fin_wood_flooring_thickness',
      category: 'interior_finishes',
      title: 'Solid Wood Flooring Minimum Thickness',
      codeRef: 'NBCC 9.30.3.1',
      summary: 'Minimum physical thickness for strip or plank hardwood flooring installed over a continuous subfloor.',
      metricVal: 'Minimum 7.9 mm Thick',
      imperialVal: 'Minimum 5/16" Thick',
      jobsiteNote: 'If you are nailing down solid hardwood strips over a plywood subfloor, the flooring itself must be at least 5/16" thick. If the wood flooring is acting as both the subfloor AND the finish floor (spanning directly across joists), it must be at least 19 mm (3/4") thick.'
    },
    {
      id: 'nbcc_fin_wall_paneling',
      category: 'interior_finishes',
      title: 'Wood Paneling (Shiplap/Wainscoting) Thickness',
      codeRef: 'NBCC 9.29.6.1 / 9.29.6.2',
      summary: 'Minimum thickness for decorative wood paneling based on whether it has solid drywall backing.',
      metricVal: '4.7 mm (over drywall) / 9.5 mm (over bare studs)',
      imperialVal: '3/16" (over drywall) / 3/8" (over bare studs)',
      jobsiteNote: 'If you are nailing shiplap or MDF wainscoting directly to bare wall studs (16" OC), the material must be at least 3/8" thick to resist breaking when leaned against. If you are applying it over an existing drywall finish, it can be as thin as 3/16".'
    },
		{
      id: 'nbcc_fin_sleepers_concrete',
      category: 'interior_finishes',
      title: 'Wood Floor Sleepers on Concrete',
      codeRef: 'NBCC 9.30.1.2',
      summary: 'Moisture protection requirements when installing wood strapping (sleepers) over a concrete slab to support a finished floor.',
      metricVal: 'Pressure Treated OR Poly Separated',
      imperialVal: 'Pressure Treated OR Poly Separated',
      jobsiteNote: 'If you are laying 2x4 sleepers on a basement concrete floor to nail down a hardwood or plywood subfloor, those sleepers will wick moisture and rot. They must either be pressure-treated lumber OR sit entirely on top of a 6-mil polyethylene moisture barrier.'
    },
    {
      id: 'nbcc_fin_hallway_trim',
      category: 'interior_finishes',
      title: 'Hallway Minimum Width (Trim Clearance)',
      codeRef: 'NBCC 9.5.10.1',
      summary: 'Restriction on thick wall paneling or trim reducing the required exit width of a hallway.',
      metricVal: 'Must Maintain 860 mm Clear Width',
      imperialVal: 'Must Maintain 34" Clear Width',
      jobsiteNote: 'The absolute minimum legal width of a residential hallway is 860 mm (34"). If you frame a hallway exactly at 34" rough, and then add 1/2" drywall and thick 3/4" wainscoting on both sides, your finished width drops to 31.5", causing you to fail the final occupancy inspection.'
    },
    {
      id: 'nbcc_fin_wall_drywall_thin',
      category: 'interior_finishes',
      title: 'Minimum Drywall Thickness on Walls',
      codeRef: 'NBCC Table 9.29.5.3',
      summary: 'Restrictions on using thin 3/8" drywall based on wall stud spacing.',
      metricVal: '9.5 mm (3/8") Max 400 mm OC Studs',
      imperialVal: '3/8" Max 16" OC Studs',
      jobsiteNote: 'While 1/2" drywall is the industry standard for walls, 3/8" is sometimes used to save weight or cover existing walls. However, 3/8" drywall is strictly prohibited on walls where the framing is 24" on center; it can only be used on 16" OC framing.'
    },
		{
      id: 'nbcc_fin_underlayment_fasteners',
      category: 'interior_finishes',
      title: 'Flooring Underlayment Fastener Spacing',
      codeRef: 'NBCC 9.30.2.3',
      summary: 'Required stapling or nailing grid for thin plywood underlayment beneath vinyl or resilient flooring.',
      metricVal: '150 mm Edges / 200 mm Field',
      imperialVal: '6" Edges / 8" Field',
      jobsiteNote: 'When installing 1/4" mahogany or birch underlayment for sheet vinyl, you must use a massive amount of fasteners (staples or ring-shank nails). Space them 6 inches apart along all seams, and 8 inches apart throughout the entire middle of the sheet to prevent the vinyl from bubbling.'
    },
    {
      id: 'nbcc_fin_trim_hallway',
      category: 'interior_finishes',
      title: 'Trim Projection into Hallway Width',
      codeRef: 'NBCC 9.5.10.1.(2)',
      summary: 'Allowance for baseboards and moldings to project into the legally required minimum width of a hallway.',
      metricVal: 'Max 38 mm Projection on Each Side',
      imperialVal: 'Max 1-1/2" Projection on Each Side',
      jobsiteNote: 'A hallway must maintain 860 mm (34") of clear width between the drywall. However, the code provides an allowance: standard baseboards, chair rails, and trim can project up to 1.5 inches into that space on both sides without violating the egress width.'
    },
    {
      id: 'nbcc_fin_stair_carpet',
      category: 'interior_finishes',
      title: 'Stair Carpet & Padding Tolerance',
      codeRef: 'NBCC 9.8.4.7',
      summary: 'Limitation on how thick carpet and underpad can alter the legal dimensions of a stair tread.',
      metricVal: 'Must Not Compromise Min Tread Run',
      imperialVal: 'Must Not Compromise Min Tread Run',
      jobsiteNote: 'Ultra-plush carpet with a thick memory-foam pad wrapped tightly around a stair nosing can visually and physically alter the effective depth (run) of the tread, causing people to slip off the nose. The rough framing must account for the finished material to maintain the minimum legal tread depth.'
    },
		{
      id: 'nbcc_con_flatwork_thickness',
      category: 'concrete',
      title: 'Minimum Slab-on-Grade Thickness',
      codeRef: 'NBCC 9.16.4.3',
      summary: 'Required vertical depth for poured concrete basement and garage floors.',
      metricVal: '75 mm Minimum Thickness',
      imperialVal: '3" Minimum Thickness',
      jobsiteNote: 'While 75 mm (3 inches) is the bare legal minimum for a basement slab, 100 mm (4 inches) is the universal industry standard to prevent cracking and allow for proper coverage over embedded radiant heating tubes or wire mesh.'
    },
    {
      id: 'nbcc_con_aggregate_size',
      category: 'concrete',
      title: 'Maximum Aggregate Size in Concrete',
      codeRef: 'NBCC 9.3.1.4',
      summary: 'Limitation on the size of the gravel (coarse aggregate) used in concrete mixes.',
      metricVal: 'Max 1/5 Wall Thickness or 3/4 Clear Space',
      imperialVal: 'Max 1/5 Wall Thickness or 3/4 Clear Space',
      jobsiteNote: 'You cannot use 1-inch stone in a concrete mix if you are pouring a heavily reinforced ICF wall where the rebar is spaced 1 inch apart. The stones will jam and create "honeycomb" voids. The gravel can be no larger than 3/4 of the clear space between the rebar.'
    },
    {
      id: 'nbcc_ext_gutter_slope',
      category: 'exterior',
      title: 'Eavestrough (Gutter) Slope',
      codeRef: 'Industry Standard / Best Practice',
      summary: 'Required pitch for aluminum gutters to ensure proper drainage to downspouts.',
      metricVal: 'Minimum 1 in 240 (4 mm per Meter)',
      imperialVal: 'Minimum 1/16" per Foot',
      jobsiteNote: 'While the NBCC demands that roof water be managed, the physical slope of the gutter is a trade standard. Gutters must pitch toward the downspout at roughly 1/16" per foot. Perfectly level gutters will pool water, breed mosquitoes, and sag under ice weight.'
    },
    {
      id: 'nbcc_ext_soffit_clearance',
      category: 'exterior',
      title: 'Soffit Clearance to Grade',
      codeRef: 'NBCC 9.27.2.4',
      summary: 'Distance required between an exterior soffit/overhang and the ground to prevent moisture rot.',
      metricVal: 'Maintain Ground Clearance',
      imperialVal: 'Maintain Ground Clearance',
      jobsiteNote: 'If you have a low, sweeping roofline or a stepped foundation, ensure the finished wood or aluminum soffit does not bury into the landscaping or mulch. It must maintain clearance to prevent wicking ground moisture up into the roof structure.'
    },
		{
      id: 'nbcc_ext_soffit_fire',
      category: 'exterior',
      title: 'Soffit Fire Protection (Spatial Separation)',
      codeRef: 'NBCC 9.10.15.5',
      summary: 'Mandatory solid fire protection for eave overhangs built close to adjacent buildings.',
      metricVal: 'No Openings if Limiting Distance < 1.2 m',
      imperialVal: 'No Openings if Limiting Distance < 4 ft',
      jobsiteNote: 'National fire code dictates that if a roof overhang projects into the 1.2m (4 ft) limiting distance zone from the property line, the entire underside of that soffit must be clad in a solid, fire-resistant material with zero ventilation perforations.'
    },
    {
      id: 'nbcc_ext_gutter_overflow',
      category: 'exterior',
      title: 'Downspout Point of Discharge',
      codeRef: 'NBCC 9.14.5.2',
      summary: 'Mandatory rules for where rainwater collected by the eavestrough system is deposited.',
      metricVal: 'Prevent Soil Erosion and Foundation Pooling',
      imperialVal: 'Prevent Soil Erosion and Foundation Pooling',
      jobsiteNote: 'You cannot just drop a downspout straight down to the foundation corner. It must include an elbow and an extension or splash pad that carries the bulk water far enough away to prevent washing out the backfill or hydraulically overloading the underground weeping tile system.'
    },
    {
      id: 'nbcc_con_wire_mesh',
      category: 'concrete',
      title: 'Welded Wire Mesh Placement',
      codeRef: 'NBCC 9.16.4 / CSA A23.1',
      summary: 'Structural positioning requirement for steel reinforcement mesh in concrete slabs.',
      metricVal: 'Position in Upper 1/3 of Slab Thickness',
      imperialVal: 'Position in Upper 1/3 of Slab Thickness',
      jobsiteNote: 'A classic concrete failure: unrolling wire mesh directly on the dirt or poly and pouring concrete over it does absolutely nothing. The mesh MUST be pulled up or set on plastic "chairs" so it cures in the top third of the slab to effectively hold shrinkage cracks tightly together.'
    },
		{
      id: 'nbcc_nrg_thermal_bridge',
      category: 'energy',
      title: 'Thermal Bridging Continuous Insulation',
      codeRef: 'NBCC 9.36.2.4 / 9.36.2.5',
      summary: 'Requirements to break the thermal bridge of wood framing using continuous exterior insulation.',
      metricVal: 'Effective R-Value Calculation Required',
      imperialVal: 'Effective R-Value Calculation Required',
      jobsiteNote: 'Under Section 9.36, you can no longer just look at the R-value printed on the fiberglass batt. You must calculate the "Effective R-Value" which factors in the heat lost through the wooden studs. This essentially forces builders to install continuous rigid foam or mineral wool on the exterior of the housewrap.'
    },
    {
      id: 'nbcc_site_drainage_slope',
      category: 'site_work',
      title: 'Lot Surface Drainage Gradient',
      codeRef: 'NBCC 9.14.6.1',
      summary: 'Mandatory slope of the finished landscaping soil away from the foundation walls.',
      metricVal: 'Slope away from building for min 3.0 m',
      imperialVal: 'Slope away from building for min 10 ft',
      jobsiteNote: 'The final grade of the dirt/grass must slope visibly away from the foundation for at least 3 meters (10 feet). If the house is squeezed between two other homes, you must cut a swale (a shallow drainage ditch) exactly on the property line to carry the water to the street.'
    },
    {
      id: 'nbcc_acc_door_width',
      category: 'accessibility',
      title: 'Barrier-Free Doorway Width',
      codeRef: 'NBCC 9.5.11.1 / Section 3.8',
      summary: 'Minimum clear opening width for a door serving a barrier-free path of travel.',
      metricVal: '850 mm Clear Width',
      imperialVal: '33-1/2" Clear Width',
      jobsiteNote: 'To get an 850 mm (33.5") CLEAR opening when the door is swung open at 90 degrees, you must install a 36-inch (914 mm) door slab. A standard 32-inch interior door is entirely illegal on a designated barrier-free path.'
    },
    {
      id: 'nbcc_pool_glazing',
      category: 'pools',
      title: 'Safety Glazing Near Pools',
      codeRef: 'NBCC 9.6.1.4',
      summary: 'Requirement for safety glass when windows are located dangerously close to a pool deck or hot tub.',
      metricVal: 'Tempered Glass if < 1.5 m from Pool Edge',
      imperialVal: 'Tempered Glass if < 5 ft from Pool Edge',
      jobsiteNote: 'If someone slips on a wet pool deck and crashes into a house window, plate glass is a guillotine. Any window located within 1.5 meters (approx 5 feet) of the water\'s edge or the walking surface of a pool deck must be tempered safety glass.'
    },
		{
      id: 'nbcc_nrg_effective_rsi',
      category: 'energy',
      title: 'Effective Thermal Resistance (RSI)',
      codeRef: 'NBCC 9.36.2.4',
      summary: 'Calculation method requiring builders to account for the heat loss passing straight through the wood framing (thermal bridging).',
      metricVal: 'Must Calculate Effective RSI (Not Nominal)',
      imperialVal: 'Must Calculate Effective R-Value (Not Nominal)',
      jobsiteNote: 'A 2x6 stud has an R-value of about R-6.8. If you put R-22 insulation between studs spaced 16" on center, the wall\'s overall "effective" R-value drops to about R-16 because the wood acts as a thermal bridge. The NBCC forces you to calculate and compensate for this wood percentage.'
    },
    {
      id: 'nbcc_nrg_attic_heel',
      category: 'energy',
      title: 'Roof Truss Raised Heel (Energy Heel)',
      codeRef: 'NBCC 9.36.2.6',
      summary: 'Requirement to maintain minimum insulation depth over the top plate at the exterior wall perimeter.',
      metricVal: 'Ensure Minimum Effective RSI at Eaves',
      imperialVal: 'Ensure Minimum Effective R-Value at Eaves',
      jobsiteNote: 'Standard roof trusses pinch down to 3.5 inches thick at the exterior wall, squeezing the insulation and causing ice dams. To meet energy codes, you must order "Raised Heel" trusses that sit 12+ inches above the wall, allowing full-depth R-60 insulation all the way to the outside edge.'
    },
    {
      id: 'nbcc_nrg_air_barrier',
      category: 'energy',
      title: 'Continuous Air Barrier System',
      codeRef: 'NBCC 9.36.2.9',
      summary: 'Requirement for a perfectly continuous barrier blocking uncontrolled air leakage through the building envelope.',
      metricVal: 'Continuous Throughout Entire Envelope',
      imperialVal: 'Continuous Throughout Entire Envelope',
      jobsiteNote: 'The air barrier is typically the 6-mil poly on the inside, OR the taped Tyvek/Typar on the outside. Whichever system you designate as the primary air barrier, it must be completely sealed at every window, door, top plate, and floor joist transition.'
    },
    {
      id: 'nbcc_nrg_duct_seal',
      category: 'energy',
      title: 'HVAC Duct Sealing',
      codeRef: 'NBCC 9.36.3.2',
      summary: 'Requirement to seal joints in heating and cooling ductwork to prevent conditioned air loss.',
      metricVal: 'Seal All Joints (Mastic or Foil Tape)',
      imperialVal: 'Seal All Joints (Mastic or Foil Tape)',
      jobsiteNote: 'You can no longer just slip sheet metal duct sections together. Every seam, elbow, and boot connection must be physically sealed with UL-181 foil tape or duct mastic paste, especially if the ducts run through unconditioned spaces like attics or crawlspaces.'
    },
    {
      id: 'nbcc_nrg_unheated_slab',
      category: 'energy',
      title: 'Unheated Slab-on-Grade Insulation',
      codeRef: 'NBCC 9.36.2.8',
      summary: 'Perimeter insulation requirements for standard house slabs poured at ground level without in-floor heating.',
      metricVal: 'Insulate Perimeter Min 1.2m Inward or Downward',
      imperialVal: 'Insulate Perimeter Min 4 ft Inward or Downward',
      jobsiteNote: 'Even if the slab is unheated, the perimeter edge loses massive amounts of heat. You must install rigid insulation extending down the foundation wall and inward under the slab for a distance of at least 4 feet around the entire perimeter.'
    },
		{
      id: 'nbcc_nrg_tiered_performance',
      category: 'energy',
      title: 'Tiered Energy Performance Compliance',
      codeRef: 'NBCC 9.36.7 / 9.36.5',
      summary: 'National progressive performance framework requiring modeled percentage reductions in energy consumption above baseline code.',
      metricVal: 'Tier 2 Requires ≥ 10% Improvement Over Baseline',
      imperialVal: 'Tier 2 Requires ≥ 10% Improvement Over Baseline',
      jobsiteNote: 'Modern code adoptions increasingly require builders to hit "Tier 2" or higher. Rather than just following prescriptive R-value checklists, an Energy Advisor models the home in HOT2000 to prove the overall annual energy consumption is at least 10% lower than the baseline reference house.'
    },
    {
      id: 'nbcc_nrg_fdwr_limit',
      category: 'energy',
      title: 'Fenestration and Door to Wall Ratio (FDWR)',
      codeRef: 'NBCC 9.36.2.3',
      summary: 'Prescriptive limit on the total allowable percentage of window and glass door area on exterior walls.',
      metricVal: 'Max 17% to 22% of Gross Wall Area',
      imperialVal: 'Max 17% to 22% of Gross Wall Area',
      jobsiteNote: 'Under prescriptive compliance, you cannot build a glass wall of floor-to-ceiling windows. If your total window and door area exceeds 17% to 22% (depending on heating degree days) of the gross exterior wall area, you are kicked out of the prescriptive path and forced into custom energy modeling.'
    },
    {
      id: 'nbcc_nrg_attic_hatch',
      category: 'energy',
      title: 'Attic Access Hatch Insulation',
      codeRef: 'NBCC 9.36.2.6.(6)',
      summary: 'Required thermal resistance and weatherstripping for attic scuttle panels.',
      metricVal: 'Minimum RSI 2.60 + Closed-Cell Weatherstrip',
      imperialVal: 'Minimum R-15 + Closed-Cell Weatherstrip',
      jobsiteNote: 'An uninsulated piece of plywood over the attic hatch ruins the ceiling\'s thermal envelope. The hatch cover MUST be insulated with at least R-15 rigid foam attached to the back, and the frame must have continuous weatherstripping with a mechanical clamp to block air leaks.'
    },
    {
      id: 'nbcc_nrg_hot_water_pipe',
      category: 'energy',
      title: 'Service Hot Water Pipe Insulation',
      codeRef: 'NBCC 9.36.4.2',
      summary: 'Insulation requirements for domestic hot water pipes leaving the water heater.',
      metricVal: 'Min 12 mm Foam Wrap on First 2 Meters',
      imperialVal: 'Min 1/2" Foam Wrap on First 6.5 Feet',
      jobsiteNote: 'You must install 1/2-inch closed-cell pipe insulation around the first 2 meters (6.5 feet) of the hot water pipe leaving the water heater, as well as on any piping associated with a recirculating hot water loop, to stop standby thermal losses.'
    },
		{
      id: 'nbcc_nrg_duct_insulation',
      category: 'energy',
      title: 'Ductwork Insulation in Unconditioned Space',
      codeRef: 'NBCC 9.36.3.2.(2)',
      summary: 'Mandatory insulation values for heating or cooling ducts running through unheated attics or crawlspaces.',
      metricVal: 'Minimum RSI 1.10 to RSI 2.10 based on Temp Delta',
      imperialVal: 'Minimum R-6 to R-12 based on Temp Delta',
      jobsiteNote: 'Running a hot supply duct through a freezing winter attic causes massive energy loss. If ducts must go through unconditioned space, they must be heavily wrapped in insulation. Best practice is to design the duct layout completely inside the drop ceilings of the heated living footprint.'
    },
    {
      id: 'nbcc_nrg_piping_insulation',
      category: 'energy',
      title: 'Cooling System Piping Insulation',
      codeRef: 'NBCC 9.36.4.2',
      summary: 'Requirement to insulate refrigerant line sets for air conditioning and heat pump systems.',
      metricVal: 'Minimum 13 mm Wall Thickness Insulation',
      imperialVal: 'Minimum 1/2" Wall Thickness Insulation',
      jobsiteNote: 'The thick, cold copper suction line running from the outdoor compressor unit into the indoor coil must be wrapped in closed-cell foam pipe insulation. This prevents the line from absorbing heat from outside and stops moisture from condensing and dripping onto building materials.'
    },
		{
      id: 'nbcc_site_drainage_gradient',
      category: 'site_work',
      title: 'Surface Drainage Runoff Gradient',
      codeRef: 'NBCC 9.14.6.1.',
      summary: 'Minimum protective slope requirement for the final surface grading surrounding a residential structure.',
      metricVal: 'Minimum 2% Slope Away from Building',
      imperialVal: 'Minimum 1/4" per Foot Slope Away from Building',
      jobsiteNote: 'The 2% slope must be maintained on all sides of the building envelope. Inspectors will watch carefully around window wells—the surrounding grade must drop away to prevent the wells from filling up like swimming pools.'
    },
    {
      id: 'nbcc_site_backfill_materials',
      category: 'site_work',
      title: 'Foundation Backfill Material Restrictions',
      codeRef: 'NBCC 9.12.3.1.',
      summary: 'Prohibition against using large rocks, frozen earth, or organic debris when backfilling against foundation walls.',
      metricVal: 'Clean, Well-Graded Granular Material',
      imperialVal: 'Clean, Well-Graded Granular Material',
      jobsiteNote: 'Do not push large, jagged boulders or chunks of frozen clay back against a concrete wall during backfilling. Heavy impact can fracture the concrete or puncture the dampproofing membrane/weeping tile pipe below.'
    },
    {
      id: 'nbcc_site_excavation_safety',
      category: 'site_work',
      title: 'Excavation Sloping and Shoring Triggers',
      codeRef: 'NBCC 9.12.2.1. / Provincial Safety Regs',
      summary: 'Rules governing the stability of trench walls and deep soil cuts during foundation excavation.',
      metricVal: 'Shore or Bench if Trench Exceeds 1.2 m',
      imperialVal: 'Shore or Bench if Trench Exceeds 4 ft',
      jobsiteNote: 'While excavation is underway, any straight-cut dirt face deeper than 4 feet must either be shored up or sloped back (usually at a 1:1 or 45-degree angle depending on soil type) to eliminate cave-in risks for workers laying footings.'
    },
		{
      id: 'nbcc_site_sump_discharge',
      category: 'site_work',
      title: 'Sump Pump Exterior Discharge',
      codeRef: 'NBCC 9.14.5.2.(2)',
      summary: 'Rules governing where a foundation sump pump is legally allowed to dump extracted groundwater.',
      metricVal: 'Discharge to Safe Exterior Point (No Sidewalk Icing)',
      imperialVal: 'Discharge to Safe Exterior Point (No Sidewalk Icing)',
      jobsiteNote: 'You cannot pipe a sump pump discharge directly onto a public sidewalk, driveway, or onto a neighbor\'s property where the water will pool or freeze into a dangerous sheet of ice. The discharge must be directed to a splash pad, a municipal storm sewer (if permitted), or a dedicated drainage swale on your own lot.'
    },
    {
      id: 'nbcc_site_fill_compaction',
      category: 'site_work',
      title: 'Compaction of Fill Beneath Floors',
      codeRef: 'NBCC 9.16.2.2.(3)',
      summary: 'Mandatory soil compaction rules when adjusting the elevation of a building footprint before pouring concrete.',
      metricVal: 'All Fill Must Be Mechanically Compacted',
      imperialVal: 'All Fill Must Be Mechanically Compacted',
      jobsiteNote: 'If you have to bring in soil or gravel to raise the grade under a basement floor or garage slab, it cannot just be dumped by the excavator. It must be mechanically compacted in lifts (layers) to prevent the slab from cracking and sinking as the dirt settles over the next 5 years.'
    },
    {
      id: 'nbcc_site_trench_backfill',
      category: 'site_work',
      title: 'Backfilling Over Underground Services',
      codeRef: 'NBCC / Plumbing Code (NPC)',
      summary: 'Protective measures when covering underground pipes to prevent crushing or puncturing.',
      metricVal: 'Min 300 mm Clean Cover Before Heavy Compaction',
      imperialVal: 'Min 12" Clean Cover Before Heavy Compaction',
      jobsiteNote: 'When backfilling the trench over the PVC sewer lateral or PEX water main, the first 12 inches of fill must be clean sand or fine gravel with no rocks larger than 1 inch. You cannot drop massive clumps of clay or run a heavy jumping-jack compactor directly over the bare pipes.'
    },
		{
      id: 'nbcc_site_radon_pipe',
      category: 'site_work',
      title: 'Radon Extraction Pipe Placement',
      codeRef: 'NBCC 9.13.4.3',
      summary: 'Location and sealing requirements for the sub-slab soil gas extraction pipe.',
      metricVal: 'Min 100 mm Pipe near Center of Floor',
      imperialVal: 'Min 4" Pipe near Center of Floor',
      jobsiteNote: 'The Radon extraction pipe is best placed near the center of the basement footprint so the vacuum pull reaches all foundation walls equally. Where the pipe penetrates the 6-mil poly vapour barrier and the concrete slab, it must be fiercely caulked/sealed.'
    },
    {
      id: 'nbcc_site_weeping_elevation',
      category: 'site_work',
      title: 'Weeping Tile Elevation',
      codeRef: 'NBCC 9.14.4.1.(1)',
      summary: 'Critical elevation requirement for the perimeter foundation drainage pipe (weeping tile).',
      metricVal: 'Top of Tile Must Be Below Floor Slab',
      imperialVal: 'Top of Tile Must Be Below Floor Slab',
      jobsiteNote: 'The weeping tile pipe MUST be laid beside the footing so that the very TOP of the 4-inch pipe is lower than the BOTTOM of the interior basement floor slab. If the pipe is installed too high, groundwater will flood the underside of the floor before it ever spills into the drain.'
    },
    {
      id: 'nbcc_site_sediment_control',
      category: 'site_work',
      title: 'Construction Site Sediment Control',
      codeRef: 'NBCC Part 8 (Public Protection) / Local Bylaw',
      summary: 'Requirement to contain excavated mud and runoff within the property boundaries during construction.',
      metricVal: 'Perimeter Silt Fencing Required',
      imperialVal: 'Perimeter Silt Fencing Required',
      jobsiteNote: 'Before the excavator even fires up, you usually must install a heavy fabric silt fence trenched into the dirt around the low sides of the lot. If a rainstorm washes your site\'s mud onto the public sidewalk or into the municipal storm grates, you will face massive environmental fines.'
		},
		{
      id: 'nbcc_acc_corridor_width',
      category: 'accessibility',
      title: 'Barrier-Free Path of Travel (Corridors)',
      codeRef: 'NBCC 3.8.3.2.(1)',
      summary: 'Minimum width for hallways and corridors serving as an accessible route.',
      metricVal: 'Min 1100 mm Width',
      imperialVal: 'Min 43-1/4" Width',
      jobsiteNote: 'If a hallway is designated as a barrier-free path, the standard 860 mm (34") residential hallway width is illegal. The corridor must be framed wide enough to guarantee an unobstructed finished width of at least 1100 mm to allow a wheelchair and a walking person to pass each other.'
    },       
    {
      id: 'nbcc_acc_stair_tactile',
      category: 'accessibility',
      title: 'Tactile Walking Surface Indicators (TWSI)',
      codeRef: 'NBCC 3.8.3.18.(1)',
      summary: 'Warning surfaces required at the top of unprotected stairs for visually impaired persons.',
      metricVal: 'Required at Top of Stairs (Public/Shared)',
      imperialVal: 'Required at Top of Stairs (Public/Shared)',
      jobsiteNote: 'In shared residential buildings or exterior accessible paths, the landing at the top of a staircase must have a strip of raised tactile domes (usually cast iron or rubber) located one tread-depth back from the top step to warn visually impaired pedestrians of the drop-off.'
    },		
    {
      id: 'nbcc_acc_ramp_landings',
      category: 'accessibility',
      title: 'Accessible Ramp Landings',
      codeRef: 'NBCC 3.8.3.5.(1)',
      summary: 'Required dimensions for level resting platforms at the top, bottom, and directional changes of a ramp.',
      metricVal: 'Min 1500 mm x 1500 mm',
      imperialVal: 'Min 60" x 60"',
      jobsiteNote: 'If a ramp changes direction (like an L-shape or U-shape), you cannot just bank the corner. There must be a perfectly level (max 2% cross-slope for water drainage) 5-foot by 5-foot landing platform at the corner to allow the wheelchair user to safely pivot.'
    },
    {
      id: 'nbcc_acc_door_latch_clearance',
      category: 'accessibility',
      title: 'Door Latch Side Clearance',
      codeRef: 'NBCC 3.8.3.6.(11)',
      summary: 'Required empty wall space immediately beside the handle (latch) side of a door.',
      metricVal: 'Min 600 mm on Pull Side / 300 mm on Push Side',
      imperialVal: 'Min 24" on Pull Side / 12" on Push Side',
      jobsiteNote: 'You cannot frame a barrier-free door tightly into a corner. A wheelchair user needs room to park beside the door to reach the handle and pull it open. You must leave at least 24 inches of blank wall space on the "pull" side of the door.'
    },   
		{
      id: 'nbcc_pool_underground_wiring',
      category: 'pools',
      title: 'Underground Wiring Clearance',
      codeRef: 'CEC 68-056',
      summary: 'Minimum separation distance between buried electrical cables and the pool structure.',
      metricVal: 'No Buried Cables within 1.5 m of Pool',
      imperialVal: 'No Buried Cables within 5 ft of Pool',
      jobsiteNote: 'When trenching power to a shed or landscaping lights, you CANNOT run the underground PVC conduit or NMWU cable within 1.5 meters (5 feet) of the pool walls. This prevents the cables from being struck when digging to repair pool plumbing.'
    },
    {
      id: 'nbcc_pool_pump_gfci',
      category: 'pools',
      title: 'Pool Pump GFCI Protection',
      codeRef: 'CEC 68-068',
      summary: 'Mandatory ground-fault protection for the electrical motor circulating the pool water.',
      metricVal: 'Class A GFCI Protection Required',
      imperialVal: 'Class A GFCI Protection Required',
      jobsiteNote: 'The pool pump itself must be protected by a Class A GFCI breaker, regardless of whether it is hardwired or plugged into a receptacle. This ensures that if the motor windings short out, the power is killed before the water becomes electrified.'
    },
    {
      id: 'nbcc_pool_overhead_power',
      category: 'pools',
      title: 'Overhead Power Line Clearance',
      codeRef: 'CEC 68-054',
      summary: 'Strict clearance requirements for overhead electrical service wires passing above or near a swimming pool.',
      metricVal: 'Min 7.5 m Clearance Above Pool',
      imperialVal: 'Min 24.5 ft Clearance Above Pool',
      jobsiteNote: 'You generally cannot build a pool directly under the main overhead service wires feeding the house. If wires must pass over the pool or diving board, they must hang a massive 7.5 meters (approx. 24.5 feet) above the water to prevent someone hitting them with a pool skimmer pole.'
    },
    {
      id: 'nbcc_pool_enclosure_bylaw',
      category: 'pools',
      title: 'Pool Enclosure (Municipal Standard)',
      codeRef: 'Standard Municipal By-Law (e.g., Toronto Chapter 447)',
      summary: 'Universal Canadian municipal standard for private swimming pool fences.',
      metricVal: 'Min 1.2 m Tall, Non-Climbable, Self-Latching',
      imperialVal: 'Min 48" Tall, Non-Climbable, Self-Latching',
      jobsiteNote: 'While technically enforced by municipal by-law rather than the NBCC, the universal rule across Canada is a 1.2-meter (48-inch) high fence. Chain link must have a maximum 1.5-inch mesh, and vertical boards can have a maximum 100mm (4-inch) gap. The gate must be self-closing and self-latching.'
    },
		{
      id: 'nbcc_pool_junction_box',
      category: 'pools',
      title: 'Underwater Lighting Junction Box Elevation',
      codeRef: 'CEC 68-060',
      summary: 'Mandatory height clearances for the electrical deck box feeding the underwater pool lights.',
      metricVal: 'Must Be Above Normal Water Level & Deck Grade',
      imperialVal: 'Must Be Above Normal Water Level & Deck Grade',
      jobsiteNote: 'The junction box where the underwater light cord splices into the house wiring cannot be flush-mounted into the concrete deck where puddles form. It must be elevated above the finished deck level and above the maximum pool water level to guarantee water never drains into the conduit.'
    },
    {
      id: 'nbcc_pool_gfci_reach',
      category: 'pools',
      title: 'GFCI Reset Separation Distance',
      codeRef: 'CEC 68-068 / Appendix B',
      summary: 'Strategic placement of ground fault reset buttons relative to the pool edge.',
      metricVal: 'Must Not Be Reachable from Inside Pool',
      imperialVal: 'Must Not Be Reachable from Inside Pool',
      jobsiteNote: 'If the GFCI receptacle or breaker protecting the pool pump trips, a person must not be able to reach out of the water to press the "Reset" button. It must be located far enough away (or behind a barrier) to ensure the user is standing safely on dry land before re-energizing the circuit.'
    },
    {
      id: 'nbcc_pool_storable_bond',
      category: 'pools',
      title: 'Above-Ground / Storable Pool Bonding',
      codeRef: 'CEC 68-058 / Standata 24-ECI-068',
      summary: 'Equipotential bonding rules for temporary, storable, or above-ground backyard pools.',
      metricVal: 'Bonding Ring Required for Conductive Perimeters',
      imperialVal: 'Bonding Ring Required for Conductive Perimeters',
      jobsiteNote: 'Just because a pool is "temporary" or above-ground doesn\'t mean it skips electrical code. If the pool has a conductive metal frame, metal ladder, or sits near metal fences, a copper equipotential bonding ring is still highly recommended or strictly required depending on the provincial inspector\'s interpretation of the pump\'s grounding.'
    }
  ],
	usa_irc: [
		{
      id: 'all_deck_ijoist_ledger',
      category: 'decks',
      title: 'Ledger Attachment to Engineered I-Joist Rim Board',
      codeRef: 'IRC R507.9.1.2 / NBC / OBC Spec',
      summary: 'Attachment rules when bolting a deck ledger into an engineered wood rim board (rim joist).',
      metricVal: 'Requires Interior 38mm Backer Blocking or Manufacturer Spec',
      imperialVal: 'Requires Interior 2x Backer Blocking or Manufacturer Spec',
      jobsiteNote: 'You CANNOT lag bolt a deck ledger into an engineered OSB rim board alone. You must install continuous 2x8/2x10 solid wood or engineered backer blocking inside the joist bays against the inside face of the rim board before through-bolting.'
    },
		{
      id: 'irc_plumb_seismic_strapping',
      category: 'plumbing',
      title: 'Water Heater Seismic Strapping',
      codeRef: 'IRC P2801.8',
      summary: 'Mandatory earthquake restraint strapping for water heaters in Seismic Design Categories C, D0, D1, and D2.',
      metricVal: 'Two Heavy-Gauge Straps (Upper & Lower Third)',
      imperialVal: 'Two Heavy-Gauge Straps (Upper & Lower Third)',
      jobsiteNote: 'Water heaters must be anchored against overturning with two heavy steel straps anchored directly into wall framing studs. One strap must be in the upper third of the tank, and one in the lower third (above the controls).'
    },
		{
      id: 'all_framing_attic_ladder',
      category: 'framing',
      title: 'Pull-Down Attic Ladder Truss Cutting',
      codeRef: 'OBC / NBCC 9.23.13.11 / IRC R802.10.4',
      summary: 'Strict prohibition against cutting bottom chords of engineered roof trusses to fit pull-down attic access stairs.',
      metricVal: 'Zero Cutting Without Stamped Engineer Drawing',
      imperialVal: 'Zero Cutting Without Stamped Engineer Drawing',
      jobsiteNote: 'If a rough opening for folding attic stairs does not fit between the standard 24" OC bottom chords of your roof trusses, you CANNOT saw through a truss chord to header it out. You must either order a narrow 22.5" rough-in ladder or get a structural engineer\'s stamped repair detail.'
    },
    {
      id: 'irc_stair_rise',
      category: 'stairs',
      title: 'Maximum Riser Height',
      codeRef: 'IRC R311.7.5.1',
      summary: 'Maximum allowable vertical step rise measured vertically between leading edges of adjacent treads.',
      metricVal: '196 mm Max',
      imperialVal: '7-3/4" Max',
      jobsiteNote: 'Strict tolerance: The greatest riser height within any flight shall not exceed the smallest by more than 3/8" (9.5 mm).'
    },
    {
      id: 'irc_stair_tread',
      category: 'stairs',
      title: 'Minimum Tread Depth (Run)',
      codeRef: 'IRC R311.7.5.2',
      summary: 'Minimum horizontal tread run measured horizontally between the vertical planes of the foremost projections of adjacent treads.',
      metricVal: '254 mm Min',
      imperialVal: '10" Min',
      jobsiteNote: 'The greatest tread depth within any flight shall not exceed the smallest by more than 3/8" (9.5 mm).'
    },
    {
      id: 'irc_stair_nosing',
      category: 'stairs',
      title: 'Tread Nosing Projection Range',
      codeRef: 'IRC R311.7.5.3',
      summary: 'Required leading-edge overhang when solid risers are used and tread depth is less than 11 inches.',
      metricVal: '19 mm Min to 32 mm Max',
      imperialVal: '3/4" Min to 1-1/4" Max',
      jobsiteNote: 'Nosing curvature or bevel radius cannot exceed 9/16" (14 mm). Open risers are prohibited if stairs rise more than 30" above grade.'
    },
    {
      id: 'irc_stair_headroom',
      category: 'stairs',
      title: 'Minimum Clear Headroom',
      codeRef: 'IRC R311.7.2',
      summary: 'Minimum vertical overhead clearance measured from a sloped plane connecting the tread nosings.',
      metricVal: '2032 mm Min',
      imperialVal: '6\'8" Min (80")',
      jobsiteNote: 'Notice that U.S. IRC requires 6\'8" headroom compared to the Canadian 6\'5" baseline. Measure carefully when framing stairwell rough openings.'
    },
    {
      id: 'irc_stair_width',
      category: 'stairs',
      title: 'Minimum Clear Stairway Width',
      codeRef: 'IRC R311.7.1',
      summary: 'Minimum required clear width at all points above the permitted handrail height and below the required headroom height.',
      metricVal: '914 mm Min',
      imperialVal: '36" Min',
      jobsiteNote: 'Handrails may project into the required width up to 4.5" (114 mm) on either side. Minimum clear width between handrails is 27" (with one rail) or 31.5" (with two).'
    },
    {
      id: 'irc_stair_handrail_height',
      category: 'stairs',
      title: 'Handrail Height Range',
      codeRef: 'IRC R311.7.8.1',
      summary: 'Required vertical height for stair handrails measured from the sloped plane of the tread nosings.',
      metricVal: '864 mm Min to 965 mm Max',
      imperialVal: '34" Min to 38" Max',
      jobsiteNote: 'Handrail grip must be continuous for the full length of the flight from the top riser to the bottom riser without interruption by newel posts.'
    },
		{
      id: 'irc_guard_trigger',
      category: 'decks',
      title: 'Elevation Requiring Guardrails',
      codeRef: 'IRC R312.1.1',
      summary: 'Vertical height difference above grade or lower floor that makes perimeter guardrails legally mandatory.',
      metricVal: '762 mm Drop',
      imperialVal: '30" Drop (2.5 ft)',
      jobsiteNote: 'Notice the major US vs Canada difference: U.S. code allows an open deck drop up to 30 inches without a railing, whereas Canadian codes mandate railings at 24 inches.'
    },
    {
      id: 'irc_guard_trigger_zone',
      category: 'decks',
      title: '36-Inch Horizontal Measurement Zone',
      codeRef: 'IRC R312.1.1',
      summary: 'Horizontal perimeter distance evaluated to determine if sloped grade below triggers the 30-inch guardrail requirement.',
      metricVal: '914 mm Horizontal Buffer',
      imperialVal: '36" Horizontal Buffer',
      jobsiteNote: 'If the ground slopes away from your deck, you must measure down vertically at a point 36 inches horizontally outward from the deck edge. If that drop exceeds 30 inches, a guard is required.'
    },
    {
      id: 'irc_guard_height',
      category: 'decks',
      title: 'Universal Minimum Guard Height',
      codeRef: 'IRC R312.1.2',
      summary: 'Required vertical height for all residential guardrails regardless of total drop elevation.',
      metricVal: '914 mm Min',
      imperialVal: '36" Min',
      jobsiteNote: 'Unlike Canada’s tiered 36"/42" system, the U.S. IRC allows 36-inch tall guardrails on second and third-story decks, though many builders opt for 42" on high decks as a best practice.'
    },
    {
      id: 'irc_guard_spacing',
      category: 'decks',
      title: 'Baluster Opening Spacing Limit',
      codeRef: 'IRC R312.1.3',
      summary: 'Maximum allowable clearance gap between adjacent vertical spindles or infill members.',
      metricVal: '102 mm Sphere Rule',
      imperialVal: '4" Sphere Rule',
      jobsiteNote: 'Openings shall not allow passage of a 4-inch diameter sphere up to a height of 36 inches. Space standard 1.5" x 1.5" pickets no more than 3-7/8" apart.'
    },
    {
      id: 'irc_guard_stair_triangle',
      category: 'decks',
      title: 'Stair Guard Bottom Triangle Limit',
      codeRef: 'IRC R312.1.3 (Ex. 2)',
      summary: 'Maximum size of the triangular opening formed by a riser, tread, and the bottom rail of a guard along open-sided stairs.',
      metricVal: '152 mm Sphere Rule',
      imperialVal: '6" Sphere Rule',
      jobsiteNote: 'Because the stair guard rail runs parallel to the stair pitch, a triangle is formed over every tread. This specific gap can allow a 6" sphere, but not larger.'
    },
    {
      id: 'irc_guard_post_load',
      category: 'decks',
      title: 'Top Rail Structural Load Limit',
      codeRef: 'IRC Table R301.5',
      summary: 'Required structural design capacity applied in any direction along the top edge of the guardrail.',
      metricVal: '0.89 kN Concentrated Load',
      imperialVal: '200 lbs Concentrated Load',
      jobsiteNote: 'The 200 lb concentrated force requirement is nearly double the Canadian baseline. Notched 4x4 posts almost always fail this standard; use approved mechanical tension-tie brackets.'
    },
		{
      id: 'irc_deck_live_load',
      category: 'decks',
      title: 'Design Live Load Capacity',
      codeRef: 'IRC Table R301.5',
      summary: 'Required uniform structural load capacity for exterior residential decks.',
      metricVal: '1.92 kPa Live Load (0.48 kPa Dead Load)',
      imperialVal: '40 PSF Live Load (10 PSF Dead Load)',
      jobsiteNote: 'Balconies elevated more than 10 feet above grade serving primary dwelling spaces must be designed for a higher 60 PSF live load under recent IRC updates.'
    },
    {
      id: 'irc_deck_joist_cantilever',
      category: 'decks',
      title: 'Maximum Joist Cantilever Span Ratio',
      codeRef: 'IRC R507.6',
      summary: 'Allowable joist overhang measured from the center of the support beam to the outer edge of the rim joist.',
      metricVal: 'Up to 1/4 of Adjacent Span (L/4)',
      imperialVal: 'Up to 1/4 of Adjacent Span (L/4)',
      jobsiteNote: 'If your joist backspan from the house ledger to the beam is 12 feet, your maximum cantilever past the beam is 3 feet (12 / 4 = 3). Cannot exceed maximum prescriptive tables.'
    },
    {
      id: 'irc_deck_beam_cantilever',
      category: 'decks',
      title: 'Maximum Beam Overhang past Posts',
      codeRef: 'IRC R507.5',
      summary: 'Allowable horizontal projection of multi-ply drop beams extending past the center of end support posts.',
      metricVal: 'Up to 1/4 of Adjacent Span (L/4)',
      imperialVal: 'Up to 1/4 of Adjacent Span (L/4)',
      jobsiteNote: 'If your drop beam posts are spaced 8 feet apart on center, your beam can cantilever a maximum of 2 feet past the end post (8 / 4 = 2).'
    },
    {
      id: 'irc_deck_ledger_fastening',
      category: 'decks',
      title: 'Ledger Board Fastener Spacing',
      codeRef: 'IRC Table R507.9.1.3(1)',
      summary: 'Staggered bolt or lag screw spacing rules for securing deck ledgers to 2-inch nominal rim joists.',
      metricVal: '12.7 mm Lag Screws (Staggered)',
      imperialVal: '1/2" Lag Screws or Bolts (Staggered)',
      jobsiteNote: 'Fasteners must be placed 2" to 5" from the top/bottom ledger edges. Ledgers cannot be fastened over brick veneer, stucco, or EIFS exterior siding.'
    },
    {
      id: 'irc_deck_lateral_load',
      category: 'decks',
      title: 'Positive Lateral Load Connection',
      codeRef: 'IRC R507.9.2',
      summary: 'Mandatory mechanical hold-down tension hardware connecting the deck structure to interior floor framing to prevent pulling away from the house.',
      metricVal: '2 Devices @ 6.67 kN Each',
      imperialVal: '2 Devices @ 1500 lbs Each (or 4 @ 750 lbs)',
      jobsiteNote: 'Use approved tension tie hardware (like Simpson DTT1Z or DTT2Z) installed within 24 inches of each end of the deck, secured directly to interior floor joists.'
    },
    {
      id: 'irc_deck_post_sizing',
      category: 'decks',
      title: 'Minimum Wood Support Post Size',
      codeRef: 'IRC R507.4',
      summary: 'Prescriptive minimum structural column dimensions supporting drop beams.',
      metricVal: '140 mm x 140 mm Nominal (6x6)',
      imperialVal: '6x6 Nominal (5-1/2" x 5-1/2" Actual)',
      jobsiteNote: 'While 4x4 posts are sometimes allowed for low decks up to 6\'9" in height under strict conditions, 6x6 posts are the industry standard to allow proper notching for drop beams.'
    },
		{
      id: 'irc_deck_ledger_prohibition',
      category: 'decks',
      title: 'Prohibited Ledger Attachments',
      codeRef: 'IRC R507.9.1.1',
      summary: 'Exterior wall conditions where deck ledgers are strictly prohibited from supporting vertical deck loads.',
      metricVal: 'No Stone / Masonry Veneer / EIFS',
      imperialVal: 'No Stone / Masonry Veneer / EIFS',
      jobsiteNote: 'If the house has brick or stone veneer, the deck ledger cannot bear on or bolt through the veneer. Frame the deck as an independent, self-supporting structure using structural posts near the house wall.'
    },
    {
      id: 'irc_deck_ledger_flashing',
      category: 'decks',
      title: 'Ledger Weather Barrier Flashing',
      codeRef: 'IRC R507.9.1.4',
      summary: 'Mandatory corrosion-resistant flashing installed above the ledger board to prevent water infiltration into the building envelope.',
      metricVal: 'Approved Flashing Lapped Under WRB',
      imperialVal: 'Approved Flashing Lapped Under WRB',
      jobsiteNote: 'Flashing must extend up behind the house weather-resistive barrier (e.g., house wrap) and project outward over the exterior edge of the ledger board with a downward drip leg.'
    },
    {
      id: 'irc_deck_beam_splices',
      category: 'decks',
      title: 'Multi-Ply Beam Splice Location',
      codeRef: 'IRC R507.5.2',
      summary: 'Strict positioning rules for joining individual lumber plies together when constructing drop beams.',
      metricVal: 'Splices Must Bear Directly Over Posts',
      imperialVal: 'Splices Must Bear Directly Over Posts',
      jobsiteNote: 'Never splice drop beam members out in the middle of a span. All end joints in built-up beams must land directly over a 6x6 support post or column cap.'
    },
		{
      id: 'irc_stair_stringer_throat',
      category: 'stairs',
      title: 'Cut Stringer Solid Throat Depth',
      codeRef: 'IRC R311.7.5.1 / Figure R507.8.1',
      summary: 'Minimum solid uncut structural wood depth required across the narrowest diagonal section of a cut stair stringer.',
      metricVal: '127 mm Minimum Effective Throat',
      imperialVal: '5" Minimum Effective Throat',
      jobsiteNote: 'Notice the major US vs Canada difference: U.S. code requires a heavy 5-inch uncut throat depth on deck stairs (compared to Canada’s 3.5"). You MUST use 2x12 stringer stock for IRC compliance.'
    },
    {
      id: 'irc_stair_landing_size',
      category: 'stairs',
      title: 'Stair Landing Clear Dimensions',
      codeRef: 'IRC R311.7.6',
      summary: 'Minimum floor or deck platform space required at the top and bottom of each stair flight.',
      metricVal: '914 mm Run x Width of Stairway',
      imperialVal: '36" Run x Width of Stairway',
      jobsiteNote: 'Exterior deck stair bottom landings on grade must consist of a concrete pad, paved patio, or treated wood deck measuring at least 36" out from the bottom step.'
    },
    {
      id: 'irc_stair_lighting',
      category: 'stairs',
      title: 'Stairway Illumination Requirements',
      codeRef: 'IRC R311.7.9',
      summary: 'Required lighting levels and switch locations for residential stair flights.',
      metricVal: '11 Lux Min at Tread Centers',
      imperialVal: '1 Foot-Candle Min at Tread Centers',
      jobsiteNote: 'Stairs with 6 or more risers require a wall switch at both the top and bottom landings to control the light fixture.'
    },
		{
      id: 'irc_guard_post_blocking',
      category: 'decks',
      title: 'Guard Post Hold-Down Attachment',
      codeRef: 'IRC R507.10 / Figure R507.10',
      summary: 'Prescriptive structural blocking and tension hardware required for 4x4 guardrail posts attached to outer deck bands.',
      metricVal: 'Hold-Down Tension Tie Required',
      imperialVal: 'Hold-Down Tension Tie Required (1,800 lb rating)',
      jobsiteNote: 'Because US code mandates a 200 lb concentrated load resistance at the top rail, guardrail posts bolted to the outermost joist must be anchored with dedicated steel tension ties (e.g., DTT2Z) bolted back into adjacent floor joists.'
    },
    {
      id: 'irc_handrail_projection',
      category: 'stairs',
      title: 'Handrail Grip Clearance & Width',
      codeRef: 'IRC R311.7.8.2 / R311.7.8.3',
      summary: 'Allowable handrail projection into stair clear width and required finger clearance against walls.',
      metricVal: '38 mm Min Clearance to Wall',
      imperialVal: '1-1/2" Min Clearance to Wall',
      jobsiteNote: 'Handrail grips must be circular (1-1/4" to 2" diameter) or conform to Type II profile rules with recessed finger grooves so a falling person can maintain a secure grip.'
    },
		{
      id: 'irc_deck_footing_size',
      category: 'decks',
      title: 'Footing Base Area Sizing (Tributary Load)',
      codeRef: 'IRC Table R507.3.1',
      summary: 'Minimum diameter or square area of concrete footings based on the tributary area of deck carried by the support post and local soil bearing capacity.',
      metricVal: 'Sized per Tributary Area & 1,500 PSF Soil',
      imperialVal: 'Sized per Tributary Area & 1,500 PSF Soil',
      jobsiteNote: 'A standard 12" diameter pier is rarely enough for main drop beam posts carrying large decks. For a post supporting 60 sq ft of deck on typical 1,500 PSF clay soil, the code requires at least an 18" round footing pad.'
    },
    {
      id: 'irc_deck_joist_bearing_hangers',
      category: 'decks',
      title: 'Ledger Joist Hanger Uplift & Depth',
      codeRef: 'IRC R507.6.1',
      summary: 'Requirements for metal framing connectors attaching floor joists to exterior ledger boards or flush drop beams.',
      metricVal: 'Hanger Depth ≥ 60% of Joist Depth',
      imperialVal: 'Hanger Depth ≥ 60% of Joist Depth',
      jobsiteNote: 'Joist hangers must accommodate standard downwards shear loads AND wind uplift. You cannot use a 2x6 hanger on a 2x12 joist; the hanger must reach down at least 60% of the joist\'s vertical depth.'
    },

    // --- STAIRS & RAILINGS ---
    {
      id: 'irc_stair_stringer_attachment',
      category: 'stairs',
      title: 'Stair Stringer to Deck Attachment',
      codeRef: 'IRC R507.8 / Figure R507.8.1',
      summary: 'Approved mechanical connection methods for hanging exterior stair stringers from deck rim joists or drop beams.',
      metricVal: 'Sloped Stringer Hangers or Ledger Strap',
      imperialVal: 'Sloped Stringer Hangers or Ledger Strap',
      jobsiteNote: 'Toenailing stair stringers directly into the face of a deck rim joist is strictly prohibited. You must use adjustable sloped stringer hangers (e.g., LSCZ) or rest the stringer on a bolted 2x2 thrust ledger.'
    },
    {
      id: 'irc_guard_infill_load',
      category: 'decks',
      title: 'Guardrail Infill & Baluster Load Limit',
      codeRef: 'IRC Table R301.5',
      summary: 'Required horizontal resistance capacity applied to an area of 1 square foot on balusters, pickets, or infill panels.',
      metricVal: '0.22 kN Concentrated Load over 0.09 m²',
      imperialVal: '50 lbs Concentrated Load over 1 sq ft',
      jobsiteNote: 'While the top rail must hold 200 lbs, the individual vertical pickets or cable infill sections must withstand a 50 lb horizontal push applied across a 1-square-foot area without snapping or separating.'
    },
		{
      id: 'irc_roof_collar_ties',
      category: 'framing',
      title: 'Collar Tie Dimension & Location',
      codeRef: 'IRC R802.4.6',
      summary: 'Ties installed in the upper third of the roof to resist wind uplift and ridge separation.',
      metricVal: '1x4 Min @ 1219 mm OC Max',
      imperialVal: '1x4 Nominal Min @ 48" OC Max',
      jobsiteNote: 'Collar ties must be placed in the upper third of the attic space. They do NOT act as ceiling joists and do NOT prevent the exterior walls from bowing outward.'
    },
    {
      id: 'irc_roof_rafter_ties',
      category: 'framing',
      title: 'Rafter Ties (Wall Spreading Restraint)',
      codeRef: 'IRC R802.5.2',
      summary: 'Ties installed at the bottom of rafters (usually acting as ceiling joists) to prevent the roof weight from pushing the exterior walls outward.',
      metricVal: '2x4 Min @ 1219 mm OC Max',
      imperialVal: '2x4 Nominal Min @ 48" OC Max',
      jobsiteNote: 'Must be installed as close to the top plate as possible. The heel joint connection where the rafter meets the tie requires a very specific, high-capacity nail count per IRC Table R802.5.2.'
    },
    {
      id: 'irc_roof_venting',
      category: 'framing',
      title: 'Attic Cross-Ventilation Ratio',
      codeRef: 'IRC R806.2',
      summary: 'Required net free ventilating area for enclosed attics and rafter spaces.',
      metricVal: '1/150 of Area (Reducible to 1/300)',
      imperialVal: '1/150 of Area (Reducible to 1/300)',
      jobsiteNote: 'The baseline rule is 1/150. You can legally reduce it to 1/300 ONLY if you have a Class I or II vapor retarder on the warm-in-winter side, AND 40-50% of the venting is located at least 3 feet above the eaves (ridge vents).'
    },
    {
      id: 'irc_roof_birdsmouth',
      category: 'framing',
      title: 'Rafter Birdsmouth Notch Limit',
      codeRef: 'IRC R802.7.1.1',
      summary: 'Maximum allowable depth for the vertical heel cut of a birdsmouth notch at the wall top plate.',
      metricVal: 'Max 25% of Rafter Depth',
      imperialVal: 'Max 25% of Rafter Depth (1/4 D)',
      jobsiteNote: 'Over-cutting the birdsmouth severely weakens the rafter tail, leading to sagging eaves. The vertical heel cut must not exceed one-quarter of the rafter’s actual depth.'
    },
    {
      id: 'irc_roof_uplift',
      category: 'framing',
      title: 'Wind Uplift Anchorage',
      codeRef: 'IRC R802.11',
      summary: 'Requirement to tie the roof assembly continuously down to the foundation to resist wind uplift forces.',
      metricVal: 'Approved Connectors Required',
      imperialVal: 'Approved Connectors Required',
      jobsiteNote: 'Toe-nails are generally insufficient in high-wind regions. You must use engineered hurricane ties (e.g., Simpson H2.5A) connecting every rafter/truss directly to the wall top plates.'
    },
    {
      id: 'irc_roof_ridge_board',
      category: 'framing',
      title: 'Ridge Board Sizing',
      codeRef: 'IRC R802.3',
      summary: 'Minimum sizing for non-structural ridge boards in conventional framing.',
      metricVal: '1-inch Nominal Thick, Depth ≥ Rafter Cut',
      imperialVal: '1-inch Nominal Thick, Depth ≥ Rafter Cut',
      jobsiteNote: 'The ridge board is essentially a giant gusset plate; it is not a structural beam. Opposing rafters must align directly across from each other (offset no more than 1.5 inches).'
    },
		{
      id: 'irc_roof_drip_edge',
      category: 'framing',
      title: 'Mandatory Drip Edge Flashing',
      codeRef: 'IRC R905.2.8.5',
      summary: 'Required metal drip edge flashing installation at all eaves and gable ends for asphalt shingle roofs.',
      metricVal: '51 mm Roof Leg x 38 mm Fascia Leg',
      imperialVal: '2" Roof Leg x 1-1/2" Fascia Leg',
      jobsiteNote: 'Installation order is strictly enforced: At the eaves, drip edge goes directly on the wood deck *under* the underlayment. At the rakes (gables), drip edge goes *over* the underlayment.'
    },
    {
      id: 'irc_roof_ice_barrier',
      category: 'framing',
      title: 'Ice Barrier Extent (Ice & Water)',
      codeRef: 'IRC R905.1.2',
      summary: 'Required placement of self-adhering polymer modified bitumen (Ice & Water Shield) in areas with a history of ice forming along eaves.',
      metricVal: 'Extend 610 mm inside exterior wall line',
      imperialVal: 'Extend 24" inside exterior wall line',
      jobsiteNote: 'Notice the IRC difference from Canada: US code requires the membrane to reach a point at least 24 inches horizontally inside the exterior wall line (Canada requires 36 inches). Measure carefully on deep soffit overhangs.'
    },
    {
      id: 'irc_roof_notching',
      category: 'framing',
      title: 'Notching Solid Rafters',
      codeRef: 'IRC R802.7.1.2',
      summary: 'Maximum allowable depth for notches cut into the top or bottom of solid lumber roof rafters.',
      metricVal: 'Max Notch = 1/6 Rafter Depth',
      imperialVal: 'Max Notch = 1/6 Rafter Depth',
      jobsiteNote: 'Notches cannot exceed 1/6 of the rafter’s depth, and notches are strictly prohibited in the middle third of the rafter’s span. If you notch the middle of a rafter, it is structurally compromised.'
    },
    {
      id: 'irc_roof_cricket',
      category: 'framing',
      title: 'Chimney Crickets (Saddles)',
      codeRef: 'IRC R903.2.2',
      summary: 'Framed structural diverters installed on the high side of chimneys to shed water around the masonry.',
      metricVal: 'Required if Chimney Width > 762 mm',
      imperialVal: 'Required if Chimney Width > 30"',
      jobsiteNote: 'If a chimney or skylight curb is wider than 30 inches parallel to the ridge, a cricket/saddle must be framed and flashed on the uphill side to prevent severe debris and water trapping.'
    },
		{
      id: 'irc_roof_hip_valley_depth',
      category: 'framing',
      title: 'Hip & Valley Rafter Sizing',
      codeRef: 'IRC R802.3',
      summary: 'Sizing rules for diagonal ridge intersections in conventional stick-framed roofs.',
      metricVal: '51 mm Min Nominal Thick, 1 Size Larger Depth',
      imperialVal: '2" Nominal Thick, Depth ≥ Rafter Cut',
      jobsiteNote: 'The IRC explicitly mandates that hip and valley rafters must not be less in depth than the cut end of the intersecting rafter. In practice, if you are framing a roof with 2x8 common rafters, your valley rafter must be at least a 2x10.'
    },
    {
      id: 'irc_roof_purlin_sizing',
      category: 'framing',
      title: 'Purlins & Support Strut Sizing',
      codeRef: 'IRC R802.5.1',
      summary: 'Rules for mid-span purlins used to brace rafters and allow smaller rafter lumber sizing.',
      metricVal: 'Purlin Size ≥ Rafter Size, Struts ≥ 2x4 @ 45°',
      imperialVal: 'Purlin Size ≥ Rafter Size, Struts ≥ 2x4 @ 45°',
      jobsiteNote: 'Under IRC rules, the purlin board running horizontally under the rafters must be *at least the same dimensional lumber size as the rafters themselves* (e.g., 2x8 rafters require minimum 2x8 purlins). Struts cannot exceed 8 feet in unbraced length.'
    },
    {
      id: 'irc_roof_skylight_headers',
      category: 'framing',
      title: 'Skylight & Dormer Opening Headers',
      codeRef: 'IRC R802.9',
      summary: 'Mandatory structural doubling rules for header and trimmer rafters forming roof openings.',
      metricVal: 'Double Header & Trimmers if Opening > 1219 mm',
      imperialVal: 'Double Header & Trimmers if Opening > 4 ft',
      jobsiteNote: 'If a roof opening is greater than 4 feet wide, you must double both the trimmer rafters running up the slope and the header rafters running across the slope. Single headers are only permitted for openings less than 4 feet wide.'
    },
    {
      id: 'irc_roof_sheathing_fasteners',
      category: 'framing',
      title: 'Wood Structural Panel Roof Nail Schedule',
      codeRef: 'IRC Table R602.3(1)',
      summary: 'Required nail sizing and spacing schedule for securing plywood or OSB panels to roof rafters/trusses.',
      metricVal: '8d Common Nails @ 152 mm Edges / 305 mm Field',
      imperialVal: '8d Common Nails @ 6" Edges / 12" Field',
      jobsiteNote: 'Always use 8d common (2.5" x 0.131") or 8d deformed/ring-shank nails. In designated high-wind or hurricane zones (e.g., Florida or coastal exposure), edge nail spacing is frequently compressed by local code down to 4 inches on center.'
    },
		{
      id: 'irc_floor_joist_bearing',
      category: 'framing',
      title: 'Minimum Joist End Bearing Length',
      codeRef: 'IRC R502.6',
      summary: 'Required physical bearing contact length at the ends of wood floor joists.',
      metricVal: '38 mm Min on Wood/Steel / 76 mm on Masonry',
      imperialVal: '1-1/2" Min on Wood/Steel / 3" on Masonry',
      jobsiteNote: 'Where joists overlap across an interior bearing beam or partition wall, they must overlap each other by at least 3 inches (76 mm) and be securely nailed together with three 10d face nails.'
    },
    {
      id: 'irc_floor_joist_bridging',
      category: 'framing',
      title: 'Lateral Restraint & Bridging',
      codeRef: 'IRC R502.7.1',
      summary: 'Requirement for bridging or solid blocking along deep floor joists to prevent rotation.',
      metricVal: 'Required if Joists ≥ 2x12 (Max 2.4m OC)',
      imperialVal: 'Required if Joists ≥ 2x12 (Max 8 ft OC)',
      jobsiteNote: 'Notice the difference from Canadian codes: Under the U.S. IRC, mid-span bridging or blocking is only prescriptively mandatory for deep joists (2x12 nominal or larger) spaced at intervals up to 8 feet.'
    },
    {
      id: 'irc_floor_joist_notching',
      category: 'framing',
      title: 'Notching Solid Sawn Floor Joists',
      codeRef: 'IRC R502.8.1',
      summary: 'Allowable notch depth limits and strictly prohibited zones along solid wood floor joists.',
      metricVal: 'Max 1/6 Depth (Outer 1/3 Span Only)',
      imperialVal: 'Max 1/6 Depth (Outer 1/3 Span Only)',
      jobsiteNote: 'Strict U.S. rule: Notches cut into the top or bottom of joists CANNOT exceed 1/6 of the joist depth, and notches are STRICTLY FORBIDDEN in the middle third of the joist span. End notches at bearing points can be up to 1/4 depth.'
    },
    {
      id: 'irc_floor_joist_drilling',
      category: 'framing',
      title: 'Bored Holes in Solid Floor Joists',
      codeRef: 'IRC R502.8.1',
      summary: 'Allowable diameter and placement limits for holes bored through solid wood floor joists.',
      metricVal: 'Max Hole = 1/3 Joist Depth',
      imperialVal: 'Max Hole = 1/3 Joist Depth',
      jobsiteNote: 'Notice that U.S. code allows larger bored holes (up to 1/3 depth, approx. 3" hole in a 2x10) compared to Canada\'s 1/4 depth limit. Holes must be kept at least 2 inches away from the top or bottom joist edges.'
    },
    {
      id: 'irc_floor_subfloor_fastening',
      category: 'framing',
      title: 'Wood Structural Panel Subfloor Schedule',
      codeRef: 'IRC Table R602.3(1)',
      summary: 'Required nail sizing and spacing schedule for attaching OSB or plywood subfloor panels to floor joists.',
      metricVal: '8d Ring-Shank @ 152 mm Edges / 305 mm Field',
      imperialVal: '8d Ring-Shank @ 6" Edges / 12" Field',
      jobsiteNote: 'Always leave a 1/8-inch (3 mm) expansion gap between the square edges of adjacent OSB or plywood subfloor sheets to prevent edge swelling and floor buckling when ambient humidity changes.'
    },
    {
      id: 'irc_floor_cantilever',
      category: 'framing',
      title: 'Interior Joist Cantilever Limits',
      codeRef: 'IRC R502.3.3',
      summary: 'Maximum overhang limits for conventional floor joists supporting exterior walls or balconies above.',
      metricVal: 'Cantilever ≤ 1/4 Joist Backspan',
      imperialVal: 'Cantilever ≤ 1/4 Joist Backspan',
      jobsiteNote: 'If a second-floor joist cantilevers out past the first-floor wall to support a bay window or overhang, the interior backspan must be at least 4 times the length of the cantilever overhang.'
    },
		{
      id: 'irc_floor_bearing_partitions',
      category: 'framing',
      title: 'Joists Under Load-Bearing Partitions',
      codeRef: 'IRC R502.4',
      summary: 'Framing requirements beneath interior load-bearing walls that run parallel to the floor joists.',
      metricVal: 'Double Joists Required',
      imperialVal: 'Double Joists Required',
      jobsiteNote: 'Unlike non-loadbearing walls that just need blocking, a load-bearing wall running parallel to the floor system must sit directly on a double joist or a structural beam, sized to carry the load of the roof/floor above it.'
    },
    {
      id: 'irc_floor_sill_anchors',
      category: 'framing',
      title: 'Sill Plate Foundation Anchorage',
      codeRef: 'IRC R403.1.6',
      summary: 'Size and spacing limits for anchor bolts securing floor sill plates to concrete/masonry foundations.',
      metricVal: '12.7 mm Bolts @ 1829 mm OC Max',
      imperialVal: '1/2" Bolts @ 6 ft OC Max',
      jobsiteNote: 'Notice the major US vs Canada difference: U.S. code requires anchor bolts every 6 feet (72 inches), whereas Canadian code allows them up to 8 feet apart. Always place a bolt within 12 inches of a plate break.'
    },
    {
      id: 'irc_floor_openings',
      category: 'framing',
      title: 'Floor Opening Header Sizing',
      codeRef: 'IRC R502.10',
      summary: 'Header doubling requirements for framing stairwells, chimney chases, and drop-down attic stairs.',
      metricVal: 'Double Headers if Span > 1219 mm',
      imperialVal: 'Double Headers if Span > 4 ft',
      jobsiteNote: 'If the opening cuts through more than one standard joist spacing (spanning wider than 4 feet), the headers must be doubled. Tail joists exceeding 12 feet in length also require metal joist hangers.'
    },
    {
      id: 'irc_floor_engineered_cuts',
      category: 'framing',
      title: 'Alterations to Structural Composite Lumber',
      codeRef: 'IRC R502.8.2',
      summary: 'Strict prohibitions regarding jobsite alterations to LVL (Laminated Veneer Lumber), PSL, and I-joists.',
      metricVal: 'Manufacturer Approval Required',
      imperialVal: 'Manufacturer Approval Required',
      jobsiteNote: 'You cannot treat an LVL beam like a standard 2x10. Drilling a hole through an LVL for a plumbing pipe or electrical wire is strictly prohibited unless you have a stamped letter from the manufacturer’s engineering department authorizing that exact hole location.'
    },		   
    {
      id: 'irc_floor_cantilever_balcony',
      category: 'framing',
      title: 'Balcony Joist Backspan Ratio',
      codeRef: 'IRC R507.5 / R502.3.3',
      summary: 'Structural counter-weight rule for interior sawn lumber joists extending outward to form an exterior balcony.',
      metricVal: 'Backspan ≥ 2x Cantilever Length',
      imperialVal: 'Backspan ≥ 2x Cantilever Length',
      jobsiteNote: 'If you cantilever a balcony 3 feet outside the exterior wall, the joists must run continuously at least 6 feet inside the house. (Note: This is far more lenient than Canada’s strict 6:1 exterior balcony backspan rule).'
    },
    {
      id: 'irc_floor_joist_anchorage',
      category: 'framing',
      title: 'Joist to Sill Plate Anchorage',
      codeRef: 'IRC Table R602.3(1)',
      summary: 'Prescriptive nailing requirements for connecting floor joists to the treated foundation sill plate.',
      metricVal: 'Three 8d (64 mm) Toe-Nails',
      imperialVal: 'Three 8d (2-1/2") Toe-Nails',
      jobsiteNote: 'Drive two nails on one side of the joist and one nail on the opposite side. If using engineered I-joists, NEVER toe-nail through the OSB web; you must nail through the solid bottom flange only, or use approved metal joist clips.'
    },
		{
      id: 'irc_floor_treated_sill',
      category: 'framing',
      title: 'Protection of Wood Against Decay',
      codeRef: 'IRC R317.1',
      summary: 'Specific locations where naturally durable or pressure-preservative-treated wood is legally mandated.',
      metricVal: 'Sills on Concrete < 203 mm to Soil',
      imperialVal: 'Sills on Concrete < 8" to Soil',
      jobsiteNote: 'The IRC requires pressure-treated sill plates resting on concrete exterior walls AND mandates treated lumber if the wood framing is less than 8 inches from exposed earth (e.g., floor joists over a low crawlspace).'
    },
    {
      id: 'irc_floor_beam_pocket',
      category: 'framing',
      title: 'Clearance for Wood Beams in Masonry',
      codeRef: 'IRC R317.1 (Item 4)',
      summary: 'Moisture ventilation requirement for untreated structural wood beams embedded in masonry or concrete walls.',
      metricVal: '12.7 mm Clearance (Top, Sides, End)',
      imperialVal: '1/2" Clearance (Top, Sides, End)',
      jobsiteNote: 'If an untreated wood beam sits in a foundation pocket without this 1/2-inch air gap, the code considers it in "direct contact" with masonry and forces you to use pressure-treated lumber for the beam instead.'
    },
    {
      id: 'irc_floor_fireblocking',
      category: 'framing',
      title: 'Floor/Ceiling Assembly Fireblocking',
      codeRef: 'IRC R302.11',
      summary: 'Mandatory fire-stopping materials installed at the intersection of floor joists and wall cavities.',
      metricVal: 'Seal Floor-to-Wall Intersections',
      imperialVal: 'Seal Floor-to-Wall Intersections',
      jobsiteNote: 'Fireblocking is heavily inspected. You must seal the gaps where floor joist bays meet the exterior or interior walls. This is typically done by ensuring the rim joist or solid blocking completely seals the cavity so fire cannot jump from a wall up into the floor system.'
    },
    {
      id: 'irc_floor_draftstopping',
      category: 'framing',
      title: 'Draftstopping in Large Floor Cavities',
      codeRef: 'IRC R302.12',
      summary: 'Requirement to compartmentalize large open web floor trusses or suspended ceilings to restrict fire draft.',
      metricVal: 'Compartmentalize Areas > 92.9 m²',
      imperialVal: 'Compartmentalize Areas > 1000 sq ft',
      jobsiteNote: 'If you use open-web floor trusses (where fire can easily run side-to-side through the webs), the concealed floor space must be divided into areas no larger than 1,000 square feet using 1/2" drywall, 3/8" structural panels, or approved batt insulation.'
    },
		{
      id: 'irc_header_bearing',
      category: 'framing',
      title: 'Minimum Header End Bearing',
      codeRef: 'IRC R602.7.1',
      summary: 'Required contact length supporting the bottom ends of structural headers spanning wall openings.',
      metricVal: '38 mm Minimum (One Jack Stud)',
      imperialVal: '1-1/2" Minimum (One Jack Stud)',
      jobsiteNote: 'The IRC uses a specific table (Table R602.7(1)) to dictate the number of jack studs. Openings up to 5 feet usually need 1 jack stud. Openings from 5 to 10 feet almost always require 2 jack studs (3 inches of bearing) on each side.'
    },
    {
      id: 'irc_header_single_member',
      category: 'framing',
      title: 'Single Member Box Headers',
      codeRef: 'IRC R602.7.1',
      summary: 'Allowances for using a single 2x structural board as a header in an exterior wall to increase insulation cavity space.',
      metricVal: 'Approved with Continuous Top Plate & Ties',
      imperialVal: 'Approved with Continuous Top Plate & Ties',
      jobsiteNote: 'To meet strict energy codes, builders use a single 2x header pushed to the exterior face of the wall, allowing 4 inches of continuous rigid foam insulation behind it. The header must be tied to the top plate with specific metal clips to prevent twisting.'
    },
    {
      id: 'irc_header_nonbearing',
      category: 'framing',
      title: 'Non-Bearing Wall Headers',
      codeRef: 'IRC R602.7.2',
      summary: 'Header sizing for interior partitions carrying no structural floor, ceiling, or roof loads.',
      metricVal: 'Two 2x4s Flat (or One 2x4 up to 2.4m)',
      imperialVal: 'Two 2x4s Flat (or One 2x4 up to 8 ft)',
      jobsiteNote: 'U.S. code allows a single flat 2x4 for openings up to 8 feet in non-bearing walls, provided the top plate is continuous. However, doubling the flat 2x4s provides much better backing for heavy solid-core doors or casing trim.'
    },
    {
      id: 'irc_header_cripple_studs',
      category: 'framing',
      title: 'Cripple Stud Spacing Above Headers',
      codeRef: 'IRC R602.3',
      summary: 'Spacing requirements for short cripple studs transferring wall plate loads down to the header.',
      metricVal: 'Match Standard Wall Stud Spacing',
      imperialVal: 'Match Standard Wall Stud Spacing (16" or 24" OC)',
      jobsiteNote: 'Do not randomly space cripple studs over a window. They must remain precisely on the 16-inch or 24-inch layout center-lines established by the regular wall studs so that exterior structural sheathing edges land correctly.'
    },
		{
      id: 'irc_header_no_notching',
      category: 'framing',
      title: 'Prohibition of Header Alterations',
      codeRef: 'IRC R602.7',
      summary: 'Strict rule against cutting, notching, or boring holes through structural headers.',
      metricVal: 'Zero Notching or Drilling Permitted',
      imperialVal: 'Zero Notching or Drilling Permitted',
      jobsiteNote: 'You absolutely cannot drill a hole through a window or door header to run a plumbing pipe, electrical wire, or HVAC line. Doing so destroys the beam’s structural rating and guarantees a failed framing inspection.'
    },
    {
      id: 'irc_header_uplift_straps',
      category: 'framing',
      title: 'Header Wind Uplift Connections',
      codeRef: 'IRC Table R602.3(1) / R602.10.6',
      summary: 'Mandatory mechanical connections required in high-wind zones to prevent the roof from pulling the header off the jack studs.',
      metricVal: 'Engineered Uplift Straps/Clips Required',
      imperialVal: 'Engineered Uplift Straps/Clips Required',
      jobsiteNote: 'In hurricane-prone regions or high-wind zones, gravity bearing is not enough. The header must be strapped to the jack studs/king studs, and the top plate must be strapped to the header using rated galvanized connectors (e.g., Simpson H10 or CS16 straps).'
    },
    {
      id: 'irc_header_braced_walls',
      category: 'framing',
      title: 'Headers in Braced Wall Panels',
      codeRef: 'IRC R602.10.8',
      summary: 'Enhanced fastening and capacity requirements when a header acts as part of a lateral shear-wall bracing system.',
      metricVal: 'Continuous Sheathing or Strapping',
      imperialVal: 'Continuous Sheathing or Strapping',
      jobsiteNote: 'If a window is placed inside a designated "Braced Wall Panel" (shear wall), the header connection is heavily scrutinized. It often requires continuous OSB sheathing nailed densely across the header-to-king-stud joint to transfer shear forces.'
    },
		{
      id: 'irc_env_vapor_retarder',
      category: 'envelope',
      title: 'Interior Vapor Retarder Class',
      codeRef: 'IRC R702.7',
      summary: 'Required vapor retarder class installed on the interior side of framed walls based on climate zones.',
      metricVal: 'Class I or II (Climate Zones Marine 4, 5-8)',
      imperialVal: 'Class I or II (Climate Zones Marine 4, 5-8)',
      jobsiteNote: 'Notice the U.S. nuance: In hot/humid southern climates (Zones 1-3), interior vapor barriers are PROHIBITED because they trap AC-driven condensation. In cold northern climates (Zones 5-8), they are REQUIRED.'
    },
    {
      id: 'irc_env_wrb_overlap',
      category: 'envelope',
      title: 'Water-Resistive Barrier (Housewrap) Laps',
      codeRef: 'IRC R703.2',
      summary: 'Minimum overlapping rules for asphalt felt paper or synthetic housewrap installed over exterior sheathing.',
      metricVal: '51 mm Horizontal / 152 mm Vertical',
      imperialVal: '2" Horizontal / 6" Vertical',
      jobsiteNote: 'Unlike Canada\'s uniform 4" rule, the IRC specifically dictates a minimum 2-inch overlap on horizontal seams (upper shedding over lower) and a minimum 6-inch overlap on vertical seams.'
    },
    {
      id: 'irc_env_attic_baffles',
      category: 'envelope',
      title: 'Attic Insulation Baffle Clearance',
      codeRef: 'IRC R806.3',
      summary: 'Required air gap space between the top of attic insulation and the underside of the roof sheathing.',
      metricVal: '25.4 mm Minimum Clearance',
      imperialVal: '1" Minimum Clearance',
      jobsiteNote: 'Major US vs Canada difference: The U.S. code only requires a 1-inch minimum airspace baffle at the eaves, whereas Canadian codes mandate a much thicker 2-inch (50mm) gap.'
    },
    {
      id: 'irc_env_crawlspace_poly',
      category: 'envelope',
      title: 'Crawl Space Vapor Retarder',
      codeRef: 'IRC R408.3',
      summary: 'Requirement for covering exposed soil in unvented (conditioned) crawl spaces.',
      metricVal: '0.15 mm (6-mil) Polyethylene Minimum',
      imperialVal: '6-mil Polyethylene Minimum',
      jobsiteNote: 'In an unvented crawl space, you must cover 100% of the exposed dirt with 6-mil poly, overlap the seams by 6 inches, tape them, and run the poly at least 6 inches up the concrete foundation walls.'
    },
    {
      id: 'irc_env_foundation_dampproofing',
      category: 'envelope',
      title: 'Foundation Dampproofing Vertical Extent',
      codeRef: 'IRC R406.1',
      summary: 'Requirement for the vertical height of exterior foundation wall dampproofing.',
      metricVal: 'From Top of Footing to Finished Grade',
      imperialVal: 'From Top of Footing to Finished Grade',
      jobsiteNote: 'The coating (usually a 3/8-inch parging or a bituminous layer) must form a continuous seal starting directly on top of the footing and extending up to the exact line of the finished exterior backfill dirt.'
    },
		{
      id: 'irc_env_fenestration_pan',
      category: 'envelope',
      title: 'Window Rough Sill Pan Flashing End Dams',
      codeRef: 'IRC R703.4.1',
      summary: 'Mandatory detailing for self-adhering or rigid pan flashings at the bottom of window rough openings.',
      metricVal: 'Turn Up Sides Minimum 51 mm (End Dams)',
      imperialVal: 'Turn Up Sides Minimum 2" (End Dams)',
      jobsiteNote: 'A flat sill flashing strip allows wind-driven rainwater to run sideways off the ends of the opening and into the wall cavity. Sill pans must feature turned-up vertical sides (end dams) at least 2 inches high against the trimmer studs.'
    },
    {
      id: 'irc_env_spray_foam_ignition',
      category: 'envelope',
      title: 'Exposed Foam Plastic Thermal/Ignition Barrier',
      codeRef: 'IRC R316.4 / R316.5.3',
      summary: 'Fire protection rules for spray polyurethane foam (SPF) or rigid foam board left exposed inside crawl spaces or attics.',
      metricVal: 'Cover with 12.7 mm Drywall or Intumescent Coating',
      imperialVal: 'Cover with 1/2" Drywall or Intumescent Coating',
      jobsiteNote: 'You cannot leave raw yellow/white spray foam exposed inside an accessible attic or storage basement. It must be covered by a 15-minute thermal barrier (like 1/2" drywall) or coated with an approved code-compliant fire-retardant intumescent paint.'
    },
    {
      id: 'irc_env_masonry_weep_holes',
      category: 'envelope',
      title: 'Masonry Veneer Weep Holes & Drainage Cavity',
      codeRef: 'IRC R703.8.5 / R703.8.6',
      summary: 'Requirements for venting and draining the clear airspace behind brick or stone exterior siding.',
      metricVal: '25 mm Clear Airspace + Weep Holes @ 838 mm OC Max',
      imperialVal: '1" Clear Airspace + Weep Holes @ 33" OC Max',
      jobsiteNote: 'Brick is porous and absorbs rain. You must maintain a clean 1-inch air cavity behind the brick and install weep holes immediately above the foundation through-wall flashing so trapped bulk water can freely exit the wall assembly.'
    },
		{
      id: 'irc_ftg_frost_line',
      category: 'foundations',
      title: 'Frost Line Protection Depth',
      codeRef: 'IRC R403.1.4.1',
      summary: 'Required vertical depth of footings below the undisturbed ground surface or local frost line.',
      metricVal: 'Below Local Frost Line (Min 305 mm below grade)',
      imperialVal: 'Below Local Frost Line (Min 12" below grade)',
      jobsiteNote: 'Footings must extend below the frost line established by the local jurisdiction. In warm southern states where frost is non-existent, the absolute code minimum depth is 12 inches below undisturbed grade.'
    },
    {
      id: 'irc_ftg_strip_dimensions',
      category: 'foundations',
      title: 'Minimum Concrete Strip Footing Sizing',
      codeRef: 'IRC Table R403.1(1)',
      summary: 'Prescriptive thickness and width for continuous concrete footings supporting light-frame construction.',
      metricVal: '152 mm Min Thickness x 305 mm Min Width',
      imperialVal: '6" Min Thickness x 12" Min Width',
      jobsiteNote: 'Notice the major US vs Canada difference: The IRC enforces a strict 6-inch minimum vertical thickness for all residential footings (compared to Canada\'s 4-inch minimum). Width scales up to 15" or 18" based on stories and soil bearing capacity.'
    },
    {
      id: 'irc_ftg_projection_limits',
      category: 'foundations',
      title: 'Footing Projection Range',
      codeRef: 'IRC R403.1.1',
      summary: 'Allowable horizontal projection of the footing shelf extending past the foundation wall.',
      metricVal: '51 mm Min Projection / Max ≤ Footing Thickness',
      imperialVal: '2" Min Projection / Max ≤ Footing Thickness',
      jobsiteNote: 'The IRC dictates that footings must project at least 2 inches past the foundation wall on each side, but cannot project further than the vertical thickness of the footing.'
    },
    {
      id: 'irc_ftg_compressive_strength',
      category: 'foundations',
      title: 'Minimum Concrete Compressive Strength',
      codeRef: 'IRC Table R402.2',
      summary: 'Specified 28-day compressive strength (psi) required for foundation footings.',
      metricVal: '17.2 MPa Compressive Strength at 28 Days',
      imperialVal: '2,500 PSI Compressive Strength at 28 Days',
      jobsiteNote: 'Where footings are exposed to severe freeze-thaw cycles or deicing chemicals, local code upgrades the concrete requirement to 3,000 or 3,500 PSI with mandatory 5% to 7% air entrainment.'
    },
    {
      id: 'irc_ftg_stepped_slopes',
      category: 'foundations',
      title: 'Stepped Footings on Sloped Grade',
      codeRef: 'IRC R403.1.5',
      summary: 'Framing and pouring rules for foundations built on grades sloping steeper than 1 unit vertical in 10 units horizontal.',
      metricVal: 'Max Step Rise 457 mm (or Footing Thickness)',
      imperialVal: 'Max Step Rise 18" (or Footing Thickness)',
      jobsiteNote: 'When stepping footings down a slope under IRC rules, the vertical step height cannot exceed 18 inches (or the thickness of the footing, whichever is smaller), and horizontal step connections must overlap firmly.'
    },
    {
      id: 'irc_ftg_rebar_reinforcement',
      category: 'foundations',
      title: 'Continuous Horizontal Rebar Reinforcement',
      codeRef: 'IRC R403.1.3.1',
      summary: 'Requirement for continuous longitudinal reinforcing bars inside concrete footings located in seismic or expansive soil zones.',
      metricVal: 'Two #4 (12.7 mm) Bars Continuous',
      imperialVal: 'Two #4 (1/2") Bars Continuous',
      jobsiteNote: 'Even in standard non-seismic zones where rebar is technically optional by prescriptive IRC tables, best building practice mandates running at least two continuous #4 rebar rods suspended 3 inches off the dirt on chairs to prevent settlement cracking.'
    },
		{
      id: 'irc_ftg_slope_clearance',
      category: 'foundations',
      title: 'Clearance from Descending Slopes',
      codeRef: 'IRC R403.1.7.1',
      summary: 'Strict mathematical setback formula for footings placed near the edge of descending grades or hillsides.',
      metricVal: 'Setback = Height of Slope / 3',
      imperialVal: 'Setback = Height of Slope / 3',
      jobsiteNote: 'If you are building near a slope that drops 15 feet down, the bottom outer edge of your footing must be at least 5 feet horizontally away from the face of the slope (H/3). The maximum required setback distance is capped at 40 feet.'
    },
    {
      id: 'irc_ftg_ascending_slope',
      category: 'foundations',
      title: 'Clearance from Ascending Slopes',
      codeRef: 'IRC R403.1.7.2',
      summary: 'Required setback distance when cutting a foundation into the bottom of a hillside (ascending slope).',
      metricVal: 'Setback = Height of Slope / 2',
      imperialVal: 'Setback = Height of Slope / 2',
      jobsiteNote: 'If the hill rises 10 feet above your foundation wall, the house must be set back at least 5 feet from the toe of the hill (H/2) to allow for drainage and prevent mudslides from crushing the wall. Maximum required setback is 15 feet.'
    },
    {
      id: 'irc_ftg_trench_clearance',
      category: 'foundations',
      title: 'Footings Near Pipe Trenches',
      codeRef: 'IRC R403.1.8',
      summary: 'Load-bearing restrictions for footings crossing over or running parallel to underground utility trenches.',
      metricVal: 'Trench Must Fall Outside 45° Bearing Plane',
      imperialVal: 'Trench Must Fall Outside 45° Bearing Plane',
      jobsiteNote: 'If an underground sewer pipe is dug lower than the bottom of your footing, the footing must be kept horizontally far enough away so that the load transfers into solid undisturbed soil at a 45-degree angle, not into the soft gravel surrounding the pipe.'
    },
    {
      id: 'irc_ftg_deck_embedment',
      category: 'foundations',
      title: 'Deck Post Lateral Embedment vs. Bearing',
      codeRef: 'IRC R507.3',
      summary: 'Rules for attaching wood deck posts to concrete footings depending on whether they bear on top or are embedded.',
      metricVal: 'Embedment Prohibited w/o Decay Protection',
      imperialVal: 'Embedment Prohibited w/o Decay Protection',
      jobsiteNote: 'Burying a wood deck post directly into the concrete or dirt requires special structural foundation-grade treated lumber. Best practice (and easiest IRC compliance) is to pour the concrete pier slightly above ground level and mount the post on top using a rated steel standoff bracket (e.g., ABA44Z).'
    },
		{
      id: 'irc_ftg_rebar_cover',
      category: 'foundations',
      title: 'Concrete Cover for Reinforcement',
      codeRef: 'IRC R403.1.3.5.3',
      summary: 'Mandatory concrete cover depth protecting rebar from moisture corrosion when cast against the earth.',
      metricVal: '76 mm Minimum Cover',
      imperialVal: '3" Minimum Cover',
      jobsiteNote: 'Inspectors are brutal about this. If your rebar is sagging into the mud, you will fail. Use rated plastic or steel "dobies" (chairs) to hold the rebar strictly 3 inches off the dirt and 3 inches away from the trench side walls.'
    },
    {
      id: 'irc_ftg_monolithic_slab',
      category: 'foundations',
      title: 'Turned-Down Footings (Monolithic Slabs)',
      codeRef: 'IRC R403.1.3.2',
      summary: 'Rebar requirements for thickened edge slabs common in southern/warm climates.',
      metricVal: 'Min One #4 (12.7mm) Rebar Top & Bottom',
      imperialVal: 'Min One #4 (1/2") Rebar Top & Bottom',
      jobsiteNote: 'When pouring a slab and footing in one continuous monolithic pour, the thickened edge MUST contain at least one #4 rebar in the top third and one #4 rebar in the bottom third of the footing trench to resist bending forces.'
    },
    {
      id: 'irc_ftg_expansive_soils',
      category: 'foundations',
      title: 'Footings on Expansive Soils (Clay)',
      codeRef: 'IRC R403.1.8',
      summary: 'Trigger for engineered foundation design when digging in highly expansive or shrink-swell clay soils.',
      metricVal: 'Prescriptive Tables Voided (Engineering Required)',
      imperialVal: 'Prescriptive Tables Voided (Engineering Required)',
      jobsiteNote: 'If the local building department identifies the area as having expansive soils (common in Texas, Colorado, and parts of California), standard IRC footing tables are thrown out. The footing MUST be designed by a registered design professional, often requiring deep drilled piers or post-tensioned slabs.'
    },
		{
      id: 'irc_fnd_plain_vs_reinforced',
      category: 'foundations',
      title: 'Plain vs. Reinforced Concrete Walls',
      codeRef: 'IRC R404.1.3 / Table R404.1.2(8)',
      summary: 'Strict tables dictating when a poured concrete wall must transition from plain concrete to requiring structural vertical rebar.',
      metricVal: 'Rebar Required based on Soil Class & Wall Height',
      imperialVal: 'Rebar Required based on Soil Class & Wall Height',
      jobsiteNote: 'Unlike Canada where plain concrete walls are common for 8ft basements, the IRC frequently mandates vertical rebar (e.g., #4 bars at 48" OC) for 8-inch walls if backfill exceeds 5 or 6 feet, especially in poor soil classifications (Type ML, CL, MH).'
    },
    {
      id: 'irc_fnd_masonry_core_fill',
      category: 'foundations',
      title: 'Masonry Wall Vertical Reinforcement',
      codeRef: 'IRC R404.1.1 / Table R404.1.1(1)',
      summary: 'Requirements for inserting vertical rebar and solid grout into the hollow cores of CMU block walls.',
      metricVal: 'Grouted Cores w/ Rebar (Zone/Backfill Dependent)',
      imperialVal: 'Grouted Cores w/ Rebar (Zone/Backfill Dependent)',
      jobsiteNote: 'For a standard 8-inch block basement wall with 7 feet of backfill in a moderate seismic/wind zone, the IRC tables typically require a #4 vertical rebar grouted into a core every 48 inches on center.'
    },
    {
      id: 'irc_fnd_icf_rebar_placement',
      category: 'foundations',
      title: 'ICF Rebar Tension Face Placement',
      codeRef: 'IRC R404.1.3.3.7',
      summary: 'Strict positioning rules for vertical rebar inside the ICF core to maximize strength against soil pressure.',
      metricVal: 'Place in Interior Third of the Core (Tension Side)',
      imperialVal: 'Place in Interior Third of the Core (Tension Side)',
      jobsiteNote: 'Do not just drop vertical rebar down the exact center of the ICF block. Because the dirt pushes the wall inward, the inside face of the concrete stretches (tension). Vertical rebar must be secured in the inner one-third of the concrete core to resist this bending.'
    },
    {
      id: 'irc_fnd_anchor_bolts',
      category: 'foundations',
      title: 'Sill Plate Anchor Bolt Embedment',
      codeRef: 'IRC R403.1.6',
      summary: 'Depth requirements for steel anchor bolts set into the top of foundation walls.',
      metricVal: '178 mm Minimum Embedment',
      imperialVal: '7" Minimum Embedment',
      jobsiteNote: 'For poured concrete or grouted block, the 1/2" anchor bolts must stick deep enough into the wet concrete to achieve 7 inches of embedment. For ICF walls, they must be embedded deeply into the concrete core, not just sitting in the upper foam layer.'
    },
    {
      id: 'irc_fnd_backfill_brace',
      category: 'foundations',
      title: 'Wall Bracing Prior to Backfill',
      codeRef: 'IRC R404.1.7',
      summary: 'Requirement for structural restraint at the top and bottom of the wall before soil is pushed against it.',
      metricVal: 'Floor Framing and Slab Must Be Poured',
      imperialVal: 'Floor Framing and Slab Must Be Poured',
      jobsiteNote: 'The IRC explicitly states you cannot backfill a basement wall until BOTH the floor framing above is attached AND the basement concrete slab below is poured (or the bottom is otherwise temporarily braced). The slab locks the bottom of the wall from kicking inward.'
    },
		{
      id: 'irc_fnd_height_above_grade',
      category: 'foundations',
      title: 'Concrete/Masonry Height Above Grade',
      codeRef: 'IRC R404.1.6',
      summary: 'Minimum distance the top of the foundation wall must extend above the finished exterior dirt line before the wood framing begins.',
      metricVal: '102 mm Min (152 mm to wood siding)',
      imperialVal: '4" Min (6" to wood siding)',
      jobsiteNote: 'The top of the concrete or masonry foundation MUST extend at least 4 inches above the finished grading. Furthermore, the bottom edge of any wood exterior siding must be kept at least 6 inches above the dirt to prevent rot and termite bridging.'
    },
    {
      id: 'irc_fnd_icf_fire_barrier',
      category: 'foundations',
      title: 'ICF Interior Thermal/Fire Barrier',
      codeRef: 'IRC R316.4',
      summary: 'Mandatory fire protection covering for the exposed interior foam of an ICF foundation wall in habitable spaces.',
      metricVal: '12.7 mm Gypsum Board Required',
      imperialVal: '1/2" Gypsum Board Required',
      jobsiteNote: 'Even in an unfinished basement used only for storage, the interior exposed foam of an ICF wall is considered a severe fire hazard by the IRC. It must be completely covered by a 15-minute thermal barrier, typically 1/2" drywall screwed directly into the ICF web ties.'
    },
    {
      id: 'irc_fnd_opening_reinforcement',
      category: 'foundations',
      title: 'Rebar Around Openings (Poured & Block)',
      codeRef: 'IRC R404.1.3.3.6',
      summary: 'Prescriptive steel reinforcement schedule for windows and doors cut into concrete/masonry foundation walls.',
      metricVal: 'One 12.7 mm Bar (Within 305 mm of opening)',
      imperialVal: 'One #4 Bar (Within 12" of opening)',
      jobsiteNote: 'The IRC requires at least one #4 rebar placed vertically and horizontally on all sides of an opening. Crucially, these bars must extend a minimum of 24 inches past the corners of the opening to properly dissipate tension forces.'
    },
		{
      id: 'irc_wall_stud_drilling',
      category: 'framing',
      title: 'Drilling Load-Bearing Studs',
      codeRef: 'IRC R602.6',
      summary: 'Maximum allowable diameter for bored holes in structural exterior or bearing wall studs.',
      metricVal: 'Max Hole = 40% Stud Depth',
      imperialVal: 'Max Hole = 40% Stud Depth',
      jobsiteNote: 'Notice the IRC difference: US code allows a 40% hole in load-bearing studs (approx. 1-3/8" in a 2x4), which is slightly more generous than Canada’s strict 1/3 limit. *Exception: If you double the stud, you can drill up to 60%.*'
    },
    {
      id: 'irc_wall_stud_notching',
      category: 'framing',
      title: 'Notching Load-Bearing Studs',
      codeRef: 'IRC R602.6',
      summary: 'Maximum allowable depth for edge notches in structural wall studs.',
      metricVal: 'Max Notch = 25% Stud Depth',
      imperialVal: 'Max Notch = 25% Stud Depth',
      jobsiteNote: 'While you can drill a 40% hole, you can only cut a 25% notch in the edge of a bearing stud (7/8" max in a 2x4). Notching is structurally much more destructive than drilling a hole through the center.'
    },
    {
      id: 'irc_wall_top_plate_splice',
      category: 'framing',
      title: 'Double Top Plate Joint Overlap',
      codeRef: 'IRC R602.3.2',
      summary: 'Minimum horizontal separation required between splices in the upper and lower top plates.',
      metricVal: 'Offset Splices by Min 610 mm',
      imperialVal: 'Offset Splices by Min 24"',
      jobsiteNote: 'Major cross-border difference: While Canadian code requires splices to be separated by only one stud cavity (16"), the US IRC explicitly requires a full 24-inch minimum offset between top plate joints.'
    },
    {
      id: 'irc_wall_bracing',
      category: 'framing',
      title: 'Braced Wall Panel Fastening',
      codeRef: 'IRC Table R602.3(1)',
      summary: 'Required nailing schedule for structural wood sheathing on designated shear walls.',
      metricVal: '8d Nails @ 152 mm Edges / 305 mm Field',
      imperialVal: '8d Nails @ 6" Edges / 12" Field',
      jobsiteNote: 'In high-wind or seismic zones, structural shear walls (Braced Wall Panels) often require an upgraded, extremely tight nailing schedule dictated by the architect—frequently reducing edge nailing from 6 inches down to 4 inches or even 3 inches on center.'
    },
    {
      id: 'irc_wall_fireblocking_draft',
      category: 'framing',
      title: 'Fireblocking in Drop Ceilings & Soffits',
      codeRef: 'IRC R302.11',
      summary: 'Mandatory fire-stopping installed where vertical wall cavities connect to horizontal drop ceilings or architectural bulkheads.',
      metricVal: 'Seal Wall-to-Ceiling Cavity Connections',
      imperialVal: 'Seal Wall-to-Ceiling Cavity Connections',
      jobsiteNote: 'If you frame a decorative dropped soffit above kitchen cabinets, the wall cavity behind it cannot be open to the soffit void. You must install solid wood fireblocking at the ceiling line so fire inside the wall cannot vent out into the drop ceiling.'
    },
    {
      id: 'irc_wall_cripple_studs',
      category: 'framing',
      title: 'Cripple Wall Height & Sheathing',
      codeRef: 'IRC R602.9',
      summary: 'Requirements for short foundation cripple walls supporting the main floor above.',
      metricVal: 'Solid Sheathe if Height < 356 mm',
      imperialVal: 'Solid Sheathe if Height < 14"',
      jobsiteNote: 'If you frame a very short cripple wall (less than 14 inches tall) on top of the foundation to raise the house, standard stud framing is unstable. The code requires these short walls to be continuously sheathed with OSB/plywood on at least one side to prevent shear collapse.'
    },
		{
      id: 'irc_wall_top_plate_strap',
      category: 'framing',
      title: 'Top Plate Cut/Notch Tension Tie',
      codeRef: 'IRC R602.6.1',
      summary: 'Strict specification for the metal strap required when a top plate is cut more than 50% by plumbing or HVAC.',
      metricVal: '1.37 mm Thick x 38 mm Wide Galvanized Strap',
      imperialVal: '16-Gauge Thick x 1-1/2" Wide Galvanized Strap',
      jobsiteNote: 'The IRC is extremely specific here: The strap must be 16-gauge steel, at least 1.5 inches wide, and fastened with a minimum of EIGHT 10d (16d in some zones) nails on each side of the cut. Flimsy duct strap will fail inspection.'
    },
    {
      id: 'irc_wall_drilling_nonbearing',
      category: 'framing',
      title: 'Drilling Non-Bearing Interior Studs',
      codeRef: 'IRC R602.6',
      summary: 'Expanded boring limits for interior partition walls that carry no structural load.',
      metricVal: 'Max Hole = 60% of Stud Depth',
      imperialVal: 'Max Hole = 60% of Stud Depth',
      jobsiteNote: 'Plumbers love this code: In a strictly non-bearing interior wall, you can drill a hole up to 60% of the stud depth (approx. 2-1/8" in a 2x4), provided the edge of the hole remains at least 5/8" away from the edge of the stud. (If you drill 60%, you can also NOT double the stud).'
    },
    {
      id: 'irc_wall_bottom_plate_anchor',
      category: 'framing',
      title: 'Bottom Plate Concrete Anchorage',
      codeRef: 'IRC R403.1.6',
      summary: 'Specific anchor bolt placement for treated wood bottom plates fastened to concrete slabs-on-grade.',
      metricVal: 'Bolts ≤ 305 mm from Plate Ends',
      imperialVal: 'Bolts ≤ 12" from Plate Ends',
      jobsiteNote: 'Beyond the general 6-foot spacing rule, the IRC strictly mandates that every individual segment of bottom plate (even a 2-foot piece next to a door) must have at least two anchor bolts, and they must be placed no more than 12 inches from the ends of the plate.'
    },
    {
      id: 'irc_wall_shear_hold_downs',
      category: 'framing',
      title: 'Shear Wall Hold-Down Tension Ties',
      codeRef: 'IRC R602.10.6.2',
      summary: 'Requirements for heavy-duty metal tension brackets at the extreme ends of designated Braced Wall Panels.',
      metricVal: 'Engineered Hold-Down into Foundation',
      imperialVal: 'Engineered Hold-Down into Foundation',
      jobsiteNote: 'In high-wind or seismic zones, sheer weight isn\'t enough to keep a house from overturning. The extreme ends of exterior shear walls must have massive steel brackets (like a Simpson HDU) bolted to the studs and dropped over an anchor bolt embedded deep in the concrete foundation.'
    },
		{
      id: 'irc_win_eero_size',
      category: 'windows_doors',
      title: 'EERO (Egress Window) Minimum Area',
      codeRef: 'IRC R310.2.1',
      summary: 'Emergency Escape and Rescue Opening sizing for bedrooms and habitable basements.',
      metricVal: '0.53 m² Area (0.46 m² at Grade Floor)',
      imperialVal: '5.7 sq ft Area (5.0 sq ft at Grade Floor)',
      jobsiteNote: 'MAJOR CROSS-BORDER DIFFERENCE: The U.S. code requires a massive 5.7 sq ft egress window (compared to Canada\'s 3.8 sq ft). This accommodates a fully equipped firefighter with an air tank. A 5.0 sq ft opening is only allowed if the window is on the ground floor.'
    },
    {
      id: 'irc_win_eero_dimensions',
      category: 'windows_doors',
      title: 'EERO Minimum Width, Height & Sill',
      codeRef: 'IRC R310.2.2 / R310.2.3',
      summary: 'Strict dimensional geometry limits for emergency escape windows.',
      metricVal: 'Min 610mm H x 508mm W / Max Sill 1118mm',
      imperialVal: 'Min 24" High x 20" Wide / Max Sill 44"',
      jobsiteNote: 'The clear opening must be at least 24 inches high AND 20 inches wide. Furthermore, the bottom of the clear opening (sill height) CANNOT be more than 44 inches off the finished indoor floor, ensuring children and elderly can climb out.'
    },
    {
      id: 'irc_win_eero_well',
      category: 'windows_doors',
      title: 'Egress Window Well Dimensions & Ladders',
      codeRef: 'IRC R310.4',
      summary: 'Clearance and ladder requirements for emergency escape window wells.',
      metricVal: '0.84 m² Area / Ladder if Depth > 1118 mm',
      imperialVal: '9.0 sq ft Area / Ladder if Depth > 44"',
      jobsiteNote: 'U.S. window wells must be much larger than Canadian ones—providing a minimum 9.0 sq ft of clear area with a minimum 36" horizontal projection. If the well is deeper than 44 inches, a permanently affixed ladder or steps must be installed.'
    },
    {
      id: 'irc_door_egress_width',
      category: 'windows_doors',
      title: 'Required Egress Door Sizing',
      codeRef: 'IRC R311.2',
      summary: 'Minimum sizing for the required primary egress door of the home.',
      metricVal: '813 mm Clear Width x 1981 mm Height',
      imperialVal: '32" Clear Width x 78" Height',
      jobsiteNote: 'The code demands a 32-inch *clear* opening. Because the thickness of the door itself takes up space when swung open 90 degrees, you physically must use a 36-inch wide door slab to achieve the legal 32-inch clear opening width.'
    },
    {
      id: 'irc_win_fall_protection',
      category: 'windows_doors',
      title: 'Window Fall Protection Limits',
      codeRef: 'IRC R312.2.1',
      summary: 'Requirements to prevent falls from windows high above the exterior grade.',
      metricVal: 'Protect if Sill < 610 mm & Drop > 1829 mm',
      imperialVal: 'Protect if Sill < 24" & Drop > 72"',
      jobsiteNote: 'Notice the IRC uses a 24-inch interior sill height trigger (Canada uses 36 inches). If a second-story window is closer than 24 inches to the interior floor, it must have a Window Opening Control Device (WOCD) limiting it to a 4-inch opening.'
    },
    {
      id: 'irc_win_safety_glass_floor',
      category: 'windows_doors',
      title: 'Safety Glazing Near Floors',
      codeRef: 'IRC R308.4.3',
      summary: 'Tempered glass requirements for large windows situated close to the interior walking surface.',
      metricVal: 'Required if Pane > 0.84 m² & Sill < 457 mm',
      imperialVal: 'Required if Pane > 9 sq ft & Sill < 18"',
      jobsiteNote: 'A major IRC hazard code: If a single pane of glass is larger than 9 sq ft, AND the top edge is higher than 36", AND the bottom edge is lower than 18" from the floor, it must be tempered safety glass.'
    },
		{
      id: 'irc_door_garage_fire_rating',
      category: 'windows_doors',
      title: 'Garage-to-House Door Fire Rating',
      codeRef: 'IRC R302.5.1',
      summary: 'Strict material and placement requirements for the man-door separating an attached garage from the living space.',
      metricVal: '35 mm Solid Wood or 20-Min Fire Rated',
      imperialVal: '1-3/8" Solid Wood or 20-Min Fire Rated',
      jobsiteNote: 'Three massive rules here: 1) The door MUST have a self-closing hinge. 2) It must be a minimum 1-3/8" thick solid wood door, solid steel, or carry a 20-minute fire label. 3) It CANNOT open directly into a room used for sleeping purposes (bedroom).'
    },
    {
      id: 'irc_win_stair_hazard',
      category: 'windows_doors',
      title: 'Safety Glazing at Stairs and Landings',
      codeRef: 'IRC R308.4.6 / R308.4.7',
      summary: 'Tempered glass requirements for windows located near the bottom of a stairwell.',
      metricVal: 'Required if within 1524 mm of Bottom Tread',
      imperialVal: 'Required if within 60" of Bottom Tread',
      jobsiteNote: 'The IRC rule for stairs is heavily enforced: If a window is within 60 inches horizontally of the bottom tread of a staircase AND the bottom edge of the glass is less than 36 inches above the landing floor, it must be tempered safety glass.'
    },
    {
      id: 'irc_door_threshold_egress',
      category: 'windows_doors',
      title: 'Egress Door Landing Threshold Height',
      codeRef: 'IRC R311.3.1',
      summary: 'Maximum vertical step-over height at the primary emergency exit door to prevent tripping.',
      metricVal: 'Max 38 mm from Landing to Threshold',
      imperialVal: 'Max 1.5" from Landing to Threshold',
      jobsiteNote: 'At the required main egress door, the exterior landing or deck cannot be more than 1.5 inches lower than the top of the door threshold. (Exception: If the door swings inward, the landing can drop up to 7-3/4 inches, but no more).'
    },
		{
      id: 'irc_fin_kickout_flashing',
      category: 'finishes',
      title: 'Kick-Out Flashing (Sidewall Flashing)',
      codeRef: 'IRC R905.2.8.3',
      summary: 'Required flashing detail where the bottom edge of a sloped roof terminates against a vertical wall.',
      metricVal: 'Must Direct Water Away From Wall (Min 102mm x 102mm)',
      imperialVal: 'Must Direct Water Away From Wall (Min 4" x 4")',
      jobsiteNote: 'A massive inspection fail point: The bottom piece of step flashing cannot just end blindly behind the siding. It must be physically bent outward (kicked out) to forcibly divert roof runoff away from the wall cavity and directly into the gutter.'
    },
    {
      id: 'irc_fin_wood_siding_grade',
      category: 'finishes',
      title: 'Wood Siding Clearance to Earth',
      codeRef: 'IRC R404.1.6 / R703.1',
      summary: 'Minimum vertical clearance from the ground to the bottom edge of wood-based exterior siding.',
      metricVal: '152 mm Minimum Clearance',
      imperialVal: '6" Minimum Clearance',
      jobsiteNote: 'Notice the US/Canada difference: The IRC requires a minimum 6-inch clearance from grade for wood siding (whereas Canadian codes require 8 inches). If building over a hard surface like a concrete patio, the clearance drops to 2 inches.'
    },
    {
      id: 'irc_fin_masonry_weep_spacing',
      category: 'finishes',
      title: 'Masonry Veneer Weephole Spacing',
      codeRef: 'IRC R703.8.6',
      summary: 'Maximum horizontal distance between drainage weepholes in the bottom course of brick/stone veneer.',
      metricVal: '838 mm Maximum Spacing / 5 mm Min Diameter',
      imperialVal: '33" Maximum Spacing / 3/16" Min Diameter',
      jobsiteNote: 'Weepholes must be placed at a maximum of 33 inches on center (which conveniently aligns with every 4th standard brick). They must sit immediately on top of the through-wall flashing.'
    },
    {
      id: 'irc_fin_shingle_high_wind',
      category: 'finishes',
      title: 'High-Wind Asphalt Shingle Nailing',
      codeRef: 'IRC R905.2.6',
      summary: 'Upgraded fastening requirement for asphalt shingles installed in designated high-wind zones (110 mph or greater).',
      metricVal: 'Minimum 6 Fasteners per Shingle',
      imperialVal: 'Minimum 6 Fasteners per Shingle',
      jobsiteNote: 'In standard zones, 4 nails per shingle is the IRC minimum. However, in hurricane-prone coastal regions or special wind zones exceeding 110 mph (177 km/h), roofers must upgrade to 6 nails per shingle, placed precisely according to the manufacturer\'s high-wind strike line.'
    },
    {
      id: 'irc_fin_stucco_weep_screed',
      category: 'finishes',
      title: 'Stucco Foundation Weep Screed',
      codeRef: 'IRC R703.7.2.1',
      summary: 'Required metal drainage track installed at the bottom edge of exterior plaster (stucco) walls.',
      metricVal: 'Required at Foundation Plate Line (Min 102mm above earth)',
      imperialVal: 'Required at Foundation Plate Line (Min 4" above earth)',
      jobsiteNote: 'You cannot run stucco straight down the foundation wall. A galvanized or plastic weep screed must be installed at or below the foundation plate line, keeping the stucco at least 4 inches above bare earth (or 2 inches above paved surfaces) to allow trapped wall moisture to escape.'
    },
		{
      id: 'irc_fin_ice_barrier',
      category: 'finishes',
      title: 'Ice Barrier Underlayment Extent',
      codeRef: 'IRC R905.2.7.1',
      summary: 'Required upper termination point for self-adhering polymer modified bitumen (Ice Barrier) at the eaves.',
      metricVal: 'Extend Minimum 610 mm Inside Exterior Wall Line',
      imperialVal: 'Extend Minimum 24" Inside Exterior Wall Line',
      jobsiteNote: 'U.S. code specifies that the ice barrier must extend up the roof until it passes 24 inches *horizontally* inside the heated exterior wall. If you have a massive 3-foot overhang, you may need to install two full courses (6 feet) of membrane to meet this legal requirement.'
    },
    {
      id: 'irc_fin_drip_edge',
      category: 'finishes',
      title: 'Mandatory Drip Edge & Layering',
      codeRef: 'IRC R905.2.8.5',
      summary: 'Requirement for metal drip edge on all asphalt shingle roofs and the specific under/over overlapping rules.',
      metricVal: 'Underlayment OVER Eave Drip, UNDER Rake Drip',
      imperialVal: 'Underlayment OVER Eave Drip, UNDER Rake Drip',
      jobsiteNote: 'Drip edge is strictly mandatory on all eaves and gables (rakes). The layering order is an instant fail if done backward: At the bottom eave, the felt paper goes OVER the metal drip edge. At the sloped rake/gable sides, the felt paper goes UNDER the metal drip edge.'
    },
    {
      id: 'irc_fin_masonry_clearance',
      category: 'finishes',
      title: 'Masonry Veneer Clearance to Earth',
      codeRef: 'IRC R703.8.4',
      summary: 'Minimum required vertical clearance between the bottom course of brick/stone veneer and the finished grade.',
      metricVal: '102 mm to Earth / 51 mm to Hardscape',
      imperialVal: '4" to Earth / 2" to Paved Hardscape',
      jobsiteNote: 'You cannot bury the bottom course of a brick veneer wall in mulch or dirt. The foundation must remain exposed for at least 4 inches below the brick (to protect the weep holes). If abutting a concrete driveway or patio, a 2-inch clearance is acceptable.'
    },
		{
      id: 'irc_fin_reroof_layers',
      category: 'finishes',
      title: 'Maximum Allowable Re-Roofing Layers',
      codeRef: 'IRC R908.3.1',
      summary: 'Strict limit on how many layers of asphalt shingles can exist on a roof structure before a complete tear-off is legally mandated.',
      metricVal: 'Maximum 2 Layers Total',
      imperialVal: 'Maximum 2 Layers Total',
      jobsiteNote: 'You cannot install a third layer of asphalt shingles over two existing layers. The massive structural dead load risks roof collapse under snow, and the trapped heat bakes the new shingles. If two layers exist, you MUST perform a full tear-off down to the bare wood sheathing.'
    },
    {
      id: 'irc_fin_roof_nail_depth',
      category: 'finishes',
      title: 'Shingle Nail Penetration Depth',
      codeRef: 'IRC R905.2.5',
      summary: 'Required depth roofing fasteners must bite into solid wood decks under U.S. baseline code.',
      metricVal: 'Penetrate Fully Through OR 19 mm into Wood',
      imperialVal: 'Penetrate Fully Through OR 3/4" into Wood',
      jobsiteNote: 'Notice the major cross-border difference: The IRC enforces a strict 3/4-inch wood penetration requirement for thick plank decks (compared to Canada\'s 1/2-inch rule). On standard OSB or plywood, nails must still penetrate entirely through the deck.'
    },
    {
      id: 'irc_fin_wall_penetrations',
      category: 'finishes',
      title: 'Exterior Wall Penetration Flashing & Boots',
      codeRef: 'IRC R703.1.1',
      summary: 'Mandatory moisture sealing around pipes, electrical boxes, and HVAC vents penetrating the exterior weather-resistive barrier.',
      metricVal: 'Self-Adhering Flashing or Rubber Boot Required',
      imperialVal: 'Self-Adhering Flashing or Rubber Boot Required',
      jobsiteNote: 'You cannot just caulk around an exterior hose bib or dryer vent block where it meets the siding. The penetration through the housewrap must be integrated using a flexible self-adhering flashing membrane or a prefabricated EPDM rubber boot integrated shingle-style into the WRB.'
    },
		{
      id: 'irc_fire_smoke_locations',
      category: 'fire_safety',
      title: 'Smoke Alarm Placement',
      codeRef: 'IRC R314.3',
      summary: 'Mandatory smoke alarm placement for new construction and significant remodeling.',
      metricVal: 'Inside Bedrooms + Outside Sleeping Areas + Every Story',
      imperialVal: 'Inside Bedrooms + Outside Sleeping Areas + Every Story',
      jobsiteNote: 'The IRC specifically notes that habitable attics count as a story. Also, for split-level homes without doors between levels, an alarm on the upper level counts for the lower level IF the lower level is less than one full story down.'
    },
    {
      id: 'irc_fire_smoke_kitchen_clearance',
      category: 'fire_safety',
      title: 'Nuisance Clearance from Cooking Appliances',
      codeRef: 'IRC R314.3.1',
      summary: 'Minimum horizontal distance required between a smoke alarm and a permanent kitchen stove/oven.',
      metricVal: '6096 mm (Ionization) or 1828 mm (Photoelectric)',
      imperialVal: '20 ft (Ionization) or 6 ft (Photoelectric)',
      jobsiteNote: 'This is a huge inspection failure point. You cannot place a cheap Ionization smoke alarm near a kitchen—it must be at least 20 feet away. If you must place an alarm closer (e.g., in a small apartment), you MUST buy a Photoelectric alarm, which can be placed up to 6 feet away from the stove.'
    },
    {
      id: 'irc_fire_smoke_bath_clearance',
      category: 'fire_safety',
      title: 'Nuisance Clearance from Bathrooms',
      codeRef: 'IRC R314.3',
      summary: 'Minimum horizontal distance required from a bathroom door to prevent steam from triggering the alarm.',
      metricVal: '914 mm Minimum Horizontally',
      imperialVal: '3 ft Minimum Horizontally',
      jobsiteNote: 'A smoke alarm cannot be installed closer than 3 feet horizontally from the door of a bathroom containing a bathtub or shower. Steam rolling out of an open bathroom door will instantly trigger false alarms.'
    },
    {
      id: 'irc_fire_co_bedroom',
      category: 'fire_safety',
      title: 'CO Alarms INSIDE Bedrooms',
      codeRef: 'IRC R315.3',
      summary: 'Specific IRC rule requiring Carbon Monoxide alarms to be placed directly inside a sleeping room.',
      metricVal: 'Required if Fuel Appliance in Room/Attached Bath',
      imperialVal: 'Required if Fuel Appliance in Room/Attached Bath',
      jobsiteNote: 'While CO alarms are normally only required OUTSIDE the bedrooms, if a homeowner installs a gas fireplace directly inside their master bedroom or inside the master ensuite bathroom, a CO alarm MUST be installed directly inside that specific bedroom.'
    },
    {
      id: 'irc_fire_wireless_interconnect',
      category: 'fire_safety',
      title: 'Wireless Alarm Interconnection',
      codeRef: 'IRC R314.4',
      summary: 'Exceptions allowing wireless radio-frequency interconnection instead of hardwired 3-wire romex.',
      metricVal: 'Listed Wireless Permitted',
      imperialVal: 'Listed Wireless Permitted',
      jobsiteNote: 'In new construction, hardwiring is mandatory. However, the IRC explicitly allows the use of UL-listed wirelessly interconnected alarms (where the activation of one triggers all others via radio signal) during alterations/repairs where running a new hardwire would require tearing open drywall.'
    },
		{
      id: 'irc_fire_garage_wall',
      category: 'fire_safety',
      title: 'Garage-to-House Wall Separation',
      codeRef: 'IRC Table R302.6',
      summary: 'Mandatory drywall thickness applied to the garage side of the wall separating it from the main residence.',
      metricVal: 'Minimum 12.7 mm Gypsum Board',
      imperialVal: 'Minimum 1/2" Gypsum Board',
      jobsiteNote: 'Unlike Canada where it\'s primarily treated as a fume barrier, the IRC explicitly requires at least 1/2" drywall applied to the garage side of the shared wall to create a fire separation. If the garage is detached but less than 3 feet from the house, this rule still applies to the interior side of the garage walls.'
    },
    {
      id: 'irc_fire_garage_ceiling',
      category: 'fire_safety',
      title: 'Habitable Rooms ABOVE a Garage',
      codeRef: 'IRC Table R302.6',
      summary: 'Upgraded fire separation requirement when a bedroom or living space is built directly on top of an attached garage.',
      metricVal: 'Minimum 15.9 mm Type X Gypsum Board',
      imperialVal: 'Minimum 5/8" Type X Gypsum Board',
      jobsiteNote: 'If you have a bonus room or bedroom above the garage, 1/2" drywall on the garage ceiling is illegal. You MUST install 5/8" Type X fire-rated drywall on the garage ceiling to protect the floor joists and the occupants sleeping above from a vehicle fire.'
    },
    {
      id: 'irc_fire_under_stair',
      category: 'fire_safety',
      title: 'Fire Protection of Under-Stair Storage',
      codeRef: 'IRC R302.7',
      summary: 'Drywall requirement for the enclosed space beneath a set of stairs if it is accessed by a door for storage.',
      metricVal: 'Enclose with 12.7 mm Gypsum Board',
      imperialVal: 'Enclose with 1/2" Gypsum Board',
      jobsiteNote: 'If you frame a closet under the basement stairs to store boxes, the entire interior of that closet (walls and the sloped underside of the stairs) must be drywalled with 1/2" gypsum. A fire starting in that storage closet would otherwise instantly burn through the stairs, destroying the home\'s escape route.'
    },
    {
      id: 'irc_fire_dead_air',
      category: 'fire_safety',
      title: 'Smoke Alarm Wall/Ceiling Mounting Rules',
      codeRef: 'IRC R314 / NFPA 72',
      summary: 'Distance requirements to avoid "dead air" pockets when mounting smoke alarms.',
      metricVal: 'Ceiling: Min 102mm from wall. Wall: 102mm - 305mm from ceiling.',
      imperialVal: 'Ceiling: Min 4" from wall. Wall: 4" to 12" from ceiling.',
      jobsiteNote: 'The IRC references NFPA 72 for placement: If mounting an alarm on the ceiling, keep it at least 4 inches away from any wall. If mounting it on a wall, the top of the alarm must be between 4 and 12 inches down from the ceiling. Never put it right in the sharp corner.'
    },
		{
      id: 'irc_fire_residential_sprinkler',
      category: 'fire_safety',
      title: 'Mandatory Residential Fire Sprinklers',
      codeRef: 'IRC R313.2',
      summary: 'Baseline U.S. requirement for automatic fire sprinklers in all new single-family residential construction.',
      metricVal: 'Automatic Sprinkler System Required',
      imperialVal: 'Automatic Sprinkler System Required',
      jobsiteNote: 'This is the most fiercely debated rule in the IRC. The baseline code demands full fire sprinklers in all new one-and-two-family homes. However, because it is so expensive, many states and local municipalities explicitly strike this section from their local adoptions. Always verify with your local AHJ.'
    },
    {
      id: 'irc_fire_draftstopping',
      category: 'fire_safety',
      title: 'Draftstopping in Floor/Ceiling Assemblies',
      codeRef: 'IRC R302.12',
      summary: 'Requirement to divide large concealed horizontal floor cavities to prevent rapid lateral fire spread.',
      metricVal: 'Required if Space Exceeds 92.9 m²',
      imperialVal: 'Required if Space Exceeds 1,000 sq ft',
      jobsiteNote: 'If a house has open-web floor trusses that create a massive hollow cavity between the basement and the first floor, the cavity must be divided (draft-stopped) using 1/2" drywall or 3/8" wood panels so no single continuous open section exceeds 1,000 square feet.'
    },
    {
      id: 'irc_fire_chimney_clearance',
      category: 'fire_safety',
      title: 'Masonry Chimney Clearance (Interior vs Exterior)',
      codeRef: 'IRC R1003.18',
      summary: 'Airspace required between a masonry chimney and combustible materials based on the chimney\'s location.',
      metricVal: '51 mm Interior / 25 mm Exterior',
      imperialVal: '2" Interior / 1" Exterior',
      jobsiteNote: 'The IRC allows a slight reduction compared to Canadian codes: If the masonry chimney is completely inside the footprint of the house, you must maintain a 2-inch gap from all wood framing. If the chimney is built on the exterior wall, the gap can be reduced to 1 inch.'
    },
		{
      id: 'irc_hvac_dryer_length',
      category: 'hvac',
      title: 'Maximum Dryer Exhaust Duct Length',
      codeRef: 'IRC M1502.4.6',
      summary: 'Absolute maximum allowable length of a dryer vent run from the wall connection to the exterior hood.',
      metricVal: '10.6 Meters Maximum (Reduced by Fittings)',
      imperialVal: '35 Feet Maximum (Reduced by Fittings)',
      jobsiteNote: 'The baseline limit is 35 feet, BUT every 90-degree elbow you use subtracts 5 feet from that total (a 45-degree subtracts 2.5 feet). So if you have three 90-degree elbows in the walls, your maximum straight-pipe run is reduced to just 20 feet.'
    },
    {
      id: 'irc_hvac_makeup_air_400cfm',
      category: 'hvac',
      title: 'The 400 CFM Kitchen Make-Up Air Rule',
      codeRef: 'IRC M1503.6',
      summary: 'Specific airflow threshold that automatically triggers the mandatory installation of a make-up air system.',
      metricVal: 'Make-Up Air Required if Hood > 0.19 m³/s',
      imperialVal: 'Make-Up Air Required if Hood > 400 CFM',
      jobsiteNote: 'This catches custom home builders all the time. If the client buys a massive professional Wolf or Viking range hood that exhausts 600 or 1200 CFM, you MUST install a motorized damper system that automatically opens to let outside air in whenever the hood is turned on.'
    },
    {
      id: 'irc_hvac_return_air_prohibited',
      category: 'hvac',
      title: 'Prohibited Sources of Return Air',
      codeRef: 'IRC M1602.2',
      summary: 'Rooms from which the HVAC system is strictly forbidden from pulling return air.',
      metricVal: 'No Returns in Kitchens, Baths, or Garages',
      imperialVal: 'No Returns in Kitchens, Baths, or Garages',
      jobsiteNote: 'You cannot put a cold-air return grille in a bathroom, kitchen, or garage. Doing so would suck humidity, bathroom odors, grease, or deadly car exhaust fumes directly into the furnace and distribute them throughout the entire house.'
    },
    {
      id: 'irc_hvac_bath_exhaust',
      category: 'hvac',
      title: 'Bathroom Exhaust Rates',
      codeRef: 'IRC Table M1505.4.4.1',
      summary: 'Prescriptive ventilation airflow required for bathrooms.',
      metricVal: '23.6 L/s Intermittent or 9.4 L/s Continuous',
      imperialVal: '50 CFM Intermittent or 20 CFM Continuous',
      jobsiteNote: 'Notice this aligns almost perfectly with Canadian codes (50 CFM). The fan must exhaust directly to the exterior—it cannot just blow up into the attic space. Blowing humid bathroom air into an attic guarantees severe mold growth.'
    },
    {
      id: 'irc_hvac_flex_duct_support',
      category: 'hvac',
      title: 'Flexible Air Duct Support Spacing',
      codeRef: 'IRC M1601.4.4',
      summary: 'Maximum horizontal spacing for straps supporting flexible insulated HVAC ductwork in attics and crawlspaces.',
      metricVal: 'Support at 1219 mm Intervals (Max 12.7 mm Sag)',
      imperialVal: 'Support at 4-Foot Intervals (Max 1/2" Sag)',
      jobsiteNote: 'Flexible HVAC ducting cannot just lay haphazardly across the attic floor. It must be suspended by 1.5-inch wide strapping at least every 4 feet. The sag between supports cannot exceed 1/2-inch per foot to ensure smooth airflow.'
    },
		{
      id: 'irc_hvac_attic_ac_pan',
      category: 'hvac',
      title: 'Secondary Condensate Pan (Attic AC Units)',
      codeRef: 'IRC M1411.3.1',
      summary: 'Mandatory fail-safe requirements when cooling equipment is installed in an attic above finished ceilings.',
      metricVal: 'Secondary Pan + Separate Drain Line Required',
      imperialVal: 'Secondary Pan + Separate Drain Line Required',
      jobsiteNote: 'If the primary drain on an attic AC unit clogs, the overflow will destroy the drywall ceilings below. You MUST install a secondary sheet-metal or plastic catch pan directly beneath the unit, and it must have its own dedicated drain pipe routing to the exterior.'
    },
    {
      id: 'irc_hvac_pan_drain_visible',
      category: 'hvac',
      title: 'Secondary Pan Drain Termination',
      codeRef: 'IRC M1411.3.1',
      summary: 'Required termination location for the emergency secondary condensate drain pipe.',
      metricVal: 'Must Discharge to a Conspicuous Point of Disposal',
      imperialVal: 'Must Discharge to a Conspicuous Point of Disposal',
      jobsiteNote: 'The emergency secondary drain pipe cannot be routed into the plumbing sewer. It MUST drip somewhere highly visible (like over a window or right above a patio). This way, when it starts dripping, the homeowner immediately knows their primary drain is clogged.'
    },
    {
      id: 'irc_hvac_duct_testing',
      category: 'hvac',
      title: 'Mandatory Duct Leakage Testing (IECC/IRC)',
      codeRef: 'IRC N1103.3.3',
      summary: 'Requirement for pressure-testing HVAC ducts that run outside the home\'s thermal envelope (e.g., in unconditioned attics).',
      metricVal: 'Total Leakage ≤ 4.0 CFM per 100 sq ft',
      imperialVal: 'Total Leakage ≤ 4.0 CFM per 100 sq ft',
      jobsiteNote: 'Under the IRC/IECC energy codes, if you run HVAC ducts in a cold attic, you cannot just tape them and walk away. A certified tester must use a "Duct Blaster" fan to pressurize the system and prove the total air leakage does not exceed 4 CFM per 100 square feet of conditioned floor area.'
    },
    {
      id: 'irc_hvac_dryer_label',
      category: 'hvac',
      title: 'Concealed Dryer Exhaust Labeling',
      codeRef: 'IRC M1502.4.6',
      summary: 'Requirement to permanently identify the actual equivalent length of a dryer vent run if it is hidden in the walls.',
      metricVal: 'Permanent Tag Required if Length > 10.6 m',
      imperialVal: 'Permanent Tag Required if Length > 35 ft',
      jobsiteNote: 'If the builder utilizes a dryer booster fan or engineering to run a dryer vent longer than 35 feet, they MUST affix a permanent label or tag within 6 inches of the dryer exhaust wall connection stating the exact equivalent length of the concealed pipe.'
    },
		{
      id: 'irc_hvac_pvc_downdraft',
      category: 'hvac',
      title: 'PVC Pipe for Downdraft Cooktops',
      codeRef: 'IRC M1503.2 (Exception)',
      summary: 'The sole exception allowing plastic piping to be used for hot kitchen exhaust.',
      metricVal: 'Schedule 40 PVC Under Concrete Slab Only',
      imperialVal: 'Schedule 40 PVC Under Concrete Slab Only',
      jobsiteNote: 'While kitchen exhaust must always be metal, the IRC makes one bizarre but highly useful exception: If you have a kitchen island with a downdraft range, you can run Schedule 40 PVC pipe underground to exhaust it, provided it is buried in a sand-filled trench under a poured concrete slab.'
    },
    {
      id: 'irc_hvac_dryer_screws',
      category: 'hvac',
      title: 'Dryer Exhaust Fastener Limits',
      codeRef: 'IRC M1502.4.2',
      summary: 'Strict limitation on mechanical fastener protrusion into dryer ducting.',
      metricVal: 'Maximum 3.2 mm Fastener Protrusion',
      imperialVal: 'Maximum 1/8" Fastener Protrusion',
      jobsiteNote: 'While Canadian codes strictly forbid screws entirely (tape only), the IRC allows blind rivets or very short screws, provided they do not penetrate more than 1/8 inch into the duct. Any deeper, and they will snag lint and fail inspection.'
    },
    {
      id: 'irc_hvac_duct_insulation_rvalue',
      category: 'hvac',
      title: 'HVAC Duct Insulation R-Values',
      codeRef: 'IRC N1103.3.1 / IECC',
      summary: 'Mandatory insulation wrapping for supply and return ducts located in unconditioned spaces like attics.',
      metricVal: 'R-8 for Supply in Attics / R-6 for Other Spaces',
      imperialVal: 'R-8 for Supply in Attics / R-6 for Other Spaces',
      jobsiteNote: 'Under the energy code, running bare sheet-metal HVAC ducts in a cold attic or vented crawlspace is highly illegal. Supply ducts in an attic must be heavily wrapped with a minimum of R-8 insulation. Ducts in other unconditioned spaces (like a basement outside the thermal envelope) require R-6.'
    },
    {
      id: 'irc_hvac_backdraft_damper',
      category: 'hvac',
      title: 'Range Hood Backdraft Dampers',
      codeRef: 'IRC M1503.3',
      summary: 'Requirement for preventing cold outdoor air from blowing back through the kitchen exhaust system.',
      metricVal: 'Airtight Backdraft Damper Required',
      imperialVal: 'Airtight Backdraft Damper Required',
      jobsiteNote: 'Every range hood discharging to the outdoors MUST be equipped with a mechanical backdraft damper. Often, the cheap butterfly damper that comes integrated into the range hood unit satisfies this, but it must be properly taped and functioning.'
    },
		{
      id: 'irc_plumb_toilet_clearance',
      category: 'plumbing',
      title: 'Toilet (Water Closet) Clearances',
      codeRef: 'IRC P2705.1(5)',
      summary: 'Strict IRC minimum dimensional clearances for installing a toilet.',
      metricVal: '381 mm to Centreline / 533 mm in Front',
      imperialVal: '15" to Centreline / 21" in Front',
      jobsiteNote: 'Unlike Canada where it is often treated as a "best practice," the IRC strictly mandates a minimum 15 inches from the center of the toilet drain to any side wall or vanity, and a minimum of 21 inches of clear space immediately in front of the bowl.'
    },
    {
      id: 'irc_plumb_shower_size',
      category: 'plumbing',
      title: 'Shower Stall Minimum Dimensions',
      codeRef: 'IRC P2708.1',
      summary: 'Required minimum interior floor space and dimension for a shower compartment.',
      metricVal: 'Min 0.58 m² Area / 762 mm Dimension',
      imperialVal: 'Min 900 sq. inches Area / 30" Dimension',
      jobsiteNote: 'A shower cannot be a tiny phone booth. The finished interior of the shower must maintain a minimum 30" x 30" clear square area from the finished tile walls. The shower valve and shower head must be positioned so they do not spray directly out the door when opened.'
    },
    {
      id: 'irc_plumb_nail_plate',
      category: 'plumbing',
      title: 'Pipe Protection (Nail Plates)',
      codeRef: 'IRC P2603.2.1',
      summary: 'Steel shield plate requirement for protecting concealed plumbing pipes from fasteners.',
      metricVal: '16-Gauge Plate if within 38 mm of edge',
      imperialVal: '16-Gauge Plate if within 1.5" of edge',
      jobsiteNote: 'Notice the US/Canada difference: The IRC requires a nail plate if the pipe is within 1.5 inches of the stud face (Canada uses 2 inches). The IRC also specifically requires the plate to be a minimum of 16-gauge steel.'
    },
    {
      id: 'irc_plumb_drain_slope',
      category: 'plumbing',
      title: 'Horizontal Drainage Pipe Slope',
      codeRef: 'IRC P3005.3',
      summary: 'Required gravity pitch for horizontal sanitary sewer drains.',
      metricVal: '1/4" per ft (≤ 64 mm pipe) / 1/8" per ft (≥ 76 mm pipe)',
      imperialVal: '1/4" per ft (≤ 2.5" pipe) / 1/8" per ft (≥ 3" pipe)',
      jobsiteNote: 'Small drains (like 2" shower drains or 1.5" sink drains) must slope 1/4 inch per foot. However, the IRC allows larger 3-inch and 4-inch main toilet and sewer trunk lines to be sloped at a shallower 1/8 inch per foot.'
    },
    {
      id: 'irc_plumb_water_heater_pan',
      category: 'plumbing',
      title: 'Water Heater Drain Pan',
      codeRef: 'IRC P2801.6',
      summary: 'Mandatory leak protection pan required when a water heater is installed over a finished floor space.',
      metricVal: 'Galvanized or Plastic Pan w/ Drain Line Required',
      imperialVal: 'Galvanized or Plastic Pan w/ Drain Line Required',
      jobsiteNote: 'If you install a water heater in the attic or in a second-floor laundry room, it MUST sit in a watertight pan made of galvanized steel or rated plastic. The pan must have a minimum 3/4-inch drain pipe routed to the exterior or an approved indirect waste receptor to prevent flooding the house when the tank eventually bursts.'
    },
		{
      id: 'irc_plumb_aav_attic',
      category: 'plumbing',
      title: 'AAV Location in Attics',
      codeRef: 'IRC P3114.4',
      summary: 'Clearance requirements when an Air Admittance Valve terminates in an attic space instead of poking through the roof.',
      metricVal: 'Min 152 mm Above Insulation Materials',
      imperialVal: 'Min 6" Above Insulation Materials',
      jobsiteNote: 'If you terminate a stack vent using an AAV in the attic (to avoid cutting a hole in the roof), the breathing vents on the valve must sit a minimum of 6 inches ABOVE the top layer of blown-in insulation so the fiberglass doesn\'t choke the valve.'
    },
    {
      id: 'irc_plumb_water_heater_valve',
      category: 'plumbing',
      title: 'Water Heater Shutoff Valve',
      codeRef: 'IRC P2903.9.2',
      summary: 'Placement rules for the emergency water shutoff valve servicing a water heater.',
      metricVal: 'Cold Supply Only (Within Sight of Heater)',
      imperialVal: 'Cold Supply Only (Within Sight of Heater)',
      jobsiteNote: 'A massive safety rule: You must install a full-port shutoff valve on the COLD water feed to the tank so you can isolate it during a leak. However, you are strictly forbidden from installing a shutoff valve on the HOT water exit line, as closing both valves could turn the tank into a bomb.'
    },
    {
      id: 'irc_plumb_pan_drain_size',
      category: 'plumbing',
      title: 'Water Heater Drain Pan Pipe Size',
      codeRef: 'IRC P2801.6.1',
      summary: 'Minimum diameter for the emergency drain pipe attached to a water heater overflow pan.',
      metricVal: 'Minimum 19 mm (No Reduction Allowed)',
      imperialVal: 'Minimum 3/4" (No Reduction Allowed)',
      jobsiteNote: 'The pipe draining the emergency pan beneath a water heater must be a minimum of 3/4" in diameter. You cannot reduce this pipe down to 1/2" at any point, and it must terminate visibly to the exterior or an approved indirect waste receptor.'
    },
    {
      id: 'irc_plumb_wet_vent_size',
      category: 'plumbing',
      title: 'Bathroom Wet Venting Sizing',
      codeRef: 'IRC P3108.3',
      summary: 'Pipe sizing requirement when the drain pipe for a sink also acts as the breathable vent for a toilet (wet venting).',
      metricVal: 'Minimum 51 mm Pipe Size for Wet Vent',
      imperialVal: 'Minimum 2" Pipe Size for Wet Vent',
      jobsiteNote: 'In a standard bathroom, the sink drain often doubles as the vent for the toilet and shower (called horizontal wet venting). Because this pipe is carrying both water AND air simultaneously, it must be upsized to a minimum of 2 inches. A 1.5-inch pipe is illegal for a wet vent.'
    },
		{
      id: 'irc_plumb_washer_standpipe',
      category: 'plumbing',
      title: 'Washer Standpipe & Trap Height',
      codeRef: 'IRC P2706.1.2',
      summary: 'Strict IRC dimensional limits for the trap and standpipe serving a clothes washer.',
      metricVal: 'Standpipe: 457mm - 1066mm / Trap: 152mm - 457mm off floor',
      imperialVal: 'Standpipe: 18" to 42" / Trap: 6" to 18" off floor',
      jobsiteNote: 'The IRC enforces a highly specific "strike zone" for laundry drains. The P-trap itself must be between 6 and 18 inches off the floor. The vertical pipe sticking out of that trap (the standpipe) must be at least 18 inches long, but no longer than 42 inches.'
    },
    {
      id: 'irc_plumb_dishwasher_airgap',
      category: 'plumbing',
      title: 'Dishwasher Backflow Protection',
      codeRef: 'IRC P2717.2',
      summary: 'Requirement to protect the dishwasher from sucking dirty sink water back into the clean washing tub.',
      metricVal: 'Air Gap Fitting OR Secured High Loop Required',
      imperialVal: 'Air Gap Fitting OR Secured High Loop Required',
      jobsiteNote: 'You cannot just plug the dishwasher drain hose directly into the garbage disposal and let it droop. The hose MUST be routed up to the very underside of the countertop and strapped securely in place (a "High Loop"), or routed through a deck-mounted Air Gap fitting to physically break the siphon.'
    },
    {
      id: 'irc_plumb_hose_bibb_vacuum',
      category: 'plumbing',
      title: 'Hose Bibb Vacuum Breakers',
      codeRef: 'IRC P2902.4.3',
      summary: 'Mandatory backflow prevention device on all threaded exterior water faucets.',
      metricVal: 'Non-Removable Vacuum Breaker Required',
      imperialVal: 'Non-Removable Vacuum Breaker Required',
      jobsiteNote: 'If a homeowner leaves a garden hose sitting in a puddle of lawn chemicals, and the city water main loses pressure, the house will literally suck that toxic puddle water backwards through the hose into the drinking water. Every exterior faucet MUST have an anti-siphon vacuum breaker.'
    },
    {
      id: 'irc_plumb_cleanout_spacing',
      category: 'plumbing',
      title: 'Building Sewer Cleanout Spacing',
      codeRef: 'IRC P3005.2.2',
      summary: 'Maximum permitted distance between cleanouts on horizontal building sewers (underground exterior pipes).',
      metricVal: 'Maximum 30.5 Meters Spacing',
      imperialVal: 'Maximum 100 Feet Spacing',
      jobsiteNote: 'Once the main 4-inch sewer pipe leaves the foundation and heads toward the street, it must have a cleanout brought up to grade level at intervals not exceeding 100 feet so municipal rooter trucks can access the line.'
    },
		{
      id: 'irc_elec_stair_switch',
      category: 'electrical',
      title: 'Stairway Lighting 3-Way Switches',
      codeRef: 'IRC E3903.3',
      summary: 'Requirement for multi-point lighting control on interior staircases.',
      metricVal: '3-Way Switches if ≥ 6 Risers',
      imperialVal: '3-Way Switches if ≥ 6 Risers',
      jobsiteNote: 'Notice the major cross-border difference: While Canada requires 3-way switches for stairs with 4 risers, the IRC allows single switches until the staircase hits 6 or more risers.'
    },
    {
      id: 'irc_elec_wall_spacing',
      category: 'electrical',
      title: 'Living Area Receptacle Spacing',
      codeRef: 'IRC E3901.2.1',
      summary: 'Maximum distance between wall outlets in general living areas to prevent extension cord use.',
      metricVal: 'Max 3658 mm Spacing (1829 mm to nearest)',
      imperialVal: 'Max 12 ft Spacing (6 ft to nearest)',
      jobsiteNote: 'Often called the "6/12 Rule". No point along a wall can be more than 6 feet from an outlet, meaning maximum spacing is 12 feet. Any wall space 24 inches or wider requires its own receptacle (stricter than Canada’s 36-inch minimum wall space).'
    },
    {
      id: 'irc_elec_kitchen_counter',
      category: 'electrical',
      title: 'Kitchen Counter Receptacle Spacing',
      codeRef: 'IRC E3901.4.1',
      summary: 'Required spacing for kitchen countertop small appliance outlets.',
      metricVal: 'Max 1219 mm Spacing (610 mm to nearest)',
      imperialVal: 'Max 48" Spacing (24" to nearest)',
      jobsiteNote: 'The IRC is significantly stricter than Canada here. No point on a kitchen counter can be more than 24 inches from an outlet, meaning you must place an outlet at least every 48 inches (compared to 72 inches in Canada). All must be GFCI protected.'
    },
    {
      id: 'irc_elec_kitchen_island',
      category: 'electrical',
      title: 'Kitchen Island Receptacles',
      codeRef: 'IRC E3901.4.3',
      summary: 'Receptacle requirements based on island or peninsula countertop square footage.',
      metricVal: '1 for first 0.84 m² / +1 per additional 1.7 m²',
      imperialVal: '1 for first 9 sq ft / +1 per additional 18 sq ft',
      jobsiteNote: 'Under recent IRC updates, a large kitchen island might require two or three receptacles. Additionally, you can no longer mount them under the overhang edge; they must be pop-up assemblies mounted directly in the countertop surface.'
    },
    {
      id: 'irc_elec_bath_receptacle',
      category: 'electrical',
      title: 'Bathroom Sink Receptacle',
      codeRef: 'IRC E3901.6',
      summary: 'Proximity requirement for a dedicated 20A GFCI outlet in a bathroom.',
      metricVal: 'Within 914 mm of outside edge of basin',
      imperialVal: 'Within 36" of outside edge of basin',
      jobsiteNote: 'Every bathroom must have at least one 20-amp, GFCI-protected receptacle located within 3 feet of the outside edge of each sink basin. Double bowl sinks can share one if it sits exactly between them.'
    },
    {
      id: 'irc_elec_panel_clearance',
      category: 'electrical',
      title: 'Electrical Panel Working Space',
      codeRef: 'IRC E3405.2',
      summary: 'Required unobstructed clearance directly in front of the main service panel.',
      metricVal: '914 mm Deep x 762 mm Wide',
      imperialVal: '36" Deep x 30" Wide',
      jobsiteNote: 'You must maintain a clear, unobstructed workspace extending 36 inches deep in front of the panel, and 30 inches wide (or the width of the equipment, whichever is greater). The panel door must be able to open a full 90 degrees.'
    },
		{
      id: 'irc_elec_garage_gfci_all',
      category: 'electrical',
      title: '100% Garage GFCI Mandate (No Exceptions)',
      codeRef: 'IRC E3902.2 / NEC 210.8(A)(2)',
      summary: 'Universal GFCI protection requirement for every single 120V receptacle inside a garage.',
      metricVal: 'All Garage Outlets Must Be GFCI Protected',
      imperialVal: 'All Garage Outlets Must Be GFCI Protected',
      jobsiteNote: 'MASSIVE US/CANADA DIFFERENCE: Under modern IRC/NEC updates, there are ZERO exceptions for garage ceiling outlets or dedicated freezer plugs. The receptacle on the ceiling powering the garage door opener, and the outlet powering a beer fridge, MUST be GFCI protected.'
    },
    {
      id: 'irc_elec_sump_pump_gfci',
      category: 'electrical',
      title: 'Unfinished Basement Sump Pump GFCI',
      codeRef: 'IRC E3902.5 / NEC 210.8(A)(5)',
      summary: 'Mandatory GFCI protection for sump pumps located in unfinished basements.',
      metricVal: 'GFCI Protection Strictly Required',
      imperialVal: 'GFCI Protection Strictly Required',
      jobsiteNote: 'Unlike Canada where sump pumps get a special exemption to avoid flooding, the U.S. code strictly prioritizes life-safety over flooding: EVERY 120-volt receptacle in an unfinished basement (or crawlspace), including the single receptacle powering a submersible sump pump, MUST have GFCI protection.'
    },
    {
      id: 'irc_elec_garage_20amp',
      category: 'electrical',
      title: 'Dedicated 20-Amp Garage Branch Circuit',
      codeRef: 'IRC E3901.9 / NEC 210.11(C)(4)',
      summary: 'Minimum circuit amperage and dedicated wiring required for garage utility wall outlets.',
      metricVal: 'Minimum One Dedicated 20-Amp Circuit',
      imperialVal: 'Minimum One Dedicated 20-Amp Circuit',
      jobsiteNote: 'A standard 15-amp circuit is illegal for feeding the general wall receptacles inside a U.S. garage. You must install at least one dedicated 20-amp branch circuit wired with 12-gauge copper wire to power garage wall outlets for heavy tools and vacuums.'
    },
    {
      id: 'irc_elec_bath_exhaust_shower',
      category: 'electrical',
      title: 'Exhaust Fan Above Tub or Shower',
      codeRef: 'IRC E3404.7 / E4001.11',
      summary: 'Safety requirements when installing a ventilation fan or light directly inside a shower stall footprint.',
      metricVal: 'Wet-Location Listed + GFCI Protected',
      imperialVal: 'Wet-Location Listed + GFCI Protected',
      jobsiteNote: 'If the bathroom layout forces you to install the exhaust fan or recessed light directly over the bathtub or shower stall, the fixture itself MUST be explicitly manufacturer-listed for "Wet Locations" (not just damp), and the circuit feeding it MUST be GFCI protected.'
    },
		{
      id: 'irc_elec_romex_stapling',
      category: 'electrical',
      title: 'NM Cable (Romex) Stapling Spacing',
      codeRef: 'IRC E3802.1 / NEC 334.30',
      summary: 'Mandatory horizontal and vertical support intervals for standard residential wire.',
      metricVal: 'Within 305 mm of Box + Every 1.37 m',
      imperialVal: 'Within 12" of Box + Every 4.5 ft',
      jobsiteNote: 'Notice the slight U.S. metric difference: The IRC requires NM cable to be stapled within 12 inches of the box, but then every 4.5 feet along the run (stricter than Canada’s 5-foot rule). The staple cannot crush the plastic sheath.'
    },
    {
      id: 'irc_elec_hallway_receptacle',
      category: 'electrical',
      title: 'Hallway Receptacle Spacing',
      codeRef: 'IRC E3901.10 / NEC 210.52(H)',
      summary: 'Requirement for dedicated wall outlets in extended corridors.',
      metricVal: 'Required if Hallway is ≥ 3.0 m Long',
      imperialVal: 'Required if Hallway is ≥ 10 ft Long',
      jobsiteNote: 'While short transition corridors do not need power, if a hallway measures 10 feet or longer down its centerline, it MUST have at least one receptacle. This is primarily to prevent residents from stretching vacuum cleaner cords tightly around sharp corners.'
    },
    {
      id: 'irc_elec_attic_guard_strips',
      category: 'electrical',
      title: 'Attic Cable Guard Strips',
      codeRef: 'IRC E3802.2.1 / NEC 334.23',
      summary: 'Physical protection for electrical cables routed across the top of accessible attic joists.',
      metricVal: 'Guard Strips if within 1.8 m of Attic Access',
      imperialVal: 'Guard Strips if within 6 ft of Attic Access',
      jobsiteNote: 'If an electrician runs cables horizontally across the top edges of the ceiling joists in the attic, and those cables are within 6 feet of the attic scuttle hatch (where people crawl or drag storage boxes), the wires MUST be protected by substantial wood guard strips (like 1x2s nailed alongside the cables).'
    },
		{
      id: 'irc_mas_chimney_height',
      category: 'masonry',
      title: 'Masonry Chimney Termination (3-2-10 Rule)',
      codeRef: 'IRC R1003.9',
      summary: 'Required height of chimney flues above roof structures.',
      metricVal: 'Min 914 mm Above Roof / 610 mm Higher within 3.0 m',
      imperialVal: 'Min 3 ft Above Roof / 2 ft Higher than Roof within 10 ft',
      jobsiteNote: 'Identical across U.S. and Canadian codes: The 3-2-10 rule is enforced strictly by building and fire marshals alike. Always measure the 10-foot radius horizontally, not along the roof slope.'
    },
    {
      id: 'irc_mas_mortar_joints',
      category: 'masonry',
      title: 'Mortar Joint Bed & Head Dimensions',
      codeRef: 'IRC R606.2.8',
      summary: 'Standard prescriptive thickness for mortar layers between masonry units.',
      metricVal: '10 mm Nominal (Max 19 mm Starter Bed)',
      imperialVal: '3/8" Nominal (Max 3/4" Starter Bed)',
      jobsiteNote: 'The starter course bed joint resting directly on the concrete foundation can be up to 3/4" thick to level out foundation variations. All vertical courses above must be laid with standard 3/8" joints.'
    },
    {
      id: 'irc_mas_cold_weather',
      category: 'masonry',
      title: 'Cold Weather Masonry Construction',
      codeRef: 'IRC R606.2.13',
      summary: 'Protection measures required when ambient air temperatures drop during masonry placement.',
      metricVal: 'Maintain Above 4.4°C (40°F)',
      imperialVal: 'Maintain Above 40°F',
      jobsiteNote: 'If temperatures fall below 40°F, mixing water or sand must be heated. If temperatures drop below 32°F (0°C), masonry units themselves must be warmed above freezing before placing.'
    },
    {
      id: 'irc_mas_corbel_limits',
      category: 'masonry',
      title: 'Masonry Wall Corbelling Limits',
      codeRef: 'IRC R606.2.4',
      summary: 'Maximum projection when stepping out solid masonry units to form structural ledges.',
      metricVal: 'Max Projection = 1/2 Wall Thickness Total',
      imperialVal: 'Max Projection = 1/2 Wall Thickness Total',
      jobsiteNote: 'Notice the difference from Canada: While OBC limits total corbelling to 1/3 of the wall thickness, the IRC allows structural corbelling up to 1/2 of the total wall thickness, provided each individual step projects no more than half the height of the unit.'
    },
    {
      id: 'irc_env_radon_roughin',
      category: 'envelope',
      title: 'Radon Vent Pipe Rough-In',
      codeRef: 'IRC Appendix AF (AF103.2)',
      summary: 'Mandatory passive radon mitigation pipe installation in designated high-radon zones.',
      metricVal: '76 mm or 102 mm Pipe Embedded in Gas-Permeable Layer',
      imperialVal: '3" or 4" Pipe Embedded in Gas-Permeable Layer',
      jobsiteNote: 'A 3-inch or 4-inch PVC vent pipe must extend from beneath the 6-mil poly vapor barrier up through the interior conditioned space and terminate at least 12 inches above the roofline. Must be labeled "Radon Reduction System".'
    },
    {
      id: 'irc_fnd_garage_slope',
      category: 'foundations',
      title: 'Garage Floor Slope Requirement',
      codeRef: 'IRC R309.1',
      summary: 'Mandatory floor pitch to prevent hazardous liquid pooling beneath parked vehicles.',
      metricVal: 'Sloped Toward Main Vehicle Entry Doorway or Drain',
      imperialVal: 'Sloped Toward Main Vehicle Entry Doorway or Drain',
      jobsiteNote: 'Garage slabs must pitch toward the exterior vehicle doorway or an approved oil/water separator floor drain. Carports have the same drainage requirement to prevent pooling water around foundation plates.'
    },
		{
      id: 'irc_mas_lintel_bearing',
      category: 'masonry',
      title: 'Steel Lintel Minimum Bearing',
      codeRef: 'IRC R703.8.3',
      summary: 'Required resting ledge length for steel angles carrying brick veneer over openings.',
      metricVal: '102 mm Minimum Bearing',
      imperialVal: '4" Minimum Bearing',
      jobsiteNote: 'Notice the major difference from Canadian codes: The IRC only requires a 4-inch bearing length for steel lintels resting on the brick beside the window, whereas Canadian codes strictly demand 6 inches (150 mm).'
    },
    {
      id: 'irc_mas_tie_spacing',
      category: 'masonry',
      title: 'Brick Veneer Tie Maximum Spacing',
      codeRef: 'IRC R703.8.4',
      summary: 'Maximum allowed wall area supported by a single corrugated brick tie.',
      metricVal: 'One Tie per 0.25 m² of Wall Area',
      imperialVal: 'One Tie per 2.67 sq. ft. of Wall Area',
      jobsiteNote: 'In standard U.S. residential construction, this translates to placing a brick tie every 24 inches on center horizontally, and every 16 inches vertically (to align with the stud framing). Fasteners must penetrate the studs by at least 1-1/2 inches.'
    },
    {
      id: 'irc_mas_column_size',
      category: 'masonry',
      title: 'Minimum Masonry Column Dimensions',
      codeRef: 'IRC R606.3.5.1',
      summary: 'Absolute minimum sizing for isolated structural masonry columns supporting loads (like porch roofs).',
      metricVal: 'Minimum 203 mm x 203 mm',
      imperialVal: 'Minimum 8" x 8" Nominal',
      jobsiteNote: 'A structural masonry column (e.g., brick pillars holding up a front porch roof) cannot be smaller than 8"x8" nominal. If the load is massive or the column is unusually tall, it must be widened and reinforced with internal vertical rebar set in grout.'
    },
    {
      id: 'irc_mas_lateral_support',
      category: 'masonry',
      title: 'Lateral Support Anchorage to Floors',
      codeRef: 'IRC R606.11.2',
      summary: 'Requirement for tying structural masonry walls into the floor joist systems to prevent wall blowout.',
      metricVal: 'Metal Strap Anchors @ 1219 mm Max',
      imperialVal: 'Metal Strap Anchors @ 4 ft Max Spacing',
      jobsiteNote: 'If you build a structural block wall (not veneer, but the actual load-bearing wall), you must physically tie it to the wood floor diaphragm. You cannot rely on gravity. Steel strap anchors must be embedded in the masonry joints and nailed to the floor joists at least every 4 feet.'
    },
		{
      id: 'irc_mas_flue_projection',
      category: 'masonry',
      title: 'Flue Liner Projection Above Cap',
      codeRef: 'IRC R1003.9.1',
      summary: 'Minimum required height that the clay or metal flue liner must protrude above the concrete chimney crown.',
      metricVal: 'Min 102 mm Above Chimney Cap',
      imperialVal: 'Min 4" Above Chimney Cap',
      jobsiteNote: 'You cannot cut the terracotta flue liner flush with the sloped concrete chimney crown (the wash). The liner MUST stick up at least 4 inches above the concrete cap to ensure rising smoke clears the downdraft zone and water doesn\'t easily wash down the flue.'
    },
    {
      id: 'irc_mas_large_hearth',
      category: 'masonry',
      title: 'Large Fireplace Hearth Extension',
      codeRef: 'IRC R1001.10',
      summary: 'Upgraded hearth extension dimensions triggered by fireplaces with massive openings.',
      metricVal: '508 mm Front / 305 mm Sides (if opening > 0.56 m²)',
      imperialVal: '20" Front / 12" Sides (if opening > 6 sq. ft.)',
      jobsiteNote: 'The standard 16" front / 8" side hearth rule only applies to small fireplaces. If the firebox opening is 6 square feet or larger, the IRC demands a significantly larger hearth projecting 20 inches in front and 12 inches on the sides.'
    },
    {
      id: 'irc_mas_seismic_ties',
      category: 'masonry',
      title: 'Veneer Ties in High Seismic Zones',
      codeRef: 'IRC R703.8.4.1',
      summary: 'Upgraded masonry reinforcement requirements for homes built in designated earthquake zones (D0, D1, D2).',
      metricVal: 'Reduced Tie Spacing + Wire Joint Reinforcement Required',
      imperialVal: 'Reduced Tie Spacing + Wire Joint Reinforcement Required',
      jobsiteNote: 'In high seismic risk areas (like California), standard tie spacing is outlawed. Brick ties must be spaced much tighter, AND continuous horizontal heavy-gauge wire reinforcement must be embedded in the mortar bed joints to keep the brick from shaking off the wall during an earthquake.'
    },
		{
      id: 'irc_garage_ignition_source',
      category: 'garages',
      title: 'Ignition Source Elevation',
      codeRef: 'IRC M1307.3 / P2801.7',
      summary: 'Required height for appliances with open flames or spark igniters located in a garage.',
      metricVal: 'Minimum 457 mm Above Floor',
      imperialVal: 'Minimum 18" Above Floor',
      jobsiteNote: 'Gasoline fumes are heavier than air and pool along the floor. Any appliance that creates a spark or has a pilot light (like a gas water heater or furnace) must be elevated on a stand so the ignition source is at least 18 inches above the garage floor to prevent explosions. (Note: "FVIR" rated heaters sometimes carry exceptions, but 18" remains standard safe practice).'
    },
    {
      id: 'irc_garage_duct_steel',
      category: 'garages',
      title: 'HVAC Duct Material in Garages',
      codeRef: 'IRC R302.5.2',
      summary: 'Strict material requirement for any HVAC duct passing through or dumping into an attached garage.',
      metricVal: 'Minimum 26-Gauge Sheet Steel',
      imperialVal: 'Minimum 26-Gauge Sheet Steel',
      jobsiteNote: 'You CANNOT use flexible plastic ducting, fiberglass duct board, or aluminum flex pipe in a garage. Any duct penetrating the garage space must be made of rigid, minimum 26-gauge galvanized sheet steel with absolutely no openings into the garage.'
    },
    {
      id: 'irc_garage_door_rating',
      category: 'garages',
      title: 'Garage-to-House Door Rating',
      codeRef: 'IRC R302.5.1',
      summary: 'Required fire-resistance or material thickness for the pedestrian door into the house.',
      metricVal: '35 mm Solid Wood or 20-Minute Fire Rated',
      imperialVal: '1-3/8" Solid Wood or 20-Minute Fire Rated',
      jobsiteNote: 'The door must be solid wood or solid/honeycomb-core steel measuring at least 1-3/8" thick, OR it must carry an official 20-minute fire-resistance rating label on the hinge side. It must also be equipped with a self-closing device.'
    },
    {
      id: 'irc_garage_floor_material',
      category: 'garages',
      title: 'Garage Floor Combustibility',
      codeRef: 'IRC R309.1',
      summary: 'Material restrictions for the driving and parking surfaces inside a garage.',
      metricVal: 'Approved Non-Combustible Material',
      imperialVal: 'Approved Non-Combustible Material',
      jobsiteNote: 'You cannot build a wooden floor inside a garage or carport. The floor surface must be poured concrete, asphalt, or another approved non-combustible material to resist burning gas/oil spills and handle heavy vehicle loads.'
    },
    {
      id: 'irc_garage_wall_separation',
      category: 'garages',
      title: 'Garage Wall Fire Separation',
      codeRef: 'IRC Table R302.6',
      summary: 'Minimum drywall thickness required on the garage side of the wall separating it from the house.',
      metricVal: '12.7 mm Gypsum Board on Garage Side',
      imperialVal: '1/2" Gypsum Board on Garage Side',
      jobsiteNote: 'The U.S. treats this strictly as a fire separation. The wall between the house and the garage must be covered with at least 1/2" drywall on the garage side. If there are habitable rooms directly ABOVE the garage, the garage ceiling must be covered with 5/8" Type X (fire-rated) drywall.'
    },
		{
      id: 'irc_garage_detached_slab',
      category: 'garages',
      title: 'Detached Garage Frost Exemption',
      codeRef: 'IRC R403.1.4.1 (Exception 1)',
      summary: 'IRC rules for building freestanding garages and sheds on floating concrete slabs.',
      metricVal: 'Exempt if Area ≤ 56 m² and Eave ≤ 3.0 m',
      imperialVal: 'Exempt if Area ≤ 600 sq ft and Eave ≤ 10 ft',
      jobsiteNote: 'The IRC allows a detached, light-framed garage up to 600 square feet (a large 2-car garage) to be built on a floating slab without frost footings, provided the eave height is 10 feet or less.'
    },
    {
      id: 'irc_garage_door_opener',
      category: 'garages',
      title: 'Automatic Garage Door Opener Safety',
      codeRef: 'IRC R309.4 / UL 325',
      summary: 'Mandatory entrapment protection for motorized garage door operators.',
      metricVal: 'Listed to UL 325 (Photoelectric Sensors Required)',
      imperialVal: 'Listed to UL 325 (Photoelectric Sensors Required)',
      jobsiteNote: 'If an automatic garage door opener is installed, it legally must comply with UL 325. This requires the installation of photoelectric safety eyes (sensors) mounted no higher than 6 inches off the garage floor to reverse the door if a child or pet crosses the threshold.'
    },
    {
      id: 'irc_garage_attic_fire',
      category: 'garages',
      title: 'Garage Attic Fire Separation',
      codeRef: 'IRC Table R302.6',
      summary: 'Fire drywall requirements for shared attics over attached garages.',
      metricVal: '12.7 mm Drywall Must Extend to Roof Deck',
      imperialVal: '1/2" Drywall Must Extend to Roof Deck',
      jobsiteNote: 'If the garage and house share an attic, you have two choices: Either drywall the entire garage ceiling with 1/2" gypsum to cap the room, OR run the 1/2" drywall on the shared wall all the way up through the trusses to the underside of the roof deck.'
    },
    {
      id: 'irc_garage_water_heater_impact',
      category: 'garages',
      title: 'Appliance Vehicle Impact Protection',
      codeRef: 'IRC M1307.3.1',
      summary: 'Requirement for physical barricades protecting mechanical equipment located in the path of a vehicle.',
      metricVal: 'Approved Crash Barriers Required',
      imperialVal: 'Approved Crash Barriers (Bollards) Required',
      jobsiteNote: 'If a water heater, furnace, or laundry unit is installed inside the garage at the end of the parking bay, it MUST be protected by a heavy steel pipe bollard set in concrete or a similar structural barrier. A standard wood-framed closet is not considered an impact barrier.'
    },
		{
      id: 'irc_dock_wood_water',
      category: 'marine',
      title: 'Wood in Contact with Water',
      codeRef: 'IRC R317.1.3',
      summary: 'Strict U.S. material requirements for structural lumber extending directly into a body of water.',
      metricVal: 'Preservative-Treated for Marine Use',
      imperialVal: 'Preservative-Treated for Marine Use',
      jobsiteNote: 'Standard ground-contact pressure-treated lumber (UC4A) is not sufficient. Wood piles and cribbing submerged in lakes or saltwater must be treated to AWPA Use Category 4B or 5 (Marine Use) to survive rot and marine borers.'
    },
    {
      id: 'irc_dock_nec_gfci',
      category: 'marine',
      title: 'Dock Receptacle GFCI Protection',
      codeRef: 'NEC 555.33 (A) / IRC E3902.11',
      summary: 'Ground-fault protection rules for residential docks to prevent Electric Shock Drowning (ESD).',
      metricVal: 'GFCI Required on all 120V, 15A & 20A Outlets',
      imperialVal: 'GFCI Required on all 120V, 15A & 20A Outlets',
      jobsiteNote: 'The NEC has clamped down incredibly hard on dock wiring due to fatalities. Every receptacle on a dock must be GFCI protected. Furthermore, the entire feeder circuit supplying the dock must have Ground-Fault Protection of Equipment (GFPE) set at no more than 30mA.'
    },
    {
      id: 'irc_dock_equipotential',
      category: 'marine',
      title: 'Dock Equipotential Bonding',
      codeRef: 'NEC 555.37',
      summary: 'Requirement to bond all metal parts of a dock together to prevent stray voltage from entering the water.',
      metricVal: 'Bond All Metal Parts w/ 8 AWG Copper',
      imperialVal: 'Bond All Metal Parts w/ 8 AWG Copper',
      jobsiteNote: 'If you build a boathouse or dock with a metal roof, steel pilings, or a metal boat lift, every piece of conductive metal must be tied together (bonded) using a bare 8-gauge solid copper wire, so if a wire shorts against the metal roof, it trips the breaker instead of electrifying the lake.'
    },
    {
      id: 'irc_dock_guard_exemption',
      category: 'marine',
      title: 'Guards at Boat Loading Areas',
      codeRef: 'IRC R312.1.1 (Interpretation)',
      summary: 'Application of the 30-inch drop rule to marine loading structures.',
      metricVal: 'Exempt at Designated Boat Loading Edges',
      imperialVal: 'Exempt at Designated Boat Loading Edges',
      jobsiteNote: 'While the IRC explicitly requires a 36" tall guardrail anywhere a deck drops more than 30 inches, local coastal authorities and the IBC explicitly exempt the water-side of docks and piers, as a railing would defeat the operational purpose of the structure.'
    },
		{
      id: 'irc_tol_wall_plumb',
      category: 'framing_tolerances',
      title: 'Maximum Wall Out-of-Plumb (NAHB)',
      codeRef: 'NAHB RCPG 4-4',
      summary: 'U.S. standard for maximum acceptable vertical deviation in framed walls.',
      metricVal: 'Max 9.5 mm in 812 mm (Vertical)',
      imperialVal: 'Max 3/8" in 32" (Vertical)',
      jobsiteNote: 'The NAHB standard allows a wall to be out of plumb by a maximum of 3/8 of an inch within any 32-inch vertical measurement. If it exceeds this, the framer is responsible for repairing it before finishes are applied.'
    },
    {
      id: 'irc_tol_floor_level',
      category: 'framing_tolerances',
      title: 'Maximum Floor Unlevelness (NAHB)',
      codeRef: 'NAHB RCPG 5-2',
      summary: 'U.S. standard for maximum acceptable slope in a residential wood-framed floor.',
      metricVal: 'Max 12.7 mm over 3.0 m',
      imperialVal: 'Max 1/2" over 10 ft',
      jobsiteNote: 'A floor cannot slope more than 1/2" within a 10-foot span. Keep in mind, this measures *levelness* (slope). A floor can be perfectly flat but still be out of level. Both flatness and levelness must be corrected if they exceed this limit.'
    },
    {
      id: 'irc_tol_room_square',
      category: 'framing_tolerances',
      title: 'Room Squareness Tolerance',
      codeRef: 'Industry Standard / Best Practice',
      summary: 'Acceptable deviation when cross-measuring diagonals to ensure a room is perfectly square.',
      metricVal: 'Diagonals must match within 12.7 mm',
      imperialVal: 'Diagonals must match within 1/2"',
      jobsiteNote: 'When framing a room, pulling a tape measure from corner to corner (an X pattern) should yield the exact same measurement. If the two diagonal measurements differ by more than 1/2", the room is out of square, which will create massive headaches for the tile installer and trim carpenter.'
    },
    {
      id: 'irc_marine_shore_disconnect',
      category: 'marine',
      title: 'Dock Shore-Power Disconnect Switch',
      codeRef: 'NEC 555.33(A)',
      summary: 'Mandatory emergency electrical shutoff requirement for all docks and marinas.',
      metricVal: 'Readily Accessible on Land (Max 762 mm above deck)',
      imperialVal: 'Readily Accessible on Land (Max 30" above deck)',
      jobsiteNote: 'You MUST install a dedicated electrical disconnect switch on dry land before the power runs out onto the dock. This allows rescue personnel to instantly kill the power to the water in the event of a drowning or electrocution hazard.'
    },
    {
      id: 'irc_marine_foam_encapsulation',
      category: 'marine',
      title: 'Flotation Foam Encapsulation',
      codeRef: 'US Army Corps of Engineers (USACE) Guidelines',
      summary: 'Federal U.S. prohibition against exposed styrofoam billets in navigable waters.',
      metricVal: 'Min 3.8 mm (0.15") Plastic Encapsulation Required',
      imperialVal: 'Min 0.15" (150 mil) Plastic Encapsulation Required',
      jobsiteNote: 'If you are building a floating dock on a lake controlled by the Army Corps of Engineers or the EPA, any foam flotation must be enclosed in a watertight, UV-resistant shell at least 0.15 inches thick. Exposed foam will result in heavy fines and mandatory removal.'
    },
		{
      id: 'irc_tol_door_bind',
      category: 'framing_tolerances',
      title: 'Door Frame Out-of-Square',
      codeRef: 'NAHB RCPG 10-2',
      summary: 'Acceptable tolerance for rough openings causing door binding or uneven reveals.',
      metricVal: 'Max 6.4 mm Variance in Reveal',
      imperialVal: 'Max 1/4" Variance in Reveal',
      jobsiteNote: 'If the framer builds a rough opening badly out of square, the trim carpenter will have to rack the door jamb. According to NAHB, the gap (reveal) between the edge of the door and the door frame cannot vary by more than 1/4" from top to bottom.'
    },
    {
      id: 'irc_tol_beam_flush',
      category: 'framing_tolerances',
      title: 'Flush Framing Transition',
      codeRef: 'NAHB RCPG 4-2',
      summary: 'Maximum acceptable lip or ridge where two framing members meet (e.g., floor joist meeting a flush beam).',
      metricVal: 'Max 6.4 mm Lip/Ridge',
      imperialVal: 'Max 1/4" Lip/Ridge',
      jobsiteNote: 'If you frame floor joists into joist hangers on the side of a flush beam, the tops of the joists cannot sit more than 1/4" higher or lower than the top of the beam. Anything more requires planing down or shimming up before the subfloor can be glued.'
    },
    {
      id: 'irc_marine_esd_sign_nec',
      category: 'marine',
      title: 'NEC Dock Warning Signage',
      codeRef: 'NEC 555.10',
      summary: 'Strict U.S. requirements for marking electrical hazards at boat docks.',
      metricVal: 'Sign Must State: "WARNING - POTENTIAL SHOCK HAZARD"',
      imperialVal: 'Sign Must State: "WARNING - POTENTIAL SHOCK HAZARD"',
      jobsiteNote: 'Similar to Canada, the NEC requires clear warning signs. The signs must explicitly warn against swimming near the dock, and they must be positioned so they are clearly visible to people both on the dock and approaching from the water.'
    },
    {
      id: 'irc_marine_hardware_treat',
      category: 'marine',
      title: 'Hardware for Heavy Marine Treated Wood',
      codeRef: 'IRC R317.3',
      summary: 'Requirement for extreme corrosion resistance when fasteners touch heavily treated marine lumber.',
      metricVal: 'Type 304 or 316 Stainless Steel Strongly Required',
      imperialVal: 'Type 304 or 316 Stainless Steel Strongly Required',
      jobsiteNote: 'Lumber treated to AWPA UC4B or UC5 for submerged marine use is packed with massive amounts of copper preservative. This copper will rapidly eat through standard galvanized fasteners via galvanic corrosion. In saltwater or heavy marine applications, Type 316 Stainless Steel hardware is the only safe choice.'
    },
		{
      id: 'irc_fin_shower_backer',
      category: 'interior_finishes',
      title: 'Wet Area Tile Backer Board',
      codeRef: 'IRC R702.4.2',
      summary: 'Required substrate materials for installing tile in bathtubs and showers.',
      metricVal: 'Cement, Fiber-Cement, or Glass-Mat Required',
      imperialVal: 'Cement, Fiber-Cement, or Glass-Mat Required',
      jobsiteNote: 'A classic homeowner flip mistake: Standard paper-faced moisture-resistant drywall ("Greenboard") is STRICTLY PROHIBITED in wet tub and shower areas. You MUST use cement board, fiber-cement, or glass-mat gypsum board, sealed with a waterproof membrane system.'
    },
    {
      id: 'irc_fin_flame_spread',
      category: 'interior_finishes',
      title: 'Interior Finish Flame Spread (T&G Ceilings)',
      codeRef: 'IRC R302.9.1 / R302.9.2',
      summary: 'Combustibility limits for wall and ceiling finishes to prevent rapid fire flashover.',
      metricVal: 'Max Flame Spread Index 200',
      imperialVal: 'Max Flame Spread Index 200',
      jobsiteNote: 'If a client wants a rustic barnwood or heavy tongue-and-groove pine ceiling, be careful. Certain highly resinous woods, thin untreated plastics, or exposed foam panels fail the 200 Flame Spread Index limit and cannot be legally used as an exposed interior finish.'
    },
    {
      id: 'irc_fin_door_threshold',
      category: 'interior_finishes',
      title: 'Interior Door Threshold Transition Height',
      codeRef: 'IRC R311.3.1',
      summary: 'Maximum height of a flooring transition or threshold in an interior doorway to prevent tripping.',
      metricVal: 'Maximum 12.7 mm Height',
      imperialVal: 'Maximum 1/2" Height',
      jobsiteNote: 'When transitioning from thick hardwood in the hallway to thick tile in the bathroom, the threshold or transition strip cannot create a bump higher than 1/2 inch. If it does, you must use a specialized ramped reducer strip to smooth the transition.'
    },
    {
      id: 'irc_fin_drywall_water',
      category: 'interior_finishes',
      title: 'Water-Resistant Gypsum Placement',
      codeRef: 'IRC R702.3.7',
      summary: 'Restriction on using moisture-resistant drywall (greenboard) on ceilings.',
      metricVal: 'Max 305 mm OC Spacing for 12.7 mm Board',
      imperialVal: 'Max 12" OC Spacing for 1/2" Board',
      jobsiteNote: 'Moisture-resistant drywall is structurally weaker than standard drywall. You cannot use 1/2" greenboard on a bathroom ceiling if the framing is 16" or 24" OC. It will sag drastically due to bathroom humidity. Framing must be 12" OC, or you must upgrade to 5/8" thickness.'
    },
    {
      id: 'irc_fin_baseboard_fastening',
      category: 'interior_finishes',
      title: 'Trim Fastening in High Seismic Zones',
      codeRef: 'IRC R702.1',
      summary: 'General requirement for securement of interior wall coverings and trim to resist detachment.',
      metricVal: 'Must Fasten Directly into Framing Members',
      imperialVal: 'Must Fasten Directly into Framing Members',
      jobsiteNote: 'You cannot install heavy crown molding or tall MDF baseboards by simply shooting brad nails blindly into the drywall. Heavy trim profiles must be securely fastened directly into the wall studs or top plates to prevent them from falling and causing injury.'
    },
		{
      id: 'irc_fin_shower_pan_turnup',
      category: 'interior_finishes',
      title: 'Shower Pan Liner Turn-Up (Dam)',
      codeRef: 'IRC P2709.2',
      summary: 'Required vertical height for the waterproof membrane liner inside a custom-tiled shower pan.',
      metricVal: 'Min 76 mm Above Finished Threshold',
      imperialVal: 'Min 3" Above Finished Threshold',
      jobsiteNote: 'When building a custom mud-bed shower floor, the thick PVC or rubber pan liner must turn up the wall framing and extend at least 3 inches HIGHER than the top of the finished entry curb/threshold to guarantee the shower will overflow into the room before leaking into the walls.'
    },
    {
      id: 'irc_fin_drywall_edges',
      category: 'interior_finishes',
      title: 'Drywall Edge Fastener Clearance',
      codeRef: 'IRC Table R702.3.5.1',
      summary: 'Minimum required distance a screw or nail must be driven from the edge of a gypsum board sheet.',
      metricVal: 'Min 9.5 mm from Edges/Ends',
      imperialVal: 'Min 3/8" from Edges/Ends',
      jobsiteNote: 'Driving screws too close to the edge of the drywall crushes the gypsum core and breaks the paper face, leaving the board completely unanchored. All fasteners must be held back at least 3/8" from the factory or cut edge.'
    },
    {
      id: 'irc_fin_vapor_retarder_floor',
      category: 'interior_finishes',
      title: 'Vapor Retarder Under Flooring',
      codeRef: 'IRC R506.2.3',
      summary: 'Requirement for moisture blocking between a slab-on-grade and moisture-sensitive finished flooring.',
      metricVal: '0.15 mm (6-mil) Polyethylene Required',
      imperialVal: '6-mil Polyethylene Required',
      jobsiteNote: 'When installing laminate, engineered wood, or luxury vinyl plank (LVP) directly over a concrete slab-on-grade, a 6-mil poly vapor barrier is legally required to prevent concrete vapor emissions from delaminating the flooring or trapping mold.'
    },
		{
      id: 'irc_fin_shower_pitch',
      category: 'interior_finishes',
      title: 'Custom Shower Floor Pitch',
      codeRef: 'IRC P2709.3',
      summary: 'Mandatory slope requirements for custom-built mud-bed or tiled shower floors.',
      metricVal: '20 mm to 40 mm per Meter',
      imperialVal: '1/4" to 1/2" per Foot',
      jobsiteNote: 'A custom tiled shower pan must slope exactly between 1/4 inch and 1/2 inch per foot toward the drain. Less than 1/4 inch, and the water won\'t drain efficiently (pooling). More than 1/2 inch, and it becomes a severe slip hazard for the homeowner when wet.'
    },
    {
      id: 'irc_fin_double_vapor_barrier',
      category: 'interior_finishes',
      title: 'Prohibited Double Vapor Barriers (Showers)',
      codeRef: 'IRC R702.4.2 (Exception)',
      summary: 'Restriction on installing vapor barriers behind tile backer board on exterior walls.',
      metricVal: 'No Poly Behind Fluid-Applied Membranes',
      imperialVal: 'No Poly Behind Fluid-Applied Membranes',
      jobsiteNote: 'If you are waterproofing a shower on an exterior wall using a fluid-applied membrane (like RedGard) ON TOP of the cement board, you CANNOT install a sheet of 6-mil poly BEHIND the cement board. This creates a "mold sandwich" where moisture gets trapped permanently between two impermeable barriers.'
    },
    {
      id: 'irc_fin_drywall_adhesive',
      category: 'interior_finishes',
      title: 'Drywall Fastening with Adhesive',
      codeRef: 'IRC R702.3.6',
      summary: 'Allowable increase in drywall screw spacing when panels are glued directly to the framing.',
      metricVal: 'Screws @ 406 mm (Walls) / 610 mm (Ceilings) with Glue',
      imperialVal: 'Screws @ 16" (Walls) / 24" (Ceilings) with Glue',
      jobsiteNote: 'If you apply an approved drywall adhesive (glue) to the face of the studs before placing the gypsum board, the IRC allows you to reduce the number of screws. You can space screws up to 24" on ceilings and 16" on walls, which speeds up the taping process.'
    },
		{
      id: 'irc_con_weathering_strength',
      category: 'concrete',
      title: 'Concrete Compressive Strength (Weathering)',
      codeRef: 'IRC Table R402.2',
      summary: 'Required concrete strength based on the local climate\'s freezing and weathering potential.',
      metricVal: '17 MPa (Mild) to 24 MPa (Severe Weathering)',
      imperialVal: '2500 PSI (Mild) to 3500 PSI (Severe Weathering)',
      jobsiteNote: 'In Florida (negligible weathering), 2500 PSI concrete is perfectly legal for a garage slab. But in Michigan or New York (severe weathering), exterior flatwork and garage slabs MUST be upgraded to a minimum 3500 PSI mix to survive the freeze/thaw cycle.'
    },
    {
      id: 'irc_con_slab_thickness',
      category: 'concrete',
      title: 'Slab-on-Grade Minimum Thickness',
      codeRef: 'IRC R506.1',
      summary: 'Required poured thickness for concrete floors supported directly by the earth.',
      metricVal: '89 mm Minimum Thickness',
      imperialVal: '3-1/2" Minimum Thickness',
      jobsiteNote: 'Notice the difference from Canada (which allows 3 inches). The IRC explicitly requires all residential basement, garage, and living space concrete slabs to be poured a minimum of 3.5 inches thick.'
    },
    {
      id: 'irc_con_vapor_retarder',
      category: 'concrete',
      title: 'Under-Slab Vapor Retarder',
      codeRef: 'IRC R506.2.3',
      summary: 'Mandatory moisture barrier placed between the gravel base and the concrete slab.',
      metricVal: '0.15 mm (6-mil) Polyethylene Required',
      imperialVal: '6-mil Polyethylene Required',
      jobsiteNote: 'You MUST lay down 6-mil poly before pouring a basement floor. The joints must overlap by at least 6 inches. (Exception: detached unheated garages or accessory structures do not strictly require a vapor retarder unless a moisture-sensitive finish floor is planned).'
    },
    {
      id: 'irc_ext_foundation_drainage',
      category: 'exterior',
      title: 'Roof Downspout Discharge Distance',
      codeRef: 'IRC R401.3 / R903.4',
      summary: 'Requirements for grading and routing roof water away from the foundation walls.',
      metricVal: 'Discharge Minimum 1.5 m from Foundation',
      imperialVal: 'Discharge Minimum 5 ft from Foundation',
      jobsiteNote: 'Gutters aren\'t technically mandated on every home by the IRC, BUT surface drainage is. If downspouts are installed, the water MUST be piped or splashed a minimum of 5 feet away from the foundation to prevent hydrostatic pressure from collapsing the basement walls.'
    },
    {
      id: 'irc_ext_soffit_vent_sizing',
      category: 'exterior',
      title: 'Attic Ventilation Sizing (1/150 Rule)',
      codeRef: 'IRC R806.2',
      summary: 'Required ratio of net free ventilating area to the area of the attic space.',
      metricVal: '1/150 Total (or 1/300 if 50% is at Soffits)',
      imperialVal: '1/150 Total (or 1/300 if 50% is at Soffits)',
      jobsiteNote: 'The baseline rule is 1 square foot of vent per 150 square feet of attic. However, you can reduce this requirement by half (to 1/300) IF you install a Class I vapor retarder on the ceiling AND split the ventilation evenly between the low soffits and the high ridge vent.'
    },
		{
      id: 'irc_ext_soffit_vent_fire',
      category: 'exterior',
      title: 'Soffit Vents at Fire Separation Distance',
      codeRef: 'IRC Table R302.1(1)',
      summary: 'Prohibition against installing attic ventilation openings in eaves facing closely situated property lines.',
      metricVal: 'Not Allowed if Separation is < 914 mm',
      imperialVal: 'Not Allowed if Separation is < 3 ft',
      jobsiteNote: 'The IRC allows a roof eave to project to within 2 feet of a property line (if you install fire-blocking), but you absolutely CANNOT install soffit vents on that overhang if it is closer than 3 feet to the line. The vents would act as a vacuum, sucking neighboring flames directly into the attic.'
    },
    {
      id: 'irc_ext_drip_edge',
      category: 'exterior',
      title: 'Mandatory Roof Drip Edge',
      codeRef: 'IRC R905.2.8.5',
      summary: 'Requirement for continuous metal flashing at eaves and gables to protect the roof deck edges.',
      metricVal: 'Extend ≥ 51 mm Back / Overlap Gutter',
      imperialVal: 'Extend ≥ 2" Back / Overlap Gutter',
      jobsiteNote: 'The IRC specifically mandates metal drip edge on all asphalt shingle roofs. It must extend a minimum of 2 inches back onto the roof deck and be fastened every 12 inches. At the eave, it must lap over the underlayment and direct water cleanly into the gutter.'
    },
    {
      id: 'irc_con_sawcut_timing',
      category: 'concrete',
      title: 'Slab Saw Cut Timing',
      codeRef: 'ACI 302.1R / IRC Ref',
      summary: 'Critical timing window for cutting contraction joints into freshly poured concrete flatwork.',
      metricVal: 'Cut Within 4 to 12 Hours of Finishing',
      imperialVal: 'Cut Within 4 to 12 Hours of Finishing',
      jobsiteNote: 'If you wait until the next day to saw-cut your control joints, it is almost always too late. Micro-cracking begins as soon as the concrete starts to hydrate and shrink. Cuts must be made as soon as the concrete is hard enough not to unravel or chip under the saw blade.'
    },		   
    {
      id: 'irc_acc_ramp_landings',
      category: 'accessibility',
      title: 'Ramp Landing Dimensions',
      codeRef: 'IRC R311.8.2',
      summary: 'Required level resting platforms at the top, bottom, and directional changes of a ramp.',
      metricVal: 'Minimum 914 mm x 914 mm',
      imperialVal: 'Minimum 36" x 36"',
      jobsiteNote: 'A ramp cannot just terminate abruptly into a doorway. There must be a perfectly level (max 2% slope for drainage) 36" x 36" landing pad at the top, the bottom, and anywhere the ramp changes direction so a wheelchair user can rest and turn.'
    },
    {
      id: 'irc_pool_barrier_height',
      category: 'pools',
      title: 'Pool Enclosure / Fence Height',
      codeRef: 'IRC Appendix G / ISPSC 305.2.1',
      summary: 'Mandatory child-safety barrier preventing unauthorized access to a swimming pool or hot tub.',
      metricVal: 'Minimum 1219 mm Tall Barrier',
      imperialVal: 'Minimum 48" Tall Barrier',
      jobsiteNote: 'Any body of water deeper than 24 inches (including hot tubs and above-ground pools) must be surrounded by a 48-inch tall non-climbable fence. All gates must swing OUTWARD (away from the pool) and have a self-latching mechanism mounted high out of the reach of toddlers.'
    },
		{
      id: 'irc_nrg_blower_door',
      category: 'energy',
      title: 'Whole-House Air Leakage Rate',
      codeRef: 'IRC N1102.4.1.2 (IECC R402.4.1.2)',
      summary: 'Mandatory whole-house depressurization testing for building envelope tightness.',
      metricVal: 'Max 3.0 ACH50 (Climate Zones 3-8)',
      imperialVal: 'Max 3.0 ACH50 (Climate Zones 3-8)',
      jobsiteNote: 'This is fiercely enforced. In Climate Zones 3 through 8, a certified third-party tester must run a blower door test. If the house exceeds 3.0 Air Changes per Hour at 50 Pascals (ACH50), the builder fails inspection and must find and seal the leaks.'
    },
    {
      id: 'irc_nrg_duct_leakage',
      category: 'energy',
      title: 'Duct Testing & Leakage Limits',
      codeRef: 'IRC N1103.3.3 (IECC R403.3.3)',
      summary: 'Mandatory pressure testing for HVAC ductwork located outside the conditioned space.',
      metricVal: 'Max Leakage 4.0 CFM per 100 sq ft',
      imperialVal: 'Max Leakage 4.0 CFM per 100 sq ft',
      jobsiteNote: 'If you run your HVAC ducts through a hot, unvented attic or a cold crawlspace, an energy rater must pressure-test the duct system. It cannot leak more than 4 cubic feet per minute (CFM) per 100 square feet of conditioned floor area. (Mastic paste all seams!)'
    },
    {
      id: 'irc_nrg_ceiling',
      category: 'energy',
      title: 'Ceiling Insulation (Zones 4-8)',
      codeRef: 'IRC Table N1102.1.2',
      summary: 'Required thermal resistance for ceilings beneath unconditioned attics in northern and moderate US climates.',
      metricVal: 'RSI 8.6 to 10.5',
      imperialVal: 'R-49 to R-60',
      jobsiteNote: 'Under recent updates, Climate Zones 4 and 5 require R-49, while Zones 6, 7, and 8 require R-60. You must ensure you leave a minimum 1-inch air gap between the top of the insulation and the roof sheathing at the eaves for ventilation.'
    },
    {
      id: 'irc_nrg_wall_wood',
      category: 'energy',
      title: 'Wood Frame Wall Insulation (Zones 4-5)',
      codeRef: 'IRC Table N1102.1.2',
      summary: 'Required continuous and cavity insulation for exterior walls.',
      metricVal: 'RSI 3.52 Cavity + RSI 0.88 Continuous',
      imperialVal: 'R-20 Cavity OR R-13 Cavity + R-5 Continuous',
      jobsiteNote: 'The IRC pushes heavily for continuous exterior insulation to stop thermal bridging. In Zone 5, you can frame with 2x6s and use R-20 batts, OR you can frame with 2x4s and R-13 batts IF you wrap the entire exterior in minimum R-5 continuous foam board.'
    },
    {
      id: 'irc_nrg_crawlspace',
      category: 'energy',
      title: 'Unvented Crawlspace Insulation',
      codeRef: 'IRC N1102.2.11',
      summary: 'Insulation rules for closed, conditioned crawlspaces without exterior foundation vents.',
      metricVal: 'RSI 2.64 Continuous on Walls',
      imperialVal: 'R-15 Continuous on Walls',
      jobsiteNote: 'Modern building science prefers "conditioned" crawlspaces over vented ones. If you seal the foundation vents, you do not insulate the floor joists. Instead, you must continuously insulate the interior foundation walls with R-15 rigid foam, and lay a taped 6-mil poly vapor barrier over the dirt.'
    },
    {
      id: 'irc_nrg_lighting',
      category: 'energy',
      title: 'High-Efficacy Lighting Equipment',
      codeRef: 'IRC N1104.1 (IECC R404.1)',
      summary: 'Requirement for the installation of energy-efficient lighting fixtures throughout the home.',
      metricVal: '100% High-Efficacy Lamps',
      imperialVal: '100% High-Efficacy Lamps',
      jobsiteNote: 'Incandescent bulbs are effectively dead in new construction. Under modern IECC/IRC requirements, 100 percent of all permanently installed lighting fixtures must contain high-efficacy lamps (LED or CFL).'
    },
		{
      id: 'irc_nrg_2024_credits',
      category: 'energy',
      title: 'Mandatory Additional Efficiency Credits (IECC 2024)',
      codeRef: 'IRC N1108 / IECC R408',
      summary: 'Requirement for prescriptive builders to earn custom point credits via envelope upgrades, HVAC efficiency, or renewables.',
      metricVal: 'Minimum 10 to 15 Credits Required',
      imperialVal: 'Minimum 10 to 15 Credits Required',
      jobsiteNote: 'A major IECC 2024 change: You can no longer just meet the baseline R-value table. Prescriptive builders MUST pick additional efficiency upgrades from Section R408 (such as installing a heat pump water heater, hitting 2.0 ACH50 air-tightness, or adding solar readiness) to earn at least 10 credits.'
    },
    {
      id: 'irc_nrg_2024_windows',
      category: 'energy',
      title: 'Upgraded Window U-Factor Limits (IECC 2024)',
      codeRef: 'IRC Table N1102.1.2 / IECC Table R402.1.2',
      summary: 'Stricter maximum heat transfer rates for residential windows in cold and marine climates.',
      metricVal: 'Max U-Factor 1.59 (Zone 5) / 1.53 (Zones 6-8)',
      imperialVal: 'Max U-Factor 0.28 (Zone 5) / 0.27 (Zones 6-8)',
      jobsiteNote: 'In northern U.S. climates (Zones 5 through 8), standard 0.30 U-Factor windows no longer meet code under the 2024 update. Windows must be upgraded with advanced low-E coatings and triple-glazing or high-grade argon/krypton fills to hit 0.28 or 0.27 U-Factors.'
    },
    {
      id: 'irc_nrg_recessed_lights',
      category: 'energy',
      title: 'Air-Sealed Recessed Lighting (Pot Lights)',
      codeRef: 'IRC N1102.4.5 / IECC R402.4.5',
      summary: 'Air leakage and insulation contact restrictions for recessed fixtures installed in insulated ceilings.',
      metricVal: 'IC-Rated + ASTM E283 Airtight Certified (< 2.0 CFM)',
      imperialVal: 'IC-Rated + ASTM E283 Airtight Certified (< 2.0 CFM)',
      jobsiteNote: 'Every recessed pot light installed in an insulated ceiling must be explicitly stamped both "IC-Rated" (Insulation Contact) and "ASTM E283 Airtight." Furthermore, the internal housing must be caulked or gasketed to the ceiling drywall to stop heated house air from drafting into the attic.'
    },
    {
      id: 'irc_nrg_ev_ready',
      category: 'energy',
      title: 'Electrification & EV-Ready Infrastructure',
      codeRef: 'IECC 2024 Appendix / Local Adoptions',
      summary: 'Provisions requiring dedicated electrical capacity and conduit routing for future electric vehicles and heat pumps.',
      metricVal: '40A/50A 240V Dedicated Branch Circuit Rough-In',
      imperialVal: '40A/50A 240V Dedicated Branch Circuit Rough-In',
      jobsiteNote: 'Many municipalities adopting the latest 2024 energy codes now enforce mandatory "Electrification Readiness." Even if the client uses fossil fuels, the builder must rough-in dedicated 240V electrical circuits terminating in junction boxes for a future EV charger in the garage and future heat pump appliances.'
    },
		{
      id: 'irc_nrg_manual_j_s_d',
      category: 'energy',
      title: 'Mandatory ACCA Manual J/S/D HVAC Design',
      codeRef: 'IRC M1401.3 / N1103.7',
      summary: 'Federal requirements for calculating building heat load (Manual J), equipment selection (Manual S), and duct system design (Manual D).',
      metricVal: 'ACCA Procedures Mandatory',
      imperialVal: 'ACCA Procedures Mandatory',
      jobsiteNote: 'Building inspectors will hold up your rough-in inspection if you cannot produce the certified Manual J reports. The calculation determines the precise heating/cooling loads, matches them to an appropriately sized heat pump or furnace, and maps out the exact duct diameters needed to balance air pressure.'
    },
    {
      id: 'irc_nrg_permanent_certificate',
      category: 'energy',
      title: 'Mandatory Permanent Energy Certificate',
      codeRef: 'IRC N1101.14 (IECC R401.3)',
      summary: 'Requirement to post a permanent record of the home\'s exact insulation values and energy components inside the building.',
      metricVal: 'Post Permanent Label on Electrical Panel',
      imperialVal: 'Post Permanent Label on Electrical Panel',
      jobsiteNote: 'Before final sign-off, you must fill out and stick a permanent energy certificate onto the interior door of the electrical breaker panel. It must explicitly state the installed R-values for the ceiling, walls, and foundation, the window U-factors, the water heater type, and the final recorded blower door ACH50 results.'
    },
    {
      id: 'irc_nrg_thermostat',
      category: 'energy',
      title: 'Programmable Thermostat Requirement',
      codeRef: 'IRC N1103.1.1 (IECC R403.1.1)',
      summary: 'Mandatory installation of controls capable of executing automatic setback schedules.',
      metricVal: 'Programmable/Smart Thermostat Required',
      imperialVal: 'Programmable/Smart Thermostat Required',
      jobsiteNote: 'You cannot install a basic mechanical dial thermostat anymore. The primary heating and cooling control must be a programmable or smart thermostat capable of automatically adjusting temperature settings throughout the day to reduce consumption when occupants are asleep or away.'
    },
		{
      id: 'irc_site_drainage_slope',
      category: 'site_work',
      title: 'Mandatory Prescriptive Site Drainage',
      codeRef: 'IRC R401.3',
      summary: 'The specific prescriptive drop and distance requirements for surface grading away from foundation walls.',
      metricVal: 'Min 152 mm Drop Within First 3.05 m',
      imperialVal: 'Min 6" Drop Within First 10 ft',
      jobsiteNote: 'The IRC uses a strict "6 inches in 10 feet" rule. If structural constraints like a tight property line, concrete driveway, or sidewalk prevent you from getting a full 10-foot run, you must install alternative drainage swales, French drains, or a hard-piped catch basin.'
    },
    {
      id: 'irc_site_retaining_wall',
      category: 'site_work',
      title: 'Retaining Wall Height Limitation',
      codeRef: 'IRC R404.4',
      summary: 'The maximum height an un-engineered retaining wall can hold back soil before a structural design stamp is mandated.',
      metricVal: 'Requires Engineer if > 1219 mm from Bottom of Footing',
      imperialVal: 'Requires Engineer if > 4 ft from Bottom of Footing',
      jobsiteNote: 'Pay close attention to how the IRC measures this: the 4-foot trigger starts from the *bottom of the footing*, not the exposed dirt line. If your block system requires a 12-inch deep gravel or concrete base trench, your maximum allowable visible wall height without an engineer is only 3 feet.'
    },
    {
      id: 'irc_site_grade_clearance',
      category: 'site_work',
      title: 'Wood-to-Grade Clearance Protection',
      codeRef: 'IRC R317.1',
      summary: 'Mandatory separation distance between finished site soil/grading and untreated wood framing elements.',
      metricVal: 'Minimum 152 mm to Untreated Framing/Siding',
      imperialVal: 'Minimum 6" to Untreated Framing/Siding',
      jobsiteNote: 'When establishing your final exterior site grading, the top of the dirt or mulch must sit at least 6 inches below the bottom edge of the wood siding or rim joist. Bringing earth too close to the wood bridge invites rot and gives termites a direct highway into the house.'
    },
    {
      id: 'irc_site_frost_line',
      category: 'site_work',
      title: 'Frost Line Depth Foundations',
      codeRef: 'IRC R403.1.4.1',
      summary: 'Requirements establishing that footings must extend below the locally determined winter frost depth line.',
      metricVal: 'Footing Base Must Extend Below Local Frost Line',
      imperialVal: 'Footing Base Must Extend Below Local Frost Line',
      jobsiteNote: 'Before digging, verify the local municipality\'s designated frost depth map. Footings must bear on undisturbed soil completely below that line. If a deck or porch post footing is poured too shallow, freezing ground moisture will lift the post and warp the structural roofline above.'
    },
		{
      id: 'irc_site_descending_slope',
      category: 'site_work',
      title: 'Footing Setback from Descending Slopes',
      codeRef: 'IRC R403.1.7.2',
      summary: 'Required horizontal distance between a building foundation and the edge of a steep drop-off or cliff.',
      metricVal: 'Setback = Height of Slope ÷ 3 (Max 12.2 m)',
      imperialVal: 'Setback = Height of Slope ÷ 3 (Max 40 ft)',
      jobsiteNote: 'If you are building a home near the top edge of a steep hill (a slope steeper than 33%), the foundation must be set back a distance equal to the total height of the hill divided by 3 (H/3). For a 30-foot drop-off, the footings must sit at least 10 feet back from the edge to prevent a landslide from undermining the house.'
    },
    {
      id: 'irc_site_ascending_slope',
      category: 'site_work',
      title: 'Clearance from Ascending Slopes',
      codeRef: 'IRC R403.1.7.1',
      summary: 'Required setback when building a house at the bottom of a steep hill.',
      metricVal: 'Clearance = Height of Slope ÷ 2 (Max 4.5 m)',
      imperialVal: 'Clearance = Height of Slope ÷ 2 (Max 15 ft)',
      jobsiteNote: 'If you are building at the base of a steep hill, you must maintain a buffer zone to protect the back of the house from landslides, erosion, and heavy surface runoff. The setback is the height of the hill divided by 2 (H/2), capped at a maximum required distance of 15 feet.'
    },
    {
      id: 'irc_site_termite_clearance',
      category: 'site_work',
      title: 'Termite Inspection Clearance (Site Grading)',
      codeRef: 'IRC R318.4',
      summary: 'Mandatory visual inspection gap required in termite-prone regions.',
      metricVal: 'Minimum 152 mm Bare Foundation Exposed',
      imperialVal: 'Minimum 6" Bare Foundation Exposed',
      jobsiteNote: 'In areas prone to subterranean termites, your final site grading and landscaping must leave at least 6 inches of the bare concrete foundation exposed below the exterior siding. This allows exterminators and home inspectors to easily spot the "mud tubes" termites build when climbing from the dirt into the wood framing.'
    },
		{
      id: 'irc_site_undisturbed_soil',
      category: 'site_work',
      title: 'Footing Bearing on Undisturbed Soil',
      codeRef: 'IRC R403.1.4',
      summary: 'Strict requirement for the dirt immediately beneath the concrete footing.',
      metricVal: '100% Undisturbed or Engineered Fill',
      imperialVal: '100% Undisturbed or Engineered Fill',
      jobsiteNote: 'If the excavator accidentally digs the footing trench 6 inches too deep, you CANNOT just shovel loose dirt back in to level it out. The footing must bear on 100% virgin, undisturbed soil. If you dig too deep, you must fill the gap with crushed gravel or extra concrete.'
    },
    {
      id: 'irc_site_stepped_limits',
      category: 'site_work',
      title: 'Limits on Stepped Footings',
      codeRef: 'IRC R403.1.5',
      summary: 'Maximum slope allowance for the bottom of footing trenches.',
      metricVal: 'Top Must Be Level / Bottom Max 1 in 10',
      imperialVal: 'Top Must Be Level / Bottom Max 1 in 10',
      jobsiteNote: 'The top surface of the footing MUST be perfectly level. The bottom of the footing is allowed to slope, but no more than 1 in 10 (approx. 10%). If the site is steeper than that, the footing must be constructed in distinct, level steps.'
    },
    {
      id: 'irc_site_crawlspace_venting',
      category: 'site_work',
      title: 'Crawlspace Ventilation Clearance to Grade',
      codeRef: 'IRC R408.1',
      summary: 'Location of required ventilation openings in foundation walls relative to the exterior dirt.',
      metricVal: 'Vents Must Be Above Exterior Grade',
      imperialVal: 'Vents Must Be Above Exterior Grade',
      jobsiteNote: 'When establishing your site grading around a vented crawlspace, the exterior dirt cannot block the wall vents. If the lot grade must be raised higher than the vents for proper drainage, you must install corrugated steel window wells around the vents to keep the soil out.'
    },		
		{
      id: 'irc_acc_u_shaped_kitchen',
      category: 'accessibility',
      title: 'U-Shaped Kitchen Clearance (Type A Unit)',
      codeRef: 'ICC A117.1 Sec. 1103.12.1.2',
      summary: 'Minimum turning space required between opposing countertops in a U-shaped kitchen layout.',
      metricVal: 'Minimum 1525 mm Clearance',
      imperialVal: 'Minimum 60" Clearance',
      jobsiteNote: 'In a designated accessible dwelling unit, a galley kitchen only requires 40 inches of clearance between counters. However, if the kitchen is U-shaped (enclosed on three sides), you MUST provide a full 60 inches of clear space between opposing base cabinets so a wheelchair can perform a 180-degree turn.'
    },
    {
      id: 'irc_acc_knee_toe_space',
      category: 'accessibility',
      title: 'Knee and Toe Clearance Dimensions',
      codeRef: 'ICC A117.1 Sec. 306.2 / 306.3',
      summary: 'Strict dimensional envelope for the empty space beneath accessible work surfaces and sinks.',
      metricVal: '685 mm (27") High for Knees / 230 mm (9") High for Toes',
      imperialVal: '27" High for Knees / 9" High for Toes',
      jobsiteNote: 'Inspectors measure this with a physical template. The clear space under a sink must be at least 27 inches high for the user\'s knees. As the space goes deeper toward the wall, it can slope down, but it must maintain at least 9 inches of vertical height for the toes all the way to the back wall.'
    },
    {
      id: 'irc_acc_clear_floor_space',
      category: 'accessibility',
      title: 'Standard Clear Floor Space',
      codeRef: 'ICC A117.1 Sec. 305.3.1',
      summary: 'The fundamental rectangular footprint required at all accessible fixtures and appliances.',
      metricVal: '760 mm x 1320 mm (New Buildings)',
      imperialVal: '30" x 52" (New Buildings)',
      jobsiteNote: 'Crucial ICC update: While older ADA codes universally required a 30" x 48" clear space, the modern A117.1 standard for *new* buildings increased this length to 52 inches to accommodate modern, larger power wheelchairs and mobility scooters. Plan your bathrooms accordingly.'
    },
    {
      id: 'irc_acc_work_surface_height',
      category: 'accessibility',
      title: 'Accessible Work Surface / Counter Height',
      codeRef: 'ICC A117.1 Sec. 1103.12.3.2',
      summary: 'Maximum height of a kitchen counter or bathroom vanity intended for forward-approach wheelchair use.',
      metricVal: 'Maximum 865 mm Above Floor',
      imperialVal: 'Maximum 34" Above Floor',
      jobsiteNote: 'Standard residential kitchen base cabinets set the countertop at 36 inches high. For an accessible sink or designated prep space, the top of the counter can be no higher than 34 inches from the finished floor. (Adjustable-height counters are permitted as an alternative).'
    },
		{
      id: 'irc_acc_ramp_handrails',
      category: 'accessibility',
      title: 'Ramp Handrail Triggers',
      codeRef: 'IRC R311.8.3',
      summary: 'The specific ramp gradient that legally mandates the installation of handrails.',
      metricVal: 'Required if Slope is Steeper than 1:20 (5%)',
      imperialVal: 'Required if Slope is Steeper than 1:20 (5%)',
      jobsiteNote: 'A lot of builders think handrails are only required if a ramp hits the maximum 1:12 slope. False. If a ramp is steeper than 1-in-20 (a 5% grade), it legally requires continuous handrails on at least one side. If it is flatter than 1:20, it is technically considered a "sloped walkway" and no handrails are needed.'
    },
    {
      id: 'irc_acc_egress_door',
      category: 'accessibility',
      title: 'Primary Egress Door Clear Width',
      codeRef: 'IRC R311.2',
      summary: 'Minimum width for the primary egress door leading from the house to the exterior.',
      metricVal: 'Min 813 mm Clear Width',
      imperialVal: 'Min 32" Clear Width',
      jobsiteNote: 'While interior bedroom doors in a standard home can technically be smaller, the IRC mandates that at least one exterior egress door (usually the front door) provides a minimum 32-inch clear opening. To achieve this, the door slab itself must be a minimum of 36 inches (3-foot door).'
    },
    {
      id: 'irc_acc_hallway_width',
      category: 'accessibility',
      title: 'Minimum Hallway Width',
      codeRef: 'IRC R311.6',
      summary: 'Baseline minimum width for interior residential hallways.',
      metricVal: 'Min 914 mm Width',
      imperialVal: 'Min 36" Width',
      jobsiteNote: 'The minimum legal width for any hallway in a U.S. home is 36 inches. This is a hard stop. If you frame a hallway at exactly 36 inches rough, and then hang 1/2-inch drywall on both sides, your finished width is 35 inches, and the inspector will fail the framing.'
    },
    {
      id: 'irc_acc_step_free_entry',
      category: 'accessibility',
      title: 'Zero-Step Entry Threshold (Adaptable)',
      codeRef: 'ICC A117.1 / Local Adoptions',
      summary: 'Requirements for creating a flush, step-free threshold at the exterior door.',
      metricVal: 'Max 12.7 mm Threshold Height',
      imperialVal: 'Max 1/2" Threshold Height',
      jobsiteNote: 'When building a home for aging-in-place or under specific accessible grants, the exterior door cannot have a standard 2-inch step down to the porch. The threshold must be completely flush, with a maximum 1/2-inch lip (beveled) to stop wind/water, requiring specialized drop-sill framing and foundation sloping.'
    },
		{
      id: 'irc_pool_barrier_height',
      category: 'pools',
      title: 'Pool Enclosure Barrier Height',
      codeRef: 'ISPSC 305.2.1 / IRC Appx G',
      summary: 'Mandatory child-safety barrier preventing unauthorized access to a swimming pool or hot tub.',
      metricVal: 'Minimum 1219 mm Tall Barrier',
      imperialVal: 'Minimum 48" Tall Barrier',
      jobsiteNote: 'Any body of water deeper than 24 inches requires a barrier. The fence must be at least 48 inches tall measured from the outside ground level. If the fence has horizontal rails, they must be spaced at least 45 inches apart so toddlers cannot use them as a ladder.'
    },
    {
      id: 'irc_pool_door_alarm',
      category: 'pools',
      title: 'House Door Alarms (Barrier Walls)',
      codeRef: 'ISPSC 305.4',
      summary: 'Requirement for alarms on house doors if the wall of the house acts as part of the pool fence.',
      metricVal: 'UL 2017 Listed Alarm Required on Doors',
      imperialVal: 'UL 2017 Listed Alarm Required on Doors',
      jobsiteNote: 'If a sliding glass door or back door opens directly into the pool area without a secondary fence between the house and the pool, that door MUST be equipped with a UL-listed alarm that sounds loudly immediately upon opening to alert parents that a child has gone outside.'
    },
    {
      id: 'irc_pool_suction_vgb',
      category: 'pools',
      title: 'Suction Entrapment Avoidance (VGB Act)',
      codeRef: 'ISPSC 310.1 / VGB Pool & Spa Safety Act',
      summary: 'Federal safety requirement to prevent bathers from being trapped underwater by pump suction.',
      metricVal: 'Dual Drains or Approved Unblockable Drain',
      imperialVal: 'Dual Drains or Approved Unblockable Drain',
      jobsiteNote: 'A massive life-safety code: You can NO LONGER build a pool with a single, small main drain at the bottom. The suction can trap a swimmer. You must install dual drains spaced at least 3 feet apart, or use a certified massive "unblockable" drain cover that complies with the Virginia Graeme Baker Act.'
    },
    {
      id: 'irc_pool_gate_latch',
      category: 'pools',
      title: 'Pedestrian Access Gates',
      codeRef: 'ISPSC 305.3',
      summary: 'Operational requirements for gates leading into the pool enclosure.',
      metricVal: 'Self-Closing, Swing Outward, Latch High',
      imperialVal: 'Self-Closing, Swing Outward, Latch High',
      jobsiteNote: 'Pool gates must swing OUTWARD, away from the pool, so a child pushing on an unlatched gate pushes it shut rather than open. The release mechanism for the latch must be located at least 54 inches above the bottom of the gate so young children cannot reach it.'
    },
		{
      id: 'irc_pool_fence_ladder',
      category: 'pools',
      title: 'Fence Horizontal Rail "Ladder Effect"',
      codeRef: 'ISPSC 305.2.5',
      summary: 'Specific placement of horizontal structural rails on a pool fence to prevent children from climbing them.',
      metricVal: 'Rails Must Be on Pool Side if Spaced < 1143 mm',
      imperialVal: 'Rails Must Be on Pool Side if Spaced < 45"',
      jobsiteNote: 'If you build a wooden pool fence and the horizontal 2x4 stringers are closer than 45 inches apart, a child can use them as a ladder. Therefore, the code mandates that those horizontal rails MUST be placed on the INSIDE (the pool side) of the fence, leaving a flat, un-climbable face toward the yard.'
    },
    {
      id: 'irc_pool_diving_envelope',
      category: 'pools',
      title: 'Diving Water Envelope (Point A)',
      codeRef: 'ISPSC 804.1 / ANSI/APSP/ICC-5',
      summary: 'Strict geometry and depth requirements for the deep end to safely accommodate a diving board.',
      metricVal: 'Zero Negative Tolerance on Minimum Depths',
      imperialVal: 'Zero Negative Tolerance on Minimum Depths',
      jobsiteNote: 'When digging a pool hopper for a diving board, you must follow the precise ISPSC Type I - V Envelope charts. Crucially: you are allowed ZERO negative tolerance. If the chart says the depth at "Point A" must be 7 feet 6 inches, and your concrete finisher makes it 7 feet 5 inches, the diving board is legally void and must be removed.'
    },
    {
      id: 'irc_pool_mesh_fence',
      category: 'pools',
      title: 'Removable Mesh Pool Fencing',
      codeRef: 'ISPSC 305.2.4',
      summary: 'Clearance and tension requirements for temporary mesh safety fences drilled into the pool deck.',
      metricVal: 'Max 102 mm Lift / Bottom Max 25 mm Above Deck',
      imperialVal: 'Max 4" Lift / Bottom Max 1" Above Deck',
      jobsiteNote: 'Removable mesh safety fences are very popular, but they must be tensioned correctly. The bottom of the mesh can sit no higher than 1 inch off the concrete, and a child pulling upward on the bottom edge must not be able to stretch the mesh higher than 4 inches off the deck.'
    },
    {
      id: 'irc_pool_offset_ledges',
      category: 'pools',
      title: 'Underwater Offset Ledges / Benches',
      codeRef: 'ISPSC 806.1 / 808.7',
      summary: 'Limitations on underwater resting ledges protruding from the pool wall.',
      metricVal: 'Max 203 mm Width / Must be Outside Diving Envelope',
      imperialVal: 'Max 8" Width / Must be Outside Diving Envelope',
      jobsiteNote: 'If you pour an underwater ledge along the side of the pool for bathers to rest on, it cannot project more than 8 inches from the wall. Furthermore, ANY stairs, underwater benches, or ledges must be located completely outside the required Diving Water Envelope so a diver cannot hit them.'
    }
  ],
};