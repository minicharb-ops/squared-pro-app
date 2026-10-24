import re

with open("src/components/RedSeal/BlueprintViewer.jsx", "r") as f:
    content = f.read()

new_mappings = """    } else if (item.name === "Frost Line") {
      targetPage = 6;
      targetElementId = "frost-line";
    } else if (item.name === "Roof Pitch Indicator") {
      targetPage = 7;
      targetElementId = "roof-pitch-indicator";
    } else if (item.name === "Birdsmouth Seat Cut") {
      targetPage = 7;
      targetElementId = "birdsmouth-cut";"""

content = content.replace('    } else if (item.name === "Birdsmouth Cut") {\n      targetPage = 7;\n      targetElementId = "birdsmouth-cut";', new_mappings, 1)


name_mappings_old = """    else if (elementId === 'joist-hanger') mappedName = 'Metal Joist Hangers';"""
name_mappings_new = """    else if (elementId === 'joist-hanger') mappedName = 'Metal Joist Hangers';
    else if (elementId === 'frost-line') mappedName = 'FROST DEPTH FOUNDATIONS';
    else if (elementId === 'birdsmouth-cut') mappedName = 'BIRDSMOUTH BEARING';
    else if (elementId === 'roof-pitch-indicator') mappedName = 'MINIMUM ROOF SLOPE';"""

content = content.replace(name_mappings_old, name_mappings_new, 1)

with open("src/components/RedSeal/BlueprintViewer.jsx", "w") as f:
    f.write(content)
