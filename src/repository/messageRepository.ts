import { ErrorTypes } from "../enums/errorTypes";

/**
 * Show message in notification
 */
export default class MessageRepository {
  public static handleSuccess(instance: Vue, message: string | null): void {
    instance.$notify({
      title: "Success",
      text: message ?? "Invalid Parameter",
      duration: 2000,
      group: "top-center",
      type: ErrorTypes.SUCCESS,
    });
  }

  public static handleFailure(instance: Vue, message: string | null): void {
    instance.$notify({
      title: "Failed",
      text: message ?? "Invalid Parameter",
      duration: 2000,
      group: "top-center",
      type: ErrorTypes.WARN,
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
