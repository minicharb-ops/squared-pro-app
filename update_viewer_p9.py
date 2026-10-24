import re

with open("src/components/RedSeal/BlueprintViewer.jsx", "r") as f:
    content = f.read()

# 1. Add Masterclass content
new_takeaways = """  },
  {
    title: "STRINGER ATTACHMENT",
    description: "Stringers must be fully supported at the top and bottom. Top connections typically require approved framing anchors (joist hangers) or a ledger board to prevent downward sheer failure.",
    code: "NBC 9.8.9.4",
    examFocus: "Understand approved fastening methods for stair stringers."
  },
  {
    title: "STRINGER EFFECTIVE DEPTH",
    description: "When cutting open stringers, the solid, uncut portion of the lumber (effective depth) must be a minimum of 90mm (approx. 3.5\\"). This usually dictates using 2x10 or 2x12 lumber.",
    code: "NBC 9.8.9.4",
    examFocus: "Know the minimum effective depth for wooden stair stringers."
  },
  {
    title: "RISE & RUN TOLERANCES",
    description: "To prevent tripping hazards, NBC dictates strict uniformity. The variation in the dimensions of adjacent risers or adjacent treads must not exceed 5mm (3/16\\").",
    code: "NBC 9.8.4.4",
    examFocus: "Understand strict dimensional tolerances for adjacent stair treads and risers."
  }
];"""

content = content.replace("  }\n];", new_takeaways)

# 2. Add Legend items
# Let's just find `category: "Stairs"` and prepend to the first one.
legend_insert = """  {
    id: "leg-09a",
    category: "Stairs",
    name: "Stringer Header Connection",
    code: "NBC 9.8.9",
    description: "Top connections require approved framing anchors or ledger board.",
    svg: (isDark) => (
      <svg className="w-16 h-10 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 rounded" viewBox="0 0 80 40">
        <circle cx="40" cy="20" r="8" fill="none" stroke={isDark ? "#fb923c" : "#f97316"} strokeWidth="2" strokeDasharray="2,2" />
      </svg>
    )
  },
  {
    id: "leg-09b",
    category: "Stairs",
    name: "Stringer Effective Depth",
    code: "NBC 9.8.9",
    description: "Minimum 90mm solid lumber from throat to bottom edge.",
    svg: (isDark) => (
      <svg className="w-16 h-10 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 rounded" viewBox="0 0 80 40">
        <line x1="20" y1="20" x2="60" y2="20" stroke={isDark ? "#fcd34d" : "#f59e0b"} strokeWidth="3" />
        <polygon points="20,20 25,15 25,25" fill={isDark ? "#fcd34d" : "#f59e0b"} />
        <polygon points="60,20 55,15 55,25" fill={isDark ? "#fcd34d" : "#f59e0b"} />
      </svg>
    )
  },
  {
    id: "leg-09c",
    category: "Stairs",
    name: "Stair Uniformity Tolerances",
    code: "NBC 9.8.4",
    description: "Max 5mm variation between adjacent risers/treads.",
    svg: (isDark) => (
      <svg className="w-16 h-10 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 rounded" viewBox="0 0 80 40">
        <path d="M 25 30 L 25 15 L 55 15" fill="none" stroke={isDark ? "#34d399" : "#10b981"} strokeWidth="2" />
        <line x1="25" y1="15" x2="40" y2="30" stroke={isDark ? "#34d399" : "#10b981"} strokeWidth="1" strokeDasharray="2,2" />
      </svg>
    )
  },
  {
    id: "leg-11","""

# Let's first identify what stairs legends exist. Let's look at the file.
