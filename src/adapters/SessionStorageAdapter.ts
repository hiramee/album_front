import { AUTH_KEY, ID_KEY } from "@/consts/consts";

export class SessionStorageAdapter {
    static postLogin(idToken: string, identity: string): void {
        sessionStorage.setItem(AUTH_KEY, idToken);
        sessionStorage.setItem(ID_KEY, identity);
    }
    static postLogout(): void {
        sessionStorage.removeItem(AUTH_KEY);
        sessionStorage.removeItem(ID_KEY);
    }
    static isLogin(): boolean {
        return sessionStorage.getItem(AUTH_KEY) ? true : false;
    }
}