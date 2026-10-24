import React, { useContext, useState, useMemo } from 'react'
import { AppContext } from '../../App'
import { 
  Clock, 
  History, 
  Award, 
  AlertTriangle, 
  CheckCircle, 
  Bookmark, 
  Flame, 
  ChevronRight, 
  X, 
  Trash2, 
  RefreshCw,
  HelpCircle,
  ExternalLink
} from 'lucide-react'
import questionsData from '../../data/RedSeal/questions.json'

export default function QuizHistory() {
  const { 
    quizHistory, 
    setQuizHistory, 
    bookmarks, 
    toggleBookmark, 
    pushToNailIt,
    nailItDeck,
    setActiveTab,
    setCustomQuizQuestions
  } = useContext(AppContext)

  const [selectedAttempt, setSelectedAttempt] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')

  // 1. Calculate general stats
  const stats = useMemo(() => {
    const history = quizHistory || []
    const total = history.length
    if (total === 0) {
      return { total: 0, avgScore: 0, passRate: 0, highestScore: 0 }
    }

    const completedWithScores = history.filter(h => h && h.total > 0)
    if (completedWithScores.length === 0) {
      return { total, avgScore: 0, passRate: 0, highestScore: 0 }
    }

    const scorePercentages = completedWithScores.map(h => ((h.score || 0) / h.total) * 100)
    const avgScore = Math.round(scorePercentages.reduce((sum, p) => sum + p, 0) / completedWithScores.length)
    const passes = completedWithScores.filter(h => ((h.score || 0) / h.total) >= 0.7).length
    const passRate = Math.round((passes / completedWithScores.length) * 100)
    const highestScore = Math.round(Math.max(...scorePercentages))

    return { total, avgScore, passRate, highestScore }
  }, [quizHistory])

  // Delete an individual attempt
  const handleDeleteAttempt = (id, e) => {
    e.stopPropagation()
    setQuizHistory(prev => (prev || []).filter(item => item && item.id !== id))
    showToast('Attempt record deleted.')
  }

  // Clear all attempts
  const handleClearAllHistory = () => {
    if (window.confirm('Are you sure you want to clear your entire attempt history? This cannot be undone.')) {
      setQuizHistory([])
      showToast('All attempt history cleared.')
    }
  }

  // Helper toast notification
  const showToast = (msg) => {
    setSuccessMessage(msg)
    setTimeout(() => setSuccessMessage(''), 3000)
  }

  // Launch a practice session with the missed questions of an attempt
  const handlePracticeMissedQuestions = (attempt) => {
    if (!attempt.incorrectQuestions || attempt.incorrectQuestions.length === 0) return
    
    // Set custom questions in App context
    setCustomQuizQuestions(attempt.incorrectQuestions)
    setActiveTab('quiz')
  }

  // Get question objects for a list of incorrect question IDs
  const getQuestionDetails = (ids) => {
    if (!ids) return []
    return questionsData.filter(q => ids.includes(q.id))
  }

  return (
    <div className="space-y-6">
      {/* SUCCESS TOAST */}
      {successMessage && (
        <div className="fixed bottom-4 right-4 z-50 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-3 rounded-xl shadow-xl border border-slate-700 dark:border-slate-200 animate-slideUp flex items-center space-x-2 text-xs font-black">
          <span className="text-emerald-500">✓</span>
          <span>{successMessage}</span>
        </div>
      )}

      {/* HERO SECTION */}
      <div className="bg-gradient-to-r from-brand-600 to-brand-700 text-white rounded-2xl p-6 md:p-8 shadow-md">
        <div className="flex items-center space-x-3 mb-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <History size={28} className="text-white" />
          </div>
          <span className="text-xs uppercase font-extrabold tracking-widest text-brand-100 bg-brand-800/40 px-2.5 py-1 rounded-full">
            Performance Logger
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight">Quiz Attempt History</h2>
        <p className="text-sm md:text-base text-brand-100 max-w-2xl mt-2 leading-relaxed">
          Track your progress towards the 70% passing threshold. Review detailed building code references for missed questions to target and eliminate weak spots.
        </p>
      </div>

      {/* STATS OVERVIEW WIDGET */}
      {quizHistory.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <span className="text-[10px] font-black uppercase text-slate-400">Total Attempts</span>
            <div className="mt-2 flex items-baseline space-x-1.5">
              <span className="text-2xl font-black text-slate-800 dark:text-white">{stats.total}</span>
              <span className="text-xs font-bold text-slate-400">Quizzes</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <span className="text-[10px] font-black uppercase text-slate-400">Average Grade</span>
            <div className="mt-2 flex items-baseline space-x-1.5">
              <span className={`text-2xl font-black ${stats.avgScore >= 70 ? 'text-emerald-500' : 'text-amber-500'}`}>
                {stats.avgScore}%
              </span>
              <span className="text-[10px] font-bold text-slate-400">Mean Score</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <span className="text-[10px] font-black uppercase text-slate-400">Sim Pass Rate</span>
            <div className="mt-2 flex items-baseline space-x-1.5">
              <span className={`text-2xl font-black ${stats.passRate >= 75 ? 'text-emerald-500' : 'text-brand-500'}`}>
                {stats.passRate}%
              </span>
              <span className="text-xs font-bold text-slate-400">≥70% Grade</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <span className="text-[10px] font-black uppercase text-slate-400">Peak Performance</span>
            <div className="mt-2 flex items-baseline space-x-1.5">
              <span className="text-2xl font-black text-emerald-500">{stats.highestScore}%</span>
              <span className="text-xs font-bold text-slate-400">Highest Score</span>
            </div>
          </div>
        </div>
      )}

      {/* QUIZ LOG LISTING */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Clock size={18} className="text-brand-500" />
            <h3 className="font-black uppercase tracking-tight text-slate-800 dark:text-white text-xs">Past Attempts Log</h3>
          </div>
          {quizHistory.length > 0 && (
            <button
              onClick={handleClearAllHistory}
              className="text-[10px] font-bold text-red-500 hover:text-red-600 dark:hover:text-red-400 transition-colors flex items-center gap-1 py-1 px-2 rounded hover:bg-red-50 dark:hover:bg-red-950/25 min-h-[32px]"
            >
              <Trash2 size={12} />
              <span>Wipe History</span>
            </button>
          )}
        </div>

        {quizHistory.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-full w-fit mx-auto text-slate-400">
              <History size={36} />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No past quiz results found</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                Complete a **Practice session** or **Exam Simulator** on the Quiz Engine page to automatically record metrics here.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('quiz')}
              className="bg-brand-500 hover:bg-brand-600 text-white text-xs font-black px-4 py-2 rounded-xl shadow-sm transition-all min-h-[40px]"
            >
              Launch Quiz Engine
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {quizHistory.map((item) => {
              const percentage = Math.round((item.score / item.total) * 100)
              const passed = percentage >= 70
              const hasIncorrect = item.incorrectQuestions && item.incorrectQuestions.length > 0

              return (
                <div 
                  key={item.id}
                  className="p-5 hover:bg-slate-50/50 dark:hover:bg-slate-850/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  {/* Left Column: Title & metadata */}
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${
                        item.mode.includes('Exam')
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                      }`}>
                        {item.mode}
                      </span>
                      <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded font-bold">
                        {item.block}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-bold flex items-center space-x-1 flex-wrap">
                      <span>{new Date(item.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
                      <span>•</span>
                      <span>{new Date(item.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</span>
                      {item.timeTaken !== undefined && (
                        <>
                          <span>•</span>
                          <span className="text-amber-600 dark:text-amber-400 font-black">
                            ⏱️ {Math.floor(item.timeTaken / 60)}m {item.timeTaken % 60}s
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Middle Column: Score percentage and status tag */}
                  <div className="flex items-center space-x-4 md:mx-auto">
                    <div className="space-y-1">
                      <div className="flex items-baseline space-x-1">
                        <span className="text-base font-black text-slate-800 dark:text-white">
                          {item.score} / {item.total}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold">Correct</span>
                      </div>
                      
                      {/* Visual score bar */}
                      <div className="w-24 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${passed ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>

                    <div className={`px-2.5 py-1 rounded-lg flex items-center space-x-1 ${
                      passed 
                        ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200/30' 
                        : 'bg-amber-50 dark:bg-amber-950/20 text-amber-500 dark:text-amber-400 border border-amber-200/30'
                    }`}>
                      {passed ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
                      <span className="text-xs font-black">{percentage}% {passed ? 'PASS' : 'FAIL'}</span>
                    </div>
                  </div>

                  {/* Right Column: Actions */}
                  <div className="flex items-center space-x-2 flex-wrap sm:flex-nowrap">
                    {hasIncorrect ? (
                      <>
                        <button
                          onClick={() => setSelectedAttempt(item)}
                          className="flex-1 sm:flex-initial text-xs font-black bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/30 dark:hover:bg-brand-900/30 text-brand-600 dark:text-brand-400 px-3 py-2 rounded-xl border border-brand-200/40 transition-colors text-center min-h-[38px] flex items-center justify-center gap-1.5"
                        >
                          <span>Review Missed</span>
                        </button>

                        <button
                          onClick={() => handlePracticeMissedQuestions(item)}
                          className="flex-1 sm:flex-initial text-xs font-black bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors text-center min-h-[38px] flex items-center justify-center gap-1.5"
                          title="Re-run a custom practice session using only the questions missed in this attempt."
                        >
                          <RefreshCw size={12} />
                          <span>Practice Missed</span>
                        </button>
                      </>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-50 dark:bg-slate-850 px-2.5 py-2 rounded-xl text-center flex-1 sm:flex-initial">
                        Perfect Score! 🌟
                      </span>
                    )}

                    <button
                      onClick={(e) => handleDeleteAttempt(item.id, e)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors min-h-[38px] min-w-[38px] flex items-center justify-center border border-transparent hover:border-red-200/30"
                      title="Delete attempt record"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* MISSED QUESTIONS OVERLAY / DIALOG */}
      {selectedAttempt && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[85vh] animate-scaleUp">
            
            {/* Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">📊</span>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
                    Review Missed Questions
                  </h3>
                </div>
                <p className="text-xs text-slate-400 font-bold">
                  {selectedAttempt.mode} on {new Date(selectedAttempt.date).toLocaleDateString()} • {selectedAttempt.score}/{selectedAttempt.total} Correct
                </p>
              </div>
              <button 
                onClick={() => setSelectedAttempt(null)}
                className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-500 dark:text-slate-400 rounded-full min-h-[40px] min-w-[40px] flex items-center justify-center transition-colors"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Questions Container */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50/50 dark:bg-slate-950/30">
              {getQuestionDetails(selectedAttempt.incorrectQuestions).length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs font-semibold">
                  No reference details saved or questions have been removed from the bank.
                </div>
              ) : (
                getQuestionDetails(selectedAttempt.incorrectQuestions).map((q, index) => {
                  const isSaved = bookmarks.includes(q.id)
                  const isInNailIt = nailItDeck.includes(q.id)

                  return (
                    <div 
                      key={q.id}
                      className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-150 dark:border-slate-800 shadow-sm space-y-4"
                    >
                      {/* Meta information header */}
                      <div className="flex items-center justify-between flex-wrap gap-2 pb-2.5 border-b border-dashed border-slate-100 dark:border-slate-800">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-black text-brand-500 bg-brand-50 dark:bg-brand-950/40 px-2 py-0.5 rounded">
                            {q.block}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase">
                            {q.difficulty}
                          </span>
                        </div>

                        {/* Question Specific Action Shortcuts */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              toggleBookmark(q.id)
                              showToast(isSaved ? 'Bookmark removed.' : 'Question bookmarked!')
                            }}
                            className={`p-1.5 rounded-lg border text-xs transition-colors min-h-[32px] flex items-center gap-1 ${
                              isSaved 
                                ? 'bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-950/20 dark:border-indigo-850 dark:text-indigo-400' 
                                : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                            }`}
                            title="Toggle Bookmark"
                          >
                            <Bookmark size={12} className={isSaved ? 'fill-current' : ''} />
                            <span className="text-[10px] font-bold">{isSaved ? 'Bookmarked' : 'Save'}</span>
                          </button>

                          <button
                            onClick={() => {
                              pushToNailIt(q.id)
                              showToast('Added to Nail It queue.')
                            }}
                            disabled={isInNailIt}
                            className={`p-1.5 rounded-lg border text-xs transition-colors min-h-[32px] flex items-center gap-1 ${
                              isInNailIt 
                                ? 'bg-amber-50 border-amber-200 text-amber-600 dark:bg-amber-950/20 dark:border-amber-850 dark:text-amber-400 cursor-default' 
                                : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:text-amber-500 hover:border-amber-200/40'
                            }`}
                            title="Push to Spaced Repetition queue"
                          >
                            <Flame size={12} className={isInNailIt ? 'fill-current text-amber-500' : ''} />
                            <span className="text-[10px] font-bold">{isInNailIt ? 'Flagged' : 'Flag Weak'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Question Text */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Question {index + 1}</span>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-relaxed">
                          {q.question}
                        </p>
                      </div>

                      {/* Options rendering (static representation) */}
                      <div className="space-y-2">
                        {q.options.map((option, optIdx) => {
                          const isCorrect = optIdx === q.correctOptionIndex
                          
                          return (
                            <div 
                              key={optIdx}
                              className={`p-3 rounded-xl text-xs flex items-center justify-between border ${
                                isCorrect 
                                  ? 'bg-emerald-50/50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900 text-slate-800 dark:text-slate-200' 
                                  : 'bg-slate-50/20 border-slate-100 dark:border-slate-850 text-slate-500 dark:text-slate-400'
                              }`}
                            >
                              <div className="flex items-center space-x-2">
                                <span className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-black ${
                                  isCorrect 
                                    ? 'bg-emerald-500 text-white' 
                                    : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                                }`}>
                                  {String.fromCharCode(65 + optIdx)}
                                </span>
                                <span className={isCorrect ? 'font-bold' : ''}>{option}</span>
                              </div>
                              {isCorrect && (
                                <span className="text-[9px] font-black uppercase text-emerald-500 tracking-wider">Correct Answer</span>
                              )}
                            </div>
                          )
                        })}
                      </div>

                      {/* Explanation Callout */}
                      <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-150 dark:border-slate-800/80 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                            <HelpCircle size={12} className="text-brand-500" />
                            National Building Code Standard Explanation
                          </span>
                          {q.codeReference && (
                            <span className="text-[9px] font-extrabold bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded">
                              {q.codeReference}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-normal font-semibold">
                          {q.explanation}
                        </p>
                      </div>

                    </div>
                  )
                })
              )}
            </div>

            {/* Footer buttons */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end space-x-2">
              <button
                onClick={() => setSelectedAttempt(null)}
                className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 font-extrabold text-xs px-4 py-2 rounded-xl transition-all min-h-[40px]"
              >
                Done Reviewing
              </button>
              <button
                onClick={() => {
                  const items = selectedAttempt.incorrectQuestions || []
                  items.forEach(id => pushToNailIt(id))
                  showToast('All missed questions added to Review Deck!')
                }}
                className="bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs px-4 py-2 rounded-xl transition-all shadow-sm min-h-[40px] flex items-center gap-1"
              >
                <Flame size={14} className="fill-current text-white" />
                <span>Flag All Missed</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}
