import { HttpMethods } from "@/enums/httpMethods";
import AbstractAdapter from "./abstractAdapter";
import { PostPictureRequest, GetPicturesResponse, PutPictureRequest, GetPictureResponse } from "./messages/pictures";

class PicturesAdapter extends AbstractAdapter {
    public postPicture(parameter: PostPictureRequest): Promise<void> {
        return this.requestWithAuth("pictures", parameter, HttpMethods.POST);
    }

    public getPictures(tags: Array<string>): Promise<GetPicturesResponse> {
        let url = "pictures?tag=";
        tags.forEach(e => url += e + ",");
        return this.requestWithAuth(url.substring(0, url.length - 1), null, HttpMethods.GET);
    }


    public putPictures(id: string, param: PutPictureRequest): Promise<void> {
        const url = "pictures/" + id;
        return this.requestWithAuth(url, param, HttpMethods.PUT);
    }

    public deletePictures(id: string): Promise<void> {
        const url = "pictures/" + id;
        return this.requestWithAuth(url, null, HttpMethods.DELETE);
    }

    public getPicture(id: string): Promise<GetPictureResponse> {
        const url = "pictures/" + id;
        return this.requestWithAuth(url, null, HttpMethods.GET);
    }
}

export default new PicturesAdapter();
