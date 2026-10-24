import React, { useContext, useState, useMemo } from 'react'
import { AppContext } from '../../App'
import { 
  X, 
  TrendingUp, 
  Clock, 
  Award, 
  Zap, 
  Settings, 
  Trophy, 
  Shield, 
  Hammer, 
  Wrench, 
  Calendar,
  Save,
  RotateCcw,
  CheckCircle2,
  Trash2,
  UserCheck
} from 'lucide-react'
import questionsData from '../../data/RedSeal/questions.json'

export default function ProfileDrawer({ isOpen, onClose }) {
  const { 
    quizHistory, 
    bookmarks, 
    nailItDeck, 
    flashcardReviews,
    autoSave,
    setAutoSave,
    manualSave,
    resetAllData,
    userXP,
    setUserXP,
    setCustomQuizQuestions,
    setActiveTab
  } = useContext(AppContext)

  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [saveStatus, setSaveStatus] = useState('idle') // 'idle' | 'saving' | 'saved'
  const [selectedDateString, setSelectedDateString] = useState(null)

  // 1. Calculate Rank Info
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

  const renderRankIcon = (iconName, size = 20, className = "") => {
    switch(iconName) {
      case 'Wrench': return <Wrench size={size} className={className} />
      case 'Hammer': return <Hammer size={size} className={className} />
      case 'Shield': return <Shield size={size} className={className} />
      case 'Award': return <Award size={size} className={className} />
      case 'Trophy': return <Trophy size={size} className={className} />
      default: return <Award size={size} className={className} />
    }
  }

  // 2. RSOS Blocks definition
  const blocks = [
    { id: 'Block A', title: 'Common Occupational Skills', weight: '11%', desc: 'Safety, tools, equipment, and access scaffolds.' },
    { id: 'Block B', title: 'Planning and Layout', weight: '9%', desc: 'Drawings, specifications, material takeoff, and layout.' },
    { id: 'Block C', title: 'Concrete Formwork', weight: '14%', desc: 'Footings, walls, columns, stairs, and reinforcement.' },
    { id: 'Block D', title: 'Framing', weight: '28%', desc: 'Floor, wall, roof, and stair framing (high importance).' },
    { id: 'Block E', title: 'Exterior Finish', weight: '14%', desc: 'Siding, roofing, exterior doors, and windows.' },
    { id: 'Block F', title: 'Interior Finish', weight: '13%', desc: 'Drywall, cabinet installation, trim, and doors.' },
    { id: 'Block G', title: 'Renovations', weight: '11%', desc: 'Demolition, shoring, underpinning, and tie-ins.' }
  ]

  // 3. Calculate Core Stats
  const stats = useMemo(() => {
    const history = quizHistory || []
    const totalQuizzes = history.length
    const averageScore = totalQuizzes > 0 
      ? Math.round((history.reduce((sum, item) => sum + (item && item.total > 0 ? (item.score / item.total) : 0), 0) / totalQuizzes) * 100)
      : 0
    const examAttempts = history.filter(h => h && (h.mode === 'exam' || h.mode === 'Official Mock')).length
    const examsPassed = history.filter(h => h && h.total > 0 && (h.mode === 'exam' || h.mode === 'Official Mock') && (h.score / h.total) >= 0.7).length
    const examPassRate = examAttempts > 0 ? Math.round((examsPassed / examAttempts) * 100) : 0
    return { totalQuizzes, averageScore, examAttempts, examPassRate }
  }, [quizHistory])

  // 4. Calculate Block Proficiency
  const blockProficiency = useMemo(() => {
    const proficiency = {}
    const list = blocks || []
    list.forEach(b => {
      proficiency[b.id] = 0 
    })

    const history = quizHistory || []
    history.forEach(item => {
      if (!item || !(item.total > 0)) return
      const percentage = (item.score / item.total) * 100
      if (item.block === 'All Blocks') {
        list.forEach(b => {
          proficiency[b.id] = Math.min(100, Math.max(0, Math.round((proficiency[b.id] + percentage) / 2)))
        })
      } else if (proficiency[item.block] !== undefined) {
        proficiency[item.block] = Math.min(100, Math.max(0, Math.round((proficiency[item.block] + percentage) / 2)))
      }
    })

    return proficiency
  }, [quizHistory])

  // 5. Generate Heatmap Data
  const heatmapData = useMemo(() => {
    const days = []
    const today = new Date()
    today.setHours(23, 59, 59, 999)

    for (let i = 29; i >= 0; i--) {
      const d = new Date()
      d.setDate(today.getDate() - i)
      d.setHours(0, 0, 0, 0)
      days.push({
        date: d,
        dateString: d.toISOString().split('T')[0],
        count: 0,
        quizzes: []
      })
    }

    const history = quizHistory || []
    history.forEach(item => {
      if (!item || !item.date) return
      try {
        const itemDate = new Date(item.date)
        const itemDateStr = itemDate.toISOString().split('T')[0]
        const match = days.find(day => day.dateString === itemDateStr)
        if (match) {
          match.count++
          match.quizzes.push(item)
        }
      } catch (e) {
        console.error("Error parsing history date:", e)
      }
    })

    if (days.length > 0) {
      const startOfWeekTime = days[0].date
      const startDayOfWeek = startOfWeekTime.getDay()
      days.forEach((day) => {
        const diffDays = Math.floor((day.date - startOfWeekTime) / (1000 * 60 * 60 * 24))
        const totalDaysFromStartCol = diffDays + startDayOfWeek
        day.column = Math.floor(totalDaysFromStartCol / 7)
        day.row = day.date.getDay()
      })
    }

    return days
  }, [quizHistory])

  const monthLabels = useMemo(() => {
    const labels = []
    const seenMonths = new Set()
    heatmapData.forEach(day => {
      const monthStr = day.date.toLocaleDateString(undefined, { month: 'short' })
      if (!seenMonths.has(monthStr)) {
        seenMonths.add(monthStr)
        labels.push({
          text: monthStr,
          column: day.column
        })
      }
    })
    return labels
  }, [heatmapData])

  const defaultSelectedDay = useMemo(() => {
    const activeDays = [...heatmapData].reverse().filter(d => d.count > 0)
    return activeDays.length > 0 ? activeDays[0] : heatmapData[heatmapData.length - 1]
  }, [heatmapData])

  const activeSelectedDay = useMemo(() => {
    if (selectedDateString) {
      return heatmapData.find(d => d.dateString === selectedDateString) || defaultSelectedDay
    }
    return defaultSelectedDay
  }, [selectedDateString, heatmapData, defaultSelectedDay])

  // 6. Difficulty Stats
  const difficultyStats = useMemo(() => {
    const statsObj = {
      Beginner: { correct: 0, incorrect: 0, totalAttempted: 0, bankCount: 0 },
      Intermediate: { correct: 0, incorrect: 0, totalAttempted: 0, bankCount: 0 },
      Advanced: { correct: 0, incorrect: 0, totalAttempted: 0, bankCount: 0 }
    }

    questionsData.forEach(q => {
      const diff = q.difficulty || 'Beginner'
      if (statsObj[diff]) {
        statsObj[diff].bankCount++
      }
    })

    const historyArray = quizHistory || []
    historyArray.forEach(history => {
      if (!history) return
      const incorrectSet = new Set(history.incorrectQuestions || [])
      
      if (history.questionIds && history.questionIds.length > 0) {
        history.questionIds.forEach(id => {
          const q = questionsData.find(quest => quest.id === id)
          if (q) {
            const diff = q.difficulty || 'Beginner'
            if (statsObj[diff]) {
              statsObj[diff].totalAttempted++
              if (incorrectSet.has(id)) {
                statsObj[diff].incorrect++
              } else {
                statsObj[diff].correct++
              }
            }
          }
        })
      } else if (history.incorrectQuestions && history.incorrectQuestions.length > 0) {
        const blockQuestions = questionsData.filter(q => history.block === 'All Blocks' || q.block === history.block)
        const possibleCorrect = blockQuestions.filter(q => !incorrectSet.has(q.id))
        const correctCount = Math.max(0, history.score)
        const chosenCorrect = possibleCorrect.slice(0, correctCount)
        
        history.incorrectQuestions.forEach(id => {
          const q = questionsData.find(quest => quest.id === id)
          if (q) {
            const diff = q.difficulty || 'Beginner'
            if (statsObj[diff]) {
              statsObj[diff].totalAttempted++
              statsObj[diff].incorrect++
            }
          }
        })

        chosenCorrect.forEach(q => {
          const diff = q.difficulty || 'Beginner'
          if (statsObj[diff]) {
            statsObj[diff].totalAttempted++
            statsObj[diff].correct++
          }
        })
      }
    })

    const levels = ['Beginner', 'Intermediate', 'Advanced']
    return levels.map(level => {
      const data = statsObj[level]
      const accuracy = data.totalAttempted > 0 
        ? Math.round((data.correct / data.totalAttempted) * 100) 
        : 0
      
      let statusLabel = 'NO DATA'
      let statusColor = 'text-slate-400 bg-slate-800 border border-slate-700'
      let ringColor = 'stroke-slate-700'
      let textColor = 'text-slate-400'

      if (data.totalAttempted > 0) {
        if (accuracy >= 85) {
          statusLabel = 'EXCELLENT'
          statusColor = 'text-emerald-400 bg-emerald-950/40 border border-emerald-500/20'
          ringColor = 'stroke-emerald-500'
          textColor = 'text-emerald-400'
        } else if (accuracy >= 70) {
          statusLabel = 'STABLE'
          statusColor = 'text-indigo-400 bg-indigo-950/40 border border-indigo-500/20'
          ringColor = 'stroke-indigo-500'
          textColor = 'text-indigo-400'
        } else if (accuracy >= 50) {
          statusLabel = 'GROWING'
          statusColor = 'text-amber-400 bg-amber-950/40 border border-amber-500/20'
          ringColor = 'stroke-amber-500'
          textColor = 'text-amber-400'
        } else {
          statusLabel = 'NEEDS FOCUS'
          statusColor = 'text-rose-400 bg-rose-950/40 border border-rose-500/20'
          ringColor = 'stroke-rose-500'
          textColor = 'text-rose-400'
        }
      }

      return {
        level,
        ...data,
        accuracy,
        statusLabel,
        statusColor,
        ringColor,
        textColor
      }
    })
  }, [quizHistory])

  if (!isOpen) return null

  const getHeatmapColor = (count) => {
    if (count === 0) return 'fill-slate-800 hover:stroke-slate-700'
    if (count === 1) return 'fill-brand-900/60 hover:stroke-brand-300'
    if (count === 2) return 'fill-brand-800 hover:stroke-brand-500'
    if (count === 3) return 'fill-brand-600 hover:stroke-brand-400'
    return 'fill-brand-400 hover:stroke-brand-300'
  }

  const dayIncorrectQuestions = (() => {
    if (!activeSelectedDay || !activeSelectedDay.quizzes) return []
    const ids = []
    activeSelectedDay.quizzes.forEach(quiz => {
      if (quiz.incorrectQuestions) {
        quiz.incorrectQuestions.forEach(id => {
          if (!ids.includes(id)) {
            ids.push(id)
          }
        })
      }
    })
    return ids
  })()

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Body */}
      <div className="relative w-full max-w-2xl h-full bg-slate-900 border-l border-slate-800 text-slate-100 flex flex-col shadow-2xl animate-slideOver overflow-y-auto">
        
        {/* Drawer Header */}
        <div className="sticky top-0 bg-slate-900 border-b border-slate-800 p-5 flex justify-between items-center z-10">
          <div className="flex items-center space-x-2.5">
            <span className="text-xl">🪓</span>
            <div>
              <h2 className="text-lg font-black uppercase tracking-tight text-white">Apprentice Record</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Official RSOS Progression Profile</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-slate-800 hover:bg-slate-750 rounded-full text-slate-400 hover:text-white transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
            aria-label="Close drawer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 space-y-8 flex-1">
          
          {/* PROFILE AVATAR & RANK COMPONENT */}
          <div className="bg-slate-850 p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-2xl bg-brand-600 border border-brand-500 flex items-center justify-center text-3xl shadow-inner shadow-black/20">
                🪵
              </div>
              <div className="space-y-1">
                <span className="bg-brand-500/10 text-brand-400 text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full border border-brand-500/20">
                  Registered Study Account
                </span>
                <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
                  Apprentice #42820
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold">
                  {renderRankIcon(currentRankInfo.icon, 14)}
                  <span>{currentRankInfo.name}</span>
                </div>
              </div>
            </div>

            {/* Rank XP Details */}
            <div className="space-y-2 pt-2 border-t border-slate-800/60">
              <div className="flex justify-between text-xs font-black uppercase tracking-wider text-slate-300">
                <span>XP Progress</span>
                <span className="text-brand-400 font-black">{userXP} XP</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden p-0.5 border border-slate-800">
                <div 
                  className="bg-gradient-to-r from-amber-400 to-amber-300 h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${currentRankInfo.progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-bold text-slate-400">
                <span>{currentRankInfo.min} XP</span>
                {currentRankInfo.nextMin !== null ? (
                  <span>Need {currentRankInfo.xpNeeded} XP for next rank</span>
                ) : (
                  <span className="text-emerald-400 font-black uppercase">Max Rank Reached!</span>
                )}
                <span>{currentRankInfo.nextMin !== null ? currentRankInfo.max : '∞'} XP</span>
              </div>
            </div>
          </div>

          {/* PERFORMANCE HISTORIC METRICS CARD */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <TrendingUp size={14} className="text-brand-500" />
              <span>Diagnostic Assessment Report</span>
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-850 p-4 rounded-xl border border-slate-800">
                <p className="text-[10px] text-slate-400 font-black uppercase">Tests Completed</p>
                <p className="text-2xl font-black text-white mt-1">{stats.totalQuizzes}</p>
                <p className="text-[9px] text-slate-500 font-bold mt-0.5">Practice runs & exams</p>
              </div>
              <div className="bg-slate-850 p-4 rounded-xl border border-slate-800">
                <p className="text-[10px] text-slate-400 font-black uppercase">Average Accuracy</p>
                <p className="text-2xl font-black text-amber-400 mt-1">{stats.averageScore}%</p>
                <p className="text-[9px] text-slate-500 font-bold mt-0.5">Correct response ratio</p>
              </div>
              <div className="bg-slate-850 p-4 rounded-xl border border-slate-800">
                <p className="text-[10px] text-slate-400 font-black uppercase">Simulator Runs</p>
                <p className="text-2xl font-black text-indigo-400 mt-1">{stats.examAttempts}</p>
                <p className="text-[9px] text-slate-500 font-bold mt-0.5">Simulated exam sittings</p>
              </div>
              <div className="bg-slate-850 p-4 rounded-xl border border-slate-800">
                <p className="text-[10px] text-slate-400 font-black uppercase">Mock Pass Rate</p>
                <p className="text-2xl font-black text-emerald-400 mt-1">{stats.examPassRate}%</p>
                <p className="text-[9px] text-slate-500 font-bold mt-0.5">Sittings scoring ≥70%</p>
              </div>
            </div>
          </div>

          {/* STUDY CONSISTENCY HEATMAP */}
          <div className="bg-slate-850 p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Calendar size={16} className="text-brand-400" />
                <div>
                  <h4 className="font-black uppercase tracking-tight text-white text-xs">Study Heatmap</h4>
                  <p className="text-[9px] text-slate-400 font-bold">Preparation frequency over the last 30 days</p>
                </div>
              </div>
              <div className="bg-brand-500/10 text-brand-400 px-2.5 py-1 rounded-xl border border-brand-500/20 text-[10px] font-black w-fit shrink-0">
                {heatmapData.filter(d => d.count > 0).length} / 30 Days Active
              </div>
            </div>

            <div className="flex flex-col items-center sm:items-start space-y-3 pt-1">
              <div className="overflow-x-auto w-full max-w-full pb-1">
                <svg viewBox="0 0 235 230" className="w-48 h-auto mx-auto sm:mx-0 select-none">
                  {/* Month Labels */}
                  {monthLabels.map((label, idx) => (
                    <text 
                      key={idx}
                      x={40 + label.column * 30}
                      y={12}
                      className="text-[9px] font-black fill-slate-500 uppercase tracking-wider"
                    >
                      {label.text}
                    </text>
                  ))}

                  <text x={0} y={62} className="text-[9px] font-black fill-slate-500 uppercase">Mon</text>
                  <text x={0} y={122} className="text-[9px] font-black fill-slate-500 uppercase">Wed</text>
                  <text x={0} y={182} className="text-[9px] font-black fill-slate-500 uppercase">Fri</text>

                  {heatmapData.map((day) => {
                    const isSelected = day.dateString === activeSelectedDay?.dateString
                    return (
                      <rect
                        key={day.dateString}
                        x={40 + day.column * 30}
                        y={20 + day.row * 30}
                        width={24}
                        height={24}
                        rx={5}
                        className={`${getHeatmapColor(day.count)} cursor-pointer transition-all ${
                          isSelected 
                            ? 'stroke-white stroke-2 scale-[1.05] transform origin-center' 
                            : 'stroke-1 stroke-slate-700/45'
                        }`}
                        onClick={() => setSelectedDateString(day.dateString)}
                      >
                        <title>{`${day.date.toLocaleDateString()}: ${day.count} runs`}</title>
                      </rect>
                    )
                  })}
                </svg>
              </div>

              {/* Legend */}
              <div className="w-full flex items-center space-x-1.5 text-[9px] text-slate-500 font-bold justify-center sm:justify-start">
                <span>Less</span>
                <span className="w-3 h-3 rounded bg-slate-800 border border-slate-700" />
                <span className="w-3 h-3 rounded bg-brand-900/60" />
                <span className="w-3 h-3 rounded bg-brand-800" />
                <span className="w-3 h-3 rounded bg-brand-600" />
                <span className="w-3 h-3 rounded bg-brand-400" />
                <span>More</span>
              </div>
            </div>

            {/* Selected Day details */}
            <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
                <span className="text-xs">📅</span>
                <h5 className="font-black uppercase text-[11px] tracking-wider text-slate-300">
                  {activeSelectedDay ? activeSelectedDay.date.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }) : 'Select a Day'}
                </h5>
              </div>

              {activeSelectedDay?.count === 0 ? (
                <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">
                  No practice runs or exams completed on this date. Keep a consistent daily streak!
                </p>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold">
                    <span>Sessions Completed:</span>
                    <span className="font-black text-brand-400">{activeSelectedDay?.count} Runs</span>
                  </div>

                  <div className="space-y-1.5 max-h-[120px] overflow-y-auto pr-1">
                    {activeSelectedDay?.quizzes.map((q, idx) => {
                      const pct = Math.round((q.score / q.total) * 100)
                      return (
                        <div key={idx} className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800 text-[10px] flex justify-between items-center">
                          <div>
                            <p className="font-black text-slate-200">{q.mode}</p>
                            <p className="text-[9px] text-slate-500 font-bold">Block: {q.block}</p>
                          </div>
                          <span className={`font-black px-1.5 py-0.5 rounded ${
                            pct >= 70 ? 'bg-emerald-950/40 text-emerald-400' : 'bg-amber-950/40 text-amber-400'
                          }`}>
                            {q.score}/{q.total} ({pct}%)
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {dayIncorrectQuestions.length > 0 && (
                <button
                  onClick={() => {
                    setCustomQuizQuestions(dayIncorrectQuestions)
                    setActiveTab('quiz')
                    onClose()
                  }}
                  className="w-full bg-brand-500/10 hover:bg-brand-500/20 text-brand-400 font-black text-[11px] py-2 rounded-xl transition-colors text-center border border-brand-500/20 min-h-[40px] flex items-center justify-center gap-1"
                >
                  <Zap size={12} className="fill-current" />
                  <span>Re-practice {dayIncorrectQuestions.length} Missed Questions</span>
                </button>
              )}
            </div>
          </div>

          {/* RSOS BLOCK PROFICIENCY INDEX */}
          <div className="bg-slate-850 p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
              <TrendingUp size={16} className="text-brand-400" />
              <h4 className="font-black uppercase tracking-tight text-white text-xs">RSOS Block Proficiency Index</h4>
            </div>

            <div className="space-y-3.5">
              {blocks.map(b => {
                const score = blockProficiency[b.id] || 0
                let color = 'bg-brand-500'
                if (score >= 80) color = 'bg-emerald-500'
                else if (score < 65) color = 'bg-amber-500'

                return (
                  <div key={b.id} className="space-y-1">
                    <div className="flex justify-between text-[11px] font-bold text-slate-300">
                      <span className="truncate max-w-[70%]">{b.id}: {b.title}</span>
                      <span>{score}% Proficiency</span>
                    </div>
                    <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800/80">
                      <div className={`${color} h-full rounded-full transition-all duration-500`} style={{ width: `${score}%` }}></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* QUESTION DIFFICULTY DISTRIBUTION */}
          <div className="bg-slate-850 p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
              <Award size={16} className="text-brand-400" />
              <div>
                <h4 className="font-black uppercase tracking-tight text-white text-xs">Difficulty Distribution</h4>
                <p className="text-[9px] text-slate-400 font-bold">Analysis of your correct layout rates across question tiers</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {difficultyStats.map((stat) => {
                const radius = 12.5
                const circumference = 2 * Math.PI * radius
                const strokeDashoffset = circumference - (stat.accuracy / 100) * circumference

                return (
                  <div key={stat.level} className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-slate-300 uppercase">{stat.level}</span>
                      <span className={`text-[8px] font-black px-1.5 py-0.5 rounded ${stat.statusColor}`}>
                        {stat.statusLabel}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3">
                      {stat.totalAttempted > 0 ? (
                        <div className="relative w-10 h-10 flex-shrink-0 select-none">
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 32 32">
                            <circle cx="16" cy="16" r={radius} fill="none" className="stroke-slate-800" strokeWidth="3" />
                            <circle
                              cx="16"
                              cy="16"
                              r={radius}
                              fill="none"
                              className={`${stat.ringColor} transition-all duration-500`}
                              strokeWidth="3"
                              strokeDasharray={circumference}
                              strokeDashoffset={strokeDashoffset}
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-[9px] font-black text-slate-300">{stat.accuracy}%</span>
                          </div>
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full border border-dashed border-slate-800 flex items-center justify-center text-slate-600 font-bold text-[10px] select-none">
                          —
                        </div>
                      )}

                      <div className="text-[10px]">
                        {stat.totalAttempted > 0 ? (
                          <p className="font-bold text-slate-300">{stat.correct} / {stat.totalAttempted} Correct</p>
                        ) : (
                          <p className="text-slate-500 font-bold">Unattempted</p>
                        )}
                        <p className="text-[8px] text-slate-500 font-semibold">{stat.bankCount} total in bank</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* SYSTEM, DEVICE DATA & OFFLINE CONTROL */}
          <div className="bg-slate-850 p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
              <Settings size={16} className="text-slate-400" />
              <div>
                <h4 className="font-black uppercase tracking-tight text-white text-xs">System & Device Data</h4>
                <p className="text-[9px] text-slate-400 font-bold">Continuous offline persistence preferences</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Auto-Save Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-black text-slate-200">Continuous Auto-Save</p>
                  <p className="text-[9px] text-slate-400 font-medium">Instantly saves changes to LocalStorage</p>
                </div>
                <button
                  onClick={() => {
                    setAutoSave(!autoSave)
                    setSaveStatus('saved')
                    setTimeout(() => setSaveStatus('idle'), 2000)
                  }}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                    autoSave ? 'bg-brand-500' : 'bg-slate-800 border border-slate-700'
                  }`}
                  aria-label="Toggle auto save"
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      autoSave ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Status Indicator / Manual Trigger */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 pt-3">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${autoSave ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
                  <span className="text-[11px] font-bold text-slate-400">
                    {autoSave ? 'Auto-Save Active' : 'Manual Save Required'}
                  </span>
                </div>

                {!autoSave && (
                  <button
                    onClick={() => {
                      manualSave()
                      setSaveStatus('saving')
                      setTimeout(() => {
                        setSaveStatus('saved')
                        setTimeout(() => setSaveStatus('idle'), 2000)
                      }, 500)
                    }}
                    className="text-[10px] bg-brand-500 hover:bg-brand-600 text-white font-extrabold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 min-h-[32px]"
                  >
                    <Save size={12} />
                    <span>Save State</span>
                  </button>
                )}

                {saveStatus === 'saved' && (
                  <span className="text-[10px] font-bold text-emerald-400 animate-fadeIn flex items-center gap-0.5">
                    ✓ Changes Saved
                  </span>
                )}
                {saveStatus === 'saving' && (
                  <span className="text-[10px] font-bold text-slate-500 animate-pulse">
                    Saving...
                  </span>
                )}
              </div>

              {/* Clear / Reset Profile */}
              <div className="border-t border-slate-800 pt-3">
                {!showResetConfirm ? (
                  <button
                    onClick={() => setShowResetConfirm(true)}
                    className="w-full text-left text-xs text-red-400 hover:text-red-300 font-extrabold flex items-center gap-1.5 py-1.5 transition-colors min-h-[36px]"
                  >
                    <Trash2 size={13} />
                    <span>Start From Scratch...</span>
                  </button>
                ) : (
                  <div className="bg-red-950/20 border border-red-900/30 rounded-xl p-3 space-y-2.5 animate-fadeIn">
                    <p className="text-[10px] font-bold text-red-300 leading-normal">
                      Are you absolutely sure? This will permanently erase your quiz record histories, flashcard spacing, custom block notes, and saved bookmarks.
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          resetAllData()
                          setShowResetConfirm(false)
                          setSaveStatus('saved')
                          setTimeout(() => {
                            setSaveStatus('idle')
                            window.location.reload()
                          }, 1500)
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-[10px] px-2.5 py-1.5 rounded-lg transition-colors flex-1 text-center min-h-[32px]"
                      >
                        Yes, Wipe Everything
                      </button>
                      <button
                        onClick={() => setShowResetConfirm(false)}
                        className="bg-slate-800 hover:bg-slate-750 text-slate-300 font-extrabold text-[10px] px-2.5 py-1.5 rounded-lg transition-colors flex-1 text-center min-h-[32px]"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
