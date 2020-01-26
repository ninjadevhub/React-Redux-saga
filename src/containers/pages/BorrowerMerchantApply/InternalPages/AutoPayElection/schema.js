export default {
  bankName: [{
    rule: 'required',
    isValid: input => !!input || 'The input field is required',
  }],
  accountHolderName: [{
    rule: 'required',
    isValid: input => !!input || 'The input field is required',
  }],
  routingNumber: [
    {
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
    },
  ],
  accountNumber: [
    {
      rule: 'required',
      isValid: (input) => {
        if (!input) {
          return 'The input field is required';
        }

        return /^(\d)\1+$/.test(input) ? 'Account Number is not valid' : true;
      },
    },
  ],
  accountType: [{
    rule: 'required',
    error: 'The input field is required',
  }],
  isSelfSubmitted: [
    {
      rule: 'required',
      isValid: (input) => {
        if (!input) {
          return 'The input field is required';
        }
        return true;
      },
    },
  ],
};
