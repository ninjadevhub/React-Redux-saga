import createNumberMask from 'text-mask-addons/dist/createNumberMask';

export const currencyMask = createNumberMask({
  prefix: '$ ',
  allowDecimal: true,
  integerLimit: 10,
});

export const confirmAmountOfSaleMask = createNumberMask({
  prefix: '$ ',
  allowDecimal: true,
  integerLimit: 5,
  maxValue: 100,
  minValue: 0,
});

export const numberMask = createNumberMask({
  prefix: '',
  thousandsSeparatorSymbol: '',
  allowLeadingZeroes: true,
});

export function unmask(val) {
  return val.replace(/[$, ]+/g, '');
}

export function numberUnmask(val) {
  return val.match(/\d+/g).join('');
}

export function floatUnmask(val) {
  const numbers = val.match(/[\d.]+/g);
  return numbers ? numbers.join('') : 0;
}

export function removeSpace(str) {
  return str.replace(/\s+/g, '');
}

export function removeUnderline(str) {
  return str.replace(/_+/g, '');
}

export function unmaskCurrency(val) {
  return val.replace(/[$, ]+/g, '');
}
