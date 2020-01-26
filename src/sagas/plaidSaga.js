import { call, takeEvery } from 'redux-saga/effects';
import { PlaidConstants } from 'constants/plaidConstants';
import { request } from 'components/Fetch';

function* startPlaid(action) {
  yield call(request({
    type: PlaidConstants.PLAID_START,
    method: 'POST',
    apiUrl: action.payload.apiUrl,
    url: action.payload.url,
  }), action);
}

function* succeedPlaid(action) {
  yield call(request({
    type: PlaidConstants.PLAID_SUCCESS,
    method: 'POST',
    apiUrl: action.payload.apiUrl,
    url: action.payload.url,
  }), action);
}

function* exitPlaid(action) {
  yield call(request({
    type: PlaidConstants.PLAID_EXIT,
    method: 'POST',
    apiUrl: action.payload.apiUrl,
    url: action.payload.url,
  }), action);
}

export default function* () {
  yield takeEvery(PlaidConstants.PLAID_START, startPlaid);
  yield takeEvery(PlaidConstants.PLAID_SUCCESS, succeedPlaid);
  yield takeEvery(PlaidConstants.PLAID_EXIT, exitPlaid);
}
