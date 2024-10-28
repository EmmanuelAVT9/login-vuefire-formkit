// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_APIKEY_FIREBASE,
  authDomain: "login-vue-appemmavaztru.firebaseapp.com",
  projectId: "login-vue-appemmavaztru",
  storageBucket: "login-vue-appemmavaztru.appspot.com",
  messagingSenderId: "899769902992",
  appId: "1:899769902992:web:fc5affcbd1caba9ac37515"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };