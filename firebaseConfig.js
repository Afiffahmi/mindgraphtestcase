import { initializeApp } from "firebase/app";
import { getFirestore, collection, setDoc, doc } from "firebase/firestore"; // Import from firebase/firestore

const firebaseConfig = {
  apiKey: "AIzaSyBlWrUCZtdvYPN230lWyVkoLJKmAyiiYP0",
  authDomain: "mind-graph-test-case-hazimzamr.firebaseapp.com",
  projectId: "mind-graph-test-case-hazimzamr",
  storageBucket: "mind-graph-test-case-hazimzamr.appspot.com",
  messagingSenderId: "700656217647",
  appId: "1:700656217647:web:b5abefff29cf53d142a0da",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Make sure to pass the app instance here

export { db, collection, setDoc, doc };
