import { call, takeEvery } from 'redux-saga/effects';
import { BrochureConstants } from 'constants/brochure';
import { request } from 'components/Fetch';

function* requestBrochureAction(action) {
  yield call(request({
    type: BrochureConstants.REQUEST_BROCHURE,
    method: 'POST',
    url: action.payload.url,
  }), action);
}

export default function* () {
  yield takeEvery(BrochureConstants.REQUEST_BROCHURE, requestBrochureAction);
}
