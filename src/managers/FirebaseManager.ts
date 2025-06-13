import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../firebase.config.ts";
import { googleApiScope } from "../../google.config.ts";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { getFirestore, doc, setDoc, Timestamp } from "firebase/firestore";

class FirebaseManager {
  firebase;
  provider;
  auth;
  database;

  constructor() {
    this.firebase = initializeApp(firebaseConfig);
    this.provider = new GoogleAuthProvider();
    this.provider.addScope(googleApiScope);
    this.database = getFirestore(this.firebase);
    this.auth = getAuth();
  }

  onAuthStateChange() {
    this.auth.onAuthStateChanged((user) => {
      if (user) {
        console.log("user is signed in")
      } else {
        console.log("user is not signed in")
      }
    });
  }

  async signInFirebase() {
    try {
      const result = await signInWithPopup(this.auth, this.provider);
      const user = result.user;

      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const access_token = credential?.accessToken;

      // add or update user in the database
      await setDoc(doc(this.database, "users", user.uid), {
        name: user.displayName,
        last_login: Timestamp.fromDate(new Date()),
      });

      return {
        user,
        access_token
      };
    } catch (error) {
      console.log("Error: ", error);
    }
  }

  async signOut() {
    await signOut(this.auth)
      .then(() => {
        console.log("Sign-out successful.");
      })
      .catch((error) => {
        // An error happened.
        console.log("Error: ", error);
      });
  }

  getCurrentUser() {
    return this.auth.currentUser;
  }
}

export default FirebaseManager;
