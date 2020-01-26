import { call, put, takeEvery } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import get from 'lodash/get';

import { awsLoginRequest, signOut as signOutRequest } from 'utils/aws';
import { AuthConstants } from 'constants/auth';
import { BorrowerApplyConstants } from 'constants/borrowerApply';
import { requestPending, requestSuccess, requestFail } from 'components/Fetch';

function* signIn({ payload }) {
  try {
    yield put({
      type: requestPending(AuthConstants.AUTH_SIGN_IN),
    });
    const response = yield call(awsLoginRequest, { payload: payload.data });
    if (response.error === 'New password required') {
      yield put(push('/set-new-password'));
      yield put({
        type: requestFail(AuthConstants.AUTH_SIGN_IN),
        payload: new Error('New password required'),
      });
      localStorage.setItem('user.username', payload.data.username);
    } else {
      yield put({
        type: requestSuccess(AuthConstants.AUTH_SIGN_IN),
        payload: response,
      });
      localStorage.setItem('token', response.accessToken.jwtToken);
      localStorage.setItem('user.username', response.idToken.payload.preferred_username);
      localStorage.setItem('user.firstName', response.idToken.payload['custom:first_name'] || '');
      localStorage.setItem('user.lastName', response.idToken.payload['custom:last_name'] || '');
      localStorage.setItem('idToken', response.idToken.jwtToken);
      localStorage.setItem('refreshToken', response.refreshToken.token);
      localStorage.setItem('expiryTime', Date.now() + (3600 * 1000));
      localStorage.setItem('isTokenRefreshing', false);
      yield put({
        type: BorrowerApplyConstants.FETCH_MERCHANT_ID,
        payload: {
          url: `/merchants/?UserId=${response.idToken.payload.preferred_username}`,
          success: (res) => {
            console.log(res);
            if (get(res, 'data.0.status.code') === '1008' || get(res, 'data.0.status.code') === '1006' || get(res, 'data.0.status.code') === '1009') {
              localStorage.setItem('merchantId', res.data[0].merchantId);
              localStorage.setItem('businessName', res.data[0].businessName);
              localStorage.setItem('email', res.data[0].contacts.length > 0 ? res.data[0].contacts[0].email : res.data[0].email);
              payload.success('success');
            } else {
              localStorage.clear();
              payload.fail('Merchant is not valid!');
            }
          },
        },
      });
    }
  } catch (err) {
    yield put({
      type: requestFail(AuthConstants.AUTH_SIGN_IN),
      payload: err,
    });
    payload.fail(err);
  }
}

function* signOut() {
  signOutRequest();
  localStorage.clear();
  yield put({ type: requestSuccess(AuthConstants.AUTH_SIGN_OUT) });
  yield put(push('/'));
}

export default function* () {
  yield takeEvery(AuthConstants.AUTH_SIGN_IN, signIn);
  yield takeEvery(AuthConstants.AUTH_SIGN_OUT, signOut);
}
