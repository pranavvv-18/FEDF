const fs = require('fs');

let content = fs.readFileSync('voyager-react/src/App.jsx', 'utf8');

// Fix text-anchor, font-family, font-size, font-weight
content = content.replace(/text-anchor/g, 'textAnchor');
content = content.replace(/font-family/g, 'fontFamily');
content = content.replace(/font-size/g, 'fontSize');
content = content.replace(/font-weight/g, 'fontWeight');

// Fix preserveAspectRatio
content = content.replace(/preserveAspectRatio/g, 'preserveAspectRatio');

// Write back
fs.writeFileSync('voyager-react/src/App.jsx', content);
console.log('Fixed JSX attributes');
