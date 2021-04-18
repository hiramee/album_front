import { ErrorTypes } from "../enums/errorTypes";

export default class ErrorRepository {

    public static handleHttpError(instance: Vue, code: number, message: string | null) {
        console.log(code);
        if (code >= 400 && code < 500) {
            this.handleClientError(instance, message);
        } else {
            this.handleServerError(instance, message);
        }
    }

    public static handleClientError(instance: Vue, message: string | null) {
        instance.$notify({
            title: "warning",
            text: message ? message : "Invalid Parameter",
            duration: 2000,
            group: "top-center",
            type: ErrorTypes.WARN,
        });
    }

    public static handleServerError(instance: Vue, message: string | null) {
        instance.$notify({
            title: "error",
            text: message ? message : "Servr Temporary Inavailable",
            duration: 2000,
            group: "top-center",
            type: ErrorTypes.ERROR,
        });
    }

    public static handleMessage(instance: Vue, errorType: ErrorTypes, title: string, message: string) {
        instance.$notify({
            title: title,
            text: message,
            duration: 2000,
            group: "top-center",
            type: errorType,
        });
    }
}
