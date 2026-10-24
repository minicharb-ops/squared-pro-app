import re

with open("src/components/RedSeal/BlueprintViewer.jsx", "r") as f:
    content = f.read()

idx1 = content.find('const ALL_INTERACTIVE_TAKEAWAYS = [')
idx2 = content.find('];', idx1)

takeaways_text = content[idx1:idx2]

missing_titles = 0
# split by {
items = takeaways_text.split('{')[1:]
for item in items:
    if 'title:' not in item:
        print("Missing title in:", item[:50])
        missing_titles += 1

if missing_titles == 0:
    print("All ALL_INTERACTIVE_TAKEAWAYS have a title.")
