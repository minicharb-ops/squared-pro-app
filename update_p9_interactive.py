import re

with open("src/components/RedSeal/InteractiveBlueprint.jsx", "r") as f:
    content = f.read()

old_hotspot = """              {/* Stringer Attachment Hotspot */}
              <g onClick={() => onElementClick('stringer-attachment')} className="cursor-pointer group">
                <circle cx="250" cy="170" r="15" fill="none" stroke="#f59e0b" strokeWidth="2" className="group-hover:stroke-yellow-400" />
                <line x1="250" y1="170" x2="200" y2="210" stroke="#fbbf24" strokeWidth="1" className="group-hover:stroke-yellow-400" />
                <text x="195" y="215" fill="#f59e0b" fontSize="9" fontWeight="bold" textAnchor="end" className="font-mono group-hover:fill-yellow-400">STRINGER FASTENING & EFF. DEPTH (NBC 9.8.9)</text>
                <rect x="20" y="150" width="250" height="70" fill="transparent" />
              </g>"""

new_hotspots = """              {/* Stringer Top Connection Hotspot */}
              <g onClick={() => onElementClick('stringer-top-connection')} className="cursor-pointer group">
                <circle cx="250" cy="160" r="15" fill="none" stroke="#f97316" strokeWidth="2" strokeDasharray="3,3" className="group-hover:stroke-orange-400 animate-spin-slow" />
                <line x1="235" y1="160" x2="180" y2="160" stroke="#f97316" strokeWidth="1" className="group-hover:stroke-orange-400" />
                <text x="175" y="163" fill="#f97316" fontSize="9" fontWeight="bold" textAnchor="end" className="font-mono group-hover:fill-orange-400">HEADER CONNECTION</text>
                <rect x="50" y="140" width="220" height="40" fill="transparent" />
              </g>

              {/* Effective Depth Hotspot */}
              <g onClick={() => onElementClick('effective-depth')} className="cursor-pointer group">
                <line x1="300" y1="210" x2="265" y2="215" stroke="#f59e0b" strokeWidth="2" className="group-hover:stroke-yellow-400" />
                <polygon points="300,210 293,207 295,214" fill="#f59e0b" className="group-hover:fill-yellow-400" />
                <polygon points="265,215 272,218 270,211" fill="#f59e0b" className="group-hover:fill-yellow-400" />
                <line x1="282" y1="212" x2="200" y2="240" stroke="#f59e0b" strokeWidth="1" className="group-hover:stroke-yellow-400" />
                <text x="195" y="243" fill="#f59e0b" fontSize="9" fontWeight="bold" textAnchor="end" className="font-mono group-hover:fill-yellow-400">MIN 90mm EFF. DEPTH</text>
                <rect x="50" y="200" width="260" height="60" fill="transparent" />
              </g>

              {/* Rise & Run Tolerances Hotspot */}
              <g onClick={() => onElementClick('stair-tolerances')} className="cursor-pointer group">
                <line x1="350" y1="270" x2="350" y2="240" stroke="#10b981" strokeWidth="2" className="group-hover:stroke-green-400" />
                <line x1="325" y1="240" x2="350" y2="240" stroke="#10b981" strokeWidth="2" className="group-hover:stroke-green-400" />
                
                <line x1="325" y1="240" x2="325" y2="210" stroke="#10b981" strokeWidth="2" strokeDasharray="2,2" className="group-hover:stroke-green-400" />
                <line x1="300" y1="210" x2="325" y2="210" stroke="#10b981" strokeWidth="2" strokeDasharray="2,2" className="group-hover:stroke-green-400" />

                <line x1="337" y1="240" x2="280" y2="300" stroke="#10b981" strokeWidth="1" className="group-hover:stroke-green-400" />
                <text x="275" y="303" fill="#10b981" fontSize="9" fontWeight="bold" textAnchor="end" className="font-mono group-hover:fill-green-400">MAX 5mm VARIATION</text>
                <rect x="100" y="230" width="280" height="90" fill="transparent" />
              </g>"""

if old_hotspot in content:
    content = content.replace(old_hotspot, new_hotspots)
    with open("src/components/RedSeal/InteractiveBlueprint.jsx", "w") as f:
        f.write(content)
    print("Replaced InteractiveBlueprint.jsx hotspots successfully")
else:
    print("Failed to find old hotspot in InteractiveBlueprint.jsx")
