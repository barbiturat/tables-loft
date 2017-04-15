import * as jsc from 'jsverify';

const getRandomString = (length: number, chars: string) => {
  let result = '';
  for (let i = length; i > 0; --i) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
};

export const alphanumericSymbolsArb = (maxLength: number, additionalSymbols = '') => jsc.bless<string>({
  generator: jsc.generator.bless(() => {
      const stringLength = jsc.random(1, maxLength);

      return getRandomString(stringLength, `0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ${additionalSymbols}`);
    }
  ),
  show: (val) => val,
  shrink: jsc.shrink.noop
});
