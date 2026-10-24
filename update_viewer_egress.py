import re

with open("src/components/RedSeal/BlueprintViewer.jsx", "r") as f:
    content = f.read()

# 1. Add Masterclass content
new_takeaway = """  },
  {
    title: "BEDROOM EGRESS WINDOWS",
    description: "NBC 9.9.10.1 requires every bedroom to have at least one outside window openable from the inside. It must provide an unobstructed opening of not less than 0.35 m² (3.77 sq. ft.), with no dimension less than 380mm (15\").",
    code: "NBC 9.9.10.1",
    examFocus: "Memorize the minimum dimensions for egress windows in bedrooms."
  }
];"""

content = content.replace("  }\n];", new_takeaway)

# 2. Add Legend item
legend_item_old = """  {
    id: "leg-09",
    category: "Exterior Envelope",
    name: "Window Drip Cap","""
    
legend_item_new = """  {
    id: "leg-08f",
    category: "Exterior Envelope",
    name: "Egress Window",
    code: "NBC 9.9.10.1",
    description: "Bedrooms require a window openable from the inside without keys or tools, meeting minimum area/dimension limits.",
    svg: (isDark) => (
      <svg className="w-16 h-10 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 rounded" viewBox="0 0 80 40">
        <rect x="25" y="10" width="30" height="20" fill="none" stroke={isDark ? "#f472b6" : "#ec4899"} strokeWidth="1.5" />
        <line x1="40" y1="10" x2="40" y2="30" stroke={isDark ? "#f472b6" : "#ec4899"} strokeWidth="1" />
        <line x1="25" y1="20" x2="55" y2="20" stroke={isDark ? "#f472b6" : "#ec4899"} strokeWidth="1" />
      </svg>
    )
  },
  {
    id: "leg-09",
    category: "Exterior Envelope",
    name: "Window Drip Cap","""
content = content.replace(legend_item_old, legend_item_new)

# 3. Add handleLocateSymbol mapping
locate_old = """    } else if (item.name === "Window Drip Cap") {
      targetPage = 8;
      targetElementId = "window-drip-cap";"""
      
locate_new = """    } else if (item.name === "Window Drip Cap") {
      targetPage = 8;
      targetElementId = "window-drip-cap";
    } else if (item.name === "Egress Window") {
      targetPage = 8;
      targetElementId = "egress-window";"""
content = content.replace(locate_old, locate_new)

# 4. Add mappedName mapping
name_old = """    else if (elementId === 'roof-pitch-indicator') mappedName = 'MINIMUM ROOF SLOPE';"""
name_new = """    else if (elementId === 'roof-pitch-indicator') mappedName = 'MINIMUM ROOF SLOPE';
    else if (elementId === 'egress-window') mappedName = 'BEDROOM EGRESS WINDOWS';"""
content = content.replace(name_old, name_new)

with open("src/components/RedSeal/BlueprintViewer.jsx", "w") as f:
    f.write(content)

print("Successfully updated BlueprintViewer for Egress Window.")
