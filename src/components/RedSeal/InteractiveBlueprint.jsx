import React from 'react';

const InteractiveBlueprint = ({ onElementClick, zoomLevel, theme, page, highlightedElement = null }) => {
  const colors = {
    'classic-blue': { bg: 'bg-blue-800', stroke: 'white', fill: 'white', hover: 'fill-blue-400', grid: 'rgba(255,255,255,0.3)' },
    'cad-dark': { bg: 'bg-slate-950', stroke: '#4ade80', fill: '#4ade80', hover: 'fill-green-400', grid: 'rgba(74,222,128,0.15)' },
    'light-print': { bg: 'bg-white', stroke: '#0f172a', fill: '#0f172a', hover: 'fill-slate-500', grid: 'rgba(15,23,42,0.1)' }
  };
  const currentColors = colors[theme] || colors['classic-blue'];

  return (
    <div className="w-full h-64 md:h-96 lg:h-[500px] overflow-auto border-2 border-slate-300 dark:border-slate-700 rounded-lg relative bg-slate-100 dark:bg-slate-900">
      <div 
        className={`transition-transform duration-200 origin-top-left ${currentColors.bg}`} 
        style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top left' }}
      >
        <svg viewBox="0 0 800 600" className="w-full h-full cursor-crosshair">
          <defs>
            {/* Minor Grid (10px) */}
            <pattern id="minorGrid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke={currentColors.grid} strokeWidth="0.5" />
            </pattern>
            {/* Major Grid (50px) */}
            <pattern id="majorGrid" width="50" height="50" patternUnits="userSpaceOnUse">
              <rect width="50" height="50" fill="url(#minorGrid)" />
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke={currentColors.grid} strokeWidth="1" />
            </pattern>
            {/* Cross-hatch pattern for load bearing walls */}
            <pattern id="hatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="8" stroke={theme === 'light-print' ? '#0f172a' : (theme === 'cad-dark' ? '#4ade80' : '#ffffff')} strokeWidth="1.5" opacity="0.35" />
            </pattern>
          </defs>

          {/* Background Grid */}
          <rect width="100%" height="100%" fill="url(#majorGrid)" />

          {page === 1 && (
            <g>
              {/* --- MULTI-STRING DIMENSIONING LAYER --- */}
              <g onClick={() => onElementClick('dimension-hierarchy')} className="cursor-pointer group">
                {/* ========================================================= */}
                {/* 1. TOP DIMENSION HIERARCHY (Horizontal)                  */}
                {/* ========================================================= */}

                {/* --- STRING 1: OUTER (Overall Building Dimension - Blue text, thicker lines) --- */}
                <g className="hover:opacity-80 transition-opacity">
                  <line 
                    x1="150" y1="35" x2="550" y2="35" 
                    stroke={theme === 'light-print' ? '#1d4ed8' : '#38bdf8'} 
                    strokeWidth="3" 
                  />
                  {/* Tick Marks */}
                  <path d="M 145 30 L 155 40 M 545 30 L 555 40" stroke={theme === 'light-print' ? '#1d4ed8' : '#38bdf8'} strokeWidth="3" />
                  {/* Overall Width Text */}
                  <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="350" y="27" fontSize="11" textAnchor="middle" className="font-mono tracking-wide" >
                    42'-0" (OVERALL WIDTH)
                  </text>
                  {/* Extension lines down to the corners */}
                  <line x1="150" y1="35" x2="150" y2="140" stroke={theme === 'light-print' ? '#1d4ed8' : '#38bdf8'} strokeWidth="1" strokeDasharray="3,3" />
                  <line x1="550" y1="35" x2="550" y2="140" stroke={theme === 'light-print' ? '#1d4ed8' : '#38bdf8'} strokeWidth="1" strokeDasharray="3,3" />
                </g>

                {/* --- STRING 2: MIDDLE (Wall breaks & jogs - White text, standard lines) --- */}
                <g className="hover:opacity-80 transition-opacity">
                  <line 
                    x1="150" y1="65" x2="300" y2="65" 
                    stroke={theme === 'light-print' ? '#0f172a' : '#ffffff'} 
                    strokeWidth="1.5" 
                  />
                  <line 
                    x1="300" y1="65" x2="550" y2="65" 
                    stroke={theme === 'light-print' ? '#0f172a' : '#ffffff'} 
                    strokeWidth="1.5" 
                  />
                  {/* Tick Marks */}
                  <path d="M 145 60 L 155 70 M 295 60 L 305 70 M 545 60 L 555 70" stroke={theme === 'light-print' ? '#0f172a' : '#ffffff'} strokeWidth="1.5" />
                  {/* Texts */}
                  <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="225" y="57" fontSize="9" textAnchor="middle" className="font-mono" >
                    15'-0" TO PARTITION
                  </text>
                  <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="425" y="57" fontSize="9" textAnchor="middle" className="font-mono" >
                    27'-0" TO EXT. WALL
                  </text>
                  {/* Centerline vertical extension */}
                  <line x1="300" y1="65" x2="300" y2="146" stroke={theme === 'light-print' ? '#0f172a' : '#ffffff'} strokeWidth="0.75" strokeDasharray="3,3" />
                </g>

                {/* --- STRING 3: INNER (Window R.O. locates - Yellow text, thinner lines) --- */}
                <g className="hover:opacity-80 transition-opacity">
                  <line x1="150" y1="95" x2="270" y2="95" stroke="#eab308" strokeWidth="1" />
                  <line x1="270" y1="95" x2="330" y2="95" stroke="#eab308" strokeWidth="1" />
                  <line x1="330" y1="95" x2="550" y2="95" stroke="#eab308" strokeWidth="1" />
                  {/* Tick Marks */}
                  <path d="M 145 90 L 155 100 M 265 90 L 275 100 M 325 90 L 335 100 M 545 90 L 555 100" stroke="#eab308" strokeWidth="1.2" />
                  {/* Texts */}
                  <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="210" y="87" fontSize="8" textAnchor="middle" className="font-mono">12'-0" TO W-1</text>
                  <g onClick={(e) => { e.stopPropagation(); onElementClick('window-rough-opening'); }} className="cursor-pointer group absolute z-10">
                    <circle cx="300" cy="75" r="7" fill="rgba(239, 68, 68, 0.2)" stroke="#ef4444" strokeWidth="1.5" className="animate-pulse" />
                    <circle cx="300" cy="75" r="3" fill="#ef4444" />
                    <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="300" y="87" fontSize="8" textAnchor="middle" className="font-mono group-hover:fill-red-400 transition-colors">6'-0" R.O. (W-1)</text>
                    <rect x="270" y="65" width="60" height="30" fill="transparent" />
                  </g>
                  <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="440" y="87" fontSize="8" textAnchor="middle" className="font-mono">26'-10"</text>
                  {/* Window R.O. centerlines extensions */}
                  <line x1="270" y1="95" x2="270" y2="136" stroke="#eab308" strokeWidth="0.5" strokeDasharray="2,2" />
                  <line x1="330" y1="95" x2="330" y2="136" stroke="#eab308" strokeWidth="0.5" strokeDasharray="2,2" />
                </g>


                {/* ========================================================= */}
                {/* 2. LEFT DIMENSION HIERARCHY (Vertical)                   */}
                {/* ========================================================= */}

                {/* --- STRING 1: OUTER (Overall Building Dimension - Blue text, thicker lines) --- */}
                <g className="hover:opacity-80 transition-opacity">
                  <line 
                    x1="40" y1="140" x2="40" y2="400" 
                    stroke={theme === 'light-print' ? '#1d4ed8' : '#38bdf8'} 
                    strokeWidth="3" 
                  />
                  {/* Tick Marks */}
                  <path d="M 35 135 L 45 145 M 35 395 L 45 405" stroke={theme === 'light-print' ? '#1d4ed8' : '#38bdf8'} strokeWidth="3" />
                  {/* Overall Height Text */}
                  <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="30" y="270" fontSize="11" textAnchor="middle" transform="rotate(-90 30 270)" className="font-mono tracking-wide" >
                    28'-0" (OVERALL HEIGHT)
                  </text>
                  {/* Extension lines across to left corners */}
                  <line x1="40" y1="140" x2="150" y2="140" stroke={theme === 'light-print' ? '#1d4ed8' : '#38bdf8'} strokeWidth="1" strokeDasharray="3,3" />
                  <line x1="40" y1="400" x2="150" y2="400" stroke={theme === 'light-print' ? '#1d4ed8' : '#38bdf8'} strokeWidth="1" strokeDasharray="3,3" />
                </g>

                {/* --- STRING 2: MIDDLE (Wall breaks & jogs - White text, standard lines) --- */}
                <g className="hover:opacity-80 transition-opacity">
                  <line 
                    x1="70" y1="140" x2="70" y2="250" 
                    stroke={theme === 'light-print' ? '#0f172a' : '#ffffff'} 
                    strokeWidth="1.5" 
                  />
                  <line 
                    x1="70" y1="250" x2="70" y2="400" 
                    stroke={theme === 'light-print' ? '#0f172a' : '#ffffff'} 
                    strokeWidth="1.5" 
                  />
                  {/* Tick Marks */}
                  <path d="M 65 135 L 75 145 M 65 245 L 75 255 M 65 395 L 75 405" stroke={theme === 'light-print' ? '#0f172a' : '#ffffff'} strokeWidth="1.5" />
                  {/* Texts */}
                  <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="60" y="195" fontSize="9" textAnchor="middle" transform="rotate(-90 60 195)" className="font-mono" >
                    11'-0" TO JOG
                  </text>
                  <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="60" y="325" fontSize="9" textAnchor="middle" transform="rotate(-90 60 325)" className="font-mono" >
                    17'-0" TO EXT. CORNER
                  </text>
                  {/* Centerline vertical extension */}
                  <line x1="70" y1="250" x2="150" y2="250" stroke={theme === 'light-print' ? '#0f172a' : '#ffffff'} strokeWidth="0.75" strokeDasharray="3,3" />
                </g>

                {/* --- STRING 3: INNER (Window R.O. locates - Yellow text, thinner lines) --- */}
                <g className="hover:opacity-80 transition-opacity">
                  <line x1="120" y1="140" x2="120" y2="200" stroke="#eab308" strokeWidth="1" />
                  <line x1="120" y1="200" x2="120" y2="240" stroke="#eab308" strokeWidth="1" />
                  <line x1="120" y1="240" x2="120" y2="400" stroke="#eab308" strokeWidth="1" />
                  {/* Tick Marks */}
                  <path d="M 115 135 L 125 145 M 115 195 L 125 205 M 115 235 L 125 245 M 115 395 L 125 405" stroke="#eab308" strokeWidth="1.2" />
                  {/* Texts */}
                  <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="110" y="170" fontSize="8" textAnchor="middle" transform="rotate(-90 110 170)" className="font-mono">6'-0" TO W-2</text>
                  <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="110" y="220" fontSize="8" textAnchor="middle" transform="rotate(-90 110 220)" className="font-mono">4'-0" R.O. (W-2)</text>
                  <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="110" y="320" fontSize="8" textAnchor="middle" transform="rotate(-90 110 320)" className="font-mono">18'-0"</text>
                  {/* Extension lines to left wall */}
                  <line x1="120" y1="200" x2="150" y2="200" stroke="#eab308" strokeWidth="0.5" strokeDasharray="2,2" />
                  <line x1="120" y1="240" x2="150" y2="240" stroke="#eab308" strokeWidth="0.5" strokeDasharray="2,2" />
                </g>

                {/* --- OVERALL INTERACTIVE HITBOXES --- */}
                {/* Horizontal Top Strings Hitbox */}
                <rect x="130" y="10" width="440" height="100" fill="transparent" />
                {/* Vertical Left Strings Hitbox */}
                <rect x="20" y="120" width="100" height="300" fill="transparent" />
              </g>

              {/* --- DETAILED EXTERIOR WALL ASSEMBLY --- */}
              <rect x="146" y="136" width="408" height="268" fill="none" stroke={currentColors.stroke} strokeWidth="0.75" strokeDasharray="1,2" opacity="0.8" />
              <rect x="150" y="140" width="400" height="260" fill="none" stroke={currentColors.stroke} strokeWidth="3" />
              <rect x="156" y="146" width="388" height="248" fill="none" stroke={currentColors.stroke} strokeWidth="0.75" opacity="0.7" />

              {/* --- INTERACTIVE WINDOW ASSEMBLY (W-1 Centered on top wall) --- */}
              <g onClick={() => onElementClick('window-symbol')} className="cursor-pointer group">
                <rect x="270" y="136" width="60" height="11" fill="rgba(30,58,138,0.3)" stroke={currentColors.stroke} strokeWidth="1.5" className="group-hover:fill-blue-600/30" />
                <line x1="270" y1="141" x2="330" y2="141" stroke={currentColors.stroke} strokeWidth="0.75" />
                <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="190" y="125" fontSize="8" className={`group-hover:${currentColors.hover} transition-colors font-mono`}>3-PLY 2x10 SPF HDR</text>
                <circle cx="300" cy="115" r="7" fill={theme === 'cad-dark' ? '#0f172a' : '#ffffff'} stroke={currentColors.stroke} strokeWidth="1" />
                <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="297" y="118" fontSize="8" className={`group-hover:${currentColors.hover}`}>A</text>
                <rect x="250" y="105" width="100" height="45" fill="transparent" />
              </g>

              {/* --- INTERACTIVE DOOR ASSEMBLY & SWING (D-1 Bottom Right) --- */}
              <g onClick={() => onElementClick('door-symbol')} className="cursor-pointer group">
                <rect x="470" y="395" width="50" height="11" fill={theme === 'cad-dark' ? '#020617' : '#ffffff'} />
                <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="410" y="380" fontSize="8" className={`group-hover:${currentColors.hover} font-mono`}>R.O. 3'-2" x 6'-8" (2-2x10 HDR)</text>
                <line x1="470" y1="400" x2="470" y2="350" stroke={currentColors.stroke} strokeWidth="3" className="group-hover:stroke-blue-400" />
                <path d="M 470 350 A 50 50 0 0 1 520 400" fill="none" stroke={currentColors.stroke} strokeWidth="1" strokeDasharray="3,3" className="group-hover:stroke-blue-400" />
                <circle cx="450" cy="365" r="7" fill={theme === 'cad-dark' ? '#0f172a' : '#ffffff'} stroke={currentColors.stroke} strokeWidth="1" />
                <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="447" y="368" fontSize="8" >1</text>
                <rect x="430" y="340" width="100" height="70" fill="transparent" />
              </g>

              {/* --- INTERACTIVE STAIRCASE DETAIL (UP 14R / 13T) --- */}
              <g onClick={() => onElementClick('stair-symbol')} className="cursor-pointer group">
                <rect x="156" y="270" width="85" height="120" fill="none" stroke={currentColors.stroke} strokeWidth="1" />
                {[...Array(12)].map((_, i) => {
                  const yVal = 270 + i * 10;
                  return (
                    <g key={i}>
                      <line x1="156" y1={yVal} x2="241" y2={yVal} stroke={currentColors.stroke} strokeWidth="1" />
                      <line x1="156" y1={yVal + 1.5} x2="241" y2={yVal + 1.5} stroke={currentColors.stroke} strokeWidth="0.5" strokeDasharray="1,1" opacity="0.6" />
                    </g>
                  );
                })}
                <line x1="159" y1="270" x2="159" y2="390" stroke={currentColors.stroke} strokeWidth="1.5" />
                <path d="M 198 380 L 198 280 L 193 290 M 198 280 L 203 290" fill="none" stroke={currentColors.stroke} strokeWidth="2.5" className="group-hover:stroke-yellow-400" />
                <circle cx="198" cy="380" r="3" fill={currentColors.fill} />
                <line x1="156" y1="310" x2="241" y2="310" stroke={currentColors.stroke} strokeWidth="1.5" strokeDasharray="4,4" />
                <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="162" y="322" fontSize="7" opacity="0.8">STAIRWELL HEADER ABOVE</text>
                <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="204" y="340" fontSize="8" className={`group-hover:${currentColors.hover} font-mono`}>UP 14R / 13T</text>
                <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="204" y="350" fontSize="7" className="opacity-70 font-mono">W/ HANDRAIL</text>
                <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="160" y="380" fontSize="7" className="opacity-60 font-mono">10" RUN / 7.5" RISE</text>
                <g onClick={(e) => { e.stopPropagation(); onElementClick('stair-rise-run'); }} className="cursor-pointer group absolute z-10">
                  <circle cx="215" cy="378" r="7" fill="rgba(239, 68, 68, 0.2)" stroke="#ef4444" strokeWidth="1.5" className="animate-pulse" />
                  <circle cx="215" cy="378" r="3" fill="#ef4444" />
                  <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="225" y="380" fontSize="8" className="font-mono group-hover:fill-red-400 transition-colors">Total Rise: 105", Total Run: 120"</text>
                  <rect x="205" y="370" width="150" height="15" fill="transparent" />
                </g>
                <rect x="156" y="270" width="85" height="120" fill="transparent" />
              </g>

              {/* --- INTERACTIVE INTERIOR WALLS & MECHANICAL WET CHASE --- */}
              {/* Load-Bearing Core Partition */}
              <g onClick={() => onElementClick('load-bearing-walls')} className="cursor-pointer group">
                <circle cx="302" cy="200" r="10" fill="rgba(245, 158, 11, 0.2)" stroke="#f59e0b" strokeWidth="2" className="animate-pulse" />
                <line x1="302" y1="200" x2="340" y2="180" stroke="#f59e0b" strokeWidth="1" className="group-hover:stroke-amber-400" />
                <rect 
                  x="296" y="146" width="12" height="244" 
                  fill="url(#hatch)" 
                  stroke={currentColors.stroke} 
                  strokeWidth="4" 
                  className="group-hover:stroke-amber-400 group-hover:opacity-100 transition-all" 
                />
                <rect x="296" y="146" width="12" height="244" fill="rgba(245,158,11,0.05)" className="opacity-0 group-hover:opacity-100 transition-opacity" pointerEvents="none" />
                <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="315" y="215" fontSize="8" className={`group-hover:${currentColors.hover} transition-colors tracking-wider`} >
                  LOAD-BEARING PARTITION (2x6 @ 16" O.C.)
                </text>
                {/* Interactive Hitbox */}
                <rect x="285" y="146" width="30" height="244" fill="transparent" />
              </g>

              {/* Non-Load-Bearing divider wall */}
              <g onClick={() => onElementClick('non-bearing-partition')} className="cursor-pointer group">
                <rect 
                  x="308" y="278" width="148" height="6" 
                  fill="none" 
                  stroke={currentColors.stroke} 
                  strokeWidth="1.5" 
                  className="group-hover:stroke-amber-400 transition-colors" 
                />
                <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="320" y="295" fontSize="7.5" className={`group-hover:${currentColors.hover} font-mono tracking-tight`} >
                  NON-BEARING PARTITION (2x4 @ 16" O.C. / NO HEADERS REQ.)
                </text>
                {/* Interactive Hitbox */}
                <rect x="308" y="270" width="148" height="32" fill="transparent" />
              </g>

              {/* Plumbing Chase (Wet Wall behind kitchen/bath) */}
              <g onClick={() => onElementClick('plumbing-chase-framing')} className="cursor-pointer group">
                <rect 
                  x="372" y="146" width="16" height="90" 
                  fill="rgba(30,58,138,0.25)" 
                  stroke={currentColors.stroke} 
                  strokeWidth="2.5" 
                  className="group-hover:stroke-amber-400 group-hover:fill-blue-600/10 transition-all" 
                />
                
                {/* Pipe 1: 3" ABS Soil Waste Stack */}
                <circle cx="380" cy="168" r="5" fill={theme === 'cad-dark' ? '#111827' : '#ffffff'} stroke="#3b82f6" strokeWidth="1.5" />
                <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="380" y="171.5" fontSize="8.5" textAnchor="middle" className="font-mono leading-none" >S</text>
                <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="395" y="171" fontSize="7" className="font-mono" >3" ABS SOIL STACK</text>

                {/* Pipe 2: Vent Line */}
                <circle cx="380" cy="198" r="4" fill={theme === 'cad-dark' ? '#111827' : '#ffffff'} stroke="#38bdf8" strokeWidth="1.2" />
                <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="380" y="201.2" fontSize="7" textAnchor="middle" className="font-mono leading-none" >V</text>
                <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="395" y="201" fontSize="7" className="font-mono" >2" VENT STACK</text>

                <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="395" y="130" fontSize="7.5" className="font-mono tracking-tighter" >
                  2x6 PLUMBING CHASE (WET WALL) W/ 3" ABS VENT STACK
                </text>

                {/* Interactive Hitbox */}
                <rect x="360" y="130" width="160" height="110" fill="transparent" pointerEvents="all" />
              </g>

              {/* === INTERACTIVE ELEMENT: ELEVATION MARKER === */}
              <g onClick={() => onElementClick('elevation-marker')} className="cursor-pointer group">
                <circle cx="80" cy="280" r="18" fill="rgba(255,255,255,0.05)" stroke={currentColors.stroke} strokeWidth="2" className="group-hover:fill-blue-500/40" />
                <polygon points="98,280 135,270 135,290" fill={currentColors.fill} className={`group-hover:${currentColors.hover}`} />
                <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="75" y="275" fontSize="12" >2</text>
                <line x1="62" y1="280" x2="98" y2="280" stroke={currentColors.stroke} strokeWidth="1" />
                <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="70" y="292" fontSize="10">A3</text>
                <rect x="60" y="220" width="60" height="60" fill="transparent" /> {/* Hitbox */}
              </g>

              {/* === INTERACTIVE ELEMENT: SECTION MARK === */}
              <g onClick={() => onElementClick('section-mark')} className="cursor-pointer group">
                <circle cx="200" cy="25" r="18" fill="rgba(255,255,255,0.05)" stroke={currentColors.stroke} strokeWidth="2" className="group-hover:fill-blue-500/40" />
                <path d="M 182 25 L 218 25" stroke={currentColors.stroke} strokeWidth="1" />
                <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="195" y="19" fontSize="12" >A</text>
                <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="188" y="37" fontSize="10">A4.2</text>
                <polygon points="218,25 230,17 230,33" fill={currentColors.fill} />
                <line x1="230" y1="25" x2="280" y2="25" stroke={currentColors.stroke} strokeWidth="2" strokeDasharray="8,4" />
                <rect x="170" y="5" width="120" height="60" fill="transparent" /> {/* Hitbox */}
              </g>

              {/* === INTERACTIVE ELEMENT: TITLE BLOCK === */}
              <g onClick={() => onElementClick('title-block')} className="cursor-pointer group transition-all">
                <rect x="520" y="420" width="260" height="160" fill="rgba(255,255,255,0.05)" stroke={currentColors.stroke} strokeWidth="2" className="group-hover:fill-blue-500/40" />
                <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="535" y="450" fontSize="18" >PROJECT: RSR-2026</text>
                <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="535" y="475" fontSize="14">DWG: A1.0 - MAIN FLOOR</text>
                <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="535" y="500" fontSize="14">SCALE: 1/4" = 1'-0"</text>
                <line x1="520" y1="520" x2="780" y2="520" stroke={currentColors.stroke} strokeWidth="1" />
                <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="535" y="550" fontSize="16" >REVISION:</text>
                <circle cx="635" cy="545" r="12" fill="none" stroke={currentColors.stroke} strokeWidth="2" />
                <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="630" y="550" fontSize="14" >3</text>
              </g>
            </g>
          )}

          {/* ================= PAGE 2: FOUNDATION & FRAMING PLAN ================= */}
          {page === 2 && (
            <g>
              {/* --- CONTINUOUS CONCRETE STRIP FOOTINGS --- */}
              <g onClick={(e) => { e.stopPropagation(); onElementClick('damp-proofing'); }} className="cursor-pointer group absolute z-10">
                <line x1="80" y1="160" x2="150" y2="160" stroke="#ef4444" strokeWidth="1.5" className="group-hover:stroke-red-300 transition-colors" />
                <polygon points="150,160 145,157 145,163" fill="#ef4444" />
                <circle cx="70" cy="160" r="7" fill="rgba(239, 68, 68, 0.2)" stroke="#ef4444" strokeWidth="1.5" className="animate-pulse" />
                <circle cx="70" cy="160" r="3" fill="#ef4444" />
                <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="30" y="150" fontSize="8" className="font-mono group-hover:fill-red-400 transition-colors">Damp-proofing</text>
                <rect x="20" y="140" width="130" height="30" fill="transparent" />
              </g>
              <g onClick={() => onElementClick('pad-footing')} className="cursor-pointer group">
                {/* Outer Footing Line projecting past foundation wall */}
                <rect x="135" y="125" width="430" height="290" fill="none" stroke={currentColors.stroke} strokeWidth="1.5" strokeDasharray="8,4" className="group-hover:stroke-amber-400 transition-colors" />
                {/* Inner Footing Line projecting past foundation wall */}
                <rect x="175" y="165" width="350" height="210" fill="none" stroke={currentColors.stroke} strokeWidth="1.5" strokeDasharray="8,4" className="group-hover:stroke-amber-400 transition-colors" />
                
                <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="180" y="115" fontSize="8" className="font-mono opacity-80 group-hover:fill-amber-400">20" x 10" CONTINUOUS CONCRETE STRIP FOOTING</text>
                <rect x="130" y="120" width="440" height="300" fill="transparent" pointerEvents="none" />
              </g>

              {/* --- DETAILED STEP FOOTING TRANSITIONS (NBC 9.15.3.9) --- */}
              <g onClick={() => onElementClick('pad-footing')} className="cursor-pointer group">
                <path d="M 135 220 L 150 220 M 135 250 L 150 250 M 142 220 L 142 250" stroke="#f59e0b" strokeWidth="2.5" />
                <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="5" y="222" fontSize="7" className="font-mono">STEP FOOTING DETAIL</text>
                <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="5" y="231" fontSize="6" className="opacity-80 font-mono">MAX 600mm (24") VERTICAL RISE</text>
                <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="5" y="239" fontSize="6" className="opacity-80 font-mono">MIN 600mm HORIZONTAL RUN</text>
                <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="5" y="247" fontSize="6" className="opacity-80 font-mono">(NBC 9.15.3.9 COMPLIANT)</text>
              </g>

              {/* --- FOUNDATION WALLS (Solid Concrete or ICF) --- */}
              <g onClick={() => onElementClick('interior-wall')} className="cursor-pointer group">
                <rect x="150" y="140" width="400" height="260" fill="none" stroke={currentColors.stroke} strokeWidth="4" className="group-hover:stroke-blue-400 transition-colors" />
                <rect x="160" y="150" width="380" height="240" fill="none" stroke={currentColors.stroke} strokeWidth="1.5" className="group-hover:stroke-blue-400 transition-colors" />
                <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="250" y="390" fontSize="8" className="font-mono">8" POURED CONCRETE FOUNDATION WALL</text>
              </g>
              <g onClick={(e) => { e.stopPropagation(); onElementClick('rebar-spacing'); }} className="cursor-pointer group absolute z-10">
                <circle cx="430" cy="387" r="7" fill="rgba(239, 68, 68, 0.2)" stroke="#ef4444" strokeWidth="1.5" className="animate-pulse" />
                <circle cx="430" cy="387" r="3" fill="#ef4444" />
                <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="440" y="390" fontSize="8" className="font-mono group-hover:fill-red-400 transition-colors">15M @ 400mm O.C.</text>
                <rect x="420" y="380" width="120" height="15" fill="transparent" />
              </g>

              {/* --- PRIMARY STEEL BEAM & TELEPOST LINE --- */}
              <g onClick={() => onElementClick('pad-footing')} className="cursor-pointer group">
                {/* Continuous W8x31 Steel Beam */}
                <line x1="150" y1="270" x2="550" y2="270" stroke="#38bdf8" strokeWidth="5" className="group-hover:stroke-blue-400 transition-colors" />
                <line x1="150" y1="270" x2="550" y2="270" stroke={currentColors.stroke} strokeWidth="1" strokeDasharray="15,5" />
                <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="280" y="260" fontSize="8" className="font-mono">W8x31 STEEL BEAM (PRIMARY SUPPORT)</text>

                {/* Telepost 1 on Pad Footing */}
                <rect x="235" y="255" width="30" height="30" fill="none" stroke={currentColors.stroke} strokeWidth="1.5" strokeDasharray="4,2" className="group-hover:stroke-yellow-400 transition-colors" />
                <circle cx="250" cy="270" r="5" fill="#e2e8f0" stroke="#0f172a" strokeWidth="1.5" />
                <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="180" y="295" fontSize="7" className="font-mono">3.5" HSS TELEPOST (T-1)</text>

                {/* Telepost 2 on Pad Footing */}
                <rect x="435" y="255" width="30" height="30" fill="none" stroke={currentColors.stroke} strokeWidth="1.5" strokeDasharray="4,2" className="group-hover:stroke-yellow-400 transition-colors" />
                <circle cx="450" cy="270" r="5" fill="#e2e8f0" stroke="#0f172a" strokeWidth="1.5" />
                <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="365" y="295" fontSize="7" className="font-mono">30"x30"x12" CONC. PAD W/ 2-15M REBAR</text>
              </g>

              {/* --- DRAINAGE & HYDROSTATIC RELIEF (Weeping Tile & Sump) --- */}
              <g onClick={() => onElementClick('weeping-tile')} className="cursor-pointer group">
                {/* Weeping Tile Loop */}
                <rect x="120" y="110" width="460" height="320" fill="none" stroke="#2563eb" strokeWidth="2" strokeDasharray="4,4" className="group-hover:stroke-blue-400 transition-colors" />
                <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="130" y="490" fontSize="7" className="font-mono">4" PERFORATED WEEPING TILE W/ FILTER SOCK COVERED BY MIN 150mm CRUSHED STONE</text>

                {/* Sump Pit */}
                <circle cx="205" cy="355" r="14" fill="none" stroke="#2563eb" strokeWidth="1.5" strokeDasharray="3,3" />
                <circle cx="205" cy="355" r="10" fill="none" stroke="#2563eb" strokeWidth="2" className="group-hover:stroke-blue-400" />
                <path d="M 197 355 L 213 355 M 205 347 L 205 363" stroke="#2563eb" strokeWidth="1" />
                <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="225" y="358" fontSize="7" className="font-mono text-blue-500">24" DIA. SUMP PIT W/ SUBMERSIBLE PUMP</text>
              </g>

              {/* --- KEYWAY & DOWEL DETAILS --- */}
              <g onClick={() => onElementClick('interior-wall')} className="cursor-pointer group">
                {/* Keyway annotation right */}
                <path d="M 580 320 L 552 320" stroke={currentColors.stroke} strokeWidth="1" />
                <polygon points="552,320 558,316 558,324" fill={currentColors.fill} />
                <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="590" y="323" fontSize="7" className="font-mono">BEVELED 2x4 KEYWAY AT ALL COLD JOINTS</text>

                {/* Dowel detail left */}
                <path d="M 120 180 L 148 180" stroke={currentColors.stroke} strokeWidth="1" />
                <polygon points="148,180 142,176 142,184" fill={currentColors.fill} />
                <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="10" y="173" fontSize="6.5" className="font-mono text-green-500">15M VERTICAL DOWELS @ 16" O.C. FOR ICF WALL CONNECTION</text>
              </g>

              {/* --- INTERACTIVE JOIST PENETRATION DETAIL --- */}
              <g onClick={() => onElementClick('joist-penetration')} className="cursor-pointer group">
                <rect x="280" y="420" width="120" height="60" fill="rgba(255,255,255,0.05)" stroke={currentColors.stroke} strokeWidth="1" strokeDasharray="2,2" />
                <rect x="290" y="440" width="100" height="20" fill="#f59e0b" opacity="0.3" stroke="#b45309" strokeWidth="2" />
                <circle cx="340" cy="450" r="10" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="2,2" className="group-hover:stroke-red-400" />
                <circle cx="340" cy="450" r="8" fill="rgba(56, 189, 248, 0.4)" stroke="#0ea5e9" strokeWidth="2" />
                <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="340" y="435" fontSize="7" textAnchor="middle" className="font-mono group-hover:fill-red-400">JOIST PENETRATION</text>
                <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="340" y="470" fontSize="5" textAnchor="middle" className="font-mono opacity-80">(MAX 1/4 DEPTH)</text>
                
                <circle cx="340" cy="450" r="15" fill="rgba(239, 68, 68, 0.2)" stroke="#ef4444" strokeWidth="1.5" className="animate-pulse opacity-50" />
              </g>

              {/* Frost Line */}
              <g onClick={() => onElementClick('frost-line')} className="cursor-pointer group">
                <rect x="180" y="130" width="340" height="240" fill="none" stroke="#2563eb" strokeWidth="2" strokeDasharray="6,4" className="group-hover:stroke-blue-400" />
                <circle cx="520" cy="370" r="4" fill="#2563eb" className="group-hover:fill-blue-400 animate-pulse" />
                <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="530" y="375" fontSize="10" className="font-mono group-hover:fill-blue-400">FROST LINE</text>
                <rect x="170" y="120" width="360" height="260" fill="transparent" stroke="transparent" strokeWidth="20" />
              </g>

              {/* --- TITLE BLOCK --- */}
              <g onClick={() => onElementClick('title-block')} className="cursor-pointer group transition-all">
                <rect x="520" y="420" width="260" height="160" fill="rgba(255,255,255,0.05)" stroke={currentColors.stroke} strokeWidth="2" className="group-hover:fill-blue-500/40" />
                <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="535" y="450" fontSize="18" >PROJECT: RSR-2026</text>
                <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="535" y="475" fontSize="14">DWG: S1.0 - FOUNDATION PLAN</text>
                <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="535" y="500" fontSize="14">SCALE: 1/4" = 1'-0"</text>
              </g>
            </g>
          )}

          {/* ================= PAGE 3: A/S SECTION DETAIL ================= */}
          {page === 3 && (
            <g>
              {/* Ground Earth Hatch / Soil Representation */}
              <g opacity="0.15" pointerEvents="none">
                <rect x="410" y="340" width="340" height="200" fill={currentColors.stroke === 'white' ? 'rgba(255,255,255,0.05)' : 'rgba(15,23,42,0.05)'} />
              </g>

              {/* Concrete hatching (triangles & sand dots inside foundation, slab, and footing) */}
              <g opacity="0.25" stroke={currentColors.stroke} strokeWidth="1" pointerEvents="none">
                {/* Foundation wall concrete symbols */}
                <path d="M 390 320 L 395 325 L 390 325 Z M 400 350 L 405 355 L 400 355 Z M 392 385 L 397 390 L 392 390 Z" />
                <circle cx="395" cy="335" r="1" />
                <circle cx="402" cy="370" r="1" />
                {/* Footing concrete symbols */}
                <path d="M 380 422 L 385 427 L 380 427 Z M 410 424 L 415 429 L 410 429 Z" />
                <circle cx="390" cy="432" r="1" />
                <circle cx="420" cy="420" r="1" />
                {/* Slab concrete symbols */}
                <path d="M 230 412 L 235 417 L 230 417 Z M 320 412 L 325 417 L 320 417 Z" />
              </g>

              {/* Gravel surrounding weeping tile */}
              <g opacity="0.3" fill="none" stroke={currentColors.stroke} strokeWidth="1">
                {[...Array(15)].map((_, i) => {
                  const cx = 433 + (i % 5) * 5;
                  const cy = 413 + Math.floor(i / 5) * 5;
                  return <circle key={i} cx={cx} cy={cy} r="1" fill={currentColors.stroke} />;
                })}
              </g>

              {/* --- STRUCTURAL FRAMING MEMBERS --- */}
              <g stroke={currentColors.stroke} strokeWidth="1.5" fill="none">
                {/* Roof Truss: Top Chord */}
                <polygon points="140,30 470,135 510,148 510,154 470,141 140,36" fill="rgba(180,83,9,0.1)" />
                {/* Roof Truss: Bottom Chord / Ceiling Joist */}
                <rect x="200" y="135" width="210" height="8" fill="rgba(180,83,9,0.1)" />

                {/* Double Top Plate */}
                <rect x="390" y="135" width="20" height="4" fill="rgba(180,83,9,0.1)" />
                <rect x="390" y="139" width="20" height="4" fill="rgba(180,83,9,0.1)" />

                {/* Wood Studs (2x6 cavity) */}
                <rect x="390" y="143" width="20" height="129" fill="rgba(180,83,9,0.1)" />

                {/* Stud cavity insulation (Wavy pink pattern) */}
                <path 
                  d="M 400,147 C 392,157 408,167 400,177 C 392,187 408,197 400,207 C 392,217 408,227 400,237 C 392,247 408,257 400,267" 
                  stroke="#ec4899" 
                  strokeWidth="2.5" 
                  opacity="0.65" 
                  fill="none" 
                  pointerEvents="none"
                />

                {/* Bottom Sole Plate */}
                <rect x="390" y="272" width="20" height="8" fill="rgba(180,83,9,0.1)" />

                {/* Subfloor (3/4" T&G) */}
                <rect x="200" y="280" width="210" height="3" fill="rgba(180,83,9,0.05)" />

                {/* Rim Joist */}
                <rect x="404" y="283" width="6" height="24" fill="rgba(180,83,9,0.1)" />

                {/* Floor I-Joist Assembly */}
                {/* Top flange */}
                <rect x="200" y="283" width="204" height="4" fill="rgba(180,83,9,0.15)" />
                {/* Bottom flange */}
                <rect x="200" y="303" width="204" height="4" fill="rgba(180,83,9,0.15)" />
                {/* OSB Web line */}
                <line x1="200" y1="295" x2="404" y2="295" stroke={currentColors.stroke} strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />

                {/* Mud Sill */}
                <rect x="385" y="307" width="25" height="4" fill="rgba(180,83,9,0.1)" />
              </g>

              {/* --- WEATHER ENVELOPE LAYERS --- */}
              <g stroke={currentColors.stroke} fill="none">
                {/* OSB Exterior Sheathing (Wall) */}
                <rect x="410" y="135" width="3" height="145" strokeWidth="1" fill="none" opacity="0.8" />

                {/* 10mm Wood Strapping (Rain-screen) */}
                <rect x="417" y="135" width="3" height="145" strokeWidth="1" fill="rgba(180,83,9,0.1)" />

                {/* Exterior Siding (Stair-step overlapping) */}
                <g strokeWidth="1" stroke={currentColors.stroke}>
                  {[...Array(12)].map((_, i) => {
                    const y = 135 + i * 13;
                    return <path key={i} d={`M 420 ${y} L 425 ${y + 10} L 420 ${y + 10}`} fill="none" />;
                  })}
                </g>

                {/* Roof Sheathing (7/16" OSB) */}
                <line x1="140" y1="26" x2="510" y2="144" stroke={currentColors.stroke} strokeWidth="2.5" />

                {/* Shingles and Underlayment */}
                <line x1="140" y1="22" x2="510" y2="140" stroke={currentColors.stroke} strokeWidth="1.5" strokeDasharray="6 2" />
                
                {/* Fascia Board */}
                <rect x="510" y="141" width="5" height="24" strokeWidth="1.5" fill="none" />
                
                {/* Vented Soffit */}
                <line x1="410" y1="165" x2="510" y2="165" strokeWidth="1.5" strokeDasharray="4 3" />
              </g>

              {/* --- INTERACTIVE VAPOUR BARRIER --- */}
              <g onClick={() => onElementClick('vapour-barrier')} className="cursor-pointer group z-10 absolute">
                <line x1="384" y1="135" x2="384" y2="285" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="6,3" className="group-hover:stroke-red-400 transition-colors" />
                <circle cx="384" cy="210" r="7" fill="rgba(239, 68, 68, 0.2)" stroke="#ef4444" strokeWidth="1.5" className="animate-pulse" />
                <circle cx="384" cy="210" r="3" fill="#ef4444" />
                <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="375" y="213" textAnchor="end" fontSize="7" className="font-mono group-hover:fill-red-400">6-mil Poly Vapour Barrier</text>
                <rect x="250" y="200" width="140" height="20" fill="transparent" />
              </g>

              {/* --- INTERACTIVE OSB NAILING PATTERN --- */}
              <g onClick={() => onElementClick('osb-nailing')} className="cursor-pointer group z-10 absolute">
                <circle cx="412" cy="180" r="1.5" fill="#ef4444" />
                <circle cx="412" cy="190" r="1.5" fill="#ef4444" />
                <circle cx="412" cy="200" r="1.5" fill="#ef4444" />
                <circle cx="412" cy="210" r="1.5" fill="#ef4444" />
                <circle cx="412" cy="220" r="1.5" fill="#ef4444" />
                <circle cx="412" cy="230" r="1.5" fill="#ef4444" />
                <circle cx="412" cy="205" r="7" fill="rgba(239, 68, 68, 0.2)" stroke="#ef4444" strokeWidth="1.5" className="animate-pulse" />
                <circle cx="412" cy="205" r="3" fill="#ef4444" />
                <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="425" y="208" textAnchor="start" fontSize="7" className="font-mono group-hover:fill-red-400">OSB Nailing Pattern</text>
                <rect x="405" y="195" width="120" height="20" fill="transparent" />
              </g>

              {/* --- INTERACTIVE ENVELOPE ASSEMBLY LAYERS --- */}
              <g onClick={() => onElementClick('envelope-layers')} className="cursor-pointer group">
                <rect x="410" y="135" width="20" height="160" fill="transparent" />
                {/* Tyvek Weather Barrier (Water-resistant, air-barrier) */}
                <line 
                  x1="414" y1="135" x2="414" y2="280" 
                  stroke={highlightedElement === 'Envelope Assembly Layers' ? "#fbbf24" : "#0ea5e9"} 
                  strokeWidth={highlightedElement === 'Envelope Assembly Layers' ? "3" : "1.5"} 
                  strokeDasharray="4,3" 
                  className="group-hover:stroke-yellow-400"
                />
                <rect x="410" y="135" width="15" height="150" fill="none" stroke="transparent" strokeWidth="2" className="group-hover:stroke-blue-400/20" />
              </g>

              {/* --- INTERACTIVE VENTILATION ATTIC BAFFLE --- */}
              <g onClick={() => onElementClick('ventilation-baffle')} className="cursor-pointer group">
                <path 
                  d="M 412 163 Q 412 125 365 125" 
                  fill="none" 
                  stroke={highlightedElement === 'Attic Ventilation Baffles' ? "#fbbf24" : "#22c55e"} 
                  strokeWidth={highlightedElement === 'Attic Ventilation Baffles' ? "4.5" : "2.5"} 
                  className="group-hover:stroke-yellow-400"
                />
                <circle cx="412" cy="163" r="3.5" fill={highlightedElement === 'Attic Ventilation Baffles' ? "#fbbf24" : "#22c55e"} className="group-hover:fill-yellow-400" />
                <path d="M 412 163 Q 412 125 365 125" fill="none" stroke="transparent" strokeWidth="15" />
              </g>

              {/* --- BASE FLASHING & WEEPHOLES HOTSPOT --- */}
              <g onClick={() => onElementClick('base-flashing')} className="cursor-pointer group">
                <path d="M 485 306 L 490 306 L 495 311" fill="none" stroke="#ef4444" strokeWidth="3" className="group-hover:stroke-yellow-400" />
                <circle cx="495" cy="311" r="7" fill="rgba(239, 68, 68, 0.3)" stroke="#ef4444" strokeWidth="1.5" className="animate-pulse" />
                <line x1="495" y1="311" x2="520" y2="330" stroke="#f87171" strokeWidth="1" className="group-hover:stroke-yellow-400" />
                <text fill="#ef4444" stroke="#f8fafc" strokeWidth="4" paintOrder="stroke fill" fontWeight="bold" x="525" y="335" fontSize="8" textAnchor="start" className="font-mono group-hover:fill-yellow-400">BASE FLASHING & WEEPHOLES</text>
                <rect x="475" y="295" width="150" height="45" fill="transparent" />
              </g>

              {/* --- INTERACTIVE FOUNDATION SILL GASKET --- */}
              <g onClick={() => onElementClick('sill-gasket')} className="cursor-pointer group">
                <line 
                  x1="385" y1="311" x2="410" y2="311" 
                  stroke={highlightedElement === 'Foundation Sill Gasket' ? "#fbbf24" : "#ec4899"} 
                  strokeWidth={highlightedElement === 'Foundation Sill Gasket' ? "4" : "2"} 
                  className="group-hover:stroke-yellow-400"
                />
                <rect x="382" y="306" width="31" height="10" fill="transparent" />
              </g>

              {/* --- INTERACTIVE SILL PLATE ANCHOR BOLTS --- */}
              <g onClick={() => onElementClick('anchor-bolt')} className="cursor-pointer group">
                <line 
                  x1="395" y1="311" x2="395" y2="365" 
                  stroke={highlightedElement === 'Sill Plate Anchor Bolts' ? "#fbbf24" : "#94a3b8"} 
                  strokeWidth={highlightedElement === 'Sill Plate Anchor Bolts' ? "3.5" : "2"} 
                  className="group-hover:stroke-yellow-400" 
                />
                <line 
                  x1="395" y1="365" x2="405" y2="365" 
                  stroke={highlightedElement === 'Sill Plate Anchor Bolts' ? "#fbbf24" : "#94a3b8"} 
                  strokeWidth={highlightedElement === 'Sill Plate Anchor Bolts' ? "3.5" : "2"} 
                  className="group-hover:stroke-yellow-400" 
                />
                <rect 
                  x="391" y="305" width="8" height="3" 
                  fill={highlightedElement === 'Sill Plate Anchor Bolts' ? "#fbbf24" : "#64748b"} 
                  stroke={highlightedElement === 'Sill Plate Anchor Bolts' ? "#fbbf24" : currentColors.stroke} 
                  strokeWidth="0.5" 
                  className="group-hover:fill-yellow-400 group-hover:stroke-yellow-400" 
                />
                <rect x="388" y="303" width="14" height="65" fill="transparent" />
              </g>

              {/* --- CONCRETE BASEMENT WALL, FOOTING, AND SLAB --- */}
              <g stroke={currentColors.stroke} strokeWidth="1.5" fill="none">
                <rect x="385" y="311" width="25" height="99" fill="rgba(148,163,184,0.08)" />
                <rect x="200" y="410" width="185" height="8" fill="rgba(148,163,184,0.08)" />
                <rect x="367" y="418" width="61" height="22" fill="rgba(148,163,184,0.08)" />
                <circle cx="445" cy="428" r="8" fill="none" />
                <circle cx="445" cy="428" r="4" fill="none" strokeDasharray="2 1" />
              </g>

              {/* --- FINISHED GRADE LINE --- */}
              <line x1="410" y1="340" x2="750" y2="340" stroke="#22c55e" strokeWidth="4" />
              <g stroke="#22c55e" strokeWidth="1.2" opacity="0.5" pointerEvents="none">
                {[...Array(12)].map((_, i) => {
                  const x = 430 + i * 27;
                  return <line key={i} x1={x} y1="340" x2={x - 8} y2="352" />;
                })}
              </g>

              {/* --- LEADER LINES & CAD ANNOTATION CALLOUTS --- */}
              <g stroke={currentColors.stroke} strokeWidth="1" fill="none" opacity="0.65">
                <circle cx="430" cy="80" r="2" fill={currentColors.stroke} />
                <polyline points="430,80 530,80 545,80" />

                <circle cx="410" cy="105" r="2" fill={currentColors.stroke} />
                <polyline points="410,105 530,105 545,105" />

                <circle cx="395" cy="115" r="2" fill={currentColors.stroke} />
                <polyline points="395,115 230,115 215,115" />

                <circle cx="340" cy="60" r="2" fill={currentColors.stroke} />
                <polyline points="340,60 230,60 215,60" />

                <circle cx="470" cy="155" r="2" fill={currentColors.stroke} />
                <polyline points="470,155 530,155 545,155" />

                <circle cx="423" cy="180" r="2" fill={currentColors.stroke} />
                <polyline points="423,180 530,180 545,180" />

                <circle cx="418" cy="205" r="2" fill={currentColors.stroke} />
                <polyline points="418,205 530,205 545,205" />

                <circle cx="414" cy="230" r="2" fill={currentColors.stroke} />
                <polyline points="414,230 530,230 545,230" />

                <circle cx="400" cy="210" r="2" fill={currentColors.stroke} />
                <polyline points="400,210 230,210 215,210" />

                <circle cx="380" cy="281" r="2" fill={currentColors.stroke} />
                <polyline points="380,281 230,281 215,281" />

                <circle cx="407" cy="295" r="2" fill={currentColors.stroke} />
                <polyline points="407,295 530,295 545,295" />

                <circle cx="405" cy="311" r="2" fill={currentColors.stroke} />
                <polyline points="405,311 530,311 545,311" />

                <circle cx="395" cy="325" r="2" fill={currentColors.stroke} />
                <polyline points="395,325 230,325 215,325" />

                <circle cx="397" cy="360" r="2" fill={currentColors.stroke} />
                <polyline points="397,360 530,360 545,360" />

                <circle cx="330" cy="410" r="2" fill={currentColors.stroke} />
                <polyline points="330,410 230,410 215,410" />

                <circle cx="400" cy="428" r="2" fill={currentColors.stroke} />
                <polyline points="400,428 530,428 545,428" />

                <circle cx="445" cy="428" r="2" fill={currentColors.stroke} />
                <polyline points="445,428 530,442 545,442" />
              </g>

              {/* Callout Texts */}
              <g fill={currentColors.fill} fontSize="7" fontWeight="bold" className="font-mono">
                {/* Right Column Callouts */}
                <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="550" y="83" textAnchor="start">ASPHALT SHINGLES OVER 15lb FELT UNDERLAYMENT</text>
                <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="550" y="108" textAnchor="start">7/16" OSB SHEATHING WITH H-CLIPS</text>
                <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="550" y="158" textAnchor="start">VENTED SOFFIT OVERHANG</text>
                <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="550" y="183" textAnchor="start">4" VINYL SIDING W/ MIN 200mm CLEARANCE TO GRADE</text>
                <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="550" y="208" textAnchor="start">10mm (3/8") VERTICAL STRAPPING (CAPILLARY BREAK)</text>
                <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="550" y="233" textAnchor="start">TYVEK SARKING MEMBRANE (WEATHER BARRIER)</text>
                <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="550" y="298" textAnchor="start">11-7/8" SOLID RIM BOARD</text>
                <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="550" y="314" textAnchor="start">CONTINUOUS FOAM SILL GASKET (AIR SEAL)</text>
                <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="550" y="363" textAnchor="start">8" POURED CONCRETE FOUNDATION WALL</text>
                <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="550" y="431" textAnchor="start">10" x 20" CONCRETE FOOTING</text>
                <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="550" y="445" textAnchor="start">4" PERFORATED WEEPING TILE W/ CRUSHED STONE</text>

                {/* Left Column Callouts */}
                <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="210" y="118" textAnchor="end">CONTINUOUS VENTILATION BAFFLE (NBC 9.19.1.1)</text>
                <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="210" y="63" textAnchor="end">ENGINEERED ROOF TRUSS TOP CHORD @ 24" O.C.</text>
                <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="210" y="213" textAnchor="end">2x6 WOOD FRAMING STUDS @ 16" O.C. W/ R-24 BATT</text>
                <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="210" y="284" textAnchor="end">3/4" T&G SUBFLOOR GLUED & SCREWED</text>
                <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="210" y="328" textAnchor="end">1/2" ANCHOR BOLT @ 2.4m O.C. (NBC 9.23.6.1)</text>
                <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="210" y="413" textAnchor="end">4" CONCRETE BASEMENT SLAB OVER POLY</text>
              </g>

              {/* --- VERTICAL HEIGHT DATUMS (ARCHITECTURAL BENCHMARKS) --- */}
              <g className="opacity-80">
                {[
                  { label: 'PEAK OF ROOF', el: 'EL. 118\'-6"', y: 30 },
                  { label: 'T.O. WALL PLATE', el: 'EL. 107\'-2"', y: 135 },
                  { label: 'FINISHED GRADE', el: 'EL. 96\'-0"', y: 340 },
                  { label: 'T.O. FOOTING', el: 'EL. 90\'-0"', y: 418 }
                ].map((datum, idx) => (
                  <g key={idx} transform={`translate(60, ${datum.y})`} className="group cursor-pointer" onClick={() => onElementClick('height-datum')}>
                    <line x1="-30" y1="0" x2="60" y2="0" stroke={currentColors.stroke} strokeWidth="1" strokeDasharray="3,3" />
                    <g transform="translate(60, 0)">
                      <circle cx="0" cy="0" r="5" fill="none" stroke={currentColors.stroke} strokeWidth="1" />
                      <line x1="-8" y1="0" x2="8" y2="0" stroke={currentColors.stroke} strokeWidth="0.8" />
                      <line x1="0" y1="-8" x2="0" y2="8" stroke={currentColors.stroke} strokeWidth="0.8" />
                      <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="12" y="3" fontSize="7" className="font-mono">{datum.label} ({datum.el})</text>
                    </g>
                  </g>
                ))}
              </g>

              {/* --- INTERACTIVE JOIST PENETRATION DETAIL --- */}
              <g onClick={() => onElementClick('joist-penetration')} className="cursor-pointer group">
                <rect x="280" y="420" width="120" height="60" fill="rgba(255,255,255,0.05)" stroke={currentColors.stroke} strokeWidth="1" strokeDasharray="2,2" />
                <rect x="290" y="440" width="100" height="20" fill="#f59e0b" opacity="0.3" stroke="#b45309" strokeWidth="2" />
                <circle cx="340" cy="450" r="10" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="2,2" className="group-hover:stroke-red-400" />
                <circle cx="340" cy="450" r="8" fill="rgba(56, 189, 248, 0.4)" stroke="#0ea5e9" strokeWidth="2" />
                <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="340" y="435" fontSize="7" textAnchor="middle" className="font-mono group-hover:fill-red-400">JOIST PENETRATION</text>
                <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="340" y="470" fontSize="5" textAnchor="middle" className="font-mono opacity-80">(MAX 1/4 DEPTH)</text>
                
                <circle cx="340" cy="450" r="15" fill="rgba(239, 68, 68, 0.2)" stroke="#ef4444" strokeWidth="1.5" className="animate-pulse opacity-50" />
              </g>

              {/* --- TITLE BLOCK --- */}
              <g onClick={() => onElementClick('title-block')} className="cursor-pointer group transition-all">
                <rect x="520" y="525" width="260" height="65" fill="rgba(255,255,255,0.05)" stroke={currentColors.stroke} strokeWidth="2" className="group-hover:fill-blue-500/40" />
                <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="535" y="542" fontSize="11" >PROJECT: RSR-2026</text>
                <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="535" y="557" fontSize="10">DWG: A3.0 - A/S SECTION DETAIL</text>
                <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="535" y="572" fontSize="10">SCALE: 1/2" = 1'-0" (HIGH-FIDELITY)</text>
              </g>
            </g>
          )}

          {/* ================= PAGE 4: ELECTRICAL PLAN ================= */}
          {page === 4 && (
            <g>
              {/* --- FAINT ARCHITECTURAL UNDERLAY (30% OPACITY) --- */}
              <g opacity="0.25" pointerEvents="none">
                {/* Exterior Walls */}
                <rect x="150" y="140" width="400" height="260" fill="none" stroke={currentColors.stroke} strokeWidth="2" />
                {/* Interior Bearing Wall */}
                <rect x="297" y="146" width="8" height="244" fill="none" stroke={currentColors.stroke} strokeWidth="1.5" />
                {/* Non-Bearing Partition */}
                <rect x="305" y="278" width="155" height="6" fill="none" stroke={currentColors.stroke} strokeWidth="1" />
                {/* Staircase Outline */}
                <rect x="156" y="270" width="85" height="120" fill="none" stroke={currentColors.stroke} strokeWidth="1" />
                {/* Door Opening */}
                <path d="M 470 350 A 50 50 0 0 1 520 400" fill="none" stroke={currentColors.stroke} strokeWidth="1" strokeDasharray="3,3" />
                <line x1="470" y1="400" x2="470" y2="350" stroke={currentColors.stroke} strokeWidth="2.5" />
              </g>
              {/* --- ELECTRICAL NOTCHING / DRILLING --- */}
              <g onClick={() => onElementClick('electrical-notching')} className="cursor-pointer group">
                <circle cx="210" cy="220" r="8" fill="rgba(245, 158, 11, 0.3)" stroke="#f59e0b" strokeWidth="2" className="animate-pulse group-hover:stroke-yellow-400" />
                <circle cx="210" cy="220" r="3" fill="#f59e0b" className="group-hover:fill-yellow-400" />
                <line x1="210" y1="220" x2="160" y2="240" stroke="#f59e0b" strokeWidth="1" className="group-hover:stroke-yellow-400" />
                <text fill="#f97316" stroke="#f8fafc" strokeWidth="2" paintOrder="stroke fill" fontWeight="bold" x="155" y="245" fontSize="8" textAnchor="end" className="font-mono group-hover:fill-yellow-400">STUD DRILLING MAX 1/3 DEPTH</text>
                <rect x="50" y="210" width="170" height="40" fill="transparent" />
              </g>

              {/* --- 200A MAIN SERVICE PANEL (CEC Working Clearance) --- */}
              <g onClick={() => onElementClick('electrical-panel')} className="cursor-pointer group">
                {/* Panel inside utility room/wall area */}
                <rect x="151" y="160" width="6" height="30" fill={theme === 'cad-dark' ? '#f43f5e' : '#e11d48'} stroke={currentColors.stroke} strokeWidth="1" className="group-hover:fill-yellow-400" />
                
                {/* 1m (3'-4") Working Clearance box (CEC Rules 2-308 & 26-200) */}
                <rect x="157" y="155" width="38" height="40" fill="rgba(244,63,94,0.06)" stroke="#f43f5e" strokeWidth="1.25" strokeDasharray="3,2" className="group-hover:fill-yellow-400/10" />
                
                <text fill="#ef4444" stroke="#f8fafc" strokeWidth="2" paintOrder="stroke fill" fontWeight="bold" x="200" y="172" fontSize="7.5" className="font-mono group-hover:fill-yellow-400">200A SERVICE PANEL</text>
                <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="200" y="181" fontSize="6.5" className="font-mono opacity-80 group-hover:fill-yellow-400">1m DEPTH SECURE CLEARANCE ZONE (CEC 2-308)</text>
                
                {/* Pointer line */}
                <path d="M 197 175 L 180 175" stroke={currentColors.stroke} strokeWidth="0.75" />
                <polygon points="180,175 186,172 186,178" fill={currentColors.fill} />
                
                <rect x="145" y="150" width="220" height="50" fill="transparent" />
              </g>

              {/* --- STANDARD DUPLEX WALL RECEPTACLES (CEC Spacing) --- */}
              <g onClick={() => onElementClick('receptacle-spacing')} className="cursor-pointer group">
                {[
                  { x: 210, y: 140, label: '12A' },
                  { x: 440, y: 140, label: '12B' },
                  { x: 210, y: 400, label: '12C' },
                  { x: 330, y: 400, label: '12D' },
                  { x: 550, y: 350, label: '12E', rot: -90 },
                ].map((receptacle, idx) => (
                  <g key={idx} transform={`translate(${receptacle.x}, ${receptacle.y}) rotate(${receptacle.rot || 0})`}>
                    <circle cx="0" cy="0" r="4.5" fill={theme === 'cad-dark' ? '#0f172a' : '#ffffff'} stroke={currentColors.stroke} strokeWidth="1" className="group-hover:stroke-yellow-400" />
                    <line x1="-7" y1="-1.5" x2="7" y2="-1.5" stroke={currentColors.stroke} strokeWidth="1.2" className="group-hover:stroke-yellow-400" />
                    <line x1="-7" y1="1.5" x2="7" y2="1.5" stroke={currentColors.stroke} strokeWidth="1.2" className="group-hover:stroke-yellow-400" />
                    <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="8" y="10" fontSize="5" className="font-mono opacity-70">DUPLEX ({receptacle.label})</text>
                  </g>
                ))}
                <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="215" y="388" fontSize="7.5" className="font-mono opacity-80 group-hover:fill-yellow-400">DUPLEX RECEPTACLES SPACING COMPLIES W/ CEC 3.6m RULE</text>
                <rect x="190" y="380" width="180" height="30" fill="transparent" pointerEvents="none" />
              </g>

              {/* --- WET-ZONE GFCI RECEPTACLES (1.5m Sinks/Bath) --- */}
              <g onClick={() => onElementClick('gfci-outlet')} className="cursor-pointer group">
                {[
                  { x: 360, y: 140, label: 'GFCI-1' },
                  { x: 405, y: 140, label: 'GFCI-2' },
                ].map((gfci, idx) => (
                  <g key={idx} transform={`translate(${gfci.x}, ${gfci.y})`}>
                    <circle cx="0" cy="0" r="4.5" fill="none" stroke="#2563eb" strokeWidth="1.5" className="group-hover:stroke-blue-400" />
                    <line x1="-7" y1="-1.5" x2="7" y2="-1.5" stroke="#2563eb" strokeWidth="1.5" className="group-hover:stroke-blue-400" />
                    <line x1="-7" y1="1.5" x2="7" y2="1.5" stroke="#2563eb" strokeWidth="1.5" className="group-hover:stroke-blue-400" />
                    <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="6" y="-7" fontSize="6.5" className="font-mono group-hover:fill-blue-400">GFCI</text>
                  </g>
                ))}
                <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="345" y="115" fontSize="6.5" className="font-mono text-center">GFCI RECEPTACLES AT WET COUNTER</text>
                <rect x="330" y="105" width="110" height="45" fill="transparent" pointerEvents="none" />
              </g>

              {/* --- HEAVY DUTY 240V SPECIALTY RECEPTACLES --- */}
              <g onClick={() => onElementClick('240v-receptacles')} className="cursor-pointer group">
                {/* 50A Range Receptacle (x=485, y=140) */}
                <g transform="translate(485, 140)">
                  <circle cx="0" cy="0" r="6" fill="none" stroke="#ea580c" strokeWidth="1.5" className="group-hover:stroke-yellow-400" />
                  <line x1="-9" y1="0" x2="9" y2="0" stroke="#ea580c" strokeWidth="1.5" className="group-hover:stroke-yellow-400" />
                  <line x1="0" y1="-9" x2="0" y2="9" stroke="#ea580c" strokeWidth="1.5" className="group-hover:stroke-yellow-400" />
                  <circle cx="0" cy="0" r="2.5" fill="#ea580c" className="group-hover:fill-yellow-400" />
                  <text fill="#f97316" stroke="#f8fafc" strokeWidth="2" paintOrder="stroke fill" fontWeight="bold" x="-5" y="-10" fontSize="6.5" className="font-mono group-hover:fill-yellow-400">50A RANGE (240V)</text>
                </g>

                {/* 30A Dryer Receptacle (x=550, y=300) */}
                <g transform="translate(550, 300) rotate(-90)">
                  <circle cx="0" cy="0" r="6" fill="none" stroke="#ea580c" strokeWidth="1.5" className="group-hover:stroke-yellow-400" />
                  <line x1="-9" y1="0" x2="9" y2="0" stroke="#ea580c" strokeWidth="1.5" className="group-hover:stroke-yellow-400" />
                  <line x1="0" y1="-9" x2="0" y2="9" stroke="#ea580c" strokeWidth="1.5" className="group-hover:stroke-yellow-400" />
                  <circle cx="0" cy="0" r="2.5" fill="#ea580c" className="group-hover:fill-yellow-400" />
                  <text fill="#f97316" stroke="#f8fafc" strokeWidth="2" paintOrder="stroke fill" fontWeight="bold" x="8" y="4" fontSize="6.5" className="font-mono group-hover:fill-yellow-400" transform="rotate(90 8 4)">30A DRYER</text>
                </g>
              </g>

              {/* --- LIGHTING FIXTURES & SWITCHING LOOPS --- */}
              <g onClick={() => onElementClick('switch-wiring')} className="cursor-pointer group">
                {/* Switches */}
                {/* Single Pole (x=455, y=370) */}
                <g transform="translate(455, 370)">
                  <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="0" y="0" fontSize="13" className="font-mono group-hover:fill-yellow-400">$</text>
                  <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="6" y="-10" fontSize="6" className="font-mono opacity-80">S.P.</text>
                </g>

                {/* 3-Way Switches ($3) */}
                <g transform="translate(325, 260)">
                  <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="0" y="0" fontSize="13" className="font-mono group-hover:fill-yellow-400">$</text>
                  <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="6" y="2" fontSize="8" className="font-mono group-hover:fill-yellow-400">3</text>
                </g>
                <g transform="translate(195, 335)">
                  <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="0" y="0" fontSize="13" className="font-mono group-hover:fill-yellow-400">$</text>
                  <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="6" y="2" fontSize="8" className="font-mono group-hover:fill-yellow-400">3</text>
                </g>

                {/* 4-Way Switch ($4) */}
                <g transform="translate(315, 310)">
                  <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="0" y="0" fontSize="13" className="font-mono group-hover:fill-yellow-400">$</text>
                  <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="6" y="2" fontSize="8" className="font-mono group-hover:fill-yellow-400">4</text>
                </g>

                {/* Pot lights & fixtures */}
                {/* Kitchen Pot lights (R) */}
                {[
                  { x: 260, y: 190 },
                  { x: 260, y: 230 },
                  { x: 420, y: 190 },
                  { x: 420, y: 230 }
                ].map((pot, idx) => (
                  <g key={idx} transform={`translate(${pot.x}, ${pot.y})`}>
                    <circle cx="0" cy="0" r="10" fill="none" stroke={currentColors.stroke} strokeWidth="1.5" className="group-hover:stroke-green-400" />
                    <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="-4" y="3" fontSize="9" className="font-mono group-hover:fill-green-400">R</text>
                  </g>
                ))}

                {/* Main Ceiling Fixture / Fan (x=350, y=210) */}
                <g transform="translate(350, 210)">
                  <circle cx="0" cy="0" r="12" fill="none" stroke={currentColors.stroke} strokeWidth="2" className="group-hover:stroke-green-400" />
                  <path d="M -8 -8 L 8 8 M -8 8 L 8 -8" stroke={currentColors.stroke} strokeWidth="1" className="group-hover:stroke-green-400" />
                  <circle cx="0" cy="0" r="3" fill={currentColors.fill} className="group-hover:fill-green-400" />
                </g>

                {/* Curved Switching Arcs (Dashed Loops) */}
                {/* Main Entrance Switch to Ceiling Fan */}
                <path d="M 455 360 Q 400 300 350 222" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="4,4" className="group-hover:stroke-green-400" opacity="0.8" />
                
                {/* 3-Way Switching Arc for Stairwell */}
                <path d="M 195 325 Q 170 300 190 280" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="4,4" className="group-hover:stroke-green-400" opacity="0.8" />
                <path d="M 325 250 Q 240 260 195 325" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="4,4" className="group-hover:stroke-green-400" opacity="0.8" />

                {/* Kitchen switch connection to Pot lights */}
                <path d="M 325 250 Q 285 240 260 230" fill="none" stroke="#22c55e" strokeWidth="1.25" strokeDasharray="4,4" className="group-hover:stroke-green-400" opacity="0.8" />
                <path d="M 260 230 L 260 190 Q 340 170 420 190 L 420 230" fill="none" stroke="#22c55e" strokeWidth="1.25" strokeDasharray="4,4" className="group-hover:stroke-green-400" opacity="0.8" />

                <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="330" y="325" fontSize="7" className="font-mono opacity-80 group-hover:fill-green-400">3-WAY & 4-WAY SWITCHING CIRCUIT LOOPS</text>
              </g>

              {/* --- SMOKE / CARBON MONOXIDE INTERCONNECTED ALARMS (S/CO) --- */}
              <g onClick={() => onElementClick('smoke-co-detector')} className="cursor-pointer group">
                {[
                  { x: 300, y: 350, label: 'S/CO (HALLWAY)' },
                  { x: 450, y: 260, label: 'S/CO (BEDROOM)' }
                ].map((alarm, idx) => (
                  <g key={idx} transform={`translate(${alarm.x}, ${alarm.y})`}>
                    <circle cx="0" cy="0" r="9" fill="none" stroke="#ef4444" strokeWidth="1.75" className="group-hover:stroke-yellow-400" />
                    <circle cx="0" cy="0" r="6" fill="none" stroke="#ef4444" strokeWidth="1" className="group-hover:stroke-yellow-400" />
                    <path d="M -9 0 L 9 0 M 0 -9 L 0 9" stroke="#ef4444" strokeWidth="0.75" className="group-hover:stroke-yellow-400" />
                    <text fill="#ef4444" stroke="#f8fafc" strokeWidth="2" paintOrder="stroke fill" fontWeight="bold" x="12" y="3" fontSize="7" className="font-mono group-hover:fill-yellow-400">{alarm.label}</text>
                  </g>
                ))}
                {/* Interconnection dashed line */}
                <path d="M 300 341 Q 380 300 450 251" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="5,2" opacity="0.9" className="group-hover:stroke-yellow-400" />
                <text fill="#ef4444" stroke="#f8fafc" strokeWidth="2" paintOrder="stroke fill" fontWeight="bold" x="330" y="300" fontSize="6.5" className="font-mono group-hover:fill-yellow-400">INTERCONNECTED S/CO LINES (NBC COMPLIANT)</text>
              </g>

              
              {/* --- TITLE BLOCK --- */}
              <g onClick={() => onElementClick('title-block')} className="cursor-pointer group transition-all">
                <rect x="520" y="420" width="260" height="160" fill="rgba(255,255,255,0.05)" stroke={currentColors.stroke} strokeWidth="2" className="group-hover:fill-blue-500/40" />
                <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="535" y="450" fontSize="18" >PROJECT: RSR-2026</text>
                <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="535" y="475" fontSize="14">DWG: E1.0 - ELECTRICAL PLAN</text>
                <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="535" y="500" fontSize="14">SCALE: 1/4" = 1'-0"</text>
              </g>
            </g>
          )}
          {/* ================= PAGE 5: PLUMBING PLAN ================= */}
          {page === 5 && (
            <g>
              {/* --- FAINT ARCHITECTURAL UNDERLAY (30% OPACITY) --- */}
              <g opacity="0.25" pointerEvents="none">
                {/* Exterior Walls */}
                <rect x="150" y="140" width="400" height="260" fill="none" stroke={currentColors.stroke} strokeWidth="2" />
                {/* Interior Bearing Wall */}
                <rect x="297" y="146" width="8" height="244" fill="none" stroke={currentColors.stroke} strokeWidth="1.5" />
                {/* Non-Bearing Partition */}
                <rect x="305" y="278" width="155" height="6" fill="none" stroke={currentColors.stroke} strokeWidth="1" />
                {/* Staircase Outline */}
                <rect x="156" y="270" width="85" height="120" fill="none" stroke={currentColors.stroke} strokeWidth="1" />
                {/* Door Opening */}
                <path d="M 470 350 A 50 50 0 0 1 520 400" fill="none" stroke={currentColors.stroke} strokeWidth="1" strokeDasharray="3,3" />
                <line x1="470" y1="400" x2="470" y2="350" stroke={currentColors.stroke} strokeWidth="2.5" />
              </g>
              {/* --- PLUMBING ISOMETRIC SCHEMATIC (3D RISER) --- */}
              <g>
                {/* Main Roof Vent Terminal (3" Roof Peak Penetration) */}
                <g onClick={() => onElementClick('plumbing-riser-venting')} className="cursor-pointer group">
                  <line x1="330" y1="50" x2="430" y2="50" stroke={currentColors.stroke} strokeWidth="1" strokeDasharray="4,4" opacity="0.4" />
                  <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="380" y="45" fontSize="6" textAnchor="middle" opacity="0.6">ROOF PEAK PENETRATION</text>
                  
                  <line x1="380" y1="25" x2="380" y2="70" stroke="#0ea5e9" strokeWidth="2.5" strokeDasharray="3,3" className="group-hover:stroke-yellow-400" />
                  <text fill="#0ea5e9" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="390" y="35" fontSize="7.5" className="font-mono group-hover:fill-yellow-400">3" VENT TERMINAL (V)</text>
                  
                  <polygon points="370,50 390,50 380,42" fill={theme === 'light-print' ? '#475569' : '#94a3b8'} className="group-hover:fill-yellow-400" />
                  <circle cx="380" cy="45" r="25" fill="transparent" />
                </g>

                {/* Main Vent Stack (Thinner sky blue dashed line marked 'V') */}
                <g onClick={() => onElementClick('plumbing-riser-venting')} className="cursor-pointer group">
                  <line x1="380" y1="70" x2="380" y2="280" stroke="#0ea5e9" strokeWidth="2.5" strokeDasharray="3,3" className="group-hover:stroke-yellow-400" />
                  <circle cx="380" cy="110" r="5.5" fill={theme === 'cad-dark' ? '#111827' : '#ffffff'} stroke="#0ea5e9" strokeWidth="1" />
                  <text fill="#0ea5e9" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="380" y="112.5" fontSize="7" textAnchor="middle" className="font-mono">V</text>

                  <circle cx="380" cy="170" r="5.5" fill={theme === 'cad-dark' ? '#111827' : '#ffffff'} stroke="#0ea5e9" strokeWidth="1" />
                  <text fill="#0ea5e9" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="380" y="172.5" fontSize="7" textAnchor="middle" className="font-mono">V</text>

                  <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="392" y="145" fontSize="7.5" className="font-mono group-hover:fill-yellow-400">3" ABS MAIN VENT STACK</text>
                  <rect x="365" y="70" width="30" height="210" fill="transparent" />
                </g>

                {/* 3" ABS Soil Waste Stack (Thicker solid royal blue line marked 'S') */}
                <g onClick={() => onElementClick('soil-stack')} className="cursor-pointer group">
                  <line x1="380" y1="280" x2="380" y2="420" stroke="#2563eb" strokeWidth="4.5" className="group-hover:stroke-yellow-400" />
                  
                  <circle cx="380" cy="305" r="5.5" fill={theme === 'cad-dark' ? '#111827' : '#ffffff'} stroke="#2563eb" strokeWidth="1.5" />
                  <text fill="#2563eb" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="380" y="307.5" fontSize="7" textAnchor="middle" className="font-mono">S</text>

                  <circle cx="380" cy="385" r="5.5" fill={theme === 'cad-dark' ? '#111827' : '#ffffff'} stroke="#2563eb" strokeWidth="1.5" />
                  <text fill="#2563eb" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="380" y="387.5" fontSize="7" textAnchor="middle" className="font-mono">S</text>

                  <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="392" y="355" fontSize="7.5" className="font-mono group-hover:fill-yellow-400">3" ABS SOIL STACK (NBC 9.23.5.3)</text>
                  <rect x="365" y="280" width="30" height="140" fill="transparent" />
                </g>

                {/* 4" ABS Main Building Drain (Thickest sloped solid blue line) */}
                <g onClick={() => onElementClick('building-drain')} className="cursor-pointer group">
                  <line x1="380" y1="420" x2="210" y2="470" stroke="#1e40af" strokeWidth="6" strokeLinecap="round" className="group-hover:stroke-yellow-400" />
                  
                  <circle cx="210" cy="470" r="5" fill="#ef4444" className="group-hover:fill-yellow-400" />
                  <line x1="210" y1="465" x2="210" y2="475" stroke="#ffffff" strokeWidth="1.5" />
                  <text fill="#ef4444" stroke="#f8fafc" strokeWidth="2" paintOrder="stroke fill" fontWeight="bold" x="180" y="460" fontSize="7" className="font-mono group-hover:fill-yellow-400">4" CLEANOUT (C.O.)</text>
                  
                  <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="245" y="445" fontSize="8" className="font-mono group-hover:fill-yellow-400" transform="rotate(-16.3 245 445)">
                    4" ABS BUILDING DRAIN @ MIN 2% SLOPE
                  </text>
                  <rect x="200" y="415" width="190" height="65" fill="transparent" transform="rotate(-16.3 295 447)" />
                </g>

                {/* --- FIXTURE A: KITCHEN SINK (Left side of stack) --- */}
                <g onClick={() => onElementClick('plumbing-p-trap')} className="cursor-pointer group">
                  <rect x="220" y="200" width="28" height="18" fill="rgba(255,255,255,0.05)" stroke={currentColors.stroke} strokeWidth="1" strokeDasharray="2,2" />
                  <path d="M 220 208 L 248 208 M 234 200 L 234 218" stroke={currentColors.stroke} strokeWidth="0.5" strokeDasharray="1,2" />
                  <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="234" y="195" fontSize="7.5" textAnchor="middle" className="font-mono">KITCHEN SINK (KS)</text>
                  
                  <line x1="234" y1="218" x2="234" y2="230" stroke="#2563eb" strokeWidth="3" className="group-hover:stroke-yellow-400" />
                  <path d="M 234 230 Q 234 240 240 240 Q 246 240 246 230" fill="none" stroke="#2563eb" strokeWidth="3.5" className="group-hover:stroke-yellow-400" />
                  <line x1="246" y1="230" x2="246" y2="225" stroke="#2563eb" strokeWidth="3" className="group-hover:stroke-yellow-400" />
                  <text fill="#2563eb" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="252" y="242" fontSize="6.5" className="group-hover:fill-yellow-400">1-1/2" P-TRAP</text>
                  
                  <line x1="246" y1="225" x2="310" y2="245" stroke="#2563eb" strokeWidth="3.5" className="group-hover:stroke-yellow-400" />
                  <line x1="310" y1="245" x2="380" y2="280" stroke="#2563eb" strokeWidth="3.5" className="group-hover:stroke-yellow-400" />
                  
                  <line x1="246" y1="225" x2="246" y2="150" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="3,3" className="group-hover:stroke-yellow-400" />
                  <line x1="246" y1="150" x2="380" y2="150" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="3,3" className="group-hover:stroke-yellow-400" />
                  <text fill="#0ea5e9" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="250" y="145" fontSize="6" className="font-mono">1-1/2" RE-VENT LOOP (V)</text>
                  
                  <rect x="215" y="140" width="165" height="110" fill="transparent" />
                </g>

                {/* --- FIXTURE B: TOILET / WATER CLOSET (Right side of stack) --- */}
                <g onClick={() => onElementClick('plumbing-riser-venting')} className="cursor-pointer group">
                  <rect x="470" y="235" width="22" height="15" fill="rgba(255,255,255,0.05)" stroke={currentColors.stroke} strokeWidth="1" strokeDasharray="2,2" />
                  <ellipse cx="481" cy="256" rx="11" ry="6" fill="none" stroke={currentColors.stroke} strokeWidth="1" strokeDasharray="2,2" />
                  <ellipse cx="481" cy="256" rx="7" ry="4" fill="none" stroke={currentColors.stroke} strokeWidth="0.5" strokeDasharray="2,2" />
                  <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="498" y="244" fontSize="7.5" className="font-mono">WC / TOILET</text>
                  
                  <line x1="481" y1="262" x2="481" y2="285" stroke="#2563eb" strokeWidth="4" className="group-hover:stroke-yellow-400" />
                  <path d="M 481 285 Q 481 292 487 292 Q 493 292 493 285" fill="none" stroke="#2563eb" strokeWidth="4" className="group-hover:stroke-yellow-400" />
                  
                  <line x1="493" y1="285" x2="380" y2="330" stroke="#2563eb" strokeWidth="4" className="group-hover:stroke-yellow-400" />
                  <text fill="#2563eb" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="430" y="315" fontSize="6.5" className="font-mono group-hover:fill-yellow-400">3" FIXTURE DRAIN ARM</text>
                  
                  <line x1="481" y1="275" x2="481" y2="190" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="3,3" className="group-hover:stroke-yellow-400" />
                  <line x1="481" y1="190" x2="380" y2="190" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="3,3" className="group-hover:stroke-yellow-400" />
                  <text fill="#0ea5e9" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="415" y="185" fontSize="6.5" className="font-mono group-hover:fill-yellow-400">2" TOILET VENT LINE (V)</text>
                  
                  <rect x="380" y="180" width="115" height="120" fill="transparent" />
                </g>

                {/* --- FIXTURE C: SHOWER / BATHTUB (Far Right side) --- */}
                <g onClick={() => onElementClick('plumbing-p-trap')} className="cursor-pointer group">
                  <rect x="520" y="290" width="30" height="30" fill="none" stroke={currentColors.stroke} strokeWidth="1" strokeDasharray="2,2" />
                  <line x1="520" y1="290" x2="550" y2="320" stroke={currentColors.stroke} strokeWidth="0.5" strokeDasharray="2,2" />
                  <line x1="520" y1="320" x2="550" y2="290" stroke={currentColors.stroke} strokeWidth="0.5" strokeDasharray="2,2" />
                  <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="535" y="285" fontSize="7.5" textAnchor="middle" className="font-mono">SHOWER (SH)</text>
                  
                  <line x1="535" y1="320" x2="535" y2="332" stroke="#2563eb" strokeWidth="3" className="group-hover:stroke-yellow-400" />
                  <path d="M 535 332 Q 535 342 541 342 Q 547 342 547 332" fill="none" stroke="#2563eb" strokeWidth="3.5" className="group-hover:stroke-yellow-400" />
                  <line x1="547" y1="332" x2="547" y2="328" stroke="#2563eb" strokeWidth="3" className="group-hover:stroke-yellow-400" />
                  <text fill="#2563eb" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="552" y="344" fontSize="6.5" className="group-hover:fill-yellow-400">2" P-TRAP (NBC 7.2)</text>
                  
                  <line x1="547" y1="328" x2="380" y2="385" stroke="#2563eb" strokeWidth="3.5" className="group-hover:stroke-yellow-400" />
                  
                  <line x1="547" y1="328" x2="547" y2="230" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="3,3" className="group-hover:stroke-yellow-400" />
                  <line x1="547" y1="230" x2="380" y2="230" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="3,3" className="group-hover:stroke-yellow-400" />
                  <text fill="#0ea5e9" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="415" y="225" fontSize="6.5" className="font-mono group-hover:fill-yellow-400">1-1/2" SHOWER VENT (V)</text>
                  
                  <rect x="380" y="215" width="180" height="140" fill="transparent" />
                </g>

                {/* --- DETAILED RADON-SEALED SUMP PIT (Basement floor left) --- */}
                <g onClick={() => onElementClick('sump-pit-seal')} className="cursor-pointer group">
                  <rect x="155" y="490" width="50" height="55" rx="4" fill="rgba(244,63,94,0.04)" stroke={currentColors.stroke} strokeWidth="1" strokeDasharray="3,3" className="group-hover:fill-red-400/10" />
                  <ellipse cx="180" cy="490" rx="28" ry="10" fill="none" stroke={currentColors.stroke} strokeWidth="1" />
                  
                  <ellipse cx="180" cy="490" rx="24" ry="8" fill={theme === 'cad-dark' ? '#111827' : (theme === 'light-print' ? '#cbd5e1' : '#1e3a5f')} stroke="#ef4444" strokeWidth="3" className="group-hover:stroke-yellow-400 group-hover:fill-red-500/10 transition-all" />
                  <text fill="#ef4444" stroke="#f8fafc" strokeWidth="2" paintOrder="stroke fill" fontWeight="bold" x="180" y="492" fontSize="5.5" textAnchor="middle" className="font-mono group-hover:fill-yellow-400"> airtight lid </text>
                  
                  <circle cx="160" cy="490" r="1.5" fill="#ef4444" className="group-hover:fill-yellow-400" />
                  <circle cx="200" cy="490" r="1.5" fill="#ef4444" className="group-hover:fill-yellow-400" />
                  <circle cx="180" cy="484" r="1.5" fill="#ef4444" className="group-hover:fill-yellow-400" />
                  <circle cx="180" cy="496" r="1.5" fill="#ef4444" className="group-hover:fill-yellow-400" />
                  
                  <line x1="172" y1="490" x2="172" y2="410" stroke="#3b82f6" strokeWidth="2.5" className="group-hover:stroke-yellow-400" />
                  <line x1="172" y1="410" x2="120" y2="410" stroke="#3b82f6" strokeWidth="2.5" className="group-hover:stroke-yellow-400" />
                  <rect x="169" y="430" width="6" height="12" fill="#2563eb" stroke="#ffffff" strokeWidth="0.5" />
                  <text fill="#3b82f6" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="162" y="438" fontSize="6" textAnchor="end" className="font-mono">1-1/2" DISCHARGE</text>
                  
                  <line x1="188" y1="490" x2="188" y2="425" stroke="#f97316" strokeWidth="2" strokeDasharray="3,2" className="group-hover:stroke-yellow-400" />
                  <line x1="188" y1="425" x2="140" y2="425" stroke="#f97316" strokeWidth="2" strokeDasharray="3,2" className="group-hover:stroke-yellow-400" />
                  <text fill="#f97316" stroke="#f8fafc" strokeWidth="2" paintOrder="stroke fill" fontWeight="bold" x="194" y="432" fontSize="6.5" className="font-mono group-hover:fill-yellow-400">ACTIVE RADON VENT</text>
                  
                  <text fill="#ef4444" stroke="#f8fafc" strokeWidth="2" paintOrder="stroke fill" fontWeight="bold" x="125" y="525" fontSize="8" textAnchor="end" className="font-mono group-hover:fill-yellow-400"> airtight radon seal </text>
                  <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="125" y="534" fontSize="6.5" textAnchor="end" className="font-mono opacity-80">SUMP BASIN (NBC 9.25.1.2)</text>
                  
                  <path d="M 130 522 L 160 495" stroke="#ef4444" strokeWidth="0.75" />
                  <polygon points="160,495 153,497 157,501" fill="#ef4444" />
                  
                  <rect x="120" y="400" width="115" height="155" fill="transparent" />
                </g>
              </g>

              {/* --- INTERACTIVE JOIST PENETRATION DETAIL --- */}
              <g onClick={() => onElementClick('joist-penetration')} className="cursor-pointer group">
                <rect x="280" y="420" width="120" height="60" fill="rgba(255,255,255,0.05)" stroke={currentColors.stroke} strokeWidth="1" strokeDasharray="2,2" />
                <rect x="290" y="440" width="100" height="20" fill="#f59e0b" opacity="0.3" stroke="#b45309" strokeWidth="2" />
                <circle cx="340" cy="450" r="10" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="2,2" className="group-hover:stroke-red-400" />
                <circle cx="340" cy="450" r="8" fill="rgba(56, 189, 248, 0.4)" stroke="#0ea5e9" strokeWidth="2" />
                <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="340" y="435" fontSize="7" textAnchor="middle" className="font-mono group-hover:fill-red-400">JOIST PENETRATION</text>
                <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="340" y="470" fontSize="5" textAnchor="middle" className="font-mono opacity-80">(MAX 1/4 DEPTH)</text>
                
                <circle cx="340" cy="450" r="15" fill="rgba(239, 68, 68, 0.2)" stroke="#ef4444" strokeWidth="1.5" className="animate-pulse opacity-50" />
              </g>

              
              {/* --- TITLE BLOCK --- */}
              <g onClick={() => onElementClick('title-block')} className="cursor-pointer group transition-all">
                <rect x="520" y="420" width="260" height="160" fill="rgba(255,255,255,0.05)" stroke={currentColors.stroke} strokeWidth="2" className="group-hover:fill-blue-500/40" />
                <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="535" y="450" fontSize="18" >PROJECT: RSR-2026</text>
                <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="535" y="475" fontSize="14">DWG: P1.0 - PLUMBING PLAN</text>
                <text fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" x="535" y="500" fontSize="14">SCALE: 1/4" = 1'-0"</text>
              </g>
            </g>
          )}          {page === 6 && (
            <svg viewBox="-100 -100 1000 800" width="100%" height="100%">
              {/* --- FAINT ARCHITECTURAL UNDERLAY (30% OPACITY) --- */}
              <g opacity="0.25" pointerEvents="none">
                {/* Exterior Walls */}
                <rect x="150" y="140" width="400" height="260" fill="none" stroke={currentColors.stroke} strokeWidth="2" />
                {/* Interior Bearing Wall */}
                <rect x="297" y="146" width="8" height="244" fill="none" stroke={currentColors.stroke} strokeWidth="1.5" />
                {/* Non-Bearing Partition */}
                <rect x="305" y="278" width="155" height="6" fill="none" stroke={currentColors.stroke} strokeWidth="1" />
                {/* Staircase Outline */}
                <rect x="156" y="270" width="85" height="120" fill="none" stroke={currentColors.stroke} strokeWidth="1" />
              </g>

              {/* Primary Bearing Beam */}
              <g onClick={() => onElementClick('lvl-beam')} className="cursor-pointer group z-10">
                <line x1="144" y1="270" x2="556" y2="270" stroke="#f43f5e" strokeWidth="6" className="group-hover:stroke-yellow-400" />
                <rect x="220" y="253" width="260" height="14" fill="#0f172a" rx="4" />
                <text x="350" y="262" fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontSize="10" fontWeight="bold" textAnchor="middle" className="font-mono group-hover:fill-yellow-400">
                  3-PLY 11-7/8" LVL BEAM (PRIMARY BEARING)
                </text>
              </g>

              {/* Engineered I-Joists Field */}
              {/* Top half floor joists */}
              {Array.from({ length: 13 }).map((_, i) => {
                const x = 170 + i * 30;
                return (
                  <g key={`joist-t-${i}`}>
                    <line x1={x} y1="140" x2={x} y2="275" stroke="#f59e0b" strokeWidth="2.5" />
                    <line x1={x - 2} y1="140" x2={x - 2} y2="275" stroke="#b45309" strokeWidth="0.5" />
                    <line x1={x + 2} y1="140" x2={x + 2} y2="275" stroke="#b45309" strokeWidth="0.5" />
                  </g>
                );
              })}

              {/* Bottom half floor joists - offset to represent splice lap */}
              {Array.from({ length: 13 }).map((_, i) => {
                const x = 170 + i * 30 + 5; // Spliced offset
                return (
                  <g key={`joist-b-${i}`}>
                    <line x1={x} y1="265" x2={x} y2="400" stroke="#f59e0b" strokeWidth="2.5" />
                    <line x1={x - 2} y1="265" x2={x - 2} y2="400" stroke="#b45309" strokeWidth="0.5" />
                    <line x1={x + 2} y1="265" x2={x + 2} y2="400" stroke="#b45309" strokeWidth="0.5" />
                  </g>
                );
              })}

              {/* Rim Joists */}
              <rect x="146" y="136" width="408" height="6" fill="#b45309" opacity="0.9" />
              <rect x="146" y="398" width="408" height="6" fill="#b45309" opacity="0.9" />
              <rect x="146" y="140" width="6" height="260" fill="#b45309" opacity="0.9" />
              <rect x="548" y="140" width="6" height="260" fill="#b45309" opacity="0.9" />

              {/* --- FLOOR OPENINGS HOTSPOT --- */}
              <g onClick={() => onElementClick('floor-openings')} className="cursor-pointer group z-10">
                <rect x="156" y="270" width="85" height="120" fill="rgba(245, 158, 11, 0.2)" stroke="transparent" />
                {/* Double Trimmers (Vertical) */}
                <line x1="156" y1="270" x2="156" y2="390" stroke="#fbbf24" strokeWidth="6" />
                <line x1="241" y1="270" x2="241" y2="390" stroke="#fbbf24" strokeWidth="6" />
                {/* Double Headers (Horizontal) */}
                <line x1="156" y1="270" x2="241" y2="270" stroke="#fbbf24" strokeWidth="6" />
                <line x1="156" y1="390" x2="241" y2="390" stroke="#fbbf24" strokeWidth="6" />
                
                <circle cx="198" cy="330" r="12" fill="none" stroke="#f59e0b" strokeWidth="2" className="group-hover:stroke-yellow-400" />
                <circle cx="198" cy="330" r="4" fill="#f59e0b" className="group-hover:fill-yellow-400" />
                <rect x="243" y="342" width="105" height="12" fill="#0f172a" rx="4" />
                <text x="246" y="350" fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontSize="8" fontWeight="bold" className="font-mono group-hover:fill-yellow-400">DOUBLE HEADER / TRIMMER</text>
              </g>
              
              {/* Cross-Bridging */}
              <g 
                onClick={() => onElementClick('cross-bridging')}
                className="cursor-pointer group z-10"
              >
                {Array.from({ length: 12 }).map((_, i) => {
                  const x = 170 + i * 30;
                  return (
                    <g key={`bridge-t-${i}`}>
                      <line x1={x + 3} y1="200" x2={x + 27} y2="210" stroke="#f59e0b" strokeWidth="1.5" className="group-hover:stroke-red-400 transition-colors" />
                      <line x1={x + 3} y1="210" x2={x + 27} y2="200" stroke="#f59e0b" strokeWidth="1.5" className="group-hover:stroke-red-400 transition-colors" />
                    </g>
                  );
                })}
                {Array.from({ length: 12 }).map((_, i) => {
                  const x = 175 + i * 30;
                  return (
                    <g key={`bridge-b-${i}`}>
                      <line x1={x + 3} y1="330" x2={x + 27} y2="340" stroke="#f59e0b" strokeWidth="1.5" className="group-hover:stroke-red-400 transition-colors" />
                      <line x1={x + 3} y1="340" x2={x + 27} y2="330" stroke="#f59e0b" strokeWidth="1.5" className="group-hover:stroke-red-400 transition-colors" />
                    </g>
                  );
                })}
                <rect x="245" y="188" width="210" height="10" fill="#0f172a" rx="4" />
                <text x="350" y="195" fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontSize="8" fontWeight="bold" textAnchor="middle" className="group-hover:fill-red-400 transition-colors font-mono">
                  WOOD CROSS-BRIDGING MIDSPAN (NBC 9.23.9.4)
                </text>
                <rect x="245" y="318" width="210" height="10" fill="#0f172a" rx="4" />
                <text x="350" y="325" fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontSize="8" fontWeight="bold" textAnchor="middle" className="group-hover:fill-red-400 transition-colors font-mono">
                  WOOD CROSS-BRIDGING MIDSPAN (NBC 9.23.9.4)
                </text>
                <rect x="150" y="190" width="400" height="30" fill="transparent" />
                <rect x="150" y="320" width="400" height="30" fill="transparent" />
              </g>

              {/* Joist Direction Arrow */}
              <g 
                onClick={() => onElementClick('joist-span-arrow')}
                className="cursor-pointer group"
              >
                {/* Massive double-ended vertical arrow at x = 470 */}
                <line x1="470" y1="150" x2="470" y2="390" stroke="#10b981" strokeWidth="3" className="group-hover:stroke-yellow-400" />
                <polygon points="470,150 465,162 475,162" fill="#10b981" className="group-hover:fill-yellow-400" />
                <polygon points="470,390 465,378 475,378" fill="#10b981" className="group-hover:fill-yellow-400" />
                <rect x="440" y="140" width="60" height="260" fill="transparent" />
                
                <g transform="translate(485, 270) rotate(-90)">
                  <text x="0" y="0" fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontSize="9.5" fontWeight="bold" textAnchor="middle" className="group-hover:fill-yellow-400 font-mono">
                    JOIST SPAN DIRECTION -&gt; T.O.F. BEARING POINTS
                  </text>
                </g>
              </g>

              {/* Metal Hanger Symbol & Detail */}
              <g 
                onClick={() => onElementClick('joist-hanger')}
                className="cursor-pointer group"
              >
                {/* Metal hanger at x = 350, y = 270 */}
                <path d="M 346 262 L 346 278 L 359 278 L 359 262" fill="none" stroke="#64748b" strokeWidth="3" className="group-hover:stroke-yellow-400" />
                {/* Detail circle referencing 5 / A6.1 */}
                <circle cx="352" cy="270" r="15" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 2" className="group-hover:stroke-yellow-400" />
                
                {/* Special detail bubble / callout symbol */}
                <g transform="translate(385, 245)">
                  <circle cx="0" cy="0" r="14" fill={theme === 'light-print' ? '#f1f5f9' : '#1e293b'} stroke={theme === 'light-print' ? '#0f172a' : '#38bdf8'} strokeWidth="1.5" />
                  <line x1="-14" y1="0" x2="14" y2="0" stroke={theme === 'light-print' ? '#0f172a' : '#38bdf8'} strokeWidth="1" />
                  <text x="0" y="-3" fill={theme === 'light-print' ? '#0f172a' : '#ffffff'} stroke={theme === 'light-print' ? '#ffffff' : '#0f172a'} strokeWidth="4" paintOrder="stroke fill" fontSize="8" fontWeight="black" textAnchor="middle">5</text>
                  <text x="0" y="9" fill={theme === 'light-print' ? '#0f172a' : '#ffffff'} stroke={theme === 'light-print' ? '#ffffff' : '#0f172a'} strokeWidth="4" paintOrder="stroke fill" fontSize="7" fontWeight="bold" textAnchor="middle">A6.1</text>
                </g>

                <text x="310" y="300" fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontSize="7.5" fontWeight="bold" className="group-hover:fill-yellow-400 font-mono">
                  LUS28-2 HANGER OR EQ.
                </text>
              </g>

              {/* --- INTERACTIVE JOIST PENETRATION DETAIL --- */}
              <g onClick={() => onElementClick('joist-penetration')} className="cursor-pointer group">
                <rect x="280" y="420" width="120" height="60" fill="rgba(255,255,255,0.05)" stroke={currentColors.stroke} strokeWidth="1" strokeDasharray="2,2" />
                <rect x="290" y="440" width="100" height="20" fill="#f59e0b" opacity="0.3" stroke="#b45309" strokeWidth="2" />
                <circle cx="340" cy="450" r="10" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="2,2" className="group-hover:stroke-red-400" />
                <circle cx="340" cy="450" r="8" fill="rgba(56, 189, 248, 0.4)" stroke="#0ea5e9" strokeWidth="2" />
                <text x="340" y="435" fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontSize="7" fontWeight="bold" textAnchor="middle" className="font-mono group-hover:fill-red-400">JOIST PENETRATION</text>
                <text x="340" y="470" fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontSize="5" fontWeight="bold" textAnchor="middle" className="font-mono opacity-80">(MAX 1/4 DEPTH)</text>
                
                <circle cx="340" cy="450" r="15" fill="rgba(239, 68, 68, 0.2)" stroke="#ef4444" strokeWidth="1.5" className="animate-pulse opacity-50" />
              </g>

              {/* --- TITLE BLOCK --- */}
              <g onClick={() => onElementClick('title-block')} className="cursor-pointer group transition-all">
                <rect x="520" y="420" width="260" height="160" fill="rgba(255,255,255,0.05)" stroke={currentColors.stroke} strokeWidth="2" className="group-hover:fill-blue-500/40" />
                <text x="535" y="450" fill={currentColors.fill} stroke={theme === 'cad-dark' ? '#0f172a' : 'transparent'} strokeWidth="5" paintOrder="stroke fill" fontSize="18" fontWeight="bold">PROJECT: RSR-2026</text>
                <text x="535" y="475" fill={currentColors.fill} stroke={theme === 'cad-dark' ? '#0f172a' : 'transparent'} strokeWidth="5" paintOrder="stroke fill" fontSize="14">DWG: S1.0 - FRAMING PLAN</text>
                <text x="535" y="500" fill={currentColors.fill} stroke={theme === 'cad-dark' ? '#0f172a' : 'transparent'} strokeWidth="5" paintOrder="stroke fill" fontSize="14">SCALE: 1/4" = 1'-0"</text>
              </g>
            </svg>
          )}
          {/* ================= PAGE 7: SITE PLAN ================= */}
          {page === 7 && (
            <g>
              {/* --- SITE PLAN GEOMETRY --- */}
              {/* Property Lines */}
              <g pointerEvents="none">
                <rect x="50" y="50" width="600" height="400" fill="none" stroke={currentColors.stroke} strokeWidth="3" strokeDasharray="20,10,5,10" opacity="0.6" />
                <text x="350" y="40" fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" fontSize="12" textAnchor="middle">PROPERTY LINE (70.0m x 45.0m)</text>
              </g>

              {/* Assumed Benchmark */}
              <g onClick={() => onElementClick('benchmark-elevation')} className="cursor-pointer group z-10">
                <circle cx="90" cy="90" r="15" fill="none" stroke="#2563eb" strokeWidth="3" className="group-hover:stroke-yellow-400" />
                <line x1="75" y1="90" x2="105" y2="90" stroke="#2563eb" strokeWidth="2" className="group-hover:stroke-yellow-400" />
                <line x1="90" y1="75" x2="90" y2="105" stroke="#2563eb" strokeWidth="2" className="group-hover:stroke-yellow-400" />
                <polygon points="90,90 105,90 90,105" fill="#2563eb" className="group-hover:fill-yellow-400" />
                <polygon points="90,90 75,90 90,75" fill="#2563eb" className="group-hover:fill-yellow-400" />
                <text x="90" y="130" fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" fontSize="9" textAnchor="middle" className="group-hover:fill-yellow-400">BM ELEV: 100.00m</text>
                <text x="90" y="145" fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" fontSize="8" textAnchor="middle" className="group-hover:fill-yellow-400 opacity-80">(TOP OF HYDRANT)</text>
                <rect x="50" y="70" width="80" height="80" fill="transparent" />
              </g>

              {/* --- SITE GRADING HOTSPOT --- */}
              <g onClick={() => onElementClick('site-grading')} className="cursor-pointer group z-10">
                <line x1="500" y1="250" x2="580" y2="250" stroke="#10b981" strokeWidth="3" className="group-hover:stroke-green-400" />
                <polygon points="580,250 570,245 570,255" fill="#10b981" className="group-hover:fill-green-400" />
                <text x="540" y="240" fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" fontSize="10" textAnchor="middle" className="font-mono group-hover:fill-yellow-400">MIN 10% SLOPE AWAY</text>
                <rect x="480" y="220" width="120" height="60" fill="transparent" />
              </g>
              
              {/* Building Footprint */}
              <rect x="200" y="150" width="300" height="200" fill="none" stroke={currentColors.stroke} strokeWidth="2" opacity="0.4" />
              <text x="350" y="250" fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" fontSize="14" textAnchor="middle">PROPOSED RESIDENCE</text>

              {/* Building Setback */}
              <g onClick={() => onElementClick('building-setback')} className="cursor-pointer group">
                {/* Front Setback */}
                <line x1="200" y1="50" x2="200" y2="150" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5,5" className="group-hover:stroke-yellow-400" />
                <line x1="500" y1="50" x2="500" y2="150" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5,5" className="group-hover:stroke-yellow-400" />
                <line x1="190" y1="100" x2="510" y2="100" stroke="#f59e0b" strokeWidth="1" opacity="0.5" />
                
                <path d="M 200 100 L 190 95 L 190 105 Z" fill="#f59e0b" className="group-hover:fill-yellow-400" />
                <path d="M 50 100 L 60 95 L 60 105 Z" fill="#f59e0b" className="group-hover:fill-yellow-400" />
                <line x1="50" y1="100" x2="200" y2="100" stroke="#f59e0b" strokeWidth="3" className="group-hover:stroke-yellow-400" />
                <text x="125" y="85" fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" fontSize="10" textAnchor="middle" className="group-hover:fill-yellow-400 font-mono">6.0m MIN.</text>
                <text x="125" y="115" fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" fontSize="9" textAnchor="middle" className="group-hover:fill-yellow-400 font-mono">FRONT SETBACK</text>
                <rect x="50" y="70" width="150" height="60" fill="transparent" />
              </g>

              {/* Batter Boards */}
              <g onClick={() => onElementClick('batter-boards')} className="cursor-pointer group">
                {/* Top-Left Batter Boards */}
                <line x1="180" y1="120" x2="220" y2="120" stroke="#fbbf24" strokeWidth="4" className="group-hover:stroke-yellow-300" />
                <line x1="170" y1="130" x2="170" y2="170" stroke="#fbbf24" strokeWidth="4" className="group-hover:stroke-yellow-300" />
                
                {/* Top-Right Batter Boards */}
                <line x1="480" y1="120" x2="520" y2="120" stroke="#fbbf24" strokeWidth="4" className="group-hover:stroke-yellow-300" />
                <line x1="530" y1="130" x2="530" y2="170" stroke="#fbbf24" strokeWidth="4" className="group-hover:stroke-yellow-300" />
                
                {/* String Lines */}
                <line x1="170" y1="150" x2="530" y2="150" stroke="#e2e8f0" strokeDasharray="4,4" strokeWidth="1.5" />
                <line x1="200" y1="120" x2="200" y2="350" stroke="#e2e8f0" strokeDasharray="4,4" strokeWidth="1.5" />
                <line x1="500" y1="120" x2="500" y2="350" stroke="#e2e8f0" strokeDasharray="4,4" strokeWidth="1.5" />
                
                {/* Pythagorean 3-4-5 Triangle at Top-Left */}
                <g transform="translate(200, 150)">
                  <line x1="0" y1="0" x2="40" y2="0" stroke="#ef4444" strokeWidth="2" />
                  <line x1="0" y1="0" x2="0" y2="30" stroke="#ef4444" strokeWidth="2" />
                  <line x1="40" y1="0" x2="0" y2="30" stroke="#3b82f6" strokeWidth="2" />
                  
                  <text x="20" y="-10" fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" fontSize="9" textAnchor="middle" className="font-mono group-hover:fill-yellow-400">4m</text>
                  <text x="-15" y="15" fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" fontSize="9" transform="rotate(-90 -15 15)" textAnchor="middle" className="font-mono group-hover:fill-yellow-400">3m</text>
                  <text x="25" y="25" fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" fontSize="9" transform="rotate(-36.87 25 25)" textAnchor="middle" className="font-mono group-hover:fill-yellow-400">5m</text>
                  <text x="0" y="-25" fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" fontSize="10" textAnchor="middle" className="font-mono group-hover:fill-yellow-400">3-4-5 SQUARING METHOD</text>
                </g>
                <rect x="150" y="100" width="380" height="250" fill="transparent" />
              </g>

              {/* --- TITLE BLOCK --- */}
              <g onClick={() => onElementClick('title-block')} className="cursor-pointer group transition-all">
                <rect x="520" y="420" width="260" height="160" fill="rgba(255,255,255,0.05)" stroke={currentColors.stroke} strokeWidth="2" className="group-hover:fill-blue-500/40" />
                <text x="535" y="450" fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" fontSize="18">PROJECT: RSR-2026</text>
                <text x="535" y="475" fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" fontSize="14">DWG: SP1 - SITE PLAN</text>
                <text x="535" y="500" fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" fontSize="14">SCALE: 1:100</text>
              </g>
            </g>
          )}
          

          {/* ================= PAGE 8: ROOF FRAMING ================= */}
          {page === 8 && (
            <g>
              {/* --- ROOF FRAMING GEOMETRY --- */}
              <g opacity="0.3" pointerEvents="none">
                {/* Exterior Walls */}
                <rect x="200" y="150" width="300" height="200" fill="none" stroke={currentColors.stroke} strokeWidth="2" />
                {/* Center Bearing */}
                <line x1="200" y1="250" x2="500" y2="250" stroke={currentColors.stroke} strokeWidth="1" strokeDasharray="10,5" />
              </g>

              {/* Rafters */}
              <g opacity="0.7">
                {Array.from({ length: 15 }).map((_, i) => {
                  const x = 200 + i * 21.4; // approx 16" O.C. scaled
                  return (
                    <g key={`rafter-${i}`}>
                      <line x1={x} y1="130" x2={x} y2="250" stroke="#f59e0b" strokeWidth="2.5" />
                      <line x1={x} y1="250" x2={x} y2="370" stroke="#f59e0b" strokeWidth="2.5" />
                    </g>
                  );
                })}
              </g>

              {/* --- ATTIC VENTILATION HOTSPOT --- */}
              <g onClick={() => onElementClick('attic-ventilation')} className="cursor-pointer group">
                <circle cx="200" cy="370" r="15" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="2,2" className="animate-spin-slow group-hover:stroke-green-400" />
                <line x1="185" y1="370" x2="140" y2="370" stroke="#10b981" strokeWidth="2" className="group-hover:stroke-green-400" />
                <text x="135" y="373" fill="#10b981" fontSize="8" fontWeight="bold" textAnchor="end" className="font-mono group-hover:fill-green-400">ATTIC VENTILATION (1/300)</text>
                <rect x="20" y="355" width="180" height="30" fill="transparent" />
              </g>

              {/* Ridge Board */}
              <g onClick={() => onElementClick('ridge-board')} className="cursor-pointer group">
                <rect x="200" y="247" width="300" height="6" fill="#ef4444" className="group-hover:fill-yellow-400" />
                <line x1="350" y1="253" x2="350" y2="400" stroke="#f87171" strokeWidth="1" className="group-hover:stroke-yellow-400" strokeDasharray="4,4" />
                <text x="350" y="415" fill="#ef4444" fontSize="10" fontWeight="bold" textAnchor="middle" className="font-mono group-hover:fill-yellow-400">2x10 RIDGE BOARD (NBC 9.23.14.8)</text>
                <rect x="200" y="400" width="300" height="30" fill="transparent" />
              </g>

              {/* Collar Ties */}
              <g onClick={() => onElementClick('collar-ties')} className="cursor-pointer group">
                {/* Visualized as dashed lines crossing rafters */}
                {[1, 3, 5, 7, 9, 11, 13].map((i) => {
                  const x = 200 + i * 21.4;
                  return (
                    <line key={`collar-tie-${i}`} x1={x} y1="210" x2={x} y2="290" stroke="#3b82f6" strokeWidth="3" strokeDasharray="5,5" className="group-hover:stroke-yellow-400" />
                  );
                })}
                <line x1="307" y1="290" x2="307" y2="430" stroke="#3b82f6" strokeWidth="1" className="group-hover:stroke-yellow-400" strokeDasharray="4,4" />
                <text x="307" y="445" fill="#3b82f6" fontSize="9" fontWeight="bold" textAnchor="middle" className="font-mono group-hover:fill-yellow-400">1x6 COLLAR TIES (UPPER 1/3 OF ATTIC)</text>
                <rect x="207" y="430" width="200" height="25" fill="transparent" />
              </g>

              {/* Birdsmouth Cut */}
              <g onClick={() => onElementClick('birdsmouth-cut')} className="cursor-pointer group">
                {/* Zoomed in callout circle */}
                <circle cx="200" cy="150" r="25" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="5,2" className="group-hover:stroke-yellow-400" />
                <path d="M 215 130 L 260 90" fill="none" stroke="#10b981" strokeWidth="1" />
                
                {/* Detail Box */}
                <rect x="260" y="40" width="120" height="100" fill={theme === 'light-print' ? '#f1f5f9' : '#1e293b'} stroke="#10b981" strokeWidth="2" />
                <text x="320" y="55" fill="#10b981" fontSize="8" fontWeight="bold" textAnchor="middle" className="font-mono group-hover:fill-yellow-400">BIRDSMOUTH DETAIL</text>
                
                {/* Wall plate */}
                <rect x="290" y="100" width="20" height="15" fill="#334155" stroke="#fbbf24" strokeWidth="1" />
                
                {/* Rafter */}
                <path d="M 265 95.5 L 340 58 L 340 83 L 306 100 L 290 100 L 290 108 L 265 120.5 Z" fill="none" stroke="#f59e0b" strokeWidth="2" />
                
                {/* Seat Cut Highlight */}
                <line x1="290" y1="100" x2="306" y2="100" stroke="#fbbf24" strokeWidth="4" className="group-hover:stroke-yellow-400" />
                
                <text x="320" y="132" fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" fontSize="12" textAnchor="middle" className="font-mono">MIN. BEARING SURFACE</text>
                <rect x="250" y="30" width="140" height="110" fill="transparent" />
              </g>

              {/* Roof Pitch Indicator */}
              <g onClick={() => onElementClick('roof-pitch-indicator')} className="cursor-pointer group">
                <polygon points="400,100 450,100 450,70" fill="none" stroke="#8b5cf6" strokeWidth="2" className="group-hover:stroke-purple-400" />
                <text x="425" y="115" fill="#8b5cf6" fontSize="10" fontWeight="bold" textAnchor="middle" className="font-mono group-hover:fill-purple-400">12</text>
                <text x="460" y="90" fill="#8b5cf6" fontSize="10" fontWeight="bold" textAnchor="middle" className="font-mono group-hover:fill-purple-400">4</text>
                {/* Hitbox */}
                <rect x="390" y="60" width="80" height="60" fill="transparent" />
              </g>

              {/* --- TITLE BLOCK --- */}
              <g onClick={() => onElementClick('title-block')} className="cursor-pointer group transition-all">
                <rect x="520" y="420" width="260" height="160" fill="rgba(255,255,255,0.05)" stroke={currentColors.stroke} strokeWidth="2" className="group-hover:fill-blue-500/40" />
                <text x="535" y="450" fill={currentColors.fill} fontSize="18" fontWeight="bold">PROJECT: RSR-2026</text>
                <text x="535" y="475" fill={currentColors.fill} fontSize="14">DWG: R1.0 - ROOF FRAMING</text>
                <text x="535" y="500" fill={currentColors.fill} fontSize="14">SCALE: 1/4" = 1'-0"</text>
              </g>
            </g>
          )}
          
          
          
          {/* ================= PAGE 9: EXTERIOR ELEVATION ================= */}
          {page === 9 && (
            <g>
              {/* --- EXTERIOR ELEVATION GEOMETRY --- */}
              
              {/* House Outline */}
              <g stroke={currentColors.stroke} strokeWidth="2" fill="none">
                <rect x="250" y="200" width="300" height="180" />
                <polygon points="250,200 400,100 550,200" />
                <line x1="250" y1="200" x2="550" y2="200" /> {/* Eaves */}
              </g>

              {/* Siding Lines */}
              <g stroke={currentColors.stroke} strokeWidth="0.5" opacity="0.3">
                {Array.from({ length: 18 }).map((_, i) => (
                  <line key={`siding-${i}`} x1="250" y1={210 + i * 10} x2="550" y2={210 + i * 10} />
                ))}
              </g>

              {/* --- EAVES PROTECTION HOTSPOT --- */}
              <g onClick={() => onElementClick('eaves-protection')} className="cursor-pointer group">
                <line x1="250" y1="200" x2="300" y2="164" stroke="#0ea5e9" strokeWidth="4" strokeDasharray="6,2" className="group-hover:stroke-cyan-400 animate-pulse" />
                <circle cx="275" cy="182" r="4" fill="#0ea5e9" className="group-hover:fill-cyan-400" />
                <line x1="275" y1="182" x2="220" y2="150" stroke="#0ea5e9" strokeWidth="1" className="group-hover:stroke-cyan-400" />
                <text x="215" y="145" fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" fontSize="8" textAnchor="end" className="font-mono group-hover:fill-cyan-400">900mm EAVES PROTECTION</text>
                <rect x="80" y="130" width="220" height="80" fill="transparent" />
              </g>
              
              {/* Window */}
              <g stroke={currentColors.stroke} strokeWidth="1.5">
                <rect x="350" y="250" width="80" height="80" fill={theme === 'light-print' ? '#f8fafc' : 'rgba(56, 189, 248, 0.1)'} />
                <rect x="355" y="255" width="70" height="70" fill="none" />
                <line x1="390" y1="255" x2="390" y2="325" />
                <line x1="355" y1="290" x2="425" y2="290" />
              </g>

              {/* Roof Shingles */}
              <g stroke={currentColors.stroke} strokeWidth="0.5" opacity="0.4">
                <path d="M 255 195 L 395 105" />
                <path d="M 265 195 L 395 110" />
                <path d="M 275 195 L 395 115" />
                
                <path d="M 545 195 L 405 105" />
                <path d="M 535 195 L 405 110" />
                <path d="M 525 195 L 405 115" />
              </g>

              {/* Secondary Roof / Dormer to show step flashing */}
              <g stroke={currentColors.stroke} strokeWidth="1.5" fill="none">
                <polygon points="250,260 200,260 250,230" fill={theme === 'light-print' ? '#ffffff' : '#1e293b'} />
                <rect x="200" y="260" width="50" height="120" />
              </g>

              {/* Finished Grade Line */}
              <g>
                <line x1="150" y1="380" x2="650" y2="380" stroke="#10b981" strokeWidth="4" />
                <text x="450" y="370" fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" fontSize="12">FINISHED GRADE</text>
              </g>

              {/* Step Flashing Hotspot */}
              <g onClick={() => onElementClick('step-flashing')} className="cursor-pointer group">
                <line x1="250" y1="260" x2="200" y2="200" stroke="#f87171" strokeWidth="1" className="group-hover:stroke-yellow-400" />
                <text x="195" y="195" fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" fontSize="10" textAnchor="end" className="font-mono group-hover:fill-yellow-400">STEP FLASHING (NBC 9.26.4)</text>
                <rect x="80" y="185" width="180" height="75" fill="transparent" />
              </g>

              {/* Finished Grade Clearance Hotspot */}
              <g onClick={() => onElementClick('grade-clearance')} className="cursor-pointer group">
                <line x1="280" y1="380" x2="280" y2="360" stroke="#f59e0b" strokeWidth="3" className="group-hover:stroke-yellow-400" />
                <polygon points="280,360 275,365 285,365" fill="#f59e0b" className="group-hover:fill-yellow-400" />
                <polygon points="280,380 275,375 285,375" fill="#f59e0b" className="group-hover:fill-yellow-400" />
                <text x="290" y="373" fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" fontSize="8" textAnchor="start" className="font-mono group-hover:fill-yellow-400">MIN 200mm CLEARANCE (NBC 9.27.2.4)</text>
                <rect x="270" y="355" width="220" height="30" fill="transparent" />
              </g>

              {/* Window Drip Cap Hotspot */}
              <g onClick={() => onElementClick('window-drip-cap')} className="cursor-pointer group">
                <rect x="345" y="247" width="90" height="4" fill="#3b82f6" className="group-hover:fill-yellow-400" />
                <line x1="390" y1="247" x2="390" y2="220" stroke="#60a5fa" strokeWidth="1" className="group-hover:stroke-yellow-400" />
                <text x="390" y="215" fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" fontSize="9" textAnchor="middle" className="font-mono group-hover:fill-yellow-400">DRIP CAP FLASHING (NBC 9.27.3.8)</text>
                <rect x="300" y="205" width="180" height="50" fill="transparent" />
              </g>

              {/* Egress Window Hotspot */}
              <g onClick={() => onElementClick('egress-window')} className="cursor-pointer group">
                <circle cx="390" cy="290" r="15" fill="none" stroke="#ec4899" strokeWidth="2" strokeDasharray="3,3" className="group-hover:stroke-pink-400 animate-spin-slow" />
                <circle cx="390" cy="290" r="4" fill="#ec4899" className="group-hover:fill-pink-400 animate-pulse" />
                <line x1="405" y1="290" x2="440" y2="290" stroke="#ec4899" strokeWidth="1" className="group-hover:stroke-pink-400" />
                <text x="445" y="293" fill="#f8fafc" stroke="#0f172a" strokeWidth="5" paintOrder="stroke fill" fontWeight="bold" fontSize="9" textAnchor="start" className="font-mono group-hover:fill-pink-400">EGRESS WINDOW</text>
                <rect x="375" y="275" width="160" height="30" fill="transparent" />
              </g>

              {/* --- TITLE BLOCK --- */}
              <g onClick={() => onElementClick('title-block')} className="cursor-pointer group transition-all">
                <rect x="520" y="420" width="260" height="160" fill="rgba(255,255,255,0.05)" stroke={currentColors.stroke} strokeWidth="2" className="group-hover:fill-blue-500/40" />
                <text x="535" y="450" fill={currentColors.fill} fontSize="18" fontWeight="bold">PROJECT: RSR-2026</text>
                <text x="535" y="475" fill={currentColors.fill} fontSize="14">DWG: A3.1 - FRONT ELEV</text>
                <text x="535" y="500" fill={currentColors.fill} fontSize="14">SCALE: 1/4" = 1'-0"</text>
              </g>
            </g>
          )}

          {/* ================= PAGE 10: DEDICATED STAIR SECTION ================= */}
          {page === 10 && (
            <g>
              {/* --- STAIR GEOMETRY --- */}
              <g stroke={currentColors.stroke} strokeWidth="2" fill="none">
                {/* Upper Floor */}
                <line x1="100" y1="150" x2="250" y2="150" />
                <line x1="250" y1="150" x2="250" y2="170" />
                <line x1="250" y1="170" x2="100" y2="170" />
                
                {/* Lower Floor */}
                <line x1="450" y1="400" x2="600" y2="400" />
                <line x1="450" y1="400" x2="450" y2="420" />
                <line x1="450" y1="420" x2="600" y2="420" />

                {/* Stringer & Treads/Risers */}
                <path d="M 250 150 L 275 150 L 275 180 L 300 180 L 300 210 L 325 210 L 325 240 L 350 240 L 350 270 L 375 270 L 375 300 L 400 300 L 400 330 L 425 330 L 425 360 L 450 360 L 450 400 L 410 400 L 250 196 Z" />
                
                {/* Handrail */}
                <line x1="250" y1="50" x2="450" y2="290" strokeWidth="4" />
                <line x1="275" y1="150" x2="275" y2="80" strokeWidth="1" />
                <line x1="350" y1="240" x2="350" y2="170" strokeWidth="1" />
                <line x1="425" y1="330" x2="425" y2="260" strokeWidth="1" />
              </g>

              {/* Ceiling / Header above stairs */}
              <g stroke={currentColors.stroke} strokeWidth="2" fill="none">
                <line x1="320" y1="50" x2="500" y2="50" />
                <line x1="320" y1="50" x2="320" y2="70" />
                <line x1="320" y1="70" x2="500" y2="70" />
                <rect x="310" y="50" width="10" height="20" fill={currentColors.stroke} /> {/* Header */}
              </g>

              {/* Headroom Clearance Hotspot */}
              <g onClick={() => onElementClick('headroom-clearance')} className="cursor-pointer group">
                <line x1="320" y1="70" x2="320" y2="204" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,5" className="group-hover:stroke-yellow-400" />
                <polygon points="320,70 315,80 325,80" fill="#ef4444" className="group-hover:fill-yellow-400" />
                <polygon points="320,204 315,194 325,194" fill="#ef4444" className="group-hover:fill-yellow-400" />
                <line x1="320" y1="137" x2="400" y2="137" stroke="#f87171" strokeWidth="1" className="group-hover:stroke-yellow-400" />
                <text x="405" y="140" fill="#ef4444" fontSize="10" fontWeight="bold" textAnchor="start" className="font-mono group-hover:fill-yellow-400">MIN 1950mm HEADROOM (NBC 9.8.2)</text>
                <rect x="300" y="60" width="280" height="150" fill="transparent" />
              </g>

              {/* Stringer Top Connection Hotspot */}
              <g onClick={() => onElementClick('stringer-top-connection')} className="cursor-pointer group">
                <circle cx="250" cy="160" r="15" fill="none" stroke="#f97316" strokeWidth="2" strokeDasharray="3,3" className="group-hover:stroke-orange-400 animate-spin-slow" />
                <line x1="235" y1="160" x2="180" y2="160" stroke="#f97316" strokeWidth="1" className="group-hover:stroke-orange-400" />
                <text x="175" y="163" fill="#f97316" fontSize="9" fontWeight="bold" textAnchor="end" className="font-mono group-hover:fill-orange-400">HEADER CONNECTION</text>
                <rect x="50" y="140" width="220" height="40" fill="transparent" />
              </g>

              {/* Effective Depth Hotspot */}
              <g onClick={() => onElementClick('effective-depth')} className="cursor-pointer group">
                <line x1="300" y1="210" x2="265" y2="215" stroke="#f59e0b" strokeWidth="2" className="group-hover:stroke-yellow-400" />
                <polygon points="300,210 293,207 295,214" fill="#f59e0b" className="group-hover:fill-yellow-400" />
                <polygon points="265,215 272,218 270,211" fill="#f59e0b" className="group-hover:fill-yellow-400" />
                <line x1="282" y1="212" x2="200" y2="240" stroke="#f59e0b" strokeWidth="1" className="group-hover:stroke-yellow-400" />
                <text x="195" y="243" fill="#f59e0b" fontSize="9" fontWeight="bold" textAnchor="end" className="font-mono group-hover:fill-yellow-400">MIN 90mm EFF. DEPTH</text>
                <rect x="50" y="200" width="260" height="60" fill="transparent" />
              </g>

              {/* Rise & Run Tolerances Hotspot */}
              <g onClick={() => onElementClick('stair-tolerances')} className="cursor-pointer group">
                <line x1="350" y1="270" x2="350" y2="240" stroke="#10b981" strokeWidth="2" className="group-hover:stroke-green-400" />
                <line x1="325" y1="240" x2="350" y2="240" stroke="#10b981" strokeWidth="2" className="group-hover:stroke-green-400" />
                
                <line x1="325" y1="240" x2="325" y2="210" stroke="#10b981" strokeWidth="2" strokeDasharray="2,2" className="group-hover:stroke-green-400" />
                <line x1="300" y1="210" x2="325" y2="210" stroke="#10b981" strokeWidth="2" strokeDasharray="2,2" className="group-hover:stroke-green-400" />

                <line x1="337" y1="240" x2="280" y2="300" stroke="#10b981" strokeWidth="1" className="group-hover:stroke-green-400" />
                <text x="275" y="303" fill="#10b981" fontSize="9" fontWeight="bold" textAnchor="end" className="font-mono group-hover:fill-green-400">MAX 5mm VARIATION</text>
                <rect x="100" y="230" width="280" height="90" fill="transparent" />
              </g>

              {/* Handrail Height Hotspot */}
              <g onClick={() => onElementClick('guards-handrails')} className="cursor-pointer group">
                <line x1="375" y1="200" x2="375" y2="270" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4,4" className="group-hover:stroke-yellow-400" />
                <polygon points="375,200 370,210 380,210" fill="#3b82f6" className="group-hover:fill-yellow-400" />
                <polygon points="375,270 370,260 380,260" fill="#3b82f6" className="group-hover:fill-yellow-400" />
                <line x1="375" y1="235" x2="430" y2="235" stroke="#60a5fa" strokeWidth="1" className="group-hover:stroke-yellow-400" />
                <text x="435" y="238" fill="#3b82f6" fontSize="9" fontWeight="bold" textAnchor="start" className="font-mono group-hover:fill-yellow-400">GUARDS & HANDRAILS (NBC 9.8.7/8)</text>
                <rect x="360" y="190" width="280" height="90" fill="transparent" />
              </g>

              {/* --- TITLE BLOCK --- */}
              <g onClick={() => onElementClick('title-block')} className="cursor-pointer group transition-all">
                <rect x="520" y="420" width="260" height="160" fill="rgba(255,255,255,0.05)" stroke={currentColors.stroke} strokeWidth="2" className="group-hover:fill-blue-500/40" />
                <text x="535" y="450" fill={currentColors.fill} fontSize="18" fontWeight="bold">PROJECT: RSR-2026</text>
                <text x="535" y="475" fill={currentColors.fill} fontSize="14">DWG: A4.1 - STAIR DETAILS</text>
                <text x="535" y="500" fill={currentColors.fill} fontSize="14">SCALE: 1/2" = 1'-0"</text>
              </g>
            </g>
          )}
        </svg>
      </div>
    </div>
  );
};

export default InteractiveBlueprint;
