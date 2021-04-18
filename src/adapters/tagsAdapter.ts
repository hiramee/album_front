import { HttpMethods } from "@/enums/httpMethods";
import AbstractAdapter from "./abstractAdapter";
import { GetTagsResponse } from "./messages/tags";

class TagsAdapter extends AbstractAdapter {
    public getTags(): Promise<GetTagsResponse> {
        return this.requestWithAuth("tags", null, HttpMethods.GET);
    }
}

export default new TagsAdapter();
