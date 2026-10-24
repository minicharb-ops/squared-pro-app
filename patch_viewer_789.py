import re

with open("src/components/RedSeal/BlueprintViewer.jsx", "r") as f:
    content = f.read()

# 1) getTargetPageAndElementId mapping
target_mapping = """    } else if (item.name === "Attic Ventilation") {
      targetPage = 7;
      targetElementId = "attic-ventilation";
    } else if (item.name === "Eaves Protection") {
      targetPage = 8;
      targetElementId = "eaves-protection";
    } else if (item.name === "Guard & Handrail Height") {
      targetPage = 9;
      targetElementId = "guards-handrails";"""

content = content.replace('    } else if (item.name === "Site Grading") {\n      targetPage = 6;\n      targetElementId = "site-grading";', '    } else if (item.name === "Site Grading") {\n      targetPage = 6;\n      targetElementId = "site-grading";\n' + target_mapping)

# Remove old handrail-height mapping if it exists
content = re.sub(r'\s*} else if \(item\.name === "Handrail Height"\) \{\s*targetPage = 9;\s*targetElementId = "handrail-height";', '', content)


# 2) handleElementClick mapping
click_mapping = """    } else if (elementId === 'attic-ventilation') {
      mappedName = 'Attic Ventilation'
    } else if (elementId === 'eaves-protection') {
      mappedName = 'Eaves Protection'
    } else if (elementId === 'guards-handrails') {
      mappedName = 'Guard & Handrail Height'"""

content = content.replace("    } else if (elementId === 'site-grading') {\n      mappedName = 'Site Grading'", "    } else if (elementId === 'site-grading') {\n      mappedName = 'Site Grading'\n" + click_mapping)

# Remove old handrail-height click mapping if it exists
content = re.sub(r"\s*\} else if \(elementId === 'handrail-height'\) \{\s*mappedName = 'Handrail Height'", "", content)


# 3) Legend Data Array
# Find "Handrail Height" in LEGEND_ITEMS and replace it with "Guard & Handrail Height"
# We'll just replace the whole leg-120 item or append new ones.

legend_new_items = """  {
    id: "leg-127",
    category: "Roof Framing",
    name: "Attic Ventilation",
    code: "NBC 9.19.1",
    description: "Net free venting area must be at least 1/300 of the insulated ceiling area, distributed between eaves and ridge.",
    svg: (isDark) => (
      <svg className="w-16 h-10 border border-slate-500/20 rounded bg-slate-500/5" viewBox="0 0 60 40">
        <path d="M 15 25 Q 30 10 45 25" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="2,2" />
      </svg>
    )
  },
  {
    id: "leg-128",
    category: "Exterior Envelope",
    name: "Eaves Protection",
    code: "NBC 9.26.5",
    description: "Ice and water shield must extend from edge of roof to a line not less than 900mm up the roof slope.",
    svg: (isDark) => (
      <svg className="w-16 h-10 border border-slate-500/20 rounded bg-slate-500/5" viewBox="0 0 60 40">
        <line x1="10" y1="30" x2="40" y2="10" stroke="#0ea5e9" strokeWidth="4" strokeDasharray="6,2" />
      </svg>
    )
  },
  {
    id: "leg-129",
    category: "Stairs",
    name: "Guard & Handrail Height",
    code: "NBC 9.8.7/8",
    description: "Handrails required if >2 risers. Guards must be min 900mm high, or 1070mm if drop exceeds 10m.",
    svg: (isDark) => (
      <svg className="w-16 h-10 border border-slate-500/20 rounded bg-slate-500/5" viewBox="0 0 60 40">
        <line x1="20" y1="30" x2="40" y2="10" stroke="#3b82f6" strokeWidth="2" />
        <line x1="40" y1="10" x2="40" y2="25" stroke="#3b82f6" strokeWidth="1" />
      </svg>
    )
  }"""

# Remove old leg-120 (Handrail Height) if it exists.
# We will use regex to find and remove it.
old_handrail_regex = r'\s*\{\s*id: "leg-120",\s*category: "Stairs",\s*name: "Handrail Height",[\s\S]*?\}\s*,'
content = re.sub(old_handrail_regex, '', content)

# But wait, leg-120 might be the last item, meaning no trailing comma. Let's handle both.
old_handrail_regex_end = r'\s*\{\s*id: "leg-120",\s*category: "Stairs",\s*name: "Handrail Height",[\s\S]*?\}\s*\];'
content = re.sub(old_handrail_regex_end, '\n];', content)

# Then we insert the new items right before `\n];`
content = content.replace("\n];", ",\n" + legend_new_items + "\n];")


# Add the new tabs if not present
old_tabs = """                  {[
                    { id: 'all', label: 'All Symbols' },
                    { id: 'general', label: 'General / Ref' },
                    { id: 'structural', label: 'Structural' },
                    { id: 'elevation', label: 'Elevations' },
                    { id: 'electrical', label: 'Electrical' },
                    { id: 'MEP', label: 'MEP' },
                    { id: 'Framing', label: 'Framing' },
                    { id: 'Site & Survey', label: 'Site & Survey' }
                  ].map((tab) => ("""

new_tabs = """                  {[
                    { id: 'all', label: 'All Symbols' },
                    { id: 'general', label: 'General / Ref' },
                    { id: 'structural', label: 'Structural' },
                    { id: 'elevation', label: 'Elevations' },
                    { id: 'electrical', label: 'Electrical' },
                    { id: 'MEP', label: 'MEP' },
                    { id: 'Framing', label: 'Framing' },
                    { id: 'Site & Survey', label: 'Site & Survey' },
                    { id: 'Roof Framing', label: 'Roof Framing' },
                    { id: 'Exterior Envelope', label: 'Exterior Envelope' },
                    { id: 'Stairs', label: 'Stairs' }
                  ].map((tab) => ("""

content = content.replace(old_tabs, new_tabs)

with open("src/components/RedSeal/BlueprintViewer.jsx", "w") as f:
    f.write(content)

