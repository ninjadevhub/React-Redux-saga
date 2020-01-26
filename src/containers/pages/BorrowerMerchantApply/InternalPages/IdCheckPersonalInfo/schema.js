import { removeSpace, removeUnderline, numberUnmask } from 'utils/masks';

export default {
  streetAddress1: ['required'],
  city: ['required'],
  state: ['required'],
  zipCode: [{
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
  Ssn4: [{
    rule: 'required',
    error: 'The input field is required',
    isValid: (input) => {
      if (!input || removeSpace(input).length === 0) {
        return 'The input field is required';
      } else if (removeUnderline(input).length !== 4) {
        return 'Invalid SSN';
      }
      return true;
    },
  }],
  phoneNumber: [
    {
      rule: 'required',
      error: 'The input field is required',
      isValid: (input) => {
        const phoneNumbers = [
          '(111) 111-1111',
          '(222) 222-2222',
          '(333) 333-3333',
          '(444) 444-4444',
          '(555) 555-5555',
          '(666) 666-6666',
          '(777) 777-7777',
          '(999) 999-9999',
        ];

        if (!input) {
          return 'The input field is required';
        }

        if (input) {
          return (
            numberUnmask(input).length < 10 ||
            phoneNumbers.indexOf(input || '') !== -1 ||
            (input && input.charAt(1) === '0') ||
            (input && input.charAt(1) === '1') ||
            (input && input.substring(6) === '000-0000')
          ) ? 'Phone number is not valid' : true;
        }
      },
    },
  ],
};
