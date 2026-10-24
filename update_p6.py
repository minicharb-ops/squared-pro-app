import re

with open("src/components/RedSeal/InteractiveBlueprint.jsx", "r") as f:
    content = f.read()

frost_line_code = """              {/* Frost Line */}
              <g onClick={() => onElementClick('frost-line')} className="cursor-pointer group">
                <rect x="180" y="130" width="340" height="240" fill="none" stroke="#2563eb" strokeWidth="2" strokeDasharray="6,4" className="group-hover:stroke-blue-400" />
                <circle cx="520" cy="370" r="4" fill="#2563eb" className="group-hover:fill-blue-400 animate-pulse" />
                <text x="530" y="375" fill="#2563eb" fontSize="10" fontWeight="bold" className="font-mono group-hover:fill-blue-400">FROST LINE</text>
                <rect x="170" y="120" width="360" height="260" fill="transparent" stroke="transparent" strokeWidth="20" />
              </g>

              {/* --- TITLE BLOCK --- */}"""

content = content.replace("              {/* --- TITLE BLOCK --- */}", frost_line_code, 1)

with open("src/components/RedSeal/InteractiveBlueprint.jsx", "w") as f:
    f.write(content)
