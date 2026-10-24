import re

with open("src/components/RedSeal/BlueprintViewer.jsx", "r") as f:
    content = f.read()

# getTargetPageAndElementId
target_mapping = """    } else if (item.name === "Load Bearing Wall") {
      targetPage = 1;
      targetElementId = "load-bearing-walls";
    } else if (item.name === "Anchor Bolts") {
      targetPage = 2;
      targetElementId = "anchor-bolts";
    } else if (item.name === "Base Flashing") {
      targetPage = 3;
      targetElementId = "base-flashing";"""

content = content.replace('    } else if (item.name === "Handrail Height") {\n      targetPage = 9;\n      targetElementId = "handrail-height";', '    } else if (item.name === "Handrail Height") {\n      targetPage = 9;\n      targetElementId = "handrail-height";\n' + target_mapping)

# handleElementClick
click_mapping = """    } else if (elementId === 'load-bearing-walls') {
      mappedName = 'Load Bearing Wall'
    } else if (elementId === 'anchor-bolts') {
      mappedName = 'Anchor Bolts'
    } else if (elementId === 'base-flashing') {
      mappedName = 'Base Flashing'"""

content = content.replace("    } else if (elementId === 'handrail-height') {\n      mappedName = 'Handrail Height'", "    } else if (elementId === 'handrail-height') {\n      mappedName = 'Handrail Height'\n" + click_mapping)


legend_new_items = """  {
    id: "leg-121",
    category: "structural",
    name: "Load Bearing Wall",
    code: "NBC Part 9",
    description: "Studs in load-bearing walls must be spaced no more than 16\\\" O.C. if supporting a floor and roof, requiring double top plates.",
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
    description: "Min 12.7mm (1/2\\\") diameter anchor bolts spaced no more than 2.4m apart, with 100mm min embedment.",
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
  }"""

content = content.replace("""  {
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
  }
];""", """  {
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
  },
""" + legend_new_items + "\n];")


with open("src/components/RedSeal/BlueprintViewer.jsx", "w") as f:
    f.write(content)

