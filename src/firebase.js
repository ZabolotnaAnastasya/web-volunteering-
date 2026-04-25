// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCmz-1RBp7O653ERqR9hDjDuXPa5oOcmIE",
    authDomain: "volunteer-app-2e57f.firebaseapp.com",
    projectId: "volunteer-app-2e57f",
    storageBucket: "volunteer-app-2e57f.firebasestorage.app",
    messagingSenderId: "297617111947",
    appId: "1:297617111947:web:0b95aff55761eae0b6cd8e",
    measurementId: "G-KYH4Q7G768"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);
export const db = getFirestore(app);