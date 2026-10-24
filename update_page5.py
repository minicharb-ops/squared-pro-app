import re

with open('/tmp/page5.jsx', 'r') as f:
    content = f.read()

# Replace the first <g> with <svg ...>
content = content.replace('{page === 5 && (\n            <g>', '{page === 5 && (\n            <svg viewBox="-50 -50 900 600" width="100%" height="100%">', 1)

# The last </g> before )} needs to be </svg>
# We can just do rreplace
def rreplace(s, old, new, occurrence):
    li = s.rsplit(old, occurrence)
    return new.join(li)

content = rreplace(content, '            </g>\n          )}', '            </svg>\n          )}', 1)

# Now, we need to modify ALL <text ...> elements
# We will use regex to find <text ...> and modify the attributes.
# The user wants: fill="#f8fafc" stroke="#0f172a" strokeWidth="6" paintOrder="stroke fill" fontWeight="bold"
# We can just remove existing fill, stroke, strokeWidth, paintOrder, fontWeight, and then add the new ones.

def replace_text_attrs(match):
    text_tag = match.group(0)
    # Remove existing fill
    text_tag = re.sub(r'fill="[^"]+"', '', text_tag)
    text_tag = re.sub(r'fill=\{[^\}]+\}', '', text_tag)
    # Remove existing fontWeight
    text_tag = re.sub(r'fontWeight="[^"]+"', '', text_tag)
    # Remove existing stroke, strokeWidth, paintOrder
    text_tag = re.sub(r'stroke="[^"]+"', '', text_tag)
    text_tag = re.sub(r'strokeWidth="[^"]+"', '', text_tag)
    text_tag = re.sub(r'paintOrder="[^"]+"', '', text_tag)
    
    # insert the new attributes before className or at the end of the opening tag if no className
    new_attrs = ' fill="#f8fafc" stroke="#0f172a" strokeWidth="6" paintOrder="stroke fill" fontWeight="bold" '
    if 'className=' in text_tag:
        text_tag = text_tag.replace('className=', new_attrs + 'className=')
    else:
        text_tag = text_tag.replace('>', new_attrs + '>')
    
    # Clean up double spaces
    text_tag = re.sub(r'\s+', ' ', text_tag)
    return text_tag

content = re.sub(r'<text\b[^>]*>', replace_text_attrs, content)

# 3. Shift the Span Arrow
content = content.replace('x1="470" y1="150" x2="470"', 'x1="455" y1="150" x2="455"')
content = content.replace('470,150 465,162 475,162', '455,150 450,162 460,162')
content = content.replace('470,390 465,378 475,378', '455,390 450,378 460,378')
content = content.replace('<rect x="440" y="140" width="60"', '<rect x="425" y="140" width="60"')

# Shift the text as well just in case, but text is at 485 already:
# <g transform="translate(485, 270) rotate(-90)">
# It's already at 485.

# 4. Highlight the Stairwell
# <rect x="156" y="270" width="85" height="120" fill="rgba(245, 158, 11, 0.2)" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4,2" className="animate-pulse group-hover:stroke-yellow-400" />
stair_target = '<rect x="156" y="270" width="85" height="120" fill="rgba(245, 158, 11, 0.2)" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4,2"'
stair_replacement = '<rect x="156" y="270" width="85" height="120" fill="rgba(245, 158, 11, 0.2)" stroke="#fbbf24" strokeWidth="6"'
content = content.replace(stair_target, stair_replacement)


with open('/tmp/page5_updated.jsx', 'w') as f:
    f.write(content)

