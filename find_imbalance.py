import re

with open("src/components/RedSeal/BlueprintViewer.jsx", "r") as f:
    lines = f.readlines()

open_count = 0
close_count = 0

for i, line in enumerate(lines):
    open_count += line.count("<div")
    close_count += line.count("</div")
    if close_count > open_count:
        print(f"Imbalance at line {i+1}: open={open_count}, close={close_count}")
        print(line)
        break
