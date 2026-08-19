const fs = require('fs');
const path = '/home/mykola/kw-community-site/data/specialists.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const filteredData = data.filter(item => {
  return [
    item.phone,
    item.telegram,
    item.instagram,
    item.facebook,
    item.website
  ].some(contact => contact && String(contact).trim() !== "");
});

console.log(`Original count: ${data.length}`);
console.log(`Filtered count: ${filteredData.length}`);

fs.writeFileSync(path, JSON.stringify(filteredData, null, 2), 'utf8');
