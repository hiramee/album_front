import { ErrorTypes } from "../enums/errorTypes";
import CognitoService from "@/adapters/cognito";

export default class ErrorRepository {
  public static handleHttpError(
    instance: Vue,
    code: number,
    message: string | null
  ): void {
    if (code === 401) {
      this.handleServerError(instance, "Session Invalidated");
      CognitoService.logout(instance);
      instance.$router.push("/");
    } else if (code >= 400 && code < 500) {
      this.handleClientError(instance, message);
    } else {
      this.handleServerError(instance, message);
    }
  }

  public static handleClientError(instance: Vue, message: string | null): void {
    instance.$notify({
      title: "Warning",
      text: message ?? "Invalid Parameter",
      duration: 2000,
      group: "top-center",
      type: ErrorTypes.WARN,
    });
  }

  public static handleServerError(instance: Vue, message: string | null): void {
    instance.$notify({
      title: "Error",
      text: message ?? "Servr Temporary Inavailable",
      duration: 2000,
      group: "top-center",
      type: ErrorTypes.ERROR,
    });
  }

  public static handleMessage(
    instance: Vue,
    errorType: ErrorTypes,
    title: string,
    message: string
  ): void {
    instance.$notify({
      title: title,
      text: message,
      duration: 2000,
      group: "top-center",
      type: errorType,
    });
  }
}
