// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

export default app;