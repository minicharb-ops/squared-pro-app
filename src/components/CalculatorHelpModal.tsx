import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface CalculatorHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'dark' | 'light';
}

const GLOSSARY_ITEMS = [
  {
    name: '[ RISE ] & [ RUN ]',
    description: 'Enters Triangle Mode. Sets the active axis for roof pitches, stairs, or squaring layouts.'
  },
  {
    name: '[ TRI ]',
    description: 'Toggles Triangle Mode on/off to quickly calculate diagonals (hypotenuse).'
  },
  {
    name: '[ SAVE ]',
    description: 'Saves the current standard calculation or Triangle layout to a shareable Cut List.'
  },
  {
    name: '[ VOICE ]',
    description: 'Activates the microphone for hands-free calculations. (Tap the [?] icon for voice commands).'
  },
  {
    name: '[ FRAC ]',
    description: 'Opens a quick-select grid of standard architectural tape-measure fractions.'
  },
  {
    name: '[ 1/8 | 1/16 | 1/32 ]',
    description: 'Sets the rounding precision. The calculator will automatically round decimal results to this nearest fraction.'
  },
  {
    name: '[ UNIT PILLS (INCH/FEET) ]',
    description: "Sets the default unit. If you type a raw number without explicitly pressing 'Feet' or 'Inch', the calculator assumes this unit."
  },
  {
    name: '[ x² ] (Square)',
    description: 'Multiplies a dimension by itself, converting a Linear length into Square Area.'
  },
  {
    name: '[ √x ] (Square Root)',
    description: 'Finds the square root, converting a Square Area back into a Linear length.'
  },
  {
    name: '[ SIN / COS / TAN ]',
    description: 'Standard trigonometry functions for advanced framing and rafter angles.'
  },
  {
    name: '[ CLEAR ]',
    description: 'Erases the current entry.'
  },
  {
    name: '[ DEL ]',
    description: 'Acts as a backspace to delete the last typed digit or unit.'
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
        className="relative w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col bg-gray-50 border-t border-l border-white/50 dark:border-white/10 border-r-0 border-b-0 dark:bg-[#111] rounded-2xl shadow-[0_15px_30px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="help-modal-title"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex justify-between items-center p-4 sm:p-6 bg-gray-50/90 dark:bg-[#111]/90 backdrop-blur-md border-b border-[#ddd] dark:border-[#333]">
          <h2 id="help-modal-title" className="text-lg font-bold text-gray-900 dark:text-white font-sans tracking-tight">
            Calculator Functions
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
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 font-sans">
          <div className="space-y-2">
            {GLOSSARY_ITEMS.map((item, idx) => (
              <div 
                key={idx} 
                className="flex flex-col border-b border-[#ddd] dark:border-[#333] pb-3 mb-3 last:border-0 last:mb-0 last:pb-0"
              >
                <span className="text-[#00d2ff] font-bold font-mono text-sm">
                  {item.name}
                </span>
                <span className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                  {item.description}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
