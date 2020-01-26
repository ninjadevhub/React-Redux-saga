import dateFns from 'date-fns';

export const getCurrentDate = () => dateFns.format(new Date(), 'M/DD/YYYY');
export const formatCurrency = (x, decimalCount) => Number.parseFloat(x).toFixed(decimalCount).replace(/\d(?=(\d{3})+\.)/g, '$&,');
export const maskBankInformation = (val = '') => (val.length <= 4 ? val : `${val.substring(0, val.length - 4).replace(/[a-z\d]/gi, 'X')}${val.substring(val.length - 4, val.length)}`);
