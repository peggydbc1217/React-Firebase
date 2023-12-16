// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

import { getStorage } from "firebase/storage";

// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC-qV4H7rg_gO0h47ODcGmj-PRI39lRyOw",
  authDomain: "fir-course-20231216.firebaseapp.com",
  projectId: "fir-course-20231216",
  storageBucket: "fir-course-20231216.appspot.com",
  messagingSenderId: "1061047432351",
  appId: "1:1061047432351:web:cafd8dcbe60e55cdf2deaa",
  measurementId: "G-6KDN44TLPY",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const db = getFirestore(app);
export const storage = getStorage(app);
