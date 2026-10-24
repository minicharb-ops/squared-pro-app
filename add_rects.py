import re

with open('/tmp/page4_colored.txt', 'r') as f:
    lines = f.readlines()

def process_text(match):
    full_text_tag = match.group(0)
    x = float(match.group(1))
    y = float(match.group(2))
    
    font_size_match = re.search(r'fontSize="([^"]+)"', full_text_tag)
    font_size = float(font_size_match.group(1)) if font_size_match else 6.0
    
    anchor_match = re.search(r'textAnchor="([^"]+)"', full_text_tag)
    anchor = anchor_match.group(1) if anchor_match else 'start'
    
    content_match = re.search(r'>([^<]+)</text>', full_text_tag)
    content = content_match.group(1) if content_match else ''
    
    char_width = font_size * 0.6  # approximation for monospace/bold
    width = len(content) * char_width + 4
    height = font_size + 4
    
    rect_x = x - 2
    if anchor == 'middle':
        rect_x = x - (width / 2)
    elif anchor == 'end':
        rect_x = x - width + 2
        
    rect_y = y - font_size - 1
    
    # Don't add plate for title block text if we want, but let's just do it for all or specific ones
    if "RSR-2026" in content or "DWG" in content or "SCALE" in content:
        return full_text_tag
        
    rect = f'<rect x="{rect_x:.1f}" y="{rect_y:.1f}" width="{width:.1f}" height="{height:.1f}" fill="rgba(15, 23, 42, 0.75)" rx="2" />'
    return f'{rect}\n{full_text_tag}'

out = []
for line in lines:
    new_line = re.sub(r'<text\s+x="([^"]+)"\s+y="([^"]+)"[^>]*>.*?</text>', process_text, line)
    out.append(new_line)

with open('/tmp/page4_rects.txt', 'w') as f:
    f.writelines(out)

