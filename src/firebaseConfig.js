// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCsfX6PCeaO0CKf8IRsViCZSeJmqOz5wJ0",
  authDomain: "drive-af4e3.firebaseapp.com",
  projectId: "drive-af4e3",
  storageBucket: "drive-af4e3.firebasestorage.app",
  messagingSenderId: "214625222922",
  appId: "1:214625222922:web:2baf318599a4c9c13bfaf3",
  measurementId: "G-NPVTLD56PB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);