import React, { useState, useMemo, useEffect, useContext, useRef } from 'react'
import { 
  AppContext 
} from '../../App'
import { 
  Layers, 
  Check, 
  HelpCircle, 
  Bookmark, 
  RotateCcw, 
  Award, 
  Flame, 
  ChevronRight, 
  ChevronLeft, 
  Search, 
  Sparkles, 
  BookOpen, 
  X, 
  Filter, 
  Undo2, 
  Info,
  Shuffle,
  ExternalLink,
  Plus
} from 'lucide-react'

// Import all study guides
import blockAGuide from '../../data/RedSeal/block_a_study_guide.json'
import blockBGuide from '../../data/RedSeal/block_b_study_guide.json'
import blockCGuide from '../../data/RedSeal/block_c_study_guide.json'
import blockDGuide from '../../data/RedSeal/block_d_study_guide.json'
import blockEGuide from '../../data/RedSeal/block_e_study_guide.json'
import blockFGuide from '../../data/RedSeal/block_f_study_guide.json'
import blockGGuide from '../../data/RedSeal/block_g_study_guide.json'
import questionsData from '../../data/RedSeal/questions.json'

import { getAllCards } from '../../utils/srsStats'

export default function NbcFlashcards() {
  const context = useContext(AppContext) || {}
  const { 
    flashcardReviews: rawFlashcardReviews, 
    setFlashcardReviews = () => {}, 
    setUserXP = () => {}, 
    toggleBookmark = () => {}, 
    bookmarks: rawBookmarks,
    openCodeSearchWithQuery = () => {}
  } = context

  const flashcardReviews = rawFlashcardReviews || {}
  const bookmarks = Array.isArray(rawBookmarks) ? rawBookmarks : []

  const [searchQuery, setSearchQuery] = useState('')
  const [showFlashcardControlsInfo, setShowFlashcardControlsInfo] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState('All')
    const [isFlipped, setIsFlipped] = useState(false)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isShuffled, setIsShuffled] = useState(true)
  const [shuffleSeed, setShuffleSeed] = useState(() => Date.now())
  
  // Drag / Swipe State
  const cardRef = useRef(null)

  // Message logs / feedback
  const [toastMsg, setToastMsg] = useState(null)
  
  // Bookmarks State
  const [bookmarkedIds, setBookmarkedIds] = useState(() => {
    try {
      const saved = localStorage.getItem('nbc-flashcards-bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('nbc-flashcards-bookmarks', JSON.stringify(bookmarkedIds));
  }, [bookmarkedIds]);
  
  // Compile all flashcards from Block Guides
  const allCards = useMemo(() => getAllCards(), [])

  
  // Calculate stats based on all cards
  

  // Filter cards by block and search query
  const filteredCards = useMemo(() => {
    const reviews = flashcardReviews || {}
    let filtered = (allCards || []).filter(card => {
      if (!card) return false
      // Block match
      if (selectedBlock === 'Bookmarked Cards') {
        if (!bookmarkedIds.includes(card.id)) return false;
      } else if (selectedBlock !== 'All' && card.blockId !== selectedBlock) {
        return false;
      }

      // Search match
      if (searchQuery && searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim()
        const textToSearch = `${card.blockId || ''} ${card.section || ''} ${card.sectionTitle || ''} ${card.topic || ''} ${card.rule || ''}`.toLowerCase()
        if (!textToSearch.includes(query)) return false
      }



      return true
    })

    if (isShuffled) {
      const getHash = (str) => {
        let h = 0xdeadbeef;
        for(let i = 0; i < str.length; i++) {
          h = Math.imul(h ^ str.charCodeAt(i), 2654435761);
        }
        h = Math.imul(h ^ (h >>> 16), 2246822507);
        h ^= h >>> 13;
        return h;
      }
      filtered = filtered.sort((a, b) => {
        const hashA = getHash((a.id || '') + shuffleSeed)
        const hashB = getHash((b.id || '') + shuffleSeed)
        return hashA - hashB
      })
    }

    return filtered
  }, [allCards, selectedBlock, searchQuery, isShuffled, shuffleSeed, bookmarkedIds])

  const activeCard = filteredCards[currentCardIndex] || null

  // Ensure current card index is safe if list shrinks
  useEffect(() => {
    if (currentCardIndex >= filteredCards.length && filteredCards.length > 0) {
      setCurrentCardIndex(filteredCards.length - 1)
    }
    setIsFlipped(false)
  }, [filteredCards.length, currentCardIndex])

  // Show helpful visual feedback
  const triggerToast = (msg) => {
    setToastMsg(msg)
    const timer = setTimeout(() => setToastMsg(null), 1500)
    return () => clearTimeout(timer)
  }

    // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return

      if (e.code === 'Space') {
        e.preventDefault()
        setIsFlipped(prev => !prev)
      } else if (e.key === 'ArrowRight') {
        setIsFlipped(false)
        setCurrentCardIndex(prev => (prev < filteredCards.length - 1 ? prev + 1 : 0))
      } else if (e.key === 'ArrowLeft') {
        setIsFlipped(false)
        setCurrentCardIndex(prev => (prev > 0 ? prev - 1 : filteredCards.length - 1))
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeCard, filteredCards.length, currentCardIndex])

  
  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10 text-slate-900 dark:text-white">
      {/* FLOATING TOAST SYSTEM */}
      {toastMsg && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-900/90 text-amber-600 dark:text-amber-300 px-4 py-2 rounded-xl text-xs font-bold border border-amber-500/30 dark:border-amber-500/20 shadow-xl z-50 animate-bounce flex items-center gap-1.5">
          <Flame size={14} className="text-amber-500 animate-pulse fill-current" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* MAIN CAROUSEL VIEW */}
      {activeCard ? (
        <div className="space-y-6">
          <div className="text-center text-xs text-slate-400 dark:text-slate-500 font-bold">
            Showing Card {currentCardIndex + 1} of {filteredCards.length} matching rules
          </div>

          {/* SWIPE CONTAINER */}
          <div className="relative w-full max-w-lg mx-auto flex justify-center items-center h-[340px] group perspective-1000 [perspective:1000px]">
            
            {/* BACKGROUND CARDS ACCENTS FOR DEPTH */}
            {filteredCards.length > 1 && (
              <div className="absolute w-[95%] h-[95%] bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-2xl transform translate-y-3 scale-95 opacity-40 -z-10 transition-colors duration-300" />
            )}
            {filteredCards.length > 2 && (
              <div className="absolute w-[90%] h-[90%] bg-slate-300 dark:bg-slate-700/60 border border-slate-400 dark:border-slate-700/40 rounded-2xl transform translate-y-6 scale-90 opacity-20 -z-20 transition-colors duration-300" />
            )}

            {/* INTERACTIVE CARD */}
            <div
              ref={cardRef}
              className={`w-full h-full relative select-none [transform-style:preserve-3d] transition-transform duration-500 ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}
            >

              {/* CARD FRONT FACE */}
              <div className="absolute inset-0 w-full h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-3xl p-6 shadow-xl flex flex-col justify-between [backface-visibility:hidden] transition-colors duration-300">
                {/* Top metadata header */}
                <div className="flex justify-between items-start border-b border-amber-200/50 dark:border-slate-800/80 pb-3">
                  <div className="space-y-0.5 text-left">
                    <span className="text-[10px] font-black text-amber-800 dark:text-amber-400 bg-amber-500/10 dark:bg-amber-400/10 px-2 py-0.5 rounded-md uppercase tracking-wider">
                      {activeCard.blockId}
                    </span>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-wider mt-1">{activeCard.blockTitle}</p>
                  </div>
                  
                  {/* Bookmark Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const isBookmarked = bookmarkedIds.includes(activeCard.id);
                      if (isBookmarked) {
                        setBookmarkedIds(prev => prev.filter(id => id !== activeCard.id));
                        triggerToast('Bookmark Removed!');
                      } else {
                        setBookmarkedIds(prev => [...prev, activeCard.id]);
                        triggerToast('🔥 Card Bookmarked!');
                      }
                    }}
                    className={`p-1.5 rounded-full hover:bg-amber-500/10 dark:hover:bg-slate-800 transition-colors ${bookmarkedIds.includes(activeCard.id) ? 'text-amber-500' : 'text-slate-300 dark:text-slate-600'}`}
                  >
                    <Bookmark size={18} className={bookmarkedIds.includes(activeCard.id) ? 'fill-current' : ''} />
                  </button>
                </div>

                {/* Central Question Prompt */}
                <div className="flex-1 flex flex-col justify-center items-center text-center px-4">
                  <span className="text-[10px] font-black tracking-widest text-brand-600 dark:text-brand-400 uppercase mb-2">Identify the Code Specification</span>
                  <h3 className="text-base md:text-lg font-black text-slate-800 dark:text-slate-100 leading-snug">
                    Under <span className="text-amber-700 dark:text-amber-400 font-extrabold">{activeCard.section}</span> ({activeCard.sectionTitle}), what is the requirement for:
                  </h3>
                  <p className="text-sm md:text-base font-bold text-brand-500 dark:text-brand-300 mt-3 leading-relaxed">
                    "{activeCard.front}"
                  </p>
                </div>

                {/* Card footer instruction */}
                <div className="pt-3 border-t border-brand-500/20 dark:border-slate-800/80 flex items-center justify-between text-[10px] font-bold">
                  <div className="flex gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation()
                        setIsFlipped(false)
                        setCurrentCardIndex(prev => (prev > 0 ? prev - 1 : filteredCards.length - 1))
                      }}
                      className="px-3 py-1.5 border border-slate-300 dark:border-slate-600 bg-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-[10px] uppercase font-black tracking-wider transition-all cursor-pointer flex items-center gap-1 shadow-sm"
                    >
                      <ChevronLeft size={12} strokeWidth={2.5} />
                      <span className="hidden sm:inline">Prev</span>
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation()
                        setIsFlipped(false)
                        setCurrentCardIndex(prev => (prev < filteredCards.length - 1 ? prev + 1 : 0))
                      }}
                      className="px-3 py-1.5 border border-slate-300 dark:border-slate-600 bg-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-[10px] uppercase font-black tracking-wider transition-all cursor-pointer flex items-center gap-1 shadow-sm"
                    >
                      <span className="hidden sm:inline">Next</span>
                      <ChevronRight size={12} strokeWidth={2.5} />
                    </button>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setIsFlipped(true); }}
                    className="px-3 py-1.5 border border-slate-300 dark:border-slate-600 bg-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-[10px] uppercase font-black tracking-wider transition-all cursor-pointer flex items-center gap-1 shadow-sm"
                  >
                    <RotateCcw size={12} />
                    <span>Flip Card</span>
                  </button>
                </div>
              </div>

              {/* CARD BACK FACE */}
              <div className="absolute inset-0 w-full h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-3xl p-6 shadow-xl flex flex-col justify-between [backface-visibility:hidden] [transform:rotateY(180deg)] text-left transition-colors duration-300">
                {/* Top Back Metadata */}
                <div className="flex justify-between items-start border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-black text-sky-600 dark:text-sky-400 bg-sky-500/10 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-900/50 px-2 py-0.5 rounded-md uppercase tracking-wider">
                      NBC Specification Answer
                    </span>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-extrabold uppercase tracking-wider mt-1">{activeCard.section} Code Clause</p>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {/* Bookmark Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const isBookmarked = bookmarkedIds.includes(activeCard.id);
                        if (isBookmarked) {
                          setBookmarkedIds(prev => prev.filter(id => id !== activeCard.id));
                          triggerToast('Bookmark Removed!');
                        } else {
                          setBookmarkedIds(prev => [...prev, activeCard.id]);
                          triggerToast('🔥 Card Bookmarked!');
                        }
                      }}
                      className={`p-1.5 rounded-full hover:bg-amber-500/10 dark:hover:bg-slate-800 transition-colors ${bookmarkedIds.includes(activeCard.id) ? 'text-amber-500' : 'text-slate-300 dark:text-slate-600'}`}
                    >
                      <Bookmark size={18} className={bookmarkedIds.includes(activeCard.id) ? 'fill-current' : ''} />
                    </button>
                    {/* Action Link overlay */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openCodeSearchWithQuery(activeCard.section);
                      }}
                      className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-sky-600 dark:text-sky-400 hover:bg-slate-200 dark:hover:bg-slate-750 transition-colors"
                      title="Inspect related NBC Part 9 provisions"
                    >
                      <ExternalLink size={14} />
                    </button>
                  </div>
                </div>
                {/* Central Code Requirement Detail */}
                <div className="flex-1 flex flex-col justify-center px-2 py-3 overflow-y-auto max-h-[160px]">
                  <p className="text-[9px] uppercase font-black tracking-widest text-slate-400 dark:text-slate-500 mb-1.5">Official Clause Requirement</p>
                  <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 font-semibold leading-relaxed">
                    {activeCard.back}
                  </p>
                </div>

                {/* Back card footer */}
                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[10px] font-bold">
                  <div className="flex gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation()
                        setIsFlipped(false)
                        setCurrentCardIndex(prev => (prev > 0 ? prev - 1 : filteredCards.length - 1))
                      }}
                      className="px-3 py-1.5 border border-slate-300 dark:border-slate-600 bg-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-[10px] uppercase font-black tracking-wider transition-all cursor-pointer flex items-center gap-1 shadow-sm"
                    >
                      <ChevronLeft size={12} strokeWidth={2.5} />
                      <span className="hidden sm:inline">Prev</span>
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation()
                        setIsFlipped(false)
                        setCurrentCardIndex(prev => (prev < filteredCards.length - 1 ? prev + 1 : 0))
                      }}
                      className="px-3 py-1.5 border border-slate-300 dark:border-slate-600 bg-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-[10px] uppercase font-black tracking-wider transition-all cursor-pointer flex items-center gap-1 shadow-sm"
                    >
                      <span className="hidden sm:inline">Next</span>
                      <ChevronRight size={12} strokeWidth={2.5} />
                    </button>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setIsFlipped(false); }}
                    className="px-3 py-1.5 border border-slate-300 dark:border-slate-600 bg-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-[10px] uppercase font-black tracking-wider transition-all cursor-pointer flex items-center gap-1 shadow-sm"
                  >
                    <Undo2 size={12} />
                    <span>Back to front</span>
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* KEYBOARD SHORTCUT HELPER GUIDE */}
            <div className="hidden sm:flex flex-wrap justify-center gap-x-4 gap-y-2 pt-4 text-[10px] text-slate-400 dark:text-slate-500 font-bold border-t border-slate-100 dark:border-slate-800/80">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded shadow-sm text-[9px] font-mono">Space</kbd> Flip Card
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded shadow-sm text-[9px] font-mono">← / →</kbd> Prev / Next
              </span>
            </div>
        </div>
      ) : (
        /* NO CARDS TO SHOW VIEW */
        <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-3xl p-10 text-center space-y-6 max-w-lg mx-auto shadow-sm">
          <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto text-4xl animate-bounce">
            🪵
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight">No Cards Found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
              No flashcards match your selected filters. Try choosing a different Block or clearing the search bar.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => { setSelectedBlock('All'); setSearchQuery(''); }}
              className="px-6 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 min-h-[44px]"
            >
              <RotateCcw size={14} />
              <span>Reset Filters</span>
            </button>
          </div>
        </div>
      )}




      {/* FILTER & STUDY CONTROL CONTROLLERS */}
      <div className="bg-slate-100 dark:bg-slate-800 backdrop-blur-sm border border-slate-200 dark:border-slate-700 shadow-sm rounded-lg p-3 text-slate-800 dark:text-white">
        {/* Block Selection */}
        <div className="flex flex-row justify-between items-center w-full">
          <div className="flex items-center gap-1.5 text-xs font-bold w-full">
            <Filter size={16} className="shrink-0" />
            <div className="relative flex items-center gap-2">
              <span className="shrink-0">Block:</span>
              <button onClick={() => setShowFlashcardControlsInfo(!showFlashcardControlsInfo)} className="text-slate-400 hover:text-slate-200 cursor-pointer">ⓘ</button>
              {showFlashcardControlsInfo && (
                <div className="absolute bottom-full left-0 mb-2 w-72 bg-slate-800 border border-slate-600 rounded-md p-3 text-sm text-slate-200 z-[60] shadow-xl font-normal">
                  <strong className="block text-cyan-400 mb-1">Flashcard Controls</strong>
                  <p>Filter the deck by specific Red Seal Exam blocks to target your weak points. Use the shuffle button on the right to randomize card order and prevent pattern memorization.</p>
                </div>
              )}
            </div>
            <select 
              value={selectedBlock} 
              onChange={(e) => { setSelectedBlock(e.target.value); setCurrentCardIndex(0); }}
              className="bg-transparent font-black focus:outline-none cursor-pointer w-full text-slate-800 dark:text-white"
            >
              <option value="All" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">All Blocks</option>
              <option value="Bookmarked Cards" className="bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 font-black">Bookmarked Cards 🔖</option>
              <option value="Block A" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">Block A (Safety & Occupational)</option>
              <option value="Block B" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">Block B (Planning & Layout)</option>
              <option value="Block C" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">Block C (Substructure)</option>
              <option value="Block D" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">Block D (Framing)</option>
              <option value="Block E" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">Block E (Exterior Finish)</option>
              <option value="Block F" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">Block F (Interior Finish)</option>
              <option value="Block G" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">Block G (Stairs & Decks)</option>
            </select>
          </div>
          <button
            onClick={() => {
              if (!isShuffled) {
                setShuffleSeed(Date.now());
              }
              setIsShuffled(!isShuffled);
              setCurrentCardIndex(0);
            }}
            className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-none text-[10px] font-black uppercase tracking-wider transition-all duration-200 ${
              isShuffled 
                ? 'bg-cyan-500 text-white'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
            }`}
          >
            <Shuffle size={14} />
            <span className="hidden sm:inline">Shuffle</span>
          </button>
        </div>
      </div>

        


    </div>
  )
}
