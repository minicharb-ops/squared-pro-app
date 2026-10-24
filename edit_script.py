import re

with open("src/components/RedSeal/BlueprintViewer.jsx", "r") as f:
    content = f.read()

# Extract SIDE-BY-SIDE STUDY ANNOTATIONS PANE
start_marker = "{/* SIDE-BY-SIDE STUDY ANNOTATIONS PANE */}"
end_marker = "      {/* SYMBOLS LEGEND MODAL OVERLAY */}"
tabs_start = content.find(start_marker)
tabs_end = content.find(end_marker, tabs_start)

tabs_content = content[tabs_start:tabs_end].strip()
# Remove the last two closing divs that belong to CORE SPLIT SCREEN INTERACTIVE LAYOUT
# Tabs content ends with:
#         </div>
# 
#       </div>
# 
# We'll just split and remove the last `</div>` which is line 3342.
tabs_lines = tabs_content.split('\n')
# Pop the last </div> which belongs to CORE SPLIT SCREEN
while tabs_lines[-1].strip() == "</div>" or tabs_lines[-1].strip() == "":
    tabs_lines.pop()

# Actually let's just use regex to replace the entire section.
# We want to replace from `{/* Blueprint Canvas Container */}` to just before `{/* SYMBOLS LEGEND MODAL OVERLAY */}`

replacement = """      {/* Blueprint Canvas Container */}
      <div className="px-6 flex-1 flex flex-col min-h-0 pt-4 pb-0 overflow-hidden">
        <InteractiveBlueprint zoomLevel={zoomLevel} theme={theme} page={currentPage} onElementClick={handleElementClick} highlightedElement={highlightedElement} />
      </div>

      {/* BOTTOM NAVIGATION / TABS SECTION */}
      <div className="w-full border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex flex-col h-1/3 min-h-[250px] shrink-0">
"""

# Let's write the tabs_lines without the outer div wrapper, but with our new one
tabs_inner = '\n'.join(tabs_lines[2:]) # Skip the comment and the `<div className="w-full lg:w-1/3...`

replacement += tabs_inner + "\n      </div>\n"

# Let's find the exact block to replace
start_replace = content.find("{/* Blueprint Canvas Container */}")
end_replace = content.find("{/* SYMBOLS LEGEND MODAL OVERLAY */}")

new_content = content[:start_replace] + replacement + "\n      " + content[end_replace:]

with open("src/components/RedSeal/BlueprintViewer.jsx", "w") as f:
    f.write(new_content)

print("Done")
