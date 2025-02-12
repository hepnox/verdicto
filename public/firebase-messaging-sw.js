importScripts('https://www.gstatic.com/firebasejs/8.8.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.8.0/firebase-messaging.js');

const firebaseConfig = {
    apiKey: "AIzaSyBtpMxTvwOBoVC40nByx_vDkqwCcEWJtNI",
    authDomain: "verdicto-18f35.firebaseapp.com",
    projectId: "verdicto-18f35",
    storageBucket: "verdicto-18f35.firebasestorage.app",
    messagingSenderId: "1003540549022",
    appId: "1:1003540549022:web:aa188f7202c194c89b5a8f",
    measurementId: "G-3TM0XHJ9Y0"
};
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log(
        '[firebase-messaging-sw.js] Received background message ',
        payload
    );
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: './logo.png',
    };
    self.registration.showNotification(notificationTitle, notificationOptions);
});