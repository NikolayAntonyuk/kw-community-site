import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin
if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
  console.error("Missing FIREBASE_SERVICE_ACCOUNT environment variable.");
  process.exit(1);
}

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();
const DATA_FILE = path.join(__dirname, "../data/specialists.json");

async function sync() {
  console.log("Fetching approved specialists from Firebase...");
  try {
    const snapshot = await db.collection("pending_specialists").where("status", "in", ["approved", "deleted"]).get();
    
    if (snapshot.empty) {
      console.log("No new approved or deleted specialists found.");
      return;
    }

    // Read current data
    let currentData = [];
    if (fs.existsSync(DATA_FILE)) {
      currentData = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
    }

    const batch = db.batch();
    let count = 0;

    snapshot.forEach(doc => {
      const data = doc.data();
      // Remove status and rejectReason before saving
      delete data.status;
      delete data.rejectReason;
      
      // If it doesn't have an ID, add one
      if (!data.id) {
        const maxId = currentData.reduce((max, s) => {
          const idNum = parseInt(s.id, 10);
          return !isNaN(idNum) && idNum > max ? idNum : max;
        }, 0);
        data.id = maxId + 1;
      }

      // Convert Firestore Timestamps to ISO Strings
      if (data.createdAt && typeof data.createdAt.toDate === 'function') {
        data.createdAt = data.createdAt.toDate().toISOString();
      }
      if (data.updatedAt && typeof data.updatedAt.toDate === 'function') {
        data.updatedAt = data.updatedAt.toDate().toISOString();
      }

      const existingIndex = currentData.findIndex(s => s.id === data.id);
      
      const isDeleted = doc.data().status === "deleted";

      if (isDeleted) {
        if (existingIndex !== -1) {
          currentData.splice(existingIndex, 1);
        }
      } else {
        if (existingIndex !== -1) {
          currentData[existingIndex] = { ...currentData[existingIndex], ...data };
        } else {
          currentData.push(data);
        }
      }
      
      // Delete the document from Firebase
      batch.delete(doc.ref);
      count++;
    });

    // Write to file
    fs.writeFileSync(DATA_FILE, JSON.stringify(currentData, null, 2));
    console.log(`Successfully merged/updated ${count} specialists into specialists.json.`);

    // Commit deletion in Firebase
    await batch.commit();
    console.log("Successfully cleared merged specialists from Firebase.");
    
  } catch (error) {
    console.error("Error during sync:", error);
    process.exit(1);
  }
}

sync();
