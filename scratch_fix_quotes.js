const fs = require('fs');
const files = ['src/App.jsx', 'src/DailyLogGenerator.jsx', 'src/sheetsConfig.jsx'];

files.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/[‘’]/g, "'");
    content = content.replace(/[“”]/g, '"');
    content = content.replace(/–/g, '-'); // replace en-dash
    content = content.replace(/—/g, '--'); // replace em-dash
    fs.writeFileSync(f, content);
    console.log(`Fixed quotes in ${f}`);
  }
});
