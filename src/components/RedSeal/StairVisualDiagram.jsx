import React, { useState } from 'react'
import { Info, CheckCircle, AlertTriangle, HelpCircle, Layers, Eye, EyeOff } from 'lucide-react'

export default function StairVisualDiagram({ stairRise, stairTarget, stairTread, stairResults, renderValue }) {
  const [hoveredStep, setHoveredStep] = useState(null)
  const [lockedStep, setLockedStep] = useState(null)
  
  // Toggles for architectural layers
  const [showStringer, setShowStringer] = useState(true)
  const [showHeadroom, setShowHeadroom] = useState(false)
  const [showNosePoints, setShowNosePoints] = useState(true)

  // Safe defaults if calculation is incomplete
  const totalRise = stairRise?.mm || 2450
  const totalRun = stairResults?.totalRun || 3575
  const risers = stairResults?.risers || 14
  const riserHeight = stairResults?.riserHeight || 175
  const treads = stairResults?.treads || 13
  const treadDepth = stairTread?.mm || 275

  // SVG total size
  const svgW = 500
  const svgH = 340

  // Bounding box for stair drawing (fits nicely inside the SVG)
  const maxStairW = 310
  const maxStairH = 180

  // Scaling factor to fit and preserve realistic aspect ratio
  const scaleX = totalRun > 0 ? maxStairW / totalRun : 1
  const scaleY = totalRise > 0 ? maxStairH / totalRise : 1
  const scale = Math.min(scaleX, scaleY)

  const W_scaled = totalRun * scale
  const H_scaled = totalRise * scale

  // Anchor bottom-left point of the staircase
  const x0 = 60
  const y0 = 240

  // Actual step dimensions in scaled pixels
  const w_scaled = treadDepth * scale
  const h_scaled = riserHeight * scale

  // Generate path coordinates for the stair steps
  let stepsPathD = `M ${x0} ${y0}`
  const stepsCoords = []

  for (let i = 0; i < risers; i++) {
    const rStartIdx = i
    const stepX = x0 + rStartIdx * w_scaled
    const stepY = y0 - rStartIdx * h_scaled
    const nextY = y0 - (rStartIdx + 1) * h_scaled

    // Riser vertical line
    stepsPathD += ` L ${stepX} ${nextY}`
    
    let nextX = stepX
    if (i < risers - 1) {
      nextX = x0 + (rStartIdx + 1) * w_scaled
      // Tread horizontal line
      stepsPathD += ` L ${nextX} ${nextY}`
    }

    // Cache exact nose coordinate (the outer corner of the step) for labels and layers
    stepsCoords.push({
      index: i,
      riserStartX: stepX,
      riserStartY: stepY,
      noseX: stepX,
      noseY: nextY,
      treadEndX: nextX,
      treadEndY: nextY,
      physicalHeight: riserHeight,
      physicalDepth: i < risers - 1 ? treadDepth : 0,
      cumulativeRise: riserHeight * (i + 1),
      cumulativeRun: treadDepth * i
    })
  }

  // Create the closed shape underneath the stairs to draw a solid filled region
  const lastCoord = stepsCoords[stepsCoords.length - 1]
  const closedShapeD = `${stepsPathD} L ${lastCoord?.treadEndX + 20} ${lastCoord?.treadEndY} L ${lastCoord?.treadEndX + 20} ${y0} L ${x0 - 20} ${y0} Z`

  // Headroom line (NBC 9.8.4 requires min 1950mm clear vertical headroom)
  const headroomOffsetMm = 1950
  const headroomOffsetPx = headroomOffsetMm * scale
  
  // Nose line coordinates (connecting the first stair nose to the top stair landing)
  const noseLineStart = { x: x0, y: y0 - h_scaled }
  const noseLineEnd = { x: x0 + (risers - 1) * w_scaled, y: y0 - risers * h_scaled }

  // Compliance states for coloring highlights
  const riserHasWarning = riserHeight > 200 || riserHeight < 125
  const treadHasWarning = treadDepth < 255 || treadDepth > 355
  const comfortHasWarning = stairResults?.comfortWarning !== null

  // Active step selected (prioritize hovered, fallback to locked clicked step)
  const activeStepIdx = hoveredStep !== null ? hoveredStep : lockedStep
  const activeStep = activeStepIdx !== null ? stepsCoords[activeStepIdx] : null

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm">
      
      {/* HEADER CONTROLS */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 dark:border-slate-800 pb-3 gap-3">
        <div>
          <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
            <Layers size={14} className="text-brand-500" /> Real-Time Blueprint Engine
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            Proportional SVG diagram scaled to actual slope ratio.
          </p>
        </div>
        
        {/* LAYERS TOGGLE */}
        <div className="flex flex-wrap gap-1.5 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200/50 dark:border-slate-800">
          <button
            onClick={() => setShowStringer(!showStringer)}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-colors flex items-center gap-1 min-h-[28px] ${
              showStringer 
                ? 'bg-brand-500 text-white' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 dark:focus:ring-offset-slate-900 focus:border-brand-500`}
            title="Toggle Cut Stringer board layout outline"
            aria-label="Toggle visual cut stringer board layout outline"
            aria-pressed={showStringer}
          >
            {showStringer ? <Eye size={12} /> : <EyeOff size={12} />}
            <span>Stringer</span>
          </button>
          
          <button
            onClick={() => setShowHeadroom(!showHeadroom)}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-colors flex items-center gap-1 min-h-[28px] ${
              showHeadroom 
                ? 'bg-brand-500 text-white' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 dark:focus:ring-offset-slate-900 focus:border-brand-500`}
            title="Toggle overhead NBC 1.95m headroom envelope"
            aria-label="Toggle 1.95 meters overhead headroom limit clearance envelope"
            aria-pressed={showHeadroom}
          >
            {showHeadroom ? <Eye size={12} /> : <EyeOff size={12} />}
            <span>Headroom Limit</span>
          </button>

          <button
            onClick={() => setShowNosePoints(!showNosePoints)}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-colors flex items-center gap-1 min-h-[28px] ${
              showNosePoints 
                ? 'bg-brand-500 text-white' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 dark:focus:ring-offset-slate-900 focus:border-brand-500`}
            title="Toggle points indicating stair nosing line"
            aria-label="Toggle point indicators for stair nosing slope line"
            aria-pressed={showNosePoints}
          >
            {showNosePoints ? <Eye size={12} /> : <EyeOff size={12} />}
            <span>Nose Line</span>
          </button>
        </div>
      </div>

      {/* SVG BLUEPRINT DRAWING CANVAS */}
      <div className="relative border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 rounded-xl overflow-hidden flex items-center justify-center p-2">
        <svg 
          viewBox={`0 0 ${svgW} ${svgH}`} 
          className="w-full max-w-[440px] h-auto select-none font-mono"
        >
          {/* DEFINITIONS FOR GRADIENTS AND PATTERNS */}
          <defs>
            <linearGradient id="stairFillGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-brand-500, #3B82F6)" stopOpacity="0.12" />
              <stop offset="100%" stopColor="var(--color-brand-500, #3B82F6)" stopOpacity="0.01" />
            </linearGradient>
            <linearGradient id="stringerGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#D97706" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#92400E" stopOpacity="0.03" />
            </linearGradient>
            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="currentColor" />
            </marker>
          </defs>

          {/* GRID BACKGROUND IN BLUEPRINT STYLE */}
          <g className="opacity-[0.06] dark:opacity-[0.1]" stroke="#334155" strokeWidth="0.5">
            {Array.from({ length: 11 }).map((_, i) => (
              <line key={`v-${i}`} x1={i * 50} y1="0" x2={i * 50} y2={svgH} />
            ))}
            {Array.from({ length: 8 }).map((_, i) => (
              <line key={`h-${i}`} x1="0" y1={i * 50} x2={svgW} y2={i * 50} />
            ))}
          </g>

          {/* LOWER FLOOR GROUND LINE */}
          <line 
            x1="20" 
            y1={y0} 
            x2={svgW - 20} 
            y2={y0} 
            className="stroke-slate-400 dark:stroke-slate-600" 
            strokeWidth="2" 
          />
          <text x="25" y={y0 + 14} className="text-[8px] font-black fill-slate-400 dark:fill-slate-500 uppercase tracking-wider">Lower Floor Line</text>

          {/* UPPER LANDING FLOOR LEVEL */}
          {lastCoord && (
            <g>
              <line 
                x1={lastCoord.treadEndX} 
                y1={lastCoord.treadEndY} 
                x2={svgW - 20} 
                y2={lastCoord.treadEndY} 
                className="stroke-slate-400 dark:stroke-slate-600" 
                strokeWidth="2" 
              />
              <text 
                x={svgW - 90} 
                y={lastCoord.treadEndY - 8} 
                className="text-[8px] font-black fill-slate-400 dark:fill-slate-500 uppercase tracking-wider text-right"
              >
                Upper Landing
              </text>
            </g>
          )}

          {/* LAYER 1: STRINGER BOARD BACKDROP */}
          {showStringer && lastCoord && (
            <path
              d={`M ${x0} ${y0} L ${lastCoord.treadEndX} ${lastCoord.treadEndY} L ${lastCoord.treadEndX} ${lastCoord.treadEndY + 45} L ${x0} ${y0 + 45} Z`}
              fill="url(#stringerGrad)"
              stroke="#D97706"
              strokeWidth="1.5"
              strokeDasharray="4,2"
              className="opacity-75"
            />
          )}

          {/* SOLID STAIR SHAPE FILL */}
          <path d={closedShapeD} fill="url(#stairFillGrad)" />

          {/* LAYER 2: NBC 1.95M HEADROOM CLEARANCE ENVELOPE */}
          {showHeadroom && (
            <g className="text-pink-500 dark:text-pink-400">
              {/* Ceiling clearance line offset upwards */}
              <line 
                x1={noseLineStart.x} 
                y1={noseLineStart.y - headroomOffsetPx} 
                x2={noseLineEnd.x} 
                y2={noseLineEnd.y - headroomOffsetPx} 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeDasharray="3,3" 
              />
              {/* Clearance bracket arrow indicator */}
              <line 
                x1={x0 + W_scaled/2} 
                y1={y0 - H_scaled/2 - h_scaled/2} 
                x2={x0 + W_scaled/2} 
                y2={y0 - H_scaled/2 - h_scaled/2 - headroomOffsetPx} 
                stroke="currentColor" 
                strokeWidth="1" 
                markerStart="url(#arrow)"
                markerEnd="url(#arrow)"
              />
              <rect 
                x={x0 + W_scaled/2 - 58} 
                y={y0 - H_scaled/2 - h_scaled/2 - headroomOffsetPx/2 - 8} 
                width="116" 
                height="15" 
                rx="3" 
                className="fill-white dark:fill-slate-900 stroke-pink-500/30" 
                strokeWidth="0.5" 
              />
              <text 
                x={x0 + W_scaled/2} 
                y={y0 - H_scaled/2 - h_scaled/2 - headroomOffsetPx/2 + 2} 
                className="text-[7.5px] font-black fill-pink-500 dark:fill-pink-400 text-center"
                textAnchor="middle"
              >
                NBC Headroom: {renderValue(headroomOffsetMm)}
              </text>
            </g>
          )}

          {/* LAYER 3: STAIR NOSING LINE */}
          {showNosePoints && (
            <line 
              x1={noseLineStart.x} 
              y1={noseLineStart.y} 
              x2={noseLineEnd.x} 
              y2={noseLineEnd.y} 
              className="stroke-emerald-500/40 dark:stroke-emerald-400/35" 
              strokeWidth="1" 
              strokeDasharray="4,4" 
            />
          )}

          {/* CORE STAIR PROFILE LINES */}
          <path 
            d={stepsPathD} 
            className="stroke-slate-700 dark:stroke-slate-300 fill-none" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />

          {/* NOSE PIPS (OUTER STAIR EDGES) */}
          {showNosePoints && stepsCoords.map((step, idx) => (
            <circle
              key={`nose-${idx}`}
              cx={step.noseX}
              cy={step.noseY}
              r="2.5"
              className="fill-emerald-500 dark:fill-emerald-400"
            />
          ))}

          {/* DIMENSION LINES */}
          
          {/* A. TOTAL RUN DIMENSION (BOTTOM) */}
          <g className="text-slate-500 dark:text-slate-400">
            {/* Left projection line */}
            <line x1={x0} y1={y0 + 4} x2={x0} y2={y0 + 35} stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,2" />
            {/* Right projection line */}
            <line x1={x0 + W_scaled} y1={y0 + 4} x2={x0 + W_scaled} y2={y0 + 35} stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,2" />
            {/* Dimension line with arrows */}
            <line 
              x1={x0} 
              y1={y0 + 26} 
              x2={x0 + W_scaled} 
              y2={y0 + 26} 
              stroke="currentColor" 
              strokeWidth="1" 
              markerStart="url(#arrow)"
              markerEnd="url(#arrow)"
            />
            {/* Dimension Text block */}
            <rect 
              x={x0 + W_scaled/2 - 55} 
              y={y0 + 19} 
              width="110" 
              height="14" 
              rx="4" 
              className="fill-slate-50 dark:fill-slate-950 stroke-slate-200 dark:stroke-slate-800" 
              strokeWidth="1" 
            />
            <text 
              x={x0 + W_scaled/2} 
              y={y0 + 29} 
              className={`text-[8px] font-black text-center ${treadHasWarning ? 'fill-amber-500' : 'fill-slate-700 dark:fill-slate-200'}`}
              textAnchor="middle"
            >
              Total Run: {renderValue(totalRun)}
            </text>
          </g>

          {/* B. TOTAL RISE DIMENSION (RIGHT-HAND SIDE) */}
          <g className="text-slate-500 dark:text-slate-400">
            {/* Bottom horizontal projection */}
            <line x1={x0 + W_scaled + 4} y1={y0} x2={svgW - 55} y2={y0} stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,2" />
            {/* Top horizontal projection */}
            <line x1={x0 + W_scaled + 4} y1={y0 - H_scaled} x2={svgW - 55} y2={y0 - H_scaled} stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,2" />
            {/* Vertical dimension line with arrows */}
            <line 
              x1={svgW - 65} 
              y1={y0} 
              x2={svgW - 65} 
              y2={y0 - H_scaled} 
              stroke="currentColor" 
              markerStart="url(#arrow)"
              markerEnd="url(#arrow)"
              strokeWidth="1" 
            />
            {/* Text label next to line (no rotation for maximum readability) */}
            <rect 
              x={svgW - 60} 
              y={y0 - H_scaled/2 - 10} 
              width="54" 
              height="20" 
              rx="4" 
              className="fill-slate-50 dark:fill-slate-950 stroke-slate-200 dark:stroke-slate-800" 
              strokeWidth="1" 
            />
            <text 
              x={svgW - 33} 
              y={y0 - H_scaled/2 - 1} 
              className="text-[7px] font-black fill-slate-400 dark:fill-slate-500 uppercase tracking-wider text-center"
              textAnchor="middle"
            >
              Total Rise
            </text>
            <text 
              x={svgW - 33} 
              y={y0 - H_scaled/2 + 7} 
              className={`text-[8.5px] font-black text-center ${riserHasWarning ? 'fill-amber-500' : 'fill-slate-700 dark:fill-slate-200'}`}
              textAnchor="middle"
            >
              {renderValue(totalRise)}
            </text>
          </g>

          {/* C. DETAILED SINGLE STEP CALLOUT BRACKET (ON STEP 1) */}
          {stepsCoords[0] && (
            <g className="opacity-80">
              {/* Riser bracket on step 1 */}
              <path 
                d={`M ${x0 - 5} ${y0} L ${x0 - 12} ${y0} L ${x0 - 12} ${y0 - h_scaled} L ${x0 - 5} ${y0 - h_scaled}`} 
                fill="none" 
                stroke={riserHasWarning ? '#F59E0B' : '#3B82F6'} 
                strokeWidth="1" 
              />
              <text 
                x={x0 - 16} 
                y={y0 - h_scaled/2 + 3} 
                textAnchor="end" 
                className={`text-[7.5px] font-black ${riserHasWarning ? 'fill-amber-500' : 'fill-brand-500'}`}
              >
                R: {renderValue(riserHeight)}
              </text>

              {/* Tread bracket on step 1 */}
              <path 
                d={`M ${x0} ${y0 - h_scaled - 5} L ${x0} ${y0 - h_scaled - 12} L ${x0 + w_scaled} ${y0 - h_scaled - 12} L ${x0 + w_scaled} ${y0 - h_scaled - 5}`} 
                fill="none" 
                stroke={treadHasWarning ? '#F59E0B' : '#3B82F6'} 
                strokeWidth="1" 
              />
              <text 
                x={x0 + w_scaled/2} 
                y={y0 - h_scaled - 16} 
                textAnchor="middle" 
                className={`text-[7.5px] font-black ${treadHasWarning ? 'fill-amber-500' : 'fill-brand-500'}`}
              >
                T: {renderValue(treadDepth)}
              </text>
            </g>
          )}

          {/* HIGHLIGHTED HOVERED/LOCKED STEP COAT */}
          {activeStep && (
            <g>
              {/* Riser highlighting overlay */}
              <line
                x1={activeStep.riserStartX}
                y1={activeStep.riserStartY}
                x2={activeStep.noseX}
                y2={activeStep.noseY}
                className="stroke-emerald-500 dark:stroke-emerald-400"
                strokeWidth="4"
                strokeLinecap="round"
              />
              {/* Tread highlighting overlay */}
              <line
                x1={activeStep.noseX}
                y1={activeStep.noseY}
                x2={activeStep.treadEndX}
                y2={activeStep.treadEndY}
                className="stroke-emerald-500 dark:stroke-emerald-400"
                strokeWidth="4"
                strokeLinecap="round"
              />
              {/* Nose pip halo */}
              <circle
                cx={activeStep.noseX}
                cy={activeStep.noseY}
                r="5"
                fill="none"
                className="stroke-emerald-500 dark:stroke-emerald-400 animate-ping"
                strokeWidth="1.5"
              />
            </g>
          )}

          {/* INTERACTIVE HOVER/CLICK DETECTOR SEGMENTS (INVISIBLE THICK OVERLAYS) */}
          {stepsCoords.map((step, idx) => {
            const pathD = `M ${step.riserStartX} ${step.riserStartY} L ${step.noseX} ${step.noseY} L ${step.treadEndX} ${step.treadEndY}`
            return (
              <path
                key={`detector-${idx}`}
                d={pathD}
                fill="none"
                stroke="transparent"
                strokeWidth="14"
                className="cursor-pointer hover:stroke-emerald-500/15 focus:stroke-emerald-500/20 focus:outline-none"
                tabIndex={0}
                role="button"
                aria-label={`Step ${idx + 1} of ${risers}. Riser height is ${renderValue(step.physicalHeight)}, tread depth is ${step.physicalDepth > 0 ? renderValue(step.physicalDepth) : 'not applicable'}. Cumulative vertical rise is ${renderValue(step.cumulativeRise)}.`}
                onMouseEnter={() => setHoveredStep(idx)}
                onMouseLeave={() => setHoveredStep(null)}
                onFocus={() => setHoveredStep(idx)}
                onBlur={() => setHoveredStep(null)}
                onClick={() => setLockedStep(lockedStep === idx ? null : idx)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setLockedStep(lockedStep === idx ? null : idx);
                  }
                }}
              />
            )
          })}
        </svg>

        {/* COMPLIANCE STICKERS INSIDE SVG CANVAS COATED TOP RIGHT */}
        <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-2 rounded-lg border border-slate-200/50 dark:border-slate-850/80 shadow-sm max-w-[170px] space-y-1">
          <div className="text-[9px] font-black text-slate-400 uppercase tracking-wide">NBC Code Compliance</div>
          
          <div className="flex items-center gap-1">
            <span className={`w-1.5 h-1.5 rounded-full ${riserHasWarning ? 'bg-amber-500' : 'bg-emerald-500'}`} />
            <span className="text-[9px] font-bold text-slate-600 dark:text-slate-300">
              Riser Height: {riserHasWarning ? 'Out of Range' : 'Compliant'}
            </span>
          </div>
          
          <div className="flex items-center gap-1">
            <span className={`w-1.5 h-1.5 rounded-full ${treadHasWarning ? 'bg-amber-500' : 'bg-emerald-500'}`} />
            <span className="text-[9px] font-bold text-slate-600 dark:text-slate-300">
              Tread Run: {treadHasWarning ? 'Out of Range' : 'Compliant'}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <span className={`w-1.5 h-1.5 rounded-full ${comfortHasWarning ? 'bg-amber-500' : 'bg-emerald-500'}`} />
            <span className="text-[9px] font-bold text-slate-600 dark:text-slate-300">
              Comfort Formula: {comfortHasWarning ? 'Sub-Optimal' : 'Ideal'}
            </span>
          </div>
        </div>
      </div>

      {/* DETAILED INTERACTIVE STEP INSPECTION PANEL */}
      <div className="bg-slate-50 dark:bg-slate-950/40 p-4 rounded-xl border border-slate-250/50 dark:border-slate-800 space-y-3">
        {activeStep ? (
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b border-slate-200/50 dark:border-slate-800 pb-2">
              <div className="flex items-center gap-1.5">
                <span className="text-xs bg-emerald-500 text-white font-black px-2 py-0.5 rounded-lg">
                  Step {activeStep.index + 1}
                </span>
                <span className="text-[10px] text-slate-400 font-extrabold uppercase">
                  {lockedStep === activeStep.index ? 'Pinned' : 'Inspecting'}
                </span>
              </div>
              <button 
                onClick={() => setLockedStep(null)}
                className="text-[10px] font-black text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 uppercase"
              >
                Clear Selection
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="space-y-0.5 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-150 dark:border-slate-800">
                <span className="text-[9px] font-bold text-slate-400 uppercase block">Riser Segment</span>
                <span className="font-black text-slate-800 dark:text-white block">
                  {renderValue(activeStep.physicalHeight)}
                </span>
                <span className="text-[8px] font-extrabold text-emerald-500 block">Vertical rise</span>
              </div>

              <div className="space-y-0.5 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-150 dark:border-slate-800">
                <span className="text-[9px] font-bold text-slate-400 uppercase block">Tread Segment</span>
                <span className="font-black text-slate-800 dark:text-white block">
                  {activeStep.physicalDepth > 0 ? renderValue(activeStep.physicalDepth) : 'N/A (Top step)'}
                </span>
                <span className="text-[8px] font-extrabold text-emerald-500 block">Tread depth run</span>
              </div>

              <div className="space-y-0.5 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-150 dark:border-slate-800">
                <span className="text-[9px] font-bold text-slate-400 uppercase block">Cumulative Height</span>
                <span className="font-black text-slate-800 dark:text-white block">
                  {renderValue(activeStep.cumulativeRise)}
                </span>
                <span className="text-[8px] text-slate-400 block">Height from floor</span>
              </div>

              <div className="space-y-0.5 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-150 dark:border-slate-800">
                <span className="text-[9px] font-bold text-slate-400 uppercase block">Cumulative Run</span>
                <span className="font-black text-slate-800 dark:text-white block">
                  {renderValue(activeStep.cumulativeRun)}
                </span>
                <span className="text-[8px] text-slate-400 block">Distance from start</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 p-1 justify-center sm:justify-start">
            <Info size={14} className="text-brand-500 shrink-0" />
            <span className="font-semibold text-center sm:text-left">
              Hover your cursor or tap steps on the diagram above to inspect individual step measurements, cumulative heights, and horizontal boundaries.
            </span>
          </div>
        )}
      </div>

    </div>
  )
}
