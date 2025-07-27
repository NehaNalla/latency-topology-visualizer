// utils/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBC6w-KcuOMkA1Q4h1IAJ7ErZRhwR5x8vA",
  authDomain: "latency-visualizer-5176c.firebaseapp.com",
  projectId: "latency-visualizer-5176c",
  storageBucket: "latency-visualizer-5176c.firebasestorage.app",
  messagingSenderId: "875651451132",
  appId: "1:875651451132:web:c061f0d8edf531b4f0ef79",
  measurementId: "G-7XGPT9R7X4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
