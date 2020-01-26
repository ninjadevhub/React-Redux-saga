export default {
  electronicDisclaimer: [{
    rule: 'required',
    isValid: input => input || 'The custom field is not valid',
  }],
  telephoneContact: [{
    rule: 'required',
    isValid: input => input || 'The custom field is not valid',
  }],
  creditReportDisclaimer: [{
    rule: 'required',
    isValid: input => input || 'The custom field is not valid',
  }],
  privacyPolicyDisclaimer: [{
    rule: 'required',
    isValid: input => input || 'The custom field is not valid',
  }],
  activeDutyMilitary: [{
    rule: 'required',
    isValid: input => (input !== undefined) || 'The custom field is not valid',
  }],
  tcpaDisclosure: [{
    rule: 'required',
    isValid: input => input || 'The custom field is not valid',
  }],
};
