/**
 * This module handles main functions on Charlotte.
 */

const charsheet = require('./charsheet');


/**
 * Registers a character
 * @param char_id the id of the character
 * @param user_id the id of the user
 * @return text for a response
 */
const registerChar = async (char_id, user_id) => {
  if (char_id === null) {
    throw new Error('char_id is null');
  }

  if (user_id === null) {
    throw new Error('char_id is null');
  }

  if (char_id == '') {
    return 'キャラシIDを指定してください。キャラシIDはキャラクター保管庫で確認できます。\n/char-register キャラシID';
  }

  try {
    const char_sheet = await charsheet.requestCharSheet(char_id);
    await charsheet.storeCharSheet(user_id, char_id);
    return char_sheet.pc_name + ' のキャラシを登録しました！';
  } catch (e) {
    console.log(e.message);
    return `キャラシの登録に失敗しました。\nキャラシIDを確認してください。(ID=${char_id })`;
  }
};


module.exports =
  { registerChar
  };
