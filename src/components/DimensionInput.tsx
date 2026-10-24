import React, { useState, useRef, useEffect } from 'react';
import FractionBoard from './FractionBoard';

interface DimensionInputProps {
  label: string;
  mode?: 'feet-inches' | 'inches-only';
  feetValue?: string;
  onFeetChange?: (val: string) => void;
  inchesValue: string;
  onInchesChange: (val: string) => void;
  theme?: 'dark' | 'light';
}

export default function DimensionInput({ 
  label, 
  mode = 'feet-inches',
  feetValue = '', 
  onFeetChange,
  inchesValue,
  onInchesChange,
  theme = 'dark'
}: DimensionInputProps) {
  const [showBoard, setShowBoard] = useState(false);
  const accentColor = typeof window !== 'undefined' ? (localStorage.getItem('appThemeColor') || '#00d2ff') : '#00d2ff';
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close the dropdown if the user clicks outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowBoard(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFractionSelect = (fraction: string) => {
    // Append the fraction to whatever is currently in the inches box
    const newInches = inchesValue ? `${inchesValue.trim()} ${fraction}` : fraction;
    onInchesChange(newInches);
    setShowBoard(false);
  };

  return (
    <div className="relative w-full mb-4" ref={wrapperRef}>
      <label className="block text-sm font-bold text-gray-400 tracking-wider mb-2 uppercase">
        {label}
      </label>
      
      <div className="flex gap-2">
        {/* Conditional Feet Input */}
        {mode === 'feet-inches' && (
          <div className="relative flex-1">
            <input inputMode="decimal" type="text"
              value={feetValue}
              onChange={(e) => onFeetChange?.(e.target.value)}
              placeholder="Feet"
              className={`rounded-lg p-3 w-full shadow-inner font-bold text-center focus:outline-none font-mono tracking-tight focus:border-[var(--accent-color)] focus:ring-1 focus:ring-[var(--accent-color)] transition-colors ${theme !== 'light' ? 'bg-[#0B0F13] border border-gray-800 text-white' : 'bg-slate-100 text-slate-900 border border-slate-300'}`}
            />
            <span className="absolute right-3 top-3 text-gray-500 font-bold">'</span>
          </div>
        )}
        
        {/* Inches Input (Always shows) */}
        <div className="relative flex-1">
          <input inputMode="decimal" type="text"
            value={inchesValue}
            onChange={(e) => onInchesChange(e.target.value)}
            placeholder="Inches"
            className={`rounded-lg p-3 w-full shadow-inner font-bold text-center focus:outline-none font-mono tracking-tight focus:border-[var(--accent-color)] focus:ring-1 focus:ring-[var(--accent-color)] transition-colors ${theme !== 'light' ? 'bg-[#0B0F13] border border-gray-800 text-white' : 'bg-slate-100 text-slate-900 border border-slate-300'}`}
          />
          <span className="absolute right-3 top-3 text-gray-500 font-bold">"</span>
        </div>
        
        {/* Fraction Button */}
        <button
          type="button"
          onClick={() => setShowBoard(!showBoard)}
          className="px-4 py-3 font-bold tracking-wide rounded-lg shadow-sm hover:brightness-110 whitespace-nowrap active:scale-[0.97] active:shadow-inner active:brightness-90 transition-all duration-150 [text-shadow:0px_1px_0px_rgba(255,255,255,0.7)] dark:[text-shadow:0px_1.5px_2px_rgba(0,0,0,0.8)]" style={{ backgroundColor: accentColor, color: '#fff' }}
        >
          + Frac
        </button>
      </div>

      {/* Fraction Board Dropdown */}
      {showBoard && (
        <div className={`relative w-full mt-2 rounded-xl overflow-hidden shadow-2xl border z-50 ${theme === 'dark' ? 'border-white/10' : 'border-black/10'}`}>
           <FractionBoard 
             isOpen={true} 
             onClose={() => setShowBoard(false)}
             onSelect={handleFractionSelect}
             theme={theme} 
           />
        </div>
      )}
    </div>
  );
}