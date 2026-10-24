const fs = require('fs');
const file = 'src/components/RedSeal/NbcFlashcards.jsx';
let content = fs.readFileSync(file, 'utf8');

const stateTarget = `  const [searchQuery, setSearchQuery] = useState('')`;
const stateReplacement = `  const [searchQuery, setSearchQuery] = useState('')
  const [showFlashcardControlsInfo, setShowFlashcardControlsInfo] = useState(false);`;

if (content.includes(stateTarget) && !content.includes('showFlashcardControlsInfo')) {
  content = content.replace(stateTarget, stateReplacement);
}

const blockTarget = `            <Filter size={16} className="shrink-0" />
            <span className="shrink-0">Block:</span>
            <select `;

const blockReplacement = `            <Filter size={16} className="shrink-0" />
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
            <select `;

if (content.includes(blockTarget)) {
  content = content.replace(blockTarget, blockReplacement);
  console.log("Block replaced successfully");
} else {
  console.log("Block not found");
}

fs.writeFileSync(file, content);
