import re

with open("src/components/RedSeal/BlueprintViewer.jsx", "r") as f:
    content = f.read()

idx1 = content.find('const LEGEND_ITEMS = [')
idx2 = content.find('];', idx1)

legend_text = content[idx1:idx2]

missing_names = 0
for match in re.finditer(r'id:\s*"(leg-[^"]+)"', legend_text):
    id_val = match.group(1)
    # Find the next '}' 
    next_brace = legend_text.find('}', match.end())
    item_text = legend_text[match.end():next_brace]
    if 'name:' not in item_text:
        print(f"Missing name in {id_val}")
        missing_names += 1
if missing_names == 0:
    print("All LEGEND_ITEMS have a name.")
