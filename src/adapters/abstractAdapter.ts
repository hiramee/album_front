import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { BASE_URL, AUTH_KEY } from "../consts/consts";
import { HttpMethods } from "@/enums/httpMethods";
import { HttpError } from "@/errors/error";

/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types */
export default class AbstractAdapter {
  protected requestWithAuthBackGround(
    path: string,
    parameter: any,
    httpMethod: HttpMethods
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      axios({
        url: BASE_URL + path,
        method: httpMethod,
        headers: {
          "x-authorization": sessionStorage.getItem(AUTH_KEY),
        },
        data: parameter,
      } as AxiosRequestConfig)
        .then(async (res: AxiosResponse) => resolve(res.data))
        .catch(async (error: AxiosError) => {
          const err = error.response
            ? new HttpError(error.response.status, error.response.data)
            : null;
          reject(err);
        });
    });
  }

  protected requestWithAuth(
    instance: Vue,
    path: string,
    parameter: any,
    httpMethod: HttpMethods
  ): Promise<any> {
    instance.$store.commit("setLoading", true);
    return new Promise((resolve, reject) => {
      axios({
        url: BASE_URL + path,
        method: httpMethod,
        headers: {
          "x-authorization": sessionStorage.getItem(AUTH_KEY),
        },
        data: parameter,
      } as AxiosRequestConfig)
        .then(async (res: AxiosResponse) => resolve(res.data))
        .catch(async (error: AxiosError) => {
          const err = error.response
            ? new HttpError(error.response.status, error.response.data)
            : null;
          reject(err);
        });
    }).finally(() => {
      instance.$store.commit("setLoading", false);
    });
  }
}
