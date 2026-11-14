import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface CalculatorHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'dark' | 'light';
}

const GLOSSARY_ITEMS = [
  {
    name: '[ PITCH | RISE | RUN | DIAG ]',
    description: '4-Key Right-Triangle & Rafter Solver. Store any 2 values (Pitch X/12, Rise, or Run) and tap another key to solve missing legs, hypotenuse, plumb/level angles, and 3-4-5 square check.'
  },
  {
    name: '[ FRAC ] & Quick-Tap Strip',
    description: 'Inserts a fraction slash (/) when typing numerator/denominator digits (e.g. 5 FEET 6 INCH 3 FRAC 4 ➔ 5\' 6-3/4") and toggles the 1-tap quick-fraction bar above the keypad.'
  },
  {
    name: '[ % ] (Waste / Percentage)',
    description: 'Calculates percentages or adds instant waste (e.g. 120 + 10 % ➔ 132).'
  },
  {
    name: '[ BF | OC | ARC/π | FT↔M ] (ADV Mode)',
    description: 'Carpentry macros in Advanced Mode: Board Feet (BF), 16" O.C. Stud Count (OC), Circle Arc/Circumference (π), and instant Feet ↔ Meters conversion.'
  },
  {
    name: '[ x² | √x | SIN° | COS° | TAN° ]',
    description: 'Square, Square Root, and Degree-mode Trigonometry functions for rafters and miters.'
  },
  {
    name: '[ 1/8" | 1/16" | 1/32" ] & [ FT-IN | INCH | MM ]',
    description: 'Sets tape-measure fraction rounding precision and default display/entry unit mode.'
  },
  {
    name: '[ VOICE ] & [ PRESETS ] & [ SAVE ]',
    description: 'Hands-free voice input, built-in carpentry formula presets, and cut-list saving.'
  }
];

export default function CalculatorHelpModal({ isOpen, onClose, theme }: CalculatorHelpModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 ${theme === 'dark' ? 'dark' : ''}`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal Container */}
      <div 
        className="relative w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col bg-slate-950 border border-slate-800 rounded-2xl shadow-[0_15px_30px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="help-modal-title"
      >
        {/* Header */}
        <div className="shrink-0 z-10 bg-slate-950 border-b border-slate-800 px-4 py-3 flex justify-between items-center">
          <h2 id="help-modal-title" className="text-base font-bold text-white font-sans tracking-tight">
            Calculator Functions
          </h2>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 pt-4 pb-6 space-y-3 font-sans">
          {GLOSSARY_ITEMS.map((item, idx) => (
            <div 
              key={idx} 
              className="flex flex-col p-3 rounded-xl bg-slate-900/50 border border-slate-800/70"
            >
              <span className="text-[#00d2ff] font-bold font-mono text-xs sm:text-sm">
                {item.name}
              </span>
              <span className="text-slate-300 text-xs sm:text-sm mt-1 leading-relaxed">
                {item.description}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
