export class HttpError {
  public statusCode: number;
  /* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types */
  public responseData: any;
  constructor(statusCode: number, responseData: any) {
    /* eslint-enable @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types */
    this.statusCode = statusCode;
    this.responseData = responseData;
  }
}
