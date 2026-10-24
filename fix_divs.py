with open("src/components/RedSeal/BlueprintViewer.jsx", "r") as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "{/* SYMBOLS LEGEND MODAL OVERLAY */}" in line:
        legend_idx = i
        break

# count open and close BEFORE legend_idx
open_count = 0
close_count = 0
for i in range(legend_idx):
    open_count += lines[i].count("<div")
    close_count += lines[i].count("</div")

print(f"Open: {open_count}, Close: {close_count}, diff: {open_count - close_count}")
