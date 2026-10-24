import React from 'react';
import { Clock, Trash2, X, Copy, CornerDownLeft } from 'lucide-react';

interface HistoryItem {
  id: string;
  equation: string;
  timestamp: number;
}

interface HistoryTapeProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onClear: () => void;
  onSelect?: (eq: string) => void;
  accentColor?: string;
}

export default function HistoryTape({ isOpen, onClose, history, onClear, onSelect, accentColor = "#00d2ff" }: HistoryTapeProps) {
  if (!isOpen) return null;

  const handleCopy = (eq: string) => {
    navigator.clipboard.writeText(eq);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-sm h-full bg-white dark:bg-[#121417] shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        
        {/* Header */}
        <div className="p-4 pb-4 px-4 border-b border-gray-200 dark:border-[#2D333D] bg-gray-50 dark:bg-[#1A1D23] flex justify-between items-center" style={{ paddingTop: 'calc(2.5rem + env(safe-area-inset-top, 0px))' }}>
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 flex items-center gap-2">
            <Clock className="[text-shadow:0px_1px_0px_rgba(255,255,255,0.7)] dark:[text-shadow:0px_1.5px_2px_rgba(0,0,0,0.8)] w-4 h-4" style={{ color: accentColor }} />
            Calculation History
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-900 dark:text-white" aria-label="Close History">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {history.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <Clock className="w-12 h-12 text-gray-300 dark:text-gray-700 mb-3 stroke-[1.5]" />
              <p className="text-sm font-bold text-gray-400 dark:text-gray-500">No Calculations Yet</p>
              <p className="text-xs text-gray-400 dark:text-gray-600 mt-1 max-w-[200px]">
                Your calculations and results will appear here as you work.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((item) => (
                <div 
                  key={item.id}
                  className="p-3 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2D333D] rounded-xl flex flex-col gap-2 group transition-all" onMouseEnter={(e) => { e.currentTarget.style.borderColor = accentColor; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = ""; }}
                >
                  <div className="text-xs font-mono text-gray-500 dark:text-gray-400 break-words leading-relaxed">
                    {item.equation.split('=').map((part, index, arr) => (
                      <span key={index}>
                        {part}
                        {index < arr.length - 1 && <span className="[text-shadow:0px_1px_0px_rgba(255,255,255,0.7)] dark:[text-shadow:0px_1.5px_2px_rgba(0,0,0,0.8)] font-bold" style={{ color: accentColor }}> =</span>}
                      </span>
                    ))}
                  </div>

                  <div className="flex justify-between items-center mt-1 border-t border-gray-200/50 dark:border-[#2D333D]/50 pt-2">
                    <span className="text-[10px] text-gray-400 font-mono">
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>

                    <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleCopy(item.equation)}
                        className="p-1.5 rounded bg-gray-100 dark:bg-[#23272F] text-gray-500 hover:text-white dark:text-gray-400 transition-colors"
                        title="Copy Equation"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      
                      {onSelect && (
                        <button 
                          onClick={() => onSelect(item.equation)}
                          className="p-1.5 rounded transition-colors flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider hover:brightness-110" style={{ color: accentColor, backgroundColor: `${accentColor}20` }}
                          title="Load result"
                        >
                          <CornerDownLeft className="w-3.5 h-3.5" />
                          LOAD
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {history.length > 0 && (
          <div className="p-4 border-t border-gray-200 dark:border-[#2D333D] bg-gray-50 dark:bg-[#1A1D23]">
            <button
              onClick={onClear}
              className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold rounded-xl flex items-center justify-center gap-2 transition-all uppercase tracking-wider text-xs border border-red-500/20"
            >
              <Trash2 className="w-4 h-4" />
              Clear History
            </button>
          </div>
        )}

      </div>
    </div>
  );
}