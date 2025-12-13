import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCYoAQ1Of_UaVsbizCWicSCNvQ3l36fKIU",
  authDomain: "hackaton-2b824.firebaseapp.com",
  projectId: "hackaton-2b824",
  storageBucket: "hackaton-2b824.firebasestorage.app",
  messagingSenderId: "168895929436",
  appId: "1:168895929436:web:1b5bf69cec321133f61a99",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
