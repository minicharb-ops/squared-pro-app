import re

with open("src/components/RedSeal/BlueprintViewer.jsx", "r") as f:
    content = f.read()

idx1 = content.find('const MOCK_FALLBACK_BLUEPRINTS = [')
idx2 = content.find('];', idx1)

mock_text = content[idx1:idx2]
print(mock_text)
