/* ********************************************************
 * This project is remixed from [slack-blockkit](https://glitch.com/slash-blockkit).
 * ********************************************************/

const express = require('express');
const bodyParser = require('body-parser');

const charlotte = require('./charlotte');
const charsheet = require('./charsheet');
const utils = require('./utils');
const signature = require('./verifySignature');

const mapping_kanji = require('./mapping_kanji.json');

const app = express();


const rawBodyBuffer = (req, res, buf, encoding) => {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || 'utf8');
  }
};

app.use(bodyParser.urlencoded({verify: rawBodyBuffer, extended: true }));
app.use(bodyParser.json({ verify: rawBodyBuffer }));

const server = app.listen(process.env.PORT || 5000, () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});


/*
 * Slash Command Endpoint to receive a payload 
 */

app.post('/char-register', async (req, res) => {
  if (!signature.isVerified(req)) {
    res.sendStatus(403);
    return;
  }

  // console.log(JSON.stringify(req.body));
  const char_id = req.body.text;
  const user_id = req.body.user_id;
  const text = await charlotte.registerChar(char_id, user_id);
  res.json(toMessage(text));
});

app.post('/char-arts', async (req, res) => {
  if(!signature.isVerified(req)) {
    res.sendStatus(403);
    return;
  }

  const user_id = req.body.user_id;
  const arts_key = req.body.text;

  try {
    const char_sheet = await charsheet.loadCharSheet(user_id)
    if (char_sheet == null) {
      const text =  'キャラシが見つかりません\n/char-registerを使ってキャラシを登録してください';
      res.json(toMessage(text));
      return;
    }

    if (arts_key == '') {
      const text = '技能を指定してください。\n/char-arts 目星';
      res.json(toMessage(text));
      return;
    }

    const arts_obj = mapping_kanji[arts_key];
    if (arts_obj == null) {
      const text = `指定技能「${arts_key}」が見つかりません。`;
      res.json(toMessage(text));
      return;
    }

    const arts_value = char_sheet[arts_obj.kind][arts_obj.index];
    const pc_name = char_sheet.pc_name;

    const critical = 'クリティカル！ ';
    const fumble = 'ファンブル！ ';
    const success = '成功';
    const failure = '失敗';
    const result_roll = utils.roll1d100();
    const cof = 1 <= result_roll && result_roll <= 5
        ? critical
        : 96 <= result_roll && result_roll <= 100
          ? fumble
          : '';
    const sof = result_roll <= arts_value ? success : failure;
    const text = `${cof}${pc_name}は${arts_key}を${sof}させました。出目: ${result_roll}, 目標値: ${arts_value}`;
    res.json(toMessage(text));
  } catch (e) {
    console.log(e.message);
  }
});

app.post('/char-export', async (req, res) => {
  if(!signature.isVerified(req)) {
    res.sendStatus(403);
    return;
  }

  const user_id = req.body.user_id;

  const char_sheet = await charsheet.loadCharSheet(user_id);
  if (char_sheet == null) {
    const text = 'キャラシが登録されていません。';
    res.json(toMessage(text));
    return;
  }

  const text = JSON.stringify(char_sheet);
  res.json(toMessage(text));
});


const toMessage = (text) => {
  return {
    response_type: 'in_channel',
    text: text,
  };
};
