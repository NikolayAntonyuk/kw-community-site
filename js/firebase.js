import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDLEmsFY7IxK6nfuoy6EEqw6GNqCPeVH3A",
  authDomain: "kw-community.firebaseapp.com",
  projectId: "kw-community",
  storageBucket: "kw-community.firebasestorage.app",
  messagingSenderId: "867344768696",
  appId: "1:867344768696:web:846c9c02cce4740286de4d",
  measurementId: "G-E4KTQNSH7E"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
