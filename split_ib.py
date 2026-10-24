import re

with open('src/components/RedSeal/InteractiveBlueprint.jsx', 'r') as f:
    content = f.read()

# First, shift pages 9 -> 10, 8 -> 9, ..., 5 -> 6
for p in range(9, 4, -1):
    content = content.replace(f"page === {p} && (", f"page === {p + 1} && (")
    # Also update any comments
    content = content.replace(f"PAGE {p}:", f"PAGE {p + 1}:")

# Let's save this as a first step to see if it works
with open('/tmp/ib_shifted.jsx', 'w') as f:
    f.write(content)

