import { HttpMethods } from "@/enums/httpMethods";
import AbstractAdapter from "./abstractAdapter";
import { PostPictureRequest, GetPicturesResponse } from "./messages/pictures";

class PicturesAdapter extends AbstractAdapter {
    public postPicture(parameter: PostPictureRequest): Promise<void> {
        return this.requestWithAuth("pictures", parameter, HttpMethods.POST);
    }

    public getPictures(tags: Array<string>): Promise<GetPicturesResponse> {
        let url = "pictures?tag=";
        tags.forEach(e => url += e + ",");
        return this.requestWithAuth(url.substring(0, url.length - 1), null, HttpMethods.GET);
    }
}

export default new PicturesAdapter();
