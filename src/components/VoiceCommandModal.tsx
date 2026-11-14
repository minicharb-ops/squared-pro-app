import React, { useEffect } from 'react';
import { X, Info } from 'lucide-react';

interface VoiceCommandModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'dark' | 'light';
}

const COMMAND_CATEGORIES = [
  {
    title: 'Basic Math',
    commands: [
      { spoken: '"Plus" / "Add"', action: 'Addition' },
      { spoken: '"Minus" / "Subtract"', action: 'Subtraction' },
      { spoken: '"Times" / "Multiply"', action: 'Multiplication' },
      { spoken: '"Divided By"', action: 'Division' }
    ]
  },
  {
    title: 'Units & Fractions',
    commands: [
      { spoken: '"Feet"', action: 'Feet (ft)' },
      { spoken: '"Inches"', action: 'Inches (in)' },
      { spoken: '"Millimeters"', action: 'Millimeters (mm)' },
      { spoken: '"One Half"', action: '1/2' },
      { spoken: '"Three Quarters"', action: '3/4' },
      { spoken: '"Five feet six and a half inches"', action: 'Enters 5\' 6-1/2"' }
    ]
  },
  {
    title: 'Quick Square / Macros',
    commands: [
      { spoken: '"Set Rise"', action: 'Sets the Rise value' },
      { spoken: '"Set Run"', action: 'Sets the Run value' },
      { spoken: '"Calculate Diagonal"', action: 'Computes the hypotenuse' }
    ]
  },
  {
    title: 'Commands',
    commands: [
      { spoken: '"Clear Board"', action: 'Clears current calculation' },
      { spoken: '"Delete"', action: 'Backspace / Undo last entry' },
      { spoken: '"Equals"', action: 'Calculates the result' }
    ]
  }
];

export default function VoiceCommandModal({ isOpen, onClose, theme }: VoiceCommandModalProps) {
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
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="shrink-0 z-10 bg-slate-950 border-b border-slate-800 px-4 py-3 flex justify-between items-center">
          <h2 id="modal-title" className="text-base font-bold text-white font-sans tracking-tight">
            Voice Commands
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
        <div className="flex-1 overflow-y-auto px-4 pt-4 pb-6 space-y-6 font-sans">
          {COMMAND_CATEGORIES.map((category, idx) => (
            <div key={idx} className="space-y-2.5">
              <h3 className="tracking-widest text-[10px] uppercase font-bold text-slate-400">
                {category.title}
              </h3>
              <div className="space-y-1">
                {category.commands.map((cmd, cmdIdx) => (
                  <div 
                    key={cmdIdx} 
                    className="grid grid-cols-[1fr_auto] gap-4 items-center p-2 rounded-lg bg-slate-900/50 border border-slate-800/60 hover:bg-slate-900 transition-colors"
                  >
                    <span className="text-[#00d2ff] font-mono font-bold text-xs sm:text-sm">
                      {cmd.spoken}
                    </span>
                    <span className="text-slate-300 text-xs sm:text-sm text-right">
                      {cmd.action}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Pro-Tip Box */}
          <div className="p-4 rounded-xl bg-[#00d2ff]/10 border border-[#00d2ff]/20 flex gap-3 items-start">
            <Info className="w-5 h-5 text-[#00d2ff] shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-cyan-100/90 leading-relaxed">
              <strong>Pro Tip:</strong> Pause briefly between measurements and operators for the highest accuracy on noisy job sites.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
