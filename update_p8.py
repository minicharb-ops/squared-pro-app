import re

with open("src/components/RedSeal/InteractiveBlueprint.jsx", "r") as f:
    content = f.read()

egress_window_code = """              {/* Window Drip Cap Hotspot */}
              <g onClick={() => onElementClick('window-drip-cap')} className="cursor-pointer group">
                <rect x="345" y="247" width="90" height="4" fill="#3b82f6" className="group-hover:fill-yellow-400" />
                <line x1="390" y1="247" x2="390" y2="220" stroke="#60a5fa" strokeWidth="1" className="group-hover:stroke-yellow-400" />
                <text x="390" y="215" fill="#3b82f6" fontSize="9" fontWeight="bold" textAnchor="middle" className="font-mono group-hover:fill-yellow-400">DRIP CAP FLASHING (NBC 9.27.3.8)</text>
                <rect x="300" y="205" width="180" height="50" fill="transparent" />
              </g>

              {/* Egress Window Hotspot */}
              <g onClick={() => onElementClick('egress-window')} className="cursor-pointer group">
                <circle cx="390" cy="290" r="15" fill="none" stroke="#ec4899" strokeWidth="2" strokeDasharray="3,3" className="group-hover:stroke-pink-400 animate-spin-slow" />
                <circle cx="390" cy="290" r="4" fill="#ec4899" className="group-hover:fill-pink-400 animate-pulse" />
                <line x1="405" y1="290" x2="440" y2="290" stroke="#ec4899" strokeWidth="1" className="group-hover:stroke-pink-400" />
                <text x="445" y="293" fill="#ec4899" fontSize="9" fontWeight="bold" textAnchor="start" className="font-mono group-hover:fill-pink-400">EGRESS WINDOW</text>
                <rect x="375" y="275" width="160" height="30" fill="transparent" />
              </g>"""

# Find the exact string to replace
old_drip_cap_code = """              {/* Window Drip Cap Hotspot */}
              <g onClick={() => onElementClick('window-drip-cap')} className="cursor-pointer group">
                <rect x="345" y="247" width="90" height="4" fill="#3b82f6" className="group-hover:fill-yellow-400" />
                <line x1="390" y1="247" x2="390" y2="220" stroke="#60a5fa" strokeWidth="1" className="group-hover:stroke-yellow-400" />
                <text x="390" y="215" fill="#3b82f6" fontSize="9" fontWeight="bold" textAnchor="middle" className="font-mono group-hover:fill-yellow-400">DRIP CAP FLASHING (NBC 9.27.3.8)</text>
                <rect x="300" y="205" width="180" height="50" fill="transparent" />
              </g>"""

if old_drip_cap_code in content:
    content = content.replace(old_drip_cap_code, egress_window_code)
    with open("src/components/RedSeal/InteractiveBlueprint.jsx", "w") as f:
        f.write(content)
    print("Successfully added egress window hotspot.")
else:
    print("Could not find the target code block.")
