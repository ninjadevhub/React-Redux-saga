import { BannerConstants } from 'constants/banners';
import { createAction } from 'redux-actions';

export const getBanners = createAction(BannerConstants.FETCH_MERCHANT_BANNERS);
