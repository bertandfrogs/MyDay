// Manages data using the FirebaseManager and GoogleCalendarManager classes
// Stores some user data using CookieManager

import GoogleCalendarManager from "./GoogleCalendarManager";
import CookieManager from "./CookieManager";
import FirebaseManager from "./FirebaseManager";
import { convertGCtoAppointment } from "../AppDataContext";

export default class DataManager {
  firebaseManager: FirebaseManager;
  gcManager: GoogleCalendarManager;
  cookieManager: CookieManager;
  
  constructor() {
    this.cookieManager = new CookieManager();
    this.firebaseManager = new FirebaseManager();
    this.gcManager = new GoogleCalendarManager(this.cookieManager.getAccessCookie());
  }
  
  async signIn() {
    const fbResult = await this.firebaseManager.signInFirebase();
    if (fbResult) {
      this.gcManager.setAccessToken(fbResult.access_token);
      this.cookieManager.storeAccessCookie(fbResult.access_token);
      return fbResult.user;
    }
    else {
      console.log("DataManager Error: couldn't sign in using Firebase");
    }
  }

  async signOut() {
    await this.firebaseManager.signOut();
    this.cookieManager.removeAccessCookie();
  }

  getCurrentUser() {
    return this.firebaseManager.getCurrentUser();
  }

  async getTodayEvents() {
    const events = await this.gcManager.listTodayEvents();
    const appts = events.map((event) => convertGCtoAppointment(event));
    return appts;
  }
}