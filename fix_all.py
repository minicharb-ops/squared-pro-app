with open("src/components/RedSeal/BlueprintViewer.jsx", "r") as f:
    content = f.read()

idx1 = content.find('const ALL_INTERACTIVE_TAKEAWAYS = [')
idx2 = content.find('];', idx1)

text = content[idx1:idx2]
if text.strip().endswith(','):
    # remove the last comma
    last_comma = text.rfind(',')
    new_text = text[:last_comma] + text[last_comma+1:]
    content = content[:idx1] + new_text + content[idx2:]
    
    with open("src/components/RedSeal/BlueprintViewer.jsx", "w") as f:
        f.write(content)
    print("Fixed comma in ALL_INTERACTIVE_TAKEAWAYS")

