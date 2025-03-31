import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAiW7ZuVGP25N59GFuWNVGlBjCZeHTpkqA",
  authDomain: "roommate-dhoondho-4a0e1.firebaseapp.com",
  projectId: "roommate-dhoondho-4a0e1",
  storageBucket: "roommate-dhoondho-4a0e1.firebasestorage.app",
  messagingSenderId: "388711123625",
  appId: "1:388711123625:web:fab9890caa1fdd4383b7b8",
  measurementId: "G-JY7DKHDD1F"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app); 