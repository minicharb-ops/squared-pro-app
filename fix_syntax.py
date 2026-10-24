with open("src/components/RedSeal/BlueprintViewer.jsx", "r") as f:
    content = f.read()

content = content.replace("  }  },", "  },")

with open("src/components/RedSeal/BlueprintViewer.jsx", "w") as f:
    f.write(content)
