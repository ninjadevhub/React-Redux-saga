import { call, takeEvery } from 'redux-saga/effects';
import { BorrowerApplyConstants } from 'constants/borrowerApply';
import { request } from 'components/Fetch';

function* checkMyRate(action) {
  yield call(request({
    type: BorrowerApplyConstants.CHECK_MY_RATE,
    method: 'POST',
    apiUrl: 'http://172.31.38.109:8065/application/workflow/dtm/start',
  }), action);
}

function* applyApplication(action) {
  yield call(request({
    type: BorrowerApplyConstants.APPLY_APPLICATION,
    method: 'POST',
    url: action.payload.url,
    apiUrl: action.payload.apiUrl,
  }), action);
}

function* fetchMerchantId(action) {
  yield call(request({
    type: BorrowerApplyConstants.FETCH_MERCHANT_ID,
    method: 'GET',
    url: action.payload.url,
    apiUrl: action.payload.apiUrl,
    success: (response) => {
      action.payload.success(response);
    },
  }), action);
}

export default function* () {
  yield takeEvery(BorrowerApplyConstants.CHECK_MY_RATE, checkMyRate);
  yield takeEvery(BorrowerApplyConstants.APPLY_APPLICATION, applyApplication);
  yield takeEvery(BorrowerApplyConstants.FETCH_MERCHANT_ID, fetchMerchantId);
}
