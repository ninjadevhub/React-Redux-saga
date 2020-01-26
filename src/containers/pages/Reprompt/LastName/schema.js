import { removeSpace } from 'utils/masks';

export default {
  lastName: [{
    rule: 'required',
    isValid: (input) => {
      if (!input || removeSpace(input).length === 0) {
        return 'The input field is required';
      }
      return true;
    },
  }],
};
