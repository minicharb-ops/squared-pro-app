import React, { useState, useMemo, useEffect, useRef } from 'react'
import { 
  Search, 
  X, 
  BookOpen, 
  Copy, 
  Check, 
  HelpCircle, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  Info,
  CheckCircle2,
  Bookmark
} from 'lucide-react'
import questionsData from '../../data/RedSeal/questions.json'
import blockAGuide from '../../data/RedSeal/block_a_study_guide.json'
import blockBGuide from '../../data/RedSeal/block_b_study_guide.json'
import blockCGuide from '../../data/RedSeal/block_c_study_guide.json'
import blockDGuide from '../../data/RedSeal/block_d_study_guide.json'
import blockEGuide from '../../data/RedSeal/block_e_study_guide.json'
import blockFGuide from '../../data/RedSeal/block_f_study_guide.json'
import blockGGuide from '../../data/RedSeal/block_g_study_guide.json'

export default function CodeSearchOverlay({ isOpen, onClose, onLaunchQuizWithQuestions, initialSearchQuery = '' }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBlock, setSelectedBlock] = useState('All')
  const [copiedText, setCopiedText] = useState(null)
  const [expandedSection, setExpandedSection] = useState(null)
  const inputRef = useRef(null)

  // Sync searchQuery with initialSearchQuery on open
  useEffect(() => {
    if (isOpen) {
      setSearchQuery(initialSearchQuery || '')
    }
  }, [isOpen, initialSearchQuery])

  // Focus input on mount/open
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus()
        }
      }, 100)
    }
  }, [isOpen])

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Suggestion chips for rapid testing of explicit keyword constraints
  const suggestions = [
    { label: 'Guard Height', query: 'guard height' },
    { label: 'Stair Rise', query: 'stair rise' },
    { label: 'Stair Run', query: 'stair run' },
    { label: 'Vapor Barrier', query: 'vapor barrier' },
    { label: 'Notching Joists', query: 'notch' },
    { label: 'Fire Blocking', query: 'fire block' },
    { label: 'Footing Width', query: 'footing' },
    { label: 'Attic Ventilation', query: 'attic vent' },
    { label: 'Rafter Ties', query: 'rafter tie' }
  ]

  // Pre-compiled high-value NBC 9.0 clauses to augment data and ensure perfect keyword responsiveness
  const specializedClauses = [
    {
      blockId: 'Block F',
      blockTitle: 'Interior Finish',
      section: 'NBC 9.8.8.3',
      title: 'Height of Guards',
      rules: [
        "Guards on balconies, decks, or stairs must be at least 900 mm (36 inches) high inside dwelling units.",
        "Where the elevation drop to the adjacent ground exceeds 1800 mm (6 feet) outside the unit, the guard height must be increased to a minimum of 1070 mm (42 inches).",
        "For flight of stairs, guard height can be measured vertically from the leading edge of the treads, and must be between 900 mm and 1070 mm."
      ]
    },
    {
      blockId: 'Block F',
      blockTitle: 'Interior Finish',
      section: 'NBC 9.8.8.5',
      title: 'Spacing of Balusters & Openings in Guards',
      rules: [
        "All openings in guards (including vertical balusters, horizontal slats, or structural glass margins) must be sized to prevent the passage of a spherical object with a diameter of 100 mm (4 inches).",
        "The spacing rules are critical to ensure infants and toddlers cannot slip through the guardrail assembly."
      ]
    },
    {
      blockId: 'Block F',
      blockTitle: 'Interior Finish',
      section: 'NBC 9.8.8.6',
      title: 'Non-Climbable Guard Designs (Ladder Effect)',
      rules: [
        "Guards must be designed so that no member, attachment, or opening between 140 mm (5.5 inches) and 900 mm (36 inches) above the floor level facilitates climbing.",
        "Horizontal wood boards, cables, or ornamental lattice work in this zone act as a ladder and are strictly prohibited in residential occupancies."
      ]
    },
    {
      blockId: 'Block D',
      blockTitle: 'Framing',
      section: 'NBC 9.8.4',
      title: 'Stairway Rise & Run Geometry',
      rules: [
        "Private interior stairs must have a riser height (stair rise) of: Minimum 125 mm (4-7/8 inches), and Maximum 200 mm (7-7/8 inches).",
        "Private interior stairs must have a tread run of: Minimum 255 mm (10 inches), and Maximum 355 mm (14 inches).",
        "Tread depth (including nosing overlap) must be between 280 mm (11 inches) and 355 mm (14 inches).",
        "Maximum variation between consecutive risers or treads is 5 mm. Maximum variation overall in a single flight is 10 mm."
      ]
    },
    {
      blockId: 'Block G',
      blockTitle: 'Renovations',
      section: 'NBC 9.23.5.1',
      title: 'Drilling & Notching of Wood Joists',
      rules: [
        "Holes drilled in joists must be kept at least 50 mm (2 inches) away from the top and bottom edges.",
        "The maximum diameter of a drilled hole must not exceed 1/4 (one-quarter) of the actual joist depth (e.g., max 58 mm hole for a 2x10 joist with actual depth of 235 mm).",
        "Notches in top or bottom are prohibited in the middle third of the joist span, and must not exceed 1/6 of the depth elsewhere."
      ]
    }
  ]

  // Compile all NBC Part 9 references across all block guides & blend with specialized ones
  const allClauses = useMemo(() => {
    const blocks = [
      { id: 'Block A', title: blockAGuide.title, refs: blockAGuide.nbcPart9References || [] },
      { id: 'Block B', title: blockBGuide.title, refs: blockBGuide.nbcPart9References || [] },
      { id: 'Block C', title: blockCGuide.title, refs: blockCGuide.nbcPart9References || [] },
      { id: 'Block D', title: blockDGuide.title, refs: blockDGuide.nbcPart9References || [] },
      { id: 'Block E', title: blockEGuide.title, refs: blockEGuide.nbcPart9References || [] },
      { id: 'Block F', title: blockFGuide.title, refs: blockFGuide.nbcPart9References || [] },
      { id: 'Block G', title: blockGGuide.title, refs: blockGGuide.nbcPart9References || [] },
    ]

    const compiled = []
    
    // Add specialized ones first for highest relevance
    specializedClauses.forEach(clause => {
      compiled.push({
        ...clause,
        isCustom: true
      })
    })

    // Process from json study guides
    blocks.forEach(block => {
      block.refs.forEach(ref => {
        // Prevent simple duplicate sections if they are already in specializedClauses
        const isDuplicate = compiled.some(c => c.section === ref.section)
        if (!isDuplicate) {
          compiled.push({
            blockId: block.id,
            blockTitle: block.title,
            section: ref.section || 'Unknown Section',
            title: ref.title || 'General Code Requirement',
            rules: ref.rules || [],
            isCustom: false
          })
        }
      })
    })

    return compiled
  }, [])

  // Filter matching clauses based on query and block selections
  const searchResults = useMemo(() => {
    const query = (searchQuery || '').trim().toLowerCase()
    
    return allClauses.filter(clause => {
      // Filter by Block
      if (selectedBlock !== 'All' && clause.blockId !== selectedBlock) {
        return false
      }

      // Filter by Keyword
      if (!query) return true

      const inSection = (clause.section || '').toLowerCase().includes(query)
      const inTitle = (clause.title || '').toLowerCase().includes(query)
      const inBlock = (clause.blockId || '').toLowerCase().includes(query) || (clause.blockTitle || '').toLowerCase().includes(query)
      const inRules = (clause.rules || []).some(rule => (rule || '').toLowerCase().includes(query))

      return inSection || inTitle || inBlock || inRules
    })
  }, [allClauses, searchQuery, selectedBlock])

  // Get matching questions from question bank for a specific section
  const getRelatedQuestions = (sectionCode) => {
    if (!sectionCode) return []
    const cleanSection = sectionCode.replace(/[^0-9.]/g, '').trim()
    if (!cleanSection) return []

    return questionsData.filter(q => {
      const ref = q.codeReference || ''
      return ref.includes(cleanSection) || ref.toLowerCase().includes(sectionCode.toLowerCase())
    })
  }

  // Highlight helper for search keywords
  const highlightText = (text, highlight) => {
    if (!text) return ''
    if (!highlight || !highlight.trim()) return text
    const regex = new RegExp(`(${highlight.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi')
    const parts = text.split(regex)
    return (
      <span>
        {parts.map((part, i) => 
          regex.test(part) ? (
            <mark key={i} className="bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-100 font-extrabold rounded px-1 py-0.5">
              {part}
            </mark>
          ) : part
        )}
      </span>
    )
  }

  const handleCopyText = (clause, e) => {
    e.stopPropagation()
    const textToCopy = `[${clause.section} - ${clause.title}]\n` + clause.rules.map(r => `• ${r}`).join('\n')
    navigator.clipboard.writeText(textToCopy)
    setCopiedText(clause.section)
    setTimeout(() => setCopiedText(null), 2000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
      />

      {/* Modal Container */}
      <div className="relative max-w-4xl w-full h-[85vh] md:h-[80vh] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden shadow-2xl z-50 animate-scaleUp">
        
        {/* HEADER */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex justify-between items-center shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-brand-500/10 text-brand-500 rounded-2xl">
              <BookOpen size={24} />
            </div>
            <div>
              <h2 className="text-lg font-black uppercase tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                <span>NBC Part 9 Code Search</span>
                <span className="bg-brand-500 text-white dark:text-slate-950 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                  Interactive
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
                Instantly cross-reference Canadian National Building Code rules, stair geometry, load margins, and guard height standards.
              </p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-500 dark:text-slate-400 transition-all min-h-[44px] min-w-[44px] flex items-center justify-center border border-slate-200/50 dark:border-slate-700/50"
            aria-label="Close code search overlay"
          >
            <X size={18} />
          </button>
        </div>

        {/* CONTROLS ZONE */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 space-y-4 shrink-0 bg-white dark:bg-slate-900">
          {/* Main Search Input */}
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Type keywords (e.g. 'guard height', 'stair rise', 'joist notch', 'vapor barrier')..."
              className="w-full pl-12 pr-10 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-2xl text-xs sm:text-sm font-semibold placeholder-slate-400 dark:placeholder-slate-500 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent min-h-[48px] shadow-inner transition-all"
            />
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm min-w-[28px] min-h-[28px] flex items-center justify-center"
                aria-label="Clear search input"
              >
                ×
              </button>
            )}
          </div>

          {/* Block Selection Chips */}
          <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 shrink-0">
              Module Block:
            </span>
            <div className="flex flex-wrap gap-1.5 max-h-[72px] overflow-y-auto pr-1">
              {['All', 'Block A', 'Block B', 'Block C', 'Block D', 'Block E', 'Block F', 'Block G'].map((blk) => (
                <button
                  key={blk}
                  onClick={() => setSelectedBlock(blk)}
                  className={`
                    text-[10px] font-black uppercase px-2.5 py-1.5 rounded-lg border transition-all min-h-[28px]
                    ${selectedBlock === blk
                      ? 'bg-brand-500 text-white border-brand-600 shadow'
                      : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }
                  `}
                >
                  {blk}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Suggestions */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1 shrink-0">
              <Sparkles size={11} className="text-amber-500 fill-amber-500/20" /> Suggestions:
            </span>
            {suggestions.map((sug) => (
              <button
                key={sug.label}
                onClick={() => {
                  setSearchQuery(sug.query)
                  setSelectedBlock('All')
                }}
                className="text-[10px] font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/80 hover:bg-brand-500/10 hover:text-brand-500 dark:hover:text-brand-400 px-2.5 py-1 rounded-full transition-colors border border-slate-200/40 dark:border-slate-700/40"
              >
                {sug.label}
              </button>
            ))}
          </div>
        </div>

        {/* RESULTS SCROLL AREA */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 dark:bg-slate-950/10 space-y-4">
          <div className="flex justify-between items-center text-xs text-slate-400 font-bold px-1">
            <span>Found {searchResults.length} matching building code clauses</span>
            {(searchQuery || selectedBlock !== 'All') && (
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedBlock('All')
                  setExpandedSection(null)
                }}
                className="text-brand-500 hover:underline uppercase text-[9.5px] font-black tracking-wider"
              >
                Reset Search
              </button>
            )}
          </div>

          {searchResults.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-150 dark:border-slate-850 shadow-sm max-w-xl mx-auto space-y-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-950/60 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-slate-300 dark:text-slate-700">
                <Search size={32} />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-black uppercase tracking-tight text-slate-800 dark:text-slate-200">No Clauses Found</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold max-w-sm mx-auto">
                  No NBC clauses matching "{searchQuery}" could be located in our study guides. Try broader keywords like "concrete", "stair", "rafter", or "nailing".
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3.5">
              {searchResults.map((clause, index) => {
                const itemKey = `${clause.blockId}-${clause.section}`
                const isExpanded = expandedSection === itemKey
                const relatedQ = getRelatedQuestions(clause.section)

                return (
                  <div
                    key={itemKey}
                    className={`
                      bg-white dark:bg-slate-900 border rounded-2xl transition-all shadow-sm overflow-hidden
                      ${isExpanded 
                        ? 'border-brand-500/55 ring-2 ring-brand-500/5' 
                        : 'border-slate-150 dark:border-slate-850 hover:border-slate-300 dark:hover:border-slate-700'
                      }
                    `}
                  >
                    {/* CARD HEADER */}
                    <div
                      onClick={() => setExpandedSection(isExpanded ? null : itemKey)}
                      className="p-4 md:p-5 flex items-start justify-between gap-4 cursor-pointer select-none"
                    >
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-black uppercase bg-brand-500 text-white dark:text-slate-950 px-2 py-0.5 rounded-lg flex items-center gap-1">
                            <Layers size={10} />
                            {clause.section}
                          </span>
                          <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-lg">
                            {clause.blockId} • {clause.blockTitle}
                          </span>
                          {clause.isCustom && (
                            <span className="text-[9px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-lg border border-amber-500/10">
                              Core Requirement
                            </span>
                          )}
                          {relatedQ.length > 0 && (
                            <span className="text-[10px] font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-lg flex items-center gap-1">
                              <HelpCircle size={10} />
                              {relatedQ.length} Connected Question{relatedQ.length !== 1 ? 's' : ''}
                            </span>
                          )}
                        </div>

                        <h3 className="text-sm md:text-base font-extrabold text-slate-800 dark:text-slate-100">
                          {highlightText(clause.title, searchQuery)}
                        </h3>
                      </div>

                      {/* ACTIONS */}
                      <div className="flex items-center space-x-2 pt-1 shrink-0">
                        <button
                          onClick={(e) => handleCopyText(clause, e)}
                          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all min-h-[40px] min-w-[40px] flex items-center justify-center"
                          title="Copy reference text to clipboard"
                        >
                          {copiedText === clause.section ? (
                            <Check size={15} className="text-emerald-500" />
                          ) : (
                            <Copy size={15} />
                          )}
                        </button>
                        <div className="text-slate-400 font-extrabold text-xs">
                          {isExpanded ? '▲' : '▼'}
                        </div>
                      </div>
                    </div>

                    {/* EXPANDED DETAILS */}
                    {isExpanded && (
                      <div className="px-4 md:px-5 pb-5 border-t border-slate-100 dark:border-slate-850 bg-white dark:bg-slate-900/50 space-y-4 pt-4">
                        
                        {/* Rules list */}
                        <div className="space-y-3">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                            <Info size={11} className="text-brand-500" />
                            <span>Clauses & Building Standards</span>
                          </p>
                          <ul className="space-y-2.5">
                            {clause.rules.map((rule, idx) => (
                              <li key={idx} className="text-xs md:text-sm leading-relaxed text-slate-600 dark:text-slate-300 pl-4 relative font-medium">
                                <span className="absolute left-0 top-2.5 w-1.5 h-1.5 rounded-full bg-brand-500" />
                                {highlightText(rule, searchQuery)}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Connected study questions list */}
                        {relatedQ.length > 0 && (
                          <div className="pt-4 border-t border-slate-150 dark:border-slate-800 space-y-3 animate-fadeIn">
                            <div className="flex items-center justify-between">
                              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                                <CheckCircle2 size={12} className="text-emerald-500" />
                                <span>Mastery Questions ({relatedQ.length})</span>
                              </p>
                              {onLaunchQuizWithQuestions && (
                                <button
                                  onClick={() => {
                                    onLaunchQuizWithQuestions(relatedQ)
                                    onClose()
                                  }}
                                  className="text-[10px] font-black uppercase tracking-wider text-brand-600 hover:text-brand-500 dark:text-brand-400 flex items-center gap-1"
                                >
                                  <span>Test with {relatedQ.length} Questions</span>
                                  <ArrowRight size={11} />
                                </button>
                              )}
                            </div>

                            <div className="max-h-52 overflow-y-auto space-y-2.5 border border-slate-150 dark:border-slate-850 rounded-2xl p-3 bg-slate-50 dark:bg-slate-950/40">
                              {relatedQ.map((q) => (
                                <div key={q.id} className="text-xs bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2.5 shadow-xs">
                                  <div className="flex justify-between text-[10px] font-bold text-slate-400">
                                    <span>Question ID: #{q.id}</span>
                                    <span>{q.block}</span>
                                  </div>
                                  <p className="font-extrabold text-slate-800 dark:text-slate-200">{q.question}</p>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-slate-850 mt-1">
                                    {q.options.map((opt, oIdx) => (
                                      <div 
                                        key={oIdx} 
                                        className={`p-1.5 px-2 rounded-lg text-[10.5px] flex items-center gap-1 font-semibold ${
                                          oIdx === q.correctOptionIndex 
                                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 border border-emerald-300/20 font-bold' 
                                            : 'text-slate-500'
                                        }`}
                                      >
                                        <span className="font-bold mr-1">{['A','B','C','D'][oIdx]}.</span>
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

        {/* FOOTER */}
        <div className="p-4 border-t border-slate-150 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-[11px] text-slate-400 font-bold text-center shrink-0 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>Canadian National Building Code • Part 9 (Housing & Small Buildings)</span>
          <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
            Press <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded font-mono text-[9px] uppercase font-bold text-slate-600 dark:text-slate-300">Esc</kbd> to close any time
          </span>
        </div>

      </div>
    </div>
  )
}
