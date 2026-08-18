const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data/specialists.json', 'utf8'));
let id = 1;
for (const item of data) {
    item.id = id++;
}
fs.writeFileSync('data/specialists.json', JSON.stringify(data, null, 2));
