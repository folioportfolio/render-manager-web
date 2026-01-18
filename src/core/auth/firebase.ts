import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Initialize Firebase
const app = initializeApp({
    projectId: import.meta.env.VITE_FB_PROJECT_ID,
    apiKey: import.meta.env.VITE_FB_API_KEY,
    authDomain: import.meta.env.VITE_AUTH_DOMAIN,
});
export const auth = getAuth(app);