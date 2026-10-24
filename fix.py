with open("src/components/RedSeal/InteractiveBlueprint.jsx", "r") as f:
    content = f.read()

bad = """                <rect x="420" y="380" width="120" height="15" fill="transparent" />
              <g onClick={() => onElementClick('pad-footing')"""

good = """                <rect x="420" y="380" width="120" height="15" fill="transparent" />
              </g>
              <g onClick={() => onElementClick('pad-footing')"""
content = content.replace(bad, good)

with open("src/components/RedSeal/InteractiveBlueprint.jsx", "w") as f:
    f.write(content)
