with open('/tmp/ib_shifted2.jsx', 'r') as f:
    full_content = f.read()

with open('/tmp/page6_clean.jsx', 'r') as f:
    old_page6 = f.read()

with open('/tmp/page6_fixed.jsx', 'r') as f:
    new_page6 = f.read()

# Make sure old_page6 is actually in full_content exactly
if old_page6 in full_content:
    full_content = full_content.replace(old_page6, new_page6)
    with open('/tmp/ib_shifted3.jsx', 'w') as f:
        f.write(full_content)
    print("Injected successfully!")
else:
    print("Could not find old page6 in ib_shifted2.jsx")
