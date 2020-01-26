import { BorrowerApplyConstants } from 'constants/borrowerApply';
import { createAction } from 'redux-actions';

export const checkMyRate = createAction(BorrowerApplyConstants.CHECK_MY_RATE);
export const applyApplication = createAction(BorrowerApplyConstants.APPLY_APPLICATION);
export const getMerchantId = createAction(BorrowerApplyConstants.FETCH_MERCHANT_ID);
