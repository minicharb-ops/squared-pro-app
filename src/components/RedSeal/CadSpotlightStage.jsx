import React from 'react'
import { ChevronLeft, ChevronRight, Crosshair, Layers } from 'lucide-react'

/**
 * High-contrast CAD Pill Label:
 * Renders a dark-blue/black pill background (fill="#0a192f" opacity="0.88")
 * behind every SVG text label (fontSize 10–13, monospace, bold) so zero text ever collides with CAD lines.
 */
export function CadLabel({
  x,
  y,
  text,
  fontSize = 10.5,
  color = '#f8fafc',
  borderColor = '#1e3a5f',
  align = 'middle',
  padX = 6,
  padY = 3.5
}) {
  const str = String(text || '')
  const charWidth = fontSize * 0.61
  const width = Math.max(24, Math.round(str.length * charWidth + padX * 2))
  const height = Math.round(fontSize + padY * 2)

  let rectX = x - width / 2
  let textAnchor = 'middle'
  let textX = x

  if (align === 'start' || align === 'left') {
    rectX = x
    textAnchor = 'start'
    textX = x + padX
  } else if (align === 'end' || align === 'right') {
    rectX = x - width
    textAnchor = 'end'
    textX = x - padX
  }

  const rectY = y - height / 2 - 1

  return (
    <g pointerEvents="none">
      <rect
        x={rectX}
        y={rectY}
        width={width}
        height={height}
        rx="4"
        fill="#0a192f"
        stroke={borderColor}
        strokeWidth="1"
      />
      <text
        x={textX}
        y={y + fontSize * 0.32 - 1}
        fill={color}
        fontSize={fontSize}
        fontFamily="monospace"
        fontWeight="bold"
        textAnchor={textAnchor}
      >
        {str}
      </text>
    </g>
  )
}

/**
 * Numbered Callout Pin (①, ②, ③) rendered on the 360x210 CAD Spotlight Stage
 */
export function CalloutPin({ x, y, num = 1, variant = 'cyan' }) {
  const glyphs = { 1: '①', 2: '②', 3: '③' }
  const stroke = variant === 'amber' ? '#fbbf24' : variant === 'emerald' ? '#34d399' : '#22d3ee'
  const textFill = variant === 'amber' ? '#fde68a' : variant === 'emerald' ? '#a7f3d0' : '#67e8f9'

  return (
    <g pointerEvents="none">
      <circle cx={x} cy={y} r="11" fill="#0a192f" stroke={stroke} strokeWidth="2" />
      <text
        x={x}
        y={y + 4}
        fill={textFill}
        fontSize="12"
        fontFamily="monospace"
        fontWeight="bold"
        textAnchor="middle"
      >
        {glyphs[num] || num}
      </text>
    </g>
  )
}

/**
 * Returns the 3-point "HOW TO READ THIS SYMBOL" callout keys and large 1:1 CAD SVG (360x210)
 * for any Masterclass item across all 10 Blueprint Sheets.
 */
export function getSpotlightSpec(title = '', sheetCode = 'A1.0') {
  const key = title.trim().toLowerCase()

  // 1. SECTION MARKS (A1.0 Detail 9 / 13)
  if (key.includes('section mark')) {
    return {
      scaleLabel: 'DETAIL SCALE: 1:1 SYMBOL SPOTLIGHT',
      keys: [
        '① Top Half (A): Section Detail ID letter/number on target sheet',
        '② Bottom Half (A4.2): Target drawing sheet where cross-section is drawn',
        '③ Sight Arrow & Cut Line: Direction carpenter looks at the cut plane'
      ],
      renderSvg: () => (
        <g>
          {/* Heavy Phantom Cutting Plane Line (— · · —) */}
          <line x1="30" y1="112" x2="330" y2="112" stroke="#38bdf8" strokeWidth="3.5" strokeDasharray="18 6 4 6 4 6" />
          <CadLabel x={252} y={142} text="CUTTING PLANE (— · · —)" fontSize={10.5} color="#7dd3fc" borderColor="#0284c7" />

          {/* Directional Sight Arrow Shield */}
          <polygon points="98,46 154,112 98,112" fill="#0284c7" opacity="0.35" />
          <polyline points="66,112 98,54 130,112" fill="none" stroke="#22d3ee" strokeWidth="3.5" />
          <polygon points="98,44 86,66 110,66" fill="#22d3ee" />

          {/* Large Section Callout Circle (R=34px) */}
          <circle cx="98" cy="112" r="34" fill="#0a192f" stroke="#38bdf8" strokeWidth="3" />
          <line x1="64" y1="112" x2="132" y2="112" stroke="#38bdf8" strokeWidth="2.5" />

          {/* Top Detail ID & Bottom Sheet Number */}
          <text x="98" y="102" fill="#ffffff" fontSize="13" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
            A
          </text>
          <text x="98" y="131" fill="#38bdf8" fontSize="12" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
            A4.2
          </text>

          {/* Leader lines & Labels */}
          <line x1="128" y1="92" x2="185" y2="75" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="3 3" />
          <CadLabel x={190} y={75} align="start" text="DETAIL ID 'A'" fontSize={11} color="#ffffff" borderColor="#22d3ee" />

          <line x1="126" y1="130" x2="185" y2="175" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3 3" />
          <CadLabel x={190} y={175} align="start" text="SHEET A4.2" fontSize={11} color="#fde68a" borderColor="#fbbf24" />

          <CadLabel x={235} y={36} text="SIGHT DIRECTION (NORTH)" fontSize={11} color="#67e8f9" borderColor="#22d3ee" />
          <line x1="106" y1="52" x2="152" y2="36" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="3 3" />

          {/* Callout Pins */}
          <CalloutPin x={46} y={88} num={1} variant="cyan" />
          <CalloutPin x={46} y={140} num={2} variant="amber" />
          <CalloutPin x={138} y={42} num={3} variant="emerald" />
        </g>
      )
    }
  }

  // 2A. DIMENSION HIERARCHY (A1.0 Detail 3 / 13)
  if (key.includes('dimension hierarchy')) {
    return {
      scaleLabel: 'DETAIL SCALE: 3-TIER DIMENSION HIERARCHY',
      keys: [
        '① Outer String (42\'-0"): Overall building footprint (OVERRULES inner strings)',
        '② Middle String (14\'-6" / 27\'-6"): Major structural wall jogs & partitions',
        '③ Inner String (5\'-0" R.O.): Window/door centerlines & rough openings'
      ],
      renderSvg: () => (
        <g>
          {/* Extension Lines */}
          <line x1="52" y1="24" x2="52" y2="184" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="168" y1="74" x2="168" y2="184" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="226" y1="122" x2="226" y2="184" stroke="#eab308" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="278" y1="122" x2="278" y2="184" stroke="#eab308" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="334" y1="24" x2="334" y2="184" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 3" />

          {/* STRING 1: OUTER OVERALL */}
          <line x1="48" y1="36" x2="338" y2="36" stroke="#38bdf8" strokeWidth="2.5" />
          <line x1="47" y1="41" x2="57" y2="31" stroke="#38bdf8" strokeWidth="2.5" />
          <line x1="329" y1="41" x2="339" y2="31" stroke="#38bdf8" strokeWidth="2.5" />
          <CadLabel x={193} y={36} text="42'-0&quot; OVERALL WIDTH" fontSize={11} color="#67e8f9" borderColor="#0284c7" />
          <CalloutPin x={28} y={36} num={1} variant="cyan" />

          {/* STRING 2: MIDDLE PARTITION / JOG */}
          <line x1="48" y1="86" x2="338" y2="86" stroke="#f8fafc" strokeWidth="2" />
          <line x1="47" y1="91" x2="57" y2="81" stroke="#f8fafc" strokeWidth="2.5" />
          <line x1="163" y1="91" x2="173" y2="81" stroke="#f8fafc" strokeWidth="2.5" />
          <line x1="329" y1="91" x2="339" y2="81" stroke="#f8fafc" strokeWidth="2.5" />
          <CadLabel x={110} y={86} text="14'-6&quot; WALL" fontSize={10} color="#ffffff" borderColor="#64748b" />
          <CadLabel x={252} y={86} text="27'-6&quot; SPAN" fontSize={10} color="#ffffff" borderColor="#64748b" />
          <CalloutPin x={28} y={86} num={2} variant="amber" />

          {/* STRING 3: INNER ROUGH OPENING */}
          <line x1="168" y1="134" x2="334" y2="134" stroke="#fbbf24" strokeWidth="2" />
          <line x1="221" y1="139" x2="231" y2="129" stroke="#fbbf24" strokeWidth="2.5" />
          <line x1="273" y1="139" x2="283" y2="129" stroke="#fbbf24" strokeWidth="2.5" />
          <CadLabel x={252} y={134} text="5'-0&quot; R.O. (W01)" fontSize={10.5} color="#fde68a" borderColor="#d97706" />
          <CalloutPin x={144} y={134} num={3} variant="emerald" />

          {/* Framed Wall Below */}
          <rect x="52" y="172" width="282" height="16" fill="#1e293b" stroke="#94a3b8" strokeWidth="2" />
          <rect x="226" y="170" width="52" height="20" fill="#0ea5e9" opacity="0.35" stroke="#38bdf8" strokeWidth="2" />
          <CadLabel x={126} y={180} text="EXT. 2x6 WALL" fontSize={10} color="#cbd5e1" borderColor="#475569" />
        </g>
      )
    }
  }

  // 2B. DIMENSION STRINGS (A1.0 Detail 10 / 13 — Dedicated Terminators, ℄ vs F.O.S. & Grid Datum)
  if (key.includes('dimension string') || key.includes('dimension line')) {
    return {
      scaleLabel: 'DETAIL SCALE: ARCHITECTURAL DIMENSION TERMINATORS',
      keys: [
        '① Exterior Framing String: 45° architectural ticks dimension to exterior face of stud / sheathing',
        '② Interior Partition String: Dimensions to Partition Centerline (℄) vs. Face of Stud (F.O.S.)',
        '③ Structural Grid Datum & Rule: Locked to Grid Bubble (A); never scale prints—compute written dims'
      ],
      renderSvg: () => (
        <g>
          {/* Extension & Centerline Reference Lines (drawn first behind all labels) */}
          <line x1="52" y1="22" x2="52" y2="130" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="156" y1="74" x2="156" y2="134" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="10 3 2 3" />
          <line x1="342" y1="22" x2="342" y2="130" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 3" />

          {/* ① TOP STRING: EXTERIOR FACE OF STUD / SHEATHING W/ 45° TICKS */}
          <line x1="46" y1="36" x2="348" y2="36" stroke="#22d3ee" strokeWidth="2.5" />
          <line x1="46" y1="42" x2="58" y2="30" stroke="#22d3ee" strokeWidth="3" />
          <line x1="336" y1="42" x2="348" y2="30" stroke="#22d3ee" strokeWidth="3" />
          <CalloutPin x={26} y={36} num={1} variant="cyan" />
          <CadLabel x={197} y={36} text="EXT. FACE OF STUD (45° TICKS)" fontSize={9.5} padX={5} color="#67e8f9" borderColor="#0284c7" />

          {/* ② MIDDLE STRING: INTERIOR PARTITION CENTERLINE (℄) VS FACE OF STUD (F.O.S.) */}
          <line x1="46" y1="90" x2="348" y2="90" stroke="#fbbf24" strokeWidth="2" />
          <line x1="46" y1="96" x2="58" y2="84" stroke="#fbbf24" strokeWidth="2.5" />
          <line x1="150" y1="96" x2="162" y2="84" stroke="#fbbf24" strokeWidth="2.5" />
          <line x1="336" y1="96" x2="348" y2="84" stroke="#fbbf24" strokeWidth="2.5" />

          {/* Interior Stud Partition Cross-Section Centered on x=156 */}
          <rect x="149" y="114" width="14" height="20" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />

          {/* Opaque #0a192f Pills Cleanly Centered Inside Each Span (Zero Vertical Line Crossings) */}
          <CalloutPin x={26} y={90} num={2} variant="amber" />
          <CadLabel x={104} y={90} text="TO ℄: 12'-4&quot;" fontSize={8.8} padX={4} color="#fde68a" borderColor="#d97706" />
          <CadLabel x={249} y={90} text="℄ VS FACE OF STUD (F.O.S.)" fontSize={8.6} padX={4} color="#ffffff" borderColor="#64748b" />

          {/* ③ BOTTOM STRING: STRUCTURAL GRID LINE BUBBLE (GRID A) + DO NOT SCALE RULE */}
          <circle cx="52" cy="148" r="14" fill="#0a192f" stroke="#34d399" strokeWidth="2.5" />
          <text x="52" y="152" fill="#6ee7b7" fontSize="11.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
            A
          </text>
          <line x1="66" y1="148" x2="112" y2="148" stroke="#34d399" strokeWidth="1.8" strokeDasharray="10 3 2 3" />
          <CalloutPin x={128} y={148} num={3} variant="emerald" />
          <CadLabel x={145} y={148} align="start" text="STRUCTURAL GRID 'A' DATUM" fontSize={9.2} padX={4.5} color="#6ee7b7" borderColor="#059669" />

          <CadLabel x={197} y={182} text="DO NOT SCALE — COMPUTE MISSING DIMS" fontSize={9} padX={4.5} color="#fca5a5" borderColor="#ef4444" />
        </g>
      )
    }
  }

  // 3A. ISSUED FOR CONSTRUCTION (IFC STAMP — A1.0 Detail 1 / 13)
  if (key.includes('issued for construction')) {
    return {
      scaleLabel: 'DETAIL SCALE: TITLE BLOCK & IFC CONTROL',
      keys: [
        '① IFC Stamp: Legal authorization required before any on-site framing begins',
        '② Revision Cloud & Delta (Δ3): Marks latest structural/architectural change',
        '③ Scale & "DO NOT SCALE": Written dimensions always govern over scaling'
      ],
      renderSvg: () => (
        <g>
          {/* Title Block Frame */}
          <rect x="22" y="18" width="316" height="174" rx="6" fill="#0f243c" stroke="#38bdf8" strokeWidth="2.5" />
          <line x1="22" y1="72" x2="338" y2="72" stroke="#38bdf8" strokeWidth="1.5" />
          <line x1="22" y1="138" x2="338" y2="138" stroke="#38bdf8" strokeWidth="1.5" />
          <line x1="185" y1="72" x2="185" y2="192" stroke="#38bdf8" strokeWidth="1.5" />

          {/* IFC Green Stamp */}
          <rect x="34" y="27" width="198" height="36" rx="4" fill="#064e3b" stroke="#10b981" strokeWidth="2.5" />
          <text x="133" y="49" fill="#6ee7b7" fontSize="11.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
            ISSUED FOR CONSTRUCTION
          </text>
          <CalloutPin x={260} y={45} num={1} variant="emerald" />

          {/* Revision Table Row */}
          <polygon points="48,96 35,120 61,120" fill="#451a03" stroke="#fbbf24" strokeWidth="2" />
          <text x="48" y="116" fill="#fde68a" fontSize="10.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
            3
          </text>
          <CalloutPin x={92} y={88} num={2} variant="amber" />
          <CadLabel x={124} y={117} text="REV 3: LVL HDR" fontSize={10} padX={5} color="#fde68a" borderColor="#d97706" />

          {/* Right Pane: Sheet ID */}
          <CadLabel x={262} y={94} text="DWG: A1.0" fontSize={11.5} color="#ffffff" borderColor="#38bdf8" />
          <CadLabel x={262} y={120} text="DATE: 2026-11" fontSize={10} color="#94a3b8" borderColor="#334155" />

          {/* Bottom Row: Scale & Do Not Scale */}
          <CadLabel x={104} y={165} text="SCALE: 1/4&quot;=1'-0&quot;" fontSize={10} padX={5} color="#67e8f9" borderColor="#0284c7" />
          <CalloutPin x={208} y={165} num={3} variant="cyan" />
          <CadLabel x={278} y={165} text="DO NOT SCALE" fontSize={10.5} padX={5} color="#fca5a5" borderColor="#ef4444" />
        </g>
      )
    }
  }

  // 3B. REVISION BLOCK (A1.0 Detail 2 / 13 — Dedicated Revision Cloud & Chronological Table)
  if (key.includes('revision block')) {
    return {
      scaleLabel: 'DETAIL SCALE: REVISION CLOUD & SCHEDULE TABLE',
      keys: [
        '① Revision Cloud & Delta (Δ3): Highlights the exact modified area on the drawing sheet',
        '② Revision Schedule Table: Chronological table in the title block recording what changed and when',
        '③ Master Set Verification: Always confirm your sheet\'s latest Δ number matches the GC\'s current drawing log'
      ],
      renderSvg: () => (
        <g>
          {/* Left Side: Floor Plan Corner inside Scalloped Revision Cloud + Δ3 Tag */}
          <CalloutPin x={30} y={26} num={1} variant="amber" />
          <CadLabel x={102} y={26} text="CLOUD & DELTA Δ3" fontSize={8.8} padX={4} color="#fde68a" borderColor="#d97706" />
          <line x1="94" y1="36" x2="94" y2="54" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3 2.5" />

          {/* Framed Wall Corner & Window inside Cloud */}
          <polyline points="44,142 44,78 134,78" fill="none" stroke="#cbd5e1" strokeWidth="6" />
          <line x1="74" y1="78" x2="112" y2="78" stroke="#38bdf8" strokeWidth="6" />

          {/* Scalloped Revision Cloud Outline */}
          <path
            d="M 28 76 Q 28 54 52 58 Q 76 48 102 58 Q 130 48 146 72 Q 156 98 144 124 Q 148 150 120 148 Q 90 158 62 148 Q 28 154 28 124 Q 18 98 28 76 Z"
            fill="#451a03"
            fillOpacity="0.28"
            stroke="#fbbf24"
            strokeWidth="2.4"
          />
          {/* Delta Δ3 Triangle inside Cloud */}
          <polygon points="118,104 104,130 132,130" fill="#451a03" stroke="#fbbf24" strokeWidth="2" />
          <text x="118" y="126" fill="#fde68a" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
            3
          </text>

          {/* Right Side: Zoomed Title Block Chronological Revision Schedule Table */}
          <CalloutPin x={180} y={26} num={2} variant="cyan" />
          <CadLabel x={268} y={26} text="CHRONOLOGICAL REV LOG" fontSize={8.8} padX={4} color="#67e8f9" borderColor="#0284c7" />

          <rect x="166" y="46" width="174" height="106" rx="4" fill="#0f243c" stroke="#38bdf8" strokeWidth="2" />
          <line x1="166" y1="80" x2="340" y2="80" stroke="#334155" strokeWidth="1.5" />
          <line x1="166" y1="114" x2="340" y2="114" stroke="#334155" strokeWidth="1.5" />

          <text x="174" y="67" fill="#cbd5e1" fontSize="9.2" fontFamily="monospace" fontWeight="bold">
            Δ1 | PERMIT ISSUE SET
          </text>
          <text x="174" y="101" fill="#cbd5e1" fontSize="9.2" fontFamily="monospace" fontWeight="bold">
            Δ2 | LVL BEAM SPEC
          </text>
          <rect x="168" y="116" width="170" height="34" fill="#451a03" fillOpacity="0.55" />
          <text x="174" y="137" fill="#fde68a" fontSize="9.2" fontFamily="monospace" fontWeight="bold">
            Δ3 | W02 ROUGH OPENING
          </text>

          {/* Bottom Master Log Verification Callout */}
          <CalloutPin x={32} y={180} num={3} variant="emerald" />
          <CadLabel x={196} y={180} text="VERIFY LATEST Δ MATCHES GC MASTER LOG" fontSize={8.8} padX={4.5} color="#6ee7b7" borderColor="#059669" />
        </g>
      )
    }
  }

  // 4A. LOAD-BEARING PARTITION (A1.0 Detail 4 / 13)
  if (key.includes('load-bearing')) {
    return {
      scaleLabel: 'DETAIL SCALE: 2x6 LOAD-BEARING WALL FRAMING',
      keys: [
        '① 2x6 Load-Bearing Wall: Cross-hatched on plan; requires structural lintel & jack studs',
        '② Double Top Plate: Lapped ≥ 48" at corners/intersections on bearing walls',
        '③ 2x4 Non-Bearing Wall: Drawn unhatched; supports only drywall (no structural header)'
      ],
      renderSvg: () => (
        <g>
          {/* Top Headers & Callout Pins ① and ③ Cleanly Above the Partition Boxes */}
          <CalloutPin x={32} y={26} num={1} variant="amber" />
          <CadLabel x={112} y={26} text="2x6 BEARING WALL" fontSize={10} padX={5} color="#fde68a" borderColor="#d97706" />

          <CalloutPin x={204} y={26} num={3} variant="emerald" />
          <CadLabel x={282} y={26} text="2x4 NON-BEARING" fontSize={10} padX={5} color="#cbd5e1" borderColor="#64748b" />

          {/* Left Box: Load-Bearing 2x6 Wall */}
          <rect x="18" y="42" width="160" height="146" rx="4" fill="#0f243c" stroke="#22d3ee" strokeWidth="2.5" />

          {/* ② Double Top Plate (48" Lap) Graphic + Clean Badge ② */}
          <CalloutPin x={35} y={58} num={2} variant="cyan" />
          <rect x="52" y="51" width="114" height="6" fill="#451a03" stroke="#fbbf24" strokeWidth="1.5" />
          <rect x="52" y="58" width="114" height="6" fill="#451a03" stroke="#fbbf24" strokeWidth="1.5" />
          <line x1="109" y1="51" x2="109" y2="57" stroke="#22d3ee" strokeWidth="2" />
          <CadLabel x={98} y={82} text="DOUBLE TOP PLATE (48&quot; LAP)" fontSize={8.8} padX={4} color="#67e8f9" borderColor="#0284c7" />

          {/* Bearing Wall Cross-Hatching & LVL + Jack Studs */}
          <line x1="32" y1="106" x2="164" y2="106" stroke="#f59e0b" strokeWidth="12" strokeDasharray="8 6" />
          <rect x="30" y="99" width="136" height="14" fill="none" stroke="#fbbf24" strokeWidth="1.8" />
          <CadLabel x={98} y={132} text="2-PLY LVL + JACK STUDS" fontSize={9.5} padX={4.5} color="#ffffff" borderColor="#38bdf8" />
          <CadLabel x={98} y={162} text="2x6 STUDS @ 16&quot; O.C." fontSize={9.5} padX={5} color="#fde68a" borderColor="#d97706" />

          {/* Right Box: Non-Bearing 2x4 Partition */}
          <rect x="188" y="42" width="154" height="146" rx="4" fill="#0f243c" stroke="#475569" strokeWidth="2.5" />
          <rect x="206" y="54" width="118" height="12" fill="#1e293b" stroke="#cbd5e1" strokeWidth="2" />
          <CadLabel x={265} y={82} text="UNHATCHED PLAN SYMBOL" fontSize={9} padX={4.5} color="#cbd5e1" borderColor="#64748b" />
          <CadLabel x={265} y={132} text="NO STRUCTURAL HEADER" fontSize={9.5} padX={4.5} color="#6ee7b7" borderColor="#059669" />
          <CadLabel x={265} y={162} text="FLAT 2x4 BLOCKING ONLY" fontSize={9.5} padX={4.5} color="#cbd5e1" borderColor="#475569" />
        </g>
      )
    }
  }

  // 4B. NON-BEARING PARTITION (A1.0 Detail 5 / 13 — Dedicated Plan Backing & Flat 2x4 Header Diagram)
  if (key.includes('non-bearing')) {
    return {
      scaleLabel: 'DETAIL SCALE: 2x4 NON-BEARING PARTITION (NBC 9.23.10)',
      keys: [
        '① Unhatched Plan Symbol: 2x4 studs @ 16" or 24" O.C. carrying zero floor/roof load above',
        '② Backing & California Corner: 3-stud corner or ladder blocking provides drywall nailing edge',
        '③ Non-Bearing Door Opening (NBC 9.23.10): Flat 2x4 single header only—no structural lintel or jack studs req'
      ],
      renderSvg: () => (
        <g>
          {/* Left Pane: Unhatched Double-Line 2x4 Plan Symbol + 3-Stud California Corner / Ladder Backing */}
          <CalloutPin x={30} y={26} num={1} variant="cyan" />
          <CadLabel x={108} y={26} text="UNHATCHED 2x4 PLAN" fontSize={9} padX={4.5} color="#67e8f9" borderColor="#0284c7" />
          <line x1="96" y1="36" x2="96" y2="54" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="3 2.5" />

          {/* Unhatched 2x4 Wall in Plan */}
          <rect x="24" y="54" width="142" height="22" fill="#0f243c" stroke="#cbd5e1" strokeWidth="2.5" />
          <rect x="30" y="57" width="10" height="16" fill="#1e293b" stroke="#94a3b8" strokeWidth="1.5" />
          <rect x="148" y="57" width="10" height="16" fill="#1e293b" stroke="#94a3b8" strokeWidth="1.5" />

          {/* Intersecting Partition w/ 3-Stud California Corner / Drywall Backing Nailer */}
          <rect x="78" y="76" width="24" height="62" fill="#0f243c" stroke="#34d399" strokeWidth="2.2" />
          <rect x="81" y="57" width="18" height="16" fill="#064e3b" stroke="#34d399" strokeWidth="2" />
          <rect x="82" y="80" width="16" height="10" fill="#064e3b" stroke="#34d399" strokeWidth="1.8" />

          <line x1="43" y1="116" x2="78" y2="96" stroke="#34d399" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <circle cx="78" cy="96" r="2.8" fill="#34d399" />
          <CalloutPin x={32} y={118} num={2} variant="emerald" />
          <CadLabel x={96} y={156} text="3-STUD CORNER / BACKING" fontSize={8.8} padX={4} color="#6ee7b7" borderColor="#059669" />

          {/* Center Divider */}
          <line x1="176" y1="20" x2="176" y2="168" stroke="#334155" strokeWidth="1.5" strokeDasharray="4 4" />

          {/* Right Pane: Non-Bearing Door Opening w/ Flat 2x4 Single Header */}
          <CalloutPin x={196} y={26} num={3} variant="amber" />
          <CadLabel x={278} y={26} text="FLAT 2x4 DOOR HEADER" fontSize={9} padX={4.5} color="#fde68a" borderColor="#d97706" />

          {/* Top Plate + Single Full-Height Studs + Flat 2x4 Blocking Over Door */}
          <rect x="196" y="48" width="136" height="8" fill="#1e293b" stroke="#cbd5e1" strokeWidth="1.8" />
          <rect x="200" y="56" width="12" height="96" fill="#1e293b" stroke="#94a3b8" strokeWidth="2" />
          <rect x="316" y="56" width="12" height="96" fill="#1e293b" stroke="#94a3b8" strokeWidth="2" />
          <rect x="212" y="76" width="104" height="10" fill="#451a03" stroke="#fbbf24" strokeWidth="2.2" />
          <line x1="258" y1="56" x2="258" y2="76" stroke="#94a3b8" strokeWidth="2" />

          <line x1="202" y1="36" x2="238" y2="76" stroke="#fbbf24" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <circle cx="238" cy="76" r="2.8" fill="#fbbf24" />
          <CadLabel x={264} y={116} text="NO STRUCTURAL LINTEL" fontSize={8.8} padX={4} color="#ffffff" borderColor="#38bdf8" />

          {/* Bottom NBC Rule Callout */}
          <CadLabel x={184} y={182} text="NO LINTEL OR JACK STUDS REQ (NBC 9.23.10)" fontSize={9} padX={4.5} color="#fde68a" borderColor="#d97706" />
        </g>
      )
    }
  }

  // 5. PLUMBING CHASE FRAMING (A1.0 Detail 6 / 13)
  if (key.includes('plumbing chase')) {
    return {
      scaleLabel: 'DETAIL SCALE: 2x6 WET WALL & STUD DRILLING (NBC 9.23.5.3)',
      keys: [
        '① 3" ABS Soil Stack (3.5" OD): Cannot fit in 2x4 (3.5") wall without cutting stud',
        '② 2x6 Wet Wall (5.5" Depth): Required for 3" DWV vertical stack framing',
        '③ Max Stud Hole = 1/3 Depth: Add 1.6mm (16 ga) steel plate if edge < 40mm'
      ],
      renderSvg: () => (
        <g>
          {/* 2x6 Stud Cross-Section */}
          <rect x="44" y="54" width="272" height="92" fill="#1e293b" stroke="#f59e0b" strokeWidth="3" />
          <line x1="44" y1="62" x2="316" y2="62" stroke="#fbbf24" strokeWidth="1" strokeDasharray="6 4" />
          <line x1="44" y1="138" x2="316" y2="138" stroke="#fbbf24" strokeWidth="1" strokeDasharray="6 4" />

          {/* 3" ABS Pipe Circle in Center */}
          <circle cx="148" cy="100" r="30" fill="#0a192f" stroke="#38bdf8" strokeWidth="3.5" />
          <text x="148" y="104" fill="#67e8f9" fontSize="11.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
            3&quot; ABS
          </text>

          {/* Steel Protection Plate on Bottom Edge */}
          <rect x="108" y="144" width="80" height="8" fill="#ef4444" stroke="#fca5a5" strokeWidth="1.5" />

          {/* Labels & Pins */}
          <CalloutPin x={74} y={28} num={2} variant="amber" />
          <CadLabel x={196} y={28} text="2x6 WET WALL (140mm / 5.5&quot;)" fontSize={10.5} padX={5} color="#fde68a" borderColor="#d97706" />

          <CalloutPin x={92} y={100} num={1} variant="cyan" />
          <CadLabel x={250} y={100} text="MAX HOLE: 1/3 DEPTH" fontSize={9.5} padX={5} color="#ffffff" borderColor="#38bdf8" />

          <CalloutPin x={96} y={178} num={3} variant="emerald" />
          <CadLabel x={196} y={178} text="STEEL NAIL GUARD PLATE" fontSize={10} padX={5} color="#fca5a5" borderColor="#ef4444" />
        </g>
      )
    }
  }

  // 6A. WINDOW SYMBOLS (A1.0 Detail 11 / 13 — Dedicated Plan Symbol & Elevation Dashed Hinge Triangle)
  if (key.includes('window symbol')) {
    return {
      scaleLabel: 'DETAIL SCALE: PLAN & ELEVATION WINDOW SYMBOLS',
      keys: [
        '① Window Plan Symbol & Tag (W01): Links floor plan location to Window Schedule for R.O. & lintel',
        '② Dashed Hinge Lines (Elevation): Points of dashed triangle always meet at the hinged edge',
        '③ Bedroom Egress Rule (NBC 9.9.10.1): Unobstructed opening >= 0.35 m² (3.77 ft²), no dim < 380mm (15")'
      ],
      renderSvg: () => (
        <g>
          {/* Left Side: Top-Down Floor Plan Window Symbol + Hexagon Tag W01 */}
          <CalloutPin x={30} y={26} num={1} variant="cyan" />
          <CadLabel x={108} y={26} text="PLAN SYMBOL & TAG" fontSize={9} padX={4.5} color="#67e8f9" borderColor="#0284c7" />

          {/* Framed Wall Cheeks & Double Glazing Lines */}
          <rect x="22" y="78" width="26" height="22" fill="#1e293b" stroke="#cbd5e1" strokeWidth="2" />
          <rect x="138" y="78" width="26" height="22" fill="#1e293b" stroke="#cbd5e1" strokeWidth="2" />
          <rect x="48" y="78" width="90" height="22" fill="#0f243c" stroke="#38bdf8" strokeWidth="1.8" />
          <line x1="48" y1="86" x2="138" y2="86" stroke="#67e8f9" strokeWidth="2" />
          <line x1="48" y1="92" x2="138" y2="92" stroke="#67e8f9" strokeWidth="2" />
          {/* 45° Casement Swing Leaf in Plan */}
          <line x1="48" y1="78" x2="88" y2="50" stroke="#fbbf24" strokeWidth="2.5" />
          <path d="M 88 50 A 48 48 0 0 1 96 78" fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4 3" />

          {/* Hexagon Schedule Tag [W01] */}
          <polygon points="70,124 78,112 108,112 116,124 108,136 78,136" fill="#0a192f" stroke="#22d3ee" strokeWidth="2" />
          <text x="93" y="128" fill="#67e8f9" fontSize="10.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
            W01
          </text>
          <CadLabel x={93} y={154} text="1500x1200 CASEMENT" fontSize={8.5} padX={4} color="#cbd5e1" borderColor="#475569" />

          {/* Center Divider */}
          <line x1="176" y1="20" x2="176" y2="164" stroke="#334155" strokeWidth="1.5" strokeDasharray="4 4" />

          {/* Right Side: Window Elevation w/ Dashed Hinge Triangle Pointing to Hinge Side */}
          <CalloutPin x={196} y={26} num={2} variant="amber" />
          <CadLabel x={278} y={26} text="HINGE TRIANGLE (ELEV)" fontSize={8.8} padX={4} color="#fde68a" borderColor="#d97706" />

          <rect x="208" y="48" width="110" height="80" fill="#0f243c" stroke="#f8fafc" strokeWidth="2.5" />
          <rect x="214" y="54" width="98" height="68" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
          {/* Dashed Hinge Lines Forming Triangle Apex at Left Hinge Edge */}
          <polyline
            points="312,54 214,88 312,122"
            fill="none"
            stroke="#fbbf24"
            strokeWidth="2.4"
            strokeDasharray="6 3"
          />
          <circle cx="214" cy="88" r="3.5" fill="#fbbf24" />
          <CadLabel x={264} y={146} text="APEX = HINGE SIDE" fontSize={8.8} padX={4} color="#fde68a" borderColor="#d97706" />

          {/* Bottom Bedroom Egress Callout */}
          <CalloutPin x={32} y={182} num={3} variant="emerald" />
          <CadLabel x={198} y={182} text="BEDROOM EGRESS: >= 0.35m² & NO DIM < 380mm" fontSize={8.6} padX={4} color="#6ee7b7" borderColor="#059669" />
        </g>
      )
    }
  }

  // 6B. DOOR SYMBOLS (A1.0 Detail 12 / 13 — Dedicated Top-Down Floor Plan Door Swing & Pocket/Bi-Fold Symbols)
  if (key.includes('door symbol')) {
    return {
      scaleLabel: 'DETAIL SCALE: TOP-DOWN PLAN DOOR SYMBOLS (A1.0)',
      keys: [
        '① Door Tag (D01) & 3068 Code: 3\'-0" x 6\'-8" (36"x80") nominal door cross-referenced to schedule',
        '② 90° Swing Arc & Hinge Side: Solid line = door leaf; dashed arc = travel path (never over stairs)',
        '③ Rough Opening Rule (R.O.): Frame R.O. Width = Door + 2" to 2-1/2" • Height = Door + 2-1/2"'
      ],
      renderSvg: () => (
        <g>
          {/* Framed Wall Opening Cheeks */}
          <rect x="22" y="122" width="36" height="20" fill="#1e293b" stroke="#cbd5e1" strokeWidth="2.2" />
          <rect x="132" y="122" width="44" height="20" fill="#1e293b" stroke="#cbd5e1" strokeWidth="2.2" />

          {/* Solid Door Leaf @ 90° + Dashed 90° Swing Arc */}
          <rect x="58" y="48" width="6" height="74" fill="#fbbf24" stroke="#ffffff" strokeWidth="1.5" />
          <path d="M 64 48 A 74 74 0 0 1 132 122" fill="none" stroke="#22d3ee" strokeWidth="2.5" strokeDasharray="6 4" />

          {/* Circular Door Schedule Tag (D01) inside Swing + Leader Drawn Behind Top Pill */}
          <line x1="94" y1="35" x2="94" y2="82" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3 2.5" />
          <circle cx="94" cy="96" r="14" fill="#0a192f" stroke="#fbbf24" strokeWidth="2" />
          <text x="94" y="100" fill="#fde68a" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
            D01
          </text>

          {/* Left Side Top Callout ①: Clean 6px Gap Between Pin ① (x=30, right=41) & Pill (x=47) */}
          <CalloutPin x={30} y={26} num={1} variant="amber" />
          <CadLabel x={47} y={26} align="start" text="TAG (D01) 3068 = 3'-0&quot;x6'-8&quot;" fontSize={8.5} padX={4} color="#fde68a" borderColor="#d97706" />

          {/* Pin ② Pointing to 90° Swing Arc */}
          <line x1="145" y1="68" x2="114" y2="72" stroke="#22d3ee" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <circle cx="114" cy="72" r="2.8" fill="#22d3ee" />
          <CalloutPin x={156} y={66} num={2} variant="cyan" />

          {/* Right Side Inset: Pocket Door & Bi-Fold Plan Symbols */}
          <rect x="192" y="42" width="148" height="104" rx="4" fill="#0f243c" stroke="#475569" strokeWidth="1.8" />
          <CadLabel x={266} y={56} text="POCKET & BI-FOLD PLAN" fontSize={8.5} padX={4} color="#67e8f9" borderColor="#0284c7" />
          {/* Pocket Door Symbol */}
          <rect x="204" y="76" width="56" height="12" fill="#1e293b" stroke="#94a3b8" strokeWidth="1.5" />
          <line x1="232" y1="82" x2="304" y2="82" stroke="#fbbf24" strokeWidth="3" strokeDasharray="6 3" />
          <rect x="308" y="76" width="22" height="12" fill="#1e293b" stroke="#94a3b8" strokeWidth="1.5" />
          {/* Bi-Fold Symbol */}
          <polyline points="212,130 238,112 264,130 290,112 316,130" fill="none" stroke="#34d399" strokeWidth="2.5" />

          {/* Bottom Rough Opening Rule Callout: Pin ③ Directly Left of R.O. Pill */}
          <CalloutPin x={61} y={180} num={3} variant="emerald" />
          <CadLabel x={78} y={180} align="start" text="R.O. = DOOR WIDTH + 2&quot; TO 2-1/2&quot; (SHIM GAP)" fontSize={8.8} padX={4.5} color="#6ee7b7" borderColor="#059669" />
        </g>
      )
    }
  }

  // 6C. WINDOW ROUGH OPENING (A1.0 Detail 7 / 13)
  if (key.includes('window rough opening')) {
    return {
      scaleLabel: 'DETAIL SCALE: WINDOW R.O. & HEADER FRAMING',
      keys: [
        '① Structural Header (Lintel): Transfers overhead loads onto Jack (Trimmer) studs',
        '② Rough Opening (R.O.): Nominal Window + 1/2" to 3/4" total shim clearance',
        '③ Bedroom Egress (NBC 9.9.10.1): Min 0.35 m² (3.77 ft²) & no dim < 380mm (15")'
      ],
      renderSvg: () => (
        <g>
          {/* Lintel Header across top */}
          <rect x="62" y="22" width="236" height="28" fill="#451a03" stroke="#fbbf24" strokeWidth="2.5" />
          <line x1="62" y1="36" x2="298" y2="36" stroke="#fbbf24" strokeWidth="1.5" />
          <CadLabel x={180} y={36} text="2-PLY 2x10 SPF HEADER" fontSize={10.5} color="#fde68a" borderColor="#d97706" />

          {/* King Studs (Outer) & Jack/Trimmer Studs (Inner) */}
          <rect x="48" y="22" width="14" height="140" fill="#1e293b" stroke="#94a3b8" strokeWidth="2" />
          <rect x="62" y="50" width="14" height="112" fill="#0f243c" stroke="#38bdf8" strokeWidth="2" />
          <rect x="284" y="50" width="14" height="112" fill="#0f243c" stroke="#38bdf8" strokeWidth="2" />
          <rect x="298" y="22" width="14" height="140" fill="#1e293b" stroke="#94a3b8" strokeWidth="2" />

          {/* Rough Opening Width Dimension */}
          <line x1="76" y1="92" x2="284" y2="92" stroke="#22d3ee" strokeWidth="2" />
          <polygon points="76,92 86,87 86,97" fill="#22d3ee" />
          <polygon points="284,92 274,87 274,97" fill="#22d3ee" />
          <CadLabel
            x={180}
            y={92}
            text="R.O. 48-1/2&quot; x 36-1/2&quot;"
            fontSize={10.5}
            color="#67e8f9"
            borderColor="#0284c7"
          />

          {/* Sill Plate / Threshold */}
          <rect x="76" y="150" width="208" height="12" fill="#1e293b" stroke="#fbbf24" strokeWidth="2" />
          <CadLabel
            x={180}
            y={126}
            text="EGRESS >= 0.35m² (MIN 380mm)"
            fontSize={10}
            padX={5}
            color="#6ee7b7"
            borderColor="#059669"
          />

          <CalloutPin x={30} y={36} num={1} variant="amber" />
          <CalloutPin x={100} y={68} num={2} variant="cyan" />
          <CalloutPin x={92} y={180} num={3} variant="emerald" />
          <CadLabel x={198} y={180} text="JACK (TRIMMER) & KING STUDS" fontSize={9.5} padX={5} color="#cbd5e1" borderColor="#475569" />
        </g>
      )
    }
  }

  // 7A. STAIRCASE SYMBOLS (A1.0 Detail 13 / 13 — Dedicated Top-Down Floor Plan Stair Symbol)
  if (key.includes('staircase symbol')) {
    return {
      scaleLabel: 'DETAIL SCALE: TOP-DOWN PLAN STAIRCASE SYMBOL',
      keys: [
        '① Travel Direction Arrow (UP / DN): Always points away from current floor plan datum',
        '② Diagonal Break Line: Shows where stair flight passes above the 1.2m (4\') plan cut plane',
        '③ Tread-to-Riser Rule (NBC 9.8.4): Treads = Risers - 1 (14R = 13T) • Min 900mm (35-1/2") width'
      ],
      renderSvg: () => (
        <g>
          {/* Rectangular Top-Down Stair Flight Outline */}
          <rect x="44" y="50" width="236" height="80" fill="#0f243c" stroke="#f8fafc" strokeWidth="2.5" />

          {/* Solid Tread Lines Before Cut Plane (Drawn BEFORE UP 14R -> Pill) */}
          {[72, 100, 128, 156, 184].map((xPos, i) => (
            <line key={i} x1={xPos} y1="50" x2={xPos} y2="130" stroke="#cbd5e1" strokeWidth="2" />
          ))}

          {/* Dashed Tread Lines Above 4' Cut Plane (Right Side) */}
          {[212, 240, 264].map((xPos, i) => (
            <line key={i} x1={xPos} y1="50" x2={xPos} y2="130" stroke="#64748b" strokeWidth="1.8" strokeDasharray="4 3" />
          ))}

          {/* ② Diagonal Break Line Across Middle of Flight */}
          <polyline
            points="178,44 189,84 181,92 197,96 206,136"
            fill="none"
            stroke="#fbbf24"
            strokeWidth="3"
          />

          {/* ① Travel Direction Arrow Along Centerline + Vertical Leader in Open 1st Tread */}
          <line x1="58" y1="34" x2="58" y2="84" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="3 2.5" />
          <circle cx="58" cy="92" r="4" fill="#22d3ee" />
          <line x1="58" y1="92" x2="164" y2="92" stroke="#22d3ee" strokeWidth="3" />
          <polygon points="170,92 158,86 158,98" fill="#22d3ee" />

          {/* Opaque #0a192f UP 14R -> Badge Rendered AFTER Tread Lines (Zero Line Bleed-Through) */}
          <CadLabel x={114} y={68} text="UP 14R ->" fontSize={9.5} padX={5} color="#67e8f9" borderColor="#0284c7" />

          {/* Top Callout ①: Direction Arrow Always Points From Floor Datum */}
          <CalloutPin x={46} y={25} num={1} variant="cyan" />
          <CadLabel x={63} y={25} align="start" text="ARROW POINTS FROM FLOOR DATUM" fontSize={9} padX={4.5} color="#67e8f9" borderColor="#0284c7" />

          {/* ② Break Line Callout: Pin ② Directly Left of Pill at Bottom of Yellow Break Line */}
          <line x1="206" y1="136" x2="206" y2="144" stroke="#fbbf24" strokeWidth="1.6" strokeDasharray="2.5 2" />
          <CalloutPin x={167} y={153} num={2} variant="amber" />
          <CadLabel x={184} y={153} align="start" text="DIAGONAL BREAK @ 4' CUT PLANE" fontSize={8.8} padX={4} color="#fde68a" borderColor="#d97706" />

          {/* ③ Bottom Riser/Tread Count & Width Callout */}
          <CalloutPin x={56} y={183} num={3} variant="emerald" />
          <CadLabel x={73} y={183} align="start" text="14 RISERS (R) / 13 TREADS (T) • MIN 36&quot; W" fontSize={8.8} padX={4.5} color="#6ee7b7" borderColor="#059669" />
        </g>
      )
    }
  }

  // 7B. STAIR RISE & RUN (A1.0 Detail 8 / 13)
  if (key.includes('stair rise & run')) {
    return {
      scaleLabel: 'DETAIL SCALE: NBC 9.8 STAIR SECTION GEOMETRY',
      keys: [
        '① Min Clear Headroom: 1950mm (6\'-5") measured vertically from nosing line',
        '② Private Rise & Run: Max Rise = 200mm (7-7/8"), Min Run = 255mm (10")',
        '③ Cut Stringer Throat: Min 90mm (3-1/2") effective uncut depth + 865–1070mm rail'
      ],
      renderSvg: () => (
        <g>
          {/* Upper Floor Landing Header */}
          <rect x="22" y="18" width="84" height="22" fill="#1e293b" stroke="#f59e0b" strokeWidth="2.5" />
          <CadLabel x={64} y={29} text="FLOOR HDR" fontSize={8.8} padX={4} color="#fde68a" borderColor="#d97706" />

          {/* Stair Steps & Cut Stringer */}
          <path
            d="M 24 176 L 24 148 L 66 148 L 66 120 L 108 120 L 108 92 L 150 92 L 150 64 L 172 64"
            fill="none"
            stroke="#f8fafc"
            strokeWidth="3"
          />
          <line x1="44" y1="184" x2="168" y2="92" stroke="#fbbf24" strokeWidth="3" />
          <line x1="24" y1="148" x2="108" y2="92" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="5 4" />

          {/* ① Vertical Headroom Line at Header Opening Edge */}
          <line x1="96" y1="40" x2="96" y2="100" stroke="#22d3ee" strokeWidth="2.5" />
          <polygon points="96,40 91,49 101,49" fill="#22d3ee" />
          <polygon points="96,100 91,91 101,91" fill="#22d3ee" />
          <line x1="96" y1="48" x2="174" y2="26" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="3 3" />
          <CalloutPin x={62} y={72} num={1} variant="cyan" />
          <CadLabel x={178} y={26} align="start" text="HEADROOM >= 1950mm (6'-5&quot;)" fontSize={9.2} padX={4.5} color="#67e8f9" borderColor="#0284c7" />

          {/* ② Green Riser (↕) & Run (↔) Callout Lines ABOVE Upper Stair Step (Clear of Stringer Below) */}
          <line x1="108" y1="46" x2="108" y2="87" stroke="#34d399" strokeWidth="1.4" strokeDasharray="2.5 2" />
          <line x1="150" y1="46" x2="150" y2="59" stroke="#34d399" strokeWidth="1.4" strokeDasharray="2.5 2" />
          <line x1="108" y1="50" x2="150" y2="50" stroke="#34d399" strokeWidth="2" />
          <polygon points="108,50 115,46.5 115,53.5" fill="#34d399" />
          <polygon points="150,50 143,46.5 143,53.5" fill="#34d399" />

          <line x1="134" y1="64" x2="146" y2="64" stroke="#34d399" strokeWidth="1.4" strokeDasharray="2.5 2" />
          <line x1="138" y1="64" x2="138" y2="92" stroke="#34d399" strokeWidth="2" />
          <polygon points="138,64 134.5,71 141.5,71" fill="#34d399" />
          <polygon points="138,92 134.5,85 141.5,85" fill="#34d399" />

          <polyline points="154,50 184,50 184,113" fill="none" stroke="#34d399" strokeWidth="1.5" strokeDasharray="3 2.5" />
          <CalloutPin x={165} y={122} num={2} variant="emerald" />
          <CadLabel x={182} y={122} align="start" text="MAX RISE 200mm / MIN RUN 255mm" fontSize={8.8} padX={4} color="#ffffff" borderColor="#34d399" />

          {/* ③ Effective Stringer Throat Depth */}
          <line x1="106" y1="138" x2="134" y2="165" stroke="#fbbf24" strokeWidth="2" strokeDasharray="3 2.5" />
          <CalloutPin x={142} y={174} num={3} variant="amber" />
          <CadLabel x={159} y={174} align="start" text="MIN 90mm (3.5&quot;) UNCUT THROAT" fontSize={9.2} padX={4.5} color="#fde68a" borderColor="#d97706" />
        </g>
      )
    }
  }

  // 8A. S1.0 CARD 1 — PAD FOOTING (PLAN SYMBOL + SECTION CALLOUT)
  if (key.includes('pad footing')) {
    return {
      scaleLabel: 'DETAIL SCALE: BURIED TELEPOST PAD FOOTING (S1.0 PLAN)',
      keys: [
        '① Dashed Square Outline: Hidden/buried concrete pad footing below basement slab (NBC 9.15.3)',
        '② Centerlines (℄) & Telepost: Exact point-load location supporting the main floor girder beam',
        '③ Pad Sizing Rule: Sized by tributary floor/roof load and soil bearing capacity (kPa / PSF)'
      ],
      renderSvg: () => (
        <g>
          {/* Intersecting Grid Centerlines (℄) */}
          <line x1="28" y1="106" x2="184" y2="106" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="12 4 3 4" />
          <line x1="106" y1="26" x2="106" y2="186" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="12 4 3 4" />

          {/* Overhead Dashed Girder Beam (3-Ply 2x10 Above) */}
          <line x1="28" y1="94" x2="184" y2="94" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5 3" />
          <line x1="28" y1="118" x2="184" y2="118" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5 3" />

          {/* Large Dashed Square (30"x30"x10" Buried Concrete Pad Footing) */}
          <rect
            x="50"
            y="50"
            width="112"
            height="112"
            rx="4"
            fill="#1e293b"
            fillOpacity="0.55"
            stroke="#fbbf24"
            strokeWidth="2.8"
            strokeDasharray="8 5"
          />

          {/* 6"x6" Steel Baseplate & Solid 3.5" Telepost Circle */}
          <rect x="88" y="88" width="36" height="36" fill="#0f243c" stroke="#cbd5e1" strokeWidth="2" />
          <circle cx="106" cy="106" r="11" fill="#0284c7" stroke="#ffffff" strokeWidth="2.5" />

          {/* Dashed Leader Lines */}
          <line x1="51" y1="38" x2="66" y2="50" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3 3" />
          <circle cx="66" cy="50" r="2.8" fill="#fbbf24" />
          <line x1="171" y1="80" x2="117" y2="102" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="3 3" />
          <circle cx="117" cy="102" r="2.8" fill="#22d3ee" />
          <line x1="171" y1="142" x2="144" y2="118" stroke="#34d399" strokeWidth="1.5" strokeDasharray="3 3" />
          <circle cx="144" cy="118" r="2.8" fill="#34d399" />

          {/* Callout Pins & High-Contrast Labels */}
          <CalloutPin x={42} y={32} num={1} variant="amber" />
          <CadLabel x={242} y={32} text="30&quot;x30&quot;x10&quot; PAD FOOTING" fontSize={9.5} padX={5} color="#fde68a" borderColor="#d97706" />

          <CalloutPin x={182} y={76} num={2} variant="cyan" />
          <CadLabel x={256} y={106} text="3.5&quot; TELEPOST ON 6&quot;x6&quot; PLATE" fontSize={8.8} padX={4} color="#67e8f9" borderColor="#0284c7" />

          <CalloutPin x={182} y={146} num={3} variant="emerald" />
          <CadLabel x={266} y={146} text="3-PLY 2x10 BEAM ABOVE" fontSize={9.2} padX={4.5} color="#6ee7b7" borderColor="#059669" />

          <CadLabel x={192} y={182} text="℄ GRID + SOIL BEARING (kPa/PSF)" fontSize={9.2} padX={4.5} color="#ffffff" borderColor="#475569" />
        </g>
      )
    }
  }

  // 8B. S1.0 CARD 2 — FOUNDATION WALLS (PLAN DOUBLE LINES + SECTION KEYWAY/BOLTS)
  if (key.includes('foundation wall')) {
    return {
      scaleLabel: 'DETAIL SCALE: FOUNDATION WALL PLAN & SECTION (NBC 9.15.4)',
      keys: [
        '① Solid Double Lines (Plan): Concrete foundation wall thickness (150mm–200mm min per NBC 9.15.4)',
        '② Outer Dashed Lines (Plan): Continuous strip footing projection (≥ wall width + projections)',
        '③ Keyway / Dowels & Sill Bolts: Resists lateral soil shear at base and anchors wood sill plate at top'
      ],
      renderSvg: () => (
        <g>
          {/* Left Pane: Plan View Symbol (Solid Double Wall + Outer Dashed Strip Footing) */}
          <line x1="56" y1="44" x2="56" y2="160" stroke="#fbbf24" strokeWidth="2.5" strokeDasharray="7 4" />
          <line x1="128" y1="44" x2="128" y2="160" stroke="#fbbf24" strokeWidth="2.5" strokeDasharray="7 4" />
          <rect x="76" y="44" width="32" height="116" fill="#1e293b" stroke="#f8fafc" strokeWidth="3" />

          {/* Dashed Cyan Leader from ① directly to Inner White Solid Wall Line (x=76) */}
          <line x1="41" y1="66" x2="76" y2="66" stroke="#22d3ee" strokeWidth="1.8" strokeDasharray="3 2.5" />
          <circle cx="76" cy="66" r="3" fill="#22d3ee" />
          <CalloutPin x={30} y={66} num={1} variant="cyan" />
          <CadLabel x={96} y={26} text="200mm / 8&quot; CONC. WALL" fontSize={9.5} padX={4.5} color="#67e8f9" borderColor="#0284c7" />

          {/* Dashed Amber Leader from ② directly to Outer Yellow Dashed Strip Footing Line (x=56) */}
          <line x1="41" y1="136" x2="56" y2="136" stroke="#fbbf24" strokeWidth="1.8" strokeDasharray="3 2.5" />
          <circle cx="56" cy="136" r="3" fill="#fbbf24" />
          <CalloutPin x={30} y={136} num={2} variant="amber" />
          <CadLabel x={102} y={182} text="CONTINUOUS STRIP FOOTING" fontSize={9} padX={4.5} color="#fde68a" borderColor="#d97706" />

          {/* Center Divider */}
          <line x1="178" y1="20" x2="178" y2="190" stroke="#334155" strokeWidth="1.5" strokeDasharray="4 4" />

          {/* Right Pane: Section View (Wall + Keyway Joint + 1/2" Sill Anchor Bolt) */}
          <rect x="238" y="54" width="46" height="82" fill="#1e293b" stroke="#cbd5e1" strokeWidth="2.5" />
          <rect x="212" y="136" width="98" height="28" fill="#1e293b" stroke="#38bdf8" strokeWidth="2.5" />
          {/* Shear Keyway Joint */}
          <path d="M 251 136 L 255 144 L 267 144 L 271 136" fill="#0a192f" stroke="#fbbf24" strokeWidth="2" />
          {/* Top 1/2" Anchor Bolt */}
          <path d="M 261 38 L 261 82 Q 261 90 271 90" fill="none" stroke="#22d3ee" strokeWidth="3.5" strokeLinecap="round" />

          {/* Dashed Emerald Leaders from ③ to Anchor Bolt and Keyway Joint */}
          <line x1="211" y1="108" x2="258" y2="66" stroke="#34d399" strokeWidth="1.5" strokeDasharray="3 3" />
          <circle cx="258" cy="66" r="2.8" fill="#34d399" />
          <line x1="211" y1="118" x2="252" y2="138" stroke="#34d399" strokeWidth="1.5" strokeDasharray="3 3" />
          <circle cx="252" cy="138" r="2.8" fill="#34d399" />

          <CadLabel x={264} y={26} text="1/2&quot; ANCHOR BOLTS @ <= 2.4m OC" fontSize={8.5} padX={4} color="#6ee7b7" borderColor="#059669" />
          <CalloutPin x={200} y={114} num={3} variant="emerald" />
          <CadLabel x={268} y={182} text="KEYWAY JOINT + DOWELS" fontSize={9.2} padX={4.5} color="#ffffff" borderColor="#64748b" />
        </g>
      )
    }
  }

  // 8C. S1.0 CARD 3 — REBAR SPACING (75mm EARTH COVER + 15M BARS + 40d LAP SPLICE)
  if (key.includes('rebar')) {
    return {
      scaleLabel: 'DETAIL SCALE: FOOTING REBAR COVER & 40d SPLICE (CSA A23.1)',
      keys: [
        '① Min Concrete Cover (CSA A23.1): 75mm (3") clear cover when concrete is cast against earth on chairs',
        '② Longitudinal & Dowel Bars (NBC 9.15): 2x 15M continuous footing bars + vertical L-dowels into wall',
        '③ Lap Splice Rule (40d): Overlap spliced rebar by >= 40x bar diameter (~600mm / 24" for 15M)'
      ],
      renderSvg: () => (
        <g>
          {/* Top Callout: 40d Rebar Lap Splice (~600mm / 24" for 15M) */}
          <CalloutPin x={32} y={26} num={3} variant="cyan" />
          <CadLabel x={198} y={26} text="40d LAP SPLICE (~600mm / 24&quot; FOR 15M)" fontSize={9} padX={4.5} color="#67e8f9" borderColor="#0284c7" />
          <line x1="43" y1="30" x2="128" y2="41" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="56" y1="49" x2="224" y2="49" stroke="#ef4444" strokeWidth="4" />
          <line x1="132" y1="55" x2="300" y2="55" stroke="#f59e0b" strokeWidth="4" />
          {/* Lap Splice Dimension Bracket with Ticks */}
          <line x1="132" y1="41" x2="224" y2="41" stroke="#22d3ee" strokeWidth="1.8" />
          <line x1="132" y1="37" x2="132" y2="45" stroke="#22d3ee" strokeWidth="1.8" />
          <line x1="224" y1="37" x2="224" y2="45" stroke="#22d3ee" strokeWidth="1.8" />

          {/* Lower Wall & Concrete Footing Reinforcement Section */}
          <rect x="134" y="72" width="54" height="34" fill="#1e293b" stroke="#cbd5e1" strokeWidth="2" />
          <rect x="74" y="106" width="184" height="56" fill="#1e293b" stroke="#38bdf8" strokeWidth="2.5" />
          <line x1="54" y1="162" x2="278" y2="162" stroke="#10b981" strokeWidth="2.5" />

          {/* Rebar Chairs Supporting 75mm (3") Bottom Earth Cover */}
          <polyline points="102,162 110,140 118,162" fill="none" stroke="#94a3b8" strokeWidth="2" />
          <polyline points="214,162 222,140 230,162" fill="none" stroke="#94a3b8" strokeWidth="2" />

          {/* 2x 15M Continuous Bars + Vertical L-Dowel */}
          <circle cx="110" cy="134" r="6" fill="#ef4444" stroke="#fca5a5" strokeWidth="1.5" />
          <circle cx="222" cy="134" r="6" fill="#ef4444" stroke="#fca5a5" strokeWidth="1.5" />
          <path d="M 161 76 L 161 134 L 200 134" fill="none" stroke="#fbbf24" strokeWidth="3.5" />

          {/* ① Vertical 3" (75mm) Earth Cover Dimension Indicator + Leader Line */}
          <line x1="90" y1="134" x2="90" y2="162" stroke="#fbbf24" strokeWidth="2" />
          <line x1="85" y1="134" x2="95" y2="134" stroke="#fbbf24" strokeWidth="2" />
          <line x1="85" y1="162" x2="95" y2="162" stroke="#fbbf24" strokeWidth="2" />
          <text x="126" y="153" fill="#fde68a" fontSize="9.5" fontFamily="monospace" fontWeight="bold">
            ↕ 3&quot; (75mm)
          </text>
          <line x1="49" y1="146" x2="90" y2="148" stroke="#fbbf24" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <CalloutPin x={38} y={146} num={1} variant="amber" />
          <CadLabel x={180} y={182} text="75mm (3&quot;) MIN EARTH COVER ON CHAIRS" fontSize={9.2} padX={4.5} color="#fde68a" borderColor="#d97706" />

          {/* ② Placed Cleanly Next to 2x 15M CONT. BARS with Leaders to L-Dowel & Red 15M Bar */}
          <line x1="201" y1="90" x2="161" y2="96" stroke="#34d399" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <circle cx="161" cy="96" r="2.8" fill="#34d399" />
          <line x1="214" y1="99" x2="222" y2="128" stroke="#34d399" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <circle cx="222" cy="128" r="2.8" fill="#34d399" />
          <CalloutPin x={212} y={88} num={2} variant="emerald" />
          <CadLabel x={284} y={88} text="2x 15M CONT. BARS" fontSize={9} padX={4.5} color="#fca5a5" borderColor="#ef4444" />
        </g>
      )
    }
  }

  // 8D. S1.0 CARD 4 — DAMP-PROOFING (BITUMINOUS COATING + DIMPLED MEMBRANE + TERM BAR)
  if (key.includes('damp-proofing')) {
    return {
      scaleLabel: 'DETAIL SCALE: BELOW-GRADE WALL DAMP-PROOFING (NBC 9.13)',
      keys: [
        '① Bituminous Damp-Proofing (NBC 9.13.2): Applied to exterior wall below grade (parge first if unit masonry)',
        '② Dimpled Drainage Membrane: Creates positive capillary air gap directing soil water down to tile',
        '③ Grade Termination Bar: Seals top edge of membrane at finished grade (use waterproofing if hydrostatic)'
      ],
      renderSvg: () => (
        <g>
          {/* Concrete Foundation Wall & Footing */}
          <rect x="42" y="22" width="64" height="142" fill="#1e293b" stroke="#cbd5e1" strokeWidth="2.5" />
          <rect x="26" y="164" width="96" height="24" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
          <CadLabel x={74} y={96} text="8&quot; WALL" fontSize={9.5} padX={4} color="#cbd5e1" borderColor="#64748b" />

          {/* Finished Grade Line */}
          <line x1="106" y1="62" x2="334" y2="62" stroke="#10b981" strokeWidth="3" />

          {/* ③ Moulding / Termination Bar at Grade */}
          <rect x="104" y="56" width="14" height="10" fill="#fbbf24" stroke="#ffffff" strokeWidth="1.5" />

          {/* ① Bituminous Damp-Proofing Layer on Exterior Wall Face */}
          <line x1="110" y1="66" x2="110" y2="164" stroke="#f59e0b" strokeWidth="5" />

          {/* ② Dimpled Drainage Membrane Sheet */}
          <path
            d="M 119 66 L 125 74 L 119 82 L 125 90 L 119 98 L 125 106 L 119 114 L 125 122 L 119 130 L 125 138 L 119 146 L 125 154 L 119 164"
            fill="none"
            stroke="#22d3ee"
            strokeWidth="3"
          />

          {/* Dashed Leader Lines from ③, ①, ② to Their Exact Layers */}
          <line x1="139" y1="42" x2="116" y2="58" stroke="#34d399" strokeWidth="1.7" strokeDasharray="3 2.5" />
          <circle cx="116" cy="58" r="3" fill="#34d399" />

          <line x1="139" y1="108" x2="110" y2="108" stroke="#fbbf24" strokeWidth="1.7" strokeDasharray="3 2.5" />
          <circle cx="110" cy="108" r="3" fill="#fbbf24" />

          <line x1="139" y1="154" x2="124" y2="154" stroke="#22d3ee" strokeWidth="1.7" strokeDasharray="3 2.5" />
          <circle cx="124" cy="154" r="3" fill="#22d3ee" />

          {/* Callouts & Labels */}
          <CalloutPin x={150} y={38} num={3} variant="emerald" />
          <CadLabel x={254} y={38} text="MOULDING / TERMINATION BAR" fontSize={9} padX={4.5} color="#6ee7b7" borderColor="#059669" />

          <CalloutPin x={150} y={108} num={1} variant="amber" />
          <CadLabel x={256} y={108} text="BITUMINOUS DAMP-PROOFING" fontSize={9} padX={4.5} color="#fde68a" borderColor="#d97706" />

          <CalloutPin x={150} y={154} num={2} variant="cyan" />
          <CadLabel x={256} y={154} text="DIMPLED DRAINAGE MEMBRANE" fontSize={9} padX={4.5} color="#67e8f9" borderColor="#0284c7" />
        </g>
      )
    }
  }

  // 8E. S1.0 CARD 5 — WEEPING TILE DRAINAGE (4" PERF PIPE + 6" CLEAR STONE + GEOTEXTILE)
  if (key.includes('weeping tile')) {
    return {
      scaleLabel: 'DETAIL SCALE: PERIMETER WEEPING TILE DRAINAGE (NBC 9.14.3)',
      keys: [
        '① 4" (100mm) Perforated Pipe (NBC 9.14.3.1): Laid on undisturbed soil at footing base below slab',
        '② Clear Crushed Stone Cover: Min 150mm (6") coarse gravel cover over top and sides of pipe',
        '③ Geotextile Filter Fabric / Sock: Separates native backfill soil so silt cannot clog drain bed'
      ],
      renderSvg: () => (
        <g>
          {/* Foundation Wall & Strip Footing on Left */}
          <rect x="34" y="24" width="48" height="96" fill="#1e293b" stroke="#cbd5e1" strokeWidth="2.5" />
          <rect x="22" y="120" width="94" height="42" fill="#1e293b" stroke="#38bdf8" strokeWidth="2.5" />
          <CadLabel x={68} y={141} text="FOOTING" fontSize={9} padX={4} color="#cbd5e1" borderColor="#475569" />

          {/* ③ Geotextile Filter Fabric Wrapping Crushed Stone Trench */}
          <rect
            x="120"
            y="94"
            width="126"
            height="66"
            rx="8"
            fill="#0f243c"
            stroke="#34d399"
            strokeWidth="2.5"
            strokeDasharray="6 3"
          />

          {/* ② Clear Stone Aggregate Dots */}
          {[
            [138, 112],
            [162, 108],
            [196, 110],
            [222, 114],
            [138, 144],
            [224, 142],
            [206, 132]
          ].map(([cx, cy], idx) => (
            <circle key={idx} cx={cx} cy={cy} r="3.5" fill="#64748b" />
          ))}

          {/* ① 4" (100mm) Perforated Weeping Tile Pipe + Filter Sock */}
          <circle cx="176" cy="136" r="16" fill="#0a192f" stroke="#22d3ee" strokeWidth="3.5" strokeDasharray="5 3" />
          <circle cx="176" cy="136" r="11" fill="none" stroke="#fde68a" strokeWidth="1.2" strokeDasharray="2 2" />

          {/* Crisp Dashed Leader Lines from ③, ②, ① (Shortened ② to Gravel Top Edge) */}
          <line x1="128" y1="47" x2="128" y2="94" stroke="#34d399" strokeWidth="1.7" strokeDasharray="3 2.5" />
          <circle cx="128" cy="94" r="3" fill="#34d399" />

          <line x1="158" y1="78" x2="176" y2="96" stroke="#fbbf24" strokeWidth="1.7" strokeDasharray="3 2.5" />
          <circle cx="176" cy="96" r="3" fill="#fbbf24" />

          <line x1="138" y1="173" x2="166" y2="148" stroke="#22d3ee" strokeWidth="1.7" strokeDasharray="3 2.5" />
          <circle cx="166" cy="148" r="3" fill="#22d3ee" />

          {/* Callouts & Labels */}
          <CalloutPin x={128} y={36} num={3} variant="emerald" />
          <CadLabel x={145} y={36} align="start" text="GEOTEXTILE FILTER FABRIC" fontSize={9.2} padX={4.5} color="#6ee7b7" borderColor="#059669" />

          <CalloutPin x={150} y={70} num={2} variant="amber" />
          <CadLabel x={167} y={70} align="start" text=">= 6&quot; (150mm) CLEAR STONE" fontSize={9.2} padX={4.5} color="#fde68a" borderColor="#d97706" />

          <CalloutPin x={128} y={182} num={1} variant="cyan" />
          <CadLabel x={242} y={182} text="4&quot; (100mm) PERFORATED PIPE + SOCK" fontSize={8.8} padX={4} color="#67e8f9" borderColor="#0284c7" />
        </g>
      )
    }
  }

  // 8F. S1.0 CARD 6 — STEP FOOTINGS (NBC 9.15.3.9)
  if (key.includes('step footing')) {
    return {
      scaleLabel: 'DETAIL SCALE: STEPPED STRIP FOOTING (NBC 9.15.3.9)',
      keys: [
        '① Max Step Rise (NBC 9.15.3.9): Vertical step height <= 600mm (24") in sand/gravel (<= 300mm if steep/clay)',
        '② Min Horizontal Run: Level step distance between risers must be >= 600mm (24")',
        '③ Vertical Step Thickness: Monolithic vertical concrete riser thickness >= footing depth'
      ],
      renderSvg: () => (
        <g>
          {/* Stepped Footing Profile */}
          <path
            d="M 28 158 L 164 158 L 164 92 L 332 92 L 332 122 L 196 122 L 196 186 L 28 186 Z"
            fill="#1e293b"
            stroke="#38bdf8"
            strokeWidth="3"
          />
          {/* Continuous 15M Rebar */}
          <path
            d="M 40 172 L 180 172 L 180 107 L 320 107"
            fill="none"
            stroke="#ef4444"
            strokeWidth="3"
            strokeDasharray="10 4"
          />

          {/* ① Vertical Step Rise Dimension Line with Ticks & Arrowheads + Dashed Leader */}
          <line x1="130" y1="92" x2="160" y2="92" stroke="#fbbf24" strokeWidth="1.4" strokeDasharray="2 2" />
          <line x1="130" y1="158" x2="160" y2="158" stroke="#fbbf24" strokeWidth="1.4" strokeDasharray="2 2" />
          <line x1="138" y1="92" x2="138" y2="158" stroke="#fbbf24" strokeWidth="2.2" />
          <polygon points="138,92 134,100 142,100" fill="#fbbf24" />
          <polygon points="138,158 134,150 142,150" fill="#fbbf24" />
          <line x1="132" y1="38" x2="138" y2="92" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3 2.5" />

          {/* ② Horizontal Step Run Dimension Line with Ticks & Arrowheads + Dashed Leader */}
          <line x1="164" y1="68" x2="164" y2="88" stroke="#22d3ee" strokeWidth="1.6" />
          <line x1="332" y1="68" x2="332" y2="88" stroke="#22d3ee" strokeWidth="1.6" />
          <line x1="164" y1="76" x2="332" y2="76" stroke="#22d3ee" strokeWidth="2.2" />
          <polygon points="164,76 172,72 172,80" fill="#22d3ee" />
          <polygon points="332,76 324,72 324,80" fill="#22d3ee" />
          <line x1="173" y1="60" x2="210" y2="76" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="3 2.5" />

          {/* ③ Horizontal Thickness Double-Arrow Across Vertical Concrete Step Riser + Dashed Leader */}
          <line x1="164" y1="138" x2="196" y2="138" stroke="#34d399" strokeWidth="2.5" />
          <polygon points="164,138 171,134 171,142" fill="#34d399" />
          <polygon points="196,138 189,134 189,142" fill="#34d399" />
          <line x1="211" y1="138" x2="196" y2="138" stroke="#34d399" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <line x1="226" y1="149" x2="254" y2="169" stroke="#34d399" strokeWidth="1.5" strokeDasharray="3 2.5" />

          {/* ① Max Step Rise */}
          <CalloutPin x={32} y={28} num={1} variant="amber" />
          <CadLabel x={132} y={28} text="MAX STEP RISE <= 600mm (24&quot;)" fontSize={9} padX={4.5} color="#fde68a" borderColor="#d97706" />

          {/* ② Min Horizontal Run */}
          <CalloutPin x={164} y={52} num={2} variant="cyan" />
          <CadLabel x={262} y={52} text="MIN HORIZ. RUN >= 600mm (24&quot;)" fontSize={8.8} padX={4} color="#67e8f9" borderColor="#0284c7" />

          {/* ③ Vertical Step Thickness */}
          <CalloutPin x={222} y={138} num={3} variant="emerald" />
          <CadLabel x={266} y={178} text="VERT STEP >= FOOTING DEPTH" fontSize={9} padX={4.5} color="#6ee7b7" borderColor="#059669" />
        </g>
      )
    }
  }

  // 8G. S1.0 CARD 7 — FROST DEPTH FOUNDATIONS (NBC 9.12.2.2)
  if (key.includes('frost depth')) {
    return {
      scaleLabel: 'DETAIL SCALE: FROST PENETRATION & U.S.F. DATUM (NBC 9.12.2)',
      keys: [
        '① Finished Grade Datum: Surface elevation reference from which foundation frost depth is measured',
        '② Local Frost Penetration Line (NBC 9.12.2.2): Depth where soil water freezes and expands (1.2m–1.8m)',
        '③ U.S.F. Below Frost Line: Underside of Footing rests on undisturbed native soil below frost to stop heave'
      ],
      renderSvg: () => (
        <g>
          {/* Exterior Foundation Wall & Footing Extending Below Frost Line */}
          <rect x="64" y="22" width="44" height="122" fill="#1e293b" stroke="#cbd5e1" strokeWidth="2.5" />
          <rect x="42" y="144" width="88" height="28" fill="#1e293b" stroke="#38bdf8" strokeWidth="2.5" />

          {/* Vertical Frost Depth Dimension Arrow on Left */}
          <line x1="34" y1="54" x2="34" y2="112" stroke="#22d3ee" strokeWidth="2" />
          <polygon points="34,54 30,62 38,62" fill="#22d3ee" />
          <polygon points="34,112 30,104 38,104" fill="#22d3ee" />

          {/* ① Finished Grade Line + Leader */}
          <line x1="22" y1="54" x2="334" y2="54" stroke="#10b981" strokeWidth="3" />
          <line x1="136" y1="42" x2="122" y2="54" stroke="#34d399" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <circle cx="122" cy="54" r="2.8" fill="#34d399" />
          <CalloutPin x={144} y={34} num={1} variant="emerald" />
          <CadLabel x={246} y={34} text="FINISHED GRADE DATUM" fontSize={9.5} padX={5} color="#6ee7b7" borderColor="#059669" />

          {/* ② Dashed Horizontal Frost Penetration Line (1.2m–1.5m) + Leader */}
          <line x1="22" y1="112" x2="334" y2="112" stroke="#22d3ee" strokeWidth="2.5" strokeDasharray="8 5" />
          <line x1="136" y1="98" x2="122" y2="112" stroke="#22d3ee" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <circle cx="122" cy="112" r="2.8" fill="#22d3ee" />
          <CalloutPin x={144} y={90} num={2} variant="cyan" />
          <CadLabel x={252} y={90} text="FROST PENETRATION LINE (1.2m–1.5m)" fontSize={8.5} padX={4} color="#67e8f9" borderColor="#0284c7" />

          {/* ③ U.S.F. (Underside of Footing) Bearing on Undisturbed Soil + Leader */}
          <line x1="22" y1="172" x2="334" y2="172" stroke="#fbbf24" strokeWidth="2" strokeDasharray="4 3" />
          <line x1="148" y1="158" x2="130" y2="172" stroke="#fbbf24" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <circle cx="130" cy="172" r="2.8" fill="#fbbf24" />
          <CalloutPin x={156} y={150} num={3} variant="amber" />
          <CadLabel x={256} y={150} text="U.S.F. (UNDERSIDE OF FOOTING)" fontSize={8.8} padX={4} color="#fde68a" borderColor="#d97706" />

          <CadLabel x={190} y={187} text="UNDISTURBED NATIVE SOIL BELOW FROST" fontSize={8.8} padX={4} color="#cbd5e1" borderColor="#475569" />
        </g>
      )
    }
  }

  // 9A. A3.1 DETAIL 1 / 10 — ENVELOPE ASSEMBLY LAYERS
  if (key.includes('envelope')) {
    return {
      scaleLabel: 'DETAIL SCALE: HIGH-PERFORMANCE WALL ENVELOPE (A3.1)',
      keys: [
        '① 6-Mil Poly Vapour Barrier: Installed on WARM-IN-WINTER side of stud & R-24 batt',
        '② 7/16" OSB Sheathing + WRB (Tyvek): Nailed 150mm (6") edges / 300mm (12") field',
        '③ 10mm (3/8") Rainscreen Strapping: Drained capillary air gap behind siding'
      ],
      renderSvg: () => (
        <g>
          {/* Interior 1/2" Drywall */}
          <rect x="40" y="36" width="10" height="128" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1.5" />
          {/* 6-Mil Poly Vapour Barrier (Red Line) */}
          <line x1="55" y1="36" x2="55" y2="164" stroke="#ef4444" strokeWidth="4" />
          {/* 2x6 Stud Cavity w/ R-24 Insulation Wave */}
          <rect x="59" y="36" width="94" height="128" fill="#1e293b" stroke="#fbbf24" strokeWidth="2.5" />
          <path
            d="M 72 48 Q 140 66 72 84 Q 140 102 72 120 Q 140 138 72 154"
            fill="none"
            stroke="#ec4899"
            strokeWidth="3"
          />
          {/* 7/16" OSB Sheathing */}
          <rect x="155" y="36" width="12" height="128" fill="#78350f" stroke="#f59e0b" strokeWidth="1.5" />
          {/* Tyvek WRB (Cyan Dashed at x=172) */}
          <line x1="172" y1="36" x2="172" y2="164" stroke="#22d3ee" strokeWidth="3.5" strokeDasharray="6 3" />
          {/* Widened 10mm Rainscreen Cavity & Strapping (x=172..208 so Pin ③ has clean air gap) */}
          <rect x="177" y="44" width="26" height="20" fill="#451a03" stroke="#fbbf24" strokeWidth="1.5" />
          <rect x="177" y="136" width="26" height="20" fill="#451a03" stroke="#fbbf24" strokeWidth="1.5" />
          {/* Lap Siding Cladding (x=208..218) */}
          <path
            d="M 208 36 L 218 62 L 209 62 L 218 90 L 209 90 L 218 118 L 209 118 L 218 146 L 209 146 L 218 164"
            fill="none"
            stroke="#f8fafc"
            strokeWidth="2.8"
          />

          {/* Opaque #0a192f Labels & Non-Overlapping Callout Pins */}
          <CadLabel x={106} y={50} text="2x6 STUD + R24" fontSize={9.2} padX={4.5} color="#fde68a" borderColor="#d97706" />
          <CadLabel x={106} y={184} text="6-MIL POLY (WARM SIDE)" fontSize={9.2} padX={4.5} color="#fca5a5" borderColor="#ef4444" />
          <CadLabel x={226} y={60} align="start" text="OSB + WRB MEMBRANE" fontSize={9} padX={4.5} color="#67e8f9" borderColor="#0284c7" />
          <CadLabel x={226} y={102} align="start" text="10mm RAINSCREEN GAP" fontSize={9} padX={4.5} color="#6ee7b7" borderColor="#059669" />
          <CadLabel x={226} y={144} align="start" text="LAP SIDING CLADDING" fontSize={9} padX={4.5} color="#ffffff" borderColor="#64748b" />

          <CalloutPin x={24} y={98} num={1} variant="amber" />
          <CalloutPin x={172} y={21} num={2} variant="cyan" />
          <CalloutPin x={190} y={102} num={3} variant="emerald" />
        </g>
      )
    }
  }

  // 9B. A3.1 DETAIL 2 / 10 — ATTIC VENTILATION BAFFLES (EAVE / HEEL RAFTER & SOFFIT SECTION)
  if (key.includes('baffle')) {
    return {
      scaleLabel: 'DETAIL SCALE: EAVE SOFFIT & ATTIC BAFFLE (NBC 9.19.1)',
      keys: [
        '① Insulation Baffle / Chute: Maintains min 25mm–50mm (1"–2") clear airway above eave insulation',
        '② Wind Washing Dam: Stops cold soffit air from blowing into fiberglass batts over the top plate',
        '③ Net Free Vent Area (NBC 9.19.1.1): Min 1/300 of insulated ceiling area (1/150 for low-slope/cathedral roofs)'
      ],
      renderSvg: () => (
        <g>
          {/* Sloped Roof Sheathing & Rafter Top Chord */}
          <polygon points="22,128 228,34 232,42 26,136" fill="#78350f" stroke="#f59e0b" strokeWidth="1.8" />

          {/* Fascia Board & Perforated Vented Soffit Panel */}
          <rect x="18" y="128" width="10" height="32" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1.5" />
          <line x1="28" y1="154" x2="96" y2="154" stroke="#e2e8f0" strokeWidth="3.5" strokeDasharray="7 4" />

          {/* Exterior Wall Double Top Plate + Vertical Wind Washing Dam */}
          <rect x="96" y="154" width="28" height="16" fill="#1e293b" stroke="#94a3b8" strokeWidth="1.8" />
          <rect x="96" y="142" width="28" height="12" fill="#451a03" stroke="#fbbf24" strokeWidth="1.8" />
          <line x1="96" y1="142" x2="96" y2="112" stroke="#fbbf24" strokeWidth="3" />

          {/* ① Rigid Attic Ventilation Baffle (Rafter Vent) Stapled 18px Below Roof Sheathing */}
          <line x1="78" y1="126" x2="222" y2="60" stroke="#ec4899" strokeWidth="3.2" />

          {/* ② Curved Cyan Airflow Arrow from Vented Soffit Up Through Baffle */}
          <path d="M 58 168 Q 60 128 92 110 L 210 56" fill="none" stroke="#22d3ee" strokeWidth="2.6" strokeDasharray="6 3" />
          <polygon points="218,52 206,53 210,61" fill="#22d3ee" />

          {/* Interior Ceiling Line + High-Heel Fiberglass Batt Tucked Behind Wind Dam */}
          <line x1="124" y1="154" x2="170" y2="154" stroke="#cbd5e1" strokeWidth="3" />
          <path
            d="M 102 148 Q 110 118 120 148 Q 132 104 144 148 Q 156 96 166 148"
            fill="none"
            stroke="#f472b6"
            strokeWidth="3"
          />

          {/* Leader Lines (Drawn Before Opaque #0a192f Pills) */}
          <line x1="156" y1="34" x2="156" y2="82" stroke="#22d3ee" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <circle cx="156" cy="82" r="2.8" fill="#22d3ee" />

          <line x1="62" y1="175" x2="62" y2="154" stroke="#fbbf24" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <line x1="96" y1="175" x2="96" y2="142" stroke="#fbbf24" strokeWidth="1.6" strokeDasharray="3 2.5" />

          {/* ① Clear Air Chute Callout */}
          <CalloutPin x={26} y={25} num={1} variant="cyan" />
          <CadLabel x={43} y={25} align="start" text="MIN 25-50mm (1&quot;-2&quot;) AIR CHUTE" fontSize={8.5} padX={4} color="#67e8f9" borderColor="#0284c7" />

          {/* ③ NBC 9.19.1.1 Net Free Vent Area Callout */}
          <CalloutPin x={184} y={114} num={3} variant="emerald" />
          <CadLabel x={201} y={114} align="start" text="NBC 9.19.1.1: >= 1/300 VENT" fontSize={8.3} padX={4} color="#6ee7b7" borderColor="#059669" />

          {/* ② Soffit Airflow & Wind Dam Callout */}
          <CalloutPin x={28} y={185} num={2} variant="amber" />
          <CadLabel x={45} y={185} align="start" text="SOFFIT-TO-ATTIC AIRFLOW + WIND DAM" fontSize={8.5} padX={4} color="#fde68a" borderColor="#d97706" />
        </g>
      )
    }
  }

  // 9C. A3.1 DETAIL 3 / 10 — FOUNDATION SILL GASKET (RIM JOIST & SILL AIR-BARRIER SECTION)
  if (key.includes('sill gasket')) {
    return {
      scaleLabel: 'DETAIL SCALE: SILL GASKET & RIM AIR BARRIER (NBC 9.25.3)',
      keys: [
        '① Closed-Cell Sill Gasket (NBC 9.23.7.2): Fills concrete irregularities up to 6mm (1/4") and stops capillary wicking',
        '② Treated / Separated Wood Sill: Required whenever wood framing is < 150mm (6") from earth or bears directly on concrete',
        '③ Rim Joist Air/Thermal Seal: Continuous air barrier & insulation sealed across header joist cavity'
      ],
      renderSvg: () => (
        <g>
          {/* Subfloor + 2x10 Rim Joist + Floor Cavity */}
          <rect x="34" y="26" width="110" height="10" fill="#78350f" stroke="#f59e0b" strokeWidth="1.8" />
          <rect x="34" y="36" width="18" height="70" fill="#451a03" stroke="#fbbf24" strokeWidth="2" />
          <rect x="52" y="36" width="92" height="70" fill="#0f243c" stroke="#475569" strokeWidth="1.5" />

          {/* ③ Interior Rigid Foam + Sealed Poly Air Barrier Continuity at Rim Header */}
          <rect x="54" y="38" width="18" height="66" fill="#064e3b" stroke="#34d399" strokeWidth="2" />
          <polyline points="118,39 74,39 74,104 118,104" fill="none" stroke="#34d399" strokeWidth="2.5" strokeDasharray="6 3" />
          <circle cx="74" cy="40" r="3" fill="#10b981" />
          <circle cx="74" cy="103" r="3" fill="#10b981" />

          {/* ② Second Gasket / Sealant Bead Between Sill Plate & 2x10 Rim Joist */}
          <line x1="34" y1="108" x2="108" y2="108" stroke="#22d3ee" strokeWidth="3.5" />

          {/* 38x140 (2x6) Wood Sill Plate */}
          <rect x="34" y="111" width="74" height="22" fill="#451a03" stroke="#fbbf24" strokeWidth="2.2" />

          {/* ① Continuous Pink Closed-Cell Foam Sill Gasket on Concrete Top */}
          <line x1="30" y1="136" x2="112" y2="136" stroke="#ec4899" strokeWidth="6" strokeLinecap="round" />

          {/* Concrete Foundation Wall Top */}
          <rect x="30" y="140" width="88" height="48" fill="#1e293b" stroke="#94a3b8" strokeWidth="2.5" />
          <CadLabel x={74} y={165} text="CONC. WALL" fontSize={8.5} padX={4} color="#cbd5e1" borderColor="#475569" />

          {/* Crisp Horizontal Leader Lines */}
          <line x1="74" y1="66" x2="149" y2="66" stroke="#34d399" strokeWidth="1.7" strokeDasharray="3 2.5" />
          <circle cx="74" cy="66" r="2.8" fill="#34d399" />

          <line x1="108" y1="108" x2="149" y2="108" stroke="#22d3ee" strokeWidth="1.7" strokeDasharray="3 2.5" />
          <circle cx="108" cy="108" r="2.8" fill="#22d3ee" />

          <line x1="112" y1="136" x2="149" y2="146" stroke="#ec4899" strokeWidth="1.7" strokeDasharray="3 2.5" />
          <circle cx="112" cy="136" r="2.8" fill="#ec4899" />

          {/* Opaque #0a192f Callouts & Pins */}
          <CalloutPin x={160} y={66} num={3} variant="emerald" />
          <CadLabel x={177} y={66} align="start" text="RIGID FOAM + AIR BARRIER SEAL" fontSize={8.5} padX={4} color="#6ee7b7" borderColor="#059669" />

          <CalloutPin x={160} y={108} num={2} variant="cyan" />
          <CadLabel x={177} y={108} align="start" text="CAPILLARY & AIR SEAL @ RIM" fontSize={8.5} padX={4} color="#67e8f9" borderColor="#0284c7" />

          <CalloutPin x={160} y={146} num={1} variant="amber" />
          <CadLabel x={177} y={146} align="start" text="CLOSED-CELL FOAM SILL GASKET" fontSize={8.5} padX={4} color="#f472b6" borderColor="#db2777" />

          <CadLabel x={250} y={182} text="38x140 (2x6) SILL PLATE (NBC 9.23.7)" fontSize={8.4} padX={4} color="#fde68a" borderColor="#d97706" />
        </g>
      )
    }
  }

  // 9D. A3.1 DETAIL 4 / 10 — SILL PLATE ANCHOR BOLTS (ZERO LINE OVERLAPS ON EMBED PILL)
  if (key.includes('anchor bolt')) {
    return {
      scaleLabel: 'DETAIL SCALE: MUDSILL ANCHOR BOLTS (NBC 9.23.6.1)',
      keys: [
        '① 1/2" (12.7mm) Anchor Bolt (NBC 9.23.6.1): Spaced at max 2.4m (8\'-0") O.C. with nut & oversized washer',
        '② Concrete Embedment: Minimum 100mm (4") solid embedment into foundation wall without voids',
        '③ Sill Piece Rules: Min 2 bolts per plate piece, placed <= 300mm (12") from plate ends'
      ],
      renderSvg: () => (
        <g>
          {/* Concrete Foundation Top + Pink Gasket + 2x6 Mudsill (Shifted Left x=26..146) */}
          <rect x="26" y="98" width="120" height="90" fill="#1e293b" stroke="#94a3b8" strokeWidth="2.5" />
          <line x1="26" y1="94" x2="146" y2="94" stroke="#ec4899" strokeWidth="5" />
          <rect x="38" y="66" width="96" height="25" fill="#451a03" stroke="#fbbf24" strokeWidth="2.2" />

          {/* Cyan 1/2" J-Bolt Anchor + Steel Washer & Hex Nut */}
          <path d="M 86 42 L 86 156 Q 86 170 104 170" fill="none" stroke="#22d3ee" strokeWidth="4.5" strokeLinecap="round" />
          <rect x="70" y="60" width="32" height="6" fill="#cbd5e1" />
          <rect x="77" y="50" width="18" height="10" fill="#38bdf8" stroke="#ffffff" strokeWidth="1" />

          {/* 4" (100mm) Embedment Depth Arrow Inside Concrete */}
          <line x1="54" y1="98" x2="54" y2="170" stroke="#fbbf24" strokeWidth="2" />
          <polygon points="54,98 50.5,105 57.5,105" fill="#fbbf24" />
          <polygon points="54,170 50.5,163 57.5,163" fill="#fbbf24" />
          <line x1="48" y1="170" x2="78" y2="170" stroke="#fbbf24" strokeWidth="1.4" strokeDasharray="2.5 2" />

          {/* Leader Lines to Clean Right-Hand Callout Column */}
          <line x1="86" y1="42" x2="149" y2="32" stroke="#22d3ee" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <line x1="134" y1="76" x2="149" y2="72" stroke="#34d399" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <line x1="86" y1="132" x2="149" y2="114" stroke="#fbbf24" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <circle cx="86" cy="132" r="3" fill="#fbbf24" />

          {/* Opaque #0a192f Pills Cleanly Right of J-Bolt Shaft */}
          <CalloutPin x={160} y={32} num={1} variant="cyan" />
          <CadLabel x={177} y={32} align="start" text="1/2&quot; BOLT @ MAX 2.4m (8') OC" fontSize={8.5} padX={4} color="#67e8f9" borderColor="#0284c7" />

          <CalloutPin x={160} y={72} num={3} variant="emerald" />
          <CadLabel x={177} y={72} align="start" text=">= 2 BOLTS PER PLATE PIECE" fontSize={8.6} padX={4} color="#6ee7b7" borderColor="#059669" />

          <CalloutPin x={160} y={114} num={2} variant="amber" />
          <CadLabel x={177} y={114} align="start" text="MIN 100mm (4&quot;) EMBED" fontSize={8.8} padX={4.5} color="#fde68a" borderColor="#d97706" />

          <CadLabel x={160} y={154} align="start" text="MAX 300mm (12&quot;) FROM PLATE ENDS" fontSize={8.5} padX={4} color="#ffffff" borderColor="#64748b" />
        </g>
      )
    }
  }

  // 9E. A3.1 DETAIL 5 / 10 — 6-MIL POLY VAPOUR BARRIER (ACOUSTIC SEALANT & POLLY-PAN BOX)
  if (key.includes('vapour barrier') || key.includes('vapor barrier') || key.includes('6-mil')) {
    return {
      scaleLabel: 'DETAIL SCALE: 6-MIL POLY & ACOUSTIC SEALANT (NBC 9.25.4)',
      keys: [
        '① Warm-in-Winter Placement (NBC 9.25.4): Installed on interior side (or max 1/3 of total R-value inward)',
        '② Acoustical Sealant & Solid Backing: All poly seams must overlap >= 100mm (4") over solid wood framing with non-hardening acoustic sealant',
        '③ Penetration & Outlet Boxes: Seal around all electrical boxes, pipes, and Rim Joists to maintain continuous air/vapour barrier'
      ],
      renderSvg: () => (
        <g>
          {/* Top-Down 2x6 Wall Cavity Section */}
          <rect x="24" y="66" width="312" height="56" fill="#0f243c" stroke="#475569" strokeWidth="1.5" />
          {/* R-24 Fiberglass Insulation Waves in Cavities */}
          <path d="M 32 74 Q 46 114 60 74 Q 74 114 86 74" fill="none" stroke="#ec4899" strokeWidth="2.5" />
          <path d="M 126 74 Q 146 114 166 74 Q 186 114 206 74" fill="none" stroke="#ec4899" strokeWidth="2.5" />

          {/* Left Solid 2x6 Backing Stud (Seam Overlap Location) + Right Stud */}
          <rect x="92" y="66" width="26" height="56" fill="#451a03" stroke="#fbbf24" strokeWidth="2.2" />
          <rect x="220" y="66" width="22" height="56" fill="#451a03" stroke="#fbbf24" strokeWidth="2.2" />

          {/* ③ Moulded Poly Vapour Box ("POLLY-PAN") Wrapping Exterior-Wall Electrical Box */}
          <path d="M 236 125 L 244 125 L 244 78 L 300 78 L 300 125 L 308 125" fill="#064e3b" stroke="#34d399" strokeWidth="2.8" />
          <rect x="252" y="86" width="40" height="36" fill="#1e293b" stroke="#cbd5e1" strokeWidth="2" />
          <text x="272" y="108" fill="#cbd5e1" fontSize="8.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
            BOX
          </text>

          {/* ① 6-Mil CGSB Polyethylene Lapped Over Solid Stud + ② Black Acoustical Sealant Bead */}
          <line x1="24" y1="125" x2="116" y2="125" stroke="#ef4444" strokeWidth="3.2" />
          <rect x="97" y="126" width="16" height="5" rx="2.5" fill="#020617" stroke="#fbbf24" strokeWidth="1.5" />
          <polyline points="94,132 122,132 126,126 242,126" fill="none" stroke="#38bdf8" strokeWidth="3" />
          <line x1="302" y1="126" x2="336" y2="126" stroke="#38bdf8" strokeWidth="3" />
          <circle cx="242" cy="125" r="3" fill="#34d399" />
          <circle cx="302" cy="125" r="3" fill="#34d399" />

          {/* Interior 1/2" Drywall Clamping Poly + Acoustic Sealant Over Stud */}
          <rect x="24" y="136" width="228" height="8" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1.2" />
          <rect x="292" y="136" width="44" height="8" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1.2" />

          {/* Non-Crossing Vertical Leaders */}
          <line x1="272" y1="38" x2="272" y2="78" stroke="#34d399" strokeWidth="1.7" strokeDasharray="3 2.5" />
          <circle cx="272" cy="78" r="2.8" fill="#34d399" />

          <line x1="108" y1="153" x2="108" y2="131" stroke="#fbbf24" strokeWidth="1.7" strokeDasharray="3 2.5" />
          <line x1="48" y1="179" x2="48" y2="125" stroke="#ef4444" strokeWidth="1.7" strokeDasharray="3 2.5" />
          <circle cx="48" cy="125" r="2.8" fill="#ef4444" />

          {/* Opaque #0a192f Callout Pins & Pills */}
          <CalloutPin x={82} y={28} num={3} variant="emerald" />
          <CadLabel x={99} y={28} align="start" text="MOULDED POLY VAPOUR BOX ('POLLY-PAN')" fontSize={8.4} padX={4} color="#6ee7b7" borderColor="#059669" />

          <CalloutPin x={88} y={162} num={2} variant="amber" />
          <CadLabel x={105} y={162} align="start" text="ACOUSTICAL SEALANT OVER SOLID STUD" fontSize={8.4} padX={4} color="#fde68a" borderColor="#d97706" />

          <CalloutPin x={26} y={188} num={1} variant="cyan" />
          <CadLabel x={43} y={188} align="start" text="6-MIL CGSB POLY (WARM SIDE - 1/3 RULE)" fontSize={8.4} padX={4} color="#fca5a5" borderColor="#ef4444" />
        </g>
      )
    }
  }

  // 9F. A3.1 DETAIL 6 / 10 — OSB NAILING PATTERN (4'x8' WALL SHEATHING ELEVATION)
  if (key.includes('osb nailing')) {
    return {
      scaleLabel: 'DETAIL SCALE: 4\'x8\' OSB SHEATHING SCHEDULE (NBC 9.23.3.5)',
      keys: [
        '① Perimeter Edge Nailing (NBC 9.23.3.5): 150mm (6") O.C. along all supported panel edges (min 10mm / 3/8" from edge)',
        '② Intermediate Field Studs: 300mm (12") O.C. along interior vertical studs',
        '③ Expansion Gap (1/8" / 3mm): Prevents OSB buckling when panels absorb jobsite moisture'
      ],
      renderSvg: () => (
        <g>
          {/* 4'x8' OSB Wall Panel + Adjacent Panel Separated by 1/8" (3mm) Expansion Gap */}
          <rect x="28" y="22" width="84" height="162" fill="#78350f" fillOpacity="0.45" stroke="#f59e0b" strokeWidth="2" />
          <rect x="117" y="22" width="24" height="162" fill="#78350f" fillOpacity="0.35" stroke="#f59e0b" strokeWidth="2" />

          {/* Intermediate Studs @ 16" O.C. Inside 4'x8' Panel */}
          <line x1="56" y1="22" x2="56" y2="184" stroke="#94a3b8" strokeWidth="1.4" strokeDasharray="4 3" />
          <line x1="84" y1="22" x2="84" y2="184" stroke="#94a3b8" strokeWidth="1.4" strokeDasharray="4 3" />

          {/* ① Tight Red Perimeter Edge Nails @ 150mm (6") O.C. */}
          {[27, 46, 65, 84, 103, 122, 141, 160, 179].map((yPos, idx) => (
            <g key={`edge-${idx}`}>
              <circle cx="33" cy={yPos} r="2.6" fill="#ef4444" />
              <circle cx="107" cy={yPos} r="2.6" fill="#ef4444" />
              <circle cx="122" cy={yPos} r="2.6" fill="#ef4444" />
            </g>
          ))}
          {[56, 84].map((xPos, idx) => (
            <g key={`plate-${idx}`}>
              <circle cx={xPos} cy="27" r="2.6" fill="#ef4444" />
              <circle cx={xPos} cy="179" r="2.6" fill="#ef4444" />
            </g>
          ))}

          {/* ② Intermediate Field Stud Cyan Nails @ 300mm (12") O.C. */}
          {[65, 103, 141].map((yPos, idx) => (
            <g key={`field-${idx}`}>
              <circle cx="56" cy={yPos} r="2.8" fill="#22d3ee" />
              <circle cx="84" cy={yPos} r="2.8" fill="#22d3ee" />
            </g>
          ))}

          {/* ③ 1/8" Expansion Joint Highlight */}
          <line x1="114.5" y1="142" x2="114.5" y2="162" stroke="#34d399" strokeWidth="2.5" />

          {/* Dashed Horizontal Leaders */}
          <line x1="107" y1="46" x2="151" y2="46" stroke="#ef4444" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <line x1="84" y1="103" x2="151" y2="103" stroke="#22d3ee" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <line x1="115" y1="152" x2="151" y2="152" stroke="#34d399" strokeWidth="1.6" strokeDasharray="3 2.5" />

          {/* Opaque #0a192f Callouts & Pins */}
          <CalloutPin x={162} y={46} num={1} variant="amber" />
          <CadLabel x={179} y={46} align="start" text="EDGES: 150mm (6&quot;) O.C." fontSize={8.8} padX={4.5} color="#fca5a5" borderColor="#ef4444" />

          <CalloutPin x={162} y={103} num={2} variant="cyan" />
          <CadLabel x={179} y={103} align="start" text="FIELD STUDS: 300mm (12&quot;) O.C." fontSize={8.5} padX={4} color="#67e8f9" borderColor="#0284c7" />

          <CalloutPin x={162} y={152} num={3} variant="emerald" />
          <CadLabel x={179} y={152} align="start" text="2-3mm (1/8&quot;) EXPANSION GAP" fontSize={8.6} padX={4} color="#6ee7b7" borderColor="#059669" />
          <CadLabel x={179} y={180} align="start" text="MIN 50mm (2&quot;) NAIL • 16&quot; STUDS" fontSize={8.4} padX={4} color="#fde68a" borderColor="#d97706" />
        </g>
      )
    }
  }

  // 9G. A3.1 DETAIL 7 / 10 — BASE FLASHING & WEEPHOLES (SHINGLE-LAPPED Z-FLASHING & GRADE)
  if (key.includes('weephole') || key.includes('base flashing')) {
    return {
      scaleLabel: 'DETAIL SCALE: BASE FLASHING & WEEPHOLES (NBC 9.27.2.4)',
      keys: [
        '① Shingle-Lapped Base Flashing: WRB membrane laps over top leg of Z-flashing (>= 150mm / 6" up wall) to shed water outward',
        '② Weepholes / Drainage Gap: Spaced max 800mm (32") O.C. at base of masonry veneer to drain cavity moisture',
        '③ Ground Clearance (NBC 9.27.2.4): Min 200mm (8") for wood/vulnerable siding (150mm / 6" for masonry) above grade'
      ],
      renderSvg: () => (
        <g>
          {/* Backup 2x6 Stud Wall + OSB + Foundation Brick Ledge */}
          <rect x="26" y="20" width="28" height="106" fill="#1e293b" stroke="#94a3b8" strokeWidth="1.8" />
          <rect x="54" y="20" width="10" height="106" fill="#78350f" stroke="#f59e0b" strokeWidth="1.5" />
          <rect x="26" y="126" width="100" height="64" fill="#1e293b" stroke="#cbd5e1" strokeWidth="2.2" />

          {/* ① Metal Through-Wall / Z-Flashing (>= 150mm / 6" Up Wall + >= 6° Sloped Drip Edge) */}
          <polyline points="66,38 66,124 128,126 136,133" fill="none" stroke="#fbbf24" strokeWidth="3" />

          {/* Shingle-Lapped Cyan WRB (Tyvek Lapped OVER Top Leg of Z-Flashing!) */}
          <polyline points="66,20 66,34 71,38 71,56" fill="none" stroke="#22d3ee" strokeWidth="3" strokeDasharray="5 2.5" />

          {/* Masonry Veneer Courses (Cut Away Above y=60 to Expose WRB Shingle Lap) */}
          <rect x="88" y="60" width="36" height="24" fill="#7f1d1d" stroke="#f87171" strokeWidth="1.6" />
          <rect x="88" y="90" width="36" height="26" fill="#7f1d1d" stroke="#f87171" strokeWidth="1.6" />

          {/* ② Base Mortar Course Weephole Drainage Outward */}
          <line x1="78" y1="120" x2="142" y2="120" stroke="#22d3ee" strokeWidth="2.6" strokeDasharray="4 2" />
          <polygon points="146,120 138,116 138,124" fill="#22d3ee" />

          {/* ③ Finished Grade Line + 150-200mm (6"-8") Ground Clearance Arrow */}
          <line x1="126" y1="174" x2="154" y2="174" stroke="#10b981" strokeWidth="3.5" />
          <line x1="140" y1="136" x2="140" y2="174" stroke="#34d399" strokeWidth="2" />
          <polygon points="140,136 136.5,143 143.5,143" fill="#34d399" />
          <polygon points="140,174 136.5,167 143.5,167" fill="#34d399" />

          {/* Leader Lines */}
          <line x1="71" y1="46" x2="151" y2="46" stroke="#fbbf24" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <circle cx="71" cy="46" r="2.8" fill="#fbbf24" />
          <line x1="146" y1="120" x2="151" y2="116" stroke="#22d3ee" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <line x1="140" y1="158" x2="151" y2="162" stroke="#34d399" strokeWidth="1.6" strokeDasharray="3 2.5" />

          {/* Opaque #0a192f Callouts & Pins */}
          <CalloutPin x={162} y={46} num={1} variant="amber" />
          <CadLabel x={179} y={46} align="start" text="Z-FLASHING >= 150mm UP + WRB LAP" fontSize={8.3} padX={4} color="#fde68a" borderColor="#d97706" />
          <CadLabel x={179} y={80} align="start" text="SLOPED DRIP EDGE (>= 6°)" fontSize={8.4} padX={4} color="#cbd5e1" borderColor="#475569" />

          <CalloutPin x={162} y={116} num={2} variant="cyan" />
          <CadLabel x={179} y={116} align="start" text="WEEPHOLES @ 800mm (32&quot;) O.C." fontSize={8.5} padX={4} color="#67e8f9" borderColor="#0284c7" />

          <CalloutPin x={162} y={162} num={3} variant="emerald" />
          <CadLabel x={179} y={162} align="start" text="MIN 150-200mm (6&quot;-8&quot;) TO GRADE" fontSize={8.4} padX={4} color="#6ee7b7" borderColor="#059669" />
        </g>
      )
    }
  }

  // 9H. A3.1 DETAIL 9 / 10 — HEIGHT DATUMS (QUARTERED ARCHITECTURAL SECTION DATUM TARGETS ⊕)
  if (key.includes('height datum')) {
    const renderDatumTarget = (cx, cy, accent) => (
      <g>
        <circle cx={cx} cy={cy} r="10" fill="#0a192f" stroke={accent} strokeWidth="2" />
        <path d={`M ${cx} ${cy} L ${cx} ${cy - 10} A 10 10 0 0 0 ${cx - 10} ${cy} Z`} fill={accent} />
        <path d={`M ${cx} ${cy} L ${cx} ${cy + 10} A 10 10 0 0 0 ${cx + 10} ${cy} Z`} fill={accent} />
        <line x1={cx - 13} y1={cy} x2={cx + 13} y2={cy} stroke={accent} strokeWidth="1.5" />
        <line x1={cx} y1={cy - 13} x2={cx} y2={cy + 13} stroke={accent} strokeWidth="1.5" />
      </g>
    )

    return {
      scaleLabel: 'DETAIL SCALE: SECTION ELEVATION DATUM POLE (A3.1)',
      keys: [
        '① Elevation Datum Target (⊕): Quartered circle + triangle marking exact vertical height on Section & Elevation drawings',
        '② Control Benchmark (100\'-0"): Main floor subfloor is traditionally set at 100\'-0" to prevent negative basement elevations',
        '③ T.O.F. vs. U.S.F. & T.O.W.: Always verify whether foundation depth is given to Top of Footing (T.O.F.), Underside (U.S.F.), or Top of Wall (T.O.W.)'
      ],
      renderSvg: () => (
        <g>
          {/* Left Building Section Reference Strip + Vertical Elevation Pole */}
          <rect x="24" y="36" width="22" height="8" fill="#451a03" stroke="#fbbf24" strokeWidth="1.5" />
          <rect x="28" y="44" width="14" height="56" fill="#1e293b" stroke="#64748b" strokeWidth="1.2" />
          <rect x="22" y="100" width="26" height="16" fill="#78350f" stroke="#f59e0b" strokeWidth="1.5" />
          <rect x="26" y="116" width="18" height="40" fill="#1e293b" stroke="#94a3b8" strokeWidth="1.5" />
          <rect x="18" y="156" width="34" height="24" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.8" />
          <line x1="58" y1="20" x2="58" y2="192" stroke="#475569" strokeWidth="2" />

          {/* Horizontal Datum Reference Lines Stopping Cleanly at Targets */}
          <line x1="46" y1="36" x2="67" y2="36" stroke="#22d3ee" strokeWidth="1.8" strokeDasharray="5 2.5" />
          <line x1="48" y1="100" x2="67" y2="100" stroke="#fbbf24" strokeWidth="1.8" strokeDasharray="5 2.5" />
          <line x1="52" y1="156" x2="67" y2="156" stroke="#34d399" strokeWidth="1.8" strokeDasharray="5 2.5" />
          <line x1="52" y1="180" x2="133" y2="180" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4 3" />

          {/* 3 Standard Architectural Quartered Datum Targets (⊕) Shifted 10px Left */}
          {renderDatumTarget(80, 36, '#22d3ee')}
          {renderDatumTarget(80, 100, '#fbbf24')}
          {renderDatumTarget(80, 156, '#34d399')}

          {/* ① Top of Double Plate Datum */}
          <CalloutPin x={122} y={36} num={1} variant="cyan" />
          <CadLabel x={139} y={36} align="start" text="T.O. PLATE = 108'-1 1/8&quot;" fontSize={8.8} padX={4.5} color="#67e8f9" borderColor="#0284c7" />
          <CadLabel x={139} y={60} align="start" text="8'-1 1/8&quot; FRAMED STUD WALL" fontSize={8.2} padX={4} color="#cbd5e1" borderColor="#475569" />

          {/* ② Main Floor Subfloor Control Benchmark */}
          <CalloutPin x={122} y={100} num={2} variant="amber" />
          <CadLabel x={139} y={100} align="start" text="T.O. SUBFLOOR = 100'-0&quot; (0.00m BM)" fontSize={8.3} padX={4} color="#fde68a" borderColor="#d97706" />

          {/* ③ Top of Footing (T.O.F.) vs Underside of Footing (U.S.F.) */}
          <CalloutPin x={122} y={156} num={3} variant="emerald" />
          <CadLabel x={139} y={156} align="start" text="T.O.F. = 91'-2&quot; (TOP OF FTG)" fontSize={8.5} padX={4} color="#6ee7b7" borderColor="#059669" />
          <CadLabel x={139} y={182} align="start" text="U.S.F. = 90'-6&quot; (UNDERSIDE)" fontSize={8.5} padX={4} color="#ffffff" borderColor="#64748b" />
        </g>
      )
    }
  }

  // 9I. A3.1 DETAIL 10 / 10 — RAIN SCREEN CLADDING (DRAINED CAPILLARY CAVITY & BUG SCREEN)
  if (key.includes('rain screen') || key.includes('rainscreen')) {
    return {
      scaleLabel: 'DETAIL SCALE: DRAINED RAINSCREEN CAVITY (NBC 9.27.2.2)',
      keys: [
        '① Capillary Break Cavity (NBC 9.27.2.2): Min 10mm (3/8") clear drained air space behind cladding in high moisture indices',
        '② Pressure Equalization & Drying: Vertical furring @ 400mm (16") O.C. allows bulk water to drain and air to convect upward',
        '③ Vented Starter & Insect Screen: Keeps rodents/insects out while maintaining open bottom drainage and top exhaust'
      ],
      renderSvg: () => (
        <g>
          {/* 2x6 Stud + OSB Sheathing + Cyan WRB */}
          <rect x="26" y="24" width="28" height="152" fill="#1e293b" stroke="#94a3b8" strokeWidth="1.8" />
          <rect x="54" y="24" width="10" height="152" fill="#78350f" stroke="#f59e0b" strokeWidth="1.5" />
          <line x1="68" y1="24" x2="68" y2="176" stroke="#22d3ee" strokeWidth="3" strokeDasharray="6 3" />

          {/* ① 19x64mm (1x3) Vertical Furring Strip Fastened Through WRB Into Wall Stud */}
          <rect x="72" y="42" width="26" height="50" fill="#451a03" stroke="#fbbf24" strokeWidth="2" />
          <line x1="38" y1="67" x2="98" y2="67" stroke="#fde68a" strokeWidth="2.2" />
          <line x1="98" y1="62" x2="98" y2="72" stroke="#fde68a" strokeWidth="2.5" />

          {/* ② Convective Upward Airflow Arrow & Downward Gravity Drainage Arrow */}
          <line x1="80" y1="164" x2="80" y2="106" stroke="#22d3ee" strokeWidth="2.2" strokeDasharray="4 2.5" />
          <polygon points="80,100 76.5,108 83.5,108" fill="#22d3ee" />
          <line x1="92" y1="102" x2="92" y2="160" stroke="#38bdf8" strokeWidth="2.2" />
          <polygon points="92,166 88.5,158 95.5,158" fill="#38bdf8" />

          {/* Exterior Cladding + ③ Top & Bottom Corrosion-Resistant Vented Bug Screen */}
          <path
            d="M 104 24 L 115 54 L 105 54 L 115 84 L 105 84 L 115 114 L 105 114 L 115 144 L 105 144 L 115 174"
            fill="none"
            stroke="#f8fafc"
            strokeWidth="2.8"
          />
          <line x1="70" y1="24" x2="106" y2="24" stroke="#34d399" strokeWidth="4" strokeDasharray="3 2" />
          <line x1="70" y1="176" x2="114" y2="176" stroke="#34d399" strokeWidth="4.5" strokeDasharray="3 2" />

          {/* Leader Lines */}
          <line x1="98" y1="56" x2="137" y2="56" stroke="#fbbf24" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <line x1="92" y1="122" x2="137" y2="122" stroke="#22d3ee" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <circle cx="92" cy="122" r="2.8" fill="#22d3ee" />
          <line x1="114" y1="176" x2="137" y2="176" stroke="#34d399" strokeWidth="1.6" strokeDasharray="3 2.5" />

          {/* Opaque #0a192f Callouts & Pins */}
          <CalloutPin x={148} y={56} num={1} variant="amber" />
          <CadLabel x={165} y={46} align="start" text="1x3 FURRING @ 16&quot; O.C. INTO STUD" fontSize={8.3} padX={4} color="#fde68a" borderColor="#d97706" />
          <CadLabel x={165} y={68} align="start" text=">= 10mm (3/8&quot;) CAPILLARY CAVITY" fontSize={8.3} padX={4} color="#ffffff" borderColor="#64748b" />

          <CalloutPin x={148} y={122} num={2} variant="cyan" />
          <CadLabel x={165} y={122} align="start" text="DRAINAGE & CONVECTIVE AIRFLOW" fontSize={8.5} padX={4} color="#67e8f9" borderColor="#0284c7" />

          <CalloutPin x={148} y={176} num={3} variant="emerald" />
          <CadLabel x={165} y={176} align="start" text="VENTED STARTER & INSECT SCREEN" fontSize={8.4} padX={4} color="#6ee7b7" borderColor="#059669" />
        </g>
      )
    }
  }

  // 10A. E1.0 DETAIL 1 / 8 — ELECTRICAL PANEL (200A PLAN SYMBOL & 3/4" PLYWOOD BACKING)
  if (key.includes('electrical panel')) {
    return {
      scaleLabel: 'DETAIL SCALE: 200A MAIN PANEL & BACKING (E1.0)',
      keys: [
        '① Main Panel Symbol (200A): Shaded rectangle on E1.0 marking main service distribution board',
        '② Carpenter Backing: Frame 2x6 stud cavity (16" OC) + 3/4" plywood backer board for panel & sub-feeds',
        '③ Prohibited Locations (CEC): Never locate panels inside clothes closets, bathrooms, or over stairs'
      ],
      renderSvg: () => (
        <g>
          {/* Left Pane: E1.0 Top-Down Plan Symbol in 2x6 Wall */}
          <rect x="24" y="76" width="136" height="28" fill="#1e293b" stroke="#94a3b8" strokeWidth="2" />
          <rect x="54" y="78" width="76" height="24" fill="#064e3b" stroke="#10b981" strokeWidth="2.5" />
          <line x1="62" y1="102" x2="78" y2="78" stroke="#34d399" strokeWidth="2" />
          <line x1="80" y1="102" x2="96" y2="78" stroke="#34d399" strokeWidth="2" />
          <line x1="98" y1="102" x2="114" y2="78" stroke="#34d399" strokeWidth="2" />
          <CadLabel x={92} y={128} text="200A MAIN PANEL" fontSize={8.8} padX={4.5} color="#6ee7b7" borderColor="#059669" />

          {/* Center Divider */}
          <line x1="172" y1="42" x2="172" y2="156" stroke="#334155" strokeWidth="1.5" strokeDasharray="4 4" />

          {/* Right Pane: 2x6 Stud Cavity + 19mm (3/4") Plywood Backing + Knockout Raceways */}
          <rect x="200" y="48" width="12" height="104" fill="#451a03" stroke="#fbbf24" strokeWidth="1.8" />
          <rect x="316" y="48" width="12" height="104" fill="#451a03" stroke="#fbbf24" strokeWidth="1.8" />
          <rect x="212" y="58" width="104" height="84" fill="#78350f" fillOpacity="0.55" stroke="#f59e0b" strokeWidth="2" />

          {/* Top & Bottom Cable Knockout Raceways */}
          <line x1="256" y1="44" x2="256" y2="68" stroke="#22d3ee" strokeWidth="2.5" />
          <line x1="272" y1="44" x2="272" y2="68" stroke="#fbbf24" strokeWidth="2.5" />
          <line x1="256" y1="132" x2="256" y2="154" stroke="#22d3ee" strokeWidth="2.5" />
          <line x1="272" y1="132" x2="272" y2="154" stroke="#fbbf24" strokeWidth="2.5" />

          {/* Panel Tub on Plywood Backer */}
          <rect x="236" y="68" width="56" height="64" rx="2" fill="#0f243c" stroke="#38bdf8" strokeWidth="2" />
          <text x="264" y="104" fill="#67e8f9" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
            200A
          </text>

          {/* Leader Lines */}
          <line x1="92" y1="35" x2="92" y2="78" stroke="#34d399" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <circle cx="92" cy="78" r="2.8" fill="#34d399" />
          <line x1="232" y1="35" x2="232" y2="58" stroke="#22d3ee" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <circle cx="232" cy="58" r="2.8" fill="#22d3ee" />

          {/* Opaque #0a192f Callouts & Pins */}
          <CalloutPin x={26} y={26} num={1} variant="emerald" />
          <CadLabel x={43} y={26} align="start" text="200A PANEL PLAN SYMBOL" fontSize={8.4} padX={4} color="#6ee7b7" borderColor="#059669" />

          <CalloutPin x={188} y={26} num={2} variant="cyan" />
          <CadLabel x={205} y={26} align="start" text="3/4&quot; PLYWOOD BACKING" fontSize={8.4} padX={4} color="#67e8f9" borderColor="#0284c7" />

          <CalloutPin x={26} y={182} num={3} variant="amber" />
          <CadLabel x={43} y={182} align="start" text="NEVER IN CLOSETS, BATHS OR STAIRS (CEC)" fontSize={8.4} padX={4} color="#fca5a5" borderColor="#ef4444" />
        </g>
      )
    }
  }

  // 10B. E1.0 DETAIL 2 / 8 — SWITCH & WIRING ($, $3, $D & CURVED SWITCHED LEG)
  if (key.includes('switch')) {
    return {
      scaleLabel: 'DETAIL SCALE: SWITCH DESIGNATORS & CONTROL LOOPS (E1.0)',
      keys: [
        '① Switch Designators ($, $3, $4): $ = 1 location; $3 = 3-way (2 locations, e.g., top/bottom of stairs); $4 = 3+ locations',
        '② Curved Dashed Line: Indicates which light fixture(s) a switch controls—not the physical wire path',
        '③ Rough-In Box Framing: Mount switch boxes on the latch/strike side of doors (~48" / 1200mm to center)'
      ],
      renderSvg: () => (
        <g>
          {/* Room Plan w/ Two Entrances (Door 1 Top-Left, Door 2 Bottom-Right) */}
          <polyline points="54,48 24,48 24,152 148,152" fill="none" stroke="#94a3b8" strokeWidth="2.5" />
          <polyline points="84,48 210,48 210,152 178,152" fill="none" stroke="#94a3b8" strokeWidth="2.5" />

          {/* Door 1 Swing + Latch-Side $3 Switch */}
          <line x1="54" y1="48" x2="54" y2="76" stroke="#fbbf24" strokeWidth="2" />
          <path d="M 54 76 A 28 28 0 0 0 82 48" fill="none" stroke="#64748b" strokeWidth="1.4" strokeDasharray="3 2" />

          {/* Door 2 Swing + Latch-Side $3 Switch */}
          <line x1="178" y1="152" x2="178" y2="124" stroke="#fbbf24" strokeWidth="2" />
          <path d="M 178 124 A 28 28 0 0 0 150 152" fill="none" stroke="#64748b" strokeWidth="1.4" strokeDasharray="3 2" />

          {/* ② Curved Cyan Dashed Control Loops Connecting Both $3 Switches to Luminaire */}
          <path d="M 109 64 Q 146 68 127 92" fill="none" stroke="#38bdf8" strokeWidth="2.3" strokeDasharray="5 3" />
          <path d="M 104 106 Q 84 132 123 138" fill="none" stroke="#38bdf8" strokeWidth="2.3" strokeDasharray="5 3" />

          {/* ① $3 Switch Symbols at Door 1 & Door 2 */}
          <circle cx="98" cy="62" r="11" fill="#0a192f" stroke="#22d3ee" strokeWidth="2" />
          <text x="98" y="66" fill="#67e8f9" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
            $3
          </text>
          <circle cx="134" cy="138" r="11" fill="#0a192f" stroke="#22d3ee" strokeWidth="2" />
          <text x="134" y="142" fill="#67e8f9" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
            $3
          </text>

          {/* Ceiling Luminaire Symbol (⊗) */}
          <circle cx="116" cy="100" r="13" fill="#0a192f" stroke="#fbbf24" strokeWidth="2.2" />
          <line x1="107" y1="91" x2="125" y2="109" stroke="#fbbf24" strokeWidth="2" />
          <line x1="125" y1="91" x2="107" y2="109" stroke="#fbbf24" strokeWidth="2" />

          {/* Right Inset: Switch Symbol Key ($, $3, $D) */}
          <rect x="222" y="48" width="124" height="104" rx="4" fill="#0f243c" stroke="#475569" strokeWidth="1.8" />
          <text x="284" y="65" fill="#67e8f9" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
            SWITCH KEY
          </text>
          <line x1="230" y1="72" x2="338" y2="72" stroke="#334155" strokeWidth="1.2" />
          <text x="234" y="90" fill="#f8fafc" fontSize="9" fontFamily="monospace" fontWeight="bold">
            $  = 1-POLE
          </text>
          <text x="234" y="113" fill="#67e8f9" fontSize="9" fontFamily="monospace" fontWeight="bold">
            $3 = 3-WAY
          </text>
          <text x="234" y="136" fill="#fde68a" fontSize="9" fontFamily="monospace" fontWeight="bold">
            $D = DIMMER
          </text>

          {/* Leader Lines */}
          <line x1="98" y1="34" x2="98" y2="51" stroke="#22d3ee" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <line x1="190" y1="36" x2="136" y2="72" stroke="#fbbf24" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <circle cx="136" cy="72" r="2.8" fill="#fbbf24" />

          {/* Opaque #0a192f Callouts & Pins */}
          <CalloutPin x={26} y={25} num={1} variant="cyan" />
          <CadLabel x={43} y={25} align="start" text="$3 = 3-WAY (2 LOCATIONS)" fontSize={8.4} padX={4} color="#67e8f9" borderColor="#0284c7" />

          <CalloutPin x={190} y={25} num={2} variant="amber" />
          <CadLabel x={207} y={25} align="start" text="DASHED = SWITCHED LEG" fontSize={8.4} padX={4} color="#fde68a" borderColor="#d97706" />

          <CalloutPin x={26} y={182} num={3} variant="emerald" />
          <CadLabel x={43} y={182} align="start" text="ROUGH-IN BOX: 1200mm (48&quot;) TO CENTER" fontSize={8.4} padX={4} color="#6ee7b7" borderColor="#059669" />
        </g>
      )
    }
  }

  // 10C. E1.0 DETAIL 3 / 8 — GFCI OUTLET (WET-ZONE 1.5m RULE & EXTERIOR WP-GFCI)
  if (key.includes('gfci')) {
    return {
      scaleLabel: 'DETAIL SCALE: GFCI WET-AREA & WP RECEPTACLES (CEC)',
      keys: [
        '① GFCI Plan Symbol: Circle with two parallel prongs (or GFI tag) indicating Class A ground-fault protection',
        '② 1.5m (5\'-0") Wet-Zone Rule (CEC): Required for all receptacles within 1.5m of sinks, tubs, or shower stalls',
        '③ Exterior & Countertop Split/20A: Kitchen counter & outdoor outlets require 20A T-slot GFCI / weatherproof covers'
      ],
      renderSvg: () => (
        <g>
          {/* Vanity / Exterior Wall + Countertop & Sink Basin */}
          <rect x="24" y="74" width="312" height="16" fill="#1e293b" stroke="#94a3b8" strokeWidth="2" />
          <rect x="28" y="90" width="196" height="54" fill="#0f243c" stroke="#475569" strokeWidth="1.6" />
          <rect x="42" y="97" width="66" height="38" rx="8" fill="#0a192f" stroke="#38bdf8" strokeWidth="2" />
          <circle cx="75" cy="116" r="3.5" fill="none" stroke="#67e8f9" strokeWidth="1.5" />
          <line x1="75" y1="90" x2="75" y2="103" stroke="#cbd5e1" strokeWidth="2.5" />
          <text x="75" y="131" fill="#7dd3fc" fontSize="8.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
            SINK
          </text>

          {/* ① GFCI Duplex Receptacle Symbol + GFI Tag */}
          <circle cx="178" cy="114" r="14" fill="#0a192f" stroke="#fbbf24" strokeWidth="2.4" />
          <line x1="173" y1="90" x2="173" y2="127" stroke="#f8fafc" strokeWidth="2.2" />
          <line x1="183" y1="90" x2="183" y2="127" stroke="#f8fafc" strokeWidth="2.2" />
          <text x="205" y="118" fill="#fde68a" fontSize="9.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
            GFI
          </text>

          {/* ② <= 1.5m (5'-0") Dimension Arrow to Sink Basin Edge */}
          <line x1="108" y1="114" x2="162" y2="114" stroke="#22d3ee" strokeWidth="2.2" />
          <polygon points="108,114 115,110.5 115,117.5" fill="#22d3ee" />
          <polygon points="162,114 155,110.5 155,117.5" fill="#22d3ee" />

          {/* ③ Exterior WP-GFCI w/ In-Use Bubble Cover Hood Above Wall */}
          <path d="M 252 74 C 252 38 300 38 300 74" fill="#064e3b" fillOpacity="0.35" stroke="#34d399" strokeWidth="2" strokeDasharray="4 2.5" />
          <circle cx="276" cy="56" r="11" fill="#0a192f" stroke="#34d399" strokeWidth="2" />
          <line x1="272" y1="45" x2="272" y2="74" stroke="#f8fafc" strokeWidth="2" />
          <line x1="280" y1="45" x2="280" y2="74" stroke="#f8fafc" strokeWidth="2" />
          <text x="316" y="60" fill="#6ee7b7" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
            WP-GFI
          </text>

          {/* Non-Crossing Vertical Leaders */}
          <line x1="178" y1="35" x2="178" y2="100" stroke="#fbbf24" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <line x1="135" y1="151" x2="135" y2="114" stroke="#22d3ee" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <circle cx="135" cy="114" r="2.8" fill="#22d3ee" />
          <line x1="276" y1="177" x2="276" y2="74" stroke="#34d399" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <circle cx="276" cy="74" r="2.8" fill="#34d399" />

          {/* Opaque #0a192f Callouts & Pins */}
          <CalloutPin x={26} y={26} num={1} variant="amber" />
          <CadLabel x={43} y={26} align="start" text="GFCI DUPLEX SYMBOL (GFI TAG)" fontSize={8.5} padX={4} color="#fde68a" borderColor="#d97706" />

          <CalloutPin x={26} y={160} num={2} variant="cyan" />
          <CadLabel x={43} y={160} align="start" text="MANDATORY <= 1.5m (5'-0&quot;) TO SINK/TUB" fontSize={8.4} padX={4} color="#67e8f9" borderColor="#0284c7" />

          <CalloutPin x={65} y={186} num={3} variant="emerald" />
          <CadLabel x={82} y={186} align="start" text="EXTERIOR WP-GFCI + IN-USE BUBBLE COVER" fontSize={8.4} padX={4} color="#6ee7b7" borderColor="#059669" />
        </g>
      )
    }
  }

  // 10D. E1.0 DETAIL 4 / 8 — STUD DRILLING LIMITS (14/2 NM-B CABLE BORE & 16-GA NAIL PLATE)
  if (key.includes('stud drilling')) {
    return {
      scaleLabel: 'DETAIL SCALE: ELECTRICAL CABLE BORING & NAIL GUARD (CEC)',
      keys: [
        '① Structural Bore Limit (NBC 9.23.5.3): Bored holes in studs must never exceed 1/3 of the stud depth unless reinforced',
        '② 32mm (1-1/4") Setback Rule (CEC): Keep cable holes at least 32mm (1-1/4") back from the nearest framing edge',
        '③ Steel Nail Protection Plate: Install 1.6mm (16-ga) steel plate whenever cable is < 32mm (1-1/4") from stud face'
      ],
      renderSvg: () => (
        <g>
          {/* 2x4 / 2x6 Wall Stud Cross-Section + 32mm (1-1/4") Setback Lines */}
          <rect x="44" y="58" width="152" height="88" fill="#1e293b" stroke="#f59e0b" strokeWidth="2.8" />
          <line x1="44" y1="82" x2="196" y2="82" stroke="#64748b" strokeWidth="1.2" strokeDasharray="5 3" />
          <line x1="44" y1="122" x2="196" y2="122" stroke="#64748b" strokeWidth="1.2" strokeDasharray="5 3" />

          {/* ① Centered Bored Hole (<= 1/3 Stud Depth) + Yellow 14/2 NM-B Romex Cable */}
          <circle cx="120" cy="102" r="14" fill="#0a192f" stroke="#22d3ee" strokeWidth="2.8" />
          <rect x="20" y="98" width="198" height="8" rx="3" fill="#eab308" stroke="#fef08a" strokeWidth="1.2" />
          <line x1="218" y1="99" x2="228" y2="97" stroke="#f8fafc" strokeWidth="1.8" />
          <line x1="218" y1="102" x2="229" y2="102" stroke="#d97706" strokeWidth="1.8" />
          <line x1="218" y1="105" x2="228" y2="107" stroke="#ef4444" strokeWidth="1.8" />
          <CadLabel x={236} y={102} align="start" text="14/2 NM-B CABLE" fontSize={8.5} padX={4} color="#fde68a" borderColor="#d97706" />

          {/* ② Min 32mm (1-1/4") Edge Clearance Dimension Arrow */}
          <line x1="72" y1="116" x2="106" y2="116" stroke="#34d399" strokeWidth="1.4" strokeDasharray="2.5 2" />
          <line x1="76" y1="116" x2="76" y2="146" stroke="#34d399" strokeWidth="2.2" />
          <polygon points="76,116 72.5,123 79.5,123" fill="#34d399" />
          <polygon points="76,146 72.5,139 79.5,139" fill="#34d399" />

          {/* ③ Red 1.6mm (16-GA) Steel Nail Guard Plate on Stud Face */}
          <rect x="92" y="144" width="64" height="9" rx="1.5" fill="#ef4444" stroke="#fca5a5" strokeWidth="1.6" />
          <line x1="98" y1="139" x2="98" y2="144" stroke="#fca5a5" strokeWidth="2" />
          <line x1="150" y1="139" x2="150" y2="144" stroke="#fca5a5" strokeWidth="2" />

          {/* Non-Crossing Leader Lines */}
          <line x1="120" y1="37" x2="120" y2="88" stroke="#22d3ee" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <line x1="76" y1="155" x2="76" y2="146" stroke="#34d399" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <polyline points="232,180 232,148 156,148" fill="none" stroke="#ef4444" strokeWidth="1.6" strokeDasharray="3 2.5" />

          {/* Opaque #0a192f Callouts & Pins */}
          <CalloutPin x={26} y={28} num={1} variant="cyan" />
          <CadLabel x={43} y={28} align="start" text="MAX HOLE <= 1/3 STUD DEPTH (NBC 9.23.5.3)" fontSize={8.3} padX={4} color="#67e8f9" borderColor="#0284c7" />

          <CalloutPin x={26} y={164} num={2} variant="emerald" />
          <CadLabel x={43} y={164} align="start" text="MIN 32mm (1-1/4&quot;) FROM STUD FACE" fontSize={8.4} padX={4} color="#6ee7b7" borderColor="#059669" />

          <CalloutPin x={68} y={189} num={3} variant="amber" />
          <CadLabel x={85} y={189} align="start" text="1.6mm (16-GA) STEEL NAIL PLATE IF < 32mm" fontSize={8.3} padX={4} color="#fca5a5" borderColor="#ef4444" />
        </g>
      )
    }
  }

  // 10E. E1.0 DETAIL 5 / 8 — RECEPTACLE SPACING (CEC 1.8m / 3.6m / 900mm WALL SPACING)
  if (key.includes('receptacle spacing')) {
    return {
      scaleLabel: 'DETAIL SCALE: CEC 1.8m / 3.6m WALL SPACING RULE (E1.0)',
      keys: [
        '① 1.8m (6\'-0") Appliance Cord Rule: No point along the floor line of any usable wall may be > 1.8m (6\') from an outlet',
        '② 3.6m (12\'-0") Max Run: Maximum center-to-center spacing along unbroken walls is 3.6m (12\'-0")',
        '③ 900mm (3\'-0") Short Wall Rule: Any isolated wall space 900mm (3\') or wider requires its own receptacle'
      ],
      renderSvg: () => (
        <g>
          {/* Left Short Wall (>= 900mm / 3') + Doorway Break + Continuous Habitable Wall */}
          <rect x="22" y="92" width="50" height="14" fill="#1e293b" stroke="#cbd5e1" strokeWidth="2" />
          <line x1="72" y1="92" x2="72" y2="62" stroke="#fbbf24" strokeWidth="2" />
          <path d="M 72 62 A 38 38 0 0 1 110 92" fill="none" stroke="#64748b" strokeWidth="1.4" strokeDasharray="3 2" />
          <rect x="110" y="92" width="228" height="14" fill="#1e293b" stroke="#cbd5e1" strokeWidth="2" />

          {/* Duplex Receptacle Symbols Along Baseboard */}
          {[
            [47, '#34d399'],
            [166, '#22d3ee'],
            [292, '#fbbf24']
          ].map(([cx, strokeColor], idx) => (
            <g key={idx}>
              <circle cx={cx} cy="122" r="9" fill="#0a192f" stroke={strokeColor} strokeWidth="2" />
              <line x1={cx - 3} y1="106" x2={cx - 3} y2="130" stroke="#f8fafc" strokeWidth="1.8" />
              <line x1={cx + 3} y1="106" x2={cx + 3} y2="130" stroke="#f8fafc" strokeWidth="1.8" />
            </g>
          ))}

          {/* ① <= 1.8m (6'-0") Dimension Bracket from Doorway Break */}
          <line x1="110" y1="68" x2="110" y2="88" stroke="#22d3ee" strokeWidth="1.4" />
          <line x1="166" y1="68" x2="166" y2="88" stroke="#22d3ee" strokeWidth="1.4" />
          <line x1="110" y1="74" x2="166" y2="74" stroke="#22d3ee" strokeWidth="2.2" />
          <polygon points="110,74 117,70.5 117,77.5" fill="#22d3ee" />
          <polygon points="166,74 159,70.5 159,77.5" fill="#22d3ee" />

          {/* ② <= 3.6m (12'-0") Dimension Bracket Between Receptacles */}
          <line x1="292" y1="68" x2="292" y2="88" stroke="#fbbf24" strokeWidth="1.4" />
          <line x1="166" y1="74" x2="292" y2="74" stroke="#fbbf24" strokeWidth="2.2" />
          <polygon points="166,74 173,70.5 173,77.5" fill="#fbbf24" />
          <polygon points="292,74 285,70.5 285,77.5" fill="#fbbf24" />

          {/* ③ >= 900mm (3'-0") Short-Wall Bracket */}
          <line x1="22" y1="136" x2="22" y2="148" stroke="#34d399" strokeWidth="1.4" />
          <line x1="72" y1="136" x2="72" y2="148" stroke="#34d399" strokeWidth="1.4" />
          <line x1="22" y1="142" x2="72" y2="142" stroke="#34d399" strokeWidth="2.2" />

          {/* Non-Crossing Vertical Leaders */}
          <line x1="138" y1="34" x2="138" y2="74" stroke="#22d3ee" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <circle cx="138" cy="74" r="2.8" fill="#22d3ee" />
          <line x1="246" y1="58" x2="246" y2="74" stroke="#fbbf24" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <circle cx="246" cy="74" r="2.8" fill="#fbbf24" />
          <line x1="47" y1="169" x2="47" y2="142" stroke="#34d399" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <circle cx="47" cy="142" r="2.8" fill="#34d399" />

          {/* Opaque #0a192f Callouts & Pins */}
          <CalloutPin x={26} y={25} num={1} variant="cyan" />
          <CadLabel x={43} y={25} align="start" text="MAX 1.8m (6'-0&quot;) FROM DOOR / BREAK" fontSize={8.4} padX={4} color="#67e8f9" borderColor="#0284c7" />

          <CalloutPin x={158} y={49} num={2} variant="amber" />
          <CadLabel x={175} y={49} align="start" text="MAX 3.6m (12'-0&quot;) BETWEEN OUTLETS" fontSize={8.3} padX={4} color="#fde68a" borderColor="#d97706" />

          <CalloutPin x={26} y={178} num={3} variant="emerald" />
          <CadLabel x={43} y={178} align="start" text="INCLUDE ANY WALL >= 900mm (3'-0&quot;) WIDE" fontSize={8.4} padX={4} color="#6ee7b7" borderColor="#059669" />
        </g>
      )
    }
  }

  // 10F. E1.0 DETAIL 6 / 8 — 240V RECEPTACLES (RANGE 14-50R & DRYER 14-30R)
  if (key.includes('240v')) {
    return {
      scaleLabel: 'DETAIL SCALE: 240V RANGE (50A) & DRYER (30A) ROUGH-IN',
      keys: [
        '① 240V Plan Symbol: Circle with three lines (or labeled 240V / RANGE / DRYER / EV) indicating a dedicated 2-pole circuit',
        '② Range Receptacle (50A): NEMA 14-50R fed by 6/3 cable; positioned inside bottom rear recess of stove opening',
        '③ Dryer Receptacle (30A): NEMA 14-30R fed by 10/3 cable; requires deep 4-11/16" box + stud backing'
      ],
      renderSvg: () => (
        <g>
          {/* Left Pane: 240V 3-Line Special-Purpose Plan Symbol */}
          <rect x="24" y="64" width="96" height="14" fill="#1e293b" stroke="#94a3b8" strokeWidth="2" />
          <circle cx="72" cy="108" r="20" fill="#0a192f" stroke="#22d3ee" strokeWidth="2.5" />
          <line x1="64" y1="78" x2="64" y2="126" stroke="#f8fafc" strokeWidth="2.2" />
          <line x1="72" y1="78" x2="72" y2="128" stroke="#f8fafc" strokeWidth="2.2" />
          <line x1="80" y1="78" x2="80" y2="126" stroke="#f8fafc" strokeWidth="2.2" />
          <CadLabel x={72} y={148} text="240V (R/D)" fontSize={8.5} padX={4} color="#67e8f9" borderColor="#0284c7" />

          {/* ② Top-Right Card: Electric Range 50A (NEMA 14-50R • 6/3 AWG) */}
          <rect x="144" y="46" width="202" height="66" rx="4" fill="#0f243c" stroke="#f59e0b" strokeWidth="1.8" />
          <circle cx="169" cy="79" r="15" fill="#0a192f" stroke="#fbbf24" strokeWidth="1.8" />
          <circle cx="169" cy="69" r="2" fill="#34d399" />
          <line x1="162" y1="74" x2="162" y2="83" stroke="#f8fafc" strokeWidth="2" />
          <line x1="176" y1="74" x2="176" y2="83" stroke="#f8fafc" strokeWidth="2" />
          <line x1="169" y1="84" x2="169" y2="90" stroke="#67e8f9" strokeWidth="2" />
          <CadLabel x={192} y={66} align="start" text="50A NEMA 14-50R • 6/3 AWG" fontSize={8.2} padX={4} color="#fde68a" borderColor="#d97706" />
          <CadLabel x={192} y={92} align="start" text="LOW REAR STOVE RECESS BOX" fontSize={8.2} padX={4} color="#cbd5e1" borderColor="#475569" />

          {/* ③ Bottom-Right Card: Clothes Dryer 30A (NEMA 14-30R • 10/3 AWG) */}
          <rect x="144" y="124" width="202" height="68" rx="4" fill="#0f243c" stroke="#10b981" strokeWidth="1.8" />
          <rect x="154" y="143" width="30" height="30" rx="2" fill="#0a192f" stroke="#34d399" strokeWidth="2" />
          <circle cx="169" cy="150" r="2" fill="#34d399" />
          <line x1="162" y1="154" x2="162" y2="162" stroke="#f8fafc" strokeWidth="2" />
          <line x1="176" y1="154" x2="176" y2="162" stroke="#f8fafc" strokeWidth="2" />
          <polyline points="169,163 169,168 174,168" fill="none" stroke="#67e8f9" strokeWidth="1.8" />
          <CadLabel x={192} y={145} align="start" text="30A NEMA 14-30R • 10/3 AWG" fontSize={8.2} padX={4} color="#6ee7b7" borderColor="#059669" />
          <CadLabel x={192} y={171} align="start" text="4-11/16&quot; DEEP BOX + BACKING" fontSize={8.1} padX={4} color="#ffffff" borderColor="#475569" />

          {/* Leader Lines */}
          <line x1="72" y1="37" x2="72" y2="64" stroke="#22d3ee" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <line x1="244" y1="37" x2="244" y2="46" stroke="#fbbf24" strokeWidth="1.6" strokeDasharray="2.5 2" />
          <line x1="129" y1="178" x2="144" y2="164" stroke="#34d399" strokeWidth="1.6" strokeDasharray="3 2.5" />

          {/* Opaque #0a192f Callouts & Pins */}
          <CalloutPin x={26} y={28} num={1} variant="cyan" />
          <CadLabel x={43} y={28} align="start" text="240V 3-LINE OUTLET" fontSize={8.4} padX={4} color="#67e8f9" borderColor="#0284c7" />

          <CalloutPin x={162} y={28} num={2} variant="amber" />
          <CadLabel x={179} y={28} align="start" text="RANGE: 50A (14-50R • 6/3)" fontSize={8.4} padX={4} color="#fde68a" borderColor="#d97706" />

          <CalloutPin x={118} y={178} num={3} variant="emerald" />
        </g>
      )
    }
  }

  // 10G. E1.0 DETAIL 7 / 8 — CEC WORKING CLEARANCE (1.0m DEPTH, 750mm WIDTH & 2.0m HEADROOM)
  if (key.includes('working clearance') || key.includes('cec')) {
    return {
      scaleLabel: 'DETAIL SCALE: CEC 2-308 PANEL WORKING SPACE (E1.0)',
      keys: [
        '① 1.0m (39") Working Depth (CEC 2-308): Must remain permanently clear of storage, framing projections, or appliances',
        '② Width & Door Swing: Min 750mm (30") wide working footprint; never block panel with a partition or door',
        '③ Height Limits: Min 2.0m (6\'-6") headroom; highest breaker handle must not exceed 1.7m (5\'-7") above finished floor'
      ],
      renderSvg: () => (
        <g>
          {/* Left: Top-Down Plan of 200A Panel + 90° Door Swing + Green Dashed Clear Floor Zone */}
          <rect x="24" y="44" width="128" height="12" fill="#1e293b" stroke="#94a3b8" strokeWidth="1.8" />
          <rect x="64" y="56" width="48" height="10" fill="#064e3b" stroke="#10b981" strokeWidth="2.2" />
          <line x1="64" y1="66" x2="64" y2="92" stroke="#fbbf24" strokeWidth="2" />
          <path d="M 64 92 A 26 26 0 0 0 90 66" fill="none" stroke="#fde68a" strokeWidth="1.5" strokeDasharray="3 2" />

          <rect x="44" y="66" width="88" height="76" fill="#064e3b" fillOpacity="0.22" stroke="#34d399" strokeWidth="2" strokeDasharray="6 3" />

          {/* ① 1.0m (39") Clear Depth Arrow */}
          <line x1="142" y1="66" x2="142" y2="142" stroke="#34d399" strokeWidth="2.2" />
          <polygon points="142,66 138.5,73 145.5,73" fill="#34d399" />
          <polygon points="142,142 138.5,135 145.5,135" fill="#34d399" />

          {/* ② 750mm (30") Clear Width Arrow */}
          <line x1="44" y1="154" x2="132" y2="154" stroke="#22d3ee" strokeWidth="2.2" />
          <polygon points="44,154 51,150.5 51,157.5" fill="#22d3ee" />
          <polygon points="132,154 125,150.5 125,157.5" fill="#22d3ee" />

          {/* Right: Side Elevation Headroom (>= 2.0m) & Max Top Breaker (<= 1.7m) */}
          <line x1="168" y1="58" x2="202" y2="58" stroke="#94a3b8" strokeWidth="2" />
          <line x1="168" y1="148" x2="202" y2="148" stroke="#94a3b8" strokeWidth="2" />
          <line x1="174" y1="58" x2="174" y2="148" stroke="#cbd5e1" strokeWidth="2" />
          <rect x="174" y="78" width="8" height="40" fill="#064e3b" stroke="#10b981" strokeWidth="1.8" />
          <line x1="182" y1="84" x2="190" y2="84" stroke="#ef4444" strokeWidth="2.2" />

          <line x1="196" y1="58" x2="196" y2="148" stroke="#fbbf24" strokeWidth="2" />
          <polygon points="196,58 192.5,65 199.5,65" fill="#fbbf24" />
          <polygon points="196,148 192.5,141 199.5,141" fill="#fbbf24" />

          {/* Leader Lines */}
          <line x1="142" y1="35" x2="142" y2="66" stroke="#34d399" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <line x1="196" y1="88" x2="209" y2="88" stroke="#fbbf24" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <line x1="88" y1="173" x2="88" y2="154" stroke="#22d3ee" strokeWidth="1.6" strokeDasharray="3 2.5" />

          {/* Opaque #0a192f Callouts & Pins */}
          <CalloutPin x={26} y={26} num={1} variant="emerald" />
          <CadLabel x={43} y={26} align="start" text="MIN 1.0m (39&quot;) DEEP CLEAR SPACE" fontSize={8.4} padX={4} color="#6ee7b7" borderColor="#059669" />

          <CalloutPin x={220} y={88} num={3} variant="amber" />
          <CadLabel x={237} y={76} align="start" text="HEADROOM >= 2.0m" fontSize={8.4} padX={4} color="#fde68a" borderColor="#d97706" />
          <CadLabel x={237} y={102} align="start" text="BREAKER <= 1.7m" fontSize={8.4} padX={4} color="#fca5a5" borderColor="#ef4444" />

          <CalloutPin x={26} y={182} num={2} variant="cyan" />
          <CadLabel x={43} y={182} align="start" text="MIN 750mm (30&quot;) WIDE + 90° DOOR SWING" fontSize={8.4} padX={4} color="#67e8f9" borderColor="#0284c7" />
        </g>
      )
    }
  }

  // 10H. E1.0 DETAIL 8 / 8 — INTERCONNECTED SMOKE ALARMS (SD/CO LOOP & DEAD AIR SPACE)
  if (key.includes('smoke') || key.includes('electrical') || key.includes('receptacle')) {
    return {
      scaleLabel: 'DETAIL SCALE: INTERCONNECTED SMOKE / CO LOOP (NBC 9.10.19)',
      keys: [
        '① Interconnected Loop (NBC 9.10.19): When one alarm triggers, all interconnected alarms throughout the dwelling sound together',
        '② Mandatory Locations: Inside every bedroom, in hallways serving bedrooms, and on every storey (including basement)',
        '③ CO Alarm Requirement: Mandatory in dwellings with fuel-burning appliances or an attached storage garage'
      ],
      renderSvg: () => (
        <g>
          {/* Left: Bedroom + Hallway Plan Showing Interconnected SD & SD/CO Symbols */}
          <rect x="24" y="54" width="200" height="80" fill="#0f243c" stroke="#64748b" strokeWidth="2" />
          <line x1="124" y1="54" x2="124" y2="104" stroke="#cbd5e1" strokeWidth="2.5" />
          <text x="54" y="125" fill="#94a3b8" fontSize="8.2" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
            BEDRM
          </text>
          <text x="174" y="125" fill="#94a3b8" fontSize="8.2" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
            HALLWAY
          </text>

          {/* ① Red Dashed 3-Wire Interconnect Loop */}
          <path d="M 89 84 Q 124 64 157 84" fill="none" stroke="#ef4444" strokeWidth="2.6" strokeDasharray="6 3" />

          {/* SD & SD/CO Plan Symbols */}
          <circle cx="74" cy="88" r="15" fill="#0a192f" stroke="#ef4444" strokeWidth="2.4" />
          <text x="74" y="92" fill="#fca5a5" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
            SD
          </text>
          <circle cx="174" cy="88" r="17" fill="#0a192f" stroke="#ef4444" strokeWidth="2.4" />
          <text x="174" y="91" fill="#fca5a5" fontSize="8.8" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
            SD/CO
          </text>

          {/* Right Inset: Wall-Ceiling Corner "Dead Air Space" (>= 100mm / 4" Clearance) */}
          <rect x="236" y="54" width="110" height="80" rx="4" fill="#0f243c" stroke="#475569" strokeWidth="1.6" />
          <polyline points="246,126 246,66 338,66" fill="none" stroke="#cbd5e1" strokeWidth="2.5" />
          <polygon points="246,66 276,66 246,96" fill="#ef4444" fillOpacity="0.32" />
          <rect x="294" y="66" width="24" height="7" rx="2" fill="#fca5a5" stroke="#ef4444" strokeWidth="1.2" />

          <line x1="246" y1="82" x2="294" y2="82" stroke="#34d399" strokeWidth="2" />
          <polygon points="246,82 253,78.5 253,85.5" fill="#34d399" />
          <polygon points="294,82 287,78.5 287,85.5" fill="#34d399" />
          <text x="316" y="118" fill="#fca5a5" fontSize="8.2" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
            DEAD AIR
          </text>

          {/* Non-Crossing Vertical Leaders */}
          <line x1="108" y1="34" x2="108" y2="76" stroke="#ef4444" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <circle cx="108" cy="76" r="2.8" fill="#ef4444" />
          <line x1="82" y1="149" x2="82" y2="102" stroke="#22d3ee" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <line x1="278" y1="176" x2="278" y2="82" stroke="#34d399" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <circle cx="278" cy="82" r="2.8" fill="#34d399" />

          {/* Opaque #0a192f Callouts & Pins */}
          <CalloutPin x={26} y={26} num={1} variant="amber" />
          <CadLabel x={43} y={26} align="start" text="120V HARDWIRED + BATT + 3-WIRE LOOP" fontSize={8.4} padX={4} color="#fca5a5" borderColor="#ef4444" />

          <CalloutPin x={26} y={158} num={2} variant="cyan" />
          <CadLabel x={43} y={158} align="start" text="BEDROOMS + HALLWAYS + EVERY STOREY" fontSize={8.4} padX={4} color="#67e8f9" borderColor="#0284c7" />

          <CalloutPin x={92} y={185} num={3} variant="emerald" />
          <CadLabel x={109} y={185} align="start" text=">= 100mm (4&quot;) FROM CORNER DEAD AIR" fontSize={8.4} padX={4} color="#6ee7b7" borderColor="#059669" />
        </g>
      )
    }
  }

  // 11A. P1.0 DETAIL 1 / 7 — SUMP PIT RADON SEAL (NBC 9.25.1.2 AIRTIGHT BASIN & SUB-SLAB MEMBRANE)
  if (key.includes('sump') || key.includes('radon')) {
    return {
      scaleLabel: 'DETAIL SCALE: RADON-SEALED SUMP BASIN & SLAB (NBC 9.25.1.2)',
      keys: [
        '① Airtight Bolted Cover (NBC 9.25.1.2): All sump pits must have an airtight, gasketed lid to block radioactive radon soil gas',
        '② Sealed Pipe Grommets & Check Valve: All lid penetrations (discharge pipe, float cords) must be sealed gas-tight',
        '③ Sub-Slab Membrane Continuity: Seal sub-slab poly/radon barrier directly to the exterior perimeter of the sump basin'
      ],
      renderSvg: () => (
        <g>
          {/* 100mm (4") Granular Stone Bed Around & Beneath Sump Basin */}
          <rect x="18" y="106" width="98" height="58" fill="#0f243c" />
          <rect x="224" y="106" width="118" height="58" fill="#0f243c" />
          <rect x="18" y="156" width="324" height="10" fill="#0f243c" />
          {[34, 58, 82, 102, 138, 174, 206, 244, 276, 312].map((gx, i) => (
            <circle key={i} cx={gx} cy={i % 2 === 0 ? 120 : 160} r="1.8" fill="#475569" />
          ))}

          {/* Concrete Basement Floor Slab (Left & Right of Sump Pit) */}
          <rect x="18" y="84" width="98" height="20" fill="#334155" stroke="#94a3b8" strokeWidth="1.8" />
          <rect x="224" y="84" width="118" height="20" fill="#334155" stroke="#94a3b8" strokeWidth="1.8" />
          <text x="58" y="97" fill="#cbd5e1" fontSize="7.8" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
            CONC. SLAB
          </text>

          {/* ③ 6-Mil Poly / Radon Soil Gas Barrier Sealed to Basin Rim */}
          <polyline points="18,106 116,106 116,96" fill="none" stroke="#10b981" strokeWidth="2.8" />
          <circle cx="116" cy="104" r="3.2" fill="#34d399" />
          <polyline points="342,106 224,106 224,96" fill="none" stroke="#10b981" strokeWidth="2.8" />
          <circle cx="224" cy="104" r="3.2" fill="#34d399" />

          {/* Recessed Sump Basin + Submersible Pump + Water Line */}
          <path d="M 112 84 L 116 84 L 116 156 L 224 156 L 224 84 L 228 84" fill="#0a192f" stroke="#cbd5e1" strokeWidth="2.4" />
          <line x1="118" y1="140" x2="222" y2="140" stroke="#38bdf8" strokeWidth="1.4" strokeDasharray="4 3" />
          <rect x="152" y="132" width="26" height="22" rx="3" fill="#1e293b" stroke="#64748b" strokeWidth="1.6" />

          {/* Incoming 4" Weeping Tile Inlet */}
          <rect x="224" y="120" width="56" height="12" fill="#0a192f" stroke="#38bdf8" strokeWidth="1.8" />
          <line x1="274" y1="126" x2="234" y2="126" stroke="#67e8f9" strokeWidth="1.6" />
          <polygon points="229,126 236,123 236,129" fill="#67e8f9" />

          {/* ① Airtight Gasketed & Bolted Radon Lid */}
          <line x1="110" y1="84" x2="230" y2="84" stroke="#fbbf24" strokeWidth="2.2" strokeDasharray="3 2" />
          <rect x="108" y="78" width="124" height="6" rx="1.5" fill="#ef4444" stroke="#fca5a5" strokeWidth="1.4" />
          {[114, 138, 200, 222].map((bx, i) => (
            <rect key={i} x={bx} y="74" width="5" height="4" fill="#fde68a" />
          ))}

          {/* ② Vertical Pumped Discharge Pipe + Check Valve + Rubber Grommet Seal */}
          <polyline points="165,132 165,40 190,40" fill="none" stroke="#22d3ee" strokeWidth="4.2" />
          <rect x="157" y="74" width="16" height="9" rx="2" fill="#f59e0b" stroke="#fef08a" strokeWidth="1.2" />
          <rect x="158" y="50" width="14" height="15" rx="2" fill="#064e3b" stroke="#34d399" strokeWidth="1.8" />
          <polygon points="165,53 161.5,60 168.5,60" fill="#6ee7b7" />

          {/* Non-Crossing Leader Lines */}
          <line x1="126" y1="29" x2="126" y2="76" stroke="#ef4444" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <circle cx="126" cy="76" r="2.6" fill="#ef4444" />

          <line x1="194" y1="57" x2="173" y2="57" stroke="#22d3ee" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <line x1="186" y1="57" x2="173" y2="76" stroke="#fbbf24" strokeWidth="1.4" strokeDasharray="2.5 2" />

          <line x1="92" y1="178" x2="92" y2="106" stroke="#34d399" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <circle cx="92" cy="106" r="2.8" fill="#34d399" />

          {/* Opaque #0a192f Callouts & Pins */}
          <CadLabel x={286} y={146} text="4&quot; WEEPING INLET" fontSize={7.8} padX={3.5} color="#67e8f9" borderColor="#0284c7" />

          <CalloutPin x={24} y={22} num={1} variant="amber" />
          <CadLabel x={41} y={22} align="start" text="AIRTIGHT GASKETED & BOLTED RADON LID" fontSize={8.2} padX={4} color="#fca5a5" borderColor="#ef4444" />

          <CalloutPin x={206} y={57} num={2} variant="cyan" />
          <CadLabel x={223} y={48} align="start" text="CHECK VALVE +" fontSize={8.2} padX={4} color="#67e8f9" borderColor="#0284c7" />
          <CadLabel x={223} y={67} align="start" text="SEALED GROMMET" fontSize={8.2} padX={4} color="#fde68a" borderColor="#d97706" />

          <CalloutPin x={24} y={186} num={3} variant="emerald" />
          <CadLabel x={41} y={186} align="start" text="6-MIL POLY SEALED TO RIM + 4&quot; STONE BED" fontSize={8.2} padX={4} color="#6ee7b7" borderColor="#059669" />
        </g>
      )
    }
  }

  // 11B. P1.0 DETAIL 2 / 7 — JOIST PENETRATION (BORING <= 1/4 DEPTH & MIDDLE-1/3 PROHIBITED NOTCH ZONE)
  if (key.includes('joist penetration')) {
    return {
      scaleLabel: 'DETAIL SCALE: FLOOR JOIST DRILLING & NOTCHING (NBC 9.23.5.1)',
      keys: [
        '① Max Hole <= 1/4 Joist Depth (NBC 9.23.5.1): Max ~58mm (2-1/4") hole in a 2x10 (235mm), bored on neutral axis',
        '② Edge & Hole Clearance: Keep holes >= 50mm (2") from top/bottom edges and >= 50mm (2") apart',
        '③ Middle-1/3 Notch Prohibition: Zero notches allowed in middle 1/3 of span (end notches <= 1/3 depth within 1/2 depth of bearing)'
      ],
      renderSvg: () => (
        <g>
          {/* 2x10 Floor Joist Elevation (Span = 312px -> Thirds at x=128 & x=232) */}
          <rect x="24" y="56" width="312" height="90" fill="#1e293b" stroke="#f59e0b" strokeWidth="2.8" />
          <rect x="24" y="146" width="18" height="8" fill="#334155" stroke="#94a3b8" strokeWidth="1.2" />
          <rect x="318" y="146" width="18" height="8" fill="#334155" stroke="#94a3b8" strokeWidth="1.2" />

          {/* Neutral Center Axis */}
          <line x1="24" y1="101" x2="336" y2="101" stroke="#64748b" strokeWidth="1.4" strokeDasharray="6 4" />

          {/* ③ Middle 1/3 Span Boundaries & Prohibited Top/Bottom Notch Zones */}
          <line x1="128" y1="48" x2="128" y2="154" stroke="#f87171" strokeWidth="1.5" strokeDasharray="4 3" />
          <line x1="232" y1="48" x2="232" y2="154" stroke="#f87171" strokeWidth="1.5" strokeDasharray="4 3" />
          <rect x="128" y="56" width="104" height="16" fill="#ef4444" fillOpacity="0.38" stroke="#ef4444" strokeWidth="1.4" />
          <rect x="128" y="130" width="104" height="16" fill="#ef4444" fillOpacity="0.38" stroke="#ef4444" strokeWidth="1.4" />
          <text x="180" y="67" fill="#fecaca" fontSize="7.8" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
            NO NOTCH (MID 1/3)
          </text>
          <text x="180" y="141" fill="#fecaca" fontSize="7.8" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
            NO NOTCH (MID 1/3)
          </text>

          {/* ① Bored Hole <= 1/4 Joist Depth on Neutral Center Axis */}
          <circle cx="80" cy="101" r="19" fill="#0a192f" stroke="#22d3ee" strokeWidth="2.8" />

          {/* ② >= 50mm (2") Top & Bottom Edge Clearance Arrows */}
          <line x1="80" y1="56" x2="80" y2="82" stroke="#34d399" strokeWidth="2" />
          <polygon points="80,56 76.8,62 83.2,62" fill="#34d399" />
          <polygon points="80,82 76.8,76 83.2,76" fill="#34d399" />

          <line x1="80" y1="120" x2="80" y2="146" stroke="#34d399" strokeWidth="2" />
          <polygon points="80,120 76.8,126 83.2,126" fill="#34d399" />
          <polygon points="80,146 76.8,140 83.2,140" fill="#34d399" />

          {/* Non-Crossing Leader Lines */}
          <line x1="180" y1="31" x2="180" y2="56" stroke="#ef4444" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <circle cx="180" cy="56" r="2.6" fill="#ef4444" />

          <line x1="99" y1="101" x2="138" y2="101" stroke="#22d3ee" strokeWidth="1.6" strokeDasharray="3 2.5" />

          <line x1="80" y1="176" x2="80" y2="146" stroke="#34d399" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <circle cx="80" cy="146" r="2.6" fill="#34d399" />

          {/* Opaque #0a192f Callouts & Pins */}
          <CadLabel x={300} y={42} text="2x10 (235mm)" fontSize={8} padX={4} color="#fde68a" borderColor="#d97706" />

          <CalloutPin x={24} y={24} num={3} variant="amber" />
          <CadLabel x={41} y={24} align="start" text="NO NOTCHES IN MIDDLE 1/3 (ENDS <= 1/3 DEPTH)" fontSize={8.1} padX={4} color="#fca5a5" borderColor="#ef4444" />

          <CalloutPin x={150} y={101} num={1} variant="cyan" />
          <CadLabel x={167} y={101} align="start" text="HOLE <= 1/4 DEPTH (~58mm)" fontSize={8.2} padX={4} color="#67e8f9" borderColor="#0284c7" />

          <CalloutPin x={24} y={184} num={2} variant="emerald" />
          <CadLabel x={41} y={184} align="start" text="MIN 50mm (2&quot;) TO TOP/BOT EDGES & HOLES" fontSize={8.2} padX={4} color="#6ee7b7" borderColor="#059669" />
        </g>
      )
    }
  }

  // 11C. P1.0 DETAIL 3 / 7 — PLUMBING RISER VENTING (DWV ISOMETRIC RISER, F.L.R. & ROOF TERMINAL)
  if (key.includes('riser venting') || key.includes('plumbing riser')) {
    return {
      scaleLabel: 'DETAIL SCALE: DWV ISOMETRIC RISER & ROOF VENT (NPC)',
      keys: [
        '① Dashed Vent Lines (DWV Plan): Dashed vertical/horizontal lines represent air vents equalizing atmospheric pressure (NPC)',
        '② Flood Level Rim Rule: Vent tie-ins must rise vertically to at least 150mm (6") above the fixture\'s Flood Level Rim (F.L.R.)',
        '③ Roof Vent Terminal & Increaser: Upsize roof vent extension in cold climates to prevent hoarfrost closure + install neoprene flashing boot'
      ],
      renderSvg: () => (
        <g>
          {/* Floor Datum & Sloped Roof Deck Cut */}
          <line x1="20" y1="184" x2="190" y2="184" stroke="#475569" strokeWidth="2" />
          <line x1="136" y1="58" x2="196" y2="40" stroke="#94a3b8" strokeWidth="3.2" />

          {/* Main Vertical Soil/Waste Stack (Solid Lower) & Vent Stack (Dashed Upper) */}
          <line x1="166" y1="140" x2="166" y2="194" stroke="#3b82f6" strokeWidth="5.5" />
          <line x1="166" y1="48" x2="166" y2="140" stroke="#22d3ee" strokeWidth="3.5" strokeDasharray="6 4" />

          {/* ③ Upsized 3"-4" Roof Vent Terminal + Neoprene Flashing Boot */}
          <polygon points="152,53 180,45 173,37 159,41" fill="#f59e0b" stroke="#fde68a" strokeWidth="1.3" />
          <rect x="161" y="18" width="10" height="26" rx="1" fill="#0f243c" stroke="#34d399" strokeWidth="2.2" />

          {/* Lavatory Fixture Basin (Flood Level Rim @ y=118) + P-Trap + Solid Drain */}
          <path d="M 26 118 L 78 118 L 72 136 L 32 136 Z" fill="#1e293b" stroke="#cbd5e1" strokeWidth="2" />
          <path d="M 44 118 L 44 109 Q 52 105 56 112" fill="none" stroke="#94a3b8" strokeWidth="1.8" />
          <path d="M 52 136 L 52 154 Q 52 164 60 164 Q 68 164 68 152 L 166 156" fill="none" stroke="#3b82f6" strokeWidth="3.4" />

          {/* ① Dashed Fixture Dry Vent Rising >= 150mm (6") Above F.L.R. (y=92) */}
          <polyline points="108,154 108,92 166,92" fill="none" stroke="#22d3ee" strokeWidth="2.8" strokeDasharray="5 3" />

          {/* ② Flood Level Rim (F.L.R.) Datum & 150mm (6") Rise Arrow */}
          <line x1="78" y1="118" x2="106" y2="118" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3 2" />
          <line x1="88" y1="92" x2="108" y2="92" stroke="#fbbf24" strokeWidth="1.4" />
          <line x1="94" y1="92" x2="94" y2="118" stroke="#fbbf24" strokeWidth="2" />
          <polygon points="94,92 91,98 97,98" fill="#fbbf24" />
          <polygon points="94,118 91,112 97,112" fill="#fbbf24" />

          {/* Non-Crossing Leader Lines */}
          <line x1="94" y1="46" x2="94" y2="92" stroke="#fbbf24" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <line x1="188" y1="26" x2="171" y2="26" stroke="#34d399" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <line x1="188" y1="84" x2="166" y2="84" stroke="#22d3ee" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <circle cx="166" cy="84" r="2.6" fill="#22d3ee" />
          <line x1="200" y1="158" x2="166" y2="158" stroke="#3b82f6" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <circle cx="166" cy="158" r="2.6" fill="#3b82f6" />

          {/* Opaque #0a192f Callouts & Pins */}
          <CalloutPin x={24} y={26} num={2} variant="amber" />
          <CadLabel x={41} y={20} align="start" text="TIE-IN >= 150mm (6&quot;)" fontSize={8.1} padX={4} color="#fde68a" borderColor="#d97706" />
          <CadLabel x={41} y={39} align="start" text="ABOVE F.L.R. RIM" fontSize={8.1} padX={4} color="#ffffff" borderColor="#475569" />

          <CalloutPin x={200} y={26} num={3} variant="emerald" />
          <CadLabel x={217} y={20} align="start" text="3&quot;-4&quot; VENT TERMINAL" fontSize={8.2} padX={4} color="#6ee7b7" borderColor="#059669" />
          <CadLabel x={217} y={39} align="start" text="+ FLASHING BOOT" fontSize={8.2} padX={4} color="#fde68a" borderColor="#d97706" />

          <CalloutPin x={200} y={84} num={1} variant="cyan" />
          <CadLabel x={217} y={84} align="start" text="DASHED = DRY VENT" fontSize={8.3} padX={4} color="#67e8f9" borderColor="#0284c7" />
          <CadLabel x={204} y={158} align="start" text="SOLID = WASTE DRAIN" fontSize={8.3} padX={4} color="#93c5fd" borderColor="#3b82f6" />
        </g>
      )
    }
  }

  // 11D. P1.0 DETAIL 4 / 7 — PLUMBING P-TRAP (WATER SEAL DEPTH, TRAP ARM SLOPE & CROWN WEIR RULE)
  if (key.includes('p-trap')) {
    return {
      scaleLabel: 'DETAIL SCALE: P-TRAP WATER SEAL & CROWN WEIR (NPC)',
      keys: [
        '① Water Seal Barrier: Holds 38mm–100mm liquid plug to block toxic sewer gases from entering the building',
        '② Trap Arm Grade (1/4" per ft): Connects the trap weir to the vent stack; never S-trap or double-trap a fixture',
        '③ Anti-Siphon Weir Rule (NPC): Total fall along the trap arm cannot exceed 1× pipe inside diameter before hitting the vent'
      ],
      renderSvg: () => (
        <g>
          {/* Vertical Sanitary Stack (Dashed Vent Above + Solid Waste Below) */}
          <rect x="222" y="102" width="14" height="52" fill="#0f243c" stroke="#3b82f6" strokeWidth="2.2" />
          <line x1="229" y1="48" x2="229" y2="102" stroke="#22d3ee" strokeWidth="4" strokeDasharray="6 3.5" />

          {/* Zoomed P-Trap U-Bend + Sloped Trap Arm Cross-Section */}
          <path
            d="M 52 52 L 52 126 Q 52 146 80 146 Q 108 146 108 110 L 222 118 L 222 104 L 94 96 L 94 124 Q 94 132 80 132 Q 66 132 66 124 L 66 52 Z"
            fill="#0f243c"
            stroke="#cbd5e1"
            strokeWidth="2"
          />

          {/* ① Cyan Liquid Trap Seal Inside U-Bend (Level w/ Crown Weir y=110 to Top Dip y=132) */}
          <path
            d="M 53 110 L 65 110 L 65 124 Q 65 132 80 132 Q 95 132 95 124 L 95 110 L 107 110 L 107 126 Q 107 145 80 145 Q 53 145 53 126 Z"
            fill="#06b6d4"
            fillOpacity="0.58"
          />
          <line x1="53" y1="110" x2="65" y2="110" stroke="#67e8f9" strokeWidth="2" />
          <line x1="95" y1="110" x2="108" y2="110" stroke="#67e8f9" strokeWidth="2" />

          {/* ① Water Seal Depth Bracket (38mm–100mm) */}
          <line x1="34" y1="110" x2="50" y2="110" stroke="#22d3ee" strokeWidth="1.4" />
          <line x1="34" y1="132" x2="74" y2="132" stroke="#22d3ee" strokeWidth="1.4" strokeDasharray="2.5 2" />
          <line x1="38" y1="110" x2="38" y2="132" stroke="#22d3ee" strokeWidth="2" />

          {/* ② Trap Arm Slope Indicator (1/4" per ft = 2%) */}
          <line x1="134" y1="86" x2="204" y2="91" stroke="#fbbf24" strokeWidth="2" />
          <polygon points="206,91 198,87.5 198,94" fill="#fbbf24" />

          {/* ③ Crown Weir Horizontal Datum Projected to Vent Opening (Fall <= 1 Pipe Dia) */}
          <circle cx="108" cy="110" r="3.4" fill="#fbbf24" />
          <line x1="108" y1="110" x2="258" y2="110" stroke="#34d399" strokeWidth="1.6" strokeDasharray="4 2.5" />
          <line x1="222" y1="118" x2="258" y2="118" stroke="#34d399" strokeWidth="1.4" />
          <line x1="254" y1="110" x2="254" y2="118" stroke="#34d399" strokeWidth="2.2" />

          {/* Non-Crossing Leader Lines */}
          <line x1="172" y1="31" x2="172" y2="88" stroke="#fbbf24" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <circle cx="172" cy="88" r="2.6" fill="#fbbf24" />

          <polyline points="22,150 22,121 38,121" fill="none" stroke="#22d3ee" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <circle cx="38" cy="121" r="2.6" fill="#22d3ee" />

          <line x1="254" y1="180" x2="254" y2="118" stroke="#34d399" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <circle cx="254" cy="118" r="2.6" fill="#34d399" />

          {/* Opaque #0a192f Callouts & Pins */}
          <CalloutPin x={86} y={24} num={2} variant="amber" />
          <CadLabel x={103} y={24} align="start" text="TRAP ARM SLOPE = 1/4&quot;/FT (2%)" fontSize={8.3} padX={4} color="#fde68a" borderColor="#d97706" />

          <CalloutPin x={22} y={162} num={1} variant="cyan" />
          <CadLabel x={39} y={162} align="start" text="38-100mm (1.5&quot;-4&quot;) WATER SEAL" fontSize={8.2} padX={4} color="#67e8f9" borderColor="#0284c7" />

          <CalloutPin x={96} y={188} num={3} variant="emerald" />
          <CadLabel x={113} y={188} align="start" text="WEIR TO VENT FALL <= 1 PIPE DIA" fontSize={8.2} padX={4} color="#6ee7b7" borderColor="#059669" />
        </g>
      )
    }
  }

  // 11E. P1.0 DETAIL 5 / 7 — SOIL STACK (PLAN SYMBOL "SS" + JOIST ALIGNMENT & PLATE STRAPPING)
  if (key.includes('soil stack')) {
    return {
      scaleLabel: 'DETAIL SCALE: SOIL STACK SYMBOL & PLATE STRAPPING (P1.0)',
      keys: [
        '① Soil Stack Plan Symbol (SS / VTR): Circle inside a 2x6 plumbing wall indicating a 3" or 4" vertical waste/vent stack',
        '② Toilet Flange & Joist Layout: Always check P1.0 before nailing floor joists so a joist never lands directly under a 12" rough-in toilet center!',
        '③ Plate Reinforcement (NBC 9.23.5): When a 3"–4" stack cuts >50% of a top/bottom plate width, reinforce across the cut with a heavy-gauge steel tie strap'
      ],
      renderSvg: () => (
        <g>
          {/* Center Split Divider */}
          <line x1="154" y1="42" x2="154" y2="166" stroke="#334155" strokeWidth="1.2" strokeDasharray="4 3" />

          {/* Left Pane: P1.0 Floor Plan Symbol (2x6 Plumbing Wall + Ø4" SS Circle) */}
          <rect x="20" y="78" width="124" height="38" fill="#1e293b" stroke="#cbd5e1" strokeWidth="2" />
          <rect x="28" y="78" width="10" height="38" fill="#334155" stroke="#fbbf24" strokeWidth="1.4" />
          <rect x="126" y="78" width="10" height="38" fill="#334155" stroke="#fbbf24" strokeWidth="1.4" />
          <circle cx="82" cy="97" r="16" fill="#0a192f" stroke="#22d3ee" strokeWidth="2.8" />
          <circle cx="82" cy="97" r="12" fill="none" stroke="#38bdf8" strokeWidth="1" />

          {/* Right Pane: Vertical Stack Through Double Top Plate & Floor Joists */}
          <rect x="226" y="44" width="18" height="120" fill="#0f243c" stroke="#38bdf8" strokeWidth="2.2" />

          {/* Double Top Plates + ③ Heavy-Gauge Steel Tie Strap */}
          <rect x="170" y="56" width="56" height="12" fill="#1e293b" stroke="#fbbf24" strokeWidth="1.5" />
          <rect x="244" y="56" width="64" height="12" fill="#1e293b" stroke="#fbbf24" strokeWidth="1.5" />
          <rect x="206" y="59" width="58" height="6" rx="1" fill="#ef4444" stroke="#fca5a5" strokeWidth="1.2" />
          <rect x="222" y="84" width="26" height="5" rx="1" fill="#10b981" />

          {/* Subfloor + Spaced 2x10 Floor Joists Clearing Stack & 12" Toilet Closet Bend */}
          <line x1="168" y1="106" x2="342" y2="106" stroke="#cbd5e1" strokeWidth="2.4" />
          <rect x="194" y="108" width="14" height="26" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.6" />
          <line x1="194" y1="108" x2="208" y2="134" stroke="#f59e0b" strokeWidth="1" />
          <line x1="208" y1="108" x2="194" y2="134" stroke="#f59e0b" strokeWidth="1" />

          <rect x="312" y="108" width="14" height="26" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.6" />
          <line x1="312" y1="108" x2="326" y2="134" stroke="#f59e0b" strokeWidth="1" />
          <line x1="326" y1="108" x2="312" y2="134" stroke="#f59e0b" strokeWidth="1" />

          {/* ② Toilet Closet Flange & 3" Closet Bend */}
          <rect x="268" y="102" width="20" height="4" fill="#fbbf24" />
          <path d="M 278 106 L 278 122 Q 278 138 262 138 L 244 138" fill="none" stroke="#38bdf8" strokeWidth="4" />

          {/* Non-Crossing Leader Lines */}
          <line x1="82" y1="31" x2="82" y2="81" stroke="#22d3ee" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <line x1="254" y1="31" x2="254" y2="59" stroke="#ef4444" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <line x1="278" y1="176" x2="278" y2="136" stroke="#fbbf24" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <circle cx="278" cy="136" r="2.6" fill="#fbbf24" />

          {/* Opaque #0a192f Callouts & Pins */}
          <CadLabel x={82} y={136} text="Ø4&quot; SS / VTR" fontSize={8.4} padX={4} color="#67e8f9" borderColor="#0284c7" />

          <CalloutPin x={22} y={24} num={1} variant="cyan" />
          <CadLabel x={39} y={24} align="start" text="PLAN: CIRCLE W/ &quot;SS&quot; TAG" fontSize={8.2} padX={4} color="#67e8f9" borderColor="#0284c7" />

          <CalloutPin x={184} y={24} num={3} variant="emerald" />
          <CadLabel x={201} y={24} align="start" text="STEEL STRAP @ PLATES" fontSize={8.2} padX={4} color="#fca5a5" borderColor="#ef4444" />

          <CalloutPin x={42} y={184} num={2} variant="amber" />
          <CadLabel x={59} y={184} align="start" text="ALIGN JOISTS TO CLEAR TOILET FLANGE & STACK" fontSize={8.2} padX={4} color="#fde68a" borderColor="#d97706" />
        </g>
      )
    }
  }

  // 11F. P1.0 DETAIL 6 / 7 — BUILDING DRAIN (SUB-SLAB SANITARY DRAIN, 2% GRADE & 45° WYE SWEEPS)
  if (key.includes('building drain')) {
    return {
      scaleLabel: 'DETAIL SCALE: SUB-SLAB SANITARY BUILDING DRAIN (NPC 7.4.8)',
      keys: [
        '① Sanitary Building Drain: Lowest horizontal piping system receiving discharge from soil/waste stacks under the floor slab',
        '② Gravity Slope Rule (NPC): Standard 1/4" per foot (2%) fall ensures self-scouring flow velocity without stranding solids',
        '③ Long-Sweep Fittings: Horizontal-to-horizontal drainage turns must use 45° wyes + 45° bends (never tight 90° sanitary tees on their back!)'
      ],
      renderSvg: () => (
        <g>
          {/* Compacted Sand / Pea Gravel Trench Bedding */}
          <rect x="20" y="76" width="320" height="80" fill="#0f243c" stroke="#334155" strokeWidth="1.2" />
          {[38, 66, 98, 134, 168, 202, 238, 274, 308].map((gx, i) => (
            <circle key={i} cx={gx} cy={i % 2 === 0 ? 142 : 148} r="1.9" fill="#34d399" fillOpacity="0.55" />
          ))}

          {/* Concrete Basement Floor Slab */}
          <rect x="20" y="64" width="320" height="12" fill="#334155" stroke="#94a3b8" strokeWidth="1.6" />

          {/* Vertical Stack + ③ 45° Wye + 1/8 Bend Long Sweep Into 4" Underground Building Drain */}
          <path
            d="M 54 58 L 54 90 Q 54 114 82 116 L 334 134 L 334 120 L 84 102 Q 68 100 68 88 L 68 58 Z"
            fill="#0a192f"
            stroke="#38bdf8"
            strokeWidth="2.2"
          />
          {/* Branch 45° Wye Sweep */}
          <line x1="168" y1="90" x2="188" y2="110" stroke="#38bdf8" strokeWidth="4.5" />

          {/* ① Directional Flow Arrows (==>) Toward Municipal Sewer / Septic */}
          {[112, 206, 276].map((fx, i) => (
            <g key={i}>
              <line x1={fx} y1={111 + i * 5.5} x2={fx + 22} y2={112.5 + i * 5.5} stroke="#22d3ee" strokeWidth="2" />
              <polygon
                points={`${fx + 25},${112.8 + i * 5.5} ${fx + 18},${109.5 + i * 5.5} ${fx + 18},${116 + i * 5.5}`}
                fill="#22d3ee"
              />
            </g>
          ))}

          {/* ② Horizontal Level Datum vs. 2% (1/4" per ft) Fall */}
          <line x1="90" y1="102" x2="324" y2="102" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4 3" />
          <line x1="316" y1="102" x2="316" y2="119" stroke="#fbbf24" strokeWidth="2.2" />
          <polygon points="316,119 312.8,113 319.2,113" fill="#fbbf24" />

          {/* Non-Crossing Leader Lines */}
          <line x1="132" y1="28" x2="132" y2="105" stroke="#22d3ee" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <circle cx="132" cy="105" r="2.6" fill="#22d3ee" />

          <line x1="316" y1="53" x2="316" y2="102" stroke="#fbbf24" strokeWidth="1.6" strokeDasharray="3 2.5" />

          <line x1="82" y1="176" x2="82" y2="116" stroke="#34d399" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <circle cx="82" cy="116" r="2.6" fill="#34d399" />

          {/* Opaque #0a192f Callouts & Pins */}
          <CalloutPin x={24} y={21} num={1} variant="cyan" />
          <CadLabel x={41} y={21} align="start" text="FLOW ARROWS ==> TO SEWER / SEPTIC" fontSize={8.2} padX={4} color="#67e8f9" borderColor="#0284c7" />

          <CalloutPin x={156} y={46} num={2} variant="amber" />
          <CadLabel x={173} y={46} align="start" text="MIN 2% GRADE = 1/4&quot; PER FT FALL" fontSize={8.2} padX={4} color="#fde68a" borderColor="#d97706" />

          <CalloutPin x={24} y={184} num={3} variant="emerald" />
          <CadLabel x={41} y={184} align="start" text="SAND/PEA GRAVEL BED + 45° WYE SWEEPS" fontSize={8.2} padX={4} color="#6ee7b7" borderColor="#059669" />
        </g>
      )
    }
  }

  // 11G. P1.0 DETAIL 7 / 7 — CLEANOUT (C.O.) (PLAN SYMBOL, BASE OF STACK & CARPENTER ACCESS PANEL)
  if (key.includes('cleanout') || key.includes('plumbing')) {
    return {
      scaleLabel: 'DETAIL SCALE: CLEANOUT SYMBOL, STACK BASE & ACCESS (P1.0)',
      keys: [
        '① Cleanout Symbol (C.O.): Branch wye or test tee with removable threaded cap for drain augering/rodding',
        '② Mandatory Locations (NPC): Required at the base of every vertical soil/waste stack, every 15m (50\') of horizontal run, and wherever cumulative direction changes exceed 135°',
        '③ Framing & Drywall Access: Carpenters must leave a removable access panel and clear rodding clearance in front of every C.O. plug'
      ],
      renderSvg: () => (
        <g>
          {/* ① Left Card: Cleanout Plan Symbol (45° Wye Branch + Threaded Plug Tag "C.O.") */}
          <rect x="18" y="48" width="114" height="114" rx="4" fill="#0f243c" stroke="#334155" strokeWidth="1.6" />
          <line x1="28" y1="108" x2="120" y2="108" stroke="#38bdf8" strokeWidth="4.5" />
          <polygon points="122,108 114,104 114,112" fill="#38bdf8" />
          <line x1="82" y1="108" x2="54" y2="80" stroke="#22d3ee" strokeWidth="4" />
          <line x1="46" y1="88" x2="62" y2="72" stroke="#fbbf24" strokeWidth="3" />
          <rect x="47" y="73" width="8" height="8" transform="rotate(-45 51 77)" fill="#ef4444" stroke="#fde68a" strokeWidth="1.2" />
          <CadLabel x={75} y={142} text="45° WYE &quot;C.O.&quot;" fontSize={8.2} padX={4} color="#67e8f9" borderColor="#0284c7" />

          {/* ② Top-Right Card: Mandatory Base-of-Stack & Building Drain Exit Cleanout */}
          <rect x="144" y="48" width="202" height="62" rx="4" fill="#0f243c" stroke="#f59e0b" strokeWidth="1.8" />
          <line x1="168" y1="56" x2="168" y2="94" stroke="#38bdf8" strokeWidth="4" />
          <path d="M 168 94 Q 168 102 178 102 L 192 102" fill="none" stroke="#38bdf8" strokeWidth="4" />
          <rect x="156" y="76" width="9" height="8" rx="1" fill="#ef4444" stroke="#fde68a" strokeWidth="1.2" />
          <line x1="150" y1="90" x2="192" y2="90" stroke="#94a3b8" strokeWidth="1.5" />
          <CadLabel x={200} y={68} align="start" text="BASE OF EVERY STACK" fontSize={8.1} padX={4} color="#fde68a" borderColor="#d97706" />
          <CadLabel x={200} y={92} align="start" text="& BUILDING DRAIN EXIT" fontSize={8.1} padX={4} color="#cbd5e1" borderColor="#475569" />

          {/* ③ Bottom-Right Card: Framed Access Panel + 300mm–450mm (12"–18") Clear Rodding Space */}
          <rect x="144" y="122" width="202" height="70" rx="4" fill="#0f243c" stroke="#10b981" strokeWidth="1.8" />
          <rect x="154" y="134" width="26" height="28" rx="2" fill="#0a192f" stroke="#34d399" strokeWidth="1.8" strokeDasharray="4 2" />
          <circle cx="167" cy="148" r="5.5" fill="#ef4444" stroke="#fde68a" strokeWidth="1.2" />
          <line x1="154" y1="174" x2="182" y2="174" stroke="#34d399" strokeWidth="1.8" />
          <CadLabel x={192} y={144} align="start" text="ACCESS PANEL REQUIRED" fontSize={8.1} padX={4} color="#6ee7b7" borderColor="#059669" />
          <CadLabel x={192} y={170} align="start" text="12&quot;-18&quot; RODDING CLEAR" fontSize={8.1} padX={4} color="#ffffff" borderColor="#475569" />

          {/* Non-Crossing Leader Lines */}
          <line x1="75" y1="31" x2="75" y2="48" stroke="#22d3ee" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <line x1="245" y1="31" x2="245" y2="48" stroke="#fbbf24" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <line x1="123" y1="182" x2="144" y2="168" stroke="#34d399" strokeWidth="1.6" strokeDasharray="3 2.5" />

          {/* Opaque #0a192f Callouts & Pins */}
          <CalloutPin x={22} y={24} num={1} variant="cyan" />
          <CadLabel x={39} y={24} align="start" text="PLAN: 45° WYE + &quot;C.O.&quot;" fontSize={8.2} padX={4} color="#67e8f9" borderColor="#0284c7" />

          <CalloutPin x={176} y={24} num={2} variant="amber" />
          <CadLabel x={193} y={24} align="start" text="MANDATORY C.O. SPOTS" fontSize={8.2} padX={4} color="#fde68a" borderColor="#d97706" />

          <CalloutPin x={24} y={182} num={3} variant="emerald" />
          <CadLabel x={41} y={182} align="start" text="NEVER BURY C.O." fontSize={8.1} padX={4} color="#6ee7b7" borderColor="#059669" />
        </g>
      )
    }
  }

  // 12A. S2.0 DETAIL 1 / 6 — JOIST SPAN ARROW (SPAN DIRECTION, END BEARING & CENTER BEAM LAP)
  if (key.includes('joist span')) {
    return {
      scaleLabel: 'DETAIL SCALE: JOIST SPAN ARROW, BEARING & LAP (S2.0)',
      keys: [
        '① Span Direction Arrow: Double-headed arrow on S2.0 indicates joist orientation, lumber size, species/grade, and O.C. spacing',
        '② Minimum End Bearing (NBC 9.23.9.1): Floor joists require at least 38mm (1-1/2") bearing on wood/steel or 89mm (3-1/2") on masonry/concrete',
        '③ Center Beam Lap (NBC 9.23.9.2): Joists lapping over a center beam must overlap 150mm–300mm (6"–12") and be nailed together'
      ],
      renderSvg: () => (
        <g>
          {/* Left Exterior Foundation Wall + Sill Bearing & Right-Center Girder Beam */}
          <rect x="22" y="50" width="20" height="104" fill="#334155" stroke="#94a3b8" strokeWidth="1.8" />
          <line x1="25" y1="50" x2="25" y2="154" stroke="#fbbf24" strokeWidth="2.5" />
          <rect x="244" y="50" width="24" height="104" fill="#3f1d2e" stroke="#ef4444" strokeWidth="2" />

          {/* Floor Joists @ 16" O.C. + Side-by-Side Lapping Joists Over Center Girder */}
          <line x1="27" y1="50" x2="338" y2="50" stroke="#94a3b8" strokeWidth="1.8" />
          {[80, 102, 122, 142].map((jy, idx) => (
            <g key={idx}>
              <line x1="27" y1={jy} x2="274" y2={jy} stroke="#f59e0b" strokeWidth="2.6" />
              <line x1="238" y1={jy + 5} x2="338" y2={jy + 5} stroke="#fbbf24" strokeWidth="2.6" />
            </g>
          ))}

          {/* ② Left End Bearing Highlight & ③ Center Girder Lap Bracket (150–300mm / 6"–12") */}
          <rect x="27" y="50" width="15" height="14" fill="#f59e0b" fillOpacity="0.28" stroke="#fbbf24" strokeWidth="1.2" />
          <line x1="238" y1="154" x2="238" y2="164" stroke="#34d399" strokeWidth="1.5" />
          <line x1="274" y1="154" x2="274" y2="164" stroke="#34d399" strokeWidth="1.5" />
          <line x1="238" y1="160" x2="274" y2="160" stroke="#34d399" strokeWidth="2.2" />

          {/* ① Bold Double-Headed Cyan Span Direction Arrow in First Joist Bay (y=62) */}
          <line x1="48" y1="62" x2="232" y2="62" stroke="#22d3ee" strokeWidth="3" />
          <polygon points="46,62 56,57.5 56,66.5" fill="#22d3ee" />
          <polygon points="234,62 224,57.5 224,66.5" fill="#22d3ee" />

          {/* Non-Crossing Leader Lines */}
          <polyline points="46,30 46,42 35,50" fill="none" stroke="#fbbf24" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <circle cx="35" cy="50" r="2.6" fill="#fbbf24" />

          <line x1="212" y1="35" x2="212" y2="62" stroke="#22d3ee" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <circle cx="212" cy="62" r="2.8" fill="#22d3ee" />

          <polyline points="224,184 256,184 256,160" fill="none" stroke="#34d399" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <circle cx="256" cy="160" r="2.8" fill="#34d399" />

          {/* Opaque #0a192f Callouts & Pins (Drawn Last Over All Joists) */}
          <CadLabel x={140} y={62} text="2x10 SPF @ 16&quot; O.C." fontSize={8.5} padX={4.5} color="#67e8f9" borderColor="#0284c7" />

          <CalloutPin x={24} y={23} num={2} variant="amber" />
          <CadLabel x={41} y={23} align="start" text="MIN 38mm (1-1/2&quot;) END BEARING" fontSize={8.2} padX={4} color="#fde68a" borderColor="#d97706" />

          <CalloutPin x={212} y={23} num={1} variant="cyan" />
          <CadLabel x={229} y={23} align="start" text="SPAN ARROW & SPEC" fontSize={8.2} padX={4} color="#67e8f9" borderColor="#0284c7" />

          <CalloutPin x={24} y={184} num={3} variant="emerald" />
          <CadLabel x={41} y={184} align="start" text="CENTER BEAM LAP: 150-300mm (6&quot;-12&quot;)" fontSize={8.2} padX={4} color="#6ee7b7" borderColor="#059669" />
        </g>
      )
    }
  }

  // 12B. S2.0 DETAIL 2 / 6 — CROSS-BRIDGING (PLAN DASHED ROW, X-BRIDGING & SOLID BLOCKING)
  if (key.includes('cross-bridging')) {
    return {
      scaleLabel: 'DETAIL SCALE: JOIST X-BRIDGING & BLOCKING (NBC 9.23.9.4)',
      keys: [
        '① 2.1m (6\'-10") Max Spacing (NBC 9.23.9.4): Bridging, blocking, or strapping is required at max 2.1m intervals when joist spans exceed 2.1m',
        '② Load Sharing & Twist Prevention: Transfers concentrated floor loads to adjacent joists and stops deep joists from rolling',
        '③ Jobsite Nailing Rule: Leave bottom nails of diagonal wood bridging partly un-driven until subfloor sheathing is fastened so bridging doesn\'t squeak'
      ],
      renderSvg: () => (
        <g>
          {/* ① Left Card: Plan Symbol (Dashed Line @ Max 2.1m / 6'-10" O.C.) */}
          <rect x="18" y="46" width="114" height="118" rx="4" fill="#0f243c" stroke="#334155" strokeWidth="1.6" />
          <line x1="26" y1="56" x2="124" y2="56" stroke="#94a3b8" strokeWidth="2.2" />
          <line x1="26" y1="154" x2="124" y2="154" stroke="#94a3b8" strokeWidth="2.2" />
          {[38, 62, 86, 110].map((jx, i) => (
            <line key={i} x1={jx} y1="56" x2={jx} y2="154" stroke="#f59e0b" strokeWidth="2.4" />
          ))}
          <line x1="26" y1="100" x2="124" y2="100" stroke="#34d399" strokeWidth="3" strokeDasharray="6 3.5" />
          <line x1="120" y1="56" x2="120" y2="100" stroke="#22d3ee" strokeWidth="1.8" />
          <CadLabel x={75} y={138} text="<= 2.1m (6'-10&quot;)" fontSize={8} padX={3.5} color="#6ee7b7" borderColor="#059669" />

          {/* ② Top-Right Card: Section View — Diagonal 1x3 / 2x2 Wood X-Bridging */}
          <rect x="144" y="46" width="202" height="64" rx="4" fill="#0f243c" stroke="#f59e0b" strokeWidth="1.7" />
          <line x1="152" y1="56" x2="226" y2="56" stroke="#cbd5e1" strokeWidth="2.4" />
          <rect x="156" y="58" width="12" height="42" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.6" />
          <rect x="210" y="58" width="12" height="42" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.6" />
          <line x1="168" y1="62" x2="210" y2="96" stroke="#fde68a" strokeWidth="2.8" />
          <line x1="210" y1="62" x2="168" y2="96" stroke="#fbbf24" strokeWidth="2.8" />
          {/* Un-driven bottom nails */}
          <line x1="163" y1="99" x2="170" y2="94" stroke="#22d3ee" strokeWidth="2" />
          <line x1="215" y1="99" x2="208" y2="94" stroke="#22d3ee" strokeWidth="2" />
          <CadLabel x={230} y={66} align="start" text="1x3 X-BRIDGING" fontSize={8.1} padX={4} color="#fde68a" borderColor="#d97706" />
          <CadLabel x={230} y={92} align="start" text="BOT NAILS LAST!" fontSize={8.1} padX={4} color="#67e8f9" borderColor="#0284c7" />

          {/* ③ Bottom-Right Card: Staggered Full-Depth 2x10 Solid Blocking */}
          <rect x="144" y="120" width="202" height="70" rx="4" fill="#0f243c" stroke="#10b981" strokeWidth="1.7" />
          {[156, 184, 212].map((bx, i) => (
            <line key={i} x1={bx} y1="130" x2={bx} y2="180" stroke="#f59e0b" strokeWidth="3" />
          ))}
          <rect x="158" y="142" width="24" height="9" fill="#34d399" fillOpacity="0.38" stroke="#34d399" strokeWidth="1.6" />
          <rect x="186" y="158" width="24" height="9" fill="#34d399" fillOpacity="0.38" stroke="#34d399" strokeWidth="1.6" />
          <CadLabel x={224} y={142} align="start" text="2x10 SOLID BLOCK" fontSize={8.1} padX={4} color="#6ee7b7" borderColor="#059669" />
          <CadLabel x={224} y={168} align="start" text="STAGGER TO NAIL" fontSize={8.1} padX={4} color="#ffffff" borderColor="#475569" />

          {/* Non-Crossing Leader Lines */}
          <line x1="75" y1="30" x2="75" y2="46" stroke="#22d3ee" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <line x1="245" y1="30" x2="245" y2="46" stroke="#fbbf24" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <line x1="111" y1="183" x2="144" y2="168" stroke="#34d399" strokeWidth="1.6" strokeDasharray="3 2.5" />

          {/* Opaque #0a192f Callouts & Pins */}
          <CalloutPin x={22} y={23} num={1} variant="cyan" />
          <CadLabel x={39} y={23} align="start" text="PLAN: DASHED @ 2.1m" fontSize={8.1} padX={4} color="#67e8f9" borderColor="#0284c7" />

          <CalloutPin x={162} y={23} num={2} variant="amber" />
          <CadLabel x={179} y={23} align="start" text="DIAGONAL X-BRIDGING" fontSize={8.1} padX={4} color="#fde68a" borderColor="#d97706" />

          <CalloutPin x={22} y={183} num={3} variant="emerald" />
          <CadLabel x={39} y={183} align="start" text="BLOCK / STRAP" fontSize={8.1} padX={4} color="#6ee7b7" borderColor="#059669" />
        </g>
      )
    }
  }

  // 12C. S2.0 DETAIL 3 / 6 — METAL JOIST HANGERS (FACE-MOUNT LUS210, HANGER NAILS & MAX 3mm GAP)
  if (key.includes('hanger')) {
    return {
      scaleLabel: 'DETAIL SCALE: FACE-MOUNT JOIST HANGER & NAILING (S2.0)',
      keys: [
        '① Mandatory Hanger Rule (NBC 9.23.9.6): Required whenever header joists exceed 1.2m (4\'-0") or tail joists exceed 2.4m (8\'-0") (or cannot be end-nailed)',
        '② Proper Hanger Fasteners: Always fill 100% of round/diamond holes using structural joist-hanger nails (1-1/2" into single ply, 3" through double-shear flanges—never drywall/deck screws!)',
        '③ Tight Seat & Bearing: Cut joists within 3mm (1/8") of the supporting header/beam and seat fully at the bottom of the hanger stirrup'
      ],
      renderSvg: () => (
        <g>
          {/* Left Supporting Doubled Header / LVL Beam */}
          <rect x="40" y="46" width="24" height="108" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
          <line x1="40" y1="46" x2="64" y2="154" stroke="#f59e0b" strokeWidth="1" strokeOpacity="0.55" />
          <line x1="64" y1="46" x2="40" y2="154" stroke="#f59e0b" strokeWidth="1" strokeOpacity="0.55" />

          <rect x="64" y="46" width="24" height="108" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
          <line x1="64" y1="46" x2="88" y2="154" stroke="#f59e0b" strokeWidth="1" strokeOpacity="0.55" />
          <line x1="88" y1="46" x2="64" y2="154" stroke="#f59e0b" strokeWidth="1" strokeOpacity="0.55" />

          {/* Supported 2x10 Tail Joist w/ Architectural Cut Line @ x=188 (<= 3mm Gap at x=88..92) */}
          <path
            d="M 92 50 L 188 50 L 188 88 L 182 94 L 194 102 L 188 108 L 188 146 L 92 146 Z"
            fill="#1e293b"
            stroke="#fbbf24"
            strokeWidth="2.2"
          />

          {/* ① Galvanized Steel Face-Mount LUS210 Hanger Stirrup */}
          <rect x="85" y="64" width="7" height="86" fill="#64748b" stroke="#e2e8f0" strokeWidth="1.6" />
          <rect x="85" y="146" width="48" height="5" fill="#94a3b8" stroke="#f8fafc" strokeWidth="1.5" />
          <rect x="92" y="70" width="40" height="76" fill="#475569" fillOpacity="0.84" stroke="#cbd5e1" strokeWidth="1.8" />

          {/* ② Face Nails (1-1/2"x10d) + Angled Double-Shear Toe Nails (3"x10d @ 45°) */}
          {[76, 96, 116, 136].map((ny, i) => (
            <g key={i}>
              <line x1="58" y1={ny} x2="88" y2={ny} stroke="#22d3ee" strokeWidth="1.8" strokeDasharray="3 2" />
              <circle cx="88" cy={ny} r="2.3" fill="#67e8f9" />
            </g>
          ))}
          <polygon points="116,85 120,89 116,93 112,89" fill="#fbbf24" />
          <line x1="118" y1="87" x2="72" y2="122" stroke="#fbbf24" strokeWidth="2.4" strokeDasharray="4 2" />
          <polygon points="116,117 120,121 116,125 112,121" fill="#fbbf24" />
          <line x1="118" y1="119" x2="72" y2="146" stroke="#fbbf24" strokeWidth="2.4" strokeDasharray="4 2" />

          {/* ③ <= 3mm (1/8") Bearing Gap Ticks */}
          <line x1="88" y1="152" x2="88" y2="162" stroke="#34d399" strokeWidth="1.5" />
          <line x1="92" y1="152" x2="92" y2="162" stroke="#34d399" strokeWidth="1.5" />

          {/* Non-Crossing Leader Lines */}
          <line x1="112" y1="30" x2="112" y2="70" stroke="#22d3ee" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <circle cx="112" cy="70" r="2.6" fill="#22d3ee" />

          <line x1="196" y1="89" x2="120" y2="89" stroke="#fbbf24" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <circle cx="120" cy="89" r="2.6" fill="#fbbf24" />

          <line x1="90" y1="176" x2="90" y2="151" stroke="#34d399" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <circle cx="90" cy="151" r="2.6" fill="#34d399" />

          {/* Opaque #0a192f Callouts & Pins */}
          <CalloutPin x={24} y={23} num={1} variant="cyan" />
          <CadLabel x={41} y={23} align="start" text="LUS210 HANGER: FILL ALL NAIL HOLES" fontSize={8.2} padX={4} color="#67e8f9" borderColor="#0284c7" />

          <CalloutPin x={208} y={89} num={2} variant="amber" />
          <CadLabel x={225} y={76} align="start" text="FACE: 1-1/2&quot; HANGER" fontSize={8.1} padX={4} color="#67e8f9" borderColor="#0284c7" />
          <CadLabel x={225} y={101} align="start" text="SHEAR: 3&quot; @ 45° TOE" fontSize={8.1} padX={4} color="#fde68a" borderColor="#d97706" />

          <CalloutPin x={24} y={184} num={3} variant="emerald" />
          <CadLabel x={41} y={184} align="start" text="MAX 3mm (1/8&quot;) GAP + SEAT FULLY" fontSize={8.2} padX={4} color="#6ee7b7" borderColor="#059669" />
        </g>
      )
    }
  }

  // 12D. S2.0 DETAIL 4 / 6 — FLOOR OPENINGS (HEADERS) (DOUBLED TRIMMERS, DOUBLED HEADERS & TAIL JOISTS)
  if (key.includes('floor opening') || key.includes('trimmer')) {
    return {
      scaleLabel: 'DETAIL SCALE: STAIRWELL FLOOR OPENING FRAMING (S2.0)',
      keys: [
        '① Trimmer Joists (NBC 9.23.9.7): Full-length joists bordering the opening; must be doubled whenever header joists exceed 800mm (32")',
        '② Header Joists (NBC 9.23.9.6): Frame perpendicular between trimmers; must be doubled whenever the opening width exceeds 1.2m (4\'-0")',
        '③ Tail Joists: Shortened floor joists interrupted by the stairwell/chimney opening and hung off the header joist'
      ],
      renderSvg: () => (
        <g>
          {/* Exterior Rim Joist (Top) & Center Girder Beam (Bottom) */}
          <line x1="26" y1="48" x2="334" y2="48" stroke="#94a3b8" strokeWidth="3" />
          <line x1="26" y1="154" x2="334" y2="154" stroke="#ef4444" strokeWidth="4.5" />

          {/* Standard Full-Span Floor Joists Outside Opening */}
          {[52, 80, 280, 308].map((jx, i) => (
            <line key={i} x1={jx} y1="48" x2={jx} y2="154" stroke="#f59e0b" strokeWidth="2.2" />
          ))}

          {/* Stairwell Opening Void (> 1.2m / 4'-0" Wide) */}
          <rect x="118" y="49" width="124" height="52" fill="#061325" />
          <line x1="118" y1="49" x2="242" y2="101" stroke="#334155" strokeWidth="1.2" strokeDasharray="4 3" />
          <line x1="242" y1="49" x2="118" y2="101" stroke="#334155" strokeWidth="1.2" strokeDasharray="4 3" />
          <rect x="136" y="67" width="68" height="15" rx="3" fill="#0a192f" stroke="#334155" strokeWidth="1" />
          <text x="170" y="77.5" fill="#cbd5e1" fontSize="8" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
            OPEN &gt; 1.2m
          </text>

          {/* ① Doubled Full-Span Trimmer Joists Flanking Opening */}
          <line x1="112" y1="48" x2="112" y2="154" stroke="#22d3ee" strokeWidth="2.6" />
          <line x1="117" y1="48" x2="117" y2="154" stroke="#22d3ee" strokeWidth="2.6" />
          <line x1="243" y1="48" x2="243" y2="154" stroke="#22d3ee" strokeWidth="2.6" />
          <line x1="248" y1="48" x2="248" y2="154" stroke="#22d3ee" strokeWidth="2.6" />

          {/* ② Doubled Perpendicular Header Joists + Double Hangers */}
          <line x1="117" y1="102" x2="243" y2="102" stroke="#fbbf24" strokeWidth="2.8" />
          <line x1="117" y1="107" x2="243" y2="107" stroke="#fbbf24" strokeWidth="2.8" />
          <rect x="117" y="99" width="5" height="11" fill="#e2e8f0" />
          <rect x="238" y="99" width="5" height="11" fill="#e2e8f0" />

          {/* ③ Interrupted Tail Joists Hung From Doubled Header */}
          {[148, 180, 212].map((tx, i) => (
            <g key={i}>
              <line x1={tx} y1="108" x2={tx} y2="154" stroke="#34d399" strokeWidth="2.8" />
              <rect x={tx - 4} y="107" width="8" height="5" fill="#cbd5e1" />
            </g>
          ))}

          {/* Non-Crossing Leader Lines */}
          <line x1="114" y1="30" x2="114" y2="48" stroke="#22d3ee" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <circle cx="114" cy="48" r="2.6" fill="#22d3ee" />

          <line x1="226" y1="30" x2="226" y2="102" stroke="#fbbf24" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <circle cx="226" cy="102" r="2.6" fill="#fbbf24" />

          <line x1="180" y1="176" x2="180" y2="154" stroke="#34d399" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <circle cx="180" cy="154" r="2.6" fill="#34d399" />

          {/* Opaque #0a192f Callouts & Pins */}
          <CalloutPin x={22} y={23} num={1} variant="cyan" />
          <CadLabel x={39} y={23} align="start" text="DBL TRIMMERS (FULL)" fontSize={8.1} padX={4} color="#67e8f9" borderColor="#0284c7" />

          <CalloutPin x={160} y={23} num={2} variant="amber" />
          <CadLabel x={177} y={23} align="start" text="DBL HEADERS (> 1.2m)" fontSize={8.1} padX={4} color="#fde68a" borderColor="#d97706" />

          <CalloutPin x={42} y={184} num={3} variant="emerald" />
          <CadLabel x={59} y={184} align="start" text="TAIL JOISTS + METAL HANGERS" fontSize={8.2} padX={4} color="#6ee7b7" borderColor="#059669" />
        </g>
      )
    }
  }

  // 12E. S2.0 DETAIL 5 / 6 — SUBFLOOR SHEATHING (T&G) (STAGGERED 4'x8', GLUE-NAIL & T&G JOINT)
  if (key.includes('subfloor sheathing') || key.includes('t&g')) {
    return {
      scaleLabel: 'DETAIL SCALE: T&G SUBFLOOR LAYOUT & GLUE-NAIL (S2.0)',
      keys: [
        '① Perpendicular Face Grain & Staggered Joints: Long 8\' dimension runs across joists with 4\' staggered end joints landed on joist centers',
        '② Glue-Nailed Composite Action (NBC 9.23.3.5): Elastomeric subfloor adhesive + 51mm (2") ring-shank nails (6" edges / 12" field) prevent floor squeaks and boost stiffness',
        '③ T&G Edge Support: Unsupported subfloor edges between joists must have Tongue-and-Groove (T&G) profiles or 2x4 solid blocking underneath'
      ],
      renderSvg: () => (
        <g>
          {/* Underlying Floor Joists @ 16" O.C. */}
          {[22, 57, 92, 128, 163, 198, 234].map((jx, i) => (
            <line key={i} x1={jx} y1="46" x2={jx} y2="158" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 2" />
          ))}

          {/* ① Staggered 4'x8' T&G Subfloor Sheets Laid Perpendicular to Joists */}
          <rect x="22" y="50" width="141" height="52" fill="#0f243c" stroke="#38bdf8" strokeWidth="2" />
          <rect x="163" y="50" width="71" height="52" fill="#162a45" stroke="#38bdf8" strokeWidth="2" />
          <rect x="22" y="102" width="70" height="52" fill="#162a45" stroke="#38bdf8" strokeWidth="2" />
          <rect x="92" y="102" width="142" height="52" fill="#0f243c" stroke="#38bdf8" strokeWidth="2" />

          {/* Highlight Staggered 4' End Joints & Face-Grain Strength Arrow */}
          <line x1="163" y1="50" x2="163" y2="102" stroke="#67e8f9" strokeWidth="3" />
          <line x1="92" y1="102" x2="92" y2="154" stroke="#67e8f9" strokeWidth="3" />
          <line x1="38" y1="76" x2="146" y2="76" stroke="#22d3ee" strokeWidth="2" />
          <polygon points="36,76 44,72.5 44,79.5" fill="#22d3ee" />
          <polygon points="148,76 140,72.5 140,79.5" fill="#22d3ee" />

          {/* ② 6" Edge Nails vs 12" Field Nails + Wavy Adhesive Bead */}
          {[108, 117, 126, 135, 144, 150].map((ny, i) => (
            <circle key={i} cx="92" cy={ny} r="1.9" fill="#fbbf24" />
          ))}
          {[112, 128, 144].map((ny, i) => (
            <circle key={i} cx="128" cy={ny} r="1.9" fill="#cbd5e1" />
          ))}
          <path d="M 198 106 Q 202 114 198 122 Q 194 130 198 138 Q 202 146 198 152" fill="none" stroke="#fbbf24" strokeWidth="2.2" />

          {/* ③ Right Inset: Zoomed Tongue-and-Groove (T&G) Edge + Adhesive + Ring-Shank Nail */}
          <rect x="246" y="50" width="100" height="104" rx="4" fill="#0f243c" stroke="#10b981" strokeWidth="1.8" />
          {/* Left Tongue Panel + Right Groove Panel */}
          <path d="M 252 93 L 292 93 L 292 98 L 299 98 L 299 103 L 292 103 L 292 108 L 252 108 Z" fill="#1e293b" stroke="#34d399" strokeWidth="1.5" />
          <path d="M 295 93 L 340 93 L 340 108 L 295 108 L 295 104 L 301 104 L 301 97 L 295 97 Z" fill="#1e293b" stroke="#34d399" strokeWidth="1.5" />
          {/* Joist Below + Glue Bead + Flush Ring-Shank Nail */}
          <rect x="282" y="111" width="24" height="35" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.6" />
          <circle cx="294" cy="110" r="3.2" fill="#fbbf24" />
          <line x1="289" y1="93" x2="289" y2="135" stroke="#f8fafc" strokeWidth="1.8" />
          <line x1="285" y1="93" x2="293" y2="93" stroke="#f8fafc" strokeWidth="2" />
          <CadLabel x={296} y={65} text="T&G + GLUE" fontSize={8} padX={3.5} color="#6ee7b7" borderColor="#059669" />

          {/* Non-Crossing Leader Lines */}
          <line x1="112" y1="30" x2="112" y2="50" stroke="#22d3ee" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <line x1="284" y1="30" x2="284" y2="50" stroke="#34d399" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <line x1="92" y1="176" x2="92" y2="154" stroke="#fbbf24" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <circle cx="92" cy="154" r="2.6" fill="#fbbf24" />

          {/* Opaque #0a192f Callouts & Pins */}
          <CalloutPin x={22} y={23} num={1} variant="cyan" />
          <CadLabel x={39} y={23} align="start" text="STAGGER 4'x8' PERP TO JOISTS" fontSize={8.1} padX={4} color="#67e8f9" borderColor="#0284c7" />

          <CalloutPin x={204} y={23} num={3} variant="emerald" />
          <CadLabel x={221} y={23} align="start" text="T&G EDGE JOINT" fontSize={8.1} padX={4} color="#6ee7b7" borderColor="#059669" />

          <CalloutPin x={22} y={184} num={2} variant="amber" />
          <CadLabel x={39} y={184} align="start" text="CGSB GLUE + 2&quot; NAILS (6&quot; EDGE / 12&quot; FIELD)" fontSize={8.1} padX={4} color="#fde68a" borderColor="#d97706" />
        </g>
      )
    }
  }

  // 12F. S2.0 DETAIL 6 / 6 — LVL BEAM (3-PLY ENGINEERED GIRDER, PLY BOLTING & CONCRETE BEAM POCKET)
  if (key.includes('lvl beam') || key.includes('lvl')) {
    return {
      scaleLabel: 'DETAIL SCALE: 3-PLY LVL GIRDER & BEAM POCKET (S2.0)',
      keys: [
        '① Engineered LVL Girder (2.0E): Laminated Veneer Lumber carries heavy tributary spans without shrinking, warping, or checking',
        '② Multi-Ply Lamination Rule: Side-loaded multi-ply LVL beams must be nailed/bolted/screwed per manufacturer schedule so all plies share the load equally',
        '③ Concrete Beam Pocket (NBC 9.23.8.1): Requires min 89mm (3-1/2") end bearing with 12mm (1/2") air gap at sides/ends (or moisture barrier) to prevent rot'
      ],
      renderSvg: () => (
        <g>
          {/* Center Split Divider */}
          <line x1="154" y1="44" x2="154" y2="162" stroke="#334155" strokeWidth="1.2" strokeDasharray="4 3" />

          {/* ① Left Pane: 3-Ply 1-3/4" x 11-7/8" LVL Cross-Section (5-1/4" Total Width) */}
          {[52, 72, 92].map((px, idx) => (
            <g key={idx}>
              <rect x={px} y="52" width="20" height="92" fill="#2b1c14" stroke="#f59e0b" strokeWidth="2" />
              {[62, 76, 90, 104, 118, 132].map((vy, vi) => (
                <line key={vi} x1={px + 2} y1={vy} x2={px + 18} y2={vy} stroke="#fbbf24" strokeWidth="0.8" strokeOpacity="0.45" />
              ))}
            </g>
          ))}

          {/* ② 3 Rows of Multi-Ply Through-Bolts / SDS Screws / 3-1/4" Nails */}
          {[68, 98, 128].map((by, idx) => (
            <g key={idx}>
              <line x1="46" y1={by} x2="118" y2={by} stroke="#22d3ee" strokeWidth="2.4" />
              <rect x="44" y={by - 3.5} width="5" height="7" fill="#67e8f9" />
              <rect x="115" y={by - 3.5} width="5" height="7" fill="#67e8f9" />
            </g>
          ))}
          <line x1="52" y1="152" x2="112" y2="152" stroke="#fbbf24" strokeWidth="1.8" />
          <text x="82" y="164" fill="#fde68a" fontSize="7.8" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
            5-1/4&quot;
          </text>

          {/* ③ Right Pane: Foundation Concrete Beam Pocket (>= 89mm / 3.5" Bearing + 12mm Air Gap) */}
          <path
            d="M 256 126 L 312 126 L 312 50 L 336 50 L 336 156 L 256 156 Z"
            fill="#334155"
            stroke="#94a3b8"
            strokeWidth="1.8"
          />
          {/* Sill Gasket / Bearing Pad */}
          <rect x="256" y="122" width="46" height="4" fill="#34d399" />
          {/* 12mm (1/2") Air Clearance at Pocket End */}
          <rect x="302" y="58" width="10" height="64" fill="#06b6d4" fillOpacity="0.28" stroke="#22d3ee" strokeWidth="1.2" strokeDasharray="3 2" />
          {/* LVL Girder Seated in Pocket */}
          <rect x="174" y="58" width="128" height="64" fill="#2b1c14" stroke="#f59e0b" strokeWidth="2.2" />
          {[70, 82, 94, 106].map((ly, i) => (
            <line key={i} x1="176" y1={ly} x2="300" y2={ly} stroke="#fbbf24" strokeWidth="0.9" strokeOpacity="0.4" />
          ))}

          {/* >= 89mm (3-1/2") Bearing Arrow */}
          <line x1="256" y1="130" x2="256" y2="146" stroke="#34d399" strokeWidth="1.4" />
          <line x1="302" y1="130" x2="302" y2="146" stroke="#34d399" strokeWidth="1.4" />
          <line x1="256" y1="140" x2="302" y2="140" stroke="#34d399" strokeWidth="2.2" />

          {/* Non-Crossing Leader Lines */}
          <line x1="82" y1="30" x2="82" y2="52" stroke="#fbbf24" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <line x1="46" y1="176" x2="46" y2="132" stroke="#22d3ee" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <circle cx="46" cy="132" r="2.4" fill="#22d3ee" />
          <line x1="307" y1="30" x2="307" y2="58" stroke="#34d399" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <line x1="279" y1="176" x2="279" y2="140" stroke="#34d399" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <circle cx="279" cy="140" r="2.6" fill="#34d399" />

          {/* Opaque #0a192f Callouts & Pins */}
          <CalloutPin x={22} y={23} num={1} variant="amber" />
          <CadLabel x={39} y={23} align="start" text="3-PLY 1-3/4&quot;x11-7/8&quot; LVL" fontSize={8.1} padX={4} color="#fde68a" borderColor="#d97706" />

          <CalloutPin x={184} y={23} num={3} variant="emerald" />
          <CadLabel x={201} y={23} align="start" text="89mm BEARING + 12mm GAP" fontSize={8.1} padX={4} color="#6ee7b7" borderColor="#059669" />

          <CalloutPin x={22} y={184} num={2} variant="cyan" />
          <CadLabel x={39} y={184} align="start" text="3 ROWS NAILS @ 12&quot; OR BOLTS" fontSize={8.1} padX={4} color="#67e8f9" borderColor="#0284c7" />

          <CadLabel x={282} y={184} text=">= 89mm (3-1/2&quot;) SEAT" fontSize={8.1} padX={4} color="#6ee7b7" borderColor="#059669" />
        </g>
      )
    }
  }

  // 13A. SP1 DETAIL 1 / 4 — BATTER BOARDS (EXCAVATION SETBACK, STRING LINES & 3-4-5 SQUARING)
  if (key.includes('batter board')) {
    return {
      scaleLabel: 'DETAIL SCALE: CORNER BATTER BOARDS & 3-4-5 SQUARING (SP1)',
      keys: [
        '① Batter Board Setback: Erected 1.2m–1.8m (4\'–6\') back from excavation edges so backhoe digging does not knock out layout stakes',
        '② String Line Saw Kerfs: Strings stretched across level batter board ledgers mark the exact outside face of the foundation wall',
        '③ 3-4-5 Squaring & Diagonals: Measure 3m (or 6\'), 4m (8\'), and 5m (10\' hypotenuse) plus equal corner-to-corner diagonals to prove 90° square'
      ],
      renderSvg: () => (
        <g>
          {/* Over-Dug Excavation Cut Line */}
          <polyline points="336,72 86,72 86,162" fill="none" stroke="#64748b" strokeWidth="1.5" strokeDasharray="5 3" />

          {/* Foundation Outside Wall Corner at (108, 88) */}
          <rect x="108" y="88" width="218" height="10" fill="#1e293b" stroke="#cbd5e1" strokeWidth="2" />
          <rect x="108" y="88" width="10" height="72" fill="#1e293b" stroke="#cbd5e1" strokeWidth="2" />

          {/* ① Green L-Shaped 2x4 / 2x6 Batter Boards Set 1.2m–1.8m Outside Excavation */}
          <line x1="92" y1="52" x2="138" y2="52" stroke="#10b981" strokeWidth="4" />
          <rect x="90" y="49" width="5" height="6" fill="#fde68a" />
          <rect x="135" y="49" width="5" height="6" fill="#fde68a" />

          <line x1="62" y1="72" x2="62" y2="112" stroke="#10b981" strokeWidth="4" />
          <rect x="59" y="70" width="6" height="5" fill="#fde68a" />
          <rect x="59" y="109" width="6" height="5" fill="#fde68a" />

          <line x1="336" y1="74" x2="336" y2="104" stroke="#10b981" strokeWidth="4" />
          <line x1="94" y1="164" x2="124" y2="164" stroke="#10b981" strokeWidth="4" />

          {/* 1.2m–1.8m Setback Arrow Between Batter Board & Excavation */}
          <line x1="64" y1="80" x2="86" y2="80" stroke="#34d399" strokeWidth="1.8" />

          {/* ② Taut Yellow Nylon String Lines Stretched Over Saw Kerfs + Plumb-Bob Target */}
          <line x1="60" y1="88" x2="338" y2="88" stroke="#fbbf24" strokeWidth="1.8" strokeDasharray="5 2.5" />
          <line x1="108" y1="50" x2="108" y2="166" stroke="#fbbf24" strokeWidth="1.8" strokeDasharray="5 2.5" />
          <circle cx="108" cy="88" r="5.5" fill="#0a192f" stroke="#fbbf24" strokeWidth="2" />
          <circle cx="108" cy="88" r="2" fill="#fde68a" />

          {/* ③ 3-4-5 Right Triangle (54px : 72px : 90px) + Equal Corner Diagonals */}
          <polygon points="108,88 180,88 108,142" fill="#06b6d4" fillOpacity="0.22" stroke="#22d3ee" strokeWidth="2.2" />
          <polyline points="108,99 119,99 119,88" fill="none" stroke="#fde68a" strokeWidth="1.4" />
          <text x="158" y="83" fill="#fde68a" fontSize="7.8" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
            4m (8&apos;)
          </text>
          <text x="95" y="122" fill="#fde68a" fontSize="7.8" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
            3m
          </text>

          {/* Equal Diagonals Check */}
          <line x1="226" y1="102" x2="320" y2="154" stroke="#94a3b8" strokeWidth="1.4" strokeDasharray="4 3" />
          <line x1="320" y1="102" x2="226" y2="154" stroke="#94a3b8" strokeWidth="1.4" strokeDasharray="4 3" />

          {/* Non-Crossing Leader Lines */}
          <line x1="62" y1="29" x2="62" y2="70" stroke="#34d399" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <polyline points="150,54 126,68 113,84" fill="none" stroke="#fbbf24" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <line x1="166" y1="177" x2="166" y2="130" stroke="#22d3ee" strokeWidth="1.6" strokeDasharray="3 2.5" />

          {/* Opaque #0a192f Callouts & Pins */}
          <CadLabel x={166} y={122} text="5m (10') HYPOT" fontSize={7.9} padX={3.5} color="#67e8f9" borderColor="#0284c7" />
          <CadLabel x={274} y={128} text="DIAG D1 = D2" fontSize={7.9} padX={3.5} color="#fde68a" borderColor="#d97706" />

          <CalloutPin x={22} y={22} num={1} variant="emerald" />
          <CadLabel x={39} y={22} align="start" text="BATTER BOARDS: 1.2-1.8m OUTSIDE CUT" fontSize={8.1} padX={4} color="#6ee7b7" borderColor="#059669" />

          <CalloutPin x={162} y={48} num={2} variant="amber" />
          <CadLabel x={179} y={48} align="start" text="STRINGS = EXACT WALL CORNER" fontSize={8.1} padX={4} color="#fde68a" borderColor="#d97706" />

          <CalloutPin x={22} y={185} num={3} variant="cyan" />
          <CadLabel x={39} y={185} align="start" text="3-4-5 TRIANGLE + EQUAL DIAGONALS" fontSize={8.2} padX={4} color="#67e8f9" borderColor="#0284c7" />
        </g>
      )
    }
  }

  // 13B. SP1 DETAIL 2 / 4 — BUILDING SETBACK (PROPERTY LINE SYMBOL, ZONING SETBACKS & EAVE PROJECTION)
  if (key.includes('setback')) {
    return {
      scaleLabel: 'DETAIL SCALE: PROPERTY LINE & ZONING SETBACKS (SP1)',
      keys: [
        '① Property Line Symbol (─── · · ───): Long-dash, double-short-dash line with bearing angles (e.g., N 89°45\' E) and lot dimensions',
        '② Municipal Zoning Setbacks: Minimum legal perpendicular distance from property boundaries to the building footprint',
        '③ NBC Spatial Separation (9.10.15): Closer side-yard setbacks (< 1.2m / 4\') restrict window area (limiting distance) and require fire-rated exterior walls/soffits'
      ],
      renderSvg: () => (
        <g>
          {/* ① Official Phantom Property Lines (─── · · ───) + Survey Iron Pins */}
          <line x1="36" y1="46" x2="342" y2="46" stroke="#f43f5e" strokeWidth="2.4" strokeDasharray="16 4 3 4 3 4" />
          <line x1="36" y1="46" x2="36" y2="162" stroke="#f43f5e" strokeWidth="2.4" strokeDasharray="16 4 3 4 3 4" />
          {[
            [36, 46],
            [342, 46],
            [36, 162]
          ].map(([px, py], i) => (
            <g key={i}>
              <circle cx={px} cy={py} r="4.8" fill="#0a192f" stroke="#fda4af" strokeWidth="1.8" />
              <circle cx={px} cy={py} r="1.6" fill="#fda4af" />
            </g>
          ))}
          <text x="278" y="40" fill="#fda4af" fontSize="7.8" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
            N 89°45&apos; E
          </text>

          {/* ③ Dashed Roof Eave Overhang Projection + Solid Foundation Footprint */}
          <rect x="140" y="90" width="200" height="76" fill="none" stroke="#fbbf24" strokeWidth="1.6" strokeDasharray="4 3" />
          <rect x="152" y="102" width="180" height="58" fill="#0f243c" stroke="#f8fafc" strokeWidth="2.4" />
          <text x="242" y="135" fill="#94a3b8" fontSize="8.4" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
            DWELLING FOOTPRINT
          </text>

          {/* ② Perpendicular Front (7.5m) & Side Yard (1.5m) Setback Arrows */}
          <line x1="216" y1="46" x2="216" y2="102" stroke="#22d3ee" strokeWidth="2.2" />
          <polygon points="216,46 212.5,53 219.5,53" fill="#22d3ee" />
          <polygon points="216,102 212.5,95 219.5,95" fill="#22d3ee" />

          <line x1="36" y1="132" x2="152" y2="132" stroke="#22d3ee" strokeWidth="2.2" />
          <polygon points="36,132 43,128.5 43,135.5" fill="#22d3ee" />
          <polygon points="152,132 145,128.5 145,135.5" fill="#22d3ee" />

          {/* Non-Crossing Leader Lines */}
          <line x1="104" y1="29" x2="104" y2="46" stroke="#f43f5e" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <circle cx="104" cy="46" r="2.6" fill="#fda4af" />

          <line x1="72" y1="72" x2="216" y2="72" stroke="#22d3ee" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <circle cx="216" cy="72" r="2.6" fill="#22d3ee" />
          <line x1="60" y1="84" x2="60" y2="132" stroke="#22d3ee" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <circle cx="60" cy="132" r="2.6" fill="#22d3ee" />

          <line x1="140" y1="177" x2="140" y2="166" stroke="#fbbf24" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <circle cx="140" cy="166" r="2.6" fill="#fbbf24" />

          {/* Opaque #0a192f Callouts & Pins (Zero Overlap With Footprint Corners) */}
          <CadLabel x={224} y={72} align="start" text="7.5m FRONT SETBACK" fontSize={8} padX={3.5} color="#67e8f9" borderColor="#0284c7" />
          <CadLabel x={92} y={114} text="1.5m SIDE" fontSize={8} padX={3.5} color="#67e8f9" borderColor="#0284c7" />

          <CalloutPin x={22} y={22} num={1} variant="amber" />
          <CadLabel x={39} y={22} align="start" text="PROPERTY LINE (─── · · ───) + PIN" fontSize={8.1} padX={4} color="#fda4af" borderColor="#f43f5e" />

          <CalloutPin x={60} y={72} num={2} variant="cyan" />

          <CalloutPin x={22} y={185} num={3} variant="emerald" />
          <CadLabel x={39} y={185} align="start" text="CHECK WALL VS EAVE OVERHANG SETBACK" fontSize={8.1} padX={4} color="#fde68a" borderColor="#d97706" />
        </g>
      )
    }
  }

  // 13C. SP1 DETAIL 3 / 4 — BENCHMARK ELEVATION (SURVEY LOOP: HI = BM + BS & ELEV = HI - FS)
  if (key.includes('benchmark')) {
    return {
      scaleLabel: 'DETAIL SCALE: LEVEL LOOP — HI = BM + BS & ELEV = HI - FS',
      keys: [
        '① Site Benchmark (BM 100.00m): Permanent fixed elevation datum on SP1 (hydrant, manhole rim, or iron pin)',
        '② Height of Instrument (HI = BM + BS): Add the Backsight (BS) rod reading taken on the Benchmark to establish the level\'s line-of-sight height',
        '③ Target Elevation (Elev = HI - FS): Subtract the Foresight (FS) rod reading from HI to find any footing, wall, or grade elevation'
      ],
      renderSvg: () => (
        <g>
          {/* Street Grade + Excavation Bank + Footing Trench Profile */}
          <polyline points="18,124 208,124 234,158 342,158" fill="none" stroke="#94a3b8" strokeWidth="2.4" />
          <rect x="268" y="148" width="52" height="10" fill="#334155" stroke="#cbd5e1" strokeWidth="1.8" />

          {/* ① Fixed Benchmark Monument (BM = 100.00m) + Backsight Rod (BS = +1.52m) */}
          <circle cx="24" cy="108" r="6" fill="#0a192f" stroke="#22d3ee" strokeWidth="1.8" />
          <line x1="16" y1="108" x2="32" y2="108" stroke="#22d3ee" strokeWidth="1.4" />
          <line x1="24" y1="100" x2="24" y2="116" stroke="#22d3ee" strokeWidth="1.4" />
          <rect x="36" y="116" width="20" height="8" rx="1.5" fill="#f59e0b" stroke="#fde68a" strokeWidth="1.3" />
          <rect x="43" y="62" width="6" height="54" fill="#f8fafc" stroke="#0284c7" strokeWidth="1.3" />
          <line x1="58" y1="116" x2="58" y2="74" stroke="#22d3ee" strokeWidth="2" />
          <polygon points="58,74 54.8,80 61.2,80" fill="#22d3ee" />

          {/* ② Builder's Level / Rotary Laser on Tripod + Horizontal Line of Sight (HI = 101.52m @ y=74) */}
          <line x1="166" y1="79" x2="148" y2="124" stroke="#fbbf24" strokeWidth="2.2" />
          <line x1="166" y1="79" x2="166" y2="124" stroke="#fbbf24" strokeWidth="2.2" />
          <line x1="166" y1="79" x2="184" y2="124" stroke="#fbbf24" strokeWidth="2.2" />
          <rect x="154" y="69" width="24" height="10" rx="2" fill="#f59e0b" stroke="#fef08a" strokeWidth="1.5" />

          <line x1="49" y1="74" x2="154" y2="74" stroke="#ef4444" strokeWidth="2.2" strokeDasharray="5 3" />
          <line x1="178" y1="74" x2="291" y2="74" stroke="#ef4444" strokeWidth="2.2" strokeDasharray="5 3" />

          {/* ③ Foresight Rod (FS = -2.40m) Standing on Top of Footing (T.O.F. = 99.12m) */}
          <rect x="291" y="62" width="6" height="86" fill="#f8fafc" stroke="#059669" strokeWidth="1.3" />
          <line x1="280" y1="74" x2="280" y2="148" stroke="#34d399" strokeWidth="2" />
          <polygon points="280,148 276.8,142 283.2,142" fill="#34d399" />

          {/* Non-Crossing Leader Lines */}
          <line x1="166" y1="29" x2="166" y2="69" stroke="#fbbf24" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <line x1="46" y1="146" x2="46" y2="124" stroke="#22d3ee" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <circle cx="46" cy="124" r="2.6" fill="#22d3ee" />
          <polyline points="214,185 294,185 294,158" fill="none" stroke="#34d399" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <circle cx="294" cy="158" r="2.6" fill="#34d399" />

          {/* Opaque #0a192f Callouts & Pins */}
          <CadLabel x={96} y={96} text="BS +1.52m" fontSize={8} padX={3.5} color="#67e8f9" borderColor="#0284c7" />
          <CadLabel x={242} y={106} text="FS -2.40m" fontSize={8} padX={3.5} color="#6ee7b7" borderColor="#059669" />

          <CalloutPin x={54} y={22} num={2} variant="amber" />
          <CadLabel x={71} y={22} align="start" text="HI = BM + BS (101.52m LINE OF SIGHT)" fontSize={8.1} padX={4} color="#fde68a" borderColor="#d97706" />

          <CalloutPin x={22} y={154} num={1} variant="cyan" />
          <CadLabel x={39} y={154} align="start" text="BM = 100.00m DATUM" fontSize={8.1} padX={4} color="#67e8f9" borderColor="#0284c7" />

          <CalloutPin x={64} y={185} num={3} variant="emerald" />
          <CadLabel x={81} y={185} align="start" text="T.O.F. = HI - FS (99.12m)" fontSize={8.2} padX={4} color="#6ee7b7" borderColor="#059669" />
        </g>
      )
    }
  }

  // 13D. SP1 DETAIL 4 / 4 — SURFACE DRAINAGE (GRADING) (POSITIVE AWAY-SLOPE, SWALE & CONTOURS)
  if (key.includes('surface drainage') || key.includes('grading')) {
    return {
      scaleLabel: 'DETAIL SCALE: POSITIVE GRADING, SWALE & CONTOURS (SP1)',
      keys: [
        '① Positive Perimeter Grading (NBC 9.14.6.1): Site must be graded so surface water drains away from the building (~5% slope in first 2m to allow for backfill settlement)',
        '② Swale & Runoff Arrows: Arrows on SP1 indicate swale flow paths toward storm ditches or catch basins without flooding neighboring lots',
        '③ Existing vs. Proposed Contours: Dashed contour lines show original topography; solid contour lines show final finished grading elevations'
      ],
      renderSvg: () => (
        <g>
          {/* Left Pane: Foundation Wall + >= 200mm (8") Siding Clearance + Positive Away-Slope */}
          <rect x="24" y="64" width="22" height="94" fill="#334155" stroke="#94a3b8" strokeWidth="1.8" />
          <rect x="26" y="44" width="18" height="34" fill="#1e293b" stroke="#fbbf24" strokeWidth="1.8" />

          {/* Backfill Soil Wedge & Finished Grade Sloping Away */}
          <polygon points="46,102 188,126 188,158 46,158" fill="#0f243c" />
          <line x1="46" y1="102" x2="152" y2="102" stroke="#64748b" strokeWidth="1.3" strokeDasharray="3 2" />
          <line x1="46" y1="102" x2="188" y2="126" stroke="#10b981" strokeWidth="3" />

          {/* ① Positive Slope Arrow Away From Foundation */}
          <line x1="68" y1="92" x2="176" y2="110.5" stroke="#34d399" strokeWidth="2.4" />
          <polygon points="180,111.2 171.5,106.5 170.5,113" fill="#34d399" />

          {/* >= 200mm (8") Siding-to-Grade Clearance Bracket */}
          <line x1="46" y1="78" x2="62" y2="78" stroke="#fbbf24" strokeWidth="1.4" />
          <line x1="56" y1="78" x2="56" y2="102" stroke="#fbbf24" strokeWidth="2" />

          {/* Right Pane: SP1 Grading Plan Inset (Existing vs Proposed Contours + Swale Arrow) */}
          <rect x="206" y="48" width="140" height="110" rx="4" fill="#0f243c" stroke="#334155" strokeWidth="1.6" />
          <path d="M 214 86 Q 276 78 338 88" fill="none" stroke="#94a3b8" strokeWidth="1.6" strokeDasharray="5 3" />
          <path d="M 214 116 Q 276 108 338 118" fill="none" stroke="#38bdf8" strokeWidth="2" />

          {/* ② Wavy Drainage Swale Runoff Arrow (~~~>) */}
          <path d="M 218 142 Q 236 136 254 142 T 290 142 T 324 142" fill="none" stroke="#22d3ee" strokeWidth="2.6" />
          <polygon points="334,142 324,137.5 324,146.5" fill="#22d3ee" />

          {/* Non-Crossing Leader Lines */}
          <line x1="162" y1="29" x2="162" y2="108" stroke="#34d399" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <circle cx="162" cy="108" r="2.6" fill="#34d399" />

          <line x1="276" y1="29" x2="276" y2="48" stroke="#fbbf24" strokeWidth="1.6" strokeDasharray="3 2.5" />

          <line x1="254" y1="177" x2="254" y2="142" stroke="#22d3ee" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <circle cx="254" cy="142" r="2.6" fill="#22d3ee" />

          {/* Opaque #0a192f Callouts & Pins */}
          <CadLabel x={108} y={72} text=">= 200mm (8&quot;)" fontSize={7.9} padX={3.5} color="#fde68a" borderColor="#d97706" />
          <CadLabel x={276} y={64} text="-- EXIST 99.5m --" fontSize={7.6} padX={3} color="#cbd5e1" borderColor="#475569" />
          <CadLabel x={276} y={98} text="── PROP 100.0m ──" fontSize={7.6} padX={3} color="#67e8f9" borderColor="#0284c7" />

          <CalloutPin x={22} y={22} num={1} variant="emerald" />
          <CadLabel x={39} y={22} align="start" text="POSITIVE SLOPE AWAY (FIRST 2.0m)" fontSize={8.1} padX={4} color="#6ee7b7" borderColor="#059669" />

          <CalloutPin x={222} y={22} num={3} variant="amber" />
          <CadLabel x={239} y={22} align="start" text="CONTOURS + 8&quot; CLEAR" fontSize={8} padX={3.5} color="#fde68a" borderColor="#d97706" />

          <CalloutPin x={44} y={185} num={2} variant="cyan" />
          <CadLabel x={61} y={185} align="start" text="SWALE ARROW (~~~>) MIN 1.5-2% TO STREET" fontSize={8.1} padX={4} color="#67e8f9" borderColor="#0284c7" />
        </g>
      )
    }
  }

  // 14A. R1.0 DETAIL 1 / 7 — RIDGE BOARD (FULL PLUMB CUT BEARING, ALIGNMENT & < 4:12 SUPPORT)
  if (key.includes('ridge board')) {
    return {
      scaleLabel: 'DETAIL SCALE: RIDGE PLUMB CUT & 1-SIZE DEEPER RULE (R1.0)',
      keys: [
        '① 1-Size Deeper Rule (NBC 9.23.14.8): Because the angled plumb cut is longer than the rafter\'s square depth, a 2x8 rafter requires a 2x10 (38x235mm or 19x235mm) ridge board',
        '② Opposing Rafter Alignment: Common rafters must land directly opposite each other (or within 1x thickness) so horizontal thrust cancels out',
        '③ Low-Slope Support Rule (< 4:12): Roofs with pitch < 4:12 must have the ridge vertically supported by bearing walls, posts, or dwarf walls at <= 1.2m intervals'
      ],
      renderSvg: () => (
        <g>
          {/* ① Vertical 2x10 Ridge Board (Deeper Than 2x8 Angled Plumb Cut) */}
          <rect x="115" y="54" width="14" height="62" fill="#3f1d2e" stroke="#ef4444" strokeWidth="2.2" />
          <line x1="115" y1="54" x2="129" y2="116" stroke="#fca5a5" strokeWidth="1" strokeOpacity="0.6" />
          <line x1="129" y1="54" x2="115" y2="116" stroke="#fca5a5" strokeWidth="1" strokeOpacity="0.6" />

          {/* Left & Right 2x8 Common Rafters Aligned Directly Opposite */}
          <polygon points="24,100 115,54.5 115,102.5 24,148" fill="#1e293b" stroke="#f59e0b" strokeWidth="2.2" />
          <polygon points="129,54.5 220,100 220,148 129,102.5" fill="#1e293b" stroke="#f59e0b" strokeWidth="2.2" />

          {/* ② Opposing Balanced Thrust Arrows + 3-1/2" Toe-Nails */}
          <line x1="78" y1="84" x2="108" y2="84" stroke="#22d3ee" strokeWidth="2" />
          <polygon points="111,84 104,80.5 104,87.5" fill="#22d3ee" />
          <line x1="166" y1="84" x2="136" y2="84" stroke="#22d3ee" strokeWidth="2" />
          <polygon points="133,84 140,80.5 140,87.5" fill="#22d3ee" />
          <line x1="104" y1="62" x2="121" y2="74" stroke="#fde68a" strokeWidth="1.6" strokeDasharray="3 1.5" />
          <line x1="140" y1="62" x2="123" y2="74" stroke="#fde68a" strokeWidth="1.6" strokeDasharray="3 1.5" />
          <text x="122" y="130" fill="#fca5a5" fontSize="8" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
            2x10 RIDGE
          </text>

          {/* ③ Right Inset: Slope < 4:12 Requires Vertical Ridge Support */}
          <rect x="236" y="50" width="110" height="104" rx="4" fill="#0f243c" stroke="#10b981" strokeWidth="1.8" />
          <line x1="244" y1="90" x2="287" y2="78" stroke="#f59e0b" strokeWidth="3.5" />
          <line x1="338" y1="90" x2="295" y2="78" stroke="#f59e0b" strokeWidth="3.5" />
          <rect x="286" y="75" width="10" height="18" fill="#ef4444" stroke="#fca5a5" strokeWidth="1.2" />
          <rect x="288" y="93" width="6" height="47" fill="#34d399" />
          <line x1="246" y1="140" x2="336" y2="140" stroke="#94a3b8" strokeWidth="2" />
          <text x="316" y="122" fill="#a7f3d0" fontSize="7.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
            POST
          </text>
          <CadLabel x={291} y={62} text="SLOPE < 4:12" fontSize={7.8} padX={3.5} color="#6ee7b7" borderColor="#059669" />

          {/* Non-Crossing Leader Lines */}
          <line x1="122" y1="29" x2="122" y2="54" stroke="#ef4444" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <line x1="284" y1="29" x2="284" y2="50" stroke="#34d399" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <line x1="122" y1="176" x2="122" y2="136" stroke="#22d3ee" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <circle cx="122" cy="136" r="2.6" fill="#22d3ee" />

          {/* Opaque #0a192f Callouts & Pins */}
          <CalloutPin x={22} y={22} num={1} variant="amber" />
          <CadLabel x={39} y={22} align="start" text="RIDGE >= PLUMB CUT (+1 SIZE)" fontSize={8.1} padX={4} color="#fca5a5" borderColor="#ef4444" />

          <CalloutPin x={202} y={22} num={3} variant="emerald" />
          <CadLabel x={219} y={22} align="start" text="< 4:12 = SUPPORTED" fontSize={8} padX={3.5} color="#6ee7b7" borderColor="#059669" />

          <CalloutPin x={22} y={184} num={2} variant="cyan" />
          <CadLabel x={39} y={184} align="start" text="ALIGN OPPOSITE RAFTERS (BALANCED THRUST)" fontSize={8.1} padX={4} color="#67e8f9" borderColor="#0284c7" />
        </g>
      )
    }
  }

  // 14B. R1.0 DETAIL 2 / 7 — COLLAR TIES (UPPER-1/3 COLLAR TIE VS CEILING JOIST RAFTER TIE)
  if (key.includes('collar tie')) {
    return {
      scaleLabel: 'DETAIL SCALE: UPPER-1/3 COLLAR TIE VS RAFTER TIE (R1.0)',
      keys: [
        '① Upper 1/3 Placement (NBC 9.23.14.10): Collar ties (min 38x89mm / 2x4) sit in the upper third of the attic to prevent rafter sag and wind uplift separation',
        '② Collar Tie vs. Rafter Tie: Collar ties do NOT replace bottom ceiling joists; ceiling joists tied to rafters at the top plate resist outward eave spreading',
        '③ Nailing & Compression Bracing: Fasten each end with min 3× 76mm (3") nails; collar ties longer than 2.4m (8\') require a 1x4 continuous lateral brace at mid-span'
      ],
      renderSvg: () => (
        <g>
          {/* Wall Top Plates + ② Bottom 2x8 Ceiling Joist / Rafter Tie */}
          <rect x="34" y="146" width="20" height="14" fill="#1e293b" stroke="#cbd5e1" strokeWidth="1.8" />
          <rect x="206" y="146" width="20" height="14" fill="#1e293b" stroke="#cbd5e1" strokeWidth="1.8" />
          <rect x="34" y="138" width="192" height="8" fill="#451a03" stroke="#fbbf24" strokeWidth="2" />

          {/* Gable Rafter Triangle (Peak @ y=50, Plates @ y=146 -> Upper 1/3 = y=50..82) */}
          <line x1="28" y1="150" x2="130" y2="50" stroke="#f59e0b" strokeWidth="5.5" strokeLinecap="round" />
          <line x1="232" y1="150" x2="130" y2="50" stroke="#f59e0b" strokeWidth="5.5" strokeLinecap="round" />
          <rect x="126" y="46" width="8" height="18" fill="#ef4444" stroke="#fca5a5" strokeWidth="1.2" />

          {/* Upper 1/3 Boundary & ① Horizontal 2x4 Collar Tie */}
          <line x1="92" y1="82" x2="230" y2="82" stroke="#22d3ee" strokeWidth="1.2" strokeDasharray="3 2" />
          <rect x="98" y="73" width="64" height="7" fill="#083344" stroke="#22d3ee" strokeWidth="2" />

          {/* ③ 3x 3" End Nails + Mid-Span 1x4 Lateral Brace */}
          {[103, 106, 109, 151, 154, 157].map((nx, i) => (
            <circle key={i} cx={nx} cy="76.5" r="1.3" fill="#6ee7b7" />
          ))}
          <rect x="126" y="66" width="8" height="7" fill="#10b981" stroke="#a7f3d0" strokeWidth="1.2" />

          {/* Non-Crossing Leader Lines */}
          <polyline points="76,29 76,76 98,76" fill="none" stroke="#22d3ee" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <line x1="238" y1="69" x2="134" y2="69" stroke="#34d399" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <line x1="130" y1="176" x2="130" y2="146" stroke="#fbbf24" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <circle cx="130" cy="146" r="2.6" fill="#fbbf24" />

          {/* Opaque #0a192f Callouts & Pins */}
          <CalloutPin x={22} y={22} num={1} variant="cyan" />
          <CadLabel x={39} y={22} align="start" text="2x4 COLLAR TIE IN UPPER 1/3 (UPLIFT)" fontSize={8.1} padX={4} color="#67e8f9" borderColor="#0284c7" />

          <CalloutPin x={250} y={54} num={3} variant="emerald" />
          <CadLabel x={267} y={54} align="start" text="3x 3&quot; NAILS" fontSize={8} padX={3.5} color="#6ee7b7" borderColor="#059669" />
          <CadLabel x={244} y={76} align="start" text="1x4 BRACE > 2.4m" fontSize={8} padX={3.5} color="#a7f3d0" borderColor="#059669" />

          <CalloutPin x={22} y={184} num={2} variant="amber" />
          <CadLabel x={39} y={184} align="start" text="CEILING JOIST @ PLATE (STOPS SPREAD)" fontSize={8.1} padX={4} color="#fde68a" borderColor="#d97706" />
        </g>
      )
    }
  }

  // 14C. R1.0 DETAIL 3 / 7 — BIRDSMOUTH CUT (SEAT CUT, PLUMB HEEL CUT, HAP & FRAMING SQUARE)
  if (key.includes('birdsmouth cut')) {
    return {
      scaleLabel: 'DETAIL SCALE: BIRDSMOUTH SEAT/HEEL & HAP LAYOUT (R1.0)',
      keys: [
        '① Heel & Seat Geometry: The horizontal Seat Cut rests flat on the top plate (marked along the 12" tongue); the vertical Heel Cut butts flush against the outside wall face',
        '② Max 1/3 Notch Rule (NBC 9.23.14): Never cut deeper than 1/3 of the rafter depth so at least 2/3 (HAP — Height Above Plate) remains to carry the tail overhang',
        '③ Line Length vs. Measuring Line: Always measure common rafter length along the top edge (or Imaginary Measuring Line from the outer corner of the plate to the ridge)'
      ],
      renderSvg: () => (
        <g>
          {/* Dashed Wall Plate Reference Under Birdsmouth */}
          <rect x="116" y="120" width="28" height="34" fill="#0f243c" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 2" />

          {/* Sloped 2x10 Rafter Notched With 90° Birdsmouth (Seat y=120, Heel x=116) */}
          <polygon
            points="56,122 206,47 206,89 144,120 116,120 116,134 56,164"
            fill="#1e293b"
            stroke="#f59e0b"
            strokeWidth="2.2"
          />

          {/* ② Remaining >= 2/3 HAP (Height Above Plate) Vertical Bracket */}
          <line x1="98" y1="92" x2="116" y2="92" stroke="#34d399" strokeWidth="1.4" />
          <line x1="98" y1="120" x2="116" y2="120" stroke="#34d399" strokeWidth="1.4" />
          <line x1="104" y1="92" x2="104" y2="120" stroke="#34d399" strokeWidth="2.2" />
          <polygon points="104,92 101,98 107,98" fill="#34d399" />
          <polygon points="104,120 101,114 107,114" fill="#34d399" />

          {/* ③ Steel Framing Square Overlay (12" Run Tongue + Rise Body) */}
          <rect x="116" y="117" width="76" height="5" fill="#38bdf8" fillOpacity="0.88" stroke="#e0f2fe" strokeWidth="1" />
          <rect x="112" y="117" width="5" height="39" fill="#38bdf8" fillOpacity="0.88" stroke="#e0f2fe" strokeWidth="1" />

          {/* Non-Crossing Leader Lines */}
          <line x1="104" y1="30" x2="104" y2="92" stroke="#34d399" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <polyline points="210,72 164,104 134,117" fill="none" stroke="#fbbf24" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <line x1="176" y1="176" x2="176" y2="122" stroke="#22d3ee" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <circle cx="176" cy="122" r="2.6" fill="#22d3ee" />

          {/* Opaque #0a192f Callouts & Pins */}
          <CalloutPin x={22} y={23} num={2} variant="emerald" />
          <CadLabel x={39} y={23} align="start" text="NOTCH <= 1/3 • KEEP >= 2/3 HAP" fontSize={8.1} padX={4} color="#6ee7b7" borderColor="#059669" />

          <CalloutPin x={222} y={66} num={1} variant="amber" />
          <CadLabel x={239} y={56} align="start" text="LEVEL SEAT CUT" fontSize={8.1} padX={4} color="#fde68a" borderColor="#d97706" />
          <CadLabel x={239} y={77} align="start" text="+ PLUMB HEEL CUT" fontSize={8.1} padX={4} color="#ffffff" borderColor="#475569" />

          <CalloutPin x={22} y={184} num={3} variant="cyan" />
          <CadLabel x={39} y={184} align="start" text="FRAMING SQ: 12&quot; RUN TONGUE + RISE BODY" fontSize={8.1} padX={4} color="#67e8f9" borderColor="#0284c7" />
        </g>
      )
    }
  }

  // 14D. R1.0 DETAIL 4 / 7 — ATTIC VENTILATION (50/50 SOFFIT INTAKE + RIDGE EXHAUST & 1/300 RULE)
  if (key.includes('attic ventilation')) {
    return {
      scaleLabel: 'DETAIL SCALE: 50/50 SOFFIT-TO-RIDGE VENTING (NBC 9.19.1)',
      keys: [
        '① 1/300 vs. 1/150 Vent Ratio (NBC 9.19.1.1): Unobstructed net free vent area must be >= 1/300 of insulated ceiling area (or >= 1/150 for roofs < 1:6 / 2:12 slope or cathedral ceilings)',
        '② Balanced 50/50 Distribution: Split vents evenly between low soffit intake (~50%) and high ridge/gable exhaust (~50%) to prevent winter attic condensation and ice dams',
        '③ Min 63mm (2.5") Clear Airspace: Cathedral/flat roofs require at least 63mm (2-1/2") unobstructed air space between the top of the insulation and the underside of roof sheathing'
      ],
      renderSvg: () => (
        <g>
          {/* Exterior Walls, Ceiling Drywall & Attic Insulation */}
          <rect x="52" y="124" width="10" height="22" fill="#1e293b" stroke="#cbd5e1" strokeWidth="1.6" />
          <rect x="298" y="124" width="10" height="22" fill="#1e293b" stroke="#cbd5e1" strokeWidth="1.6" />
          <line x1="52" y1="138" x2="308" y2="138" stroke="#cbd5e1" strokeWidth="2" />
          <rect x="64" y="122" width="232" height="14" rx="2" fill="#f59e0b" fillOpacity="0.28" stroke="#f59e0b" strokeWidth="1.2" />

          {/* Perforated Vented Eave Soffits + Green Baffles */}
          <line x1="28" y1="124" x2="52" y2="124" stroke="#22d3ee" strokeWidth="2.5" strokeDasharray="3 2" />
          <line x1="308" y1="124" x2="332" y2="124" stroke="#22d3ee" strokeWidth="2.5" strokeDasharray="3 2" />
          <line x1="48" y1="118" x2="88" y2="99" stroke="#34d399" strokeWidth="2.4" />
          <line x1="312" y1="118" x2="272" y2="99" stroke="#34d399" strokeWidth="2.4" />

          {/* Sloped Roof Deck + Continuous Ridge Vent Hood */}
          <line x1="24" y1="120" x2="168" y2="58" stroke="#94a3b8" strokeWidth="3.4" />
          <line x1="336" y1="120" x2="192" y2="58" stroke="#94a3b8" strokeWidth="3.4" />
          <polyline points="158,56 180,46 202,56" fill="none" stroke="#fbbf24" strokeWidth="3" />

          {/* ① 50% Low Intake Arrows & ② 50% High Ridge Exhaust Arrows */}
          <polyline points="40,140 40,118 104,89" fill="none" stroke="#22d3ee" strokeWidth="2.3" />
          <polygon points="108,87 99,87.5 102,93.5" fill="#22d3ee" />
          <polyline points="320,140 320,118 256,89" fill="none" stroke="#22d3ee" strokeWidth="2.3" />
          <polygon points="252,87 261,87.5 258,93.5" fill="#22d3ee" />

          <path d="M 166,76 Q 174,62 156,51" fill="none" stroke="#fbbf24" strokeWidth="2.2" />
          <path d="M 194,76 Q 186,62 204,51" fill="none" stroke="#fbbf24" strokeWidth="2.2" />

          {/* Non-Crossing Leader Lines */}
          <line x1="180" y1="29" x2="180" y2="46" stroke="#fbbf24" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <line x1="40" y1="150" x2="40" y2="140" stroke="#22d3ee" strokeWidth="1.6" strokeDasharray="2.5 2" />
          <line x1="218" y1="177" x2="218" y2="112" stroke="#34d399" strokeWidth="1.6" strokeDasharray="3 2.5" />

          {/* Opaque #0a192f Callouts & Pins */}
          <CadLabel x={180} y={104} text=">= 1/300 (1/150 LOW)" fontSize={8} padX={4} color="#6ee7b7" borderColor="#059669" />

          <CalloutPin x={56} y={22} num={2} variant="amber" />
          <CadLabel x={73} y={22} align="start" text="50% HIGH EXHAUST @ RIDGE VENT" fontSize={8.2} padX={4} color="#fde68a" borderColor="#d97706" />

          <CalloutPin x={22} y={158} num={1} variant="cyan" />
          <CadLabel x={39} y={158} align="start" text="50% LOW SOFFIT INTAKE + BAFFLES" fontSize={8.1} padX={4} color="#67e8f9" borderColor="#0284c7" />

          <CalloutPin x={68} y={185} num={3} variant="emerald" />
          <CadLabel x={85} y={185} align="start" text="NBC 9.19.1: >= 1/300 AREA (1/150 CATHEDRAL)" fontSize={8} padX={4} color="#6ee7b7" borderColor="#059669" />
        </g>
      )
    }
  }

  // 14E. R1.0 DETAIL 5 / 7 — ROOF PITCH (SLOPE TRIANGLE 6/12, 12" COMMON VS 17" HIP & PITCH FORMULA)
  if (key.includes('roof pitch')) {
    return {
      scaleLabel: 'DETAIL SCALE: 6/12 SLOPE TRIANGLE & 12" VS 17" RUN (R1.0)',
      keys: [
        '① Slope Triangle Symbol (6:12): Indicates vertical rise in inches for every 12" (305mm) of horizontal run (or metric ratio 150:300 = 1:2)',
        '② 12" Common vs. 17" Hip/Valley Rule: Because a 45° hip/valley runs diagonally across a 12"×12" square (√(12²+12²) = 16.97"), always step off Hip/Valley rafters using 17" on the framing square instead of 12"',
        '③ Slope vs. Pitch Distinction: Slope = Rise / Run (6/12), whereas true fractional Pitch = Total Rise / Full Building Span (6 / 24 = 1/4 Pitch)'
      ],
      renderSvg: () => (
        <g>
          {/* Center Split Divider */}
          <line x1="162" y1="44" x2="162" y2="162" stroke="#334155" strokeWidth="1.2" strokeDasharray="4 3" />

          {/* ① Left Pane: Elevation Roof Slope + Architectural 6/12 Slope Triangle */}
          <line x1="24" y1="146" x2="148" y2="84" stroke="#f59e0b" strokeWidth="4" />
          <line x1="24" y1="146" x2="148" y2="146" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4 3" />
          <polygon points="48,78 112,78 48,110" fill="#0f243c" stroke="#22d3ee" strokeWidth="2.2" />
          <text x="80" y="72" fill="#67e8f9" fontSize="9.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
            12
          </text>
          <text x="36" y="98" fill="#67e8f9" fontSize="9.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
            6
          </text>

          {/* ② Right Pane: Top-Down Plan View of 90° Hip Roof Corner (12" Common vs 17" Hip) */}
          <polyline points="184,54 184,148 336,148" fill="none" stroke="#cbd5e1" strokeWidth="2.2" />
          <line x1="184" y1="72" x2="260" y2="72" stroke="#64748b" strokeWidth="1.3" strokeDasharray="3 2" />
          <line x1="260" y1="72" x2="336" y2="72" stroke="#ef4444" strokeWidth="3" />
          {/* Common Rafter (12" Base) & 45° Hip Rafter (17" / 16.97" Base) */}
          <line x1="260" y1="148" x2="260" y2="72" stroke="#22d3ee" strokeWidth="2.6" />
          <line x1="184" y1="148" x2="260" y2="72" stroke="#fbbf24" strokeWidth="3" />

          {/* Non-Crossing Leader Lines */}
          <line x1="80" y1="29" x2="80" y2="60" stroke="#22d3ee" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <line x1="238" y1="29" x2="238" y2="48" stroke="#fbbf24" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <line x1="110" y1="176" x2="110" y2="146" stroke="#34d399" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <circle cx="110" cy="146" r="2.6" fill="#34d399" />

          {/* Opaque #0a192f Callouts & Pins */}
          <CadLabel x={238} y={56} text="17&quot; (16.97&quot;) HIP" fontSize={7.8} padX={3.5} color="#fde68a" borderColor="#d97706" />
          <CadLabel x={302} y={108} text="12&quot; COMMON" fontSize={7.8} padX={3.5} color="#67e8f9" borderColor="#0284c7" />

          <CalloutPin x={22} y={22} num={1} variant="cyan" />
          <CadLabel x={39} y={22} align="start" text="SLOPE: 6/12 = 6&quot; RISE PER 12&quot;" fontSize={8} padX={3.5} color="#67e8f9" borderColor="#0284c7" />

          <CalloutPin x={206} y={22} num={2} variant="amber" />
          <CadLabel x={223} y={22} align="start" text="12&quot; COM VS 17&quot; HIP" fontSize={8} padX={3.5} color="#fde68a" borderColor="#d97706" />

          <CalloutPin x={22} y={184} num={3} variant="emerald" />
          <CadLabel x={39} y={184} align="start" text="RISE = RUN x UNIT RISE • PITCH = RISE / SPAN" fontSize={8} padX={4} color="#6ee7b7" borderColor="#059669" />
        </g>
      )
    }
  }

  // 14F. R1.0 DETAIL 6 / 7 — BIRDSMOUTH BEARING (MIN 38mm PLATE SEAT, HEEL ALIGNMENT & HURRICANE TIE)
  if (key.includes('birdsmouth')) {
    return {
      scaleLabel: 'DETAIL SCALE: MIN 38mm SEAT BEARING & UPLIFT TIE (R1.0)',
      keys: [
        '① 38mm (1-1/2") Min Bearing (NBC 9.23.14.3): Rafters and roof trusses must have at least 38mm (1-1/2") of full level bearing on wood plates (89mm / 3-1/2" on masonry)',
        '② Heel Alignment & Soffit Framing: Aligning the birdsmouth heel cut flush with the outside of the wall plate ensures uniform fascia height and level soffit lookouts around the building',
        '③ Wind Uplift Anchorage (NBC 9.23.3.4): Fasten every rafter/truss to the top plate with min 3× 82mm (3-1/4") toe-nails or engineered galvanized hurricane ties in high-wind zones'
      ],
      renderSvg: () => (
        <g>
          {/* Exterior 2x6 Wall Stud, OSB Sheathing & Double Top Plates */}
          <rect x="102" y="114" width="6" height="50" fill="#f59e0b" fillOpacity="0.45" stroke="#fbbf24" strokeWidth="1.4" />
          <rect x="108" y="114" width="56" height="11" fill="#1e293b" stroke="#cbd5e1" strokeWidth="1.8" />
          <line x1="108" y1="114" x2="164" y2="125" stroke="#94a3b8" strokeWidth="1" />
          <rect x="108" y="125" width="56" height="11" fill="#1e293b" stroke="#cbd5e1" strokeWidth="1.8" />
          <line x1="108" y1="125" x2="164" y2="136" stroke="#94a3b8" strokeWidth="1" />
          <rect x="108" y="136" width="56" height="28" fill="#0f243c" stroke="#94a3b8" strokeWidth="1.6" />

          {/* Rafter Bearing on Double Top Plate (Seat x=108..154, Flush Heel @ x=108) */}
          <polygon
            points="36,108 206,48 206,94 154,114 108,114 108,126 36,151"
            fill="#1e293b"
            stroke="#f59e0b"
            strokeWidth="2.2"
          />

          {/* ① >= 38mm (1-1/2") Level Seat Bearing Arrow */}
          <line x1="108" y1="100" x2="108" y2="112" stroke="#22d3ee" strokeWidth="1.4" />
          <line x1="154" y1="100" x2="154" y2="112" stroke="#22d3ee" strokeWidth="1.4" />
          <line x1="108" y1="104" x2="154" y2="104" stroke="#22d3ee" strokeWidth="2.2" />

          {/* ③ Galvanized H2.5A Hurricane Uplift Strap */}
          <rect x="142" y="88" width="12" height="46" rx="1.5" fill="#94a3b8" stroke="#f8fafc" strokeWidth="1.5" />
          {[93, 101, 118, 128].map((hy, i) => (
            <circle key={i} cx="148" cy={hy} r="1.5" fill="#0f172a" />
          ))}

          {/* Non-Crossing Leader Lines */}
          <line x1="126" y1="30" x2="126" y2="104" stroke="#22d3ee" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <circle cx="126" cy="104" r="2.6" fill="#22d3ee" />

          <line x1="208" y1="108" x2="154" y2="108" stroke="#34d399" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <circle cx="154" cy="108" r="2.6" fill="#34d399" />

          <polyline points="88,176 88,142 108,124" fill="none" stroke="#fbbf24" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <circle cx="108" cy="124" r="2.6" fill="#fbbf24" />

          {/* Opaque #0a192f Callouts & Pins */}
          <CalloutPin x={22} y={23} num={1} variant="cyan" />
          <CadLabel x={39} y={23} align="start" text="MIN 38mm (1-1/2&quot;) LEVEL SEAT BEARING" fontSize={8.1} padX={4} color="#67e8f9" borderColor="#0284c7" />

          <CalloutPin x={220} y={108} num={3} variant="emerald" />
          <CadLabel x={237} y={98} align="start" text="HURRICANE STRAP" fontSize={8.1} padX={4} color="#6ee7b7" borderColor="#059669" />
          <CadLabel x={237} y={119} align="start" text="OR 3x 3-1/4&quot; NAILS" fontSize={8.1} padX={4} color="#ffffff" borderColor="#475569" />

          <CalloutPin x={22} y={184} num={2} variant="amber" />
          <CadLabel x={39} y={184} align="start" text="HEEL CUT FLUSH W/ EXT WALL + OVERHANG" fontSize={8.1} padX={4} color="#fde68a" borderColor="#d97706" />
        </g>
      )
    }
  }

  // 14G. R1.0 DETAIL 7 / 7 — MINIMUM ROOF SLOPE (NBC 9.26 MATERIAL SLOPES & ICE/WATER EAVE SHIELD)
  if (key.includes('roof slope') || key.includes('minimum roof')) {
    return {
      scaleLabel: 'DETAIL SCALE: NBC 9.26 MIN SLOPES & ICE SHIELD (R1.0)',
      keys: [
        '① Asphalt Shingle Slopes (NBC 9.26.3.1): Standard 3-tab/architectural shingles require >= 4:12 (1:3) slope (>= 2:12 / 1:6 allowed only using low-slope application with cemented overlaps)',
        '② Low-Slope Membranes (< 2:12): Roofs flatter than 2:12 cannot shed water fast enough for shingles and require continuous waterproof membranes (EPDM, TPO, or 2-ply SBS)',
        '③ Eave Ice-Dam Protection (NBC 9.26.5.1): Self-adhering membrane must extend at least 900mm (36") up the roof edge AND >= 300mm (12") past the interior face of the exterior wall studs'
      ],
      renderSvg: () => (
        <g>
          {/* Top Comparison Wedges: >= 4:12 Shingles vs < 2:12 Membrane */}
          <polygon points="292,31 342,15 342,31" fill="#083344" stroke="#22d3ee" strokeWidth="1.8" />
          <line x1="232" y1="24" x2="290" y2="24" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="3 2.5" />

          <polygon points="292,58 342,51 342,58" fill="#451a03" stroke="#fbbf24" strokeWidth="1.8" />
          <line x1="232" y1="52" x2="290" y2="52" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3 2.5" />

          <line x1="18" y1="70" x2="342" y2="70" stroke="#334155" strokeWidth="1.2" strokeDasharray="4 3" />

          {/* Bottom Section: Eave Protection Membrane (>= 900mm Up Slope & >= 300mm Inside Warm Wall) */}
          <rect x="96" y="122" width="22" height="44" fill="#1e293b" stroke="#cbd5e1" strokeWidth="1.8" />
          <line x1="118" y1="76" x2="118" y2="166" stroke="#f87171" strokeWidth="1.5" strokeDasharray="4 2.5" />

          <line x1="32" y1="146" x2="212" y2="83" stroke="#94a3b8" strokeWidth="3.5" />
          <line x1="32" y1="142.5" x2="176" y2="92" stroke="#10b981" strokeWidth="4.5" />

          {/* >= 300mm (12") Inside Warm Wall Bracket */}
          <line x1="176" y1="92" x2="176" y2="142" stroke="#34d399" strokeWidth="1.4" strokeDasharray="3 2" />
          <line x1="118" y1="136" x2="176" y2="136" stroke="#34d399" strokeWidth="2.2" />
          <polygon points="118,136 125,132.5 125,139.5" fill="#34d399" />
          <polygon points="176,136 169,132.5 169,139.5" fill="#34d399" />

          <line x1="148" y1="177" x2="148" y2="136" stroke="#34d399" strokeWidth="1.6" strokeDasharray="3 2.5" />
          <circle cx="148" cy="136" r="2.6" fill="#34d399" />

          {/* Opaque #0a192f Callouts & Pins */}
          <CadLabel x={278} y={108} text=">= 900mm (36&quot;) UP EAVE" fontSize={7.8} padX={3.5} color="#6ee7b7" borderColor="#059669" />
          <CadLabel x={278} y={132} text=">= 300mm INSIDE WALL" fontSize={7.8} padX={3.5} color="#fca5a5" borderColor="#ef4444" />

          <CalloutPin x={22} y={24} num={1} variant="cyan" />
          <CadLabel x={39} y={24} align="start" text="SHINGLES: >= 4:12 STD (2:12 LOW-SLOPE)" fontSize={8} padX={4} color="#67e8f9" borderColor="#0284c7" />

          <CalloutPin x={22} y={52} num={2} variant="amber" />
          <CadLabel x={39} y={52} align="start" text="< 2:12: TORCH-ON / EPDM MEMBRANE REQ'D" fontSize={8} padX={4} color="#fde68a" borderColor="#d97706" />

          <CalloutPin x={22} y={185} num={3} variant="emerald" />
          <CadLabel x={39} y={185} align="start" text="ICE & WATER SHIELD: 36&quot; UP + 12&quot; INSIDE" fontSize={8.1} padX={4} color="#6ee7b7" borderColor="#059669" />
        </g>
      )
    }
  }

  // 15A. A2.1 DETAIL 1 / 5 — STEP FLASHING (Roof-to-Sidewall Interleaved L-Flashing Detail)
  if (key.includes('step flashing')) {
    return {
      scaleLabel: 'DETAIL SCALE: ROOF-TO-SIDEWALL STEP FLASHING (A2.1)',
      keys: [
        '① Interleaved Step Flashing (NBC 9.26.4.2): L-bent metal cards (≥ 75mm / 3" up wall and onto roof deck) interleaved with every individual shingle course at vertical sidewalls/chimneys.',
        '② Shingle-Fashion WRB Lap: Wall sheathing membrane (WRB) must lap over the vertical leg of the step flashing so wall drainage sheds onto the roof.',
        '③ Siding Gap & Kick-Out Diverter: Keep siding cut ends 25mm–50mm (1"–2") clear of roof shingles to prevent rot, and install a kick-out flashing at the bottom eave termination.'
      ],
      renderSvg: () => (
        <g>
          {/* LEFT: Roof-to-Sidewall Stepped Elevation Cutaway */}
          {/* OSB Sidewall Sheathing Background */}
          <polygon points="34,145 196,64 196,40 34,40" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />

          {/* Sloped Roof Deck */}
          <polygon points="22,151 198,63 202,70 26,158" fill="#334155" stroke="#94a3b8" strokeWidth="1.8" />

          {/* Course 1: Lower Shingle + L-Step Card 1 + Eave Kick-Out Diverter */}
          <polygon points="26,149 74,125 76,130 28,154" fill="#475569" stroke="#cbd5e1" strokeWidth="1.3" />
          <polygon points="44,140 88,118 88,92 44,114" fill="#d97706" opacity="0.88" stroke="#fde68a" strokeWidth="1.6" />
          {/* Kick-Out Flashing Diverter @ Eave */}
          <polygon points="24,150 44,140 44,118 28,128 18,144" fill="#10b981" opacity="0.85" stroke="#6ee7b7" strokeWidth="1.6" />
          <path d="M 24 142 Q 14 148 16 156" fill="none" stroke="#22d3ee" strokeWidth="1.8" />

          {/* Course 2: Shingle 2 + Interleaved L-Step Card 2 (50mm / 2" Headlap) */}
          <polygon points="66,129 120,102 122,107 68,134" fill="#475569" stroke="#cbd5e1" strokeWidth="1.3" />
          <polygon points="84,120 130,97 130,71 84,94" fill="#d97706" opacity="0.88" stroke="#fde68a" strokeWidth="1.6" />

          {/* Course 3: Shingle 3 + Interleaved L-Step Card 3 */}
          <polygon points="110,107 166,79 168,84 112,112" fill="#475569" stroke="#cbd5e1" strokeWidth="1.3" />
          <polygon points="126,99 174,75 174,50 126,74" fill="#d97706" opacity="0.88" stroke="#fde68a" strokeWidth="1.6" />

          {/* Upper Wall WRB (Tyvek) Lapping OVER Top Vertical Legs of Step Flashing */}
          <polygon
            points="34,40 196,40 196,54 34,135"
            fill="#083344"
            opacity="0.72"
            stroke="#22d3ee"
            strokeWidth="1.8"
            strokeDasharray="5 2.5"
          />

          {/* Horizontal Lap Siding Cut Back w/ 25mm–50mm (1"–2") Clearance Above Roof */}
          <polygon points="34,40 182,40 182,50 34,124" fill="#0f243c" opacity="0.9" stroke="#cbd5e1" strokeWidth="1.6" />
          <line x1="34" y1="56" x2="150" y2="56" stroke="#64748b" strokeWidth="1.2" />
          <line x1="34" y1="74" x2="114" y2="74" stroke="#64748b" strokeWidth="1.2" />
          <line x1="34" y1="92" x2="78" y2="92" stroke="#64748b" strokeWidth="1.2" />

          {/* Siding Clearance Gap Double-Arrow on Slope */}
          <line x1="154" y1="64" x2="160" y2="76" stroke="#34d399" strokeWidth="1.8" />

          {/* RIGHT: True Cross-Section Zoom Inset (x=214..348, y=40..148) */}
          <rect x="214" y="40" width="134" height="108" rx="5" fill="#0d1f38" stroke="#334155" strokeWidth="1.5" />
          {/* Stud + OSB Wall */}
          <rect x="226" y="54" width="18" height="86" fill="#1e293b" stroke="#94a3b8" strokeWidth="1.5" />
          {/* Roof Deck & Shingle */}
          <rect x="244" y="132" width="94" height="8" fill="#334155" stroke="#94a3b8" strokeWidth="1.5" />
          <line x1="252" y1="129" x2="336" y2="129" stroke="#cbd5e1" strokeWidth="2.5" />
          {/* L-Shaped Metal Step Flashing (3" Up Wall x 3" On Roof) */}
          <polyline points="248,80 248,126 308,126" fill="none" stroke="#fbbf24" strokeWidth="3.2" />
          {/* Upper WRB Lapping Shingle-Fashion OVER Vertical Flashing Leg */}
          <polyline points="253,54 253,102" fill="none" stroke="#22d3ee" strokeWidth="2.5" strokeDasharray="4 2" />
          <polygon points="253,106 249.5,99 256.5,99" fill="#22d3ee" />
          {/* Siding + Rainscreen Strapping Stopping 1"–2" Above Shingles */}
          <rect x="260" y="54" width="12" height="54" fill="#0f243c" stroke="#cbd5e1" strokeWidth="1.6" />
          {/* 1"–2" Vertical Clearance Arrow */}
          <line x1="266" y1="109" x2="266" y2="125" stroke="#34d399" strokeWidth="2" />
          <polygon points="266,109 263,114 269,114" fill="#34d399" />
          <polygon points="266,125 263,120 269,120" fill="#34d399" />

          {/* Non-Crossing Dashed Leader Lines */}
          {/* ① Leader to Interleaved L-Step Card */}
          <line x1="106" y1="30" x2="106" y2="88" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="3 2.5" />
          {/* ② Leader from Section WRB Overlap down to Row ② */}
          <polyline points="253,108 242,126 242,155" fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3 2.5" />
          {/* ③ Leader from 1"-2" Siding Gap down-right around Row ② into Row ③ */}
          <polyline points="266,126 254,144 254,191 215,191" fill="none" stroke="#34d399" strokeWidth="1.5" strokeDasharray="3 2.5" />

          {/* Section Zoom Inset Pills (Opaque #0a192f Drawn After Geometry) */}
          <CadLabel x={281} y={48} text="SECTION ZOOM" fontSize={7.4} padX={3.5} color="#94a3b8" borderColor="#334155" />
          <CadLabel x={312} y={76} text="WRB OVER" fontSize={7.6} padX={3.5} color="#67e8f9" borderColor="#0284c7" />
          <CadLabel x={312} y={114} text="1&quot;-2&quot; GAP" fontSize={7.6} padX={3.5} color="#6ee7b7" borderColor="#059669" />

          {/* Callout Pins & Main Labels */}
          <CalloutPin x={22} y={20} num={1} variant="cyan" />
          <CadLabel x={39} y={20} align="start" text="L-STEP CARDS >= 75x75mm (3&quot;x3&quot;) EA. COURSE" fontSize={8} padX={4} color="#67e8f9" borderColor="#0284c7" />
          <CadLabel x={348} y={20} align="end" text="NBC 9.26.4.2" fontSize={8} padX={4} color="#67e8f9" borderColor="#0284c7" />

          <CalloutPin x={22} y={164} num={2} variant="amber" />
          <CadLabel x={39} y={164} align="start" text="WRB LAPS OVER STEP FLASHING (2&quot; HEADLAP)" fontSize={8} padX={4} color="#fde68a" borderColor="#d97706" />

          <CalloutPin x={22} y={191} num={3} variant="emerald" />
          <CadLabel x={39} y={191} align="start" text="1&quot;-2&quot; SIDING GAP + KICK-OUT @ EAVE" fontSize={8} padX={4} color="#6ee7b7" borderColor="#059669" />
          <CadLabel x={348} y={191} align="end" text="KICK-OUT DIVERTER" fontSize={7.8} padX={4} color="#6ee7b7" borderColor="#059669" />
        </g>
      )
    }
  }

  // 15B. A2.1 DETAIL 2 / 5 — FINISHED GRADE CLEARANCE (200mm / 8" Wood vs. 150mm / 6" Masonry)
  if (key.includes('grade clearance') || key.includes('finished grade')) {
    return {
      scaleLabel: 'DETAIL SCALE: CLADDING-TO-GRADE CLEARANCES (A2.1)',
      keys: [
        '① 200mm (8") Cladding Clearance (NBC 9.27.2.4): Lumber, plywood, OSB, hardboard, fiber-cement, and vinyl siding must start at least 200mm (8") above finished ground to prevent splashback rot.',
        '② 150mm (6") Masonry Clearance: Brick/stone veneer and stucco require at least 150mm (6") clearance above finished grade.',
        '③ Positive Grade & Splash Protection: Combine proper siding height with a sloped starter drip cap and positive grade fall away from the foundation.'
      ],
      renderSvg: () => (
        <g>
          {/* Continuous Finished Grade Soil Band & Green Datum Line (y = 148) */}
          <rect x="16" y="148" width="328" height="18" fill="#064e3b" opacity="0.38" />
          <line x1="16" y1="148" x2="344" y2="148" stroke="#10b981" strokeWidth="3.2" />

          {/* Center Comparison Divider */}
          <line x1="176" y1="36" x2="176" y2="144" stroke="#334155" strokeWidth="1.2" strokeDasharray="4 3" />

          {/* LEFT SIDE: Wood / Fibre-Cement / Vinyl Cladding (>= 200mm / 8" Clearance) */}
          {/* Exposed Concrete Foundation Wall */}
          <rect x="96" y="96" width="58" height="68" fill="#334155" stroke="#94a3b8" strokeWidth="2" />
          {/* Sill Plate + 2x6 Stud Backup Wall */}
          <rect x="100" y="54" width="50" height="42" fill="#1e293b" stroke="#cbd5e1" strokeWidth="1.8" />
          {/* Rainscreen + Lap Siding Ending @ y = 98 (200mm / 8" Above Grade y = 148) */}
          <rect x="86" y="54" width="12" height="44" fill="#0f243c" stroke="#38bdf8" strokeWidth="1.8" />
          <line x1="86" y1="68" x2="98" y2="68" stroke="#64748b" strokeWidth="1.2" />
          <line x1="86" y1="82" x2="98" y2="82" stroke="#64748b" strokeWidth="1.2" />
          {/* Base Starter Drip Flashing */}
          <polyline points="99,92 99,98 80,102" fill="none" stroke="#34d399" strokeWidth="2.4" />

          {/* ① Vertical Dimension Arrow: 200mm (8") Clearance */}
          <line x1="66" y1="98" x2="82" y2="98" stroke="#22d3ee" strokeWidth="1.3" strokeDasharray="2.5 2" />
          <line x1="72" y1="98" x2="72" y2="148" stroke="#22d3ee" strokeWidth="2.2" />
          <polygon points="72,98 68.5,105 75.5,105" fill="#22d3ee" />
          <polygon points="72,148 68.5,141 75.5,141" fill="#22d3ee" />
          <line x1="72" y1="29" x2="72" y2="96" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="3 2.5" />

          {/* RIGHT SIDE: Brick / Masonry Veneer / Stucco (>= 150mm / 6" Clearance + Weepholes) */}
          {/* Concrete Foundation Wall w/ Brick Ledge */}
          <rect x="202" y="96" width="66" height="68" fill="#334155" stroke="#94a3b8" strokeWidth="2" />
          {/* Wood Backup Wall */}
          <rect x="202" y="54" width="36" height="42" fill="#1e293b" stroke="#cbd5e1" strokeWidth="1.8" />
          {/* Brick Veneer Courses Ending @ y = 110 (150mm / 6" Above Grade y = 148) */}
          <rect x="246" y="54" width="22" height="56" fill="#7c2d12" stroke="#fb923c" strokeWidth="1.8" />
          <line x1="246" y1="68" x2="268" y2="68" stroke="#fdba74" strokeWidth="1.1" />
          <line x1="246" y1="82" x2="268" y2="82" stroke="#fdba74" strokeWidth="1.1" />
          <line x1="246" y1="96" x2="268" y2="96" stroke="#fdba74" strokeWidth="1.1" />
          {/* Thru-Wall Base Flashing + Weephole */}
          <polyline points="239,102 239,110 273,113" fill="none" stroke="#34d399" strokeWidth="2.4" />
          <circle cx="268" cy="107" r="2.5" fill="#22d3ee" />
          <line x1="272" y1="106" x2="296" y2="96" stroke="#22d3ee" strokeWidth="1.3" strokeDasharray="2.5 2" />

          {/* ② Vertical Dimension Arrow: 150mm (6") Clearance */}
          <line x1="274" y1="110" x2="294" y2="110" stroke="#fbbf24" strokeWidth="1.3" strokeDasharray="2.5 2" />
          <line x1="288" y1="110" x2="288" y2="148" stroke="#fbbf24" strokeWidth="2.2" />
          <polygon points="288,110 284.5,117 291.5,117" fill="#fbbf24" />
          <polygon points="288,148 284.5,141 291.5,141" fill="#fbbf24" />
          <line x1="288" y1="29" x2="288" y2="108" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3 2.5" />

          {/* ③ Leader from Exposed Concrete Foundation & Base Flashing straight down to Row ③ */}
          <line x1="96" y1="124" x2="96" y2="179" stroke="#34d399" strokeWidth="1.5" strokeDasharray="3 2.5" />

          {/* All Opaque #0a192f Pills & Callout Pins Drawn After Lines */}
          <CalloutPin x={20} y={20} num={1} variant="cyan" />
          <CadLabel x={36} y={20} align="start" text="WOOD/SIDING >= 200mm (8&quot;)" fontSize={7.8} padX={3.5} color="#67e8f9" borderColor="#0284c7" />

          <CalloutPin x={184} y={20} num={2} variant="amber" />
          <CadLabel x={200} y={20} align="start" text="MASONRY/STUCCO >= 150mm (6&quot;)" fontSize={7.8} padX={3.5} color="#fde68a" borderColor="#d97706" />

          <CadLabel x={122} y={42} text="WOOD / SIDING" fontSize={7.6} padX={3.5} color="#e2e8f0" borderColor="#475569" />
          <CadLabel x={236} y={42} text="BRICK / STUCCO" fontSize={7.6} padX={3.5} color="#fde68a" borderColor="#d97706" />

          <CadLabel x={16} y={123} align="start" text="200mm/8&quot;" fontSize={7.8} padX={3.5} color="#67e8f9" borderColor="#0284c7" />
          <CadLabel x={298} y={95} align="start" text="WEEPHOLE" fontSize={7.3} padX={3} color="#67e8f9" borderColor="#0284c7" />
          <CadLabel x={298} y={129} align="start" text="150mm/6&quot;" fontSize={7.8} padX={3.5} color="#fde68a" borderColor="#d97706" />

          <CadLabel x={180} y={158} text="FINISHED GRADE (SLOPE AWAY)" fontSize={7.5} padX={4} color="#6ee7b7" borderColor="#059669" />

          <CalloutPin x={22} y={188} num={3} variant="emerald" />
          <CadLabel x={39} y={188} align="start" text="EXPOSED CONC. FOUNDATION + BASE DRIP FLASHING" fontSize={8} padX={4} color="#6ee7b7" borderColor="#059669" />
          <CadLabel x={348} y={188} align="end" text="NBC 9.27.2.4" fontSize={8} padX={4} color="#67e8f9" borderColor="#0284c7" />
        </g>
      )
    }
  }

  // 15C. A2.1 DETAIL 3 / 5 — WINDOW DRIP CAP (Window Head Z-Flashing, Positive Slope & Shingle-Lapped WRB)
  if (key.includes('drip cap') || key.includes('window drip')) {
    return {
      scaleLabel: 'DETAIL SCALE: WINDOW HEAD Z-FLASHING SECTION (A2.1)',
      keys: [
        '① Head Flashing Requirement (NBC 9.27.3.8): Required over all exterior windows, doors, and horizontal trim projections unless protected by a deep roof overhang (slope ≤ 1:4 of overhang width).',
        '② Shingle-Fashion WRB Integration: Slit and lift the upper WRB flap prior to installing the drip cap, then tape the WRB over the top flashing leg—never tuck the top of a drip cap over the outside of the WRB!',
        '③ Outward Slope & Drip Edge: Must slope positively outward (≥ 6°) and project at least 10mm (3/8") past the outer face of the window trim to throw water clear.'
      ],
      renderSvg: () => (
        <g>
          {/* Upper Wall Cavity & 2-Ply 2x10 Window Lintel Header (Interior Right, Exterior Left) */}
          <rect x="188" y="60" width="48" height="20" fill="#1e293b" stroke="#64748b" strokeWidth="1.6" />
          <rect x="188" y="80" width="48" height="50" fill="#451a03" stroke="#d97706" strokeWidth="2" />
          <line x1="188" y1="80" x2="236" y2="130" stroke="#d97706" strokeWidth="1.1" />
          <line x1="236" y1="80" x2="188" y2="130" stroke="#d97706" strokeWidth="1.1" />
          <line x1="212" y1="80" x2="212" y2="130" stroke="#fbbf24" strokeWidth="1.4" />

          {/* 7/16" OSB Exterior Sheathing */}
          <rect x="176" y="60" width="12" height="70" fill="#334155" stroke="#94a3b8" strokeWidth="1.8" />

          {/* Window Head Frame, Nailing Flange & Double-Glazed Unit Below */}
          <rect x="166" y="136" width="58" height="16" fill="#0f243c" stroke="#38bdf8" strokeWidth="2" />
          <line x1="173" y1="120" x2="173" y2="136" stroke="#38bdf8" strokeWidth="2" />
          <line x1="190" y1="152" x2="190" y2="172" stroke="#67e8f9" strokeWidth="2.2" />
          <line x1="198" y1="152" x2="198" y2="172" stroke="#67e8f9" strokeWidth="2.2" />

          {/* Exterior Window Head Casing / Trim Block */}
          <rect x="142" y="122" width="24" height="28" fill="#1e293b" stroke="#cbd5e1" strokeWidth="2" />

          {/* Upper Cladding / Lap Siding Terminating w/ Uncaulked Drain Gap Above Drip Cap */}
          <rect x="144" y="60" width="18" height="46" fill="#0f243c" stroke="#cbd5e1" strokeWidth="1.8" />
          <line x1="144" y1="76" x2="162" y2="76" stroke="#64748b" strokeWidth="1.2" />
          <line x1="144" y1="92" x2="162" y2="92" stroke="#64748b" strokeWidth="1.2" />

          {/* ① Metal Z-Profile Head Drip Cap Flashing (>= 50mm / 2" Up Wall + >= 6° Outward Slope + 10mm Hemmed Lip) */}
          <polyline
            points="171,78 171,114 128,121 128,131 132,128"
            fill="none"
            stroke="#fbbf24"
            strokeWidth="3.2"
            strokeLinejoin="round"
          />

          {/* ② Upper WRB (Tyvek) Flap + Flashing Tape Lapping Shingle-Fashion OVER Top Flashing Leg */}
          <polyline
            points="173,60 173,76 167,80 167,106"
            fill="none"
            stroke="#22d3ee"
            strokeWidth="2.5"
            strokeDasharray="4 2"
          />
          <line x1="165" y1="74" x2="165" y2="88" stroke="#34d399" strokeWidth="2.8" />

          {/* Shedding Water Droplets Thrown Clear Past Trim Face */}
          <circle cx="124" cy="138" r="2.2" fill="#22d3ee" />
          <circle cx="121" cy="148" r="2.2" fill="#22d3ee" />

          {/* Non-Crossing Dashed Leader Lines */}
          {/* ① Leader from Vertical Metal Flashing Leg Right-Then-Up at x=242 (Clear of Row ②) */}
          <polyline points="171,84 242,84 242,28" fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3 2.5" />
          {/* ② Leader from Shingle-Fashion WRB Overlap Left-Then-Up to Row ② */}
          <polyline points="167,92 118,92 118,53" fill="none" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="3 2.5" />
          {/* ③ Leader from Sloped Drip Lip Straight Down to Row ③ */}
          <line x1="128" y1="133" x2="128" y2="179" stroke="#34d399" strokeWidth="1.5" strokeDasharray="3 2.5" />
          {/* Side Identification Leaders */}
          <line x1="108" y1="110" x2="144" y2="110" stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="2.5 2" />
          <line x1="236" y1="105" x2="250" y2="105" stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="2.5 2" />
          <line x1="224" y1="144" x2="250" y2="144" stroke="#38bdf8" strokeWidth="1.2" strokeDasharray="2.5 2" />

          {/* All Opaque #0a192f Pills & Callout Pins Drawn After Lines */}
          <CalloutPin x={22} y={19} num={1} variant="amber" />
          <CadLabel x={39} y={19} align="start" text="METAL HEAD DRIP CAP (>= 50mm / 2&quot; UP WALL)" fontSize={8} padX={4} color="#fde68a" borderColor="#d97706" />
          <CadLabel x={348} y={19} align="end" text="NBC 9.27.3.8" fontSize={8} padX={4} color="#67e8f9" borderColor="#0284c7" />

          <CalloutPin x={22} y={44} num={2} variant="cyan" />
          <CadLabel x={39} y={44} align="start" text="UPPER WRB FLAP LAPS OVER FLASHING LEG" fontSize={8} padX={4} color="#67e8f9" borderColor="#0284c7" />

          <CadLabel x={16} y={110} align="start" text="NO-CAULK GAP" fontSize={7.6} padX={3.5} color="#e2e8f0" borderColor="#475569" />
          <CadLabel x={252} y={105} align="start" text="2x10 HEADER" fontSize={7.8} padX={3.5} color="#fde68a" borderColor="#d97706" />
          <CadLabel x={252} y={144} align="start" text="WINDOW HEAD" fontSize={7.8} padX={3.5} color="#67e8f9" borderColor="#0284c7" />

          <CalloutPin x={22} y={188} num={3} variant="emerald" />
          <CadLabel x={39} y={188} align="start" text=">= 6° OUTWARD SLOPE + 10mm LIP (NO CAULK)" fontSize={8} padX={4} color="#6ee7b7" borderColor="#059669" />
        </g>
      )
    }
  }

  // 15D. A2.1 DETAIL 4 / 5 — EAVES PROTECTION (Ice & Water Shield, Drip Edge & Shingle Starter Overhang)
  if (key.includes('eaves protection')) {
    return {
      scaleLabel: 'DETAIL SCALE: EAVE UNDERLAYMENT & DRIP EDGE (A2.1)',
      keys: [
        '① 900mm / 300mm Eave Rule (NBC 9.26.5.1): Eave protection membrane must extend at least 900mm (36") up the roof slope from the edge AND at least 300mm (12") inward past the inner face of exterior wall studs.',
        '② Eave vs. Rake Drip Edge Rule: At the bottom eave, install metal drip edge first (directly on OSB, under Ice & Water Shield); along gable rakes, install drip edge over the underlayment to block wind-driven rain.',
        '③ Starter Strip & Gutter Projection: Overhang starter and first shingle course 12mm–19mm (1/2"–3/4") past the drip edge so water drops cleanly into the gutter without wicking back into the fascia.'
      ],
      renderSvg: () => (
        <g>
          {/* Exterior 2x6 Warm Wall, Double Top Plate & Vented Soffit */}
          <rect x="164" y="114" width="40" height="50" fill="#1e293b" stroke="#94a3b8" strokeWidth="1.8" />
          <rect x="164" y="102" width="40" height="12" fill="#78350f" stroke="#fbbf24" strokeWidth="1.8" />
          <line x1="78" y1="138" x2="164" y2="138" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5 2.5" />

          {/* Warm Interior Wall Plane Datum Line (x = 204) */}
          <line x1="204" y1="84" x2="204" y2="164" stroke="#f43f5e" strokeWidth="1.6" strokeDasharray="4 2.5" />

          {/* Rafter & OSB Roof Deck Rising cleanly from (78,122) to (332,64) — Zero Text Crosses Roof Line */}
          <polygon points="78,122 332,64 332,79 78,137" fill="#451a03" stroke="#d97706" strokeWidth="1.8" />
          <polygon points="76,118 332,60 332,64 76,122" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1.2" />

          {/* Fascia Board @ Eave */}
          <rect x="72" y="118" width="6" height="24" fill="#fde68a" stroke="#fbbf24" strokeWidth="1.4" />

          {/* ② Metal Eave Drip Edge Installed Directly on OSB (UNDER Ice & Water Shield @ Eave) */}
          <polyline points="69,131 69,117 98,110" fill="none" stroke="#fbbf24" strokeWidth="2.8" />

          {/* ① Self-Adhering Ice & Water Shield Membrane (>= 900mm / 36" Up Slope & >= 300mm / 12" Past Warm Wall) */}
          <line x1="70" y1="115" x2="288" y2="66" stroke="#22d3ee" strokeWidth="4" />
          {/* Parallel 900mm (36") Up-Slope Dimension Arrow Floating Cleanly Above Roof */}
          <line x1="70" y1="98" x2="286" y2="49" stroke="#22d3ee" strokeWidth="1.8" />
          <polygon points="70,98 78,93 79,99" fill="#22d3ee" />
          <polygon points="286,49 277,48 279,54" fill="#22d3ee" />
          {/* Horizontal >= 300mm (12") Inward Past Warm Wall Arrow */}
          <line x1="288" y1="66" x2="288" y2="132" stroke="#22d3ee" strokeWidth="1.3" strokeDasharray="3 2.5" />
          <line x1="204" y1="126" x2="288" y2="126" stroke="#22d3ee" strokeWidth="2" />
          <polygon points="204,126 211,122.5 211,129.5" fill="#22d3ee" />
          <polygon points="288,126 281,122.5 281,129.5" fill="#22d3ee" />

          {/* ③ Shingle Starter & First Shingle Course Overhanging 12–19mm (1/2"–3/4") Into Eavestrough */}
          <line x1="56" y1="115" x2="328" y2="53" stroke="#34d399" strokeWidth="2.6" />
          {/* K-Style Eavestrough (Gutter) Catching Drip */}
          <path d="M 42 126 L 44 142 L 68 142 L 68 126" fill="#0f243c" stroke="#38bdf8" strokeWidth="2" />
          <circle cx="56" cy="123" r="2" fill="#22d3ee" />
          <circle cx="56" cy="133" r="2" fill="#22d3ee" />

          {/* Non-Crossing Vertical Dashed Leaders */}
          {/* ① Straight Up at x=264 (Right of Row ②) */}
          <line x1="264" y1="54" x2="264" y2="28" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="3 2.5" />
          {/* ② Straight Up from Metal Drip Edge at x=69 to Row ② */}
          <line x1="69" y1="115" x2="69" y2="53" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3 2.5" />
          {/* ③ Straight Down from Shingle Overhang / Gutter at x=55 to Row ③ */}
          <line x1="55" y1="143" x2="55" y2="179" stroke="#34d399" strokeWidth="1.5" strokeDasharray="3 2.5" />

          {/* All Opaque #0a192f Pills & Callout Pins Drawn After Lines */}
          <CalloutPin x={22} y={19} num={1} variant="cyan" />
          <CadLabel x={39} y={19} align="start" text="ICE SHIELD: >= 900mm (36&quot;) UP & >= 300mm IN" fontSize={8} padX={4} color="#67e8f9" borderColor="#0284c7" />
          <CadLabel x={348} y={19} align="end" text="NBC 9.26.5.1" fontSize={8} padX={4} color="#67e8f9" borderColor="#0284c7" />

          <CalloutPin x={22} y={44} num={2} variant="amber" />
          <CadLabel x={39} y={44} align="start" text="DRIP EDGE: UNDER ICE @ EAVE • OVER @ RAKE" fontSize={8} padX={4} color="#fde68a" borderColor="#d97706" />

          <CadLabel x={276} y={148} text=">= 300mm (12&quot;) PAST WARM WALL" fontSize={7.6} padX={3.5} color="#fda4af" borderColor="#e11d48" />

          <CalloutPin x={22} y={188} num={3} variant="emerald" />
          <CadLabel x={39} y={188} align="start" text="SHINGLE OVERHANG: 12-19mm (1/2&quot;-3/4&quot;) INTO GUTTER" fontSize={7.8} padX={4} color="#6ee7b7" borderColor="#059669" />
        </g>
      )
    }
  }

  // 15E. A2.1 DETAIL 5 / 5 — BEDROOM EGRESS WINDOWS (Clear Opening, Sill Height & Window Well Clearance)
  if (key.includes('egress') || key.includes('bedroom')) {
    return {
      scaleLabel: `DETAIL SCALE: BEDROOM EGRESS & WINDOW WELL (${sheetCode})`,
    keys: [
      '① Minimum Clear Opening (NBC 9.9.10.1): Every bedroom (unless sprinklered or having a direct exterior door) requires a window providing ≥ 0.35 m² (3.77 ft²) of unobstructed openable area with no dimension < 380mm (15").',
      '② Hardware & Sill Height: Must open from the inside without keys, tools, or special knowledge, and maintain the opening without props; sill height ≤ 1.0m (39") above floor.',
      '③ Basement Window Well Clearance (NBC 9.9.10.1.3): Sash must swing clear so at least 760mm (30") (or 550mm–760mm per edition) of unobstructed clearance remains inside the window well for firefighter/occupant escape.'
    ],
    renderSvg: () => (
      <g>
        {/* Center Panel Divider */}
        <line x1="178" y1="36" x2="178" y2="148" stroke="#334155" strokeWidth="1.2" strokeDasharray="4 3" />

        {/* LEFT PANEL: Open Casement / Slider Bedroom Window Elevation & Sill Height */}
        {/* Interior Finished Floor Line */}
        <line x1="20" y1="146" x2="170" y2="146" stroke="#cbd5e1" strokeWidth="2.5" />

        {/* Window Outer Frame (x=56..164, y=44..110) */}
        <rect x="56" y="44" width="108" height="66" fill="#0f243c" stroke="#cbd5e1" strokeWidth="2" />
        {/* ① Shaded Cyan Unobstructed Open Sash Area (Left Half: x=60..118, y=48..106) */}
        <rect x="60" y="48" width="58" height="58" fill="#0891b2" opacity="0.28" stroke="#22d3ee" strokeWidth="2" />
        {/* Vertical & Horizontal Clear Opening Arrows (>= 380mm / 15" Min Dim) */}
        <line x1="68" y1="52" x2="68" y2="94" stroke="#22d3ee" strokeWidth="2" />
        <polygon points="68,52 65,58 71,58" fill="#22d3ee" />
        <polygon points="68,94 65,88 71,88" fill="#22d3ee" />
        <line x1="64" y1="100" x2="114" y2="100" stroke="#22d3ee" strokeWidth="2" />
        <polygon points="64,100 70,97 70,103" fill="#22d3ee" />
        <polygon points="114,100 108,97 108,103" fill="#22d3ee" />

        {/* Open Casement Sash Leaf on Right Half (Hinged, Tool-Free Latch) */}
        <rect x="118" y="48" width="42" height="58" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />
        <polyline points="118,48 158,77 118,106" fill="none" stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="3 2" />

        {/* ② Interior Floor-to-Sill Height Dimension (<= 1.0m / 39") */}
        <line x1="34" y1="110" x2="54" y2="110" stroke="#fbbf24" strokeWidth="1.3" strokeDasharray="2.5 2" />
        <line x1="40" y1="110" x2="40" y2="146" stroke="#fbbf24" strokeWidth="2.2" />
        <polygon points="40,110 36.5,117 43.5,117" fill="#fbbf24" />
        <polygon points="40,146 36.5,139 43.5,139" fill="#fbbf24" />

        {/* RIGHT PANEL: Basement Window Well Cross-Section */}
        {/* Concrete Basement Foundation Wall + Window Frame + Out-Swinging Sash */}
        <rect x="190" y="54" width="20" height="92" fill="#334155" stroke="#94a3b8" strokeWidth="1.8" />
        <rect x="196" y="68" width="10" height="42" fill="#0f243c" stroke="#38bdf8" strokeWidth="1.8" />
        <line x1="206" y1="70" x2="234" y2="84" stroke="#22d3ee" strokeWidth="2.6" />

        {/* Exterior Corrugated Steel Window Well + Surrounding Grade + Drainage Stone */}
        <polyline
          points="326,58 330,68 326,78 330,88 326,98 330,108 326,118 330,128 326,138"
          fill="none"
          stroke="#cbd5e1"
          strokeWidth="2.4"
        />
        <rect x="330" y="62" width="16" height="84" fill="#064e3b" opacity="0.4" />
        <line x1="330" y1="62" x2="346" y2="62" stroke="#10b981" strokeWidth="2.5" />
        <rect x="210" y="134" width="116" height="12" fill="#1e293b" stroke="#64748b" strokeWidth="1.4" />

        {/* ③ Horizontal Clear Projection Arrow in Front of Open Sash (>= 760mm / 30") */}
        <line x1="234" y1="84" x2="234" y2="104" stroke="#34d399" strokeWidth="1.3" strokeDasharray="2.5 2" />
        <line x1="234" y1="96" x2="325" y2="96" stroke="#34d399" strokeWidth="2.2" />
        <polygon points="234,96 241,92.5 241,99.5" fill="#34d399" />
        <polygon points="325,96 318,92.5 318,99.5" fill="#34d399" />

        {/* Non-Crossing Dashed Leader Lines */}
        {/* ① Straight Up from Open Sash Area to Row ① */}
        <line x1="90" y1="48" x2="90" y2="28" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="3 2.5" />
        {/* ② Straight Down from Sill Height Arrow to Row ② */}
        <line x1="40" y1="146" x2="40" y2="156" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3 2.5" />
        {/* ③ Straight Down at x=318 (Clear of Row ②) into Row ③ */}
        <polyline points="316,96 316,191 264,191" fill="none" stroke="#34d399" strokeWidth="1.5" strokeDasharray="3 2.5" />

        {/* All Opaque #0a192f Pills & Callout Pins Drawn After Lines */}
        <CalloutPin x={22} y={19} num={1} variant="cyan" />
        <CadLabel x={39} y={19} align="start" text="CLEAR OPEN >= 0.35m² (3.77ft²) • MIN 380mm (15&quot;)" fontSize={7.8} padX={3.8} color="#67e8f9" borderColor="#0284c7" />
        <CadLabel x={348} y={19} align="end" text="NBC 9.9.10.1" fontSize={7.8} padX={3.8} color="#67e8f9" borderColor="#0284c7" />

        <CadLabel x={96} y={66} text="0.35m²" fontSize={7.4} padX={3} color="#67e8f9" borderColor="#0284c7" />
        <CadLabel x={111} y={128} text="<= 1.0m (39&quot;) SILL" fontSize={7.6} padX={3.5} color="#fde68a" borderColor="#d97706" />

        <CadLabel x={268} y={46} text="BASEMENT WINDOW WELL" fontSize={7.4} padX={3.5} color="#cbd5e1" borderColor="#475569" />
        <CadLabel x={274} y={116} text=">= 760mm (30&quot;)" fontSize={7.6} padX={3.5} color="#6ee7b7" borderColor="#059669" />

        <CalloutPin x={22} y={165} num={2} variant="amber" />
        <CadLabel x={39} y={165} align="start" text="MAX SILL <= 1.0m (39&quot;) ABOVE FLOOR" fontSize={8} padX={4} color="#fde68a" borderColor="#d97706" />

        <CalloutPin x={22} y={191} num={3} variant="emerald" />
        <CadLabel x={39} y={191} align="start" text="WINDOW WELL: >= 760mm (30&quot;) CLEAR PROJECTION" fontSize={8} padX={4} color="#6ee7b7" borderColor="#059669" />
      </g>
    )
    }
  }

  // 16A. A4.1 DETAIL 1 / 7 — HEADROOM CLEARANCE (Stairwell Header, Tangent Nosing Line & Plumb Vertical Headroom)
  if (key.includes('headroom')) {
    return {
      scaleLabel: 'DETAIL SCALE: PLUMB STAIR HEADROOM & R.O. (A4.1)',
      keys: [
        '① Min Headroom (NBC 9.8.2.2): Private dwelling stairs require ≥ 1950mm (6\'-4 3/4") clear vertical height (≥ 2050mm / 6\'-8 3/4" for public/multi-unit stairs).',
        '② Plumb Measurement Line: Always measure straight vertical (plumb) from a line tangent to the tread nosings up to the lowest ceiling/header projection (including drywall finish).',
        '③ Framing Rough Opening Rule: If a stairwell header is framed too short, the carpenter loses headroom on the middle treads before reaching the lower floor.'
      ],
      renderSvg: () => (
        <g>
          {/* Upper Left Floor Assembly + Doubled Stairwell Header (w/ Ceiling Drywall Finish) */}
          <rect x="24" y="50" width="108" height="18" fill="#1e293b" stroke="#94a3b8" strokeWidth="1.8" />
          <rect x="132" y="50" width="18" height="18" fill="#451a03" stroke="#fbbf24" strokeWidth="2" />
          <line x1="132" y1="50" x2="150" y2="68" stroke="#fbbf24" strokeWidth="1.2" />
          <line x1="150" y1="50" x2="132" y2="68" stroke="#fbbf24" strokeWidth="1.2" />

          {/* Upper Right Floor Landing Header */}
          <rect x="296" y="50" width="38" height="18" fill="#451a03" stroke="#fbbf24" strokeWidth="2" />

          {/* ③ Stairwell Rough Opening (R.O.) Horizontal Dimension Arrow Across Opening */}
          <line x1="150" y1="42" x2="296" y2="42" stroke="#34d399" strokeWidth="2" />
          <polygon points="150,42 157,38.5 157,45.5" fill="#34d399" />
          <polygon points="296,42 289,38.5 289,45.5" fill="#34d399" />

          {/* Stair Treads, Risers & Cut Stringer */}
          <path
            d="M 56 146 L 56 126.5 L 116 126.5 L 116 107 L 176 107 L 176 87.5 L 236 87.5 L 236 68 L 296 68"
            fill="none"
            stroke="#f8fafc"
            strokeWidth="2.6"
          />
          <line x1="82" y1="148" x2="296" y2="79" stroke="#d97706" strokeWidth="2.4" />

          {/* Diagonal Cyan Dashed Tangent Nosing Line */}
          <line x1="56" y1="126.5" x2="236" y2="68" stroke="#22d3ee" strokeWidth="2" strokeDasharray="5 3" />

          {/* Crossed-Out Perpendicular Line (Showing NEVER Measure Perpendicular to Stringer) */}
          <line x1="146" y1="68" x2="156" y2="94" stroke="#f43f5e" strokeWidth="1.4" strokeDasharray="2.5 2" />
          <line x1="152" y1="81" x2="158" y2="87" stroke="#f43f5e" strokeWidth="1.8" />
          <line x1="158" y1="81" x2="152" y2="87" stroke="#f43f5e" strokeWidth="1.8" />

          {/* ① & ② Bold Vertical (PLUMB 90°) Headroom Arrow From Header Underside to Tangent Nosing Line */}
          <line x1="146" y1="68" x2="146" y2="97" stroke="#22d3ee" strokeWidth="2.8" />
          <polygon points="146,68 142.5,75 149.5,75" fill="#22d3ee" />
          <polygon points="146,97 142.5,90 149.5,90" fill="#22d3ee" />
          {/* 90° Plumb Square Symbol under Header */}
          <polyline points="140,68 140,74 146,74" fill="none" stroke="#fde68a" strokeWidth="1.4" />

          {/* Non-Crossing Dashed Leader Lines */}
          {/* ① Straight Up from Stairwell Header Pinch Point to Row ① */}
          <line x1="141" y1="50" x2="141" y2="28" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="3 2.5" />
          {/* ② Left-Then-Down at x=42 from Plumb Line to Row ② */}
          <polyline points="146,84 42,84 42,155" fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3 2.5" />
          {/* ③ Right-Then-Down at x=344 (Clear of Landing & Row ②) into Row ③ */}
          <polyline points="296,42 344,42 344,190 252,190" fill="none" stroke="#34d399" strokeWidth="1.5" strokeDasharray="3 2.5" />

          {/* All Opaque #0a192f Pills & Callout Pins Drawn After Lines */}
          <CalloutPin x={22} y={19} num={1} variant="cyan" />
          <CadLabel x={39} y={19} align="start" text="CLEAR HEADROOM >= 1950mm PRIV • 2050mm PUB" fontSize={7.9} padX={3.8} color="#67e8f9" borderColor="#0284c7" />
          <CadLabel x={348} y={19} align="end" text="NBC 9.8.2.2" fontSize={7.9} padX={3.8} color="#67e8f9" borderColor="#0284c7" />

          <CadLabel x={196} y={60} text="PLUMB 90°" fontSize={7.5} padX={3.5} color="#fde68a" borderColor="#d97706" />

          <CalloutPin x={22} y={164} num={2} variant="amber" />
          <CadLabel x={39} y={164} align="start" text="MEASURE PLUMB FROM TANGENT NOSING LINE" fontSize={8} padX={4} color="#fde68a" borderColor="#d97706" />

          <CalloutPin x={22} y={190} num={3} variant="emerald" />
          <CadLabel x={39} y={190} align="start" text="R.O. = RUN x (DROP RISERS) + HDR THICKNESS" fontSize={7.9} padX={4} color="#6ee7b7" borderColor="#059669" />
        </g>
      )
    }
  }

  // 16B. A4.1 DETAIL 2 / 7 — STRINGER ATTACHMENT (Top Drop-Hanger Ledger + Bottom Thrust Kicker Plate)
  if (key.includes('stringer attachment')) {
    return {
      scaleLabel: 'DETAIL SCALE: TOP DROP LEDGER & BOTTOM KICKER (A4.1)',
      keys: [
        '① Top Plumb Cut & Drop Ledger: Because the top cut reduces stringer depth, hang stringers off a backed drop-ledger board or adjustable stringer connector (LSC) rather than toe-nailing the fragile top point.',
        '② Bottom Kicker / Thrust Plate: Notch the back of the bottom level cut over a securely fastened 2x4 kicker plate so downward stair loads cannot kick the stringer base outward.',
        '③ Concrete Moisture Separation: Whenever basement stair stringers or kickers rest on a concrete slab, install a closed-cell sill gasket or pressure-treated plate.'
      ],
      renderSvg: () => (
        <g>
          {/* Center Split Divider */}
          <line x1="176" y1="36" x2="176" y2="168" stroke="#334155" strokeWidth="1.2" strokeDasharray="4 3" />

          {/* LEFT SIDE: Top Doubled Header + Drop Hanger Board (Ledger) + LSCZ Strap Hanger */}
          <rect x="28" y="46" width="34" height="46" fill="#451a03" stroke="#fbbf24" strokeWidth="2" />
          <line x1="28" y1="46" x2="62" y2="92" stroke="#d97706" strokeWidth="1.1" />
          <line x1="62" y1="46" x2="28" y2="92" stroke="#d97706" strokeWidth="1.1" />
          <line x1="45" y1="46" x2="45" y2="92" stroke="#fbbf24" strokeWidth="1.4" />

          {/* 2x10 / Plywood Drop Hanger Ledger Board Extending Below Header */}
          <rect x="50" y="92" width="12" height="52" fill="#78350f" stroke="#22d3ee" strokeWidth="2" />

          {/* Sloped Cut Stringer Plumb Cut Bearing Tightly Against Drop Hanger Board */}
          <polygon
            points="62,96 108,96 108,122 156,122 156,158 62,142"
            fill="#1e293b"
            stroke="#f8fafc"
            strokeWidth="2"
          />

          {/* Concealed Stringer Strap Hanger (LSCZ) + Shear Nails */}
          <polyline points="62,106 62,144 82,147" fill="none" stroke="#38bdf8" strokeWidth="3.2" />
          <circle cx="56" cy="112" r="1.8" fill="#67e8f9" />
          <circle cx="56" cy="128" r="1.8" fill="#67e8f9" />
          <circle cx="72" cy="136" r="1.8" fill="#67e8f9" />

          {/* RIGHT SIDE: Bottom Stringer Level Cut Notched Over 2x4 P.T. Thrust Kicker Plate on Concrete Slab */}
          {/* Concrete Floor Slab */}
          <rect x="188" y="148" width="156" height="16" fill="#334155" stroke="#94a3b8" strokeWidth="1.8" />

          {/* ③ Closed-Cell Foam Sill Gasket / Moisture Capillary Break on Slab */}
          <line x1="208" y1="146" x2="330" y2="146" stroke="#34d399" strokeWidth="3.5" />

          {/* ② 2x4 Treated Thrust Kicker Plate Anchored to Floor */}
          <rect x="216" y="130" width="28" height="15" fill="#065f46" stroke="#fbbf24" strokeWidth="2" />
          <line x1="216" y1="130" x2="244" y2="145" stroke="#fde68a" strokeWidth="1.1" />
          <line x1="244" y1="130" x2="216" y2="145" stroke="#fde68a" strokeWidth="1.1" />
          {/* Concrete Anchor Fastener Through Kicker */}
          <line x1="230" y1="126" x2="230" y2="158" stroke="#38bdf8" strokeWidth="2.2" />

          {/* Bottom of Cut Stringer Notched Tightly Over Kicker Plate */}
          <polygon
            points="206,70 244,70 244,95 284,95 284,120 324,120 324,144 244,144 244,130 216,130 206,108"
            fill="#1e293b"
            stroke="#f8fafc"
            strokeWidth="2"
          />

          {/* Non-Crossing Dashed Leader Lines */}
          {/* ① Straight Up from Top Header / Drop Ledger */}
          <line x1="56" y1="46" x2="56" y2="29" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="3 2.5" />
          <polyline points="62,102 80,58 88,58" fill="none" stroke="#22d3ee" strokeWidth="1.2" strokeDasharray="2.5 2" />
          {/* ② Left-Then-Up at x=196 (In Clear Gap Right of Divider) to Top Row ② */}
          <polyline points="216,136 196,136 196,32" fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3 2.5" />
          {/* ③ Straight Down from Sill Gasket at x=246 into Bottom Row ③ */}
          <line x1="246" y1="148" x2="246" y2="179" stroke="#34d399" strokeWidth="1.5" strokeDasharray="3 2.5" />

          {/* All Opaque #0a192f Pills & Callout Pins Drawn After Lines */}
          <CalloutPin x={20} y={20} num={1} variant="cyan" />
          <CadLabel x={36} y={20} align="start" text="TOP DROP LEDGER + LSC HANGER" fontSize={7.7} padX={3.5} color="#67e8f9" borderColor="#0284c7" />

          <CalloutPin x={192} y={20} num={2} variant="amber" />
          <CadLabel x={208} y={20} align="start" text="2x4 THRUST KICKER PLATE" fontSize={7.7} padX={3.5} color="#fde68a" borderColor="#d97706" />

          <CadLabel x={118} y={58} text="DROP LEDGER" fontSize={7.4} padX={3.5} color="#67e8f9" borderColor="#0284c7" />
          <CadLabel x={304} y={62} text="STOPS SLIDING" fontSize={7.4} padX={3.5} color="#fde68a" borderColor="#d97706" />

          <CalloutPin x={22} y={188} num={3} variant="emerald" />
          <CadLabel x={39} y={188} align="start" text="SILL GASKET OR P.T. PLATE ON CONCRETE SLAB" fontSize={8} padX={4} color="#6ee7b7" borderColor="#059669" />
          <CadLabel x={348} y={188} align="end" text="NBC 9.23.7" fontSize={8} padX={4} color="#6ee7b7" borderColor="#059669" />
        </g>
      )
    }
  }

  // 16C. A4.1 DETAIL 3 / 7 — HANDRAIL HEIGHT (865–1070mm Plumb Slope, >=50mm Wall Clearance & Graspable Profile)
  if (key.includes('handrail height')) {
    return {
      scaleLabel: 'DETAIL SCALE: HANDRAIL HEIGHT & WALL CLEARANCE (A4.1)',
      keys: [
        '① 865mm–1070mm Height Range (NBC 9.8.7.4): Measured vertically from the tangent nosing line to the top surface of the handrail (≥ 1 row required on all interior stairs with > 2 risers / exterior > 3 risers).',
        '② Wall Clearance (NBC 9.8.7.5): Maintain at least 50mm (2") clear space between the handrail and smooth walls (60mm / 2-3/8" against rough surfaces) so a hand never scrapes the wall.',
        '③ Graspability & Terminations: Circular rails must be 30mm–43mm (1-3/16"–1-11/16") in diameter and return smoothly into walls or newel posts so clothing/straps cannot catch.'
      ],
      renderSvg: () => (
        <g>
          {/* LEFT SIDE: Sloped Stair Elevation, Nosing Line & Returned Handrail */}
          <path
            d="M 34 148 L 34 134 L 78 134 L 78 120 L 122 120 L 122 106 L 166 106 L 166 92 L 188 92"
            fill="none"
            stroke="#f8fafc"
            strokeWidth="2.4"
          />
          {/* Dashed Tangent Nosing Line */}
          <line x1="34" y1="134" x2="166" y2="92" stroke="#38bdf8" strokeWidth="1.6" strokeDasharray="4 3" />

          {/* Sloped Continuous Handrail w/ Smooth Anti-Snag Wall Return Ends */}
          <path
            d="M 26 98 L 26 90 L 34 90 L 166 48 L 176 48 L 176 56"
            fill="none"
            stroke="#fbbf24"
            strokeWidth="3.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Wall Brackets */}
          <polyline points="56,83 56,92 64,92" fill="none" stroke="#94a3b8" strokeWidth="1.8" />
          <polyline points="144,55 144,64 152,64" fill="none" stroke="#94a3b8" strokeWidth="1.8" />

          {/* ① Plumb Vertical Dimension Arrow (865mm–1070mm / 34"–42") */}
          <line x1="100" y1="69" x2="100" y2="113" stroke="#22d3ee" strokeWidth="2.4" />
          <polygon points="100,69 96.5,76 103.5,76" fill="#22d3ee" />
          <polygon points="100,113 96.5,106 103.5,106" fill="#22d3ee" />

          {/* RIGHT SIDE: Wall Clearance & Circular Graspable Profile Cross-Section Inset */}
          <rect x="204" y="38" width="144" height="110" rx="5" fill="#0d1f38" stroke="#334155" strokeWidth="1.5" />
          {/* Smooth Stud/Drywall Wall */}
          <rect x="214" y="48" width="16" height="90" fill="#1e293b" stroke="#94a3b8" strokeWidth="1.8" />
          {/* L-Shaped Wall Bracket */}
          <polyline points="230,116 274,116 274,98" fill="none" stroke="#cbd5e1" strokeWidth="2.8" />
          {/* ③ Circular Handrail Cross-Section (Ø 30mm–43mm) */}
          <circle cx="274" cy="84" r="14" fill="#451a03" stroke="#fbbf24" strokeWidth="2.6" />
          {/* Diameter Callout Bar Above Rail */}
          <line x1="260" y1="64" x2="260" y2="84" stroke="#34d399" strokeWidth="1.2" strokeDasharray="2 2" />
          <line x1="288" y1="64" x2="288" y2="84" stroke="#34d399" strokeWidth="1.2" strokeDasharray="2 2" />
          <line x1="260" y1="66" x2="288" y2="66" stroke="#34d399" strokeWidth="1.8" />

          {/* ② Horizontal Clear Finger Space Arrow (>= 50mm / 2" to Wall) */}
          <line x1="230" y1="84" x2="260" y2="84" stroke="#fbbf24" strokeWidth="2.2" />
          <polygon points="230,84 236,81 236,87" fill="#fbbf24" />
          <polygon points="260,84 254,81 254,87" fill="#fbbf24" />

          {/* Non-Crossing Dashed Leader Lines */}
          {/* ① Straight Up from Plumb Rail Height Arrow */}
          <line x1="100" y1="69" x2="100" y2="28" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="3 2.5" />
          {/* ② Straight Down from Wall Finger Clearance Arrow at x=244 into Row ② */}
          <line x1="244" y1="84" x2="244" y2="155" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3 2.5" />
          {/* ③ Right-Then-Down at x=340 (Clear of Inset Pills & Row ②) into Row ③ */}
          <polyline points="288,66 340,66 340,190 245,190" fill="none" stroke="#34d399" strokeWidth="1.5" strokeDasharray="3 2.5" />

          {/* All Opaque #0a192f Pills & Callout Pins Drawn After Lines */}
          <CalloutPin x={22} y={19} num={1} variant="cyan" />
          <CadLabel x={39} y={19} align="start" text="RAIL HEIGHT: 865-1070mm (34&quot;-42&quot;) PLUMB" fontSize={8} padX={4} color="#67e8f9" borderColor="#0284c7" />
          <CadLabel x={348} y={19} align="end" text="NBC 9.8.7.4" fontSize={8} padX={4} color="#67e8f9" borderColor="#0284c7" />

          <CadLabel x={56} y={56} text="34&quot;-42&quot;" fontSize={7.6} padX={3.5} color="#67e8f9" borderColor="#0284c7" />
          <CadLabel x={315} y={84} text="Ø30-43mm" fontSize={7.3} padX={3} color="#6ee7b7" borderColor="#059669" />
          <CadLabel x={290} y={134} text=">=50mm GAP" fontSize={7.3} padX={3} color="#fde68a" borderColor="#d97706" />

          <CalloutPin x={22} y={164} num={2} variant="amber" />
          <CadLabel x={39} y={164} align="start" text=">= 50mm (2&quot;) WALL GAP (60mm ROUGH MASONRY)" fontSize={7.9} padX={4} color="#fde68a" borderColor="#d97706" />

          <CalloutPin x={22} y={190} num={3} variant="emerald" />
          <CadLabel x={39} y={190} align="start" text="30-43mm GRASPABLE DIA + WALL RETURN ENDS" fontSize={8} padX={4} color="#6ee7b7" borderColor="#059669" />
        </g>
      )
    }
  }

  // 16D. A4.1 DETAIL 4 / 7 — GUARDS & HANDRAILS (900mm/1070mm Guard Height, 100mm Sphere & Non-Climbable Zone)
  if (key.includes('guard')) {
    return {
      scaleLabel: 'DETAIL SCALE: GUARD HEIGHT & 100mm SPHERE RULE (A4.1)',
      keys: [
        '① When Guards Are Mandatory (NBC 9.8.8.1): Required wherever a stair, landing, or deck surface is > 600mm (24") above the adjacent grade or floor (min 900mm / 36" inside dwelling; 1070mm / 42" if exterior drop exceeds 1.8m / 6\').',
        '② 100mm (4") Sphere Rule (NBC 9.8.8.5): Openings through any guard must prevent the passage of a 100mm (4") diameter sphere to protect small children.',
        '③ Non-Climbable Zone (NBC 9.8.8.6): No horizontal rails, cable rungs, or decorative footholds are permitted between 140mm (5.5") and 900mm (36") above the stair/floor that would facilitate climbing.'
      ],
      renderSvg: () => (
        <g>
          {/* Landing / Deck Floor Surface (> 600mm / 24" Above Grade) */}
          <rect x="34" y="142" width="268" height="8" fill="#334155" stroke="#cbd5e1" strokeWidth="1.8" />

          {/* Left & Right 4x4 Structural Guard Newel Posts */}
          <rect x="74" y="46" width="12" height="96" fill="#451a03" stroke="#fbbf24" strokeWidth="2" />
          <rect x="248" y="46" width="12" height="96" fill="#451a03" stroke="#fbbf24" strokeWidth="2" />

          {/* Top Guard Rail & Bottom Shoe Rail */}
          <rect x="70" y="50" width="194" height="8" fill="#78350f" stroke="#fbbf24" strokeWidth="2" />
          <rect x="86" y="130" width="162" height="6" fill="#78350f" stroke="#fbbf24" strokeWidth="1.6" />

          {/* Vertical Balusters (Spindles) Spaced < 100mm (4") Clear */}
          {[104, 126, 160, 182, 204, 226].map((bx, i) => (
            <rect key={i} x={bx} y="58" width="5" height="72" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
          ))}

          {/* ① Guard Height Vertical Dimension Arrow (900mm Int / 1070mm Ext) */}
          <line x1="42" y1="50" x2="68" y2="50" stroke="#22d3ee" strokeWidth="1.3" strokeDasharray="2.5 2" />
          <line x1="48" y1="50" x2="48" y2="142" stroke="#22d3ee" strokeWidth="2.4" />
          <polygon points="48,50 44.5,57 51.5,57" fill="#22d3ee" />
          <polygon points="48,142 44.5,135 51.5,135" fill="#22d3ee" />

          {/* ② Ø100mm (4") Test Sphere Blocked Between Adjacent Balusters */}
          <circle cx="145.5" cy="94" r="16.5" fill="#881337" opacity="0.58" stroke="#fb7185" strokeWidth="2.2" />
          <line x1="139" y1="87.5" x2="152" y2="100.5" stroke="#fda4af" strokeWidth="2" />
          <line x1="152" y1="87.5" x2="139" y2="100.5" stroke="#fda4af" strokeWidth="2" />

          {/* ③ Non-Climbable Zone (140mm to 900mm Above Floor — Zero Horizontal Footholds) */}
          <rect
            x="266"
            y="50"
            width="16"
            height="78"
            fill="#064e3b"
            opacity="0.32"
            stroke="#34d399"
            strokeWidth="1.6"
            strokeDasharray="3 2"
          />
          <line x1="268" y1="89" x2="280" y2="89" stroke="#f43f5e" strokeWidth="2" />
          <line x1="270" y1="85" x2="278" y2="93" stroke="#f43f5e" strokeWidth="1.8" />
          <line x1="278" y1="85" x2="270" y2="93" stroke="#f43f5e" strokeWidth="1.8" />

          {/* Non-Crossing Dashed Leader Lines */}
          {/* ① Straight Up from Guard Height Arrow */}
          <line x1="48" y1="50" x2="48" y2="28" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="3 2.5" />
          {/* ② Straight Down from Ø100mm Sphere to Row ② */}
          <line x1="145.5" y1="111" x2="145.5" y2="155" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3 2.5" />
          {/* ③ Straight Down at x=274 (Clear of Row ②) into Row ③ */}
          <polyline points="274,128 274,190 239,190" fill="none" stroke="#34d399" strokeWidth="1.5" strokeDasharray="3 2.5" />

          {/* All Opaque #0a192f Pills & Callout Pins Drawn After Lines */}
          <CalloutPin x={22} y={19} num={1} variant="cyan" />
          <CadLabel x={39} y={19} align="start" text="GUARD: >= 900mm (36&quot;) INT • >= 1070mm (42&quot;) EXT" fontSize={7.8} padX={3.8} color="#67e8f9" borderColor="#0284c7" />
          <CadLabel x={348} y={19} align="end" text="NBC 9.8.8" fontSize={7.8} padX={3.8} color="#67e8f9" borderColor="#0284c7" />

          <CadLabel x={288} y={89} align="start" text="NO RUNGS" fontSize={7.3} padX={3} color="#6ee7b7" borderColor="#059669" />

          <CalloutPin x={22} y={164} num={2} variant="amber" />
          <CadLabel x={39} y={164} align="start" text="MAX 100mm (4&quot;) SPHERE OPENING RULE" fontSize={8} padX={4} color="#fde68a" borderColor="#d97706" />

          <CalloutPin x={22} y={190} num={3} variant="emerald" />
          <CadLabel x={39} y={190} align="start" text="NON-CLIMBABLE ZONE: 140mm TO 900mm HIGH" fontSize={8} padX={4} color="#6ee7b7" borderColor="#059669" />
        </g>
      )
    }
  }

  // 16E. A4.1 DETAIL 5 / 7 — FIRST RISER & NOSING DROP ("Dropping the Stringer" & Tread Nosing Profile)
  if (key.includes('first riser') || key.includes('nosing drop')) {
    return {
      scaleLabel: 'DETAIL SCALE: STRINGER DROP & NOSING PROFILE (A4.1)',
      keys: [
        '① "Dropping the Stringer" Formula: Cut the bottom stringer riser shorter by (Finished Tread Thickness - Lower Finished Floor Thickness) so the finished first step isn\'t too tall!',
        '② Nosing Projection & Radius (NBC 9.8.4.4): Tread nosings must project no more than 38mm (1-1/2") with a curved radius 6mm–13mm (or bevel) to prevent heel-catch tripping.',
        '③ Landing Length & Width (NBC 9.8.6): Stair landings must be at least as wide and as long as the width of the stair (min 900mm × 900mm / 36" × 36").'
      ],
      renderSvg: () => (
        <g>
          {/* Center Split Divider */}
          <line x1="184" y1="38" x2="184" y2="148" stroke="#334155" strokeWidth="1.2" strokeDasharray="4 3" />

          {/* LEFT SIDE: Bottom Stringer Finishing Drop ("Dropping the Stringer") */}
          {/* Rough Subfloor + Lower Finished Floor */}
          <rect x="22" y="144" width="152" height="6" fill="#334155" stroke="#94a3b8" strokeWidth="1.5" />
          <rect x="22" y="140" width="152" height="4" fill="#065f46" stroke="#34d399" strokeWidth="1.2" />

          {/* Cut Stringer Profile w/ Shortened Bottom Riser (R1 Cut = 36px vs R2 = 40px) */}
          <polygon
            points="72,144 72,108 124,108 124,68 170,68 170,104 114,144"
            fill="#1e293b"
            stroke="#cbd5e1"
            strokeWidth="1.8"
          />
          {/* Shaved-Off 1" Drop Zone Indicated in Dashed Cyan at Base */}
          <rect
            x="72"
            y="136"
            width="42"
            height="8"
            fill="#0891b2"
            opacity="0.28"
            stroke="#22d3ee"
            strokeWidth="1.4"
            strokeDasharray="3 2"
          />

          {/* 25mm (1") Hardwood Finished Treads Added On Top -> Equal 40px Finished Risers! */}
          <rect x="64" y="100" width="60" height="8" rx="2" fill="#d97706" stroke="#fde68a" strokeWidth="1.8" />
          <rect x="116" y="60" width="54" height="8" rx="2" fill="#d97706" stroke="#fde68a" strokeWidth="1.8" />

          {/* Equal Finished Riser 1 Dimension Arrow (y=100..140) */}
          <line x1="42" y1="100" x2="62" y2="100" stroke="#22d3ee" strokeWidth="1.2" strokeDasharray="2.5 2" />
          <line x1="48" y1="100" x2="48" y2="140" stroke="#22d3ee" strokeWidth="2.2" />
          <polygon points="48,100 45,106 51,106" fill="#22d3ee" />
          <polygon points="48,140 45,134 51,134" fill="#22d3ee" />

          {/* RIGHT SIDE: Zoomed Tread Nosing Projection (19mm–38mm) & Rounded Edge */}
          {/* Vertical Solid Riser Board */}
          <rect x="242" y="86" width="8" height="56" fill="#1e293b" stroke="#cbd5e1" strokeWidth="2" />
          {/* 25mm (1") Hardwood Tread w/ Curved 6–13mm Radius Nosing Overhanging Riser */}
          <path
            d="M 220 68 L 336 68 L 336 86 L 220 86 Q 212 86 212 77 Q 212 68 220 68 Z"
            fill="#78350f"
            stroke="#fbbf24"
            strokeWidth="2.2"
          />

          {/* ② Horizontal Nosing Projection Arrow (19mm–38mm / 3/4"–1-1/2") */}
          <line x1="212" y1="50" x2="212" y2="72" stroke="#fbbf24" strokeWidth="1.2" strokeDasharray="2.5 2" />
          <line x1="242" y1="50" x2="242" y2="66" stroke="#fbbf24" strokeWidth="1.2" strokeDasharray="2.5 2" />
          <line x1="212" y1="54" x2="242" y2="54" stroke="#fbbf24" strokeWidth="2.2" />
          <polygon points="212,54 218,51 218,57" fill="#fbbf24" />
          <polygon points="242,54 236,51 236,57" fill="#fbbf24" />

          {/* Non-Crossing Dashed Leader Lines */}
          {/* ① Straight Up from Dropped First Riser */}
          <line x1="72" y1="98" x2="72" y2="28" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="3 2.5" />
          {/* ② Straight Down from Nosing Overhang at x=226 into Row ② */}
          <line x1="226" y1="86" x2="226" y2="155" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3 2.5" />
          {/* ③ Right-Then-Down at x=336 (Clear of Row ②) into Row ③ */}
          <polyline points="250,134 336,134 336,190 258,190" fill="none" stroke="#34d399" strokeWidth="1.5" strokeDasharray="3 2.5" />

          {/* All Opaque #0a192f Pills & Callout Pins Drawn After Lines */}
          <CalloutPin x={22} y={19} num={1} variant="cyan" />
          <CadLabel x={39} y={19} align="start" text="BOTTOM DROP = TREAD THICK (1&quot;) - LOWER FLOOR" fontSize={7.9} padX={3.8} color="#67e8f9" borderColor="#0284c7" />
          <CadLabel x={348} y={19} align="end" text="NBC 9.8.4" fontSize={7.9} padX={3.8} color="#67e8f9" borderColor="#0284c7" />

          <CadLabel x={84} y={46} align="start" text="EQUAL RISERS" fontSize={7.3} padX={3} color="#67e8f9" borderColor="#0284c7" />
          <CadLabel x={248} y={54} align="start" text="<=38mm NOSING" fontSize={7.3} padX={3} color="#fde68a" borderColor="#d97706" />
          <CadLabel x={258} y={110} align="start" text="6-13mm RADIUS" fontSize={7.3} padX={3} color="#6ee7b7" borderColor="#059669" />

          <CalloutPin x={22} y={164} num={2} variant="amber" />
          <CadLabel x={39} y={164} align="start" text="NOSING: 19-38mm (3/4&quot;-1.5&quot;) W/ RADIUS/BEVEL" fontSize={7.9} padX={4} color="#fde68a" borderColor="#d97706" />

          <CalloutPin x={22} y={190} num={3} variant="emerald" />
          <CadLabel x={39} y={190} align="start" text="SOLID RISER (<=100mm OPEN) • LANDING >=900mm" fontSize={7.8} padX={4} color="#6ee7b7" borderColor="#059669" />
        </g>
      )
    }
  }

  // 16F. A4.1 DETAIL 6 / 7 — STRINGER EFFECTIVE DEPTH (2x12 >=90mm Throat, 900mm Spacing & <=3.6m Span)
  if (key.includes('effective depth') || key.includes('stringer')) {
    return {
      scaleLabel: 'DETAIL SCALE: 2x12 STRINGER THROAT & SPACING (A4.1)',
      keys: [
        '① 90mm (3-1/2") Throat Rule (NBC 9.8.9.4): Cut wood stringers must retain at least 90mm (3-1/2") of effective uncut depth measured perpendicularly from the bottom edge to the deepest notch corner (2x12 required).',
        '② Stringer Spacing & Tread Thickness: Stringers are spaced max 900mm (36") apart (1200mm / 48" if stringers are housed/routed) with min 25mm (1") thick treads (38mm / 1.5" if open risers).',
        '③ Unsupported Span Limit: Cut 2x12 stringers are limited to a 3.6m (12\'-0") unsupported span unless supported by an intermediate stud wall.'
      ],
      renderSvg: () => (
        <g>
          {/* LEFT PANEL (x=18..152): Stair Flight Cross-Section Inset (Stringer Spacing & Housed Option) */}
          <rect x="18" y="38" width="134" height="110" rx="5" fill="#0d1f38" stroke="#334155" strokeWidth="1.5" />
          {/* 25mm (1") Tread Across 3 Stringers (Right Stringer Housed/Routed) */}
          <rect x="30" y="78" width="108" height="8" fill="#78350f" stroke="#fde68a" strokeWidth="1.8" />
          <rect x="32" y="86" width="8" height="38" fill="#451a03" stroke="#fbbf24" strokeWidth="1.5" />
          <rect x="81" y="86" width="8" height="38" fill="#451a03" stroke="#fbbf24" strokeWidth="1.5" />
          <rect x="130" y="72" width="8" height="52" fill="#451a03" stroke="#38bdf8" strokeWidth="1.6" />
          {/* Overall <= 900mm (36") Spacing Arrow */}
          <line x1="36" y1="66" x2="134" y2="66" stroke="#fbbf24" strokeWidth="2" />
          <polygon points="36,66 42,63 42,69" fill="#fbbf24" />
          <polygon points="134,66 128,63 128,69" fill="#fbbf24" />

          {/* RIGHT PANEL (x=164..346): Zoomed 2x12 Cut Stair Stringer Effective Throat & Span */}
          <polygon
            points="170,136 170,110 224,110 224,84 278,84 278,58 334,58 334,96 198,144"
            fill="#451a03"
            stroke="#fbbf24"
            strokeWidth="2"
          />
          {/* Dashed Notch Root Line */}
          <line x1="170" y1="136" x2="278" y2="84" stroke="#94a3b8" strokeWidth="1.3" strokeDasharray="4 3" />
          {/* Red 2x10 Too-Shallow Comparison Line */}
          <line x1="190" y1="136" x2="334" y2="85" stroke="#f43f5e" strokeWidth="1.3" strokeDasharray="3 2.5" />

          {/* ① Perpendicular Effective Uncut Throat Depth Arrow (>= 90mm / 3-1/2") */}
          <line x1="224" y1="110" x2="235" y2="131" stroke="#22d3ee" strokeWidth="2.6" />
          <polygon points="224,110 224,117 230,114" fill="#22d3ee" />
          <polygon points="235,131 235,124 229,127" fill="#22d3ee" />

          {/* ③ Unsupported Span Dimension Arrow Parallel Below Stringer (<= 3.6m / 12'-0") */}
          <line x1="206" y1="149" x2="338" y2="103" stroke="#34d399" strokeWidth="2" />
          <polygon points="206,149 214,143 215,149" fill="#34d399" />
          <polygon points="338,103 330,103 331,109" fill="#34d399" />

          {/* 3 Straight Vertical Non-Crossing Dashed Leader Lines */}
          {/* ① Straight Up at x=224 into Row ① */}
          <line x1="224" y1="84" x2="224" y2="28" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="3 2.5" />
          {/* ② Straight Down from Stringer Spacing Inset at x=85 into Row ② */}
          <line x1="85" y1="124" x2="85" y2="155" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3 2.5" />
          {/* ③ Straight Down at x=292 (Right of Row ②) into Row ③ */}
          <polyline points="292,119 292,190 250,190" fill="none" stroke="#34d399" strokeWidth="1.5" strokeDasharray="3 2.5" />

          {/* All Opaque #0a192f Pills & Callout Pins Drawn After Lines */}
          <CalloutPin x={22} y={19} num={1} variant="cyan" />
          <CadLabel x={39} y={19} align="start" text="UNCUT THROAT >= 90mm (3-1/2&quot;) — USE 2x12" fontSize={8} padX={4} color="#67e8f9" borderColor="#0284c7" />
          <CadLabel x={348} y={19} align="end" text="NBC 9.8.9.4" fontSize={8} padX={4} color="#67e8f9" borderColor="#0284c7" />

          <CadLabel x={85} y={48} text="3 STRINGERS (36&quot;)" fontSize={7.3} padX={3} color="#fde68a" borderColor="#d97706" />
          <CadLabel x={85} y={136} text="1200mm HOUSED" fontSize={7.2} padX={3} color="#cbd5e1" borderColor="#475569" />
          <CadLabel x={188} y={66} text="2x12 STOCK" fontSize={7.4} padX={3} color="#67e8f9" borderColor="#0284c7" />

          <CalloutPin x={22} y={164} num={2} variant="amber" />
          <CadLabel x={39} y={164} align="start" text="MAX SPACING: 900mm (36&quot;) O.C. (>=25mm TREAD)" fontSize={7.9} padX={4} color="#fde68a" borderColor="#d97706" />

          <CalloutPin x={22} y={190} num={3} variant="emerald" />
          <CadLabel x={39} y={190} align="start" text="MAX UNSUPPORTED SPAN <= 3.6m (12'-0&quot;)" fontSize={8} padX={4} color="#6ee7b7" borderColor="#059669" />
        </g>
      )
    }
  }

  // 16G. A4.1 DETAIL 7 / 7 — RISE & RUN TOLERANCES (Adjacent <= 5mm & Full Flight <= 10mm Variance)
  return {
    scaleLabel: `DETAIL SCALE: NBC 9.8.4.5 STAIR TOLERANCES (${sheetCode})`,
    keys: [
      '① Adjacent Step Tolerance (NBC 9.8.4.5): The height of adjacent risers or depth of adjacent treads must not vary by more than 5mm (3/16").',
      '② Full-Flight Tolerance (NBC 9.8.4.5): The difference between the tallest and shortest riser (or deepest and shallowest tread) in an entire flight must not exceed 10mm (3/8").',
      '③ Exact Rise Division: Always divide Total Rise (Finished Floor to Finished Floor) by the whole number of risers (N = Ceil(Total Rise / 200mm)) to get the exact decimal riser height down to 1/16".'
    ],
    renderSvg: () => (
      <g>
        {/* Lower Finished Floor Datum */}
        <line x1="28" y1="146" x2="80" y2="146" stroke="#94a3b8" strokeWidth="2" />

        {/* 3 Consecutive Stair Steps (Riser 1, Run 1, Riser 2, Run 2, Riser 3) */}
        <path
          d="M 68 146 L 68 114 L 138 114 L 138 82 L 208 82 L 208 50 L 268 50"
          fill="none"
          stroke="#f8fafc"
          strokeWidth="2.6"
        />
        <line x1="94" y1="148" x2="268" y2="68" stroke="#d97706" strokeWidth="2.4" />

        {/* ① Adjacent Step-to-Step Comparison Bracket (|R2 - R1| <= 5mm / 3/16") */}
        <line x1="58" y1="114" x2="58" y2="146" stroke="#22d3ee" strokeWidth="2" />
        <polygon points="58,114 55,120 61,120" fill="#22d3ee" />
        <polygon points="58,146 55,140 61,140" fill="#22d3ee" />

        <line x1="128" y1="82" x2="128" y2="114" stroke="#22d3ee" strokeWidth="2" />
        <polygon points="128,82 125,88 131,88" fill="#22d3ee" />
        <polygon points="128,114 125,108 131,108" fill="#22d3ee" />

        <polyline points="58,112 58,66 128,66 128,80" fill="none" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="3 2.5" />

        {/* ② Full-Flight Tallest vs. Shortest Step Caliper Comparison (<= 10mm / 3/8") */}
        <rect x="242" y="92" width="10" height="36" fill="#78350f" stroke="#fbbf24" strokeWidth="1.6" />
        <rect x="260" y="99" width="10" height="29" fill="#1e293b" stroke="#fbbf24" strokeWidth="1.6" />
        <line x1="242" y1="92" x2="276" y2="92" stroke="#fbbf24" strokeWidth="1.4" strokeDasharray="2 2" />
        <line x1="260" y1="99" x2="276" y2="99" stroke="#fbbf24" strokeWidth="1.4" strokeDasharray="2 2" />

        {/* ③ Total Floor-to-Floor Rise Vertical Arrow on Far Right */}
        <line x1="272" y1="50" x2="346" y2="50" stroke="#34d399" strokeWidth="1.2" strokeDasharray="2.5 2" />
        <line x1="342" y1="50" x2="342" y2="146" stroke="#34d399" strokeWidth="2.2" />
        <polygon points="342,50 338.5,57 345.5,57" fill="#34d399" />
        <polygon points="342,146 338.5,139 345.5,139" fill="#34d399" />

        {/* Non-Crossing Dashed Leader Lines */}
        {/* ① Straight Up from Adjacent Comparison Bracket to Row ① */}
        <line x1="93" y1="66" x2="93" y2="28" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="3 2.5" />
        {/* ② Straight Down from Flight Max/Min Bars at x=242 into Row ② */}
        <line x1="242" y1="128" x2="242" y2="155" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3 2.5" />
        {/* ③ Straight Down from Total Floor-to-Floor Rise Arrow at x=342 into Row ③ */}
        <polyline points="342,146 342,190 256,190" fill="none" stroke="#34d399" strokeWidth="1.5" strokeDasharray="3 2.5" />

        {/* All Opaque #0a192f Pills & Callout Pins Drawn After Lines */}
        <CalloutPin x={22} y={19} num={1} variant="cyan" />
        <CadLabel x={39} y={19} align="start" text="ADJACENT STEP VARIANCE <= 5mm (3/16&quot;) MAX" fontSize={8} padX={4} color="#67e8f9" borderColor="#0284c7" />
        <CadLabel x={348} y={19} align="end" text="NBC 9.8.4.5" fontSize={8} padX={4} color="#67e8f9" borderColor="#0284c7" />

        <CadLabel x={34} y={130} text="R1" fontSize={7.5} padX={3.5} color="#e2e8f0" borderColor="#475569" />
        <CadLabel x={102} y={98} text="R2" fontSize={7.5} padX={3.5} color="#e2e8f0" borderColor="#475569" />
        <CadLabel x={174} y={66} text="R3" fontSize={7.5} padX={3.5} color="#e2e8f0" borderColor="#475569" />
        <CadLabel x={306} y={110} text="<=10mm FLT" fontSize={7.3} padX={3} color="#fde68a" borderColor="#d97706" />

        <CalloutPin x={22} y={164} num={2} variant="amber" />
        <CadLabel x={39} y={164} align="start" text="FULL FLIGHT MAX-TO-MIN <= 10mm (3/8&quot;) MAX" fontSize={8} padX={4} color="#fde68a" borderColor="#d97706" />

        <CalloutPin x={22} y={190} num={3} variant="emerald" />
        <CadLabel x={39} y={190} align="start" text="UNIT RISE = TOTAL RISE / ROUNDED RISERS (N)" fontSize={7.9} padX={4} color="#6ee7b7" borderColor="#059669" />
      </g>
    )
  }
}

export default function CadSpotlightStage({
  sheetCode,
  sheetShortLabel,
  sheetTitle,
  activeItem,
  activeIndex,
  totalItems,
  onPrevDetail,
  onNextDetail,
  onPrevSheet,
  onNextSheet,
  currentSheetIndex,
  totalSheets
}) {
  const spec = getSpotlightSpec(activeItem?.title || '', sheetCode)

  return (
    <div className="bg-slate-900 border border-slate-700/90 rounded-2xl overflow-hidden shadow-xl">
      {/* Top Blueprint Sheet Header Bar with < Prev | Next > */}
      <div className="bg-slate-950/90 border-b border-slate-800 px-3 py-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="px-2 py-0.5 rounded-md bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-extrabold shrink-0">
            {sheetCode}
          </span>
          <h3 className="text-xs sm:text-sm font-extrabold text-white uppercase tracking-wide whitespace-nowrap truncate">
            {sheetTitle}
          </h3>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={onPrevSheet}
            disabled={currentSheetIndex === 0}
            className="flex items-center gap-0.5 px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 border border-slate-700 text-slate-200 text-[11px] font-bold whitespace-nowrap transition-colors"
          >
            <ChevronLeft size={13} />
            <span>Prev</span>
          </button>
          <button
            type="button"
            onClick={onNextSheet}
            disabled={currentSheetIndex === totalSheets - 1}
            className="flex items-center gap-0.5 px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 border border-slate-700 text-slate-200 text-[11px] font-bold whitespace-nowrap transition-colors"
          >
            <span>Next</span>
            <ChevronRight size={13} />
          </button>
        </div>
      </div>

      {/* Spotlight Sub-Header: Active Detail Name + < Prev Detail | Next Detail > */}
      <div className="bg-slate-900/95 border-b border-slate-800/90 px-3 py-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <Crosshair size={14} className="text-cyan-400 shrink-0" />
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 shrink-0">
            SPOTLIGHT:
          </span>
          <span className="text-xs sm:text-sm font-extrabold text-white uppercase whitespace-nowrap truncate">
            {activeItem?.title}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0 ml-auto">
          <button
            type="button"
            onClick={onPrevDetail}
            className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-[10px] font-bold whitespace-nowrap flex items-center gap-0.5"
          >
            <ChevronLeft size={12} />
            <span>Prev Detail</span>
          </button>
          <span className="text-[10px] font-mono font-bold text-slate-400 px-1.5 whitespace-nowrap">
            {activeIndex + 1} / {totalItems}
          </span>
          <button
            type="button"
            onClick={onNextDetail}
            className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-[10px] font-bold whitespace-nowrap flex items-center gap-0.5"
          >
            <span>Next Detail</span>
            <ChevronRight size={12} />
          </button>
        </div>
      </div>

      {/* 1:1 Zoomed CAD Detail Spotlight SVG Stage (viewBox="0 0 360 210") */}
      <div className="relative bg-[#071527] w-full">
        <svg
          viewBox="0 0 360 210"
          className="w-full h-auto block select-none"
          role="img"
          aria-label={`CAD Spotlight Diagram for ${activeItem?.title || sheetTitle}`}
        >
          <defs>
            <pattern id="cadSpotlightMinor" width="12" height="12" patternUnits="userSpaceOnUse">
              <path d="M 12 0 L 0 0 0 12" fill="none" stroke="rgba(56, 189, 248, 0.07)" strokeWidth="0.5" />
            </pattern>
            <pattern id="cadSpotlightMajor" width="60" height="60" patternUnits="userSpaceOnUse">
              <rect width="60" height="60" fill="url(#cadSpotlightMinor)" />
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(56, 189, 248, 0.14)" strokeWidth="0.9" />
            </pattern>
          </defs>

          {/* Blueprint Grid Background */}
          <rect width="360" height="210" fill="#071527" />
          <rect width="360" height="210" fill="url(#cadSpotlightMajor)" />
          <rect
            x="6"
            y="6"
            width="348"
            height="198"
            rx="4"
            fill="none"
            stroke="rgba(56, 189, 248, 0.35)"
            strokeWidth="1.2"
          />

          {/* Dynamic 1:1 Zoomed CAD Detail Graphic */}
          {spec.renderSvg()}
        </svg>
      </div>

      {/* 3-Point "HOW TO READ THIS SYMBOL" Key Bar Directly Beneath the SVG */}
      <div className="bg-slate-950 border-t border-slate-800 px-3.5 py-2.5">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
            <Layers size={12} />
            <span>HOW TO READ THIS SYMBOL • {sheetShortLabel}</span>
          </span>
          <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
            {spec.scaleLabel}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1.5">
          {spec.keys.map((kText, i) => (
            <div
              key={i}
              className="bg-slate-900/90 border border-slate-800 rounded-lg px-2.5 py-1.5 text-[11px] font-medium text-slate-200 leading-snug"
            >
              {kText}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
