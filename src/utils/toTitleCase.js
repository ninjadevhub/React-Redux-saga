export function toTitleCase(str) {
  let i;
  let j;
  const lowers = ['A', 'An', 'The', 'And', 'But', 'Or', 'For', 'Nor', 'As', 'At', 'By', 'For', 'From', 'In', 'Into', 'Near', 'Of', 'On', 'Onto', 'To', 'With'];
  const uppers = ['Llc', 'Dba', 'Dds', 'Dmd', 'Ltd', 'Md', 'Pllc', 'Psc', 'Ms', 'Pc', 'Ii', 'IIi', 'Iv', 'V', 'Vi', 'Vii', 'Viii', 'Ix', 'X', 'Apc', 'Llp', 'Facx', 'Pa', 'Do', 'Inc'];
  const specialWords = ['Mcdonalds'];
  const specialChars = ['&', '~'];

  // eslint-disable-next-line
  str = str.replace(/([^\W_]+[^\s-]*) */g, txt => (txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()));

  for (i = 0, j = lowers.length; i < j; i++) {
    // eslint-disable-next-line
    str = str.replace(
      new RegExp(`\\s${lowers[i]}\\s`, 'g'),
      txt => (txt.toLowerCase())
    );
  }

  for (i = 0, j = uppers.length; i < j; i++) {
    // eslint-disable-next-line
    str = str.replace(
      new RegExp(`(<=\\s|\\b)${uppers[i]}(?=[]\\b|\\s|$)`, 'g'),
      txt => txt.toUpperCase()
    );
  }

  for (i = 0, j = specialChars.length; i < j; i++) {
    if (specialChars[i] === '&') {
      // eslint-disable-next-line
      str = str.replace(
        // eslint-disable-next-line
        /(^\w{1}|\&\s*\w{1})/gi,
        txt => txt.toUpperCase()
      );
    }

    if (specialChars[i] === '~') {
      // eslint-disable-next-line
      str = str.replace(
        // eslint-disable-next-line
        /(^\w{1}|\~\s*\w{1})/gi,
        txt => txt.toUpperCase()
      );
    }
  }

  for (i = 0, j = specialWords.length; i < j; i++) {
    // eslint-disable-next-line
    str = str.replace(
      new RegExp(specialWords[i], 'g'),
      (txt) => {
        if (txt.substr(0, 2) === 'Mc' && txt.length >= 2) {
          return txt.substr(0, 2) + txt.substr(2, (txt.length - 1)).toTitleCase();
        }
      }
    );
  }


  return str;
}
