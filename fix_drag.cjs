const fs = require('fs');
const file = 'src/components/RedSeal/NbcFlashcards.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Remove states
content = content.replace(/  const \[offsetX, setOffsetX\] = useState\(0\)\n/g, '');
content = content.replace(/  const \[offsetY, setOffsetY\] = useState\(0\)\n/g, '');
content = content.replace(/  const \[isDragging, setIsDragging\] = useState\(false\)\n/g, '');
content = content.replace(/  const dragStart = useRef\(\{ x: 0, y: 0 \}\)\n/g, '');

// 2. Remove handleStart, handleMove, handleEnd completely
const handlersRegex = /  \/\/ Drag Gesture Handlers[\s\S]*?setOffsetY\(0\)\n  \}/;
content = content.replace(handlersRegex, '');

// 3. Update the INTERACTIVE SWIPER CARD
const oldCardWrapperRegex = /            {\/\* INTERACTIVE SWIPER CARD \*\/}[\s\S]*?            >/;
const newCardWrapper = "            {/* INTERACTIVE CARD */}\n            <div\n              ref={cardRef}\n              className={`w-full h-full relative select-none [transform-style:preserve-3d] transition-transform duration-500 ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}\n            >";
content = content.replace(oldCardWrapperRegex, newCardWrapper);

// 4. Remove SWIPE OVERLAY BADGES
const badgesRegex = /              {\/\* SWIPE OVERLAY BADGES \*\/}?\s*{offsetX > 40 && \([\s\S]*?AGAIN \(Swipe Left\)[\s\S]*?<\/div>\s*\)}\n/g;
content = content.replace(badgesRegex, '');

fs.writeFileSync(file, content);
