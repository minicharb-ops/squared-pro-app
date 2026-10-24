import re

with open("src/components/RedSeal/NbcFlashcards.jsx", "r") as f:
    content = f.read()

# 1. Remove SRS related states and functions
content = re.sub(r"const \[cramMode, setCramMode\] = useState\(false\).*\n", "", content)
content = re.sub(r"// SRS Schedule calculation & Filter out non-due cards if not in Cram mode\n\s*const \[now\] = useState\(\(\) => Date\.now\(\)\)\n", "", content)

# 2. Modify filteredCards logic to remove cramMode and now
# In the dependency array:
content = content.replace("selectedBlock, searchQuery, cramMode, flashcardReviews, now, isShuffled, shuffleSeed, bookmarkedIds", "selectedBlock, searchQuery, isShuffled, shuffleSeed, bookmarkedIds")

# Inside the filter, remove SRS Mode filter
srs_filter_block = """      // SRS Mode filter: Only show due cards
      if (!cramMode) {
        const review = card.id ? reviews[card.id] : null
        if (review && review.nextReviewDate > now) {
          return false // not due yet
        }
      }"""
content = content.replace(srs_filter_block, "")

# 3. Remove handleSrsReview completely
handle_srs_review_pattern = re.compile(r"// Handle Spaced Repetition logic.*?// Smoothly animate transition to the next card.*?}, 200\)\n\s*\}\n\n\n\n", re.DOTALL)
content = handle_srs_review_pattern.sub("", content)

# 4. Update Keyboard shortcuts
kb_shortcuts_old = """      } else if (e.key === '1') {
        handleSrsReview(activeCard?.id, 'again')
      } else if (e.key === '2') {
        handleSrsReview(activeCard?.id, 'hard')
      } else if (e.key === '3') {
        handleSrsReview(activeCard?.id, 'good')
      } else if (e.key === '4') {
        handleSrsReview(activeCard?.id, 'easy')
      } else if (e.key === 'ArrowRight') {
        // Go to next card in Cram Mode, or swipe Good
        if (cramMode) {
          setIsFlipped(false)
          setCurrentCardIndex(prev => (prev < filteredCards.length - 1 ? prev + 1 : 0))
        } else {
          handleSrsReview(activeCard?.id, 'good')
        }
      } else if (e.key === 'ArrowLeft') {
        // Go to prev card in Cram Mode, or swipe Again
        if (cramMode) {
          setIsFlipped(false)
          setCurrentCardIndex(prev => (prev > 0 ? prev - 1 : filteredCards.length - 1))
        } else {
          handleSrsReview(activeCard?.id, 'again')
        }
      }"""
kb_shortcuts_new = """      } else if (e.key === 'ArrowRight') {
        setIsFlipped(false)
        setCurrentCardIndex(prev => (prev < filteredCards.length - 1 ? prev + 1 : 0))
      } else if (e.key === 'ArrowLeft') {
        setIsFlipped(false)
        setCurrentCardIndex(prev => (prev > 0 ? prev - 1 : filteredCards.length - 1))
      }"""
content = content.replace(kb_shortcuts_old, kb_shortcuts_new)

# Update shortcut hint display
kb_hints_old = """              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded shadow-sm text-[9px] font-mono">1 - 4</kbd> Grade Card
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded shadow-sm text-[9px] font-mono">← / →</kbd> Prev / Next (Cram)
              </span>"""
kb_hints_new = """              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded shadow-sm text-[9px] font-mono">← / →</kbd> Prev / Next
              </span>"""
content = content.replace(kb_hints_old, kb_hints_new)

# Remove cramMode from dependency array
content = content.replace("[activeCard, filteredCards.length, cramMode, currentCardIndex]", "[activeCard, filteredCards.length, currentCardIndex]")

# 5. Remove resetSrsProgress
reset_srs_pattern = re.compile(r"// Reset Spaced Repetition progress.*?triggerToast\(\"Spaced repetition history wiped!\"\)\n\s*\}\n\s*\}\n", re.DOTALL)
content = reset_srs_pattern.sub("", content)

# 6. Update the Front Card Footer (Ensure it has Previous and Next if it didn't)
front_footer_old = """                {/* Card footer instruction */}
                <div className="text-center pt-3 border-t border-brand-500/20 dark:border-slate-800/80 flex items-center justify-between text-[10px] font-bold">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsFlipped(false)
                      setCurrentCardIndex(prev => (prev < filteredCards.length - 1 ? prev + 1 : 0))
                    }}
                    className="px-3 py-1.5 border border-slate-300 dark:border-slate-600 bg-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-[10px] uppercase font-black tracking-wider transition-all cursor-pointer flex items-center gap-1 shadow-sm"
                  >
                    <span>Next Card</span>
                    <ChevronRight size={12} strokeWidth={2.5} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setIsFlipped(true); }}
                    className="px-3 py-1.5 border border-slate-300 dark:border-slate-600 bg-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-[10px] uppercase font-black tracking-wider transition-all cursor-pointer flex items-center gap-1 shadow-sm"
                  >
                    <RotateCcw size={12} />
                    <span>Flip Card</span>
                  </button>
                </div>"""

front_footer_new = """                {/* Card footer instruction */}
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
                </div>"""
content = content.replace(front_footer_old, front_footer_new)


# 7. Update the Back Card Footer
back_footer_old = """                {/* Back card footer */}
                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-500 font-bold">
                  <span>How did you perform? Rate below:</span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setIsFlipped(false); }}
                    className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-[9px] hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-750 dark:text-slate-300"
                  >
                    Back to front
                  </button>
                </div>"""
back_footer_new = """                {/* Back card footer */}
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
                </div>"""
content = content.replace(back_footer_old, back_footer_new)


# 8. Remove grading UI container
grading_ui_pattern = re.compile(r"\{/\*\s*SYSTEM SRS GRADING ACTIONS\s*\*/\}.*?\{/\*\s*KEYBOARD SHORTCUT HELPER GUIDE\s*\*/\}", re.DOTALL)
content = grading_ui_pattern.sub("{/* KEYBOARD SHORTCUT HELPER GUIDE */}", content)


# 9. Clean up "NO CARDS TO SHOW VIEW"
no_cards_old = """          <div className="space-y-2">
            <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight">Crate Swept & Caught Up!</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
              {!cramMode 
                ? "You've successfully cleared your active spaced repetition queue! Great job staying on top of your daily reviews." 
                : "No flashcards match your selected filters. Try choosing a different Block or clearing the search bar."}
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            {!cramMode ? (
              <button
                onClick={() => setCramMode(true)}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 min-h-[44px]"
              >
                <Plus size={14} className="stroke-[3]" />
                <span>Browse/Cram All Flashcards</span>
              </button>
            ) : (
              <button
                onClick={() => { setSelectedBlock('All'); setSearchQuery(''); }}
                className="px-6 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 min-h-[44px]"
              >
                <RotateCcw size={14} />
                <span>Reset Filters</span>
              </button>
            )}
          </div>"""
no_cards_new = """          <div className="space-y-2">
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
          </div>"""
content = content.replace(no_cards_old, no_cards_new)


with open("src/components/RedSeal/NbcFlashcards.jsx", "w") as f:
    f.write(content)
