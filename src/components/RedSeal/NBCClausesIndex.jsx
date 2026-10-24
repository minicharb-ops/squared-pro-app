import React, { useState, useMemo } from 'react'
import { 
  Search, 
  Book, 
  X, 
  ChevronRight, 
  ChevronDown, 
  Check, 
  Copy, 
  HelpCircle, 
  Filter, 
  ArrowRight,
  BookOpen
} from 'lucide-react'
import questionsData from '../../data/RedSeal/questions.json'
import blockAGuide from '../../data/RedSeal/block_a_study_guide.json'
import blockBGuide from '../../data/RedSeal/block_b_study_guide.json'
import blockCGuide from '../../data/RedSeal/block_c_study_guide.json'
import blockDGuide from '../../data/RedSeal/block_d_study_guide.json'
import blockEGuide from '../../data/RedSeal/block_e_study_guide.json'
import blockFGuide from '../../data/RedSeal/block_f_study_guide.json'
import blockGGuide from '../../data/RedSeal/block_g_study_guide.json'

export default function NBCClausesIndex({ onLaunchQuizWithQuestions }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBlockFilter, setSelectedBlockFilter] = useState('All')
  const [expandedSection, setExpandedSection] = useState(null)
  const [copiedSection, setCopiedSection] = useState(null)

  // Compile all NBC Part 9 references across all block guides
  const compiledClauses = useMemo(() => {
    const blocks = [
      { id: 'Block A', title: blockAGuide.title, refs: blockAGuide.nbcPart9References || [] },
      { id: 'Block B', title: blockBGuide.title, refs: blockBGuide.nbcPart9References || [] },
      { id: 'Block C', title: blockCGuide.title, refs: blockCGuide.nbcPart9References || [] },
      { id: 'Block D', title: blockDGuide.title, refs: blockDGuide.nbcPart9References || [] },
      { id: 'Block E', title: blockEGuide.title, refs: blockEGuide.nbcPart9References || [] },
      { id: 'Block F', title: blockFGuide.title, refs: blockFGuide.nbcPart9References || [] },
      { id: 'Block G', title: blockGGuide.title, refs: blockGGuide.nbcPart9References || [] },
    ]

    const all = []
    blocks.forEach(block => {
      block.refs.forEach(ref => {
        all.push({
          blockId: block.id,
          blockTitle: block.title,
          section: ref.section || 'Unknown Section',
          title: ref.title || 'General Code Requirement',
          rules: ref.rules || []
        })
      })
    })
    return all
  }, [])

  // Highlight helper
  const highlightText = (text, highlight) => {
    if (!highlight.trim()) return text
    const regex = new RegExp(`(${highlight.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi')
    const parts = text.split(regex)
    return (
      <span>
        {parts.map((part, i) => 
          regex.test(part) ? (
            <mark key={i} className="bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-100 font-extrabold rounded px-0.5">
              {part}
            </mark>
          ) : part
        )}
      </span>
    )
  }

  // Filter and Search Logic
  const filteredClauses = useMemo(() => {
    return compiledClauses.filter(clause => {
      // Block Filter
      if (selectedBlockFilter !== 'All' && clause.blockId !== selectedBlockFilter) {
        return false
      }

      // Query Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        const matchSection = clause.section.toLowerCase().includes(query)
        const matchTitle = clause.title.toLowerCase().includes(query)
        const matchBlock = clause.blockId.toLowerCase().includes(query) || clause.blockTitle.toLowerCase().includes(query)
        const matchRules = clause.rules.some(rule => rule.toLowerCase().includes(query))
        
        return matchSection || matchTitle || matchBlock || matchRules
      }

      return true
    })
  }, [compiledClauses, selectedBlockFilter, searchQuery])

  // Map clauses to official questions
  const getRelatedQuestions = (sectionCode) => {
    if (!sectionCode) return []
    const cleanSection = sectionCode.replace(/[^0-9.]/g, '').trim() // e.g. "9.27.3"
    if (!cleanSection) return []
    
    return questionsData.filter(q => {
      const ref = q.codeReference || ''
      return ref.includes(cleanSection) || ref.toLowerCase().includes(sectionCode.toLowerCase())
    })
  }

  const handleCopyReference = (section, e) => {
    e.stopPropagation()
    navigator.clipboard.writeText(section)
    setCopiedSection(section)
    setTimeout(() => setCopiedSection(null), 2000)
  }

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div className="space-y-1">
          <span className="bg-brand-500/10 text-brand-700 dark:text-brand-300 text-[10px] uppercase font-black px-3 py-1 rounded-full tracking-wider">
            National Building Code of Canada (NBC)
          </span>
          <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
            <Book size={20} className="text-brand-500" />
            <span>NBC Part 9 Clauses Index</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Instantly cross-reference residential framing, roofing, insulation, and safety standards directly aligned with the Red Seal Occupational Standard (RSOS).
          </p>
        </div>
      </div>

      {/* CONTROLS */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search NBC clauses by section number (e.g. 9.25), keyword (e.g. vapor, flashing, stair), or Block..."
            className="w-full pl-11 pr-10 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all min-h-[48px]"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Filter Chips */}
        <div className="space-y-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5 px-1">
            <Filter size={11} /> Filter by Red Seal Occupational Block
          </span>
          <div className="flex flex-wrap gap-1.5">
            {['All', 'Block A', 'Block B', 'Block C', 'Block D', 'Block E', 'Block F', 'Block G'].map((block) => (
              <button
                key={block}
                onClick={() => setSelectedBlockFilter(block)}
                className={`
                  text-xs font-bold px-3 py-1.5 rounded-lg border transition-all min-h-[32px]
                  ${selectedBlockFilter === block
                    ? 'bg-brand-500 text-white border-brand-600 shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850'
                  }
                `}
              >
                {block}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CLAUSES RESULTS */}
      <div className="space-y-3">
        <div className="flex justify-between items-center text-xs font-bold text-slate-400 px-1">
          <span>Found {filteredClauses.length} clauses</span>
          {searchQuery || selectedBlockFilter !== 'All' ? (
            <button 
              onClick={() => {
                setSearchQuery('')
                setSelectedBlockFilter('All')
              }}
              className="text-brand-500 hover:underline"
            >
              Reset Filters
            </button>
          ) : null}
        </div>

        {filteredClauses.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            <Book size={48} className="mx-auto text-slate-300 dark:text-slate-700 mb-3" />
            <p className="text-sm font-bold text-slate-600 dark:text-slate-400">No NBC clauses matched your criteria.</p>
            <p className="text-xs text-slate-400 mt-1">Try a different search keyword or select another Red Seal block.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredClauses.map((clause, idx) => {
              const uniqueKey = `${clause.blockId}-${clause.section}`
              const isExpanded = expandedSection === uniqueKey
              const relatedQ = getRelatedQuestions(clause.section)
              
              return (
                <div 
                  key={uniqueKey}
                  className={`
                    border rounded-xl transition-all overflow-hidden bg-slate-50/50 dark:bg-slate-950/30
                    ${isExpanded 
                      ? 'border-brand-500/40 ring-1 ring-brand-500/10' 
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }
                  `}
                >
                  {/* CLAUSE HEADER */}
                  <div 
                    onClick={() => setExpandedSection(isExpanded ? null : uniqueKey)}
                    className="p-4 flex items-start justify-between gap-4 cursor-pointer select-none"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] bg-brand-500 text-white font-black px-2 py-0.5 rounded">
                          {clause.section}
                        </span>
                        <span className="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold px-2 py-0.5 rounded">
                          {clause.blockId} ({clause.blockTitle})
                        </span>
                        {relatedQ.length > 0 && (
                          <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold px-2 py-0.5 rounded flex items-center gap-1">
                            <HelpCircle size={10} /> {relatedQ.length} Related Questions
                          </span>
                        )}
                      </div>
                      <h3 className="font-extrabold text-sm md:text-base text-slate-800 dark:text-slate-100">
                        {highlightText(clause.title, searchQuery)}
                      </h3>
                    </div>

                    <div className="flex items-center space-x-2 pt-1 shrink-0">
                      <button
                        onClick={(e) => handleCopyReference(clause.section, e)}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-900 text-slate-400 hover:text-slate-600 transition-all min-h-[32px]"
                        title="Copy code reference to clipboard"
                      >
                        {copiedSection === clause.section ? (
                          <Check size={14} className="text-emerald-500" />
                        ) : (
                          <Copy size={14} />
                        )}
                      </button>
                      <div>
                        {isExpanded ? <ChevronDown size={18} className="text-slate-400" /> : <ChevronRight size={18} className="text-slate-400" />}
                      </div>
                    </div>
                  </div>

                  {/* CLAUSE BODY / CONTENT */}
                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-slate-100 dark:border-slate-900 bg-white dark:bg-slate-900/50 space-y-4 pt-3">
                      
                      {/* RULES LIST */}
                      <div className="space-y-2.5">
                        <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">Official Standards & Safety Guides</p>
                        <ul className="space-y-2">
                          {clause.rules.map((rule, rIdx) => (
                            <li key={rIdx} className="text-xs md:text-sm leading-relaxed text-slate-600 dark:text-slate-300 pl-4 relative">
                              <span className="absolute left-0 top-2.5 w-1.5 h-1.5 rounded-full bg-brand-500" />
                              {highlightText(rule, searchQuery)}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* RELATED QUESTIONS */}
                      {relatedQ.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-850 space-y-3">
                          <div className="flex items-center justify-between">
                            <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                              <HelpCircle size={12} className="text-brand-500" />
                              <span>Verify Your Mastery ({relatedQ.length} Connected Questions)</span>
                            </p>
                            {onLaunchQuizWithQuestions && (
                              <button
                                onClick={() => onLaunchQuizWithQuestions(relatedQ)}
                                className="text-xs font-black text-brand-600 hover:text-brand-500 dark:text-brand-400 flex items-center gap-1"
                              >
                                <span>Test this Clause</span>
                                <ArrowRight size={12} />
                              </button>
                            )}
                          </div>
                          
                          <div className="max-h-60 overflow-y-auto space-y-2.5 border border-slate-100 dark:border-slate-800 rounded-xl p-3 bg-slate-50 dark:bg-slate-950/50">
                            {relatedQ.map((q, qIdx) => (
                              <div key={q.id} className="text-xs bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800 space-y-1.5 shadow-sm">
                                <div className="flex justify-between text-[10px] font-bold text-slate-400">
                                  <span>QID: #{q.id}</span>
                                  <span>Block: {q.block}</span>
                                </div>
                                <p className="font-extrabold text-slate-700 dark:text-slate-300">{q.question}</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 bg-slate-50 dark:bg-slate-950 p-2 rounded border border-slate-100 dark:border-slate-850 mt-1">
                                  {q.options.map((opt, oIdx) => (
                                    <div 
                                      key={oIdx} 
                                      className={`p-1 px-1.5 rounded text-[11px] flex items-center gap-1 font-semibold ${
                                        oIdx === q.correctOptionIndex 
                                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 border border-emerald-300/30' 
                                          : 'text-slate-500'
                                      }`}
                                    >
                                      {oIdx === q.correctOptionIndex ? '✓ ' : '• '}
                                      <span className="truncate">{opt}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

    </div>
  )
}
