import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-storage.js";


/* =========================================================
   FIREBASE CONFIGURATION
   ========================================================= */

const firebaseConfig = {
  apiKey: "AIzaSyAQeYhlCGI1SRgCWTZYq2zj5Hm9eC4u9gc",
  authDomain: "learnsocratian.firebaseapp.com",
  projectId: "learnsocratian",
  storageBucket: "learnsocratian.firebasestorage.app",
  messagingSenderId: "776213175592",
  appId: "1:776213175592:web:0e5cc578fa71b22e1e841d"
};


/* =========================================================
   INITIALIZE FIREBASE
   ========================================================= */

const app = initializeApp(firebaseConfig);


/* =========================================================
   FIREBASE SERVICES
   ========================================================= */

// Authentication:
// registration, login, logout, password reset
export const auth = getAuth(app);

// Firestore:
// student profiles, enrollment status, course access
export const db = getFirestore(app);

// Storage:
// protected course documents and learning materials
export const storage = getStorage(app);
