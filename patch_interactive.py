import re

with open("src/components/RedSeal/InteractiveBlueprint.jsx", "r") as f:
    content = f.read()

# Page 1: Load Bearing Wall
old_p1 = """              {/* Load-Bearing Core Partition */}
              <g onClick={() => onElementClick('interior-wall')} className="cursor-pointer group">"""

new_p1 = """              {/* Load-Bearing Core Partition */}
              <g onClick={() => onElementClick('load-bearing-walls')} className="cursor-pointer group">
                <circle cx="302" cy="200" r="10" fill="rgba(245, 158, 11, 0.2)" stroke="#f59e0b" strokeWidth="2" className="animate-pulse" />
                <line x1="302" y1="200" x2="340" y2="180" stroke="#f59e0b" strokeWidth="1" className="group-hover:stroke-amber-400" />"""

content = content.replace(old_p1, new_p1)

# Page 2: Anchor Bolts
# We can just insert it after Foundation Wall
old_p2 = """              {/* Foundation Wall (Thick inner outline) */}
              <rect x="150" y="140" width="400" height="260" fill="none" stroke={currentColors.stroke} strokeWidth="6" />"""

new_p2 = """              {/* Foundation Wall (Thick inner outline) */}
              <rect x="150" y="140" width="400" height="260" fill="none" stroke={currentColors.stroke} strokeWidth="6" />
              
              {/* --- SILL PLATE ANCHORAGE HOTSPOT --- */}
              <g onClick={() => onElementClick('anchor-bolts')} className="cursor-pointer group">
                <circle cx="150" cy="220" r="8" fill="rgba(245, 158, 11, 0.3)" stroke="#f59e0b" strokeWidth="2" className="animate-pulse group-hover:stroke-yellow-400" />
                <circle cx="150" cy="220" r="3" fill="#f59e0b" className="group-hover:fill-yellow-400" />
                <line x1="150" y1="220" x2="110" y2="240" stroke="#fbbf24" strokeWidth="1" className="group-hover:stroke-yellow-400" />
                <text x="105" y="245" fill="#f59e0b" fontSize="8" fontWeight="bold" textAnchor="end" className="font-mono group-hover:fill-yellow-400">SILL PLATE ANCHORAGE</text>
                <rect x="20" y="210" width="140" height="40" fill="transparent" />
              </g>"""
content = content.replace(old_p2, new_p2)

# Page 3: Base Flashing
old_p3 = """              {/* --- INTERACTIVE FOUNDATION SILL GASKET --- */}"""

new_p3 = """              {/* --- BASE FLASHING & WEEPHOLES HOTSPOT --- */}
              <g onClick={() => onElementClick('base-flashing')} className="cursor-pointer group">
                <path d="M 485 306 L 490 306 L 495 311" fill="none" stroke="#ef4444" strokeWidth="3" className="group-hover:stroke-yellow-400" />
                <circle cx="495" cy="311" r="7" fill="rgba(239, 68, 68, 0.3)" stroke="#ef4444" strokeWidth="1.5" className="animate-pulse" />
                <line x1="495" y1="311" x2="520" y2="330" stroke="#f87171" strokeWidth="1" className="group-hover:stroke-yellow-400" />
                <text x="525" y="335" fill="#ef4444" fontSize="8" fontWeight="bold" textAnchor="start" className="font-mono group-hover:fill-yellow-400">BASE FLASHING & WEEPHOLES</text>
                <rect x="475" y="295" width="150" height="45" fill="transparent" />
              </g>

              {/* --- INTERACTIVE FOUNDATION SILL GASKET --- */}"""

content = content.replace(old_p3, new_p3)

with open("src/components/RedSeal/InteractiveBlueprint.jsx", "w") as f:
    f.write(content)
