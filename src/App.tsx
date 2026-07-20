/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, ElementType, useEffect, useRef } from 'react';
import { Palette, Smartphone, AlertTriangle, Calculator, Triangle, LayoutGrid, Layers, Square, AlignJustify, MoveVertical, Mountain, Hammer, Tent, Home, Scale, Compass, Wrench, Ruler, Menu, X, Sun, Moon, Maximize, Truck, Star, GripVertical, Info, Plus, Settings, RotateCcw, Trash2, Share, ArrowRightLeft, AlignRight, ChevronUp, Columns, MoveHorizontal, Box, Thermometer, Droplets, Gauge, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { checkForAppUpdates } from './utils/appUpdateManager';
import { BookOpen } from 'lucide-react';
import { CodeHubModal } from './components/CodeHubModal';
import { JurisdictionId, JURISDICTIONS } from './data/buildingCodes';

// --- Types ---

type ToolId = 'tr' | 'calc' | 'st' | 'rk' | 'sq' | 'co' | 'fi' | 'df' | 'pl' | 'un' | 'ds' | 'wc' | 'rr' | 'si' | 'oc' | 'lv' | 'cm' | 'tl' | 'rm'| 'bc';
type unitMode = 'imp' | 'met';
type MetricUnit = 'm' | 'cm' | 'mm';
type Theme = 'dark' | 'light';
type TabId = 'QUICK TOOLS' | 'FRAMING' | 'MATERIALS & LOGISTICS' | 'LAYOUT' | 'ESTIMATOR' | 'STRUCTURAL' | 'FIELD UTILITIES';

interface Tool {
  id: ToolId;
  name: string;
  category: TabId;
}

const TOOLS: Tool[] = [
  { id: 'sq', name: 'Squaring & Area', category: 'QUICK TOOLS' },
  
  { id: 'st', name: 'Stair Master Pro', category: 'FRAMING' },
  { id: 'rr', name: 'Roof Rafters', category: 'FRAMING' },
  { id: 'df', name: 'Deck & Flooring', category: 'FRAMING' },
  { id: 'oc', name: 'OC Master', category: 'FRAMING' },
	{ id: 'rk', name: 'Rake Walls', category: 'FRAMING' },

	{ id: 'pl', name: 'Payload Tracker', category: 'MATERIALS & LOGISTICS' },
  { id: 'fi', name: 'Volume & Fill', category: 'MATERIALS & LOGISTICS' },
  { id: 'co', name: 'Concrete & Sonotube', category: 'MATERIALS & LOGISTICS' },
	
  { id: 'tl', name: 'Tile Layout', category: 'LAYOUT' },
  { id: 'si', name: 'Siding & Gable', category: 'ESTIMATOR' },
  { id: 'bc', name: 'Masonry Master', category: 'ESTIMATOR' },
	{ id: 'wc', name: 'Wall Calculator', category: 'ESTIMATOR' },
  { id: 'rm', name: 'Roofing Master', category: 'ESTIMATOR' },
	
  { id: 'ds', name: 'Span Master', category: 'STRUCTURAL' },

  { id: 'tr', name: 'Triangle Solver', category: 'FIELD UTILITIES' },
	{ id: 'calc', name: 'Construction Calc', category: 'FIELD UTILITIES' },
  { id: 'lv', name: 'Grade & Slope', category: 'FIELD UTILITIES' },
  { id: 'un', name: 'Unit Converter', category: 'FIELD UTILITIES' },
  { id: 'cm', name: 'Compound Miter', category: 'FIELD UTILITIES' },
];
const WOOD_WEIGHTS: Record<string, number> = { spruce: 28, cedar: 23, pt: 35, fir: 32 };
const QUICK_LOAD_DATA: Record<string, { label: string, density: number, unit: 'ft3' | 'ea' }> = {
  pt: { label: 'PT Lumber (2x4x8)', density: 10.2, unit: 'ea' }, // 35 lb/ft3 * 0.2916 ft3
  fir: { label: 'Douglas Fir (2x4x8)', density: 9.3, unit: 'ea' }, // 32 lb/ft3 * 0.2916 ft3
  soil: { label: 'Soil (90 lbs/ft³)', density: 90, unit: 'ft3' },
  concrete: { label: 'Concrete (150 lbs/ft³)', density: 150, unit: 'ft3' },
  gravel: { label: 'Gravel', density: 105, unit: 'ft3' },
};
const FILL_DENSITIES: Record<string, number> = { 
  concrete: 150, stone: 105, crun: 125, s57: 102.5, 
  pea: 102.5, sand: 102.5, soil: 90, mulch: 20.5 
};

const SPAN_TABLES: any = {
  joist: {
    spf: {
      '12': { '2x6': "10' 3\"", '2x8': "13' 6\"", '2x10': "16' 5\"", '2x12': "19' 1\"" },
      '16': { '2x6': "9' 0\"", '2x8': "11' 10\"", '2x10': "14' 4\"", '2x12': "16' 8\"" },
      '24': { '2x6': "7' 5\"", '2x8': "9' 8\"", '2x10': "11' 9\"", '2x12': "13' 8\"" }
    },
    syp: {
      '12': { '2x6': "10' 9\"", '2x8': "15' 1\"", '2x10': "18' 11\"", '2x12': "22' 4\"" },
      '16': { '2x6': "9' 9\"", '2x8': "13' 1\"", '2x10': "16' 5\"", '2x12': "19' 4\"" },
      '24': { '2x6': "8' 0\"", '2x8': "10' 8\"", '2x10': "13' 5\"", '2x12': "15' 10\"" }
    },
    fir: {
      '12': { '2x6': "10' 11\"", '2x8': "14' 5\"", '2x10': "17' 7\"", '2x12': "20' 5\"" },
      '16': { '2x6': "9' 11\"", '2x8': "12' 11\"", '2x10': "15' 10\"", '2x12': "18' 5\"" },
      '24': { '2x6': "8' 1\"", '2x8': "10' 7\"", '2x10': "12' 11\"", '2x12': "15' 0\"" }
    },
    lvl: {
      '12': { '2x6': "14' 5\"", '2x8': "19' 0\"", '2x10': "24' 2\"", '2x12': "29' 5\"" },
      '16': { '2x6': "13' 1\"", '2x8': "17' 3\"", '2x10': "22' 0\"", '2x12': "26' 9\"" },
      '24': { '2x6': "10' 8\"", '2x8': "14' 1\"", '2x10': "17' 11\"", '2x12': "21' 10\"" }
    }
  },
  timber: {
    fir: {
      '4x8': { standard: "12' 4\"", heavy: "10' 2\"" },
      '6x6': { standard: "11' 1\"", heavy: "9' 0\"" },
      '6x8': { standard: "15' 2\"", heavy: "12' 6\"" }
    }
  },
  header: {
    spf: {
      '3': 'Double 2x6',
      '4': 'Double 2x6',
      '5': 'Double 2x8',
      '6': 'Double 2x8',
      '8': 'Double 2x10',
      '10': 'Double 2x12',
      '12': 'Triple 2x12 or LVL',
      '16': '3-ply 11-7/8 LVL'
    }
  }
};

// --- Helper Functions ---

function parseF(v1: string, v2: string, v3: string, v4: string, mode: 'imp' | 'met', mUnit: string = 'mm'): number {
  const isI = mode === 'imp';
  const n1 = parseFloat(v1) || 0;
  const n2 = parseFloat(v2) || 0;
  const num = parseFloat(v3) || 0;
  const den = parseFloat(v4) || 0;
  const frac = den > 0 ? (num / den) : 0;

  if (isI) {
    return n1 + (n2 + frac) / 12; // Absolute Decimal Feet
  } else {
    const rawVal = n1 + (n2 + frac) / 100;
    const cleanUnit = (mUnit || 'mm').toLowerCase();
    if (cleanUnit === 'mm') return rawVal / 1000; // Converts mm to Meters
    if (cleanUnit === 'cm') return rawVal / 100;  // Converts cm to Meters
    return rawVal; // Returns Meters
  }
}

function formatF(dec: number, mode: unitMode, MetricUnit: MetricUnit = 'mm'): string {
  if (mode === 'met') {
    if (MetricUnit === 'm') return (dec / 1000).toFixed(3) + ' m';
    if (MetricUnit === 'cm') return (dec / 10).toFixed(1) + ' cm';
    return Math.round(dec) + ' mm';
  }
  const isNeg = dec < 0;
  const absDec = Math.abs(dec);
  let ft = Math.floor(absDec);
  let inT = (absDec - ft) * 12;
  let inc = Math.floor(inT);
  let fr = Math.round((inT - inc) * 32);
  if (fr === 32) { inc++; fr = 0; }
  if (inc === 12) { ft++; inc = 0; }
  
  const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : a;
  const simplify = (n: number, d: number) => {
    let divisor = gcd(n, d);
    return (n/divisor) + '/' + (d/divisor);
  };

  // 1. Standard Feet-Inches String
  const mainStr = `${ft}' ${inc}${fr > 0 ? ` ${simplify(fr, 32)}` : ''}"`;
  
  // 2. Calculate Clean Total Inches String
  const totalInchesRaw = absDec * 12;
  let totalWholeInches = Math.floor(totalInchesRaw);
  let totalFr = Math.round((totalInchesRaw - totalWholeInches) * 32);
  if (totalFr === 32) { totalWholeInches++; totalFr = 0; }
  
  const totalInchesStr = `${totalWholeInches}${totalFr > 0 ? ` ${simplify(totalFr, 32)}` : ''}"`;

  // 3. Combine them: 6' 6" (78")
  return `${isNeg ? '-' : ''}${mainStr} (${totalInchesStr})`;
}

function formatPrecision(dec: number, den: number): string {
  const absDec = Math.abs(dec);
  let inc = Math.floor(absDec);
  let fr = Math.round((absDec - inc) * den);
  
  if (fr === den) { inc++; fr = 0; }
  
  const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : a;
  const simplify = (n: number, d: number) => {
    let divisor = gcd(n, d);
    return (n / divisor) + '/' + (d / divisor);
  };

  if (fr === 0) return `${inc}"`;
  if (inc === 0) return `${simplify(fr, den)}"`;
  return `${inc} ${simplify(fr, den)}"`;
}

const formatF32 = (dec: number, p: number = 16) => formatPrecision(dec, p || 16);

function parseFraction(s: string): number {
  if (!s) return 0;
  const parts = s.trim().split(/\s+/);
  // Case: "1/2" or "5"
  if (parts.length === 1) {
    if (parts[0].includes('/')) {
      const [n, d] = parts[0].split('/').map(Number);
      return n / (d || 1);
    }
    return parseFloat(parts[0]) || 0;
  }
  // Case: "1 1/2"
  if (parts.length === 2) {
    const whole = parseFloat(parts[0]) || 0;
    const [n, d] = parts[1].split('/').map(Number);
    return whole + (n / (d || 1));
  }
  return parseFloat(s) || 0;
}

// TRUCK Data
const TRUCK_CAPACITIES = {
  'f150': { label: 'Ford F-150', cap: 2000 },
  'f250': { label: 'Ford F-250', cap: 3500 },
  'f350': { label: 'Ford F-350', cap: 5000 },
  'f450': { label: 'Ford F-450', cap: 6000 },
  'f550': { label: 'Ford F-550', cap: 10000 },
  'custom': { label: 'Custom (1500 lbs)', cap: 1500 }
};

// 3. DISCLAIMER COMPONENT
const Disclaimer = () => (
  <div className="mt-8 p-4 bg-[#111] border border-[#222] rounded-lg text-[0.65rem] text-gray-400 leading-relaxed text-center">
    <p className="font-bold uppercase mb-1 text-gray-300">Disclaimer</p>
    <p>
      Calculations provided by Squared App are estimates for reference only. Structural 
      requirements vary by local building codes (OBC) and specific engineering 
      requirements. Always verify load requirements with a licensed professional 
      or local building authority before starting construction.
    </p>
  </div>
);

// ... (Helper functions end here)

// --- Components ---

export default function App() { // <--- THIS LINE IS CRITICAL (Start the App)

	const [isSettingsOpen, setIsSettingsOpen] = useState(false);
	const [keepAwake, setKeepAwake] = useState(true);
  const [haptics, setHaptics] = useState(true);
	// --- 1. GLOBAL HAPTICS ENGINE ---
  const lastVibe = useRef<number>(0);

	useEffect(() => {
    // Pass true for Immediate (Full Screen block), false for Flexible background download
    checkForAppUpdates(true);
  }, []);

  useEffect(() => {
    if (!haptics) return; 

    const handleGlobalClick = (e: MouseEvent | TouchEvent) => {
      const target = (e.target as HTMLElement).closest('button, input, select, .cursor-pointer');
      if (target && 'vibrate' in navigator) {
        const now = Date.now();
        // Prevent double-buzz from synthetic tap events
        if (now - lastVibe.current > 50) { 
            navigator.vibrate(15); 
            lastVibe.current = now;
        }
      }
    };

    document.addEventListener('click', handleGlobalClick, { capture: true });
    return () => document.removeEventListener('click', handleGlobalClick, { capture: true });
  }, [haptics]);

  // --- 2. SCREEN WAKE LOCK ENGINE ---
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  useEffect(() => {
    const requestWakeLock = async () => {
      if (keepAwake && 'wakeLock' in navigator) { // Hooked to your 'keepAwake' state
        try {
          wakeLockRef.current = await navigator.wakeLock.request('screen');
        } catch (err) {
          console.log("Wake Lock error/denied:", err);
        }
      } else if (!keepAwake && wakeLockRef.current) {
        wakeLockRef.current.release();
        wakeLockRef.current = null;
      }
    };

    requestWakeLock();

    const handleVisibilityChange = () => {
      if (keepAwake && document.visibilityState === 'visible') {
        requestWakeLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (wakeLockRef.current) {
        wakeLockRef.current.release();
      }
    };
  }, [keepAwake]);
	
	// --- UPGRADED: Accessibility & UI Scale ---
  const [textSize, setTextSize] = useState(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('squared_text_size') : null;
    return saved || 'normal'; // 'normal', 'large', or 'xlarge'
  });

  useEffect(() => {
    localStorage.setItem('squared_text_size', textSize);
  }, [textSize]);
	
	const [globalPrecision, setGlobalPrecision] = useState('16');
	
	const [accentColor, setAccentColor] = useState(() => {
    return typeof window !== 'undefined' ? localStorage.getItem('squared_accent') || '#00d2ff' : '#00d2ff';
  });
	useEffect(() => {
		document.documentElement.style.setProperty('--accent-color', accentColor);
    localStorage.setItem('squared_accent', accentColor);
	}, [accentColor]);
	
	
	const [mmMaterial, setMmMaterial] = useState<'brick' | 'cmu'>('brick');
  const [activeTool, setActiveTool] = useState<ToolId>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('squared_activeTool') : null;
    return (saved as ToolId) || 'tr';
  });
	const [includePitch, setIncludePitch] = useState(false);
	const toggleOcSpacing = () => {
		setOcSpacing(prev => prev === '16' ? '24' : '16');
	};

  const [precision, setPrecision] = useState<8 | 16 | 32>(16);
  // This uses the 'precision' state defined above
  const [truckModel, setTruckModel] = useState('f150');
  const [showDisclaimer, setshowDisclaimer] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('QUICK TOOLS');
  const [searchQuery, setSearchQuery] = useState('');
  const [joistCantilever, setJoistCantilever] = useState('0');
  const [recentTools, setRecentTools] = useState<ToolId[]>([]);
  const [unitMode, setunitMode] = useState<unitMode>('imp');
	const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  
  // Persistent Jurisdiction State
  const [jurisdiction, setJurisdiction] = useState<JurisdictionId>(() => {
    return (localStorage.getItem('squared_jurisdiction') as JurisdictionId) || 'can_obc';
  });

  const handleJurisdictionChange = (newJur: JurisdictionId) => {
    setJurisdiction(newJur);
    localStorage.setItem('squared_jurisdiction', newJur);
    
    // Optional: Auto-switch units when region changes if desired
    setUnitMode(JURISDICTIONS[newJur].defaultUnit);
  };
  const [inputUnits, setInputUnits] = useState<Record<string, MetricUnit>>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('squared_input_units') : null;
    return saved ? JSON.parse(saved) : {};
  });

  const setInputUnit = (key: string, unit: MetricUnit) => {
    setInputUnits(prev => {
      const next = { ...prev, [key]: unit };
      localStorage.setItem('squared_input_units', JSON.stringify(next));
      return next;
    });
  };

  const getUnitProps = (key: string) => ({
    unit: inputUnits[activeTool + '_' + key] || 'mm',
    setUnit: (u: MetricUnit) => setInputUnit(activeTool + '_' + key, u)
  });

  const [theme, setTheme] = useState<Theme>('dark');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
	// 1. Create a reference to attach to our menu container
  const menuRef = useRef(null);

  // 2. Add the listener effect
  useEffect(() => {
    const handleClickOutside = (event) => {
      // If the menu is open, AND the click happened outside the menuRef container...
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false); // ...close the menu!
      }
    };

    // Only attach the event listener if the menu is actually open
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside); // For mobile taps
    }

    // Cleanup the event listeners when the component unmounts or menu closes
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isMenuOpen]);
  const [showDocModal, setShowDocModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showResetConfirmModal, setShowResetConfirmModal] = useState(false);

  const TOOL_DOCS: Record<string, { def: string, ex: string, tip: string }> = {
    wc: {
      def: "Calculates every piece of a wall from framing to finish paint.",
      ex: "For a 10' wall at 8' high, input 120\" Length and 96\" Height.",
      tip: "Remember to check the Top Plate Lap (3.5\" or 5.5\") to ensure your corner tie-in is structural."
    },
    tr: {
      def: "Solves for any side or angle of a right-angle triangle.",
      ex: "Input a 6\" Pitch and a 120\" Run to get your Rafter Length (Diagonal) and Rise.",
      tip: "Use this to check the \"Square\" of your foundations by using the 3-4-5 rule (A=3, B=4, Diagonal should be 5)."
    },
    calc: {
      def: "A dedicated feet-inch-fraction calculator that handles structural math without needing decimal conversions.",
      ex: "Input 8' 4-1/2\" + 2' 7-3/8\".",
      tip: "Use this for \"Running Dimensions\" on a tape measure. It prevents the tiny math errors that add up to a 1/2\" mistake over a long wall."
    },
    sq: {
      def: "Calculates surface area for materials and provides diagonal measurements to ensure a project is perfectly square.",
      ex: "Input a 12' Width and 16' Length.",
      tip: "The \"Diagonal\" output is your best friend. If your foundation's two diagonals don't match the app's output exactly, your build is \"out of square.\""
    },
    rr: {
      def: "Calculates the exact cut length for common rafters including the birdsmouth and plumb cut.",
      ex: "Input your Run (half the span) and your Pitch (e.g., 6/12).",
      tip: "The app calculates the \"Theoretical Length.\" Remember to subtract half the thickness of your ridge board from the final cut."
    },
    rm: {
      def: "A running tally for estimating full roofing projects.",
      ex: "Add a 20x40 Rectangle and two 15' wide Gables.",
      tip: "Use \"On-Roof Mode\" if you are measuring sloped surfaces directly with your tape."
    },
    df: {
      def: "Converts structural framing into a clean, lumberyard-ready order list.",
      ex: "Instead of typing 6.75 feet for a post, you can now input 6' 9\" exactly as it appears on your tape measure.",
      tip: "The Post Yield logic is a huge money saver. Beam Aggregation sums up all plies into one single order line."
    },
    si: {
      def: "Calculates standard and gable walls with specific deductions for windows and doors.",
      ex: "Selecting 'Window' for a 36\"x48\" opening adds 14 linear feet of J-Channel and 3 linear feet of Drip Edge to your order.",
      tip: "Use the Gable input to enter either the Pitch (e.g., 8/12) or the Peak Height. The app will automatically clear the other field to ensure your square footage and J-channel counts are 100% accurate. Window vs. Door: Selecting Door ensures the app doesn't order J-channel for the floor, saving you money and material on every entry point."
    },
    oc: {
      def: "Primarily used for equal spacing of Posts, Balusters, and Lighting Fixtures across a set distance.",
      ex: "Input a 20' wall with 16\" OC spacing.",
      tip: "Switch to \"Equal Spacing\" mode to ensure your deck balusters are perfectly centered with no \"dead\" space at the ends."
    },
    st: {
      def: "Calculates stringer cuts and riser heights.",
      ex: "Input your Total Rise (finished floor to finished floor).",
      tip: "Input Warning: You must input Top and Bottom Floor Thickness (e.g., 3/4\" hardwood or 1/2\" tile). If you don't account for floor thickness, your first and last steps will be different heights than the rest, creating a major trip hazard and a code violation."
    },
    co: {
      def: "Calculates volume for slabs and piers, providing exact bag counts and reinforcement material lists.",
      ex: "For a 10' x 10' slab at 4\" deep, the app will suggest approximately 1.23 Cubic Yards or 56 bags (80lb).",
      tip: "REBAR CUT LOGIC: The app calculates sticks based on whole cuts (StickLength / (Depth + 6\" hook)). Always check if your supplier stocks 20' lengths; they are efficient but harder to transport."
    },
    pl: {
      def: "Weight and volume calculator for hauling materials.",
      ex: "Select \"Crushed Stone\" and input 2 Cubic Yards.",
      tip: "Always check your vehicle's GVWR (Gross Vehicle Weight Rating) against the \"Total Weight\" output to avoid overloading your truck or trailer."
    },
    un: {
      def: "Automatically scales all hardware, lumber, and overlap math between Imperial and Metric systems.",
      ex: "In Metric Mode, the app uses centimeters (cm) for board overlaps to give you the precision needed for fine siding work like shiplap or cedar shingles.",
      tip: "Decking: All structural framing—including your 6x6 posts and 3-ply beams—will display in meters and cm to match international building standards."
    },
    rk: {
      def: "Calculates stud lengths for sloped or rake walls.",
      ex: "Input the wall length and the pitch (e.g., 4/12) to get a cut list for every stud.",
      tip: "The app calculates the 'long point' of the cut. Remember to account for the top plate angle when marking."
    },
    lv: {
      def: "Calculates percentage of slope and total grade drop.",
      ex: "Input a 50' run and a 2' drop to find the slope percentage.",
      tip: "Standard drainage for landscape usually requires a minimum 2% slope (1/4\" per foot)."
    },
    tl: {
      def: "Calculates tile layout and centering for floors and walls.",
      ex: "Input your total area and tile size (e.g., 12\"x12\").",
      tip: "The app automatically centers the layout to avoid tiny 'sliver' cuts at the edges."
    },
    ds: {
      def: "Calculates maximum allowable spans for floor joists and rafters.",
      ex: "Select your wood species and spacing to see how far a 2x10 can safely span.",
      tip: "Always verify with local building codes as snow loads and occupancy types change requirements."
    },
    fi: {
      def: "Calculates volume for loose fill materials like mulch, gravel, or topsoil.",
      ex: "Input an area of 200 sq ft at 3\" deep.",
      tip: "Material is usually sold by the Cubic Yard. 1 Cubic Yard covers 324 sq ft at 1\" deep."
    },
    ph: {
      def: "Provides recommended pilot hole sizes for various screw types.",
      ex: "Select a #8 Wood Screw to see the bit size for hard vs soft wood.",
      tip: "Using the correct pilot hole prevents splitting and ensures maximum pull-out strength."
    },
    vd: {
      def: "Calculates voltage drop for electrical wire runs.",
      ex: "Input 120V, 15A, and a 100' run of #14 copper wire.",
      tip: "NEC recommends keeping voltage drop under 3% for branch circuits to prevent equipment damage."
    },
    cm: {
      def: "Calculates miter and bevel angles for crown molding and compound cuts.",
      ex: "Input a 45° wall corner and a 38° spring angle.",
      tip: "Always use a test piece of scrap material before cutting your expensive finish trim."
    },
    sp: {
      def: "Calculates equal spacing for balusters, fence pickets, or shelves.",
      ex: "Input a 96\" opening and 3.5\" wide pickets with a max 4\" gap.",
      tip: "The app solves for the exact gap to ensure every space is identical."
    },
    ar: {
      def: "Uses Augmented Reality to project a vertical plumb line.",
      ex: "Point your camera at a wall to check for plumb or project a layout line.",
      tip: "AR accuracy depends on lighting and surface texture. Use a physical level for final verification."
    }
  };

  // Input States
  const [angle, setAngle] = useState('90');
  const [op, setOp] = useState<'add' | 'sub' | 'mul' | 'div'>('add');
  const [subMode, setSubMode] = useState<'standard' | 'max'>('standard');
  const [a1, setA1] = useState(''); const [a2, setA2] = useState(''); const [a3, setA3] = useState(''); const [a4, setA4] = useState('');
  const [b1, setB1] = useState(''); const [b2, setB2] = useState(''); const [b3, setB3] = useState(''); const [b4, setB4] = useState('');
  const [c1, setC1] = useState(''); const [c2, setC2] = useState(''); const [c3, setC3] = useState(''); const [c4, setC4] = useState('');
  const [d1, setD1] = useState(''); const [d2, setD2] = useState(''); const [d3, setD3] = useState(''); const [d4, setD4] = useState('');
  const [savedLayouts, setSavedLayouts] = useState<{ id: number; run: string; rise: string; diag: string }[]>([]);
	const [qty, setQty] = useState(''); const [qty2, setQty2] = useState(''); const [qty3, setQty3] = useState(''); const [qty4, setQty4] = useState('');
  const [stairType, setStairType] = useState<'flush' | 'drop'>('drop');
  const [stairMode, setStairMode] = useState<'structural' | 'landscape'>('structural');
  const [stepNudge, setStepNudge] = useState(0);
  const [waste, setWaste] = useState('');
  const [totalLoad, settotalLoad] = useState(0);
  const [isTrailer, setisTrailer] = useState(false);
  const [liquidQty, setLiquidQty] = useState('');
  const [quickLoadMaterial, setQuickLoadMaterial] = useState('soil');
  const [sonoDiameterMode, setSonoDiameterMode] = useState<string>('12');
useEffect(() => {
  const hasAgreed = localStorage.getItem('squared_disclaimer_accepted');
  if (!hasAgreed) {
    setshowDisclaimer(true);
  }
}, []);

const handleAccept = () => {
  localStorage.setItem('squared_disclaimer_accepted', 'true');
  setshowDisclaimer(false);
};

  // Concrete Tool Specific States
  const [slabInputs, setSlabInputs] = useState(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('slab_inputs') : null;
    return saved ? JSON.parse(saved) : {
      a1: '', a2: '0', a3: '0', a4: '1',
      b1: '', b2: '0', b3: '0', b4: '1',
      d1: '', d2: '0', d3: '0', d4: '1',
      waste: '0', qty: '1',
      showMesh: false, showHorizRebar: false, showVertRebar: false,
      rebarHSpacing: '12', rebarVSpacing: '12'
    };
  });

  const [sonoInputs, setSonoInputs] = useState(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('sono_inputs') : null;
    return saved ? JSON.parse(saved) : {
      a1: '0', a2: '12', a3: '0', a4: '1',
      b1: '4', b2: '0', b3: '0', b4: '1',
      waste: '10', qty: '1',
      showVertRebar: true,
      rebarVSpacing: '3',
      diameterMode: '12'
    };
  });
	
	const [wallInputs, setWallInputs] = useState(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('squared_wall_inputs') : null;
    return saved ? JSON.parse(saved) : {
      corners: '4',
      isAddition: false,
      waterproofMode: 'blueskin-dimple', 
      waterproofCoverage: 'full', 
    };
  });

	const [footingInputs, setFootingInputs] = useState(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('squared_footing_inputs') : null;
    return saved ? JSON.parse(saved) : {
      lenFt: '', lenIn: '', lenNum: '', lenDen: '1',
      widMode: '24', customWidIn: '',
      depIn: '8', corners: '4',
      isAddition: false, onBedrock: false,
      rebarRuns: '2', rebarSize: '15M',
      cornerSteelMode: 'bent' 
    };
  });
	
	// Self-Saving Engines
  useEffect(() => {
    localStorage.setItem('squared_wall_inputs', JSON.stringify(wallInputs));
  }, [wallInputs]);

  useEffect(() => {
    localStorage.setItem('squared_footing_inputs', JSON.stringify(footingInputs));
  }, [footingInputs]);

  useEffect(() => {
    localStorage.setItem('slab_inputs', JSON.stringify(slabInputs));
  }, [slabInputs]);

  useEffect(() => {
    localStorage.setItem('sono_inputs', JSON.stringify(sonoInputs));
  }, [sonoInputs]);

  // Favorites & Sorting State
  const [favorites, setFavorites] = useState<ToolId[]>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('squared_favorites') : null;
    return saved ? JSON.parse(saved) : [];
  });
  const [toolOrder, setToolOrder] = useState<ToolId[]>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('squared_toolOrder') : null;
    return saved ? JSON.parse(saved) : [];
  });
  const [draggedTool, setDraggedTool] = useState<ToolId | null>(null);

  useEffect(() => {
    localStorage.setItem('squared_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('squared_toolOrder', JSON.stringify(toolOrder));
  }, [toolOrder]);

  const toggleFavorite = (e: React.MouseEvent, id: ToolId) => {
    e.stopPropagation();
	setFavorites(prev => {
      // Check if it's already there
      const next = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id];
      localStorage.setItem('squared_favorites', JSON.stringify(next));
      return next;
	});
  };

  const handleDragStart = (id: ToolId) => {
    setDraggedTool(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetId: ToolId) => {
    if (!draggedTool || draggedTool === targetId) return;
    const newOrder = [...toolOrder];
    const draggedIdx = newOrder.indexOf(draggedTool);
    const targetIdx = newOrder.indexOf(targetId);
    
    if (draggedIdx !== -1 && targetIdx !== -1) {
      newOrder.splice(draggedIdx, 1);
      newOrder.splice(targetIdx, 0, draggedTool);
      setToolOrder(newOrder);
    }
    setDraggedTool(null);
  };

  // Wall Calculator State
  const [loadCategory, setLoadCategory] = useState<'non-load' | 'roof-only' | 'floor-and-roof'>('non-load');
  const [openings, setOpenings] = useState<{ type: 'door' | 'window'; w: number; h: number }[]>([]);
  const [ocSpacing, setOcSpacing] = useState('16');
  const [corners, setCorners] = useState('2');
  const [showFinishing, setshowFinishing] = useState(true);
  const [showScrewLayout, setshowScrewLayout] = useState(false);
  const [showTribInfo, setShowTribInfo] = useState(false);
  const [showOptimization, setShowOptimization] = useState(true);
  const [plateCount, setPlateCount] = useState('3');
  const [framingSize, setFramingSize] = useState<'2x4' | '2x6' | '2x8'>('2x4');
  const [wallSheetingSides, setWallSheetingSides] = useState<'none' | 'one' | 'two'>('one');
  const [newOpType, setNewOpType] = useState<'door' | 'window'>('door');
  const [newOpW, setNewOpW] = useState('');
  const [newOpH, setNewOpH] = useState('');

	const [sensorActive, setSensorActive] = useState(false);

	const [openingType, setOpeningType] = useState('window');

  // Rafter Calculator State
  const [roofPitch, setRoofPitch] = useState('6'); // Default to 6/12
  const [rafterStock, setRafterStock] = useState('2x6'); // Default to 2x6
  const [overhang, setOverhang] = useState('12');
  const [seatWidthV1, setSeatWidthV1] = useState('0'); const [seatWidthV2, setSeatWidthV2] = useState('4'); const [seatWidthV3, setSeatWidthV3] = useState('1'); const [seatWidthV4, setSeatWidthV4] = useState('8');
  const [ridgeV1, setRidgeV1] = useState('0'); const [ridgeV2, setRidgeV2] = useState('1'); const [ridgeV3, setRidgeV3] = useState('1'); const [ridgeV4, setRidgeV4] = useState('2');

  // Deck Framing State
  const [deckBoardWidth, setDeckBoardWidth] = useState('5.5');
  const [deckJoistSpacing, setDeckJoistSpacing] = useState('16');
  const [customDeckBoardW1, setCustomDeckBoardW1] = useState('0');
  const [customDeckBoardW2, setCustomDeckBoardW2] = useState('5');
  const [customDeckBoardW3, setCustomDeckBoardW3] = useState('1');
  const [customDeckBoardW4, setCustomDeckBoardW4] = useState('2');

  // Siding State
  const [wallType, setWallType] = useState<'rectangular' | 'gable'>('rectangular');
  const [sidingType, setSidingType] = useState('8-inch-lap');
  const [sidingOverlap, setSidingOverlap] = useState(() => localStorage.getItem('squared_siding_overlap') || '1');
  const [boardWidth, setBoardWidth] = useState(() => localStorage.getItem('squared_board_width') || '8');
  const [sidingBoardLength, setSidingBoardLength] = useState(() => localStorage.getItem('squared_siding_board_length') || '12');
  const [sidingHorizontalOverlap, setSidingHorizontalOverlap] = useState(() => localStorage.getItem('squared_siding_h_overlap') || '2');
  const [sidingInsideCorners, setSidingInsideCorners] = useState(() => parseInt(localStorage.getItem('squared_siding_in_corners') || '0'));
  const [sidingOutsideCorners, setSidingOutsideCorners] = useState(() => parseInt(localStorage.getItem('squared_siding_out_corners') || '0'));
  const [sidingSections, setSidingSections] = useState<{ id: string; type: 'rect' | 'gable'; w: number; h: number; openings: { id: string; w: number; h: number }[] }[]>(() => {
    const saved = localStorage.getItem('squared_siding_sections');
    try {
        const parsed = saved ? JSON.parse(saved) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return []; // Failsafe for corrupted storage strings
    }
  });
  const [sidingOpenings, setSidingOpenings] = useState<{ id: string; type: 'door' | 'window'; w: number; h: number }[]>(() => {
    const saved = localStorage.getItem('squared_siding_openings');
    return saved ? JSON.parse(saved) : [];
  });
  const [gableInputMode, setGableInputMode] = useState<'pitch' | 'height'>('pitch');

  useEffect(() => {
    localStorage.setItem('squared_siding_overlap', sidingOverlap);
    localStorage.setItem('squared_board_width', boardWidth);
    localStorage.setItem('squared_siding_board_length', sidingBoardLength);
    localStorage.setItem('squared_siding_h_overlap', sidingHorizontalOverlap);
    localStorage.setItem('squared_siding_in_corners', sidingInsideCorners.toString());
    localStorage.setItem('squared_siding_out_corners', sidingOutsideCorners.toString());
    localStorage.setItem('squared_siding_sections', JSON.stringify(sidingSections));
    localStorage.setItem('squared_siding_openings', JSON.stringify(sidingOpenings));
  }, [sidingOverlap, boardWidth, sidingBoardLength, sidingHorizontalOverlap, sidingInsideCorners, sidingOutsideCorners, sidingSections, sidingOpenings]);

  // Tile Layout State
  const [roomLenV1, setRoomLenV1] = useState('10'); const [roomLenV2, setRoomLenV2] = useState('0'); const [roomLenV3, setRoomLenV3] = useState('0'); const [roomLenV4, setRoomLenV4] = useState('1');
  const [roomWidV1, setRoomWidV1] = useState('10'); const [roomWidV2, setRoomWidV2] = useState('0'); const [roomWidV3, setRoomWidV3] = useState('0'); const [roomWidV4, setRoomWidV4] = useState('1');
  const [tileLenV1, setTileLenV1] = useState('0'); const [tileLenV2, setTileLenV2] = useState('12'); const [tileLenV3, setTileLenV3] = useState('0'); const [tileLenV4, setTileLenV4] = useState('1');
  const [tileWidV1, setTileWidV1] = useState('0'); const [tileWidV2, setTileWidV2] = useState('12'); const [tileWidV3, setTileWidV3] = useState('0'); const [tileWidV4, setTileWidV4] = useState('1');
  const [groutV1, setGroutV1] = useState('0'); const [groutV2, setGroutV2] = useState('0'); const [groutV3, setGroutV3] = useState('1'); const [groutV4, setGroutV4] = useState('8');

  const [rebarHSpacing, setRebarHSpacing] = useState('12');
  const [rebarVSpacing, setRebarVSpacing] = useState('12');

  // Global UI State
  const [showReference, setshowReference] = useState(false);
  const [recentSessions, setRecentSessions] = useState<{ tool: string, result: string, timestamp: number }[]>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('squared_history') : null;
    return saved ? JSON.parse(saved) : [];
  });
  const [activeInput, setActiveInput] = useState<{ 
    setV?: (v: string) => void,
    setNum?: (v: string) => void,
    setDen?: (v: string) => void
  } | null>(null);

  useEffect(() => {
    localStorage.setItem('squared_history', JSON.stringify(recentSessions));
  }, [recentSessions]);

  const saveSession = (toolName: string, result: string) => {
    const newSession = { tool: toolName, result, timestamp: Date.now() };
    setRecentSessions(prev => [newSession, ...prev].slice(0, 20));
  };

  const REFERENCE_CHART = [
    { f: '1/16', d: '0.0625', m: '1st mark', n: '1', den: '16' },
    { f: '1/8', d: '0.125', m: '2nd mark', n: '1', den: '8' },
    { f: '3/16', d: '0.1875', m: '3rd mark', n: '3', den: '16' },
    { f: '1/4', d: '0.25', m: '1st quarter', n: '1', den: '4' },
    { f: '5/16', d: '0.3125', m: '5th mark', n: '5', den: '16' },
    { f: '3/8', d: '0.375', m: '6th mark', n: '3', den: '8' },
    { f: '7/16', d: '0.4375', m: '7th mark', n: '7', den: '16' },
    { f: '1/2', d: '0.5', m: 'Half inch', n: '1', den: '2' },
    { f: '9/16', d: '0.5625', m: '9th mark', n: '9', den: '16' },
    { f: '5/8', d: '0.625', m: '10th mark', n: '5', den: '8' },
    { f: '11/16', d: '0.6875', m: '11th mark', n: '11', den: '16' },
    { f: '3/4', d: '0.75', m: '3/4 inch', n: '3', den: '4' },
    { f: '13/16', d: '0.8125', m: '13th mark', n: '13', den: '16' },
    { f: '7/8', d: '0.875', m: '14th mark', n: '7', den: '8' },
    { f: '15/16', d: '0.9375', m: '15th mark', n: '15', den: '16' },
    { f: '1', d: '1.0', m: 'Full inch', n: '1', den: '1' },
  ];

  // Roofing Master State
  const [roofSections, setRoofSections] = useState<{
    id: string;
    type: 'rect' | 'tri' | 'trap';
    w1: number;
    w2: number;
    h: number;
    pitch: number;
    qty: number;
  }[]>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('squared_roof_sections') : null;
    return saved ? JSON.parse(saved) : [];
  });
  const [roofNailsPerShingle, setRoofNailsPerShingle] = useState<4 | 6>(4);
  const [roofMaterialType, setRoofMaterialType] = useState<'asphalt' | 'tile' | 'cedar'>('asphalt');
  const [rmType, setRmType] = useState<'rect' | 'tri' | 'trap'>('rect');
  const [rmMode, setRmMode] = useState<'pitch' | 'height'>('pitch');
	const [roofMode, setRoofMode] = useState<'on-roof' | 'plan'>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('squared_roof_mode') : null;
    return (saved === 'on-roof' || saved === 'plan') ? saved : 'on-roof';
  });
  const [roofRollSize, setRoofRollSize] = useState<33 | 66>(33);

  useEffect(() => {
    localStorage.setItem('squared_roof_sections', JSON.stringify(roofSections));
    localStorage.setItem('squared_roof_mode', roofMode);
  }, [roofSections, roofMode]);

  const addRoofSection = () => {
    const subDivisor = unitMode === 'imp' ? 12 : 100;
    
    // Compile Base Width
    const ftA = parseFloat(a1) || 0;
    const inA = parseFloat(a2) || 0;
    const fracA = parseFloat(a4) ? (parseFloat(a3) || 0) / parseFloat(a4) : 0;
    const w1 = ftA + (inA + fracA) / subDivisor;

    // Compile Run Length
    const ftB = parseFloat(b1) || 0;
    const inB = parseFloat(b2) || 0;
    const fracB = parseFloat(b4) ? (parseFloat(b3) || 0) / parseFloat(b4) : 0;
    const h = ftB + (inB + fracB) / subDivisor;

    // Compile Top Width (for Trapezoids)
    const ftC = parseFloat(c1) || 0;
    const inC = parseFloat(c2) || 0;
    const fracC = parseFloat(c4) ? (parseFloat(c3) || 0) / parseFloat(c4) : 0;
    const w2 = ftC + (inC + fracC) / subDivisor;

    const qtyVal = parseInt(rmQty) || 1;
    const pitchVal = parseFloat(rmPitch) || 0;

    if (w1 > 0 && h > 0) {
      setRoofSections([...roofSections, { 
        id: Date.now().toString(), 
        type: rmType, 
        w1, 
        w2, 
        h, 
        pitch: pitchVal, 
        qty: qtyVal 
      }]);
      
      // Clear inputs for the next entry
      setA1(''); setA2(''); setA3(''); setA4('');
      setB1(''); setB2(''); setB3(''); setB4('');
      setC1(''); setC2(''); setC3(''); setC4('');
    }
  };

  const clearRoofData = () => {
    setRoofSections([]);
  };

  const [rmPitch, setRmPitch] = useState('6');
  const [rmQty, setRmQty] = useState('1');

  // OC Master State
  const [ocMode, setOcMode] = useState<'equal' | 'structural' | 'baluster'>('structural');
  const [balustersubMode, setBalustersubMode] = useState<'code' | 'fixed'>('code');
  const [maxOpV1, setMaxOpV1] = useState('0');
  const [maxOpV2, setMaxOpV2] = useState('3');
  const [maxOpV3, setMaxOpV3] = useState('7');
  const [maxOpV4, setMaxOpV4] = useState('8');
  const [desiredGapV1, setDesiredGapV1] = useState('0');
  const [desiredGapV2, setDesiredGapV2] = useState('3');
  const [desiredGapV3, setDesiredGapV3] = useState('0');
  const [desiredGapV4, setDesiredGapV4] = useState('1');
  const [postWidthV1, setPostWidthV1] = useState('0');
  const [postWidthV2, setPostWidthV2] = useState('5');
  const [postWidthV3, setPostWidthV3] = useState('1');
  const [postWidthV4, setPostWidthV4] = useState('2');
  const [FixedSpacing, setFixedSpacing] = useState(false);
  const [snowLoad, setSnowLoad] = useState('0');
  const [cantileverDistance, setCantileverDistance] = useState('0');
  const [deflectionLimit, setDeflectionLimit] = useState<'L360' | 'L480' | 'L600'>('L360');
  const [isWetService, setisWetService] = useState(false);
  const [isMarine, setisMarine] = useState(false);
  const [hasPointLoad, setHasPointLoad] = useState(false);
  const [pointLoadWeight, setPointLoadWeight] = useState('500');
  const [pointLoadLocation, setPointLoadLocation] = useState('4');
  const [headerWallType, setHeaderWallType] = useState<'non-load' | 'roof-only' | 'floor-only' | 'full-load'>('roof-only');
  const [hasHeaderPointLoad, setHasHeaderPointLoad] = useState(false);
  const [woodGrade, setwoodGrade] = useState<'no2' | 'select'>('no2');
  const [woodSpecies, setWoodSpecies] = useState<'spf' | 'syp' | 'fir' | 'lvl'>('spf');

  // --- UPGRADED: Unified Deck Master State ---
  const [deckInputs, setDeckInputs] = useState(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('squared_deck_inputs') : null;
    return saved ? JSON.parse(saved) : {
      mode: 'surface', 
      boardWidthMode: '5.5',
      joistSpacing: '16',
      beamLengthFt: '', beamLengthIn: '0',
      beamSpan: '', beamCantilever: '', beamPlies: '3', beamCount: '1',
      joistSpanFt: '', joistSpanIn: '0', joistMaterial: '2x8',
      postHeightFt: '3', postHeightIn: '0', postSize: '6x6',
      fasciaMaterial: '2x12', ledgerCount: '1', postCountPerBeam: '',
      overrideBeamLen: false, overrideJoistSpan: false, 
      overrideJoistMat: false, overridePostCount: false
    };
  });

  // The Single Clean LocalStorage Engine
  useEffect(() => {
    localStorage.setItem('squared_deck_inputs', JSON.stringify(deckInputs));
  }, [deckInputs]);
	
  // Reactive Framing Inputs for Deck Tool (100% Metric Safe)
  useEffect(() => {
    if (activeTool !== 'df') return;
    
    const isI = unitMode === 'imp';
    const valA = parseF(a1, a2, a3, a4, unitMode, inputUnits['df_a'] || 'mm');
    const valB = parseF(b1, b2, b3, b4, unitMode, inputUnits['df_b'] || 'mm');
    
    let jCantileverIn = parseFloat(deckInputs.beamCantilever) || (isI ? 16 : 400); 
    if (!isI && jCantileverIn <= 24) jCantileverIn = 400; // Auto-correct
    const jCantileverFt = isI ? jCantileverIn / 12 : jCantileverIn / 1000;

    setDeckInputs(prev => {
      let next = { ...prev };
      let changed = false;

      // 1. Beam Length syncs with Deck Width (valB)
      if (!prev.overrideBeamLen) {
        const ft = Math.floor(valB);
        const inch = Math.round((valB - ft) * (isI ? 12 : 100));
        if (next.beamLengthFt !== ft.toString() || next.beamLengthIn !== inch.toString()) {
           next.beamLengthFt = ft.toString();
           next.beamLengthIn = inch.toString();
           changed = true;
        }
      }

      // 2. Joist Span syncs with Deck Length - Cantilever
      if (!prev.overrideJoistSpan) {
        const calculatedSpan = Math.max(0, valA - jCantileverFt);
        const ft = Math.floor(calculatedSpan);
        const inch = Math.round((calculatedSpan - ft) * (isI ? 12 : 100));
        if (next.joistSpanFt !== ft.toString() || next.joistSpanIn !== inch.toString()) {
           next.joistSpanFt = ft.toString();
           next.joistSpanIn = inch.toString();
           changed = true;
        }
      }

      // 3. Joist Material Auto-Select
      if (!prev.overrideJoistMat) {
        const spanWork = isI 
          ? (parseFloat(next.joistSpanFt) * 12) + parseFloat(next.joistSpanIn)
          : (parseFloat(next.joistSpanFt) * 1000) + (parseFloat(next.joistSpanIn) * 10);
          
        let material = '2x8';
        if (isI) {
          if (spanWork < 120) material = '2x8';
          else if (spanWork <= 168) material = '2x10';
          else material = '2x12';
        } else {
          if (spanWork < 3000) material = '2x8';
          else if (spanWork <= 4200) material = '2x10';
          else material = '2x12';
        }
        
        if (next.joistMaterial !== material) {
           next.joistMaterial = material;
           changed = true;
        }
      }

      // 4. Post Count Auto-Select (Fixed metric division)
      if (!prev.overridePostCount) {
        const totalSpanWork = isI 
          ? parseFloat(next.beamLengthFt) + (parseFloat(next.beamLengthIn) / 12)
          : parseFloat(next.beamLengthFt) + (parseFloat(next.beamLengthIn) / 100);
          
        const count = Math.ceil((totalSpanWork || 0) / (isI ? 7 : 2.1)) + 1;
        if (next.postCountPerBeam !== count.toString()) {
           next.postCountPerBeam = count.toString();
           changed = true;
        }
      }

      return changed ? next : prev;
    });
  }, [activeTool, a1, a2, a3, a4, b1, b2, b3, b4, unitMode, deckInputs.beamCantilever]);
  
	// Concrete Toggles
  const [showMesh, setShowMesh] = useState(() => localStorage.getItem('squared_show_mesh') === 'true');
  const [showHorizRebar, setShowHorizRebar] = useState(() => localStorage.getItem('squared_show_horiz_rebar') === 'true');
  const [showVertRebar, setShowVertRebar] = useState(() => localStorage.getItem('squared_show_vert_rebar') === 'true');

  useEffect(() => {
    localStorage.setItem('squared_show_mesh', showMesh.toString());
    localStorage.setItem('squared_show_horiz_rebar', showHorizRebar.toString());
    localStorage.setItem('squared_show_vert_rebar', showVertRebar.toString());
  }, [showMesh, showHorizRebar, showVertRebar]);

  // Device Orientation State
  const [orientation, setOrientation] = useState({ alpha: 0, beta: 0, gamma: 0, absolute: false });
  const [isSlopeLocked, setisSlopeLocked] = useState(false);
  const [lockedAngle, setlockedAngle] = useState<number | null>(null);
  const [lockedRoll, setlockedRoll] = useState<number | null>(null);
  const [lockedHeading, setLockedHeading] = useState<number | null>(null);

  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      const b = e.beta || 0;
      const g = e.gamma || 0;
	  const a = e.alpha || 0;
      setOrientation(prev => ({
        ...prev,
        beta: b,
        gamma: g,
        alpha: e.alpha ?? 0
      }));
    };
    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, []);

  const addOpening = () => {
    let w = parseFloat(newOpW) || 0;
    let h = parseFloat(newOpH) || 0;
    
    // Convert to feet/meters for internal storage
    if (unitMode === 'imp') {
      w = w / 12;
      h = h / 12;
    } else {
      w = w / 100;
      h = h / 100;
    }

    if (w > 0 && h > 0) {
      setOpenings([...openings, { type: newOpType, w, h }]);
      setNewOpW('');
      setNewOpH('');
    }
  };

  const removeOpening = (index: number) => {
    setOpenings(openings.filter((_, i) => i !== index));
  };

  // Unit Converter State
  const [unCat, setUnCat] = useState<'len' | 'area' | 'vol' | 'weight' | 'temp'>('len');

  const [currentValue, setCurrentValue] = useState(0);
  const [lastResult, setLastResult] = useState<number | null>(null);
  const [currentOp, setCurrentOp] = useState<string | null>(null);
  const [history, setHistory] = useState('');

  const [rafterStockLen, setRafterStockLen] = useState('16');
  const [stairStockLen, setStairStockLen] = useState('16');
  const [wallStockLen, setWallStockLen] = useState('8');

  // Tile Layout State
  const [sunLat, setSunLat] = useState<number | null>(null);
  const [sunLong, setSunLong] = useState<number | null>(null);
  const [isARActive, setIsARActive] = useState(false);

  const resetTool = (id: ToolId) => {
    // Clear localStorage for this tool
    localStorage.removeItem(`squared_tool_inputs_${id}`);
    // This clears the universal input variables
    setA1(''); setA2(''); setA3(''); setA4('');
    setB1(''); setB2(''); setB3(''); setB4('');
    setC1(''); setC2(''); setC3(''); setC4('');
    setD1(''); setD2(''); setD3(''); setD4('');
    setQty(''); setQty2(''); setQty3(''); setQty4('');
    
    if (id === 'tr') {
      setA1('3'); setA2(''); setA3(''); setA4('');
      setB1('4'); setB2(''); setB3(''); setB4('');
      setAngle('90');
    } else if (id === 'oc') {
      const isI = unitMode === 'imp';
      setA1(isI ? '20' : '6'); setA2(''); setA3(''); setA4('');
      setB1(''); 
      setB2(isI ? '1' : '38'); // 1.5" or 38mm baluster width
      setB3(isI ? '1' : ''); 
      setB4(isI ? '2' : ''); 
      setQty('4');
      setOcMode('structural');
    } else if (id === 'co') {
      setSubMode('slab');
      setSonoInputs({
        a1: '0', a2: '12', a3: '0', a4: '0',
        b1: '4', b2: '0', b3: '0', b4: '0',
        waste: '10', qty: '1',
        showVertRebar: true,
        rebarVSpacing: '3',
        diameterMode: '12'
      });
      setSlabInputs({
        a1: '', a2: '', a3: '', a4: '',
        b1: '', b2: '', b3: '', b4: '',
        d1: '', d2: '', d3: '', d4: '',
        waste: '10', qty: '1',
        showMesh: false, showHorizRebar: false, showVertRebar: false,
        showGravel: false, showPoly: false,
        rebarHSpacing: '12', rebarVSpacing: '12'
      });
      setA1(''); setA2(''); setA3(''); setA4('1'); 
      setB1(''); setB2(''); setB3(''); setB4('1'); 
      setD1(''); setD2(''); setD3(''); setD4('1'); 
      setQty('5'); setQty2('0'); setQty3('0'); setQty4('10M'); // Horizontal Rebar
      setC1('15M'); setC2('16'); setC3('16'); setC4('poured'); // c1 = Vertical Rebar
      
      setWallInputs({
        corners: '4',
        isAddition: false,
        waterproofMode: 'blueskin-dimple',
        waterproofCoverage: 'full',
      });
      setFootingInputs({
        lenFt: '', lenIn: '', lenNum: '', lenDen: '1',
        widMode: '24', customWidIn: '',
        depIn: '8', corners: '4',
        isAddition: false, onBedrock: false,
        rebarRuns: '2', rebarSize: '15M',
        cornerSteelMode: 'bent'
      });
    } else if (id === 'pl') {
      setSubMode('con');
      setQty('1');
      settotalLoad(0);
    } else if (id === 'st') {
      setStairMode('structural'); 
      setSubMode('standard');     
      setStairType('drop');       
      setQty(''); 
      setQty2('1'); setQty3('1'); setQty4('2');  
      setSeatWidthV1('4'); setSeatWidthV2(''); setSeatWidthV3(''); setSeatWidthV4('');
      setHasPointLoad(false); 
      setWoodSpecies('2x12');
    } else if (id === 'rk') {
      setSubMode('pitch');
      setQty('16'); setQty2('2'); setQty3('1');
    } else if (id === 'un') {
      setSubMode('ft');
    } else if (id === 'ds') {
      setSubMode('joist');
      setWoodSpecies('spf');
      setOcSpacing('16');
      setHeaderWallType('non-load');
      setDeflectionLimit('L360');
      setwoodGrade('no2'); 
      setisWetService(false);
      setisMarine(false);      
      setHasHeaderPointLoad(false);
      setSnowLoad('0');
			setQty3('6');
      setA1(''); setA2(''); setA3(''); setA4(''); 
      setB1(''); setB2(''); setB3(''); setB4(''); 
    } else if (id === 'wc') {
      setOcSpacing('16');
      setCorners('');
      setQty4(''); 
      setHasPointLoad(false); 
      setWallSheetingSides('one');
      setC1('exterior'); // Wall Category
      setC2('osb');      // Sheathing Type
      setC3('1/2');      // Drywall Type
      setC4('fiberglass'); // Insulation Type
      setshowScrewLayout(true); // Vapor Barrier Toggle
      setshowFinishing(true);
      setWaste('10');
      setOpenings([]);
      setQty2('2'); 
      setQty3('1'); 
      setFramingSize('2x4');
      localStorage.removeItem('squared_wall_openings');
    } else if (id === 'rr') {
      setQty('6');
      setRidgeV1('0'); setRidgeV2('1'); setRidgeV3('1'); setRidgeV4('2');
      setOverhang('12');
      setRafterStock('2x6');
      setSeatWidthV1('0'); setSeatWidthV2('4'); setSeatWidthV3('1'); setSeatWidthV4('8');
    } else if (id === 'fi') {
      setQty('85'); // Density
      setQty2('0'); // Compaction / Waste
    } else if (id === 'rm') {
      setRoofSections([]);
      setRmPitch('6');
      setRmType('rect');
      setRmQty('1');
      
      // Clear out all fraction memories, including the new Valley input
      setA1(''); setA2(''); setA3(''); setA4('');
      setB1(''); setB2(''); setB3(''); setB4('');
      setC1(''); setC2(''); setC3(''); setC4('');
      setD1(''); setD2(''); setD3(''); setD4(''); 
      
      localStorage.removeItem('squared_roof_sections');
    } else if (id === 'df') {
      setC1('none'); 
      setC2('none'); 
      setC3('none'); 
      setWaste('10');
      setJoistCantilever('16');
      setDeckInputs({
        mode: 'surface', 
        boardWidthMode: '5.5', joistSpacing: '16',
        beamLengthFt: '', beamLengthIn: '0', beamSpan: '', beamCantilever: '', beamPlies: '3', beamCount: '1',
        joistSpanFt: '', joistSpanIn: '0', joistMaterial: '2x8',
        postHeightFt: '3', postHeightIn: '0', postSize: '6x6',
        fasciaMaterial: '2x12', ledgerCount: '1', postCountPerBeam: '',
        overrideBeamLen: false, overrideJoistSpan: false, overrideJoistMat: false, overridePostCount: false
      });
    } else if (id === 'si') {
      setWallType('rectangular');
      setSidingType('8-inch-lap');
      setHasPointLoad(false); // NEW: Resets to Horizontal Siding
      setSidingOverlap('1');
      setBoardWidth('8');
      setWaste('10');
      setSidingSections([]);
      setSidingOpenings([]);
      setA1(''); setA2(''); setA3(''); setA4('');
      setB1(''); setB2(''); setB3(''); setB4('');
      setRmPitch('6');
      setGableInputMode('pitch');
      localStorage.removeItem('squared_siding_overlap');
      localStorage.removeItem('squared_board_width');
      localStorage.removeItem('squared_siding_board_length');
      localStorage.removeItem('squared_siding_h_overlap');
      localStorage.removeItem('squared_siding_in_corners');
      localStorage.removeItem('squared_siding_out_corners');
      localStorage.removeItem('squared_siding_sections');
      localStorage.removeItem('squared_siding_openings');
    } else if (id === 'tl') {
      const isI = unitMode === 'imp';
      if (isI) {
        setRoomLenV1('10'); setRoomLenV2('0'); setRoomLenV3('0'); setRoomLenV4('1');
        setRoomWidV1('10'); setRoomWidV2('0'); setRoomWidV3('0'); setRoomWidV4('1');
        setTileLenV1('0'); setTileLenV2('12'); setTileLenV3('0'); setTileLenV4('1');
        setTileWidV1('0'); setTileWidV2('12'); setTileWidV3('0'); setTileWidV4('1');
        setGroutV1('0'); setGroutV2('0'); setGroutV3('1'); setGroutV4('8');
      } else {
        setRoomLenV1('3'); setRoomLenV2('0'); setRoomLenV3('0'); setRoomLenV4('1');
        setRoomWidV1('3'); setRoomWidV2('0'); setRoomWidV3('0'); setRoomWidV4('1');
        setTileLenV1('300'); setTileLenV2(''); setTileLenV3(''); setTileLenV4('');
        setTileWidV1('300'); setTileWidV2(''); setTileWidV3(''); setTileWidV4('');
        setGroutV1('3'); setGroutV2(''); setGroutV3(''); setGroutV4('');
      }
    } else if (id === 'cm') {
      setA1('38');
      setB1('90');
    } else {
      setA1(''); setA2(''); setA3(''); setA4('1');
      setB1(''); setB2(''); setB3(''); setB4('1');
      setC1(''); setC2(''); setC3(''); setC4('1');
      setD1(''); setD2(''); setD3(''); setD4('1');
      setQty(''); setQty2(''); setQty3(''); setQty4('');
      setWaste('');
      setSubMode('');
    }
  };

  const loadToolInputs = (id: ToolId) => {
    const saved = localStorage.getItem(`squared_tool_inputs_${id}`);
    if (saved) {
      const data = JSON.parse(saved);
      if (data.a1 !== undefined) setA1(data.a1);
      if (data.a2 !== undefined) setA2(data.a2);
      if (data.a3 !== undefined) setA3(data.a3);
      if (data.a4 !== undefined) setA4(data.a4);
      if (data.b1 !== undefined) setB1(data.b1);
      if (data.b2 !== undefined) setB2(data.b2);
      if (data.b3 !== undefined) setB3(data.b3);
      if (data.b4 !== undefined) setB4(data.b4);
      if (data.c1 !== undefined) setC1(data.c1);
      if (data.c2 !== undefined) setC2(data.c2);
      if (data.c3 !== undefined) setC3(data.c3);
      if (data.c4 !== undefined) setC4(data.c4);
      if (data.d1 !== undefined) setD1(data.d1);
      if (data.d2 !== undefined) setD2(data.d2);
      if (data.d3 !== undefined) setD3(data.d3);
      if (data.d4 !== undefined) setD4(data.d4);
      if (data.qty !== undefined) setQty(data.qty);
      if (data.qty2 !== undefined) setQty2(data.qty2);
      if (data.qty3 !== undefined) setQty3(data.qty3);
      if (data.qty4 !== undefined) setQty4(data.qty4);
      if (data.angle !== undefined) setAngle(data.angle);
      if (data.subMode !== undefined) setSubMode(data.subMode);
      if (data.waste !== undefined) setWaste(data.waste);
      
      // Tool specific states
      if (id === 'oc') {
        if (data.ocMode !== undefined) setOcMode(data.ocMode);
        if (data.balustersubMode !== undefined) setBalustersubMode(data.balustersubMode);
        if (data.FixedSpacing !== undefined) setFixedSpacing(data.FixedSpacing);
      } else if (id === 'wc') {
        if (data.loadCategory !== undefined) setLoadCategory(data.loadCategory);
        if (data.ocSpacing !== undefined) setOcSpacing(data.ocSpacing);
        if (data.corners !== undefined) setCorners(data.corners);
        if (data.openings !== undefined) setOpenings(data.openings || []);
      } else if (id === 'rr') {
        if (data.rafterStock !== undefined) setRafterStock(data.rafterStock);
        if (data.overhang !== undefined) setOverhang(data.overhang);
        if (data.seatWidthV1 !== undefined) setSeatWidthV1(data.seatWidthV1);
        if (data.seatWidthV2 !== undefined) setSeatWidthV2(data.seatWidthV2);
        if (data.seatWidthV3 !== undefined) setSeatWidthV3(data.seatWidthV3);
        if (data.seatWidthV4 !== undefined) setSeatWidthV4(data.seatWidthV4);
        if (data.ridgeV1 !== undefined) setRidgeV1(data.ridgeV1);
        if (data.ridgeV2 !== undefined) setRidgeV2(data.ridgeV2);
        if (data.ridgeV3 !== undefined) setRidgeV3(data.ridgeV3);
        if (data.ridgeV4 !== undefined) setRidgeV4(data.ridgeV4);
      } else if (id === 'si') {
        if (data.wallType !== undefined) setWallType(data.wallType);
        if (data.sidingType !== undefined) setSidingType(data.sidingType);
        if (data.sidingOverlap !== undefined) setSidingOverlap(data.sidingOverlap);
        if (data.boardWidth !== undefined) setBoardWidth(data.boardWidth);
        if (data.sidingInsideCorners !== undefined) setSidingInsideCorners(data.sidingInsideCorners);
        if (data.sidingOutsideCorners !== undefined) setSidingOutsideCorners(data.sidingOutsideCorners);
        if (data.sidingSections !== undefined) setSidingSections(data.sidingSections);
      } else if (id === 'st') {
        // Load the stock length for waste calculation
        if (data.stairStockLen !== undefined) setStairStockLen(data.stairStockLen);
        // Load the Project Type (Structural vs Landscape)
        if (data.stairMode !== undefined) setStairMode(data.stairMode);
        // Load the Top Step Style (Flush vs Drop)
        if (data.stairType !== undefined) setStairType(data.stairType);
      } else if (id === 'tl') {
        if (data.roomLenV1 !== undefined) setRoomLenV1(data.roomLenV1);
        if (data.roomLenV2 !== undefined) setRoomLenV2(data.roomLenV2);
        if (data.roomLenV3 !== undefined) setRoomLenV3(data.roomLenV3);
        if (data.roomLenV4 !== undefined) setRoomLenV4(data.roomLenV4);
        if (data.roomWidV1 !== undefined) setRoomWidV1(data.roomWidV1);
        if (data.roomWidV2 !== undefined) setRoomWidV2(data.roomWidV2);
        if (data.roomWidV3 !== undefined) setRoomWidV3(data.roomWidV3);
        if (data.roomWidV4 !== undefined) setRoomWidV4(data.roomWidV4);
        if (data.tileLenV1 !== undefined) setTileLenV1(data.tileLenV1);
        if (data.tileLenV2 !== undefined) setTileLenV2(data.tileLenV2);
        if (data.tileLenV3 !== undefined) setTileLenV3(data.tileLenV3);
        if (data.tileLenV4 !== undefined) setTileLenV4(data.tileLenV4);
        if (data.tileWidV1 !== undefined) setTileWidV1(data.tileWidV1);
        if (data.tileWidV2 !== undefined) setTileWidV2(data.tileWidV2);
        if (data.tileWidV3 !== undefined) setTileWidV3(data.tileWidV3);
        if (data.tileWidV4 !== undefined) setTileWidV4(data.tileWidV4);
        if (data.groutV1 !== undefined) setGroutV1(data.groutV1);
        if (data.groutV2 !== undefined) setGroutV2(data.groutV2);
        if (data.groutV3 !== undefined) setGroutV3(data.groutV3);
        if (data.groutV4 !== undefined) setGroutV4(data.groutV4);
      }
      return true;
    }
    return false;
  };

 const saveToolInputs = (id: ToolId) => {
    const data: any = {
      a1, a2, a3, a4, b1, b2, b3, b4, c1, c2, c3, c4, d1, d2, d3, d4, qty, qty2, qty3, qty4, angle, subMode, waste
    };
    
    // Add tool specific states (df, co, and wc are intentionally excluded because they self-save!)
    if (id === 'oc') {
      data.ocMode = ocMode;
      data.balustersubMode = balustersubMode;
      data.FixedSpacing = FixedSpacing;
    } else if (id === 'rr') {
      data.rafterStock = rafterStock;
      data.overhang = overhang;
      data.seatWidthV1 = seatWidthV1;
      data.seatWidthV2 = seatWidthV2;
      data.seatWidthV3 = seatWidthV3;
      data.seatWidthV4 = seatWidthV4;
      data.ridgeV1 = ridgeV1;
      data.ridgeV2 = ridgeV2;
      data.ridgeV3 = ridgeV3;
      data.ridgeV4 = ridgeV4;
    } else if (id === 'si') {
      data.wallType = wallType;
      data.sidingType = sidingType;
      data.sidingOverlap = sidingOverlap;
      data.boardWidth = boardWidth;
      data.sidingInsideCorners = sidingInsideCorners;
      data.sidingOutsideCorners = sidingOutsideCorners;
      data.sidingSections = sidingSections;
    } else if (id === 'un') {
      data.unCat = unCat;
    } else if (id === 'st') {
      data.stairStockLen = stairStockLen;
    } else if (id === 'tl') {
      data.roomLenV1 = roomLenV1; data.roomLenV2 = roomLenV2; data.roomLenV3 = roomLenV3; data.roomLenV4 = roomLenV4;
      data.roomWidV1 = roomWidV1; data.roomWidV2 = roomWidV2; data.roomWidV3 = roomWidV3; data.roomWidV4 = roomWidV4;
      data.tileLenV1 = tileLenV1; data.tileLenV2 = tileLenV2; data.tileLenV3 = tileLenV3; data.tileLenV4 = tileLenV4;
      data.tileWidV1 = tileWidV1; data.tileWidV2 = tileWidV2; data.tileWidV3 = tileWidV3; data.tileWidV4 = tileWidV4;
      data.groutV1 = groutV1; data.groutV2 = groutV2; data.groutV3 = groutV3; data.groutV4 = groutV4;
    }
    
    localStorage.setItem(`squared_tool_inputs_${id}`, JSON.stringify(data));
  };

  const prevToolRef = useRef<ToolId>(activeTool);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      const loaded = loadToolInputs(activeTool);
      if (!loaded) resetTool(activeTool);
      isInitialMount.current = false;
      return;
    }

    if (prevToolRef.current !== activeTool) {
      saveToolInputs(prevToolRef.current);
      const loaded = loadToolInputs(activeTool);
      if (!loaded) resetTool(activeTool);
      prevToolRef.current = activeTool;
    }
  }, [activeTool]);

  // Save on every change for the active tool
  // CRITICAL FIX: All deleted variables (deckMode, loadCategory, etc) have been removed from this array!
  useEffect(() => {
    if (!isInitialMount.current) {
      saveToolInputs(activeTool);
    }
  }, [a1, a2, a3, a4, b1, b2, b3, b4, c1, c2, c3, c4, d1, d2, d3, d4, qty, qty2, qty3, qty4, angle, subMode, waste, ocMode, balustersubMode, FixedSpacing, rafterStock, overhang, seatWidthV1, seatWidthV2, seatWidthV3, seatWidthV4, ridgeV1, ridgeV2, ridgeV3, ridgeV4, wallType, sidingType, sidingOverlap, boardWidth, sidingInsideCorners, sidingOutsideCorners, sidingSections, roomLenV1, roomLenV2, roomLenV3, roomLenV4, roomWidV1, roomWidV2, roomWidV3, roomWidV4, tileLenV1, tileLenV2, tileLenV3, tileLenV4, tileWidV1, tileWidV2, tileWidV3, tileWidV4, groutV1, groutV2, groutV3, groutV4]);

	useEffect(() => {
    document.body.className = theme === 'light' ? 'light-mode' : '';
  }, [theme]);

  // Handle unit switching defaults (Unlocked for universal translating)
  useEffect(() => {
    const isI = unitMode === 'imp';
    if (isI) {
      setOcSpacing('16');
      setSeatWidthV1('0'); setSeatWidthV2('4'); setSeatWidthV3('1'); setSeatWidthV4('8');
      setPlateCount('3');
    } else {
      setOcSpacing('400');
      setSeatWidthV1('105'); setSeatWidthV2(''); setSeatWidthV3(''); setSeatWidthV4('');
      setPlateCount('3');
    }
    // Note: Removed the unCat reset so contractors can convert Length/Area/Volume freely in any mode!
  }, [unitMode]);

  // Unit Converter Category Change Effect
  useEffect(() => {
    if (activeTool === 'un') {
      if (unCat === 'len') setSubMode('ft');
      else if (unCat === 'area') setSubMode('ft2');
      else if (unCat === 'vol') setSubMode('gal');
      else if (unCat === 'weight') setSubMode('lb');
      else if (unCat === 'temp') setSubMode('c');
      else if (unCat === 'slope') setSubMode('ratio');
    }
  }, [unCat, activeTool]);

	// Automatically defaults Staircase Width to exactly 4' when opening the tool
  // Prevents the 4 1/8" birdsmouth fraction from bleeding over!
  useEffect(() => {
    if (activeTool === 'st') {
      setSeatWidthV1('4');
      setSeatWidthV2('');
      setSeatWidthV3('');
      setSeatWidthV4('');
    }
  }, [activeTool]);

  // Auto-selection logic for stock lengths
  // Auto-selection logic for stock lengths (100% Dual-Unit Compatible)
  useEffect(() => {
    const isI = unitMode === 'imp';

    if (activeTool === 'rr') {
      const bWidth = parseF(a1, a2, a3, a4, unitMode);
      const rThick = parseF(ridgeV1, ridgeV2, ridgeV3, ridgeV4, unitMode) * (isI ? 12 : 1000);
      const oHang = parseFloat(overhang) || (isI ? 12 : 300);
      const pitch = parseFloat(qty) || 6;
      
      if (bWidth > 0) {
        const theoreticalRun = bWidth / 2;
        const ridgeAdjustment = (rThick / 2) / (isI ? 12 : 1000);
        const adjustedRun = theoreticalRun - ridgeAdjustment;
        const theta = Math.atan(pitch / 12);
        const diagonalFactor = 1 / Math.cos(theta);
        const lineLength = adjustedRun * diagonalFactor;
        const overhangRun = (oHang / (isI ? 12 : 1000));
        const overhangDiagonal = overhangRun * diagonalFactor;
        const totalLen = lineLength + overhangDiagonal;
        
        if (isI) {
          const stockLengths = [8, 10, 12, 14, 16, 18, 20, 24];
          const best = stockLengths.find(sl => sl >= totalLen) || 24;
          if (rafterStockLen !== best.toString()) setRafterStockLen(best.toString());
        } else {
          const stockLengthsM = [2.4, 3.0, 3.6, 4.2, 4.8, 5.4, 6.0, 7.2];
          const best = stockLengthsM.find(sl => sl >= totalLen) || 7.2;
          if (rafterStockLen !== best.toString()) setRafterStockLen(best.toString());
        }
      }
    } else if (activeTool === 'st') {
      // We use parseF directly here because valA doesn't exist outside useMemo
      const rise = parseF(a1, a2, a3, a4, unitMode); 
    
      if (rise > 0) {
        // Put any state triggers here that depend on stair rise
      }
    } else if (activeTool === 'wc') {
      const wallH = parseF(b1, b2, b3, b4, unitMode);
      if (wallH > 0) {
        if (isI) {
          const stockLengths = [8, 10, 12, 14, 16, 18, 20];
          const best = stockLengths.find(sl => sl >= wallH) || 20;
          if (wallStockLen !== best.toString()) setWallStockLen(best.toString());
        } else {
          const stockLengthsM = [2.4, 3.0, 3.6, 4.2, 4.8, 5.4, 6.0];
          const best = stockLengthsM.find(sl => sl >= wallH) || 6.0;
          if (wallStockLen !== best.toString()) setWallStockLen(best.toString());
        }
      }
    }
  }, [activeTool, a1, a2, a3, a4, b1, b2, b3, b4, qty, qty2, qty3, qty4, stairType, stairMode, subMode, precision, ridgeV1, ridgeV2, ridgeV3, ridgeV4, overhang, unitMode, woodSpecies, ocSpacing, headerWallType, deflectionLimit, woodGrade, isWetService, isMarine, hasHeaderPointLoad, snowLoad, cantileverDistance]);
  
	const results = useMemo(() => {
    const isI = unitMode === 'imp';
    let main = isI ? "0' 0\"" : "0.000m";
    let sub: { label: string; value: string; warning?: boolean; wasteStatus?: 'short' | 'high' | 'ideal'; wasteLabel?: string }[] = [];
    const valA = parseF(a1, a2, a3, a4, unitMode, inputUnits[activeTool + '_a'] || 'mm');
    const valB = parseF(b1, b2, b3, b4, unitMode, inputUnits[activeTool + '_b'] || 'mm');
    const valC = parseF(c1, c2, c3, c4, unitMode, inputUnits[activeTool + '_c'] || 'mm');
    const valD = parseF(d1, d2, d3, d4, unitMode, inputUnits[activeTool + '_d'] || 'mm');
    const valQty = parseF(qty, qty2, qty3, qty4, unitMode, inputUnits[activeTool + '_qty'] || 'mm');
    const joistCantilever = cantileverDistance || '0';
    const primaryUnit = inputUnits[activeTool + '_a'] || 'mm';

    if (activeTool === 'tr') {
      const isI = unitMode === 'imp';
      const cAng = (parseFloat(angle) || 90) * (Math.PI / 180);
      
      // Directly use unit-aware valA and valB (forced to Feet or Meters internally)
      const decFtA = valA;
      const decFtB = valB;

      const safeHyp = Math.sqrt(decFtA * decFtA + decFtB * decFtB - 2 * decFtA * decFtB * Math.cos(cAng));
      
      const sqFtOrM = 0.5 * decFtA * decFtB * Math.sin(cAng);
      const areaSqFt = isI ? sqFtOrM : sqFtOrM * 10.7639;
      const areaSqM = isI ? sqFtOrM * 0.092903 : sqFtOrM;
            
      const fmtDual = (valWork: number) => {
        if (!isI) {
          if (valWork < 1) return `${(valWork * 1000).toFixed(1)} mm`;
          return `${valWork.toFixed(3)} m`;
        }
        const totalInches = valWork * 12;
        const rawInches = formatF32(totalInches, precision).replace(/"/g, '');
        const ft = Math.floor(totalInches / 12);
        const remInches = formatF32(totalInches - (ft * 12), precision).replace(/"/g, '');
        if (ft === 0) return `${rawInches}"`;
        const paren = remInches === '0' ? `(${ft}')` : `(${ft}' ${remInches}")`;
        return `${paren} ${rawInches}"`;
      };

      main = fmtDual(safeHyp);
      
      sub = [
          { label: '--- Primary Dimensions ---', value: '' },
          { label: 'Side A (Run)', value: fmtDual(decFtA) },
          { label: 'Side B (Rise)', value: fmtDual(decFtB) },
          { label: 'Diagonal (C) / Hypotenuse', value: main, highlight: true },
          { label: '--- Area & Footprint ---', value: '' },
          { label: 'Surface Area (Sq Ft)', value: areaSqFt.toFixed(2) + ' sq ft' },
          { label: 'Surface Area (Sq Meters)', value: areaSqM.toFixed(2) + ' m²' }
      ];

      if (parseFloat(angle) === 90 && decFtA > 0) {
          const slopeRatio = decFtB / decFtA;
          const pitchPer12 = slopeRatio * 12;
          const slopePercentage = slopeRatio * 100;
          sub.push({ label: '--- Structural Pitch & Slope ---', value: '' });
          sub.push({ label: 'Roof Pitch Equivalent', value: `${pitchPer12.toFixed(2)} / 12` });
          sub.push({ label: 'Grade / Incline', value: `${slopePercentage.toFixed(1)}%` });
      }

      if (safeHyp > 0) {
          const angA = Math.asin(Math.sin(cAng) * decFtA / safeHyp) * (180 / Math.PI);
          const angB = 180 - (cAng * 180 / Math.PI) - angA;
          sub.push({ label: '--- Internal Angles ---', value: '' });
          sub.push({ label: 'Angle A (Opposite Side A)', value: angA.toFixed(2) + '°' });
          sub.push({ label: 'Angle B (Opposite Side B)', value: angB.toFixed(2) + '°' });
          sub.push({ label: 'Angle C (Opposite Diagonal)', value: (cAng * 180 / Math.PI).toFixed(1) + '°' });
      }
    } else if (activeTool === 'st') {
      const isI = unitMode === 'imp';
      
      // Force working units to Inches or Millimeters safely
      const totalRise = isI ? valA * 12 : valA * 1000;      
      const totalRunInput = isI ? valB * 12 : valB * 1000;
      
      const topFloor = hasPointLoad ? (isI ? valC * 12 : valC * 1000) : 0;        
      const botFloor = hasPointLoad ? (isI ? valD * 12 : valD * 1000) : 0;        
      
      const parsedWidth = parseF(seatWidthV1, seatWidthV2, seatWidthV3, seatWidthV4, unitMode);
      const stairWidth = parsedWidth > 0 ? (isI ? parsedWidth * 12 : parsedWidth * 1000) : (isI ? 48 : 1200); 
      
      const nosing = parseFloat(deflectionLimit) || 0; 
      const nosingVal = isI ? nosing : nosing * 25.4;

      const treadMat = woodSpecies || '2x12';
      
      let treadThick = isI ? 1.5 : 38; 
      if (treadMat === 'composite') treadThick = isI ? 1.0 : 25;
      else if (treadMat === 'wood54') treadThick = isI ? 1.0 : 25;
      else if (treadMat === 'oak') treadThick = isI ? 1.0625 : 27;
      else if (treadMat === 'custom') treadThick = isI ? valQty * 12 : valQty * 1000;
      
      const fmtDual = (valWork: number) => {
        if (!isI) return `${valWork.toFixed(1)} mm`;
        const rawInches = formatF32(valWork, precision).replace(/"/g, '');
        const ft = Math.floor(valWork / 12);
        const remInches = formatF32(valWork - (ft * 12), precision).replace(/"/g, '');
        
        if (ft === 0) return `${rawInches}"`;
        const paren = remInches === '0' ? `(${ft}')` : `(${ft}' ${remInches}")`;
        return `${paren} ${rawInches}"`;
      };

      sub = []; 
      
      if (totalRise > 0) {
        // 1. CALCULATE TRUE FINISHED RISE
        // Rough rise + Top Floor Thick - Bot Floor Thick = True overall vertical distance
        const trueFinishedRise = totalRise + topFloor - botFloor;

        const targetRiser = stairMode === 'landscape' ? (isI ? 6.0 : 152) : (subMode === 'max' ? (isI ? 7.875 : 200) : (isI ? 7.0 : 178));
        
        // 2. USE TRUE FINISHED RISE TO FIND STEP COUNT
        const flushCountBase = Math.max(1, Math.round(trueFinishedRise / targetRiser));
        const finalRiserCount = (stairType === 'flush' ? flushCountBase : Math.max(1, flushCountBase - 1)) + stepNudge;
        const finalTreadCount = finalRiserCount;  

        let mathTreadRun = 0;
        let calcTotalRun = 0;

        // 3. UNIVERSAL RISER CUT
        const mathRiserHeight = stairMode === 'landscape' 
          ? (trueFinishedRise / finalRiserCount) 
          : (trueFinishedRise / flushCountBase);

        if (totalRunInput > 0) {
          calcTotalRun = totalRunInput;
          mathTreadRun = calcTotalRun / finalTreadCount;
        } else {
          if (stairMode === 'landscape') {
            mathTreadRun = Math.max((isI ? 10 : 254), (isI ? 17.5 : 445) - mathRiserHeight); 
          } else {
            mathTreadRun = isI ? 10.5 : 267;
          }
          calcTotalRun = mathTreadRun * finalTreadCount;
        }

        const calcStringerDiag = Math.sqrt(Math.pow(calcTotalRun, 2) + Math.pow(totalRise, 2));
        const calcAngleRad = Math.atan(mathRiserHeight / mathTreadRun);
        const calcAngleDeg = calcAngleRad * (180 / Math.PI);
        
        const sCount = Math.max(2, Math.ceil(stairWidth / (isI ? 16 : 400)) + 1);
        
        const cutLen = calcStringerDiag + (isI ? 6 : 150); 
        let idealStockFeet = 0;
        let boardsNeeded = 0;

        if (cutLen > (isI ? 16 * 12 : 4.8 * 1000)) {
          idealStockFeet = isI ? Math.max(20, Math.ceil(cutLen / 12)) : Math.max(6.0, Math.ceil(cutLen / 1000));
          boardsNeeded = sCount;
        } else {
          const standardLengths = isI ? [8, 10, 12, 14, 16] : [2.4, 3.0, 3.6, 4.2, 4.8];
          let bestTotalLF = Infinity;

          for (const lenVal of standardLengths) {
            const lenWork = isI ? lenVal * 12 : lenVal * 1000;
            if (lenWork >= cutLen) {
              const cutsPerBoard = Math.floor(lenWork / cutLen);
              const bCount = Math.ceil(sCount / cutsPerBoard);
              const totalLF = bCount * lenVal;

              if (totalLF < bestTotalLF) {
                bestTotalLF = totalLF;
                idealStockFeet = lenVal;
                boardsNeeded = bCount;
              }
            }
          }
        }
          
        sub = [
          { label: '--- Step Cut Specifications ---', value: '' },
          { label: 'Riser Cut', value: fmtDual(mathRiserHeight), highlight: true },
          { label: 'Bottom Riser Cut', value: fmtDual(mathRiserHeight - treadThick + botFloor) },
          { label: 'Stringer Cut Run for Tread', value: fmtDual(mathTreadRun), highlight: true },
          { label: 'Finished Tread Depth', value: fmtDual(mathTreadRun + nosingVal) },
          { label: 'Number of Risers', value: finalRiserCount.toString() },
          { label: 'Number of Treads', value: finalTreadCount.toString() }
        ];       

        // Running Stringer Layout
        const stepDiag = Math.sqrt(Math.pow(mathRiserHeight, 2) + Math.pow(mathTreadRun, 2));
        sub.push({ label: '--- Running Stringer Layout ---', value: '' });
        sub.push({ label: 'Layout Hook Origin', value: 'Top Plumb Cut' });
        for (let i = 1; i <= finalRiserCount; i++) {
           sub.push({ label: `Mark ${i} (Step ${i})`, value: fmtDual(stepDiag * i), highlight: true });
        }

        // Code Compliance & Safety
        if (stairMode === 'structural') {
            if (mathRiserHeight > (isI ? 8.25 : 210)) sub.push({ label: '⚠️ CODE WARNING', value: 'Riser height exceeds standard max', warning: true });
            if (mathRiserHeight < (isI ? 6.5 : 165)) sub.push({ label: '⚠️ NOTICE', value: 'Riser very shallow', warning: true });
            
            if (totalRunInput > 0) {
              if (mathTreadRun < (isI ? 10.0 : 254)) sub.push({ label: '⚠️ CODE VIOLATION', value: `Run too short! Tread is only ${fmtDual(mathTreadRun)}`, warning: true });
              else if (mathTreadRun > (isI ? 12.0 : 305)) sub.push({ label: '⚠️ SAFETY HAZARD', value: `Run too long! Tread is ${fmtDual(mathTreadRun)}`, warning: true });
            } else {
              if (mathTreadRun < (isI ? 10.0 : 254)) sub.push({ label: '⚠️ CODE WARNING', value: 'Tread Run is under 10" (254mm) min', warning: true });
            }

            const risePlusRun = mathRiserHeight + mathTreadRun;
            if (isI && (risePlusRun < 16.5 || risePlusRun > 18.5)) {
               sub.push({ label: '⚠️ COMFORT NOTICE', value: `Rise+Run=${risePlusRun.toFixed(1)}" (Ideal: 17"-18.5")`, warning: true });
            } else if (!isI && (risePlusRun < 420 || risePlusRun > 470)) {
               sub.push({ label: '⚠️ COMFORT NOTICE', value: `Rise+Run=${risePlusRun.toFixed(0)}mm (Ideal: 420-470mm)`, warning: true });
            }
            
            sub.push({ label: '⚠️ SAFETY NOTE', value: isI ? 'Verify 80" min headroom clearance from stair nosing to ceiling.' : 'Verify 2030mm min headroom clearance.', warning: true });
        } else {
            const stride = (2 * mathRiserHeight) + mathTreadRun;
            sub.push({ label: 'Walking Stride Pace', value: isI ? `${stride.toFixed(1)}" (Info Only)` : `${stride.toFixed(0)}mm (Info Only)` });
        }

        sub.push({ label: '--- Dimensions & Angles ---', value: '' });
        sub.push({ label: 'Total Rise', value: fmtDual(totalRise) });
        sub.push({ label: 'Total Run', value: fmtDual(calcTotalRun) });
        sub.push({ label: 'Stringer Length (Diag)', value: fmtDual(calcStringerDiag) });
        sub.push({ label: 'Angle of Stringer', value: calcAngleDeg.toFixed(1) + '°' });

        sub.push({ label: '--- Material Takeoffs ---', value: '' });
        sub.push({ label: 'Required Stringers', value: `${sCount} Stringers` });
        if (sCount > 1) {
          const spacingOC = stairWidth / (sCount - 1);
          sub.push({ label: 'Stringer Spacing', value: fmtDual(spacingOC) + ' OC' });
        }
        
        sub.push({ label: 'Layout Note', value: isI ? 'Stringer count based on 16" max span' : 'Stringer count based on 400mm max span' });
        sub.push({ label: 'Physical Cut Length', value: fmtDual(calcStringerDiag) });
        sub.push({ label: `2x12 Stringer Stock (${idealStockFeet}${isI ? "'" : 'm'})`, value: `${boardsNeeded} Boards` });
        
        sub.push({ label: 'Total Treads Needed', value: `${finalTreadCount} Treads` });
        sub.push({ label: 'Tread Cut Length', value: fmtDual(stairWidth) });
        
        const treadLenBase = isI ? stairWidth / 12 : stairWidth / 1000;
        const treadLF = treadLenBase * finalTreadCount;
        let treadDesc = '';
        if (treadMat === 'composite') treadDesc = `${Math.ceil(treadLF)} ${isI ? 'LF' : 'm'} of 5/4 Composite`;
        else if (treadMat === 'wood54') treadDesc = `${Math.ceil(treadLF)} ${isI ? 'LF' : 'm'} of 5/4 Wood Decking`;
        else if (treadMat === 'oak') treadDesc = `${finalTreadCount}x Solid Oak Treads`;
        else if (treadMat === 'custom') treadDesc = `${Math.ceil(treadLF)} ${isI ? 'LF' : 'm'} of Custom Material`;
        else treadDesc = `${Math.ceil(treadLF)} ${isI ? 'LF' : 'm'} of 2x12 Dimensional`;

        sub.push({ label: 'Tread Material Order', value: treadDesc });
        sub.push({ label: 'Hardware', value: `${sCount}x Simpson LSCZ Stringer Hangers` });

        main = fmtDual(calcStringerDiag);
      }     
    } else if (activeTool === 'calc') {
      const isI = unitMode === 'imp';
      const entry = parseF(a1, a2, a3, a4, unitMode, inputUnits['calc_a'] || 'mm');
      const scalar = parseFloat(qty);
      
      const isDimTyping = a1 !== '' || a2 !== '' || a3 !== '' || (a4 !== '' && a4 !== '1');
      const isScalarTyping = qty !== '';
      const isTyping = subMode === 'scalar' ? isScalarTyping : isDimTyping;
      
      let displayVal = currentValue;
      if (isTyping && !currentOp) {
        displayVal = subMode === 'scalar' ? (!isNaN(scalar) ? scalar : 0) : entry;
      }

      const calcUnit = inputUnits['calc_a'] || 'mm';
      const calcScale = calcUnit === 'm' ? 1 : calcUnit === 'cm' ? 100 : 1000;
      
      main = isI ? formatF(displayVal, 'imp') : `${(displayVal * calcScale).toFixed(2)} ${calcUnit}`;
      
      let opSymbol = 'NONE';
      if (currentOp === 'add') opSymbol = '+ (Add)';
      if (currentOp === 'sub') opSymbol = '- (Subtract)';
      if (currentOp === 'mul') opSymbol = '× (Multiply)';
      if (currentOp === 'div') opSymbol = '÷ (Divide)';

      // --- PRO UPGRADE 1: Live Preview Engine ---
      let livePreview = currentValue;
      const activeInput = subMode === 'scalar' ? (isNaN(scalar) ? 0 : scalar) : entry;
      
      if (currentOp && isTyping) {
         if (currentOp === 'add') livePreview = currentValue + activeInput;
         if (currentOp === 'sub') livePreview = currentValue - activeInput;
         if (currentOp === 'mul') livePreview = currentValue * activeInput;
         if (currentOp === 'div' && activeInput !== 0) livePreview = currentValue / activeInput;
      }

      sub = [
        { label: 'Accumulated Total', value: isI ? formatF32(currentValue * 12, precision).replace(/"/g, '') + '"' : `${(currentValue * calcScale).toFixed(2)} ${calcUnit}` },
      ];

      if (currentOp) {
        sub.push({ label: 'Pending Operation', value: opSymbol, warning: true });
        if (isTyping) {
            sub.push({ label: 'Live Equation Preview', value: isI ? formatF32(livePreview * 12, precision).replace(/"/g, '') + '"' : `${(livePreview * calcScale).toFixed(2)} ${calcUnit}` });
        }
      }

      // --- PRO UPGRADE 2: The Universal "Rosetta Stone" ---
      // Automatically translates the active total into every major construction unit
      const refValBase = (currentOp && isTyping) ? livePreview : currentValue;
      
      if (refValBase > 0) {
        const refValFt = isI ? refValBase : refValBase * 3.28084;
        const refValM = isI ? refValBase * 0.3048 : refValBase;
        
        sub.push({ label: '--- Universal Conversions ---', value: '' });
        sub.push({ label: 'Imperial (Standard)', value: formatF(refValFt, 'imp') });
        sub.push({ label: 'Imperial (Decimal Ft)', value: `${refValFt.toFixed(3)} ft` });
        sub.push({ label: 'Imperial (Total Inches)', value: `${(refValFt * 12).toFixed(2)} in` });
        sub.push({ label: 'Metric (Meters)', value: `${refValM.toFixed(3)} m` });
        sub.push({ label: 'Metric (Millimeters)', value: `${(refValM * 1000).toFixed(0)} mm` });
      }
    } else if (activeTool === 'rk') {
      const isI = unitMode === 'imp';
      
      // Directly use unit-aware valA, valB, valC (forced to Feet or Meters internally)
      const runBase = valA;
      const startHBase = valB;

      let endHBase = 0;
      let pitchVal = 0;

      if (subMode === 'pitch') {
        pitchVal = parseFloat(c1) || 0;
        endHBase = startHBase + (runBase * (pitchVal / 12));
      } else {
        endHBase = valC;
      }

      const runWorking = isI ? runBase * 12 : runBase * 1000;
      const startWorking = isI ? startHBase * 12 : startHBase * 1000;
      const endWorking = isI ? endHBase * 12 : endHBase * 1000;
      const diffWorking = endWorking - startWorking;

      const slope = runWorking > 0 ? diffWorking / runWorking : 0;
      const thetaRad = Math.atan(slope);
      const thetaDeg = thetaRad * (180 / Math.PI);

      let ocWorking = parseFloat(qty) || (isI ? 16 : 400);
      // Auto-correct imperial carryover spacing when switched to metric
      if (!isI && ocWorking <= 24) ocWorking = 400; 
      
      const numTopPl = parseFloat(qty2) || 0; 
      const numBotPl = parseFloat(qty3) || 0;
      
      const plateThick = isI ? 1.5 : 38; 
      const botPlDeduct = numBotPl * plateThick;
      const topPlDeduct = numTopPl * (plateThick / Math.cos(thetaRad)); 
      const totalPlatesWorking = botPlDeduct + topPlDeduct;

      const commonDiff = ocWorking * slope;

      const mainValStr = isI ? formatF32(Math.abs(diffWorking), precision) : `${Math.abs(diffWorking).toFixed(1)} mm`;
      main = (diffWorking < 0 ? '-' : '+') + mainValStr;
      
      const cutReference = qty4 || 'long'; // 'long' or 'short'
      const isShortPoint = cutReference === 'short';

      sub = [
        { label: '--- Wall Rise & Deductions ---', value: '' },
        { label: 'Total Rise / Drop', value: main, highlight: true },
        { label: 'End Height (Tallest Point)', value: isI ? formatF32(endWorking, precision) : `${endWorking.toFixed(1)} mm` },
        { label: 'Vertical Plate Deduction', value: isI ? formatF32(totalPlatesWorking, precision) : `${totalPlatesWorking.toFixed(1)} mm` },
        { label: '--- Angles & Layout ---', value: '' },
        { label: 'Plumb Cut / Saw Miter Angle', value: Math.abs(thetaDeg).toFixed(1) + '°' },
        { label: 'Level Cut / Saw Bevel Angle', value: (90 - Math.abs(thetaDeg)).toFixed(1) + '°' },
        { label: 'Common Difference (Step Cut)', value: (commonDiff < 0 ? '-' : '+') + (isI ? formatF32(Math.abs(commonDiff), precision) : `${Math.abs(commonDiff).toFixed(1)} mm`), highlight: true },
        { label: `--- Stud Cut List (${isShortPoint ? 'Short Point' : 'Long Point'}) ---`, value: '' },
      ];

      const layoutOrigin = c3 || 'short'; 
      const isReversed = layoutOrigin === 'tall';
      
      const studCount = Math.ceil(runWorking / ocWorking);
      const halfStud = plateThick / 2; 

      for (let i = 0; i <= studCount; i++) {
        let xCenter = i === 0 ? halfStud : i * ocWorking;
        
        // PRO UPGRADE: Long Point (+halfStud uphill) vs Short Point (-halfStud uphill)
        const shiftDir = slope >= 0 ? 1 : -1;
        const studOffset = isShortPoint ? -shiftDir * halfStud : shiftDir * halfStud;
        let xTarget = xCenter + studOffset;
        
        xTarget = Math.max(0, Math.min(xTarget, runWorking)); 
        
        const activeX = isReversed ? (runWorking - xTarget) : xTarget;
        const hAtTarget = startWorking + (activeX * slope);
        const studCutWorking = hAtTarget - totalPlatesWorking;
        
        const xActual = i === 0 ? 0 : i * ocWorking; 

        if (xActual <= runWorking && studCutWorking > 0) {
           sub.push({ 
             label: `Stud ${i+1} @ ${isI ? xActual.toFixed(0) + '"' : xActual.toFixed(0) + 'mm'} OC`, 
             value: isI ? formatF32(studCutWorking, precision) : `${studCutWorking.toFixed(1)} mm`,
             highlight: true
           });
        }
      }
      
      sub.push({ label: '--- Important Note ---', value: '' });
      sub.push({ label: 'Measurement Line', value: `All stud lengths above are given to the ${isShortPoint ? 'Short Point (SP)' : 'Long Point (LP)'}.` });
    } else if (activeTool === 'sq') {
      const isI = unitMode === 'imp';

      // Route through parseF so MM, CM, and M convert accurately to base Feet/Meters
      const decFtA = parseF(a1, a2, a3, a4, unitMode, inputUnits['sq_a'] || 'mm'); 
      const decFtB = parseF(b1, b2, b3, b4, unitMode, inputUnits['sq_b'] || 'mm'); 

      const baseArea = decFtA * decFtB;
      const diag = Math.sqrt(decFtA * decFtA + decFtB * decFtB);
      const perimeter = (decFtA + decFtB) * 2;

      const fmtDual = (valFt: number) => {
        if (!isI) {
          if (valFt < 1) return `${(valFt * 1000).toFixed(1)} mm`;
          return `${valFt.toFixed(3)} m`;
        }
        const totalInches = valFt * 12;
        const rawInches = formatF32(totalInches, precision).replace(/"/g, '');
        const ft = Math.floor(totalInches / 12);
        const remInches = formatF32(totalInches - (ft * 12), precision).replace(/"/g, '');
        
        if (ft === 0) return `${rawInches}"`;
        const paren = remInches === '0' ? `(${ft}')` : `(${ft}' ${remInches}")`;
        return `${paren} ${rawInches}"`;
      };

      main = isI ? `${baseArea.toFixed(2)} SQ FT` : `${baseArea.toFixed(2)} M²`;

      // Concrete 4" (100mm) Pad
      const concreteVolFt3 = isI ? baseArea * (4/12) : baseArea * 0.1;
      const concreteYds = isI ? concreteVolFt3 / 27 : concreteVolFt3 * 1.30795;
      const concreteM3 = isI ? concreteVolFt3 * 0.0283168 : baseArea * 0.1;

      const flooringBoxes = Math.ceil((baseArea * 1.10) / (isI ? 24 : 2.2)); // 10% waste
      const paintGallons = Math.ceil((baseArea * 2) / (isI ? 400 : 37));

      sub = [
        { label: '--- Layout & Squaring ---', value: '' },
        { label: 'Diagonal (Pull X to verify square)', value: fmtDual(diag), highlight: true },
        { label: 'Perimeter', value: fmtDual(perimeter) },
        
        { label: '--- Quick Estimators (Omni-Tool) ---', value: '' },
        { label: '4" (100mm) Concrete Pad', value: isI ? `${concreteYds.toFixed(2)} CU YDS` : `${concreteM3.toFixed(2)} M³` },
        { label: `Flooring / Tile (${isI ? '24 sqft' : '2.2 m²'} per box)`, value: `${flooringBoxes} Boxes (w/ 10% waste)` },
        { label: 'Paint (Gallons)', value: `${paintGallons} Gals (2 Coats)` },
        
        { label: '--- Topography ---', value: '' },
        { label: 'Acres', value: (isI ? baseArea / 43560 : (baseArea * 10.7639) / 43560).toFixed(4) + ' ac' },
        { label: 'Hectares', value: (isI ? (baseArea * 0.092903) / 10000 : baseArea / 10000).toFixed(4) + ' ha' },
      ];
    } else if (activeTool === 'co') {
      const isI = unitMode === 'imp';
      const isSono = subMode === 'sono';
      const isWall = subMode === 'wall';
      const isSlab = subMode === 'slab';
      const isFooting = subMode === 'footing';

      let volFt3 = 0;
      let volM3 = 0;

      // ==========================================
      // 1. SONOTUBE PIER ENGINE
      // ==========================================
      if (isSono) {
        const wasteVal = parseFloat(sonoInputs.waste) || 0;
        const wasteFactor = 1 + wasteVal / 100;
        const qtyVal = parseFloat(sonoInputs.qty) || 1;

        const rawDiaIn = parseFloat(sonoInputs.diameterMode === 'custom' ? sonoInputs.a1 : (sonoInputs.diameterMode || '12')) || 12;
        const diaFt = isI ? rawDiaIn / 12 : rawDiaIn / 1000; 
        const radiusWorking = diaFt / 2;

        const depWorking = parseF(sonoInputs.b1, sonoInputs.b2, sonoInputs.b3, sonoInputs.b4, unitMode, inputUnits['co_b'] || 'm'); 

        let volWorking = Math.PI * Math.pow(radiusWorking, 2) * depWorking * qtyVal;

        const flareSelection = sonoInputs.qty4 || 'none';
        if (flareSelection !== 'none') {
          const flareHeight = isI ? 1.0 : 0.3048;
          const topRadius = radiusWorking;
          const bottomRadius = flareSelection === '24' ? (isI ? 1.0 : 0.3048) : (isI ? 0.8333 : 0.254);
          volWorking += (Math.PI * flareHeight / 3) * (Math.pow(topRadius, 2) + (topRadius * bottomRadius) + Math.pow(bottomRadius, 2)) * qtyVal;
        }

        if (isI) {
          volFt3 = volWorking * wasteFactor;
          volM3 = volFt3 * 0.0283168;
        } else {
          volM3 = volWorking * wasteFactor;
          volFt3 = volM3 * 35.3147;
        }

        const cubicYds = volFt3 / 27;
        const bags60 = Math.ceil(volFt3 / 0.45);
        const bags80 = Math.ceil(volFt3 / 0.6);

        main = isI ? `${cubicYds.toFixed(2)} CU YDS` : `${volM3.toFixed(2)} M³`;
        
        sub = [
          { label: '--- Pier Volume Takeoff ---', value: '' },
          { label: 'Net Volume Required', value: isI ? `${(cubicYds / wasteFactor).toFixed(2)} YDS³` : `${(volM3 / wasteFactor).toFixed(2)} M³` },
          { label: `Order Volume (+${wasteVal}% Waste)`, value: main, highlight: true },
          { label: '60lb Pre-Mix Bags', value: `${bags60} Bags` },
          { label: '80lb Pre-Mix Bags', value: `${bags80} Bags` },
          { label: 'Flared Footing Profile', value: sonoInputs.qty4 === '20' ? '20" Bigfoot Form Base' : sonoInputs.qty4 === '24' ? '24" Bigfoot Form Base' : 'Straight Pier Face (None)' }
        ];

        sub.push({ label: '--- Pour Logistics ---', value: '' });
        const orderVolYds = cubicYds;
        const orderVolM3 = volM3;
        const fullTrucks = isI ? (orderVolYds / 10).toFixed(1) : (orderVolM3 / 9).toFixed(1);
        const halfTrucks = isI ? (orderVolYds / 4).toFixed(1) : (orderVolM3 / 3).toFixed(1);

        sub.push({ label: `Standard Trucks (${isI ? '10yd³' : '9m³'})`, value: `${fullTrucks} Load(s)` });
        sub.push({ label: `Spring Half-Loads (${isI ? '4yd³' : '3m³'})`, value: `${halfTrucks} Load(s)` });

        if ((isI && cubicYds > 0 && cubicYds < 4) || (!isI && volM3 > 0 && volM3 < 3)) {
          sub.push({ label: 'SHORT LOAD ALERT', value: 'Under 4 Yards. Expect plant penalty fees.', warning: true });
        }

        if (depWorking > 0 && depWorking < (isI ? 4 : 1.2)) {
          sub.push({ label: 'FROST LINE ALERT', value: 'Depth is less than standard 48" (1.2m) frost line.', warning: true });
        }

        if (sonoInputs.showVertRebar) {
          sub.push({ label: '--- Rebar Reinforcement ---', value: '' });
          const barsPerTube = parseFloat(sonoInputs.rebarVSpacing) || 4;
          const hookWorking = isI ? 0.5 : 0.15; 
          const pieceLenWorking = depWorking + hookWorking;
          const totalPieces = barsPerTube * qtyVal;

          const stick10 = isI ? 10 : 3.0;
          const stick20 = isI ? 20 : 6.0;

          const count10 = Math.floor(stick10 / pieceLenWorking) > 0 ? Math.ceil(totalPieces / Math.floor(stick10 / pieceLenWorking)) : 'N/A';
          const count20 = Math.floor(stick20 / pieceLenWorking) > 0 ? Math.ceil(totalPieces / Math.floor(stick20 / pieceLenWorking)) : 'N/A';
          
          sub.push({ label: isI ? "10' Vertical Bars (15M)" : "3m Vertical Bars (15M)", value: count10.toString() });
          sub.push({ label: isI ? "20' Vertical Bars (15M)" : "6m Vertical Bars (15M)", value: count20.toString() });

          const totalRebarFt = isI ? pieceLenWorking * totalPieces : (pieceLenWorking * 3.28084) * totalPieces;
          const steelWeightLbs = totalRebarFt * 0.668; 
          sub.push({ label: `Gross Steel Order Weight`, value: `${steelWeightLbs.toFixed(1)} lbs`, highlight: true });
        }
      } 
      // ==========================================
      // 2. POURED / ICF FOUNDATION WALL ENGINE
      // ==========================================
      else if (isWall) {
        const wasteFactor = 1 + (parseFloat(qty) || 5) / 100;
        const doors = parseInt(qty2) || 0;
        const windows = parseInt(qty3) || 0;
        
        const vRebarSize = c1 || '15M';
        const hRebarSize = qty4 || '10M';
        const vSpace = isI ? (parseFloat(c2) || 16) / 12 : (parseFloat(c2) || 400) / 1000;
        const hSpace = isI ? (parseFloat(c3) || 16) / 12 : (parseFloat(c3) || 400) / 1000;

        const corners = parseInt(wallInputs.corners) || 4;
        const isAddition = wallInputs.isAddition;
        const isICF = c4 === 'icf';

        // Universal parsing guaranteeing accuracy across all metric sub-scales
        const lenW = parseF(a1, a2, a3, a4, unitMode, inputUnits['co_a'] || 'm');
        const heiW = parseF(b1, b2, b3, b4, unitMode, inputUnits['co_b'] || 'm');
        const depW = parseF(d1, d2, d3, d4, unitMode, inputUnits['co_d'] || 'mm');

        const doorArea = isI ? 20 : 1.8; 
        const windowArea = isI ? 12 : 1.08; 
        const lap = isI ? 2.0 : 0.6; 

        const grossVol = lenW * heiW * depW;
        const deductVol = (doors * doorArea * depW) + (windows * windowArea * depW);
        const netVol = Math.max(0, grossVol - deductVol);

        if (isI) {
          volFt3 = netVol * wasteFactor;
          volM3 = volFt3 * 0.0283168;
        } else {
          volM3 = netVol * wasteFactor;
          volFt3 = volM3 * 35.3147;
        }

        const cubicYds = volFt3 / 27;
        main = isI ? `${cubicYds.toFixed(2)} CU YDS` : `${volM3.toFixed(2)} M³`;

        sub = [
          { label: '--- Wall Volume Takeoff ---', value: '' },
          { label: 'Net Concrete Required', value: isI ? `${(cubicYds / wasteFactor).toFixed(2)} YDS³` : `${(volM3 / wasteFactor).toFixed(2)} M³` },
          { label: `Order Volume (+${qty || 5}% Waste)`, value: main, highlight: true },
          { label: 'Openings Deducted', value: `${doors} Doors, ${windows} Windows` }
        ];

        sub.push({ label: '--- Pour Logistics ---', value: '' });
        const orderVolYds = cubicYds;
        const orderVolM3 = volM3;
        const fullTrucks = isI ? (orderVolYds / 10).toFixed(1) : (orderVolM3 / 9).toFixed(1);
        const halfTrucks = isI ? (orderVolYds / 4).toFixed(1) : (orderVolM3 / 3).toFixed(1);

        sub.push({ label: 'Standard Trucks (10yd³ / 9m³)', value: `${fullTrucks} Load(s)` });
        sub.push({ label: 'Spring Half-Loads (4yd³ / 3m³)', value: `${halfTrucks} Load(s)` });

        if ((isI && cubicYds > 0 && cubicYds < 4) || (!isI && volM3 > 0 && volM3 < 3)) {
          sub.push({ label: 'SHORT LOAD ALERT', value: 'Under 4 Yards. Expect plant penalty fees.', warning: true });
        }

        if (heiW > (isI ? 4 : 1.2)) {
           sub.push({ label: 'Placement Method', value: 'Requires Boom or Line Pump Truck', warning: true });
        }

        if (lenW > 0 && heiW > 0) {
            sub.push({ label: '--- Structural Rebar ---', value: '' });

            const vBars = Math.ceil(lenW / vSpace) + 1;
            const hBars = Math.ceil(heiW / hSpace) + 1;
            
            let hRebarLF = hBars * lenW;

            const cornerBars = corners * hBars;
            const cornerBarLen = isI ? 5 : 1.5; 
            hRebarLF += (cornerBars * cornerBarLen);

            const hDoorExtra = doors * ((isI ? 3 : 0.9) + (2 * lap));
            const hWindowExtra = windows * 2 * ((isI ? 3 : 0.9) + (2 * lap));
            
            hRebarLF += hDoorExtra + hWindowExtra;

            const hRebarFt = isI ? hRebarLF : hRebarLF * 3.28084;
            const hLap20Net = Math.ceil(hRebarFt / 18);

            const vStickLen = isI ? 20 : 6;
            const vCutLen = Math.max(0.1, heiW - (isI ? 0.25 : 0.075)); 
            const totalVPieces = vBars + (doors * 2) + (windows * 2);
            
            let vLap20Net = 0;
            if (vCutLen <= vStickLen) {
                const yieldPerStick = Math.floor(vStickLen / vCutLen);
                vLap20Net = Math.ceil(totalVPieces / yieldPerStick);
            } else {
                const effectiveStick = isI ? 18 : 5.4;
                vLap20Net = Math.ceil((totalVPieces * vCutLen) / effectiveStick);
            }

            const ties = Math.ceil(vBars * hBars * 1.15); 

            const getRebarWeight = (size: string, lengthFt: number) => {
                if (size === '10M') return lengthFt * 0.376;
                if (size === '15M') return lengthFt * 0.668;
                if (size === '20M') return lengthFt * 1.043;
                return 0;
            };

            const grossVFt = vLap20Net * 20; 
            const grossHFt = hLap20Net * 20;
            const weightLbs = getRebarWeight(vRebarSize, grossVFt) + getRebarWeight(hRebarSize, grossHFt);

            const vCutLenFtFloor = Math.floor(vCutLen);
            const vCutLenInRound = Math.round((vCutLen - vCutLenFtFloor) * 12);
            const cutStr = isI ? `${vCutLenFtFloor}' ${vCutLenInRound}"` : `${vCutLen.toFixed(2)}m`;

            sub.push({ label: `Vert Bars 20' / 6m (${vRebarSize})`, value: vCutLen <= vStickLen ? `${vLap20Net} Bars (Cuts @ ${cutStr})` : `${vLap20Net} Bars (w/ Laps)` });
            sub.push({ label: `Horiz Bars 20' / 6m (${hRebarSize})`, value: `${hLap20Net} Bars (w/ Laps)` });
            
            if (cornerBars > 0) {
              sub.push({ label: `Corner 90° Bends (${hRebarSize})`, value: `${cornerBars}x ${isI ? "5'" : "1.5m"} lengths` });
            }
            
            sub.push({ label: `Gross Steel Order Weight`, value: `${weightLbs.toFixed(1)} lbs`, highlight: true });
            
            if (!isICF) {
               sub.push({ label: 'Rebar Ties (Est)', value: ties.toString() });
            }

            sub.push({ label: '--- Formwork & Hardware ---', value: '' });
            
            if (isICF) {
                const wallAreaSqFt = isI ? (lenW * heiW) : (lenW * heiW * 10.7639);
                const courses = Math.ceil(heiW / (isI ? 1.33 : 0.4)); 
                const cornerBlocksTotal = corners * courses;
                const cornerSqFt = cornerBlocksTotal * 2.66; 
                
                const straightSqFt = Math.max(0, wallAreaSqFt - cornerSqFt);
                const straightBlocks = Math.ceil(straightSqFt / 5.33);

                sub.push({ label: 'ICF Corner Blocks (90°)', value: `${cornerBlocksTotal} Blocks` });
                sub.push({ label: 'Standard ICF Blocks (16"x48")', value: `${straightBlocks} Blocks` });
                
                if (heiW > (isI ? 6 : 1.8)) {
                    const wallBraces = Math.ceil(lenW / (isI ? 4 : 1.2)); 
                    const cornerBraces = corners * 2;
                    sub.push({ label: 'Tall Wall: ICF Alignment Braces', value: `${wallBraces + cornerBraces} Braces`, warning: true });
                }
            } else {
                const wallArea = lenW * heiW;
                const snapTies = Math.ceil(wallArea / (isI ? 2.66 : 0.25));
                sub.push({ label: 'Form Snap Ties (16"x24")', value: `${snapTies} pcs` });
                sub.push({ label: 'Form Release Oil', value: 'Required' });
            }

            const jBolts = Math.ceil(lenW / (isI ? 4 : 1.2)) + (corners * 2); 
            sub.push({ label: '1/2" Anchor / J-Bolts', value: `${jBolts} pcs (2/corner, 4' OC)` });

            if (doors > 0 || windows > 0) {
              const buckLF = (doors * (isI ? 16.5 : 5.0)) + (windows * (isI ? 14 : 4.2));
              const buckSize = depW > (isI ? 7.5/12 : 0.19) ? '2x10' : (depW > (isI ? 5.5/12 : 0.14) ? '2x8' : '2x6');
              sub.push({ label: `Treated ${buckSize} Block-outs`, value: `${Math.ceil(buckLF)} ${isI ? 'LF' : 'm'}` });
            }

            sub.push({ label: '--- Prep & Waterproofing ---', value: '' });
            
            if (isAddition) {
               const keywayPins = Math.ceil((heiW * (isI ? 12 : 1)) / (isI ? 16 : 0.4));
               sub.push({ label: 'Connection to Existing Wall', value: `${keywayPins * 2}x 15M Dowel Pins + Paint-on Primer` });
            }

            if (wallInputs.waterproofMode !== 'none') {
               const wpHeight = wallInputs.waterproofCoverage === 'full' ? heiW : (isI ? 4 : 1.2);
               const wpAreaSqFt = (lenW * wpHeight) * (isI ? 1 : 10.7639);
               const bsRolls = Math.ceil(wpAreaSqFt / 225);
               sub.push({ label: 'Blueskin Membrane Rolls (36"x75\')', value: `${bsRolls} Roll(s)` });

               if (wallInputs.waterproofMode === 'blueskin-dimple') {
                  const dimpleRolls = Math.ceil(lenW / (isI ? 65 : 19.8));
                  sub.push({ label: 'Dimple Board / Platon Rolls', value: `${dimpleRolls} Roll(s)` });
                  sub.push({ label: 'Termination Bar / Fasteners', value: `${Math.ceil(lenW / (isI ? 10 : 3))} lengths` });
               }
            }
        }
      } 
      // ==========================================
      // 3. CONCRETE SLAB ENGINE
      // ==========================================
      else if (isSlab) {
        const wasteVal = parseFloat(slabInputs.waste) || 0;
        const wasteFactor = 1 + wasteVal / 100;
        const qtyVal = parseFloat(slabInputs.qty) || 1;

        // Universal parsing ensuring exact scale conversions
        const lenWorking = parseF(slabInputs.a1, slabInputs.a2, slabInputs.a3, slabInputs.a4, unitMode, inputUnits['co_a'] || 'm');
        const widWorking = parseF(slabInputs.b1, slabInputs.b2, slabInputs.b3, slabInputs.b4, unitMode, inputUnits['co_b'] || 'm');
        const depWorking = parseF(slabInputs.d1, slabInputs.d2, slabInputs.d3, slabInputs.d4, unitMode, inputUnits['co_d'] || 'mm');

        let volWorking = lenWorking * widWorking * depWorking * qtyVal;

        if (isI) {
          volFt3 = volWorking * wasteFactor;
          volM3 = volFt3 * 0.0283168;
        } else {
          volM3 = volWorking * wasteFactor;
          volFt3 = volM3 * 35.3147;
        }

        const cubicYds = volFt3 / 27;
        const bags60 = Math.ceil(volFt3 / 0.45);
        const bags80 = Math.ceil(volFt3 / 0.6);

        main = isI ? `${cubicYds.toFixed(2)} CU YDS` : `${volM3.toFixed(2)} M³`;

        sub = [
          { label: '--- Slab Volume Takeoff ---', value: '' },
          { label: 'Net Volume Required', value: isI ? `${(cubicYds / wasteFactor).toFixed(2)} YDS³` : `${(volM3 / wasteFactor).toFixed(2)} M³` },
          { label: `Order Volume (+${wasteVal}% Waste)`, value: main, highlight: true },
          { label: '60lb Pre-Mix Bags', value: `${bags60} Bags` },
          { label: '80lb Pre-Mix Bags', value: `${bags80} Bags` },
        ];

        let totalTies = 0;
        const areaSqFt = isI ? (lenWorking * widWorking * qtyVal) : (lenWorking * widWorking * qtyVal * 10.7639);

        sub.push({ label: '--- Pour Logistics ---', value: '' });
        const orderVolYds = cubicYds;
        const orderVolM3 = volM3;
        const fullTrucks = isI ? (orderVolYds / 10).toFixed(1) : (orderVolM3 / 9).toFixed(1);
        const halfTrucks = isI ? (orderVolYds / 4).toFixed(1) : (orderVolM3 / 3).toFixed(1);

        sub.push({ label: 'Standard Trucks (10yd³ / 9m³)', value: `${fullTrucks} Load(s)` });
        sub.push({ label: 'Spring Half-Loads (4yd³ / 3m³)', value: `${halfTrucks} Load(s)` });

        if ((isI && cubicYds > 0 && cubicYds < 4) || (!isI && volM3 > 0 && volM3 < 3)) {
          sub.push({ label: 'SHORT LOAD ALERT', value: 'Under 4 Yards. Expect plant penalty fees.', warning: true });
        }

        if (lenWorking > 0 && widWorking > 0) {
            sub.push({ label: '--- Formwork & Finishing ---', value: '' });
            const perimeterWorking = (lenWorking + widWorking) * 2 * qtyVal;
            const formBoards = Math.ceil(perimeterWorking / (isI ? 16 : 4.8));
            const stakes = Math.ceil(perimeterWorking / (isI ? 3 : 0.9)); 
            const sealerPails = Math.max(1, Math.ceil(areaSqFt / 1000));
            const formSize = depWorking > (isI ? 0.33 : 0.1) ? '2x6' : '2x4';

            sub.push({ label: `Edge Forms (${formSize})`, value: `${formBoards}x ${isI ? "16'" : "4.8m"} Boards` });
            sub.push({ label: `Wood Stakes (3' spacing)`, value: `${stakes} pcs` });
            sub.push({ label: `Curing Compound/Sealer`, value: `${sealerPails}x 5-Gal Pail(s)` });
        }

        if (slabInputs.showGravel || slabInputs.showPoly) {
           sub.push({ label: '--- Sub-Base Prep ---', value: '' });
           if (slabInputs.showGravel) {
             const gravelDepthWorking = isI ? (4/12) : 0.1;
             const gravelVolBase = lenWorking * widWorking * gravelDepthWorking * qtyVal * wasteFactor;
             const gravelYds = isI ? (gravelVolBase / 27) : (gravelVolBase * 1.30795);
             const gravelTons = gravelYds * 1.4;
             sub.push({ label: '3/4" Clear Crushed Gravel', value: `${gravelYds.toFixed(1)} CU YDS (${gravelTons.toFixed(1)} Tons)` });
           }
           if (slabInputs.showPoly) {
             const polyRolls = Math.ceil((areaSqFt * wasteFactor) / 500);
             sub.push({ label: '6-Mil Poly Vapor Barrier', value: `${polyRolls} Roll(s)` });
           }
        }

        let hasSteel = false;
        let meshWeightLbs = 0;

        if (slabInputs.showMesh) {
          hasSteel = true;
          const mesh4x8Net = Math.ceil(areaSqFt / 32);
          const mesh4x8Lap = Math.ceil(areaSqFt / 26.25);
          const meshTies = Math.ceil((mesh4x8Lap * 12) / 2);
          totalTies += meshTies;
          
          meshWeightLbs = (areaSqFt / 100) * 21; 

          sub.push({ label: '--- Mesh Reinforcement ---', value: '' });
          sub.push({ label: '4x8 Sheets (Net)', value: mesh4x8Net.toString() });
          sub.push({ label: '4x8 Sheets (6” Lap)', value: mesh4x8Lap.toString() });
          sub.push({ label: 'Mesh Ties (Est)', value: meshTies.toString() });
        }

        let rebarLbs = 0;
        if (slabInputs.showHorizRebar || slabInputs.showVertRebar) {
          hasSteel = true;
          sub.push({ label: '--- Rebar Reinforcement ---', value: '' });
          let totalRebarLF = 0;
          let hCount = 0; let vCount = 0;

          if (slabInputs.showHorizRebar) {
            const hSpacingWorking = isI ? (parseFloat(slabInputs.rebarHSpacing) || 12) / 12 : (parseFloat(slabInputs.rebarHSpacing) || 300) / 1000;
            hCount = Math.ceil(widWorking / hSpacingWorking) + 1;
            totalRebarLF += hCount * lenWorking * qtyVal;
          }
          if (slabInputs.showVertRebar) {
            const vSpacingWorking = isI ? (parseFloat(slabInputs.rebarVSpacing) || 12) / 12 : (parseFloat(slabInputs.rebarVSpacing) || 300) / 1000;
            vCount = Math.ceil(lenWorking / vSpacingWorking) + 1;
            totalRebarLF += vCount * widWorking * qtyVal;
          }

          const rebarFt = isI ? totalRebarLF : totalRebarLF * 3.28084;
          
          const rebarNet20 = Math.ceil(rebarFt / 20);
          const rebarLap20 = Math.ceil(rebarFt / 18);
          rebarLbs = (rebarLap20 * 20) * 0.668; 
          
          const rebarTies = Math.ceil((hCount * vCount * qtyVal) * 1.1); 
          totalTies += rebarTies;

          // NEW: Calculate specific splice ties based on run length laps
          let spliceTies = 0;
          if (slabInputs.showHorizRebar) {
            const runLenFt = isI ? lenWorking : lenWorking * 3.28084;
            const laps = runLenFt > 20 ? Math.ceil(runLenFt / 18) - 1 : 0;
            spliceTies += (hCount * laps * qtyVal) * 2;
          }
          if (slabInputs.showVertRebar) {
            const runLenFt = isI ? widWorking : widWorking * 3.28084;
            const laps = runLenFt > 20 ? Math.ceil(runLenFt / 18) - 1 : 0;
            spliceTies += (vCount * laps * qtyVal) * 2;
          }
          totalTies += spliceTies;

          sub.push({ label: "20' / 6m Bars (Net)", value: rebarNet20.toString() });
          sub.push({ label: "20' / 6m Bars (2' Lap)", value: rebarLap20.toString() });
          sub.push({ label: 'Grid Intersection Ties', value: rebarTies.toString() });
          if (spliceTies > 0) {
            sub.push({ label: 'Lap Splice Ties (2/lap)', value: spliceTies.toString() });
          }
        }

        if (hasSteel) {
           const totalSlabSteelWeight = meshWeightLbs + rebarLbs;
           sub.push({ label: `Gross Steel Order Weight`, value: `${totalSlabSteelWeight.toFixed(1)} lbs`, highlight: true });
        }

        if (hasSteel && areaSqFt > 0) {
           const chairs = Math.ceil(areaSqFt / 9); 
           sub.push({ label: 'Rebar Chairs / Dobie Blocks', value: `${chairs} pcs` });
           sub.push({ label: 'Total Ties Needed', value: totalTies.toString() });
        }
      }
      // ==========================================
      // 4. STRIP FOOTING ENGINE
      // ==========================================
      else if (isFooting) {
        const wasteVal = parseFloat(slabInputs.waste) || 10;
        const wasteFactor = 1 + wasteVal / 100;
        
        // Universal parsing ensuring exact scale conversions
        const lenW = parseF(footingInputs.lenFt, footingInputs.lenIn, footingInputs.lenNum, footingInputs.lenDen, unitMode, 'm');

        const widInches = footingInputs.widMode === 'custom' ? (parseFloat(footingInputs.customWidIn) || 24) : parseInt(footingInputs.widMode);
        const widW = isI ? widInches / 12 : widInches / 1000;

        const depInches = parseFloat(footingInputs.depIn) || 8;
        const depW = isI ? depInches / 12 : depInches / 1000;

        const corners = parseInt(footingInputs.corners) || 0;
        const isAddition = footingInputs.isAddition;
        const onBedrock = footingInputs.onBedrock;
        const runs = parseInt(footingInputs.rebarRuns) || 2;

        let volWorking = lenW * widW * depW;
        
        if (isI) {
          volFt3 = volWorking * wasteFactor;
          volM3 = volFt3 * 0.0283168;
        } else {
          volM3 = volWorking * wasteFactor;
          volFt3 = volM3 * 35.3147;
        }

        const cubicYds = volFt3 / 27;
        main = isI ? `${cubicYds.toFixed(2)} CU YDS` : `${volM3.toFixed(2)} M³`;

        sub = [
          { label: '--- Footing Volume Takeoff ---', value: '' },
          { label: 'Net Continuous Volume', value: isI ? `${(cubicYds / wasteFactor).toFixed(2)} YDS³` : `${(volM3 / wasteFactor).toFixed(2)} M³` },
          { label: `Order Volume (+${wasteVal}% Waste)`, value: main, highlight: true }
        ];

        sub.push({ label: '--- Pour Logistics ---', value: '' });
        const orderVolYds = cubicYds;
        const orderVolM3 = volM3;
        const fullTrucks = isI ? (orderVolYds / 10).toFixed(1) : (orderVolM3 / 9).toFixed(1);
        const halfTrucks = isI ? (orderVolYds / 4).toFixed(1) : (orderVolM3 / 3).toFixed(1);

        sub.push({ label: 'Standard Trucks (10yd³ / 9m³)', value: `${fullTrucks} Load(s)` });
        sub.push({ label: 'Spring Half-Loads (4yd³ / 3m³)', value: `${halfTrucks} Load(s)` });

        if ((isI && cubicYds > 0 && cubicYds < 4) || (!isI && volM3 > 0 && volM3 < 3)) {
          sub.push({ label: 'SHORT LOAD ALERT', value: 'Under 4 Yards. Expect plant penalty fees.', warning: true });
        }

        let totalTies = 0;
        sub.push({ label: '--- Structural Reinforcement ---', value: '' });
        
        const runLenFt = isI ? lenW : lenW * 3.28084;
        const rebarFt = runLenFt * runs;
        const rebarLap20 = Math.ceil(rebarFt / 18);
        const orderedHorizFt = rebarLap20 * 20; 

        // NEW: Calculate specific splice ties based on footing run length
        const lapsPerRun = runLenFt > 20 ? Math.ceil(runLenFt / 18) - 1 : 0;
        const spliceTies = runs * lapsPerRun * 2;
        totalTies += spliceTies;
        
        let cornerBars = 0;
        const cornerBarLenFt = isI ? 5 : 1.5; 
        let cornerSteelFt = 0;
        if (corners > 0 && footingInputs.cornerSteelMode === 'bent') {
           cornerBars = corners * runs;
           cornerSteelFt = cornerBars * cornerBarLenFt;
           totalTies += (cornerBars * 2); // 2 ties to marry corner bars to main runs
        }

        const wallDowels = Math.ceil(lenW / (isI ? 4 : 1.2)) + (corners * 2);
        const dowelLenFt = isI ? 2.5 : 0.75; 
        let dowelSteelFt = wallDowels * dowelLenFt;
        totalTies += wallDowels; // 1 tie per vertical dowel to the horizontal grid

        let bedrockPins = 0;
        const bedrockPinLenFt = isI ? 0.833 : 0.25; 
        if (onBedrock) {
            bedrockPins = Math.ceil(lenW / (isI ? 4 : 1.2));
            dowelSteelFt += (bedrockPins * bedrockPinLenFt);
        }

        let tieInPins = 0;
        const tieInLenFt = isI ? 2.0 : 0.6; 
        if (isAddition) {
            tieInPins = runs;
            dowelSteelFt += (tieInPins * tieInLenFt);
        }

        const getRebarWeight = (size: string, lengthFt: number) => {
            if (size === '10M') return lengthFt * 0.376;
            if (size === '15M') return lengthFt * 0.668;
            if (size === '20M') return lengthFt * 1.043;
            return 0;
        };

        const horizWeight = getRebarWeight(footingInputs.rebarSize, orderedHorizFt + cornerSteelFt);
        const dowelWeight = getRebarWeight('15M', dowelSteelFt);
        const totalSteelWeight = horizWeight + dowelWeight;
        
        sub.push({ label: `Horizontal Runs (${footingInputs.rebarSize})`, value: `${runs} Continuous Runs` });
        sub.push({ label: "20' / 6m Bars (w/ Laps)", value: rebarLap20.toString() });
        
        if (spliceTies > 0) {
            sub.push({ label: 'Lap Splice Ties (2/lap)', value: spliceTies.toString() });
        }

        if (cornerBars > 0) {
           sub.push({ label: `Pre-Bent 90° Corner Bars (${footingInputs.rebarSize})`, value: `${cornerBars}x ${isI ? "5'" : "1.5m"} lengths` });
        } else if (corners > 0) {
           sub.push({ label: 'Corner Grid Laps', value: 'Requires extra field tying' });
        }

        if (isAddition) {
            sub.push({ label: 'Foundation Tie-in (15M Dowels)', value: `${tieInPins}x 24" Pins into existing footing` });
        }
        if (onBedrock) {
            sub.push({ label: 'Bedrock Anchor Pins (15M)', value: `${bedrockPins}x 10" pcs drilled to rock` });
        }

        sub.push({ label: 'Vertical Wall Dowels (15M)', value: `${wallDowels}x 30" pcs (2 at corners, 4' OC)` });
        sub.push({ label: `Gross Steel Order Weight`, value: `${totalSteelWeight.toFixed(1)} lbs`, highlight: true });
        
        if (totalTies > 0) {
            sub.push({ label: 'Total Ties Needed', value: totalTies.toString() });
        }
      }
    } else if (activeTool === 'fi') {
      const isI = unitMode === 'imp';

      // Directly use the globally parsed variables (forced to Feet or Meters)
      const lenBase = valA; 
      const widBase = valB; 
      const depBase = valC;

      const density = parseFloat(qty) || 85; // Standardized to lbs/ft³
      const wastePercent = parseFloat(qty2) || 0; 
      const wasteMultiplier = 1 + (wastePercent / 100);

      let cubicFt = 0;
      let cubicMeters = 0;

      // Safely convert all geometric volume to both Imperial and Metric spaces
      if (isI) {
          cubicFt = (lenBase * widBase * depBase) * wasteMultiplier;
          cubicMeters = cubicFt * 0.0283168;
      } else {
          cubicMeters = (lenBase * widBase * depBase) * wasteMultiplier;
          cubicFt = cubicMeters * 35.3147;
      }

      const totalYds = cubicFt / 27;
      
      // Because we isolated cubicFt above, density math is now 100% accurate globally
      const tons = (cubicFt * density) / 2000;
      const metricTonnes = tons * 0.907185;
      const totalLbs = cubicFt * density;

      // --- Site Logistics & Movement ---
      const dumpTrucks = Math.ceil(totalYds / 12); // Standard 12 yd³ dump truck
      const skidSteer = Math.ceil(totalYds / 0.5); // Standard half-yard loader bucket
      const wheelbarrows = Math.ceil(cubicFt / 3); // Standard 3 cu ft contractor wheelbarrow

      main = isI ? `${tons.toFixed(2)} TONS` : `${metricTonnes.toFixed(2)} TONNES`;
      
      sub = [
        { label: '--- Required Volume ---', value: '' },
        { label: 'Cubic Yards', value: totalYds.toFixed(2) + ' yds³', highlight: true },
        { label: 'Cubic Meters', value: cubicMeters.toFixed(2) + ' m³' },
        { label: 'Cubic Feet', value: cubicFt.toFixed(2) + ' ft³' },
        
        { label: '--- Weight & Mass ---', value: '' },
        { label: 'US Tons (2,000 lbs)', value: tons.toFixed(2) + ' t', highlight: true },
        { label: 'Metric Tonnes (1,000 kg)', value: metricTonnes.toFixed(2) + ' t', highlight: !isI },
        { label: 'Total Pounds', value: Math.round(totalLbs).toLocaleString() + ' lbs' },

        { label: '--- Site Logistics (Estimates) ---', value: '' },
        { label: 'Standard Dump Trucks (12 yd³)', value: `${dumpTrucks} Load(s)`, highlight: true },
        { label: 'Skid-Steer Buckets (0.5 yd³)', value: `${skidSteer} Scoop(s)` },
        { label: 'Contractor Wheelbarrows', value: `${wheelbarrows} Trip(s)` },
      ];
    } else if (activeTool === 'df') {
      const isI = unitMode === 'imp';
      const area = valA * valB;
      const wasteMultiplier = 1 + (parseFloat(waste) || 10) / 100;

      let bWidth = 5.5; 
      if (deckInputs.boardWidthMode === 'custom') {
        const wIn = parseFloat(customDeckBoardW2) || 0; 
        const fracNum = parseFloat(customDeckBoardW3) || 0;
        const fracDen = parseFloat(customDeckBoardW4) || 0;
        const frac = fracDen > 0 ? fracNum / fracDen : 0;
        const finalCustom = wIn + frac;
        if (finalCustom > 0) bWidth = finalCustom;
      } else {
        bWidth = parseFloat(deckInputs.boardWidthMode) || 5.5;
      }

      let jCantileverIn = parseFloat(deckInputs.beamCantilever) || (isI ? 16 : 400); 
      if (!isI && jCantileverIn <= 24) jCantileverIn = 400; 
      const jCantileverFt = isI ? jCantileverIn / 12 : jCantileverIn / 1000;
      
      const bLen = isI 
        ? (parseFloat(deckInputs.beamLengthFt) || 0) + (parseFloat(deckInputs.beamLengthIn) || 0) / 12
        : (parseFloat(deckInputs.beamLengthFt) || 0) + (parseFloat(deckInputs.beamLengthIn) || 0) / 100;
      const jSpan = isI
        ? (parseFloat(deckInputs.joistSpanFt) || 0) + (parseFloat(deckInputs.joistSpanIn) || 0) / 12
        : (parseFloat(deckInputs.joistSpanFt) || 0) + (parseFloat(deckInputs.joistSpanIn) || 0) / 100;
      const pHeight = isI
        ? (parseFloat(deckInputs.postHeightFt) || 0) + (parseFloat(deckInputs.postHeightIn) || 0) / 12
        : (parseFloat(deckInputs.postHeightFt) || 0) + (parseFloat(deckInputs.postHeightIn) || 0) / 100;
      
      const suggestedJoistMaterial = isI 
        ? (jSpan < 10 ? '2x8' : jSpan <= 14 ? '2x10' : '2x12')
        : (jSpan < 3.0 ? '2x8' : jSpan <= 4.2 ? '2x10' : '2x12');
      const actualJoistMaterial = deckInputs.joistMaterial || suggestedJoistMaterial;

      let spacing = parseFloat(deckInputs.joistSpacing) || (isI ? 16 : 400);
      if (!isI && spacing <= 24) spacing = 400; 
      if (isI) {
        if (actualJoistMaterial === '2x8' && jSpan >= 10) spacing = 12;
        if (actualJoistMaterial === '2x10' && jSpan > 14) spacing = 12;
      } else {
        if (actualJoistMaterial === '2x8' && jSpan >= 3.0) spacing = 300;
        if (actualJoistMaterial === '2x10' && jSpan > 4.2) spacing = 300;
      }

      const lCount = parseInt(deckInputs.ledgerCount) || 0;
      const isFreestanding = lCount === 0;
      const exposedPerimeterLF = isFreestanding ? (valA * 2) + (valB * 2) : (valA * 2) + valB;

      if (deckInputs.mode === 'surface') {
        const frameLengthUnits = isI ? valA * 12 : valA * 1000;
        const frameWidthUnits = isI ? valB * 12 : valB * 1000;

        const boardPlusGap = bWidth + (isI ? 0.25 : 6); 
        const totalBoardRows = Math.ceil(frameLengthUnits / boardPlusGap);
        const totalJoistLines = Math.ceil(frameWidthUnits / spacing) + 1;

        const exactBoardLF = (totalBoardRows * valB) * wasteMultiplier; 

        const boardCount12 = isI ? Math.ceil(exactBoardLF / 12) : Math.ceil(exactBoardLF / 3.6);
        const boardCount16 = isI ? Math.ceil(exactBoardLF / 16) : Math.ceil(exactBoardLF / 4.8);
        const boardCount8 = isI ? Math.ceil(exactBoardLF / 8) : Math.ceil(exactBoardLF / 2.4);
        const boardCount10 = isI ? Math.ceil(exactBoardLF / 10) : Math.ceil(exactBoardLF / 3.0);

        const isComposite = deckInputs.boardWidthMode === '5.25';
        
        let fastenerLabel = 'Deck Screws (3")';
        let fastenerCount = Math.ceil((totalBoardRows * totalJoistLines * 2) * wasteMultiplier);
        
        if (isComposite) {
            fastenerLabel = 'Hidden Fastener Clips';
            fastenerCount = Math.ceil((totalBoardRows * totalJoistLines) * wasteMultiplier); 
        }
        
        const fastenerWeight = isI ? fastenerCount / 100 : (fastenerCount / 100) * 0.453592;

        main = isI ? `${Math.round(area)} SQ FT` : `${(area).toFixed(1)} M²`;
        sub = [
          { label: '--- Decking Takeoff ---', value: '' },
          { label: 'Surface Area', value: main },
          { label: isI ? 'Main Field Decking (LF)' : 'Main Field Decking (m)', value: isI ? Math.ceil(exactBoardLF).toLocaleString() + ' ft' : exactBoardLF.toFixed(1) + ' m', highlight: true },
          { label: isI ? 'Board Count (8\')' : 'Board Count (2.4m)', value: boardCount8.toLocaleString() },
          { label: isI ? 'Board Count (10\')' : 'Board Count (3.0m)', value: boardCount10.toLocaleString() },
          { label: isI ? 'Board Count (12\')' : 'Board Count (3.6m)', value: boardCount12.toLocaleString() },
          { label: isI ? 'Board Count (16\')' : 'Board Count (4.8m)', value: boardCount16.toLocaleString(), highlight: true },
          { label: '--- Fasteners ---', value: '' },
          { label: fastenerLabel, value: fastenerCount.toLocaleString() },
          { label: 'Fastener Weight (Est)', value: fastenerWeight.toFixed(1) + (isI ? ' lbs' : ' kg') },
        ];

        if (isComposite) {
            sub.push({ label: 'Perimeter Screws', value: `${Math.ceil(totalJoistLines * 2)} Color-Match Screws`, warning: true });
        }

      } else {
        const bPlies = deckInputs.beamPlies === 'lvl' ? 1 : parseInt(deckInputs.beamPlies) || 3;
        const baseBeamCount = parseInt(deckInputs.beamCount) || 1;
        const actualBeamCount = baseBeamCount + (isFreestanding ? 1 : 0);

        const getStandardLength = (len: number) => {
          if (isI) {
            const std = [8, 10, 12, 14, 16].find(l => l >= len);
            return std || 16;
          } else {
            const std = [2.4, 3.0, 3.6, 4.2, 4.8].find(l => l >= len);
            return std || 4.8;
          }
        };

        const formatSize = (mat: string) => isI ? mat.split('x').map(p => p + '"').join('x') : mat.split('x').map(p => p + 'mm').join('x');

        const getLumberTallyObj = (totalLen: number) => {
          const maxLen = isI ? 16 : 4.8;
          if (totalLen <= maxLen) return [{ qty: 1, len: getStandardLength(totalLen) }];
          const fullMaxs = Math.floor(totalLen / maxLen);
          const remainder = totalLen % maxLen;
          const tally = [];
          if (fullMaxs > 0) tally.push({ qty: fullMaxs, len: maxLen });
          if (remainder > 0) tally.push({ qty: 1, len: getStandardLength(remainder) });
          return tally;
        };

        const formatTallySimple = (tally: {qty: number, len: number}[], multiplier: number = 1) => {
          return tally.map(t => `${t.qty * multiplier} at ${t.len}${isI ? "'" : "m"}`).join(' + ');
        };

        const formatTallyFull = (mat: string, tally: {qty: number, len: number}[], multiplier: number = 1) => {
          const size = formatSize(mat);
          return tally.map(t => `${t.qty * multiplier} at ${size}x${t.len}${isI ? "'" : "m"}`).join(' + ');
        };

        const pCountPerBeam = parseInt(deckInputs.postCountPerBeam) || Math.ceil(bLen / (isI ? 7 : 2.1)) + 1;
        const totalPostCount = pCountPerBeam * actualBeamCount;
        const beamSpanCalc = pCountPerBeam > 1 ? bLen / (pCountPerBeam - 1) : bLen;

        const cutLen = pHeight + (isI ? (2 / 12) : 0.05); 
        const stickLengths = isI ? [8, 10, 12, 16] : [2.4, 3.0, 3.6, 4.8];
        let bestStick = isI ? 10 : 3.0;
        let bestYield = 0;
        let minWaste = 999;

        stickLengths.forEach(s => {
          const yieldPerStick = Math.floor(s / cutLen);
          if (yieldPerStick > 0) {
            const waste = s - (yieldPerStick * cutLen);
            const wastePerPost = waste / yieldPerStick;
            if (wastePerPost < minWaste) {
              minWaste = wastePerPost;
              bestStick = s;
              bestYield = yieldPerStick;
            }
          }
        });

        const sticksNeeded = Math.ceil(totalPostCount / (bestYield || 1));
        const postDesc = `${sticksNeeded} ${deckInputs.postSize}x${bestStick}${isI ? "'" : "m"} (${totalPostCount} posts total)`;

        const joistCount = isI ? Math.ceil((bLen * 12) / spacing) + 1 : Math.ceil((bLen * 1000) / spacing) + 1;
        const totalJoistLen = jSpan + (isI ? (parseFloat(deckInputs.beamCantilever) || 16) / 12 : (parseFloat(deckInputs.beamCantilever) || 400) / 1000);
        const joistDesc = `${joistCount} Joists: ${formatSize(actualJoistMaterial)}x${getStandardLength(totalJoistLen)}${isI ? "'" : "m"}`;

        const totalFasciaLF = bLen + (2 * totalJoistLen);
        const fasciaBoardCount = isI ? Math.ceil(totalFasciaLF / 16) : Math.ceil(totalFasciaLF / 4.8);
        const ledgerBolts = isFreestanding ? 0 : (isI ? Math.ceil((bLen * 12) / 8) + 1 : Math.ceil((bLen * 1000) / 200) + 1); 
        
        let bracing4x4x8 = 0;
        if (pHeight > (isI ? 3 : 0.9)) bracing4x4x8 = totalPostCount; 

        let beamDesc = "";
        if (deckInputs.beamPlies === 'lvl') {
          beamDesc = `${actualBeamCount} LVL Beam: ${bLen.toFixed(2)}${isI ? "'" : "m"}`;
        } else {
          const plyCount = actualBeamCount * bPlies;
          const beamTallyObj = getLumberTallyObj(bLen);
          beamDesc = `${plyCount} Plies: ${actualJoistMaterial} (${formatTallySimple(beamTallyObj, plyCount)})`;
        }

        const ledgerTallyObj = isFreestanding ? [] : getLumberTallyObj(bLen);
        const ledgerDesc = isFreestanding ? "None (Freestanding)" : formatTallyFull(actualJoistMaterial, ledgerTallyObj);

        const rimTallyObj = getLumberTallyObj(bLen);
        const rimJoistDesc = formatTallyFull(actualJoistMaterial, rimTallyObj, 2);

        const beamLenInCalculated = isI ? bLen * 12 : bLen * 1000;
        const beamRows = isI ? Math.ceil(beamLenInCalculated / 12) : Math.ceil(beamLenInCalculated / 300);
        
        const getNailsPerRow = (mat: string) => {
          if (mat.includes('2x6')) return 3;
          if (mat.includes('2x8') || mat.includes('2x10')) return 4;
          if (mat.includes('2x12')) return 5;
          return 4; 
        };

        const beamNailsPerRow = getNailsPerRow(actualJoistMaterial);
        const plyMultiplier = bPlies === 3 ? 2 : 1;
        const beamAssemblyNails = beamRows * beamNailsPerRow * plyMultiplier * actualBeamCount;
        const droppedBeamNails = joistCount * 3 * actualBeamCount;
        const fasciaNailsPerRow = getNailsPerRow(deckInputs.fasciaMaterial);
        const fasciaNails = joistCount * fasciaNailsPerRow; 
        
        const totalFramingNails = Math.ceil(beamAssemblyNails + droppedBeamNails + fasciaNails);
        const totalHangerNails = isFreestanding ? 0 : joistCount * 14;

        const nailsPerLb = 65;
        const framingNailLbs = totalFramingNails / nailsPerLb;
        let framingNailBox = "";
        if (isI) {
          if (framingNailLbs < 1) framingNailBox = "Small Pack";
          else if (framingNailLbs <= 5) framingNailBox = "1x 5lb Box";
          else if (framingNailLbs <= 30) framingNailBox = "1x 30lb Box";
          else framingNailBox = `${Math.ceil(framingNailLbs / 30)}x 30lb Boxes`;
        } else {
          const framingNailKg = framingNailLbs * 0.453592;
          if (framingNailKg < 0.5) framingNailBox = "Small Pack";
          else if (framingNailKg <= 2.5) framingNailBox = "1x 2.5kg Box";
          else if (framingNailKg <= 15) framingNailBox = "1x 15kg Box";
          else framingNailBox = `${Math.ceil(framingNailKg / 15)}x 15kg Boxes`;
        }

        const volPerPier = isI ? (Math.PI * Math.pow(0.5, 2) * 4) : (Math.PI * Math.pow(0.15, 2) * 1.2); 
        const totalVol = volPerPier * totalPostCount;
        const bags60 = isI ? Math.ceil(totalVol / 0.45) : Math.ceil(totalVol / 0.013); 
        const bags80 = isI ? Math.ceil(totalVol / 0.6) : Math.ceil(totalVol / 0.017); 

        const blockingLF = isI ? Math.ceil(jSpan / 4) * bLen : Math.ceil(jSpan / 1.2) * bLen;
        const totalJoistLF = (joistCount * totalJoistLen) + (bLen * 2); 
        const joistTapeRolls = Math.ceil(totalJoistLF / (isI ? 50 : 15.2));
        const joistHangers = isFreestanding ? 0 : joistCount;
        const tensionTies = isFreestanding ? 0 : 4; 

        main = `${totalPostCount} Posts / ${joistCount} Joists`;
        sub = [
          { label: isFreestanding ? '--- FREESTANDING FRAMING ---' : '--- Structural Framing Takeoff ---', value: '' },
          { label: 'Joists', value: joistDesc, highlight: true },
          { label: 'Support Posts', value: postDesc, highlight: true },
          { label: 'Beam Material', value: beamDesc, highlight: true },
          { label: 'Ledger Board', value: ledgerDesc },
          { label: 'Rim Joist / Sub-Fascia', value: rimJoistDesc },
          { label: isI ? 'Blocking (Total LF)' : 'Blocking (Total m)', value: Math.ceil(blockingLF) + (isI ? ' LF' : ' m') },
          { label: 'Fascia (3-Side Wrap)', value: `${deckInputs.fasciaMaterial} (${Math.ceil(totalFasciaLF)}${isI ? ' LF' : ' m'})` },
          { label: isI ? 'Fascia Board Count (16\')' : 'Fascia Board Count (4.8m)', value: fasciaBoardCount.toString() },
          
          { label: '--- Hardware & Fasteners ---', value: '' }, 
          { label: 'Total Framing Nails (3-3.5”)', value: totalFramingNails.toLocaleString() },
          { label: 'Framing Nail Order', value: framingNailBox, highlight: true },
          { label: isFreestanding ? 'Joist Hangers' : 'Joist Hangers (LUS)', value: joistHangers > 0 ? `${joistHangers} Hangers` : 'None' },
          { label: 'Total Hanger Nails', value: totalHangerNails.toLocaleString() },
          { label: isI ? 'Ledger Bolts (8” OC)' : 'Ledger Bolts (200mm OC)', value: ledgerBolts.toString() },
          { label: 'Lateral Tension Ties', value: tensionTies > 0 ? `${tensionTies}x DTT1Z` : 'None' },
          
          { label: '--- Concrete Piers & Protection ---', value: '' },
          { label: isI ? "Joist Tape (50' Rolls)" : "Joist Tape (15.2m Rolls)", value: `${joistTapeRolls} Rolls` },
          { label: '4x4x8 Bracing Count', value: bracing4x4x8.toString() },
          { label: isI ? '12”x4\' Sonotubes' : '300mmx1.2m Sonotubes', value: totalPostCount.toString(), highlight: true },
          { label: isI ? '60lb Pre-Mix Bags' : '25kg Pre-Mix Bags', value: bags60.toString() },
          { label: isI ? '80lb Pre-Mix Bags' : '35kg Pre-Mix Bags', value: bags80.toString() },
          
          { label: '--- Engineering Specs ---', value: '' },
          { label: 'Suggested Joist Size', value: suggestedJoistMaterial },
          { label: 'Actual Joist Spacing', value: isI ? `${spacing}" OC` : `${spacing} mm OC` },
          { label: 'Beam Span (Actual)', value: beamSpanCalc.toFixed(2) + (isI ? ' ft' : ' m') },
          { label: 'Joist Cantilever', value: jCantileverIn + (isI ? '"' : ' mm') },
        ];
        
        if (!isFreestanding) {
          sub.push({ 
            label: 'Structural Ledger Screws', 
            value: `${Math.ceil((bLen * (isI ? 12 : 1)) / (isI ? 12 : 0.3)) * 2}x Simpson SDWS Timber Screws (4")` 
          });
        }

        if (pHeight > (isI ? 3 : 0.9)) {
          sub.push({ label: 'STABILITY ALERT', value: 'Post height > 3\'. (2) 30” 4x4 braces per post added to tally.', warning: true });
        }
      }

      // Finishing & Upgrades Engine
      const picFrameMode = c1 || 'none';
      const railingMode = c2 || 'none';
      const skirtingMode = c3 || 'none';

      if (picFrameMode !== 'none' || railingMode !== 'none' || skirtingMode !== 'none') {
          sub.push({ label: '--- Finishing & Upgrades ---', value: '' });
      }

      if (picFrameMode !== 'none') {
          const picFrameLF = (picFrameMode === 'double' ? 2.2 : 1.1) * exposedPerimeterLF; 
          const picFrameBoards = isI ? Math.ceil(picFrameLF / 16) : Math.ceil(picFrameLF / 4.8);
          const ladderLF = exposedPerimeterLF * 2;
          
          sub.push({ label: 'Picture Frame Border', value: Math.ceil(picFrameLF) + (isI ? ' LF' : ' m'), highlight: true });
          sub.push({ label: isI ? "Border Boards (16')" : "Border Boards (4.8m)", value: `${picFrameBoards} Boards` });
          
          if (deckInputs.mode === 'framing') {
              sub.push({ label: 'Required Ladder Blocking', value: Math.ceil(ladderLF) + (isI ? ' LF' : ' m'), warning: true });
          }
      }

      if (railingMode !== 'none') {
          const posts = Math.ceil(exposedPerimeterLF / (isI ? 6 : 1.8)) + (isFreestanding ? 4 : 2);
          const balusters = Math.ceil(exposedPerimeterLF * (isI ? 3 : 10)); 
          
          sub.push({ label: 'Total Exposed Railing', value: Math.ceil(exposedPerimeterLF) + (isI ? ' LF' : ' m'), highlight: true });
          sub.push({ label: 'Railing Posts (4x4 or Alum)', value: posts.toString() });
          
          if (railingMode === 'wood') {
              sub.push({ label: 'Wood Balusters (2x2)', value: balusters.toString() });
              sub.push({ label: 'Top/Bottom Rails (2x4)', value: Math.ceil(exposedPerimeterLF * 2) + (isI ? ' LF' : ' m') });
              sub.push({ label: 'Spindle Fasteners', value: `${balusters * 4}x (2-1/2" Wood Screws)` });
          } else {
              sub.push({ label: 'Aluminum Balusters', value: balusters.toString() });
              sub.push({ label: 'Top/Bottom Rail Kits', value: `${Math.ceil(exposedPerimeterLF / (isI ? 6 : 1.8))} Kits` });
          }
      }

      if (skirtingMode !== 'none') {
          const pHeightVal = isI 
              ? (parseFloat(deckInputs.postHeightFt) || 0) + (parseFloat(deckInputs.postHeightIn) || 0) / 12 
              : (parseFloat(deckInputs.postHeightFt) || 0) + (parseFloat(deckInputs.postHeightIn) || 0) / 100;
          const skirtArea = exposedPerimeterLF * Math.max(pHeightVal, (isI ? 1 : 0.3)); 
          
          if (skirtingMode === 'lattice') {
              const sheets = Math.ceil(skirtArea / (isI ? 32 : 2.97));
              sub.push({ label: 'Lattice Sheets (4x8)', value: sheets.toString(), highlight: true });
          } else {
              const bWidthFt = isI ? bWidth / 12 : bWidth / 1000;
              const boardLF = skirtArea / bWidthFt;
              sub.push({ label: 'Skirting Boards', value: Math.ceil(boardLF) + (isI ? ' LF' : ' m'), highlight: true });
              sub.push({ label: 'Skirting Screws (Est)', value: Math.ceil(boardLF * 2).toString() });
          }
      }
    } else if (activeTool === 'pl') {
      const isI = unitMode === 'imp';
      const customWeightRaw = parseFloat(b1) || 0;
      
      // Convert metric custom truck capacity input to LBS for the internal engine
      const customWeightLbs = isI ? customWeightRaw : (customWeightRaw / 0.453592);
      
      let truckCapLbs = 2000;
      if (truckModel === 'custom') {
        truckCapLbs = customWeightLbs > 0 ? customWeightLbs : (isI ? 1500 : 1500 / 0.453592);
      } else if (typeof getStandardCap === 'function') {
        truckCapLbs = getStandardCap(truckModel) || 2000;
      } else if (typeof TRUCK_CAPACITIES !== 'undefined' && TRUCK_CAPACITIES[truckModel]) {
        truckCapLbs = TRUCK_CAPACITIES[truckModel].value || parseFloat(TRUCK_CAPACITIES[truckModel].label?.replace(/[^0-9.]/g, '')) || 2000;
      }

      const currentLoadLbs = typeof totalLoad === 'number' ? totalLoad : (parseFloat(totalLoad) || 0);

      // The Towing vs Payload Engine
      let payloadUsedLbs = currentLoadLbs;
      let minTongueLbs = 0;
      let maxTongueLbs = 0;

      if (isTrailer) {
         minTongueLbs = currentLoadLbs * 0.10;
         maxTongueLbs = currentLoadLbs * 0.15;
         payloadUsedLbs = maxTongueLbs; // Safest bet: Assume maximum tongue weight sits on the truck suspension
      }

      const isOverloaded = payloadUsedLbs > truckCapLbs;
      const remainingPayloadLbs = Math.max(0, truckCapLbs - payloadUsedLbs);

      // Standardize output formats based on unit toggle
      const displayLoad = isI ? currentLoadLbs : currentLoadLbs * 0.453592;
      const displayCap = isI ? truckCapLbs : truckCapLbs * 0.453592;
      const displayPayloadUsed = isI ? payloadUsedLbs : payloadUsedLbs * 0.453592;
      const displayRemaining = isI ? remainingPayloadLbs : remainingPayloadLbs * 0.453592;
      const displayUnit = isI ? 'lbs' : 'kg';

      main = `${Math.round(displayLoad).toLocaleString()} ${displayUnit.toUpperCase()}`;

      sub = [];
      if (isTrailer) {
         sub.push({ label: '--- Trailer Towing Mode ---', value: '' });
         sub.push({ label: 'Gross Trailer Weight (GTW)', value: `${Math.round(displayLoad).toLocaleString()} ${displayUnit}`, highlight: true });
         
         const minT = isI ? minTongueLbs : minTongueLbs * 0.453592;
         const maxT = isI ? maxTongueLbs : maxTongueLbs * 0.453592;
         sub.push({ label: 'Estimated Tongue Weight (10-15%)', value: `${Math.round(minT)} - ${Math.round(maxT)} ${displayUnit}`, highlight: true });
         
         sub.push({ label: '--- Truck Payload Status ---', value: '' });
         sub.push({ label: 'Truck Bed/Payload Capacity', value: `${Math.round(displayCap).toLocaleString()} ${displayUnit}` });
         sub.push({ label: 'Payload Used (Tongue Wgt)', value: `${Math.round(displayPayloadUsed).toLocaleString()} ${displayUnit}` });
         sub.push({ label: 'Remaining Truck Payload', value: `${Math.round(displayRemaining).toLocaleString()} ${displayUnit}`, highlight: true });
         sub.push({ label: 'Balance Note', value: 'Ensure 60% of trailer weight is forward of axles.' });
      } else {
         sub.push({ label: '--- Truck Bed Mode ---', value: '' });
         sub.push({ label: 'Gross Cargo Weight', value: `${Math.round(displayLoad).toLocaleString()} ${displayUnit}`, highlight: true });
         sub.push({ label: 'Truck Bed/Payload Capacity', value: `${Math.round(displayCap).toLocaleString()} ${displayUnit}` });
         sub.push({ label: 'Remaining Truck Payload', value: `${Math.round(displayRemaining).toLocaleString()} ${displayUnit}`, highlight: true });
      }

      if (isOverloaded) {
         sub.push({ label: 'OVERLOAD WARNING', value: isTrailer ? 'Tongue weight exceeds truck payload!' : 'Cargo exceeds truck payload capacity!', warning: true });
      }

      if (subMode === 'liquid') {
         sub.push({ label: 'STABILITY WARNING', value: 'Slosh risk: Use baffled tanks for liquid loads.', warning: true });
      }
    } else if (activeTool === 'un') {
      const from = subMode || 'ft';
      const rawVal = parseFloat(a1) || 0;
      
      sub = [];

      if (unCat === 'len') {
        let meters = 0;
        if (from === 'ft') meters = rawVal / 3.2808399;
        else if (from === 'in') meters = rawVal / 39.3700787;
        else if (from === 'yd') meters = rawVal / 1.0936133;
        else if (from === 'm') meters = rawVal;
        else if (from === 'cm') meters = rawVal / 100;
        else if (from === 'mm') meters = rawVal / 1000;
        else if (from === 'km') meters = rawVal * 1000;
        else if (from === 'mi') meters = rawVal * 1609.344;

        const ftDec = meters * 3.2808399;
        main = unitMode === 'imp' ? `${meters.toFixed(3)} m` : formatF(ftDec, 'imp');

        sub = [
          { label: '--- Architectural & Imperial ---', value: '' },
          { label: 'Tape Measure (Arch.)', value: formatF(ftDec, 'imp'), highlight: true },
          { label: 'Decimal Feet', value: ftDec.toFixed(4) + ' ft' },
          { label: 'Inches', value: (meters * 39.3700787).toFixed(3) + ' in' },
          { label: 'Yards', value: (meters * 1.0936133).toFixed(3) + ' yd' },
          { label: 'Miles', value: (meters / 1609.344).toFixed(5) + ' mi' },
          { label: '--- Metric Equivalents ---', value: '' },
          { label: 'Millimeters', value: (meters * 1000).toFixed(1) + ' mm', highlight: unitMode === 'met' },
          { label: 'Centimeters', value: (meters * 100).toFixed(2) + ' cm' },
          { label: 'Meters', value: meters.toFixed(3) + ' m', highlight: unitMode === 'met' },
          { label: 'Kilometers', value: (meters / 1000).toFixed(4) + ' km' },
        ];
      } else if (unCat === 'area') {
        let m2 = 0;
        if (from === 'ft2') m2 = rawVal / 10.76391;
        else if (from === 'm2') m2 = rawVal;
        else if (from === 'ac') m2 = rawVal * 4046.856;
        else if (from === 'km2') m2 = rawVal * 1000000;
        else if (from === 'mi2') m2 = rawVal * 2589988;
        else if (from === 'cm2') m2 = rawVal / 10000;
        else if (from === 'in2') m2 = rawVal / 1550.003;
        else if (from === 'sq') m2 = rawVal * 9.2903; 

        main = unitMode === 'imp' ? `${m2.toFixed(3)} m²` : `${(m2 * 10.76391).toFixed(3)} ft²`;

        sub = [
          { label: '--- Imperial Surface ---', value: '' },
          { label: 'Sq Feet', value: (m2 * 10.76391).toFixed(2) + ' ft²', highlight: true },
          { label: 'Roofing Squares (100 ft²)', value: ((m2 * 10.76391) / 100).toFixed(2) + ' Sq', highlight: true },
          { label: 'Sq Inches', value: (m2 * 1550.003).toFixed(1) + ' in²' },
          { label: 'Acres', value: (m2 / 4046.856).toFixed(4) + ' ac' },
          { label: '--- Metric Surface ---', value: '' },
          { label: 'Sq Meters', value: m2.toFixed(3) + ' m²', highlight: unitMode === 'met' },
          { label: 'Sq Centimeters', value: (m2 * 10000).toFixed(0) + ' cm²' },
          { label: 'Hectares', value: (m2 / 10000).toFixed(4) + ' ha' },
        ];
      } else if (unCat === 'vol') {
        let liters = 0;
        if (from === 'gal') liters = rawVal * 3.78541;
        else if (from === 'l') liters = rawVal;
        else if (from === 'ft3') liters = rawVal * 28.3168;
        else if (from === 'm3') liters = rawVal * 1000;
        else if (from === 'yd3') liters = rawVal * 764.555;
        else if (from === 'fbm') liters = rawVal * 2.35974; 

        main = unitMode === 'imp' ? `${liters.toFixed(2)} L` : `${(liters / 3.78541).toFixed(2)} gal`;

        sub = [
          { label: '--- Imperial Volume ---', value: '' },
          { label: 'Gallons (US)', value: (liters / 3.78541).toFixed(2) + ' gal', highlight: true },
          { label: 'Cubic Feet', value: (liters / 28.3168).toFixed(3) + ' ft³' },
          { label: 'Cubic Yards', value: (liters / 764.555).toFixed(3) + ' yd³', highlight: true },
          { label: 'Board Feet (FBM)', value: (liters / 2.35974).toFixed(1) + ' FBM' },
          { label: '--- Metric Volume ---', value: '' },
          { label: 'Liters', value: liters.toFixed(2) + ' L', highlight: unitMode === 'met' },
          { label: 'Cubic Meters', value: (liters / 1000).toFixed(3) + ' m³', highlight: unitMode === 'met' },
        ];
      } else if (unCat === 'weight') {
        let kg = 0;
        if (from === 'lb') kg = rawVal * 0.453592;
        else if (from === 'kg') kg = rawVal;
        else if (from === 'g') kg = rawVal / 1000;
        else if (from === 'oz') kg = rawVal * 0.0283495;
        else if (from === 'ton') kg = rawVal * 907.185;
        else if (from === 'tonne') kg = rawVal * 1000;
        else if (from === 'st') kg = rawVal * 6.35029;

        main = unitMode === 'imp' ? `${kg.toFixed(2)} kg` : `${(kg / 0.453592).toFixed(2)} lb`;

        sub = [
          { label: '--- Imperial Mass ---', value: '' },
          { label: 'Pounds', value: (kg / 0.453592).toFixed(2) + ' lb', highlight: true },
          { label: 'Ounces', value: (kg / 0.0283495).toFixed(1) + ' oz' },
          { label: 'Tons (US Short)', value: (kg / 907.185).toFixed(3) + ' ton' },
          { label: '--- Metric Mass ---', value: '' },
          { label: 'Kilograms', value: kg.toFixed(2) + ' kg', highlight: unitMode === 'met' },
          { label: 'Grams', value: (kg * 1000).toFixed(0) + ' g' },
          { label: 'Tonnes (Metric)', value: (kg / 1000).toFixed(3) + ' t' },
        ];
      } else if (unCat === 'temp') {
        let c = 0;
        if (from === 'c') c = rawVal;
        else if (from === 'f') c = (rawVal - 32) * 5 / 9;
        main = from === 'c' ? `${(c * 9 / 5 + 32).toFixed(1)} °F` : `${c.toFixed(1)} °C`;
        sub = [
          { label: '--- Temperature ---', value: '' },
          { label: 'Celsius', value: c.toFixed(1) + ' °C', highlight: true },
          { label: 'Fahrenheit', value: (c * 9 / 5 + 32).toFixed(1) + ' °F', highlight: true },
        ];
      } else if (unCat === 'flow') {
        let lps = 0;
        if (from === 'gpm') lps = rawVal * 0.0630902;
        else if (from === 'lps') lps = rawVal;
        main = from === 'lps' ? `${(lps / 0.0630902).toFixed(2)} GPM` : `${lps.toFixed(3)} L/s`;
        sub = [
          { label: '--- Hydraulic Flow Rate ---', value: '' },
          { label: 'Gallons Per Min (GPM)', value: (lps / 0.0630902).toFixed(2) + ' GPM', highlight: true },
          { label: 'Liters Per Sec (L/s)', value: lps.toFixed(3) + ' L/s', highlight: true },
        ];
      } else if (unCat === 'pressure') {
        let bar = 0;
        if (from === 'psi') bar = rawVal * 0.0689476;
        else if (from === 'bar') bar = rawVal;
        else if (from === 'kpa') bar = rawVal / 100;
        main = from === 'psi' ? `${bar.toFixed(3)} Bar` : `${(bar / 0.0689476).toFixed(2)} PSI`;
        sub = [
          { label: '--- Fluid & Air Pressure ---', value: '' },
          { label: 'PSI (Pounds/Sq In)', value: (bar / 0.0689476).toFixed(2) + ' PSI', highlight: true },
          { label: 'Bar', value: bar.toFixed(3) + ' Bar', highlight: true },
          { label: 'Kilopascals (kPa)', value: (bar * 100).toFixed(1) + ' kPa' },
        ];
      } else if (unCat === 'torque') {
        let nm = 0;
        if (from === 'ftlb') nm = rawVal * 1.35582;
        else if (from === 'nm') nm = rawVal;
        main = from === 'nm' ? `${(nm / 1.35582).toFixed(2)} ft-lbs` : `${nm.toFixed(2)} Nm`;
        sub = [
          { label: '--- Rotational Force ---', value: '' },
          { label: 'Foot-Pounds (Ft-lbs)', value: (nm / 1.35582).toFixed(2) + ' ft-lbs', highlight: true },
          { label: 'Newton Meters (Nm)', value: nm.toFixed(2) + ' Nm', highlight: true },
        ];
      } else if (unCat === 'slope') {
        let deg = 0;
        if (from === 'deg') deg = rawVal;
        else if (from === 'ratio') deg = Math.atan(rawVal / 12) * (180 / Math.PI);
        else if (from === 'percent') deg = Math.atan(rawVal / 100) * (180 / Math.PI);

        const ratio = Math.tan(deg * Math.PI / 180) * 12;
        const percent = Math.tan(deg * Math.PI / 180) * 100;

        main = from === 'ratio' ? `${deg.toFixed(2)}°` : `${ratio.toFixed(2)} / 12`;
        sub = [
          { label: '--- Roof & Grade Angles ---', value: '' },
          { label: 'Roof Pitch (Rise / 12)', value: `${ratio.toFixed(2)} / 12`, highlight: true },
          { label: 'Degrees', value: `${deg.toFixed(2)}°`, highlight: true },
          { label: 'Grade (Percentage)', value: `${percent.toFixed(2)}%` },
        ];
      }
    } else if (activeTool === 'wc') {
      const isI = unitMode === 'imp';
      
      const valA = parseF(a1, a2, a3, a4, unitMode, inputUnits['wc_a'] || 'mm');
      const valB = parseF(b1, b2, b3, b4, unitMode, inputUnits['wc_b'] || 'mm');

      const len = valA; 
      const wallH = valB; 
      
      let spacing = parseFloat(ocSpacing) || (isI ? 16 : 400); 
      if (!isI && spacing <= 24) spacing = 400; // Auto-correct imperial carryovers
      
      const topPlateCount = parseInt(qty2) || 2;
      const bottomPlateCount = parseInt(qty3) || 1;
      const pCount = topPlateCount + bottomPlateCount;
      
      const wasteFactor = 1 + (parseFloat(waste) || 10) / 100;
      
      const lenIn = isI ? len * 12 : len * 1000; 
      const wallHIn = isI ? wallH * 12 : wallH * 1000; 
      
      const outsideCornersCount = parseInt(corners) || 0;
      const tWallsCount = parseInt(qty4) || 0;
      
      const cornerStuds = outsideCornersCount * 2;
      const tWallStuds = tWallsCount * 2;
      
      let studs = Math.ceil(lenIn / spacing) + 1 + cornerStuds + tWallStuds;
      
      const plateThickness = isI ? 1.5 : 38; 
      const studCutLength = wallHIn - (pCount * plateThickness); 
      
      let lapAmount = 0; 
      if (isI) {
        if (framingSize === '2x4') lapAmount = 3.5 / 12;
        else if (framingSize === '2x6') lapAmount = 5.5 / 12;
        else if (framingSize === '2x8') lapAmount = 7.25 / 12;
      } else {
        if (framingSize === '2x4') lapAmount = 0.089;
        else if (framingSize === '2x6') lapAmount = 0.140;
        else if (framingSize === '2x8') lapAmount = 0.184; 
      }

      const isSlab = hasPointLoad; 
      let regularBpCount = bottomPlateCount;
      let ptBpCount = 0;
      let ptPlatesLF = 0;
      let sillGasketLF = 0;
      let anchorBolts = 0;

      if (isSlab && bottomPlateCount > 0) {
        ptBpCount = 1;
        regularBpCount = Math.max(0, bottomPlateCount - 1);
        ptPlatesLF = len; 
        sillGasketLF = len;
        anchorBolts = isI ? Math.ceil(len / 4) + 1 : Math.ceil(len / 1.2) + 1; 
      }

      const regularPlatesLF = (len * (topPlateCount + regularBpCount)) + lapAmount; 
      
      const plateBoards = Math.ceil((regularPlatesLF * wasteFactor) / (isI ? 16 : 4.8));
      const ptBoards = Math.ceil((ptPlatesLF * wasteFactor) / (isI ? 16 : 4.8));

      let totalHeaderLF = 0;
      let totalJackCount = 0;
      let totalCrippleCount = 0;
      let totalSillLF = 0;
      let totalDoorWidth = 0;
      let doorCasingLF = 0;
      let windowCasingLF = 0;
      
      let windowCount = 0;
      let doorCount = 0;
      
      let headerDetails: string[] = [];
      let jackDetails: string[] = [];

      openings.forEach(op => {
        if (op.type === 'window') windowCount++;
        else doorCount++;

        const opW_in = isI ? op.w : op.w * 10; 
        const opH_in = isI ? op.h : op.h * 10; 
        
        const hLen = opW_in + (isI ? 3 : 76); 
        const hLenFt = hLen / (isI ? 12 : 1000); 
        
        totalHeaderLF += (hLenFt * 2);
        
        let hSize = "2x6";
        if (isI) {
          if (op.w > 96) hSize = "2x12";
          else if (op.w > 72) hSize = "2x10";
          else if (op.w > 48) hSize = "2x8";
        } else {
          if (op.w > 240) hSize = "2x300";
          else if (op.w > 180) hSize = "2x250";
          else if (op.w > 120) hSize = "2x200";
        }
        headerDetails.push(`2-Ply ${hSize} @ ${formatF(hLenFt, unitMode)}`);

        totalJackCount += 2;
        const jackLen = opH_in - (isI ? 1.5 : 38);
        jackDetails.push(formatF(jackLen / (isI ? 12 : 1000), unitMode));
        
        const headerTopH = isI ? 80 : 2032;
        const headerDepth = isI ? 9.25 : 235; 
        const aboveHeaderH = wallHIn - headerTopH - plateThickness - headerDepth;
        if (aboveHeaderH > 0) {
          totalCrippleCount += Math.ceil(hLen / spacing) + 1;
        }
        
        if (op.type === 'window') {
          const sillH = headerTopH - opH_in;
          const belowLen = sillH - plateThickness;
          if (belowLen > 0) {
            totalCrippleCount += Math.ceil(opW_in / spacing) + 1;
          }
          totalSillLF += (opW_in / (isI ? 12 : 1000)) * 2; 
          windowCasingLF += ((opW_in + opH_in) * 2) / (isI ? 12 : 1000);
        } else {
          totalDoorWidth += (opW_in / (isI ? 12 : 1000));
          doorCasingLF += (opW_in + opH_in * 2) / (isI ? 12 : 1000);
        }
      });

      const needsFireBlocking = isI ? wallH > 8 : wallH > 2.44; 
      const fireBlockingLF = needsFireBlocking ? len : 0;

      const wallArea = len * wallH; 
      let netArea = wallArea;
      
      openings.forEach(op => {
        const opAreaSq = isI ? (op.w * op.h) / 144 : (op.w * op.h) / 10000; 
        netArea -= opAreaSq;
      });
      netArea = Math.max(0, netArea); 
      
      const isExterior = c1 !== 'interior'; 
      const sheathingSides = isExterior ? 1 : (wallSheetingSides === 'both' ? 2 : 1);
      
      const osbArea = isExterior ? (netArea * wasteFactor) : 0;
      const drywallArea = netArea * sheathingSides * wasteFactor;
      
      const sheetArea8 = isI ? 32 : (1.2 * 2.4);
      const sheetArea10 = isI ? 40 : (1.2 * 3.0);
      const sheetArea12 = isI ? 48 : (1.2 * 3.6);
      
      const osbSheets = Math.ceil(osbArea / sheetArea8); 
      const drywall8 = Math.ceil(drywallArea / sheetArea8);
      const drywall10 = Math.ceil(drywallArea / sheetArea10);
      const drywall12 = Math.ceil(drywallArea / sheetArea12);

      const mudBuckets = Math.ceil(drywallArea / (isI ? 500 : 46));
      const tapeRolls = Math.ceil(drywallArea / (isI ? 500 : 46));
      
      const tyvekRolls = isI ? Math.ceil(wallArea / 900) : Math.ceil(wallArea / 83.6);
      const polyRolls = isI ? Math.ceil(drywallArea / 500) : Math.ceil(drywallArea / 46.4);
      const tuckTape = Math.ceil(polyRolls * 1.5);
      const sealantTubes = isI ? Math.ceil(((len * 2) + (wallH * 2)) / 25) : Math.ceil(((len * 2) + (wallH * 2)) / 7.6);
      
      const hurricaneTies = isExterior ? studs : 0;
      const headerHangers = (windowCount + doorCount) * 2;

      const beadSticks = outsideCornersCount + (windowCount * 3) + (doorCount * 2);
      const paintGallons = Math.ceil(drywallArea / (isI ? 200 : 18.5));
      const primerGallons = Math.ceil(drywallArea / (isI ? 400 : 37));

      const baseboardLF = Math.max(0, (len - totalDoorWidth) * 1.1);
      const shoeLF = baseboardLF;

      const studHitsTrim = Math.ceil((baseboardLF * (isI ? 12 : 1000)) / spacing);
      const totalFinishNails = (studHitsTrim * 2) + (studHitsTrim * 1) + (Math.ceil(((doorCasingLF + windowCasingLF) * (isI ? 12 : 1000)) / spacing) * 2);
      const finishNailWeightDisplay = isI ? `${(totalFinishNails / 1000).toFixed(2)} lb` : `${((totalFinishNails / 1000) * 0.453592).toFixed(2)} kg`;

      const framingNails = (studs + totalJackCount + totalCrippleCount) * 4 + (regularPlatesLF * (isI ? 1 : 3.28));
      const sheathingScrews = (osbSheets + drywall8) * 35; 

      const rValue = framingSize === '2x4' ? (isI ? 'R-13/R-15' : 'R-2.2/R-2.6') : (isI ? 'R-19/R-21' : 'R-3.3/R-3.7');
      const insulationBags = Math.ceil((netArea * wasteFactor) / (isI ? 40 : 3.7));

      main = `${studs + totalJackCount + totalCrippleCount} Total Framing Studs`;
      sub = [
        { label: '--- Primary Cut Specifications ---', value: '' },
        { label: `Common Layout Studs (${spacing}" OC)`, value: studs.toString(), highlight: true },
        { label: 'Stud Cut Length', value: formatF(studCutLength / (isI ? 12 : 1000), unitMode), highlight: true },
        { label: isI ? "Standard Plate Stock (16')" : "Standard Plate Stock (4.8m)", value: `${plateBoards} Boards`, highlight: true },
        { label: 'Structural Jack Studs', value: totalJackCount > 0 ? `${totalJackCount} pcs` : 'None' },
        { label: 'Cripple / Header Layout Studs', value: totalCrippleCount.toString() },
      ];

      if (isSlab) {
        sub.push({ label: isI ? "PT Bottom Plate Stock (16')" : "PT Bottom Plate (4.8m)", value: `${ptBoards} Boards (Treated)` });
        sub.push({ label: 'Concrete Anchor Bolts', value: `${anchorBolts} Anchors` });
        sub.push({ label: 'Foam Sill Gasket', value: formatF(sillGasketLF, unitMode) });
      }

      sub.push(
        { label: '--- Openings & Framing Details ---', value: '' },
        { label: 'Jack Studs Details', value: totalJackCount > 0 ? `${totalJackCount} pcs (${Array.from(new Set(jackDetails)).join(', ')})` : 'None' },
        { label: 'Cripple Studs Details', value: `${totalCrippleCount} (Above/Below Openings)` },
        { label: 'Window Sill Plates', value: totalSillLF > 0 ? `${formatF(totalSillLF, unitMode)} (${openings.filter(op => op.type === 'window').length * 2} pcs)` : 'None' },
        { label: 'Fire Blocking', value: needsFireBlocking ? formatF(fireBlockingLF, unitMode) : 'None' },
        { label: 'Header Specifications', value: headerDetails.join(', ') || 'None' }
      );

      if (headerHangers > 0 || hurricaneTies > 0) {
         sub.push({ label: '--- Structural Hardware ---', value: '' });
         if (headerHangers > 0) sub.push({ label: 'Header Hangers (LU28)', value: `${headerHangers} Brackets` });
         if (hurricaneTies > 0) sub.push({ label: 'Hurricane Ties (H2.5A)', value: `${hurricaneTies} Ties` });
      }

      if (isExterior) {
         sub.push({ label: '--- Exterior Envelope ---', value: '' });
         const sType = (c2 || 'osb') === 'zip' ? 'ZIP System' : ((c2 || 'osb') === 'plywood' ? 'Plywood' : 'OSB');
         sub.push({ label: `${sType} Sheathing (4x8)`, value: `${osbSheets} Sheets`, highlight: true });
         
         if ((c2 || 'osb') !== 'zip') {
             sub.push({ label: isI ? "House Wrap (9'x100')" : "House Wrap (2.7m x 30m)", value: `${tyvekRolls} Rolls` });
         } else {
             sub.push({ label: "ZIP Flashing Tape", value: `${Math.ceil(osbSheets / 3)} Rolls` });
         }
         
         sub.push({ label: '--- Insulation & Vapor Barrier ---', value: '' });
         const iType = (c4 || 'fiberglass') === 'mineral' ? 'Mineral Wool' : ((c4 || 'fiberglass') === 'spray' ? 'Spray Foam' : 'Fiberglass');
         if ((c4 || 'fiberglass') === 'spray') {
             sub.push({ label: `Closed Cell Spray Foam`, value: `${Math.ceil(netArea)} Bd Ft`, warning: true });
         } else if ((c4 || 'fiberglass') !== 'none') {
             sub.push({ label: `${iType} Batts (${rValue})`, value: `${insulationBags} Bags` });
         } else {
             sub.push({ label: `Cavity Insulation`, value: `None Selected` });
         }

         if (showScrewLayout) { 
            sub.push({ label: '6-Mil Poly Vapor Barrier', value: `${polyRolls} Rolls` });
            sub.push({ label: 'Acoustical Sealant (10oz)', value: `${sealantTubes} Tubes` });
            sub.push({ label: 'Red Tuck Tape', value: `${tuckTape} Rolls` });
         }
      } else {
         sub.push({ label: '--- Acoustic Insulation ---', value: '' });
         if ((c4 || 'none') !== 'none') {
            const iType = c4 === 'mineral' ? 'Mineral Wool (Sound)' : 'Fiberglass (Sound)';
            sub.push({ label: `${iType} Batts`, value: `${insulationBags} Bags` });
         } else {
            sub.push({ label: `Sound Insulation`, value: `None Selected` });
         }
      }

      if (showFinishing) {
        sub.push({ label: '--- Drywall & Finishing ---', value: '' });
        const dwThickness = (c3 || '1/2') === 'moisture' ? 'Moisture/Mold Resistant' : `${c3 || '1/2'}" Standard`;
        
        sub.push({ label: `${dwThickness} (4x8)`, value: `${drywall8} Sheets`, highlight: true });
        if (drywall10 > 0) sub.push({ label: `${dwThickness} (4x10)`, value: `${drywall10} Sheets` });
        if (drywall12 > 0) sub.push({ label: `${dwThickness} (4x12)`, value: `${drywall12} Sheets` });
        sub.push({ label: 'Joint Compound (5gal)', value: mudBuckets.toString() });
        sub.push({ label: 'Drywall Tape (Rolls)', value: tapeRolls.toString() });
        sub.push({ label: isI ? "Corner Bead (10' Sticks)" : "Corner Bead (3m Sticks)", value: `${beadSticks} Sticks` });
        sub.push({ label: 'Primer (Gallons)', value: primerGallons.toString() });
        sub.push({ label: 'Paint (Gallons, 2 coats)', value: paintGallons.toString() });

        sub.push({ label: '--- Interior Trim ---', value: '' });
        sub.push({ label: 'Baseboard', value: formatF(baseboardLF, unitMode) });
        sub.push({ label: 'Shoe / Quarter Round', value: formatF(shoeLF, unitMode) });
        sub.push({ label: 'Door Casing', value: formatF(doorCasingLF * 1.1, unitMode) });
        sub.push({ label: 'Window Casing', value: formatF(windowCasingLF * 1.1, unitMode) });

        sub.push({ label: '--- Fasteners ---', value: '' });
        sub.push({ label: 'Framing Nails (Est)', value: Math.round(framingNails).toLocaleString() });
        sub.push({ label: 'Sheathing/Drywall Screws', value: Math.round(sheathingScrews).toLocaleString() });
        sub.push({ label: 'Total Finish Nails', value: `${Math.round(totalFinishNails).toLocaleString()} (${finishNailWeightDisplay})` });
      }
    } else if (activeTool === 'rr') {
      const isI = unitMode === 'imp';
      const stockDepths: Record<string, number> = { '2x4': 3.5, '2x6': 5.5, '2x8': 7.25, '2x10': 9.25, '2x12': 11.25 };
      const metricStockDepths: Record<string, number> = { '2x4': 89, '2x6': 140, '2x8': 184, '2x10': 235, '2x12': 286 };
      
      const pitch = roofPitch === 'custom' 
        ? (parseFloat(qty) || 5.0) 
        : parseFloat(roofPitch || '6');
        
      let actualDepth = 5.5; 
      if (rafterStock === 'custom') {
        actualDepth = isI ? (parseF(d1, d2, d3, d4, unitMode) * 12 || 11.25) : (parseF(d1, d2, d3, d4, unitMode) * 1000 || 286);
      } else {
        actualDepth = isI ? (stockDepths[rafterStock] || 5.5) : (metricStockDepths[rafterStock] || 140);
      }
      
      const spanUnits = isI ? valA * 12 : valA * 1000;
      const layoutUnits = isI ? valB * 12 : valB * 1000; 
      const oHangUnits = parseFloat(overhang) || (isI ? 12 : 300); 
      const rThickUnits = parseF(ridgeV1, ridgeV2, ridgeV3, ridgeV4, unitMode) * (isI ? 12 : 1000);
      const spacingUnits = parseFloat(ocSpacing) || (isI ? 16 : 400);

      const fasciaThickness = isI ? 1.5 : 38;
      const trueOverhangRun = Math.max(0, oHangUnits - fasciaThickness);

      const theoreticalRun = spanUnits / 2; 
      const ridgeAdjustment = rThickUnits / 2;
      const adjustedRun = theoreticalRun - ridgeAdjustment;
      
      const hipRidgeAdjustment = ridgeAdjustment * 1.4142;
      const hipAdjustedRun = theoreticalRun - hipRidgeAdjustment;
      
      const angleRad = Math.atan(pitch / 12);
      const angleDeg = angleRad * (180 / Math.PI);
      const diagFactor = 1 / Math.cos(angleRad);

      const ridgeToHeel = adjustedRun * diagFactor; 
      const overhangDiagonal = trueOverhangRun * diagFactor;
      const totalCommonLength = ridgeToHeel + overhangDiagonal;

      const rawSeat = parseF(seatWidthV1, seatWidthV2, seatWidthV3, seatWidthV4, unitMode);
      const seatWidth = rawSeat > 0 ? (isI ? rawSeat * 12 : rawSeat * 1000) : (isI ? 4.125 : 105);
      
      const heelCutVertical = seatWidth * (pitch / 12);
      const plumbCutDepth = actualDepth / Math.cos(angleRad);
      const hap = plumbCutDepth - heelCutVertical;

      const totalVerticalRise = adjustedRun * (pitch / 12);
      const plateToTop = totalVerticalRise + hap;

      const hipFactor = Math.sqrt(Math.pow(16.9705 / 12, 2) + Math.pow(pitch / 12, 2));
      const totalHipLength = (hipAdjustedRun + trueOverhangRun) * hipFactor;
      const rafterCount = layoutUnits > 0 ? (Math.ceil(layoutUnits / spacingUnits) + 1) * 2 : 0;

      const tipToTip = totalCommonLength + (actualDepth * Math.tan(angleRad));
      
      const standardLengthsFt = [8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30];
      const standardLengthsM = [2.4, 3.0, 3.6, 4.2, 4.8, 5.4, 6.0, 6.6, 7.2, 7.8, 8.4, 9.0];
      
      const tipToTipWorking = isI ? tipToTip / 12 : tipToTip / 1000;
      const lenArr = isI ? standardLengthsFt : standardLengthsM;
      const suggestedStock = lenArr.find(l => l > (tipToTipWorking + (isI ? 0.16 : 0.05))) || (isI ? 30 : 9.0);
      const wasteUnits = isI ? (suggestedStock * 12) - tipToTip : (suggestedStock * 1000) - tipToTip;

      const fmtRWork = (valWork: number) => {
        if (!isI) {
          if (valWork >= 1000) return `${(valWork / 1000).toFixed(3)} m (${valWork.toFixed(1)} mm)`;
          return `${valWork.toFixed(1)} mm`;
        }
        return formatF32(valWork, precision);
      };

      main = fmtRWork(totalCommonLength);

      sub = [
        { label: '--- Primary Rafter Cuts ---', value: '' },
        { label: 'Common Rafter (Total Length)', value: fmtRWork(totalCommonLength), highlight: true },
        { label: 'Ridge to Heel Cut (Line Length)', value: fmtRWork(ridgeToHeel), highlight: true },
        { label: 'Plumb Cut Angle', value: angleDeg.toFixed(1) + '°' },
        { label: 'Level Cut Angle', value: (90 - angleDeg).toFixed(1) + '°' },
        { label: '--- Birdsmouth Detail ---', value: '' },
        { label: 'Heel Cut (Vertical Notch)', value: fmtRWork(heelCutVertical) },
        { label: 'Seat Cut (Horizontal Notch)', value: fmtRWork(seatWidth) },
        { label: 'HAP (Height Above Plate)', value: fmtRWork(hap) },
        { label: '--- Elevations & Hip Rafters ---', value: '' },
        { label: 'Adjusted Run (Basis)', value: fmtRWork(adjustedRun) },
        { label: 'Plate to Top Of Rafter', value: fmtRWork(plateToTop) },
        { label: 'Hip/Valley Rafter Length', value: fmtRWork(totalHipLength) },
      ];

      if (layoutUnits > 0) {
         sub.push({ label: 'Total Common Rafters Needed', value: rafterCount.toString() });
         const collarTieCount = Math.floor(rafterCount / 6); 
         const lookouts = Math.ceil(ridgeToHeel / (isI ? 24 : 600)) * 4; 
         
         const ridgeStockMap: Record<string, string> = { '2x4': '2x6', '2x6': '2x8', '2x8': '2x10', '2x10': '2x12', '2x12': '2x14' };
         const ridgeStockSize = rafterStock === 'custom' ? 'Custom/LVL' : (ridgeStockMap[rafterStock] || '2x8');
         
         const ridgeLengthLF = (layoutUnits + (oHangUnits * 2)) / (isI ? 12 : 1000);
         const ridgeBoards = Math.ceil(ridgeLengthLF / (isI ? 16 : 4.8));
         const eaveFasciaLF = ridgeLengthLF * 2;
         const eaveFasciaBoards = Math.ceil(eaveFasciaLF / (isI ? 16 : 4.8));
         const rafterBays = Math.max(0, rafterCount - 2); 
         const hurricaneTies = rafterCount;
         const tieNailsBoxes = Math.ceil((hurricaneTies * 10) / 500);

         sub.push({ label: '--- Ridge, Fascia & Gables ---', value: '' });
         sub.push({ label: `Ridge Board (${ridgeStockSize})`, value: `${ridgeBoards}x ${isI ? "16'" : "4.8m"} Boards` });
         sub.push({ label: `Sub-Fascia (Eaves)`, value: `${eaveFasciaBoards}x ${isI ? "16'" : "4.8m"} Boards` });
         sub.push({ label: 'Gable Fly Rafters', value: `4x ${suggestedStock}${isI ? "'" : "m"} Boards` });
         sub.push({ label: 'Gable Lookouts (Ladder)', value: `${lookouts} pcs` });

         sub.push({ label: '--- Structural Hardware & Bracing ---', value: '' });
         if (collarTieCount > 0) sub.push({ label: 'Collar Ties (1x6 or 2x4)', value: `${collarTieCount} pcs (Upper 1/3)` });
         sub.push({ label: 'Hurricane Ties (H2.5A)', value: `${hurricaneTies} Ties` });
         sub.push({ label: 'Structural Nails (1.5")', value: `${tieNailsBoxes} Box(es)` });

         sub.push({ label: '--- Ventilation Prep ---', value: '' });
         sub.push({ label: 'Foam Rafter Baffles', value: `${rafterBays} Baffles` });
         sub.push({ label: 'Staples (3/8")', value: `1 Box` });
      }

      sub.push(
        { label: '--- Stock Length & Waste ---', value: '' },
        { label: 'True Tip-to-Tip Length', value: fmtRWork(tipToTip) },
        { label: 'Suggested Stock', value: suggestedStock + (isI ? "' Board" : "m Board") },
        { label: 'Cut-off Waste', value: fmtRWork(wasteUnits) },
        { label: 'Note:', value: 'Overhang reflects a true fascia-board deduction.' }
      );
      
      if (layoutUnits > 0) {
        sub.push({ label: '--- Jack Rafter Cut List ---', value: '' });
        const decreasePerInterval = spacingUnits * (pitch / 12) * diagFactor;
        const totalJackIntervals = Math.floor(layoutUnits / 2 / spacingUnits); 
        
        for (let i = 1; i <= totalJackIntervals; i++) {
            const jackLength = totalCommonLength - (decreasePerInterval * i);
            if (jackLength > 0) {
              sub.push({ 
                label: `Jack ${i} (${isI ? (i * spacingUnits).toFixed(0) + '"' : (i * spacingUnits).toFixed(0) + 'mm'} from corner)`, 
                value: fmtRWork(jackLength),
                highlight: true
              });
            }
        }
      }
    } else if (activeTool === 'si') {
      const isI = unitMode === 'imp';
      let totalArea = 0;
      let totalStarter = 0;
      let totalJChannel = 0;
      let totalWindowDrip = 0;
      let totalDoorSill = 0;
      let totalFreezeBoard = 0;
      let totalWaterproofing = 0;
      let totalWallLength = 0;
      let totalWallHeight = 0; 
      
      let wallStrappingLF = 0; 

      sidingSections.forEach(sec => {
        let area = 0;

        if (sec.type === 'rect') {
          area = sec.w * sec.h;
          totalStarter += sec.w;
          totalFreezeBoard += sec.w;
          totalWallHeight = Math.max(totalWallHeight, sec.h);
          
          if (hasPointLoad) { 
            const horizontalRows = isI ? (Math.ceil((sec.h * 12) / 16) + 1) : (Math.ceil(sec.h / 400) + 1);
            wallStrappingLF += (horizontalRows * sec.w);
          } else {
            const verticalRuns = isI ? (Math.ceil((sec.w * 12) / 16) + 1) : (Math.ceil(sec.w / 400) + 1);
            wallStrappingLF += (verticalRuns * sec.h);
          }
        } else {
          area = (sec.w * sec.h) / 2;
          totalFreezeBoard += Math.sqrt(Math.pow(sec.w / 2, 2) + Math.pow(sec.h, 2)) * 2;
          totalWallHeight = Math.max(totalWallHeight, sec.h);
          
          if (hasPointLoad) {
            const horizontalRows = isI ? (Math.ceil((sec.h * 12) / 16) + 1) : (Math.ceil(sec.h / 400) + 1);
            wallStrappingLF += (horizontalRows * (sec.w / 2));
          } else {
            const verticalRuns = isI ? (Math.ceil((sec.w * 12) / 16) + 1) : (Math.ceil(sec.w / 400) + 1);
            wallStrappingLF += (verticalRuns * (sec.h / 2));
          }
        }
        totalWallLength += sec.w;
        totalArea += area;
      });

      let openingArea = 0;
      let openingPerimeter = 0;
      sidingOpenings.forEach(op => {
        openingArea += op.w * op.h;
        if (op.type === 'window') {
          const perimeter = (op.w + op.h) * 2;
          openingPerimeter += perimeter;
          totalJChannel += perimeter;
          totalWaterproofing += perimeter;
          totalWindowDrip += op.w;
        } else {
          const doorJ = (op.h * 2) + op.w;
          openingPerimeter += doorJ; 
          totalJChannel += doorJ;
          totalWaterproofing += doorJ;
          totalWindowDrip += op.w; 
        }
      });

      const netAreaBeforeWaste = totalArea - openingArea;
      const wasteMultiplier = 1 + (parseFloat(waste) || 10) / 100;
      const netArea = netAreaBeforeWaste * wasteMultiplier;
      
      const bH = isI ? (parseFloat(boardWidth) || 8) : (parseFloat(boardWidth) || 20);
      const bL = isI ? (parseFloat(sidingBoardLength) || 12) : (parseFloat(sidingBoardLength) || 3.6);
      const vOverlap = isI ? (parseFloat(sidingOverlap) || 1) : (parseFloat(sidingOverlap) || 2.5);
      const hOverlap = isI ? (parseFloat(sidingHorizontalOverlap) || 0) : (parseFloat(sidingHorizontalOverlap) || 0);

      const netExposure = isI ? (bH - vOverlap) : (bH - vOverlap) / 100; 
      const effectiveLength = isI ? (bL - (hOverlap / 12)) : (bL - (hOverlap / 100)); 

      const coveragePerLF = isI ? (netExposure / 12) : netExposure; 
      
      const totalLF = isI 
        ? (netArea / coveragePerLF) 
        : ((netArea / 1000000) / coveragePerLF); 
        
      const boardCount = Math.ceil(totalLF / effectiveLength);

      const cornerStrappingLF = (sidingInsideCorners + sidingOutsideCorners) * 2 * totalWallHeight;
      const totalStrappingLF = wallStrappingLF + openingPerimeter + cornerStrappingLF;
      
      const strapping8 = isI ? Math.ceil(totalStrappingLF / 8) : Math.ceil(totalStrappingLF / 2400);
      const strapping10 = isI ? Math.ceil(totalStrappingLF / 10) : Math.ceil(totalStrappingLF / 3000);
      const strapping12 = isI ? Math.ceil(totalStrappingLF / 12) : Math.ceil(totalStrappingLF / 3600);
      const strappingFasteners = isI ? Math.ceil((totalStrappingLF * 12 / 16) * 2) : Math.ceil((totalStrappingLF / 400) * 2);

      const insideCornerPosts = Math.ceil((sidingInsideCorners * totalWallHeight) / (isI ? 10 : 3));
      const outsideCornerPosts = Math.ceil((sidingOutsideCorners * totalWallHeight) / (isI ? 10 : 3));
      
      const sidingNails = isI ? Math.ceil((totalLF * 12) / 16) : Math.ceil((totalLF * 1000) / 400);
      const nailCoils = Math.ceil(sidingNails / 3600); 

      const tyvekRolls = isI ? Math.ceil((netAreaBeforeWaste * 1.10) / 900) : Math.ceil(((netAreaBeforeWaste / 1000000) * 1.10) / 83.6); 
      const tuckTapeRolls = isI 
        ? Math.ceil(((totalWallLength * 2 + openingPerimeter) * 1.15) / 196) 
        : Math.ceil(((totalWallLength * 2 + openingPerimeter) * 1.15) / 60000);
      const staples = isI ? Math.ceil(netAreaBeforeWaste) : Math.ceil(netAreaBeforeWaste / 1000000);

      const totalCaulkLF = openingPerimeter + ((sidingInsideCorners + sidingOutsideCorners) * 2 * totalWallHeight);
      const caulkTubes = isI ? Math.ceil((totalCaulkLF * 1.10) / 25) : Math.ceil((totalCaulkLF * 1.10) / 7.6);

      const sidingSquares = (netAreaBeforeWaste * wasteMultiplier) / 100;
      const starterSticks = Math.ceil(totalStarter / 12);
      const jChannelSticks = Math.ceil(totalJChannel / 12);
      const dripCapSticks = Math.ceil(totalWindowDrip / 12);
      const freezeSticks = Math.ceil(totalFreezeBoard / 12);

      main = isI ? `${Math.round(netAreaBeforeWaste)} SQ FT` : `${(netAreaBeforeWaste / 1000000).toFixed(1)} M²`;
      sub = [
        { label: '--- Siding Tally ---', value: '' },
        { label: 'Net Siding Area', value: main, highlight: true },
        { label: isI ? 'Siding Squares (w/ Waste)' : 'Siding Squares', value: isI ? `${sidingSquares.toFixed(2)} SQ` : `${(netAreaBeforeWaste / 1000000 / 9.29).toFixed(2)} SQ`, highlight: true },
        { label: 'Total Linear Feet', value: isI ? Math.ceil(totalLF).toLocaleString() + ' LF' : (totalLF).toFixed(1) + ' m', highlight: true },
        { label: `Board Count (${isI ? bL + "'" : bL + "m"})`, value: boardCount.toLocaleString(), highlight: true },
        { label: isI ? "Starter Strip (12' Sticks)" : "Starter Strip", value: isI ? `${starterSticks} pcs (${Math.ceil(totalStarter)} LF)` : formatF(totalStarter, unitMode) },
        { label: isI ? "J-Channel (12' Sticks)" : "J-Channel", value: isI ? `${jChannelSticks} pcs (${Math.ceil(totalJChannel)} LF)` : formatF(totalJChannel, unitMode) },
        { label: isI ? "Drip Cap / Flashing (12' Sticks)" : "Drip Cap Flashing", value: isI ? `${dripCapSticks} pcs (${Math.ceil(totalWindowDrip)} LF)` : formatF(totalWindowDrip, unitMode) },
        { label: isI ? "Freeze Board / Rake (12' Sticks)" : "Freeze Board", value: isI ? `${freezeSticks} pcs (${Math.ceil(totalFreezeBoard)} LF)` : formatF(totalFreezeBoard, unitMode) },
        { label: 'Inside Corner Posts (10\')', value: `${insideCornerPosts} pcs` },
        { label: 'Outside Corner Posts (10\')', value: `${outsideCornerPosts} pcs` },
        { label: 'Exterior Sealant (10oz Tubes)', value: `${caulkTubes} Tubes` },
        { label: 'Waterproofing Strip', value: formatF(totalWaterproofing, unitMode) },
        { label: 'Siding Nails (Approx)', value: `${sidingNails.toLocaleString()} (${nailCoils} Coils)` },
        { label: '--- Strapping (Rain Screen) ---', value: '' },
        { label: 'Total Strapping', value: formatF(totalStrappingLF, unitMode) },
        { label: 'Layout Note', value: hasPointLoad ? 'Strapping runs Horizontally (16" OC)' : 'Strapping runs Vertically (16" OC)' },
        { label: isI ? "8' Sticks" : "2.4m Sticks", value: strapping8.toString() },
        { label: isI ? "10' Sticks" : "3.0m Sticks", value: strapping10.toString() },
        { label: 'Strapping Fasteners', value: strappingFasteners.toLocaleString() },
        { label: '--- Weather Barrier ---', value: '' },
        { label: isI ? "Tyvek Rolls (9'x100')" : "Tyvek Rolls (2.7mx30m)", value: tyvekRolls.toString() },
        { label: 'Tuck Tape (60m Rolls)', value: tuckTapeRolls.toString() },
        { label: 'Staples', value: staples.toLocaleString() },
        { label: 'Note:', value: `Board count includes ${waste}% waste factor.` }
      ];
    } else if (activeTool === 'bc') {
      const isI = unitMode === 'imp';
      const isCMU = mmMaterial === 'cmu'; 

      // Directly use unit-aware valA, valB, valC, valD (forced to Feet or Meters internally)
      const wLenBase = valA;
      const wHeiBase = valB;
      const opLenBase = valC;
      const opHeiBase = valD;

      const wastePct = parseFloat(waste) || 5; 
      const wasteFactor = 1 + (wastePct / 100);

      const blockL = isI ? (isCMU ? 16 : 8) : (isCMU ? 400 : 200);
      const blockH = isI ? (isCMU ? 8 : 2.66) : (isCMU ? 200 : 65);

      if (wLenBase > 0 && wHeiBase > 0) {
         const workingWLen = isI ? wLenBase * 12 : wLenBase * 1000;
         const workingWHei = isI ? wHeiBase * 12 : wHeiBase * 1000;
         
         const blocksPerRow = workingWLen / blockL;
         const courses = workingWHei / blockH;
         let totalExactUnits = blocksPerRow * courses;

         if (opLenBase > 0 && opHeiBase > 0) {
            const workingOpLen = isI ? opLenBase * 12 : opLenBase * 1000;
            const workingOpHei = isI ? opHeiBase * 12 : opHeiBase * 1000;
            const opBlocks = (workingOpLen / blockL) * (workingOpHei / blockH);
            totalExactUnits = Math.max(0, totalExactUnits - opBlocks);
         }

         const orderQty = Math.ceil(totalExactUnits * wasteFactor);

         let startingBlock = isI ? (isCMU ? '16"' : '8"') : (isCMU ? '400mm' : '200mm');
         const leftover = workingWLen % blockL;
         if (leftover > 0 && leftover < (blockL / 2)) {
             startingBlock = isI ? (isCMU ? '8" (Half)' : '4" (Half)') : (isCMU ? '200mm' : '100mm');
         }

         const sqFtArea = isI ? (wLenBase * wHeiBase) : (wLenBase * wHeiBase * 10.7639);
         const opSqFt = isI ? (opLenBase * opHeiBase) : (opLenBase * opHeiBase * 10.7639);
         const netSqFtArea = Math.max(0, sqFtArea - opSqFt);

         const mortarBags = Math.ceil((netSqFtArea / 100) * (isCMU ? 3.5 : 7.0));
         const groutYards = isCMU ? (netSqFtArea / 100) * 1.0 : 0;
         const groutM3 = groutYards * 0.764555;

         main = orderQty.toLocaleString();

         sub = [
            { label: 'Exact Units Required', value: Math.ceil(totalExactUnits).toLocaleString() },
            { label: `Order Quantity (${wastePct}% Waste)`, value: main, highlight: true },
            { label: '--- Layout Details ---', value: '' },
            { label: 'Vertical Courses (Rows)', value: courses.toFixed(1) },
            { label: 'Units Per Course', value: blocksPerRow.toFixed(1) },
            { label: 'Symmetrical Starting Block', value: startingBlock },
            { label: '--- Mortar & Fill Estimator ---', value: '' },
            { label: isCMU ? 'Type S Mortar (80lb Bags)' : 'Type N Mortar (70lb Bags)', value: `${mortarBags} Bags`, highlight: true }
         ];

         if (isCMU) {
            sub.push({ 
              label: 'Core Fill Grout', 
              value: isI ? `${groutYards.toFixed(2)} CU YDS` : `${groutM3.toFixed(2)} M³`, 
              highlight: true 
            });
            sub.push({ label: 'Rebar Recommendation', value: isI ? '#4 Bar @ 32" OC' : '10M Bar @ 800mm OC' });
         }

      } else {
         main = '0';
         sub = [{ label: 'Status', value: 'Awaiting Wall Dimensions...' }];
      }
    } else if (activeTool === 'tl') {
      const isI = unitMode === 'imp';
      
      const rLenM = parseF(roomLenV1, roomLenV2, roomLenV3, roomLenV4, unitMode, inputUnits['tl_roomlen'] || 'm');
      const rWidM = parseF(roomWidV1, roomWidV2, roomWidV3, roomWidV4, unitMode, inputUnits['tl_roomwid'] || 'm');
      const tLenM = parseF(tileLenV1, tileLenV2, tileLenV3, tileLenV4, unitMode, inputUnits['tl_tilelen'] || 'mm');
      const tWidM = parseF(tileWidV1, tileWidV2, tileWidV3, tileWidV4, unitMode, inputUnits['tl_tilewid'] || 'mm');
      const groutM = parseF(groutV1, groutV2, groutV3, groutV4, unitMode, inputUnits['tl_grout'] || 'mm');

      if (tLenM > 0 && tWidM > 0 && rLenM > 0 && rWidM > 0) {
        const roomLWork = isI ? rLenM * 12 : rLenM * 1000;
        const roomWWork = isI ? rWidM * 12 : rWidM * 1000;
        
        const tileLWork = isI ? tLenM * 12 : tLenM * 1000;
        const tileWWork = isI ? tWidM * 12 : tWidM * 1000;
        const groutWork = isI ? groutM * 12 : groutM * 1000;

        const effL = tileLWork + groutWork;
        const effW = tileWWork + groutWork;

        const nL = Math.floor((roomLWork + groutWork) / effL);
        const nW = Math.floor((roomWWork + groutWork) / effW);
        
        const startCutL = (roomLWork - (nL * effL - groutWork)) / 2;
        const startCutW = (roomWWork - (nW * effW - groutWork)) / 2;

        // --- RELATIVE ANTI-SLIVER OPTIMIZATION ---
        let optCutL = startCutL;
        let shiftLStr = "Center Line";
        if (startCutL > 0 && startCutL < tileLWork / 2) {
          optCutL += (tileLWork / 2); 
          shiftLStr = "Offset Center by 1/2 Tile";
        }

        let optCutW = startCutW;
        let shiftWStr = "Center Line";
        if (startCutW > 0 && startCutW < tileWWork / 2) {
          optCutW += (tileWWork / 2);
          shiftWStr = "Offset Center by 1/2 Tile";
        }

        const totalTilesExact = Math.ceil(roomLWork / effL) * Math.ceil(roomWWork / effW);
        const wasteFactor = 1 + (parseFloat(waste) || 10) / 100;
        const totalTilesWaste = Math.ceil(totalTilesExact * wasteFactor);

        main = totalTilesWaste + ' Tiles';
                
        const areaSqFt = isI ? (rLenM * rWidM) : (rLenM * rWidM * 10.7639);
        const mortarBags = Math.ceil(areaSqFt / 40);
        const groutBags = Math.ceil(areaSqFt / 35);
                
        const fmt = (val: number) => isI ? formatF32(val, precision).replace(/"/g, '') + '"' : `${val.toFixed(1)} mm`;

        sub = [
          { label: 'Exact Tiles (No Cuts)', value: totalTilesExact.toLocaleString() },
          { label: `Order Qty (+${waste || 10}% Waste)`, value: totalTilesWaste.toLocaleString(), highlight: true },
          { label: '--- Length Layout ---', value: '' },
          { label: 'Starting Layout Line', value: shiftLStr },
          { label: 'Perimeter Cut Size', value: fmt(optCutL), highlight: true },
          { label: 'Full Tiles in Row', value: nL.toString() },
          { label: '--- Width Layout ---', value: '' },
          { label: 'Starting Layout Line', value: shiftWStr },
          { label: 'Perimeter Cut Size', value: fmt(optCutW), highlight: true },
          { label: 'Full Tiles in Row', value: nW.toString() },
          { label: '--- Setting Materials ---', value: '' },
          { label: 'Thinset Mortar (50lb Bags)', value: `${mortarBags} Bags` },
          { label: 'Grout (25lb Bags)', value: `${groutBags} Bags` }
        ];
      } else {
        main = '0 Tiles';
        sub = [{ label: 'Status', value: 'Awaiting Tile Dimensions...' }];
      }
    } else if (activeTool === 'oc') {
      const isI = unitMode === 'imp';
      
      // Directly use unit-aware valA and valB (forced to base Feet or Meters)
      const runWorking = isI ? valA * 12 : valA * 1000; 
      const count = parseInt(qty) || 2;

      // Smart Universal Formatter
      const fmt = (valWork: number) => {
        if (!isI) return `${valWork.toFixed(1)} mm`;
        const rawInches = formatF32(valWork, precision).replace(/"/g, '');
        const ft = Math.floor(valWork / 12);
        const remInches = formatF32(valWork - (ft * 12), precision).replace(/"/g, '');
        
        if (ft === 0) return `${rawInches}"`;
        const paren = remInches === '0' ? `(${ft}')` : `(${ft}' ${remInches}")`;
        return `${paren} ${rawInches}"`;
      };

      if (ocMode === 'equal') {
        const spacing = runWorking / count;
        const firstMark = spacing / 2;
        
        main = fmt(spacing);
        sub = [
          { label: '--- Layout Specifications ---', value: '' },
          { label: 'Spacing (On-Center)', value: fmt(spacing), highlight: true },
          { label: 'First Mark Center', value: fmt(firstMark), highlight: true },
          { label: '--- Running Layout Marks ---', value: '' },
        ];
        
        for (let i = 0; i < count; i++) {
          const mark = firstMark + (i * spacing);
          sub.push({ label: `Mark ${i + 1}`, value: fmt(mark), highlight: true });
        }
        
      } else if (ocMode === 'baluster') {
        // Safe metric baluster parsing via valB
        const balW = isI ? valB * 12 : valB * 1000;
        
        let n = 0;
        let midGap = 0;
        let startEndGap = 0;
        let ctc = 0;

        if (balustersubMode === 'code') {
          const rawMax = parseF(maxOpV1, maxOpV2, maxOpV3, maxOpV4, unitMode, inputUnits['oc_maxop'] || 'mm');
          const defaultMax = isI ? 3.875 : 100;
          const maxOp = rawMax > 0 ? (isI ? rawMax * 12 : rawMax * 1000) : defaultMax;
          
          const targetGap = Math.min(maxOp, defaultMax);
          n = Math.ceil((runWorking - targetGap) / (balW + targetGap));
          midGap = (runWorking - n * balW) / (n + 1);
          startEndGap = midGap;
          ctc = midGap + balW;
        } else {
          const rawGap = parseF(desiredGapV1, desiredGapV2, desiredGapV3, desiredGapV4, unitMode, inputUnits['oc_desiredgap'] || 'mm');
          const desiredG = rawGap > 0 ? (isI ? rawGap * 12 : rawGap * 1000) : (isI ? 3 : 75);
          
          n = Math.floor((runWorking + desiredG) / (balW + desiredG));
          midGap = desiredG;
          if (FixedSpacing) midGap = (runWorking - n * balW) / (n + 1);
          startEndGap = (runWorking - (n * balW + (n - 1) * midGap)) / 2;
          ctc = balW + midGap;
        }

        main = `${n} Balusters`;
        sub = [
          { label: '--- Baluster Summary ---', value: '' },
          { label: 'Total Balusters Needed', value: n.toString(), highlight: true },
          { label: 'Gap Between Balusters', value: fmt(midGap), highlight: true },
          { label: 'Start / End Edge Gap', value: fmt(startEndGap) },
          { label: 'Center-to-Center Spacing', value: fmt(ctc) },
        ];

        sub.push({ label: '--- Running Layout (Left Edges) ---', value: '' });
        let currentPos = startEndGap;
        for (let i = 0; i < n; i++) {
          sub.push({ label: `Baluster ${i + 1}`, value: fmt(currentPos), highlight: true });
          currentPos += balW + midGap;
        }
        
      } else {
        // Structural Post Layout
        const pRaw = parseF(postWidthV1, postWidthV2, postWidthV3, postWidthV4, unitMode, inputUnits['oc_postwidth'] || 'mm');
        const pWidth = pRaw > 0 ? (isI ? pRaw * 12 : pRaw * 1000) : (isI ? 3.5 : 89);
        
        const ctc = (runWorking - pWidth) / (count - 1);
        const spacerBlock = ctc - pWidth; 

        main = fmt(ctc);
        sub = [
          { label: '--- Structural Summary ---', value: '' },
          { label: 'Center-to-Center Spacing', value: fmt(ctc), highlight: true },
          { label: 'Post Width Applied', value: fmt(pWidth) },
          { label: 'Spacer Block Cut Length', value: fmt(spacerBlock), warning: true },
        ];
        
        for (let i = 0; i < count; i++) {
          const start = i * ctc;
          const end = start + pWidth;
          const centerStr = fmt(start + (pWidth / 2));

          sub.push({ label: `--- Post ${i + 1} Layout ---`, value: '' });
          sub.push({ label: 'Left Edge Mark', value: fmt(start) });
          sub.push({ label: 'Center Mark', value: centerStr, highlight: true });
          sub.push({ label: 'Right Edge Mark', value: fmt(end) });
        }
      }
    } else if (activeTool === 'lv') {
      const isI = unitMode === 'imp';
      
      const oBeta = typeof orientation !== 'undefined' ? (orientation.beta || 0) : 0;
      const oGamma = typeof orientation !== 'undefined' ? (orientation.gamma || 0) : 0;

      const angle = isSlopeLocked && lockedAngle !== null ? lockedAngle : Math.abs(oBeta);
      const roll = isSlopeLocked && lockedRoll !== null ? lockedRoll : oGamma;
      
      const rad = (angle * Math.PI) / 180;
      const slopePct = Math.tan(rad) * 100;
      const dropPerFootInches = Math.tan(rad) * 12; 
      const dropPerMeterMm = Math.tan(rad) * 1000; 

      main = angle.toFixed(1) + '°';

      if (isSlopeLocked) {
        sub = [
          { label: '--- Pitch & Roll Readout ---', value: '' },
          { label: 'Primary Angle (Pitch)', value: angle.toFixed(1) + '°', highlight: true },
          { label: 'Side-to-Side (Roll)', value: Math.abs(roll) < 0.5 ? 'LEVEL' : `Off by ${Math.abs(roll).toFixed(1)}°`, warning: Math.abs(roll) >= 0.5 },
          { label: '--- Grade & Drop Rate ---', value: '' },
          { label: 'Percent Grade', value: slopePct.toFixed(2) + '%', highlight: true },
        ];

        if (isI) {
          const getFrac = (dec: number) => {
             const nearest16th = Math.round(dec * 16);
             if (nearest16th === 0) return '0"';
             const whole = Math.floor(nearest16th / 16);
             const rem = nearest16th % 16;
             if (rem === 0) return `${whole}"`;
             
             const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : a;
             const div = gcd(rem, 16);
             const fracStr = `${rem/div}/${16/div}"`;
             return whole > 0 ? `${whole} ${fracStr}` : fracStr;
          };

          sub.push({ label: 'Drop per Foot', value: getFrac(dropPerFootInches), highlight: true });
          sub.push({ label: 'Roof Pitch Equivalent', value: `${dropPerFootInches.toFixed(2)} / 12` });
        } else {
          sub.push({ label: 'Drop per Meter', value: `${dropPerMeterMm.toFixed(1)} mm`, highlight: true });
        }

        if (angle > 0) {
           sub.push({ label: '--- Compliance Diagnostics ---', value: '' });

           if (slopePct >= 1.0 && slopePct <= 3.0) {
              sub.push({ label: 'Standard Pipe Drainage', value: 'Pass (1-3% Grade)' });
           } else if (slopePct > 3.0) {
              sub.push({ label: 'Standard Pipe Drainage', value: 'Over-sloped (>3%)', warning: true });
           } else {
              sub.push({ label: 'Standard Pipe Drainage', value: 'Under-sloped (<1%)', warning: true });
           }

           if (slopePct <= 6.7) {
              sub.push({ label: 'Wheelchair Ramp Limit', value: 'Pass (<= 6.7%)' });
           } else {
              sub.push({ label: 'Wheelchair Ramp Limit', value: 'Fail (Too Steep)', warning: true });
           }
        }

      } else {
        sub = [
          { label: 'Pitch (Main)', value: Math.abs(oBeta).toFixed(1) + '°' },
          { label: 'Roll (Side)', value: oGamma.toFixed(1) + '°' },
          { label: 'Tap "Calculate Slope" to lock and analyze.', value: '' }
        ];
      }
    } else if (activeTool === 'cm') {
      const spring = a1 === '' || isNaN(parseFloat(a1)) ? 38 : parseFloat(a1);
      const wall = b1 === '' || isNaN(parseFloat(b1)) ? 90 : parseFloat(b1);
      
      const sRad = spring * Math.PI / 180;
      const wRad = wall * Math.PI / 180;
      
      let miterFlat = 0;
      if (wall === 0) {
        miterFlat = spring === 0 ? 0 : 90;
      } else {
        miterFlat = Math.atan(Math.sin(sRad) / Math.tan(wRad / 2)) * 180 / Math.PI;
      }
      const bevelFlat = Math.asin(Math.cos(sRad) * Math.cos(wRad / 2)) * 180 / Math.PI;

      const miterNested = (180 - wall) / 2;
      const requiresNesting = Math.abs(bevelFlat) > 50;

      main = `${Math.abs(miterFlat).toFixed(1)}° Miter`;
      
      sub = [
        { label: '--- Flat Cut (Compound Laying Flat) ---', value: '' },
        { label: 'Saw Miter Angle', value: Math.abs(miterFlat).toFixed(2) + '°', highlight: true },
        { label: 'Saw Bevel Angle', value: Math.abs(bevelFlat).toFixed(2) + '°', highlight: true },
        { label: '--- Nested Cut (Upside Down Against Fence) ---', value: '' },
        { label: 'Saw Miter Angle', value: Math.abs(miterNested).toFixed(2) + '°', highlight: true },
        { label: 'Saw Bevel Angle', value: '0.00° (Straight Chop)' },
      ];

      if (requiresNesting) {
        sub.push({ label: 'CUTTING ALERT', value: 'Bevel exceeds 50°. You MUST cut nested against fence.', warning: true });
      }

      sub.push({ label: '--- Cut Positioning (Laying Flat) ---', value: '' });
      sub.push({ label: 'Inside Corner (Left Side)', value: 'Top edge against fence. Miter Right.' });
      sub.push({ label: 'Inside Corner (Right Side)', value: 'Bottom edge against fence. Miter Left.' });
      sub.push({ label: 'Outside Corner (Left Side)', value: 'Bottom edge against fence. Miter Left.' });
      sub.push({ label: 'Outside Corner (Right Side)', value: 'Top edge against fence. Miter Right.' });
    } else if (activeTool === 'ds') {
      const isI = unitMode === 'imp';
      const category = subMode || 'joist';
      const material = woodSpecies || 'spf';
      
      let ocNum = parseFloat(ocSpacing) || (isI ? 16 : 400);
      if (!isI && ocNum <= 24) ocNum = 400; // Auto-correct imperial carryovers
      const oc = ocNum.toString();
      
      const isStiff = deflectionLimit === 'L480';
      const isLuxury = deflectionLimit === 'L600';
      const wetMultiplier = (isWetService || isMarine) ? 0.85 : 1.0;
      const gradeMultiplier = woodGrade === 'select' ? 1.1 : 1.0;
      
      const rawSpan = valA;
      const rawSec = valB;

      // Force internal physics engine into Feet
      const spanFt = isI ? rawSpan : rawSpan * 3.28084;
      const secFt = isI ? rawSec : rawSec * 3.28084;

      main = 'Span Master';

      const fmt = (valInFt: number) => {
        if (!isI) return `${(valInFt * 0.3048).toFixed(2)} m`;
        const totalInches = Math.round(valInFt * 12);
        if (totalInches === 0) return '0"';
        if (totalInches < 24) return `${totalInches}"`; 
        const f = Math.floor(totalInches / 12);
        const i = totalInches % 12;
        return i > 0 ? `${f}' ${i}"` : `${f}'`;
      };

      const spacingMod = Math.sqrt(16 / ocNum);
      
      if (category === 'joist') {
        const estSpan = (depth: number) => {
          let base = depth * 1.5; 
          if (material === 'syp' || material === 'fir') base *= 1.15;
          if (material === 'i-joist') base *= 1.45; 
          return base * spacingMod;
        };

        const table = typeof SPAN_TABLES !== 'undefined' ? SPAN_TABLES?.joist?.[material]?.[oc] || {} : {};
        
        const adjustSpan = (spanStr: string | undefined, depth: number) => {
          let totalIn = 0;
          if (spanStr && spanStr !== 'N/A' && material !== 'i-joist') {
            const parts = spanStr.match(/(\d+)'\s*(\d+)"/);
            if (parts) totalIn = (parseInt(parts[1]) * 12) + parseInt(parts[2]);
            else totalIn = estSpan(depth) * 12;
          } else {
            totalIn = estSpan(depth) * 12;
          }
          
          totalIn *= wetMultiplier * gradeMultiplier;
          if (isStiff) totalIn *= 0.9;
          if (isLuxury) totalIn *= 0.8;
          return fmt(totalIn / 12);
        };

        const maxAllowedCantileverFt = spanFt > 0 ? (spanFt / 3) : (estSpan(9.25) / 3);        

        sub = [
          { label: `--- ${material.toUpperCase()} Joists (${oc}" OC) ---`, value: '' },
          { label: 'Lumber Grade Applied', value: woodGrade === 'select' ? 'Select Structural' : 'No. 2 / Standard' },
        ];

        if (material === 'i-joist') {
          sub.push({ label: '9-1/2" I-Joist Max Span', value: adjustSpan(undefined, 9.5), highlight: true });
          sub.push({ label: '11-7/8" I-Joist Max Span', value: adjustSpan(undefined, 11.875), highlight: true });
          sub.push({ label: '14" I-Joist Max Span', value: adjustSpan(undefined, 14), highlight: true });
          sub.push({ label: '16" I-Joist Max Span', value: adjustSpan(undefined, 16), highlight: true });
        } else {
          sub.push({ label: '2x6 Max Clear Span', value: adjustSpan(table['2x6'], 5.5), highlight: true });
          sub.push({ label: '2x8 Max Clear Span', value: adjustSpan(table['2x8'], 7.25), highlight: true });
          sub.push({ label: '2x10 Max Clear Span', value: adjustSpan(table['2x10'], 9.25), highlight: true });
          sub.push({ label: '2x12 Max Clear Span', value: adjustSpan(table['2x12'], 11.25), highlight: true });
        }

        if (isWetService || isMarine) sub.push({ label: 'Wet Service Reduction', value: 'Spans reduced by 15%.' });
        if (isMarine) sub.push({ label: 'Marine Hardware', value: 'Use 316 Stainless fasteners.' });

        if (secFt > 0) { 
          sub.push({ label: '--- Cantilever Analysis ---', value: '' });
          sub.push({ label: 'Max Recommended Overhang', value: `${fmt(maxAllowedCantileverFt)} (1/3 Backspan)`, highlight: true });
          if (secFt > maxAllowedCantileverFt) {
              sub.push({ label: '⚠️ DANGER', value: 'Overhang exceeds 1/3 of backspan!', warning: true });
          }
        }
        sub.push({ label: 'Minimum End Bearing', value: '1.5 inches on each support' });
        
      } else if (category === 'rafter') {
        const deadLoad = 15; 
        const pitch = parseFloat(qty3) || 6;
        const pitchCos = Math.cos(Math.atan(pitch / 12));

        sub = [
          { label: `--- ${material.toUpperCase()} Rafters (${oc}" OC) ---`, value: '' },
          { label: 'Important Note', value: 'Measurements show Max Horizontal RUN. Sloped RAFTER LENGTHS are in parentheses.', warning: true },
          { label: 'Roof Pitch Applied', value: `${pitch}/12 Pitch` },
        ];

        const snowTiers = [
          { name: 'Light/No Snow (20 PSF Live)', load: 20 },
          { name: 'Medium Snow (30 PSF)', load: 30 },
          { name: 'Heavy Snow (50 PSF)', load: 50 }
        ];

        snowTiers.forEach(tier => {
          const totalLoad = deadLoad + tier.load;
          
          const adjustSpan = (depth: number) => {
            let base = depth * 1.6; 
            if (material === 'syp' || material === 'fir') base *= 1.15;
            if (material === 'i-joist') base *= 1.4;
            
            base *= spacingMod; 
            base *= Math.pow(40 / totalLoad, 0.5); 
            base *= pitchCos; 
            base *= wetMultiplier * gradeMultiplier;

            const horizRunFt = base;
            const rafterLenFt = horizRunFt / pitchCos;
            return `${fmt(horizRunFt)} Run (${fmt(rafterLenFt)} Len)`;
          };

          const ohInches = Math.min(24, Math.round(5.5 * 1.6 * Math.pow(40/totalLoad, 0.5) * spacingMod * 12 / 4));

          sub.push({ label: `--- ${tier.name} ---`, value: '' });
          if (material === 'i-joist') {
             sub.push({ label: '9-1/2" I-Joist Max', value: adjustSpan(9.5), highlight: true });
             sub.push({ label: '11-7/8" I-Joist Max', value: adjustSpan(11.875), highlight: true });
             sub.push({ label: '14" I-Joist Max', value: adjustSpan(14), highlight: true });
             sub.push({ label: '16" I-Joist Max', value: adjustSpan(16), highlight: true });
          } else {
             sub.push({ label: '2x6 Rafter Max', value: adjustSpan(5.5), highlight: true });
             sub.push({ label: '2x8 Rafter Max', value: adjustSpan(7.25), highlight: true });
             sub.push({ label: '2x10 Rafter Max', value: adjustSpan(9.25), highlight: true });
             sub.push({ label: '2x12 Rafter Max', value: adjustSpan(11.25), highlight: true });
          }
          sub.push({ label: 'Max Eave Overhang', value: `${ohInches}" Horizontal` });
        });
        
      } else if (category === 'header') {
        const opWFt = spanFt || 3; 
        let spec = 'Double 2x6';
        let jackCount = 1;

        if (headerWallType === 'non-load') spec = opWFt <= 4 ? 'Double 2x4' : 'Double 2x6';
        else if (headerWallType === 'roof-only') {
          if (opWFt < 3) spec = 'Double 2x6';
          else if (opWFt < 5) spec = 'Double 2x8';
          else if (opWFt < 7) spec = 'Double 2x10';
          else spec = 'Double 2x12';
        } else if (headerWallType === 'floor-only') {
          if (opWFt < 3) spec = 'Double 2x8';
          else if (opWFt < 5) spec = 'Double 2x10';
          else spec = 'Double 2x12';
        } else { 
          if (opWFt < 3) spec = 'Double 2x10';
          else if (opWFt < 5) spec = 'Double 2x12';
          else spec = 'Triple 2x10 or LVL';
        }

        if (opWFt >= 5) jackCount = 2;
        if (opWFt > 10) jackCount = 3;

        sub = [
          { label: `--- Header for ${fmt(opWFt)} Opening ---`, value: '' },
          { label: 'Wall Support Type', value: headerWallType.replace('-', ' ').toUpperCase() },
          { label: 'Required Header Size', value: spec, highlight: true },
          { label: 'Required Support Posts', value: `${jackCount} Jack Studs & 1 King`, highlight: true },
          { label: 'Minimum End Bearing', value: (jackCount * 1.5) + ' inches' },
        ];
        if (hasHeaderPointLoad) sub.push({ label: 'WARNING', value: 'Point loads require engineered LVL/Steel.', warning: true });
        
      } else if (category === 'beam') {
        const span = spanFt || 8; 
        const trib = secFt || 10; 
        
        sub = [
          { label: `--- Beam (Trib: ${fmt(trib)}, Span: ${fmt(span)}) ---`, value: '' },
          { label: 'Design Basis', value: 'Minimum structural requirements shown.' }
        ];
        
        const deadLoad = 10;
        const snowTiers = [
          { name: 'Light Snow (20 PSF)', load: 20 },
          { name: 'Medium Snow (30 PSF)', load: 30 },
          { name: 'Heavy Snow (50 PSF)', load: 50 }
        ];

        snowTiers.forEach(tier => {
            const totalPSF = (tier.load + deadLoad) / (wetMultiplier * gradeMultiplier);
            const plf = trib * totalPSF; 
            
            let rec = 'Double 2x8';
            if (plf > 1500) rec = 'Steel Flitch / 4-ply LVL';
            else if (plf > 1200) rec = 'Quad 2x12 / 3-ply LVL';
            else if (plf > 900) rec = 'Triple 2x12 / 2-ply LVL';
            else if (plf > 600) rec = 'Double 2x12 / 1-ply LVL';
            else if (plf > 400) rec = 'Double 2x10';

            sub.push({ label: tier.name, value: rec, highlight: true });
        });

        if (isWetService || isMarine) sub.push({ label: 'Hardware Spec', value: 'Z-MAX Post Cap/Hangers' });
        sub.push({ label: 'Minimum Bearing', value: '3.5” (Double Jack Stud)' });
      }

      sub.push({ label: 'Safety Note', value: 'Results based on standard loads. Always verify with local codes.', warning: true });
    } else if (activeTool === 'rm') {
      const isI = unitMode === 'imp';
      const subDivisor = isI ? 12 : 100;
      
      let totalSlopedArea = 0;
      let totalFlatArea = 0; 
      let totalEaves = 0;
      let totalRidges = 0;
      let totalSides = 0; // Rakes/Hips/Valleys

      roofSections.forEach(sec => {
        const pf = includePitch ? Math.sqrt(1 + Math.pow(sec.pitch / 12, 2)) : 1;
        const slopedH = includePitch ? sec.h * pf : sec.h;
        
        let area = 0;
        let eaves = 0;
        let ridge = 0;
        let sides = 0;

        if (sec.type === 'rect') {
          area = sec.w1 * sec.h;
          eaves = sec.w1;
          ridge = sec.w1;
          sides = 2 * slopedH;
        } else if (sec.type === 'tri') {
          area = 0.5 * sec.w1 * sec.h;
          eaves = sec.w1;
          ridge = 0;
          sides = 2 * Math.sqrt(Math.pow(sec.w1 / 2, 2) + Math.pow(slopedH, 2));
        } else if (sec.type === 'trap') {
          area = 0.5 * (sec.w1 + sec.w2) * sec.h;
          eaves = sec.w1;
          ridge = sec.w2;
          sides = 2 * Math.sqrt(Math.pow((sec.w1 - sec.w2) / 2, 2) + Math.pow(slopedH, 2));
        }

        totalFlatArea += area * sec.qty; 
        totalSlopedArea += area * pf * sec.qty;
        totalEaves += eaves * sec.qty;
        totalRidges += ridge * sec.qty;
        totalSides += sides * sec.qty;
      });

      // Convert all math to Imperial internally for accurate takeoffs
      const valleyFt = valD > 0 ? (isI ? valD : valD * 3.28084) : 0;
      const areaSqFt = isI ? totalSlopedArea : (totalSlopedArea * 10.7639);
      const flatAreaSqFt = isI ? totalFlatArea : (totalFlatArea * 10.7639);
      const eavesFt = isI ? totalEaves : (totalEaves * 3.28084);
      const ridgesFt = isI ? totalRidges : (totalRidges * 3.28084);
      const sidesFt = isI ? totalSides : (totalSides * 3.28084);

      // Dynamic Waste Factor
      const wasteFactor = parseFloat(waste) || 10;
      const wasteMultiplier = 1 + (wasteFactor / 100);
      const areaWithWaste = areaSqFt * wasteMultiplier; 
      
      const squares = areaWithWaste / 100;

      let coveragePerUnit = 33.3; 
      let weightPerUnit = 80;
      let unitLabel = 'Bundles';
      
      if (roofMaterialType === 'cedar') {
        coveragePerUnit = 25;
        weightPerUnit = 40;
      } else if (roofMaterialType === 'tile') {
        coveragePerUnit = 1; 
        weightPerUnit = 9;
        unitLabel = 'Tiles';
      }

      const materialCount = Math.ceil(areaWithWaste / coveragePerUnit);
      const totalWeight = materialCount * weightPerUnit;

      const ridgeCapLF = ridgesFt * wasteMultiplier;
      const ridgeCapBundles = Math.ceil(ridgeCapLF / 30); 

      const rollAreaSqFt = 3 * roofRollSize; 
      const iceWaterArea = (eavesFt * 3) + (valleyFt * 3); 
      const iceWaterRolls = Math.ceil((iceWaterArea * wasteMultiplier) / rollAreaSqFt);
      
      const remainingArea = Math.max(0, areaWithWaste - (iceWaterArea * wasteMultiplier));
      const syntheticRolls = Math.ceil(remainingArea / 1000); 

      let fastenerCount = 0;
      if (roofMaterialType === 'asphalt') {
        fastenerCount = (materialCount * 30) * roofNailsPerShingle;
      } else if (roofMaterialType === 'cedar') {
        fastenerCount = (materialCount * 40) * 2;
      } else if (roofMaterialType === 'tile') {
        fastenerCount = Math.ceil(areaWithWaste * 1);
      }
      
      const fastenerWeight = roofMaterialType === 'asphalt' ? fastenerCount / 250 :
                             roofMaterialType === 'cedar' ? fastenerCount / 320 :
                             fastenerCount / 100;

      const sheets = Math.ceil(areaWithWaste / 32);

      const exteriorEdgesLF = eavesFt + sidesFt - valleyFt; 
      const starterLF = exteriorEdgesLF * wasteMultiplier;
      const stickLen = isI ? 10 : 9.84; 
      
      const starterBundles = Math.ceil(Math.max(0, starterLF) / 100); 
      const dripEdgeSticks = Math.ceil(Math.max(0, starterLF) / stickLen);
      const valleySticks = Math.ceil((valleyFt * wasteMultiplier) / stickLen);
      
      const nfaSqInches = (flatAreaSqFt / 300) * 144;
      const standardBoxVents = Math.ceil(nfaSqInches / 50); 
      const ridgeVentSticks = Math.ceil(ridgesFt / 4); 

      main = isI ? `${Math.round(totalSlopedArea)} SQ FT` : `${(totalSlopedArea).toFixed(1)} M²`;
      sub = [
        { label: `--- Tally (${includePitch ? 'True Roof' : 'Flat 2D'} Area) ---`, value: '' },
        { label: 'Surface Area (No Waste)', value: main, highlight: true },
        { label: 'Roofing Squares (w/ Waste)', value: `${squares.toFixed(1)} SQ`, highlight: true },
        { label: unitLabel, value: materialCount.toLocaleString(), highlight: true },
        { label: 'Total Weight', value: isI ? `${totalWeight.toLocaleString()} lbs` : `${(totalWeight * 0.453592).toLocaleString()} kg` },
        { label: 'Sheeting / OSB (4x8)', value: `${sheets} Sheets`, highlight: true },
        { label: '--- Underlayment Package ---', value: '' },
        { label: `Ice & Water Shield (${roofRollSize}' Rolls)`, value: `${iceWaterRolls} Rolls` },
        { label: 'Synthetic Underlayment (1000 sqft)', value: `${syntheticRolls > 0 ? syntheticRolls : 1} Rolls` },
        { label: '--- Edge Flashing, Trim & Vents ---', value: '' },
        { label: 'Starter Shingle Bundles', value: `${starterBundles > 0 ? starterBundles : 1} Bundles` },
        { label: 'Ridge Cap Bundles', value: ridgeCapBundles > 0 ? ridgeCapBundles.toLocaleString() : 'None' },
        { label: isI ? "Drip Edge (10' Sticks)" : "Drip Edge (3m Sticks)", value: dripEdgeSticks.toString() },
        { label: isI ? "W-Valley Metal (10' Sticks)" : "W-Valley Metal (3m)", value: valleySticks > 0 ? `${valleySticks} pcs` : 'None' },
        { label: "Ridge Vent (4' Sections)", value: ridgeVentSticks > 0 ? `${ridgeVentSticks} pcs` : 'None' },
        { label: 'Box Vents (1/300 Rule Alternative)', value: `${standardBoxVents} Vents` },
        { label: '--- Fasteners ---', value: '' },
        { label: 'Roofing Nails', value: `${fastenerCount.toLocaleString()} (${fastenerWeight.toFixed(1)} lbs)` },
        { label: 'Safety Note:', value: `All material counts include a ${wasteFactor}% waste factor.` }
      ];
    }

    return { main, sub };
  }, [
    activeTool, unitMode, inputUnits, precision, currentValue, currentOp,
    a1, a2, a3, a4, b1, b2, b3, b4, c1, c2, c3, c4, d1, d2, d3, d4, 
    qty, qty2, qty3, qty4, angle, op, subMode, waste, totalLoad, unCat, 
    openings, ridgeV1, ridgeV2, ridgeV3, ridgeV4, overhang, rafterStock, 
    seatWidthV1, seatWidthV2, seatWidthV3, seatWidthV4, isSlopeLocked, 
    lockedAngle, lockedRoll, lockedHeading, snowLoad, cantileverDistance, 
    deflectionLimit, isWetService, isMarine, hasPointLoad, pointLoadWeight, 
    pointLoadLocation, woodSpecies, headerWallType, hasHeaderPointLoad, 
    woodGrade, isTrailer, liquidQty, quickLoadMaterial, orientation, ocMode, 
    postWidthV1, postWidthV2, postWidthV3, postWidthV4, balustersubMode, 
    maxOpV1, maxOpV2, maxOpV3, maxOpV4, desiredGapV1, desiredGapV2, 
    desiredGapV3, desiredGapV4, customDeckBoardW1, customDeckBoardW2, 
    customDeckBoardW3, customDeckBoardW4, sunLat, sunLong, isARActive, 
    roofSections, roofNailsPerShingle, roofMaterialType, roofMode, roofRollSize, 
    sidingSections, sidingOpenings, sidingBoardLength, sidingOverlap, 
    sidingHorizontalOverlap, boardWidth, sidingInsideCorners, sidingOutsideCorners, 
    mmMaterial, truckModel, includePitch, roofPitch,
    roomLenV1, roomLenV2, roomLenV3, roomLenV4, roomWidV1, roomWidV2, roomWidV3, roomWidV4,
    tileLenV1, tileLenV2, tileLenV3, tileLenV4, tileWidV1, tileWidV2, tileWidV3, tileWidV4,
    groutV1, groutV2, groutV3, groutV4,
    deckInputs, wallInputs, footingInputs, slabInputs, sonoInputs
  ]);
	
	
  const calcC = (op: string) => {
    const isI = unitMode === 'imp';
    const calcUnit = inputUnits['calc_a'] || 'mm';
    const calcScale = calcUnit === 'm' ? 1 : calcUnit === 'cm' ? 100 : 1000;
    
    // Safely parse active input from the currently selected tab
    const entryVal = parseF(a1, a2, a3, a4, unitMode, calcUnit);
    const scalarVal = parseFloat(qty);
    
    const isDimTyping = a1 !== '' || a2 !== '' || a3 !== '' || (a4 !== '' && a4 !== '1');
    const isScalarTyping = qty !== '';
    const isTyping = subMode === 'scalar' ? isScalarTyping : isDimTyping;
    
    const activeInput = subMode === 'scalar' ? (isNaN(scalarVal) ? 0 : scalarVal) : entryVal;

    // Smart formatter for the running history tape screen
    const formatTapeVal = (val: number, isScalar: boolean) => {
      if (isScalar) return val.toString();
      return isI ? formatF(val, 'imp') : `${(val * calcScale).toFixed(2)}${calcUnit}`;
    };

    let nextValue = currentValue || 0;
    let tapeAddition = "";
    const nextOpSym = op === 'add' ? '+' : op === 'sub' ? '-' : op === 'mul' ? '×' : '÷';

    // 1. Process active inputs into the accumulator
    if (isTyping) {
      if (currentOp) {
        if (currentOp === 'add') nextValue = currentValue + activeInput;
        if (currentOp === 'sub') nextValue = Math.max(0, currentValue - activeInput);
        if (currentOp === 'mul') nextValue = currentValue * activeInput;
        if (currentOp === 'div') nextValue = activeInput !== 0 ? currentValue / activeInput : currentValue;
        
        tapeAddition = `${formatTapeVal(activeInput, subMode === 'scalar')}`;
      } else {
        // Fresh start without a previous operator
        nextValue = activeInput;
        tapeAddition = formatTapeVal(activeInput, subMode === 'scalar');
      }
    }

    setCurrentValue(nextValue);
    setLastResult(nextValue); // Maintained for your state consistency

    // 2. Handle Continuous Chaining & Tape Output
    if (op === 'eq') {
      setCurrentOp('');
      setHistory(prev => {
        // If they just hit equals without typing anything, do nothing
        if (!isTyping) return prev; 
        
        let newHistory = prev + tapeAddition + ` = ${formatTapeVal(nextValue, false)}`;
        return newHistory.length > 40 ? newHistory.substring(newHistory.length - 40) : newHistory;
      });
    } else {
      setCurrentOp(op);
      
      // --- CONTINUOUS CHAINING LOGIC ---
      if (!isTyping && !currentOp && history.includes('=')) {
        // User just hit equals, and now hit an operator (e.g. hit 'x2' after a sum). 
        // Start a new line using the accumulated total!
        setHistory(`${formatTapeVal(nextValue, false)} ${nextOpSym} `);
      } else if (!isTyping && !currentOp && !history) {
        // Brand new session starting with an operator on zero
        setHistory(`0 ${nextOpSym} `);
      } else {
        // Standard chaining
        setHistory(prev => {
          // If they are just swapping operators (e.g., hit + then realized they meant -)
          if (!isTyping && currentOp) {
            return prev.replace(/ [+\-×÷] $/, ` ${nextOpSym} `);
          }
          let newHistory = prev + tapeAddition + ` ${nextOpSym} `;
          return newHistory.length > 40 ? newHistory.substring(newHistory.length - 40) : newHistory;
        });
      }
      
      // UI Upgrade: Auto-switch tabs to match the operator pressed
      if (op === 'mul' || op === 'div') setSubMode('scalar');
      else setSubMode('dim');
    }

    // 3. Clear inputs so user can seamlessly type the next number
    setA1(''); setA2(''); setA3(''); setA4(''); 
    setQty('');
  };

  const clearC = () => {
    setCurrentValue(0);
    setLastResult(null);
    setCurrentOp(null);
    setHistory(''); // Clears the tape screen
    setA1(''); setA2(''); setA3(''); setA4('');
    setQty('');
    setSubMode('dim'); // Auto-resets to the standard dimension tab
  };
	
	const handleShare = async () => {
    if (!results || !results.main) return;

    const toolName = TOOLS.find(t => t.id === activeTool)?.name || 'Calculation';
    
    // Format the text for SMS / Email / Notes
    let text = `📐 Squared Pro: ${toolName}\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `PRIMARY: ${results.main}\n\n`;
    
    if (results.sub && results.sub.length > 0) {
      results.sub.forEach((item: any) => {
        // Strip out the "---" styling dashes for the text message format
        if (item.label.includes('---')) {
          text += `\n${item.label.replace(/-/g, '').trim().toUpperCase()}\n`;
          text += `----------------------\n`;
        } else {
          text += `${item.label}: ${item.value}\n`;
        }
      });
    }

    // --- PRO UPGRADE: Inject Saved Memory Bank Data ---
    if (savedLayouts && savedLayouts.length > 0) {
      text += `\nSAVED CORNER LAYOUTS\n`;
      text += `----------------------\n`;
      savedLayouts.forEach(item => {
        text += `Corner ${item.id}: ${item.run} × ${item.rise} (Diag: ${item.diag})\n`;
      });
    }
    
    text += `\nCalculated with Squared Pro`;

    // Trigger Native Share or Fallback to Clipboard
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Squared Pro: ${toolName}`,
          text: text,
        });
      } else {
        await navigator.clipboard.writeText(text);
        if (haptics && window.navigator.vibrate) window.navigator.vibrate(50);
        alert('Results copied to clipboard!');
      }
    } catch (error) {
      console.log('Share canceled or failed:', error);
    }
  };

  const addLoad = (manualWeight?: number) => {
    if (typeof manualWeight === 'number') {
      settotalLoad(prev => prev + manualWeight);
      return;
    }
    let weight = 0;
    const q = parseFloat(qty) || 0;
    if (subMode === 'lum') {
      const sizeStr = a1 || '2x4';
      const [wRaw, hRaw] = sizeStr.split('x').map(Number);
      // Actual framing dimensions (e.g. 2x4 is 1.5" x 3.5")
      const getActual = (nom: number) => {
          if (nom <= 2) return nom - 0.5;
          if (nom <= 6) return nom - 0.5;
          return nom - 0.75;
      };
      const w = getActual(wRaw);
      const h = getActual(hRaw);
      const l = parseFloat(a2) || 8;
      
      const density = WOOD_WEIGHTS[d1] || 32;
      if (unitMode === 'imp') {
        weight = ((w * h) / 144) * l * density * q;
      } else {
        // w, h, l are in mm. Convert mm3 to ft3: 1 mm3 = 3.53147e-8 ft3
        const volFt3 = (w * h * l) * 3.53147e-8;
        weight = volFt3 * density * q;
      }
    } else if (subMode === 'con') {
      weight = (parseFloat(d1) || 80) * q;
    } else if (subMode === 'sheet') {
      weight = (parseFloat(d1) || 75) * q;
    } else if (subMode === 'liquid') {
      const lq = parseFloat(liquidQty) || 0;
      if (unitMode === 'imp') {
        weight = lq * 8.34; // lbs per gallon
      } else {
        weight = lq * 2.20462; // 1kg per liter = 2.20462 lbs
      }
    } else if (subMode === 'quick') {
      const data = QUICK_LOAD_DATA[quickLoadMaterial];
      if (data) {
        if (data.unit === 'ea') {
          weight = data.density * q;
        } else {
          // ft3 density * quantity
          if (unitMode === 'imp') {
            weight = data.density * q;
          } else {
            // q is m3. 1 m3 = 35.3147 ft3
            weight = data.density * (q * 35.3147);
          }
        }
      }
    }
    settotalLoad(prev => prev + weight);
  };

  const addSidingOpeningGlobal = () => {
    let w = parseFloat(newOpW) || 0;
    let h = parseFloat(newOpH) || 0;
    
    // Convert to feet/meters for internal storage
    if (unitMode === 'imp') {
      w = w / 12;
      h = h / 12;
    } else {
      w = w / 100;
      h = h / 100;
    }

    if (w > 0 && h > 0) {
      setSidingOpenings([...sidingOpenings, { id: Math.random().toString(36).substr(2, 9), type: newOpType, w, h }]);
      setNewOpW('');
      setNewOpH('');
    }
  };

  const addSidingSection = () => {
    const w = parseF(a1, a2, a3, a4, unitMode);
    let h = 0;
    
    if (wallType === 'gable') {
      if (gableInputMode === 'pitch' && rmPitch) {
        const pitch = parseFloat(rmPitch) || 0;
        h = (w / 2) * (pitch / 12);
      } else {
        h = parseF(b1, b2, b3, b4, unitMode);
      }
    } else {
      h = parseF(b1, b2, b3, b4, unitMode);
    }

    if (w > 0 && h > 0) {
      const type = wallType === 'rectangular' ? 'rect' : 'gable';
      setSidingSections([...sidingSections, { id: Date.now().toString(), type, w, h, openings: [] }]);
    }
  };

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const switchTool = (id: ToolId) => {
    setActiveTool(id);
	if (typeof window !== 'undefined') {
    localStorage.setItem('squared_activeTool', id);
    }
    const tool = TOOLS.find(t => t.id === id);
    if (tool) setActiveTab(tool.category);
    setIsMenuOpen(false);
    setRecentTools(prev => {
      const filtered = prev.filter(t => t !== id);
      return [id, ...filtered].slice(0, 5);
    });
  };

 return (
	<div className={`fixed inset-0 overflow-hidden flex flex-col ${isARActive ? 'bg-transparent' : (theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black')}`}>
		
		{/* --- GLOBAL TEXT SCALER INTERCEPTOR --- */}
		{textSize !== 'small' && (
			<style>{`
				.text-\\[10px\\] { font-size: ${textSize === 'normal' ? '12px' : textSize === 'large' ? '14px' : '16px'} !important; }
				.text-\\[9px\\]  { font-size: ${textSize === 'normal' ? '11px' : textSize === 'large' ? '13px' : '15px'} !important; }
				.text-\\[8px\\]  { font-size: ${textSize === 'normal' ? '10px' : textSize === 'large' ? '12px' : '14px'} !important; }
				.text-\\[0\\.65rem\\] { font-size: ${textSize === 'normal' ? '0.75rem' : textSize === 'large' ? '0.85rem' : '0.95rem'} !important; }
				.text-xs         { font-size: ${textSize === 'normal' ? '0.85rem' : textSize === 'large' ? '0.95rem' : '1.05rem'} !important; }
				.text-sm         { font-size: ${textSize === 'normal' ? '0.95rem' : textSize === 'large' ? '1.05rem' : '1.15rem'} !important; }
				
				input[type="number"], select {
						font-size: ${textSize === 'normal' ? '1.1rem' : textSize === 'large' ? '1.2rem' : '1.3rem'} !important;
				}
			`}</style>
		)}

		{/* --- MAIN SCROLLABLE APP CONTAINER --- */}
		<div className="flex-1 overflow-y-auto w-full max-w-md mx-auto px-4 pb-20 custom-scrollbar">
			<div className="pt-[max(env(safe-area-inset-top),2.5rem)] pb-32 box-border min-h-screen">
				
				{/* ================================================================= */}
				{/* --- UPGRADED TOP NAVIGATION BAR ---                               */}
				{/* ================================================================= */}
				<header className={`flex justify-between items-center mb-6 border-b pb-4 transition-colors ${theme === 'dark' ? 'border-[#222]' : 'border-[#ddd]'}`}>
							
					{/* Brand & Logo */}
					<div className="flex items-center gap-2.5 shrink-0">
						<div className="w-[18px] h-[18px] border-l-[3.5px] border-b-[3.5px] border-accent shadow-[-3px_3px_12px_rgba(0,210,255,0.4)]" />
						<h1 className="text-base m-0 uppercase font-black tracking-tight leading-none flex flex-col">
							Squared Pro
							<span className="text-accent opacity-80 text-[8.5px] tracking-widest mt-0.5 font-bold">Built for Builders</span>
						</h1>
					</div>
					
					{/* Fast Jobsite Action Group */}
					<div className="flex items-center gap-1.5 shrink-0">
						
						{/* DEDICATED CODE HUB BUTTON */}
						<button 
							onClick={() => setIsCodeModalOpen(true)}
							className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-lg border transition-all active:scale-95 shadow-sm ${
								theme === 'dark' 
									? 'bg-[#161616] border-accent/40 text-accent hover:bg-accent/10' 
									: 'bg-accent/10 border-accent/50 text-[#0088cc] hover:bg-accent/20'
							}`}
						>
							<BookOpen size={13} strokeWidth={2.5} />
							<span>Codes</span>
						</button>

						{/* Reference Chart Button */}
						<button 
							onClick={() => setshowReference(true)}
							className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-lg border transition-all active:scale-95 ${
								theme === 'dark' 
									? 'bg-[#111] border-[#333] text-gray-300 hover:border-gray-500' 
									: 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
							}`}
						>
							Ref
						</button>

						{/* Global Unit Switcher Pill */}
						<button 
							onClick={() => setunitMode(unitMode === 'imp' ? 'met' : 'imp')}
							className="px-2.5 py-1.5 rounded-lg text-[10px] font-mono font-black bg-accent text-black shadow-sm active:scale-95 transition-transform"
							title="Toggle Imperial / Metric"
						>
							{unitMode.toUpperCase()}
						</button>

						{/* Settings Icon */}
						<button 
							onClick={() => setIsSettingsOpen(true)}
							className={`p-1.5 rounded-lg transition-colors ml-0.5 ${
								theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-[#222]' : 'text-gray-500 hover:text-black hover:bg-gray-100'
							}`}
							title="Settings & Preferences"
						>
							<Settings size={20} />
						</button>
					</div>
				</header>

				{/* Smart Menu Dropdown */}
        <div className="relative mb-6" ref={menuRef}>
          <div onClick={() => setIsMenuOpen(!isMenuOpen)}
           className={`w-full p-4 rounded-xl border flex justify-between items-center cursor-pointer transition-all ${theme === 'dark' ? 'bg-[#0a0a0a] border-[#222]' : 'bg-white border-[#ddd]'}`}
          >
            <div className="flex items-center gap-3">
              <Menu className="w-5 h-5 text-accent"/>
              <span className="text-sm font-black uppercase tracking-widest">
                {TOOLS.find(t => t.id === activeTool)?.name || 'Select Tool'}
              </span>
              {TOOL_DOCS[activeTool] && (
                <button onClick={(e) => {
                    e.stopPropagation();
                    setShowDocModal(true);
                  }}
                  className="p-1 rounded-full hover:bg-accent/20 transition-colors"
                >
                  <Info className="w-4 h-4 text-accent"/>
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[0.6rem] uppercase font-bold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Switch Tool</span>
              <div className={`w-2 h-2 rounded-full ${isMenuOpen ? 'bg-accent' : 'bg-[#333]'}`}/>
            </div>
          </div>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className={`absolute top-full left-0 right-0 mt-2 z-[1000] rounded-xl border border-accent shadow-2xl overflow-hidden ${theme=== 'dark' ? 'bg-[#0a0a0a]' : 'bg-white'}`}>
                
                {/* Search Bar */}
                <div className={`p-3 border-b ${theme === 'dark' ? 'border-[#222]' : 'border-[#eee]'}`}>
                  <input type="text" placeholder="Search tools..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full p-4 rounded-xl text-sm font-bold outline-none transition-colors shadow-inner ${theme === 'dark' ? 'bg-[#111] text-white border border-[#333] focus:border-accent' : 'bg-gray-50 text-black border border-[#ccc] focus:border-accent'}`}
                  />
                </div>

                <div className="max-h-[60vh] overflow-y-auto p-4 space-y-6 no-scrollbar">

                  {searchQuery ? (
                    /* --- SEARCH RESULTS --- */
                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] font-black uppercase text-accent mb-2 tracking-widest">Search Results</span>
                      {TOOLS.filter(t => {
                        const q = searchQuery.trim().toLowerCase();
                        if (!q) return true;
                        const name = (t.name || '').toLowerCase();
                        const id = (t.id || '').toLowerCase();
                        return name.includes(q) || id.includes(q);
                      }).map(tool => (
                        <div key={`search-${tool.id}`} className="flex items-center gap-2">
                          <button onClick={() => switchTool(tool.id)} className={`flex-1 p-4 rounded-xl text-left transition-all duration-200 shadow-sm ${theme === 'dark' ? 'bg-[#111] hover:bg-[#1a1a1a] border border-[#222]' : 'bg-white hover:bg-gray-50 border border-[#eee]'}`}>
                            <span className={`text-xs font-bold uppercase tracking-wide ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{tool.name}</span>
                          </button>
                          <button onClick={(e) => toggleFavorite(e, tool.id)} className="p-3 text-2xl hover:scale-110 transition-transform text-accent">
                            {favorites.includes(tool.id) ? '★' : <span className="opacity-30">☆</span>}
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* --- ORGANIZED VIEW --- */
                    <>
                      {/* 1. FAVORITES */}
                      {favorites.length > 0 && (
                        <div className="flex flex-col gap-2">
                          <span className="text-[10px] font-black uppercase text-[#ffc107] mb-1 tracking-widest flex items-center gap-1">
                            <Star size={12} fill="currentColor" /> Favorites
                          </span>
                          {TOOLS.filter(t => favorites.includes(t.id)).map(tool => (
                            <div key={`fav-${tool.id}`} className="flex items-center gap-2">
                              <button onClick={() => switchTool(tool.id)} className={`flex-1 p-4 rounded-xl text-left transition-all duration-200 shadow-sm border ${theme === 'dark' ? 'bg-[#1a1a1a] border-[#333]' : 'bg-[#fffdf0] border-[#ffe082]'}`}>
                                <span className={`text-xs font-bold uppercase tracking-wide ${theme === 'dark' ? 'text-[#ffc107]' : 'text-[#d48806]'}`}>{tool.name}</span>
                              </button>
                              <button onClick={(e) => toggleFavorite(e, tool.id)} className="p-3 text-2xl hover:scale-110 transition-transform text-[#ffc107]">★</button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* 2. RECENTS (Horizontal Scroll Pills) */}
                      {recentTools.filter(id => !favorites.includes(id)).length > 0 && (
                        <div className="flex flex-col gap-2 border-t border-[#333]/20 pt-4 dark:border-[#ccc]/50">
                          <span className="text-[10px] font-black uppercase text-[#888] mb-1 tracking-widest">Recent Tools</span>
                          <div className="flex overflow-x-auto gap-2 pb-2 no-scrollbar">
                            {recentTools.filter(id => !favorites.includes(id)).map(id => {
                              const tool = TOOLS.find(t => t.id === id);
                              if (!tool) return null;
                              return (
                                <button key={`recent-${id}`} onClick={() => switchTool(id)} 
                                  className={`flex-shrink-0 px-4 py-2.5 rounded-full border transition-all ${theme === 'dark' ? 'bg-[#111] border-[#333] hover:bg-[#222]' : 'bg-gray-100 border-[#ccc] hover:bg-gray-200'}`}
                                >
                                  <span className={`text-[10px] font-bold uppercase ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{tool.name}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* 3. ALL TOOLS (ICON BUBBLES ONLY) */}
                      <div className="flex flex-col gap-4 mt-6">
                        {TOOLS.filter(t => !favorites.includes(t.id)).map(tool => (
                          <div key={`all-${tool.id}`} className="flex items-center gap-3">
                            <button onClick={() => switchTool(tool.id)} 
                              className="flex-1 p-2 text-left flex items-center justify-between group">
                              
                              <div className="flex items-center gap-5">
                                {/* Upgraded Icon Bubble */}
                                <span className={`p-4 rounded-2xl transition-all duration-300 shadow-sm ${
                                  activeTool === tool.id 
                                    ? 'bg-accent/20 text-accent border border-accent/50 scale-110' 
                                    : theme === 'dark' 
                                      ? 'bg-[#222] border border-[#333] group-hover:bg-[#2a2a2a] text-accent/80' 
                                      : 'bg-white border border-[#eee] group-hover:bg-gray-50 text-accent/80'
                                }`}>
                                  {tool.id === 'calc' ? <Calculator size={24} /> :
                                   tool.id === 'tr' ? <Triangle size={24} /> :
                                   tool.id === 'sq' ? <Square size={24} /> :
                                   tool.id === 'st' ? <AlignRight size={24} /> :
                                   tool.id === 'rr' ? <ChevronUp size={24} /> : 
                                   tool.id === 'df' ? <Columns size={24} /> :   
                                   tool.id === 'oc' ? <MoveVertical size={24} /> :
                                   tool.id === 'rk' ? <Tent size={24} /> :
                                   tool.id === 'pl' ? <Truck size={24} /> :
                                   tool.id === 'fi' ? <Mountain size={24} /> :
                                   tool.id === 'co' ? <Hammer size={24} /> :
                                   tool.id === 'tl' ? <LayoutGrid size={24} /> :
                                   tool.id === 'si' ? <Home size={24} /> :
                                   tool.id === 'bc' ? <LayoutGrid size={24} /> :
                                   tool.id === 'wc' ? <Maximize size={24} /> :
                                   tool.id === 'rm' ? <Layers size={24} /> :
                                   tool.id === 'ds' ? <MoveHorizontal size={24} /> :
                                   tool.id === 'lv' ? <Ruler size={24} /> :
                                   tool.id === 'un' ? <ArrowRightLeft size={24} /> :
                                   tool.id === 'cm' ? <Wrench size={24} /> :
                                   <Info size={24} />}
                                </span>
                                
                                {/* Text outside the bubble, but still part of the button */}
                                <span className={`text-[14px] font-bold uppercase tracking-wider transition-colors duration-300 ${
                                  activeTool === tool.id 
                                    ? 'text-accent' 
                                    : theme === 'dark' ? 'text-white/70 group-hover:text-white' : 'text-black/70 group-hover:text-black'
                                }`}>
                                  {tool.name}
                                </span>
                              </div>

                            </button>
                            
                            <button onClick={(e) => toggleFavorite(e, tool.id)} className={`p-4 text-3xl hover:scale-110 transition-transform ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                              <span className="opacity-20">☆</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </>
                  )}									
                </div>
              </motion.div>
            )}
          </AnimatePresence>
				</div>

        {/* Tool UI */}
        <div id="tool-ui" className="space-y-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-[#555]">Inputs</h2>
            {!['un', 'lv', 'ds'].includes(activeTool) && (
              <button onClick={() => resetTool(activeTool)}
                className="flex items-center gap-1.5 text-[0.6rem] font-black uppercase tracking-widest text-red-500/60 hover:text-red-500 transition-colors"
              >
                <RotateCcw size={10}/>
                Clear
              </button>
            )}
          </div>
					
          {activeTool === 'tr' && (
            <div className="space-y-4">						
              {/* Primary Dimensions Card */}
              <div className={`p-4 rounded-xl border space-y-3 ${theme === 'dark' ? 'bg-white/5 border-[#333]/30' : 'bg-black/5 border-[#ccc]/50'}`}>
                <span className="block mb-1 text-[10px] font-black uppercase tracking-widest text-accent opacity-80">Known Sides (A & B)</span>
                <div id="input-tr-a">
                  <InputRow label="Side A / Run" v1={a1} v2={a2} v3={a3} v4={a4} setV1={setA1} setV2={setA2} setV3={setA3} setV4={setA4} mode={unitMode} theme={theme} onFocus={setActiveInput} {...getUnitProps('a')}/>
                </div>
                <div id="input-tr-b">
                  <InputRow label="Side B / Rise" v1={b1} v2={b2} v3={b3} v4={b4} setV1={setB1} setV2={setB2} setV3={setB3} setV4={setB4} mode={unitMode} theme={theme} onFocus={setActiveInput} {...getUnitProps('b')}/>
                </div>
              </div>
              
              {/* Angles Card */}
              <div className={`p-4 rounded-xl border space-y-4 ${theme === 'dark' ? 'bg-[#0a0a0a] border-[#222]' : 'bg-gray-50 border-[#ddd]'}`}>
                <span className="block mb-1 text-[10px] font-black uppercase tracking-widest text-accent opacity-80">Known Angles (Degrees)</span>
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex flex-col">
                    <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Angle A</span>
                    <input type="number" placeholder="--" 
                      className={`w-full border rounded-xl p-3 text-center font-bold text-lg outline-none transition-colors shadow-sm ${theme === 'dark' ? 'bg-[#111] border-[#333] text-white focus:border-accent' : 'bg-white border-[#ccc] text-black focus:border-accent'}`}
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Angle B</span>
                    <input type="number" placeholder="--" 
                      className={`w-full border rounded-xl p-3 text-center font-bold text-lg outline-none transition-colors shadow-sm ${theme === 'dark' ? 'bg-[#111] border-[#333] text-white focus:border-accent' : 'bg-white border-[#ccc] text-black focus:border-accent'}`}
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-accent">Angle C</span>
                    <input type="number" value={angle} onChange={(e) => setAngle(e.target.value)} placeholder="90" 
                      className={`w-full border rounded-xl p-3 text-center font-black text-lg outline-none transition-colors shadow-inner ${theme === 'dark' ? 'bg-[#111] border-accent/50 text-white focus:border-accent' : 'bg-white border-accent/50 text-black focus:border-accent'}`} 
                    />
                  </div>
                </div>
              </div>
              
              {/* --- PRO UPGRADE: Dual-Format Memory Bank --- */}
              <div className="pt-2 pb-2">
                <button 
                  onClick={() => {
                    const wFt = parseF(a1, a2, a3, a4, unitMode);
                    const lFt = parseF(b1, b2, b3, b4, unitMode);
                    
                    if (wFt > 0 && lFt > 0) {
                      const formatDual = (valFt: number) => {
                          if (unitMode === 'met') return `${valFt.toFixed(3)} m`;
                          
                          const totalInches = valFt * 12;
                          const rawInches = formatF32(totalInches, precision).replace(/"/g, '');
                          const ft = Math.floor(totalInches / 12);
                          const remInches = formatF32(totalInches - (ft * 12), precision).replace(/"/g, '');
                          
                          // Hide the fractional parenthesis if it's 0 feet, or format cleanly
                          if (ft === 0) return `${rawInches}"`;
                          const paren = remInches === '0' ? `(${ft}')` : `(${ft}' ${remInches}")`;
                          
                          return `${rawInches}" ${paren}`;
                      };

                      const currentW = formatDual(wFt);
                      const currentL = formatDual(lFt);
                      const currentDiag = formatDual(Math.sqrt(wFt * wFt + lFt * lFt));

                      setSavedLayouts([...savedLayouts, { 
                        id: savedLayouts.length + 1, 
                        run: currentW, 
                        rise: currentL, 
                        diag: currentDiag 
                      }]);
                    }
                  }}
                  className={`w-full p-4 rounded-xl font-black text-sm uppercase tracking-widest active:scale-95 transition-all flex items-center justify-center gap-2 shadow-md ${theme === 'dark' ? 'bg-accent/10 border border-accent/50 text-accent hover:bg-accent/20' : 'bg-[#e0f7ff] border border-accent/40 text-[#0088cc] hover:bg-[#cceeff]'}`}
                >
                  <Save size={18} strokeWidth={2.5}/>
                  Save Corner to List
                </button>
              </div>

              {/* Render Saved Layouts List */}
              {savedLayouts.length > 0 && (
                <div className={`mt-4 p-4 rounded-xl border shadow-inner ${theme === 'dark' ? 'bg-[#0a0a0a] border-[#222]' : 'bg-gray-50 border-[#ddd]'}`}>
                  <div className="flex justify-between items-center mb-3 border-b border-[#333]/30 dark:border-[#ccc]/50 pb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-accent">Saved Layouts</span>
                    <button onClick={() => setSavedLayouts([])} className="text-[9px] font-bold uppercase text-red-500 hover:text-red-400">Clear List</button>
                  </div>
                  <div className="space-y-2">
                    {savedLayouts.map((item) => (
                      <div key={item.id} className={`flex justify-between items-center py-2 text-xs border-b last:border-0 ${theme === 'dark' ? 'border-[#222]/30 text-[#ccc]' : 'border-[#ddd]/50 text-[#555]'}`}>
                        <span className="font-bold">Corner {item.id}: {item.run} × {item.rise}</span>
                        <span className="font-black font-mono text-[#ff00d2]">Diag: {item.diag}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

							{/* Local Tape Precision Pill */}
              {unitMode === 'imp' && (
                <div className="flex flex-col pt-2 pb-2">
                  <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Tape Precision</span>
                  <div className={`flex gap-1 p-1 rounded-xl border ${theme === 'dark' ? 'bg-[#333]/20 border-[#444]/30' : 'bg-gray-200/50 border-[#ddd]'}`}>
                    {([8, 16, 32] as const).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPrecision(p)}
                        className={`flex-1 py-2.5 rounded-lg font-black text-[11px] transition-all ${
                          precision === p 
                            ? 'bg-accent text-black shadow-md' 
                            : 'text-[#888] hover:text-current'
                        }`}
                      >
                        1/{p}"
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Standardized Danger Button */}
              <button onClick={() => { resetTool('tr'); setSavedLayouts([]); }}
                className={`w-full mt-3 p-3 rounded-xl font-black tracking-widest text-[10px] uppercase active:scale-95 transition-all ${theme === 'dark' ? 'bg-[#111] border border-red-500/30 text-red-500 hover:bg-red-500/10' : 'bg-red-50 text-red-500 border border-red-200 hover:bg-red-100'}`}
              >
                Clear Triangle Tool
              </button>

              {/* HERO CARD RESULT (Conditionally displayed if you use results.main for Hypotenuse, otherwise falls back smoothly to list) */}
              {results.main && (
                <div className={`mt-6 pt-5 border-t w-full ${theme === 'dark' ? 'border-[#222]/40' : 'border-[#ddd]'}`}>
                  <div className={`mb-4 text-center border rounded-xl p-6 shadow-lg ${theme === 'dark' ? 'bg-[#111] border-[#222]' : 'bg-gray-50 border-[#ccc]'}`}>
                    <span className="block text-[10px] font-black uppercase tracking-widest text-accent opacity-80 mb-2">Calculated Side C</span>
                    <span className={`text-4xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{results.main}</span>
                  </div>
                </div>
              )}

              {/* UPGRADED LIVE TEXT OUTPUT LIST */}
              <div className={`space-y-1.5 ${!results.main ? 'mt-6 pt-5 border-t border-[#222]/30' : ''}`}>
                {results.sub.map((item: any, idx: number) => {
                  const isHeader = item.label.includes('---');
                  return (
                    <div 
                      key={idx} 
                      className={`flex justify-between items-center py-2.5 px-3 rounded-lg transition-colors ${
                        isHeader 
                          ? 'mt-4 mb-1 border-none bg-accent/10 dark:bg-accent/5' 
                          : theme === 'dark' ? 'border-b border-[#222]/40 hover:bg-white/[0.02]' : 'border-b border-[#ddd]/60 hover:bg-black/[0.02]'
                      }`}
                    >
                      <span className={`${
                        isHeader 
                          ? 'text-accent font-black uppercase tracking-widest text-[10px]' 
                          : `text-xs opacity-80 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`
                      }`}>
                        {item.label.replace(/-/g, '').trim()}
                      </span>
                      
                      {!isHeader && (
                        <span className={`font-bold font-mono text-right ${
                          item.highlight 
                            ? 'text-accent text-sm tracking-wide font-black' 
                            : theme === 'dark' ? 'text-white text-xs' : 'text-black text-xs'
                        }`}>
                          {item.value}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* DYNAMIC TRIANGLE BLUEPRINT CANVAS */}
              {(() => {
                const angleC = parseFloat(angle) || 90;
                const radC = (angleC * Math.PI) / 180;
                
                // Pass exact unit units so blueprint scales accurately in MM, CM, or M
                const sideA = parseF(a1, a2, a3, a4, unitMode, inputUnits['tr_a'] || 'mm') || 12;
                const sideB = parseF(b1, b2, b3, b4, unitMode, inputUnits['tr_b'] || 'mm') || 9;
                
                const sideC = Math.sqrt(sideA * sideA + sideB * sideB - 2 * sideA * sideB * Math.cos(radC));
                const maxSide = Math.max(sideA, sideB, sideC) || 1;
                
                const scale = 140 / maxSide;
                const sA = sideA * scale;
                const sB = sideB * scale;
                
                const p1x = 45;
                const p1y = 135; 
                const p2x = p1x + sA;
                const p2y = p1y;
                const p3x = p2x - sB * Math.cos(radC);
                const p3y = p1y - sB * Math.sin(radC);

                const labelA = results.sub && results.sub[1]?.value ? results.sub[1].value : `${sideA}`;
                const labelB = results.sub && results.sub[2]?.value ? results.sub[2].value : `${sideB}`;
                const labelC = results.sub && results.sub[3]?.value ? results.sub[3].value : `${sideC.toFixed(2)}`;
                
                const angAStr = results.sub && results.sub.find((i:any) => i.label.includes('Angle A ('))?.value || '';
                const angBStr = results.sub && results.sub.find((i:any) => i.label.includes('Angle B ('))?.value || '';

                return results.sub && results.sub.length > 0 && (
                  <div className={`mt-6 pt-5 border-t flex flex-col items-center w-full ${theme === 'dark' ? 'border-[#222]/40' : 'border-[#ddd]'}`}>
                    <span className="text-[9px] font-black uppercase text-accent mb-3 tracking-widest">Field Cut Layout Blueprint</span>
                    <svg viewBox="0 0 240 170" className={`w-full h-auto overflow-visible rounded-xl p-3 border shadow-inner ${theme === 'dark' ? 'bg-[#0a0a0a] border-[#222]' : 'bg-gray-50 border-[#ddd]'}`}>
                      <defs>
                        <filter id="neonGlowTR" x="-50%" y="-50%" width="200%" height="200%">
                          <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur1" />
                          <feMerge><feMergeNode in="blur1" /><feMergeNode in="SourceGraphic" /></feMerge>
                        </filter>
                        <pattern id="scanlinesTR" patternUnits="userSpaceOnUse" width="4" height="4">
                          <line x1="0" y1="0" x2="4" y2="0" stroke={theme === 'dark' ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"} strokeWidth="1" />
                        </pattern>
                      </defs>

                      <rect x="-10" y="-10" width="260" height="190" fill="url(#scanlinesTR)" rx="8" />
                      
                      {angleC === 90 && (
                        <polyline points={`${p2x - 8},${p2y} ${p2x - 8},${p2y - 8} ${p2x},${p2y - 8}`} fill="none" stroke="var(--color-accent)" strokeWidth="1.5" opacity="0.6" />
                      )}

                      <polygon points={`${p1x},${p1y} ${p2x},${p2y} ${p3x},${p3y}`} fill="var(--color-accent)" opacity="0.1" />
                      <polygon points={`${p1x},${p1y} ${p2x},${p2y} ${p3x},${p3y}`} fill="none" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinejoin="round" filter="url(#neonGlowTR)" />
                      
                      <text x={(p1x + p2x) / 2} y={p1y + 14} fill={theme === 'dark' ? '#fff' : '#000'} fontSize="8" fontWeight="bold" textAnchor="middle" className="cursor-pointer hover:fill-accent" onClick={() => document.getElementById('input-tr-a')?.focus()}>A: {labelA.split(' (')[0]}</text>
                      <text x={p2x + 8} y={(p2y + p3y) / 2} fill={theme === 'dark' ? '#fff' : '#000'} fontSize="8" fontWeight="bold" textAnchor="start" className="cursor-pointer hover:fill-accent" onClick={() => document.getElementById('input-tr-b')?.focus()}>B: {labelB.split(' (')[0]}</text>
                      <text x={(p1x + p3x) / 2 - 8} y={(p1y + p3y) / 2} fill="var(--color-accent)" fontSize="8" fontWeight="black" textAnchor="end">C: {labelC.split(' (')[0]}</text>
                      
                      <text x={p2x - 16} y={p2y - 5} fill="#ff00d2" fontSize="7" fontWeight="black">{angleC.toFixed(1)}°</text>
                      {angAStr && <text x={p1x + 10} y={p1y - 4} fill="#ff00d2" fontSize="6.5" fontWeight="bold">{angAStr}</text>}
                      {angBStr && <text x={p3x} y={p3y - 6} fill="#ff00d2" fontSize="6.5" fontWeight="bold" textAnchor="middle">{angBStr}</text>}
                    </svg>
                  </div>
                );
              })()}              
            </div>
          )}

          {activeTool === 'rr' && (
            <div className="space-y-4">
              
              <div className={`p-4 rounded-xl border space-y-4 ${theme === 'dark' ? 'bg-white/5 border-[#333]/30' : 'bg-black/5 border-[#ccc]/50'}`}>
                
                {/* 2-Column Grid for Pitch and Stock Selectors */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col">
                    <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Roof Pitch</span>
                    <select value={roofPitch} onChange={(e) => setRoofPitch(e.target.value)} 
                      className={`w-full border rounded-xl p-4 text-center font-black text-lg outline-none appearance-none shadow-sm transition-colors ${theme === 'dark' ? 'bg-[#111] border-[#222] text-white focus:border-accent' : 'bg-gray-50 border-[#ccc] text-black focus:border-accent'}`}
                    >
                      {[4,5,6,7,8,9,10,12].map(p => <option key={p} value={p}>{p}/12</option>)}
                      <option value="custom">Custom Pitch</option>
                    </select>
                    {roofPitch === 'custom' && (
                      <div className="mt-3 pt-3 border-t border-[#333]/30 dark:border-[#ccc]/50">
                        <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-accent">Custom Pitch (Rise)</span>
                        <div className="flex items-center gap-2">
                          <input type="number" value={qty} onChange={(e) => setQty(e.target.value)} 
                            className={`flex-1 border rounded-xl p-3 text-center font-black text-lg outline-none transition-colors ${theme === 'dark' ? 'bg-[#111] border-[#222] text-white focus:border-accent' : 'bg-white border-[#ccc] text-black focus:border-accent'}`} 
                          />
                          <span className={`font-black text-lg ${theme === 'dark' ? 'text-white' : 'text-black'}`}>/ 12</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Rafter Stock</span>
                    <select value={rafterStock} onChange={(e) => setRafterStock(e.target.value)} 
                      className={`w-full border rounded-xl p-4 text-center font-black text-lg outline-none appearance-none shadow-sm transition-colors ${theme === 'dark' ? 'bg-[#111] border-[#222] text-white focus:border-accent' : 'bg-gray-50 border-[#ccc] text-black focus:border-accent'}`}
                    >
                      <option value="2x4">2x4</option>
                      <option value="2x6">2x6</option>
                      <option value="2x8">2x8</option>
                      <option value="2x10">2x10</option>
                      <option value="2x12">2x12</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>
                </div>

                {/* ESCAPED THE GRID: This now spans the full 100% width! */}
                {rafterStock === 'custom' && (
                  <div className="pt-3 border-t border-[#333]/30 dark:border-[#ccc]/50">
                    <InputRow label="Custom Rafter Depth" v1={d1} v2={d2} v3={d3} v4={d4} setV1={setD1} setV2={setD2} setV3={setD3} setV4={setD4} mode={unitMode} theme={theme} hideFeet onFocus={setActiveInput} {...getUnitProps('d')}/>
                  </div>
                )}
              </div>

              <div className="space-y-3 p-4 rounded-xl border border-[#333]/30 bg-black/5 dark:bg-white/5">
                <div id="input-rr-span">
                  <InputRow label="Total Span" v1={a1} v2={a2} v3={a3} v4={a4} setV1={setA1} setV2={setA2} setV3={setA3} setV4={setA4} mode={unitMode} theme={theme} onFocus={setActiveInput} {...getUnitProps('a')}/>
                </div>
                <div id="input-rr-layout">
                  <InputRow label="Layout Length (Optional)" v1={b1} v2={b2} v3={b3} v4={b4} setV1={setB1} setV2={setB2} setV3={setB3} setV4={setB4} mode={unitMode} theme={theme} onFocus={setActiveInput} {...getUnitProps('b')}/>
                </div>
              </div>

              <div className={`p-4 rounded-xl border space-y-4 ${theme === 'dark' ? 'bg-white/5 border-[#333]/30' : 'bg-black/5 border-[#ccc]/50'}`}>
                
                {/* Full Width Ridge Thick */}
                <div id="input-rr-ridge">
                  <InputRow label="Ridge Thick" v1={ridgeV1} v2={ridgeV2} v3={ridgeV3} v4={ridgeV4} setV1={setRidgeV1} setV2={setRidgeV2} setV3={setRidgeV3} setV4={setRidgeV4} mode={unitMode} theme={theme} hideFeet onFocus={setActiveInput} {...getUnitProps('ridge')}/>
                </div>
                
                {/* Full Width Seat Cut */}
                <div id="input-rr-seat">
                  <InputRow label="Seat Width (Horizontal)" v1={seatWidthV1} v2={seatWidthV2} v3={seatWidthV3} v4={seatWidthV4} setV1={setSeatWidthV1} setV2={setSeatWidthV2} setV3={setSeatWidthV3} setV4={setSeatWidthV4} mode={unitMode} theme={theme} hideFeet onFocus={setActiveInput} {...getUnitProps('seat')} />
                </div>

                {/* 2-Column Grid for Overhang & Spacing */}
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#333]/20 dark:border-[#ccc]/50">
                  <div className="flex flex-col">
                    <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Overhang (in)</span>
                    <input type="number" value={overhang} onChange={(e) => setOverhang(e.target.value)} 
                      className={`w-full h-[calc(100%-1.2rem)] border rounded-xl p-3 text-center font-black text-lg outline-none transition-colors shadow-sm ${theme === 'dark' ? 'bg-[#111] border-[#222] text-white focus:border-accent' : 'bg-white border-[#ccc] text-black focus:border-accent'}`} 
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Spacing (OC)</span>
                    <select value={ocSpacing} onChange={(e) => setOcSpacing(e.target.value)} 
                      className={`w-full h-[calc(100%-1.2rem)] border rounded-xl p-3 text-center font-black text-lg outline-none appearance-none shadow-sm transition-colors ${theme === 'dark' ? 'bg-[#111] border-[#222] text-white focus:border-accent' : 'bg-gray-50 border-[#ccc] text-black focus:border-accent'}`}
                    >
                      <option value="12">12” OC</option>
                      <option value="16">16” OC</option>
                      <option value="24">24” OC</option>
                    </select>
                  </div>
                </div>
              </div>

							{/* Local Tape Precision Pill */}
              {unitMode === 'imp' && (
                <div className="flex flex-col pt-2 pb-2">
                  <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Tape Precision</span>
                  <div className={`flex gap-1 p-1 rounded-xl border ${theme === 'dark' ? 'bg-[#333]/20 border-[#444]/30' : 'bg-gray-200/50 border-[#ddd]'}`}>
                    {([8, 16, 32] as const).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPrecision(p)}
                        className={`flex-1 py-2.5 rounded-lg font-black text-[11px] transition-all ${
                          precision === p 
                            ? 'bg-accent text-black shadow-md' 
                            : 'text-[#888] hover:text-current'
                        }`}
                      >
                        1/{p}"
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button onClick={() => resetTool('rr')}
                className={`w-full mt-4 p-3 rounded-xl font-black tracking-widest text-[10px] uppercase active:scale-95 transition-all ${theme === 'dark' ? 'bg-[#111] border border-red-500/30 text-red-500 hover:bg-red-500/10' : 'bg-red-50 text-red-500 border border-red-200 hover:bg-red-100'}`}
              >
                Clear Rafter Tool
              </button>

              {/* UPGRADED SEGMENTED TEXT OUTPUT LIST */}
              <div className={`mt-6 pt-5 border-t w-full ${theme === 'dark' ? 'border-[#222]/40' : 'border-[#ddd]'}`}>
                <div className="space-y-1.5">
                  {results.sub && results.sub.map((item: any, idx: number) => {
                    const isHeader = item.label.includes('---');
                    return (
                      <div 
                        key={idx} 
                        className={`flex justify-between items-center py-2.5 px-3 rounded-lg transition-colors ${
                          isHeader 
                            ? 'mt-4 mb-1 border-none bg-accent/10 dark:bg-accent/5' 
                            : theme === 'dark' ? 'border-b border-[#222]/40 hover:bg-white/[0.02]' : 'border-b border-[#ddd]/60 hover:bg-black/[0.02]'
                        }`}
                      >
                        <span className={`${
                          isHeader 
                            ? 'text-accent font-black uppercase tracking-widest text-[10px]' 
                            : `text-xs opacity-80 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`
                        }`}>
                          {item.label.replace(/-/g, '').trim()}
                        </span>
                        
                        {!isHeader && (
                          <span className={`font-bold font-mono text-right ${
                            item.highlight 
                              ? 'text-accent text-sm tracking-wide font-black' 
                              : theme === 'dark' ? 'text-white text-xs' : 'text-black text-xs'
                          }`}>
                            {item.value}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* DYNAMIC ROOF RAFTER CANVAS */}
              {(() => {
                const pitchNum = parseFloat(roofPitch) === parseFloat(roofPitch) ? parseFloat(roofPitch) : (parseFloat(qty) || 6);
                const angleRad = Math.atan(pitchNum / 12);
                const angleDeg = angleRad * (180 / Math.PI);
                
                const totalTipToTail = results.sub && results.sub[1]?.value ? results.sub[1].value : 'Length';
                const ridgeToHeelStr = results.sub && results.sub.find((i:any) => i.label.toLowerCase().includes('ridge to heel'))?.value || 'Length';
                const displayHAP = results.sub && results.sub.find((i:any) => i.label.toLowerCase().includes('hap'))?.value || '4"';
                const displayPlateToTop = results.sub && results.sub.find((i:any) => i.label.toLowerCase().includes('plate to top'))?.value || '';
                const plumbAngleStr = results.sub && results.sub.find((i:any) => i.label.toLowerCase().includes('plumb cut angle'))?.value || `${angleDeg.toFixed(1)}°`;

                const rawSeatCut = parseF(seatWidthV1, seatWidthV2, seatWidthV3, seatWidthV4, unitMode) || 4.125;

                const runScaleX = 115; 
                const ohScaleX = 25;   
                
                const startX = 30;
                const birdX = startX + ohScaleX;
                const ridgeX = birdX + runScaleX;
                
                const totalRiseY = Math.tan(angleRad) * runScaleX;
                const ohRiseY = Math.tan(angleRad) * ohScaleX;

                const ridgeY = 35;
                const birdTopY = ridgeY + totalRiseY;
                const tailTopY = birdTopY + ohRiseY;

                const boardWidth = 24; 
                const plumbD = boardWidth / Math.cos(angleRad);

                const visualSeatW = Math.max(12, Math.min(35, (rawSeatCut / 5) * 16));
                
                const bmLevelSeatY = birdTopY + plumbD - (plumbD * 0.45); 
                const bmSeatEndX = birdX + visualSeatW;

                const tailBotY = tailTopY + plumbD;
                const ridgeBotY = ridgeY + plumbD;

                return results.sub && results.sub.length > 0 && (
                  <>
                    <div className={`mt-6 pt-5 border-t flex flex-col items-center w-full ${theme === 'dark' ? 'border-[#222]/40' : 'border-[#ddd]'}`}>
                      <span className="text-[9px] font-black uppercase text-accent mb-3 tracking-widest">Standard Rafter Layout Blueprint</span>
                      <svg viewBox="0 0 240 170" className={`w-full h-auto overflow-visible rounded-xl p-3 border shadow-inner ${theme === 'dark' ? 'bg-[#0a0a0a] border-[#222]' : 'bg-gray-50 border-[#ddd]'}`}>
                        <defs>
                          <filter id="neonGlowRR" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur1" />
                            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur2" />
                            <feMerge>
                              <feMergeNode in="blur2" />
                              <feMergeNode in="blur1" />
                              <feMergeNode in="SourceGraphic" />
                            </feMerge>
                          </filter>
                          <pattern id="scanlines" patternUnits="userSpaceOnUse" width="4" height="4">
                            <line x1="0" y1="0" x2="4" y2="0" stroke={theme === 'dark' ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"} strokeWidth="1" />
                          </pattern>
                        </defs>

                        <rect x="0" y="0" width="100%" height="100%" fill="url(#scanlines)" rx="8" />
                        
                        <motion.rect x={birdX} y={bmLevelSeatY} width={visualSeatW} height="15" fill="none" stroke={theme === 'dark' ? "#444" : "#ccc"} strokeWidth="1.25" strokeDasharray="3,2" 
                          initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.8 }} />
                        <text x={birdX + visualSeatW / 2} y={bmLevelSeatY + 23} fill={theme === 'dark' ? "#555" : "#999"} fontSize="7" fontWeight="bold" textAnchor="middle">Top Plate</text>

                        <motion.path 
                          d={`M ${startX},${tailTopY} 
                             L ${startX},${tailBotY} 
                             L ${birdX},${birdTopY + plumbD} 
                             L ${birdX},${bmLevelSeatY} 
                             L ${bmSeatEndX},${bmLevelSeatY} 
                             L ${ridgeX},${ridgeBotY} 
                             L ${ridgeX},${ridgeY} Z`} 
                          fill="none" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinejoin="miter" filter="url(#neonGlowRR)"
                          initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                        />

                        <text x="25" y="22" fill="var(--color-accent)" fontSize="7.5" fontWeight="black" textAnchor="start">
                          Tip-to-Tail: {totalTipToTail.split(' (')[0]}
                        </text>
                        
                        <text 
                          x={(birdX + ridgeX) / 2} y={(ridgeY + birdTopY) / 2 - 5} 
                          fill={theme === 'dark' ? "#fff" : "#000"} fontSize="6.5" fontWeight="bold" textAnchor="middle" 
                          transform={`rotate(${-angleDeg} ${(birdX + ridgeX) / 2} ${(ridgeY + birdTopY) / 2 - 5})`}
                          className="cursor-pointer hover:fill-accent transition-colors"
                          onClick={() => document.getElementById('input-rr-span')?.focus()}
                        >
                          Ridge to Heel: {ridgeToHeelStr.split(' (')[0]}
                        </text>

                        <motion.line x1={birdX} y1={birdTopY} x2={birdX} y2={bmLevelSeatY} stroke="#ff00d2" strokeWidth="1.25" filter="url(#neonGlowRR)" 
                          initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.5, delay: 1.8 }} />
                        <circle cx={birdX} cy={birdTopY} r="1.5" fill="#ff00d2" />
                        <circle cx={birdX} cy={bmLevelSeatY} r="1.5" fill="#ff00d2" />
                        <text x={birdX + 5} y={bmLevelSeatY - 5} fill="#ff00d2" fontSize="7" fontWeight="black">HAP: {displayHAP}</text>

                        {displayPlateToTop && (
                          <g>
                            <line x1={ridgeX} y1={ridgeY} x2={ridgeX + 15} y2={ridgeY} stroke={theme === 'dark' ? "#444" : "#ccc"} strokeWidth="1" strokeDasharray="2,2" />
                            <line x1={ridgeX} y1={bmLevelSeatY} x2={ridgeX + 15} y2={bmLevelSeatY} stroke={theme === 'dark' ? "#444" : "#ccc"} strokeWidth="1" strokeDasharray="2,2" />
                            <line x1={ridgeX + 10} y1={ridgeY} x2={ridgeX + 10} y2={bmLevelSeatY} stroke="var(--color-accent)" strokeWidth="1.25" />
                            <text x={ridgeX + 14} y={(ridgeY + bmLevelSeatY) / 2 + 3} fill="var(--color-accent)" fontSize="7.5" fontWeight="bold" textAnchor="start">Plate to Top: {displayPlateToTop.split(' (')[0]}</text>
                          </g>
                        )}

                        <text x="125" y="152" fill="#ff00d2" fontSize="7.5" fontWeight="black">Plumb Angle: {plumbAngleStr}</text>
                      </svg>
                    </div>

                    {/* UPGRADED BIRDSMOUTH ZOOM DIAGRAM (100% Metric Safe) */}
                    <div className={`mt-6 pt-5 border-t flex flex-col items-center w-full ${theme === 'dark' ? 'border-[#222]/40' : 'border-[#ddd]'}`}>
                      <span className="text-[9px] font-black uppercase text-accent mb-3 tracking-widest">Birdsmouth Detail (Zoom)</span>
                      {(() => {
                        const pitchNum = parseFloat(roofPitch) === parseFloat(roofPitch) ? parseFloat(roofPitch) : (parseFloat(qty) || 6);
                        const slope = pitchNum / 12;

                        const seatStr = results.sub?.find((i:any) => i.label.includes('Seat Cut'))?.value || '4 1/8"';
                        const heelStr = results.sub?.find((i:any) => i.label.includes('Heel Cut (Vertical)'))?.value || '2 1/16"';

                        const rawSeatCut = unitMode === 'imp' 
                          ? (parseF(seatWidthV1, seatWidthV2, seatWidthV3, seatWidthV4, 'imp') * 12 || 4.125) 
                          : (parseF(seatWidthV1, seatWidthV2, seatWidthV3, seatWidthV4, 'met') || 105);
                        
                        const visualSeatW = Math.max(20, Math.min(40, rawSeatCut * (unitMode === 'imp' ? 5 : 0.2))); 
                        const visualHeelH = visualSeatW * slope;
                        
                        return (
                          <svg viewBox="0 0 160 120" className={`w-full max-w-[250px] h-auto overflow-visible rounded-xl p-4 border shadow-inner ${theme === 'dark' ? 'bg-[#0a0a0a] border-[#222]' : 'bg-gray-50 border-[#ddd]'}`}>
                            <rect x="0" y="0" width="100%" height="100%" fill="url(#scanlines)" rx="8" />

                            <rect x="50" y="60" width="45" height="30" fill="none" stroke={theme === 'dark' ? "#444" : "#ccc"} strokeWidth="1.5" strokeDasharray="3,2" />
                            <text x="72.5" y="78" fill={theme === 'dark' ? "#555" : "#999"} fontSize="8" fontWeight="bold" textAnchor="middle">Top Plate</text>

                            <path 
                              d={`M 15,${60 + visualHeelH + 35*slope} L 50,${60 + visualHeelH} L 50,60 L ${50 + visualSeatW},60 L 130,${60 - (130 - (50 + visualSeatW))*slope}`} 
                              fill="none" stroke="var(--color-accent)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" filter="url(#neonGlowRR)"
                            />
                            
                            {/* Metric-Safe Clean Text Labels */}
                            <line x1="45" y1={60 + visualHeelH} x2="45" y2="60" stroke="#ff00d2" strokeWidth="1" />
                            <text x="42" y={60 + visualHeelH / 2 + 2} fill="#ff00d2" fontSize="7" fontWeight="bold" textAnchor="end">
                              Heel: {heelStr}
                            </text>

                            <line x1="50" y1="55" x2={50 + visualSeatW} y2="55" stroke="#ff00d2" strokeWidth="1" />
                            <text 
                              x={50 + visualSeatW / 2} y="50" fill="#ff00d2" fontSize="7" fontWeight="bold" textAnchor="middle"
                              className="cursor-pointer hover:fill-accent transition-colors"
                              onClick={() => document.getElementById('input-rr-seat')?.focus()}
                            >
                              Seat = {seatStr}
                            </text>
                          </svg>
                        );
                      })()}
                    </div>
                  </>
                );
              })()}
            </div>
          )}

          {activeTool === 'si' && (
            <div className="space-y-4">
              
							{/* --- UPGRADED LIVE DYNAMIC DIAGRAM --- */}
              <div className={`mb-6 flex justify-center items-center p-6 rounded-xl border shadow-inner ${theme === 'dark' ? 'bg-[#0a0a0a] border-[#222]' : 'bg-gray-50 border-[#ddd]'}`}>
                {(() => {
                  return (
                    <svg viewBox="0 0 240 220" className="w-full max-w-[280px] h-auto overflow-visible transition-all duration-500">
                      <defs>
                        <filter id="neonGlowSI" x="-50%" y="-50%" width="200%" height="200%">
                          <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur" />
                          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                        </filter>
                        
                        <pattern id="sidingPattern" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="translate(0, 2)">
                          <line x1="0" y1="4" x2="4" y2="4" stroke="var(--color-accent)" strokeWidth="0.5" opacity="0.4" />
                        </pattern>
                      </defs>

                      {(() => {
                        // 1. Math Engine (Safely parses inputs)
                        const isGable = wallType === 'gable';
                        const subDivisor = unitMode === 'imp' ? 12 : 100;
                        
                        const ftW = parseFloat(a1) || 0; const inW = parseFloat(a2) || 0;
                        const rawW = (ftW || inW) ? (ftW + inW/subDivisor) : 20;

                        let rawH = 8;
                        let pitch = parseFloat(rmPitch) || 6;

                        if (isGable) {
                          const ftH = parseFloat(b1) || 0; const inH = parseFloat(b2) || 0;
                          if (ftH || inH) {
                             rawH = ftH + inH/subDivisor;
                             pitch = (rawH / (rawW / 2)) * 12;
                          } else {
                             rawH = (rawW / 2) * (pitch / 12);
                          }
                        } else {
                          const ftH = parseFloat(b1) || 0; const inH = parseFloat(b2) || 0;
                          rawH = (ftH || inH) ? (ftH + inH/subDivisor) : 8;
                        }

                        // 2. NEW MAXIMIZED SCALING ENGINE
                        const maxCanvasW = 180; 
                        const maxCanvasH = 140; 
                        
                        // Calculates independent scale factors and picks the smallest to keep proportions perfect
                        const scaleW = maxCanvasW / (rawW || 1);
                        const scaleH = maxCanvasH / (rawH || 1);
                        const scale = Math.min(scaleW, scaleH);

                        const vW = rawW * scale;
                        const vH = rawH * scale;

                        const cx = 120;
                        const baseY = isGable ? 170 : 180; 
                        const leftX = cx - vW / 2;
                        const rightX = cx + vW / 2;
                        const topY = baseY - vH;

                        // Dynamic Paths morph between Box and Triangle smoothly
                        const housePath = isGable 
                          ? `M ${leftX},${baseY} L ${cx},${topY} L ${rightX},${baseY} Z`
                          : `M ${leftX},${baseY} L ${leftX},${topY} L ${rightX},${topY} L ${rightX},${baseY} Z`;

                        return (
                          <g>
                            <text x={cx} y="20" fill={theme === 'dark' ? '#333' : '#ccc'} fontSize="6" fontWeight="black" textAnchor="middle" className="uppercase tracking-widest">
                              {isGable ? 'Gable End Clipping' : 'Standard Wall Area'}
                            </text>

                            {/* --- THE SHAPE-SHIFTING SIDING --- */}
                            <motion.path 
                              d={housePath} 
                              fill="url(#sidingPattern)" 
                              stroke={theme === 'dark' ? '#444' : '#ccc'} 
                              strokeWidth="1.5" strokeLinejoin="round" 
                              initial={false} animate={{ d: housePath }}
                              transition={{ type: "spring", stiffness: 80, damping: 20 }}
                            />
                            
                            {/* Glowing Outline */}
                            <motion.path 
                              d={housePath} fill="none" stroke="var(--color-accent)" strokeWidth="2.5" filter="url(#neonGlowSI)" strokeLinejoin="round"
                              animate={{ d: housePath }} transition={{ type: "spring", stiffness: 80, damping: 20 }}
                            />

                            {/* --- GABLE SPECIFIC UI --- */}
                            {isGable && (
                              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <text x={cx} y={topY - 10} fill="#ff00d2" fontSize="8" fontWeight="black" textAnchor="middle" filter="url(#neonGlowSI)">
                                  Pitch: {pitch.toFixed(1)}/12
                                </text>
                                <line x1={cx} y1={baseY} x2={cx} y2={topY} stroke="#ff00d2" strokeWidth="1.5" strokeDasharray="2,2" opacity="0.6" />
                              </motion.g>
                            )}
                            
                            {/* --- INTERACTIVE LABELS --- */}
                            <motion.text 
                              animate={{ x: cx, y: baseY + 18 }}
                              fill={theme === 'dark' ? '#fff' : '#000'} fontSize="8" fontWeight="bold" textAnchor="middle"
                              className="cursor-pointer hover:fill-accent transition-colors"
                              onClick={() => document.getElementById('input-si-width')?.focus()}
                            >
                              {a1 ? `Width: ${a1} ${unitMode === 'imp' ? 'ft' : 'm'}` : 'Width'}
                            </motion.text>
                            
                            {!isGable && (
                              <motion.text 
                                initial={{ opacity: 0 }} animate={{ opacity: 1, x: leftX - 12, y: (baseY + topY) / 2 }}
                                fill={theme === 'dark' ? '#fff' : '#000'} fontSize="8" fontWeight="bold" textAnchor="middle" transform={`rotate(-90 ${leftX - 12} ${(baseY + topY) / 2})`}
                                className="cursor-pointer hover:fill-accent transition-colors"
                                onClick={() => document.getElementById('input-si-height')?.focus()}
                              >
                                {b1 ? `Wall H: ${b1} ${unitMode === 'imp' ? 'ft' : 'm'}` : 'Wall H'}
                              </motion.text>
                            )}

                            <motion.g animate={{ x: rightX + 8, y: baseY - 15 }}>
                               <text fill="#ff00d2" fontSize="6" fontWeight="bold" textAnchor="start">
                                  Lap: {sidingOverlap || '1'}"
                               </text>
                            </motion.g>
                          </g>
                        );
                      })()}
                    </svg>
                  );
                })()}
              </div>
              {/* --- END OF UPGRADED LIVE DYNAMIC DIAGRAM --- */}
							
              {/* Upgraded Shape Selector Pill */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col">
                  <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Wall Shape</span>
                  <div className={`flex gap-1 p-1 rounded-xl border ${theme === 'dark' ? 'bg-[#333]/20 border-[#444]/30' : 'bg-gray-200/50 border-[#ddd]'}`}>
                    <button onClick={() => setWallType('rectangular')}
                      className={`flex-1 py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${wallType === 'rectangular' ? 'bg-accent text-black shadow-md' : 'text-[#888] hover:text-current'}`}
                    >
                      Rectangle
                    </button>
                    <button onClick={() => setWallType('gable')}
                      className={`flex-1 py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${wallType === 'gable' ? 'bg-accent text-black shadow-md' : 'text-[#888] hover:text-current'}`}
                    >
                      Gable
                    </button>
                  </div>
                </div>

                <div className="flex flex-col">
                  <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Siding Orientation</span>
                  <div className={`flex gap-1 p-1 rounded-xl border ${theme === 'dark' ? 'bg-[#333]/20 border-[#444]/30' : 'bg-gray-200/50 border-[#ddd]'}`}>
                    <button onClick={() => setHasPointLoad(false)}
                      className={`flex-1 py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${!hasPointLoad ? 'bg-accent text-black shadow-md' : 'text-[#888] hover:text-current'}`}
                    >
                      Horizontal
                    </button>
                    <button onClick={() => setHasPointLoad(true)}
                      className={`flex-1 py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${hasPointLoad ? 'bg-accent text-black shadow-md' : 'text-[#888] hover:text-current'}`}
                    >
                      Vertical
                    </button>
                  </div>
                </div>
              </div>

              {/* Main Dimensions Container */}
              <div className="space-y-3 p-4 rounded-xl border border-[#333]/30 bg-black/5 dark:bg-white/5">
                <div id="input-si-width">
                  <InputRow label="Wall Width" v1={a1} v2={a2} v3={a3} v4={a4} setV1={setA1} setV2={setA2} setV3={setA3} setV4={setA4} mode={unitMode} theme={theme} onFocus={setActiveInput} {...getUnitProps('a')}/>
                </div>
                
                {wallType === 'gable' ? (
                  <div className="space-y-4">
                    <div className="flex flex-col" id="input-si-pitch">
                      <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Gable Pitch (X / 12)</span>
                      <input type="number" value={rmPitch} onChange={(e) => {
                          setRmPitch(e.target.value);
                          setGableInputMode('pitch');
                          setB1(''); setB2(''); setB3(''); setB4('1');
                        }} 
                        placeholder="6" 
                        className={`w-full border rounded-xl p-4 text-center font-bold text-lg outline-none transition-colors ${theme === 'dark' ? 'bg-[#111] border-[#222] text-white focus:border-accent' : 'bg-white border-[#ccc] text-black focus:border-accent'}`} 
                      />
                    </div>
                    
                    <div className="flex items-center justify-center py-1">
                      <div className="flex-1 h-px bg-[#333]/30 dark:bg-[#ddd]/50"></div>
                      <span className="mx-4 text-[10px] font-black text-[#555] tracking-widest uppercase">Or</span>
                      <div className="flex-1 h-px bg-[#333]/30 dark:bg-[#ddd]/50"></div>
                    </div>

                    <div id="input-si-height">
                      <InputRow label="Peak Height" v1={b1} v2={b2} v3={b3} v4={b4} setV1={(v) => { setB1(v); setGableInputMode('height'); setRmPitch(''); }}
                        setV2={(v) => { setB2(v); setGableInputMode('height'); setRmPitch(''); }}
                        setV3={(v) => { setB3(v); setGableInputMode('height'); setRmPitch(''); }}
                        setV4={(v) => { setB4(v); setGableInputMode('height'); setRmPitch(''); }}
                        mode={unitMode} theme={theme} 
                        onFocus={setActiveInput} 
                        {...getUnitProps('b')} 
                      />
                    </div>
                  </div>
                ) : (
                  <div id="input-si-height">
                    <InputRow label="Wall Height" v1={b1} v2={b2} v3={b3} v4={b4} setV1={setB1} setV2={setB2} setV3={setB3} setV4={setB4} mode={unitMode} theme={theme} onFocus={setActiveInput} {...getUnitProps('b')}/>
                  </div>
                )}
                
                {/* Elevated Primary Add Button */}
                <button onClick={addSidingSection} className="w-full mt-4 bg-accent text-black p-4 rounded-xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all shadow-[0_0_15px_rgba(0,210,255,0.3)] hover:brightness-110 flex items-center justify-center gap-2">
                  <Plus strokeWidth={3} size={18}/>
                  Add {wallType === 'rectangular' ? 'Wall' : 'Gable'} to List
                </button>
              </div>

              {sidingSections.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-accent">Wall Segments ({sidingSections.length})</h3>
                    <button onClick={() => setSidingSections([])} className="text-red-500 text-[9px] font-bold uppercase tracking-widest hover:underline">Clear List</button>
                  </div>
                  
                  <div className="space-y-2">
                    {sidingSections.map((sec) => (
                      <div key={sec.id} className={`p-3 rounded-xl border flex items-center justify-between ${theme=== 'dark' ? 'bg-[#111] border-[#222]' : 'bg-white border-[#eee]'}`}>
                        <div className="flex flex-col">
                          <span className={`text-[10px] font-black uppercase tracking-wider ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                            {sec.type === 'rect' ? 'Standard Wall' : 'Gable Peak'}
                          </span>
                          <span className="text-[10px] text-[#888] font-mono mt-0.5">
                            {formatF(sec.w, unitMode)} × {formatF(sec.h, unitMode)}
                          </span>
                        </div>
                        <button onClick={() => setSidingSections(sidingSections.filter(s => s.id !== sec.id))} className="p-2 text-red-500/50 hover:text-red-500 transition-colors bg-red-500/5 rounded-lg">
                          <X size={16}/>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Refined Openings & Deductions Section */}
              <div className={`p-4 rounded-xl border ${theme=== 'dark' ? 'bg-[#0a0a0a] border-[#222]' : 'bg-gray-50 border-[#ddd]'} space-y-4`}>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-[#555]">Openings & Deductions</h3>
                
                <div className={`flex gap-1 p-1 rounded-xl border ${theme === 'dark' ? 'bg-[#333]/20 border-[#444]/30' : 'bg-gray-200/50 border-[#ddd]'}`}>
                  <button onClick={() => setNewOpType('window')}
                    className={`flex-1 py-3 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all ${newOpType === 'window' ? 'bg-accent text-black shadow-md' : 'text-[#888] hover:text-white'}`}
                  >
                    Window
                  </button>
                  <button onClick={() => setNewOpType('door')}
                    className={`flex-1 py-3 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all ${newOpType === 'door' ? 'bg-accent text-black shadow-md' : 'text-[#888] hover:text-white'}`}
                  >
                    Door
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col">
                    <span className="block mb-1.5 text-[9px] font-black uppercase text-[#666]">Width ({unitMode === 'imp' ? 'Inches' : 'cm'})</span>          
                    <input type="number" value={newOpW} onChange={(e) => setNewOpW(e.target.value)} 
                      className={`w-full border rounded-lg p-3 text-center font-bold outline-none transition-colors ${theme === 'dark' ? 'bg-[#111] border-[#333] focus:border-accent' : 'bg-white border-[#ccc] focus:border-accent'}`} 
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="block mb-1.5 text-[9px] font-black uppercase text-[#666]">Height ({unitMode === 'imp' ? 'Inches' : 'cm'})</span>
                    <input type="number" value={newOpH} onChange={(e) => setNewOpH(e.target.value)} 
                      className={`w-full border rounded-lg p-3 text-center font-bold outline-none transition-colors ${theme === 'dark' ? 'bg-[#111] border-[#333] focus:border-accent' : 'bg-white border-[#ccc] focus:border-accent'}`} 
                    />
                  </div>
                </div>
                
                {/* Secondary Ghost Button for Openings */}
                <div className="flex gap-2">
                  <button onClick={addSidingOpeningGlobal} className={`flex-1 border p-3 rounded-xl font-bold uppercase text-[10px] tracking-widest active:scale-95 transition-all ${theme === 'dark' ? 'bg-accent/10 border-accent/50 text-accent hover:bg-accent/20' : 'bg-[#0099cc]/10 border-[#0099cc]/50 text-[#0099cc] hover:bg-[#0099cc]/20'}`}>
                    + Add {newOpType}
                  </button>
                </div>

                {sidingOpenings.length > 0 && (
                  <div className="space-y-2 pt-3 border-t border-[#333]/20 dark:border-[#ccc]/50">
                    <div className="flex justify-between items-center px-1">
                       <span className="text-[9px] font-bold text-[#888] uppercase tracking-widest">Added Deductions</span>
                       <button onClick={() => setSidingOpenings([])} className="text-red-500 text-[9px] font-bold uppercase tracking-widest hover:underline">Clear</button>
                    </div>
                    {sidingOpenings.map(op => (
                      <div key={op.id} className={`flex items-center justify-between p-2.5 rounded-lg border ${theme === 'dark' ? 'bg-[#1a1a1a] border-[#333]' : 'bg-white border-[#eee]'}`}>
                        <span className="text-[10px] font-bold uppercase text-[#888]"><span className={theme === 'dark' ? 'text-white' : 'text-black'}>{op.type}:</span> {formatF(op.w, unitMode)} × {formatF(op.h, unitMode)}</span>
                        <button onClick={() => setSidingOpenings(sidingOpenings.filter(o => o.id !== op.id))} className="text-red-500/50 hover:text-red-500 p-1">
                          <X size={14}/>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Material Specs Segment */}
              <div className={`p-4 rounded-xl border space-y-4 mt-2 ${theme === 'dark' ? 'bg-white/5 border-[#333]/30' : 'bg-black/5 border-[#ccc]/50'}`}>
                <div className="flex justify-between items-center">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-accent opacity-80">Siding Profile Specs</h3>
                  
                  {/* QUICK PRESETS DROPDOWN */}
                  <select 
                    value={sidingType} 
                    onChange={(e) => {
                      const val = e.target.value;
                      setSidingType(val);
                      if (unitMode === 'imp') {
                        if (val === 'vinyl-d4') { setBoardWidth('9'); setSidingOverlap('1'); }
                        else if (val === 'vinyl-d5') { setBoardWidth('11'); setSidingOverlap('1'); }
                        else if (val === 'hardie-8') { setBoardWidth('8.25'); setSidingOverlap('1.25'); }
                        else if (val === 'hardie-6') { setBoardWidth('6.25'); setSidingOverlap('1.25'); }
                        else if (val === 'wood-bevel') { setBoardWidth('6'); setSidingOverlap('1'); }
                      } else {
                        if (val === 'vinyl-d4') { setBoardWidth('23'); setSidingOverlap('2.5'); }
                        else if (val === 'vinyl-d5') { setBoardWidth('28'); setSidingOverlap('2.5'); }
                        else if (val === 'hardie-8') { setBoardWidth('21'); setSidingOverlap('3.2'); }
                        else if (val === 'hardie-6') { setBoardWidth('16'); setSidingOverlap('3.2'); }
                        else if (val === 'wood-bevel') { setBoardWidth('15'); setSidingOverlap('2.5'); }
                      }
                    }}
                    className={`text-[10px] font-bold uppercase tracking-wider p-1.5 rounded-lg border outline-none ${theme === 'dark' ? 'bg-[#111] border-[#333] text-accent' : 'bg-white border-[#ccc] text-black'}`}
                  >
                    <option value="custom">⚙️ Custom Manual Entry</option>
                    <option value="vinyl-d4">Vinyl Double 4" Lap</option>
                    <option value="vinyl-d5">Vinyl Double 5" Lap</option>
                    <option value="hardie-8">James Hardie 8.25" Lap</option>
                    <option value="hardie-6">James Hardie 6.25" Lap</option>
                    <option value="wood-bevel">Traditional 6" Wood Bevel</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col" id="input-si-board">
                    <span className="block mb-1.5 text-[9px] font-black uppercase text-[#666]">Board Height ({unitMode === 'imp' ? 'in' : 'cm'})</span>
                    <input type="number" step="0.01" value={boardWidth} onChange={(e) => { setBoardWidth(e.target.value); setSidingType('custom'); }} className={`w-full border rounded-lg p-3 text-center font-bold transition-colors ${theme === 'dark' ? 'bg-[#111] border-[#222] focus:border-accent' : 'bg-white border-[#ccc] focus:border-accent'}`} />
                  </div>
                  <div className="flex flex-col">
                    <span className="block mb-1.5 text-[9px] font-black uppercase text-[#666]">Board Length ({unitMode === 'imp' ? 'ft' : 'm'})</span>
                    <input type="number" step="0.01" value={sidingBoardLength} onChange={(e) => setSidingBoardLength(e.target.value)} className={`w-full border rounded-lg p-3 text-center font-bold transition-colors ${theme === 'dark' ? 'bg-[#111] border-[#222] focus:border-accent' : 'bg-white border-[#ccc] focus:border-accent'}`} />
                   </div>
                  <div className="flex flex-col" id="input-si-lap">
                    <span className="block mb-1.5 text-[9px] font-black uppercase text-[#666]">Vertical Overlap ({unitMode === 'imp' ? 'in' : 'cm'})</span>
                    <input type="number" step="0.01" value={sidingOverlap} onChange={(e) => { setSidingOverlap(e.target.value); setSidingType('custom'); }} className={`w-full border rounded-lg p-3 text-center font-bold transition-colors ${theme === 'dark' ? 'bg-[#111] border-[#222] focus:border-accent' : 'bg-white border-[#ccc] focus:border-accent'}`} />
                  </div>
                  <div className="flex flex-col">
                    <span className="block mb-1.5 text-[9px] font-black uppercase text-[#666]">Horiz Joint Lap ({unitMode === 'imp' ? 'in' : 'cm'})</span>
                    <input type="number" step="0.01" value={sidingHorizontalOverlap} onChange={(e) => setSidingHorizontalOverlap(e.target.value)} className={`w-full border rounded-lg p-3 text-center font-bold transition-colors ${theme === 'dark' ? 'bg-[#111] border-[#222] focus:border-accent' : 'bg-white border-[#ccc] focus:border-accent'}`} />
                  </div>
                </div>
              </div>

              {/* Waste & Trim Segment */}
              <div className={`p-4 rounded-xl border space-y-4 ${theme === 'dark' ? 'bg-[#0a0a0a] border-[#222]' : 'bg-gray-50 border-[#ddd]'}`}>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-accent opacity-80">Waste & Trim Settings</h3>
                <div className="flex flex-col">
                  <span className="block mb-1.5 text-[9px] font-black uppercase text-[#666]">Waste Factor (%)</span>
                  <input type="number" value={waste} onChange={(e) => setWaste(e.target.value)} placeholder="10" className={`w-full border rounded-lg p-3 text-center font-bold transition-colors ${theme === 'dark' ? 'bg-[#111] border-[#222] focus:border-accent' : 'bg-white border-[#ccc] focus:border-accent'}`} />
                </div>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="flex flex-col">
                    <span className="block mb-1.5 text-[9px] font-black uppercase text-[#666]">Inside Corners</span>
                    <input type="number" value={sidingInsideCorners} onChange={(e) => setSidingInsideCorners(parseInt(e.target.value) || 0)} className={`w-full border rounded-lg p-3 text-center font-bold transition-colors ${theme === 'dark' ? 'bg-[#111] border-[#222] focus:border-accent' : 'bg-white border-[#ccc] focus:border-accent'}`} />
                  </div>
                  <div className="flex flex-col">
                    <span className="block mb-1.5 text-[9px] font-black uppercase text-[#666]">Outside Corners</span>
                    <input type="number" value={sidingOutsideCorners} onChange={(e) => setSidingOutsideCorners(parseInt(e.target.value) || 0)} className={`w-full border rounded-lg p-3 text-center font-bold transition-colors ${theme === 'dark' ? 'bg-[#111] border-[#222] focus:border-accent' : 'bg-white border-[#ccc] focus:border-accent'}`} />
                  </div>
                </div>
              </div>
              
              <button onClick={() => resetTool('si')}
                className={`w-full mt-4 p-3 rounded-xl font-black tracking-widest text-[10px] uppercase active:scale-95 transition-all ${theme === 'dark' ? 'bg-[#111] border border-red-500/30 text-red-500 hover:bg-red-500/10' : 'bg-red-50 text-red-500 border border-red-200 hover:bg-red-100'}`}
              >
                Clear Siding Tool
              </button>

              {/* HERO CARD RESULT */}
              <div className={`mt-6 pt-5 border-t w-full ${theme === 'dark' ? 'border-[#222]/40' : 'border-[#ddd]'}`}>
                {sidingSections.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    <div className={`flex flex-col justify-center p-4 rounded-xl border shadow-sm ${theme === 'dark' ? 'bg-[#111] border-[#222]' : 'bg-gray-50 border-[#ccc]'}`}>
                      <span className="text-[9px] font-black uppercase tracking-widest text-accent opacity-90 mb-1">Board Count</span>
                      <span className={`text-2xl font-black font-mono tracking-tight ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{results.sub.find((i:any) => i.label.includes('Board Count'))?.value || "0"}</span>
                    </div>
                    <div className={`flex flex-col justify-center p-4 rounded-xl border shadow-sm ${theme === 'dark' ? 'bg-[#111] border-[#222]' : 'bg-gray-50 border-[#ccc]'}`}>
                      <span className="text-[9px] font-black uppercase tracking-widest text-accent opacity-90 mb-1">Net Area</span>
                      <span className={`text-xl font-black font-mono tracking-tight mt-1 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{results.sub[1]?.value || "0"}</span>
                    </div>
                  </div>
                ) : (
                  <div className={`mb-4 text-center border rounded-xl p-6 ${theme === 'dark' ? 'bg-[#111] border-[#222]' : 'bg-gray-50 border-[#ccc]'}`}>
                    <span className="block text-[10px] font-black uppercase tracking-widest text-[#555] opacity-80">Awaiting Wall Inputs...</span>
                  </div>
                )}                
              </div>

              {/* UPGRADED SEGMENTED LIVE TEXT OUTPUT LIST */}
              {results.sub && results.sub.length > 0 && (
                <div className="space-y-1.5 mt-2">
                  {results.sub.map((item: any, idx: number) => {
                    const isHeader = item.label.includes('---');
                    return (
                      <div 
                        key={idx} 
                        className={`flex justify-between items-center py-2.5 px-3 rounded-lg transition-colors ${
                          isHeader 
                            ? 'mt-4 mb-1 border-none bg-accent/10 dark:bg-accent/5' 
                            : theme === 'dark' ? 'border-b border-[#222]/40 hover:bg-white/[0.02]' : 'border-b border-[#ddd]/60 hover:bg-black/[0.02]'
                        }`}
                      >
                        <span className={`${
                          isHeader 
                            ? 'text-accent font-black uppercase tracking-widest text-[10px]' 
                            : `text-xs opacity-80 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`
                        }`}>
                          {item.label.replace(/-/g, '').trim()}
                        </span>
                        
                        {!isHeader && (
                          <span className={`font-bold font-mono text-right ${
                            item.highlight 
                              ? 'text-accent text-sm tracking-wide font-black' 
                              : theme === 'dark' ? 'text-white text-xs' : 'text-black text-xs'
                          }`}>
                            {item.value}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTool === 'tl' && (
            <div className="space-y-4">
						
              {/* --- UPGRADED LIVE DYNAMIC DIAGRAM --- */}
              <div className={`mb-6 flex justify-center items-center p-6 rounded-xl border shadow-inner ${theme === 'dark' ? 'bg-[#0a0a0a] border-[#222]' : 'bg-gray-50 border-[#ddd]'}`}>
                {(() => {
                  // 1. Math Engine: Parse absolute values matching your business logic exactly
                  const roomL = parseF(roomLenV1, roomLenV2, roomLenV3, roomLenV4, unitMode, inputUnits['tl_roomlen'] || 'mm') || 0;
                  const roomW = parseF(roomWidV1, roomWidV2, roomWidV3, roomWidV4, unitMode, inputUnits['tl_roomwid'] || 'mm') || 0;
                  const tileL = parseF(tileLenV1, tileLenV2, tileLenV3, tileLenV4, unitMode, inputUnits['tl_tilelen'] || 'mm') || 0;
                  const tileW = parseF(tileWidV1, tileWidV2, tileWidV3, tileWidV4, unitMode, inputUnits['tl_tilewid'] || 'mm') || 0;
                  const grout = parseF(groutV1, groutV2, groutV3, groutV4, unitMode, inputUnits['tl_grout'] || 'mm') || 0;

                  // Fallbacks to display a balanced layout if inputs are clear
                  const safeRoomL = roomL || (unitMode === 'imp' ? 10 : 3.0);
                  const safeRoomW = roomW || (unitMode === 'imp' ? 10 : 3.0);
                  const safeTileL = tileL || (unitMode === 'imp' ? 1.0 : 0.3); // 12" or 30cm
                  const safeTileW = tileW || (unitMode === 'imp' ? 1.0 : 0.3);
                  const safeGrout = grout || (unitMode === 'imp' ? 0.0104 : 0.003); // 1/8" or 3mm

                  const effL = safeTileL + safeGrout;
                  const effW = safeTileW + safeGrout;

                  const nL = Math.floor((safeRoomL + safeGrout) / effL);
                  const nW = Math.floor((safeRoomW + safeGrout) / effW);
                  
                  const startCutL = (safeRoomL - (nL * effL - safeGrout)) / 2;
                  const startCutW = (safeRoomW - (nW * effW - safeGrout)) / 2;

                  // --- RELATIVE ANTI-SLIVER OPTIMIZATION ---
                  const sliverThresholdL = Math.min(2.0, safeTileL / 2);
                  let optCutL = startCutL;
                  if (unitMode === 'imp' && startCutL > 0 && startCutL < sliverThresholdL) {
                    optCutL += (safeTileL / 2);
                  }

                  const sliverThresholdW = Math.min(2.0, safeTileW / 2);
                  let optCutW = startCutW;
                  if (unitMode === 'imp' && startCutW > 0 && startCutW < sliverThresholdW) {
                    optCutW += (safeTileW / 2);
                  }
                  // -----------------------------------------

                  // 2. Visual Scale Engine
                  const maxDim = Math.max(safeRoomL, safeRoomW) || 1;
                  const scale = 130 / maxDim; 
                  
                  const vW = safeRoomW * scale;
                  const vL = safeRoomL * scale;
                  
                  const cx = 120;
                  const cy = 120;
                  const startX = cx - vW / 2;
                  const startY = cy - vL / 2;

                  // 3. Explicit Grid Line Arrays
                  const gridLinesX = [];
                  const gridLinesY = [];

                  if (effW > 0 && (safeRoomW / effW) < 50) {
                    // Start drawing grid lines using the OPTIMIZED cut width
                    let currentX = startX + (optCutW * scale);
                    while (currentX < startX + vW - 0.5) {
                      gridLinesX.push(currentX);
                      currentX += effW * scale;
                    }
                  }

                  if (effL > 0 && (safeRoomL / effL) < 50) {
                    // Start drawing grid lines using the OPTIMIZED cut length
                    let currentY = startY + (optCutL * scale);
                    while (currentY < startY + vL - 0.5) {
                      gridLinesY.push(currentY);
                      currentY += effL * scale;
                    }
                  }

                  // 4. Formatted Display Strings for HUD Labels
                  const displayCutL = results.sub && results.sub[2]?.value ? results.sub[2].value : `${(optCutL * (unitMode === 'imp' ? 12 : 100)).toFixed(1)}${unitMode === 'imp' ? '"' : 'cm'}`;
                  const displayCutW = results.sub && results.sub[5]?.value ? results.sub[5].value : `${(optCutW * (unitMode === 'imp' ? 12 : 100)).toFixed(1)}${unitMode === 'imp' ? '"' : 'cm'}`;
                  const displayTile = `${(safeTileL * (unitMode === 'imp' ? 12 : 100)).toFixed(0)}x${(safeTileW * (unitMode === 'imp' ? 12 : 100)).toFixed(0)}`;

                  return (
                    <svg viewBox="0 0 240 240" className="w-full max-w-[280px] h-auto overflow-visible transition-all duration-500">
                      <defs>
                        <filter id="neonGlowTL" x="-50%" y="-50%" width="200%" height="200%">
                          <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur1" />
                          <feMerge><feMergeNode in="blur1" /><feMergeNode in="SourceGraphic" /></feMerge>
                        </filter>
                        <pattern id="scanlinesTL" patternUnits="userSpaceOnUse" width="4" height="4">
                          <line x1="0" y1="0" x2="4" y2="0" stroke={theme === 'dark' ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"} strokeWidth="1" />
                        </pattern>
                      </defs>

                      <rect x="-10" y="-10" width="260" height="260" fill="url(#scanlinesTL)" rx="8" />

                      {/* --- ROOM GRID BACKGROUND FILL --- */}
                      <rect x={startX} y={startY} width={vW} height={vL} fill="var(--color-accent)" fillOpacity="0.03" />

                      {/* --- PRECISE INTERSECTING TILE GRID LINES --- */}
                      <g opacity="0.35">
                        {gridLinesX.map((lx, i) => (
                          <line key={`vert-${i}`} x1={lx} y1={startY} x2={lx} y2={startY + vL} stroke="var(--color-accent)" strokeWidth="1" />
                        ))}
                        {gridLinesY.map((ly, i) => (
                          <line key={`horiz-${i}`} x1={startX} y1={ly} x2={startX + vW} y2={ly} stroke="var(--color-accent)" strokeWidth="1" />
                        ))}
                      </g>

                      {/* --- GLOWING OUTER ROOM PERIMETER --- */}
                      <motion.rect 
                        x={startX} y={startY} width={vW} height={vL} 
                        fill="none" stroke="var(--color-accent)" strokeWidth="2.5" filter="url(#neonGlowTL)"
                        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8 }}
                      />

                      {/* --- DYNAMIC SYMMETRICAL PERIMETER CUT HIGHLIGHTS --- */}
                      <g filter="url(#neonGlowTL)">
                        <line x1={startX} y1={startY} x2={startX} y2={startY + vL} stroke="#ff00d2" strokeWidth="2" />
                        <line x1={startX + vW} y1={startY} x2={startX + vW} y2={startY + vL} stroke="#ff00d2" strokeWidth="2" />
                        <line x1={startX} y1={startY} x2={startX + vW} y2={startY} stroke="#ff00d2" strokeWidth="2" />
                        <line x1={startX} y1={startY + vL} x2={startX + vW} y2={startY + vL} stroke="#ff00d2" strokeWidth="2" />
                      </g>

                      {/* --- HUD SIDE CUT LABELS (Left & Top) --- */}
                      {/* Using paintOrder="stroke" creates a perfect, custom-fit background mask automatically! */}
                      {roomW > 0 && tileW > 0 && (
                        <text 
                          x={startX - 12} y={cy} 
                          fill="#ff00d2" fontSize="7" fontWeight="black" textAnchor="middle" 
                          transform={`rotate(-90 ${startX - 12} ${cy})`}
                          stroke={theme === 'dark' ? '#0a0a0a' : '#f9fafb'} strokeWidth="4" strokeLinejoin="round" paintOrder="stroke"
                        >
                          {displayCutW}
                        </text>
                      )}

                      {roomL > 0 && tileL > 0 && (
                        <text 
                          x={cx} y={startY - 10} 
                          fill="#ff00d2" fontSize="7" fontWeight="black" textAnchor="middle"
                          stroke={theme === 'dark' ? '#0a0a0a' : '#f9fafb'} strokeWidth="4" strokeLinejoin="round" paintOrder="stroke"
                        >
                          {displayCutL}
                        </text>
                      )}

                      {/* --- FOOTPRINT INTERACTIVE TEXT (Right & Bottom) --- */}
                      
                      {/* Room Length Label (Anchored to Canvas Bottom) */}
                      <text x={cx} y={210} fill={theme === 'dark' ? '#fff' : '#000'} fontSize="8.5" fontWeight="bold" textAnchor="middle" className="cursor-pointer hover:fill-accent transition-colors" onClick={() => document.getElementById('input-tl-roomlen')?.focus()}>
                        {roomL > 0 ? `Room L: ${roomLenV1}' ${roomLenV2}"` : 'Room Length'}
                      </text>
                      
                      {/* Room Width Label (Moved to the RIGHT side of the room to completely prevent overlapping) */}
                      <text x={startX + vW + 18} y={cy} fill={theme === 'dark' ? '#fff' : '#000'} fontSize="8.5" fontWeight="bold" textAnchor="middle" transform={`rotate(-90 ${startX + vW + 18} ${cy})`} className="cursor-pointer hover:fill-accent transition-colors" onClick={() => document.getElementById('input-tl-roomwid')?.focus()}>
                        {roomW > 0 ? `Room W: ${roomWidV1}' ${roomWidV2}"` : 'Room Width'}
                      </text>

                      {/* Tile Size Label (Anchored underneath Room Length) */}
                      <text x={cx} y={226} fill="var(--color-accent)" fontSize="7.5" fontWeight="black" textAnchor="middle" className="cursor-pointer tracking-wider hover:brightness-125 transition-all" onClick={() => document.getElementById('input-tl-tilelen')?.focus()}>
                        TILE: {displayTile} ({unitMode === 'imp' ? 'in' : 'mm'})
                      </text>
                    </svg>
                  );
                })()}
              </div>
              {/* --- END OF UPGRADED LIVE DYNAMIC DIAGRAM --- */}
							
              <div className="space-y-3 p-4 rounded-xl border border-[#333]/30 bg-black/5 dark:bg-white/5">
                <span className="block mb-1 text-[10px] font-black uppercase tracking-widest text-accent">Room Dimensions</span>
                <div id="input-tl-roomlen">
                  <InputRow label="Room Length" v1={roomLenV1} v2={roomLenV2} v3={roomLenV3} v4={roomLenV4} setV1={setRoomLenV1} setV2={setRoomLenV2} setV3={setRoomLenV3} setV4={setRoomLenV4} mode={unitMode} theme={theme} onFocus={setActiveInput} {...getUnitProps('roomlen')}/>
                </div>
                <div id="input-tl-roomwid">
                  <InputRow label="Room Width" v1={roomWidV1} v2={roomWidV2} v3={roomWidV3} v4={roomWidV4} setV1={setRoomWidV1} setV2={setRoomWidV2} setV3={setRoomWidV3} setV4={setRoomWidV4} mode={unitMode} theme={theme} onFocus={setActiveInput} {...getUnitProps('roomwid')}/>
                </div>
              </div>

              {/* Stacked Tile Dimensions */}
              <div className="space-y-3 p-4 rounded-xl border border-[#333]/30 bg-black/5 dark:bg-white/5">
                <span className="block mb-1 text-[10px] font-black uppercase tracking-widest text-accent">Tile Dimensions</span>
                <div id="input-tl-tilelen">
                  <InputRow label="Tile Length" v1={tileLenV1} v2={tileLenV2} v3={tileLenV3} v4={tileLenV4} setV1={setTileLenV1} setV2={setTileLenV2} setV3={setTileLenV3} setV4={setTileLenV4} mode={unitMode} theme={theme} hideFeet={true} onFocus={setActiveInput} {...getUnitProps('tilelen')}/>
                </div>
                <div id="input-tl-tilewid">
                  <InputRow label="Tile Width" v1={tileWidV1} v2={tileWidV2} v3={tileWidV3} v4={tileWidV4} setV1={setTileWidV1} setV2={setTileWidV2} setV3={setTileWidV3} setV4={setTileWidV4} mode={unitMode} theme={theme} hideFeet={true} onFocus={setActiveInput} {...getUnitProps('tilewid')}/>
                </div>
                <div id="input-tl-grout">
                  <InputRow label="Grout Width" v1={groutV1} v2={groutV2} v3={groutV3} v4={groutV4} setV1={setGroutV1} setV2={setGroutV2} setV3={setGroutV3} setV4={setGroutV4} mode={unitMode} theme={theme} hideFeet={true} onFocus={setActiveInput} {...getUnitProps('grout')}/>
                </div>
              </div>

							{/* Local Tape Precision Pill */}
              {unitMode === 'imp' && (
                <div className="flex flex-col pt-2 pb-2">
                  <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Tape Precision</span>
                  <div className={`flex gap-1 p-1 rounded-xl border ${theme === 'dark' ? 'bg-[#333]/20 border-[#444]/30' : 'bg-gray-200/50 border-[#ddd]'}`}>
                    {([8, 16, 32] as const).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPrecision(p)}
                        className={`flex-1 py-2.5 rounded-lg font-black text-[11px] transition-all ${
                          precision === p 
                            ? 'bg-accent text-black shadow-md' 
                            : 'text-[#888] hover:text-current'
                        }`}
                      >
                        1/{p}"
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Standardized Red Clear Button */}
              <button onClick={() => resetTool('tl')}
                className={`w-full mt-4 p-3 rounded-xl font-black tracking-widest text-[10px] uppercase active:scale-95 transition-all ${theme === 'dark' ? 'bg-[#111] border border-red-500/30 text-red-500 hover:bg-red-500/10' : 'bg-red-50 text-red-500 border border-red-200 hover:bg-red-100'}`}
              >
                Clear Tile Tool
              </button>

              {/* HERO CARD RESULT */}
              {results.main && (
                <div className={`mt-6 pt-5 border-t w-full ${theme === 'dark' ? 'border-[#222]/40' : 'border-[#ddd]'}`}>
                  <div className={`mb-4 text-center border rounded-xl p-6 shadow-lg ${theme === 'dark' ? 'bg-[#111] border-[#222]' : 'bg-gray-50 border-[#ccc]'}`}>
                    <span className="block text-[10px] font-black uppercase tracking-widest text-accent opacity-80 mb-2">Order Quantity</span>
                    <span className={`text-4xl font-black ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{results.main}</span>
                  </div>
                </div>
              )}

              {/* UPGRADED SEGMENTED LIVE TEXT OUTPUT LIST */}
              {results.sub && results.sub.length > 0 && (
                <div className="space-y-1.5 mt-2">
                  {results.sub.map((item: any, idx: number) => {
                    const isHeader = item.label.includes('---');
                    const isWarning = item.warning;

                    if (isWarning) {
                      return (
                        <div key={idx} className="flex justify-between items-center p-3 my-2 rounded-xl bg-red-500/10 border border-red-500/30 text-xs">
                          <span className="text-red-500 font-bold uppercase tracking-wide">{item.label}</span>
                          <span className="text-red-500 font-mono font-black text-right">{item.value}</span>
                        </div>
                      );
                    }

                    return (
                      <div 
                        key={idx} 
                        className={`flex justify-between items-center py-2.5 px-3 rounded-lg transition-colors ${
                          isHeader 
                            ? 'mt-4 mb-1 border-none bg-accent/10 dark:bg-accent/5' 
                            : theme === 'dark' ? 'border-b border-[#222]/40 hover:bg-white/[0.02]' : 'border-b border-[#ddd]/60 hover:bg-black/[0.02]'
                        }`}
                      >
                        <span className={`${
                          isHeader 
                            ? 'text-accent font-black uppercase tracking-widest text-[10px]' 
                            : `text-xs opacity-80 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`
                        }`}>
                          {item.label.replace(/-/g, '').trim()}
                        </span>
                        
                        {!isHeader && (
                          <span className={`font-bold font-mono text-right ${
                            item.highlight 
                              ? 'text-accent text-sm tracking-wide font-black' 
                              : theme === 'dark' ? 'text-white text-xs' : 'text-black text-xs'
                          }`}>
                            {item.value}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTool === 'oc' && (
            <div className="space-y-4">
						
							{/* --- SHAPE-SHIFTING ILLUSTRATIVE DIAGRAM --- */}
              <div className={`mb-6 flex justify-center items-center p-6 rounded-xl border shadow-inner ${theme === 'dark' ? 'bg-[#0a0a0a] border-[#222]' : 'bg-gray-50 border-[#ddd]'}`}>
                <svg viewBox="0 0 200 160" className="w-full max-w-[280px] h-auto overflow-visible transition-all duration-500">
                  <defs>
                    <filter id="neonGlowOC" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur1" />
                      <feMerge><feMergeNode in="blur1" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                    <pattern id="scanlinesOC" patternUnits="userSpaceOnUse" width="4" height="4">
                      <line x1="0" y1="0" x2="4" y2="0" stroke={theme === 'dark' ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"} strokeWidth="1" />
                    </pattern>
                  </defs>

                  <rect x="-10" y="-10" width="220" height="180" fill="url(#scanlinesOC)" rx="8" />

                  {(() => {
                    const cx = 100;
                    const fillC = theme === 'dark' ? '#555' : '#ccc';
                    const strokeC = theme === 'dark' ? '#333' : '#aaa';
                    
                    const visLeftLimit = 30; 
                    const visRightLimit = 170; 
                    const visSpan = visRightLimit - visLeftLimit; 

                    // 1. Math Engine: Safely compile feet, inches, and fractions for the label
                    const subDivisor = unitMode === 'imp' ? 12 : 100;
                    const ft = parseFloat(a1) || 0;
                    const inc = parseFloat(a2) || 0;
                    const num = parseFloat(a3) || 0;
                    const den = parseFloat(a4) || 0;
                    const frac = den ? num / den : 0;
                    const totalVal = ft + (inc + frac) / subDivisor;

                    // 2. Format exact display string that respects fractions and metric modes
                    let displayRun = 'Input Total';
                    if (totalVal > 0) {
                      if (unitMode === 'imp') {
                        displayRun = `Total Run: ${a1 || 0}' ${a2 || 0}${num && den ? ` ${num}/${den}` : ''}"`;
                      } else {
                        displayRun = `Total Run: ${totalVal.toFixed(2)} m`;
                      }
                    }

                    return (
                      <g>
                        {/* --- MODE 1: EQUAL DISTRIBUTION (LIGHTS/DECOR) --- */}
                        {ocMode === 'equal' && (
                          <g>
                            <text x="10" y="12" fill={theme === 'dark' ? '#333' : '#ccc'} fontSize="6" fontWeight="black" textAnchor="start" className="uppercase tracking-widest">
                              Equal Distribution (Lights/Decor)
                            </text>
                            
                            {/* Structure */}
                            <motion.line x1="10" y1="40" x2="190" y2="40" stroke={theme === 'dark' ? '#444' : '#bbb'} strokeWidth="5" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.5 }} style={{ originX: '50%' }} />
                            <text x="100" y="34" fill={theme === 'dark' ? '#555' : '#888'} fontSize="6" fontWeight="bold" textAnchor="middle">Structure (e.g., Wall/Ceiling)</text>
                            
                            {/* Objects */}
                            {(() => {
                              const qtyVal = Math.min(6, Math.max(1, parseInt(qty) || 1));
                              const visSeg = visSpan / qtyVal; 
                              const objectSize = 6;
                              
                              return Array.from({ length: qtyVal }).map((_, i) => {
                                const ox = visLeftLimit + (visSeg / 2) + (i * visSeg);
                                return (
                                  <motion.g key={`eq-${i}`} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1, duration: 0.3 }}>
                                    <circle cx={ox} cy="65" r={objectSize} fill={fillC} stroke={strokeC} strokeWidth="1.5" />
                                    <circle cx={ox} cy="65" r="1.5" fill="#ff00d2" filter="url(#neonGlowOC)" />
                                  </motion.g>
                                );
                              });
                            })()}

                            {/* Dimensions */}
                            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} filter="url(#neonGlowOC)">
                              {(() => {
                                const qtyVal = Math.min(6, Math.max(1, parseInt(qty) || 3));
                                const visSeg = visSpan / qtyVal;
																const mark1_X = (visLeftLimit + visSeg / 2) || 0;
																const mark2_X = (visLeftLimit + visSeg + visSeg / 2) || 0;

                                return (
                                  <g>
                                    {qtyVal > 1 && (
                                      <g>
                                        <line x1={mark1_X} y1="90" x2={mark2_X} y2="90" stroke="#ff00d2" strokeWidth="2.5" />
                                        <path d={`M ${mark1_X} 85 L ${mark1_X} 95`} fill="none" stroke="#ff00d2" strokeWidth="1.5" />
                                        <path d={`M ${mark2_X} 85 L ${mark2_X} 95`} fill="none" stroke="#ff00d2" strokeWidth="1.5" />
                                        <text x={mark1_X + visSeg / 2} y="86" fill="#ff00d2" fontSize="7" fontWeight="black" textAnchor="middle">Full Space (S)</text>
                                      </g>
                                    )}
                                    <g>
                                      <line x1={visLeftLimit} y1="115" x2={mark1_X} y2="115" stroke="#ff00d2" strokeWidth="2.5" strokeDasharray="3,3" />
                                      <path d={`M ${visLeftLimit} 110 L ${visLeftLimit} 120`} fill="none" stroke="#ff00d2" strokeWidth="1.5" />
                                      <path d={`M ${mark1_X} 110 L ${mark1_X} 120`} fill="none" stroke="#ff00d2" strokeWidth="1.5" />
                                      {/* Upgraded Text Anchor: Starts inside the wall line so it never clips */}
                                      <text x={visLeftLimit + 4} y="111" fill="#ff00d2" fontSize="6.5" fontWeight="black" textAnchor="start">1/2 Space</text>
                                    </g>
                                  </g>
                                );
                              })()}
                            </motion.g>
                            
                            {/* Boundaries */}
                            <motion.line x1={visLeftLimit} y1="30" x2={visLeftLimit} y2="125" stroke={theme === 'dark' ? '#fff' : '#000'} strokeWidth="1.5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} />
                            <motion.line x1={visRightLimit} y1="30" x2={visRightLimit} y2="125" stroke={theme === 'dark' ? '#fff' : '#000'} strokeWidth="1.5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} />
                            <text x={visLeftLimit - 5} y="35" fill={theme === 'dark' ? '#fff' : '#000'} fontSize="6" fontWeight="bold" textAnchor="end">Wall</text>
                            <text x={visRightLimit + 5} y="35" fill={theme === 'dark' ? '#fff' : '#000'} fontSize="6" fontWeight="bold" textAnchor="start">Wall</text>
                          </g>
                        )}

                        {/* --- MODE 2: STRUCTURAL LAYOUT (POSTS/STUDS) --- */}
                        {ocMode === 'structural' && (
                          <g>
                            <text x="10" y="12" fill={theme === 'dark' ? '#333' : '#ccc'} fontSize="6" fontWeight="black" textAnchor="start" className="uppercase tracking-widest">
                              Structural Layout (Posts/Studs)
                            </text>
                            
                            {/* Posts */}
                            {(() => {
                              const postVisW = 16;
                              const postVisH = 60;
                              const visTopY = 35;
                              
                              const leftPostX = visLeftLimit + postVisW / 2;
                              const rightPostX = visRightLimit - postVisW / 2;
                              const centers = [leftPostX, 100, rightPostX];

                              return centers.map((ox, i) => (
                                <motion.rect key={`post-${i}`} x={ox - postVisW / 2} y={visTopY} width={postVisW} height={postVisH} fill={fillC} stroke={strokeC} strokeWidth="1" rx="1" initial={{ opacity: 0, scaleY: 0 }} animate={{ opacity: 1, scaleY: 1 }} transition={{ delay: i * 0.1, duration: 0.4 }} style={{ originY: "100%" }} />
                              ));
                            })()}

                            {/* Dimensions */}
                            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} filter="url(#neonGlowOC)">
                              {(() => {
                                const postVisW = 16;
                                const leftPostCenter = visLeftLimit + postVisW / 2;
                                const centerPostCenter = 100;

                                return (
                                  <g>
                                    <line x1={visLeftLimit} y1="25" x2={visRightLimit} y2="25" stroke="#ff00d2" strokeWidth="2.5" />
                                    <path d={`M ${visLeftLimit} 20 L ${visLeftLimit} 30`} fill="none" stroke="#ff00d2" strokeWidth="1.5" />
                                    <path d={`M ${visRightLimit} 20 L ${visRightLimit} 30`} fill="none" stroke="#ff00d2" strokeWidth="1.5" />
                                    <text x="100" y="21" fill="#ff00d2" fontSize="7" fontWeight="black" textAnchor="middle">Total (Edge-to-Edge)</text>
                                    
                                    <line x1={leftPostCenter} y1="115" x2={centerPostCenter} y2="115" stroke="#ff00d2" strokeWidth="2.5" strokeDasharray="3,3" />
                                    <circle cx={leftPostCenter} cy="115" r="3" fill="#ff00d2" />
                                    <circle cx={centerPostCenter} cy="115" r="3" fill="#ff00d2" />
                                    <text x={(leftPostCenter + centerPostCenter) / 2} y="111" fill="#ff00d2" fontSize="7" fontWeight="black" textAnchor="middle">C-to-C (Equal)</text>
                                  </g>
                                );
                              })()}
                            </motion.g>
                          </g>
                        )}

                        {/* --- MODE 3: BALUSTER SPACING (EQUAL GAPS) --- */}
                        {ocMode === 'baluster' && (
                          <g>
                            <text x="10" y="12" fill={theme === 'dark' ? '#333' : '#ccc'} fontSize="6" fontWeight="black" textAnchor="start" className="uppercase tracking-widest">
                              Baluster Spacing (Equal Gaps)
                            </text>
                            
                            {/* Rails */}
                            <motion.rect x={visLeftLimit - 10} y="30" width={visSpan + 20} height="10" fill={theme === 'dark' ? '#444' : '#bbb'} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} />
                            <motion.rect x={visLeftLimit - 10} y="90" width={visSpan + 20} height="10" fill={theme === 'dark' ? '#444' : '#bbb'} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.1 }} />
                            
                            {/* Boundary Posts */}
                            <rect x={visLeftLimit - 12} y="20" width="12" height="80" fill={fillC} stroke={strokeC} strokeWidth="1" rx="1" />
                            <rect x={visRightLimit} y="20" width="12" height="80" fill={fillC} stroke={strokeC} strokeWidth="1" rx="1" />

                            {/* Balusters */}
                            {(() => {
                              const balQty = Math.max(1, parseInt(qty) || 5);
															const gapCount = balQty + 1; 
															const gapVisW = (visSpan / gapCount) || 0; 
                              const balVisW = 4;
                              const balVisH = 50; 
                              
                              return Array.from({ length: balQty }).map((_, i) => {
                                const ox = visLeftLimit + gapVisW + (i * gapVisW);
                                return (
                                  <motion.rect key={`bal-${i}`} x={ox - balVisW / 2} y="40" width={balVisW} height={balVisH} fill={fillC} stroke={strokeC} strokeWidth="1" rx="0.5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.08, duration: 0.3 }} />
                                );
                              });
                            })()}

                            {/* Dimensions */}
                            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} filter="url(#neonGlowOC)">
                              {(() => {
                                const balQty = 5;
                                const gapCount = balQty + 1;
                                const gapVisW = visSpan / gapCount; 
                                const balVisW = 4;
                                
                                const startGapCenterX = visLeftLimit + gapVisW / 2;
                                // Move the "Equal Gaps" indicator to the 3rd gap for visual breathing room
                                const midGapCenterX = visLeftLimit + (gapVisW * 2.5);

                                return (
                                  <g>
                                    {/* Start Gap indicator (Text placed ABOVE the line) */}
                                    <line x1={visLeftLimit} y1="115" x2={visLeftLimit + gapVisW - balVisW / 2} y2="115" stroke="#ff00d2" strokeWidth="2.5" strokeDasharray="3,3" />
                                    <path d={`M ${visLeftLimit} 110 L ${visLeftLimit} 120`} fill="none" stroke="#ff00d2" strokeWidth="1.5" />
                                    <path d={`M ${visLeftLimit + gapVisW - balVisW / 2} 110 L ${visLeftLimit + gapVisW - balVisW / 2} 120`} fill="none" stroke="#ff00d2" strokeWidth="1.5" />
                                    <text x={startGapCenterX} y="107" fill="#ff00d2" fontSize="6.5" fontWeight="black" textAnchor="middle">Start Gap</text>
                                    
                                    {/* Mid Gap indicator (Moved right, Text placed BELOW the line) */}
                                    <line x1={visLeftLimit + gapVisW * 2 + balVisW / 2} y1="115" x2={visLeftLimit + gapVisW * 3 - balVisW / 2} y2="115" stroke="#ff00d2" strokeWidth="2.5" strokeDasharray="3,3" />
                                    <path d={`M ${visLeftLimit + gapVisW * 2 + balVisW / 2} 110 L ${visLeftLimit + gapVisW * 2 + balVisW / 2} 120`} fill="none" stroke="#ff00d2" strokeWidth="1.5" />
                                    <path d={`M ${visLeftLimit + gapVisW * 3 - balVisW / 2} 110 L ${visLeftLimit + gapVisW * 3 - balVisW / 2} 120`} fill="none" stroke="#ff00d2" strokeWidth="1.5" />
                                    <text x={midGapCenterX} y="126" fill="#ff00d2" fontSize="6.5" fontWeight="black" textAnchor="middle">Equal Gaps</text>
                                  </g>
                                );
                              })()}
                            </motion.g>
                          </g>
                        )}

                        {/* --- COMMON TOTAL MEASUREMENT LINE --- */}
                        <motion.g initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 1, duration: 0.5 }} style={{ originX: '50%' }}>
                          <line x1={visLeftLimit} y1="140" x2={visRightLimit} y2="140" stroke={theme === 'dark' ? '#fff' : '#000'} strokeWidth="1" />
                          <line x1={visLeftLimit} y1="137" x2={visLeftLimit} y2="143" stroke={theme === 'dark' ? '#fff' : '#000'} strokeWidth="1" />
                          <line x1={visRightLimit} y1="137" x2={visRightLimit} y2="143" stroke={theme === 'dark' ? '#fff' : '#000'} strokeWidth="1" />
                          
                          <text x="100" y="152" fill={theme === 'dark' ? '#fff' : '#000'} fontSize="7.5" fontWeight="bold" textAnchor="middle" className="cursor-pointer hover:fill-accent transition-colors" onClick={() => document.getElementById('input-oc-total')?.focus()}>
                            {displayRun}
                          </text>
                        </motion.g>
                      </g>
                    );
                  })()}
                </svg>
              </div>
							{/* --- END OF UPGRADED LIVE DYNAMIC DIAGRAM --- */}
							
              {/* Upgraded Layout Mode Selector */}
              <div className="flex flex-col">
                <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Layout Mode</span>
                <select value={ocMode} onChange={(e) => setOcMode(e.target.value as any)} 
                  className={`w-full border rounded-xl p-4 text-center font-bold text-sm outline-none appearance-none shadow-sm transition-colors ${theme === 'dark' ? 'bg-[#111] border-[#222] text-white focus:border-accent' : 'bg-gray-50 border-[#ccc] text-black focus:border-accent'}`}
                >
                  <option value="equal">Equal Distribution (Lights)</option>
                  <option value="structural">Structural Layout (Posts)</option>
                  <option value="baluster">Equal Spacing (Balusters)</option>
                </select>
              </div>

              <div id="input-oc-total">
                <InputRow label={ocMode === 'baluster' ? "Railing Length" : "Total Measurement"} v1={a1} v2={a2} v3={a3} v4={a4} setV1={setA1} setV2={setA2} setV3={setA3} setV4={setA4} mode={unitMode} theme={theme} onFocus={setActiveInput} {...getUnitProps('a')} />
              </div>
              
              {ocMode === 'baluster' ? (
                <div className="space-y-4">
                  <div id="input-oc-baluster">
                    <InputRow label="Baluster Width" v1={b1} v2={b2} v3={b3} v4={b4} setV1={setB1} setV2={setB2} setV3={setB3} setV4={setB4} mode={unitMode} theme={theme} onFocus={setActiveInput} {...getUnitProps('b')}/>
                  </div>
									
                  {/* Upgraded Segmented Pill for Baluster Mode */}
                  <div className="flex flex-col">
                    <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Baluster Mode</span>
                    <div className={`flex gap-1 p-1 rounded-xl border ${theme === 'dark' ? 'bg-[#333]/20 border-[#444]/30' : 'bg-gray-200/50 border-[#ddd]'}`}>
                      <button onClick={() => setBalustersubMode('code')}
                        className={`flex-1 py-3 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all ${balustersubMode === 'code' ? 'bg-accent text-black shadow-md' : 'text-[#888] hover:text-current'}`}
                      >
                        Max Gap (Code)
                      </button>
                      <button onClick={() => setBalustersubMode('fixed')}
                        className={`flex-1 py-3 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all ${balustersubMode === 'fixed' ? 'bg-accent text-black shadow-md' : 'text-[#888] hover:text-current'}`}
                      >
                        Fixed Spacing
                      </button>
                    </div>
                  </div>

                  {balustersubMode === 'code' ? (
                    <div id="input-oc-gap">
                      <InputRow label="Max Opening" v1={maxOpV1} v2={maxOpV2} v3={maxOpV3} v4={maxOpV4} setV1={setMaxOpV1} setV2={setMaxOpV2} setV3={setMaxOpV3} setV4={setMaxOpV4} mode={unitMode} theme={theme} onFocus={setActiveInput} {...getUnitProps('maxop')}/>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div id="input-oc-gap">
                        <InputRow label="Desired Gap" v1={desiredGapV1} v2={desiredGapV2} v3={desiredGapV3} v4={desiredGapV4} setV1={setDesiredGapV1} setV2={setDesiredGapV2} setV3={setDesiredGapV3} setV4={setDesiredGapV4} mode={unitMode} theme={theme} onFocus={setActiveInput} {...getUnitProps('desiredgap')}/>
                      </div>
											
                      {/* Upgraded Toggle Switch Card */}
                      <div className={`flex items-center justify-between p-4 border rounded-xl shadow-sm ${theme === 'dark' ? 'bg-[#111] border-[#222]' : 'bg-gray-50 border-[#ccc]'}`}>
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Symmetrical Layout</span>
                        <button onClick={() => setFixedSpacing(!FixedSpacing)}
                          className={`w-12 h-6 rounded-full relative transition-colors ${FixedSpacing ? 'bg-accent' : (theme === 'dark' ? 'bg-[#333]' : 'bg-gray-300')}`}
                        >
                          <motion.div animate={{ x: FixedSpacing ? 24 : 2 }} className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-sm"/>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Upgraded Number Input */}
                  <div className="flex flex-col" id="input-oc-qty">
                    <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Number of Items</span>
                    <input type="number" value={qty} onChange={(e) => setQty(e.target.value)} 
                      className={`w-full border rounded-xl p-4 text-center font-black text-lg outline-none transition-colors ${theme === 'dark' ? 'bg-[#111] border-[#222] text-white focus:border-accent' : 'bg-gray-50 border-[#ccc] text-black focus:border-accent'}`} 
                    />
                  </div>
                  {ocMode === 'structural' && (
                    <div id="input-oc-post">
                      <InputRow label="Post Width" v1={postWidthV1} v2={postWidthV2} v3={postWidthV3} v4={postWidthV4} setV1={setPostWidthV1} setV2={setPostWidthV2} setV3={setPostWidthV3} setV4={setPostWidthV4} mode={unitMode} theme={theme} onFocus={setActiveInput} {...getUnitProps('postwidth')}/>
                    </div>
                  )}
                </div>
              )}
              
              {/* Local Tape Precision Pill */}
              {unitMode === 'imp' && (
                <div className="flex flex-col pt-2 pb-2">
                  <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Tape Precision</span>
                  <div className={`flex gap-1 p-1 rounded-xl border ${theme === 'dark' ? 'bg-[#333]/20 border-[#444]/30' : 'bg-gray-200/50 border-[#ddd]'}`}>
                    {([8, 16, 32] as const).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPrecision(p)}
                        className={`flex-1 py-2.5 rounded-lg font-black text-[11px] transition-all ${
                          precision === p 
                            ? 'bg-accent text-black shadow-md' 
                            : 'text-[#888] hover:text-current'
                        }`}
                      >
                        1/{p}"
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Standardized Red Clear Button */}
              <button onClick={() => resetTool('oc')}
                className={`w-full mt-4 p-3 rounded-xl font-black tracking-widest text-[10px] uppercase active:scale-95 transition-all ${theme === 'dark' ? 'bg-[#111] border border-red-500/30 text-red-500 hover:bg-red-500/10' : 'bg-red-50 text-red-500 border border-red-200 hover:bg-red-100'}`}
              >
                Clear On-Center Tool
              </button>

              {/* HERO CARD RESULT */}
              {results.main && (
                <div className={`mt-6 pt-5 border-t w-full ${theme === 'dark' ? 'border-[#222]/40' : 'border-[#ddd]'}`}>
                  <div className={`mb-4 text-center border rounded-xl p-6 shadow-lg ${theme === 'dark' ? 'bg-[#111] border-[#222]' : 'bg-gray-50 border-[#ccc]'}`}>
                    <span className="block text-[10px] font-black uppercase tracking-widest text-accent opacity-80 mb-2">Primary Result</span>
                    <span className={`text-4xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{results.main}</span>
                  </div>
                </div>
              )}

              {/* UPGRADED SEGMENTED LIVE TEXT OUTPUT LIST */}
              {results.sub && results.sub.length > 0 && (
                <div className="space-y-1.5 mt-2">
                  {results.sub.map((item: any, idx: number) => {
                    const isHeader = item.label.includes('---');
                    const isWarning = item.warning;

                    if (isWarning) {
                      return (
                        <div key={idx} className="flex justify-between items-center p-3 my-2 rounded-xl bg-red-500/10 border border-red-500/30 text-xs">
                          <span className="text-red-500 font-bold uppercase tracking-wide">{item.label}</span>
                          <span className="text-red-500 font-mono font-black text-right">{item.value}</span>
                        </div>
                      );
                    }

                    return (
                      <div 
                        key={idx} 
                        className={`flex justify-between items-center py-2.5 px-3 rounded-lg transition-colors ${
                          isHeader 
                            ? 'mt-4 mb-1 border-none bg-accent/10 dark:bg-accent/5' 
                            : theme === 'dark' ? 'border-b border-[#222]/40 hover:bg-white/[0.02]' : 'border-b border-[#ddd]/60 hover:bg-black/[0.02]'
                        }`}
                      >
                        <span className={`${
                          isHeader 
                            ? 'text-accent font-black uppercase tracking-widest text-[10px]' 
                            : `text-xs opacity-80 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`
                        }`}>
                          {item.label.replace(/-/g, '').trim()}
                        </span>
                        
                        {!isHeader && (
                          <span className={`font-bold font-mono text-right ${
                            item.highlight 
                              ? 'text-accent text-sm tracking-wide font-black' 
                              : theme === 'dark' ? 'text-white text-xs' : 'text-black text-xs'
                          }`}>
                            {item.value}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTool === 'calc' && (
            <div className="space-y-4">
              
              {/* --- UPGRADED RUNNING DIMENSION DIAGRAM & TAPE SCREEN --- */}
              <div className={`mb-6 p-4 rounded-xl border shadow-inner flex flex-col items-center ${theme === 'dark' ? 'bg-[#0a0a0a] border-[#222]' : 'bg-gray-50 border-[#ddd]'}`}>
                
                {/* Visual Blueprint Tape Measure */}
                <div className="w-full max-w-[280px] h-[100px] mb-4 relative overflow-hidden">
                  <svg viewBox="0 0 240 80" className="w-full h-full overflow-visible transition-all duration-500">
                    <defs>
                      <filter id="neonGlowCALC" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur" />
                        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                      </filter>
                      <pattern id="gridCALC" width="10" height="10" patternUnits="userSpaceOnUse">
                        <line x1="10" y1="0" x2="10" y2="10" stroke={theme === 'dark' ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} strokeWidth="0.5" />
                        <line x1="0" y1="10" x2="10" y2="10" stroke={theme === 'dark' ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} strokeWidth="0.5" />
                      </pattern>
                    </defs>

                    <rect x="0" y="0" width="100%" height="100%" fill="url(#gridCALC)" rx="4" />

                    {(() => {
                      const currentValNum = parseFloat(currentValue) || 0; 
                      
                      const entryVal = parseF(a1, a2, a3, a4, unitMode, inputUnits['calc_a'] || 'mm');
                      const scalar = parseFloat(qty);
                      const isScalarTyping = qty !== '';
                      const isDimTyping = a1 !== '' || a2 !== '' || a3 !== '' || (a4 !== '' && a4 !== '1');
                      const hasEntry = subMode === 'scalar' ? isScalarTyping : isDimTyping;
                      const activeInput = subMode === 'scalar' ? (isNaN(scalar) ? 0 : scalar) : entryVal;

                      let targetValNum = currentValNum;
                      if (hasEntry && currentOp) {
                         if (currentOp === 'add') targetValNum = currentValNum + activeInput;
                         if (currentOp === 'sub') targetValNum = Math.max(0, currentValNum - activeInput);
                         if (currentOp === 'mul') targetValNum = currentValNum * activeInput;
                         if (currentOp === 'div' && activeInput !== 0) targetValNum = currentValNum / activeInput;
                      }

                      // Scale Engine: Dynamically adjust the "zoom" so the max line always fits
                      const maxVal = Math.max(currentValNum, targetValNum) || 10;
                      const scale = 200 / maxVal;
                      const cx = 120;
                      const cy = 40; 

                      const startX = 20; 
                      const accX = startX + (currentValNum * scale); 
                      const targetX = startX + (targetValNum * scale);

                      return (
                        <g>
                          <text x="120" y="15" fill={theme === 'dark' ? '#555' : '#aaa'} fontSize="5" fontWeight="black" textAnchor="middle" className="uppercase tracking-widest">
                            Running Dimension Layout
                          </text>

                          <line x1={startX} y1="30" x2={startX} y2="50" stroke={theme === 'dark' ? '#fff' : '#000'} strokeWidth="1.5" />
                          <text x={startX} y="60" fill={theme === 'dark' ? '#888' : '#666'} fontSize="5" fontWeight="bold" textAnchor="middle">0</text>

                          {currentValNum > 0 && (
                            <motion.g initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ type: "spring", stiffness: 100 }} style={{ originX: 0 }}>
                              <line x1={startX} y1={cy} x2={accX} y2={cy} stroke={theme === 'dark' ? '#555' : '#ccc'} strokeWidth="3" />
                              <line x1={accX} y1="32" x2={accX} y2="48" stroke={theme === 'dark' ? '#555' : '#ccc'} strokeWidth="1.5" />
                            </motion.g>
                          )}

                          {hasEntry && currentOp && (
                            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                              <line 
                                x1={accX} y1={cy} x2={targetX} y2={cy} 
                                stroke="#ff00d2" strokeWidth="2.5" strokeDasharray="3,3" filter="url(#neonGlowCALC)" 
                              />
                              <line x1={targetX} y1="32" x2={targetX} y2="48" stroke="#ff00d2" strokeWidth="2" filter="url(#neonGlowCALC)" />
                              
                              <text x={(accX + targetX) / 2} y="32" fill="#ff00d2" fontSize="8" fontWeight="black" textAnchor="middle" filter="url(#neonGlowCALC)">
                                {currentOp === 'add' ? '+' : currentOp === 'sub' ? '-' : currentOp === 'mul' ? '×' : '÷'}
                              </text>
                            </motion.g>
                          )}

                          {!hasEntry && currentValNum > 0 && (
                            <g>
                              <line x1={startX} y1={cy} x2={accX} y2={cy} stroke="var(--color-accent)" strokeWidth="3" filter="url(#neonGlowCALC)" opacity="0.8" />
                              <line x1={accX} y1="30" x2={accX} y2="50" stroke="var(--color-accent)" strokeWidth="2" filter="url(#neonGlowCALC)" />
                            </g>
                          )}
                        </g>
                      );
                    })()}
                  </svg>
                </div>

                {/* Digital Readout Screen */}
                <div className={`relative w-full p-4 rounded-xl border flex justify-end items-center font-mono text-sm tracking-wider shadow-[inset_0_0_15px_rgba(0,0,0,0.5)] overflow-hidden ${theme === 'dark' ? 'bg-[#050505] border-accent/30 text-accent shadow-accent/10' : 'bg-[#e0f7ff] border-[#0099cc]/30 text-[#0088aa]'}`}>
                  <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)' }}></div>
                  <div className="relative z-10 text-xl font-black drop-shadow-[0_0_8px_currentColor]">
                    {history || '0'}
                  </div>
                </div>
              </div>
              {/* --- END UPGRADED DIAGRAM --- */}

              {/* --- UPGRADED INPUT ARCHITECTURE --- */}
              <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-white/5 border-[#333]/30' : 'bg-black/5 border-[#ccc]/50'}`}>
                
                {/* Sub-Mode Toggle */}
                <div className={`flex gap-1 p-1 mb-4 rounded-xl border ${theme === 'dark' ? 'bg-[#333]/20 border-[#444]/30' : 'bg-gray-200/50 border-[#ddd]'}`}>
                  <button onClick={() => setSubMode('dim')} className={`flex-1 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${subMode !== 'scalar' ? 'bg-accent text-black shadow-md' : 'text-[#888] hover:text-current'}`}>
                    Dimensional (+ / -)
                  </button>
                  <button onClick={() => setSubMode('scalar')} className={`flex-1 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${subMode === 'scalar' ? 'bg-[#ff00d2] text-white shadow-md' : 'text-[#888] hover:text-current'}`}>
                    Scalar Math (× / ÷)
                  </button>
                </div>

                {/* Conditional Inputs */}
                {subMode !== 'scalar' ? (
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} id="input-calc-dim">
                    <span className="block mb-2 text-[10px] font-black uppercase tracking-widest text-accent opacity-80">Add or Subtract Length</span>
                    <InputRow label="Enter Dimension" v1={a1} v2={a2} v3={a3} v4={a4} setV1={setA1} setV2={setA2} setV3={setA3} setV4={setA4} mode={unitMode} theme={theme} onFocus={setActiveInput} {...getUnitProps('a')}/>
                  </motion.div>
                ) : (
                  <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col" id="input-calc-scalar">
                    <span className="block mb-2 text-[10px] font-black uppercase tracking-widest text-[#ff00d2] opacity-80">Multiply or Divide by Number</span>
                    <input type="number" value={qty} onChange={(e) => setQty(e.target.value)} 
                      placeholder="e.g. 12 (Number of pieces)" 
                      className={`w-full border rounded-xl p-4 text-center font-bold text-lg outline-none transition-all ${theme === 'dark' ? 'bg-[#111] border-[#ff00d2]/50 text-white focus:border-[#ff00d2]' : 'bg-white border-[#ff00d2]/50 text-black focus:border-[#ff00d2]'}`} 
                    />
                  </motion.div>
                )}
              </div>
              
              {/* --- SMART CONTEXTUAL KEYPAD --- */}
              <div className="grid grid-cols-4 gap-3 mt-4">
                {subMode !== 'scalar' ? (
                  <>
                    <button onClick={() => calcC('add')} className={`col-span-2 p-4 rounded-xl font-black text-2xl active:scale-95 transition-all shadow-sm ${theme === 'dark' ? 'bg-[#111] border border-[#333] text-accent hover:bg-[#222]' : 'bg-white border border-[#ccc] text-[#0099cc] hover:bg-gray-100'}`}>+</button>
                    <button onClick={() => calcC('sub')} className={`col-span-2 p-4 rounded-xl font-black text-2xl active:scale-95 transition-all shadow-sm ${theme === 'dark' ? 'bg-[#111] border border-[#333] text-accent hover:bg-[#222]' : 'bg-white border border-[#ccc] text-[#0099cc] hover:bg-gray-100'}`}>-</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => calcC('mul')} className={`col-span-2 p-4 rounded-xl font-black text-2xl active:scale-95 transition-all shadow-sm ${theme === 'dark' ? 'bg-[#111] border border-[#ff00d2]/50 text-[#ff00d2] hover:bg-[#222]' : 'bg-white border border-[#ff00d2]/50 text-[#ff00d2] hover:bg-pink-50'}`}>×</button>
                    <button onClick={() => calcC('div')} className={`col-span-2 p-4 rounded-xl font-black text-2xl active:scale-95 transition-all shadow-sm ${theme === 'dark' ? 'bg-[#111] border border-[#ff00d2]/50 text-[#ff00d2] hover:bg-[#222]' : 'bg-white border border-[#ff00d2]/50 text-[#ff00d2] hover:bg-pink-50'}`}>÷</button>
                  </>
                )}
                
                <button onClick={clearC} className={`col-span-2 p-4 rounded-xl font-black tracking-widest text-xs uppercase active:scale-95 transition-all ${theme === 'dark' ? 'bg-[#111] border border-red-500/30 text-red-500 hover:bg-red-500/10' : 'bg-red-50 text-red-500 border border-red-200 hover:bg-red-100'}`}>Clear All</button>
                <button onClick={() => calcC('eq')} className="col-span-2 bg-accent text-black p-4 rounded-xl font-black text-2xl active:scale-95 transition-all shadow-[0_0_15px_rgba(0,210,255,0.3)] hover:brightness-110">=</button>
              </div>
            </div>
          )}

          {activeTool === 'st' && (
            <div className="space-y-4">             
              {/* Upgraded Project Type Pill */}
              <div className="flex flex-col">
                <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Project Type</span>
                <div className={`flex gap-1 p-1 rounded-xl border ${theme === 'dark' ? 'bg-[#333]/20 border-[#444]/30' : 'bg-gray-200/50 border-[#ddd]'}`}>
                  <button onClick={() => setStairMode('structural')} 
                    className={`flex-1 py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${stairMode === 'structural' ? 'bg-accent text-black shadow-md' : 'text-[#888] hover:text-current'}`}
                  >
                    Structural (Deck/Home)
                  </button>
                  <button onClick={() => setStairMode('landscape')} 
                    className={`flex-1 py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${stairMode === 'landscape' ? 'bg-green-500 text-black shadow-md' : 'text-[#888] hover:text-current'}`}
                  >
                    Landscape (Garden)
                  </button>
                </div>
              </div>

              {/* Upgraded Riser Height Pill */}
              {stairMode === 'structural' && (
                <div className="flex flex-col">
                  <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Riser Height Preference</span>
                  <div className={`flex gap-1 p-1 rounded-xl border ${theme === 'dark' ? 'bg-[#333]/20 border-[#444]/30' : 'bg-gray-200/50 border-[#ddd]'}`}>
                    <button onClick={() => setSubMode('standard')} 
                      className={`flex-1 py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${subMode === 'standard' ? 'bg-accent text-black shadow-md' : 'text-[#888] hover:text-current'}`}
                    >
                      Standard (~7")
                    </button>
                    <button onClick={() => setSubMode('max')} 
                      className={`flex-1 py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${subMode === 'max' ? 'bg-accent text-black shadow-md' : 'text-[#888] hover:text-current'}`}
                    >
                      Max Code (~7 7/8")
                    </button>
                  </div>
                </div>
              )}

              <div id="input-st-rise">
                <InputRow label="Total Rise" v1={a1} v2={a2} v3={a3} v4={a4} setV1={setA1} setV2={setA2} setV3={setA3} setV4={setA4} mode={unitMode} theme={theme} onFocus={() => setActiveInput({ setV: setA1, setNum: setA3, setDen: setA4 })} {...getUnitProps('a')} />
              </div>
              <div id="input-st-run">
                <InputRow label={stairMode === 'landscape' ? "Total Run / Tread Length" : "Total Run (Optional)"} v1={b1} v2={b2} v3={b3} v4={b4} setV1={setB1} setV2={setB2} setV3={setB3} setV4={setB4} mode={unitMode} theme={theme} onFocus={() => setActiveInput({ setV: setB1, setNum: setB3, setDen: setB4 })} {...getUnitProps('b')} />
              </div>
							
              {stairMode === 'landscape' && (
                <div className="flex flex-col gap-2">
                  <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Adjust Step Count</span>
                  <div className={`flex gap-2 items-center justify-center p-3 rounded-xl border ${theme === 'dark' ? 'bg-[#111] border-[#222]' : 'bg-gray-50 border-[#ccc]'}`}>
                    <button onClick={() => setStepNudge(prev => prev - 1)} className="p-3 bg-[#333] hover:bg-[#444] rounded-lg text-white font-black w-14 active:scale-95 transition-all">-</button>
                    <span className={`text-xl font-black px-6 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{stepNudge > 0 ? `+${stepNudge}` : stepNudge}</span>
                    <button onClick={() => setStepNudge(prev => prev + 1)} className="p-3 bg-accent text-black rounded-lg font-black w-14 active:scale-95 transition-all shadow-[0_0_10px_rgba(0,210,255,0.3)]">+</button>
                  </div>
                </div>
              )}

              {/* --- NEW: LAYOUT & MATERIALS CARD --- */}
              <div className={`p-4 rounded-xl border space-y-4 ${theme === 'dark' ? 'bg-[#0a0a0a] border-[#222]' : 'bg-gray-50 border-[#ddd]'}`}>
                <span className="text-[10px] font-black uppercase tracking-widest text-accent opacity-80">Layout & Materials</span>
                
                <div id="input-st-width">
                  <InputRow label="Total Staircase Width (Defaults to 4')" v1={seatWidthV1} v2={seatWidthV2} v3={seatWidthV3} v4={seatWidthV4} setV1={setSeatWidthV1} setV2={setSeatWidthV2} setV3={setSeatWidthV3} setV4={setSeatWidthV4} mode={unitMode} theme={theme} onFocus={() => setActiveInput({ setV: setSeatWidthV1, setNum: setSeatWidthV3, setDen: setSeatWidthV4 })} {...getUnitProps('seat')} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className={`flex flex-col ${stairMode === 'structural' ? '' : 'col-span-2'}`}>
                    <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Tread Material</span>
                    <select value={woodSpecies} onChange={(e) => setWoodSpecies(e.target.value as any)} 
                      className={`w-full border rounded-xl p-3 text-center font-bold text-sm outline-none appearance-none shadow-sm transition-colors ${theme === 'dark' ? 'bg-[#111] border-[#222] text-white focus:border-accent' : 'bg-white border-[#ccc] text-black focus:border-accent'}`}
                    >
                      <option value="2x12">2x12 Dim (1.5")</option>
                      <option value="composite">5/4 Comp (1.0")</option>
                      <option value="wood54">5/4 Wood (1.0")</option>
                      <option value="oak">Solid Oak (1-1/16")</option>
                      <option value="custom">Custom...</option>
                    </select>
                  </div>
                  
                  {stairMode === 'structural' && (
                    <div className="flex flex-col">
                      <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Nosing Overhang</span>
                      <select value={deflectionLimit} onChange={(e) => setDeflectionLimit(e.target.value)} 
                        className={`w-full border rounded-xl p-3 text-center font-bold text-sm outline-none appearance-none shadow-sm transition-colors ${theme === 'dark' ? 'bg-[#111] border-[#222] text-white focus:border-accent' : 'bg-gray-50 border-[#ccc] text-black focus:border-accent'}`}
                      >
                        <option value="0">Flush (No Nose)</option>
                        <option value="0.75">3/4" (Code Std)</option>
                        <option value="1">1" Nosing</option>
                        <option value="1.25">1-1/4" (Code Max)</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* Pops up only if Custom is selected */}
                {woodSpecies === 'custom' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} id="input-st-tread" className="pt-2">
                    <InputRow label="Custom Tread Thickness" v1={qty} v2={qty2} v3={qty3} v4={qty4} setV1={setQty} setV2={setQty2} setV3={setQty3} setV4={setQty4} mode={unitMode} theme={theme} hideFeet onFocus={() => setActiveInput({ setV: setQty, setNum: setQty3, setDen: setQty4 })} {...getUnitProps('qty')} />
                  </motion.div>
                )}
              </div>

              {/* --- NEW: ADVANCED FINISH LOGIC CARD --- */}
              <div className={`p-4 rounded-xl border space-y-4 ${theme === 'dark' ? 'bg-white/5 border-[#333]/30' : 'bg-black/5 border-[#ccc]/50'}`}>
                
                <div className="flex flex-col">
                  <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Top Step Style</span>
                  <div className={`flex gap-1 p-1 rounded-xl border ${theme === 'dark' ? 'bg-[#333]/20 border-[#444]/30' : 'bg-gray-200/50 border-[#ddd]'}`}>
                    <button onClick={() => setStairType('flush')} 
                      className={`flex-1 py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${stairType === 'flush' ? 'bg-accent text-black shadow-md' : 'text-[#888] hover:text-current'}`}
                    >
                      Flush (Level)
                    </button>
                    <button onClick={() => setStairType('drop')} 
                      className={`flex-1 py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${stairType === 'drop' ? 'bg-accent text-black shadow-md' : 'text-[#888] hover:text-current'}`}
                    >
                      Dropped Step
                    </button>
                  </div>
                </div>

                <div className={`flex items-center justify-between p-3 border rounded-xl shadow-sm ${theme === 'dark' ? 'bg-[#111] border-[#222]' : 'bg-gray-50 border-[#ccc]'}`}>
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Add Finish Flooring Adjustments?</span>
                  <button onClick={() => setHasPointLoad(!hasPointLoad)}
                    className={`w-12 h-6 rounded-full relative transition-colors ${hasPointLoad ? 'bg-accent' : (theme === 'dark' ? 'bg-[#333]' : 'bg-gray-300')}`}
                  >
                    <motion.div animate={{ x: hasPointLoad ? 24 : 2 }} className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-sm"/>
                  </button>
                </div>

                {/* Pops up only if Toggle is ON */}
                {hasPointLoad && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-3 pt-2">
                    <div id="input-st-topfloor">
                      <InputRow label="Top Floor Thick" v1={c1} v2={c2} v3={c3} v4={c4} setV1={setC1} setV2={setC2} setV3={setC3} setV4={setC4} mode={unitMode} theme={theme} hideFeet onFocus={() => setActiveInput({ setV: setC1, setNum: setC3, setDen: setC4 })} {...getUnitProps('c')} />
                    </div>
                    <div id="input-st-botfloor">
                      <InputRow label="Bot Floor Thick" v1={d1} v2={d2} v3={d3} v4={d4} setV1={setD1} setV2={setD2} setV3={setD3} setV4={setD4} mode={unitMode} theme={theme} hideFeet onFocus={() => setActiveInput({ setV: setD1, setNum: setD3, setDen: setD4 })} {...getUnitProps('d')} />
                    </div>
                    <span className="block text-[8.5px] text-[#888] italic px-1 text-center font-medium leading-relaxed pt-1">
                      Adds finish material thickness (e.g. hardwood or tile) to structural calculations.
                    </span>
                  </motion.div>
                )}
              </div>

              {/* Local Tape Precision Pill */}
              {unitMode === 'imp' && (
                <div className="flex flex-col pt-2 pb-2">
                  <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Tape Precision</span>
                  <div className={`flex gap-1 p-1 rounded-xl border ${theme === 'dark' ? 'bg-[#333]/20 border-[#444]/30' : 'bg-gray-200/50 border-[#ddd]'}`}>
                    {([8, 16, 32] as const).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPrecision(p)}
                        className={`flex-1 py-2.5 rounded-lg font-black text-[11px] transition-all ${
                          precision === p 
                            ? 'bg-accent text-black shadow-md' 
                            : 'text-[#888] hover:text-current'
                        }`}
                      >
                        1/{p}"
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Standardized Clear Button */}
              <button onClick={() => resetTool('st')}
                className={`w-full mt-4 p-3 rounded-xl font-black tracking-widest text-[10px] uppercase active:scale-95 transition-all ${theme === 'dark' ? 'bg-[#111] border border-red-500/30 text-red-500 hover:bg-red-500/10' : 'bg-red-50 text-red-500 border border-red-200 hover:bg-red-100'}`}
              >
                Clear Stair Tool
              </button>

              {/* HERO CARD RESULT */}
              {results.sub && results.sub.length > 0 && (
                <div className={`mt-6 pt-5 border-t w-full ${theme === 'dark' ? 'border-[#222]/40' : 'border-[#ddd]'}`}>
                  <div className={`mb-5 text-center border rounded-xl p-6 shadow-lg ${theme === 'dark' ? 'bg-[#111] border-[#222]' : 'bg-gray-50 border-[#ccc]'}`}>
                    <span className="block text-[10px] font-black uppercase tracking-widest text-accent opacity-80 mb-2">Stringer Length (Diag)</span>
                    <span className={`text-4xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                      {results.sub.find((i:any) => i.label.toLowerCase().includes('stringer length'))?.value || "0' 0\""}
                    </span>
                  </div>

                  {/* UPGRADED SEGMENTED & HIGHLIGHT-SUPPORTED LIST */}
                  <div className="space-y-1.5">
                    {results.sub.filter((i:any) => !i.label.toLowerCase().includes('stringer length (diag)')).map((item: any, idx: number) => {
                      const isHeader = item.label.includes('---');
                      const isWarning = item.warning;

                      if (isWarning) {
                        return (
                          <div key={idx} className="flex justify-between items-center p-3 my-2 rounded-xl bg-red-500/10 border border-red-500/30 text-xs">
                            <span className="text-red-500 font-bold uppercase tracking-wide">{item.label}</span>
                            <span className="text-red-500 font-mono font-black text-right">{item.value}</span>
                          </div>
                        );
                      }

                      return (
                        <div 
                          key={idx} 
                          className={`flex justify-between items-center py-2.5 px-3 rounded-lg transition-colors ${
                            isHeader 
                              ? 'mt-4 mb-1 border-none bg-accent/10 dark:bg-accent/5' 
                              : theme === 'dark' ? 'border-b border-[#222]/40 hover:bg-white/[0.02]' : 'border-b border-[#ddd]/60 hover:bg-black/[0.02]'
                          }`}
                        >
                          <span className={`${
                            isHeader 
                              ? 'text-accent font-black uppercase tracking-widest text-[10px]' 
                              : `text-xs opacity-80 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`
                          }`}>
                            {item.label.replace(/-/g, '').trim()}
                          </span>
                          
                          {!isHeader && (
                            <span className={`font-bold font-mono text-right ${
                              item.highlight 
                                ? 'text-accent text-sm tracking-wide font-black' 
                                : theme === 'dark' ? 'text-white text-xs' : 'text-black text-xs'
                            }`}>
                              {item.value}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 2D STRINGER GRAPHIC CANVAS */}
              {(() => {
                const riserHeightStr = results.sub && results.sub.find((i:any) => i.label === 'Riser Cut')?.value || '7 1/4"';
                const treadRunStr = results.sub && results.sub.find((i:any) => i.label === 'Stringer Cut Run for Tread')?.value || '10 1/2"';
                const bottomRiserStr = results.sub && results.sub.find((i:any) => i.label === 'Bottom Riser Cut')?.value || riserHeightStr;
                
                const stepsItem = results.sub && results.sub.find((item: any) => item.label === 'Number of Risers');
                const stepCount = stepsItem ? parseInt(stepsItem.value) : 4;
                
                const isFlush = stairType === 'flush';

                const drawSteps = Math.min(stepCount, 12);
                const canvasW = 150;
                const canvasH = 75;
                const treadW = canvasW / drawSteps; 
                const riserH = canvasH / drawSteps; 

                const points: string[] = [];
                let currentX = 40;
                let currentY = 50;

                points.push(`M ${currentX},${currentY}`);

                if (isFlush) {
                  currentX += treadW;
                  points.push(`L ${currentX},${currentY}`);
                } else {
                  currentY += riserH;
                  points.push(`L ${currentX},${currentY}`);
                  currentX += treadW;
                  points.push(`L ${currentX},${currentY}`);
                }

                for (let i = 1; i < drawSteps; i++) {
                  currentY += riserH;
                  points.push(`L ${currentX},${currentY}`);
                  currentX += treadW;
                  points.push(`L ${currentX},${currentY}`);
                }

                currentY += riserH;
                points.push(`L ${currentX},${currentY}`);

                const endX = currentX;
                const endY = currentY;

                const backOffset = riserH * 1.5; 
                const backStartX = 40;
                const backStartY = isFlush ? 50 + backOffset : 50 + riserH + backOffset;
                const backEndX = endX;
                const backEndY = endY;

                return results.sub && results.sub.length > 0 && (
                  <div className={`mt-6 pt-5 border-t flex flex-col items-center w-full ${theme === 'dark' ? 'border-[#222]/40' : 'border-[#ddd]'}`}>
                    <span className="text-[9px] font-black uppercase text-accent mb-3 tracking-widest">Field Cut Stringer Profile</span>
                    <svg viewBox="0 0 240 180" className={`w-full h-auto overflow-visible rounded-xl p-3 border shadow-inner ${theme === 'dark' ? 'bg-[#0a0a0a] border-[#222]' : 'bg-gray-50 border-[#ddd]'}`}>
                      <defs>
                        <filter id="neonGlowStringer" x="-50%" y="-50%" width="200%" height="200%">
                          <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur1" />
                          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur2" />
                          <feMerge>
                            <feMergeNode in="blur2" />
                            <feMergeNode in="blur1" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                        <pattern id="scanlinesStringer" patternUnits="userSpaceOnUse" width="4" height="4">
                          <line x1="0" y1="0" x2="4" y2="0" stroke={theme === 'dark' ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"} strokeWidth="1" />
                        </pattern>
                      </defs>

                      <rect x="0" y="0" width="100%" height="100%" fill="url(#scanlinesStringer)" rx="8" />

                      <path d={`M ${backStartX},${isFlush ? 50 : 50 + riserH} L ${backStartX},${backStartY} L ${backEndX - treadW},${backEndY} L ${backEndX},${backEndY} L ${backEndX},${endY} Z`} fill={theme === 'dark' ? "rgba(0, 210, 255, 0.05)" : "rgba(0, 210, 255, 0.05)"} />
                      
                      <g filter="url(#neonGlowStringer)">
                        <motion.path d={points.join(' ')} fill="none" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter" 
                          initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 1.5, ease: "easeOut" }} />
                        
                        <motion.line x1={backStartX} y1={backStartY} x2={backEndX - treadW} y2={backEndY} stroke="var(--color-accent)" strokeWidth="2.5" 
                          initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.5, delay: 1.5 }} />
                        <motion.line x1={backEndX - treadW} y1={backEndY} x2={backEndX} y2={backEndY} stroke="var(--color-accent)" strokeWidth="2.5" 
                          initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.5, delay: 1.6 }} />
                        <motion.line x1={backStartX} y1={isFlush ? 50 : 50 + riserH} x2={backStartX} y2={backStartY} stroke="var(--color-accent)" strokeWidth="2.5" 
                          initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.5, delay: 1.6 }} />
                        <motion.line x1={backEndX} y1={endY} x2={backEndX} y2={backEndY} stroke="var(--color-accent)" strokeWidth="2.5" 
                          initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.5, delay: 1.5 }} />
                      </g>
                      
                      {/* Std Riser Metric */}
                      <g className="cursor-pointer hover:opacity-80 transition-opacity" onClick={() => document.getElementById('input-st-rise')?.focus()}>
                        <rect x="23" y="10" width="85" height="12" rx="3" fill={theme === 'dark' ? '#111' : '#f9fafb'} stroke="var(--color-accent)" strokeWidth="0.5" />
                        <text x="25" y="18" fill="var(--color-accent)" fontSize="7" fontWeight="black">Std Riser: {riserHeightStr.split(' (')[0]}</text>
                      </g>
                      
                      {/* Bot Riser Metric - Stacked directly below Std Riser */}
                      <g className="cursor-pointer hover:opacity-80 transition-opacity" onClick={() => document.getElementById('input-st-botfloor')?.focus()}>
                        <rect x="23" y="24" width="85" height="12" rx="3" fill={theme === 'dark' ? '#111' : '#f9fafb'} stroke="#ff00d2" strokeWidth="0.5" />
                        <text x="25" y="32" fill="#ff00d2" fontSize="7" fontWeight="black">Bot Riser: {bottomRiserStr.split(' (')[0]}</text>
                      </g>
                      
                      {/* Tread Metric */}
                      <g className="cursor-pointer hover:opacity-80 transition-opacity" onClick={() => document.getElementById('input-st-tread')?.focus()}>
                        <rect x="128" y="10" width="70" height="12" rx="3" fill={theme === 'dark' ? '#111' : '#f9fafb'} stroke={theme === 'dark' ? '#444' : '#ccc'} strokeWidth="0.5" />
                        <text x="130" y="18" fill={theme === 'dark' ? '#fff' : '#000'} fontSize="7" fontWeight="black">Tread: {treadRunStr.split(' (')[0]}</text>
                      </g>
                      
                      {/* Step Count Metric */}
                      <rect x="198" y="10" width="40" height="12" rx="3" fill={theme === 'dark' ? '#111' : '#f9fafb'} />
                      <text x="200" y="18" fill={theme === 'dark' ? '#888' : '#666'} fontSize="7" fontWeight="black">Count: {stepCount}</text>
                    </svg>
                  </div>
                );
              })()}
            </div>
          )}

          {activeTool === 'rk' && (
            <div className="space-y-4">
              
							{/* --- UPGRADED LIVE DYNAMIC DIAGRAM --- */}
              <div className={`mb-6 flex justify-center items-center p-6 rounded-xl border shadow-inner ${theme === 'dark' ? 'bg-[#0a0a0a] border-[#222]' : 'bg-gray-50 border-[#ddd]'}`}>
                {(() => {
                  // 1. Math Engine: Safely compile feet, inches, and fractions for labels
                  const subDivisor = unitMode === 'imp' ? 12 : 100;

                  // RUN (A)
                  const ftA = parseFloat(a1) || 0;
                  const inA = parseFloat(a2) || 0;
                  const fracA = parseFloat(a4) ? (parseFloat(a3) || 0) / parseFloat(a4) : 0;
                  const valA = ftA + (inA + fracA) / subDivisor;
                  const displayRun = valA > 0 
                    ? (unitMode === 'imp' ? `Run: ${a1 || 0}' ${a2 || 0}${a3 && a4 ? ` ${a3}/${a4}` : ''}"` : `Run: ${valA.toFixed(2)} m`)
                    : 'Wall Run';

                  // START HEIGHT (B)
                  const ftB = parseFloat(b1) || 0;
                  const inB = parseFloat(b2) || 0;
                  const fracB = parseFloat(b4) ? (parseFloat(b3) || 0) / parseFloat(b4) : 0;
                  const valB = ftB + (inB + fracB) / subDivisor;
                  const displayStart = valB > 0 
                    ? (unitMode === 'imp' ? `Start: ${b1 || 0}' ${b2 || 0}${b3 && b4 ? ` ${b3}/${b4}` : ''}"` : `Start: ${valB.toFixed(2)} m`)
                    : 'Start Height';

                  // END HEIGHT / PITCH (C)
                  let displayEndOrPitch = 'End/Pitch';
                  if (subMode === 'pitch') {
                    displayEndOrPitch = c1 ? `Pitch: ${c1}/12` : 'Pitch';
                  } else {
                    const ftC = parseFloat(c1) || 0;
                    const inC = parseFloat(c2) || 0;
                    const fracC = parseFloat(c4) ? (parseFloat(c3) || 0) / parseFloat(c4) : 0;
                    const valC = ftC + (inC + fracC) / subDivisor;
                    displayEndOrPitch = valC > 0 
                      ? (unitMode === 'imp' ? `End: ${c1 || 0}' ${c2 || 0}${c3 && c4 ? ` ${c3}/${c4}` : ''}"` : `End: ${valC.toFixed(2)} m`)
                      : 'End Height';
                  }

                  return (
                    <svg viewBox="0 0 160 150" className="w-full max-w-[220px] h-auto overflow-visible">
                      <defs>
                        <filter id="neonGlowRK" x="-50%" y="-50%" width="200%" height="200%">
                          <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur1" />
                          <feMerge><feMergeNode in="blur1" /><feMergeNode in="SourceGraphic" /></feMerge>
                        </filter>
                        <pattern id="scanlinesRK" patternUnits="userSpaceOnUse" width="4" height="4">
                          <line x1="0" y1="0" x2="4" y2="0" stroke={theme === 'dark' ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"} strokeWidth="1" />
                        </pattern>
                      </defs>

                      <rect x="0" y="0" width="100%" height="100%" fill="url(#scanlinesRK)" rx="8" />

                      {/* --- ARCHITECTURAL RISE/RUN LINES --- */}
                      {/* Visualizes the right triangle that creates the pitch */}
                      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1 }}>
                        <line x1="26" y1="90" x2="134" y2="90" stroke={theme === 'dark' ? '#444' : '#aaa'} strokeWidth="1" strokeDasharray="2,2" />
                        <line x1="134" y1="90" x2="134" y2="30" stroke={theme === 'dark' ? '#444' : '#aaa'} strokeWidth="1" strokeDasharray="2,2" />
                      </motion.g>

                      {/* --- 3D STRUCTURAL BASE (Animates in first) --- */}
                      <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        {/* 1x Bottom Plate */}
                        <rect x="14" y="110" width="132" height="6" fill={theme === 'dark' ? '#555' : '#ccc'} stroke={theme === 'dark' ? '#333' : '#aaa'} strokeWidth="0.5" />
                        <polygon points="14,110 18,106 150,106 146,110" fill={theme === 'dark' ? '#666' : '#ddd'} stroke={theme === 'dark' ? '#333' : '#aaa'} strokeWidth="0.5" />
                        <polygon points="146,110 150,106 150,112 146,116" fill={theme === 'dark' ? '#444' : '#bbb'} stroke={theme === 'dark' ? '#333' : '#aaa'} strokeWidth="0.5" />

                        {/* Left Stud (Shortest Point) */}
                        <rect x="20" y="90" width="6" height="20" fill={theme === 'dark' ? '#555' : '#ccc'} stroke={theme === 'dark' ? '#333' : '#aaa'} strokeWidth="0.5" />
                        <polygon points="26,90 30,86 30,106 26,110" fill={theme === 'dark' ? '#444' : '#bbb'} stroke={theme === 'dark' ? '#333' : '#aaa'} strokeWidth="0.5" />

                        {/* Center Stud 1 */}
                        <rect x="58" y="70" width="6" height="40" fill={theme === 'dark' ? '#555' : '#ccc'} stroke={theme === 'dark' ? '#333' : '#aaa'} strokeWidth="0.5" />
                        <polygon points="64,70 68,66 68,106 64,110" fill={theme === 'dark' ? '#444' : '#bbb'} stroke={theme === 'dark' ? '#333' : '#aaa'} strokeWidth="0.5" />

                        {/* Center Stud 2 */}
                        <rect x="96" y="50" width="6" height="60" fill={theme === 'dark' ? '#555' : '#ccc'} stroke={theme === 'dark' ? '#333' : '#aaa'} strokeWidth="0.5" />
                        <polygon points="102,50 106,46 106,106 102,110" fill={theme === 'dark' ? '#444' : '#bbb'} stroke={theme === 'dark' ? '#333' : '#aaa'} strokeWidth="0.5" />

                        {/* Right Stud (Tallest Point) */}
                        <rect x="134" y="30" width="6" height="80" fill={theme === 'dark' ? '#555' : '#ccc'} stroke={theme === 'dark' ? '#333' : '#aaa'} strokeWidth="0.5" />
                        <polygon points="140,30 144,26 144,106 140,110" fill={theme === 'dark' ? '#444' : '#bbb'} stroke={theme === 'dark' ? '#333' : '#aaa'} strokeWidth="0.5" />
                      </motion.g>

                      {/* --- 3D DOUBLE TOP PLATES (Glowing, Animates in second) --- */}
                      <motion.g initial={{ opacity: 0, x: -5, y: -5 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
                        {/* Plate 1 (Lower Slanted Plate) */}
                        <polygon points="18,90 142,25 140,21 16,86" fill="var(--color-accent)" opacity="0.7" filter="url(#neonGlowRK)" stroke="var(--color-accent)" strokeWidth="0.5" />
                        <polygon points="142,25 146,21 144,17 140,21" fill="var(--color-accent)" opacity="0.4" />

                        {/* Plate 2 (Upper Slanted Plate) */}
                        <polygon points="16,86 140,21 138,17 14,82" fill="var(--color-accent)" opacity="0.9" filter="url(#neonGlowRK)" stroke="var(--color-accent)" strokeWidth="0.5" />
                        
                        {/* Plate 2 Top Face (Depth) */}
                        <polygon points="14,82 18,78 142,13 138,17" fill="var(--color-accent)" opacity="1" stroke="var(--color-accent)" strokeWidth="0.5" />
                        
                        {/* Plate 2 Right Side (Depth) */}
                        <polygon points="140,21 144,17 142,13 138,17" fill="var(--color-accent)" opacity="0.6" />
                      </motion.g>

                      {/* --- INTERACTIVE LABELS --- */}
                      <text x="12" y="122" fill={theme === 'dark' ? '#fff' : '#000'} fontSize="7" fontWeight="bold" textAnchor="end" className="cursor-pointer hover:fill-accent transition-colors" onClick={() => document.getElementById('input-rk-start')?.focus()}>
                        {displayStart}
                      </text>
                      
                      <text x="146" y="25" fill={theme === 'dark' ? '#fff' : '#000'} fontSize="7" fontWeight="bold" textAnchor="start" className="cursor-pointer hover:fill-accent transition-colors" onClick={() => subMode === 'pitch' ? document.getElementById('input-rk-pitch')?.focus() : document.getElementById('input-rk-end')?.focus()}>
                        {displayEndOrPitch}
                      </text>
                      
                      <text x="80" y="140" fill="var(--color-accent)" fontSize="8" fontWeight="black" textAnchor="middle" className="cursor-pointer hover:fill-[#ff00d2] transition-colors" onClick={() => document.getElementById('input-rk-run')?.focus()}>
                        {displayRun}
                      </text>
                    </svg>
                  );
                })()}
              </div>
							{/* --- END OF UPGRADED LIVE DYNAMIC DIAGRAM --- */}
							
              <div id="input-rk-run">
                <InputRow label="Wall Run" v1={a1} v2={a2} v3={a3} v4={a4} setV1={setA1} setV2={setA2} setV3={setA3} setV4={setA4} mode={unitMode} theme={theme} onFocus={setActiveInput} {...getUnitProps('a')} />
              </div>
              <div id="input-rk-start">
                <InputRow label="Start of Wall Measurement (Shortest Point)" v1={b1} v2={b2} v3={b3} v4={b4} setV1={setB1} setV2={setB2} setV3={setB3} setV4={setB4} mode={unitMode} theme={theme} onFocus={setActiveInput} {...getUnitProps('b')} />
              </div>
              
              {/* Upgraded 2-Column Toggles for Calculation Mode & Layout Direction */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="flex flex-col">
                  <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Calculation Mode</span>
                  <div className={`flex gap-1 p-1 rounded-xl border h-[3.25rem] ${theme === 'dark' ? 'bg-[#333]/20 border-[#444]/30' : 'bg-gray-200/50 border-[#ddd]'}`}>
                    <button onClick={() => setSubMode('pitch')}
                      className={`flex-1 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all ${subMode === 'pitch' ? 'bg-accent text-black shadow-md' : 'text-[#888] hover:text-current'}`}
                    >
                      By Pitch
                    </button>
                    <button onClick={() => setSubMode('height')}
                      className={`flex-1 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all ${subMode === 'height' ? 'bg-accent text-black shadow-md' : 'text-[#888] hover:text-current'}`}
                    >
                      By Height
                    </button>
                  </div>
                </div>

                <div className="flex flex-col">
                  <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Pull Layout From</span>
                  <div className={`flex gap-1 p-1 rounded-xl border h-[3.25rem] ${theme === 'dark' ? 'bg-[#333]/20 border-[#444]/30' : 'bg-gray-200/50 border-[#ddd]'}`}>
                    <button onClick={() => setC3('short')}
                      className={`flex-1 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all ${(c3 || 'short') === 'short' ? 'bg-accent text-black shadow-md' : 'text-[#888] hover:text-current'}`}
                    >
                      Short Side
                    </button>
                    <button onClick={() => setC3('tall')}
                      className={`flex-1 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all ${c3 === 'tall' ? 'bg-accent text-black shadow-md' : 'text-[#888] hover:text-current'}`}
                    >
                      Tall Side
                    </button>
                  </div>
                </div>
              </div>

              {/* Upgraded Chunky Input */}
              {subMode === 'pitch' ? (
                <div className="flex flex-col" id="input-rk-pitch">
                  <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Pitch (X / 12)</span>
                  <input type="number" value={c1} onChange={(e) => setC1(e.target.value)} 
                    className={`w-full border rounded-xl p-4 text-center font-black text-lg outline-none transition-colors shadow-sm ${theme === 'dark' ? 'bg-[#111] border-[#222] text-white focus:border-accent' : 'bg-gray-50 border-[#ccc] text-black focus:border-accent'}`} 
                  />
                </div>
              ) : (
                <div id="input-rk-end">
                  <InputRow label="End Height (Tallest Point)" v1={c1} v2={c2} v3={c3} v4={c4} setV1={setC1} setV2={setC2} setV3={setC3} setV4={setC4} mode={unitMode} theme={theme} onFocus={setActiveInput} {...getUnitProps('c')} />
                </div>
              )}

              {/* --- PLATE COUNT CARD --- */}
              <div className={`p-4 rounded-xl border space-y-4 mt-2 ${theme === 'dark' ? 'bg-white/5 border-[#333]/30' : 'bg-black/5 border-[#ccc]/50'}`}>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-accent opacity-80">Plate Count</h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col">
                    <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Top Plates</span>
                    <select 
                      value={qty2} 
                      onChange={(e) => setQty2(e.target.value)}
                      className={`w-full border rounded-xl p-3 text-center font-bold text-sm outline-none appearance-none shadow-sm transition-colors ${theme === 'dark' ? 'bg-[#111] border-[#222] text-white focus:border-accent' : 'bg-gray-50 border-[#ccc] text-black focus:border-accent'}`}
                    >
                      <option value="">0</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                    </select>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Bottom Plates</span>
                    <select 
                      value={qty3} 
                      onChange={(e) => setQty3(e.target.value)}
                      className={`w-full border rounded-xl p-3 text-center font-bold text-sm outline-none appearance-none shadow-sm transition-colors ${theme === 'dark' ? 'bg-[#111] border-[#222] text-white focus:border-accent' : 'bg-gray-50 border-[#ccc] text-black focus:border-accent'}`}
                    >
                      <option value="">0</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                    </select>
                  </div>
                </div>

                {/* Dynamic Stud Spacing Indicator */}
                <div className="flex flex-col mt-3">
                  <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Stud Spacing (OC)</span>
                  <select value={qty} onChange={(e) => setQty(e.target.value)} 
                    className={`w-full border rounded-xl p-3 text-center font-bold text-sm outline-none appearance-none shadow-sm transition-colors ${theme === 'dark' ? 'bg-[#111] border-[#222] text-white focus:border-accent' : 'bg-gray-50 border-[#ccc] text-black focus:border-accent'}`}
                  >
                    {unitMode === 'imp' ? (
                      <>
                        <option value="12">12” On-Center</option>
                        <option value="16">16” On-Center</option>
                        <option value="24">24” On-Center</option>
                      </>
                    ) : (
                      <>
                        <option value="300">300mm On-Center</option>
                        <option value="400">400mm On-Center</option>
                        <option value="600">600mm On-Center</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              {/* Local Tape Precision Pill */}
              {unitMode === 'imp' && (
                <div className="flex flex-col pt-2 pb-2">
                  <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Tape Precision</span>
                  <div className={`flex gap-1 p-1 rounded-xl border ${theme === 'dark' ? 'bg-[#333]/20 border-[#444]/30' : 'bg-gray-200/50 border-[#ddd]'}`}>
                    {([8, 16, 32] as const).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPrecision(p)}
                        className={`flex-1 py-2.5 rounded-lg font-black text-[11px] transition-all ${
                          precision === p 
                            ? 'bg-accent text-black shadow-md' 
                            : 'text-[#888] hover:text-current'
                        }`}
                      >
                        1/{p}"
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Standardized Clear Button */}
              <button onClick={() => resetTool('rk')}
                className={`w-full mt-4 p-3 rounded-xl font-black tracking-widest text-[10px] uppercase active:scale-95 transition-all ${theme === 'dark' ? 'bg-[#111] border border-red-500/30 text-red-500 hover:bg-red-500/10' : 'bg-red-50 text-red-500 border border-red-200 hover:bg-red-100'}`}
              >
                Clear Rake Tool
              </button>

              {/* --- NEW PRO UPGRADE: STUD CUT REFERENCE POINT TOGGLE --- */}
              <div className="flex flex-col pt-4">
                <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Stud Cut Reference Point</span>
                <div className={`flex gap-1 p-1 rounded-xl border ${theme === 'dark' ? 'bg-[#333]/20 border-[#444]/30' : 'bg-gray-200/50 border-[#ddd]'}`}>
                  <button onClick={() => setQty4('long')}
                    className={`flex-1 py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${(qty4 || 'long') === 'long' ? 'bg-accent text-black shadow-md' : 'text-[#888] hover:text-current'}`}
                  >
                    Long Point (Default)
                  </button>
                  <button onClick={() => setQty4('short')}
                    className={`flex-1 py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${qty4 === 'short' ? 'bg-accent text-black shadow-md' : 'text-[#888] hover:text-current'}`}
                  >
                    Short Point
                  </button>
                </div>
              </div>

              {/* UPGRADED SEGMENTED TEXT OUTPUT LIST */}
              <div className={`mt-4 pt-5 border-t w-full ${theme === 'dark' ? 'border-[#222]/40' : 'border-[#ddd]'}`}>
                <div className="space-y-1.5">
                  {results.sub && results.sub.map((item: any, idx: number) => {
                    const isHeader = item.label.includes('---');
                    return (
                      <div 
                        key={idx} 
                        className={`flex justify-between items-center py-2.5 px-3 rounded-lg transition-colors ${
                          isHeader 
                            ? 'mt-4 mb-1 border-none bg-accent/10 dark:bg-accent/5' 
                            : theme === 'dark' ? 'border-b border-[#222]/40 hover:bg-white/[0.02]' : 'border-b border-[#ddd]/60 hover:bg-black/[0.02]'
                        }`}
                      >
                        <span className={`${
                          isHeader 
                            ? 'text-accent font-black uppercase tracking-widest text-[10px]' 
                            : `text-xs opacity-80 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`
                        }`}>
                          {item.label.replace(/-/g, '').trim()}
                        </span>
                        
                        {!isHeader && (
                          <span className={`font-bold font-mono text-right ${
                            item.highlight 
                              ? 'text-accent text-sm tracking-wide font-black' 
                              : theme === 'dark' ? 'text-white text-xs' : 'text-black text-xs'
                          }`}>
                            {item.value}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTool === 'sq' && (
            <div className="space-y-3">						
              <div id="input-sq-a">
                <InputRow label="Side A / Run" v1={a1} v2={a2} v3={a3} v4={a4} setV1={setA1} setV2={setA2} setV3={setA3} setV4={setA4} mode={unitMode} theme={theme} onFocus={setActiveInput} {...getUnitProps('a')}/>
              </div>
              <div id="input-sq-b">
                <InputRow label="Side B / Rise" v1={b1} v2={b2} v3={b3} v4={b4} setV1={setB1} setV2={setB2} setV3={setB3} setV4={setB4} mode={unitMode} theme={theme} onFocus={setActiveInput} {...getUnitProps('b')}/>
              </div>
							
              {/* --- PRO UPGRADE: Dual-Format Memory Bank --- */}
              <div className="pt-2 pb-2">
                <button 
                  onClick={() => {
                    const wFt = parseF(a1, a2, a3, a4, unitMode);
                    const lFt = parseF(b1, b2, b3, b4, unitMode);
                    
                    if (wFt > 0 && lFt > 0) {
                      const formatDual = (valFt: number) => {
                          if (unitMode === 'met') return `${valFt.toFixed(3)} m`;
                          
                          const totalInches = valFt * 12;
                          const rawInches = formatF32(totalInches, precision).replace(/"/g, '');
                          const ft = Math.floor(totalInches / 12);
                          const remInches = formatF32(totalInches - (ft * 12), precision).replace(/"/g, '');
                          
                          // Hide the fractional parenthesis if it's 0 feet, or format cleanly
                          if (ft === 0) return `${rawInches}"`;
                          const paren = remInches === '0' ? `(${ft}')` : `(${ft}' ${remInches}")`;
                          
                          return `${rawInches}" ${paren}`;
                      };

                      const currentW = formatDual(wFt);
                      const currentL = formatDual(lFt);
                      const currentDiag = formatDual(Math.sqrt(wFt * wFt + lFt * lFt));

                      setSavedLayouts([...savedLayouts, { 
                        id: savedLayouts.length + 1, 
                        run: currentW, 
                        rise: currentL, 
                        diag: currentDiag 
                      }]);
                    }
                  }}
                  className={`w-full p-4 rounded-xl font-black text-sm uppercase tracking-widest active:scale-95 transition-all flex items-center justify-center gap-2 shadow-md ${theme === 'dark' ? 'bg-accent/10 border border-accent/50 text-accent hover:bg-accent/20' : 'bg-[#e0f7ff] border border-accent/40 text-[#0088cc] hover:bg-[#cceeff]'}`}
                >
                  <Save size={18} strokeWidth={2.5}/>
                  Save Corner to List
                </button>
              </div>

              {/* Render Saved Layouts List */}
              {savedLayouts.length > 0 && (
                <div className={`mt-4 p-4 rounded-xl border shadow-inner ${theme === 'dark' ? 'bg-[#0a0a0a] border-[#222]' : 'bg-gray-50 border-[#ddd]'}`}>
                  <div className="flex justify-between items-center mb-3 border-b border-[#333]/30 dark:border-[#ccc]/50 pb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-accent">Saved Layouts</span>
                    <button onClick={() => setSavedLayouts([])} className="text-[9px] font-bold uppercase text-red-500 hover:text-red-400">Clear List</button>
                  </div>
                  <div className="space-y-2">
                    {savedLayouts.map((item) => (
                      <div key={item.id} className={`flex justify-between items-center py-2 text-xs border-b last:border-0 ${theme === 'dark' ? 'border-[#222]/30 text-[#ccc]' : 'border-[#ddd]/50 text-[#555]'}`}>
                        <span className="font-bold">Corner {item.id}: {item.run} × {item.rise}</span>
                        <span className="font-black font-mono text-[#ff00d2]">Diag: {item.diag}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

							{/* Local Tape Precision Pill */}
              {unitMode === 'imp' && (
                <div className="flex flex-col pt-2 pb-2">
                  <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Tape Precision</span>
                  <div className={`flex gap-1 p-1 rounded-xl border ${theme === 'dark' ? 'bg-[#333]/20 border-[#444]/30' : 'bg-gray-200/50 border-[#ddd]'}`}>
                    {([8, 16, 32] as const).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPrecision(p)}
                        className={`flex-1 py-2.5 rounded-lg font-black text-[11px] transition-all ${
                          precision === p 
                            ? 'bg-accent text-black shadow-md' 
                            : 'text-[#888] hover:text-current'
                        }`}
                      >
                        1/{p}"
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Standardized Danger Button */}
              <button onClick={() => { resetTool('sq'); setSavedLayouts([]); }}
                className={`w-full mt-3 p-3 rounded-xl font-black tracking-widest text-[10px] uppercase active:scale-95 transition-all ${theme === 'dark' ? 'bg-[#111] border border-red-500/30 text-red-500 hover:bg-red-500/10' : 'bg-red-50 text-red-500 border border-red-200 hover:bg-red-100'}`}
              >
                Clear Square Tool
              </button>

              {/* UPGRADED TEXT OUTPUT LIST */}
              <div className={`mt-6 pt-5 border-t w-full ${theme === 'dark' ? 'border-[#222]/40' : 'border-[#ddd]'}`}>
                {(() => {
                  const areaMain = results.main || "0.00";
                  const labelDiag = results.sub && results.sub[1]?.value ? results.sub[1].value : "0";

                  return (
                    <div className="grid grid-cols-2 gap-3 mb-5">
                      <div className={`flex flex-col justify-center p-4 rounded-xl border shadow-sm ${theme === 'dark' ? 'bg-[#111] border-[#222]' : 'bg-gray-50 border-[#ccc]'}`}>
                        <span className="text-[9px] font-black uppercase tracking-widest text-[#ff00d2] opacity-90 mb-1">Diagonal (X)</span>
                        <span className={`text-lg font-black font-mono tracking-tight ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{labelDiag.split(' (')[0]}</span>
                      </div>
                      <div className={`flex flex-col justify-center p-4 rounded-xl border shadow-sm ${theme === 'dark' ? 'bg-[#111] border-[#222]' : 'bg-gray-50 border-[#ccc]'}`}>
                        <span className="text-[9px] font-black uppercase tracking-widest text-accent opacity-90 mb-1">Total Area</span>
                        <span className={`text-lg font-black font-mono tracking-tight ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{areaMain}</span>
                      </div>
                    </div>
                  );
                })()}

                {/* Segmented & Highlight-Supported List */}
                <div className="space-y-1.5">
                  {results.sub.map((item: any, idx: number) => {
                    const isHeader = item.label.includes('---');
                    return (
                      <div 
                        key={idx} 
                        className={`flex justify-between items-center py-2.5 px-3 rounded-lg transition-colors ${
                          isHeader 
                            ? 'mt-4 mb-1 border-none bg-accent/10 dark:bg-accent/5' 
                            : theme === 'dark' ? 'border-b border-[#222]/40 hover:bg-white/[0.02]' : 'border-b border-[#ddd]/60 hover:bg-black/[0.02]'
                        }`}
                      >
                        <span className={`${
                          isHeader 
                            ? 'text-accent font-black uppercase tracking-widest text-[10px]' 
                            : `text-xs opacity-80 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`
                        }`}>
                          {item.label.replace(/-/g, '').trim()}
                        </span>
                        
                        {!isHeader && (
                          <span className={`font-bold font-mono text-right ${
                            item.highlight 
                              ? 'text-accent text-sm tracking-wide font-black' 
                              : theme === 'dark' ? 'text-white text-xs' : 'text-black text-xs'
                          }`}>
                            {item.value}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* DYNAMIC SQUARING CANVAS */}
              {(() => {
                const sideA = parseF(a1, a2, a3, a4, unitMode, inputUnits['sq_a'] || 'mm') || 3;
                const sideB = parseF(b1, b2, b3, b4, unitMode, inputUnits['sq_b'] || 'mm') || 4;
                
                const maxSide = Math.max(sideA, sideB) || 1;
                const rectWidth = (sideA / maxSide) * 140;
                const rectHeight = (sideB / maxSide) * 90;

                const startX = 40 + (140 - rectWidth) / 2;
                const startY = 35 + (90 - rectHeight) / 2;
                const endX = startX + rectWidth;
                const endY = startY + rectHeight;
                
                const labelA = unitMode === 'met' ? `${sideA.toFixed(2)} m` : formatF(sideA, 'imp');
                const labelB = unitMode === 'met' ? `${sideB.toFixed(2)} m` : formatF(sideB, 'imp');
                const labelDiag = results.sub && results.sub[1]?.value ? results.sub[1].value : '';

                return (
                  <div className={`mt-6 pt-5 border-t flex flex-col items-center w-full ${theme === 'dark' ? 'border-[#222]/40' : 'border-[#ddd]'}`}>
                    <span className="text-[9px] font-black uppercase text-accent mb-3 tracking-widest">Cross-Measurement Layout</span>
                    <svg viewBox="0 0 240 160" className={`w-full h-auto overflow-visible rounded-xl p-3 border shadow-inner ${theme === 'dark' ? 'bg-[#0a0a0a] border-[#222]' : 'bg-gray-50 border-[#ddd]'}`}>
                      <defs>
                        <filter id="neonGlowSQBot" x="-50%" y="-50%" width="200%" height="200%">
                          <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur1" />
                          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur2" />
                          <feMerge>
                            <feMergeNode in="blur2" />
                            <feMergeNode in="blur1" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                        <pattern id="scanlinesSQBot" patternUnits="userSpaceOnUse" width="4" height="4">
                          <line x1="0" y1="0" x2="4" y2="0" stroke={theme === 'dark' ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"} strokeWidth="1" />
                        </pattern>
                      </defs>

                      <rect x="0" y="0" width="100%" height="100%" fill="url(#scanlinesSQBot)" rx="8" />
                      
                      <rect x={startX} y={startY} width={rectWidth} height={rectHeight} fill={theme === 'dark' ? "rgba(0, 210, 255, 0.05)" : "rgba(0, 210, 255, 0.05)"} stroke="var(--color-accent)" strokeWidth="2.5" strokeLinejoin="round" filter="url(#neonGlowSQBot)" />
                      
                      <line x1={startX} y1={endY} x2={endX} y2={startY} stroke="#ff00d2" strokeWidth="2" strokeDasharray="4,4" strokeLinecap="round" filter="url(#neonGlowSQBot)" />
                      <line x1={startX} y1={startY} x2={endX} y2={endY} stroke="#ff00d2" strokeWidth="2" strokeDasharray="4,4" strokeLinecap="round" opacity="0.3" filter="url(#neonGlowSQBot)" />
                      
                      <g className="cursor-pointer hover:opacity-80 transition-opacity" onClick={() => document.getElementById('input-sq-a')?.focus()}>
                        <rect x={startX + rectWidth / 2 - 25} y={startY - 14} width="50" height="10" rx="3" fill={theme === 'dark' ? '#111' : '#f9fafb'} stroke="var(--color-accent)" strokeWidth="0.5" />
                        <text x={startX + rectWidth / 2} y={startY - 6} fill="var(--color-accent)" fontSize="7.5" fontWeight="bold" textAnchor="middle">W: {labelA.split(' (')[0]}</text>
                      </g>
                      
                      <g className="cursor-pointer hover:opacity-80 transition-opacity" onClick={() => document.getElementById('input-sq-b')?.focus()}>
                        <rect x={endX + 4} y={startY + rectHeight / 2 - 6} width="45" height="10" rx="3" fill={theme === 'dark' ? '#111' : '#f9fafb'} stroke="var(--color-accent)" strokeWidth="0.5" />
                        <text x={endX + 8} y={startY + rectHeight / 2 + 1} fill="var(--color-accent)" fontSize="7.5" fontWeight="bold" textAnchor="start">L: {labelB.split(' (')[0]}</text>
                      </g>
                      
                      <g>
                        <rect x="135" y="140" width="100" height="14" rx="3" fill={theme === 'dark' ? '#111' : '#f9fafb'} stroke="#ff00d2" strokeWidth="0.5" />
                        <text x="230" y="150" fill="#ff00d2" fontSize="8" fontWeight="black" textAnchor="end">
                          Diag: {labelDiag.split(' (')[0]}
                        </text>
                      </g>
                    </svg>
                  </div>
                );
              })()}
            </div>
          )}

          {activeTool === 'co' && (
            <div className="space-y-3">
              <select value={subMode} onChange={(e) => setSubMode(e.target.value)} 
                className={`w-full border rounded-lg p-3 text-center font-bold outline-none appearance-none ${theme === 'dark' ? 'bg-black border-[#222] text-white' : 'bg-white border-[#ccc] text-black'}`}
              >
                <option value="slab">Slab / Pad</option>
                <option value="wall">Foundation Wall (Poured/ICF)</option>
                <option value="footing">Strip Footings</option>
                <option value="sono">Sonotube Pier</option>
              </select>
              {/* --- UPGRADED LIVE DYNAMIC DIAGRAM (Animated) --- */}
              <div className={`mb-6 flex justify-center items-center p-6 rounded-xl border shadow-inner overflow-hidden ${theme === 'dark' ? 'bg-[#0a0a0a] border-[#222]' : 'bg-gray-50 border-[#ddd]'}`}>
                {(() => {
                  const isSono = subMode === 'sono';
                  const isWall = subMode === 'wall';
                  const isSlab = subMode === 'slab';
                  const isFooting = subMode === 'footing';
                  return (
                    <>
                      <svg viewBox="0 0 160 160" className="w-full max-w-[220px] h-auto overflow-visible transition-all duration-500">
                        <defs>
                          <filter id="neonGlowCO" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur1" />
                            <feMerge><feMergeNode in="blur1" /><feMergeNode in="SourceGraphic" /></feMerge>
                          </filter>
                          <pattern id="scanlinesCO" patternUnits="userSpaceOnUse" width="4" height="4">
                            <line x1="0" y1="0" x2="4" y2="0" stroke={theme === 'dark' ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"} strokeWidth="1" />
                          </pattern>
                        </defs>

                        <rect x="-10" y="-10" width="180" height="180" fill="url(#scanlinesCO)" rx="8" />

                        {(() => {
                          const subDivisor = unitMode === 'imp' ? 12 : 100;
                          
                          const formatUnit = (inFt: string, inIns: string, baseUnit: string) => {
                            if (!inFt && !inIns) return '';
                            let r = [];
                            if (inFt) r.push(`${inFt}${baseUnit}`);
                            if (inIns) r.push(`${inIns}${baseUnit === 'ft' ? 'in' : 'cm'}`);
                            return r.join(' ');
                          };

                          if (isWall) {
                            // ==========================================
                            // 3D POURED WALL ENGINE
                            // ==========================================
                            const baseUnit = unitMode === 'imp' ? 'ft' : 'm';
                            const tL = formatUnit(a1, a2, baseUnit) ? `L: ${formatUnit(a1, a2, baseUnit)}` : 'Length';
                            const tH = formatUnit(b1, b2, baseUnit) ? `H: ${formatUnit(b1, b2, baseUnit)}` : 'Height';

                            const doors = parseInt(qty2) || 0;
                            const windows = parseInt(qty3) || 0;

                            const vW = 120;
                            const vH = 70;
                            const cx = 80;
                            const cy = 80;
                            const startX = cx - vW / 2;
                            const startY = cy - vH / 2;

                            return (
                              <g>
                                {/* Background Rebar Grid (Simulated) */}
                                <g opacity="0.3">
                                  {[20, 40, 60, 80, 100].map(x => <line key={`vr-${x}`} x1={startX + x} y1={startY} x2={startX + x} y2={startY + vH} stroke="#ff00d2" strokeWidth="1" />)}
                                  {[15, 30, 45, 60].map(y => <line key={`hr-${y}`} x1={startX} y1={startY + y} x2={startX + vW} y2={startY + y} stroke="#ff00d2" strokeWidth="1" />)}
                                </g>

                                {/* Main Wall Body */}
                                <rect x={startX} y={startY} width={vW} height={vH} fill="var(--color-accent)" opacity="0.15" />
                                <rect x={startX} y={startY} width={vW} height={vH} fill="none" stroke="var(--color-accent)" strokeWidth="2.5" filter="url(#neonGlowCO)" />

                                {/* Door Cutouts */}
                                {doors > 0 && (
                                  <g>
                                    <rect x={startX + 15} y={startY + 25} width={20} height={45} fill={theme === 'dark' ? '#0a0a0a' : '#f9fafb'} />
                                    <rect x={startX + 15} y={startY + 25} width={20} height={45} fill="none" stroke="#ff00d2" strokeWidth="1.5" />
                                    <line x1={startX + 10} y1={startY + 20} x2={startX + 40} y2={startY + 20} stroke="#ff00d2" strokeWidth="2" filter="url(#neonGlowCO)" />
                                    <text x={startX + 25} y={startY + 15} fill="#ff00d2" fontSize="4" fontWeight="bold" textAnchor="middle">LINTEL</text>
                                  </g>
                                )}

                                {/* Window Cutouts */}
                                {windows > 0 && (
                                  <g>
                                    <rect x={startX + (doors > 0 ? 60 : 45)} y={startY + 20} width={30} height={25} fill={theme === 'dark' ? '#0a0a0a' : '#f9fafb'} />
                                    <rect x={startX + (doors > 0 ? 60 : 45)} y={startY + 20} width={30} height={25} fill="none" stroke="#ff00d2" strokeWidth="1.5" />
                                    <line x1={startX + (doors > 0 ? 55 : 40)} y1={startY + 15} x2={startX + (doors > 0 ? 95 : 80)} y2={startY + 15} stroke="#ff00d2" strokeWidth="2" filter="url(#neonGlowCO)" />
                                    <text x={startX + (doors > 0 ? 75 : 60)} y={startY + 10} fill="#ff00d2" fontSize="4" fontWeight="bold" textAnchor="middle">LINTEL</text>
                                  </g>
                                )}

                                {/* Labels */}
                                <text x={cx} y={startY + vH + 15} fill="#fff" fontSize="7" fontWeight="bold" textAnchor="middle" className="cursor-pointer hover:fill-accent" onClick={() => document.getElementById('input-co-wall-len')?.focus()}>
                                  {tL}
                                </text>
                                <text x={startX - 10} y={cy} fill="#fff" fontSize="7" fontWeight="bold" textAnchor="middle" transform={`rotate(-90 ${startX - 10} ${cy})`} className="cursor-pointer hover:fill-accent" onClick={() => document.getElementById('input-co-wall-hei')?.focus()}>
                                  {tH}
                                </text>
                              </g>
                            );
                          } else if (isSlab) {
                            // ... (Your Existing 3D SLAB ENGINE SVG Code stays here) ...
                            const ftL = parseFloat(slabInputs.a1) || 0; const inL = parseFloat(slabInputs.a2) || 0;
                            const ftW = parseFloat(slabInputs.b1) || 0; const inW = parseFloat(slabInputs.b2) || 0;
                            const ftD = parseFloat(slabInputs.d1) || 0; const inD = parseFloat(slabInputs.d2) || 0;
                            
                            const rawL = (ftL || inL) ? (ftL + inL/subDivisor) : 20; 
                            const rawW = (ftW || inW) ? (ftW + inW/subDivisor) : 20; 
                            const dIn = (ftD * subDivisor + inD) || 10; 

                            const baseUnit = unitMode === 'imp' ? 'ft' : 'm';
                            const tL = formatUnit(slabInputs.a1, slabInputs.a2, baseUnit) ? `L: ${formatUnit(slabInputs.a1, slabInputs.a2, baseUnit)}` : 'Length';
                            const tW = formatUnit(slabInputs.b1, slabInputs.b2, baseUnit) ? `W: ${formatUnit(slabInputs.b1, slabInputs.b2, baseUnit)}` : 'Width';
                            const tD = formatUnit(slabInputs.d1, slabInputs.d2, baseUnit) ? `Depth: ${formatUnit(slabInputs.d1, slabInputs.d2, baseUnit)}` : 'Depth';

                            const maxDim = Math.max(rawL, rawW);
                            const scale = 75 / (maxDim || 1);

                            const vL = Math.max(30, Math.min(100, rawL * scale));
                            const vW = Math.max(15, Math.min(45, rawW * scale * 0.5)); 
                            
                            let scaledD = dIn * scale;
                            if (scaledD < 12) scaledD = 12 + (scaledD * 0.3);
                            const vD = Math.max(5, Math.min(50, scaledD));

                            const cx = 80 - (vW / 2);
                            const cy = 85 + (vW / 2);

                            const fbl = { x: cx - vL/2, y: cy + vD/2 };
                            const fbr = { x: cx + vL/2, y: cy + vD/2 };
                            const ftr = { x: cx + vL/2, y: cy - vD/2 };
                            const ftl = { x: cx - vL/2, y: cy - vD/2 };
                            const bbl = { x: fbl.x + vW, y: fbl.y - vW };
                            const bbr = { x: fbr.x + vW, y: fbr.y - vW };
                            const btr = { x: ftr.x + vW, y: ftr.y - vW };
                            const btl = { x: ftl.x + vW, y: ftl.y - vW };

                            return (
                              <g>
                                <polyline points={`${ftl.x},${ftl.y} ${btl.x},${btl.y} ${btr.x},${btr.y}`} fill="none" stroke="#555" strokeWidth="1" strokeDasharray="3,3" />
                                <polyline points={`${btr.x},${btr.y} ${bbr.x},${bbr.y} ${fbr.x},${fbr.y}`} fill="none" stroke="#555" strokeWidth="1" strokeDasharray="3,3" />
                                <line x1={bbl.x} y1={bbl.y} x2={bbr.x} y2={bbr.y} stroke="#555" strokeWidth="1" strokeDasharray="3,3" />
                                <line x1={btl.x} y1={btl.y} x2={bbl.x} y2={bbl.y} stroke="#555" strokeWidth="1" strokeDasharray="3,3" />
                                <line x1={fbl.x} y1={fbl.y} x2={bbl.x} y2={bbl.y} stroke="#555" strokeWidth="1" strokeDasharray="3,3" />

                                <polygon points={`${ftl.x},${ftl.y} ${ftr.x},${ftr.y} ${btr.x},${btr.y} ${btl.x},${btl.y}`} fill="var(--color-accent)" opacity="0.1" />
                                <polygon points={`${ftl.x},${ftl.y} ${ftr.x},${ftr.y} ${btr.x},${btr.y} ${btl.x},${btl.y}`} fill="none" stroke="var(--color-accent)" strokeWidth="2" filter="url(#neonGlowCO)" />
                                <polygon points={`${ftl.x},${ftl.y} ${fbl.x},${fbl.y} ${fbr.x},${fbr.y} ${ftr.x},${ftr.y}`} fill="none" stroke="var(--color-accent)" strokeWidth="2" filter="url(#neonGlowCO)" />
                                <polygon points={`${ftr.x},${ftr.y} ${fbr.x},${fbr.y} ${bbr.x},${bbr.y} ${btr.x},${btr.y}`} fill="none" stroke="var(--color-accent)" strokeWidth="2" filter="url(#neonGlowCO)" />

                                <text x={cx} y={fbl.y + 18} fill="#fff" fontSize="7" fontWeight="bold" textAnchor="middle" className="cursor-pointer hover:fill-accent" onClick={() => document.getElementById('input-co-slab-len')?.focus()}>
                                  {tL}
                                </text>
                                <text x={fbr.x + vW/2 + 5} y={fbr.y - vW/2 + 5} fill="#fff" fontSize="7" fontWeight="bold" textAnchor="start" className="cursor-pointer hover:fill-accent" onClick={() => document.getElementById('input-co-slab-wid')?.focus()}>
                                  {tW}
                                </text>
                                <text x={ftl.x - 5} y={cy + 3} fill="#ff00d2" fontSize="7" fontWeight="black" textAnchor="end" className="cursor-pointer hover:fill-accent" onClick={() => document.getElementById('input-co-slab-dep')?.focus()}>
                                  {tD}
                                </text>
                              </g>
                            );
													} else if (subMode === 'footing') {
                            // ==========================================
                            // 3D CONTINUOUS STRIP FOOTING ENGINE
                            // ==========================================
                            const baseUnit = unitMode === 'imp' ? 'ft' : 'm';
                            const tL = formatUnit(footingInputs.lenFt, footingInputs.lenIn, baseUnit) ? `L: ${formatUnit(footingInputs.lenFt, footingInputs.lenIn, baseUnit)}` : 'Footing Length';
                            
                            const vW = 140;
                            const vH = 20;
                            const cx = 80; const cy = 80;
                            const startX = cx - vW / 2;
                            const startY = cy - vH / 2;

                            return (
                              <g>
                                {/* Top Face */}
                                <polygon points={`${startX+10},${startY-10} ${startX+vW+10},${startY-10} ${startX+vW},${startY+vH-10} ${startX},${startY+vH-10}`} fill="var(--color-accent)" opacity="0.1" />
                                <polygon points={`${startX+10},${startY-10} ${startX+vW+10},${startY-10} ${startX+vW},${startY+vH-10} ${startX},${startY+vH-10}`} fill="none" stroke="var(--color-accent)" strokeWidth="2" filter="url(#neonGlowCO)" />
                                
                                {/* Front Face */}
                                <polygon points={`${startX},${startY+vH-10} ${startX+vW},${startY+vH-10} ${startX+vW},${startY+vH+5} ${startX},${startY+vH+5}`} fill="var(--color-accent)" opacity="0.2" />
                                <polygon points={`${startX},${startY+vH-10} ${startX+vW},${startY+vH-10} ${startX+vW},${startY+vH+5} ${startX},${startY+vH+5}`} fill="none" stroke="var(--color-accent)" strokeWidth="2" filter="url(#neonGlowCO)" />
                                
                                {/* Side Face */}
                                <polygon points={`${startX+vW},${startY+vH-10} ${startX+vW+10},${startY-10} ${startX+vW+10},${startY+5} ${startX+vW},${startY+vH+5}`} fill="var(--color-accent)" opacity="0.15" />
                                <polygon points={`${startX+vW},${startY+vH-10} ${startX+vW+10},${startY-10} ${startX+vW+10},${startY+5} ${startX+vW},${startY+vH+5}`} fill="none" stroke="var(--color-accent)" strokeWidth="2" filter="url(#neonGlowCO)" />
                                
                                {/* Rebar lines */}
                                <line x1={startX+5} y1={startY+vH-5} x2={startX+vW+5} y2={startY+vH-5} stroke="#ff00d2" strokeWidth="1.5" strokeDasharray="4,2" />
                                <line x1={startX+12} y1={startY+vH-12} x2={startX+vW+12} y2={startY+vH-12} stroke="#ff00d2" strokeWidth="1.5" strokeDasharray="4,2" />

                                <text x={cx + 5} y={startY + vH + 20} fill="#fff" fontSize="7" fontWeight="bold" textAnchor="middle" className="cursor-pointer hover:fill-accent" onClick={() => document.getElementById('input-co-foot-len')?.focus()}>
                                  {tL}
                                </text>
                              </g>
                            );
                          } else {
                            // ... (Your Existing 3D SONOTUBE ENGINE SVG Code stays here) ...
                            const footingBase = sonoInputs.qty4;
                            const hasBase = footingBase && footingBase !== 'none' && footingBase !== '0';

                            let rawDiaIn = 12; 
                            rawDiaIn = parseFloat(sonoInputs.diameterMode === 'custom' ? sonoInputs.a1 : (sonoInputs.diameterMode || '12')) || 12;
                            
                            const ftD = parseFloat(sonoInputs.b1) || 0;
                            const inD = parseFloat(sonoInputs.b2) || 0;
                            const rawTotalFtD = (ftD || inD) ? (ftD + inD/subDivisor) : 4; 

                            const baseUnit = unitMode === 'imp' ? 'ft' : 'm';
                            const tDia = `Diameter: ${rawDiaIn}"`;
                            const tD = formatUnit(sonoInputs.b1, sonoInputs.b2, baseUnit) ? `Depth: ${formatUnit(sonoInputs.b1, sonoInputs.b2, baseUnit)}` : 'Tube Depth';

                            const visH = Math.max(30, Math.min(80, rawTotalFtD * 10)); 
                            const visR = Math.max(10, Math.min(25, rawDiaIn * 1.2));
                            
                            const cx = 80;
                            const tubeBottomY = 105; 
                            const startY = tubeBottomY - visH; 
                            
                            const baseBottomY = 130;
                            const baseRaw = parseFloat(footingBase) || 24;
                            const baseR = hasBase ? Math.max(20, Math.min(50, baseRaw * 1.2)) : visR;

                            return (
                              <g>
                                {hasBase && (
                                  <g>
                                    <path d={`M ${cx - baseR} ${baseBottomY} A ${baseR} ${baseR*0.3} 0 0 1 ${cx + baseR} ${baseBottomY}`} fill="none" stroke="#555" strokeDasharray="2,2" />
                                    <path d={`M ${cx - visR} ${tubeBottomY} Q ${cx - visR} ${baseBottomY - 15} ${cx - baseR} ${baseBottomY} A ${baseR} ${baseR*0.3} 0 0 0 ${cx + baseR} ${baseBottomY} Q ${cx + visR} ${baseBottomY - 15} ${cx + visR} ${tubeBottomY} Z`} fill="var(--color-accent)" opacity="0.1" />
                                    <path d={`M ${cx - visR} ${tubeBottomY} Q ${cx - visR} ${baseBottomY - 15} ${cx - baseR} ${baseBottomY}`} fill="none" stroke="var(--color-accent)" strokeWidth="2.5" filter="url(#neonGlowCO)" />
                                    <path d={`M ${cx + visR} ${tubeBottomY} Q ${cx + visR} ${baseBottomY - 15} ${cx + baseR} ${baseBottomY}`} fill="none" stroke="var(--color-accent)" strokeWidth="2.5" filter="url(#neonGlowCO)" />
                                    <path d={`M ${cx - baseR} ${baseBottomY} A ${baseR} ${baseR*0.3} 0 0 0 ${cx + baseR} ${baseBottomY}`} fill="none" stroke="var(--color-accent)" strokeWidth="2.5" filter="url(#neonGlowCO)" />
                                    <text x={cx} y={baseBottomY + 12} fill={theme === 'dark' ? '#fff' : '#000'} fontSize="6.5" fontWeight="bold" textAnchor="middle" className="uppercase tracking-widest">
                                      {footingBase}" Flared Base
                                    </text>
                                  </g>
                                )}

                                <g>
                                  <path d={`M ${cx - visR} ${tubeBottomY} A ${visR} ${visR*0.3} 0 0 1 ${cx + visR} ${tubeBottomY}`} fill="none" stroke="#555" strokeDasharray="2,2" />
                                  <rect x={cx - visR} y={startY} width={visR * 2} height={tubeBottomY - startY} fill="var(--color-accent)" opacity="0.05" />
                                  <line x1={cx - visR} y1={startY} x2={cx - visR} y2={tubeBottomY} stroke="var(--color-accent)" strokeWidth="2.5" filter="url(#neonGlowCO)" />
                                  <line x1={cx + visR} y1={startY} x2={cx + visR} y2={tubeBottomY} stroke="var(--color-accent)" strokeWidth="2.5" filter="url(#neonGlowCO)" />
                                  <path d={`M ${cx - visR} ${tubeBottomY} A ${visR} ${visR*0.3} 0 0 0 ${cx + visR} ${tubeBottomY}`} fill="none" stroke="var(--color-accent)" strokeWidth="2.5" filter="url(#neonGlowCO)" opacity={hasBase ? 0.3 : 1} />
                                </g>

                                <ellipse cx={cx} cy={startY} rx={visR} ry={visR * 0.3} fill={theme === 'dark' ? '#1a1a1a' : '#fff'} stroke="var(--color-accent)" strokeWidth="2.5" filter="url(#neonGlowCO)" />
                                <ellipse cx={cx} cy={startY} rx={visR*0.8} ry={visR*0.2} fill="none" stroke="var(--color-accent)" strokeWidth="1" opacity="0.5" />

                                <text x={cx} y={startY - 12} fill="#ff00d2" fontSize="7" fontWeight="black" textAnchor="middle" className="cursor-pointer hover:fill-accent" onClick={() => document.getElementById('input-co-sono-dia')?.focus()}>
                                  {tDia}
                                </text>
                                <text x={cx} y={tubeBottomY - (visH / 2) + 2} fill={theme === 'dark' ? '#fff' : '#000'} fontSize="7" fontWeight="bold" textAnchor="middle" className="cursor-pointer hover:fill-accent" onClick={() => document.getElementById('input-co-sono-depth')?.focus()}>
                                  {tD}
                                </text>
                                <text x="10" y="15" fill={theme === 'dark' ? '#444' : '#bbb'} fontSize="5" fontWeight="black" textAnchor="start" className="uppercase tracking-widest">
                                  Pier/Footing Structure
                                </text>
                              </g>
                            );
                          }
                        })()}
                      </svg>
                    </>
                  );
                })()}
              </div>

              {subMode === 'sono' ? (
                // ==========================================
                // EXISTING SONOTUBE UI
                // ==========================================
                <>
                  <div className="flex flex-col">
                    <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Structural Flared Base (Bigfoot)</span>
                    <select 
                      value={sonoInputs.qty4 || 'none'} 
                      onChange={(e) => {
                        const val = e.target.value;
                        setSonoInputs(prev => ({ ...prev, qty4: val }));
                      }} 
                      className={`w-full border rounded-lg p-3 text-center font-bold outline-none appearance-none ${theme === 'dark' ? 'bg-black border-[#222] text-white' : 'bg-white border-[#ccc] text-black'}`}
                    >
                      <option value="none">No Flared Base (Straight Pier)</option>
                      <option value="20">20" Model Flared Footing Base</option>
                      <option value="24">24" Model Flared Footing Base</option>
                    </select>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Sonotube Diameter</span>
                    <select value={sonoInputs.diameterMode} onChange={(e) => {
                      const val = e.target.value;
                      setSonoInputs(prev => {
                        const next = { ...prev, diameterMode: val };
                        if (val !== 'custom') {
                          if (unitMode === 'imp') {
                            next.a1 = '0'; next.a2 = val; next.a3 = '0'; next.a4 = '1';
                          } else {
                            next.a1 = val; next.a2 = '0'; next.a3 = '0'; next.a4 = '1';
                          }
                        }
                        return next;
                      });
                    }} 
                    className={`w-full border rounded-lg p-3 text-center font-bold outline-none appearance-none ${theme === 'dark' ? 'bg-black border-[#222] text-white' : 'bg-white border-[#ccc] text-black'}`}
                    >
                      {unitMode === 'imp' ? (
                        <>
                          <option value="8">8” Diameter</option>
                          <option value="10">10” Diameter</option>
                          <option value="12">12” Diameter</option>
                        </>
                      ) : (
                        <>
                          <option value="200">200mm Diameter</option>
                          <option value="250">250mm Diameter</option>
                          <option value="300">300mm Diameter</option>
                        </>
                      )}
                      <option value="custom">Custom Size</option>
                    </select>
                  </div>

                  {sonoInputs.diameterMode === 'custom' && (
                    <div id="input-co-sono-custom">
                      <InputRow label="Custom Diameter (Inches)" v1={sonoInputs.a1} v2={sonoInputs.a2} v3={sonoInputs.a3} v4={sonoInputs.a4} setV1={(v) => setSonoInputs({...sonoInputs, a1: v})} 
                        setV2={(v) => setSonoInputs({...sonoInputs, a2: v})} 
                        setV3={(v) => setSonoInputs({...sonoInputs, a3: v})} 
                        setV4={(v) => setSonoInputs({...sonoInputs, a4: v})} 
                        mode={unitMode} theme={theme} 
                        onFocus={setActiveInput} 
                        hideFeet={unitMode === 'imp'}
                        {...getUnitProps('a')} 
                      />
                    </div>
                  )}

                  <div id="input-co-sono-depth">
                    <InputRow label="Tube Depth" v1={sonoInputs.b1} v2={sonoInputs.b2} v3={sonoInputs.b3} v4={sonoInputs.b4} setV1={(v) => setSonoInputs({...sonoInputs, b1: v})} 
                      setV2={(v) => setSonoInputs({...sonoInputs, b2: v})} 
                      setV3={(v) => setSonoInputs({...sonoInputs, b3: v})} 
                      setV4={(v) => setSonoInputs({...sonoInputs, b4: v})} 
                      mode={unitMode} theme={theme} 
                      onFocus={setActiveInput} 
                      {...getUnitProps('b')} 
                    />
                  </div>

                  <div className="flex flex-col">
                    <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Quantity</span>
                    <input type="number" value={sonoInputs.qty} onChange={(e) => setSonoInputs({...sonoInputs, qty: e.target.value})} 
                      placeholder="Qty" 
                      className={`w-full border rounded-lg p-3 text-center font-bold ${theme === 'dark' ? 'bg-black border-[#222]' : 'bg-white border-[#ccc]'}`} 
                    />
                  </div>

                  <div>
                    <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Add Waste Factor (%)</span>
                    <input type="number" value={sonoInputs.waste} onChange={(e) => setSonoInputs({...sonoInputs, waste: e.target.value})} 
                      placeholder="e.g. 10" 
                      className={`w-full border rounded-lg p-3 text-center font-bold ${theme === 'dark' ? 'bg-black border-[#222]' : 'bg-white border-[#ccc]'}`} 
                    />
                  </div>

                  <div className="space-y-3">
                    <button onClick={() => setSonoInputs({...sonoInputs, showVertRebar: !sonoInputs.showVertRebar})}
                      className={`w-full p-2 rounded-lg font-bold text-[10px] transition-colors ${sonoInputs.showVertRebar ? 'bg-accent text-black' : 'bg-[#333] text-white border border-[#444]'}`}
                    >
                      VERTICAL REBAR
                    </button>
                    {sonoInputs.showVertRebar && (
                      <div className="flex flex-col">
                        <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Bars Per Tube</span>
                        <input type="number" value={sonoInputs.rebarVSpacing} onChange={(e) => setSonoInputs({...sonoInputs, rebarVSpacing: e.target.value})} 
                          className={`w-full border rounded-lg p-2 text-center font-bold ${theme === 'dark' ? 'bg-black border-[#333]' : 'bg-white border-[#ccc]'}`} 
                        />
                      </div>
                    )}
                    <button onClick={() => resetTool('co')}
                      className="w-full bg-transparent border border-[#444] text-red-500 p-2 rounded-lg text-[10px] font-bold uppercase mt-2"
                    >
                      CLEAR SONOTUBE
                    </button>
                  </div>
                </>

              ) : subMode === 'wall' ? (
                // ==========================================
                // NEW WALL UI
                // ==========================================
                <>
                  <div className="flex flex-col mb-4">
                    <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Wall Construction Type</span>
                    <div className={`flex gap-1 p-1 rounded-xl border ${theme === 'dark' ? 'bg-[#333]/20 border-[#444]/30' : 'bg-gray-200/50 border-[#ddd]'}`}>
                      <button onClick={() => setC4('poured')} 
                        className={`flex-1 py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${(c4 || 'poured') === 'poured' ? 'bg-accent text-black shadow-md' : 'text-[#888] hover:text-current'}`}
                      >
                        Poured Concrete
                      </button>
                      <button onClick={() => setC4('icf')} 
                        className={`flex-1 py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${c4 === 'icf' ? 'bg-accent text-black shadow-md' : 'text-[#888] hover:text-current'}`}
                      >
                        ICF Block
                      </button>
                    </div>
                  </div>
                  <div id="input-co-wall-len">
                    <InputRow label="Wall Length" v1={a1} v2={a2} v3={a3} v4={a4} setV1={setA1} setV2={setA2} setV3={setA3} setV4={setA4} mode={unitMode} theme={theme} onFocus={setActiveInput} {...getUnitProps('a')} />
                  </div>
                  <div id="input-co-wall-hei">
                    <InputRow label="Wall Height" v1={b1} v2={b2} v3={b3} v4={b4} setV1={setB1} setV2={setB2} setV3={setB3} setV4={setB4} mode={unitMode} theme={theme} onFocus={setActiveInput} {...getUnitProps('b')} />
                  </div>
                  <div id="input-co-wall-dep">
                    <InputRow label="Wall Thickness" v1={d1} v2={d2} v3={d3} v4={d4} setV1={setD1} setV2={setD2} setV3={setD3} setV4={setD4} mode={unitMode} theme={theme} onFocus={setActiveInput} hideFeet={unitMode === 'imp'} {...getUnitProps('d')} />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col">
                      <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Door Openings</span>
                      <input type="number" value={qty2} onChange={(e) => setQty2(e.target.value)} placeholder="0" className={`w-full border rounded-lg p-3 text-center font-bold ${theme === 'dark' ? 'bg-black border-[#222]' : 'bg-white border-[#ccc]'}`} />
                    </div>
                    <div className="flex flex-col">
                      <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Window Openings</span>
                      <input type="number" value={qty3} onChange={(e) => setQty3(e.target.value)} placeholder="0" className={`w-full border rounded-lg p-3 text-center font-bold ${theme === 'dark' ? 'bg-black border-[#222]' : 'bg-white border-[#ccc]'}`} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col">
                      <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Number of Corners</span>
                      <input type="number" value={wallInputs.corners} onChange={(e) => setWallInputs({...wallInputs, corners: e.target.value})} placeholder="4" className={`w-full border rounded-lg p-3 text-center font-bold ${theme === 'dark' ? 'bg-black border-[#222]' : 'bg-white border-[#ccc]'}`} />
                    </div>
                    <div className="flex flex-col">
                      <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Foundation Tie-in?</span>
                      <button onClick={() => setWallInputs({...wallInputs, isAddition: !wallInputs.isAddition})}
                        className={`h-full rounded-lg font-bold text-[10px] uppercase tracking-widest transition-colors ${wallInputs.isAddition ? 'bg-accent text-black' : 'bg-[#333] text-white border border-[#444]'}`}
                      >
                        {wallInputs.isAddition ? 'Yes (Addition)' : 'No (New Build)'}
                      </button>
                    </div>
                  </div>

                  <div className={`p-4 rounded-xl border space-y-3 ${theme === 'dark' ? 'bg-white/5 border-[#333]/30' : 'bg-black/5 border-[#ccc]/50'}`}>
                    <span className="block mb-1 text-[10px] font-black uppercase tracking-widest text-accent opacity-80">Waterproofing System</span>
                    <select value={wallInputs.waterproofMode} onChange={(e) => setWallInputs({...wallInputs, waterproofMode: e.target.value})} 
                      className={`w-full border rounded-lg p-3 text-center font-bold outline-none appearance-none ${theme === 'dark' ? 'bg-[#111] border-[#222]' : 'bg-white border-[#ccc]'}`}
                    >
                      <option value="none">No Waterproofing (Bare Wall)</option>
                      <option value="blueskin-only">Blueskin / Membrane Only</option>
                      <option value="blueskin-dimple">Blueskin + Dimple Board</option>
                    </select>
                    
                    {wallInputs.waterproofMode !== 'none' && (
                      <div className={`flex gap-1 p-1 rounded-xl border ${theme === 'dark' ? 'bg-[#333]/20 border-[#444]/30' : 'bg-gray-200/50 border-[#ddd]'}`}>
                        <button onClick={() => setWallInputs({...wallInputs, waterproofCoverage: 'full'})} 
                          className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase transition-all ${wallInputs.waterproofCoverage === 'full' ? 'bg-accent text-black shadow-md' : 'text-[#888]'}`}
                        >
                          Full Wall
                        </button>
                        <button onClick={() => setWallInputs({...wallInputs, waterproofCoverage: 'partial'})} 
                          className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase transition-all ${wallInputs.waterproofCoverage === 'partial' ? 'bg-accent text-black shadow-md' : 'text-[#888]'}`}
                        >
                          Top 4 Feet Only
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Waste Factor (%)</span>
                    <input type="number" value={qty} onChange={(e) => setQty(e.target.value)} placeholder="5" className={`w-full border rounded-lg p-3 text-center font-bold ${theme === 'dark' ? 'bg-black border-[#222]' : 'bg-white border-[#ccc]'}`} />
                  </div>

                  <div className="space-y-3 p-4 rounded-xl border border-[#333]/30 bg-black/5 dark:bg-white/5">
                    <span className="block mb-1 text-[10px] font-black uppercase tracking-widest text-accent opacity-80">Rebar Grid Configuration</span>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col">
                        <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Vert Rebar Size</span>
                        <select value={c1} onChange={(e) => setC1(e.target.value)} className={`w-full border rounded-lg p-3 text-center font-bold outline-none appearance-none ${theme === 'dark' ? 'bg-[#111] border-[#333]' : 'bg-white border-[#ccc]'}`}>
                          <option value="10M">10M (#3)</option>
                          <option value="15M">15M (#4)</option>
                          <option value="20M">20M (#5)</option>
                        </select>
                      </div>
                      <div className="flex flex-col">
                        <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Horiz Rebar Size</span>
                        <select value={qty4} onChange={(e) => setQty4(e.target.value)} className={`w-full border rounded-lg p-3 text-center font-bold outline-none appearance-none ${theme === 'dark' ? 'bg-[#111] border-[#333]' : 'bg-white border-[#ccc]'}`}>
                          <option value="10M">10M (#3)</option>
                          <option value="15M">15M (#4)</option>
                          <option value="20M">20M (#5)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col">
                        <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Vertical Spacing ({unitMode === 'imp' ? 'in' : 'mm'})</span>
                        <input type="number" value={c2} onChange={(e) => setC2(e.target.value)} placeholder="16" className={`w-full border rounded-lg p-2 text-center font-bold ${theme === 'dark' ? 'bg-black border-[#333]' : 'bg-white border-[#ccc]'}`} />
                      </div>
                      <div className="flex flex-col">
                        <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Horizontal Spacing ({unitMode === 'imp' ? 'in' : 'mm'})</span>
                        <input type="number" value={c3} onChange={(e) => setC3(e.target.value)} placeholder="16" className={`w-full border rounded-lg p-2 text-center font-bold ${theme === 'dark' ? 'bg-black border-[#333]' : 'bg-white border-[#ccc]'}`} />
                      </div>
                    </div>
                  </div>
                  
                  <button onClick={() => resetTool('co')} className="w-full bg-transparent border border-[#444] text-red-500 p-2 rounded-lg text-[10px] font-bold uppercase mt-2">
                    CLEAR WALL
                  </button>
                </>

              ) : subMode === 'footing' ? (    
                // ==========================================
                // NEW STRIP FOOTING UI
                // ==========================================
                <>
                  <div id="input-co-foot-len">
                    <InputRow label="Total Linear Footing Length" v1={footingInputs.lenFt} v2={footingInputs.lenIn} v3={footingInputs.lenNum} v4={footingInputs.lenDen} 
                      setV1={(v) => setFootingInputs({...footingInputs, lenFt: v})} 
                      setV2={(v) => setFootingInputs({...footingInputs, lenIn: v})} 
                      setV3={(v) => setFootingInputs({...footingInputs, lenNum: v})} 
                      setV4={(v) => setFootingInputs({...footingInputs, lenDen: v})} 
                      mode={unitMode} theme={theme} onFocus={setActiveInput} {...getUnitProps('a')} 
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col">
                      <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Footing Width</span>
                      <select value={footingInputs.widMode} onChange={(e) => setFootingInputs({...footingInputs, widMode: e.target.value})} 
                        className={`w-full border rounded-lg p-3 text-center font-bold outline-none appearance-none ${theme === 'dark' ? 'bg-black border-[#222]' : 'bg-white border-[#ccc]'}`}
                      >
                        {unitMode === 'imp' ? (
                          <><option value="20">20" Wide</option><option value="24">24" Wide</option><option value="30">30" Wide</option></>
                        ) : (
                          <><option value="500">500mm Wide</option><option value="600">600mm Wide</option><option value="750">750mm Wide</option></>
                        )}
                        <option value="custom">Custom...</option>
                      </select>
                    </div>
                    <div className="flex flex-col">
                      <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Average Depth ({unitMode === 'imp' ? 'in' : 'mm'})</span>
                      <input type="number" value={footingInputs.depIn} onChange={(e) => setFootingInputs({...footingInputs, depIn: e.target.value})} className={`w-full border rounded-lg p-3 text-center font-bold ${theme === 'dark' ? 'bg-black border-[#222]' : 'bg-white border-[#ccc]'}`} />
                    </div>
                  </div>

                  {footingInputs.widMode === 'custom' && (
                    <div className="flex flex-col">
                      <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Custom Width ({unitMode === 'imp' ? 'in' : 'mm'})</span>
                      <input type="number" value={footingInputs.customWidIn} onChange={(e) => setFootingInputs({...footingInputs, customWidIn: e.target.value})} className={`w-full border rounded-lg p-3 text-center font-bold ${theme === 'dark' ? 'bg-black border-[#222]' : 'bg-white border-[#ccc]'}`} />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 mb-2">
                    <button onClick={() => setFootingInputs({...footingInputs, isAddition: !footingInputs.isAddition})}
                      className={`p-3 rounded-lg font-bold text-[10px] transition-colors ${footingInputs.isAddition ? 'bg-accent text-black' : 'bg-[#333] text-white border border-[#444]'}`}
                    >
                      {footingInputs.isAddition ? 'TIE TO EXISTING' : 'NEW BUILD (ISOLATED)'}
                    </button>
                    <button onClick={() => setFootingInputs({...footingInputs, onBedrock: !footingInputs.onBedrock})}
                      className={`p-3 rounded-lg font-bold text-[10px] transition-colors ${footingInputs.onBedrock ? 'bg-accent text-black' : 'bg-[#333] text-white border border-[#444]'}`}
                    >
                      {footingInputs.onBedrock ? 'ON BEDROCK' : 'ON SOIL / GRAVEL'}
                    </button>
                  </div>

                  <div className={`p-4 rounded-xl border space-y-3 ${theme === 'dark' ? 'bg-white/5 border-[#333]/30' : 'bg-black/5 border-[#ccc]/50'}`}>
                    <span className="block mb-1 text-[10px] font-black uppercase tracking-widest text-accent opacity-80">Footing Steel</span>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col">
                        <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Continuous Runs</span>
                        <input type="number" value={footingInputs.rebarRuns} onChange={(e) => setFootingInputs({...footingInputs, rebarRuns: e.target.value})} placeholder="2" className={`w-full border rounded-lg p-2 text-center font-bold ${theme === 'dark' ? 'bg-black border-[#333]' : 'bg-white border-[#ccc]'}`} />
                      </div>
                      <div className="flex flex-col">
                        <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Rebar Size</span>
                        <select value={footingInputs.rebarSize} onChange={(e) => setFootingInputs({...footingInputs, rebarSize: e.target.value})} className={`w-full border rounded-lg p-2 text-center font-bold outline-none appearance-none ${theme === 'dark' ? 'bg-black border-[#333]' : 'bg-white border-[#ccc]'}`}>
                          <option value="10M">10M (#3)</option>
                          <option value="15M">15M (#4)</option>
                          <option value="20M">20M (#5)</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      <div className="flex flex-col">
                        <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Corners</span>
                        <input type="number" value={footingInputs.corners} onChange={(e) => setFootingInputs({...footingInputs, corners: e.target.value})} placeholder="4" className={`w-full border rounded-lg p-2 text-center font-bold ${theme === 'dark' ? 'bg-black border-[#333]' : 'bg-white border-[#ccc]'}`} />
                      </div>
                      <div className="flex flex-col">
                        <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Corner Steel</span>
                        <select value={footingInputs.cornerSteelMode} onChange={(e) => setFootingInputs({...footingInputs, cornerSteelMode: e.target.value})} className={`w-full border rounded-lg p-2 text-center font-bold outline-none appearance-none ${theme === 'dark' ? 'bg-black border-[#333]' : 'bg-white border-[#ccc]'}`}>
                          <option value="bent">Pre-Bent 90°</option>
                          <option value="grid">Tied Grid Laps</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <button onClick={() => resetTool('co')} className="w-full bg-transparent border border-[#444] text-red-500 p-2 rounded-lg text-[10px] font-bold uppercase mt-2">
                    CLEAR FOOTINGS
                  </button>
                </>

              ) : (
                // ==========================================
                // EXISTING SLAB UI
                // ==========================================
                <>
                  <div id="input-co-slab-len">
                    <InputRow label="Length" v1={slabInputs.a1} v2={slabInputs.a2} v3={slabInputs.a3} v4={slabInputs.a4} setV1={(v) => setSlabInputs({...slabInputs, a1: v})} 
                      setV2={(v) => setSlabInputs({...slabInputs, a2: v})} 
                      setV3={(v) => setSlabInputs({...slabInputs, a3: v})} 
                      setV4={(v) => setSlabInputs({...slabInputs, a4: v})} 
                      mode={unitMode} theme={theme} 
                      onFocus={setActiveInput} 
                      {...getUnitProps('a')} 
                    />
                  </div>
                  <div id="input-co-slab-wid">
                    <InputRow label="Width" v1={slabInputs.b1} v2={slabInputs.b2} v3={slabInputs.b3} v4={slabInputs.b4} setV1={(v) => setSlabInputs({...slabInputs, b1: v})} 
                      setV2={(v) => setSlabInputs({...slabInputs, b2: v})} 
                      setV3={(v) => setSlabInputs({...slabInputs, b3: v})} 
                      setV4={(v) => setSlabInputs({...slabInputs, b4: v})} 
                      mode={unitMode} theme={theme} 
                      onFocus={setActiveInput} 
                      {...getUnitProps('b')} 
                    />
                  </div>
                  <div id="input-co-slab-dep">
                    <InputRow label="Depth" v1={slabInputs.d1} v2={slabInputs.d2} v3={slabInputs.d3} v4={slabInputs.d4} setV1={(v) => setSlabInputs({...slabInputs, d1: v})} 
                      setV2={(v) => setSlabInputs({...slabInputs, d2: v})} 
                      setV3={(v) => setSlabInputs({...slabInputs, d3: v})} 
                      setV4={(v) => setSlabInputs({...slabInputs, d4: v})} 
                      mode={unitMode} theme={theme} 
                      onFocus={setActiveInput} 
                      hideFeet={unitMode === 'imp'}
                      {...getUnitProps('d')} 
                    />
                  </div>
                  <div>
                    <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Add Waste Factor (%)</span>
                    <input type="number" value={slabInputs.waste} onChange={(e) => setSlabInputs({...slabInputs, waste: e.target.value})} 
                      placeholder="e.g. 10" 
                      className={`w-full border rounded-lg p-3 text-center font-bold ${theme === 'dark' ? 'bg-black border-[#222]' : 'bg-white border-[#ccc]'}`} 
                    />
                  </div>
                  <div className="space-y-3">
                    <span className="block mb-1 text-[10px] font-black uppercase tracking-widest text-accent opacity-80 border-t border-[#333]/30 pt-3">Reinforcement & Sub-Base</span>
                    
                    {/* PRO UPGRADE: Base Prep Toggles */}
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <button onClick={() => setSlabInputs({...slabInputs, showGravel: !slabInputs.showGravel})}
                        className={`p-2 rounded-lg font-bold text-[10px] transition-colors ${slabInputs.showGravel ? 'bg-accent text-black' : 'bg-[#333] text-white border border-[#444]'}`}
                      >
                        4" GRAVEL BASE
                      </button>
                      <button onClick={() => setSlabInputs({...slabInputs, showPoly: !slabInputs.showPoly})}
                        className={`p-2 rounded-lg font-bold text-[10px] transition-colors ${slabInputs.showPoly ? 'bg-accent text-black' : 'bg-[#333] text-white border border-[#444]'}`}
                      >
                        VAPOR BARRIER
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <button onClick={() => setSlabInputs({...slabInputs, showMesh: !slabInputs.showMesh})}
                        className={`p-2 rounded-lg font-bold text-[10px] transition-colors ${slabInputs.showMesh ? 'bg-accent text-black' : 'bg-[#333] text-white border border-[#444]'}`}
                      >
                        MESH
                      </button>
                      <button onClick={() => setSlabInputs({...slabInputs, showHorizRebar: !slabInputs.showHorizRebar})}
                        className={`p-2 rounded-lg font-bold text-[10px] transition-colors ${slabInputs.showHorizRebar ? 'bg-accent text-black' : 'bg-[#333] text-white border border-[#444]'}`}
                      >
                        H-REBAR
                      </button>
                      <button onClick={() => setSlabInputs({...slabInputs, showVertRebar: !slabInputs.showVertRebar})}
                        className={`p-2 rounded-lg font-bold text-[10px] transition-colors ${slabInputs.showVertRebar ? 'bg-accent text-black' : 'bg-[#333] text-white border border-[#444]'}`}
                      >
                        V-REBAR
                      </button>
                    </div>

                    {slabInputs.showHorizRebar && (
                      <div className="flex flex-col">
                        <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Horizontal Spacing ({unitMode === 'imp' ? 'in' : 'mm'})</span>
                        <input type="number" value={slabInputs.rebarHSpacing} onChange={(e) => setSlabInputs({...slabInputs, rebarHSpacing: e.target.value})} 
                          className={`w-full border rounded-lg p-2 text-center font-bold ${theme === 'dark' ? 'bg-black border-[#333]' : 'bg-white border-[#ccc]'}`} 
                        />
                      </div>
                    )}
                    {slabInputs.showVertRebar && (
                      <div className="flex flex-col">
                        <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Vertical Spacing ({unitMode === 'imp' ? 'in' : 'mm'})</span>
                        <input type="number" value={slabInputs.rebarVSpacing} onChange={(e) => setSlabInputs({...slabInputs, rebarVSpacing: e.target.value})} 
                          className={`w-full border rounded-lg p-2 text-center font-bold ${theme === 'dark' ? 'bg-black border-[#333]' : 'bg-white border-[#ccc]'}`} 
                        />
                      </div>
                    )}

                    <button onClick={() => resetTool('co')} className="w-full bg-transparent border border-[#444] text-red-500 p-2 rounded-lg text-[10px] font-bold uppercase mt-2">
                      CLEAR SLAB
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {activeTool === 'fi' && (
            <div className="space-y-4">
              
							{/* --- UPGRADED LIVE 3D FILL DIAGRAM --- */}
              <div className={`mb-6 flex justify-center items-center p-6 rounded-xl border shadow-inner ${theme === 'dark' ? 'bg-[#0a0a0a] border-[#222]' : 'bg-gray-50 border-[#ddd]'}`}>
                <svg viewBox="0 0 160 160" className="w-full max-w-[220px] h-auto overflow-visible transition-all duration-500">
                  <defs>
                    <filter id="neonGlowFI" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur1" />
                      <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur2" />
                      <feMerge>
                        <feMergeNode in="blur2" />
                        <feMergeNode in="blur1" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                    <pattern id="scanlinesFI" patternUnits="userSpaceOnUse" width="4" height="4">
                      <line x1="0" y1="0" x2="4" y2="0" stroke={theme === 'dark' ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"} strokeWidth="1" />
                    </pattern>
                  </defs>
                  
                  <rect x="-10" y="-10" width="180" height="180" fill="url(#scanlinesFI)" rx="8" />

                  {(() => {
                    // 1. Math Engine: Combine inputs into pure decimals based on Unit Mode
                    const ftL = parseFloat(a1) || 0; const inL = parseFloat(a2) || 0;
                    const ftW = parseFloat(b1) || 0; const inW = parseFloat(b2) || 0;
                    const ftD = parseFloat(c1) || 0; const inD = parseFloat(c2) || 0;

                    const subDivisor = unitMode === 'imp' ? 12 : 100;

                    const rawL = (ftL || inL) ? (ftL + inL / subDivisor) : 20;
                    const rawW = (ftW || inW) ? (ftW + inW / subDivisor) : 20;
                    const rawD = (ftD || inD) ? (ftD + inD / subDivisor) : 10;

                    const formatDim = (ft: string | undefined, ins: string | undefined) => {
                      if (!ft && !ins) return null;
                      let res = [];
                      if (ft) res.push(`${ft}${unitMode === 'imp' ? 'ft' : 'm'}`);
                      if (ins) res.push(`${ins}${unitMode === 'imp' ? 'in' : 'cm'}`);
                      return res.join(' ');
                    };

                    const textL = formatDim(a1, a2) ? `Length: ${formatDim(a1, a2)}` : 'Length';
                    const textW = formatDim(b1, b2) ? `Width: ${formatDim(b1, b2)}` : 'Width';
                    const textD = formatDim(c1, c2) ? `Depth: ${formatDim(c1, c2)}` : 'Depth';

                    // 2. Visual Scale Engine
                    const maxDim = Math.max(rawL, rawW);
                    const scale = 75 / (maxDim || 1);

                    const vL = Math.max(30, Math.min(100, rawL * scale));
                    const vW = Math.max(15, Math.min(45, rawW * scale * 0.5)); // Perspective foreshortening
                    
                    let rawVisD = rawD * scale;
                    if (rawVisD < 12) rawVisD = 12 + (rawVisD * 0.3); // Exaggerate thin slabs slightly
                    const vD = Math.max(5, Math.min(50, rawVisD));

                    const cx = 80 - (vW / 2);
                    const cy = 85 + (vW / 2);

                    const fbl = { x: cx - vL/2, y: cy + vD/2 }; // Front Bottom Left
                    const fbr = { x: cx + vL/2, y: cy + vD/2 }; // Front Bottom Right
                    const ftr = { x: cx + vL/2, y: cy - vD/2 }; // Front Top Right
                    const ftl = { x: cx - vL/2, y: cy - vD/2 }; // Front Top Left
                    
                    const bbl = { x: fbl.x + vW, y: fbl.y - vW }; // Back Bottom Left
                    const bbr = { x: fbr.x + vW, y: fbr.y - vW }; // Back Bottom Right
                    const btr = { x: ftr.x + vW, y: ftr.y - vW }; // Back Top Right
                    const btl = { x: ftl.x + vW, y: ftl.y - vW }; // Back Top Left

                    return (
                      <g>
                        {/* Back/Hidden Lines */}
                        <motion.polyline points={`${ftl.x},${ftl.y} ${btl.x},${btl.y} ${btr.x},${btr.y}`} fill="none" stroke="#555" strokeWidth="1" strokeDasharray="3,3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} />
                        <motion.polyline points={`${btr.x},${btr.y} ${bbr.x},${bbr.y} ${fbr.x},${fbr.y}`} fill="none" stroke="#555" strokeWidth="1" strokeDasharray="3,3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} />
                        <motion.line x1={bbl.x} y1={bbl.y} x2={bbr.x} y2={bbr.y} stroke="#555" strokeWidth="1" strokeDasharray="3,3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} />
                        <motion.line x1={btl.x} y1={btl.y} x2={bbl.x} y2={bbl.y} stroke="#555" strokeWidth="1" strokeDasharray="3,3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} />
                        <motion.line x1={fbl.x} y1={fbl.y} x2={bbl.x} y2={bbl.y} stroke="#555" strokeWidth="1" strokeDasharray="3,3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} />

                        {/* Front/Visible Lines (Glowing & Animated Drawing) */}
                        <motion.polygon points={`${ftl.x},${ftl.y} ${ftr.x},${ftr.y} ${btr.x},${btr.y} ${btl.x},${btl.y}`} fill="var(--color-accent)" opacity="0.1" transition={{ duration: 0.5 }} />
                        
                        <motion.polygon points={`${ftl.x},${ftl.y} ${ftr.x},${ftr.y} ${btr.x},${btr.y} ${btl.x},${btl.y}`} fill="none" stroke="var(--color-accent)" strokeWidth="2" filter="url(#neonGlowFI)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8 }} />
                        <motion.polygon points={`${ftl.x},${ftl.y} ${fbl.x},${fbl.y} ${fbr.x},${fbr.y} ${ftr.x},${ftr.y}`} fill="none" stroke="var(--color-accent)" strokeWidth="2" filter="url(#neonGlowFI)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: 0.2 }} />
                        <motion.polygon points={`${ftr.x},${ftr.y} ${fbr.x},${fbr.y} ${bbr.x},${bbr.y} ${btr.x},${btr.y}`} fill="none" stroke="var(--color-accent)" strokeWidth="2" filter="url(#neonGlowFI)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: 0.4 }} />

                        {/* Dynamic Labels */}
                        <text x={cx} y={fbl.y + 18} fill="#fff" fontSize="7" fontWeight="bold" textAnchor="middle" className="cursor-pointer hover:fill-accent transition-colors" onClick={() => document.getElementById('input-fi-len')?.focus()}>
                          {textL}
                        </text>
                        
                        <text x={fbr.x + vW/2 + 5} y={fbr.y - vW/2 + 5} fill="#fff" fontSize="7" fontWeight="bold" textAnchor="start" className="cursor-pointer hover:fill-accent transition-colors" onClick={() => document.getElementById('input-fi-wid')?.focus()}>
                          {textW}
                        </text>
                        
                        <text x={ftl.x - 5} y={cy + 3} fill="#ff00d2" fontSize="7" fontWeight="black" textAnchor="end" className="cursor-pointer hover:fill-accent transition-colors" onClick={() => document.getElementById('input-fi-dep')?.focus()}>
                          {textD}
                        </text>
                      </g>
                    );
                  })()}
                </svg>
              </div>
							
              {/* Upgraded Material & Compaction Setup Card */}
              <div className={`p-4 rounded-xl border space-y-3 ${theme === 'dark' ? 'bg-white/5 border-[#333]/30' : 'bg-black/5 border-[#ccc]/50'}`}>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col">
                    <span className="block mb-1.5 text-[0.65rem] font-black uppercase tracking-widest text-[#666]">Fill Material</span>
                    <select value={qty} onChange={(e) => setQty(e.target.value)} 
                      className={`w-full border rounded-xl p-4 text-center font-black text-lg uppercase outline-none appearance-none shadow-sm transition-colors ${theme === 'dark' ? 'bg-[#111] border-[#222] text-white focus:border-accent' : 'bg-gray-50 border-[#ccc] text-black focus:border-accent'}`}
                    >
                      {Object.entries(FILL_DENSITIES).map(([k, v]) => (
                        <option key={k} value={v}>{k.toUpperCase()}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="block mb-1.5 text-[0.65rem] font-black uppercase tracking-widest text-[#666]">Compaction/Waste</span>
                    <div className="relative">
                      <input type="number" value={qty2} onChange={(e) => setQty2(e.target.value)} placeholder="0"
                        className={`w-full border rounded-xl p-4 text-center font-black text-lg uppercase outline-none shadow-sm transition-colors ${theme === 'dark' ? 'bg-[#111] border-[#222] text-white focus:border-accent' : 'bg-gray-50 border-[#ccc] text-black focus:border-accent'}`}
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-[#666]">%</span>
                    </div>
                  </div>
                </div>
                <p className="text-[9px] text-[#888] font-bold text-center leading-tight">
                  *Gravel compacts by ~15%. Soil fluff/swell adds ~20-30%.
                </p>
              </div>

              {/* Grouped Geometry Inputs */}
              <div className="space-y-3 p-4 rounded-xl border border-[#333]/30 bg-black/5 dark:bg-white/5">
                <span className="block mb-1 text-[10px] font-black uppercase tracking-widest text-accent">Form Dimensions</span>
                <div id="input-fi-len">
                  <InputRow label="Length" v1={a1} v2={a2} v3={a3} v4={a4} setV1={setA1} setV2={setA2} setV3={setA3} setV4={setA4} mode={unitMode} theme={theme} onFocus={setActiveInput} {...getUnitProps('a')}/>
                </div>
                <div id="input-fi-wid">
                  <InputRow label="Width" v1={b1} v2={b2} v3={b3} v4={b4} setV1={setB1} setV2={setB2} setV3={setB3} setV4={setB4} mode={unitMode} theme={theme} onFocus={setActiveInput} {...getUnitProps('b')}/>
                </div>
                <div id="input-fi-dep">
                  <InputRow label="Depth" v1={c1} v2={c2} v3={c3} setV1={setC1} setV2={setC2} setV3={setC3} mode={unitMode} theme={theme} onFocus={setActiveInput} {...getUnitProps('c')}/>
                </div>
              </div>

              {/* UPGRADED Bridge Action: Send to Tracker */}
              <div className="pt-2 pb-2">
                <button 
                  onClick={() => {
                    const length = parseF(a1, a2, a3, a4, unitMode);
                    const width = parseF(b1, b2, b3, b4, unitMode);
                    const depth = parseF(c1, c2, c3, '0', unitMode); // Pad missing c4
                    const density = parseFloat(qty) || 85;
                    const wasteMultiplier = 1 + ((parseFloat(qty2) || 0) / 100);
                    
                    // Safely scale volume to cubic feet regardless of unit mode
                    const volFt3 = unitMode === 'imp' 
                        ? (length * width * depth * wasteMultiplier) 
                        : (length * width * depth * wasteMultiplier * 35.3147);
                    
                    addLoad(volFt3 * density);
                  }}
                  className={`w-full p-4 rounded-xl font-black text-sm uppercase tracking-widest active:scale-95 transition-all flex items-center justify-center gap-2 shadow-md ${theme === 'dark' ? 'bg-accent/10 border border-accent/50 text-accent hover:bg-accent/20' : 'bg-[#e0f7ff] border border-accent/40 text-[#0088cc] hover:bg-[#cceeff]'}`}
                >
                  <Truck size={18} strokeWidth={2.5}/>
                  Send Weight to Tracker
                </button>
              </div>

              {/* Standardized Danger Button */}
              <button onClick={() => resetTool('fi')}
                className={`w-full p-3 rounded-xl font-black tracking-widest text-[10px] uppercase active:scale-95 transition-all ${theme === 'dark' ? 'bg-[#111] border border-red-500/30 text-red-500 hover:bg-red-500/10' : 'bg-red-50 text-red-500 border border-red-200 hover:bg-red-100'}`}
              >
                Clear Fill Tool
              </button>
            </div>
          )}

          {activeTool === 'df' && (
            <div className="space-y-4">
              
              {/* --- UPGRADED LIVE DYNAMIC DIAGRAM --- */}
              <div className={`mb-6 flex flex-col justify-center items-center p-6 rounded-xl border shadow-inner overflow-hidden ${theme === 'dark' ? 'bg-[#0a0a0a] border-[#222]' : 'bg-gray-50 border-[#ddd]'}`}>
                {(() => {
                    // 1. Math Engine: Incorporates Feet, Inches, and Fractions dynamically
                    const subDivisor = unitMode === 'imp' ? 12 : 100;
                    
                    const ftL = parseFloat(a1) || 0;
                    const inL = parseFloat(a2) || 0;
                    const fracL = parseFloat(a4) ? (parseFloat(a3) || 0) / parseFloat(a4) : 0;
                    const valL = ftL + (inL + fracL) / subDivisor;
                    const rawL = valL > 0 ? valL : 12; // Fallback default length

                    const ftW = parseFloat(b1) || 0;
                    const inW = parseFloat(b2) || 0;
                    const fracW = parseFloat(b4) ? (parseFloat(b3) || 0) / parseFloat(b4) : 0;
                    const valW = ftW + (inW + fracW) / subDivisor;
                    const rawW = valW > 0 ? valW : 20; // Fallback default width

                    const displayL = valL > 0 
                      ? (unitMode === 'imp' ? `Length: ${a1 || 0}' ${a2 || 0}${a3 && a4 ? ` ${a3}/${a4}` : ''}"` : `Length: ${valL.toFixed(2)} m`)
                      : 'Deck Length';
                      
                    const displayW = valW > 0 
                      ? (unitMode === 'imp' ? `Width: ${b1 || 0}' ${b2 || 0}${b3 && b4 ? ` ${b3}/${b4}` : ''}"` : `Width: ${valW.toFixed(2)} m`)
                      : 'Deck Width';

                    // 2. Exact Scale & Board Engine
                    const uMult = unitMode === 'imp' ? 12 : 1000;
                    const rawL_u = rawL * uMult;
                    const rawW_u = rawW * uMult;

                    // Cap sizes to prevent thousands of SVG nodes (Max 30ft / 9m visual limit)
                    const max_u = unitMode === 'imp' ? 360 : 9000; 
                    const visL_u = Math.min(rawL_u, max_u);
                    const visW_u = Math.min(rawW_u, max_u);

                    const scale = 200 / (Math.max(visL_u, visW_u) || 1);
                    
                    const vL = visL_u * scale; 
                    const vW = visW_u * scale; 

                    const cx = 130;
                    const cy = 130; 
                    const leftX = cx - vW / 2;
                    const rightX = cx + vW / 2;
                    const topY = cy - vL / 2;
                    const bottomY = cy + vL / 2;

                    // Dynamic ViewBox to crop empty space
                    const vbTop = Math.max(0, topY - 30);
                    const vbHeight = vL + 60;

                    // 3. Dynamic Joists
                    const spacing = parseFloat(deckInputs.joistSpacing) || (unitMode === 'imp' ? 16 : 400);
                    const joistPx = spacing * scale;
                    const numJoists = Math.ceil(visW_u / spacing);
                    
                    const joists = [];
                    for(let i = 0; i <= numJoists; i++) {
                        let jx = leftX + (i * joistPx);
                        if (jx > rightX) jx = rightX; 
                        joists.push(jx);
                    }
                    // Guarantee edge cap closure
                    if (joists[joists.length - 1] < rightX) joists.push(rightX); 

                    // 4. Dynamic Boards
                    let bWidth = 5.5;
                    if (deckInputs.boardWidthMode === 'custom') {
                      const wIn = parseFloat(customDeckBoardW2) || 0; 
                      const fracNum = parseFloat(customDeckBoardW3) || 0;
                      const fracDen = parseFloat(customDeckBoardW4) || 0;
                      const frac = fracDen > 0 ? fracNum / fracDen : 0;
                      if (wIn + frac > 0) bWidth = wIn + frac;
                    } else {
                      bWidth = parseFloat(deckInputs.boardWidthMode) || 5.5;
                    }

                    const gap = unitMode === 'imp' ? 0.25 : 6;
                    const boardStep_u = bWidth + gap;
                    const boardPx = boardStep_u * scale;
                    const boardThicknessPx = bWidth * scale;
                    
                    const numBoards = Math.ceil(visL_u / boardStep_u);
                    const boards = [];
                    for(let i = 0; i < numBoards; i++) {
                        let by = topY + (i * boardPx);
                        // Prevent boards from drawing past the end of the deck frame
                        if (by + boardThicknessPx <= bottomY) {
                            boards.push(by);
                        }
                    }

                    return (
                      <>
                        <svg viewBox={`0 ${vbTop} 260 ${vbHeight}`} className="w-full max-w-[280px] h-auto overflow-visible transition-all duration-500">
                          <defs>
                            <filter id="neonGlowDF" x="-50%" y="-50%" width="200%" height="200%">
                              <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur1" />
                              <feMerge>
                                <feMergeNode in="blur1" />
                                <feMergeNode in="SourceGraphic" />
                              </feMerge>
                            </filter>
                            <pattern id="scanlinesDF" patternUnits="userSpaceOnUse" width="4" height="4">
                              <line x1="0" y1="0" x2="4" y2="0" stroke={theme === 'dark' ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"} strokeWidth="1" />
                            </pattern>
                          </defs>

                          {/* Massive background rect to ensure grid never clips regardless of viewBox */}
                          <rect x="-100" y="-100" width="500" height="500" fill="url(#scanlinesDF)" rx="8" />

                          <g>
                            {/* --- HOUSE / LEDGER ANCHOR --- */}
                            <line x1={leftX - 15} y1={topY} x2={rightX + 15} y2={topY} stroke={theme === 'dark' ? '#444' : '#ccc'} strokeWidth="6" strokeLinecap="round" />
                            <text x={cx} y={topY - 10} fill={theme === 'dark' ? '#666' : '#999'} fontSize="6" fontWeight="black" textAnchor="middle" className="uppercase tracking-widest">
                              House Structure (Ledger)
                            </text>

                            {/* --- FASCIA / RIM PERIMETER --- */}
                            <motion.rect 
                              x={leftX - 2} y={topY} width={vW + 4} height={vL + 2} 
                              fill="none" stroke={theme === 'dark' ? '#666' : '#aaa'} strokeWidth="1.5" strokeDasharray="3,3" 
                              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} 
                            />

                            {/* --- DYNAMIC JOISTS --- */}
                            <motion.g initial={{ opacity: 0 }} animate={{ opacity: theme === 'dark' ? 0.4 : 0.3 }} transition={{ duration: 0.8, delay: 0.2 }}>
                              {joists.map((jx, i) => (
                                <line 
                                  key={`joist-${i}`} x1={jx} y1={topY} x2={jx} y2={bottomY} 
                                  stroke={theme === 'dark' ? '#fff' : '#000'} strokeWidth="2" strokeDasharray="4,4" 
                                />
                              ))}
                            </motion.g>

                            {/* --- DYNAMIC BOARDS --- */}
                            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} transition={{ duration: 0.8, delay: 0.4 }}>
                              {boards.map((by, i) => (
                                <rect 
                                  key={`board-${i}`} x={leftX} y={by} width={vW} height={boardThicknessPx} 
                                  fill="var(--color-accent)" opacity={0.3 + (i % 2 === 0 ? 0.1 : 0)} 
                                />
                              ))}
                            </motion.g>
                            
                            {/* Outer Glow Boundary */}
                            <motion.rect 
                              x={leftX} y={topY} width={vW} height={vL} 
                              fill="none" stroke="var(--color-accent)" strokeWidth="2.5" filter="url(#neonGlowDF)" 
                              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: 0.6 }} 
                            />

                            {/* --- INTERACTIVE LABELS --- */}
                            <text 
                              x={cx} y={bottomY + 18} 
                              fill={theme === 'dark' ? '#fff' : '#000'} fontSize="7.5" fontWeight="bold" textAnchor="middle"
                              className="cursor-pointer hover:fill-accent transition-colors"
                              onClick={() => document.getElementById('input-df-wid')?.focus()}
                            >
                              {displayW}
                            </text>

                            <text 
                              x={leftX - 12} y={cy} 
                              fill={theme === 'dark' ? '#fff' : '#000'} fontSize="7.5" fontWeight="bold" textAnchor="middle" transform={`rotate(-90 ${leftX - 12} ${cy})`}
                              className="cursor-pointer hover:fill-accent transition-colors"
                              onClick={() => document.getElementById('input-df-len')?.focus()}
                            >
                              {displayL}
                            </text>

                            <text x={cx} y={topY + vL / 2} fill={theme === 'dark' ? '#fff' : '#111'} fontSize="6.5" fontWeight="black" textAnchor="middle" opacity="0.8" className="pointer-events-none drop-shadow-md">
                              {deckInputs.boardWidthMode === 'custom' ? `Custom Boards @ ${spacing}" OC` : `${deckInputs.boardWidthMode}" Boards @ ${spacing}" OC`}
                            </text>
                          </g>
                        </svg>

                        {/* Diagram Reference Note */}
                        <span className="text-[8px] text-[#888] italic px-2 text-center mt-2 font-medium opacity-80 leading-relaxed block max-w-[260px] mx-auto">
                          *Diagram is for conceptual layout reference only. Visual scale is capped at 30'x30'. Joist layout and decking patterns dynamically reflect exact user inputs.
                        </span>
                      </>
                    );
                  })()}
              </div>
              {/* --- END OF UPGRADED LIVE DYNAMIC DIAGRAM --- */}
              
              {/* Upgraded Primary Mode Toggle Pill */}
              <div className={`flex gap-1 p-1 rounded-xl border ${theme === 'dark' ? 'bg-[#333]/20 border-[#444]/30' : 'bg-gray-200/50 border-[#ddd]'}`}>
                <button onClick={() => setDeckInputs({...deckInputs, mode: 'surface'})}
                  className={`flex-1 py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${deckInputs.mode === 'surface' ? 'bg-accent text-black shadow-md' : 'text-[#888] hover:text-current'}`}
                >
                  Surface Only
                </button>
                <button onClick={() => setDeckInputs({...deckInputs, mode: 'framing'})}
                  className={`flex-1 py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${deckInputs.mode === 'framing' ? 'bg-accent text-black shadow-md' : 'text-[#888] hover:text-current'}`}
                >
                  Full Framing
                </button>
              </div>

              {/* Grouped Footprint Card */}
              <div className="space-y-3 p-4 rounded-xl border border-[#333]/30 bg-black/5 dark:bg-white/5">
                <span className="block mb-1 text-[10px] font-black uppercase tracking-widest text-accent opacity-80">Deck Footprint</span>
                <div id="input-df-len">
                  <InputRow label="Deck Length" v1={a1} v2={a2} v3={a3} v4={a4} setV1={setA1} setV2={setA2} setV3={setA3} setV4={setA4} mode={unitMode} theme={theme} onFocus={setActiveInput} {...getUnitProps('a')}/>
                </div>
                <div id="input-df-wid">
                  <InputRow label="Deck Width" v1={b1} v2={b2} v3={b3} v4={b4} setV1={setB1} setV2={setB2} setV3={setB3} setV4={setB4} mode={unitMode} theme={theme} onFocus={setActiveInput} {...getUnitProps('b')}/>
                </div>
              </div>

              {/* Decking Specifications Card */}
              <div className={`p-4 rounded-xl border space-y-4 ${theme === 'dark' ? 'bg-white/5 border-[#333]/30' : 'bg-black/5 border-[#ccc]/50'}`}>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-accent opacity-80">Surface Specifications</h3>
                
                <div className="flex flex-col">
                  <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Board Width</span>
                  <select value={deckInputs.boardWidthMode} onChange={(e) => setDeckInputs({...deckInputs, boardWidthMode: e.target.value})} 
                    className={`w-full border rounded-xl p-3 text-center font-bold text-sm outline-none appearance-none shadow-sm transition-colors ${theme === 'dark' ? 'bg-[#111] border-[#222] text-white focus:border-accent' : 'bg-gray-50 border-[#ccc] text-black focus:border-accent'}`}
                  >
                    <option value="5.5">Standard 2x6 (5.5”)</option>
                    <option value="7.25">Standard 2x8 (7.25”)</option>
                    <option value="5.25">Composite Board (5.25”)</option>
                    <option value="custom">Custom Width...</option>
                  </select>
                </div>

                {deckInputs.boardWidthMode === 'custom' && (
                  <div className="pt-2">
                    <InputRow label="Custom Board Width" v1={customDeckBoardW1} v2={customDeckBoardW2} v3={customDeckBoardW3} v4={customDeckBoardW4} setV1={setCustomDeckBoardW1} setV2={setCustomDeckBoardW2} setV3={setCustomDeckBoardW3} setV4={setCustomDeckBoardW4} mode={unitMode} theme={theme} hideFeet hidem hidemm onFocus={setActiveInput} {...getUnitProps('customdeckboard')}/>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col">
                    <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Joist Spacing</span>
                    <select value={deckInputs.joistSpacing} onChange={(e) => setDeckInputs({...deckInputs, joistSpacing: e.target.value})} 
                      className={`w-full border rounded-xl p-3 text-center font-bold text-sm outline-none appearance-none shadow-sm transition-colors ${theme === 'dark' ? 'bg-[#111] border-[#222] text-white focus:border-accent' : 'bg-gray-50 border-[#ccc] text-black focus:border-accent'}`}
                    >
                      {unitMode === 'imp' ? (
                        <>
                          <option value="12">12” OC</option>
                          <option value="16">16” OC</option>
                          <option value="24">24” OC</option>
                        </>
                      ) : (
                        <>
                          <option value="400">400 mm OC</option>
                          <option value="600">600 mm OC</option>
                        </>
                      )}
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Waste %</span>
                    <input type="number" value={waste} onChange={(e) => setWaste(e.target.value)} placeholder="10" 
                      className={`w-full border rounded-xl p-3 text-center font-bold text-lg outline-none transition-colors ${theme === 'dark' ? 'bg-[#111] border-[#222] text-white focus:border-accent' : 'bg-white border-[#ccc] text-black focus:border-accent'}`} 
                    />
                  </div>
                </div>               
              </div>

              {deckInputs.mode === 'framing' && (
                <div className="space-y-4 mt-2">
                  
                  {/* --- BEAM CONFIGURATION --- */}
                  <div className={`p-4 rounded-xl border space-y-3 ${theme === 'dark' ? 'bg-white/5 border-[#333]/30' : 'bg-black/5 border-[#ccc]/50'}`}>
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-accent opacity-80">Beam Configuration</h3>
                    </div>
                    
                    <div className="flex flex-col col-span-2">
                      <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Beam Plies</span>
                      <div className={`flex gap-1 p-1 rounded-xl border ${theme === 'dark' ? 'bg-[#333]/20 border-[#444]/30' : 'bg-gray-200/50 border-[#ddd]'}`}>
                        {(['2', '3', 'lvl'] as const).map((ply) => (
                          <button key={ply} onClick={() => setDeckInputs({...deckInputs, beamPlies: ply})}
                            className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${deckInputs.beamPlies === ply ? 'bg-accent text-black shadow-md' : 'text-[#888] hover:text-current'}`}
                          >
                            {ply === 'lvl' ? 'LVL' : `${ply}-Ply`}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col">
                        <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Beam Length ({unitMode === 'imp' ? 'ft/in' : 'm/cm'})</span>
                        <div className="flex gap-1">
                          <input type="number" placeholder={unitMode === 'imp' ? "ft" : "m"} value={deckInputs.beamLengthFt} onChange={(e) => {
                              setDeckInputs({...deckInputs, beamLengthFt: e.target.value, overrideBeamLen: true});
                            }} 
                            className={`w-full border rounded-xl p-3 text-center font-bold text-lg outline-none transition-colors ${theme === 'dark' ? 'bg-[#111] border-[#222] text-white focus:border-accent' : 'bg-white border-[#ccc] text-black focus:border-accent'} ${deckInputs.overrideBeamLen ? 'border-accent' : ''}`} 
                          />
                          <select value={deckInputs.beamLengthIn} onChange={(e) => {
                              setDeckInputs({...deckInputs, beamLengthIn: e.target.value, overrideBeamLen: true});
                            }}
                            className={`w-16 border rounded-xl p-2 text-center font-bold outline-none appearance-none transition-colors ${theme === 'dark' ? 'bg-[#111] border-[#222] text-white' : 'bg-white border-[#ccc] text-black'} ${deckInputs.overrideBeamLen ? 'border-accent' : ''}`}
                          >
                            {unitMode === 'imp' 
                              ? [...Array(12).keys()].map(i => <option key={i} value={i}>{i}</option>)
                              : [...Array(100).keys()].map(i => <option key={i} value={i}>{i}</option>)
                            }
                          </select>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Beam Count</span>
                        <input type="number" value={deckInputs.beamCount} onChange={(e) => setDeckInputs({...deckInputs, beamCount: e.target.value})} 
                          className={`w-full border rounded-xl p-3 text-center font-bold text-lg outline-none transition-colors ${theme === 'dark' ? 'bg-[#111] border-[#222] text-white focus:border-accent' : 'bg-white border-[#ccc] text-black focus:border-accent'}`} 
                        />
                      </div>
                    </div>
                  </div>

                  {/* --- POST CONFIGURATION --- */}
                  <div className={`p-4 rounded-xl border space-y-3 ${theme === 'dark' ? 'bg-white/5 border-[#333]/30' : 'bg-black/5 border-[#ccc]/50'}`}>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-accent opacity-80">Post Configuration</h3>
                    
                    <div className="flex flex-col col-span-2">
                      <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Post Size</span>
                      <div className={`flex gap-1 p-1 rounded-xl border ${theme === 'dark' ? 'bg-[#333]/20 border-[#444]/30' : 'bg-gray-200/50 border-[#ddd]'}`}>
                        {(['4x4', '6x6', '8x8'] as const).map((size) => (
                          <button key={size} onClick={() => setDeckInputs({...deckInputs, postSize: size})}
                            className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${deckInputs.postSize === size ? 'bg-accent text-black shadow-md' : 'text-[#888] hover:text-current'}`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col">
                        <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Post Height ({unitMode === 'imp' ? 'ft/in' : 'm/cm'})</span>
                        <div className="flex gap-1">
                          <input type="number" placeholder={unitMode ===  'imp' ? "ft" : "m"} value={deckInputs.postHeightFt} onChange={(e) => setDeckInputs({...deckInputs, postHeightFt: e.target.value})} 
                            className={`w-full border rounded-xl p-3 text-center font-bold text-lg outline-none transition-colors ${theme === 'dark' ? 'bg-[#111] border-[#222] text-white focus:border-accent' : 'bg-white border-[#ccc] text-black focus:border-accent'}`} 
                          />
                          <select value={deckInputs.postHeightIn} onChange={(e) => setDeckInputs({...deckInputs, postHeightIn: e.target.value})}
                            className={`w-16 border rounded-xl p-2 text-center font-bold outline-none appearance-none transition-colors ${theme === 'dark' ? 'bg-[#111] border-[#222] text-white' : 'bg-white border-[#ccc] text-black'}`}
                          >
                            {unitMode === 'imp' 
                              ? [...Array(12).keys()].map(i => <option key={i} value={i}>{i}</option>)
                              : [...Array(100).keys()].map(i => <option key={i} value={i}>{i}</option>)
                            }
                          </select>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Posts Per Beam</span>
                        <input type="number" value={deckInputs.postCountPerBeam} onChange={(e) => {
                            setDeckInputs({...deckInputs, postCountPerBeam: e.target.value, overridePostCount: true});
                          }} 
                          className={`w-full border rounded-xl p-3 text-center font-bold text-lg outline-none transition-colors ${theme === 'dark' ? 'bg-[#111] border-[#222] text-white focus:border-accent' : 'bg-white border-[#ccc] text-black focus:border-accent'} ${deckInputs.overridePostCount ? 'border-accent' : ''}`} 
                        />
                      </div>
                    </div>
                  </div>

                  {/* --- JOIST CONFIGURATION --- */}
                  <div className={`p-4 rounded-xl border space-y-3 ${theme === 'dark' ? 'bg-white/5 border-[#333]/30' : 'bg-black/5 border-[#ccc]/50'}`}>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-accent opacity-80">Joist Configuration</h3>
                    
                    <div className="flex flex-col col-span-2">
                      <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Joist Material</span>
                      <div className={`flex gap-1 p-1 rounded-xl border ${theme === 'dark' ? 'bg-[#333]/20 border-[#444]/30' : 'bg-gray-200/50 border-[#ddd]'}`}>
                        {(['2x6', '2x8', '2x10', '2x12'] as const).map((mat) => (
                          <button key={mat} onClick={() => setDeckInputs({...deckInputs, joistMaterial: mat, overrideJoistMat: true})}
                            className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${deckInputs.joistMaterial === mat ? 'bg-accent text-black shadow-md' : 'text-[#888] hover:text-current'}`}
                          >
                            {mat}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col">
                        <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Joist Span ({unitMode === 'imp' ? 'ft/in' : 'm/cm'})</span>
                        <div className="flex gap-1">
                          <input type="number" placeholder={unitMode ===  'imp' ? "ft" : "m"} value={deckInputs.joistSpanFt} onChange={(e) => {
                              setDeckInputs({...deckInputs, joistSpanFt: e.target.value, overrideJoistSpan: true});
                            }} 
                            className={`w-full border rounded-xl p-3 text-center font-bold text-lg outline-none transition-colors ${theme === 'dark' ? 'bg-[#111] border-[#222] text-white focus:border-accent' : 'bg-white border-[#ccc] text-black focus:border-accent'} ${deckInputs.overrideJoistSpan ? 'border-accent' : ''}`} 
                          />
                          <select value={deckInputs.joistSpanIn} onChange={(e) => {
                              setDeckInputs({...deckInputs, joistSpanIn: e.target.value, overrideJoistSpan: true});
                            }}
                            className={`w-16 border rounded-xl p-2 text-center font-bold outline-none appearance-none transition-colors ${theme === 'dark' ? 'bg-[#111] border-[#222] text-white' : 'bg-white border-[#ccc] text-black'} ${deckInputs.overrideJoistSpan ? 'border-accent' : ''}`}
                          >
                            {unitMode === 'imp' 
                              ? [...Array(12).keys()].map(i => <option key={i} value={i}>{i}</option>)
                              : [...Array(100).keys()].map(i => <option key={i} value={i}>{i}</option>)
                            }
                          </select>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Cantilever ({unitMode === 'imp' ? 'in' : 'cm'})</span>
                        <input type="number" value={deckInputs.beamCantilever} onChange={(e) => setDeckInputs({...deckInputs, beamCantilever: e.target.value})} 
                          className={`w-full border rounded-xl p-3 text-center font-bold text-lg outline-none transition-colors ${theme === 'dark' ? 'bg-[#111] border-[#222] text-white focus:border-accent' : 'bg-white border-[#ccc] text-black focus:border-accent'}`} 
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* --- LEDGER & FASCIA --- */}
                  <div className={`p-4 rounded-xl border space-y-3 ${theme === 'dark' ? 'bg-white/5 border-[#333]/30' : 'bg-black/5 border-[#ccc]/50'}`}>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-accent opacity-80">Ledger & Fascia</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col">
                        <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Ledger Count</span>
                        <input type="number" value={deckInputs.ledgerCount} onChange={(e) => setDeckInputs({...deckInputs, ledgerCount: e.target.value})} 
                          className={`w-full border rounded-xl p-3 text-center font-bold text-lg outline-none transition-colors ${theme === 'dark' ? 'bg-[#111] border-[#222] text-white focus:border-accent' : 'bg-white border-[#ccc] text-black focus:border-accent'}`} 
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Fascia Material</span>
                        <select value={deckInputs.fasciaMaterial} onChange={(e) => setDeckInputs({...deckInputs, fasciaMaterial: e.target.value})} 
                          className={`w-full border rounded-xl p-3 text-center font-bold text-sm outline-none appearance-none shadow-sm transition-colors ${theme === 'dark' ? 'bg-[#111] border-[#222] text-white focus:border-accent' : 'bg-gray-50 border-[#ccc] text-black focus:border-accent'}`}
                        >
                          <option value="2x8">2x8 Wrap</option>
                          <option value="2x10">2x10 Wrap</option>
                          <option value="2x12">2x12 Wrap</option>
                          <option value="1x12">1x12 PVC</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Pro Upgrades Card */}
              <div className={`p-4 rounded-xl border space-y-4 mt-2 ${theme === 'dark' ? 'bg-white/5 border-[#333]/30' : 'bg-black/5 border-[#ccc]/50'}`}>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-accent opacity-80">Finishing & Upgrades</h3>
                
                {/* Picture Frame Toggle */}
                <div className="flex flex-col">
                  <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Picture Frame Border</span>
                  <div className={`flex gap-1 p-1 rounded-xl border ${theme === 'dark' ? 'bg-[#333]/20 border-[#444]/30' : 'bg-gray-200/50 border-[#ddd]'}`}>
                    {(['none', 'single', 'double'] as const).map((mode) => (
                      <button key={mode} onClick={() => setC1(mode)}
                        className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${(c1 || 'none') === mode ? 'bg-accent text-black shadow-md' : 'text-[#888] hover:text-current'}`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Guardrail Toggle */}
                <div className="flex flex-col">
                  <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Guardrail System</span>
                  <div className={`flex gap-1 p-1 rounded-xl border ${theme === 'dark' ? 'bg-[#333]/20 border-[#444]/30' : 'bg-gray-200/50 border-[#ddd]'}`}>
                    {(['none', 'wood', 'aluminum'] as const).map((mode) => (
                      <button key={mode} onClick={() => setC2(mode)}
                        className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${(c2 || 'none') === mode ? 'bg-accent text-black shadow-md' : 'text-[#888] hover:text-current'}`}
                      >
                        {mode === 'wood' ? 'Wood Spindle' : mode}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Skirting Toggle */}
                <div className="flex flex-col">
                  <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Deck Skirting</span>
                  <div className={`flex gap-1 p-1 rounded-xl border ${theme === 'dark' ? 'bg-[#333]/20 border-[#444]/30' : 'bg-gray-200/50 border-[#ddd]'}`}>
                    {(['none', 'lattice', 'boards'] as const).map((mode) => (
                      <button key={mode} onClick={() => setC3(mode)}
                        className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${(c3 || 'none') === mode ? 'bg-accent text-black shadow-md' : 'text-[#888] hover:text-current'}`}
                      >
                        {mode === 'boards' ? 'Horiz. Boards' : mode}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Standardized Danger Button */}
              <button onClick={() => resetTool('df')}
                className={`w-full mt-4 p-3 rounded-xl font-black tracking-widest text-[10px] uppercase active:scale-95 transition-all ${theme === 'dark' ? 'bg-[#111] border border-red-500/30 text-red-500 hover:bg-red-500/10' : 'bg-red-50 text-red-500 border border-red-200 hover:bg-red-100'}`}
              >
                Clear Deck Tool
              </button>

              {/* HERO CARD RESULT (Fixes the text clipping issue) */}
              {results.main && (
                <div className={`mt-6 pt-5 border-t w-full ${theme === 'dark' ? 'border-[#222]/40' : 'border-[#ddd]'}`}>
                  <div className={`mb-4 text-center border rounded-xl p-6 shadow-lg ${theme === 'dark' ? 'bg-[#111] border-[#222]' : 'bg-gray-50 border-[#ccc]'}`}>
                    <span className="block text-[10px] font-black uppercase tracking-widest text-accent opacity-80 mb-2">
                      {deckInputs.mode === 'framing' ? 'Core Substructure' : 'Total Surface Area'}
                    </span>
                    <span className={`text-4xl font-black tracking-tight break-words ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{results.main}</span>
                  </div>
                </div>
              )}
              {/* Restored & Upgraded Segmented Output List */}
              {results.sub && results.sub.length > 0 && (
                <div className={`mt-6 pt-5 border-t w-full ${theme === 'dark' ? 'border-[#222]/40' : 'border-[#ddd]'}`}>
                  <div className="space-y-1.5">
                    {results.sub.map((item: any, idx: number) => {
                      const isHeader = item.label.includes('---');
                      const isWarning = item.warning;

                      if (isWarning) {
                        return (
                          <div key={idx} className="flex justify-between items-center p-3 my-2 rounded-xl bg-red-500/10 border border-red-500/30 text-xs">
                            <span className="text-red-500 font-bold uppercase tracking-wide">{item.label}</span>
                            <span className="text-red-500 font-mono font-black text-right">{item.value}</span>
                          </div>
                        );
                      }

                      return (
                        <div 
                          key={idx} 
                          className={`flex justify-between items-center py-2.5 px-3 rounded-lg transition-colors ${
                            isHeader 
                              ? 'mt-4 mb-1 border-none bg-accent/10 dark:bg-accent/5' 
                              : theme === 'dark' ? 'border-b border-[#222]/40 hover:bg-white/[0.02]' : 'border-b border-[#ddd]/60 hover:bg-black/[0.02]'
                          }`}
                        >
                          <span className={`${
                            isHeader 
                              ? 'text-accent font-black uppercase tracking-widest text-[10px]' 
                              : `text-xs opacity-80 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`
                          }`}>
                            {item.label.replace(/-/g, '').trim()}
                          </span>
                          
                          {!isHeader && (
                            <span className={`font-bold font-mono text-right ${
                              item.highlight 
                                ? 'text-accent text-sm tracking-wide font-black' 
                                : theme === 'dark' ? 'text-white text-xs' : 'text-black text-xs'
                            }`}>
                              {item.value}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTool === 'pl' && (
            <div className="space-y-4">
              
							{/* --- UPGRADED LIVE DYNAMIC DIAGRAM --- */}
              <div className={`mb-6 flex justify-center items-center p-6 rounded-xl border shadow-inner ${theme === 'dark' ? 'bg-[#0a0a0a] border-[#222]' : 'bg-gray-50 border-[#ddd]'}`}>
                <svg viewBox="0 0 240 180" className="w-full max-w-[280px] h-auto overflow-visible transition-all duration-500">
                  <defs>
                    <filter id="neonGlowPT" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur1" />
                      <feMerge><feMergeNode in="blur1" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                    <pattern id="scanlinesPT" patternUnits="userSpaceOnUse" width="4" height="4">
                      <line x1="0" y1="0" x2="4" y2="0" stroke={theme === 'dark' ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"} strokeWidth="1" />
                    </pattern>
                  </defs>

                  <rect x="-10" y="-10" width="260" height="200" fill="url(#scanlinesPT)" rx="8" />

                  {(() => {
                    const isI = unitMode === 'imp';
                    let maxCapLbs = 2000;
                    const customWeightRaw = parseFloat(b1) || 0;
                    const customWeightLbs = isI ? customWeightRaw : (customWeightRaw / 0.453592);

                    if (truckModel === 'custom') {
                      maxCapLbs = customWeightLbs > 0 ? customWeightLbs : (isI ? 1500 : 1500 / 0.453592);
                    } else if (typeof getStandardCap === 'function') {
                      maxCapLbs = getStandardCap(truckModel) || 2000;
                    } else if (typeof TRUCK_CAPACITIES !== 'undefined' && TRUCK_CAPACITIES[truckModel]) {
                      maxCapLbs = TRUCK_CAPACITIES[truckModel].value || parseFloat(TRUCK_CAPACITIES[truckModel].label?.replace(/[^0-9.]/g, '')) || 2000;
                    }

                    const currentLoadLbs = typeof totalLoad === 'number' ? totalLoad : (parseFloat(totalLoad) || 0);
                    const payloadUsedLbs = isTrailer ? (currentLoadLbs * 0.15) : currentLoadLbs;
                    
                    const rawRatio = maxCapLbs > 0 ? (payloadUsedLbs / maxCapLbs) : 0;
                    const fillRatio = Math.min(1, Math.max(0, rawRatio));

                    const glowColor = fillRatio > 0.95 ? '#ff0044' : fillRatio > 0.75 ? '#ffaa00' : 'var(--color-accent)';

                    const maxBricks = 15;
                    const visibleBricksCount = Math.ceil(fillRatio * maxBricks);
                    
                    const rows = [5, 4, 3, 2, 1];
                    const brickW = 24;
                    const brickH = 12;
                    const gap = 2;
                    const startY = 140; 
                    
                    const centerX = isTrailer ? 175 : 100;
                    const bricks = [];
                    let brickIndex = 0;

                    for (let r = 0; r < rows.length; r++) {
                      const bricksInRow = rows[r];
                      const rowWidth = (bricksInRow * brickW) + ((bricksInRow - 1) * gap);
                      const startX = centerX - (rowWidth / 2);

                      for (let b = 0; b < bricksInRow; b++) {
                        if (brickIndex < visibleBricksCount) {
                          bricks.push(
                            <motion.rect 
                              key={`brick-${r}-${b}`}
                              x={startX + b * (brickW + gap)} 
                              y={startY - r * (brickH + gap) - brickH - (isTrailer ? 6 : 0)} 
                              width={brickW} height={brickH} rx="2"
                              fill={glowColor} fillOpacity="0.15" stroke={glowColor} strokeWidth="1.5"
                              filter="url(#neonGlowPT)"
                              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: brickIndex * 0.05 }}
                            />
                          );
                        }
                        brickIndex++;
                      }
                    }

                    return (
                      <g>
                        <motion.line x1="10" y1={startY} x2={isTrailer ? 80 : 190} y2={startY} stroke={theme === 'dark' ? '#555' : '#aaa'} strokeWidth="6" strokeLinecap="round" animate={{ x2: isTrailer ? 80 : 190 }} transition={{ duration: 0.5 }} />
                        <motion.line x1="30" y1={startY + 3} x2="30" y2={startY + 25} stroke={theme === 'dark' ? '#555' : '#aaa'} strokeWidth="6" strokeLinecap="round" />
                        
                        {!isTrailer && (
                          <motion.line initial={{ opacity: 0 }} animate={{ opacity: 1 }} x1="170" y1={startY + 3} x2="170" y2={startY + 25} stroke={theme === 'dark' ? '#555' : '#aaa'} strokeWidth="6" strokeLinecap="round" />
                        )}

                        {isTrailer && (
                           <motion.g initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                             <polyline points="80,140 100,146 110,146 120,134 240,134" fill="none" stroke={theme === 'dark' ? '#666' : '#999'} strokeWidth="4" strokeLinejoin="round" />
                             <circle cx="100" cy="146" r="3" fill="#ff00d2" filter="url(#neonGlowPT)" />
                             <line x1="160" y1="137" x2="160" y2="155" stroke={theme === 'dark' ? '#666' : '#999'} strokeWidth="6" strokeLinecap="round" />
                             <line x1="190" y1="137" x2="190" y2="155" stroke={theme === 'dark' ? '#666' : '#999'} strokeWidth="6" strokeLinecap="round" />
                           </motion.g>
                        )}

                        {bricks}

                        <text x="120" y="30" fill={glowColor} fontSize="10" fontWeight="black" textAnchor="middle" filter="url(#neonGlowPT)" className="transition-colors duration-500">
                          {Math.round(fillRatio * 100)}% PAYLOAD USED
                        </text>
                        
                        {rawRatio > 1 && (
                          <motion.text initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} x="120" y="45" fill="#ff0044" fontSize="7" fontWeight="bold" textAnchor="middle" className="uppercase tracking-widest">
                            OVERLOAD WARNING
                          </motion.text>
                        )}

                        {visibleBricksCount === 0 && (
                          <text x="120" y="125" fill={theme === 'dark' ? '#555' : '#aaa'} fontSize="7" fontWeight="bold" textAnchor="middle" className="uppercase tracking-widest">
                            Payload is Empty
                          </text>
                        )}
                      </g>
                    );
                  })()}
                </svg>
              </div>
              {/* --- END OF UPGRADED LIVE DYNAMIC DIAGRAM --- */}   
              
              {/* Grouped Vehicle Configuration Card */}
              <div className={`p-4 rounded-xl border space-y-4 ${theme === 'dark' ? 'bg-white/5 border-[#333]/30' : 'bg-black/5 border-[#ccc]/50'}`}>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-accent opacity-80">Vehicle Configuration</h3>
                
                <div className="flex flex-col" id="input-pl-model">
                  <select 
                    value={truckModel} 
                    onChange={(e) => setTruckModel(e.target.value)} 
                    className={`w-full border rounded-xl p-4 text-center font-bold text-lg outline-none appearance-none shadow-sm transition-colors ${theme === 'dark' ? 'bg-[#111] border-[#222] text-white focus:border-accent' : 'bg-gray-50 border-[#ccc] text-black focus:border-accent'}`}
                  >
                    {Object.entries(TRUCK_CAPACITIES).map(([k, v]) => (
                      <option key={k} value={k}>{v.label}</option>
                    ))}
                  </select>
                </div>

                {truckModel === 'custom' && (
                  <div className="flex flex-col pt-2 border-t border-[#333]/30 dark:border-[#ccc]/50">
                    <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">
                      Custom Capacity ({unitMode === 'imp' ? 'lbs' : 'kg'})
                    </span>
                    <input 
                      type="number"
                      value={b1} 
                      onChange={(e) => setB1(e.target.value)}
                      placeholder={unitMode === 'imp' ? "2000" : "1000"}
                      className={`w-full border rounded-xl p-3 text-center font-bold outline-none transition-colors ${theme === 'dark' ? 'bg-[#111] border-[#222] text-white focus:border-accent' : 'bg-white border-[#ccc] text-black focus:border-accent'}`}
                    />
                  </div>
                )}

                <div className={`flex items-center justify-between p-4 border rounded-xl shadow-sm ${theme === 'dark' ? 'bg-[#111] border-[#222]' : 'bg-gray-50 border-[#ccc]'}`}>
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Trailer Mode (Calculates Tongue Weight)</span>
                  <button onClick={() => setisTrailer(!isTrailer)}
                    className={`w-12 h-6 rounded-full relative transition-colors flex-shrink-0 ${isTrailer ? 'bg-accent' : (theme === 'dark' ? 'bg-[#333]' : 'bg-gray-300')}`}
                  >
                    <motion.div animate={{ x: isTrailer ? 24 : 2 }} className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-sm"/>
                  </button>
                </div>
              </div>

              {/* Upgraded Material Category Selector */}
              <div className="flex flex-col" id="input-pl-cat">
                <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Material Category</span>
                <select value={subMode} onChange={(e) => setSubMode(e.target.value)} 
                  className={`w-full border rounded-xl p-3 text-center font-bold text-sm outline-none appearance-none shadow-sm transition-colors ${theme === 'dark' ? 'bg-[#111] border-[#222] text-white focus:border-accent' : 'bg-gray-50 border-[#ccc] text-black focus:border-accent'}`}
                >
                  <option value="lum">{unitMode === 'imp' ? 'Lumber' : 'Timber'}</option>
                  <option value="con">Concrete</option>
                  <option value="sheet">{unitMode === 'imp' ? 'Sheeting' : 'Panels'}</option>
                  <option value="liquid">Liquid Load</option>
                  <option value="customItem">Custom Item</option>
                </select>
              </div>

              {/* Material Specific Inputs */}
              <div className="space-y-3">
                {subMode === 'lum' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col">
                      <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Lumber Size</span>
                      <select value={a1} onChange={(e) => setA1(e.target.value)} className={`w-full border rounded-xl p-3 text-center font-bold text-sm outline-none appearance-none shadow-sm transition-colors ${theme === 'dark' ? 'bg-[#111] border-[#222] text-white focus:border-accent' : 'bg-gray-50 border-[#ccc] text-black focus:border-accent'}`}>
                        <option value="">Select Size...</option>
                        {['2x4', '2x6', '2x8', '2x10', '2x12', '4x4', '4x6', '6x6', '6x8'].map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="flex flex-col">
                      <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Board Length</span>
                      <select value={a2} onChange={(e) => setA2(e.target.value)} className={`w-full border rounded-xl p-3 text-center font-bold text-sm outline-none appearance-none shadow-sm transition-colors ${theme === 'dark' ? 'bg-[#111] border-[#222] text-white focus:border-accent' : 'bg-gray-50 border-[#ccc] text-black focus:border-accent'}`}>
                        <option value="">Length...</option>
                        {[6, 8, 10, 12, 14, 16, 18, 20, 22, 24].map(l => <option key={l} value={l}>{l}'</option>)}
                      </select>
                    </div>
                    <div className="flex flex-col col-span-2">
                      <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Wood Species</span>
                      <select value={d1} onChange={(e) => setD1(e.target.value)} className={`w-full border rounded-xl p-3 text-center font-bold text-sm outline-none appearance-none shadow-sm transition-colors ${theme === 'dark' ? 'bg-[#111] border-[#222] text-white focus:border-accent' : 'bg-gray-50 border-[#ccc] text-black focus:border-accent'}`}>
                        <option value="fir">Douglas Fir</option>
                        <option value="spruce">Spruce-Pine-Fir (SPF)</option>
                        <option value="pt">Pressure Treated (PT)</option>
                        <option value="cedar">Cedar</option>
                      </select>
                    </div>
                  </div>
                )}

                {subMode === 'liquid' && (
                  <div className="flex flex-col" id="input-pl-qty">
                    <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">{unitMode === 'imp' ? 'Gallons' : 'Liters'}</span>
                    <input type="number" value={liquidQty} onChange={(e) => setLiquidQty(e.target.value)} placeholder="0" 
                      className={`w-full border rounded-xl p-4 text-center font-black text-lg outline-none transition-colors shadow-sm ${theme === 'dark' ? 'bg-[#111] border-[#222] text-white focus:border-accent' : 'bg-white border-[#ccc] text-black focus:border-accent'}`} 
                    />
                  </div>
                )}

                {subMode === 'customItem' && (
                  <div className="flex flex-col">
                    <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Weight Per Unit ({unitMode === 'imp' ? 'lbs' : 'kg'})</span>
                    <input type="number" value={c1} onChange={(e) => setC1(e.target.value)} placeholder="0" 
                      className={`w-full border rounded-xl p-4 text-center font-bold text-lg outline-none shadow-sm transition-colors ${theme === 'dark' ? 'bg-[#111] border-[#222] text-white focus:border-accent' : 'bg-white border-[#ccc] text-black focus:border-accent'}`}
                    />
                  </div>
                )}

                {(subMode === 'con' || subMode === 'sheet') && (
                  <div className="flex flex-col">
                    <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Specific Type</span>
                    <select value={d1} onChange={(e) => setD1(e.target.value)}
                      className={`w-full border rounded-xl p-4 text-center font-bold text-sm outline-none appearance-none shadow-sm transition-colors ${theme === 'dark' ? 'bg-[#111] border-[#222] text-white focus:border-accent' : 'bg-gray-50 border-[#ccc] text-black focus:border-accent'}`}
                    >
                      {subMode === 'lum' ? Object.keys(WOOD_WEIGHTS).map(k => <option key={k} value={WOOD_WEIGHTS[k]}>{k.toUpperCase()}</option>) : null}
                      {subMode === 'con' ? [80, 60, 40].map(v => <option key={v} value={v}>{unitMode === 'imp' ? `${v}lb Bag` : `${Math.round(v * 0.453592)}kg Bag`}</option>) : null}
                      
                      {subMode === 'sheet' ? [
                        { val: 25, imp: '1/4" Plywood / OSB', met: '6mm Plywood / OSB' },
                        { val: 35, imp: '3/8" Plywood / OSB', met: '9mm Plywood / OSB' },
                        { val: 50, imp: '1/2" Plywood / OSB', met: '12mm Plywood / OSB' },
                        { val: 60, imp: '5/8" Plywood / OSB', met: '15mm Plywood / OSB' },
                        { val: 75, imp: '3/4" Plywood / OSB', met: '19mm Plywood / OSB' },
                        { val: 55, imp: '1/2" Drywall', met: '12mm Drywall' },
                        { val: 70, imp: '5/8" Drywall (Type X)', met: '15mm Drywall' },
                      ].map(item => <option key={item.val} value={item.val}>{unitMode === 'imp' ? item.imp : item.met}</option>) : null}
                    </select>
                  </div>
                )}

                {(subMode !== 'liquid') && (
                  <div className="flex flex-col" id="input-pl-qty">
                    <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Quantity</span>
                    <input type="number" placeholder="Enter quantity" value={qty} onChange={(e) => setQty(e.target.value)} 
                      className={`w-full border rounded-xl p-4 text-center font-black text-lg outline-none transition-colors shadow-sm ${theme === 'dark' ? 'bg-[#111] border-[#222] text-white focus:border-accent' : 'bg-white border-[#ccc] text-black focus:border-accent'}`} 
                    />
                  </div>
                )}
              </div>

              {/* Accumulator Actions */}
              <div className="pt-2 pb-2">
                <button 
                  type="button"
                  onClick={() => {
                    if (subMode === 'customItem') {
                      const unitWeight = parseFloat(c1) || 0;
                      const quantity = parseFloat(qty) || 1;
                      const totalItemWeight = unitMode === 'imp' ? (unitWeight * quantity) : (unitWeight * quantity / 0.453592);
                      addLoad(totalItemWeight);
                    } else {
                      addLoad();
                    }
                  }} 
                  className="w-full bg-accent text-black p-4 rounded-xl font-black text-sm uppercase tracking-widest active:scale-95 transition-all shadow-[0_0_15px_rgba(0,210,255,0.3)] hover:brightness-110 flex items-center justify-center gap-2"
                >
                  <Truck size={18} strokeWidth={2.5}/>
                  ADD WEIGHT TO PAYLOAD
                </button>
              </div>

              {/* Standardized Clear Button */}
              <button 
                type="button"
                onClick={() => {
                  settotalLoad(0);
                  if (typeof setQty === 'function') setQty('1');
                  if (typeof setA1 === 'function') setA1('');
                  if (typeof setA2 === 'function') setA2('');
                  if (typeof setA3 === 'function') setA3('');
                  if (typeof setC1 === 'function') setC1(''); 
                  if (typeof setLiquidQty === 'function') setLiquidQty('');
                }} 
                className={`w-full p-3 rounded-xl font-black tracking-widest text-[10px] uppercase active:scale-95 transition-all ${theme === 'dark' ? 'bg-[#111] border border-red-500/30 text-red-500 hover:bg-red-500/10' : 'bg-red-50 text-red-500 border border-red-200 hover:bg-red-100'}`}
              >
                Clear Entire Load
              </button>
            </div>
          )}

          {activeTool === 'un' && (
            <div className="space-y-4">
              
              {/* --- UPGRADED LIVE DYNAMIC DIAGRAM --- */}
              <div className={`mb-6 flex justify-center items-center p-6 rounded-xl border shadow-inner ${theme === 'dark' ? 'bg-[#0a0a0a] border-[#222]' : 'bg-gray-50 border-[#ddd]'}`}>
                {(() => {
                  const rawInput = a1 || ''; 
                  const hasInput = parseFloat(rawInput) > 0 || parseFloat(rawInput) < 0; 
                  const catName = subMode ? String(subMode).toUpperCase() : 'CONVERSION'; 
                  const finalResultStr = results?.main || '0';

                  const unitMap: Record<string, string> = { ft2: 'ft²', m2: 'm²', km2: 'km²', mi2: 'mi²', cm2: 'cm²', in2: 'in²', ft3: 'ft³', m3: 'm³', yd3: 'yd³' };
                  const inUnitStr = subMode ? (unitMap[subMode.toString()] || subMode.toString()) : '';
                  const formattedInput = hasInput ? (rawInput.length > 6 ? rawInput.slice(0, 6) + '..' : rawInput) + ` ${inUnitStr}` : `0 ${inUnitStr}`;

                  return (
                    <svg viewBox="0 0 280 120" className="w-full max-w-[340px] h-auto overflow-visible transition-all duration-500">
                      <defs>
                        <filter id="neonGlowUCCyan" x="-50%" y="-50%" width="200%" height="200%">
                          <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur" />
                          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                        </filter>
                        <filter id="neonGlowUCPink" x="-50%" y="-50%" width="200%" height="200%">
                          <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur" />
                          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                        </filter>
                        <pattern id="scanlinesUC" patternUnits="userSpaceOnUse" width="4" height="4">
                          <line x1="0" y1="0" x2="4" y2="0" stroke={theme === 'dark' ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"} strokeWidth="1" />
                        </pattern>
                      </defs>

                      <rect x="0" y="0" width="100%" height="100%" fill="url(#scanlinesUC)" rx="8" />

                      <g>
                        <text x="140" y="22" fill={theme === 'dark' ? '#666' : '#aaa'} fontSize="5" fontWeight="black" textAnchor="middle" className="uppercase tracking-[0.3em]">
                           — LIVE DATA ROUTING —
                        </text>
                        <text x="140" y="34" fill={theme === 'dark' ? '#fff' : '#000'} fontSize="7" fontWeight="bold" textAnchor="middle" className="uppercase tracking-widest">
                          {catName} ENGINE
                        </text>

                        <line x1="60" y1="75" x2="220" y2="75" stroke={theme === 'dark' ? '#222' : '#ddd'} strokeWidth="10" strokeLinecap="round" />
                        <line x1="60" y1="75" x2="220" y2="75" stroke={theme === 'dark' ? '#111' : '#eee'} strokeWidth="4" strokeLinecap="round" />

                        {hasInput && (
                          <motion.line 
                            x1="60" y1="75" x2="220" y2="75" 
                            stroke="#ff00d2" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="8 12" filter="url(#neonGlowUCPink)"
                            animate={{ strokeDashoffset: [20, 0] }}
                            transition={{ repeat: Infinity, duration: 0.6, ease: "linear" }}
                          />
                        )}

                        <motion.g initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4 }}>
                          <rect x="15" y="60" width="80" height="30" rx="15" fill={theme === 'dark' ? '#0a0a0a' : '#fff'} stroke="var(--color-accent)" strokeWidth="2" filter="url(#neonGlowUCCyan)" />
                          <text x="55" y="78" fill={theme === 'dark' ? '#fff' : '#000'} fontSize="9" fontWeight="black" textAnchor="middle">
                            {formattedInput}
                          </text>
                          <text x="55" y="102" fill="var(--color-accent)" fontSize="5" fontWeight="bold" textAnchor="middle" className="uppercase tracking-widest">
                            INPUT
                          </text>
                        </motion.g>

                        <motion.g initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4, delay: 0.1 }}>
                          <rect x="175" y="55" width="90" height="40" rx="8" fill={theme === 'dark' ? '#0a0a0a' : '#fff'} stroke={hasInput ? "#ff00d2" : (theme === 'dark' ? '#444' : '#ccc')} strokeWidth="2" filter={hasInput ? "url(#neonGlowUCPink)" : ""} />
                          
                          {hasInput ? (
                            <g>
                              <text x="220" y="78" fill="#ff00d2" fontSize="9" fontWeight="black" textAnchor="middle">
                                {finalResultStr.length > 12 ? finalResultStr.slice(0, 12) + '..' : finalResultStr}
                              </text>
                              <text x="220" y="105" fill="#ff00d2" fontSize="5" fontWeight="bold" textAnchor="middle" className="uppercase tracking-widest">
                                CONVERTED
                              </text>
                            </g>
                          ) : (
                            <g>
                              <rect x="217" y="72" width="6" height="6" fill={theme === 'dark' ? '#444' : '#ccc'} />
                              <text x="220" y="105" fill={theme === 'dark' ? '#555' : '#aaa'} fontSize="5" fontWeight="bold" textAnchor="middle" className="uppercase tracking-widest">
                                STANDBY
                              </text>
                            </g>
                          )}
                        </motion.g>
                      </g>
                    </svg>
                  );
                })()}
              </div>

              {/* Upgraded Category Grid (UNLOCKED FOR ALL USERS) */}
              <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-white/5 border-[#333]/30' : 'bg-black/5 border-[#ccc]/50'}`}>
                <span className="block mb-2 text-[10px] font-black uppercase tracking-widest text-accent opacity-80">Conversion Category</span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { val: 'len', label: 'Length', icon: <Ruler size={14}/> },
                    { val: 'area', label: 'Area', icon: <Square size={14}/> },
                    { val: 'vol', label: 'Volume', icon: <Box size={14}/> },
                    { val: 'weight', label: 'Weight', icon: <Scale size={14}/> },
                    { val: 'temp', label: 'Temp', icon: <Thermometer size={14}/> },
                    { val: 'slope', label: 'Pitch', icon: <Triangle size={14}/> },
                    { val: 'flow', label: 'Flow', icon: <Droplets size={14}/> },
                    { val: 'pressure', label: 'Pressure', icon: <Gauge size={14}/> },
                    { val: 'torque', label: 'Torque', icon: <Wrench size={14}/> }
                  ].map((cat) => (
                    <button key={cat.val} onClick={() => setUnCat(cat.val as any)}
                      className={`flex items-center justify-center gap-1.5 py-3 px-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all shadow-sm ${unCat === cat.val ? 'bg-accent text-black' : (theme === 'dark' ? 'bg-[#111] border border-[#333] text-[#888] hover:text-white hover:border-[#555]' : 'bg-white border border-[#ccc] text-[#666] hover:text-black')}`}
                    >
                      <span className={unCat === cat.val ? 'opacity-80' : 'opacity-60'}>{cat.icon}</span>
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grouped Engine Card */}
              <div className={`p-4 rounded-xl border space-y-4 ${theme === 'dark' ? 'bg-[#0a0a0a] border-[#222]' : 'bg-gray-50 border-[#ddd]'}`}>
                <div className="flex flex-col">
                  <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Converting From</span>
                  <select value={subMode} onChange={(e) => setSubMode(e.target.value)} 
                    className={`w-full border rounded-xl p-4 text-center font-bold text-lg outline-none appearance-none shadow-sm transition-colors ${theme === 'dark' ? 'bg-[#111] border-[#333] text-white focus:border-accent' : 'bg-white border-[#ccc] text-black focus:border-accent'}`}
                  >
                    {unCat === 'len' && (
                      <>
                        <option value="ft">Feet (ft)</option>
                        <option value="in">Inches (in)</option>
                        <option value="yd">Yards (yd)</option>
                        <option value="m">Meters (m)</option>
                        <option value="cm">Centimeters (cm)</option>
                        <option value="mm">Millimeters (mm)</option>
                        <option value="km">Kilometers (km)</option>
                        <option value="mi">Miles (mi)</option>
                      </>
                    )}
                    {unCat === 'area' && (
                      <>
                        <option value="ft2">Square Feet</option>
                        <option value="sq">Roofing Squares</option>
                        <option value="m2">Square Meters</option>
                        <option value="ac">Acres</option>
                        <option value="km2">Square KM</option>
                        <option value="mi2">Square Miles</option>
                        <option value="cm2">Square CM</option>
                        <option value="in2">Square Inches</option>
                      </>
                    )}
                    {unCat === 'vol' && (
                      <>
                        <option value="gal">Gallons</option>
                        <option value="l">Liters</option>
                        <option value="ft3">Cubic Feet</option>
                        <option value="fbm">Board Feet (FBM)</option>
                        <option value="m3">Cubic Meters</option>
                        <option value="yd3">Cubic Yards</option>
                      </>
                    )}
                    {unCat === 'weight' && (
                      <>
                        <option value="lb">Pounds (lbs)</option>
                        <option value="kg">Kilograms (kg)</option>
                        <option value="g">Grams (g)</option>
                        <option value="oz">Ounces (oz)</option>
                        <option value="ton">Tons (US)</option>
                        <option value="tonne">Tonnes (Metric)</option>
                        <option value="st">Stone (st)</option>
                      </>
                    )}
                    {unCat === 'temp' && (
                      <>
                        <option value="c">Celsius (°C)</option>
                        <option value="f">Fahrenheit (°F)</option>
                      </>
                    )}
                    {unCat === 'slope' && (
                      <>
                        <option value="ratio">Roof Pitch (X / 12)</option>
                        <option value="deg">Degrees (°)</option>
                        <option value="percent">Grade (%)</option>
                      </>
                    )}
                    {unCat === 'flow' && (
                      <>
                        <option value="gpm">Gallons Per Min (GPM)</option>
                        <option value="lps">Liters Per Sec (L/s)</option>
                      </>
                    )}
                    {unCat === 'pressure' && (
                      <>
                        <option value="psi">Pounds / Sq Inch (PSI)</option>
                        <option value="bar">Bar</option>
                        <option value="kpa">Kilopascals (kPa)</option>
                      </>
                    )}
                    {unCat === 'torque' && (
                      <>
                        <option value="ftlb">Foot-Pounds (Ft-lbs)</option>
                        <option value="nm">Newton Meters (Nm)</option>
                      </>
                    )}
                  </select>
                </div>

                <div className="flex flex-col pt-3 border-t border-[#333]/20 dark:border-[#ccc]/50">
                  <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Input Value</span>
                  <input type="number" value={a1} onChange={(e) => setA1(e.target.value)} placeholder="0" 
                    className={`w-full border rounded-xl p-4 text-center font-black text-3xl outline-none shadow-inner transition-colors ${theme === 'dark' ? 'bg-[#111] border-[#333] text-white focus:border-accent' : 'bg-white border-[#ccc] text-black focus:border-accent'}`} 
                  />
                </div>
              </div>

              {/* Standardized Danger Button */}
              <button onClick={() => resetTool('un')}
                className={`w-full mt-4 p-3 rounded-xl font-black tracking-widest text-[10px] uppercase active:scale-95 transition-all ${theme === 'dark' ? 'bg-[#111] border border-red-500/30 text-red-500 hover:bg-red-500/10' : 'bg-red-50 text-red-500 border border-red-200 hover:bg-red-100'}`}
              >
                Clear Converter
              </button>
            </div>
          )}

          {activeTool === 'ds' && (
            <div className="space-y-4">             
              {/* --- LIVE REFERENCE DIAGRAM --- */}
              <div className={`mb-6 flex flex-col justify-center items-center p-6 rounded-xl border shadow-inner ${theme === 'dark' ? 'bg-[#0a0a0a] border-[#222]' : 'bg-gray-50 border-[#ddd]'}`}>
                <svg viewBox="0 0 160 160" className="w-full max-w-[260px] h-auto overflow-visible transition-all duration-500">
                  <defs>
                    <filter id="neonGlowSM" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur" />
                      <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                    <pattern id="scanlinesSM" patternUnits="userSpaceOnUse" width="4" height="4">
                      <line x1="0" y1="0" x2="4" y2="0" stroke={theme === 'dark' ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"} strokeWidth="1" />
                    </pattern>
                  </defs>

                  <rect x="-10" y="-10" width="180" height="180" fill="url(#scanlinesSM)" rx="8" />

                  {(() => {
                    const subDivisor = unitMode === 'imp' ? 12 : 100;
                    
                    const ftA = parseFloat(a1) || 0;
                    const inA = parseFloat(a2) || 0;
                    const fracA = parseFloat(a4) ? (parseFloat(a3) || 0) / parseFloat(a4) : 0;
                    const spanVal = ftA + (inA + fracA) / subDivisor;
                    
                    const ftB = parseFloat(b1) || 0;
                    const inB = parseFloat(b2) || 0;
                    const fracB = parseFloat(b4) ? (parseFloat(b3) || 0) / parseFloat(b4) : 0;
                    const secVal = ftB + (inB + fracB) / subDivisor;

                    const formatLen = (valInFt: number) => {
                      if (unitMode === 'met') return `${valInFt.toFixed(2)}m`;
                      const totalInches = Math.round(valInFt * 12);
                      if (totalInches === 0) return '0"';
                      if (totalInches < 24) return `${totalInches}"`; 
                      const f = Math.floor(totalInches / 12);
                      const i = totalInches % 12;
                      return i > 0 ? `${f}' ${i}"` : `${f}'`;
                    };

                    const isJoist = subMode === 'joist';
                    const isRafter = subMode === 'rafter';
                    const isHeader = subMode === 'header';
                    const isBeam = subMode === 'beam';

                    let s1X = 25, s1Y = 80, s1W = 15, s1H = 35;
                    let s2X = 110, s2Y = 80, s2W = 15, s2H = 35;
                    let mX = 15, mY = 65, mW = 120, mH = 15, mD = 5;
                    let showUniformLoad = true;
                    let rot = 0;

                    // Rafter Specific Geometry
                    let rafPath = "";
                    let ptch = 6;
                    let runPx = 100;
                    let rTopX = 135;
                    let rTopY = 30;

                    if (isJoist) {
                      mH = 12; mD = 3; 
                      if (secVal > 0) { s1X = 50; mX = 15; mW = 120; } 
                      else { s1X = 20; mX = 15; mW = 120; }
                    } else if (isRafter) {
                      ptch = parseFloat(qty3) || 6;
                      const aRad = Math.atan(ptch / 12);
                      
                      runPx = 90;
                      const risePx = runPx * (ptch / 12);
                      const depthPx = 10; 
                      const plumbCutL = depthPx / Math.cos(aRad);
                      
                      // Rafter Polygon Points
                      const rBotX = rTopX - runPx;
                      const rBotY = rTopY + risePx;
                      const rBotLeftX = rBotX;
                      const rBotLeftY = rBotY + plumbCutL;
                      const rTopLeftX = rTopX;
                      const rTopLeftY = rTopY + plumbCutL;
                      
                      rafPath = `M ${rTopX},${rTopY} L ${rBotX},${rBotY} L ${rBotLeftX},${rBotLeftY} L ${rTopLeftX},${rTopLeftY} Z`;
                    } else if (isHeader) {
                      mH = 22; mD = 5; 
                      s1W = 10; s1H = 40; s2W = 10; s2H = 40;
                      s1X = 25; s2X = 115;
                      mX = 25; mW = 100; mY = 58; 
                      showUniformLoad = headerWallType !== 'non-load';
                    } else if (isBeam) {
                      mH = 28; mD = 8; 
                      s1W = 18; s1H = 30; s2W = 18; s2H = 30;
                      s1X = 18; s2X = 114;
                      mX = 10; mW = 130; mY = 52;
                    }

                    const draw3DLumber = (x: number, y: number, w: number, h: number, d: number, color: string, isGlowing: boolean, delay: number, rotation: number = 0) => (
                      <motion.g initial={{ opacity: 0, y: -10, rotate: rotation }} animate={{ opacity: 1, y: 0, rotate: rotation }} transition={{ duration: 0.5, delay, type: "spring", stiffness: 120 }} style={{ transformOrigin: `${x}px ${y}px` }}>
                        <rect x={x} y={y} width={w} height={h} fill={isGlowing ? color : 'none'} stroke={color} strokeWidth="1" filter={isGlowing ? "url(#neonGlowSM)" : ""} opacity={isGlowing ? 0.2 : 1} />
                        <rect x={x} y={y} width={w} height={h} fill="none" stroke={color} strokeWidth="1.2" />
                        <polygon points={`${x+w},${y} ${x+w+d},${y-d} ${x+w+d},${y+h-d} ${x+w},${y+h}`} fill={color} opacity="0.3" stroke={color} strokeWidth="0.5" />
                        <polygon points={`${x},${y} ${x+d},${y-d} ${x+w+d},${y-d} ${x+w},${y}`} fill={color} opacity="0.6" stroke={color} strokeWidth="0.5" />
                      </motion.g>
                    );

                    return (
                      <g>
                        {/* --- STRUCTURAL SUPPORTS --- */}
                        {!isRafter && draw3DLumber(s1X, s1Y, s1W, s1H, mD, theme === 'dark' ? '#555' : '#aaa', false, 0)}
                        {!isRafter && draw3DLumber(s2X, s2Y, s2W, s2H, mD, theme === 'dark' ? '#555' : '#aaa', false, 0.1)}

                        {/* --- MAIN SPANNING MEMBER --- */}
                        {!isRafter && draw3DLumber(mX, mY, mW, mH, mD, "var(--color-accent)", true, 0.2, rot)}

                        {/* --- RAFTER SPECIFIC POLYGON --- */}
                        {isRafter && (
                          <motion.g initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 120 }}>
                            <path d={rafPath} fill="var(--color-accent)" opacity="0.2" filter="url(#neonGlowSM)" />
                            <path d={rafPath} fill="none" stroke="var(--color-accent)" strokeWidth="1.5" />
                            {/* CRITICAL FIX: Moved Pitch Indicator to Top Left */}
                            <g transform={`translate(10, 10)`}>
                              <line x1="0" y1="15" x2="15" y2="15" stroke="#ff00d2" strokeWidth="1" />
                              <line x1="15" y1="15" x2="15" y2={15 - 15*(ptch/12)} stroke="#ff00d2" strokeWidth="1" />
                              <line x1="0" y1="15" x2="15" y2={15 - 15*(ptch/12)} stroke="#ff00d2" strokeWidth="1" />
                              <text x="7.5" y="22" fill="#ff00d2" fontSize="5" fontWeight="black" textAnchor="middle">{ptch}/12</text>
                            </g>
                          </motion.g>
                        )}

                        {/* --- DYNAMIC PHYSICS/LOAD INDICATORS --- */}
                        {showUniformLoad && !isRafter && (
                          <g>
                            {[s1X + 15, 75, s2X - 5].map((ax, i) => (
                              <motion.g key={ax} initial={{ opacity: 0, y: -10 }} animate={{ opacity: [0.3, 1, 0.3], y: [0, 5, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 + (i * 0.2) }}>
                                <line x1={ax} y1="25" x2={ax} y2="40" stroke={theme === 'dark' ? '#fff' : '#000'} strokeWidth="1.5" />
                                <polygon points={`${ax-3},36 ${ax+3},36 ${ax},43`} fill={theme === 'dark' ? '#fff' : '#000'} />
                              </motion.g>
                            ))}
                            <motion.text x="75" y="18" fill={theme === 'dark' ? '#fff' : '#000'} fontSize="6" fontWeight="bold" textAnchor="middle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
                              Uniform Load (Deflection)
                            </motion.text>
                          </g>
                        )}

                        {/* Rafter Snow Load Indicator */}
                        {isRafter && (
                          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
                            <line x1={rTopX - runPx/2} y1="5" x2={rTopX - runPx/2} y2={rTopY + (runPx/2)*(ptch/12) - 5} stroke={theme === 'dark' ? '#fff' : '#000'} strokeWidth="1" strokeDasharray="2,2"/>
                            <polygon points={`${rTopX - runPx/2 - 2},${rTopY + (runPx/2)*(ptch/12) - 8} ${rTopX - runPx/2 + 2},${rTopY + (runPx/2)*(ptch/12) - 8} ${rTopX - runPx/2},${rTopY + (runPx/2)*(ptch/12) - 3}`} fill={theme === 'dark' ? '#fff' : '#000'} />
                            <text x={rTopX - runPx/2} y="3" fill={theme === 'dark' ? '#fff' : '#000'} fontSize="6" fontWeight="bold" textAnchor="middle">Snow Load</text>
                          </motion.g>
                        )}

                        {/* --- DIMENSION LINES --- */}
                        {!isRafter && (
                          <g>
                            <motion.line x1={s1X + s1W} y1={s1Y + 25} x2={s2X} y2={s1Y + 25} stroke="#ff00d2" strokeWidth="1.5" filter="url(#neonGlowSM)" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.6, delay: 0.6 }} style={{ transformOrigin: "left" }} />
                            <motion.line x1={s1X + s1W} y1={s1Y + 18} x2={s1X + s1W} y2={s1Y + 32} stroke="#ff00d2" strokeWidth="1.5" initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.3, delay: 1 }} style={{ transformOrigin: "center" }}/>
                            <motion.line x1={s2X} y1={s1Y + 18} x2={s2X} y2={s1Y + 32} stroke="#ff00d2" strokeWidth="1.5" initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.3, delay: 1 }} style={{ transformOrigin: "center" }}/>
                            <motion.text x={75} y={s1Y + 40} fill="#ff00d2" fontSize="7.5" fontWeight="black" textAnchor="middle" className="cursor-pointer hover:fill-accent transition-colors" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} onClick={() => document.getElementById('input-ds-span')?.focus()}>
                              {spanVal > 0 ? `Span: ${formatLen(spanVal)}` : (isHeader ? 'Opening Width' : 'Clear Span')}
                            </motion.text>
                          </g>
                        )}

                        {isRafter && (
                          <g>
                            {/* CRITICAL FIX: Modernized Rafter Span Label to Bottom Center with Arrows */}
                            <motion.line x1={rTopX - runPx} y1="130" x2={rTopX} y2="130" stroke="#ff00d2" strokeWidth="1.5" filter="url(#neonGlowSM)" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.6, delay: 0.6 }} style={{ transformOrigin: "left" }} />
                            {/* Left Arrow head */}
                            <polygon points={`${rTopX-runPx+10},126 ${rTopX-runPx+10},134 ${rTopX-runPx},130`} fill="#ff00d2" />
                            {/* Right Arrow head */}
                            <polygon points={`${rTopX-10},126 ${rTopX-10},134 ${rTopX},130`} fill="#ff00d2" />
                            
                            {/* Dashed drop-lines */}
                            <motion.line x1={rTopX - runPx} y1={rTopY + runPx*(ptch/12) + 10} x2={rTopX - runPx} y2="128" stroke={theme === 'dark' ? '#555' : '#aaa'} strokeWidth="1" strokeDasharray="2,2"/>
                            <motion.line x1={rTopX} y1={rTopY + 15} x2={rTopX} y2="128" stroke={theme === 'dark' ? '#555' : '#aaa'} strokeWidth="1" strokeDasharray="2,2"/>
                            
                            {/* Span Text in the center bottom */}
                            <motion.text x={rTopX - runPx/2} y="142" fill="#ff00d2" fontSize="7.5" fontWeight="black" textAnchor="middle" className="cursor-pointer hover:fill-accent transition-colors" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} onClick={() => document.getElementById('input-ds-span')?.focus()}>
                              {spanVal > 0 ? `Span (Run): ${formatLen(spanVal)}` : 'Horizontal Span'}
                            </motion.text>
                          </g>
                        )}

                        {/* Secondary Detail Labels */}
                        {isJoist && secVal > 0 && (
                          <motion.text x={25} y={s1Y + 40} fill="var(--color-accent)" fontSize="6" fontWeight="bold" textAnchor="middle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }} className="cursor-pointer" onClick={() => document.getElementById('input-ds-sec')?.focus()}>
                            Cantilever: {formatLen(secVal)}
                          </motion.text>
                        )}
                        {isRafter && secVal > 0 && (
                          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}>
                            <line x1={rTopX - runPx - 20} y1="130" x2={rTopX - runPx} y2="130" stroke="var(--color-accent)" strokeWidth="1" strokeDasharray="2,2"/>
                            <text x={rTopX - runPx - 10} y="140" fill="var(--color-accent)" fontSize="6" fontWeight="bold" textAnchor="middle" className="cursor-pointer hover:text-white" onClick={() => document.getElementById('input-ds-sec')?.focus()}>
                              Tail: {formatLen(secVal)}
                            </text>
                          </motion.g>
                        )}

                        {isBeam && (
                          <motion.text x="75" y="145" fill={theme === 'dark' ? '#fff' : '#000'} fontSize="6.5" fontWeight="bold" textAnchor="middle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }} className="cursor-pointer hover:fill-accent" onClick={() => document.getElementById('input-ds-sec')?.focus()}>
                            {secVal > 0 ? `Trib Width: ${formatLen(secVal)}` : 'Tributary Width'}
                          </motion.text>
                        )}

                        <text x="140" y="145" fill={theme === 'dark' ? '#555' : '#999'} fontSize="5" fontWeight="black" textAnchor="end" className="uppercase tracking-widest">
                          {isJoist ? 'Floor System' : (isRafter ? 'Roof System' : (isHeader ? 'Wall Header' : 'Drop Beam'))}
                        </text>
                      </g>
                    );
                  })()}
                </svg>
                
                <span className="text-[8px] text-[#888] italic px-2 text-center mt-2 font-medium opacity-80 leading-relaxed block max-w-[260px] mx-auto">
                  *Diagram is for conceptual layout reference only. Always verify structural loads and span requirements with your local building codes.
                </span>
              </div>
              {/* --- END OF LIVE REFERENCE DIAGRAM --- */}
              
              <div className={`flex gap-1 p-1 rounded-xl border ${theme === 'dark' ? 'bg-[#333]/20 border-[#444]/30' : 'bg-gray-200/50 border-[#ddd]'}`}>
                {(['joist', 'rafter', 'header', 'beam'] as const).map((cat) => (
                  <button key={cat} onClick={() => setSubMode(cat)}
                    className={`flex-1 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${subMode === cat ? 'bg-accent text-black shadow-md' : 'text-[#888] hover:text-current'}`}
                  >
                    {cat}s
                  </button>
                ))}
              </div>

              <div className={`p-4 rounded-xl border space-y-3 ${theme === 'dark' ? 'bg-white/5 border-[#333]/30' : 'bg-black/5 border-[#ccc]/50'}`}>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col">
                    <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Material Species</span>
                    <select value={woodSpecies} onChange={(e) => setWoodSpecies(e.target.value as any)} 
                      className={`w-full border rounded-xl p-3 text-center font-bold text-sm outline-none appearance-none shadow-sm transition-colors ${theme === 'dark' ? 'bg-[#111] border-[#222] text-white focus:border-accent' : 'bg-gray-50 border-[#ccc] text-black focus:border-accent'}`}
                    >
                      <option value="spf">SPF #2</option>
                      <option value="syp">Southern Pine</option>
                      <option value="fir">Douglas Fir</option>
                      <option value="i-joist">Wood I-Joist</option>
                      <option value="lvl">LVL Engineered</option>
                    </select>
                  </div>

                  {(subMode === 'joist' || subMode === 'rafter') && (
                    <div className="flex flex-col">
                      <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Spacing</span>
                      <select value={ocSpacing} onChange={(e) => setOcSpacing(e.target.value)} 
                        className={`w-full border rounded-xl p-3 text-center font-bold text-sm outline-none appearance-none shadow-sm transition-colors ${theme === 'dark' ? 'bg-[#111] border-[#222] text-white focus:border-accent' : 'bg-gray-50 border-[#ccc] text-black focus:border-accent'}`}
                      >
                        <option value="12">12” OC</option>
                        <option value="16">16” OC</option>
                        <option value="24">24” OC</option>
                      </select>
                    </div>
                  )}
                  
                  {subMode === 'header' && (
                    <div className="flex flex-col">
                      <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Load Type</span>
                      <select value={headerWallType} onChange={(e) => setHeaderWallType(e.target.value as any)} 
                        className={`w-full border rounded-xl p-3 text-center font-bold text-sm outline-none appearance-none shadow-sm transition-colors ${theme === 'dark' ? 'bg-[#111] border-[#222] text-white focus:border-accent' : 'bg-gray-50 border-[#ccc] text-black focus:border-accent'}`}
                      >
                        <option value="non-load">Non-Load</option>
                        <option value="roof-only">Load (Roof)</option>
                        <option value="floor-only">Load (Floor)</option>
                        <option value="full-load">Full (Flr+Roof)</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>

              <div className={`p-4 rounded-xl border space-y-4 ${theme === 'dark' ? 'bg-white/5 border-[#333]/30' : 'bg-black/5 border-[#ccc]/50'}`}>
                
                {subMode === 'joist' && (
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-accent opacity-80">Joist Parameters</h3>
                    
                    <div id="input-ds-sec">
                      <InputRow label="Cantilever Distance (Optional)" v1={b1} v2={b2} v3={b3} v4={b4} setV1={setB1} setV2={setB2} setV3={setB3} setV4={setB4} mode={unitMode} theme={theme} onFocus={setActiveInput} {...getUnitProps('b')}/>
                    </div>

                    <div className="flex flex-col">
                      <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Deflection Rating</span>
                      <select value={deflectionLimit} onChange={(e) => setDeflectionLimit(e.target.value as any)} 
                        className={`w-full border rounded-xl p-4 text-center font-bold text-sm outline-none appearance-none shadow-sm transition-colors ${theme === 'dark' ? 'bg-[#111] border-[#222] text-white focus:border-accent' : 'bg-gray-50 border-[#ccc] text-black focus:border-accent'}`}
                      >
                        <option value="L360">L/360 (Standard)</option>
                        <option value="L480">L/480 (Stiff Floor)</option>
                        <option value="L600">L/600 (Luxury/Tile)</option>
                      </select>
                    </div>
                  </div>
                )}

                {subMode === 'rafter' && (
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-accent opacity-80">Roof Parameters</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col">
                        <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Roof Pitch</span>
                        <select value={qty3} onChange={(e) => setQty3(e.target.value)} 
                          className={`w-full border rounded-xl p-3 text-center font-bold text-sm outline-none appearance-none shadow-sm transition-colors ${theme === 'dark' ? 'bg-[#111] border-[#222] text-white focus:border-accent' : 'bg-gray-50 border-[#ccc] text-black focus:border-accent'}`}
                        >
                          {[2,3,4,5,6,7,8,9,10,12].map(p => <option key={p} value={p}>{p}/12 Pitch</option>)}
                        </select>
                      </div>
                      <div className="flex flex-col">
                        <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666] invisible">Info</span>
                        <div className="h-full flex items-center justify-center p-2 border border-[#333]/20 rounded-xl bg-black/5 dark:bg-white/5">
                           <span className="text-[9px] uppercase font-bold text-[#888] text-center leading-tight">Snow loads auto-calc'd below</span>
                        </div>
                      </div>
                    </div>
                    <div id="input-ds-sec">
                      <InputRow label="Tail/Overhang Distance (Optional)" v1={b1} v2={b2} v3={b3} v4={b4} setV1={setB1} setV2={setB2} setV3={setB3} setV4={setB4} mode={unitMode} theme={theme} onFocus={setActiveInput} {...getUnitProps('b')}/>
                    </div>
                  </div>
                )}

                {subMode === 'header' && (
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-accent opacity-80">Header Geometry</h3>
                    <div id="input-ds-span">
                      <InputRow label="Clear Opening Width" v1={a1} v2={a2} v3={a3} v4={a4} setV1={setA1} setV2={setA2} setV3={setA3} setV4={setA4} mode={unitMode} theme={theme} onFocus={setActiveInput} {...getUnitProps('a')}/>
                    </div>
                    <button onClick={() => setHasHeaderPointLoad(!hasHeaderPointLoad)} 
                      className={`w-full p-3 rounded-xl font-black tracking-widest text-[10px] uppercase transition-all shadow-sm ${hasHeaderPointLoad ? 'bg-red-500/10 border border-red-500/50 text-red-500' : (theme === 'dark' ? 'bg-[#111] border border-[#333] text-[#888]' : 'bg-white border border-[#ccc] text-[#888]')}`}
                    >
                      {hasHeaderPointLoad ? 'Post Bearing On Header: YES' : 'Post Bearing On Header?'}
                    </button>
                  </div>
                )}

                {subMode === 'beam' && (
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-accent opacity-80">Beam Engineering</h3>
                    
                    <div id="input-ds-sec">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="block text-[0.65rem] font-black uppercase text-[#666]">Tributary Width</span>
                        <button 
                          onClick={() => alert("TRIBUTARY WIDTH:\n\nThe total width of the floor or roof area that rests directly on this beam.\n\nCalculation: Measure the distance to the next support beam on the left, and divide by 2. Do the same for the right. Add those two numbers together.")}
                          className="text-accent hover:scale-110 active:scale-95 transition-all p-1"
                        >
                          <Info size={14} strokeWidth={2.5} />
                        </button>
                      </div>
                      <InputRow label="" v1={b1} v2={b2} v3={b3} v4={b4} setV1={setB1} setV2={setB2} setV3={setB3} setV4={setB4} mode={unitMode} theme={theme} onFocus={setActiveInput} {...getUnitProps('b')}/>
                    </div>

                    <div id="input-ds-span">
                      <InputRow label="Clear Beam Span" v1={a1} v2={a2} v3={a3} v4={a4} setV1={setA1} setV2={setA2} setV3={setA3} setV4={setA4} mode={unitMode} theme={theme} onFocus={setActiveInput} {...getUnitProps('a')}/>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <button onClick={() => setisWetService(!isWetService)} 
                  className={`flex-1 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all ${isWetService ? 'bg-accent text-black shadow-md' : (theme === 'dark' ? 'bg-[#111] border border-[#333] text-[#888]' : 'bg-white border border-[#ccc] text-[#666]')}`}>Wet Use</button>
                <button onClick={() => setisMarine(!isMarine)} 
                  className={`flex-1 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all ${isMarine ? 'bg-accent text-black shadow-md' : (theme === 'dark' ? 'bg-[#111] border border-[#333] text-[#888]' : 'bg-white border border-[#ccc] text-[#666]')}`}>Marine</button>
                <button onClick={() => setwoodGrade(woodGrade === 'no2' ? 'select' : 'no2')} 
                  className={`flex-1 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all ${woodGrade === 'select' ? 'bg-accent text-black shadow-md' : (theme === 'dark' ? 'bg-[#111] border border-[#333] text-[#888]' : 'bg-white border border-[#ccc] text-[#666]')}`}>Select</button>
              </div>

              <button onClick={() => resetTool('ds')}
                className={`w-full mt-4 p-3 rounded-xl font-black tracking-widest text-[10px] uppercase active:scale-95 transition-all ${theme === 'dark' ? 'bg-[#111] border border-red-500/30 text-red-500 hover:bg-red-500/10' : 'bg-red-50 text-red-500 border border-red-200 hover:bg-red-100'}`}
              >
                Clear Span Tool
              </button>

              {/* UPGRADED SEGMENTED LIVE TEXT OUTPUT LIST */}
              {results.main && (
                <div className={`mt-6 pt-5 border-t w-full ${theme === 'dark' ? 'border-[#222]/40' : 'border-[#ddd]'}`}>
                  {results.sub && results.sub.length > 0 && (
                    <div className="space-y-1.5">
                      {results.sub.map((item: any, idx: number) => {
                        const isHeader = item.label.includes('---');
                        const isWarning = item.warning;

                        if (isWarning) {
                          return (
                            <div key={idx} className="flex justify-between items-center p-3 my-2 rounded-xl bg-red-500/10 border border-red-500/30 text-xs">
                              <span className="text-red-500 font-bold uppercase tracking-wide">{item.label}</span>
                              <span className="text-red-500 font-mono font-black text-right">{item.value}</span>
                            </div>
                          );
                        }

                        return (
                          <div 
                            key={idx} 
                            className={`flex justify-between items-center py-2.5 px-3 rounded-lg transition-colors ${
                              isHeader 
                                ? 'mt-4 mb-1 border-none bg-accent/10 dark:bg-accent/5' 
                                : theme === 'dark' ? 'border-b border-[#222]/40 hover:bg-white/[0.02]' : 'border-b border-[#ddd]/60 hover:bg-black/[0.02]'
                            }`}
                          >
                            <span className={`${
                              isHeader 
                                ? 'text-accent font-black uppercase tracking-widest text-[10px]' 
                                : `text-xs opacity-80 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`
                            }`}>
                              {item.label.replace(/-/g, '').trim()}
                            </span>
                            
                            {!isHeader && (
                              <span className={`font-bold font-mono text-right ${
                                item.highlight 
                                  ? 'text-accent text-sm tracking-wide font-black' 
                                  : theme === 'dark' ? 'text-white text-xs' : 'text-black text-xs'
                              }`}>
                                {item.value}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              <Disclaimer />
            </div>
          )}
					
          {activeTool === 'rm' && (
            <div className="space-y-4">
              
							{/* --- UPGRADED LIVE DYNAMIC DIAGRAM --- */}
              <div className={`mb-6 flex justify-center items-center p-6 rounded-xl border shadow-inner overflow-hidden ${theme === 'dark' ? 'bg-[#0a0a0a] border-[#222]' : 'bg-gray-50 border-[#ddd]'}`}>
                {(() => {
                  const currentShape = rmType || 'rect'; 

                  // 1. Math Engine: Safely compile feet, inches, and fractions for labels
                  const subDivisor = unitMode === 'imp' ? 12 : 100;
                  
                  // Base (A)
                  const ftA = parseFloat(a1) || 0;
                  const inA = parseFloat(a2) || 0;
                  const fracA = parseFloat(a4) ? (parseFloat(a3) || 0) / parseFloat(a4) : 0;
                  const valA = ftA + (inA + fracA) / subDivisor;
                  const rawBase = valA > 0 ? valA : 20;

                  // Run (B)
                  const ftB = parseFloat(b1) || 0;
                  const inB = parseFloat(b2) || 0;
                  const fracB = parseFloat(b4) ? (parseFloat(b3) || 0) / parseFloat(b4) : 0;
                  const valB = ftB + (inB + fracB) / subDivisor;
                  const rawRun = valB > 0 ? valB : 8;

                  // Top (C) (Only used for Trapezoid)
                  const ftC = parseFloat(c1) || 0;
                  const inC = parseFloat(c2) || 0;
                  const fracC = parseFloat(c4) ? (parseFloat(c3) || 0) / parseFloat(c4) : 0;
                  const valC = ftC + (inC + fracC) / subDivisor;
                  const rawTop = valC > 0 ? valC : 6;

                  const pitch = includePitch ? (parseFloat(rmPitch) || 0) : 0; 

                  // Formatted Labels
                  const baseLabel = currentShape === 'tri' ? 'Base Width' : 'Bottom Width';
                  const runLabel = currentShape === 'rect' ? 'Length (Run)' : 'Height (Run)';
                  
                  const displayBase = valA > 0 
                    ? (unitMode === 'imp' ? `Base: ${a1 || 0}' ${a2 || 0}${a3 && a4 ? ` ${a3}/${a4}` : ''}"` : `Base: ${valA.toFixed(2)} m`)
                    : baseLabel;
                    
                  const displayRun = valB > 0 
                    ? (unitMode === 'imp' ? `Run: ${b1 || 0}' ${b2 || 0}${b3 && b4 ? ` ${b3}/${b4}` : ''}"` : `Run: ${valB.toFixed(2)} m`)
                    : runLabel;
                    
                  const displayTop = valC > 0 
                    ? (unitMode === 'imp' ? `Top: ${c1 || 0}' ${c2 || 0}${c3 && c4 ? ` ${c3}/${c4}` : ''}"` : `Top: ${valC.toFixed(2)} m`)
                    : 'Top Width';

                  // 2. Visual Scale Engine
                  const maxW = currentShape === 'trap' ? Math.max(rawBase, rawTop) : rawBase;
                  const maxDim = Math.max(maxW, rawRun);
                  
                  // UPGRADE: Increased scale to fill out the horizontal width better
                  const scale = 110 / (maxDim || 1); 

                  const vBase = rawBase * scale;
                  const vRun = rawRun * scale;
                  const vTop = rawTop * scale;

                  const cx = 75; // Shifted left to make room for pitch indicator
                  const cy = 80;
                  const bottomY = cy + vRun / 2;
                  const topY = cy - vRun / 2;

                  // Generate the exact SVG Path based on selected shape
                  let planePath = "";
                  if (currentShape === 'tri') {
                    planePath = `M ${cx - vBase/2},${bottomY} L ${cx + vBase/2},${bottomY} L ${cx},${topY} Z`;
                  } else if (currentShape === 'trap') {
                    planePath = `M ${cx - vBase/2},${bottomY} L ${cx + vBase/2},${bottomY} L ${cx + vTop/2},${topY} L ${cx - vTop/2},${topY} Z`;
                  } else {
                    planePath = `M ${cx - vBase/2},${bottomY} L ${cx + vBase/2},${bottomY} L ${cx + vBase/2},${topY} L ${cx - vBase/2},${topY} Z`;
                  }

                  // Mini Pitch Triangle Math
                  const pBase = 15;
                  const pRise = (pitch / 12) * pBase;
                  const px = cx + (maxW * scale) / 2 + 10; // Dynamically float next to the roof shape
                  const py = Math.min(topY + 15, 60);  

                  // UPGRADE: DYNAMIC VIEWBOX CALCULATION
                  // Calculates the exact top and bottom boundaries of the active render to crop empty space
                  const vbTop = Math.min(topY - 20, includePitch ? py - pRise - 15 : topY - 20);
                  const vbBottom = bottomY + 25;
                  const vbHeight = Math.max(vbBottom - vbTop, 80); // Ensure it's never too skinny

                  return (
                    // The SVG now uses our dynamic vbTop and vbHeight calculations!
                    <svg viewBox={`0 ${vbTop} 160 ${vbHeight}`} className="w-full max-w-[240px] h-auto overflow-visible transition-all duration-500">
                      <defs>
                        <filter id="neonGlowRO" x="-50%" y="-50%" width="200%" height="200%">
                          <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur" />
                          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                        </filter>
                        <pattern id="scanlinesRO" patternUnits="userSpaceOnUse" width="4" height="4">
                          <line x1="0" y1="0" x2="4" y2="0" stroke={theme === 'dark' ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"} strokeWidth="1" />
                        </pattern>
                      </defs>

                      {/* Massive background rect to ensure grid never clips regardless of viewBox */}
                      <rect x="-100" y="-100" width="400" height="400" fill="url(#scanlinesRO)" rx="8" />

                      <g>
                        {/* --- THE SHAPE-SHIFTING ROOF PLANE --- */}
                        <motion.path 
                          key={`fill-${currentShape}`} 
                          d={planePath} 
                          fill="var(--color-accent)" opacity="0.1" 
                          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 0.1, scale: 1, d: planePath }} 
                          transition={{ duration: 0.3 }} 
                        />
                        
                        <motion.path 
                          key={`stroke-${currentShape}`} 
                          d={planePath} 
                          fill="none" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinejoin="round" filter="url(#neonGlowRO)"
                          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1, d: planePath }} 
                          transition={{ duration: 0.3 }} 
                        />

                        {/* --- ISOLATED PITCH INDICATOR --- */}
                        {includePitch && (
                          <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                            <line x1={px} y1={py} x2={px + pBase} y2={py} stroke="#ff00d2" strokeWidth="1.5" filter="url(#neonGlowRO)" />
                            <line x1={px} y1={py} x2={px + pBase} y2={py - pRise} stroke="#ff00d2" strokeWidth="1.5" filter="url(#neonGlowRO)" />
                            <line x1={px + pBase} y1={py} x2={px + pBase} y2={py - pRise} stroke="#ff00d2" strokeWidth="1.5" strokeDasharray="1,1" />
                            
                            <text x={px + (pBase/2)} y={py + 8} fill="#ff00d2" fontSize="5.5" fontWeight="black" textAnchor="middle">
                              {pitch > 0 ? `${pitch}/12 Pitch` : 'Pitch'}
                            </text>
                          </motion.g>
                        )}

                        {/* --- INTERACTIVE LABELS --- */}
                        <text x={cx} y={bottomY + 12} fill={theme === 'dark' ? '#fff' : '#000'} fontSize="7.5" fontWeight="bold" textAnchor="middle" className="cursor-pointer hover:fill-accent" onClick={() => document.getElementById('input-ro-base')?.focus()}>
                          {displayBase}
                        </text>
                        
                        <text x={cx - (vBase)/2 - 8} y={cy} fill={theme === 'dark' ? '#fff' : '#000'} fontSize="7.5" fontWeight="bold" textAnchor="middle" transform={`rotate(-90 ${cx - (vBase)/2 - 8} ${cy})`} className="cursor-pointer hover:fill-accent" onClick={() => document.getElementById('input-ro-run')?.focus()}>
                          {displayRun}
                        </text>

                        {currentShape === 'trap' && (
                          <text x={cx} y={topY - 6} fill={theme === 'dark' ? '#fff' : '#000'} fontSize="7.5" fontWeight="bold" textAnchor="middle" className="cursor-pointer hover:fill-accent" onClick={() => document.getElementById('input-ro-top')?.focus()}>
                            {displayTop}
                          </text>
                        )}
                      </g>
                    </svg>
                  );
                })()}
              </div>
              {/* --- END OF UPGRADED LIVE DYNAMIC DIAGRAM --- */}
							
              {/* --- DYNAMIC CALCULATION MODE TOGGLE --- */}
              <div className={`flex items-center justify-between mb-4 p-4 rounded-xl border ${theme === 'dark' ? 'bg-[#111] border-[#333]' : 'bg-gray-50 border-[#ccc]'}`}>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#888]">Calculation Mode</span>
                    <button onClick={() => alert("True Measurements calculates the flat 2D footprint.\n\nInclude Pitch calculates the actual angled roof surface area.")} className="text-accent"><Info size={12}/></button>
                  </div>
                  <span className={`text-sm font-bold transition-colors ${includePitch ? 'text-accent' : (theme === 'dark' ? 'text-white' : 'text-black')}`}>
                    {includePitch ? 'Include Pitch Area' : 'True Measurements (2D)'}
                  </span>
                </div>
                <button 
                  onClick={() => setIncludePitch(!includePitch)} 
                  className={`relative w-12 h-6 rounded-full transition-colors duration-300 ease-in-out ${includePitch ? 'bg-accent' : (theme === 'dark' ? 'bg-[#444]' : 'bg-gray-300')}`}
                >
                  <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ease-in-out ${includePitch ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* --- SHAPE SELECTOR --- */}
              <div className="flex flex-col mb-2">
                <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Add Roof Plane</span>
                <div className={`flex gap-1 p-1 rounded-xl border ${theme === 'dark' ? 'bg-[#333]/20 border-[#444]/30' : 'bg-gray-200/50 border-[#ddd]'}`}>
                  {(['rect', 'tri', 'trap'] as const).map((t) => (
                    <button key={t} onClick={() => setRmType(t)}
                      className={`flex-1 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${rmType === t ? 'bg-accent text-black shadow-md' : 'text-[#888] hover:text-current'}`}
                    >
                      {t === 'rect' ? 'Rectangle' : t === 'tri' ? 'Triangle' : 'Trapezoid'}
                    </button>
                  ))}
                </div>
              </div>

              {/* --- PRIMARY DIMENSIONS --- */}
              <div className={`p-4 rounded-xl border space-y-3 ${theme === 'dark' ? 'bg-white/5 border-[#333]/30' : 'bg-black/5 border-[#ccc]/50'}`}>
                <div id="input-rm-bot">
                  <InputRow label={rmType === 'tri' ? "Base Width" : "Bottom Width"} v1={a1} v2={a2} v3={a3} v4={a4} setV1={setA1} setV2={setA2} setV3={setA3} setV4={setA4} mode={unitMode} theme={theme} onFocus={setActiveInput} {...getUnitProps('a')}/>
                </div>
                
                {rmType === 'trap' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} id="input-rm-top">
                    <InputRow label="Top Width" v1={c1} v2={c2} v3={c3} v4={c4} setV1={setC1} setV2={setC2} setV3={setC3} setV4={setC4} mode={unitMode} theme={theme} onFocus={setActiveInput} {...getUnitProps('c')}/>
                  </motion.div>
                )}

                <div id="input-rm-run">
                  <InputRow label={rmType === 'rect' ? "Length (Run)" : "Height (Run)"} v1={b1} v2={b2} v3={b3} v4={b4} setV1={setB1} setV2={setB2} setV3={setB3} setV4={setB4} mode={unitMode} theme={theme} onFocus={setActiveInput} {...getUnitProps('b')}/>
                </div>
              </div>

              {/* --- SECONDARY MODIFIERS (Pitch & Count) --- */}
              <div className="grid grid-cols-2 gap-3 mt-3">
                {includePitch ? (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col" id="input-rm-pitch">
                    <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#ff00d2]">Roof Pitch (/12)</span>
                    <input type="number" value={rmPitch} onChange={(e) => setRmPitch(e.target.value)} placeholder="0" 
                      className={`w-full border rounded-xl p-4 text-center font-black text-lg outline-none transition-colors shadow-sm ${theme === 'dark' ? 'bg-[#111] border-[#ff00d2]/50 text-white focus:border-[#ff00d2]' : 'bg-white border-[#ff00d2]/50 text-black focus:border-[#ff00d2]'}`} 
                    />
                  </motion.div>
                ) : (
                  <div className="flex flex-col opacity-50 pointer-events-none">
                    <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Roof Pitch (/12)</span>
                    <div className={`w-full border rounded-xl p-4 flex items-center justify-center ${theme === 'dark' ? 'bg-[#111] border-[#222]' : 'bg-gray-100 border-[#ddd]'}`}>
                      <span className="text-[10px] font-bold text-[#888] uppercase">Disabled (2D Mode)</span>
                    </div>
                  </div>
                )}
                
                <div className="flex flex-col">
                  <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Count</span>
                  <input type="number" value={rmQty} onChange={(e) => setRmQty(e.target.value)} placeholder="1" 
                    className={`w-full border rounded-xl p-4 text-center font-black text-lg outline-none transition-colors shadow-sm ${theme === 'dark' ? 'bg-[#111] border-[#222] text-white focus:border-accent' : 'bg-white border-[#ccc] text-black focus:border-accent'}`} 
                  />
                </div>

                <button onClick={addRoofSection} className="w-full mt-2 bg-accent text-black p-4 rounded-xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all shadow-[0_0_15px_rgba(0,210,255,0.3)] hover:brightness-110 flex items-center justify-center gap-2">
                  <Star strokeWidth={3} size={16}/>
                  Add To Tally
                </button>
              </div>

              {/* Tally List Feedback */}
              {roofSections.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-accent">Current Planes ({roofSections.length})</h3>
                    <button onClick={clearRoofData} className="text-red-500 text-[9px] font-bold uppercase tracking-widest hover:underline">Clear List</button>
                  </div>
                  <div className="max-h-40 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                    {roofSections.map((sec, idx) => (
                      <div key={sec.id} className={`flex items-center justify-between p-3 rounded-xl border shadow-sm ${theme=== 'dark' ? 'bg-[#111] border-[#222]' : 'bg-white border-[#eee]'}`}>
                        <div className="flex flex-col">
                          <span className={`text-[10px] font-black uppercase tracking-wider ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                            {sec.qty}× {sec.type === 'rect' ? 'Rectangle' : sec.type === 'tri' ? 'Triangle' : 'Trapezoid'}
                          </span>
                          <span className="text-[10px] text-[#888] font-mono mt-0.5">
                            Pitch: {sec.pitch}/12 | {formatF(sec.w1, unitMode)} × {formatF(sec.h, unitMode)}
                          </span>
                        </div>
                        <button onClick={() => setRoofSections(roofSections.filter(s => s.id !== sec.id))}
                          className="p-2 text-red-500/50 hover:text-red-500 transition-colors bg-red-500/5 rounded-lg"
                        >
                          <X size={16}/>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Grouped Material Specs Card */}
              <div className={`p-4 rounded-xl border space-y-4 ${theme === 'dark' ? 'bg-white/5 border-[#333]/30' : 'bg-black/5 border-[#ccc]/50'}`}>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-accent opacity-80">Material Specifications</h3>
                
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex flex-col col-span-2">
                    <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Material Type</span>
                    <div className={`flex gap-1 p-1 rounded-xl border h-[42px] ${theme === 'dark' ? 'bg-[#333]/20 border-[#444]/30' : 'bg-gray-200/50 border-[#ddd]'}`}>
                      {(['asphalt', 'tile', 'cedar'] as const).map((m) => (
                        <button key={m} onClick={() => setRoofMaterialType(m)}
                          className={`flex-1 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all ${roofMaterialType === m ? 'bg-accent text-black shadow-md' : 'text-[#888] hover:text-current'}`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Waste (%)</span>
                    <input type="number" value={waste} onChange={(e) => setWaste(e.target.value)} placeholder="10" 
                      className={`w-full h-[42px] border rounded-xl text-center font-bold text-sm outline-none shadow-sm transition-colors ${theme === 'dark' ? 'bg-[#111] border-[#222] text-white focus:border-accent' : 'bg-gray-50 border-[#ccc] text-black focus:border-accent'}`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className={`flex items-center justify-between p-3 rounded-xl border shadow-sm ${theme === 'dark' ? 'bg-[#111] border-[#222]' : 'bg-gray-50 border-[#ccc]'}`}>
                    <span className="text-[9px] font-black uppercase tracking-widest opacity-80">Nails/Shingle</span>
                    <div className="flex gap-1">
                      {[4, 6].map(n => (
                        <button key={n} onClick={() => setRoofNailsPerShingle(n as any)}
                          className={`w-8 h-8 rounded-lg font-bold text-xs transition-colors ${roofNailsPerShingle === n ? 'bg-accent text-black' : (theme === 'dark' ? 'bg-[#333] text-white hover:bg-[#444]' : 'bg-gray-300 text-black hover:bg-gray-400')}`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className={`flex items-center justify-between p-3 rounded-xl border shadow-sm ${theme === 'dark' ? 'bg-[#111] border-[#222]' : 'bg-gray-50 border-[#ccc]'}`}>
                    <span className="text-[9px] font-black uppercase tracking-widest opacity-80">Waterproofing Roll</span>
                    <div className="flex gap-1">
                      {[33, 66].map(n => (
                        <button key={n} onClick={() => setRoofRollSize(n as any)}
                          className={`px-3 h-8 rounded-lg font-bold text-xs transition-colors ${roofRollSize === n ? 'bg-accent text-black' : (theme === 'dark' ? 'bg-[#333] text-white hover:bg-[#444]' : 'bg-gray-300 text-black hover:bg-gray-400')}`}
                        >
                          {n}'
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

							{/* --- ADVANCED TRIM MODIFIERS --- */}
              <div className={`p-4 rounded-xl border space-y-3 ${theme === 'dark' ? 'bg-[#0a0a0a] border-[#222]' : 'bg-gray-50 border-[#ddd]'}`}>
                <div className="flex items-center gap-1.5 mb-1 text-accent opacity-80">
                  <span className="text-[10px] font-black uppercase tracking-widest">Global Trim Overrides</span>
                  <button onClick={() => alert("Valleys are automatically subtracted from your exterior Drip Edge and Starter Shingle requirements, and converted directly into W-Valley Metal.\n\nThey also receive dedicated Ice & Water Shield routing.")}><Info size={12}/></button>
                </div>
                
                <div id="input-rm-valley">
                  <InputRow label="Total Valley Length (Optional)" v1={d1} v2={d2} v3={d3} v4={d4} setV1={setD1} setV2={setD2} setV3={setD3} setV4={setD4} mode={unitMode} theme={theme} onFocus={setActiveInput} {...getUnitProps('d')}/>
                </div>
                <span className="block text-[8.5px] text-[#888] italic px-1 text-center font-medium leading-relaxed">
                  Enter the combined length of all valleys to calculate exact flashing and subtract them from perimeter drip edge.
                </span>
              </div>

              {/* Slope Multiplier Reference */}
              <div className={`p-4 rounded-xl border ${theme=== 'dark' ? 'bg-[#111] border-[#222]' : 'bg-white border-[#eee]'}`}>
                <h3 className="text-[10px] font-black uppercase tracking-widest mb-3 opacity-50">Slope Multiplier Reference</h3>
                <div className="grid grid-cols-4 gap-2 text-center">
                  {[
                    { p: '3/12', f: '1.031' }, { p: '4/12', f: '1.054' }, { p: '5/12', f: '1.083' }, { p: '6/12', f: '1.118' },
                    { p: '7/12', f: '1.158' }, { p: '8/12', f: '1.202' }, { p: '10/12', f: '1.302' }, { p: '12/12', f: '1.414' }
                  ].map(row => (
                    <div key={row.p} className={`flex flex-col p-1.5 rounded-lg ${theme === 'dark' ? 'bg-black/20' : 'bg-gray-100'}`}>
                      <span className="text-[10px] font-bold">{row.p}</span>
                      <span className="text-[8px] opacity-60 font-mono">{row.f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={() => resetTool('rm')}
                className={`w-full mt-4 p-3 rounded-xl font-black tracking-widest text-[10px] uppercase active:scale-95 transition-all ${theme === 'dark' ? 'bg-[#111] border border-red-500/30 text-red-500 hover:bg-red-500/10' : 'bg-red-50 text-red-500 border border-red-200 hover:bg-red-100'}`}
              >
                Clear Roofing Tool
              </button>

              {/* HERO CARD RESULT */}
              {roofSections.length > 0 ? (
                <div className={`mt-6 pt-5 border-t w-full ${theme === 'dark' ? 'border-[#222]/40' : 'border-[#ddd]'}`}>
                  <div className={`mb-5 text-center border rounded-xl p-6 shadow-lg ${theme === 'dark' ? 'bg-[#111] border-[#222]' : 'bg-gray-50 border-[#ccc]'}`}>
                    <span className="block text-[10px] font-black uppercase tracking-widest text-accent opacity-80 mb-2">Total Order Quantity</span>
                    <span className={`text-4xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                      {results.sub.find((i:any) => i.label.includes('Bundles') || i.label.includes('Tiles'))?.value || "0"}
                    </span>
                    <span className="block text-[12px] font-bold text-[#888] mt-2">
                      Total Coverage: {results.main}
                    </span>
                  </div>

                  {/* UPGRADED SEGMENTED LIVE TEXT OUTPUT LIST */}
                  <div className="space-y-1.5">
                    {results.sub.map((item: any, idx: number) => {
                      const isHeader = item.label.includes('---');
                      const isWarning = item.warning;

                      if (isWarning) {
                        return (
                          <div key={idx} className="flex justify-between items-center p-3 my-2 rounded-xl bg-red-500/10 border border-red-500/30 text-xs">
                            <span className="text-red-500 font-bold uppercase tracking-wide">{item.label}</span>
                            <span className="text-red-500 font-mono font-black text-right">{item.value}</span>
                          </div>
                        );
                      }

                      return (
                        <div 
                          key={idx} 
                          className={`flex justify-between items-center py-2.5 px-3 rounded-lg transition-colors ${
                            isHeader 
                              ? 'mt-4 mb-1 border-none bg-accent/10 dark:bg-accent/5' 
                              : theme === 'dark' ? 'border-b border-[#222]/40 hover:bg-white/[0.02]' : 'border-b border-[#ddd]/60 hover:bg-black/[0.02]'
                          }`}
                        >
                          <span className={`${
                            isHeader 
                              ? 'text-accent font-black uppercase tracking-widest text-[10px]' 
                              : `text-xs opacity-80 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`
                          }`}>
                            {item.label.replace(/-/g, '').trim()}
                          </span>
                          
                          {!isHeader && (
                            <span className={`font-bold font-mono text-right ${
                              item.highlight 
                                ? 'text-accent text-sm tracking-wide font-black' 
                                : theme === 'dark' ? 'text-white text-xs' : 'text-black text-xs'
                            }`}>
                              {item.value}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className={`mt-6 pt-5 border-t w-full ${theme === 'dark' ? 'border-[#222]/40' : 'border-[#ddd]'}`}>
                  <div className={`mb-4 text-center border rounded-xl p-6 ${theme === 'dark' ? 'bg-[#111] border-[#222]' : 'bg-gray-50 border-[#ccc]'}`}>
                    <span className="block text-[10px] font-black uppercase tracking-widest text-[#555] opacity-80">Awaiting Roof Planes...</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTool === 'wc' && (
            <div className="space-y-4">
              
              {/* --- UPGRADED 3D DYNAMIC DIAGRAM --- */}
              <div className={`mb-6 flex flex-col justify-center items-center p-6 rounded-xl border shadow-inner ${theme === 'dark' ? 'bg-[#0a0a0a] border-[#222]' : 'bg-gray-50 border-[#ddd]'}`}>
                <svg viewBox="0 20 240 200" className="w-full max-w-[280px] h-auto overflow-visible transition-all duration-500">
                  <defs>
                    <filter id="neonGlowWC" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur1" />
                      <feMerge><feMergeNode in="blur1" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                    <pattern id="scanlinesWC" patternUnits="userSpaceOnUse" width="4" height="4">
                      <line x1="0" y1="0" x2="4" y2="0" stroke={theme === 'dark' ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"} strokeWidth="1" />
                    </pattern>
                  </defs>

                  <rect x="-10" y="10" width="260" height="220" fill="url(#scanlinesWC)" rx="8" />

                  {(() => {
                    const subDivisor = unitMode === 'imp' ? 12 : 100;
                    
                    const ftA = parseFloat(a1) || 0;
                    const inA = parseFloat(a2) || 0;
                    const fracA = parseFloat(a4) ? (parseFloat(a3) || 0) / parseFloat(a4) : 0;
                    const valA = ftA + (inA + fracA) / subDivisor;
                    
                    const ftB = parseFloat(b1) || 0;
                    const inB = parseFloat(b2) || 0;
                    const fracB = parseFloat(b4) ? (parseFloat(b3) || 0) / parseFloat(b4) : 0;
                    const valB = ftB + (inB + fracB) / subDivisor;

                    const displayLength = valA > 0 
                      ? (unitMode === 'imp' ? `Length: ${a1 || 0}' ${a2 || 0}${a3 && a4 ? ` ${a3}/${a4}` : ''}"` : `Length: ${valA.toFixed(2)} m`)
                      : 'Wall Length';
                      
                    const displayHeight = valB > 0 
                      ? (unitMode === 'imp' ? `Height: ${b1 || 0}' ${b2 || 0}${b3 && b4 ? ` ${b3}/${b4}` : ''}"` : `Height: ${valB.toFixed(2)} m`)
                      : 'Wall Height';

                    const baseLenIn = valA > 0 ? valA * 12 : 192; 
                    const baseHeiIn = valB > 0 ? valB * 12 : 96;  

                    const visLenIn = Math.min(baseLenIn, 192);
                    const visHeiIn = Math.min(baseHeiIn, 192); 

                    const maxDimIn = Math.max(visLenIn, visHeiIn);
                    const scale = 140 / (maxDimIn || 1); 

                    const vW = visLenIn * scale;
                    const vH = visHeiIn * scale;

                    const startX = 40;
                    const startY = 190;

                    const ocStr = String(ocSpacing || '16').replace(/[^0-9.]/g, ''); 
                    const oc = parseFloat(ocStr) || 16;
                    
                    const tpCount = (qty2 !== undefined && qty2 !== '') ? parseInt(qty2) : 2; 
                    const bpCount = (qty3 !== undefined && qty3 !== '') ? parseInt(qty3) : 1;

                    let lumberWidthInches = 3.5; 
                    if (framingSize === '2x6') lumberWidthInches = 5.5;
                    else if (framingSize === '2x8') lumberWidthInches = 7.25;

                    const plateH = 1.5 * scale;
                    const studW = 1.5 * scale; 
                    
                    const studH = vH - (bpCount * plateH) - (tpCount * plateH);
                    const studY = startY - (bpCount * plateH) - studH;

                    const studs = [];
                    const numStuds = Math.ceil(visLenIn / oc);
                    for (let i = 0; i < numStuds; i++) {
                        const sx = startX + (i * oc * scale);
                        if (sx < startX + vW - studW) {
                            studs.push(sx);
                        }
                    }
                    studs.push(startX + vW - studW);

                    const ddx = (lumberWidthInches * scale) * 0.7;
                    const ddy = -(lumberWidthInches * scale) * 0.4;

                    return (
                      <g>
                        <text x={120} y={35} fill="var(--color-accent)" fontSize="8" fontWeight="black" textAnchor="middle" opacity="0.8">
                          {`FRAMING: ${framingSize} @ ${oc}" OC`}
                        </text>

                        <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                          
                          {Array.from({length: bpCount}).map((_, i) => {
                              const py = startY - (i + 1) * plateH;
                              return (
                                  <g key={`bp-${i}`}>
                                      <rect x={startX} y={py} width={vW} height={plateH} fill={theme === 'dark' ? '#555' : '#ccc'} stroke={theme === 'dark' ? '#333' : '#aaa'} strokeWidth="0.5" />
                                      {i === bpCount - 1 && (
                                          <polygon points={`${startX},${py} ${startX+ddx},${py+ddy} ${startX+vW+ddx},${py+ddy} ${startX+vW},${py}`} fill={theme === 'dark' ? '#666' : '#ddd'} stroke={theme === 'dark' ? '#333' : '#aaa'} strokeWidth="0.5" />
                                      )}
                                      <polygon points={`${startX+vW},${py} ${startX+vW+ddx},${py+ddy} ${startX+vW+ddx},${py+ddy+plateH} ${startX+vW},${py+plateH}`} fill={theme === 'dark' ? '#444' : '#bbb'} stroke={theme === 'dark' ? '#333' : '#aaa'} strokeWidth="0.5" />
                                  </g>
                              )
                          })}

                          {studH > 0 && studs.map((sx, i) => (
                            <g key={`stud-${i}`}>
                              <rect x={sx} y={studY} width={studW} height={studH} fill={theme === 'dark' ? '#555' : '#ccc'} stroke={theme === 'dark' ? '#333' : '#aaa'} strokeWidth="0.5" />
                              <polygon points={`${sx+studW},${studY} ${sx+studW+ddx},${studY+ddy} ${sx+studW+ddx},${studY+studH+ddy} ${sx+studW},${studY+studH}`} fill={theme === 'dark' ? '#444' : '#bbb'} stroke={theme === 'dark' ? '#333' : '#aaa'} strokeWidth="0.5" />
                            </g>
                          ))}
                        </motion.g>

                        <motion.g initial={{ opacity: 0, x: -5, y: -5 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
                          {Array.from({length: tpCount}).map((_, i) => {
                              const py = startY - vH + (i * plateH);
                              const isTop = i === 0;
                              
                              const fillC = "var(--color-accent)";
                              const opacityF = isTop ? "0.8" : "0.6";
                              const opacityT = isTop ? "1" : "0.4";
                              const opacityR = isTop ? "0.6" : "0.5";

                              return (
                                  <g key={`tp-${i}`}>
                                      <rect x={startX} y={py} width={vW} height={plateH} fill={fillC} opacity={opacityF} stroke={fillC} strokeWidth="0.5" filter={isTop ? "url(#neonGlowWC)" : undefined} />
                                      <polygon points={`${startX},${py} ${startX+ddx},${py+ddy} ${startX+vW+ddx},${py+ddy} ${startX+vW},${py}`} fill={fillC} opacity={opacityT} stroke={fillC} strokeWidth="0.5" />
                                      <polygon points={`${startX+vW},${py} ${startX+vW+ddx},${py+ddy} ${startX+vW+ddx},${py+ddy+plateH} ${startX+vW},${py+plateH}`} fill={fillC} opacity={opacityR} stroke={fillC} strokeWidth="0.5" />
                                  </g>
                              )
                          })}
                        </motion.g>

                        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.5 }}>
                          <line x1={startX - 10} y1={startY + 20} x2={startX + vW + 10} y2={startY + 20} stroke="#ff00d2" strokeWidth="1.5" strokeDasharray="3,3" />
                          <path d={`M ${startX - 10} ${startY + 15} L ${startX - 10} ${startY + 25} M ${startX + vW + 10} ${startY + 15} L ${startX + vW + 10} ${startY + 25}`} stroke="#ff00d2" strokeWidth="1.5" fill="none" />
                          
                          <line x1={startX - 22} y1={startY - vH} x2={startX - 22} y2={startY} stroke="#ff00d2" strokeWidth="1.5" strokeDasharray="3,3" />
                          <path d={`M ${startX - 27} ${startY - vH} L ${startX - 17} ${startY - vH} M ${startX - 27} ${startY} L ${startX - 17} ${startY}`} stroke="#ff00d2" strokeWidth="1.5" fill="none" />
                        </motion.g>

                        <text x={startX + vW / 2} y={startY + 33} fill={theme === 'dark' ? '#fff' : '#000'} fontSize="7.5" fontWeight="bold" textAnchor="middle" className="cursor-pointer hover:fill-accent transition-colors" onClick={() => document.getElementById('input-wc-len')?.focus()}>
                          {displayLength}
                        </text>
                        
                        <text x={startX - 26} y={startY - vH / 2} fill={theme === 'dark' ? '#fff' : '#000'} fontSize="7.5" fontWeight="bold" textAnchor="middle" transform={`rotate(-90 ${startX - 26} ${startY - vH / 2})`} className="cursor-pointer hover:fill-accent transition-colors" onClick={() => document.getElementById('input-wc-hei')?.focus()}>
                          {displayHeight}
                        </text>
                      </g>
                    );
                  })()}
                </svg>
                
                <span className="text-[8px] text-[#888] italic px-2 text-center mt-2 font-medium opacity-80 leading-relaxed block max-w-[260px] mx-auto">
                  *Diagram is for conceptual layout reference only. Visual scale is capped at 16' (L/H) and does not render internal opening structures. Plate counts dynamically reflect user input.
                </span>
              </div>
              
              {/* Primary Dimensions & Foundation */}
              <div className={`flex items-center justify-between p-4 mb-2 border rounded-xl shadow-sm ${theme === 'dark' ? 'bg-[#111] border-[#222]' : 'bg-gray-50 border-[#ccc]'}`}>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-accent">Framed on Concrete Slab?</span>
                  <span className="text-[8px] text-[#888] font-bold mt-0.5">Calculates PT Bottom Plate, Sill Gasket & Anchors</span>
                </div>
                <button onClick={() => setHasPointLoad(!hasPointLoad)}
                  className={`w-12 h-6 rounded-full relative transition-colors ${hasPointLoad ? 'bg-accent' : (theme === 'dark' ? 'bg-[#333]' : 'bg-gray-300')}`}
                >
                  <motion.div animate={{ x: hasPointLoad ? 24 : 2 }} className="absolute top-1 left-0 w-4 h-4 rounded-full bg-white shadow-sm"/>
                </button>
              </div>

              <div className="space-y-3 p-4 rounded-xl border border-[#333]/30 bg-black/5 dark:bg-white/5">
                <span className="block mb-1 text-[10px] font-black uppercase tracking-widest text-accent opacity-80">Wall Footprint</span>
                <div id="input-wc-len">
                  <InputRow label="Wall Length" v1={a1} v2={a2} v3={a3} v4={a4} setV1={setA1} setV2={setA2} setV3={setA3} setV4={setA4} mode={unitMode} theme={theme} onFocus={setActiveInput} {...getUnitProps('a')}/>
                </div>
                <div id="input-wc-hei">
                  <InputRow label="Wall Height" v1={b1} v2={b2} v3={b3} v4={b4} setV1={setB1} setV2={setB2} setV3={setB3} setV4={setB4} mode={unitMode} theme={theme} onFocus={setActiveInput} {...getUnitProps('b')}/>
                </div>
              </div>

              {/* Structural Framing Parameters */}
              <div className={`p-4 rounded-xl border space-y-4 ${theme === 'dark' ? 'bg-white/5 border-[#333]/30' : 'bg-black/5 border-[#ccc]/50'}`}>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-accent opacity-80">Framing Parameters</h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col">
                    <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Stud Spacing</span>
                    <select value={ocSpacing} onChange={(e) => setOcSpacing(e.target.value)} 
                      className={`w-full border rounded-xl p-3 text-center font-bold text-sm outline-none appearance-none shadow-sm transition-colors ${theme === 'dark' ? 'bg-[#111] border-[#222] text-white focus:border-accent' : 'bg-gray-50 border-[#ccc] text-black focus:border-accent'}`}
                    >
                      {unitMode === 'imp' ? (
                        <><option value="12">12” OC</option><option value="16">16” OC</option><option value="24">24” OC</option></>
                      ) : (
                        <><option value="400">400 mm OC</option><option value="600">600 mm OC</option></>
                      )}
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Outside Corners</span>
                    <input type="number" value={corners} onChange={(e) => setCorners(e.target.value)} placeholder="0"
                      className={`w-full border rounded-xl p-3 text-center font-bold text-lg outline-none transition-colors ${theme === 'dark' ? 'bg-[#111] border-[#222] text-white focus:border-accent' : 'bg-white border-[#ccc] text-black focus:border-accent'}`} 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col">
                    <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">T-Wall Intersects</span>
                    <input type="number" value={qty4} onChange={(e) => setQty4(e.target.value)} placeholder="0"
                      className={`w-full border rounded-xl p-3 text-center font-bold text-lg outline-none transition-colors ${theme === 'dark' ? 'bg-[#111] border-[#222] text-white focus:border-accent' : 'bg-white border-[#ccc] text-black focus:border-accent'}`} 
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Framing Size</span>
                    <div className={`flex gap-1 p-1 rounded-xl border h-full items-center ${theme === 'dark' ? 'bg-[#333]/20 border-[#444]/30' : 'bg-gray-200/50 border-[#ddd]'}`}>
                      {(['2x4', '2x6', '2x8'] as const).map((size) => (
                        <button key={size} onClick={() => setFramingSize(size)}
                          className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${framingSize === size ? 'bg-accent text-black shadow-md' : 'text-[#888] hover:text-current'}`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col">
                    <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Top Plates</span>
                    <select value={qty2 || '2'} onChange={(e) => setQty2(e.target.value)} 
                      className={`w-full border rounded-xl p-3 text-center font-bold text-sm outline-none appearance-none shadow-sm transition-colors ${theme === 'dark' ? 'bg-[#111] border-[#222] text-white focus:border-accent' : 'bg-gray-50 border-[#ccc] text-black focus:border-accent'}`}
                    >
                      <option value="1">Single (1)</option>
                      <option value="2">Double (2)</option>
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Bottom Plates</span>
                    <select value={qty3 || '1'} onChange={(e) => setQty3(e.target.value)} 
                      className={`w-full border rounded-xl p-3 text-center font-bold text-sm outline-none appearance-none shadow-sm transition-colors ${theme === 'dark' ? 'bg-[#111] border-[#222] text-white focus:border-accent' : 'bg-gray-50 border-[#ccc] text-black focus:border-accent'}`}
                    >
                      <option value="1">Single (1)</option>
                      <option value="2">Double (2)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Advanced Material Optimization & Envelope Card */}
              <div className={`p-4 rounded-xl border space-y-4 ${theme === 'dark' ? 'bg-white/5 border-[#333]/30' : 'bg-black/5 border-[#ccc]/50'}`}>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-accent opacity-80">Envelope & Materials</h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col">
                    <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Wall Category</span>
                    <div className={`flex gap-1 p-1 rounded-xl border h-[3.25rem] ${theme === 'dark' ? 'bg-[#333]/20 border-[#444]/30' : 'bg-gray-200/50 border-[#ddd]'}`}>
                      <button onClick={() => setC1('exterior')}
                        className={`flex-1 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all ${c1 !== 'interior' ? 'bg-accent text-black shadow-md' : 'text-[#888] hover:text-current'}`}
                      >
                        Exterior
                      </button>
                      <button onClick={() => setC1('interior')}
                        className={`flex-1 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all ${c1 === 'interior' ? 'bg-accent text-black shadow-md' : 'text-[#888] hover:text-current'}`}
                      >
                        Interior
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Waste %</span>
                    <input type="number" value={waste} onChange={(e) => setWaste(e.target.value)} placeholder="10" 
                      className={`w-full border rounded-xl p-3 text-center font-bold text-lg outline-none transition-colors ${theme === 'dark' ? 'bg-[#111] border-[#222] text-white focus:border-accent' : 'bg-white border-[#ccc] text-black focus:border-accent'}`} 
                    />
                  </div>
                </div>

                {/* Sheathing Sides (Only pops up if Interior is selected) */}
                {c1 === 'interior' ? (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="flex flex-col pt-1">
                    <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Interior Drywall Sides</span>
                    <div className={`flex gap-1 p-1 rounded-xl border h-[3.25rem] ${theme === 'dark' ? 'bg-[#333]/20 border-[#444]/30' : 'bg-gray-200/50 border-[#ddd]'}`}>
                      <button onClick={() => setWallSheetingSides('one')}
                        className={`flex-1 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all ${wallSheetingSides === 'one' ? 'bg-accent text-black shadow-md' : 'text-[#888] hover:text-current'}`}
                      >
                        One Side
                      </button>
                      <button onClick={() => setWallSheetingSides('both')}
                        className={`flex-1 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all ${wallSheetingSides === 'both' ? 'bg-accent text-black shadow-md' : 'text-[#888] hover:text-current'}`}
                      >
                        Both Sides
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col">
                      <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Exterior Sheathing</span>
                      <select value={c2 || 'osb'} onChange={(e) => setC2(e.target.value)} 
                        className={`w-full border rounded-xl p-3 text-center font-bold text-sm outline-none appearance-none shadow-sm transition-colors ${theme === 'dark' ? 'bg-[#111] border-[#222] text-white focus:border-accent' : 'bg-gray-50 border-[#ccc] text-black focus:border-accent'}`}
                      >
                        <option value="osb">OSB (7/16")</option>
                        <option value="plywood">Plywood (1/2")</option>
                        <option value="zip">ZIP System</option>
                      </select>
                    </div>
                    <div className="flex flex-col justify-end pb-1">
                      <div className={`flex items-center justify-between p-3 border rounded-lg shadow-sm ${theme === 'dark' ? 'bg-[#111] border-[#333]' : 'bg-gray-50 border-[#ccc]'}`}>
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#888]">Vapor Barrier</span>
                        <button onClick={() => setshowScrewLayout(!showScrewLayout)}
                          className={`w-10 h-5 rounded-full relative transition-colors ${showScrewLayout ? 'bg-accent' : (theme === 'dark' ? 'bg-[#444]' : 'bg-gray-300')}`}
                        >
                          <motion.div animate={{ x: showScrewLayout ? 20 : 2 }} className="absolute top-1 left-0 w-3 h-3 rounded-full bg-white shadow-sm"/>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Finishing Toggles & Specs */}
              <div className={`p-4 rounded-xl border space-y-4 ${theme === 'dark' ? 'bg-white/5 border-[#333]/30' : 'bg-black/5 border-[#ccc]/50'}`}>
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-accent opacity-80">Finishing Specs</h3>
                  <button onClick={() => setshowFinishing(!showFinishing)}
                    className={`w-12 h-6 rounded-full relative transition-colors ${showFinishing ? 'bg-accent' : (theme === 'dark' ? 'bg-[#333]' : 'bg-gray-300')}`}
                  >
                    <motion.div animate={{ x: showFinishing ? 24 : 2 }} className="absolute top-1 left-0 w-4 h-4 rounded-full bg-white shadow-sm"/>
                  </button>
                </div>

                {showFinishing && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="grid grid-cols-2 gap-3 pt-2">
                    <div className="flex flex-col">
                      <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Drywall Type</span>
                      <select value={c3 || '1/2'} onChange={(e) => setC3(e.target.value)} 
                        className={`w-full border rounded-xl p-3 text-center font-bold text-sm outline-none appearance-none shadow-sm transition-colors ${theme === 'dark' ? 'bg-[#111] border-[#222] text-white focus:border-accent' : 'bg-gray-50 border-[#ccc] text-black focus:border-accent'}`}
                      >
                        <option value="1/2">1/2" Standard</option>
                        <option value="5/8">5/8" Fire/Sound</option>
                        <option value="moisture">Moisture (Green)</option>
                      </select>
                    </div>
                    <div className="flex flex-col">
                      <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Insulation Type</span>
                      <select value={c4 || 'fiberglass'} onChange={(e) => setC4(e.target.value)} 
                        className={`w-full border rounded-xl p-3 text-center font-bold text-sm outline-none appearance-none shadow-sm transition-colors ${theme === 'dark' ? 'bg-[#111] border-[#222] text-white focus:border-accent' : 'bg-gray-50 border-[#ccc] text-black focus:border-accent'}`}
                      >
                        <option value="fiberglass">Fiberglass Batts</option>
                        <option value="mineral">Mineral Wool</option>
                        <option value="spray">Spray Foam</option>
                        <option value="none">None</option>
                      </select>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Refined Openings & Deductions Section */}
              <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-[#0a0a0a] border-[#222]' : 'bg-gray-50 border-[#ddd]'} space-y-4`}>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-[#555]">Add Openings</h3>
                
                {/* The Type Toggle */}
                <div className={`flex gap-1 p-1 rounded-xl border ${theme === 'dark' ? 'bg-[#333]/20 border-[#444]/30' : 'bg-gray-200/50 border-[#ccc]'}`}>
                  <button onClick={() => setNewOpType('window')} className={`flex-1 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${newOpType === 'window' ? 'bg-[#111] text-accent shadow-md border border-[#333]' : 'text-[#888] hover:text-current'}`}>
                    Window
                  </button>
                  <button onClick={() => setNewOpType('door')} className={`flex-1 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${newOpType === 'door' ? 'bg-[#111] text-accent shadow-md border border-[#333]' : 'text-[#888] hover:text-current'}`}>
                    Door
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col">
                    <span className="block mb-1.5 text-[9px] font-black uppercase text-[#666]">Width ({unitMode === 'imp' ? 'Inches' : 'cm'})</span>          
                    <input type="number" value={newOpW} onChange={(e) => setNewOpW(e.target.value)} 
                      className={`w-full border rounded-lg p-3 text-center font-bold outline-none transition-colors ${theme === 'dark' ? 'bg-[#111] border-[#333] focus:border-accent' : 'bg-white border-[#ccc] focus:border-accent'}`} 
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="block mb-1.5 text-[9px] font-black uppercase text-[#666]">Height ({unitMode === 'imp' ? 'Inches' : 'cm'})</span>
                    <input type="number" value={newOpH} onChange={(e) => setNewOpH(e.target.value)} 
                      className={`w-full border rounded-lg p-3 text-center font-bold outline-none transition-colors ${theme === 'dark' ? 'bg-[#111] border-[#333] focus:border-accent' : 'bg-white border-[#ccc] focus:border-accent'}`} 
                    />
                  </div>
                </div>
                
                {/* Dynamic Button Text triggering your addOpening function */}
                <div className="flex gap-2">
                  <button onClick={addOpening} className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95 ${theme === 'dark' ? 'bg-accent/10 border border-accent/50 text-accent hover:bg-accent/20' : 'bg-accent border border-[#00d0e6] text-black hover:brightness-110'}`}>
                    + Add {newOpType}
                  </button>
                </div>

                {openings.length > 0 && (
                  <div className="space-y-2 pt-3 border-t border-[#333]/20 dark:border-[#ccc]/50">
                    <div className="flex justify-between items-center px-1">
                       <span className="text-[9px] font-bold text-[#888] uppercase tracking-widest">Added Deductions</span>
                       <button onClick={() => setOpenings([])} className="text-red-500 text-[9px] font-bold uppercase tracking-widest hover:underline">Clear</button>
                    </div>
                    {openings.map((op, i) => (
                      <div key={i} className={`flex items-center justify-between p-2.5 rounded-lg border ${theme === 'dark' ? 'bg-[#1a1a1a] border-[#333]' : 'bg-white border-[#eee]'}`}>
                        <span className="text-[10px] font-bold uppercase text-[#888]"><span className={theme === 'dark' ? 'text-white' : 'text-black'}>{op.type}:</span> {formatF(op.w, unitMode)} × {formatF(op.h, unitMode)}</span>
                        <button onClick={() => removeOpening(i)} className="text-red-500/50 hover:text-red-500 p-1">
                          <X size={14}/>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Local Tape Precision Pill */}
              {unitMode === 'imp' && (
                <div className="flex flex-col pt-2 pb-2">
                  <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Tape Precision</span>
                  <div className={`flex gap-1 p-1 rounded-xl border ${theme === 'dark' ? 'bg-[#333]/20 border-[#444]/30' : 'bg-gray-200/50 border-[#ddd]'}`}>
                    {([8, 16, 32] as const).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPrecision(p)}
                        className={`flex-1 py-2.5 rounded-lg font-black text-[11px] transition-all ${
                          precision === p 
                            ? 'bg-accent text-black shadow-md' 
                            : 'text-[#888] hover:text-current'
                        }`}
                      >
                        1/{p}"
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Standardized Clear Button */}
              <button onClick={() => resetTool('wc')}
                className={`w-full mt-4 p-3 rounded-xl font-black tracking-widest text-[10px] uppercase active:scale-95 transition-all ${theme === 'dark' ? 'bg-[#111] border border-red-500/30 text-red-500 hover:bg-red-500/10' : 'bg-red-50 text-red-500 border border-red-200 hover:bg-red-100'}`}
              >
                Clear Wall Tool
              </button>

              {/* HERO CARD RESULT */}
              {results.main && (
                <div className={`mt-6 pt-5 border-t w-full ${theme === 'dark' ? 'border-[#222]/40' : 'border-[#ddd]'}`}>
                  <div className={`mb-4 text-center border rounded-xl p-6 shadow-lg ${theme === 'dark' ? 'bg-[#111] border-[#222]' : 'bg-gray-50 border-[#ccc]'}`}>
                    <span className="block text-[10px] font-black uppercase tracking-widest text-accent opacity-80 mb-2">Total Framing Studs</span>
                    <span className={`text-5xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{results.main.split(' ')[0]}</span>
                  </div>
                </div>
              )}

              {/* UPGRADED SEGMENTED LIVE TEXT OUTPUT LIST */}
              {results.sub && results.sub.length > 0 && (
                <div className="space-y-1.5 mt-2">
                  {results.sub.map((item: any, idx: number) => {
                    const isHeader = item.label.includes('---');
                    const isWarning = item.warning;

                    if (isWarning) {
                      return (
                        <div key={idx} className="flex justify-between items-center p-3 my-2 rounded-xl bg-red-500/10 border border-red-500/30 text-xs">
                          <span className="text-red-500 font-bold uppercase tracking-wide">{item.label}</span>
                          <span className="text-red-500 font-mono font-black text-right">{item.value}</span>
                        </div>
                      );
                    }

                    return (
                      <div 
                        key={idx} 
                        className={`flex justify-between items-center py-2.5 px-3 rounded-lg transition-colors ${
                          isHeader 
                            ? 'mt-4 mb-1 border-none bg-accent/10 dark:bg-accent/5' 
                            : theme === 'dark' ? 'border-b border-[#222]/40 hover:bg-white/[0.02]' : 'border-b border-[#ddd]/60 hover:bg-black/[0.02]'
                        }`}
                      >
                        <span className={`${
                          isHeader 
                            ? 'text-accent font-black uppercase tracking-widest text-[10px]' 
                            : `text-xs opacity-80 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`
                        }`}>
                          {item.label.replace(/-/g, '').trim()}
                        </span>
                        
                        {!isHeader && (
                          <span className={`font-bold font-mono text-right ${
                            item.highlight 
                              ? 'text-accent text-sm tracking-wide font-black' 
                              : theme === 'dark' ? 'text-white text-xs' : 'text-black text-xs'
                          }`}>
                            {item.value}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTool === 'cm' && (
            <div className="space-y-4">
            
              {/* --- UPGRADED LIVE DYNAMIC DIAGRAM --- */}
              <div className={`mb-6 flex justify-center items-center p-6 rounded-xl border shadow-inner ${theme === 'dark' ? 'bg-[#0a0a0a] border-[#222]' : 'bg-gray-50 border-[#ddd]'}`}>
                {(() => {
                  return (
                    <svg viewBox="0 0 240 160" className="w-full max-w-[320px] h-auto overflow-visible transition-all duration-500">
                      <defs>
                        <filter id="neonGlowCM" x="-50%" y="-50%" width="200%" height="200%">
                          <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur1" />
                          <feMerge><feMergeNode in="blur1" /><feMergeNode in="SourceGraphic" /></feMerge>
                        </filter>
                        <pattern id="scanlinesCM" patternUnits="userSpaceOnUse" width="4" height="4">
                          <line x1="0" y1="0" x2="4" y2="0" stroke={theme === 'dark' ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"} strokeWidth="1" />
                        </pattern>
                      </defs>

                      <rect x="0" y="0" width="100%" height="100%" fill="url(#scanlinesCM)" rx="8" />

                      {(() => {
                        const rawSpring = a1 === '' || isNaN(parseFloat(a1)) ? 38 : parseFloat(a1); 
                        const rawWall = b1 === '' || isNaN(parseFloat(b1)) ? 90 : parseFloat(b1);

                        const sAng = Math.max(0, Math.min(75, rawSpring));
                        const wAng = Math.max(25, Math.min(170, rawWall));

                        const cx1 = 60, cy1 = 45; 
                        const wLen = 45; 
                        const halfW = (wAng / 2) * (Math.PI / 180);
                        
                        const wlEndX = cx1 - wLen * Math.sin(halfW);
                        const wlEndY = cy1 + wLen * Math.cos(halfW);
                        const wrEndX = cx1 + wLen * Math.sin(halfW);
                        const wrEndY = cy1 + wLen * Math.cos(halfW);
                        
                        const offset = 8;
                        const dist = offset / Math.sin(halfW);
                        const innerX = cx1;
                        const innerY = cy1 + dist;
                        
                        const mlEndX = innerX - (wLen - dist) * Math.sin(halfW);
                        const mlEndY = innerY + (wLen - dist) * Math.cos(halfW);
                        const mrEndX = innerX + (wLen - dist) * Math.sin(halfW);
                        const mrEndY = innerY + (wLen - dist) * Math.cos(halfW);

                        const arcRad1 = 20;
                        const arcL_X = cx1 - arcRad1 * Math.sin(halfW);
                        const arcL_Y = cy1 + arcRad1 * Math.cos(halfW);
                        const arcR_X = cx1 + arcRad1 * Math.sin(halfW);
                        const arcR_Y = cy1 + arcRad1 * Math.cos(halfW);
                        
                        const laf1 = wAng > 180 ? 1 : 0;
                        const wallArcPath = `M ${arcL_X} ${arcL_Y} A ${arcRad1} ${arcRad1} 0 ${laf1} 0 ${arcR_X} ${arcR_Y}`;

                        const cx2 = 180, cy2 = 60;
                        const sRad = sAng * (Math.PI / 180);
                        const crownLen = 45; 
                        const drop = crownLen * Math.cos(sRad);
                        const reach = crownLen * Math.sin(sRad);
                        
                        const crownBotX = cx2;
                        const crownBotY = cy2 + drop;
                        const crownTopX = cx2 - reach;
                        const crownTopY = cy2;

                        const arcRad2 = 20;
                        const arc2EndX = crownBotX - arcRad2 * Math.sin(sRad);
                        const arc2EndY = crownBotY - arcRad2 * Math.cos(sRad);
                        const springArcPath = `M ${crownBotX} ${crownBotY - arcRad2} A ${arcRad2} ${arcRad2} 0 0 0 ${arc2EndX} ${arc2EndY}`;

                        return (
                          <g>
                            <text x={cx1} y="25" fill={theme === 'dark' ? '#555' : '#aaa'} fontSize="5" fontWeight="bold" textAnchor="middle" className="uppercase tracking-widest">
                              Top Down Corner
                            </text>
                            
                            <path d={`M ${wlEndX} ${wlEndY} L ${cx1} ${cy1} L ${wrEndX} ${wrEndY}`} fill="none" stroke={theme === 'dark' ? '#444' : '#ccc'} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                            
                            <motion.path 
                              d={`M ${mlEndX} ${mlEndY} L ${innerX} ${innerY} L ${mrEndX} ${mrEndY}`} 
                              fill="none" stroke="var(--color-accent)" strokeWidth="2.5" filter="url(#neonGlowCM)" strokeLinecap="round" strokeLinejoin="round"
                              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8 }}
                            />

                            <motion.path 
                              key={`wa-${wAng}`} d={wallArcPath} fill="none" stroke="#ff00d2" strokeWidth="2" filter="url(#neonGlowCM)"
                              initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.5, delay: 0.3 }}
                            />
                            
                            <text x={cx1} y={cy1 + arcRad1 + 14} fill="#ff00d2" fontSize="6.5" fontWeight="bold" textAnchor="middle">
                              Wall: {rawWall.toFixed(1)}°
                            </text>
                            <text x={cx1} y="135" fill={theme === 'dark' ? '#fff' : '#000'} fontSize="6.5" fontWeight="bold" textAnchor="middle" className="cursor-pointer hover:fill-accent transition-colors" onClick={() => document.getElementById('input-cm-wall')?.focus()}>
                              Wall Angle
                            </text>

                            <text x={cx2 - 10} y="25" fill={theme === 'dark' ? '#555' : '#aaa'} fontSize="5" fontWeight="bold" textAnchor="middle" className="uppercase tracking-widest">
                              Profile View
                            </text>
                            
                            <path d={`M ${cx2 - 45} ${cy2} L ${cx2} ${cy2} L ${cx2} ${cy2 + 45}`} fill="none" stroke={theme === 'dark' ? '#444' : '#ccc'} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                            <motion.polygon points={`${cx2},${cy2} ${crownTopX},${crownTopY} ${crownBotX},${crownBotY}`} fill="var(--color-accent)" opacity="0.1" />
                            
                            <motion.line 
                              x1={crownBotX} y1={crownBotY} x2={crownTopX} y2={crownTopY} 
                              stroke="var(--color-accent)" strokeWidth="2.5" filter="url(#neonGlowCM)" strokeLinecap="round"
                              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8 }}
                            />

                            <motion.path 
                              key={`sa-${sAng}`} d={springArcPath} fill="none" stroke="#ff00d2" strokeWidth="2" filter="url(#neonGlowCM)"
                              initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.5, delay: 0.3 }}
                            />
                            
                            <text x={cx2 + 20} y={cy2 + 35} fill="#ff00d2" fontSize="6.5" fontWeight="bold" textAnchor="middle">
                              Spring: {rawSpring.toFixed(1)}°
                            </text>
                            <text x={cx2 - 10} y="135" fill="var(--color-accent)" fontSize="6.5" fontWeight="bold" textAnchor="middle" className="cursor-pointer hover:text-white transition-colors" onClick={() => document.getElementById('input-cm-spring')?.focus()}>
                              Spring Angle
                            </text>
                          </g>
                        );
                      })()}
                    </svg>
                  );
                })()}
              </div>
              {/* --- END OF UPGRADED LIVE DYNAMIC DIAGRAM --- */}
              
              {/* Grouped Input Card */}
              <div className={`p-4 rounded-xl border space-y-4 ${theme === 'dark' ? 'bg-[#0a0a0a] border-[#222]' : 'bg-gray-50 border-[#ddd]'}`}>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col" id="input-cm-spring">
                    <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Spring Angle (°)</span>
                    <input type="number" value={a1} onChange={(e) => setA1(e.target.value)} placeholder="38" 
                      className={`w-full border rounded-xl p-4 text-center font-black text-2xl outline-none transition-colors shadow-inner ${theme === 'dark' ? 'bg-[#111] border-[#333] text-white focus:border-accent' : 'bg-white border-[#ccc] text-black focus:border-accent'}`} 
                    />
                  </div>
                  <div className="flex flex-col" id="input-cm-wall">
                    <span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Wall Angle (°)</span>
                    <input type="number" value={b1} onChange={(e) => setB1(e.target.value)} placeholder="90" 
                      className={`w-full border rounded-xl p-4 text-center font-black text-2xl outline-none transition-colors shadow-inner ${theme === 'dark' ? 'bg-[#111] border-[#333] text-white focus:border-accent' : 'bg-white border-[#ccc] text-black focus:border-accent'}`} 
                    />
                  </div>
                </div>

                {/* Actionable Preset Button */}
                <button 
                  onClick={() => { setA1('38'); setB1('90'); }}
                  className={`w-full p-3 rounded-lg text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all flex items-center justify-center gap-2 shadow-sm ${theme === 'dark' ? 'bg-accent/10 border border-accent/30 text-accent hover:bg-accent/20' : 'bg-[#e0f7ff] border border-accent/40 text-[#0088cc] hover:bg-[#cceeff]'}`}
                >
                  Apply Standard Crown (38° / 90°)
                </button>
              </div>

              {/* HERO CARD RESULT */}
              {results.main && (
                <div className={`mt-6 pt-5 border-t w-full ${theme === 'dark' ? 'border-[#222]/40' : 'border-[#ddd]'}`}>
                  <div className={`mb-4 text-center border rounded-xl p-6 shadow-lg ${theme === 'dark' ? 'bg-[#111] border-[#222]' : 'bg-gray-50 border-[#ccc]'}`}>
                    <span className="block text-[10px] font-black uppercase tracking-widest text-accent opacity-80 mb-2">Compound Flat Cut Miter Setting</span>
                    <span className={`text-4xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{results.main}</span>
                  </div>
                </div>
              )}

              {/* UPGRADED SEGMENTED LIVE TEXT OUTPUT LIST */}
              {results.sub && results.sub.length > 0 && (
                <div className="space-y-1.5 mt-2">
                  {results.sub.map((item: any, idx: number) => {
                    const isHeader = item.label.includes('---');
                    const isWarning = item.warning;

                    if (isWarning) {
                      return (
                        <div key={idx} className="flex justify-between items-center p-3 my-2 rounded-xl bg-red-500/10 border border-red-500/30 text-xs">
                          <span className="text-red-500 font-bold uppercase tracking-wide">{item.label}</span>
                          <span className="text-red-500 font-mono font-black text-right">{item.value}</span>
                        </div>
                      );
                    }

                    return (
                      <div 
                        key={idx} 
                        className={`flex justify-between items-center py-2.5 px-3 rounded-lg transition-colors ${
                          isHeader 
                            ? 'mt-4 mb-1 border-none bg-accent/10 dark:bg-accent/5' 
                            : theme === 'dark' ? 'border-b border-[#222]/40 hover:bg-white/[0.02]' : 'border-b border-[#ddd]/60 hover:bg-black/[0.02]'
                        }`}
                      >
                        <span className={`${
                          isHeader 
                            ? 'text-accent font-black uppercase tracking-widest text-[10px]' 
                            : `text-xs opacity-80 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`
                        }`}>
                          {item.label.replace(/-/g, '').trim()}
                        </span>
                        
                        {!isHeader && (
                          <span className={`font-bold font-mono text-right ${
                            item.highlight 
                              ? 'text-accent text-sm tracking-wide font-black' 
                              : theme === 'dark' ? 'text-white text-xs' : 'text-black text-xs'
                          }`}>
                            {item.value}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Standardized Clear Button (Moved below results) */}
              <button onClick={() => resetTool('cm')}
                className={`w-full mt-4 p-3 rounded-xl font-black tracking-widest text-[10px] uppercase active:scale-95 transition-all ${theme === 'dark' ? 'bg-[#111] border border-red-500/30 text-red-500 hover:bg-red-500/10' : 'bg-red-50 text-red-500 border border-red-200 hover:bg-red-100'}`}
              >
                Clear Miter Tool
              </button>
            </div>
          )}
		  
          {activeTool === 'lv' && (
            <div className="space-y-4">
              
              {/* Upgraded Instrument Cluster / HUD */}
              <div className={`p-6 rounded-2xl border shadow-inner flex flex-col items-center gap-6 ${theme === 'dark' ? 'bg-[#050505] border-[#222]' : 'bg-gray-100/50 border-[#ddd]'}`}>
                
                {/* --- UPGRADED LIVE SENSOR DIAGRAM --- */}
                <div className={`mb-6 flex justify-center items-center p-6 rounded-xl border shadow-inner overflow-hidden ${theme === 'dark' ? 'bg-[#0a0a0a] border-[#222]' : 'bg-gray-50 border-[#ddd]'}`}>
                  {(() => {
                    const livePitch = typeof orientation !== 'undefined' ? (isSlopeLocked && lockedAngle !== null ? lockedAngle : Math.abs(orientation.beta || 0)) : 0;
                    const visualDrop = Math.min(70, (livePitch / 45) * 70); 
                    const yDrop = 20 + visualDrop;
                    const gradePercent = Math.tan(livePitch * (Math.PI / 180)) * 100;

                    return (
                      <svg viewBox="0 0 200 140" className="w-full max-w-[260px] h-auto overflow-visible">
                        <defs>
                          <filter id="neonGlowLV" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur1" />
                            <feMerge><feMergeNode in="blur1" /><feMergeNode in="SourceGraphic" /></feMerge>
                          </filter>
                          <pattern id="scanlinesLV" patternUnits="userSpaceOnUse" width="4" height="4">
                            <line x1="0" y1="0" x2="4" y2="0" stroke={theme === 'dark' ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"} strokeWidth="1" />
                          </pattern>
                        </defs>

                        <rect x="0" y="0" width="100%" height="100%" fill="url(#scanlinesLV)" rx="8" />

                        {(() => {
                          const startX = 30;
                          const endX = 140; 
                          const horizonY = 35; 
                          const liveDropY = typeof yDrop !== 'undefined' ? Math.max(horizonY + 0.1, yDrop + 15) : 75;
                          const springPhysics = { type: "spring", stiffness: 150, damping: 20 };

                          return (
                            <g>
                              <motion.line x1={startX} y1={horizonY} x2={endX} y2={horizonY} stroke={theme === 'dark' ? '#555' : '#ccc'} strokeWidth="2" strokeDasharray="4,4" strokeLinecap="round"
                                initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.6, ease: "easeOut" }} />
                              
                              <text x="85" y="25" fill={theme === 'dark' ? '#888' : '#666'} fontSize="7" fontWeight="bold" textAnchor="middle">
                                Level Horizon
                              </text>

                              <motion.path d={`M ${endX} ${horizonY} L ${endX} ${horizonY+5} L ${endX-5} ${horizonY+5} L ${endX-5} ${horizonY} Z`} fill="none" stroke={theme === 'dark' ? '#444' : '#ccc'} strokeWidth="1" 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} />

                              <motion.line 
                                x1={endX} y1={horizonY} x2={endX} animate={{ y2: liveDropY }} 
                                stroke="#ff00d2" strokeWidth="2" strokeDasharray="3,3" filter="url(#neonGlowLV)"
                                initial={{ y2: horizonY }} transition={springPhysics} 
                              />
                              
                              <motion.line 
                                x1={startX} y1={horizonY} x2={endX} animate={{ y2: liveDropY }} 
                                stroke="var(--color-accent)" strokeWidth="3" strokeLinecap="round" filter="url(#neonGlowLV)"
                                initial={{ y2: horizonY }} transition={springPhysics} 
                              />

                              <motion.text 
                                x="85" fill="var(--color-accent)" fontSize="7.5" fontWeight="bold" textAnchor="middle" filter="url(#neonGlowLV)"
                                initial={{ opacity: 0 }} animate={{ opacity: 1, y: (horizonY + liveDropY) / 2 + 15 }} transition={springPhysics}
                              >
                                {typeof pitchStr !== 'undefined' ? pitchStr : `${livePitch.toFixed(1)}° Pitch`}
                              </motion.text>

                              <motion.text 
                                x={endX + 6} fill="#ff00d2" fontSize="7.5" fontWeight="black" textAnchor="start" filter="url(#neonGlowLV)"
                                initial={{ opacity: 0 }} animate={{ opacity: 1, y: (horizonY + liveDropY) / 2 + 3 }} transition={springPhysics}
                              >
                                {typeof gradeStr !== 'undefined' ? gradeStr : `${gradePercent.toFixed(1)}% Grade`}
                              </motion.text>
                            </g>
                          );
                        })()}
                      </svg>
                    );
                  })()}
                </div>
                {/* --- END OF UPGRADED LIVE SENSOR DIAGRAM --- */}
                
                {/* Sensor Enable Button */}
                <button 
                  onClick={() => {
                    if (typeof DeviceOrientationEvent !== 'undefined' && 
                        typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
                      (DeviceOrientationEvent as any).requestPermission()
                        .then((state: string) => { if (state === 'granted') window.location.reload(); })
                        .catch(console.error);
                    } else {
                      alert("Motion sensors enabled for Android");
                    }
                  }} 
                  className={`px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center gap-2 ${theme === 'dark' ? 'bg-[#111] border border-[#333] text-[#888] hover:text-white' : 'bg-white border border-[#ccc] text-[#666] hover:text-black shadow-sm'}`}
                >
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                  Enable Sensors
                </button>

                {/* Refined Dials */}
                <div className="flex w-full justify-around items-center pt-2 pb-4">
                  <div className="flex flex-col items-center gap-4">
                    <div className={`relative w-28 h-28 rounded-full border-2 overflow-hidden flex items-center justify-center ${theme === 'dark' ? 'border-[#222] bg-[#0a0a0a]' : 'border-[#ccc] bg-white shadow-inner'}`}>
                      <div className={`absolute w-full h-[1px] ${theme === 'dark' ? 'bg-[#333]' : 'bg-[#ddd]'}`}></div>
                      <div className={`absolute h-full w-[1px] ${theme === 'dark' ? 'bg-[#333]' : 'bg-[#ddd]'}`}></div>
                      <div className={`absolute w-3 h-3 rounded-full border ${theme === 'dark' ? 'border-[#444]' : 'border-[#bbb]'}`}></div>
                      <div className="absolute inset-2 flex items-center justify-center">
                         <motion.div animate={{ y: (isSlopeLocked && lockedAngle !== null ? lockedAngle * 1.5 : orientation.beta * 1.5) }}
                            className="w-7 h-7 rounded-full bg-accent shadow-[0_0_15px_#00d2ff] mix-blend-screen transition-transform duration-75" />
                      </div>
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-[#888]">Pitch (Y)</span>
                  </div>

                  <div className="flex flex-col items-center gap-4">
                    <div className={`relative w-28 h-28 rounded-full border-2 overflow-hidden flex items-center justify-center ${theme === 'dark' ? 'border-[#222] bg-[#0a0a0a]' : 'border-[#ccc] bg-white shadow-inner'}`}>
                      <div className={`absolute w-full h-[1px] ${theme === 'dark' ? 'bg-[#333]' : 'bg-[#ddd]'}`}></div>
                      <div className={`absolute h-full w-[1px] ${theme === 'dark' ? 'bg-[#333]' : 'bg-[#ddd]'}`}></div>
                      <div className={`absolute w-3 h-3 rounded-full border ${theme === 'dark' ? 'border-[#444]' : 'border-[#bbb]'}`}></div>
                      <div className="absolute inset-2 flex items-center justify-center">
                         <motion.div animate={{ x: (isSlopeLocked && lockedRoll !== null ? lockedRoll * 1.5 : orientation.gamma * 1.5) }}
                            className="w-7 h-7 rounded-full bg-accent shadow-[0_0_15px_#00d2ff] mix-blend-screen transition-transform duration-75" />
                      </div>
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-[#888]">Roll (X)</span>
                  </div>
                </div>

                {/* Calculate/Unlock Button */}
                <button 
                  onClick={() => {
                    if (isSlopeLocked) {
                      setisSlopeLocked(false);
                      setlockedAngle(null);
                      setlockedRoll(null);
                    } else {
                      setisSlopeLocked(true);
                      setlockedAngle(Math.abs(orientation.beta));
                      setlockedRoll(orientation.gamma);
                    }
                  }}
                  className={`w-full p-4 rounded-xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all shadow-md ${isSlopeLocked ? 'bg-red-500 text-white' : 'bg-accent text-black'}`}
                >
                  {isSlopeLocked ? 'Unlock Slope' : 'Calculate Slope'}
                </button>
              </div>

              {/* Hero Result */}
              {results.main && (
                <div className={`mt-6 pt-5 border-t w-full ${theme === 'dark' ? 'border-[#222]/40' : 'border-[#ddd]'}`}>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className={`text-center border rounded-xl p-6 shadow-lg relative overflow-hidden ${theme === 'dark' ? 'bg-[#111] border-[#222]' : 'bg-gray-50 border-[#ccc]'}`}>
                      <span className="block text-[10px] font-black uppercase tracking-widest text-accent opacity-80 mb-2">Pitch (Rise)</span>
                      <span className={`text-3xl font-black font-mono tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                        {(isSlopeLocked && lockedAngle !== null ? lockedAngle : Math.abs(orientation.beta)).toFixed(1)}°
                      </span>
                    </div>
                    <div className={`text-center border rounded-xl p-6 shadow-lg relative overflow-hidden ${theme === 'dark' ? 'bg-[#111] border-[#222]' : 'bg-gray-50 border-[#ccc]'}`}>
                      <span className="block text-[10px] font-black uppercase tracking-widest text-accent opacity-80 mb-2">Roll (Level)</span>
                      <span className={`text-3xl font-black font-mono tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                        {(isSlopeLocked && lockedRoll !== null ? Math.abs(lockedRoll) : Math.abs(orientation.gamma)).toFixed(1)}°
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Locked Output List */}
              {isSlopeLocked && results.sub && results.sub.length > 0 && (
                <div className="space-y-1.5 mt-2">
                  {results.sub.map((item: any, idx: number) => {
                    const isHeader = item.label.includes('---');
                    const isWarning = item.warning;

                    if (isWarning) {
                      return (
                        <div key={idx} className="flex justify-between items-center p-3 my-2 rounded-xl bg-red-500/10 border border-red-500/30 text-xs">
                          <span className="text-red-500 font-bold uppercase tracking-wide">{item.label}</span>
                          <span className="text-red-500 font-mono font-black text-right">{item.value}</span>
                        </div>
                      );
                    }

                    return (
                      <div 
                        key={idx} 
                        className={`flex justify-between items-center py-2.5 px-3 rounded-lg transition-colors ${
                          isHeader 
                            ? 'mt-4 mb-1 border-none bg-accent/10 dark:bg-accent/5' 
                            : theme === 'dark' ? 'border-b border-[#222]/40 hover:bg-white/[0.02]' : 'border-b border-[#ddd]/60 hover:bg-black/[0.02]'
                        }`}
                      >
                        <span className={`${
                          isHeader 
                            ? 'text-accent font-black uppercase tracking-widest text-[10px]' 
                            : `text-xs opacity-80 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`
                        }`}>
                          {item.label.replace(/-/g, '').trim()}
                        </span>
                        
                        {!isHeader && (
                          <span className={`font-bold font-mono text-right ${
                            item.highlight 
                              ? 'text-accent text-sm tracking-wide font-black' 
                              : theme === 'dark' ? 'text-white text-xs' : 'text-black text-xs'
                          }`}>
                            {item.value}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Standardized Clear Button (Moved to bottom below results) */}
              <button onClick={() => resetTool('lv')}
                className={`w-full mt-4 p-3 rounded-xl font-black tracking-widest text-[10px] uppercase active:scale-95 transition-all ${theme === 'dark' ? 'bg-[#111] border border-red-500/30 text-red-500 hover:bg-red-500/10' : 'bg-red-50 text-red-500 border border-red-200 hover:bg-red-100'}`}
              >
                Clear Tool
              </button>              
            </div>
          )}

					{/* Masonry Master Tool Block */}
					{activeTool === 'bc' && (
						<div className="space-y-4">
							{/* --- UPGRADED LIVE DYNAMIC DIAGRAM --- */}
							{(() => {
								return (
										<svg viewBox="0 0 200 140" className="w-full max-w-[260px] h-auto overflow-visible transition-all duration-500">
                      <defs>
                        <filter id="neonGlowBC" x="-50%" y="-50%" width="200%" height="200%">
                          <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur1" />
                          <feMerge><feMergeNode in="blur1" /><feMergeNode in="SourceGraphic" /></feMerge>
                        </filter>
                        <pattern id="scanlinesBC" patternUnits="userSpaceOnUse" width="4" height="4">
                          <line x1="0" y1="0" x2="4" y2="0" stroke={theme === 'dark' ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"} strokeWidth="1" />
                        </pattern>
                      </defs>

                      <rect x="-10" y="-10" width="220" height="160" fill="url(#scanlinesBC)" rx="8" />

                      {(() => {
                        const isCMU = mmMaterial === 'cmu';

                        // 1. Math Engine: Safely compile feet, inches, and fractions for labels
                        const subDivisor = unitMode === 'imp' ? 12 : 100;

                        // Wall Length (A)
                        const ftA = parseFloat(a1) || 0;
                        const inA = parseFloat(a2) || 0;
                        const fracA = parseFloat(a4) ? (parseFloat(a3) || 0) / parseFloat(a4) : 0;
                        const valA = ftA + (inA + fracA) / subDivisor;

                        // Wall Height (B)
                        const ftB = parseFloat(b1) || 0;
                        const inB = parseFloat(b2) || 0;
                        const fracB = parseFloat(b4) ? (parseFloat(b3) || 0) / parseFloat(b4) : 0;
                        const valB = ftB + (inB + fracB) / subDivisor;

                        // 2. Format Exact Labels
                        const displayLength = valA > 0 
                          ? (unitMode === 'imp' ? `Length: ${a1 || 0}' ${a2 || 0}${a3 && a4 ? ` ${a3}/${a4}` : ''}"` : `Length: ${valA.toFixed(2)} m`)
                          : 'Wall Length';
                          
                        const displayHeight = valB > 0 
                          ? (unitMode === 'imp' ? `Height: ${b1 || 0}' ${b2 || 0}${b3 && b4 ? ` ${b3}/${b4}` : ''}"` : `Height: ${valB.toFixed(2)} m`)
                          : 'Wall Height';

                        return (
                          <g>
                            {isCMU ? (
                              // ==========================================
                              // CMU GRID (Large blocks, 3 courses)
                              // ==========================================
                              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                                
                                {/* Row 1 (Top) - Cores Visible */}
                                {[10, 54, 98, 142].map(x => (
                                  <g key={`c1-${x}`}>
                                    <rect x={x} y="35" width="40" height="20" fill="var(--color-accent)" opacity="0.15" stroke="var(--color-accent)" strokeWidth="1.5" />
                                    <rect x={x + 6} y="40" width="12" height="10" fill="var(--color-accent)" opacity="0.3" rx="1.5" />
                                    <rect x={x + 22} y="40" width="12" height="10" fill="var(--color-accent)" opacity="0.3" rx="1.5" />
                                  </g>
                                ))}
                                
                                {/* Row 2 (Middle) */}
                                {[-12, 32, 76, 120, 164].map(x => (
                                  <rect key={`c2-${x}`} x={x} y="59" width="40" height="20" fill="var(--color-accent)" opacity="0.15" stroke="var(--color-accent)" strokeWidth="1.5" />
                                ))}
                                
                                {/* Row 3 (Bottom) */}
                                {[10, 54, 98, 142].map(x => (
                                  <rect key={`c3-${x}`} x={x} y="83" width="40" height="20" fill="var(--color-accent)" opacity="0.15" stroke="var(--color-accent)" strokeWidth="1.5" />
                                ))}

                                {/* CMU Mortar Joint Highlight (Weaving through gaps) */}
                                <motion.path d="M 52 35 L 52 57 L 180 57" fill="none" stroke="#ff00d2" strokeWidth="2" filter="url(#neonGlowBC)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: 0.3 }} />
                                <text x="140" y="53" fill="#ff00d2" fontSize="5.5" fontWeight="black">Mortar Joint</text>
                                
                                {/* Block Specs */}
                                <text x="96" y="115" fill="var(--color-accent)" fontSize="6.5" fontWeight="bold" textAnchor="middle">CMU: 16" × 8"</text>
                              </motion.g>
                            ) : (
                              // ==========================================
                              // BRICK GRID (Small bricks, 6 courses)
                              // ==========================================
                              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                                
                                {/* Row 1 (Top) - Cores Visible */}
                                {[10, 37, 64, 91, 118, 145, 172].map(x => (
                                  <g key={`b1-${x}`}>
                                    <rect x={x} y="35" width="24" height="8" fill="var(--color-accent)" opacity="0.15" stroke="var(--color-accent)" strokeWidth="1.5" />
                                    <circle cx={x + 6} cy="39" r="2" fill="var(--color-accent)" opacity="0.4" />
                                    <circle cx={x + 12} cy="39" r="2" fill="var(--color-accent)" opacity="0.4" />
                                    <circle cx={x + 18} cy="39" r="2" fill="var(--color-accent)" opacity="0.4" />
                                  </g>
                                ))}
                                
                                {/* Row 2 */}
                                {[-3.5, 23.5, 50.5, 77.5, 104.5, 131.5, 158.5, 185.5].map(x => (
                                  <rect key={`b2-${x}`} x={x} y="46" width="24" height="8" fill="var(--color-accent)" opacity="0.15" stroke="var(--color-accent)" strokeWidth="1.5" />
                                ))}
                                {/* Row 3 */}
                                {[10, 37, 64, 91, 118, 145, 172].map(x => (
                                  <rect key={`b3-${x}`} x={x} y="57" width="24" height="8" fill="var(--color-accent)" opacity="0.15" stroke="var(--color-accent)" strokeWidth="1.5" />
                                ))}
                                {/* Row 4 */}
                                {[-3.5, 23.5, 50.5, 77.5, 104.5, 131.5, 158.5, 185.5].map(x => (
                                  <rect key={`b4-${x}`} x={x} y="68" width="24" height="8" fill="var(--color-accent)" opacity="0.15" stroke="var(--color-accent)" strokeWidth="1.5" />
                                ))}
                                {/* Row 5 */}
                                {[10, 37, 64, 91, 118, 145, 172].map(x => (
                                  <rect key={`b5-${x}`} x={x} y="79" width="24" height="8" fill="var(--color-accent)" opacity="0.15" stroke="var(--color-accent)" strokeWidth="1.5" />
                                ))}
                                {/* Row 6 */}
                                {[-3.5, 23.5, 50.5, 77.5, 104.5, 131.5, 158.5, 185.5].map(x => (
                                  <rect key={`b6-${x}`} x={x} y="90" width="24" height="8" fill="var(--color-accent)" opacity="0.15" stroke="var(--color-accent)" strokeWidth="1.5" />
                                ))}

                                {/* Brick Mortar Joint Highlight (Weaving through gaps) */}
                                <motion.path d="M 35.5 35 L 35.5 44.5 L 150 44.5" fill="none" stroke="#ff00d2" strokeWidth="1.5" filter="url(#neonGlowBC)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: 0.3 }} />
                                <text x="155" y="46.5" fill="#ff00d2" fontSize="5" fontWeight="black">Mortar Joint</text>
                                
                                {/* Block Specs */}
                                <text x="103" y="112" fill="var(--color-accent)" fontSize="6.5" fontWeight="bold" textAnchor="middle">Brick: 8" × 2-2/3"</text>
                              </motion.g>
                            )}

                            {/* --- INTERACTIVE DIMENSIONS (UPGRADED) --- */}
                            <text x="100" y="20" fill={theme === 'dark' ? '#fff' : '#000'} fontSize="7.5" fontWeight="bold" textAnchor="middle" className="cursor-pointer hover:fill-accent transition-colors" onClick={() => document.getElementById('input-bc-len')?.focus()}>
                              {displayLength}
                            </text>

                            <text x="-2" y="65" fill={theme === 'dark' ? '#fff' : '#000'} fontSize="7.5" fontWeight="bold" textAnchor="middle" transform="rotate(-90 -2 65)" className="cursor-pointer hover:fill-accent transition-colors" onClick={() => document.getElementById('input-bc-hei')?.focus()}>
                              {displayHeight}
                            </text>
                          </g>
                        );
                      })()}                     
                    </svg>
								);
							})()}
							{/* --- END OF UPGRADED LIVE DYNAMIC DIAGRAM --- */}
							
							{/* Material Toggle Pill */}
							<div className={`flex gap-1 p-1 rounded-xl border ${theme === 'dark' ? 'bg-[#333]/20 border-[#444]/30' : 'bg-gray-200/50 border-[#ddd]'}`}>
								<button onClick={() => setMmMaterial('brick')}
									className={`flex-1 flex flex-col items-center justify-center py-3 rounded-lg transition-all ${mmMaterial === 'brick' ? 'bg-accent text-black shadow-md' : 'text-[#888] hover:text-current'}`}
								>
									<span className="text-[10px] font-black uppercase tracking-widest">Standard Brick</span>
									<span className={`text-[8px] font-mono mt-0.5 ${mmMaterial === 'brick' ? 'text-black/70' : 'text-[#888]/70'}`}>(2-2/3" × 8")</span>
								</button>
								<button onClick={() => setMmMaterial('cmu')}
									className={`flex-1 flex flex-col items-center justify-center py-3 rounded-lg transition-all ${mmMaterial === 'cmu' ? 'bg-accent text-black shadow-md' : 'text-[#888] hover:text-current'}`}
								>
									<span className="text-[10px] font-black uppercase tracking-widest">Standard CMU</span>
									<span className={`text-[8px] font-mono mt-0.5 ${mmMaterial === 'cmu' ? 'text-black/70' : 'text-[#888]/70'}`}>(8" × 16")</span>
								</button>
							</div>

							{/* Primary Dimensions Card */}
							<div className="space-y-3 p-4 rounded-xl border border-[#333]/30 bg-black/5 dark:bg-white/5">
								<span className="block mb-1 text-[10px] font-black uppercase tracking-widest text-accent">Primary Wall Dimensions</span>
								<div id="input-bc-len">
									<InputRow label="Total Wall Run Length" v1={a1} v2={a2} v3={a3} v4={a4} setV1={setA1} setV2={setA2} setV3={setA3} setV4={setA4} mode={unitMode} theme={theme} onFocus={setActiveInput} {...getUnitProps('a')} />
								</div>
								<div id="input-bc-hei">
									<InputRow label="Total Wall Vertical Height" v1={b1} v2={b2} v3={b3} v4={b4} setV1={setB1} setV2={setB2} setV3={setB3} setV4={setB4} mode={unitMode} theme={theme} onFocus={setActiveInput} {...getUnitProps('b')} />
								</div>
							</div>

							{/* Secondary Deductions Card */}
							<div className={`space-y-3 p-4 rounded-xl border ${theme === 'dark' ? 'bg-[#0a0a0a] border-[#222]' : 'bg-gray-50 border-[#eee]'}`}>
								<div className="flex items-center justify-between mb-1">
									<span className="text-[10px] font-black uppercase tracking-widest text-[#888]">Rough Opening Deductions</span>
									<span className="text-[8px] font-bold uppercase tracking-widest text-accent/70 bg-accent/10 px-2 py-0.5 rounded-full">Optional</span>
								</div>
								<InputRow label="Opening Width" v1={c1} v2={c2} v3={c3} v4={c4} setV1={setC1} setV2={setC2} setV3={setC3} setV4={setC4} mode={unitMode} theme={theme} onFocus={setActiveInput} {...getUnitProps('c')} />
								<InputRow label="Opening Height" v1={d1} v2={d2} v3={d3} v4={d4} setV1={setD1} setV2={setD2} setV3={setD3} setV4={setD4} mode={unitMode} theme={theme} onFocus={setActiveInput} {...getUnitProps('d')} />
							</div>

							{/* Chunky Waste Factor Input */}
							<div className="flex flex-col pt-2">
								<span className="block mb-1.5 text-[0.65rem] font-black uppercase text-[#666]">Waste Factor (%)</span>
								<input type="number" value={waste} onChange={(e) => setWaste(e.target.value)} 
									className={`w-full border rounded-xl p-4 text-center font-black text-lg outline-none transition-colors shadow-sm ${theme === 'dark' ? 'bg-[#111] border-[#222] text-white focus:border-accent' : 'bg-gray-50 border-[#ccc] text-black focus:border-accent'}`} 
								/>
							</div>

							{/* Standardized Clear Button */}
							<button onClick={() => resetTool('bc')}
								className={`w-full mt-4 p-3 rounded-xl font-black tracking-widest text-[10px] uppercase active:scale-95 transition-all ${theme === 'dark' ? 'bg-[#111] border border-red-500/30 text-red-500 hover:bg-red-500/10' : 'bg-red-50 text-red-500 border border-red-200 hover:bg-red-100'}`}
							>
								Clear Masonry Master
							</button>

							{/* HERO CARD RESULT */}
							{results.main && (
								<div className={`mt-6 pt-5 border-t w-full ${theme === 'dark' ? 'border-[#222]/40' : 'border-[#ddd]'}`}>
									<div className={`mb-4 text-center border rounded-xl p-6 shadow-lg ${theme === 'dark' ? 'bg-[#111] border-[#222]' : 'bg-gray-50 border-[#ccc]'}`}>
										<span className="block text-[10px] font-black uppercase tracking-widest text-accent opacity-80 mb-2">Total Units Required</span>
										<span className={`text-5xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{results.main}</span>
									</div>
								</div>
							)}

							{/* UPGRADED SEGMENTED LIVE TEXT OUTPUT LIST */}
							{results.sub && results.sub.length > 0 && (
								<div className="space-y-1.5 mt-2">
									{results.sub.map((item: any, idx: number) => {
										const isHeader = item.label.includes('---');
										const isWarning = item.warning;

										if (isWarning) {
											return (
												<div key={idx} className="flex justify-between items-center p-3 my-2 rounded-xl bg-red-500/10 border border-red-500/30 text-xs">
													<span className="text-red-500 font-bold uppercase tracking-wide">{item.label}</span>
													<span className="text-red-500 font-mono font-black text-right">{item.value}</span>
												</div>
											);
										}

										return (
											<div 
												key={idx} 
												className={`flex justify-between items-center py-2.5 px-3 rounded-lg transition-colors ${
													isHeader 
														? 'mt-4 mb-1 border-none bg-accent/10 dark:bg-accent/5' 
														: theme === 'dark' ? 'border-b border-[#222]/40 hover:bg-white/[0.02]' : 'border-b border-[#ddd]/60 hover:bg-black/[0.02]'
												}`}
											>
												<span className={`${
													isHeader 
														? 'text-accent font-black uppercase tracking-widest text-[10px]' 
														: `text-xs opacity-80 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`
												}`}>
													{item.label.replace(/-/g, '').trim()}
												</span>
												
												{!isHeader && (
													<span className={`font-bold font-mono text-right ${
														item.highlight 
															? 'text-accent text-sm tracking-wide font-black' 
															: theme === 'dark' ? 'text-white text-xs' : 'text-black text-xs'
													}`}>
														{item.value}
													</span>
												)}
											</div>
										);
									})}
								</div>
							)}
						</div>
					)}

					{/* ================================================================= */}
					{/* GLOBAL OUTPUT LIST FALLBACK FOR ALL UNMODIFIED TOOLS              */}
					{/* ================================================================= */}
					{!['st', 'rr', 'tr', 'sq', 'lv', 'rm', 'si', 'df', 'wc', 'ds', 'tl', 'bc', 'oc' ].includes(activeTool) && results && (
						<div className={`mt-6 pt-4 border-t w-full ${theme === 'dark' ? 'border-[#222]/40' : 'border-[#ddd]'}`}>
							
							{/* Optional Main Highlight Result */}
							{results.main && (
								<div className={`mb-4 text-center border rounded-xl p-4 shadow-lg ${theme === 'dark' ? 'bg-[#111] border-[#222]' : 'bg-gray-50 border-[#ccc]'}`}>
									<span className="block text-[10px] font-black uppercase tracking-widest text-accent opacity-80 mb-1">Primary Result</span>
									<span className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{results.main}</span>
								</div>
							)}
							
							{/* Standard List Output for all other tools */}
              {results.sub && results.sub.length > 0 && (
                <div className="space-y-2">
                  <span className="block text-[9px] font-black uppercase tracking-widest text-[#555] mb-2">Calculation Results</span>
                  {results.sub.map((item: any, idx: number) => (
                    <div key={idx} className={`flex justify-between items-center py-2 border-b last:border-0 text-xs ${theme === 'dark' ? 'border-[#222]/30' : 'border-[#ddd]/50'} ${item.label.includes('---') ? 'border-none pt-5 pb-1' : ''}`}>
                      <span className={`opacity-70 ${item.label.includes('---') ? 'text-accent font-black uppercase tracking-widest text-[9px]' : theme === 'dark' ? 'text-white' : 'text-black'}`}>
                        {item.label.replace(/-/g, '')}
                      </span>
                      {/* PRO UPGRADE: Universal Highlight Support */}
                      <span className={`font-bold font-mono text-right ${item.highlight ? 'text-accent text-[13px] tracking-wide' : (theme === 'dark' ? 'text-white' : 'text-black')}`}>{item.value}</span>
                    </div>
                  ))}
                </div>
              )}
						</div>
					)}
					{/* UPGRADED GLOBAL SHARE BUTTON */}
					{results && results.main && results.main !== '0.000m' && results.main !== "0' 0\"" && (
						<div className="pt-8 pb-4">
							<button 
								onClick={handleShare}
								className="w-full bg-accent text-black p-4 rounded-xl font-black text-sm uppercase tracking-widest active:scale-95 transition-all shadow-[0_0_15px_rgba(0,210,255,0.3)] hover:brightness-110 flex items-center justify-center gap-2"
							>
								<Share strokeWidth={2.5} size={18}/>
								Share / Save Results
							</button>
						</div>
					)}					
				</div> {/* <-- This closes the tool-ui div if it isn't already there */}
									
				{/* Tributary Info Modal */}
				<AnimatePresence>
					{showTribInfo && (
						<div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
							<motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className={`w-full max-w-md rounded-2xl p-6 shadow-2xl ${theme=== 'dark' ? 'bg-[#111] text-white' : 'bg-white text-black'}`}>
								<div className="flex justify-between items-center mb-4">
									<h2 className="text-xl font-black uppercase tracking-tighter">What is Tributary Width?</h2>
									<button onClick={() => setShowTribInfo(false)} className="p-2 rounded-full bg-gray-500/10">
										<X size={20}/>
									</button>
								</div>
								<div className="space-y-4 text-sm leading-relaxed opacity-80">
									<p>Think of it as the "weight" area this beam is responsible for.</p>
									<div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
										<p className="font-bold text-accent mb-1">Example 1 (Deck):</p>
										<p>If your joists span 12' from the house to this beam, the house carries half (6') and the beam carries half (6').</p>
										<p className="mt-1 font-mono text-xs">Input: 6</p>
									</div>
									<div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
										<p className="font-bold text-accent mb-1">Example 2 (Center Beam):</p>
										<p>If this beam is in the middle of a room and joists are 10' long on both sides, it carries 5' from each side.</p>
										<p className="mt-1 font-mono text-xs">Input: 10</p>
									</div>
								</div>
								<button onClick={() => setShowTribInfo(false)}
									className="w-full mt-6 bg-accent text-black font-black py-4 rounded-xl uppercase tracking-widest"
								>
									Got It
								</button>
							</motion.div>
						</div>
					)}
					{/* Tool Documentation Modal */}
					{showDocModal && TOOL_DOCS[activeTool] && (
						<div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
							<motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className={`w-full max-w-md p-6 rounded-2xl border shadow-2xl ${theme=== 'dark' ? 'bg-[#0a0a0a] border-[#222]' : 'bg-white border-[#ddd]'}`}>
								<div className="flex justify-between items-center mb-6">
									<div className="flex items-center gap-3">
										<div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
											<Info className="w-5 h-5 text-accent"/>
										</div>
										<h2 className="text-lg font-black uppercase tracking-widest">
											{TOOLS.find(t => t.id === activeTool)?.name}
										</h2>
									</div>
									<button onClick={() => setShowDocModal(false)}
										className="p-2 rounded-full hover:bg-red-500/10 text-red-500 transition-colors"
									>
										<X className="w-6 h-6"/>
									</button>
								</div>

								<div className="space-y-6">
									<div>
										<h3 className="text-[10px] font-black uppercase tracking-widest text-accent mb-2">Definition</h3>
										<p className={`text-sm leading-relaxed ${theme=== 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
											{TOOL_DOCS[activeTool].def}
										</p>
									</div>

									<div>
										<h3 className="text-[10px] font-black uppercase tracking-widest text-accent mb-2">Example Case</h3>
										<div className={`p-4 rounded-xl border ${theme=== 'dark' ? 'bg-black/40 border-[#222]' : 'bg-gray-50 border-gray-200'}`}>
											<p className="text-sm italic">
												{TOOL_DOCS[activeTool].ex}
											</p>
										</div>
									</div>

									<div className="p-4 rounded-xl bg-accent/10 border border-accent/20">
										<h3 className="text-[10px] font-black uppercase tracking-widest text-accent mb-1">Safety / Pro-Tip</h3>
										<p className="text-xs font-bold leading-relaxed">
											{TOOL_DOCS[activeTool].tip}
										</p>
									</div>
								</div>

								<button onClick={() => setShowDocModal(false)}
									className="w-full mt-8 bg-accent text-black font-black py-4 rounded-xl uppercase tracking-widest shadow-[0_4px_15px_rgba(0,210,255,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all"
								>
									Got It
								</button>
							</motion.div>
						</div>
					)}
				</AnimatePresence>
			</div>
		</div>
  
		{/* UPGRADED MODAL */}
		<AnimatePresence>
			{showDisclaimer && (
				<motion.div 
					initial={{ opacity: 0 }} 
					animate={{ opacity: 1 }} 
					exit={{ opacity: 0 }} 
					className="fixed inset-0 z-[3000] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
				>
					<motion.div 
						initial={{ scale: 0.95, opacity: 0, y: 20 }} 
						animate={{ scale: 1, opacity: 1, y: 0 }} 
						exit={{ scale: 0.95, opacity: 0, y: 20 }} 
						className={`w-full max-w-sm rounded-3xl border shadow-2xl overflow-hidden ${theme === 'dark' ? 'bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] border-[#333]' : 'bg-gradient-to-b from-white to-gray-50 border-[#ddd]'}`}
					>
						<div className="p-8 space-y-6">
							
							{/* Icon & Title */}
							<div className="flex flex-col items-center text-center space-y-4">
								<div className={`w-14 h-14 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-accent/10 text-accent' : 'bg-[#0088cc]/10 text-[#0088cc]'}`}>
									<AlertTriangle size={28} strokeWidth={2.5} />
								</div>
								<h2 className={`text-xl font-black tracking-tight uppercase ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
									Structural Disclaimer
								</h2>
							</div>
							
							{/* Body Text */}
							<div className={`text-sm leading-relaxed text-center font-medium space-y-4 ${theme === 'dark' ? 'text-[#aaa]' : 'text-[#666]'}`}>
								<p>
									Calculations provided by <span className={`font-bold ${theme === 'dark' ? 'text-[#ddd]' : 'text-[#333]'}`}>Squared Pro</span> are estimates for reference only. 
								</p>
								<p>
									Structural requirements vary by local building codes (OBC) and specific engineering requirements. By using this app, you acknowledge that you are responsible for verifying all results with a licensed professional before starting construction.
								</p>
							</div>

							{/* Chunky Action Button */}
							<button 
								onClick={() => {
									localStorage.setItem('squared_disclaimer_accepted', 'true');
									setshowDisclaimer(false); 
								}}
								className="w-full bg-accent text-black font-bold p-3 rounded-lg"
							>
								I Understand
							</button>				
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
		{/* ================================================================= */}
		{/* --- GLOBAL APP MODALS & OVERLAYS ---                              */}
		{/* ================================================================= */}
		
		{/* 1. SETTINGS & PREFERENCES MODAL */}
		<AnimatePresence>
			{isSettingsOpen && (
				<div className="fixed inset-0 z-[5000] flex justify-end bg-black/60 backdrop-blur-sm" 
						 onClick={() => setIsSettingsOpen(false)}>
					
					<motion.div 
						initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
						transition={{ type: 'spring', damping: 25, stiffness: 200 }}
						className={`w-4/5 max-w-sm h-full border-l shadow-2xl flex flex-col ${theme === 'dark' ? 'bg-[#0a0a0a] border-[#222]' : 'bg-gray-50 border-[#ddd]'}`}
						onClick={(e) => e.stopPropagation()}
					>
						<div className={`pt-12 p-5 border-b flex justify-between items-center shadow-sm ${theme === 'dark' ? 'bg-[#111] border-[#222]' : 'bg-white border-[#eee]'}`}>
							<h2 className="text-xs font-black uppercase text-accent tracking-widest flex items-center gap-2">
								Settings & Prefs
							</h2>
							<button onClick={() => setIsSettingsOpen(false)} className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'hover:bg-[#222] text-[#888]' : 'hover:bg-gray-100 text-[#555]'}`}>
								<X size={18} />
							</button>
						</div>

						<div className="flex-1 overflow-y-auto p-5 space-y-6 no-scrollbar">
							
							{/* Theme Colors Grid */}
							<div className="space-y-2.5">
								<div className="flex items-center gap-2 text-[#888]">
									<Palette size={14} />
									<span className="text-[10px] font-black uppercase tracking-widest">Theme Accent</span>
								</div>
								<div className={`p-3.5 rounded-xl border flex justify-between shadow-sm ${theme === 'dark' ? 'bg-[#111] border-[#222]' : 'bg-white border-[#eee]'}`}>
									{[
										{ name: 'Pro Cyan', hex: '#00d2ff' },
										{ name: 'DeWalt Yellow', hex: '#febd17' },
										{ name: 'Milwaukee Red', hex: '#db0020' },
										{ name: 'Makita Teal', hex: '#008b8b' },
										{ name: 'Ridgid Orange', hex: '#f26522' }
									].map((color) => (
										<button
											key={color.name}
											onClick={() => setAccentColor(color.hex)}
											title={color.name}
											className={`w-8 h-8 rounded-full transition-transform active:scale-90 ${accentColor === color.hex ? 'ring-4 ring-offset-2 ring-offset-transparent ring-white shadow-lg scale-110' : 'opacity-70 hover:opacity-100'}`}
											style={{ backgroundColor: color.hex }}
										/>
									))}
								</div>
							</div>

							{/* Measurement Rules */}
							<div className="space-y-2.5">
								<div className="flex items-center gap-2 text-[#888]">
									<Scale size={14} />
									<span className="text-[10px] font-black uppercase tracking-widest">Measurement Rules</span>
								</div>
								<div className={`flex p-1 rounded-xl border ${theme === 'dark' ? 'bg-[#333]/20 border-[#444]/30' : 'bg-gray-200/50 border-[#ddd]'}`}>
									<button onClick={() => setunitMode('imp')} className={`flex-1 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${unitMode === 'imp' ? 'bg-accent text-black shadow-md' : 'text-[#888]'}`}>Imperial</button>
									<button onClick={() => setunitMode('met')} className={`flex-1 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${unitMode === 'met' ? 'bg-accent text-black shadow-md' : 'text-[#888]'}`}>Metric</button>
								</div>
							</div>

							{/* Device Behavior */}
							<div className="space-y-2.5">
								<div className="flex items-center gap-2 text-[#888]">
									<Smartphone size={14} />
									<span className="text-[10px] font-black uppercase tracking-widest">Device Behavior</span>
								</div>
								<div className={`p-3.5 rounded-xl border flex items-center justify-between shadow-sm ${theme === 'dark' ? 'bg-[#111] border-[#222]' : 'bg-white border-[#eee]'}`}>
									<div className="flex flex-col">
										<span className={`text-xs font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Interface Theme</span>
										<span className="text-[9px] text-[#888] mt-0.5">Toggle light/dark mode</span>
									</div>
									<button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="text-xl hover:scale-110 transition-transform">
										{theme === 'dark' ? '🌙' : '☀️'}
									</button>
								</div>

								<div className={`p-3.5 rounded-xl border flex flex-col justify-between shadow-sm ${theme === 'dark' ? 'bg-[#111] border-[#222]' : 'bg-white border-[#eee]'}`}>
									<div className="flex flex-col mb-2.5">
										<span className={`text-xs font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Text Scaling</span>
										<span className="text-[9px] text-[#888] mt-0.5">Increase app-wide font sizes</span>
									</div>
									<div className={`flex p-1 rounded-xl border ${theme === 'dark' ? 'bg-[#333]/20 border-[#444]/30' : 'bg-gray-200/50 border-[#ddd]'}`}>
										<button onClick={() => setTextSize('small')} className={`flex-1 py-2 text-[9px] font-bold uppercase tracking-widest rounded-lg transition-all ${textSize === 'small' ? 'bg-accent text-black shadow-md' : 'text-[#888]'}`}>Small</button>
										<button onClick={() => setTextSize('normal')} className={`flex-1 py-2 text-[9px] font-bold uppercase tracking-widest rounded-lg transition-all ${textSize === 'normal' ? 'bg-accent text-black shadow-md' : 'text-[#888]'}`}>Normal</button>
										<button onClick={() => setTextSize('large')} className={`flex-1 py-2 text-[9px] font-bold uppercase tracking-widest rounded-lg transition-all ${textSize === 'large' ? 'bg-accent text-black shadow-md' : 'text-[#888]'}`}>Large</button>
										<button onClick={() => setTextSize('xlarge')} className={`flex-1 py-2 text-[9px] font-bold uppercase tracking-widest rounded-lg transition-all ${textSize === 'xlarge' ? 'bg-accent text-black shadow-md' : 'text-[#888]'}`}>XL</button>
									</div>
								</div>

								<div className={`p-3.5 rounded-xl border flex items-center justify-between shadow-sm ${theme === 'dark' ? 'bg-[#111] border-[#222]' : 'bg-white border-[#eee]'}`}>
									<div className="flex flex-col">
										<span className={`text-xs font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Keep Screen Awake</span>
										<span className="text-[9px] text-[#888] mt-0.5">Prevents device lock</span>
									</div>
									<button onClick={() => setKeepAwake(!keepAwake)} className={`w-11 h-6 rounded-full relative transition-colors ${keepAwake ? 'bg-accent' : (theme === 'dark' ? 'bg-[#333]' : 'bg-gray-300')}`}>
										<motion.div animate={{ x: keepAwake ? 22 : 2 }} className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-sm"/>
									</button>
								</div>

								<div className={`p-3.5 rounded-xl border flex items-center justify-between shadow-sm ${theme === 'dark' ? 'bg-[#111] border-[#222]' : 'bg-white border-[#eee]'}`}>
									<div className="flex flex-col">
										<span className={`text-xs font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Tactile Haptics</span>
										<span className="text-[9px] text-[#888] mt-0.5">Vibrate on button taps</span>
									</div>
									<button onClick={() => setHaptics(!haptics)} className={`w-11 h-6 rounded-full relative transition-colors ${haptics ? 'bg-accent' : (theme === 'dark' ? 'bg-[#333]' : 'bg-gray-300')}`}>
										<motion.div animate={{ x: haptics ? 22 : 2 }} className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-sm"/>
									</button>
								</div>
							</div>

							<hr className={`my-4 ${theme === 'dark' ? 'border-[#333]/50' : 'border-[#ccc]/50'}`} />

							{/* About & Legal */}
							<div className="space-y-3">
								<div className={`p-4 rounded-xl border shadow-sm ${theme === 'dark' ? 'bg-gradient-to-br from-[#111] to-[#0a0a0a] border-[#333]/50' : 'bg-gradient-to-br from-white to-gray-50 border-[#ddd]'}`}>
									<h3 className={`text-[10px] font-black uppercase tracking-widest mb-2 ${theme === 'dark' ? 'text-[#888]' : 'text-[#aaa]'}`}>About the Developer</h3>
									<div className={`text-xs leading-relaxed space-y-2 ${theme === 'dark' ? 'text-[#ccc]' : 'text-[#555]'}`}>
										<p>Hey, I'm the creator of <span className="font-bold">Squared Pro</span>. I'm a professional carpenter by trade, and I built this to solve real, everyday layout problems we face on the job site.</p>
									</div>
									<a href="mailto:imbrokeapps@gmail.com?subject=Squared%20Pro%20Feedback" className="mt-3 flex items-center justify-center gap-2 w-full p-2.5 rounded-lg bg-accent text-black font-bold text-[10px] uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-transform">
										✉️ Send Feedback
									</a>
								</div>
								
								<button onClick={() => { setIsSettingsOpen(false); setshowDisclaimer(true); }}
									className={`w-full flex items-center justify-center gap-2 p-3.5 rounded-xl border transition-colors ${theme === 'dark' ? 'bg-[#111] border-[#333] hover:bg-[#222]' : 'bg-white border-[#ccc] hover:bg-gray-100'}`}
								>
									<Info size={15} className="text-accent" />
									<span className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Legal Disclaimer</span>
								</button>
							</div>

							<div className="pt-2 pb-6">
								<button className={`w-full p-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${theme === 'dark' ? 'bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500/20' : 'bg-red-50 border border-red-200 text-red-600 hover:bg-red-100'}`}>
									<Trash2 size={15} /> Reset All Data
								</button>
							</div>

						</div>
					</motion.div>
				</div>
			)}
		</AnimatePresence>

		{/* 2. REFERENCE CHART MODAL (INTERACTIVE) */}
		<AnimatePresence>
			{showReference && (
				<div className="fixed inset-0 z-[6000] flex justify-end bg-black/60 backdrop-blur-sm"
						 onClick={() => setshowReference(false)}>
					<motion.div 
						initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} 
						transition={{ type: 'spring', damping: 25, stiffness: 200 }} 
						className={`w-full sm:w-4/5 max-w-md h-full shadow-2xl flex flex-col ${theme === 'dark' ? 'bg-[#0a0a0a] border-l border-[#222]' : 'bg-gray-50 border-l border-[#ddd]'}`}
						onClick={(e) => e.stopPropagation()}
					>
						<div className={`flex-shrink-0 pt-12 p-5 flex justify-between items-center border-b ${theme === 'dark' ? 'bg-[#111] border-[#222]' : 'bg-white border-[#eee]'}`}>
							<h2 className="text-xs font-black uppercase text-accent tracking-widest flex items-center gap-2">
								<div className="w-2 h-2 bg-accent rounded-full"></div>
								Reference Chart (Tap to Apply)
							</h2>
							<button onClick={() => setshowReference(false)} className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'hover:bg-[#222] text-[#888]' : 'hover:bg-gray-100 text-[#555]'}`}>
								<X size={18} />
							</button>
						</div>
						
						<div className="flex-1 overflow-y-auto p-4 pb-12 no-scrollbar">
							<div className={`rounded-xl border overflow-hidden shadow-sm ${theme === 'dark' ? 'bg-[#111] border-[#333]/50' : 'bg-white border-[#ddd]'}`}>
								<div className={`grid grid-cols-3 p-3 border-b text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'bg-[#1a1a1a] border-[#333] text-[#666]' : 'bg-gray-100 border-[#eee] text-[#888]'}`}>
									<span className="pl-2">Fraction</span>
									<span className="text-center">Decimal</span>
									<span className="text-right pr-2">Tape Mark</span>
								</div>

								<div className="flex flex-col">
									{REFERENCE_CHART.map((item, idx) => (
										<button key={idx} onClick={() => {
											if (activeInput) {
												const hasFractionSetters = typeof activeInput.setNum === 'function' && typeof activeInput.setDen === 'function';
												const hasValueSetter = typeof activeInput.setV === 'function';
												if (hasFractionSetters) {
													activeInput.setNum!(item.n);
													activeInput.setDen!(item.den);
												} else if (hasValueSetter) {
													activeInput.setV!(item.d);
												}
											}
											setshowReference(false);
										}}
										className={`grid grid-cols-3 items-center p-3.5 transition-colors text-left ${theme === 'dark' ? 'even:bg-[#161616] odd:bg-transparent hover:bg-[#222]' : 'even:bg-gray-50 odd:bg-transparent hover:bg-gray-100'} ${idx !== REFERENCE_CHART.length - 1 ? (theme === 'dark' ? 'border-b border-[#222]' : 'border-b border-[#f5f5f5]') : ''}`}>
											<span className={`pl-2 font-black text-sm ${theme === 'dark' ? 'text-accent' : 'text-[#0088cc]'}`}>{item.f}</span>
											<span className={`text-center font-mono text-sm tracking-tighter ${theme === 'dark' ? 'text-[#ddd]' : 'text-[#333]'}`}>{item.d}</span>
											<span className={`text-right pr-2 text-[11px] italic font-medium ${theme === 'dark' ? 'text-[#666]' : 'text-[#999]'}`}>{item.m}</span>
										</button>
									))}
								</div>
							</div>
						</div>
					</motion.div>
				</div>
			)}
		</AnimatePresence>

		{/* 3. CODE HUB MODAL SLOT */}
		<CodeHubModal 
			isOpen={isCodeModalOpen} 
			onClose={() => setIsCodeModalOpen(false)} 
			unitMode={unitMode} 
			jurisdiction={jurisdiction} 
			onJurisdictionChange={setJurisdiction} 
		/>
	</div>
);
}

// --- HELPER FUNCTIONS (NOW OUTSIDE THE APP) ---
const getStandardCap = (model: string): number => {
  return TRUCK_CAPACITIES[model as keyof typeof TRUCK_CAPACITIES]?.cap || 1500;
};

function InputRow({ 
  label, v1, v2, v3, v4, setV1, setV2, setV3, setV4, mode, theme, 
  hideFeet, hideInches, onFocus, unit, setUnit, hideM, hideMm, disabled 
}: any) {
  const isI = mode === 'imp';
  const inputClass = `w-full border rounded-lg p-3 text-center font-bold outline-none transition-all ${disabled ? 'opacity-30 cursor-not-allowed' : ''} ${theme === 'dark' ? 'bg-black border-[#333] text-white focus:border-accent' : 'bg-white border-[#999] text-black focus:border-accent'}`;
  
  let gridCols = 'grid-cols-[1fr_1fr_0.7fr_0.2fr_0.7fr]';
  if (isI) {
    if (hideFeet && hideInches) gridCols = 'grid-cols-[0.7fr_0.2fr_0.7fr]';
    else if (hideFeet) gridCols = 'grid-cols-[1fr_0.7fr_0.2fr_0.7fr]';
  }

  // Strip spaces from the label to create a clean HTML name tag
  const safeName = label ? label.replace(/\s+/g, '') : 'input';

  return (
    <div className={`flex flex-col p-2.5 rounded-xl border ${theme === 'dark' ? 'bg-[#111] border-[#222]' : 'bg-gray-100 border-[#ddd]'}`}>
      <div className="flex justify-between items-end mb-2">
        <span className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-[#aaa]' : 'text-[#555]'}`}>{label}</span>
        {!isI && setUnit && (
          <div className={`flex border rounded-md p-0.5 scale-75 origin-right ${theme === 'dark' ? 'bg-[#000] border-[#333]' : 'bg-white border-[#ccc]'}`}>
            {(['m', 'cm', 'mm'] as const).map(u => {
              if (u === 'm' && hideM) return null;
              if (u === 'mm' && hideMm) return null;
              return (
                <button key={u} onClick={() => setUnit(u)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all ${unit === u ? 'bg-accent text-black shadow-[0_0_5px_rgba(0,210,255,0.3)]' : 'text-[#555] hover:text-[#888]'}`}
                >
                  {u}
                </button>
              );
            })}
          </div>
        )}
      </div>
      {isI ? (
        <div className={`grid ${gridCols} gap-1.5 items-end`}>
          {!hideFeet && (
            <div className="flex flex-col gap-1">
              <span className="text-[8px] font-black text-[#888] text-center uppercase tracking-widest">Feet</span>
              <input type="number" name={`${safeName}FT`} value={v1} onFocus={() => onFocus?.({ setV: setV1 })} onChange={(e) => setV1(e.target.value)} disabled={disabled} className={inputClass} />
            </div>
          )}
          {!hideInches && (
            <div className="flex flex-col gap-1">
              <span className="text-[8px] font-black text-[#888] text-center uppercase tracking-widest">Inches</span>
              <input type="number" name={`${safeName}IN`} value={v2} onFocus={() => onFocus?.({ setV: setV2 })} onChange={(e) => setV2(e.target.value)} disabled={disabled} className={inputClass} />
            </div>
          )}
          <div className="flex flex-col gap-1">
            <span className="text-[8px] font-black text-[#888] text-center uppercase tracking-widest">Fraction</span>
            <input type="number" name={`${safeName}Num`} value={v3} onFocus={() => onFocus?.({ setV: setV3, setNum: setV3, setDen: setV4 })} onChange={(e) => setV3(e.target.value)} disabled={disabled} className={inputClass} />
          </div>
          <span className="text-center font-bold text-accent text-xl pb-2">/</span>
          <div className="flex flex-col gap-1">
            <span className="text-[8px] font-black text-transparent select-none">.</span>
            <input type="number" name={`${safeName}Den`} value={v4} onFocus={() => onFocus?.({ setV: setV4 || (() => {}), setNum: setV3, setDen: setV4 })} onChange={(e) => setV4?.(e.target.value)} disabled={disabled} className={inputClass} />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-1.5">
          <input type="number" name={`${safeName}MET`} value={v1} onFocus={() => onFocus?.({ setV: setV1 })} onChange={(e) => setV1(e.target.value)} disabled={disabled} placeholder={unit || 'mm'} className={inputClass} />
        </div>
      )}
    </div>
  );
}

function InputWrap({ value, onChange, placeholder, theme, disabled }: any) {
  return (
    <div className={`border rounded-lg p-3 flex items-center transition-colors ${theme === 'dark' ? 'bg-[#111] border-[#222] focus-within:border-accent' : 'bg-white border-[#ddd] focus-within:border-accent'} ${disabled ? 'opacity-50' : ''}`}>
      <input type="number" value={value} onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="bg-transparent border-none text-base w-full outline-none text-center"
      />
    </div>
  );
}