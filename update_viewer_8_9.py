import re

with open("src/components/RedSeal/BlueprintViewer.jsx", "r") as f:
    content = f.read()

# Add to getTargetPageAndElementId
target_mapping = """    } else if (item.name === "Step Flashing") {
      targetPage = 8;
      targetElementId = "step-flashing";
    } else if (item.name === "Finished Grade Clearance") {
      targetPage = 8;
      targetElementId = "grade-clearance";
    } else if (item.name === "Window Drip Cap") {
      targetPage = 8;
      targetElementId = "window-drip-cap";
    } else if (item.name === "Headroom Clearance") {
      targetPage = 9;
      targetElementId = "headroom-clearance";
    } else if (item.name === "Stringer Attachment") {
      targetPage = 9;
      targetElementId = "stringer-attachment";
    } else if (item.name === "Handrail Height") {
      targetPage = 9;
      targetElementId = "handrail-height";"""

content = content.replace('    } else if (item.name === "Birdsmouth Cut") {\n      targetPage = 7;\n      targetElementId = "birdsmouth-cut";', target_mapping + '\n    } else if (item.name === "Birdsmouth Cut") {\n      targetPage = 7;\n      targetElementId = "birdsmouth-cut";')

# Add to handleElementClick
click_mapping = """    } else if (elementId === 'step-flashing') {
      mappedName = 'Step Flashing'
    } else if (elementId === 'grade-clearance') {
      mappedName = 'Finished Grade Clearance'
    } else if (elementId === 'window-drip-cap') {
      mappedName = 'Window Drip Cap'
    } else if (elementId === 'headroom-clearance') {
      mappedName = 'Headroom Clearance'
    } else if (elementId === 'stringer-attachment') {
      mappedName = 'Stringer Attachment'
    } else if (elementId === 'handrail-height') {
      mappedName = 'Handrail Height'"""

content = content.replace("    } else if (elementId === 'birdsmouth-cut') {\n      mappedName = 'Birdsmouth Cut'", click_mapping + "\n    } else if (elementId === 'birdsmouth-cut') {\n      mappedName = 'Birdsmouth Cut'")

# Append to LEGEND_ITEMS
legend_new_items = """  {
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
    id: "leg-119",
    category: "Stairs",
    name: "Stringer Attachment",
    code: "NBC 9.8.9",
    description: "Wooden stair stringers securely fastened. Min effective depth of 90mm.",
    svg: (isDark) => (
      <svg className="w-16 h-10 border border-slate-500/20 rounded bg-slate-500/5" viewBox="0 0 60 40">
        <circle cx="30" cy="20" r="8" fill="none" stroke="#f59e0b" strokeWidth="2" />
      </svg>
    )
  },
  {
    id: "leg-120",
    category: "Stairs",
    name: "Handrail Height",
    code: "NBC 9.8.7",
    description: "Installed between 865mm and 1070mm above the stair nosing.",
    svg: (isDark) => (
      <svg className="w-16 h-10 border border-slate-500/20 rounded bg-slate-500/5" viewBox="0 0 60 40">
        <line x1="20" y1="30" x2="40" y2="10" stroke="#3b82f6" strokeWidth="2" />
      </svg>
    )
  }"""

content = content.replace("""  {
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
  }""", """  {
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
  },\n""" + legend_new_items)

with open("src/components/RedSeal/BlueprintViewer.jsx", "w") as f:
    f.write(content)

