with open("src/components/RedSeal/BlueprintViewer.jsx", "r") as f:
    content = f.read()

idx1 = content.find('title: "Sump Pit Radon Seal"')
idx2 = content.find('  }', idx1)
end_of_sump_pit = idx2 + 3

idx3 = content.find('];\n\nconst LEGEND_ITEMS = [')
if idx3 == -1:
    idx3 = content.find('];\nconst LEGEND_ITEMS = [')
if idx3 == -1:
    idx3 = content.rfind('];', 0, content.find('const LEGEND_ITEMS = ['))

bad_text = content[end_of_sump_pit:idx3]
print("Length of bad text:", len(bad_text))

content = content[:end_of_sump_pit] + "\n" + content[idx3:]

with open("src/components/RedSeal/BlueprintViewer.jsx", "w") as f:
    f.write(content)
