import React, { useState, useEffect, useContext, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { 
  Award, Calculator, 
  HelpCircle, 
  BookOpen, 
  Zap, 
  Compass, 
  Wrench, 
  Book, 
  FileText, 
  Trophy, 
  Sun, 
  Moon, 
  Ruler, 
  RotateCcw, 
  ArrowLeft, 
  Search, 
  Flame, 
  ChevronRight,
  ChevronDown, 
  Sparkles, 
  Layers, 
  Shield, 
  Check, 
  X,
  Hammer,
  BarChart3,
  Clock,
  Play,
  Menu,
  Star,
  Info
} from 'lucide-react'

import { AppContext } from '../../App'

// Import Sub-Components from Red Seal suite
import QuizEngine from './QuizEngine'
import NbcFlashcards from './NbcFlashcards'
import BlueprintViewer from './BlueprintViewer'
import TradeMathMenu from './TradeMathMenu'
import StructuralSpecifics from './StructuralSpecifics'
import CodeSearchOverlay from './CodeSearchOverlay'

import { getSrsStats } from '../../utils/srsStats'

export default function RedSealHub({ theme, initialView = 'structural', onNavigate = () => {} }) {
  // AppContext fallback for standalone usage
  const context = useContext(AppContext) || {}
  const { 
    userXP = 0, 
    loginStreak = 0,
    quizHistory = [],
    flashcardReviews = {}
  } = context

  // TODO: Swap localStorage for Capacitor Preferences for native Android storage
  useEffect(() => {
    try {
      const existingProfile = localStorage.getItem('red_seal_user_profile')
      if (!existingProfile) {
        const freshProfile = {
          userXP: 0,
          loginStreak: 0,
          quizHistory: [],
          flashcardReviews: {},
          createdAt: new Date().toISOString()
        }
        localStorage.setItem('red_seal_user_profile', JSON.stringify(freshProfile))
      }
    } catch (e) {
      console.error(e)
    }
  }, [])

  const srsStats = useMemo(() => getSrsStats(flashcardReviews), [flashcardReviews])

  // Local View State ('hub' | 'quiz' | 'study' | 'flashcards' | 'blueprints' | 'structural' | 'code' | 'glossary' | 'dashboard')
  const [activeView, setActiveView] = useState(initialView)
  const [activeModalInfo, setActiveModalInfo] = useState(null)
  const [isCodeOverlayOpen, setIsCodeOverlayOpen] = useState(false)
  const [codeOverlaySearchQuery, setCodeOverlaySearchQuery] = useState('')
  const [showRedSealIntro, setShowRedSealIntro] = useState(false)

  useEffect(() => {
    try {
      const hasSeen = localStorage.getItem('hasSeenRedSealIntro')
      if (!hasSeen) {
        setShowRedSealIntro(true)
      }
    } catch (e) {
      console.warn("Could not read localStorage for intro")
    }
  }, [])

  const closeRedSealIntro = () => {
    try {
      localStorage.setItem('hasSeenRedSealIntro', 'true')
    } catch (e) {
      console.warn("Could not save to localStorage for intro")
    }
    setShowRedSealIntro(false)
  }



  // Favorites state
  const [favoriteRedSealTools, setFavoriteRedSealTools] = useState(() => {
    try {
      const saved = localStorage.getItem('red_seal_favorites')
      return saved ? JSON.parse(saved) : []
    } catch (e) {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('red_seal_favorites', JSON.stringify(favoriteRedSealTools))
    } catch (e) {}
  }, [favoriteRedSealTools])

  const toggleFavorite = (e, id) => {
    e.stopPropagation()
    setFavoriteRedSealTools(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    )
  }


  // Modules List for Navigation
  const RED_SEAL_MODULE_OPTIONS = [
    { 
      id: 'structural', 
      name: 'Structural',
      modalTitle: 'Structural Specifics',
      icon: Wrench, 
      color: 'text-cyan-400', 
      definition: "Instructs the proper steps and sequences for each phase of a build. Features detailed instructional diagrams, NBC (National Building Code) tables, span charts, and essential code formulas from footings to framing.",
      exampleCase: "Select 'Floor Systems' to view the maximum allowable spans for solid sawn lumber joists and reference the diagram for proper blocking and bridging placement.",
      proTip: "Always cross-reference the base NBC tables with your local municipal amendments, as specific snow, wind, or seismic load requirements will dictate your final structural spacing and sizing."
    },
    { 
      id: 'cram', 
      name: 'Cram Mode', 
      modalTitle: 'Cram Mode',
      icon: Flame, 
      color: 'text-orange-500', 
      definition: "High-yield, rapid-fire facts with auto-revealed answers for last-minute memorization.",
      exampleCase: "Quickly swipe through key code facts right before the exam.",
      proTip: "Focus on facts you consistently miss to maximize short-term retention."
    },
    { 
      id: 'practice', 
      name: 'Mock Exam', 
      modalTitle: 'Exam Practice',
      icon: Award, 
      color: 'text-emerald-400', 
      definition: "Simulated exam conditions targeting specific blocks and tasks.",
      exampleCase: "Take a 20-question quiz focused strictly on stairs and roofing.",
      proTip: "Treat practice exams like the real thing—time yourself and avoid looking at notes."
    },
    { 
      id: 'flashcards', 
      name: 'Flashcards', 
      modalTitle: 'Flashcards',
      icon: Zap, 
      color: 'text-yellow-400', 
      definition: "Spaced-repetition memory decks for active recall of key codes and tools.",
      exampleCase: "Review a deck of tool identification cards.",
      proTip: "Consistent daily review is the key to making spaced repetition work."
    },
    { 
      id: 'blueprint', 
      name: 'Blueprints', 
      modalTitle: 'Blueprint Trainer',
      icon: Compass, 
      color: 'text-fuchsia-400', 
      definition: "Practice interpreting architectural plans, symbols, and specifications.",
      exampleCase: "Identify load-bearing walls and window rough openings on a residential floor plan.",
      proTip: "Always check the title block for scale and revision dates before interpreting any lines."
    },
    { 
      id: 'math', 
      name: 'Trade Math', 
      modalTitle: 'Trade Math & Estimating',
      icon: Calculator, 
      color: 'text-indigo-400', 
      definition: "Interactive formulas and calculators to master stair layouts, rafter lengths, concrete volume, and Board Foot Measure (BFM).",
      exampleCase: "Calculate the theoretical and exact stringer length for a set of stairs with a total rise of 105 inches.",
      proTip: "Always convert all measurements to a single unit (like decimal inches or millimeters) before running your final calculations to avoid rounding errors."
    }
  ]

  const currentModule = useMemo(() => {
    return RED_SEAL_MODULE_OPTIONS.find(m => m.id === activeView) || RED_SEAL_MODULE_OPTIONS[0]
  }, [activeView])


  // Local Unit Mode State ('imp' | 'met')
  const [unitMode, setUnitMode] = useState(() => {
    try {
      return localStorage.getItem('squared_unit_mode') || localStorage.getItem('builderHub_unitMode') || 'imp'
    } catch (e) {
      return 'imp'
    }
  })

  // Local Theme State ('light' | 'dark')
  const [themeMode, setThemeMode] = useState(() => {
    return theme || (typeof localStorage !== 'undefined' ? localStorage.getItem('squared_theme') : 'light') || 'light'
  })

  useEffect(() => {
    if (theme) setThemeMode(theme)
  }, [theme])

  // Last Active Task State from localStorage
  const [lastTask, setLastTask] = useState(() => {
    try {
      const saved = localStorage.getItem('lastActiveTask') || localStorage.getItem('builderHub_last_active_task')
      return saved ? JSON.parse(saved) : null
    } catch (e) {
      return null
    }
  })

  // Sync unit mode with localStorage & dispatch event
  const toggleUnitMode = () => {
    const nextUnit = unitMode === 'imp' ? 'met' : 'imp'
    setUnitMode(nextUnit)
    try {
      localStorage.setItem('squared_unit_mode', nextUnit)
      localStorage.setItem('builderHub_unitMode', nextUnit)
      window.dispatchEvent(new CustomEvent('unit_mode_changed', { detail: nextUnit }))
    } catch (e) {
      console.error(e)
    }
  }

  // Sync theme mode with DOM & localStorage
  const toggleThemeMode = () => {
    const nextTheme = themeMode === 'light' ? 'dark' : 'light'
    setThemeMode(nextTheme)
    try {
      localStorage.setItem('squared_theme', nextTheme)
      if (nextTheme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      window.dispatchEvent(new CustomEvent('theme_changed', { detail: nextTheme }))
    } catch (e) {
      console.error(e)
    }
  }

  // Open Codebook Search Modal
  const handleOpenCodebook = (query = '') => {
    setCodeOverlaySearchQuery(query)
    setIsCodeOverlayOpen(true)
  }

  // Handle module selection
  const handleSelectModule = (moduleId) => {
    setActiveView(moduleId)
    if (onNavigate) {
      onNavigate(moduleId)
    }
    // Record active task in localStorage
    try {
      const taskObj = {
        id: moduleId,
        timestamp: new Date().toISOString(),
        title: getModuleTitle(moduleId)
      }
      localStorage.setItem('lastActiveTask', JSON.stringify(taskObj))
      setLastTask(taskObj)
    } catch (e) {
      console.error(e)
    }
  }

  // Map module ID to Title
  const getModuleTitle = (id) => {
    switch (id) {
            case 'cram': return 'Cram Mode'
      case 'practice': return 'Exam Practice'
            case 'flashcards': return 'Flashcards'
      case 'structural': return 'Structural Specifics'
      case 'blueprint': return 'Blueprint Trainer'
      case 'math': return 'Trade Math & Estimating'
      default: return 'Structural Specifics'
    }
  }

  // Calculate readiness score
  const readinessStats = useMemo(() => {
    const totalQuizzes = quizHistory.length
    const totalFlashcards = Object.keys(flashcardReviews).length
    const score = (totalQuizzes === 0 && totalFlashcards === 0) 
      ? 0 
      : Math.min(100, Math.round((totalQuizzes * 2.5) + (totalFlashcards * 0.4)))
    return {
      score,
      masteredCards: totalFlashcards,
      quizzesTaken: totalQuizzes
    }
  }, [quizHistory, flashcardReviews])

  // Study Modules Configuration for Side-by-Side Grid Layout
  const MODULE_CARDS = [
    {
      id: 'structural',
      title: 'Structural Tables & Span Master',
      subtitle: 'NBC Span Tables & Cheat Sheets',
      badge: 'Framing & Load Tables',
      category: 'Framing Calculations',
      description: 'Lumber joist and rafter span lookup tables, lintel sizing, load distribution rules, and carpenter cheat sheets.',
      bullets: ['NBC Floor & Roof Joist Spans', 'Beam & Lintel Load Selection', 'Field vs Code Cheat Sheets'],
      icon: Wrench,
      gradient: 'from-orange-500 to-red-600',
      badgeStyle: 'bg-orange-100 dark:bg-orange-950/60 text-orange-900 dark:text-orange-200 border-orange-300 dark:border-orange-700/60'
    },
    {
      id: 'cram',
      title: 'High-Yield Speed Cram',
      subtitle: 'Rapid-Fire Question Drills',
      badge: 'Speed Cram Drills',
      category: 'Rapid Prep',
      description: 'High-yield rapid-fire question drills targeting high-frequency Red Seal topics, formula math, and critical safety rules.',
      bullets: ['Rapid-Fire Timed Rounds', 'High-Weight Red Seal Topics', 'Instant Answer Explanations'],
      icon: Flame,
      gradient: 'from-red-500 to-amber-600',
      badgeStyle: 'bg-red-100 dark:bg-red-950/60 text-red-900 dark:text-red-200 border-red-300 dark:border-red-700/60'
    },
    {
      id: 'study',
      title: 'Block Study Guides (A–G)',
      subtitle: 'Core RSOS Curriculum',
      badge: 'Blocks A–G Standards',
      category: 'Trade Competencies',
      description: 'Comprehensive study guides covering safety, site layout, concrete, framing, roof geometry, and interior finishes.',
      bullets: ['Safety & WHMIS Standards', 'Concrete & Formwork Rules', 'Roof & Stair Trigonometry'],
      icon: BookOpen,
      gradient: 'from-blue-600 to-indigo-700',
      badgeStyle: 'bg-blue-100 dark:bg-blue-950/60 text-blue-900 dark:text-blue-200 border-blue-300 dark:border-blue-700/60'
    },
    {
      id: 'flashcards',
      title: 'SRS Spaced-Repetition Deck',
      subtitle: '"Nail-It" Memory Engine',
      badge: 'Leitner SRS System',
      category: 'Memory & Formulas',
      description: 'Adaptive flashcard system using Leitner spaced repetition to eliminate your weak spots before exam day.',
      bullets: ['Adaptive Difficulty Intervals', 'Formulas & Span Table Review', 'Bookmark Difficult Questions'],
      icon: Zap,
      gradient: 'from-emerald-500 to-teal-600',
      badgeStyle: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700/60'
    },
    {
      id: 'blueprints',
      title: 'Interactive Blueprint Trainer',
      subtitle: 'Architectural Plans & Specs',
      badge: 'Interactive Drawings',
      category: 'Plans & Scales',
      description: 'Practice reading jobsite architectural floor plans, grid coordinates, title block scale conversions, and spec cards.',
      bullets: ['High-Resolution Floor Plans', 'Grid Line & Coordinate Reader', 'Title Block Scale Conversions'],
      icon: Compass,
      gradient: 'from-cyan-500 to-blue-600',
      badgeStyle: 'bg-cyan-100 dark:bg-cyan-950/60 text-cyan-900 dark:text-cyan-200 border-cyan-300 dark:border-cyan-700/60'
    },
    {
      id: 'code',
      title: 'NBC & OBC Clause Lookups',
      subtitle: 'Part 9 Building Code Index',
      badge: 'NBC 2020 / OBC Part 9',
      category: 'Building Code',
      description: 'Instant search engine for National Building Code of Canada clauses, Ontario Building Code rules, and site clashes.',
      bullets: ['Exact Clause Reference Index', 'Field vs Code Discrepancies', 'Searchable Keyword Filters'],
      icon: Book,
      gradient: 'from-violet-600 to-purple-700',
      badgeStyle: 'bg-violet-100 dark:bg-violet-950/60 text-violet-900 dark:text-violet-200 border-violet-300 dark:border-violet-700/60'
    },
    {
      id: 'glossary',
      title: 'Red Seal Trade Glossary',
      subtitle: 'A–Z Construction Dictionary',
      badge: '300+ Trade Terms',
      category: 'Terminology',
      description: 'A to Z index of official Red Seal terms, safety jargon, building materials, and site terminology with search.',
      bullets: ['Searchable Alphabetical Terms', 'Official RSOS Definitions', 'Red Seal Exam Jargon'],
      icon: FileText,
      gradient: 'from-pink-500 to-rose-600',
      badgeStyle: 'bg-pink-100 dark:bg-pink-950/60 text-pink-900 dark:text-pink-200 border-pink-300 dark:border-pink-700/60'
    }
  ]

  return (
    <div className={`w-full max-w-7xl mx-auto space-y-3 transition-colors ${themeMode === 'dark' ? 'dark text-white' : 'text-slate-900'}`}>
      
      {/* Styled Red Seal Header Banner Card */}
      <div className="bg-gradient-to-r from-red-950/50 via-slate-900/90 to-slate-900/90 border border-red-500/30 rounded-2xl px-3.5 py-2.5 mb-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
            <Shield size={18} />
          </div>
          <div className="flex flex-col min-w-0">
            <h2 className="text-sm sm:text-base font-extrabold tracking-wider text-white uppercase leading-tight whitespace-nowrap truncate">
              RED SEAL CARPENTRY
            </h2>
            <span className="text-[10px] font-mono tracking-wide text-red-400/90 uppercase mt-0.5 whitespace-nowrap">
              INTERPROVINCIAL • NOC 72310
            </span>
          </div>
        </div>
        <button 
          type="button"
          onClick={() => setShowRedSealIntro(true)} 
          className="w-8 h-8 rounded-lg bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-slate-300 hover:text-white shrink-0 transition-colors active:scale-95"
          title="About Red Seal Section"
        >
          <Info size={16} />
        </button>
      </div>
      <div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {RED_SEAL_MODULE_OPTIONS.map(mod => {
            const isActive = activeView === mod.id;
            const IconComponent = mod.icon;
            return (
              <div
                key={mod.id}
                onClick={() => {
                  setActiveView(mod.id);
                  if (onNavigate) onNavigate(mod.id);
                }}
                className={`flex items-center justify-between px-2.5 py-2 gap-2 rounded-xl border cursor-pointer overflow-hidden transition-all duration-150 ${
                  isActive 
                    ? 'bg-cyan-50 dark:bg-cyan-950/30 border-cyan-500 dark:border-cyan-500/50 shadow-md' 
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-cyan-300 dark:hover:border-cyan-700'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className={`p-1.5 rounded-lg shrink-0 ${isActive ? 'bg-cyan-400 text-slate-950 shadow-sm' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}>
                    <IconComponent size={15} strokeWidth={2.5} className={isActive ? 'text-slate-950' : mod.color} />
                  </div>
                  <span className={`text-[11px] sm:text-xs font-bold uppercase tracking-tight whitespace-nowrap ${isActive ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                    {mod.name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setActiveModalInfo({
                      icon: <IconComponent size={24} strokeWidth={2} className={mod.color} />,
                      title: mod.modalTitle || mod.name,
                      definition: mod.definition,
                      exampleCase: mod.exampleCase,
                      proTip: mod.proTip
                    });
                  }}
                  className={`p-1 rounded-full shrink-0 transition-colors ${isActive ? 'text-cyan-600 dark:text-cyan-400 hover:bg-cyan-100 dark:hover:bg-cyan-900/50' : 'text-slate-400 hover:text-cyan-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                >
                  <Info size={14} strokeWidth={2.5} />
                </button>
              </div>
            );
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

      {/* RENDER ACTIVE SUB-COMPONENT OR LAUNCHPAD MAIN HUB */}
      {activeView === 'hub' ? (
        <div className="space-y-6">

          {/* RECESSED LCD READOUT & QUICK METRICS DASHBOARD */}
          <div className="bg-slate-100 dark:bg-slate-950 border-2 border-slate-300 dark:border-slate-800 rounded-2xl p-4 md:p-6 shadow-[inset_0_2px_6px_rgba(0,0,0,0.12)] dark:shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)] space-y-4">
            
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-300 dark:border-slate-800/80 pb-3">
              <div className="flex items-center space-x-2">
                <BarChart3 size={18} className="text-amber-500" />
                <span className="text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">
                  Readiness Hardware Readout
                </span>
              </div>
              
              {/* Last Task Quick Resume Button */}
              {lastTask && (
                <button
                  onClick={() => handleSelectModule(lastTask.id)}
                  className="flex items-center space-x-2 text-xs font-black text-amber-600 dark:text-amber-400 hover:underline bg-amber-100 dark:bg-amber-950/60 px-3 py-1 rounded-lg border border-amber-300 dark:border-amber-800"
                >
                  <Play size={12} className="fill-current" />
                  <span>Resume: {lastTask.title}</span>
                </button>
              )}
            </div>

            {/* Hardware Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              
              {/* Metric 1: Exam Readiness Score */}
              <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-300 dark:border-slate-800 shadow-sm">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Exam Readiness
                </div>
                <div className="flex items-baseline space-x-2 mt-1">
                  <span className="text-2xl font-black text-amber-500">{readinessStats.score}%</span>
                  <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">On Track</span>
                </div>
                {/* Progress Bar */}
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div 
                    className="bg-amber-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${readinessStats.score}%` }}
                  />
                </div>
              </div>

              {/* Metric 2: Study Streak */}
              <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-300 dark:border-slate-800 shadow-sm">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between">
                  <span>Study Streak</span>
                  <Flame size={14} className="text-orange-500" />
                </div>
                <div className="flex items-baseline space-x-2 mt-1">
                  <span className="text-2xl font-black text-orange-500">{loginStreak} Days</span>
                  <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">Active</span>
                </div>
                <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1">
                  Daily Habit Bonus
                </div>
              </div>

              {/* Metric 3: User XP & Rank */}
              <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-300 dark:border-slate-800 shadow-sm">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between">
                  <span>Experience XP</span>
                  <Trophy size={14} className="text-emerald-500" />
                </div>
                <div className="flex items-baseline space-x-2 mt-1">
                  <span className="text-2xl font-black text-emerald-500">{userXP} XP</span>
                </div>
                <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400 mt-1">
                  Journeyman Lvl 4
                </div>
              </div>

              {/* Metric 4: Cards Mastered */}
              <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-300 dark:border-slate-800 shadow-sm">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between">
                  <span>Mastered Flashcards</span>
                  <Zap size={14} className="text-blue-500" />
                </div>
                <div className="flex items-baseline space-x-2 mt-1">
                  <span className="text-2xl font-black text-blue-500">{readinessStats.masteredCards} Cards</span>
                </div>
                <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1">
                  Leitner Box SRS
                </div>
              </div>

            </div>

            {/* Flashcard SRS Metrics Grid */}
            <div className="border-t border-slate-300 dark:border-slate-800/80 pt-4 mt-4">
              <div className="flex items-center space-x-2 mb-3">
                <Layers size={16} className="text-brand-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">
                  SRS Flashcard Analytics
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                
                {/* SRS: Ready to Review */}
                <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-300 dark:border-slate-800 shadow-sm">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between">
                    <span>Ready to Review</span>
                    <RotateCcw size={14} className="text-amber-500" />
                  </div>
                  <div className="flex items-baseline space-x-2 mt-1">
                    <span className="text-2xl font-black text-amber-500">{srsStats.dueCount}</span>
                  </div>
                  <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1">
                    Cards Due Now
                  </div>
                </div>

                {/* SRS: Unseen / New */}
                <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-300 dark:border-slate-800 shadow-sm">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between">
                    <span>Unseen / New</span>
                    <Sparkles size={14} className="text-brand-500" />
                  </div>
                  <div className="flex items-baseline space-x-2 mt-1">
                    <span className="text-2xl font-black text-brand-500">{srsStats.newCount}</span>
                  </div>
                  <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1">
                    In Queue
                  </div>
                </div>

                {/* SRS: In Learning */}
                <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-300 dark:border-slate-800 shadow-sm">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between">
                    <span>In Learning</span>
                    <BookOpen size={14} className="text-blue-500" />
                  </div>
                  <div className="flex items-baseline space-x-2 mt-1">
                    <span className="text-2xl font-black text-blue-500">{srsStats.learning}</span>
                  </div>
                  <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1">
                    Currently Studying
                  </div>
                </div>

                {/* SRS: Graduated */}
                <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-300 dark:border-slate-800 shadow-sm">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between">
                    <span>Graduated</span>
                    <Award size={14} className="text-emerald-500" />
                  </div>
                  <div className="flex items-baseline space-x-2 mt-1">
                    <span className="text-2xl font-black text-emerald-500">{srsStats.learned}</span>
                  </div>
                  <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1">
                    Mastered
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* MAIN LAUNCHPAD NAVIGATION MENU: FRONT-AND-CENTER SIDE-BY-SIDE GRID */}
          <div className="space-y-4">
            
            <div className="flex items-center justify-between px-1">
              <div>
                <h2 className="text-lg md:text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
                  Study Modules & Tool Suite
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                  Select a module to launch full Red Seal exam prep tools
                </p>
              </div>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-300 dark:border-amber-800">
                9 Active Modes
              </span>
            </div>

            {/* STRICT SIDE-BY-SIDE GRID LAYOUT (NO DROPDOWNS) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
              {MODULE_CARDS.map((card) => {
                const IconComponent = card.icon
                return (
                  <div
                    key={card.id}
                    onClick={() => handleSelectModule(card.id)}
                    className="group cursor-pointer bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-300 dark:border-slate-800 p-5 shadow-md hover:shadow-xl hover:border-amber-500 dark:hover:border-amber-500 flex flex-col justify-between space-y-4 relative overflow-hidden active:scale-[0.98] transition-transform duration-75"
                  >
                    {/* Top Accent Line */}
                    <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${card.gradient}`} />

                    <div>
                      {/* Badge & Icon Row */}
                      <div className="flex items-center justify-between mb-3">
                        <div className={`p-2.5 rounded-xl bg-gradient-to-br ${card.gradient} text-white shadow-md group-hover:scale-105 transition-transform`}>
                          <IconComponent size={22} className="stroke-[2.5]" />
                        </div>
                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider border ${card.badgeStyle}`}>
                          {card.badge}
                        </span>
                      </div>

                      {/* Title & Subtitle */}
                      <h3 className="text-base md:text-lg font-black uppercase tracking-tight text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors">
                        {card.title}
                      </h3>
                      <p className="text-xs font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                        {card.subtitle}
                      </p>

                      {/* Description */}
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                        {card.description}
                      </p>

                      {/* Bullet Highlights */}
                      <ul className="mt-3 space-y-1">
                        {card.bullets.map((bullet, idx) => (
                          <li key={idx} className="flex items-center space-x-1.5 text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                            <Check size={12} className="text-amber-500 shrink-0" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Raised 3D Launch Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSelectModule(card.id)
                      }}
                      className="w-full mt-2 py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:bg-amber-500 text-slate-900 dark:text-white group-hover:text-slate-950 font-black text-xs uppercase tracking-wider border-2 border-b-4 border-r-2 border-slate-300 dark:border-slate-700 group-hover:border-amber-700 active:translate-y-0.5 active:border-b-2 shadow-md flex items-center justify-center space-x-2 transition-all"
                    >
                      <span>Launch Module</span>
                      <ChevronRight size={16} className="stroke-[3]" />
                    </button>

                  </div>
                )
              })}
            </div>

          </div>

        </div>
      ) : (
        /* ACTIVE SUB-COMPONENT RENDER CONTAINER */
        <div className="space-y-6">
          {/* Sub-Component Router */}
          <div>
            {activeView === 'practice' && <QuizEngine theme={themeMode} initialQuizMode="practice" />}
            {activeView === 'cram' && <QuizEngine theme={themeMode} initialQuizMode="cram" initialCram={true} />}
            {activeView === 'flashcards' && <NbcFlashcards theme={themeMode} />}
            {activeView === 'structural' && <StructuralSpecifics theme={themeMode} />}
            {activeView === 'blueprint' && <BlueprintViewer theme={themeMode} />}
            {activeView === 'math' && <TradeMathMenu theme={themeMode} />}
          </div>
        </div>
      )}

      {/* RED SEAL ONBOARDING MODAL */}
      <AnimatePresence>
        {showRedSealIntro && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className={`w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border ${themeMode === 'dark' ? 'bg-[#111] border-red-500/30' : 'bg-white border-red-200'}`}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-br from-red-600 to-red-800 p-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                <Shield className="w-12 h-12 text-white/90 mx-auto mb-3 drop-shadow-md" />
                <h3 className="text-2xl font-black text-white uppercase tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                  Master the Red Seal
                </h3>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-4">
                <p className={`text-sm sm:text-base font-medium text-center ${themeMode === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                  This section is your ultimate study companion for the Canadian Red Seal Carpentry Exam.
                </p>

                <div className="space-y-4 mt-6">
                  <div className="flex gap-3 items-start">
                    <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg shrink-0 mt-0.5 shadow-sm">
                      <Zap className="w-5 h-5 text-yellow-600 dark:text-yellow-500" />
                    </div>
                    <div>
                      <h4 className={`text-sm font-bold ${themeMode === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>Interactive Flashcards</h4>
                      <p className={`text-xs ${themeMode === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Test your knowledge across all major structural categories.</p>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start">
                    <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg shrink-0 mt-0.5 shadow-sm">
                      <Flame className="w-5 h-5 text-orange-600 dark:text-orange-500" />
                    </div>
                    <div>
                      <h4 className={`text-sm font-bold ${themeMode === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>Cram Mode</h4>
                      <p className={`text-xs ${themeMode === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Rapid-fire questions to lock in critical code and measurement memory before test day.</p>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg shrink-0 mt-0.5 shadow-sm">
                      <Layers className="w-5 h-5 text-blue-600 dark:text-blue-500" />
                    </div>
                    <div>
                      <h4 className={`text-sm font-bold ${themeMode === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>Structural Specifics</h4>
                      <p className={`text-xs ${themeMode === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Deep dives into Hoisting, Scaffolding, Site Prep, and more.</p>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  onClick={closeRedSealIntro}
                  className="w-full mt-8 py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-black uppercase tracking-widest text-sm shadow-lg shadow-red-500/30 transition-all active:scale-95"
                >
                  Got It! Let's Go
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CODE SEARCH OVERLAY MODAL */}
      <CodeSearchOverlay
        isOpen={isCodeOverlayOpen}
        onClose={() => setIsCodeOverlayOpen(false)}
        initialSearchQuery={codeOverlaySearchQuery}
      />

    </div>
  )
}
