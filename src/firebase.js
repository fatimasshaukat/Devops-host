import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCWnu-GXMb2eJEJHbOh2zL2pfhApRdVwVY",
  authDomain: "fitness-e57b9.firebaseapp.com",
  projectId: "fitness-e57b9",
  storageBucket: "fitness-e57b9.appspot.com",
  messagingSenderId: "512657329929",
  appId: "1:512657329929:web:9dc0db7fd1551d6ea5cdd8",
  measurementId: "G-S278LRQN0G",
};

const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
