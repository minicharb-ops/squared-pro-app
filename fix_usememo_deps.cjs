const fs = require('fs');
const file = 'src/components/RedSeal/NbcFlashcards.jsx';
let content = fs.readFileSync(file, 'utf8');

const depsRegex = /  \}, \[allCards, selectedBlock, searchQuery, cramMode, flashcardReviews, now, isShuffled, shuffleSeed\]\)/;
const newDeps = `  }, [allCards, selectedBlock, searchQuery, cramMode, flashcardReviews, now, isShuffled, shuffleSeed, bookmarkedIds])`;
content = content.replace(depsRegex, newDeps);

fs.writeFileSync(file, content);
