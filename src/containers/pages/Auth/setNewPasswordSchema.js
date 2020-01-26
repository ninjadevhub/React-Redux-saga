export default {
  temporaryPassword: ['required'],
  newPassword: ['required'],
  confirmPassword: [
    {
      rule: 'isEqual',
      option: {
        match: 'newPassword',
      },
      error: 'Password confirmation should match the password',
    },
  ],
};
