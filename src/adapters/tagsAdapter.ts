import { HttpMethods } from "@/enums/httpMethods";
import AbstractAdapter from "./abstractAdapter";
import { GetTagsResponse, DeleteTagsRequest } from "./messages/tags";

class TagsAdapter extends AbstractAdapter {
    public getTags(): Promise<GetTagsResponse> {
        return this.requestWithAuth("tags", null, HttpMethods.GET);
    }

    public deleteTags(param: DeleteTagsRequest): Promise<void> {
        return this.requestWithAuth("tags/delete", param, HttpMethods.POST);
    }
}

export default new TagsAdapter();
