import re

with open("src/components/RedSeal/BlueprintViewer.jsx", "r") as f:
    content = f.read()

old_tabs = """                  {[
                    { id: 'all', label: 'All' },
                    { id: 'general', label: 'General' },
                    { id: 'Site & Survey', label: 'Site & Survey' },
                    { id: 'structural', label: 'Structural' },
                    { id: 'Roof Framing', label: 'Roof Framing' },
                    { id: 'envelope', label: 'Envelope' },
                    { id: 'plumbing', label: 'Plumbing' },
                    { id: 'elevation', label: 'Elevations' },
                    { id: 'electrical', label: 'Electrical' }
                  ].map((tab) => ("""

new_tabs = """                  {[
                    { id: 'all', label: 'All' },
                    { id: 'general', label: 'General' },
                    { id: 'Site & Survey', label: 'Site & Survey' },
                    { id: 'structural', label: 'Structural' },
                    { id: 'Roof Framing', label: 'Roof Framing' },
                    { id: 'envelope', label: 'Envelope' },
                    { id: 'Exterior Envelope', label: 'Ext. Envelope' },
                    { id: 'plumbing', label: 'Plumbing' },
                    { id: 'electrical', label: 'Electrical' },
                    { id: 'Stairs', label: 'Stairs' }
                  ].map((tab) => ("""

content = content.replace(old_tabs, new_tabs)

with open("src/components/RedSeal/BlueprintViewer.jsx", "w") as f:
    f.write(content)
