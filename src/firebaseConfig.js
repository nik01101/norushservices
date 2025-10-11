// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // <-- Import Firestore
import { getAuth } from "firebase/auth"; // <-- Import Auth

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBUOaT3vVeKYm9mshjc2w_eFgIUeVouG98",
  authDomain: "no-rush-ba08a.firebaseapp.com",
  projectId: "no-rush-ba08a",
  storageBucket: "no-rush-ba08a.firebasestorage.app",
  messagingSenderId: "1846938519",
  appId: "1:1846938519:web:f5f2ff6f395e475dca12d2",
  measurementId: "G-3WLZDW70ZL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); 
export const auth = getAuth(app)