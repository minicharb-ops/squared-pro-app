with open("src/components/RedSeal/BlueprintViewer.jsx", "r") as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "{/* SYMBOLS LEGEND MODAL OVERLAY */}" in line:
        idx = i
        break

# Let's insert `)}` before the last `</div>` before idx
for i in range(idx - 1, 0, -1):
    if "</div>" in lines[i]:
        # we will insert )} here
        lines.insert(i, "          )}\n")
        break

with open("src/components/RedSeal/BlueprintViewer.jsx", "w") as f:
    f.writelines(lines)
