// import moment from 'moment';
// import { numberUnmask } from 'utils/masks';

export default {
  bankAccountFirstName: [{
    rule: 'required',
    isValid: input => !!`${input}`.trim() || 'The input field is required',
  }],
  bankAccountLastName: [{
    rule: 'required',
    isValid: input => !!`${input}`.trim() || 'The input field is required',
  }],
  routingNumber: [{
    rule: 'required',
    isValid: (input) => {
      if (!input) {
        return 'The input field is required';
      }

      if (`${input}`.replace('_', '').length < 9) {
        return 'Routing Number is not valid';
      }

      return /^(\d)\1+$/.test(input) ? 'Routing Number is not valid' : true;
    },
  }],
  bankAccountNumber: [{
    rule: 'required',
    isValid: (input) => {
      if (!input) {
        return 'The input field is required';
      }
      return /^(\d)\1+$/.test(input) ? 'Account Number is not valid' : true;
    },
  }],
};
