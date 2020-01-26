export default {
  verificationCode: [{
    rule: 'required',
    error: 'Verification code is required',
  }],
  newPassword: [{
    rule: 'required',
    error: 'New password is required',
  }],
  confirmPassword: [
    {
      rule: 'isEqual',
      option: {
        match: 'newPassword',
      },
      error: 'Password should match',
    },
  ],
};
