// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB_q7gKH6M3KHbAhW6LmI1C8FzEHsoPB9Y",
  authDomain: "brainnbuzz-cc351.firebaseapp.com",
  projectId: "brainnbuzz-cc351",
  storageBucket: "brainnbuzz-cc351.firebasestorage.app",
  messagingSenderId: "310662256644",
  appId: "1:310662256644:web:b99131e37c32d4eb27bd51",
  measurementId: "G-QBH7T017FC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// For development: uncomment this to use emulator
// if (window.location.hostname === "localhost") {
//   connectFirestoreEmulator(db, 'localhost', 8080);
// }

console.log("Firebase initialized successfully");

export default app;
export { db };