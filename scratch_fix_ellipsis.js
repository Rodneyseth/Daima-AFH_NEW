const fs = require('fs');
const files = ['src/App.jsx', 'src/DailyLogGenerator.jsx', 'src/sheetsConfig.jsx'];

files.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/…/g, "..."); // replace horizontal ellipsis
    fs.writeFileSync(f, content);
    console.log(`Fixed ellipsis in ${f}`);
  }
});
