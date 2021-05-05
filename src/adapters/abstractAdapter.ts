import axios, { AxiosError, AxiosResponse } from "axios";
import { BASE_URL, AUTH_KEY, ID_KEY } from '../consts/consts';
import { HttpMethods } from "@/enums/httpMethods";
import { HttpError } from "@/errors/error";

export default class AdstractAdapter {
    protected requestWithAuth(path: string, parameter: any, httpMethod: HttpMethods): Promise<any> {
        return new Promise((resolve, reject) => {
            axios({
                url: BASE_URL + path,
                method: httpMethod,
                headers: {
                    "x-authorization": sessionStorage.getItem(AUTH_KEY),
                    "x-identity": sessionStorage.getItem(ID_KEY),
                },
                data: parameter
            }).then(async (res: AxiosResponse) => resolve(res.data))
                .catch(async (error: AxiosError) => {
                    const err = error.response ? new HttpError(error.response.status, error.response.data) : null;
                    reject(err);
                });
        });
    }
}