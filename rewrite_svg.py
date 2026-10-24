import re

with open('/tmp/page4.txt', 'r') as f:
    lines = f.readlines()

def change_colors(text):
    # change text fills to high-vis
    text = re.sub(r'fill="#ef4444"', 'fill="#facc15"', text) # red -> yellow
    text = re.sub(r'fill="#3b82f6"', 'fill="#22d3ee"', text) # dark blue -> cyan
    text = re.sub(r'fill="#0ea5e9"', 'fill="#38bdf8"', text) # blue -> light blue
    text = re.sub(r'fill="#2563eb"', 'fill="#60a5fa"', text) # dark blue -> light blue
    text = re.sub(r'fill="#f97316"', 'fill="#fbbf24"', text) # orange -> amber
    text = re.sub(r'stroke="#2563eb"', 'stroke="#60a5fa"', text)
    text = re.sub(r'stroke="#3b82f6"', 'stroke="#22d3ee"', text)
    text = re.sub(r'stroke="#0ea5e9"', 'stroke="#38bdf8"', text)
    text = re.sub(r'stroke="#f97316"', 'stroke="#fbbf24"', text)
    text = re.sub(r'stroke="#ef4444"', 'stroke="#f87171"', text)
    text = re.sub(r'stroke="#b45309"', 'stroke="#f59e0b"', text)
    text = re.sub(r'text-red-\d+', 'text-yellow-400', text)
    return text

out = []
for line in lines:
    out.append(change_colors(line))

with open('/tmp/page4_colored.txt', 'w') as f:
    f.writelines(out)

