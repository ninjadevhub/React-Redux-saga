import moment from 'moment';
import { numberUnmask, removeSpace } from 'utils/masks';

export default {
  // approximateIncomeEndDate: [{
  //   rule: 'required',
  //   isValid: (input) => {
  //     if (!input) {
  //       return 'The input field is required';
  //     }

  //     if (numberUnmask(input).length < 8) {
  //       return 'Date of Service is not valid';
  //     }

  //     if (!moment(input, 'MM/DD/YYYY').isValid()) {
  //       return 'Date of Service is not valid';
  //     }
  //     return true;
  //   },
  // }],
  sourceOfIncome: [{
    rule: 'required',
    isValid: input => !!input || 'The input field is required',
  }],
  additionalSourceOfIncome: [{
    isValid: (input, err, opt, formData) => {
      if (formData.isisAdditionalIncomeOpen) {
        if (!input) {
          return 'The input field is required';
        }
      }
      return true;
    },
  }],
  additionalSourceOfIncome1: [{
    isValid: (input, err, opt, formData) => {
      if (formData.isisAdditionalIncomeOpen1) {
        if (!input) {
          return 'The input field is required';
        }
      }
      return true;
    },
  }],
  employerName1: [{
    isValid: (input, err, opt, formData) => {
      if (
        formData.sourceOfIncome === 1 ||
        formData.sourceOfIncome === 2
      ) {
        if (!input || removeSpace(input).length === 0) {
          return 'The input field is required';
        }
      }
      return true;
    },
  }],
  employerName2: [{
    isValid: (input, err, opt, formData) => {
      if (
        formData.isAdditionalIncomeOpen && (
          formData.additionalSourceOfIncome === 1 ||
          formData.additionalSourceOfIncome === 2
        )
      ) {
        if (!input || removeSpace(input).length === 0) {
          return 'The input field is required';
        }
      }
      return true;
    },
  }],
  employerName3: [{
    isValid: (input, err, opt, formData) => {
      if (
        formData.isAdditionalIncomeOpen1 && (
          formData.additionalSourceOfIncome1 === 1 ||
          formData.additionalSourceOfIncome1 === 2
        )
      ) {
        if (!input || removeSpace(input).length === 0) {
          return 'The input field is required';
        }
      }
      return true;
    },
  }],
  otherDescription1: [{
    isValid: (input, err, opt, formData) => {
      if (
        formData.sourceOfIncome === 3 ||
        formData.sourceOfIncome === 4
      ) {
        if (!input || removeSpace(input).length === 0) {
          return 'The input field is required';
        }
      }
      return true;
    },
  }],
  otherDescription2: [{
    isValid: (input, err, opt, formData) => {
      if (
        formData.isAdditionalIncomeOpen && (
          formData.additionalSourceOfIncome === 3 ||
          formData.additionalSourceOfIncome === 4
        )
      ) {
        if (!input || removeSpace(input).length === 0) {
          return 'The input field is required';
        }
      }
      return true;
    },
  }],
  otherDescription3: [{
    isValid: (input, err, opt, formData) => {
      if (
        formData.isAdditionalIncomeOpen1 && (
          formData.additionalSourceOfIncome1 === 3 ||
          formData.additionalSourceOfIncome1 === 4
        )
      ) {
        if (!input || removeSpace(input).length === 0) {
          return 'The input field is required';
        }
      }
      return true;
    },
  }],
  monthlyIncomeAfterTaxes1: [{
    rule: 'required',
    error: 'The input field is required',
  }],
  monthlyIncomeAfterTaxes2: [{
    isValid: (input, err, opt, formData) => {
      if (formData.isAdditionalIncomeOpen) {
        if (!input) {
          return 'The input field is required';
        }
      }
      return true;
    },
  }],
  monthlyIncomeAfterTaxes3: [{
    isValid: (input, err, opt, formData) => {
      if (formData.isAdditionalIncomeOpen1) {
        if (!input) {
          return 'The input field is required';
        }
      }
      return true;
    },
  }],
  employedSince1: [{
    isValid: (input, err, opt, formData) => {
      if (
        formData.sourceOfIncome === 1 ||
        formData.sourceOfIncome === 2
      ) {
        if (!input) {
          return 'The input field is required';
        }
      }
      return true;
    },
  }],
  employedSince2: [{
    isValid: (input, err, opt, formData) => {
      if (
        formData.isAdditionalIncomeOpen && (
          formData.additionalSourceOfIncome === 1 ||
          formData.additionalSourceOfIncome === 2
        )
      ) {
        if (!input) {
          return 'The input field is required';
        }
      }
      return true;
    },
  }],
  employedSince3: [{
    isValid: (input, err, opt, formData) => {
      if (
        formData.isAdditionalIncomeOpen1 && (
          formData.additionalSourceOfIncome1 === 1 ||
          formData.additionalSourceOfIncome1 === 2
        )
      ) {
        if (!input) {
          return 'The input field is required';
        }
      }
      return true;
    },
  }],
  receivingIncomeAfter3Years1: [{
    isValid: (input, err, opt, formData) => {
      if (formData.sourceOfIncome === 3) {
        if (!input) {
          return 'The input field is required';
        }
      }
      return true;
    },
  }],
  receivingIncomeAfter3Years2: [{
    isValid: (input, err, opt, formData) => {
      if (formData.isAdditionalIncomeOpen && (formData.additionalSourceOfIncome === 3)) {
        if (!input) {
          return 'The input field is required';
        }
      }
      return true;
    },
  }],
  receivingIncomeAfter3Years3: [{
    isValid: (input, err, opt, formData) => {
      if (formData.isAdditionalIncomeOpen1 && (formData.additionalSourceOfIncome1 === 3)) {
        if (!input) {
          return 'The input field is required';
        }
      }
      return true;
    },
  }],
  incomeEndDate1: [{
    isValid: (input, err, opt, formData) => {
      if (formData.sourceOfIncome === 3) {
        if (!input) {
          return 'The input field is required';
        }

        if (numberUnmask(input).length < 8) {
          return 'Date of Service is not valid';
        }

        if (!moment(input, 'MM/DD/YYYY').isValid()) {
          return 'Date of Service is not valid';
        }
      }
      return true;
    },
  }],
  incomeEndDate2: [{
    isValid: (input, err, opt, formData) => {
      if (formData.isAdditionalIncomeOpen && (formData.additionalSourceOfIncome === 3)) {
        if (!input) {
          return 'The input field is required';
        }

        if (numberUnmask(input).length < 8) {
          return 'Date of Service is not valid';
        }

        if (!moment(input, 'MM/DD/YYYY').isValid()) {
          return 'Date of Service is not valid';
        }
      }
      return true;
    },
  }],
  incomeEndDate3: [{
    isValid: (input, err, opt, formData) => {
      if (formData.isAdditionalIncomeOpen1 && (formData.additionalSourceOfIncome1 === 3)) {
        if (!input) {
          return 'The input field is required';
        }

        if (numberUnmask(input).length < 8) {
          return 'Date of Service is not valid';
        }

        if (!moment(input, 'MM/DD/YYYY').isValid()) {
          return 'Date of Service is not valid';
        }
      }
      return true;
    },
  }],
  payFrequency1: [{
    rule: 'required',
    isValid: input => !!input || 'The input field is required',
  }],
  payFrequency2: [{
    isValid: (input, err, opt, formData) => {
      if (formData.isAdditionalIncomeOpen) {
        if (!input) {
          return 'The input field is required';
        }
      }
      return true;
    },
  }],
  payFrequency3: [{
    isValid: (input, err, opt, formData) => {
      if (formData.isAdditionalIncomeOpen1) {
        if (!input) {
          return 'The input field is required';
        }
      }
      return true;
    },
  }],
  bankAccountFirstName: [{
    isValid: (input, err, opt, formData) => {
      if (!input && (formData.bankAccountLastName || formData.routingNumber || formData.bankAccountNumber)) {
        return 'The input field is required';
      }
      return true;
    },
  }],
  bankAccountLastName: [{
    isValid: (input, err, opt, formData) => {
      if (!input && (formData.bankAccountFirstName || formData.routingNumber || formData.bankAccountNumber)) {
        return 'The input field is required';
      }
      return true;
    },
  }],
  routingNumber: [{
    isValid: (input, err, opt, formData) => {
      if (!input && (formData.bankAccountFirstName || formData.bankAccountLastName || formData.bankAccountNumber)) {
        return 'The input field is required';
      }

      if (!input && !formData.bankAccountFirstName && !formData.bankAccountLastName && !formData.bankAccountNumber) {
        return true;
      }

      if (`${input}`.replace('_', '').length < 9) {
        return 'Routing Number is not valid';
      }

      return /^(\d)\1+$/.test(input) ? 'Routing Number is not valid' : true;
    },
  }],
  bankAccountNumber: [{
    isValid: (input, err, opt, formData) => {
      if (!input && (formData.bankAccountFirstName || formData.bankAccountLastName || formData.routingNumber)) {
        return 'The input field is required';
      }

      return /^(\d)\1+$/.test(input) ? 'Account Number is not valid' : true;
    },
  }],
};
