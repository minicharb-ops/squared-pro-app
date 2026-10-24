const fs = require('fs');
const file = 'src/components/RedSeal/NbcFlashcards.jsx';
let content = fs.readFileSync(file, 'utf8');

// Update dropdown
const dropdownRegex = /              <option value="All" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">All Blocks<\/option>/;
const newDropdown = `              <option value="All" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">All Blocks</option>
              <option value="Bookmarked Cards" className="bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 font-black">Bookmarked Cards 🔖</option>`;
content = content.replace(dropdownRegex, newDropdown);

// Update filtering logic
const filterRegex = /      \/\/ Block match\n      if \(selectedBlock !== 'All' && card\.blockId !== selectedBlock\) return false/;
const newFilter = `      // Block match
      if (selectedBlock === 'Bookmarked Cards') {
        if (!bookmarkedIds.includes(card.id)) return false;
      } else if (selectedBlock !== 'All' && card.blockId !== selectedBlock) {
        return false;
      }`;
content = content.replace(filterRegex, newFilter);

fs.writeFileSync(file, content);
