import re

with open('/tmp/targetpages.txt', 'r') as f:
    content = f.read()

# First shift everything >= 5 to +1
def bump_page(match):
    page_num = int(match.group(1))
    if page_num >= 5:
        return f"targetPage = {page_num + 1};"
    return match.group(0)

content = re.sub(r'targetPage = (\d+);', bump_page, content)

# Now move the specific plumbing items to page 5
content = content.replace('      targetPage = 4;\n      targetElementId = "plumbing-riser-venting";', '      targetPage = 5;\n      targetElementId = "plumbing-riser-venting";')
content = content.replace('      targetPage = 4;\n      targetElementId = "sump-pit-seal";', '      targetPage = 5;\n      targetElementId = "sump-pit-seal";')
content = content.replace('      targetPage = 4;\n      targetElementId = "joist-penetration";', '      targetPage = 5;\n      targetElementId = "joist-penetration";')

with open('/tmp/targetpages_fixed.txt', 'w') as f:
    f.write(content)

