export const squaringSteps = [
  {
    target: '.tour-help-trigger',
    content: "Welcome to Squaring & Area! Let's walk through how to calculate your layouts perfectly.",
    placement: 'bottom',
  },
  {
    target: '.tour-side-a-label',
    content: "Enter your Side A (Run) dimension here.",
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '.tour-side-b-label',
    content: "Enter your Side B (Rise) dimension here.",
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '.tour-tape-precision',
    content: "Adjust your tape precision here to round your diagonal measurements.",
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '.tour-diagonal-result',
    content: "Your perfectly squared diagonal measurement will appear here.",
    placement: 'top',
    disableBeacon: true,
  },
  {
    target: '.tour-estimators-header',
    content: "We also calculate quick estimates for concrete, flooring, and paint based on your total area!",
    placement: 'top',
    disableBeacon: true,
  },
  {
    target: '.tour-share-button',
    content: "Tap here to save your results or share them directly with your team.",
    placement: 'top',
    disableBeacon: true,
  }
];

export function getRawTourSteps(activeTool: string) {
  if (activeTool === 'cm') {
    return [
      {
        target: '.cm-tour-beacon',
        content: 'Welcome to the Compound Miter tool! Let\'s take a quick look around.',
        title: 'Compound Miter Tour',
        disableBeacon: true,
      },
      {
        target: '.cm-tour-angles',
        content: 'Enter the exact spring angle of your crown molding and the measured angle of your wall.',
        title: 'Set Your Angles',
        disableBeacon: true,
      },
      {
        target: '.cm-tour-quick-crown',
        content: 'Working with standard 38° spring crown on a perfect 90° corner? Tap here to instantly populate the standard measurements.',
        title: 'Standard Crown Shortcut',
        disableBeacon: true,
      },
      {
        target: '.cm-tour-saw-settings',
        content: 'Here are your exact Saw Miter and Saw Bevel angles. We provide measurements for both Flat Cut (compound) and Nested Cut (upside down against the fence) methods.',
        title: 'Saw Configuration',
        disableBeacon: true,
      },
      {
        target: '.cm-tour-positioning',
        content: 'Never cut it backwards again. This cheat sheet tells you exactly how to position the board on the saw for inside and outside corners.',
        title: 'Cut Positioning Guide',
        disableBeacon: true,
      },
      {
        target: '.cm-tour-save',
        content: 'Save these cut settings to your list or share them directly with your crew.',
        title: 'Save & Share',
        disableBeacon: true,
      }
    ];
  }
  if (activeTool === 'sq') {
    return squaringSteps;
  }
  if (activeTool === 'rr') {
    return [
      {
        target: '.tour-help-trigger',
        content: "Welcome to Roof Rafters! Learn how to calculate common rafters, hips, valleys, and jacks.",
        placement: 'bottom',
      },
      {
        target: '.tour-rafter-core-inputs',
        content: 'Start by defining your Roof Pitch, Total Span, and the specific Rafter Stock you are using. This establishes the baseline geometry for your entire roof system.',
        disableBeacon: true,
      },
      {
        target: '.tour-rafter-details',
        content: 'Input your Ridge Thickness and Seat Width. Your Seat Width determines the horizontal notch of the Birdsmouth. A typical seat cut accounts for the top plate plus your wall sheeting—so for a 2x4 wall with 5/8" sheathing, you would input 4 1/8".',
        disableBeacon: true,
      },
      {
        target: '.tour-rafter-primary-cuts',
        content: 'Here are your exact common rafter dimensions. This gives you the precise Ridge-to-Heel line length, Plumb/Level angles, and exact Birdsmouth detail including HAP (Height Above Plate).',
        disableBeacon: true,
      },
      {
        target: '.tour-rafter-jacks',
        content: 'If you are framing hips or valleys, this auto-generates your Jack Rafter Cut List based on your selected On-Center spacing.',
        disableBeacon: true,
      },
      {
        target: '.tour-rafter-takeoffs',
        content: 'Grab your complete material takeoffs here. It calculates required lumber stock, structural hardware like hurricane ties, and even ventilation baffles.',
        disableBeacon: true,
      },
      {
        target: '.tour-rafter-blueprint',
        content: 'Review the visual layout blueprints to double-check your Birdsmouth and HAP, then save or share these results directly with your crew.',
        disableBeacon: true,
      },
      {
        target: '.tour-share-button',
        content: "Tap here to save your results or share them directly with your team.",
        placement: 'top',
        disableBeacon: true,
      }
    ];
  }
  if (activeTool === 'df') {
    return [
      {
        target: '.tour-help-trigger',
        content: "Welcome to Deck & Flooring! Let's walk through calculating framing, decking, and materials.",
        placement: 'bottom',
      },
      {
        target: '.tour-deck-modes',
        content: 'Welcome to the Deck & Flooring calculator. Start by selecting your scope. "Surface Only" calculates just your decking boards and fasteners, while "Full Framing" engineers the entire substructure from the footings up.',
        disableBeacon: true,
      },
      {
        target: '.tour-deck-dimensions',
        content: 'Enter your overall Deck Footprint. The interactive diagram above will dynamically update to reflect your joist layout and decking patterns based on these exact dimensions.',
        disableBeacon: true,
      },
      {
        target: '.tour-deck-surface',
        content: 'Specify your surface details. Choose your exact board width (standard wood vs. composite) and your joist spacing. Adjust the Waste % to account for off-cuts and complex stagger patterns.',
        disableBeacon: true,
      },
      {
        target: '.tour-deck-substructure',
        content: 'Dial in your framing engineering. Configure beam plies, post sizes, and joist spans. You can even set your exact joist cantilever to ensure hyper-accurate material lists.',
        disableBeacon: true,
      },
      {
        target: '.tour-deck-finishing',
        content: 'Add premium upgrades like Picture Frame Borders, Skirting, or Guardrails. The calculator handles the complex math behind the scenes—including automatically adding the required ladder blocking for your picture frames!',
        disableBeacon: true,
      },
      {
        target: '.tour-deck-takeoffs',
        content: 'Review your complete, highly detailed material takeoffs. It breaks down everything from total framing nails and lateral tension ties, down to the exact number of sonotubes and 80lb concrete bags required.',
        disableBeacon: true,
      },
      {
        target: '.tour-deck-share',
        content: 'Save or share your complete deck engineering specs and material lists directly with your crew, client, or lumber yard.',
        disableBeacon: true,
      }
    ];
  }
  if (activeTool === 'rk') {
    return [
      {
        target: '.tour-help-trigger',
        content: "Welcome to Rake Wall! Learn how to calculate wall studs and plate deductions.",
        placement: 'bottom',
      },
      {
        target: '.tour-rake-dimensions',
        content: 'Start by entering your total Wall Run and the Start of Wall Measurement (the shortest section of the wall including the plates—the tool automatically does the plate deductions for you).',
        disableBeacon: true,
      },
      {
        target: '.tour-rake-modes',
        content: 'Define how you want to calculate the slope. You can calculate by entering the Roof Pitch, or by entering the final Height. You can also dictate whether you are pulling your layout from the short side or the tall side of the wall.',
        disableBeacon: true,
      },
      {
        target: '.tour-rake-framing',
        content: 'Set your framing details. Select the number of top and bottom plates, and your stud spacing. The app automatically calculates the exact vertical plate deduction based on the roof pitch so your studs are cut perfectly to length.',
        disableBeacon: true,
      },
      {
        target: '.tour-rake-reference',
        content: 'Choose your Stud Cut Reference Point. Toggle between measuring to the Long Point (LP) or Short Point (SP) depending on how you prefer to pull your tape and mark your cuts.',
        disableBeacon: true,
      },
      {
        target: '.tour-rake-summary',
        content: 'Review your wall summary. This gives you the Total Rise, End Height, and the exact Plumb and Level saw angles for your cuts.',
        disableBeacon: true,
      },
      {
        target: '.tour-rake-cutlist',
        content: 'Here is your complete Stud Cut List. It provides the exact measurement for every single stud on layout, plus the Common Difference (Step Cut) if you prefer to gang-cut your studs by adding a consistent amount each time.',
        disableBeacon: true,
      },
      {
        target: '.tour-rake-share',
        content: 'Save or share your complete rake wall cut list and angles directly with your crew.',
        disableBeacon: true,
      }
    ];
  }
  if (activeTool === 'oc') {
    return [
      {
        target: '.tour-help-trigger',
        content: "Welcome to OC Master! Easily calculate equal spacing, posts, and balusters.",
        placement: 'bottom',
      },
      {
        target: '.tour-oc-modes',
        content: 'Start by selecting your Layout Mode. The math changes based on your needs: "Lights" evenly distributes centers with half-spacing at the edges, "Posts" calculates flush edge-to-edge structural layouts, and "Balusters" calculates equal empty gaps between items.',
        disableBeacon: true,
      },
      {
        target: '.tour-oc-inputs',
        content: 'Enter your Total Measurement, the Number of Items you need to place, and the exact Width of your post or item. The item width is critical for generating accurate spacer blocks and edge marks.',
        disableBeacon: true,
      },
      {
        target: '.tour-oc-precision',
        content: 'Dial in your Tape Precision. Keep it at 1/8" or 1/16" for standard framing, or drop it to 1/32" for hyper-accurate finish carpentry.',
        disableBeacon: true,
      },
      {
        target: '.tour-oc-summary',
        content: 'Here is your Structural Summary. It gives you the Center-to-Center spacing, but more importantly, it calculates your exact Spacer Block Cut Length. Cut a piece of scrap to this length, place it between your items, and you will not even need to pull a tape!',
        disableBeacon: true,
      },
      {
        target: '.tour-oc-layout',
        content: 'If you prefer pulling a tape measure, this section generates your exact layout marks for every single item. It provides the Left Edge, Center point, and Right Edge, so you know exactly where to strike your lines.',
        disableBeacon: true,
      },
      {
        target: '.tour-oc-share',
        content: 'Save or share this layout list with your crew to keep everyone on the exact same measurements.',
        disableBeacon: true,
      }
    ];
  }
  if (activeTool === 'pl') {
    return [
      {
        target: '.tour-help-trigger',
        content: "Welcome to Payload Tracker! Monitor cargo weight and truck capacity.",
        placement: 'bottom',
      },
      {
        target: '.tour-payload-overview',
        content: "This tool keeps your suspension safe by calculating the exact weight of your materials and comparing it against your vehicle's maximum capacity.",
        disableBeacon: true,
      },
      {
        target: '.tour-payload-vehicle',
        content: 'Start by selecting your truck class or entering a custom payload limit. If you are towing a load, toggle "Trailer Mode" to automatically calculate the estimated tongue weight being transferred to your hitch.',
        disableBeacon: true,
      },
      {
        target: '.tour-payload-materials',
        content: 'Select your Material Category and dial in the specs. The app accounts for precise density differences—for example, it knows that a 16-foot pressure-treated 2x6 weighs significantly more than standard SPF lumber.',
        disableBeacon: true,
      },
      {
        target: '.tour-payload-add',
        content: 'Enter your quantity and hit "Add Weight to Payload". You can stack multiple different material types (like mixing lumber and concrete bags) to build out your complete load manifest.',
        disableBeacon: true,
      },
      {
        target: '.tour-payload-results',
        content: 'Monitor your Gross Cargo Weight and see exactly how much Remaining Payload you have left. Keep an eye on the percentage bar at the top to ensure you are driving legal and safe.',
        disableBeacon: true,
      },
      {
        target: '.tour-payload-share',
        content: 'Save or share your complete payload manifest with your crew, driver, or lumber yard.',
        disableBeacon: true,
      }
    ];
  }
  if (activeTool === 'fi') {
    return [
      {
        target: '.tour-help-trigger',
        content: "Welcome to Volume & Fill! Calculate required material volume, weight, and logistics.",
        placement: 'bottom',
      },
      {
        target: '.tour-volume-dimensions',
        content: 'Start by entering the exact Length, Width, and Depth of your form, trench, or slab area.',
        disableBeacon: true,
      },
      {
        target: '.tour-volume-material',
        content: 'Select your Fill Material. The app uses built-in density metrics for each specific material—from wet concrete to crusher run to mulch—to accurately calculate the total weight.',
        disableBeacon: true,
      },
      {
        target: '.tour-volume-compaction',
        content: 'Enter your Compaction or Waste percentage. This is a critical step to ensure you order enough material to account for gravel compacting or excavated soil swelling.',
        disableBeacon: true,
      },
      {
        target: '.tour-volume-tracker',
        content: 'If you are hauling the material yourself, use the "Send Weight to Tracker" button. This will seamlessly port the total calculated weight directly into your Payload Tracker to ensure your vehicle can safely handle the load.',
        disableBeacon: true,
      },
      {
        target: '.tour-volume-results',
        content: 'Review your total Required Volume and Weight. The app breaks it down into cubic yards, meters, and feet, along with total tonnage and pounds so you can order exactly what you need.',
        disableBeacon: true,
      },
      {
        target: '.tour-volume-logistics',
        content: 'The Site Logistics section takes the guesswork out of planning. It translates your total volume into real-world estimates, telling you exactly how many dump truck loads, skid steer buckets, or wheelbarrow trips it will take to move the material.',
        disableBeacon: true,
      },
      {
        target: '.tour-volume-share',
        content: 'Save or share the material order and logistics breakdown directly with your supplier or crew.',
        disableBeacon: true,
      }
    ];
  }
  if (activeTool === 'co') {
    return [
      {
        target: '.tour-help-trigger',
        content: "Welcome to Concrete Suite! Calculate slabs, walls, footings, and sonotubes.",
        placement: 'bottom',
      },
      {
        target: '.tour-concrete-mode',
        content: 'This single tool handles 4 different construction types. Use this dropdown to switch between Slabs/Pads, Poured/ICF Walls, Strip Footings, and Sonotube Piers.',
        disableBeacon: true,
      },
      {
        target: '.tour-concrete-diagram',
        content: 'As you enter your dimensions, this dynamic 3D diagram will update to reflect your structure. You can tap or click directly on the labels to instantly focus the corresponding input field.',
        disableBeacon: true,
      },
      {
        target: '.tour-concrete-inputs',
        content: 'This section adapts based on your selected mode. Enter your form dimensions, add your waste factor, and toggle your reinforcement and sub-base options. Every detail you add here increases the accuracy of your final takeoff.',
        disableBeacon: true,
      },
      {
        target: '.tour-concrete-takeoff',
        content: 'Your complete material takeoff. Beyond just cubic yards and truckloads, the app calculates your total rebar weight, formwork board requirements, ties, chairs, and sub-base gravel tonnage to make ordering painless.',
        disableBeacon: true,
      },
      {
        target: '.tour-concrete-share',
        content: 'Save your detailed takeoff or share it directly with your concrete plant, steel supplier, or crew on the ground.',
        disableBeacon: true,
      }
    ];
  }
  if (activeTool === 'tl') {
    return [
      {
        target: '.tour-help-trigger',
        content: "Welcome to Tile Layout! Plan balanced layouts, grout spacing, and material counts.",
        placement: 'bottom',
      },
      {
        target: '.tour-tile-diagram',
        content: 'This visual header confirms your room constraints and tile dimensions at a glance before you start making cuts.',
        disableBeacon: true,
      },
      {
        target: '.tour-tile-inputs',
        content: 'Enter your exact room dimensions, tile sizes, and desired grout width. You can also adjust your tape measure precision down to 1/32" for highly detailed tile work.',
        disableBeacon: true,
      },
      {
        target: '.tour-tile-layout',
        content: 'This is where the magic happens. The app automatically calculates whether you should start on the center line or offset by half a tile to ensure your perimeter cuts are perfectly balanced and you never end up with tiny slivers against the wall.',
        disableBeacon: true,
      },
      {
        target: '.tour-tile-takeoff',
        content: 'Your complete material order. We calculate your exact tile count, add a 10% waste factor for breakages, and even estimate how many bags of thinset mortar and grout you will need to buy.',
        disableBeacon: true,
      },
      {
        target: '.tour-tile-share',
        content: 'Save your layout plan or text it directly to your tile setter or supplier so everything is ready for the job site.',
        disableBeacon: true,
      }
    ];
  }
  if (activeTool === 'si') {
    return [
      {
        target: '.tour-help-trigger',
        content: "Welcome to Siding & Gable! Calculate exterior walls, gables, and lap siding.",
        placement: 'bottom',
      },
      {
        target: '.tour-siding-diagram',
        content: 'This dynamic visualizer updates in real-time to show your wall shape, gable pitch, and board lap layout.',
        disableBeacon: true,
      },
      {
        target: '.tour-siding-geometry',
        content: 'Build out your wall segments here. Add standard rectangular walls or peaked gables, and then subtract any window or door openings for a highly accurate net square footage.',
        disableBeacon: true,
      },
      {
        target: '.tour-siding-specs',
        content: 'Select your siding material. Choose from standard presets like Vinyl Double 4 or James Hardie, or input custom manual profiles. Don\'t forget to set your trim details like inside/outside corners and waste factor!',
        disableBeacon: true,
      },
      {
        target: '.tour-siding-takeoff',
        content: 'Your complete exterior takeoff. This breakdown gives you everything from net siding squares and exact board counts, to J-channel, sealant tubes, rain screen strapping, and weather barrier rolls.',
        disableBeacon: true,
      },
      {
        target: '.tour-siding-share',
        content: 'Save your siding estimate or text it directly to your supplier so your materials are ready to go.',
        disableBeacon: true,
      }
    ];
  }
  if (activeTool === 'bc') {
    return [
      {
        target: '.tour-help-trigger',
        content: "Welcome to Masonry Master! Plan block counts, mortar joints, and opening deductions.",
        placement: 'bottom',
      },
      {
        target: '.tour-masonry-diagram',
        content: 'This dynamic visualizer updates to show your wall dimensions, mortar joint scaling, and layout based on the block type you select.',
        disableBeacon: true,
      },
      {
        target: '.tour-masonry-inputs',
        content: 'Set up your wall here. Toggle between standard brick or CMU, input your primary run and height, and subtract any rough openings for doors or windows to keep your count accurate.',
        disableBeacon: true,
      },
      {
        target: '.tour-masonry-takeoff',
        content: 'Your complete masonry takeoff. See the exact units required versus your order quantity with waste factored in. This also breaks down your vertical courses, starting block sizes for perfect symmetry, and estimates how many bags of mortar you\'ll need.',
        disableBeacon: true,
      },
      {
        target: '.tour-masonry-share',
        content: 'Save your masonry material list or send it directly to your supplier to get your blocks and mortar ordered.',
        disableBeacon: true,
      }
    ];
  }
  if (activeTool === 'wc') {
    return [
      {
        target: '.tour-help-trigger',
        content: "Welcome to Wall Calculator! Calculate wall studs, sheathing, insulation, and drywall.",
        placement: 'bottom',
      },
      {
        target: '.tour-wall-diagram',
        content: 'This visualizer updates to reflect your wall dimensions and framing layout, giving you a conceptual look at your stud spacing and plate counts.',
        disableBeacon: true,
      },
      {
        target: '.tour-wall-setup',
        content: 'Define your core structure here. Enter your wall footprint, check if you are framing on a concrete slab, and set your structural parameters like stud spacing, framing size, and plate counts.',
        disableBeacon: true,
      },
      {
        target: '.tour-wall-envelope',
        content: 'Specify your envelope and finishes. Choose exterior sheathing, vapor barriers, insulation type, and drywall specs to ensure your material list covers both inside and out.',
        disableBeacon: true,
      },
      {
        target: '.tour-wall-openings',
        content: 'Add doors and windows. The calculator will automatically deduct square footage for finishes and automatically calculate the structural headers, jack studs, and cripples needed to frame them.',
        disableBeacon: true,
      },
      {
        target: '.tour-wall-takeoff',
        content: 'Your comprehensive wall takeoff. This gives you exact stud cut lengths, plate stock requirements, structural hardware, sheathing, insulation, drywall, and even finish trim and fastener counts.',
        disableBeacon: true,
      },
      {
        target: '.tour-wall-share',
        content: 'Save your detailed framing and finishing list, or text it directly to your lumber yard to get your materials ordered.',
        disableBeacon: true,
      }
    ];
  }
  if (activeTool === 'rm') {
    return [
      {
        target: '.tour-help-trigger',
        content: "Welcome to Roofing Master! This quick walkthrough will show you how to build your material manifest.",
        placement: 'bottom',
      },
      {
        target: '.tour-roofing-geometry',
        content: "Start by selecting your calculation mode, picking a roof plane shape, and entering its dimensions. Click 'Add To Tally' when ready.",
        disableBeacon: true,
        placement: 'bottom',
      },
      {
        target: '.tour-roofing-tally',
        content: 'Your Current Planes list. As you add different sections of the roof (like dormers, gables, or valleys), they accumulate here to build your total roof geometry.',
        disableBeacon: true,
      },
      {
        target: '.tour-roofing-materials',
        content: 'Fine-tune your material specs. Adjust waste factors, select shingle and underlayment types, and enter any global valley lengths to ensure your flashing and drip edge counts are exact.',
        disableBeacon: true,
      },
      {
        target: '.tour-roofing-takeoff',
        content: 'Your complete roofing takeoff. This calculates everything from total squares, bundles, and OSB sheeting, down to the exact roll counts for ice and water shield, vents, and fasteners.',
        disableBeacon: true,
      },
      {
        target: '.tour-roofing-share',
        content: 'Save your full material manifest or share it directly with your supplier for ordering.',
        disableBeacon: true,
      }
    ];
  }
  if (activeTool === 'st') {
    return [
      {
        target: '.tour-help-trigger',
        content: "Welcome to Stair Master! Let's walk through calculating stringers, risers, and treads.",
        placement: 'bottom',
      },
      {
        target: '.tour-stair-project-type',
        content: 'Choose your project type. Select Structural for standard household stairs and decks, or Landscape for outdoor garden pathways.',
        disableBeacon: true,
        placement: 'bottom',
      },
      {
        target: '.tour-stair-rise',
        content: 'Enter the Total Rise height. This is the vertical height from the lower finished surface to the upper finished surface.',
        disableBeacon: true,
        placement: 'bottom',
      },
      {
        target: '.tour-stair-run',
        content: 'Enter the Total Run here. If left blank, the calculator automatically optimizes the run based on your project type.',
        disableBeacon: true,
        placement: 'bottom',
      },
      {
        target: '.tour-stair-materials',
        content: 'Select your Tread Material thickness and Nosing Overhang. Calculations adjust the stringer throat and riser heights automatically.',
        disableBeacon: true,
        placement: 'bottom',
      },
      {
        target: '.tour-stair-top-step',
        content: 'Toggle the Top Step Style. Choose Flush to make the top tread level with the landing, or Dropped for a step down.',
        disableBeacon: true,
        placement: 'bottom',
      },
      {
        target: '.tour-stair-output',
        content: 'Review your calculated riser height, tread width, number of risers, and total stringer run here.',
        disableBeacon: true,
        placement: 'bottom',
      },
      {
        target: '.tour-stair-diagram',
        content: 'Inspect the live field-cut stringer profile. Tap on any dimension pill to focus its input row instantly.',
        disableBeacon: true,
        placement: 'bottom',
      },
      {
        target: '.tour-stair-share',
        content: 'Save your stringer layout and material takeoffs, or share them directly with your crew or clients so everyone is on the exact same page.',
        disableBeacon: true,
        placement: 'bottom',
      }
    ];
  }
  
  if (activeTool === 'cm') {
    return [
      {
        target: '.cm-tour-beacon',
        content: 'Welcome to the Compound Miter tool! Let\'s take a quick look around.',
        title: 'Compound Miter Tour',
        disableBeacon: true,
      },
      {
        target: '.cm-tour-angles',
        content: 'Enter the exact spring angle of your crown molding and the measured angle of your wall.',
        title: 'Set Your Angles',
        disableBeacon: true,
      },
      {
        target: '.cm-tour-quick-crown',
        content: 'Working with standard 38° spring crown on a perfect 90° corner? Tap here to instantly populate the standard measurements.',
        title: 'Standard Crown Shortcut',
        disableBeacon: true,
      },
      {
        target: '.cm-tour-saw-settings',
        content: 'Here are your exact Saw Miter and Saw Bevel angles. We provide measurements for both Flat Cut (compound) and Nested Cut (upside down against the fence) methods.',
        title: 'Saw Configuration',
        disableBeacon: true,
      },
      {
        target: '.cm-tour-positioning',
        content: 'Never cut it backwards again. This cheat sheet tells you exactly how to position the board on the saw for inside and outside corners.',
        title: 'Cut Positioning Guide',
        disableBeacon: true,
      },
      {
        target: '.cm-tour-save',
        content: 'Save these cut settings to your list or share them directly with your crew.',
        title: 'Save & Share',
        disableBeacon: true,
      }
    ];
  }

  if (activeTool === 'ds') {
    return [
      {
        target: '.ds-tour-beacon',
        content: 'Welcome to Span Master! Let\'s take a quick look around.',
        title: 'Span Master Tour',
        disableBeacon: true,
      },
      {
        target: '.ds-tour-types',
        content: 'Select the type of structural member you are calculating. The parameters and math will adjust automatically based on your selection.',
        title: 'Structural Type',
        disableBeacon: true,
      },
      {
        target: '.ds-tour-materials',
        content: 'Choose your lumber species and on-center spacing. Different wood species have drastically different shear and bending strengths.',
        title: 'Material & Spacing',
        disableBeacon: true,
      },
      {
        target: '.ds-tour-params',
        content: 'Fine-tune your conditions. Adjust your acceptable deflection rating (e.g., L/360 for standard floors, L/600 for tile) and factor in cantilevers or wet use conditions.',
        title: 'Advanced Parameters',
        disableBeacon: true,
      },
      {
        target: '.ds-tour-results',
        content: 'Instantly view the maximum clear span limits for standard dimensional lumber profiles based on your exact parameters.',
        title: 'Span Limits',
        disableBeacon: true,
      },
      {
        target: '.ds-tour-save',
        content: 'Save your span calculations or share them directly with your engineer or framing crew.',
        title: 'Share & Save',
        disableBeacon: true,
      }
    ];
  }

  // Default: Return empty array for tools without a defined tour
  return [];
}

export function getProcessedTourSteps(activeTool: string) {
  const raw = getRawTourSteps(activeTool);
  return raw.map((step, idx) => {
    let targetSelector = step.target;
    if (!targetSelector.includes(' ') && !targetSelector.includes('>')) {
      targetSelector = `${step.target}, ${step.target} span, ${step.target} label, ${step.target} h3, ${step.target} button, ${step.target} input`;
    }
    return {
      ...step,
      target: targetSelector,
      placement: (step.placement === 'center' ? 'bottom' : step.placement || 'bottom') as any,
      disableBeacon: idx === 0 ? false : (step.disableBeacon ?? true),
    };
  });
}
