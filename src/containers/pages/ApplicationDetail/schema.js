// import isValid from 'date-fns/is_valid';
export default {
  requestedAmount: ['required'],
  serviceAmount: ['required'],
  firstName: ['required'],
  lastName: ['required'],
  stateOfResidence: ['required'],
  email: ['required', 'email'],
  phoneNumber: ['required'],
  hasApplicationConsented: ['required'],
};
