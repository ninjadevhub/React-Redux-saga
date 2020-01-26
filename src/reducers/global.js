// @flow
/**
 * @module Reducers/Applications
 * @desc Applications Reducer
 */

import { handleActions } from 'redux-actions';
import get from 'lodash/get';
import { BorrowerApplyConstants } from 'constants/borrowerApply';
import { requestPending, requestSuccess, requestFail } from 'components/Fetch';

const initialState = {
  merchantId: null,
};

export default handleActions({
  [requestPending(BorrowerApplyConstants.FETCH_MERCHANT_ID)]: state => ({
    ...state,
  }),
  [requestSuccess(BorrowerApplyConstants.FETCH_MERCHANT_ID)]: (state, action) => ({
    ...state,
    merchantId: get(action.payload.data, [0, 'merchantId']),
  }),
  [requestFail(BorrowerApplyConstants.FETCH_MERCHANT_ID)]: (state, action) => ({
    ...state,
    error: action.payload,
  }),
}, initialState);
