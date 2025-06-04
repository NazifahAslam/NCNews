const db = require('../../db/connection');

function lookupObj(array, objKey, objValue) {
  if (
    array.length === 0 ||
    typeof objKey === 'undefined' ||
    typeof objValue === 'undefined'
  )
    return {};

  const newPairs = array.map((object) => {
    return [object[objKey], object[objValue]];
  });

  obj = Object.fromEntries(newPairs);

  return obj;
}

module.exports = lookupObj;
