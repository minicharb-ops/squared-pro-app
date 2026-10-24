const fs = require('fs');
const file = 'src/components/RedSeal/NbcFlashcards.jsx';
let content = fs.readFileSync(file, 'utf8');

const stateRegex = /  const \[toastMsg, setToastMsg\] = useState\(null\)\n/g;
const newState = `  const [toastMsg, setToastMsg] = useState(null)
  
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
`;
content = content.replace(stateRegex, newState);
fs.writeFileSync(file, content);
