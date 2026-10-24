import React, { useState, useMemo } from 'react'
import { Search, Info, HelpCircle, Eye, Columns } from 'lucide-react'
import {
  formatDualDisplay,
  convertMmToAll
} from '../../hooks/useUnitConverter'

export default function NBCSpanTables() {
  const [spanTableMode, setSpanTableMode] = useState('floor') // 'floor' or 'roof'
  const [searchQuery, setSearchQuery] = useState('')
  const [unitSystem, setUnitSystem] = useState('both') // 'both', 'metric', 'imperial'
  const [minSpanInput, setMinSpanInput] = useState('') // to search/filter by a minimum span required (in feet or mm)

  const spanTableData = {
    floor: [
      { size: '2x4', nominal: '38x89 mm', spacing12: 2310, spacing16: 1980, spacing24: 1510 },
      { size: '2x6', nominal: '38x140 mm', spacing12: 3240, spacing16: 2910, spacing24: 2420 },
      { size: '2x8', nominal: '38x184 mm', spacing12: 4010, spacing16: 3660, spacing24: 3070 },
      { size: '2x10', nominal: '38x235 mm', spacing12: 5130, spacing16: 4670, spacing24: 3910 },
      { size: '2x12', nominal: '38x286 mm', spacing12: 6250, spacing16: 5690, spacing24: 4620 }
    ],
    roof: [
      { size: '2x4', nominal: '38x89 mm', spacing12: 2950, spacing16: 2510, spacing24: 1980 },
      { size: '2x6', nominal: '38x140 mm', spacing12: 4120, spacing16: 3740, spacing24: 3100 },
      { size: '2x8', nominal: '38x184 mm', spacing12: 4980, spacing16: 4520, spacing24: 3860 },
      { size: '2x10', nominal: '38x235 mm', spacing12: 6350, spacing16: 5770, spacing24: 4850 },
      { size: '2x12', nominal: '38x286 mm', spacing12: 7720, spacing16: 7010, spacing24: 5770 }
    ]
  }

  // Helper to format values dynamically depending on selected unit system
  const renderValue = (mmVal) => {
    if (unitSystem === 'metric') {
      return `${mmVal} mm`
    }
    const data = convertMmToAll(mmVal)
    if (unitSystem === 'imperial') {
      const ftStr = data.ft > 0 ? `${data.ft}' ` : ''
      const fracStr = data.fracDisplay ? ` ${data.fracDisplay}` : ''
      return `${ftStr}${data.inch}${fracStr}"`
    }
    // 'both' mode
    const ftStr = data.ft > 0 ? `${data.ft}' ` : ''
    const fracStr = data.fracDisplay ? ` ${data.fracDisplay}` : ''
    return `${mmVal} mm (${ftStr}${data.inch}${fracStr}")`
  }

  // Convert a search input into mm to perform physical math filtering
  const parsedMinSpanMm = useMemo(() => {
    if (!minSpanInput.trim()) return 0
    // Try to parse number
    const num = parseFloat(minSpanInput)
    if (isNaN(num)) return 0
    
    // If input is small (e.g., < 30), assume feet and convert to mm (1 ft = 304.8 mm)
    if (num < 30) {
      return num * 304.8
    }
    // Otherwise assume mm
    return num
  }, [minSpanInput])

  // Filters the table rows based on search query AND minimum span constraint
  const filteredData = useMemo(() => {
    const rawList = spanTableData[spanTableMode]
    return rawList.filter(row => {
      // 1. Text Search Filter (matches "2x8", "38x184", etc.)
      const textMatch = searchQuery.trim() === '' || 
        row.size.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.nominal.toLowerCase().includes(searchQuery.toLowerCase())

      // 2. Minimum Span filter (finds boards that can span at least X distance)
      // We check if ANY of the spacings (12", 16", 24") can satisfy the required span
      const spanMatch = parsedMinSpanMm === 0 || 
        row.spacing12 >= parsedMinSpanMm ||
        row.spacing16 >= parsedMinSpanMm ||
        row.spacing24 >= parsedMinSpanMm

      return textMatch && spanMatch
    })
  }, [spanTableMode, searchQuery, parsedMinSpanMm])

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
      <div className="flex flex-col lg:flex-row justify-between lg:items-center border-b border-slate-150 dark:border-slate-800 pb-4 gap-4">
        <div>
          <span className="text-[10px] bg-brand-500/10 text-brand-600 dark:text-brand-400 px-2.5 py-1 rounded font-black uppercase tracking-wider">
            National Building Code of Canada (NBC 9.23)
          </span>
          <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1 uppercase tracking-tight">
            Code Span Tables (NBC 9.23)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
            Maximum allowable spans for Spruce-Pine-Fir (SPF) No. 1 / No. 2 structural lumber.
          </p>
        </div>

        {/* CONTROLS AREA */}
        <div className="flex flex-wrap items-center gap-3">
          {/* UNIT SYSTEM SWITCHER */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            {['both', 'metric', 'imperial'].map((sys) => (
              <button
                key={sys}
                onClick={() => setUnitSystem(sys)}
                className={`px-2.5 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${
                  unitSystem === sys
                    ? 'bg-brand-500 text-white shadow'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {sys === 'both' ? 'Both' : sys}
              </button>
            ))}
          </div>

          {/* TAB SELECT FOR FLOORS / ROOFS */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setSpanTableMode('floor')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                spanTableMode === 'floor'
                  ? 'bg-brand-500 text-white shadow'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Floor Joists
            </button>
            <button
              onClick={() => setSpanTableMode('roof')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                spanTableMode === 'roof'
                  ? 'bg-brand-500 text-white shadow'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Roof Rafters
            </button>
          </div>
        </div>
      </div>

      {/* FILTER SEARCH PANEL */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-850 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800/80">
        {/* TEXT SEARCH */}
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            Filter by Lumber Size
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 dark:text-slate-500">
              <Search size={14} />
            </span>
            <input
              type="text"
              placeholder="e.g. 2x8, 2x10, 38x235..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-xs font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        {/* MINIMUM SPAN FILTER */}
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            Filter by Minimum Target Span Needed
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. 12 (for 12 ft) or 4000 (for 4 meters)..."
              value={minSpanInput}
              onChange={(e) => setMinSpanInput(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-xs font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            {minSpanInput && (
              <button
                onClick={() => setMinSpanInput('')}
                className="px-3 text-xs font-black bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl transition-all"
              >
                Clear
              </button>
            )}
          </div>
          <p className="text-[9px] text-slate-400 dark:text-slate-500 font-medium">
            Shows only rows capable of spanning the specified distance. Inputs &lt; 30 are treated as feet, &gt;= 30 as mm.
          </p>
        </div>
      </div>

      {/* CODE SPECIFICATIONS DETAILS CARD */}
      <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800/80 space-y-2">
        <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase flex items-center gap-1.5">
          <Info size={14} className="text-brand-500" />
          {spanTableMode === 'floor' ? 'Floor Loading Criteria' : 'Roof Snow Load Criteria'}
        </h4>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
          {spanTableMode === 'floor' 
            ? 'Calculated for living areas (40 psf / 1.9 kPa live load) with standard plaster or gypsum drywall ceilings. Deflection limit is L/360. Bridging, strapping, or blocking is required for joist spans exceeding 13 feet (3.96 meters) to prevent rotation.'
            : 'Calculated for roof snow load of 30 psf (1.5 kPa). Slopes 1:3 to less than 1:1, deflection limit is L/240. Roof rafters require ceiling joists or a structural ridge beam to prevent rafter thrust/walls spreading.'
          }
        </p>
      </div>

      {/* EXQUISITE RESPONSIVE TABLE */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-850 text-[10px] font-black uppercase text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <th className="p-4">Lumber Size (SPF #1/#2)</th>
              <th className="p-4 text-center">12" O.C. Spacing (300 mm)</th>
              <th className="p-4 text-center">16" O.C. Spacing (400 mm)</th>
              <th className="p-4 text-center">24" O.C. Spacing (600 mm)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-bold text-xs">
            {filteredData.length > 0 ? (
              filteredData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/20 transition-colors">
                  <td className="p-4 font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-brand-500" />
                    <div>
                      <span className="text-sm font-black text-slate-900 dark:text-white block">{row.size}</span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium block">Nominal: {row.nominal}</span>
                    </div>
                  </td>
                  <td className="p-4 text-center font-mono text-slate-700 dark:text-slate-300">
                    <span className={parsedMinSpanMm > 0 && row.spacing12 < parsedMinSpanMm ? 'text-red-500 line-through opacity-50' : 'text-slate-800 dark:text-slate-100 font-extrabold'}>
                      {renderValue(row.spacing12)}
                    </span>
                  </td>
                  <td className="p-4 text-center font-mono text-slate-700 dark:text-slate-300">
                    <span className={parsedMinSpanMm > 0 && row.spacing16 < parsedMinSpanMm ? 'text-red-500 line-through opacity-50' : 'text-slate-800 dark:text-slate-100 font-extrabold'}>
                      {renderValue(row.spacing16)}
                    </span>
                  </td>
                  <td className="p-4 text-center font-mono text-slate-700 dark:text-slate-300">
                    <span className={parsedMinSpanMm > 0 && row.spacing24 < parsedMinSpanMm ? 'text-red-500 line-through opacity-50' : 'text-slate-800 dark:text-slate-100 font-extrabold'}>
                      {renderValue(row.spacing24)}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-400 dark:text-slate-500 font-bold">
                  No structural joists or rafters found matching your filter criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* JOBSITE EXPLANATION NOTES */}
      <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl space-y-1 text-amber-900 dark:text-amber-400">
        <span className="text-[10px] font-black uppercase tracking-wider block">Jobsite Rule of Thumb</span>
        <p className="text-[11px] font-semibold leading-relaxed">
          <strong>"Depth in Inches minus 2"</strong> gives you the safe span in feet for 16" O.C. floor joists. E.g. a 2x10 (9.25" deep) has a safe span of roughly 10 - 2 = 8 feet for heavy loads, though NBC permits further. Always refer to official tables for final framing layout approval.
        </p>
      </div>
    </div>
  )
}
