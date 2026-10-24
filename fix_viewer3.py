with open("src/components/RedSeal/BlueprintViewer.jsx", "r") as f:
    content = f.read()

idx1 = content.find('const MOCK_FALLBACK_BLUEPRINTS = [')
idx2 = content.find('id: "leg-101"', idx1)
# The start of the bad object is the `{` before idx2.
# Let's find the closing `];` for MOCK_FALLBACK_BLUEPRINTS.
idx3 = content.find('];\n\nexport default function BlueprintViewer', idx1)
if idx3 == -1:
    idx3 = content.find('];\nexport default function BlueprintViewer', idx1)

# Find the `{` before idx2
idx_brace = content.rfind('{', idx1, idx2)

bad_text = content[idx_brace:idx3]
print("Length of bad text:", len(bad_text))

content = content[:idx_brace] + content[idx3:]

with open("src/components/RedSeal/BlueprintViewer.jsx", "w") as f:
    f.write(content)

