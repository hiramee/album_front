import {
    CognitoUserPool,
    CognitoUserAttribute,
    CognitoUser,
    AuthenticationDetails,
    CognitoUserSession,
    ICognitoUserPoolData,
} from 'amazon-cognito-identity-js';
import * as AWS from 'aws-sdk';
import { CognitoIdentityCredentials } from 'aws-sdk';
import { environment } from '../consts/consts';
import { SessionStorageAdapter } from "@/adapters/SessionStorageAdapter";

class CognitoService {
    userPool: CognitoUserPool;

    poolData: ICognitoUserPoolData;

    cognitoCreds: CognitoIdentityCredentials | undefined;

    constructor() {
        AWS.config.region = environment.region;
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: environment.identityPoolId,
        });
        this.poolData = {
            UserPoolId: environment.userPoolId,
            ClientId: environment.clientId,
        };
        this.userPool = new CognitoUserPool(this.poolData);
    }

    signUp(username: string, password: string) {
        const dataEmail = { Name: 'email', Value: username };
        const attributeList: Array<CognitoUserAttribute> = [];
        attributeList.push(new CognitoUserAttribute(dataEmail));
        return new Promise((resolve, reject) => {
            this.userPool.signUp(username, password, attributeList, [], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    confirmation(username: string, confirmationCode: string) {
        const userData = { Username: username, Pool: this.userPool };
        const cognitoUser = new CognitoUser(userData);
        return new Promise((resolve, reject) => {
            cognitoUser.confirmRegistration(confirmationCode, true, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    login(username: string, password: string) {
        const userData = { Username: username, Pool: this.userPool };
        const cognitoUser = new CognitoUser(userData);
        const authenticationData = { Username: username, Password: password };
        const authenticationDetails = new AuthenticationDetails(authenticationData);
        return new Promise<CognitoUserSession>((resolve, reject) => {
            cognitoUser.authenticateUser(authenticationDetails, {
                onSuccess: (result: CognitoUserSession) => {
                    const creds: CognitoIdentityCredentials = this.buildCognitoCreds(result);
                    AWS.config.credentials = creds;
                    this.cognitoCreds = creds;
                    SessionStorageAdapter.postLogin(result.getIdToken().getJwtToken(), creds.identityId);
                    resolve(result);
                },
                onFailure: (err) => {
                    reject(err);
                },
            });
        });
    }

    private buildCognitoCreds(session: CognitoUserSession): CognitoIdentityCredentials {
        const logins: AWS.CognitoIdentity.LoginsMap = {};
        const url = `cognito-idp.${environment.region}.amazonaws.com/${environment.userPoolId}`;
        logins[url] = session.getIdToken().getJwtToken();
        return new AWS.CognitoIdentityCredentials({
            IdentityPoolId: environment.identityPoolId,
            Logins: logins,
        });
    }

    logout() {
        this.userPool.getCurrentUser()?.signOut();
        SessionStorageAdapter.postLogout();
    }

    getCredentials(): Promise<AWS.CognitoIdentityCredentials> {
        const cognitoUser = this.userPool.getCurrentUser();
        return new Promise((resolve, reject) => {
            if (cognitoUser === null) {
                reject(cognitoUser);
            } else {
                cognitoUser.getSession((err: any, session: CognitoUserSession) => {
                    if (err) {
                        reject(err);
                    } else {
                        const creds = this.buildCognitoCreds(session);
                        AWS.config.credentials = creds;
                        resolve(creds);
                    }
                });
            }
        });
    }

    isAuthenticated(): Promise<any> {
        const cognitoUser = this.userPool.getCurrentUser();
        return new Promise((resolve, reject) => {
            if (cognitoUser === null) {
                reject(cognitoUser);
            } else {
                cognitoUser.getSession((err: any, session: { isValid: () => any; }) => {
                    if (err) {
                        reject(err);
                    } else if (!session.isValid()) {
                        resolve(session);
                    }
                });
            }
        });
    }

    async changePassword(oldPassword: string, newPassword: string): Promise<void> {
        const cognitoUser = this.userPool.getCurrentUser();
        return new Promise((resolve, reject) => {
            if (cognitoUser === null) {
                reject(cognitoUser);
            } else {
                // TODO 共通化
                cognitoUser.getSession((error: Error) => {
                    if (error) {
                        reject(error);
                    }
                });
                cognitoUser.changePassword(oldPassword, newPassword, (error) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve();
                    }
                });
            }
        });
    }
}

export default new CognitoService();
