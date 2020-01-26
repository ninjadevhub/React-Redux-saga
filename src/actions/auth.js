import { AuthConstants } from 'constants/auth';
import { createAction } from 'redux-actions';

export const signIn = createAction(AuthConstants.AUTH_SIGN_IN);
export const signOut = createAction(AuthConstants.AUTH_SIGN_OUT);
