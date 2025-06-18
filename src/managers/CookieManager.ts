import { getCookie, removeCookie, setCookie } from "typescript-cookie";

const accessCookie = "g_access";

export default class CookieManager {
  access_token: string | undefined;
  constructor () {
    this.access_token = getCookie(accessCookie);
  }

  getAccessCookie() {
    this.access_token = getCookie(accessCookie);
    return this.access_token;
  }

  storeAccessCookie(token: string | undefined) {
    if (token) {
      this.access_token = token;
      setCookie(accessCookie, this.access_token, {expires: 0.0416667});
    }
  }

  removeAccessCookie() {
    removeCookie(accessCookie);
  }
}