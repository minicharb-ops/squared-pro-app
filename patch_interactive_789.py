import re

with open("src/components/RedSeal/InteractiveBlueprint.jsx", "r") as f:
    content = f.read()

# Page 7: Attic Ventilation
old_p7 = """              {/* Ridge Board */}"""

insert_p7 = """              {/* --- ATTIC VENTILATION HOTSPOT --- */}
              <g onClick={() => onElementClick('attic-ventilation')} className="cursor-pointer group">
                <circle cx="180" cy="150" r="10" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="2,2" className="animate-spin-slow group-hover:stroke-green-400" />
                <path d="M 175 160 Q 180 145 190 145" fill="none" stroke="#10b981" strokeWidth="2" className="group-hover:stroke-green-400" />
                <path d="M 190 145 L 185 140 M 190 145 L 185 150" fill="none" stroke="#10b981" strokeWidth="2" className="group-hover:stroke-green-400" />
                <line x1="170" y1="140" x2="130" y2="120" stroke="#10b981" strokeWidth="1" className="group-hover:stroke-green-400" />
                <text x="125" y="115" fill="#10b981" fontSize="8" fontWeight="bold" textAnchor="end" className="font-mono group-hover:fill-green-400">ATTIC VENTILATION (1/300)</text>
                <rect x="20" y="100" width="180" height="70" fill="transparent" />
              </g>

"""
content = content.replace(old_p7, insert_p7 + old_p7)


# Page 8: Eaves Protection
old_p8 = """              {/* Window */}"""

insert_p8 = """              {/* --- EAVES PROTECTION HOTSPOT --- */}
              <g onClick={() => onElementClick('eaves-protection')} className="cursor-pointer group">
                <line x1="250" y1="200" x2="300" y2="164" stroke="#0ea5e9" strokeWidth="4" strokeDasharray="6,2" className="group-hover:stroke-cyan-400 animate-pulse" />
                <circle cx="275" cy="182" r="4" fill="#0ea5e9" className="group-hover:fill-cyan-400" />
                <line x1="275" y1="182" x2="220" y2="150" stroke="#0ea5e9" strokeWidth="1" className="group-hover:stroke-cyan-400" />
                <text x="215" y="145" fill="#0ea5e9" fontSize="8" fontWeight="bold" textAnchor="end" className="font-mono group-hover:fill-cyan-400">900mm EAVES PROTECTION</text>
                <rect x="80" y="130" width="220" height="80" fill="transparent" />
              </g>
              
"""
content = content.replace(old_p8, insert_p8 + old_p8)

# Page 9: Guards & Handrails
# We will just replace 'handrail-height' -> 'guards-handrails'
# and the text "865mm - 1070mm HANDRAIL (NBC 9.8.7)" -> "GUARDS & HANDRAILS"

content = content.replace("'handrail-height'", "'guards-handrails'")
content = content.replace("865mm - 1070mm HANDRAIL (NBC 9.8.7)", "GUARDS & HANDRAILS (NBC 9.8.7/8)")

with open("src/components/RedSeal/InteractiveBlueprint.jsx", "w") as f:
    f.write(content)

