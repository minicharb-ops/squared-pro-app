with open("src/components/RedSeal/BlueprintViewer.jsx", "r") as f:
    lines = f.readlines()

open_braces = 0
close_braces = 0
for i, line in enumerate(lines):
    open_braces += line.count("{")
    close_braces += line.count("}")
    if close_braces > open_braces:
        print(f"Extra closing brace at line {i+1}: {line.strip()}")
        break
