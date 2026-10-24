import re

with open("src/components/RedSeal/BlueprintViewer.jsx", "r") as f:
    content = f.read()

# notes states
content = re.sub(r"  const \[notes, setNotes\] = useState\(\{\}\)\n", "", content)
content = re.sub(r"  const \[newNoteText, setNewNoteText\] = useState\(''\)\n", "", content)
content = re.sub(r"  const \[newNoteCategory, setNewNoteCategory\] = useState\('exam'\).*?\n", "", content)
content = re.sub(r"  const \[editingNoteId, setEditingNoteId\] = useState\(null\)\n", "", content)
content = re.sub(r"  const \[editingNoteText, setEditingNoteText\] = useState\(''\)\n", "", content)

# functions
content = re.sub(r"  const handleAddNote = \(e\) => \{[\s\S]*?  \}\n\n", "", content)
content = re.sub(r"  const handleDeleteNote = \(noteId\) => \{[\s\S]*?  \}\n\n", "", content)
content = re.sub(r"  const startEditingNote = \(note\) => \{[\s\S]*?  \}\n\n", "", content)
content = re.sub(r"  const handleSaveEdit = \(noteId\) => \{[\s\S]*?  \}\n\n", "", content)
content = re.sub(r"  const insertQuickTemplate = \(text\) => \{[\s\S]*?  \}\n\n", "", content)

# currentPageNotes useMemo
content = re.sub(r"  // Get current notes for active page\n  const currentPageNotes = useMemo\(\(\) => \{[\s\S]*?  \}\, \[notes, currentPage\]\)\n\n", "", content)

with open("src/components/RedSeal/BlueprintViewer.jsx", "w") as f:
    f.write(content)
