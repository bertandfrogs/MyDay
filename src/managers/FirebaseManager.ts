import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../firebase.config.ts";
import { googleApiScope } from "../../google.config.ts";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { getFirestore, doc, setDoc, Timestamp, getDoc } from "firebase/firestore";

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

      // store user's access_token in firestore
      await this.storeToken(access_token);
      
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

  async storeToken(access_token: string | undefined) {
    const uid = this.getCurrentUser()?.uid;
    if (uid && access_token) {
      return await setDoc(doc(this.database, "auth", uid), {
        access_token: access_token,
        date: Timestamp.fromDate(new Date())
      })
    }
  }

  async getToken() {
    const uid = this.getCurrentUser()?.uid;
    if (uid) {
      const res = await getDoc(doc(this.database, "auth", uid));
      return res.get("access_token");
    }
  }
}

export default FirebaseManager;
