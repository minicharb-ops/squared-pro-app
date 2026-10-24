import re

with open("src/components/RedSeal/BlueprintViewer.jsx", "r") as f:
    content = f.read()

# 1. Remove Header
# Find from {/* Header */} to {/* Toolbar: Category tabs and search */}
header_pattern = re.compile(r'\{\/\* Header \*\/\}.*?(?=\{\/\* Toolbar: Category tabs and search \*\/\})', re.DOTALL)
content = header_pattern.sub('', content)

# 2. Adjust Toolbar to accommodate absolute close button
# The new close button: 
close_button = """
              {/* Close Button */}
              <button
                onClick={() => setShowLegend(false)}
                className="absolute top-2 right-2 p-2 bg-white/50 dark:bg-slate-900/50 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full transition-all z-20"
                aria-label="Close legend overlay"
              >
                <X size={18} />
              </button>
"""
toolbar_pattern = re.compile(r'\{\/\* Toolbar: Category tabs and search \*\/\}.*?<div className="px-4 py-2 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shrink-0">')
new_toolbar = close_button + """
              {/* Toolbar: Category tabs and search */}
              <div className="pr-12 pl-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shrink-0">"""
content = toolbar_pattern.sub(new_toolbar, content)

# 3. Remove Footer
footer_pattern = re.compile(r'\{\/\* Footer \*\/\}.*?<\/div>\s+<\/motion\.div>', re.DOTALL)
content = footer_pattern.sub('</motion.div>', content)

with open("src/components/RedSeal/BlueprintViewer.jsx", "w") as f:
    f.write(content)

