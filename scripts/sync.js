import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin
if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
  console.error("Missing FIREBASE_SERVICE_ACCOUNT environment variable.");
  process.exit(1);
}

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const DATA_FILE = path.join(__dirname, "../data/specialists.json");

async function sync() {
  console.log("Fetching approved specialists from Firebase...");
  try {
    const snapshot = await db.collection("pending_specialists").where("status", "==", "approved").get();
    
    if (snapshot.empty) {
      console.log("No new approved specialists found.");
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
      
      // If it doesn't have an ID (shouldn't happen for new, but just in case), add one
      if (!data.id) {
        data.id = randomUUID();
      }

      // Check if it already exists (edit mode)
      const existingIndex = currentData.findIndex(s => s.id === data.id);
      if (existingIndex !== -1) {
        currentData[existingIndex] = { ...currentData[existingIndex], ...data };
      } else {
        currentData.push(data);
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
