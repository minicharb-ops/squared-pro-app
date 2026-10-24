with open("src/components/RedSeal/BlueprintViewer.jsx", "r") as f:
    content = f.read()

idx1 = content.find('const MOCK_FALLBACK_BLUEPRINTS = [')
idx2 = content.find('];', idx1)

mock_text = content[idx1:idx2]
if mock_text.strip().endswith(','):
    # remove the last comma
    last_comma = mock_text.rfind(',')
    new_mock_text = mock_text[:last_comma] + mock_text[last_comma+1:]
    content = content[:idx1] + new_mock_text + content[idx2:]
    
    with open("src/components/RedSeal/BlueprintViewer.jsx", "w") as f:
        f.write(content)
    print("Fixed comma in MOCK_FALLBACK_BLUEPRINTS")

