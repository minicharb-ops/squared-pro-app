import re

with open("src/components/RedSeal/BlueprintViewer.jsx", "r") as f:
    content = f.read()

old_tabs = """                  {[
                    { id: 'all', label: 'All Symbols' },
                    { id: 'general', label: 'General / Ref' },
                    { id: 'structural', label: 'Structural' },
                    { id: 'elevation', label: 'Elevations' },
                    { id: 'electrical', label: 'Electrical' }
                  ].map((tab) => ("""

new_tabs = """                  {[
                    { id: 'all', label: 'All Symbols' },
                    { id: 'general', label: 'General / Ref' },
                    { id: 'structural', label: 'Structural' },
                    { id: 'elevation', label: 'Elevations' },
                    { id: 'electrical', label: 'Electrical' },
                    { id: 'MEP', label: 'MEP' },
                    { id: 'Framing', label: 'Framing' },
                    { id: 'Site & Survey', label: 'Site & Survey' }
                  ].map((tab) => ("""

if old_tabs in content:
    content = content.replace(old_tabs, new_tabs)
else:
    print("WARNING: Could not find tabs to replace")

with open("src/components/RedSeal/BlueprintViewer.jsx", "w") as f:
    f.write(content)
