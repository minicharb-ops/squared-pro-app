import re

with open("src/components/RedSeal/BlueprintViewer.jsx", "r") as f:
    content = f.read()

# Remove state declarations
content = re.sub(r"  const \[searchQuery, setSearchQuery\] = useState\(''\)\n", "", content)
content = re.sub(r"  const \[rightPaneTab, setRightPaneTab\] = useState\('masterclass'\).*?\n", "", content)

# Remove searchQuery from dependencies array
content = content.replace(", searchQuery]", "]")

# Remove search highlights inside SVG
# They look like:
#           {searchQuery && "footing".includes(searchQuery.toLowerCase()) && (
#             <rect x="50" y="380" width="700" height="20" fill="yellow" opacity="0.3" rx="4" />
#           )}
content = re.sub(r"\s*\{searchQuery && .*?\)\}\n", "", content)
content = re.sub(r"\s*\{searchQuery && .*?&& \([\s\S]*?\)\}\n", "", content)

with open("src/components/RedSeal/BlueprintViewer.jsx", "w") as f:
    f.write(content)
