import React, { useState, useMemo, useEffect } from 'react'
import { Search, Book, FileText, BookmarkCheck, ArrowUpRight } from 'lucide-react'
import glossaryData from '../../data/RedSeal/glossary.json'

export default function Glossary() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLetter, setSelectedLetter] = useState('ALL')

  // Sort terms alphabetically
  const sortedGlossary = useMemo(() => {
    return [...glossaryData].sort((a, b) => a.term.localeCompare(b.term))
  }, [])

  // List of active first letters for navigation
  const alphabet = useMemo(() => {
    const letters = sortedGlossary.map(item => item.term.charAt(0).toUpperCase())
    return ['ALL', ...new Set(letters)].sort()
  }, [sortedGlossary])

  // Filter based on search term and letter selection
  const filteredTerms = useMemo(() => {
    return sortedGlossary.filter(item => {
      const matchesSearch = 
        item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.definition.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesLetter = 
        selectedLetter === 'ALL' || 
        item.term.charAt(0).toUpperCase() === selectedLetter

      return matchesSearch && matchesLetter
    })
  }, [sortedGlossary, searchTerm, selectedLetter])

  return (
    <div className="space-y-6">
      {/* GLOSSARY HERO HEADER */}
      <div className="bg-gradient-to-r from-brand-600 to-brand-700 text-white rounded-2xl p-6 md:p-8 shadow-md">
        <div className="flex items-center space-x-3 mb-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <Book size={28} className="text-white" />
          </div>
          <span className="text-xs uppercase font-extrabold tracking-widest text-brand-100 bg-brand-800/40 px-2.5 py-1 rounded-full">
            National Code Terminology
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight">Red Seal & NBC Glossary</h2>
        <p className="text-sm md:text-base text-brand-100 max-w-2xl mt-2 leading-relaxed">
          Official definitions, carpentry terms, and National Building Code standards required for Canadian certification.
        </p>
      </div>

      {/* FILTER CONTROLS */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={20} className="text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search glossary by term or definition..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 min-h-[48px] text-slate-900 dark:text-white"
          />
        </div>

        {/* Alphabetical Picker */}
        <div className="flex flex-wrap gap-1.5 pt-2">
          {alphabet.map((letter) => (
            <button
              key={letter}
              onClick={() => setSelectedLetter(letter)}
              className={`px-3 py-2 rounded-lg text-xs font-black uppercase transition-all min-h-[44px] min-w-[44px] flex items-center justify-center ${
                selectedLetter === letter
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-750'
              }`}
            >
              {letter}
            </button>
          ))}
        </div>
      </div>

      {/* GLOSSARY LIST */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Showing {filteredTerms.length} of {sortedGlossary.length} Terms
          </p>
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')} 
              className="text-xs font-semibold text-brand-500 hover:underline"
            >
              Clear Search
            </button>
          )}
        </div>

        {filteredTerms.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800">
            <span className="text-4xl">📚</span>
            <h3 className="text-lg font-black mt-4">No glossary terms matched your filters</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-sm mx-auto text-sm">
              Try adjusting your search query, choosing 'ALL' from the alphabet picker, or clearing the search.
            </p>
          </div>
        ) : (
          <div className="columns-1 md:columns-2 gap-4 space-y-4 [column-fill:_balance]">
            {filteredTerms.map((item, index) => (
              <div 
                key={index}
                className="group bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 hover:border-brand-500 dark:hover:border-brand-500 transition-all hover:shadow-md flex flex-col justify-between break-inside-avoid"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-extrabold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 text-lg tracking-tight transition-colors">
                      {item.term}
                    </h3>
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md font-extrabold text-slate-500 uppercase tracking-widest">
                      {item.category || "Red Seal / NBC"}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.definition}
                  </p>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-850 mt-4 pt-3 flex items-center justify-between text-xs font-bold text-slate-400 dark:text-slate-500">
                  <span className="flex items-center gap-1">
                    <BookmarkCheck size={14} className="text-brand-500" />
                    Verified Official Term
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-brand-500 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    Exam Core <ArrowUpRight size={12} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
