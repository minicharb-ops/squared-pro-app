import React, { useState, useMemo, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { 
  Layers,
  Flame,
  Shield, 
  Grid, 
  Hammer, 
  Home, 
  Eye, 
  Anchor, 
  Compass, 
  Triangle, 
  Search, 
  ChevronRight, 
  BookOpen, 
  Info, 
  AlertTriangle,
  Paintbrush,
  X,
  Sparkles,
  ClipboardList,
  Lock,
  CheckCircle, Wind, BrickWall, Mountain, Wrench, Cylinder, AlignVerticalSpaceBetween, SplitSquareVertical, Thermometer, Droplets,
  Construction,
  Scale,
  Crosshair,
  Box,
  TrendingUp,
  ArrowDownToLine,
  LayoutGrid,
  Trees,
  Columns,
  Ruler,
  DoorOpen,
  Archive,
  PanelTop,
  Play,
  Blocks
} from 'lucide-react'
import specificsData from '../../data/RedSeal/structuralSpecifics.json'

// Category Icons Mapper — distinct trade icon for every topic
const CATEGORY_ICONS = {
  site_hoarding_heating: Flame,
  access_scaffolding: Construction,
  rigging_hoisting: Scale,
  surveying_layout: Crosshair,
  site_prep_retaining_walls: Mountain,
  concrete_formwork: Box,
  concrete_stairs: TrendingUp,
  footings: ArrowDownToLine,
  foundations: Shield,
  icf: Blocks,
  concrete_slabs: LayoutGrid,
  masonry_parging: BrickWall,
  beams_columns_piers: SplitSquareVertical,
  floor_systems: Grid,
  framing: Hammer,
  stairs: Compass,
  roof_systems: Triangle,
  heavy_mass_timber: Trees,
  light_gauge_steel: Columns,
  engineered_wood: Ruler,
  roof_coverings: Triangle,
  windows_doors: Eye,
  rain_screens_flashing: Droplets,
  exterior_finish: Wind,
  thermal_insulation: Thermometer,
  vapour_air_barriers: Wind,
  fire_separations: Flame,
  interior_finishes: Paintbrush,
  commercial_doors: DoorOpen,
  casework_millwork: Archive,
  suspended_ceilings: PanelTop,
  decks: Home,
  docks_boathouses: Anchor,
  structural_renovations: Wrench,
  blueprints: BookOpen
}

// Red Seal MWA Groupings & Exam Weights
const MWA_META = {
  'bg-amber-500': {
    filterKey: 'site_rigging',
    title: 'MWA A & B • SITE, RIGGING & LAYOUT',
    weight: '14% Exam',
    textClass: 'text-amber-600 dark:text-amber-400',
    borderClass: 'border-amber-500/30',
    bgClass: 'bg-amber-500/10 dark:bg-amber-950/40',
    dotClass: 'bg-amber-500'
  },
  'bg-emerald-500': {
    filterKey: 'concrete',
    title: 'MWA C • CONCRETE & FOUNDATIONS',
    weight: '19% Exam',
    textClass: 'text-emerald-600 dark:text-emerald-400',
    borderClass: 'border-emerald-500/30',
    bgClass: 'bg-emerald-500/10 dark:bg-emerald-950/40',
    dotClass: 'bg-emerald-500'
  },
  'bg-blue-500': {
    filterKey: 'framing',
    title: 'MWA D • FRAMING, STAIRS & ROOFS',
    weight: '28% Exam',
    textClass: 'text-blue-600 dark:text-blue-400',
    borderClass: 'border-blue-500/30',
    bgClass: 'bg-blue-500/10 dark:bg-blue-950/40',
    dotClass: 'bg-blue-500'
  },
  'bg-orange-500': {
    filterKey: 'envelope',
    title: 'MWA E • EXTERIOR ENVELOPE & THERMAL',
    weight: '17% Exam',
    textClass: 'text-orange-600 dark:text-orange-400',
    borderClass: 'border-orange-500/30',
    bgClass: 'bg-orange-500/10 dark:bg-orange-950/40',
    dotClass: 'bg-orange-500'
  },
  'bg-purple-500': {
    filterKey: 'interior',
    title: 'MWA F • INTERIOR, DOORS & MILLWORK',
    weight: '14% Exam',
    textClass: 'text-purple-600 dark:text-purple-400',
    borderClass: 'border-purple-500/30',
    bgClass: 'bg-purple-500/10 dark:bg-purple-950/40',
    dotClass: 'bg-purple-500'
  },
  'bg-slate-500': {
    filterKey: 'decks_renos',
    title: 'MWA G • DECKS, MARINE & RENOS',
    weight: '8% Exam',
    textClass: 'text-slate-600 dark:text-slate-300',
    borderClass: 'border-slate-500/30',
    bgClass: 'bg-slate-500/10 dark:bg-slate-800/60',
    dotClass: 'bg-slate-400'
  }
}

const getScenarioCount = (item) => Math.max(3, (item.codeRequirements?.length || 0) % 8 + 3)

const getItemMwaKey = (item) => {
  const meta = MWA_META[item.iconBgClass]
  return meta ? meta.filterKey : 'decks_renos'
}

export default function StructuralSpecifics() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGroup, setSelectedGroup] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState(specificsData[0])
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [activeModalInfo, setActiveModalInfo] = useState(null)

  // Persistent Mastery State per Topic
  const [masteredMap, setMasteredMap] = useState(() => {
    try {
      const saved = localStorage.getItem('red_seal_specifics_mastery')
      return saved ? JSON.parse(saved) : {}
    } catch (e) {
      return {}
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('red_seal_specifics_mastery', JSON.stringify(masteredMap))
    } catch (e) {}
  }, [masteredMap])

  // Lock background scroll when modal is open
  useEffect(() => {
    if (detailModalOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [detailModalOpen])

  // Overall Mastery Summary Calculations
  const { totalMastered, totalItems, masteryPct, firstUnmasteredTopic } = useMemo(() => {
    let masteredSum = 0
    let itemsSum = 0
    let firstUnmastered = null

    specificsData.forEach(item => {
      const sCount = getScenarioCount(item)
      const mCount = Math.min(sCount, masteredMap[item.id] || 0)
      masteredSum += mCount
      itemsSum += sCount
      if (!firstUnmastered && mCount < sCount) {
        firstUnmastered = item
      }
    })

    const pct = itemsSum > 0 ? Math.round((masteredSum / itemsSum) * 100) : 0
    return {
      totalMastered: masteredSum,
      totalItems: itemsSum,
      masteryPct: pct,
      firstUnmasteredTopic: firstUnmastered || specificsData[0]
    }
  }, [masteredMap])

  const FILTER_PILLS = useMemo(() => [
    { label: `All (${specificsData.length})`, value: 'all' },
    { label: 'Site & Rigging', value: 'site_rigging' },
    { label: 'Concrete', value: 'concrete' },
    { label: 'Framing', value: 'framing' },
    { label: 'Envelope', value: 'envelope' },
    { label: 'Interior', value: 'interior' },
    { label: 'Decks & Renos', value: 'decks_renos' }
  ], [])

  // Filter logic
  const filteredCategories = useMemo(() => {
    return specificsData.filter(item => {
      const groupMatch = selectedGroup === 'all' || getItemMwaKey(item) === selectedGroup
      const itemTitle = item.title || item.category
      const itemSub = item.subTitle || item.subCategory
      const itemProc = item.jobsiteProcess || item.generalProcess
      const itemTip = item.journeymanProTip || ''
      
      const textMatch = searchQuery === '' || 
        itemTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        itemSub.toLowerCase().includes(searchQuery.toLowerCase()) ||
        itemProc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (Array.isArray(itemTip) 
          ? itemTip.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
          : itemTip.toLowerCase().includes(searchQuery.toLowerCase()))

      return groupMatch && textMatch
    })
  }, [searchQuery, selectedGroup])

  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat)
    setDetailModalOpen(true)
  }

  const handleToggleTopicMastery = (item) => {
    const sCount = getScenarioCount(item)
    setMasteredMap(prev => {
      const current = prev[item.id] || 0
      const nextVal = current >= sCount ? 0 : sCount
      return { ...prev, [item.id]: nextVal }
    })
  }

  // Highlight helper for search text
  const Highlight = ({ text, search }) => {
    if (!search || !text) return <span>{text}</span>
    const parts = text.toString().split(new RegExp(`(${search})`, 'gi'))
    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === search.toLowerCase() ? 
            <span key={i} className="bg-amber-200 dark:bg-amber-500/40 text-amber-900 dark:text-amber-100 rounded-sm px-0.5">{part}</span> : part
        )}
      </span>
    )
  }

  return (
    <div className="flex flex-col h-full w-full max-w-7xl mx-auto space-y-3">
      
      {/* 1. OVERALL RED SEAL MASTERY PROGRESS CARD & QUICK CATEGORY FILTER BAR */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-3.5 shadow-sm space-y-2.5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase whitespace-nowrap">
              RED SEAL MASTERY
            </span>
            <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white whitespace-nowrap mt-0.5">
              {totalMastered} / {totalItems} Mastered <span className="text-cyan-600 dark:text-cyan-400 font-mono">({masteryPct}%)</span>
            </span>
          </div>
          <button
            type="button"
            onClick={() => firstUnmasteredTopic && handleSelectCategory(firstUnmasteredTopic)}
            className="px-3 py-1.5 rounded-full text-[11px] font-bold bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-700 dark:text-cyan-300 flex items-center gap-1.5 whitespace-nowrap shrink-0 active:scale-95 transition-all"
          >
            <Play size={11} className="fill-current" />
            <span>Resume Next</span>
          </button>
        </div>

        <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-300"
            style={{ width: `${Math.max(masteryPct, totalMastered > 0 ? 3 : 0)}%` }}
          />
        </div>

        {/* Category Filter Pill Bar (Wrapping 2-Row Flex, No Scrollbar) */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {FILTER_PILLS.map(pill => {
            const isSelected = selectedGroup === pill.value
            return (
              <button
                key={pill.value}
                type="button"
                onClick={() => setSelectedGroup(pill.value)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap shrink-0 border transition-all active:scale-95 ${
                  isSelected
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-cyan-500/50'
                }`}
              >
                {pill.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Modal for Tool Info */}
      {activeModalInfo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setActiveModalInfo(null)}>
          <div className="bg-white dark:bg-[#121212] border border-slate-300 dark:border-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl flex flex-col max-h-[85vh]" onClick={(e) => e.stopPropagation()}>
            
            {/* Modal Header (Fixed) */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-4 shrink-0">
              <div className="flex items-center gap-3">
                <div className="text-2xl">{activeModalInfo.icon}</div>
                <h3 className="text-slate-900 dark:text-white text-lg font-bold uppercase tracking-wider">{activeModalInfo.title}</h3>
              </div>
              <button onClick={() => setActiveModalInfo(null)} className="text-red-500 hover:text-red-400 text-xl font-bold p-1">✕</button>
            </div>

            {/* Modal Content (Scrollable) */}
            <div className="flex flex-col gap-5 overflow-y-auto pr-2 custom-scrollbar">
              {/* Definition Section */}
              <div>
                <h4 className="text-cyan-600 dark:text-cyan-400 text-xs font-bold uppercase tracking-widest mb-2">Definition</h4>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">{activeModalInfo.definition}</p>
              </div>

              {/* Example Case Section */}
              <div className="bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-lg p-4">
                <h4 className="text-cyan-600 dark:text-cyan-400 text-xs font-bold uppercase tracking-widest mb-2">Example Case</h4>
                <p className="text-slate-600 dark:text-slate-300 text-sm italic">"{activeModalInfo.exampleCase}"</p>
              </div>

              {/* Safety / Pro-Tip Section */}
              <div className="bg-cyan-50 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-900/50 rounded-lg p-4">
                <h4 className="text-cyan-700 dark:text-cyan-400 text-xs font-bold uppercase tracking-widest mb-2">Safety / Pro-Tip</h4>
                <p className="text-slate-800 dark:text-slate-200 text-sm font-semibold">{activeModalInfo.proTip}</p>
              </div>
            </div>

            {/* Action Button (Fixed Bottom) */}
            <div className="pt-4 mt-auto shrink-0">
              <button 
                onClick={() => setActiveModalInfo(null)}
                className="w-full py-3 rounded-xl font-bold bg-cyan-500 dark:bg-cyan-400 text-white dark:text-black hover:bg-cyan-600 dark:hover:bg-cyan-300 active:bg-cyan-700 transition-colors shadow-lg dark:shadow-[0_0_15px_rgba(34,211,238,0.4)]"
              >
                GOT IT
              </button>
            </div>

          </div>
        </div>
      )}

      {/* OUTER LIST CARD CONTAINER WITH OVERFLOW-HIDDEN */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 overflow-hidden shadow-xl">
        <div className="w-full bg-white dark:bg-[#121520] overflow-y-auto custom-scrollbar flex flex-col">
          
          {filteredCategories.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center h-full">
              <Search size={32} className="text-slate-300 dark:text-slate-700 mb-3" />
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400">No components found</p>
              <button 
                onClick={() => { setSearchQuery(''); setSelectedGroup('all'); }}
                className="mt-3 text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="flex flex-col">
              {filteredCategories.map((item, index) => {
                const Icon = CATEGORY_ICONS[item.id] || Layers;
                const iconBgClass = item.iconBgClass || 'bg-slate-500';
                const prevItem = index > 0 ? filteredCategories[index - 1] : null;
                const showMwaHeader = !prevItem || prevItem.iconBgClass !== item.iconBgClass;
                const mwaInfo = MWA_META[iconBgClass] || MWA_META['bg-slate-500'];

                const scenarioCount = getScenarioCount(item);
                const masteredCount = Math.min(scenarioCount, masteredMap[item.id] || 0);
                const progress = scenarioCount > 0 ? (masteredCount / scenarioCount) * 100 : 0;
                const displayTitle = (item.title || item.category || '').replace('Windows, Doors, Hatches & Skylights', 'Windows, Doors & Skylights');
                
                return (
                  <React.Fragment key={item.id}>
                    {showMwaHeader && (
                      <div className={`flex items-center justify-between gap-2 px-3.5 py-2 border-y ${mwaInfo.borderClass} ${mwaInfo.bgClass}`}>
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={`w-2 h-2 rounded-full shrink-0 ${mwaInfo.dotClass}`} />
                          <span className={`truncate text-[11px] font-extrabold tracking-wider uppercase ${mwaInfo.textClass}`}>
                            {mwaInfo.title}
                          </span>
                        </div>
                        <span className={`shrink-0 whitespace-nowrap text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-black/30 ${mwaInfo.textClass}`}>
                          {mwaInfo.weight}
                        </span>
                      </div>
                    )}
                    <div 
                      className="flex items-center justify-between p-3.5 sm:p-4 bg-white dark:bg-[#1e2330] hover:bg-slate-50 dark:hover:bg-[#252b3b] border-b border-slate-200 dark:border-slate-800 last:border-b-0 cursor-pointer transition-colors" 
                      onClick={() => handleSelectCategory(item)}
                    >
                      <div className="flex items-center gap-3.5 min-w-0 flex-1 pr-2">
                        {/* Tool Icon */}
                        <div className={`p-2 rounded-lg shrink-0 ${iconBgClass}`}>
                          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        {/* Text Content */}
                        <div className="min-w-0 flex-1 pr-2">
                          <h4 className="text-slate-900 dark:text-white font-bold text-sm sm:text-base truncate whitespace-nowrap">
                            <Highlight text={displayTitle} search={searchQuery} />
                          </h4>
                          <div className="flex items-center gap-2.5 mt-0.5">
                            <p className="text-slate-500 dark:text-slate-400 text-xs whitespace-nowrap">
                              {masteredCount}/{scenarioCount} Mastered
                            </p>
                            {/* Inline Mini Progress Bar */}
                            <div className="w-16 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700/60 overflow-hidden shrink-0">
                              <div
                                className={`h-full rounded-full transition-all duration-300 ${iconBgClass}`}
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Action Icons */}
                      <div className="flex items-center gap-2 shrink-0">
                        {item.modalData && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveModalInfo({
                                ...item.modalData,
                                title: (item.modalData.title || displayTitle).replace('Windows, Doors, Hatches & Skylights', 'Windows, Doors & Skylights'),
                                icon: <Icon className={item.modalData.iconColor || "text-emerald-400"} />
                              });
                            }}
                            className="p-1.5 rounded-full text-slate-400 hover:text-cyan-500 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all shrink-0"
                          >
                            <Info className="w-5 h-5"/>
                          </button>
                        )}
                        <ChevronRight className="w-5 h-5 text-slate-400 dark:text-slate-500 shrink-0"/>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* DETAILED DRILL DOWN OVERLAY MODAL */}
      {detailModalOpen && selectedCategory && createPortal(
        <div 
          onClick={() => setDetailModalOpen(false)}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col z-10 text-slate-900 dark:text-slate-100 animate-slideUp"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 p-5 shrink-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-brand-500/80 bg-brand-500/5 px-2.5 py-1 rounded border border-brand-500/10">
                Detailed NBC Reference Guide
              </span>
              <button 
                onClick={() => setDetailModalOpen(false)}
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 hover:text-slate-700 dark:hover:text-white transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content Area */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              <CategoryDetailView category={selectedCategory} searchQuery={searchQuery} />
            </div>

            {/* Footer */}
            <div className="border-t border-slate-100 dark:border-slate-800 p-4 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between gap-3 shrink-0">
              <button
                type="button"
                onClick={() => handleToggleTopicMastery(selectedCategory)}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                  (masteredMap[selectedCategory.id] || 0) >= getScenarioCount(selectedCategory)
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
                }`}
              >
                <CheckCircle size={14} />
                <span>
                  {(masteredMap[selectedCategory.id] || 0) >= getScenarioCount(selectedCategory)
                    ? 'Topic Mastered ✓'
                    : 'Mark Topic Mastered'}
                </span>
              </button>
              <button
                onClick={() => setDetailModalOpen(false)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-750 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all"
              >
                Close Reference
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  )
}

// Sub-component to render the specific details of a category
function CategoryDetailView({ category, searchQuery }) {
  const Icon = CATEGORY_ICONS[category.id] || Layers
  const isDummyShell = !category.journeymanProTip

  return (
    <div className="space-y-6 text-left">
      
      {/* Title & Badge */}
      <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex gap-3.5">
          <div className="p-3 bg-brand-500 text-white rounded-2xl shrink-0 h-fit">
            <Icon size={24} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap gap-1.5 mb-1.5">
              {(category.tags || ['NBC PART 9']).map((tag, idx) => (
                <span key={idx} className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-lg border border-slate-200/50 dark:border-slate-750">
                  {tag}
                </span>
              ))}
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none">
              <Highlight text={category.title || category.category} search={searchQuery} />
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider mt-1.5">
              <Highlight text={category.subTitle || category.subCategory} search={searchQuery} />
            </p>
          </div>
        </div>
      </div>

      {/* Warning/Shell banner for incomplete guides */}
      {isDummyShell && (
        <div className="bg-amber-500/10 text-amber-700 dark:text-amber-400 p-4 rounded-xl border border-amber-500/20 text-xs font-bold leading-relaxed flex items-start gap-2.5">
          <AlertTriangle size={18} className="shrink-0 text-amber-500 mt-0.5" />
          <div>
            <p className="uppercase tracking-wider font-black">Code Shell Reference</p>
            <p className="font-medium mt-0.5">This category is currently in foundational shell status. Extensive, localized framing calculations and specific OBC cross-references are being scheduled for integration in the next technical revision. Refer to Decks and Footings for complete live examples!</p>
          </div>
        </div>
      )}

      {/* Interactive Blueprint Diagram */}
      <div className="space-y-2">
        <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
          <Layers size={14} className="text-brand-500" /> Interactive Blueprint & Specifications
        </h4>
        <StructuralDiagram id={category.id} />
      </div>

      {/* General Assembly & Jobsite Process */}
      <div className="space-y-2">
        <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
          <Sparkles size={14} className="text-amber-500 fill-amber-500" /> Jobsite Process & Assembly
        </h4>
        <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-150 dark:border-slate-850 shadow-inner">
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
            <Highlight text={category.jobsiteProcess || category.generalProcess} search={searchQuery} />
          </p>
        </div>
      </div>

      {/* Rigid Code Requirements */}
      <div className="space-y-3">
        <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
          <BookOpen size={14} className="text-brand-500" /> Building Code Requirements
        </h4>
        <div className="space-y-2">
          {category.codeRequirements.map((req, i) => (
            <div 
              key={i}
              className="bg-slate-50/50 dark:bg-slate-900/40 border border-slate-150/60 dark:border-slate-800/80 p-3.5 rounded-xl flex items-start gap-3 transition-all hover:bg-slate-100 dark:hover:bg-slate-850"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 shrink-0" />
              <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-semibold">
                <Highlight text={req} search={searchQuery} />
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Helpful Tolerance Tips Card */}
      <div className="bg-blue-600 border border-blue-500 rounded-xl p-4 text-white flex items-start gap-3.5 shadow-md">
        <Info size={20} className="shrink-0 text-amber-300 mt-0.5" />
        <div className="space-y-1">
          <h5 className="font-black text-xs uppercase tracking-wider text-amber-300">
            Journeyman Pro-Tip & Tolerance
          </h5>
          {Array.isArray(category.journeymanProTip) ? (
            <div className="space-y-2">
              {category.journeymanProTip.map((tip, idx) => (
                <p key={idx} className="text-[11px] text-blue-50 leading-relaxed font-semibold">
                  <Highlight text={tip} search={searchQuery} />
                </p>
              ))}
            </div>
          ) : (
            <p className="text-[11px] text-blue-50 leading-relaxed font-semibold">
              <Highlight text={category.journeymanProTip || "When setting up physical elements, double-check that your work stays within structural tolerances: +/- 3mm plumb on walls up to 10ft, and clean square framing checks. Never substitute adhesive for proper mechanical fasteners!"} search={searchQuery} />
            </p>
          )}
        </div>
      </div>

    </div>
  )
}

// Interactive custom vector blueprint diagram sub-component
function StructuralDiagram({ id }) {
  // Common Grid Pattern Backdrop for Blueprint Aesthetics
  const gridBackground = (
    <defs>
      <pattern id="blueprint_grid" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.5" strokeOpacity="0.4" />
      </pattern>
    </defs>
  )

  switch (id) {
        case 'beams_columns_piers':
      return (
        <div className="border border-slate-200 dark:border-slate-800 bg-slate-900 rounded-xl overflow-hidden shadow-inner p-1">
          <svg viewBox="0 0 400 300" className="w-full h-full drop-shadow-md bg-slate-900 rounded-xl p-2 font-sans select-none">
            {/* Background/Base Soil */}
            <rect x="20" y="240" width="360" height="40" fill="#1e293b" rx="4" />
            <text x="200" y="265" fill="#94a3b8" fontSize="12" textAnchor="middle" className="font-semibold tracking-widest">UNDISTURBED SOIL</text>

            {/* Concrete Pad Footing */}
            <rect x="140" y="200" width="120" height="40" fill="#475569" rx="4" />
            <line x1="265" y1="220" x2="295" y2="220" stroke="#fcd34d" strokeWidth="1" />
            <text x="300" y="220" fill="#fcd34d" stroke="#0f172a" strokeWidth="3" paintOrder="stroke fill" fontSize="9" textAnchor="start" dominantBaseline="middle" className="font-bold">CONCRETE PAD FOOTING / PIER</text>

            {/* Steel Base Plate */}
            <rect x="175" y="195" width="50" height="5" fill="#cbd5e1" />
            <line x1="170" y1="197" x2="165" y2="197" stroke="#38bdf8" strokeWidth="1" />
            <text x="5%" y="197" fill="#38bdf8" stroke="#0f172a" strokeWidth="3" paintOrder="stroke fill" fontSize="8" textAnchor="start" dominantBaseline="middle" className="font-bold">STEEL BASE PLATE FASTENED TO CONCRETE</text>

            {/* Steel Telepost */}
            <rect x="190" y="110" width="20" height="85" fill="#94a3b8" />
            <line x1="215" y1="150" x2="245" y2="150" stroke="#38bdf8" strokeWidth="1" />
            <text x="250" y="150" fill="#38bdf8" stroke="#0f172a" strokeWidth="3" paintOrder="stroke fill" fontSize="9" textAnchor="start" dominantBaseline="middle" className="font-bold">STEEL PIPE COLUMN (TELEPOST)</text>

            {/* Threaded Post Cap */}
            <rect x="192" y="90" width="16" height="20" fill="#64748b" />
            <rect x="175" y="85" width="50" height="5" fill="#cbd5e1" />
            <line x1="170" y1="92" x2="155" y2="92" stroke="#38bdf8" strokeWidth="1" />
            <text x="5%" y="92" fill="#38bdf8" stroke="#0f172a" strokeWidth="3" paintOrder="stroke fill" fontSize="9" textAnchor="start" dominantBaseline="middle" className="font-bold">ADJUSTABLE THREADED POST CAP</text>

            {/* Top Beam */}
            <rect x="60" y="45" width="280" height="40" fill="#d97706" />
            <line x1="200" y1="40" x2="200" y2="20" stroke="#fcd34d" strokeWidth="1" />
            <text x="200" y="15" fill="#fcd34d" stroke="#0f172a" strokeWidth="3" paintOrder="stroke fill" fontSize="9" textAnchor="middle" dominantBaseline="middle" className="font-bold">BUILT-UP WOOD BEAM (OR STEEL W-SHAPE)</text>

            {/* Bearing Dimension */}
            <line x1="175" y1="75" x2="225" y2="75" stroke="#fbbf24" strokeWidth="1" strokeDasharray="2" />
            <line x1="175" y1="70" x2="175" y2="80" stroke="#fbbf24" strokeWidth="1" />
            <line x1="225" y1="70" x2="225" y2="80" stroke="#fbbf24" strokeWidth="1" />
            <text x="260" y="75" fill="#fbbf24" stroke="#0f172a" strokeWidth="3" paintOrder="stroke fill" fontSize="9" textAnchor="start" dominantBaseline="middle" className="font-bold">MIN 89mm (3.5") BEARING</text>
            <line x1="225" y1="75" x2="255" y2="75" stroke="#fbbf24" strokeWidth="1" />

          </svg>
        </div>
      )

                                    case 'surveying_layout':
                                      return (
                                        <div className="border border-slate-200 dark:border-slate-800 bg-slate-900 rounded-xl overflow-hidden shadow-inner p-1">
<svg viewBox="0 0 1000 500" className="w-full h-full drop-shadow-md bg-slate-900 rounded-xl p-2 font-sans select-none">
            {/* Benchmark */}
            <path d="M 750 400 L 850 400 L 860 480 L 740 480 Z" fill="#94a3b8" stroke="#475569" strokeWidth="2" />
            <circle cx="800" cy="400" r="5" fill="#f59e0b" />
            {/* Leveling Rod */}
            <rect x="790" y="50" width="20" height="350" fill="#f8fafc" stroke="#1e293b" strokeWidth="2" />
            <path d="M 790 100 L 810 100 M 790 150 L 810 150 M 790 200 L 810 200 M 790 250 L 810 250 M 790 300 L 810 300 M 790 350 L 810 350" stroke="#ef4444" strokeWidth="4" />
            {/* Tripod */}
            <line x1="200" y1="250" x2="150" y2="450" stroke="#f59e0b" strokeWidth="6" strokeLinecap="round" />
            <line x1="200" y1="250" x2="250" y2="450" stroke="#f59e0b" strokeWidth="6" strokeLinecap="round" />
            <line x1="200" y1="250" x2="200" y2="430" stroke="#d97706" strokeWidth="6" strokeLinecap="round" />
            {/* Builder's Level */}
            <rect x="170" y="240" width="60" height="10" fill="#475569" />
            <rect x="150" y="210" width="100" height="30" fill="#cbd5e1" rx="4" />
            <circle cx="200" cy="225" r="10" fill="#38bdf8" />
            {/* Line of Sight */}
            <line x1="250" y1="225" x2="790" y2="225" stroke="#38bdf8" strokeWidth="2" strokeDasharray="10 5" />
            
            {/* Callouts (Left) */}
            <line x1="150" y1="220" x2="45%" y2="150" stroke="#f8fafc" strokeWidth="2" />
            <text x="5%" y="150" fontSize="36" textAnchor="start" dominantBaseline="middle" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold">BUILDER'S LEVEL (TRANSIT)</text>
            
            <line x1="150" y1="350" x2="45%" y2="350" stroke="#f8fafc" strokeWidth="2" />
            <text x="5%" y="350" fontSize="36" textAnchor="start" dominantBaseline="middle" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold">ADJUSTABLE TRIPOD</text>
            
            {/* Callouts (Right) */}
            <line x1="810" y1="150" x2="55%" y2="150" stroke="#f8fafc" strokeWidth="2" />
            <text x="95%" y="150" fontSize="36" textAnchor="end" dominantBaseline="middle" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold">GRADUATED LEVELING ROD</text>
            
            <line x1="810" y1="400" x2="55%" y2="400" stroke="#f8fafc" strokeWidth="2" />
            <text x="95%" y="400" fontSize="36" textAnchor="end" dominantBaseline="middle" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold">KNOWN BENCHMARK (BM)</text>
            
            <line x1="500" y1="225" x2="55%" y2="300" stroke="#f8fafc" strokeWidth="2" />
            <text x="95%" y="300" fontSize="36" textAnchor="end" dominantBaseline="middle" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold">LEVEL LINE OF SIGHT</text>
          </svg>
        </div>
      )

                                    case 'rigging_hoisting':
                                      return (
                                        <div className="border border-slate-200 dark:border-slate-800 bg-slate-900 rounded-xl overflow-hidden shadow-inner p-1">
<svg viewBox="0 0 1000 550" className="w-full h-full drop-shadow-md bg-slate-900 rounded-xl p-2 font-sans select-none">
            {/* Steel Beam */}
            <rect x="200" y="350" width="600" height="40" fill="#94a3b8" rx="4" />
            <rect x="200" y="340" width="600" height="10" fill="#cbd5e1" rx="2" />
            <rect x="200" y="390" width="600" height="10" fill="#cbd5e1" rx="2" />
            {/* Slings */}
            <line x1="500" y1="140" x2="250" y2="340" stroke="#fbbf24" strokeWidth="8" strokeLinecap="round" />
            <line x1="500" y1="140" x2="750" y2="340" stroke="#fbbf24" strokeWidth="8" strokeLinecap="round" />
            {/* Crane Hook */}
            <circle cx="500" cy="40" r="15" fill="none" stroke="#94a3b8" strokeWidth="8" />
            <path d="M 500 55 C 500 55, 530 55, 530 100 C 530 150, 460 150, 460 170 C 460 190, 490 190, 490 190 C 510 190, 520 170, 520 160" fill="none" stroke="#94a3b8" strokeWidth="16" strokeLinecap="round" />
            {/* Safety Latch */}
            <line x1="520" y1="100" x2="490" y2="175" stroke="#f43f5e" strokeWidth="6" />
            {/* COG */}
            <g transform="translate(500, 370)">
              <circle cx="0" cy="0" r="15" fill="#f8fafc" stroke="#1e293b" strokeWidth="2"/>
              <path d="M 0 0 L 15 0 A 15 15 0 0 1 0 15 Z" fill="#1e293b"/>
              <path d="M 0 0 L -15 0 A 15 15 0 0 1 0 -15 Z" fill="#1e293b"/>
            </g>
            {/* Horizontal Reference Line & Angle Arcs */}
            <line x1="150" y1="340" x2="850" y2="340" stroke="#38bdf8" strokeWidth="2" strokeDasharray="6 4" />
            <path d="M 310 340 A 60 60 0 0 0 285 292" fill="none" stroke="#38bdf8" strokeWidth="3" />
            <text x="320" y="325" fontSize="28" fill="#38bdf8" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold">60°</text>
            
            {/* Callouts (Left) */}
            <line x1="480" y1="100" x2="45%" y2="100" stroke="#f8fafc" strokeWidth="2" />
            <text x="5%" y="100" fontSize="36" textAnchor="start" dominantBaseline="middle" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold">CRANE HOOK WITH SAFETY LATCH</text>
            
            <line x1="285" y1="292" x2="45%" y2="250" stroke="#f8fafc" strokeWidth="2" />
            <text x="5%" y="250" fontSize="36" textAnchor="start" dominantBaseline="middle" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold">60° SLING ANGLE (OPTIMAL)</text>
            
            {/* Callouts (Right) */}
            <line x1="625" y1="240" x2="55%" y2="240" stroke="#f8fafc" strokeWidth="2" />
            <text x="95%" y="240" fontSize="36" textAnchor="end" dominantBaseline="middle" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold">WIRE ROPE SLING</text>
            
            <line x1="500" y1="385" x2="500" y2="450" stroke="#f8fafc" strokeWidth="2" />
            <line x1="500" y1="450" x2="55%" y2="450" stroke="#f8fafc" strokeWidth="2" />
            <text x="95%" y="450" fontSize="36" textAnchor="end" dominantBaseline="middle" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold">CENTER OF GRAVITY (COG)</text>
          </svg>
        </div>
      )

                                    case 'access_scaffolding':
      return (
        <div className="border border-slate-200 dark:border-slate-800 bg-slate-900 rounded-xl overflow-hidden shadow-inner p-1">
          <svg viewBox="-260 -100 1000 400" className="w-full h-full drop-shadow-md bg-slate-900 rounded-xl p-2 font-sans select-none">
            {/* Scaffold Setup Profile */}

            {/* Ground */}
            <rect x="0" y="270" width="300" height="20" fill="#475569" />

            {/* Mudsill */}
            <rect x="70" y="260" width="160" height="10" fill="#b45309" />

            {/* Adjustable Base Plates */}
            <rect x="90" y="250" width="30" height="10" fill="#94a3b8" />
            <rect x="180" y="250" width="30" height="10" fill="#94a3b8" />

            {/* Screw Jacks */}
            <rect x="100" y="220" width="10" height="30" fill="#cbd5e1" />
            <rect x="190" y="220" width="10" height="30" fill="#cbd5e1" />

            {/* Vertical Frames */}
            <rect x="95" y="40" width="20" height="180" fill="#fbbf24" />
            <rect x="185" y="40" width="20" height="180" fill="#fbbf24" />

            {/* X-Braces (side view approximation) */}
            <line x1="105" y1="60" x2="195" y2="200" stroke="#f59e0b" strokeWidth="6" />
            <line x1="105" y1="200" x2="195" y2="60" stroke="#f59e0b" strokeWidth="6" />

            {/* Frame Horizontals */}
            <rect x="95" y="195" width="110" height="10" fill="#fbbf24" />
            <rect x="95" y="115" width="110" height="10" fill="#fbbf24" />
            <rect x="95" y="40" width="110" height="15" fill="#fbbf24" /> {/* Top platform support */}

            {/* Scaffold Planks (cleated/overhanging) */}
            <rect x="70" y="25" width="160" height="15" fill="#d97706" />

            {/* Toe Board */}
            <rect x="185" y="10" width="15" height="15" fill="#b45309" />
            <rect x="100" y="10" width="15" height="15" fill="#b45309" /> {/* Other side toe board */}

            {/* Guardrail Posts */}
            <rect x="95" y="-60" width="10" height="85" fill="#fbbf24" />
            <rect x="195" y="-60" width="10" height="85" fill="#fbbf24" />

            {/* Top Guardrail */}
            <rect x="90" y="-60" width="120" height="10" fill="#f59e0b" />
            
            {/* Mid Rail */}
            <rect x="90" y="-20" width="120" height="10" fill="#f59e0b" />

            {/* Callouts */}

            {/* TOP GUARDRAIL (900mm - 1070mm) */}
            <line x1="90" y1="-55" x2="-20" y2="-55" stroke="#f8fafc" strokeWidth="1" />
            <text x="-25" y="-55" fontSize="13" textAnchor="end" dominantBaseline="middle" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold">TOP GUARDRAIL (900mm - 1070mm)</text>

            {/* TOE BOARD (MIN 89mm / 3.5" HIGH) */}
            <line x1="200" y1="17" x2="350" y2="17" stroke="#f8fafc" strokeWidth="1" />
            <text x="355" y="17" fontSize="13" textAnchor="start" dominantBaseline="middle" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold">TOE BOARD (MIN 89mm / 3.5" HIGH)</text>

            {/* SCAFFOLD PLANKS (CLEATED OR OVERHANG 150mm - 300mm) */}
            <line x1="230" y1="32" x2="350" y2="32" stroke="#f8fafc" strokeWidth="1" />
            <text x="355" y="32" fontSize="13" textAnchor="start" dominantBaseline="middle" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold">SCAFFOLD PLANKS (CLEATED OR OVERHANG 150mm - 300mm)</text>

            {/* BASE PLATE ON 2x10 MUDSILL */}
            <line x1="90" y1="255" x2="-20" y2="255" stroke="#f8fafc" strokeWidth="1" />
            <text x="-25" y="255" fontSize="13" textAnchor="end" dominantBaseline="middle" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold">BASE PLATE ON 2x10 MUDSILL</text>

          </svg>
        </div>
      )

    case 'interior_finishes':
      return (
        <div className="border border-slate-200 dark:border-slate-800 bg-slate-900 rounded-xl overflow-hidden shadow-inner p-1">
          <svg viewBox="-50 20 800 240" className="w-full h-full drop-shadow-md bg-slate-900 rounded-xl p-2 font-sans select-none">
            {/* Top-down Cross-section of Door Jamb */}

            <g transform="translate(100, 0)">
              {/* Drywall Left (Room 1) */}
              <rect x="150" y="20" width="15" height="100" fill="#cbd5e1" />
              <rect x="335" y="20" width="15" height="100" fill="#cbd5e1" />

              {/* Drywall Right (Room 2) */}
              <rect x="150" y="220" width="15" height="60" fill="#cbd5e1" />
              <rect x="335" y="220" width="15" height="60" fill="#cbd5e1" />

              {/* Rough Framing Stud (King/Jack) */}
              <rect x="165" y="20" width="170" height="40" fill="#d97706" />
              <rect x="165" y="60" width="170" height="40" fill="#d97706" />

              <rect x="165" y="240" width="170" height="40" fill="#d97706" />

              {/* Gap for Door */}
              
              {/* Wood Shims */}
              <polygon points="165,100 165,115 250,110 250,105" fill="#fcd34d" />
              <polygon points="335,100 335,115 250,110 250,105" fill="#fcd34d" />

              {/* Pre-hung Door Jamb */}
              <rect x="160" y="115" width="180" height="25" fill="#b45309" />
              {/* Door Stop */}
              <rect x="240" y="140" width="15" height="15" fill="#b45309" />

              {/* Door Slab */}
              <rect x="175" y="140" width="60" height="260" fill="#8b5cf6" transform="rotate(-15 175 140)" />

              {/* Hinge */}
              <path d="M 175 140 L 170 140 L 170 150 M 175 140 L 175 130" stroke="#94a3b8" strokeWidth="2" fill="none" />
              
              {/* Interior Casing (Trim) */}
              <rect x="145" y="105" width="15" height="40" fill="#f59e0b" />
              <rect x="340" y="105" width="15" height="40" fill="#f59e0b" />
            </g>

            {/* Callouts */}

            {/* ROUGH OPENING STUD */}
            <line x1="265" y1="40" x2="45%" y2="40" stroke="#f8fafc" strokeWidth="2" />
            <text x="2%" y="40" fontSize="34" textAnchor="start" dominantBaseline="middle" fill="#f8fafc" stroke="#0f172a" strokeWidth="6" paintOrder="stroke fill" fontWeight="bold">ROUGH OPENING STUD</text>

            {/* SOLID SHIMS (BEHIND HINGE LOCATIONS) */}
            <line x1="300" y1="110" x2="45%" y2="110" stroke="#f8fafc" strokeWidth="2" />
            <text x="2%" y="95" fontSize="34" textAnchor="start" dominantBaseline="middle" fill="#f8fafc" stroke="#0f172a" strokeWidth="6" paintOrder="stroke fill" fontWeight="bold">SOLID SHIMS</text>
            <text x="2%" y="125" fontSize="34" textAnchor="start" dominantBaseline="middle" fill="#f8fafc" stroke="#0f172a" strokeWidth="6" paintOrder="stroke fill" fontWeight="bold">(BEHIND HINGE)</text>

            {/* PRE-HUNG DOOR JAMB */}
            <line x1="440" y1="125" x2="60%" y2="180" stroke="#f8fafc" strokeWidth="2" />
            <text x="98%" y="180" fontSize="34" textAnchor="end" dominantBaseline="middle" fill="#f8fafc" stroke="#0f172a" strokeWidth="6" paintOrder="stroke fill" fontWeight="bold">PRE-HUNG DOOR JAMB</text>

            {/* INTERIOR CASING (TRIM) */}
            <line x1="455" y1="115" x2="60%" y2="60" stroke="#f8fafc" strokeWidth="2" />
            <text x="98%" y="60" fontSize="34" textAnchor="end" dominantBaseline="middle" fill="#f8fafc" stroke="#0f172a" strokeWidth="6" paintOrder="stroke fill" fontWeight="bold">INTERIOR CASING (TRIM)</text>
          </svg>
        </div>
      )

    case 'roof_coverings':
      return (
        <div className="border border-slate-200 dark:border-slate-800 bg-slate-900 rounded-xl overflow-hidden shadow-inner p-1">
                    <svg viewBox="-20 0 780 300" className="w-full h-full drop-shadow-md bg-slate-900 rounded-xl p-2 font-sans select-none">
            {/* Eave / Roof Profile */}
            
            <g transform="translate(100, 0)">
              {/* Rafter / Truss */}
              <polygon points="100,250 150,250 400,50 400,10" fill="#d97706" />
              
              {/* Fascia Board */}
              <rect x="90" y="240" width="20" height="40" fill="#b45309" transform="rotate(-5 100 250)" />
              
              {/* Roof Deck (OSB/Plywood) */}
              <polygon points="90,230 110,245 400,15 390,0" fill="#f59e0b" />

              {/* Drip Edge */}
              <path d="M 100 240 L 90 230 L 110 215" fill="none" stroke="#94a3b8" strokeWidth="4" />
              <line x1="100" y1="240" x2="100" y2="255" stroke="#94a3b8" strokeWidth="4" />

              {/* Ice and Water Shield */}
              <polygon points="90,227 105,242 250,126 240,111" fill="#38bdf8" opacity="0.8" />
              
              {/* Felt Underlayment */}
              <polygon points="230,119 245,134 400,10 390,-5" fill="#1e293b" opacity="0.9" />

              {/* Starter Strip */}
              <polygon points="85,223 100,238 180,174 165,159" fill="#475569" />

              {/* Primary Shingles */}
              <polygon points="85,218 100,233 160,185 145,170" fill="#64748b" />
              <polygon points="125,186 140,201 200,153 185,138" fill="#64748b" />
              <polygon points="165,154 180,169 240,121 225,106" fill="#64748b" />
            </g>

            {/* Callouts */}
            
            {/* METAL DRIP EDGE */}
            <line x1="195" y1="247" x2="175" y2="247" stroke="#f8fafc" strokeWidth="1" />
            <text x="5%" y="247" fontSize="19" textAnchor="start" dominantBaseline="middle" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold">METAL DRIP EDGE</text>

            {/* EAVE PROTECTION (EXTENDS 900mm UP SLOPE) */}
            <line x1="270" y1="180" x2="235" y2="180" stroke="#f8fafc" strokeWidth="1" />
            <text x="5%" y="170" fontSize="19" textAnchor="start" dominantBaseline="middle" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold">EAVE PROTECTION</text>
            <text x="5%" y="195" fontSize="19" textAnchor="start" dominantBaseline="middle" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold">(EXTENDS 900mm UP SLOPE)</text>

            {/* 15 LB ASPHALT FELT UNDERLAYMENT */}
            <line x1="415" y1="65" x2="450" y2="65" stroke="#f8fafc" strokeWidth="1" />
            <text x="95%" y="65" fontSize="19" textAnchor="end" dominantBaseline="middle" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold">15 LB ASPHALT FELT UNDERLAYMENT</text>

            {/* STARTER STRIP (OVERHANGS DRIP EDGE 1/2") */}
            <line x1="230" y1="205" x2="420" y2="205" stroke="#f8fafc" strokeWidth="1" />
            <text x="95%" y="195" fontSize="19" textAnchor="end" dominantBaseline="middle" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold">STARTER STRIP</text>
            <text x="95%" y="220" fontSize="19" textAnchor="end" dominantBaseline="middle" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold">(OVERHANGS DRIP EDGE 1/2")</text>

          </svg>
        </div>
      )

    case 'fire_separations':
      return (
        <div className="border border-slate-200 dark:border-slate-800 bg-slate-900 rounded-xl overflow-hidden shadow-inner p-1">
                    <svg viewBox="0 0 1000 300" className="w-full h-full drop-shadow-md bg-slate-900 rounded-xl p-2 font-sans select-none">
            {/* Top Down View of Party Wall */}

            <g transform="translate(250, 0)">
              {/* Type X Drywall Left */}
              <rect x="150" y="20" width="15" height="260" fill="#cbd5e1" />
              <rect x="165" y="20" width="15" height="260" fill="#cbd5e1" />
              
              {/* Left Studs */}
              <rect x="180" y="50" width="90" height="40" fill="#d97706" />
              <rect x="180" y="150" width="90" height="40" fill="#d97706" />
              <rect x="180" y="250" width="90" height="40" fill="#d97706" />
              
              {/* Left Insulation */}
              <rect x="180" y="20" width="90" height="30" fill="#fbcfe8" opacity="0.6" />
              <rect x="180" y="90" width="90" height="60" fill="#fbcfe8" opacity="0.6" />
              <rect x="180" y="190" width="90" height="60" fill="#fbcfe8" opacity="0.6" />

              {/* 1" Air Gap */}
              <rect x="270" y="20" width="25" height="260" fill="#0f172a" opacity="0.2" />

              {/* Right Studs */}
              <rect x="295" y="30" width="90" height="40" fill="#d97706" />
              <rect x="295" y="130" width="90" height="40" fill="#d97706" />
              <rect x="295" y="230" width="90" height="40" fill="#d97706" />

              {/* Right Insulation */}
              <rect x="295" y="70" width="90" height="60" fill="#fbcfe8" opacity="0.6" />
              <rect x="295" y="170" width="90" height="60" fill="#fbcfe8" opacity="0.6" />

              {/* Type X Drywall Right */}
              <rect x="385" y="20" width="15" height="260" fill="#cbd5e1" />
              <rect x="400" y="20" width="15" height="260" fill="#cbd5e1" />
            </g>

            {/* Callouts */}
            
            {/* 1-HOUR FIRE-RESISTANCE RATING (FRR) */}
            <line x1="415" y1="40" x2="330" y2="40" stroke="#f8fafc" strokeWidth="1" />
            <text x="5%" y="40" fontSize="19" textAnchor="start" dominantBaseline="middle" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold">1-HOUR FIRE-RESISTANCE RATING (FRR)</text>

            {/* TYPE X GYPSUM BOARD (5/8") */}
            <line x1="400" y1="130" x2="330" y2="130" stroke="#f8fafc" strokeWidth="1" />
            <text x="5%" y="130" fontSize="19" textAnchor="start" dominantBaseline="middle" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold">TYPE X GYPSUM BOARD (5/8")</text>

            {/* SOUND/FIRE ATTENUATION BATT */}
            <line x1="635" y1="90" x2="680" y2="90" stroke="#f8fafc" strokeWidth="1" />
            <text x="95%" y="90" fontSize="19" textAnchor="end" dominantBaseline="middle" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold">SOUND/FIRE ATTENUATION BATT</text>

            {/* 25mm (1") AIR SPACE... */}
            <line x1="532" y1="180" x2="680" y2="180" stroke="#f8fafc" strokeWidth="1" />
            <text x="95%" y="170" fontSize="19" textAnchor="end" dominantBaseline="middle" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold">25mm (1") AIR SPACE</text>
            <text x="95%" y="195" fontSize="19" textAnchor="end" dominantBaseline="middle" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold">PREVENTS FIRE BRIDGING</text>
          </svg>
        </div>
      )

    case 'concrete_stairs':
      return (
        <div className="border border-slate-200 dark:border-slate-800 bg-slate-900 rounded-xl overflow-hidden shadow-inner p-1">
          <svg viewBox="0 100 1000 950" className="w-full h-full drop-shadow-md bg-slate-900 rounded-xl p-2 font-sans select-none">
            {/* Concrete Fill */}
            <polygon points="850,200 700,200 700,350 550,350 550,500 400,500 400,650 250,650 250,850 850,400" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="4" />
            <g fill="#94a3b8" opacity="0.6">
              <circle cx="600" cy="400" r="4" />
              <circle cx="650" cy="350" r="3" />
              <circle cx="750" cy="250" r="5" />
              <circle cx="500" cy="500" r="4" />
              <circle cx="450" cy="580" r="3" />
              <circle cx="350" cy="700" r="6" />
              <circle cx="400" cy="650" r="2" />
              <circle cx="550" cy="450" r="3" />
              <circle cx="700" cy="300" r="4" />
              <circle cx="800" cy="250" r="3" />
            </g>

            {/* Sloped Plywood Soffit */}
            <polygon points="250,850 850,400 862,416 262,866" fill="#d97706" stroke="#b45309" strokeWidth="4" />
            <polygon points="262,866 862,416 874,432 274,882" fill="#fbbf24" stroke="#d97706" strokeWidth="4" />

            {/* Vertical Shoring (Posts) */}
            <rect x="350" y="780" width="40" height="250" fill="#fcd34d" stroke="#b45309" strokeWidth="4" />
            <rect x="550" y="630" width="40" height="400" fill="#fcd34d" stroke="#b45309" strokeWidth="4" />
            <rect x="750" y="480" width="40" height="550" fill="#fcd34d" stroke="#b45309" strokeWidth="4" />

            {/* Floor/Base for Shoring */}
            <rect x="250" y="1030" width="600" height="20" fill="#64748b" stroke="#334155" strokeWidth="4" />

            {/* Riser Boards (Beveled) */}
            <polygon points="680,200 700,200 700,350 680,330" fill="#f59e0b" stroke="#b45309" strokeWidth="4" />
            <polygon points="530,350 550,350 550,500 530,480" fill="#f59e0b" stroke="#b45309" strokeWidth="4" />
            <polygon points="380,500 400,500 400,650 380,630" fill="#f59e0b" stroke="#b45309" strokeWidth="4" />

            {/* Diagonal Stringer (Kicker) */}
            <polygon points="310,570 730,150 710,130 290,550" fill="#fcd34d" stroke="#d97706" strokeWidth="4" />
            
            {/* Nails/Screws into Risers */}
            <circle cx="390" cy="500" r="4" fill="#64748b" />
            <circle cx="540" cy="350" r="4" fill="#64748b" />
            <circle cx="690" cy="200" r="4" fill="#64748b" />

            {/* Callouts (Left) */}
            <line x1="280" y1="870" x2="45%" y2="870" stroke="#f8fafc" strokeWidth="2" />
            <text x="5%" y="870" fontSize="42" textAnchor="start" dominantBaseline="middle" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold">SLOPED PLYWOOD SOFFIT</text>

            <line x1="550" y1="950" x2="45%" y2="950" stroke="#f8fafc" strokeWidth="2" />
            <text x="5%" y="950" fontSize="42" textAnchor="start" dominantBaseline="middle" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold">VERTICAL SHORING (POSTS)</text>

            {/* Callouts (Right) */}
            <line x1="620" y1="220" x2="55%" y2="220" stroke="#f8fafc" strokeWidth="2" />
            <text x="95%" y="220" fontSize="42" textAnchor="end" dominantBaseline="middle" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold">DIAGONAL STRINGER (KICKER)</text>

            <line x1="690" y1="330" x2="55%" y2="330" stroke="#f8fafc" strokeWidth="2" />
            <text x="95%" y="330" fontSize="42" textAnchor="end" dominantBaseline="middle" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold">BEVELED RISER BOARD</text>

            <line x1="600" y1="500" x2="55%" y2="500" stroke="#f8fafc" strokeWidth="2" />
            <text x="95%" y="500" fontSize="42" textAnchor="end" dominantBaseline="middle" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold">CONCRETE FILL</text>
          </svg>
        </div>
      )
    case 'site_hoarding_heating':
      return (
        <div className="border border-slate-200 dark:border-slate-800 bg-slate-900 rounded-xl overflow-hidden shadow-inner p-1">
          <svg viewBox="0 50 1000 900" className="w-full h-full drop-shadow-md bg-slate-900 rounded-xl p-2 font-sans select-none">
            {/* Background Ground */}
            <rect x="100" y="850" width="800" height="40" fill="#64748b" stroke="#334155" strokeWidth="4" />
            <polygon points="100,850 900,850 850,900 150,900" fill="#475569" />

            {/* Simple Structural Frame (Wood 2x4s) */}
            <rect x="250" y="550" width="20" height="300" fill="#d97706" stroke="#b45309" strokeWidth="4" />
            <rect x="730" y="550" width="20" height="300" fill="#d97706" stroke="#b45309" strokeWidth="4" />
            {/* Slanted Roof Frame */}
            <polygon points="230,550 500,280 500,300 250,550" fill="#d97706" stroke="#b45309" strokeWidth="4" />
            <polygon points="500,280 770,550 750,550 500,300" fill="#d97706" stroke="#b45309" strokeWidth="4" />
            {/* Horizontal Tie */}
            <rect x="250" y="550" width="500" height="20" fill="#d97706" stroke="#b45309" strokeWidth="4" />

            {/* Reinforced Poly/Tarp Enclosure (Semi-transparent) */}
            <polygon points="200,850 200,530 500,230 800,530 800,850" fill="#bae6fd" opacity="0.4" stroke="#0284c7" strokeWidth="6" strokeDasharray="15,5" />
            
            {/* Heater Base/Unit */}
            <rect x="300" y="730" width="120" height="120" fill="#ef4444" stroke="#b91c1c" strokeWidth="4" rx="8" />
            <circle cx="330" cy="830" r="15" fill="#1e293b" />
            <circle cx="390" cy="830" r="15" fill="#1e293b" />
            {/* Heater Grill */}
            <rect x="320" y="750" width="80" height="60" fill="#0f172a" />
            <line x1="320" y1="765" x2="400" y2="765" stroke="#475569" strokeWidth="4" />
            <line x1="320" y1="780" x2="400" y2="780" stroke="#475569" strokeWidth="4" />
            <line x1="320" y1="795" x2="400" y2="795" stroke="#475569" strokeWidth="4" />
            {/* Hot Air Waves */}
            <path d="M440 760 Q 460 740, 480 760 T 520 760" fill="none" stroke="#f97316" strokeWidth="6" strokeLinecap="round" />
            <path d="M450 780 Q 470 760, 490 780 T 530 780" fill="none" stroke="#f97316" strokeWidth="6" strokeLinecap="round" />
            
            {/* Flexible Heat Ducting */}
            <path d="M420 800 C 500 800, 550 900, 650 850 C 700 830, 750 850, 750 850" fill="none" stroke="#fcd34d" strokeWidth="30" />
            <path d="M420 800 C 500 800, 550 900, 650 850 C 700 830, 750 850, 750 850" fill="none" stroke="#b45309" strokeWidth="4" strokeDasharray="5,15" />

            {/* Exhaust Vent (Top) */}
            <path d="M360 730 L 360 650 C 360 600, 450 600, 450 500 L 450 150" fill="none" stroke="#94a3b8" strokeWidth="20" />
            <rect x="420" y="130" width="60" height="20" fill="#475569" />
            {/* Fumes */}
            <path d="M440 100 Q 450 80, 440 60" fill="none" stroke="#64748b" strokeWidth="6" strokeLinecap="round" opacity="0.8" />
            <path d="M460 110 Q 480 90, 460 70" fill="none" stroke="#64748b" strokeWidth="6" strokeLinecap="round" opacity="0.6" />

            {/* Callouts (Left) */}
            <line x1="300" y1="790" x2="45%" y2="790" stroke="#f8fafc" strokeWidth="2" />
            <text x="5%" y="790" fontSize="38" textAnchor="start" dominantBaseline="middle" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold">TEMPORARY HEATER (FROST PREVENTION)</text>

            <line x1="560" y1="870" x2="45%" y2="870" stroke="#f8fafc" strokeWidth="2" />
            <text x="5%" y="870" fontSize="38" textAnchor="start" dominantBaseline="middle" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold">FLEXIBLE HEAT DUCTING</text>

            {/* Callouts (Right) */}
            <line x1="650" y1="380" x2="55%" y2="380" stroke="#f8fafc" strokeWidth="2" />
            <text x="95%" y="380" fontSize="38" textAnchor="end" dominantBaseline="middle" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold">REINFORCED POLY/TARP ENCLOSURE</text>

            <line x1="450" y1="180" x2="55%" y2="180" stroke="#f8fafc" strokeWidth="2" />
            <text x="95%" y="180" fontSize="38" textAnchor="end" dominantBaseline="middle" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold">CARBON MONOXIDE EXHAUST VENT</text>
          </svg>
        </div>
      )
    case 'concrete_formwork':
      return (
        <div className="border border-slate-200 dark:border-slate-800 bg-slate-900 rounded-xl overflow-hidden shadow-inner p-1">
          <svg viewBox="-160 15 920 270" className="w-full h-full drop-shadow-md bg-slate-900 rounded-xl p-2 font-sans select-none">
            {/* Concrete Center */}
            <rect x="180" y="20" width="100" height="260" fill="#cbd5e1" />
            
            {/* 3/4" Form Ply (Both sides) */}
            <rect x="165" y="20" width="15" height="260" fill="#b45309" />
            <rect x="280" y="20" width="15" height="260" fill="#b45309" />

            {/* Vertical 2x4 Studs (Both sides, side view) */}
            <rect x="130" y="20" width="35" height="260" fill="#d97706" />
            <rect x="295" y="20" width="35" height="260" fill="#d97706" />

            {/* Horizontal Double Walers (Cross section) */}
            <rect x="100" y="80" width="30" height="35" fill="#f59e0b" />
            <rect x="100" y="180" width="30" height="35" fill="#f59e0b" />
            
            <rect x="330" y="80" width="30" height="35" fill="#f59e0b" />
            <rect x="330" y="180" width="30" height="35" fill="#f59e0b" />

            {/* Snap Tie (Through the middle) */}
            <line x1="80" y1="150" x2="380" y2="150" stroke="#94a3b8" strokeWidth="4" />
            
            {/* Wedges */}
            <polygon points="90,140 100,150 90,160" fill="#64748b" />
            <polygon points="370,140 360,150 370,160" fill="#64748b" />

            {/* Callouts */}
            
            {/* 3/4" HIGH-DENSITY FORM PLY */}
            <line x1="165" y1="50" x2="60" y2="50" stroke="#f8fafc" strokeWidth="1" />
            <text x="55" y="40" fontSize="19" textAnchor="end" dominantBaseline="middle" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold">3/4" HIGH-DENSITY</text>
            <text x="55" y="62" fontSize="19" textAnchor="end" dominantBaseline="middle" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold">FORM PLY</text>

            {/* VERTICAL WOOD STUDS */}
            <line x1="130" y1="230" x2="60" y2="230" stroke="#f8fafc" strokeWidth="1" />
            <text x="55" y="230" fontSize="19" textAnchor="end" dominantBaseline="middle" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold">VERTICAL WOOD STUDS</text>

            {/* HORIZONTAL DOUBLE WALER */}
            <line x1="360" y1="97" x2="400" y2="97" stroke="#f8fafc" strokeWidth="1" />
            <text x="405" y="97" fontSize="19" textAnchor="start" dominantBaseline="middle" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold">HORIZONTAL DOUBLE WALER</text>

            {/* SNAP TIE & WEDGE */}
            <line x1="380" y1="150" x2="400" y2="150" stroke="#f8fafc" strokeWidth="1" />
            <text x="405" y="140" fontSize="19" textAnchor="start" dominantBaseline="middle" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold">SNAP TIE & WEDGE</text>
            <text x="405" y="162" fontSize="19" textAnchor="start" dominantBaseline="middle" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold">(RESISTS HYDROSTATIC PRESSURE)</text>

          </svg>
        </div>
      )

    case 'rain_screens_flashing':
      return (
        <div className="border border-slate-200 dark:border-slate-800 bg-slate-900 rounded-xl overflow-hidden shadow-inner p-1">
          <svg viewBox="-180 0 720 300" className="w-full h-full drop-shadow-md bg-slate-900 rounded-xl p-2 font-sans select-none">
            {/* OSB Sheathing */}
            <rect x="150" y="20" width="30" height="260" fill="#b45309" />
            
            {/* Window Trim/Head */}
            <rect x="180" y="180" width="50" height="100" fill="#d97706" />
            <line x1="180" y1="180" x2="230" y2="180" stroke="#0f172a" strokeWidth="1" />
            <line x1="180" y1="180" x2="180" y2="280" stroke="#0f172a" strokeWidth="1" />

            {/* Z-Flashing */}
            <path d="M 180 100 L 180 180 L 235 180 L 235 190" stroke="#94a3b8" strokeWidth="4" fill="none" />
            
            {/* House Wrap (Overlaps flashing) */}
            <line x1="183" y1="20" x2="183" y2="150" stroke="#f8fafc" strokeWidth="3" strokeDasharray="6 3" />
            
            {/* Strapping (Capillary Break) */}
            <rect x="186" y="20" width="14" height="140" fill="#fcd34d" />
            <line x1="186" y1="20" x2="186" y2="160" stroke="#0f172a" strokeWidth="1" />
            <line x1="200" y1="20" x2="200" y2="160" stroke="#0f172a" strokeWidth="1" />

            {/* Siding */}
            <rect x="200" y="20" width="25" height="150" fill="#64748b" />
            <line x1="200" y1="170" x2="225" y2="170" stroke="#0f172a" strokeWidth="1" />
            
            {/* Siding individual boards (clapboard look) */}
            <path d="M 200 50 L 225 50 M 200 80 L 225 80 M 200 110 L 225 110 M 200 140 L 225 140" stroke="#475569" strokeWidth="1" />

            {/* Water Path Arrow */}
            <path d="M 175 130 L 175 175 L 245 175 L 245 205" stroke="#3b82f6" strokeWidth="3" fill="none" />
            <polygon points="241,200 249,200 245,210" fill="#3b82f6" />

            {/* Callouts */}
            
            {/* Weather Barrier */}
            <line x1="183" y1="60" x2="100" y2="60" stroke="#f8fafc" strokeWidth="1" />
            <text x="95" y="60" fontSize="13" textAnchor="end" dominantBaseline="middle" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold">WEATHER BARRIER (OVERLAPS FLASHING)</text>

            {/* Capillary Break (Strapping) */}
            <line x1="193" y1="100" x2="495" y2="100" stroke="#f8fafc" strokeWidth="1" />
            <text x="500" y="100" fontSize="13" textAnchor="end" dominantBaseline="middle" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold">MIN. 10mm (3/8") CAPILLARY BREAK</text>

            {/* Siding */}
            <line x1="225" y1="140" x2="495" y2="140" stroke="#f8fafc" strokeWidth="1" />
            <text x="500" y="140" fontSize="13" textAnchor="end" dominantBaseline="middle" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold">EXTERIOR CLADDING</text>

            {/* Gap / Do not caulk */}
            <line x1="210" y1="175" x2="495" y2="175" stroke="#f8fafc" strokeWidth="1" />
            <text x="500" y="175" fontSize="13" textAnchor="end" dominantBaseline="middle" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold">DO NOT CAULK THIS GAP</text>

            {/* Z-Flashing */}
            <line x1="235" y1="185" x2="495" y2="210" stroke="#f8fafc" strokeWidth="1" />
            <text x="500" y="210" fontSize="13" textAnchor="end" dominantBaseline="middle" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold">METAL Z-FLASHING (HEAD FLASHING)</text>

          </svg>
        </div>
      )

    case 'thermal_insulation':
      return (
                <div className="border border-slate-200 dark:border-slate-800 bg-slate-900 rounded-xl overflow-hidden shadow-inner p-1">
          <svg viewBox="-300 0 900 300" className="w-full h-full drop-shadow-md bg-slate-900 rounded-xl p-2 font-sans select-none">
            {/* INTERIOR SIDE */}
            <text x="50" y="25" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold" fontSize="11" textAnchor="middle" className="tracking-widest uppercase">INTERIOR</text>
            <text x="210" y="25" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold" fontSize="11" textAnchor="middle" className="tracking-widest uppercase">EXTERIOR</text>

            {/* Drywall (Leftmost) */}
            <rect x="20" y="50" width="15" height="200" fill="#cbd5e1" />

            {/* Insulation Cavity (Between studs) */}
            <rect x="35" y="50" width="130" height="200" fill="#fbcfe8" opacity="0.6" />
            <path d="M 35 70 Q 70 50 100 70 T 165 70 M 35 110 Q 70 90 100 110 T 165 110 M 35 150 Q 70 130 100 150 T 165 150 M 35 190 Q 70 170 100 190 T 165 190 M 35 230 Q 70 210 100 230 T 165 230" stroke="#f472b6" strokeWidth="1" fill="none" opacity="0.5" />

            {/* Wood Stud (Top-down view) */}
            <rect x="35" y="115" width="130" height="40" fill="#d97706" />

            {/* OSB Sheathing */}
            <rect x="165" y="50" width="15" height="200" fill="#b45309" />

            {/* Exterior Rigid Foam Insulation (Thick) */}
            <rect x="180" y="50" width="60" height="200" fill="#38bdf8" opacity="0.7" />
            
            {/* Cold Arrow hitting foam */}
            <path d="M 330 135 L 245 135 M 245 135 L 255 125 M 245 135 L 255 145" stroke="#60a5fa" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <text x="340" y="135" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold" fontSize="12" textAnchor="start" dominantBaseline="middle">COLD</text>

            {/* Callouts */}

            {/* Cavity Insulation */}
            <line x1="80" y1="180" x2="-20" y2="250" stroke="#f8fafc" strokeWidth="1" />
            <line x1="-20" y1="250" x2="-30" y2="250" stroke="#f8fafc" strokeWidth="1" />
            <text x="-35" y="250" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold" fontSize="9" textAnchor="end" dominantBaseline="middle">CAVITY INSULATION (FIBERGLASS/ROCKWOOL)</text>

            {/* Wood Stud */}
            <line x1="100" y1="115" x2="-20" y2="85" stroke="#f8fafc" strokeWidth="1" />
            <line x1="-20" y1="85" x2="-30" y2="85" stroke="#f8fafc" strokeWidth="1" />
            <text x="-35" y="85" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold" fontSize="9" textAnchor="end" dominantBaseline="middle">WOOD FRAMING (POTENTIAL THERMAL BRIDGE)</text>

            {/* OSB Sheathing */}
            <line x1="172" y1="200" x2="260" y2="250" stroke="#f8fafc" strokeWidth="1" />
            <line x1="260" y1="250" x2="270" y2="250" stroke="#f8fafc" strokeWidth="1" />
            <text x="275" y="250" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold" fontSize="9" textAnchor="start" dominantBaseline="middle">OSB WALL SHEATHING</text>

            {/* Continuous Rigid Insulation */}
            <line x1="240" y1="70" x2="260" y2="70" stroke="#f8fafc" strokeWidth="1" />
            <line x1="260" y1="70" x2="270" y2="70" stroke="#f8fafc" strokeWidth="1" />
            <text x="275" y="70" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold" fontSize="9" textAnchor="start" dominantBaseline="middle">CONTINUOUS RIGID INSULATION (CI)</text>

          </svg>
        </div>
      )

case 'vapour_air_barriers':
      return (
        <div className="border border-slate-200 dark:border-slate-800 bg-slate-900 rounded-xl overflow-hidden shadow-inner p-1">
          <svg viewBox="0 0 400 300" className="w-full h-full drop-shadow-md bg-slate-900 rounded-xl p-2 font-sans select-none">
            {/* Interior Side (Top) */}
            <text x="200" y="25" fill="#f8fafc" fontSize="11" textAnchor="middle" className="tracking-widest uppercase" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold">WARM-IN-WINTER SIDE</text>

            {/* Drywall */}
            <rect x="20" y="50" width="360" height="10" fill="#cbd5e1" />
            <line x1="80" y1="55" x2="25" y2="40" stroke="#38bdf8" strokeWidth="1" />
            <text x="20" y="40" fill="#38bdf8" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold" fontSize="9" textAnchor="start" dominantBaseline="middle">1/2" GYPSUM BOARD (DRYWALL)</text>

            {/* 6-Mil Poly */}
            <line x1="20" y1="62" x2="380" y2="62" stroke="#38bdf8" strokeWidth="2" />
            <line x1="320" y1="62" x2="360" y2="40" stroke="#38bdf8" strokeWidth="1" />
            <text x="380" y="40" fill="#38bdf8" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold" fontSize="9" textAnchor="end" dominantBaseline="middle">6-MIL POLY VAPOUR BARRIER</text>

            {/* Acoustic Sealant */}
            <circle cx="200" cy="62" r="3" fill="#000000" />
            <line x1="200" y1="62" x2="190" y2="85" stroke="#f43f5e" strokeWidth="1" />
            <text x="185" y="85" fill="#f43f5e" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold" fontSize="8" textAnchor="end" dominantBaseline="middle">CONTINUOUS ACOUSTIC SEALANT BEAD</text>

            {/* Studs */}
            <rect x="180" y="64" width="40" height="140" fill="#d97706" />

            {/* Insulation */}
            <rect x="20" y="64" width="160" height="140" fill="#fbcfe8" opacity="0.6" />
            <rect x="220" y="64" width="160" height="140" fill="#fbcfe8" opacity="0.6" />
            
            {/* Insulation pattern lines */}
            <path d="M 20 80 Q 50 100 80 80 T 140 80 T 180 80 M 20 120 Q 50 140 80 120 T 140 120 T 180 120 M 220 80 Q 250 100 280 80 T 340 80 T 380 80 M 220 120 Q 250 140 280 120 T 340 120 T 380 120" stroke="#f472b6" strokeWidth="1" fill="none" opacity="0.5" />
            
            <line x1="100" y1="134" x2="40" y2="185" stroke="#f43f5e" strokeWidth="1" />
            <text x="15" y="185" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold" fontSize="9" textAnchor="start" dominantBaseline="middle">FIBERGLASS BATT INSULATION</text>

            {/* OSB Sheathing */}
            <rect x="20" y="204" width="360" height="12" fill="#b45309" />
            
            {/* House Wrap (Tyvek) */}
            <line x1="20" y1="218" x2="380" y2="218" stroke="#f8fafc" strokeWidth="2" strokeDasharray="4" />
            <line x1="280" y1="218" x2="340" y2="190" stroke="#f8fafc" strokeWidth="1" />
            <text x="385" y="190" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold" fontSize="9" textAnchor="end" dominantBaseline="middle">WEATHER / AIR BARRIER (TYVEK)</text>

            {/* Airspace / Strapping */}
            <rect x="20" y="220" width="360" height="16" fill="#1e293b" />
            
            {/* Cladding */}
            <rect x="20" y="236" width="360" height="20" fill="#64748b" />
            <line x1="20" y1="246" x2="380" y2="246" stroke="#94a3b8" strokeWidth="1" />

            <text x="200" y="280" fill="#94a3b8" fontSize="10" textAnchor="middle" className="tracking-widest uppercase" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold">EXTERIOR SIDE</text>

          </svg>
        </div>
      )

    case 'footings':
      return (
        <div className="border border-slate-200 dark:border-slate-800 bg-slate-900 rounded-xl overflow-hidden shadow-inner p-1">
          <svg viewBox="0 0 400 280" className="w-full h-auto drop-shadow-md bg-slate-900 rounded-xl p-2 font-sans select-none">
            {/* Background/Base Soil */}
            <rect x="20" y="180" width="360" height="60" fill="#1e293b" rx="4" />
            <text x="200" y="215" fill="#94a3b8" fontSize="12" textAnchor="middle" className="font-semibold tracking-widest">UNDISTURBED SOIL / COMPACTED GRANULAR</text>

            {/* Concrete Footing */}
            <rect x="60" y="100" width="280" height="80" fill="#475569" rx="4" />
            
            {/* Split Text to avoid center dowel collision */}
            <text x="125" y="140" fill="#f8fafc" fontSize="12" textAnchor="middle" className="font-bold tracking-widest">CONCRETE</text>
            <text x="125" y="155" fill="#f8fafc" fontSize="12" textAnchor="middle" className="font-bold tracking-widest">FOOTING</text>

            <text x="275" y="140" fill="#fbbf24" fontSize="10" textAnchor="middle">CONT. HORIZONTAL</text>
            <text x="275" y="152" fill="#fbbf24" fontSize="10" textAnchor="middle">REBAR</text>
            
            {/* Width Dimension */}
            <line x1="60" y1="265" x2="340" y2="265" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4" />
            <line x1="60" y1="260" x2="60" y2="270" stroke="#38bdf8" strokeWidth="1" />
            <line x1="340" y1="260" x2="340" y2="270" stroke="#38bdf8" strokeWidth="1" />
            <text x="200" y="255" fill="#38bdf8" fontSize="10" textAnchor="middle">WIDTH: 250mm (10") 1-ST / 350mm (14") 2-ST MIN</text>

            {/* Thickness Dimension */}
            <line x1="40" y1="100" x2="40" y2="180" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4" />
            <line x1="35" y1="100" x2="45" y2="100" stroke="#38bdf8" strokeWidth="1" />
            <line x1="35" y1="180" x2="45" y2="180" stroke="#38bdf8" strokeWidth="1" />
            <text x="30" y="140" fill="#38bdf8" fontSize="10" textAnchor="middle" transform="rotate(-90 30 140)">MIN 100mm (4")</text>

            {/* Vertical Dowel (ICF) - DEAD CENTER */}
            <line x1="200" y1="160" x2="200" y2="30" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
            <text x="200" y="20" fill="#10b981" fontSize="10" textAnchor="middle" className="font-bold">15M (#5) VERTICAL DOWEL (ICF)</text>

            {/* Beveled Keyway */}
            <polygon points="180,100 220,100 210,115 190,115" fill="#1e293b" />
            <line x1="190" y1="105" x2="140" y2="75" stroke="#f43f5e" strokeWidth="1" />
            <text x="135" y="70" fill="#f43f5e" fontSize="10" textAnchor="middle" className="font-bold">BEVELED KEYWAY</text>

            {/* Horizontal Rebar & 75mm Cover */}
            <circle cx="100" cy="160" r="5" fill="#fbbf24" />
            <circle cx="300" cy="160" r="5" fill="#fbbf24" />
            <line x1="100" y1="160" x2="100" y2="180" stroke="#fbbf24" strokeWidth="1" strokeDasharray="2"/>
            <line x1="300" y1="160" x2="300" y2="180" stroke="#fbbf24" strokeWidth="1" strokeDasharray="2"/>
            <text x="70" y="175" fill="#fbbf24" fontSize="9" textAnchor="middle">75mm (3")</text>
            <text x="330" y="175" fill="#fbbf24" fontSize="9" textAnchor="middle">75mm (3")</text>
          </svg>
        </div>
      )

    case 'foundations':
      return (
        <div className="border border-slate-200 dark:border-slate-800 bg-slate-900 rounded-xl overflow-hidden shadow-inner p-1">
          <svg viewBox="0 0 400 300" className="w-full h-full drop-shadow-md bg-slate-900 rounded-xl p-2 font-sans select-none">
            
            {/* Concrete Footing */}
            <rect x="70" y="240" width="220" height="40" fill="#475569" rx="2" />
            <text x="180" y="265" fill="#f8fafc" fontSize="12" textAnchor="middle" className="font-bold tracking-widest drop-shadow-md">CONCRETE FOOTING</text>

            {/* Foundation Wall */}
            <rect x="120" y="80" width="120" height="160" fill="#64748b" rx="2" />
            <text x="180" y="160" fill="#f8fafc" fontSize="14" textAnchor="middle" className="font-bold tracking-widest drop-shadow-md">FOUNDATION</text>
            <text x="180" y="178" fill="#f8fafc" fontSize="14" textAnchor="middle" className="font-bold tracking-widest drop-shadow-md">WALL</text>

            {/* Anchor Bolt (L-Shape) */}
            <path d="M 180 50 L 180 100 L 195 100" fill="none" stroke="#fbbf24" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="180" cy="55" r="4" fill="#fbbf24" /> 
            <text x="180" y="40" fill="#fbbf24" fontSize="10" textAnchor="middle" className="font-bold">12.7mm (1/2") ANCHOR BOLT</text>

            {/* Grade Line */}
            <line x1="240" y1="140" x2="390" y2="140" stroke="#f97316" strokeWidth="2" strokeDasharray="4" />
            <text x="340" y="135" fill="#f97316" fontSize="10" textAnchor="middle" className="font-bold">FINISHED GRADE</text>

            {/* Clearance to Grade */}
            <line x1="260" y1="80" x2="260" y2="140" stroke="#38bdf8" strokeWidth="1" strokeDasharray="2" />
            <line x1="255" y1="80" x2="265" y2="80" stroke="#38bdf8" strokeWidth="1" />
            <text x="265" y="115" fill="#38bdf8" fontSize="10" textAnchor="start">MIN 150mm (6")</text>

            {/* Damp-proofing */}
            <line x1="240" y1="140" x2="240" y2="240" stroke="#ef4444" strokeWidth="3" />
            <text x="245" y="175" fill="#ef4444" fontSize="10" textAnchor="start">DAMP-PROOFING</text>

            {/* Weeping Tile & Crushed Stone */}
            <path d="M 240 200 Q 280 200 300 210 Q 330 220 350 210 L 350 240 L 240 240 Z" fill="#334155" opacity="0.8"/>
            
            <circle cx="270" cy="225" r="12" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3" />
            <circle cx="270" cy="225" r="3" fill="#38bdf8" />
            
            {/* Pointer and nicely stacked text */}
            <line x1="282" y1="225" x2="305" y2="225" stroke="#38bdf8" strokeWidth="1" />
            <text x="310" y="222" fill="#38bdf8" fontSize="10" textAnchor="start">WEEPING TILE</text>
            <text x="310" y="236" fill="#cbd5e1" fontSize="9" textAnchor="start">CRUSHED STONE</text>

            {/* Wall Thickness */}
            <line x1="120" y1="70" x2="240" y2="70" stroke="#38bdf8" strokeWidth="1" />
            <line x1="120" y1="65" x2="120" y2="75" stroke="#38bdf8" strokeWidth="1" />
            <line x1="240" y1="65" x2="240" y2="75" stroke="#38bdf8" strokeWidth="1" />
            <text x="110" y="73" fill="#38bdf8" fontSize="10" textAnchor="end">MIN 150mm (6")</text>
          </svg>
        </div>
      )

    case 'icf':
      return (
        <div className="border border-slate-200 dark:border-slate-800 bg-slate-900 rounded-xl overflow-hidden shadow-inner p-1">
          <svg viewBox="0 0 400 300" className="w-full h-full drop-shadow-md bg-slate-900 rounded-xl p-2 font-sans select-none">
            
            {/* Concrete Footing */}
            <rect x="80" y="250" width="240" height="40" fill="#475569" rx="2" />
            <text x="200" y="275" fill="#f8fafc" fontSize="12" textAnchor="middle" className="font-bold tracking-widest drop-shadow-md">CONCRETE FOOTING</text>

            {/* ICF Wall - Outer EPS */}
            <rect x="130" y="70" width="35" height="180" fill="#0ea5e9" opacity="0.8" rx="1" />
            {/* ICF Wall - Concrete Core */}
            <rect x="165" y="70" width="70" height="180" fill="#64748b" />
            {/* ICF Wall - Inner EPS */}
            <rect x="235" y="70" width="35" height="180" fill="#0ea5e9" opacity="0.8" rx="1" />

            {/* Anchor Bolt (L-Shape) added to top */}
            <path d="M 200 40 L 200 90 L 215 90" fill="none" stroke="#fbbf24" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="200" cy="45" r="4" fill="#fbbf24" /> 
            <text x="200" y="30" fill="#fbbf24" fontSize="10" textAnchor="middle" className="font-bold">12.7mm (1/2") ANCHOR BOLT</text>

            {/* EPS Labels */}
            <text x="120" y="150" fill="#38bdf8" fontSize="10" textAnchor="end" className="font-bold">65mm (2.5") EPS</text>
            <line x1="125" y1="147" x2="145" y2="147" stroke="#38bdf8" strokeWidth="1" />

            <text x="280" y="150" fill="#38bdf8" fontSize="10" textAnchor="start" className="font-bold">65mm (2.5") EPS</text>
            <line x1="255" y1="147" x2="275" y2="147" stroke="#38bdf8" strokeWidth="1" />

            {/* Concrete Core Label */}
            <text x="200" y="125" fill="#f8fafc" fontSize="11" textAnchor="middle" className="font-bold tracking-widest drop-shadow-md">CONCRETE</text>
            <text x="200" y="140" fill="#f8fafc" fontSize="11" textAnchor="middle" className="font-bold tracking-widest drop-shadow-md">CORE</text>

            {/* Rebar Grid - Alternating Horizontal */}
            <line x1="200" y1="150" x2="200" y2="250" stroke="#fbbf24" strokeWidth="2" /> {/* Vertical bar bottom */}
            <line x1="200" y1="70" x2="200" y2="105" stroke="#fbbf24" strokeWidth="2" /> {/* Vertical bar top */}
            
            {/* Horizontal alternating rebar dots */}
            <circle cx="185" cy="170" r="4" fill="#fbbf24" /> {/* Left stagger */}
            <circle cx="215" cy="210" r="4" fill="#fbbf24" /> {/* Right stagger */}
            <circle cx="185" cy="100" r="4" fill="#fbbf24" /> {/* Left stagger */}
            
            {/* Rebar Label */}
            <line x1="170" y1="170" x2="180" y2="170" stroke="#fbbf24" strokeWidth="1" />
            <text x="165" y="173" fill="#fbbf24" fontSize="10" textAnchor="end" className="font-bold">REBAR GRID</text>

            {/* Turnbuckle Brace System */}
            <line x1="270" y1="120" x2="350" y2="250" stroke="#94a3b8" strokeWidth="3" />
            {/* Wall Bracket */}
            <rect x="270" y="110" width="5" height="20" fill="#cbd5e1" />
            {/* Turnbuckle mechanism */}
            <circle cx="310" cy="185" r="6" fill="#1e293b" stroke="#cbd5e1" strokeWidth="2" />
            <circle cx="310" cy="185" r="2" fill="#cbd5e1" />
            {/* Ground Footplate & Stake */}
            <polygon points="345,250 355,250 350,260" fill="#cbd5e1" />
            <line x1="335" y1="250" x2="365" y2="250" stroke="#cbd5e1" strokeWidth="2" />

            {/* Brace Label - Shifted right */}
            <text x="320" y="170" fill="#cbd5e1" fontSize="10" textAnchor="start" className="font-bold">ADJUSTABLE</text>
            <text x="320" y="182" fill="#cbd5e1" fontSize="10" textAnchor="start" className="font-bold">BRACE</text>
          </svg>
        </div>
      )

    case 'floor_systems':
      return (
        <div className="border border-slate-200 dark:border-slate-800 bg-slate-900 rounded-xl overflow-hidden shadow-inner p-1">
          <svg viewBox="0 0 400 300" className="w-full h-full drop-shadow-md bg-slate-900 rounded-xl p-2 font-sans select-none">
            
            {/* Foundation Wall & Pocket */}
            <path d="M 40 280 L 140 280 L 140 200 L 120 200 L 120 120 L 40 120 Z" fill="#475569" />
            <text x="90" y="260" fill="#94a3b8" fontSize="10" textAnchor="middle" className="font-bold">CONCRETE POCKET</text>

            {/* Wood Beam */}
            <rect x="50" y="130" width="60" height="70" fill="#b45309" rx="2" />
            <text x="80" y="170" fill="#fef3c7" fontSize="12" textAnchor="middle" className="font-bold tracking-widest">BEAM</text>

            {/* 12mm Air Gap Indicators */}
            <line x1="115" y1="130" x2="115" y2="200" stroke="#38bdf8" strokeWidth="2" strokeDasharray="2" />
            <text x="125" y="160" fill="#38bdf8" fontSize="10" className="font-bold">12mm (1/2") AIR GAP</text>
            <text x="125" y="172" fill="#38bdf8" fontSize="9">(SIDES & END)</text>

            {/* 89mm Bearing Indicator */}
            <line x1="50" y1="210" x2="110" y2="210" stroke="#4ade80" strokeWidth="2" />
            <line x1="50" y1="205" x2="50" y2="215" stroke="#4ade80" strokeWidth="2" />
            <line x1="110" y1="205" x2="110" y2="215" stroke="#4ade80" strokeWidth="2" />
            <text x="80" y="222" fill="#4ade80" fontSize="9" textAnchor="middle" className="font-bold">MIN 89mm (3.5") BEARING</text>

            {/* Floor Joist */}
            <rect x="50" y="90" width="300" height="40" fill="#d97706" rx="1" />
            <text x="200" y="115" fill="#fef3c7" fontSize="12" textAnchor="middle" className="font-bold tracking-widest">FLOOR JOIST</text>

            {/* Crown Direction - Shifted Right */}
            <path d="M 270 145 Q 290 135 310 145" fill="none" stroke="#fbbf24" strokeWidth="2" />
            <polygon points="290,135 285,142 295,142" fill="#fbbf24" />
            <text x="290" y="160" fill="#fbbf24" fontSize="10" textAnchor="middle" className="font-bold">CROWN UP</text>

            {/* Subfloor */}
            <rect x="50" y="75" width="310" height="15" fill="#ea580c" />
            <text x="205" y="65" fill="#f97316" fontSize="10" textAnchor="middle" className="font-bold">19mm (3/4") T&G SUBFLOOR (GLUED & SCREWED)</text>
          </svg>
        </div>
      )

    case 'framing':
      return (
        <div className="border border-slate-200 dark:border-slate-800 bg-slate-900 rounded-xl overflow-hidden shadow-inner p-1">
          <svg viewBox="0 0 400 300" className="w-full h-full drop-shadow-md bg-slate-900 rounded-xl p-2 font-sans select-none">
            
            {/* Wall Plates */}
            <rect x="20" y="30" width="360" height="10" fill="#b45309" /> {/* Upper Top Plate */}
            <rect x="20" y="40" width="360" height="10" fill="#d97706" /> {/* Lower Top Plate */}
            <rect x="20" y="260" width="360" height="10" fill="#d97706" /> {/* Sole Plate */}

            {/* Common Studs (Outer) */}
            <rect x="20" y="50" width="10" height="210" fill="#d97706" />
            <rect x="370" y="50" width="10" height="210" fill="#d97706" />

            {/* King Studs */}
            <rect x="80" y="50" width="10" height="210" fill="#d97706" />
            <rect x="310" y="50" width="10" height="210" fill="#d97706" />

            {/* Jack Studs (Trimmers) */}
            <rect x="90" y="90" width="10" height="170" fill="#f59e0b" />
            <rect x="300" y="90" width="10" height="170" fill="#f59e0b" />

            {/* Header (Lintel) - Resting on Jacks */}
            <rect x="90" y="50" width="220" height="40" fill="#92400e" rx="1" />
            
            {/* Rough Sill */}
            <rect x="100" y="190" width="200" height="10" fill="#d97706" />

            {/* Cripple Studs (Under Sill) */}
            <rect x="130" y="200" width="10" height="60" fill="#d97706" />
            <rect x="195" y="200" width="10" height="60" fill="#d97706" />
            <rect x="260" y="200" width="10" height="60" fill="#d97706" />

            {/* --- Labels & Dimension Lines --- */}
            
            {/* Stud Spacing - CORRECTED TO CENTER-TO-CENTER */}
            <line x1="25" y1="150" x2="85" y2="150" stroke="#38bdf8" strokeWidth="1" strokeDasharray="2" />
            <line x1="25" y1="140" x2="25" y2="160" stroke="#38bdf8" strokeWidth="1" />
            <line x1="85" y1="140" x2="85" y2="160" stroke="#38bdf8" strokeWidth="1" />
            <text x="55" y="145" fill="#f8fafc" stroke="#0f172a" strokeWidth="3" paintOrder="stroke fill" fontSize="8" textAnchor="middle" className="font-bold">400mm (16") O.C.</text>
            
            {/* Header Label */}
            <text x="200" y="74" fill="#fef3c7" fontSize="12" textAnchor="middle" className="font-bold tracking-widest">HEADER (LINTEL)</text>

            {/* King & Jack Labels */}
            <line x1="85" y1="80" x2="45" y2="80" stroke="#fef3c7" strokeWidth="1" />
            <text x="15" y="83" fill="#fef3c7" stroke="#0f172a" strokeWidth="3" paintOrder="stroke fill" fontSize="8" textAnchor="start" className="font-bold">KING STUD</text>
            
            <line x1="95" y1="120" x2="115" y2="120" stroke="#fef3c7" strokeWidth="1" />
            <text x="120" y="123" fill="#fef3c7" fontSize="8" textAnchor="start" className="font-bold">JACK STUD</text>

            {/* Sill & Cripple Labels */}
            <text x="200" y="185" fill="#fef3c7" fontSize="9" textAnchor="middle" className="font-bold">ROUGH SILL</text>
            
            <line x1="265" y1="230" x2="310" y2="230" stroke="#fef3c7" strokeWidth="1" />
            <text x="315" y="233" fill="#fef3c7" stroke="#0f172a" strokeWidth="3" paintOrder="stroke fill" fontSize="8" textAnchor="start" className="font-bold">CRIPPLE STUD</text>

            {/* Plates Labels */}
            <text x="200" y="25" fill="#fef3c7" fontSize="9" textAnchor="middle" className="font-bold">DOUBLE TOP PLATE</text>
            <text x="200" y="285" fill="#fef3c7" fontSize="9" textAnchor="middle" className="font-bold">BOTTOM (SOLE) PLATE</text>

          </svg>
        </div>
      )

    case 'windows_doors':
      return (
        <div className="border border-slate-200 dark:border-slate-800 bg-slate-900 rounded-xl overflow-hidden shadow-inner p-1">
          <svg viewBox="0 0 400 300" className="w-full h-full drop-shadow-md bg-slate-900 rounded-xl p-2 font-sans select-none">
            
            {/* 1. Wood Rough Opening Context */}
            <rect x="80" y="20" width="240" height="30" fill="#92400e" /> {/* Header */}
            <text x="200" y="36" fill="#fef3c7" fontSize="8" textAnchor="middle" opacity="0.8">ROUGH HEADER</text>

            <rect x="80" y="230" width="240" height="30" fill="#92400e" /> {/* Rough Sill */}
            <text x="200" y="250" fill="#fef3c7" fontSize="8" textAnchor="middle" opacity="0.8">ROUGH SILL</text>

            <rect x="100" y="50" width="15" height="180" fill="#b45309" /> {/* Left Jack Stud */}
            <rect x="285" y="50" width="15" height="180" fill="#b45309" /> {/* Right Jack Stud */}
            
            {/* 2. Low Expansion Foam Gap (Yellow - Fills RO gap entirely) */}
            <rect x="115" y="50" width="170" height="180" fill="#fef08a" opacity="0.7" />

            {/* 3. Window Unit (Blue) */}
            <rect x="125" y="65" width="150" height="150" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="2" />
            <text x="200" y="145" fill="#93c5fd" fontSize="12" textAnchor="middle" className="font-bold tracking-widest">WINDOW UNIT</text>

            {/* 4. Sill Pan Flashing (Red - Base sits on sill, legs up jacks) */}
            <rect x="90" y="228" width="220" height="6" fill="#ef4444" opacity="0.9" /> {/* Base */}
            <rect x="100" y="195" width="5" height="35" fill="#ef4444" opacity="0.9" /> {/* Left Leg */}
            <rect x="295" y="195" width="5" height="35" fill="#ef4444" opacity="0.9" /> {/* Right Leg */}

            {/* 5. Jamb Tape (Green - Overlaps sill pan and covers foam gap) */}
            {/* Drawn AFTER sill pan to visually overlap it */}
            <rect x="105" y="48" width="20" height="190" fill="#22c55e" opacity="0.85" />
            <rect x="275" y="48" width="20" height="190" fill="#22c55e" opacity="0.85" />

            {/* 6. Head Flashing (Orange - Overlaps jamb tape) */}
            {/* Drawn AFTER jamb tape to visually overlap it, creating true 'shingle fashion' */}
            <rect x="90" y="42" width="220" height="12" fill="#f59e0b" opacity="0.9" />

            {/* --- Safe-Margin Labels & Dimension Lines --- */}

            {/* Head Flashing Label - Offset to x=130 to avoid ROUGH HEADER text */}
            <line x1="130" y1="42" x2="130" y2="15" stroke="#f59e0b" strokeWidth="1" />
            <text x="130" y="10" fill="#f59e0b" fontSize="9" textAnchor="middle" className="font-bold">3. HEAD FLASHING (TOP)</text>

            {/* Sill Pan Label - Offset to x=130 to avoid ROUGH SILL text */}
            <line x1="130" y1="234" x2="130" y2="265" stroke="#ef4444" strokeWidth="1" />
            <text x="130" y="275" fill="#ef4444" fontSize="9" textAnchor="middle" className="font-bold">1. SILL PAN (BOTTOM)</text>

            {/* Jamb Tape Label */}
            <line x1="295" y1="120" x2="320" y2="120" stroke="#22c55e" strokeWidth="1" />
            <text x="325" y="123" fill="#22c55e" fontSize="9" textAnchor="start" className="font-bold">2. JAMB TAPE</text>

            {/* Foam Label */}
            <line x1="115" y1="160" x2="85" y2="160" stroke="#fef08a" strokeWidth="1" />
            <text x="80" y="155" fill="#fef08a" fontSize="9" textAnchor="end" className="font-bold">LOW-EXPANSION</text>
            <text x="80" y="167" fill="#fef08a" fontSize="9" textAnchor="end" className="font-bold">FOAM</text>
            
          </svg>
        </div>
      )

    case 'decks':
      return (
        <div className="border border-slate-200 dark:border-slate-800 bg-slate-900 rounded-xl overflow-hidden shadow-inner p-1">
          <svg viewBox="0 0 400 300" className="w-full h-full drop-shadow-md bg-slate-900 rounded-xl p-2 font-sans select-none">
            
            {/* 1. House Structure (Platform Framing) */}
            
            {/* Foundation Wall (Supporting the floor system) */}
            <rect x="20" y="180" width="65" height="120" fill="#334155" /> 
            <text x="52" y="240" fill="#94a3b8" fontSize="8" textAnchor="middle" transform="rotate(-90 52 240)" className="font-bold tracking-widest">FOUNDATION</text>

            {/* Interior Floor System Cavity */}
            <rect x="20" y="80" width="40" height="100" fill="#475569" />
            <text x="40" y="130" fill="#94a3b8" fontSize="7" textAnchor="middle" transform="rotate(-90 40 130)" className="font-bold tracking-widest">FLOOR SYSTEM</text>

            {/* House Rim Joist (Sitting on foundation, perimeter of floor) */}
            <rect x="60" y="80" width="25" height="100" fill="#78350f" /> 
            <text x="72" y="130" fill="#cbd5e1" fontSize="8" textAnchor="middle" transform="rotate(-90 72 130)" className="font-bold">RIM JOIST</text>

            {/* Interior Subfloor (Sitting on top of floor system) */}
            <rect x="20" y="65" width="65" height="15" fill="#64748b" /> 
            <text x="40" y="74" fill="#cbd5e1" fontSize="7" textAnchor="middle" className="font-bold tracking-widest">SUBFLOOR</text>

            {/* Exterior Wall (Shifted outside, bearing directly over rim joist) */}
            <rect x="60" y="20" width="25" height="35" fill="#334155" />
            <text x="72" y="37" fill="#94a3b8" fontSize="7" textAnchor="middle" transform="rotate(-90 72 37)" className="font-bold">EXT WALL</text>

            {/* Door Sill / Threshold */}
            <rect x="55" y="55" width="35" height="10" fill="#94a3b8" />

            {/* 2. Z-Flashing (Red - Tucked under sill, down rim, over ledger) */}
            <path d="M 85 65 L 85 108 L 110 108 L 110 115" fill="none" stroke="#ef4444" strokeWidth="2.5" />

            {/* 3. Ledger Board & Horizontal Lag Screws */}
            {/* Ledger is bolted to the OUTSIDE face of the Rim Joist */}
            <rect x="85" y="110" width="25" height="70" fill="#92400e" /> 
            <text x="97" y="145" fill="#fef3c7" fontSize="8" textAnchor="middle" transform="rotate(-90 97 145)" className="font-bold">LEDGER</text>
            
            {/* Top Lag Screw (Penetrating Ledger and Rim Joist) */}
            <rect x="65" y="125" width="45" height="4" fill="#cbd5e1" /> {/* Shaft */}
            <rect x="110" y="123" width="4" height="8" fill="#94a3b8" /> {/* Bolt Head */}
            
            {/* Bottom Lag Screw */}
            <rect x="65" y="160" width="45" height="4" fill="#cbd5e1" /> {/* Shaft */}
            <rect x="110" y="158" width="4" height="8" fill="#94a3b8" /> {/* Bolt Head */}

            {/* 4. Deck Joist & Decking */}
            <rect x="110" y="110" width="160" height="70" fill="#b45309" /> {/* Deck Joist */}
            
            {/* Joist Hanger */}
            <path d="M 110 110 L 116 110 L 116 180 L 110 180" fill="none" stroke="#94a3b8" strokeWidth="2" />

            {/* Deck Boards (Top edge at y=95) */}
            <rect x="115" y="95" width="35" height="15" fill="#d97706" rx="2" />
            <rect x="155" y="95" width="35" height="15" fill="#d97706" rx="2" />
            <rect x="195" y="95" width="35" height="15" fill="#d97706" rx="2" />
            
            {/* 5. Guardrail System (Post & Spindles) */}
            <rect x="245" y="25" width="25" height="175" fill="#78350f" stroke="#451a03" strokeWidth="1" /> 
            
            {/* Post Through-bolts */}
            <circle cx="257" cy="130" r="3" fill="#38bdf8" />
            <circle cx="257" cy="160" r="3" fill="#38bdf8" /> 
            
            <rect x="255" y="25" width="120" height="10" fill="#d97706" /> {/* Top Rail */}
            <rect x="255" y="75" width="120" height="10" fill="#d97706" /> {/* Bottom Rail */}
            
            {/* Spindles */}
            <rect x="285" y="35" width="6" height="40" fill="#fcd34d" />
            <rect x="325" y="35" width="6" height="40" fill="#fcd34d" />
            <rect x="365" y="35" width="6" height="40" fill="#fcd34d" />

            {/* --- Safe-Margin Labels & Dimension Lines --- */}

            {/* Step Down Label with Dimensions (Subfloor is y=65, Deck is y=95) */}
            <line x1="85" y1="65" x2="145" y2="65" stroke="#a3e635" strokeWidth="1" strokeDasharray="2,2" />
            <line x1="140" y1="65" x2="140" y2="95" stroke="#a3e635" strokeWidth="1" />
            <polygon points="137,92 143,92 140,95" fill="#a3e635" />
            <polygon points="137,68 143,68 140,65" fill="#a3e635" />
            <text x="148" y="77" fill="#a3e635" fontSize="8" textAnchor="start" className="font-bold">MIN 50mm / 2"</text>
            <text x="148" y="87" fill="#a3e635" fontSize="8" textAnchor="start" className="font-bold">STEP DOWN</text>

            {/* Z-Flashing Label */}
            <line x1="85" y1="108" x2="85" y2="88" stroke="#ef4444" strokeWidth="1" />
            <text x="85" y="83" fill="#ef4444" fontSize="9" textAnchor="middle" className="font-bold">Z-FLASHING</text>

            {/* Ledger Lag Label */}
            <line x1="112" y1="162" x2="112" y2="200" stroke="#cbd5e1" strokeWidth="1" />
            <text x="112" y="210" fill="#cbd5e1" fontSize="9" textAnchor="middle" className="font-bold">EMBEDDED LAGS</text>

            {/* Post Notch Label */}
            <line x1="257" y1="165" x2="257" y2="210" stroke="#38bdf8" strokeWidth="1" />
            <text x="257" y="220" fill="#38bdf8" fontSize="9" textAnchor="middle" className="font-bold">THROUGH-BOLTED</text>
            <text x="257" y="232" fill="#38bdf8" fontSize="9" textAnchor="middle" className="font-bold">(NO NOTCH)</text>

            {/* Spacing Label */}
            <line x1="291" y1="12" x2="325" y2="12" stroke="#fef08a" strokeWidth="1" />
            <line x1="291" y1="9" x2="291" y2="25" stroke="#fef08a" strokeWidth="1" />
            <line x1="325" y1="9" x2="325" y2="25" stroke="#fef08a" strokeWidth="1" />
            <text x="308" y="8" fill="#fef08a" fontSize="10" textAnchor="middle" className="font-bold">MAX 100mm / 4"</text>

            {/* Guard Height Label */}
            <line x1="380" y1="25" x2="380" y2="95" stroke="#93c5fd" strokeWidth="1" strokeDasharray="2,2" />
            <line x1="375" y1="25" x2="385" y2="25" stroke="#93c5fd" strokeWidth="1" />
            <line x1="375" y1="95" x2="385" y2="95" stroke="#93c5fd" strokeWidth="1" />
            
            <text x="385" y="55" fill="#93c5fd" stroke="#0f172a" strokeWidth="3" paintOrder="stroke fill" fontSize="9" textAnchor="start" className="font-bold">MIN 900mm</text>
            <text x="385" y="68" fill="#93c5fd" stroke="#0f172a" strokeWidth="3" paintOrder="stroke fill" fontSize="9" textAnchor="start" className="font-bold">/ 36" HEIGHT</text>

          </svg>
        </div>
      )

    case 'docks_boathouses':
      return (
        <div className="border border-slate-200 dark:border-slate-800 bg-slate-900 rounded-xl overflow-hidden shadow-inner p-1">
          <svg viewBox="0 0 400 300" className="w-full h-full drop-shadow-md bg-slate-900 rounded-xl p-2 font-sans">
            
            {/* 1. Environment (Lakebed and Water) */}
            <rect x="0" y="240" width="400" height="60" fill="#1e293b" /> {/* Lakebed */}
            <rect x="0" y="120" width="400" height="120" fill="#0f172a" /> {/* Deep Water */}
            
            {/* Ice Sheet (Expanding) */}
            <rect x="0" y="115" width="400" height="15" fill="#38bdf8" opacity="0.4" /> 
            <line x1="0" y1="115" x2="400" y2="115" stroke="#bae6fd" strokeWidth="2" strokeDasharray="4,4" opacity="0.6"/>
            <text x="200" y="145" fill="#7dd3fc" fontSize="9" textAnchor="middle" className="font-bold tracking-widest" opacity="0.7">WINTER ICE SHEET</text>

            {/* 2. Crib Dock (Left Side - Angled Ice Breaker) */}
            
            {/* Timber Crib Frame */}
            <polygon points="30,250 140,250 140,90 80,90" fill="none" stroke="#b45309" strokeWidth="6" strokeLinejoin="round" />
            <line x1="42" y1="210" x2="140" y2="210" stroke="#b45309" strokeWidth="4" />
            <line x1="55" y1="170" x2="140" y2="170" stroke="#b45309" strokeWidth="4" />
            <line x1="67" y1="130" x2="140" y2="130" stroke="#b45309" strokeWidth="4" />
            
            {/* Stone Ballast Fill */}
            <circle cx="65" cy="235" r="10" fill="#475569" />
            <circle cx="90" cy="230" r="14" fill="#64748b" />
            <circle cx="120" cy="235" r="11" fill="#334155" />
            <circle cx="80" cy="205" r="12" fill="#475569" />
            <circle cx="115" cy="210" r="15" fill="#64748b" />
            <circle cx="100" cy="185" r="12" fill="#334155" />
            <circle cx="125" cy="180" r="10" fill="#475569" />
            <circle cx="115" cy="155" r="11" fill="#64748b" />
            <circle cx="130" cy="140" r="8" fill="#475569" />

            {/* Crib Decking & Beam */}
            <rect x="30" y="86" width="115" height="8" fill="#92400e" rx="1" /> {/* Deck Beam */}
            <rect x="25" y="76" width="125" height="10" fill="#d97706" rx="2" /> {/* Deck Boards */}
            
            {/* Labels for Crib */}
            <text x="85" y="68" fill="#fcd34d" fontSize="10" textAnchor="middle" className="font-bold">CRIB DOCK</text>
            
            {/* Ice Deflection Arrow & Label (Shifted left to avoid overlapping ballast) */}
            <path d="M 45 115 Q 60 110 70 95" fill="none" stroke="#bae6fd" strokeWidth="2" markerEnd="url(#arrow)" />
            <text x="15" y="160" fill="#bae6fd" fontSize="8" textAnchor="start" className="font-bold">ANGLED FACE</text>
            <text x="15" y="170" fill="#bae6fd" fontSize="8" textAnchor="start" className="font-bold">DEFLECTS ICE</text>

            {/* 3. Steel Pile Dock (Right Side) */}
            
            {/* Steel Pile (Driven into lakebed, supporting beam from below) */}
            <rect x="280" y="94" width="16" height="186" fill="#94a3b8" /> 
            
            {/* Pile Decking & Beam */}
            <rect x="240" y="86" width="95" height="8" fill="#92400e" rx="1" /> {/* Deck Beam */}
            <rect x="235" y="76" width="105" height="10" fill="#d97706" rx="2" /> {/* Deck Boards */}
            
            {/* Labels for Pile */}
            <text x="288" y="68" fill="#fcd34d" fontSize="10" textAnchor="middle" className="font-bold">PILE DOCK</text>
            
            {/* Fixed text for steel pile */}
            <line x1="300" y1="160" x2="320" y2="160" stroke="#38bdf8" strokeWidth="1" />
            <text x="325" y="158" fill="#38bdf8" fontSize="8" textAnchor="start" className="font-bold">SMOOTH STEEL PILE</text>
            <text x="325" y="168" fill="#38bdf8" fontSize="8" textAnchor="start" className="font-bold">(RESISTS UPLIFT)</text>

            {/* Defs for Arrowhead */}
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#bae6fd" />
              </marker>
            </defs>

          </svg>
        </div>
      )

    case 'stairs':
      return (
        <div className="border border-slate-200 dark:border-slate-800 bg-slate-900 rounded-xl overflow-hidden shadow-inner p-1">
          <svg viewBox="0 0 400 300" className="w-full h-full drop-shadow-md bg-slate-900 rounded-xl p-2 font-sans">
            
            {/* 1. Environment / Floors */}
            {/* Lower Floor */}
            <rect x="20" y="250" width="120" height="10" fill="#334155" /> 
            <text x="80" y="275" fill="#94a3b8" fontSize="10" textAnchor="middle" className="font-bold tracking-widest">LOWER FLOOR</text>
            
            {/* Upper Floor Rim/Subfloor */}
            <rect x="270" y="80" width="110" height="170" fill="#334155" />
            <rect x="270" y="70" width="110" height="10" fill="#64748b" /> {/* Upper subfloor */}
            <text x="325" y="60" fill="#94a3b8" fontSize="10" textAnchor="middle" className="font-bold tracking-widest">UPPER FLOOR</text>

            {/* 2. Structural Stringer (2x12 Cut) */}
            {/* The base sits at y=250. Step 1 cut is at y=200. Step 2 cut is at y=140. Step 3 cut is at y=80. */}
            <polygon points="90,250 90,200 150,200 150,140 210,140 210,80 270,80 270,120 140,250" fill="#78350f" stroke="#451a03" strokeWidth="2" strokeLinejoin="round" />
            
            <defs>
              <path id="stringerPath" d="M 130 240 L 260 110" />
            </defs>
            <text fill="#fef3c7" fontSize="9" className="font-bold tracking-widest opacity-80">
              <textPath href="#stringerPath" startOffset="10%">CUT WOOD STRINGER</textPath>
            </text>

            {/* 3. Risers & Treads (Finished Materials) */}
            {/* Riser Boards (Vertical) */}
            <rect x="90" y="200" width="5" height="50" fill="#d97706" /> 
            <rect x="150" y="140" width="5" height="60" fill="#d97706" />
            <rect x="210" y="80" width="5" height="60" fill="#d97706" />
            
            {/* Tread Boards (Horizontal with Nosing overhang) - 10px thick */}
            <rect x="80" y="190" width="75" height="10" fill="#f59e0b" rx="2" /> {/* Step 1 */}
            <rect x="140" y="130" width="75" height="10" fill="#f59e0b" rx="2" /> {/* Step 2 */}
            <rect x="200" y="70" width="75" height="10" fill="#f59e0b" rx="2" /> {/* Step 3 */}

            {/* 4. "Dropped Stringer" Visual Indicator */}
            {/* Showing the 10px cut off the bottom to account for the tread thickness */}
            <line x1="88" y1="260" x2="142" y2="260" stroke="#ef4444" strokeWidth="2" strokeDasharray="4,2" />
            <line x1="90" y1="250" x2="90" y2="260" stroke="#ef4444" strokeWidth="2" strokeDasharray="2,2" />
            
            {/* Dropped Stringer Label */}
            <path d="M 120 260 L 140 280 L 160 280" fill="none" stroke="#ef4444" strokeWidth="1" />
            <text x="220" y="278" fill="#ef4444" fontSize="8" textAnchor="middle" className="font-bold">DROPPED STRINGER</text>
            <text x="220" y="288" fill="#ef4444" fontSize="7" textAnchor="middle" className="opacity-80">(TREAD THICKNESS REMOVED)</text>

            {/* 5. Dimension Lines & Code Labels */}
            
            {/* Tread Run Label */}
            <line x1="145" y1="115" x2="210" y2="115" stroke="#38bdf8" strokeWidth="1" strokeDasharray="2,2" />
            <line x1="145" y1="112" x2="145" y2="118" stroke="#38bdf8" strokeWidth="1" />
            <line x1="210" y1="112" x2="210" y2="118" stroke="#38bdf8" strokeWidth="1" />
            <text x="177" y="103" fill="#38bdf8" fontSize="8" textAnchor="middle" className="font-bold">TREAD RUN</text>
            <text x="177" y="112" fill="#38bdf8" fontSize="8" textAnchor="middle" className="font-bold">MIN 255mm / 10"</text>

            {/* Riser Height Label */}
            <line x1="65" y1="190" x2="65" y2="250" stroke="#a3e635" strokeWidth="1" strokeDasharray="2,2" />
            <line x1="62" y1="190" x2="68" y2="190" stroke="#a3e635" strokeWidth="1" />
            <line x1="62" y1="250" x2="68" y2="250" stroke="#a3e635" strokeWidth="1" />
            <text x="60" y="215" fill="#a3e635" fontSize="8" textAnchor="end" className="font-bold">RISER HT</text>
            <text x="60" y="225" fill="#a3e635" fontSize="8" textAnchor="end" className="font-bold">MAX 200mm / 8"</text>

            {/* Effective Depth (Throat) Label */}
            {/* Drawing a line perpendicular to the stringer pitch at the narrowest point */}
            <line x1="210" y1="140" x2="238" y2="168" stroke="#fef08a" strokeWidth="2" />
            <polygon points="210,140 215,145 208,147" fill="#fef08a" />
            <polygon points="238,168 233,163 240,161" fill="#fef08a" />
            
            <path d="M 238 168 L 260 190 L 270 190" fill="none" stroke="#fef08a" strokeWidth="1" />
            <text x="275" y="188" fill="#fef08a" fontSize="8" textAnchor="start" className="font-bold">EFFECTIVE DEPTH (THROAT)</text>
            <text x="275" y="198" fill="#fef08a" fontSize="8" textAnchor="start" className="font-bold">MIN 90mm / 3.5"</text>

          </svg>
        </div>
      )

    case 'heavy_mass_timber':
      return (
        <div className="border border-slate-200 dark:border-slate-800 bg-slate-900 rounded-xl overflow-hidden shadow-inner p-1">
<svg viewBox="0 0 1000 600" className="w-full h-full drop-shadow-md bg-slate-900 rounded-xl p-2 font-sans select-none">
            {/* Column */}
            <rect x="400" y="300" width="200" height="250" fill="#fcd34d" stroke="#b45309" strokeWidth="4" />
            <path d="M 430 300 Q 440 400 420 550 M 470 300 Q 450 450 480 550 M 520 300 Q 540 400 510 550 M 570 300 Q 560 420 580 550" fill="none" stroke="#d97706" strokeWidth="2" strokeDasharray="10 5" />
            {/* Beam */}
            <rect x="150" y="100" width="700" height="200" fill="#fcd34d" stroke="#b45309" strokeWidth="4" />
            <line x1="150" y1="125" x2="850" y2="125" stroke="#d97706" strokeWidth="2" />
            <line x1="150" y1="150" x2="850" y2="150" stroke="#d97706" strokeWidth="2" />
            <line x1="150" y1="175" x2="850" y2="175" stroke="#d97706" strokeWidth="2" />
            <line x1="150" y1="200" x2="850" y2="200" stroke="#d97706" strokeWidth="2" />
            <line x1="150" y1="225" x2="850" y2="225" stroke="#d97706" strokeWidth="2" />
            <line x1="150" y1="250" x2="850" y2="250" stroke="#d97706" strokeWidth="2" />
            <line x1="150" y1="275" x2="850" y2="275" stroke="#d97706" strokeWidth="2" />
            {/* Steel Bracket */}
            <path d="M 400 200 L 600 200 L 600 400 L 400 400 Z" fill="#64748b" stroke="#334155" strokeWidth="4" />
            {/* Bolts */}
            <g>
              <circle cx="450" cy="250" r="12" fill="#cbd5e1" stroke="#0f172a" strokeWidth="2" />
              <circle cx="450" cy="250" r="6" fill="#0f172a" />
              <circle cx="550" cy="250" r="12" fill="#cbd5e1" stroke="#0f172a" strokeWidth="2" />
              <circle cx="550" cy="250" r="6" fill="#0f172a" />
              <circle cx="500" cy="330" r="12" fill="#cbd5e1" stroke="#0f172a" strokeWidth="2" />
              <circle cx="500" cy="330" r="6" fill="#0f172a" />
              <circle cx="500" cy="370" r="12" fill="#cbd5e1" stroke="#0f172a" strokeWidth="2" />
              <circle cx="500" cy="370" r="6" fill="#0f172a" />
            </g>
            
            {/* Callouts (Left) */}
            <line x1="320" y1="130" x2="45%" y2="130" stroke="#f8fafc" strokeWidth="2" />
            <text x="5%" y="130" fontSize="36" textAnchor="start" dominantBaseline="middle" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold">GLULAM BEAM (LAMINATED LAYERS)</text>
            
            <line x1="320" y1="450" x2="45%" y2="450" stroke="#f8fafc" strokeWidth="2" />
            <text x="5%" y="450" fontSize="36" textAnchor="start" dominantBaseline="middle" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold">HEAVY TIMBER COLUMN</text>
            
            {/* Callouts (Right) */}
            <line x1="680" y1="250" x2="55%" y2="250" stroke="#f8fafc" strokeWidth="2" />
            <text x="95%" y="250" fontSize="36" textAnchor="end" dominantBaseline="middle" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold">THROUGH-BOLTS WITH WASHERS</text>
            
            <line x1="680" y1="360" x2="55%" y2="360" stroke="#f8fafc" strokeWidth="2" />
            <text x="95%" y="360" fontSize="36" textAnchor="end" dominantBaseline="middle" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold">STEEL SADDLE BRACKET</text>
          </svg>
        </div>
      )
    case 'commercial_doors':
      return (
        <div className="border border-slate-200 dark:border-slate-800 bg-slate-900 rounded-xl overflow-hidden shadow-inner p-1">
          <svg viewBox="0 0 1000 1050" className="w-full h-full drop-shadow-md bg-slate-900 rounded-xl p-2 font-sans select-none">
            <rect x="280" y="30" width="440" height="1040" fill="#64748b" stroke="#334155" strokeWidth="4" />
            <rect x="310" y="60" width="380" height="1010" fill="#0f172a" stroke="#1e293b" strokeWidth="2" />
            <rect x="315" y="65" width="370" height="1005" fill="#94a3b8" stroke="#475569" strokeWidth="4" />
            <rect x="310" y="150" width="15" height="50" fill="#cbd5e1" stroke="#334155" strokeWidth="2" />
            <rect x="310" y="500" width="15" height="50" fill="#cbd5e1" stroke="#334155" strokeWidth="2" />
            <rect x="310" y="850" width="15" height="50" fill="#cbd5e1" stroke="#334155" strokeWidth="2" />
            <rect x="350" y="530" width="300" height="40" fill="#475569" stroke="#1e293b" strokeWidth="2" />
            <rect x="370" y="540" width="260" height="20" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1" />
            <rect x="520" y="80" width="120" height="30" fill="#475569" stroke="#1e293b" strokeWidth="2" rx="4" />
            <polyline points="550,80 520,45 660,45" fill="none" stroke="#64748b" strokeWidth="6" strokeLinejoin="round" />
            <circle cx="660" cy="45" r="5" fill="#1e293b" />
            
            <line x1="290" y1="130" x2="45%" y2="130" stroke="#f8fafc" strokeWidth="2" />
            <text x="5%" y="130" fontSize="36" textAnchor="start" dominantBaseline="middle" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold">STEEL DOOR FRAME (GROUT FILLED)</text>
            
            <line x1="310" y1="875" x2="45%" y2="875" stroke="#f8fafc" strokeWidth="2" />
            <text x="5%" y="875" fontSize="36" textAnchor="start" dominantBaseline="middle" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold">HEAVY-DUTY BALL BEARING HINGES</text>
            
            <line x1="640" y1="130" x2="55%" y2="130" stroke="#f8fafc" strokeWidth="2" />
            <text x="95%" y="130" fontSize="36" textAnchor="end" dominantBaseline="middle" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold">PNEUMATIC DOOR CLOSER</text>
            
            <line x1="650" y1="350" x2="55%" y2="350" stroke="#f8fafc" strokeWidth="2" />
            <text x="95%" y="350" fontSize="36" textAnchor="end" dominantBaseline="middle" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold">FIRE-RATED STEEL DOOR SLAB</text>
            
            <line x1="650" y1="550" x2="55%" y2="480" stroke="#f8fafc" strokeWidth="2" />
            <text x="95%" y="480" fontSize="36" textAnchor="end" dominantBaseline="middle" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold">PANIC HARDWARE (EXIT DEVICE)</text>
          </svg>
        </div>
      )
    case 'suspended_ceilings':
      return (
        <div className="border border-slate-200 dark:border-slate-800 bg-slate-900 rounded-xl overflow-hidden shadow-inner p-1">
<svg viewBox="0 100 1000 950" className="w-full h-full drop-shadow-md bg-slate-900 rounded-xl p-2 font-sans select-none">
            {/* Hanger Wire */}
            <path d="M 500 100 Q 520 200 500 300 T 500 500" fill="none" stroke="#94a3b8" strokeWidth="6" />
            <path d="M 500 400 C 480 430 520 460 500 480" fill="none" stroke="#94a3b8" strokeWidth="6" />
            <path d="M 500 420 C 480 450 520 480 500 500" fill="none" stroke="#94a3b8" strokeWidth="6" />
            <path d="M 500 440 C 480 470 520 500 500 520" fill="none" stroke="#94a3b8" strokeWidth="6" />
            
            {/* Main Tee */}
            <rect x="480" y="500" width="40" height="200" fill="#cbd5e1" stroke="#475569" strokeWidth="4" />
            <rect x="420" y="700" width="160" height="20" fill="#f1f5f9" stroke="#475569" strokeWidth="4" />
            
            {/* Cross Tee (coming from side) */}
            <rect x="580" y="550" width="300" height="150" fill="#94a3b8" stroke="#475569" strokeWidth="4" />
            <rect x="580" y="700" width="300" height="20" fill="#e2e8f0" stroke="#475569" strokeWidth="4" />
            
            {/* Acoustic Ceiling Tile Left */}
            <rect x="150" y="680" width="270" height="20" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" />
            <path d="M 150 680 L 170 660 L 420 660 L 420 680" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
            <path d="M 170 660 L 170 650 L 420 650 L 420 660" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="2" />
            
            {/* Acoustic Ceiling Tile Right */}
            <rect x="580" y="680" width="300" height="20" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" />
            <path d="M 580 680 L 580 660 L 850 660 L 880 680" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />

            {/* Texture for tiles */}
            <g fill="#94a3b8" opacity="0.5">
              <circle cx="200" cy="690" r="2" />
              <circle cx="250" cy="695" r="3" />
              <circle cx="300" cy="685" r="1.5" />
              <circle cx="350" cy="690" r="2.5" />
              <circle cx="400" cy="695" r="2" />
              
              <circle cx="620" cy="690" r="2" />
              <circle cx="680" cy="695" r="3" />
              <circle cx="750" cy="685" r="1.5" />
              <circle cx="800" cy="690" r="2.5" />
              <circle cx="850" cy="695" r="2" />
            </g>

            {/* Callouts (Left) */}
            <line x1="480" y1="300" x2="45%" y2="300" stroke="#f8fafc" strokeWidth="2" />
            <text x="5%" y="300" fontSize="36" textAnchor="start" dominantBaseline="middle" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold">12-GAUGE HANGER WIRE (TWISTED 3 TIMES)</text>

            <line x1="480" y1="580" x2="45%" y2="420" stroke="#f8fafc" strokeWidth="2" />
            <text x="5%" y="420" fontSize="36" textAnchor="start" dominantBaseline="middle" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold">MAIN TEE (SUPPORTING BEAM)</text>

            {/* Callouts (Right) */}
            <line x1="730" y1="620" x2="55%" y2="620" stroke="#f8fafc" strokeWidth="2" />
            <text x="95%" y="620" fontSize="36" textAnchor="end" dominantBaseline="middle" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold">CROSS TEE (SNAPS INTO MAIN)</text>

            <line x1="750" y1="680" x2="55%" y2="780" stroke="#f8fafc" strokeWidth="2" />
            <text x="95%" y="780" fontSize="36" textAnchor="end" dominantBaseline="middle" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold">ACOUSTIC CEILING TILE</text>
          </svg>
        </div>
      )
    case 'casework_millwork':
      return (
        <div className="border border-slate-200 dark:border-slate-800 bg-slate-900 rounded-xl overflow-hidden shadow-inner p-1">
<svg viewBox="100 0 1100 1200" className="w-full h-full drop-shadow-md bg-slate-900 rounded-xl p-2 font-sans select-none">
            <rect x="300" y="0" width="100" height="1200" fill="#fcd34d" stroke="#b45309" strokeWidth="2" />
            <rect x="300" y="150" width="100" height="150" fill="#d97706" stroke="#b45309" strokeWidth="2" />
            <path d="M 300 150 L 400 300 M 300 300 L 400 150" stroke="#b45309" strokeWidth="2" />
            <rect x="400" y="0" width="30" height="1200" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
            <polygon points="430,150 440,150 430,250" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
            <polygon points="430,450 440,450 430,350" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
            <rect x="440" y="100" width="350" height="400" fill="#f8fafc" stroke="#334155" strokeWidth="4" />
            <rect x="440" y="100" width="350" height="400" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="2" />
            <rect x="450" y="110" width="330" height="380" fill="none" stroke="#cbd5e1" strokeWidth="2" />
            <circle cx="760" cy="350" r="8" fill="#64748b" />
            <line x1="450" y1="200" x2="350" y2="200" stroke="#0f172a" strokeWidth="4" strokeDasharray="10 5" />
            <rect x="430" y="700" width="550" height="350" fill="#f8fafc" stroke="#334155" strokeWidth="4" />
            <rect x="430" y="700" width="550" height="100" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="2" />
            <rect x="430" y="800" width="550" height="250" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="2" />
            <rect x="750" y="740" width="60" height="15" fill="#64748b" rx="5" />
            <circle cx="950" cy="850" r="8" fill="#64748b" />
            <rect x="430" y="1050" width="450" height="100" fill="#1e293b" stroke="#0f172a" strokeWidth="4" />
            <rect x="430" y="670" width="580" height="30" fill="#475569" stroke="#1e293b" strokeWidth="4" rx="4" />
            
            <line x1="280" y1="225" x2="45%" y2="225" stroke="#f8fafc" strokeWidth="2" />
            <text x="15%" y="225" fontSize="42" textAnchor="start" dominantBaseline="middle" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold">SOLID WOOD WALL BLOCKING</text>
            
            <line x1="420" y1="400" x2="45%" y2="400" stroke="#f8fafc" strokeWidth="2" />
            <text x="15%" y="400" fontSize="42" textAnchor="start" dominantBaseline="middle" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold">SHIMS TO PLUMB UPPER CABINET</text>
            
            <line x1="800" y1="300" x2="55%" y2="300" stroke="#f8fafc" strokeWidth="2" />
            <text x="95%" y="300" fontSize="42" textAnchor="end" dominantBaseline="middle" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold">UPPER CABINET BOX</text>
            
            <line x1="1010" y1="685" x2="55%" y2="685" stroke="#f8fafc" strokeWidth="2" />
            <text x="95%" y="685" fontSize="42" textAnchor="end" dominantBaseline="middle" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold">COUNTERTOP (36" TYPICAL HEIGHT)</text>
            
            <line x1="900" y1="1100" x2="55%" y2="1100" stroke="#f8fafc" strokeWidth="2" />
            <text x="95%" y="1100" fontSize="42" textAnchor="end" dominantBaseline="middle" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold">TOE-KICK (4" HIGH x 3" DEEP)</text>
          </svg>
        </div>
      )
    case 'engineered_wood':
      return (
        <div className="border border-slate-200 dark:border-slate-800 bg-slate-900 rounded-xl overflow-hidden shadow-inner p-1">
<svg viewBox="0 100 1000 950" className="w-full h-full drop-shadow-md bg-slate-900 rounded-xl p-2 font-sans select-none">
            {/* Beam (Supporting) */}
            <rect x="200" y="800" width="600" height="250" fill="#d97706" stroke="#92400e" strokeWidth="6" />
            
            {/* LVL Bottom Flange */}
            <rect x="350" y="700" width="300" height="100" fill="#fcd34d" stroke="#b45309" strokeWidth="4" />
            <line x1="350" y1="720" x2="650" y2="720" stroke="#d97706" strokeWidth="2" />
            <line x1="350" y1="740" x2="650" y2="740" stroke="#d97706" strokeWidth="2" />
            <line x1="350" y1="760" x2="650" y2="760" stroke="#d97706" strokeWidth="2" />
            <line x1="350" y1="780" x2="650" y2="780" stroke="#d97706" strokeWidth="2" />

            {/* OSB Web */}
            <rect x="475" y="200" width="50" height="500" fill="#fbbf24" stroke="#d97706" strokeWidth="4" />
            {/* OSB Texture */}
            <path d="M 485 250 L 510 270 M 480 350 L 515 330 M 490 450 L 520 470 M 485 550 L 510 520 M 480 650 L 515 630" stroke="#b45309" strokeWidth="2" strokeDasharray="5 2" />

            {/* Web Stiffener (Right) */}
            <rect x="525" y="200" width="100" height="500" fill="#fde047" stroke="#ca8a04" strokeWidth="4" />
            {/* Web Stiffener (Left) */}
            <rect x="375" y="200" width="100" height="500" fill="#fde047" stroke="#ca8a04" strokeWidth="4" />

            {/* Nails for Web Stiffeners */}
            <circle cx="425" cy="300" r="4" fill="#64748b" />
            <circle cx="425" cy="450" r="4" fill="#64748b" />
            <circle cx="425" cy="600" r="4" fill="#64748b" />
            
            <circle cx="575" cy="300" r="4" fill="#64748b" />
            <circle cx="575" cy="450" r="4" fill="#64748b" />
            <circle cx="575" cy="600" r="4" fill="#64748b" />

            {/* LVL Top Flange */}
            <rect x="350" y="100" width="300" height="100" fill="#fcd34d" stroke="#b45309" strokeWidth="4" />
            <line x1="350" y1="120" x2="650" y2="120" stroke="#d97706" strokeWidth="2" />
            <line x1="350" y1="140" x2="650" y2="140" stroke="#d97706" strokeWidth="2" />
            <line x1="350" y1="160" x2="650" y2="160" stroke="#d97706" strokeWidth="2" />
            <line x1="350" y1="180" x2="650" y2="180" stroke="#d97706" strokeWidth="2" />

            {/* Callouts (Left) */}
            <line x1="350" y1="150" x2="45%" y2="150" stroke="#f8fafc" strokeWidth="2" />
            <text x="5%" y="150" fontSize="42" textAnchor="start" dominantBaseline="middle" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold">LVL TOP FLANGE</text>

            <line x1="475" y1="450" x2="45%" y2="450" stroke="#f8fafc" strokeWidth="2" />
            <text x="5%" y="450" fontSize="42" textAnchor="start" dominantBaseline="middle" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold">OSB WEB (CAN BE DRILLED)</text>

            {/* Callouts (Right) */}
            <line x1="625" y1="400" x2="55%" y2="400" stroke="#f8fafc" strokeWidth="2" />
            <text x="95%" y="400" fontSize="42" textAnchor="end" dominantBaseline="middle" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold">WEB STIFFENER (OVER BEARING POINTS)</text>

            <line x1="650" y1="750" x2="55%" y2="750" stroke="#f8fafc" strokeWidth="2" />
            <text x="95%" y="750" fontSize="42" textAnchor="end" dominantBaseline="middle" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold">LVL BOTTOM FLANGE (NEVER CUT OR NOTCH)</text>
          </svg>
        </div>
      )
    case 'light_gauge_steel':
      return (
        <div className="border border-slate-200 dark:border-slate-800 bg-slate-900 rounded-xl overflow-hidden shadow-inner p-1">
<svg viewBox="0 100 1000 950" className="w-full h-full drop-shadow-md bg-slate-900 rounded-xl p-2 font-sans select-none">
            {/* Concrete Floor */}
            <rect x="200" y="800" width="800" height="200" fill="#94a3b8" stroke="#475569" strokeWidth="4" />
            <path d="M 220 850 L 250 830 M 350 900 L 320 920 M 500 850 L 530 870 M 700 900 L 730 880" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="5 5" />
            
            {/* U-Shaped Steel Floor Track */}
            <rect x="400" y="750" width="400" height="50" fill="#cbd5e1" stroke="#334155" strokeWidth="6" />
            <rect x="410" y="750" width="380" height="40" fill="#94a3b8" stroke="none" />
            
            {/* C-Shaped Steel Stud */}
            <rect x="420" y="100" width="30" height="650" fill="#94a3b8" stroke="#334155" strokeWidth="6" />
            <rect x="450" y="100" width="300" height="650" fill="#cbd5e1" stroke="#334155" strokeWidth="6" />
            <rect x="750" y="100" width="20" height="650" fill="#94a3b8" stroke="#334155" strokeWidth="6" />
            
            {/* Pre-punched Knockout */}
            <rect x="500" y="300" width="100" height="200" rx="50" fill="#475569" stroke="#1e293b" strokeWidth="4" />
            <rect x="490" y="290" width="120" height="220" rx="60" fill="none" stroke="#ef4444" strokeWidth="12" />
            
            {/* #8 Pan-Head Framing Screw */}
            <circle cx="760" cy="775" r="12" fill="#e2e8f0" stroke="#0f172a" strokeWidth="3" />
            <line x1="752" y1="775" x2="768" y2="775" stroke="#0f172a" strokeWidth="3" />
            <line x1="760" y1="767" x2="760" y2="783" stroke="#0f172a" strokeWidth="3" />

            {/* Callouts (Left) */}
            <line x1="430" y1="200" x2="45%" y2="200" stroke="#f8fafc" strokeWidth="2" />
            <text x="5%" y="200" fontSize="42" textAnchor="start" dominantBaseline="middle" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold">C-SHAPED STEEL STUD</text>

            <line x1="490" y1="400" x2="45%" y2="250" stroke="#f8fafc" strokeWidth="2" />
            <text x="5%" y="250" fontSize="42" textAnchor="start" dominantBaseline="middle" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold">PRE-PUNCHED KNOCKOUT WITH GROMMET</text>

            {/* Callouts (Right) */}
            <line x1="772" y1="775" x2="55%" y2="775" stroke="#f8fafc" strokeWidth="2" />
            <text x="95%" y="775" fontSize="42" textAnchor="end" dominantBaseline="middle" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold">#8 PAN-HEAD FRAMING SCREW</text>

            <line x1="800" y1="750" x2="55%" y2="700" stroke="#f8fafc" strokeWidth="2" />
            <text x="95%" y="700" fontSize="42" textAnchor="end" dominantBaseline="middle" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold">U-SHAPED STEEL FLOOR TRACK</text>

            <line x1="750" y1="900" x2="55%" y2="900" stroke="#f8fafc" strokeWidth="2" />
            <text x="95%" y="900" fontSize="42" textAnchor="end" dominantBaseline="middle" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold">CONCRETE FLOOR</text>
          </svg>
        </div>
      )

    case 'roof_systems':
      return (
        <div className="border border-slate-200 dark:border-slate-800 bg-slate-900 rounded-xl overflow-hidden shadow-inner p-1">
          <svg viewBox="0 0 400 300" className="w-full h-full drop-shadow-md bg-slate-900 rounded-xl p-2 font-sans">
            
            {/* 1. Environment / Supporting Walls */}
            <rect x="50" y="240" width="30" height="40" fill="#334155" />
            <rect x="50" y="225" width="30" height="15" fill="#ca8a04" stroke="#a16207" strokeWidth="1" /> 
            <rect x="50" y="210" width="30" height="15" fill="#ca8a04" stroke="#a16207" strokeWidth="1" /> 
            <text x="65" y="260" fill="#94a3b8" fontSize="8" textAnchor="middle" className="font-bold">TOP PLATES</text>

            <rect x="320" y="240" width="30" height="40" fill="#334155" />
            <rect x="320" y="225" width="30" height="15" fill="#ca8a04" stroke="#a16207" strokeWidth="1" />
            <rect x="320" y="210" width="30" height="15" fill="#ca8a04" stroke="#a16207" strokeWidth="1" />

            {/* 2. Engineered Truss Structure (Fink Design) */}
            {/* Bottom Chord */}
            <rect x="40" y="195" width="320" height="15" fill="#b45309" stroke="#78350f" strokeWidth="1" />
            
            {/* Top Chords */}
            <polygon points="25,210 200,45 200,65 40,210" fill="#b45309" stroke="#78350f" strokeWidth="1" />
            <polygon points="375,210 200,45 200,65 360,210" fill="#b45309" stroke="#78350f" strokeWidth="1" />

            {/* Web Members */}
            <polygon points="105,195 135,115 145,120 120,195" fill="#92400e" stroke="#78350f" strokeWidth="1" />
            <polygon points="200,195 135,115 145,110 215,195" fill="#92400e" stroke="#78350f" strokeWidth="1" />
            <polygon points="200,195 265,115 255,110 185,195" fill="#92400e" stroke="#78350f" strokeWidth="1" />
            <polygon points="295,195 265,115 255,120 280,195" fill="#92400e" stroke="#78350f" strokeWidth="1" />

            {/* Standardized Metal Gusset Plates (Galvanized Connectors) */}
            <rect x="45" y="188" width="30" height="22" fill="#94a3b8" rx="2" /> {/* Left Heel */}
            <rect x="325" y="188" width="30" height="22" fill="#94a3b8" rx="2" /> {/* Right Heel */}
            <rect x="185" y="45" width="30" height="30" fill="#94a3b8" rx="2" /> {/* Peak */}
            <rect x="180" y="185" width="40" height="25" fill="#94a3b8" rx="2" /> {/* Bottom Center Span */}
            <rect x="105" y="188" width="25" height="15" fill="#94a3b8" rx="2" /> {/* Bottom Left Web */}
            <rect x="270" y="188" width="25" height="15" fill="#94a3b8" rx="2" /> {/* Bottom Right Web */}
            <rect x="125" y="105" width="25" height="20" fill="#94a3b8" rx="2" transform="rotate(35 137 115)" /> {/* Top Left Web Joint */}
            <rect x="250" y="105" width="25" height="20" fill="#94a3b8" rx="2" transform="rotate(-35 262 115)" /> {/* Top Right Web Joint */}

            {/* 3. Roof Sheathing & H-Clip */}
            <polygon points="380,205 295,125 290,130 375,210" fill="#f59e0b" />
            <polygon points="285,115 205,40 200,45 280,120" fill="#f59e0b" />
            
            {/* The H-Clip (Red for visibility) */}
            <polygon points="293,127 282,117 278,121 289,131" fill="#ef4444" />
            
            {/* Fixed Sheathing & H-Clip Labels */}
            <path d="M 285 125 L 320 80 L 365 80" fill="none" stroke="#ef4444" strokeWidth="1" />
            <text x="365" y="75" fill="#ef4444" fontSize="8" textAnchor="end" className="font-bold">H-CLIP & 3mm GAP</text>
            <text x="365" y="90" fill="#fcd34d" fontSize="7" textAnchor="end" className="font-bold">OSB SHEATHING</text>

            {/* Fixed Gusset Plate Callout (Anchored to peak plate) */}
            <path d="M 215 60 L 260 60" fill="none" stroke="#94a3b8" strokeWidth="1" />
            <text x="265" y="63" fill="#94a3b8" fontSize="8" textAnchor="start" className="font-bold">METAL GUSSET PLATE</text>

            {/* 4. Pro-Tip Visual: DO NOT CUT WEBS */}
            <line x1="90" y1="130" x2="140" y2="180" stroke="#ef4444" strokeWidth="5" strokeLinecap="round" />
            <line x1="140" y1="130" x2="90" y2="180" stroke="#ef4444" strokeWidth="5" strokeLinecap="round" />
            
            <rect x="75" y="100" width="80" height="16" fill="#ef4444" rx="2" />
            <text x="115" y="111" fill="#ffffff" fontSize="9" textAnchor="middle" className="font-bold tracking-wider">DO NOT CUT!</text>

            {/* General Labeling */}
            <text x="200" y="25" fill="#f8fafc" fontSize="12" textAnchor="middle" className="font-bold tracking-widest">ENGINEERED ROOF TRUSS</text>
            <text x="200" y="245" fill="#94a3b8" fontSize="8" textAnchor="middle" className="font-bold tracking-widest">(24" O.C. TYPICAL SPACING)</text>

          </svg>
        </div>
      )

    case 'exterior_finish':
      return (
        <div className="border border-slate-200 dark:border-slate-800 bg-slate-900 rounded-xl overflow-hidden shadow-inner p-1">
          <svg viewBox="0 0 400 300" className="w-full h-full drop-shadow-md bg-slate-900 rounded-xl p-2 font-sans">
            
            {/* LEFT SIDE: WALL & EAVE CROSS SECTION */}
            
            {/* Ground Level */}
            <rect x="15" y="270" width="165" height="20" fill="#3f6212" />
            <text x="97" y="284" fill="#a3e635" fontSize="9" textAnchor="middle" className="font-bold tracking-widest">FINISHED GROUND</text>

            {/* Wall Structure - Shifted right by 15px to fix left margin clipping */}
            <rect x="45" y="40" width="30" height="230" fill="#b45309" stroke="#78350f" strokeWidth="1" /> {/* Stud */}
            <rect x="75" y="40" width="10" height="230" fill="#d97706" /> {/* OSB Sheathing */}
            
            {/* Weather Barrier (Tyvek) */}
            <line x1="87" y1="40" x2="87" y2="270" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4,2" />
            
            {/* Vertical Strapping (Rain Screen) */}
            <rect x="89" y="40" width="10" height="170" fill="#92400e" /> 
            
            {/* Cladding / Vinyl Siding Overlaps */}
            <polygon points="99,195 120,205 120,175 99,165" fill="#cbd5e1" stroke="#64748b" strokeWidth="1" />
            <polygon points="99,165 120,175 120,145 99,135" fill="#cbd5e1" stroke="#64748b" strokeWidth="1" />
            <polygon points="99,135 120,145 120,115 99,105" fill="#cbd5e1" stroke="#64748b" strokeWidth="1" />
            <polygon points="99,105 120,115 120,85 99,75" fill="#cbd5e1" stroke="#64748b" strokeWidth="1" />
            <polygon points="99,75 120,85 120,55 99,45" fill="#cbd5e1" stroke="#64748b" strokeWidth="1" />

            {/* Roof Overhang / Eave */}
            <polygon points="25,40 175,40 175,10 25,10" fill="#78350f" /> {/* Rafter Tail */}
            <rect x="175" y="10" width="10" height="35" fill="#f8fafc" /> {/* Fascia */}
            <rect x="120" y="40" width="55" height="6" fill="#e2e8f0" /> {/* Vented Soffit */}
            
            {/* Soffit Vent Details */}
            <line x1="130" y1="46" x2="130" y2="40" stroke="#1e293b" strokeWidth="1" />
            <line x1="140" y1="46" x2="140" y2="40" stroke="#1e293b" strokeWidth="1" />
            <line x1="150" y1="46" x2="150" y2="40" stroke="#1e293b" strokeWidth="1" />
            <line x1="160" y1="46" x2="160" y2="40" stroke="#1e293b" strokeWidth="1" />

            {/* Airflow Intake Arrow - Re-anchored to prevent box collision */}
            <path d="M 160 85 Q 145 85 145 55" fill="none" stroke="#38bdf8" strokeWidth="2" />
            <polygon points="145,50 141,58 149,58" fill="#38bdf8" />
            <text x="145" y="95" fill="#38bdf8" fontSize="7" textAnchor="middle" className="font-bold">ATTIC INTAKE</text>

            {/* Labels & Dimensions (Left Side) */}
            <path d="M 100 110 L 130 110" fill="none" stroke="#fcd34d" strokeWidth="1" strokeDasharray="2,2" />
            <text x="135" y="108" fill="#fcd34d" fontSize="6" textAnchor="start" className="font-bold">10mm RAIN SCREEN</text>
            <text x="135" y="116" fill="#fcd34d" fontSize="6" textAnchor="start" className="font-bold">(CAPILLARY BREAK)</text>

            {/* Fixed Weather Barrier Text (Moved inside wall space to avoid clipping edge) */}
            <path d="M 87 150 L 50 150" fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="2,2" />
            <rect x="5" y="138" width="44" height="24" fill="#0f172a" fillOpacity="0.8" rx="2" /> 
            <text x="27" y="148" fill="#38bdf8" fontSize="6" textAnchor="middle" className="font-bold">WEATHER</text>
            <text x="27" y="156" fill="#38bdf8" fontSize="6" textAnchor="middle" className="font-bold">BARRIER</text>

            {/* Ground Clearance Dimension */}
            <line x1="110" y1="208" x2="110" y2="265" stroke="#a3e635" strokeWidth="1" strokeDasharray="2,2" />
            <line x1="107" y1="208" x2="113" y2="208" stroke="#a3e635" strokeWidth="1" />
            <line x1="107" y1="265" x2="113" y2="265" stroke="#a3e635" strokeWidth="1" />
            <text x="117" y="240" fill="#a3e635" fontSize="8" textAnchor="start" className="font-bold">MIN 200mm / 8"</text>
            <text x="117" y="250" fill="#a3e635" fontSize="8" textAnchor="start" className="font-bold">CLEARANCE</text>


            {/* RIGHT SIDE: PRO-TIP MAGNIFICATION BOX */}
            
            <rect x="200" y="20" width="185" height="260" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" rx="6" />
            
            {/* Box Header */}
            <rect x="200" y="20" width="185" height="25" fill="#3b82f6" rx="6" />
            <rect x="200" y="35" width="185" height="10" fill="#3b82f6" /> 
            <text x="292" y="36" fill="#ffffff" fontSize="10" textAnchor="middle" className="font-bold tracking-widest">PRO-TIP: VINYL FASTENING</text>

            {/* Macro View Structure */}
            <rect x="215" y="70" width="30" height="190" fill="#b45309" /> {/* Stud */}
            <rect x="245" y="70" width="15" height="190" fill="#d97706" /> {/* Sheathing */}
            <line x1="262" y1="70" x2="262" y2="260" stroke="#38bdf8" strokeWidth="2" /> {/* Tyvek */}
            
            {/* Vinyl Nailing Flange */}
            <rect x="280" y="90" width="12" height="150" fill="#cbd5e1" />
            
            {/* The Siding Nailing Slot (Cutaway) */}
            <rect x="280" y="140" width="12" height="40" fill="#1e293b" /> 
            
            {/* FIXED Fastener (Roofing Nail geometry corrected) */}
            <rect x="240" y="158" width="55" height="4" fill="#94a3b8" /> {/* Nail Shaft */}
            <polygon points="240,156 230,160 240,164" fill="#94a3b8" /> {/* Nail point (Facing Left) */}
            <rect x="295" y="148" width="6" height="24" fill="#f8fafc" rx="1" /> {/* Nail Head */}
            
            {/* The Crucial Expansion Gap Indicator */}
            <rect x="292" y="130" width="3" height="60" fill="#ef4444" /> {/* The visual gap */}
            
            {/* Gap Callout */}
            <path d="M 293 125 L 293 90 L 320 90" fill="none" stroke="#ef4444" strokeWidth="1.5" />
            <text x="325" y="88" fill="#ef4444" fontSize="10" textAnchor="start" className="font-bold">1/16" GAP</text>
            <text x="325" y="98" fill="#ef4444" fontSize="7" textAnchor="start" className="font-bold">(THICKNESS OF A DIME)</text>
            
            <text x="292" y="210" fill="#fcd34d" fontSize="9" textAnchor="middle" className="font-bold tracking-wider">DO NOT NAIL TIGHT!</text>
            <text x="292" y="225" fill="#94a3b8" fontSize="8" textAnchor="middle" className="font-bold">ALLOWS VINYL TO EXPAND</text>
            <text x="292" y="235" fill="#94a3b8" fontSize="8" textAnchor="middle" className="font-bold">AND CONTRACT IN THE HEAT</text>

          </svg>
        </div>
      )


    case 'concrete_slabs':
      return (
        <div className="border border-slate-200 dark:border-slate-800 bg-slate-900 rounded-xl overflow-hidden shadow-inner p-1">
          <svg viewBox="-80 20 900 240" className="w-full h-full drop-shadow-md bg-slate-900 rounded-xl p-2 font-sans select-none">
            {/* Undisturbed Soil */}
            <rect x="200" y="200" width="300" height="40" fill="#1e293b" />
            
            {/* Gravel */}
            <rect x="200" y="150" width="300" height="50" fill="#475569" />

            {/* Poly Line */}
            <line x1="200" y1="150" x2="500" y2="150" stroke="#38bdf8" strokeWidth="4" />

            {/* Concrete Slab */}
            <path d="M 200 150 L 500 150 L 500 70 L 360 70 L 350 90 L 340 70 L 200 70 Z" fill="#94a3b8" />

            {/* Wire Mesh */}
            <line x1="210" y1="100" x2="490" y2="100" stroke="#fbbf24" strokeWidth="3" strokeDasharray="8" />

            {/* Callouts (Left) */}
            <line x1="350" y1="80" x2="280" y2="40" stroke="#f8fafc" strokeWidth="1" />
            <text x="270" y="40" fontSize="16" textAnchor="end" dominantBaseline="middle" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold">CONTROL JOINT (CUT 1/4 SLAB DEPTH)</text>

            <line x1="200" y1="100" x2="150" y2="100" stroke="#f8fafc" strokeWidth="1" />
            <text x="140" y="100" fontSize="16" textAnchor="end" dominantBaseline="middle" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold">WELDED WIRE MESH (WWM) ON CHAIRS</text>

            {/* Callouts (Right) */}
            <line x1="500" y1="110" x2="550" y2="110" stroke="#f8fafc" strokeWidth="1" />
            <text x="560" y="110" fontSize="16" textAnchor="start" dominantBaseline="middle" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold">MIN 75mm (3") CONCRETE THICKNESS</text>

            <line x1="500" y1="150" x2="550" y2="150" stroke="#f8fafc" strokeWidth="1" />
            <text x="560" y="150" fontSize="16" textAnchor="start" dominantBaseline="middle" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold">6-MIL POLY VAPOUR BARRIER</text>

            <line x1="500" y1="175" x2="550" y2="175" stroke="#f8fafc" strokeWidth="1" />
            <text x="560" y="175" fontSize="16" textAnchor="start" dominantBaseline="middle" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold">COMPACTED GRANULAR FILL (GRAVEL)</text>
          </svg>
        </div>
      )

    case 'masonry_parging':
      return (
        <div className="border border-slate-200 dark:border-slate-800 bg-slate-900 rounded-xl overflow-hidden shadow-inner p-1">
          <svg viewBox="0 0 400 300" className="w-full h-full drop-shadow-md bg-slate-900 rounded-xl p-2 font-sans select-none">
            {gridBackground}
            
            {/* Concrete Footing */}
            <rect x="50" y="250" width="260" height="40" fill="#475569" rx="2" />
            <text x="180" y="275" fill="#94a3b8" fontSize="12" textAnchor="middle" className="font-bold tracking-widest drop-shadow-md">CONCRETE FOOTING</text>
            
            {/* CMU Blocks (stacked) */}
            <rect x="120" y="50" width="100" height="50" fill="#64748b" stroke="#334155" strokeWidth="2" />
            <rect x="120" y="100" width="100" height="50" fill="#64748b" stroke="#334155" strokeWidth="2" />
            <rect x="120" y="150" width="100" height="50" fill="#64748b" stroke="#334155" strokeWidth="2" />
            <rect x="120" y="200" width="100" height="50" fill="#64748b" stroke="#334155" strokeWidth="2" />
            
            {/* Mortar Joints */}
            <line x1="120" y1="100" x2="220" y2="100" stroke="#94a3b8" strokeWidth="3" />
            <line x1="120" y1="150" x2="220" y2="150" stroke="#94a3b8" strokeWidth="3" />
            <line x1="120" y1="200" x2="220" y2="200" stroke="#94a3b8" strokeWidth="3" />
            
            <text x="170" y="125" fill="#f8fafc" fontSize="12" textAnchor="middle" className="font-bold drop-shadow-md">CMU</text>
            <text x="170" y="175" fill="#f8fafc" fontSize="12" textAnchor="middle" className="font-bold drop-shadow-md">CMU</text>
            <text x="170" y="225" fill="#f8fafc" fontSize="12" textAnchor="middle" className="font-bold drop-shadow-md">CMU</text>
            
            {/* Cutaway core filled with grout */}
            <path d="M 140 50 L 200 50 L 200 130 L 140 130 Z" fill="#475569" stroke="#334155" strokeWidth="1" />
            <text x="170" y="85" fill="#cbd5e1" fontSize="9" textAnchor="middle" className="font-bold">15 MPa</text>
            <text x="135" y="95" fill="#cbd5e1" stroke="#0f172a" strokeWidth="3" paintOrder="stroke fill" fontSize="9" textAnchor="middle" className="font-bold">GROUT</text>
            
            {/* Rebar inside core */}
            <line x1="170" y1="30" x2="170" y2="130" stroke="#fbbf24" strokeWidth="4" strokeLinecap="round" />
            <line x1="180" y1="40" x2="170" y2="60" stroke="#fbbf24" strokeWidth="1" />
            <text x="245" y="45" fill="#fbbf24" stroke="#0f172a" strokeWidth="3" paintOrder="stroke fill" fontSize="10" textAnchor="middle" className="font-bold">#4 OR #5 REBAR</text>
            
            {/* Finished Ground Line */}
            <line x1="20" y1="120" x2="114" y2="120" stroke="#10b981" strokeWidth="2" strokeDasharray="5" />
            <text x="65" y="115" fill="#10b981" fontSize="10" textAnchor="middle" className="font-bold">GRADE LINE</text>
            
            {/* 6mm Portland Parging (Left Side) */}
            <path d="M 120 120 L 114 130 L 114 240 Q 114 250 130 250 L 120 250 Z" fill="#94a3b8" />
            
            {/* Bituminous Damp-proofing (Outer Layer) */}
            <path d="M 114 130 L 110 135 L 110 240 Q 110 254 130 254" fill="none" stroke="#1e293b" strokeWidth="3" />
            
            {/* Calls out for Parging and Damp-proofing */}
            <line x1="50" y1="170" x2="114" y2="170" stroke="#94a3b8" strokeWidth="1" />
            <text x="50" y="165" fill="#cbd5e1" fontSize="9" textAnchor="middle" className="font-bold">6mm PARGING</text>
            
            <line x1="50" y1="210" x2="110" y2="210" stroke="#1e293b" strokeWidth="1" />
            <text x="50" y="205" fill="#94a3b8" fontSize="9" textAnchor="middle" className="font-bold">BITUMINOUS</text>
            <text x="50" y="217" fill="#94a3b8" fontSize="9" textAnchor="middle" className="font-bold">DAMP-PROOFING</text>
            
            {/* Red Warning Callout */}
            <rect x="235" y="150" width="145" height="40" fill="#ef4444" rx="4" />
            <text x="307" y="165" fill="#ffffff" fontSize="9" textAnchor="middle" className="font-bold">PRO-TIP: PARGING IS</text>
            <text x="307" y="177" fill="#ffffff" fontSize="9" textAnchor="middle" className="font-bold">DAMP-PROOFING,</text>
            <text x="307" y="189" fill="#ffffff" fontSize="9" textAnchor="middle" className="font-bold">NOT WATERPROOFING</text>
            
            {/* Warning line pointer */}
            <line x1="235" y1="170" x2="114" y2="170" stroke="#ef4444" strokeWidth="2" strokeDasharray="3" />
            
            {/* Beveled edge callout */}
            <line x1="160" y1="90" x2="117" y2="125" stroke="#fcd34d" strokeWidth="1" />
            <text x="175" y="85" fill="#fcd34d" stroke="#0f172a" strokeWidth="3" paintOrder="stroke fill" fontSize="9" textAnchor="start" className="font-bold">BEVELED TOP EDGE</text>
            
            {/* Cove callout */}
            <line x1="160" y1="275" x2="124" y2="248" stroke="#fcd34d" strokeWidth="1" />
            <text x="165" y="280" fill="#fcd34d" fontSize="9" textAnchor="start" className="font-bold">PARGING COVE</text>

          </svg>
        </div>
      )

    case 'site_prep_retaining_walls':
      return (
        <div className="border border-slate-200 dark:border-slate-800 bg-slate-900 rounded-xl overflow-hidden shadow-inner p-1">
          <svg viewBox="0 0 400 300" className="w-full h-full drop-shadow-md bg-slate-900 rounded-xl p-2 font-sans select-none">
            {gridBackground}
            
            {/* Undisturbed Earth/Excavation */}
            <path d="M 230 40 L 380 40 L 380 270 L 100 270 L 100 250 L 230 250 Z" fill="#334155" />
            <text x="305" y="150" fill="#94a3b8" fontSize="14" textAnchor="middle" className="font-bold tracking-widest drop-shadow-md">UNDISTURBED</text>
            <text x="305" y="165" fill="#94a3b8" fontSize="14" textAnchor="middle" className="font-bold tracking-widest drop-shadow-md">SOIL</text>

            {/* Clear Stone Drainage Layer */}
            <path d="M 170 40 L 230 40 L 230 250 L 140 250 Z" fill="#64748b" fillOpacity="0.5" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4" />
            
            {/* Filter Fabric Label */}
            <line x1="230" y1="90" x2="260" y2="75" stroke="#fcd34d" strokeWidth="1" />
            <text x="265" y="75" fill="#fcd34d" fontSize="9" textAnchor="start" className="font-bold">FILTER FABRIC</text>
            <text x="265" y="85" fill="#fcd34d" fontSize="8" textAnchor="start" className="font-bold">(DASHED LINE)</text>

            {/* Stone Layer Label */}
            <line x1="190" y1="120" x2="260" y2="120" stroke="#cbd5e1" strokeWidth="1" />
            <text x="265" y="117" fill="#cbd5e1" fontSize="9" textAnchor="start" className="font-bold">12-18 INCHES CLEAN</text>
            <text x="265" y="127" fill="#cbd5e1" fontSize="9" textAnchor="start" className="font-bold">3/4" CLEAR STONE</text>

            {/* Weeping Tile */}
            <circle cx="180" cy="235" r="12" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" strokeDasharray="2" />
            <text x="180" y="238" fill="#38bdf8" fontSize="12" textAnchor="middle">O</text>
            <line x1="192" y1="235" x2="260" y2="235" stroke="#38bdf8" strokeWidth="1" />
            <text x="265" y="233" fill="#38bdf8" fontSize="9" textAnchor="start" className="font-bold">PERFORATED DRAINAGE PIPE</text>
            <text x="265" y="243" fill="#38bdf8" fontSize="9" textAnchor="start" className="font-bold">(WEEPING TILE)</text>

            {/* Timber Wall - Stacked & Battered (Stepped Back) */}
            <rect x="110" y="220" width="30" height="30" fill="#b45309" stroke="#78350f" strokeWidth="2" />
            <rect x="115" y="190" width="30" height="30" fill="#b45309" stroke="#78350f" strokeWidth="2" />
            <rect x="120" y="160" width="30" height="30" fill="#b45309" stroke="#78350f" strokeWidth="2" />
            
            {/* Deadman Anchor (Crosses into stone/earth) */}
            <rect x="125" y="130" width="120" height="30" fill="#d97706" stroke="#78350f" strokeWidth="2" />
            <text x="195" y="150" fill="#fef3c7" fontSize="10" textAnchor="middle" className="font-bold drop-shadow-md">DEADMAN ANCHOR</text>

            <rect x="130" y="100" width="30" height="30" fill="#b45309" stroke="#78350f" strokeWidth="2" />
            <rect x="135" y="70" width="30" height="30" fill="#b45309" stroke="#78350f" strokeWidth="2" />
            <rect x="140" y="40" width="30" height="30" fill="#b45309" stroke="#78350f" strokeWidth="2" />
            
            <text x="90" y="110" fill="#f8fafc" fontSize="12" textAnchor="middle" className="font-bold tracking-widest drop-shadow-md" transform="rotate(-90 90 110)">6x6 TIMBERS</text>
            
            {/* Battering indication */}
            <line x1="110" y1="220" x2="140" y2="40" stroke="#f43f5e" strokeWidth="1" strokeDasharray="3" />
            <text x="120" y="30" fill="#f43f5e" fontSize="9" textAnchor="start" className="font-bold">BATTERED (STEPPED BACK)</text>

            {/* Red Warning Callout */}
            <rect x="20" y="145" width="90" height="65" fill="#ef4444" rx="4" />
            <text x="65" y="160" fill="#ffffff" fontSize="8" textAnchor="middle" className="font-bold">PRO-TIP: RELIEVE</text>
            <text x="65" y="170" fill="#ffffff" fontSize="8" textAnchor="middle" className="font-bold">HYDROSTATIC</text>
            <text x="65" y="180" fill="#ffffff" fontSize="8" textAnchor="middle" className="font-bold">PRESSURE! WATER</text>
            <text x="65" y="190" fill="#ffffff" fontSize="8" textAnchor="middle" className="font-bold">IS THE ULTIMATE</text>
            <text x="65" y="200" fill="#ffffff" fontSize="8" textAnchor="middle" className="font-bold">WALL KILLER.</text>

            <line x1="110" y1="175" x2="185" y2="175" stroke="#ef4444" strokeWidth="2" />
            <polygon points="182,172 190,175 182,178" fill="#ef4444" />
            
            {/* Grade Line (Left side - Lower Earth) */}
            <path d="M 20 250 L 110 250 L 110 270 L 20 270 Z" fill="#334155" />
            <line x1="20" y1="250" x2="110" y2="250" stroke="#10b981" strokeWidth="2" strokeDasharray="5" />
            <text x="65" y="245" fill="#10b981" fontSize="10" textAnchor="middle" className="font-bold">LOWER GRADE</text>

            {/* Grade Line (Right side - Upper Earth) */}
            <line x1="230" y1="40" x2="380" y2="40" stroke="#10b981" strokeWidth="2" strokeDasharray="5" />
            <text x="305" y="35" fill="#10b981" fontSize="10" textAnchor="middle" className="font-bold">UPPER GRADE</text>
            
          </svg>
        </div>
      )


    case 'structural_renovations':
      return (
        <div className="border border-slate-200 dark:border-slate-800 bg-slate-900 rounded-xl overflow-hidden shadow-inner p-1">
          <svg viewBox="0 0 400 300" className="w-full h-full drop-shadow-md bg-slate-900 rounded-xl p-2 font-sans select-none">
            {gridBackground}
            
            {/* Jack Studs (Beyond) */}
            <rect x="180" y="150" width="40" height="130" fill="none" stroke="#d97706" strokeWidth="2" strokeDasharray="4" />
            <line x1="165" y1="215" x2="180" y2="215" stroke="#d97706" strokeWidth="1" />
            <text x="160" y="210" fill="#fcd34d" fontSize="9" textAnchor="end" dominantBaseline="middle" className="font-bold">JACK STUDS</text>
            <text x="160" y="220" fill="#fcd34d" fontSize="9" textAnchor="end" dominantBaseline="middle" className="font-bold">(BEYOND)</text>

            {/* Left Temporary Shoring */}
            <rect x="50" y="130" width="60" height="15" fill="#b45309" stroke="#78350f" strokeWidth="2" />
            <rect x="70" y="145" width="20" height="135" fill="#b45309" stroke="#78350f" strokeWidth="2" />
            <text x="45" y="212" fill="#f8fafc" stroke="#0f172a" strokeWidth="3" paintOrder="stroke fill" fontSize="9" textAnchor="middle" dominantBaseline="middle" transform="rotate(-90 45 212)" className="font-bold tracking-wider drop-shadow-md">TEMPORARY SHORING (2x4 / 2x6)</text>

            {/* Right Temporary Shoring */}
            <rect x="290" y="130" width="60" height="15" fill="#b45309" stroke="#78350f" strokeWidth="2" />
            <rect x="310" y="145" width="20" height="135" fill="#b45309" stroke="#78350f" strokeWidth="2" />
            <text x="355" y="212" fill="#f8fafc" stroke="#0f172a" strokeWidth="3" paintOrder="stroke fill" fontSize="9" textAnchor="middle" dominantBaseline="middle" transform="rotate(-90 355 212)" className="font-bold tracking-wider drop-shadow-md">TEMPORARY SHORING (2x4 / 2x6)</text>

            {/* Left Joist */}
            <rect x="10" y="60" width="165" height="70" fill="#64748b" stroke="#334155" strokeWidth="2" />
            <text x="90" y="95" fill="#f8fafc" fontSize="12" textAnchor="middle" dominantBaseline="middle" className="font-bold tracking-widest drop-shadow-md">CEILING JOIST</text>

            {/* Right Joist */}
            <rect x="225" y="60" width="165" height="70" fill="#64748b" stroke="#334155" strokeWidth="2" />
            <text x="305" y="95" fill="#f8fafc" fontSize="12" textAnchor="middle" dominantBaseline="middle" className="font-bold tracking-widest drop-shadow-md">CEILING JOIST</text>

            {/* Built-Up LVL Beam */}
            <rect x="175" y="55" width="50" height="95" fill="#d97706" stroke="#78350f" strokeWidth="2" />
            {/* Plies */}
            <line x1="191" y1="55" x2="191" y2="150" stroke="#78350f" strokeWidth="1.5" />
            <line x1="208" y1="55" x2="208" y2="150" stroke="#78350f" strokeWidth="1.5" />
            <text x="200" y="102" fill="#fef3c7" fontSize="10" textAnchor="middle" dominantBaseline="middle" transform="rotate(-90 200 102)" className="font-bold tracking-widest drop-shadow-md">BUILT-UP LVL</text>

            {/* Joist Hangers (Metal) */}
            <path d="M 175 70 L 160 70 L 160 130 L 175 130" fill="none" stroke="#94a3b8" strokeWidth="4" />
            <circle cx="168" cy="85" r="2" fill="#1e293b" />
            <circle cx="168" cy="100" r="2" fill="#1e293b" />
            <circle cx="168" cy="115" r="2" fill="#1e293b" />
            <text x="145" y="52" fill="#94a3b8" fontSize="9" textAnchor="end" dominantBaseline="middle" className="font-bold">JOIST HANGER</text>
            <line x1="150" y1="48" x2="165" y2="68" stroke="#94a3b8" strokeWidth="1" />

            <path d="M 225 70 L 240 70 L 240 130 L 225 130" fill="none" stroke="#94a3b8" strokeWidth="4" />
            <circle cx="232" cy="85" r="2" fill="#1e293b" />
            <circle cx="232" cy="100" r="2" fill="#1e293b" />
            <circle cx="232" cy="115" r="2" fill="#1e293b" />
            <text x="255" y="52" fill="#94a3b8" fontSize="9" textAnchor="start" dominantBaseline="middle" className="font-bold">JOIST HANGER</text>
            <line x1="250" y1="48" x2="235" y2="68" stroke="#94a3b8" strokeWidth="1" />

            {/* Point Load Transfer Callout */}
            <line x1="220" y1="180" x2="160" y2="180" stroke="#d97706" strokeWidth="1" />
            <text x="155" y="177" fill="#fcd34d" stroke="#0f172a" strokeWidth="3" paintOrder="stroke fill" fontSize="9" textAnchor="end" dominantBaseline="middle" className="font-bold">POINT LOAD TRANSFER</text>
            <text x="155" y="187" fill="#fcd34d" stroke="#0f172a" strokeWidth="3" paintOrder="stroke fill" fontSize="8" textAnchor="end" dominantBaseline="middle" className="font-bold">DOWN TO FOUNDATION</text>

            {/* Red Warning/Pro-Tip Callout */}
            <rect x="40" y="5" width="320" height="40" fill="#ef4444" rx="4" />
            <text x="200" y="19" fill="#ffffff" fontSize="9" textAnchor="middle" dominantBaseline="middle" className="font-bold">PRO-TIP: JACK BEAM 1/8" TO 1/4" HIGHER THAN LEVEL</text>
            <text x="200" y="31" fill="#ffffff" fontSize="9" textAnchor="middle" dominantBaseline="middle" className="font-bold">BEFORE NAILING HANGERS TO PRE-CAMBER FOR SETTLING.</text>
            
            {/* Callout Pointer Line to LVL */}
            <line x1="200" y1="45" x2="200" y2="55" stroke="#ef4444" strokeWidth="2" />
            <polygon points="197,52 200,55 203,52" fill="#ef4444" />
            
          </svg>
        </div>
      )

    default:
      return (
        <div className="border border-slate-200 dark:border-slate-800 bg-slate-900 rounded-xl overflow-hidden shadow-inner p-4 text-center text-slate-500">
          <p className="text-xs font-semibold">Blueprint visual diagram not available for this custom ID.</p>
        </div>
      )
  }
}

// Word-level highlight sub-component for search matches
function Highlight({ text, search }) {
  if (!text) return null
  if (!search || !search.trim()) return <span>{text}</span>
  
  const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escaped})`, 'gi')
  const parts = text.split(regex)
  
  return (
    <span>
      {parts.map((part, i) => 
        regex.test(part) ? (
          <mark 
            key={i} 
            className="bg-amber-300 dark:bg-amber-500/40 text-slate-950 dark:text-amber-100 rounded px-0.5 font-bold border-b border-amber-400/50"
          >
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </span>
  )
}

// Highly requested interactive image-viewer component for Blueprint Reading
function BlueprintReadingViewer() {
  const [activeSheet, setActiveSheet] = useState('floor') // 'floor' or 'section'
  const [zoom, setZoom] = useState(100)
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })
  const [selectedHotspot, setSelectedHotspot] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Hotspot definitions for each sheet with preset zoom/pan coordinates
  const hotspots = {
    floor: [
      {
        id: 'title-block',
        label: 'Title Block & Revision',
        symbol: 'Title Block',
        desc: 'Located in the bottom-right corner. Displays sheet name, number, scale, and the crucial revision date. Check the revision history to guarantee you are working off the latest "Issued for Construction" drawing.',
        examTip: 'Red Seal exams frequently test where to find the drawing scale and which document has legal priority when dimensions conflict (written numbers ALWAYS override scaled measurements).',
        x: 320, y: 170, // center coordinates of the SVG (relative to 400x220)
        panX: -110, panY: -55,
        zoom: 170
      },
      {
        id: 'section-mark',
        label: 'Section Cut Mark',
        symbol: 'Section Symbol',
        desc: 'A split circle with a directional arrow. The arrow indicates the direction of view. The top number is the detail number, and the bottom number is the page where the cross-section drawing is located.',
        examTip: 'You must cross-reference section marks to understand heights. It reveals the exact layout of internal stair stringers, dropped headers, and foundation footing overlaps.',
        x: 200, y: 110,
        panX: 0, panY: 0,
        zoom: 180
      },
      {
        id: 'dropped-header',
        label: 'Dropped Header (Hidden Line)',
        symbol: 'Dashed Line',
        desc: 'A dashed line on a floor plan represents a structural element located above the cut plane, such as a dropped carrying beam, flush lintel, or attic access opening.',
        examTip: 'Dashed lines always signify "hidden or above/below" objects. A solid line means the object is directly visible on that plane.',
        x: 200, y: 55,
        panX: 0, panY: 45,
        zoom: 190
      },
      {
        id: 'grid-lines',
        label: 'Structural Grid Lines',
        symbol: 'A-B / 1-2',
        desc: 'Grid lines intersect precisely at column, telepost, or primary load-bearing wall centers. They allow architects and framers to locate point-loads and layout dimensions identically across multiple pages.',
        examTip: 'Point loads from roof trusses must trace continuously down through studs, beams, and columns to the concrete footings below.',
        x: 80, y: 110,
        panX: 110, panY: 0,
        zoom: 170
      }
    ],
    section: [
      {
        id: 'cut-plane',
        label: 'Solid Cut Plane Lines',
        symbol: 'Bold Solid Line',
        desc: 'Heavy, solid black lines representing materials directly sliced through by the sectional cut. This outlines concrete foundation walls, subfloor joists, or top plates.',
        examTip: 'Standard drawings use different hatching patterns (such as triangle/dots for concrete, cross-hatching for dimensional lumber) to denote material types in cross-sections.',
        x: 160, y: 110,
        panX: 40, panY: 0,
        zoom: 180
      },
      {
        id: 'center-line',
        label: 'Centerline Indicator',
        symbol: 'Long-Short Dash',
        desc: 'Alternating long and short dashes indicating a line of perfect symmetry. Typically used for centering structural columns, window openings, or the peak/ridge of a roof system.',
        examTip: 'Exams test reading centerlines to compute symmetrical spacing and checking whether dimensions are calculated from face-of-stud or center-of-stud.',
        x: 280, y: 80,
        panX: -80, panY: 30,
        zoom: 170
      },
      {
        id: 'elevation-datum',
        label: 'Elevation Benchmark (BM)',
        symbol: 'Circle w/ Crosshair',
        desc: 'A master elevation mark on elevations or section pages. Establishes the height of finished floors, top-of-plate, and foundation grade relative to a stable jobsite benchmark.',
        examTip: 'Always calculate vertical stair rise and window rough openings from the true subfloor elevation, taking the thickness of finish flooring into consideration.',
        x: 320, y: 150,
        panX: -110, panY: -35,
        zoom: 180
      }
    ]
  }

  const activeHotspots = hotspots[activeSheet]

  const handleSelectHotspot = (hs) => {
    if (selectedHotspot?.id === hs.id) {
      setSelectedHotspot(null)
      setZoom(100)
      setPanOffset({ x: 0, y: 0 })
    } else {
      setSelectedHotspot(hs)
      setZoom(hs.zoom)
      setPanOffset({ x: hs.panX, y: hs.panY })
    }
  }

  const handleReset = () => {
    setSelectedHotspot(null)
    setZoom(100)
    setPanOffset({ x: 0, y: 0 })
  }

  const handleZoomIn = () => {
    setSelectedHotspot(null)
    setZoom(prev => Math.min(prev + 20, 240))
  }

  const handleZoomOut = () => {
    setSelectedHotspot(null)
    setZoom(prev => Math.max(prev - 20, 80))
  }

  // Filter symbols based on search
  const filteredHotspots = activeHotspots.filter(hs => 
    searchTerm === '' ||
    hs.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hs.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hs.desc.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex flex-col space-y-4 bg-slate-950 p-4 rounded-xl border border-slate-800 text-white font-sans overflow-hidden">
      
      {/* SHEET TOGGLES & SEARCH */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800/80 self-start">
          <button
            type="button"
            onClick={() => { setActiveSheet('floor'); handleReset(); }}
            className={`px-2.5 py-1 rounded text-[11px] font-black uppercase tracking-wider transition-all ${
              activeSheet === 'floor' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Floor Plan
          </button>
          <button
            type="button"
            onClick={() => { setActiveSheet('section'); handleReset(); }}
            className={`px-2.5 py-1 rounded text-[11px] font-black uppercase tracking-wider transition-all ${
              activeSheet === 'section' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Cross-Section
          </button>
        </div>

        {/* Search symbols */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search symbols..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-48 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 pl-7 text-[11px] font-bold text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <span className="absolute left-2 top-2 text-slate-500 text-xs">
            🔎
          </span>
          {searchTerm && (
            <button 
              type="button"
              onClick={() => setSearchTerm('')} 
              className="absolute right-2 top-2 text-slate-400 hover:text-white text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* CORE BLUEPRINT WORKSPACE */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        
        {/* INTERACTIVE ZOOMABLE WINDOW */}
        <div className="md:col-span-7 flex flex-col space-y-2">
          
          {/* Controls Bar */}
          <div className="flex items-center justify-between bg-slate-900 px-3 py-2 rounded-lg border border-slate-800">
            <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
              <span>Tap target markers to zoom</span>
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleZoomOut}
                className="w-6 h-6 flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-white rounded border border-slate-700 hover:border-slate-600 transition-all text-xs font-black"
                title="Zoom Out"
              >
                －
              </button>
              <span className="text-[9px] font-mono font-bold bg-slate-950 px-1.5 py-0.5 rounded text-slate-300">
                {zoom}%
              </span>
              <button
                type="button"
                onClick={handleZoomIn}
                className="w-6 h-6 flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-white rounded border border-slate-700 hover:border-slate-600 transition-all text-xs font-black"
                title="Zoom In"
              >
                ＋
              </button>
              {(zoom !== 100 || panOffset.x !== 0 || panOffset.y !== 0) && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-1.5 py-0.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-[8px] font-black uppercase tracking-wider transition-all"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Interactive Canvas */}
          <div className="relative aspect-[1.7] bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex items-center justify-center">
            
            <div
              style={{
                width: '100%',
                height: '100%',
                transform: `scale(${zoom / 100}) translate(${panOffset.x}px, ${panOffset.y}px)`,
                transformOrigin: 'center center',
                transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              className="relative flex items-center justify-center"
            >
              {/* Background grid */}
              <div className="absolute inset-0 bg-slate-900/40" style={{
                backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
                backgroundSize: '16px 16px'
              }} />

              {/* SHEET 1: FLOOR PLAN SVG */}
              {activeSheet === 'floor' && (
                <svg viewBox="0 0 400 220" width="100%" height="100%" className="select-none p-3 relative z-10">
                  <defs>
                    <pattern id="grid_dots_bp" width="20" height="20" patternUnits="userSpaceOnUse">
                      <circle cx="1" cy="1" r="0.5" fill="rgba(255,255,255,0.08)" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid_dots_bp)" />

                  <rect x="15" y="15" width="370" height="190" fill="none" stroke="#1e3a8a" strokeWidth="1" strokeDasharray="3 3" />

                  {/* Grid Lines */}
                  <line x1="80" y1="20" x2="80" y2="200" stroke="rgba(56,189,248,0.25)" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="200" y1="20" x2="200" y2="200" stroke="rgba(56,189,248,0.25)" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="320" y1="20" x2="320" y2="200" stroke="rgba(56,189,248,0.25)" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="20" y1="55" x2="380" y2="55" stroke="rgba(56,189,248,0.25)" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="20" y1="110" x2="380" y2="110" stroke="rgba(56,189,248,0.25)" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="20" y1="165" x2="380" y2="165" stroke="rgba(56,189,248,0.25)" strokeWidth="1" strokeDasharray="4 4" />

                  {/* Grid line tags */}
                  <circle cx="80" cy="20" r="7" fill="#1e293b" stroke="#38bdf8" strokeWidth="1" />
                  <text x="80" y="23" textAnchor="middle" fill="#38bdf8" fontSize="8" fontWeight="black">A</text>
                  <circle cx="200" cy="20" r="7" fill="#1e293b" stroke="#38bdf8" strokeWidth="1" />
                  <text x="200" y="23" textAnchor="middle" fill="#38bdf8" fontSize="8" fontWeight="black">B</text>
                  
                  <circle cx="20" cy="110" r="7" fill="#1e293b" stroke="#38bdf8" strokeWidth="1" />
                  <text x="20" y="113" textAnchor="middle" fill="#38bdf8" fontSize="8" fontWeight="black">1</text>
                  <circle cx="20" cy="165" r="7" fill="#1e293b" stroke="#38bdf8" strokeWidth="1" />
                  <text x="20" y="168" textAnchor="middle" fill="#38bdf8" fontSize="8" fontWeight="black">2</text>

                  {/* Concrete Wall Boundaries */}
                  <rect x="75" y="50" width="250" height="120" fill="none" stroke="#ffffff" strokeWidth="3" />
                  <rect x="78" y="53" width="244" height="114" fill="none" stroke="#1e40af" strokeWidth="1" />

                  {/* Dropped header */}
                  <line x1="80" y1="55" x2="320" y2="55" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3 3" />
                  <text x="200" y="47" textAnchor="middle" fill="#fbbf24" fontSize="7" fontWeight="bold">DROPPED BEAM HEADER</text>

                  {/* Floor Opening (Stairs) */}
                  <rect x="120" y="80" width="160" height="60" fill="rgba(30,58,138,0.2)" stroke="#ef4444" strokeWidth="1" />
                  <line x1="120" y1="80" x2="280" y2="140" stroke="#ef4444" strokeWidth="0.75" />
                  <line x1="280" y1="80" x2="120" y2="140" stroke="#ef4444" strokeWidth="0.75" />

                  {/* Section Cut Callout Symbol */}
                  <g transform="translate(200, 110)">
                    <circle cx="0" cy="0" r="10" fill="#1e293b" stroke="#10b981" strokeWidth="1.5" />
                    <line x1="-24" y1="0" x2="24" y2="0" stroke="#10b981" strokeWidth="1.5" />
                    <polygon points="-24,0 -18,-4 -18,4" fill="#10b981" />
                    <polygon points="24,0 18,-4 18,4" fill="#10b981" />
                    <text x="0" y="-12" textAnchor="middle" fill="#10b981" fontSize="7" fontWeight="black">S1</text>
                    <text x="0" y="3" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="black">01</text>
                    <text x="0" y="16" textAnchor="middle" fill="#10b981" fontSize="6" fontWeight="bold">S-302</text>
                  </g>

                  {/* Title Block on Bottom/Right */}
                  <g transform="translate(270, 160)" stroke="#38bdf8" strokeWidth="0.5">
                    <rect width="110" height="42" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" opacity="0.9" />
                    <line x1="0" y1="13" x2="110" y2="13" />
                    <line x1="0" y1="26" x2="110" y2="26" />
                    <line x1="55" y1="26" x2="55" y2="42" />
                    <text x="5" y="9" fill="#ffffff" fontSize="5" fontWeight="bold" stroke="none">RED SEAL CARPENTRY</text>
                    <text x="5" y="21" fill="#38bdf8" fontSize="6.5" fontWeight="black" stroke="none">SHEET A-101 (REV 2)</text>
                    <text x="5" y="36" fill="#ffffff" fontSize="5" fontWeight="bold" stroke="none">SCALE: 1/4" = 1'-0"</text>
                    <text x="60" y="36" fill="#10b981" fontSize="5.5" fontWeight="black" stroke="none">ISSUED FOR CONST.</text>
                  </g>
                </svg>
              )}

              {/* SHEET 2: SECTION VIEW SVG */}
              {activeSheet === 'section' && (
                <svg viewBox="0 0 400 220" width="100%" height="100%" className="select-none p-3 relative z-10">
                  <rect width="100%" height="100%" fill="url(#grid_dots_bp)" />

                  <rect x="15" y="15" width="370" height="190" fill="none" stroke="#1e3a8a" strokeWidth="1" strokeDasharray="3 3" />

                  {/* Ground Line */}
                  <line x1="20" y1="165" x2="380" y2="165" stroke="#94a3b8" strokeWidth="2.5" />
                  <text x="340" y="180" textAnchor="end" fill="#94a3b8" fontSize="7.5" fontWeight="black">GRADE LINE</text>

                  {/* Concrete wall in cross-section */}
                  <rect x="50" y="50" width="70" height="115" fill="none" stroke="#ffffff" strokeWidth="3" />
                  <rect x="52" y="52" width="66" height="111" fill="rgba(255,255,255,0.05)" />
                  <circle cx="65" cy="80" r="1.5" fill="#64748b" />
                  <circle cx="100" cy="110" r="1" fill="#64748b" />
                  <circle cx="80" cy="140" r="1.5" fill="#64748b" />
                  <polygon points="75,90 80,95 70,100" fill="none" stroke="#64748b" strokeWidth="0.5" />
                  <polygon points="90,120 95,125 85,130" fill="none" stroke="#64748b" strokeWidth="0.5" />
                  <text x="85" y="42" textAnchor="middle" fill="#ffffff" fontSize="8.5" fontWeight="black">FOUNDATION</text>

                  {/* Anchor bolt detailing */}
                  <path d="M 85 50 L 85 85 L 105 85" stroke="#38bdf8" strokeWidth="2" fill="none" />

                  {/* Symmetrical centerline indicator */}
                  <line x1="280" y1="20" x2="280" y2="200" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="14 3 3 3" />
                  <text x="288" y="32" fill="#f59e0b" fontSize="8" fontWeight="black">CL</text>

                  {/* Elevation Benchmark marker */}
                  <g transform="translate(320, 150)">
                    <circle cx="0" cy="0" r="8" fill="none" stroke="#ef4444" strokeWidth="1.5" />
                    <line x1="-12" y1="0" x2="12" y2="0" stroke="#ef4444" strokeWidth="1.5" />
                    <line x1="0" y1="-12" x2="0" y2="12" stroke="#ef4444" strokeWidth="1.5" />
                    <polygon points="0,0 8,-8 0,-8" fill="#ef4444" />
                    <polygon points="0,0 -8,8 0,8" fill="#ef4444" />
                    <text x="15" y="-3" fill="#ef4444" fontSize="7.5" fontWeight="black">BM ELEV</text>
                  </g>

                  {/* Framing studs */}
                  <rect x="180" y="80" width="10" height="85" fill="none" stroke="#ffffff" strokeWidth="1.5" />
                  <rect x="230" y="80" width="10" height="85" fill="none" stroke="#ffffff" strokeWidth="1.5" />
                </svg>
              )}

              {/* CLICKABLE CALLOUT HOTSPOTS OVERLAY */}
              {activeHotspots.map((hs) => {
                const isSelected = selectedHotspot?.id === hs.id
                return (
                  <button
                    key={hs.id}
                    type="button"
                    onClick={() => handleSelectHotspot(hs)}
                    style={{
                      left: `${(hs.x / 400) * 100}%`,
                      top: `${(hs.y / 220) * 100}%`,
                    }}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 z-30 flex items-center justify-center w-5.5 h-5.5 rounded-full text-xs transition-all duration-300 ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 scale-125 ring-2 ring-amber-300 shadow-lg'
                        : 'bg-blue-600 hover:bg-blue-500 text-white ring-1 ring-white hover:scale-110 shadow-md'
                    }`}
                  >
                    <span>🎯</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* DETAILS, DEFINITIONS & STUDY GUIDES */}
        <div className="md:col-span-5 flex flex-col space-y-3 justify-between">
          
          {/* SYMBOL INDEX / LIST SEARCH MATCHES */}
          <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex-1 flex flex-col justify-between">
            <div className="space-y-2">
              <h5 className="text-[9px] font-black uppercase text-slate-400 tracking-wider flex items-center justify-between">
                <span>Symbol Legend</span>
                <span className="text-blue-400 font-bold">{filteredHotspots.length} Matches</span>
              </h5>

              {/* List of hotspots */}
              <div className="space-y-1 max-h-[110px] overflow-y-auto pr-1">
                {filteredHotspots.map((hs) => {
                  const isSelected = selectedHotspot?.id === hs.id
                  return (
                    <button
                      key={hs.id}
                      type="button"
                      onClick={() => handleSelectHotspot(hs)}
                      className={`w-full text-left p-1.5 rounded transition-all text-[11px] flex items-center justify-between ${
                        isSelected
                          ? 'bg-blue-600/20 border border-blue-500/30 text-blue-300'
                          : 'bg-slate-950/60 border border-slate-900 hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <span className="truncate font-bold flex items-center gap-1">
                        <span className="text-amber-500 text-[10px]">🎯</span>
                        {hs.label}
                      </span>
                      <span className="text-[8px] font-mono bg-slate-900 px-1 py-0.5 rounded text-slate-400 font-bold shrink-0 ml-1">
                        {hs.symbol}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {!selectedHotspot && (
              <div className="p-2 bg-slate-950 rounded border border-slate-900 mt-2 text-center">
                <p className="text-[9px] font-bold text-slate-500">Tap a symbol to isolate, zoom-in, and review Red Seal Exam insights.</p>
              </div>
            )}
          </div>

          {/* ACTIVE HOTSPOT DETAILS PANEL */}
          {selectedHotspot && (
            <div className="bg-slate-900 p-3.5 rounded-xl border border-blue-500/30 space-y-2 animate-slideUp">
              <div className="flex justify-between items-start gap-1">
                <div>
                  <span className="text-[7.5px] bg-blue-500/20 text-blue-400 border border-blue-500/30 px-1.5 py-0.5 rounded font-black uppercase tracking-wider">
                    Callout Detail
                  </span>
                  <h5 className="text-[11px] font-black text-white mt-1 uppercase tracking-tight">
                    {selectedHotspot.label}
                  </h5>
                </div>
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-slate-500 hover:text-white transition-colors text-[9px] font-black uppercase"
                >
                  Clear
                </button>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] text-slate-300 leading-normal font-semibold">
                  {selectedHotspot.desc}
                </p>

                <div className="p-2 bg-rose-500/15 border border-rose-500/20 rounded text-rose-300 space-y-0.5">
                  <span className="text-[8px] font-black uppercase tracking-wider block">
                    Red Seal Exam Tip:
                  </span>
                  <p className="text-[9.5px] leading-relaxed font-semibold">
                    {selectedHotspot.examTip}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  )
}
