import re

with open('/tmp/page6_clean.jsx', 'r') as f:
    content = f.read()

# 1. Replace <g> with <svg viewBox="-100 -100 1000 800" width="100%" height="100%">
content = content.replace('{page === 6 && (\n            <g>', '{page === 6 && (\n            <svg viewBox="-100 -100 1000 800" width="100%" height="100%">', 1)

# End tag
def rreplace(s, old, new, occurrence):
    li = s.rsplit(old, occurrence)
    return new.join(li)

content = rreplace(content, '            </g>\n          )}', '            </svg>\n          )}', 1)

# 2. Fix the stairwell opening
# Standard orange joists must NOT run through this opening.
# The bottom joists loop is:
old_bottom_joists = """              {/* Bottom half floor joists */}
              {Array.from({ length: 13 }).map((_, i) => {
                const x = 170 + i * 30;
                return (
                  <g key={`joist-b-${i}`}>
                    <line x1={x} y1="270" x2={x} y2="400" stroke="#f59e0b" strokeWidth="2.5" />
                    <line x1={x - 2} y1="265" x2={x - 2} y2="400" stroke="#b45309" strokeWidth="0.5" />
                    <line x1={x + 2} y1="265" x2={x + 2} y2="400" stroke="#b45309" strokeWidth="0.5" />
                  </g>
                );
              })}"""

new_bottom_joists = """              {/* Bottom half floor joists (excluding stairwell) */}
              {Array.from({ length: 13 }).map((_, i) => {
                const x = 170 + i * 30;
                // Skip joists that run through the stairwell (x=170, 200, 230)
                if (x >= 156 && x <= 241) return null;
                return (
                  <g key={`joist-b-${i}`}>
                    <line x1={x} y1="270" x2={x} y2="400" stroke="#f59e0b" strokeWidth="2.5" />
                    <line x1={x - 2} y1="265" x2={x - 2} y2="400" stroke="#b45309" strokeWidth="0.5" />
                    <line x1={x + 2} y1="265" x2={x + 2} y2="400" stroke="#b45309" strokeWidth="0.5" />
                  </g>
                );
              })}"""
content = content.replace(old_bottom_joists, new_bottom_joists)


# Double headers and double trimmers for stairwell
# Replace the old stairwell outline or floor openings hotspot with the new drawn headers/trimmers
old_hotspot = """              {/* --- FLOOR OPENINGS HOTSPOT --- */}
              <g onClick={() => onElementClick('floor-openings')} className="cursor-pointer group z-10">
                <rect x="156" y="270" width="85" height="120" fill="rgba(245, 158, 11, 0.2)" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4,2" className="animate-pulse group-hover:stroke-yellow-400" />
                <circle cx="198" cy="330" r="12" fill="none" stroke="#f59e0b" strokeWidth="2" className="group-hover:stroke-yellow-400" />
                <circle cx="198" cy="330" r="4" fill="#f59e0b" className="group-hover:fill-yellow-400" />
                <text x="215" y="333" fill="#f59e0b" fontSize="8" fontWeight="bold" className="font-mono group-hover:fill-yellow-400">DOUBLE HEADER / TRIMMER</text>
              </g>"""

new_hotspot = """              {/* --- FLOOR OPENINGS HOTSPOT --- */}
              <g onClick={() => onElementClick('floor-openings')} className="cursor-pointer group z-10">
                <rect x="156" y="270" width="85" height="120" fill="rgba(245, 158, 11, 0.2)" stroke="transparent" />
                {/* Double Trimmers (Vertical) */}
                <line x1="156" y1="270" x2="156" y2="390" stroke="#fbbf24" strokeWidth="6" />
                <line x1="241" y1="270" x2="241" y2="390" stroke="#fbbf24" strokeWidth="6" />
                {/* Double Headers (Horizontal) */}
                <line x1="156" y1="270" x2="241" y2="270" stroke="#fbbf24" strokeWidth="6" />
                <line x1="156" y1="390" x2="241" y2="390" stroke="#fbbf24" strokeWidth="6" />
                
                <circle cx="198" cy="330" r="12" fill="none" stroke="#f59e0b" strokeWidth="2" className="group-hover:stroke-yellow-400" />
                <circle cx="198" cy="330" r="4" fill="#f59e0b" className="group-hover:fill-yellow-400" />
                <rect x="212" y="325" width="105" height="12" fill="#0f172a" rx="4" />
                <text x="215" y="333" fill="#f59e0b" fontSize="8" fontWeight="bold" className="font-mono group-hover:fill-yellow-400">DOUBLE HEADER / TRIMMER</text>
              </g>"""
content = content.replace(old_hotspot, new_hotspot)


# 3. Insert <rect> behind texts
# Texts: 
# a) LVL BEAM
old_lvl_beam = """              <text x="350" y="262" fill="#f43f5e" fontSize="10" fontWeight="black" textAnchor="middle" className="font-mono">
                3-PLY 11-7/8" LVL BEAM (PRIMARY BEARING)
              </text>"""
new_lvl_beam = """              <rect x="220" y="253" width="260" height="14" fill="#0f172a" rx="4" />
              <text x="350" y="262" fill="#f43f5e" fontSize="10" fontWeight="black" textAnchor="middle" className="font-mono">
                3-PLY 11-7/8" LVL BEAM (PRIMARY BEARING)
              </text>"""
content = content.replace(old_lvl_beam, new_lvl_beam)

# b) WOOD CROSS-BRIDGING MIDSPAN
old_cross1 = """                <text x="350" y="195" fill="#f87171" fontSize="8" fontWeight="black" textAnchor="middle" className="group-hover:fill-red-400 transition-colors font-mono">
                  WOOD CROSS-BRIDGING MIDSPAN (NBC 9.23.9.4)
                </text>"""
new_cross1 = """                <rect x="245" y="188" width="210" height="10" fill="#0f172a" rx="4" />
                <text x="350" y="195" fill="#f87171" fontSize="8" fontWeight="black" textAnchor="middle" className="group-hover:fill-red-400 transition-colors font-mono">
                  WOOD CROSS-BRIDGING MIDSPAN (NBC 9.23.9.4)
                </text>"""
content = content.replace(old_cross1, new_cross1)

old_cross2 = """                <text x="350" y="325" fill="#f87171" fontSize="8" fontWeight="black" textAnchor="middle" className="group-hover:fill-red-400 transition-colors font-mono">
                  WOOD CROSS-BRIDGING MIDSPAN (NBC 9.23.9.4)
                </text>"""
new_cross2 = """                <rect x="245" y="318" width="210" height="10" fill="#0f172a" rx="4" />
                <text x="350" y="325" fill="#f87171" fontSize="8" fontWeight="black" textAnchor="middle" className="group-hover:fill-red-400 transition-colors font-mono">
                  WOOD CROSS-BRIDGING MIDSPAN (NBC 9.23.9.4)
                </text>"""
content = content.replace(old_cross2, new_cross2)

# c) JOIST SPAN DIRECTION (green arrow and text)
# Need to shift to empty bay. 470 is on a joist (170 + 10*30 = 470).
# Let's shift it to 455.
old_span = """                {/* Massive double-ended vertical arrow at x = 470 */}
                <line x1="470" y1="150" x2="470" y2="390" stroke="#10b981" strokeWidth="3" className="group-hover:stroke-yellow-400" />
                <polygon points="470,150 465,162 475,162" fill="#10b981" className="group-hover:fill-yellow-400" />
                <polygon points="470,390 465,378 475,378" fill="#10b981" className="group-hover:fill-yellow-400" />
                <rect x="440" y="140" width="60" height="260" fill="transparent" />
                
                <g transform="translate(485, 270) rotate(-90)">
                  <text x="0" y="0" fill={currentColors.fill} fontSize="9.5" fontWeight="black" textAnchor="middle" className="group-hover:fill-yellow-400 font-mono">
                    JOIST SPAN DIRECTION -> T.O.F. BEARING POINTS
                  </text>
                </g>"""

new_span = """                {/* Massive double-ended vertical arrow in empty bay at x = 455 */}
                <line x1="455" y1="150" x2="455" y2="390" stroke="#10b981" strokeWidth="3" className="group-hover:stroke-yellow-400" />
                <polygon points="455,150 450,162 460,162" fill="#10b981" className="group-hover:fill-yellow-400" />
                <polygon points="455,390 450,378 460,378" fill="#10b981" className="group-hover:fill-yellow-400" />
                <rect x="425" y="140" width="60" height="260" fill="transparent" />
                
                <g transform="translate(485, 270) rotate(-90)">
                  <rect x="-140" y="-8" width="280" height="12" fill="#0f172a" rx="4" />
                  <text x="0" y="0" fill={currentColors.fill} fontSize="9.5" fontWeight="black" textAnchor="middle" className="group-hover:fill-yellow-400 font-mono">
                    JOIST SPAN DIRECTION -> T.O.F. BEARING POINTS
                  </text>
                </g>"""
content = content.replace(old_span, new_span)

with open('/tmp/page6_fixed.jsx', 'w') as f:
    f.write(content)

