import re

with open("src/components/RedSeal/BlueprintViewer.jsx", "r") as f:
    content = f.read()

# 1. Add Masterclasses (replacing the end of INTERACTIVE_TAKEAWAYS)
old_end = """    examFocus: "Memorize the minimum dimensions for egress windows in bedrooms."
  }
];

const LEGEND_ITEMS = ["""

new_end = """    examFocus: "Memorize the minimum dimensions for egress windows in bedrooms."
  },
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
];

const LEGEND_ITEMS = ["""

if old_end in content:
    content = content.replace(old_end, new_end)
    print("Added Page 9 Masterclasses")

# 2. Add Legend items
# I will replace the existing "Stringer Attachment" in LEGEND_ITEMS with the three new ones.
old_legend = """  {
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
  },"""

new_legend = """  {
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
  },"""

if old_legend in content:
    content = content.replace(old_legend, new_legend)
    print("Added Page 9 Legend items")

# 3. Add to handleLocateSymbol and mappedName
old_locate = """    } else if (item.name === "Stringer Attachment") {
      targetPage = 9;
      targetElementId = "stringer-attachment";"""

new_locate = """    } else if (item.name === "Stringer Header Connection") {
      targetPage = 9;
      targetElementId = "stringer-top-connection";
    } else if (item.name === "Stringer Effective Depth") {
      targetPage = 9;
      targetElementId = "effective-depth";
    } else if (item.name === "Stair Uniformity Tolerances") {
      targetPage = 9;
      targetElementId = "stair-tolerances";"""

if old_locate in content:
    content = content.replace(old_locate, new_locate)
    print("Added Page 9 handleLocateSymbol mappings")

old_name = """    else if (elementId === 'egress-window') mappedName = 'BEDROOM EGRESS WINDOWS';"""

new_name = """    else if (elementId === 'egress-window') mappedName = 'BEDROOM EGRESS WINDOWS';
    else if (elementId === 'stringer-top-connection') mappedName = 'STRINGER ATTACHMENT';
    else if (elementId === 'effective-depth') mappedName = 'STRINGER EFFECTIVE DEPTH';
    else if (elementId === 'stair-tolerances') mappedName = 'RISE & RUN TOLERANCES';"""

if old_name in content:
    content = content.replace(old_name, new_name)
    print("Added Page 9 mappedName mappings")

with open("src/components/RedSeal/BlueprintViewer.jsx", "w") as f:
    f.write(content)

