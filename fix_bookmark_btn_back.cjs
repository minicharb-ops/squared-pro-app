const fs = require('fs');
const file = 'src/components/RedSeal/NbcFlashcards.jsx';
let content = fs.readFileSync(file, 'utf8');

const btnBackRegex = /                  {\/\* Bookmark Button \(Back Face\) \*\/}?\s*<button[\s\S]*?<\/button>\s*<\/div>\s*{\/\* Central Code Requirement Detail \*\/}/;
const newBtnBack = `                  <div className="flex items-center gap-1">
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
                      className={\`p-1.5 rounded-full hover:bg-amber-500/10 dark:hover:bg-slate-800 transition-colors \${bookmarkedIds.includes(activeCard.id) ? 'text-amber-500' : 'text-slate-300 dark:text-slate-600'}\`}
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
                {/* Central Code Requirement Detail */}`;

content = content.replace(btnBackRegex, newBtnBack);

fs.writeFileSync(file, content);
