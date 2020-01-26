export function validateEmail(email) {
  // eslint-disable-next-line
  return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email));
}
