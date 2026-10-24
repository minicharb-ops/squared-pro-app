with open("src/components/RedSeal/BlueprintViewer.jsx", "r") as f:
    lines = f.readlines()

# find the form closing tag
for i, line in enumerate(lines):
    if "</form>" in line:
        form_close_idx = i
        break

# find the SYMBOLS LEGEND MODAL OVERLAY
for i, line in enumerate(lines):
    if "{/* SYMBOLS LEGEND MODAL OVERLAY */}" in line:
        legend_idx = i
        break

# replace everything between form_close_idx and legend_idx
new_lines = lines[:form_close_idx + 1]
new_lines.append("          </div>\n") # close form wrapper
new_lines.append("      </div>\n\n") # close BOTTOM NAVIGATION / TABS SECTION
new_lines.extend(lines[legend_idx:])

with open("src/components/RedSeal/BlueprintViewer.jsx", "w") as f:
    f.writelines(new_lines)
