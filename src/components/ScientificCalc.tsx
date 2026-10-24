import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Delete, Mic, MicOff, Settings2, Info, HelpCircle, Save, X, Share, BookOpen, Clock } from 'lucide-react';
import VoiceCommandModal from './VoiceCommandModal';
import { SpeechRecognition } from '@capacitor-community/speech-recognition';
import CalculatorHelpModal from './CalculatorHelpModal';
import FractionBoard from './FractionBoard';
import PresetsMenu from './PresetsMenu';
import HistoryTape from './HistoryTape';

type Dimension = 0 | 1 | 2 | 3;
type Token = { type: 'num' | 'unit', val: string };
type SavedItem = {
  id: string;
  timestamp: number;
  type: 'standard' | 'triangle';
  data: string;
};

// Add type for speech recognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

function hapticFeedback() {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(15);
  }
}

function renderFractionString(str: string) {
  if (!str) return null;
  const parts = str.split(/(\d+\/\d+)/g);
  return parts.map((part, i) => {
    if (part.match(/^\d+\/\d+$/)) {
      const [num, den] = part.split('/');
      return (
        <span key={i} className="inline-block align-middle mx-0.5" style={{ fontSize: '0.85em' }}>
          <sup style={{ fontSize: '0.75em' }}>{num}</sup>&frasl;<sub style={{ fontSize: '0.75em' }}>{den}</sub>
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

interface ScientificCalcProps {
  theme: 'dark' | 'light';
  unitMode: 'imp' | 'met';
  onHistoryUpdate?: (historyItem: { id: string, equation: string, timestamp: number }) => void;
  onSwitchTool?: (toolId: any) => void;
  accentColor?: string;
  secondaryColor?: string;
}

function parseFractionStr(str: string): number {
  if (!str || str === '-') return 0;
  const isNegative = str.trim().startsWith('-');
  str = str.trim().replace(/-/g, ' ');
  const parts = str.split(/\s+/);
  let total = 0;
  for (const p of parts) {
    if (p === '-' || p === '+') continue;
    if (p.includes('/')) {
      const [n, d] = p.split('/');
      const num = parseFloat(n) || 0;
      const den = parseFloat(d) || 1;
      if (den !== 0) total += Math.abs(num) / Math.abs(den);
    } else {
      const val = parseFloat(p);
      if (!isNaN(val)) total += Math.abs(val);
    }
  }
  return isNegative ? -total : total;
}

function formatImperialLength(inches: number, precision: number = 16) {
  const isNeg = inches < 0;
  inches = Math.abs(inches);
  const totalInches = inches;
  let feet = Math.floor(inches / 12);
  let remainInches = inches - (feet * 12);
  
  let wholeInches = Math.floor(remainInches);
  let fracPart = remainInches - wholeInches;
  let fracPrecision = Math.round(fracPart * precision);
  
  if (fracPrecision >= precision) {
      wholeInches += 1;
      fracPrecision = 0;
  }
  if (wholeInches >= 12) {
      feet += 1;
      wholeInches -= 12;
  }
  
  let fracStr = "";
  if (fracPrecision > 0) {
      const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : a;
      const divisor = gcd(fracPrecision, precision);
      fracStr = `${fracPrecision / divisor}/${precision / divisor}`;
  }

  let primary = "";
  if (feet > 0) {
      primary += `${feet}' `;
  }
  
  if (wholeInches > 0 || feet === 0) {
      if (fracStr) {
          primary += `${wholeInches === 0 ? '' : wholeInches + '-'}${fracStr}"`;
      } else {
          primary += `${wholeInches}"`;
      }
  } else if (feet > 0 && wholeInches === 0) {
      if (fracStr) {
          primary += `${fracStr}"`;
      } else {
          primary += `0"`;
      }
  }

  const sign = isNeg ? '-' : '';
  const secTotal = totalInches.toFixed(4).replace(/\.?0+$/, '') || '0';
  return {
      primary: `${sign}${primary.trim()}`,
      secondary: `${sign}${secTotal}"`
  };
}

function formatValue(val: number, dim: number, mode: 'imp' | 'met', precision: number = 16) {
  if (dim === 0) {
      const p = Number.isInteger(val) ? val.toString() : val.toFixed(4).replace(/\.?0+$/, '');
      return { primary: p, secondary: '' };
  }

  if (mode === 'imp') {
      if (dim === 1) {
          return formatImperialLength(val, precision);
      }
      if (dim === 2) {
          const sqFt = val / 144;
          return { 
            primary: `${sqFt.toFixed(4).replace(/\.?0+$/, '')} SQ FT`, 
            secondary: `${val.toFixed(2).replace(/\.?0+$/, '')} SQ IN` 
          };
      }
      if (dim === 3) {
          const cuYd = val / 46656;
          const cuFt = val / 1728;
          return { 
            primary: `${cuYd.toFixed(4).replace(/\.?0+$/, '')} CU YD`, 
            secondary: `${cuFt.toFixed(4).replace(/\.?0+$/, '')} CU FT` 
          };
      }
  } else {
      if (dim === 1) {
          const m = val / 1000;
          const cm = val / 10;
          return { 
              primary: `${m.toFixed(4).replace(/\.?0+$/, '')} m`, 
              secondary: `${cm.toFixed(2).replace(/\.?0+$/, '')} cm | ${val.toFixed(2).replace(/\.?0+$/, '')} mm` 
          };
      }
      if (dim === 2) {
          const sqM = val / 1000000;
          return { 
            primary: `${sqM.toFixed(4).replace(/\.?0+$/, '')} SQ M`, 
            secondary: `${val.toFixed(2).replace(/\.?0+$/, '')} SQ MM` 
          };
      }
      if (dim === 3) {
          const cuM = val / 1000000000;
          return { primary: `${cuM.toFixed(4).replace(/\.?0+$/, '')} CU M`, secondary: '' };
      }
  }
  return { primary: 'ERR', secondary: '' };
}

function evaluateTokens(tokens: Token[], unitMode: 'imp'|'met') {
  let value: number | null = null;
  let dim = 0;
  let pending = "";
  let str = "";
  
  for (const t of tokens) {
      if (t.type === 'num') {
          pending = t.val;
          str += t.val;
      } else if (t.type === 'unit') {
          let numVal = parseFractionStr(pending);
          if (pending.startsWith('-') && value === null) {
              // Handled by parseFractionStr correctly if just '-5'
          }
          if (value === null && pending === '') numVal = 0; // Just pressed unit

          if (unitMode === 'imp') {
              if (t.val === 'ft') {
                  value = (value || 0) + numVal * 12;
                  dim = 1;
                  str += "' ";
              } else if (t.val === 'in') {
                  value = (value || 0) + numVal;
                  dim = 1;
                  str += '" ';
              }
          } else {
              if (t.val === 'm') {
                  value = (value || 0) + numVal * 1000;
                  dim = 1;
                  str += "m ";
              } else if (t.val === 'cm') {
                  value = (value || 0) + numVal * 10;
                  dim = 1;
                  str += "cm ";
              } else if (t.val === 'mm') {
                  value = (value || 0) + numVal;
                  dim = 1;
                  str += "mm ";
              }
          }
          pending = "";
      }
  }
  return { value, dim, pending, str: str.trim() + (pending && str.endsWith(' ') ? '' : '') };
}

function doMath(v1: number, d1: number, v2: number, d2: number, op: string, defaultUnitMult: number = 1) {
  if (op === '+' || op === '-') {
      let calcV1 = v1;
      let calcV2 = v2;
      let calcD1 = d1;
      let calcD2 = d2;
      
      if (calcD1 === 1 && calcD2 === 0) {
          calcV2 = calcV2 * defaultUnitMult;
          calcD2 = 1;
      } else if (calcD1 === 0 && calcD2 === 1) {
          calcV1 = calcV1 * defaultUnitMult;
          calcD1 = 1;
      }

      if (calcD1 !== calcD2) throw new Error("Dimension Mismatch");
      return { val: op === '+' ? calcV1 + calcV2 : calcV1 - calcV2, dim: calcD1 };
  }
  if (op === '*') {
      const newDim = d1 + d2;
      if (newDim > 3) throw new Error("Max Dimension (3) Exceeded");
      return { val: v1 * v2, dim: newDim };
  }
  if (op === '/') {
      if (v2 === 0) throw new Error("Divide by Zero");
      const newDim = d1 - d2;
      if (newDim < 0) throw new Error("Invalid Dimension");
      return { val: v1 / v2, dim: newDim };
  }
  return { val: v2, dim: d2 };
}

export interface ScientificCalcRef {
  injectValue: (val: number, dim: number, tapeString: string) => void;
}

const ScientificCalc = React.forwardRef<ScientificCalcRef, ScientificCalcProps>(({ theme, unitMode, onHistoryUpdate, onSwitchTool, accentColor = "#06b6d4", secondaryColor = "#3b82f6" }, ref) => {
  const [accumulator, setAccumulator] = useState<number | null>(null);
  const [accumDim, setAccumDim] = useState<number>(0);
  const [operator, setOperator] = useState<string | null>(null);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [resultValue, setResultValue] = useState<number | null>(null);
  const [resultDim, setResultDim] = useState<number>(0);
  const [historyTape, setHistoryTape] = useState<string>("");
  const [justCalculated, setJustCalculated] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isAdvanced, setIsAdvanced] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState<boolean>(false);
  const [liveTranscript, setLiveTranscript] = useState<string>("");
	const voiceTimeoutRef = useRef<any>(null);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState<boolean>(false);
  const [isFractionModalOpen, setIsFractionModalOpen] = useState<boolean>(false);
  const [savedList, setSavedList] = useState<SavedItem[]>([]);
  const [isPresetsOpen, setIsPresetsOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [localHistoryList, setLocalHistoryList] = useState<{ id: string, equation: string, timestamp: number, val?: number, dim?: number, tape?: string }[]>([]);
  const isVoiceActiveRef = useRef<boolean>(false);

  const addHistoryItem = useCallback((eq: string, val?: number, dim?: number, tape?: string) => {
    const newItem = { 
      id: crypto.randomUUID(), 
      equation: eq, 
      timestamp: Date.now(),
      val,
      dim,
      tape
    };
    setLocalHistoryList(prev => [newItem, ...prev]);
    if (onHistoryUpdate) {
      onHistoryUpdate(newItem);
    }
  }, [onHistoryUpdate]);

  const handleLoadHistory = useCallback((item: { val?: number, dim?: number, tape?: string, equation: string }) => {
    if (item.val !== undefined && item.dim !== undefined) {
      setResultValue(item.val);
      setResultDim(item.dim);
      setTokens([]);
      setAccumulator(null);
      setOperator(null);
      setJustCalculated(true);
      setHistoryTape(item.tape || item.equation.split('=')[0]?.trim() || "");
    } else {
      navigator.clipboard.writeText(item.equation);
    }
    setIsHistoryOpen(false);
  }, []);
  const recognitionRef = useRef<any>(null);

  const [triangleMode, setTriangleMode] = useState<boolean>(false);
  const [triangleState, setTriangleState] = useState({
    rise: { val: 0, dim: 1 },
    run: { val: 0, dim: 1 }
  });
  const [activeAxis, setActiveAxis] = useState<'rise'|'run'>('rise');
  const [defaultUnit, setDefaultUnit] = useState<string>(unitMode === 'imp' ? 'in' : 'cm');
  const [precision, setPrecision] = useState<number>(16);

  useEffect(() => {
    setDefaultUnit(unitMode === 'imp' ? 'in' : 'cm');
  }, [unitMode]);

  React.useImperativeHandle(ref, () => ({
    injectValue: (val: number, dim: number, tapeString: string) => {
      setResultValue(val);
      setResultDim(dim);
      setTokens([]);
      setAccumulator(null);
      setOperator(null);
      setJustCalculated(true);
      setHistoryTape(tapeString);
      
      addHistoryItem(`${tapeString} = ${formatValue(val, dim, unitMode, precision).primary}`, val, dim, tapeString);
    }
  }));

  const clearAll = useCallback(() => {
    setAccumulator(null);
    setAccumDim(0);
    setOperator(null);
    setTokens([]);
    setResultValue(null);
    setResultDim(0);
    setHistoryTape("");
    setJustCalculated(false);
    setError(null);
  }, []);

  const getActiveInput = useCallback(() => {
    if (justCalculated) {
        return { val: resultValue || 0, dim: resultDim, valid: true };
    }
    if (tokens.length === 0) {
        return { val: 0, dim: 0, valid: false };
    }
    const ev = evaluateTokens(tokens, unitMode);
    let finalVal = ev.value;
    let finalDim = ev.dim;
    if (finalVal === null) {
        finalVal = parseFractionStr(ev.pending);
        finalDim = 0;
    } else {
        if (ev.pending) {
            finalVal += parseFractionStr(ev.pending);
        }
    }
    return { val: finalVal, dim: finalDim, valid: true };
  }, [justCalculated, resultValue, resultDim, tokens, unitMode]);

  const handleTriangleButton = useCallback((axis: 'rise'|'run') => {
    hapticFeedback();
    if (!triangleMode) {
      setTriangleMode(true);
      setActiveAxis(axis);
    } else {
      if (activeAxis !== axis) {
        const currentActive = getActiveInput();
        setTriangleState(prev => {
          const nextState = { ...prev, [activeAxis]: { val: currentActive.val, dim: currentActive.dim } };
          setResultValue(nextState[axis].val);
          setResultDim(nextState[axis].dim);
          return nextState;
        });
        setActiveAxis(axis);
        clearAll();
        setJustCalculated(true);
      }
    }
  }, [triangleMode, activeAxis, getActiveInput, clearAll]);

  const toggleTriangleMode = useCallback(() => {
    hapticFeedback();
    if (triangleMode) {
      const activeInput = getActiveInput();
      const currentRise = activeAxis === 'rise' ? activeInput : triangleState.rise;
      const currentRun = activeAxis === 'run' ? activeInput : triangleState.run;
      const diagVal = Math.sqrt(Math.pow(currentRise.val, 2) + Math.pow(currentRun.val, 2));
      const diagDim = Math.max(currentRise.dim, currentRun.dim);
      
      setTriangleMode(false);
      clearAll();
      setResultValue(diagVal);
      setResultDim(diagDim);
      setJustCalculated(true);
    } else {
      setTriangleMode(true);
      setActiveAxis('rise');
    }
  }, [triangleMode, activeAxis, getActiveInput, triangleState, clearAll]);

  const handleNumber = useCallback((char: string) => {
    hapticFeedback();
    if (error) return;
    if (justCalculated) clearAll();
    setTokens(prev => {
        const last = prev[prev.length - 1];
        if (!last || last.type === 'unit') {
            return [...prev, { type: 'num', val: char }];
        } else {
            const newTokens = [...prev];
            newTokens[newTokens.length - 1] = { type: 'num', val: last.val + char };
            return newTokens;
        }
    });
  }, [justCalculated, clearAll, error]);

  const handleToggleSign = useCallback(() => {
    hapticFeedback();
    if (error) return;
    if (justCalculated && resultValue !== null) {
        setResultValue(-resultValue);
        return;
    }
    setTokens(prev => {
        if (prev.length === 0) return [{ type: 'num', val: '-' }];
        const last = prev[prev.length - 1];
        if (last.type === 'unit') {
            return [...prev, { type: 'num', val: '-' }];
        } else {
            const newVal = last.val.startsWith('-') ? last.val.slice(1) : '-' + last.val;
            const newTokens = [...prev];
            newTokens[newTokens.length - 1] = { type: 'num', val: newVal };
            return newTokens;
        }
    });
  }, [justCalculated, resultValue, error]);

  const handleUnit = useCallback((unit: string) => {
    hapticFeedback();
    if (error) return;
    if (justCalculated) clearAll();
    setTokens(prev => {
        const last = prev[prev.length - 1];
        if (!last || last.type === 'unit') {
            return [...prev, { type: 'num', val: '0' }, { type: 'unit', val: unit }];
        } else {
            return [...prev, { type: 'unit', val: unit }];
        }
    });
  }, [justCalculated, clearAll, error]);

  const handleFractionSelect = useCallback((fraction: string) => {
    hapticFeedback();
    setIsFractionModalOpen(false);
    if (error) return;
    if (justCalculated) {
      clearAll();
      setTokens([{ type: 'num', val: fraction }]);
      return;
    }
    
    setTokens(prev => {
        const last = prev[prev.length - 1];
        if (!last || last.type === 'unit') {
            return [...prev, { type: 'num', val: fraction }];
        } else {
            const newTokens = [...prev];
            let newVal = last.val;
            
            if (newVal === '0') {
              newVal = fraction;
            } else if (newVal.includes('/')) {
              newVal = newVal.split('-')[0] + '-' + fraction;
            } else {
              newVal = newVal + '-' + fraction;
            }
            newTokens[newTokens.length - 1] = { type: 'num', val: newVal };
            return newTokens;
        }
    });
  }, [justCalculated, clearAll, error]);

  const handleBackspace = useCallback(() => {
    hapticFeedback();
    if (error) { clearAll(); return; }
    if (justCalculated) {
        clearAll();
        return;
    }
    setTokens(prev => {
        if (prev.length === 0) return prev;
        const last = prev[prev.length - 1];
        if (last.type === 'unit') {
            return prev.slice(0, -1);
        } else {
            const newVal = last.val.slice(0, -1);
            if (newVal === "" || newVal === "-") return prev.slice(0, -1);
            const newTokens = [...prev];
            newTokens[newTokens.length - 1] = { type: 'num', val: newVal };
            return newTokens;
        }
    });
  }, [justCalculated, clearAll, error]);

  const handleClear = useCallback(() => {
    hapticFeedback();
    if (error) { clearAll(); return; }
    if (tokens.length > 0) {
        setTokens([]);
    } else {
        clearAll();
    }
  }, [tokens.length, clearAll, error]);

  const getUnitMult = useCallback((unit: string) => {
    switch (unit) {
      case 'ft': return 12;
      case 'in': return 1;
      case 'm': return 1000;
      case 'cm': return 10;
      case 'mm': return 1;
      default: return 1;
    }
  }, []);

  const handleOperator = useCallback((op: string) => {
    hapticFeedback();
    if (error) return;
    const active = getActiveInput();
    if (!active.valid && accumulator === null) return;

    let nextAccV = active.val;
    let nextAccD = active.dim;

    try {
        if (accumulator !== null && operator && !justCalculated) {
            const res = doMath(accumulator, accumDim, active.val, active.dim, operator, getUnitMult(defaultUnit));
            nextAccV = res.val;
            nextAccD = res.dim;
        }

        setAccumulator(nextAccV);
        setAccumDim(nextAccD);
        setOperator(op);
        
        const activeStr = justCalculated ? formatValue(resultValue!, resultDim, unitMode, precision).primary : (evaluateTokens(tokens, unitMode).str || "0");
        setHistoryTape(prev => `${prev ? prev + ' ' : ''}${activeStr} ${op}`);

        setTokens([]);
        setJustCalculated(false);
        setResultValue(null);
    } catch (err: any) {
        setError(err.message);
    }
  }, [accumulator, operator, justCalculated, accumDim, error, tokens, resultValue, resultDim, unitMode, getActiveInput]);

  const handleEquals = useCallback(() => {
    hapticFeedback();
    if (error) return;

    if (!operator || accumulator === null) {
      if (accumulator === null && !operator) {
        const active = getActiveInput();
        if (active.valid && active.dim === 0) {
          const resVal = active.val * getUnitMult(defaultUnit);
          setResultValue(resVal);
          setResultDim(1);
          setTokens([]);
          setJustCalculated(true);
          const activeStr = evaluateTokens(tokens, unitMode).str || "0";
          const fullEq = `${activeStr} =`;
          setHistoryTape(fullEq);
          addHistoryItem(`${fullEq} ${formatValue(resVal, 1, unitMode, precision).primary}`, resVal, 1, activeStr);
        }
      }
      return;
    }
    
    const active = getActiveInput();
    
    try {
        const res = doMath(accumulator, accumDim, active.val, active.dim, operator, getUnitMult(defaultUnit));
        
        const activeStr = justCalculated ? formatValue(resultValue!, resultDim, unitMode, precision).primary : (evaluateTokens(tokens, unitMode).str || "0");
        const fullEq = `${historyTape} ${activeStr} =`;
        setHistoryTape(fullEq);
        
        setResultValue(res.val);
        setResultDim(res.dim);
        setAccumulator(null);
        setOperator(null);
        setTokens([]);
        setJustCalculated(true);

        addHistoryItem(`${fullEq} ${formatValue(res.val, res.dim, unitMode, precision).primary}`, res.val, res.dim, `${historyTape} ${activeStr}`);
    } catch (err: any) {
        setError(err.message);
    }
  }, [error, operator, accumulator, accumDim, justCalculated, resultValue, resultDim, unitMode, tokens, historyTape, onHistoryUpdate, getActiveInput, getUnitMult, defaultUnit]);

  const handleSaveToList = useCallback(() => {
    hapticFeedback();
    
    if (triangleMode) {
      const activeInput = getActiveInput();
      const currentRise = activeAxis === 'rise' ? activeInput : triangleState.rise;
      const currentRun = activeAxis === 'run' ? activeInput : triangleState.run;
      
      const riseVal = currentRise.val;
      const riseDim = currentRise.dim;
      const runVal = currentRun.val;
      const runDim = currentRun.dim;
      const diagVal = Math.sqrt(riseVal*riseVal + runVal*runVal);
      const diagDim = Math.max(riseDim, runDim);
      
      let data = '';
      if (unitMode === 'imp') {
        const formatImpStr = (v: number, d: number) => {
           const formatted = formatValue(v, d, 'imp', precision);
           if (d === 1) {
             return `${v.toFixed(2)}" (${formatted.primary})`;
           }
           return formatted.primary;
        };
        
        data = `  Rise: ${formatImpStr(riseVal, riseDim)}\n  Run:  ${formatImpStr(runVal, runDim)}\n  Diag: ${formatImpStr(diagVal, diagDim)}`;
      } else {
        const formatMetStr = (v: number, d: number) => {
          const formatted = formatValue(v, d, 'met', precision);
          return `${formatted.primary}`;
        };
        data = `  Rise: ${formatMetStr(riseVal, riseDim)}\n  Run:  ${formatMetStr(runVal, runDim)}\n  Diag: ${formatMetStr(diagVal, diagDim)}`;
      }
      
      setSavedList(prev => [...prev, {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        type: 'triangle',
        data
      }]);
    } else {
      if (!justCalculated && tokens.length === 0) return;
      
      let data = '';
      if (justCalculated) {
         const resStr = formatValue(resultValue || 0, resultDim, unitMode, precision).primary;
         data = `${historyTape.trim()} ${resStr}`;
      } else {
         const currentExpr = evaluateTokens(tokens, unitMode).str || "0";
         if (historyTape && operator) {
            try {
              const active = getActiveInput();
              const res = doMath(accumulator, accumDim, active.val, active.dim, operator, getUnitMult(defaultUnit));
              const resStr = formatValue(res.val, res.dim, unitMode, precision).primary;
              data = `${historyTape.trim()} ${currentExpr} = ${resStr}`;
            } catch {
              data = `${historyTape.trim()} ${currentExpr}`;
            }
         } else {
            data = currentExpr;
         }
      }
      
      if (!data.trim()) return;
      
      setSavedList(prev => [...prev, {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        type: 'standard',
        data
      }]);
    }
  }, [triangleMode, triangleState, unitMode, justCalculated, historyTape, resultValue, resultDim, tokens, operator, accumulator, accumDim, getActiveInput, getUnitMult, defaultUnit]);

  const handleShareList = useCallback(async () => {
    hapticFeedback();
    const text = "📐 SQUARED PRO - CUT LIST\n\n" + savedList.map((item, index) => {
      if (item.type === 'triangle') {
        return `Cut #${index + 1} (Triangle Layout):\n${item.data}`;
      }
      return `Cut #${index + 1}:\n  ${item.data}`;
    }).join('\n\n');
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'ProBuild Cut List',
          text: text
        });
      } catch (err) {
        console.error("Error sharing", err);
      }
    } else if (navigator.clipboard) {
       try {
         await navigator.clipboard.writeText(text);
         alert("Copied to clipboard!");
       } catch (err) {
         console.error("Error copying", err);
       }
    }
  }, [savedList]);

  const handleSci = useCallback((op: string) => {
    hapticFeedback();
    if (error) return;
    const active = getActiveInput();
    if (!active.valid) return;

    let resV = active.val;
    let resD = active.dim;

    try {
        if (op === 'sq') {
            resV = resV * resV;
            resD = resD * 2;
            if (resD > 3) throw new Error("Max Dimension Exceeded");
        } else if (op === 'sqrt') {
            if (resV < 0) throw new Error("Invalid Input");
            if (resD % 2 !== 0) throw new Error("Invalid Dimension for SQRT");
            resV = Math.sqrt(resV);
            resD = resD / 2;
        } else if (['sin', 'cos', 'tan'].includes(op)) {
            if (resD !== 0) throw new Error("Dimension must be Scalar");
            const rad = resV * (Math.PI / 180);
            if (op === 'sin') resV = Math.sin(rad);
            if (op === 'cos') resV = Math.cos(rad);
            if (op === 'tan') resV = Math.tan(rad);
            resV = Math.round(resV * 10000000) / 10000000;
        }

        setResultValue(resV);
        setResultDim(resD);
        setTokens([]);
        setJustCalculated(true);
        
        const activeStr = justCalculated ? formatValue(active.val, active.dim, unitMode, precision).primary : (evaluateTokens(tokens, unitMode).str || "0");
        const fnName = op === 'sq' ? 'SQR' : op.toUpperCase();
        const fullEq = `${fnName}(${activeStr}) =`;
        setHistoryTape(fullEq);

        addHistoryItem(`${fullEq} ${formatValue(resV, resD, unitMode, precision).primary}`, resV, resD, `${fnName}(${activeStr})`);
    } catch (err: any) {
        setError(err.message);
    }
  }, [error, justCalculated, unitMode, tokens, onHistoryUpdate, getActiveInput]);

  // === BULLETPROOF VOICE QUEUE ===
  const voiceCommandQueue = useRef<string[]>([]);
  const voiceActions = useRef({
      handleNumber, handleOperator, handleUnit, handleEquals, handleClear, toggleTriangleMode, handleTriangleButton, handleFractionSelect
  });

  // Keep functions perfectly fresh without triggering infinite loops
  useEffect(() => {
      voiceActions.current = { handleNumber, handleOperator, handleUnit, handleEquals, handleClear, toggleTriangleMode, handleTriangleButton, handleFractionSelect };
  });

  // The Background Typist
  useEffect(() => {
      const interval = setInterval(() => {
          if (voiceCommandQueue.current.length > 0) {
              const word = voiceCommandQueue.current.shift()?.replace(/\.$/, '').toLowerCase();
              if (!word) return;

              const actions = voiceActions.current;

              if (word.match(/^[0-9.]+$/)) {
                  for (const char of word) actions.handleNumber(char);
              }
              else if (word === 'one') actions.handleNumber('1');
              else if (word === 'two' || word === 'to' || word === 'too') actions.handleNumber('2');
              else if (word === 'three') actions.handleNumber('3');
              else if (word === 'four' || word === 'for') actions.handleNumber('4');
              else if (word === 'five') actions.handleNumber('5');
              else if (word === 'six') actions.handleNumber('6');
              else if (word === 'seven') actions.handleNumber('7');
              else if (word === 'eight' || word === 'ate') actions.handleNumber('8');
              else if (word === 'nine') actions.handleNumber('9');
              else if (word === 'zero') actions.handleNumber('0');
              else if (word === 'add' || word === '+') actions.handleOperator('+');
              else if (word === 'subtract' || word === '-') actions.handleOperator('-');
              else if (word === 'multiply' || word === 'x' || word === '*') actions.handleOperator('*');
              else if (word === 'divide' || word === '/') actions.handleOperator('/');
              else if (word === 'equals' || word === 'equal' || word === '=') actions.handleEquals();
              else if (word === 'clear') actions.handleClear();
              else if (word === 'feet' || word === 'foot' || word === 'ft') actions.handleUnit('ft');
              else if (word === 'inch' || word === 'inches' || word === 'in') actions.handleUnit('in');
              else if (word === 'meter' || word === 'meters' || word === 'm') actions.handleUnit('m');
              else if (word === 'centimeter' || word === 'centimeters' || word === 'cm') actions.handleUnit('cm');
              else if (word === 'millimeter' || word === 'millimeters' || word === 'mm') actions.handleUnit('mm');
              else if (word === 'rise') actions.handleTriangleButton('rise');
              else if (word === 'run') actions.handleTriangleButton('run');
              else if (word === 'diag') actions.toggleTriangleMode();
              else if (word.startsWith('fr_')) actions.handleFractionSelect(word.replace('fr_', ''));
          }
      }, 150); // Exact 150ms delay guarantees it only types once
      return () => clearInterval(interval);
  }, []);

  const queueVoiceCommand = useCallback((transcript: string) => {
    let t = transcript.toLowerCase();
    t = t.replace(/[,!?]/g, '');

    // FIX 1: Strip accidental STT breaths/hesitations at the start of a command
    // (If Google hears a breath as "0", "oh", or "zero" before an operator, delete it!)
    t = t.replace(/^(0|zero|oh)\s+(plus|minus|subtract|take away|negative|\+|-|\*|\/)/i, ' $2 ');

    // FIX 2: Fix Google's infamous fraction deafness (it frequently mishears 16ths as 15ths)
    t = t.replace(/11\/15/g, '11/16');
    t = t.replace(/13\/15/g, '13/16');
    t = t.replace(/15\/15/g, '15/16');
    t = t.replace(/5\/15/g, '5/16');
    t = t.replace(/7\/15/g, '7/16');
    t = t.replace(/9\/15/g, '9/16');

    // FIX 3: Remove the word "and" (so "9 and 5/8" seamlessly becomes "9 5/8")
    t = t.replace(/\band\b/g, ' ');
    
    // Force a space between numbers and letters (fixes "5ft" vs "5 ft")
    t = t.replace(/([0-9.]+)([a-z]+)/g, '$1 $2');
    
    // Catch literal fractions generated by Google STT (like "5/8" or "3/16")
    t = t.replace(/(\d+)\/(\d+)/g, ' fr_$1/$2 ');
    
    t = t.replace(/one half/g, ' fr_1/2 ');
    t = t.replace(/a half/g, ' fr_1/2 ');
    t = t.replace(/one quarter/g, ' fr_1/4 ');
    t = t.replace(/a quarter/g, ' fr_1/4 ');
    t = t.replace(/three quarters/g, ' fr_3/4 ');
    t = t.replace(/one eighth/g, ' fr_1/8 ');
    t = t.replace(/three eighths/g, ' fr_3/8 ');
    t = t.replace(/five eighths/g, ' fr_5/8 ');
    t = t.replace(/seven eighths/g, ' fr_7/8 ');

    // Catch more operator variants just in case
    t = t.replace(/\bsubtract\b/g, ' - ');
    t = t.replace(/\btake away\b/g, ' - ');
    t = t.replace(/\bnegative\b/g, ' - ');

    t = t.replace(/set rise/g, ' rise ');
    t = t.replace(/set run/g, ' run ');
    t = t.replace(/calculate diagonal/g, ' diag ');
    t = t.replace(/clear board/g, ' clear ');
    t = t.replace(/calculate/g, ' equals ');
    t = t.replace(/divided by/g, ' / ');
    t = t.replace(/plus/g, ' + ');
    t = t.replace(/minus/g, ' - ');
    t = t.replace(/times/g, ' * ');

    const tokens = t.split(/\s+/).filter(w => w.length > 0);
    
    // Push directly to the silent background queue
    voiceCommandQueue.current.push(...tokens);
  }, []);

  const toggleListening = useCallback(async () => {
    // 1. Clean Turn Off
    if (isListening) {
        setIsListening(false);
        setLiveTranscript("");
        if (voiceTimeoutRef.current) clearTimeout(voiceTimeoutRef.current);
        try { await SpeechRecognition.stop(); } catch(e) {}
        return;
    }

    try {
        await SpeechRecognition.requestPermissions();
        
        setIsListening(true);
        setLiveTranscript("Listening... Try saying '5 ft plus 2 in'");

        SpeechRecognition.removeAllListeners();
        
        // 2. The Smart Silence Detector
        SpeechRecognition.addListener('partialResults', (data: any) => {
            if (data.matches && data.matches.length > 0) {
                const text = data.matches[0];
                setLiveTranscript(text);
                
                if (voiceTimeoutRef.current) clearTimeout(voiceTimeoutRef.current);
                
                // INSTANT TRIGGER: If they explicitly say "equals", calculate instantly!
                if (text.toLowerCase().includes('equals') || text.includes('=')) {
                    setIsListening(false); 
                    queueVoiceCommand(text); 
                    try { SpeechRecognition.stop(); } catch(e) {}
                    setTimeout(() => setLiveTranscript(""), 2500);
                    return; 
                }

                // AUTO-EQUAL TRIGGER: Matches Android's native 3-second hardware shutoff.
                // If you pause for 3 seconds, we forcefully add "equals" for you!
                voiceTimeoutRef.current = setTimeout(async () => {
                    setIsListening(false); 
                    queueVoiceCommand(text + " equals"); // <--- THE MAGIC FIX
                    try { await SpeechRecognition.stop(); } catch(e) {}
                    
                    setTimeout(() => setLiveTranscript(""), 2500);
                }, 3000); 
            }
        });

        await SpeechRecognition.start({
            language: "en-US",
            maxResults: 1,
            partialResults: true,
            popup: false,
        });

        // 3. Failsafe: Closes automatically if you tap the mic but don't speak for 10 seconds
        if (voiceTimeoutRef.current) clearTimeout(voiceTimeoutRef.current);
        voiceTimeoutRef.current = setTimeout(async () => {
            setIsListening(false);
            setLiveTranscript("");
            try { await SpeechRecognition.stop(); } catch(e) {}
        }, 10000); 

    } catch (e: any) {
        setIsListening(false);
        if (e.message && !e.message.includes("cancelled")) {
            setLiveTranscript(`Err: ${e.message}`);
            setTimeout(() => setLiveTranscript(""), 3000);
        } else {
            setLiveTranscript("");
        }
    }
  }, [isListening, queueVoiceCommand]);

  let primaryText = "";
  let secondaryText = "";

  if (justCalculated && resultValue !== null) {
      const f = formatValue(resultValue, resultDim, unitMode, precision);
      primaryText = f.primary;
      secondaryText = f.secondary;
  } else {
      const ev = evaluateTokens(tokens, unitMode);
      primaryText = ev.str;
      const active = getActiveInput();
      if (active.valid && !error) {
          const f = formatValue(active.val, active.dim, unitMode, precision);
          secondaryText = f.secondary;
      }
  }

  const baseBtn = "rounded-lg shadow-sm font-bold text-lg sm:text-xl transition-all active:translate-y-1 active:border-b-0 flex items-center justify-center select-none h-12 outline-none focus:ring-2 focus:ring-offset-1 dark:focus:ring-offset-[#121417] tracking-wide border-b-4 duration-75";
  const variants = {
      num: theme === 'dark' 
        ? "bg-slate-800 border-slate-900 text-white hover:bg-slate-700" 
        : "bg-white border-gray-300 text-black hover:bg-gray-50 shadow-sm",
      op: theme === 'dark' 
        ? "bg-slate-700 border-slate-900 text-white hover:bg-slate-600" 
        : "bg-gray-100 border-gray-300 text-slate-900 hover:bg-gray-200",
      sci: theme === 'dark' 
        ? "bg-slate-800 border-slate-950 text-gray-400 hover:bg-slate-700" 
        : "bg-gray-200 border-gray-300 text-slate-900 hover:bg-gray-300",
      unit: theme === 'dark' 
        ? "bg-slate-800 border-slate-950 text-gray-400 hover:bg-slate-700" 
        : "bg-gray-200 border-gray-300 text-slate-700 hover:bg-gray-300",
      danger: "bg-red-600 border-red-800 text-white hover:bg-red-500",
      warning: theme === 'dark' 
        ? "bg-gray-700 border-gray-900 text-white hover:bg-gray-600" 
        : "bg-gray-200 border-gray-300 text-slate-700 hover:bg-gray-300",
      accent: theme === 'dark' 
        ? "border-black/40 text-black hover:brightness-110" 
        : "border-black/30 text-black hover:brightness-110"
  };

  const isImp = unitMode === 'imp';

  let lcdContent;
  if (triangleMode) {
    const activeInput = getActiveInput();
    const currentRise = activeAxis === 'rise' ? activeInput : triangleState.rise;
    const currentRun = activeAxis === 'run' ? activeInput : triangleState.run;
    const diagVal = Math.sqrt(Math.pow(currentRise.val, 2) + Math.pow(currentRun.val, 2));
    const diagDim = Math.max(currentRise.dim, currentRun.dim);

    lcdContent = (
      <div className="flex flex-col h-full justify-center items-end relative z-10 font-mono">
        <div 
          onClick={() => handleTriangleButton('rise')}
          className={`cursor-pointer transition-colors text-right text-base sm:text-lg font-bold truncate w-full ${activeAxis !== 'rise' ? 'text-slate-300 dark:text-gray-400' : ''}`} style={activeAxis === 'rise' ? { color: accentColor, filter: `drop-shadow(0 0 8px ${accentColor})` } : {}}
        >
          RISE = {renderFractionString(formatValue(currentRise.val, currentRise.dim, unitMode, precision).primary) || "0"}
        </div>
        <div 
          onClick={() => handleTriangleButton('run')}
          className={`cursor-pointer transition-colors text-right text-base sm:text-lg font-bold truncate w-full ${activeAxis !== 'run' ? 'text-slate-300 dark:text-gray-400' : ''}`} style={activeAxis === 'run' ? { color: accentColor, filter: `drop-shadow(0 0 8px ${accentColor})` } : {}}
        >
          RUN = {renderFractionString(formatValue(currentRun.val, currentRun.dim, unitMode, precision).primary) || "0"}
        </div>
        <div className="flex flex-col items-end mt-1 w-full">
          <div className="text-right text-xl sm:text-3xl font-bold text-white truncate leading-none w-full" style={{ color: accentColor, textShadow: `0 0 10px ${accentColor}` }}>
            DIAG = {renderFractionString(formatValue(diagVal, diagDim, unitMode, precision).primary) || "0"}
          </div>
          {formatValue(diagVal, diagDim, unitMode, precision).secondary && (
            <div className="[text-shadow:0px_1px_0px_rgba(255,255,255,0.7)] dark:[text-shadow:0px_1.5px_2px_rgba(0,0,0,0.8)] text-right text-sm sm:text-base font-medium truncate mt-1 w-full" style={{ color: accentColor }}>
              {formatValue(diagVal, diagDim, unitMode, precision).secondary}
            </div>
          )}
        </div>
      </div>
    );
  } else {
    lcdContent = (
      <div className="flex flex-col h-full justify-between relative z-10 font-mono">
        <div 
            className="text-right text-xs sm:text-sm text-slate-400 dark:text-gray-400 tracking-wider truncate h-5"
            aria-label="History Tape"
        >
            {renderFractionString(historyTape)}
        </div>
        <div 
            className={`text-right text-4xl sm:text-5xl font-bold truncate tracking-tight ${error ? 'text-red-400 dark:text-red-500' : 'text-white'}`} style={error ? {} : { color: accentColor, textShadow: `0 0 10px ${accentColor}` }}
            aria-label="Primary Display"
            aria-live="polite"
        >
            {error ? `Error: ${error}` : (primaryText ? renderFractionString(primaryText) : "0")}
        </div>
        <div 
            className="[text-shadow:0px_1px_0px_rgba(255,255,255,0.7)] dark:[text-shadow:0px_1.5px_2px_rgba(0,0,0,0.8)] text-right text-sm truncate h-5" style={{ color: accentColor }}
            aria-label="Secondary Display"
        >
            {!error && renderFractionString(secondaryText)}
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full max-w-md mx-auto ${theme === 'dark' ? 'dark' : ''} relative`}>     
			<div className="bg-gray-100 dark:bg-transparent rounded-2xl dark:rounded-none shadow-2xl dark:shadow-none overflow-hidden border border-gray-200 dark:border-none flex flex-col dark:gap-6">        
        {/* 3-Second Mic Warning Pop-up */}
        {isListening && (
            <div className="mx-4 mt-4 z-[100] px-3 py-2.5 rounded-xl shadow-sm flex items-center gap-2.5 animate-in fade-in slide-in-from-top-2 duration-300 border border-amber-500/50 bg-amber-50 dark:bg-amber-950/90 text-amber-900 dark:text-amber-200">
              <Info className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400" />
              <p className="text-xs font-bold leading-tight">
                System notice: The mic stays open as long as the hardware allows. 
                <span className="block mt-1 text-amber-700 dark:text-amber-300">
                  💡 Tip: Math will auto-calculate when you stop speaking!
                </span>
              </p>
            </div>
        )}

        {/* Screen */}
        <div className={`p-4 sm:p-6 bg-gray-100 dark:bg-transparent dark:p-0 border-b border-gray-200 dark:border-none ${isListening ? 'pt-2' : ''}`}>
            <div className="rounded-lg dark:rounded-xl shadow-lg" style={{ padding: '2px', background: `linear-gradient(to right, ${accentColor}, ${secondaryColor})` }}>
                <div 
                    className="flex flex-col bg-slate-800 dark:bg-black rounded-lg dark:rounded-xl p-3 sm:p-6 shadow-[inset_0_4px_20px_rgba(0,0,0,0.5),inset_0_0_60px_rgba(0,0,0,0.8)] h-32 sm:h-40 relative overflow-hidden"
                    style={{ backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.07) 1px, transparent 1px)', backgroundSize: '12px 12px' }}
                >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.8)_100%)] pointer-events-none z-0"></div>
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/30 via-white/5 to-transparent pointer-events-none opacity-80 z-0"></div>
                    {lcdContent}
                </div>
            </div>
        </div>
        
				{/* Live Voice Transcription Text */}
        {liveTranscript && (
          <div className="w-full text-center px-4 py-2 mb-2">
            <span className="text-sm font-semibold text-amber-500 italic dark:text-amber-400 bg-slate-800/10 dark:bg-slate-800 p-2 rounded-lg">
              "{liveTranscript}"
            </span>
          </div>
        )}
				
        {/* Controls */}
        <div className="flex flex-col gap-1.5 mb-3 px-4 sm:px-0 relative z-20 mt-2">
           {/* Row 1: Save, Presets, History */}
           <div className="flex w-full gap-1.5">
              <button 
                onClick={handleSaveToList}
                className="relative flex-1 flex items-center justify-center gap-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all active:translate-y-px px-2 py-1.5 rounded-md text-white hover:brightness-110 shadow-md" style={{ background: `linear-gradient(135deg, ${accentColor}, ${secondaryColor})` }}
                title="Save to List"
              >
                <Save className="w-3 h-3" />
                SAVE
              </button>

              <button
                onClick={() => { hapticFeedback(); setIsPresetsOpen(true); }}
                className="flex-1 flex items-center justify-center gap-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all active:translate-y-px px-2 py-1.5 rounded-md border border-gray-400 dark:border-gray-600 bg-transparent hover:bg-gray-200 dark:hover:bg-gray-800 text-slate-700 dark:text-gray-300"
                title="Formula Presets"
              >
                <BookOpen className="w-3 h-3" style={{ color: accentColor }} />
                PRESETS
              </button>

              <button
                onClick={() => { hapticFeedback(); setIsHistoryOpen(true); }}
                className="flex-1 flex items-center justify-center gap-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all active:translate-y-px px-2 py-1.5 rounded-md border border-gray-400 dark:border-gray-600 bg-transparent hover:bg-gray-200 dark:hover:bg-gray-800 text-slate-700 dark:text-gray-300"
                title="Calculation History"
              >
                <Clock className="w-3 h-3" style={{ color: accentColor }} />
                HIST
              </button>
           </div>

           {/* Row 2: Voice, Adv, Help, Voice Guide */}
           <div className="flex w-full gap-1.5">
               <button 
                 onClick={(e) => { hapticFeedback(); toggleListening(); }} 
                 className={`relative flex-[2] flex items-center justify-center gap-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all active:translate-y-px px-2 py-1.5 rounded-md border bg-transparent ${isListening ? 'bg-red-500/20 animate-pulse border-red-500 text-red-600 dark:text-red-400' : 'border-gray-400 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-800 text-slate-700 dark:text-gray-300'}`}
                 title="Voice Input"
               >
                 <div className="absolute -top-1.5 -right-1.5 bg-amber-500 text-black text-[8px] font-black px-1 py-0.5 rounded-sm shadow-sm z-10">BETA</div>
                 {isListening ? <Mic className="w-3 h-3" /> : <MicOff className="w-3 h-3" />}
                 VOICE
               </button>

               <button 
                 onClick={() => { hapticFeedback(); setIsAdvanced(!isAdvanced); }} 
                 className="flex-1 flex items-center justify-center gap-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all active:translate-y-px px-2 py-1.5 rounded-md border border-gray-400 dark:border-gray-600 bg-transparent hover:bg-gray-200 dark:hover:bg-gray-800 text-slate-700 dark:text-gray-300"
               >
                 <Settings2 className="w-3 h-3" />
                 {isAdvanced ? 'BSC' : 'ADV'}
               </button>

               <button 
                 onClick={() => { hapticFeedback(); setIsHelpModalOpen(true); }}
                 className="flex flex-1 items-center justify-center gap-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all active:translate-y-px px-2 py-1.5 rounded-md border border-gray-400 dark:border-gray-600 bg-transparent hover:bg-gray-200 dark:hover:bg-gray-800 text-slate-700 dark:text-gray-300"
                 title="Calculator Functions Guide"
               >
                 <HelpCircle className="w-3 h-3" />
                 HELP
               </button>

               <button 
                 onClick={() => { hapticFeedback(); setIsVoiceModalOpen(true); }}
                 className="flex items-center justify-center p-1.5 rounded-md border border-gray-400 dark:border-gray-600 bg-transparent hover:bg-gray-200 dark:hover:bg-gray-800 text-slate-700 dark:text-gray-300 transition-all active:translate-y-px"
                 title="Voice Commands Guide"
               >
                 <Info className="w-4 h-4" style={{ color: accentColor }} />
               </button>
           </div>

           
           {/* Row 3: Precision Toggles & Unit Toggles */}
           <div className="flex w-full items-center justify-between gap-2">
               {/* Precision Toggle */}
               {isImp ? (
                 <div className={`flex-1 flex items-center p-0.5 rounded-lg border ${theme === 'dark' ? 'bg-[#23272F] border-[#2D333D]' : 'bg-gray-200 border-gray-300'}`}>
                   <button 
                     onClick={() => { hapticFeedback(); setPrecision(8); }}
                     className={`flex-1 text-center py-1 text-[10px] font-bold uppercase tracking-widest rounded-md transition-all ${precision !== 8 ? 'text-slate-500 dark:text-[#888] hover:text-slate-700 dark:hover:text-gray-400' : ''}`} style={precision === 8 ? { color: secondaryColor, backgroundColor: `${secondaryColor}20` } : {}}
                   >1/8</button>
                   <button 
                     onClick={() => { hapticFeedback(); setPrecision(16); }}
                     className={`flex-1 text-center py-1 text-[10px] font-bold uppercase tracking-widest rounded-md transition-all ${precision !== 16 ? 'text-slate-500 dark:text-[#888] hover:text-slate-700 dark:hover:text-gray-400' : ''}`} style={precision === 16 ? { color: secondaryColor, backgroundColor: `${secondaryColor}20` } : {}}
                   >1/16</button>
                   <button 
                     onClick={() => { hapticFeedback(); setPrecision(32); }}
                     className={`flex-1 text-center py-1 text-[10px] font-bold uppercase tracking-widest rounded-md transition-all ${precision !== 32 ? 'text-slate-500 dark:text-[#888] hover:text-slate-700 dark:hover:text-gray-400' : ''}`} style={precision === 32 ? { color: secondaryColor, backgroundColor: `${secondaryColor}20` } : {}}
                   >1/32</button>
                 </div>
               ) : (
                 <div className="flex-1"></div>
               )}
               {/* Default Unit Toggle */}
               <div className={`flex-1 flex items-center p-0.5 rounded-lg border ${theme === 'dark' ? 'bg-[#23272F] border-[#2D333D]' : 'bg-gray-200 border-gray-300'}`}>
                 {isImp ? (
                   <>
                     <button 
                       onClick={() => { hapticFeedback(); setDefaultUnit('in'); }}
                       className={`flex-1 text-center py-1 text-[10px] font-bold uppercase tracking-widest rounded-md transition-all ${defaultUnit !== 'in' ? 'text-slate-500 dark:text-[#888] hover:text-slate-700 dark:hover:text-gray-400' : ''}`} style={defaultUnit === 'in' ? { color: accentColor, backgroundColor: `${accentColor}20` } : {}}
                     >INCH</button>
                     <button 
                       onClick={() => { hapticFeedback(); setDefaultUnit('ft'); }}
                       className={`flex-1 text-center py-1 text-[10px] font-bold uppercase tracking-widest rounded-md transition-all ${defaultUnit !== 'ft' ? 'text-slate-500 dark:text-[#888] hover:text-slate-700 dark:hover:text-gray-400' : ''}`} style={defaultUnit === 'ft' ? { color: accentColor, backgroundColor: `${accentColor}20` } : {}}
                     >FEET</button>
                   </>
                 ) : (
                   <>
                     <button 
                       onClick={() => { hapticFeedback(); setDefaultUnit('mm'); }}
                       className={`flex-1 text-center py-1 text-[10px] font-bold uppercase tracking-widest rounded-md transition-all ${defaultUnit !== 'mm' ? 'text-slate-500 dark:text-[#888] hover:text-slate-700 dark:hover:text-gray-400' : ''}`} style={defaultUnit === 'mm' ? { color: accentColor, backgroundColor: `${accentColor}20` } : {}}
                     >mm</button>
                     <button 
                       onClick={() => { hapticFeedback(); setDefaultUnit('cm'); }}
                       className={`flex-1 text-center py-1 text-[10px] font-bold uppercase tracking-widest rounded-md transition-all ${defaultUnit !== 'cm' ? 'text-slate-500 dark:text-[#888] hover:text-slate-700 dark:hover:text-gray-400' : ''}`} style={defaultUnit === 'cm' ? { color: accentColor, backgroundColor: `${accentColor}20` } : {}}
                     >cm</button>
                     <button 
                       onClick={() => { hapticFeedback(); setDefaultUnit('m'); }}
                       className={`flex-1 text-center py-1 text-[10px] font-bold uppercase tracking-widest rounded-md transition-all ${defaultUnit !== 'm' ? 'text-slate-500 dark:text-[#888] hover:text-slate-700 dark:hover:text-gray-400' : ''}`} style={defaultUnit === 'm' ? { color: accentColor, backgroundColor: `${accentColor}20` } : {}}
                     >m</button>
                   </>
                 )}
               </div>
           </div>
        </div>

        {/* Voice Modal */}
        <VoiceCommandModal 
          isOpen={isVoiceModalOpen} 
          onClose={() => setIsVoiceModalOpen(false)} 
          theme={theme}
        />

        {/* Help Modal */}
        <CalculatorHelpModal 
          isOpen={isHelpModalOpen} 
          onClose={() => setIsHelpModalOpen(false)} 
          theme={theme}
        />

        {/* Keypad */}
        <div className="p-4 sm:p-5 bg-gray-100 dark:bg-transparent dark:p-0 relative">
            <FractionBoard 
              isOpen={isFractionModalOpen}
              onClose={() => setIsFractionModalOpen(false)}
              onSelect={handleFractionSelect}
              theme={theme}
            />
            <div className="grid grid-cols-5 gap-1 sm:gap-1.5">
                {/* Row 1 */}
                {isAdvanced && (
                  <>
                    <button className={`${baseBtn} ${variants.sci} text-xs`} onClick={() => handleSci('sq')} aria-label="Square">x²</button>
                    <button className={`${baseBtn} ${variants.sci} text-xs`} onClick={() => handleSci('sqrt')} aria-label="Square Root">√x</button>
                    <button className={`${baseBtn} ${variants.sci} text-xs`} onClick={() => handleSci('sin')} aria-label="Sine">SIN</button>
                    <button className={`${baseBtn} ${variants.sci} text-xs`} onClick={() => handleSci('cos')} aria-label="Cosine">COS</button>
                    <button className={`${baseBtn} ${variants.sci} text-xs`} onClick={() => handleSci('tan')} aria-label="Tangent">TAN</button>
                  </>
                )}

                {/* Triangle Row */}
                <button className={`${baseBtn} ${triangleMode && activeAxis === 'rise' ? variants.accent : variants.sci} text-xs col-span-2 font-black tracking-wider`} style={{ color: triangleMode && activeAxis === 'rise' ? '#fff' : secondaryColor, ...(triangleMode && activeAxis === 'rise' ? { backgroundColor: accentColor } : {}) }} onClick={() => handleTriangleButton('rise')}>RISE</button>
                <button className={`${baseBtn} ${triangleMode && activeAxis === 'run' ? variants.accent : variants.sci} text-xs col-span-2 font-black tracking-wider`} style={{ color: triangleMode && activeAxis === 'run' ? '#fff' : secondaryColor, ...(triangleMode && activeAxis === 'run' ? { backgroundColor: accentColor } : {}) }} onClick={() => handleTriangleButton('run')}>RUN</button>
                <button className={`${baseBtn} ${triangleMode ? variants.danger : variants.sci} text-xs font-black tracking-wider`} style={triangleMode ? {} : { color: secondaryColor }} onClick={toggleTriangleMode}>{triangleMode ? 'EXIT' : 'TRI'}</button>

                {/* Row 2 */}
                <button className={`${baseBtn} ${variants.unit} text-xs uppercase`} onClick={() => handleUnit(isImp ? 'ft' : 'm')} aria-label={isImp ? 'Feet' : 'Meters'}>{isImp ? 'Feet' : 'm'}</button>
                <button className={`${baseBtn} ${variants.unit} text-xs uppercase`} onClick={() => handleUnit(isImp ? 'in' : 'cm')} aria-label={isImp ? 'Inches' : 'Centimeters'}>{isImp ? 'Inch' : 'cm'}</button>
                <button className={`${baseBtn} ${variants.unit} text-xs uppercase font-bold`} onClick={() => isImp ? setIsFractionModalOpen(true) : handleUnit('mm')} aria-label={isImp ? 'Fraction' : 'Millimeters'}>{isImp ? 'FRAC' : 'mm'}</button>
                <button className={`${baseBtn} ${variants.danger} text-xs uppercase`} onClick={handleClear} aria-label="Clear">CLEAR</button>
                <button className={`${baseBtn} ${variants.warning} text-xs uppercase`} onClick={handleBackspace} aria-label="Backspace">DEL</button>

                {/* Row 3 */}
                <button className={`${baseBtn} ${variants.num}`} onClick={() => handleNumber('7')}>7</button>
                <button className={`${baseBtn} ${variants.num}`} onClick={() => handleNumber('8')}>8</button>
                <button className={`${baseBtn} ${variants.num}`} onClick={() => handleNumber('9')}>9</button>
                <button className={`${baseBtn} ${variants.op}`} onClick={() => handleOperator('/')} aria-label="Divide">÷</button>
                <button className={`${baseBtn} ${variants.op}`} onClick={() => handleOperator('*')} aria-label="Multiply">×</button>

                {/* Row 4 */}
                <button className={`${baseBtn} ${variants.num}`} onClick={() => handleNumber('4')}>4</button>
                <button className={`${baseBtn} ${variants.num}`} onClick={() => handleNumber('5')}>5</button>
                <button className={`${baseBtn} ${variants.num}`} onClick={() => handleNumber('6')}>6</button>
                <button className={`${baseBtn} ${variants.op}`} onClick={() => handleOperator('-')} aria-label="Subtract">-</button>
                <button className={`${baseBtn} ${variants.op}`} onClick={() => handleOperator('+')} aria-label="Add">+</button>

                {/* Row 5 & 6 Integrated */}
                <button className={`${baseBtn} ${variants.num}`} onClick={() => handleNumber('1')}>1</button>
                <button className={`${baseBtn} ${variants.num}`} onClick={() => handleNumber('2')}>2</button>
                <button className={`${baseBtn} ${variants.num}`} onClick={() => handleNumber('3')}>3</button>
                <button className={`${baseBtn} ${variants.num}`} onClick={() => handleNumber('.')}>.</button>
                <button className={`${baseBtn} ${variants.accent} row-span-2 h-full !text-white shadow-md`} style={{ background: `linear-gradient(135deg, ${accentColor}, ${secondaryColor})` }} onClick={handleEquals} aria-label="Equals">=</button>

                <button className={`${baseBtn} ${variants.num} col-span-2`} onClick={() => handleNumber('0')}>0</button>
                <button className={`${baseBtn} ${variants.num}`} onClick={handleToggleSign} aria-label="Toggle Sign">+/-</button>
                <button className={`${baseBtn} ${variants.num}`} onClick={() => handleNumber('3.14159')} aria-label="Pi">π</button>
            </div>
        </div>

        {/* Formula Presets Drawer */}
        <PresetsMenu 
          isOpen={isPresetsOpen} 
          onClose={() => setIsPresetsOpen(false)} 
          unitMode={unitMode}
          onSwitchTool={onSwitchTool}
          accentColor={accentColor}
          onInject={(val, dim, tapeStr) => {
            setResultValue(val);
            setResultDim(dim);
            setTokens([]);
            setAccumulator(null);
            setOperator(null);
            setJustCalculated(true);
            setHistoryTape(tapeStr);
            addHistoryItem(`${tapeStr} = ${formatValue(val, dim, unitMode, precision).primary}`, val, dim, tapeStr);
          }}
        />

        {/* History Tape Drawer */}
        <HistoryTape 
          isOpen={isHistoryOpen} 
          onClose={() => setIsHistoryOpen(false)} 
          history={localHistoryList}
          onClear={() => setLocalHistoryList([])}
          onSelect={(eq) => {
            const matched = localHistoryList.find(item => item.equation === eq);
            if (matched) {
              handleLoadHistory(matched);
            }
          }}
        />
        
        {/* Saved List UI */}
        {savedList.length > 0 && (
           <div className={`m-4 p-4 rounded-xl border ${theme === 'dark' ? 'bg-black/40 border-[#333]' : 'bg-white/60 border-gray-300'}`}>
              <h3 className={`text-xs font-bold uppercase tracking-wider mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>Saved Cut List</h3>
              <div className="space-y-2 mb-4 max-h-60 overflow-y-auto pr-1">
                 {savedList.map(item => (
                    <div key={item.id} className={`flex items-center justify-between p-2 rounded-lg border ${theme === 'dark' ? 'bg-[#111] border-[#222]' : 'bg-white border-gray-200'} shadow-sm`}>
                       <span className={`font-mono text-sm break-words whitespace-pre-wrap flex-1 mr-2 ${theme === 'dark' ? 'text-gray-200' : 'text-slate-700'}`}>{item.data}</span>
                       <button onClick={() => setSavedList(prev => prev.filter(i => i.id !== item.id))} className={`p-1.5 flex-shrink-0 rounded-md hover:bg-red-500/10 hover:text-red-500 transition-colors ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                          <X className="w-4 h-4" />
                       </button>
                    </div>
                 ))}
              </div>
              <div className="flex gap-2 mt-4">
                 <button onClick={() => { hapticFeedback(); setSavedList([]); }} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border transition-colors ${theme === 'dark' ? 'border-[#333] hover:bg-[#222] text-gray-400' : 'border-gray-300 hover:bg-gray-100 text-slate-500'}`}>
                    CLEAR LIST
                 </button>
                 <button onClick={handleShareList} className={`flex-[2] flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border border-transparent transition-colors hover:brightness-110`} style={{ color: accentColor, backgroundColor: `${accentColor}20` }}>
                    <Share className="w-4 h-4" />
                    SHARE
                 </button>
              </div>
           </div>
        )}
      </div>
    </div>
  );
});

export default ScientificCalc;
