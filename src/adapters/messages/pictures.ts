export interface PostPictureRequest {
    tags: Array<string>;
    picture: string;
    ext: string;
}

export interface GetPicturesResponse {
    pictures: Array<PicturesResponseItem>;
}

export interface PicturesResponseItem {
    id: string;
    tags: Array<string>;
    objectKey: string;
    fileName: string;
}

export interface PutPictureRequest {
    tags: Array<String>;
}
