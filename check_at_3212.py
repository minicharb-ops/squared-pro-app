with open("src/components/RedSeal/BlueprintViewer.jsx", "r") as f:
    lines = f.readlines()

open_count = 0
close_count = 0
for i in range(3212):
    open_count += lines[i].count("<div")
    close_count += lines[i].count("</div")

print(f"Before line 3213: open={open_count}, close={close_count}")
