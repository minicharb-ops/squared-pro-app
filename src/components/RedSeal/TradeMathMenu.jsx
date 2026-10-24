import React, { useState } from 'react'
import { ChevronRight, Compass, Layers, Triangle, Hammer, X, Calculator, BookOpen , Ruler , Square , AlignJustify , Info } from 'lucide-react'

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


function StairCalculationsModal({ onClose }) {
  const [unitSystem, setUnitSystem] = useState('imperial');
  const [metricUnitMain, setMetricUnitMain] = useState('mm');
  const [metricUnitDepth, setMetricUnitDepth] = useState('mm');
  const [feet, setFeet] = useState('');
  const [inches, setInches] = useState('');
  const [fraction, setFraction] = useState('0');
  const [metricValue, setMetricValue] = useState('');
  const [results, setResults] = useState(null);
  const [activeTooltip, setActiveTooltip] = useState(null);

  const handleCalculate = () => {
    if (unitSystem === 'imperial' && !feet && !inches) return;
    if (unitSystem === 'metric' && !metricValue) return;
    
    // Dummy placeholder values as requested
    setResults({
      numRisers: '14',
      numTreads: '13',
      unitRise: unitSystem === 'imperial' ? '7 1/2"' : '190mm',
      unitRun: unitSystem === 'imperial' ? '10 1/2"' : '265mm',
      stringerLength: unitSystem === 'imperial' ? '168.3"' : '4275mm'
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-2xl w-full max-w-md shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 p-4 shrink-0 bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500 rounded-lg text-white">
              <Calculator size={24} />
            </div>
            <div>
              <h3 className="text-slate-900 dark:text-white text-base md:text-lg font-bold uppercase tracking-wider leading-tight">STAIR CALCULATIONS</h3>
              <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mt-0.5">ENTER TOTAL RISE TO CALCULATE DIMENSIONS</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition-colors p-1">
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Content (Scrollable) */}
        <div className="p-4 md:p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6">
          
          {/* Main Unit Toggle */}
          <div className="flex bg-slate-200 dark:bg-slate-800 rounded-lg p-1">
            <button
              onClick={() => setUnitSystem('imperial')}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${unitSystem === 'imperial' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              Imperial
            </button>
            <button
              onClick={() => setUnitSystem('metric')}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${unitSystem === 'metric' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              Metric
            </button>
          </div>

          {/* Input Section */}
          <div className="space-y-4">
            {unitSystem === 'imperial' ? (
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">
                    Total Rise
                  </label>
                  <button 
                    type="button"
                    onClick={() => setActiveTooltip(activeTooltip === 'totalRise' ? null : 'totalRise')}
                    className="text-slate-400 hover:text-blue-500 transition-colors p-0.5"
                  >
                    <Info size={14} />
                  </button>
                </div>
                {activeTooltip === 'totalRise' && (
                  <div className="text-xs text-slate-400 bg-slate-800 p-2 rounded mb-2 leading-relaxed">
                    The vertical distance from the finished lower floor surface to the finished upper floor surface.
                  </div>
                )}
                <div className="flex gap-2">
                  <div className="flex-1">
                    <input 
                      type="number" 
                      placeholder="Feet"
                      value={feet}
                      onChange={(e) => setFeet(e.target.value)}
                      className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl px-3 py-3 text-base md:text-lg font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div className="flex-1">
                    <input 
                      type="number" 
                      placeholder="Inches"
                      value={inches}
                      onChange={(e) => setInches(e.target.value)}
                      className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl px-3 py-3 text-base md:text-lg font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div className="flex-1">
                    <select
                      value={fraction}
                      onChange={(e) => setFraction(e.target.value)}
                      className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl px-2 py-3 text-base md:text-lg font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors appearance-none"
                    >
                      <option value="0">0</option>
                      <option value="1/16">1/16"</option>
                      <option value="1/8">1/8"</option>
                      <option value="3/16">3/16"</option>
                      <option value="1/4">1/4"</option>
                      <option value="5/16">5/16"</option>
                      <option value="3/8">3/8"</option>
                      <option value="7/16">7/16"</option>
                      <option value="1/2">1/2"</option>
                      <option value="9/16">9/16"</option>
                      <option value="5/8">5/8"</option>
                      <option value="11/16">11/16"</option>
                      <option value="3/4">3/4"</option>
                      <option value="13/16">13/16"</option>
                      <option value="7/8">7/8"</option>
                      <option value="15/16">15/16"</option>
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex bg-slate-100 dark:bg-slate-800/50 rounded-lg p-1 w-fit">
                  {['m', 'cm', 'mm'].map(unit => (
                    <button
                      key={unit}
                      onClick={() => setMetricUnitMain(unit)}
                      className={`px-4 py-1.5 text-xs font-bold uppercase rounded-md transition-colors ${metricUnitMain === unit ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                      {unit}
                    </button>
                  ))}
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">
                      Total Rise ({metricUnitMain})
                    </label>
                    <button 
                      type="button"
                      onClick={() => setActiveTooltip(activeTooltip === 'totalRise' ? null : 'totalRise')}
                      className="text-slate-400 hover:text-blue-500 transition-colors p-0.5"
                    >
                      <Info size={14} />
                    </button>
                  </div>
                  {activeTooltip === 'totalRise' && (
                    <div className="text-xs text-slate-400 bg-slate-800 p-2 rounded mb-2 leading-relaxed">
                      The vertical distance from the finished lower floor surface to the finished upper floor surface.
                    </div>
                  )}
                  <input 
                    type="number" 
                    placeholder={`e.g. ${metricUnitMain === 'mm' ? '2500' : metricUnitMain === 'cm' ? '250' : '2.5'}`}
                    value={metricValue}
                    onChange={(e) => setMetricValue(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-lg font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>
            )}

            <button 
              onClick={handleCalculate}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase tracking-wider py-3.5 rounded-xl transition-colors shadow-md active:scale-[0.98] mt-2"
            >
              Calculate
            </button>
          </div>

          {/* Results Card */}
          <div className="bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-xl p-4 md:p-5">
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">
              Calculation Results
            </h4>
            
            <div className="space-y-3 font-mono text-sm">
              <div className="flex flex-col border-b border-slate-200/50 dark:border-slate-700/50 pb-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-600 dark:text-slate-300">Number of Risers:</span>
                    <button 
                      type="button"
                      onClick={() => setActiveTooltip(activeTooltip === 'numRisers' ? null : 'numRisers')}
                      className="text-slate-400 hover:text-blue-500 transition-colors p-0.5"
                    >
                      <Info size={14} />
                    </button>
                  </div>
                  <span className="font-bold text-blue-600 dark:text-blue-400">{results ? results.numRisers : '--'}</span>
                </div>
                {activeTooltip === 'numRisers' && (
                  <div className="text-xs text-slate-400 bg-slate-800 p-2 rounded mt-1 leading-relaxed">
                    Total Rise divided by target rise (approx 7.5 inches or 190mm), rounded to nearest whole number.
                  </div>
                )}
              </div>

              <div className="flex flex-col border-b border-slate-200/50 dark:border-slate-700/50 pb-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-600 dark:text-slate-300">Number of Treads:</span>
                    <button 
                      type="button"
                      onClick={() => setActiveTooltip(activeTooltip === 'numTreads' ? null : 'numTreads')}
                      className="text-slate-400 hover:text-blue-500 transition-colors p-0.5"
                    >
                      <Info size={14} />
                    </button>
                  </div>
                  <span className="font-bold text-blue-600 dark:text-blue-400">{results ? results.numTreads : '--'}</span>
                </div>
                {activeTooltip === 'numTreads' && (
                  <div className="text-xs text-slate-400 bg-slate-800 p-2 rounded mt-1 leading-relaxed">
                    Always equals Number of Risers minus 1.
                  </div>
                )}
              </div>

              <div className="flex flex-col border-b border-slate-200/50 dark:border-slate-700/50 pb-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-600 dark:text-slate-300">
                      {unitSystem === 'imperial' ? 'Unit Rise (Max 7 7/8"):' : 'Unit Rise (Max 200mm):'}
                    </span>
                    <button 
                      type="button"
                      onClick={() => setActiveTooltip(activeTooltip === 'unitRise' ? null : 'unitRise')}
                      className="text-slate-400 hover:text-blue-500 transition-colors p-0.5"
                    >
                      <Info size={14} />
                    </button>
                  </div>
                  <span className="font-bold text-blue-600 dark:text-blue-400">{results ? results.unitRise : '--'}</span>
                </div>
                {activeTooltip === 'unitRise' && (
                  <div className="text-xs text-slate-400 bg-slate-800 p-2 rounded mt-1 leading-relaxed">
                    Exact height of each step riser, calculated as Total Rise ÷ Number of Risers.
                  </div>
                )}
              </div>

              <div className="flex flex-col border-b border-slate-200/50 dark:border-slate-700/50 pb-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-600 dark:text-slate-300">
                      {unitSystem === 'imperial' ? 'Unit Run (Min 10"):' : 'Unit Run (Min 255mm):'}
                    </span>
                    <button 
                      type="button"
                      onClick={() => setActiveTooltip(activeTooltip === 'unitRun' ? null : 'unitRun')}
                      className="text-slate-400 hover:text-blue-500 transition-colors p-0.5"
                    >
                      <Info size={14} />
                    </button>
                  </div>
                  <span className="font-bold text-blue-600 dark:text-blue-400">{results ? results.unitRun : '--'}</span>
                </div>
                {activeTooltip === 'unitRun' && (
                  <div className="text-xs text-slate-400 bg-slate-800 p-2 rounded mt-1 leading-relaxed">
                    Horizontal depth of each step tread surface.
                  </div>
                )}
              </div>

              <div className="flex flex-col pt-1">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-600 dark:text-slate-300">Theoretical Stringer Length:</span>
                    <button 
                      type="button"
                      onClick={() => setActiveTooltip(activeTooltip === 'stringerLength' ? null : 'stringerLength')}
                      className="text-slate-400 hover:text-blue-500 transition-colors p-0.5"
                    >
                      <Info size={14} />
                    </button>
                  </div>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{results ? results.stringerLength : '--'}</span>
                </div>
                {activeTooltip === 'stringerLength' && (
                  <div className="text-xs text-slate-400 bg-slate-800 p-2 rounded mt-1 leading-relaxed">
                    Hypotenuse calculated from total rise and total run (a² + b² = c²).
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Exam Formula Card */}
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl p-4">
            <h4 className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-500 uppercase tracking-widest mb-2">
              <BookOpen size={16} /> 📖 EXAM FORMULA
            </h4>
            <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong>Number of Risers = Total Rise ÷ 7.5 (Target Rise).</strong> Always round to the nearest whole number, then divide the Total Rise by that whole number to get the exact Unit Rise.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


function ConcreteEstimatingModal({ onClose }) {
  const [unitSystem, setUnitSystem] = useState('imperial');
  const [metricUnitMain, setMetricUnitMain] = useState('mm');
  const [metricUnitDepth, setMetricUnitDepth] = useState('mm');
  
  const [lengthFeet, setLengthFeet] = useState('');
  const [lengthInches, setLengthInches] = useState('');
  const [lengthFraction, setLengthFraction] = useState('0');
  const [lengthMetric, setLengthMetric] = useState('');

  const [widthFeet, setWidthFeet] = useState('');
  const [widthInches, setWidthInches] = useState('');
  const [widthFraction, setWidthFraction] = useState('0');
  const [widthMetric, setWidthMetric] = useState('');

  const [depthFeet, setDepthFeet] = useState('');
  const [depthInches, setDepthInches] = useState('');
  const [depthFraction, setDepthFraction] = useState('0');
  const [depthMetric, setDepthMetric] = useState('');

  const [results, setResults] = useState(null);
  const [activeTooltip, setActiveTooltip] = useState(null);

  const handleCalculate = () => {
    if (unitSystem === 'imperial' && !lengthFeet && !lengthInches && !widthFeet && !widthInches && !depthFeet && !depthInches) return;
    if (unitSystem === 'metric' && !lengthMetric && !widthMetric && !depthMetric) return;
    
    // Dummy placeholder values as requested
    if (unitSystem === 'imperial') {
      setResults({
        cubicFeet: '120.5',
        cubicYards: '4.46',
        orderAmount: '5.0 yd³'
      });
    } else {
      setResults({
        cubicMeters: '3.41',
        orderAmountMetric: '3.8 m³'
      });
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-2xl w-full max-w-md shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 p-4 shrink-0 bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500 rounded-lg text-white">
              <Layers size={24} />
            </div>
            <div>
              <h3 className="text-slate-900 dark:text-white text-base md:text-lg font-bold uppercase tracking-wider leading-tight">CONCRETE ESTIMATING</h3>
              <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mt-0.5">SLABS & FOOTINGS VOLUME</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition-colors p-1">
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Content (Scrollable) */}
        <div className="p-4 md:p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6">
          
          {/* Main Unit Toggle */}
          <div className="flex bg-slate-200 dark:bg-slate-800 rounded-lg p-1">
            <button
              onClick={() => setUnitSystem('imperial')}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${unitSystem === 'imperial' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              Imperial
            </button>
            <button
              onClick={() => setUnitSystem('metric')}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${unitSystem === 'metric' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              Metric
            </button>
          </div>

          {/* Input Section */}
          <div className="space-y-4">
            {unitSystem === 'imperial' ? (
              <>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">
                    Length
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <input type="number" placeholder="Feet" value={lengthFeet} onChange={(e) => setLengthFeet(e.target.value)} className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl px-3 py-3 text-base font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors" />
                    </div>
                    <div className="flex-1">
                      <input type="number" placeholder="Inches" value={lengthInches} onChange={(e) => setLengthInches(e.target.value)} className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl px-3 py-3 text-base font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors" />
                    </div>
                    <div className="flex-1">
                      <select value={lengthFraction} onChange={(e) => setLengthFraction(e.target.value)} className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl px-2 py-3 text-base font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors appearance-none">
                        <option value="0">0</option>
                        <option value="1/16">1/16"</option>
                        <option value="1/8">1/8"</option>
                        <option value="3/16">3/16"</option>
                        <option value="1/4">1/4"</option>
                        <option value="5/16">5/16"</option>
                        <option value="3/8">3/8"</option>
                        <option value="7/16">7/16"</option>
                        <option value="1/2">1/2"</option>
                        <option value="9/16">9/16"</option>
                        <option value="5/8">5/8"</option>
                        <option value="11/16">11/16"</option>
                        <option value="3/4">3/4"</option>
                        <option value="13/16">13/16"</option>
                        <option value="7/8">7/8"</option>
                        <option value="15/16">15/16"</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">
                    Width
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <input type="number" placeholder="Feet" value={widthFeet} onChange={(e) => setWidthFeet(e.target.value)} className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl px-3 py-3 text-base font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors" />
                    </div>
                    <div className="flex-1">
                      <input type="number" placeholder="Inches" value={widthInches} onChange={(e) => setWidthInches(e.target.value)} className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl px-3 py-3 text-base font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors" />
                    </div>
                    <div className="flex-1">
                      <select value={widthFraction} onChange={(e) => setWidthFraction(e.target.value)} className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl px-2 py-3 text-base font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors appearance-none">
                        <option value="0">0</option>
                        <option value="1/16">1/16"</option>
                        <option value="1/8">1/8"</option>
                        <option value="3/16">3/16"</option>
                        <option value="1/4">1/4"</option>
                        <option value="5/16">5/16"</option>
                        <option value="3/8">3/8"</option>
                        <option value="7/16">7/16"</option>
                        <option value="1/2">1/2"</option>
                        <option value="9/16">9/16"</option>
                        <option value="5/8">5/8"</option>
                        <option value="11/16">11/16"</option>
                        <option value="3/4">3/4"</option>
                        <option value="13/16">13/16"</option>
                        <option value="7/8">7/8"</option>
                        <option value="15/16">15/16"</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">
                    Depth/Thickness
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <input type="number" placeholder="Feet" value={depthFeet} onChange={(e) => setDepthFeet(e.target.value)} className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl px-3 py-3 text-base font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors" />
                    </div>
                    <div className="flex-1">
                      <input type="number" placeholder="Inches" value={depthInches} onChange={(e) => setDepthInches(e.target.value)} className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl px-3 py-3 text-base font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors" />
                    </div>
                    <div className="flex-1">
                      <select value={depthFraction} onChange={(e) => setDepthFraction(e.target.value)} className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl px-2 py-3 text-base font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors appearance-none">
                        <option value="0">0</option>
                        <option value="1/16">1/16"</option>
                        <option value="1/8">1/8"</option>
                        <option value="3/16">3/16"</option>
                        <option value="1/4">1/4"</option>
                        <option value="5/16">5/16"</option>
                        <option value="3/8">3/8"</option>
                        <option value="7/16">7/16"</option>
                        <option value="1/2">1/2"</option>
                        <option value="9/16">9/16"</option>
                        <option value="5/8">5/8"</option>
                        <option value="11/16">11/16"</option>
                        <option value="3/4">3/4"</option>
                        <option value="13/16">13/16"</option>
                        <option value="7/8">7/8"</option>
                        <option value="15/16">15/16"</option>
                      </select>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="flex bg-slate-100 dark:bg-slate-800/50 rounded-lg p-1 w-fit">
                  {['m', 'cm', 'mm'].map(unit => (
                    <button
                      key={unit}
                      onClick={() => setMetricUnitMain(unit)}
                      className={`px-4 py-1.5 text-xs font-bold uppercase rounded-md transition-colors ${metricUnitMain === unit ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                      {unit}
                    </button>
                  ))}
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">
                    Length ({metricUnitMain})
                  </label>
                  <input type="number" placeholder={`e.g. ${metricUnitMain === 'mm' ? '6000' : metricUnitMain === 'cm' ? '600' : '6.0'}`} value={lengthMetric} onChange={(e) => setLengthMetric(e.target.value)} className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-lg font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors" />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">
                    Width ({metricUnitMain})
                  </label>
                  <input type="number" placeholder={`e.g. ${metricUnitMain === 'mm' ? '3000' : metricUnitMain === 'cm' ? '300' : '3.0'}`} value={widthMetric} onChange={(e) => setWidthMetric(e.target.value)} className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-lg font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors" />
                </div>
                
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800"></div>

                <div className="flex bg-slate-100 dark:bg-slate-800/50 rounded-lg p-1 w-fit">
                  {['m', 'cm', 'mm'].map(unit => (
                    <button
                      key={unit}
                      onClick={() => setMetricUnitDepth(unit)}
                      className={`px-4 py-1.5 text-xs font-bold uppercase rounded-md transition-colors ${metricUnitDepth === unit ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                      {unit}
                    </button>
                  ))}
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">
                    Depth/Thickness ({metricUnitDepth})
                  </label>
                  <input type="number" placeholder={`e.g. ${metricUnitDepth === 'mm' ? '150' : metricUnitDepth === 'cm' ? '15' : '0.15'}`} value={depthMetric} onChange={(e) => setDepthMetric(e.target.value)} className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-lg font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors" />
                </div>
              </div>
            )}

            <button 
              onClick={handleCalculate}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase tracking-wider py-3.5 rounded-xl transition-colors shadow-md active:scale-[0.98] mt-2"
            >
              Calculate Volume
            </button>
          </div>

          {/* Results Card */}
          <div className="bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-xl p-4 md:p-5">
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">
              Calculation Results
            </h4>
            
            <div className="space-y-3 font-mono text-sm">
              {unitSystem === 'imperial' ? (
                <>
                  <div className="flex justify-between items-center border-b border-slate-200/50 dark:border-slate-700/50 pb-2">
                    <span className="text-slate-600 dark:text-slate-300">Total Cubic Feet (ft³):</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{results ? results.cubicFeet : '--'}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-200/50 dark:border-slate-700/50 pb-2">
                    <span className="text-slate-600 dark:text-slate-300">Total Cubic Yards (yd³):</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{results ? results.cubicYards : '--'}</span>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-slate-600 dark:text-slate-300">Order Amount (yd³ w/ 10% Waste):</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{results ? results.orderAmount : '--'}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center border-b border-slate-200/50 dark:border-slate-700/50 pb-2">
                    <span className="text-slate-600 dark:text-slate-300">Total Cubic Meters (m³):</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{results ? results.cubicMeters : '--'}</span>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-slate-600 dark:text-slate-300">Order Amount (m³ w/ 10% Waste):</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{results ? results.orderAmountMetric : '--'}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Exam Formula Card */}
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl p-4">
            <h4 className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-500 uppercase tracking-widest mb-2">
              <BookOpen size={16} /> 📖 EXAM FORMULA
            </h4>
            <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong>Volume = L x W x D.</strong> CRITICAL: You must convert the depth from inches into feet (Depth ÷ 12) before multiplying. To convert Cubic Feet to Cubic Yards, divide by 27.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}



function BFMModal({ onClose }) {
  const [unitSystem, setUnitSystem] = useState('imperial');
  const [metricUnit, setMetricUnit] = useState('m');

  const [thickInches, setThickInches] = useState('');
  const [thickFraction, setThickFraction] = useState('0');
  
  const [widthInches, setWidthInches] = useState('');
  const [widthFraction, setWidthFraction] = useState('0');
  
  const [lengthFeet, setLengthFeet] = useState('');
  const [lengthInches, setLengthInches] = useState('');
  const [lengthFraction, setLengthFraction] = useState('0');
  
  const [thickMetric, setThickMetric] = useState('');
  const [widthMetric, setWidthMetric] = useState('');
  const [lengthMetric, setLengthMetric] = useState('');
  
  const [quantity, setQuantity] = useState('');
  
  const [results, setResults] = useState(null);
  const [activeTooltip, setActiveTooltip] = useState(null);

  const getDecimal = (value, fracStr) => {
    let val = parseFloat(value) || 0;
    let frac = 0;
    if (fracStr && fracStr.includes('/')) {
      const parts = fracStr.split('/');
      frac = parseFloat(parts[0]) / parseFloat(parts[1]);
    } else {
      frac = parseFloat(fracStr) || 0;
    }
    return val + frac;
  };

  const handleCalculate = () => {
    const qty = parseInt(quantity) || 1;

    if (unitSystem === 'imperial') {
      const t = getDecimal(thickInches, thickFraction);
      const w = getDecimal(widthInches, widthFraction);
      
      const feet = parseFloat(lengthFeet) || 0;
      const inchDec = getDecimal(lengthInches, lengthFraction);
      const l = feet + (inchDec / 12);
      
      if (t === 0 || w === 0 || l === 0) return;
      
      const bfmPerPiece = (t * w * l) / 12;
      const totalBfm = bfmPerPiece * qty;
      
      setResults({
        isImperial: true,
        perPiece: bfmPerPiece.toFixed(2),
        total: totalBfm.toFixed(2)
      });
    } else {
      const tNum = parseFloat(thickMetric) || 0;
      const wNum = parseFloat(widthMetric) || 0;
      const lNum = parseFloat(lengthMetric) || 0;
      
      if (tNum === 0 || wNum === 0 || lNum === 0) return;
      
      let mult = 1;
      if (metricUnit === 'cm') mult = 0.01;
      if (metricUnit === 'mm') mult = 0.001;
      
      const tM = tNum * mult;
      const wM = wNum * mult;
      const lM = lNum * mult;
      
      const volPerPiece = tM * wM * lM;
      const totalVol = volPerPiece * qty;
      
      setResults({
        isImperial: false,
        perPiece: volPerPiece.toFixed(4),
        total: totalVol.toFixed(4)
      });
    }
  };

  const renderFractions = () => (
    <>
      <option value="0">0</option>
      <option value="1/16">1/16"</option>
      <option value="1/8">1/8"</option>
      <option value="3/16">3/16"</option>
      <option value="1/4">1/4"</option>
      <option value="5/16">5/16"</option>
      <option value="3/8">3/8"</option>
      <option value="7/16">7/16"</option>
      <option value="1/2">1/2"</option>
      <option value="9/16">9/16"</option>
      <option value="5/8">5/8"</option>
      <option value="11/16">11/16"</option>
      <option value="3/4">3/4"</option>
      <option value="13/16">13/16"</option>
      <option value="7/8">7/8"</option>
      <option value="15/16">15/16"</option>
    </>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-2xl w-full max-w-md shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 p-4 shrink-0 bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500 rounded-lg text-white">
              <Hammer size={24} />
            </div>
            <div>
              <h3 className="text-slate-900 dark:text-white text-base md:text-lg font-bold uppercase tracking-wider leading-tight">BOARD FOOT MEASURE</h3>
              <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mt-0.5">LUMBER VOLUME CALCULATOR</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition-colors p-1">
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Content (Scrollable) */}
        <div className="p-4 md:p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6">
          
          {/* Main Unit Toggle */}
          <div className="flex bg-slate-200 dark:bg-slate-800 rounded-lg p-1">
            <button
              onClick={() => setUnitSystem('imperial')}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${unitSystem === 'imperial' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              Imperial
            </button>
            <button
              onClick={() => setUnitSystem('metric')}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${unitSystem === 'metric' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              Metric
            </button>
          </div>

          {/* Input Section */}
          <div className="space-y-4">
            {unitSystem === 'imperial' ? (
              <>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">
                    Nominal Thickness
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <input type="number" placeholder="Inches" value={thickInches} onChange={(e) => setThickInches(e.target.value)} className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl px-3 py-3 text-base font-bold text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 transition-colors" />
                    </div>
                    <div className="flex-1">
                      <select value={thickFraction} onChange={(e) => setThickFraction(e.target.value)} className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl px-2 py-3 text-base font-bold text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 transition-colors appearance-none">
                        {renderFractions()}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">
                    Nominal Width
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <input type="number" placeholder="Inches" value={widthInches} onChange={(e) => setWidthInches(e.target.value)} className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl px-3 py-3 text-base font-bold text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 transition-colors" />
                    </div>
                    <div className="flex-1">
                      <select value={widthFraction} onChange={(e) => setWidthFraction(e.target.value)} className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl px-2 py-3 text-base font-bold text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 transition-colors appearance-none">
                        {renderFractions()}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">
                    Length
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <input type="number" placeholder="Feet" value={lengthFeet} onChange={(e) => setLengthFeet(e.target.value)} className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl px-3 py-3 text-base font-bold text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 transition-colors" />
                    </div>
                    <div className="flex-1">
                      <input type="number" placeholder="Inches" value={lengthInches} onChange={(e) => setLengthInches(e.target.value)} className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl px-3 py-3 text-base font-bold text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 transition-colors" />
                    </div>
                    <div className="flex-1">
                      <select value={lengthFraction} onChange={(e) => setLengthFraction(e.target.value)} className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl px-2 py-3 text-base font-bold text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 transition-colors appearance-none">
                        {renderFractions()}
                      </select>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="flex bg-slate-100 dark:bg-slate-800/50 rounded-lg p-1 w-fit">
                  {['m', 'cm', 'mm'].map(unit => (
                    <button
                      key={unit}
                      onClick={() => setMetricUnit(unit)}
                      className={`px-4 py-1.5 text-xs font-bold uppercase rounded-md transition-colors ${metricUnit === unit ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                      {unit}
                    </button>
                  ))}
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">
                    Thickness ({metricUnit})
                  </label>
                  <input type="number" placeholder={`e.g. ${metricUnit === 'mm' ? '38' : metricUnit === 'cm' ? '3.8' : '0.038'}`} value={thickMetric} onChange={(e) => setThickMetric(e.target.value)} className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-lg font-bold text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 transition-colors" />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">
                    Width ({metricUnit})
                  </label>
                  <input type="number" placeholder={`e.g. ${metricUnit === 'mm' ? '89' : metricUnit === 'cm' ? '8.9' : '0.089'}`} value={widthMetric} onChange={(e) => setWidthMetric(e.target.value)} className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-lg font-bold text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 transition-colors" />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">
                    Length ({metricUnit})
                  </label>
                  <input type="number" placeholder={`e.g. ${metricUnit === 'mm' ? '2400' : metricUnit === 'cm' ? '240' : '2.4'}`} value={lengthMetric} onChange={(e) => setLengthMetric(e.target.value)} className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-lg font-bold text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 transition-colors" />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">
                Quantity of Pieces
              </label>
              <input 
                type="number" 
                placeholder="e.g. 20"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-lg font-bold text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 dark:focus:border-purple-500 transition-colors"
              />
            </div>
            
            <button 
              onClick={handleCalculate}
              className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold uppercase tracking-wider py-3.5 rounded-xl transition-colors shadow-md active:scale-[0.98] mt-2"
            >
              Calculate Volume
            </button>
          </div>

          {/* Results Card */}
          <div className="bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-xl p-4 md:p-5">
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">
              Calculation Results
            </h4>
            
            <div className="space-y-3 font-mono text-sm">
              <div className="flex flex-col border-b border-slate-200/50 dark:border-slate-700/50 pb-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => setActiveTooltip(activeTooltip === 'perPiece' ? null : 'perPiece')}>
                    <span className="text-slate-600 dark:text-slate-300">
                      {unitSystem === 'imperial' ? 'BFM per Piece:' : 'Cubic Meters (m³) per Piece:'}
                    </span>
                    <Info size={14} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" />
                  </div>
                  <span className="font-bold text-purple-600 dark:text-purple-400">{results ? results.perPiece : '--'}</span>
                </div>
                {activeTooltip === 'perPiece' && (
                  <div className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 p-2 rounded mt-2 font-sans">
                    {unitSystem === 'imperial' 
                      ? 'Board Foot Measure is based on NOMINAL dimensions. Do not use actual planed sizes! A 2x4 is calculated as 2 inches by 4 inches, not 1.5 by 3.5. 1 Board Foot is equal to a 1 inch thick, 12 inch wide, 1 foot long board.'
                      : 'Metric lumber volume is calculated in actual physical dimensions and sold by the cubic meter (m³).'}
                  </div>
                )}
              </div>
              
              <div className="flex flex-col pt-1">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-300">
                    {unitSystem === 'imperial' ? 'Total BFM (All Pieces):' : 'Total Volume (m³):'}
                  </span>
                  <span className="font-bold text-purple-600 dark:text-purple-400">{results ? results.total : '--'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Exam Formula Card */}
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl p-4">
            <h4 className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-500 uppercase tracking-widest mb-2">
              <BookOpen size={16} /> 📖 EXAM FORMULA
            </h4>
            <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong>1 Board Foot = 144 cubic inches (1" x 12" x 12").</strong> Formula: (Thickness in Inches x Width in Inches x Length in Feet) ÷ 12. ALWAYS use nominal dimensions (e.g., use 2x4, not 1.5x3.5) for BFM estimating on the exam.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}


function RoofFramingModal({ onClose }) {
  const [unitSystem, setUnitSystem] = useState('imperial');
  const [metricUnit, setMetricUnit] = useState('mm');
  
  const [spanFeet, setSpanFeet] = useState('');
  const [spanInches, setSpanInches] = useState('');
  const [spanFraction, setSpanFraction] = useState('0');
  
  const [spanMetric, setSpanMetric] = useState('');
  
  const [pitch, setPitch] = useState('');

  const [results, setResults] = useState(null);
  const [activeTooltip, setActiveTooltip] = useState(null);

  const inchesToFraction = (decimalInches) => {
    const whole = Math.floor(decimalInches);
    const frac = Math.round((decimalInches - whole) * 16);
    if (frac === 0) return `${whole}"`;
    if (frac === 16) return `${whole + 1}"`;
    
    let num = frac;
    let den = 16;
    while (num % 2 === 0 && den % 2 === 0) {
      num /= 2;
      den /= 2;
    }
    if (whole === 0) return `${num}/${den}"`;
    return `${whole} ${num}/${den}"`;
  };

  const handleCalculate = () => {
    if (unitSystem === 'imperial' && !spanFeet && !spanInches) return;
    if (unitSystem === 'metric' && !spanMetric) return;
    if (!pitch) return;
    
    const pitchVal = parseFloat(pitch);

    if (unitSystem === 'imperial') {
      const feet = parseFloat(spanFeet) || 0;
      const inches = parseFloat(spanInches) || 0;
      let frac = 0;
      if (spanFraction && spanFraction.includes('/')) {
        const parts = spanFraction.split('/');
        frac = parseFloat(parts[0]) / parseFloat(parts[1]);
      } else {
        frac = parseFloat(spanFraction) || 0;
      }
      
      const totalSpanInches = (feet * 12) + inches + frac;
      const totalRunInches = totalSpanInches / 2;
      const unitLineLengthInches = Math.sqrt(Math.pow(12, 2) + Math.pow(pitchVal, 2));
      const totalTheoreticalInches = (totalRunInches / 12) * unitLineLengthInches;
      
      setResults({
        isImperial: true,
        totalRunDec: `${(totalRunInches / 12).toFixed(2)} Feet`,
        totalRunFrac: inchesToFraction(totalRunInches),
        unitLineLengthDec: `${unitLineLengthInches.toFixed(2)}"`,
        unitLineLengthFrac: inchesToFraction(unitLineLengthInches),
        totalTheoreticalDec: `${totalTheoreticalInches.toFixed(2)}"`,
        totalTheoreticalFrac: inchesToFraction(totalTheoreticalInches)
      });
    } else {
      let spanMm = parseFloat(spanMetric) || 0;
      if (metricUnit === 'm') spanMm *= 1000;
      if (metricUnit === 'cm') spanMm *= 10;
      
      const totalRunMm = spanMm / 2;
      const unitLineLengthMetric = Math.sqrt(Math.pow(1000, 2) + Math.pow(pitchVal, 2));
      const totalTheoreticalMetric = (totalRunMm / 1000) * unitLineLengthMetric;
      
      setResults({
        isImperial: false,
        totalRun: `${totalRunMm.toFixed(2)} mm`,
        unitLineLength: `${unitLineLengthMetric.toFixed(2)} mm`,
        totalTheoretical: `${totalTheoreticalMetric.toFixed(2)} mm`
      });
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-2xl w-full max-w-md shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 p-4 shrink-0 bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500 rounded-lg text-white">
              <Triangle size={24} />
            </div>
            <div>
              <h3 className="text-slate-900 dark:text-white text-base md:text-lg font-bold uppercase tracking-wider leading-tight">ROOF FRAMING MATH</h3>
              <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mt-0.5">RAFTER LINE LENGTH & SLOPES</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition-colors p-1">
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Content (Scrollable) */}
        <div className="p-4 md:p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6">
          
          {/* Main Unit Toggle */}
          <div className="flex bg-slate-200 dark:bg-slate-800 rounded-lg p-1">
            <button
              onClick={() => setUnitSystem('imperial')}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${unitSystem === 'imperial' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              Imperial
            </button>
            <button
              onClick={() => setUnitSystem('metric')}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${unitSystem === 'metric' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              Metric
            </button>
          </div>

          {/* Input Section */}
          <div className="space-y-4">
            {unitSystem === 'imperial' ? (
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">
                  Total Span of Building
                </label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <input type="number" placeholder="Feet" value={spanFeet} onChange={(e) => setSpanFeet(e.target.value)} className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl px-3 py-3 text-base font-bold text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 transition-colors" />
                  </div>
                  <div className="flex-1">
                    <input type="number" placeholder="Inches" value={spanInches} onChange={(e) => setSpanInches(e.target.value)} className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl px-3 py-3 text-base font-bold text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 transition-colors" />
                  </div>
                  <div className="flex-1">
                    <select value={spanFraction} onChange={(e) => setSpanFraction(e.target.value)} className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl px-2 py-3 text-base font-bold text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 transition-colors appearance-none">
                      <option value="0">0</option>
                      <option value="1/16">1/16"</option>
                      <option value="1/8">1/8"</option>
                      <option value="3/16">3/16"</option>
                      <option value="1/4">1/4"</option>
                      <option value="5/16">5/16"</option>
                      <option value="3/8">3/8"</option>
                      <option value="7/16">7/16"</option>
                      <option value="1/2">1/2"</option>
                      <option value="9/16">9/16"</option>
                      <option value="5/8">5/8"</option>
                      <option value="11/16">11/16"</option>
                      <option value="3/4">3/4"</option>
                      <option value="13/16">13/16"</option>
                      <option value="7/8">7/8"</option>
                      <option value="15/16">15/16"</option>
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex bg-slate-100 dark:bg-slate-800/50 rounded-lg p-1 w-fit">
                  {['m', 'cm', 'mm'].map(unit => (
                    <button
                      key={unit}
                      onClick={() => setMetricUnit(unit)}
                      className={`px-4 py-1.5 text-xs font-bold uppercase rounded-md transition-colors ${metricUnit === unit ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                      {unit}
                    </button>
                  ))}
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">
                    Total Span of Building ({metricUnit})
                  </label>
                  <input type="number" placeholder={`e.g. ${metricUnit === 'mm' ? '6000' : metricUnit === 'cm' ? '600' : '6.0'}`} value={spanMetric} onChange={(e) => setSpanMetric(e.target.value)} className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-lg font-bold text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 transition-colors" />
                </div>
              </div>
            )}
            
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">
                {unitSystem === 'imperial' ? 'Roof Pitch (e.g., enter 6 for a 6/12 pitch)' : 'Roof Pitch (Rise per 1000mm Run or Slope Ratio)'}
              </label>
              <input 
                type="number" 
                placeholder={unitSystem === 'imperial' ? "e.g. 6" : "e.g. 500"}
                value={pitch}
                onChange={(e) => setPitch(e.target.value)}
                className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-lg font-bold text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 dark:focus:border-orange-500 transition-colors"
              />
            </div>

            <button 
              onClick={handleCalculate}
              className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold uppercase tracking-wider py-3.5 rounded-xl transition-colors shadow-md active:scale-[0.98] mt-2"
            >
              Calculate Rafter
            </button>
          </div>

          {/* Results Card */}
          <div className="bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-xl p-4 md:p-5">
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">
              Calculation Results
            </h4>
            
            <div className="space-y-3 font-mono text-sm">
              <div className="flex flex-col border-b border-slate-200/50 dark:border-slate-700/50 pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => setActiveTooltip(activeTooltip === 'totalRun' ? null : 'totalRun')}>
                    <span className="text-slate-600 dark:text-slate-300">Total Run:</span>
                    <Info size={14} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" />
                  </div>
                  {results ? (
                    results.isImperial ? (
                      <div className="flex flex-col items-end">
                        <span className="text-sm text-slate-400">{results.totalRunDec}</span>
                        <span className="font-bold text-orange-500">{results.totalRunFrac}</span>
                      </div>
                    ) : (
                      <span className="font-bold text-orange-600 dark:text-orange-400 text-right mt-1">{results.totalRun}</span>
                    )
                  ) : (
                    <span className="font-bold text-orange-600 dark:text-orange-400 text-right mt-1">--</span>
                  )}
                </div>
                {activeTooltip === 'totalRun' && (
                  <div className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 p-2 rounded mt-2 font-sans">
                    Exactly half the total span of the building. The horizontal distance from the outside of the wall plate to the center of the ridge.
                  </div>
                )}
              </div>
              
              <div className="flex flex-col border-b border-slate-200/50 dark:border-slate-700/50 pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => setActiveTooltip(activeTooltip === 'unitLineLength' ? null : 'unitLineLength')}>
                    <span className="text-slate-600 dark:text-slate-300">Unit Line Length:</span>
                    <Info size={14} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" />
                  </div>
                  {results ? (
                    results.isImperial ? (
                      <div className="flex flex-col items-end">
                        <span className="text-sm text-slate-400">{results.unitLineLengthDec}</span>
                        <span className="font-bold text-orange-500">{results.unitLineLengthFrac}</span>
                      </div>
                    ) : (
                      <span className="font-bold text-orange-600 dark:text-orange-400 text-right mt-1">{results.unitLineLength}</span>
                    )
                  ) : (
                    <span className="font-bold text-orange-600 dark:text-orange-400 text-right mt-1">--</span>
                  )}
                </div>
                {activeTooltip === 'unitLineLength' && (
                  <div className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 p-2 rounded mt-2 font-sans">
                    The hypotenuse of a single 12-inch (or 1000mm) run based on your pitch. This acts as the multiplier to find your final rafter length.
                  </div>
                )}
              </div>

              <div className="flex flex-col pt-1">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => setActiveTooltip(activeTooltip === 'totalTheoretical' ? null : 'totalTheoretical')}>
                    <span className="text-slate-600 dark:text-slate-300">Total Theoretical Line Length:</span>
                    <Info size={14} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" />
                  </div>
                  {results ? (
                    results.isImperial ? (
                      <div className="flex flex-col items-end">
                        <span className="text-sm text-slate-400">{results.totalTheoreticalDec}</span>
                        <span className="font-bold text-orange-500">{results.totalTheoreticalFrac}</span>
                      </div>
                    ) : (
                      <span className="font-bold text-orange-600 dark:text-orange-400 text-right mt-1">{results.totalTheoretical}</span>
                    )
                  ) : (
                    <span className="font-bold text-orange-600 dark:text-orange-400 text-right mt-1">--</span>
                  )}
                </div>
                {activeTooltip === 'totalTheoretical' && (
                  <div className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 p-2 rounded mt-2 font-sans">
                    The measurement from the birdsmouth (seat cut) to the center of the ridge. <strong>NOTE:</strong> You must subtract half the thickness of the ridge board from this number to find your actual cut length.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Exam Formula Card */}
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl p-4">
            <h4 className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-500 uppercase tracking-widest mb-2">
              <BookOpen size={16} /> 📖 EXAM FORMULA
            </h4>
            <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong>Total Run is always exactly half of the Total Span.</strong> Line Length is calculated using Pythagoras (a² + b² = c²) where 'a' is the total run and 'b' is the total rise. Remember to subtract half the thickness of the ridge board from the top plumb cut to get the true cut length!
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}



function ElevationsModal({ onClose }) {
  const [unitSystem, setUnitSystem] = useState('imperial');
  const [metricUnit, setMetricUnit] = useState('m');

  const [bmFeet, setBmFeet] = useState('');
  const [bmInches, setBmInches] = useState('');
  const [bmFraction, setBmFraction] = useState('0');

  const [bsFeet, setBsFeet] = useState('');
  const [bsInches, setBsInches] = useState('');
  const [bsFraction, setBsFraction] = useState('0');

  const [fsFeet, setFsFeet] = useState('');
  const [fsInches, setFsInches] = useState('');
  const [fsFraction, setFsFraction] = useState('0');

  const [bmMetric, setBmMetric] = useState('');
  const [bsMetric, setBsMetric] = useState('');
  const [fsMetric, setFsMetric] = useState('');

  const [results, setResults] = useState(null);
  const [activeTooltip, setActiveTooltip] = useState(null);

  const getDecimal = (feetStr, inchStr, fracStr) => {
    let ft = parseFloat(feetStr) || 0;
    let inch = parseFloat(inchStr) || 0;
    let frac = 0;
    if (fracStr && fracStr.includes('/')) {
      const parts = fracStr.split('/');
      frac = parseFloat(parts[0]) / parseFloat(parts[1]);
    } else {
      frac = parseFloat(fracStr) || 0;
    }
    return (ft * 12) + inch + frac;
  };

  const inchesToFraction = (decimalInches) => {
    const isNegative = decimalInches < 0;
    decimalInches = Math.abs(decimalInches);
    const whole = Math.floor(decimalInches);
    const frac = Math.round((decimalInches - whole) * 16);
    let sign = isNegative ? "-" : "";
    if (frac === 0) return `${sign}${whole}"`;
    if (frac === 16) return `${sign}${whole + 1}"`;
    
    let num = frac;
    let den = 16;
    while (num % 2 === 0 && den % 2 === 0) {
      num /= 2;
      den /= 2;
    }
    if (whole === 0) return `${sign}${num}/${den}"`;
    return `${sign}${whole} ${num}/${den}"`;
  };

  const handleCalculate = () => {
    if (unitSystem === 'imperial') {
      const bmInchesTotal = getDecimal(bmFeet, bmInches, bmFraction);
      const bsInchesTotal = getDecimal(bsFeet, bsInches, bsFraction);
      const fsInchesTotal = getDecimal(fsFeet, fsInches, fsFraction);

      if (bmInchesTotal === 0 && bsInchesTotal === 0 && fsInchesTotal === 0) return;

      const hiInches = bmInchesTotal + bsInchesTotal;
      const newElevInches = hiInches - fsInchesTotal;

      setResults({
        isImperial: true,
        hiDec: `${(hiInches / 12).toFixed(2)} Feet`,
        hiFrac: inchesToFraction(hiInches),
        newElevDec: `${(newElevInches / 12).toFixed(2)} Feet`,
        newElevFrac: inchesToFraction(newElevInches)
      });
    } else {
      const bm = parseFloat(bmMetric) || 0;
      const bs = parseFloat(bsMetric) || 0;
      const fs = parseFloat(fsMetric) || 0;

      if (bm === 0 && bs === 0 && fs === 0) return;

      const hi = bm + bs;
      const newElev = hi - fs;

      setResults({
        isImperial: false,
        hi: `${hi.toFixed(2)} ${metricUnit}`,
        newElev: `${newElev.toFixed(2)} ${metricUnit}`
      });
    }
  };

  const renderFractions = () => (
    <>
      <option value="0">0</option>
      <option value="1/16">1/16"</option>
      <option value="1/8">1/8"</option>
      <option value="3/16">3/16"</option>
      <option value="1/4">1/4"</option>
      <option value="5/16">5/16"</option>
      <option value="3/8">3/8"</option>
      <option value="7/16">7/16"</option>
      <option value="1/2">1/2"</option>
      <option value="9/16">9/16"</option>
      <option value="5/8">5/8"</option>
      <option value="11/16">11/16"</option>
      <option value="3/4">3/4"</option>
      <option value="13/16">13/16"</option>
      <option value="7/8">7/8"</option>
      <option value="15/16">15/16"</option>
    </>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-2xl w-full max-w-md shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 p-4 shrink-0 bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500 rounded-lg text-white">
              <Ruler size={24} />
            </div>
            <div>
              <h3 className="text-slate-900 dark:text-white text-base md:text-lg font-bold uppercase tracking-wider leading-tight">ELEVATIONS & GRADES</h3>
              <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mt-0.5">SURVEYING MATH & HEIGHT OF INSTRUMENT</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition-colors p-1">
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Content (Scrollable) */}
        <div className="p-4 md:p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6">
          
          {/* Main Unit Toggle */}
          <div className="flex bg-slate-200 dark:bg-slate-800 rounded-lg p-1">
            <button
              onClick={() => setUnitSystem('imperial')}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${unitSystem === 'imperial' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              Imperial
            </button>
            <button
              onClick={() => setUnitSystem('metric')}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${unitSystem === 'metric' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              Metric
            </button>
          </div>

          {/* Input Section */}
          <div className="space-y-4">
            {unitSystem === 'imperial' ? (
              <>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 cursor-pointer w-fit" onClick={() => setActiveTooltip(activeTooltip === 'bm' ? null : 'bm')}>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest cursor-pointer">
                      Known Benchmark
                    </label>
                    <Info size={14} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" />
                  </div>
                  {activeTooltip === 'bm' && (
                    <div className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 p-2 rounded mt-2 font-sans mb-2">
                      A permanent, established elevation point on the job site (e.g., 100.00 ft). Everything is measured relative to this point.
                    </div>
                  )}
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <input type="number" placeholder="Feet" value={bmFeet} onChange={(e) => setBmFeet(e.target.value)} className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl px-3 py-3 text-base font-bold text-slate-900 dark:text-white focus:outline-none focus:border-yellow-500 transition-colors" />
                    </div>
                    <div className="flex-1">
                      <input type="number" placeholder="Inches" value={bmInches} onChange={(e) => setBmInches(e.target.value)} className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl px-3 py-3 text-base font-bold text-slate-900 dark:text-white focus:outline-none focus:border-yellow-500 transition-colors" />
                    </div>
                    <div className="flex-1">
                      <select value={bmFraction} onChange={(e) => setBmFraction(e.target.value)} className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl px-2 py-3 text-base font-bold text-slate-900 dark:text-white focus:outline-none focus:border-yellow-500 transition-colors appearance-none">
                        {renderFractions()}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 cursor-pointer w-fit" onClick={() => setActiveTooltip(activeTooltip === 'bs' ? null : 'bs')}>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest cursor-pointer">
                      Backsight Reading (BS)
                    </label>
                    <Info size={14} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" />
                  </div>
                  {activeTooltip === 'bs' && (
                    <div className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 p-2 rounded mt-2 font-sans mb-2">
                      The rod reading taken on a point of KNOWN elevation. Added to the benchmark to find your HI. (Think: Plus sight).
                    </div>
                  )}
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <input type="number" placeholder="Feet" value={bsFeet} onChange={(e) => setBsFeet(e.target.value)} className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl px-3 py-3 text-base font-bold text-slate-900 dark:text-white focus:outline-none focus:border-yellow-500 transition-colors" />
                    </div>
                    <div className="flex-1">
                      <input type="number" placeholder="Inches" value={bsInches} onChange={(e) => setBsInches(e.target.value)} className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl px-3 py-3 text-base font-bold text-slate-900 dark:text-white focus:outline-none focus:border-yellow-500 transition-colors" />
                    </div>
                    <div className="flex-1">
                      <select value={bsFraction} onChange={(e) => setBsFraction(e.target.value)} className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl px-2 py-3 text-base font-bold text-slate-900 dark:text-white focus:outline-none focus:border-yellow-500 transition-colors appearance-none">
                        {renderFractions()}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 cursor-pointer w-fit" onClick={() => setActiveTooltip(activeTooltip === 'fs' ? null : 'fs')}>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest cursor-pointer">
                      Foresight Reading (FS)
                    </label>
                    <Info size={14} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" />
                  </div>
                  {activeTooltip === 'fs' && (
                    <div className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 p-2 rounded mt-2 font-sans mb-2">
                      The rod reading taken on a point of UNKNOWN elevation. Subtracted from the HI to find the new elevation. (Think: Minus sight).
                    </div>
                  )}
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <input type="number" placeholder="Feet" value={fsFeet} onChange={(e) => setFsFeet(e.target.value)} className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl px-3 py-3 text-base font-bold text-slate-900 dark:text-white focus:outline-none focus:border-yellow-500 transition-colors" />
                    </div>
                    <div className="flex-1">
                      <input type="number" placeholder="Inches" value={fsInches} onChange={(e) => setFsInches(e.target.value)} className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl px-3 py-3 text-base font-bold text-slate-900 dark:text-white focus:outline-none focus:border-yellow-500 transition-colors" />
                    </div>
                    <div className="flex-1">
                      <select value={fsFraction} onChange={(e) => setFsFraction(e.target.value)} className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl px-2 py-3 text-base font-bold text-slate-900 dark:text-white focus:outline-none focus:border-yellow-500 transition-colors appearance-none">
                        {renderFractions()}
                      </select>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="flex bg-slate-100 dark:bg-slate-800/50 rounded-lg p-1 w-fit">
                  {['m', 'cm', 'mm'].map(unit => (
                    <button
                      key={unit}
                      onClick={() => setMetricUnit(unit)}
                      className={`px-4 py-1.5 text-xs font-bold uppercase rounded-md transition-colors ${metricUnit === unit ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                      {unit}
                    </button>
                  ))}
                </div>
                
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 cursor-pointer w-fit" onClick={() => setActiveTooltip(activeTooltip === 'bm' ? null : 'bm')}>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest cursor-pointer">
                      Known Benchmark ({metricUnit})
                    </label>
                    <Info size={14} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" />
                  </div>
                  {activeTooltip === 'bm' && (
                    <div className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 p-2 rounded mt-2 font-sans mb-2">
                      A permanent, established elevation point on the job site (e.g., 100.00 ft). Everything is measured relative to this point.
                    </div>
                  )}
                  <input type="number" placeholder={`e.g. ${metricUnit === 'mm' ? '30000' : metricUnit === 'cm' ? '3000' : '30.00'}`} value={bmMetric} onChange={(e) => setBmMetric(e.target.value)} className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-lg font-bold text-slate-900 dark:text-white focus:outline-none focus:border-yellow-500 transition-colors" />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 cursor-pointer w-fit" onClick={() => setActiveTooltip(activeTooltip === 'bs' ? null : 'bs')}>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest cursor-pointer">
                      Backsight Reading ({metricUnit})
                    </label>
                    <Info size={14} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" />
                  </div>
                  {activeTooltip === 'bs' && (
                    <div className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 p-2 rounded mt-2 font-sans mb-2">
                      The rod reading taken on a point of KNOWN elevation. Added to the benchmark to find your HI. (Think: Plus sight).
                    </div>
                  )}
                  <input type="number" placeholder={`e.g. ${metricUnit === 'mm' ? '1500' : metricUnit === 'cm' ? '150' : '1.50'}`} value={bsMetric} onChange={(e) => setBsMetric(e.target.value)} className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-lg font-bold text-slate-900 dark:text-white focus:outline-none focus:border-yellow-500 transition-colors" />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 cursor-pointer w-fit" onClick={() => setActiveTooltip(activeTooltip === 'fs' ? null : 'fs')}>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest cursor-pointer">
                      Foresight Reading ({metricUnit})
                    </label>
                    <Info size={14} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" />
                  </div>
                  {activeTooltip === 'fs' && (
                    <div className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 p-2 rounded mt-2 font-sans mb-2">
                      The rod reading taken on a point of UNKNOWN elevation. Subtracted from the HI to find the new elevation. (Think: Minus sight).
                    </div>
                  )}
                  <input type="number" placeholder={`e.g. ${metricUnit === 'mm' ? '1200' : metricUnit === 'cm' ? '120' : '1.20'}`} value={fsMetric} onChange={(e) => setFsMetric(e.target.value)} className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-lg font-bold text-slate-900 dark:text-white focus:outline-none focus:border-yellow-500 transition-colors" />
                </div>
              </div>
            )}

            <button 
              onClick={handleCalculate}
              className="w-full bg-yellow-600 hover:bg-yellow-500 text-white font-bold uppercase tracking-wider py-3.5 rounded-xl transition-colors shadow-md active:scale-[0.98] mt-2"
            >
              Calculate Elevation
            </button>
          </div>

          {/* Results Card */}
          <div className="bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-xl p-4 md:p-5">
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">
              Calculation Results
            </h4>
            
            <div className="space-y-3 font-mono text-sm">
              <div className="flex flex-col border-b border-slate-200/50 dark:border-slate-700/50 pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => setActiveTooltip(activeTooltip === 'hi' ? null : 'hi')}>
                    <span className="text-slate-600 dark:text-slate-300">Height of Instrument (HI):</span>
                    <Info size={14} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" />
                  </div>
                  {results ? (
                    results.isImperial ? (
                      <div className="flex flex-col items-end">
                        <span className="text-sm text-slate-400">{results.hiDec}</span>
                        <span className="font-bold text-yellow-600 dark:text-yellow-500">{results.hiFrac}</span>
                      </div>
                    ) : (
                      <span className="font-bold text-yellow-600 dark:text-yellow-500 text-right mt-1">{results.hi}</span>
                    )
                  ) : (
                    <span className="font-bold text-yellow-600 dark:text-yellow-500 text-right mt-1">--</span>
                  )}
                </div>
                {activeTooltip === 'hi' && (
                  <div className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 p-2 rounded mt-2 font-sans">
                    The exact elevation of the optical line of sight of your transit or laser level.
                  </div>
                )}
              </div>
              
              <div className="flex flex-col pt-1">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => setActiveTooltip(activeTooltip === 'newElev' ? null : 'newElev')}>
                    <span className="text-slate-600 dark:text-slate-300">New Point Elevation:</span>
                    <Info size={14} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" />
                  </div>
                  {results ? (
                    results.isImperial ? (
                      <div className="flex flex-col items-end">
                        <span className="text-sm text-slate-400">{results.newElevDec}</span>
                        <span className="font-bold text-yellow-600 dark:text-yellow-500">{results.newElevFrac}</span>
                      </div>
                    ) : (
                      <span className="font-bold text-yellow-600 dark:text-yellow-500 text-right mt-1">{results.newElev}</span>
                    )
                  ) : (
                    <span className="font-bold text-yellow-600 dark:text-yellow-500 text-right mt-1">--</span>
                  )}
                </div>
                {activeTooltip === 'newElev' && (
                  <div className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 p-2 rounded mt-2 font-sans">
                    The calculated elevation of your new location (e.g., the top of a footing, grade stake, or floor slab).
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Exam Formula Card */}
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl p-4">
            <h4 className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-500 uppercase tracking-widest mb-2">
              <BookOpen size={16} /> 📖 EXAM FORMULA
            </h4>
            <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong>HI = Benchmark + Backsight (BS)</strong><br />
              <strong>New Elevation = HI - Foresight (FS)</strong><br />
              Always ensure you are using consistent units.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}



function SquaringModal({ onClose }) {
  const [unitSystem, setUnitSystem] = useState('imperial');
  const [metricUnit, setMetricUnit] = useState('m');

  const [aFeet, setAFeet] = useState('');
  const [aInches, setAInches] = useState('');
  const [aFraction, setAFraction] = useState('0');

  const [bFeet, setBFeet] = useState('');
  const [bInches, setBInches] = useState('');
  const [bFraction, setBFraction] = useState('0');

  const [aMetric, setAMetric] = useState('');
  const [bMetric, setBMetric] = useState('');

  const [results, setResults] = useState(null);
  const [activeTooltip, setActiveTooltip] = useState(null);

  const getDecimal = (feetStr, inchStr, fracStr) => {
    let ft = parseFloat(feetStr) || 0;
    let inch = parseFloat(inchStr) || 0;
    let frac = 0;
    if (fracStr && fracStr.includes('/')) {
      const parts = fracStr.split('/');
      frac = parseFloat(parts[0]) / parseFloat(parts[1]);
    } else {
      frac = parseFloat(fracStr) || 0;
    }
    return (ft * 12) + inch + frac;
  };

  const inchesToFraction = (decimalInches) => {
    const isNegative = decimalInches < 0;
    decimalInches = Math.abs(decimalInches);
    const whole = Math.floor(decimalInches);
    const frac = Math.round((decimalInches - whole) * 16);
    let sign = isNegative ? "-" : "";
    if (frac === 0) return `${sign}${whole}"`;
    if (frac === 16) return `${sign}${whole + 1}"`;
    
    let num = frac;
    let den = 16;
    while (num % 2 === 0 && den % 2 === 0) {
      num /= 2;
      den /= 2;
    }
    if (whole === 0) return `${sign}${num}/${den}"`;
    return `${sign}${whole} ${num}/${den}"`;
  };

  const handleCalculate = () => {
    if (unitSystem === 'imperial') {
      const aTotal = getDecimal(aFeet, aInches, aFraction);
      const bTotal = getDecimal(bFeet, bInches, bFraction);

      if (aTotal === 0 && bTotal === 0) return;

      const diagonalInches = Math.sqrt(Math.pow(aTotal, 2) + Math.pow(bTotal, 2));

      setResults({
        isImperial: true,
        diagDec: `${(diagonalInches / 12).toFixed(2)} Feet`,
        diagFrac: inchesToFraction(diagonalInches)
      });
    } else {
      const a = parseFloat(aMetric) || 0;
      const b = parseFloat(bMetric) || 0;

      if (a === 0 && b === 0) return;

      const diagonal = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));

      setResults({
        isImperial: false,
        diag: `${diagonal.toFixed(2)} ${metricUnit}`
      });
    }
  };

  const renderFractions = () => (
    <>
      <option value="0">0</option>
      <option value="1/16">1/16"</option>
      <option value="1/8">1/8"</option>
      <option value="3/16">3/16"</option>
      <option value="1/4">1/4"</option>
      <option value="5/16">5/16"</option>
      <option value="3/8">3/8"</option>
      <option value="7/16">7/16"</option>
      <option value="1/2">1/2"</option>
      <option value="9/16">9/16"</option>
      <option value="5/8">5/8"</option>
      <option value="11/16">11/16"</option>
      <option value="3/4">3/4"</option>
      <option value="13/16">13/16"</option>
      <option value="7/8">7/8"</option>
      <option value="15/16">15/16"</option>
    </>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-2xl w-full max-w-md shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 p-4 shrink-0 bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500 rounded-lg text-white">
              <Square size={24} />
            </div>
            <div>
              <h3 className="text-slate-900 dark:text-white text-base md:text-lg font-bold uppercase tracking-wider leading-tight">SQUARING & DIAGONALS</h3>
              <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mt-0.5">PYTHAGOREAN THEOREM</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition-colors p-1">
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Content (Scrollable) */}
        <div className="p-4 md:p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6">

          {/* Main Unit Toggle */}
          <div className="flex bg-slate-200 dark:bg-slate-800 rounded-lg p-1">
            <button
              onClick={() => setUnitSystem('imperial')}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${unitSystem === 'imperial' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              Imperial
            </button>
            <button
              onClick={() => setUnitSystem('metric')}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${unitSystem === 'metric' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              Metric
            </button>
          </div>

          {/* Input Section */}
          <div className="space-y-4">
            {unitSystem === 'imperial' ? (
              <>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 cursor-pointer w-fit" onClick={() => setActiveTooltip(activeTooltip === 'sideA' ? null : 'sideA')}>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest cursor-pointer">
                      Side A Length
                    </label>
                    <Info size={14} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" />
                  </div>
                  {activeTooltip === 'sideA' && (
                    <div className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 p-2 rounded mt-2 font-sans mb-2">
                      The measurement of one of the two intersecting walls or lines forming your 90-degree corner.
                    </div>
                  )}
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <input type="number" placeholder="Feet" value={aFeet} onChange={(e) => setAFeet(e.target.value)} className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl px-3 py-3 text-base font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors" />
                    </div>
                    <div className="flex-1">
                      <input type="number" placeholder="Inches" value={aInches} onChange={(e) => setAInches(e.target.value)} className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl px-3 py-3 text-base font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors" />
                    </div>
                    <div className="flex-1">
                      <select value={aFraction} onChange={(e) => setAFraction(e.target.value)} className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl px-2 py-3 text-base font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors appearance-none">
                        {renderFractions()}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 cursor-pointer w-fit" onClick={() => setActiveTooltip(activeTooltip === 'sideB' ? null : 'sideB')}>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest cursor-pointer">
                      Side B Length
                    </label>
                    <Info size={14} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" />
                  </div>
                  {activeTooltip === 'sideB' && (
                    <div className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 p-2 rounded mt-2 font-sans mb-2">
                      The measurement of one of the two intersecting walls or lines forming your 90-degree corner.
                    </div>
                  )}
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <input type="number" placeholder="Feet" value={bFeet} onChange={(e) => setBFeet(e.target.value)} className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl px-3 py-3 text-base font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors" />
                    </div>
                    <div className="flex-1">
                      <input type="number" placeholder="Inches" value={bInches} onChange={(e) => setBInches(e.target.value)} className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl px-3 py-3 text-base font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors" />
                    </div>
                    <div className="flex-1">
                      <select value={bFraction} onChange={(e) => setBFraction(e.target.value)} className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl px-2 py-3 text-base font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors appearance-none">
                        {renderFractions()}
                      </select>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="flex bg-slate-100 dark:bg-slate-800/50 rounded-lg p-1 w-fit">
                  {['m', 'cm', 'mm'].map(unit => (
                    <button
                      key={unit}
                      onClick={() => setMetricUnit(unit)}
                      className={`px-4 py-1.5 text-xs font-bold uppercase rounded-md transition-colors ${metricUnit === unit ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                      {unit}
                    </button>
                  ))}
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 cursor-pointer w-fit" onClick={() => setActiveTooltip(activeTooltip === 'sideA' ? null : 'sideA')}>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest cursor-pointer">
                      Side A Length ({metricUnit})
                    </label>
                    <Info size={14} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" />
                  </div>
                  {activeTooltip === 'sideA' && (
                    <div className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 p-2 rounded mt-2 font-sans mb-2">
                      The measurement of one of the two intersecting walls or lines forming your 90-degree corner.
                    </div>
                  )}
                  <input type="number" placeholder={`e.g. ${metricUnit === 'mm' ? '3000' : metricUnit === 'cm' ? '300' : '3.00'}`} value={aMetric} onChange={(e) => setAMetric(e.target.value)} className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-lg font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors" />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 cursor-pointer w-fit" onClick={() => setActiveTooltip(activeTooltip === 'sideB' ? null : 'sideB')}>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest cursor-pointer">
                      Side B Length ({metricUnit})
                    </label>
                    <Info size={14} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" />
                  </div>
                  {activeTooltip === 'sideB' && (
                    <div className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 p-2 rounded mt-2 font-sans mb-2">
                      The measurement of one of the two intersecting walls or lines forming your 90-degree corner.
                    </div>
                  )}
                  <input type="number" placeholder={`e.g. ${metricUnit === 'mm' ? '4000' : metricUnit === 'cm' ? '400' : '4.00'}`} value={bMetric} onChange={(e) => setBMetric(e.target.value)} className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-lg font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors" />
                </div>
              </div>
            )}

            <button 
              onClick={handleCalculate}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase tracking-wider py-3.5 rounded-xl transition-colors shadow-md active:scale-[0.98] mt-2"
            >
              Calculate Diagonal
            </button>
          </div>

          {/* Results Card */}
          <div className="bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-xl p-4 md:p-5">
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">
              Calculation Results
            </h4>
            
            <div className="space-y-3 font-mono text-sm">
              <div className="flex flex-col border-b border-slate-200/50 dark:border-slate-700/50 pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => setActiveTooltip(activeTooltip === 'diag' ? null : 'diag')}>
                    <span className="text-slate-600 dark:text-slate-300">Exact Diagonal (Hypotenuse):</span>
                    <Info size={14} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" />
                  </div>
                  {results ? (
                    results.isImperial ? (
                      <div className="flex flex-col items-end">
                        <span className="text-sm text-slate-400">{results.diagDec}</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-500">{results.diagFrac}</span>
                      </div>
                    ) : (
                      <span className="font-bold text-emerald-600 dark:text-emerald-500 text-right mt-1">{results.diag}</span>
                    )
                  ) : (
                    <span className="font-bold text-emerald-600 dark:text-emerald-500 text-right mt-1">--</span>
                  )}
                </div>
                {activeTooltip === 'diag' && (
                  <div className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 p-2 rounded mt-2 font-sans">
                    The precise measurement across the corner connecting the ends of Side A and Side B. If your physical tape measure matches this number, your corner is perfectly square.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Exam Formula Card */}
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl p-4">
            <h4 className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-500 uppercase tracking-widest mb-2">
              <BookOpen size={16} /> 📖 EXAM FORMULA
            </h4>
            <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong>Pythagorean Theorem: a² + b² = c²</strong><br />
              Where 'a' is Side A, 'b' is Side B, and 'c' is the Diagonal (Hypotenuse). E.g., The 3-4-5 rule is the most common ratio used in carpentry.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}




function WallFramingModal({ onClose }) {
  const [unitSystem, setUnitSystem] = useState('imperial');
  const [metricUnit, setMetricUnit] = useState('m');

  const [lenFeet, setLenFeet] = useState('');
  const [lenInches, setLenInches] = useState('');
  const [lenFraction, setLenFraction] = useState('0');

  const [hFeet, setHFeet] = useState('');
  const [hInches, setHInches] = useState('');
  const [hFraction, setHFraction] = useState('0');

  const [lenMetric, setLenMetric] = useState('');
  const [hMetric, setHMetric] = useState('');

  const [spacingImperial, setSpacingImperial] = useState('16');
  const [spacingMetric, setSpacingMetric] = useState('400');

  const [results, setResults] = useState(null);
  const [activeTooltip, setActiveTooltip] = useState(null);

  const getDecimal = (feetStr, inchStr, fracStr) => {
    let ft = parseFloat(feetStr) || 0;
    let inch = parseFloat(inchStr) || 0;
    let frac = 0;
    if (fracStr && fracStr.includes('/')) {
      const parts = fracStr.split('/');
      frac = parseFloat(parts[0]) / parseFloat(parts[1]);
    } else {
      frac = parseFloat(fracStr) || 0;
    }
    return (ft * 12) + inch + frac;
  };

  const handleCalculate = () => {
    if (unitSystem === 'imperial') {
      const lenInchesTotal = getDecimal(lenFeet, lenInches, lenFraction);
      const hInchesTotal = getDecimal(hFeet, hInches, hFraction);

      if (lenInchesTotal === 0) return;

      const spc = parseFloat(spacingImperial) || 16;
      
      const numStuds = Math.ceil(lenInchesTotal / spc) + 1;
      const lenFeetTotal = lenInchesTotal / 12;
      const platesLF = lenFeetTotal * 3;
      
      const areaSqFt = hInchesTotal > 0 ? (lenInchesTotal / 12) * (hInchesTotal / 12) : 0;
      const sheathing = areaSqFt / 32;

      setResults({
        isImperial: true,
        numStuds: `${numStuds}`,
        plates: `${platesLF.toFixed(1)} LF`,
        sheathing: hInchesTotal > 0 ? `${Math.ceil(sheathing)}` : '--'
      });
    } else {
      let l = parseFloat(lenMetric) || 0;
      let h = parseFloat(hMetric) || 0;
      
      if (l === 0) return;

      const l_mm = metricUnit === 'm' ? l * 1000 : metricUnit === 'cm' ? l * 10 : l;
      const h_mm = metricUnit === 'm' ? h * 1000 : metricUnit === 'cm' ? h * 10 : h;
      
      const spc = parseFloat(spacingMetric) || 400;

      const numStuds = Math.ceil(l_mm / spc) + 1;
      
      const lenMeters = l_mm / 1000;
      const platesM = lenMeters * 3;

      const areaSqMm = l_mm * h_mm;
      const sheetAreaMm = 1220 * 2440;
      const sheathing = areaSqMm / sheetAreaMm;

      setResults({
        isImperial: false,
        numStuds: `${numStuds}`,
        plates: `${platesM.toFixed(1)} M`,
        sheathing: h_mm > 0 ? `${Math.ceil(sheathing)}` : '--'
      });
    }
  };

  const renderFractions = () => (
    <>
      <option value="0">0</option>
      <option value="1/16">1/16"</option>
      <option value="1/8">1/8"</option>
      <option value="3/16">3/16"</option>
      <option value="1/4">1/4"</option>
      <option value="5/16">5/16"</option>
      <option value="3/8">3/8"</option>
      <option value="7/16">7/16"</option>
      <option value="1/2">1/2"</option>
      <option value="9/16">9/16"</option>
      <option value="5/8">5/8"</option>
      <option value="11/16">11/16"</option>
      <option value="3/4">3/4"</option>
      <option value="13/16">13/16"</option>
      <option value="7/8">7/8"</option>
      <option value="15/16">15/16"</option>
    </>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-2xl w-full max-w-md shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 p-4 shrink-0 bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-500 rounded-lg text-white">
              <AlignJustify size={24} />
            </div>
            <div>
              <h3 className="text-slate-900 dark:text-white text-base md:text-lg font-bold uppercase tracking-wider leading-tight">WALL FRAMING ESTIMATOR</h3>
              <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mt-0.5">MATERIAL TAKEOFFS</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition-colors p-1">
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Content (Scrollable) */}
        <div className="p-4 md:p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6">

          {/* Main Unit Toggle */}
          <div className="flex bg-slate-200 dark:bg-slate-800 rounded-lg p-1">
            <button
              onClick={() => setUnitSystem('imperial')}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${unitSystem === 'imperial' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              Imperial
            </button>
            <button
              onClick={() => setUnitSystem('metric')}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${unitSystem === 'metric' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              Metric
            </button>
          </div>

          {/* Input Section */}
          <div className="space-y-4">
            {unitSystem === 'imperial' ? (
              <>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 cursor-pointer w-fit" onClick={() => setActiveTooltip(activeTooltip === 'len' ? null : 'len')}>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest cursor-pointer">
                      Total Linear Feet
                    </label>
                    <Info size={14} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" />
                  </div>
                  {activeTooltip === 'len' && (
                    <div className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 p-2 rounded mt-2 font-sans mb-2">
                      The total continuous horizontal length of the wall being framed.
                    </div>
                  )}
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <input type="number" placeholder="Feet" value={lenFeet} onChange={(e) => setLenFeet(e.target.value)} className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl px-3 py-3 text-base font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 transition-colors" />
                    </div>
                    <div className="flex-1">
                      <input type="number" placeholder="Inches" value={lenInches} onChange={(e) => setLenInches(e.target.value)} className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl px-3 py-3 text-base font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 transition-colors" />
                    </div>
                    <div className="flex-1">
                      <select value={lenFraction} onChange={(e) => setLenFraction(e.target.value)} className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl px-2 py-3 text-base font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 transition-colors appearance-none">
                        {renderFractions()}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 cursor-pointer w-fit" onClick={() => setActiveTooltip(activeTooltip === 'height' ? null : 'height')}>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest cursor-pointer">
                      Wall Height
                    </label>
                    <Info size={14} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" />
                  </div>
                  {activeTooltip === 'height' && (
                    <div className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 p-2 rounded mt-2 font-sans mb-2">
                      Required to calculate the total square footage for your exterior sheathing takeoff.
                    </div>
                  )}
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <input type="number" placeholder="Feet" value={hFeet} onChange={(e) => setHFeet(e.target.value)} className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl px-3 py-3 text-base font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 transition-colors" />
                    </div>
                    <div className="flex-1">
                      <input type="number" placeholder="Inches" value={hInches} onChange={(e) => setHInches(e.target.value)} className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl px-3 py-3 text-base font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 transition-colors" />
                    </div>
                    <div className="flex-1">
                      <select value={hFraction} onChange={(e) => setHFraction(e.target.value)} className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl px-2 py-3 text-base font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 transition-colors appearance-none">
                        {renderFractions()}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 cursor-pointer w-fit" onClick={() => setActiveTooltip(activeTooltip === 'spc' ? null : 'spc')}>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest cursor-pointer">
                      Stud Spacing (O.C.)
                    </label>
                    <Info size={14} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" />
                  </div>
                  {activeTooltip === 'spc' && (
                    <div className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 p-2 rounded mt-2 font-sans mb-2">
                      The distance from the exact center of one stud to the exact center of the next. 16-inch (400mm) is the standard for residential load-bearing walls.
                    </div>
                  )}
                  <div className="flex bg-slate-100 dark:bg-slate-800/50 rounded-lg p-1 w-full">
                    {['12', '16', '24'].map(spc => (
                      <button
                        key={spc}
                        onClick={() => setSpacingImperial(spc)}
                        className={`flex-1 py-2.5 text-sm font-bold rounded-md transition-colors ${spacingImperial === spc ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                      >
                        {spc}"
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="flex bg-slate-100 dark:bg-slate-800/50 rounded-lg p-1 w-fit">
                  {['m', 'cm', 'mm'].map(unit => (
                    <button
                      key={unit}
                      onClick={() => setMetricUnit(unit)}
                      className={`px-4 py-1.5 text-xs font-bold uppercase rounded-md transition-colors ${metricUnit === unit ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                      {unit}
                    </button>
                  ))}
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 cursor-pointer w-fit" onClick={() => setActiveTooltip(activeTooltip === 'len' ? null : 'len')}>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest cursor-pointer">
                      Wall Length ({metricUnit})
                    </label>
                    <Info size={14} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" />
                  </div>
                  {activeTooltip === 'len' && (
                    <div className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 p-2 rounded mt-2 font-sans mb-2">
                      The total continuous horizontal length of the wall being framed.
                    </div>
                  )}
                  <input type="number" placeholder={`e.g. ${metricUnit === 'mm' ? '3000' : metricUnit === 'cm' ? '300' : '3.00'}`} value={lenMetric} onChange={(e) => setLenMetric(e.target.value)} className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-lg font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 transition-colors" />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 cursor-pointer w-fit" onClick={() => setActiveTooltip(activeTooltip === 'height' ? null : 'height')}>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest cursor-pointer">
                      Wall Height ({metricUnit})
                    </label>
                    <Info size={14} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" />
                  </div>
                  {activeTooltip === 'height' && (
                    <div className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 p-2 rounded mt-2 font-sans mb-2">
                      Required to calculate the total square footage for your exterior sheathing takeoff.
                    </div>
                  )}
                  <input type="number" placeholder={`e.g. ${metricUnit === 'mm' ? '2400' : metricUnit === 'cm' ? '240' : '2.40'}`} value={hMetric} onChange={(e) => setHMetric(e.target.value)} className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-lg font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 transition-colors" />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 cursor-pointer w-fit" onClick={() => setActiveTooltip(activeTooltip === 'spc' ? null : 'spc')}>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest cursor-pointer">
                      Stud Spacing (O.C.)
                    </label>
                    <Info size={14} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" />
                  </div>
                  {activeTooltip === 'spc' && (
                    <div className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 p-2 rounded mt-2 font-sans mb-2">
                      The distance from the exact center of one stud to the exact center of the next. 16-inch (400mm) is the standard for residential load-bearing walls.
                    </div>
                  )}
                  <div className="flex bg-slate-100 dark:bg-slate-800/50 rounded-lg p-1 w-full">
                    {['300', '400', '600'].map(spc => (
                      <button
                        key={spc}
                        onClick={() => setSpacingMetric(spc)}
                        className={`flex-1 py-2.5 text-sm font-bold rounded-md transition-colors ${spacingMetric === spc ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                      >
                        {spc}mm
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <button 
              onClick={handleCalculate}
              className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold uppercase tracking-wider py-3.5 rounded-xl transition-colors shadow-md active:scale-[0.98] mt-2"
            >
              Calculate Materials
            </button>
          </div>

          {/* Results Card */}
          <div className="bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-xl p-4 md:p-5">
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">
              Calculation Results
            </h4>
            
            <div className="space-y-3 font-mono text-sm">
              <div className="flex flex-col border-b border-slate-200/50 dark:border-slate-700/50 pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => setActiveTooltip(activeTooltip === 'r_studs' ? null : 'r_studs')}>
                    <span className="text-slate-600 dark:text-slate-300">Number of Studs:</span>
                    <Info size={14} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" />
                  </div>
                  <span className="font-bold text-teal-600 dark:text-teal-500">{results ? results.numStuds : '--'}</span>
                </div>
                {activeTooltip === 'r_studs' && (
                  <div className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 p-2 rounded mt-2 font-sans">
                    Calculated by dividing the wall length by the O.C. spacing, plus 1 starter stud at the end. Note: Many estimators simply use 1 stud per linear foot for 16-inch O.C. to account for corners, tees, and cripples.
                  </div>
                )}
              </div>

              <div className="flex flex-col border-b border-slate-200/50 dark:border-slate-700/50 pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => setActiveTooltip(activeTooltip === 'r_plates' ? null : 'r_plates')}>
                    <span className="text-slate-600 dark:text-slate-300">
                      {!results ? 'Plates (3 total):' : results.isImperial ? 'Linear Feet of Plates (3 total):' : 'Linear Meters of Plates:'}
                    </span>
                    <Info size={14} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" />
                  </div>
                  <span className="font-bold text-teal-600 dark:text-teal-500">{results ? results.plates : '--'}</span>
                </div>
                {activeTooltip === 'r_plates' && (
                  <div className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 p-2 rounded mt-2 font-sans">
                    Standard framing requires one bottom plate and a double top plate. Multiply the total wall length by 3.
                  </div>
                )}
              </div>

              <div className="flex flex-col pt-1">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => setActiveTooltip(activeTooltip === 'r_sheathing' ? null : 'r_sheathing')}>
                    <span className="text-slate-600 dark:text-slate-300">
                      {!results ? 'Sheets of Sheathing:' : results.isImperial ? '4x8 Sheets of Sheathing:' : '1220x2440mm Sheets of Sheathing:'}
                    </span>
                    <Info size={14} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" />
                  </div>
                  <span className="font-bold text-teal-600 dark:text-teal-500">{results ? results.sheathing : '--'}</span>
                </div>
                {activeTooltip === 'r_sheathing' && (
                  <div className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 p-2 rounded mt-2 font-sans">
                    Total wall area divided by the square footage of a single structural panel.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Exam Formula Card */}
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl p-4">
            <h4 className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-500 uppercase tracking-widest mb-2">
              <BookOpen size={16} /> 📖 EXAM FORMULA
            </h4>
            <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong>For 16" O.C. walls, estimate 1 stud per linear foot of wall (this accounts for corners and intersections).</strong> Always calculate 3 plates (1 bottom plate, 2 top plates) by multiplying wall length by 3. For exterior sheathing, calculate total wall square footage and divide by 32 (the square footage of a single 4x8 sheet).
            </p>
          </div>

        </div>
      </div>
    </div>
  );
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
