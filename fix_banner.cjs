const fs = require('fs');
const file = 'src/components/RedSeal/NbcFlashcards.jsx';
let content = fs.readFileSync(file, 'utf8');

// Remove relatedQuestions calculation
const relatedQuestionsRegex = /  \/\/ Related questions count[\s\S]*?}, \[activeCard\]\)\n\n/g;
content = content.replace(relatedQuestionsRegex, '');

// Remove banner
const bannerRegex = /            {\/\* RELATED EXAM QUESTIONS ADVISORY \*\/}?\s*{relatedQuestions\.length > 0 && \([\s\S]*?<\/div>\s*\)}\n/g;
content = content.replace(bannerRegex, '');

fs.writeFileSync(file, content);
