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
    fileName: string;
}

export interface PutPictureRequest {
    tags: Array<string>;
}

export interface GetPictureResponse {
    picture: string;
}
