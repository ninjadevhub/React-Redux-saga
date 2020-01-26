export default {
  businessName: ['required'],
  dba: ['required'],

  'businessAddresses.address2': ['required'],
  'businessAddresses.city': ['required'],
  'businessAddresses.state': ['required'],
  'businessAddresses.zipCode': ['required'],
  'businessAddresses.type': ['required'],
  productsOrServices: ['required'],
  federalTaxIdOrSSN: ['required'],

  'contacts.firstName': ['required'],
  'contacts.lastName': ['required'],
  'contacts.title': ['required'],
  'contacts.email': ['required', 'email'],
  'contacts.phoneNumber': ['required'],
  'contacts.phoneExt': ['required'],

  'principalOwner.firstName': ['required'],
  'principalOwner.lastName': ['required'],
  'principalOwner.address.address2': ['required'],
  'principalOwner.address.city': ['required'],
  'principalOwner.address.state': ['required'],
  'principalOwner.address.zipCode': ['required'],
  termsAndConditions: [
    'required',
    {
      isValid: input => (
        input || 'The custom field is not valid'
      ),
    },
  ],
  'signatureBy.name': ['required'],
  'submittedBy.title': ['required'],
};
