import re

with open("src/components/RedSeal/BlueprintViewer.jsx", "r") as f:
    content = f.read()

frost_line_legend = """  {
    id: "leg-109",
    category: "Site & Survey",
    name: "Frost Line",
    code: "NBC 9.12.2",
    description: "Indicates the depth of frost penetration for the region.",
    svg: (isDark) => (
      <svg className="w-16 h-10 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 rounded" viewBox="0 0 80 40">
        <line x1="10" y1="20" x2="70" y2="20" stroke={isDark ? "#94a3b8" : "#64748b"} strokeWidth="2" strokeDasharray="4 4" />
      </svg>
    )
  },
  {
    id: "leg-109b","""

content = content.replace('  {\n    id: "leg-109",\n    category: "Site & Survey",', frost_line_legend, 1)

roof_framing_legend = """  {
    id: "leg-08",
    category: "Roof Framing",
    name: "Birdsmouth Seat Cut",
    code: "NBC 9.23.14",
    description: "The horizontal cut of a birdsmouth must provide a minimum bearing area.",
    svg: (isDark) => (
      <svg className="w-16 h-10 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 rounded" viewBox="0 0 80 40">
        <path d="M 20 30 L 40 30 L 40 15" fill="none" stroke={isDark ? "#fcd34d" : "#f59e0b"} strokeWidth="3" />
      </svg>
    )
  },
  {
    id: "leg-08b",
    category: "Roof Framing",
    name: "Roof Pitch Indicator",
    code: "NBC 9.26.2",
    description: "Standard pitch triangle indicating the slope of the roof.",
    svg: (isDark) => (
      <svg className="w-16 h-10 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 rounded" viewBox="0 0 80 40">
        <polygon points="20,30 60,30 60,10" fill="none" stroke={isDark ? "#94a3b8" : "#64748b"} strokeWidth="2" />
        <text x="40" y="25" fill={isDark ? "#94a3b8" : "#64748b"} fontSize="8">4</text>
        <text x="65" y="22" fill={isDark ? "#94a3b8" : "#64748b"} fontSize="8">12</text>
      </svg>
    )
  },
  {
    id: "leg-08c","""

content = content.replace('  {\n    id: "leg-08",', roof_framing_legend, 1)

with open("src/components/RedSeal/BlueprintViewer.jsx", "w") as f:
    f.write(content)
