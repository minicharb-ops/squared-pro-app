import re

with open("src/components/RedSeal/BlueprintViewer.jsx", "r") as f:
    content = f.read()

# notes states and effects
content = re.sub(r"  const \[notes, setNotes\] = useState\(\(\) => \{[\s\S]*?  \}\)\n", "", content)
content = re.sub(r"  // Sync notes to local storage\n  useEffect\(\(\) => \{[\s\S]*?  \}, \[notes\]\)\n", "", content)

with open("src/components/RedSeal/BlueprintViewer.jsx", "w") as f:
    f.write(content)
