const fs = require('fs');
const file = 'src/App.jsx';
let content = fs.readFileSync(file, 'utf8');

// The user copy-pasted markdown into their JS file. We need to remove the triple backticks that are on lines by themselves.
content = content.replace(/^```\s*$/gm, '');

fs.writeFileSync(file, content);
console.log('Removed markdown backticks from App.jsx');
