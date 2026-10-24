import React, { useContext, useMemo, useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom"
import { AppContext } from '../../App'
import { Award, HelpCircle, ChevronRight, ChevronDown, Search, FileText, Zap, Calendar, Wrench, Hammer, Shield, Trophy, Compass, Flame } from "lucide-react"
import questionsData from '../../data/RedSeal/questions.json'
import glossaryData from '../../data/RedSeal/glossary.json'
import fieldVsCodeClashes from '../../data/RedSeal/fieldVsCodeClashes.json'
import { isCardDue } from '../../hooks/srsService'
import OrientationHub from './OrientationHub'
import { offlineCacheService } from '../../services/offlineCacheService'

// Helper to highlight search term in text
const highlightText = (text, highlight) => {
  if (!text) return ''
  if (!highlight || typeof highlight !== 'string' || !highlight.trim()) return text

  const query = highlight.trim()
  const regex = new RegExp(`(${query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi')
  const parts = String(text).split(regex)

  return (
    <>
      {parts.map((part, i) => 
        (part || '').toLowerCase() === query.toLowerCase() ? (
          <mark key={i} className="bg-amber-100 dark:bg-amber-500/30 text-amber-900 dark:text-amber-200 px-0.5 rounded font-semibold">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  )
}

export default function Dashboard({ onNavigate }) {
  const context = useContext(AppContext) || {}
  const { 
    setActiveTab = () => {}, 
    quizHistory: rawQuizHistory, 
    bookmarks: rawBookmarks, 
    nailItDeck: rawNailItDeck, 
    flashcardReviews = {},
    searchQuery = '', 
    setSearchQuery = () => {},
    setCustomQuizQuestions = () => {},
    userXP = 0,
    setUserXP = () => {},
    setIsCramMode = () => {},
    loginStreak = 1
  } = context

  const handleNav = (targetView) => {
    let mapped = targetView
    if (targetView === 'specifics') mapped = 'structural'
    if (targetView === 'quiz') mapped = 'simulator'
    if (targetView === 'blueprints') mapped = 'blueprint'

    if (typeof onNavigate === 'function') {
      onNavigate(mapped)
    }
    if (typeof setActiveTab === 'function') {
      setActiveTab(mapped)
    }
    if (typeof context.setActiveView === 'function') {
      context.setActiveView(mapped)
    }
    if (typeof context.onNavigate === 'function') {
      context.onNavigate(mapped)
    }
  }

  const quizHistory = Array.isArray(rawQuizHistory) ? rawQuizHistory : []
  const bookmarks = Array.isArray(rawBookmarks) ? rawBookmarks : []
  const nailItDeck = Array.isArray(rawNailItDeck) ? rawNailItDeck : []

  const navigate = useNavigate()
  const [lastActiveTask, setLastActiveTask] = useState(() => {
    try {
      const saved = localStorage.getItem('lastActiveTask') || localStorage.getItem('builderHub_last_active_task')
      return saved ? JSON.parse(saved) : null
    } catch (e) {
      return null
    }
  })

  useEffect(() => {
    const handleUpdate = () => {
      try {
        const saved = localStorage.getItem('lastActiveTask') || localStorage.getItem('builderHub_last_active_task')
        setLastActiveTask(saved ? JSON.parse(saved) : null)
      } catch (e) {
        console.error(e)
      }
    }
    window.addEventListener('builderHub_last_active_task_updated', handleUpdate)
    return () => {
      window.removeEventListener('builderHub_last_active_task_updated', handleUpdate)
    }
  }, [])

  const handleResumeTask = () => {
    if (lastActiveTask && lastActiveTask.route) {
      navigate(lastActiveTask.route)
    }
  }

  // Offline caching state
  const [offlineStats, setOfflineStats] = useState(null)
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncSuccess, setSyncSuccess] = useState(null)
  const [offlineSimulation, setOfflineSimulation] = useState(() => {
    try {
      return localStorage.getItem('red_seal_offline_simulation') === 'true'
    } catch (e) {
      return false
    }
  })
  const [isOrientationOpen, setIsOrientationOpen] = useState(false)
  const [currentClashIndex, setCurrentClashIndex] = useState(0)

  // Load offline stats on mount
  useEffect(() => {
    const loadStats = async () => {
      const stats = await offlineCacheService.getOfflineStats()
      setOfflineStats(stats)
    }
    loadStats()

    // Periodically update online status
    const interval = setInterval(async () => {
      const stats = await offlineCacheService.getOfflineStats()
      setOfflineStats(prev => ({
        ...stats,
        onlineStatus: offlineSimulation ? 'Offline' : (navigator.onLine ? 'Online' : 'Offline')
      }))
    }, 4000)

    return () => clearInterval(interval)
  }, [offlineSimulation])

  const handleSyncData = async () => {
    setIsSyncing(true)
    setSyncSuccess(null)
    const result = await offlineCacheService.syncOfflineData()
    setIsSyncing(false)
    if (result.success) {
      setSyncSuccess(true)
      const stats = await offlineCacheService.getOfflineStats()
      setOfflineStats(stats)
      setUserXP(prev => (prev || 0) + 25) // reward apprentice with +25 XP for pre-jobsite prep!
    } else {
      setSyncSuccess(false)
    }
  }

  const toggleOfflineSimulation = () => {
    const newVal = !offlineSimulation
    setOfflineSimulation(newVal)
    try {
      localStorage.setItem('red_seal_offline_simulation', newVal ? 'true' : 'false')
    } catch (e) {}
  }

  // 1. Calculate streamlined rank details
  const currentRankInfo = useMemo(() => {
    const ranks = [
      { name: '1st Year Apprentice', min: 0, max: 999, nextMin: 1000, icon: 'Wrench', color: 'from-amber-600 to-amber-700' },
      { name: '2nd Year Apprentice', min: 1000, max: 2999, nextMin: 3000, icon: 'Hammer', color: 'from-blue-600 to-blue-700' },
      { name: '3rd Year Apprentice', min: 3000, max: 5999, nextMin: 6000, icon: 'Shield', color: 'from-indigo-600 to-indigo-700' },
      { name: '4th Year Apprentice', min: 6000, max: 9999, nextMin: 10000, icon: 'Award', color: 'from-purple-600 to-purple-700' },
      { name: 'Red Seal Journeyman', min: 10000, max: Infinity, nextMin: null, icon: 'Trophy', color: 'from-emerald-600 to-emerald-700' }
    ]

    const rank = ranks.find(r => userXP >= r.min && userXP <= r.max) || ranks[ranks.length - 1]
    
    let progressPercent = 100
    let xpNeeded = 0
    
    if (rank.nextMin !== null) {
      const range = rank.max - rank.min + 1
      const currentProgress = userXP - rank.min
      progressPercent = Math.min(100, Math.max(0, Math.round((currentProgress / range) * 100)))
      xpNeeded = rank.nextMin - userXP
    }

    return { ...rank, progressPercent, xpNeeded }
  }, [userXP])

  const renderRankIcon = (iconName, size = 32, className = "") => {
    switch(iconName) {
      case 'Wrench': return <Wrench size={size} className={className} />
      case 'Hammer': return <Hammer size={size} className={className} />
      case 'Shield': return <Shield size={size} className={className} />
      case 'Award': return <Award size={size} className={className} />
      case 'Trophy': return <Trophy size={size} className={className} />
      default: return <Award size={size} className={className} />
    }
  }

  // 2. Glossary checklist state
  const [glossaryChecklist, setGlossaryChecklist] = useState(() => {
    try {
      const saved = localStorage.getItem('red_seal_glossary_checklist')
      return saved ? JSON.parse(saved) : []
    } catch (e) {
      console.error("Failed to parse glossary checklist", e)
      return []
    }
  })

  const handleToggleChecklist = (term) => {
    setGlossaryChecklist(prev => {
      const current = prev || []
      const updated = current.includes(term) 
        ? current.filter(t => t !== term) 
        : [...current, term]
      try {
        localStorage.setItem('red_seal_glossary_checklist', JSON.stringify(updated))
      } catch (e) {
        console.error("Failed to save glossary checklist", e)
      }
      
      // Bonus: If all checked for the first time, award +50 XP!
      const bonusAwarded = localStorage.getItem('red_seal_onboarding_bonus_awarded') === 'true'
      if (updated.length === 8 && !bonusAwarded) {
        setUserXP(prevXP => (prevXP || 0) + 50)
        try {
          localStorage.setItem('red_seal_onboarding_bonus_awarded', 'true')
        } catch (e) {}
      }
      return updated
    })
  }

  const dueReviewsCount = useMemo(() => {
    if (!flashcardReviews) return 0
    try {
      return Object.values(flashcardReviews).filter(isCardDue).length
    } catch (e) {
      return 0
    }
  }, [flashcardReviews])

  // Calculate stats for top quick info
  const stats = useMemo(() => {
    const history = quizHistory || []
    const totalQuizzes = history.length
    const averageScore = totalQuizzes > 0 
      ? Math.round((history.reduce((sum, item) => sum + (item && item.total > 0 ? (item.score / item.total) : 0), 0) / totalQuizzes) * 100)
      : 0
    return { totalQuizzes, averageScore }
  }, [quizHistory])

  // Next Recommended Action Engine

  // Global Search Filter logic
  const searchResults = useMemo(() => {
    if (!searchQuery || typeof searchQuery !== 'string' || !searchQuery.trim()) return null

    const query = searchQuery.toLowerCase().trim()

    // Filter questions from cache or fallback data
    const activeQuestions = offlineCacheService.getCachedQuestions(questionsData) || []
    const filteredQuestions = activeQuestions.filter(q => 
      (q?.question || '').toLowerCase().includes(query) || 
      (q?.explanation || '').toLowerCase().includes(query) || 
      (q?.block || '').toLowerCase().includes(query) || 
      (q?.blockTitle || '').toLowerCase().includes(query) || 
      (q?.codeReference && q.codeReference.toLowerCase().includes(query))
    )

    // Filter glossary from cache or fallback data
    const activeGlossary = offlineCacheService.getCachedGlossary(glossaryData) || []
    const filteredGlossary = activeGlossary.filter(g => 
      (g?.term || '').toLowerCase().includes(query) || 
      (g?.definition || '').toLowerCase().includes(query) || 
      (g?.category && g.category.toLowerCase().includes(query))
    )

    return {
      questions: filteredQuestions,
      glossary: filteredGlossary
    }
  }, [searchQuery])

  // If search is active, render Search Results Screen instead
  if (searchResults) {
    const questionsList = searchResults.questions || []
    const glossaryList = searchResults.glossary || []
    const totalResults = questionsList.length + glossaryList.length
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <span className="text-xs uppercase tracking-wider text-brand-500 font-extrabold flex items-center gap-1">
              <Search size={12} /> Global Search Portal
            </span>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Search Results for "{searchQuery}"</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Found {totalResults} matches across modules and terms.</p>
          </div>
          <button 
            onClick={() => setSearchQuery('')}
            className="text-xs px-3 py-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-750 font-bold rounded-lg min-h-[40px]"
          >
            Clear Search
          </button>
        </div>

        {totalResults === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-xl p-8 text-center shadow-sm border border-slate-200 dark:border-slate-800">
            <span className="text-4xl">🔍</span>
            <h3 className="text-lg font-bold mt-4">No exact matches found</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto">
              Try searching for general building terms like "tread", "NBC", "rafter", "footing" or major work blocks like "Block D".
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* GLOSSARY RESULTS */}
            <div className="space-y-4">
              <h3 className="text-lg font-black uppercase text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <FileText size={18} className="text-brand-500" />
                Glossary Terms ({glossaryList.length})
              </h3>
              <div className="space-y-3">
                {glossaryList.map((item, index) => (
                  <div key={index} className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 hover:border-brand-500 transition-colors">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-brand-600 dark:text-brand-400 text-lg">
                        {highlightText(item.term, searchQuery)}
                      </h4>
                      <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-black text-slate-500 dark:text-slate-400 uppercase">
                        {highlightText(item.category || "Red Seal / NBC", searchQuery)}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                      {highlightText(item.definition, searchQuery)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* CURRICULUM QUESTIONS RESULTS */}
            <div className="space-y-4">
              <h3 className="text-lg font-black uppercase text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <HelpCircle size={18} className="text-emerald-500" />
                Exam Practice Questions ({questionsList.length})
              </h3>
              <div className="space-y-3">
                {questionsList.map((q) => (
                  <div key={q.id} className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 hover:border-emerald-500 transition-colors">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 px-2 py-0.5 rounded font-black uppercase">
                        {highlightText(q.block, searchQuery)}
                      </span>
                      {q.codeReference && (
                        <span className="text-[10px] text-slate-400 dark:text-slate-400 font-mono">
                          {highlightText(q.codeReference, searchQuery)}
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 mt-2 leading-snug">
                      {highlightText(q.question, searchQuery)}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 italic">
                      Explanation: {highlightText(q.explanation, searchQuery)}
                    </p>
                    <button 
                      onClick={() => {
                        setSearchQuery('')
                        handleNav('quiz')
                      }}
                      className="mt-3 text-xs text-brand-500 font-black flex items-center gap-1 hover:underline min-h-[32px]"
                    >
                      Open in Quiz Engine <ChevronRight size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
    )
  }

  const isNewUser = userXP === 0 && (quizHistory || []).length === 0


  return (
    <div className="space-y-6 max-w-6xl mx-auto min-h-screen pt-3 pb-6 px-4 md:p-6 bg-slate-50 dark:bg-slate-950 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/50 via-slate-50 to-amber-100/30 dark:from-blue-900/20 dark:via-slate-950 dark:to-amber-900/10 text-slate-900 dark:text-white transition-colors duration-300">
      
      <div className="flex flex-col mb-4">
        {/* 1. MAIN TITLE */}
        <h1 className="text-[clamp(14px,5vw,30px)] font-black tracking-tighter leading-tight mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300 whitespace-nowrap w-full text-center sm:text-left">
          RED SEAL EXAM PERFORMANCE HUB
        </h1>

        {/* 2. SIDE-BY-SIDE STATUS PILLS */}
        <div className="flex flex-row flex-nowrap items-center justify-between w-full gap-2 mb-4">
          <div className="inline-flex items-center justify-center bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 border-none shadow-md text-[clamp(9px,2.8vw,12px)] font-bold px-2 py-1.5 rounded-full tracking-wide uppercase whitespace-nowrap flex-1 text-center">
            🎯 70% RSOS PASS STANDARD
          </div>
          <div className="inline-flex items-center justify-center bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-950/40 dark:to-red-950/40 border border-orange-300 dark:border-orange-500/50 text-orange-600 dark:text-orange-400 text-[clamp(9px,2.8vw,12px)] font-bold px-2 py-1.5 rounded-full whitespace-nowrap flex-1 text-center">
            🔥 DAILY STREAK: {loginStreak || 7} Days
          </div>
        </div>

        {/* 3. RESUME RECENT ACTIVITY BUBBLE */}
        {lastActiveTask && (
          <div 
            onClick={handleResumeTask}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex items-center justify-between shadow-sm cursor-pointer hover:border-cyan-400 transition-all"
          >
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
              </span>
              <span className="font-mono text-xs md:text-sm font-black text-slate-700 dark:text-slate-200 tracking-wider">
                RESUME RECENT ACTIVITY: <span className="text-cyan-600 dark:text-cyan-400 uppercase">{lastActiveTask.title}</span> — <span className="text-slate-600 dark:text-slate-300 font-bold">{lastActiveTask.subtext}</span>
              </span>
            </div>
            <ChevronRight className="w-5 h-5 text-cyan-600 dark:text-cyan-400 group-hover:translate-x-1 transition-transform shrink-0" />
          </div>
        )}
      </div>

      {/* NEW STUDY TOOLS LAYOUT */}
      <div className="flex flex-col gap-6 w-full">
        {/* 1. RED SEAL CRAM MODE CARD (HERO PROMINENCE) */}
        <div 
          onClick={() => {
            setIsCramMode(true)
            handleNav('cram')
          }}
          className="bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-slate-900 dark:to-amber-950/40 border-2 border-amber-500/60 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 font-mono text-slate-900 dark:text-white transition-all hover:border-amber-400 cursor-pointer"
        >
          <div className="flex flex-col max-w-2xl">
            <span className="text-[10px] font-black tracking-widest text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/30 px-2.5 py-1 rounded uppercase w-fit mb-3">
              🔥 EXAM CHEAT SHEETS
            </span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">
              RED SEAL CRAM MODE
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-xs md:text-sm leading-relaxed font-medium">
              Rapidly review auto-revealed blueprint math, rafter line lengths, stair tolerances, and critical framing formulas before exam day.
            </p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              setIsCramMode(true)
              handleNav('cram')
            }}
            className="w-full md:w-auto md:px-8 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 text-lg transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer whitespace-nowrap shrink-0"
          >
            <span>⚡</span> LAUNCH CRAM MODE
          </button>
        </div>

        {/* 2. DAILY EXAM TRAPS CARD */}
        <div className="bg-gradient-to-br from-red-50 to-red-100/30 dark:from-slate-900 dark:to-red-950/20 border-2 border-red-500/40 dark:border-red-500/40 rounded-2xl p-6 shadow-sm flex flex-col font-mono text-slate-900 dark:text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
            <div className="flex flex-col max-w-2xl">
              <span className="text-[10px] font-black tracking-widest text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-950/40 border border-red-200 dark:border-red-800/30 px-2.5 py-1 rounded uppercase w-fit mb-3">
                ⚠️ EXAM WARNING
              </span>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">
                DAILY EXAM TRAPS
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-xs md:text-sm leading-relaxed font-medium">
                Avoid common NBC code misinterpretations. See where jobsite habits conflict with strict Red Seal standards.
              </p>
            </div>
            <button
              onClick={() => setCurrentClashIndex((prev) => (prev + 1) % (fieldVsCodeClashes?.length || 1))}
              className="w-full md:w-auto md:px-6 bg-red-500 hover:bg-red-400 text-white font-black py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>🚨</span> REVEAL NEXT TRAP
            </button>
          </div>
          
          {fieldVsCodeClashes && fieldVsCodeClashes.length > 0 && (
            <div className="bg-white dark:bg-slate-950 border border-red-200 dark:border-red-900/50 rounded-xl p-4 md:p-5 relative overflow-hidden space-y-4 shadow-inner">
               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                 <div className="space-y-1">
                   <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-black tracking-wider">
                     TOPIC: <span className="text-red-600 dark:text-red-400">{fieldVsCodeClashes[currentClashIndex]?.topic}</span>
                   </p>
                 </div>
                 <span className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] text-slate-600 dark:text-slate-400 px-2.5 py-1 rounded font-black tracking-widest uppercase w-fit">
                   TRAP {currentClashIndex + 1} OF {fieldVsCodeClashes.length}
                 </span>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                 <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-500/30 p-4 rounded-xl flex flex-col justify-between">
                   <div>
                     <span className="text-[10px] font-black text-amber-600 dark:text-amber-500 tracking-wider uppercase block mb-2">
                       🔨 ON THE JOBSITE (Shortcut)
                     </span>
                     <p className="text-xs md:text-sm text-slate-900 dark:text-slate-200 leading-relaxed font-bold">
                       {fieldVsCodeClashes[currentClashIndex]?.field}
                     </p>
                   </div>
                   <span className="text-[9px] text-amber-600 dark:text-amber-500 font-bold uppercase tracking-widest block mt-3">
                     ⚠️ SITE BAD HABIT
                   </span>
                 </div>

                 <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-300 dark:border-emerald-500/30 p-4 rounded-xl mt-4 md:mt-0 flex flex-col justify-between">
                   <div>
                     <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 tracking-wider uppercase block mb-2">
                       📋 ON THE EXAM (Strict Code)
                     </span>
                     <p className="text-xs md:text-sm text-slate-900 dark:text-slate-200 leading-relaxed font-bold">
                       {fieldVsCodeClashes[currentClashIndex]?.code}
                     </p>
                   </div>
                   <span className="text-[9px] text-emerald-700 dark:text-emerald-400 font-black uppercase tracking-widest block mt-3">
                     ✅ MANDATORY NBC RULE
                   </span>
                 </div>
               </div>

               <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-3 rounded-xl mt-4">
                 <p className="text-xs text-slate-700 dark:text-slate-300 italic font-medium">
                   <span className="text-red-500 font-extrabold not-italic uppercase tracking-wider text-[10px] mr-1">EXAM TIP:</span>
                   {fieldVsCodeClashes[currentClashIndex]?.tip}
                 </p>
               </div>
            </div>
          )}
        </div>

        {/* 3. GRID: CORE STUDY TOOLS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono">
          
          {/* STRUCTURAL SPECIFICS CARD */}
          <div 
            onClick={() => handleNav('structural')}
            className="group bg-gradient-to-br from-fuchsia-50 to-fuchsia-100/50 dark:from-slate-900 dark:to-fuchsia-950/40 border-2 border-fuchsia-500/60 rounded-2xl p-6 shadow-sm hover:shadow-[0_0_20px_rgba(217,70,239,0.15)] flex flex-col justify-between transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            <div className="flex flex-col">
              <span className="text-[10px] font-black tracking-widest text-fuchsia-700 dark:text-fuchsia-400 bg-fuchsia-100 dark:bg-fuchsia-950/40 border border-fuchsia-200 dark:border-fuchsia-800/30 px-2.5 py-1 rounded uppercase w-fit mb-3">
                🏗️ BLUEPRINT MATH
              </span>
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">
                STRUCTURAL SPECIFICS
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed font-medium mb-6">
                Deep-dive into structural code minimums, advanced layout mathematics, stair tolerances, and critical load-path requirements.
              </p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                handleNav('structural')
              }}
              className="mt-auto flex items-center justify-between w-full text-xs font-bold uppercase tracking-wider text-fuchsia-600 dark:text-fuchsia-400 group-hover:text-fuchsia-700 dark:group-hover:text-fuchsia-300 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span>📐</span> REVIEW SPECIFICS
              </div>
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* PRACTICE EXAM CARD */}
          <div 
            onClick={() => {
              setIsCramMode(false)
              handleNav('quiz')
            }}
            className="group bg-gradient-to-br from-indigo-50 to-indigo-100/50 dark:from-slate-900 dark:to-indigo-950/40 border-2 border-indigo-500/60 rounded-2xl p-6 shadow-sm hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] flex flex-col justify-between transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            <div className="flex flex-col">
              <span className="text-[10px] font-black tracking-widest text-indigo-700 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/30 px-2.5 py-1 rounded uppercase w-fit mb-3">
                📝 TIMED SIMULATOR
              </span>
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">
                PRACTICE EXAM
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed font-medium mb-6">
                Sit for a full-length, timed mock examination covering all RSOS blocks to evaluate final journeyman readiness and identify weak areas.
              </p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setIsCramMode(false)
                handleNav('quiz')
              }}
              className="mt-auto flex items-center justify-between w-full text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span>⏱️</span> START SIMULATOR
              </div>
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* BLUEPRINT READING MASTERCLASS CARD */}
          <div 
            onClick={() => handleNav('blueprints')}
            className="group bg-gradient-to-br from-slate-100 to-slate-200/50 dark:from-slate-900 dark:to-slate-800/80 border-2 border-slate-500/60 rounded-2xl p-6 shadow-sm hover:shadow-[0_0_20px_rgba(100,116,139,0.15)] flex flex-col justify-between transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            <div className="flex flex-col">
              <span className="text-[10px] font-black tracking-widest text-slate-700 dark:text-slate-400 bg-slate-200 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700/50 px-2.5 py-1 rounded uppercase w-fit mb-3">
                🗺️ PLAN READING
              </span>
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">
                BLUEPRINT MASTERCLASS
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed font-medium mb-6">
                Learn to decipher complex commercial and residential blueprints. Master elevation drawings, section details, and site plan navigation.
              </p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                handleNav('blueprints')
              }}
              className="mt-auto flex items-center justify-between w-full text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span>🗺️</span> OPEN BLUEPRINTS
              </div>
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* COMPACT 3-COLUMN SUMMARY BAR */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-slate-900 dark:text-white">
        
        {/* TOTAL XP */}
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 p-5 rounded-2xl flex items-center space-x-4 shadow-sm hover:border-slate-300 dark:hover:border-slate-800 transition-colors">
          <div className="p-3 bg-brand-500/10 rounded-xl text-brand-500 dark:text-brand-400 border border-brand-500/20">
            <Trophy size={24} />
          </div>
          <div>
            <h3 className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Total XP Level</h3>
            <p className="text-xl font-black text-slate-900 dark:text-white mt-0.5">{userXP} XP</p>
          </div>
        </div>

        {/* NAIL IT QUEUE */}
        <div 
          onClick={() => handleNav('quiz')}
          className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 p-5 rounded-2xl flex items-center space-x-4 shadow-sm cursor-pointer hover:border-amber-500/40 transition-colors"
        >
          <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500 dark:text-amber-400 border border-amber-500/20">
            <Zap size={24} />
          </div>
          <div>
            <h3 className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Nail It Queue</h3>
            <p className="text-xl font-black text-slate-900 dark:text-white mt-0.5">{(nailItDeck || []).length} Items</p>
          </div>
        </div>

        {/* DUE SRS REVIEWS */}
        <div 
          onClick={() => handleNav('quiz')}
          className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 p-5 rounded-2xl flex items-center space-x-4 cursor-pointer hover:border-emerald-500/40 transition-colors text-left shadow-sm"
        >
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500 dark:text-emerald-400 border border-emerald-500/20">
            <Calendar size={24} />
          </div>
          <div>
            <h3 className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Due SRS Reviews</h3>
            <p className="text-xl font-black text-white mt-0.5">{dueReviewsCount} Due</p>
          </div>
        </div>

      </div>

      {/* MODULE DIRECTORY SUMMARY */}
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 p-6 rounded-2xl shadow-sm">
        <h3 className="text-sm font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <Compass size={18} className="text-blue-500" /> Red Seal Module Directory
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-orange-100 dark:bg-slate-900 text-orange-500 border border-orange-200 dark:border-slate-800 shrink-0">
              <Flame size={20} strokeWidth={2.5} />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">Cram Mode</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">High-velocity speed round of rapid-fire questions to aggressively prep your short-term memory.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-slate-900 text-emerald-500 border border-emerald-200 dark:border-slate-800 shrink-0">
              <Award size={20} strokeWidth={2.5} />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">Exam Practice</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">Targeted practice quizzes broken down by specific Red Seal block competencies and sub-tasks.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-slate-900 text-purple-500 border border-purple-200 dark:border-slate-800 shrink-0">
              <Award size={20} strokeWidth={2.5} />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">Exam Simulator</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">A full-length, timed mock exam designed to replicate the exact conditions of the official Red Seal.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-yellow-100 dark:bg-slate-900 text-yellow-500 border border-yellow-200 dark:border-slate-800 shrink-0">
              <Zap size={20} strokeWidth={2.5} />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">Flashcards</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">Spaced-repetition memory deck utilizing the Leitner system for optimal retention.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-cyan-100 dark:bg-slate-900 text-cyan-500 border border-cyan-200 dark:border-slate-800 shrink-0">
              <Wrench size={20} strokeWidth={2.5} />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">Structural Specifics</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">Quick-reference cheat sheets for the National Building Code spanning tables and structural metrics.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-indigo-100 dark:bg-slate-900 text-indigo-500 border border-indigo-200 dark:border-slate-800 shrink-0">
              <Compass size={20} strokeWidth={2.5} />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">Blueprint Trainer</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">Interactive tool for studying architectural plans, elevations, section details, and specifications.</p>
            </div>
          </div>
        </div>
      </div>

      {/* COLLAPSIBLE GETTING STARTED ORIENTATION */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900/40">
        <button
          onClick={() => setIsOrientationOpen(!isOrientationOpen)}
          className="w-full flex items-center justify-between p-4 text-left font-mono font-black text-xs md:text-sm uppercase tracking-wider text-slate-900 dark:text-white cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors"
        >
          <span className="flex items-center gap-2">
            <span>📚</span> GETTING STARTED ORIENTATION
          </span>
          <span className="text-xs text-slate-500 font-bold flex items-center gap-1.5">
            <span>{isOrientationOpen ? 'COLLAPSE' : 'EXPAND'}</span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOrientationOpen ? 'rotate-180' : ''}`} />
          </span>
        </button>
        {isOrientationOpen && (
          <div className="p-5 border-t border-slate-200 dark:border-slate-800 animate-fadeIn">
            <OrientationHub 
              compact={!isNewUser}
              onLaunchCramMode={() => {
                setIsCramMode(true)
                handleNav('cram')
              }}
              onOpenCalculators={() => handleNav('toolbox')}
              onAwardXP={(xp) => setUserXP(prev => prev + xp)}
              userXP={userXP}
              checkedTerms={glossaryChecklist}
              onToggleTerm={handleToggleChecklist}
            />
          </div>
        )}
      </div>

    </div>
  )
}
