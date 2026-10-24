import re

with open('/tmp/page4_rects.txt', 'r') as f:
    svg_content = f.read()

# Nudge specific text elements
svg_content = svg_content.replace('y="45" fill={currentColors.fill} fontSize="6"', 'y="52" fill={currentColors.fill} fontSize="6"')
svg_content = svg_content.replace('y="525" fill="#facc15"', 'y="520" fill="#facc15"')
svg_content = svg_content.replace('y="534" fill={currentColors.fill}', 'y="536" fill={currentColors.fill}')

# We need to wrap things in <g>.
# From what we identified:
# Plumbing Group: 'plumbing-riser-venting', 'plumbing-chase-framing', 'sump-pit-seal', 'joist-penetration'
# Electrical Group: 'electrical-notching', 'electrical-panel', 'gfci-outlet', 'switch-wiring', 'smoke-co-detector'

def get_group(svg):
    plumbing_groups = []
    electrical_groups = []
    base_groups = []

    # Simple approach: let's split by <g onClick=... and then rebuild
    # Wait, FAINT ARCHITECTURAL UNDERLAY is <g opacity="0.25" pointerEvents="none">
    
    lines = svg.split('\n')
    output = []
    
    current_layer = "base"
    
    plumb_elements = []
    elec_elements = []
    base_elements = []
    
    buffer = []
    
    for line in lines:
        if 'FAINT ARCHITECTURAL UNDERLAY' in line or 'TITLE BLOCK' in line:
            current_layer = "base"
        elif 'electrical-notching' in line or 'electrical-panel' in line or 'gfci-outlet' in line or 'switch-wiring' in line or 'smoke-co-detector' in line or 'ELECTRICAL NOTCHING' in line or '200A MAIN SERVICE' in line or 'STANDARD DUPLEX' in line or 'WET-ZONE GFCI' in line or 'HEAVY DUTY 240V' in line or 'LIGHTING FIXTURES' in line or 'SMOKE / CARBON MONOXIDE' in line:
            current_layer = "electrical"
        elif 'plumbing-riser-venting' in line or 'plumbing-chase-framing' in line or 'sump-pit-seal' in line or 'joist-penetration' in line or 'PLUMBING ISOMETRIC' in line or 'FIXTURE A' in line or 'FIXTURE B' in line or 'FIXTURE C' in line or 'DETAILED RADON' in line or 'INTERACTIVE JOIST PENETRATION' in line:
            current_layer = "plumbing"
            
        if current_layer == "base":
            base_elements.append(line)
        elif current_layer == "electrical":
            elec_elements.append(line)
        elif current_layer == "plumbing":
            plumb_elements.append(line)
            
    return "\n".join(base_elements), "\n".join(plumb_elements), "\n".join(elec_elements)

base_str, plumb_str, elec_str = get_group(svg_content)

final_str = f"""
1. **The State Hook:**
```jsx
const [activeMepLayer, setActiveMepLayer] = useState('all'); // 'all' | 'plumbing' | 'electrical'
```

2. **The Toggle UI:**
```jsx
{{page === 4 && (
  <div className="absolute top-4 left-1/2 -translate-x-1/2 flex bg-slate-800 p-1 rounded-full shadow-lg border border-slate-700 z-10">
    {{['all', 'plumbing', 'electrical'].map((layer) => (
      <button
        key={{layer}}
        onClick={{() => setActiveMepLayer(layer)}}
        className={{`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${{
          activeMepLayer === layer 
            ? 'bg-blue-600 text-white shadow-md' 
            : 'text-slate-400 hover:text-white'
        }}`}}
      >
        {{layer}}
      </button>
    ))}}
  </div>
)}}
```

3. **The Page 4 SVG Block:**
```jsx
{{page === 4 && (
  <svg viewBox="-40 -40 880 680" width="100%" height="100%">
    <g id="base-layer">
{base_str}
    </g>

    {{(activeMepLayer === 'all' || activeMepLayer === 'plumbing') && (
      <g id="plumbing-layer">
{plumb_str}
      </g>
    )}}

    {{(activeMepLayer === 'all' || activeMepLayer === 'electrical') && (
      <g id="electrical-layer">
{elec_str}
      </g>
    )}}
  </svg>
)}}
```
"""

with open('/tmp/final.md', 'w') as f:
    f.write(final_str)

