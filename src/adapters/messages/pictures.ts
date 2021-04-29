export interface PostPictureRequest {
    tags: Array<String>;
    picture: string;
    ext: string;
}

export interface GetPicturesResponse {
    pictures: Array<PicturesResponseItem>;
}

export interface PicturesResponseItem {
    id: string;
    tags: Array<String>;
    picture: string;
    fileName: string;
}

export interface PutPictureRequest {
    tags: Array<String>;
}