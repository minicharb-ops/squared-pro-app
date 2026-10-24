import re

with open("src/components/RedSeal/BlueprintViewer.jsx", "r") as f:
    content = f.read()

# Add to getTargetPageAndElementId
target_mapping = """    } else if (item.name === "6-mil Poly Vapour Barrier") {
      targetPage = 3;
      targetElementId = "vapour-barrier";
    } else if (item.name === "OSB Nailing Pattern") {
      targetPage = 3;
      targetElementId = "osb-nailing";
    } else if (item.name === "Joist Penetration") {
      targetPage = 4;
      targetElementId = "joist-penetration";
    } else if (item.name === "Cross-Bridging") {
      targetPage = 5;
      targetElementId = "cross-bridging";"""

content = content.replace('    } else if (item.name === "Midspan Blocking") {', target_mapping + '\n    } else if (item.name === "Midspan Blocking") {')

# Add to handleElementClick
click_mapping = """    } else if (elementId === 'vapour-barrier') {
      mappedName = '6-mil Poly Vapour Barrier'
    } else if (elementId === 'osb-nailing') {
      mappedName = 'OSB Nailing Pattern'
    } else if (elementId === 'joist-penetration') {
      mappedName = 'Joist Penetration'
    } else if (elementId === 'cross-bridging') {
      mappedName = 'Cross-Bridging'"""

content = content.replace("    } else if (elementId === 'blocking-midspan') {", click_mapping + "\n    } else if (elementId === 'blocking-midspan') {")

# Append to LEGEND_ITEMS
legend_new_items = """  {
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
  }
];"""

content = content.replace("  }\n];", "  },\n" + legend_new_items)

with open("src/components/RedSeal/BlueprintViewer.jsx", "w") as f:
    f.write(content)

