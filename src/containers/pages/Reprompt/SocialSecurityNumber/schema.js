import { numberUnmask } from 'utils/masks';

export default {
  ssn: [
    {
      rule: 'required',
      isValid: (input) => {
        if (!input) {
          return 'The input field is required';
        }

        if (numberUnmask(input).length < 9) {
          return 'SSN is not valid';
        }

        const blockingSsns = [
          '078-05-1120',
          '219-09-9999',
          '111-11-1111',
          '222-22-2222',
          '333-33-3333',
          '444-44-4444',
          '555-55-5555',
          '666-66-6666',
          '777-77-7777',
          '888-88-8888',
          '999-99-9999',
          '123-45-6789',
        ];

        if (
          numberUnmask(input).substring(0, 3) === '000' ||
          numberUnmask(input).substring(3, 5) === '00' ||
          numberUnmask(input).substring(5, 9) === '0000' ||
          (Number(numberUnmask(input).substring(0, 3)) > 899 && Number(numberUnmask(input).substring(0, 3)) < 1000) ||
          blockingSsns.includes(input)

        ) {
          return 'SSN is not valid';
        }
      },
    },
  ],
};
