with open("src/components/RedSeal/BlueprintViewer.jsx", "r") as f:
    lines = f.readlines()

depth = 0
for i, line in enumerate(lines):
    depth += line.count("{")
    depth -= line.count("}")
    if depth == 0 and i >= 748:
        print(f"Depth hit 0 at line {i+1}: {line.strip()}")
