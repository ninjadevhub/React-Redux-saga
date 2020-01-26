// @flow
/**
 * @module Reducers/Workflows
 * @desc Workflows Reducer
 */

import { handleActions } from 'redux-actions';
import { WorkflowConstants } from 'constants/workflowConstants';
import { requestPending, requestSuccess, requestFail } from 'components/Fetch';

const initialState = {
};

export default handleActions({
  [requestPending(WorkflowConstants.CHECKIN_ACTION)]: state => ({
    ...state,
  }),
  [requestSuccess(WorkflowConstants.CHECKIN_ACTION)]: (state, action) => ({
    ...state,
    ...action.payload,
  }),
  [requestFail(WorkflowConstants.CHECKIN_ACTION)]: (state, action) => ({
    ...state,
    error: action.payload,
  }),

  [requestPending(WorkflowConstants.NEXT_ACTION)]: state => ({
    ...state,
  }),
  [requestSuccess(WorkflowConstants.NEXT_ACTION)]: (state, action) => ({
    ...state,
    ...action.payload,
  }),
  [requestFail(WorkflowConstants.NEXT_ACTION)]: (state, action) => ({
    ...state,
    error: action.payload,
  }),

  [requestPending(WorkflowConstants.PREVIOUS_ACTION)]: state => ({
    ...state,
  }),
  [requestSuccess(WorkflowConstants.PREVIOUS_ACTION)]: (state, action) => ({
    ...state,
    ...action.payload,
  }),
  [requestFail(WorkflowConstants.PREVIOUS_ACTION)]: (state, action) => ({
    ...state,
    error: action.payload,
  }),
}, initialState);
