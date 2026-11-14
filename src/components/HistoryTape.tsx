import React from 'react';
import { Clock, Trash2, X, Copy, CornerDownLeft, Calculator } from 'lucide-react';

export interface HistoryItem {
  id: string;
  equation: string;
  timestamp: number;
  val?: number;
  dim?: number;
  tape?: string;
}

interface HistoryTapeProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onClear: () => void;
  onSelect?: (eq: string, item?: HistoryItem) => void;
  accentColor?: string;
  runningTotalStr?: string;
}

function formatArchInches(inches: number): string {
  const isNeg = inches < 0;
  const absIn = Math.abs(inches);
  let feet = Math.floor(absIn / 12);
  const rem = absIn - feet * 12;
  let wholeIn = Math.floor(rem);
  let sixteenths = Math.round((rem - wholeIn) * 16);
  if (sixteenths >= 16) {
    wholeIn += 1;
    sixteenths = 0;
  }
  if (wholeIn >= 12) {
    feet += 1;
    wholeIn -= 12;
  }
  const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
  let frac = '';
  if (sixteenths > 0) {
    const d = gcd(sixteenths, 16);
    frac = `${sixteenths / d}/${16 / d}`;
  }
  let out = '';
  if (feet > 0) out += `${feet}' `;
  if (wholeIn > 0 || feet === 0) {
    out += frac ? `${wholeIn === 0 ? '' : wholeIn + '-'}${frac}"` : `${wholeIn}"`;
  } else if (frac) {
    out += `${frac}"`;
  } else {
    out += `0"`;
  }
  return `${isNeg ? '-' : ''}${out.trim()}`;
}

export default function HistoryTape({
  isOpen,
  onClose,
  history,
  onClear,
  onSelect,
  accentColor = '#00d2ff',
  runningTotalStr,
}: HistoryTapeProps) {
  if (!isOpen) return null;

  const handleCopy = (e: React.MouseEvent, eq: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(eq);
  };

  // Compute running sum if not explicitly provided
  const computedRunningTotal = (() => {
    if (runningTotalStr) return runningTotalStr;
    if (history.length === 0) return '0';
    const dim1Items = history.filter((h) => h.dim === 1 && typeof h.val === 'number');
    if (dim1Items.length > 0) {
      const sumIn = dim1Items.reduce((acc, h) => acc + (h.val || 0), 0);
      return `${formatArchInches(sumIn)} (${sumIn.toFixed(2)}")`;
    }
    const numericSum = history.reduce((acc, h) => {
      if (typeof h.val === 'number') return acc + h.val;
      const rhs = h.equation.split('=')[1]?.trim() || '';
      const parsed = parseFloat(rhs.replace(/[^0-9.-]/g, ''));
      return acc + (isNaN(parsed) ? 0 : parsed);
    }, 0);
    return Number.isInteger(numericSum) ? numericSum.toLocaleString() : numericSum.toFixed(2);
  })();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-md max-h-[85vh] bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="shrink-0 z-10 bg-slate-950 border-b border-slate-800 px-4 py-3 flex justify-between items-center">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-300 flex items-center gap-2">
            <Clock className="w-4 h-4" style={{ color: accentColor }} />
            Calculation History Tape ({history.length})
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close History"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Paper Tape Summary Card (Running Sum of Results + CLEAR TAPE) */}
        {history.length > 0 && (
          <div className="shrink-0 z-10 px-4 py-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                <Calculator className="w-3 h-3" style={{ color: accentColor }} />
                Running Sum of Results
              </div>
              <div
                className="text-base sm:text-lg font-black font-mono truncate mt-0.5"
                style={{ color: accentColor }}
              >
                {computedRunningTotal}
              </div>
            </div>
            <button
              onClick={onClear}
              className="shrink-0 px-3 py-2 bg-red-500/15 hover:bg-red-500/25 text-red-400 font-black rounded-lg flex items-center gap-1.5 transition-all uppercase tracking-wider text-[10px] border border-red-500/30 active:scale-95"
            >
              <Trash2 className="w-3.5 h-3.5" />
              CLEAR TAPE
            </button>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 pt-4 pb-6 space-y-3">
          {history.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center px-6">
              <Clock className="w-12 h-12 text-slate-700 mb-3 stroke-[1.5]" />
              <p className="text-sm font-bold text-slate-400">No Calculations Yet</p>
              <p className="text-xs text-slate-500 mt-1 max-w-[220px]">
                Your paper tape calculations and running totals will appear here as you work.
              </p>
            </div>
          ) : (
            history.map((item, idx) => {
              const parts = item.equation.split('=');
              const lhs = parts[0]?.trim() || item.equation;
              const rhs = parts.slice(1).join('=').trim();

              return (
                <div
                  key={item.id}
                  onClick={() => onSelect && onSelect(item.equation, item)}
                  className="p-3 bg-slate-900/70 hover:bg-slate-900 border border-slate-800 rounded-xl flex flex-col gap-2 cursor-pointer group transition-all active:scale-[0.99]"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = accentColor;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '';
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 font-mono">
                      #{history.length - idx} •{' '}
                      {new Date(item.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </span>
                    <button
                      onClick={(e) => handleCopy(e, item.equation)}
                      className="p-1 rounded bg-slate-800/80 text-slate-400 hover:text-white transition-colors"
                      title="Copy Equation"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="flex items-baseline justify-between gap-2 font-mono">
                    <span className="text-xs text-slate-400 break-all">{lhs} =</span>
                    <span
                      className="text-base sm:text-lg font-black whitespace-nowrap"
                      style={{ color: accentColor }}
                    >
                      {rhs || lhs}
                    </span>
                  </div>

                  <div className="flex justify-end items-center pt-1.5 border-t border-slate-800/80">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onSelect) onSelect(item.equation, item);
                      }}
                      className="px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider hover:brightness-110"
                      style={{
                        color: accentColor,
                        backgroundColor: `${accentColor}18`,
                        border: `1px solid ${accentColor}40`,
                      }}
                      title="Insert result into active calculator input"
                    >
                      <CornerDownLeft className="w-3 h-3" />
                      Tap to Insert
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}