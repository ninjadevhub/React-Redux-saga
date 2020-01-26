// @flow
/**
 * @module Reducers/Applications
 * @desc Applications Reducer
 */

import { handleActions } from 'redux-actions';
import { ApplicationConstants } from 'constants/application';
import { requestPending, requestSuccess, requestFail } from 'components/Fetch';

const initialState = {
  data: null,
  application: {
  },
};

export default handleActions({
  [requestPending(ApplicationConstants.FETCH_APPLICATION_LIST)]: state => ({
    ...state,
  }),
  [requestSuccess(ApplicationConstants.FETCH_APPLICATION_LIST)]: (state, action) => ({
    ...state,
    ...action.payload,
  }),
  [requestFail(ApplicationConstants.FETCH_APPLICATION_LIST)]: (state, action) => ({
    ...state,
    error: action.payload,
  }),

  [requestPending(ApplicationConstants.FETCH_APPLICATION_FILTERS)]: state => ({
    ...state,
  }),
  [requestSuccess(ApplicationConstants.FETCH_APPLICATION_FILTERS)]: (state, action) => ({
    ...state,
    ...action.payload,
  }),
  [requestFail(ApplicationConstants.FETCH_APPLICATION_FILTERS)]: (state, action) => ({
    ...state,
    error: action.payload,
  }),
}, initialState);
