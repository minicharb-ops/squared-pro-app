with open('/tmp/page4_rects.txt', 'r') as f:
    lines = f.readlines()

# Clean lines
lines = [l for l in lines if not l.strip() == '{page === 4 && (']
lines = [l for l in lines if not l.strip() == ')}']
lines = [l for l in lines if not l.strip() == '<g>']
lines = [l for l in lines if not l.strip() == '</g>']

# Re-nudge
out_lines = []
for l in lines:
    l = l.replace('y="45" fill={currentColors.fill} fontSize="6"', 'y="52" fill={currentColors.fill} fontSize="6"')
    l = l.replace('y="525" fill="#facc15"', 'y="520" fill="#facc15"')
    l = l.replace('y="534" fill={currentColors.fill}', 'y="536" fill={currentColors.fill}')
    out_lines.append(l)

lines = out_lines

base_elements = []
elec_elements = []
plumb_elements = []

current = base_elements
for l in lines:
    if 'FAINT ARCHITECTURAL UNDERLAY' in l or 'TITLE BLOCK' in l:
        current = base_elements
    elif 'ELECTRICAL NOTCHING' in l or '200A MAIN SERVICE' in l or 'STANDARD DUPLEX' in l or 'WET-ZONE GFCI' in l or 'HEAVY DUTY 240V' in l or 'LIGHTING FIXTURES' in l or 'SMOKE / CARBON MONOXIDE' in l:
        current = elec_elements
    elif 'PLUMBING ISOMETRIC' in l or 'FIXTURE A' in l or 'FIXTURE B' in l or 'FIXTURE C' in l or 'DETAILED RADON' in l or 'INTERACTIVE JOIST PENETRATION' in l:
        current = plumb_elements
    
    # Check if empty
    if l.strip():
        current.append(l.rstrip())

base_str = "\n".join(base_elements)
plumb_str = "\n".join(plumb_elements)
elec_str = "\n".join(elec_elements)

final_str = f"""
Here are the three specific code blocks you requested. You can inject these directly into your codebase.

### 1. The State Hook
Add this near your other state declarations in the component:

```jsx
const [activeMepLayer, setActiveMepLayer] = useState('all'); // 'all' | 'plumbing' | 'electrical'
```

### 2. The Toggle UI
Place this absolute-positioned toggle inside your viewer container, conditionally rendering for Page 4:

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

### 3. The Page 4 SVG Block
Replace your entire `{{page === 4 && (...)}}` block with this updated version. It features a zoomed-out viewBox (`-40 -40 880 680`), grouped elements bound to `activeMepLayer`, high-visibility colors, dark `<rect>` background plates for text legibility, and nudged coordinates to prevent overlapping:

```jsx
{{page === 4 && (
  <svg viewBox="-40 -40 880 680" className="w-full h-full cursor-crosshair">
    {base_str}

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

