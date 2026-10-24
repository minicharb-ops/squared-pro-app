const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Insert states
code = code.replace(
  "const [openingType, setOpeningType] = useState('window');",
  "const [openingType, setOpeningType] = useState('window');\n  const [roofShape, setRoofShape] = useState<'single'|'gable'>('single');\n  const [gableLayout, setGableLayout] = useState<'continuous'|'center'>('continuous');"
);

// We need to modify the UI to include the roofShape toggle (Single Slope / Double Slope)
// Let's find where to put it. The prompt says "Directly below the 'Single Slope / Double Slope' toggle...". Wait!
// "Directly below the "Single Slope / Double Slope" toggle, add a conditional UI block that ONLY renders if `roofShape === 'gable'`"
