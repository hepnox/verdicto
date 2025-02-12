import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

export const firebaseConfig = {
    apiKey: "AIzaSyBtpMxTvwOBoVC40nByx_vDkqwCcEWJtNI",
    authDomain: "verdicto-18f35.firebaseapp.com",
    projectId: "verdicto-18f35",
    storageBucket: "verdicto-18f35.firebasestorage.app",
    messagingSenderId: "1003540549022",
    appId: "1:1003540549022:web:aa188f7202c194c89b5a8f",
    measurementId: "G-3TM0XHJ9Y0"
  };

export const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
