import re

with open("src/components/RedSeal/InteractiveBlueprint.jsx", "r") as f:
    content = f.read()

# Page 4
old_p4 = """              {/* --- 200A MAIN SERVICE PANEL (CEC Working Clearance) --- */}
              <g onClick={() => onElementClick('electrical-panel')} className="cursor-pointer group">"""

new_p4 = """              {/* --- 200A MAIN SERVICE PANEL (CEC Working Clearance) --- */}
              <g onClick={() => onElementClick('electrical-panel')} className="cursor-pointer group">"""
              
# Actually we can insert BEFORE old_p4
insert_p4 = """              {/* --- ELECTRICAL NOTCHING / DRILLING --- */}
              <g onClick={() => onElementClick('electrical-notching')} className="cursor-pointer group">
                <circle cx="210" cy="220" r="8" fill="rgba(245, 158, 11, 0.3)" stroke="#f59e0b" strokeWidth="2" className="animate-pulse group-hover:stroke-yellow-400" />
                <circle cx="210" cy="220" r="3" fill="#f59e0b" className="group-hover:fill-yellow-400" />
                <line x1="210" y1="220" x2="160" y2="240" stroke="#f59e0b" strokeWidth="1" className="group-hover:stroke-yellow-400" />
                <text x="155" y="245" fill="#f59e0b" fontSize="8" fontWeight="bold" textAnchor="end" className="font-mono group-hover:fill-yellow-400">STUD DRILLING MAX 1/3 DEPTH</text>
                <rect x="50" y="210" width="170" height="40" fill="transparent" />
              </g>

"""

content = content.replace(old_p4, insert_p4 + old_p4)

# Page 5
old_p5 = """              {/* Cross-Bridging */}"""

insert_p5 = """              {/* --- FLOOR OPENINGS HOTSPOT --- */}
              <g onClick={() => onElementClick('floor-openings')} className="cursor-pointer group z-10">
                <rect x="156" y="270" width="85" height="120" fill="rgba(245, 158, 11, 0.2)" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4,2" className="animate-pulse group-hover:stroke-yellow-400" />
                <circle cx="198" cy="330" r="12" fill="none" stroke="#f59e0b" strokeWidth="2" className="group-hover:stroke-yellow-400" />
                <circle cx="198" cy="330" r="4" fill="#f59e0b" className="group-hover:fill-yellow-400" />
                <text x="215" y="333" fill="#f59e0b" fontSize="8" fontWeight="bold" className="font-mono group-hover:fill-yellow-400">DOUBLE HEADER / TRIMMER</text>
              </g>
              
"""

content = content.replace(old_p5, insert_p5 + old_p5)

# Page 6
old_p6 = """              {/* Building Footprint */}"""

insert_p6 = """              {/* --- SITE GRADING HOTSPOT --- */}
              <g onClick={() => onElementClick('site-grading')} className="cursor-pointer group z-10">
                <path d="M 450 150 Q 470 120 490 150" fill="none" stroke="#10b981" strokeWidth="2" className="group-hover:stroke-green-400" />
                <polygon points="490,150 485,145 495,145" fill="#10b981" className="group-hover:fill-green-400" />
                <circle cx="470" cy="135" r="3" fill="#10b981" className="group-hover:fill-green-400 animate-pulse" />
                <text x="445" y="125" fill="#10b981" fontSize="8" fontWeight="bold" textAnchor="end" className="font-mono group-hover:fill-green-400">MIN 10% SLOPE AWAY</text>
                <rect x="350" y="115" width="160" height="40" fill="transparent" />
              </g>
              
"""

content = content.replace(old_p6, insert_p6 + old_p6)


with open("src/components/RedSeal/InteractiveBlueprint.jsx", "w") as f:
    f.write(content)

