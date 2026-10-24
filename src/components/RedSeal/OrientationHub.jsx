import React, { useState, useEffect } from 'react'
import { Zap, Calculator, BookOpen, CheckSquare, Square, Info } from 'lucide-react'

const GLOSSARY_TERMS = [
  { term: "Bridging", definition: "Short pieces of lumber or metal installed diagonally or horizontally between floor joists to distribute loads, prevent twisting, and stiffen the floor system." },
  { term: "Cripple Stud", definition: "A shortened framing member used above or below an opening, such as a window or door, to transfer loads to the sill or header." },
  { term: "Kerf", definition: "The width of the channel or groove cut made by a saw blade. Calculating kerf is critical for precision finish carpentry." },
  { term: "O.C. (On Center)", definition: "The standard measurement of spacing for framing members (studs, joists, rafters), measured from the exact center of one member to the center of the next." },
  { term: "Plumb", definition: "Perfectly vertical. A line or surface that is exactly perpendicular to a level, horizontal plane." },
  { term: "Riser", definition: "The vertical board or face forming the back of a step in a flight of stairs. NBC limits maximum riser height for safety." },
  { term: "Soffit", definition: "The exposed undersurface of any exterior overhead component of a building, most commonly the underside of a roof overhang or eaves." },
  { term: "Underpinning", definition: "The process of strengthening and stabilizing the foundation of an existing building or structure, often required during renovations." }
]

export default function OrientationHub({ 
  onLaunchCramMode, 
  onOpenCalculators, 
  onAwardXP, 
  userXP,
  compact = false,
  checkedTerms: propCheckedTerms,
  onToggleTerm: propOnToggleTerm
}) {
  const [localCheckedTerms, setLocalCheckedTerms] = useState(() => {
    try {
      const saved = localStorage.getItem('red_seal_glossary_checklist')
      return saved ? JSON.parse(saved) : []
    } catch (e) {
      console.error("Failed to parse glossary checklist in onboarding", e)
      return []
    }
  })

  const checkedTerms = (propCheckedTerms !== undefined ? propCheckedTerms : localCheckedTerms) || []

  const [expandedTerm, setExpandedTerm] = useState(null)

  const handleToggleTerm = (term) => {
    if (propOnToggleTerm) {
      propOnToggleTerm(term)
      return
    }

    setLocalCheckedTerms(prev => {
      const current = prev || []
      const isChecked = current.includes(term)
      const updated = isChecked ? current.filter(t => t !== term) : [...current, term]
      try {
        localStorage.setItem('red_seal_glossary_checklist', JSON.stringify(updated))
      } catch (e) {}
      
      // Award XP on complete checklist if not already awarded
      if (updated.length === GLOSSARY_TERMS.length) {
        const bonusAlreadyAwarded = localStorage.getItem('red_seal_onboarding_bonus_awarded') === 'true'
        if (!bonusAlreadyAwarded && onAwardXP) {
          onAwardXP(50)
          try {
            localStorage.setItem('red_seal_onboarding_bonus_awarded', 'true')
          } catch (e) {}
        }
      }
      return updated
    })
  }

  const progressPercent = Math.round(((checkedTerms.length || 0) / GLOSSARY_TERMS.length) * 100)

  // If compact, render a sleek dashboard toolbar widget
  if (compact) {
    return (
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 space-y-4 shadow-sm text-slate-900 dark:text-white">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-200 dark:border-slate-700 pb-3">
          <div className="flex items-center space-x-2">
            <span className="text-xl">📚</span>
            <div>
              <h4 className="font-black uppercase tracking-tight text-slate-950 dark:text-white text-xs">Getting Started Orientation</h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">Review critical Red Seal carpentry terms</p>
            </div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-3 py-1 rounded-xl text-[10px] font-black text-amber-500 dark:text-amber-400 flex items-center gap-1.5 shrink-0 self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-amber-500 dark:bg-amber-400 animate-pulse" />
            <span>{checkedTerms.length} / {GLOSSARY_TERMS.length} Complete ({progressPercent}%)</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {GLOSSARY_TERMS.map((item) => {
            const isChecked = checkedTerms.includes(item.term)
            return (
              <button
                key={item.term}
                onClick={() => handleToggleTerm(item.term)}
                title={item.definition}
                className={`p-3 rounded-xl border text-[11px] font-black uppercase transition-all flex items-center justify-between gap-2 min-h-[44px] text-left select-none ${
                  isChecked 
                    ? 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700/50 text-slate-400 dark:text-slate-500 line-through' 
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-850 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-850'
                }`}
              >
                <span className="truncate">{item.term}</span>
                <span className={isChecked ? "text-amber-500 dark:text-amber-400 font-extrabold text-sm shrink-0" : "text-slate-400 dark:text-slate-600 text-sm shrink-0"}>
                  {isChecked ? "✓" : "○"}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-md dark:shadow-2xl relative overflow-hidden space-y-6 text-slate-900 dark:text-white">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-slate-200 dark:via-slate-900 to-amber-500" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="bg-amber-500 text-slate-950 text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full tracking-wider">
            Highly Recommended: Day 1 Orientation
          </span>
          <h2 className="text-2xl font-black text-slate-950 dark:text-white uppercase tracking-tight mt-1">
            Welcome to the Jobsite, Apprentice!
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 font-medium max-w-xl">
            Complete your first-day onboarding checklist by reviewing the 8 most critical Red Seal terms to unlock a <strong className="text-amber-500 dark:text-amber-400 font-black">+50 XP bonus</strong>.
          </p>
        </div>
        <div className="bg-slate-50 dark:bg-slate-900 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-center shrink-0 min-w-[140px] flex flex-col justify-center items-center">
          <span className="text-[10px] text-slate-400 font-black uppercase block">Orientation progress</span>
          <span className="text-xl font-black text-amber-500 dark:text-amber-400 block mt-0.5">{checkedTerms.length} / {GLOSSARY_TERMS.length}</span>
          <div className="w-24 bg-slate-200 dark:bg-slate-850 h-1.5 rounded-full mt-1.5 overflow-hidden p-0.5 border border-slate-300 dark:border-slate-800">
            <div className="bg-amber-500 dark:bg-amber-400 h-full rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-3">
        {/* GLOSSARY CHECKLIST PANEL */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase text-slate-700 dark:text-slate-300 tracking-wider flex items-center gap-1.5">
            <BookOpen size={14} className="text-amber-500 dark:text-amber-400" />
            <span>Critical Red Seal Terms Onboarding Checklist</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 max-h-[350px] overflow-y-auto pr-1">
            {GLOSSARY_TERMS.map((item) => {
              const isChecked = checkedTerms.includes(item.term)
              const isExpanded = expandedTerm === item.term
              return (
                <div 
                  key={item.term}
                  className={`p-3 rounded-xl border transition-all ${
                    isChecked 
                      ? 'bg-slate-50/60 dark:bg-slate-900/40 border-slate-150 dark:border-slate-800/85 text-slate-400 dark:text-slate-500' 
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:border-slate-400 dark:hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-start gap-3 justify-between">
                    <div 
                      onClick={() => handleToggleTerm(item.term)}
                      className="flex items-start gap-3 cursor-pointer select-none flex-1"
                    >
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center border shrink-0 mt-0.5 transition-all ${
                        isChecked 
                          ? 'bg-amber-500 border-amber-500 text-slate-950 font-black' 
                          : 'border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-950'
                      }`}>
                        {isChecked && <span className="text-[11px] font-black">✓</span>}
                      </div>
                      <p className={`text-xs font-black uppercase tracking-wide ${isChecked ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white'}`}>
                        {item.term}
                      </p>
                    </div>

                    <button
                      onClick={() => setExpandedTerm(isExpanded ? null : item.term)}
                      className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                      aria-label="Toggle details"
                    >
                      <Info size={14} />
                    </button>
                  </div>
                  
                  {/* Definition / Description always shown, but styled beautifully */}
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium leading-relaxed pl-8 mt-1">
                    {item.definition}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
