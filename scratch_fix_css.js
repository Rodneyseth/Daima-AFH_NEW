const fs = require('fs');
let app = fs.readFileSync('src/App.jsx', 'utf8');

// replace CSS variable definitions in :root
app = app.replace(/-bg:/g, '--bg:');
app = app.replace(/-surface:/g, '--surface:');
app = app.replace(/-card:/g, '--card:');
app = app.replace(/-border:/g, '--border:');
app = app.replace(/-amber:/g, '--amber:');
app = app.replace(/-green:/g, '--green:');
app = app.replace(/-red:/g, '--red:');
app = app.replace(/-blue:/g, '--blue:');
app = app.replace(/-purple:/g, '--purple:');
app = app.replace(/-muted:/g, '--muted:');
app = app.replace(/-text:/g, '--text:');
app = app.replace(/-heading:/g, '--heading:');

// replace usages of CSS variables
app = app.replace(/var\(-/g, 'var(--');

fs.writeFileSync('src/App.jsx', app);
console.log('Fixed CSS variable prefixes in App.jsx');
