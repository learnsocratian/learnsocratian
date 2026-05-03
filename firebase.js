import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAQeYhlCGI1SRgCWTZYq2zj5Hm9eC4u9gc",
  authDomain: "learnsocratian.firebaseapp.com",
  projectId: "learnsocratian",
  storageBucket: "learnsocratian.firebasestorage.app",
  messagingSenderId: "776213175592",
  appId: "1:776213175592:web:0e5cc578fa71b22e1e841d"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
