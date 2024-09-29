// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyDyEwIxK8GVuUD0ugmZep8MW3Dzw6yZjSs",
	authDomain: "positivibes-22bcb.firebaseapp.com",
	projectId: "positivibes-22bcb",
	storageBucket: "positivibes-22bcb.appspot.com",
	messagingSenderId: "26379702587",
	appId: "1:26379702587:web:70a46bea534a1ca95b671e",
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { auth, db };
