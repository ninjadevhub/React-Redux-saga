import { removeSpace, floatUnmask } from 'utils/masks';

export default {
  refundAmount: [{
    rule: 'required',
    isValid: (input, err, opt, formData) => {
      if (!input) {
        return 'The input field is required';
      }

      if (parseFloat(floatUnmask(input)) > formData.currentAmountFinanced) {
        return 'Refund requested amount can not be greather than amount financed.';
      }

      return true;
    },
    error: 'The input field is required',
  }],
  reasonForRefund: [{
    rule: 'required',
    error: 'You must include a reason for a refund request',
  }],
  signature: [{
    rule: 'required',
    isValid: (input) => {
      const removed = removeSpace(input);
      if (!input || removed.length === 0) {
        return 'The input field is required';
      }
      const letters = /^[A-Za-z\-']+$/;
      if (!removed.match(letters)) {
        return 'Invalid input. Only alphabets, dash and apostrophies are accepted';
      }
    },
  }],
};
