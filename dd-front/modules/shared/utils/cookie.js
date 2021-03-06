export const parseCookie = (name, cookie = '') => {
  const part = decodeURIComponent(cookie)
    .split('; ')
    .find(part => {
      return part.split('=')[0] === name;
    });

  return part ? part.split('=')[1] : '';
};
