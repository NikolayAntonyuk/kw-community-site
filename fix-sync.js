const fs = require('fs');
let content = fs.readFileSync('server.js', 'utf8');

const oldSync = `    const updates = [];
    const deletes = [];
    const batch = db.batch();

    approvedSnapshot.forEach(doc => {
      const data = doc.data();
      const id = doc.id;
      if (data.createdAt && typeof data.createdAt.toDate === 'function') data.createdAt = data.createdAt.toDate().toISOString();
      if (data.updatedAt && typeof data.updatedAt.toDate === 'function') data.updatedAt = data.updatedAt.toDate().toISOString();
      data.id = data.id || id;
      batch.delete(doc.ref);
      updates.push(data);
    });`;

const newSync = `    const updates = [];
    const deletes = [];
    const batch = db.batch();

    let maxId = 0;
    staticData.forEach(s => {
      if (s.id && !isNaN(Number(s.id))) {
        maxId = Math.max(maxId, Number(s.id));
      }
    });

    approvedSnapshot.forEach(doc => {
      const data = doc.data();
      const id = doc.id;
      if (data.createdAt && typeof data.createdAt.toDate === 'function') data.createdAt = data.createdAt.toDate().toISOString();
      if (data.updatedAt && typeof data.updatedAt.toDate === 'function') data.updatedAt = data.updatedAt.toDate().toISOString();
      
      if (!data.id || isNaN(Number(data.id))) {
        maxId++;
        data.id = String(maxId);
      }
      
      batch.delete(doc.ref);
      updates.push(data);
    });`;

content = content.replace(oldSync, newSync);
fs.writeFileSync('server.js', content);
