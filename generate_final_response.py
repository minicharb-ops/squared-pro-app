with open('/tmp/page4_rects.txt', 'r') as f:
    lines = f.readlines()

# Clean lines
lines = [l for l in lines if not l.strip() == '{page === 4 && (']
lines = [l for l in lines if not l.strip() == ')}']
lines = [l for l in lines if not l.strip() == '<g>']
lines = [l for l in lines if not l.strip() == '</g>']
lines = [l for l in lines if not l.strip() == '</svg>']
lines = [l for l in lines if not '<svg' in l]

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
    
    if l.strip():
        current.append(l.rstrip())

base_str = "\n".join(base_elements)
plumb_str = "\n".join(plumb_elements)
elec_str = "\n".join(elec_elements)

final_str = """### 1. The State Hook
Drop this at the top of your component where your other state variables are defined:

```jsx
const [activeMepLayer, setActiveMepLayer] = useState('all');
```

### 2. The Complete Page 4 Replacement Block
Highlight your existing `{page === 4 && (` (or `{currentPage === 4 && (`) block all the way to its closing `)}` and replace it entirely with this block:

```jsx
{page === 4 && (
  <div className="flex flex-col w-full h-full relative">
    {/* TOGGLE UI */}
    <div className="absolute top-0 left-0 right-0 flex justify-center space-x-3 w-full z-10 pointer-events-auto mt-2">
      <button 
        onClick={() => setActiveMepLayer('all')}
        className={`px-5 py-2 rounded-full text-sm font-bold tracking-wide transition-all ${
          activeMepLayer === 'all' 
            ? 'bg-cyan-500 text-slate-900 shadow-[0_0_10px_rgba(6,182,212,0.5)]' 
            : 'bg-slate-800 text-slate-400 hover:bg-slate-700 border border-slate-700'
        }`}
      >
        ALL
      </button>
      <button 
        onClick={() => setActiveMepLayer('plumbing')}
        className={`px-5 py-2 rounded-full text-sm font-bold tracking-wide transition-all ${
          activeMepLayer === 'plumbing' 
            ? 'bg-blue-500 text-white shadow-[0_0_10px_rgba(59,130,246,0.5)]' 
            : 'bg-slate-800 text-slate-400 hover:bg-slate-700 border border-slate-700'
        }`}
      >
        PLUMBING
      </button>
      <button 
        onClick={() => setActiveMepLayer('electrical')}
        className={`px-5 py-2 rounded-full text-sm font-bold tracking-wide transition-all ${
          activeMepLayer === 'electrical' 
            ? 'bg-orange-500 text-slate-900 shadow-[0_0_10px_rgba(249,115,22,0.5)]' 
            : 'bg-slate-800 text-slate-400 hover:bg-slate-700 border border-slate-700'
        }`}
      >
        ELECTRICAL
      </button>
    </div>

    {/* PAGE 4 SVG */}
    <svg viewBox="-40 -40 880 680" className="w-full h-full cursor-crosshair mt-12">
      <g id="base-layer">
__BASE__
      </g>

      {(activeMepLayer === 'all' || activeMepLayer === 'plumbing') && (
        <g id="plumbing-layer">
__PLUMB__
        </g>
      )}

      {(activeMepLayer === 'all' || activeMepLayer === 'electrical') && (
        <g id="electrical-layer">
__ELEC__
        </g>
      )}
    </svg>
  </div>
)}
```
"""

final_str = final_str.replace("__BASE__", base_str)
final_str = final_str.replace("__PLUMB__", plumb_str)
final_str = final_str.replace("__ELEC__", elec_str)

with open('/tmp/response.md', 'w') as f:
    f.write(final_str)

