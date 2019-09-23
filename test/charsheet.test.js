const expect = require('expect');

const charsheet = require('../charsheet');

const range = n => [...Array(n).keys()];

const charsheetMock = {
  'game': 'coc',
  'TBAP': range(12).map(e => e.toString()),
  'TFAP': range(12).map(e => e.toString()),
  'TAAP': range(11).map(e => e.toString()),
  'TCAP': range(5).map(e => e.toString()),
  'TKAP': range(18).map(e => e.toString()),
  'NP1': '0',
  'NP2': '1',
  'NP3': '2',
  'NP4': '3',
  'NP5': '4',
  'NP6': '5',
  'NP7': '6',
  'NP8': '7',
  'NP9': '8',
  'NP10': '9',
  'NP11': '10',
  'NP12': '11',
  'NP13': '12',
  'NP14': '13',
};

describe('charsheet', () => {
  describe('#getArtsValue', () => {
    it('returns the value of the arts', () => {
      const result = charsheet.getArtsValue('目星', charsheetMock);
      expect(result).toBe('11');
    });

    it('throws for unknown arts', () => {
      expect(() => {
        charsheet.getArtsValue('ああ', charsheetMock);
      }).toThrow(/the arts is not valid.*/);
    });

    it('throws for an invalid charsheet', () => {
      expect(() => {
        charsheet.getArtsValue('目星', {});
      }).toThrow(/the char_sheet is not valid.*/);
    });

    it('throws for empty arts', () => {
      expect(() => {
        charsheet.getArtsValue('', charsheetMock);
      }).toThrow(/the arts is not valid.*/);
    });

    it('throws null reference error for an imcomplete argument1', () => {
      expect(() => {
        charsheet.getArtsValue('目星');
      }).toThrow(/null reference exception.*/);
    });

    it('throws for an imcomplete argument2', () => {
      expect(() => {
        charsheet.getArtsValue();
      }).toThrow(/null reference exception.*/);
    });

    it('throws null reference error for a null arts_key', () => {
      expect(() => {
        charsheet.getArtsValue(null, charsheetMock);
      }).toThrow(/null reference exception.*/);
    });

    it('throws null reference error for a null charsheet', () => {
      expect(() => {
        charsheet.getArtsValue('目星', null);
      }).toThrow(/null reference exception.*/);
    });
  });

  describe('#isArtsValid', () => {
    it('returns true for existent arts', () => {
      const result = charsheet.isArtsValid('目星');
      expect(result).toBe(true);
    });

    it('returns false for unknown arts', () => {
      const result = charsheet.isArtsValid('あああ');
      expect(result).toBe(false);
    });

    it('returns false for an empty string', () => {
      const result = charsheet.isArtsValid('');
      expect(result).toBe(false);
    });

    it('throws null reference error for null', () => {
      expect(() => {
        charsheet.isArtsValid(null);
      }).toThrow(/null reference exception:.*/);
    });

    it('throws null reference error for no arguments', () => {
      expect(() => {
        charsheet.isArtsValid();
      }).toThrow(/null reference exception:.*/);
    });
  });

  describe('#getAbilityValue', () => {
    it('returns the value of the ability', () => {
      const result = charsheet.getAbilityValue('幸運', charsheetMock);
      expect(result).toBe('12');
    });

    it('throws for an unknown ability', () => {
      expect(() => {
        charsheet.getAbilityValue('あああ', charsheetMock);
      }).toThrow(/the ability is not valid.*/);
    });

    it('throws for an empty ability', () => {
      expect(() => {
        charsheet.getAbilityValue('', charsheetMock);
      }).toThrow(/the ability is not valid.*/);
    });

    it('throws for an invalid charsheet', () => {
      expect(() => {
        charsheet.getAbilityValue('幸運', {});
      }).toThrow(/the charsheet is not valid.*/);
    });

    it('throws null reference error for an imcomplete argument1', () => {
      expect(() => {
        charsheet.getAbilityValue('幸運');
      }).toThrow(/null reference exception.*/);
    });

    it('throws null reference error for an imcomplete argument2', () => {
      expect(() => {
        charsheet.getAbilityValue();
      }).toThrow(/null reference exception.*/);
    });

    it('throws null reference error for a null ability_key', () => {
      expect(() => {
        charsheet.getAbilityValue(null, charsheetMock);
      }).toThrow(/null reference exception.*/);
    });

    it('throws null reference error for a null charsheet', () => {
      expect(() => {
        charsheet.getAbilityValue('幸運', null);
      }).toThrow(/null reference exception.*/);
    });
  });

  describe('#isAbilityValid', () => {
    it('returns true for existent arts', () => {
      const result = charsheet.isAbilityValid('幸運');
      expect(result).toBe(true);
    });

    it('returns false for unknown arts', () => {
      const result = charsheet.isAbilityValid('あああ');
      expect(result).toBe(false);
    });

    it('returns false for an empty string', () => {
      const result = charsheet.isAbilityValid('');
      expect(result).toBe(false);
    });

    it('throws null reference error for null', () => {
      expect(() => {
        charsheet.isAbilityValid(null);
      }).toThrow(/null reference exception:.*/);
    });

    it('throws null reference error for no arguments', () => {
      expect(() => {
        charsheet.isAbilityValid();
      }).toThrow(/null reference exception:.*/);
    });
  });

  describe('#isCharsheetValid', () => {
    it('returns true for the valid character sheet', () => {
      const result = charsheet.isCharsheetValid(charsheetMock);
      expect(result).toBe(true);
    });

    it('returns false when the game is not coc', () => {
      const copy = Object.assign({}, charsheetMock);
      copy['game'] = 'aaa';
      const result = charsheet.isCharsheetValid(copy);
      expect(result).toBe(false);
    });

    it('returns false when it lacks some kinds of arts', () => {
      const copy = Object.assign({}, charsheetMock);
      copy['TBAP'] = undefined;
      const result = charsheet.isCharsheetValid(copy);
      expect(result).toBe(false);
    });

    it('returns false when some kinds lack arts_value', () => {
      const copy = Object.assign({}, charsheetMock);
      copy['TBAP'] = [];
      const result = charsheet.isCharsheetValid(copy);
      expect(result).toBe(false);
    });

    it('returns false when it lacks some ability', () => {
      const copy = Object.assign({}, charsheetMock);
      copy['NP1'] = undefined;
      const result = charsheet.isCharsheetValid(copy);
      expect(result).toBe(false);
    });
  });
});
