const fs = require('fs');
let content = fs.readFileSync('js/render.js', 'utf8');

const youtubeFunc = `function youtubeUrl(value) {
  if (/^https?:\\/\\//i.test(value)) return value;
  return \`https://youtube.com/\${value.startsWith('@') ? value : '@' + value}\`;
}

`;

content = content.replace('const CONTACTS = [', youtubeFunc + 'const CONTACTS = [');
content = content.replace('{ field: "facebook", label: "Facebook", href: facebookUrl },', '{ field: "facebook", label: "Facebook", href: facebookUrl },\n  { field: "youtube", label: "YouTube", href: youtubeUrl },');

fs.writeFileSync('js/render.js', content);
