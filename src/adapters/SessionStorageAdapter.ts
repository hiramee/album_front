import { AUTH_KEY } from "@/consts/consts";

export class SessionStorageAdapter {
    static postLogin(idToken: string): void {
        sessionStorage.setItem(AUTH_KEY, idToken);
    }
    static postLogout(): void {
        sessionStorage.removeItem(AUTH_KEY);
    }
    static isLogin(): boolean {
        return sessionStorage.getItem(AUTH_KEY) ? true : false;
    }
}