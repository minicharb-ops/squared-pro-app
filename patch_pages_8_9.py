import re

with open("src/components/RedSeal/InteractiveBlueprint.jsx", "r") as f:
    content = f.read()

page8_9 = """          {/* ================= PAGE 8: EXTERIOR ELEVATION ================= */}
          {page === 8 && (
            <g>
              {/* --- EXTERIOR ELEVATION GEOMETRY --- */}
              
              {/* House Outline */}
              <g stroke={currentColors.stroke} strokeWidth="2" fill="none">
                <rect x="250" y="200" width="300" height="180" />
                <polygon points="250,200 400,100 550,200" />
                <line x1="220" y1="200" x2="580" y2="200" /> {/* Eaves */}
              </g>

              {/* Siding Lines */}
              <g stroke={currentColors.stroke} strokeWidth="0.5" opacity="0.3">
                {Array.from({ length: 18 }).map((_, i) => (
                  <line key={`siding-${i}`} x1="250" y1={210 + i * 10} x2="550" y2={210 + i * 10} />
                ))}
              </g>

              {/* Window */}
              <g stroke={currentColors.stroke} strokeWidth="1.5">
                <rect x="350" y="250" width="80" height="80" fill={theme === 'light-print' ? '#f8fafc' : 'rgba(56, 189, 248, 0.1)'} />
                <rect x="355" y="255" width="70" height="70" fill="none" />
                <line x1="390" y1="255" x2="390" y2="325" />
                <line x1="355" y1="290" x2="425" y2="290" />
              </g>

              {/* Roof Shingles */}
              <g stroke={currentColors.stroke} strokeWidth="0.5" opacity="0.4">
                <path d="M 255 195 L 395 105" />
                <path d="M 265 195 L 395 110" />
                <path d="M 275 195 L 395 115" />
                
                <path d="M 545 195 L 405 105" />
                <path d="M 535 195 L 405 110" />
                <path d="M 525 195 L 405 115" />
              </g>

              {/* Secondary Roof / Dormer to show step flashing */}
              <g stroke={currentColors.stroke} strokeWidth="1.5" fill="none">
                <polygon points="250,260 200,260 250,230" fill={theme === 'light-print' ? '#ffffff' : '#1e293b'} />
                <rect x="200" y="260" width="50" height="120" />
              </g>

              {/* Finished Grade Line */}
              <g>
                <line x1="150" y1="380" x2="650" y2="380" stroke="#10b981" strokeWidth="4" />
                <text x="180" y="370" fill="#10b981" fontSize="12" fontWeight="bold">FINISHED GRADE</text>
              </g>

              {/* Step Flashing Hotspot */}
              <g onClick={() => onElementClick('step-flashing')} className="cursor-pointer group">
                <path d="M 245 260 L 255 260 L 255 250 M 255 250 L 265 250" fill="none" stroke="#ef4444" strokeWidth="3" className="group-hover:stroke-yellow-400" />
                <circle cx="250" cy="250" r="10" fill="rgba(239, 68, 68, 0.2)" stroke="#ef4444" strokeWidth="1.5" className="animate-pulse" />
                <line x1="250" y1="250" x2="200" y2="200" stroke="#f87171" strokeWidth="1" className="group-hover:stroke-yellow-400" />
                <text x="195" y="195" fill="#ef4444" fontSize="10" fontWeight="bold" textAnchor="end" className="font-mono group-hover:fill-yellow-400">STEP FLASHING (NBC 9.26.4)</text>
                <rect x="80" y="185" width="180" height="75" fill="transparent" />
              </g>

              {/* Finished Grade Clearance Hotspot */}
              <g onClick={() => onElementClick('grade-clearance')} className="cursor-pointer group">
                <line x1="280" y1="380" x2="280" y2="360" stroke="#f59e0b" strokeWidth="3" className="group-hover:stroke-yellow-400" />
                <polygon points="280,360 275,365 285,365" fill="#f59e0b" className="group-hover:fill-yellow-400" />
                <polygon points="280,380 275,375 285,375" fill="#f59e0b" className="group-hover:fill-yellow-400" />
                <line x1="280" y1="370" x2="230" y2="370" stroke="#fbbf24" strokeWidth="1" className="group-hover:stroke-yellow-400" />
                <text x="225" y="373" fill="#f59e0b" fontSize="8" fontWeight="bold" textAnchor="end" className="font-mono group-hover:fill-yellow-400">MIN 200mm CLEARANCE (NBC 9.27.2.4)</text>
                <rect x="80" y="355" width="220" height="30" fill="transparent" />
              </g>

              {/* Window Drip Cap Hotspot */}
              <g onClick={() => onElementClick('window-drip-cap')} className="cursor-pointer group">
                <rect x="345" y="247" width="90" height="4" fill="#3b82f6" className="group-hover:fill-yellow-400" />
                <line x1="390" y1="247" x2="390" y2="220" stroke="#60a5fa" strokeWidth="1" className="group-hover:stroke-yellow-400" />
                <text x="390" y="215" fill="#3b82f6" fontSize="9" fontWeight="bold" textAnchor="middle" className="font-mono group-hover:fill-yellow-400">DRIP CAP FLASHING (NBC 9.27.3.8)</text>
                <rect x="300" y="205" width="180" height="50" fill="transparent" />
              </g>

              {/* --- TITLE BLOCK --- */}
              <g onClick={() => onElementClick('title-block')} className="cursor-pointer group transition-all">
                <rect x="520" y="420" width="260" height="160" fill="rgba(255,255,255,0.05)" stroke={currentColors.stroke} strokeWidth="2" className="group-hover:fill-blue-500/40" />
                <text x="535" y="450" fill={currentColors.fill} fontSize="18" fontWeight="bold">PROJECT: RSR-2026</text>
                <text x="535" y="475" fill={currentColors.fill} fontSize="14">DWG: A3.1 - FRONT ELEV</text>
                <text x="535" y="500" fill={currentColors.fill} fontSize="14">SCALE: 1/4" = 1'-0"</text>
              </g>
            </g>
          )}

          {/* ================= PAGE 9: DEDICATED STAIR SECTION ================= */}
          {page === 9 && (
            <g>
              {/* --- STAIR GEOMETRY --- */}
              <g stroke={currentColors.stroke} strokeWidth="2" fill="none">
                {/* Upper Floor */}
                <line x1="100" y1="150" x2="250" y2="150" />
                <line x1="250" y1="150" x2="250" y2="170" />
                <line x1="250" y1="170" x2="100" y2="170" />
                
                {/* Lower Floor */}
                <line x1="450" y1="400" x2="600" y2="400" />
                <line x1="450" y1="400" x2="450" y2="420" />
                <line x1="450" y1="420" x2="600" y2="420" />

                {/* Stringer & Treads/Risers */}
                <path d="M 250 150 L 275 150 L 275 180 L 300 180 L 300 210 L 325 210 L 325 240 L 350 240 L 350 270 L 375 270 L 375 300 L 400 300 L 400 330 L 425 330 L 425 360 L 450 360 L 450 400 L 410 400 L 230 170 Z" />
                
                {/* Handrail */}
                <line x1="250" y1="50" x2="450" y2="290" strokeWidth="4" />
                <line x1="275" y1="150" x2="275" y2="80" strokeWidth="1" />
                <line x1="350" y1="240" x2="350" y2="170" strokeWidth="1" />
                <line x1="425" y1="330" x2="425" y2="260" strokeWidth="1" />
              </g>

              {/* Ceiling / Header above stairs */}
              <g stroke={currentColors.stroke} strokeWidth="2" fill="none">
                <line x1="320" y1="50" x2="500" y2="50" />
                <line x1="320" y1="50" x2="320" y2="70" />
                <line x1="320" y1="70" x2="500" y2="70" />
                <rect x="310" y="50" width="10" height="20" fill={currentColors.stroke} /> {/* Header */}
              </g>

              {/* Headroom Clearance Hotspot */}
              <g onClick={() => onElementClick('headroom-clearance')} className="cursor-pointer group">
                <line x1="320" y1="70" x2="320" y2="204" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,5" className="group-hover:stroke-yellow-400" />
                <polygon points="320,70 315,80 325,80" fill="#ef4444" className="group-hover:fill-yellow-400" />
                <polygon points="320,204 315,194 325,194" fill="#ef4444" className="group-hover:fill-yellow-400" />
                <line x1="320" y1="137" x2="400" y2="137" stroke="#f87171" strokeWidth="1" className="group-hover:stroke-yellow-400" />
                <text x="405" y="140" fill="#ef4444" fontSize="10" fontWeight="bold" textAnchor="start" className="font-mono group-hover:fill-yellow-400">MIN 1950mm HEADROOM (NBC 9.8.2)</text>
                <rect x="300" y="60" width="280" height="150" fill="transparent" />
              </g>

              {/* Stringer Attachment Hotspot */}
              <g onClick={() => onElementClick('stringer-attachment')} className="cursor-pointer group">
                <circle cx="250" cy="170" r="15" fill="none" stroke="#f59e0b" strokeWidth="2" className="group-hover:stroke-yellow-400" />
                <line x1="250" y1="170" x2="200" y2="210" stroke="#fbbf24" strokeWidth="1" className="group-hover:stroke-yellow-400" />
                <text x="195" y="215" fill="#f59e0b" fontSize="9" fontWeight="bold" textAnchor="end" className="font-mono group-hover:fill-yellow-400">STRINGER FASTENING & EFF. DEPTH (NBC 9.8.9)</text>
                <rect x="20" y="150" width="250" height="70" fill="transparent" />
              </g>

              {/* Handrail Height Hotspot */}
              <g onClick={() => onElementClick('handrail-height')} className="cursor-pointer group">
                <line x1="375" y1="200" x2="375" y2="270" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4,4" className="group-hover:stroke-yellow-400" />
                <polygon points="375,200 370,210 380,210" fill="#3b82f6" className="group-hover:fill-yellow-400" />
                <polygon points="375,270 370,260 380,260" fill="#3b82f6" className="group-hover:fill-yellow-400" />
                <line x1="375" y1="235" x2="430" y2="235" stroke="#60a5fa" strokeWidth="1" className="group-hover:stroke-yellow-400" />
                <text x="435" y="238" fill="#3b82f6" fontSize="9" fontWeight="bold" textAnchor="start" className="font-mono group-hover:fill-yellow-400">865mm - 1070mm HANDRAIL (NBC 9.8.7)</text>
                <rect x="360" y="190" width="280" height="90" fill="transparent" />
              </g>

              {/* --- TITLE BLOCK --- */}
              <g onClick={() => onElementClick('title-block')} className="cursor-pointer group transition-all">
                <rect x="520" y="420" width="260" height="160" fill="rgba(255,255,255,0.05)" stroke={currentColors.stroke} strokeWidth="2" className="group-hover:fill-blue-500/40" />
                <text x="535" y="450" fill={currentColors.fill} fontSize="18" fontWeight="bold">PROJECT: RSR-2026</text>
                <text x="535" y="475" fill={currentColors.fill} fontSize="14">DWG: A4.1 - STAIR DETAILS</text>
                <text x="535" y="500" fill={currentColors.fill} fontSize="14">SCALE: 1/2" = 1'-0"</text>
              </g>
            </g>
          )}"""

content = content.replace("        </svg>", page8_9 + "\n        </svg>")

with open("src/components/RedSeal/InteractiveBlueprint.jsx", "w") as f:
    f.write(content)

