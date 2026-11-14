import React, { useState, useMemo, useRef } from 'react'
import { ChevronRight, Compass, Layers, Triangle, Hammer, X, Calculator, BookOpen, Ruler, Square, AlignJustify, Info } from 'lucide-react'

const TRADE_MATH_ITEMS = [
  {
    id: 'stair',
    title: 'Stair Calculations',
    subtitle: 'Total Rise, Riser/Tread Dimensions & Stringer Length',
    iconBgClass: 'bg-blue-500',
    icon: Compass
  },
  {
    id: 'concrete',
    title: 'Concrete Estimating',
    subtitle: 'Footings, Slabs & Cubic Volume',
    iconBgClass: 'bg-emerald-500',
    icon: Layers
  },
  {
    id: 'roof',
    title: 'Roof Framing Math',
    subtitle: 'Pythagorean Theorem, Line Length & Rafter Drop',
    iconBgClass: 'bg-orange-500',
    icon: Triangle
  },
  {
    id: 'bfm',
    title: 'Board Foot Measure (BFM)',
    subtitle: 'Lumber Volume & Cost Estimating',
    iconBgClass: 'bg-purple-500',
    icon: Hammer
  },
  {
    id: 'elevations',
    title: 'Elevations & Grades',
    subtitle: 'Transit Math, HI & Benchmarks',
    iconBgClass: 'bg-yellow-500',
    icon: Ruler
  },
  {
    id: 'squaring',
    title: 'Squaring & Diagonals',
    subtitle: 'Hypotenuse & The 3-4-5 Method',
    iconBgClass: 'bg-red-500',
    icon: Square
  },
  {
    id: 'wall',
    title: 'Wall Framing Estimator',
    subtitle: 'Studs, Plates & Sheathing',
    iconBgClass: 'bg-teal-500',
    icon: AlignJustify
  }
];


function gcd(a, b) {
  let x = Math.abs(Math.round(a))
  let y = Math.abs(Math.round(b))
  while (y) {
    const t = y
    y = x % y
    x = t
  }
  return x || 1
}

function formatInchesSixteenths(valIn) {
  if (!Number.isFinite(valIn) || valIn <= 0) return '0"'
  const total16 = Math.round(valIn * 16)
  const whole = Math.floor(total16 / 16)
  const rem = total16 % 16
  if (rem === 0) return `${whole}"`
  const g = gcd(rem, 16)
  const num = rem / g
  const den = 16 / g
  return whole > 0 ? `${whole} ${num}/${den}"` : `${num}/${den}"`
}

function formatFeetAndInches(valIn) {
  if (!Number.isFinite(valIn) || valIn <= 0) return '0\'-0"'
  const total16 = Math.round(valIn * 16)
  const ft = Math.floor(total16 / 192)
  const remIn16 = total16 % 192
  const wholeIn = Math.floor(remIn16 / 16)
  const rem16 = remIn16 % 16
  if (rem16 === 0) return `${ft}'-${wholeIn}"`
  const g = gcd(rem16, 16)
  const frac = `${rem16 / g}/${16 / g}`
  return `${ft}'-${wholeIn} ${frac}"`
}

function StairSvgPill({
  x,
  y,
  text,
  fontSize = 7.1,
  maxWidth = 340,
  color = '#f8fafc',
  borderColor = '#1e3a5f',
  align = 'start',
  padX = 4.5,
  padY = 3
}) {
  const str = String(text || '')
  const charFactor = 0.59
  const fittedFontSize = Math.min(fontSize, Math.max(5.8, (maxWidth - padX * 2) / (Math.max(1, str.length) * charFactor)))
  const width = Math.max(24, Math.min(maxWidth, Math.round(str.length * fittedFontSize * charFactor + padX * 2)))
  const height = Math.round(fittedFontSize + padY * 2)
  const rectX = align === 'end' ? x - width : align === 'middle' ? x - width / 2 : x
  const textX = align === 'end' ? x - padX : align === 'middle' ? x : x + padX
  const textAnchor = align === 'end' ? 'end' : align === 'middle' ? 'middle' : 'start'
  const rectY = y - height / 2 - 1

  return (
    <g pointerEvents="none">
      <rect x={rectX} y={rectY} width={width} height={height} rx="3.5" fill="#0a192f" stroke={borderColor} strokeWidth="1" />
      <text
        x={textX}
        y={y + fittedFontSize * 0.33 - 1}
        fill={color}
        fontSize={fittedFontSize}
        fontFamily="monospace"
        fontWeight="bold"
        textAnchor={textAnchor}
      >
        {str}
      </text>
    </g>
  )
}

function StairCalculationsModal({ onClose }) {
  const [unitSystem, setUnitSystem] = useState('imperial')

  // Imperial inputs (default 8'-9" = 105" classic basement stair; updates live as user types)
  const [feet, setFeet] = useState('8')
  const [inches, setInches] = useState('9')
  const [sixteenths, setSixteenths] = useState('0')
  const [unitRunInInput, setUnitRunInInput] = useState('10.5')

  // Metric inputs (default 2667 mm Total Rise, 267 mm Unit Run)
  const [totalRiseMmInput, setTotalRiseMmInput] = useState('2667')
  const [unitRunMmInput, setUnitRunMmInput] = useState('267')

  const [activeTooltip, setActiveTooltip] = useState(null)
  const [calcPulse, setCalcPulse] = useState(false)
  const scrollBodyRef = useRef(null)
  const cadSectionRef = useRef(null)

  // Live calculation engine (updates both as user types AND on Calculate click)
  const calc = useMemo(() => {
    const NBC_MAX_RISE_IN = 7.875 // 7-7/8" (200 mm) NBC 9.8.4 Private Max Rise
    const NBC_MAX_RISE_MM = 200
    const HEADROOM_MIN_IN = 76.75 // 6'-4 3/4" (1950 mm) NBC 9.8.2.2 Min Clear Headroom
    const HEADER_THICK_IN = 11.25 // 2x10 joist (9.25") + 3/4" subfloor + 1/2" drywall + finish = 11.25"
    const HEADROOM_DROP_IN = HEADROOM_MIN_IN + HEADER_THICK_IN // 88.0"
    const HEADROOM_MIN_MM = 1950
    const HEADER_THICK_MM = 286 // ~11.25" floor assembly in mm
    const HEADROOM_DROP_MM = HEADROOM_MIN_MM + HEADER_THICK_MM // 2236 mm

    if (unitSystem === 'imperial') {
      const ftNum = Math.max(0, parseFloat(feet) || 0)
      const inNum = Math.max(0, parseFloat(inches) || 0)
      const sixNum = Math.max(0, parseFloat(sixteenths) || 0)
      const totalRiseIn = ftNum * 12 + inNum + sixNum / 16

      if (totalRiseIn <= 0) return null

      const unitRunIn = Math.max(1, parseFloat(unitRunInInput) || 10.5)
      const rawRisers = totalRiseIn / NBC_MAX_RISE_IN
      const numRisers = Math.max(1, Math.ceil(rawRisers - 1e-9))
      const roundedDownRisers = Math.max(1, numRisers - 1)
      const roundedDownUnitRiseIn = numRisers > 1 ? totalRiseIn / roundedDownRisers : totalRiseIn

      const unitRiseIn = totalRiseIn / numRisers
      const numTreads = Math.max(1, numRisers - 1)
      const totalRunIn = numTreads * unitRunIn
      const unitHypIn = Math.sqrt(Math.pow(unitRiseIn, 2) + Math.pow(unitRunIn, 2))
      const spanHypIn = Math.sqrt(Math.pow(totalRiseIn, 2) + Math.pow(totalRunIn, 2))
      const fullStockIn = numRisers * unitHypIn
      const stockOrderFt = Math.max(8, Math.ceil(fullStockIn / 24) * 2)

      // Min Stairwell Rough Opening for 76.75" (6'-4 3/4" / 1950 mm) clear vertical headroom
      const headroomDropRisers = Math.max(1, Math.ceil(HEADROOM_DROP_IN / unitRiseIn - 1e-9))
      const minRoIn = headroomDropRisers * unitRunIn

      const totalRiseMm = Math.round(totalRiseIn * 25.4)
      const unitRiseMm = Math.round(unitRiseIn * 25.4)
      const unitRunMm = Math.round(unitRunIn * 25.4)

      const unitRiseTotal16 = Math.round(unitRiseIn * 16)
      const unitRiseWhole = Math.floor(unitRiseTotal16 / 16)
      const rem16ths = unitRiseTotal16 % 16
      const remDecimal = unitRiseIn - Math.floor(unitRiseIn)
      const g16 = gcd(rem16ths, 16)
      const reducedFracStr = rem16ths > 0 ? `${rem16ths / g16}/${16 / g16}"` : '0"'

      const totalRunDecStr = Number.isInteger(totalRunIn) ? `${totalRunIn}.0"` : `${totalRunIn.toFixed(1)}"`

      return {
        mode: 'imperial',
        ftNum,
        inNum,
        sixNum,
        totalRiseIn,
        totalRiseMm,
        rawRisers,
        numRisers,
        roundedDownRisers,
        roundedDownUnitRiseIn,
        numTreads,
        unitRiseIn,
        unitRiseMm,
        unitRiseWhole,
        remDecimal,
        rem16ths,
        reducedFracStr,
        unitRunIn,
        unitRunMm,
        totalRunIn,
        unitHypIn,
        spanHypIn,
        fullStockIn,
        stockOrderFt,
        headroomDropIn: HEADROOM_DROP_IN,
        headroomDropRisers,
        minRoIn,
        // Calculation Results formatted display strings
        totalRiseDisplay: `${Number.isInteger(totalRiseIn) ? totalRiseIn : totalRiseIn.toFixed(2)}" (${formatFeetAndInches(totalRiseIn)}) • ${totalRiseMm} mm`,
        unitRiseDisplay: `${formatInchesSixteenths(unitRiseIn)} • ${unitRiseIn.toFixed(2)}" (${unitRiseMm} mm)`,
        unitRunDisplay: `${formatInchesSixteenths(unitRunIn)} (${unitRunMm} mm)`,
        totalRunDisplay: `${totalRunDecStr} (${formatFeetAndInches(totalRunIn)})`,
        spanStringerDisplay: `${spanHypIn.toFixed(1)}" (${formatFeetAndInches(spanHypIn)})`,
        fullStockDisplay: `${fullStockIn.toFixed(1)}" (${formatFeetAndInches(fullStockIn)})`,
        minRoDisplay: `${minRoIn.toFixed(1)}" (${formatFeetAndInches(minRoIn)})`,
        // Live 1:1 CAD SVG formatted labels
        svgTotalRise: `${formatFeetAndInches(totalRiseIn)} (${Number.isInteger(totalRiseIn) ? totalRiseIn : totalRiseIn.toFixed(1)}")`,
        svgTotalRun: formatFeetAndInches(totalRunIn),
        svgStock: formatFeetAndInches(fullStockIn),
        svgRo: formatFeetAndInches(minRoIn),
        svgHeadroom: `6'-4 3/4"`,
        svgUnitRise: formatInchesSixteenths(unitRiseIn),
        svgUnitRun: formatInchesSixteenths(unitRunIn)
      }
    } else {
      const totalRiseMm = Math.max(0, parseFloat(totalRiseMmInput) || 0)
      if (totalRiseMm <= 0) return null

      const unitRunMm = Math.max(50, parseFloat(unitRunMmInput) || 255)
      const rawRisers = totalRiseMm / NBC_MAX_RISE_MM
      const numRisers = Math.max(1, Math.ceil(rawRisers - 1e-9))
      const roundedDownRisers = Math.max(1, numRisers - 1)
      const roundedDownUnitRiseMm = numRisers > 1 ? totalRiseMm / roundedDownRisers : totalRiseMm

      const unitRiseMm = totalRiseMm / numRisers
      const numTreads = Math.max(1, numRisers - 1)
      const totalRunMm = numTreads * unitRunMm
      const unitHypMm = Math.sqrt(Math.pow(unitRiseMm, 2) + Math.pow(unitRunMm, 2))
      const spanHypMm = Math.sqrt(Math.pow(totalRiseMm, 2) + Math.pow(totalRunMm, 2))
      const fullStockMm = numRisers * unitHypMm

      const headroomDropRisers = Math.max(1, Math.ceil(HEADROOM_DROP_MM / unitRiseMm - 1e-9))
      const minRoMm = headroomDropRisers * unitRunMm

      const totalRiseIn = totalRiseMm / 25.4
      const unitRiseIn = unitRiseMm / 25.4
      const unitRunIn = unitRunMm / 25.4
      const fullStockIn = fullStockMm / 25.4
      const stockOrderFt = Math.max(8, Math.ceil(fullStockIn / 24) * 2)

      const unitRiseTotal16 = Math.round(unitRiseIn * 16)
      const rem16ths = unitRiseTotal16 % 16
      const remDecimal = unitRiseIn - Math.floor(unitRiseIn)
      const g16 = gcd(rem16ths, 16)
      const reducedFracStr = rem16ths > 0 ? `${rem16ths / g16}/${16 / g16}"` : '0"'

      return {
        mode: 'metric',
        totalRiseMm,
        totalRiseIn,
        rawRisers,
        numRisers,
        roundedDownRisers,
        roundedDownUnitRiseMm,
        numTreads,
        unitRiseMm,
        unitRiseIn,
        remDecimal,
        rem16ths,
        reducedFracStr,
        unitRunMm,
        unitRunIn,
        totalRunMm,
        unitHypMm,
        spanHypMm,
        fullStockMm,
        stockOrderFt,
        headroomDropMm: HEADROOM_DROP_MM,
        headroomDropRisers,
        minRoMm,
        totalRiseDisplay: `${Math.round(totalRiseMm)} mm (${(totalRiseMm / 1000).toFixed(2)} m • ${formatFeetAndInches(totalRiseIn)})`,
        unitRiseDisplay: `${unitRiseMm.toFixed(1)} mm (${formatInchesSixteenths(unitRiseIn)} • ${unitRiseIn.toFixed(2)}")`,
        unitRunDisplay: `${Math.round(unitRunMm)} mm (${formatInchesSixteenths(unitRunIn)})`,
        totalRunDisplay: `${Math.round(totalRunMm)} mm (${(totalRunMm / 1000).toFixed(2)} m)`,
        spanStringerDisplay: `${Math.round(spanHypMm)} mm (${(spanHypMm / 1000).toFixed(2)} m)`,
        fullStockDisplay: `${Math.round(fullStockMm)} mm (${(fullStockMm / 1000).toFixed(2)} m)`,
        minRoDisplay: `${Math.round(minRoMm)} mm (${(minRoMm / 1000).toFixed(2)} m)`,
        svgTotalRise: `${Math.round(totalRiseMm)} mm (${(totalRiseMm / 1000).toFixed(2)}m)`,
        svgTotalRun: `${Math.round(totalRunMm)} mm`,
        svgStock: `${Math.round(fullStockMm)} mm (${(fullStockMm / 1000).toFixed(2)}m)`,
        svgRo: `${Math.round(minRoMm)} mm`,
        svgHeadroom: `1950mm`,
        svgUnitRise: `${unitRiseMm.toFixed(1)}mm`,
        svgUnitRun: `${Math.round(unitRunMm)}mm`
      }
    }
  }, [unitSystem, feet, inches, sixteenths, unitRunInInput, totalRiseMmInput, unitRunMmInput])

  const handleCalculate = () => {
    setCalcPulse(true)
    setTimeout(() => setCalcPulse(false), 300)
  }

  const toggleInfo = (key) => {
    setActiveTooltip((prev) => (prev === key ? null : key))
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 p-4 shrink-0 bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500 rounded-lg text-white shrink-0">
              <Calculator size={22} />
            </div>
            <div>
              <h3 className="text-slate-900 dark:text-white text-base md:text-lg font-bold uppercase tracking-wider leading-tight">
                STAIR CALCULATIONS
              </h3>
              <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                NBC 9.8.4 LIVE LAYOUT &amp; STRINGER CALCULATOR
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition-colors p-1">
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Quick Section Switcher Bar */}
        <div className="px-4 py-2 bg-slate-100 dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800 shrink-0 flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollBodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex-1 py-1.5 px-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-[11px] font-mono font-extrabold text-slate-800 dark:text-slate-200 hover:border-cyan-500/60 transition-colors"
          >
            🧮 Calculator &amp; Results
          </button>
          <button
            type="button"
            onClick={() => cadSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            className="flex-1 py-1.5 px-2.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-[11px] font-mono font-extrabold text-cyan-700 dark:text-cyan-300 transition-colors"
          >
            📐 1:1 CAD &amp; Math Teacher ↓
          </button>
        </div>

        {/* Scrollable Body (Block flow prevents flex-shrink crushing of overflow-hidden cards) */}
        <div
          ref={scrollBodyRef}
          className="block space-y-4 p-4 md:p-5 overflow-y-auto custom-scrollbar flex-1 min-h-0 max-h-[82vh]"
        >
          {/* Imperial / Metric Unit Toggle */}
          <div className="flex bg-slate-200 dark:bg-slate-800 rounded-lg p-1 shrink-0">
            <button
              type="button"
              onClick={() => setUnitSystem('imperial')}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${
                unitSystem === 'imperial'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Imperial (FT / IN / 16THS)
            </button>
            <button
              type="button"
              onClick={() => setUnitSystem('metric')}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${
                unitSystem === 'metric'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Metric (MM)
            </button>
          </div>

          {/* Input Section */}
          <div className="space-y-3.5 shrink-0">
            {unitSystem === 'imperial' ? (
              <>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">
                        Total Floor-to-Floor Rise
                      </label>
                      <button
                        type="button"
                        onClick={() => toggleInfo('inputRise')}
                        className="inline-flex items-center justify-center w-5 h-5 rounded-full text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/15 transition-colors"
                      >
                        <Info size={13} />
                      </button>
                    </div>
                    {calc && (
                      <span className="text-[11px] font-mono font-bold text-cyan-600 dark:text-cyan-400">
                        = {Number.isInteger(calc.totalRiseIn) ? calc.totalRiseIn : calc.totalRiseIn.toFixed(2)}&quot;
                      </span>
                    )}
                  </div>

                  {activeTooltip === 'inputRise' && (
                    <div className="text-xs text-slate-300 bg-slate-800 border border-slate-700 p-2.5 rounded-lg leading-relaxed">
                      Vertical plumb distance from finished lower floor surface to finished upper floor surface: (Feet × 12) + Inches + (16ths ÷ 16).
                    </div>
                  )}

                  {/* 3 Clearly Labeled Imperial Boxes: FEET ('), INCHES ("), 16THS (/16) */}
                  <div className="grid grid-cols-3 gap-2.5">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 mb-1 px-1">
                        FEET (&apos;)
                      </span>
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          placeholder="0"
                          value={feet}
                          onChange={(e) => setFeet(e.target.value)}
                          className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl pl-3 pr-8 py-2.5 text-base md:text-lg font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors"
                        />
                        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono font-extrabold text-slate-400 pointer-events-none">
                          FT
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 mb-1 px-1">
                        INCHES (&quot;)
                      </span>
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          placeholder="0"
                          value={inches}
                          onChange={(e) => setInches(e.target.value)}
                          className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl pl-3 pr-8 py-2.5 text-base md:text-lg font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors"
                        />
                        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono font-extrabold text-slate-400 pointer-events-none">
                          IN
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 mb-1 px-1">
                        16THS (/16)
                      </span>
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          max="15"
                          step="1"
                          placeholder="0"
                          value={sixteenths}
                          onChange={(e) => setSixteenths(e.target.value)}
                          className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl pl-3 pr-9 py-2.5 text-base md:text-lg font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors"
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono font-extrabold text-slate-400 pointer-events-none">
                          /16
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Target Unit Run Input (Default 10 1/2" Standard or 10" NBC Min) */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      Target Unit Run (Inches)
                    </label>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setUnitRunInInput('10')}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border transition-colors ${
                          parseFloat(unitRunInInput) === 10
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-600 dark:text-cyan-300'
                            : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        10&quot; NBC Min
                      </button>
                      <button
                        type="button"
                        onClick={() => setUnitRunInInput('10.5')}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border transition-colors ${
                          parseFloat(unitRunInInput) === 10.5
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-600 dark:text-cyan-300'
                            : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        10 1/2&quot; Std
                      </button>
                    </div>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      min="8"
                      step="0.125"
                      value={unitRunInInput}
                      onChange={(e) => setUnitRunInInput(e.target.value)}
                      className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl pl-3 pr-12 py-2 text-sm font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono font-extrabold text-slate-400 pointer-events-none">
                      INCHES
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 mb-1 px-1">
                    TOTAL RISE (mm)
                  </span>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      placeholder="e.g. 2667"
                      value={totalRiseMmInput}
                      onChange={(e) => setTotalRiseMmInput(e.target.value)}
                      className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl pl-3 pr-10 py-2.5 text-base font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono font-extrabold text-slate-400 pointer-events-none">
                      MM
                    </span>
                  </div>
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center justify-between mb-1 px-1">
                    <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                      UNIT RUN (mm)
                    </span>
                    <button
                      type="button"
                      onClick={() => setUnitRunMmInput(unitRunMmInput === '255' ? '267' : '255')}
                      className="text-[10px] font-mono font-bold text-cyan-500 hover:underline"
                    >
                      {unitRunMmInput === '255' ? 'Switch Std 267' : 'NBC Min 255'}
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      min="150"
                      placeholder="255"
                      value={unitRunMmInput}
                      onChange={(e) => setUnitRunMmInput(e.target.value)}
                      className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl pl-3 pr-10 py-2.5 text-base font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono font-extrabold text-slate-400 pointer-events-none">
                      MM
                    </span>
                  </div>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handleCalculate}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase tracking-wider py-3 rounded-xl transition-all shadow-md active:scale-[0.98]"
            >
              Calculate Stair Layout
            </button>
          </div>

          {/* Quick Jump Pill to 1:1 CAD & Step-by-Step Math Walkthrough */}
          <button
            type="button"
            onClick={() => cadSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            className="w-full shrink-0 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/35 text-cyan-700 dark:text-cyan-300 text-[11px] sm:text-xs font-mono font-extrabold tracking-wide transition-colors"
          >
            <span>📐 Jump to 1:1 CAD &amp; Step-by-Step Math Walkthrough ↓</span>
          </button>

          {/* 1. CALCULATION RESULTS (9 Clean Separate Rows — Zero Label/Value Overlap) */}
          <div
            className={`shrink-0 bg-slate-100 dark:bg-slate-800/50 border rounded-xl p-4 md:p-5 transition-colors ${
              calcPulse ? 'border-cyan-400' : 'border-slate-300 dark:border-slate-700'
            }`}
          >
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3.5 border-b border-slate-200 dark:border-slate-700 pb-2">
              Calculation Results
            </h4>

            <div className="space-y-2.5 text-xs sm:text-sm">
              {[
                {
                  id: 'resTotalRise',
                  label: 'Total Floor-to-Floor Rise:',
                  value: calc ? calc.totalRiseDisplay : '--',
                  valueClass: 'text-slate-900 dark:text-white',
                  tip: 'Exact vertical plumb height from finished lower floor to finished upper floor converted into a single base unit: (Feet × 12) + Inches + (16ths ÷ 16).'
                },
                {
                  id: 'resNumRisers',
                  label: 'Number of Risers (N):',
                  value: calc ? `${calc.numRisers}` : '--',
                  valueClass: 'text-blue-600 dark:text-cyan-400',
                  tip: 'Calculated as Ceil(Total Rise ÷ Max Code Rise of 7-7/8" / 200mm). Always round UP to the next whole integer so no step exceeds NBC 9.8.4 maximum rise.'
                },
                {
                  id: 'resNumTreads',
                  label: 'Number of Treads (N - 1):',
                  value: calc ? `${calc.numTreads}` : '--',
                  valueClass: 'text-blue-600 dark:text-cyan-400',
                  tip: 'A standard stair flight has 1 fewer tread than risers (Treads = N - 1) because the final top riser steps directly onto the upper floor landing.'
                },
                {
                  id: 'resUnitRise',
                  label: unitSystem === 'imperial' ? 'Exact Unit Rise (Max 7-7/8"):' : 'Exact Unit Rise (Max 200mm):',
                  value: calc ? calc.unitRiseDisplay : '--',
                  valueClass: 'text-blue-600 dark:text-cyan-400',
                  tip: 'Total Rise ÷ Number of Risers (N), rounded to the nearest 1/16" for brass stair gauge placement on the framing square body.'
                },
                {
                  id: 'resUnitRun',
                  label: unitSystem === 'imperial' ? 'Unit Run (Min 10"):' : 'Unit Run (Min 255mm):',
                  value: calc ? calc.unitRunDisplay : '--',
                  valueClass: 'text-blue-600 dark:text-cyan-400',
                  tip: 'Horizontal depth of each step measured nosing-to-nosing (cut width on the stringer). NBC 9.8.4 private minimum run is 255 mm (10").'
                },
                {
                  id: 'resTotalRun',
                  label: 'Total Horizontal Run:',
                  value: calc ? calc.totalRunDisplay : '--',
                  valueClass: 'text-blue-600 dark:text-cyan-400',
                  tip: 'Total horizontal floor space occupied by the stair stringer from the bottom riser face to the upper landing plumb cut: (N - 1) × Unit Run.'
                },
                {
                  id: 'resStringerSpan',
                  label: 'Stringer Span (N-1 Steps):',
                  value: calc ? calc.spanStringerDisplay : '--',
                  valueClass: 'text-emerald-600 dark:text-emerald-400',
                  tip: 'True Pythagorean diagonal span from bottom nosing to upper landing nosing across N - 1 treads: √(Total Rise² + Total Run²).'
                },
                {
                  id: 'resFullStock',
                  label: 'Full Stringer Stock (N Steps):',
                  value: calc ? calc.fullStockDisplay : '--',
                  valueClass: 'text-emerald-600 dark:text-emerald-400',
                  tip: 'Total diagonal length across all N step triangles (N × √(Unit Rise² + Unit Run²)) used to select commercial 2x12 lumber stock.'
                },
                {
                  id: 'resMinRo',
                  label: 'Min Stairwell R.O. (Headroom):',
                  value: calc ? calc.minRoDisplay : '--',
                  valueClass: 'text-amber-600 dark:text-amber-400',
                  tip: 'Minimum stairwell rough opening length required to maintain NBC 9.8.2.2 minimum 1950 mm (6\'-4 3/4" / 76.75") plumb headroom below the header.'
                }
              ].map((row, idx, arr) => (
                <div
                  key={row.id}
                  className={`flex flex-col ${
                    idx < arr.length - 1 ? 'border-b border-slate-200/60 dark:border-slate-700/60 pb-2.5' : 'pt-0.5'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                    {/* Left Label + Immediately Adjacent ⓘ Button */}
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="font-sans font-semibold text-slate-700 dark:text-slate-200 leading-snug">
                        {row.label}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleInfo(row.id)}
                        aria-label={`Info about ${row.label}`}
                        className={`inline-flex items-center justify-center w-5 h-5 rounded-full shrink-0 transition-colors ${
                          activeTooltip === row.id
                            ? 'bg-cyan-500/20 text-cyan-400'
                            : 'text-slate-400 hover:text-cyan-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        <Info size={13} />
                      </button>
                    </div>

                    {/* Right Numeric Output */}
                    <div className={`ml-auto text-right font-mono font-bold ${row.valueClass}`}>
                      {row.value}
                    </div>
                  </div>

                  {activeTooltip === row.id && (
                    <div className="text-xs text-cyan-100 bg-slate-900 border border-cyan-500/30 px-3 py-2 rounded-lg mt-2 leading-relaxed">
                      {row.tip}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 2. LIVE 1:1 CAD STAIR STRINGER DIAGRAM (viewBox="0 0 360 175") BELOW CALCULATION RESULTS */}
          <div ref={cadSectionRef} className="space-y-4 shrink-0 scroll-mt-2">
          {calc && (
            <div className="bg-[#0a192f] border border-slate-700/90 rounded-xl overflow-hidden shadow-lg shrink-0">
              <div className="px-3 py-1.5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
                <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-cyan-400">
                  LIVE 1:1 CAD STRINGER &amp; HEADROOM PROFILE
                </span>
                <span className="text-[10px] font-mono font-bold text-slate-400">
                  NBC 9.8.4 • 1:1 SPOTLIGHT
                </span>
              </div>
              <svg viewBox="0 0 360 175" className="w-full h-auto min-h-[175px] block shrink-0">
                <defs>
                  <pattern id="stairCadSpotlightGrid" width="18" height="18" patternUnits="userSpaceOnUse">
                    <path d="M 18 0 L 0 0 0 18" fill="none" stroke="#172a46" strokeWidth="0.65" />
                  </pattern>
                </defs>
                <rect x="0" y="0" width="360" height="175" fill="#0a192f" />
                <rect x="0" y="0" width="360" height="175" fill="url(#stairCadSpotlightGrid)" />

                {/* Lower Finished Floor Line */}
                <line x1="10" y1="122" x2="184" y2="122" stroke="#64748b" strokeWidth="1.5" />

                {/* Stairwell Double Header (Left of Opening) & Upper Floor Landing Assembly (Right of Opening) */}
                <rect x="10" y="54" width="16" height="12" fill="#1e293b" stroke="#94a3b8" strokeWidth="1.2" />
                <rect x="26" y="54" width="10" height="12" fill="#334155" stroke="#fbbf24" strokeWidth="1.3" />
                <line x1="26" y1="54" x2="36" y2="66" stroke="#fbbf24" strokeWidth="0.9" />
                <line x1="36" y1="54" x2="26" y2="66" stroke="#fbbf24" strokeWidth="0.9" />

                <rect x="162" y="54" width="22" height="12" fill="#1e293b" stroke="#94a3b8" strokeWidth="1.2" />
                <line x1="162" y1="54" x2="172" y2="66" stroke="#94a3b8" strokeWidth="0.8" />

                {/* Cut Stair Stringer Side Profile (x=18..162, y=54..122) */}
                <polygon
                  points="18,122 18,105 54,105 54,88 90,88 90,71 126,71 126,54 162,54 162,69 45,122"
                  fill="#451a03"
                  stroke="#fbbf24"
                  strokeWidth="1.8"
                />

                {/* Diagonal Tangent Nosing Line & Plumb Headroom Clearance Arrow at Stairwell Header (x=36) */}
                <line x1="18" y1="105" x2="126" y2="54" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 2.5" opacity="0.7" />
                <line x1="36" y1="66" x2="36" y2="96.5" stroke="#c084fc" strokeWidth="1.6" strokeDasharray="2.5 2" />
                <polygon points="36,66 33.5,70.5 38.5,70.5" fill="#c084fc" />
                <polygon points="36,96.5 33.5,92 38.5,92" fill="#c084fc" />

                {/* Steel Framing Square L-Overlay on Step 3 + Brass Stair Gauges */}
                <polyline points="90,88 90,71 126,71" fill="none" stroke="#22d3ee" strokeWidth="2.8" />
                <circle cx="90" cy="84" r="1.8" fill="#fbbf24" />
                <circle cx="120" cy="71" r="1.8" fill="#fbbf24" />

                {/* Top Stairwell Opening (MIN R.O.) Horizontal Dimension Arrow (x=36..162, y=28) */}
                <line x1="36" y1="24" x2="36" y2="51" stroke="#c084fc" strokeWidth="1.1" strokeDasharray="2 2" />
                <line x1="162" y1="24" x2="162" y2="33" stroke="#c084fc" strokeWidth="1.1" strokeDasharray="2 2" />
                <line x1="36" y1="28" x2="162" y2="28" stroke="#c084fc" strokeWidth="1.8" />
                <polygon points="36,28 42,25.2 42,30.8" fill="#c084fc" />
                <polygon points="162,28 156,25.2 156,30.8" fill="#c084fc" />
                <line x1="99" y1="28" x2="99" y2="20" stroke="#c084fc" strokeWidth="1.2" strokeDasharray="2 2" />

                {/* Diagonal Stringer Callout Leader Line to Upper-Right Pill */}
                <polyline
                  points="142,58 176,39 208,39"
                  fill="none"
                  stroke="#34d399"
                  strokeWidth="1.3"
                  strokeDasharray="3 2.5"
                />

                {/* Right Vertical Dimension Arrow (TOTAL RISE: x=194, y=54..122) */}
                <line x1="186" y1="54" x2="199" y2="54" stroke="#fbbf24" strokeWidth="1.1" strokeDasharray="2 2" />
                <line x1="50" y1="122" x2="199" y2="122" stroke="#fbbf24" strokeWidth="1.1" strokeDasharray="2 2" />
                <line x1="194" y1="54" x2="194" y2="122" stroke="#fbbf24" strokeWidth="2" />
                <polygon points="194,54 191,60 197,60" fill="#fbbf24" />
                <polygon points="194,122 191,116 197,116" fill="#fbbf24" />
                <line x1="194" y1="88" x2="202" y2="88" stroke="#fbbf24" strokeWidth="1.3" />

                {/* Mini Inset Steel Framing Square Graphic Beside Lower-Right Pill */}
                <polyline points="170,130 170,141 181,141" fill="none" stroke="#22d3ee" strokeWidth="2.4" />
                <circle cx="170" cy="133" r="1.4" fill="#fbbf24" />
                <circle cx="178" cy="141" r="1.4" fill="#fbbf24" />

                {/* Bottom Horizontal Dimension Arrow (TOTAL RUN: y=138, x=18..162) */}
                <line x1="18" y1="125" x2="18" y2="142" stroke="#38bdf8" strokeWidth="1.1" strokeDasharray="2 2" />
                <line x1="162" y1="72" x2="162" y2="142" stroke="#38bdf8" strokeWidth="1.1" strokeDasharray="2 2" />
                <line x1="18" y1="138" x2="162" y2="138" stroke="#38bdf8" strokeWidth="1.9" />
                <polygon points="18,138 24,135.2 24,140.8" fill="#38bdf8" />
                <polygon points="162,138 156,135.2 156,140.8" fill="#38bdf8" />
                <line x1="90" y1="138" x2="90" y2="153" stroke="#38bdf8" strokeWidth="1.2" strokeDasharray="2 2" />

                {/* Opaque fill="#0a192f" Dynamic Callout Pills Drawn AFTER All Geometry & Dimension Lines */}
                <StairSvgPill
                  x={8}
                  y={13}
                  align="start"
                  maxWidth={220}
                  text={`MIN R.O.: ${calc.svgRo} (>= ${calc.svgHeadroom} HEADROOM)`}
                  fontSize={7.0}
                  color="#e9d5ff"
                  borderColor="#9333ea"
                />
                <StairSvgPill
                  x={354}
                  y={39}
                  align="end"
                  maxWidth={172}
                  text={`STRINGER: ${calc.svgStock} (${calc.numRisers} RISERS)`}
                  fontSize={7.0}
                  color="#6ee7b7"
                  borderColor="#059669"
                />
                <StairSvgPill
                  x={202}
                  y={88}
                  align="start"
                  maxWidth={152}
                  text={`TOTAL RISE: ${calc.svgTotalRise}`}
                  fontSize={7.1}
                  color="#fde68a"
                  borderColor="#d97706"
                />
                <StairSvgPill
                  x={354}
                  y={136}
                  align="end"
                  maxWidth={170}
                  text={`SQUARE LAYOUT: ${calc.svgUnitRise} RISE × ${calc.svgUnitRun} RUN`}
                  fontSize={6.9}
                  color="#67e8f9"
                  borderColor="#0284c7"
                />
                <StairSvgPill
                  x={8}
                  y={161}
                  align="start"
                  maxWidth={176}
                  text={`TOTAL RUN: ${calc.svgTotalRun} (${calc.numTreads} TREADS)`}
                  fontSize={7.0}
                  color="#7dd3fc"
                  borderColor="#0284c7"
                />
              </svg>
            </div>
          )}

          {/* 3. ALWAYS-VISIBLE "HOW TO DO THE MATH (RED SEAL STEP-BY-STEP TEACHER)" SECTION (6 NUMBERED CARDS) */}
          <div className="bg-slate-950 border border-cyan-500/35 rounded-xl overflow-hidden shadow-lg shrink-0">
            <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400 shrink-0">
                <BookOpen size={16} />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider leading-tight">
                  HOW TO DO THE MATH (RED SEAL STEP-BY-STEP TEACHER)
                </h4>
                <p className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest mt-0.5">
                  RED SEAL MATH TEACHER — STEP-BY-STEP WORKED SOLUTION
                </p>
              </div>
            </div>

            <div className="p-3.5 sm:p-4 space-y-3 text-xs text-slate-300 leading-relaxed">
              {calc ? (
                calc.mode === 'imperial' ? (
                  <>
                    {/* STEP 1 */}
                    <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 font-mono font-extrabold text-[11px] shrink-0">
                          1
                        </span>
                        <span className="font-bold text-white uppercase tracking-wide text-[11px] sm:text-xs">
                          Step 1 — Convert Total Rise to Single Unit (Inches or mm)
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-400">
                        Formula: <span className="text-cyan-300">(Feet × 12) + Inches + (16ths ÷ 16)</span>
                      </div>
                      <div className="font-mono text-slate-200 bg-slate-950/80 border border-slate-800/80 rounded px-2.5 py-1.5">
                        ({calc.ftNum}&apos; × 12) + {calc.inNum}&quot; + {calc.sixNum}/16&quot; ={' '}
                        <span className="font-bold text-emerald-400">
                          {calc.totalRiseIn.toFixed(2)}&quot; ({calc.totalRiseMm} mm)
                        </span>
                      </div>
                    </div>

                    {/* STEP 2 */}
                    <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 font-mono font-extrabold text-[11px] shrink-0">
                          2
                        </span>
                        <span className="font-bold text-white uppercase tracking-wide text-[11px] sm:text-xs">
                          Step 2 — Calculate Number of Risers (N) &amp; Why We Always Round UP
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-400">
                        Formula: <span className="text-cyan-300">N = Ceil(Total Rise ÷ Max Code Rise)</span>{' '}
                        <span className="text-slate-500">(NBC 9.8.4 max private rise = 7-7/8&quot; / 7.875&quot; / 200 mm)</span>
                      </div>
                      <div className="font-mono text-slate-200 bg-slate-950/80 border border-slate-800/80 rounded px-2.5 py-1.5">
                        {calc.totalRiseIn.toFixed(2)}&quot; ÷ 7.875&quot; = {calc.rawRisers.toFixed(2)} ➔ Round UP to{' '}
                        <span className="font-bold text-emerald-400">{calc.numRisers} Risers</span>
                      </div>
                      <div className="text-[11px] text-amber-200/95 bg-amber-500/10 border border-amber-500/30 rounded px-2.5 py-1.5">
                        <strong className="text-amber-300">Teacher Rule:</strong> Always round UP to the next whole riser!
                        {calc.numRisers > 1
                          ? ` If you rounded down to ${calc.roundedDownRisers} risers, each step would be ${calc.roundedDownUnitRiseIn.toFixed(2)}", violating the 7-7/8" NBC maximum.`
                          : ' Rounding down would exceed the 7-7/8" NBC maximum rise.'}
                      </div>
                    </div>

                    {/* STEP 3 */}
                    <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 font-mono font-extrabold text-[11px] shrink-0">
                          3
                        </span>
                        <span className="font-bold text-white uppercase tracking-wide text-[11px] sm:text-xs">
                          Step 3 — Find Exact Unit Rise &amp; Convert Decimal Inches to 16ths
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-400">
                        Formula: <span className="text-cyan-300">Exact Unit Rise = Total Rise ÷ Number of Risers (N)</span>
                      </div>
                      <div className="font-mono text-slate-200 bg-slate-950/80 border border-slate-800/80 rounded px-2.5 py-1.5">
                        {calc.totalRiseIn.toFixed(2)}&quot; ÷ {calc.numRisers} = {calc.unitRiseIn.toFixed(3)}&quot; ➔ Decimal (
                        {calc.remDecimal.toFixed(3)} × 16) = {calc.rem16ths}/16&quot;
                        {calc.rem16ths > 0 && `${calc.rem16ths}/16"` !== calc.reducedFracStr ? ` = ${calc.reducedFracStr}` : ''} ➔{' '}
                        <span className="font-bold text-emerald-400">
                          {formatInchesSixteenths(calc.unitRiseIn)} ({calc.unitRiseMm} mm)
                        </span>
                      </div>
                    </div>

                    {/* STEP 4 */}
                    <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 font-mono font-extrabold text-[11px] shrink-0">
                          4
                        </span>
                        <span className="font-bold text-white uppercase tracking-wide text-[11px] sm:text-xs">
                          Step 4 — Find Number of Treads (N - 1) &amp; Total Horizontal Run
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-400">
                        Formula: <span className="text-cyan-300">Treads = Risers - 1</span> (top riser steps onto upper landing) &amp;{' '}
                        <span className="text-cyan-300">Total Run = Treads × Unit Run</span>
                      </div>
                      <div className="font-mono text-slate-200 bg-slate-950/80 border border-slate-800/80 rounded px-2.5 py-1.5">
                        {calc.numRisers} - 1 = {calc.numTreads} Treads ➔ {calc.numTreads} × {calc.unitRunIn}&quot; ={' '}
                        <span className="font-bold text-emerald-400">
                          {calc.totalRunIn.toFixed(1)}&quot; ({formatFeetAndInches(calc.totalRunIn)})
                        </span>
                      </div>
                    </div>

                    {/* STEP 5 */}
                    <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 font-mono font-extrabold text-[11px] shrink-0">
                          5
                        </span>
                        <span className="font-bold text-white uppercase tracking-wide text-[11px] sm:text-xs">
                          Step 5 — Calculate Stringer Length (Pythagorean Theorem A² + B² = C²)
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-400">
                        Formula: <span className="text-cyan-300">One Step Bridge = √(Unit Rise² + Unit Run²)</span>
                      </div>
                      <div className="font-mono text-slate-200 bg-slate-950/80 border border-slate-800/80 rounded px-2.5 py-2 space-y-1">
                        <div>
                          √({calc.unitRiseIn.toFixed(2)}² + {calc.unitRunIn.toFixed(2)}²) = √(
                          {Math.pow(calc.unitRiseIn, 2).toFixed(2)} + {Math.pow(calc.unitRunIn, 2).toFixed(2)}) ={' '}
                          <span className="font-bold text-cyan-300">{calc.unitHypIn.toFixed(2)}&quot; per step</span>
                        </div>
                        <div className="pt-1 border-t border-slate-800/80 text-[11px]">
                          • <span className="text-slate-400">Span Hypotenuse ({calc.numTreads} Treads):</span> √(Total Rise² + Total Run²) ={' '}
                          <span className="font-bold text-emerald-400">{calc.spanStringerDisplay}</span>
                        </div>
                        <div className="text-[11px]">
                          • <span className="text-slate-400">Full Stock Length ({calc.numRisers} Steps):</span> {calc.numRisers} ×{' '}
                          {calc.unitHypIn.toFixed(2)}&quot; ={' '}
                          <span className="font-bold text-amber-300">{calc.fullStockDisplay}</span>{' '}
                          <span className="text-slate-400">(order a {calc.stockOrderFt}&apos; 2x12)</span>
                        </div>
                      </div>
                    </div>

                    {/* STEP 6 */}
                    <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 font-mono font-extrabold text-[11px] shrink-0">
                          6
                        </span>
                        <span className="font-bold text-white uppercase tracking-wide text-[11px] sm:text-xs">
                          Step 6 — Calculate Minimum Stairwell Rough Opening (R.O.) for Headroom
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-400">
                        Formula:{' '}
                        <span className="text-cyan-300">
                          Headroom Drop = 76.75&quot; (1950mm NBC min headroom) + 11.25&quot; (2x10 joist + subfloor + drywall) = 88.0&quot;
                        </span>
                      </div>
                      <div className="font-mono text-slate-200 bg-slate-950/80 border border-slate-800/80 rounded px-2.5 py-1.5">
                        Risers in Opening = Ceil(88.0&quot; ÷ {calc.unitRiseIn.toFixed(2)}&quot;) = {calc.headroomDropRisers} Risers ➔ Min R.O. ={' '}
                        {calc.headroomDropRisers} × {calc.unitRunIn}&quot; ={' '}
                        <span className="font-bold text-amber-300">{calc.minRoDisplay}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* METRIC 6-STEP TEACHER CARDS */}
                    <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 font-mono font-extrabold text-[11px] shrink-0">
                          1
                        </span>
                        <span className="font-bold text-white uppercase tracking-wide text-[11px] sm:text-xs">
                          Step 1 — Convert Total Rise to Single Unit (Millimeters)
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-400">
                        Formula: <span className="text-cyan-300">Total Rise in mm (1 inch = 25.4 mm)</span>
                      </div>
                      <div className="font-mono text-slate-200 bg-slate-950/80 border border-slate-800/80 rounded px-2.5 py-1.5">
                        Total Rise ={' '}
                        <span className="font-bold text-emerald-400">
                          {Math.round(calc.totalRiseMm)} mm ({(calc.totalRiseMm / 1000).toFixed(3)} m • {calc.totalRiseIn.toFixed(2)}&quot;)
                        </span>
                      </div>
                    </div>

                    <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 font-mono font-extrabold text-[11px] shrink-0">
                          2
                        </span>
                        <span className="font-bold text-white uppercase tracking-wide text-[11px] sm:text-xs">
                          Step 2 — Calculate Number of Risers (N) &amp; Why We Always Round UP
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-400">
                        Formula: <span className="text-cyan-300">N = Ceil(Total Rise ÷ 200 mm NBC Max Private Rise)</span>
                      </div>
                      <div className="font-mono text-slate-200 bg-slate-950/80 border border-slate-800/80 rounded px-2.5 py-1.5">
                        {Math.round(calc.totalRiseMm)} mm ÷ 200 mm = {calc.rawRisers.toFixed(2)} ➔ Round UP to{' '}
                        <span className="font-bold text-emerald-400">{calc.numRisers} Risers</span>
                      </div>
                      <div className="text-[11px] text-amber-200/95 bg-amber-500/10 border border-amber-500/30 rounded px-2.5 py-1.5">
                        <strong className="text-amber-300">Teacher Rule:</strong> Always round UP to the next whole riser!
                        {calc.numRisers > 1
                          ? ` If you rounded down to ${calc.roundedDownRisers} risers, each step would be ${calc.roundedDownUnitRiseMm.toFixed(1)} mm, violating the 200 mm NBC maximum.`
                          : ' Rounding down would exceed the 200 mm NBC maximum rise.'}
                      </div>
                    </div>

                    <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 font-mono font-extrabold text-[11px] shrink-0">
                          3
                        </span>
                        <span className="font-bold text-white uppercase tracking-wide text-[11px] sm:text-xs">
                          Step 3 — Find Exact Unit Rise &amp; Imperial Equivalent
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-400">
                        Formula: <span className="text-cyan-300">Exact Unit Rise = Total Rise ÷ Number of Risers (N)</span>
                      </div>
                      <div className="font-mono text-slate-200 bg-slate-950/80 border border-slate-800/80 rounded px-2.5 py-1.5">
                        {Math.round(calc.totalRiseMm)} mm ÷ {calc.numRisers} ={' '}
                        <span className="font-bold text-emerald-400">
                          {calc.unitRiseMm.toFixed(1)} mm ({formatInchesSixteenths(calc.unitRiseIn)})
                        </span>
                      </div>
                    </div>

                    <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 font-mono font-extrabold text-[11px] shrink-0">
                          4
                        </span>
                        <span className="font-bold text-white uppercase tracking-wide text-[11px] sm:text-xs">
                          Step 4 — Find Number of Treads (N - 1) &amp; Total Horizontal Run
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-400">
                        Formula: <span className="text-cyan-300">Treads = Risers - 1</span> &amp;{' '}
                        <span className="text-cyan-300">Total Run = Treads × Unit Run</span>
                      </div>
                      <div className="font-mono text-slate-200 bg-slate-950/80 border border-slate-800/80 rounded px-2.5 py-1.5">
                        {calc.numRisers} - 1 = {calc.numTreads} Treads ➔ {calc.numTreads} × {Math.round(calc.unitRunMm)} mm ={' '}
                        <span className="font-bold text-emerald-400">{calc.totalRunDisplay}</span>
                      </div>
                    </div>

                    <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 font-mono font-extrabold text-[11px] shrink-0">
                          5
                        </span>
                        <span className="font-bold text-white uppercase tracking-wide text-[11px] sm:text-xs">
                          Step 5 — Calculate Stringer Length (Pythagorean Theorem A² + B² = C²)
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-400">
                        Formula: <span className="text-cyan-300">One Step Bridge = √(Unit Rise² + Unit Run²)</span>
                      </div>
                      <div className="font-mono text-slate-200 bg-slate-950/80 border border-slate-800/80 rounded px-2.5 py-2 space-y-1">
                        <div>
                          √({calc.unitRiseMm.toFixed(1)}² + {Math.round(calc.unitRunMm)}²) ={' '}
                          <span className="font-bold text-cyan-300">{calc.unitHypMm.toFixed(1)} mm per step</span>
                        </div>
                        <div className="pt-1 border-t border-slate-800/80 text-[11px]">
                          • <span className="text-slate-400">Span Hypotenuse ({calc.numTreads} Treads):</span>{' '}
                          <span className="font-bold text-emerald-400">{calc.spanStringerDisplay}</span>
                        </div>
                        <div className="text-[11px]">
                          • <span className="text-slate-400">Full Stock Length ({calc.numRisers} Steps):</span>{' '}
                          <span className="font-bold text-amber-300">{calc.fullStockDisplay}</span>{' '}
                          <span className="text-slate-400">(order a {calc.stockOrderFt}&apos; 2x12)</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 font-mono font-extrabold text-[11px] shrink-0">
                          6
                        </span>
                        <span className="font-bold text-white uppercase tracking-wide text-[11px] sm:text-xs">
                          Step 6 — Calculate Minimum Stairwell Rough Opening (R.O.) for Headroom
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-400">
                        Formula:{' '}
                        <span className="text-cyan-300">
                          Headroom Drop = 1950 mm (NBC min headroom) + 286 mm (floor assembly) = 2236 mm
                        </span>
                      </div>
                      <div className="font-mono text-slate-200 bg-slate-950/80 border border-slate-800/80 rounded px-2.5 py-1.5">
                        Risers in Opening = Ceil(2236 ÷ {calc.unitRiseMm.toFixed(1)}) = {calc.headroomDropRisers} Risers ➔ Min R.O. ={' '}
                        {calc.headroomDropRisers} × {Math.round(calc.unitRunMm)} mm ={' '}
                        <span className="font-bold text-amber-300">{calc.minRoDisplay}</span>
                      </div>
                    </div>
                  </>
                )
              ) : (
                <p className="text-slate-400">Enter a non-zero Total Rise above to generate the 6-step worked Red Seal solution.</p>
              )}
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  )
}


function ConcreteImperialDimInput({
  label,
  feetVal,
  setFeetVal,
  inVal,
  setInVal,
  sixVal,
  setSixVal,
  decimalFt,
  quickButtons,
  onToggleInfo,
  infoOpen,
  infoText
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex flex-wrap items-center justify-between gap-1.5">
        <div className="flex items-center gap-1.5">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">
            {label}
          </label>
          {onToggleInfo && (
            <button
              type="button"
              onClick={onToggleInfo}
              className="inline-flex items-center justify-center w-5 h-5 rounded-full text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/15 transition-colors"
            >
              <Info size={13} />
            </button>
          )}
        </div>
        {Number.isFinite(decimalFt) && decimalFt > 0 && (
          <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
            = {decimalFt.toFixed(3)} ft
          </span>
        )}
      </div>

      {infoOpen && infoText && (
        <div className="text-xs text-slate-300 bg-slate-800 border border-slate-700 p-2.5 rounded-lg leading-relaxed">
          {infoText}
        </div>
      )}

      {quickButtons && quickButtons.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pb-0.5">
          {quickButtons.map((btn) => (
            <button
              key={btn.label}
              type="button"
              onClick={btn.onClick}
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border transition-colors ${
                btn.active
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-700 dark:text-emerald-300'
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-emerald-500/50'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-3 gap-2.5">
        <div className="flex flex-col">
          <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1 px-1">
            FEET (&apos;)
          </span>
          <div className="relative">
            <input
              type="number"
              min="0"
              placeholder="0"
              value={feetVal}
              onChange={(e) => setFeetVal(e.target.value)}
              className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl pl-3 pr-8 py-2 text-sm md:text-base font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors"
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono font-extrabold text-slate-400 pointer-events-none">
              FT
            </span>
          </div>
        </div>

        <div className="flex flex-col">
          <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1 px-1">
            INCHES (&quot;)
          </span>
          <div className="relative">
            <input
              type="number"
              min="0"
              placeholder="0"
              value={inVal}
              onChange={(e) => setInVal(e.target.value)}
              className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl pl-3 pr-8 py-2 text-sm md:text-base font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors"
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono font-extrabold text-slate-400 pointer-events-none">
              IN
            </span>
          </div>
        </div>

        <div className="flex flex-col">
          <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1 px-1">
            16THS (/16)
          </span>
          <div className="relative">
            <input
              type="number"
              min="0"
              max="15"
              step="1"
              placeholder="0"
              value={sixVal}
              onChange={(e) => setSixVal(e.target.value)}
              className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl pl-3 pr-9 py-2 text-sm md:text-base font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors"
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono font-extrabold text-slate-400 pointer-events-none">
              /16
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function ConcreteEstimatingModal({ onClose }) {
  const [shapeMode, setShapeMode] = useState('slab') // 'slab' | 'wall' | 'pier'
  const [unitSystem, setUnitSystem] = useState('imperial') // 'imperial' | 'metric'
  const [wastePct, setWastePct] = useState(10) // 5 | 10 | 15
  const [activeTooltip, setActiveTooltip] = useState(null)
  const [calcPulse, setCalcPulse] = useState(false)
  const scrollBodyRef = useRef(null)
  const cadSectionRef = useRef(null)

  // 1. SLAB / PAD Inputs (Default 40' x 40' x 4" = 533.33 ft³ / 19.75 yd³)
  const [slabLFt, setSlabLFt] = useState('40')
  const [slabLIn, setSlabLIn] = useState('0')
  const [slabL16, setSlabL16] = useState('0')

  const [slabWFt, setSlabWFt] = useState('40')
  const [slabWIn, setSlabWIn] = useState('0')
  const [slabW16, setSlabW16] = useState('0')

  const [slabDFt, setSlabDFt] = useState('0')
  const [slabDIn, setSlabDIn] = useState('4')
  const [slabD16, setSlabD16] = useState('0')

  const [slabLMeters, setSlabLMeters] = useState('12.192')
  const [slabWMeters, setSlabWMeters] = useState('12.192')
  const [slabDMm, setSlabDMm] = useState('100')

  // 2. PERIMETER WALL / STRIP FOOTING Inputs (Default 40' x 28' Outside, 8" Wall, 8'-0" Height)
  const [wallOutLFt, setWallOutLFt] = useState('40')
  const [wallOutLIn, setWallOutLIn] = useState('0')
  const [wallOutL16, setWallOutL16] = useState('0')

  const [wallOutWFt, setWallOutWFt] = useState('28')
  const [wallOutWIn, setWallOutWIn] = useState('0')
  const [wallOutW16, setWallOutW16] = useState('0')

  const [wallThickFt, setWallThickFt] = useState('0')
  const [wallThickIn, setWallThickIn] = useState('8')
  const [wallThick16, setWallThick16] = useState('0')

  const [wallHeightFt, setWallHeightFt] = useState('8')
  const [wallHeightIn, setWallHeightIn] = useState('0')
  const [wallHeight16, setWallHeight16] = useState('0')

  const [wallOutLMeters, setWallOutLMeters] = useState('12.0')
  const [wallOutWMeters, setWallOutWMeters] = useState('8.5')
  const [wallThickMm, setWallThickMm] = useState('200')
  const [wallHeightMm, setWallHeightMm] = useState('2400')

  // 3. SONOTUBE / ROUND PIER Inputs (Default 10" Diameter, 4'-0" Depth, Qty 6)
  const [pierDiamIn, setPierDiamIn] = useState('10')
  const [pierDepthFt, setPierDepthFt] = useState('4')
  const [pierDepthIn, setPierDepthIn] = useState('0')
  const [pierDepth16, setPierDepth16] = useState('0')
  const [pierQty, setPierQty] = useState('6')

  const [pierDiamMm, setPierDiamMm] = useState('250')
  const [pierDepthMm, setPierDepthMm] = useState('1200')

  const toFt = (ft, inch, six) =>
    Math.max(0, parseFloat(ft) || 0) +
    Math.max(0, parseFloat(inch) || 0) / 12 +
    Math.max(0, parseFloat(six) || 0) / 192

  const calc = useMemo(() => {
    const FT3_TO_M3 = 0.0283168466
    const wasteFactor = 1 + wastePct / 100

    if (shapeMode === 'slab') {
      if (unitSystem === 'imperial') {
        const L_ft = toFt(slabLFt, slabLIn, slabL16)
        const W_ft = toFt(slabWFt, slabWIn, slabW16)
        const D_ft = toFt(slabDFt, slabDIn, slabD16)
        if (L_ft <= 0 || W_ft <= 0 || D_ft <= 0) return null

        const cubicFeet = L_ft * W_ft * D_ft
        const cubicYards = cubicFeet / 27
        const cubicMeters = cubicFeet * FT3_TO_M3
        const orderYd3 = cubicYards * wasteFactor
        const orderM3 = cubicMeters * wasteFactor
        const bags30kg = Math.ceil(cubicFeet / 0.5)
        const bagsWithWaste = Math.ceil((cubicFeet * wasteFactor) / 0.5)

        const D_totalIn = D_ft * 12

        return {
          shapeMode: 'slab',
          unitSystem: 'imperial',
          L_ft,
          W_ft,
          D_ft,
          D_totalIn,
          cubicFeet,
          cubicYards,
          cubicMeters,
          orderYd3,
          orderM3,
          bags30kg,
          bagsWithWaste,
          svgLength: formatFeetAndInches(L_ft * 12),
          svgWidth: formatFeetAndInches(W_ft * 12),
          svgDepth: `${formatInchesSixteenths(D_totalIn)} (${D_ft.toFixed(3)} FT)`
        }
      } else {
        const L_m = Math.max(0, parseFloat(slabLMeters) || 0)
        const W_m = Math.max(0, parseFloat(slabWMeters) || 0)
        const D_mm = Math.max(0, parseFloat(slabDMm) || 0)
        const D_m = D_mm / 1000
        if (L_m <= 0 || W_m <= 0 || D_m <= 0) return null

        const cubicMeters = L_m * W_m * D_m
        const cubicFeet = cubicMeters / FT3_TO_M3
        const cubicYards = cubicFeet / 27
        const orderYd3 = cubicYards * wasteFactor
        const orderM3 = cubicMeters * wasteFactor
        const bags30kg = Math.ceil(cubicFeet / 0.5)
        const bagsWithWaste = Math.ceil((cubicFeet * wasteFactor) / 0.5)

        return {
          shapeMode: 'slab',
          unitSystem: 'metric',
          L_m,
          W_m,
          D_mm,
          D_m,
          cubicFeet,
          cubicYards,
          cubicMeters,
          orderYd3,
          orderM3,
          bags30kg,
          bagsWithWaste,
          svgLength: `${L_m.toFixed(2)} m`,
          svgWidth: `${W_m.toFixed(2)} m`,
          svgDepth: `${Math.round(D_mm)}mm (${D_m.toFixed(3)} M)`
        }
      }
    }

    if (shapeMode === 'wall') {
      if (unitSystem === 'imperial') {
        const outL_ft = toFt(wallOutLFt, wallOutLIn, wallOutL16)
        const outW_ft = toFt(wallOutWFt, wallOutWIn, wallOutW16)
        const T_ft = toFt(wallThickFt, wallThickIn, wallThick16)
        const H_ft = toFt(wallHeightFt, wallHeightIn, wallHeight16)
        if (outL_ft <= 0 || outW_ft <= 0 || T_ft <= 0 || H_ft <= 0) return null

        const grossPerimFt = 2 * (outL_ft + outW_ft)
        const cornerDeductLinFt = 4 * T_ft
        const centerPerimFt = Math.max(0, grossPerimFt - cornerDeductLinFt)
        const cornerDeductVolFt3 = cornerDeductLinFt * T_ft * H_ft
        const cubicFeet = centerPerimFt * T_ft * H_ft
        if (cubicFeet <= 0) return null

        const cubicYards = cubicFeet / 27
        const cubicMeters = cubicFeet * FT3_TO_M3
        const orderYd3 = cubicYards * wasteFactor
        const orderM3 = cubicMeters * wasteFactor
        const bags30kg = Math.ceil(cubicFeet / 0.5)
        const bagsWithWaste = Math.ceil((cubicFeet * wasteFactor) / 0.5)

        return {
          shapeMode: 'wall',
          unitSystem: 'imperial',
          outL_ft,
          outW_ft,
          T_ft,
          T_in: T_ft * 12,
          H_ft,
          grossPerimFt,
          cornerDeductLinFt,
          centerPerimFt,
          cornerDeductVolFt3,
          cubicFeet,
          cubicYards,
          cubicMeters,
          orderYd3,
          orderM3,
          bags30kg,
          bagsWithWaste,
          svgOutL: formatFeetAndInches(outL_ft * 12),
          svgOutW: formatFeetAndInches(outW_ft * 12),
          svgCenterPerim: `${centerPerimFt.toFixed(2)}'`,
          svgThick: formatInchesSixteenths(T_ft * 12),
          svgHeight: formatFeetAndInches(H_ft * 12)
        }
      } else {
        const outL_m = Math.max(0, parseFloat(wallOutLMeters) || 0)
        const outW_m = Math.max(0, parseFloat(wallOutWMeters) || 0)
        const T_mm = Math.max(0, parseFloat(wallThickMm) || 0)
        const H_mm = Math.max(0, parseFloat(wallHeightMm) || 0)
        const T_m = T_mm / 1000
        const H_m = H_mm / 1000
        if (outL_m <= 0 || outW_m <= 0 || T_m <= 0 || H_m <= 0) return null

        const grossPerimM = 2 * (outL_m + outW_m)
        const cornerDeductLinM = 4 * T_m
        const centerPerimM = Math.max(0, grossPerimM - cornerDeductLinM)
        const cornerDeductVolM3 = cornerDeductLinM * T_m * H_m
        const cubicMeters = centerPerimM * T_m * H_m
        if (cubicMeters <= 0) return null

        const cubicFeet = cubicMeters / FT3_TO_M3
        const cubicYards = cubicFeet / 27
        const orderYd3 = cubicYards * wasteFactor
        const orderM3 = cubicMeters * wasteFactor
        const bags30kg = Math.ceil(cubicFeet / 0.5)
        const bagsWithWaste = Math.ceil((cubicFeet * wasteFactor) / 0.5)

        return {
          shapeMode: 'wall',
          unitSystem: 'metric',
          outL_m,
          outW_m,
          T_mm,
          T_m,
          H_mm,
          H_m,
          grossPerimM,
          cornerDeductLinM,
          centerPerimM,
          cornerDeductVolM3,
          cubicFeet,
          cubicYards,
          cubicMeters,
          orderYd3,
          orderM3,
          bags30kg,
          bagsWithWaste,
          svgOutL: `${outL_m.toFixed(1)}m`,
          svgOutW: `${outW_m.toFixed(1)}m`,
          svgCenterPerim: `${centerPerimM.toFixed(2)}m`,
          svgThick: `${Math.round(T_mm)}mm`,
          svgHeight: `${(H_m).toFixed(2)}m`
        }
      }
    }

    // shapeMode === 'pier'
    const qty = Math.max(1, Math.round(parseFloat(pierQty) || 1))
    if (unitSystem === 'imperial') {
      const diamIn = Math.max(0, parseFloat(pierDiamIn) || 0)
      const depthFt = toFt(pierDepthFt, pierDepthIn, pierDepth16)
      if (diamIn <= 0 || depthFt <= 0) return null

      const radiusIn = diamIn / 2
      const radiusFt = radiusIn / 12
      const onePierFt3 = Math.PI * Math.pow(radiusFt, 2) * depthFt
      const cubicFeet = onePierFt3 * qty
      const cubicYards = cubicFeet / 27
      const cubicMeters = cubicFeet * FT3_TO_M3
      const orderYd3 = cubicYards * wasteFactor
      const orderM3 = cubicMeters * wasteFactor
      const bags30kg = Math.ceil(cubicFeet / 0.5)
      const bagsWithWaste = Math.ceil((cubicFeet * wasteFactor) / 0.5)

      return {
        shapeMode: 'pier',
        unitSystem: 'imperial',
        diamIn,
        radiusIn,
        radiusFt,
        depthFt,
        qty,
        onePierFt3,
        cubicFeet,
        cubicYards,
        cubicMeters,
        orderYd3,
        orderM3,
        bags30kg,
        bagsWithWaste,
        svgDiam: `${diamIn}"`,
        svgRadius: `${radiusIn}" (${radiusFt.toFixed(3)}')`,
        svgPierDepth: formatFeetAndInches(depthFt * 12)
      }
    } else {
      const diamMm = Math.max(0, parseFloat(pierDiamMm) || 0)
      const depthMm = Math.max(0, parseFloat(pierDepthMm) || 0)
      if (diamMm <= 0 || depthMm <= 0) return null

      const radiusMm = diamMm / 2
      const radiusM = radiusMm / 1000
      const depthM = depthMm / 1000
      const onePierM3 = Math.PI * Math.pow(radiusM, 2) * depthM
      const cubicMeters = onePierM3 * qty
      const cubicFeet = cubicMeters / FT3_TO_M3
      const cubicYards = cubicFeet / 27
      const orderYd3 = cubicYards * wasteFactor
      const orderM3 = cubicMeters * wasteFactor
      const bags30kg = Math.ceil(cubicFeet / 0.5)
      const bagsWithWaste = Math.ceil((cubicFeet * wasteFactor) / 0.5)

      return {
        shapeMode: 'pier',
        unitSystem: 'metric',
        diamMm,
        radiusMm,
        radiusM,
        depthMm,
        depthM,
        qty,
        onePierM3,
        cubicFeet,
        cubicYards,
        cubicMeters,
        orderYd3,
        orderM3,
        bags30kg,
        bagsWithWaste,
        svgDiam: `${Math.round(diamMm)}mm`,
        svgRadius: `${Math.round(radiusMm)}mm (${radiusM.toFixed(3)}m)`,
        svgPierDepth: `${depthM.toFixed(2)}m`
      }
    }
  }, [
    shapeMode,
    unitSystem,
    wastePct,
    slabLFt,
    slabLIn,
    slabL16,
    slabWFt,
    slabWIn,
    slabW16,
    slabDFt,
    slabDIn,
    slabD16,
    slabLMeters,
    slabWMeters,
    slabDMm,
    wallOutLFt,
    wallOutLIn,
    wallOutL16,
    wallOutWFt,
    wallOutWIn,
    wallOutW16,
    wallThickFt,
    wallThickIn,
    wallThick16,
    wallHeightFt,
    wallHeightIn,
    wallHeight16,
    wallOutLMeters,
    wallOutWMeters,
    wallThickMm,
    wallHeightMm,
    pierDiamIn,
    pierDepthFt,
    pierDepthIn,
    pierDepth16,
    pierQty,
    pierDiamMm,
    pierDepthMm
  ])

  const handleCalculate = () => {
    setCalcPulse(true)
    setTimeout(() => setCalcPulse(false), 300)
  }

  const toggleInfo = (key) => {
    setActiveTooltip((prev) => (prev === key ? null : key))
  }

  const resultRows = calc
    ? [
        ...(calc.shapeMode === 'wall'
          ? [
              {
                id: 'resWallPerim',
                label: 'Centerline ℄ (Gross - 4T):',
                value:
                  calc.unitSystem === 'imperial'
                    ? `${calc.centerPerimFt.toFixed(2)} ft (Gross ${calc.grossPerimFt.toFixed(1)}')`
                    : `${calc.centerPerimM.toFixed(2)} m (Gross ${calc.grossPerimM.toFixed(2)}m)`,
                valueClass: 'text-cyan-600 dark:text-cyan-400',
                tip:
                  calc.unitSystem === 'imperial'
                    ? `Gross Outside Perimeter = ${calc.grossPerimFt.toFixed(2)} ft. Deducting 4 × Thickness (${calc.cornerDeductLinFt.toFixed(2)} ft = ${calc.cornerDeductVolFt3.toFixed(2)} ft³) prevents double-counting the 4 corners!`
                    : `Gross Outside Perimeter = ${calc.grossPerimM.toFixed(2)} m. Deducting 4 × Thickness (${calc.cornerDeductLinM.toFixed(2)} m = ${calc.cornerDeductVolM3.toFixed(3)} m³) prevents double-counting the 4 corners!`
              }
            ]
          : []),
        {
          id: 'resNetFt3',
          label: 'Net Volume (Cubic Feet):',
          value: `${calc.cubicFeet.toFixed(2)} ft³`,
          valueClass: 'text-slate-900 dark:text-white',
          tip: 'Exact net geometric volume in cubic feet (ft³) before waste allowance (1 m³ = 35.315 ft³).'
        },
        {
          id: 'resNetYd3',
          label: 'Net Volume (Cubic Yards — ÷ 27):',
          value: `${calc.cubicYards.toFixed(2)} yd³`,
          valueClass: 'text-emerald-600 dark:text-emerald-400',
          tip: 'Imperial ready-mix concrete is ordered in Cubic Yards. Because 1 yd = 3 ft, 1 yd³ = 3 × 3 × 3 = 27 ft³ (divide ft³ by 27).'
        },
        {
          id: 'resNetM3',
          label: 'Net Volume (Cubic Meters — m³):',
          value: `${calc.cubicMeters.toFixed(2)} m³`,
          valueClass: 'text-emerald-600 dark:text-emerald-400',
          tip: 'Metric ready-mix concrete is ordered in Cubic Meters (m³). 1 ft³ = 0.0283168 m³ and 1 yd³ = 0.7646 m³.'
        },
        {
          id: 'resOrder',
          label: `Ready-Mix Order (+${wastePct}% Waste):`,
          value: `${calc.orderYd3.toFixed(2)} yd³ • ${calc.orderM3.toFixed(2)} m³`,
          valueClass: 'text-amber-600 dark:text-amber-400',
          tip: `Includes +${wastePct}% allowance for uneven subgrade excavation, form deflection, pump line priming, and jobsite spillage.`
        },
        {
          id: 'resBags',
          label: 'Pre-Mix 30kg Bags (0.50 ft³/bag):',
          value: `${calc.bags30kg.toLocaleString()} bags`,
          valueClass: 'text-cyan-600 dark:text-cyan-400',
          tip: `Standard 30 kg (66 lb) pre-mix bag yields ~0.50 ft³ (0.014 m³). Net = ${calc.bags30kg.toLocaleString()} bags • With +${wastePct}% waste = ${calc.bagsWithWaste.toLocaleString()} bags.`
        }
      ]
    : []

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 p-4 shrink-0 bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500 rounded-lg text-white shrink-0">
              <Layers size={22} />
            </div>
            <div>
              <h3 className="text-slate-900 dark:text-white text-base md:text-lg font-bold uppercase tracking-wider leading-tight">
                CONCRETE ESTIMATING
              </h3>
              <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                SLABS, PERIMETER WALLS &amp; SONOTUBE PIERS
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition-colors p-1">
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Quick Section Switcher Bar */}
        <div className="px-4 py-2 bg-slate-100 dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800 shrink-0 flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollBodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex-1 py-1.5 px-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-[11px] font-mono font-extrabold text-slate-800 dark:text-slate-200 hover:border-emerald-500/60 transition-colors"
          >
            🧮 Calculator &amp; Results
          </button>
          <button
            type="button"
            onClick={() => cadSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            className="flex-1 py-1.5 px-2.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-[11px] font-mono font-extrabold text-emerald-700 dark:text-emerald-300 transition-colors"
          >
            📐 1:1 CAD &amp; Math Teacher ↓
          </button>
        </div>

        {/* Scrollable Body (Block flow prevents flex-shrink crushing of overflow-hidden cards) */}
        <div
          ref={scrollBodyRef}
          className="block space-y-4 p-4 md:p-5 overflow-y-auto custom-scrollbar flex-1 min-h-0 max-h-[82vh]"
        >
          {/* 3-Tab Red Seal Concrete Shape Mode Selector */}
          <div className="grid grid-cols-3 gap-1.5 bg-slate-200 dark:bg-slate-800/90 p-1 rounded-xl shrink-0">
            {[
              { id: 'slab', title: 'Slab / Pad', sub: 'L × W × D' },
              { id: 'wall', title: 'Wall / Footing', sub: '℄ - 4 Corners' },
              { id: 'pier', title: 'Sonotube Pier', sub: 'π × r² × H' }
            ].map((tab) => {
              const active = shapeMode === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setShapeMode(tab.id)}
                  className={`py-2 px-1.5 rounded-lg text-center transition-all ${
                    active
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className="text-[11px] font-extrabold uppercase tracking-wider leading-tight">{tab.title}</div>
                  <div className={`text-[9px] font-mono font-bold mt-0.5 ${active ? 'text-emerald-100' : 'text-slate-500'}`}>
                    {tab.sub}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Imperial / Metric Unit Toggle */}
          <div className="flex bg-slate-200 dark:bg-slate-800 rounded-lg p-1 shrink-0">
            <button
              type="button"
              onClick={() => setUnitSystem('imperial')}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${
                unitSystem === 'imperial'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Imperial (FT / IN / 16THS)
            </button>
            <button
              type="button"
              onClick={() => setUnitSystem('metric')}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${
                unitSystem === 'metric'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Metric (M / MM)
            </button>
          </div>

          {/* Mode-Specific Inputs */}
          <div className="space-y-3.5 shrink-0">
            {shapeMode === 'slab' &&
              (unitSystem === 'imperial' ? (
                <>
                  <ConcreteImperialDimInput
                    label="Slab Length"
                    feetVal={slabLFt}
                    setFeetVal={setSlabLFt}
                    inVal={slabLIn}
                    setInVal={setSlabLIn}
                    sixVal={slabL16}
                    setSixVal={setSlabL16}
                    decimalFt={calc?.L_ft}
                  />
                  <ConcreteImperialDimInput
                    label="Slab Width"
                    feetVal={slabWFt}
                    setFeetVal={setSlabWFt}
                    inVal={slabWIn}
                    setInVal={setSlabWIn}
                    sixVal={slabW16}
                    setSixVal={setSlabW16}
                    decimalFt={calc?.W_ft}
                  />
                  <ConcreteImperialDimInput
                    label="Depth / Thickness"
                    feetVal={slabDFt}
                    setFeetVal={setSlabDFt}
                    inVal={slabDIn}
                    setInVal={setSlabDIn}
                    sixVal={slabD16}
                    setSixVal={setSlabD16}
                    decimalFt={calc?.D_ft}
                    onToggleInfo={() => toggleInfo('slabDepthInfo')}
                    infoOpen={activeTooltip === 'slabDepthInfo'}
                    infoText="Exam Trap: Always convert slab thickness from inches to decimal feet (Inches ÷ 12) before multiplying Length × Width × Depth!"
                    quickButtons={[
                      {
                        label: '4" Slab',
                        active: Number(slabDFt) === 0 && Number(slabDIn) === 4 && Number(slabD16) === 0,
                        onClick: () => {
                          setSlabDFt('0')
                          setSlabDIn('4')
                          setSlabD16('0')
                        }
                      },
                      {
                        label: '6" Garage/Drive',
                        active: Number(slabDFt) === 0 && Number(slabDIn) === 6 && Number(slabD16) === 0,
                        onClick: () => {
                          setSlabDFt('0')
                          setSlabDIn('6')
                          setSlabD16('0')
                        }
                      },
                      {
                        label: '8" Footing',
                        active: Number(slabDFt) === 0 && Number(slabDIn) === 8 && Number(slabD16) === 0,
                        onClick: () => {
                          setSlabDFt('0')
                          setSlabDIn('8')
                          setSlabD16('0')
                        }
                      }
                    ]}
                  />
                </>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1 px-1">
                        LENGTH — METERS (m)
                      </span>
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={slabLMeters}
                          onChange={(e) => setSlabLMeters(e.target.value)}
                          className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl pl-3 pr-8 py-2.5 text-base font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono font-extrabold text-slate-400 pointer-events-none">
                          M
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1 px-1">
                        WIDTH — METERS (m)
                      </span>
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={slabWMeters}
                          onChange={(e) => setSlabWMeters(e.target.value)}
                          className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl pl-3 pr-8 py-2.5 text-base font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono font-extrabold text-slate-400 pointer-events-none">
                          M
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1 px-1">
                      <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                        DEPTH / THICKNESS — MILLIMETERS (mm)
                      </span>
                      <div className="flex items-center gap-1">
                        {[
                          { label: '100mm Slab', val: '100' },
                          { label: '150mm Garage', val: '150' },
                          { label: '200mm Footing', val: '200' }
                        ].map((b) => (
                          <button
                            key={b.val}
                            type="button"
                            onClick={() => setSlabDMm(b.val)}
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border transition-colors ${
                              slabDMm === b.val
                                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-600 dark:text-emerald-300'
                                : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                            }`}
                          >
                            {b.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        value={slabDMm}
                        onChange={(e) => setSlabDMm(e.target.value)}
                        className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl pl-3 pr-10 py-2.5 text-base font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono font-extrabold text-slate-400 pointer-events-none">
                        MM
                      </span>
                    </div>
                  </div>
                </div>
              ))}

            {shapeMode === 'wall' &&
              (unitSystem === 'imperial' ? (
                <>
                  <ConcreteImperialDimInput
                    label="Outside Length"
                    feetVal={wallOutLFt}
                    setFeetVal={setWallOutLFt}
                    inVal={wallOutLIn}
                    setInVal={setWallOutLIn}
                    sixVal={wallOutL16}
                    setSixVal={setWallOutL16}
                    decimalFt={calc?.outL_ft}
                  />
                  <ConcreteImperialDimInput
                    label="Outside Width"
                    feetVal={wallOutWFt}
                    setFeetVal={setWallOutWFt}
                    inVal={wallOutWIn}
                    setInVal={setWallOutWIn}
                    sixVal={wallOutW16}
                    setSixVal={setWallOutW16}
                    decimalFt={calc?.outW_ft}
                  />
                  <ConcreteImperialDimInput
                    label="Wall / Footing Thickness (W)"
                    feetVal={wallThickFt}
                    setFeetVal={setWallThickFt}
                    inVal={wallThickIn}
                    setInVal={setWallThickIn}
                    sixVal={wallThick16}
                    setSixVal={setWallThick16}
                    decimalFt={calc?.T_ft}
                    quickButtons={[
                      {
                        label: '8" Wall',
                        active: Number(wallThickFt) === 0 && Number(wallThickIn) === 8,
                        onClick: () => {
                          setWallThickFt('0')
                          setWallThickIn('8')
                          setWallThick16('0')
                        }
                      },
                      {
                        label: '10" Wall',
                        active: Number(wallThickFt) === 0 && Number(wallThickIn) === 10,
                        onClick: () => {
                          setWallThickFt('0')
                          setWallThickIn('10')
                          setWallThick16('0')
                        }
                      },
                      {
                        label: '16" Footing',
                        active: (Number(wallThickFt) === 1 && Number(wallThickIn) === 4) || (Number(wallThickFt) === 0 && Number(wallThickIn) === 16),
                        onClick: () => {
                          setWallThickFt('1')
                          setWallThickIn('4')
                          setWallThick16('0')
                        }
                      }
                    ]}
                  />
                  <ConcreteImperialDimInput
                    label="Wall Height / Footing Depth (H)"
                    feetVal={wallHeightFt}
                    setFeetVal={setWallHeightFt}
                    inVal={wallHeightIn}
                    setInVal={setWallHeightIn}
                    sixVal={wallHeight16}
                    setSixVal={setWallHeight16}
                    decimalFt={calc?.H_ft}
                    quickButtons={[
                      {
                        label: '8" Footing',
                        active: Number(wallHeightFt) === 0 && Number(wallHeightIn) === 8,
                        onClick: () => {
                          setWallHeightFt('0')
                          setWallHeightIn('8')
                          setWallHeight16('0')
                        }
                      },
                      {
                        label: "4' Frost Wall",
                        active: Number(wallHeightFt) === 4 && Number(wallHeightIn) === 0,
                        onClick: () => {
                          setWallHeightFt('4')
                          setWallHeightIn('0')
                          setWallHeight16('0')
                        }
                      },
                      {
                        label: "8' Bsmt Wall",
                        active: Number(wallHeightFt) === 8 && Number(wallHeightIn) === 0,
                        onClick: () => {
                          setWallHeightFt('8')
                          setWallHeightIn('0')
                          setWallHeight16('0')
                        }
                      }
                    ]}
                  />
                </>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1 px-1">
                        OUTSIDE LENGTH (m)
                      </span>
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          step="0.1"
                          value={wallOutLMeters}
                          onChange={(e) => setWallOutLMeters(e.target.value)}
                          className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl pl-3 pr-8 py-2.5 text-base font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono font-extrabold text-slate-400 pointer-events-none">
                          M
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1 px-1">
                        OUTSIDE WIDTH (m)
                      </span>
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          step="0.1"
                          value={wallOutWMeters}
                          onChange={(e) => setWallOutWMeters(e.target.value)}
                          className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl pl-3 pr-8 py-2.5 text-base font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono font-extrabold text-slate-400 pointer-events-none">
                          M
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1 px-1">
                        THICKNESS (mm)
                      </span>
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          value={wallThickMm}
                          onChange={(e) => setWallThickMm(e.target.value)}
                          className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl pl-3 pr-10 py-2.5 text-base font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono font-extrabold text-slate-400 pointer-events-none">
                          MM
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1 px-1">
                        HEIGHT / DEPTH (mm)
                      </span>
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          value={wallHeightMm}
                          onChange={(e) => setWallHeightMm(e.target.value)}
                          className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl pl-3 pr-10 py-2.5 text-base font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono font-extrabold text-slate-400 pointer-events-none">
                          MM
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

            {shapeMode === 'pier' &&
              (unitSystem === 'imperial' ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col">
                      <div className="flex items-center justify-between mb-1 px-1">
                        <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                          TUBE DIAMETER (&quot;)
                        </span>
                      </div>
                      <div className="relative">
                        <input
                          type="number"
                          min="4"
                          value={pierDiamIn}
                          onChange={(e) => setPierDiamIn(e.target.value)}
                          className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl pl-3 pr-8 py-2 text-base font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                        />
                        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono font-extrabold text-slate-400 pointer-events-none">
                          IN
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {['8', '10', '12', '16'].map((d) => (
                          <button
                            key={d}
                            type="button"
                            onClick={() => setPierDiamIn(d)}
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border transition-colors ${
                              pierDiamIn === d
                                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-600 dark:text-emerald-300'
                                : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                            }`}
                          >
                            {d}&quot;
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1 px-1">
                        NUMBER OF PIERS (QTY)
                      </span>
                      <div className="relative">
                        <input
                          type="number"
                          min="1"
                          step="1"
                          value={pierQty}
                          onChange={(e) => setPierQty(e.target.value)}
                          className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl pl-3 pr-10 py-2 text-base font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                        />
                        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono font-extrabold text-slate-400 pointer-events-none">
                          QTY
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {['1', '4', '6', '8'].map((q) => (
                          <button
                            key={q}
                            type="button"
                            onClick={() => setPierQty(q)}
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border transition-colors ${
                              pierQty === q
                                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-600 dark:text-emerald-300'
                                : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                            }`}
                          >
                            ×{q}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <ConcreteImperialDimInput
                    label="Pier Depth / Height"
                    feetVal={pierDepthFt}
                    setFeetVal={setPierDepthFt}
                    inVal={pierDepthIn}
                    setInVal={setPierDepthIn}
                    sixVal={pierDepth16}
                    setSixVal={setPierDepth16}
                    decimalFt={calc?.depthFt}
                  />
                </>
              ) : (
                <div className="grid grid-cols-3 gap-2.5">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1 px-1">
                      DIAMETER (mm)
                    </span>
                    <input
                      type="number"
                      min="100"
                      value={pierDiamMm}
                      onChange={(e) => setPierDiamMm(e.target.value)}
                      className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-base font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                    <div className="flex gap-1 mt-1">
                      {['200', '250', '300'].map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setPierDiamMm(d)}
                          className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold border ${
                            pierDiamMm === d
                              ? 'bg-emerald-500/20 border-emerald-400 text-emerald-400'
                              : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-500'
                          }`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1 px-1">
                      DEPTH (mm)
                    </span>
                    <input
                      type="number"
                      min="100"
                      value={pierDepthMm}
                      onChange={(e) => setPierDepthMm(e.target.value)}
                      className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-base font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1 px-1">
                      PIERS (QTY)
                    </span>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={pierQty}
                      onChange={(e) => setPierQty(e.target.value)}
                      className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-base font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              ))}

            <button
              type="button"
              onClick={handleCalculate}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase tracking-wider py-3 rounded-xl transition-all shadow-md active:scale-[0.98]"
            >
              Calculate Concrete Volume
            </button>
          </div>

          {/* Quick Jump Pill to 1:1 CAD & Step-by-Step Math Walkthrough */}
          <button
            type="button"
            onClick={() => cadSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            className="w-full shrink-0 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/35 text-emerald-700 dark:text-emerald-300 text-[11px] sm:text-xs font-mono font-extrabold tracking-wide transition-colors"
          >
            <span>📐 Jump to 1:1 CAD &amp; Step-by-Step Math Walkthrough ↓</span>
          </button>

          {/* 1. CALCULATION RESULTS (Full Non-Truncated Labels + Waste Toggle + ⓘ Tooltips) */}
          <div
            className={`shrink-0 bg-slate-100 dark:bg-slate-800/50 border rounded-xl p-4 md:p-5 transition-colors ${
              calcPulse ? 'border-emerald-400' : 'border-slate-300 dark:border-slate-700'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3.5 border-b border-slate-200 dark:border-slate-700 pb-2.5">
              <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                Calculation Results
              </h4>
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 mr-1 uppercase">
                  Waste:
                </span>
                {[5, 10, 15].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => setWastePct(pct)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-extrabold border transition-colors ${
                      wastePct === pct
                        ? 'bg-amber-500/20 border-amber-400 text-amber-700 dark:text-amber-300'
                        : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    +{pct}%
                  </button>
                ))}
              </div>
            </div>

            {calc ? (
              <div className="space-y-2.5 text-xs sm:text-sm">
                {resultRows.map((row, idx, arr) => (
                  <div
                    key={row.id}
                    className={`flex flex-col ${
                      idx < arr.length - 1 ? 'border-b border-slate-200/60 dark:border-slate-700/60 pb-2.5' : 'pt-0.5'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="font-sans font-semibold text-slate-700 dark:text-slate-200 leading-snug">
                          {row.label}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleInfo(row.id)}
                          aria-label={`Info about ${row.label}`}
                          className={`inline-flex items-center justify-center w-5 h-5 rounded-full shrink-0 transition-colors ${
                            activeTooltip === row.id
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'text-slate-400 hover:text-emerald-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                          }`}
                        >
                          <Info size={13} />
                        </button>
                      </div>

                      <div className={`ml-auto font-mono font-bold text-right whitespace-nowrap shrink-0 ${row.valueClass}`}>
                        {row.value}
                      </div>
                    </div>

                    {activeTooltip === row.id && (
                      <div className="text-xs text-emerald-100 bg-slate-900 border border-emerald-500/30 px-3 py-2 rounded-lg mt-2 leading-relaxed">
                        {row.tip}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs font-mono text-slate-400">Enter non-zero dimensions above to compute live concrete volume.</p>
            )}
          </div>

          {/* 2. LIVE 1:1 CAD CONCRETE DIAGRAM (viewBox="0 0 360 175") */}
          <div ref={cadSectionRef} className="space-y-4 shrink-0 scroll-mt-2">
          {calc && (
            <div className="bg-[#0a192f] border border-slate-700/90 rounded-xl overflow-hidden shadow-lg shrink-0">
              <div className="px-3 py-1.5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
                <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-emerald-400">
                  {calc.shapeMode === 'slab'
                    ? 'LIVE 1:1 CAD SLAB & SUBBASE SECTION'
                    : calc.shapeMode === 'wall'
                    ? 'LIVE 1:1 CAD PERIMETER WALL (4-CORNER DEDUCTION)'
                    : 'LIVE 1:1 CAD CYLINDRICAL SONOTUBE PIER'}
                </span>
                <span className="text-[10px] font-mono font-bold text-slate-400">
                  1 YD³ = 27 FT³
                </span>
              </div>

              <svg viewBox="0 0 360 175" className="w-full h-auto min-h-[175px] block shrink-0">
                <defs>
                  <pattern id="concreteCadGrid" width="18" height="18" patternUnits="userSpaceOnUse">
                    <path d="M 18 0 L 0 0 0 18" fill="none" stroke="#172a46" strokeWidth="0.65" />
                  </pattern>
                </defs>
                <rect x="0" y="0" width="360" height="175" fill="#0a192f" />
                <rect x="0" y="0" width="360" height="175" fill="url(#concreteCadGrid)" />

                {calc.shapeMode === 'slab' && (
                  <>
                    {/* Compacted Gravel Subbase Layer */}
                    <polygon
                      points="46,102 132,126 242,94 242,102 132,135 46,110"
                      fill="#1e293b"
                      stroke="#64748b"
                      strokeWidth="1.2"
                      strokeDasharray="3 2"
                    />

                    {/* Isometric 3D Concrete Slab Deck & Vertical Cut Faces */}
                    <polygon points="52,88 156,56 236,80 132,112" fill="#334155" stroke="#34d399" strokeWidth="1.6" />
                    <polygon points="52,88 132,112 132,126 52,102" fill="#1e293b" stroke="#34d399" strokeWidth="1.5" />
                    <polygon points="132,112 236,80 236,94 132,126" fill="#0f172a" stroke="#34d399" strokeWidth="1.5" />

                    {/* Subtle Rebar Mesh Grid Lines on Slab Deck */}
                    <line x1="78" y1="80" x2="158" y2="104" stroke="#22d3ee" strokeWidth="0.8" opacity="0.45" />
                    <line x1="104" y1="72" x2="184" y2="96" stroke="#22d3ee" strokeWidth="0.8" opacity="0.45" />
                    <line x1="130" y1="64" x2="210" y2="88" stroke="#22d3ee" strokeWidth="0.8" opacity="0.45" />
                    <line x1="72" y1="94" x2="176" y2="62" stroke="#22d3ee" strokeWidth="0.8" opacity="0.45" />
                    <line x1="102" y1="103" x2="206" y2="71" stroke="#22d3ee" strokeWidth="0.8" opacity="0.45" />

                    {/* Order Callout Leader to Top Pill */}
                    <line x1="144" y1="78" x2="144" y2="21" stroke="#34d399" strokeWidth="1.3" strokeDasharray="3 2.5" />

                    {/* Slab Length Dimension Arrow (Back-Left Edge) */}
                    <line x1="48" y1="81" x2="152" y2="49" stroke="#38bdf8" strokeWidth="1.6" />
                    <circle cx="48" cy="81" r="2" fill="#38bdf8" />
                    <circle cx="152" cy="49" r="2" fill="#38bdf8" />
                    <line x1="88" y1="68" x2="88" y2="47" stroke="#38bdf8" strokeWidth="1.2" strokeDasharray="2.5 2" />

                    {/* Slab Width Dimension Arrow (Back-Right Edge) */}
                    <line x1="160" y1="51" x2="240" y2="75" stroke="#fbbf24" strokeWidth="1.6" />
                    <circle cx="160" cy="51" r="2" fill="#fbbf24" />
                    <circle cx="240" cy="75" r="2" fill="#fbbf24" />
                    <line x1="212" y1="67" x2="252" y2="40" stroke="#fbbf24" strokeWidth="1.2" strokeDasharray="2.5 2" />

                    {/* Slab Thickness Vertical Gauge on Right Corner */}
                    <line x1="238" y1="80" x2="254" y2="80" stroke="#c084fc" strokeWidth="1.2" />
                    <line x1="238" y1="94" x2="254" y2="94" stroke="#c084fc" strokeWidth="1.2" />
                    <line x1="249" y1="80" x2="249" y2="146" stroke="#c084fc" strokeWidth="1.5" strokeDasharray="2.5 2" />

                    {/* Opaque #0a192f Dynamic Callout Pills Drawn AFTER All Lines */}
                    <StairSvgPill
                      x={8}
                      y={14}
                      align="start"
                      maxWidth={270}
                      text={`ORDER (+${wastePct}%): ${calc.orderYd3.toFixed(2)} YD³ (${calc.orderM3.toFixed(2)} M³)`}
                      fontSize={7.1}
                      color="#6ee7b7"
                      borderColor="#059669"
                    />
                    <StairSvgPill
                      x={8}
                      y={39}
                      align="start"
                      maxWidth={150}
                      text={`LENGTH: ${calc.svgLength}`}
                      fontSize={7.1}
                      color="#7dd3fc"
                      borderColor="#0284c7"
                    />
                    <StairSvgPill
                      x={352}
                      y={39}
                      align="end"
                      maxWidth={150}
                      text={`WIDTH: ${calc.svgWidth}`}
                      fontSize={7.1}
                      color="#fde68a"
                      borderColor="#d97706"
                    />
                    <StairSvgPill
                      x={8}
                      y={154}
                      align="start"
                      maxWidth={168}
                      text={`NET: ${calc.cubicFeet.toFixed(1)} FT³ (${calc.cubicYards.toFixed(2)} YD³)`}
                      fontSize={6.9}
                      color="#cbd5e1"
                      borderColor="#475569"
                    />
                    <StairSvgPill
                      x={352}
                      y={154}
                      align="end"
                      maxWidth={168}
                      text={`THICKNESS: ${calc.svgDepth}`}
                      fontSize={6.9}
                      color="#e9d5ff"
                      borderColor="#9333ea"
                    />
                  </>
                )}

                {calc.shapeMode === 'wall' && (
                  <>
                    {/* Top-Down Perimeter Foundation Wall Plan (x=54..218, y=46..130) */}
                    <rect x="54" y="46" width="164" height="84" fill="#334155" stroke="#94a3b8" strokeWidth="1.5" />
                    <rect x="70" y="62" width="132" height="52" fill="#0a192f" stroke="#94a3b8" strokeWidth="1.2" />

                    {/* 4 Corner Overlap Squares Highlighted in Red/Amber */}
                    {[
                      { x: 54, y: 46 },
                      { x: 202, y: 46 },
                      { x: 54, y: 114 },
                      { x: 202, y: 114 }
                    ].map((c, idx) => (
                      <g key={idx}>
                        <rect x={c.x} y={c.y} width="16" height="16" fill="#7f1d1d" stroke="#f87171" strokeWidth="1.5" />
                        <line x1={c.x} y1={c.y} x2={c.x + 16} y2={c.y + 16} stroke="#fca5a5" strokeWidth="1" />
                        <line x1={c.x + 16} y1={c.y} x2={c.x} y2={c.y + 16} stroke="#fca5a5" strokeWidth="1" />
                      </g>
                    ))}

                    {/* True Centerline (℄) Dashed Cyan Loop */}
                    <rect
                      x="62"
                      y="54"
                      width="148"
                      height="68"
                      fill="none"
                      stroke="#22d3ee"
                      strokeWidth="1.5"
                      strokeDasharray="4 2.5"
                    />

                    {/* Leaders to Pills */}
                    <line x1="62" y1="46" x2="62" y2="21" stroke="#f87171" strokeWidth="1.3" strokeDasharray="2.5 2" />
                    <line x1="210" y1="46" x2="210" y2="21" stroke="#f87171" strokeWidth="1.3" strokeDasharray="2.5 2" />
                    <line x1="210" y1="88" x2="228" y2="88" stroke="#22d3ee" strokeWidth="1.3" strokeDasharray="2.5 2" />

                    {/* Opaque #0a192f Dynamic Callout Pills */}
                    <StairSvgPill
                      x={8}
                      y={14}
                      align="start"
                      maxWidth={344}
                      text="DEDUCT 4 CORNERS: PERIM ℄ = OUTSIDE - (4 × THICK)"
                      fontSize={6.9}
                      color="#fca5a5"
                      borderColor="#ef4444"
                    />
                    <StairSvgPill
                      x={352}
                      y={58}
                      align="end"
                      maxWidth={124}
                      text={`OUT: ${calc.svgOutL}×${calc.svgOutW}`}
                      fontSize={6.8}
                      color="#fde68a"
                      borderColor="#d97706"
                    />
                    <StairSvgPill
                      x={352}
                      y={88}
                      align="end"
                      maxWidth={124}
                      text={`℄ LEN: ${calc.svgCenterPerim}`}
                      fontSize={6.9}
                      color="#67e8f9"
                      borderColor="#0284c7"
                    />
                    <StairSvgPill
                      x={352}
                      y={118}
                      align="end"
                      maxWidth={124}
                      text={`T×H: ${calc.svgThick}×${calc.svgHeight}`}
                      fontSize={6.8}
                      color="#cbd5e1"
                      borderColor="#475569"
                    />
                    <StairSvgPill
                      x={8}
                      y={155}
                      align="start"
                      maxWidth={344}
                      text={`NET: ${calc.cubicYards.toFixed(2)} YD³ • ORDER (+${wastePct}%): ${calc.orderYd3.toFixed(2)} YD³ (${calc.orderM3.toFixed(2)} M³)`}
                      fontSize={6.9}
                      color="#6ee7b7"
                      borderColor="#059669"
                    />
                  </>
                )}

                {calc.shapeMode === 'pier' && (
                  <>
                    {/* Cylindrical Concrete Sonotube Pier (x=62..134, y=48..126) */}
                    <path
                      d="M 62,48 L 62,124 A 36,10 0 0,0 134,124 L 134,48 Z"
                      fill="#334155"
                      stroke="#94a3b8"
                      strokeWidth="1.6"
                    />
                    <line x1="62" y1="70" x2="134" y2="82" stroke="#64748b" strokeWidth="1" strokeDasharray="3 2" />
                    <line x1="62" y1="94" x2="134" y2="106" stroke="#64748b" strokeWidth="1" strokeDasharray="3 2" />
                    <ellipse cx="98" cy="48" rx="36" ry="11" fill="#1e293b" stroke="#34d399" strokeWidth="1.8" />

                    {/* Center Dot & Cyan Radius Vector (r = D / 2) */}
                    <circle cx="98" cy="48" r="2.2" fill="#fbbf24" />
                    <line x1="98" y1="48" x2="134" y2="48" stroke="#22d3ee" strokeWidth="2.4" />

                    {/* Top Diameter Arrow (y=30, x=62..134) */}
                    <line x1="62" y1="26" x2="62" y2="44" stroke="#fbbf24" strokeWidth="1" strokeDasharray="2 2" />
                    <line x1="134" y1="26" x2="134" y2="44" stroke="#fbbf24" strokeWidth="1" strokeDasharray="2 2" />
                    <line x1="62" y1="30" x2="134" y2="30" stroke="#fbbf24" strokeWidth="1.7" />
                    <polygon points="62,30 67.5,27.5 67.5,32.5" fill="#fbbf24" />
                    <polygon points="134,30 128.5,27.5 128.5,32.5" fill="#fbbf24" />
                    <line x1="98" y1="30" x2="98" y2="21" stroke="#fbbf24" strokeWidth="1.2" strokeDasharray="2 2" />

                    {/* Left Pier Height Arrow (x=46, y=48..126) */}
                    <line x1="42" y1="48" x2="59" y2="48" stroke="#38bdf8" strokeWidth="1" strokeDasharray="2 2" />
                    <line x1="42" y1="126" x2="68" y2="126" stroke="#38bdf8" strokeWidth="1" strokeDasharray="2 2" />
                    <line x1="46" y1="48" x2="46" y2="126" stroke="#38bdf8" strokeWidth="1.8" />
                    <polygon points="46,48 43.5,53.5 48.5,53.5" fill="#38bdf8" />
                    <polygon points="46,126 43.5,120.5 48.5,120.5" fill="#38bdf8" />

                    {/* Leader to Right Pills */}
                    <line x1="134" y1="54" x2="152" y2="54" stroke="#38bdf8" strokeWidth="1.2" strokeDasharray="2 2" />

                    {/* Opaque #0a192f Dynamic Callout Pills */}
                    <StairSvgPill
                      x={8}
                      y={13}
                      align="start"
                      maxWidth={344}
                      text={`DIAMETER (D): ${calc.svgDiam} ➔ RADIUS (r = D÷2): ${calc.svgRadius}`}
                      fontSize={6.9}
                      color="#fde68a"
                      borderColor="#d97706"
                    />
                    <StairSvgPill
                      x={352}
                      y={54}
                      align="end"
                      maxWidth={198}
                      text={`DEPTH (H): ${calc.svgPierDepth} × QTY: ${calc.qty}`}
                      fontSize={6.9}
                      color="#7dd3fc"
                      borderColor="#0284c7"
                    />
                    <StairSvgPill
                      x={352}
                      y={86}
                      align="end"
                      maxWidth={198}
                      text={`V = 3.1416 × r² × H × ${calc.qty} = ${calc.cubicFeet.toFixed(2)} FT³`}
                      fontSize={6.8}
                      color="#67e8f9"
                      borderColor="#0891b2"
                    />
                    <StairSvgPill
                      x={352}
                      y={118}
                      align="end"
                      maxWidth={198}
                      text={`30kg BAGS: ${calc.bags30kg.toLocaleString()} (~0.50 FT³/BAG)`}
                      fontSize={6.8}
                      color="#fdba74"
                      borderColor="#ea580c"
                    />
                    <StairSvgPill
                      x={8}
                      y={155}
                      align="start"
                      maxWidth={344}
                      text={`ORDER (+${wastePct}%): ${calc.orderYd3.toFixed(2)} YD³ (${calc.orderM3.toFixed(2)} M³) • NET: ${calc.cubicYards.toFixed(2)} YD³`}
                      fontSize={6.9}
                      color="#6ee7b7"
                      borderColor="#059669"
                    />
                  </>
                )}
              </svg>
            </div>
          )}

          {/* 3. ALWAYS-VISIBLE "HOW TO DO THE MATH (RED SEAL STEP-BY-STEP TEACHER)" SECTION */}
          <div className="bg-slate-950 border border-emerald-500/35 rounded-xl overflow-hidden shadow-lg shrink-0">
            <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400 shrink-0">
                <BookOpen size={16} />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider leading-tight">
                  HOW TO DO THE MATH (RED SEAL STEP-BY-STEP TEACHER)
                </h4>
                <p className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest mt-0.5">
                  RED SEAL MATH TEACHER — 4-STEP WORKED CONCRETE SOLUTION
                </p>
              </div>
            </div>

            <div className="p-3.5 sm:p-4 space-y-3 text-xs text-slate-300 leading-relaxed">
              {calc ? (
                <>
                  {/* STEP 1 */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 font-mono font-extrabold text-[11px] shrink-0">
                        1
                      </span>
                      <span className="font-bold text-white uppercase tracking-wide text-[11px] sm:text-xs">
                        Step 1 — Convert All Dimensions to the Same Unit (Feet or Meters)
                      </span>
                    </div>
                    <div className="text-[11px] text-amber-200/95 bg-amber-500/10 border border-amber-500/30 rounded px-2.5 py-1.5">
                      <strong className="text-amber-300">#1 Exam Trap:</strong> Never multiply Feet × Feet × Inches! Always divide inches by 12 (e.g. 4&quot; ÷ 12 = 0.3333 ft) or convert mm to meters (100 mm ÷ 1000 = 0.100 m) before multiplying.
                    </div>
                    <div className="font-mono text-slate-200 bg-slate-950/80 border border-slate-800/80 rounded px-2.5 py-1.5 text-[11px]">
                      {calc.shapeMode === 'slab' &&
                        (calc.unitSystem === 'imperial' ? (
                          <>
                            Length = <span className="text-emerald-400 font-bold">{calc.L_ft.toFixed(3)} ft</span> • Width ={' '}
                            <span className="text-emerald-400 font-bold">{calc.W_ft.toFixed(3)} ft</span> • Depth ={' '}
                            {calc.D_totalIn.toFixed(2)}&quot; ÷ 12 ={' '}
                            <span className="text-emerald-400 font-bold">{calc.D_ft.toFixed(4)} ft</span>
                          </>
                        ) : (
                          <>
                            Length = <span className="text-emerald-400 font-bold">{calc.L_m.toFixed(3)} m</span> • Width ={' '}
                            <span className="text-emerald-400 font-bold">{calc.W_m.toFixed(3)} m</span> • Depth ={' '}
                            {Math.round(calc.D_mm)} mm ÷ 1000 ={' '}
                            <span className="text-emerald-400 font-bold">{calc.D_m.toFixed(3)} m</span>
                          </>
                        ))}

                      {calc.shapeMode === 'wall' &&
                        (calc.unitSystem === 'imperial' ? (
                          <>
                            Out L = <span className="text-emerald-400 font-bold">{calc.outL_ft.toFixed(2)} ft</span> • Out W ={' '}
                            <span className="text-emerald-400 font-bold">{calc.outW_ft.toFixed(2)} ft</span> • Thickness ={' '}
                            {calc.T_in.toFixed(1)}&quot; ÷ 12 ={' '}
                            <span className="text-emerald-400 font-bold">{calc.T_ft.toFixed(4)} ft</span> • Height ={' '}
                            <span className="text-emerald-400 font-bold">{calc.H_ft.toFixed(2)} ft</span>
                          </>
                        ) : (
                          <>
                            Out L = <span className="text-emerald-400 font-bold">{calc.outL_m.toFixed(2)} m</span> • Out W ={' '}
                            <span className="text-emerald-400 font-bold">{calc.outW_m.toFixed(2)} m</span> • Thickness ={' '}
                            {Math.round(calc.T_mm)} mm ÷ 1000 ={' '}
                            <span className="text-emerald-400 font-bold">{calc.T_m.toFixed(3)} m</span> • Height ={' '}
                            <span className="text-emerald-400 font-bold">{calc.H_m.toFixed(3)} m</span>
                          </>
                        ))}

                      {calc.shapeMode === 'pier' &&
                        (calc.unitSystem === 'imperial' ? (
                          <>
                            Radius (r) = ({calc.diamIn}&quot; ÷ 2) ÷ 12 = {calc.radiusIn}&quot; ÷ 12 ={' '}
                            <span className="text-emerald-400 font-bold">{calc.radiusFt.toFixed(4)} ft</span> • Depth (H) ={' '}
                            <span className="text-emerald-400 font-bold">{calc.depthFt.toFixed(2)} ft</span>
                          </>
                        ) : (
                          <>
                            Radius (r) = ({Math.round(calc.diamMm)} mm ÷ 2) ÷ 1000 ={' '}
                            <span className="text-emerald-400 font-bold">{calc.radiusM.toFixed(4)} m</span> • Depth (H) ={' '}
                            <span className="text-emerald-400 font-bold">{calc.depthM.toFixed(3)} m</span>
                          </>
                        ))}
                    </div>
                  </div>

                  {/* STEP 2 */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 font-mono font-extrabold text-[11px] shrink-0">
                        2
                      </span>
                      <span className="font-bold text-white uppercase tracking-wide text-[11px] sm:text-xs">
                        Step 2 — Calculate Net Cubic Volume (ft³ or m³)
                      </span>
                    </div>

                    {calc.shapeMode === 'slab' && (
                      <>
                        <div className="text-[11px] font-mono text-slate-400">
                          Formula: <span className="text-emerald-300">Net Volume = Length × Width × Depth</span>
                        </div>
                        <div className="font-mono text-slate-200 bg-slate-950/80 border border-slate-800/80 rounded px-2.5 py-1.5 text-[11px]">
                          {calc.unitSystem === 'imperial' ? (
                            <>
                              {calc.L_ft.toFixed(2)} ft × {calc.W_ft.toFixed(2)} ft × {calc.D_ft.toFixed(4)} ft ={' '}
                              <span className="font-bold text-emerald-400">{calc.cubicFeet.toFixed(2)} ft³</span>
                            </>
                          ) : (
                            <>
                              {calc.L_m.toFixed(2)} m × {calc.W_m.toFixed(2)} m × {calc.D_m.toFixed(3)} m ={' '}
                              <span className="font-bold text-emerald-400">
                                {calc.cubicMeters.toFixed(2)} m³ ({calc.cubicFeet.toFixed(2)} ft³)
                              </span>
                            </>
                          )}
                        </div>
                      </>
                    )}

                    {calc.shapeMode === 'wall' && (
                      <>
                        <div className="text-[11px] font-mono text-slate-400">
                          Formula:{' '}
                          <span className="text-emerald-300">
                            Centerline Length (℄) = Outside Perimeter - (4 × Wall Thickness)
                          </span>{' '}
                          so the 4 corners aren&apos;t counted twice!
                        </div>
                        <div className="font-mono text-slate-200 bg-slate-950/80 border border-slate-800/80 rounded px-2.5 py-2 space-y-1 text-[11px]">
                          {calc.unitSystem === 'imperial' ? (
                            <>
                              <div>
                                • Gross Outside Perimeter = 2 × ({calc.outL_ft.toFixed(2)} + {calc.outW_ft.toFixed(2)}) ={' '}
                                <span className="text-slate-300">{calc.grossPerimFt.toFixed(2)} ft</span>
                              </div>
                              <div>
                                • True Centerline (℄) = {calc.grossPerimFt.toFixed(2)} - (4 × {calc.T_ft.toFixed(4)}) ={' '}
                                <span className="text-cyan-300 font-bold">{calc.centerPerimFt.toFixed(2)} ft</span>{' '}
                                <span className="text-rose-400">(deducts {calc.cornerDeductVolFt3.toFixed(2)} ft³ at 4 corners)</span>
                              </div>
                              <div className="pt-1 border-t border-slate-800/80">
                                • Net Volume = {calc.centerPerimFt.toFixed(2)} ft × {calc.T_ft.toFixed(4)} ft × {calc.H_ft.toFixed(2)} ft ={' '}
                                <span className="font-bold text-emerald-400">{calc.cubicFeet.toFixed(2)} ft³</span>
                              </div>
                            </>
                          ) : (
                            <>
                              <div>
                                • Gross Outside Perimeter = 2 × ({calc.outL_m.toFixed(2)} + {calc.outW_m.toFixed(2)}) ={' '}
                                <span className="text-slate-300">{calc.grossPerimM.toFixed(2)} m</span>
                              </div>
                              <div>
                                • True Centerline (℄) = {calc.grossPerimM.toFixed(2)} - (4 × {calc.T_m.toFixed(3)}) ={' '}
                                <span className="text-cyan-300 font-bold">{calc.centerPerimM.toFixed(2)} m</span>{' '}
                                <span className="text-rose-400">(deducts {calc.cornerDeductVolM3.toFixed(3)} m³ at 4 corners)</span>
                              </div>
                              <div className="pt-1 border-t border-slate-800/80">
                                • Net Volume = {calc.centerPerimM.toFixed(2)} m × {calc.T_m.toFixed(3)} m × {calc.H_m.toFixed(2)} m ={' '}
                                <span className="font-bold text-emerald-400">
                                  {calc.cubicMeters.toFixed(2)} m³ ({calc.cubicFeet.toFixed(2)} ft³)
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      </>
                    )}

                    {calc.shapeMode === 'pier' && (
                      <>
                        <div className="text-[11px] font-mono text-slate-400">
                          Formula: <span className="text-emerald-300">Volume = π (3.1416) × r² × Height × Qty</span>
                        </div>
                        <div className="font-mono text-slate-200 bg-slate-950/80 border border-slate-800/80 rounded px-2.5 py-1.5 text-[11px]">
                          {calc.unitSystem === 'imperial' ? (
                            <>
                              3.1416 × ({calc.radiusFt.toFixed(4)}²) × {calc.depthFt.toFixed(2)} ft × {calc.qty} piers ={' '}
                              <span className="font-bold text-emerald-400">{calc.cubicFeet.toFixed(2)} ft³</span>{' '}
                              <span className="text-slate-400">({calc.onePierFt3.toFixed(2)} ft³ / pier)</span>
                            </>
                          ) : (
                            <>
                              3.1416 × ({calc.radiusM.toFixed(4)}²) × {calc.depthM.toFixed(2)} m × {calc.qty} piers ={' '}
                              <span className="font-bold text-emerald-400">
                                {calc.cubicMeters.toFixed(3)} m³ ({calc.cubicFeet.toFixed(2)} ft³)
                              </span>
                            </>
                          )}
                        </div>
                      </>
                    )}
                  </div>

                  {/* STEP 3 */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 font-mono font-extrabold text-[11px] shrink-0">
                        3
                      </span>
                      <span className="font-bold text-white uppercase tracking-wide text-[11px] sm:text-xs">
                        Step 3 — Convert Cubic Feet (ft³) to Cubic Yards (yd³) &amp; Cubic Meters (m³)
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      <strong className="text-cyan-300">Why Divide by 27?</strong> 1 Cubic Yard is a cube measuring 3 ft × 3 ft × 3 ft (3 × 3 × 3 = 27 ft³).
                    </div>
                    <div className="font-mono text-slate-200 bg-slate-950/80 border border-slate-800/80 rounded px-2.5 py-1.5 text-[11px]">
                      {calc.cubicFeet.toFixed(2)} ft³ ÷ 27 ={' '}
                      <span className="font-bold text-emerald-400">{calc.cubicYards.toFixed(2)} yd³</span> •{' '}
                      {calc.cubicYards.toFixed(2)} yd³ × 0.7646 ={' '}
                      <span className="font-bold text-emerald-400">{calc.cubicMeters.toFixed(2)} m³</span>
                    </div>
                  </div>

                  {/* STEP 4 */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 font-mono font-extrabold text-[11px] shrink-0">
                        4
                      </span>
                      <span className="font-bold text-white uppercase tracking-wide text-[11px] sm:text-xs">
                        Step 4 — Add Waste Factor (+{wastePct}%) for Subgrade Variations &amp; Spillage
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-400">
                      Formula:{' '}
                      <span className="text-emerald-300">
                        Ready-Mix Order = Net Volume × {(1 + wastePct / 100).toFixed(2)}
                      </span>
                    </div>
                    <div className="font-mono text-slate-200 bg-slate-950/80 border border-slate-800/80 rounded px-2.5 py-1.5 text-[11px]">
                      {calc.cubicYards.toFixed(2)} yd³ × {(1 + wastePct / 100).toFixed(2)} ={' '}
                      <span className="font-bold text-amber-300">{calc.orderYd3.toFixed(2)} yd³</span> ({calc.cubicMeters.toFixed(2)} m³ ×{' '}
                      {(1 + wastePct / 100).toFixed(2)} ={' '}
                      <span className="font-bold text-amber-300">{calc.orderM3.toFixed(2)} m³</span>)
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-slate-400">Enter non-zero dimensions above to view the 4-step worked Red Seal solution.</p>
              )}
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  )
}



const BFM_LUMBER_PRESETS = [
  { id: '1x6', label: '1x6', nomT: 1, nomW: 6, actTIn: 0.75, actTStr: '3/4"', actWIn: 5.5, actWStr: '5-1/2"', mmT: 19, mmW: 140 },
  { id: '2x4', label: '2x4', nomT: 2, nomW: 4, actTIn: 1.5, actTStr: '1-1/2"', actWIn: 3.5, actWStr: '3-1/2"', mmT: 38, mmW: 89 },
  { id: '2x6', label: '2x6', nomT: 2, nomW: 6, actTIn: 1.5, actTStr: '1-1/2"', actWIn: 5.5, actWStr: '5-1/2"', mmT: 38, mmW: 140 },
  { id: '2x8', label: '2x8', nomT: 2, nomW: 8, actTIn: 1.5, actTStr: '1-1/2"', actWIn: 7.25, actWStr: '7-1/4"', mmT: 38, mmW: 184 },
  { id: '2x10', label: '2x10', nomT: 2, nomW: 10, actTIn: 1.5, actTStr: '1-1/2"', actWIn: 9.25, actWStr: '9-1/4"', mmT: 38, mmW: 235 },
  { id: '2x12', label: '2x12', nomT: 2, nomW: 12, actTIn: 1.5, actTStr: '1-1/2"', actWIn: 11.25, actWStr: '11-1/4"', mmT: 38, mmW: 286 },
  { id: '4x4', label: '4x4', nomT: 4, nomW: 4, actTIn: 3.5, actTStr: '3-1/2"', actWIn: 3.5, actWStr: '3-1/2"', mmT: 89, mmW: 89 },
  { id: '6x6', label: '6x6', nomT: 6, nomW: 6, actTIn: 5.5, actTStr: '5-1/2"', actWIn: 5.5, actWStr: '5-1/2"', mmT: 140, mmW: 140 }
]

function getDressedDimFromNominal(nom) {
  if (nom <= 0) return 0
  if (nom <= 1) return Math.max(0.25, nom - 0.25)
  if (nom < 8) return nom - 0.5
  return nom - 0.75
}

function BFMModal({ onClose }) {
  const [unitSystem, setUnitSystem] = useState('imperial')

  // Default to 2x6 x 16'-0" x 20 pcs @ $1,250 / MBF with +10% Waste
  const [nomThickInput, setNomThickInput] = useState('2')
  const [nomWidthInput, setNomWidthInput] = useState('6')

  const [lengthFeet, setLengthFeet] = useState('16')
  const [lengthInches, setLengthInches] = useState('0')
  const [lengthSixteenths, setLengthSixteenths] = useState('0')

  // Metric Dressed Inputs (synced with presets, e.g., 38 x 140 mm x 4.88 m)
  const [dressedThickMmInput, setDressedThickMmInput] = useState('38')
  const [dressedWidthMmInput, setDressedWidthMmInput] = useState('140')
  const [lengthMetersInput, setLengthMetersInput] = useState('4.88')

  const [quantityInput, setQuantityInput] = useState('20')
  const [priceMode, setPriceMode] = useState('mbf') // 'mbf' ($ / 1,000 BFM) | 'bfm' ($ / 1 BFM)
  const [unitPriceInput, setUnitPriceInput] = useState('1250')
  const [wastePct, setWastePct] = useState(10) // 0 | 5 | 10

  const [activeTooltip, setActiveTooltip] = useState(null)
  const [calcPulse, setCalcPulse] = useState(false)
  const scrollBodyRef = useRef(null)
  const cadSectionRef = useRef(null)

  const handleSelectPreset = (preset) => {
    setNomThickInput(String(preset.nomT))
    setNomWidthInput(String(preset.nomW))
    setDressedThickMmInput(String(preset.mmT))
    setDressedWidthMmInput(String(preset.mmW))
  }

  const handleSwitchPriceMode = (nextMode) => {
    if (nextMode === priceMode) return
    const cur = parseFloat(unitPriceInput)
    if (Number.isFinite(cur) && cur > 0) {
      if (nextMode === 'bfm') {
        setUnitPriceInput((cur / 1000).toFixed(2))
      } else {
        setUnitPriceInput(String(Math.round(cur * 1000 * 100) / 100))
      }
    }
    setPriceMode(nextMode)
  }

  const calc = useMemo(() => {
    const FT3_TO_M3 = 0.0283168466
    const qty = Math.max(1, Math.round(parseFloat(quantityInput) || 1))
    const unitPrice = Math.max(0, parseFloat(unitPriceInput) || 0)
    const wasteFactor = 1 + wastePct / 100

    let rawNomT = Math.max(0, parseFloat(nomThickInput) || 0)
    let nomW = Math.max(0, parseFloat(nomWidthInput) || 0)
    let lengthFt = 0
    let lengthM = 0

    if (unitSystem === 'imperial') {
      const ft = Math.max(0, parseFloat(lengthFeet) || 0)
      const inch = Math.max(0, parseFloat(lengthInches) || 0)
      const six = Math.max(0, parseFloat(lengthSixteenths) || 0)
      lengthFt = ft + inch / 12 + six / 192
      lengthM = lengthFt * 0.3048
      if (rawNomT <= 0 || nomW <= 0 || lengthFt <= 0) return null
    } else {
      const mmT = Math.max(0, parseFloat(dressedThickMmInput) || 0)
      const mmW = Math.max(0, parseFloat(dressedWidthMmInput) || 0)
      lengthM = Math.max(0, parseFloat(lengthMetersInput) || 0)
      lengthFt = lengthM / 0.3048
      if (mmT <= 0 || mmW <= 0 || lengthM <= 0) return null

      const matchedByMm = BFM_LUMBER_PRESETS.find((p) => p.mmT === Math.round(mmT) && p.mmW === Math.round(mmW))
      if (matchedByMm) {
        rawNomT = matchedByMm.nomT
        nomW = matchedByMm.nomW
      } else {
        rawNomT = Math.max(1, Math.round(mmT / 25.4 + 0.4))
        nomW = Math.max(2, Math.round(mmW / 25.4 + 0.5))
      }
    }

    // Industry & Red Seal Rule: boards thinner than 1" nominal count as 1" nominal for BFM
    const bfmNomT = rawNomT > 0 && rawNomT < 1 ? 1 : rawNomT

    const matchedPreset = BFM_LUMBER_PRESETS.find((p) => p.nomT === rawNomT && p.nomW === nomW)
    const actTIn = matchedPreset ? matchedPreset.actTIn : getDressedDimFromNominal(rawNomT)
    const actWIn = matchedPreset ? matchedPreset.actWIn : getDressedDimFromNominal(nomW)
    const actTStr = matchedPreset ? matchedPreset.actTStr : formatInchesSixteenths(actTIn)
    const actWStr = matchedPreset ? matchedPreset.actWStr : formatInchesSixteenths(actWIn)
    const mmT = unitSystem === 'metric' ? Math.round(parseFloat(dressedThickMmInput) || 38) : matchedPreset ? matchedPreset.mmT : Math.round(actTIn * 25.4)
    const mmW = unitSystem === 'metric' ? Math.round(parseFloat(dressedWidthMmInput) || 140) : matchedPreset ? matchedPreset.mmW : Math.round(actWIn * 25.4)

    const bfmPerLf = (bfmNomT * nomW) / 12
    const bfmPerPiece = bfmPerLf * lengthFt
    const netBfm = bfmPerPiece * qty
    const orderBfm = netBfm * wasteFactor
    const netMbf = netBfm / 1000
    const orderMbf = orderBfm / 1000

    const totalLf = lengthFt * qty
    const totalMeters = lengthM * qty

    // True Cubic Volume: Nominal (12 BFM = 1 ft³) vs Dressed Actual
    const nomFt3 = netBfm / 12
    const dressedFt3 = ((actTIn * actWIn * lengthFt) / 144) * qty
    const dressedM3 = unitSystem === 'metric' ? (mmT / 1000) * (mmW / 1000) * lengthM * qty : dressedFt3 * FT3_TO_M3

    // Cost Estimator ($ / MBF vs $ / BFM)
    const netCost = priceMode === 'mbf' ? netMbf * unitPrice : netBfm * unitPrice
    const orderCost = priceMode === 'mbf' ? orderMbf * unitPrice : orderBfm * unitPrice

    return {
      rawNomT,
      bfmNomT,
      nomW,
      actTIn,
      actWIn,
      actTStr,
      actWStr,
      mmT,
      mmW,
      lengthFt,
      lengthInTotal: lengthFt * 12,
      lengthM,
      qty,
      bfmPerLf,
      bfmPerPiece,
      netBfm,
      orderBfm,
      netMbf,
      orderMbf,
      totalLf,
      totalMeters,
      nomFt3,
      dressedFt3,
      dressedM3,
      unitPrice,
      netCost,
      orderCost,
      matchedPresetId: matchedPreset ? matchedPreset.id : null,
      svgNom: `${bfmNomT}" × ${nomW}"`,
      svgAct: `${actTStr} × ${actWStr} (${mmT}×${mmW}mm)`,
      svgLen: unitSystem === 'imperial' ? formatFeetAndInches(lengthFt * 12) : `${lengthM.toFixed(2)}m`
    }
  }, [
    unitSystem,
    nomThickInput,
    nomWidthInput,
    lengthFeet,
    lengthInches,
    lengthSixteenths,
    dressedThickMmInput,
    dressedWidthMmInput,
    lengthMetersInput,
    quantityInput,
    priceMode,
    unitPriceInput,
    wastePct
  ])

  const handleCalculate = () => {
    setCalcPulse(true)
    setTimeout(() => setCalcPulse(false), 300)
  }

  const toggleInfo = (key) => {
    setActiveTooltip((prev) => (prev === key ? null : key))
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 p-4 shrink-0 bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500 rounded-lg text-white shrink-0">
              <Hammer size={22} />
            </div>
            <div>
              <h3 className="text-slate-900 dark:text-white text-base md:text-lg font-bold uppercase tracking-wider leading-tight">
                BOARD FOOT MEASURE (BFM)
              </h3>
              <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                NOMINAL VOLUME, LINEAR FEET &amp; $/MBF COST ESTIMATOR
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition-colors p-1">
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Quick Section Switcher Bar */}
        <div className="px-4 py-2 bg-slate-100 dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800 shrink-0 flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollBodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex-1 py-1.5 px-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-[11px] font-mono font-extrabold text-slate-800 dark:text-slate-200 hover:border-purple-500/60 transition-colors"
          >
            🧮 Calculator &amp; Results
          </button>
          <button
            type="button"
            onClick={() => cadSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            className="flex-1 py-1.5 px-2.5 rounded-lg bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/40 text-[11px] font-mono font-extrabold text-purple-700 dark:text-purple-300 transition-colors"
          >
            📐 1:1 CAD &amp; Math Teacher ↓
          </button>
        </div>

        {/* Scrollable Body (Block flow prevents flex-shrink crushing of overflow-hidden cards) */}
        <div
          ref={scrollBodyRef}
          className="block space-y-4 p-4 md:p-5 overflow-y-auto custom-scrollbar flex-1 min-h-0 max-h-[82vh]"
        >
          {/* Quick-Select Nominal Lumber Size Pills */}
          <div className="space-y-1.5 shrink-0">
            <div className="flex items-center justify-between px-0.5">
              <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                QUICK-SELECT NOMINAL LUMBER SIZE
              </span>
              <span className="text-[10px] font-mono font-bold text-slate-400">CSA O141 / NLGA</span>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
              {BFM_LUMBER_PRESETS.map((preset) => {
                const isSelected = calc?.matchedPresetId === preset.id
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`py-1.5 px-1 rounded-lg text-xs font-mono font-extrabold border transition-all ${
                      isSelected
                        ? 'bg-purple-600 border-purple-400 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-purple-500/60'
                    }`}
                  >
                    {preset.label}
                  </button>
                )
              })}
            </div>

            {/* Helper Warning Badge: Nominal vs Dressed Actual & Metric */}
            {calc && (
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg px-3 py-2 text-[11px] leading-snug text-slate-700 dark:text-purple-100">
                <span className="font-mono font-extrabold text-purple-700 dark:text-purple-300">
                  Nominal: {calc.bfmNomT}&quot; × {calc.nomW}&quot;
                </span>{' '}
                • Dressed Actual:{' '}
                <span className="font-mono font-semibold">
                  {calc.actTStr} × {calc.actWStr} ({calc.mmT} × {calc.mmW} mm)
                </span>{' '}
                — <strong className="text-amber-600 dark:text-amber-300">BFM always uses the {calc.bfmNomT}&quot; × {calc.nomW}&quot; nominal size!</strong>
              </div>
            )}
          </div>

          {/* Imperial / Metric Unit Toggle */}
          <div className="flex bg-slate-200 dark:bg-slate-800 rounded-lg p-1 shrink-0">
            <button
              type="button"
              onClick={() => setUnitSystem('imperial')}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${
                unitSystem === 'imperial'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Imperial (Nominal IN &amp; FT)
            </button>
            <button
              type="button"
              onClick={() => setUnitSystem('metric')}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${
                unitSystem === 'metric'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Metric (Dressed MM &amp; M)
            </button>
          </div>

          {/* Input Section */}
          <div className="space-y-3.5 shrink-0">
            {unitSystem === 'imperial' ? (
              <>
                {/* Nominal Thickness & Nominal Width (2-Column) */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1 px-1">
                      NOMINAL THICKNESS (&quot;)
                    </span>
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={nomThickInput}
                        onChange={(e) => setNomThickInput(e.target.value)}
                        className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl pl-3 pr-9 py-2 text-base font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 transition-colors"
                      />
                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono font-extrabold text-slate-400 pointer-events-none">
                        NOM&quot;
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1 px-1">
                      NOMINAL WIDTH (&quot;)
                    </span>
                    <div className="relative">
                      <input
                        type="number"
                        min="2"
                        step="1"
                        value={nomWidthInput}
                        onChange={(e) => setNomWidthInput(e.target.value)}
                        className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl pl-3 pr-9 py-2 text-base font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 transition-colors"
                      />
                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono font-extrabold text-slate-400 pointer-events-none">
                        NOM&quot;
                      </span>
                    </div>
                  </div>
                </div>

                {/* Board Length with Persistent FEET ('), INCHES ("), 16THS (/16) Labels */}
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-1.5">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">
                      Board Length
                    </label>
                    <div className="flex items-center gap-1">
                      {['8', '10', '12', '14', '16'].map((len) => (
                        <button
                          key={len}
                          type="button"
                          onClick={() => {
                            setLengthFeet(len)
                            setLengthInches('0')
                            setLengthSixteenths('0')
                          }}
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border transition-colors ${
                            lengthFeet === len && Number(lengthInches) === 0 && Number(lengthSixteenths) === 0
                              ? 'bg-purple-500/20 border-purple-400 text-purple-600 dark:text-purple-300'
                              : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          {len}&apos;
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1 px-1">
                        FEET (&apos;)
                      </span>
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          placeholder="0"
                          value={lengthFeet}
                          onChange={(e) => setLengthFeet(e.target.value)}
                          className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl pl-3 pr-8 py-2 text-base font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 transition-colors"
                        />
                        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono font-extrabold text-slate-400 pointer-events-none">
                          FT
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1 px-1">
                        INCHES (&quot;)
                      </span>
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          placeholder="0"
                          value={lengthInches}
                          onChange={(e) => setLengthInches(e.target.value)}
                          className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl pl-3 pr-8 py-2 text-base font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 transition-colors"
                        />
                        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono font-extrabold text-slate-400 pointer-events-none">
                          IN
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1 px-1">
                        16THS (/16)
                      </span>
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          max="15"
                          step="1"
                          placeholder="0"
                          value={lengthSixteenths}
                          onChange={(e) => setLengthSixteenths(e.target.value)}
                          className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl pl-3 pr-9 py-2 text-base font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 transition-colors"
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono font-extrabold text-slate-400 pointer-events-none">
                          /16
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="grid grid-cols-3 gap-2.5">
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1 px-1">
                    THICKNESS (mm)
                  </span>
                  <div className="relative">
                    <input
                      type="number"
                      min="10"
                      value={dressedThickMmInput}
                      onChange={(e) => setDressedThickMmInput(e.target.value)}
                      className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl pl-3 pr-8 py-2 text-base font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono font-extrabold text-slate-400 pointer-events-none">
                      MM
                    </span>
                  </div>
                </div>

                <div className="flex flex-col">
                  <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1 px-1">
                    WIDTH (mm)
                  </span>
                  <div className="relative">
                    <input
                      type="number"
                      min="20"
                      value={dressedWidthMmInput}
                      onChange={(e) => setDressedWidthMmInput(e.target.value)}
                      className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl pl-3 pr-8 py-2 text-base font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono font-extrabold text-slate-400 pointer-events-none">
                      MM
                    </span>
                  </div>
                </div>

                <div className="flex flex-col">
                  <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1 px-1">
                    LENGTH (m)
                  </span>
                  <div className="relative">
                    <input
                      type="number"
                      min="0.1"
                      step="0.01"
                      value={lengthMetersInput}
                      onChange={(e) => setLengthMetersInput(e.target.value)}
                      className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl pl-3 pr-7 py-2 text-base font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                    />
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono font-extrabold text-slate-400 pointer-events-none">
                      M
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Quantity + Cost & Waste Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-1 px-1">
                  <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                    QUANTITY (PIECES)
                  </span>
                  <div className="flex gap-1">
                    {['1', '10', '20', '50'].map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => setQuantityInput(q)}
                        className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold border ${
                          quantityInput === q
                            ? 'bg-purple-500/20 border-purple-400 text-purple-600 dark:text-purple-300'
                            : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-500'
                        }`}
                      >
                        ×{q}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={quantityInput}
                    onChange={(e) => setQuantityInput(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl pl-3 pr-10 py-2 text-base font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono font-extrabold text-slate-400 pointer-events-none">
                    PCS
                  </span>
                </div>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-1 px-1">
                  <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                    UNIT PRICE ({priceMode === 'mbf' ? '$/MBF' : '$/BFM'})
                  </span>
                  <div className="flex bg-slate-200 dark:bg-slate-800 rounded p-0.5">
                    <button
                      type="button"
                      onClick={() => handleSwitchPriceMode('mbf')}
                      className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-extrabold transition-colors ${
                        priceMode === 'mbf' ? 'bg-purple-600 text-white' : 'text-slate-500'
                      }`}
                    >
                      $/MBF
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSwitchPriceMode('bfm')}
                      className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-extrabold transition-colors ${
                        priceMode === 'bfm' ? 'bg-purple-600 text-white' : 'text-slate-500'
                      }`}
                    >
                      $/BFM
                    </button>
                  </div>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono font-extrabold text-slate-400 pointer-events-none">
                    $
                  </span>
                  <input
                    type="number"
                    min="0"
                    step={priceMode === 'mbf' ? '10' : '0.05'}
                    value={unitPriceInput}
                    onChange={(e) => setUnitPriceInput(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl pl-7 pr-14 py-2 text-base font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] font-mono font-extrabold text-slate-400 pointer-events-none">
                    {priceMode === 'mbf' ? '/1000' : '/BFM'}
                  </span>
                </div>
              </div>
            </div>

            {/* Waste Allowance Toggle Bar */}
            <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3 py-2">
              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                Waste Allowance
              </span>
              <div className="flex items-center gap-1.5">
                {[
                  { label: '0% (Net)', val: 0 },
                  { label: '+5%', val: 5 },
                  { label: '+10%', val: 10 }
                ].map((w) => (
                  <button
                    key={w.val}
                    type="button"
                    onClick={() => setWastePct(w.val)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-extrabold border transition-colors ${
                      wastePct === w.val
                        ? 'bg-purple-600 border-purple-400 text-white shadow-sm'
                        : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {w.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleCalculate}
              className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold uppercase tracking-wider py-3 rounded-xl transition-all shadow-md active:scale-[0.98]"
            >
              Calculate BFM &amp; Lumber Cost
            </button>
          </div>

          {/* Quick Jump Pill to 1:1 CAD & Step-by-Step Math Walkthrough */}
          <button
            type="button"
            onClick={() => cadSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            className="w-full shrink-0 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/35 text-purple-700 dark:text-purple-300 text-[11px] sm:text-xs font-mono font-extrabold tracking-wide transition-colors"
          >
            <span>📐 Jump to 1:1 CAD &amp; Step-by-Step Math Walkthrough ↓</span>
          </button>

          {/* 1. CALCULATION RESULTS (7 Complete Rows w/ Left-Aligned ⓘ Info Buttons) */}
          <div
            className={`shrink-0 bg-slate-100 dark:bg-slate-800/50 border rounded-xl p-4 md:p-5 transition-colors ${
              calcPulse ? 'border-purple-400' : 'border-slate-300 dark:border-slate-700'
            }`}
          >
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3.5 border-b border-slate-200 dark:border-slate-700 pb-2">
              Calculation Results
            </h4>

            {calc ? (
              <div className="space-y-2.5 text-xs sm:text-sm">
                {[
                  {
                    id: 'bfmSizes',
                    label: 'Nominal vs. Actual Size:',
                    value: `${calc.bfmNomT}" × ${calc.nomW}" Nom (${calc.actTStr} × ${calc.actWStr} Act • ${calc.mmT}×${calc.mmW}mm)`,
                    valueClass: 'text-slate-900 dark:text-white text-[11px] sm:text-xs',
                    tip: 'Softwood framing lumber is named and billed in BFM by its rough-sawn Nominal size (e.g. 2" × 6"), even though S4S planing reduces it to Dressed Actual size (1-1/2" × 5-1/2" / 38 × 140 mm).'
                  },
                  {
                    id: 'bfmPerPc',
                    label: 'BFM per Piece ((T"×W"×L\')÷12):',
                    value: `${calc.bfmPerPiece.toFixed(2)} BFM`,
                    valueClass: 'text-purple-600 dark:text-purple-400',
                    tip: `1 Board Foot = 1" × 12" × 1'-0" (144 in³). Using nominal ${calc.bfmNomT}" × ${calc.nomW}" gives ${calc.bfmPerLf.toFixed(3)} BFM per linear foot × ${calc.lengthFt.toFixed(2)}' = ${calc.bfmPerPiece.toFixed(2)} BFM.`
                  },
                  {
                    id: 'bfmNetTotal',
                    label: 'Total Net BFM (BFM/pc × Qty):',
                    value: `${calc.netBfm.toFixed(2)} BFM`,
                    valueClass: 'text-purple-600 dark:text-purple-400',
                    tip: `${calc.bfmPerPiece.toFixed(2)} BFM/piece × ${calc.qty} pieces = ${calc.netBfm.toFixed(2)} Net BFM (${calc.netMbf.toFixed(3)} MBF).`
                  },
                  {
                    id: 'bfmOrderTotal',
                    label: `Total Order BFM (w/ +${wastePct}% Waste):`,
                    value: `${calc.orderBfm.toFixed(2)} BFM (${calc.orderMbf.toFixed(3)} MBF)`,
                    valueClass: 'text-emerald-600 dark:text-emerald-400',
                    tip: `Includes +${wastePct}% waste allowance. Dividing BFM by 1,000 converts Board Feet into MBF (Thousand Board Feet) for commercial yard pricing.`
                  },
                  {
                    id: 'bfmLinearFt',
                    label: 'Total Linear Footage (L × Qty):',
                    value: `${calc.totalLf.toFixed(1)} LF (${calc.totalMeters.toFixed(2)} m)`,
                    valueClass: 'text-cyan-600 dark:text-cyan-400',
                    tip: 'Total running length of all boards placed end-to-end in Linear Feet (LF) and Meters (m).'
                  },
                  {
                    id: 'bfmCubicVol',
                    label: 'True Cubic Volume (Nom / Dressed):',
                    value: `${calc.nomFt3.toFixed(2)} ft³ Nom • ${calc.dressedM3.toFixed(3)} m³ Dressed`,
                    valueClass: 'text-cyan-600 dark:text-cyan-400 text-[11px] sm:text-xs',
                    tip: `12 BFM = 1.00 Nominal ft³. Dressed actual volume reflects finished S4S timber (${calc.dressedFt3.toFixed(2)} ft³ / ${calc.dressedM3.toFixed(3)} m³) used for shipping weight & metric m³ tallies.`
                  },
                  {
                    id: 'bfmCost',
                    label: 'Estimated Lumber Cost:',
                    value:
                      wastePct > 0
                        ? `$${calc.netCost.toFixed(2)} Net • $${calc.orderCost.toFixed(2)} (+${wastePct}%)`
                        : `$${calc.netCost.toFixed(2)} Net`,
                    valueClass: 'text-amber-600 dark:text-amber-400',
                    tip:
                      priceMode === 'mbf'
                        ? `Priced at $${calc.unitPrice.toFixed(2)} / MBF (per 1,000 BFM): divide BFM by 1,000 first! (${calc.netMbf.toFixed(3)} MBF × $${calc.unitPrice.toFixed(2)} = $${calc.netCost.toFixed(2)}).`
                        : `Priced at $${calc.unitPrice.toFixed(2)} / BFM (equivalent to $${(calc.unitPrice * 1000).toFixed(2)} / MBF).`
                  }
                ].map((row, idx, arr) => (
                  <div
                    key={row.id}
                    className={`flex flex-col ${
                      idx < arr.length - 1 ? 'border-b border-slate-200/60 dark:border-slate-700/60 pb-2.5' : 'pt-0.5'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="font-sans font-semibold text-slate-700 dark:text-slate-200 leading-snug">
                          {row.label}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleInfo(row.id)}
                          aria-label={`Info about ${row.label}`}
                          className={`inline-flex items-center justify-center w-5 h-5 rounded-full shrink-0 transition-colors ${
                            activeTooltip === row.id
                              ? 'bg-purple-500/20 text-purple-400'
                              : 'text-slate-400 hover:text-purple-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                          }`}
                        >
                          <Info size={13} />
                        </button>
                      </div>

                      <div className={`ml-auto text-right font-mono font-bold whitespace-nowrap ${row.valueClass}`}>
                        {row.value}
                      </div>
                    </div>

                    {activeTooltip === row.id && (
                      <div className="text-xs text-purple-100 bg-slate-900 border border-purple-500/30 px-3 py-2 rounded-lg mt-2 leading-relaxed">
                        {row.tip}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs font-mono text-slate-400">Enter non-zero lumber dimensions above to compute BFM &amp; cost.</p>
            )}
          </div>

          {/* 2. LIVE 1:1 CAD LUMBER & 1-BFM REFERENCE DIAGRAM (viewBox="0 0 360 175") */}
          <div ref={cadSectionRef} className="space-y-4 shrink-0 scroll-mt-2">
          {calc && (
            <div className="bg-[#0a192f] border border-slate-700/90 rounded-xl overflow-hidden shadow-lg shrink-0">
              <div className="px-3 py-1.5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-purple-400">
                  LIVE 1:1 CAD 1-BFM UNIT &amp; NOMINAL VS. DRESSED BOARD
                </span>
                <span className="text-[10px] font-mono font-bold text-slate-400 shrink-0 whitespace-nowrap">
                  1 BFM = 144 IN³
                </span>
              </div>

              <svg viewBox="0 0 360 175" className="w-full h-auto min-h-[175px] block shrink-0">
                <defs>
                  <pattern id="bfmCadGrid" width="18" height="18" patternUnits="userSpaceOnUse">
                    <path d="M 18 0 L 0 0 0 18" fill="none" stroke="#172a46" strokeWidth="0.65" />
                  </pattern>
                </defs>
                <rect x="0" y="0" width="360" height="175" fill="#0a192f" />
                <rect x="0" y="0" width="360" height="175" fill="url(#bfmCadGrid)" />

                {/* Center Vertical Stage Divider */}
                <line x1="150" y1="26" x2="150" y2="142" stroke="#1e3a5f" strokeWidth="1.2" strokeDasharray="3 3" />

                {/* LEFT STAGE: 1 BOARD FOOT 3D ISOMETRIC REFERENCE BLOCK (1"T x 12"W x 1'-0"L = 144 in³) */}
                <polygon points="24,80 76,54 128,80 76,106" fill="#312e81" stroke="#a78bfa" strokeWidth="1.5" />
                <polygon points="24,80 76,106 76,116 24,90" fill="#1e1b4b" stroke="#a78bfa" strokeWidth="1.4" />
                <polygon points="76,106 128,80 128,90 76,116" fill="#0f172a" stroke="#a78bfa" strokeWidth="1.4" />

                <text x="48" y="65" fill="#c4b5fd" fontSize="6.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                  12&quot;W
                </text>
                <text x="106" y="65" fill="#c4b5fd" fontSize="6.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                  1&apos;-0&quot;L
                </text>
                <text x="18" y="88" fill="#fde68a" fontSize="6.5" fontFamily="monospace" fontWeight="bold" textAnchor="end">
                  1&quot;T
                </text>

                {/* RIGHT STAGE: SELECTED LUMBER 3D BOARD (SOLID NOMINAL OUTER + DASHED DRESSED INNER) */}
                {/* Extruded 3D Receding Timber Body */}
                <polygon points="172,86 266,52 326,52 232,86" fill="#334155" stroke="#34d399" strokeWidth="1.4" />
                <polygon points="232,86 326,52 326,84 232,118" fill="#1e293b" stroke="#34d399" strokeWidth="1.4" />

                {/* Front End-Grain Nominal Outer Box (Used for BFM) */}
                <rect x="172" y="86" width="60" height="32" fill="#2e1065" stroke="#34d399" strokeWidth="1.8" />

                {/* Inner Dashed Dressed Actual Cross-Section + End-Grain Rings */}
                <rect
                  x="177"
                  y="91"
                  width="50"
                  height="22"
                  fill="#451a03"
                  stroke="#22d3ee"
                  strokeWidth="1.4"
                  strokeDasharray="3 2"
                />
                <path d="M 186,113 A 18,12 0 0,1 218,113" fill="none" stroke="#fbbf24" strokeWidth="0.9" opacity="0.65" />
                <path d="M 193,113 A 10,7 0 0,1 211,113" fill="none" stroke="#fbbf24" strokeWidth="0.9" opacity="0.65" />

                {/* Leaders to Nominal & Dressed Pills (Zero Crossing) */}
                <polyline points="172,86 163,86 163,21" fill="none" stroke="#34d399" strokeWidth="1.3" strokeDasharray="2.5 2" />
                <line x1="192" y1="91" x2="192" y2="43" stroke="#22d3ee" strokeWidth="1.3" strokeDasharray="2.5 2" />

                {/* Receding Board Length Dimension Arrow */}
                <line x1="238" y1="121" x2="332" y2="87" stroke="#fbbf24" strokeWidth="1.5" />
                <circle cx="238" cy="121" r="1.8" fill="#fbbf24" />
                <circle cx="332" cy="87" r="1.8" fill="#fbbf24" />

                {/* Opaque fill="#0a192f" Dynamic Callout Pills Drawn AFTER All Lines */}
                <StairSvgPill
                  x={8}
                  y={13}
                  align="start"
                  maxWidth={140}
                  text={'1 BFM = 1"T×12"W×1\'-0"L'}
                  fontSize={6.8}
                  color="#ddd6fe"
                  borderColor="#7c3aed"
                />
                <StairSvgPill
                  x={76}
                  y={132}
                  align="middle"
                  maxWidth={136}
                  text="144 IN³ UNIT BLOCK"
                  fontSize={6.8}
                  color="#c4b5fd"
                  borderColor="#6d28d9"
                />
                <StairSvgPill
                  x={352}
                  y={13}
                  align="end"
                  maxWidth={196}
                  text={`NOMINAL: ${calc.svgNom} (USED FOR BFM)`}
                  fontSize={6.9}
                  color="#6ee7b7"
                  borderColor="#059669"
                />
                <StairSvgPill
                  x={352}
                  y={35}
                  align="end"
                  maxWidth={180}
                  text={`DRESSED: ${calc.svgAct}`}
                  fontSize={6.7}
                  color="#67e8f9"
                  borderColor="#0284c7"
                />
                <StairSvgPill
                  x={352}
                  y={132}
                  align="end"
                  maxWidth={112}
                  text={`LEN: ${calc.svgLen}`}
                  fontSize={6.9}
                  color="#fde68a"
                  borderColor="#d97706"
                />
                <StairSvgPill
                  x={8}
                  y={156}
                  align="start"
                  maxWidth={344}
                  text={`${calc.qty} PCS = ${calc.netBfm.toFixed(2)} BFM (${calc.totalLf.toFixed(1)} LF) • $${calc.orderCost.toFixed(2)}`}
                  fontSize={6.9}
                  color="#f5d0fe"
                  borderColor="#a855f7"
                />
              </svg>
            </div>
          )}

          {/* 3. ALWAYS-VISIBLE "HOW TO DO THE MATH (RED SEAL STEP-BY-STEP TEACHER)" SECTION (5 NUMBERED CARDS) */}
          <div className="bg-slate-950 border border-purple-500/35 rounded-xl overflow-hidden shadow-lg shrink-0">
            <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400 shrink-0">
                <BookOpen size={16} />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider leading-tight">
                  HOW TO DO THE MATH (RED SEAL STEP-BY-STEP TEACHER)
                </h4>
                <p className="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-widest mt-0.5">
                  RED SEAL MATH TEACHER — 5-STEP WORKED BFM &amp; MBF SOLUTION
                </p>
              </div>
            </div>

            <div className="p-3.5 sm:p-4 space-y-3 text-xs text-slate-300 leading-relaxed">
              {calc ? (
                <>
                  {/* STEP 1 */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-purple-500/20 border border-purple-400/50 text-purple-300 font-mono font-extrabold text-[11px] shrink-0">
                        1
                      </span>
                      <span className="font-bold text-white uppercase tracking-wide text-[11px] sm:text-xs">
                        Step 1 — Use Nominal Dimensions (Never Dressed Size!)
                      </span>
                    </div>
                    <div className="text-[11px] text-amber-200/95 bg-amber-500/10 border border-amber-500/30 rounded px-2.5 py-1.5">
                      <strong className="text-amber-300">Red Seal Rule:</strong> Board Foot Measure (BFM) is calculated from the rough-sawn NOMINAL size before planing (2x6 = 2&quot; × 6&quot;), never the dressed size (1-1/2&quot; × 5-1/2&quot;). Boards less than 1&quot; thick count as 1&quot; nominal.
                    </div>
                    <div className="font-mono text-slate-200 bg-slate-950/80 border border-slate-800/80 rounded px-2.5 py-1.5 text-[11px]">
                      Selected Board: Use{' '}
                      <span className="font-bold text-emerald-400">
                        {calc.bfmNomT}&quot; × {calc.nomW}&quot; Nominal
                      </span>{' '}
                      <span className="text-slate-400">
                        (ignore {calc.actTStr} × {calc.actWStr} dressed size for BFM!)
                      </span>
                    </div>
                  </div>

                  {/* STEP 2 */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-purple-500/20 border border-purple-400/50 text-purple-300 font-mono font-extrabold text-[11px] shrink-0">
                        2
                      </span>
                      <span className="font-bold text-white uppercase tracking-wide text-[11px] sm:text-xs">
                        Step 2 — Convert Board Length to Decimal Feet (or Divide All Inches by 144)
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-400 space-y-0.5">
                      <div>
                        • Formula A (Length in Feet): <span className="text-purple-300">BFM = (Thickness&quot; × Width&quot; × Length&apos;) ÷ 12</span>
                      </div>
                      <div>
                        • Formula B (Length in Inches): <span className="text-purple-300">BFM = (Thickness&quot; × Width&quot; × Length&quot;) ÷ 144</span>
                      </div>
                    </div>
                    <div className="font-mono text-slate-200 bg-slate-950/80 border border-slate-800/80 rounded px-2.5 py-1.5 text-[11px]">
                      ({calc.bfmNomT}&quot; × {calc.nomW}&quot; × {calc.lengthFt.toFixed(2)}&apos;) ÷ 12 ={' '}
                      <span className="font-bold text-emerald-400">{calc.bfmPerPiece.toFixed(2)} BFM per piece</span>
                    </div>
                    <div className="text-[11px] text-cyan-200/95 bg-cyan-500/10 border border-cyan-500/30 rounded px-2.5 py-1.5">
                      <strong className="text-cyan-300">Pro Shortcut:</strong>{' '}
                      {calc.bfmNomT * calc.nomW === 12
                        ? `Notice that for a ${calc.bfmNomT}x${calc.nomW}, ${calc.bfmNomT} × ${calc.nomW} = 12, which cancels out the ÷ 12! So a ${calc.bfmNomT}x${calc.nomW} always equals 1.00 BFM per linear foot (${calc.lengthFt.toFixed(1)}' long = ${calc.bfmPerPiece.toFixed(2)} BFM)!`
                        : `A ${calc.bfmNomT}x${calc.nomW} equals (${calc.bfmNomT} × ${calc.nomW}) ÷ 12 = ${calc.bfmPerLf.toFixed(3)} BFM per linear foot (and remember: a 2x6 equals 1.00 BFM per linear foot because 2 × 6 = 12!).`}
                    </div>
                  </div>

                  {/* STEP 3 */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-purple-500/20 border border-purple-400/50 text-purple-300 font-mono font-extrabold text-[11px] shrink-0">
                        3
                      </span>
                      <span className="font-bold text-white uppercase tracking-wide text-[11px] sm:text-xs">
                        Step 3 — Multiply by Piece Quantity &amp; Add Waste Allowance
                      </span>
                    </div>
                    <div className="font-mono text-slate-200 bg-slate-950/80 border border-slate-800/80 rounded px-2.5 py-1.5 text-[11px]">
                      {calc.bfmPerPiece.toFixed(2)} BFM × {calc.qty} pieces ={' '}
                      <span className="font-bold text-purple-300">{calc.netBfm.toFixed(2)} Net BFM</span> ➔ +{wastePct}% waste ={' '}
                      <span className="font-bold text-emerald-400">{calc.orderBfm.toFixed(2)} Order BFM</span>
                    </div>
                  </div>

                  {/* STEP 4 */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-purple-500/20 border border-purple-400/50 text-purple-300 font-mono font-extrabold text-[11px] shrink-0">
                        4
                      </span>
                      <span className="font-bold text-white uppercase tracking-wide text-[11px] sm:text-xs">
                        Step 4 — Convert BFM to MBF (Per 1,000 Board Feet) for Lumber Pricing
                      </span>
                    </div>
                    <div className="text-[11px] text-amber-200/95 bg-amber-500/10 border border-amber-500/30 rounded px-2.5 py-1.5">
                      <strong className="text-amber-300">#1 Red Seal Cost Trap:</strong> In lumberyards and on the Red Seal exam, MBF stands for 1,000 Board Feet (M = Roman numeral for 1,000). Always divide Total BFM by 1,000 before multiplying by the $/MBF price!
                    </div>
                    <div className="font-mono text-slate-200 bg-slate-950/80 border border-slate-800/80 rounded px-2.5 py-1.5 text-[11px]">
                      {priceMode === 'mbf' ? (
                        <>
                          ({calc.orderBfm.toFixed(2)} BFM ÷ 1,000) × ${calc.unitPrice.toFixed(2)}/MBF = {calc.orderMbf.toFixed(3)} MBF × $
                          {calc.unitPrice.toFixed(2)} ={' '}
                          <span className="font-bold text-amber-300">${calc.orderCost.toFixed(2)}</span>{' '}
                          <span className="text-slate-400">(Net = ${calc.netCost.toFixed(2)})</span>
                        </>
                      ) : (
                        <>
                          {calc.orderBfm.toFixed(2)} BFM × ${calc.unitPrice.toFixed(2)}/BFM ={' '}
                          <span className="font-bold text-amber-300">${calc.orderCost.toFixed(2)}</span>{' '}
                          <span className="text-slate-400">
                            (same as {calc.orderMbf.toFixed(3)} MBF × ${(calc.unitPrice * 1000).toFixed(2)}/MBF)
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* STEP 5 */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-purple-500/20 border border-purple-400/50 text-purple-300 font-mono font-extrabold text-[11px] shrink-0">
                        5
                      </span>
                      <span className="font-bold text-white uppercase tracking-wide text-[11px] sm:text-xs">
                        Step 5 — Linear Footage (LF) &amp; True Cubic Volume (ft³ / m³)
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-400">
                      12 BFM = 1.00 Nominal ft³ (1,728 in³), while Metric timber is tallied by actual dressed volume (m³).
                    </div>
                    <div className="font-mono text-slate-200 bg-slate-950/80 border border-slate-800/80 rounded px-2.5 py-1.5 text-[11px]">
                      {calc.qty} × {calc.lengthFt.toFixed(2)}&apos; ={' '}
                      <span className="font-bold text-cyan-300">
                        {calc.totalLf.toFixed(1)} LF ({calc.totalMeters.toFixed(2)} m)
                      </span>{' '}
                      • {calc.nomFt3.toFixed(2)} ft³ Nom •{' '}
                      <span className="font-bold text-emerald-400">{calc.dressedM3.toFixed(3)} m³ Dressed</span>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-slate-400">Enter non-zero lumber dimensions above to view the 5-step worked Red Seal solution.</p>
              )}
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  )
}


function RoofFramingModal({ onClose }) {
  const [unitSystem, setUnitSystem] = useState('imperial')

  // Imperial Inputs (Default: 40'-0" Building Span, 4/12 Slope, 1.5" 2x Ridge, 16" Overhang)
  const [spanFeet, setSpanFeet] = useState('40')
  const [spanInches, setSpanInches] = useState('0')
  const [spanSixteenths, setSpanSixteenths] = useState('0')
  const [pitchIn, setPitchIn] = useState('4')
  const [ridgeThickIn, setRidgeThickIn] = useState(1.5) // 1.5" (2x) or 0.75" (1x)
  const [overhangIn, setOverhangIn] = useState('16')

  // Metric Inputs (Default: 12192 mm Span, 83.3 mm Rise per 250 mm Run ≈ 4/12, 38 mm 2x Ridge, 400 mm Overhang)
  const [spanMmInput, setSpanMmInput] = useState('12192')
  const [risePer250Input, setRisePer250Input] = useState('83.3')
  const [ridgeThickMm, setRidgeThickMm] = useState(38) // 38 mm (2x) or 19 mm (1x)
  const [overhangMmInput, setOverhangMmInput] = useState('400')

  const [activeTooltip, setActiveTooltip] = useState(null)
  const [calcPulse, setCalcPulse] = useState(false)
  const scrollBodyRef = useRef(null)
  const cadSectionRef = useRef(null)

  const calc = useMemo(() => {
    const HIP_UNIT_RUN_IN = Math.SQRT2 * 12 // 16.9705627... ("17" framing square hip base)
    const HIP_UNIT_RUN_MM = Math.SQRT2 * 250 // 353.55339... mm per 250 mm common run

    if (unitSystem === 'imperial') {
      const ftNum = Math.max(0, parseFloat(spanFeet) || 0)
      const inNum = Math.max(0, parseFloat(spanInches) || 0)
      const sixNum = Math.max(0, parseFloat(spanSixteenths) || 0)
      const spanIn = ftNum * 12 + inNum + sixNum / 16
      const unitRise = Math.max(0, parseFloat(pitchIn) || 0)

      if (spanIn <= 0 || unitRise <= 0) return null

      const runIn = spanIn / 2
      const runFt = runIn / 12
      const totalRiseIn = runFt * unitRise

      const commonUllIn = Math.sqrt(144 + Math.pow(unitRise, 2)) // inches per ft of run
      const rafterFactor = commonUllIn / 12 // hypotenuse multiplier
      const angleDeg = ((Math.atan(unitRise / 12) * 180) / Math.PI).toFixed(1)

      const theoCommonIn = runFt * commonUllIn
      const halfRidgeHorizIn = ridgeThickIn / 2 // 0.75" for 2x, 0.375" for 1x
      const ridgeSlopedDeductIn = halfRidgeHorizIn * rafterFactor
      const trueCommonCutIn = Math.max(0, theoCommonIn - ridgeSlopedDeductIn)

      const eaveHorizIn = Math.max(0, parseFloat(overhangIn) || 0)
      const eaveHorizFt = eaveHorizIn / 12
      const tailLineIn = eaveHorizFt * commonUllIn
      const totalRafterWithTailIn = trueCommonCutIn + tailLineIn

      // Hip / Valley Rafter (16.97" / 17" Base per 12" Common Run) + Hip Drop (2x Hip = 1.5" thick -> 0.75" half-thickness)
      const hipUllIn = Math.sqrt(288 + Math.pow(unitRise, 2))
      const theoHipIn = runFt * hipUllIn
      const halfHipDiagDeductIn = (0.75 * Math.SQRT2) * (hipUllIn / HIP_UNIT_RUN_IN)
      const hipDropIn = (0.75 / HIP_UNIT_RUN_IN) * unitRise

      return {
        mode: 'imperial',
        ftNum,
        inNum,
        sixNum,
        spanIn,
        spanFt: spanIn / 12,
        runIn,
        runFt,
        unitRise,
        totalRiseIn,
        commonUllIn,
        rafterFactor,
        angleDeg,
        theoCommonIn,
        ridgeThickIn,
        halfRidgeHorizIn,
        ridgeSlopedDeductIn,
        trueCommonCutIn,
        eaveHorizIn,
        eaveHorizFt,
        tailLineIn,
        totalRafterWithTailIn,
        hipUllIn,
        theoHipIn,
        halfHipDiagDeductIn,
        hipDropIn,
        // 8 Formatted Result Row Values
        runDisplay: `${formatFeetAndInches(runIn)} • ${runIn.toFixed(2)}"`,
        riseDisplay: `${formatFeetAndInches(totalRiseIn)} • ${totalRiseIn.toFixed(2)}"`,
        ullDisplay: `${commonUllIn.toFixed(2)}" (${formatInchesSixteenths(commonUllIn)}) • ×${rafterFactor.toFixed(4)}`,
        theoDisplay: `${theoCommonIn.toFixed(2)}" • ${formatFeetAndInches(theoCommonIn)}`,
        ridgeDeductDisplay: `-${ridgeSlopedDeductIn.toFixed(2)}" (-${formatInchesSixteenths(ridgeSlopedDeductIn)})`,
        trueCutDisplay: `${trueCommonCutIn.toFixed(2)}" • ${formatFeetAndInches(trueCommonCutIn)}`,
        tailDisplay: `+${tailLineIn.toFixed(2)}" (${formatFeetAndInches(tailLineIn)}) ➔ ${formatFeetAndInches(totalRafterWithTailIn)}`,
        hipDisplay: `${theoHipIn.toFixed(2)}" (${formatFeetAndInches(theoHipIn)}) • Drop ${formatInchesSixteenths(hipDropIn)}`,
        // Compact CAD SVG Callout Strings
        svgSpan: formatFeetAndInches(spanIn),
        svgRun: formatFeetAndInches(runIn),
        svgRise: `${formatFeetAndInches(totalRiseIn)} (${Math.round(totalRiseIn)}")`,
        svgTrueCut: formatFeetAndInches(trueCommonCutIn),
        svgUll: `${commonUllIn.toFixed(2)}"/FT`,
        svgRidgeDeduct: `${formatInchesSixteenths(ridgeSlopedDeductIn)} (${ridgeSlopedDeductIn.toFixed(2)}")`,
        svgSlope: `${unitRise}/12`
      }
    } else {
      const spanMm = Math.max(0, parseFloat(spanMmInput) || 0)
      const unitRise250 = Math.max(0, parseFloat(risePer250Input) || 0)
      if (spanMm <= 0 || unitRise250 <= 0) return null

      const runMm = spanMm / 2
      const unitBlocks = runMm / 250
      const slopeRatio = unitRise250 / 250
      const totalRiseMm = runMm * slopeRatio

      const commonUllMm = Math.sqrt(62500 + Math.pow(unitRise250, 2)) // per 250mm run
      const rafterFactor = commonUllMm / 250
      const angleDeg = ((Math.atan(slopeRatio) * 180) / Math.PI).toFixed(1)

      const theoCommonMm = runMm * rafterFactor
      const halfRidgeHorizMm = ridgeThickMm / 2
      const ridgeSlopedDeductMm = halfRidgeHorizMm * rafterFactor
      const trueCommonCutMm = Math.max(0, theoCommonMm - ridgeSlopedDeductMm)

      const eaveHorizMm = Math.max(0, parseFloat(overhangMmInput) || 0)
      const tailLineMm = eaveHorizMm * rafterFactor
      const totalRafterWithTailMm = trueCommonCutMm + tailLineMm

      const hipUllMm = Math.sqrt(125000 + Math.pow(unitRise250, 2)) // per 250mm common run (353.55mm hip run)
      const theoHipMm = unitBlocks * hipUllMm
      const hipDropMm = (19 / HIP_UNIT_RUN_MM) * unitRise250

      return {
        mode: 'metric',
        spanMm,
        runMm,
        unitBlocks,
        unitRise250,
        slopeRatio,
        totalRiseMm,
        commonUllMm,
        rafterFactor,
        angleDeg,
        theoCommonMm,
        ridgeThickMm,
        halfRidgeHorizMm,
        ridgeSlopedDeductMm,
        trueCommonCutMm,
        eaveHorizMm,
        tailLineMm,
        totalRafterWithTailMm,
        hipUllMm,
        theoHipMm,
        hipDropMm,
        runDisplay: `${Math.round(runMm)} mm (${(runMm / 1000).toFixed(3)} m)`,
        riseDisplay: `${Math.round(totalRiseMm)} mm (${(totalRiseMm / 1000).toFixed(3)} m)`,
        ullDisplay: `${commonUllMm.toFixed(1)} mm / 250mm • ×${rafterFactor.toFixed(4)}`,
        theoDisplay: `${theoCommonMm.toFixed(1)} mm (${(theoCommonMm / 1000).toFixed(3)} m)`,
        ridgeDeductDisplay: `-${ridgeSlopedDeductMm.toFixed(1)} mm (-1/2 of ${ridgeThickMm}mm)`,
        trueCutDisplay: `${trueCommonCutMm.toFixed(1)} mm (${(trueCommonCutMm / 1000).toFixed(3)} m)`,
        tailDisplay: `+${Math.round(tailLineMm)} mm ➔ ${Math.round(totalRafterWithTailMm)} mm (${(totalRafterWithTailMm / 1000).toFixed(2)} m)`,
        hipDisplay: `${Math.round(theoHipMm)} mm (${(theoHipMm / 1000).toFixed(2)} m) • Drop ${hipDropMm.toFixed(1)} mm`,
        svgSpan: `${(spanMm / 1000).toFixed(2)}m`,
        svgRun: `${Math.round(runMm)}mm`,
        svgRise: `${Math.round(totalRiseMm)}mm`,
        svgTrueCut: `${Math.round(trueCommonCutMm)}mm`,
        svgUll: `${commonUllMm.toFixed(1)}/250`,
        svgRidgeDeduct: `${ridgeSlopedDeductMm.toFixed(1)}mm`,
        svgSlope: `${unitRise250}:250`
      }
    }
  }, [
    unitSystem,
    spanFeet,
    spanInches,
    spanSixteenths,
    pitchIn,
    ridgeThickIn,
    overhangIn,
    spanMmInput,
    risePer250Input,
    ridgeThickMm,
    overhangMmInput
  ])

  const handleCalculate = () => {
    setCalcPulse(true)
    setTimeout(() => setCalcPulse(false), 300)
  }

  const toggleInfo = (key) => {
    setActiveTooltip((prev) => (prev === key ? null : key))
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 p-4 shrink-0 bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500 rounded-lg text-white shrink-0">
              <Triangle size={22} />
            </div>
            <div>
              <h3 className="text-slate-900 dark:text-white text-base md:text-lg font-bold uppercase tracking-wider leading-tight">
                ROOF FRAMING MATH
              </h3>
              <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                COMMON, RIDGE DEDUCTION, TAIL &amp; HIP/VALLEY LAYOUT
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition-colors p-1">
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Quick Section Switcher Bar */}
        <div className="px-4 py-2 bg-slate-100 dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800 shrink-0 flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollBodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex-1 py-1.5 px-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-[11px] font-mono font-extrabold text-slate-800 dark:text-slate-200 hover:border-orange-500/60 transition-colors"
          >
            🧮 Calculator &amp; Results
          </button>
          <button
            type="button"
            onClick={() => cadSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            className="flex-1 py-1.5 px-2.5 rounded-lg bg-orange-500/15 hover:bg-orange-500/25 border border-orange-500/40 text-[11px] font-mono font-extrabold text-orange-700 dark:text-orange-300 transition-colors"
          >
            📐 1:1 CAD &amp; Math Teacher ↓
          </button>
        </div>

        {/* Scrollable Body (Block flow prevents flex-shrink crushing of overflow-hidden cards) */}
        <div
          ref={scrollBodyRef}
          className="block space-y-4 p-4 md:p-5 overflow-y-auto custom-scrollbar flex-1 min-h-0 max-h-[82vh]"
        >
          {/* Imperial / Metric Unit Toggle */}
          <div className="flex bg-slate-200 dark:bg-slate-800 rounded-lg p-1 shrink-0">
            <button
              type="button"
              onClick={() => setUnitSystem('imperial')}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${
                unitSystem === 'imperial'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Imperial (FT / IN / 16THS)
            </button>
            <button
              type="button"
              onClick={() => setUnitSystem('metric')}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${
                unitSystem === 'metric'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Metric (MM / 250 RUN)
            </button>
          </div>

          {/* Input Section */}
          <div className="space-y-3.5 shrink-0">
            {unitSystem === 'imperial' ? (
              <>
                {/* Total Building Span (FT / IN / 16THS) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">
                      Total Building Span (Outer Wall to Outer Wall)
                    </label>
                    {calc && (
                      <span className="text-[11px] font-mono font-bold text-orange-600 dark:text-orange-400">
                        Run = {calc.runFt.toFixed(2)}&apos;
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-2.5">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-orange-600 dark:text-orange-400 mb-1 px-1">
                        FEET (&apos;)
                      </span>
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          placeholder="0"
                          value={spanFeet}
                          onChange={(e) => setSpanFeet(e.target.value)}
                          className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl pl-3 pr-8 py-2 text-base font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 transition-colors"
                        />
                        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono font-extrabold text-slate-400 pointer-events-none">
                          FT
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-orange-600 dark:text-orange-400 mb-1 px-1">
                        INCHES (&quot;)
                      </span>
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          placeholder="0"
                          value={spanInches}
                          onChange={(e) => setSpanInches(e.target.value)}
                          className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl pl-3 pr-8 py-2 text-base font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 transition-colors"
                        />
                        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono font-extrabold text-slate-400 pointer-events-none">
                          IN
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-orange-600 dark:text-orange-400 mb-1 px-1">
                        16THS (/16)
                      </span>
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          max="15"
                          step="1"
                          placeholder="0"
                          value={spanSixteenths}
                          onChange={(e) => setSpanSixteenths(e.target.value)}
                          className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl pl-3 pr-9 py-2 text-base font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 transition-colors"
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono font-extrabold text-slate-400 pointer-events-none">
                          /16
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Roof Slope / Pitch Input + Quick-Pitch Bar */}
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-1.5">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">
                      Roof Slope — Unit Rise (X / 12)
                    </label>
                    <div className="flex flex-wrap items-center gap-1">
                      {['4', '5', '6', '8', '12'].map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPitchIn(p)}
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-extrabold border transition-colors ${
                            pitchIn === p
                              ? 'bg-orange-500/20 border-orange-400 text-orange-600 dark:text-orange-300'
                              : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-orange-500/50'
                          }`}
                        >
                          {p}/12
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      min="0.5"
                      step="0.5"
                      value={pitchIn}
                      onChange={(e) => setPitchIn(e.target.value)}
                      className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl pl-3 pr-14 py-2 text-base font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 transition-colors"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono font-extrabold text-slate-400 pointer-events-none">
                      / 12&quot;
                    </span>
                  </div>
                </div>

                {/* Compact 2-Column Row: Ridge Board Thickness & Horizontal Eave Overhang */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-orange-600 dark:text-orange-400 mb-1 px-1">
                      RIDGE BOARD THICKNESS
                    </span>
                    <div className="grid grid-cols-2 gap-1.5 bg-slate-200 dark:bg-slate-800 p-1 rounded-xl">
                      <button
                        type="button"
                        onClick={() => setRidgeThickIn(1.5)}
                        className={`py-1.5 px-2 rounded-lg text-[11px] font-mono font-bold transition-colors ${
                          ridgeThickIn === 1.5
                            ? 'bg-orange-600 text-white shadow-sm'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        1-1/2&quot; (2x)
                      </button>
                      <button
                        type="button"
                        onClick={() => setRidgeThickIn(0.75)}
                        className={`py-1.5 px-2 rounded-lg text-[11px] font-mono font-bold transition-colors ${
                          ridgeThickIn === 0.75
                            ? 'bg-orange-600 text-white shadow-sm'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        3/4&quot; (1x)
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-1 px-1">
                      <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                        EAVE OVERHANG (SOFFIT)
                      </span>
                      <div className="flex gap-1">
                        {['16', '24'].map((ov) => (
                          <button
                            key={ov}
                            type="button"
                            onClick={() => setOverhangIn(ov)}
                            className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold border ${
                              overhangIn === ov
                                ? 'bg-orange-500/20 border-orange-400 text-orange-500 dark:text-orange-300'
                                : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-500'
                            }`}
                          >
                            {ov}&quot;
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        value={overhangIn}
                        onChange={(e) => setOverhangIn(e.target.value)}
                        className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl pl-3 pr-9 py-1.5 text-sm font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 transition-colors"
                      />
                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono font-extrabold text-slate-400 pointer-events-none">
                        IN
                      </span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-3">
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-orange-600 dark:text-orange-400 mb-1 px-1">
                    TOTAL BUILDING SPAN (mm)
                  </span>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      value={spanMmInput}
                      onChange={(e) => setSpanMmInput(e.target.value)}
                      className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl pl-3 pr-10 py-2 text-base font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono font-extrabold text-slate-400 pointer-events-none">
                      MM
                    </span>
                  </div>
                </div>

                <div className="flex flex-col">
                  <div className="flex flex-wrap items-center justify-between gap-1 mb-1 px-1">
                    <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                      UNIT RISE PER 250mm RUN
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {[
                        { label: '83.3 (4/12)', val: '83.3' },
                        { label: '104 (5/12)', val: '104.2' },
                        { label: '125 (6/12)', val: '125' },
                        { label: '167 (8/12)', val: '166.7' },
                        { label: '250 (12/12)', val: '250' }
                      ].map((p) => (
                        <button
                          key={p.val}
                          type="button"
                          onClick={() => setRisePer250Input(p.val)}
                          className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold border ${
                            risePer250Input === p.val
                              ? 'bg-orange-500/20 border-orange-400 text-orange-500 dark:text-orange-300'
                              : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-500'
                          }`}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      step="0.1"
                      value={risePer250Input}
                      onChange={(e) => setRisePer250Input(e.target.value)}
                      className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl pl-3 pr-16 py-2 text-base font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono font-extrabold text-slate-400 pointer-events-none">
                      / 250mm
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-orange-600 dark:text-orange-400 mb-1 px-1">
                      RIDGE BOARD THICKNESS
                    </span>
                    <div className="grid grid-cols-2 gap-1.5 bg-slate-200 dark:bg-slate-800 p-1 rounded-xl">
                      <button
                        type="button"
                        onClick={() => setRidgeThickMm(38)}
                        className={`py-1.5 px-2 rounded-lg text-[11px] font-mono font-bold transition-colors ${
                          ridgeThickMm === 38 ? 'bg-orange-600 text-white shadow-sm' : 'text-slate-500'
                        }`}
                      >
                        38mm (2x)
                      </button>
                      <button
                        type="button"
                        onClick={() => setRidgeThickMm(19)}
                        className={`py-1.5 px-2 rounded-lg text-[11px] font-mono font-bold transition-colors ${
                          ridgeThickMm === 19 ? 'bg-orange-600 text-white shadow-sm' : 'text-slate-500'
                        }`}
                      >
                        19mm (1x)
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-orange-600 dark:text-orange-400 mb-1 px-1">
                      EAVE OVERHANG (mm)
                    </span>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        value={overhangMmInput}
                        onChange={(e) => setOverhangMmInput(e.target.value)}
                        className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl pl-3 pr-10 py-1.5 text-sm font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono font-extrabold text-slate-400 pointer-events-none">
                        MM
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handleCalculate}
              className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold uppercase tracking-wider py-3 rounded-xl transition-all shadow-md active:scale-[0.98]"
            >
              Calculate Rafter Layout
            </button>
          </div>

          {/* Quick Jump Pill to 1:1 CAD & Step-by-Step Math Walkthrough */}
          <button
            type="button"
            onClick={() => cadSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            className="w-full shrink-0 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/35 text-orange-700 dark:text-orange-300 text-[11px] sm:text-xs font-mono font-extrabold tracking-wide transition-colors"
          >
            <span>📐 Jump to 1:1 CAD &amp; Step-by-Step Math Walkthrough ↓</span>
          </button>

          {/* 1. CALCULATION RESULTS (8 Complete Non-Overlapping Rows w/ Left-Aligned ⓘ Buttons) */}
          <div
            className={`shrink-0 bg-slate-100 dark:bg-slate-800/50 border rounded-xl p-4 md:p-5 transition-colors ${
              calcPulse ? 'border-orange-400' : 'border-slate-300 dark:border-slate-700'
            }`}
          >
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3.5 border-b border-slate-200 dark:border-slate-700 pb-2">
              Calculation Results
            </h4>

            {calc ? (
              <div className="space-y-2.5 text-xs sm:text-sm">
                {[
                  {
                    id: 'rfRun',
                    label: 'Total Run (Span ÷ 2):',
                    value: calc.runDisplay,
                    valueClass: 'text-slate-900 dark:text-white',
                    tip: 'Horizontal distance from the outer face of the exterior wall top plate to the theoretical centerline of the ridge board (Building Span ÷ 2).'
                  },
                  {
                    id: 'rfRise',
                    label: 'Total Roof Rise:',
                    value: calc.riseDisplay,
                    valueClass: 'text-orange-600 dark:text-orange-400',
                    tip: 'Vertical plumb climb of the measuring line from the birdsmouth heel at the wall plate up to the ridge centerline: Total Run (ft) × Unit Rise.'
                  },
                  {
                    id: 'rfUll',
                    label: unitSystem === 'imperial' ? 'Common ULL (per ft of run):' : 'Common ULL (per 250mm run):',
                    value: calc.ullDisplay,
                    valueClass: 'text-cyan-600 dark:text-cyan-400',
                    tip:
                      unitSystem === 'imperial'
                        ? 'Unit Line Length = √(12² + Unit Rise²). Dividing ULL by 12 gives the dimensionless Rafter Factor multiplier.'
                        : 'Metric Unit Line Length = √(250² + Unit Rise²). Dividing by 250 gives the dimensionless Rafter Factor multiplier.'
                  },
                  {
                    id: 'rfTheo',
                    label: 'Theoretical Common Line Length:',
                    value: calc.theoDisplay,
                    valueClass: 'text-orange-600 dark:text-orange-400',
                    tip: 'Sloped distance from the outer wall corner (birdsmouth heel) to the exact center of the ridge before subtracting half the ridge board.'
                  },
                  {
                    id: 'rfRidgeDeduct',
                    label: 'Ridge Shortening (-1/2 Ridge):',
                    value: calc.ridgeDeductDisplay,
                    valueClass: 'text-rose-600 dark:text-rose-400',
                    tip: 'Measured horizontally perpendicular to the plumb cut, deduct Half Ridge (3/4" for 2x, 3/8" for 1x). Along the sloped edge, that equals Half Ridge × Rafter Factor.'
                  },
                  {
                    id: 'rfTrueCut',
                    label: 'True Common Cut Length:',
                    value: calc.trueCutDisplay,
                    valueClass: 'text-emerald-600 dark:text-emerald-400',
                    tip: 'Actual layout length from the Ridge Plumb Cut down to the Birdsmouth Heel Cut (Theoretical Line Length minus Half-Ridge Sloped Allowance).'
                  },
                  {
                    id: 'rfTail',
                    label: 'Tail Overhang (+ Total w/ Tail):',
                    value: calc.tailDisplay,
                    valueClass: 'text-cyan-600 dark:text-cyan-400',
                    tip: 'Sloped overhang added below the birdsmouth heel cut to the fascia plumb cut: Horizontal Overhang × Rafter Factor.'
                  },
                  {
                    id: 'rfHip',
                    label: unitSystem === 'imperial' ? 'Hip/Valley (17" Base) & Drop:' : 'Hip/Valley (353.6mm) & Drop:',
                    value: calc.hipDisplay,
                    valueClass: 'text-amber-600 dark:text-amber-400',
                    tip:
                      unitSystem === 'imperial'
                        ? `45° Hip ULL = √(16.97² + Rise²) = ${calc.hipUllIn.toFixed(2)}"/ft. Hip Drop = (0.75" ÷ 16.97") × Unit Rise = ${calc.hipDropIn.toFixed(2)}" (${formatInchesSixteenths(calc.hipDropIn)}) so top edges of hip align with common rafters.`
                        : `45° Hip ULL = √(353.55² + Rise²) = ${calc.hipUllMm.toFixed(1)} mm per 250mm common run. Hip Drop = (19 ÷ 353.55) × Unit Rise = ${calc.hipDropMm.toFixed(1)} mm.`
                  }
                ].map((row, idx, arr) => (
                  <div
                    key={row.id}
                    className={`flex flex-col ${
                      idx < arr.length - 1 ? 'border-b border-slate-200/60 dark:border-slate-700/60 pb-2.5' : 'pt-0.5'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="font-sans font-semibold text-slate-700 dark:text-slate-200 leading-snug">
                          {row.label}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleInfo(row.id)}
                          aria-label={`Info about ${row.label}`}
                          className={`inline-flex items-center justify-center w-5 h-5 rounded-full shrink-0 transition-colors ${
                            activeTooltip === row.id
                              ? 'bg-orange-500/20 text-orange-400'
                              : 'text-slate-400 hover:text-orange-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                          }`}
                        >
                          <Info size={13} />
                        </button>
                      </div>

                      <div className={`ml-auto text-right font-mono font-bold whitespace-nowrap ${row.valueClass}`}>
                        {row.value}
                      </div>
                    </div>

                    {activeTooltip === row.id && (
                      <div className="text-xs text-orange-100 bg-slate-900 border border-orange-500/30 px-3 py-2 rounded-lg mt-2 leading-relaxed">
                        {row.tip}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs font-mono text-slate-400">Enter a non-zero Building Span and Roof Slope above to calculate rafter layout.</p>
            )}
          </div>

          {/* 2. LIVE 1:1 CAD ROOF RAFTER TRIANGLE DIAGRAM (viewBox="0 0 360 175") */}
          <div ref={cadSectionRef} className="space-y-4 shrink-0 scroll-mt-2">
          {calc && (
            <div className="bg-[#0a192f] border border-slate-700/90 rounded-xl overflow-hidden shadow-lg shrink-0">
              <div className="px-3 py-1.5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
                <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-orange-400">
                  LIVE 1:1 CAD ROOF RAFTER TRIANGLE &amp; RIDGE PROFILE
                </span>
                <span className="text-[10px] font-mono font-bold text-slate-400">
                  FACTOR ×{calc.rafterFactor.toFixed(4)}
                </span>
              </div>

              <svg viewBox="0 0 360 175" className="w-full h-auto min-h-[175px] block shrink-0">
                <defs>
                  <pattern id="roofCadSpotlightGrid" width="18" height="18" patternUnits="userSpaceOnUse">
                    <path d="M 18 0 L 0 0 0 18" fill="none" stroke="#172a46" strokeWidth="0.65" />
                  </pattern>
                </defs>
                <rect x="0" y="0" width="360" height="175" fill="#0a192f" />
                <rect x="0" y="0" width="360" height="175" fill="url(#roofCadSpotlightGrid)" />

                {/* Left & Right Exterior Wall Double Top Plates (Span x=44..236, Ridge Centerline x=140) */}
                <rect x="44" y="112" width="10" height="18" fill="#1e293b" stroke="#94a3b8" strokeWidth="1.2" />
                <line x1="44" y1="118" x2="54" y2="118" stroke="#94a3b8" strokeWidth="1" />
                <rect x="226" y="112" width="10" height="18" fill="#1e293b" stroke="#64748b" strokeWidth="1.2" />
                <line x1="226" y1="118" x2="236" y2="118" stroke="#64748b" strokeWidth="1" />

                {/* Horizontal Ceiling Joist / Plate Line */}
                <line x1="44" y1="112" x2="236" y2="112" stroke="#475569" strokeWidth="1.2" strokeDasharray="3 2.5" />

                {/* Symmetrical Right Ghost Rafter Completing Building Span */}
                <polygon
                  points="144,53 252,118 252,126 236,116 226,112 144,64"
                  fill="#1e293b"
                  stroke="#64748b"
                  strokeWidth="1.2"
                  opacity="0.85"
                />

                {/* Primary Left Common Rafter w/ Birdsmouth Seat & Eave Overhang Tail */}
                <polygon
                  points="136,53 26,119 26,128 44,117 44,112 54,112 54,114 136,65"
                  fill="#451a03"
                  stroke="#fb923c"
                  strokeWidth="1.8"
                />

                {/* Dashed Cyan Theoretical Measuring Line (Outer Wall Heel to Ridge Centerline) */}
                <line x1="44" y1="112" x2="140" y2="54" stroke="#22d3ee" strokeWidth="1.2" strokeDasharray="3.5 2.5" />

                {/* Center 2x / 1x Ridge Board at Peak (x=136..144, y=52..70) */}
                <rect x="136" y="52" width="8" height="18" fill="#7f1d1d" stroke="#f87171" strokeWidth="1.4" />
                <line x1="136" y1="52" x2="144" y2="70" stroke="#fca5a5" strokeWidth="0.9" />
                <line x1="144" y1="52" x2="136" y2="70" stroke="#fca5a5" strokeWidth="0.9" />

                {/* Center Vertical Rise Arrow (x=140, y=54..112) */}
                <line x1="140" y1="54" x2="140" y2="112" stroke="#fbbf24" strokeWidth="1.9" />
                <polygon points="140,54 137.2,59.5 142.8,59.5" fill="#fbbf24" />
                <polygon points="140,112 137.2,106.5 142.8,106.5" fill="#fbbf24" />

                {/* Architectural Slope Triangle Symbol on Right Slope */}
                <polygon points="186,80 212,80 212,95.5" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.3" />
                <text x="197" y="78" fill="#7dd3fc" fontSize="6" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                  12
                </text>
                <line x1="212" y1="80" x2="232" y2="73" stroke="#38bdf8" strokeWidth="1.1" strokeDasharray="2 2" />

                {/* Leaders to Top Pills */}
                <line x1="84" y1="84" x2="84" y2="21" stroke="#34d399" strokeWidth="1.3" strokeDasharray="3 2.5" />
                <line x1="140" y1="52" x2="140" y2="43" stroke="#f87171" strokeWidth="1.3" />

                {/* Bottom Horizontal Span & Run Dimension Arrows (y=138) */}
                <line x1="44" y1="131" x2="44" y2="144" stroke="#fb923c" strokeWidth="1.1" strokeDasharray="2 2" />
                <line x1="140" y1="114" x2="140" y2="144" stroke="#fbbf24" strokeWidth="1.1" strokeDasharray="2 2" />
                <line x1="236" y1="131" x2="236" y2="144" stroke="#38bdf8" strokeWidth="1.1" strokeDasharray="2 2" />

                {/* Solid Run Arrow (Left Half) */}
                <line x1="44" y1="138" x2="140" y2="138" stroke="#fb923c" strokeWidth="2" />
                <polygon points="44,138 50,135.2 50,140.8" fill="#fb923c" />
                <polygon points="140,138 134,135.2 134,140.8" fill="#fb923c" />

                {/* Dashed Remainder of Full Building Span Arrow (Right Half) */}
                <line x1="140" y1="138" x2="236" y2="138" stroke="#38bdf8" strokeWidth="1.6" strokeDasharray="3.5 2.5" />
                <polygon points="236,138 230,135.2 230,140.8" fill="#38bdf8" />
                <line x1="92" y1="138" x2="92" y2="152" stroke="#fb923c" strokeWidth="1.2" strokeDasharray="2 2" />

                {/* Opaque fill="#0a192f" Dynamic Callout Pills Drawn AFTER All Geometry & Dimension Lines */}
                <StairSvgPill
                  x={8}
                  y={13}
                  align="start"
                  maxWidth={248}
                  text={`TRUE CUT: ${calc.svgTrueCut} (ULL: ${calc.svgUll})`}
                  fontSize={7.0}
                  color="#6ee7b7"
                  borderColor="#059669"
                />
                <StairSvgPill
                  x={352}
                  y={35}
                  align="end"
                  maxWidth={224}
                  text={`DEDUCT 1/2 RIDGE: -${calc.svgRidgeDeduct}`}
                  fontSize={6.9}
                  color="#fca5a5"
                  borderColor="#ef4444"
                />
                <StairSvgPill
                  x={352}
                  y={66}
                  align="end"
                  maxWidth={162}
                  text={`SLOPE: ${calc.svgSlope} (ANGLE: ${calc.angleDeg}°)`}
                  fontSize={6.9}
                  color="#7dd3fc"
                  borderColor="#0284c7"
                />
                <StairSvgPill
                  x={140}
                  y={96}
                  align="middle"
                  maxWidth={102}
                  text={`RISE: ${calc.svgRise}`}
                  fontSize={6.8}
                  color="#fde68a"
                  borderColor="#d97706"
                />
                <StairSvgPill
                  x={8}
                  y={160}
                  align="start"
                  maxWidth={344}
                  text={`SPAN: ${calc.svgSpan} • RUN: ${calc.svgRun}`}
                  fontSize={7.0}
                  color="#fdba74"
                  borderColor="#ea580c"
                />
              </svg>
            </div>
          )}

          {/* 3. ALWAYS-VISIBLE "HOW TO DO THE MATH (RED SEAL STEP-BY-STEP TEACHER)" SECTION (6 NUMBERED CARDS) */}
          <div className="bg-slate-950 border border-orange-500/35 rounded-xl overflow-hidden shadow-lg shrink-0">
            <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400 shrink-0">
                <BookOpen size={16} />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider leading-tight">
                  HOW TO DO THE MATH (RED SEAL STEP-BY-STEP TEACHER)
                </h4>
                <p className="text-[10px] font-mono font-bold text-orange-400 uppercase tracking-widest mt-0.5">
                  RED SEAL MATH TEACHER — 6-STEP WORKED RAFTER SOLUTION
                </p>
              </div>
            </div>

            <div className="p-3.5 sm:p-4 space-y-3 text-xs text-slate-300 leading-relaxed">
              {calc ? (
                calc.mode === 'imperial' ? (
                  <>
                    {/* STEP 1 */}
                    <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-orange-500/20 border border-orange-400/50 text-orange-300 font-mono font-extrabold text-[11px] shrink-0">
                          1
                        </span>
                        <span className="font-bold text-white uppercase tracking-wide text-[11px] sm:text-xs">
                          Step 1 — Find Total Run (Span ÷ 2) &amp; Total Rise
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-400">
                        Formula: <span className="text-orange-300">Total Run = Building Span ÷ 2</span> &amp;{' '}
                        <span className="text-orange-300">Total Rise (in) = Total Run (ft) × Unit Rise</span>
                      </div>
                      <div className="font-mono text-slate-200 bg-slate-950/80 border border-slate-800/80 rounded px-2.5 py-1.5 text-[11px]">
                        {calc.spanFt.toFixed(2)}&apos; ÷ 2 ={' '}
                        <span className="font-bold text-cyan-300">
                          {calc.runFt.toFixed(2)}&apos; ({calc.runIn.toFixed(1)}&quot;) run
                        </span>{' '}
                        ➔ {calc.runFt.toFixed(2)}&apos; × {calc.unitRise}&quot; ={' '}
                        <span className="font-bold text-emerald-400">
                          {calc.totalRiseIn.toFixed(2)}&quot; ({formatFeetAndInches(calc.totalRiseIn)}) total rise
                        </span>
                      </div>
                    </div>

                    {/* STEP 2 */}
                    <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-orange-500/20 border border-orange-400/50 text-orange-300 font-mono font-extrabold text-[11px] shrink-0">
                          2
                        </span>
                        <span className="font-bold text-white uppercase tracking-wide text-[11px] sm:text-xs">
                          Step 2 — Calculate Common Unit Line Length (ULL) per Foot of Run
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-400">
                        Formula: <span className="text-orange-300">ULL = √(12² + Unit Rise²)</span> (Pythagorean Theorem on 12&quot; unit run)
                      </div>
                      <div className="font-mono text-slate-200 bg-slate-950/80 border border-slate-800/80 rounded px-2.5 py-1.5 text-[11px]">
                        √(144 + {calc.unitRise}²) = √(144 + {Math.pow(calc.unitRise, 2).toFixed(2)}) = √
                        {(144 + Math.pow(calc.unitRise, 2)).toFixed(2)} ={' '}
                        <span className="font-bold text-emerald-400">{calc.commonUllIn.toFixed(3)}&quot;/ft</span>{' '}
                        <span className="text-slate-400">(Unit Factor = {calc.commonUllIn.toFixed(3)} ÷ 12 = {calc.rafterFactor.toFixed(4)})</span>
                      </div>
                    </div>

                    {/* STEP 3 */}
                    <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-orange-500/20 border border-orange-400/50 text-orange-300 font-mono font-extrabold text-[11px] shrink-0">
                          3
                        </span>
                        <span className="font-bold text-white uppercase tracking-wide text-[11px] sm:text-xs">
                          Step 3 — Find Theoretical Common Rafter Line Length
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-400">
                        Formula: <span className="text-orange-300">Theoretical Line Length = Total Run (ft) × ULL</span>
                      </div>
                      <div className="font-mono text-slate-200 bg-slate-950/80 border border-slate-800/80 rounded px-2.5 py-1.5 text-[11px]">
                        {calc.runFt.toFixed(2)} ft × {calc.commonUllIn.toFixed(3)}&quot; ={' '}
                        <span className="font-bold text-emerald-400">
                          {calc.theoCommonIn.toFixed(2)}&quot; ({formatFeetAndInches(calc.theoCommonIn)})
                        </span>
                      </div>
                      <div className="text-[11px] text-amber-200/95 bg-amber-500/10 border border-amber-500/30 rounded px-2.5 py-1.5">
                        <strong className="text-amber-300">Teacher Note:</strong> Theoretical Line Length is measured along the Measuring Line from the outer wall plate corner (birdsmouth heel) to the exact centerline of the ridge.
                      </div>
                    </div>

                    {/* STEP 4 */}
                    <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-orange-500/20 border border-orange-400/50 text-orange-300 font-mono font-extrabold text-[11px] shrink-0">
                          4
                        </span>
                        <span className="font-bold text-white uppercase tracking-wide text-[11px] sm:text-xs">
                          Step 4 — Subtract Half the Ridge Board (True Cut Length)
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-400">
                        Formula:{' '}
                        <span className="text-orange-300">
                          Sloped Deduction = (Ridge Thickness ÷ 2) × (ULL ÷ 12)
                        </span>
                      </div>
                      <div className="font-mono text-slate-200 bg-slate-950/80 border border-slate-800/80 rounded px-2.5 py-1.5 text-[11px]">
                        {calc.halfRidgeHorizIn.toFixed(3)}&quot; × {calc.rafterFactor.toFixed(4)} ={' '}
                        <span className="text-rose-400 font-bold">
                          {calc.ridgeSlopedDeductIn.toFixed(2)}&quot; ({formatInchesSixteenths(calc.ridgeSlopedDeductIn)})
                        </span>{' '}
                        ➔ {calc.theoCommonIn.toFixed(2)}&quot; - {calc.ridgeSlopedDeductIn.toFixed(2)}&quot; ={' '}
                        <span className="font-bold text-emerald-400">
                          {calc.trueCommonCutIn.toFixed(2)}&quot; ({formatFeetAndInches(calc.trueCommonCutIn)})
                        </span>
                      </div>
                    </div>

                    {/* STEP 5 */}
                    <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-orange-500/20 border border-orange-400/50 text-orange-300 font-mono font-extrabold text-[11px] shrink-0">
                          5
                        </span>
                        <span className="font-bold text-white uppercase tracking-wide text-[11px] sm:text-xs">
                          Step 5 — Add Eave Overhang Tail Length
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-400">
                        Formula: <span className="text-orange-300">Tail Line Length = (Horizontal Overhang ÷ 12) × ULL</span>
                      </div>
                      <div className="font-mono text-slate-200 bg-slate-950/80 border border-slate-800/80 rounded px-2.5 py-1.5 text-[11px]">
                        ({calc.eaveHorizIn}&quot; ÷ 12) × {calc.commonUllIn.toFixed(3)}&quot; ={' '}
                        <span className="font-bold text-cyan-300">
                          +{calc.tailLineIn.toFixed(2)}&quot; ({formatFeetAndInches(calc.tailLineIn)})
                        </span>{' '}
                        ➔ Total w/ Tail ={' '}
                        <span className="font-bold text-emerald-400">
                          {calc.totalRafterWithTailIn.toFixed(2)}&quot; ({formatFeetAndInches(calc.totalRafterWithTailIn)})
                        </span>
                      </div>
                    </div>

                    {/* STEP 6 */}
                    <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-orange-500/20 border border-orange-400/50 text-orange-300 font-mono font-extrabold text-[11px] shrink-0">
                          6
                        </span>
                        <span className="font-bold text-white uppercase tracking-wide text-[11px] sm:text-xs">
                          Step 6 — Hip / Valley Rafter Math (17&quot; / 16.97&quot; Unit Run Rule)
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        <strong className="text-cyan-300">Why 16.97&quot; (17&quot;)?</strong> A 45° hip or valley travels diagonally across a 12&quot; × 12&quot; square (√(12² + 12²) = √288 = 16.97&quot; per foot of common run).
                      </div>
                      <div className="font-mono text-slate-200 bg-slate-950/80 border border-slate-800/80 rounded px-2.5 py-2 space-y-1 text-[11px]">
                        <div>
                          • Hip ULL = √(16.97² + {calc.unitRise}²) = √(288 + {Math.pow(calc.unitRise, 2).toFixed(1)}) ={' '}
                          <span className="font-bold text-cyan-300">{calc.hipUllIn.toFixed(2)}&quot; per ft of common run</span>
                        </div>
                        <div>
                          • Theoretical Hip = {calc.runFt.toFixed(2)} ft × {calc.hipUllIn.toFixed(3)}&quot; ={' '}
                          <span className="font-bold text-amber-300">
                            {calc.theoHipIn.toFixed(2)}&quot; ({formatFeetAndInches(calc.theoHipIn)})
                          </span>
                        </div>
                        <div>
                          • Hip Rafter Drop = (0.75&quot; ÷ 16.97&quot;) × {calc.unitRise}&quot; ={' '}
                          <span className="font-bold text-emerald-400">
                            {calc.hipDropIn.toFixed(2)}&quot; ({formatInchesSixteenths(calc.hipDropIn)})
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* METRIC 6-STEP TEACHER CARDS */}
                    <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-orange-500/20 border border-orange-400/50 text-orange-300 font-mono font-extrabold text-[11px] shrink-0">
                          1
                        </span>
                        <span className="font-bold text-white uppercase tracking-wide text-[11px] sm:text-xs">
                          Step 1 — Find Total Run (Span ÷ 2) &amp; Total Rise
                        </span>
                      </div>
                      <div className="font-mono text-slate-200 bg-slate-950/80 border border-slate-800/80 rounded px-2.5 py-1.5 text-[11px]">
                        {Math.round(calc.spanMm)} mm ÷ 2 ={' '}
                        <span className="font-bold text-cyan-300">{Math.round(calc.runMm)} mm run</span> ➔{' '}
                        {Math.round(calc.runMm)} × ({calc.unitRise250} ÷ 250) ={' '}
                        <span className="font-bold text-emerald-400">{Math.round(calc.totalRiseMm)} mm total rise</span>
                      </div>
                    </div>

                    <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-orange-500/20 border border-orange-400/50 text-orange-300 font-mono font-extrabold text-[11px] shrink-0">
                          2
                        </span>
                        <span className="font-bold text-white uppercase tracking-wide text-[11px] sm:text-xs">
                          Step 2 — Common Unit Line Length per 250 mm Run
                        </span>
                      </div>
                      <div className="font-mono text-slate-200 bg-slate-950/80 border border-slate-800/80 rounded px-2.5 py-1.5 text-[11px]">
                        ULL = √(250² + {calc.unitRise250}²) ={' '}
                        <span className="font-bold text-emerald-400">{calc.commonUllMm.toFixed(2)} mm / 250 mm</span>{' '}
                        <span className="text-slate-400">(Factor = {calc.rafterFactor.toFixed(4)})</span>
                      </div>
                    </div>

                    <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-orange-500/20 border border-orange-400/50 text-orange-300 font-mono font-extrabold text-[11px] shrink-0">
                          3
                        </span>
                        <span className="font-bold text-white uppercase tracking-wide text-[11px] sm:text-xs">
                          Step 3 — Theoretical Common Rafter Line Length
                        </span>
                      </div>
                      <div className="font-mono text-slate-200 bg-slate-950/80 border border-slate-800/80 rounded px-2.5 py-1.5 text-[11px]">
                        {Math.round(calc.runMm)} mm × {calc.rafterFactor.toFixed(4)} ={' '}
                        <span className="font-bold text-emerald-400">
                          {calc.theoCommonMm.toFixed(1)} mm ({(calc.theoCommonMm / 1000).toFixed(3)} m)
                        </span>
                      </div>
                    </div>

                    <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-orange-500/20 border border-orange-400/50 text-orange-300 font-mono font-extrabold text-[11px] shrink-0">
                          4
                        </span>
                        <span className="font-bold text-white uppercase tracking-wide text-[11px] sm:text-xs">
                          Step 4 — Subtract Half the Ridge Board (True Cut Length)
                        </span>
                      </div>
                      <div className="font-mono text-slate-200 bg-slate-950/80 border border-slate-800/80 rounded px-2.5 py-1.5 text-[11px]">
                        {calc.halfRidgeHorizMm} mm × {calc.rafterFactor.toFixed(4)} = -{calc.ridgeSlopedDeductMm.toFixed(1)} mm ➔{' '}
                        <span className="font-bold text-emerald-400">{calc.trueCutDisplay}</span>
                      </div>
                    </div>

                    <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-orange-500/20 border border-orange-400/50 text-orange-300 font-mono font-extrabold text-[11px] shrink-0">
                          5
                        </span>
                        <span className="font-bold text-white uppercase tracking-wide text-[11px] sm:text-xs">
                          Step 5 — Add Eave Overhang Tail Length
                        </span>
                      </div>
                      <div className="font-mono text-slate-200 bg-slate-950/80 border border-slate-800/80 rounded px-2.5 py-1.5 text-[11px]">
                        {Math.round(calc.eaveHorizMm)} mm × {calc.rafterFactor.toFixed(4)} = +{Math.round(calc.tailLineMm)} mm ➔ Total w/ Tail ={' '}
                        <span className="font-bold text-emerald-400">{Math.round(calc.totalRafterWithTailMm)} mm</span>
                      </div>
                    </div>

                    <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-orange-500/20 border border-orange-400/50 text-orange-300 font-mono font-extrabold text-[11px] shrink-0">
                          6
                        </span>
                        <span className="font-bold text-white uppercase tracking-wide text-[11px] sm:text-xs">
                          Step 6 — Hip / Valley Rafter Math (353.55 mm Unit Run Rule)
                        </span>
                      </div>
                      <div className="font-mono text-slate-200 bg-slate-950/80 border border-slate-800/80 rounded px-2.5 py-1.5 text-[11px]">
                        Hip ULL = √(353.55² + {calc.unitRise250}²) = {calc.hipUllMm.toFixed(1)} mm ➔ Hip ={' '}
                        <span className="font-bold text-amber-300">{calc.hipDisplay}</span>
                      </div>
                    </div>
                  </>
                )
              ) : (
                <p className="text-slate-400">Enter Building Span and Roof Slope above to view the 6-step worked Red Seal solution.</p>
              )}
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  )
}



function formatSurveyInches16(valIn, showPlus = false) {
  if (!Number.isFinite(valIn)) return '0"'
  const total16 = Math.round(valIn * 16)
  if (total16 === 0) return '0"'
  const sign = total16 < 0 ? '-' : showPlus ? '+' : ''
  const abs16 = Math.abs(total16)
  const whole = Math.floor(abs16 / 16)
  const rem = abs16 % 16
  if (rem === 0) return `${sign}${whole}"`
  const g = gcd(rem, 16)
  const frac = `${rem / g}/${16 / g}"`
  return whole > 0 ? `${sign}${whole} ${frac}` : `${sign}${frac}`
}

function formatSurveyFeetInches(valIn, showPlus = false) {
  if (!Number.isFinite(valIn)) return '0\'-0"'
  const total16 = Math.round(valIn * 16)
  if (total16 === 0) return '0\'-0"'
  const sign = total16 < 0 ? '-' : showPlus ? '+' : ''
  const abs16 = Math.abs(total16)
  const ft = Math.floor(abs16 / 192)
  const remIn16 = abs16 % 192
  const wholeIn = Math.floor(remIn16 / 16)
  const rem16 = remIn16 % 16
  if (rem16 === 0) return `${sign}${ft}'-${wholeIn}"`
  const g = gcd(rem16, 16)
  const frac = `${rem16 / g}/${16 / g}`
  return `${sign}${ft}'-${wholeIn} ${frac}"`
}

function metersToImperialParts(mVal) {
  if (!Number.isFinite(mVal)) return { ft: '0', inch: '0', six: '0' }
  const total16 = Math.round((mVal / 0.0254) * 16)
  const sign = total16 < 0 ? '-' : ''
  const abs16 = Math.abs(total16)
  const ft = Math.floor(abs16 / 192)
  const remIn16 = abs16 % 192
  const inch = Math.floor(remIn16 / 16)
  const six = remIn16 % 16
  return {
    ft: ft === 0 && sign === '-' ? '-0' : `${sign}${ft}`,
    inch: String(inch),
    six: String(six)
  }
}

function SurveyMetricDimInput({
  label,
  badge,
  value,
  onChange,
  unitTag = 'M',
  min,
  step = '0.005',
  accentColor = 'amber',
  disabled = false,
  rightToggle = null
}) {
  const numM = parseFloat(value)
  const valid = Number.isFinite(numM)
  const totalIn = valid ? numM / 0.0254 : 0
  const accentMap = {
    amber: 'text-amber-600 dark:text-amber-400 focus:border-amber-500',
    emerald: 'text-emerald-600 dark:text-emerald-400 focus:border-emerald-500',
    cyan: 'text-cyan-600 dark:text-cyan-400 focus:border-cyan-500',
    purple: 'text-purple-600 dark:text-purple-400 focus:border-purple-500'
  }
  const colorClasses = accentMap[accentColor] || accentMap.amber

  return (
    <div className="flex flex-col space-y-1">
      <div className="flex flex-wrap items-center justify-between gap-1 px-0.5">
        <div className="flex items-center gap-1.5">
          <span className={`text-[10px] font-mono font-extrabold uppercase tracking-wider ${colorClasses.split(' focus:')[0]}`}>
            {label}
          </span>
          {badge && (
            <span className="px-1.5 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-[9px] font-mono font-extrabold text-amber-600 dark:text-amber-300">
              {badge}
            </span>
          )}
          {rightToggle}
        </div>
        {valid && !disabled && (
          <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-300 ml-auto">
            = {numM.toFixed(3)} m ({Math.round(numM * 1000)} mm) • {formatSurveyFeetInches(totalIn)}
          </span>
        )}
      </div>
      <div className="relative">
        <input
          type="number"
          min={min}
          step={step}
          disabled={disabled}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl pl-3 pr-11 py-2 text-sm md:text-base font-mono font-bold text-slate-900 dark:text-white focus:outline-none transition-colors ${
            colorClasses.split(' ').slice(-1)[0]
          } ${disabled ? 'opacity-45' : ''}`}
        />
        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono font-extrabold text-slate-400 pointer-events-none">
          {unitTag}
        </span>
      </div>
    </div>
  )
}

function SurveyImperialDimInput({
  label,
  badge,
  feetVal,
  setFeetVal,
  inVal,
  setInVal,
  sixVal,
  setSixVal,
  totalInches,
  onToggleInfo,
  infoOpen,
  infoText
}) {
  const computedIn = Number.isFinite(totalInches)
    ? totalInches
    : (() => {
        const f = parseFloat(feetVal) || 0
        const isNeg = String(feetVal).trim().startsWith('-') || f < 0
        const sign = isNeg ? -1 : 1
        return sign * (Math.abs(f) * 12 + Math.max(0, parseFloat(inVal) || 0) + Math.max(0, parseFloat(sixVal) || 0) / 16)
      })()
  const computedM = computedIn * 0.0254

  return (
    <div className="space-y-1.5">
      <div className="flex flex-wrap items-center justify-between gap-1.5">
        <div className="flex items-center gap-1.5">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">
            {label}
          </label>
          {badge && (
            <span className="px-1.5 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-[9px] font-mono font-extrabold text-amber-600 dark:text-amber-300">
              {badge}
            </span>
          )}
          {onToggleInfo && (
            <button
              type="button"
              onClick={onToggleInfo}
              className="inline-flex items-center justify-center w-5 h-5 rounded-full text-slate-400 hover:text-amber-400 hover:bg-amber-500/15 transition-colors"
            >
              <Info size={13} />
            </button>
          )}
        </div>
        {Number.isFinite(computedIn) && (
          <span className="text-[10px] sm:text-[11px] font-mono font-bold text-amber-600 dark:text-amber-300 ml-auto">
            = {formatSurveyFeetInches(computedIn)} ({computedIn.toFixed(1)}&quot;) • {computedM.toFixed(3)} m
          </span>
        )}
      </div>

      {infoOpen && infoText && (
        <div className="text-xs text-slate-300 bg-slate-800 border border-slate-700 p-2.5 rounded-lg leading-relaxed">
          {infoText}
        </div>
      )}

      <div className="grid grid-cols-3 gap-2.5">
        <div className="flex flex-col">
          <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1 px-1">
            FEET (&apos;)
          </span>
          <div className="relative">
            <input
              type="number"
              placeholder="0"
              value={feetVal}
              onChange={(e) => setFeetVal(e.target.value)}
              className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl pl-3 pr-8 py-2 text-sm md:text-base font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors"
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono font-extrabold text-slate-400 pointer-events-none">
              FT
            </span>
          </div>
        </div>

        <div className="flex flex-col">
          <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1 px-1">
            INCHES (&quot;)
          </span>
          <div className="relative">
            <input
              type="number"
              min="0"
              placeholder="0"
              value={inVal}
              onChange={(e) => setInVal(e.target.value)}
              className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl pl-3 pr-8 py-2 text-sm md:text-base font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors"
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono font-extrabold text-slate-400 pointer-events-none">
              IN
            </span>
          </div>
        </div>

        <div className="flex flex-col">
          <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1 px-1">
            16THS (/16)
          </span>
          <div className="relative">
            <input
              type="number"
              min="0"
              max="15"
              step="1"
              placeholder="0"
              value={sixVal}
              onChange={(e) => setSixVal(e.target.value)}
              className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl pl-3 pr-9 py-2 text-sm md:text-base font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors"
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono font-extrabold text-slate-400 pointer-events-none">
              /16
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function ElevationsModal({ onClose }) {
  const [surveyMode, setSurveyMode] = useState('leveling') // 'leveling' | 'tp' | 'grade'
  const [unitSystem, setUnitSystem] = useState('imperial') // Default Imperial like other Trade Math modals, converts live when toggled!

  // MODE 1: BENCHMARK, HI & CUT/FILL — Imperial (FT / IN / 16THS) & Metric (Decimal Meters)
  const [bmFt, setBmFt] = useState('10')
  const [bmIn, setBmIn] = useState('0')
  const [bm16, setBm16] = useState('0')

  const [bsFt, setBsFt] = useState('5')
  const [bsIn, setBsIn] = useState('4')
  const [bs16, setBs16] = useState('0')

  const [fsFt, setFsFt] = useState('8')
  const [fsIn, setFsIn] = useState('2')
  const [fs16, setFs16] = useState('0')

  const [targetFt, setTargetFt] = useState('6')
  const [targetIn, setTargetIn] = useState('6')
  const [target16, setTarget16] = useState('0')

  const [bmMInput, setBmMInput] = useState('3.048')
  const [bsMInput, setBsMInput] = useState('1.626')
  const [fsMInput, setFsMInput] = useState('2.489')
  const [targetMInput, setTargetMInput] = useState('1.981')
  const [useTargetDesign, setUseTargetDesign] = useState(true)

  // MODE 2: TURNING POINT (TP1) 2-SETUP LOOP — Imperial & Metric
  const [tpBmFt, setTpBmFt] = useState('100')
  const [tpBmIn, setTpBmIn] = useState('0')
  const [tpBm16, setTpBm16] = useState('0')

  const [tpBs1Ft, setTpBs1Ft] = useState('5')
  const [tpBs1In, setTpBs1In] = useState('6')
  const [tpBs116, setTpBs116] = useState('0')

  const [tpFs1Ft, setTpFs1Ft] = useState('7')
  const [tpFs1In, setTpFs1In] = useState('8')
  const [tpFs116, setTpFs116] = useState('0')

  const [tpBs2Ft, setTpBs2Ft] = useState('4')
  const [tpBs2In, setTpBs2In] = useState('10')
  const [tpBs216, setTpBs216] = useState('0')

  const [tpFs2Ft, setTpFs2Ft] = useState('7')
  const [tpFs2In, setTpFs2In] = useState('2')
  const [tpFs216, setTpFs216] = useState('0')

  const [tpBmM, setTpBmM] = useState('30.480')
  const [tpBs1M, setTpBs1M] = useState('1.676')
  const [tpFs1M, setTpFs1M] = useState('2.337')
  const [tpBs2M, setTpBs2M] = useState('1.473')
  const [tpFs2M, setTpFs2M] = useState('2.184')

  // MODE 3: % GRADE & DRAINAGE FALL — Imperial & Metric
  const [gradeDistFt, setGradeDistFt] = useState('50')
  const [gradeDistIn, setGradeDistIn] = useState('0')
  const [gradeDist16, setGradeDist16] = useState('0')

  const [gradeStartFt, setGradeStartFt] = useState('100')
  const [gradeStartIn, setGradeStartIn] = useState('0')
  const [gradeStart16, setGradeStart16] = useState('0')

  const [gradeDistM, setGradeDistM] = useState('15.240')
  const [gradeStartM, setGradeStartM] = useState('30.480')
  const [gradePctInput, setGradePctInput] = useState('2.0')
  const [gradeDirection, setGradeDirection] = useState('fall') // 'fall' (-) | 'rise' (+)

  const [activeTooltip, setActiveTooltip] = useState(null)
  const [calcPulse, setCalcPulse] = useState(false)
  const scrollBodyRef = useRef(null)
  const cadSectionRef = useRef(null)

  const toSurveyIn = (ftStr, inStr, sixStr) => {
    const f = parseFloat(ftStr) || 0
    const isNeg = String(ftStr).trim().startsWith('-') || f < 0
    const sign = isNeg ? -1 : 1
    const absIn = Math.abs(f) * 12 + Math.max(0, parseFloat(inStr) || 0) + Math.max(0, parseFloat(sixStr) || 0) / 16
    return sign * absIn
  }

  // Seamless live conversion when switching between IMPERIAL and METRIC
  const handleSwitchUnitSystem = (nextUnit) => {
    if (nextUnit === unitSystem) return
    if (nextUnit === 'metric') {
      // Convert current Imperial inputs -> Metric inputs
      setBmMInput((toSurveyIn(bmFt, bmIn, bm16) * 0.0254).toFixed(3))
      setBsMInput((Math.max(0, toSurveyIn(bsFt, bsIn, bs16)) * 0.0254).toFixed(3))
      setFsMInput((Math.max(0, toSurveyIn(fsFt, fsIn, fs16)) * 0.0254).toFixed(3))
      setTargetMInput((toSurveyIn(targetFt, targetIn, target16) * 0.0254).toFixed(3))

      setTpBmM((toSurveyIn(tpBmFt, tpBmIn, tpBm16) * 0.0254).toFixed(3))
      setTpBs1M((Math.max(0, toSurveyIn(tpBs1Ft, tpBs1In, tpBs116)) * 0.0254).toFixed(3))
      setTpFs1M((Math.max(0, toSurveyIn(tpFs1Ft, tpFs1In, tpFs116)) * 0.0254).toFixed(3))
      setTpBs2M((Math.max(0, toSurveyIn(tpBs2Ft, tpBs2In, tpBs216)) * 0.0254).toFixed(3))
      setTpFs2M((Math.max(0, toSurveyIn(tpFs2Ft, tpFs2In, tpFs216)) * 0.0254).toFixed(3))

      setGradeDistM((Math.max(0, toSurveyIn(gradeDistFt, gradeDistIn, gradeDist16)) * 0.0254).toFixed(3))
      setGradeStartM((toSurveyIn(gradeStartFt, gradeStartIn, gradeStart16) * 0.0254).toFixed(3))
    } else {
      // Convert current Metric inputs -> Imperial FT / IN / 16THS inputs
      const pBm = metersToImperialParts(parseFloat(bmMInput) || 0)
      setBmFt(pBm.ft); setBmIn(pBm.inch); setBm16(pBm.six)
      const pBs = metersToImperialParts(Math.max(0, parseFloat(bsMInput) || 0))
      setBsFt(pBs.ft); setBsIn(pBs.inch); setBs16(pBs.six)
      const pFs = metersToImperialParts(Math.max(0, parseFloat(fsMInput) || 0))
      setFsFt(pFs.ft); setFsIn(pFs.inch); setFs16(pFs.six)
      const pTg = metersToImperialParts(parseFloat(targetMInput) || 0)
      setTargetFt(pTg.ft); setTargetIn(pTg.inch); setTarget16(pTg.six)

      const pTpBm = metersToImperialParts(parseFloat(tpBmM) || 0)
      setTpBmFt(pTpBm.ft); setTpBmIn(pTpBm.inch); setTpBm16(pTpBm.six)
      const pTpBs1 = metersToImperialParts(Math.max(0, parseFloat(tpBs1M) || 0))
      setTpBs1Ft(pTpBs1.ft); setTpBs1In(pTpBs1.inch); setTpBs116(pTpBs1.six)
      const pTpFs1 = metersToImperialParts(Math.max(0, parseFloat(tpFs1M) || 0))
      setTpFs1Ft(pTpFs1.ft); setTpFs1In(pTpFs1.inch); setTpFs116(pTpFs1.six)
      const pTpBs2 = metersToImperialParts(Math.max(0, parseFloat(tpBs2M) || 0))
      setTpBs2Ft(pTpBs2.ft); setTpBs2In(pTpBs2.inch); setTpBs216(pTpBs2.six)
      const pTpFs2 = metersToImperialParts(Math.max(0, parseFloat(tpFs2M) || 0))
      setTpFs2Ft(pTpFs2.ft); setTpFs2In(pTpFs2.inch); setTpFs216(pTpFs2.six)

      const pGrDist = metersToImperialParts(Math.max(0, parseFloat(gradeDistM) || 0))
      setGradeDistFt(pGrDist.ft); setGradeDistIn(pGrDist.inch); setGradeDist16(pGrDist.six)
      const pGrStart = metersToImperialParts(parseFloat(gradeStartM) || 0)
      setGradeStartFt(pGrStart.ft); setGradeStartIn(pGrStart.inch); setGradeStart16(pGrStart.six)
    }
    setUnitSystem(nextUnit)
  }

  const fmtDualElev = (valM, valIn, impPrimary) => {
    const impStr = formatSurveyFeetInches(valIn)
    const metStr = `${valM.toFixed(3)} m`
    return impPrimary ? `${impStr} • ${metStr}` : `${metStr} • ${impStr}`
  }

  const fmtDualRod = (valM, valIn, impPrimary) => {
    const impStr = `${formatSurveyFeetInches(valIn)} (${valIn.toFixed(1)}")`
    const metStr = `${valM.toFixed(3)} m (${Math.round(valM * 1000)} mm)`
    return impPrimary ? `${impStr} • ${valM.toFixed(3)} m` : `${metStr} • ${formatSurveyFeetInches(valIn)}`
  }

  const calc = useMemo(() => {
    const impPrimary = unitSystem === 'imperial'

    if (surveyMode === 'leveling') {
      let bmM, bsM, fsM, hasTarget, targetM
      if (impPrimary) {
        const bmInVal = toSurveyIn(bmFt, bmIn, bm16)
        const bsInVal = Math.max(0, toSurveyIn(bsFt, bsIn, bs16))
        const fsInVal = Math.max(0, toSurveyIn(fsFt, fsIn, fs16))
        bmM = bmInVal * 0.0254
        bsM = bsInVal * 0.0254
        fsM = fsInVal * 0.0254
        hasTarget = useTargetDesign
        targetM = hasTarget ? toSurveyIn(targetFt, targetIn, target16) * 0.0254 : null
      } else {
        bmM = parseFloat(bmMInput)
        bsM = Math.max(0, parseFloat(bsMInput) || 0)
        fsM = Math.max(0, parseFloat(fsMInput) || 0)
        if (!Number.isFinite(bmM)) return null
        hasTarget = useTargetDesign && targetMInput.trim() !== '' && Number.isFinite(parseFloat(targetMInput))
        targetM = hasTarget ? parseFloat(targetMInput) : null
      }

      const bmInTotal = bmM / 0.0254
      const bsInTotal = bsM / 0.0254
      const fsInTotal = fsM / 0.0254

      const hiM = bmM + bsM
      const hiInTotal = hiM / 0.0254
      const actualM = hiM - fsM
      const actualInTotal = actualM / 0.0254
      const diffBmM = actualM - bmM
      const diffBmIn = actualInTotal - bmInTotal

      const targetInTotal = hasTarget ? targetM / 0.0254 : null
      const targetRodM = hasTarget ? hiM - targetM : null
      const targetRodIn = hasTarget ? hiInTotal - targetInTotal : null

      const groundAboveTargetM = hasTarget ? actualM - targetM : 0
      const groundAboveTargetIn = hasTarget ? actualInTotal - targetInTotal : 0
      const cutFillMm = Math.round(Math.abs(groundAboveTargetM) * 1000)
      const absCutFillIn = Math.abs(groundAboveTargetIn)

      let actionType = 'none'
      let actionDisplay = 'Optional (Enable Target Elev)'
      let actionClass = 'text-slate-400'
      let svgCutFillBadge = `ACT: ${impPrimary ? `${formatSurveyFeetInches(actualInTotal)} (${actualM.toFixed(2)}m)` : `${actualM.toFixed(3)}m (${formatSurveyFeetInches(actualInTotal)})`}`

      if (hasTarget) {
        if (groundAboveTargetM > 0.0005) {
          actionType = 'cut'
          actionDisplay = impPrimary
            ? `CUT (DIG): -${formatSurveyInches16(absCutFillIn)} (${formatSurveyFeetInches(-absCutFillIn)}) • -${Math.abs(groundAboveTargetM).toFixed(3)} m (${cutFillMm} mm)`
            : `CUT (DIG): -${Math.abs(groundAboveTargetM).toFixed(3)} m (${cutFillMm} mm) • -${formatSurveyInches16(absCutFillIn)}`
          actionClass = 'text-amber-600 dark:text-amber-400'
          svgCutFillBadge = `CUT: -${formatSurveyInches16(absCutFillIn)} (-${cutFillMm}mm)`
        } else if (groundAboveTargetM < -0.0005) {
          actionType = 'fill'
          actionDisplay = impPrimary
            ? `FILL (ADD): +${formatSurveyInches16(absCutFillIn)} (${formatSurveyFeetInches(absCutFillIn, true)}) • +${Math.abs(groundAboveTargetM).toFixed(3)} m (${cutFillMm} mm)`
            : `FILL (ADD): +${Math.abs(groundAboveTargetM).toFixed(3)} m (${cutFillMm} mm) • +${formatSurveyInches16(absCutFillIn)}`
          actionClass = 'text-emerald-600 dark:text-emerald-400'
          svgCutFillBadge = `FILL: +${formatSurveyInches16(absCutFillIn)} (+${cutFillMm}mm)`
        } else {
          actionType = 'exact'
          actionDisplay = 'ON EXACT DESIGN GRADE (0" • 0 mm)'
          actionClass = 'text-cyan-600 dark:text-cyan-400'
          svgCutFillBadge = `ON GRADE (0" • 0mm)`
        }
      }

      const diffSignM = diffBmM >= 0 ? '+' : ''
      const diffRelLabel =
        Math.abs(diffBmM) < 0.0005
          ? '0" • 0.000 m (AT BM DATUM)'
          : impPrimary
          ? `${formatSurveyFeetInches(diffBmIn, diffBmIn > 0)} (${diffBmIn.toFixed(1)}") • ${diffSignM}${diffBmM.toFixed(3)} m`
          : `${diffSignM}${diffBmM.toFixed(3)} m (${Math.round(diffBmM * 1000)} mm) • ${formatSurveyFeetInches(diffBmIn, diffBmIn > 0)}`

      return {
        surveyMode: 'leveling',
        unitSystem,
        bmM,
        bsM,
        fsM,
        hiM,
        actualM,
        diffBmM,
        bmInTotal,
        bsInTotal,
        fsInTotal,
        hiInTotal,
        actualInTotal,
        diffBmIn,
        hasTarget,
        targetM,
        targetInTotal,
        targetRodM,
        targetRodIn,
        groundAboveTargetM,
        groundAboveTargetIn,
        cutFillMm,
        absCutFillIn,
        actionType,
        actionDisplay,
        rows: [
          {
            id: 'lvBm',
            label: 'Benchmark Datum (BM):',
            value: fmtDualElev(bmM, bmInTotal, impPrimary),
            valueClass: 'text-slate-900 dark:text-white text-xs',
            tip: `Permanent known reference elevation on site: ${formatSurveyFeetInches(bmInTotal)} (${bmInTotal.toFixed(2)}") = ${bmM.toFixed(3)} m.`
          },
          {
            id: 'lvHi',
            label: 'Height of Instrument (HI = BM + BS):',
            value: fmtDualElev(hiM, hiInTotal, impPrimary),
            valueClass: 'text-amber-600 dark:text-amber-400 text-xs',
            tip: `Exact elevation of the transit/laser plane: ${formatSurveyFeetInches(bmInTotal)} + ${formatSurveyFeetInches(bsInTotal)} = ${formatSurveyFeetInches(hiInTotal)} (${hiM.toFixed(3)} m).`
          },
          {
            id: 'lvActual',
            label: 'Actual Point Elevation (HI - FS):',
            value: fmtDualElev(actualM, actualInTotal, impPrimary),
            valueClass: 'text-cyan-600 dark:text-cyan-400 text-xs',
            tip: `Ground/footing elevation at the Foresight rod: ${formatSurveyFeetInches(hiInTotal)} - ${formatSurveyFeetInches(fsInTotal)} = ${formatSurveyFeetInches(actualInTotal)} (${actualM.toFixed(3)} m).`
          },
          {
            id: 'lvDiffBm',
            label: 'Elev Diff vs. Benchmark (Actual - BM):',
            value: diffRelLabel,
            valueClass: `${diffBmM < -0.0005 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'} text-xs`,
            tip: 'Net vertical difference between your current excavation point and the starting Benchmark (Actual Elev - BM, or BS - FS).'
          },
          {
            id: 'lvTargetRod',
            label: 'Target Rod for Design Elev (HI - Target):',
            value: hasTarget ? fmtDualRod(targetRodM, targetRodIn, impPrimary) : 'Optional',
            valueClass: 'text-purple-600 dark:text-purple-400 text-xs',
            tip: hasTarget
              ? `Exact reading needed on the grade rod at Target Design Elev (${formatSurveyFeetInches(targetInTotal)} / ${targetM.toFixed(3)} m): HI - Target = ${formatSurveyFeetInches(targetRodIn)} (${targetRodM.toFixed(3)} m).`
              : 'Enable Target Design Elevation above to compute the required grade rod reading.'
          },
          {
            id: 'lvAction',
            label: 'Excavation Action (CUT vs. FILL):',
            value: actionDisplay,
            valueClass: `${actionClass} text-[11px] sm:text-xs`,
            tip: 'Smaller FS than Target Rod = ground is too high ➔ CUT (dig down). Larger FS than Target Rod = hole is too deep ➔ FILL (build up).'
          }
        ],
        svgHi: `${formatSurveyFeetInches(hiInTotal)} (${hiM.toFixed(2)}m)`,
        svgBm: `${formatSurveyFeetInches(bmInTotal)} (${bmM.toFixed(2)}m)`,
        svgBs: `${formatSurveyFeetInches(bsInTotal)} (${bsM.toFixed(2)}m)`,
        svgFs: `${formatSurveyFeetInches(fsInTotal)} (${fsM.toFixed(2)}m)`,
        svgTargetRod: hasTarget
          ? `${formatSurveyFeetInches(targetRodIn)} (${targetRodM.toFixed(2)}m)`
          : `${formatSurveyFeetInches(actualInTotal)} (${actualM.toFixed(2)}m)`,
        svgCutFillBadge
      }
    }

    if (surveyMode === 'tp') {
      let bmM, bs1M, fs1M, bs2M, fs2M
      if (impPrimary) {
        bmM = toSurveyIn(tpBmFt, tpBmIn, tpBm16) * 0.0254
        bs1M = Math.max(0, toSurveyIn(tpBs1Ft, tpBs1In, tpBs116)) * 0.0254
        fs1M = Math.max(0, toSurveyIn(tpFs1Ft, tpFs1In, tpFs116)) * 0.0254
        bs2M = Math.max(0, toSurveyIn(tpBs2Ft, tpBs2In, tpBs216)) * 0.0254
        fs2M = Math.max(0, toSurveyIn(tpFs2Ft, tpFs2In, tpFs216)) * 0.0254
      } else {
        bmM = parseFloat(tpBmM)
        bs1M = Math.max(0, parseFloat(tpBs1M) || 0)
        fs1M = Math.max(0, parseFloat(tpFs1M) || 0)
        bs2M = Math.max(0, parseFloat(tpBs2M) || 0)
        fs2M = Math.max(0, parseFloat(tpFs2M) || 0)
        if (!Number.isFinite(bmM)) return null
      }

      const hi1M = bmM + bs1M
      const tp1M = hi1M - fs1M
      const hi2M = tp1M + bs2M
      const finalM = hi2M - fs2M
      const sumBsM = bs1M + bs2M
      const sumFsM = fs1M + fs2M
      const netDeltaM = sumBsM - sumFsM

      const bmInV = bmM / 0.0254
      const bs1InV = bs1M / 0.0254
      const fs1InV = fs1M / 0.0254
      const bs2InV = bs2M / 0.0254
      const fs2InV = fs2M / 0.0254
      const hi1InV = hi1M / 0.0254
      const tp1InV = tp1M / 0.0254
      const hi2InV = hi2M / 0.0254
      const finalInV = finalM / 0.0254
      const sumBsInV = sumBsM / 0.0254
      const sumFsInV = sumFsM / 0.0254
      const netDeltaInV = netDeltaM / 0.0254

      return {
        surveyMode: 'tp',
        unitSystem,
        bmM, bs1M, fs1M, bs2M, fs2M, hi1M, tp1M, hi2M, finalM, sumBsM, sumFsM, netDeltaM,
        bmInV, bs1InV, fs1InV, bs2InV, fs2InV, hi1InV, tp1InV, hi2InV, finalInV, sumBsInV, sumFsInV, netDeltaInV,
        rows: [
          {
            id: 'tpHi1',
            label: 'Setup #1 HI (BM + BS1):',
            value: fmtDualElev(hi1M, hi1InV, impPrimary),
            valueClass: 'text-amber-600 dark:text-amber-400 text-xs',
            tip: `First instrument setup line of sight: ${formatSurveyFeetInches(bmInV)} + ${formatSurveyFeetInches(bs1InV)} = ${formatSurveyFeetInches(hi1InV)} (${hi1M.toFixed(3)} m).`
          },
          {
            id: 'tpElev1',
            label: 'Turning Point TP1 Elev (HI1 - FS1):',
            value: fmtDualElev(tp1M, tp1InV, impPrimary),
            valueClass: 'text-cyan-600 dark:text-cyan-400 text-xs',
            tip: `Temporary solid stake/pin elevation before moving tripod: ${formatSurveyFeetInches(hi1InV)} - ${formatSurveyFeetInches(fs1InV)} = ${formatSurveyFeetInches(tp1InV)} (${tp1M.toFixed(3)} m).`
          },
          {
            id: 'tpHi2',
            label: 'Setup #2 HI (TP1 + BS2):',
            value: fmtDualElev(hi2M, hi2InV, impPrimary),
            valueClass: 'text-amber-600 dark:text-amber-400 text-xs',
            tip: `Second instrument setup HI after Backsight BS2 on TP1: ${formatSurveyFeetInches(tp1InV)} + ${formatSurveyFeetInches(bs2InV)} = ${formatSurveyFeetInches(hi2InV)} (${hi2M.toFixed(3)} m).`
          },
          {
            id: 'tpFinal',
            label: 'Final Point Elevation (HI2 - FS2):',
            value: fmtDualElev(finalM, finalInV, impPrimary),
            valueClass: 'text-emerald-600 dark:text-emerald-400 text-xs',
            tip: `Final point elevation from Setup #2: ${formatSurveyFeetInches(hi2InV)} - ${formatSurveyFeetInches(fs2InV)} = ${formatSurveyFeetInches(finalInV)} (${finalM.toFixed(3)} m).`
          },
          {
            id: 'tpSums',
            label: 'Total Sights (ΣBS vs. ΣFS):',
            value: `ΣBS +${formatSurveyFeetInches(sumBsInV)} (+${sumBsM.toFixed(3)}m) • ΣFS -${formatSurveyFeetInches(sumFsInV)} (-${sumFsM.toFixed(3)}m)`,
            valueClass: 'text-slate-900 dark:text-white text-[11px]',
            tip: 'Red Seal Note-Reduction Check: sum all Backsights (ΣBS) and sum all Foresights (ΣFS) in both Imperial and Metric.'
          },
          {
            id: 'tpLoop',
            label: 'Loop Check (BM + ΣBS - ΣFS):',
            value: `Δ ${formatSurveyFeetInches(netDeltaInV, true)} (${netDeltaM >= 0 ? '+' : ''}${netDeltaM.toFixed(3)}m) ✓`,
            valueClass: 'text-purple-600 dark:text-purple-400 text-xs',
            tip: `Confirms zero arithmetic error: BM + (ΣBS - ΣFS) = ${formatSurveyFeetInches(finalInV)} (${finalM.toFixed(3)} m).`
          }
        ],
        svgBm: `${formatSurveyFeetInches(bmInV)} (${bmM.toFixed(2)}m)`,
        svgHi1: `${formatSurveyFeetInches(hi1InV)} (${hi1M.toFixed(2)}m)`,
        svgTp1: `${formatSurveyFeetInches(tp1InV)} (${tp1M.toFixed(2)}m)`,
        svgHi2: `${formatSurveyFeetInches(hi2InV)} (${hi2M.toFixed(2)}m)`,
        svgFinal: `${formatSurveyFeetInches(finalInV)} (${finalM.toFixed(2)}m)`,
        svgDelta: `${formatSurveyFeetInches(netDeltaInV, true)} / ${netDeltaM >= 0 ? '+' : ''}${netDeltaM.toFixed(2)}m`
      }
    }

    // MODE 3: % GRADE & DRAINAGE FALL (Both Imperial & Metric simultaneously!)
    const gradePct = Math.max(0, parseFloat(gradePctInput) || 0)
    if (gradePct <= 0) return null
    const slopeDec = gradePct / 100
    const ratioX = 100 / gradePct // 1 : X
    const inPerFt = slopeDec * 12 // inches drop per 12" horizontal foot
    const mmPerM = slopeDec * 1000 // mm drop per 1m horizontal run
    const isRise = gradeDirection === 'rise'
    const dirSign = isRise ? 1 : -1

    let runM, startM
    if (impPrimary) {
      const runInInput = Math.max(0, toSurveyIn(gradeDistFt, gradeDistIn, gradeDist16))
      const startInInput = toSurveyIn(gradeStartFt, gradeStartIn, gradeStart16)
      if (runInInput <= 0) return null
      runM = runInInput * 0.0254
      startM = startInInput * 0.0254
    } else {
      runM = Math.max(0, parseFloat(gradeDistM) || 0)
      startM = parseFloat(gradeStartM)
      if (runM <= 0 || !Number.isFinite(startM)) return null
    }

    const runIn = runM / 0.0254
    const runFt = runIn / 12
    const startIn = startM / 0.0254

    const fallM = runM * slopeDec
    const fallMm = Math.round(fallM * 1000)
    const fallIn = runIn * slopeDec
    const fallFt = fallIn / 12

    const endM = startM + dirSign * fallM
    const endIn = startIn + dirSign * fallIn
    const signChar = isRise ? '+' : '-'

    const runDualStr = impPrimary
      ? `${formatSurveyFeetInches(runIn)} (${runFt.toFixed(2)} ft) • ${runM.toFixed(2)} m`
      : `${runM.toFixed(2)} m • ${formatSurveyFeetInches(runIn)} (${runFt.toFixed(2)} ft)`

    const fallDualStr = impPrimary
      ? `${signChar}${formatSurveyInches16(fallIn)} (${signChar}${fallFt.toFixed(3)} ft) • ${signChar}${fallM.toFixed(3)} m (${fallMm} mm)`
      : `${signChar}${fallM.toFixed(3)} m (${fallMm} mm) • ${signChar}${formatSurveyInches16(fallIn)} (${signChar}${fallFt.toFixed(3)} ft)`

    const ratioFormatted = ratioX.toFixed(ratioX % 1 === 0 ? 0 : 1)

    return {
      surveyMode: 'grade',
      unitSystem,
      gradePct,
      slopeDec,
      ratioX,
      ratioFormatted,
      inPerFt,
      mmPerM,
      isRise,
      runM,
      runIn,
      runFt,
      startM,
      startIn,
      fallM,
      fallMm,
      fallIn,
      fallFt,
      endM,
      endIn,
      rows: [
        {
          id: 'grRun',
          label: 'Horizontal Run Distance:',
          value: runDualStr,
          valueClass: 'text-slate-900 dark:text-white text-xs',
          tip: `Level horizontal run distance in both systems: ${formatSurveyFeetInches(runIn)} (${runFt.toFixed(2)} ft / ${runIn.toFixed(1)}") = ${runM.toFixed(3)} m.`
        },
        {
          id: 'grFall',
          label: isRise ? 'Total Vertical Rise (+):' : 'Total Vertical Fall / Drop (-):',
          value: fallDualStr,
          valueClass: `${isRise ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'} text-xs`,
          tip: `Run × (% Grade ÷ 100): ${runM.toFixed(2)} m × ${slopeDec.toFixed(4)} = ${fallM.toFixed(3)} m (${fallMm} mm), or ${runFt.toFixed(2)} ft × ${slopeDec.toFixed(4)} = ${fallFt.toFixed(3)} ft (${formatSurveyInches16(fallIn)}).`
        },
        {
          id: 'grRatio',
          label: 'Equivalent Slope Ratio (1 : X):',
          value: `1 : ${ratioFormatted} (${gradePct.toFixed(2)}% Grade)`,
          valueClass: 'text-cyan-600 dark:text-cyan-400 text-xs',
          tip: `1 unit vertical per (100 ÷ ${gradePct}) = ${ratioX.toFixed(2)} units horizontal (e.g., 2% = 1:50 drainage; 8.33% = 1:12 barrier-free ramp).`
        },
        {
          id: 'grRate',
          label: 'Unit Slope Rate (Imperial & Metric):',
          value: `${formatSurveyInches16(inPerFt)}/ft (${inPerFt.toFixed(2)}"/ft) • ${mmPerM.toFixed(1)} mm/m`,
          valueClass: 'text-purple-600 dark:text-purple-400 text-xs',
          tip: 'Carpenter rule of thumb: 1% = 10 mm/m (≈ 1/8"/ft), 2% = 20 mm/m (0.24"/ft ≈ 1/4"/ft standard trench/pipe slope).'
        },
        {
          id: 'grStart',
          label: 'Starting Elevation:',
          value: fmtDualElev(startM, startIn, impPrimary),
          valueClass: 'text-slate-900 dark:text-white text-xs',
          tip: `Upstream / starting elevation: ${formatSurveyFeetInches(startIn)} = ${startM.toFixed(3)} m.`
        },
        {
          id: 'grEnd',
          label: `Ending Elevation (Start ${signChar} Fall):`,
          value: fmtDualElev(endM, endIn, impPrimary),
          valueClass: 'text-emerald-600 dark:text-emerald-400 text-xs',
          tip: `${formatSurveyFeetInches(startIn)} ${signChar} ${formatSurveyInches16(fallIn)} = ${formatSurveyFeetInches(endIn)} (${startM.toFixed(3)} m ${signChar} ${fallM.toFixed(3)} m = ${endM.toFixed(3)} m).`
        }
      ],
      svgStartElev: impPrimary
        ? `${formatSurveyFeetInches(startIn)} (${startM.toFixed(2)}m)`
        : `${startM.toFixed(2)}m (${formatSurveyFeetInches(startIn)})`,
      svgEndElev: impPrimary
        ? `${formatSurveyFeetInches(endIn)} (${endM.toFixed(2)}m)`
        : `${endM.toFixed(2)}m (${formatSurveyFeetInches(endIn)})`,
      svgRun: impPrimary
        ? `${formatSurveyFeetInches(runIn)} (${runM.toFixed(2)}m)`
        : `${runM.toFixed(2)}m (${formatSurveyFeetInches(runIn)})`,
      svgGradeBadge: `${gradePct}% (1:${ratioFormatted} • ${formatSurveyInches16(inPerFt)}/FT)`,
      svgFall: `${signChar}${fallMm}mm (${signChar}${formatSurveyInches16(fallIn)})`
    }
  }, [
    surveyMode,
    unitSystem,
    bmMInput,
    bsMInput,
    fsMInput,
    targetMInput,
    useTargetDesign,
    bmFt,
    bmIn,
    bm16,
    bsFt,
    bsIn,
    bs16,
    fsFt,
    fsIn,
    fs16,
    targetFt,
    targetIn,
    target16,
    tpBmM,
    tpBs1M,
    tpFs1M,
    tpBs2M,
    tpFs2M,
    tpBmFt,
    tpBmIn,
    tpBm16,
    tpBs1Ft,
    tpBs1In,
    tpBs116,
    tpFs1Ft,
    tpFs1In,
    tpFs116,
    tpBs2Ft,
    tpBs2In,
    tpBs216,
    tpFs2Ft,
    tpFs2In,
    tpFs216,
    gradeDistM,
    gradeStartM,
    gradePctInput,
    gradeDirection,
    gradeDistFt,
    gradeDistIn,
    gradeDist16,
    gradeStartFt,
    gradeStartIn,
    gradeStart16
  ])

  const handleCalculate = () => {
    setCalcPulse(true)
    setTimeout(() => setCalcPulse(false), 300)
  }

  const toggleInfo = (key) => {
    setActiveTooltip((prev) => (prev === key ? null : key))
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 p-4 shrink-0 bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500 rounded-lg text-white shrink-0">
              <Ruler size={22} />
            </div>
            <div>
              <h3 className="text-slate-900 dark:text-white text-base md:text-lg font-bold uppercase tracking-wider leading-tight">
                ELEVATIONS &amp; GRADES
              </h3>
              <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                HI, TARGET ROD, CUT/FILL, TP LOOPS &amp; % GRADE
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition-colors p-1">
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Sticky Quick Section Switcher Bar */}
        <div className="px-4 py-2 bg-slate-100 dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800 shrink-0 flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollBodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex-1 py-1.5 px-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-[11px] font-mono font-extrabold text-slate-800 dark:text-slate-200 hover:border-amber-500/60 transition-colors"
          >
            🧮 Calculator &amp; Results
          </button>
          <button
            type="button"
            onClick={() => cadSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            className="flex-1 py-1.5 px-2.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-[11px] font-mono font-extrabold text-amber-700 dark:text-amber-300 transition-colors"
          >
            📐 1:1 CAD &amp; Math Teacher ↓
          </button>
        </div>

        {/* Scrollable Body (Block flow prevents flex-shrink crushing) */}
        <div
          ref={scrollBodyRef}
          className="block space-y-4 p-4 md:p-5 overflow-y-auto custom-scrollbar flex-1 min-h-0 max-h-[82vh]"
        >
          {/* 3-Mode Red Seal Surveying & Grade Selector */}
          <div className="grid grid-cols-3 gap-1.5 bg-slate-200 dark:bg-slate-800/90 p-1 rounded-xl shrink-0">
            {[
              { id: 'leveling', title: 'BM, HI & Cut/Fill', sub: 'HI - FS & Rod' },
              { id: 'tp', title: 'Turning Pt (TP1)', sub: '2-Setup Loop' },
              { id: 'grade', title: '% Grade & Fall', sub: 'Run × % Slope' }
            ].map((tab) => {
              const active = surveyMode === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSurveyMode(tab.id)}
                  className={`py-2 px-1.5 rounded-lg text-center transition-all ${
                    active
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider leading-tight">
                    {tab.title}
                  </div>
                  <div className={`text-[9px] font-mono font-bold mt-0.5 ${active ? 'text-amber-100' : 'text-slate-500'}`}>
                    {tab.sub}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Imperial (FT / IN / 16THS) vs Metric (M / MM) Live-Converting Toggle */}
          <div className="flex bg-slate-200 dark:bg-slate-800 rounded-lg p-1 shrink-0">
            <button
              type="button"
              onClick={() => handleSwitchUnitSystem('imperial')}
              className={`flex-1 py-2 px-2 text-[11px] font-bold uppercase tracking-wider rounded-md transition-colors ${
                unitSystem === 'imperial'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Imperial (FT / IN / 16THS)
            </button>
            <button
              type="button"
              onClick={() => handleSwitchUnitSystem('metric')}
              className={`flex-1 py-2 px-2 text-[11px] font-bold uppercase tracking-wider rounded-md transition-colors ${
                unitSystem === 'metric'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Metric (M / MM)
            </button>
          </div>

          {/* Mode-Specific Inputs (Every Input Displays Live Dual-Unit Imperial + Metric Badge) */}
          <div className="space-y-3.5 shrink-0">
            {surveyMode === 'leveling' &&
              (unitSystem === 'metric' ? (
                <div className="space-y-3">
                  <SurveyMetricDimInput
                    label="Known Benchmark (BM)"
                    badge="DATUM"
                    value={bmMInput}
                    onChange={setBmMInput}
                    unitTag="M"
                    step="0.005"
                    accentColor="amber"
                  />
                  <SurveyMetricDimInput
                    label="Backsight Reading (BS +)"
                    badge="PLUS +"
                    value={bsMInput}
                    onChange={setBsMInput}
                    unitTag="+M"
                    min="0"
                    step="0.005"
                    accentColor="emerald"
                  />
                  <SurveyMetricDimInput
                    label="Foresight Reading (FS -)"
                    badge="MINUS -"
                    value={fsMInput}
                    onChange={setFsMInput}
                    unitTag="-M"
                    min="0"
                    step="0.005"
                    accentColor="cyan"
                  />
                  <SurveyMetricDimInput
                    label="Target Elev (e.g. T.O.F.)"
                    value={targetMInput}
                    onChange={setTargetMInput}
                    unitTag="M"
                    step="0.005"
                    accentColor="purple"
                    disabled={!useTargetDesign}
                    rightToggle={
                      <button
                        type="button"
                        onClick={() => setUseTargetDesign((v) => !v)}
                        className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-extrabold border transition-colors ${
                          useTargetDesign
                            ? 'bg-purple-500/20 border-purple-400 text-purple-600 dark:text-purple-300'
                            : 'bg-slate-200 dark:bg-slate-800 border-slate-400 dark:border-slate-700 text-slate-500'
                        }`}
                      >
                        {useTargetDesign ? 'ACTIVE' : 'OFF'}
                      </button>
                    }
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  <SurveyImperialDimInput
                    label="Known Benchmark (BM)"
                    badge="DATUM"
                    feetVal={bmFt}
                    setFeetVal={setBmFt}
                    inVal={bmIn}
                    setInVal={setBmIn}
                    sixVal={bm16}
                    setSixVal={setBm16}
                    totalInches={calc?.bmInTotal}
                  />
                  <SurveyImperialDimInput
                    label="Backsight Reading (BS +)"
                    badge="PLUS +"
                    feetVal={bsFt}
                    setFeetVal={setBsFt}
                    inVal={bsIn}
                    setInVal={setBsIn}
                    sixVal={bs16}
                    setSixVal={setBs16}
                    totalInches={calc?.bsInTotal}
                  />
                  <SurveyImperialDimInput
                    label="Foresight Reading (FS -)"
                    badge="MINUS -"
                    feetVal={fsFt}
                    setFeetVal={setFsFt}
                    inVal={fsIn}
                    setInVal={setFsIn}
                    sixVal={fs16}
                    setSixVal={setFs16}
                    totalInches={calc?.fsInTotal}
                  />

                  <div className="pt-1 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                        Target Design Elevation (Optional — e.g., T.O.F.)
                      </span>
                      <button
                        type="button"
                        onClick={() => setUseTargetDesign((v) => !v)}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-extrabold border ${
                          useTargetDesign
                            ? 'bg-purple-500/20 border-purple-400 text-purple-600 dark:text-purple-300'
                            : 'bg-slate-200 dark:bg-slate-800 border-slate-400 dark:border-slate-700 text-slate-500'
                        }`}
                      >
                        {useTargetDesign ? 'ACTIVE' : 'OFF'}
                      </button>
                    </div>
                    {useTargetDesign && (
                      <SurveyImperialDimInput
                        label="Target Blueprint Elev"
                        badge="T.O.F."
                        feetVal={targetFt}
                        setFeetVal={setTargetFt}
                        inVal={targetIn}
                        setInVal={setTargetIn}
                        sixVal={target16}
                        setSixVal={setTarget16}
                        totalInches={calc?.targetInTotal}
                      />
                    )}
                  </div>
                </div>
              ))}

            {surveyMode === 'tp' &&
              (unitSystem === 'metric' ? (
                <div className="space-y-2.5">
                  <SurveyMetricDimInput
                    label="Starting Benchmark (BM)"
                    badge="START"
                    value={tpBmM}
                    onChange={setTpBmM}
                    unitTag="M"
                    step="0.005"
                    accentColor="amber"
                  />
                  <SurveyMetricDimInput
                    label="Setup #1: Backsight BS1 on BM"
                    badge="ON BM +"
                    value={tpBs1M}
                    onChange={setTpBs1M}
                    unitTag="+M"
                    min="0"
                    step="0.005"
                    accentColor="emerald"
                  />
                  <SurveyMetricDimInput
                    label="Setup #1: Foresight FS1 on TP1"
                    badge="ON TP1 -"
                    value={tpFs1M}
                    onChange={setTpFs1M}
                    unitTag="-M"
                    min="0"
                    step="0.005"
                    accentColor="cyan"
                  />
                  <SurveyMetricDimInput
                    label="Setup #2: Backsight BS2 on TP1"
                    badge="ON TP1 +"
                    value={tpBs2M}
                    onChange={setTpBs2M}
                    unitTag="+M"
                    min="0"
                    step="0.005"
                    accentColor="emerald"
                  />
                  <SurveyMetricDimInput
                    label="Setup #2: Final Foresight FS2"
                    badge="FINAL -"
                    value={tpFs2M}
                    onChange={setTpFs2M}
                    unitTag="-M"
                    min="0"
                    step="0.005"
                    accentColor="cyan"
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  <SurveyImperialDimInput
                    label="Benchmark (BM)"
                    badge="START"
                    feetVal={tpBmFt}
                    setFeetVal={setTpBmFt}
                    inVal={tpBmIn}
                    setInVal={setTpBmIn}
                    sixVal={tpBm16}
                    setSixVal={setTpBm16}
                  />
                  <SurveyImperialDimInput
                    label="Setup #1 Backsight (BS1)"
                    badge="ON BM +"
                    feetVal={tpBs1Ft}
                    setFeetVal={setTpBs1Ft}
                    inVal={tpBs1In}
                    setInVal={setTpBs1In}
                    sixVal={tpBs116}
                    setSixVal={setTpBs116}
                  />
                  <SurveyImperialDimInput
                    label="Setup #1 Foresight on TP1 (FS1)"
                    badge="ON TP1 -"
                    feetVal={tpFs1Ft}
                    setFeetVal={setTpFs1Ft}
                    inVal={tpFs1In}
                    setInVal={setTpFs1In}
                    sixVal={tpFs116}
                    setSixVal={setTpFs116}
                  />
                  <SurveyImperialDimInput
                    label="Setup #2 Backsight on TP1 (BS2)"
                    badge="ON TP1 +"
                    feetVal={tpBs2Ft}
                    setFeetVal={setTpBs2Ft}
                    inVal={tpBs2In}
                    setInVal={setTpBs2In}
                    sixVal={tpBs216}
                    setSixVal={setTpBs216}
                  />
                  <SurveyImperialDimInput
                    label="Setup #2 Final Foresight (FS2)"
                    badge="FINAL -"
                    feetVal={tpFs2Ft}
                    setFeetVal={setTpFs2Ft}
                    inVal={tpFs2In}
                    setInVal={setTpFs2In}
                    sixVal={tpFs216}
                    setSixVal={setTpFs216}
                  />
                </div>
              ))}

            {surveyMode === 'grade' && (
              <div className="space-y-3">
                {unitSystem === 'metric' ? (
                  <div className="space-y-3">
                    <SurveyMetricDimInput
                      label="Horizontal Distance (Run)"
                      badge="RUN"
                      value={gradeDistM}
                      onChange={setGradeDistM}
                      unitTag="M"
                      min="0"
                      step="0.1"
                      accentColor="amber"
                    />
                    <SurveyMetricDimInput
                      label="Starting Elevation"
                      badge="START"
                      value={gradeStartM}
                      onChange={setGradeStartM}
                      unitTag="M"
                      step="0.01"
                      accentColor="amber"
                    />
                  </div>
                ) : (
                  <>
                    <SurveyImperialDimInput
                      label="Horizontal Distance (Run)"
                      badge="RUN"
                      feetVal={gradeDistFt}
                      setFeetVal={setGradeDistFt}
                      inVal={gradeDistIn}
                      setInVal={setGradeDistIn}
                      sixVal={gradeDist16}
                      setSixVal={setGradeDist16}
                    />
                    <SurveyImperialDimInput
                      label="Starting Elevation"
                      badge="START"
                      feetVal={gradeStartFt}
                      setFeetVal={setGradeStartFt}
                      inVal={gradeStartIn}
                      setInVal={setGradeStartIn}
                      sixVal={gradeStart16}
                      setSixVal={setGradeStart16}
                    />
                  </>
                )}

                {/* Slope / Grade (%) Input + Quick Code Presets */}
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400 px-1">
                        SLOPE / GRADE (%)
                      </span>
                      <div className="flex bg-slate-200 dark:bg-slate-800 rounded p-0.5">
                        <button
                          type="button"
                          onClick={() => setGradeDirection('fall')}
                          className={`px-2 py-0.5 rounded text-[9px] font-mono font-extrabold transition-colors ${
                            gradeDirection === 'fall' ? 'bg-amber-600 text-white' : 'text-slate-500'
                          }`}
                        >
                          FALL (-)
                        </button>
                        <button
                          type="button"
                          onClick={() => setGradeDirection('rise')}
                          className={`px-2 py-0.5 rounded text-[9px] font-mono font-extrabold transition-colors ${
                            gradeDirection === 'rise' ? 'bg-emerald-600 text-white' : 'text-slate-500'
                          }`}
                        >
                          RISE (+)
                        </button>
                      </div>
                    </div>
                    {parseFloat(gradePctInput) > 0 && (
                      <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-300 ml-auto">
                        = 1:{(100 / parseFloat(gradePctInput)).toFixed((100 / parseFloat(gradePctInput)) % 1 === 0 ? 0 : 1)} •{' '}
                        {formatSurveyInches16((parseFloat(gradePctInput) / 100) * 12)}/ft • {(parseFloat(gradePctInput) * 10).toFixed(1)} mm/m
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {[
                      { label: '1.5% Swale', val: '1.5' },
                      { label: '2.0% (1:50 • 1/4"/ft)', val: '2.0' },
                      { label: '5.0% NBC 2m', val: '5.0' },
                      { label: '8.33% (1:12 Ramp)', val: '8.33' }
                    ].map((preset) => {
                      const active = parseFloat(gradePctInput) === parseFloat(preset.val)
                      return (
                        <button
                          key={preset.val}
                          type="button"
                          onClick={() => setGradePctInput(preset.val)}
                          className={`py-1.5 px-1.5 rounded-lg text-[10px] font-mono font-extrabold border transition-colors ${
                            active
                              ? 'bg-amber-500/20 border-amber-400 text-amber-700 dark:text-amber-300'
                              : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {preset.label}
                        </button>
                      )
                    })}
                  </div>

                  <div className="relative">
                    <input
                      type="number"
                      min="0.05"
                      step="0.1"
                      value={gradePctInput}
                      onChange={(e) => setGradePctInput(e.target.value)}
                      className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl pl-3 pr-10 py-2 text-base font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono font-extrabold text-slate-400 pointer-events-none">
                      %
                    </span>
                  </div>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handleCalculate}
              className="w-full bg-yellow-600 hover:bg-yellow-500 text-white font-bold uppercase tracking-wider py-3 rounded-xl transition-all shadow-md active:scale-[0.98]"
            >
              {surveyMode === 'leveling'
                ? 'Calculate HI, Target Rod & Cut/Fill'
                : surveyMode === 'tp'
                ? 'Calculate Turning Point Loop'
                : 'Calculate % Grade & Total Fall'}
            </button>
          </div>

          {/* Quick Jump Pill to 1:1 CAD & Step-by-Step Math Walkthrough */}
          <button
            type="button"
            onClick={() => cadSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            className="w-full shrink-0 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/35 text-amber-700 dark:text-amber-300 text-[11px] sm:text-xs font-mono font-extrabold tracking-wide transition-colors"
          >
            <span>📐 Jump to 1:1 CAD &amp; Step-by-Step Math Walkthrough ↓</span>
          </button>

          {/* 1. CALCULATION RESULTS (Dual Imperial + Metric, Zero ⓘ Icon Collision) */}
          <div
            className={`shrink-0 bg-slate-100 dark:bg-slate-800/50 border rounded-xl p-4 md:p-5 transition-colors ${
              calcPulse ? 'border-amber-400' : 'border-slate-300 dark:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-3.5 border-b border-slate-200 dark:border-slate-700 pb-2">
              <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                Calculation Results
              </h4>
              <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                IMPERIAL + METRIC
              </span>
            </div>

            {calc ? (
              <div className="space-y-2.5 text-xs sm:text-sm">
                {calc.rows.map((row, idx, arr) => (
                  <div
                    key={row.id}
                    className={`flex flex-col ${
                      idx < arr.length - 1 ? 'border-b border-slate-200/60 dark:border-slate-700/60 pb-2.5' : 'pt-0.5'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="font-sans font-semibold text-slate-700 dark:text-slate-200 leading-snug">
                          {row.label}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleInfo(row.id)}
                          aria-label={`Info about ${row.label}`}
                          className={`inline-flex items-center justify-center w-5 h-5 rounded-full shrink-0 transition-colors ${
                            activeTooltip === row.id
                              ? 'bg-amber-500/20 text-amber-400'
                              : 'text-slate-400 hover:text-amber-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                          }`}
                        >
                          <Info size={13} />
                        </button>
                      </div>

                      <div className={`ml-auto text-right font-mono font-bold ${row.valueClass}`}>
                        {row.value}
                      </div>
                    </div>

                    {activeTooltip === row.id && (
                      <div className="text-xs text-amber-100 bg-slate-900 border border-amber-500/30 px-3 py-2 rounded-lg mt-2 leading-relaxed">
                        {row.tip}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs font-mono text-slate-400">Enter valid benchmark, rod, or grade inputs above to compute elevations.</p>
            )}
          </div>

          {/* 2. LIVE 1:1 CAD SURVEYING SIGHTLINE / GRADE DIAGRAM (viewBox="0 0 360 175") */}
          <div ref={cadSectionRef} className="space-y-4 shrink-0 scroll-mt-2">
            {calc && (
              <div className="bg-[#0a192f] border border-slate-700/90 rounded-xl overflow-hidden shadow-lg shrink-0">
                <div className="px-3 py-1.5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-amber-400">
                    {calc.surveyMode === 'leveling'
                      ? 'LIVE 1:1 CAD TRANSIT SIGHTLINE & CUT/FILL PROFILE'
                      : calc.surveyMode === 'tp'
                      ? 'LIVE 1:1 CAD 2-SETUP TURNING POINT (TP1) LOOP'
                      : 'LIVE 1:1 CAD % GRADE & DRAINAGE SLOPE PROFILE'}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-slate-400 shrink-0 whitespace-nowrap">
                    {calc.surveyMode === 'grade' ? 'FALL = RUN × %' : 'HI = BM + BS'}
                  </span>
                </div>

                <svg viewBox="0 0 360 175" className="w-full h-auto min-h-[175px] block shrink-0">
                  <defs>
                    <pattern id="surveyCadGrid" width="18" height="18" patternUnits="userSpaceOnUse">
                      <path d="M 18 0 L 0 0 0 18" fill="none" stroke="#172a46" strokeWidth="0.65" />
                    </pattern>
                  </defs>
                  <rect x="0" y="0" width="360" height="175" fill="#0a192f" />
                  <rect x="0" y="0" width="360" height="175" fill="url(#surveyCadGrid)" />

                  {calc.surveyMode === 'leveling' && (
                    <>
                      {/* Stepped Ground & Excavation Trench Profile */}
                      <path
                        d="M 12,106 L 198,106 L 216,124 L 348,124 L 348,144 L 12,144 Z"
                        fill="#1e293b"
                        stroke="#64748b"
                        strokeWidth="1.4"
                      />

                      {/* Optional Target Design Grade (T.O.F.) Dashed Reference Line in Trench */}
                      {calc.hasTarget && (
                        <>
                          <line
                            x1="216"
                            y1={calc.actionType === 'fill' ? 114 : calc.actionType === 'exact' ? 124 : 136}
                            x2="344"
                            y2={calc.actionType === 'fill' ? 114 : calc.actionType === 'exact' ? 124 : 136}
                            stroke={calc.actionType === 'fill' ? '#34d399' : '#fbbf24'}
                            strokeWidth="1.4"
                            strokeDasharray="3.5 2.5"
                          />
                          {calc.actionType === 'cut' && (
                            <rect x="220" y="124" width="118" height="12" fill="#f59e0b" opacity="0.16" />
                          )}
                          {calc.actionType === 'fill' && (
                            <rect x="220" y="114" width="118" height="10" fill="#10b981" opacity="0.18" />
                          )}
                        </>
                      )}

                      {/* Left Concrete Benchmark Monument & Brass Datum Cap (x=48) */}
                      <polygon points="38,106 58,106 55,98 41,98" fill="#475569" stroke="#fbbf24" strokeWidth="1.3" />
                      <circle cx="48" cy="97" r="2.2" fill="#fbbf24" />
                      <line x1="48" y1="106" x2="48" y2="151" stroke="#fbbf24" strokeWidth="1.1" strokeDasharray="2 2" />

                      {/* Left Vertical Backsight Rod (x=48, y=54..97) */}
                      <rect x="45.5" y="54" width="5" height="43" fill="#f8fafc" stroke="#34d399" strokeWidth="1.2" />
                      <line x1="45.5" y1="64" x2="50.5" y2="64" stroke="#ef4444" strokeWidth="1.2" />
                      <line x1="45.5" y1="74" x2="50.5" y2="74" stroke="#0f172a" strokeWidth="1.2" />
                      <line x1="45.5" y1="84" x2="50.5" y2="84" stroke="#ef4444" strokeWidth="1.2" />
                      {/* +BS Upward Arrow */}
                      <line x1="60" y1="96" x2="60" y2="57" stroke="#34d399" strokeWidth="1.6" />
                      <polygon points="60,55 57.3,60.5 62.7,60.5" fill="#34d399" />
                      <line x1="60" y1="54" x2="60" y2="43" stroke="#34d399" strokeWidth="1.1" strokeDasharray="2 2" />

                      {/* Center Optical Transit / Laser Level on Tripod (x=166, Sightline y=54) */}
                      <line x1="166" y1="60" x2="148" y2="106" stroke="#fbbf24" strokeWidth="1.8" />
                      <line x1="166" y1="60" x2="184" y2="106" stroke="#fbbf24" strokeWidth="1.8" />
                      <line x1="166" y1="60" x2="166" y2="106" stroke="#d97706" strokeWidth="1.5" />
                      <rect x="157" y="50" width="18" height="8" rx="2" fill="#f59e0b" stroke="#fef08a" strokeWidth="1.2" />

                      {/* Horizontal Red Dashed Optical Line of Sight (HI at y=54) */}
                      <line x1="34" y1="54" x2="326" y2="54" stroke="#f87171" strokeWidth="1.8" strokeDasharray="4 2.5" />
                      <line x1="132" y1="54" x2="132" y2="21" stroke="#f87171" strokeWidth="1.2" strokeDasharray="2 2" />

                      {/* Right Vertical Foresight Rod in Trench (x=284, y=54..124) */}
                      <rect x="281.5" y="54" width="5" height="70" fill="#f8fafc" stroke="#38bdf8" strokeWidth="1.2" />
                      <line x1="281.5" y1="68" x2="286.5" y2="68" stroke="#ef4444" strokeWidth="1.2" />
                      <line x1="281.5" y1="82" x2="286.5" y2="82" stroke="#0f172a" strokeWidth="1.2" />
                      <line x1="281.5" y1="96" x2="286.5" y2="96" stroke="#ef4444" strokeWidth="1.2" />
                      <line x1="281.5" y1="110" x2="286.5" y2="110" stroke="#0f172a" strokeWidth="1.2" />
                      {/* -FS Downward Arrow */}
                      <line x1="296" y1="56" x2="296" y2="121" stroke="#38bdf8" strokeWidth="1.6" />
                      <polygon points="296,123 293.3,117.5 298.7,117.5" fill="#38bdf8" />
                      <line x1="296" y1="54" x2="296" y2="43" stroke="#38bdf8" strokeWidth="1.1" strokeDasharray="2 2" />
                      <line x1="258" y1="54" x2="258" y2="21" stroke="#c084fc" strokeWidth="1.1" strokeDasharray="2 2" />
                      <line x1="284" y1="124" x2="284" y2="151" stroke="#fbbf24" strokeWidth="1.1" strokeDasharray="2 2" />

                      {/* Opaque fill="#0a192f" Dynamic Dual-Unit Callout Pills Drawn AFTER All Lines */}
                      <StairSvgPill
                        x={8}
                        y={13}
                        align="start"
                        maxWidth={172}
                        text={`HI: ${calc.svgHi}`}
                        fontSize={6.7}
                        color="#fca5a5"
                        borderColor="#ef4444"
                      />
                      <StairSvgPill
                        x={352}
                        y={13}
                        align="end"
                        maxWidth={168}
                        text={`ROD: ${calc.svgTargetRod}`}
                        fontSize={6.7}
                        color="#e9d5ff"
                        borderColor="#9333ea"
                      />
                      <StairSvgPill
                        x={8}
                        y={35}
                        align="start"
                        maxWidth={148}
                        text={`BS: +${calc.svgBs}`}
                        fontSize={6.7}
                        color="#6ee7b7"
                        borderColor="#059669"
                      />
                      <StairSvgPill
                        x={352}
                        y={35}
                        align="end"
                        maxWidth={148}
                        text={`FS: -${calc.svgFs}`}
                        fontSize={6.7}
                        color="#7dd3fc"
                        borderColor="#0284c7"
                      />
                      <StairSvgPill
                        x={8}
                        y={159}
                        align="start"
                        maxWidth={144}
                        text={`BM: ${calc.svgBm}`}
                        fontSize={6.7}
                        color="#fde68a"
                        borderColor="#d97706"
                      />
                      <StairSvgPill
                        x={352}
                        y={159}
                        align="end"
                        maxWidth={196}
                        text={calc.svgCutFillBadge}
                        fontSize={6.7}
                        color={calc.actionType === 'fill' ? '#6ee7b7' : '#fde68a'}
                        borderColor={calc.actionType === 'fill' ? '#059669' : '#d97706'}
                      />
                    </>
                  )}

                  {calc.surveyMode === 'tp' && (
                    <>
                      {/* Stepped 2-Bench Downhill Terrain */}
                      <path
                        d="M 12,96 L 128,96 L 150,112 L 266,112 L 286,130 L 348,130 L 348,145 L 12,145 Z"
                        fill="#1e293b"
                        stroke="#64748b"
                        strokeWidth="1.4"
                      />

                      {/* Setup #1 Sightline (y=52) & Tripod (x=96) */}
                      <line x1="28" y1="52" x2="184" y2="52" stroke="#f87171" strokeWidth="1.6" strokeDasharray="4 2" />
                      <line x1="96" y1="56" x2="84" y2="96" stroke="#fbbf24" strokeWidth="1.6" />
                      <line x1="96" y1="56" x2="108" y2="96" stroke="#fbbf24" strokeWidth="1.6" />
                      <rect x="89" y="48" width="14" height="7" rx="1.5" fill="#f59e0b" stroke="#fef08a" strokeWidth="1" />

                      {/* BM Rod at x=36 */}
                      <rect x="34" y="52" width="4" height="44" fill="#f8fafc" stroke="#34d399" strokeWidth="1.1" />
                      <circle cx="36" cy="96" r="2.5" fill="#fbbf24" />

                      {/* TP1 Steel Turning Pin & Dual-Sight Rod at x=174 */}
                      <rect x="172" y="52" width="4" height="60" fill="#f8fafc" stroke="#22d3ee" strokeWidth="1.1" />
                      <polygon points="169,112 179,112 174,119" fill="#38bdf8" />
                      <line x1="174" y1="52" x2="174" y2="42" stroke="#22d3ee" strokeWidth="1.1" strokeDasharray="2 2" />

                      {/* Setup #2 Sightline (y=70) & Tripod (x=242) */}
                      <line x1="164" y1="70" x2="332" y2="70" stroke="#fb923c" strokeWidth="1.6" strokeDasharray="4 2" />
                      <line x1="242" y1="74" x2="230" y2="112" stroke="#fbbf24" strokeWidth="1.6" />
                      <line x1="242" y1="74" x2="254" y2="112" stroke="#fbbf24" strokeWidth="1.6" />
                      <rect x="235" y="66" width="14" height="7" rx="1.5" fill="#ea580c" stroke="#fed7aa" strokeWidth="1" />

                      {/* Final Point Rod at x=316 */}
                      <rect x="314" y="70" width="4" height="60" fill="#f8fafc" stroke="#34d399" strokeWidth="1.1" />

                      {/* Opaque Dual-Unit Callout Pills */}
                      <StairSvgPill
                        x={8}
                        y={13}
                        align="start"
                        maxWidth={168}
                        text={`HI #1: ${calc.svgHi1}`}
                        fontSize={6.7}
                        color="#fca5a5"
                        borderColor="#ef4444"
                      />
                      <StairSvgPill
                        x={352}
                        y={13}
                        align="end"
                        maxWidth={168}
                        text={`HI #2: ${calc.svgHi2}`}
                        fontSize={6.7}
                        color="#fdba74"
                        borderColor="#ea580c"
                      />
                      <StairSvgPill
                        x={180}
                        y={35}
                        align="middle"
                        maxWidth={206}
                        text={`TP1 ELEV: ${calc.svgTp1}`}
                        fontSize={6.7}
                        color="#67e8f9"
                        borderColor="#0891b2"
                      />
                      <StairSvgPill
                        x={8}
                        y={159}
                        align="start"
                        maxWidth={138}
                        text={`BM: ${calc.svgBm}`}
                        fontSize={6.7}
                        color="#fde68a"
                        borderColor="#d97706"
                      />
                      <StairSvgPill
                        x={352}
                        y={159}
                        align="end"
                        maxWidth={202}
                        text={`FINAL: ${calc.svgFinal} (Δ ${calc.svgDelta})`}
                        fontSize={6.5}
                        color="#6ee7b7"
                        borderColor="#059669"
                      />
                    </>
                  )}

                  {calc.surveyMode === 'grade' && (
                    <>
                      {/* Sloped Swale / Pipe Profile (x=28..202 so right-side Dual-Unit FALL Pill has clear air!) */}
                      {calc.isRise ? (
                        <>
                          <polygon points="28,114 202,62 202,128 28,128" fill="#1e293b" stroke="#475569" strokeWidth="1.2" />
                          <line x1="28" y1="114" x2="212" y2="114" stroke="#64748b" strokeWidth="1.2" strokeDasharray="3 2.5" />
                          <line x1="28" y1="114" x2="202" y2="62" stroke="#34d399" strokeWidth="3" />
                          <circle cx="28" cy="114" r="2.8" fill="#fbbf24" />
                          <circle cx="202" cy="62" r="2.8" fill="#34d399" />
                          {/* Vertical Rise Arrow at x=212 */}
                          <line x1="212" y1="62" x2="212" y2="114" stroke="#34d399" strokeWidth="1.8" />
                          <polygon points="212,62 209.3,67.5 214.7,67.5" fill="#34d399" />
                          <polygon points="212,114 209.3,108.5 214.7,108.5" fill="#34d399" />
                        </>
                      ) : (
                        <>
                          <polygon points="28,62 202,114 202,128 28,128" fill="#1e293b" stroke="#475569" strokeWidth="1.2" />
                          <line x1="28" y1="62" x2="212" y2="62" stroke="#64748b" strokeWidth="1.2" strokeDasharray="3 2.5" />
                          <line x1="28" y1="62" x2="202" y2="114" stroke="#38bdf8" strokeWidth="3" />
                          <circle cx="28" cy="62" r="2.8" fill="#fbbf24" />
                          <circle cx="202" cy="114" r="2.8" fill="#38bdf8" />
                          {/* Drainage Flow Arrow Along Slope */}
                          <line x1="92" y1="73" x2="146" y2="89" stroke="#fde047" strokeWidth="1.5" />
                          <polygon points="148,89.6 141.5,85.2 140.2,90.4" fill="#fde047" />
                          {/* Vertical Fall Arrow at x=212 */}
                          <line x1="212" y1="62" x2="212" y2="114" stroke="#fbbf24" strokeWidth="1.8" />
                          <polygon points="212,62 209.3,67.5 214.7,67.5" fill="#fbbf24" />
                          <polygon points="212,114 209.3,108.5 214.7,108.5" fill="#fbbf24" />
                        </>
                      )}

                      {/* Bottom Horizontal Run Arrow (x=28..202, y=138) */}
                      <line x1="28" y1="138" x2="202" y2="138" stroke="#38bdf8" strokeWidth="1.8" />
                      <polygon points="28,138 34,135.3 34,140.7" fill="#38bdf8" />
                      <polygon points="202,138 196,135.3 196,140.7" fill="#38bdf8" />
                      <line x1="88" y1="138" x2="88" y2="151" stroke="#38bdf8" strokeWidth="1.1" strokeDasharray="2 2" />

                      {/* Opaque Dual-Unit Callout Pills */}
                      <StairSvgPill
                        x={8}
                        y={13}
                        align="start"
                        maxWidth={162}
                        text={`START: ${calc.svgStartElev}`}
                        fontSize={6.7}
                        color="#fde68a"
                        borderColor="#d97706"
                      />
                      <StairSvgPill
                        x={352}
                        y={13}
                        align="end"
                        maxWidth={178}
                        text={`GRADE: ${calc.svgGradeBadge}`}
                        fontSize={6.7}
                        color="#67e8f9"
                        borderColor="#0284c7"
                      />
                      <StairSvgPill
                        x={352}
                        y={88}
                        align="end"
                        maxWidth={134}
                        text={`${calc.isRise ? 'RISE' : 'FALL'}: ${calc.svgFall}`}
                        fontSize={6.7}
                        color={calc.isRise ? '#6ee7b7' : '#fde68a'}
                        borderColor={calc.isRise ? '#059669' : '#d97706'}
                      />
                      <StairSvgPill
                        x={8}
                        y={159}
                        align="start"
                        maxWidth={168}
                        text={`RUN: ${calc.svgRun}`}
                        fontSize={6.7}
                        color="#7dd3fc"
                        borderColor="#0284c7"
                      />
                      <StairSvgPill
                        x={352}
                        y={159}
                        align="end"
                        maxWidth={172}
                        text={`END: ${calc.svgEndElev}`}
                        fontSize={6.7}
                        color="#6ee7b7"
                        borderColor="#059669"
                      />
                    </>
                  )}
                </svg>
              </div>
            )}

            {/* 3. ALWAYS-VISIBLE "HOW TO DO THE MATH (RED SEAL STEP-BY-STEP TEACHER)" — DYNAMIC PER ACTIVE TAB + DUAL IMPERIAL & METRIC */}
            <div className="bg-slate-950 border border-amber-500/35 rounded-xl overflow-hidden shadow-lg shrink-0">
              <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400 shrink-0">
                  <BookOpen size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider leading-tight">
                    HOW TO DO THE MATH (RED SEAL STEP-BY-STEP TEACHER)
                  </h4>
                  <p className="text-[10px] font-mono font-bold text-amber-300/90 uppercase tracking-widest mt-0.5">
                    {surveyMode === 'leveling'
                      ? '5-STEP DIFFERENTIAL LEVELING & CUT/FILL (IMPERIAL + METRIC)'
                      : surveyMode === 'tp'
                      ? '5-STEP TURNING POINT (TP1) 2-SETUP LOOP (IMPERIAL + METRIC)'
                      : '5-STEP % GRADE, SLOPE RATIO & DRAINAGE FALL (IMPERIAL + METRIC)'}
                  </p>
                </div>
              </div>

              <div className="p-3.5 sm:p-4 space-y-3 text-xs text-slate-300 leading-relaxed">
                {calc && calc.surveyMode === 'leveling' && (
                  <>
                    {/* LEVELING STEP 1 */}
                    <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 space-y-1.5 shrink-0">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 font-mono font-extrabold text-[11px] shrink-0">
                          1
                        </span>
                        <span className="font-bold text-white uppercase tracking-wide text-[11px] sm:text-xs">
                          Step 1 — Establish Height of Instrument (HI = BM + BS)
                        </span>
                      </div>
                      <div className="text-[11px] text-emerald-200/95 bg-emerald-500/10 border border-emerald-500/30 rounded px-2.5 py-1.5">
                        <strong className="text-emerald-300">Plus Sight Rule:</strong> Backsight (BS) is ALWAYS added (+) because the rod stands on a known Benchmark and you measure UP to the laser/transit plane.
                      </div>
                      <div className="font-mono text-slate-200 bg-slate-950/80 border border-slate-800/80 rounded px-2.5 py-1.5 space-y-1 text-[11px]">
                        <div>
                          <span className="text-slate-400">Imperial:</span> {formatSurveyFeetInches(calc.bmInTotal)} + {formatSurveyFeetInches(calc.bsInTotal)} ={' '}
                          <span className="font-bold text-amber-300">HI = {formatSurveyFeetInches(calc.hiInTotal)} ({calc.hiInTotal.toFixed(1)}&quot;)</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Metric:</span> {calc.bmM.toFixed(3)} m + {calc.bsM.toFixed(3)} m ={' '}
                          <span className="font-bold text-amber-300">HI = {calc.hiM.toFixed(3)} m ({Math.round(calc.hiM * 1000)} mm)</span>
                        </div>
                      </div>
                    </div>

                    {/* LEVELING STEP 2 */}
                    <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 space-y-1.5 shrink-0">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 font-mono font-extrabold text-[11px] shrink-0">
                          2
                        </span>
                        <span className="font-bold text-white uppercase tracking-wide text-[11px] sm:text-xs">
                          Step 2 — Find Unknown Point Elevation (Elev = HI - FS)
                        </span>
                      </div>
                      <div className="text-[11px] text-cyan-200/95 bg-cyan-500/10 border border-cyan-500/30 rounded px-2.5 py-1.5">
                        <strong className="text-cyan-300">Minus Sight Rule:</strong> Foresight (FS) is ALWAYS subtracted (-) from HI. Remember: <strong>Bigger Foresight = Deeper Hole (Lower Elevation)!</strong>
                      </div>
                      <div className="font-mono text-slate-200 bg-slate-950/80 border border-slate-800/80 rounded px-2.5 py-1.5 space-y-1 text-[11px]">
                        <div>
                          <span className="text-slate-400">Imperial:</span> {formatSurveyFeetInches(calc.hiInTotal)} - {formatSurveyFeetInches(calc.fsInTotal)} ={' '}
                          <span className="font-bold text-cyan-300">{formatSurveyFeetInches(calc.actualInTotal)} ({calc.actualInTotal.toFixed(1)}&quot;)</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Metric:</span> {calc.hiM.toFixed(3)} m - {calc.fsM.toFixed(3)} m ={' '}
                          <span className="font-bold text-cyan-300">{calc.actualM.toFixed(3)} m ({Math.round(calc.actualM * 1000)} mm)</span>
                        </div>
                      </div>
                    </div>

                    {/* LEVELING STEP 3 */}
                    <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 space-y-1.5 shrink-0">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 font-mono font-extrabold text-[11px] shrink-0">
                          3
                        </span>
                        <span className="font-bold text-white uppercase tracking-wide text-[11px] sm:text-xs">
                          Step 3 — Target Rod Reading for Blueprint Elevation (HI - Target)
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Subtract the blueprint Top-of-Footing (T.O.F.) elevation from HI to know the exact grade rod reading where the laser receiver must beep level.
                      </div>
                      {calc.hasTarget ? (
                        <div className="font-mono text-slate-200 bg-slate-950/80 border border-slate-800/80 rounded px-2.5 py-1.5 space-y-1 text-[11px]">
                          <div>
                            <span className="text-slate-400">Imperial:</span> {formatSurveyFeetInches(calc.hiInTotal)} - {formatSurveyFeetInches(calc.targetInTotal)} ={' '}
                            <span className="font-bold text-purple-300">Target Rod = {formatSurveyFeetInches(calc.targetRodIn)}</span>
                          </div>
                          <div>
                            <span className="text-slate-400">Metric:</span> {calc.hiM.toFixed(3)} m - {calc.targetM.toFixed(3)} m ={' '}
                            <span className="font-bold text-purple-300">Target Rod = {calc.targetRodM.toFixed(3)} m ({Math.round(calc.targetRodM * 1000)} mm)</span>
                          </div>
                        </div>
                      ) : (
                        <div className="font-mono text-slate-400 bg-slate-950/80 border border-slate-800/80 rounded px-2.5 py-1.5 text-[11px]">
                          Enable Target Design Elevation above to see the live Imperial + Metric Target Rod math.
                        </div>
                      )}
                    </div>

                    {/* LEVELING STEP 4 */}
                    <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 space-y-1.5 shrink-0">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 font-mono font-extrabold text-[11px] shrink-0">
                          4
                        </span>
                        <span className="font-bold text-white uppercase tracking-wide text-[11px] sm:text-xs">
                          Step 4 — Determine Excavation CUT vs. FILL
                        </span>
                      </div>
                      <div className="text-[11px] bg-amber-500/10 border border-amber-500/30 rounded px-2.5 py-1.5 space-y-1 text-amber-100">
                        <div>• <strong>Actual FS &lt; Target Rod</strong> (Ground higher than design) ➔ <strong className="text-amber-300">CUT (Dig Down)</strong></div>
                        <div>• <strong>Actual FS &gt; Target Rod</strong> (Hole deeper than design) ➔ <strong className="text-emerald-300">FILL (Build Up)</strong></div>
                      </div>
                      <div className="font-mono text-slate-200 bg-slate-950/80 border border-slate-800/80 rounded px-2.5 py-1.5 text-[11px]">
                        Action: <span className="font-bold text-amber-300">{calc.actionDisplay}</span>
                      </div>
                    </div>

                    {/* LEVELING STEP 5 */}
                    <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 space-y-1.5 shrink-0">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 font-mono font-extrabold text-[11px] shrink-0">
                          5
                        </span>
                        <span className="font-bold text-white uppercase tracking-wide text-[11px] sm:text-xs">
                          Step 5 — Differential Check &amp; Imperial ↔ Metric Factors
                        </span>
                      </div>
                      <div className="font-mono text-slate-200 bg-slate-950/80 border border-slate-800/80 rounded px-2.5 py-2 space-y-1 text-[11px]">
                        <div>
                          • <span className="text-cyan-300">BM Diff Check (BS - FS):</span> {formatSurveyFeetInches(calc.diffBmIn, calc.diffBmIn > 0)} ={' '}
                          {calc.diffBmM >= 0 ? '+' : ''}{calc.diffBmM.toFixed(3)} m ({Math.round(calc.diffBmM * 1000)} mm)
                        </div>
                        <div className="text-slate-400">
                          • Red Seal Constants: 1 ft = 0.3048 m • 1 m = 3.28084 ft (39.37&quot;) • 1 in = 25.4 mm
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {calc && calc.surveyMode === 'tp' && (
                  <>
                    {/* TP STEP 1 */}
                    <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 space-y-1.5 shrink-0">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 font-mono font-extrabold text-[11px] shrink-0">
                          1
                        </span>
                        <span className="font-bold text-white uppercase tracking-wide text-[11px] sm:text-xs">
                          Step 1 — Setup #1 Height of Instrument (HI #1 = BM + BS1)
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Set up the transit halfway toward your destination and take Backsight #1 (BS1) on the starting Benchmark.
                      </div>
                      <div className="font-mono text-slate-200 bg-slate-950/80 border border-slate-800/80 rounded px-2.5 py-1.5 space-y-1 text-[11px]">
                        <div>
                          <span className="text-slate-400">Imperial:</span> {formatSurveyFeetInches(calc.bmInV)} + {formatSurveyFeetInches(calc.bs1InV)} ={' '}
                          <span className="font-bold text-amber-300">HI #1 = {formatSurveyFeetInches(calc.hi1InV)}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Metric:</span> {calc.bmM.toFixed(3)} m + {calc.bs1M.toFixed(3)} m ={' '}
                          <span className="font-bold text-amber-300">HI #1 = {calc.hi1M.toFixed(3)} m</span>
                        </div>
                      </div>
                    </div>

                    {/* TP STEP 2 */}
                    <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 space-y-1.5 shrink-0">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 font-mono font-extrabold text-[11px] shrink-0">
                          2
                        </span>
                        <span className="font-bold text-white uppercase tracking-wide text-[11px] sm:text-xs">
                          Step 2 — Establish Turning Point TP1 Elevation (TP1 = HI #1 - FS1)
                        </span>
                      </div>
                      <div className="text-[11px] text-cyan-200/95 bg-cyan-500/10 border border-cyan-500/30 rounded px-2.5 py-1.5">
                        <strong className="text-cyan-300">Field Rule:</strong> Hold the rod on a solid steel pin, stake, or concrete edge (TP1) before moving the tripod so the elevation cannot shift!
                      </div>
                      <div className="font-mono text-slate-200 bg-slate-950/80 border border-slate-800/80 rounded px-2.5 py-1.5 space-y-1 text-[11px]">
                        <div>
                          <span className="text-slate-400">Imperial:</span> {formatSurveyFeetInches(calc.hi1InV)} - {formatSurveyFeetInches(calc.fs1InV)} ={' '}
                          <span className="font-bold text-cyan-300">TP1 = {formatSurveyFeetInches(calc.tp1InV)}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Metric:</span> {calc.hi1M.toFixed(3)} m - {calc.fs1M.toFixed(3)} m ={' '}
                          <span className="font-bold text-cyan-300">TP1 = {calc.tp1M.toFixed(3)} m</span>
                        </div>
                      </div>
                    </div>

                    {/* TP STEP 3 */}
                    <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 space-y-1.5 shrink-0">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 font-mono font-extrabold text-[11px] shrink-0">
                          3
                        </span>
                        <span className="font-bold text-white uppercase tracking-wide text-[11px] sm:text-xs">
                          Step 3 — Move Instrument &amp; Establish Setup #2 HI (HI #2 = TP1 + BS2)
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Keep the rod stationary on TP1 while moving and re-leveling the tripod, then shoot Backsight #2 (BS2) back onto TP1.
                      </div>
                      <div className="font-mono text-slate-200 bg-slate-950/80 border border-slate-800/80 rounded px-2.5 py-1.5 space-y-1 text-[11px]">
                        <div>
                          <span className="text-slate-400">Imperial:</span> {formatSurveyFeetInches(calc.tp1InV)} + {formatSurveyFeetInches(calc.bs2InV)} ={' '}
                          <span className="font-bold text-amber-300">HI #2 = {formatSurveyFeetInches(calc.hi2InV)}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Metric:</span> {calc.tp1M.toFixed(3)} m + {calc.bs2M.toFixed(3)} m ={' '}
                          <span className="font-bold text-amber-300">HI #2 = {calc.hi2M.toFixed(3)} m</span>
                        </div>
                      </div>
                    </div>

                    {/* TP STEP 4 */}
                    <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 space-y-1.5 shrink-0">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 font-mono font-extrabold text-[11px] shrink-0">
                          4
                        </span>
                        <span className="font-bold text-white uppercase tracking-wide text-[11px] sm:text-xs">
                          Step 4 — Shoot Final Foresight (Final Elev = HI #2 - FS2)
                        </span>
                      </div>
                      <div className="font-mono text-slate-200 bg-slate-950/80 border border-slate-800/80 rounded px-2.5 py-1.5 space-y-1 text-[11px]">
                        <div>
                          <span className="text-slate-400">Imperial:</span> {formatSurveyFeetInches(calc.hi2InV)} - {formatSurveyFeetInches(calc.fs2InV)} ={' '}
                          <span className="font-bold text-emerald-300">{formatSurveyFeetInches(calc.finalInV)} ({calc.finalInV.toFixed(1)}&quot;)</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Metric:</span> {calc.hi2M.toFixed(3)} m - {calc.fs2M.toFixed(3)} m ={' '}
                          <span className="font-bold text-emerald-300">{calc.finalM.toFixed(3)} m ({Math.round(calc.finalM * 1000)} mm)</span>
                        </div>
                      </div>
                    </div>

                    {/* TP STEP 5 */}
                    <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 space-y-1.5 shrink-0">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 font-mono font-extrabold text-[11px] shrink-0">
                          5
                        </span>
                        <span className="font-bold text-white uppercase tracking-wide text-[11px] sm:text-xs">
                          Step 5 — Red Seal Note-Reduction Loop Check (BM + ΣBS - ΣFS)
                        </span>
                      </div>
                      <div className="font-mono text-slate-200 bg-slate-950/80 border border-slate-800/80 rounded px-2.5 py-2 space-y-1 text-[11px]">
                        <div>
                          • <span className="text-emerald-300">ΣBS:</span> +{formatSurveyFeetInches(calc.sumBsInV)} (+{calc.sumBsM.toFixed(3)} m) •{' '}
                          <span className="text-cyan-300">ΣFS:</span> -{formatSurveyFeetInches(calc.sumFsInV)} (-{calc.sumFsM.toFixed(3)} m)
                        </div>
                        <div>
                          • <span className="text-purple-300">Check:</span> Δ = {formatSurveyFeetInches(calc.netDeltaInV, true)} ({calc.netDeltaM >= 0 ? '+' : ''}{calc.netDeltaM.toFixed(3)} m) ➔{' '}
                          <span className="font-bold text-white">{formatSurveyFeetInches(calc.finalInV)} • {calc.finalM.toFixed(3)} m ✓</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {calc && calc.surveyMode === 'grade' && (
                  <>
                    {/* GRADE STEP 1 */}
                    <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 space-y-1.5 shrink-0">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 font-mono font-extrabold text-[11px] shrink-0">
                          1
                        </span>
                        <span className="font-bold text-white uppercase tracking-wide text-[11px] sm:text-xs">
                          Step 1 — Convert % Grade to Decimal Slope &amp; Ratio (1 : X)
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Percentage grade means units of vertical rise/fall per <strong>100 units</strong> of horizontal run. Divide by 100 to get the decimal multiplier.
                      </div>
                      <div className="font-mono text-slate-200 bg-slate-950/80 border border-slate-800/80 rounded px-2.5 py-1.5 space-y-1 text-[11px]">
                        <div>
                          • Decimal Slope = {calc.gradePct}% ÷ 100 = <span className="font-bold text-amber-300">{calc.slopeDec.toFixed(4)}</span>
                        </div>
                        <div>
                          • Slope Ratio = 1 : (100 ÷ {calc.gradePct}) = <span className="font-bold text-cyan-300">1 : {calc.ratioFormatted}</span>
                        </div>
                      </div>
                    </div>

                    {/* GRADE STEP 2 */}
                    <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 space-y-1.5 shrink-0">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 font-mono font-extrabold text-[11px] shrink-0">
                          2
                        </span>
                        <span className="font-bold text-white uppercase tracking-wide text-[11px] sm:text-xs">
                          Step 2 — Unit Slope Rate in Inches-per-Foot &amp; Millimeters-per-Meter
                        </span>
                      </div>
                      <div className="font-mono text-slate-200 bg-slate-950/80 border border-slate-800/80 rounded px-2.5 py-1.5 space-y-1 text-[11px]">
                        <div>
                          <span className="text-slate-400">Imperial (× 12&quot;/ft):</span> {calc.slopeDec.toFixed(4)} × 12&quot; ={' '}
                          <span className="font-bold text-purple-300">{calc.inPerFt.toFixed(2)}&quot;/ft ≈ {formatSurveyInches16(calc.inPerFt)} per foot</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Metric (× 1000 mm/m):</span> {calc.slopeDec.toFixed(4)} × 1000 mm ={' '}
                          <span className="font-bold text-purple-300">{calc.mmPerM.toFixed(1)} mm per meter</span>
                        </div>
                      </div>
                    </div>

                    {/* GRADE STEP 3 */}
                    <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 space-y-1.5 shrink-0">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 font-mono font-extrabold text-[11px] shrink-0">
                          3
                        </span>
                        <span className="font-bold text-white uppercase tracking-wide text-[11px] sm:text-xs">
                          Step 3 — Calculate Total Vertical {calc.isRise ? 'Rise (+)' : 'Fall (-)'} (Imperial &amp; Metric)
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-400">
                        Formula: <span className="text-amber-300">Total Vertical Change = Horizontal Run × Decimal Slope</span>
                      </div>
                      <div className="font-mono text-slate-200 bg-slate-950/80 border border-slate-800/80 rounded px-2.5 py-1.5 space-y-1 text-[11px]">
                        <div>
                          <span className="text-slate-400">Imperial:</span> {calc.runFt.toFixed(2)} ft ({calc.runIn.toFixed(1)}&quot;) × {calc.slopeDec.toFixed(4)} ={' '}
                          <span className="font-bold text-amber-300">
                            {calc.isRise ? '+' : '-'}{formatSurveyInches16(calc.fallIn)} ({calc.isRise ? '+' : '-'}{calc.fallFt.toFixed(3)} ft)
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400">Metric:</span> {calc.runM.toFixed(2)} m × {calc.slopeDec.toFixed(4)} ={' '}
                          <span className="font-bold text-amber-300">
                            {calc.isRise ? '+' : '-'}{calc.fallM.toFixed(3)} m ({calc.fallMm} mm)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* GRADE STEP 4 */}
                    <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 space-y-1.5 shrink-0">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 font-mono font-extrabold text-[11px] shrink-0">
                          4
                        </span>
                        <span className="font-bold text-white uppercase tracking-wide text-[11px] sm:text-xs">
                          Step 4 — Find Ending Trench / Pipe / Swale Elevation
                        </span>
                      </div>
                      <div className="font-mono text-slate-200 bg-slate-950/80 border border-slate-800/80 rounded px-2.5 py-1.5 space-y-1 text-[11px]">
                        <div>
                          <span className="text-slate-400">Imperial:</span> {formatSurveyFeetInches(calc.startIn)} {calc.isRise ? '+' : '-'} {formatSurveyInches16(calc.fallIn)} ={' '}
                          <span className="font-bold text-emerald-300">{formatSurveyFeetInches(calc.endIn)}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Metric:</span> {calc.startM.toFixed(3)} m {calc.isRise ? '+' : '-'} {calc.fallM.toFixed(3)} m ={' '}
                          <span className="font-bold text-emerald-300">{calc.endM.toFixed(3)} m</span>
                        </div>
                      </div>
                    </div>

                    {/* GRADE STEP 5 */}
                    <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 space-y-1.5 shrink-0">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 font-mono font-extrabold text-[11px] shrink-0">
                          5
                        </span>
                        <span className="font-bold text-white uppercase tracking-wide text-[11px] sm:text-xs">
                          Step 5 — Red Seal NBC Drainage &amp; Ramp Code Benchmarks
                        </span>
                      </div>
                      <div className="font-mono text-slate-200 bg-slate-950/80 border border-slate-800/80 rounded px-2.5 py-2 space-y-1 text-[11px]">
                        <div>• <span className="text-amber-300">1.5% (15 mm/m):</span> Minimum grassy drainage swale grade</div>
                        <div>• <span className="text-cyan-300">2.0% (1:50 • 1/4&quot;/ft • 20 mm/m):</span> Standard pipe, patio &amp; trench drainage</div>
                        <div>• <span className="text-emerald-300">5.0% (50 mm/m):</span> Min slope away from foundation for first 2.0 m (6&apos;-6&quot;)</div>
                        <div>• <span className="text-purple-300">8.33% (1:12 • 1&quot;/ft):</span> Barrier-free exterior ramp max slope</div>
                      </div>
                    </div>
                  </>
                )}

                {!calc && (
                  <p className="text-slate-400">Enter valid surveying or grade dimensions above to view the 5-step dual-unit worked Red Seal solution.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
function SquareMetricDimInput({
  label,
  badge,
  value,
  onChange,
  metricSubUnit = 'm',
  min = '0',
  step,
  accentColor = 'emerald',
  disabled = false,
  rightToggle = null
}) {
  const rawNum = parseFloat(value)
  const valid = Number.isFinite(rawNum)
  const valM = valid ? (metricSubUnit === 'mm' ? rawNum / 1000 : rawNum) : 0
  const valIn = valM / 0.0254
  const defaultStep = step || (metricSubUnit === 'mm' ? '1' : '0.005')

  const accentMap = {
    emerald: 'text-emerald-600 dark:text-emerald-400 focus:border-emerald-500',
    cyan: 'text-cyan-600 dark:text-cyan-400 focus:border-cyan-500',
    amber: 'text-amber-600 dark:text-amber-400 focus:border-amber-500',
    purple: 'text-purple-600 dark:text-purple-400 focus:border-purple-500'
  }
  const colorClasses = accentMap[accentColor] || accentMap.emerald

  return (
    <div className="flex flex-col space-y-1">
      <div className="flex flex-wrap items-center justify-between gap-1 px-0.5">
        <div className="flex items-center gap-1.5">
          <span className={`text-[10px] font-mono font-extrabold uppercase tracking-wider ${colorClasses.split(' focus:')[0]}`}>
            {label}
          </span>
          {badge && (
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-[9px] font-mono font-extrabold text-emerald-600 dark:text-emerald-300">
              {badge}
            </span>
          )}
          {rightToggle}
        </div>
        {valid && !disabled && (
          <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-300 ml-auto">
            = {valM.toFixed(3)} m ({Math.round(valM * 1000)} mm) • {formatSurveyFeetInches(valIn)}
          </span>
        )}
      </div>
      <div className="relative">
        <input
          type="number"
          min={min}
          step={defaultStep}
          disabled={disabled}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl pl-3 pr-11 py-2 text-sm md:text-base font-mono font-bold text-slate-900 dark:text-white focus:outline-none transition-colors ${
            colorClasses.split(' ').slice(-1)[0]
          } ${disabled ? 'opacity-45' : ''}`}
        />
        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono font-extrabold text-slate-400 uppercase pointer-events-none">
          {metricSubUnit}
        </span>
      </div>
    </div>
  )
}

function SquareImperialDimInput({
  label,
  badge,
  feetVal,
  setFeetVal,
  inVal,
  setInVal,
  sixVal,
  setSixVal,
  disabled = false,
  rightToggle = null
}) {
  const computedIn =
    Math.max(0, parseFloat(feetVal) || 0) * 12 +
    Math.max(0, parseFloat(inVal) || 0) +
    Math.max(0, parseFloat(sixVal) || 0) / 16
  const computedM = computedIn * 0.0254

  return (
    <div className={`space-y-1.5 ${disabled ? 'opacity-50' : ''}`}>
      <div className="flex flex-wrap items-center justify-between gap-1.5">
        <div className="flex items-center gap-1.5">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">
            {label}
          </label>
          {badge && (
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-[9px] font-mono font-extrabold text-emerald-600 dark:text-emerald-300">
              {badge}
            </span>
          )}
          {rightToggle}
        </div>
        {!disabled && Number.isFinite(computedIn) && (
          <span className="text-[10px] sm:text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-300 ml-auto">
            = {formatSurveyFeetInches(computedIn)} ({computedIn.toFixed(1)}&quot;) • {computedM.toFixed(3)} m
          </span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        <div className="flex flex-col">
          <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1 px-1">
            FEET (&apos;)
          </span>
          <div className="relative">
            <input
              type="number"
              min="0"
              placeholder="0"
              disabled={disabled}
              value={feetVal}
              onChange={(e) => setFeetVal(e.target.value)}
              className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl pl-3 pr-8 py-2 text-sm md:text-base font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors"
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono font-extrabold text-slate-400 pointer-events-none">
              FT
            </span>
          </div>
        </div>

        <div className="flex flex-col">
          <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1 px-1">
            INCHES (&quot;)
          </span>
          <div className="relative">
            <input
              type="number"
              min="0"
              placeholder="0"
              disabled={disabled}
              value={inVal}
              onChange={(e) => setInVal(e.target.value)}
              className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl pl-3 pr-8 py-2 text-sm md:text-base font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors"
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono font-extrabold text-slate-400 pointer-events-none">
              IN
            </span>
          </div>
        </div>

        <div className="flex flex-col">
          <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1 px-1">
            16THS (/16)
          </span>
          <div className="relative">
            <input
              type="number"
              min="0"
              max="15"
              step="1"
              placeholder="0"
              disabled={disabled}
              value={sixVal}
              onChange={(e) => setSixVal(e.target.value)}
              className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl pl-3 pr-9 py-2 text-sm md:text-base font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors"
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono font-extrabold text-slate-400 pointer-events-none">
              /16
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function SquaringCadAndTeacher({ calc, squareMode, cadSectionRef }) {
  return (
    <div ref={cadSectionRef} className="space-y-4 shrink-0 scroll-mt-2">
      {/* 2. LIVE 1:1 CAD FOUNDATION DIAGONAL & 3-4-5 LAYOUT DIAGRAM (viewBox="0 0 360 175") */}
      {calc && (
        <div className="bg-[#0a192f] border border-slate-700/90 rounded-xl overflow-hidden shadow-lg shrink-0">
          <div className="px-3 py-1.5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between gap-2">
            <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-emerald-400">
              {squareMode === 'multiple345'
                ? 'LIVE 1:1 CAD 3-4-5 JOBSITE LAYOUT TRIANGLE'
                : squareMode === 'missingLeg'
                ? 'LIVE 1:1 CAD REVERSE PYTHAGORAS (MISSING LEG A)'
                : 'LIVE 1:1 CAD EQUAL DIAGONALS (D1 = D2) & 3-4-5 PLAN'}
            </span>
            <span className="text-[10px] font-mono font-bold text-slate-400 shrink-0 whitespace-nowrap">
              {squareMode === 'missingLeg' ? 'A = √(C² - B²)' : 'C = √(A² + B²)'}
            </span>
          </div>

          <svg viewBox="0 0 360 175" className="w-full h-auto min-h-[175px] block shrink-0">
            <defs>
              <pattern id="squareCadGrid" width="18" height="18" patternUnits="userSpaceOnUse">
                <path d="M 18 0 L 0 0 0 18" fill="none" stroke="#172a46" strokeWidth="0.65" />
              </pattern>
            </defs>
            <rect x="0" y="0" width="360" height="175" fill="#0a192f" />
            <rect x="0" y="0" width="360" height="175" fill="url(#squareCadGrid)" />

            {/* Top-Down Foundation / Deck Plan Rectangle (x=42..202, y=40..124) */}
            <rect
              x="42"
              y="40"
              width="160"
              height="84"
              fill="#1e293b"
              stroke="#94a3b8"
              strokeWidth="1.8"
            />

            {/* Nested 3-4-5 Layout Corner Triangle Highlight at Bottom-Left Corner (x=42, y=124) */}
            <polygon
              points="42,124 122,124 42,78"
              fill="#f59e0b"
              opacity="0.18"
            />
            <line x1="42" y1="78" x2="122" y2="124" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3 2" />
            <circle cx="42" cy="78" r="2.2" fill="#fbbf24" />
            <circle cx="122" cy="124" r="2.2" fill="#fbbf24" />

            {/* Highlighted 90° Right-Angle Corner Box at Bottom-Left (42,124) */}
            <polyline
              points="42,113 53,113 53,124"
              fill="none"
              stroke="#34d399"
              strokeWidth="1.6"
            />

            {/* Intersecting Cyan Dashed Diagonals D1 (Bottom-Left to Top-Right) & D2 (Top-Left to Bottom-Right) */}
            <line x1="42" y1="40" x2="202" y2="124" stroke="#38bdf8" strokeWidth="1.3" strokeDasharray="3.5 3" opacity="0.65" />
            <line x1="42" y1="124" x2="202" y2="40" stroke="#22d3ee" strokeWidth="2.1" strokeDasharray="5 2.5" />

            {/* 4 Corner Anchor Pins */}
            <circle cx="42" cy="40" r="2.6" fill="#38bdf8" />
            <circle cx="202" cy="40" r="2.6" fill="#34d399" />
            <circle cx="42" cy="124" r="2.8" fill="#34d399" />
            <circle cx="202" cy="124" r="2.6" fill="#38bdf8" />

            {/* Left Side B Vertical Dimension Arrow (x=28, y=40..124) */}
            <line x1="28" y1="40" x2="28" y2="124" stroke="#a78bfa" strokeWidth="1.5" />
            <polygon points="28,40 25.5,45.5 30.5,45.5" fill="#a78bfa" />
            <polygon points="28,124 25.5,118.5 30.5,118.5" fill="#a78bfa" />

            {/* Bottom Side A Horizontal Dimension Arrow (x=42..202, y=136) */}
            <line x1="42" y1="136" x2="202" y2="136" stroke="#34d399" strokeWidth="1.6" />
            <polygon points="42,136 47.5,133.5 47.5,138.5" fill="#34d399" />
            <polygon points="202,136 196.5,133.5 196.5,138.5" fill="#34d399" />
            <line x1="108" y1="136" x2="108" y2="151" stroke="#34d399" strokeWidth="1.1" strokeDasharray="2 2" />

            {/* Callout Leader Lines to Right-Side Pills & Top Diagonal Pill */}
            <line x1="134" y1="76" x2="134" y2="21" stroke="#22d3ee" strokeWidth="1.1" strokeDasharray="2 2" />
            <line x1="202" y1="64" x2="216" y2="64" stroke="#c084fc" strokeWidth="1.1" strokeDasharray="2 2" />
            <line x1="94" y1="108" x2="216" y2="104" stroke="#fbbf24" strokeWidth="1.1" strokeDasharray="2 2" />

            {/* Opaque fill="#0a192f" Dual-Unit Callout Pills Drawn AFTER All Geometry */}
            <StairSvgPill
              x={8}
              y={13}
              align="start"
              maxWidth={184}
              text={`D1=D2: ${calc.svgDiag}`}
              fontSize={6.7}
              color="#67e8f9"
              borderColor="#0891b2"
            />
            <StairSvgPill
              x={352}
              y={13}
              align="end"
              maxWidth={158}
              text={calc.svgTopRightBadge}
              fontSize={6.6}
              color={calc.fieldStatus === 'out' ? '#fde68a' : '#6ee7b7'}
              borderColor={calc.fieldStatus === 'out' ? '#d97706' : '#059669'}
            />
            <StairSvgPill
              x={352}
              y={64}
              align="end"
              maxWidth={138}
              text={`SIDE B: ${calc.svgSideB}`}
              fontSize={6.6}
              color="#e9d5ff"
              borderColor="#9333ea"
            />
            <StairSvgPill
              x={352}
              y={104}
              align="end"
              maxWidth={138}
              text={`3-4-5: ${calc.svgTri345}`}
              fontSize={6.6}
              color="#fde68a"
              borderColor="#d97706"
            />
            <StairSvgPill
              x={8}
              y={159}
              align="start"
              maxWidth={182}
              text={`${squareMode === 'missingLeg' ? 'SOLVED A' : 'SIDE A'}: ${calc.svgSideA}`}
              fontSize={6.7}
              color="#6ee7b7"
              borderColor="#059669"
            />
            <StairSvgPill
              x={352}
              y={159}
              align="end"
              maxWidth={158}
              text={calc.svgBottomRight}
              fontSize={6.6}
              color={calc.fieldStatus === 'out' ? '#fca5a5' : '#93c5fd'}
              borderColor={calc.fieldStatus === 'out' ? '#ef4444' : '#2563eb'}
            />
          </svg>
        </div>
      )}

      {/* 3. ALWAYS-VISIBLE "HOW TO DO THE MATH (RED SEAL STEP-BY-STEP TEACHER)" — 5 DUAL-UNIT CARDS */}
      <div className="bg-slate-950 border border-emerald-500/35 rounded-xl overflow-hidden shadow-lg shrink-0">
        <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shrink-0">
            <BookOpen size={16} />
          </div>
          <div>
            <h4 className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider leading-tight">
              HOW TO DO THE MATH (RED SEAL STEP-BY-STEP TEACHER)
            </h4>
            <p className="text-[10px] font-mono font-bold text-emerald-300/90 uppercase tracking-widest mt-0.5">
              {squareMode === 'missingLeg'
                ? '5-STEP REVERSE PYTHAGORAS A = √(C² - B²) (IMPERIAL + METRIC)'
                : squareMode === 'multiple345'
                ? '5-STEP 3-4-5 LAYOUT TRIANGLE & DIAGONAL CHECK (IMPERIAL + METRIC)'
                : '5-STEP PYTHAGOREAN DIAGONAL & SQUARING SOLUTION (IMPERIAL + METRIC)'}
            </p>
          </div>
        </div>

        <div className="p-3.5 sm:p-4 space-y-3 text-xs text-slate-300 leading-relaxed">
          {calc ? (
            <>
              {/* STEP 1 */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 space-y-1.5 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 font-mono font-extrabold text-[11px] shrink-0">
                    1
                  </span>
                  <span className="font-bold text-white uppercase tracking-wide text-[11px] sm:text-xs">
                    Step 1 — Convert Dimensions to Single Consistent Units (Imperial &amp; Metric)
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Never mix feet and inches directly inside <span className="font-mono text-emerald-300">A² + B²</span>! Convert everything to total inches (or decimal feet) in Imperial, and meters (or mm) in Metric: <span className="font-mono text-slate-300">Total Inches = (Ft × 12) + In + (16ths ÷ 16)</span>.
                </div>
                <div className="font-mono text-slate-200 bg-slate-950/80 border border-slate-800/80 rounded px-2.5 py-1.5 space-y-1 text-[11px]">
                  <div>
                    <span className="text-slate-400">Side A:</span>{' '}
                    <span className="text-emerald-300 font-bold">{formatSurveyFeetInches(calc.aIn)}</span> = {calc.aIn.toFixed(2)}&quot; ({calc.aFt.toFixed(3)} ft) •{' '}
                    <span className="text-emerald-300 font-bold">{calc.aM.toFixed(3)} m</span> ({Math.round(calc.aM * 1000)} mm)
                  </div>
                  <div>
                    <span className="text-slate-400">Side B:</span>{' '}
                    <span className="text-purple-300 font-bold">{formatSurveyFeetInches(calc.bIn)}</span> = {calc.bIn.toFixed(2)}&quot; ({calc.bFt.toFixed(3)} ft) •{' '}
                    <span className="text-purple-300 font-bold">{calc.bM.toFixed(3)} m</span> ({Math.round(calc.bM * 1000)} mm)
                  </div>
                </div>
              </div>

              {/* STEP 2 */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 space-y-1.5 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 font-mono font-extrabold text-[11px] shrink-0">
                    2
                  </span>
                  <span className="font-bold text-white uppercase tracking-wide text-[11px] sm:text-xs">
                    {squareMode === 'missingLeg'
                      ? 'Step 2 — Apply Reverse Pythagoras: Missing Leg A = √(C² - B²)'
                      : 'Step 2 — Apply the Pythagorean Theorem: C = √(A² + B²)'}
                  </span>
                </div>
                <div className="font-mono text-slate-200 bg-slate-950/80 border border-slate-800/80 rounded px-2.5 py-1.5 space-y-1.5 text-[11px]">
                  {squareMode === 'missingLeg' ? (
                    <>
                      <div>
                        <span className="text-slate-400">Imperial:</span> √({calc.cFt.toFixed(3)}² - {calc.bFt.toFixed(3)}²) = √({(calc.cFt ** 2).toFixed(2)} - {(calc.bFt ** 2).toFixed(2)}) = √{Math.max(0, calc.cFt ** 2 - calc.bFt ** 2).toFixed(2)} ={' '}
                        <span className="font-bold text-emerald-300">{calc.aFt.toFixed(3)} ft ({calc.aIn.toFixed(2)}&quot; / {formatSurveyFeetInches(calc.aIn)})</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Metric:</span> √({calc.cM.toFixed(3)}² - {calc.bM.toFixed(3)}²) ={' '}
                        <span className="font-bold text-emerald-300">{calc.aM.toFixed(3)} m ({Math.round(calc.aM * 1000).toLocaleString()} mm)</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <span className="text-slate-400">Imperial:</span> √({calc.aFt.toFixed(3)}² + {calc.bFt.toFixed(3)}²) = √({(calc.aFt ** 2).toFixed(2)} + {(calc.bFt ** 2).toFixed(2)}) = √{(calc.aFt ** 2 + calc.bFt ** 2).toFixed(2)} ={' '}
                        <span className="font-bold text-cyan-300">{calc.cFt.toFixed(3)} ft ({calc.cIn.toFixed(2)}&quot; / {formatSurveyFeetInches(calc.cIn)})</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Metric:</span> √({calc.aM.toFixed(3)}² + {calc.bM.toFixed(3)}²) ={' '}
                        <span className="font-bold text-cyan-300">{calc.cM.toFixed(3)} m ({Math.round(calc.cM * 1000).toLocaleString()} mm)</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* STEP 3 */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 space-y-1.5 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 font-mono font-extrabold text-[11px] shrink-0">
                    3
                  </span>
                  <span className="font-bold text-white uppercase tracking-wide text-[11px] sm:text-xs">
                    Step 3 — Convert Decimal Inches to Nearest 1/16&quot; Tape Fraction
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Separate whole feet and whole inches, then multiply the remaining decimal inch by <strong>16</strong> and round to the nearest 16th of an inch for pulling your tape measure:
                </div>
                <div className="font-mono text-slate-200 bg-slate-950/80 border border-slate-800/80 rounded px-2.5 py-1.5 space-y-1 text-[11px]">
                  <div>
                    • {calc.targetTapeLabel} = {calc.targetTapeIn.toFixed(3)}&quot; ➔ {Math.floor(calc.targetTapeIn / 12)}&apos;-{Math.floor(calc.targetTapeIn % 12)}&quot; + ({(calc.targetTapeIn - Math.floor(calc.targetTapeIn)).toFixed(3)} × 16 = {Math.round((calc.targetTapeIn - Math.floor(calc.targetTapeIn)) * 16)}/16&quot;)
                  </div>
                  <div>
                    • <span className="text-amber-300 font-bold">Tape Mark: {formatSurveyFeetInches(calc.targetTapeIn)}</span> •{' '}
                    <span className="text-cyan-300 font-bold">Metric Tape: {Math.round(calc.targetTapeM * 1000).toLocaleString()} mm ({calc.targetTapeM.toFixed(3)} m)</span>
                  </div>
                </div>
              </div>

              {/* STEP 4 */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 space-y-1.5 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 font-mono font-extrabold text-[11px] shrink-0">
                    4
                  </span>
                  <span className="font-bold text-white uppercase tracking-wide text-[11px] sm:text-xs">
                    Step 4 — The 3-4-5 Method &amp; Choosing the Largest Multiple
                  </span>
                </div>
                <div className="text-[11px] bg-amber-500/10 border border-amber-500/30 rounded px-2.5 py-1.5 text-amber-100">
                  <strong className="text-amber-300">Red Seal Exam Rule:</strong> Because <span className="font-mono">3² + 4² = 5² (9 + 16 = 25)</span>, any multiple forms a true 90° corner. Always choose the <strong>LARGEST multiple</strong> (<span className="font-mono">6-8-10, 9-12-15, 12-16-20, 15-20-25</span>, or <span className="font-mono">3m-4m-5m</span>) that fits along your wall plates to minimize angular layout error!
                </div>
                <div className="font-mono text-slate-200 bg-slate-950/80 border border-slate-800/80 rounded px-2.5 py-1.5 text-[11px]">
                  Best Fit for Current Layout: <span className="font-bold text-amber-300">{calc.best345Text}</span>
                </div>
              </div>

              {/* STEP 5 */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 space-y-1.5 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 font-mono font-extrabold text-[11px] shrink-0">
                    5
                  </span>
                  <span className="font-bold text-white uppercase tracking-wide text-[11px] sm:text-xs">
                    Step 5 — Equal Diagonals (D1 = D2) &amp; Fixing Out-of-Square Walls
                  </span>
                </div>
                <div className="text-[11px] bg-emerald-500/10 border border-emerald-500/30 rounded px-2.5 py-1.5 text-emerald-100">
                  <strong className="text-emerald-300">Teacher Rule:</strong> A 4-sided foundation or deck with equal opposite sides is ONLY a true 90° rectangle if both corner-to-corner diagonals are identical (<span className="font-mono">D1 = D2</span>). If Diagonal 1 is <span className="font-mono">1/2&quot; (12 mm)</span> longer than Diagonal 2, rack the parallel wall by <strong>HALF the difference</strong> (<span className="font-mono">1/4&quot; / 6 mm</span>) so both diagonals meet in the middle!
                </div>
                <div className="font-mono text-slate-200 bg-slate-950/80 border border-slate-800/80 rounded px-2.5 py-1.5 text-[11px]">
                  Status: <span className="font-bold text-cyan-300">{calc.fieldCheckSummary}</span>
                </div>
              </div>
            </>
          ) : (
            <p className="text-slate-400">Enter valid positive dimensions above (for Missing Leg mode, Hypotenuse C must be greater than Leg B) to view the 5-step dual-unit solution.</p>
          )}
        </div>
      </div>
    </div>
  )
}

function SquaringModal({ onClose }) {
  const [squareMode, setSquareMode] = useState('diagonal') // 'diagonal' | 'multiple345' | 'missingLeg'
  const [unitSystem, setUnitSystem] = useState('imperial') // 'imperial' | 'metric'
  const [metricSubUnit, setMetricSubUnit] = useState('m') // 'm' | 'mm'

  // MODE 1: DIAGONAL CHECK (Default 24'-0" × 32'-0" House = 40'-0" Diagonal)
  const [aFt, setAFt] = useState('24')
  const [aIn, setAIn] = useState('0')
  const [a16, setA16] = useState('0')

  const [bFt, setBFt] = useState('32')
  const [bIn, setBIn] = useState('0')
  const [b16, setB16] = useState('0')

  const [aMet, setAMet] = useState('7.315')
  const [bMet, setBMet] = useState('9.754')

  const [useFieldDiag, setUseFieldDiag] = useState(false)
  const [measFt, setMeasFt] = useState('40')
  const [measIn, setMeasIn] = useState('0')
  const [meas16, setMeas16] = useState('8') // 40'-0 1/2" example out-of-square check when toggled ON
  const [measMet, setMeasMet] = useState('12.205')

  // MODE 2: 3-4-5 MULTIPLES (Jobsite Layout Triangle Generator)
  const [mult345, setMult345] = useState(4) // ×4 -> 12'-16'-20'
  const [autoFitWall, setAutoFitWall] = useState(false)
  const [maxWallFt, setMaxWallFt] = useState('24')
  const [maxWallIn, setMaxWallIn] = useState('0')
  const [maxWall16, setMaxWall16] = useState('0')
  const [maxWallMet, setMaxWallMet] = useState('7.315')

  // MODE 3: SOLVE MISSING LEG A = √(C² - B²)
  const [hypFt, setHypFt] = useState('40')
  const [hypIn, setHypIn] = useState('0')
  const [hyp16, setHyp16] = useState('0')

  const [legBFt, setLegBFt] = useState('32')
  const [legBIn, setLegBIn] = useState('0')
  const [legB16, setLegB16] = useState('0')

  const [hypMet, setHypMet] = useState('12.192')
  const [legBMet, setLegBMet] = useState('9.754')

  const [activeTooltip, setActiveTooltip] = useState(null)
  const [calcPulse, setCalcPulse] = useState(false)
  const scrollBodyRef = useRef(null)
  const cadSectionRef = useRef(null)

  const toPosInches = (ftS, inS, sixS) =>
    Math.max(0, parseFloat(ftS) || 0) * 12 +
    Math.max(0, parseFloat(inS) || 0) +
    Math.max(0, parseFloat(sixS) || 0) / 16

  const parseMetricMeters = (strVal, subU = metricSubUnit) => {
    const v = Math.max(0, parseFloat(strVal) || 0)
    return subU === 'mm' ? v / 1000 : v
  }

  const formatMetricInput = (metersVal, subU = metricSubUnit) =>
    subU === 'mm' ? String(Math.round(metersVal * 1000)) : metersVal.toFixed(3)

  // Live conversion when switching between IMPERIAL and METRIC
  const handleSwitchUnit = (nextUnit) => {
    if (nextUnit === unitSystem) return
    if (nextUnit === 'metric') {
      setAMet(formatMetricInput(toPosInches(aFt, aIn, a16) * 0.0254))
      setBMet(formatMetricInput(toPosInches(bFt, bIn, b16) * 0.0254))
      setMeasMet(formatMetricInput(toPosInches(measFt, measIn, meas16) * 0.0254))
      setMaxWallMet(formatMetricInput(toPosInches(maxWallFt, maxWallIn, maxWall16) * 0.0254))
      setHypMet(formatMetricInput(toPosInches(hypFt, hypIn, hyp16) * 0.0254))
      setLegBMet(formatMetricInput(toPosInches(legBFt, legBIn, legB16) * 0.0254))
    } else {
      const pA = metersToImperialParts(parseMetricMeters(aMet))
      setAFt(pA.ft); setAIn(pA.inch); setA16(pA.six)
      const pB = metersToImperialParts(parseMetricMeters(bMet))
      setBFt(pB.ft); setBIn(pB.inch); setB16(pB.six)
      const pM = metersToImperialParts(parseMetricMeters(measMet))
      setMeasFt(pM.ft); setMeasIn(pM.inch); setMeas16(pM.six)
      const pW = metersToImperialParts(parseMetricMeters(maxWallMet))
      setMaxWallFt(pW.ft); setMaxWallIn(pW.inch); setMaxWall16(pW.six)
      const pH = metersToImperialParts(parseMetricMeters(hypMet))
      setHypFt(pH.ft); setHypIn(pH.inch); setHyp16(pH.six)
      const pLB = metersToImperialParts(parseMetricMeters(legBMet))
      setLegBFt(pLB.ft); setLegBIn(pLB.inch); setLegB16(pLB.six)
    }
    setUnitSystem(nextUnit)
  }

  // Live conversion when switching Metric Sub-Unit (m <-> mm)
  const handleSwitchMetricSubUnit = (nextSub) => {
    if (nextSub === metricSubUnit) return
    setAMet(formatMetricInput(parseMetricMeters(aMet, metricSubUnit), nextSub))
    setBMet(formatMetricInput(parseMetricMeters(bMet, metricSubUnit), nextSub))
    setMeasMet(formatMetricInput(parseMetricMeters(measMet, metricSubUnit), nextSub))
    setMaxWallMet(formatMetricInput(parseMetricMeters(maxWallMet, metricSubUnit), nextSub))
    setHypMet(formatMetricInput(parseMetricMeters(hypMet, metricSubUnit), nextSub))
    setLegBMet(formatMetricInput(parseMetricMeters(legBMet, metricSubUnit), nextSub))
    setMetricSubUnit(nextSub)
  }

  const applyBuildingPreset = (ftA, ftB) => {
    setAFt(String(ftA)); setAIn('0'); setA16('0')
    setBFt(String(ftB)); setBIn('0'); setB16('0')
    const mA = ftA * 0.3048
    const mB = ftB * 0.3048
    setAMet(formatMetricInput(mA))
    setBMet(formatMetricInput(mB))
    const diagM = Math.hypot(mA, mB)
    const pD = metersToImperialParts(diagM)
    setMeasFt(pD.ft); setMeasIn(pD.inch); setMeas16(pD.six)
    setMeasMet(formatMetricInput(diagM))
  }

  const applyMissingLegPreset = (ftC, ftB) => {
    setHypFt(String(ftC)); setHypIn('0'); setHyp16('0')
    setLegBFt(String(ftB)); setLegBIn('0'); setLegB16('0')
    setHypMet(formatMetricInput(ftC * 0.3048))
    setLegBMet(formatMetricInput(ftB * 0.3048))
  }

  // Recommended largest whole-unit 3-4-5 multiple that fits within MAX WALL LENGTH AVAILABLE (4k <= maxWallFt)
  const recommendedWallMultiple = useMemo(() => {
    const wallM =
      unitSystem === 'imperial'
        ? toPosInches(maxWallFt, maxWallIn, maxWall16) * 0.0254
        : parseMetricMeters(maxWallMet, metricSubUnit)
    const wallFt = wallM / 0.3048
    if (wallFt <= 0) return 1
    return Math.max(1, Math.floor((wallFt + 0.001) / 4))
  }, [unitSystem, maxWallFt, maxWallIn, maxWall16, maxWallMet, metricSubUnit])

  const activeScale345 = autoFitWall ? recommendedWallMultiple : mult345

  const calc = useMemo(() => {
    const impPrimary = unitSystem === 'imperial'
    let aM = 0
    let bM = 0
    let cM = 0

    if (squareMode === 'diagonal') {
      if (impPrimary) {
        aM = toPosInches(aFt, aIn, a16) * 0.0254
        bM = toPosInches(bFt, bIn, b16) * 0.0254
      } else {
        aM = parseMetricMeters(aMet, metricSubUnit)
        bM = parseMetricMeters(bMet, metricSubUnit)
      }
      if (aM <= 0 || bM <= 0) return null
      cM = Math.hypot(aM, bM)
    } else if (squareMode === 'multiple345') {
      const k = Math.max(0.25, Number(activeScale345) || 1)
      // Base 3'-4'-5' in feet converted to exact meters (or if metric, still exact 3k'-4k'-5k' + metric equivalents)
      aM = 3 * k * 0.3048
      bM = 4 * k * 0.3048
      cM = 5 * k * 0.3048
    } else {
      // missingLeg: A = √(C² - B²)
      if (impPrimary) {
        cM = toPosInches(hypFt, hypIn, hyp16) * 0.0254
        bM = toPosInches(legBFt, legBIn, legB16) * 0.0254
      } else {
        cM = parseMetricMeters(hypMet, metricSubUnit)
        bM = parseMetricMeters(legBMet, metricSubUnit)
      }
      if (cM <= 0 || bM <= 0 || cM <= bM + 1e-6) return null
      aM = Math.sqrt(Math.max(0, cM * cM - bM * bM))
    }

    const aInVal = aM / 0.0254
    const bInVal = bM / 0.0254
    const cInVal = cM / 0.0254
    const aFtVal = aInVal / 12
    const bFtVal = bInVal / 12
    const cFtVal = cInVal / 12

    const fmtDualFull = (inV, mV) => {
      const impPart = `${formatSurveyFeetInches(inV)} (${inV.toFixed(2)}")`
      const metPart = `${mV.toFixed(3)} m (${Math.round(mV * 1000)} mm)`
      return impPrimary ? `${impPart} • ${metPart}` : `${metPart} • ${impPart}`
    }

    // Best 3-4-5 Layout Triangle for Side A & Side B
    let bestMult = 1
    if (squareMode === 'multiple345') {
      bestMult = activeScale345
    } else {
      // Prefer 4x along Side A if 3x fits Side B (e.g. 24' Side A & 32' Side B -> ×6 = 18'-24'-30'), else max fitting short/long
      const bySideA4 = Math.min(Math.floor((aFtVal + 0.001) / 4), Math.floor((bFtVal + 0.001) / 3))
      if (bySideA4 >= 1) {
        bestMult = bySideA4
      } else {
        const minSide = Math.min(aFtVal, bFtVal)
        const maxSide = Math.max(aFtVal, bFtVal)
        bestMult = Math.max(1, Math.min(Math.floor((minSide + 0.001) / 3), Math.floor((maxSide + 0.001) / 4)))
      }
    }

    const tri3Ft = 3 * bestMult
    const tri4Ft = 4 * bestMult
    const tri5Ft = 5 * bestMult
    const tri3M = tri3Ft * 0.3048
    const tri4M = tri4Ft * 0.3048
    const tri5M = tri5Ft * 0.3048
    const best345Text = `${tri3Ft}'-${tri4Ft}'-${tri5Ft}' (×${bestMult} Multiple) • ${tri3M.toFixed(2)}m - ${tri4M.toFixed(2)}m - ${tri5M.toFixed(2)}m`

    // Acute diagonal angles
    const angleADeg = ((Math.atan2(aM, bM) * 180) / Math.PI).toFixed(2)
    const angleBDeg = ((Math.atan2(bM, aM) * 180) / Math.PI).toFixed(2)

    // Field Diagonal Check (Mode 1 optional input, or square summary in Modes 2 & 3)
    let fieldStatus = 'optional'
    let fieldCheckValue = 'Optional (Enable Field Tape Check Above)'
    let fieldCheckClass = 'text-slate-400 text-xs'
    let fieldCheckSummary = `Equal Diagonals Required: D1 = D2 = ${formatSurveyFeetInches(cInVal)} (${cM.toFixed(3)} m)`
    let svgTopRightBadge = 'A² + B² = C² (90.0° SQUARE)'
    let svgBottomRight = `∠ ${angleADeg}° / ${angleBDeg}° • 90° ✓`

    if (squareMode === 'diagonal' && useFieldDiag) {
      const measMVal = impPrimary
        ? toPosInches(measFt, measIn, meas16) * 0.0254
        : parseMetricMeters(measMet, metricSubUnit)
      const measInVal = measMVal / 0.0254
      const diffIn = measInVal - cInVal
      const diffMm = Math.round((measMVal - cM) * 1000)
      const absDiffIn = Math.abs(diffIn)
      const absDiffMm = Math.abs(diffMm)
      const halfIn = absDiffIn / 2
      const halfMm = Math.round(absDiffMm / 2)

      if (absDiffIn <= 1 / 32) {
        fieldStatus = 'square'
        fieldCheckValue = 'SQUARE (0" / 0 mm Error) ✓'
        fieldCheckClass = 'text-emerald-600 dark:text-emerald-400 text-xs'
        fieldCheckSummary = `Field Diagonal Matches ${formatSurveyFeetInches(cInVal)} (${cM.toFixed(3)} m) — TRUE 90° SQUARE ✓`
        svgTopRightBadge = 'FIELD CHECK: 0" ERROR ✓'
      } else {
        fieldStatus = 'out'
        const signStr = diffIn > 0 ? '+' : '-'
        const dirAction = diffIn > 0 ? 'Rack Long Corner IN' : 'Push Short Corner OUT'
        fieldCheckValue = `OUT BY ${signStr}${formatSurveyInches16(absDiffIn)} (${signStr}${absDiffMm} mm) ➔ ${dirAction} by ${formatSurveyInches16(halfIn)} (${halfMm} mm)`
        fieldCheckClass = 'text-amber-600 dark:text-amber-400 text-[11px] sm:text-xs'
        fieldCheckSummary = `Measured ${formatSurveyFeetInches(measInVal)} vs True ${formatSurveyFeetInches(cInVal)} ➔ ${dirAction} by Half (${formatSurveyInches16(halfIn)} / ${halfMm} mm)!`
        svgTopRightBadge = `OUT OF SQ: ${signStr}${formatSurveyInches16(absDiffIn)} (${signStr}${absDiffMm}mm)`
        svgBottomRight = `SHIFT 1/2: ${formatSurveyInches16(halfIn)} (${halfMm}mm)`
      }
    } else if (squareMode === 'multiple345') {
      fieldCheckValue = `Pull 5x Mark = ${tri5Ft}'-0" (${tri5M.toFixed(3)} m / ${Math.round(tri5M * 1000)} mm) ✓`
      fieldCheckClass = 'text-emerald-600 dark:text-emerald-400 text-xs'
    } else if (squareMode === 'missingLeg') {
      fieldCheckValue = `Check: ${formatSurveyFeetInches(aInVal)}² + ${formatSurveyFeetInches(bInVal)}² = ${formatSurveyFeetInches(cInVal)}² ✓`
      fieldCheckClass = 'text-emerald-600 dark:text-emerald-400 text-xs'
    }

    const targetTapeIn = squareMode === 'missingLeg' ? aInVal : cInVal
    const targetTapeM = squareMode === 'missingLeg' ? aM : cM
    const targetTapeLabel = squareMode === 'missingLeg' ? 'Solved Leg A' : 'True Diagonal C'

    return {
      aM,
      bM,
      cM,
      aIn: aInVal,
      bIn: bInVal,
      cIn: cInVal,
      aFt: aFtVal,
      bFt: bFtVal,
      cFt: cFtVal,
      bestMult,
      best345Text,
      angleADeg,
      angleBDeg,
      fieldStatus,
      fieldCheckSummary,
      targetTapeIn,
      targetTapeM,
      targetTapeLabel,
      svgDiag: impPrimary
        ? `${formatSurveyFeetInches(cInVal)} (${cM.toFixed(2)}m)`
        : `${cM.toFixed(2)}m (${formatSurveyFeetInches(cInVal)})`,
      svgSideA: impPrimary
        ? `${formatSurveyFeetInches(aInVal)} (${aM.toFixed(2)}m)`
        : `${aM.toFixed(2)}m (${formatSurveyFeetInches(aInVal)})`,
      svgSideB: impPrimary
        ? `${formatSurveyFeetInches(bInVal)} (${bM.toFixed(2)}m)`
        : `${bM.toFixed(2)}m (${formatSurveyFeetInches(bInVal)})`,
      svgTri345: `${tri3Ft}'-${tri4Ft}'-${tri5Ft}' (×${bestMult})`,
      svgTopRightBadge,
      svgBottomRight,
      rows: [
        {
          id: 'sqSideA',
          label: squareMode === 'missingLeg' ? 'Solved Missing Leg A (√(C² - B²)):' : 'Side A (Length / Baseline):',
          value: fmtDualFull(aInVal, aM),
          valueClass: squareMode === 'missingLeg' ? 'text-emerald-600 dark:text-emerald-400 text-xs' : 'text-slate-900 dark:text-white text-xs',
          tip:
            squareMode === 'missingLeg'
              ? `Exact perpendicular wall leg solved by Reverse Pythagoras: √(C² - B²) = ${formatSurveyFeetInches(aInVal)} (${aM.toFixed(3)} m).`
              : `First wall plate or foundation baseline forming the 90° corner: ${formatSurveyFeetInches(aInVal)} (${aM.toFixed(3)} m).`
        },
        {
          id: 'sqSideB',
          label: 'Side B (Width / Perpendicular):',
          value: fmtDualFull(bInVal, bM),
          valueClass: 'text-slate-900 dark:text-white text-xs',
          tip: `Perpendicular wall or foundation width at 90° to Side A: ${formatSurveyFeetInches(bInVal)} (${bM.toFixed(3)} m).`
        },
        {
          id: 'sqDiag',
          label: 'Exact True Diagonal (C = √(A² + B²)):',
          value: fmtDualFull(cInVal, cM),
          valueClass: 'text-emerald-600 dark:text-emerald-400 text-xs',
          tip: `Corner-to-corner hypotenuse required for a true 90.00° corner: ${formatSurveyFeetInches(cInVal)} (${cInVal.toFixed(2)}") = ${cM.toFixed(3)} m (${Math.round(cM * 1000)} mm).`
        },
        {
          id: 'sqEqualDiag',
          label: 'Equal Diagonals Rule (D1 = D2):',
          value: `A-C = ${formatSurveyFeetInches(cInVal)} & B-D = ${formatSurveyFeetInches(cInVal)} (${cM.toFixed(3)} m) ✓`,
          valueClass: 'text-cyan-600 dark:text-cyan-400 text-xs',
          tip: 'A 4-sided frame with equal opposite walls is a true 90° rectangle if and only if both diagonals D1 (Corner A-C) and D2 (Corner B-D) measure the exact same length.'
        },
        {
          id: 'sqBest345',
          label: 'Best 3-4-5 Layout Triangle:',
          value: best345Text,
          valueClass: 'text-amber-600 dark:text-amber-400 text-xs',
          tip: 'Red Seal best practice: always pull the largest whole-number 3-4-5 multiple that fits along your wall plates so small pencil-mark tolerances do not magnify over long walls.'
        },
        {
          id: 'sqAngles',
          label: 'Corner Angles (∠A & ∠B):',
          value: `90.00° Right Angle (${angleADeg}° / ${angleBDeg}° Diag)`,
          valueClass: 'text-purple-600 dark:text-purple-400 text-xs',
          tip: `True 90.00° corner with diagonal interior angles tan⁻¹(A/B) = ${angleADeg}° and tan⁻¹(B/A) = ${angleBDeg}° (36.87° / 53.13° on any 3-4-5 ratio).`
        },
        {
          id: 'sqFieldCheck',
          label: 'Field Diagonal Check:',
          value: fieldCheckValue,
          valueClass: fieldCheckClass,
          tip: 'Compare your physical jobsite tape diagonal against the true calculated diagonal. Rack parallel walls by HALF the diagonal difference so both diagonals meet at equality!'
        }
      ]
    }
  }, [
    squareMode,
    unitSystem,
    metricSubUnit,
    aFt,
    aIn,
    a16,
    bFt,
    bIn,
    b16,
    aMet,
    bMet,
    useFieldDiag,
    measFt,
    measIn,
    meas16,
    measMet,
    activeScale345,
    hypFt,
    hypIn,
    hyp16,
    legBFt,
    legBIn,
    legB16,
    hypMet,
    legBMet
  ])

  const handleCalculate = () => {
    setCalcPulse(true)
    setTimeout(() => setCalcPulse(false), 300)
  }

  const toggleInfo = (id) => {
    setActiveTooltip((prev) => (prev === id ? null : id))
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 p-4 shrink-0 bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500 rounded-lg text-white shrink-0">
              <Square size={22} />
            </div>
            <div>
              <h3 className="text-slate-900 dark:text-white text-base md:text-lg font-bold uppercase tracking-wider leading-tight">
                SQUARING &amp; DIAGONALS
              </h3>
              <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                PYTHAGORAS, D1 = D2 CHECK &amp; 3-4-5 LAYOUT
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition-colors p-1">
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Sticky Quick Section Switcher Bar */}
        <div className="px-4 py-2 bg-slate-100 dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800 shrink-0 flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollBodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex-1 py-1.5 px-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-[11px] font-mono font-extrabold text-slate-800 dark:text-slate-200 hover:border-emerald-500/60 transition-colors"
          >
            🧮 Calculator &amp; Results
          </button>
          <button
            type="button"
            onClick={() => cadSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            className="flex-1 py-1.5 px-2.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-[11px] font-mono font-extrabold text-emerald-700 dark:text-emerald-300 transition-colors"
          >
            📐 1:1 CAD &amp; Math Teacher ↓
          </button>
        </div>

        {/* Scrollable Body (Block flow prevents flex-shrink crushing) */}
        <div
          ref={scrollBodyRef}
          className="block space-y-4 p-4 md:p-5 overflow-y-auto custom-scrollbar flex-1 min-h-0 max-h-[82vh]"
        >
          {/* 3-Mode Red Seal Squaring Selector */}
          <div className="grid grid-cols-3 gap-1.5 bg-slate-200 dark:bg-slate-800/90 p-1 rounded-xl shrink-0">
            {[
              { id: 'diagonal', title: 'Diagonal Check', sub: 'C = √(A² + B²)' },
              { id: 'multiple345', title: '3-4-5 Multiples', sub: 'Layout Triangle' },
              { id: 'missingLeg', title: 'Solve Missing Leg', sub: 'A = √(C² - B²)' }
            ].map((tab) => {
              const active = squareMode === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSquareMode(tab.id)}
                  className={`py-2 px-1.5 rounded-lg text-center transition-all ${
                    active
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider leading-tight">
                    {tab.title}
                  </div>
                  <div className={`text-[9px] font-mono font-bold mt-0.5 ${active ? 'text-emerald-100' : 'text-slate-500'}`}>
                    {tab.sub}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Imperial vs Metric Live-Converting Toggle */}
          <div className="flex bg-slate-200 dark:bg-slate-800 rounded-lg p-1 shrink-0">
            <button
              type="button"
              onClick={() => handleSwitchUnit('imperial')}
              className={`flex-1 py-2 px-2 text-[11px] font-bold uppercase tracking-wider rounded-md transition-colors ${
                unitSystem === 'imperial'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Imperial (FT / IN / 16THS)
            </button>
            <button
              type="button"
              onClick={() => handleSwitchUnit('metric')}
              className={`flex-1 py-2 px-2 text-[11px] font-bold uppercase tracking-wider rounded-md transition-colors ${
                unitSystem === 'metric'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Metric (M / MM)
            </button>
          </div>

          {unitSystem === 'metric' && (
            <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-800/60 px-3 py-1.5 rounded-lg shrink-0">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Metric Input Unit:
              </span>
              <div className="flex gap-1 bg-slate-200 dark:bg-slate-900 p-0.5 rounded-md">
                {[
                  { id: 'm', label: 'Meters (m)' },
                  { id: 'mm', label: 'Millimeters (mm)' }
                ].map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleSwitchMetricSubUnit(u.id)}
                    className={`px-2.5 py-1 rounded text-[10px] font-mono font-extrabold transition-colors ${
                      metricSubUnit === u.id
                        ? 'bg-emerald-600 text-white'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {u.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Mode-Specific Inputs */}
          <div className="space-y-3.5 shrink-0">
            {squareMode === 'diagonal' && (
              <div className="space-y-3">
                {/* Quick Building Footprint Presets */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {[
                    { label: "3'-4'-5' Rule", a: 3, b: 4 },
                    { label: "12'×16' Deck", a: 12, b: 16 },
                    { label: "24'×32' House", a: 24, b: 32 },
                    { label: "28'×40' Found", a: 28, b: 40 }
                  ].map((p) => {
                    const isCurrent =
                      unitSystem === 'imperial' &&
                      parseFloat(aFt) === p.a &&
                      parseFloat(aIn) === 0 &&
                      parseFloat(bFt) === p.b &&
                      parseFloat(bIn) === 0
                    return (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => applyBuildingPreset(p.a, p.b)}
                        className={`py-1.5 px-1.5 rounded-lg text-[10px] font-mono font-extrabold border transition-colors ${
                          isCurrent
                            ? 'bg-emerald-500/20 border-emerald-400 text-emerald-700 dark:text-emerald-300'
                            : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-emerald-500/40'
                        }`}
                      >
                        {p.label}
                      </button>
                    )
                  })}
                </div>

                {unitSystem === 'imperial' ? (
                  <>
                    <SquareImperialDimInput
                      label="Side A (Building Length)"
                      badge="SIDE A"
                      feetVal={aFt}
                      setFeetVal={setAFt}
                      inVal={aIn}
                      setInVal={setAIn}
                      sixVal={a16}
                      setSixVal={setA16}
                    />
                    <SquareImperialDimInput
                      label="Side B (Building Width)"
                      badge="SIDE B"
                      feetVal={bFt}
                      setFeetVal={setBFt}
                      inVal={bIn}
                      setInVal={setBIn}
                      sixVal={b16}
                      setSixVal={setB16}
                    />
                    <div className="pt-1.5 border-t border-slate-200 dark:border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                          Measured Field Diagonal (Optional Check)
                        </span>
                        <button
                          type="button"
                          onClick={() => setUseFieldDiag((v) => !v)}
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-extrabold border transition-colors ${
                            useFieldDiag
                              ? 'bg-amber-500/20 border-amber-400 text-amber-700 dark:text-amber-300'
                              : 'bg-slate-200 dark:bg-slate-800 border-slate-400 dark:border-slate-700 text-slate-500'
                          }`}
                        >
                          {useFieldDiag ? 'ACTIVE' : 'OFF'}
                        </button>
                      </div>
                      {useFieldDiag && (
                        <SquareImperialDimInput
                          label="Field Tape Diagonal Reading"
                          badge="TAPE"
                          feetVal={measFt}
                          setFeetVal={setMeasFt}
                          inVal={measIn}
                          setInVal={setMeasIn}
                          sixVal={meas16}
                          setSixVal={setMeas16}
                        />
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <SquareMetricDimInput
                      label="Side A (Building Length)"
                      badge="SIDE A"
                      value={aMet}
                      onChange={setAMet}
                      metricSubUnit={metricSubUnit}
                      accentColor="emerald"
                    />
                    <SquareMetricDimInput
                      label="Side B (Building Width)"
                      badge="SIDE B"
                      value={bMet}
                      onChange={setBMet}
                      metricSubUnit={metricSubUnit}
                      accentColor="purple"
                    />
                    <SquareMetricDimInput
                      label="Measured Field Diagonal (Optional)"
                      badge="TAPE"
                      value={measMet}
                      onChange={setMeasMet}
                      metricSubUnit={metricSubUnit}
                      accentColor="amber"
                      disabled={!useFieldDiag}
                      rightToggle={
                        <button
                          type="button"
                          onClick={() => setUseFieldDiag((v) => !v)}
                          className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-extrabold border transition-colors ${
                            useFieldDiag
                              ? 'bg-amber-500/20 border-amber-400 text-amber-700 dark:text-amber-300'
                              : 'bg-slate-200 dark:bg-slate-800 border-slate-400 dark:border-slate-700 text-slate-500'
                          }`}
                        >
                          {useFieldDiag ? 'ACTIVE' : 'OFF'}
                        </button>
                      }
                    />
                  </>
                )}
              </div>
            )}

            {squareMode === 'multiple345' && (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <span className="block text-[10px] font-mono font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 px-1">
                    QUICK-SELECT 3-4-5 SCALE FACTOR PILLS
                  </span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { k: 1, label: '×1 (3-4-5)' },
                      { k: 2, label: '×2 (6-8-10)' },
                      { k: 3, label: '×3 (9-12-15)' },
                      { k: 4, label: '×4 (12-16-20)' },
                      { k: 5, label: '×5 (15-20-25)' },
                      { k: 10, label: '×10 (30-40-50)' }
                    ].map((item) => {
                      const active = !autoFitWall && mult345 === item.k
                      return (
                        <button
                          key={item.k}
                          type="button"
                          onClick={() => {
                            setAutoFitWall(false)
                            setMult345(item.k)
                          }}
                          className={`py-2 px-2 rounded-lg text-[10px] sm:text-[11px] font-mono font-extrabold border transition-colors ${
                            active
                              ? 'bg-emerald-600 border-emerald-400 text-white shadow-sm'
                              : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-500/40'
                          }`}
                        >
                          {item.label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Custom MAX WALL LENGTH AVAILABLE Auto-Recommender */}
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-1.5">
                    <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-300">
                      MAX WALL LENGTH AVAILABLE (AUTO-FIT)
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setAutoFitWall(true)
                        setMult345(recommendedWallMultiple)
                      }}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-extrabold border transition-colors ${
                        autoFitWall
                          ? 'bg-emerald-500/20 border-emerald-400 text-emerald-700 dark:text-emerald-300'
                          : 'bg-amber-500/20 border-amber-400 text-amber-700 dark:text-amber-300 hover:bg-amber-500/30'
                      }`}
                    >
                      {autoFitWall
                        ? `AUTO-FIT ACTIVE (×${recommendedWallMultiple})`
                        : `USE BEST FIT: ×${recommendedWallMultiple} (${3 * recommendedWallMultiple}-${4 * recommendedWallMultiple}-${5 * recommendedWallMultiple})`}
                    </button>
                  </div>

                  {unitSystem === 'imperial' ? (
                    <SquareImperialDimInput
                      label="Available Wall Plate Length"
                      badge="MAX WALL"
                      feetVal={maxWallFt}
                      setFeetVal={(v) => {
                        setMaxWallFt(v)
                        setAutoFitWall(true)
                      }}
                      inVal={maxWallIn}
                      setInVal={(v) => {
                        setMaxWallIn(v)
                        setAutoFitWall(true)
                      }}
                      sixVal={maxWall16}
                      setSixVal={(v) => {
                        setMaxWall16(v)
                        setAutoFitWall(true)
                      }}
                    />
                  ) : (
                    <SquareMetricDimInput
                      label="Available Wall Plate Length"
                      badge="MAX WALL"
                      value={maxWallMet}
                      onChange={(v) => {
                        setMaxWallMet(v)
                        setAutoFitWall(true)
                      }}
                      metricSubUnit={metricSubUnit}
                      accentColor="amber"
                    />
                  )}

                  <div className="text-[11px] font-mono text-slate-600 dark:text-slate-300 bg-white/80 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5">
                    Recommended Max Triangle:{' '}
                    <strong className="text-emerald-600 dark:text-emerald-400">
                      {3 * recommendedWallMultiple}&apos; - {4 * recommendedWallMultiple}&apos; - {5 * recommendedWallMultiple}&apos; (×{recommendedWallMultiple})
                    </strong>{' '}
                    • {(3 * recommendedWallMultiple * 0.3048).toFixed(2)}m - {(4 * recommendedWallMultiple * 0.3048).toFixed(2)}m - {(5 * recommendedWallMultiple * 0.3048).toFixed(2)}m
                  </div>
                </div>
              </div>
            )}

            {squareMode === 'missingLeg' && (
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { label: "5' Diag / 4' Leg", c: 5, b: 4 },
                    { label: "20' Diag / 16' Leg", c: 20, b: 16 },
                    { label: "40' Diag / 32' Leg", c: 40, b: 32 }
                  ].map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => applyMissingLegPreset(p.c, p.b)}
                      className="py-1.5 px-1.5 rounded-lg text-[10px] font-mono font-extrabold border bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-emerald-500/50 transition-colors"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                {unitSystem === 'imperial' ? (
                  <>
                    <SquareImperialDimInput
                      label="Known Hypotenuse / Diagonal (C)"
                      badge="DIAG C"
                      feetVal={hypFt}
                      setFeetVal={setHypFt}
                      inVal={hypIn}
                      setInVal={setHypIn}
                      sixVal={hyp16}
                      setSixVal={setHyp16}
                    />
                    <SquareImperialDimInput
                      label="Known Side Leg (B)"
                      badge="LEG B"
                      feetVal={legBFt}
                      setFeetVal={setLegBFt}
                      inVal={legBIn}
                      setInVal={setLegBIn}
                      sixVal={legB16}
                      setSixVal={setLegB16}
                    />
                  </>
                ) : (
                  <>
                    <SquareMetricDimInput
                      label="Known Hypotenuse / Diagonal (C)"
                      badge="DIAG C"
                      value={hypMet}
                      onChange={setHypMet}
                      metricSubUnit={metricSubUnit}
                      accentColor="cyan"
                    />
                    <SquareMetricDimInput
                      label="Known Side Leg (B)"
                      badge="LEG B"
                      value={legBMet}
                      onChange={setLegBMet}
                      metricSubUnit={metricSubUnit}
                      accentColor="purple"
                    />
                  </>
                )}
              </div>
            )}

            <button
              type="button"
              onClick={handleCalculate}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase tracking-wider py-3 rounded-xl transition-all shadow-md active:scale-[0.98]"
            >
              {squareMode === 'diagonal'
                ? 'Calculate True Diagonal & Square Check'
                : squareMode === 'multiple345'
                ? 'Generate 3-4-5 Layout Triangle'
                : 'Solve Missing Perpendicular Leg (A)'}
            </button>
          </div>

          {/* Quick Jump Pill to 1:1 CAD & Step-by-Step Math Walkthrough */}
          <button
            type="button"
            onClick={() => cadSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            className="w-full shrink-0 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/35 text-emerald-700 dark:text-emerald-300 text-[11px] sm:text-xs font-mono font-extrabold tracking-wide transition-colors"
          >
            <span>📐 Jump to 1:1 CAD &amp; Step-by-Step Math Walkthrough ↓</span>
          </button>

          {/* 1. CALCULATION RESULTS (7 Complete Dual-Unit Rows, Zero ⓘ Collision) */}
          <div
            className={`shrink-0 bg-slate-100 dark:bg-slate-800/50 border rounded-xl p-4 md:p-5 transition-colors ${
              calcPulse ? 'border-emerald-400' : 'border-slate-300 dark:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-3.5 border-b border-slate-200 dark:border-slate-700 pb-2">
              <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                Calculation Results
              </h4>
              <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                IMPERIAL + METRIC
              </span>
            </div>

            {calc ? (
              <div className="space-y-2.5 text-xs sm:text-sm">
                {calc.rows.map((row, idx, arr) => (
                  <div
                    key={row.id}
                    className={`flex flex-col ${
                      idx < arr.length - 1 ? 'border-b border-slate-200/60 dark:border-slate-700/60 pb-2.5' : 'pt-0.5'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="font-sans font-semibold text-slate-700 dark:text-slate-200 leading-snug">
                          {row.label}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleInfo(row.id)}
                          aria-label={`Info about ${row.label}`}
                          className={`inline-flex items-center justify-center w-5 h-5 rounded-full shrink-0 transition-colors ${
                            activeTooltip === row.id
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'text-slate-400 hover:text-emerald-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                          }`}
                        >
                          <Info size={13} />
                        </button>
                      </div>

                      <div className={`ml-auto text-right font-mono font-bold ${row.valueClass}`}>
                        {row.value}
                      </div>
                    </div>

                    {activeTooltip === row.id && (
                      <div className="text-xs text-emerald-100 bg-slate-900 border border-emerald-500/30 px-3 py-2 rounded-lg mt-2 leading-relaxed">
                        {row.tip}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs font-mono text-amber-600 dark:text-amber-400">
                {squareMode === 'missingLeg'
                  ? 'Hypotenuse / Diagonal (C) must be strictly greater than Known Leg (B) so √(C² - B²) > 0.'
                  : 'Enter positive Side A and Side B dimensions above to compute true diagonals.'}
              </p>
            )}
          </div>

          {/* 2. LIVE 1:1 CAD DIAGRAM & 3. 5-STEP RED SEAL MATH TEACHER */}
          <SquaringCadAndTeacher calc={calc} squareMode={squareMode} cadSectionRef={cadSectionRef} />
        </div>
      </div>
    </div>
  )
}




function formatWallHyphenIn(valIn) {
  if (!Number.isFinite(valIn) || valIn <= 0) return '0"'
  const total16 = Math.round(valIn * 16)
  const whole = Math.floor(total16 / 16)
  const rem = total16 % 16
  if (rem === 0) return `${whole}"`
  const g = gcd(rem, 16)
  const num = rem / g
  const den = 16 / g
  return whole > 0 ? `${whole}-${num}/${den}"` : `${num}/${den}"`
}

function WallMetricDimInput({
  label,
  badge,
  value,
  onChange,
  metricSubUnit = 'm',
  min = '0',
  step
}) {
  const rawNum = parseFloat(value)
  const valid = Number.isFinite(rawNum)
  const valM = valid ? (metricSubUnit === 'mm' ? rawNum / 1000 : rawNum) : 0
  const valIn = valM / 0.0254
  const defaultStep = step || (metricSubUnit === 'mm' ? '1' : '0.005')

  return (
    <div className="flex flex-col space-y-1">
      <div className="flex flex-wrap items-center justify-between gap-1 px-0.5">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-teal-600 dark:text-teal-400">
            {label}
          </span>
          {badge && (
            <span className="px-1.5 py-0.5 rounded bg-teal-500/15 border border-teal-500/30 text-[9px] font-mono font-extrabold text-teal-700 dark:text-teal-300">
              {badge}
            </span>
          )}
        </div>
        {valid && (
          <span className="text-[10px] font-mono font-bold text-teal-600 dark:text-teal-300 ml-auto tabular-nums">
            = {valM.toFixed(3)} m ({Math.round(valM * 1000).toLocaleString('en-US')} mm) • {formatSurveyFeetInches(valIn)}
          </span>
        )}
      </div>
      <div className="relative">
        <input
          type="number"
          min={min}
          step={defaultStep}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl pl-3 pr-11 py-2 text-sm md:text-base font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 transition-colors"
        />
        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono font-extrabold text-slate-400 uppercase pointer-events-none">
          {metricSubUnit}
        </span>
      </div>
    </div>
  )
}

function WallImperialDimInput({
  label,
  badge,
  feetVal,
  setFeetVal,
  inVal,
  setInVal,
  sixVal,
  setSixVal
}) {
  const computedIn =
    Math.max(0, parseFloat(feetVal) || 0) * 12 +
    Math.max(0, parseFloat(inVal) || 0) +
    Math.max(0, parseFloat(sixVal) || 0) / 16
  const computedM = computedIn * 0.0254

  return (
    <div className="space-y-1.5">
      <div className="flex flex-wrap items-center justify-between gap-1.5">
        <div className="flex items-center gap-1.5">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">
            {label}
          </label>
          {badge && (
            <span className="px-1.5 py-0.5 rounded bg-teal-500/15 border border-teal-500/30 text-[9px] font-mono font-extrabold text-teal-700 dark:text-teal-300">
              {badge}
            </span>
          )}
        </div>
        {Number.isFinite(computedIn) && (
          <span className="text-[10px] sm:text-[11px] font-mono font-bold text-teal-600 dark:text-teal-300 ml-auto tabular-nums">
            = {formatSurveyFeetInches(computedIn)} ({computedIn.toFixed(1)}&quot;) • {computedM.toFixed(3)} m
          </span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        <div className="flex flex-col">
          <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-1 px-1">
            FEET (&apos;)
          </span>
          <div className="relative">
            <input
              type="number"
              min="0"
              placeholder="0"
              value={feetVal}
              onChange={(e) => setFeetVal(e.target.value)}
              className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl pl-3 pr-8 py-2 text-sm md:text-base font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 transition-colors"
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono font-extrabold text-slate-400 pointer-events-none">
              FT
            </span>
          </div>
        </div>

        <div className="flex flex-col">
          <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-1 px-1">
            INCHES (&quot;)
          </span>
          <div className="relative">
            <input
              type="number"
              min="0"
              placeholder="0"
              value={inVal}
              onChange={(e) => setInVal(e.target.value)}
              className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl pl-3 pr-8 py-2 text-sm md:text-base font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 transition-colors"
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono font-extrabold text-slate-400 pointer-events-none">
              IN
            </span>
          </div>
        </div>

        <div className="flex flex-col">
          <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-1 px-1">
            16THS (/16)
          </span>
          <div className="relative">
            <input
              type="number"
              min="0"
              max="15"
              step="1"
              placeholder="0"
              value={sixVal}
              onChange={(e) => setSixVal(e.target.value)}
              className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl pl-3 pr-9 py-2 text-sm md:text-base font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 transition-colors"
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono font-extrabold text-slate-400 pointer-events-none">
              /16
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function WallFramingCadSvg({ calc, wallMode }) {
  if (!calc) return null

  return (
    <div className="bg-[#0a192f] border border-slate-700/90 rounded-xl overflow-hidden shadow-lg shrink-0">
      <div className="px-3 py-1.5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between gap-2">
        <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-teal-400">
          {wallMode === 'lintel'
            ? 'LIVE 1:1 CAD ROUGH OPENING, 2-PLY HEADER & JACK ELEVATION'
            : wallMode === 'sheathing'
            ? 'LIVE 1:1 CAD 4\'×8\' SHEATHING GRID & NBC NAILING PATTERN'
            : 'LIVE 1:1 CAD FRAMED WALL ELEVATION (PLATES, STUDS & R.O.)'}
        </span>
        <span className="text-[10px] font-mono font-bold text-slate-400 shrink-0 whitespace-nowrap">
          {wallMode === 'sheathing'
            ? `${calc.sheetLabelImp} (${calc.sheetLabelMet})`
            : `${calc.ocIn}" (${calc.ocMm}MM) O.C.`}
        </span>
      </div>

      {wallMode === 'sheathing' ? (
        <svg viewBox="0 0 360 175" className="w-full h-auto min-h-[175px] block shrink-0">
          <defs>
            <pattern id="wallSheathGrid" width="18" height="18" patternUnits="userSpaceOnUse">
              <path d="M 18 0 L 0 0 0 18" fill="none" stroke="#172a46" strokeWidth="0.65" />
            </pattern>
            <pattern id="roDeductHatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="8" stroke="#f43f5e" strokeWidth="1.4" opacity="0.55" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="360" height="175" fill="#0a192f" />
          <rect x="0" y="0" width="360" height="175" fill="url(#wallSheathGrid)" />

          {/* Wall Perimeter Frame (x=24..336, y=34..138) */}
          <rect x="24" y="34" width="312" height="104" fill="#0f172a" stroke="#64748b" strokeWidth="1.4" />

          {/* 4' (1220mm) Vertical OSB / Plywood Sheathing Columns */}
          {[24, 102, 180, 258].map((px, idx) => (
            <g key={px}>
              <rect
                x={px}
                y="34"
                width="78"
                height="104"
                fill="#f59e0b"
                fillOpacity={idx === 0 ? '0.22' : '0.13'}
                stroke="#fbbf24"
                strokeWidth="1.5"
              />
              {/* Intermediate O.C. Stud Dashed Lines Behind Panel */}
              <line x1={px + 26} y1="34" x2={px + 26} y2="138" stroke="#38bdf8" strokeWidth="0.9" strokeDasharray="3 2.5" opacity="0.55" />
              <line x1={px + 52} y1="34" x2={px + 52} y2="138" stroke="#38bdf8" strokeWidth="0.9" strokeDasharray="3 2.5" opacity="0.55" />
            </g>
          ))}

          {/* NBC 9.23.3.5 Nailing Pattern Highlight on First Panel (6"/150mm Edge Cyan Dots, 12"/300mm Field Amber Dots) */}
          {[37, 49, 61, 73, 85, 97, 109, 121, 135].map((ny) => (
            <g key={`edge-${ny}`}>
              <circle cx="26.5" cy={ny} r="1.6" fill="#22d3ee" />
              <circle cx="99.5" cy={ny} r="1.6" fill="#22d3ee" />
            </g>
          ))}
          {[43, 63, 83, 103, 123].map((ny) => (
            <g key={`field-${ny}`}>
              <circle cx="50" cy={ny} r="1.5" fill="#fde047" />
              <circle cx="76" cy={ny} r="1.5" fill="#fde047" />
            </g>
          ))}

          {/* Rough Opening Deduction Cutout Zone on Right Panels (x=196..312, y=54..116) */}
          <rect x="196" y="54" width="116" height="62" fill="#06101f" stroke="#fb7185" strokeWidth="1.5" strokeDasharray="4 2" />
          <rect x="196" y="54" width="116" height="62" fill="url(#roDeductHatch)" />

          {/* Leader Lines to Top & Bottom Callouts */}
          <line x1="63" y1="34" x2="63" y2="20" stroke="#fbbf24" strokeWidth="1.1" strokeDasharray="2 2" />
          <line x1="254" y1="54" x2="254" y2="20" stroke="#34d399" strokeWidth="1.1" strokeDasharray="2 2" />
          <line x1="50" y1="138" x2="50" y2="152" stroke="#22d3ee" strokeWidth="1.1" strokeDasharray="2 2" />
          <line x1="296" y1="138" x2="296" y2="152" stroke="#fde047" strokeWidth="1.1" strokeDasharray="2 2" />

          {/* Opaque fill="#0a192f" Dual-Unit Callout Pills Drawn AFTER All Geometry */}
          <StairSvgPill
            x={6}
            y={13}
            align="start"
            maxWidth={172}
            text={`GROSS: ${calc.grossSheetsNet} SHTS (${calc.grossAreaSqFt.toFixed(0)}FT²/${calc.grossAreaSqM.toFixed(1)}M²)`}
            fontSize={6.3}
            color="#fde68a"
            borderColor="#d97706"
          />
          <StairSvgPill
            x={354}
            y={13}
            align="end"
            maxWidth={172}
            text={`NET: ${calc.netSheetsNet} SHTS (${calc.netAreaSqFt.toFixed(0)}FT²/${calc.netAreaSqM.toFixed(1)}M²)`}
            fontSize={6.3}
            color="#6ee7b7"
            borderColor="#059669"
          />
          <StairSvgPill
            x={30}
            y={86}
            align="start"
            maxWidth={142}
            text={`PANEL: ${calc.sheetLabelImp} (${calc.sheetSqFt}FT²/${calc.sheetSqM.toFixed(2)}M²)`}
            fontSize={6.3}
            color="#fef08a"
            borderColor="#eab308"
          />
          <StairSvgPill
            x={254}
            y={85}
            align="middle"
            maxWidth={112}
            text={`R.O.: -${calc.deductCandidateSqFt.toFixed(0)}FT² (-${calc.deductCandidateSqM.toFixed(1)}M²)`}
            fontSize={6.3}
            color="#fda4af"
            borderColor="#e11d48"
          />
          <StairSvgPill
            x={6}
            y={159}
            align="start"
            maxWidth={182}
            text="NBC: 6&quot;(150MM) EDGE / 12&quot;(300MM) FIELD"
            fontSize={6.2}
            color="#67e8f9"
            borderColor="#0891b2"
          />
          <StairSvgPill
            x={354}
            y={159}
            align="end"
            maxWidth={166}
            text={`~${calc.nailsPerSheet}/SHT ➔ ~${calc.totalNails.toLocaleString('en-US')} NAILS`}
            fontSize={6.3}
            color="#5eead4"
            borderColor="#0d9488"
          />
        </svg>
      ) : wallMode === 'lintel' ? (
        <svg viewBox="0 0 360 175" className="w-full h-auto min-h-[175px] block shrink-0">
          <defs>
            <pattern id="wallLintelGrid" width="18" height="18" patternUnits="userSpaceOnUse">
              <path d="M 18 0 L 0 0 0 18" fill="none" stroke="#172a46" strokeWidth="0.65" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="360" height="175" fill="#0a192f" />
          <rect x="0" y="0" width="360" height="175" fill="url(#wallLintelGrid)" />

          {/* Subfloor Line */}
          <line x1="24" y1="141" x2="336" y2="141" stroke="#475569" strokeWidth="1.2" strokeDasharray="4 2" />

          {/* Double Top Plate (2 × 1-1/2" = 3" / 76mm) */}
          <rect x="36" y="32" width="288" height="5" fill="#1e293b" stroke="#fbbf24" strokeWidth="1.2" />
          <rect x="36" y="37" width="288" height="5" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.2" />

          {/* Bottom Sole Plate (Split/Dashed across threshold if Door R.O.) */}
          {calc.roType === 'door' ? (
            <>
              <rect x="36" y="135" width="76" height="5" fill="#1e293b" stroke="#fbbf24" strokeWidth="1.2" />
              <rect x="112" y="135" width="136" height="5" fill="none" stroke="#fb7185" strokeWidth="1.1" strokeDasharray="3 2" />
              <rect x="248" y="135" width="76" height="5" fill="#1e293b" stroke="#fbbf24" strokeWidth="1.2" />
            </>
          ) : (
            <rect x="36" y="135" width="288" height="5" fill="#1e293b" stroke="#fbbf24" strokeWidth="1.2" />
          )}

          {/* Flanking Common Studs */}
          <rect x="52" y="42" width="5" height="93" fill="#0f766e" stroke="#2dd4bf" strokeWidth="1" opacity="0.65" />
          <rect x="303" y="42" width="5" height="93" fill="#0f766e" stroke="#2dd4bf" strokeWidth="1" opacity="0.65" />

          {/* Left & Right Full-Height King Studs */}
          <rect x="96" y="42" width="6" height="93" fill="#1d4ed8" stroke="#60a5fa" strokeWidth="1.2" />
          <rect x="258" y="42" width="6" height="93" fill="#1d4ed8" stroke="#60a5fa" strokeWidth="1.2" />

          {/* Left & Right Jack (Trimmer) Studs (1 or 2 per side) */}
          <rect x="102" y="64" width="5" height="71" fill="#6d28d9" stroke="#c084fc" strokeWidth="1.1" />
          {calc.jacksPerSide === 2 && (
            <rect x="107" y="64" width="5" height="71" fill="#7c3aed" stroke="#d8b4fe" strokeWidth="1.1" />
          )}
          <rect x="253" y="64" width="5" height="71" fill="#6d28d9" stroke="#c084fc" strokeWidth="1.1" />
          {calc.jacksPerSide === 2 && (
            <rect x="248" y="64" width="5" height="71" fill="#7c3aed" stroke="#d8b4fe" strokeWidth="1.1" />
          )}

          {/* 2-Ply Structural Header / Lintel Spanning Over Jacks (x=102..258, y=50..64) */}
          <rect x="102" y="50" width="156" height="14" fill="#78350f" stroke="#fbbf24" strokeWidth="1.5" />
          <line x1="102" y1="50" x2="258" y2="64" stroke="#fbbf24" strokeWidth="1" opacity="0.65" />
          <line x1="102" y1="64" x2="258" y2="50" stroke="#fbbf24" strokeWidth="1" opacity="0.65" />

          {/* Top Header Cripples (y=42..50) */}
          {[140, 180, 220].map((cx) => (
            <rect key={`tc-${cx}`} x={cx - 2} y="42" width="4" height="8" fill="#0f766e" stroke="#5eead4" strokeWidth="1" />
          ))}

          {/* R.O. Void + Window Sill & Bottom Cripples */}
          {calc.roType === 'door' ? (
            <rect
              x={calc.jacksPerSide === 2 ? 112 : 107}
              y="64"
              width={calc.jacksPerSide === 2 ? 136 : 146}
              height="76"
              fill="#06101f"
              stroke="#38bdf8"
              strokeWidth="1.2"
              strokeDasharray="4 2"
            />
          ) : (
            <>
              <rect
                x={calc.jacksPerSide === 2 ? 112 : 107}
                y="64"
                width={calc.jacksPerSide === 2 ? 136 : 146}
                height="42"
                fill="#06101f"
                stroke="#38bdf8"
                strokeWidth="1.2"
                strokeDasharray="4 2"
              />
              {/* Rough Sill Plate */}
              <rect
                x={calc.jacksPerSide === 2 ? 112 : 107}
                y="106"
                width={calc.jacksPerSide === 2 ? 136 : 146}
                height="5"
                fill="#1e293b"
                stroke="#fbbf24"
                strokeWidth="1.2"
              />
              {/* Bottom Sill Cripples */}
              {[140, 180, 220].map((cx) => (
                <rect key={`bc-${cx}`} x={cx - 2} y="111" width="4" height="24" fill="#0f766e" stroke="#5eead4" strokeWidth="1" />
              ))}
            </>
          )}

          {/* Dimension Arrows & Leader Lines */}
          {/* Jack Cut Left Vertical Arrow */}
          <line x1="84" y1="64" x2="84" y2="135" stroke="#c084fc" strokeWidth="1.4" />
          <polygon points="84,64 81.8,69 86.2,69" fill="#c084fc" />
          <polygon points="84,135 81.8,130 86.2,130" fill="#c084fc" />

          {/* King Cut Right Vertical Arrow */}
          <line x1="276" y1="42" x2="276" y2="135" stroke="#60a5fa" strokeWidth="1.4" />
          <polygon points="276,42 273.8,47 278.2,47" fill="#60a5fa" />
          <polygon points="276,135 273.8,130 278.2,130" fill="#60a5fa" />
          <line x1="276" y1="42" x2="276" y2="20" stroke="#60a5fa" strokeWidth="1.1" strokeDasharray="2 2" />

          {/* Header Cut Leader */}
          <line x1="130" y1="50" x2="130" y2="20" stroke="#fbbf24" strokeWidth="1.1" strokeDasharray="2 2" />
          {/* Cripple & Sill Leaders */}
          <line x1="140" y1="135" x2="140" y2="152" stroke="#5eead4" strokeWidth="1.1" strokeDasharray="2 2" />
          <line x1="230" y1="111" x2="280" y2="152" stroke="#fbbf24" strokeWidth="1.1" strokeDasharray="2 2" />

          {/* Opaque fill="#0a192f" Dual-Unit Callout Pills Drawn AFTER All Geometry */}
          <StairSvgPill
            x={6}
            y={13}
            align="start"
            maxWidth={178}
            text={`HDR (${calc.headerSize}): ${formatWallHyphenIn(calc.headerCutIn)} (${calc.headerCutMm}MM)`}
            fontSize={6.3}
            color="#fde68a"
            borderColor="#d97706"
          />
          <StairSvgPill
            x={354}
            y={13}
            align="end"
            maxWidth={168}
            text={`KING (2X): ${calc.studCutDualShort}`}
            fontSize={6.3}
            color="#93c5fd"
            borderColor="#2563eb"
          />
          <StairSvgPill
            x={6}
            y={98}
            align="start"
            maxWidth={102}
            text={`JACK: ${formatWallHyphenIn(calc.jackCutIn)}`}
            fontSize={6.2}
            color="#e9d5ff"
            borderColor="#9333ea"
          />
          <StairSvgPill
            x={180}
            y={85}
            align="middle"
            maxWidth={126}
            text={`R.O.: ${formatSurveyFeetInches(calc.roWInTotal)}×${formatSurveyFeetInches(calc.roHInTotal)}`}
            fontSize={6.3}
            color="#67e8f9"
            borderColor="#0891b2"
          />
          <StairSvgPill
            x={6}
            y={159}
            align="start"
            maxWidth={184}
            text={`CRIPPLES (${calc.ocIn}"/${calc.ocMm}MM): ${calc.svgCrippleShort}`}
            fontSize={6.2}
            color="#5eead4"
            borderColor="#0d9488"
          />
          <StairSvgPill
            x={354}
            y={159}
            align="end"
            maxWidth={164}
            text={calc.svgSillShort}
            fontSize={6.2}
            color="#fde68a"
            borderColor="#d97706"
          />
        </svg>
      ) : (
        <svg viewBox="0 0 360 175" className="w-full h-auto min-h-[175px] block shrink-0">
          <defs>
            <pattern id="wallCadGrid" width="18" height="18" patternUnits="userSpaceOnUse">
              <path d="M 18 0 L 0 0 0 18" fill="none" stroke="#172a46" strokeWidth="0.65" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="360" height="175" fill="#0a192f" />
          <rect x="0" y="0" width="360" height="175" fill="url(#wallCadGrid)" />

          {/* Subfloor Baseline Reference */}
          <line x1="18" y1="141" x2="342" y2="141" stroke="#475569" strokeWidth="1.2" strokeDasharray="4 2" />

          {/* Double Top Plate (2 × 1-1/2" = 3" / 76mm) */}
          <rect x="26" y="32" width="308" height="5" fill="#1e293b" stroke="#fbbf24" strokeWidth="1.2" />
          <rect x="26" y="37" width="308" height="5" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.2" />

          {/* Single Bottom Sole Plate (1-1/2" / 38mm) */}
          <rect x="26" y="135" width="308" height="5" fill="#1e293b" stroke="#fbbf24" strokeWidth="1.2" />

          {/* Left 3-Stud Exterior Corner Post (x=26..40) */}
          <rect x="26" y="42" width="4" height="93" fill="#065f46" stroke="#34d399" strokeWidth="1" />
          <rect x="31" y="42" width="4" height="93" fill="#065f46" stroke="#34d399" strokeWidth="1" />
          <rect x="36" y="42" width="4" height="93" fill="#065f46" stroke="#34d399" strokeWidth="1" />

          {/* Common Studs at O.C. Spacing (x=66, 94, 122, 150, 178) */}
          {[66, 94, 122, 150, 178].map((sx) => (
            <rect
              key={sx}
              x={sx}
              y="42"
              width="4"
              height="93"
              fill="#0f766e"
              stroke="#2dd4bf"
              strokeWidth="1"
            />
          ))}

          {/* Vertical Stud Cut Dimension Arrow */}
          <line x1="110" y1="42" x2="110" y2="135" stroke="#22d3ee" strokeWidth="1.5" />
          <polygon points="110,42 107.5,47.5 112.5,47.5" fill="#22d3ee" />
          <polygon points="110,135 107.5,129.5 112.5,129.5" fill="#22d3ee" />

          {/* Horizontal O.C. Spacing Arrow */}
          <line x1="68" y1="125" x2="96" y2="125" stroke="#38bdf8" strokeWidth="1.3" />
          <polygon points="68,125 72.5,123 72.5,127" fill="#38bdf8" />
          <polygon points="96,125 91.5,123 91.5,127" fill="#38bdf8" />
          <line x1="82" y1="125" x2="82" y2="152" stroke="#38bdf8" strokeWidth="1" strokeDasharray="2 2" />

          {/* Framed Rough Opening on Right (x=202..282) */}
          <rect x="202" y="42" width="4" height="93" fill="#1d4ed8" stroke="#60a5fa" strokeWidth="1" />
          <rect x="278" y="42" width="4" height="93" fill="#1d4ed8" stroke="#60a5fa" strokeWidth="1" />
          <rect x="206" y="60" width="4" height="75" fill="#6d28d9" stroke="#c084fc" strokeWidth="1" />
          <rect x="274" y="60" width="4" height="75" fill="#6d28d9" stroke="#c084fc" strokeWidth="1" />
          <rect x="206" y="49" width="72" height="11" fill="#78350f" stroke="#fbbf24" strokeWidth="1.4" />
          <line x1="206" y1="49" x2="278" y2="60" stroke="#fbbf24" strokeWidth="0.9" opacity="0.65" />
          <line x1="206" y1="60" x2="278" y2="49" stroke="#fbbf24" strokeWidth="0.9" opacity="0.65" />
          <rect x="228" y="42" width="3.5" height="7" fill="#0f766e" stroke="#5eead4" strokeWidth="0.9" />
          <rect x="252" y="42" width="3.5" height="7" fill="#0f766e" stroke="#5eead4" strokeWidth="0.9" />
          <rect x="210" y="60" width="64" height="43" fill="#06101f" stroke="#38bdf8" strokeWidth="1.1" strokeDasharray="3 2" />
          <rect x="210" y="103" width="64" height="5" fill="#1e293b" stroke="#fbbf24" strokeWidth="1.1" />
          <rect x="228" y="108" width="3.5" height="27" fill="#0f766e" stroke="#5eead4" strokeWidth="0.9" />
          <rect x="252" y="108" width="3.5" height="27" fill="#0f766e" stroke="#5eead4" strokeWidth="0.9" />

          {/* Right End Studs + Dashed 4'×8' Exterior Sheathing Panel Overlay */}
          <rect x="304" y="42" width="4" height="93" fill="#0f766e" stroke="#2dd4bf" strokeWidth="0.9" opacity="0.55" />
          <rect x="330" y="42" width="4" height="93" fill="#065f46" stroke="#34d399" strokeWidth="1" />
          <rect
            x="286"
            y="32"
            width="48"
            height="108"
            fill="#f59e0b"
            fillOpacity="0.16"
            stroke="#fbbf24"
            strokeWidth="1.7"
            strokeDasharray="4 2.5"
          />
          <line x1="286" y1="32" x2="334" y2="140" stroke="#fbbf24" strokeWidth="0.8" strokeDasharray="2 3" opacity="0.45" />

          {/* Leader Lines */}
          <line x1="78" y1="32" x2="78" y2="20" stroke="#fbbf24" strokeWidth="1.1" strokeDasharray="2 2" />
          <line x1="310" y1="32" x2="310" y2="20" stroke="#fbbf24" strokeWidth="1.1" strokeDasharray="2 2" />
          <line x1="260" y1="140" x2="260" y2="152" stroke="#5eead4" strokeWidth="1.1" strokeDasharray="2 2" />

          {/* Opaque fill="#0a192f" Dual-Unit Callout Pills */}
          <StairSvgPill
            x={6}
            y={13}
            align="start"
            maxWidth={172}
            text={calc.svgTopLeftPill}
            fontSize={6.5}
            color="#fde68a"
            borderColor="#d97706"
          />
          <StairSvgPill
            x={354}
            y={13}
            align="end"
            maxWidth={174}
            text={`${calc.sheetsNet} SHEETS (${calc.areaSqFtStr} FT² / ${calc.areaSqMStr} M²)`}
            fontSize={6.5}
            color="#fef08a"
            borderColor="#eab308"
          />
          <StairSvgPill
            x={44}
            y={79}
            align="start"
            maxWidth={152}
            text={`STUD CUT: ${calc.studCutDualShort}`}
            fontSize={6.5}
            color="#67e8f9"
            borderColor="#0891b2"
          />
          <StairSvgPill
            x={242}
            y={81}
            align="middle"
            maxWidth={96}
            text={calc.svgRoMidPill}
            fontSize={6.3}
            color="#e9d5ff"
            borderColor="#9333ea"
          />
          <StairSvgPill
            x={6}
            y={159}
            align="start"
            maxWidth={176}
            text={calc.svgBottomLeftPill}
            fontSize={6.5}
            color="#5eead4"
            borderColor="#0d9488"
          />
          <StairSvgPill
            x={354}
            y={159}
            align="end"
            maxWidth={172}
            text={calc.svgBottomRightPill}
            fontSize={6.5}
            color="#6ee7b7"
            borderColor="#059669"
          />
        </svg>
      )}
    </div>
  )
}

function WallFramingCadAndTeacher({ calc, wallMode, cadSectionRef }) {
  const teacherSubtitle =
    wallMode === 'sheathing'
      ? '5-STEP SHEATHING, GROSS VS. NET & NBC NAILING TEACHER (IMPERIAL + METRIC)'
      : wallMode === 'lintel'
      ? '5-STEP HEADER, JACK, KING, SILL & CRIPPLE TEACHER (IMPERIAL + METRIC)'
      : '5-STEP STUDS, PLATES & CUT LENGTH TEACHER (IMPERIAL + METRIC)'

  return (
    <div ref={cadSectionRef} className="space-y-4 shrink-0 scroll-mt-2">
      {/* 3. MODE-SPECIFIC LIVE 1:1 CAD DIAGRAM */}
      <WallFramingCadSvg calc={calc} wallMode={wallMode} />

      {/* 4. MODE-SPECIFIC "HOW TO DO THE MATH (RED SEAL STEP-BY-STEP TEACHER)" — 5 DUAL-UNIT CARDS */}
      <div className="bg-slate-950 border border-teal-500/35 rounded-xl overflow-hidden shadow-lg shrink-0">
        <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-teal-500/15 border border-teal-500/30 text-teal-400 shrink-0">
            <BookOpen size={16} />
          </div>
          <div>
            <h4 className="text-xs font-extrabold text-teal-400 uppercase tracking-wider leading-tight">
              HOW TO DO THE MATH (RED SEAL STEP-BY-STEP TEACHER)
            </h4>
            <p className="text-[10px] font-mono font-bold text-teal-300/90 uppercase tracking-widest mt-0.5">
              {teacherSubtitle}
            </p>
          </div>
        </div>

        <div className="p-3.5 sm:p-4 space-y-3 text-xs text-slate-300 leading-relaxed">
          {!calc ? (
            <p className="text-slate-400 font-mono text-xs">
              Enter valid positive dimensions above to populate live Imperial + Metric Red Seal walkthrough steps.
            </p>
          ) : wallMode === 'sheathing' ? (
            <>
              {/* SHEATHING STEP 1: Gross Wall Surface Area */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 space-y-1.5 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-300 text-[11px] font-mono font-extrabold flex items-center justify-center shrink-0">
                    1
                  </span>
                  <span className="font-bold text-white uppercase tracking-wide text-[11px] sm:text-xs">
                    Calculate Gross Wall Surface Area (Length × Height)
                  </span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Multiply continuous framed wall perimeter length by total wall height in both unit systems:
                </p>
                <div className="bg-slate-950 border border-slate-800/90 rounded-lg p-2.5 font-mono text-[11px] space-y-1 tabular-nums">
                  <div>
                    • <span className="text-teal-300">Imperial Area:</span> {calc.lenFtDec.toFixed(2)}&apos; ({formatSurveyFeetInches(calc.lenIn)}) × {calc.hFtDec.toFixed(2)}&apos; ({formatSurveyFeetInches(calc.hIn)}) ={' '}
                    <span className="font-bold text-white">{calc.grossAreaSqFt.toFixed(1)} ft²</span>
                  </div>
                  <div>
                    • <span className="text-cyan-300">Metric Area:</span> {calc.lenM.toFixed(3)} m × {calc.hM.toFixed(3)} m ={' '}
                    <span className="font-bold text-cyan-300">{calc.grossAreaSqM.toFixed(2)} m²</span>
                  </div>
                </div>
              </div>

              {/* SHEATHING STEP 2: Gross vs. Net Area (Exam Deduction Rule) */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 space-y-1.5 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-300 text-[11px] font-mono font-extrabold flex items-center justify-center shrink-0">
                    2
                  </span>
                  <span className="font-bold text-white uppercase tracking-wide text-[11px] sm:text-xs">
                    Gross Area vs. Net Area (When to Deduct Window/Door Openings)
                  </span>
                </div>
                <div className="bg-slate-950 border border-slate-800/90 rounded-lg p-2.5 font-mono text-[11px] space-y-1 tabular-nums">
                  <div>
                    • <span className="text-amber-300">Gross Area (No Deduct — Exam Default):</span>{' '}
                    <span className="text-white font-bold">{calc.grossAreaSqFt.toFixed(1)} ft² ({calc.grossAreaSqM.toFixed(2)} m²)</span>
                  </div>
                  <div>
                    • <span className="text-emerald-300">Net Area (Deducting R.O.s):</span>{' '}
                    {calc.grossAreaSqFt.toFixed(1)} ft² - {calc.deductCandidateSqFt.toFixed(1)} ft² ({calc.deductCandidateSqM.toFixed(2)} m²) ={' '}
                    <span className="text-emerald-300 font-bold">{calc.netAreaSqFt.toFixed(1)} ft² ({calc.netAreaSqM.toFixed(2)} m²)</span>
                  </div>
                </div>
                <p className="text-[11px] text-amber-300/95 font-medium">
                  Teacher Rule: On the Red Seal exam, do NOT deduct standard window/door openings for exterior structural sheathing unless the question explicitly specifies &quot;Net Area&quot; or openings &gt; 32 ft² (1 full sheet), because cut-outs are often wasted or used for headers/band joists.
                </p>
              </div>

              {/* SHEATHING STEP 3: Single Panel Area */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 space-y-1.5 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-300 text-[11px] font-mono font-extrabold flex items-center justify-center shrink-0">
                    3
                  </span>
                  <span className="font-bold text-white uppercase tracking-wide text-[11px] sm:text-xs">
                    Calculate Single Panel Area (4&apos;×8&apos; vs. 4&apos;×9&apos; Sheets)
                  </span>
                </div>
                <div className="bg-slate-950 border border-slate-800/90 rounded-lg p-2.5 font-mono text-[11px] space-y-1 tabular-nums">
                  <div>
                    • <span className="text-teal-300">4&apos;×8&apos; Standard Panel:</span> 4&apos; × 8&apos; = <strong className="text-white">32.0 ft²</strong> • 1.220m × 2.440m = <strong className="text-cyan-300">2.977 m²</strong> (2.973 m² soft)
                  </div>
                  <div>
                    • <span className="text-purple-300">4&apos;×9&apos; Tall-Wall Panel:</span> 4&apos; × 9&apos; = <strong className="text-white">36.0 ft²</strong> • 1.220m × 2.745m = <strong className="text-purple-300">3.349 m²</strong> (3.345 m² soft)
                  </div>
                  <div className="pt-1 border-t border-slate-800/80 text-slate-300">
                    • <span className="text-slate-400">Vertical 4&apos; (1.22m) Panel Columns:</span> Ceil({calc.lenFtDec.toFixed(1)}&apos; ÷ 4&apos;) ={' '}
                    <span className="text-white font-bold">{calc.panelColumns} Columns along {formatSurveyFeetInches(calc.lenIn)}</span>
                  </div>
                </div>
              </div>

              {/* SHEATHING STEP 4: Divide Wall Area by Panel Area & Round UP */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 space-y-1.5 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-300 text-[11px] font-mono font-extrabold flex items-center justify-center shrink-0">
                    4
                  </span>
                  <span className="font-bold text-white uppercase tracking-wide text-[11px] sm:text-xs">
                    Divide Wall Area by Panel Area &amp; Round UP (+ Waste %)
                  </span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Always round partial sheets <strong className="text-white">UP (`Ceil`)</strong> to whole panels, then apply waste ({calc.wastePct}%):
                </p>
                <div className="bg-slate-950 border border-slate-800/90 rounded-lg p-2.5 font-mono text-[11px] space-y-1 tabular-nums">
                  <div>
                    • <span className="text-amber-300">Gross Takeoff:</span> Ceil({calc.grossAreaSqFt.toFixed(1)} ft² ÷ {calc.sheetSqFt} ft²) ={' '}
                    <span className="font-bold text-white">{calc.grossSheetsNet} Sheets Net</span>
                    {calc.wastePct > 0 && (
                      <span className="text-amber-300 font-bold"> ➔ {calc.grossSheetsWaste} Sheets w/ +{calc.wastePct}%</span>
                    )}
                  </div>
                  <div>
                    • <span className="text-emerald-300">Net Takeoff:</span> Ceil({calc.netAreaSqFt.toFixed(1)} ft² ÷ {calc.sheetSqFt} ft²) ={' '}
                    <span className="font-bold text-white">{calc.netSheetsNet} Sheets Net</span>
                    {calc.wastePct > 0 && (
                      <span className="text-emerald-300 font-bold"> ➔ {calc.netSheetsWaste} Sheets w/ +{calc.wastePct}%</span>
                    )}
                  </div>
                </div>
              </div>

              {/* SHEATHING STEP 5: NBC 9.23.3.5 Sheathing Fastener Spacing */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 space-y-1.5 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-300 text-[11px] font-mono font-extrabold flex items-center justify-center shrink-0">
                    5
                  </span>
                  <span className="font-bold text-white uppercase tracking-wide text-[11px] sm:text-xs">
                    NBC 9.23.3.5 Sheathing Fastener Spacing (6&quot; Edge / 12&quot; Field)
                  </span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  National Building Code requires nails/screws at <strong className="text-white">6&quot; (150 mm) O.C.</strong> along all supported panel edges and <strong className="text-white">12&quot; (300 mm) O.C.</strong> along intermediate field studs ({calc.ocIn}&quot; / {calc.ocMm} mm O.C.):
                </p>
                <div className="bg-slate-950 border border-slate-800/90 rounded-lg p-2.5 font-mono text-[11px] space-y-1 tabular-nums">
                  <div>
                    • <span className="text-cyan-300">Per {calc.sheetLabelImp} Sheet:</span> {calc.edgeNailsPerSheet} Perimeter Edge Nails (6&quot;/150mm) + {calc.fieldNailsPerSheet} Field Nails (12&quot;/300mm) ={' '}
                    <span className="text-white font-bold">~{calc.nailsPerSheet} Nails/Sheet</span>
                  </div>
                  <div>
                    • <span className="text-teal-300">Total Fasteners ({calc.activeOrderSheets} Sheets):</span> {calc.activeOrderSheets} × {calc.nailsPerSheet} ={' '}
                    <span className="text-amber-300 font-bold">~{calc.totalNails.toLocaleString('en-US')} Nails Total</span>{' '}
                    <span className="text-slate-400">(min 2&quot; / 51mm common or ring-shank)</span>
                  </div>
                </div>
              </div>
            </>
          ) : wallMode === 'lintel' ? (
            <>
              {/* LINTEL STEP 1: Exact Header / Lintel Cut Length */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 space-y-1.5 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-300 text-[11px] font-mono font-extrabold flex items-center justify-center shrink-0">
                    1
                  </span>
                  <span className="font-bold text-white uppercase tracking-wide text-[11px] sm:text-xs">
                    Calculate Exact Header / Lintel Cut Length (R.O. Width + Jack Studs)
                  </span>
                </div>
                <div className="bg-slate-950 border border-slate-800/90 rounded-lg p-2.5 font-mono text-[11px] space-y-1 tabular-nums">
                  <div>
                    <span className="text-slate-400">Formula:</span>{' '}
                    <span className="text-amber-300">Header Cut = R.O. Width + (Total Jack Studs × 1-1/2&quot; [38 mm])</span>
                  </div>
                  <div className="pt-1 border-t border-slate-800/80 text-white">
                    • <span className="text-amber-300">Imperial Live:</span> {calc.roWInTotal.toFixed(1)}&quot; ({formatSurveyFeetInches(calc.roWInTotal)}) + ({calc.totalJacks} Jacks × 1.5&quot;) ={' '}
                    <span className="font-bold text-amber-300">
                      {formatWallHyphenIn(calc.headerCutIn)} ({formatSurveyFeetInches(calc.headerCutIn)})
                    </span>
                  </div>
                  <div className="text-white">
                    • <span className="text-cyan-300">Metric Live:</span> {calc.roWMm.toLocaleString('en-US')} mm + ({calc.totalJacks} × 38.1 mm) ={' '}
                    <span className="font-bold text-cyan-300">
                      {calc.headerCutMm.toLocaleString('en-US')} mm ({(calc.headerCutMm / 1000).toFixed(3)} m)
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-amber-300/95 font-medium">
                  Teacher Rule: Never cut a header to the Rough Opening width! The header sits ON TOP of the Jack (Trimmer) studs and spans from the inside face of the left King stud to the inside face of the right King stud.
                </p>
              </div>

              {/* LINTEL STEP 2: Jack (Trimmer) Stud Cut Length */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 space-y-1.5 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-300 text-[11px] font-mono font-extrabold flex items-center justify-center shrink-0">
                    2
                  </span>
                  <span className="font-bold text-white uppercase tracking-wide text-[11px] sm:text-xs">
                    Calculate Jack (Trimmer) Stud Cut Length (Underside of Header to Sole Plate)
                  </span>
                </div>
                <div className="bg-slate-950 border border-slate-800/90 rounded-lg p-2.5 font-mono text-[11px] space-y-1 tabular-nums">
                  <div>
                    <span className="text-slate-400">Formula:</span>{' '}
                    <span className="text-purple-300">Jack Cut = Head Height above Subfloor - 1-1/2&quot; (38 mm) Sole Plate</span>
                  </div>
                  <div className="pt-1 border-t border-slate-800/80 text-white">
                    • <span className="text-purple-300">Imperial Live:</span> {calc.headUndersideIn.toFixed(1)}&quot; ({formatSurveyFeetInches(calc.headUndersideIn)}) - 1.5&quot; ={' '}
                    <span className="font-bold text-purple-300">
                      {formatWallHyphenIn(calc.jackCutIn)} ({formatSurveyFeetInches(calc.jackCutIn)})
                    </span>
                  </div>
                  <div className="text-white">
                    • <span className="text-cyan-300">Metric Live:</span> {Math.round(calc.headUndersideIn * 25.4).toLocaleString('en-US')} mm - 38 mm ={' '}
                    <span className="font-bold text-cyan-300">
                      {calc.jackCutMm.toLocaleString('en-US')} mm ({calc.totalJacks} Jack Studs Total)
                    </span>
                  </div>
                </div>
              </div>

              {/* LINTEL STEP 3: King Stud Cut Length */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 space-y-1.5 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-300 text-[11px] font-mono font-extrabold flex items-center justify-center shrink-0">
                    3
                  </span>
                  <span className="font-bold text-white uppercase tracking-wide text-[11px] sm:text-xs">
                    Calculate King Stud Cut Length (Wall Height - 3 Plates)
                  </span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Cut <strong className="text-white">2 full-height King Studs</strong> (1 Left, 1 Right) identical to common wall studs by subtracting 1 Sole Plate + 2 Top Plates (4-1/2&quot; / 114 mm):
                </p>
                <div className="bg-slate-950 border border-slate-800/90 rounded-lg p-2.5 font-mono text-[11px] space-y-1 tabular-nums">
                  <div>
                    • <span className="text-cyan-300">Imperial Live:</span> {calc.hIn.toFixed(1)}&quot; ({formatSurveyFeetInches(calc.hIn)}) - 4.5&quot; ={' '}
                    <span className="font-bold text-cyan-300">
                      {formatWallHyphenIn(calc.studCutIn)} ({formatSurveyFeetInches(calc.studCutIn)})
                    </span>
                  </div>
                  <div>
                    • <span className="text-emerald-300">Metric Live:</span> {calc.hMm.toLocaleString('en-US')} mm - 114 mm ={' '}
                    <span className="font-bold text-emerald-300">
                      {calc.studCutMm.toLocaleString('en-US')} mm (2 King Studs)
                    </span>
                  </div>
                </div>
              </div>

              {/* LINTEL STEP 4: Window Rough Sill Plate & Bottom Cripple Studs */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 space-y-1.5 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-300 text-[11px] font-mono font-extrabold flex items-center justify-center shrink-0">
                    4
                  </span>
                  <span className="font-bold text-white uppercase tracking-wide text-[11px] sm:text-xs">
                    Calculate Window Rough Sill Plate &amp; Bottom Cripple Studs
                  </span>
                </div>
                {calc.roType === 'window' ? (
                  <div className="bg-slate-950 border border-slate-800/90 rounded-lg p-2.5 font-mono text-[11px] space-y-1 tabular-nums">
                    <div>
                      • <span className="text-teal-300">Rough Sill Cut (= R.O. Width between Jacks):</span>{' '}
                      <span className="font-bold text-white">
                        {formatWallHyphenIn(calc.sillCutIn)} ({formatSurveyFeetInches(calc.sillCutIn)} • {calc.sillCutMm.toLocaleString('en-US')} mm)
                      </span>
                    </div>
                    <div>
                      • <span className="text-emerald-300">Bottom Cripple Cut (Jack - R.O. H - 1-1/2&quot; Sill):</span>{' '}
                      {calc.jackCutIn.toFixed(1)}&quot; - {calc.roHInTotal.toFixed(1)}&quot; - 1.5&quot; ={' '}
                      <span className="font-bold text-emerald-300">
                        {formatWallHyphenIn(calc.botCrippleCutIn)} ({calc.botCrippleCutMm.toLocaleString('en-US')} mm • {calc.botCrippleQty} pcs)
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-950 border border-slate-800/90 rounded-lg p-2.5 font-mono text-[11px] space-y-1">
                    <div className="text-amber-300 font-bold">
                      • Door Rough Opening Mode: 0 Rough Sill &amp; 0 Bottom Cripples
                    </div>
                    <p className="text-slate-300 font-sans text-[11px]">
                      Frame the continuous bottom sole plate straight across the doorway to hold layout square while tilting the wall up, then saw out the {formatWallHyphenIn(calc.roWInTotal)} ({calc.roWMm.toLocaleString('en-US')} mm) threshold section between the inner Jack studs!
                    </p>
                  </div>
                )}
              </div>

              {/* LINTEL STEP 5: Top Header Cripple Studs */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 space-y-1.5 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-300 text-[11px] font-mono font-extrabold flex items-center justify-center shrink-0">
                    5
                  </span>
                  <span className="font-bold text-white uppercase tracking-wide text-[11px] sm:text-xs">
                    Calculate Top Header Cripple Studs ({calc.ocIn}&quot; / {calc.ocMm}mm O.C.)
                  </span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Subtract Jack Cut Length and dressed Header Depth ({formatWallHyphenIn(calc.hdrDepthIn)} / {calc.hdrDepthMm} mm for {calc.headerSize}) from Full Stud Cut Length:
                </p>
                <div className="bg-slate-950 border border-slate-800/90 rounded-lg p-2.5 font-mono text-[11px] space-y-1 tabular-nums">
                  <div>
                    • <span className="text-teal-300">Top Cripple Cut:</span> {formatWallHyphenIn(calc.studCutIn)} - {formatWallHyphenIn(calc.jackCutIn)} - {formatWallHyphenIn(calc.hdrDepthIn)} ({calc.headerSize}) ={' '}
                    <span className="font-bold text-white">
                      {calc.topCrippleQty > 0
                        ? `${formatWallHyphenIn(calc.topCrippleCutIn)} (${calc.topCrippleCutMm} mm)`
                        : '0" (Tight Header Under Double Top Plate)'}
                    </span>
                  </div>
                  <div>
                    • <span className="text-cyan-300">O.C. Cripple Layout:</span>{' '}
                    <span className="font-bold text-cyan-300">{calc.topCrippleQty} Top Cripples</span> spaced on the wall&apos;s continuous {calc.ocIn}&quot; ({calc.ocMm} mm) O.C. sheathing marks across the {formatSurveyFeetInches(calc.roWInTotal)} opening.
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* STUDS & PLATES STEP 1: Base O.C. Stud Formula */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 space-y-1.5 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-300 text-[11px] font-mono font-extrabold flex items-center justify-center shrink-0">
                    1
                  </span>
                  <span className="font-bold text-white uppercase tracking-wide text-[11px] sm:text-xs">
                    Base O.C. Stud Formula ((Length ÷ Spacing) + 1 Starter Stud)
                  </span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Divide total wall length by the on-center spacing, round up any partial bay, then add <strong className="text-white">+ 1 starter stud</strong>:
                </p>
                <div className="bg-slate-950 border border-slate-800/90 rounded-lg p-2.5 font-mono text-[11px] space-y-1 tabular-nums">
                  <div>
                    <span className="text-slate-400">Formula (Imperial):</span>{' '}
                    <span className="text-teal-300">Ceil((Wall Ft × 12&quot;) ÷ O.C.&quot;) + 1</span>{' '}
                    {calc.ocIn === 16 && <span className="text-slate-400">(or (Wall Ft × 0.75) + 1)</span>}
                  </div>
                  <div>
                    <span className="text-slate-400">Formula (Metric):</span>{' '}
                    <span className="text-cyan-300">Ceil(Wall Length mm ÷ O.C. mm) + 1</span>{' '}
                    <span className="text-slate-400">(16&quot;=406mm, 24&quot;=610mm)</span>
                  </div>
                  <div className="pt-1 border-t border-slate-800/80 text-white">
                    • <span className="text-teal-300">Imperial Live:</span> Ceil({calc.lenIn.toFixed(1)}&quot; ÷ {calc.ocIn}&quot;) + 1 ={' '}
                    {calc.spaces} + 1 = <span className="font-bold text-teal-300">{calc.baseStuds} Base Studs</span>
                  </div>
                  <div className="text-white">
                    • <span className="text-cyan-300">Metric Live:</span> Ceil({calc.lenMm.toLocaleString('en-US')} mm ÷ {calc.ocExactMm.toFixed(1)} mm [{calc.ocMm}mm nom.]) + 1 ={' '}
                    {calc.spaces} + 1 = <span className="font-bold text-cyan-300">{calc.baseStuds} Base Studs</span>
                  </div>
                </div>
                <p className="text-[11px] text-amber-300/95 font-medium">
                  Teacher Note: Why + 1? Because the very first space requires both a starting stud at 0&quot; (0 mm) and an ending stud at {calc.ocIn}&quot; ({calc.ocMm} mm)!
                </p>
              </div>

              {/* STUDS & PLATES STEP 2: Add Corner Posts, Partition T-Backing & Opening Studs */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 space-y-1.5 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-300 text-[11px] font-mono font-extrabold flex items-center justify-center shrink-0">
                    2
                  </span>
                  <span className="font-bold text-white uppercase tracking-wide text-[11px] sm:text-xs">
                    Add Corners, T-Backing &amp; Openings (OR Use 1 Stud / LF Exam Rule)
                  </span>
                </div>
                <div className="bg-slate-950 border border-slate-800/90 rounded-lg p-2.5 font-mono text-[11px] space-y-1.5 tabular-nums">
                  <div>
                    <span className="text-teal-300 font-bold">Method A (Detailed Jobsite Takeoff):</span>{' '}
                    Base ({calc.baseStuds}) + Corners ({calc.cornersNum}×2={calc.cornerStuds}) + Tees ({calc.teesNum}×2={calc.teeStuds}) + Openings ({calc.openingsNum}×3={calc.openingStuds}) ={' '}
                    <span className="text-white font-bold">{calc.exactStuds} Exact Studs</span>
                    {calc.wastePct > 0 && (
                      <span className="text-amber-300"> (+{calc.wastePct}% Waste = {calc.exactStudsWithWaste} Studs)</span>
                    )}
                  </div>
                  <div className="pt-1 border-t border-slate-800/80">
                    <span className="text-amber-300 font-bold">Method B (Red Seal 1 Stud / LF Rule for 16&quot; O.C.):</span>{' '}
                    1.0 × {calc.lenFtDec.toFixed(1)} LF ({calc.lenM.toFixed(2)} m ÷ 0.3048 m) ={' '}
                    <span className="text-amber-200 font-bold">{calc.ruleOfThumbStuds} Rule-of-Thumb Studs</span>
                  </div>
                </div>
                <p className="text-slate-400 text-[11px]">
                  When a Red Seal exam question gives wall length at 16&quot; (406 mm) O.C. without listing corners or openings, multiply <strong className="text-white">1.0 stud × Linear Feet</strong> because 1/LF builds in ~25% extra studs over 0.75/LF for corners, tees, and headers!
                </p>
              </div>

              {/* STUDS & PLATES STEP 3: Exact Stud Cut Length */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 space-y-1.5 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-300 text-[11px] font-mono font-extrabold flex items-center justify-center shrink-0">
                    3
                  </span>
                  <span className="font-bold text-white uppercase tracking-wide text-[11px] sm:text-xs">
                    Calculate Exact Stud Cut Length (Wall Height - 3 Plates)
                  </span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Subtract <strong className="text-white">3 dressed plate thicknesses</strong> (1 Bottom Sole Plate + 2 Top Plates = 3 × 1-1/2&quot; = 4-1/2&quot; / 114 mm) from total framed wall height:
                </p>
                <div className="bg-slate-950 border border-slate-800/90 rounded-lg p-2.5 font-mono text-[11px] space-y-1 tabular-nums">
                  <div>
                    • <span className="text-slate-400">Imperial:</span> {calc.hIn.toFixed(2)}&quot; ({formatSurveyFeetInches(calc.hIn)}) - 4.5&quot; ={' '}
                    <span className="text-cyan-300 font-bold">
                      {formatWallHyphenIn(calc.studCutIn)} ({formatSurveyFeetInches(calc.studCutIn)})
                    </span>
                  </div>
                  <div>
                    • <span className="text-slate-400">Metric:</span> {calc.hMm.toLocaleString('en-US')} mm ({calc.hM.toFixed(3)} m) - 114 mm ={' '}
                    <span className="text-emerald-300 font-bold">
                      {calc.studCutMm.toLocaleString('en-US')} mm ({(calc.studCutMm / 1000).toFixed(3)} m)
                    </span>
                  </div>
                </div>
              </div>

              {/* STUDS & PLATES STEP 4: Wall Plates & Stock Pieces */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 space-y-1.5 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-300 text-[11px] font-mono font-extrabold flex items-center justify-center shrink-0">
                    4
                  </span>
                  <span className="font-bold text-white uppercase tracking-wide text-[11px] sm:text-xs">
                    Calculate Wall Plates (× 3) &amp; Convert to Board Stock Pieces
                  </span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Multiply wall length by <strong className="text-white">3</strong> (1 Sole Plate + 2 Top Plates), then divide by stock lumber length ({calc.plateStockFt}&apos; / {calc.plateStockM} m):
                </p>
                <div className="bg-slate-950 border border-slate-800/90 rounded-lg p-2.5 font-mono text-[11px] space-y-1 tabular-nums">
                  <div>
                    • <span className="text-slate-400">Total Plate Footage:</span> {calc.lenFtDec.toFixed(1)} LF × 3 ={' '}
                    <span className="text-amber-300 font-bold">
                      {calc.platesTotalLF.toFixed(1)} LF ({calc.platesTotalM.toFixed(2)} m)
                    </span>
                  </div>
                  <div>
                    • <span className="text-slate-400">Board Stock Pieces:</span> Ceil({calc.platesTotalLF.toFixed(1)} LF ÷ {calc.plateStockFt}&apos;) ={' '}
                    <span className="text-white font-bold">{calc.platesNet} Pieces Net</span>
                    {calc.wastePct > 0 && (
                      <span className="text-teal-300 font-bold"> • {calc.platesWaste} Pieces w/ +{calc.wastePct}% Waste</span>
                    )}
                  </div>
                </div>
              </div>

              {/* STUDS & PLATES STEP 5: Exterior Sheathing */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 space-y-1.5 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-300 text-[11px] font-mono font-extrabold flex items-center justify-center shrink-0">
                    5
                  </span>
                  <span className="font-bold text-white uppercase tracking-wide text-[11px] sm:text-xs">
                    Calculate Exterior Sheathing ({calc.sheetLabelImp} = {calc.sheetSqFt} ft² / {calc.sheetSqM.toFixed(2)} m²)
                  </span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Compute wall surface area (Length × Height) and divide by single structural panel area:
                </p>
                <div className="bg-slate-950 border border-slate-800/90 rounded-lg p-2.5 font-mono text-[11px] space-y-1 tabular-nums">
                  <div>
                    • <span className="text-slate-400">Wall Area:</span> {calc.lenFtDec.toFixed(1)}&apos; × {calc.hFtDec.toFixed(2)}&apos; ={' '}
                    <span className="text-teal-300 font-bold">
                      {calc.grossAreaSqFt.toFixed(1)} ft² ({calc.grossAreaSqM.toFixed(2)} m²)
                    </span>
                  </div>
                  <div>
                    • <span className="text-slate-400">Sheets Needed:</span> Ceil({calc.grossAreaSqFt.toFixed(1)} ft² ÷ {calc.sheetSqFt} ft²/sheet) ={' '}
                    <span className="text-amber-300 font-bold">{calc.grossSheetsNet} Sheets Net</span>
                    {calc.wastePct > 0 && (
                      <span className="text-emerald-300 font-bold"> ({calc.grossSheetsWaste} Sheets w/ +{calc.wastePct}% Waste)</span>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function WallFramingModal({ onClose }) {
  const scrollBodyRef = useRef(null)
  const cadSectionRef = useRef(null)

  const [wallMode, setWallMode] = useState('studs') // 'studs' | 'sheathing' | 'lintel'
  const [unitSystem, setUnitSystem] = useState('imperial') // 'imperial' | 'metric'
  const [metricSubUnit, setMetricSubUnit] = useState('m') // 'm' | 'mm'

  // Shared Total Wall Length (Default: 80'-0" = 24.384 m)
  const [lenFt, setLenFt] = useState('80')
  const [lenIn, setLenIn] = useState('0')
  const [len16, setLen16] = useState('0')
  const [lenMet, setLenMet] = useState('24.384')

  // Shared Total Wall Height (Default: 8'-0" = 96.0" = 2.438 m)
  const [hFt, setHFt] = useState('8')
  const [hIn, setHIn] = useState('0')
  const [h16, setH16] = useState('0')
  const [hMet, setHMet] = useState('2.438')

  // Stud Spacing O.C. ('12' = 305mm, '16' = 406mm default, '24' = 610mm)
  const [ocSpacing, setOcSpacing] = useState('16')

  // Corners, T-Intersections & Openings (Mode 1)
  const [corners, setCorners] = useState('4')
  const [tees, setTees] = useState('2')
  const [openings, setOpenings] = useState('4')

  // Plate Stock Length (12' / 3.66m vs 16' / 4.88m) & Waste % (0, 5, 10)
  const [plateStockFt, setPlateStockFt] = useState(16)
  const [wastePct, setWastePct] = useState(10)

  // Mode 2: Sheathing & Opening Deduction
  const [sheetSize, setSheetSize] = useState('4x8') // '4x8' (32 ft²) | '4x9' (36 ft²)
  const [sheathingAreaMode, setSheathingAreaMode] = useState('gross') // 'gross' | 'net'
  const [deductSqFtInput, setDeductSqFtInput] = useState('64')
  const [deductSqMInput, setDeductSqMInput] = useState('5.95')

  // Mode 3: Lintel / Header & Rough Opening (R.O.)
  const [roType, setRoType] = useState('window') // 'window' | 'door'
  const [roWFt, setRoWFt] = useState('4')
  const [roWIn, setRoWIn] = useState('0')
  const [roW16, setRoW16] = useState('0')
  const [roWMet, setRoWMet] = useState('1.219')

  const [roHFt, setRoHFt] = useState('4')
  const [roHIn, setRoHIn] = useState('0')
  const [roH16, setRoH16] = useState('0')
  const [roHMet, setRoHMet] = useState('1.219')

  const [headerSize, setHeaderSize] = useState('2x10') // '2x6' | '2x8' | '2x10' | '2x12'
  const [jacksPerSide, setJacksPerSide] = useState(1) // 1 | 2

  const [activeTooltip, setActiveTooltip] = useState(null)
  const [calcPulse, setCalcPulse] = useState(false)

  const partsToIn = (ft, inch, six) =>
    Math.max(0, parseFloat(ft) || 0) * 12 +
    Math.max(0, parseFloat(inch) || 0) +
    Math.max(0, parseFloat(six) || 0) / 16

  const fmtMetVal = (valM, sub) => (sub === 'mm' ? String(Math.round(valM * 1000)) : valM.toFixed(3))
  const parseMetToM = (str, sub) => {
    const v = Math.max(0, parseFloat(str) || 0)
    return sub === 'mm' ? v / 1000 : v
  }

  const handleSwitchUnit = (nextUnit) => {
    if (nextUnit === unitSystem) return
    if (nextUnit === 'metric') {
      setLenMet(fmtMetVal(partsToIn(lenFt, lenIn, len16) * 0.0254, metricSubUnit))
      setHMet(fmtMetVal(partsToIn(hFt, hIn, h16) * 0.0254, metricSubUnit))
      setRoWMet(fmtMetVal(partsToIn(roWFt, roWIn, roW16) * 0.0254, metricSubUnit))
      setRoHMet(fmtMetVal(partsToIn(roHFt, roHIn, roH16) * 0.0254, metricSubUnit))
      const sqFt = Math.max(0, parseFloat(deductSqFtInput) || 0)
      setDeductSqMInput((sqFt * 0.09290304).toFixed(2))
    } else {
      const pL = metersToImperialParts(parseMetToM(lenMet, metricSubUnit))
      setLenFt(pL.ft); setLenIn(pL.inch); setLen16(pL.six)
      const pH = metersToImperialParts(parseMetToM(hMet, metricSubUnit))
      setHFt(pH.ft); setHIn(pH.inch); setH16(pH.six)
      const pRW = metersToImperialParts(parseMetToM(roWMet, metricSubUnit))
      setRoWFt(pRW.ft); setRoWIn(pRW.inch); setRoW16(pRW.six)
      const pRH = metersToImperialParts(parseMetToM(roHMet, metricSubUnit))
      setRoHFt(pRH.ft); setRoHIn(pRH.inch); setRoH16(pRH.six)
      const sqM = Math.max(0, parseFloat(deductSqMInput) || 0)
      setDeductSqFtInput((sqM / 0.09290304).toFixed(1))
    }
    setUnitSystem(nextUnit)
  }

  const handleSwitchMetricSubUnit = (nextSub) => {
    if (nextSub === metricSubUnit) return
    const curSub = metricSubUnit
    setLenMet(fmtMetVal(parseMetToM(lenMet, curSub), nextSub))
    setHMet(fmtMetVal(parseMetToM(hMet, curSub), nextSub))
    setRoWMet(fmtMetVal(parseMetToM(roWMet, curSub), nextSub))
    setRoHMet(fmtMetVal(parseMetToM(roHMet, curSub), nextSub))
    setMetricSubUnit(nextSub)
  }

  const applyLengthPreset = (ftVal) => {
    setLenFt(String(ftVal)); setLenIn('0'); setLen16('0')
    setLenMet(fmtMetVal(ftVal * 12 * 0.0254, metricSubUnit))
  }

  const applyHeightPreset = (ftVal, inVal, sixVal) => {
    setHFt(String(ftVal)); setHIn(String(inVal)); setH16(String(sixVal))
    const totIn = ftVal * 12 + inVal + sixVal / 16
    setHMet(fmtMetVal(totIn * 0.0254, metricSubUnit))
  }

  const applyRoPreset = (wFtVal, wInVal, hFtVal, hInVal, typeVal, jacksVal) => {
    setRoType(typeVal)
    setJacksPerSide(jacksVal)
    setRoWFt(String(wFtVal)); setRoWIn(String(wInVal)); setRoW16('0')
    setRoHFt(String(hFtVal)); setRoHIn(String(hInVal)); setRoH16('0')
    setRoWMet(fmtMetVal((wFtVal * 12 + wInVal) * 0.0254, metricSubUnit))
    setRoHMet(fmtMetVal((hFtVal * 12 + hInVal) * 0.0254, metricSubUnit))
  }

  const calc = useMemo(() => {
    const impPrimary = unitSystem === 'imperial'

    const lenInVal = impPrimary
      ? partsToIn(lenFt, lenIn, len16)
      : parseMetToM(lenMet, metricSubUnit) / 0.0254
    const hInVal = impPrimary
      ? partsToIn(hFt, hIn, h16)
      : parseMetToM(hMet, metricSubUnit) / 0.0254

    if (lenInVal <= 0 || hInVal <= 0) return null

    const lenFtDec = lenInVal / 12
    const hFtDec = hInVal / 12
    const lenM = lenInVal * 0.0254
    const hM = hInVal * 0.0254
    const lenMm = Math.round(lenM * 1000)
    const hMm = Math.round(hM * 1000)

    const ocIn = parseInt(ocSpacing, 10) || 16
    const ocMm = ocIn === 12 ? 305 : ocIn === 24 ? 610 : 406
    const ocExactMm = ocIn * 25.4

    const spaces = Math.ceil(lenInVal / ocIn - 1e-6)
    const baseStuds = spaces + 1

    const cornersNum = Math.max(0, Math.round(parseFloat(corners) || 0))
    const teesNum = Math.max(0, Math.round(parseFloat(tees) || 0))
    const openingsNum = Math.max(0, Math.round(parseFloat(openings) || 0))

    const cornerStuds = cornersNum * 2
    const teeStuds = teesNum * 2
    const openingStuds = openingsNum * 3
    const addOnStuds = cornerStuds + teeStuds + openingStuds

    const exactStuds = baseStuds + addOnStuds
    const exactStudsWithWaste = Math.ceil(exactStuds * (1 + wastePct / 100) - 1e-6)
    const ruleOfThumbStuds = Math.ceil(lenFtDec - 1e-6)

    // Stud cut length = Wall Height - 3 × 1.5" plates (4.5" / 114 mm)
    const studCutIn = Math.max(0, hInVal - 4.5)
    const studCutMm = Math.round(studCutIn * 25.4)

    // Wall plates = 3 × Wall Length
    const platesTotalLF = lenFtDec * 3
    const platesTotalM = lenM * 3
    const plateStockM = plateStockFt === 12 ? '3.66' : '4.88'
    const platesNet = Math.ceil(platesTotalLF / plateStockFt - 1e-6)
    const platesWaste = Math.ceil(platesNet * (1 + wastePct / 100) - 1e-6)

    // Sheathing calculation (Gross vs. Net + NBC 9.23.3.5 Fastener Takeoff)
    const sheetSqFt = sheetSize === '4x9' ? 36 : 32
    const sheetSqM = sheetSqFt * 0.09290304
    const sheetLabelImp = sheetSize === '4x9' ? "4'×9'" : "4'×8'"
    const sheetLabelMet = sheetSize === '4x9' ? '1220×2745mm' : '1220×2440mm'

    const grossAreaSqFt = lenFtDec * hFtDec
    const grossAreaSqM = lenM * hM

    const rawDeductSqFt = impPrimary
      ? Math.max(0, parseFloat(deductSqFtInput) || 0)
      : Math.max(0, parseFloat(deductSqMInput) || 0) / 0.09290304
    const deductCandidateSqFt = Math.min(grossAreaSqFt, rawDeductSqFt)
    const deductCandidateSqM = deductCandidateSqFt * 0.09290304

    const netAreaSqFt = Math.max(0, grossAreaSqFt - deductCandidateSqFt)
    const netAreaSqM = netAreaSqFt * 0.09290304

    const grossSheetsNet = Math.ceil(grossAreaSqFt / sheetSqFt - 1e-6)
    const grossSheetsWaste = Math.ceil(grossSheetsNet * (1 + wastePct / 100) - 1e-6)
    const netSheetsNet = netAreaSqFt > 0 ? Math.ceil(netAreaSqFt / sheetSqFt - 1e-6) : 0
    const netSheetsWaste = Math.ceil(netSheetsNet * (1 + wastePct / 100) - 1e-6)

    const effectiveDeductSqFt = sheathingAreaMode === 'net' ? deductCandidateSqFt : 0
    const effectiveDeductSqM = effectiveDeductSqFt * 0.09290304
    const effectiveAreaSqFt = sheathingAreaMode === 'net' ? netAreaSqFt : grossAreaSqFt
    const effectiveAreaSqM = sheathingAreaMode === 'net' ? netAreaSqM : grossAreaSqM
    const sheetsNet = sheathingAreaMode === 'net' ? netSheetsNet : grossSheetsNet
    const sheetsWaste = sheathingAreaMode === 'net' ? netSheetsWaste : grossSheetsWaste

    const panelColumns = Math.ceil(lenFtDec / 4 - 1e-6)

    // NBC 9.23.3.5 Sheathing Fastener Spacing: 6" (150mm) Panel Edges & 12" (300mm) Intermediate Field Studs
    const panelHIn = sheetSize === '4x9' ? 108 : 96
    const vertEdgeNails = 2 * (Math.round(panelHIn / 6) + 1) // 34 for 4'x8', 38 for 4'x9'
    const horizEdgeNails = 9 // Top & bottom horizontal perimeter plate edges on 48" sheet
    const edgeNailsPerSheet = vertEdgeNails + horizEdgeNails // 43 for 4'x8', 47 for 4'x9'
    const interStudsPerSheet = ocIn === 12 ? 3 : ocIn === 24 ? 1 : 2
    const fieldNailsPerSheet = interStudsPerSheet * (Math.round(panelHIn / 12) + 1) // 18 for 4'x8' @ 16" O.C.
    const nailsPerSheet = edgeNailsPerSheet + fieldNailsPerSheet // 61 nails/sheet for 4'x8' @ 16" O.C.
    const activeOrderSheets =
      sheathingAreaMode === 'net'
        ? wastePct > 0
          ? netSheetsWaste
          : netSheetsNet
        : wastePct > 0
        ? grossSheetsWaste
        : grossSheetsNet
    const totalNails = activeOrderSheets * nailsPerSheet

    // Mode 3: Lintel / Header & Rough Opening calculations
    const roWInTotal = impPrimary
      ? partsToIn(roWFt, roWIn, roW16)
      : parseMetToM(roWMet, metricSubUnit) / 0.0254
    const roHInTotal = impPrimary
      ? partsToIn(roHFt, roHIn, roH16)
      : parseMetToM(roHMet, metricSubUnit) / 0.0254
    const roWMm = Math.round(roWInTotal * 25.4)
    const roHMm = Math.round(roHInTotal * 25.4)

    const headerDepthMap = {
      '2x6': { inVal: 5.5, mmVal: 140 },
      '2x8': { inVal: 7.25, mmVal: 184 },
      '2x10': { inVal: 9.25, mmVal: 235 },
      '2x12': { inVal: 11.25, mmVal: 286 }
    }
    const hdrSpec = headerDepthMap[headerSize] || headerDepthMap['2x10']
    const hdrDepthIn = hdrSpec.inVal
    const hdrDepthMm = hdrSpec.mmVal
    const totalJacks = jacksPerSide * 2
    const headerCutIn = Math.max(0, roWInTotal + totalJacks * 1.5)
    const headerCutMm = Math.round(headerCutIn * 25.4)

    const underTopPlateIn = Math.max(0, hInVal - 3.0)
    const headUndersideIn =
      roType === 'door'
        ? Math.min(roHInTotal, Math.max(0, underTopPlateIn - hdrSpec.inVal))
        : Math.min(Math.max(82.0, roHInTotal + 3.0), Math.max(0, underTopPlateIn - hdrSpec.inVal))

    const jackCutIn = Math.max(0, headUndersideIn - 1.5)
    const jackCutMm = Math.round(jackCutIn * 25.4)

    const topCrippleCutIn = Math.max(0, underTopPlateIn - headUndersideIn - hdrSpec.inVal)
    const topCrippleCutMm = Math.round(topCrippleCutIn * 25.4)

    const sillCutIn = roType === 'window' ? roWInTotal : 0
    const sillCutMm = Math.round(sillCutIn * 25.4)

    const botCrippleCutIn =
      roType === 'window' ? Math.max(0, headUndersideIn - roHInTotal - 1.5 - 1.5) : 0
    const botCrippleCutMm = Math.round(botCrippleCutIn * 25.4)

    const crippleLines = Math.max(1, Math.floor(roWInTotal / ocIn - 1e-6))
    const topCrippleQty = topCrippleCutIn > 0.25 ? crippleLines : 0
    const botCrippleQty = roType === 'window' && botCrippleCutIn > 0.25 ? crippleLines : 0
    const totalOpeningPackPieces = 2 + totalJacks + topCrippleQty + botCrippleQty
    const roAreaSqFt = (roWInTotal / 12) * (roHInTotal / 12)
    const roAreaSqM = roAreaSqFt * 0.09290304

    // Dual-unit strings for CAD Diagram Pills
    const studCutDualShort = `${formatWallHyphenIn(studCutIn)} (${studCutMm}mm)`
    const areaSqFtStr = effectiveAreaSqFt.toFixed(1)
    const areaSqMStr = effectiveAreaSqM.toFixed(2)
    const svgCrippleShort =
      roType === 'window' ? `${topCrippleQty}T/${botCrippleQty}B` : `${topCrippleQty} TOP`
    const svgSillShort =
      roType === 'window'
        ? `SILL: ${formatWallHyphenIn(sillCutIn)} (${sillCutMm}MM)`
        : 'NO SILL (CUT SOLE)'

    const svgTopLeftPill =
      wallMode === 'lintel'
        ? `HDR CUT: ${formatWallHyphenIn(headerCutIn)} (${headerCutMm}mm)`
        : `3 PLATES: ${platesTotalLF.toFixed(1)} LF (${platesTotalM.toFixed(2)}m)`

    const svgRoMidPill =
      wallMode === 'lintel'
        ? `JACK: ${formatWallHyphenIn(jackCutIn)} (${jackCutMm}mm)`
        : `KING + JACK + HDR`

    const svgBottomLeftPill =
      wallMode === 'lintel'
        ? `R.O.: ${formatSurveyFeetInches(roWInTotal)}×${formatSurveyFeetInches(roHInTotal)} (${roWMm}×${roHMm}mm)`
        : `${ocIn}" (${ocMm}MM) O.C. • ${exactStuds} STUDS`

    const svgBottomRightPill = `WALL: ${formatSurveyFeetInches(lenInVal)}×${formatSurveyFeetInches(hInVal)} (${lenM.toFixed(2)}×${hM.toFixed(2)}m)`

    const wasteSuffixStuds = wastePct > 0 ? ` (+${wastePct}% = ${exactStudsWithWaste})` : ''
    const wasteSuffixPlates =
      wastePct > 0 ? ` • ${platesWaste} pcs w/ +${wastePct}% Waste` : ' (0% Waste)'
    const wasteSuffixSheets =
      wastePct > 0 ? ` • ${sheetsWaste} w/ +${wastePct}%` : ' (0% Waste)'

    const standardRows = [
      {
        id: 'wallDims',
        label: 'Wall Dimensions (Length × Height):',
        value: impPrimary
          ? `${formatSurveyFeetInches(lenInVal)} L × ${formatSurveyFeetInches(hInVal)} H • ${lenM.toFixed(2)} m × ${hM.toFixed(2)} m`
          : `${lenM.toFixed(2)} m L × ${hM.toFixed(2)} m H • ${formatSurveyFeetInches(lenInVal)} × ${formatSurveyFeetInches(hInVal)}`,
        valueClass: 'text-slate-900 dark:text-white',
        tip: `Continuous framed wall length = ${formatSurveyFeetInches(lenInVal)} (${lenFtDec.toFixed(2)} LF / ${lenM.toFixed(3)} m) and total framed wall height = ${formatSurveyFeetInches(hInVal)} (${hInVal.toFixed(2)}" / ${hMm.toLocaleString('en-US')} mm).`
      },
      {
        id: 'baseStuds',
        label: 'Base O.C. Layout Studs ((L ÷ O.C.) + 1):',
        value: `${baseStuds} Base Studs (at ${ocIn}" / ${ocMm} mm O.C.)`,
        valueClass: 'text-teal-600 dark:text-teal-400',
        tip: `Ceil(${lenInVal.toFixed(1)}" ÷ ${ocIn}") + 1 starter stud = ${spaces} spaces + 1 = ${baseStuds} layout studs (Metric: ${lenMm.toLocaleString('en-US')} mm at ${ocMm} mm O.C.).`
      },
      {
        id: 'addOnStuds',
        label: 'Corners, T-Walls & Opening Stud Add-Ons:',
        value: `+${addOnStuds} Studs (${cornersNum} Corners + ${teesNum} Tees + ${openingsNum} R.O.s)`,
        valueClass: 'text-purple-600 dark:text-purple-400 text-xs',
        tip: `Adds +2 studs per 3-stud exterior corner (${cornersNum}×2=+${cornerStuds}), +2 drywall backing studs per partition T-intersection (${teesNum}×2=+${teeStuds}), and +3 framing studs per window/door rough opening (${openingsNum}×3=+${openingStuds}).`
      },
      {
        id: 'totalStuds',
        label: 'Total Exact Studs vs. Exam 1 Stud/LF Rule:',
        value: `${exactStuds} Exact • ${ruleOfThumbStuds} Rule (1/LF)${wasteSuffixStuds}`,
        valueClass: 'text-emerald-600 dark:text-emerald-400',
        tip: `Detailed takeoff = ${baseStuds} + ${addOnStuds} = ${exactStuds} studs${wastePct > 0 ? ` (${exactStudsWithWaste} studs w/ +${wastePct}% waste)` : ''}. On Red Seal exams without corner/opening counts at 16" O.C., use 1 stud per linear foot = ${ruleOfThumbStuds} studs (${lenM.toFixed(2)} m ÷ 0.3048 m).`
      },
      {
        id: 'studCut',
        label: 'Exact Stud Cut Length (Wall H - 4-1/2"):',
        value: `${formatWallHyphenIn(studCutIn)} (${formatSurveyFeetInches(studCutIn)}) • ${studCutMm.toLocaleString('en-US')} mm`,
        valueClass: 'text-cyan-600 dark:text-cyan-400',
        tip: `Deducts 3 dressed plates (1 Bottom Sole Plate + 2 Top Plates = 3 × 1-1/2" = 4-1/2" / 114 mm) from ${formatSurveyFeetInches(hInVal)} (${hMm.toLocaleString('en-US')} mm) wall height.`
      },
      {
        id: 'totalPlates',
        label: 'Total Wall Plates (3 × Wall Length):',
        value: `${platesTotalLF.toFixed(1)} LF (${platesTotalM.toFixed(2)} m) • 1 Sole + 2 Top Plates`,
        valueClass: 'text-amber-600 dark:text-amber-400 text-xs',
        tip: `Standard platform framing uses 1 bottom sole plate + a lapped double top plate: 3 × ${lenFtDec.toFixed(1)} LF = ${platesTotalLF.toFixed(1)} LF (${platesTotalM.toFixed(2)} linear meters).`
      },
      {
        id: 'platePieces',
        label: `Plate Stock Pieces (${plateStockFt}' / ${plateStockM}m Boards):`,
        value: `${platesNet} pcs Net${wasteSuffixPlates}`,
        valueClass: 'text-slate-900 dark:text-white text-xs',
        tip: `Ceil(${platesTotalLF.toFixed(1)} LF ÷ ${plateStockFt}' stock length) = ${platesNet} boards net${wastePct > 0 ? `, or ${platesWaste} boards including +${wastePct}% lap/cut waste` : ''}.`
      },
      {
        id: 'wallSheathing',
        label: `Wall Sheathing (${sheetLabelImp} / ${sheetSqFt} ft² / ${sheetSqM.toFixed(2)} m²):`,
        value: `${effectiveAreaSqFt.toFixed(1)} ft² (${effectiveAreaSqM.toFixed(2)} m²) ➔ ${sheetsNet} Sheets Net${wasteSuffixSheets}`,
        valueClass: 'text-teal-600 dark:text-teal-400 text-xs',
        tip:
          sheathingAreaMode === 'net'
            ? `Net Area (${grossAreaSqFt.toFixed(1)} ft² Gross - ${effectiveDeductSqFt.toFixed(1)} ft² Openings = ${effectiveAreaSqFt.toFixed(1)} ft² / ${effectiveAreaSqM.toFixed(2)} m²) ÷ ${sheetSqFt} ft² (${sheetLabelMet}) = ${sheetsNet} sheets net (Gross without deduction = ${grossSheetsNet} sheets).`
            : `Gross Wall Area (${grossAreaSqFt.toFixed(1)} ft² / ${grossAreaSqM.toFixed(2)} m²) ÷ ${sheetSqFt} ft² (${sheetLabelMet}) = ${sheetsNet} sheets net${wastePct > 0 ? `, or ${sheetsWaste} sheets with +${wastePct}% waste` : ''}.`
      }
    ]

    const sheathingRows = [
      {
        id: 'sheathGrossArea',
        label: 'Gross Wall Surface Area (L × H):',
        value: `${grossAreaSqFt.toFixed(1)} ft² • ${grossAreaSqM.toFixed(2)} m² (${formatSurveyFeetInches(lenInVal)} × ${formatSurveyFeetInches(hInVal)})`,
        valueClass: 'text-slate-900 dark:text-white',
        tip: `Continuous wall length (${lenFtDec.toFixed(2)}' / ${lenM.toFixed(3)} m) × total wall height (${hFtDec.toFixed(2)}' / ${hM.toFixed(3)} m) = ${grossAreaSqFt.toFixed(1)} ft² (${grossAreaSqM.toFixed(2)} m²) before any rough opening deductions.`
      },
      {
        id: 'sheathDeductArea',
        label: 'Rough Opening Area Deduction:',
        value: `-${deductCandidateSqFt.toFixed(1)} ft² (-${deductCandidateSqM.toFixed(2)} m²) • Net Area = ${netAreaSqFt.toFixed(1)} ft² (${netAreaSqM.toFixed(2)} m²)`,
        valueClass: 'text-rose-600 dark:text-rose-400 text-xs',
        tip: `Subtracts ${deductCandidateSqFt.toFixed(1)} ft² (${deductCandidateSqM.toFixed(2)} m²) of combined window/door rough openings from ${grossAreaSqFt.toFixed(1)} ft² Gross Area to give ${netAreaSqFt.toFixed(1)} ft² (${netAreaSqM.toFixed(2)} m²) Net Area.`
      },
      {
        id: 'sheathPanelSize',
        label: 'Single Panel Coverage Area:',
        value: `${sheetSqFt.toFixed(1)} ft² (${sheetLabelImp}) • ${sheetSqM.toFixed(3)} m² (${sheetSize === '4x9' ? '1220×2745 mm' : '1220×2440 mm'})`,
        valueClass: 'text-cyan-600 dark:text-cyan-400 text-xs',
        tip:
          sheetSize === '4x9'
            ? `Tall-wall 4'×9' panel covers 36.0 ft² (3.345 m² soft / 3.349 m² hard metric 1220×2745 mm) to span 9' walls vertically without horizontal blocking.`
            : `Standard 4'×8' OSB, plywood, or gypsum panel covers 32.0 ft² (2.973 m² soft / 2.977 m² hard metric 1220×2440 mm).`
      },
      {
        id: 'sheathGrossPanels',
        label: 'Gross Sheathing Panels (No Deduct — Exam Default):',
        value: `${grossSheetsNet} Sheets Net${wastePct > 0 ? ` • ${grossSheetsWaste} Sheets w/ +${wastePct}% Waste` : ' (0% Waste)'}`,
        valueClass:
          sheathingAreaMode === 'gross'
            ? 'text-amber-600 dark:text-amber-400'
            : 'text-slate-700 dark:text-slate-300 text-xs',
        tip: `Red Seal Exam Standard: Ceil(${grossAreaSqFt.toFixed(1)} ft² ÷ ${sheetSqFt} ft²) = ${grossSheetsNet} sheets net${wastePct > 0 ? `, or ${grossSheetsWaste} sheets with +${wastePct}% waste` : ''}. Standard openings are NOT deducted unless specified.`
      },
      {
        id: 'sheathNetPanels',
        label: 'Net Sheathing Panels (Deducting Openings):',
        value: `${netSheetsNet} Sheets Net${wastePct > 0 ? ` • ${netSheetsWaste} Sheets w/ +${wastePct}% Waste` : ' (0% Waste)'}`,
        valueClass:
          sheathingAreaMode === 'net'
            ? 'text-emerald-600 dark:text-emerald-400'
            : 'text-slate-700 dark:text-slate-300 text-xs',
        tip: `Net Takeoff: Ceil(${netAreaSqFt.toFixed(1)} ft² ÷ ${sheetSqFt} ft²) = ${netSheetsNet} sheets net${wastePct > 0 ? `, or ${netSheetsWaste} sheets with +${wastePct}% waste` : ''} (saves ${Math.max(0, grossSheetsNet - netSheetsNet)} net sheet(s) vs. Gross).`
      },
      {
        id: 'sheathColumns',
        label: "Linear 4' Vertical Panel Columns (Length ÷ 4'):",
        value: `${panelColumns} Panel Columns along ${formatSurveyFeetInches(lenInVal)} (${lenM.toFixed(2)} m) Wall`,
        valueClass: 'text-purple-600 dark:text-purple-400 text-xs',
        tip: `Standing 4' (1220 mm) wide structural panels vertically requires Ceil(${lenFtDec.toFixed(2)}' ÷ 4') = ${panelColumns} vertical panel columns along the ${formatSurveyFeetInches(lenInVal)} perimeter.`
      },
      {
        id: 'sheathFasteners',
        label: 'NBC Sheathing Nails / Screws (6"/150mm Edge & 12"/300mm Field):',
        value: `~${nailsPerSheet} Nails/Sheet ➔ ~${totalNails.toLocaleString('en-US')} Nails Total`,
        valueClass: 'text-teal-600 dark:text-teal-400 text-xs',
        tip: `NBC 9.23.3.5 requires fasteners every 6" (150 mm) along supported panel edges (${edgeNailsPerSheet}/sheet) and every 12" (300 mm) along ${ocIn}" (${ocMm} mm) O.C. intermediate field studs (${fieldNailsPerSheet}/sheet) = ~${nailsPerSheet} nails/sheet × ${activeOrderSheets} ${sheathingAreaMode === 'net' ? 'Net' : 'Gross'} order sheets.`
      }
    ]

    const lintelRows = [
      {
        id: 'roSize',
        label: `Rough Opening Size (${roType === 'door' ? 'Door' : 'Window'} W × H):`,
        value: `${formatSurveyFeetInches(roWInTotal)} × ${formatSurveyFeetInches(roHInTotal)} • ${roWMm.toLocaleString('en-US')} × ${roHMm.toLocaleString('en-US')} mm`,
        valueClass: 'text-slate-900 dark:text-white',
        tip: `Clear framed Rough Opening = ${roWInTotal.toFixed(2)}" W × ${roHInTotal.toFixed(2)}" H (${(roWInTotal * 0.0254).toFixed(3)} m × ${(roHInTotal * 0.0254).toFixed(3)} m).`
      },
      {
        id: 'lintelCut',
        label: `Exact Header Cut (R.O. + ${totalJacks}×1-1/2" Jacks):`,
        value: `${formatWallHyphenIn(headerCutIn)} (${formatSurveyFeetInches(headerCutIn)}) • ${headerCutMm.toLocaleString('en-US')} mm`,
        valueClass: 'text-amber-600 dark:text-amber-400',
        tip: `Dbl ${headerSize} (${hdrSpec.inVal}" / ${hdrSpec.mmVal} mm deep) header sits over ${jacksPerSide} jack stud(s) per side (${totalJacks} jacks × 1-1/2" = +${totalJacks * 1.5}" / +${Math.round(totalJacks * 38.1)} mm end bearing).`
      },
      {
        id: 'jackCut',
        label: `Jack / Trimmer Studs (${totalJacks} pcs Total):`,
        value: `${formatWallHyphenIn(jackCutIn)} (${formatSurveyFeetInches(jackCutIn)}) • ${jackCutMm.toLocaleString('en-US')} mm`,
        valueClass: 'text-purple-600 dark:text-purple-400',
        tip: `${jacksPerSide} trimmer stud(s) per side standing on the 1-1/2" (38 mm) bottom sole plate up to header underside at ${formatWallHyphenIn(headUndersideIn)} AFF.${roType === 'door' ? ' (Add +1-1/2" / 38 mm if cutting sole plate out prior to setting jacks.)' : ''}`
      },
      {
        id: 'kingCut',
        label: 'King Studs (2 Full-Height Studs):',
        value: `2 pcs @ ${formatWallHyphenIn(studCutIn)} (${formatSurveyFeetInches(studCutIn)} • ${studCutMm.toLocaleString('en-US')} mm)`,
        valueClass: 'text-cyan-600 dark:text-cyan-400 text-xs',
        tip: `1 full-height King stud nailed outside the Jack(s) on each side of the opening, cut to exact common stud length (Wall H - 4-1/2" = ${formatWallHyphenIn(studCutIn)} / ${studCutMm.toLocaleString('en-US')} mm).`
      },
      {
        id: 'sillCut',
        label: 'Rough Sill Plate Cut Length:',
        value:
          roType === 'window'
            ? `${formatWallHyphenIn(sillCutIn)} (${formatSurveyFeetInches(sillCutIn)}) • ${sillCutMm.toLocaleString('en-US')} mm`
            : 'Door R.O. — Cut Out Sole Plate at Threshold',
        valueClass: 'text-teal-600 dark:text-teal-400 text-xs',
        tip:
          roType === 'window'
            ? `Standard 1-1/2" (38 mm) flat rough sill cut to fit tightly between left and right jack studs (${formatWallHyphenIn(sillCutIn)} / ${sillCutMm.toLocaleString('en-US')} mm).`
            : 'Door rough openings have no sill plate; frame across with the continuous bottom sole plate and saw out the threshold section after standing the wall.'
      },
      {
        id: 'cripples',
        label: `Header & Sill Cripples (${ocIn}" / ${ocMm}mm O.C.):`,
        value:
          roType === 'window'
            ? `${topCrippleQty} Top @ ${formatWallHyphenIn(topCrippleCutIn)} (${topCrippleCutMm}mm) • ${botCrippleQty} Bot @ ${formatWallHyphenIn(botCrippleCutIn)} (${botCrippleCutMm}mm)`
            : topCrippleQty > 0
            ? `${topCrippleQty} Top Cripples @ ${formatWallHyphenIn(topCrippleCutIn)} (${topCrippleCutMm} mm)`
            : 'Tight Header Under Top Plate (0 Cripples)',
        valueClass: 'text-emerald-600 dark:text-emerald-400 text-xs',
        tip: `Maintains continuous ${ocIn}" (${ocMm} mm) O.C. sheathing nailing layout across the ${formatSurveyFeetInches(roWInTotal)} opening (${crippleLines} interrupted O.C. stud lines).`
      },
      {
        id: 'roStudPack',
        label: 'Total Opening Framing Pieces:',
        value: `${totalOpeningPackPieces} pcs (2 Kings + ${totalJacks} Jacks + ${topCrippleQty + botCrippleQty} Cripples)`,
        valueClass: 'text-slate-900 dark:text-white text-xs',
        tip: `Complete opening stud pack breakdown. Because cripples replace interrupted common studs, estimators add +3 full-length studs per typical opening (+4 to +5 for wide double-jack spans) on wall takeoffs.`
      },
      {
        id: 'roSheathing',
        label: 'Opening Area (Sheathing Deduction Ref):',
        value: `${roAreaSqFt.toFixed(2)} ft² (${roAreaSqM.toFixed(2)} m²) • ${(roAreaSqFt / sheetSqFt).toFixed(2)} Sheets`,
        valueClass: 'text-amber-600 dark:text-amber-400 text-xs',
        tip: `Area of this single rough opening = ${roAreaSqFt.toFixed(2)} ft² (${roAreaSqM.toFixed(2)} m²). You can enter total opening area in the Sheathing & Opening Deduction tab when estimating net wall panels.`
      }
    ]

    return {
      impPrimary,
      lenIn: lenInVal,
      hIn: hInVal,
      lenFtDec,
      hFtDec,
      lenM,
      hM,
      lenMm,
      hMm,
      ocIn,
      ocMm,
      ocExactMm,
      spaces,
      baseStuds,
      cornersNum,
      teesNum,
      openingsNum,
      cornerStuds,
      teeStuds,
      openingStuds,
      addOnStuds,
      exactStuds,
      exactStudsWithWaste,
      ruleOfThumbStuds,
      studCutIn,
      studCutMm,
      platesTotalLF,
      platesTotalM,
      plateStockFt,
      plateStockM,
      platesNet,
      platesWaste,
      wastePct,
      sheetSqFt,
      sheetSqM,
      sheetLabelImp,
      sheetLabelMet,
      grossAreaSqFt,
      grossAreaSqM,
      deductCandidateSqFt,
      deductCandidateSqM,
      netAreaSqFt,
      netAreaSqM,
      grossSheetsNet,
      grossSheetsWaste,
      netSheetsNet,
      netSheetsWaste,
      effectiveDeductSqFt,
      effectiveDeductSqM,
      effectiveAreaSqFt,
      effectiveAreaSqM,
      sheetsNet,
      sheetsWaste,
      panelColumns,
      edgeNailsPerSheet,
      fieldNailsPerSheet,
      nailsPerSheet,
      activeOrderSheets,
      totalNails,
      roType,
      headerSize,
      jacksPerSide,
      hdrDepthIn,
      hdrDepthMm,
      roWInTotal,
      roHInTotal,
      roWMm,
      roHMm,
      totalJacks,
      headerCutIn,
      headerCutMm,
      headUndersideIn,
      jackCutIn,
      jackCutMm,
      sillCutIn,
      sillCutMm,
      botCrippleCutIn,
      botCrippleCutMm,
      botCrippleQty,
      topCrippleCutIn,
      topCrippleCutMm,
      topCrippleQty,
      studCutDualShort,
      areaSqFtStr,
      areaSqMStr,
      svgCrippleShort,
      svgSillShort,
      svgTopLeftPill,
      svgRoMidPill,
      svgBottomLeftPill,
      svgBottomRightPill,
      rows:
        wallMode === 'lintel'
          ? lintelRows
          : wallMode === 'sheathing'
          ? sheathingRows
          : standardRows
    }
  }, [
    wallMode,
    unitSystem,
    metricSubUnit,
    lenFt,
    lenIn,
    len16,
    lenMet,
    hFt,
    hIn,
    h16,
    hMet,
    ocSpacing,
    corners,
    tees,
    openings,
    plateStockFt,
    wastePct,
    sheetSize,
    sheathingAreaMode,
    deductSqFtInput,
    deductSqMInput,
    roType,
    roWFt,
    roWIn,
    roW16,
    roWMet,
    roHFt,
    roHIn,
    roH16,
    roHMet,
    headerSize,
    jacksPerSide
  ])

  const handleCalculate = () => {
    setCalcPulse(true)
    setTimeout(() => setCalcPulse(false), 300)
  }

  const toggleInfo = (id) => {
    setActiveTooltip((prev) => (prev === id ? null : id))
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 p-4 shrink-0 bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-500 rounded-lg text-white shrink-0">
              <AlignJustify size={22} />
            </div>
            <div>
              <h3 className="text-slate-900 dark:text-white text-base md:text-lg font-bold uppercase tracking-wider leading-tight">
                WALL FRAMING ESTIMATOR
              </h3>
              <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                STUDS, PLATES, R.O. HEADERS &amp; SHEATHING TAKEOFF
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition-colors p-1">
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Sticky Top Quick Navigation Bar */}
        <div className="px-4 py-2 bg-slate-100 dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800 shrink-0 flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollBodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex-1 py-1.5 px-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-[11px] font-mono font-extrabold text-slate-800 dark:text-slate-200 hover:border-teal-500/60 transition-colors"
          >
            🧮 Calculator &amp; Results
          </button>
          <button
            type="button"
            onClick={() => cadSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            className="flex-1 py-1.5 px-2.5 rounded-lg bg-teal-500/15 hover:bg-teal-500/25 border border-teal-500/40 text-[11px] font-mono font-extrabold text-teal-700 dark:text-teal-300 transition-colors"
          >
            📐 1:1 CAD &amp; Math Teacher ↓
          </button>
        </div>

        {/* Scrollable Content (Block flow prevents flex-shrink child crushing) */}
        <div
          ref={scrollBodyRef}
          className="block space-y-4 p-4 md:p-5 overflow-y-auto custom-scrollbar flex-1 min-h-0 max-h-[82vh]"
        >
          {/* 3-Mode Red Seal Wall Framing Selector */}
          <div className="grid grid-cols-3 gap-1.5 bg-slate-200 dark:bg-slate-800/90 p-1 rounded-xl shrink-0">
            {[
              { id: 'studs', title: 'Studs & Plates', sub: 'O.C. + Corners' },
              { id: 'sheathing', title: 'Sheathing', sub: 'Gross vs Net' },
              { id: 'lintel', title: 'Lintel & R.O.', sub: 'Header & Jacks' }
            ].map((tab) => {
              const active = wallMode === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setWallMode(tab.id)}
                  className={`py-2 px-1.5 rounded-lg text-center transition-all ${
                    active
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider leading-tight">
                    {tab.title}
                  </div>
                  <div className={`text-[9px] font-mono font-bold mt-0.5 ${active ? 'text-teal-100' : 'text-slate-500'}`}>
                    {tab.sub}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Live-Converting Imperial vs Metric Toggle */}
          <div className="flex bg-slate-200 dark:bg-slate-800 rounded-lg p-1 shrink-0">
            <button
              type="button"
              onClick={() => handleSwitchUnit('imperial')}
              className={`flex-1 py-2 px-2 text-[11px] font-bold uppercase tracking-wider rounded-md transition-colors ${
                unitSystem === 'imperial'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Imperial (FT / IN / 16THS)
            </button>
            <button
              type="button"
              onClick={() => handleSwitchUnit('metric')}
              className={`flex-1 py-2 px-2 text-[11px] font-bold uppercase tracking-wider rounded-md transition-colors ${
                unitSystem === 'metric'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Metric (M / MM)
            </button>
          </div>

          {unitSystem === 'metric' && (
            <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-800/60 px-3 py-1.5 rounded-lg shrink-0">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Metric Input Unit:
              </span>
              <div className="flex gap-1 bg-slate-200 dark:bg-slate-900 p-0.5 rounded-md">
                {[
                  { id: 'm', label: 'Meters (m)' },
                  { id: 'mm', label: 'Millimeters (mm)' }
                ].map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleSwitchMetricSubUnit(u.id)}
                    className={`px-2.5 py-1 rounded text-[10px] font-mono font-extrabold transition-colors ${
                      metricSubUnit === u.id
                        ? 'bg-teal-600 text-white'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {u.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Mode-Specific Inputs */}
          <div className="space-y-3.5 shrink-0">
            {(wallMode === 'studs' || wallMode === 'sheathing') && (
              <>
                {/* Wall Length Quick Presets + Input */}
                <div className="space-y-2">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {[
                      { label: "12' Int Wall", ft: 12 },
                      { label: "40' Wall", ft: 40 },
                      { label: "80' House Perim", ft: 80 },
                      { label: "136' Full Perim", ft: 136 }
                    ].map((p) => (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => applyLengthPreset(p.ft)}
                        className="py-1.5 px-2 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-teal-500/15 border border-slate-300 dark:border-slate-700 hover:border-teal-500/50 text-[10px] font-mono font-bold text-slate-700 dark:text-slate-200 transition-colors"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>

                  {unitSystem === 'imperial' ? (
                    <WallImperialDimInput
                      label="Total Wall Length (Perimeter)"
                      badge="L"
                      feetVal={lenFt}
                      setFeetVal={setLenFt}
                      inVal={lenIn}
                      setInVal={setLenIn}
                      sixVal={len16}
                      setSixVal={setLen16}
                    />
                  ) : (
                    <WallMetricDimInput
                      label="Total Wall Length (Perimeter)"
                      badge="L"
                      value={lenMet}
                      onChange={setLenMet}
                      metricSubUnit={metricSubUnit}
                    />
                  )}
                </div>

                {/* Wall Height Quick Presets + Input */}
                <div className="space-y-2">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {[
                      { label: "8'-0\" (96\" Std)", ft: 8, inch: 0, six: 0 },
                      { label: "8'-1 1/8\" (92-5/8\")", ft: 8, inch: 1, six: 2 },
                      { label: "9'-1 1/8\" (104-5/8\")", ft: 9, inch: 1, six: 2 },
                      { label: "10'-0\" Tall", ft: 10, inch: 0, six: 0 }
                    ].map((p) => (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => applyHeightPreset(p.ft, p.inch, p.six)}
                        className="py-1.5 px-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-teal-500/15 border border-slate-300 dark:border-slate-700 hover:border-teal-500/50 text-[9.5px] sm:text-[10px] font-mono font-bold text-slate-700 dark:text-slate-200 transition-colors"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>

                  {unitSystem === 'imperial' ? (
                    <WallImperialDimInput
                      label="Total Wall Height"
                      badge="H"
                      feetVal={hFt}
                      setFeetVal={setHFt}
                      inVal={hIn}
                      setInVal={setHIn}
                      sixVal={h16}
                      setSixVal={setH16}
                    />
                  ) : (
                    <WallMetricDimInput
                      label="Total Wall Height"
                      badge="H"
                      value={hMet}
                      onChange={setHMet}
                      metricSubUnit={metricSubUnit}
                    />
                  )}
                </div>
              </>
            )}

            {wallMode === 'studs' && (
              <>
                {/* Stud Spacing O.C. Selector */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">
                      Stud Spacing (O.C.)
                    </span>
                    <span className="text-[10px] font-mono font-bold text-teal-600 dark:text-teal-400">
                      16&quot; (406 mm) = Red Seal Standard
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 bg-slate-200 dark:bg-slate-800 p-1 rounded-xl">
                    {[
                      { val: '12', label: '12" O.C.', sub: '305 mm' },
                      { val: '16', label: '16" O.C.', sub: '406 mm' },
                      { val: '24', label: '24" O.C.', sub: '610 mm' }
                    ].map((opt) => {
                      const active = ocSpacing === opt.val
                      return (
                        <button
                          key={opt.val}
                          type="button"
                          onClick={() => setOcSpacing(opt.val)}
                          className={`py-2 px-2 rounded-lg text-center transition-all ${
                            active
                              ? 'bg-teal-600 text-white shadow-sm'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          <div className="text-xs font-mono font-extrabold">{opt.label}</div>
                          <div className={`text-[9px] font-mono font-bold ${active ? 'text-teal-100' : 'text-slate-500'}`}>
                            {opt.sub}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Corners, T-Intersections & Openings (3-Column Compact Row) */}
                <div className="bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl p-3 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <span className="text-[11px] font-extrabold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                      Corners, T-Intersections &amp; Openings
                    </span>
                    {calc && (
                      <span className="text-[10px] font-mono font-bold text-purple-600 dark:text-purple-400 tabular-nums">
                        = +{calc.addOnStuds} Extra Studs
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="flex flex-col">
                      <span className="text-[9.5px] font-mono font-extrabold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-1">
                        EXT CORNERS
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={corners}
                        onChange={(e) => setCorners(e.target.value)}
                        className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-sm font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                      />
                      <span className="text-[9px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                        +2 studs/ea (+{(Math.max(0, Math.round(parseFloat(corners) || 0)) * 2)})
                      </span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-[9.5px] font-mono font-extrabold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-1">
                        T-WALL TEES
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={tees}
                        onChange={(e) => setTees(e.target.value)}
                        className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-sm font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                      />
                      <span className="text-[9px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                        +2 studs/ea (+{(Math.max(0, Math.round(parseFloat(tees) || 0)) * 2)})
                      </span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-[9.5px] font-mono font-extrabold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-1">
                        WIN/DOOR R.O.
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={openings}
                        onChange={(e) => setOpenings(e.target.value)}
                        className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-sm font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                      />
                      <span className="text-[9px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                        +3 studs/ea (+{(Math.max(0, Math.round(parseFloat(openings) || 0)) * 3)})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Plate Stock Length & Waste % Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <span className="block text-[10px] font-mono font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                      Plate Stock Length
                    </span>
                    <div className="grid grid-cols-2 gap-1 bg-slate-200 dark:bg-slate-800 p-1 rounded-lg">
                      {[
                        { ft: 12, label: "12' (3.66m)" },
                        { ft: 16, label: "16' (4.88m)" }
                      ].map((b) => (
                        <button
                          key={b.ft}
                          type="button"
                          onClick={() => setPlateStockFt(b.ft)}
                          className={`py-1.5 rounded text-[10.5px] font-mono font-extrabold transition-colors ${
                            plateStockFt === b.ft
                              ? 'bg-teal-600 text-white'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          {b.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="block text-[10px] font-mono font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                      Waste Allowance %
                    </span>
                    <div className="grid grid-cols-3 gap-1 bg-slate-200 dark:bg-slate-800 p-1 rounded-lg">
                      {[
                        { pct: 0, label: '0% Net' },
                        { pct: 5, label: '+5%' },
                        { pct: 10, label: '+10%' }
                      ].map((w) => (
                        <button
                          key={w.pct}
                          type="button"
                          onClick={() => setWastePct(w.pct)}
                          className={`py-1.5 rounded text-[10.5px] font-mono font-extrabold transition-colors ${
                            wastePct === w.pct
                              ? 'bg-teal-600 text-white'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          {w.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {wallMode === 'sheathing' && (
              <div className="space-y-3 bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl p-3">
                {/* Sheet Size Selector */}
                <div className="space-y-1.5">
                  <span className="block text-[10px] font-mono font-extrabold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                    OSB / Plywood / Drywall Sheet Size
                  </span>
                  <div className="grid grid-cols-2 gap-1.5 bg-slate-200 dark:bg-slate-900 p-1 rounded-lg">
                    {[
                      { id: '4x8', title: "4'×8' Standard", sub: '32 ft² • 1220×2440mm (2.97 m²)' },
                      { id: '4x9', title: "4'×9' Tall Wall", sub: '36 ft² • 1220×2745mm (3.34 m²)' }
                    ].map((s) => {
                      const active = sheetSize === s.id
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => setSheetSize(s.id)}
                          className={`py-1.5 px-2 rounded-md text-center transition-colors ${
                            active
                              ? 'bg-teal-600 text-white'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          <div className="text-[11px] font-mono font-extrabold">{s.title}</div>
                          <div className={`text-[9px] font-mono ${active ? 'text-teal-100' : 'text-slate-500'}`}>{s.sub}</div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Gross vs Net Area Toggle */}
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <span className="block text-[10px] font-mono font-extrabold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                      Opening Area Deduction Mode
                    </span>
                    <span className="text-[9.5px] font-mono font-bold text-amber-600 dark:text-amber-400">
                      {sheathingAreaMode === 'gross' ? 'Exam Default: Gross Area' : 'Active Order: Net Area'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 bg-slate-200 dark:bg-slate-900 p-1 rounded-lg">
                    {[
                      { id: 'gross', label: 'Gross Area (No Deduct)' },
                      { id: 'net', label: 'Net Area (Deduct R.O.s)' }
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setSheathingAreaMode(m.id)}
                        className={`py-1.5 px-2 rounded-md text-[10.5px] font-mono font-extrabold transition-colors ${
                          sheathingAreaMode === m.id
                            ? 'bg-teal-600 text-white'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Always-Visible Compact Total Rough Opening Deduction Area Row (Compare Gross vs. Net Anytime) */}
                <div className="space-y-2 pt-0.5">
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                      Total Rough Opening Deduction Area ({unitSystem === 'imperial' ? 'FT²' : 'M²'})
                    </span>
                    <span className="text-[10px] font-mono font-bold text-teal-600 dark:text-teal-300 tabular-nums">
                      {unitSystem === 'imperial'
                        ? `= ${(Math.max(0, parseFloat(deductSqFtInput) || 0)).toFixed(1)} ft² • ${(Math.max(0, parseFloat(deductSqFtInput) || 0) * 0.09290304).toFixed(2)} m²`
                        : `= ${(Math.max(0, parseFloat(deductSqMInput) || 0)).toFixed(2)} m² • ${(Math.max(0, parseFloat(deductSqMInput) || 0) / 0.09290304).toFixed(1)} ft²`}
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { label: '32 ft² (1 Sht)', sqFt: 32 },
                      { label: '64 ft² (4 Win)', sqFt: 64 },
                      { label: '96 ft² (3 Sht)', sqFt: 96 },
                      { label: '128 ft² (4 Sht)', sqFt: 128 }
                    ].map((d) => (
                      <button
                        key={d.sqFt}
                        type="button"
                        onClick={() => {
                          setDeductSqFtInput(String(d.sqFt))
                          setDeductSqMInput((d.sqFt * 0.09290304).toFixed(2))
                        }}
                        className="py-1 px-1.5 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:border-teal-500 text-[9.5px] font-mono font-bold text-slate-700 dark:text-slate-300"
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>

                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={unitSystem === 'imperial' ? deductSqFtInput : deductSqMInput}
                      onChange={(e) => {
                        const val = e.target.value
                        if (unitSystem === 'imperial') {
                          setDeductSqFtInput(val)
                          setDeductSqMInput(((parseFloat(val) || 0) * 0.09290304).toFixed(2))
                        } else {
                          setDeductSqMInput(val)
                          setDeductSqFtInput(((parseFloat(val) || 0) / 0.09290304).toFixed(1))
                        }
                      }}
                      className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl pl-3 pr-12 py-2 text-sm font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono font-extrabold text-slate-400">
                      {unitSystem === 'imperial' ? 'FT²' : 'M²'}
                    </span>
                  </div>
                </div>

                {/* Waste % & NBC Field Stud Spacing Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <span className="block text-[10px] font-mono font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                      Panel Waste Allowance %
                    </span>
                    <div className="grid grid-cols-3 gap-1 bg-slate-200 dark:bg-slate-900 p-1 rounded-lg">
                      {[
                        { pct: 0, label: '0% Net' },
                        { pct: 5, label: '+5%' },
                        { pct: 10, label: '+10%' }
                      ].map((w) => (
                        <button
                          key={w.pct}
                          type="button"
                          onClick={() => setWastePct(w.pct)}
                          className={`py-1.5 rounded text-[10px] font-mono font-extrabold transition-colors ${
                            wastePct === w.pct
                              ? 'bg-teal-600 text-white'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          {w.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="block text-[10px] font-mono font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                      Field Stud O.C. (NBC Nails)
                    </span>
                    <div className="grid grid-cols-3 gap-1 bg-slate-200 dark:bg-slate-900 p-1 rounded-lg">
                      {[
                        { val: '12', label: '12" (305)' },
                        { val: '16', label: '16" (406)' },
                        { val: '24', label: '24" (610)' }
                      ].map((opt) => (
                        <button
                          key={opt.val}
                          type="button"
                          onClick={() => setOcSpacing(opt.val)}
                          className={`py-1.5 rounded text-[10px] font-mono font-extrabold transition-colors ${
                            ocSpacing === opt.val
                              ? 'bg-teal-600 text-white'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {wallMode === 'lintel' && (
              <div className="space-y-3">
                {/* Quick Rough Opening Presets */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {[
                    { label: '3\'-2"×6\'-10" Door', wFt: 3, wIn: 2, hFt: 6, hIn: 10, type: 'door', jacks: 1 },
                    { label: '4\'-0"×4\'-0" Win', wFt: 4, wIn: 0, hFt: 4, hIn: 0, type: 'window', jacks: 1 },
                    { label: '5\'-0"×4\'-0" Win', wFt: 5, wIn: 0, hFt: 4, hIn: 0, type: 'window', jacks: 2 },
                    { label: '6\'-0"×6\'-10" Patio', wFt: 6, wIn: 0, hFt: 6, hIn: 10, type: 'door', jacks: 2 }
                  ].map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => applyRoPreset(p.wFt, p.wIn, p.hFt, p.hIn, p.type, p.jacks)}
                      className="py-1.5 px-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-teal-500/15 border border-slate-300 dark:border-slate-700 hover:border-teal-500/50 text-[9.5px] sm:text-[10px] font-mono font-bold text-slate-700 dark:text-slate-200 transition-colors"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                {/* Window vs Door Opening Type */}
                <div className="grid grid-cols-2 gap-1.5 bg-slate-200 dark:bg-slate-800 p-1 rounded-xl">
                  {[
                    { id: 'window', label: 'Window R.O. (w/ Sill & Cripples)' },
                    { id: 'door', label: 'Door R.O. (Floor Threshold)' }
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setRoType(t.id)}
                      className={`py-1.5 px-2 rounded-lg text-[10.5px] font-mono font-extrabold transition-colors ${
                        roType === t.id
                          ? 'bg-teal-600 text-white'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                {unitSystem === 'imperial' ? (
                  <>
                    <WallImperialDimInput
                      label="Rough Opening Width (R.O. Width)"
                      badge="R.O. W"
                      feetVal={roWFt}
                      setFeetVal={setRoWFt}
                      inVal={roWIn}
                      setInVal={setRoWIn}
                      sixVal={roW16}
                      setSixVal={setRoW16}
                    />
                    <WallImperialDimInput
                      label="Rough Opening Height (R.O. Height)"
                      badge="R.O. H"
                      feetVal={roHFt}
                      setFeetVal={setRoHFt}
                      inVal={roHIn}
                      setInVal={setRoHIn}
                      sixVal={roH16}
                      setSixVal={setRoH16}
                    />
                    <WallImperialDimInput
                      label="Framed Wall Height (For King & Cripples)"
                      badge="WALL H"
                      feetVal={hFt}
                      setFeetVal={setHFt}
                      inVal={hIn}
                      setInVal={setHIn}
                      sixVal={h16}
                      setSixVal={setH16}
                    />
                  </>
                ) : (
                  <>
                    <WallMetricDimInput
                      label="Rough Opening Width (R.O. Width)"
                      badge="R.O. W"
                      value={roWMet}
                      onChange={setRoWMet}
                      metricSubUnit={metricSubUnit}
                    />
                    <WallMetricDimInput
                      label="Rough Opening Height (R.O. Height)"
                      badge="R.O. H"
                      value={roHMet}
                      onChange={setRoHMet}
                      metricSubUnit={metricSubUnit}
                    />
                    <WallMetricDimInput
                      label="Framed Wall Height (For King & Cripples)"
                      badge="WALL H"
                      value={hMet}
                      onChange={setHMet}
                      metricSubUnit={metricSubUnit}
                    />
                  </>
                )}

                {/* Header / Lintel Depth & Jack Studs Per Side */}
                <div className="bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl p-3 space-y-2.5">
                  <div className="space-y-1">
                    <span className="block text-[10px] font-mono font-extrabold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                      Header / Lintel Lumber Depth (2-Ply)
                    </span>
                    <div className="grid grid-cols-4 gap-1 bg-slate-200 dark:bg-slate-900 p-1 rounded-lg">
                      {[
                        { id: '2x6', sub: '5-1/2" (140mm)' },
                        { id: '2x8', sub: '7-1/4" (184mm)' },
                        { id: '2x10', sub: '9-1/4" (235mm)' },
                        { id: '2x12', sub: '11-1/4" (286mm)' }
                      ].map((h) => {
                        const active = headerSize === h.id
                        return (
                          <button
                            key={h.id}
                            type="button"
                            onClick={() => setHeaderSize(h.id)}
                            className={`py-1.5 px-1 rounded text-center transition-colors ${
                              active
                                ? 'bg-teal-600 text-white'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            }`}
                          >
                            <div className="text-[11px] font-mono font-extrabold">{h.id}</div>
                            <div className={`text-[8.5px] font-mono ${active ? 'text-teal-100' : 'text-slate-500'}`}>{h.sub}</div>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="block text-[10px] font-mono font-extrabold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                      Jack (Trimmer) Studs Per Side
                    </span>
                    <div className="grid grid-cols-2 gap-1.5 bg-slate-200 dark:bg-slate-900 p-1 rounded-lg">
                      {[
                        { val: 1, title: '1 Jack / Side (≤4\' Span)', sub: '2 Jacks Total = +3" (+76mm) Header' },
                        { val: 2, title: '2 Jacks / Side (>4\' Span)', sub: '4 Jacks Total = +6" (+152mm) Header' }
                      ].map((j) => {
                        const active = jacksPerSide === j.val
                        return (
                          <button
                            key={j.val}
                            type="button"
                            onClick={() => setJacksPerSide(j.val)}
                            className={`py-1.5 px-2 rounded text-center transition-colors ${
                              active
                                ? 'bg-teal-600 text-white'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            }`}
                          >
                            <div className="text-[10.5px] font-mono font-extrabold">{j.title}</div>
                            <div className={`text-[8.5px] font-mono ${active ? 'text-teal-100' : 'text-slate-500'}`}>{j.sub}</div>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="block text-[10px] font-mono font-extrabold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                      Cripple Stud Spacing (O.C.)
                    </span>
                    <div className="grid grid-cols-3 gap-1 bg-slate-200 dark:bg-slate-900 p-1 rounded-lg">
                      {[
                        { val: '12', label: '12" (305mm)' },
                        { val: '16', label: '16" (406mm)' },
                        { val: '24', label: '24" (610mm)' }
                      ].map((opt) => (
                        <button
                          key={opt.val}
                          type="button"
                          onClick={() => setOcSpacing(opt.val)}
                          className={`py-1.5 rounded text-[10px] font-mono font-extrabold transition-colors ${
                            ocSpacing === opt.val
                              ? 'bg-teal-600 text-white'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handleCalculate}
              className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold uppercase tracking-wider py-3 rounded-xl transition-colors shadow-md active:scale-[0.98]"
            >
              Calculate Wall Framing Takeoff
            </button>
          </div>

          {/* Inline Quick Jump Pill */}
          <button
            type="button"
            onClick={() => cadSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            className="w-full shrink-0 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/35 text-teal-700 dark:text-teal-300 text-[11px] sm:text-xs font-mono font-extrabold tracking-wide transition-colors"
          >
            <span>📐 Jump to 1:1 CAD Wall Elevation &amp; 5-Step Math Teacher ↓</span>
          </button>

          {/* 2. CALCULATION RESULTS (8 Complete Dual-Unit Rows, Zero ⓘ Collision) */}
          <div
            className={`shrink-0 bg-slate-100 dark:bg-slate-800/50 border rounded-xl p-4 md:p-5 transition-colors ${
              calcPulse ? 'border-teal-400' : 'border-slate-300 dark:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-3.5 border-b border-slate-200 dark:border-slate-700 pb-2">
              <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                Calculation Results
              </h4>
              <span className="text-[10px] font-mono font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                IMPERIAL + METRIC
              </span>
            </div>

            {calc ? (
              <div className="space-y-2.5 text-xs sm:text-sm">
                {calc.rows.map((row, idx, arr) => (
                  <div
                    key={row.id}
                    className={`flex flex-col ${
                      idx < arr.length - 1 ? 'border-b border-slate-200/60 dark:border-slate-700/60 pb-2.5' : 'pt-0.5'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="font-sans font-semibold text-slate-700 dark:text-slate-200 leading-snug">
                          {row.label}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleInfo(row.id)}
                          aria-label={`Info about ${row.label}`}
                          className={`inline-flex items-center justify-center w-5 h-5 rounded-full shrink-0 transition-colors ${
                            activeTooltip === row.id
                              ? 'bg-teal-500/20 text-teal-400'
                              : 'text-slate-400 hover:text-teal-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                          }`}
                        >
                          <Info size={13} />
                        </button>
                      </div>

                      <div className={`ml-auto text-right font-mono font-bold tabular-nums ${row.valueClass}`}>
                        {row.value}
                      </div>
                    </div>

                    {activeTooltip === row.id && (
                      <div className="text-xs text-teal-100 bg-slate-900 border border-teal-500/30 px-3 py-2 rounded-lg mt-2 leading-relaxed">
                        {row.tip}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs font-mono text-amber-600 dark:text-amber-400">
                Enter positive Wall Length and Wall Height dimensions above to compute dual Imperial + Metric framing quantities.
              </p>
            )}
          </div>

          {/* 3. LIVE 1:1 CAD FRAMED WALL DIAGRAM & 4. 5-STEP RED SEAL MATH TEACHER */}
          <WallFramingCadAndTeacher calc={calc} wallMode={wallMode} cadSectionRef={cadSectionRef} />
        </div>
      </div>
    </div>
  )
}

export default function TradeMathMenu() {






  const [activeModal, setActiveModal] = useState(null);

  return (
    <div className="flex flex-col h-full w-full max-w-7xl mx-auto bg-white dark:bg-[#0f111a] rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative">
      <div className="flex flex-col flex-1 overflow-hidden min-h-0">
        <div className="w-full bg-white dark:bg-[#121520] overflow-y-auto custom-scrollbar flex flex-col min-h-0">
          <div className="flex flex-col">
            {TRADE_MATH_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <div 
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-white dark:bg-[#1e2330] hover:bg-slate-50 dark:hover:bg-[#252b3b] border-b border-slate-200 dark:border-slate-800 cursor-pointer transition-colors" 
                  onClick={() => {
                    if (item.id === 'stair') {
                      setActiveModal('stair');
                    } else if (item.id === 'concrete') {
                      setActiveModal('concrete');
                    } else if (item.id === 'bfm') {
                      setActiveModal('bfm');
                    } else if (item.id === 'roof') {
                      setActiveModal('roof');
                    } else if (item.id === 'elevations') {
                      setActiveModal('elevations');
                    } else if (item.id === 'squaring') {
                      setActiveModal('squaring');
                    } else if (item.id === 'wall') {
                      setActiveModal('wall');
                    }
                  }}
                >
                  <div className="flex items-center gap-4">
                    {/* Tool Icon */}
                    <div className={`p-2 rounded-lg ${item.iconBgClass}`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    {/* Text Content */}
                    <div>
                      <h4 className="text-slate-900 dark:text-white font-bold text-base">{item.title}</h4>
                      <p className="text-slate-500 dark:text-slate-400 text-xs">{item.subtitle}</p>
                    </div>
                  </div>
                  
                  {/* Action Icons */}
                  <div className="flex items-center gap-3">
                    {/* Navigation Chevron */}
                    <ChevronRight className="w-5 h-5 text-slate-400 dark:text-slate-500"/>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {activeModal === 'stair' && (
        <StairCalculationsModal onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'concrete' && (
        <ConcreteEstimatingModal onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'bfm' && (
        <BFMModal onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'roof' && (
        <RoofFramingModal onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'elevations' && (
        <ElevationsModal onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'squaring' && (
        <SquaringModal onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'wall' && (
        <WallFramingModal onClose={() => setActiveModal(null)} />
      )}
    </div>
  );
}
