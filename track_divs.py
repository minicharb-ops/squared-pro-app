with open("src/components/RedSeal/BlueprintViewer.jsx", "r") as f:
    lines = f.readlines()

open_count = 0
close_count = 0
for i, line in enumerate(lines):
    open_count += line.count("<div")
    close_count += line.count("</div")
    if close_count == open_count and open_count > 0:
        print(f"Matched at line {i+1}: {line.strip()}")
