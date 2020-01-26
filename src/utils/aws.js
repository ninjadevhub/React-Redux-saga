
import // @flow
/**
 * @module AWSCognito
 * @desc AWSCognito Login function
 */{
  CognitoUserPool,
  AuthenticationDetails,
  CognitoUser,
  CognitoRefreshToken,
} from 'amazon-cognito-identity-js';

import { appConfig } from '../config/appConfig';

const poolData = {
  UserPoolId: appConfig.userPoolId,
  ClientId: appConfig.clientId,
};

const getTokens = session => ({
  accessToken: session.getAccessToken().getJwtToken(),
  idToken: session.getIdToken().getJwtToken(),
  refreshToken: session.getRefreshToken().getToken(),
});

let cognitoUser = null;

// ----- use gloabl cognitoUser to successfully get session info -----
export const getCognitoUser = () => {
  if (!cognitoUser) {
    const userPool = new CognitoUserPool(poolData);
    const userData = {
      Username: localStorage.getItem('user.username'),
      Pool: userPool,
    };
    cognitoUser = new CognitoUser(userData);
  }

  return cognitoUser;
};

export const awsLoginRequest = action => new Promise((resolve, reject) => {
  const userPool = new CognitoUserPool(poolData);
  const userData = {
    Username: action.payload.username,
    Pool: userPool,
  };
  cognitoUser = new CognitoUser(userData);

  const authenticationData = {
    Username: action.payload.username,
    Password: action.payload.password,
  };


  const authenticationDetails = new AuthenticationDetails(authenticationData);

  cognitoUser.authenticateUser(authenticationDetails, {
    // eslint-disable-next-line
    onSuccess: (authenticateResult) => {
      resolve(authenticateResult);
    },

    onFailure: (err) => {
      reject(err);
    },

    // eslint-disable-next-line
    newPasswordRequired: (userAttributes, requiredAttributes) => {
      // User was signed up by an admin and must provide new
      // password and required attributes, if any, to complete
      // authentication.

      // userAttributes: object, which is the user's current profile. It will list all attributes that are associated with the user.
      // Required attributes according to schema, which don’t have any values yet, will have blank values.
      // requiredAttributes: list of attributes that must be set by the user along with new password to complete the sign-in.


      // Get these details and call
      // newPassword: password that user has given
      // attributesData: object with key as attribute name and value that the user has given.
      resolve({
        error: 'New password required',
        cognitoUser,
      });
    },

  });
});

export const refreshToken = () => {
  if (localStorage.token) {
    const RefreshToken = new CognitoRefreshToken({ RefreshToken: localStorage.refreshToken });

    return new Promise((resolve, reject) => {
      cognitoUser.refreshSession(RefreshToken, (err, session) => {
        if (err) {
          reject(err);
        } else {
          const tokens = getTokens(session);
          localStorage.setItem('token', tokens.accessToken);
          localStorage.setItem('idToken', tokens.idToken);
          localStorage.setItem('refreshToken', tokens.refreshToken);
          localStorage.setItem('expiryTime', Date.now() + (3600 * 1000));
          localStorage.setItem('isTokenRefreshing', 'false');
          resolve(tokens);
        }
      });
    });
  }
};

export const signOut = () => {
  // ----- use gloabl cognitoUser to successfully get session info -----
  // const userPool = new CognitoUserPool(poolData);
  // const userData = {
  //   Username: localStorage.getItem('user.username'),
  //   Pool: userPool,
  // };

  // const cognitoUserSignOut = new CognitoUser(userData);

  if (cognitoUser !== null) {
    cognitoUser.getSession((err, session) => {
      if (err) {
        console.log(err);
        return;
      }
      if (session.isValid()) {
        cognitoUser.signOut();
      }
    });
  }
};
