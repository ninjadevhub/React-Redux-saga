import { call, takeEvery } from 'redux-saga/effects';
import { WorkflowConstants } from 'constants/workflowConstants';
import { request } from 'components/Fetch';

function* checkinAction(action) {
  yield call(request({
    type: WorkflowConstants.CHECKIN_ACTION,
    method: 'POST',
    url: action.payload.url,
  }), action);
}

function* nextAction(action) {
  yield call(request({
    type: WorkflowConstants.NEXT_ACTION,
    method: 'PUT',
    url: action.payload.url,
  }), action);
}

function* updateOffer(action) {
  yield call(request({
    type: WorkflowConstants.UPDATE_OFFER,
    method: 'PUT',
    url: action.payload.url,
  }), action);
}

function* checkPrviousAction(action) {
  yield call(request({
    type: WorkflowConstants.PREVIOUS_ACTION,
    method: 'PUT',
    url: action.payload.url,
  }), action);
}

function* getIPAddress(action) {
  yield call(request({
    type: WorkflowConstants.GET_IP_ADDRESS,
    method: 'GET',
    apiUrl: 'https://api.ipify.org?format=json&callback=?',
  }), action);
}

function* sendContractToConsumer(action) {
  yield call(request({
    type: WorkflowConstants.SEND_CONTRACT_TO_CONSUMER,
    method: 'POST',
    url: action.payload.url,
  }), action);
}

export default function* () {
  yield takeEvery(WorkflowConstants.CHECKIN_ACTION, checkinAction);
  yield takeEvery(WorkflowConstants.NEXT_ACTION, nextAction);
  yield takeEvery(WorkflowConstants.UPDATE_OFFER, updateOffer);
  yield takeEvery(WorkflowConstants.PREVIOUS_ACTION, checkPrviousAction);
  yield takeEvery(WorkflowConstants.GET_IP_ADDRESS, getIPAddress);
  yield takeEvery(WorkflowConstants.SEND_CONTRACT_TO_CONSUMER, sendContractToConsumer);
}
