import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Mic, MicOff, Settings2, Info, HelpCircle, Save, X, Share, BookOpen, Clock, RotateCcw, RotateCw } from 'lucide-react';
import VoiceCommandModal from './VoiceCommandModal';
import { SpeechRecognition } from '@capacitor-community/speech-recognition';
import CalculatorHelpModal from './CalculatorHelpModal';
import FractionBoard from './FractionBoard';
import PresetsMenu from './PresetsMenu';
import HistoryTape, { HistoryItem } from './HistoryTape';

type Token = { type: 'num' | 'unit'; val: string };
type SavedItem = {
  id: string;
  timestamp: number;
  type: 'standard' | 'triangle';
  data: string;
};

interface CarpentrySolverState {
  pitch: number | null; // X in X/12
  rise: number | null;  // inches (or mm in met mode)
  run: number | null;   // inches (or mm in met mode)
  diag: number | null;  // inches (or mm in met mode)
  plumbAngle: number | null;
  levelAngle: number | null;
  showDiagSubBar: boolean;
}

const QUICK_FRACTIONS = ['1/16', '1/8', '1/4', '3/8', '1/2', '5/8', '3/4', '7/8'];

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
  onHistoryUpdate?: (historyItem: { id: string; equation: string; timestamp: number }) => void;
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

function fmtTotalInches(inches: number, precision: number = 16): string {
  const isNeg = inches < 0;
  const absIn = Math.abs(inches);
  let wholeInches = Math.floor(absIn);
  const fracPart = absIn - wholeInches;
  let fracPrecision = Math.round(fracPart * precision);

  if (fracPrecision >= precision) {
    wholeInches += 1;
    fracPrecision = 0;
  }

  let fracStr = '';
  if (fracPrecision > 0) {
    const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
    const divisor = gcd(fracPrecision, precision);
    fracStr = `${fracPrecision / divisor}/${precision / divisor}`;
  }

  const sign = isNeg ? '-' : '';
  if (fracStr) {
    return `${sign}${wholeInches === 0 ? '' : wholeInches + '-'}${fracStr}`;
  }
  return `${sign}${wholeInches}`;
}

function formatImperialLength(inches: number, precision: number = 16) {
  const isNeg = inches < 0;
  inches = Math.abs(inches);
  const totalInches = inches;
  let feet = Math.floor(inches / 12);
  const remainInches = inches - feet * 12;

  let wholeInches = Math.floor(remainInches);
  const fracPart = remainInches - wholeInches;
  let fracPrecision = Math.round(fracPart * precision);

  if (fracPrecision >= precision) {
    wholeInches += 1;
    fracPrecision = 0;
  }
  if (wholeInches >= 12) {
    feet += 1;
    wholeInches -= 12;
  }

  let fracStr = '';
  if (fracPrecision > 0) {
    const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
    const divisor = gcd(fracPrecision, precision);
    fracStr = `${fracPrecision / divisor}/${precision / divisor}`;
  }

  let primary = '';
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
    secondary: `${sign}${secTotal}"`,
  };
}

function formatValue(
  val: number,
  dim: number,
  mode: 'imp' | 'met',
  precision: number = 16,
  displayUnitOverride?: string
) {
  if (dim === 0) {
    const p = Number.isInteger(val) ? val.toString() : val.toFixed(4).replace(/\.?0+$/, '');
    return { primary: p, secondary: '' };
  }

  if (mode === 'imp') {
    if (dim === 1) {
      if (displayUnitOverride === 'in') {
        return {
          primary: `${fmtTotalInches(val, precision)}"`,
          secondary: formatImperialLength(val, precision).primary,
        };
      }
      if (displayUnitOverride === 'mm') {
        const mmVal = Math.round(val * 25.4);
        return {
          primary: `${mmVal.toLocaleString()} mm`,
          secondary: formatImperialLength(val, precision).primary,
        };
      }
      return formatImperialLength(val, precision);
    }
    if (dim === 2) {
      const sqFt = val / 144;
      return {
        primary: `${sqFt.toFixed(4).replace(/\.?0+$/, '')} SQ FT`,
        secondary: `${val.toFixed(2).replace(/\.?0+$/, '')} SQ IN`,
      };
    }
    if (dim === 3) {
      const cuYd = val / 46656;
      const cuFt = val / 1728;
      return {
        primary: `${cuYd.toFixed(4).replace(/\.?0+$/, '')} CU YD`,
        secondary: `${cuFt.toFixed(4).replace(/\.?0+$/, '')} CU FT`,
      };
    }
  } else {
    if (dim === 1) {
      if (displayUnitOverride === 'mm') {
        return {
          primary: `${Math.round(val).toLocaleString()} mm`,
          secondary: `${(val / 1000).toFixed(3)} m`,
        };
      }
      const m = val / 1000;
      const cm = val / 10;
      return {
        primary: `${m.toFixed(4).replace(/\.?0+$/, '')} m`,
        secondary: `${cm.toFixed(2).replace(/\.?0+$/, '')} cm | ${val.toFixed(2).replace(/\.?0+$/, '')} mm`,
      };
    }
    if (dim === 2) {
      const sqM = val / 1000000;
      return {
        primary: `${sqM.toFixed(4).replace(/\.?0+$/, '')} SQ M`,
        secondary: `${val.toFixed(2).replace(/\.?0+$/, '')} SQ MM`,
      };
    }
    if (dim === 3) {
      const cuM = val / 1000000000;
      return { primary: `${cuM.toFixed(4).replace(/\.?0+$/, '')} CU M`, secondary: '' };
    }
  }
  return { primary: 'ERR', secondary: '' };
}

function evaluateTokens(tokens: Token[], unitMode: 'imp' | 'met') {
  let value: number | null = null;
  let dim = 0;
  let pending = '';
  let str = '';
  let lastUnit: string | null = null;

  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (t.type === 'num') {
      pending = t.val;
      if (lastUnit === 'in' && (t.val.includes('/') || i === tokens.length - 1)) {
        // Attach fraction after whole inches: e.g., 5' 6" + 3/4 -> 5' 6-3/4"
        if (str.endsWith('" ')) {
          str = str.slice(0, -2) + `-${t.val}" `;
          value = (value || 0) + parseFractionStr(t.val);
          pending = '';
          continue;
        }
      }
      str += t.val;
    } else if (t.type === 'unit') {
      let numVal = parseFractionStr(pending);
      if (value === null && pending === '') numVal = 0;

      if (unitMode === 'imp') {
        if (t.val === 'ft') {
          value = (value || 0) + numVal * 12;
          dim = 1;
          str += "' ";
        } else if (t.val === 'in') {
          value = (value || 0) + numVal;
          dim = 1;
          str += '" ';
        } else if (t.val === 'mm') {
          value = (value || 0) + numVal / 25.4;
          dim = 1;
          str += 'mm ';
        }
      } else {
        if (t.val === 'm') {
          value = (value || 0) + numVal * 1000;
          dim = 1;
          str += 'm ';
        } else if (t.val === 'cm') {
          value = (value || 0) + numVal * 10;
          dim = 1;
          str += 'cm ';
        } else if (t.val === 'mm') {
          value = (value || 0) + numVal;
          dim = 1;
          str += 'mm ';
        }
      }
      lastUnit = t.val;
      pending = '';
    }
  }
  return { value, dim, pending, str: str.trim() };
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

    if (calcD1 !== calcD2) throw new Error('Dimension Mismatch');
    return { val: op === '+' ? calcV1 + calcV2 : calcV1 - calcV2, dim: calcD1 };
  }
  if (op === '*') {
    const newDim = d1 + d2;
    if (newDim > 3) throw new Error('Max Dimension (3) Exceeded');
    return { val: v1 * v2, dim: newDim };
  }
  if (op === '/') {
    if (v2 === 0) throw new Error('Divide by Zero');
    const newDim = d1 - d2;
    if (newDim < 0) throw new Error('Invalid Dimension');
    return { val: v1 / v2, dim: newDim };
  }
  return { val: v2, dim: d2 };
}

export interface ScientificCalcRef {
  injectValue: (val: number, dim: number, tapeString: string) => void;
}

interface CalcSnapshot {
  display: Token[];
  equation: string;
  operator: string | null;
  waitingForOperand: boolean;
  previousValue: number | null;
  accumDim: number;
  resultValue: number | null;
  resultDim: number;
  error: string | null;
  carpentryState: CarpentrySolverState;
  customSuffix: string | null;
}

const INITIAL_CARPENTRY_STATE: CarpentrySolverState = {
  pitch: null,
  rise: null,
  run: null,
  diag: null,
  plumbAngle: null,
  levelAngle: null,
  showDiagSubBar: false,
};

const ScientificCalc = React.forwardRef<ScientificCalcRef, ScientificCalcProps>(
  ({ theme, unitMode, onHistoryUpdate, onSwitchTool, accentColor = '#06b6d4', secondaryColor = '#3b82f6' }, ref) => {
    const [accumulator, setAccumulator] = useState<number | null>(null);
    const [accumDim, setAccumDim] = useState<number>(0);
    const [operator, setOperator] = useState<string | null>(null);
    const [tokens, setTokens] = useState<Token[]>([]);
    const [resultValue, setResultValue] = useState<number | null>(null);
    const [resultDim, setResultDim] = useState<number>(0);
    const [customSuffix, setCustomSuffix] = useState<string | null>(null);
    const [historyTape, setHistoryTape] = useState<string>('');
    const [justCalculated, setJustCalculated] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [calcUndoStack, setCalcUndoStack] = useState<CalcSnapshot[]>([]);
    const [calcRedoStack, setCalcRedoStack] = useState<CalcSnapshot[]>([]);
    const [isAdvanced, setIsAdvanced] = useState<boolean>(false);
    const [isListening, setIsListening] = useState<boolean>(false);
    const [isVoiceModalOpen, setIsVoiceModalOpen] = useState<boolean>(false);
    const [liveTranscript, setLiveTranscript] = useState<string>('');
    const voiceTimeoutRef = useRef<any>(null);
    const [isHelpModalOpen, setIsHelpModalOpen] = useState<boolean>(false);
    const [isFractionModalOpen, setIsFractionModalOpen] = useState<boolean>(false);
    const [showQuickFracBar, setShowQuickFracBar] = useState<boolean>(false);
    const [savedList, setSavedList] = useState<SavedItem[]>([]);
    const [isPresetsOpen, setIsPresetsOpen] = useState<boolean>(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
    const [localHistoryList, setLocalHistoryList] = useState<HistoryItem[]>([]);

    const [carpentryState, setCarpentryState] = useState<CarpentrySolverState>(INITIAL_CARPENTRY_STATE);
    const [lastActionWasCarpentryStore, setLastActionWasCarpentryStore] = useState<boolean>(false);

    const [defaultUnit, setDefaultUnit] = useState<string>(unitMode === 'imp' ? 'ft' : 'mm');
    const [precision, setPrecision] = useState<number>(16);

    const createCalcSnapshot = useCallback(
      (): CalcSnapshot => ({
        display: tokens.map((t) => ({ ...t })),
        equation: historyTape,
        operator,
        waitingForOperand: justCalculated,
        previousValue: accumulator,
        accumDim,
        resultValue,
        resultDim,
        error,
        carpentryState: { ...carpentryState },
        customSuffix,
      }),
      [tokens, historyTape, operator, justCalculated, accumulator, accumDim, resultValue, resultDim, error, carpentryState, customSuffix]
    );

    const applyCalcSnapshot = useCallback((snap: CalcSnapshot) => {
      setTokens(snap.display.map((t) => ({ ...t })));
      setHistoryTape(snap.equation);
      setOperator(snap.operator);
      setJustCalculated(snap.waitingForOperand);
      setAccumulator(snap.previousValue);
      setAccumDim(snap.accumDim);
      setResultValue(snap.resultValue);
      setResultDim(snap.resultDim);
      setError(snap.error);
      setCarpentryState({ ...snap.carpentryState });
      setCustomSuffix(snap.customSuffix);
    }, []);

    const saveCalcState = useCallback(() => {
      const snapshot = createCalcSnapshot();
      setCalcUndoStack((prev) => [...prev, snapshot]);
      setCalcRedoStack([]);
    }, [createCalcSnapshot]);

    const handleUndo = useCallback(() => {
      if (calcUndoStack.length > 0) {
        hapticFeedback();
        const previousState = calcUndoStack[calcUndoStack.length - 1];
        const currentSnapshot = createCalcSnapshot();
        setCalcUndoStack((prev) => prev.slice(0, -1));
        setCalcRedoStack((prev) => [...prev, currentSnapshot]);
        applyCalcSnapshot(previousState);
      }
    }, [calcUndoStack, createCalcSnapshot, applyCalcSnapshot]);

    const handleRedo = useCallback(() => {
      if (calcRedoStack.length > 0) {
        hapticFeedback();
        const nextState = calcRedoStack[calcRedoStack.length - 1];
        const currentSnapshot = createCalcSnapshot();
        setCalcRedoStack((prev) => prev.slice(0, -1));
        setCalcUndoStack((prev) => [...prev, currentSnapshot]);
        applyCalcSnapshot(nextState);
      }
    }, [calcRedoStack, createCalcSnapshot, applyCalcSnapshot]);

    const addHistoryItem = useCallback(
      (eq: string, val?: number, dim?: number, tape?: string) => {
        const newItem: HistoryItem = {
          id: crypto.randomUUID(),
          equation: eq,
          timestamp: Date.now(),
          val,
          dim,
          tape,
        };
        setLocalHistoryList((prev) => [newItem, ...prev]);
        if (onHistoryUpdate) {
          onHistoryUpdate(newItem);
        }
      },
      [onHistoryUpdate]
    );

    const getUnitMult = useCallback(
      (unit: string) => {
        if (unitMode === 'imp') {
          switch (unit) {
            case 'ft':
              return 12;
            case 'in':
              return 1;
            case 'mm':
              return 1 / 25.4;
            default:
              return 1;
          }
        }
        switch (unit) {
          case 'm':
            return 1000;
          case 'cm':
            return 10;
          case 'mm':
            return 1;
          default:
            return 1;
        }
      },
      [unitMode]
    );

    const handleLoadHistory = useCallback(
      (item: HistoryItem) => {
        hapticFeedback();
        if (item.val !== undefined && item.dim !== undefined) {
          saveCalcState();
          // If an operator is currently active and waiting for the second operand, chain it!
          if (accumulator !== null && operator) {
            try {
              const res = doMath(accumulator, accumDim, item.val, item.dim, operator, getUnitMult(defaultUnit));
              const insertedStr = formatValue(item.val, item.dim, unitMode, precision).primary;
              const fullEq = `${historyTape} ${insertedStr} =`;
              setHistoryTape(fullEq);
              setResultValue(res.val);
              setResultDim(res.dim);
              setCustomSuffix(null);
              setAccumulator(null);
              setOperator(null);
              setTokens([]);
              setJustCalculated(true);
              addHistoryItem(
                `${fullEq} ${formatValue(res.val, res.dim, unitMode, precision).primary}`,
                res.val,
                res.dim,
                `${historyTape} ${insertedStr}`
              );
            } catch (err: any) {
              setError(err.message);
            }
          } else {
            setResultValue(item.val);
            setResultDim(item.dim);
            setCustomSuffix(null);
            setTokens([]);
            setAccumulator(null);
            setOperator(null);
            setJustCalculated(true);
            setLastActionWasCarpentryStore(false);
            setHistoryTape(item.tape || item.equation.split('=')[0]?.trim() || '');
          }
        } else {
          navigator.clipboard.writeText(item.equation);
        }
        setIsHistoryOpen(false);
      },
      [saveCalcState, accumulator, accumDim, operator, getUnitMult, defaultUnit, unitMode, precision, historyTape, addHistoryItem]
    );

    useEffect(() => {
      setDefaultUnit(unitMode === 'imp' ? 'ft' : 'mm');
    }, [unitMode]);

    React.useImperativeHandle(ref, () => ({
      injectValue: (val: number, dim: number, tapeString: string) => {
        saveCalcState();
        setResultValue(val);
        setResultDim(dim);
        setCustomSuffix(null);
        setTokens([]);
        setAccumulator(null);
        setOperator(null);
        setJustCalculated(true);
        setLastActionWasCarpentryStore(false);
        setHistoryTape(tapeString);

        addHistoryItem(`${tapeString} = ${formatValue(val, dim, unitMode, precision).primary}`, val, dim, tapeString);
      },
    }));

    const clearAll = useCallback(() => {
      setAccumulator(null);
      setAccumDim(0);
      setOperator(null);
      setTokens([]);
      setResultValue(null);
      setResultDim(0);
      setCustomSuffix(null);
      setHistoryTape('');
      setJustCalculated(false);
      setLastActionWasCarpentryStore(false);
      setError(null);
    }, []);

    const getActiveInput = useCallback(() => {
      if (justCalculated) {
        return { val: resultValue || 0, dim: resultDim, valid: resultValue !== null };
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

    // === 4-KEY CARPENTRY SOLVER (PITCH | RISE | RUN | DIAG) ===
    const handlePitchKey = useCallback(() => {
      hapticFeedback();
      saveCalcState();
      setError(null);
      const hasFreshTyped = tokens.length > 0 || (justCalculated && !lastActionWasCarpentryStore && resultValue !== null);
      const active = getActiveInput();

      if (hasFreshTyped && active.valid && active.val > 0) {
        // User entered a number to store as Pitch (e.g. 6 -> 6/12)
        const pitchVal = active.dim === 1 && unitMode === 'imp' && active.val >= 12 && tokens.some((t) => t.val === 'ft')
          ? active.val / 12
          : active.val;
        const plumbDeg = Math.atan(pitchVal / 12) * (180 / Math.PI);
        const levelDeg = 90 - plumbDeg;

        setCarpentryState((prev) => {
          const next = {
            ...prev,
            pitch: Math.round(pitchVal * 100) / 100,
            plumbAngle: plumbDeg,
            levelAngle: levelDeg,
            showDiagSubBar: true,
          };
          if (prev.run !== null && prev.run > 0) {
            next.rise = prev.run * (pitchVal / 12);
            next.diag = Math.sqrt(next.rise * next.rise + prev.run * prev.run);
          } else if (prev.rise !== null && prev.rise > 0) {
            next.run = prev.rise / (pitchVal / 12);
            next.diag = Math.sqrt(prev.rise * prev.rise + next.run * next.run);
          }
          return next;
        });

        setTokens([]);
        setResultValue(pitchVal);
        setResultDim(0);
        setCustomSuffix(`/12 Pitch (${plumbDeg.toFixed(1)}°)`);
        setHistoryTape(`STORED PITCH =`);
        setJustCalculated(true);
        setLastActionWasCarpentryStore(true);
      } else if (carpentryState.rise !== null && carpentryState.run !== null && carpentryState.run > 0) {
        // Solve Pitch from stored Rise and Run
        const solvedPitch = (carpentryState.rise / carpentryState.run) * 12;
        const plumbDeg = Math.atan2(carpentryState.rise, carpentryState.run) * (180 / Math.PI);
        const levelDeg = 90 - plumbDeg;
        const roundedPitch = Math.round(solvedPitch * 100) / 100;

        setCarpentryState((prev) => ({
          ...prev,
          pitch: roundedPitch,
          plumbAngle: plumbDeg,
          levelAngle: levelDeg,
          showDiagSubBar: true,
        }));

        setTokens([]);
        setResultValue(roundedPitch);
        setResultDim(0);
        setCustomSuffix(`/12 Pitch (${plumbDeg.toFixed(1)}°)`);
        const tapeStr = `PITCH (Rise ${formatValue(carpentryState.rise, 1, unitMode, precision).primary} / Run ${formatValue(carpentryState.run, 1, unitMode, precision).primary})`;
        setHistoryTape(`${tapeStr} =`);
        setJustCalculated(true);
        setLastActionWasCarpentryStore(true);
        addHistoryItem(`${tapeStr} = ${roundedPitch}/12 (${plumbDeg.toFixed(1)}°)`, roundedPitch, 0, tapeStr);
      } else if (carpentryState.pitch !== null) {
        const plumbDeg = Math.atan(carpentryState.pitch / 12) * (180 / Math.PI);
        setTokens([]);
        setResultValue(carpentryState.pitch);
        setResultDim(0);
        setCustomSuffix(`/12 Pitch (${plumbDeg.toFixed(1)}°)`);
        setHistoryTape(`RECALL PITCH =`);
        setJustCalculated(true);
        setLastActionWasCarpentryStore(true);
      }
    }, [tokens, justCalculated, lastActionWasCarpentryStore, resultValue, getActiveInput, unitMode, carpentryState, precision, saveCalcState, addHistoryItem]);

    const handleRiseKey = useCallback(() => {
      hapticFeedback();
      saveCalcState();
      setError(null);
      const hasFreshTyped = tokens.length > 0 || (justCalculated && !lastActionWasCarpentryStore && resultValue !== null);
      const active = getActiveInput();

      if (hasFreshTyped && active.valid && active.val > 0) {
        const riseLen = active.dim === 0 ? active.val * getUnitMult(defaultUnit) : active.val;
        setCarpentryState((prev) => {
          const next = { ...prev, rise: riseLen, showDiagSubBar: false };
          if (prev.run !== null && prev.run > 0) {
            next.diag = Math.sqrt(riseLen * riseLen + prev.run * prev.run);
            next.plumbAngle = Math.atan2(riseLen, prev.run) * (180 / Math.PI);
            next.levelAngle = 90 - next.plumbAngle;
            next.pitch = Math.round((riseLen / prev.run) * 12 * 100) / 100;
          }
          return next;
        });

        setTokens([]);
        setResultValue(riseLen);
        setResultDim(1);
        setCustomSuffix(null);
        setHistoryTape(`STORED RISE =`);
        setJustCalculated(true);
        setLastActionWasCarpentryStore(true);
      } else if (carpentryState.pitch !== null && carpentryState.run !== null && carpentryState.run > 0) {
        // Solve Rise = Run * (Pitch / 12)
        const solvedRise = carpentryState.run * (carpentryState.pitch / 12);
        const solvedDiag = Math.sqrt(solvedRise * solvedRise + carpentryState.run * carpentryState.run);
        const plumbDeg = Math.atan(carpentryState.pitch / 12) * (180 / Math.PI);

        setCarpentryState((prev) => ({
          ...prev,
          rise: solvedRise,
          diag: solvedDiag,
          plumbAngle: plumbDeg,
          levelAngle: 90 - plumbDeg,
          showDiagSubBar: true,
        }));

        const tapeStr = `RISE (Run ${formatValue(carpentryState.run, 1, unitMode, precision).primary} @ ${carpentryState.pitch}/12)`;
        setTokens([]);
        setResultValue(solvedRise);
        setResultDim(1);
        setCustomSuffix(null);
        setHistoryTape(`${tapeStr} =`);
        setJustCalculated(true);
        setLastActionWasCarpentryStore(true);
        addHistoryItem(`${tapeStr} = ${formatValue(solvedRise, 1, unitMode, precision).primary}`, solvedRise, 1, tapeStr);
      } else if (carpentryState.diag !== null && carpentryState.run !== null && carpentryState.diag > carpentryState.run) {
        const solvedRise = Math.sqrt(carpentryState.diag * carpentryState.diag - carpentryState.run * carpentryState.run);
        setCarpentryState((prev) => ({ ...prev, rise: solvedRise }));
        setTokens([]);
        setResultValue(solvedRise);
        setResultDim(1);
        setCustomSuffix(null);
        setHistoryTape(`SOLVED RISE =`);
        setJustCalculated(true);
        setLastActionWasCarpentryStore(true);
      } else if (carpentryState.rise !== null) {
        setTokens([]);
        setResultValue(carpentryState.rise);
        setResultDim(1);
        setCustomSuffix(null);
        setHistoryTape(`RECALL RISE =`);
        setJustCalculated(true);
        setLastActionWasCarpentryStore(true);
      }
    }, [tokens, justCalculated, lastActionWasCarpentryStore, resultValue, getActiveInput, getUnitMult, defaultUnit, carpentryState, unitMode, precision, saveCalcState, addHistoryItem]);

    const handleRunKey = useCallback(() => {
      hapticFeedback();
      saveCalcState();
      setError(null);
      const hasFreshTyped = tokens.length > 0 || (justCalculated && !lastActionWasCarpentryStore && resultValue !== null);
      const active = getActiveInput();

      if (hasFreshTyped && active.valid && active.val > 0) {
        const runLen = active.dim === 0 ? active.val * getUnitMult(defaultUnit) : active.val;
        setCarpentryState((prev) => {
          const next = { ...prev, run: runLen, showDiagSubBar: false };
          if (prev.rise !== null && prev.rise > 0) {
            next.diag = Math.sqrt(prev.rise * prev.rise + runLen * runLen);
            next.plumbAngle = Math.atan2(prev.rise, runLen) * (180 / Math.PI);
            next.levelAngle = 90 - next.plumbAngle;
            next.pitch = Math.round((prev.rise / runLen) * 12 * 100) / 100;
          }
          return next;
        });

        setTokens([]);
        setResultValue(runLen);
        setResultDim(1);
        setCustomSuffix(null);
        setHistoryTape(`STORED RUN =`);
        setJustCalculated(true);
        setLastActionWasCarpentryStore(true);
      } else if (carpentryState.pitch !== null && carpentryState.pitch > 0 && carpentryState.rise !== null && carpentryState.rise > 0) {
        // Solve Run = Rise / (Pitch / 12)
        const solvedRun = carpentryState.rise / (carpentryState.pitch / 12);
        const solvedDiag = Math.sqrt(carpentryState.rise * carpentryState.rise + solvedRun * solvedRun);
        const plumbDeg = Math.atan(carpentryState.pitch / 12) * (180 / Math.PI);

        setCarpentryState((prev) => ({
          ...prev,
          run: solvedRun,
          diag: solvedDiag,
          plumbAngle: plumbDeg,
          levelAngle: 90 - plumbDeg,
          showDiagSubBar: true,
        }));

        const tapeStr = `RUN (Rise ${formatValue(carpentryState.rise, 1, unitMode, precision).primary} @ ${carpentryState.pitch}/12)`;
        setTokens([]);
        setResultValue(solvedRun);
        setResultDim(1);
        setCustomSuffix(null);
        setHistoryTape(`${tapeStr} =`);
        setJustCalculated(true);
        setLastActionWasCarpentryStore(true);
        addHistoryItem(`${tapeStr} = ${formatValue(solvedRun, 1, unitMode, precision).primary}`, solvedRun, 1, tapeStr);
      } else if (carpentryState.diag !== null && carpentryState.rise !== null && carpentryState.diag > carpentryState.rise) {
        const solvedRun = Math.sqrt(carpentryState.diag * carpentryState.diag - carpentryState.rise * carpentryState.rise);
        setCarpentryState((prev) => ({ ...prev, run: solvedRun }));
        setTokens([]);
        setResultValue(solvedRun);
        setResultDim(1);
        setCustomSuffix(null);
        setHistoryTape(`SOLVED RUN =`);
        setJustCalculated(true);
        setLastActionWasCarpentryStore(true);
      } else if (carpentryState.run !== null) {
        setTokens([]);
        setResultValue(carpentryState.run);
        setResultDim(1);
        setCustomSuffix(null);
        setHistoryTape(`RECALL RUN =`);
        setJustCalculated(true);
        setLastActionWasCarpentryStore(true);
      }
    }, [tokens, justCalculated, lastActionWasCarpentryStore, resultValue, getActiveInput, getUnitMult, defaultUnit, carpentryState, unitMode, precision, saveCalcState, addHistoryItem]);

    const handleDiagKey = useCallback(() => {
      hapticFeedback();
      saveCalcState();
      setError(null);
      const hasFreshTyped = tokens.length > 0 || (justCalculated && !lastActionWasCarpentryStore && resultValue !== null);
      const active = getActiveInput();

      let effRise = carpentryState.rise;
      let effRun = carpentryState.run;
      let effPitch = carpentryState.pitch;

      // Ergonomic shortcut: if Rise is stored and user typed a value and hit DIAG directly, treat typed value as Run
      if (hasFreshTyped && active.valid && active.val > 0) {
        const typedLen = active.dim === 0 ? active.val * getUnitMult(defaultUnit) : active.val;
        if (effRise !== null && effRun === null) {
          effRun = typedLen;
        } else if (effRun !== null && effRise === null) {
          effRise = typedLen;
        }
      }

      if (effRise === null && effRun !== null && effPitch !== null) {
        effRise = effRun * (effPitch / 12);
      } else if (effRun === null && effRise !== null && effPitch !== null && effPitch > 0) {
        effRun = effRise / (effPitch / 12);
      }

      if (effRise !== null && effRun !== null && (effRise > 0 || effRun > 0)) {
        const diagVal = Math.sqrt(effRise * effRise + effRun * effRun);
        const plumbDeg = Math.atan2(effRise, effRun) * (180 / Math.PI);
        const levelDeg = 90 - plumbDeg;
        const computedPitch = effRun > 0 ? Math.round((effRise / effRun) * 12 * 100) / 100 : effPitch;

        setCarpentryState({
          pitch: computedPitch,
          rise: effRise,
          run: effRun,
          diag: diagVal,
          plumbAngle: plumbDeg,
          levelAngle: levelDeg,
          showDiagSubBar: true,
        });

        const riseStr = formatValue(effRise, 1, unitMode, precision).primary;
        const runStr = formatValue(effRun, 1, unitMode, precision).primary;
        const diagStr = formatValue(diagVal, 1, unitMode, precision).primary;
        const tapeStr = `DIAG (${riseStr} × ${runStr})`;

        setTokens([]);
        setResultValue(diagVal);
        setResultDim(1);
        setCustomSuffix(null);
        setHistoryTape(`${tapeStr} =`);
        setJustCalculated(true);
        setLastActionWasCarpentryStore(true);
        addHistoryItem(`${tapeStr} = ${diagStr}`, diagVal, 1, tapeStr);
      } else if (hasFreshTyped && active.valid && active.val > 0) {
        const diagLen = active.dim === 0 ? active.val * getUnitMult(defaultUnit) : active.val;
        setCarpentryState((prev) => ({ ...prev, diag: diagLen, showDiagSubBar: true }));
        setTokens([]);
        setResultValue(diagLen);
        setResultDim(1);
        setCustomSuffix(null);
        setHistoryTape(`STORED DIAG =`);
        setJustCalculated(true);
        setLastActionWasCarpentryStore(true);
      } else if (carpentryState.diag !== null) {
        setCarpentryState((prev) => ({ ...prev, showDiagSubBar: true }));
        setTokens([]);
        setResultValue(carpentryState.diag);
        setResultDim(1);
        setCustomSuffix(null);
        setHistoryTape(`RECALL DIAG =`);
        setJustCalculated(true);
        setLastActionWasCarpentryStore(true);
      }
    }, [tokens, justCalculated, lastActionWasCarpentryStore, resultValue, getActiveInput, getUnitMult, defaultUnit, carpentryState, unitMode, precision, saveCalcState, addHistoryItem]);

    const handleNumber = useCallback(
      (char: string) => {
        hapticFeedback();
        if (error) setError(null);
        saveCalcState();
        if (justCalculated) {
          setResultValue(null);
          setResultDim(0);
          setCustomSuffix(null);
          setJustCalculated(false);
          setLastActionWasCarpentryStore(false);
          if (!operator) {
            setHistoryTape('');
          }
        }
        setTokens((prev) => {
          const last = prev[prev.length - 1];
          if (!last || last.type === 'unit') {
            return [...prev, { type: 'num', val: char }];
          } else {
            const newTokens = [...prev];
            newTokens[newTokens.length - 1] = { type: 'num', val: last.val + char };
            return newTokens;
          }
        });
      },
      [justCalculated, operator, error, saveCalcState]
    );

    const handleToggleSign = useCallback(() => {
      hapticFeedback();
      if (error) return;
      saveCalcState();
      if (justCalculated && resultValue !== null) {
        setResultValue(-resultValue);
        return;
      }
      setTokens((prev) => {
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
    }, [justCalculated, resultValue, error, saveCalcState]);

    const handleUnit = useCallback(
      (unit: string) => {
        hapticFeedback();
        if (error) setError(null);
        saveCalcState();
        if (justCalculated) {
          setResultValue(null);
          setResultDim(0);
          setCustomSuffix(null);
          setJustCalculated(false);
          setLastActionWasCarpentryStore(false);
          if (!operator) setHistoryTape('');
        }
        setTokens((prev) => {
          const last = prev[prev.length - 1];
          if (!last || last.type === 'unit') {
            return [...prev, { type: 'num', val: '0' }, { type: 'unit', val: unit }];
          } else {
            return [...prev, { type: 'unit', val: unit }];
          }
        });
      },
      [justCalculated, operator, error, saveCalcState]
    );

    // Requirement 4: FRAC button inserts '/' when typing numerator/denominator digits AND toggles quick-fraction strip
    const handleFracButton = useCallback(() => {
      hapticFeedback();
      if (error) setError(null);
      const last = tokens[tokens.length - 1];
      if (!justCalculated && last && last.type === 'num' && !last.val.includes('/')) {
        saveCalcState();
        setTokens((prev) => {
          const updated = [...prev];
          const l = updated[updated.length - 1];
          updated[updated.length - 1] = { type: 'num', val: l.val + '/' };
          return updated;
        });
        setShowQuickFracBar(true);
      } else {
        setShowQuickFracBar((prev) => !prev);
      }
    }, [tokens, justCalculated, error, saveCalcState]);

    const handleFractionSelect = useCallback(
      (fraction: string) => {
        hapticFeedback();
        setIsFractionModalOpen(false);
        if (error) setError(null);
        saveCalcState();
        if (justCalculated) {
          setResultValue(null);
          setResultDim(0);
          setCustomSuffix(null);
          setJustCalculated(false);
          setLastActionWasCarpentryStore(false);
          if (!operator) setHistoryTape('');
          setTokens([{ type: 'num', val: fraction }]);
          return;
        }

        setTokens((prev) => {
          const last = prev[prev.length - 1];
          if (!last || last.type === 'unit') {
            return [...prev, { type: 'num', val: fraction }];
          } else {
            const newTokens = [...prev];
            let newVal = last.val;

            if (newVal === '0' || newVal.endsWith('/')) {
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
      },
      [justCalculated, operator, error, saveCalcState]
    );

    const handleBackspace = useCallback(() => {
      hapticFeedback();
      if (error) {
        saveCalcState();
        clearAll();
        return;
      }
      if (justCalculated) {
        saveCalcState();
        clearAll();
        return;
      }
      if (tokens.length === 0) return;
      saveCalcState();
      setTokens((prev) => {
        if (prev.length === 0) return prev;
        const last = prev[prev.length - 1];
        if (last.type === 'unit') {
          return prev.slice(0, -1);
        } else {
          const newVal = last.val.slice(0, -1);
          if (newVal === '' || newVal === '-') return prev.slice(0, -1);
          const newTokens = [...prev];
          newTokens[newTokens.length - 1] = { type: 'num', val: newVal };
          return newTokens;
        }
      });
    }, [justCalculated, clearAll, error, tokens.length, saveCalcState]);

    const handleClear = useCallback(() => {
      hapticFeedback();
      saveCalcState();
      if (error) {
        clearAll();
        return;
      }
      if (tokens.length > 0) {
        setTokens([]);
      } else if (justCalculated || accumulator !== null || historyTape !== '') {
        clearAll();
      } else {
        setCarpentryState(INITIAL_CARPENTRY_STATE);
      }
    }, [tokens.length, justCalculated, accumulator, historyTape, clearAll, error, saveCalcState]);

    const handleOperator = useCallback(
      (op: string) => {
        hapticFeedback();
        if (error) setError(null);
        const active = getActiveInput();
        if (!active.valid && accumulator === null) return;

        saveCalcState();

        let nextAccV = active.val;
        let nextAccD = active.dim;

        try {
          if (accumulator !== null && operator && !justCalculated && active.valid) {
            const res = doMath(accumulator, accumDim, active.val, active.dim, operator, getUnitMult(defaultUnit));
            nextAccV = res.val;
            nextAccD = res.dim;
          } else if (accumulator !== null && operator && !active.valid) {
            // Just switching operator
            setOperator(op);
            setHistoryTape((prev) => prev.replace(/[+\-*/]$/, op));
            return;
          }

          setAccumulator(nextAccV);
          setAccumDim(nextAccD);
          setOperator(op);

          const activeStr = justCalculated
            ? formatValue(resultValue!, resultDim, unitMode, precision).primary
            : evaluateTokens(tokens, unitMode).str || '0';
          setHistoryTape((prev) => (justCalculated || !prev ? `${activeStr} ${op}` : `${prev} ${activeStr} ${op}`));

          setTokens([]);
          setJustCalculated(false);
          setLastActionWasCarpentryStore(false);
          setCustomSuffix(null);
          setResultValue(null);
        } catch (err: any) {
          setError(err.message);
        }
      },
      [accumulator, operator, justCalculated, accumDim, error, tokens, resultValue, resultDim, unitMode, getActiveInput, saveCalcState, getUnitMult, defaultUnit, precision]
    );

    // Requirement 6: % key on bottom row for quick +10% waste calculations
    const handlePercent = useCallback(() => {
      hapticFeedback();
      if (error) return;
      const active = getActiveInput();
      if (!active.valid) return;

      saveCalcState();
      const pct = active.val;

      if (accumulator !== null && operator) {
        let resVal = 0;
        let resDim = accumDim;
        const delta = accumulator * (pct / 100);
        if (operator === '+') resVal = accumulator + delta;
        else if (operator === '-') resVal = accumulator - delta;
        else if (operator === '*') resVal = delta;
        else if (operator === '/') resVal = pct !== 0 ? accumulator / (pct / 100) : 0;

        const baseStr = formatValue(accumulator, accumDim, unitMode, precision).primary;
        const resStr = formatValue(resVal, resDim, unitMode, precision).primary;
        const fullEq = `${baseStr} ${operator} ${pct}% =`;

        setHistoryTape(fullEq);
        setResultValue(resVal);
        setResultDim(resDim);
        setCustomSuffix(null);
        setAccumulator(null);
        setOperator(null);
        setTokens([]);
        setJustCalculated(true);
        setLastActionWasCarpentryStore(false);
        addHistoryItem(`${fullEq} ${resStr}`, resVal, resDim, `${baseStr} ${operator} ${pct}%`);
      } else {
        const resVal = pct / 100;
        const fullEq = `${pct}% =`;
        setHistoryTape(fullEq);
        setResultValue(resVal);
        setResultDim(0);
        setCustomSuffix(null);
        setTokens([]);
        setJustCalculated(true);
        setLastActionWasCarpentryStore(false);
        addHistoryItem(`${fullEq} ${resVal}`, resVal, 0, `${pct}%`);
      }
    }, [error, getActiveInput, saveCalcState, accumulator, operator, accumDim, unitMode, precision, addHistoryItem]);

    const handleEquals = useCallback(() => {
      hapticFeedback();
      if (error) return;

      if (!operator || accumulator === null) {
        if (accumulator === null && !operator) {
          const active = getActiveInput();
          if (active.valid && active.dim === 0) {
            saveCalcState();
            const resVal = active.val * getUnitMult(defaultUnit);
            setResultValue(resVal);
            setResultDim(1);
            setCustomSuffix(null);
            setTokens([]);
            setJustCalculated(true);
            setLastActionWasCarpentryStore(false);
            const activeStr = evaluateTokens(tokens, unitMode).str || '0';
            const fullEq = `${activeStr} =`;
            setHistoryTape(fullEq);
            addHistoryItem(`${fullEq} ${formatValue(resVal, 1, unitMode, precision).primary}`, resVal, 1, activeStr);
          } else if (active.valid && active.dim > 0) {
            saveCalcState();
            setResultValue(active.val);
            setResultDim(active.dim);
            setCustomSuffix(null);
            setTokens([]);
            setJustCalculated(true);
            setLastActionWasCarpentryStore(false);
            const activeStr = evaluateTokens(tokens, unitMode).str || '0';
            const fullEq = `${activeStr} =`;
            setHistoryTape(fullEq);
            addHistoryItem(`${fullEq} ${formatValue(active.val, active.dim, unitMode, precision).primary}`, active.val, active.dim, activeStr);
          }
        }
        return;
      }

      saveCalcState();
      const active = getActiveInput();

      try {
        const res = doMath(accumulator, accumDim, active.val, active.dim, operator, getUnitMult(defaultUnit));

        const activeStr = justCalculated
          ? formatValue(resultValue!, resultDim, unitMode, precision).primary
          : evaluateTokens(tokens, unitMode).str || '0';
        const fullEq = `${historyTape} ${activeStr} =`;
        setHistoryTape(fullEq);

        setResultValue(res.val);
        setResultDim(res.dim);
        setCustomSuffix(null);
        setAccumulator(null);
        setOperator(null);
        setTokens([]);
        setJustCalculated(true);
        setLastActionWasCarpentryStore(false);

        addHistoryItem(
          `${fullEq} ${formatValue(res.val, res.dim, unitMode, precision).primary}`,
          res.val,
          res.dim,
          `${historyTape} ${activeStr}`
        );
      } catch (err: any) {
        setError(err.message);
      }
    }, [
      error,
      operator,
      accumulator,
      accumDim,
      justCalculated,
      resultValue,
      resultDim,
      unitMode,
      tokens,
      historyTape,
      getActiveInput,
      getUnitMult,
      defaultUnit,
      saveCalcState,
      addHistoryItem,
      precision,
    ]);

    const handleSaveToList = useCallback(() => {
      hapticFeedback();

      if (carpentryState.showDiagSubBar && carpentryState.rise !== null && carpentryState.run !== null && carpentryState.diag !== null) {
        const formatStr = (v: number) => formatValue(v, 1, unitMode, precision).primary;
        const pitchStr = carpentryState.pitch !== null ? `${carpentryState.pitch}/12` : 'N/A';
        const data = `  Pitch: ${pitchStr}\n  Rise:  ${formatStr(carpentryState.rise)}\n  Run:   ${formatStr(carpentryState.run)}\n  Diag:  ${formatStr(carpentryState.diag)}`;
        setSavedList((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            type: 'triangle',
            data,
          },
        ]);
        return;
      }

      if (!justCalculated && tokens.length === 0) return;

      let data = '';
      if (justCalculated) {
        const resStr = formatValue(resultValue || 0, resultDim, unitMode, precision).primary + (customSuffix ? ` ${customSuffix}` : '');
        data = `${historyTape.trim()} ${resStr}`;
      } else {
        const currentExpr = evaluateTokens(tokens, unitMode).str || '0';
        if (historyTape && operator && accumulator !== null) {
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

      setSavedList((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          timestamp: Date.now(),
          type: 'standard',
          data,
        },
      ]);
    }, [
      carpentryState,
      unitMode,
      precision,
      justCalculated,
      tokens,
      resultValue,
      resultDim,
      customSuffix,
      historyTape,
      operator,
      accumulator,
      accumDim,
      getActiveInput,
      getUnitMult,
      defaultUnit,
    ]);

    const handleShareList = useCallback(async () => {
      hapticFeedback();
      const text =
        '📐 SQUARED PRO - CUT LIST\n\n' +
        savedList
          .map((item, index) => {
            if (item.type === 'triangle') {
              return `Cut #${index + 1} (Triangle Layout):\n${item.data}`;
            }
            return `Cut #${index + 1}:\n  ${item.data}`;
          })
          .join('\n\n');

      if (navigator.share) {
        try {
          await navigator.share({
            title: 'ProBuild Cut List',
            text: text,
          });
        } catch (err) {
          console.error('Error sharing', err);
        }
      } else if (navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(text);
        } catch (err) {
          console.error('Error copying', err);
        }
      }
    }, [savedList]);

    // Requirement 6: ADV Mode Scientific & Carpentry Macros
    const handleSci = useCallback(
      (op: string) => {
        hapticFeedback();
        if (error) setError(null);
        const active = getActiveInput();
        if (!active.valid) return;

        saveCalcState();

        let resV = active.val;
        let resD = active.dim;

        try {
          if (op === 'sq') {
            if (resD === 0) {
              resV = resV * resV;
            } else {
              resV = resV * resV;
              resD = resD * 2;
              if (resD > 3) throw new Error('Max Dimension Exceeded');
            }
          } else if (op === 'sqrt') {
            if (resV < 0) throw new Error('Invalid Input');
            if (resD === 2) {
              resV = Math.sqrt(resV);
              resD = 1;
            } else {
              resV = Math.sqrt(resV);
              resD = 0;
            }
          } else if (['sin', 'cos', 'tan'].includes(op)) {
            // Degree-mode trig: if value had default unit multiplier applied, normalize to raw degrees
            const deg = resD === 1 && justCalculated ? resV / getUnitMult(defaultUnit) : resV;
            const rad = deg * (Math.PI / 180);
            if (op === 'sin') resV = Math.sin(rad);
            if (op === 'cos') resV = Math.cos(rad);
            if (op === 'tan') resV = Math.tan(rad);
            resV = Math.round(resV * 10000000) / 10000000;
            resD = 0;

            const fnName = `${op.toUpperCase()}°`;
            const fullEq = `${fnName}(${deg}°) =`;
            setResultValue(resV);
            setResultDim(0);
            setCustomSuffix(null);
            setTokens([]);
            setJustCalculated(true);
            setLastActionWasCarpentryStore(false);
            setHistoryTape(fullEq);
            addHistoryItem(`${fullEq} ${resV}`, resV, 0, `${fnName}(${deg}°)`);
            return;
          }

          setResultValue(resV);
          setResultDim(resD);
          setCustomSuffix(null);
          setTokens([]);
          setJustCalculated(true);
          setLastActionWasCarpentryStore(false);

          const activeStr = justCalculated
            ? formatValue(active.val, active.dim, unitMode, precision).primary
            : evaluateTokens(tokens, unitMode).str || '0';
          const fnName = op === 'sq' ? 'SQR' : '√';
          const fullEq = `${fnName}(${activeStr}) =`;
          setHistoryTape(fullEq);

          addHistoryItem(
            `${fullEq} ${formatValue(resV, resD, unitMode, precision).primary}`,
            resV,
            resD,
            `${fnName}(${activeStr})`
          );
        } catch (err: any) {
          setError(err.message);
        }
      },
      [error, justCalculated, unitMode, tokens, getActiveInput, saveCalcState, addHistoryItem, precision, getUnitMult, defaultUnit]
    );

    const handleCarpentryMacro = useCallback(
      (macro: 'bf' | 'oc' | 'arc' | 'ftm') => {
        hapticFeedback();
        if (error) setError(null);
        const active = getActiveInput();

        if (macro === 'arc') {
          if (justCalculated && resultValue !== null && resultDim === 1) {
            saveCalcState();
            const arcLen = resultValue * Math.PI;
            const dStr = formatValue(resultValue, 1, unitMode, precision).primary;
            const resStr = formatValue(arcLen, 1, unitMode, precision).primary;
            const fullEq = `ARC (π × ${dStr}) =`;
            setResultValue(arcLen);
            setResultDim(1);
            setCustomSuffix(null);
            setHistoryTape(fullEq);
            setJustCalculated(true);
            addHistoryItem(`${fullEq} ${resStr}`, arcLen, 1, `ARC (π × ${dStr})`);
          } else {
            handleNumber('3.14159');
          }
          return;
        }

        if (!active.valid) return;
        saveCalcState();

        let evalVal = active.val;
        let evalDim = active.dim;
        if (accumulator !== null && operator && !justCalculated) {
          try {
            const combined = doMath(accumulator, accumDim, active.val, active.dim, operator, getUnitMult(defaultUnit));
            evalVal = combined.val;
            evalDim = combined.dim;
            setAccumulator(null);
            setOperator(null);
          } catch {
            // keep active
          }
        }

        if (macro === 'bf') {
          // Board Feet: 1 BF = 144 cubic inches
          let bf = 0;
          if (unitMode === 'imp') {
            if (evalDim === 3) bf = evalVal / 144;
            else if (evalDim === 2) bf = evalVal / 144;
            else if (evalDim === 1) bf = evalVal / 12; // 1"x12" per linear foot
            else bf = evalVal / 144;
          } else {
            // Metric mm3 to in3 -> BF
            const in3 = evalDim === 3 ? evalVal / 16387.064 : evalVal;
            bf = in3 / 144;
          }
          const roundedBf = Math.round(bf * 100) / 100;
          const fullEq = `BOARD FEET =`;
          setResultValue(roundedBf);
          setResultDim(0);
          setCustomSuffix('BF');
          setTokens([]);
          setJustCalculated(true);
          setLastActionWasCarpentryStore(false);
          setHistoryTape(fullEq);
          addHistoryItem(`${fullEq} ${roundedBf} BF`, roundedBf, 0, 'BOARD FEET');
        } else if (macro === 'oc') {
          // 16" O.C. Stud Count = ceil(Length / 16") + 1
          const lenInches =
            unitMode === 'imp'
              ? evalDim === 0
                ? evalVal * getUnitMult(defaultUnit)
                : evalVal
              : (evalDim === 0 ? evalVal * getUnitMult(defaultUnit) : evalVal) / 25.4;
          const studs = Math.ceil(Math.abs(lenInches) / 16) + 1;
          const lenLabel = formatImperialLength(lenInches, precision).primary;
          const fullEq = `16" O.C. (${lenLabel}) =`;
          setResultValue(studs);
          setResultDim(0);
          setCustomSuffix('Studs (16" O.C.)');
          setTokens([]);
          setJustCalculated(true);
          setLastActionWasCarpentryStore(false);
          setHistoryTape(fullEq);
          addHistoryItem(`${fullEq} ${studs} Studs`, studs, 0, `16" O.C. (${lenLabel})`);
        } else if (macro === 'ftm') {
          // Instant FT <-> M toggle readout
          const lenInches =
            unitMode === 'imp'
              ? evalDim === 0
                ? evalVal * getUnitMult(defaultUnit)
                : evalVal
              : (evalDim === 0 ? evalVal * getUnitMult(defaultUnit) : evalVal) / 25.4;
          const meters = (lenInches * 25.4) / 1000;
          const impStr = formatImperialLength(lenInches, precision).primary;
          const metStr = `${meters.toFixed(3)} m (${Math.round(lenInches * 25.4)} mm)`;
          setHistoryTape(`${impStr} ↔ ${metStr}`);
          setResultValue(unitMode === 'imp' ? lenInches : lenInches * 25.4);
          setResultDim(1);
          setCustomSuffix(null);
          setTokens([]);
          setJustCalculated(true);
          setLastActionWasCarpentryStore(false);
        }
      },
      [
        error,
        getActiveInput,
        justCalculated,
        resultValue,
        resultDim,
        unitMode,
        precision,
        saveCalcState,
        addHistoryItem,
        handleNumber,
        accumulator,
        operator,
        accumDim,
        getUnitMult,
        defaultUnit,
      ]
    );

    // === BULLETPROOF VOICE QUEUE ===
    const voiceCommandQueue = useRef<string[]>([]);
    const voiceActions = useRef({
      handleNumber,
      handleOperator,
      handleUnit,
      handleEquals,
      handleClear,
      handleDiagKey,
      handleRiseKey,
      handleRunKey,
      handlePitchKey,
      handleFractionSelect,
    });

    useEffect(() => {
      voiceActions.current = {
        handleNumber,
        handleOperator,
        handleUnit,
        handleEquals,
        handleClear,
        handleDiagKey,
        handleRiseKey,
        handleRunKey,
        handlePitchKey,
        handleFractionSelect,
      };
    });

    useEffect(() => {
      const interval = setInterval(() => {
        if (voiceCommandQueue.current.length > 0) {
          const word = voiceCommandQueue.current.shift()?.replace(/\.$/, '').toLowerCase();
          if (!word) return;

          const actions = voiceActions.current;

          if (word.match(/^[0-9.]+$/)) {
            for (const char of word) actions.handleNumber(char);
          } else if (word === 'one') actions.handleNumber('1');
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
          else if (word === 'pitch') actions.handlePitchKey();
          else if (word === 'rise') actions.handleRiseKey();
          else if (word === 'run') actions.handleRunKey();
          else if (word === 'diag') actions.handleDiagKey();
          else if (word.startsWith('fr_')) actions.handleFractionSelect(word.replace('fr_', ''));
        }
      }, 150);
      return () => clearInterval(interval);
    }, []);

    const queueVoiceCommand = useCallback((transcript: string) => {
      let t = transcript.toLowerCase();
      t = t.replace(/[,!?]/g, '');

      t = t.replace(/^(0|zero|oh)\s+(plus|minus|subtract|take away|negative|\+|-|\*|\/)/i, ' $2 ');

      t = t.replace(/11\/15/g, '11/16');
      t = t.replace(/13\/15/g, '13/16');
      t = t.replace(/15\/15/g, '15/16');
      t = t.replace(/5\/15/g, '5/16');
      t = t.replace(/7\/15/g, '7/16');
      t = t.replace(/9\/15/g, '9/16');

      t = t.replace(/\band\b/g, ' ');
      t = t.replace(/([0-9.]+)([a-z]+)/g, '$1 $2');
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

      t = t.replace(/\bsubtract\b/g, ' - ');
      t = t.replace(/\btake away\b/g, ' - ');
      t = t.replace(/\bnegative\b/g, ' - ');

      t = t.replace(/set pitch/g, ' pitch ');
      t = t.replace(/set rise/g, ' rise ');
      t = t.replace(/set run/g, ' run ');
      t = t.replace(/calculate diagonal/g, ' diag ');
      t = t.replace(/clear board/g, ' clear ');
      t = t.replace(/calculate/g, ' equals ');
      t = t.replace(/divided by/g, ' / ');
      t = t.replace(/plus/g, ' + ');
      t = t.replace(/minus/g, ' - ');
      t = t.replace(/times/g, ' * ');

      const voiceTokens = t.split(/\s+/).filter((w) => w.length > 0);
      voiceCommandQueue.current.push(...voiceTokens);
    }, []);

    const toggleListening = useCallback(async () => {
      if (isListening) {
        setIsListening(false);
        setLiveTranscript('');
        if (voiceTimeoutRef.current) clearTimeout(voiceTimeoutRef.current);
        try {
          await SpeechRecognition.stop();
        } catch (e) {}
        return;
      }

      try {
        await SpeechRecognition.requestPermissions();

        setIsListening(true);
        setLiveTranscript("Listening... Try saying '5 ft plus 2 in'");

        SpeechRecognition.removeAllListeners();

        SpeechRecognition.addListener('partialResults', (data: any) => {
          if (data.matches && data.matches.length > 0) {
            const text = data.matches[0];
            setLiveTranscript(text);

            if (voiceTimeoutRef.current) clearTimeout(voiceTimeoutRef.current);

            if (text.toLowerCase().includes('equals') || text.includes('=')) {
              setIsListening(false);
              queueVoiceCommand(text);
              try {
                SpeechRecognition.stop();
              } catch (e) {}
              setTimeout(() => setLiveTranscript(''), 2500);
              return;
            }

            voiceTimeoutRef.current = setTimeout(async () => {
              setIsListening(false);
              queueVoiceCommand(text + ' equals');
              try {
                await SpeechRecognition.stop();
              } catch (e) {}

              setTimeout(() => setLiveTranscript(''), 2500);
            }, 3000);
          }
        });

        await SpeechRecognition.start({
          language: 'en-US',
          maxResults: 1,
          partialResults: true,
          popup: false,
        });

        if (voiceTimeoutRef.current) clearTimeout(voiceTimeoutRef.current);
        voiceTimeoutRef.current = setTimeout(async () => {
          setIsListening(false);
          setLiveTranscript('');
          try {
            await SpeechRecognition.stop();
          } catch (e) {}
        }, 10000);
      } catch (e: any) {
        setIsListening(false);
        if (e.message && !e.message.includes('cancelled')) {
          setLiveTranscript(`Err: ${e.message}`);
          setTimeout(() => setLiveTranscript(''), 3000);
        } else {
          setLiveTranscript('');
        }
      }
    }, [isListening, queueVoiceCommand]);

    // === COMPUTE DISPLAY STRINGS FOR MULTI-LINE LCD ===
    const active = getActiveInput();
    let primaryText = '';
    const liveTokenStr = evaluateTokens(tokens, unitMode).str;

    if (justCalculated && resultValue !== null) {
      const f = formatValue(resultValue, resultDim, unitMode, precision, defaultUnit);
      primaryText = f.primary + (customSuffix ? ` ${customSuffix}` : '');
    } else {
      primaryText = liveTokenStr || '0';
    }

    // Expression / Equation Tape Line
    const displayEquationTape = (() => {
      if (justCalculated) return historyTape;
      if (historyTape && liveTokenStr) return `${historyTape} ${liveTokenStr}`;
      if (historyTape) return historyTape;
      if (liveTokenStr) return `${liveTokenStr}`;
      return 'READY';
    })();

    // Auto-Conversion Sub-Readout Bar (Requirement 2 & Requirement 5)
    const subReadoutBarContent = (() => {
      if (error) return null;

      // If DIAG / Triangle solver sub-bar is active and Rise + Run exist
      if (
        carpentryState.showDiagSubBar &&
        carpentryState.rise !== null &&
        carpentryState.run !== null &&
        carpentryState.diag !== null
      ) {
        const plumb = carpentryState.plumbAngle !== null ? carpentryState.plumbAngle.toFixed(1) : '0.0';
        const level = carpentryState.levelAngle !== null ? carpentryState.levelAngle.toFixed(1) : '0.0';
        const diagArch = formatValue(carpentryState.diag, 1, unitMode, precision).primary;
        return `Plumb: ${plumb}° • Level: ${level}° • 3-4-5 Check: ${diagArch} (90°)`;
      }

      if (!active.valid || active.val === 0) {
        return `0 in  •  0.000 ft  •  0 mm`;
      }

      const currentDim = justCalculated ? resultDim : active.dim;
      const currentVal = justCalculated && resultValue !== null ? resultValue : active.val;

      if (currentDim === 2) {
        const sqIn = unitMode === 'imp' ? currentVal : currentVal / 645.16;
        const sqFt = sqIn / 144;
        const sqM = sqFt * 0.092903;
        return `${sqFt.toFixed(2)} sq ft  •  ${Math.round(sqIn).toLocaleString()} sq in  •  ${sqM.toFixed(2)} m²`;
      }

      if (currentDim === 3) {
        const cuIn = unitMode === 'imp' ? currentVal : currentVal / 16387.064;
        const cuFt = cuIn / 1728;
        const cuYd = cuFt / 27;
        const cuM = cuFt * 0.0283168;
        return `${cuYd.toFixed(2)} cu yd  •  ${cuFt.toFixed(2)} cu ft  •  ${cuM.toFixed(2)} m³`;
      }

      // Length conversion strip (dim === 1 or scalar treated as active unit length)
      const totalInches =
        unitMode === 'imp'
          ? currentDim === 1
            ? currentVal
            : currentVal * getUnitMult(defaultUnit)
          : (currentDim === 1 ? currentVal : currentVal * getUnitMult(defaultUnit)) / 25.4;

      return `${fmtTotalInches(totalInches, precision)} in  •  ${(totalInches / 12).toFixed(3)} ft  •  ${Math.round(totalInches * 25.4).toLocaleString()} mm`;
    })();

    const hasCarpentryRegisters =
      carpentryState.pitch !== null ||
      carpentryState.rise !== null ||
      carpentryState.run !== null ||
      carpentryState.diag !== null;

    const baseBtn =
      'rounded-lg shadow-sm font-bold text-lg sm:text-xl transition-all active:translate-y-0.5 active:border-b-0 flex items-center justify-center select-none h-11 sm:h-12 outline-none tracking-wide border-b-4 duration-75';
    const variants = {
      num:
        theme === 'dark'
          ? 'bg-slate-800 border-slate-950 text-white hover:bg-slate-700'
          : 'bg-white border-gray-300 text-black hover:bg-gray-50 shadow-sm',
      op:
        theme === 'dark'
          ? 'bg-slate-700 border-slate-950 text-white hover:bg-slate-600'
          : 'bg-gray-100 border-gray-300 text-slate-900 hover:bg-gray-200',
      sci:
        theme === 'dark'
          ? 'bg-slate-800/90 border-slate-950 text-slate-300 hover:bg-slate-700'
          : 'bg-gray-200 border-gray-300 text-slate-900 hover:bg-gray-300',
      unit:
        theme === 'dark'
          ? 'bg-slate-800 border-slate-950 text-slate-300 hover:bg-slate-700'
          : 'bg-gray-200 border-gray-300 text-slate-700 hover:bg-gray-300',
      danger: 'bg-red-600 border-red-800 text-white hover:bg-red-500',
      warning:
        theme === 'dark'
          ? 'bg-gray-700 border-gray-900 text-white hover:bg-gray-600'
          : 'bg-gray-200 border-gray-300 text-slate-700 hover:bg-gray-300',
      accent: 'border-black/40 text-black hover:brightness-110',
    };

    const isImp = unitMode === 'imp';

    return (
      <div className={`w-full max-w-md mx-auto ${theme === 'dark' ? 'dark' : ''} relative`}>
        <div className="bg-gray-100 dark:bg-transparent rounded-2xl dark:rounded-none shadow-2xl dark:shadow-none overflow-hidden border border-gray-200 dark:border-none flex flex-col gap-2.5">
          {/* 3-Second Mic Warning Pop-up */}
          {isListening && (
            <div className="mx-2 mt-2 z-[100] px-3 py-2 rounded-xl shadow-sm flex items-center gap-2.5 animate-in fade-in slide-in-from-top-2 duration-300 border border-amber-500/50 bg-amber-50 dark:bg-amber-950/90 text-amber-900 dark:text-amber-200">
              <Info className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <p className="text-[11px] font-bold leading-tight">
                System notice: The mic stays open as long as hardware allows. Math auto-calculates when you pause!
              </p>
            </div>
          )}

          {/* Multi-Line Construction Master LCD Readout (Requirement 1 & 2) */}
          <div className="px-2 sm:px-0">
            <div
              className="rounded-xl shadow-lg"
              style={{ padding: '2px', background: `linear-gradient(to right, ${accentColor}, ${secondaryColor})` }}
            >
              <div
                className="flex flex-col justify-between bg-slate-900 dark:bg-[#07090c] rounded-[10px] px-3 py-2.5 shadow-[inset_0_4px_20px_rgba(0,0,0,0.6),inset_0_0_50px_rgba(0,0,0,0.85)] h-36 sm:h-40 relative overflow-hidden font-mono"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)',
                  backgroundSize: '12px 12px',
                }}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.75)_100%)] pointer-events-none z-0"></div>

                {/* LAYER 1: Top Status Strip (Carpentry Registers Left | UNDO, REDO, HIST, Help Right) */}
                <div className="relative z-10 flex items-center justify-between gap-1 pb-1.5 border-b border-slate-800/90">
                  <div className="flex items-center gap-1 overflow-x-auto no-scrollbar min-w-0">
                    {hasCarpentryRegisters ? (
                      <>
                        {carpentryState.pitch !== null && (
                          <span
                            className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase whitespace-nowrap"
                            style={{ backgroundColor: `${accentColor}20`, color: accentColor, border: `1px solid ${accentColor}40` }}
                          >
                            P:{carpentryState.pitch}/12
                          </span>
                        )}
                        {carpentryState.rise !== null && (
                          <span
                            className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase whitespace-nowrap"
                            style={{ backgroundColor: `${secondaryColor}20`, color: secondaryColor, border: `1px solid ${secondaryColor}40` }}
                          >
                            RISE:{formatValue(carpentryState.rise, 1, unitMode, precision).primary}
                          </span>
                        )}
                        {carpentryState.run !== null && (
                          <span
                            className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase whitespace-nowrap"
                            style={{ backgroundColor: `${secondaryColor}20`, color: secondaryColor, border: `1px solid ${secondaryColor}40` }}
                          >
                            RUN:{formatValue(carpentryState.run, 1, unitMode, precision).primary}
                          </span>
                        )}
                        {carpentryState.diag !== null && (
                          <span
                            className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase whitespace-nowrap"
                            style={{ backgroundColor: `${accentColor}20`, color: accentColor, border: `1px solid ${accentColor}40` }}
                          >
                            DIAG:{formatValue(carpentryState.diag, 1, unitMode, precision).primary}
                          </span>
                        )}
                        <button
                          onClick={() => setCarpentryState(INITIAL_CARPENTRY_STATE)}
                          className="px-1 py-0.5 rounded text-[9px] font-black text-red-400 hover:bg-red-500/20"
                          title="Clear Stored Triangle Registers"
                        >
                          ×
                        </button>
                      </>
                    ) : (
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 whitespace-nowrap">
                        {isAdvanced ? 'ADV CARPENTRY' : 'CONST MASTER'}
                      </span>
                    )}
                  </div>

                  {/* Top-Right Compact Controls: UNDO | REDO | HIST | Voice Info | Help */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={handleUndo}
                      disabled={calcUndoStack.length === 0}
                      className="px-1.5 py-0.5 rounded bg-slate-800/90 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[9px] font-black uppercase tracking-wider flex items-center gap-0.5 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                      title="Undo"
                    >
                      <RotateCcw className="w-2.5 h-2.5" />
                      UNDO
                    </button>
                    <button
                      onClick={handleRedo}
                      disabled={calcRedoStack.length === 0}
                      className="px-1.5 py-0.5 rounded bg-slate-800/90 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[9px] font-black uppercase tracking-wider flex items-center gap-0.5 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                      title="Redo"
                    >
                      REDO
                      <RotateCw className="w-2.5 h-2.5" />
                    </button>
                    <button
                      onClick={() => {
                        hapticFeedback();
                        setIsHistoryOpen(true);
                      }}
                      className="px-1.5 py-0.5 rounded bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[9px] font-black uppercase tracking-wider flex items-center gap-1 transition-colors"
                      title="Calculation History Tape"
                    >
                      <Clock className="w-2.5 h-2.5" style={{ color: accentColor }} />
                      HIST{localHistoryList.length > 0 ? ` (${localHistoryList.length})` : ''}
                    </button>
                    <button
                      onClick={() => {
                        hapticFeedback();
                        setIsVoiceModalOpen(true);
                      }}
                      className="p-1 rounded bg-slate-800/90 hover:bg-slate-700 border border-slate-700 transition-colors"
                      title="Voice Commands Guide"
                    >
                      <Info className="w-3 h-3" style={{ color: accentColor }} />
                    </button>
                    <button
                      onClick={() => {
                        hapticFeedback();
                        setIsHelpModalOpen(true);
                      }}
                      className="p-1 rounded bg-slate-800/90 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                      title="Calculator Functions Guide"
                    >
                      <HelpCircle className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* LAYER 2: Expression / Equation Tape Line */}
                <div
                  className="relative z-10 text-right text-[11px] sm:text-xs text-slate-400 tracking-wider truncate h-4 mt-0.5"
                  aria-label="History Tape"
                >
                  {renderFractionString(displayEquationTape)}
                </div>

                {/* LAYER 3: Primary Result Readout */}
                <div
                  className={`relative z-10 text-right text-3xl sm:text-4xl font-black truncate tracking-tight leading-none my-0.5 ${
                    error ? 'text-red-400 dark:text-red-500 text-xl' : 'text-white'
                  }`}
                  style={error ? {} : { color: accentColor, textShadow: `0 0 12px ${accentColor}60` }}
                  aria-label="Primary Display"
                  aria-live="polite"
                >
                  {error ? `Error: ${error}` : primaryText ? renderFractionString(primaryText) : '0'}
                </div>

                {/* LAYER 4: Bottom Auto-Conversion Sub-Readout Bar */}
                <div
                  className="relative z-10 pt-1 border-t border-slate-800/90 text-right text-[10px] sm:text-[11px] font-bold tracking-wide truncate text-slate-300"
                  style={{ color: carpentryState.showDiagSubBar ? secondaryColor : accentColor }}
                  aria-label="Auto Conversion Sub-Readout"
                >
                  {subReadoutBarContent}
                </div>
              </div>
            </div>
          </div>

          {/* Live Voice Transcription Text */}
          {liveTranscript && (
            <div className="w-full text-center px-2">
              <span className="text-xs font-semibold text-amber-500 italic dark:text-amber-400 bg-slate-800/10 dark:bg-slate-800 px-2.5 py-1 rounded-lg inline-block">
                "{liveTranscript}"
              </span>
            </div>
          )}

          {/* COMPACT 2-ROW UTILITY CONTROL CLUSTER (Requirement 1) */}
          <div className="flex flex-col gap-1.5 px-2 sm:px-0 relative z-20">
            {/* Row 1: 4-Button Action Bar (VOICE | PRESETS | SAVE | ADV) */}
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => {
                  hapticFeedback();
                  toggleListening();
                }}
                className={`flex items-center justify-center gap-1 text-[10px] sm:text-xs font-black uppercase tracking-wider transition-all active:translate-y-px px-2 py-2 rounded-lg border ${
                  isListening
                    ? 'bg-red-500/20 animate-pulse border-red-500 text-red-500'
                    : 'border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-200'
                }`}
                title="Voice Input"
              >
                {isListening ? <Mic className="w-3.5 h-3.5 shrink-0" /> : <MicOff className="w-3.5 h-3.5 shrink-0" />}
                <span>VOICE</span>
                <span className="bg-amber-500 text-black text-[8px] font-black px-1 py-0.2 rounded leading-tight">
                  BETA
                </span>
              </button>

              <button
                onClick={() => {
                  hapticFeedback();
                  setIsPresetsOpen(true);
                }}
                className="flex items-center justify-center gap-1 text-[10px] sm:text-xs font-black uppercase tracking-wider transition-all active:translate-y-px px-2 py-2 rounded-lg border border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-200"
                title="Formula Presets"
              >
                <BookOpen className="w-3.5 h-3.5 shrink-0" style={{ color: accentColor }} />
                <span>PRESETS</span>
              </button>

              <button
                onClick={handleSaveToList}
                className="flex items-center justify-center gap-1 text-[10px] sm:text-xs font-black uppercase tracking-wider transition-all active:translate-y-px px-2 py-2 rounded-lg text-white hover:brightness-110 shadow-sm"
                style={{ background: `linear-gradient(135deg, ${accentColor}, ${secondaryColor})` }}
                title="Save to Cut List"
              >
                <Save className="w-3.5 h-3.5 shrink-0" />
                <span>SAVE{savedList.length > 0 ? ` (${savedList.length})` : ''}</span>
              </button>

              <button
                onClick={() => {
                  hapticFeedback();
                  setIsAdvanced(!isAdvanced);
                }}
                className="flex items-center justify-center gap-1 text-[10px] sm:text-xs font-black uppercase tracking-wider transition-all active:translate-y-px px-2 py-2 rounded-lg border border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-200"
                style={isAdvanced ? { borderColor: accentColor, color: accentColor, backgroundColor: `${accentColor}15` } : {}}
              >
                <Settings2 className="w-3.5 h-3.5 shrink-0" />
                <span>{isAdvanced ? 'BSC' : 'ADV'}</span>
              </button>
            </div>

            {/* Row 2: Precision & Unit Bar (1/8" | 1/16" | 1/32" and FT-IN | INCH | MM) */}
            <div className="flex w-full items-center justify-between gap-2">
              {/* Left Segmented Pill Group: Tape Precision */}
              <div
                className={`flex-1 flex items-center p-0.5 rounded-lg border ${
                  theme === 'dark' ? 'bg-[#1a1d24] border-slate-800' : 'bg-gray-200 border-gray-300'
                }`}
              >
                {[
                  { val: 8, label: '1/8"' },
                  { val: 16, label: '1/16"' },
                  { val: 32, label: '1/32"' },
                ].map((p) => (
                  <button
                    key={p.val}
                    onClick={() => {
                      hapticFeedback();
                      setPrecision(p.val);
                    }}
                    className={`flex-1 text-center py-1 text-[10px] font-black uppercase tracking-wider rounded-md transition-all ${
                      precision !== p.val ? 'text-slate-500 dark:text-slate-400 hover:text-white' : ''
                    }`}
                    style={
                      precision === p.val
                        ? { color: secondaryColor, backgroundColor: `${secondaryColor}25` }
                        : {}
                    }
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Right Segmented Pill Group: FT-IN | INCH | MM */}
              <div
                className={`flex-1 flex items-center p-0.5 rounded-lg border ${
                  theme === 'dark' ? 'bg-[#1a1d24] border-slate-800' : 'bg-gray-200 border-gray-300'
                }`}
              >
                {[
                  { id: 'ft', label: 'FT-IN' },
                  { id: 'in', label: 'INCH' },
                  { id: 'mm', label: 'MM' },
                ].map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      hapticFeedback();
                      setDefaultUnit(u.id);
                    }}
                    className={`flex-1 text-center py-1 text-[10px] font-black uppercase tracking-wider rounded-md transition-all ${
                      defaultUnit !== u.id ? 'text-slate-500 dark:text-slate-400 hover:text-white' : ''
                    }`}
                    style={
                      defaultUnit === u.id
                        ? { color: accentColor, backgroundColor: `${accentColor}25` }
                        : {}
                    }
                  >
                    {u.label}
                  </button>
                ))}
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
          <div className="px-2 sm:px-0 relative">
            <FractionBoard
              isOpen={isFractionModalOpen}
              onClose={() => setIsFractionModalOpen(false)}
              onSelect={handleFractionSelect}
              theme={theme}
            />

            {/* Requirement 4: Slim 1-Tap Quick-Fraction Strip right above the keypad */}
            {showQuickFracBar && (
              <div className="mb-1.5 p-1 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-1 overflow-x-auto no-scrollbar animate-in fade-in duration-150">
                {QUICK_FRACTIONS.map((frac) => (
                  <button
                    key={frac}
                    onClick={() => handleFractionSelect(frac)}
                    className="flex-1 min-w-[36px] py-1.5 px-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] font-black text-white font-mono transition-all active:scale-95"
                    style={{ color: accentColor }}
                  >
                    {frac}
                  </button>
                ))}
                <button
                  onClick={() => setIsFractionModalOpen(true)}
                  className="px-2 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700 border border-slate-700 text-[9px] font-black uppercase text-slate-300 whitespace-nowrap"
                  title="Open 1/32 Fraction Grid"
                >
                  32nds
                </button>
              </div>
            )}

            <div className="grid grid-cols-5 gap-1 sm:gap-1.5">
              {/* Requirement 6: ADV Mode Rows */}
              {isAdvanced && (
                <>
                  {/* ADV Row 1: x² | √x | SIN° | COS° | TAN° */}
                  <button className={`${baseBtn} ${variants.sci} text-xs font-black`} onClick={() => handleSci('sq')} aria-label="Square">
                    x²
                  </button>
                  <button className={`${baseBtn} ${variants.sci} text-xs font-black`} onClick={() => handleSci('sqrt')} aria-label="Square Root">
                    √x
                  </button>
                  <button className={`${baseBtn} ${variants.sci} text-xs font-black`} onClick={() => handleSci('sin')} aria-label="Sine Degrees">
                    SIN°
                  </button>
                  <button className={`${baseBtn} ${variants.sci} text-xs font-black`} onClick={() => handleSci('cos')} aria-label="Cosine Degrees">
                    COS°
                  </button>
                  <button className={`${baseBtn} ${variants.sci} text-xs font-black`} onClick={() => handleSci('tan')} aria-label="Tangent Degrees">
                    TAN°
                  </button>

                  {/* ADV Row 2 (Quick Carpentry Macros): BF | OC | ARC / π | FT↔M */}
                  <div className="col-span-5 grid grid-cols-4 gap-1 sm:gap-1.5">
                    <button
                      className={`${baseBtn} ${variants.sci} text-xs font-black tracking-wider`}
                      style={{ color: accentColor }}
                      onClick={() => handleCarpentryMacro('bf')}
                      title="Calculate Board Feet (BF)"
                    >
                      BF
                    </button>
                    <button
                      className={`${baseBtn} ${variants.sci} text-xs font-black tracking-wider`}
                      style={{ color: accentColor }}
                      onClick={() => handleCarpentryMacro('oc')}
                      title="16 inch On-Center Stud Count"
                    >
                      OC (16")
                    </button>
                    <button
                      className={`${baseBtn} ${variants.sci} text-xs font-black tracking-wider`}
                      style={{ color: accentColor }}
                      onClick={() => handleCarpentryMacro('arc')}
                      title="Circle Arc / Circumference or Insert Pi"
                    >
                      ARC / π
                    </button>
                    <button
                      className={`${baseBtn} ${variants.sci} text-xs font-black tracking-wider`}
                      style={{ color: secondaryColor }}
                      onClick={() => handleCarpentryMacro('ftm')}
                      title="Convert Feet/Inches ↔ Meters"
                    >
                      FT↔M
                    </button>
                  </div>
                </>
              )}

              {/* Requirement 5: 4-Button Right-Triangle & Rafter Solver Bar (PITCH | RISE | RUN | DIAG) */}
              <div className="col-span-5 grid grid-cols-4 gap-1 sm:gap-1.5">
                <button
                  className={`${baseBtn} ${variants.sci} text-xs font-black tracking-wider`}
                  style={{
                    color: carpentryState.pitch !== null ? '#fff' : secondaryColor,
                    ...(carpentryState.pitch !== null ? { backgroundColor: `${secondaryColor}40`, borderColor: secondaryColor } : {}),
                  }}
                  onClick={handlePitchKey}
                >
                  PITCH
                </button>
                <button
                  className={`${baseBtn} ${variants.sci} text-xs font-black tracking-wider`}
                  style={{
                    color: carpentryState.rise !== null ? '#fff' : secondaryColor,
                    ...(carpentryState.rise !== null ? { backgroundColor: `${secondaryColor}40`, borderColor: secondaryColor } : {}),
                  }}
                  onClick={handleRiseKey}
                >
                  RISE
                </button>
                <button
                  className={`${baseBtn} ${variants.sci} text-xs font-black tracking-wider`}
                  style={{
                    color: carpentryState.run !== null ? '#fff' : secondaryColor,
                    ...(carpentryState.run !== null ? { backgroundColor: `${secondaryColor}40`, borderColor: secondaryColor } : {}),
                  }}
                  onClick={handleRunKey}
                >
                  RUN
                </button>
                <button
                  className={`${baseBtn} ${variants.sci} text-xs font-black tracking-wider`}
                  style={{
                    color: carpentryState.diag !== null ? '#fff' : accentColor,
                    ...(carpentryState.diag !== null ? { backgroundColor: `${accentColor}40`, borderColor: accentColor } : {}),
                  }}
                  onClick={handleDiagKey}
                >
                  DIAG
                </button>
              </div>

              {/* Unit & Clear Row */}
              <button
                className={`${baseBtn} ${variants.unit} text-xs uppercase font-black`}
                onClick={() => handleUnit(isImp ? 'ft' : 'm')}
                aria-label={isImp ? 'Feet' : 'Meters'}
              >
                {isImp ? 'Feet' : 'm'}
              </button>
              <button
                className={`${baseBtn} ${variants.unit} text-xs uppercase font-black`}
                onClick={() => handleUnit(isImp ? 'in' : 'cm')}
                aria-label={isImp ? 'Inches' : 'Centimeters'}
              >
                {isImp ? 'Inch' : 'cm'}
              </button>
              <button
                className={`${baseBtn} ${variants.unit} text-xs uppercase font-black`}
                style={showQuickFracBar && isImp ? { borderColor: accentColor, color: accentColor } : {}}
                onClick={() => (isImp ? handleFracButton() : handleUnit('mm'))}
                aria-label={isImp ? 'Fraction' : 'Millimeters'}
              >
                {isImp ? 'FRAC /' : 'mm'}
              </button>
              <button className={`${baseBtn} ${variants.danger} text-xs uppercase font-black`} onClick={handleClear} aria-label="Clear">
                CLEAR
              </button>
              <button className={`${baseBtn} ${variants.warning} text-xs uppercase font-black`} onClick={handleBackspace} aria-label="Backspace">
                DEL
              </button>

              {/* Row 3 */}
              <button className={`${baseBtn} ${variants.num}`} onClick={() => handleNumber('7')}>
                7
              </button>
              <button className={`${baseBtn} ${variants.num}`} onClick={() => handleNumber('8')}>
                8
              </button>
              <button className={`${baseBtn} ${variants.num}`} onClick={() => handleNumber('9')}>
                9
              </button>
              <button className={`${baseBtn} ${variants.op}`} onClick={() => handleOperator('/')} aria-label="Divide">
                ÷
              </button>
              <button className={`${baseBtn} ${variants.op}`} onClick={() => handleOperator('*')} aria-label="Multiply">
                ×
              </button>

              {/* Row 4 */}
              <button className={`${baseBtn} ${variants.num}`} onClick={() => handleNumber('4')}>
                4
              </button>
              <button className={`${baseBtn} ${variants.num}`} onClick={() => handleNumber('5')}>
                5
              </button>
              <button className={`${baseBtn} ${variants.num}`} onClick={() => handleNumber('6')}>
                6
              </button>
              <button className={`${baseBtn} ${variants.op}`} onClick={() => handleOperator('-')} aria-label="Subtract">
                -
              </button>
              <button className={`${baseBtn} ${variants.op}`} onClick={() => handleOperator('+')} aria-label="Add">
                +
              </button>

              {/* Row 5 & 6 Integrated */}
              <button className={`${baseBtn} ${variants.num}`} onClick={() => handleNumber('1')}>
                1
              </button>
              <button className={`${baseBtn} ${variants.num}`} onClick={() => handleNumber('2')}>
                2
              </button>
              <button className={`${baseBtn} ${variants.num}`} onClick={() => handleNumber('3')}>
                3
              </button>
              <button className={`${baseBtn} ${variants.num}`} onClick={() => handleNumber('.')}>
                .
              </button>
              <button
                className={`${baseBtn} ${variants.accent} row-span-2 h-full !text-white shadow-md`}
                style={{ background: `linear-gradient(135deg, ${accentColor}, ${secondaryColor})` }}
                onClick={handleEquals}
                aria-label="Equals"
              >
                =
              </button>

              <button className={`${baseBtn} ${variants.num} col-span-2`} onClick={() => handleNumber('0')}>
                0
              </button>
              <button className={`${baseBtn} ${variants.num}`} onClick={handleToggleSign} aria-label="Toggle Sign">
                +/-
              </button>
              <button
                className={`${baseBtn} ${variants.op} font-black`}
                style={{ color: accentColor }}
                onClick={handlePercent}
                aria-label="Percent / Waste"
                title="Percentage / Add Waste (e.g. + 10 %)"
              >
                %
              </button>
            </div>
          </div>

          {/* Formula Presets Modal */}
          <PresetsMenu
            isOpen={isPresetsOpen}
            onClose={() => setIsPresetsOpen(false)}
            unitMode={unitMode}
            onSwitchTool={onSwitchTool}
            accentColor={accentColor}
            onInject={(val, dim, tapeStr) => {
              saveCalcState();
              setResultValue(val);
              setResultDim(dim);
              setCustomSuffix(null);
              setTokens([]);
              setAccumulator(null);
              setOperator(null);
              setJustCalculated(true);
              setLastActionWasCarpentryStore(false);
              setHistoryTape(tapeStr);
              addHistoryItem(`${tapeStr} = ${formatValue(val, dim, unitMode, precision).primary}`, val, dim, tapeStr);
            }}
          />

          {/* History Tape Modal */}
          <HistoryTape
            isOpen={isHistoryOpen}
            onClose={() => setIsHistoryOpen(false)}
            history={localHistoryList}
            accentColor={accentColor}
            onClear={() => setLocalHistoryList([])}
            onSelect={(eq, item) => {
              const matched = item || localHistoryList.find((h) => h.equation === eq);
              if (matched) {
                handleLoadHistory(matched);
              }
            }}
          />

          {/* Saved Cut List UI */}
          {savedList.length > 0 && (
            <div
              className={`mx-2 sm:mx-0 p-3 rounded-xl border ${
                theme === 'dark' ? 'bg-black/40 border-[#333]' : 'bg-white/60 border-gray-300'
              }`}
            >
              <h3
                className={`text-xs font-bold uppercase tracking-wider mb-2 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-slate-500'
                }`}
              >
                Saved Cut List ({savedList.length})
              </h3>
              <div className="space-y-1.5 mb-3 max-h-48 overflow-y-auto pr-1">
                {savedList.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-2 rounded-lg border ${
                      theme === 'dark' ? 'bg-[#111] border-[#222]' : 'bg-white border-gray-200'
                    } shadow-sm`}
                  >
                    <span
                      className={`font-mono text-xs sm:text-sm break-words whitespace-pre-wrap flex-1 mr-2 ${
                        theme === 'dark' ? 'text-gray-200' : 'text-slate-700'
                      }`}
                    >
                      {item.data}
                    </span>
                    <button
                      onClick={() => setSavedList((prev) => prev.filter((i) => i.id !== item.id))}
                      className={`p-1 flex-shrink-0 rounded-md hover:bg-red-500/10 hover:text-red-500 transition-colors ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                      }`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    hapticFeedback();
                    setSavedList([]);
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border transition-colors ${
                    theme === 'dark'
                      ? 'border-[#333] hover:bg-[#222] text-gray-400'
                      : 'border-gray-300 hover:bg-gray-100 text-slate-500'
                  }`}
                >
                  CLEAR LIST
                </button>
                <button
                  onClick={handleShareList}
                  className="flex-[2] flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border border-transparent transition-colors hover:brightness-110"
                  style={{ color: accentColor, backgroundColor: `${accentColor}20` }}
                >
                  <Share className="w-4 h-4" />
                  SHARE
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

export default ScientificCalc;
