import re

with open("src/components/RedSeal/BlueprintViewer.jsx", "r") as f:
    content = f.read()

# 1. State Setup
old_state = "const [legendSearchQuery, setLegendSearchQuery] = useState('')"
new_state = "const [legendSearchQuery, setLegendSearchQuery] = useState('')\n  const [showMasterclassInfo, setShowMasterclassInfo] = useState(false);\n  const [showLegendInfo, setShowLegendInfo] = useState(false);"

content = content.replace(old_state, new_state)

# 2. Legend Info Button
old_legend_btn = """        <button
          onClick={() => setShowLegend(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-slate-900 dark:text-white text-xs font-black uppercase rounded-lg shadow-sm transition-all hover:scale-[1.03] active:scale-95"
          title="Open Symbols Legend Overlay"
        >
          <Layers size={14} />
          <span>Legend</span>
        </button>"""
new_legend_btn = """        <div className="relative flex items-center gap-2">
          <button
            onClick={() => setShowLegend(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-slate-900 dark:text-white text-xs font-black uppercase rounded-lg shadow-sm transition-all hover:scale-[1.03] active:scale-95"
            title="Open Symbols Legend Overlay"
          >
            <Layers size={14} />
            <span>Legend</span>
          </button>
          <button onClick={() => setShowLegendInfo(!showLegendInfo)} className="text-slate-400 hover:text-slate-200 cursor-pointer">ⓘ</button>
          {showLegendInfo && (
            <div className="absolute top-full left-0 mt-2 w-72 bg-slate-800 border border-slate-600 rounded-md p-3 text-sm text-slate-200 z-[60] shadow-xl font-normal text-left">
              <strong className="block text-cyan-400 mb-1">Interactive Symbol Legend</strong>
              <p>Master symbols across all blueprint pages. Search, filter by category, and click on any item to locate & jump to it!</p>
            </div>
          )}
        </div>"""
content = content.replace(old_legend_btn, new_legend_btn)


# 3. Masterclass Info Button
old_masterclass = """          {/* Tabs header */}
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
new_masterclass = """          {/* Tabs header */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 items-center justify-center p-3">
            <div className="relative flex items-center gap-2 justify-center">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-800 dark:text-white flex items-center gap-1.5">
                🎓 Masterclass
              </span>
              <button 
                onClick={() => setShowMasterclassInfo(!showMasterclassInfo)} 
                className="p-1 hover:bg-slate-100 dark:bg-slate-800 rounded-full text-slate-400 transition-colors cursor-pointer"
              >
                <Info size={14} />
              </button>
              {showMasterclassInfo && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 bg-slate-800 border border-slate-600 rounded-md p-3 text-sm text-slate-200 z-[60] shadow-xl font-normal text-left">
                  <strong className="block text-yellow-500 mb-1">Interactive Guide</strong>
                  <p>Click any highlighted element on the blueprint or select one below to inspect its strict Red Seal specifications.</p>
                </div>
              )}
            </div>
          </div>"""
content = content.replace(old_masterclass, new_masterclass)


with open("src/components/RedSeal/BlueprintViewer.jsx", "w") as f:
    f.write(content)

