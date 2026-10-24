import React, { useState, useEffect } from 'react'
import { X, Trash2, ClipboardCheck, ArrowRight, Clock, FileText } from 'lucide-react'

export default function RecentLogsDrawer({ isOpen, onClose, setCalculatorSubTab, setActiveTab }) {
  const [history, setHistory] = useState([])

  const loadHistory = () => {
    try {
      const stored = localStorage.getItem('builderHub_history')
      if (stored) {
        setHistory(JSON.parse(stored))
      } else {
        setHistory([])
      }
    } catch (e) {
      console.error('Failed to load logs:', e)
    }
  }

  useEffect(() => {
    if (isOpen) {
      loadHistory()
    }
  }, [isOpen])

  useEffect(() => {
    window.addEventListener('builderHub_history_updated', loadHistory)
    return () => {
      window.removeEventListener('builderHub_history_updated', loadHistory)
    }
  }, [])

  const handleClearLogs = () => {
    if (confirm('Are you sure you want to clear your calculation log history?')) {
      localStorage.removeItem('builderHub_history')
      setHistory([])
      window.dispatchEvent(new Event('builderHub_history_updated'))
    }
  }

  const handleLoadSpec = (log) => {
    localStorage.setItem('builderHub_active_hydration', JSON.stringify(log))
    
    // Determine the corresponding sub-tab
    let subTab = 'stair'
    if (log.toolName === 'Stairs') subTab = 'stair'
    else if (log.toolName === 'Squaring') subTab = 'squaring'
    else if (log.toolName === 'Rafters') subTab = 'rafters'
    else if (log.toolName === 'Decking') subTab = 'decking'
    else if (log.toolName === 'OC Master') subTab = 'ocMaster'
    else if (log.toolName === 'Rake Wall') subTab = 'rakeWalls'
    else if (log.toolName === 'Span Master') subTab = 'spanMaster'

    setCalculatorSubTab(subTab)
    setActiveTab('jobsite-toolbox')
    
    // Trigger custom hydration event
    window.dispatchEvent(new Event('builderHub_hydrate_state'))
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-mono">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity animate-fade-in"
      />

      <div className="absolute inset-y-0 right-0 pl-10 max-w-full flex">
        <div className="w-screen max-w-md bg-slate-950 border-l border-slate-800 shadow-2xl flex flex-col text-white animate-slide-in">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-800/80 flex items-center justify-between shrink-0 bg-slate-900/60">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                <h2 className="text-sm font-black uppercase tracking-wider text-slate-100">ON-SITE LAYOUT LOGS</h2>
              </div>
              <p className="text-[10px] text-slate-500 font-bold mt-0.5 uppercase tracking-wide">
                Auto-saved offline specifications (Max 10)
              </p>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Logs List Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {history.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="p-4 bg-slate-900/50 rounded-full border border-slate-800">
                  <Clock className="w-8 h-8 text-slate-600 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-300 uppercase tracking-widest">No Active Layout Specs</h4>
                  <p className="text-[10px] text-slate-500 font-bold max-w-[240px] mt-1 uppercase leading-normal">
                    Perform a calculation or click "Share / Save Results" to record takeoff entries.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3.5">
                {history.map((log) => {
                  const timestampStr = new Date(log.timestamp).toLocaleTimeString('en-CA', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: false
                  })
                  
                  return (
                    <div 
                      key={log.id}
                      onClick={() => handleLoadSpec(log)}
                      className="group relative bg-slate-900/50 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700/80 rounded-xl p-4 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(6,182,212,0.05)] flex flex-col gap-2"
                    >
                      {/* Top bar */}
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[9px] font-black tracking-widest text-cyan-400 bg-cyan-950/40 border border-cyan-800/30 px-1.5 py-0.5 rounded uppercase">
                            {log.toolName}
                          </span>
                        </div>
                        <span className="text-[9px] text-slate-500 font-bold">{timestampStr}</span>
                      </div>

                      {/* Primary metric result */}
                      <div className="text-xs font-black text-slate-100 group-hover:text-cyan-400 transition-colors uppercase pr-6">
                        {log.primaryResult}
                      </div>

                      {/* Bottom row actions */}
                      <div className="flex items-center justify-between pt-1 border-t border-slate-800/40 text-[9px] text-slate-500 font-bold">
                        <span>OFFLINE RECORD</span>
                        <span className="text-cyan-500 font-black flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          LOAD SPEC <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Drawer Footer */}
          {history.length > 0 && (
            <div className="p-6 border-t border-slate-800/80 bg-slate-900/30 shrink-0">
              <button
                onClick={handleClearLogs}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-red-950/20 hover:bg-red-950/40 border border-red-900/30 hover:border-red-900/50 text-red-400 hover:text-red-300 rounded-xl transition-all font-mono text-xs font-black uppercase tracking-wider cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                CLEAR LOG HISTORY
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
