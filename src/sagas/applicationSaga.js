import { call, takeEvery } from 'redux-saga/effects';
import { ApplicationConstants } from 'constants/application';
import { request } from 'components/Fetch';

function* fetchApplicationList(action) {
  yield call(request({
    type: ApplicationConstants.FETCH_APPLICATION_LIST,
    method: 'GET',
    url: action.payload.url,
  }), action);
}

function* fetchOffersList(action) {
  yield call(request({
    type: ApplicationConstants.FETCH_FETCH_LIST,
    method: 'GET',
    url: action.payload.url,
  }), action);
}

function* fetchApplicationFilterList(action) {
  yield call(request({
    type: ApplicationConstants.FETCH_APPLICATION_FILTERS,
    method: 'GET',
    url: action.payload.url,
    payloadOnSuccess: data => ({
      filters: [
        ...data.filters[0].filters,
      ],
    }),
  }), action);
}

function* fetchMerchantDetail(action) {
  yield call(request({
    type: ApplicationConstants.FETCH_MERCHANT_DETAIL,
    method: 'GET',
    url: action.payload.url,
  }), action);
}

function* getStats(action) {
  yield call(request({
    type: ApplicationConstants.GET_STATS,
    method: 'GET',
    url: action.payload.url,
  }), action);
}

function* getFeatures(action) {
  yield call(request({
    type: ApplicationConstants.GET_FEATURES,
    method: 'GET',
    url: action.payload.url,
  }), action);
}

function* getFundingInformation(action) {
  yield call(request({
    type: ApplicationConstants.GET_FUNDING_INFORMATION,
    method: 'GET',
    url: action.payload.url,
  }), action);
}

function* refundRequest(action) {
  yield call(request({
    type: ApplicationConstants.REFUND_REQUEST,
    method: 'POST',
    url: action.payload.url,
  }), action);
}

function* getRefundReasons(action) {
  yield call(request({
    type: ApplicationConstants.GET_REFUND_REASONS,
    method: 'GET',
    url: action.payload.url,
  }), action);
}

function* getActiveContract(action) {
  yield call(request({
    type: ApplicationConstants.GET_ACTIVE_CONTRACT,
    method: 'GET',
    url: action.payload.url,
  }), action);
}

function* getRefunds(action) {
  yield call(request({
    type: ApplicationConstants.GET_REFUND_REASONS,
    method: 'GET',
    url: action.payload.url,
  }), action);
}

function* requestIdByText(action) {
  yield call(request({
    type: ApplicationConstants.REQUEST_ID_BY_TEXT,
    method: 'POST',
    url: action.payload.url,
  }), action);
}

function* getDocumentTags(action) {
  yield call(request({
    type: ApplicationConstants.GET_DOCUMENT_TAGS,
    method: 'GET',
    url: action.payload.url,
  }), action);
}

function* postIdFront(action) {
  yield call(request({
    type: ApplicationConstants.POST_ID_FRONT,
    method: 'POST',
    url: action.payload.url,
  }), action);
}

function* postIdBack(action) {
  yield call(request({
    type: ApplicationConstants.POST_ID_BACK,
    method: 'POST',
    url: action.payload.url,
  }), action);
}

export default function* () {
  yield takeEvery(ApplicationConstants.FETCH_APPLICATION_LIST, fetchApplicationList);
  yield takeEvery(ApplicationConstants.FETCH_OFFERS_LIST, fetchOffersList);
  yield takeEvery(ApplicationConstants.FETCH_APPLICATION_FILTERS, fetchApplicationFilterList);
  yield takeEvery(ApplicationConstants.FETCH_MERCHANT_DETAIL, fetchMerchantDetail);
  yield takeEvery(ApplicationConstants.GET_STATS, getStats);
  yield takeEvery(ApplicationConstants.GET_FEATURES, getFeatures);
  yield takeEvery(ApplicationConstants.GET_FUNDING_INFORMATION, getFundingInformation);
  yield takeEvery(ApplicationConstants.REFUND_REQUEST, refundRequest);
  yield takeEvery(ApplicationConstants.GET_REFUND_REASONS, getRefundReasons);
  yield takeEvery(ApplicationConstants.GET_ACTIVE_CONTRACT, getActiveContract);
  yield takeEvery(ApplicationConstants.GET_REFUNDS, getRefunds);
  yield takeEvery(ApplicationConstants.REQUEST_ID_BY_TEXT, requestIdByText);
  yield takeEvery(ApplicationConstants.GET_DOCUMENT_TAGS, getDocumentTags);
  yield takeEvery(ApplicationConstants.POST_ID_FRONT, postIdFront);
  yield takeEvery(ApplicationConstants.POST_ID_BACK, postIdBack);
}
