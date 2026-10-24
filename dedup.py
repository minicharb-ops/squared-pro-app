import re

with open("src/components/RedSeal/BlueprintViewer.jsx", "r") as f:
    content = f.read()

# We need to find the start of LEGEND_ITEMS and its end.
idx_start = content.find('const LEGEND_ITEMS = [')
idx_end = content.find('];', idx_start)

legend_text = content[idx_start:idx_end+2]

# Let's parse all items. This is hard to do cleanly without a JS parser.
# Alternative: we can use regex to split items by `{` and `}` but there are SVGs with `{` and `}` inside.
# Better way: replace the entire LEGEND_ITEMS array with the unique ones or just strip the redundant chunk.
