import { db } from "./firebase.js";
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Завантаження даних каталогу спеціалістів з локального JSON файлу та з Firebase
export async function fetchSpecialists({ force = false } = {}) {
  // 1. Fetch static JSON
  let staticSpecialists = [];
  try {
    const response = await fetch("data/specialists.json");
    if (response.ok) {
      staticSpecialists = await response.json();
    }
  } catch (error) {
    console.error("Не вдалося завантажити статику:", error);
  }

  // 2. Fetch newly approved from Firebase
  let firebaseSpecialists = [];
  try {
    const q = query(collection(db, "pending_specialists"), where("status", "==", "approved"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.createdAt && typeof data.createdAt.toDate === 'function') {
        data.createdAt = data.createdAt.toDate().toISOString();
      }
      if (data.updatedAt && typeof data.updatedAt.toDate === 'function') {
        data.updatedAt = data.updatedAt.toDate().toISOString();
      }
      if (!data.id) {
        data.id = "New";
      }
      firebaseSpecialists.push(data);
    });
  } catch (error) {
    console.error("Не вдалося завантажити з Firebase:", error);
  }

  // Combine both and deduplicate by ID
  const uniqueMap = new Map();

  // Add static items first
  staticSpecialists.forEach(item => {
    if (item.id) uniqueMap.set(item.id, item);
  });

  // Firebase items override static (they're more up-to-date)
  firebaseSpecialists.forEach(item => {
    if (item.id) uniqueMap.set(item.id, item);
  });

  // Return only deduplicated items with valid IDs
  return Array.from(uniqueMap.values());
}
