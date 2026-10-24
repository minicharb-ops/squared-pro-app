import re

with open("src/components/RedSeal/InteractiveBlueprint.jsx", "r") as f:
    content = f.read()

# Add Joist Penetration detail on Page 4
joist_penetration = """              {/* --- INTERACTIVE JOIST PENETRATION DETAIL --- */}
              <g onClick={() => onElementClick('joist-penetration')} className="cursor-pointer group">
                <rect x="280" y="420" width="120" height="60" fill="rgba(255,255,255,0.05)" stroke={currentColors.stroke} strokeWidth="1" strokeDasharray="2,2" />
                <rect x="290" y="440" width="100" height="20" fill="#f59e0b" opacity="0.3" stroke="#b45309" strokeWidth="2" />
                <circle cx="340" cy="450" r="10" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="2,2" className="group-hover:stroke-red-400" />
                <circle cx="340" cy="450" r="8" fill="rgba(56, 189, 248, 0.4)" stroke="#0ea5e9" strokeWidth="2" />
                <text x="340" y="435" fill={currentColors.fill} fontSize="7" fontWeight="bold" textAnchor="middle" className="font-mono group-hover:fill-red-400">JOIST PENETRATION</text>
                <text x="340" y="470" fill={currentColors.fill} fontSize="5" textAnchor="middle" className="font-mono opacity-80">(MAX 1/4 DEPTH)</text>
                
                <circle cx="340" cy="450" r="15" fill="rgba(239, 68, 68, 0.2)" stroke="#ef4444" strokeWidth="1.5" className="animate-pulse opacity-50" />
              </g>

              {/* --- TITLE BLOCK --- */}"""

content = content.replace("              {/* --- TITLE BLOCK --- */}", joist_penetration)


# Replace Midspan Blocking with Cross-Bridging on Page 5
old_blocking = """              {/* Midspan Blocking */}
              <g 
                onClick={() => onElementClick('blocking-midspan')}
                className="cursor-pointer group"
              >
                <line x1="150" y1="205" x2="550" y2="205" stroke="#ef4444" strokeWidth="3.5" strokeDasharray="10,15" className="group-hover:stroke-yellow-400" />
                <line x1="150" y1="335" x2="550" y2="335" stroke="#ef4444" strokeWidth="3.5" strokeDasharray="10,15" className="group-hover:stroke-yellow-400" />
                <text x="350" y="197" fill="#f87171" fontSize="8" fontWeight="black" textAnchor="middle" className="group-hover:fill-yellow-400 font-mono">
                  11-7/8" SOLID BLOCKING MIDSPAN (NBC 9.23.9.4)
                </text>
                <text x="350" y="350" fill="#f87171" fontSize="8" fontWeight="black" textAnchor="middle" className="group-hover:fill-yellow-400 font-mono">
                  11-7/8" SOLID BLOCKING MIDSPAN (NBC 9.23.9.4)
                </text>
              </g>"""

new_bridging = """              {/* Cross-Bridging */}
              <g 
                onClick={() => onElementClick('cross-bridging')}
                className="cursor-pointer group z-10"
              >
                {Array.from({ length: 12 }).map((_, i) => {
                  const x = 170 + i * 30;
                  return (
                    <g key={`bridge-t-${i}`}>
                      <line x1={x + 3} y1="200" x2={x + 27} y2="210" stroke="#f59e0b" strokeWidth="1.5" className="group-hover:stroke-red-400 transition-colors" />
                      <line x1={x + 3} y1="210" x2={x + 27} y2="200" stroke="#f59e0b" strokeWidth="1.5" className="group-hover:stroke-red-400 transition-colors" />
                    </g>
                  );
                })}
                {Array.from({ length: 12 }).map((_, i) => {
                  const x = 175 + i * 30;
                  return (
                    <g key={`bridge-b-${i}`}>
                      <line x1={x + 3} y1="330" x2={x + 27} y2="340" stroke="#f59e0b" strokeWidth="1.5" className="group-hover:stroke-red-400 transition-colors" />
                      <line x1={x + 3} y1="340" x2={x + 27} y2="330" stroke="#f59e0b" strokeWidth="1.5" className="group-hover:stroke-red-400 transition-colors" />
                    </g>
                  );
                })}
                <text x="350" y="195" fill="#f87171" fontSize="8" fontWeight="black" textAnchor="middle" className="group-hover:fill-red-400 transition-colors font-mono">
                  WOOD CROSS-BRIDGING MIDSPAN (NBC 9.23.9.4)
                </text>
                <text x="350" y="325" fill="#f87171" fontSize="8" fontWeight="black" textAnchor="middle" className="group-hover:fill-red-400 transition-colors font-mono">
                  WOOD CROSS-BRIDGING MIDSPAN (NBC 9.23.9.4)
                </text>
                <rect x="150" y="190" width="400" height="30" fill="transparent" />
                <rect x="150" y="320" width="400" height="30" fill="transparent" />
              </g>"""

content = content.replace(old_blocking, new_bridging)

with open("src/components/RedSeal/InteractiveBlueprint.jsx", "w") as f:
    f.write(content)
