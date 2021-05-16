import { HttpMethods } from "@/enums/httpMethods";
import AbstractAdapter from "./abstractAdapter";
import {
  PostPictureRequest,
  GetPicturesResponse,
  PutPictureRequest,
  GetPictureResponse,
} from "./messages/pictures";

class PicturesAdapter extends AbstractAdapter {
  public postPicture(
    instance: Vue,
    parameter: PostPictureRequest
  ): Promise<void> {
    return this.requestWithAuth(
      instance,
      "pictures",
      parameter,
      HttpMethods.POST
    );
  }

  public getPictures(
    instance: Vue,
    tags: Array<string>
  ): Promise<GetPicturesResponse> {
    let url = "pictures?tag=";
    tags.forEach((e) => (url += e + ","));
    return this.requestWithAuth(
      instance,
      url.substring(0, url.length - 1),
      null,
      HttpMethods.GET
    );
  }

  public putPictures(
    instance: Vue,
    id: string,
    param: PutPictureRequest
  ): Promise<void> {
    const url = "pictures/" + id;
    return this.requestWithAuth(instance, url, param, HttpMethods.PUT);
  }

  public deletePictures(instance: Vue, id: string): Promise<void> {
    const url = "pictures/" + id;
    return this.requestWithAuth(instance, url, null, HttpMethods.DELETE);
  }

  public getPicture(instance: Vue, id: string): Promise<GetPictureResponse> {
    const url = "pictures/" + id;
    return this.requestWithAuth(instance, url, null, HttpMethods.GET);
  }
}

export default new PicturesAdapter();
