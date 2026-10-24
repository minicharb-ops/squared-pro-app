import re

with open("src/components/RedSeal/BlueprintViewer.jsx", "r") as f:
    content = f.read()

idx1 = content.find('const LEGEND_ITEMS = [')
idx2 = content.find('];', idx1)

legend_text = content[idx1:idx2]

missing = 0
for match in re.finditer(r'id:\s*"(leg-[^"]+)"', legend_text):
    id_val = match.group(1)
    next_brace = legend_text.find('}', match.end())
    item_text = legend_text[match.end():next_brace]
    if 'description:' not in item_text:
        print(f"Missing description in {id_val}")
        missing += 1
    if 'code:' not in item_text:
        print(f"Missing code in {id_val}")
        missing += 1

if missing == 0:
    print("All LEGEND_ITEMS have a description and code.")
