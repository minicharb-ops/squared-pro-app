with open("src/components/RedSeal/BlueprintViewer.jsx", "r") as f:
    content = f.read()

div_open = content.count("<div")
div_close = content.count("</div")

print(f"Total Open: {div_open}, Total Close: {div_close}")
