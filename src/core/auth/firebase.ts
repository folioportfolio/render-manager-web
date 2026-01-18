import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBVmvbeZZaK_wXRaAn5Qg_B0kDvxzMMY6c",
    authDomain: "render-status-app.firebaseapp.com",
    projectId: "render-status-app",
    storageBucket: "render-status-app.firebasestorage.app",
    messagingSenderId: "816068660214",
    appId: "1:816068660214:web:f7c295f6e301e6576095d7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);