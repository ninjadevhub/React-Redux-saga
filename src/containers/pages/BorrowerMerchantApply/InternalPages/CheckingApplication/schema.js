export default {
  isPersonReceivingService: [
    'required',
    {
      isValid: input => (
        input || 'The custom field is not valid'
      ),
    },
  ],
  hasApplicationConsented: [
    'required',
    {
      isValid: input => (
        input || 'The custom field is not valid'
      ),
    },
  ],

  'applicant.firstName': ['required'],
  'applicant.lastName': ['required'],
  'applicant.email': ['required', 'email'],
  'applicant.ssn': ['required'],
  'applicant.dateOfBirth': ['required'],
  'applicant.addresses.address': ['required'],
  'applicant.addresses.city': ['required'],
  'applicant.addresses.state': ['required'],
  'applicant.addresses.zipcode': ['required'],

  'applicant.phoneNumbers.Number': ['required'],

  'financials.stated.employmentStatus': ['required'],
  'financials.stated.employerName': ['required'],
  'financials.stated.employerPhone': ['required'],
  'financials.stated.employmentYears': ['required'],
  'financials.stated.grossMonthlyIncome': ['required'],
  'financials.stated.monthlyRentOrMortage': ['required'],
  'financials.stated.rentOrOwn': ['required'],
  'signatureBy.name': ['required'],
};
