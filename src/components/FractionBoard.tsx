import React from 'react';
import { X } from 'lucide-react';

interface FractionBoardProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (fraction: string) => void;
  theme: 'dark' | 'light';
}

function simplifyFraction(num: number, den: number) {
  const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : a;
  const divisor = gcd(num, den);
  return { n: num / divisor, d: den / divisor };
}

const FRACTIONS = Array.from({ length: 31 }, (_, i) => simplifyFraction(i + 1, 32));

export default function FractionBoard({ isOpen, onClose, onSelect, theme }: FractionBoardProps) {
  if (!isOpen) return null;

  const getFractionClass = (d: number, isDark: boolean) => {
    if (d === 2 || d === 4) {
      return isDark ? 'text-2xl font-black text-white tracking-wide [text-shadow:0px_1.5px_2px_rgba(0,0,0,0.8)]' : 'text-2xl font-black text-slate-900 tracking-wide [text-shadow:0px_1px_0px_rgba(255,255,255,0.7)]';
    } else if (d === 8) {
      return isDark ? 'text-xl font-bold text-gray-200 tracking-wide [text-shadow:0px_1.5px_2px_rgba(0,0,0,0.8)]' : 'text-xl font-bold text-slate-700 tracking-wide [text-shadow:0px_1px_0px_rgba(255,255,255,0.7)]';
    } else if (d === 16) {
      return isDark ? 'text-lg font-bold text-gray-400 tracking-wide [text-shadow:0px_1.5px_2px_rgba(0,0,0,0.8)]' : 'text-lg font-bold text-slate-500 tracking-wide [text-shadow:0px_1px_0px_rgba(255,255,255,0.7)]';
    } else {
      return isDark ? 'text-sm font-bold text-gray-500 tracking-wide [text-shadow:0px_1.5px_2px_rgba(0,0,0,0.8)]' : 'text-sm font-bold text-slate-400 tracking-wide [text-shadow:0px_1px_0px_rgba(255,255,255,0.7)]';
    }
  };

  return (
    <div className={`relative z-50 flex flex-col w-full overflow-hidden shadow-[0_15px_30px_rgba(0,0,0,0.5)] border-t border-l border-white/10 ${theme === 'dark' ? 'dark' : ''}`}>
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 backdrop-blur-md ${theme === 'dark' ? 'bg-black/80' : 'bg-gray-200/90'}`}
        onClick={onClose}
      />
      
      {/* Container */}
      <div className="relative flex flex-col z-10 p-2">
        {/* Header */}
        <div className="flex justify-between items-center mb-2 px-2">
          <span className={`text-sm font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-200' : 'text-slate-700'}`}>
            Quick Add Fraction
          </span>
          <button 
            onClick={onClose}
            className={`p-1.5 rounded-full ${theme === 'dark' ? 'bg-white/10 hover:bg-white/20 text-gray-200' : 'bg-black/5 hover:bg-black/10 text-slate-700'} active:scale-[0.97] active:shadow-inner active:brightness-90 transition-all duration-150`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Grid */}
        <div className="pr-1 pb-1">
          <div className="grid grid-cols-4 gap-1">
            {FRACTIONS.map((frac, idx) => {
              const isDark = theme === 'dark';
              const textClass = getFractionClass(frac.d, isDark);
              const fractionStr = `${frac.n}/${frac.d}`;
              
              return (
                <button
                  key={idx}
                  onClick={() => onSelect(fractionStr)}
                  className={`
                    flex items-center justify-center h-10 rounded-lg 
                    ${isDark ? 'bg-[#333] border-b-4 border-[#111] hover:bg-gray-600' : 'bg-white border-b-4 border-gray-300 hover:bg-gray-50'}
                    shadow-sm active:translate-y-1 active:border-b-0 
                   active:scale-[0.97] active:shadow-inner active:brightness-90 transition-all duration-150`}
                >
                  <span className={textClass}>
                    {fractionStr}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
