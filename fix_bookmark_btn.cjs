const fs = require('fs');
const file = 'src/components/RedSeal/NbcFlashcards.jsx';
let content = fs.readFileSync(file, 'utf8');

const btnRegex = /                  {\/\* Bookmark Button \*\/}?\s*<button[\s\S]*?<\/button>/;
const newBtn = `                  {/* Bookmark Button */}
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
                  </button>`;

content = content.replace(btnRegex, newBtn);

const btnBackRegex = /                  {\/\* Action Link overlay \*\/}?\s*<button[\s\S]*?<\/button>\s*<\/div>\s*{\/\* Central Code Requirement Detail \*\/}/;
const newBtnBack = `                  {/* Bookmark Button (Back Face) */}
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
                </div>
                {/* Central Code Requirement Detail */}`;

content = content.replace(btnBackRegex, newBtnBack);

fs.writeFileSync(file, content);
