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
        className="relative w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col bg-gray-50 border-t border-l border-white/50 dark:border-white/10 border-r-0 border-b-0 dark:bg-[#111] rounded-2xl shadow-[0_15px_30px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex justify-between items-center p-4 sm:p-6 bg-gray-50/90 dark:bg-[#111]/90 backdrop-blur-md border-b border-[#ddd] dark:border-[#333]">
          <h2 id="modal-title" className="text-lg font-bold text-gray-900 dark:text-white font-sans tracking-tight">
            Voice Commands
          </h2>
          <button 
            onClick={onClose}
            className="p-2 -mr-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-200 dark:text-[#888] dark:hover:text-white dark:hover:bg-[#222] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-8 font-sans">
          {COMMAND_CATEGORIES.map((category, idx) => (
            <div key={idx} className="space-y-3">
              <h3 className="tracking-widest text-[10px] uppercase font-bold text-[#888]">
                {category.title}
              </h3>
              <div className="space-y-1">
                {category.commands.map((cmd, cmdIdx) => (
                  <div 
                    key={cmdIdx} 
                    className="grid grid-cols-[1fr_auto] gap-4 items-center p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  >
                    <span className="text-[#00d2ff] font-mono font-bold text-sm">
                      {cmd.spoken}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400 text-sm text-right">
                      {cmd.action}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Pro-Tip Box */}
          <div className="mt-8 p-4 rounded-xl bg-cyan-50 dark:bg-[#00d2ff]/10 border border-cyan-100 dark:border-[#00d2ff]/20 flex gap-3 items-start">
            <Info className="w-5 h-5 text-cyan-600 dark:text-[#00d2ff] shrink-0 mt-0.5" />
            <p className="text-sm text-cyan-900 dark:text-cyan-100/90 leading-relaxed">
              <strong>Pro Tip:</strong> Pause briefly between measurements and operators for the highest accuracy on noisy job sites.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
