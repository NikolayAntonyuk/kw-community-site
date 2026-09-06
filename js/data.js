import { db } from "./firebase.js";
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

export async function fetchSpecialists({ force = false } = {}) {
  // 1. Fetch static JSON
  let staticSpecialists = [];
  try {
    const response = await fetch(`data/specialists.json?v=${new Date().getTime()}`);
    if (response.ok) {
      staticSpecialists = await response.json();
    }
  } catch (error) {
    console.error("Не вдалося завантажити статику:", error);
  }

  // 2. Map static specialists by string ID
  const uniqueMap = new Map();
  staticSpecialists.forEach(item => {
    if (item.id != null) {
      uniqueMap.set(String(item.id), item);
    }
  });

  // 3. Fetch live updates (approved/deleted) from Firebase
  try {
    const q = query(collection(db, "pending_specialists"), where("status", "in", ["approved", "deleted"]));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const itemId = data.id || docSnap.id;
      if (data.status === "deleted") {
        if (itemId) uniqueMap.delete(String(itemId));
      } else if (data.status === "approved" || !data.status) {
        if (data.createdAt && typeof data.createdAt.toDate === 'function') {
          data.createdAt = data.createdAt.toDate().toISOString();
        }
        if (data.updatedAt && typeof data.updatedAt.toDate === 'function') {
          data.updatedAt = data.updatedAt.toDate().toISOString();
        }
        uniqueMap.set(String(itemId), { ...data, id: String(itemId) });
      }
    });
  } catch (error) {
    console.error("Не вдалося завантажити з Firebase:", error);
  }

  // Return only deduplicated live items
  return Array.from(uniqueMap.values());
}
