import { MenuConstants } from 'constants/menu';
import { createAction } from 'redux-actions';

export const getMerchantPlans = createAction(MenuConstants.GET_MERCHANT_PLANS);
export const selectMerchantPlan = createAction(MenuConstants.SELECT_MERCHANT_PLAN);
