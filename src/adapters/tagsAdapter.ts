import { HttpMethods } from "@/enums/httpMethods";
import AbstractAdapter from "./abstractAdapter";
import { GetTagsResponse, DeleteTagsRequest } from "./messages/tags";

class TagsAdapter extends AbstractAdapter {
    public getTags(): Promise<GetTagsResponse> {
        return this.requestWithAuthBackGround("tags", null, HttpMethods.GET);
    }

    public deleteTags(instance: Vue, param: DeleteTagsRequest): Promise<void> {
        return this.requestWithAuth(instance, "tags/delete", param, HttpMethods.POST);
    }
}

export default new TagsAdapter();
