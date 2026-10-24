import re

with open("src/components/RedSeal/BlueprintViewer.jsx", "r") as f:
    content = f.read()

# 1) getTargetPageAndElementId mapping
target_mapping = """    } else if (item.name === "Electrical Notching") {
      targetPage = 4;
      targetElementId = "electrical-notching";
    } else if (item.name === "Floor Opening Headers") {
      targetPage = 5;
      targetElementId = "floor-openings";
    } else if (item.name === "Site Grading") {
      targetPage = 6;
      targetElementId = "site-grading";"""

content = content.replace('    } else if (item.name === "Base Flashing") {\n      targetPage = 3;\n      targetElementId = "base-flashing";', '    } else if (item.name === "Base Flashing") {\n      targetPage = 3;\n      targetElementId = "base-flashing";\n' + target_mapping)

# 2) handleElementClick mapping
click_mapping = """    } else if (elementId === 'electrical-notching') {
      mappedName = 'Electrical Notching'
    } else if (elementId === 'floor-openings') {
      mappedName = 'Floor Opening Headers'
    } else if (elementId === 'site-grading') {
      mappedName = 'Site Grading'"""

content = content.replace("    } else if (elementId === 'base-flashing') {\n      mappedName = 'Base Flashing'", "    } else if (elementId === 'base-flashing') {\n      mappedName = 'Base Flashing'\n" + click_mapping)


# 3) Legend Data Array
legend_new_items = """  {
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
  }"""

content = content.replace("""  {
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
  }
];""", """  {
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
""" + legend_new_items + "\n];")


with open("src/components/RedSeal/BlueprintViewer.jsx", "w") as f:
    f.write(content)

