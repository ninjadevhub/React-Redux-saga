import { PlaidConstants } from 'constants/plaidConstants';
import { createAction } from 'redux-actions';

export const startPlaid = createAction(PlaidConstants.PLAID_START);
export const succeedPlaid = createAction(PlaidConstants.PLAID_SUCCESS);
export const exitPlaid = createAction(PlaidConstants.PLAID_EXIT);
