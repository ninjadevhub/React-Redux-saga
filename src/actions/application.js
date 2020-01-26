import { ApplicationConstants } from 'constants/application';
import { createAction } from 'redux-actions';

export const getApplications = createAction(ApplicationConstants.FETCH_APPLICATION_LIST);
export const getOffers = createAction(ApplicationConstants.FETCH_OFFERS_LIST);
export const getApplicationFilters = createAction(ApplicationConstants.FETCH_APPLICATION_FILTERS);
export const getMerchantDetail = createAction(ApplicationConstants.FETCH_MERCHANT_DETAIL);
export const getStats = createAction(ApplicationConstants.GET_STATS);
export const getFeatures = createAction(ApplicationConstants.GET_FEATURES);
export const getFundingInformation = createAction(ApplicationConstants.GET_FUNDING_INFORMATION);
export const refundRequest = createAction(ApplicationConstants.REFUND_REQUEST);
export const getRefundReasons = createAction(ApplicationConstants.GET_REFUND_REASONS);
export const getActiveContract = createAction(ApplicationConstants.GET_ACTIVE_CONTRACT);
export const getRefunds = createAction(ApplicationConstants.GET_REFUNDS);
export const requestIdByText = createAction(ApplicationConstants.REQUEST_ID_BY_TEXT);
export const getDocumentTags = createAction(ApplicationConstants.GET_DOCUMENT_TAGS);
export const postIdFront = createAction(ApplicationConstants.POST_ID_FRONT);
export const postIdBack = createAction(ApplicationConstants.POST_ID_BACK);
