// Заглушка Firebase SDK для юніт-тестів.
// js/firebase.js та js/data.js імпортують SDK з https://www.gstatic.com/...,
// а ESM-лоадер Node такі URL не вантажить. vitest.config.js підміняє їх на цей файл.

export const __state = {
  docs: [],
};

export function initializeApp() {
  return { name: "test-app" };
}

export function getFirestore() {
  return { type: "firestore" };
}

export function getAuth() {
  return { type: "auth" };
}

export function collection(_db, name) {
  return { collection: name };
}

export function where(field, op, value) {
  return { field, op, value };
}

export function query(col, ...constraints) {
  return { col, constraints };
}

export async function getDocs() {
  return {
    forEach(callback) {
      __state.docs.forEach((data) => callback({ data: () => data }));
    },
  };
}
