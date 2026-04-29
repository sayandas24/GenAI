import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyApGoEP7goF-Mm4Js21Tx5P77pJxZHlY-E",
  authDomain: "virtual-mate-7878.firebaseapp.com",
  projectId: "virtual-mate-7878",
  storageBucket: "virtual-mate-7878.firebasestorage.app",
  messagingSenderId: "194880763027",
  appId: "1:194880763027:web:fbc1db73e1bc7709938966",
  measurementId: "G-TWVHKN3YW7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export default app;
