/**
 * This module handles main functions on Charlotte.
 */

const charsheet = require('./charsheet');
const utils = require('./utils');


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
    const char_sheet = await charsheet.requestCharsheet(char_id);
    await charsheet.storeCharSheet(user_id, char_id);
    return char_sheet.pc_name + ' のキャラシを登録しました！';
  } catch (e) {
    console.error(e.message);
    return `キャラシの登録に失敗しました。\nキャラシIDを確認してください。(ID=${char_id})`;
  }
};


const CriFum = {
  NONE: 0,
  CRITICAL: 1,
  FUMBLE: 2,

  test: dotsOfDie => {
    if (1 <= dotsOfDie && dotsOfDie <= 5) {
      return CriFum.CRITICAL;
    } else if (96 <= dotsOfDie && dotsOfDie <= 100) {
      return CriFum.FUMBLE;
    }
    return CriFum.NONE;
  },
};

const getRollResultMessage = (result_roll, pc_name, key, value) => {
  const crifums = ['', 'クリティカル！ ',  'ファンブル！ '];
  const cof = crifums[CriFum.test(result_roll)];
  const success = '成功';
  const failure = '失敗';
  const sof = result_roll <= value ? success : failure;
  return `${cof}${pc_name}は${key}を${sof}させました。出目: ${result_roll}, 目標値: ${value}`;
};

/**
 * Rolls dice and try to do arts
 * @param arts_key the key of the arts
 * @param user_id the user to try arts
 * @return text for a response
 */
const doArts = async (arts_key, user_id) => {
  if (user_id == null) {
    throw new Error('null reference exception: char_id');
  }

  if (arts_key == null) {
    throw new Error('null reference exception: arts_key');
  }

  if (arts_key == '') {
    return '技能を指定してください。\n/char-arts 目星';
  }

  if (!charsheet.isArtsValid(arts_key)) {
    return `指定技能「${arts_key}」が見つかりません。`;
  }

  const char_sheet = await charsheet.loadCharSheet(user_id);
  if (char_sheet == null) {
    return 'キャラシが見つかりません\n/char-registerを使ってキャラシを登録してください';
  }

  const result_roll = utils.roll1d100();
  const arts_value = charsheet.getArtsValue(arts_key, char_sheet);
  return getRollResultMessage(result_roll, char_sheet.pc_name, arts_key, arts_value);
};


/**
 * Rolls dice and checks if the ability is given successfully.
 * @param ability_key the key of the ability
 * @param user_id the id of the user
 */
const rollAbility = async (ability_key, user_id) => {
  if (ability_key == null) {
    throw new Error('null reference exception: ability_key');
  }

  if (user_id == null) {
    throw new Error('null reference exception: user_id');
  }

  if (!charsheet.isAbilityValid(ability_key)) {
    return `指定能力「${ability_key}」が見つかりません。`;
  }

  const char_sheet = await charsheet.loadCharSheet(user_id);
  if (char_sheet == null) {
    return 'キャラシが見つかりません\n/char-registerを使ってキャラシを登録してください';
  }

  const result_roll = utils.roll1d100();
  const ability_value = charsheet.getAbilityValue(ability_key, char_sheet);
  return getRollResultMessage(result_roll, char_sheet.pc_name, ability_key, ability_value);
};


/**
 * exprots information of the character
 * @param user_id the user who owns the character
 * @return text for a response
 */
const exportChar = async (user_id) => {
  if (user_id == null) {
    throw new Error('null reference exception: char_id');
  }

  const char_sheet = await charsheet.loadCharSheet(user_id);
  if (char_sheet == null) {
    return 'キャラシが登録されていません。';
  }

  return JSON.stringify(char_sheet);
};


module.exports =
  { exportChar
  , doArts
  , registerChar
  , rollAbility
  };
