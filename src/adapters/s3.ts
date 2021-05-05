import * as AWS from 'aws-sdk';
import { environment } from '../consts/consts';
import CognitoService from './cognito';

class S3Service {
    s3;

    constructor() {
        CognitoService.getCredentials().then((data: AWS.CognitoIdentityCredentials) => {
            AWS.config.credentials = data;

        }).catch((err: any) => {
            console.log(err);
        });
        const clientParams = {
            region: environment.region,
            apiVersion: '2006-03-01',
            params: { Bucket: environment.bucketName },
        };
        this.s3 = new AWS.S3(clientParams);
    }

    getFile(key: string): Promise<AWS.S3.GetObjectOutput> {
        const params = {
            Bucket: environment.bucketName,
            Key: key,
        };
        return this.s3.getObject(params).promise();
    }
}

export default new S3Service();
