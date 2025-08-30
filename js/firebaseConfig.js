import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";


const firebaseConfig = {
    apiKey: "AIzaSyDu6xax8bplhZTCB5VomJIgqV4hs7Q-_8o",
    authDomain: "moviedatabase-30a45.firebaseapp.com",
    databaseURL: "https://moviedatabase-30a45-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "moviedatabase-30a45",
    storageBucket: "moviedatabase-30a45.firebasestorage.app",
    messagingSenderId: "437764915486",
    appId: "1:437764915486:web:fefa558f72b1bd7c59890f",
    measurementId: "G-GC0SWW356V"
};

const app = initializeApp(firebaseConfig);
export const db= getDatabase(app);
export const fs = getFirestore(app);
export const auth= getAuth(app);