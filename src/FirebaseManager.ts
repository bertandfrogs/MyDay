import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../firebase.config.ts";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

class FirebaseManager {
  firebase = initializeApp(firebaseConfig);
  provider = new GoogleAuthProvider();
  auth = getAuth();

  async signIn() {
    try {
      const result = await signInWithPopup(this.auth, this.provider);
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      console.log(result);
      console.log(credential);
      return result;
    } catch (error) {
      console.log("Error: ", error)
      // // Handle Errors here.
      // const errorCode = error.code;
      // const errorMessage = error.message;
      // // The email of the user's account used.
      // const email = error.customData.email;
      // // The AuthCredential type that was used.
      // const credential_1 = GoogleAuthProvider.credentialFromError(error);
    }
  }

  async signOut() {
    await signOut(this.auth).then(() => {
      console.log("Sign-out successful.")
    }).catch((error) => {
      // An error happened.
      console.log("Error: ", error)
    });
  }
}

export default FirebaseManager;