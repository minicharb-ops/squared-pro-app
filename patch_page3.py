import re

with open("src/components/RedSeal/InteractiveBlueprint.jsx", "r") as f:
    content = f.read()

# Add 6-mil Poly Vapour Barrier
vapour_group = """              {/* --- INTERACTIVE VAPOUR BARRIER --- */}
              <g onClick={() => onElementClick('vapour-barrier')} className="cursor-pointer group z-10 absolute">
                <line x1="384" y1="135" x2="384" y2="285" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="6,3" className="group-hover:stroke-red-400 transition-colors" />
                <circle cx="384" cy="210" r="7" fill="rgba(239, 68, 68, 0.2)" stroke="#ef4444" strokeWidth="1.5" className="animate-pulse" />
                <circle cx="384" cy="210" r="3" fill="#ef4444" />
                <text x="375" y="213" textAnchor="end" fill={currentColors.fill} fontSize="7" fontWeight="bold" className="font-mono group-hover:fill-red-400">6-mil Poly Vapour Barrier</text>
                <rect x="250" y="200" width="140" height="20" fill="transparent" />
              </g>

              {/* --- INTERACTIVE OSB NAILING PATTERN --- */}
              <g onClick={() => onElementClick('osb-nailing')} className="cursor-pointer group z-10 absolute">
                <circle cx="412" cy="180" r="1.5" fill="#ef4444" />
                <circle cx="412" cy="190" r="1.5" fill="#ef4444" />
                <circle cx="412" cy="200" r="1.5" fill="#ef4444" />
                <circle cx="412" cy="210" r="1.5" fill="#ef4444" />
                <circle cx="412" cy="220" r="1.5" fill="#ef4444" />
                <circle cx="412" cy="230" r="1.5" fill="#ef4444" />
                <circle cx="412" cy="205" r="7" fill="rgba(239, 68, 68, 0.2)" stroke="#ef4444" strokeWidth="1.5" className="animate-pulse" />
                <circle cx="412" cy="205" r="3" fill="#ef4444" />
                <text x="425" y="208" textAnchor="start" fill={currentColors.fill} fontSize="7" fontWeight="bold" className="font-mono group-hover:fill-red-400">OSB Nailing Pattern</text>
                <rect x="405" y="195" width="120" height="20" fill="transparent" />
              </g>

              {/* --- INTERACTIVE ENVELOPE ASSEMBLY LAYERS --- */}"""

content = content.replace("              {/* --- INTERACTIVE ENVELOPE ASSEMBLY LAYERS --- */}", vapour_group)

with open("src/components/RedSeal/InteractiveBlueprint.jsx", "w") as f:
    f.write(content)
