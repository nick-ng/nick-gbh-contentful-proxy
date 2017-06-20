const badNumbers = [
  '69',
  '666',
  '6969',
  '80085',
];

const xingkaiParseInt = (a) => a - 0;

const objectIndexer = (id = 'id') => (a) => Object.keys(a).reduce((prev, curr) => Object.assign({}, prev, { [a[curr][id]]: a[curr] }), {});

const calcKeyLength = (numberOfKeys) => Math.max(Math.floor(Math.log10(numberOfKeys * 2)) + 1, 2);

const randomString = (strLength, charSet = '0123456789') => {
  const result = [];
  while (result.length < (strLength || 5)) {
    result.push(charSet.charAt(Math.floor(Math.random() * charSet.length)));
  }
  return result.join('');
};

const generateNewKey = (keyList) => {
  let keyLength = calcKeyLength(keyList.length);
  const usedList = keyList.concat(badNumbers);
  for (;;) {
    for (let i = 0; i < 10 ** keyLength; i += 1) {
      const newKey = randomString(keyLength).toLowerCase();
      if (!usedList.includes(newKey)) return newKey;
    }
    keyLength += 1;
  }
};

module.exports = {
  xingkaiParseInt,
  objectIndexer,
  calcKeyLength,
  randomString,
  generateNewKey,
};
