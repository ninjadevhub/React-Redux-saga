import { call, takeEvery } from 'redux-saga/effects';
import { MenuConstants } from 'constants/menu';
import { request } from 'components/Fetch';

function* getMerchantPlans(action) {
  yield call(request({
    type: MenuConstants.GET_MERCHANT_PLANS,
    method: 'GET',
    url: action.payload.url,
  }), action);
}

function* selectMerchantPlan(action) {
  yield call(request({
    type: MenuConstants.SELECT_MERCHANT_PLAN,
    method: 'PUT',
    url: action.payload.url,
  }), action);
}

export default function* () {
  yield takeEvery(MenuConstants.GET_MERCHANT_PLANS, getMerchantPlans);
  yield takeEvery(MenuConstants.SELECT_MERCHANT_PLAN, selectMerchantPlan);
}
