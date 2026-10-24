import re

with open("src/components/RedSeal/InteractiveBlueprint.jsx", "r") as f:
    content = f.read()

page6_7 = """          {/* ================= PAGE 6: SITE PLAN ================= */}
          {page === 6 && (
            <g>
              {/* --- SITE PLAN GEOMETRY --- */}
              {/* Property Lines */}
              <g pointerEvents="none">
                <rect x="50" y="50" width="600" height="400" fill="none" stroke={currentColors.stroke} strokeWidth="3" strokeDasharray="20,10,5,10" opacity="0.6" />
                <text x="350" y="40" fill={currentColors.fill} fontSize="12" fontWeight="bold" textAnchor="middle" opacity="0.8">PROPERTY LINE (70.0m x 45.0m)</text>
              </g>

              {/* Assumed Benchmark */}
              <g onClick={() => onElementClick('benchmark-elevation')} className="cursor-pointer group z-10">
                <circle cx="90" cy="90" r="15" fill="none" stroke="#2563eb" strokeWidth="3" className="group-hover:stroke-yellow-400" />
                <line x1="75" y1="90" x2="105" y2="90" stroke="#2563eb" strokeWidth="2" className="group-hover:stroke-yellow-400" />
                <line x1="90" y1="75" x2="90" y2="105" stroke="#2563eb" strokeWidth="2" className="group-hover:stroke-yellow-400" />
                <polygon points="90,90 105,90 90,105" fill="#2563eb" className="group-hover:fill-yellow-400" />
                <polygon points="90,90 75,90 90,75" fill="#2563eb" className="group-hover:fill-yellow-400" />
                <text x="90" y="125" fill="#2563eb" fontSize="8" fontWeight="bold" textAnchor="middle" className="group-hover:fill-yellow-400">BM ELEV: 100.00m</text>
                <text x="90" y="135" fill="#2563eb" fontSize="7" textAnchor="middle" className="group-hover:fill-yellow-400 opacity-80">(TOP OF HYDRANT)</text>
                <rect x="50" y="70" width="80" height="70" fill="transparent" />
              </g>

              {/* Building Footprint */}
              <rect x="200" y="150" width="300" height="200" fill="none" stroke={currentColors.stroke} strokeWidth="2" opacity="0.4" />
              <text x="350" y="250" fill={currentColors.fill} fontSize="14" fontWeight="bold" textAnchor="middle" opacity="0.4">PROPOSED RESIDENCE</text>

              {/* Building Setback */}
              <g onClick={() => onElementClick('building-setback')} className="cursor-pointer group">
                {/* Front Setback */}
                <line x1="200" y1="50" x2="200" y2="150" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5,5" className="group-hover:stroke-yellow-400" />
                <line x1="500" y1="50" x2="500" y2="150" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5,5" className="group-hover:stroke-yellow-400" />
                <line x1="190" y1="100" x2="510" y2="100" stroke="#f59e0b" strokeWidth="1" opacity="0.5" />
                
                <path d="M 200 100 L 190 95 L 190 105 Z" fill="#f59e0b" className="group-hover:fill-yellow-400" />
                <path d="M 50 100 L 60 95 L 60 105 Z" fill="#f59e0b" className="group-hover:fill-yellow-400" />
                <line x1="50" y1="100" x2="200" y2="100" stroke="#f59e0b" strokeWidth="3" className="group-hover:stroke-yellow-400" />
                <text x="125" y="95" fill="#d97706" fontSize="10" fontWeight="bold" textAnchor="middle" className="group-hover:fill-yellow-400 font-mono">6.0m MIN.</text>
                <text x="125" y="115" fill="#d97706" fontSize="8" textAnchor="middle" className="group-hover:fill-yellow-400 font-mono">FRONT SETBACK</text>
                <rect x="50" y="80" width="150" height="40" fill="transparent" />
              </g>

              {/* Batter Boards */}
              <g onClick={() => onElementClick('batter-boards')} className="cursor-pointer group">
                {/* Corner 1 (Top Left) */}
                <g transform="translate(170, 120)">
                  <rect x="-15" y="-15" width="5" height="25" fill="#10b981" className="group-hover:fill-yellow-400" />
                  <rect x="-15" y="-15" width="25" height="5" fill="#10b981" className="group-hover:fill-yellow-400" />
                  {/* String Lines (Pythagorean 3-4-5) */}
                  <line x1="-12" y1="-12" x2="100" y2="-12" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="2,2" />
                  <line x1="-12" y1="-12" x2="-12" y2="100" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="2,2" />
                  <text x="30" y="-18" fill="#ef4444" fontSize="8" fontWeight="bold" className="font-mono">4 UNIT</text>
                  <text x="-16" y="30" fill="#ef4444" fontSize="8" fontWeight="bold" transform="rotate(-90 -16 30)" className="font-mono">3 UNIT</text>
                  <line x1="30" y1="-12" x2="-12" y2="30" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4,4" />
                  <text x="15" y="15" fill="#3b82f6" fontSize="8" fontWeight="bold" transform="rotate(-45 15 15)" className="font-mono">5 UNIT</text>
                </g>
                <rect x="150" y="100" width="100" height="100" fill="transparent" />
              </g>

              {/* --- TITLE BLOCK --- */}
              <g onClick={() => onElementClick('title-block')} className="cursor-pointer group transition-all">
                <rect x="520" y="420" width="260" height="160" fill="rgba(255,255,255,0.05)" stroke={currentColors.stroke} strokeWidth="2" className="group-hover:fill-blue-500/40" />
                <text x="535" y="450" fill={currentColors.fill} fontSize="18" fontWeight="bold">PROJECT: RSR-2026</text>
                <text x="535" y="475" fill={currentColors.fill} fontSize="14">DWG: SP1 - SITE PLAN</text>
                <text x="535" y="500" fill={currentColors.fill} fontSize="14">SCALE: 1:100</text>
              </g>
            </g>
          )}

          {/* ================= PAGE 7: ROOF FRAMING ================= */}
          {page === 7 && (
            <g>
              {/* --- ROOF FRAMING GEOMETRY --- */}
              <g opacity="0.3" pointerEvents="none">
                {/* Exterior Walls */}
                <rect x="200" y="150" width="300" height="200" fill="none" stroke={currentColors.stroke} strokeWidth="2" />
                {/* Center Bearing */}
                <line x1="200" y1="250" x2="500" y2="250" stroke={currentColors.stroke} strokeWidth="1" strokeDasharray="10,5" />
              </g>

              {/* Rafters */}
              <g opacity="0.7">
                {Array.from({ length: 15 }).map((_, i) => {
                  const x = 200 + i * 21.4; // approx 16" O.C. scaled
                  return (
                    <g key={`rafter-${i}`}>
                      <line x1={x} y1="130" x2={x} y2="250" stroke="#f59e0b" strokeWidth="2.5" />
                      <line x1={x} y1="250" x2={x} y2="370" stroke="#f59e0b" strokeWidth="2.5" />
                    </g>
                  );
                })}
              </g>

              {/* Ridge Board */}
              <g onClick={() => onElementClick('ridge-board')} className="cursor-pointer group">
                <rect x="180" y="247" width="340" height="6" fill="#ef4444" className="group-hover:fill-yellow-400" />
                <line x1="350" y1="247" x2="350" y2="210" stroke="#f87171" strokeWidth="1" className="group-hover:stroke-yellow-400" />
                <text x="350" y="200" fill="#ef4444" fontSize="10" fontWeight="bold" textAnchor="middle" className="font-mono group-hover:fill-yellow-400">2x10 RIDGE BOARD (NBC 9.23.14.8)</text>
                <rect x="180" y="235" width="340" height="30" fill="transparent" />
              </g>

              {/* Collar Ties */}
              <g onClick={() => onElementClick('collar-ties')} className="cursor-pointer group">
                {/* Visualized as dashed lines crossing rafters */}
                <line x1="200" y1="180" x2="500" y2="180" stroke="#3b82f6" strokeWidth="4" strokeDasharray="10,10" className="group-hover:stroke-yellow-400" />
                <line x1="200" y1="320" x2="500" y2="320" stroke="#3b82f6" strokeWidth="4" strokeDasharray="10,10" className="group-hover:stroke-yellow-400" />
                <text x="350" y="170" fill="#3b82f6" fontSize="9" fontWeight="bold" textAnchor="middle" className="font-mono group-hover:fill-yellow-400">1x6 COLLAR TIES (UPPER 1/3 OF ATTIC)</text>
                <rect x="180" y="160" width="340" height="40" fill="transparent" />
                <rect x="180" y="300" width="340" height="40" fill="transparent" />
              </g>

              {/* Birdsmouth Cut */}
              <g onClick={() => onElementClick('birdsmouth-cut')} className="cursor-pointer group">
                {/* Zoomed in callout circle */}
                <circle cx="200" cy="150" r="25" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="5,2" className="group-hover:stroke-yellow-400" />
                <path d="M 215 130 L 260 90" fill="none" stroke="#10b981" strokeWidth="1" />
                
                {/* Detail Box */}
                <rect x="260" y="40" width="120" height="90" fill={theme === 'light-print' ? '#f1f5f9' : '#1e293b'} stroke="#10b981" strokeWidth="2" />
                <text x="320" y="55" fill="#10b981" fontSize="8" fontWeight="bold" textAnchor="middle" className="font-mono">BIRDSMOUTH DETAIL</text>
                
                {/* Wall plate */}
                <rect x="290" y="100" width="40" height="15" fill="none" stroke={currentColors.stroke} strokeWidth="1" />
                {/* Rafter */}
                <path d="M 280 120 L 290 100 L 310 100 L 330 60 L 310 50 Z" fill="none" stroke="#f59e0b" strokeWidth="2" className="group-hover:stroke-yellow-400" />
                
                <text x="320" y="125" fill={currentColors.fill} fontSize="6" textAnchor="middle" className="font-mono opacity-80">MIN. BEARING SURFACE</text>
                <rect x="170" y="120" width="60" height="60" fill="transparent" />
                <rect x="260" y="40" width="120" height="90" fill="transparent" />
              </g>

              {/* --- TITLE BLOCK --- */}
              <g onClick={() => onElementClick('title-block')} className="cursor-pointer group transition-all">
                <rect x="520" y="420" width="260" height="160" fill="rgba(255,255,255,0.05)" stroke={currentColors.stroke} strokeWidth="2" className="group-hover:fill-blue-500/40" />
                <text x="535" y="450" fill={currentColors.fill} fontSize="18" fontWeight="bold">PROJECT: RSR-2026</text>
                <text x="535" y="475" fill={currentColors.fill} fontSize="14">DWG: R1.0 - ROOF FRAMING</text>
                <text x="535" y="500" fill={currentColors.fill} fontSize="14">SCALE: 1/4" = 1'-0"</text>
              </g>
            </g>
          )}"""

content = content.replace("        </svg>", page6_7 + "\n        </svg>")

with open("src/components/RedSeal/InteractiveBlueprint.jsx", "w") as f:
    f.write(content)

