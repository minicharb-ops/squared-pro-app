import re

with open('/tmp/page4.jsx', 'r') as f:
    content = f.read()

# We need the underlay and title block for both
underlay_start = content.find('{/* --- FAINT ARCHITECTURAL UNDERLAY')
underlay_end = content.find('</g>', underlay_start) + 4
underlay = content[underlay_start:underlay_end]

title_block_start = content.find('{/* --- TITLE BLOCK --- */}')
title_block_end = content.find('</g>', title_block_start) + 4
title_block = content[title_block_start:title_block_end]
title_block_elec = title_block.replace('DWG: P1.0 - PLUMBING / ELECT', 'DWG: E1.0 - ELECTRICAL PLAN')
title_block_plumb = title_block.replace('DWG: P1.0 - PLUMBING / ELECT', 'DWG: P1.0 - PLUMBING PLAN')

elec_start = content.find('{/* --- ELECTRICAL NOTCHING / DRILLING --- */}')
elec_end = content.find('{/* --- PLUMBING ISOMETRIC SCHEMATIC (3D RISER) --- */}')
elec_content = content[elec_start:elec_end]

plumb_start = elec_end
plumb_end = title_block_start
plumb_content = content[plumb_start:plumb_end]

# Build page 4
page4 = f"""          {{/* ================= PAGE 4: ELECTRICAL PLAN ================= */}}
          {{page === 4 && (
            <g>
              {underlay}
              {elec_content}
              {title_block_elec}
            </g>
          )}}"""

# Build page 5
page5 = f"""          {{/* ================= PAGE 5: PLUMBING PLAN ================= */}}
          {{page === 5 && (
            <g>
              {underlay}
              {plumb_content}
              {title_block_plumb}
            </g>
          )}}"""

# Now replace in ib_shifted
with open('/tmp/ib_shifted.jsx', 'r') as f:
    full_content = f.read()

# The chunk we want to replace is exactly the content in /tmp/page4.jsx
new_content = full_content.replace(content, page4 + "\n" + page5)

with open('/tmp/ib_shifted2.jsx', 'w') as f:
    f.write(new_content)

