import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// These values should be provided by the user in a real scenario
// I will use placeholders that the user can replace in their .env
const firebaseConfig = {
  apiKey: "AIzaSyDWeunUrNYDiyqSxHBvI7A07RjAxjouuNM",
  authDomain: "ecom-dabe5.firebaseapp.com",
  projectId: "ecom-dabe5",
  storageBucket: "ecom-dabe5.firebasestorage.app",
  messagingSenderId: "860324159167",
  appId: "1:860324159167:web:35e3267bcd5538ee1d700a",
  measurementId: "G-29CEFY64DS"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
