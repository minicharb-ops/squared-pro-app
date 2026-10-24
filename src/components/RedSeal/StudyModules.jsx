import React, { useState, useEffect, useMemo } from 'react'
import { 
  Shield, 
  Compass, 
  Layers, 
  Hammer, 
  Home, 
  Grid, 
  RefreshCw, 
  CheckCircle, 
  Circle, 
  ChevronRight, 
  Trophy, 
  Award, 
  BookOpen, 
  Search,
  Check
} from 'lucide-react'
import questionsData from '../../data/RedSeal/questions.json'
import { HighlightedText } from '../../services/termHighlighterService'

// Mapping of icons to RSOS blocks
const BLOCK_ICONS = {
  'Block A': Shield,
  'Block B': Compass,
  'Block C': Layers,
  'Block D': Hammer,
  'Block E': Home,
  'Block F': Grid,
  'Block G': RefreshCw
}

// Visual theme configurations for each block
const BLOCK_COLORS = {
  'Block A': {
    primary: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    border: 'border-blue-100 dark:border-blue-900/40',
    bar: 'bg-blue-500'
  },
  'Block B': {
    primary: 'text-indigo-600 dark:text-indigo-400',
    bg: 'bg-indigo-50 dark:bg-indigo-950/30',
    border: 'border-indigo-100 dark:border-indigo-900/40',
    bar: 'bg-indigo-500'
  },
  'Block C': {
    primary: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    border: 'border-amber-100 dark:border-amber-900/40',
    bar: 'bg-amber-500'
  },
  'Block D': {
    primary: 'text-rose-600 dark:text-rose-400',
    bg: 'bg-rose-50 dark:bg-rose-950/30',
    border: 'border-rose-100 dark:border-rose-900/40',
    bar: 'bg-rose-500'
  },
  'Block E': {
    primary: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    border: 'border-emerald-100 dark:border-emerald-900/40',
    bar: 'bg-emerald-500'
  },
  'Block F': {
    primary: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-50 dark:bg-purple-950/30',
    border: 'border-purple-100 dark:border-purple-900/40',
    bar: 'bg-purple-500'
  },
  'Block G': {
    primary: 'text-sky-600 dark:text-sky-400',
    bg: 'bg-sky-50 dark:bg-sky-950/30',
    border: 'border-sky-100 dark:border-sky-900/40',
    bar: 'bg-sky-500'
  }
}

export default function StudyModules({ onSelectBlock, onOpenQuickRef }) {
  const [completedSubactivities, setCompletedSubactivities] = useState(() => {
    const saved = localStorage.getItem('red_seal_completed_subactivities')
    return saved ? JSON.parse(saved) : []
  })
  const [expandedBlock, setExpandedBlock] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('red_seal_completed_subactivities', JSON.stringify(completedSubactivities))
  }, [completedSubactivities])

  // RSOS Blocks definition with their respective sub-activities
  const blocksList = useMemo(() => [
    {
      id: 'Block A',
      title: 'Common Occupational Skills',
      weight: '11% of Exam',
      desc: 'Safety, tools, equipment, rigging, and access scaffolds.',
      subactivities: [
        { id: 'A-1', label: 'Uses and maintains tools and equipment' },
        { id: 'A-2', label: 'Organizes work' },
        { id: 'A-3', label: 'Performs safety-related and security activities' }
      ]
    },
    {
      id: 'Block B',
      title: 'Planning and Layout',
      weight: '9% of Exam',
      desc: 'Drawings, specifications, material takeoff, and layout.',
      subactivities: [
        { id: 'B-4', label: 'Interprets drawings and specifications' },
        { id: 'B-5', label: 'Performs planning and layout' }
      ]
    },
    {
      id: 'Block C',
      title: 'Concrete Formwork',
      weight: '14% of Exam',
      desc: 'Footings, walls, columns, stairs, and reinforcement.',
      subactivities: [
        { id: 'C-6', label: 'Erects and builds footings and foundations' },
        { id: 'C-7', label: 'Formwork for walls, columns, slabs, and stairs' },
        { id: 'C-8', label: 'Reinforcing and placement' }
      ]
    },
    {
      id: 'Block D',
      title: 'Framing',
      weight: '28% of Exam',
      desc: 'Floor, wall, roof, and stair framing (Highest Exam Weight).',
      subactivities: [
        { id: 'D-9', label: 'Floor framing layout, joists, and subfloor' },
        { id: 'D-10', label: 'Wall framing, studs, headers, and sheathing' },
        { id: 'D-11', label: 'Roof framing, rafters, trusses, and ceiling joists' },
        { id: 'D-12', label: 'Stair framing and staircases' }
      ]
    },
    {
      id: 'Block E',
      title: 'Exterior Finish',
      weight: '14% of Exam',
      desc: 'Siding, roofing, exterior doors, and windows.',
      subactivities: [
        { id: 'E-13', label: 'Roofing and flashing installation' },
        { id: 'E-14', label: 'Wall cladding, siding, trim, and flashing' },
        { id: 'E-15', label: 'Exterior doors and windows' }
      ]
    },
    {
      id: 'Block F',
      title: 'Interior Finish',
      weight: '13% of Exam',
      desc: 'Drywall, cabinet installation, trim, and doors.',
      subactivities: [
        { id: 'F-16', label: 'Interior walls, partitions, and gypsum board' },
        { id: 'F-17', label: 'Cabinetry, trim, moldings, and doors' },
        { id: 'F-18', label: 'Finish flooring materials' }
      ]
    },
    {
      id: 'Block G',
      title: 'Renovations',
      weight: '11% of Exam',
      desc: 'Demolition, shoring, underpinning, and tie-ins.',
      subactivities: [
        { id: 'G-19', label: 'Demolition and structural shoring' },
        { id: 'G-20', label: 'Framing structural tie-ins and underpinning' }
      ]
    }
  ], [])

  // Calculate stats for each block
  const blockStats = useMemo(() => {
    const safeCompleted = completedSubactivities || []
    return blocksList.map(block => {
      const totalSub = block.subactivities.length
      const completedSub = block.subactivities.filter(sub => safeCompleted.includes(sub.id)).length
      const percentage = totalSub > 0 ? Math.round((completedSub / totalSub) * 100) : 0
      
      // Calculate questions aligned with this block
      const questionsCount = questionsData.filter(q => q.block === block.id).length

      return {
        ...block,
        totalSub,
        completedSub,
        percentage,
        questionsCount
      }
    })
  }, [blocksList, completedSubactivities])

  // Calculate overall progress stats
  const overallStats = useMemo(() => {
    const totalSubactivities = blocksList.reduce((sum, block) => sum + block.subactivities.length, 0)
    const completedSubCount = (completedSubactivities || []).length
    const overallPercentage = totalSubactivities > 0 ? Math.round((completedSubCount / totalSubactivities) * 100) : 0
    const completedBlocksCount = blockStats.filter(b => b.percentage === 100).length

    return {
      totalSubactivities,
      completedSubCount,
      overallPercentage,
      completedBlocksCount,
      totalBlocks: blocksList.length
    }
  }, [blocksList, completedSubactivities, blockStats])

  // Filter based on search query
  const filteredBlocks = useMemo(() => {
    if (!searchQuery.trim()) return blockStats
    const query = searchQuery.toLowerCase()
    return blockStats.filter(b => 
      b.id.toLowerCase().includes(query) ||
      b.title.toLowerCase().includes(query) ||
      b.desc.toLowerCase().includes(query) ||
      b.subactivities.some(sub => sub.label.toLowerCase().includes(query))
    )
  }, [blockStats, searchQuery])

  // Helper to toggle subactivity status
  const toggleSubactivity = (subId) => {
    setCompletedSubactivities(prev => 
      prev.includes(subId) ? prev.filter(id => id !== subId) : [...prev, subId]
    )
  }

  // Toggle all subactivities inside a block
  const toggleAllInBlock = (block, isAllCompleted) => {
    const subIds = block.subactivities.map(sub => sub.id)
    if (isAllCompleted) {
      // Mark all as incomplete
      setCompletedSubactivities(prev => prev.filter(id => !subIds.includes(id)))
    } else {
      // Mark all as completed
      setCompletedSubactivities(prev => {
        const unique = new Set([...prev, ...subIds])
        return Array.from(unique)
      })
    }
  }

  return (
    <div className="space-y-6">
      
      {/* SECTION HEADER */}
      <div className="bg-gradient-to-r from-brand-600 to-brand-700 text-white rounded-2xl p-6 md:p-8 shadow-md">
        <div className="flex items-center space-x-3 mb-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <BookOpen size={24} className="text-white" />
          </div>
          <span className="text-xs uppercase font-extrabold tracking-widest text-brand-100 bg-brand-800/40 px-2.5 py-1 rounded-full">
            RSOS Competencies Tracker
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight">National Building Standards</h2>
        <p className="text-sm md:text-base text-brand-100 max-w-2xl mt-1 leading-relaxed">
          Monitor your mastery across all 7 Major Work Activities of the Red Seal Occupational Standard (RSOS).
        </p>
      </div>

      {/* OVERALL CURRICULUM PROGRESS CARD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Progress gauge/stats card */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 md:col-span-2 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">Total Curriculum Completion</span>
              <span className="text-2xl font-black text-brand-600 dark:text-brand-400">{overallStats.overallPercentage}%</span>
            </div>
            
            {/* Custom linear progress bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-4 rounded-full overflow-hidden mb-2 relative">
              <div 
                className="bg-brand-500 h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${overallStats.overallPercentage}%` }}
              />
            </div>
            
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Mastered <span className="text-brand-600 dark:text-brand-400 font-extrabold">{overallStats.completedSubCount}</span> of <span className="font-extrabold text-slate-800 dark:text-slate-200">{overallStats.totalSubactivities}</span> specific RSOS sub-activities.
            </p>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-850 pt-3 flex justify-between items-center text-xs">
            <div className="flex items-center space-x-1">
              <Trophy size={16} className="text-amber-500" />
              <span className="font-bold text-slate-600 dark:text-slate-300">
                {overallStats.completedBlocksCount} of {overallStats.totalBlocks} fully mastered Blocks
              </span>
            </div>
            {overallStats.overallPercentage === 100 ? (
              <span className="text-[10px] uppercase font-black bg-emerald-500 text-white px-2 py-0.5 rounded-md tracking-wider">
                Exam Ready!
              </span>
            ) : (
              <span className="text-[10px] text-slate-400 italic font-medium">Keep framing up your knowledge!</span>
            )}
          </div>
        </div>

        {/* Quick motivation/Exam alignment card */}
        <div className="bg-brand-950/90 dark:bg-slate-900 p-5 rounded-2xl border border-brand-850 dark:border-slate-800 text-white space-y-3 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center space-x-2 text-brand-300">
              <Award size={18} />
              <h4 className="font-black uppercase text-xs tracking-wider">Red Seal Blueprint</h4>
            </div>
            <p className="text-xs text-brand-100 dark:text-slate-300 mt-2 leading-relaxed font-semibold">
              The Red Seal exam evaluates you directly on these tasks. Focus on <strong className="text-brand-300">Block D (Framing)</strong> which constitutes <strong className="text-brand-300">28%</strong> of total grading!
            </p>
          </div>
          <button
            onClick={() => onSelectBlock && onSelectBlock('Block D')}
            className="w-full bg-brand-500 hover:bg-brand-600 dark:bg-brand-600 dark:hover:bg-brand-700 text-white font-bold py-2 rounded-xl text-xs transition-colors text-center block min-h-[44px]"
          >
            Study High-Weight Framing Block
          </button>
        </div>

      </div>

      {/* SEARCH AND FILTER */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={20} className="text-slate-400" />
        </div>
        <input
          type="text"
          placeholder="Filter modules by title, concept, or task (e.g., 'roofing')..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 min-h-[48px] text-slate-900 dark:text-white"
        />
      </div>

      {/* MODULES MASONRY GRID */}
      <div className="columns-1 lg:columns-2 gap-6 space-y-6 [column-fill:_balance]">
        {filteredBlocks.map((block) => {
          const IconComponent = BLOCK_ICONS[block.id] || Shield
          const theme = BLOCK_COLORS[block.id] || BLOCK_COLORS['Block A']
          const isFullyCompleted = block.percentage === 100
          const isExpanded = expandedBlock === block.id

          return (
            <div 
              key={block.id}
              className={`bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border transition-all flex flex-col justify-between break-inside-avoid ${
                isFullyCompleted 
                  ? 'border-emerald-300 dark:border-emerald-900/50 bg-emerald-500/[0.01]' 
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="space-y-4">
                {/* Header Row */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`${theme.bg} ${theme.primary} p-3 rounded-xl`}>
                      <IconComponent size={22} />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                          {block.id}
                        </span>
                        {isFullyCompleted && (
                          <span className="text-[9px] font-black uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                            <Check size={10} /> Complete
                          </span>
                        )}
                      </div>
                      <h3 className="font-extrabold text-slate-900 dark:text-white text-lg tracking-tight">
                        {block.title}
                      </h3>
                    </div>
                  </div>
                  <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full font-black text-slate-500 uppercase shrink-0">
                    {block.weight}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                  <HighlightedText text={block.desc} />
                </p>

                {/* Progress Indicator Block */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-600 dark:text-slate-400">Mastery Progress</span>
                    <span className="font-extrabold text-slate-800 dark:text-slate-200">{block.percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden relative">
                    <div 
                      className={`${theme.bar} h-full rounded-full transition-all duration-500 ease-out`}
                      style={{ width: `${block.percentage}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 italic">
                    {block.completedSub} of {block.totalSub} sub-tasks completed
                  </p>
                </div>

                {/* Expandable Sub-activities Panel */}
                <div className="border-t border-slate-100 dark:border-slate-850 pt-3">
                  <button
                    onClick={() => setExpandedBlock(isExpanded ? null : block.id)}
                    className="w-full flex items-center justify-between text-xs font-black uppercase text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 min-h-[36px]"
                  >
                    <span>RSOS Sub-activities Checklist</span>
                    <span className="text-xs font-bold text-brand-500 hover:underline">
                      {isExpanded ? 'Collapse' : 'Expand & Edit'}
                    </span>
                  </button>

                  {/* Checklist items */}
                  {(isExpanded || searchQuery) && (
                    <div className="space-y-2 mt-3 animate-fadeIn">
                      {block.subactivities.map((sub) => {
                        const isSubCompleted = (completedSubactivities || []).includes(sub.id)
                        return (
                          <div 
                            key={sub.id}
                            onClick={() => toggleSubactivity(sub.id)}
                            className={`flex items-start gap-3 p-2.5 rounded-lg border transition-all cursor-pointer ${
                              isSubCompleted 
                                ? 'bg-emerald-50/40 dark:bg-emerald-950/10 border-emerald-100 dark:border-emerald-950/40 text-slate-800 dark:text-slate-200'
                                : 'bg-slate-50 dark:bg-slate-850 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                          >
                            <button className="shrink-0 mt-0.5 min-h-[24px] min-w-[24px] flex items-center justify-center">
                              {isSubCompleted ? (
                                <CheckCircle size={18} className="text-emerald-500" />
                              ) : (
                                <Circle size={18} className="text-slate-400 dark:text-slate-600" />
                              )}
                            </button>
                            <div className="space-y-0.5 text-left">
                              <span className="text-[10px] font-mono font-black text-brand-500 dark:text-brand-400 bg-brand-500/10 px-1.5 py-0.5 rounded mr-1.5">
                                {sub.id}
                              </span>
                              <p className="text-xs font-bold leading-normal inline text-slate-800 dark:text-slate-200">
                                <HighlightedText text={sub.label} />
                              </p>
                            </div>
                          </div>
                        )
                      })}

                      {/* Quick action buttons for checklist */}
                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleAllInBlock(block, isFullyCompleted)
                          }}
                          className="text-[10px] font-black uppercase tracking-wider bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-300 px-2.5 py-1.5 rounded-md min-h-[32px]"
                        >
                          {isFullyCompleted ? 'Reset Block' : 'Mark Block Complete'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="border-t border-slate-100 dark:border-slate-850 mt-4 pt-3 flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
                  {block.questionsCount} Aligned Practice Questions
                </span>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => onOpenQuickRef && onOpenQuickRef(block.id)}
                    className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center gap-1 min-h-[36px] px-2.5 rounded-lg hover:bg-emerald-500/5 transition-colors"
                  >
                    <span>Quick Ref</span>
                  </button>
                  <button
                    onClick={() => onSelectBlock && onSelectBlock(block.id)}
                    className="text-xs font-black uppercase tracking-wider text-brand-500 hover:text-brand-600 flex items-center gap-1 min-h-[36px] px-2.5 rounded-lg hover:bg-brand-500/5 transition-colors"
                  >
                    <span>Notes & Codes</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          )
        })}

        {filteredBlocks.length === 0 && (
          <div className="col-span-full bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800">
            <span className="text-4xl">📚</span>
            <h3 className="text-lg font-black mt-4">No competency blocks matched your search</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-sm mx-auto text-sm">
              Try search keywords like "Safety", "Framing", "Interior", or single letter shortcuts.
            </p>
          </div>
        )}
      </div>

    </div>
  )
}
