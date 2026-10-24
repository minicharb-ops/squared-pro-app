import re

with open("src/components/RedSeal/BlueprintViewer.jsx", "r") as f:
    content = f.read()

# 1. Remove Search
search_block = """        {/* In-document Text Search */}
        <div className="flex items-center gap-2">
          <div className="relative max-w-[150px] sm:max-w-[180px]">
            <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 text-slate-400 dark:text-slate-500">
              <Search size={14} />
            </span>
            <input 
              type="text" 
              placeholder="Search schematics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-xs font-bold rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          
          <button
            onClick={() => setShowLegend(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white text-xs font-black uppercase rounded-lg shadow-sm transition-all hover:scale-[1.03] active:scale-95"
            title="Open Symbols Legend Overlay"
          >
            <Layers size={14} />
            <span>Legend</span>
          </button>
        </div>"""
        
replacement_1 = """        <button
          onClick={() => setShowLegend(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white text-xs font-black uppercase rounded-lg shadow-sm transition-all hover:scale-[1.03] active:scale-95"
          title="Open Symbols Legend Overlay"
        >
          <Layers size={14} />
          <span>Legend</span>
        </button>"""
content = content.replace(search_block, replacement_1)

# 2. Modify tabs header
tabs_block = """          {/* Tabs header */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <button
              onClick={() => setRightPaneTab('masterclass')}
              className={`flex-1 py-3 text-center text-[10px] font-black uppercase tracking-wider border-b-2 transition-all ${
                rightPaneTab === 'masterclass'
                  ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              🎓 Masterclass
            </button>
            <button
              onClick={() => setRightPaneTab('schedules')}
              className={`flex-1 py-3 text-center text-[10px] font-black uppercase tracking-wider border-b-2 transition-all ${
                rightPaneTab === 'schedules'
                  ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              📋 Schedules
            </button>
            <button
              onClick={() => setRightPaneTab('notes')}
              className={`flex-1 py-3 text-center text-[10px] font-black uppercase tracking-wider border-b-2 transition-all ${
                rightPaneTab === 'notes'
                  ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              📝 Notes ({currentPageNotes.length})
            </button>
          </div>"""

replacement_2 = """          {/* Tabs header */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 items-center justify-center p-3 relative group">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-800 dark:text-white flex items-center gap-1.5">
              🎓 Masterclass
            </span>
            <div className="ml-2 relative">
              <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 transition-colors">
                <Info size={14} />
              </button>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-900 dark:bg-slate-800 text-white text-[10px] font-bold rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-xl z-50 pointer-events-none text-center leading-relaxed">
                Click any highlighted element on the blueprint or select one below to inspect its Red Seal specifications.
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900 dark:border-t-slate-800"></div>
              </div>
            </div>
          </div>"""

content = content.replace(tabs_block, replacement_2)

# 3. Active pane start
active_pane_block = """          {/* Active Pane Content */}
          {rightPaneTab === 'masterclass' ? (
            <div className="flex flex-col gap-6 h-auto min-h-min p-4">
              <div className="bg-brand-500/10 border border-brand-500/20 p-3 rounded-xl">
                <span className="text-[9px] font-black text-brand-600 dark:text-brand-400 uppercase tracking-wider block">Interactive Guide</span>
                <p className="text-[10px] font-semibold text-slate-600 dark:text-slate-350 mt-1 leading-normal">
                  Click any highlighted element on the blueprint or select one below to inspect its Red Seal specifications.
                </p>
              </div>"""

replacement_3 = """          {/* Active Pane Content */}
          <div className="flex flex-col gap-6 h-auto min-h-min p-4">"""

content = content.replace(active_pane_block, replacement_3)

# 4. Remove all the other tabs contents (schedules, notes) up to the closing tags
# We'll just find where the map for keyTakeaways ends, and rightPaneTab 'schedules' starts.
pattern = re.compile(r"            </div>\n          \) \: rightPaneTab \=\=\= \'schedules\' \? \([\s\S]*?\<\!\-\- SYMBOLS LEGEND MODAL OVERLAY \-\-\>")

idx = content.find("          ) : rightPaneTab === 'schedules' ? (")
if idx != -1:
    # find the end of the tabs wrapper:
    legend_idx = content.find("{/* SYMBOLS LEGEND MODAL OVERLAY */}")
    if legend_idx != -1:
        # We replace from idx up to legend_idx with just the closing div of Active Pane Content
        # Wait, the `masterclass` block needs to close.
        # It's `<div className="flex flex-col gap-6 h-auto min-h-min p-4">`
        # Then `<div className="space-y-3">`
        # We need to make sure we close the masterclass div.
        # The structure is:
        #           <div className="flex flex-col gap-6 h-auto min-h-min p-4">
        #             <div className="space-y-3">
        #                ... map ...
        #             </div>
        #           </div>
        
        replacement_4 = """            </div>
          </div>
      </div>

      {/* SYMBOLS LEGEND MODAL OVERLAY */}"""
        
        content = content[:idx] + replacement_4 + content[legend_idx + 36:]

with open("src/components/RedSeal/BlueprintViewer.jsx", "w") as f:
    f.write(content)
