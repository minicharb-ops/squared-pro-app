import React, { useContext } from 'react'
import { AppContext } from '../App'
import { BookOpen } from 'lucide-react'

// Map key terms found in study materials to high-value NBC Clause query triggers
export const SPECIALIZED_KEY_TERMS = [
  { pattern: /fire separation/i, term: 'fire separation', query: 'fire block' },
  { pattern: /fire blocking/i, term: 'fire blocking', query: 'fire block' },
  { pattern: /vapor barrier/i, term: 'vapor barrier', query: 'vapor barrier' },
  { pattern: /guard height/i, term: 'guard height', query: 'guard height' },
  { pattern: /attic ventilation/i, term: 'attic ventilation', query: 'attic vent' },
  { pattern: /rafter ties/i, term: 'rafter ties', query: 'rafter tie' },
  { pattern: /stair rise/i, term: 'stair rise', query: 'stair rise' },
  { pattern: /stair run/i, term: 'stair run', query: 'stair run' },
  { pattern: /deflection/i, term: 'deflection', query: 'notch' },
  { pattern: /egress/i, term: 'egress', query: 'egress' },
  { pattern: /baluster/i, term: 'baluster', query: 'baluster' },
  { pattern: /notching/i, term: 'notching', query: 'notch' },
  { pattern: /footing/i, term: 'footing', query: 'footing' },
  { pattern: /joists/i, term: 'joist', query: 'notch' },
  { pattern: /joist/i, term: 'joist', query: 'notch' },
  { pattern: /rafter/i, term: 'rafter', query: 'rafter' }
]

/**
 * React Component that parses raw text, finds high-value building code keywords,
 * highlights them with distinctive jobsite styling, and links them directly
 * to corresponding NBC code clauses in the Code Search overlay.
 */
export function HighlightedText({ text }) {
  const context = useContext(AppContext)
  
  if (!text) return null
  if (!context || !context.openCodeSearchWithQuery) {
    return <span>{text}</span>
  }

  const { openCodeSearchWithQuery } = context

  // Gather matching patterns
  const termPatterns = SPECIALIZED_KEY_TERMS.map(t => t.term)
  
  // Sort patterns by length in descending order to avoid greedy partial matching (e.g. 'fire separation' before 'fire')
  termPatterns.sort((a, b) => b.length - a.length)

  // Escape special chars and build dynamic regex with boundary constraints
  const escapedTerms = termPatterns.map(term => term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'))
  const regex = new RegExp(`\\b(${escapedTerms.join('|')})s?\\b`, 'gi')

  const parts = text.split(regex)
  if (parts.length <= 1) {
    return <span>{text}</span>
  }

  // Find matches and map them to JSX elements
  return (
    <span>
      {parts.map((part, index) => {
        const lowerPart = part?.toLowerCase()
        const match = SPECIALIZED_KEY_TERMS.find(t => 
          lowerPart === t.term || 
          lowerPart === `${t.term}s` || 
          (t.term === 'joist' && lowerPart === 'joists') ||
          (t.term === 'footing' && lowerPart === 'footings')
        )

        if (match) {
          return (
            <span
              key={index}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                openCodeSearchWithQuery(match.query)
              }}
              className="inline-flex items-center gap-0.5 px-1 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 font-extrabold cursor-pointer rounded border-b border-dashed border-indigo-500 dark:border-indigo-400 transition-all group select-text"
              title={`Click to view corresponding National Building Code (NBC) clause for "${part}"`}
            >
              {part}
              <BookOpen size={10} className="inline opacity-60 group-hover:opacity-100 transition-opacity shrink-0 text-indigo-500 dark:text-indigo-400" />
            </span>
          )
        }

        return <span key={index}>{part}</span>
      })}
    </span>
  )
}
