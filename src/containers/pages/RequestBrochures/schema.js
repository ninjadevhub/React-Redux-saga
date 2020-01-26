import { removeSpace, removeUnderline } from 'utils/masks';

export default {
  businessName: ['required'],
  contactName: ['required'],
  requestType: ['required'],
  address: [{
    rule: 'required',
    error: 'The input field is required',
  }],
  city: [{
    rule: 'required',
    error: 'The input field is required',
  }],
  state: [{
    rule: 'required',
    error: 'The input field is required',
  }],
  zip: [{
    rule: 'required',
    error: 'The input field is required',
    isValid: (input) => {
      if (!input || removeSpace(input).length === 0) {
        return 'The input field is required';
      } else if (removeUnderline(input).length !== 5) {
        return 'Invalid zipcode';
      }
      return true;
    },
  }],
};
