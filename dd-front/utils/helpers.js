export const isServer = typeof window === 'undefined';

export const parseCookie = (name, cookie = '') => {
  const part = decodeURIComponent(cookie)
    .split('; ')
    .find(part => {
      return part.split('=')[0] === name;
    });

  return part ? part.split('=')[1] : '';
};

export const debounce = (f, ms) => {
  let timer = null;

  return (...args) => {
    const execute = () => {
      f(...args);
      timer = null;
    };

    if (timer) clearTimeout(timer);
    timer = setTimeout(execute, ms);
  };
};
