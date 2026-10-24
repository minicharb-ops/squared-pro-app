import React, { useState } from 'react'
import { X, Calendar, Clipboard, Check, HelpCircle, Download, BookOpen, ChevronRight, Minimize2, ZoomIn } from 'lucide-react'

function useQuickReference(blockId) {
  const blockName = blockId ? String(blockId).toUpperCase() : 'A'

  const tablesByBlock = {
    A: [
      {
        title: 'NBC Safety & Rigging Load Factors',
        headers: ['Equipment / Sling', 'Working Load Limit (WLL)', 'Safety Factor', 'Inspection Frequency'],
        rows: [
          ['Synthetic Webbing Sling (1-inch)', '1,000 kg (2,200 lbs)', '5:1 Ratio', 'Pre-shift & Monthly'],
          ['Grade 80 Alloy Chain (3/8-inch)', '3,200 kg (7,100 lbs)', '4:1 Ratio', 'Annual Certified'],
          ['Wire Rope Core (1/2-inch)', '2,300 kg (5,100 lbs)', '5:1 Ratio', 'Pre-use visual']
        ],
        notes: 'NBC 9.36 / OH&S Regulation 14.2: Damaged slings must be tagged out and destroyed immediately.'
      },
      {
        title: 'Nail Fastening Schedule (NBC 9.23.3.4)',
        headers: ['Construction Member', 'Minimum Nail Length', 'Minimum Quantity', 'Pattern / Placement'],
        rows: [
          ['Floor Joist to Sill / Beam', '82 mm (3-1/4")', '2 Nails', 'Toe-nailed each side'],
          ['Top Plate to Stud', '82 mm (3-1/4")', '2 Nails', 'End-nailed'],
          ['Subfloor Plywood (15mm)', '51 mm (2")', 'Spacing 150mm edge', '300mm intermediate']
        ],
        notes: 'Use hot-dipped galvanized or stainless steel fasteners for pressure-treated exterior lumber.'
      }
    ],
    B: [
      {
        title: 'Excavation & Footing Dimensions (NBC 9.15)',
        headers: ['Building Type', 'Min. Footing Width', 'Min. Thickness', 'Concrete Compressive Strength'],
        rows: [
          ['1-Storey Frame (No Masonry)', '250 mm (10")', '100 mm (4")', '15 MPa at 28 days'],
          ['2-Storey Frame (No Masonry)', '350 mm (14")', '100 mm (4")', '15 MPa at 28 days'],
          ['3-Storey Frame or Masonry', '450 mm (18")', '150 mm (6")', '20 MPa at 28 days']
        ],
        notes: 'Footings must extend below local frost penetration line (min. 1.2m typical).'
      }
    ]
  }

  const defaultTables = tablesByBlock[blockName] || [
    {
      title: `Block ${blockName} Key NBC Metric Reference`,
      headers: ['Component Standard', 'Imperial Value', 'Metric Value', 'NBC Clause'],
      rows: [
        ['Stair Max Rise', '7-7/8 in', '200 mm', 'NBC 9.8.4.1'],
        ['Stair Min Run', '10 in', '255 mm', 'NBC 9.8.4.2'],
        ['Guard Height (Interior)', '36 in', '900 mm', 'NBC 9.8.8.2'],
        ['Guard Max Opening', '4 in', '100 mm', 'NBC 9.8.8.5'],
        ['Joist Max Bearing', '1-1/2 in', '38 mm', 'NBC 9.23.9.1']
      ],
      notes: 'Values represent minimum building code requirements for residential timber frame construction.'
    }
  ]

  return {
    title: `Block ${blockName} - Quick Reference Sheet`,
    subtitle: 'National Building Code of Canada & RSOS Standards',
    rules: [
      { text: 'Ensure proper PPE and WHMIS safety standards prior to site operations.' },
      { text: 'Reference Part 9 NBC span tables for joist, rafter, and lintel load requirements.' },
      { text: 'Double check stair rise and run dimensions: max rise 200mm (7 7/8"), min run 255mm (10").' }
    ],
    diagram: (
      <div className="w-full bg-slate-950 text-emerald-400 p-4 rounded-xl border border-slate-800 font-mono text-xs space-y-2">
        <div className="text-center font-bold text-amber-400 border-b border-slate-800 pb-1">
          TYPICAL WALL FRAMING ASSEMBLY (BLOCK {blockName})
        </div>
        <pre className="text-[10px] leading-tight overflow-x-auto text-emerald-300">
{`  +---------------------------------------+  <- DOUBLE TOP PLATE (2x6)
  |   [X]   |   [X]   |   [X]   |   [X]   |
  +---------------------------------------+  <- CRIPPLE STUDS @ 16" O.C.
  |============== HEADER =================|  <- LINTEL / HEADER (2x10)
  +---------------------------------------+
  |  [ ]  |                       |  [ ]  |  <- JACK / TRIMMER STUDS
  |  [ ]  |     WINDOW OPENING    |  [ ]  |  <- KING STUDS (OUTSIDE)
  +-------+                       +-------+
  |================ SILL =================|  <- ROUGH SILL
  +---------------------------------------+
  |   [X]   |   [X]   |   [X]   |   [X]   |  <- CRIPPLE STUDS BELOW SILL
  +---------------------------------------+  <- BOTTOM / SOLE PLATE`}
        </pre>
      </div>
    ),
    tables: defaultTables
  }
}

export default function QuickReferenceModal({ blockId, onClose }) {
  const content = useQuickReference(blockId)
  const [copiedIndex, setCopiedIndex] = useState(null)
  const [zoomDiagram, setZoomDiagram] = useState(false)

  if (!content) return null

  const handleCopyText = (text, index) => {
    if (!text) return
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const tables = content?.tables || []

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-6">
        {/* Modal panel */}
        <div className="relative transform overflow-hidden rounded-2xl bg-white dark:bg-slate-900 text-left shadow-2xl transition-all w-full max-w-4xl border border-slate-200 dark:border-slate-800 flex flex-col my-8">
          
          {/* Header section with brand accent line */}
          <div className="h-1.5 bg-gradient-to-r from-brand-500 via-emerald-500 to-sky-500 w-full" />
          
          <div className="flex items-start justify-between p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="space-y-1">
              <span className="text-[10px] font-black tracking-widest text-brand-500 dark:text-brand-400 uppercase bg-brand-500/10 px-2 py-0.5 rounded-full">
                NBC Quick Reference Guide
              </span>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white" id="modal-title">
                {content.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {content.subtitle}
              </p>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Close reference modal"
            >
              <X size={20} />
            </button>
          </div>

          {/* Modal body */}
          <div className="p-6 overflow-y-auto max-h-[calc(100vh-220px)] space-y-8">
            
            {/* INFORMATIVE BANNER */}
            <div className="bg-emerald-500/10 dark:bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-3 flex items-start gap-2.5">
              <BookOpen size={16} className="text-emerald-500 shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-black text-emerald-800 dark:text-emerald-400 uppercase tracking-wide">Exam Target Blueprint Compliant</p>
                <p className="text-slate-600 dark:text-slate-300 mt-0.5 font-medium">
                  The metric tables and geometric values below reflect the exact standards specified under the <strong className="text-emerald-600 dark:text-emerald-400 font-black">National Building Code (NBC)</strong> of Canada. Study these before answering drawing-interpretation or framing-layout questions.
                </p>
              </div>
            </div>

            {/* TWO COLUMN CONTENT AREA (DIAGRAM VS TABLES) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* LEFT COLUMN: DIAGRAM (5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                    Interactive Blueprint Diagram
                  </h4>
                  <button 
                    onClick={() => setZoomDiagram(!zoomDiagram)}
                    className="text-[10px] font-black text-brand-500 uppercase flex items-center gap-1 hover:underline"
                  >
                    {zoomDiagram ? <Minimize2 size={12} /> : <ZoomIn size={12} />}
                    <span>{zoomDiagram ? 'Actual Size' : 'Zoom In'}</span>
                  </button>
                </div>

                <div className={`transition-all duration-300 ${zoomDiagram ? 'lg:scale-[1.15] lg:z-10 relative bg-white dark:bg-slate-900 shadow-xl rounded-xl border border-slate-200 dark:border-slate-800 p-2' : ''}`}>
                  {content.diagram}
                </div>
                
                <p className="text-[10px] text-slate-400 italic text-center">
                  * Note: Diagram measurements are illustrative. Always prioritize exact written table standards during the Red Seal Exam.
                </p>
              </div>

              {/* RIGHT COLUMN: TABLES (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                
                {tables.map((table, idx) => (
                  <div key={idx} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                        <ChevronRight size={14} className="text-brand-500" /> {table?.title || 'Reference Table'}
                      </h4>
                      <button
                        onClick={() => handleCopyText(JSON.stringify(table?.rows || []), idx)}
                        className="text-[10px] font-black text-slate-400 hover:text-brand-500 uppercase flex items-center gap-1"
                        title="Copy table data rows to clipboard"
                      >
                        {copiedIndex === idx ? (
                          <>
                            <Check size={12} className="text-emerald-500" />
                            <span className="text-emerald-500">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Clipboard size={12} />
                            <span>Copy Data</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Responsive table wrapper */}
                    <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800">
                            {(table?.headers || []).map((h, hIdx) => (
                              <th key={hIdx} className="px-3 py-2.5 font-black text-slate-600 dark:text-slate-300 uppercase tracking-wider text-[10px]">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                          {(table?.rows || []).map((row, rIdx) => (
                            <tr 
                              key={rIdx} 
                              className="hover:bg-slate-50/50 dark:hover:bg-slate-850/30 transition-colors"
                            >
                              {(row || []).map((cell, cIdx) => (
                                <td key={cIdx} className="px-3 py-2.5 font-semibold text-slate-700 dark:text-slate-300">
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {table?.notes && (
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal pl-2 border-l-2 border-brand-500 font-medium">
                        <strong>Code Guideline Note:</strong> {table.notes}
                      </p>
                    )}
                  </div>
                ))}

              </div>

            </div>

          </div>

          {/* Modal footer */}
          <div className="bg-slate-50 dark:bg-slate-850 p-5 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider text-center sm:text-left">
              © 2026 National Building Standards Reference • Red Seal Carpentry
            </span>
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={onClose}
                className="flex-1 sm:flex-initial bg-brand-500 hover:bg-brand-600 text-white font-bold py-2 px-5 rounded-xl text-xs transition-colors min-h-[44px] flex items-center justify-center text-center"
              >
                Return to Modules
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

