import re

with open("src/components/RedSeal/InteractiveBlueprint.jsx", "r") as f:
    content = f.read()

# Update Birdsmouth Cut
birdsmouth_old = """              {/* Birdsmouth Cut */}
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
              </g>"""

birdsmouth_new = """              {/* Birdsmouth Cut */}
              <g onClick={() => onElementClick('birdsmouth-cut')} className="cursor-pointer group">
                {/* Zoomed in callout circle */}
                <circle cx="200" cy="150" r="25" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="5,2" className="group-hover:stroke-yellow-400" />
                <path d="M 215 130 L 260 90" fill="none" stroke="#10b981" strokeWidth="1" />
                
                {/* Detail Box */}
                <rect x="260" y="40" width="120" height="90" fill={theme === 'light-print' ? '#f1f5f9' : '#1e293b'} stroke="#10b981" strokeWidth="2" />
                <text x="320" y="55" fill="#10b981" fontSize="8" fontWeight="bold" textAnchor="middle" className="font-mono group-hover:fill-yellow-400">BIRDSMOUTH DETAIL</text>
                
                {/* Wall plate */}
                <rect x="290" y="100" width="40" height="15" fill="none" stroke={currentColors.stroke} strokeWidth="1" />
                
                {/* Rafter */}
                <path d="M 270 120 L 320 60 L 335 60 L 320 100 L 290 100 L 290 120 Z" fill="none" stroke="#f59e0b" strokeWidth="2" />
                
                {/* Seat Cut Highlight */}
                <line x1="290" y1="100" x2="320" y2="100" stroke="#f59e0b" strokeWidth="4" className="group-hover:stroke-yellow-400" />
                
                <text x="320" y="115" fill="#f59e0b" fontSize="7" textAnchor="middle" className="font-mono group-hover:fill-yellow-400">MIN. BEARING SURFACE</text>
                <rect x="250" y="30" width="140" height="110" fill="transparent" />
              </g>

              {/* Roof Pitch Indicator */}
              <g onClick={() => onElementClick('roof-pitch-indicator')} className="cursor-pointer group">
                <polygon points="400,100 450,100 450,70" fill="none" stroke="#8b5cf6" strokeWidth="2" className="group-hover:stroke-purple-400" />
                <text x="425" y="115" fill="#8b5cf6" fontSize="10" fontWeight="bold" textAnchor="middle" className="font-mono group-hover:fill-purple-400">12</text>
                <text x="460" y="90" fill="#8b5cf6" fontSize="10" fontWeight="bold" textAnchor="middle" className="font-mono group-hover:fill-purple-400">4</text>
                {/* Hitbox */}
                <rect x="390" y="60" width="80" height="60" fill="transparent" />
              </g>"""
content = content.replace(birdsmouth_old, birdsmouth_new)

with open("src/components/RedSeal/InteractiveBlueprint.jsx", "w") as f:
    f.write(content)
