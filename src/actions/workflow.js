import { WorkflowConstants } from 'constants/workflowConstants';
import { createAction } from 'redux-actions';

export const checkinAction = createAction(WorkflowConstants.CHECKIN_ACTION);
export const nextAction = createAction(WorkflowConstants.NEXT_ACTION);
export const updateOffer = createAction(WorkflowConstants.UPDATE_OFFER);
export const checkPreviousAction = createAction(WorkflowConstants.PREVIOUS_ACTION);
export const getIPAddress = createAction(WorkflowConstants.GET_IP_ADDRESS);
export const sendContractToConsumer = createAction(WorkflowConstants.SEND_CONTRACT_TO_CONSUMER);
