with open("src/components/RedSeal/BlueprintViewer.jsx", "r") as f:
    content = f.read()

open_braces = content.count("{")
close_braces = content.count("}")

print(f"Open: {open_braces}, Close: {close_braces}")
