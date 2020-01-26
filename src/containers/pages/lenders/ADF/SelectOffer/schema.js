import moment from 'moment';
import { numberUnmask } from 'utils/masks';

export default {
  amountFinanced: [{
    rule: 'required',
    isValid: input => !!input || 'The input field is required',
  }],
  payoutAmount: [{
    rule: 'required',
    isValid: input => !!input || 'The input field is required',
  }],
  serviceDate: [{
    rule: 'required',
    isValid: (input) => {
      if (!input) {
        return 'The input field is required';
      }

      if (numberUnmask(input).length < 8) {
        return 'Date of Service is not valid';
      }

      if (!moment(input, 'MM/DD/YYYY').isValid()) {
        return 'Date of Service is not valid';
      }
      return true;
    },
  }],
  isChecked1: [{
    rule: 'required',
    isValid: input => !!input || 'The input field is required',
  }],
  isChecked2: [{
    rule: 'required',
    isValid: input => !!input || 'The input field is required',
  }],
  signature: [{
    rule: 'required',
    isValid: input => !!input || 'The input field is required',
  }],
};
