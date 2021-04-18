export class HttpError {
    public statusCode: number;
    public responseData: any;
    constructor(statusCode: number, responseData: any) {
        this.statusCode = statusCode;
        this.responseData = responseData;
    }
}