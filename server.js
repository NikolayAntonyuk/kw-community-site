const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const { initializeApp, cert, getApp } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3010;

// CORS
app.use(cors());
app.use(express.json());

// Firebase Initialization
let db;
if (process.env.NODE_ENV === 'test') {
  // Use mock DB for tests
  db = global.__TEST_DB__ || require('./tests/unit/mockDb.js');
} else {
  const serviceAccount = require('./firebase-key.json');
  initializeApp({
    credential: cert(serviceAccount),
    projectId: serviceAccount.project_id
  });
  db = getFirestore();
}

// ===== API Routes =====

// 1. GET all specialists (live catalog)
app.get('/api/specialists', async (req, res) => {
  try {
    const snapshot = await db.collection('pending_specialists')
      .where('status', '==', 'approved')
      .get();

    const specialists = [];
    snapshot.forEach(doc => {
      specialists.push({ id: doc.id, ...doc.data() });
    });

    res.json(specialists);
  } catch (err) {
    console.error('Error fetching specialists:', err);
    res.status(500).json({ error: err.message });
  }
});

// 2. GET pending applications (admin)
app.get('/api/admin/pending', async (req, res) => {
  try {
    const snapshot = await db.collection('pending_specialists')
      .where('status', '==', 'pending')
      .get();

    const apps = [];
    snapshot.forEach(doc => {
      apps.push({ id: doc.id, ...doc.data() });
    });

    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. GET rejected applications (archive)
app.get('/api/admin/rejected', async (req, res) => {
  try {
    const snapshot = await db.collection('pending_specialists')
      .where('status', '==', 'rejected')
      .get();

    const apps = [];
    snapshot.forEach(doc => {
      apps.push({ id: doc.id, ...doc.data() });
    });

    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. CREATE or UPDATE specialist (CRUD)
app.post('/api/specialists', async (req, res) => {
  try {
    const { id, ...data } = req.body;
    const timestamp = FieldValue.serverTimestamp();

    if (id) {
      // Update existing
      console.log(`[CRUD] UPDATE specialist ID: ${id}`, { ...data, updatedAt: 'serverTimestamp' });
      await db.collection('pending_specialists').doc(id).set({
        ...data,
        updatedAt: timestamp,
        status: data.status || 'approved'
      }, { merge: true });
      console.log(`[CRUD] ✅ Successfully updated ID: ${id}`);
      res.json({ success: true, id, message: 'Спеціаліста оновлено' });
    } else {
      // Create new
      const newRef = db.collection('pending_specialists').doc(data.id || db.collection('pending_specialists').doc().id);
      await newRef.set({
        id: newRef.id,
        ...data,
        createdAt: timestamp,
        updatedAt: timestamp,
        status: data.status || 'approved'
      });
      console.log(`[CRUD] CREATE specialist with ID: ${newRef.id}`, data);
      console.log(`[CRUD] ✅ Successfully created ID: ${newRef.id}`);
      res.json({ success: true, id: newRef.id, message: 'Спеціаліста додано' });
    }
  } catch (err) {
    console.error(`[CRUD] ❌ Error:`, err.message);
    res.status(500).json({ error: err.message });
  }
});

// 5. DELETE specialist
app.delete('/api/specialists/:id', async (req, res) => {
  try {
    await db.collection('pending_specialists').doc(req.params.id).delete();
    res.json({ success: true, message: 'Спеціаліста видалено' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. APPROVE application
app.patch('/api/admin/approve/:id', async (req, res) => {
  try {
    await db.collection('pending_specialists').doc(req.params.id).update({
      status: 'approved',
      updatedAt: FieldValue.serverTimestamp()
    });
    res.json({ success: true, message: 'Заявка підтверджена' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7. REJECT application
app.patch('/api/admin/reject/:id', async (req, res) => {
  try {
    const { reason } = req.body;
    await db.collection('pending_specialists').doc(req.params.id).update({
      status: 'rejected',
      rejectReason: reason || '',
      updatedAt: FieldValue.serverTimestamp()
    });
    res.json({ success: true, message: 'Заявка відхилена' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 8. RESTORE rejected to pending
app.patch('/api/admin/restore/:id', async (req, res) => {
  try {
    await db.collection('pending_specialists').doc(req.params.id).update({
      status: 'pending',
      rejectReason: null,
      updatedAt: FieldValue.serverTimestamp()
    });
    res.json({ success: true, message: 'Заявка повернута у розгляд' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 9. FEEDBACK (Inaccuracy Reports)
app.post('/api/feedback', async (req, res) => {
  try {
    const { specialistId, senderName, contactInfo, message, status } = req.body;
    const timestamp = FieldValue.serverTimestamp();

    const docRef = await db.collection('feedback').add({
      specialistId: specialistId || null,
      senderName: senderName || 'Anonymous',
      contactInfo: contactInfo || '',
      message: message || '',
      status: status || 'new',
      createdAt: timestamp
    });

    console.log(`[FEEDBACK] Created report ${docRef.id} for specialist ${specialistId}`);
    res.json({ success: true, id: docRef.id, message: 'Звіт успішно відправлено' });
  } catch (err) {
    console.error(`[FEEDBACK] Error:`, err.message);
    res.status(500).json({ error: err.message });
  }
});

// 10. SYNC to JSON
app.post('/api/sync', async (req, res) => {
  try {
    const approvedSnapshot = await db.collection('pending_specialists')
      .where('status', '==', 'approved')
      .get();
      
    const deletedSnapshot = await db.collection('pending_specialists')
      .where('status', '==', 'deleted')
      .get();
      
    if (approvedSnapshot.empty && deletedSnapshot.empty) {
      return res.json({ success: true, message: 'Немає нових змін' });
    }

    const specialistsPath = path.join(__dirname, 'data', 'specialists.json');
    let staticData = [];
    if (fs.existsSync(specialistsPath)) {
      staticData = JSON.parse(fs.readFileSync(specialistsPath, 'utf8'));
    }

    const updates = [];
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
    });

    deletedSnapshot.forEach(doc => {
      const data = doc.data();
      const id = doc.id;
      const targetId = data.id || id;
      batch.delete(doc.ref);
      deletes.push(targetId);
    });

    updates.forEach(u => {
      const idx = staticData.findIndex(s => s.id === u.id || String(s.id) === String(u.id));
      if (idx !== -1) {
        staticData[idx] = { ...staticData[idx], ...u };
      } else {
        staticData.push(u);
      }
    });

    deletes.forEach(dId => {
      staticData = staticData.filter(s => String(s.id) !== String(dId));
    });

    fs.writeFileSync(specialistsPath, JSON.stringify(staticData, null, 2));
    await batch.commit();

    res.json({ success: true, synced: updates.length, deleted: deletes.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== Scheduled Tasks =====

// Daily Facebook scraping (03:00 AM)
cron.schedule('0 3 * * *', async () => {
  console.log('Starting daily Facebook event scraping...');
  try {
    // Placeholder for actual scraping logic
    // In production, call your Playwright scraper here
    console.log('Facebook scraping completed');
  } catch (err) {
    console.error('Facebook scraping error:', err);
  }
});

// ===== Static Files (GitHub Pages fallback) =====
app.use(express.static('.')); // Serve all files in current directory

// ===== Start Server =====
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`🌐 Public URL will be: https://kw-ua-community.duckdns.org`);
    console.log(`🔐 Firebase initialized: ${getApp().name}`);
  });
}

// Export for both CommonJS and ESM
module.exports = app;
module.exports.default = app;
