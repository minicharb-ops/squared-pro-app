import React, { useState, useContext, useRef } from 'react'
import { AppContext } from '../../App'
import { X, Copy, Printer, Award, CheckSquare, Sparkles, Share2 } from 'lucide-react'
import html2canvas from 'html2canvas'

export default function SpecCardModal({ isOpen, onClose, toolName, heroMetric, takeoffSchedule, plainTextSummary }) {
  const { setUserXP } = useContext(AppContext) || { setUserXP: () => {} }
  const [copied, setCopied] = useState(false)
  const [xpAwarded, setXpAwarded] = useState(false)
  const [sharing, setSharing] = useState(false)
  const cardRef = useRef(null)

  if (!isOpen) return null

  const defaultTextSummary = `${toolName.toUpperCase()} - JOBSITE TAKE-OFF SUMMARY\n` +
    `==========================================\n` +
    `HERO METRIC: ${heroMetric}\n` +
    `------------------------------------------\n` +
    takeoffSchedule.map(item => `${item.label.toUpperCase()}: ${item.value}`).join('\n') +
    `\n==========================================\n` +
    `Generated via BuilderHub Canada (100% Offline Ready)`;

  const textToCopy = plainTextSummary || defaultTextSummary

  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePrint = () => {
    window.print()
  }

  const exportToImage = async () => {
    if (!cardRef.current) return
    try {
      setSharing(true)
      const canvas = await html2canvas(cardRef.current, {
        scale: 2, // High-res export
        useCORS: true,
        backgroundColor: '#020617', // Match slate-950
        logging: false,
      })
      const dataUrl = canvas.toDataURL('image/png')
      
      const dateStr = new Date().toISOString().split('T')[0]
      const filename = `BuilderHub-Spec-${dateStr}.png`

      // Try Web Share API if supported on the device
      if (navigator.share && navigator.canShare) {
        try {
          const res = await fetch(dataUrl)
          const blob = await res.blob()
          const file = new File([blob], filename, { type: 'image/png' })
          
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: 'Verified Layout Specs',
              text: 'Here are the verified layout specs.',
            })
            setSharing(false)
            return
          }
        } catch (shareErr) {
          console.error('Web Share failed, downloading file instead:', shareErr)
        }
      }

      // Fallback to classic automatic download
      const link = document.createElement('a')
      link.download = filename
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error('Error generating spec image:', err)
      alert('Could not export image.')
    } finally {
      setSharing(false)
    }
  }

  const handleAwardXp = () => {
    if (!xpAwarded) {
      setUserXP(prev => (prev || 0) + 25)
      setXpAwarded(true)
    }
  }

  const timestamp = new Date().toLocaleString('en-CA', { 
    timeZoneName: 'short',
    hour12: false 
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      {/* Dynamic styling for printing only the card */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * {
            visibility: hidden !important;
          }
          #print-spec-card, #print-spec-card * {
            visibility: visible !important;
          }
          #print-spec-card {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            border: 2px solid #06b6d4 !important;
            background-color: #020617 !important;
            color: #ffffff !important;
            padding: 24px !important;
            box-sizing: border-box !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}} />

      <div className="relative w-full max-w-lg bg-slate-900 border-2 border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-900 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-200 font-mono">SPEC CARD GENERATOR</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Scroll container to allow fixed 600px width for pixel-perfect image capture without squishing on mobile */}
          <div className="w-full overflow-x-auto pb-2 flex justify-start md:justify-center" style={{ scrollbarWidth: 'thin' }}>
            {/* THE DIGITAL CAD SPEC CARD */}
            <div 
              ref={cardRef}
              id="print-spec-card"
              className="relative bg-slate-950 border border-slate-800 rounded-xl p-5 shadow-[0_0_20px_rgba(6,182,212,0.15)] border-t-4 border-t-cyan-400 overflow-hidden font-mono text-white w-[600px] shrink-0 mx-auto"
            >
              {/* Blueprint grid overlay */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]"></div>

              {/* Inner Content */}
              <div className="relative z-10 space-y-4">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start border-b border-slate-800/80 pb-3 gap-1">
                  <div>
                    <div className="text-[10px] font-black tracking-widest text-cyan-400">BUILDERHUB CANADA • OFFICIAL SITE SPEC</div>
                    <div className="text-[9px] text-slate-500 font-bold">{timestamp}</div>
                  </div>
                  <div className="text-[10px] bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-slate-400 font-bold tracking-wide uppercase shrink-0">
                    OFFLINE-SECURE
                  </div>
                </div>

                {/* Tool Identifier */}
                <div>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">PROJECT TOOL / PROCESS</span>
                  <h3 className="text-sm font-black uppercase text-slate-100 tracking-wide mt-0.5">{toolName}</h3>
                </div>

                {/* HERO METRIC AREA */}
                <div className="bg-slate-900/60 border border-slate-800/60 rounded-lg p-4 text-center relative overflow-hidden">
                  <span className="text-[9px] text-cyan-400 font-black uppercase tracking-widest block mb-1">PRIMARY KEYMETRIC</span>
                  <span className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-[0_2px_10px_rgba(6,182,212,0.15)] block font-mono">
                    {heroMetric}
                  </span>
                </div>

                {/* TAKEOFF SCHEDULE */}
                <div className="space-y-2">
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">TAKEOFF SCHEDULE & SPECIFICATIONS</span>
                  <div className="border border-slate-800 rounded-lg overflow-hidden divide-y divide-slate-800/60">
                    {takeoffSchedule.map((item, index) => (
                      <div key={index} className="flex justify-between items-center px-3 py-2 text-xs hover:bg-slate-900/40 transition-colors">
                        <span className="text-slate-400 font-bold uppercase tracking-wide text-[10px]">{item.label}</span>
                        <span className="text-slate-100 font-black text-right">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CARD FOOTER */}
                <div className="border-t border-slate-800/80 pt-3 flex justify-between items-center text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                  <span>VER: 4.1.2-ON-SITE</span>
                  <span>Generated 100% Offline via BuilderHub.ca</span>
                </div>

              </div>
            </div>
          </div>

          {/* XP REWARD FEEDBACK AREA */}
          <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-lg border transition-all duration-300 ${xpAwarded ? 'bg-amber-400/10 border-amber-400/30 text-amber-400' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
                {xpAwarded ? <Sparkles className="w-5 h-5 animate-pulse" /> : <Award className="w-5 h-5" />}
              </div>
              <div>
                <h4 className="text-xs font-black uppercase text-slate-200">On-Site Record-keeping XP</h4>
                <p className="text-[10px] text-slate-500 font-medium">Claim your professional training points for this takeoff record.</p>
              </div>
            </div>
            <button
              onClick={handleAwardXp}
              disabled={xpAwarded}
              className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all duration-300 shrink-0 cursor-pointer ${
                xpAwarded 
                  ? 'bg-slate-900 border border-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black border border-amber-400 hover:shadow-lg font-black hover:scale-[1.02]'
              }`}
            >
              {xpAwarded ? 'CLAIMED (+25)' : 'CLAIM +25 XP'}
            </button>
          </div>

        </div>

        {/* Action Buttons Footer */}
        <div className="bg-slate-950 px-6 py-4 border-t border-slate-800/80 flex flex-col gap-3 shrink-0">
          <button
            onClick={exportToImage}
            disabled={sharing}
            className="flex items-center justify-center gap-2 py-3.5 px-4 bg-gradient-to-r from-cyan-500 via-blue-600 to-pink-500 hover:from-cyan-400 hover:via-blue-500 hover:to-pink-400 text-white rounded-xl border border-white/20 hover:scale-[1.01] active:scale-[0.99] transition-all font-mono text-xs font-black uppercase tracking-widest cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.3)]"
          >
            <Share2 className="w-4 h-4 animate-pulse" />
            {sharing ? 'GENERATING PNG...' : 'SHARE / SAVE AS PNG IMAGE'}
          </button>
          
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleCopy}
              className="flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white rounded-xl border border-slate-800 hover:border-slate-700 transition-all font-mono text-[10px] font-black uppercase tracking-wider cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              {copied ? 'COPIED!' : 'COPY TEXT'}
            </button>
            
            <button
              onClick={handlePrint}
              className="flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white rounded-xl border border-slate-800 hover:border-slate-700 transition-all font-mono text-[10px] font-black uppercase tracking-wider cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              PRINT / PDF
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
