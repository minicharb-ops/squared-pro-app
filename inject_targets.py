with open('src/components/RedSeal/BlueprintViewer.jsx', 'r') as f:
    full_content = f.read()

with open('/tmp/targetpages.txt', 'r') as f:
    old_targets = f.read()

with open('/tmp/targetpages_fixed.txt', 'r') as f:
    new_targets = f.read()

if old_targets in full_content:
    full_content = full_content.replace(old_targets, new_targets)
    with open('src/components/RedSeal/BlueprintViewer.jsx', 'w') as f:
        f.write(full_content)
    print("Injected targets successfully!")
else:
    print("Could not find old targets in BlueprintViewer.jsx")

