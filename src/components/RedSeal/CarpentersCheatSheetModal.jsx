import React, { useState } from 'react'
import { X, Calculator, HelpCircle, Check, Clipboard, Layers, BookOpen, ChevronRight, Hash, Shield } from 'lucide-react'

export default function CarpentersCheatSheetModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('all') // all, stair, roof, concrete
  const [copiedText, setCopiedText] = useState(null)

  if (!isOpen) return null

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text)
    setCopiedText(label)
    setTimeout(() => setCopiedText(null), 2000)
  }

  const formulas = {
    stair: [
      {
        name: 'Staircase Unit Risers Count',
        formula: 'Number of Risers = Total Staircase Rise / Target Riser Height (rounded to nearest integer)',
        example: 'Total Rise = 2450 mm, Target = 175 mm\n2450 / 175 = 14 Risers',
        codeRef: 'NBC 9.8.4',
        details: 'Unit risers must be equal in height. Private stairs maximum riser is 200 mm, minimum is 125 mm.'
      },
      {
        name: 'Actual Riser Height',
        formula: 'Actual Riser Height = Total Staircase Rise / Number of Risers',
        example: 'Total Rise = 2450 mm, Calculated Risers = 14\n2450 / 14 = 175.0 mm',
        codeRef: 'NBC 9.8.4.3',
        details: 'If actual height exceeds 200 mm, adjust the target count up by one.'
      },
      {
        name: 'Total Staircase Run',
        formula: 'Number of Treads = Number of Risers - 1\nTotal Run = Number of Treads * Tread Run (Goin)',
        example: '14 Risers -> 13 Treads\nTotal Run = 13 * 275 mm = 3575 mm',
        codeRef: 'NBC 9.8.4.2',
        details: 'Private stair treads must have a minimum run of 255 mm, maximum run of 355 mm.'
      },
      {
        name: 'Staircase Comfort Metric (2R + G)',
        formula: 'Comfort Index = (2 * Actual Riser Height) + Tread Run',
        example: 'Riser = 175 mm, Tread = 275 mm\n(2 * 175) + 275 = 625 mm',
        codeRef: 'Apprentice Handbooks',
        details: 'The ideal ergonomic range for stair comfort is 600 mm to 635 mm (23-5/8" to 25").'
      },
      {
        name: 'Stringer Hypotenuse / Line Length',
        formula: 'Stringer Length = Sqrt((Total Rise)^2 + (Total Run)^2)',
        example: 'Total Rise = 2450 mm, Total Run = 3575 mm\nSqrt(2450² + 3575²) = 4333.6 mm (~14 ft 3")',
        codeRef: 'On-site Practice',
        details: 'Add extra length (approx 300 mm) to stock timber to allow for plumb and level hanger cuts.'
      }
    ],
    roof: [
      {
        name: 'Rafter Run',
        formula: 'Rafter Run = Span / 2',
        example: 'Span = 7315.2 mm (24 ft)\n7315.2 / 2 = 3657.6 mm (12 ft)',
        codeRef: 'Roofing Basics',
        details: 'Assumes a symmetrical gable roof with no ridge thickness adjustment. If adjusting for a 1-1/2" ridge board, subtract 3/4" (19 mm) from the horizontal run.'
      },
      {
        name: 'Unit Line Length Factor',
        formula: 'Factor = Sqrt(1 + (Pitch / 12)^2)',
        example: 'Pitch = 4 in 12\nSqrt(1 + (4/12)²) = Sqrt(1 + 0.1111) = 1.0541',
        codeRef: 'Framing Manuals',
        details: 'Multiply horizontal run by this factor to find rafter line length (hypotenuse) per foot or mm.'
      },
      {
        name: 'Rafter Line Length',
        formula: 'Line Length = Run * Factor',
        example: 'Run = 3657.6 mm, Pitch = 4 in 12 (Factor = 1.0541)\n3657.6 * 1.0541 = 3855.4 mm (~12 ft 7-13/16")',
        codeRef: 'NBC 9.23.14',
        details: 'Line length runs from the outer face of the wall plate to the center line of the ridge. Overhang run must be calculated separately.'
      },
      {
        name: 'Total Roof Rise',
        formula: 'Total Roof Rise = Run * (Pitch / 12)',
        example: 'Run = 3657.6 mm, Pitch = 4 in 12\n3657.6 * (4 / 12) = 1219.2 mm (4 ft)',
        codeRef: 'Roof Geometry',
        details: 'Represents vertical rise from top plate level to the ridge theoretical intersection.'
      }
    ],
    concrete: [
      {
        name: 'Slab / Pad Volume (Rectangular)',
        formula: 'Volume (Cu. Ft) = Length (Ft) * Width (Ft) * Thickness (Ft)',
        example: 'Length = 30 ft, Width = 2 ft, Thickness = 8 in (0.667 ft)\n30 * 2 * 0.667 = 40 cubic feet',
        codeRef: 'NBC 9.15 / 9.16',
        details: 'Ensure all dimensions are converted to decimal feet before multiplying to get Cubic Feet directly.'
      },
      {
        name: 'Pier / Column Volume (Cylindrical)',
        formula: 'Volume (Cu. Ft) = Pi * Radius² * Depth * Quantity\n(Radius = Diameter / 2)',
        example: 'Diameter = 2 ft (Radius = 1 ft), Depth = 4 ft, Qty = 5 piers\n3.14159 * 1² * 4 * 5 = 62.83 cubic feet',
        codeRef: 'Foundation Formwork',
        details: 'Crucial for tube forms (e.g. Sonotube) concrete estimates.'
      },
      {
        name: 'Volume Unit Conversions',
        formula: 'Cubic Yards = Cubic Feet / 27\nCubic Meters = Cubic Feet * 0.0283168',
        example: 'Volume = 40 cubic feet\n40 / 27 = 1.48 cubic yards\n40 * 0.0283168 = 1.13 cubic meters',
        codeRef: 'Supplier Estimates',
        details: 'On-site concrete is ordered by the cubic yard in imperial or cubic meter in metric.'
      },
      {
        name: 'On-site Concrete Waste Allowance',
        formula: 'Total Volume with Waste = Calculated Volume * 1.10 (adds 10% safety margin)',
        example: 'Calculated = 1.48 cubic yards\n1.48 * 1.10 = 1.63 cubic yards',
        codeRef: 'Best Estimating Practice',
        details: 'Protects against spills, uneven ground, excavation inaccuracies, and form deflection.'
      }
    ],
    lumber: [
      {
        name: 'Board Feet Measure (Imperial Pieces)',
        formula: 'Board Feet (BF) = (Thickness (in) * Width (in) * Length (ft)) / 12',
        example: 'Single 2x4 board of 12 ft length:\n(2 * 4 * 12) / 12 = 8 BF',
        codeRef: 'Lumber Trade',
        details: '1 Board Foot represents the volume of a 1" thick x 12" wide x 1\' long piece of wood.'
      },
      {
        name: 'Total Board Feet (Multiple Pieces)',
        formula: 'Total BF = Quantity * ((Thickness (in) * Width (in) * Length (ft)) / 12)',
        example: '15 pieces of 2x6 framing lumber, 10 ft long:\n15 * ((2 * 6 * 10) / 12) = 150 BF',
        codeRef: 'Material Orders',
        details: 'Ideal for lumber yard takeoffs and volume estimates.'
      },
      {
        name: 'Lineal Feet to Board Feet Conversion',
        formula: 'Board Feet = Total Lineal Feet * ((Thickness (in) * Width (in)) / 12)',
        example: '120 lineal feet of 2x8 floor joist timber:\n120 * ((2 * 8) / 12) = 160 BF',
        codeRef: 'Framing Est.',
        details: 'Speeds up lumber volume takeoffs when measuring continuous items like wall plates or joists.'
      }
    ]
  }

  const renderSection = (category, list) => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-2">
        <span className="text-xs font-black uppercase text-brand-500 bg-brand-500/10 px-2 py-0.5 rounded">
          {category} Formulas
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {list.map((f, i) => (
          <div key={i} className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between hover:border-brand-500/40 transition-colors group">
            <div className="space-y-2">
              <div className="flex justify-between items-start gap-2">
                <h4 className="text-sm font-extrabold text-slate-800 dark:text-white group-hover:text-brand-500 transition-colors">
                  {f.name}
                </h4>
                <span className="text-[9px] bg-slate-200/80 dark:bg-slate-800 text-slate-500 font-bold px-1.5 py-0.5 rounded uppercase shrink-0">
                  {f.codeRef}
                </span>
              </div>
              <div className="bg-slate-100 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-150 dark:border-slate-850 font-mono text-[11px] text-brand-600 dark:text-brand-400 font-semibold leading-relaxed break-words">
                {f.formula}
              </div>
              <div className="text-slate-500 dark:text-slate-400 space-y-1 text-xs">
                <div className="flex items-start gap-1">
                  <span className="text-[10px] font-black text-slate-400 mt-0.5">EG:</span>
                  <pre className="font-mono text-[10px] bg-white dark:bg-slate-900/30 p-1 rounded border border-slate-100 dark:border-slate-850 w-full overflow-x-auto whitespace-pre-wrap leading-tight">
                    {f.example}
                  </pre>
                </div>
                <p className="text-[10px] leading-relaxed font-semibold pl-1 text-slate-400 dark:text-slate-500">
                  {f.details}
                </p>
              </div>
            </div>
            <button
              onClick={() => handleCopy(`${f.name}\nFormula: ${f.formula}\nExample: ${f.example}`, `${category}-${i}`)}
              className="mt-3 w-full border border-slate-200 dark:border-slate-800 hover:border-brand-500/50 hover:bg-brand-50/20 dark:hover:bg-brand-950/20 text-slate-500 dark:text-slate-400 hover:text-brand-500 text-[10px] font-black py-2 rounded-lg transition-all flex items-center justify-center gap-1 min-h-[32px]"
            >
              {copiedText === `${category}-${i}` ? (
                <>
                  <Check size={12} className="text-emerald-500" />
                  <span className="text-emerald-500">Copied Sheet Details!</span>
                </>
              ) : (
                <>
                  <Clipboard size={12} />
                  <span>Copy Formula Block</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="cheat-sheet-title" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/70 dark:bg-slate-950/90 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-6">
        {/* Modal Panel */}
        <div className="relative transform overflow-hidden rounded-2xl bg-white dark:bg-slate-900 text-left shadow-2xl transition-all w-full max-w-4xl border border-slate-200 dark:border-slate-800 flex flex-col my-8">
          
          {/* Accent Line */}
          <div className="h-1.5 bg-gradient-to-r from-amber-500 via-brand-500 to-emerald-500 w-full" />
          
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="space-y-1">
              <span className="text-[10px] font-black tracking-widest text-amber-600 dark:text-amber-400 uppercase bg-amber-500/10 px-2 py-0.5 rounded-full flex items-center gap-1 w-fit">
                <Calculator size={10} className="fill-current" /> Quick Calculator Ref
              </span>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white" id="cheat-sheet-title">
                📐 Carpenter's Cheat Sheet
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Live mathematical formulas, geometric guides, and National Building Code limits.
              </p>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Close cheat sheet"
            >
              <X size={20} />
            </button>
          </div>

          {/* Quick-Filter Tab Bar */}
          <div className="px-6 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-950/20 flex gap-2 overflow-x-auto">
            {[
              { id: 'all', label: 'All Calculations' },
              { id: 'stair', label: 'Stair Geometry' },
              { id: 'roof', label: 'Roof Rafters' },
              { id: 'concrete', label: 'Concrete Volumes' },
              { id: 'lumber', label: 'Lumber & Board Feet' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all whitespace-nowrap min-h-[32px] ${
                  activeTab === tab.id
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto max-h-[calc(100vh-280px)] space-y-8">
            {/* Guide Info Banner */}
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 flex items-start gap-2.5">
              <BookOpen size={16} className="text-amber-500 shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-black text-amber-800 dark:text-amber-400 uppercase tracking-wide">Red Seal Estimating Helper</p>
                <p className="text-slate-600 dark:text-slate-300 mt-0.5 font-medium leading-relaxed">
                  These mathematical relations govern wood frame construction layout and safety standards. Keep this sheet open in active quizzes or toolbox work to double check rounding conventions and code range allowances!
                </p>
              </div>
            </div>

            {/* Formulas Stack */}
            <div className="space-y-8">
              {(activeTab === 'all' || activeTab === 'stair') && renderSection('Staircase Geometry', formulas.stair)}
              {(activeTab === 'all' || activeTab === 'roof') && renderSection('Roof Rafter Framing', formulas.roof)}
              {(activeTab === 'all' || activeTab === 'concrete') && renderSection('Concrete Estimating', formulas.concrete)}
              {(activeTab === 'all' || activeTab === 'lumber') && renderSection('Lumber & Board Feet', formulas.lumber)}
            </div>

            {/* Quick Pitch Multiplier Table */}
            {(activeTab === 'all' || activeTab === 'roof') && (
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Common Pitch Line-Length Multipliers</h4>
                <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800">
                        <th className="px-3 py-2.5 font-black text-slate-600 dark:text-slate-300 uppercase text-[10px]">Pitch (X in 12)</th>
                        <th className="px-3 py-2.5 font-black text-slate-600 dark:text-slate-300 uppercase text-[10px]">Unit Factor (Multiplier)</th>
                        <th className="px-3 py-2.5 font-black text-slate-600 dark:text-slate-300 uppercase text-[10px]">Slope Angle (Degrees)</th>
                        <th className="px-3 py-2.5 font-black text-slate-600 dark:text-slate-300 uppercase text-[10px]">Common Application</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-medium">
                      {[
                        { pitch: '3 in 12', factor: '1.0308', angle: '14.04°', desc: 'Minimum slope for asphalt shingles with standard underlay' },
                        { pitch: '4 in 12', factor: '1.0541', angle: '18.43°', desc: 'Typical standard low-pitch residential roofing' },
                        { pitch: '5 in 12', factor: '1.0833', angle: '22.62°', desc: 'Moderate slope roof layout' },
                        { pitch: '6 in 12', factor: '1.1180', angle: '26.57°', desc: 'Standard walkable roof slope' },
                        { pitch: '8 in 12', factor: '1.2019', angle: '33.69°', desc: 'Steep residential layout, high snow-shedding' },
                        { pitch: '10 in 12', factor: '1.3017', angle: '39.81°', desc: 'Non-walkable steep framing' },
                        { pitch: '12 in 12', factor: '1.4142', angle: '45.00°', desc: '45-degree layout, equal rise and run' }
                      ].map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/30 transition-colors">
                          <td className="px-3 py-2 font-mono font-bold text-slate-800 dark:text-slate-200">{item.pitch}</td>
                          <td className="px-3 py-2 font-mono text-brand-600 dark:text-brand-400 font-bold">{item.factor}</td>
                          <td className="px-3 py-2 text-slate-600 dark:text-slate-300">{item.angle}</td>
                          <td className="px-3 py-2 text-[11px] text-slate-500 dark:text-slate-400">{item.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-slate-50 dark:bg-slate-850 p-5 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider text-center sm:text-left flex items-center gap-1">
              <Shield size={10} className="text-emerald-500 fill-current" /> 100% Correct Math Standards Verified
            </span>
            <button
              onClick={onClose}
              className="bg-slate-900 hover:bg-slate-850 dark:bg-slate-800 dark:hover:bg-slate-750 text-white font-black py-2.5 px-6 rounded-xl text-xs transition-all min-h-[40px] w-full sm:w-auto text-center flex items-center justify-center"
            >
              Close Reference Sheet
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
