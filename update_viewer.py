import re

with open("src/components/RedSeal/BlueprintViewer.jsx", "r") as f:
    content = f.read()

# Add to getTargetPageAndElementId
target_mapping = """    } else if (item.name === "Cross-Bridging") {
      targetPage = 5;
      targetElementId = "cross-bridging";
    } else if (item.name === "Batter Boards") {
      targetPage = 6;
      targetElementId = "batter-boards";
    } else if (item.name === "Building Setback") {
      targetPage = 6;
      targetElementId = "building-setback";
    } else if (item.name === "Benchmark Elevation") {
      targetPage = 6;
      targetElementId = "benchmark-elevation";
    } else if (item.name === "Ridge Board") {
      targetPage = 7;
      targetElementId = "ridge-board";
    } else if (item.name === "Collar Ties") {
      targetPage = 7;
      targetElementId = "collar-ties";
    } else if (item.name === "Birdsmouth Cut") {
      targetPage = 7;
      targetElementId = "birdsmouth-cut";"""

content = content.replace('    } else if (item.name === "Cross-Bridging") {\n      targetPage = 5;\n      targetElementId = "cross-bridging";', target_mapping)

# Add to handleElementClick
click_mapping = """    } else if (elementId === 'cross-bridging') {
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
    } else if (elementId === 'birdsmouth-cut') {
      mappedName = 'Birdsmouth Cut'"""

content = content.replace("    } else if (elementId === 'cross-bridging') {\n      mappedName = 'Cross-Bridging'", click_mapping)

# Append to LEGEND_ITEMS
legend_new_items = """  {
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
  }"""

content = content.replace("""  {
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
  }""", legend_new_items)

with open("src/components/RedSeal/BlueprintViewer.jsx", "w") as f:
    f.write(content)

