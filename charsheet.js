/**
 * This module handles about charsheet.
 */

const nedb = require('nedb-promise');
const request = require('request-promise');


const cache_char_sheet = {};
const db_char_sheet = new nedb({ filename: '.data/char_sheet.db', autoload: true });


/**
 * It obtains a charsheet from 'https://charasheet.vampire-blood.net/'.
 * @param user_id the userId who owns the charsheet.
 * @return the charsheet object.
 */
const requestCharSheet = async (char_id) => {
  const options = {
    url: 'https://charasheet.vampire-blood.net/' + char_id + '.js',
    method: 'GET',
    json: true,
  };
  return request(options);
};


/**
 * It stores a charsheet in DB.
 * @param user_id the userId who owns the charsheet
 * @param char_id an id of the charsheet
 */
const storeCharSheet = async (user_id, char_id) => {
  cache_char_sheet[user_id] = null;
  db_char_sheet.insert({ user_id: user_id, char_id: char_id });
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
  const char_sheet = await requestCharSheet(char_id);
  cache_char_sheet[user_id] = char_sheet;
  return char_sheet;
};


/**
 * It verifies if the charsheet is valid.
 * @param charsheet the charsheet to verify
 * @return true if the charsheet is valid
 */
const verifyCharSheet = (charsheet) => {
  return true;
};


module.exports =
  { loadCharSheet
  , requestCharSheet
  , storeCharSheet
  , verifyCharSheet
  };
