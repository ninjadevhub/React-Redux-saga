export default {
  requestedAmount: ['required', 'integer'],
  purpose: ['required'],
  'channel.attributes.serviceProvider.name': ['string'],
  isSelfSubmitted: [
    'required',
    {
      isValid: input => (
        input || 'The custom field is not valid'
      ),
    },
  ],
  hasApplicationConsented: ['required'],

  'applicant.firstName': ['required'],
  'applicant.lastName': ['required'],
  'applicant.email': ['required', 'email'],
  'applicant.ssn': ['required'],
  'applicant.dateOfBirth': ['required'],
  'applicant.addresses.address1': ['required'],
  'applicant.addresses.city': ['required'],
  'applicant.addresses.state': ['required'],
  'applicant.addresses.zipcode': ['required'],

  'applicant.phoneNumbers.Number': ['required'],

  'financials.stated.employmentStatus': ['required'],
  'financials.stated.employerName': ['required', 'string'],
  'financials.stated.employerPhone': ['required'],
  'financials.stated.employmentYears': ['required'],
  'financials.stated.grossMonthlyIncome': ['required'],
  'financials.stated.monthlyRentOrMortage': ['required'],
  'financials.stated.rentOrOwn': ['required'],
  'signatureBy.name': ['required'],
};
