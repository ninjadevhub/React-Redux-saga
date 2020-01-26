export default {
  oldPassword: [{
    rule: 'required',
    error: 'Old password is required',
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
