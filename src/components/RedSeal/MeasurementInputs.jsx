import React from 'react'

/**
 * Reusable Imperial measurement input for Feet/Inches/Fractions or Inches/Fractions.
 * Mode:
 *  - 'feet-inches': renders Feet, Inches, Fraction Numerator, Fraction Denominator
 *  - 'inches-only': renders Inches, Fraction Numerator, Fraction Denominator
 */
export function ImperialInput({ mode = 'feet-inches', value, onChange }) {
  const feet = value?.feet ?? '0'
  const inches = value?.inches ?? '0'
  const fractionNum = value?.fractionNum ?? '0'
  const fractionDen = value?.fractionDen ?? '1'

  const updateField = (field, newVal) => {
    if (!onChange) return
    onChange({
      feet: field === 'feet' ? newVal : feet,
      inches: field === 'inches' ? newVal : inches,
      fractionNum: field === 'fractionNum' ? newVal : fractionNum,
      fractionDen: field === 'fractionDen' ? newVal : fractionDen,
    })
  }

  const fractionOptions = ['1', '2', '4', '8', '16', '32']

  if (mode === 'inches-only') {
    return (
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Inches</label>
          <input
            type="number"
            min="0"
            value={inches}
            onChange={(e) => updateField('inches', e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 text-white font-mono text-center rounded-lg p-2 text-sm focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none"
            placeholder="in"
          />
        </div>
        <div>
          <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Num (/)</label>
          <input
            type="number"
            min="0"
            value={fractionNum}
            onChange={(e) => updateField('fractionNum', e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 text-white font-mono text-center rounded-lg p-2 text-sm focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none"
            placeholder="num"
          />
        </div>
        <div>
          <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Den (\)</label>
          <select
            value={fractionDen}
            onChange={(e) => updateField('fractionDen', e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 text-white font-mono text-center rounded-lg p-2 text-sm focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none bg-slate-900"
          >
            {fractionOptions.map((den) => (
              <option key={den} value={den}>/{den}</option>
            ))}
          </select>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-4 gap-2">
      <div>
        <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Feet</label>
        <input
          type="number"
          min="0"
          value={feet}
          onChange={(e) => updateField('feet', e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 text-white font-mono text-center rounded-lg p-2 text-sm focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none"
          placeholder="ft"
        />
      </div>
      <div>
        <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Inches</label>
        <input
          type="number"
          min="0"
          max="11"
          value={inches}
          onChange={(e) => updateField('inches', e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 text-white font-mono text-center rounded-lg p-2 text-sm focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none"
          placeholder="in"
        />
      </div>
      <div>
        <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Num (/)</label>
        <input
          type="number"
          min="0"
          value={fractionNum}
          onChange={(e) => updateField('fractionNum', e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 text-white font-mono text-center rounded-lg p-2 text-sm focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none"
          placeholder="num"
        />
      </div>
      <div>
        <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Den (\)</label>
        <select
          value={fractionDen}
          onChange={(e) => updateField('fractionDen', e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 text-white font-mono text-center rounded-lg p-2 text-sm focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none bg-slate-900"
        >
          {fractionOptions.map((den) => (
            <option key={den} value={den}>/{den}</option>
          ))}
        </select>
      </div>
    </div>
  )
}

/**
 * Reusable Metric input with direct mm/cm/m unit segmented toggle.
 */
export function MetricInput({ value, unit = 'mm', onChange }) {
  const numericValue = value ?? ''
  const activeUnit = unit ?? 'mm'

  const handleValChange = (e) => {
    if (!onChange) return
    onChange({
      value: e.target.value,
      unit: activeUnit,
    })
  }

  const handleUnitChange = (newUnit) => {
    if (!onChange) return
    onChange({
      value: numericValue,
      unit: newUnit,
    })
  }

  return (
    <div className="flex gap-2 items-stretch">
      <div className="relative flex-1">
        <input
          type="number"
          value={numericValue}
          onChange={handleValChange}
          className="w-full bg-slate-950 border-2 border-slate-700 text-white font-mono text-center rounded-lg p-2.5 text-lg focus:border-amber-400 focus:outline-none"
          placeholder={`e.g., 1000`}
        />
      </div>
      <div className="flex bg-slate-900 border-2 border-slate-800 rounded-lg p-1 items-center gap-1 shadow-md">
        {['mm', 'cm', 'm'].map((u) => (
          <button
            key={u}
            type="button"
            onClick={() => handleUnitChange(u)}
            className={`px-3 py-1.5 text-[10px] font-black uppercase rounded transition-all cursor-pointer ${
              activeUnit === u
                ? 'bg-amber-400 text-black shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {u}
          </button>
        ))}
      </div>
    </div>
  )
}
