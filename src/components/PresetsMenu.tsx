import React, { useState, useEffect } from 'react';
import { Calculator, X, Play, PlusCircle, Triangle, Square, Box, Ruler, LayoutGrid, Layers, Cylinder, Activity } from 'lucide-react';

interface PresetField {
  name: string;
  type: 'dimension' | 'number' | 'dropdown';
  placeholder?: string;
  options?: { label: string; value: number }[];
}

interface Preset {
  id: string;
  name: string;
  description: string;
  fields: PresetField[];
  compute: (vals: number[], unitMode: 'imp'|'met') => { val: number; dim: number; displayStr: string; materials?: { count: number; label: string; note?: string } };
  formatTape: (vals: number[], unitMode: 'imp'|'met') => string;
}

const PRESETS: Preset[] = [
  {
    id: 'rect_area',
    name: 'Rectangle / Square Area',
    description: 'Calculate total area (Length × Width).',
    fields: [
      { name: 'Length', type: 'dimension' },
      { name: 'Width', type: 'dimension' }
    ],
    compute: (vals, mode) => {
      let in2 = vals[0] * vals[1];
      if (mode === 'met') {
        in2 = in2 / 645.16;
      }
      const sqFt = in2 / 144;
      const displayStr = mode === 'imp' ? `${sqFt.toFixed(2)} SQ FT` : `${(vals[0]*vals[1]/1000000).toFixed(2)} SQ M`;
      
      return { val: vals[0]*vals[1], dim: 2, displayStr };
    },
    formatTape: (vals, mode) => {
      if (mode === 'imp') return `${(vals[0]/12).toFixed(2)}' * ${(vals[1]/12).toFixed(2)}'`;
      return `${(vals[0]/1000).toFixed(2)}m * ${(vals[1]/1000).toFixed(2)}m`;
    }
  },
  {
    id: 'slab_vol',
    name: 'Concrete Slab Volume',
    description: 'Calculate total volume for a rectangular slab.',
    fields: [
      { name: 'Length', type: 'dimension' },
      { name: 'Width', type: 'dimension' },
      { name: 'Thickness', type: 'dimension' }
    ],
    compute: (vals, mode) => {
      let in3 = vals[0] * vals[1] * vals[2];
      if (mode === 'met') {
        in3 = in3 / 16387.064;
      }
      const cuFt = in3 / 1728;
      const cuYd = cuFt / 27;
      const bags = Math.ceil((cuFt / 0.45) * 1.05);
      
      const displayStr = mode === 'imp' ? `${cuYd.toFixed(2)} CU YD (${cuFt.toFixed(2)} CU FT)` : `${(vals[0]*vals[1]*vals[2]/1000000000).toFixed(2)} CU M`;
      
      return { 
        val: vals[0]*vals[1]*vals[2], 
        dim: 3, 
        displayStr,
        materials: { count: bags, label: '60lb bags', note: '(incl. 5% waste)' } 
      };
    },
    formatTape: (vals, mode) => {
      if (mode === 'imp') return `${(vals[0]/12).toFixed(2)}' * ${(vals[1]/12).toFixed(2)}' * ${vals[2].toFixed(2)}"`;
      return `${(vals[0]/1000).toFixed(2)}m * ${(vals[1]/1000).toFixed(2)}m * ${(vals[2]/10).toFixed(2)}cm`;
    }
  },
  {
    id: 'sonotube',
    name: 'Sonotube Concrete',
    description: 'Calculate volume and bags for a cylindrical hole.',
    fields: [
      { name: 'Tube Diameter', type: 'dropdown', options: [
        { label: '8"', value: 8 },
        { label: '10"', value: 10 },
        { label: '12"', value: 12 },
        { label: '14"', value: 14 },
        { label: '16"', value: 16 }
      ] },
      { name: 'Hole Depth', type: 'dimension' }
    ],
    compute: (vals, mode) => {
      let radiusIn = vals[0] / 2;
      let depthIn = mode === 'met' ? vals[1] / 25.4 : vals[1];
      let volIn3 = Math.PI * radiusIn * radiusIn * depthIn;
      let cuFt = volIn3 / 1728;
      let cuYd = cuFt / 27;
      let bags = Math.ceil((cuFt / 0.45) * 1.05);
      
      let volMm3 = volIn3 * 16387.064;
      let cuM = volMm3 / 1000000000;
      
      let valReturn = mode === 'met' ? volMm3 : volIn3;
      let displayStr = mode === 'imp' ? `${cuYd.toFixed(2)} CU YD (${cuFt.toFixed(2)} CU FT)` : `${cuM.toFixed(2)} CU M`;
      
      return { 
        val: valReturn, 
        dim: 3, 
        displayStr,
        materials: { count: bags, label: '60lb bags', note: '(incl. 5% waste)' } 
      };
    },
    formatTape: (vals, mode) => {
      if (mode === 'imp') return `Sonotube ${vals[0]}" x ${(vals[1]/12).toFixed(2)}'`;
      return `Sonotube ${vals[0]}" x ${(vals[1]/1000).toFixed(2)}m`;
    }
  },
  {
    id: 'sheet_count',
    name: '4x8 Sheet Count',
    description: 'Calculate drywall or plywood sheets needed.',
    fields: [
      { name: 'Total Area (Length)', type: 'dimension' },
      { name: 'Total Area (Width)', type: 'dimension' }
    ],
    compute: (vals, mode) => {
      let areaIn2 = vals[0] * vals[1];
      if (mode === 'met') {
        areaIn2 = areaIn2 / 645.16; // mm2 to in2
      }
      const sqFt = areaIn2 / 144;
      const sheets = Math.ceil(sqFt / 32);
      
      const displayStr = mode === 'imp' ? `${sqFt.toFixed(2)} SQ FT` : `${(vals[0]*vals[1]/1000000).toFixed(2)} SQ M`;

      return { 
        val: vals[0]*vals[1], 
        dim: 2, 
        displayStr,
        materials: { count: sheets, label: '4x8 Sheets', note: '(recommend +10% waste)' } 
      };
    },
    formatTape: (vals, mode) => {
      if (mode === 'imp') return `Area: ${(vals[0]/12).toFixed(2)}' * ${(vals[1]/12).toFixed(2)}'`;
      return `Area: ${(vals[0]/1000).toFixed(2)}m * ${(vals[1]/1000).toFixed(2)}m`;
    }
  },
  {
    id: 'wall_studs',
    name: 'Wall Stud Count',
    description: 'Calculate required studs for a wall length.',
    fields: [
      { name: 'Wall Length', type: 'dimension' },
      { name: 'On-Center Spacing (in/mm)', type: 'number', placeholder: 'e.g. 16 or 24' }
    ],
    compute: (vals, mode) => {
      const spacing = vals[1] || 16;
      const studs = Math.ceil(vals[0] / spacing) + 1;
      return { val: studs, dim: 0, displayStr: `${studs} Studs` };
    },
    formatTape: (vals, mode) => {
      const spacing = vals[1] || 16;
      if (mode === 'imp') return `(${vals[0].toFixed(2)}" / ${spacing}") + 1 Studs`;
      return `(${vals[0].toFixed(2)}mm / ${spacing}mm) + 1 Studs`;
    }
  },
  {
    id: 'board_feet',
    name: 'Board Feet Calculator',
    description: 'Calculate lumber volume in Board Feet (BF).',
    fields: [
      { name: 'Thickness', type: 'dimension' },
      { name: 'Width', type: 'dimension' },
      { name: 'Length', type: 'dimension' }
    ],
    compute: (vals, mode) => {
      let in3 = vals[0] * vals[1] * vals[2];
      if (mode === 'met') {
        in3 = in3 / 16387.064;
      }
      const bf = in3 / 144;
      return { val: bf, dim: 0, displayStr: `${bf.toFixed(2)} BF` };
    },
    formatTape: (vals, mode) => {
      if (mode === 'imp') return `(${vals[0].toFixed(2)}" * ${vals[1].toFixed(2)}" * ${(vals[2]/12).toFixed(2)}') / 12 BF`;
      return `(${vals[0].toFixed(2)}mm * ${vals[1].toFixed(2)}mm * ${(vals[2]/1000).toFixed(2)}m) -> BF`;
    }
  },
  {
    id: 'triangle_area',
    name: 'Triangle Area',
    description: 'Calculate area given base and height.',
    fields: [
      { name: 'Base', type: 'dimension' },
      { name: 'Height', type: 'dimension' }
    ],
    compute: (vals, mode) => {
      let in2 = 0.5 * vals[0] * vals[1];
      if (mode === 'met') {
        in2 = in2 / 645.16;
      }
      const sqFt = in2 / 144;
      const displayStr = mode === 'imp' ? `${sqFt.toFixed(2)} SQ FT` : `${(0.5*vals[0]*vals[1]/1000000).toFixed(2)} SQ M`;
      
      return { val: 0.5*vals[0]*vals[1], dim: 2, displayStr };
    },
    formatTape: (vals, mode) => {
      if (mode === 'imp') return `0.5 * ${(vals[0]/12).toFixed(2)}' * ${(vals[1]/12).toFixed(2)}'`;
      return `0.5 * ${(vals[0]/1000).toFixed(2)}m * ${(vals[1]/1000).toFixed(2)}m`;
    }
  },
  {
    id: 'stair_rise',
    name: 'Total Stair Rise',
    description: 'Calculate total rise from number of steps.',
    fields: [
      { name: 'Number of Steps', type: 'number', placeholder: 'e.g. 12' },
      { name: 'Unit Rise', type: 'dimension' }
    ],
    compute: (vals, mode) => {
      const rise = vals[0] * vals[1];
      const displayStr = mode === 'imp' ? `${(rise/12).toFixed(2)}' (${rise.toFixed(2)}")` : `${(rise/10).toFixed(2)}cm`;
      return { val: rise, dim: 1, displayStr };
    },
    formatTape: (vals, mode) => {
      if (mode === 'imp') return `${vals[0]} * ${vals[1].toFixed(2)}"`;
      return `${vals[0]} * ${vals[1].toFixed(2)}mm`;
    }
  }
];

function DimensionInput({ value, onChange, unitMode, accentColor = "#00d2ff" }: { value?: number, onChange: (v: number) => void, unitMode: 'imp'|'met', accentColor?: string }) {
  const [ft, setFt] = useState('');
  const [inch, setInch] = useState('');
  const [frac, setFrac] = useState(0);

  const [metVal, setMetVal] = useState('');
  const [metUnit, setMetUnit] = useState<'mm'|'cm'|'m'>('mm');

  useEffect(() => {
    if (unitMode === 'imp') {
      const f = parseFloat(ft) || 0;
      const i = parseFloat(inch) || 0;
      onChange(f * 12 + i + frac);
    } else {
      const v = parseFloat(metVal) || 0;
      let multiplier = 1;
      if (metUnit === 'cm') multiplier = 10;
      if (metUnit === 'm') multiplier = 1000;
      onChange(v * multiplier);
    }
  }, [ft, inch, frac, metVal, metUnit, unitMode]);

  if (unitMode === 'imp') {
    return (
      <div className="flex gap-2 w-full">
        <div className="flex-[1.2] relative">
          <input inputMode="decimal" type="number" 
            placeholder="0"
            value={ft}
            onChange={e => setFt(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-[#333] shadow-inner rounded-lg p-3 text-sm focus:outline-none focus:ring-2  transition-all text-white font-mono pr-8"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-xs pointer-events-none">FT</span>
        </div>
        <div className="flex-[1.2] relative">
          <input inputMode="decimal" type="number" 
            placeholder="0"
            value={inch}
            onChange={e => setInch(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-[#333] shadow-inner rounded-lg p-3 text-sm focus:outline-none focus:ring-2  transition-all text-white font-mono pr-8"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-xs pointer-events-none">IN</span>
        </div>
        <div className="flex-1 relative">
          <select 
            value={frac}
            onChange={e => setFrac(parseFloat(e.target.value))}
            className="w-full h-full bg-[#1a1a1a] border border-[#333] shadow-inner rounded-lg pl-2 pr-4 text-sm focus:outline-none focus:ring-2  transition-all text-white font-mono appearance-none"
          >
            <option value={0}>0"</option>
            <option value={0.125}>1/8"</option>
            <option value={0.25}>1/4"</option>
            <option value={0.375}>3/8"</option>
            <option value={0.5}>1/2"</option>
            <option value={0.625}>5/8"</option>
            <option value={0.75}>3/4"</option>
            <option value={0.875}>7/8"</option>
          </select>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2 w-full">
      <input inputMode="decimal" type="number" 
        placeholder="0.0"
        value={metVal}
        onChange={e => setMetVal(e.target.value)}
        className="flex-1 bg-[#1a1a1a] border border-[#333] shadow-inner rounded-lg p-3 text-sm focus:outline-none focus:ring-2  transition-all text-white font-mono"
      />
      <div className="flex items-center p-1 rounded-lg border bg-[#1a1a1a] border-[#333]">
        <button 
          onClick={() => setMetUnit('mm')}
          className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-md transition-all ${metUnit !== 'mm' ? 'text-gray-500 hover:text-gray-400' : ''}`} style={metUnit === 'mm' ? { color: accentColor, backgroundColor: `${accentColor}20` } : {}}
        >mm</button>
        <button 
          onClick={() => setMetUnit('cm')}
          className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-md transition-all ${metUnit !== 'cm' ? 'text-gray-500 hover:text-gray-400' : ''}`} style={metUnit === 'cm' ? { color: accentColor, backgroundColor: `${accentColor}20` } : {}}
        >cm</button>
        <button 
          onClick={() => setMetUnit('m')}
          className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-md transition-all ${metUnit !== 'm' ? 'text-gray-500 hover:text-gray-400' : ''}`} style={metUnit === 'm' ? { color: accentColor, backgroundColor: `${accentColor}20` } : {}}
        >m</button>
      </div>
    </div>
  );
}

interface PresetsMenuProps {
  accentColor?: string;
  isOpen: boolean;
  onClose: () => void;
  unitMode: 'imp' | 'met';
  onInject: (val: number, dim: number, tapeStr: string) => void;
  onSwitchTool?: (toolId: string) => void;
}

interface CalcResult {
  val: number;
  dim: number;
  tapeStr: string;
  displayStr: string;
  materials?: { count: number; label: string; note?: string };
}

export default function PresetsMenu({ isOpen, onClose, unitMode, onInject, onSwitchTool, accentColor = "#06b6d4" }: PresetsMenuProps) {
  const [activePreset, setActivePreset] = useState<Preset | null>(null);
  const [fieldVals, setFieldVals] = useState<number[]>([]);
  const [result, setResult] = useState<CalcResult | null>(null);

  if (!isOpen) return null;

  const handleSelect = (p: Preset) => {
    setActivePreset(p);
    setFieldVals(p.fields.map(f => f.type === 'dropdown' ? (f.options?.[0]?.value || 0) : 0));
    setResult(null);
  };

  const handleCalculate = () => {
    if (!activePreset) return;
    const res = activePreset.compute(fieldVals, unitMode);
    const tape = activePreset.formatTape(fieldVals, unitMode);
    setResult({
      val: res.val,
      dim: res.dim,
      displayStr: res.displayStr,
      materials: res.materials,
      tapeStr: tape
    });
  };

  const handleSaveToTape = () => {
    if (!result) return;
    onInject(result.val, result.dim, result.tapeStr);
    onClose();
    setActivePreset(null);
    setResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-sm h-full bg-white dark:bg-[#121417] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
        <div className="p-4 pb-4 px-4 border-b border-gray-200 dark:border-[#2D333D] bg-gray-50 dark:bg-[#1A1D23] flex justify-between items-center" style={{ paddingTop: 'calc(2.5rem + env(safe-area-inset-top, 0px))' }}>
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 flex items-center gap-2">
            <Calculator className="w-4 h-4" />
            Formula Presets
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-900 dark:text-white" aria-label="Close Presets">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-[calc(8rem+env(safe-area-inset-bottom))]">
          {!activePreset ? (
            <div className="flex flex-col gap-3">

              {/* NEW: Squaring Tool Navigation Button */}
              <button 
                onClick={() => {
                  if (onSwitchTool) {
                    onSwitchTool('sq');
                    onClose();
                  }
                }}
                className="relative shrink-0 w-full flex items-start gap-4 p-4 rounded-xl transition-all text-left group overflow-hidden" style={{ backgroundColor: `${accentColor}10`, borderColor: `${accentColor}30`, borderWidth: "1px" }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = `${accentColor}20`; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = `${accentColor}10`; }}
              >
                {/* Navigation Indicator Badge */}
                <div className="absolute top-0 right-0 text-[9px] font-bold px-2 py-0.5 rounded-bl-lg uppercase tracking-wider" style={{ backgroundColor: `${accentColor}40`, color: "#fff" }}>
                  Quick Jump
                </div>
                
                <div className="mt-0.5 p-2 rounded-lg shadow-sm group-hover:scale-110 transition-transform" style={{ backgroundColor: `${accentColor}20`, color: accentColor }}>
                  <Triangle size={18}/>
                </div>
                
                <div>
                  <div className="[text-shadow:0px_1px_0px_rgba(255,255,255,0.7)] dark:[text-shadow:0px_1.5px_2px_rgba(0,0,0,0.8)] font-extrabold text-sm tracking-wide transition-colors" style={{ color: accentColor }}>
                    Squaring / Right Triangle
                  </div>
                  <div className="text-xs mt-1 font-medium leading-relaxed" style={{ color: accentColor, opacity: 0.7 }}>
                    Quick jump to the Rise, Run, and Diagonal calculator for perfect 90° corners.
                  </div>
                </div>
              </button>

              {/* UPGRADED STANDARD PRESET PATTERN */}
              {PRESETS.map(p => {
                let Icon = Calculator;
                if (p.id === 'rect_area') Icon = Square;
                else if (p.id === 'slab_vol') Icon = Box;
                else if (p.id === 'sonotube') Icon = Cylinder;
                else if (p.id === 'sheet_count') Icon = LayoutGrid;
                else if (p.id === 'wall_studs') Icon = Layers;
                else if (p.id === 'board_feet') Icon = Ruler;
                else if (p.id === 'triangle_area') Icon = Triangle;
                else if (p.id === 'stair_rise') Icon = Activity;

                return (
                  <button 
                    key={p.id}
                    onClick={() => handleSelect(p)}
                    className="shrink-0 w-full flex items-start gap-4 p-4 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-slate-600 hover:bg-slate-800/50 transition-all text-left group"
                  >
                    <div className="mt-0.5 p-2 rounded-lg bg-slate-800 text-slate-400 transition-colors" onMouseEnter={(e) => { e.currentTarget.style.color = accentColor; }} onMouseLeave={(e) => { e.currentTarget.style.color = ""; }}>
                      <Icon size={18}/>
                    </div>
                    <div>
                      <div className="font-bold text-slate-200 text-sm tracking-wide group-hover:text-white transition-colors">
                        {p.name}
                      </div>
                      <div className="text-xs text-slate-500 mt-1 font-medium">
                        {p.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-6">
              <button onClick={() => { setActivePreset(null); setResult(null); }} className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest transition-colors" onMouseEnter={(e) => { e.currentTarget.style.color = accentColor; }} onMouseLeave={(e) => { e.currentTarget.style.color = ""; }}>
                ← Back to Presets
              </button>
              
              <div className="space-y-1">
                <h3 className="font-bold text-lg text-gray-900 dark:text-gray-900 dark:text-white">{activePreset.name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">{activePreset.description}</p>
              </div>

              <div className="space-y-5">
                {activePreset.fields.map((f, i) => (
                  <div key={`${activePreset.id}-${i}`} className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                      {f.name}
                    </label>
                    {f.type === 'dimension' ? (
                      <DimensionInput 
                        unitMode={unitMode}
                        onChange={(v) => {
                          const newVals = [...fieldVals];
                          newVals[i] = v;
                          setFieldVals(newVals);
                        }}
                      />
                    ) : f.type === 'dropdown' ? (
                      <select
                        onChange={(e) => {
                          const newVals = [...fieldVals];
                          newVals[i] = parseFloat(e.target.value);
                          setFieldVals(newVals);
                        }}
                        value={fieldVals[i] || (f.options?.[0]?.value || 0)}
                        className="w-full bg-[#1a1a1a] border border-[#333] shadow-inner rounded-lg p-3 text-sm focus:outline-none focus:ring-2  transition-all text-white font-mono"
                      >
                        {f.options?.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                      </select>
                    ) : (
                      <input inputMode="decimal" type="number"
                        onChange={(e) => {
                          const newVals = [...fieldVals];
                          newVals[i] = parseFloat(e.target.value) || 0;
                          setFieldVals(newVals);
                        }}
                        className="w-full bg-[#1a1a1a] border border-[#333] shadow-inner rounded-lg p-3 text-sm focus:outline-none focus:ring-2  transition-all text-white font-mono"
                        placeholder={f.placeholder || "0"}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="pt-4 space-y-4">
                <button
                  onClick={handleCalculate}
                  className="w-full py-4 text-black font-bold border-b-4 border-black/30 active:border-b-0 active:translate-y-1 shadow-[0_0_15px_rgba(0,0,0,0.3)] rounded-xl flex items-center justify-center gap-2 transition-all uppercase tracking-wider hover:brightness-110" style={{ backgroundColor: accentColor }}
                >
                  <Play className="w-4 h-4 fill-black" />
                  CALCULATE
                </button>

                {result && (
                  <div className="bg-[#111] border border-[#333] p-4 rounded-xl flex flex-col gap-3 animate-in fade-in slide-in-from-top-4">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Result</div>
                      <div className="text-xl font-bold text-white font-mono">{result.displayStr}</div>
                    </div>
                    
                    {result.materials && (
                      <div className="pt-2 border-t border-[#333]">
                        <div className="[text-shadow:0px_1px_0px_rgba(255,255,255,0.7)] dark:[text-shadow:0px_1.5px_2px_rgba(0,0,0,0.8)] font-bold text-xl font-mono" style={{ color: accentColor }}>
                          Requires: ~{result.materials.count} {result.materials.label}
                        </div>
                        {result.materials.note && (
                          <div className="text-[10px] uppercase tracking-wider text-gray-500 mt-1">{result.materials.note}</div>
                        )}
                      </div>
                    )}

                    <button
                      onClick={handleSaveToTape}
                      className="[text-shadow:0px_1px_0px_rgba(255,255,255,0.7)] dark:[text-shadow:0px_1.5px_2px_rgba(0,0,0,0.8)] mt-2 w-full py-3 bg-[#1a1a1a] border border-[#333] hover:bg-[#222] font-bold rounded-lg flex items-center justify-center gap-2 transition-all uppercase tracking-wider text-xs" style={{ color: accentColor }}
                    >
                      <PlusCircle className="w-4 h-4" />
                      INSERT INTO CALC
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
