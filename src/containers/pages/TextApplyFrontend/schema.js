// import isValid from 'date-fns/is_valid';
import get from 'lodash/get';
import moment from 'moment';
import { numberUnmask, removeSpace, floatUnmask } from 'utils/masks';
import { validateEmail } from 'utils/helper';

export default {
  requestedAmount: [{
    rule: 'required',
    isValid: (input) => {
      if (!input) {
        return 'The input field is required';
      }

      return ((Number(floatUnmask(input)) < 1000) || Number(floatUnmask(input)) > 35000) ? 'Loan Amount should be between $1,000.00 and $35,000.00' : true;
    },
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
  firstName: [{
    rule: 'required',
    isValid: (input) => {
      if (!input || removeSpace(input).length === 0) {
        return 'The input field is required';
      }
      return true;
    },
  }],
  lastName: [{
    rule: 'required',
    isValid: (input) => {
      if (!input || removeSpace(input).length === 0) {
        return 'The input field is required';
      }
      return true;
    },
  }],
  stateOfResidence: [{
    rule: 'required',
    isValid: input => !!input || 'The input field is required',
  }],
  email: [
    {
      rule: 'required',
      isValid: (input) => {
        if (!input) {
          return 'The input field is required';
        }

        const blokingEmails = [
          'none@none.com',
          'noemail@noemail.com',
          'noemail@gmail.com',
          'noemail@email.com',
          'none@noemail.COM',
          'none@gmail.com',
          'none@yahoo.com',
          'no@no.com',
          'no@email.com',
          'noemail@yahoo.com',
          'test@test.com',
          'na@na.com',
          'noname@gmail.com',
          'no@gmail.com',
          'noemail@mail.com',
          'test@email.com',
          'unknown@yahoo.com',
          'non@non.com',
          'noemal@noemail.com',
          'none@email.com',
          'noname@email.com',
          'noemail@no.com',
          'non@none.com',
          'email@email.com',
          'nomail@gmail.com',
          'noemail@gimail.com',
          'noemail@aol.com',
          'na@gmail.com',
          'noemail@gmai.com',
          'noemail@noemai.com',
          'none@aol.com',
          'na@na.com',
          'noemail@aol.com',
        ];

        return (
          (blokingEmails.indexOf(`${input}`.toLowerCase()) !== -1) ||
          !validateEmail(input)
        ) ? 'Email is not valid' : true;
      },
    },
  ],
  phoneNumber: [{
    rule: 'required',
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

      return (
        numberUnmask(input).length < 10 ||
        phoneNumbers.indexOf(input || '') !== -1 ||
        (input && input.charAt(1) === '0') ||
        (input && input.charAt(1) === '1') ||
        (input && input.substring(6) === '000-0000')
      ) ? 'Phone number is not valid' : true;
    },
  }],
  hasApplicationConsented: [{
    rule: 'required',
    isValid: input => !!input || 'Required',
  }],
  signatureName: [{
    rule: 'required',
    isValid: (input, err, opt, formData) => {
      if (!input) {
        return 'The input field is required';
      }
      return (`${input}`.toLowerCase().trim() === `${(get(formData, 'firstName') || '').toLowerCase().trim()} ${(get(formData, 'lastName') || '').toLowerCase().trim()}`) || 'Signature does not match the first and last name';
    },
  }],
  signatureDate: [{
    rule: 'required',
    isValid: input => !!input || 'The input field is required',
  }],
};
