import re

with open("src/components/RedSeal/BlueprintViewer.jsx", "r") as f:
    content = f.read()

# Add to getTargetPageAndElementId
target_mapping = """    } else if (item.name === "Rough Opening (R.O.)") {
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
      targetElementId = "damp-proofing";"""

content = content.replace('    } else if (item.name === "Elevation Marker") {', target_mapping + '\n    } else if (item.name === "Elevation Marker") {')

# Add to handleElementClick
click_mapping = """    } else if (elementId === 'window-rough-opening') {
      mappedName = 'Window Rough Opening'
    } else if (elementId === 'stair-rise-run') {
      mappedName = 'Stair Rise & Run'
    } else if (elementId === 'rebar-spacing') {
      mappedName = 'Rebar Spacing'
    } else if (elementId === 'damp-proofing') {
      mappedName = 'Damp-proofing'"""

content = content.replace("    } else if (elementId === 'elevation-marker') {", click_mapping + "\n    } else if (elementId === 'elevation-marker') {")

# Append to LEGEND_ITEMS
legend_new_items = """  {
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
  }
];"""

content = content.replace("  }\n];", "  },\n" + legend_new_items)

with open("src/components/RedSeal/BlueprintViewer.jsx", "w") as f:
    f.write(content)

