/**
 * Utilities.
 */

const mersennetwister = require('mersennetwister');


const mt = new mersennetwister(Date.now());


/**
 * rolls 1d100
 */
const roll1d100 = () => {
  return mt.int() % 100 + 1;
};

module.exports =
  { roll1d100
  }
