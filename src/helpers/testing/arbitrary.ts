import * as jsc from 'jsverify';

const getRandomString = (length: number, chars: string) => {
  const result = '';
  for (let i = length; i > 0; --i) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
};

export const arbLatSymbols = jsc.bless({
  generator: function () {
    const stringLength = jsc.random(1, 30);

    return getRandomString(stringLength, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
  }
});
