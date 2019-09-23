const expect = require('expect');

const utils = require('../utils');


describe('utils', () => {
  describe('#roll1d100', () => {
    it('always returns an integer value from 1 to 100', () => {
      const result = utils.roll1d100();
      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThan(101);
    });
  });
});

