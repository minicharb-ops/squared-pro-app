with open("src/components/RedSeal/BlueprintViewer.jsx", "r") as f:
    lines = f.readlines()

open_count = 0
close_count = 0
for i, line in enumerate(lines):
    open_count += line.count("<div")
    close_count += line.count("</div")
    if i >= 2750 and i <= 2780:
        print(f"Line {i+1} (depth {open_count - close_count}): {line.strip()}")
