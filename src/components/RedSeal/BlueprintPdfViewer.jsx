import React, { useState, useMemo, useRef } from 'react'
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Minimize2, 
  Download, 
  Printer, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  RefreshCw,
  FileText,
  Layers,
  Info,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react'

export default function BlueprintPdfViewer() {
  const [currentPage, setCurrentPage] = useState(1)
  const [zoom, setZoom] = useState(100)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [theme, setTheme] = useState('classic') // 'classic' (blueprint blue), 'cad' (black/gray), 'light' (print white)
  const [searchQuery, setSearchQuery] = useState('')
  const [toastMessage, setToastMessage] = useState(null)
  
  const viewerRef = useRef(null)

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const handlePrint = () => {
    showToast("Preparing document for print spooler...")
    setTimeout(() => {
      showToast("Sent Official_RS_Carpentry_Blueprints.pdf to system printer!")
    }, 1200)
  }

  const handleDownload = () => {
    showToast("Generating secure PDF download token...")
    setTimeout(() => {
      showToast("Download started: Official_RS_Carpentry_Blueprints.pdf successfully saved.")
    }, 1200)
  }

  // Define 3 highly-detailed SVG blueprint pages
  const pages = [
    {
      page: 1,
      title: "A-101: Foundation Layout & Excavation Batter Boards",
      scale: "Scale: 1/4\" = 1'-0\" (Metric: 1:50)",
      description: "Illustrates the location of batter boards outside of the excavation line, string layouts, diagonal squaring checks (3-4-5 rule), and benchmark elevation points.",
      content: (
        <svg viewBox="0 0 800 500" width="100%" height="100%" className="w-full h-full select-none">
          {/* Background based on theme */}
          <rect width="800" height="500" fill={theme === 'classic' ? '#0f2b48' : (theme === 'cad' ? '#111827' : '#fafafa')} />
          
          {/* Grid lines */}
          <g stroke={theme === 'classic' ? 'rgba(255,255,255,0.04)' : (theme === 'cad' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)')} strokeWidth="1">
            {Array.from({ length: 16 }).map((_, i) => (
              <line key={`v-${i}`} x1={i * 50} y1="0" x2={i * 50} y2="500" />
            ))}
            {Array.from({ length: 10 }).map((_, i) => (
              <line key={`h-${i}`} x1="0" y1={i * 50} x2="800" y2={i * 50} />
            ))}
          </g>

          {/* Border line */}
          <rect x="20" y="20" width="760" height="460" fill="none" stroke={theme === 'light' ? '#1e293b' : '#38bdf8'} strokeWidth="2" strokeDasharray={theme === 'light' ? 'none' : '4 4'} />

          {/* Title Block on Bottom/Right */}
          <g transform="translate(560, 390)" stroke={theme === 'light' ? '#1e293b' : '#38bdf8'} strokeWidth="1">
            <rect width="200" height="80" fill={theme === 'light' ? '#f1f5f9' : '#1e3a5f'} opacity="0.9" />
            <line x1="0" y1="25" x2="200" y2="25" />
            <line x1="0" y1="50" x2="200" y2="50" />
            <line x1="100" y1="50" x2="100" y2="80" />
            
            {/* Title Block Text */}
            <text x="10" y="16" fill={theme === 'light' ? '#0f172a' : '#ffffff'} fontSize="9" fontWeight="bold">RED SEAL OCCUPATIONAL STANDARD</text>
            <text x="10" y="40" fill={theme === 'light' ? '#334155' : '#38bdf8'} fontSize="10" fontWeight="extrabold">FOUNDATION & SITE PLAN</text>
            <text x="10" y="68" fill={theme === 'light' ? '#0f172a' : '#ffffff'} fontSize="8" fontWeight="bold">DWG NO: A-101</text>
            <text x="110" y="68" fill={theme === 'light' ? '#0f172a' : '#ffffff'} fontSize="8" fontWeight="bold">REV: 02</text>
          </g>

          {/* Drawing Content */}
          {/* Excavation Pit (dashed boundary) */}
          <rect x="120" y="100" width="460" height="260" fill="none" stroke="#f43f5e" strokeWidth="2" strokeDasharray="8 4" />
          <text x="130" y="120" fill="#f43f5e" fontSize="10" fontWeight="bold">EXCAVATION DIRT LIMITS</text>

          {/* Concrete Footing Outline (solid outline) */}
          <rect x="160" y="130" width="380" height="200" fill="none" stroke={theme === 'light' ? '#0f172a' : '#ffffff'} strokeWidth="4" />
          <text x="180" y="155" fill={theme === 'light' ? '#1e293b' : '#38bdf8'} fontSize="12" fontWeight="black">FOUNDATION FOOTING OUTLINE</text>

          {/* Batter boards at corners */}
          {/* Top-Left Batter Board */}
          <g transform="translate(70, 50)" stroke={theme === 'light' ? '#0284c7' : '#34d399'} strokeWidth="2">
            <line x1="10" y1="20" x2="50" y2="20" />
            <line x1="50" y1="20" x2="50" y2="60" />
            {/* Stakes */}
            <circle cx="10" cy="20" r="3" fill="#ef4444" />
            <circle cx="50" cy="20" r="3" fill="#ef4444" />
            <circle cx="50" cy="60" r="3" fill="#ef4444" />
            <text x="15" y="15" fill={theme === 'light' ? '#0369a1' : '#34d399'} fontSize="8" fontWeight="black" stroke="none">BATTER BOARD</text>
          </g>

          {/* Top-Right Batter Board */}
          <g transform="translate(620, 50)" stroke={theme === 'light' ? '#0284c7' : '#34d399'} strokeWidth="2">
            <line x1="10" y1="20" x2="50" y2="20" />
            <line x1="10" y1="20" x2="10" y2="60" />
            {/* Stakes */}
            <circle cx="10" cy="20" r="3" fill="#ef4444" />
            <circle cx="50" cy="20" r="3" fill="#ef4444" />
            <circle cx="10" cy="60" r="3" fill="#ef4444" />
          </g>

          {/* Bottom-Left Batter Board */}
          <g transform="translate(70, 370)" stroke={theme === 'light' ? '#0284c7' : '#34d399'} strokeWidth="2">
            <line x1="10" y1="60" x2="50" y2="60" />
            <line x1="50" y1="20" x2="50" y2="60" />
            {/* Stakes */}
            <circle cx="10" cy="60" r="3" fill="#ef4444" />
            <circle cx="50" cy="60" r="3" fill="#ef4444" />
            <circle cx="50" cy="20" r="3" fill="#ef4444" />
          </g>

          {/* String lines stretched between batter boards */}
          {/* Horizontal strings */}
          <line x1="80" y1="130" x2="630" y2="130" stroke="#fbbf24" strokeWidth="1" strokeDasharray="2 2" />
          <line x1="80" y1="330" x2="630" y2="330" stroke="#fbbf24" strokeWidth="1" strokeDasharray="2 2" />
          {/* Vertical strings */}
          <line x1="160" y1="70" x2="160" y2="430" stroke="#fbbf24" strokeWidth="1" strokeDasharray="2 2" />
          <line x1="540" y1="70" x2="540" y2="430" stroke="#fbbf24" strokeWidth="1" strokeDasharray="2 2" />
          <text x="300" y="85" fill="#fbbf24" fontSize="9" fontWeight="bold">LAYOUT STRING LINE (TRUE WALL ALIGNMENT)</text>

          {/* Squaring Check diagonal indicator (3-4-5 rule) */}
          <g transform="translate(160,130)" stroke="#10b981" strokeWidth="2">
            <line x1="0" y1="0" x2="90" y2="120" strokeDasharray="3 3" />
            <line x1="0" y1="0" x2="0" y2="120" />
            <line x1="0" y1="120" x2="90" y2="120" />
            <rect x="0" y="110" width="10" height="10" fill="none" stroke="#10b981" />
            {/* Text measurements */}
            <text x="-25" y="65" fill="#10b981" fontSize="10" fontWeight="bold" stroke="none">3 units</text>
            <text x="35" y="135" fill="#10b981" fontSize="10" fontWeight="bold" stroke="none">4 units</text>
            <text x="50" y="55" fill="#10b981" fontSize="10" fontWeight="black" stroke="none">5 units (SQUARE)</text>
          </g>

          {/* Benchmark elevation point */}
          <g transform="translate(680, 200)">
            <circle cx="20" cy="20" r="15" fill="none" stroke="#ef4444" strokeWidth="2.5" />
            <line x1="5" y1="20" x2="35" y2="20" stroke="#ef4444" strokeWidth="2.5" />
            <line x1="20" y1="5" x2="20" y2="35" stroke="#ef4444" strokeWidth="2.5" />
            <text x="45" y="24" fill={theme === 'light' ? '#ef4444' : '#f87171'} fontSize="10" fontWeight="black">BM ELEV: 100.00m</text>
            <text x="45" y="36" fill={theme === 'light' ? '#475569' : '#cbd5e1'} fontSize="8" fontWeight="bold">MASTER REFERENCE DATUM</text>
          </g>

          {/* Dimensions */}
          {/* Width Dimension Line */}
          <g transform="translate(160, 350)" stroke={theme === 'light' ? '#475569' : '#a5f3fc'} strokeWidth="1">
            <line x1="0" y1="0" x2="380" y2="0" />
            <line x1="0" y1="-10" x2="0" y2="10" />
            <line x1="380" y1="-10" x2="380" y2="10" />
            <text x="190" y="-8" fill={theme === 'light' ? '#334155' : '#e0f2fe'} fontSize="11" fontWeight="extrabold" textAnchor="middle" stroke="none">38'-0" (11,580 mm)</text>
          </g>

          {/* Height Dimension Line */}
          <g transform="translate(560, 130)" stroke={theme === 'light' ? '#475569' : '#a5f3fc'} strokeWidth="1">
            <line x1="0" y1="0" x2="0" y2="200" />
            <line x1="-10" y1="0" x2="10" y2="0" />
            <line x1="-10" y1="200" x2="10" y2="200" />
            <text x="15" y="105" fill={theme === 'light' ? '#334155' : '#e0f2fe'} fontSize="11" fontWeight="extrabold" stroke="none">20'-0" (6096 mm)</text>
          </g>

          {/* Section Callout */}
          <g transform="translate(350, 230)">
            <circle cx="0" cy="0" r="12" fill={theme === 'light' ? '#e2e8f0' : '#1e3a5f'} stroke="#38bdf8" strokeWidth="2" />
            <line x1="-30" y1="0" x2="30" y2="0" stroke="#38bdf8" strokeWidth="2" />
            <polygon points="-30,0 -24,-6 -24,6" fill="#38bdf8" />
            <polygon points="30,0 24,-6 24,6" fill="#38bdf8" />
            <text x="0" y="4" fill={theme === 'light' ? '#0f172a' : '#ffffff'} fontSize="9" fontWeight="black" textAnchor="middle">S-1</text>
          </g>

          {/* Search match overlay */}
          {searchQuery && "batter".includes(searchQuery.toLowerCase()) && (
            <rect x="65" y="42" width="130" height="30" fill="yellow" opacity="0.3" rx="4" />
          )}
          {searchQuery && "elevation".includes(searchQuery.toLowerCase()) && (
            <rect x="670" y="180" width="120" height="60" fill="yellow" opacity="0.3" rx="4" />
          )}
        </svg>
      )
    },
    {
      page: 2,
      title: "S-201: Structural Floor & Joist Span Framing Layout",
      scale: "Scale: 1/4\" = 1'-0\" (Metric: 1:50)",
      description: "Details the joist direction, spacing (16\" o.c.), doubled headers, trimmer studs framing stairwell opening, and load-bearing beam placements.",
      content: (
        <svg viewBox="0 0 800 500" width="100%" height="100%" className="w-full h-full select-none">
          {/* Background based on theme */}
          <rect width="800" height="500" fill={theme === 'classic' ? '#0f2b48' : (theme === 'cad' ? '#111827' : '#fafafa')} />
          
          {/* Grid lines */}
          <g stroke={theme === 'classic' ? 'rgba(255,255,255,0.04)' : (theme === 'cad' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)')} strokeWidth="1">
            {Array.from({ length: 16 }).map((_, i) => (
              <line key={`v-${i}`} x1={i * 50} y1="0" x2={i * 50} y2="500" />
            ))}
            {Array.from({ length: 10 }).map((_, i) => (
              <line key={`h-${i}`} x1="0" y1={i * 50} x2="800" y2={i * 50} />
            ))}
          </g>

          {/* Border line */}
          <rect x="20" y="20" width="760" height="460" fill="none" stroke={theme === 'light' ? '#1e293b' : '#38bdf8'} strokeWidth="2" strokeDasharray={theme === 'light' ? 'none' : '4 4'} />

          {/* Title Block */}
          <g transform="translate(560, 390)" stroke={theme === 'light' ? '#1e293b' : '#38bdf8'} strokeWidth="1">
            <rect width="200" height="80" fill={theme === 'light' ? '#f1f5f9' : '#1e3a5f'} opacity="0.9" />
            <line x1="0" y1="25" x2="200" y2="25" />
            <line x1="0" y1="50" x2="200" y2="50" />
            <line x1="100" y1="50" x2="100" y2="80" />
            <text x="10" y="16" fill={theme === 'light' ? '#0f172a' : '#ffffff'} fontSize="9" fontWeight="bold">RED SEAL OCCUPATIONAL STANDARD</text>
            <text x="10" y="40" fill={theme === 'light' ? '#334155' : '#38bdf8'} fontSize="10" fontWeight="extrabold">FLOOR FRAMING PLAN</text>
            <text x="10" y="68" fill={theme === 'light' ? '#0f172a' : '#ffffff'} fontSize="8" fontWeight="bold">DWG NO: S-201</text>
            <text x="110" y="68" fill={theme === 'light' ? '#0f172a' : '#ffffff'} fontSize="8" fontWeight="bold">REV: 01</text>
          </g>

          {/* Sill Plates and Foundation Line */}
          <rect x="100" y="80" width="600" height="300" fill="none" stroke={theme === 'light' ? '#1e293b' : '#ffffff'} strokeWidth="5" />
          <text x="110" y="105" fill={theme === 'light' ? '#475569' : '#a5f3fc'} fontSize="10" fontWeight="bold">FOUNDATION MASONRY CRADLE</text>

          {/* Double Sill Plate */}
          <rect x="105" y="85" width="590" height="290" fill="none" stroke="#fbbf24" strokeWidth="1.5" />

          {/* Primary Bearing Beam (LVL/Steel Beam) */}
          <line x1="100" y1="230" x2="700" y2="230" stroke="#f43f5e" strokeWidth="8" />
          <text x="250" y="222" fill="#f43f5e" fontSize="11" fontWeight="black">3-PLY 2x10 STRUCTURAL BUILT-UP BEAM (SUPPORT)</text>

          {/* Floor Joists spaced across the layout */}
          {/* Top Half Joists */}
          {Array.from({ length: 15 }).map((_, i) => {
            const x = 120 + i * 40
            return (
              <g key={`joist-t-${i}`}>
                <line x1={x} y1="85" x2={x} y2="230" stroke={theme === 'light' ? '#64748b' : '#38bdf8'} strokeWidth="2.5" />
                {/* Overlap at beam */}
                <line x1={x + 4} y1="220" x2={x + 4} y2="235" stroke={theme === 'light' ? '#64748b' : '#38bdf8'} strokeWidth="2.5" />
              </g>
            )
          })}

          {/* Bottom Half Joists */}
          {Array.from({ length: 15 }).map((_, i) => {
            const x = 120 + i * 40
            return (
              <line key={`joist-b-${i}`} x1={x} y1="230" x2={x} y2="375" stroke={theme === 'light' ? '#64748b' : '#38bdf8'} strokeWidth="2.5" />
            )
          })}

          {/* Stair Opening Block */}
          <g transform="translate(320, 110)">
            {/* Cut out the joists inside this area */}
            <rect x="0" y="0" width="160" height="85" fill={theme === 'classic' ? '#0f2b48' : (theme === 'cad' ? '#111827' : '#fafafa')} stroke="none" />
            
            {/* Double Headers */}
            <line x1="0" y1="0" x2="160" y2="0" stroke="#fbbf24" strokeWidth="5" />
            <line x1="0" y1="85" x2="160" y2="85" stroke="#fbbf24" strokeWidth="5" />

            {/* Double Trimmers */}
            <line x1="0" y1="0" x2="0" y2="85" stroke="#fbbf24" strokeWidth="5" />
            <line x1="160" y1="0" x2="160" y2="85" stroke="#fbbf24" strokeWidth="5" />

            <text x="80" y="40" fill={theme === 'light' ? '#1e293b' : '#ffffff'} fontSize="9" fontWeight="black" textAnchor="middle">STAIRWELL OPENING</text>
            <text x="80" y="55" fill="#fbbf24" fontSize="8" fontWeight="bold" textAnchor="middle">DOUBLED HEADERS & TRIMMERS</text>
          </g>

          {/* Bridging Line */}
          <line x1="100" y1="155" x2="700" y2="155" stroke="#10b981" strokeWidth="2.5" strokeDasharray="5 5" />
          <line x1="100" y1="305" x2="700" y2="305" stroke="#10b981" strokeWidth="2.5" strokeDasharray="5 5" />
          <text x="120" y="150" fill="#10b981" fontSize="9" fontWeight="bold">1x3 BRIDGING OR BLOCKING LINE (REQUIRED AS SPAN &gt; 7'-0")</text>

          {/* Details & Callouts */}
          {/* Joist size callout */}
          <g transform="translate(600, 120)">
            <line x1="0" y1="0" x2="-80" y2="40" stroke="#38bdf8" strokeWidth="1.5" />
            <circle cx="0" cy="0" r="3.5" fill="#38bdf8" />
            <rect x="-180" y="30" width="95" height="20" rx="4" fill={theme === 'light' ? '#e2e8f0' : '#1e3a5f'} stroke="#38bdf8" strokeWidth="1" />
            <text x="-132" y="43" fill={theme === 'light' ? '#0f172a' : '#ffffff'} fontSize="8.5" fontWeight="bold" textAnchor="middle">2x10 SPF JOISTS @ 16" o.c.</text>
          </g>

          <g transform="translate(480, 260)">
            <line x1="0" y1="0" x2="-30" y2="40" stroke="#f43f5e" strokeWidth="1.5" />
            <circle cx="0" cy="0" r="3.5" fill="#f43f5e" />
            <rect x="-110" y="30" width="130" height="20" rx="4" fill={theme === 'light' ? '#fecdd3' : '#881337'} stroke="#f43f5e" strokeWidth="1" />
            <text x="-45" y="43" fill={theme === 'light' ? '#9f1239' : '#fecdd3'} fontSize="8.5" fontWeight="black" textAnchor="middle">SPLICED OVERLAP (50mm / 2" MIN)</text>
          </g>

          {/* Dimensions */}
          <g transform="translate(100, 395)" stroke={theme === 'light' ? '#475569' : '#cbd5e1'} strokeWidth="1">
            <line x1="0" y1="0" x2="600" y2="0" />
            <line x1="0" y1="-8" x2="0" y2="8" />
            <line x1="600" y1="-8" x2="600" y2="8" />
            <text x="300" y="15" fill={theme === 'light' ? '#1e293b' : '#ffffff'} fontSize="10" fontWeight="extrabold" textAnchor="middle" stroke="none">TOTAL FRAME SPAN: 36'-0"</text>
          </g>

          {/* Search matches */}
          {searchQuery && "stair".includes(searchQuery.toLowerCase()) && (
            <rect x="315" y="105" width="170" height="95" fill="yellow" opacity="0.3" rx="4" />
          )}
          {searchQuery && "bridging".includes(searchQuery.toLowerCase()) && (
            <rect x="95" y="145" width="610" height="20" fill="yellow" opacity="0.3" rx="4" />
          )}
        </svg>
      )
    },
    {
      page: 3,
      title: "R-301: Roof Framing Profile & Structural Truss Elevations",
      scale: "Scale: 3/8\" = 1'-0\" (Metric: 1:30)",
      description: "Illustrates the geometric configuration of a standard King Post Roof Truss, including slope ratio, rafter connections, birdsmouth depth, and web locations.",
      content: (
        <svg viewBox="0 0 800 500" width="100%" height="100%" className="w-full h-full select-none">
          {/* Background based on theme */}
          <rect width="800" height="500" fill={theme === 'classic' ? '#0f2b48' : (theme === 'cad' ? '#111827' : '#fafafa')} />
          
          {/* Grid lines */}
          <g stroke={theme === 'classic' ? 'rgba(255,255,255,0.04)' : (theme === 'cad' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)')} strokeWidth="1">
            {Array.from({ length: 16 }).map((_, i) => (
              <line key={`v-${i}`} x1={i * 50} y1="0" x2={i * 50} y2="500" />
            ))}
            {Array.from({ length: 10 }).map((_, i) => (
              <line key={`h-${i}`} x1="0" y1={i * 50} x2="800" y2={i * 50} />
            ))}
          </g>

          {/* Border line */}
          <rect x="20" y="20" width="760" height="460" fill="none" stroke={theme === 'light' ? '#1e293b' : '#38bdf8'} strokeWidth="2" strokeDasharray={theme === 'light' ? 'none' : '4 4'} />

          {/* Title Block */}
          <g transform="translate(560, 390)" stroke={theme === 'light' ? '#1e293b' : '#38bdf8'} strokeWidth="1">
            <rect width="200" height="80" fill={theme === 'light' ? '#f1f5f9' : '#1e3a5f'} opacity="0.9" />
            <line x1="0" y1="25" x2="200" y2="25" />
            <line x1="0" y1="50" x2="200" y2="50" />
            <line x1="100" y1="50" x2="100" y2="80" />
            <text x="10" y="16" fill={theme === 'light' ? '#0f172a' : '#ffffff'} fontSize="9" fontWeight="bold">RED SEAL OCCUPATIONAL STANDARD</text>
            <text x="10" y="40" fill={theme === 'light' ? '#334155' : '#38bdf8'} fontSize="10" fontWeight="extrabold">ROOF TRUSS SECTIONAL</text>
            <text x="10" y="68" fill={theme === 'light' ? '#0f172a' : '#ffffff'} fontSize="8" fontWeight="bold">DWG NO: R-301</text>
            <text x="110" y="68" fill={theme === 'light' ? '#0f172a' : '#ffffff'} fontSize="8" fontWeight="bold">REV: 01</text>
          </g>

          {/* WALL STUDS/PLATE ON SIDES */}
          <rect x="100" y="300" width="40" height="150" fill={theme === 'light' ? '#e2e8f0' : '#1e293b'} stroke={theme === 'light' ? '#64748b' : '#475569'} strokeWidth="2" />
          <text x="120" y="380" fill={theme === 'light' ? '#1e293b' : '#ffffff'} fontSize="8.5" fontWeight="bold" textAnchor="middle" transform="rotate(-90 120 380)">EXTERIOR WALL</text>

          <rect x="660" y="300" width="40" height="150" fill={theme === 'light' ? '#e2e8f0' : '#1e293b'} stroke={theme === 'light' ? '#64748b' : '#475569'} strokeWidth="2" />
          <text x="680" y="380" fill={theme === 'light' ? '#1e293b' : '#ffffff'} fontSize="8.5" fontWeight="bold" textAnchor="middle" transform="rotate(90 680 380)">EXTERIOR WALL</text>

          {/* Double Top Plates */}
          <rect x="95" y="285" width="50" height="15" fill="#fbbf24" stroke="#d97706" />
          <rect x="655" y="285" width="50" height="15" fill="#fbbf24" stroke="#d97706" />

          {/* THE TRUSS STRUCTURE */}
          {/* Bottom Chord */}
          <line x1="80" y1="285" x2="720" y2="285" stroke={theme === 'light' ? '#1e293b' : '#ffffff'} strokeWidth="12" strokeLinecap="round" />
          <text x="400" y="307" fill={theme === 'light' ? '#475569' : '#cbd5e1'} fontSize="10" fontWeight="extrabold" textAnchor="middle">BOTTOM CHORD / CEILING JOIST (TIES RAFTERS)</text>

          {/* Top Chords (Slope) */}
          <line x1="80" y1="285" x2="400" y2="90" stroke="#f43f5e" strokeWidth="12" strokeLinecap="round" />
          <line x1="400" y1="90" x2="720" y2="285" stroke="#f43f5e" strokeWidth="12" strokeLinecap="round" />
          <text x="210" y="170" fill="#f43f5e" fontSize="10" fontWeight="black" transform="rotate(-28 210 170)">TOP CHORD (RAFTER)</text>
          <text x="590" y="170" fill="#f43f5e" fontSize="10" fontWeight="black" transform="rotate(28 590 170)">TOP CHORD (RAFTER)</text>

          {/* Central King Post (Vertical) */}
          <line x1="400" y1="90" x2="400" y2="285" stroke="#38bdf8" strokeWidth="12" />
          <text x="415" y="180" fill="#38bdf8" fontSize="11" fontWeight="black">KING POST (TENSION MEMBER)</text>

          {/* Web Struts (Angled) */}
          <line x1="400" y1="285" x2="240" y2="202" stroke="#10b981" strokeWidth="8" strokeLinecap="round" />
          <line x1="400" y1="285" x2="560" y2="202" stroke="#10b981" strokeWidth="8" strokeLinecap="round" />
          <text x="280" y="260" fill="#10b981" fontSize="9" fontWeight="bold">WEB STRUT</text>
          <text x="520" y="260" fill="#10b981" fontSize="9" fontWeight="bold">WEB STRUT</text>

          {/* Gusset Plates (Reinforcements) */}
          {/* Apex Gusset */}
          <polygon points="380,95 420,95 400,135" fill="#cbd5e1" stroke="#475569" strokeWidth="1" opacity="0.8" />
          {/* Bottom Joint Gussets */}
          <polygon points="100,285 140,260 140,285" fill="#cbd5e1" stroke="#475569" strokeWidth="1" opacity="0.8" />
          <polygon points="700,285 660,260 660,285" fill="#cbd5e1" stroke="#475569" strokeWidth="1" opacity="0.8" />
          {/* King Post Base Gusset */}
          <polygon points="375,285 425,285 400,245" fill="#cbd5e1" stroke="#475569" strokeWidth="1" opacity="0.8" />

          {/* Slope Ratio (6/12 Pitch) */}
          <g transform="translate(230, 110)">
            <line x1="0" y1="30" x2="40" y2="30" stroke="#f59e0b" strokeWidth="2" />
            <line x1="40" y1="10" x2="40" y2="30" stroke="#f59e0b" strokeWidth="2" />
            <line x1="0" y1="30" x2="40" y2="10" stroke="#f59e0b" strokeWidth="2" />
            <text x="20" y="42" fill="#f59e0b" fontSize="9" fontWeight="black" textAnchor="middle">12 (Run)</text>
            <text x="48" y="24" fill="#f59e0b" fontSize="9" fontWeight="black">6 (Rise)</text>
          </g>

          {/* Overhang details */}
          <g transform="translate(60, 310)">
            <line x1="20" y1="-25" x2="20" y2="10" stroke={theme === 'light' ? '#334155' : '#38bdf8'} strokeWidth="1.5" />
            <line x1="40" y1="-25" x2="40" y2="10" stroke={theme === 'light' ? '#334155' : '#38bdf8'} strokeWidth="1.5" />
            <line x1="20" y1="0" x2="40" y2="0" stroke={theme === 'light' ? '#334155' : '#38bdf8'} strokeWidth="1" />
            <text x="30" y="10" fill={theme === 'light' ? '#334155' : '#38bdf8'} fontSize="8" fontWeight="bold" textAnchor="middle">OH</text>
          </g>

          {/* Detailed Birdsmouth callout */}
          <g transform="translate(620, 340)">
            <rect x="-10" y="-10" width="120" height="30" rx="4" fill={theme === 'light' ? '#f1f5f9' : '#1e3a5f'} stroke="#e2e8f0" strokeWidth="1" />
            <text x="50" y="8" fill={theme === 'light' ? '#0f172a' : '#ffffff'} fontSize="8.5" fontWeight="extrabold" textAnchor="middle">BIRDSMOUTH CUT</text>
            <text x="50" y="18" fill="#fbbf24" fontSize="7.5" fontWeight="bold" textAnchor="middle">Max 1/3 Rafter Depth</text>
          </g>

          {/* Search matches */}
          {searchQuery && "king".includes(searchQuery.toLowerCase()) && (
            <rect x="380" y="100" width="60" height="185" fill="yellow" opacity="0.3" rx="4" />
          )}
          {searchQuery && "chord".includes(searchQuery.toLowerCase()) && (
            <rect x="180" y="275" width="440" height="25" fill="yellow" opacity="0.3" rx="4" />
          )}
        </svg>
      )
    }
  ]

  const activePageData = pages.find(p => p.page === currentPage)

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 200))
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50))
  const handleResetZoom = () => setZoom(100)

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden flex flex-col h-[750px] relative">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-50 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-black py-2.5 px-5 rounded-full shadow-2xl flex items-center space-x-2 border border-slate-700/50 animate-bounce">
          <CheckCircle2 size={14} className="text-emerald-400 dark:text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP HEADER STATUS */}
      <div className="bg-slate-50 dark:bg-slate-850 px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-rose-500/10 text-rose-500 rounded-xl">
            <FileText size={22} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Official_RS_Carpentry_Blueprints.pdf</h4>
              <span className="text-[9px] bg-slate-200 dark:bg-slate-700 font-extrabold px-1.5 py-0.5 rounded text-slate-500 dark:text-slate-400">SECURE</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">National Building Code of Canada Compliant Reference Drawings</p>
          </div>
        </div>

        {/* View mode buttons */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200/50 dark:border-slate-700">
          <button 
            onClick={() => setTheme('classic')} 
            className={`px-2.5 py-1 text-[9px] font-black uppercase rounded-lg transition-all ${theme === 'classic' ? 'bg-brand-500 text-white shadow' : 'text-slate-500 dark:text-slate-400'}`}
          >
            Classic Blue
          </button>
          <button 
            onClick={() => setTheme('cad')} 
            className={`px-2.5 py-1 text-[9px] font-black uppercase rounded-lg transition-all ${theme === 'cad' ? 'bg-brand-500 text-white shadow' : 'text-slate-500 dark:text-slate-400'}`}
          >
            CAD Dark
          </button>
          <button 
            onClick={() => setTheme('light')} 
            className={`px-2.5 py-1 text-[9px] font-black uppercase rounded-lg transition-all ${theme === 'light' ? 'bg-brand-500 text-white shadow' : 'text-slate-500 dark:text-slate-400'}`}
          >
            Light Print
          </button>
        </div>
      </div>

      {/* PDF TOOLBAR PANEL */}
      <div className="bg-slate-100/50 dark:bg-slate-900 px-6 py-3 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 z-10">
        
        {/* Pagination Controls */}
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-750 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-xs font-black text-slate-700 dark:text-slate-300">
            Page {currentPage} of {pages.length}
          </span>
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, pages.length))}
            disabled={currentPage === pages.length}
            className="p-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-750 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center space-x-1">
          <button 
            onClick={handleZoomOut}
            className="p-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-750 transition-all"
            title="Zoom Out"
          >
            <ZoomOut size={16} />
          </button>
          <button 
            onClick={handleResetZoom}
            className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-black text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-750 transition-all"
          >
            {zoom}%
          </button>
          <button 
            onClick={handleZoomIn}
            className="p-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-750 transition-all"
            title="Zoom In"
          >
            <ZoomIn size={16} />
          </button>
        </div>

        {/* In-document Text Search */}
        <div className="relative flex-1 max-w-[180px] sm:max-w-[220px]">
          <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 text-slate-400 dark:text-slate-500">
            <Search size={14} />
          </span>
          <input 
            type="text" 
            placeholder="Search schematics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-xs font-bold rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {/* Quick action triggers */}
        <div className="flex items-center space-x-1.5">
          <button 
            onClick={handlePrint}
            className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-750 transition-all"
            title="Print PDF"
          >
            <Printer size={16} />
          </button>
          <button 
            onClick={handleDownload}
            className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-750 transition-all"
            title="Download PDF Copy"
          >
            <Download size={16} />
          </button>
          <button 
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-750 transition-all"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Viewer"}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>

      </div>

      {/* CORE SPLIT SCREEN INTERACTIVE LAYOUT */}
      <div className={`flex flex-1 overflow-hidden ${isFullscreen ? 'fixed inset-4 z-40 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-2xl shadow-2xl' : ''}`}>
        
        {/* SIDE THUMBNAILS PANEL */}
        <div className="w-56 border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-4 hidden md:flex flex-col space-y-4 overflow-y-auto">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">SHEET INDEX</span>
          <div className="space-y-3">
            {pages.map((p) => (
              <button 
                key={p.page}
                onClick={() => setCurrentPage(p.page)}
                className={`w-full text-left p-2.5 rounded-xl border transition-all flex flex-col space-y-2 ${
                  currentPage === p.page 
                    ? 'bg-brand-500/10 border-brand-500 text-brand-600 dark:text-brand-400' 
                    : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:bg-slate-100/50 text-slate-600 dark:text-slate-400'
                }`}
              >
                <span className="text-[10px] font-black uppercase tracking-wider">Page {p.page}</span>
                <span className="text-[10px] font-extrabold line-clamp-2 leading-snug">{p.title}</span>
                <div className="w-full h-16 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded overflow-hidden opacity-80 flex items-center justify-center text-[18px]">
                  🗺️
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* WORKSPACE & SCHEMATIC VIEW CANVAS */}
        <div className="flex-1 bg-slate-200 dark:bg-slate-950 p-6 flex flex-col justify-between overflow-hidden relative">
          
          {/* Active schematic metadata header */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm mb-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[9px] bg-brand-500/10 text-brand-600 dark:text-brand-400 px-2 py-0.5 rounded font-black uppercase tracking-wider">ACTIVE SHEET</span>
                <h5 className="text-sm font-black text-slate-900 dark:text-white mt-1 uppercase tracking-tight">{activePageData.title}</h5>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold mt-0.5">{activePageData.description}</p>
              </div>
              <span className="text-[10px] font-bold text-slate-400 font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded shrink-0">{activePageData.scale}</span>
            </div>
          </div>

          {/* ZOOMABLE INNER CANVAS */}
          <div 
            ref={viewerRef}
            className="flex-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-auto flex items-center justify-center p-4 relative cursor-grab active:cursor-grabbing"
          >
            <div 
              style={{ 
                width: `${zoom}%`,
                maxWidth: '1200px',
                minWidth: '350px',
                transition: 'width 0.2s ease-in-out'
              }}
              className="aspect-[1.6] flex items-center justify-center shadow-lg"
            >
              {activePageData.content}
            </div>
          </div>

          {/* Interactive footer details and code tips */}
          <div className="bg-amber-500/5 dark:bg-amber-950/10 border border-amber-500/20 p-3 rounded-xl mt-4 flex items-center space-x-3 text-amber-950 dark:text-amber-400">
            <Info size={16} className="text-amber-500 shrink-0" />
            <div className="text-[10px] font-bold leading-normal">
              <span className="font-black uppercase tracking-wider block mb-0.5">RED SEAL BLUEPRINT EXAMINATION TIP</span>
              {currentPage === 1 && "Always locate the Benchmark (BM) point first before looking at foundations or batter boards. Diagonals must be checked using Pythagorean formula for perfect squaring."}
              {currentPage === 2 && "Bridging prevents floor joists from twisting under heavy point loads. Spans over 2.1 meters (7 feet) always require either a strap line or solid wood blocking line."}
              {currentPage === 3 && "The King Post operates entirely in tension, keeping the bottom chord from sagging under attic loads, while top chords handle compression and snow."}
            </div>
          </div>

        </div>

      </div>

    </div>
  )
}
