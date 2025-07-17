import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAOk5Hrz_glfy6bsFqsbH0sqh3gBdeTB9g",
  authDomain: "entertainment-e7939.firebaseapp.com",
  projectId: "entertainment-e7939",
  storageBucket: "entertainment-e7939.appspot.com",
  messagingSenderId: "627881296446",
  appId: "1:627881296446:web:9a96daa3a2edf07bf4c76f",
  measurementId: "G-E5Q6TB0FLP",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// export const db=getFirestore(app);
export default app;
