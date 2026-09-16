const fs = require('fs');
let code = fs.readFileSync('js/admin.js', 'utf8');

const oldRenderBtn = '<button class="btn btn-approve" style="background: #28a745;" onclick="window.resolveFeedback(\'${docSnap.id}\', decodeURIComponent(\'${encodedMsg}\'), decodeURIComponent(\'${encodeURIComponent(data.contactInfo || "")}\'))">Позначити як вирішене</button>';

const newRenderBtn = '<button class="btn btn-approve" style="background: #28a745;" onclick="window.resolveFeedback(\'${docSnap.id}\', decodeURIComponent(\'${encodedMsg}\'), decodeURIComponent(\'${encodeURIComponent(data.contactInfo || "").replace(/\\\'/g, "%27")}\'))">Позначити як вирішене</button>';

code = code.replace(oldRenderBtn, newRenderBtn);
fs.writeFileSync('js/admin.js', code);
