import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserSession,
  ICognitoUserPoolData,
} from "amazon-cognito-identity-js";
import * as AWS from "aws-sdk";
import { CognitoIdentityCredentials } from "aws-sdk";
import { environment } from "../consts/consts";
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

  signUp(instance: Vue, username: string, password: string) {
    instance.$store.commit("setLoading", true);
    const dataEmail = { Name: "email", Value: username };
    const attributeList: Array<CognitoUserAttribute> = [];
    attributeList.push(new CognitoUserAttribute(dataEmail));
    return new Promise((resolve, reject) => {
      this.userPool.signUp(
        username,
        password,
        attributeList,
        [],
        (err, result) => {
          if (err) {
            instance.$store.commit("setLoading", false);
            reject(err);
          } else {
            instance.$store.commit("setLoading", false);
            resolve(result);
          }
        }
      );
    });
  }

  confirmation(instance: Vue, username: string, confirmationCode: string) {
    instance.$store.commit("setLoading", true);
    const userData = { Username: username, Pool: this.userPool };
    const cognitoUser = new CognitoUser(userData);
    return new Promise((resolve, reject) => {
      cognitoUser.confirmRegistration(confirmationCode, true, (err, result) => {
        if (err) {
          instance.$store.commit("setLoading", false);
          reject(err);
        } else {
          instance.$store.commit("setLoading", false);
          resolve(result);
        }
      });
    });
  }

  login(instance: Vue, username: string, password: string) {
    instance.$store.commit("setLoading", true);
    const userData = { Username: username, Pool: this.userPool };
    const cognitoUser = new CognitoUser(userData);
    const authenticationData = { Username: username, Password: password };
    const authenticationDetails = new AuthenticationDetails(authenticationData);
    return new Promise<CognitoUserSession>((resolve, reject) => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result: CognitoUserSession) => {
          const creds: CognitoIdentityCredentials = this.buildCognitoCreds(
            result
          );
          AWS.config.credentials = creds;
          this.cognitoCreds = creds;
          SessionStorageAdapter.postLogin(result.getIdToken().getJwtToken());
          instance.$store.commit("setLoading", false);
          resolve(result);
        },
        onFailure: (err) => {
          instance.$store.commit("setLoading", false);
          reject(err);
        },
      });
    });
  }

  private buildCognitoCreds(
    session: CognitoUserSession
  ): CognitoIdentityCredentials {
    const logins: AWS.CognitoIdentity.LoginsMap = {};
    const url = `cognito-idp.${environment.region}.amazonaws.com/${environment.userPoolId}`;
    logins[url] = session.getIdToken().getJwtToken();
    return new AWS.CognitoIdentityCredentials({
      IdentityPoolId: environment.identityPoolId,
      Logins: logins,
    });
  }

  logout(instance: Vue) {
    instance.$store.commit("setLoading", true);
    this.userPool.getCurrentUser()?.signOut();
    SessionStorageAdapter.postLogout();
    instance.$store.commit("setLoading", false);
  }

  getCredentials(): Promise<AWS.CognitoIdentityCredentials> {
    const cognitoUser = this.userPool.getCurrentUser();
    return new Promise((resolve, reject) => {
      if (cognitoUser === null) {
        reject(cognitoUser);
      } else {
        cognitoUser.getSession(
          (err: Error | null, session: CognitoUserSession | null) => {
            if (err) {
              reject(err);
            } else {
              if (session) {
                const creds = this.buildCognitoCreds(session);
                AWS.config.credentials = creds;
                resolve(creds);
              }
              // callbackの作り上ここには入らない
            }
          }
        );
      }
    });
  }

  isAuthenticated(): Promise<CognitoUserSession> {
    const cognitoUser = this.userPool.getCurrentUser();
    return new Promise((resolve, reject) => {
      if (cognitoUser === null) {
        reject(cognitoUser);
      } else {
        cognitoUser.getSession(
          (err: Error | null, session: CognitoUserSession | null) => {
            if (err) {
              reject(err);
            } else {
              if (session) {
                if (session.isValid()) {
                  resolve(session);
                } else {
                  reject(new Error("session invalidated"));
                }
              }
              // callbackの作り上ここには入らない
            }
          }
        );
      }
    });
  }

  async changePassword(
    instance: Vue,
    oldPassword: string,
    newPassword: string
  ): Promise<void> {
    instance.$store.commit("setLoading", true);
    const cognitoUser = this.userPool.getCurrentUser();
    return new Promise((resolve, reject) => {
      if (cognitoUser === null) {
        instance.$store.commit("setLoading", false);
        reject(cognitoUser);
      } else {
        // TODO 共通化
        cognitoUser.getSession((error: Error) => {
          if (error) {
            instance.$store.commit("setLoading", false);
            reject(error);
          }
        });
        cognitoUser.changePassword(oldPassword, newPassword, (error) => {
          if (error) {
            instance.$store.commit("setLoading", false);
            reject(error);
          } else {
            instance.$store.commit("setLoading", false);
            resolve();
          }
        });
      }
    });
  }
}

export default new CognitoService();
