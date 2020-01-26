import { call, takeEvery } from 'redux-saga/effects';
import { BannerConstants } from 'constants/banners';
import { request } from 'components/Fetch';

function* requestBannerAction(action) {
  yield call(request({
    type: BannerConstants.FETCH_MERCHANT_BANNERS,
    method: 'GET',
    url: action.payload.url,
  }), action);
}

export default function* () {
  yield takeEvery(BannerConstants.FETCH_MERCHANT_BANNERS, requestBannerAction);
}
