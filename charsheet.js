/**
 * This module handles about charsheet.
 */

const nedb = require('nedb-promise');
const request = require('request-promise');

const arts_mapping = require('./arts_mapping.json');
const np_mapping = require('./np_mapping.json');


const cache_char_sheet = {};
const db_char_sheet = new nedb({ filename: '.data/char_sheet.db', autoload: true });


/**
 * It obtains a charsheet from 'https://charasheet.vampire-blood.net/'.
 * @param user_id the userId who owns the charsheet.
 * @return the charsheet object.
 */
const requestCharsheet = async (char_id) => {
  const options = {
    url: 'https://charasheet.vampire-blood.net/' + char_id + '.js',
    method: 'GET',
    json: true,
  };

  const char_sheet = await request(options);
  if (!isCharsheetValid(char_sheet)) {
    console.log(JSON.stringify(char_sheet));
    throw new Error('char_sheet is not valid.');
  }

  return char_sheet;
};


/**
 * Obtain the value of the arts.
 * When a roll is lower than the value, the character does the arts successfully.
 * @param arts_key the arts to get a value
 * @param char_sheet the charsheet to refer
 * @return value of the arts of the character
 */
const getArtsValue = (arts_key, char_sheet) => {
  if (char_sheet == null) {
    throw new Error('null reference exception: char_sheet');
  }

  if (arts_key == null) {
    throw new Error('null reference exception: arts_key');
  }

  if (!isArtsValid(arts_key)) {
    throw new Error(`the arts is not valid. arts_key=${arts_key}`);
  }

  if (!isCharsheetValid(char_sheet)) {
    throw new Error('the char_sheet is not valid');
  }

  const arts_obj = arts_mapping[arts_key];
  return char_sheet[arts_obj.kind][arts_obj.index];
}


/**
 * Checks if the arts is valid.
 * @param arts_key the arts to check
 * @return true, if the arts is valid.
 */
const isArtsValid = (arts_key) => {
  if (arts_key == null) {
    throw new Error('null reference exception: arts_key');
  }

  return arts_mapping[arts_key] != null;
};


/**
 * Obtain the value of the ability.
 * When a roll is lower than the value, the character shows the ability successfully.
 * @param ability_key the key of the the ability
 * @param char_sheet the charsheet to refer
 * @return value of the ability of the character
 */
const getAbilityValue = (ability_key, char_sheet) => {
  if (ability_key == null) {
    throw new Error('null reference exception: ability_key');
  }

  if (char_sheet == null) {
    throw new Error('null reference exception: char_sheet');
  }

  if (!isAbilityValid(ability_key)) {
    throw new Error(`the ability is not valid. ability_key=${ability_key}`);
  }

  if (!isCharsheetValid(char_sheet)) {
    throw new Error(`the charsheet is not valid.`);
  }

  const np_key = np_mapping[ability_key];
  return char_sheet[np_key];
};


/**
 * Checks if the ability is valid.
 * @param ability_key
 * @return true if the ability is valid
 */
const isAbilityValid = (ability_key) => {
  if (ability_key == null) {
    throw new Error('null reference exception: ability_key');
  }

  return np_mapping[ability_key] != null;
};


/**
 * It stores a charsheet in DB.
 * @param user_id the userId who owns the charsheet
 * @param char_id an id of the charsheet
 */
const storeCharSheet = async (user_id, char_id) => {
  cache_char_sheet[user_id] = null;
  db_char_sheet.update(
      { user_id: user_id },
      { user_id: user_id, char_id: char_id },
      { upsert: true }
  );
};


/**
 * It loads a charsheet from DB.
 * It throws an error when the charsheet is not in DB.
 * @param user_id the userId who owns the charsheet.
 * @return the charsheet object
 */
const loadCharSheet = async (user_id) => {
  const cache = cache_char_sheet[user_id];
  if (cache != null) {
    return cache;
  }

  const obj = await db_char_sheet.findOne({ user_id: user_id });
  if (obj == null) {
    throw new Error('the given user_id is not in the database. id=' + user_id);
  }

  const char_id = obj.char_id;
  const char_sheet = await requestCharsheet(char_id);
  cache_char_sheet[user_id] = char_sheet;
  return char_sheet;
};


/**
 * It verifies if the charsheet is valid.
 * @param charsheet the charsheet to verify
 * @return true if the charsheet is valid
 */
const isCharsheetValid = (char_sheet) => {
  if (char_sheet == null) {
    throw new Error('char_sheet is null');
  }

  return isCoc(char_sheet) && hasArts(char_sheet) && hasAbility(char_sheet);
};

const isCoc = (char_sheet) => {
  return char_sheet['game'] == 'coc';
};

const hasArts = (char_sheet) => {
  for (let [name, arts_obj] of Object.entries(arts_mapping)) {
    const kinds = char_sheet[arts_obj.kind];
    if (kinds == null) {
      console.log(`kind is not found. name=${char_sheet.pc_name}, arts=${name}, kind=${arts_obj.kind}`);
      return false;
    }

    const arts_value = kinds[arts_obj.index];
    if (arts_value == null) {
      console.log(`arts_value is not found. name=${char_sheet.pc_name}, arts=${name}, kind=${arts_obj.kind}, index=${arts_obj.index}`);
      return false;
    }
  }

  return true;
};

const hasAbility = (char_sheet) => {
  for (let [name, key] of Object.entries(np_mapping)) {
    const ability_value = char_sheet[key];
    if (ability_value == null) {
      console.error(`ability_value is not found. ability=${name}, arts_key=${key}`);
      return false;
    }
  }

  return true
};


module.exports =
  { getArtsValue
  , getAbilityValue
  , isAbilityValid
  , isArtsValid
  , isCharsheetValid
  , loadCharSheet
  , requestCharsheet
  , storeCharSheet
  };
