import re

with open("src/components/RedSeal/BlueprintViewer.jsx", "r") as f:
    content = f.read()

# Replace block 1
block1 = """    if (elementId === 'window-symbol') {
      setSelectedScheduleId('W-1')
      setRightPaneTab('schedules')
    } else if (elementId === 'door-symbol') {
      setSelectedScheduleId('D-1')
      setRightPaneTab('schedules')
    } else {
      setRightPaneTab('masterclass');
    }"""
    
new_block1 = """    if (elementId === 'window-symbol') {
      setSelectedScheduleId('W-1')
    } else if (elementId === 'door-symbol') {
      setSelectedScheduleId('D-1')
    }"""

# Replace block 2
block2 = """    if (elementId === 'window-symbol') {
      setSelectedScheduleId('W-1')
      setRightPaneTab('schedules')
    } else if (elementId === 'door-symbol') {
      setSelectedScheduleId('D-1')
      setRightPaneTab('schedules')
    } else {
      setRightPaneTab('masterclass')
    }"""

content = content.replace(block1, new_block1).replace(block2, new_block1)

with open("src/components/RedSeal/BlueprintViewer.jsx", "w") as f:
    f.write(content)
